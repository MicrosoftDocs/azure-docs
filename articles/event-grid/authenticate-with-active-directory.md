---
title: Authenticate Event Grid publishing clients using Microsoft Entra ID
description: This article describes how to authenticate Azure Event Grid publishing client using Microsoft Entra ID.
ms.topic: conceptual
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 11/15/2023
---

# Authentication and authorization with Microsoft Entra ID
This article describes how to authenticate Azure Event Grid publishing clients using Microsoft Entra ID.

## Overview
The [Microsoft Identity](../active-directory/develop/v2-overview.md) platform provides an integrated authentication and access control management for resources and applications that use Microsoft Entra ID as their identity provider. Use the Microsoft identity platform to provide authentication and authorization support in your applications. It's based on open standards such as OAuth 2.0 and OpenID Connect and offers tools and open-source libraries that support many authentication scenarios. It provides advanced features such as [Conditional Access](../active-directory/conditional-access/overview.md) that allows you to set policies that require multifactor authentication or allow access from specific locations, for example.

An advantage that improves your security stance when using Microsoft Entra ID is that you don't need to store credentials, such as authentication keys, in the code or repositories. Instead, you rely on the acquisition of OAuth 2.0 access tokens from the Microsoft identity platform that your application presents when authenticating to a protected resource. You can register your event publishing application with Microsoft Entra ID and obtain a service principal associated with your app that you manage and use. Instead, you can use [Managed Identities](../active-directory/managed-identities-azure-resources/overview.md), either system assigned or user assigned, for an even simpler identity management model as some aspects of the identity lifecycle are managed for you. 

[Role-based access control (RBAC)](../active-directory/develop/custom-rbac-for-developers.md) allows you to configure authorization in a way that certain security principals (identities for users, groups, or apps) have specific permissions to execute operations over Azure resources. This way, the security principal used by a client application that sends events to Event Grid must have the RBAC role **EventGrid Data Sender** associated with it. 

### Security principals
There are two broad categories of security principals that are applicable when discussing authentication of an Event Grid publishing client: 

- **Managed identities**. A managed identity can be system assigned, which you enable on an Azure resource and is associated to only that resource, or user assigned, which you explicitly create and name. User assigned managed identities can be associated to more than one resource.
- **Application security principal**. It's a type of security principal that represents an application, which accesses resources protected by Microsoft Entra ID. 

Regardless of the security principal used, a managed identity or an application security principal, your client uses that identity to authenticate before Microsoft Entra ID and obtain an [OAuth 2.0 access token](../active-directory/develop/access-tokens.md) that's sent with requests when sending events to Event Grid. That token is cryptographically signed and once Event Grid receives it, the token is validated. For example, the audience (the intended recipient of the token) is confirmed to be Event Grid (`https://eventgrid.azure.net`), among other things. The token contains information about the client identity. Event Grid takes that identity and validates that the client has the role **EventGrid Data Sender** assigned to it. More precisely, Event Grid validates that the identity has the ``Microsoft.EventGrid/events/send/action`` permission in an RBAC role associated to the identity before allowing the event publishing request to complete. 
 
If you're using the Event Grid SDK, you don't need to worry about the details on how to implement the acquisition of access tokens and how to include it with every request to Event Grid because the [Event Grid data plane SDKs](#publish-events-using-event-grids-client-sdks) do that for you. 

<a name='client-configuration-steps-to-use-azure-ad-authentication'></a>

### Client configuration steps to use Microsoft Entra authentication
Perform the following steps to configure your client to use Microsoft Entra authentication when sending events to a topic, domain, or partner namespace.

1. Create or use a security principal you want to use to authenticate. You can use a [managed identity](#authenticate-using-a-managed-identity) or an [application security principal](#authenticate-using-a-security-principal-of-a-client-application).
2. [Grant permission to a security principal to publish events](#assign-permission-to-a-security-principal-to-publish-events) by assigning the **EventGrid Data Sender** role to the security principal.
3. Use the Event Grid SDK to publish events to an Event Grid.

## Authenticate using a managed identity

Managed identities are identities associated with Azure resources. Managed identities provide an identity that applications use when using Azure resources that support Microsoft Entra authentication. Applications may use the managed identity of the hosting resource like a virtual machine or Azure App service to obtain Microsoft Entra tokens that are presented with the request when publishing events to Event Grid. When the application connects, Event Grid binds the managed entity's context to the client. Once it's associated with a managed identity, your Event Grid publishing client can do all authorized operations. Authorization is granted by associating a managed entity to an Event Grid RBAC role.

Managed identity provides Azure services with an automatically managed identity in Microsoft Entra ID. Contrasting to other authentication methods, you don't need to store and protect access keys or Shared Access Signatures (SAS) in your application code or configuration, either for the identity itself or for the resources you need to access.

To authenticate your event publishing client using managed identities, first decide on the hosting Azure service for your client application and then enable system assigned or user assigned managed identities on that Azure service instance. For example, you can enable managed identities on a [VM](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md), an [Azure App Service or Azure Functions](../app-service/overview-managed-identity.md?tabs=dotnet). 

Once you have a managed identity configured in a hosting service, [assign the permission to publish events to that identity](#assign-permission-to-a-security-principal-to-publish-events).

## Authenticate using a security principal of a client application

Besides managed identities, another identity option is to create a security principal for your client application. To that end, you need to register your application with Microsoft Entra ID. Registering your application is a gesture through which you delegate identity and access management control to Microsoft Entra ID. Follow the steps in section [Register an application](../active-directory/develop/quickstart-register-app.md#register-an-application) and in section [Add a client secret](../active-directory/develop/quickstart-register-app.md#add-a-client-secret). Make sure to review the [prerequisites](../active-directory/develop/quickstart-register-app.md#prerequisites) before starting.

Once you have an application security principal and followed above steps, [assign the permission to publish events to that identity](#assign-permission-to-a-security-principal-to-publish-events).

> [!NOTE]
> When you register an application in the portal, an [application object](../active-directory/develop/app-objects-and-service-principals.md#application-object) and a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) are created automatically in your home tenant. Alternatively, you can use Microsot Graph to register your application. However, if you register or create an application using the Microsoft Graph APIs, creating the service principal object is a separate step. 

## Assign permission to a security principal to publish events

The identity used to publish events to Event Grid must have the permission ``Microsoft.EventGrid/events/send/action`` that allows it to send events to Event Grid. That permission is included in the built-in RBAC role [Event Grid Data Sender](../role-based-access-control/built-in-roles.md#eventgrid-data-sender). This role can be assigned to a [security principal](../role-based-access-control/overview.md#security-principal), for a given [scope](../role-based-access-control/overview.md#scope), which can be a management group, an Azure subscription, a resource group, or a specific Event Grid topic, domain, or partner namespace. Follow the steps in [Assign Azure roles](../role-based-access-control/role-assignments-portal.md?tabs=current) to assign a security principal the **EventGrid Data Sender** role and in that way grant an application using that security principal access to send events. Alternatively, you can define a [custom role](../role-based-access-control/custom-roles.md) that includes the ``Microsoft.EventGrid/events/send/action`` permission and assign that custom role to your security principal.

With RBAC privileges taken care of, you can now [build your client application to send events](#publish-events-using-event-grids-client-sdks) to Event Grid.

> [!NOTE]
> Event Grid supports more RBAC roles for purposes beyond sending events. For more information, see[Event Grid built-in roles](security-authorization.md#built-in-roles).


## Publish events using Event Grid's client SDKs

Use [Event Grid's data plane SDK](https://devblogs.microsoft.com/azure-sdk/event-grid-ga/) to publish events to Event Grid. Event Grid's SDK support all authentication methods, including Microsoft Entra authentication. 

Here's the sample code that publishes events to Event Grid using the .NET SDK. You can get the topic endpoint on the **Overview** page for your Event Grid topic in the Azure portal. It's in the format: `https://<TOPIC-NAME>.<REGION>-1.eventgrid.azure.net/api/events`.

```csharp
ManagedIdentityCredential managedIdentityCredential = new ManagedIdentityCredential();
EventGridPublisherClient client = new EventGridPublisherClient( new Uri("<TOPIC ENDPOINT>"), managedIdentityCredential);


EventGridEvent egEvent = new EventGridEvent(
        "ExampleEventSubject",
        "Example.EventType",
        "1.0",
        "This is the event data");

// Send the event
await client.SendEventAsync(egEvent);
```

### Prerequisites

Following are the prerequisites to authenticate to Event Grid.

- Install the SDK on your application.
   - [Java](/java/api/overview/azure/messaging-eventgrid-readme#include-the-package)
   - [.NET](/dotnet/api/overview/azure/messaging.eventgrid-readme#install-the-package)
   - [JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/eventgrid/eventgrid#install-the-azureeventgrid-package)
   - [Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/eventgrid/azure-eventgrid#install-the-package)
- Install the Azure Identity client library. The Event Grid SDK depends on the Azure Identity client library for authentication. 
   - [Azure Identity client library for Java](/java/api/overview/azure/identity-readme)
   - [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme)
   - [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme)
   - [Azure Identity client library for Python](/python/api/overview/azure/identity-readme)
- A topic, domain, or partner namespace created to which your application sends events.

<a name='publish-events-using-azure-ad-authentication'></a>

### Publish events using Microsoft Entra authentication

To send events to a topic, domain, or partner namespace, you can build the client in the following way. The api version that first provided support for Microsoft Entra authentication is ``2018-01-01``. Use that API version or a more recent version in your application.

Sample:

This C# snippet creates an Event Grid publisher client using an Application (Service Principal) with a client secret, to enable the DefaultAzureCredential method you need to add the [Azure.Identity library](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/identity/Azure.Identity/README.md). If you're using the official SDK, the SDK handles the version for you.

```csharp
Environment.SetEnvironmentVariable("AZURE_CLIENT_ID", "");
Environment.SetEnvironmentVariable("AZURE_TENANT_ID", "");
Environment.SetEnvironmentVariable("AZURE_CLIENT_SECRET", "");

EventGridPublisherClient client = new EventGridPublisherClient(new Uri("your-event-grid-topic-domain-or-partner-namespace-endpoint"), new DefaultAzureCredential());
```

For more information, see the following articles:

- [Azure Event Grid client library for Java](/java/api/overview/azure/messaging-eventgrid-readme)
- [Azure Event Grid client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/eventgrid/Azure.Messaging.EventGrid#authenticate-using-azure-active-directory)
- [Azure Event Grid client library for JavaScript](/javascript/api/overview/azure/eventgrid-readme)
- [Azure Event Grid client library for Python](/python/api/overview/azure/eventgrid-readme)

## Disable key and shared access signature authentication

Microsoft Entra authentication provides a superior authentication support than that's offered by access key or Shared Access Signature (SAS) token authentication. With Microsoft Entra authentication, the identity is validated against Microsoft Entra identity provider. As a developer, you won't have to handle keys in your code if you use Microsoft Entra authentication. You'll also benefit from all security features built into the Microsoft identity platform, such as [Conditional Access](../active-directory/conditional-access/overview.md) that can help you improve your application's security stance. 

Once you decide to use Microsoft Entra authentication, you can disable authentication based on access keys or SAS tokens. 

> [!NOTE]
> Acess keys or SAS token authentication is a form of **local authentication**. you'll hear sometimes referring to "local auth" when discussing this category of authentication mechanisms that don't rely on Microsoft Entra ID. The API parameter used to disable local authentication is called, appropriately so, ``disableLocalAuth``.

### Azure portal

When creating a new topic, you can disable local authentication on the **Advanced** tab of the **Create Topic** page. 

:::image type="content" source="./media/authenticate-with-active-directory/create-topic-disable-local-auth.png" alt-text="Screenshot showing the Advanced tab of Create Topic page when you can disable local authentication.":::

For an existing topic, following these steps to disable local authentication:

1. Navigate to the **Event Grid Topic** page for the topic, and select **Enabled** under **Local Authentication**

    :::image type="content" source="./media/authenticate-with-active-directory/existing-topic-local-auth.png" alt-text="Screenshot showing the Overview page of an existing topic.":::
2. In the **Local Authentication** popup window, select **Disabled**, and select **OK**.

    :::image type="content" source="./media/authenticate-with-active-directory/local-auth-popup.png" alt-text="Screenshot showing the Local Authentication window.":::


### Azure CLI
The following CLI command shows the way to create a custom topic with local authentication disabled. The disable local auth feature is currently available as a preview and you need to use API version ``2021-06-01-preview``.

```cli
az resource create --subscription <subscriptionId> --resource-group <resourceGroup> --resource-type Microsoft.EventGrid/topics --api-version 2021-06-01-preview --name <topicName> --location <location> --properties "{ \"disableLocalAuth\": true}"
```

For your reference, the following are the resource type values that you can use according to the topic you're creating or updating.

| Topic type        | Resource type                        |
| ------------------| :------------------------------------|
| Domains           | Microsoft.EventGrid/domains          |
| Partner Namespace | Microsoft.EventGrid/partnerNamespaces|
| Custom Topic      | Microsoft.EventGrid/topics           |

### Azure PowerShell

If you're using PowerShell, use the following cmdlets to create a custom topic with local authentication disabled. 

```PowerShell

Set-AzContext -SubscriptionId <SubscriptionId>

New-AzResource -ResourceGroupName <ResourceGroupName> -ResourceType Microsoft.EventGrid/topics -ApiVersion 2021-06-01-preview -ResourceName <TopicName> -Location <Location> -Properties @{disableLocalAuth=$true}
```

> [!NOTE]
> - To learn about using the access key or shared access signature authentication, see [Authenticate publishing clients with keys or SAS tokens](security-authenticate-publishing-clients.md)
> - This article deals with authentication when publishing events to Event Grid (event ingress). Authenticating Event Grid when delivering events (event egress) is the subject of article [Authenticate event delivery to event handlers](security-authentication.md). 

## Resources
- Data plane SDKs
    - Java SDK: [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/eventgrid/azure-messaging-eventgrid) | [samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/eventgrid/azure-messaging-eventgrid/src/samples/java/com/azure/messaging/eventgrid) | [migration guide from previous SDK version](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventgrid/azure-messaging-eventgrid/migration-guide.md)
    - .NET SDK: [GitHub](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventgrid/Azure.Messaging.EventGrid) | [samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventgrid/Azure.Messaging.EventGrid/samples) | [migration guide from previous SDK version](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventgrid/Azure.Messaging.EventGrid/MigrationGuide.md)
    - Python SDK: [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventgrid/azure-eventgrid) | [samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventgrid/azure-eventgrid/samples) | [migration guide from previous SDK version](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventgrid/azure-eventgrid/migration_guide.md)
    - JavaScript SDK: [GitHub](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/eventgrid/eventgrid/) | [samples](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/eventgrid/eventgrid/samples) | [migration guide from previous SDK version](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/eventgrid/eventgrid/MIGRATION.md)
- [Event Grid SDK blog](https://devblogs.microsoft.com/azure-sdk/event-grid-ga/)
- Azure Identity client library
   - [Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/identity/azure-identity/README.md)
   - [.NET](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/identity/Azure.Identity/README.md)  
   - [Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/identity/azure-identity/README.md)
   - [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/README.md)
- Learn about [managed identities](../active-directory/managed-identities-azure-resources/overview.md)
- Learn about [how to use managed identities for App Service and Azure Functions](../app-service/overview-managed-identity.md?tabs=dotnet)
- Learn about [applications and service principals](../active-directory/develop/app-objects-and-service-principals.md)
- Learn about [registering an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md).
- Learn about how [authorization](../role-based-access-control/overview.md) (RBAC access control) works.
- Learn about Event Grid built-in RBAC roles including its [Event Grid Data Sender](../role-based-access-control/built-in-roles.md#eventgrid-data-sender) role. [Event Grid's roles list](security-authorization.md#built-in-roles).
- Learn about [assigning RBAC roles](../role-based-access-control/role-assignments-portal.md?tabs=current) to identities.
- Learn about how to define [custom RBAC roles](../role-based-access-control/custom-roles.md).
- Learn about [application and service principal objects in Microsoft Entra ID](../active-directory/develop/app-objects-and-service-principals.md).
- Learn about [Microsoft identity platform access tokens](../active-directory/develop/access-tokens.md).
- Learn about [OAuth 2.0 authentication code flow and Microsoft identity platform](../active-directory/develop/v2-oauth2-auth-code-flow.md)
