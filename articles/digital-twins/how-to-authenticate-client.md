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

Azure Digital Twins performs authentication using [Azure AD Security Tokens based on OAUTH 2.0](../active-directory/develop/security-tokens.md#json-web-tokens-and-claims). To authenticate your SDK, you'll need to get a bearer token with the right permissions to Azure Digital Twins, and pass it along with your API calls. 

This article describes how to obtain credentials using the `Azure.Identity` client library. While this article shows code examples in C#, such as what you'd write for the [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins/client), you can use a version of `Azure.Identity` regardless of what SDK you're using (for more on the SDKs available for Azure Digital Twins, see [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis-sdks.md)).

## Prerequisites

First, complete the setup steps in [*How-to: Set up an instance and authentication*](how-to-set-up-instance-portal.md). This will ensure that you have an Azure Digital Twins instance and that your user has access permissions. After that setup, you are ready to write client app code.

To proceed, you will need a client app project in which you write your code. If you don't already have a client app project set up, create a basic project in your language of choice to use with this tutorial.

## Common authentication methods with Azure.Identity

`Azure.Identity` is a client library that provides several credential-obtaining methods that you can use to get a bearer token and authenticate with your SDK. Although this article gives examples in C#, you can view `Azure.Identity` for several languages, including...

* [.NET (C#)](/dotnet/api/azure.identity)
* [Java](/java/api/overview/azure/identity-readme)
* [JavaScript](/javascript/api/overview/azure/identity-readme)
* [Python](/python/api/overview/azure/identity-readme)

Three common credential-obtaining methods in `Azure.Identity` are:

* [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) provides a default `TokenCredential` authentication flow for applications that will be deployed to Azure, and is **the recommended choice for local development**. It also can be enabled to try the other two methods recommended in this article; it wraps `ManagedIdentityCredential` and can access `InteractiveBrowserCredential` with a configuration variable.
* [ManagedIdentityCredential](/dotnet/api/azure.identity.managedidentitycredential) works great in cases where you need [managed identities (MSI)](../active-directory/managed-identities-azure-resources/overview.md), and is a good candidate for working with Azure Functions and deploying to Azure services.
* [InteractiveBrowserCredential](/dotnet/api/azure.identity.interactivebrowsercredential) is intended for interactive applications, and can be used to create an authenticated SDK client

The following example shows how to use each of these with the .NET (C#) SDK.

## Authentication examples: .NET (C#) SDK

This section shows an example in C# for using the provided .NET SDK to write authentication code.

First, include the SDK package `Azure.DigitalTwins.Core` and the `Azure.Identity` package in your project. Depending on your tools of choice, you can include the packages using the Visual Studio package manager or the `dotnet` command line tool. 

You'll also need to add the following using statements to your project code:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/authentication.cs" id="Azure_Digital_Twins_dependencies":::

Then, add code to obtain credentials using one of the methods in `Azure.Identity`.

### DefaultAzureCredential method

[DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) provides a default `TokenCredential` authentication flow for applications that will be deployed to Azure, and is **the recommended choice for local development**.

To use the default Azure credentials, you'll need the Azure Digital Twins instance's URL ([instructions to find](how-to-set-up-instance-portal.md#verify-success-and-collect-important-values)).

Here is a code sample to add a `DefaultAzureCredential` to your project:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/authentication.cs" id="DefaultAzureCredential_full":::

#### Set up local Azure credentials

[!INCLUDE [Azure Digital Twins: local credentials prereq (inner)](../../includes/digital-twins-local-credentials-inner.md)]

### ManagedIdentityCredential method

The [ManagedIdentityCredential](/dotnet/api/azure.identity.managedidentitycredential) method works great in cases where you need [managed identities (MSI)](../active-directory/managed-identities-azure-resources/overview.md)—for example, when working with Azure Functions.

This means that you may use `ManagedIdentityCredential` in the same project as `DefaultAzureCredential` or `InteractiveBrowserCredential`, to authenticate a different part of the project.

To use the default Azure credentials, you'll need the Azure Digital Twins instance's URL ([instructions to find](how-to-set-up-instance-portal.md#verify-success-and-collect-important-values)).

In an Azure function, you can use the managed identity credentials like this:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/authentication.cs" id="ManagedIdentityCredential":::

### InteractiveBrowserCredential method

The [InteractiveBrowserCredential](/dotnet/api/azure.identity.interactivebrowsercredential) method is intended for interactive applications and will bring up a web browser for authentication. You can use this instead of `DefaultAzureCredential` in cases where you require interactive authentication.

To use the interactive browser credentials, you will need an **app registration** that has permissions to the Azure Digital Twins APIs. For steps on how to set up this app registration, see [*How-to: Create an app registration*](how-to-create-app-registration.md). Once the app registration is set up, you'll need...
* the app registration's *Application (client) ID* ([instructions to find](how-to-create-app-registration.md#collect-client-id-and-tenant-id))
* the app registration's *Directory (tenant) ID* ([instructions to find](how-to-create-app-registration.md#collect-client-id-and-tenant-id))
* the Azure Digital Twins instance's URL ([instructions to find](how-to-set-up-instance-portal.md#verify-success-and-collect-important-values))

Here is an example of the code to create an authenticated SDK client using `InteractiveBrowserCredential`.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/authentication.cs" id="InteractiveBrowserCredential":::

>[!NOTE]
> While you can place the client ID, tenant ID and instance URL directly into the code as shown above, it's a good idea to have your code get these values from a configuration file or environment variable instead.

#### Other notes about authenticating Azure Functions

See [*How-to: Set up an Azure function for processing data*](how-to-create-azure-function.md) for a more complete example that explains some of the important configuration choices in the context of functions.

Also, to use authentication in a function, remember to:
* [Enable managed identity](../app-service/overview-managed-identity.md?tabs=dotnet)
* Use [environment variables](/sandbox/functions-recipes/environment-variables?tabs=csharp) as appropriate
* Assign permissions to the functions app that enable it to access the Digital Twins APIs. For more information on Azure Functions processes, see [*How-to: Set up an Azure function for processing data*](how-to-create-azure-function.md).

## Authenticate across tenants

Azure Digital Twins is a service that only supports one  [Azure Active Directory (Azure AD) tenant](../active-directory/develop/quickstart-create-new-tenant.md): the main tenant from the subscription where the Azure Digital Twins instance is located.

[!INCLUDE [digital-twins-tenant-limitation](../../includes/digital-twins-tenant-limitation.md)]

If you need to access your Azure Digital Twins instance using a service principal or user account that belongs to a different tenant from the instance, you can have each federated identity from another tenant request a **token** from the Azure Digital Twins instance's "home" tenant. 

[!INCLUDE [digital-twins-tenant-solution-1](../../includes/digital-twins-tenant-solution-1.md)]

You can also specify the home tenant in the credential options in your code. 

[!INCLUDE [digital-twins-tenant-solution-2](../../includes/digital-twins-tenant-solution-2.md)]

## Other credential methods

If the highlighted authentication scenarios above do not cover the needs of your app, you can explore other types of authentication offered in the [**Microsoft identity platform**](../active-directory/develop/v2-overview.md#getting-started). The documentation for this platform covers additional authentication scenarios, organized by application type.

## Next steps

Read more about how security works in Azure Digital Twins:
* [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md)

Or, now that authentication is set up, move on to creating and managing models in your instance:
* [*How-to: Manage DTDL models*](how-to-manage-model.md)