---
title: "Quickstart: Analyze image content with C#"
description: In this quickstart, get started using the Content Safety .NET SDK to analyze image content for objectionable material.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-safety
ms.topic: include
ms.date: 05/08/2023
ms.author: pafarley
---

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select the subscription you entered on the application form, select a resource group, supported region, and supported pricing tier. Then select **Create**.
  * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) or current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).

## Set up application

Create a new C# application.

#### [Visual Studio IDE](#tab/visual-studio)

Using Visual Studio, create a new **Console app (.NET Framework)** application. 

### Install the client library 

Once you've created a new project, install the client library by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `Azure.AI.ContentSafety`. Select **Install**.

#### [CLI](#tab/cli)

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `content-safety-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *Program.cs*.

```console
dotnet new console -n content-safety-quickstart
```

Change your directory to the newly created app folder. You can build the application with:

```console
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

### Install the client library

Within the application directory, install the Content Safety client library for .NET with the following command:

```console
dotnet add package  Azure.AI.ContentSafety --prerelease
```
    
---


## Create environment variables 

In this example, you'll write your credentials to environment variables on the local machine running the application.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See the Cognitive Services [security](/azure/cognitive-services/security-features) article for more authentication options like [Azure Key Vault](/azure/cognitive-services/use-key-vault). 

To set the environment variable for your key and endpoint, open a console window and follow the instructions for your operating system and development environment.

1. To set the `CONTENT_SAFETY_KEY` environment variable, replace `your-key` with one of the keys for your resource.
2. To set the `CONTENT_SAFETY_ENDPOINT` environment variable, replace `your-endpoint` with the endpoint for your resource.

#### [Windows](#tab/windows)

```console
setx CONTENT_SAFETY_KEY your-key
```

```console
setx CONTENT_SAFETY_ENDPOINT your-endpoint
```

After you add the environment variables, you may need to restart any running programs that will read the environment variables, including the console window.

#### [Linux](#tab/linux)

```bash
export CONTENT_SAFETY_KEY=your-key
```

```bash
export CONTENT_SAFETY_ENDPOINT=your-endpoint
```

After you add the environment variables, run `source ~/.bashrc` from your console window to make the changes effective.

---



## Analyze image content

From the project directory, open the *Program.cs* file that was created previously with [your new project](#set-up-application). Paste in the following code:


```csharp
string endpoint = Environment.GetEnvironmentVariable("CONTENT_SAFETY_ENDPOINT");
string key = Environment.GetEnvironmentVariable("CONTENT_SAFETY_KEY");

ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

string datapath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "Samples", "sample_data", "image.jpg");
byte[] b = File.ReadAllBytes(datapath);
BinaryData binaryData = BinaryData.FromBytes(b);
ImageData image = new ImageData() { Content = binaryData };

var request = new AnalyzeImageOptions(image);

Response<AnalyzeImageResult> response;
try
{
    response = client.AnalyzeImage(request);
}
catch (RequestFailedException ex)
{
    Console.WriteLine(String.Format("Analyze image failed: {0}", ex.Message));
    throw;
}
catch (Exception ex)
{
    Console.WriteLine(String.Format("Analyze image error: {0}", ex.Message));
    throw;
}

if (response.Value.HateResult != null)
{
    Console.WriteLine(String.Format("Hate severity: {0}", response.Value.HateResult.Severity));
}
if (response.Value.SelfHarmResult != null)
{
    Console.WriteLine(String.Format("SelfHarm severity: {0}", response.Value.SelfHarmResult.Severity));
}
if (response.Value.SexualResult != null)
{
    Console.WriteLine(String.Format("Sexual severity: {0}", response.Value.SexualResult.Severity));
}
if (response.Value.ViolenceResult != null)
{
    Console.WriteLine(String.Format("Violence severity: {0}", response.Value.ViolenceResult.Severity));
}
```



Then, run the application

#### [Visual Studio IDE](#tab/visual-studio)

Run the application by clicking the **Debug** button at the top of the IDE window.

#### [CLI](#tab/cli)

Run the application from your application directory with the `dotnet run` command.

```dotnet
dotnet run
```

---
