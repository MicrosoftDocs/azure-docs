---
title: "Quickstart: Translator Text C# SDK"
description: 'Text translation processing using the C# programming language'
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD036 -->

## Set up your C#/.NET environment

For this quickstart, we use the latest version of [Visual Studio](https://visualstudio.microsoft.com/vs/) IDE to build and run the application.

1. Start Visual Studio.

1. On the **Get started** page, choose Create a new project.

    :::image type="content" source="../../media/quickstarts/get-started.png" alt-text="Screenshot of Visual Studio 2022 get started window.":::

1. On the **Create a new project page**, enter **console** in the search box. Choose the **Console Application** template, then choose **Next**.

     :::image type="content" source="../../media/quickstarts/create-project.png" alt-text="Screenshot of Visual Studio 2022 create new project page.":::

1. In the **Configure your new project** dialog window, enter `text-translation-sdk` in the Project name box. Then choose **Next**.

    :::image type="content" source="../../media/quickstarts/configure-new-project.png" alt-text="Screenshot of Visual Studio 2022 configure new project set-up window.":::

1. In the **Additional information** dialog window, select **.NET 6.0 (Long-term support)**, and then select **Create**.

    :::image type="content" source="../../media/quickstarts/additional-information.png" alt-text="Screenshot of Visual Studio 2022 additional information set-up window.":::

## Install the client library with NuGet

1. Right-click on your Translator-text-sdk project and select **Manage NuGet Packages...**
   :::image type="content" source="../../media/quickstarts/manage-nuget-package.png" alt-text="Screenshot of select NuGet package window in Visual Studio.":::

1. Select the **Browse** Tab and the **Include prerelease** checkbox and type **Azure.AI.Translation.Text**.

   :::image type="content" source="../../media/quickstarts/select-azure-package.png" alt-text="Screenshot of select `prerelease` NuGet package in Visual Studio.":::

1. Select version `1.0.0-beta.1` from the dropdown menu and install the package in your project.

   :::image type="content" source="../../media/quickstarts/install-azure-package.png" alt-text="Screenshot of install `prerelease` NuGet package in Visual Studio.":::

## Build your application

To interact with the Translator service using the client library, you need to create an instance of the `TextTranslationClient`class. To do so, create an `AzureKeyCredential` with your `key` from the Azure portal and a `TextTranslationClient`  instance with the `AzureKeyCredential`. The authentication varies slightly depending on whether your resource uses the regional or global endpoint. For this project, authenticate using the global endpoint. For more information about using a regional endpoint, *see* [Translator text sdks](../../text-sdk-overview.md#3-authenticate-the-client).

> [!NOTE]
>
> * Starting with .NET 6, new projects using the `console` template generate a new program style that differs from previous versions.
> * The new output uses recent C# features that simplify the code you need to write.
> * When you use the newer version, you only need to write the body of the `Main` method. You don't need to include top-level statements, global using directives, or implicit using directives.
> * For more information, *see* [**New C# templates generate top-level statements**](/dotnet/core/tutorials/top-level-templates).

1. Open the **Program.cs** file.

1. Delete the pre-existing code, including the line `Console.WriteLine("Hello World!")`, and enter the following code sample into your application's Program.cs file:

## Code sample

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../ai-services/security-features.md).

**Translate text**

  > [!NOTE]
  > In this example we are using the global endpoint. If you're using a regional endpoint, see [Create a Text Translation client](../../create-translator-resource.md#create-a-text-translation-client).

```csharp

using Azure;
using Azure.AI.Translation.Text;


string key = "<your-key>";

AzureKeyCredential credential = new(key);
TextTranslationClient client = new(credential);

try
{
    string targetLanguage = "fr";
    string inputText = "This is a test.";

    Response<IReadOnlyList<TranslatedTextItem>> response = await client.TranslateAsync(targetLanguage, inputText).ConfigureAwait(false);
    IReadOnlyList<TranslatedTextItem> translations = response.Value;
    TranslatedTextItem translation = translations.FirstOrDefault();

    Console.WriteLine($"Detected languages of the input text: {translation?.DetectedLanguage?.Language} with score: {translation?.DetectedLanguage?.Score}.");
    Console.WriteLine($"Text was translated to: '{translation?.Translations?.FirstOrDefault().To}' and the result is: '{translation?.Translations?.FirstOrDefault()?.Text}'.");
}
catch (RequestFailedException exception)
{
    Console.WriteLine($"Error Code: {exception.ErrorCode}");
    Console.WriteLine($"Message: {exception.Message}");
}

```

## Run your application

Once you've added the code sample to your application, choose the green **Start** button next to formRecognizer_quickstart to build and run your program, or press **F5**.

  :::image type="content" source="../../media/quickstarts/run-application.png" alt-text="Screenshot: run your Visual Studio program.":::

Here's a snippet of the expected output:

  :::image type="content" source="../../media/quickstarts/c-sharp-output.png" alt-text="Screenshot of the Visual Studio Code output in the terminal window. ":::
