---
title: Bing Autosuggest Go client library quickstart 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 05/06/2020
ms.author: aahi
---

Get started with the Bing Autosuggest client library for Go. Follow these steps to install the library and try out our examples for basic tasks. 

Use the Bing Autosuggest client library for Go to get search suggestions based on partial query strings.

[Reference documentation](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/autosuggest) | [Library source code](https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices/v2.1/textanalytics) | [Sample code](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/go/BingAutoSuggest/BingAutoSuggestQuickstart.go)

## Prerequisites

* An Azure subscription. If you don't already have an Azure subscription, [you can create one for free](https://azure.microsoft.com/free/).
* The latest version of [Go](https://golang.org/dl/).

Begin using the Bing Autosuggest client library by creating an Azure resource. Choose the resource type below that's right for you:

[!INCLUDE [cognitive-services-bing-autosuggest-signup-requirements](~/includes/cognitive-services-bing-autosuggest-signup-requirements.md)]

## Create environment variables

>[!NOTE]
> The endpoints for non-trial resources created after July 1, 2019 use the custom subdomain format shown below. For more information and a complete list of regional endpoints, see [Custom subdomain names for Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-custom-subdomains). 

Using your key and endpoint from the resource you created, create two environment variables for authentication:
<!-- replace the below variable names with the names expected in the code sample.-->
* `AUTOSUGGEST_SUBSCRIPTION_KEY`: The resource key for authenticating your requests.
* `AUTOSUGGEST_ENDPOINT`: The resource endpoint for sending API requests. It should look like this: `https://<your-custom-subdomain>.api.cognitive.microsoft.com` 

Use the instructions for your operating system.
<!-- replace the below endpoint and key examples -->
### [Windows](#tab/windows)

```console
setx BING_AUTOSUGGEST_SUBSCRIPTION_KEY <replace-with-your-autosuggest-api-key>
setx BING_AUTOSUGGEST_ENDPOINT <replace-with-your-autosuggest-api-endpoint>
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

## Create a new Go project

In a console window (cmd, PowerShell, Terminal, Bash), create a new workspace for your Go project and navigate to it. Your workspace will contain three folders: 

* **src**: This directory contains source code and packages. Any packages installed with the `go get` command will reside here.
* **pkg**: This directory contains the compiled Go package objects. These files all have an `.a` extension.
* **bin**: This directory contains the binary executable files that are created when you run `go install`.

> [!TIP]
> Learn more about the structure of a [Go workspace](https://golang.org/doc/code.html#Workspaces). This guide includes information for setting `$GOPATH` and `$GOROOT`.

Let's create a workspace called `my-app` and the required sub directories for `src`, `pkg`, and `bin`:

```
$ mkdir -p my-app/{src, bin, pkg}  
$ cd my-app
```

## Install the client library for Go

Now, let's install the client library for Go: 

```bash
$ go get -u <library-location-or-url>
```

or if you use dep, within your repo run:

```bash
$ dep ensure -add <library-location-or-url>
```

## Create your Go application

Next, let's create a file named `src/sample-app.go`:

```bash
$ cd src
$ touch sample-app.go
```

Open `sample-app.go`, add the package name, and then import the following libraries:

```Go
package main

import (
    "context"
    "fmt"
    "github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/autosuggest"
    "github.com/Azure/go-autorest/autorest"
    "log"
    "os"
)
```

Create a function named `main`. Then, create environment variables for your Bing Autosuggest key and endpoint:

```go
func main() {
    // Add your Bing Autosuggest subscription key to your environment variables.
    if "" == os.Getenv("BING_AUTOSUGGEST_SUBSCRIPTION_KEY") {
        log.Fatal("Please set/export the environment variable BING_AUTOSUGGEST_SUBSCRIPTION_KEY.")
    }
    // Add your Bing Autosuggest endpoint to your environment variables.
    var subscription_key string = os.Getenv("BING_AUTOSUGGEST_ENDPOINT")
    if "" == os.Getenv("BING_AUTOSUGGEST_ENDPOINT") {
        log.Fatal("Please set/export the environment variable BING_AUTOSUGGEST_ENDPOINT.")
    }
    var endpoint string = os.Getenv("BING_AUTOSUGGEST_ENDPOINT")
}
```

## Code examples

These code samples show you how to complete basic tasks using the Bing Autosuggest client library for Go:

* [Authenticate the client](#authenticate-the-client)
* [Send an API request](#send-an-api-request)

### Authenticate the client

> [!NOTE] 
> This quickstart assumes you've [created an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication)  for your Bing autosuggest key, named `BING_AUTOSUGGEST_SUBSCRIPTION_KEY`, and one for your endpoint named `BING_AUTOSUGGEST_ENDPOINT`.

In the `main()` function, instantiate a client with your endpoint and key. 

```go
// Get the context, which is required by the SDK methods.
ctx := context.Background()

client := autosuggest.New()
// Set the subscription key on the client.
client.Authorizer = autorest.NewCognitiveServicesAuthorizer(subscription_key)
client.Endpoint = endpoint
```

### Send an API request

In the same method, use the client's [AutoSuggestMethodAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.search.autosuggest.autosuggestclientextensions.autosuggestmethodasync?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Search_AutoSuggest_AutoSuggestClientExtensions_AutoSuggestMethodAsync_Microsoft_Azure_CognitiveServices_Search_AutoSuggest_IAutoSuggestClient_System_String_System_String_System_String_System_String_System_String_System_String_System_String_System_String_System_String_System_String_System_String_System_Collections_Generic_IList_System_String__System_Threading_CancellationToken_) method to send a query to Bing. Then, iterate over the [Suggestions](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.search.autosuggest.models.suggestions?view=azure-dotnet) response, and print the first suggestion.

```Go
// This should return the query suggestion "xbox."
result, err := client.AutoSuggest (ctx, "xb", "", "", "", "", "", "", "", "", "", "", []autosuggest.ResponseFormat{"Json"})
if nil != err {
    log.Fatal(err)
}

groups := *result.SuggestionGroups
if len(groups) > 0 {
    group, _ := groups[0].AsSuggestionsSuggestionGroup()
    fmt.Printf ("First suggestion group: %s\n", (*group).Name)
    suggestions := *(*group).SearchSuggestions
    if len(suggestions) > 0 {
        fmt.Println("First suggestion:")
        fmt.Printf("Query: %s\n", *suggestions[0].Query)
        fmt.Printf("Display text: %s\n", *suggestions[0].DisplayText)
    } else {
        fmt.Println("No suggestions found in this group.")
    }
} else {
    fmt.Println("No suggestions found.")
}
```

## Run the application

Run your Go application with the `go run [arguments]` command from your application directory.

```Go
go run sample-app.go
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Delete a resource group in the Azure portal](../../../cognitive-services-apis-create-account.md#clean-up-resources).
* [Delete a resource group in the Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources).

## Next steps

> [!div class="nextstepaction"]
> [Bing Autosuggest tutorial](../../tutorials/autosuggest.md)

## See also

- [What is Bing Autosuggest?](../../get-suggested-search-terms.md)
- [Bing Autosuggest API v7 reference](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-autosuggest-api-v7-reference)
