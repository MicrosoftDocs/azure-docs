---
# Mandatory fields.
title: Write app authentication code
titleSuffix: Azure Digital Twins
description: Learn how to write authentication code in a client application
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 03/01/2023
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Write client app authentication code

After you [set up an Azure Digital Twins instance and authentication](how-to-set-up-instance-portal.md), you can create a client application that you'll use to interact with the instance. Once you have set up a starter client project, you'll need to **write code in that client app to authenticate it** against the Azure Digital Twins instance.

Azure Digital Twins authenticates using [Azure AD Security Tokens based on OAUTH 2.0](../active-directory/develop/security-tokens.md#json-web-tokens-and-claims). To authenticate your SDK, you'll need to get a bearer token with the right permissions to Azure Digital Twins, and pass it along with your API calls. 

This article describes how to obtain credentials using the `Azure.Identity` client library. While this article shows code examples in C#, such as what you'd write for the [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins.core-readme), you can use a version of `Azure.Identity` regardless of what SDK you're using (for more on the SDKs available for Azure Digital Twins, see [Azure Digital Twins APIs and SDKs](concepts-apis-sdks.md).

## Prerequisites

First, complete the setup steps in [Set up an instance and authentication](how-to-set-up-instance-portal.md). This setup will ensure you have an Azure Digital Twins instance and your user has access permissions. After that setup, you're ready to write client app code.

To continue, you'll need a client app project in which you write your code. If you don't already have a client app project set up, create a basic project in your language of choice to use with this tutorial.

## Authenticate using Azure.Identity library

`Azure.Identity` is a client library that provides several credential-obtaining methods that you can use to get a bearer token and authenticate with your SDK. Although this article gives examples in C#, you can view `Azure.Identity` for several languages, including...

* [.NET (C#)](/dotnet/api/azure.identity?view=azure-dotnet&preserve-view=true)
* [Java](/java/api/overview/azure/identity-readme?view=azure-java-stable&preserve-view=true)
* [JavaScript](/javascript/api/overview/azure/identity-readme?view=azure-node-latest&preserve-view=true)
* [Python](/python/api/overview/azure/identity-readme?view=azure-python&preserve-view=true)

Three common credential-obtaining methods in `Azure.Identity` are:

* [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet&preserve-view=true) provides a default `TokenCredential` authentication flow for applications that will be deployed to Azure, and is **the recommended choice for local development**. It also can be enabled to try the other two methods recommended in this article; it wraps `ManagedIdentityCredential` and can access `InteractiveBrowserCredential` with a configuration variable.
* [ManagedIdentityCredential](/dotnet/api/azure.identity.managedidentitycredential?view=azure-dotnet&preserve-view=true) works well in cases where you need [managed identities (MSI)](../active-directory/managed-identities-azure-resources/overview.md), and is a good candidate for working with Azure Functions and deploying to Azure services.
* [InteractiveBrowserCredential](/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet&preserve-view=true) is intended for interactive applications, and can be used to create an authenticated SDK client.

The rest of this article shows how to use these methods with the [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins.core-readme).

### Add Azure.Identity to your .NET project

To set up your .NET project to authenticate with `Azure.Identity`, complete the following steps:

1. Include the SDK package `Azure.DigitalTwins.Core` and the `Azure.Identity` package in your project. Depending on your tools of choice, you can include the packages using the Visual Studio package manager or the `dotnet` command-line tool. 

1. Add the following using statements to your project code:

    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/authentication.cs" id="Azure_Digital_Twins_dependencies":::

Next, add code to obtain credentials using one of the methods in `Azure.Identity`. The following sections give more detail about using each one.

### DefaultAzureCredential method

[DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet&preserve-view=true) provides a default `TokenCredential` authentication flow for applications that will be deployed to Azure, and is **the recommended choice for local development**.

To use the default Azure credentials, you'll need the Azure Digital Twins instance's URL ([instructions to find](how-to-set-up-instance-portal.md#verify-success-and-collect-important-values)).

Here's a code sample to add a `DefaultAzureCredential` to your project:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/authentication.cs" id="DefaultAzureCredential_full":::

[!INCLUDE [Azure Digital Twins: DefaultAzureCredential known issue note](../../includes/digital-twins-defaultazurecredential-note.md)]

#### Set up local Azure credentials

[!INCLUDE [Azure Digital Twins: local credentials prereq (inner)](../../includes/digital-twins-local-credentials-inner.md)]

### ManagedIdentityCredential method

The [ManagedIdentityCredential](/dotnet/api/azure.identity.managedidentitycredential?view=azure-dotnet&preserve-view=true) method works well in cases where you need [managed identities (MSI)](../active-directory/managed-identities-azure-resources/overview.md)—for example, when [authenticating with Azure Functions](#authenticate-azure-functions).

This means that you can use `ManagedIdentityCredential` in the same project as `DefaultAzureCredential` or `InteractiveBrowserCredential`, to authenticate a different part of the project.

To use the default Azure credentials, you'll need the Azure Digital Twins instance's URL ([instructions to find](how-to-set-up-instance-portal.md#verify-success-and-collect-important-values)). You may also need an [app registration](./how-to-create-app-registration.md) and the registration's [Application (client) ID](./how-to-create-app-registration.md#collect-client-id-and-tenant-id).

In an Azure function, you can use the managed identity credentials like this:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/authentication.cs" id="ManagedIdentityCredential":::

While creating the credential, leaving the parameter empty as shown above will return the credential for the function app's system-assigned identity, if it has one. To specify a user-assigned identity instead, pass the user-assigned identity's **client ID** into the parameter. 

### InteractiveBrowserCredential method

The [InteractiveBrowserCredential](/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet&preserve-view=true) method is intended for interactive applications and will bring up a web browser for authentication. You can use this method instead of `DefaultAzureCredential` in cases where you require interactive authentication.

To use the interactive browser credentials, you'll need an **app registration** that has permissions to the Azure Digital Twins APIs. For steps on how to set up this app registration, see [Create an app registration with Azure Digital Twins access](./how-to-create-app-registration.md). Once the app registration is set up, you'll need...
* [the app registration's Application (client) ID](./how-to-create-app-registration.md#collect-client-id-and-tenant-id)
* [the app registration's Directory (tenant) ID](./how-to-create-app-registration.md#collect-client-id-and-tenant-id)
* [the Azure Digital Twins instance's URL](how-to-set-up-instance-portal.md#verify-success-and-collect-important-values)

Here's an example of the code to create an authenticated SDK client using `InteractiveBrowserCredential`.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/authentication.cs" id="InteractiveBrowserCredential":::

>[!NOTE]
> While you can place the client ID, tenant ID and instance URL directly into the code as shown above, it's a good idea to have your code get these values from a configuration file or environment variable instead.

## Authenticate Azure Functions

This section contains some of the important configuration choices in the context of authenticating with Azure Functions. First, you'll read about recommended class-level variables and authentication code that will allow the function to access Azure Digital Twins. Then, you'll read about some final configuration steps to complete for your function after its code is published to Azure. 

### Write application code

When writing the Azure function, consider adding these variables and code to your function:

* **Code to read the Azure Digital Twins service URL as an environment variable or configuration setting.** It's a good practice to read the service URL from an [application setting/environment variable](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal), rather than hard-coding it in the function. In an Azure function, that code to read the environment variable might look like this: 

    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs" id="ADT_service_URL":::

    Later, after publishing the function, you'll create and set the value of the environment variable for this code to read. For instructions on how to do so, skip ahead to [Configure application settings](#configure-application-settings).

* **A static variable to hold an HttpClient instance.** HttpClient is relatively expensive to create, so you'll probably want to create it once with the authentication code to avoid creating it for every function invocation.

    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs" id="HTTP_client":::

* **Managed identity credential.** Create a managed identity credential that your function will use to access Azure Digital Twins. 

    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs" id="ManagedIdentityCredential":::

    Leaving the parameter empty as shown above will return the credential for the function app's system-assigned identity, if it has one. To specify a user-assigned identity instead, pass the user-assigned identity's **client ID** into the parameter. 

    Later, after publishing the function, you'll make sure the function's identity has permission to access the Azure Digital Twins APIs. For instructions on how to do so, skip ahead to [Assign an access role](#assign-an-access-role).    

* **A local variable _DigitalTwinsClient_.** Add the variable inside your function to hold your Azure Digital Twins client instance. _Don't_ make this variable static inside your class.
    :::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs" id="DigitalTwinsClient":::

* **A null check for _adtInstanceUrl_.** Add the null check and then wrap your function logic in a try/catch block to catch any exceptions.

After these variables are added to a function, your function code might look like the following example.

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/adtIngestFunctionSample.cs":::

When you're finished with your function code, including adding authentication and the function's logic, [publish the app to Azure](../azure-functions/functions-develop-vs.md#publish-to-azure)

### Configure published app

Finally, complete the following configuration steps for a published Azure function to make sure it can access your Azure Digital Twins instance.

[!INCLUDE [digital-twins-configure-function-app-cli.md](../../includes/digital-twins-configure-function-app-cli.md)]

## Authenticate across tenants

Azure Digital Twins is a service that only supports one [Azure Active Directory (Azure AD) tenant](../active-directory/develop/quickstart-create-new-tenant.md): the main tenant from the subscription where the Azure Digital Twins instance is located.

[!INCLUDE [digital-twins-tenant-limitation](../../includes/digital-twins-tenant-limitation.md)]

If you need to access your Azure Digital Twins instance using a service principal or user account that belongs to a different tenant from the instance, you can have each federated identity from another tenant request a **token** from the Azure Digital Twins instance's "home" tenant. 

[!INCLUDE [digital-twins-tenant-solution-1](../../includes/digital-twins-tenant-solution-1.md)]

You can also specify the home tenant in the credential options in your code. 

[!INCLUDE [digital-twins-tenant-solution-2](../../includes/digital-twins-tenant-solution-2.md)]

## Other credential methods

If the highlighted authentication scenarios above don't cover the needs of your app, you can explore other types of authentication offered in the [Microsoft identity platform](../active-directory/develop/v2-overview.md#getting-started). The documentation for this platform covers more authentication scenarios, organized by application type.

## Next steps

Read more about how security works in Azure Digital Twins:
* [Security for Azure Digital Twins solutions](concepts-security.md)

Or, now that authentication is set up, move on to creating and managing models in your instance:
* [Manage DTDL models](how-to-manage-model.md)