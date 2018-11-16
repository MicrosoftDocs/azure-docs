---
title: "Quickstart: Convert text-to-speech, .NET Core" - Speech Service
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to convert text-to-speech with the Text-to-Speech REST API. The sample text included in this guide is structured as Speech Synthesis Markup Language (SSML). This allows you to choose the voice and language of the speech response. The REST API also supports plain text (ASCII or UTF-8), however, if plain text is provided the response will be returned in the Speech Service's default voice and language.
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.component: speech-service
ms.topic: conceptual
ms.date: 11/16/2018
ms.author: erhopf
---

# Quickstart: Convert text-to-speech with the Speech Service REST API (.NET Core)

In this quickstart, you'll learn how to convert text-to-speech using .NET Core and the Text-to-Speech REST API. The sample text included in this guide is structured as [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md). This allows you to choose the voice and language of the speech response. The REST API also supports plain text (ASCII or UTF-8), however, if plain text is provided the response will be returned in the Speech Service's default voice and language.

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with a Speech Service resource. If you don't have an account, you can use the [free trial](https://azure.microsoft.com/try/cognitive-services/) to get a subscription key.

## Prerequisites

This quickstart requires:

* [.NET SDK](https://www.microsoft.com/net/learn/dotnet/hello-world-tutorial)
* [Visual Studio](https://visualstudio.microsoft.com/downloads/), [Visual Studio Code](https://code.visualstudio.com/download), or your favorite text editor
* An Azure subscription key for the Speech Service

## Create a .NET Core project

Open a new command prompt (or terminal session) and run these commands:

```console
dotnet new console -o tts-sample
cd tts-sample
```

The first command does two things. It creates a new .NET console application, and creates a directory named `tts-sample`. The second command changes to the directory for your project.

## Select the C# language version

This quickstart requires C# 7.1 or later. There are a few ways that we can change the C# version; in this guide, we'll show you how to adjust the `tts-sample.csproj` file. For all available options, see [Select the C# language version](https://docs.microsoft.com/dotnet/csharp/language-reference/configure-language-version).

Open your project in Visual Studio, Visual Studio Code, or your favorite text editor. Open `tts-sample.csproj` and locate `LangVersion`.

```csharp
<PropertyGroup>
   <LangVersion>7.1</LangVersion>
</PropertyGroup>
```

Make sure that the version is set to 7.1 or later. Then save your changes.

## Add required namespaces to your project

The `dotnet new console` command that you ran earlier created a project, which includes `Program.cs`. Open this file, and replace the using statements:

```csharp
using System;
using System.Net.Http;
using System.Text;
using System.IO;
using System.Threading.Tasks;
```

This ensures that you have access to all the types required to build and run the app.

## Set the access token, host, and route

Locate `static async Task Main(string[] args)` and copy this code into the main method:

```csharp
string host = "https://westus.tts.speech.microsoft.com";
string accessToken = "<YOUR_BEARER_TOKEN>";
string route = "/cognitiveservices/v1";
```

> [!NOTE]
> The Text-to-speech REST API requires the `Authorization: Bearer` header and a valid access token. For instructions to obtain an access token, see [How to get an access token](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis#how-to-get-an-access-token).

## Build the SSML request

Text is sent as the body of an HTTP POST request. It can be plain text (ASCII or UTF-8) or [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md). Plain text requests use the Speech Service's default voice and language. With SSML you can specify the voice and language.

For this project we're going to use SSML with the language set to `en-US` and the voice set as `Guy24kRUS`. Let's construct the SSML for your request:

```csharp
string body = @"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
              <voice name='Microsoft Server Speech Text to Speech Voice (en-US, Guy24kRUS)'>
              We hope you enjoy using Text-to-Speech, a Microsoft Speech Services feature.
              </voice>
              </speak>";
```
