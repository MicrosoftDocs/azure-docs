---
author: IEvangelist
ms.service: cognitive-services
ms.topic: include
ms.date: 03/27/2020
ms.author: dapine
---

When developing for macOS, there are two Speech SDKs available. The Objective-C Speech SDK is available natively as a CocoaPod package, or the .NET Speech SDK could be used with **Xamarin.Mac** as it implements .NET Standard 2.0.

- A macOS machine with <a href="https://apps.apple.com/us/app/xcode/id497799835?mt=12" target="_blank">Xcode <span class="docon docon-navigate-external x-hidden-focus"></span></a> 9.4.1 or later
- Target iOS 9.3 or later

# [Xcode](#tab/mac-xcode)

:::row:::
    :::column span="3":::
        The macOS CocoaPod package is available for download and use with the Xcode integrated developer environment (IDE). First, <a href="https://aka.ms/csspeech/macosbinary" target="_blank">download the binary CocoaPod <span class="docon docon-navigate-external x-hidden-focus"></span></a>. Extract the pod in the same directory for its intended use, create a *Podfile* and list the `pod` as a `target`.
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
  pod 'MicrosoftCognitiveServicesSpeech', '~> 1.10.0'
end
```

# [Xamarin.Mac](#tab/mac-xamarin)

<div class="icon is-large">
    <img alt="Xamarin" src="https://docs.microsoft.com/media/logos/logo_xamarin.svg" width="60px">
</div>

Xamarin.Mac

---
