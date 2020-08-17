---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 03/27/2020
ms.author: trbye
---

:::row:::
    :::column span="3":::
        When developing for iOS, there are two Speech SDKs available. The Objective-C Speech SDK is available natively as an iOS CocoaPod package. Alternatively, the .NET Speech SDK could be used with Xamarin.iOS as it implements .NET Standard 2.0.
    :::column-end:::
    :::column:::
        <br>
        <div class="icon is-large">
            <img alt="iOS" src="https://docs.microsoft.com/media/logos/logo_ios.svg" width="60px">
        </div>
    :::column-end:::
:::row-end:::

> [!TIP]
> For details using the Objective-C Speech SDK with Swift, see <a href="https://developer.apple.com/documentation/swift/imported_c_and_objective-c_apis/importing_objective-c_into_swift" target="_blank">Importing Objective-C into Swift <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

### System requirements

- A macOS version 10.3 or later
- Target iOS 9.3 or later

# [Xcode](#tab/ios-xcode)

:::row:::
    :::column span="3":::
        The iOS CocoaPod package is available for download and use with the <a href="https://apps.apple.com/us/app/xcode/id497799835" target="_blank">Xcode 9.4.1 (or later) <span class="docon docon-navigate-external x-hidden-focus"></span></a> integrated development environment (IDE). First, <a href="https://aka.ms/csspeech/iosbinary" target="_blank">download the binary CocoaPod <span class="docon docon-navigate-external x-hidden-focus"></span></a>. Extract the pod in the same directory for its intended use, create a *Podfile* and list the `pod` as a `target`.
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

target 'AppName' do
  pod 'MicrosoftCognitiveServicesSpeech', '~> 1.10.0'
end
```

# [Xamarin.iOS](#tab/ios-xamarin)

:::row:::
    :::column span="3":::
        Xamarin.iOS exposes the complete iOS SDK for .NET developers. Build fully native iOS apps using C# or F# in Visual Studio. For more information, see <a href="https://docs.microsoft.com/xamarin/ios/" target="_blank">Xamarin.iOS <span class="docon docon-navigate-external x-hidden-focus"></span></a>.
    :::column-end:::
    :::column:::
        <br>
        <div class="icon is-large">
            <img alt="Xamarin" src="https://docs.microsoft.com/media/logos/logo_xamarin.svg" width="60px">
            &nbsp; ❤️ &nbsp;
            <img alt="iOS" src="https://docs.microsoft.com/media/logos/logo_ios.svg" width="60px">
        </div>
    :::column-end:::
:::row-end:::

[!INCLUDE [Get .NET Speech SDK](get-speech-sdk-dotnet.md)]

---

#### Additional resources

- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/objectivec/ios" target="_blank">iOS Speech SDK quickstart Objective-C source code <span class="docon docon-navigate-external x-hidden-focus"></span></a>
- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/swift/ios" target="_blank">iOS Speech SDK quickstart Swift source code <span class="docon docon-navigate-external x-hidden-focus"></span></a>