/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

#include <v8.h>
#include <node.h>
#include <type_traits>

#define THROW_EXCEPTION(T, ...) v8::ThrowException(v8::Exception::T(StringConcat(__VA_ARGS__)))
#define RETURN_THROW_EXCEPTION(T, ...) return scope.Close(THROW_EXCEPTION(T, __VA_ARGS__))

namespace {
    template<typename Last> inline v8::Handle<v8::String> StringConcat(Last last) {
        return last;
    }

    template<> inline v8::Handle<v8::String> StringConcat<const char*>(const char* text) {
        return v8::String::New(text);
    }

    template<> inline v8::Handle<v8::String> StringConcat<v8::Handle<v8::Value>>(v8::Handle<v8::Value> val) {
        if (val.IsEmpty()) {
            return v8::String::Empty();
        }
        return val->ToString();
    }

    template<> inline v8::Handle<v8::String> StringConcat<v8::Handle<v8::String>>(v8::Handle<v8::String> val) {
        if (val.IsEmpty()) {
            return v8::String::Empty();
        }
        return val;
    }

    template<typename First, typename ... Rest> inline v8::Handle<v8::String> StringConcat(First first, Rest ... rest) {
        return v8::String::Concat(StringConcat<First>(first), StringConcat<Rest...>(rest...));
    }

    v8::Handle<v8::Value> MakeObjectHash(const v8::Arguments& arguments) {
        v8::HandleScope scope;
        if (arguments.IsConstructCall()) {
            RETURN_THROW_EXCEPTION(TypeError, "Invalid constructor");
        }
        if (!arguments[0]->IsObject()) {
            RETURN_THROW_EXCEPTION(TypeError, "Expected arguments[0] to be object, got ", arguments[0]->ToDetailString());
        }
        return scope.Close(v8::Integer::New(arguments[0].As<v8::Object>()->GetIdentityHash()));
    }
}

void hash_main(v8::Handle<v8::Object> exports) {
    v8::HandleScope scope;
    v8::Local<v8::FunctionTemplate> tpl = v8::FunctionTemplate::New(MakeObjectHash);
    exports->Set(v8::String::NewSymbol("objectHash"), tpl->GetFunction(),
        static_cast<v8::PropertyAttribute>(v8::ReadOnly | v8::DontDelete));
}

NODE_MODULE(native, hash_main);
