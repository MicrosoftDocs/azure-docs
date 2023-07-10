---
title: "Tutorial: Add app roles to .NET MAUI app and receive them in the ID token"
description: This tutorial demonstrates how to add app roles to .NET Multi-platform App UI (.NET MAUI) shell and receive them in the ID token.
author: henrymbuguakiarie
manager: mwongerapk

ms.author: henrymbugua
ms.service: active-directory
ms.topic: tutorial
ms.subservice: ciam
ms.date: 06/05/2023
---

This tutorial demonstrates how to add app roles to .NET Multi-platform App UI (.NET MAUI) and receive them in the ID token.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Add roles for an application.
> - Assign users and groups to roles
> - Access the roles in the ID token

## Prerequisites

- [Tutorial: Sign in users in .NET MAUI shell app](tutorial-desktop-app-maui-sign-in-sign-out.md)
- [Using role-based access control for applications](how-to-use-app-roles-customers.md)

## Receive groups and roles claims in .NET MAUI

Once you configure your customer's tenant, you can retrieve your roles and groups claims in your client app. The roles and groups claims are both present in the ID token and the access token. Access tokens are only validated in the web APIs for which they were acquired by a client. The client should not validate access tokens.

The .NET MAUI needs to check for the app roles claims in the ID token to implement authorization in the client side.

In [.NET MAUI _ClaimsView.xaml.cs_](tutorial-desktop-app-maui-sign-in-sign-out.md#handle-the-claimsview-data), you check the roles claim value as shown in the following code snippet example:

```csharp
IdTokenClaims = PublicClientSingleton.Instance.MSALClientHelper.AuthResult.ClaimsPrincipal.Claims.Select(c => c.Value);
```

If you assign a user to multiple roles, the roles string contains all roles separated by a comma, such as Orders.Manager,Store.Manager,.... Make sure you build your application to handle the following conditions:

- Absence of roles claim in the token
- user hasn't been assigned to any role
- Multiple values in the roles claim when you assign a user to multiple roles



## Next steps

For more information on group overages and making informed decisions regarding the usage of app roles or groups, see:

- [Group overages](/security/zero-trust/develop/configure-tokens-group-claims-app-roles)
- [Choose an approach](../../develop/custom-rbac-for-developers.md#choose-an-approach).