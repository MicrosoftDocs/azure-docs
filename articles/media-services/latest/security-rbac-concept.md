---
title: Role-based access control for Media Services accounts
description: This article discusses Azure role-based access control (Azure RBAC) for Azure Media Services accounts.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''
ms.service: media-services
ms.workload: 
ms.topic: conceptual
ms.date: 08/31/2020
ms.author: inhenkel
ms.custom: seodec18, devx-track-csharp
---

# Azure role-based access control (Azure RBAC) for Media Services accounts

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

Currently, Azure Media Services does not define any custom roles specific to the service. To get full access to the Media Services account, customers can use the built-in roles of **Owner** or **Contributor**. The main difference between these roles is: the **Owner** can control who has access to a resource and the **Contributor** cannot. The built-in **Reader** role can also be used but the user or application will only have read access to the Media Services APIs. 

## Design principles

One of the key design principles of the v3 API is to make the API more secure. v3 APIs do not return secrets or credentials on **Get** or **List** operations. The keys are always null, empty, or sanitized from the response. The user needs to call a separate action method to get secrets or credentials. The **Reader** role cannot call operations like Asset.ListContainerSas, StreamingLocator.ListContentKeys, ContentKeyPolicies.GetPolicyPropertiesWithSecrets. Having separate actions enables you to set more granular Azure RBAC security permissions in a custom role if desired.

To list the operations Media Services supports, do:

```csharp
foreach (Microsoft.Azure.Management.Media.Models.Operation a in client.Operations.List())
{
    Console.WriteLine($"{a.Name} - {a.Display.Operation} - {a.Display.Description}");
}
```

The [built-in role definitions](../../role-based-access-control/built-in-roles.md) article tells you exactly what the role grants. 

See the following articles for more information:

- [Classic subscription administrator roles, Azure roles, and Azure AD roles](../../role-based-access-control/rbac-and-directory-admin-roles.md)
- [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md)
- [Add or remove Azure role assignments using the REST API](../../role-based-access-control/role-assignments-rest.md)
- [Media Services resource provider operations](../../role-based-access-control/resource-provider-operations.md#microsoftmedia)

## Next steps

- [Developing with Media Services v3 APIs](media-services-apis-overview.md)
- [Get content key policy using Media Services .NET](drm-get-content-key-policy-dotnet-how-to.md)
