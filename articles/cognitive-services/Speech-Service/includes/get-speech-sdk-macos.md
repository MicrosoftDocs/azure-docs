---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 03/27/2020
ms.author: trbye
---

When developing for macOS, there are three Speech SDKs available.

- The Objective-C Speech SDK is available natively as a CocoaPod package
- The .NET Speech SDK could be used with **Xamarin.Mac** as it implements .NET Standard 2.0
- The Python Speech SDK is available as a PyPI module

> [!TIP]
> For details using the Objective-C Speech SDK with Swift, see <a href="https://developer.apple.com/documentation/swift/imported_c_and_objective-c_apis/importing_objective-c_into_swift" target="_blank">Importing Objective-C into Swift <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

### System requirements

- A macOS version 10.13 or later

# [Xcode](#tab/mac-xcode)

:::row:::
    :::column span="3":::
        The macOS CocoaPod package is available for download and use with the <a href="https://apps.apple.com/us/app/xcode/id497799835" target="_blank">Xcode 9.4.1 (or later) <span class="docon docon-navigate-external x-hidden-focus"></span></a> integrated development environment (IDE). First, <a href="https://aka.ms/csspeech/macosbinary" target="_blank">download the binary CocoaPod <span class="docon docon-navigate-external x-hidden-focus"></span></a>. Extract the pod in the same directory for its intended use, create a *Podfile* and list the `pod` as a `target`.
    :::column-end:::
    :::column:::
        <br>
        <div class="icon is-large">
            <img alt="Xcode" src="https://docs.microsoft.com/media/logos/logo_xcode.svg" width="60px">
        </div>
    :::column-end:::
:::row-end:::

```
platform :ios, '9.3'
use_frameworks!

target 'MyApp' do
  pod 'MicrosoftCognitiveServicesSpeech', '~> 1.12.1'
end
```

# [Xamarin.Mac](#tab/mac-xamarin)

:::row:::
    :::column span="3":::
        Xamarin.Mac exposes the complete macOS SDK for .NET developers to build native Mac applications using C#. For more information, see <a href="https://docs.microsoft.com/xamarin/mac/" target="_blank">Xamarin.Mac <span class="docon docon-navigate-external x-hidden-focus"></span></a>.
    :::column-end:::
    :::column:::
        <br>
        <div class="icon is-large">
            <img alt="Xamarin" src="https://docs.microsoft.com/media/logos/logo_xamarin.svg" width="60px">
        </div>
    :::column-end:::
:::row-end:::

[!INCLUDE [Get .NET Speech SDK](get-speech-sdk-dotnet.md)]

# [Python](#tab/mac-python)

[!INCLUDE [Get Python Speech SDK](get-speech-sdk-python.md)]

---

#### Additional resources

- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/objectivec/macos" target="_blank">macOS Speech SDK quickstart Objective-C source code <span class="docon docon-navigate-external x-hidden-focus"></span></a>
- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/swift/macos" target="_blank">macOS Speech SDK quickstart Swift source code <span class="docon docon-navigate-external x-hidden-focus"></span></a>