---
title: Authenticate an Application with Microsoft Entra ID to Access Event Hubs Resources
description: Learn how to authenticate an application with Microsoft Entra ID to securely access Azure Event Hubs resources. Improve security and simplify access.
ms.topic: how-to
ms.date: 08/25/2026
ms.custom:
  - subject-rbac-steps
  - sfi-image-nochange
ai-usage: ai-assisted
#customer intent: As a developer, I want to know how to authenticate an application with Azure Event Hubs using Microsoft Entra ID. 
---

# Authenticate an application with Microsoft Entra ID to access Event Hubs

Microsoft Azure provides integrated access control management for resources and applications based on Microsoft Entra ID. A key advantage of using Microsoft Entra ID with Azure Event Hubs is that you don't need to store credentials in code. Instead, request an OAuth 2.0 access token from the Microsoft identity platform. The resource name to request a token is `https://eventhubs.azure.net/`, and it's the same for all clouds and tenants. For Kafka clients, the resource to request a token is `https://<namespace>.servicebus.windows.net`. Microsoft Entra authenticates the security principal, such as a user, group, service principal, or managed identity, running the application. If authentication succeeds, Microsoft Entra ID returns an access token to the application, which can then use the token to authorize requests to Azure Event Hubs resources.

When you assign a role to a Microsoft Entra security principal, Azure grants access to those resources for that security principal. You can scope access to the subscription, resource group, Event Hubs namespace, or any resource under it. A Microsoft Entra security principal can assign roles to a user, group, application service principal, or a [managed identity for Azure resources](/entra/identity/managed-identities-azure-resources/overview). 

> [!NOTE]
> A role definition is a collection of permissions. Azure role-based access control (Azure RBAC) enforces these permissions through role assignment. A role assignment includes three elements: security principal, role definition, and scope. For more information, see [Understanding the different roles](../role-based-access-control/overview.md).

## Prerequisites

- An Azure account with an active subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- An Event Hubs namespace and an event hub. To create them, see [Quickstart: Create an event hub using Azure portal](event-hubs-create.md).
- Permission to register an application in your Microsoft Entra tenant. At least the [Application Developer](/entra/identity/role-based-access-control/permissions-reference#application-developer) role.
- Permission to assign Azure roles at the target scope. The [Owner](/azure/role-based-access-control/built-in-roles#owner) or [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) role includes this permission.

## Built-in roles for Azure Event Hubs
Azure provides these built-in roles to authorize access to Event Hubs data using Microsoft Entra ID and OAuth:

- [Azure Event Hubs Data Owner](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-owner): Use this role to give complete access to Event Hubs resources.
- [Azure Event Hubs Data Sender](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-sender): A security principal assigned to this role can send events to a specific event hub or all event hubs in a namespace.
- [Azure Event Hubs Data Receiver](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-receiver): A security principal assigned to this role can receive events from a specific event hub or all event hubs in a namespace.

For Schema Registry built-in roles, see [Schema Registry roles](schema-registry-concepts.md#azure-role-based-access-control).

> [!IMPORTANT]
> The preview release supported adding Event Hubs data access privileges to the Owner or Contributor role. However, these privileges are no longer honored. If you're using the Owner or Contributor role, switch to the Azure Event Hubs Data Owner role.

## Authenticate from an application

A key advantage of using Microsoft Entra ID with Event Hubs is that you don't need to store your credentials in your code. Instead, request an OAuth 2.0 access token from Microsoft identity platform. Microsoft Entra authenticates the security principal (a user, a group, or service principal) running the application. If authentication succeeds, Microsoft Entra ID returns the access token to the application, and the application can then use the access token to authorize requests to Azure Event Hubs.

The following sections explain how to configure a native application or web application for authentication with Microsoft identity platform 2.0. For more information about Microsoft identity platform 2.0, see [Microsoft identity platform (v2.0) overview](/entra/identity-platform/v2-overview).

For an overview of the OAuth 2.0 code grant flow, see [Authorize access to Microsoft Entra web applications using the OAuth 2.0 code grant flow](/entra/identity-platform/v2-oauth2-auth-code-flow).

### Register your application with Microsoft Entra ID

The first step to use Microsoft Entra ID to authorize Event Hubs resources is to register a client application with a Microsoft Entra tenant in the [Microsoft Entra admin center](https://entra.microsoft.com/). Follow steps in the [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app) to register an application in Microsoft Entra ID that represents your application trying to access Event Hubs resources.

When you register your client application, you supply information about the application. Microsoft Entra ID provides a client ID, also called an application ID, to associate the application with Microsoft Entra runtime. To learn more about the client ID, see [Application and service principal objects in Microsoft Entra ID](/entra/identity-platform/app-objects-and-service-principals).

> [!NOTE]
> If you register the application as a native application, specify any valid URI for the Redirect URI. For native applications, this value doesn't need to be a real URL. For web applications, the redirect URI must be a valid URI because it specifies the URL where tokens are provided.

After you register your application, you see the **Application (client) ID** under **Settings**:

:::image type="content" source="./media/authenticate-application/application-id.png" alt-text="Screenshot of the Azure portal app registration page with the application ID highlighted." lightbox="./media/authenticate-application/application-id.png":::

### Create a client secret for authentication

The application requires a client secret to prove its identity when requesting a token. Follow steps from [Add a client secret](/entra/identity-platform/how-to-add-credentials?tabs=client-secret) to create a client secret for your app in Microsoft Entra ID.

## Assign Azure roles by using the Azure portal

Assign one of the [Event Hubs roles](#built-in-roles-for-azure-event-hubs) to the application's service principal at the desired scope, such as the Event Hubs namespace, resource group, or subscription. For detailed steps, see [Assign Azure roles by using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

After you define the role and its scope, test this behavior with samples available [in this GitHub location](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac). To learn more about managing access to Azure resources by using Azure role-based access control (RBAC) and the Azure portal, see [this article](/azure/role-based-access-control/role-assignments-portal).

## Use client libraries to acquire tokens

After you register your application and grant it permissions to send or receive data in Azure Event Hubs, add code to your application to authenticate a security principal and acquire an OAuth 2.0 token. To authenticate and acquire the token, use one of the [Microsoft identity platform authentication libraries](/entra/identity-platform/reference-v2-libraries) or another open-source library that supports OpenID Connect 1.0. Your application can then use the access token to authorize a request against Azure Event Hubs.

For scenarios where acquiring tokens is supported, see the [Scenarios](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/scenarios) section of the [Microsoft Authentication Library (MSAL) for .NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) GitHub repository.

## Samples

- [RBAC samples using the legacy .NET Microsoft.Azure.EventHubs package](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac). We're working on creating a new version of this sample by using the latest Azure.Messaging.EventHubs package. See the already converted [Managed Identity](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Azure.Messaging.EventHubs/ManagedIdentityWebApp).
- [RBAC sample using the legacy Java com.microsoft.azure.eventhubs package](https://github.com/Azure/azure-event-hubs/tree/master/samples/Java/Rbac). Use the [migration guide](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/migration-guide.md) to migrate this sample to use the new package (`com.azure.messaging.eventhubs`). To learn more about using the new package, see the [Event Hubs Java samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/eventhuds/azure-messaging-eventhuds/src/samples/java/com/azure/messaging/eventhuds).

## Related content

- To learn more about Azure RBAC, see [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md).
- To learn how to assign and manage Azure role assignments with Azure PowerShell, Azure CLI, or the REST API, see these articles:

  - [Add or remove Azure role assignments using Azure PowerShell](../role-based-access-control/role-assignments-powershell.md)
  - [Add or remove Azure role assignments using Azure CLI](../role-based-access-control/role-assignments-cli.md)
  - [Add or remove Azure role assignments using the REST API](../role-based-access-control/role-assignments-rest.md)
  - [Add Azure role assignments using Azure Resource Manager templates](../role-based-access-control/role-assignments-template.md)

See the following related articles:

- [Authenticate a managed identity with Microsoft Entra ID to access Event Hubs resources](authenticate-managed-identity.md)
- [Authenticate requests to Azure Event Hubs using Shared Access Signatures](authenticate-shared-access-signature.md)
- [Authorize access to Event Hubs resources using Microsoft Entra ID](authorize-access-azure-active-directory.md)
- [Authorize access to Event Hubs resources using shared access signatures](authorize-access-shared-access-signature.md)
