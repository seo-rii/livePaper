#include <napi.h>
#include <windows.h>

BOOL CALLBACK EnumWindowsProc(HWND hwnd, LPARAM lParam) {
    HWND p = FindWindowEx(hwnd, NULL, "SHELLDLL_DefView", NULL);
    HWND *ret = (HWND *)lParam;
    if (p) *ret = FindWindowEx(NULL, hwnd, "WorkerW", NULL);
    return true;
}

HWND get_wallpaper_window() {
    HWND progman = FindWindow("ProgMan", NULL);
    SendMessageTimeout(progman, 0x052C, 0, 0, SMTO_NORMAL, 1000, nullptr);
    HWND wallpaper_hwnd = nullptr;
    EnumWindows(EnumWindowsProc, (LPARAM)&wallpaper_hwnd);
    return wallpaper_hwnd;
}

Napi::Number hookWindow(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    try {
        HWND hWnd = (HWND) info[0].As<Napi::Number>().Int64Value();
        HWND hprog = get_wallpaper_window();
        SetParent(hWnd, hprog);
        return Napi::Number::New(env, (long long)hprog);
    } catch (const char *ex) {
        return Napi::Number::New(env, 0);
    }
}

Napi::Boolean unHookWindow(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    try {
        HWND hWnd = (HWND) info[0].As<Napi::Number>().Int64Value();
        SetParent(hWnd, 0);
        return Napi::Boolean::New(env, true);
    } catch (const char *ex) {
        return Napi::Boolean::New(env, false);
    }
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "hookWindow"), Napi::Function::New(env, hookWindow));
    exports.Set(Napi::String::New(env, "unHookWindow"), Napi::Function::New(env, unHookWindow));
    return exports;
}

NODE_API_MODULE(native, Init)
