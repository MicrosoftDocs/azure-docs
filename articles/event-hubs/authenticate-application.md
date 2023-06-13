---
title: Authenticate an application to access Azure Event Hubs resources
description: This article provides information about authenticating an application with Azure Active Directory to access Azure Event Hubs resources
ms.topic: conceptual
ms.date: 02/08/2023
ms.custom: subject-rbac-steps
---

# Authenticate an application with Azure Active Directory to access Event Hubs resources
Microsoft Azure provides integrated access control management for resources and applications based on Azure Active Directory (Azure AD). A key advantage of using Azure AD with Azure Event Hubs is that you don't need to store your credentials in the code anymore. Instead, you can request an OAuth 2.0 access token from the Microsoft Identity platform. The resource name to request a token is `https://eventhubs.azure.net/`, and it's the same for all clouds/tenants (For Kafka clients, the resource to request a token is `https://<namespace>.servicebus.windows.net`). Azure AD authenticates the security principal (a user, group, or service principal) running the application. If the authentication succeeds, Azure AD returns an access token to the application, and the application can then use the access token to authorize request to Azure Event Hubs resources.

When a role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of subscription, the resource group, the Event Hubs namespace, or any resource under it. An  Azure AD security can assign roles to a user, a group, an application service principal, or a [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md). 

> [!NOTE]
> A role definition is a collection of permissions. Azure role-based access control (Azure RBAC) controls how these permissions are enforced through role assignment. A role assignment consists of three elements: security principal, role definition, and scope. For more information, see [Understanding the different roles](../role-based-access-control/overview.md).

## Built-in roles for Azure Event Hubs
Azure provides the following Azure built-in roles for authorizing access to Event Hubs data using Azure AD and OAuth:

- [Azure Event Hubs Data Owner](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-owner): Use this role to give complete access to Event Hubs resources.
- [Azure Event Hubs Data Sender](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-sender): Use this role to give access to Event Hubs resources.
- [Azure Event Hubs Data Receiver](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-receiver): Use this role to give receiving access to Event Hubs resources.   

For Schema Registry built-in roles, see [Schema Registry roles](schema-registry-concepts.md#azure-role-based-access-control).

> [!IMPORTANT]
> Our preview release supported adding Event Hubs data access privileges to Owner or Contributor role. However, data access privileges for Owner and Contributor role are no longer honored. If you are using the Owner or Contributor role, switch to using the Azure Event Hubs Data Owner role.


## Authenticate from an application
A key advantage of using Azure AD with Event Hubs is that your credentials no longer need to be stored in your code. Instead, you can request an OAuth 2.0 access token from Microsoft identity platform. Azure AD authenticates the security principal (a user, a group, or service principal) running the application. If authentication succeeds, Azure AD returns the access token to the application, and the application can then use the access token to authorize requests to Azure Event Hubs.

The following sections show you how to configure your native application or web application for authentication with Microsoft identity platform 2.0. For more information about Microsoft identity platform 2.0, see [Microsoft identity platform (v2.0) overview](../active-directory/develop/v2-overview.md).

For an overview of the OAuth 2.0 code grant flow, see [Authorize access to Azure Active Directory web applications using the OAuth 2.0 code grant flow](../active-directory/develop/v2-oauth2-auth-code-flow.md).

### Register your application with an Azure AD tenant
The first step in using Azure AD to authorize Event Hubs resources is registering your client application with an Azure AD tenant from the [Azure portal](https://portal.azure.com/). Follow steps in the [Quickstart: Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md) to register an application in Azure AD that represents your application trying to access Event Hubs resources. 

When you register your client application, you supply information about the application to AD. Azure AD then provides a client ID (also called an application ID) that you can use to associate your application with Azure AD runtime. To learn more about the client ID, see [Application and service principal objects in Azure Active Directory](../active-directory/develop/app-objects-and-service-principals.md). 


> [!Note]
> If you register your application as a native application, you can specify any valid URI for the Redirect URI. For native applications, this value does not have to be a real URL. For web applications, the redirect URI must be a valid URI, because it specifies the URL to which tokens are provided.

After you've registered your application, you'll see the **Application (client) ID** under **Settings**:

:::image type="content" source="./media/authenticate-application/application-id.png" alt-text="Screenshot showing the app registration page with application ID highlighted.":::


### Create a client secret   
The application needs a client secret to prove its identity when requesting a token. Follow steps from [Add a client secret](../active-directory/develop/quickstart-register-app.md#add-a-client-secret) to create a client secret for your app in Azure AD. 


## Assign Azure roles using the Azure portal  
Assign one of the [Event Hubs roles](#built-in-roles-for-azure-event-hubs) to the application's service principal at the desired scope (Event Hubs namespace, resource group, subscription). For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

Once you define the role and its scope, you can test this behavior with samples [in this GitHub location](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac). To learn more on managing access to Azure resources using Azure RBAC and the Azure portal, see [this article](..//role-based-access-control/role-assignments-portal.md). 


### Client libraries for token acquisition  
Once you've registered your application and granted it permissions to send/receive data in Azure Event Hubs, you can add code to your application to authenticate a security principal and acquire OAuth 2.0 token. To authenticate and acquire the token, you can use either one of the [Microsoft identity platform authentication libraries](../active-directory/develop/reference-v2-libraries.md) or another open-source library that supports OpenID or Connect 1.0. Your application can then use the access token to authorize a request against Azure Event Hubs.

For scenarios where acquiring tokens is supported, see the [Scenarios](https://aka.ms/msal-net-scenarios) section of the [Microsoft Authentication Library (MSAL) for .NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) GitHub repository.

## Samples
- [RBAC samples using the latest .NET Azure.Messaging.EventHubs package](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac)
- [RBAC samples using the legacy .NET Microsoft.Azure.EventHubs package](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac). 
- [RBAC sample using the legacy Java com.microsoft.azure.eventhubs package](https://github.com/Azure/azure-event-hubs/tree/master/samples/Java/Rbac). You can use the [migration guide](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/migration-guide.md) to migrate this sample to use the new package (`com.azure.messaging.eventhubs`). To learn more about using the new package in general, see samples [here](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/eventhubs/azure-messaging-eventhubs/src/samples/java/com/azure/messaging/eventhubs).  
    

## Next steps
- To learn more about Azure RBAC, see [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md)?
- To learn how to assign and manage Azure role assignments with Azure PowerShell, Azure CLI, or the REST API, see these articles:
    - [Add or remove Azure role assignments using Azure PowerShell](../role-based-access-control/role-assignments-powershell.md)  
    - [Add or remove Azure role assignments using Azure CLI](../role-based-access-control/role-assignments-cli.md)
    - [Add or remove Azure role assignments using the REST API](../role-based-access-control/role-assignments-rest.md)
    - [Add Azure role assignments using Azure Resource Manager templates](../role-based-access-control/role-assignments-template.md)

See the following related articles:
- [Authenticate a managed identity with Azure Active Directory to access Event Hubs Resources](authenticate-managed-identity.md)
- [Authenticate requests to Azure Event Hubs using Shared Access Signatures](authenticate-shared-access-signature.md)
- [Authorize access to Event Hubs resources using Azure Active Directory](authorize-access-azure-active-directory.md)
- [Authorize access to Event Hubs resources using Shared Access Signatures](authorize-access-shared-access-signature.md)
