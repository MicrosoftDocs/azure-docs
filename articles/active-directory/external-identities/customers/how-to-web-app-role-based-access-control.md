---
title: Use role-based access control in your Node.js web application
description: Learn how to configure groups and user roles in your customer's tenant, so you can receive them as claims in a security token for your Node.js application
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 06/16/2023
ms.custom: developer, devx-track-js
---

# Use role-based access control in your Node.js web application

Role-based access control (RBAC) is a mechanism to enforce authorization in applications. Microsoft Entra ID for customers allows you to define application roles for your application and assign those roles to users and groups. The roles you assign to a user or group define their level of access to the resources and operations in your application. When External ID for customers issues a security token for an authenticated user, it includes the names of the roles you've assigned the user or group in the security token's roles claim. 

You can also configure your External ID for customers tenant to return the group memberships of the user. Developers can then use security groups to implement RBAC in their applications, where the memberships of the user in specific groups are interpreted as their role memberships. 

Once you assign users and groups to roles, the *roles* claim is emitted in your security token. However, to emit the *groups* membership claim in security tokens, you need additional configuration in your customer's tenant.

In this article, you learn how to receive user roles or group membership or both as claims in a security token for your Node.js web app.  

## Prerequisites

- If you've not done so, complete the steps in [Using role-based access control for applications](how-to-use-app-roles-customers.md) article. This article shows you how to create roles for your application, how to assign users and groups to those roles, how to add members to a group and how to add a group claim to a to security token. Learn more about [ID tokens](../../develop/id-tokens.md) and [access tokens](../../develop/access-tokens.md). 

- If you've not done so, complete the steps in [Sign in users in your own Node.js web application](tutorial-web-app-node-sign-in-prepare-tenant.md)

## Receive groups and roles claims in your Node.js web app 

Once you configure your customer's tenant, you can retrieve your *roles* and *groups* claims in your client app. The *roles* and *groups* claims are both present in the ID token and the access token, but your client app only needs to check for these claims in the ID token to implement authorization in the client side. The API app can also retrieve these claims when it receives the access token.

You check your *roles* claim value as shown in the following code snippet example:

```javascript
const msal = require('@azure/msal-node');
const { msalConfig, TENANT_SUBDOMAIN, REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } = require('../authConfig');

...
class AuthProvider {
...
    async handleRedirect(req, res, next) {
        const authCodeRequest = {
            ...req.session.authCodeRequest,
            code: req.body.code, // authZ code
            codeVerifier: req.session.pkceCodes.verifier, // PKCE Code Verifier
        };
    
        try {
            const msalInstance = this.getMsalInstance(this.config.msalConfig);
            const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body);
            let roles = tokenResponse.idTokenClaims.roles;
        
            //Check roles
            if (roles && roles.includes("Orders.Manager")) {
                //This user can view the ID token claims page.
                res.redirect('/id');
            }
            
            //User can only view the index page.
            res.redirect('/');
        } catch (error) {
            next(error);
        }
    }
...
}

```

If you assign a user to multiple roles, the `roles` string contains all roles separated by a comma, such as `Orders.Manager,Store.Manager,...`. Make sure you build your application to handle the following conditions:

- absence of `roles` claim in the token
- user hasn't been assigned to any role
- multiple values in the `roles` claim when you assign a user to multiple roles  

You can also check your *groups* claim value as shown in the following code snippet example:

```javascript
const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body);
let groups = tokenResponse.idTokenClaims.groups;
```
The groups claim value is the group's *objectId*. If a user is a member of multiple groups, the `groups` string contains all groups separated by a comma, such as `7f0621bc-b758-44fa-a2c6-...,6b35e65d-f3c8-4c6e-9538-...`.

> [!NOTE] 
> If you assign a user [Microsoft Entra in-built roles](../../roles/permissions-reference.md) or commonly known as directory roles, those roles appear in the *groups* claim of the security token. 

## Handle groups overage

To ensure that the size of the security token doesn’t exceed the HTTP header size limit, External ID for customers limits the number of object IDs that it includes in the *groups* claim. The overage limit is **150 for SAML tokens and 200 for JWT tokens**. It's possible to exceed this limit if a user belongs to many groups, and you request for all the groups. 

### Detect group overage in your source code 

If you can't avoid groups overages, then you need to handle it in your code. When you exceed the overage limit, the token doesn't contain the *groups* claim. Instead, the token contains a *_claim_names* claim that contains a *groups* member of the array. So, you need to check the existence of *_claim_names* claim to tell that an overage has occurred. The following code snippet shows you how to detect a groups overage: 

```javascript
const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body);

if(tokenResponse.idTokenClaims.hasOwnProperty('_claim_names') && tokenResponse.idTokenClaims['_claim_names'].hasOwnProperty('groups')) {
    //overage has occurred
}
```

Use the instructions in [Configuring group claims and app roles in tokens](/security/zero-trust/develop/configure-tokens-group-claims-app-roles#group-overages) article to learn how request for the full groups list when groups overage occurs.

## How to use groups and roles values in your Node.js web app 

In the client app, you can verify whether a signed-in user has the necessary role(s) to access a protected route or call an API endpoint. This can be done by checking the `roles` claim in the ID token. To implement this protection in your app, you can build guards by using a custom middleware. 

In your service app (API app), you can also protect the API endpoints. After you [validate the access token](../../develop/access-tokens.md#validate-tokens) sent by the client app, you can check for the *roles* or *groups* claims in the payload claims of the access token. 

## Do I use App Roles or Groups?

In this article, you have learned that you can use *App Roles* or *Groups* to implement RBAC in your application. The preferred approach is to use app roles as app roles provide more granular control when managing access/permissions at the application level. For more information on how to choose an approach, see [Choose an approach](../../develop/custom-rbac-for-developers.md#choose-an-approach).   

## Next steps

- Learn more about [Configuring group claims and app roles in tokens](/security/zero-trust/develop/configure-tokens-group-claims-app-roles).
