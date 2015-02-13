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
    void MakeObjectHash(const v8::FunctionCallbackInfo<v8::Value>& arguments) {
        v8::Isolate *isolate = v8::Isolate::GetCurrent();
        v8::HandleScope scope(isolate);
        if (arguments.IsConstructCall()) {
            isolate->ThrowException(v8::Exception::TypeError(v8::String::NewFromUtf8(isolate, "Invalid constructor")));
            return;
        }
        if (!arguments[0]->IsObject()) {
            isolate->ThrowException(v8::Exception::TypeError(v8::String::Concat(
                v8::String::NewFromUtf8(isolate, "Expected arguments[0] to be object, got "),
                arguments[0]->ToDetailString()
            )));
            return;
        }
        arguments.GetReturnValue().Set(arguments[0].As<v8::Object>()->GetIdentityHash());
    }
}

void hash_main(v8::Handle<v8::Object> exports) {
    v8::Isolate *isolate = v8::Isolate::GetCurrent();
    v8::HandleScope scope(isolate);
    v8::Local<v8::FunctionTemplate> tpl = v8::FunctionTemplate::New(isolate, MakeObjectHash);
    exports->Set(v8::String::NewFromUtf8(isolate, "objectHash"), tpl->GetFunction());
}

NODE_MODULE(native, hash_main);
