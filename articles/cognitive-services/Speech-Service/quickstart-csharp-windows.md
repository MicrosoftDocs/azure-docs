---
title: Speech SDK Quickstart for C# and Windows | Microsoft Docs
description: Quickly get started with the Speech SDK with Windows and C#.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: wolfma61
manager: onano

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 05/01/2018
ms.author: wolfma
---
# Speech recognition (C#)

This article describes how to create a C#-based console application for Windows that uses the Speech SDK to transcribe speech to text. A working microphone is required.

## Prerequisites

You'll need the following to get started.

* Visual Studio 2017 (the Community Edition is fine).
* The **.NET desktop development** workload in Visual Studio. You can enable it in **Tools** \> **Get Tools and Features**.
* The Speech SDK and a Speech service subscription key. See [Get set up](get-started.md).

## Create a console application project

In Visual Studio 2017, create a new Visual C# Console App (.NET Framework) with the name "CarbonHelloWorld":

![Create Visual C# Console App (.NET Framework)](media/sdk/speechsdk-05-vs-cs-new-console-app.png)

## Install and reference the Speech SDK NuGet package

In the Solution Explorer, right-click the solution and click on **Manage NuGet Packages for Solution**.

![Right-click Manage NuGet Packages for Solution](media/sdk/speechsdk-06-vs-cs-manage-nuget-packages.png)

In the upper-right corner, in the **Package Source** field, choose "Nuget.org".
Search for and install the "Microsoft.CognitiveServices.Speech" package and install it into the CarbonHelloWorld project.

![Install Microsoft.CognitiveServices.Speech NuGet Package](media/sdk/speechsdk-08-vs-cs-nuget-install.png)

In the license screen that pops up, accept the license:

![Accept the license](media/sdk/speechsdk-09-vs-cs-nuget-license.png)

## Create a platform configuration matching your PC's architecture

In the configuration manager, add a new platform to the configuration that matches your processor architecture.

![Launch the configuration manager](media/sdk/speechsdk-12-vs-cs-cfg-manager-click.png)

* If you are running 64-bit Windows, create a new platform configuration named `x64`.
* If you are running 32-bit Windows, create a new platform configuration named `x86`.

![Add a new platform under the configuration manager window](media/sdk/speechsdk-14-vs-cs-cfg-manager-new.png)

![On 64-bit Windows, add a new platform named "x64"](media/sdk/speechsdk-15-vs-cs-cfg-manager-add-x64.png)

## Add the sample code

In the source file `Program.cs` replace the body of the `Program` class with the following, replacing the subscription key with one that you obtained:

```csharp
static async Task RecoFromMicrophoneAsync()
{
    var subscriptionKey = "<Please replace with your subscription key>";

    var factory = SpeechFactory.FromSubscription(subscriptionKey, "");

    using (var recognizer = factory.CreateSpeechRecognizer())
    {
        Console.WriteLine("Say something...");
        var result = await recognizer.RecognizeAsync();

        if (result.Reason == RecognitionStatus.Success)
        {
            Console.WriteLine($"We recognized: {result.RecognizedText}");
        }
        else
        {
            Console.WriteLine($"There was an error, reason {result.Reason} - {result.RecognizedText}");
        }
        Console.WriteLine("Please press a key to continue.");
        Console.ReadLine();
    }
}
```

![Main method after pasting the code](media/sdk/speechsdk-17-vs-cs-paste-code.png)

As Visual Studio's highlighting indicates, the references to the Speech SDK's classes cannot yet be resolved.
To fix this error, add the following `using` statement to the beginning of the code (either manually, or using Visual Studio's [quick actions](https://docs.microsoft.com/visualstudio/ide/quick-actions)).

```csharp
using Microsoft.CognitiveServices.Speech.Recognition;
```

![Use the quick action to add the missing using statement](media/sdk/speechsdk-18-vs-cs-add-using.png)

## Build and run the sample

The code should compile without errors now:

![Successful build](media/sdk/speechsdk-20-vs-cs-build.png)

Launch the program under the debugger with the Launch button or using the F5 keyboard shortcut:

![Launch the app into debugging](media/sdk/speechsdk-21-vs-cs-f5.png)

A console window should pop up, prompting you to say something (in English).
The result of the recognition will be displayed on screen.

![Console output after successful recognition](media/sdk/speechsdk-22-cs-vs-console-output.png)

## Download code

The code from this article can be downloaded [here](https://aka.ms/csspeech/winsample).
