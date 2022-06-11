---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/27/2020
ms.author: eur
---

When you develop for iOS, the following Speech SDKs are available. The Objective-C/Swift Speech SDK is available natively as an iOS CocoaPod package. Alternatively, the Speech SDK for C# could be used with Xamarin.iOS and Unity application frameworks.

> [!TIP]
> For details on using the Objective-C Speech SDK with Swift, see <a href="https://developer.apple.com/documentation/swift/imported_c_and_objective-c_apis/importing_objective-c_into_swift" target="_blank">Importing Objective-C into Swift</a>.

### System requirements

- A macOS version 10.3 or later
- Target iOS 9.3 or later

# [Xcode](#tab/ios-xcode)

The iOS CocoaPod package is available for download and use with the <a href="https://apps.apple.com/us/app/xcode/id497799835" target="_blank">Xcode 9.4.1 (or later) </a> integrated development environment (IDE). First, <a href="https://aka.ms/csspeech/iosbinary" target="_blank">download the binary CocoaPod</a>. Extract the pod in the same directory for its intended use, create a *Podfile*, and list the `pod` as a `target`.

```
platform :ios, '9.3'
use_frameworks!

target 'AppName' do
  pod 'MicrosoftCognitiveServicesSpeech', '~> 1.10.0'
end
```

# [Xamarin.iOS](#tab/ios-xamarin)

Xamarin.iOS exposes the complete iOS SDK for .NET developers. Build fully native iOS apps by using C# in Visual Studio. For more information, see <a href="/xamarin/ios/" target="_blank">Xamarin.iOS</a>.

---

#### Additional resources

- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/objectivec/ios" target="_blank">iOS Speech SDK quickstart Objective-C source code </a>
- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/swift/ios" target="_blank">iOS Speech SDK quickstart Swift source code </a>
