---
title: Authenticate Event Grid publishing clients using Azure Active Directory.
description: This article describes how to authenticate Azure Event Grid publishing client using Azure Active Directory.  
ms.topic: conceptual
ms.date: 08/09/2021
ms.custom: devx-track-csharp
---

# Authentication and authorization with the Microsoft Identity platform (Azure Active Directory)

The [Microsoft Identity](../active-directory/develop/v2-overview.md) platform provides an integrated authentication and access control management for resources and applications that use Azure Active Directory (Azure AD) as their identity provider. Use the Microsoft Identity platform to provide authentication and authorization support in your applications. It's based on open standards such as OAuth 2.0 and OpenID Connect and offers tools and open-source libraries that support many authentication scenarios. Once you start using Azure AD for your authentication needs, extra features that are released with the platform can be used by all your solutions in a standard way. It provides advanced features such as [Conditional Access](../active-directory/conditional-access/overview.md) that allows you to set policies that require multifactor authentication or allow access from specific locations, for example.

An advantage that improves your security stance when using Azure AD is that you don't need to store credentials, such as authentication keys, in the code or repositories. Instead, you rely on the acquisition of OAuth 2.0 access tokens from the Microsoft Identity platform that your application presents when authenticating to a protected resource. You can register your event publishing application with Azure AD and obtain a service principal associated with your app that you manage and use. Alternatively, you can use [Managed Identities](../active-directory/managed-identities-azure-resources/overview.md), either system assigned or user assigned, for an even simpler identity management model as some aspects of the identity lifecycle are managed for you. 

[Role-based access control](../active-directory/develop/custom-rbac-for-developers.md) (RBAC) allows you to configure authorization in a way that certain security principals (identities for users, groups, or apps) have specific permissions to execute operations over Azure resources. This way, the security principal used by a client application that sends events to Event Grid must have the RBAC role **EventGrid Data Sender** associated with it. 

There are two broad categories of security principals that are applicable when discussing authentication of an Event Grid publishing client: 

1. Managed identities. A managed identity can be system assigned, which you enable on an Azure resource and is associated to only that resource, or user assigned, which you explicitly create and name. User assigned managed identities can be associated to more than one resource.
2. Application security principal. This is a type of security principal represents an application that is accessing resources protected by Azure AD. 

Regardless of the security principal used, a managed identity or an application security principal, your client uses that identity to authenticate before Azure AD and obtain an [OAuth 2.0 access token](../active-directory/develop/access-tokens.md) that is sent with requests when sending events to Event Grid. That token is cryptographically signed and once Event Grid receives it, the token is validated. For example, the audience (the intended recipient of the token) is confirmed to be Event Grid (https://eventgrid.azure.net), among other things. The token contains information about the client identity. Event Grid takes that identity and validates that the client has the role **EventGrid Data Sender** assigned to it. More precisely, Event Grid validates that the identity has the ``Microsoft.EventGrid/events/send/action`` permission in an RBAC role associated to the identity before allowing the event publishing request to complete. 
 
If you're using the Event Grid SDK, you don't need to worry about the details on how to implement the acquisition of access tokens and how to include it with every request to Event Grid because the [Event Grid data plane SDKs](#publish-events-using-event-grids-client-sdks) do that for you. 


Perform the following steps to ready your client to use Azure AD authentication when sending events to a topic, domain, or partner namespace.

1. Create or use a security principal you want to use to authenticate. You can use a [managed identity](#authenticate-using-managed-identities) or an [application security principal](#authenticate-using-a-security-principal-associated-to-a-client-application).
2. [Grant permission to a security principal to publish events](#assign-permission-to-a-security-principal-to-publish-events).
3. Use the Event Grid SDK to publish events to an Event Grid.

## Authenticate using Managed Identities

Managed identities are identities associated with Azure resources. Managed identities provide an identity that applications use when using Azure resources that support Azure AD authentication. Applications may use the managed identity of the hosting resource like a virtual machine or Azure App service to obtain Azure AD tokens that are presented with the request when publishing events to Event Grid. When the application connects, Event Grid binds the managed entity's context to the client. Once it's associated with a managed identity, your Event Grid publishing client can do all authorized operations. Authorization is granted by associating a managed entity to an Event Grid RBAC role.

Managed identity provides Azure services with an automatically managed identity in Azure AD. Contrasting to other authentication methods, you don't need to store and protect access keys or Shared Access Signatures (SAS) in your application code or configuration, either for the identity itself or for the resources you need to access.


### Authenticate using system assigned or user assigned managed identities

To authenticate your event publishing client using managed identities, first decide on the hosting Azure service for your client application and then enable system assigned or user assigned managed identities on that Azure service instance. For example, you can enable managed identities on a [VM](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md), an [Azure App Service or Azure Functions](../app-service/overview-managed-identity.md?tabs=dotnet). 

Once you have a managed identity configured in a hosting service, [assign the permission to publish events to that identity](#assign-permission-to-a-security-principal-to-publish-events).

## Authenticate using a security principal associated to a client application

Besides managed identities, another identity option is to create a security principal for your client application. To that end, you need to register your application with Azure AD. Registering your application is a gesture through which you delegate identity and access management control to Azure AD. Follow the steps in section [Register an application](../active-directory/develop/quickstart-register-app.md#register-an-application) and in section [Add a client secret](../active-directory/develop/quickstart-register-app.md#add-a-client-secret). Make sure to review the [prerequisites](../active-directory/develop/quickstart-register-app.md#prerequisites) before starting.

Once you have an application security principal and followed above steps, [assign the permission to publish events to that identity](#assign-permission-to-a-security-principal-to-publish-events).

> [!NOTE]
> When you register an application in the portal, an [application object](../active-directory/develop/app-objects-and-service-principals.md#application-object) and a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) are created automatically in your home tenant. Alternatively, you can use Microsot Graph to registred your application. However, if you register or create an application using the Microsoft Graph APIs, creating the service principal object is a separate step. 

## Assign permission to a security principal to publish events

The identity used to publish events to Event Grid must have the permission ``Microsoft.EventGrid/events/send/action`` that allows it to send events to Event Grid. That permission is included in the built-in RBAC role [EventGrid Data Sender](../role-based-access-control/built-in-roles.md#eventgrid-data-sender). This role can be assigned to a [security principal](../role-based-access-control/overview.md#security-principal), for a given [scope](../role-based-access-control/overview.md#scope), which can be a management group, an Azure subscription, a resource group, or a specific event grid topic, domain, or partner namespace. Follow the steps in [Assign Azure roles](../role-based-access-control/role-assignments-portal.md?tabs=current) to assign a security principal the **EventGrid Data Sender** role and in that way grant an application using that security principal access to send events. Alternatively, you can define a [custom role](../role-based-access-control/custom-roles.md) that includes the ``Microsoft.EventGrid/events/send/action`` permission and assign that custom role to your security principal.

With RBAC privileges taken care of, you can now [build your client application to send events](#publish-events-using-event-grids-client-sdks) to Event Grid.

### Other RBAC roles supported by Event Grid

Event Grid supports more RBAC roles for purposes beyond sending events. For more information, see[Event Grid built-in roles](security-authorization.md#built-in-roles).


## Publish events using Event Grid's client SDKs

Use [Event Grid's data plane SDK](https://devblogs.microsoft.com/azure-sdk/event-grid-ga/) to publish events to Event Grid. Event Grid's SDK support all authentication methods, including Azure AD authentication. 

### Prerequisites

Following are the prerequisites to authenticate to Event Grid.

1. Install the SDK on your application.
   2. [Java](/java/api/overview/azure/messaging-eventgrid-readme#include-the-package)
   3. [.NET](/dotnet/api/overview/azure/messaging.eventgrid-readme-pre#install-the-package)
   4. [JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/eventgrid/eventgrid.md#install-the-azureeventgrid-package)
   5. [Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/eventgrid/azure-eventgrid#install-the-package)
2. Install the Azure Identity client library. The Event Grid SDK depends on the Azure Identity client library for authentication. 
   1. [Azure Identity client library for Java](/java/api/overview/azure/identity-readme)
   2. [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme)
   3. [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme)
   4. [Azure Identity client library for Python](/python/api/overview/azure/identity-readme)
3. A topic, domain, or partner namespace created to which your application will send events.

### Publish events using Azure AD Authentication

To send events to a topic, domain or partner namespace, you can build the client in the following way. The api version that first provided support for Azure AD authentication is ``2021-06-01-preview``. Use that API version or a more recent version in your application.

```java 
        DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();
        EventGridPublisherClient cloudEventClient = new EventGridPublisherClientBuilder()
                .endpoint("<your-event-grid-topic-domain-or-partner-namespace-endpoint>?api-version=2021-06-01-preview")
                .credential(credential)
                .buildCloudEventPublisherClient();
```
**TODO** Need to mention that if using a security principal associated to a client publishing application, you have to configure environmental variables like in [Java](/java/api/overview/azure/identity-readme#environment-variables). We also need to mention that the DefaultCredentialBuilder will read those and use it to use the right/that identity. For more information, see [Java API overview](/java/api/overview/azure/identity-readme#defaultazurecredential).


For more information, you may want to consult the following articles:

- [Azure Event Grid client library for Java](/java/api/overview/azure/messaging-eventgrid-readme)
- [Azure Event Grid client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/eventgrid/Azure.Messaging.EventGrid#authenticate-using-azure-active-directory)
- [Azure Event Grid client library for JavaScript](/javascript/api/overview/azure/eventgrid-readme)
- [Azure Event Grid client library for Python](/python/api/overview/azure/eventgrid-readme)

## Disable key and shared access signature authentication (disable local auth) - Preview

Azure AD authentication provides a superior authentication support than that offered by key or Shared Access Signature (SAS) token authentication. With Azure AD authentication, the identity is validated against Azure AD identity provider. As a developer, you won't have to handle keys in your code if you use Azure AD authentication. you'll also benefit from all security features built into the Microsoft Identity platform, such as [Conditional Access](../active-directory/conditional-access/overview.md), that can help you improve your application's security stance. 

Once you decide to use Azure AD authentication, you can disable authentication based on access keys or SAS tokens. 

> [!NOTE]
> Acess keys or SAS token authentication is a form of local authentication. you'll hear sometimes referring to "local auth" when discussing this category of authentication mechanisms that don't rely on Azure AD. The API parameter used to disable local authentication is called, appropriately so, ``disableLocalAuth``.

The following CLI command exemplifies the way to create a custom topic with local authentication disabled. Disable local auth is currently available as a preview and you need to use API version ``2021-06-01-preview``.

```cli
az resource create --subscription <subscriptionId> --resource-group <resourceGroup> --resource-type Microsoft.EventGrid/topics --api-version 2021-06-01-preview --name <topicName> --location <location> --properties "{ \"disableLocalAuth\": true}"
```
For your reference, the following are the resource type values that you can use according to the topic you're creating or updating.

| Topic type        | Resource type                        |
| ------------------| :------------------------------------|
| Domains           | Microsoft.EventGrid/domains          |
| Partner Namespace | Microsoft.EventGrid/partnerNamespaces|
| Custom Topic      | Microsoft.EventGrid/topics           |

If using PowerShell, you can use the following cmdlets to create a custom topic with local authentication disabled. 

```PowerShell

Set-AzContext -SubscriptionId <SubscriptionId>

New-AzResource -ResourceGroupName <ResourceGroupName> -ResourceType Microsoft.EventGrid/topics -ApiVersion 2021-06-01-preview -ResourceName <TopicName> -Location <Location> -Properties @{disableLocalAuth=$true}
```

> [!NOTE]
> If interested in using access key or shared access signature authentication, consult article [Authenticate publishing clients with keys or SAS tokens](security-authenticate-publishing-clients.md)

> [!NOTE]
> This article deals with authentication when publishing events to Event Grid (event ingress). Authenticating Event Grid when delivering events (event egress) is the subject of article [Authenticate event delivery to event handlers](security-authentication.md). 

## Resources
- Data plane SDKs
    - Java SDK: [github](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/eventgrid/azure-messaging-eventgrid) | [samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/eventgrid/azure-messaging-eventgrid/src/samples/java/com/azure/messaging/eventgrid) | [migration guide from previous SDK version](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventgrid/azure-messaging-eventgrid/migration-guide.md)
    - .NET SDK: [github](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventgrid/Azure.Messaging.EventGrid) | [samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventgrid/Azure.Messaging.EventGrid/samples) | [migration guide from previous SDK version](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventgrid/Azure.Messaging.EventGrid/MigrationGuide.md)
    - Python SDK: [github](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventgrid/azure-eventgrid) | [samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventgrid/azure-eventgrid/samples) | [migration guide from previous SDK version](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventgrid/azure-eventgrid/migration_guide.md)
    - JavaScript SDK: [github](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/eventgrid/eventgrid/) | [samples](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/eventgrid/eventgrid/samples) | [migration guide from previous SDK version](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/eventgrid/eventgrid/migration.md)
- [Event Grid SDK blog](https://devblogs.microsoft.com/azure-sdk/event-grid-ga/)
- Azure Identity client library
   - [Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/identity/azure-identity/README.md)
   - [.NET](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/identity/Azure.Identity/README.md)  
   - [Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/identity/azure-identity/README.md)
   - [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/README.md)
- Learn about [managed identities](../active-directory/managed-identities-azure-resources/overview.md)
- Learn about [how to use managed identities for App Service and Azure Functions](../app-service/overview-managed-identity.md?tabs=dotnet)
- Learn about [applications and service principals](../active-directory/develop/app-objects-and-service-principals.md)
- Learn about [registering an application with the Microsoft Identity platform](../active-directory/develop/quickstart-register-app.md).
- Learn about how [authorization](../role-based-access-control/overview.md) (RBAC access control) works.
- Learn about Event Grid built-in RBAC roles including its [EventGrid Data Sender](../role-based-access-control/built-in-roles.md#eventgrid-data-sender) role. [Event Grid's roles list](security-authorization.md#built-in-roles).
- Learn about [assigning RBAC roles](../role-based-access-control/role-assignments-portal.md?tabs=current) to identities.
- Learn about how to define [custom RBAC roles](../role-based-access-control/custom-roles.md).
- Learn about [application and service principal objects in Azure AD](../active-directory/develop/app-objects-and-service-principals.md).
- Learn about [Microsoft Identity Platform access tokens](../active-directory/develop/access-tokens.md).
- Learn about [OAuth 2.0 authentication code flow and Microsoft Identity Platform](../active-directory/develop/v2-oauth2-auth-code-flow.md)
