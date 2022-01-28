---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 01/27/2022
ms.author: eur
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for Objective-C. 

[!INCLUDE [License Notice](~/includes/cognitive-services-speech-service-license-notice.md)]

The Objective-C/Swift Speech SDK is available natively as a CocoaPod package for Mac x64 and ARM-based silicons. For details about using the Objective-C Speech SDK with Swift, see <a href="https://developer.apple.com/documentation/swift/imported_c_and_objective-c_apis/importing_objective-c_into_swift" target="_blank">Importing Objective-C into Swift</a>.


# [Mac](#tab/mac)

System requirements for Mac:

- A macOS version 10.14 or later

# [Xcode](#tab/mac-xcode)

:::row:::
    :::column span="3":::
        The macOS CocoaPod package is available for download and use with the <a href="https://apps.apple.com/us/app/xcode/id497799835" target="_blank">Xcode 9.4.1 (or later) </a> integrated development environment (IDE). First, <a href="https://aka.ms/csspeech/macosbinary" target="_blank">download the binary CocoaPod </a>. Extract the pod in the same directory for its intended use, create a *Podfile*, and list the `pod` as a `target`.
    :::column-end:::
    :::column:::
        <br>
        <div class="icon is-large">
            <img alt="Xcode" src="/media/logos/logo_xcode.svg" width="60px">
        </div>
    :::column-end:::
:::row-end:::

```
platform :osx, 10.14
use_frameworks!

target 'MyApp' do
  pod 'MicrosoftCognitiveServicesSpeech', '~> 1.15.0'
end
```

# [Xamarin.Mac](#tab/mac-xamarin)

:::row:::
    :::column span="3":::
        Xamarin.Mac exposes the complete macOS SDK for .NET developers to build native Mac applications by using C#. For more information, see <a href="/xamarin/mac/" target="_blank">Xamarin.Mac</a>.
    :::column-end:::
    :::column:::
        <br>
        <div class="icon is-large">
            <img alt="Xamarin" src="/media/logos/logo_xamarin.svg" width="60px">
        </div>
    :::column-end:::
:::row-end:::

---

#### Additional resources

- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/objectivec/macos" target="_blank">macOS Speech SDK quickstart Objective-C source code </a>
- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/swift/macos" target="_blank">macOS Speech SDK quickstart Swift source code </a>


# [iOS](#tab/ios)

System requirements for iOS:

- A macOS version 10.3 or later
- Target iOS 9.3 or later

# [Xcode](#tab/ios-xcode)

:::row:::
    :::column span="3":::
        The iOS CocoaPod package is available for download and use with the <a href="https://apps.apple.com/us/app/xcode/id497799835" target="_blank">Xcode 9.4.1 (or later) </a> integrated development environment (IDE). First, <a href="https://aka.ms/csspeech/iosbinary" target="_blank">download the binary CocoaPod</a>. Extract the pod in the same directory for its intended use, create a *Podfile*, and list the `pod` as a `target`.
    :::column-end:::
    :::column:::
        <br>
        <div class="icon is-large">
            <img alt="Xcode" src="/media/logos/logo_xcode.svg" width="60px">
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
        Xamarin.iOS exposes the complete iOS SDK for .NET developers. Build fully native iOS apps by using C# in Visual Studio. For more information, see <a href="/xamarin/ios/" target="_blank">Xamarin.iOS</a>.
    :::column-end:::
    :::column:::
        <br>
        <div class="icon is-large">
            <img alt="Xamarin" src="/media/logos/logo_xamarin.svg" width="60px">
            &nbsp; ❤️ &nbsp;
            <img alt="iOS" src="/media/logos/logo_ios.svg" width="60px">
        </div>
    :::column-end:::
:::row-end:::

---

#### Additional resources

- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/objectivec/ios" target="_blank">iOS Speech SDK quickstart Objective-C source code </a>
- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/swift/ios" target="_blank">iOS Speech SDK quickstart Swift source code </a>
