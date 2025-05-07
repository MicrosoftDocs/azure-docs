---
title: Authenticate an application to access resources
description: This article provides information about authenticating an application with Microsoft Entra ID to access Azure Event Hubs resources
ms.topic: concept-article
ms.date: 06/26/2024
ms.custom: subject-rbac-steps
#customer intent: As a developer, I want to know how to authenticate an application with Azure Event Hubs using Microsoft Entra ID. 
---

# Authenticate an application with Microsoft Entra ID to access Event Hubs resources
Microsoft Azure provides integrated access control management for resources and applications based on Microsoft Entra ID. A key advantage of using Microsoft Entra ID with Azure Event Hubs is that you don't need to store your credentials in the code anymore. Instead, you can request an OAuth 2.0 access token from the Microsoft identity platform. The resource name to request a token is `https://eventhubs.azure.net/`, and it's the same for all clouds/tenants (For Kafka clients, the resource to request a token is `https://<namespace>.servicebus.windows.net`). Microsoft Entra authenticates the security principal (a user, group, service principal, or managed identity) running the application. If the authentication succeeds, Microsoft Entra ID returns an access token to the application, and the application can then use the access token to authorize request to Azure Event Hubs resources.

When a role is assigned to a Microsoft Entra security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of subscription, the resource group, the Event Hubs namespace, or any resource under it. A Microsoft Entra security can assign roles to a user, a group, an application service principal, or a [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md). 

> [!NOTE]
> A role definition is a collection of permissions. Azure role-based access control (Azure RBAC) controls how these permissions are enforced through role assignment. A role assignment consists of three elements: security principal, role definition, and scope. For more information, see [Understanding the different roles](../role-based-access-control/overview.md).

## Built-in roles for Azure Event Hubs
Azure provides the following Azure built-in roles for authorizing access to Event Hubs data using Microsoft Entra ID and OAuth:

- [Azure Event Hubs Data Owner](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-owner): Use this role to give complete access to Event Hubs resources.
- [Azure Event Hubs Data Sender](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-sender): A security principal assigned to this role can send events to a specific event hub or all event hubs in a namespace. 
- [Azure Event Hubs Data Receiver](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-receiver): A security principal assigned to this role can receive events from a specific event hub or all event hubs in a namespace.

For Schema Registry built-in roles, see [Schema Registry roles](schema-registry-concepts.md#azure-role-based-access-control).

> [!IMPORTANT]
> Our preview release supported adding Event Hubs data access privileges to Owner or Contributor role. However, data access privileges for Owner and Contributor role are no longer honored. If you are using the Owner or Contributor role, switch to using the Azure Event Hubs Data Owner role.


## Authenticate from an application
A key advantage of using Microsoft Entra ID with Event Hubs is that your credentials no longer need to be stored in your code. Instead, you can request an OAuth 2.0 access token from Microsoft identity platform. Microsoft Entra authenticates the security principal (a user, a group, or service principal) running the application. If authentication succeeds, Microsoft Entra ID returns the access token to the application, and the application can then use the access token to authorize requests to Azure Event Hubs.

The following sections show you how to configure your native application or web application for authentication with Microsoft identity platform 2.0. For more information about Microsoft identity platform 2.0, see [Microsoft identity platform (v2.0) overview](../active-directory/develop/v2-overview.md).

For an overview of the OAuth 2.0 code grant flow, see [Authorize access to Microsoft Entra web applications using the OAuth 2.0 code grant flow](../active-directory/develop/v2-oauth2-auth-code-flow.md).


### Register your application with a Microsoft Entra tenant
The first step in using Microsoft Entra ID to authorize Event Hubs resources is registering your client application with a Microsoft Entra tenant from the [Azure portal](https://portal.azure.com/). Follow steps in the [Quickstart: Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md) to register an application in Microsoft Entra ID that represents your application trying to access Event Hubs resources. 

When you register your client application, you supply information about the application. Microsoft Entra ID then provides a client ID (also called an application ID) that you can use to associate your application with Microsoft Entra runtime. To learn more about the client ID, see [Application and service principal objects in Microsoft Entra ID](../active-directory/develop/app-objects-and-service-principals.md). 


> [!Note]
> If you register your application as a native application, you can specify any valid URI for the Redirect URI. For native applications, this value does not have to be a real URL. For web applications, the redirect URI must be a valid URI, because it specifies the URL to which tokens are provided.

After you register your application, you see the **Application (client) ID** under **Settings**:

:::image type="content" source="./media/authenticate-application/application-id.png" alt-text="Screenshot showing the app registration page with application ID highlighted." lightbox="./media/authenticate-application/application-id.png":::


### Create a client secret   
The application needs a client secret to prove its identity when requesting a token. Follow steps from [Add a client secret](../active-directory/develop/quickstart-register-app.md#add-a-client-secret) to create a client secret for your app in Microsoft Entra ID. 


## Assign Azure roles using the Azure portal  
Assign one of the [Event Hubs roles](#built-in-roles-for-azure-event-hubs) to the application's service principal at the desired scope (Event Hubs namespace, resource group, subscription). For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

Once you define the role and its scope, you can test this behavior with samples [in this GitHub location](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac). To learn more on managing access to Azure resources using Azure role-based access control (RBAC) and the Azure portal, see [this article](..//role-based-access-control/role-assignments-portal.yml). 


### Client libraries for token acquisition  
Once you registered your application and granted it permissions to send/receive data in Azure Event Hubs, you can add code to your application to authenticate a security principal and acquire OAuth 2.0 token. To authenticate and acquire the token, you can use either one of the [Microsoft identity platform authentication libraries](../active-directory/develop/reference-v2-libraries.md) or another open-source library that supports OpenID or Connect 1.0. Your application can then use the access token to authorize a request against Azure Event Hubs.

For scenarios where acquiring tokens is supported, see the [Scenarios](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/scenarios) section of the [Microsoft Authentication Library (MSAL) for .NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) GitHub repository.

## Samples
- [RBAC samples using the legacy .NET Microsoft.Azure.EventHubs package](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac). We're working on creating a new version of this sample using the latest Azure.Messaging.EventHubs package. See the already converted [Managed Identity](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Azure.Messaging.EventHubs/ManagedIdentityWebApp).
- [RBAC sample using the legacy Java com.microsoft.azure.eventhubs package](https://github.com/Azure/azure-event-hubs/tree/master/samples/Java/Rbac). You can use the [migration guide](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/migration-guide.md) to migrate this sample to use the new package (`com.azure.messaging.eventhubs`). To learn more about using the new package in general, see samples [here](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/eventhubs/azure-messaging-eventhubs/src/samples/java/com/azure/messaging/eventhubs).  
    

## Related content
- To learn more about Azure RBAC, see [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md)?
- To learn how to assign and manage Azure role assignments with Azure PowerShell, Azure CLI, or the REST API, see these articles:
    - [Add or remove Azure role assignments using Azure PowerShell](../role-based-access-control/role-assignments-powershell.md)  
    - [Add or remove Azure role assignments using Azure CLI](../role-based-access-control/role-assignments-cli.md)
    - [Add or remove Azure role assignments using the REST API](../role-based-access-control/role-assignments-rest.md)
    - [Add Azure role assignments using Azure Resource Manager templates](../role-based-access-control/role-assignments-template.md)

See the following related articles:
- [Authenticate a managed identity with Microsoft Entra ID to access Event Hubs Resources](authenticate-managed-identity.md)
- [Authenticate requests to Azure Event Hubs using Shared Access Signatures](authenticate-shared-access-signature.md)
- [Authorize access to Event Hubs resources using Microsoft Entra ID](authorize-access-azure-active-directory.md)
- [Authorize access to Event Hubs resources using Shared Access Signatures](authorize-access-shared-access-signature.md)
