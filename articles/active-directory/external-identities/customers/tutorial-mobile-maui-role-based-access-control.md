---
title: "Tutorial: Use role-based access control in your .NET MAUI app"
description: This tutorial demonstrates how to add app roles to .NET Multi-platform App UI (.NET MAUI) and receive them in the ID token.
author: henrymbuguakiarie
manager: mwongerapk

ms.author: henrymbugua
ms.service: active-directory
ms.topic: tutorial
ms.subservice: ciam
ms.date: 07/17/2023
---

# Tutorial: Use role-based access control in your .NET MAUI app

This tutorial demonstrates how to add app roles to .NET Multi-platform App UI (.NET MAUI) and receive them in the ID token.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Access the roles in the ID token.

## Prerequisites

- [Tutorial: Sign in users in .NET MAUI shell app](tutorial-mobile-app-maui-sign-in-sign-out.md)
- [Using role-based access control for applications](how-to-use-app-roles-customers.md)

## Receive groups and roles claims in .NET MAUI

Once you configure your customer's tenant, you can retrieve your roles and groups claims in your client app. The roles and groups claims are both present in the ID token and the access token. Access tokens are only validated in the web APIs for which they were acquired by a client. The client shouldn't validate access tokens.

The .NET MAUI needs to check for the app roles claims in the ID token to implement authorization in the client side.

In this tutorial series, you created a .NET MAUI app where you developed the [_ClaimsView.xaml.cs_](tutorial-mobile-app-maui-sign-in-sign-out.md#handle-the-claimsview-data) to handle `ClaimsView` data. In this file, we inspect the contents of ID tokens.

To access the role claim, you can modify the code snippet as follows:

```csharp
var idToken = PublicClientSingleton.Instance.MSALClientHelper.AuthResult.IdToken;
var handler = new JwtSecurityTokenHandler();
var token = handler.ReadJwtToken(idToken);
// Get the role claim value
var roleClaim = token.Claims.FirstOrDefault(c => c.Type == "roles")?.Value;

if (!string.IsNullOrEmpty(roleClaim))
{
    // If the role claim exists, add it to the IdTokenClaims
    IdTokenClaims = new List<string> { roleClaim };
}
else
{
    // If the role claim doesn't exist, add a message indicating that no role claim was found
    IdTokenClaims = new List<string> { "No role claim found in ID token" };
}

Claims.ItemsSource = IdTokenClaims;
```

> [!NOTE]
> To read the ID token, you must install the `System.IdentityModel.Tokens.Jwt` package.

If you assign a user to multiple roles, the roles string contains all roles separated by a comma, such as `Orders.Manager, Store.Manager,...`. Make sure you build your application to handle the following conditions:

- Absence of roles claims in the token
- User hasn't been assigned to any role
- Multiple values in the roles claim when you assign a user to multiple roles

When you define app roles for your app, it is your responsibility to implement authorization logic for those roles.

## Next steps

For more information about group claims and making informed decisions regarding the usage of app roles or groups, see:

- [Configuring group claims and app roles in tokens](/security/zero-trust/develop/configure-tokens-group-claims-app-roles)
- [Choose an approach](../../develop/custom-rbac-for-developers.md#choose-an-approach)
