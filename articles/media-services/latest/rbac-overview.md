---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Role-based access control for Media Services accounts - Azure | Microsoft Docs
description: This article discusses role-based access control (RBAC) for Azure Media Services accounts.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 04/02/2019
ms.author: juliako
ms.custom: seodec18

---

# Role-based access control (RBAC) for Media Services accounts

Currently, Azure Media Services does not defined any custom roles specific to the service. Customers can use the built-in roles of **Owner** or **Contributor** to get full access to a Media Services account. The main difference between these roles is: the **Owner** can control who has access to a resource and the **Contributor** cannot. The built-in reader account only has read access to the Media Services account (for example, Get and List). The readers cannot call actions on a Media Services account so they cannot call operations like Asset.ListContainerSas, StreamingLocator.ListContentKeys, ContentKeyPolicies.GetPolicyPropertiesWithSecrets. The reason for this design is so readers would not have access to the secrets in the Media Services account.

A customer can define a custom role for granular actions. You can list the operations Media Services supports like this:

```csharp
foreach (Microsoft.Azure.Management.Media.Models.Operation a in client.Operations.List())
{
    Console.WriteLine($"{a.Name} - {a.Display.Operation} - {a.Display.Description}");
}
```

The built-in role definitions documentation tells you exactly what the role grants.

## See also

- [Classic subscription administrator roles, Azure RBAC roles, and Azure AD administrator roles](https://docs.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles)
- [What is role-based access control (RBAC) for Azure resources?](https://docs.microsoft.com/azure/role-based-access-control/overview)

## Next steps

[Developing with Media Services v3 APIs](media-services-apis-overview.md)
