---
# Mandatory fields.
title: Write app authentication code
titleSuffix: Azure Digital Twins
description: See how to write authentication code in a client application
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 10/7/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Write client app authentication code

After you [set up an Azure Digital Twins instance and authentication](how-to-set-up-instance-portal.md), you can create a client application that you will use to interact with the instance. Once you have set up a starter client project, you'll need to **write code in that client app to authenticate it** against the Azure Digital Twins instance.

Azure Digital Twins performs authentication using [Azure AD Security Tokens based on OAUTH 2.0](../active-directory/develop/security-tokens.md#json-web-tokens-jwts-and-claims). To authenticate your SDK, you'll need to get a bearer token with the right permissions to Azure Digital Twins, and pass it along with your API calls. 

This article describes how to obtain credentials using the `Azure.Identity` client library. While this article shows code examples in C#, such as what you'd write for the [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins/client?view=azure-dotnet-preview&preserve-view=true), you can use a version of `Azure.Identity` regardless of what SDK you're using (for more on the SDKs available for Azure Digital Twins, see [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis-sdks.md)).

## Prerequisites

First, complete the setup steps in [*How-to: Set up an instance and authentication*](how-to-set-up-instance-portal.md). This will ensure that you have an Azure Digital Twins instance and that your user has access permissions. After that setup, you are ready to write client app code.

To proceed, you will need a client app project in which you write your code. If you don't already have a client app project set up, create a basic project in your language of choice to use with this tutorial.

## Common authentication methods with Azure.Identity

`Azure.Identity` is a client library that provides several credential-obtaining methods that you can use to get a bearer token and authenticate with your SDK. Although this article gives examples in C#, you can view `Azure.Identity` for several languages, including...

* [.NET (C#)](/dotnet/api/azure.identity?preserve-view=true&view=azure-dotnet)
* [Java](/java/api/overview/azure/identity-readme?preserve-view=true&view=azure-java-stable)
* [JavaScript](/javascript/api/overview/azure/identity-readme?preserve-view=true&view=azure-node-latest)
* [Python](/python/api/overview/azure/identity-readme?preserve-view=true&view=azure-python)

Three common credential-obtaining methods in `Azure.Identity` are:

* [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential?preserve-view=true&view=azure-dotnet) provides a default `TokenCredential` authentication flow for applications that will be deployed to Azure, and is **the recommended choice for local development**. It also can be enabled to try the other two methods recommended in this article; it wraps `ManagedIdentityCredential` and can access `InteractiveBrowserCredential` with a configuration variable.
* [ManagedIdentityCredential](/dotnet/api/azure.identity.managedidentitycredential?preserve-view=true&view=azure-dotnet) works great in cases where you need [managed identities (MSI)](../active-directory/managed-identities-azure-resources/overview.md), and is a good candidate for working with Azure Functions and deploying to Azure services.
* [InteractiveBrowserCredential](/dotnet/api/azure.identity.interactivebrowsercredential?preserve-view=true&view=azure-dotnet) is intended for interactive applications, and can be used to create an authenticated SDK client

The following example shows how to use each of these with the .NET (C#) SDK.

## Authentication examples: .NET (C#) SDK

This section shows an example in C# for using the provided .NET SDK to write authentication code.

First, include the SDK package `Azure.DigitalTwins.Core` and the `Azure.Identity` package in your project. Depending on your tools of choice, you can include the packages using the Visual Studio package manager or the `dotnet` command line tool. 

You'll also need to add the following using statements to your project code:

```csharp
using Azure.Identity;
using Azure.DigitalTwins.Core;
```

Then, add code to obtain credentials using one of the methods in `Azure.Identity`.

### DefaultAzureCredential method

[DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential?preserve-view=true&view=azure-dotnet) provides a default `TokenCredential` authentication flow for applications that will be deployed to Azure, and is **the recommended choice for local development**.

To use the default Azure credentials, you'll need the Azure Digital Twins instance's URL ([instructions to find](how-to-set-up-instance-portal.md#verify-success-and-collect-important-values)).

Here is a code sample to add a `DefaultAzureCredential` to your project:

```csharp
// The URL of your instance, starting with the protocol (https://)
private static string adtInstanceUrl = "https://<your-Azure-Digital-Twins-instance-URL>";

//...

DigitalTwinsClient client;
try
{
    var credential = new DefaultAzureCredential();
    client = new DigitalTwinsClient(new Uri(adtInstanceUrl), credential);
} catch(Exception e)
{
    Console.WriteLine($"Authentication or client creation error: {e.Message}");
    Environment.Exit(0);
}
```

#### Set up local Azure credentials

[!INCLUDE [Azure Digital Twins: local credentials prereq (inner)](../../includes/digital-twins-local-credentials-inner.md)]

### ManagedIdentityCredential method

The [ManagedIdentityCredential](/dotnet/api/azure.identity.managedidentitycredential?preserve-view=true&view=azure-dotnet) method works great in cases where you need [managed identities (MSI)](../active-directory/managed-identities-azure-resources/overview.md)—for example, when working with Azure Functions.

This means that you may use `ManagedIdentityCredential` in the same project as `DefaultAzureCredential` or `InteractiveBrowserCredential`, to authenticate a different part of the project.

To use the default Azure credentials, you'll need the Azure Digital Twins instance's URL ([instructions to find](how-to-set-up-instance-portal.md#verify-success-and-collect-important-values)).

In an Azure function, you can use the managed identity credentials like this:

```csharp
ManagedIdentityCredential cred = new ManagedIdentityCredential(adtAppId);
DigitalTwinsClientOptions opts = 
    new DigitalTwinsClientOptions { Transport = new HttpClientTransport(httpClient) });
client = new DigitalTwinsClient(new Uri(adtInstanceUrl), cred, opts);
```

### InteractiveBrowserCredential method

The [InteractiveBrowserCredential](/dotnet/api/azure.identity.interactivebrowsercredential?preserve-view=true&view=azure-dotnet) method is intended for interactive applications and will bring up a web browser for authentication. You can use this instead of `DefaultAzureCredential` in cases where you require interactive authentication.

To use the interactive browser credentials, you will need an **app registration** that has permissions to the Azure Digital Twins APIs. For steps on how to set up this app registration, see [*How-to: Create an app registration*](how-to-create-app-registration.md). Once the app registration is set up, you'll need...
* the app registration's *Application (client) ID* ([instructions to find](how-to-create-app-registration.md#collect-client-id-and-tenant-id))
* the app registration's *Directory (tenant) ID* ([instructions to find](how-to-create-app-registration.md#collect-client-id-and-tenant-id))
* the Azure Digital Twins instance's URL ([instructions to find](how-to-set-up-instance-portal.md#verify-success-and-collect-important-values))

Here is an example of the code to create an authenticated SDK client using `InteractiveBrowserCredential`.

```csharp
// Your client / app registration ID
private static string clientId = "<your-client-ID>"; 
// Your tenant / directory ID
private static string tenantId = "<your-tenant-ID>";
// The URL of your instance, starting with the protocol (https://)
private static string adtInstanceUrl = "https://<your-Azure-Digital-Twins-instance-URL>";

//...

DigitalTwinsClient client;
try
{
    var credential = new InteractiveBrowserCredential(tenantId, clientId);
    client = new DigitalTwinsClient(new Uri(adtInstanceUrl), credential);
} catch(Exception e)
{
    Console.WriteLine($"Authentication or client creation error: {e.Message}");
    Environment.Exit(0);
}
```

>[!NOTE]
> While you can place the client ID, tenant ID and instance URL directly into the code as shown above, it's a good idea to have your code get these values from a configuration file or environment variable instead.

#### Other notes about authenticating Azure Functions

See [*How-to: Set up an Azure function for processing data*](how-to-create-azure-function.md) for a more complete example that explains some of the important configuration choices in the context of functions.

Also, to use authentication in a function, remember to:
* [Enable managed identity](../app-service/overview-managed-identity.md?tabs=dotnet)
* Use [environment variables](/sandbox/functions-recipes/environment-variables?tabs=csharp) as appropriate
* Assign permissions to the functions app that enable it to access the Digital Twins APIs. For more information on Azure Functions processes, see [*How-to: Set up an Azure function for processing data*](how-to-create-azure-function.md).

## Other credential methods

If the highlighted authentication scenarios above do not cover the needs of your app, you can explore other types of authentication offered in the [**Microsoft identity platform**](../active-directory/develop/v2-overview.md#getting-started). The documentation for this platform covers additional authentication scenarios, organized by application type.

## Next steps

Read more about how security works in Azure Digital Twins:
* [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md)

Or, now that authentication is set up, move on to creating models in your instance:
* [*How-to: Manage custom models*](how-to-manage-model.md)