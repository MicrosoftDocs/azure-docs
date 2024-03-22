---
title: "Quickstart: Document Translation C#"
description: 'Document Translation processing using the REST API and C# programming language'
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
---
<!-- markdownlint-disable MD051 -->

## Set up your C#/.NET environment

For this quickstart, we use the latest version of [Visual Studio](https://visualstudio.microsoft.com/vs/) IDE to build and run the application.

1. Start Visual Studio.

1. On the **Get started** page, choose Create a new project.

    :::image type="content" source="../../../media/visual-studio/get-started.png" alt-text="Screenshot of Visual Studio 2022 get started window.":::

1. On the **Create a new project page**, enter **console** in the search box. Choose the **Console Application** template, then choose **Next**.

     :::image type="content" source="../../../media/visual-studio/create-project.png" alt-text="Screenshot of Visual Studio 2022 create new project page.":::

1. In the **Configure your new project** dialog window, enter `document-translation-qs` in the Project name box. Then choose Next.

    :::image type="content" source="../../../media/visual-studio/configure-new-project.png" alt-text="Screenshot of Visual Studio 2022 configure new project set-up window.":::

1. In the **Additional information** dialog window, select **.NET 6.0 (Long-term support)**, and then select **Create**.

    :::image type="content" source="../../../media/visual-studio/additional-information.png" alt-text="Screenshot of Visual Studio 2022 additional information set-up window.":::

<!-- > [!div class="nextstepaction"]
> [I ran into an issue setting up my environment.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CSHARP&Pillar=Language&Product=Document-translation&Page=quickstart&Section=Set-up-the-environment) -->

## Install Newtonsoft.Json

1. Right-click on your **document-translation-qs** project and select **Manage NuGet Packages...** .

    :::image type="content" source="../../../media/visual-studio/manage-nuget-packages.png" alt-text="Screenshot of select NuGet package window in Visual Studio.":::

1. Select the Browse tab and type **NewtonsoftJson**.

     :::image type="content" source="../../../media/visual-studio/get-newtonsoft-json.png" alt-text="Screenshot of select prerelease NuGet package in Visual Studio.":::

1. Select the latest stable version from the dropdown menu and install the package in your project.

    :::image type="content" source="../../../media/visual-studio/install-nuget-package.png" alt-text="Screenshot of install selected NuGet package window.":::

<!-- > [!div class="nextstepaction"]
> [I ran into an issue installing the NuGet package.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CSHARP&Pillar=Language&Product=Document-translation&Page=quickstart&Section=Install-package) -->

## Translate all documents in a storage container

> [!NOTE]
>
> * Starting with .NET 6, new projects using the `console` template generate a new program style that differs from previous versions.
> * The new output uses recent C# features that simplify the code you need to write.
> * When you use the newer version, you only need to write the body of the `Main` method. You don't need to include top-level statements, global using directives, or implicit using directives.
> * For more information, see [**New C# templates generate top-level statements**](/dotnet/core/tutorials/top-level-templates).

1. Open the **Program.cs** file.

1. Delete the pre-existing code, including the line `Console.WriteLine("Hello World!")`.

1. Copy and paste the document translation [code sample](#code-sample) into the Program.cs file.

    * Update **`{your-document-translation-endpoint}`** and **`{your-key}`** with values from your Azure portal Translator instance.

    * Update **`{your-source-container-SAS-URL}`** and **`{your-target-container-SAS-URL}`** with values from your Azure portal Storage account containers instance.

## Code sample

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../../../ai-services/security-features.md).

```csharp
using System.Text;

class Program
{
    private static readonly string endpoint = "{your-document-translator-endpoint}/translator/text/batch/v1.1";

    private static readonly string key = "{your-key}";

    static readonly string route = "/batches";
    static readonly string sourceURL = "\" {your-source-container-SAS-URL}\"";
    static readonly string targetURL = " \"{your-target-container-SAS-URL}\"";


    static readonly string json = ("{\"inputs\": [{\"source\": {\"sourceUrl\":"+sourceURL+" ,\"storageSource\": \"AzureBlob\",\"language\": \"en\"}, \"targets\": [{\"targetUrl\":"+targetURL+",\"storageSource\": \"AzureBlob\",\"category\": \"general\",\"language\": \"es\"}]}]}");

    static async Task Main(string[] args)
    {
        using HttpClient client = new HttpClient();
        using HttpRequestMessage request = new HttpRequestMessage();
        {

            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

            request.Method = HttpMethod.Post;
            request.RequestUri = new Uri(endpoint + route);
            request.Headers.Add("Ocp-Apim-Subscription-Key", key);
            request.Content = content;

            HttpResponseMessage response = await client.SendAsync(request);
            string result = response.Content.ReadAsStringAsync().Result;
            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Status code: {response.StatusCode}");
                Console.WriteLine();
                Console.WriteLine($"Response Headers:");
                Console.WriteLine(response.Headers);
            }
            else
                Console.Write("Error");

        }

    }

}
```

## Run your application

Once you've added a code sample to your application, choose the green **Start** button next to **document-translation-qs** to build and run your program, or press **F5**.

:::image type="content" source="../../../media/visual-studio/run-visual-studio.png" alt-text="Screenshot: run your Visual Studio program.":::

Upon successful completion: 

* The translated documents can be found in your target container.
* The successful POST method returns a `202 Accepted`  response code indicating that the service created the batch request.
* The POST request also returns response headers including `Operation-Location` that provides a value used in subsequent GET requests.
