---
title: Bing Autosuggest C# client library quickstart 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 05/06/2020
ms.author: aahi
---

Get started with the Bing Autosuggest client library for .NET. Follow these steps to install the package and try out the example code for basic tasks.

Use the Bing Autosuggest client library for .NET to get search suggestions based on partial query strings.

[Reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/bingautosuggest?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Search.BingAutoSuggest) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Search.AutoSuggest/) | [Sample code](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/BingAutoSuggest/Program.cs)

## Prerequisites

* An Azure subscription. If you don't already have an Azure subscription, [you can create one for free](https://azure.microsoft.com/free/).
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).

[!INCLUDE [cognitive-services-bing-autosuggest-signup-requirements](~/includes/cognitive-services-bing-autosuggest-signup-requirements.md)]

## Create environment variables

>[!NOTE]
> The endpoints for non-trial resources created after July 1, 2019 use the custom subdomain format shown below. For more information and a complete list of regional endpoints, see [Custom subdomain names for Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-custom-subdomains). 

Using your key and endpoint from the resource you created, create two environment variables for authentication:
<!-- replace the below variable names with the names expected in the code sample.-->
* `AUTOSUGGEST_SUBSCRIPTION_KEY`: The resource key for authenticating your requests.
* `AUTOSUGGEST_ENDPOINT`: The resource endpoint for sending API requests. It should look like this: `https://<your-custom-subdomain>.api.cognitive.microsoft.com`. 

Use the instructions for your operating system.
<!-- replace the below endpoint and key examples -->
### [Windows](#tab/windows)

```console
setx AUTOSUGGEST_SUBSCRIPTION_KEY <replace-with-your-autosuggest-api-key>
setx AUTOSUGGEST_ENDPOINT <replace-with-your-autosuggest-api-endpoint>
```

After you add the environment variable, restart the console window.

### [Linux](#tab/linux)

```bash
export AUTOSUGGEST_SUBSCRIPTION_KEY=<replace-with-your-autosuggest-api-key>
export AUTOSUGGEST_ENDPOINT=<replace-with-your-autosuggest-api-endpoint>
```

After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.

### [macOS](#tab/unix)

Edit your `.bash_profile`, and add the environment variable:

```bash
export AUTOSUGGEST_SUBSCRIPTION_KEY=<replace-with-your-autosuggest-api-key>
export AUTOSUGGEST_ENDPOINT=<replace-with-your-autosuggest-api-endpoint>
```

After you add the environment variable, run `source .bash_profile` from your console window to make the changes effective.
***

## Create a new C# application

Create a new .NET Core application in your preferred editor or IDE. 

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `bing-autosuggest-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *program.cs*. 

```console
dotnet new console -n bing-autosuggest-quickstart
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

From the project directory, open the *program.cs* file in your preferred editor or IDE. Add the following `using` directives:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
```

In the `Program` class, create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you'll need to close and reopen the editor, IDE, or shell running it to access the variable.

```csharp
private const string key_var = "AUTOSUGGEST_SUBSCRIPTION_KEY";
private static readonly string subscription_key = Environment.GetEnvironmentVariable(key_var);

// Note you must use the same region as you used to get your subscription key.
private const string endpoint_var = "AUTOSUGGEST_ENDPOINT";
private static readonly string endpoint = Environment.GetEnvironmentVariable(endpoint_var);
```

In the application's `Main` method, add the following method calls, which you'll define later.

```csharp
static void Main(string[] args)
{
    Task.WaitAll(RunQuickstart());
    Console.WriteLine("Press any key to exit.");
    Console.Read();
}
```

## Install the client library

Within the application directory, install the Bing Autosuggest client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.CognitiveServices.Search.AutoSuggest --version 2.0.0
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.

## Code examples

These code snippets show you how to do the following tasks with the Bing Autosuggest client library for .NET:

* [Authenticate the client](#authenticate-the-client)
* [Send an Autosuggest request](#send-an-autosuggest-request)

### Authenticate the client

> [!NOTE]
> This quickstart assumes you've [created an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for your Bing Autosuggest key, named `AUTOSUGGEST_SUBSCRIPTION_KEY`, and one for your endpoint, named `AUTOSUGGEST_ENDPOINT`.


In a new asynchronous method, instantiate a client with your endpoint and key. Create an [ApiKeyServiceClientCredentials](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.search.autosuggest.apikeyserviceclientcredentials?view=azure-dotnet) object with your key, and use it with your endpoint to create an [AutosuggestClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.search.autosuggest.autosuggestclient?view=azure-dotnet) object.

```csharp
async static Task RunQuickstart()
{
    // Generate the credentials and create the client.
    var credentials = new Microsoft.Azure.CognitiveServices.Search.AutoSuggest.ApiKeyServiceClientCredentials(subscription_key);
    var client = new AutoSuggestClient(credentials, new System.Net.Http.DelegatingHandler[] { })
    {
        Endpoint = endpoint
    };
}
```

### Send an Autosuggest request

In the same method, use the client's [AutoSuggestMethodAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.search.autosuggest.autosuggestclientextensions.autosuggestmethodasync?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Search_AutoSuggest_AutoSuggestClientExtensions_AutoSuggestMethodAsync_Microsoft_Azure_CognitiveServices_Search_AutoSuggest_IAutoSuggestClient_System_String_System_String_System_String_System_String_System_String_System_String_System_String_System_String_System_String_System_String_System_String_System_Collections_Generic_IList_System_String__System_Threading_CancellationToken_) method to send a query to Bing. Then, iterate over the [Suggestions](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.search.autosuggest.models.suggestions?view=azure-dotnet) response, and print the first suggestion.

```csharp
var result = await client.AutoSuggestMethodAsync("xb");
var groups = result.SuggestionGroups;
if (groups.Count > 0) {
    var group = groups[0];
    Console.Write("First suggestion group: {0}\n", group.Name);
    var suggestions = group.SearchSuggestions;
    if (suggestions.Count > 0)
    {
        Console.WriteLine("First suggestion:");
        Console.WriteLine("Query: {0}", suggestions[0].Query);
        Console.WriteLine("Display text: {0}", suggestions[0].DisplayText);
    }
    else
    {
        Console.WriteLine("No suggestions found in this group.");
    }
}
else
{
    Console.WriteLine("No suggestions found.");
}
```

## Run the application

Run the application from your application directory with the `dotnet run` command.

```dotnet
dotnet run
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it:

* [Delete a resource group in the Azure portal](../../../cognitive-services-apis-create-account.md#clean-up-resources).
* [Delete a resource group in the Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources).

## Next steps

> [!div class="nextstepaction"]
> [Bing Autosuggest tutorial](../../tutorials/autosuggest.md)

## See also

- [What is Bing Autosuggest?](../../get-suggested-search-terms.md)
- [Bing Autosuggest dotnet reference](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/bingautosuggest?view=azure-dotnet)
