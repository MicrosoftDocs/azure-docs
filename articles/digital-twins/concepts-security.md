---
# Mandatory fields.
title: Security for Azure Digital Twins solutions
titleSuffix: Azure Digital Twins
description: Understand security best practices with Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/18/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Secure Azure Digital Twins

For security, Azure Digital Twins enables precise access control over specific data, resources, and actions in your deployment. It does this through a granular role and permission management strategy called **Azure role-based access control (Azure RBAC)**. You can read about the general principles of Azure RBAC [here](../role-based-access-control/overview.md).

Azure Digital Twins also supports encryption of data at rest.

## Granting permissions with Azure RBAC

Azure RBAC is provided to Azure Digital Twins via integration with [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) (Azure AD).

You can use Azure RBAC to grant permissions to a *security principal*, which may be a user, a group, or an application service principal. The security principal is authenticated by Azure AD, and receives an OAuth 2.0 token in return. This token can be used to authorize an access request to an Azure Digital Twins instance.

### Authentication and authorization

With Azure AD, access is a two-step process. When a security principal (a user, group, or application) attempts to access Azure Digital Twins, the request must be *authenticated* and *authorized*. 

1. First, the security principal's identity is *authenticated*, and an OAuth 2.0 token is returned.
2. Next, the token is passed as part of a request to the Azure Digital Twins service, to *authorize* access to the specified resource.

The authentication step requires any application request to contain an OAuth 2.0 access token at runtime. If an application is running within an Azure entity such as an [Azure Functions](../azure-functions/functions-overview.md) app, it can use a **managed identity** to access the resources. Read more about managed identities in the next section.

The authorization step requires that an Azure role be assigned to the security principal. The roles that are assigned to a security principal determine the permissions that the principal will have. Azure Digital Twins provides Azure roles that encompass sets of permissions for Azure Digital Twins resources. These roles are described later in this article.

To learn more about roles and role assignments supported in Azure, see [*Understand the different roles*](../role-based-access-control/rbac-and-directory-admin-roles.md) in the Azure RBAC documentation.

#### Authentication with managed identities

[Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) is a cross-Azure feature that enables you to create a secure identity associated with the deployment where your application code runs. You can then associate that identity with access-control roles, to grant custom permissions for accessing specific Azure resources that your application needs.

With managed identities, the Azure platform manages this runtime identity. You do not need to store and protect access keys in your application code or configuration, either for the identity itself, or for the resources you need to access. An Azure Digital Twins client app running inside an Azure App Service application does not need to handle SAS rules and keys, or any other access tokens. The client app only needs the endpoint address of the Azure Digital Twins namespace. When the app connects, Azure Digital Twins binds the managed entity's context to the client. Once it is associated with a managed identity, your Azure Digital Twins client can do all authorized operations. Authorization will then be granted by associating a managed entity with an Azure Digital Twins Azure role (described below).

#### Authorization: Azure roles for Azure Digital Twins

Azure provides the below Azure built-in roles for authorizing access to an Azure Digital Twins resource:
* *Azure Digital Twins Owner (Preview)* – Use this role to give full access over Azure Digital Twins resources.
* *Azure Digital Twins Reader (Preview)* – Use this role to give read-only access to Azure Digital Twins resources.

> [!TIP]
> The *Azure Digital Twins Reader (Preview)* role now also supports browsing relationships.

For more information about how built-in roles are defined, see [*Understand role definitions*](../role-based-access-control/role-definitions.md) in the Azure RBAC documentation. For information about creating Azure custom roles, see [*Azure custom roles*](../role-based-access-control/custom-roles.md).

You can assign roles in two ways:
* via the access control (IAM) pane for Azure Digital Twins in the Azure portal (see [*Add or remove Azure role assignments using the Azure portal*](../role-based-access-control/role-assignments-portal.md))
* via CLI commands to add or remove a role

For more detailed steps on how to do this, try it out in the Azure Digital Twins [*Tutorial: Connect an end-to-end solution*](tutorial-end-to-end.md).

### Permission scopes

Before you assign an Azure role to a security principal, determine the scope of access that the security principal should have. Best practices dictate that it's best to grant only the narrowest possible scope.

The following list describes the levels at which you can scope access to Azure Digital Twins resources.
* Models: The actions for this resource dictate control over [models](concepts-models.md) uploaded in Azure Digital Twins.
* Query Digital Twins Graph: The actions for this resource determine ability to run [query operations](concepts-query-language.md) on digital twins within the Azure Digital Twins graph.
* Digital Twin: The actions for this resource provide control over CRUD operations on [digital twins](concepts-twins-graph.md) in the twin graph.
* Digital Twin relationship: The actions for this resource define control over CRUD operations on [relationships](concepts-twins-graph.md) between digital twins in the twin graph.
* Event route: The actions for this resource determine permissions to [route events](concepts-route-events.md) from Azure Digital Twins to an endpoint service like [Event Hub](../event-hubs/event-hubs-about.md), [Event Grid](../event-grid/overview.md), or [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md).

### Troubleshooting permissions

If a user attempts to perform an action not allowed by their role, they may receive an error from the service request reading `403 (Forbidden)`. For more information and troubleshooting steps, see [*Troubleshooting: Azure Digital Twins request failed with Status: 403 (Forbidden)*](troubleshoot-error-403.md).

## Encryption of data at rest

Azure Digital Twins provides encryption of data at rest and in-transit as it's written in our data centers, and decrypts it for you as you access it. This encryption occurs using a Microsoft managed encryption key.

## Cross-Origin Resource Sharing (CORS)

Azure Digital Twins doesn't currently support **Cross-Origin Resource Sharing (CORS)**. As a result, if you are calling a REST API from a browser app, an [API Management (APIM)](../api-management/api-management-key-concepts.md) interface, or a [Power Apps](https://docs.microsoft.com/powerapps/powerapps-overview) connector, you may see a policy error.

To resolve this error, you can do one of the following:
* Strip the CORS header `Access-Control-Allow-Origin` from the message. This header indicates whether the response can be shared. 
* Alternatively, create a CORS proxy and make the Azure Digital Twins REST API request through it. 

## Next steps

* See these concepts in action in [*How-to: Set up an instance and authentication*](how-to-set-up-instance-portal.md).

* See how to interact with these concepts from client application code in [*How-to: Write app authentication code*](how-to-authenticate-client.md).

* Read more about [Azure RBAC](../role-based-access-control/overview.md).
