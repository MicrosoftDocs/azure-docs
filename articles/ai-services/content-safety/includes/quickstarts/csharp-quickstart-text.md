---
title: "Quickstart: Analyze text content with C#"
description: In this quickstart, get started using the Content Safety .NET SDK to analyze text content for objectionable material.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom:
ms.topic: include
ms.date: 07/04/2023
ms.author: pafarley
---

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) with workload .NET desktop development enabled. Or if you don't plan on using Visual Studio IDE, you need the current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select the subscription you entered on the application form, select a resource group, supported region, and supported pricing tier. Then select **Create**.
  * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.

## Set up application

Create a new C# application.

#### [Visual Studio IDE](#tab/visual-studio)

Open Visual Studio, and under **Get started** select **Create a new project**. Set the template filters to _C#/All Platforms/Console_. Select **Console App** (command-line application that can run on .NET on Windows, Linux and macOS) and choose **Next**. Update the project name to _ContentSafetyQuickstart_ and choose **Next**. Select **.NET 6.0** or above, and choose **Create** to create the project.

### Install the client SDK 

Once you've created a new project, install the client SDK by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `Azure.AI.ContentSafety`. Select **Install**.

#### [CLI](#tab/cli)

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `content-safety-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *Program.cs*.

```dotnet
dotnet new console -n content-safety-quickstart
```

Change your directory to the newly created app folder. You can build the application with:

```dotnet
dotnet build
```

The build output should contain no warnings or errors. 

```console
...
Build succeeded.
  0 Warning(s)
  0 Error(s)
...
```

### Install the client SDK

Within the application directory, install the Computer Vision client SDK for .NET with the following command:

```dotnet
dotnet add package Azure.AI.ContentSafety --prerelease
```
    
---

[!INCLUDE [Create environment variables](../env-vars.md)]

## Analyze text content

From the project directory, open the *Program.cs* file that was created previously. Paste in the following code:

```csharp
using System;
using Azure.AI.ContentSafety;

namespace Azure.AI.ContentSafety.Dotnet.Sample
{
  class ContentSafetySampleAnalyzeText
  {
    public static void AnalyzeText()
    {
      // retrieve the endpoint and key from the environment variables created earlier
      string endpoint = Environment.GetEnvironmentVariable("CONTENT_SAFETY_ENDPOINT");
      string key = Environment.GetEnvironmentVariable("CONTENT_SAFETY_KEY");

      ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

      string text = "Your input text";

      var request = new AnalyzeTextOptions(text);

      Response<AnalyzeTextResult> response;
      try
      {
          response = client.AnalyzeText(request);
      }
      catch (RequestFailedException ex)
      {
          Console.WriteLine("Analyze text failed.\nStatus code: {0}, Error code: {1}, Error message: {2}", ex.Status, ex.ErrorCode, ex.Message);
          throw;
      }

      Console.WriteLine("Hate severity: {0}", response.Value.HateResult?.Severity ?? 0);
      Console.WriteLine("SelfHarm severity: {0}", response.Value.SelfHarmResult?.Severity ?? 0);
      Console.WriteLine("Sexual severity: {0}", response.Value.SexualResult?.Severity ?? 0);
      Console.WriteLine("Violence severity: {0}", response.Value.ViolenceResult?.Severity ?? 0);
    }
  }
}
```

Replace `"Your input text"` with the text content you'd like to use.

#### [Visual Studio IDE](#tab/visual-studio)

Build and run the application by selecting **Start Debugging** from the **Debug** menu at the top of the IDE window (or press **F5**).

#### [CLI](#tab/cli)

Build and run the application from your application directory with these commands:

```dotnet
dotnet build
dotnet run
```

---