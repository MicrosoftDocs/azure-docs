---
author: IEvangelist
ms.service: cognitive-services
ms.topic: include
ms.date: 03/27/2020
ms.author: dapine
---

When developing for iOS, there are two Speech SDKs available. The Objective-C Speech SDK is available natively as an iOS CocoaPod package, or the .NET Speech SDK could be used with **Xamarin.iOS** as it implements .NET Standard 2.0.

### System requirements

- A macOS machine with <a href="https://apps.apple.com/us/app/xcode/id497799835?mt=12" target="_blank">Xcode <span class="docon docon-navigate-external x-hidden-focus"></span></a> 9.4.1 or later
- Target iOS 9.3 or later

# [Xcode](#tab/ios-xcode)

:::row:::
    :::column span="3":::
        The iOS CocoaPod package is available for download and use with the **Xcode** integrated developer environment (IDE). First, <a href="https://aka.ms/csspeech/iosbinary" target="_blank">download the binary CocoaPod <span class="docon docon-navigate-external x-hidden-focus"></span></a>. Extract the pod in the same directory for its intended use, create a *Podfile* and list the `pod` as a `target`.
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