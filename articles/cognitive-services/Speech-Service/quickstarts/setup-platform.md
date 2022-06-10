---
title: 'Quickstart: Set up the development environment'
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to install the Speech SDK for your preferred combination of platform and programming language.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 01/24/2022
ms.author: eur
ms.devlang: cpp, csharp, golang, java, javascript, python
ms.custom: devx-track-python, devx-track-js, devx-track-csharp, mode-other
zone_pivot_groups: programming-languages-speech-sdk
---

# Quickstart: Set up the development environment

::: zone pivot="programming-language-csharp"

## Platform requirements

Before you install the Speech SDK on Windows or Linux, make sure you have the following prerequisites:

# [Windows](#tab/windows)

[!INCLUDE [Get the Speech SDK](../includes/get-speech-sdk-windows.md)]

# [Linux](#tab/linux)

[!INCLUDE [Get the Speech SDK](../includes/get-speech-sdk-linux.md)]
* * * 

The required Speech SDK files can be deployed in the same directory as your application. This way your application can directly access the libraries. Make sure you select the correct version (x86/x64) that matches your application.

| Name                                            | Function                                             |
|-------------------------------------------------|------------------------------------------------------|
| *Microsoft.CognitiveServices.Speech.core.dll*   | Core SDK, required for native and managed deployment |
| *Microsoft.CognitiveServices.Speech.csharp.dll* | Required for managed deployment                      |

> [!IMPORTANT]
> For the Windows Forms App (.NET Framework) C# project, make sure the libraries are included in your project's deployment settings. You can check this under **Properties** > **Publish Section**. Select the **Application Files** button and find corresponding libraries from the dropdown list. Make sure the value is set to **Included**. Visual Studio includes the file when the project is published or deployed.

[!INCLUDE [Get .NET Speech SDK](../includes/get-speech-sdk-dotnet.md)]

**Choose your target environment**

# [.NET](#tab/dotnet)

[!INCLUDE [dotnet](../includes/quickstarts/platform/csharp-dotnet-windows.md)]

# [.NET Core](#tab/dotnetcore)

[!INCLUDE [dotnetcore](../includes/quickstarts/platform/csharp-dotnetcore-windows.md)]

# [Unity](#tab/unity)

[!INCLUDE [unity](../includes/quickstarts/platform/csharp-unity.md)]

# [UWP](#tab/uwp)

[!INCLUDE [uwp](../includes/quickstarts/platform/csharp-uwp.md)]

# [Xamarin](#tab/xaml)

[!INCLUDE [xamarin](../includes/quickstarts/platform/csharp-xamarin.md)]

# [Linux](#tab/linux)

[!INCLUDE [linux-install-sdk](../includes/quickstarts/platform/linux-install-sdk.md)]

* * *
::: zone-end

::: zone pivot="programming-language-cpp"


## Platform requirements

Before you install the Speech SDK on Windows or Linux, make sure you have the following prerequisites:

# [Windows](#tab/windows)

[!INCLUDE [Get the Speech SDK](../includes/get-speech-sdk-windows.md)]

# [Linux](#tab/linux)

[!INCLUDE [Get the Speech SDK](../includes/get-speech-sdk-linux.md)]
* * * 

[!INCLUDE [Get C++ Speech SDK](../includes/get-speech-sdk-cpp.md)]


**Choose your target environment**

# [Linux](#tab/linux)

[!INCLUDE [linux-install-sdk](../includes/quickstarts/platform/linux-install-sdk.md)]

# [macOS](#tab/macos)

[!INCLUDE [macos](../includes/quickstarts/platform/cpp-macos.md)]

# [Windows](#tab/windows)

[!INCLUDE [windows](../includes/quickstarts/platform/cpp-windows.md)]

* * *
::: zone-end

::: zone pivot="programming-language-java"

## Platform requirements

Before you install the Speech SDK on Windows or Linux, make sure you have the following prerequisites:

# [Windows](#tab/windows)

[!INCLUDE [Get the Speech SDK](../includes/get-speech-sdk-windows.md)]

# [Linux](#tab/linux)

[!INCLUDE [Get the Speech SDK](../includes/get-speech-sdk-linux.md)]
* * * 

[!INCLUDE [Get Java Speech SDK](../includes/get-speech-sdk-java.md)]

**Choose your target environment**

# [Java Runtime](#tab/jre)

[!INCLUDE [jre](../includes/quickstarts/platform/java-jre.md)]

# [Android](#tab/android)

[!INCLUDE [android](../includes/quickstarts/platform/java-android.md)]

# [Linux](#tab/linux)

[!INCLUDE [linux-install-sdk](../includes/quickstarts/platform/linux-install-sdk.md)]

#### Additional resources

- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/java/android" target="_blank">Android-specific Java quickstart source code </a>
- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/java/jre" target="_blank">Java Runtime (JRE) quickstart source code </a>



* * *
::: zone-end

::: zone pivot="programming-language-python"

## Platform requirements

Before you install the Speech SDK on Windows or Linux, make sure you have the following prerequisites:

# [Windows](#tab/windows)

[!INCLUDE [Get the Speech SDK](../includes/get-speech-sdk-windows.md)]

# [Linux](#tab/linux)

[!INCLUDE [Get the Speech SDK](../includes/get-speech-sdk-linux.md)]
* * * 

[!INCLUDE [linux-install-sdk](../includes/quickstarts/platform/linux-install-sdk.md)]

[!INCLUDE [Get Python Speech SDK](../includes/get-speech-sdk-python.md)]

[!INCLUDE [python](../includes/quickstarts/platform/python.md)]


::: zone-end

::: zone pivot="programming-language-go"


[!INCLUDE [linux-install-sdk](../includes/quickstarts/platform/linux-install-sdk.md)]

[!INCLUDE [go-linux](../includes/quickstarts/platform/go-linux.md)]



* * *
::: zone-end

::: zone pivot="programming-language-javascript"

The Speech SDK for JavaScript is available as an npm package. See <a href="https://www.npmjs.com/package/microsoft-cognitiveservices-speech-sdk" target="_blank">microsoft-cognitiveservices-speech-sdk </a> and its companion GitHub repository <a href="https://github.com/Microsoft/cognitive-services-speech-sdk-js" target="_blank">cognitive-services-speech-sdk-js</a>.

> [!TIP]
> The Speech SDK for JavaScript is available as an npm package, so both Node.js and client web browsers can consume it. But make sure to consider the various architectural implications of each environment. For example, the <a href="https://en.wikipedia.org/wiki/Document_Object_Model" target="_blank">document object model (DOM) </a> isn't available for server-side applications just as the <a href="https://nodejs.org/api/fs.html" target="_blank">file system </a> isn't available to client-side applications.


### Node.js Package Manager (NPM)

To install the Speech SDK for JavaScript, run the following `npm install` command:

```nodejs
npm install microsoft-cognitiveservices-speech-sdk
```

**Choose your target environment**

#### [Browser-based](#tab/browser)

[!INCLUDE [browser](../includes/quickstarts/platform/javascript-browser.md)]



For more information, see the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/browser" target="_blank">Web browser Speech SDK quickstart</a>.


#### [Node.js](#tab/nodejs)

[!INCLUDE [node](../includes/quickstarts/platform/javascript-node.md)]


For more information, see the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/node" target="_blank">Node.js Speech SDK quickstart</a>.

* * *

::: zone-end

::: zone pivot="programming-language-objectivec"

[!INCLUDE [objectivec](../includes/quickstarts/platform/objectivec-mac.md)]

::: zone-end

::: zone pivot="programming-language-swift"

[!INCLUDE [swift](../includes/quickstarts/platform/swift-mac.md)]

::: zone-end