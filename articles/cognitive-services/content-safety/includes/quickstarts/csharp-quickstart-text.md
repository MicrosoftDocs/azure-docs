---
title: "Quickstart: Analyze text content with C#"
description: In this quickstart, get started using the Content Safety .NET SDK to analyze text content for objectionable material.
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

## Analyze text content

The following section walks through a sample request with the .NET SDK.

tbd

```csharp
string endpoint = "[Your endpoint]";
string key = "[Your subscription key]";

ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var request = new AnalyzeTextOptions("[Your input text]");

Response<AnalyzeTextResult> response;
try
{
    response = client.AnalyzeText(request);
}
catch (RequestFailedException ex)
{
    Console.WriteLine(String.Format("Analyze text failed: {0}", ex.Message));
    throw;
}
catch (Exception ex)
{
    Console.WriteLine(String.Format("Analyze text error: {0}", ex.Message));
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
#endregion
```



