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

namespace {
    v8::Handle<v8::Value> MakeObjectHash(const v8::Arguments& arguments) {
        v8::HandleScope scope;
        if (arguments.IsConstructCall()) {
            return scope.Close(v8::ThrowException(v8::Exception::TypeError(v8::String::New("Invalid constructor"))));
        }
        if (!arguments[0]->IsObject()) {
        return scope.Close(v8::ThrowException(v8::Exception::TypeError(v8::String::Concat(
            v8::String::New("Expected arguments[0] to be object, got "),
            arguments[0]->ToDetailString()
        ))));
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
