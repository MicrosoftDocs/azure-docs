---
title: Use role-based access control in your Node.js web application
description: Learn how to configure groups and user roles in your customers tenant, so you can receive them as claims in a security token for your Node.js application
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 06/16/2023
ms.custom: developer
---

# Use role-based access control in your Node.js web application

Role-based access control (RBAC) is a popular mechanism to enforce authorization in applications. Azure AD for customers allows you to define application roles for your application and assign those roles to users and groups. The roles you assign to a user or group define their level of access to the resources and operations in your application. When Azure AD for customers issues a security token for an authenticated user, it includes the names of the roles you've assigned the user or group in the security token's roles claim. 

You can also configure your Azure AD for customers tenant to return the group memberships of the user. Developers can then use security groups to implement RBAC in their applications, where the memberships of the user in specific groups are interpreted as their role memberships. 

Once you assign users and groups to roles, the *roles* claim is emitted in your security token. However, to emit the *groups* membership claim in security tokens, you need additional configuration in your customers tenant.

In this article, you learn how to receive user roles or group membership or both as claims in a security token for your Node.js web app.  

## Prerequisites

- A security group in your customers tenant. If you've not done so, [create one](../../roles/groups-create-eligible.md#azure-portal).

- If you've not done so, complete the steps in [Using role-based access control for applications](how-to-use-app-roles-customers.md) article. This articles shows you how to create roles for your application, how to assign users and groups to those roles, how to add members to a group and how add a group claim to a to security token.

## Receive groups and roles claims in your Node.js web app 

One you've configured your customers tenant, you can retrieve your *roles* and *groups* claims in your app. You receive these claims whether your app requests for an ID token or an access token, but your app only needs to check for these claims in the ID token.

You can check your *roles* claim value as shown in the following code snippet:

    ```javascript
    //...
    const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body);
    let roles = tokenResponse.idTokenClaims.roles;
    //console.log("\nroles: \n" + tokenResponse.idTokenClaims.roles);
    //...
    ```

If you assign a user to multiple roles, the `roles` string contain all roles separated by a comma, such as *Orders.Manager,Store.Manager*. Make sure you build your application to handle the following conditions:

- absence of `roles` claim in the token
- user hasn't been assigned to any role
- multiple values in the `roles` claim when you assign a user to multiple roles  

You can also check your *groups* claim value as shown in the following code snippet:

    ```javascript
    //...
    const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body);
    let groups = tokenResponse.idTokenClaims.groups;
    //console.log("\ngroups: \n" + tokenResponse.idTokenClaims.groups);
    //...
    ```
The groups claim value is the group's *objectId*. If a user is a member of multiple groups, the `groups` string contain all groups separated by a comma, such as *7f0621bc-b758-44fa-a2c6-...,6b35e65d-f3c8-4c6e-9538-...*.

> [!NOTE] 
> If you assign a user [Azure AD in-built roles](../../roles/permissions-reference.md) or commonly known as directory roles, those roles appear in the *groups* claim of the security token. 

## Handle groups overages

To ensure that the security token size doesn’t exceed the HTTP header size limits, Azure AD for customers limits the number of object IDs that it includes in the *groups* claim. The overage limit **150 for SAML tokens, 200 for JWT tokens, six for SPA using implicit flow**. It's possible to exceed this limit if a user belongs to many groups, and you request for all the groups. 

### Detect group overage in your source code 

If you can't avoid groups overages, then you need to handle it in your code. When you exceed the overage limit, the token won't contain the *groups* claim. Instead, the token contain a *_claim_names* claim that contains a *groups* member of the array. 

Use the instructions in [Configuring group claims and app roles in tokens](/security/zero-trust/develop/configure-tokens-group-claims-app-roles#group-overages) article to learn how request for the full groups list when group overages occur.

## How to use groups and roles values in your Node.js web app 

In the client app (one that signs in the user), you can check whether a signed in user belongs to the required role(s) to access a protected route. You can do this by checking `roles` claim the ID token of the. By doing this, you can make sure that only authorized users can view certain pages of your application. 

In your app, you can also enforce that a user belongs to the required role(s) to make a call to an API on an endpoint. You can build these guards by using custom middleware, which checks for the required roles or groups. 

However, SPA apps are not secure frontend guard must be done in the backend (API) ... https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/blob/main/5-AccessControl/1-call-api-roles/README.md 

In the API side,    

## Do I use APP Roles or Groups?

In this article, you've learnt that you can use *App Roles* or *Groups* to implement RBAC in your application. The preferred approach is to use app roles as it is the easiest to implement. For more information on how to choose an approach, see [Choose an approach](../../develop/custom-rbac-for-developers.md#choose-an-approach).   

## Next steps

- Learn more about [Configuring group claims and app roles in tokens](/security/zero-trust/develop/configure-tokens-group-claims-app-roles).
