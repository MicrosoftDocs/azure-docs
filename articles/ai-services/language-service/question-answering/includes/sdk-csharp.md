---
title: "Quickstart: Question answering client library for .NET"
description: This quickstart shows how to get started with the question answering client library for .NET. Follow these steps to install the package and try out the example code for basic tasks. Question answering enables you to power a question-and-answer service from your semi-structured content like FAQ documents, URLs, and product manuals.
author: jboback
ms.author: jboback
ms.topic: include
ms.date: 07/12/2022
---

Use this quickstart for the question answering client library for .NET to:

* Get an answer from a project.
* Get an answer from a body of text that you send along with your question.
* Get the confidence score for the answer to your question.

 [Reference documentation][questionanswering_refdocs] | [Package (NuGet)][questionanswering_nuget_package]  | [Additional samples][questionanswering_samples] | [Library source code][questionanswering_client_src]

[questionanswering_nuget_package]: https://www.nuget.org/packages/Azure.AI.Language.QuestionAnswering/
[questionanswering_refdocs]: /dotnet/api/Azure.AI.Language.QuestionAnswering/
[questionanswering_client_src]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/cognitivelanguage/Azure.AI.Language.QuestionAnswering/src/
[questionanswering_samples]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/cognitivelanguage/Azure.AI.Language.QuestionAnswering/samples/README.md

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) or current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Question answering requires a [Language resource](https://portal.azure.com/?quickstart=true#create/Microsoft.CognitiveServicesTextAnalytics) with the custom question answering feature enabled to generate an API key and endpoint. 
    * After your Language resource deploys, select **Go to resource**. You will need the key and endpoint from the resource you create to connect to the API. Paste your key and endpoint into the code below later in the quickstart.
* To create a Language resource with [Azure CLI](../../../multi-service-resource.md?pivots=azcli) provide the following additional properties: `--api-properties qnaAzureSearchEndpointId=/subscriptions/<azure-subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Search/searchServices/<azure-search-service-name> qnaAzureSearchEndpointKey=<azure-search-service-auth-key>`
* An existing project to query. If you have not set up a project, you can follow the instructions in the [**Language Studio quickstart**](../quickstart/sdk.md). Or add a project that uses this [Surface User Guide URL](https://download.microsoft.com/download/7/B/1/7B10C82E-F520-4080-8516-5CF0D803EEE0/surface-book-user-guide-EN.pdf) as a data source.



## Setting up

[!INCLUDE [Create environment variables](../../includes/environment-variables.md)]



### CLI

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `question-answering-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *program.cs*.

```console
dotnet new console -n question-answering-quickstart
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

Within the application directory, install the custom question answering client library for .NET with the following command:

```console
dotnet add package Azure.AI.Language.QuestionAnswering
```



## Query a project

#### Generate an answer from a project

The example below will allow you to query a project using `GetAnswers` to get an answer to your question.

You will need to update the code below and provide your own values for the following variables.

|Variable name | Value |
|--------------------------|-------------|
| `endpoint`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`|
| `credential` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys always for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `projectName` | The name of your question answering project.|
| `deploymentName`             | There are two possible values: `test`, and `production`. `production` is dependent on you having deployed your project from **Language Studio** > **question answering** > **Deploy project**.|

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). See the Azure AI services [security](../../../security-features.md) article for more information.

From the project directory, open the *program.cs* file and replace with the following code:

```csharp
using Azure;
using Azure.AI.Language.QuestionAnswering;
using System;

namespace question_answering
{
    class Program
    {
        static void Main(string[] args)
        {

            // This example requires environment variables named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
            Uri endpoint = new Uri("LANGUAGE_ENDPOINT");
            AzureKeyCredential credential = new AzureKeyCredential("LANGUAGE_KEY");
            string projectName = "{YOUR-PROJECT-NAME}";
            string deploymentName = "production";

            string question = "How long should my Surface battery last?";

            QuestionAnsweringClient client = new QuestionAnsweringClient(endpoint, credential);
            QuestionAnsweringProject project = new QuestionAnsweringProject(projectName, deploymentName);

            Response<AnswersResult> response = client.GetAnswers(question, project);

            foreach (KnowledgeBaseAnswer answer in response.Value.Answers)
            {
                Console.WriteLine($"Q:{question}");
                Console.WriteLine($"A:{answer.Answer}");
            }
        }
    }
}
```

While we are hard coding the variables for our example. For production, consider using a secure way of storing and accessing your credentials. For example, [Azure key vault](../../../../key-vault/general/overview.md) provides secure key storage.

After updating `Program.cs` with the code above and substituting in the correct variable values. Run the application with the `dotnet run` command from your application directory.

```console
dotnet run
```

The response will look as follows:

```console
Q: How much battery life do I have left?
A: If you want to see how much battery you have left, go to **Start  **> **Settings  **> **Devices  **> **Bluetooth & other devices  **, then find your pen. The current battery level will appear under the battery icon.
```

For information on how confident question answering is that this is the correct response add an additional print statement underneath the existing print statements:

```csharp
Console.WriteLine($"Q:{question}");
Console.WriteLine($"A:{answer.Answer}");
Console.WriteLine($"({answer.Confidence})"); // add this line
```

If you execute `dotnet run` again, you will now receive a result with a confidence score:

```console
Q:How much battery life do I have left?
A:If you want to see how much battery you have left, go to **Start  **> **Settings  **> **Devices  **> **Bluetooth & other devices  **, then find your pen. The current battery level will appear under the battery icon.
(0.9185)
```

The confidence score returns a value between 0 and 1. You can think of this like a percentage and multiply by 100 so a confidence score of 0.9185 means question answering is 91.85% confident this is the correct answer to the question based on the project.

If you want to exclude answers where the confidence score falls below a certain threshold, you use  `AnswerOptions` to add the `ConfidenceScoreThreshold` property.

```csharp
QuestionAnsweringClient client = new QuestionAnsweringClient(endpoint, credential);
QuestionAnsweringProject project = new QuestionAnsweringProject(projectName, deploymentName);
AnswersOptions options = new AnswersOptions(); //Add this line
options.ConfidenceThreshold = 0.95; //Add this line

Response<AnswersResult> response = client.GetAnswers(question, project, options); //Add the additional options parameter
```

Since we know from our previous execution of the code that our confidence score is: `.9185` setting the threshold to `.95` will result in the [default answer](../how-to/change-default-answer.md) being returned.

```console
Q:How much battery life do I have left?
A:No good match found in KB
(0)
```



## Query text without a project

You can also use question answering without a project with `GetAnswersFromText`. In this case, you provide question answering with both a question and the associated text records you would like to search for an answer at the time the request is sent.

For this example, you only need to modify the variables for `endpoint` and `credential`.

```csharp
using Azure;
using Azure.AI.Language.QuestionAnswering;
using System;
using System.Collections.Generic;


namespace questionansweringcsharp
{
    class Program
    {
        static void Main(string[] args)
        {

            Uri endpoint = new Uri("https://{YOUR-ENDPOINT}.api.cognitive.microsoft.com/");
            AzureKeyCredential credential = new AzureKeyCredential("YOUR-LANGUAGE-RESOURCE-KEY");
            QuestionAnsweringClient client = new QuestionAnsweringClient(endpoint, credential);

            IEnumerable<TextDocument> records = new[]
            {
                new TextDocument("doc1", "Power and charging.It takes two to four hours to charge the Surface Pro 4 battery fully from an empty state. " +
                         "It can take longer if you're using your Surface for power-intensive activities like gaming or video streaming while you're charging it"),
                new TextDocument("doc2", "You can use the USB port on your Surface Pro 4 power supply to charge other devices, like a phone, while your Surface charges. " +
                         "The USB port on the power supply is only for charging, not for data transfer. If you want to use a USB device, plug it into the USB port on your Surface."),
            };

            AnswersFromTextOptions options = new AnswersFromTextOptions("How long does it takes to charge a surface?", records);
            Response<AnswersFromTextResult> response = client.GetAnswersFromText(options);

           foreach (TextAnswer answer in response.Value.Answers)
            {
                if (answer.Confidence > .9)
                {
                    string BestAnswer = response.Value.Answers[0].Answer;

                    Console.WriteLine($"Q:{options.Question}");
                    Console.WriteLine($"A:{BestAnswer}");
                    Console.WriteLine($"Confidence Score: ({response.Value.Answers[0].Confidence:P2})"); //:P2 converts the result to a percentage with 2 decimals of accuracy. 
                    break;
                }
                else
                {
                    Console.WriteLine($"Q:{options.Question}");
                    Console.WriteLine("No answers met the requested confidence score.");
                    break;
                }
            }

        }
    }
}
```

To run the code above, replace the `Program.cs` with the contents of the script block above and modify the `endpoint` and `credential` variables to correspond to the language resource you created as part of the prerequisites.

In this case, we iterate through all responses and only return the response with the highest confidence score that is greater than 0.9. To understand more about the options available with `GetAnswersFromText`.

