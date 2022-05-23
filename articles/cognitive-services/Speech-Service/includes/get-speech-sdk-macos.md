---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/27/2020
ms.author: eur
---

When you develop for macOS, the following Speech SDKs are available:

- The Objective-C/Swift Speech SDK is available natively as a CocoaPod package for Mac x64 and ARM-based silicons. For details about using the Objective-C Speech SDK with Swift, see <a href="https://developer.apple.com/documentation/swift/imported_c_and_objective-c_apis/importing_objective-c_into_swift" target="_blank">Importing Objective-C into Swift</a>.
- The .NET Speech SDK is available via NuGet package and could be used with **Xamarin.Mac** and **Unity** application frameworks.
- The Python Speech SDK is available as a PyPI module for Python versions 3.7 and higher.
- The Java Speech SDK is available via the Maven repository as a JAR package.

### System requirements

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
  pod 'MicrosoftCognitiveServicesSpeech', '~> 1.21.0'
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

[!INCLUDE [Get .NET Speech SDK](get-speech-sdk-dotnet.md)]

# [Python](#tab/mac-python)

[!INCLUDE [Get Python Speech SDK](get-speech-sdk-python.md)]

---

#### Additional resources

- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/objectivec/macos" target="_blank">macOS Speech SDK quickstart Objective-C source code </a>
- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/swift/macos" target="_blank">macOS Speech SDK quickstart Swift source code </a>
