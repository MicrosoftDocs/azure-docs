---
title: Sign an HTTP request C#
description: This is the C# version of singing an HTTP request for Communication Services.
author: apistrak
manager: soricos
services: azure-communication-services

ms.author: apistrak
ms.date: 01/15/2021
ms.topic: include
ms.service: azure-communication-services
---
## Prerequisites

Before you get started, make sure to:
- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Install [Visual Studio](https://visualstudio.microsoft.com/downloads/) 
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../../create-communication-resource.md). You'll need to record your **resourceEndpoint** and  **resourceAccessKey** for this tutorial.
 


## Overview
Access key authentication uses a shared secret key to generate an HMAC for each HTTP request computed by using the SHA256 algorithm, and sends it in the `Authorization` header using the `HMAC-SHA256` scheme.

```
Authorization: "HMAC-SHA256 SignedHeaders=date;host;x-ms-content-sha256&Signature=<hmac-sha256-signature>"
```

## Setting up
The following steps describe how to construct the Authorization header:
### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `SignHmacTutorial`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o SignHmacTutorial
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd SignHmacTutorial
dotnet build
```
Update the Main method declaration to support async code
Use the following code to begin:

```csharp
using System;
using System.Threading.Tasks;

namespace AccessTokensQuickstart
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - Sign an HTTP request Tutorial");

            // Tutorial code goes here
        }
    }
}
```

