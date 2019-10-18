---
author: erhopf
ms.service: cognitive-services
ms.topic: include
ms.date: 08/06/2019
ms.author: erhopf
---

## Prerequisites

Before you get started, make sure to:

1. [Create a Speech resource and get a subscription key]().
2. [Setup your development environment](../../../quickstart-platform-csharp-dotnet-windows.md). Use this quickstart to install and configure Visual Studio 2019.

If you've already done this, great. Let's keep going.

## Open your project in Visual Studio

The first step is to make sure that you have your project open in Visual Studio.

1. Launch Visual Studio 2019.
2. Load your project and open `Program.cs`.

[!INCLUDE [boilerplate](../../common/boilerplate.md)]
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp-dotnet-windows/helloworld/Program_numbers.cs?range=5-15,43-52)]

[!INCLUDE [createconfig](./createconfig.md)]
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp-dotnet-windows/helloworld/Program_numbers.cs?range=16)]

[!INCLUDE [initreco](../../common/initreco.md)]
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp-dotnet-windows/helloworld/Program_numbers.cs?range=17-19,42)]

[!INCLUDE [recophrase](../../common/recophrase.md)]
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp-dotnet-windows/helloworld/Program_numbers.cs?range=20)]

## Display the recognition results (or errors)

When the recognition result is returned by the Speech service, you'll want to do something with it. We're going to keep it simple and print the result to console.

Inside the using statement, below `RecognizeOnceAsync()`, add this code:
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp-dotnet-windows/helloworld/Program_numbers.cs?range=22-41)]

[!INCLUDE [checkcode](../../common/checkcode.md)]
[!code-csharp[](~/samples-cognitive-services-speech-sdk/quickstart/csharp-dotnet-windows/helloworld/Program_numbers.cs)]

## Build and run your app

Now you're ready to build your app and test our speech recognition using the Speech service.

1. **Compile the code** - From the menu bar of Visual Stuio, choose **Build** > **Build Solution**.
2. **Start your app** - From the menu bar, choose **Debug** > **Start Debugging** or press **F5**.
3. **Start recognition** - It'll prompt you to speak a phrase in English. Your speech is sent to the Speech service, transcribed as text, and rendered in the console.

## Next steps

* How-tos
* Samples
* Reference
