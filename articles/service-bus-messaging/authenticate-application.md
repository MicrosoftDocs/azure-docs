---
title: Authenticate an application to access Azure Service Bus entities
description: This article provides information about authenticating an application with Azure Active Directory to access Azure Service Bus  entities (queues, topics, etc.)
ms.topic: conceptual
ms.date: 02/24/2023
ms.custom: subject-rbac-steps
---

# Authenticate and authorize an application with Azure Active Directory to access Azure Service Bus entities
Azure Service Bus supports using Azure Active Directory (Azure AD) to authorize requests to Service Bus entities (queues, topics, subscriptions, or filters). With Azure AD, you can use Azure role-based access control (Azure RBAC) to grant permissions to a security principal, which may be a user, group, or application service principal. A key advantage of using Azure AD with Azure Service Bus is that you don't need to store your credentials in the code anymore. Instead, you can request an OAuth 2.0 access token from the Microsoft Identity platform. If the authentication succeeds, Azure AD returns an access token to the application, and the application can then use the access token to authorize request to Service Bus resources.  

> [!IMPORTANT]
> You can disable local or SAS key authentication for a Service Bus namespace and allow only Azure Active Directory authentication. For step-by-step instructions, see [Disable local authentication](disable-local-authentication.md).

## Overview
When a security principal (a user, group, or application) attempts to access a Service Bus entity, the request must be authorized. With Azure AD, access to a resource is a two-step process. 

 1. First, the security principal’s identity is authenticated, and an OAuth 2.0 token is returned. The resource name to request a token is `https://servicebus.azure.net`.
 1. Next, the token is passed as part of a request to the Service Bus service to authorize access to the specified resource.

The authentication step requires that an application request contains an OAuth 2.0 access token at runtime. If an application is running within an Azure entity such as an Azure VM,  a Virtual Machine Scale Set, or an Azure Function app, it can use a managed identity to access the resources. To learn how to authenticate requests made by a managed identity to the Service Bus service, see [Authenticate access to Azure Service Bus resources with Azure Active Directory and managed identities for Azure Resources](service-bus-managed-service-identity.md). 

The authorization step requires that one or more Azure roles be assigned to the security principal. Azure Service Bus provides Azure roles that encompass sets of permissions for Service Bus resources. The roles that are assigned to a security principal determine the permissions that the principal will have on Service Bus resources. To learn more about assigning Azure roles to Azure Service Bus, see [Azure built-in roles for Azure Service Bus](#azure-built-in-roles-for-azure-service-bus). 

Native applications and web applications that make requests to Service Bus can also authorize with Azure AD. This article shows you how to request an access token and use it to authorize requests for Service Bus resources. 


## Azure built-in roles for Azure Service Bus

Azure Active Directory (Azure AD) authorizes access rights to secured resources through [Azure RBAC](../role-based-access-control/overview.md). Azure Service Bus defines a set of Azure built-in roles that encompass common sets of permissions used to access Service Bus entities and you can also define custom roles for accessing the data.

When an Azure role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of subscription, the resource group, or the Service Bus namespace. An Azure AD security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

For Azure Service Bus, the management of namespaces and all related resources through the Azure portal and the Azure resource management API is already protected using the Azure RBAC model. Azure provides the following built-in roles for authorizing access to a Service Bus namespace:

- [Azure Service Bus Data Owner](../role-based-access-control/built-in-roles.md#azure-service-bus-data-owner): Enables data access to Service Bus namespace and its entities (queues, topics, subscriptions, and filters)
- [Azure Service Bus Data Sender](../role-based-access-control/built-in-roles.md#azure-service-bus-data-sender): Use this role to give the send access to Service Bus namespace and its entities.
- [Azure Service Bus Data Receiver](../role-based-access-control/built-in-roles.md#azure-service-bus-data-receiver): Use this role to give receiving access to Service Bus namespace and its entities. 

### Resource scope 
Before you assign an Azure role to a security principal, determine the scope of access that the security principal should have. Best practices dictate that it's always best to grant only the narrowest possible scope.

The following list describes the levels at which you can scope access to Service Bus resources, starting with the narrowest scope:

- **Queue**, **topic**, or **subscription**: Role assignment applies to the specific Service Bus entity. Currently, the Azure portal doesn't support assigning users/groups/managed identities to Service Bus Azure roles at the subscription level. 
- **Service Bus namespace**: Role assignment spans the entire topology of Service Bus under the namespace and to the consumer group associated with it.
- **Resource group**: Role assignment applies to all the Service Bus resources under the resource group.
- **Subscription**: Role assignment applies to all the Service Bus resources in all of the resource groups in the subscription.

> [!NOTE]
> Keep in mind that Azure role assignments may take up to five minutes to propagate. 

For more information about how built-in roles are defined, see [Understand role definitions](../role-based-access-control/role-definitions.md#control-and-data-actions). For information about creating Azure custom roles, see [Azure custom roles](../role-based-access-control/custom-roles.md).


## Authenticate from an application
A key advantage of using Azure AD with Service Bus is that your credentials no longer need to be stored in your code. Instead, you can request an OAuth 2.0 access token from Microsoft identity platform. Azure AD authenticates the security principal (a user, a group, or service principal) running the application. If authentication succeeds, Azure AD returns the access token to the application, and the application can then use the access token to authorize requests to Azure Service Bus.

Following sections shows you how to configure your native application or web application for authentication with Microsoft identity platform 2.0. For more information about Microsoft identity platform 2.0, see [Microsoft identity platform (v2.0) overview](../active-directory/develop/v2-overview.md).

For an overview of the OAuth 2.0 code grant flow, see [Authorize access to Azure Active Directory web applications using the OAuth 2.0 code grant flow](../active-directory/develop/v2-oauth2-auth-code-flow.md).

### Register your application with an Azure AD tenant
The first step in using Azure AD to authorize Service Bus entities is registering your client application with an Azure AD tenant from the [Azure portal](https://portal.azure.com/). When you register your client application, you supply information about the application to AD. Azure AD then provides a client ID (also called an application ID) that you can use to associate your application with Azure AD runtime. To learn more about the client ID, see [Application and service principal objects in Azure Active Directory](../active-directory/develop/app-objects-and-service-principals.md). 

Follow steps in the [Quickstart: Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md) to register your application with Azure AD. 

> [!Note]
> If you register your application as a native application, you can specify any valid URI for the Redirect URI. For native applications, this value does not have to be a real URL. For web applications, the redirect URI must be a valid URI, because it specifies the URL to which tokens are provided.

After you've registered your application, you'll see the **Application (client) ID** and **Directory (tenant) ID** under **Settings**:

> [!IMPORTANT]
> Make note of the **TenantId** and the **ApplicationId**. You will need these values to run the application.

:::image type="content" source="./media/authenticate-application/application-id.png" alt-text="Screenshot showing the App registration page showing the Application ID and Tenant ID.":::

For more information about registering an application with Azure AD, see [Integrating applications with Azure Active Directory](../active-directory/develop/quickstart-register-app.md).


### Create a client secret   
The application needs a client secret to prove its identity when requesting a token. To add the client secret, follow these steps.

1. Navigate to your app registration in the Azure portal if you aren't already on the page.
1. Select **Certificates & secrets** on the left menu.
1. Under **Client secrets**, select **New client secret** to create a new secret.

    :::image type="content" source="./media/authenticate-application/new-client-secret-button.png" alt-text="Screenshot showing the Certificates and secrets page with New client secret button selected.":::
1. Provide a description for the secret, and choose the wanted expiration interval, and then select **Add**.

    :::image type="content" source="./media/authenticate-application/add-client-secret-page.png" alt-text="Screenshot showing the Add a client secret page.":::
1. Immediately copy the value of the new secret to a secure location. The fill value is displayed to you only once.

    :::image type="content" source="./media/authenticate-application/client-secret.png" alt-text="Screenshot showing the Client secrets section with the secret you added.":::

### Permissions for the Service Bus API
If your application is a console application, you must register a native application and add API permissions for **Microsoft.ServiceBus** to the **required permissions** set. Native applications also need a **redirect-uri** in Azure AD, which serves as an identifier; the URI doesn't need to be a network destination. Use `https://servicebus.microsoft.com` for this example, because the sample code already uses that URI.

## Assign Azure roles using the Azure portal  
Assign one of the [Service Bus roles](#azure-built-in-roles-for-azure-service-bus) to the application's service principal at the desired scope (Service Bus namespace, resource group, subscription). For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

Once you define the role and its scope, you can test this behavior with the [sample on GitHub](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/RoleBasedAccessControl). This sample uses the old Microsoft.Azure.ServiceBus package. For information about migrating this sample to use the newer Azure.Messaging.ServiceBus package, see the [Guide for migrating to Azure.Messaging.ServiceBus from Microsoft.Azure.ServiceBus](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/MigrationGuide.md). 


### Authenticating the Service Bus client
Once you've registered your application and granted it permissions to send/receive data in Azure Service Bus, you can authenticate your client with the client secret credential, which will enable you to make requests against Azure Service Bus.

For a list of scenarios for which acquiring tokens are supported, see the [Scenarios](https://aka.ms/msal-net-scenarios) section of the [Microsoft Authentication Library (MSAL) for .NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) GitHub repository.

Using the latest [Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus) library, you can authenticate the [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) with a [ClientSecretCredential](/dotnet/api/azure.identity.clientsecretcredential), which is defined in the [Azure.Identity](https://www.nuget.org/packages/Azure.Identity) library.

```cs
TokenCredential credential = new ClientSecretCredential("<tenant_id>", "<client_id>", "<client_secret>");
var client = new ServiceBusClient("<fully_qualified_namespace>", credential);
```

If you're using the older .NET packages, see the RoleBasedAccessControl samples in the [azure-service-bus samples repository](https://github.com/Azure/azure-service-bus).

## Next steps
- To learn more about Azure RBAC, see [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md)?
- To learn how to assign and manage Azure role assignments with Azure PowerShell, Azure CLI, or the REST API, see these articles:
    - [Add or remove Azure role assignments using Azure PowerShell](../role-based-access-control/role-assignments-powershell.md)  
    - [Add or remove Azure role assignments using Azure CLI](../role-based-access-control/role-assignments-cli.md)
    - [Add or remove Azure role assignments using the REST API](../role-based-access-control/role-assignments-rest.md)
    - [Add or remove Azure role assignments using Azure Resource Manager Templates](../role-based-access-control/role-assignments-template.md)

To learn more about Service Bus messaging, see the following topics.

- [Service Bus Azure RBAC samples](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/RoleBasedAccessControl)
- [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
- [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
- [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
