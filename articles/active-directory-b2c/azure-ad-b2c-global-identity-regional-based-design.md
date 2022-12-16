---
title: Azure Active Directory B2C global identity framework region-based design considerations 
titleSuffix: Azure AD B2C
description: Learn the region-based design consideration for Azure AD B2C to provide customer identity management for global customers.
services: active-directory-b2c
author: gargi-sinha
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 12/15/2022
ms.author: gasinh
ms.subservice: B2C
---

# Build a global identity solution with region-based approach

In this article, we describe the scenarios for region-based design approach. Before  starting to design, it's recommended that you review the [capabilities](link be added), and [performance](link to be added) of both funnel and region-based design approach.

## Local account authentications

### Local user sign-up

This scenario demonstrates how a user from their home country/region performs a sign-up with an Azure Active Directory B2C (Azure AD B2C) local account.

![Screenshot shows the local user sign-up flow.](media/)

1. User from EMEA attempts to sign up at myapp.fr. If the user isn't being sent to their local hostname, the traffic manager will enforce a redirect.

2. User lands at the EMEA tenant.

3. The user attempts to sign up. The sign-up process checks a global lookup table to determine if the user exists in any of the regional Azure AD B2C tenants.

4. The user isn't found in the global lookup table.

5. The user's account is written into Azure AD B2C, and a record is created into the global lookup table.

6. The regional tenant issues a token back to the app.

### Existing local user attempts sign up

This scenario demonstrates how to prevent users from re-registering the same email address from a different country or region. This ensures a
single user profile per identity.

![Screenshot shows the existing local user sign up attempt flow.](media/)

1. User from EMEA attempts to sign up at myapp.fr. If the user isn't being sent to their local hostname, the traffic manager will enforce a redirect.

2. User lands at the EMEA tenant.

3. The user attempts to sign up. The sign-up process checks a global lookup table to determine if the user exists in any of the regional Azure AD B2C tenants.

4. The user's email is found in the global lookup table, indicating the user has registered this email in the solution at some prior point in time.

5. The user is presented with an error, indicating their account exists.

### Local user sign-in

This scenario demonstrates how a user from their home country/region performs a sign-in with an Azure AD B2C local account.

![Screenshot shows the local user sign in flow.](media/)

1. User from EMEA attempts to sign in at myapp.fr. If the user isn't being sent to their local hostname, the traffic manager will enforce a redirect.

2. User lands at the EMEA tenant.

3. User enters their credentials at the regional tenant.

4. The regional tenant issues a token back to app.

5. The user is signed in to the app.

### Traveling user sign-in

This scenario demonstrates how a user can travel across regions and maintain their user profile and credentials stored in their regional
tenant respective to their sign-up.

![Screenshot shows the traveling user sign-in flow.](media/)

1. User from NOAM attempts to sign in at myapp.fr, since they are on holiday in France. If the user isn't being sent to their local hostname, the traffic manager will enforce a redirect.

1. User lands at the EMEA tenant.

1. User enters their credentials at the regional tenant.

1. The regional tenant performs a lookup into the global lookup table, since this user's email wasn't found in the EMEA Azure AD B2C directory.

1. The user's email is located where the user signed up in the NOAM Azure AD B2C tenant.

1. The EMEA Azure AD B2C tenant performs an Azure AD ROPC flow against the NOAM Azure AD B2C tenant to verify credentials.

This call will also fetch a token for MS Graph API, which allows
fetching the user's full profile.

The EMEA Azure AD B2C tenant performs a Graph API call to the NOAM Azure AD
B2C tenant to fetch the user's profile. This call is authenticated by
the access token for Graph API acquired in the last step.

1. The regional tenant issues a token back app.

### Local user forgot password

This scenario demonstrates how a user can reset their password when they are within their home country.

![Screenshot shows the local user forgot password flow.](media/)

1. User from EMEA attempts to sign in at myapp.fr.

If the user isn't being sent to their local hostname, the traffic
manager will enforce a redirect.

1. The user arrives at the EMEA Azure AD B2C tenant, and selects **forgot
    password**. The user enters and verifies their email.

1. Email lookup is performed to determine which regional tenant the
    user exists in. It exists in EMEA.

1. The user provides a new password.

1. The new password is written into the EMEA Azure AD B2C tenant.

1. The regional tenant issues a token back to the app.

### Traveling user forgot password

This scenario demonstrates how a user can reset their password when they're traveling, away from the region in which they registered their
account.

![Screenshot shows the traveling user forgot password flow.](media/)

1. User from NOAM attempts to sign in at myapp.fr, since they are on
    holiday in France.

If the user isn't being sent to their local hostname, the traffic
manager will enforce a redirect.

1. The user arrives at the EMEA Azure AD B2C tenant and selects **forgot
    password**. The user enters and verifies their email.

1. Email lookup is performed to determine which regional tenant the user exists in.

1. The email is found to exist in the NOAM Azure AD B2C tenant. The user provides a new password.

1. The new password is written into the NOAM Azure AD B2C tenant through a Graph API call.

1. The regional tenant issues a token back to the app.

### Local user change password

This scenario demonstrates how a user can change their password after
they've logged in, from the region in which they registered their
account.

![Screenshot shows the traveling user change password flow.](media/)

1. User from EMEA attempts selects **change password** after logging into
    myapp.fr.

1. The user arrives at the EMEA Azure AD B2C tenant, and the SSO cookie set
    allows the user to change their password immediately.

1. New password is written to the users account in the EMEA Azure AD B2C
    tenant.

1. The regional tenant issues a token back to the app.

### Traveling user change password

This scenario demonstrates how a user can change their password after they've logged in, away from the region in which they registered their account.

![Screenshot shows the traveling user change password flow.](media/)

1. Users from NOAM attempts select **change password** after logging into
    myapp.fr.

1. The user arrives at the EMEA Azure AD B2C tenant, and the SSO cookie set
    allows the user to change their password immediately.

1. The users email is found to be in the NOAM tenant after checking the
    global lookup table.

1. The new password is written to the users account in the NOAM Azure AD B2C
    tenant by MS Graph API call.

1. The regional tenant issues a token back to the app.

### Federated IdP authentications

#### Sign up

This scenario demonstrates how a user from their local region sign's up
to the service.

![Screenshot shows the sign up flow.](media/)

1. User from EMEA attempts to sign up at myapp.fr. If the user isn't being sent to their local hostname, the traffic manager will enforce a redirect.

1. User lands at the EMEA tenant.

1. User selects to sign in with a federated identity provider.

1. Perform a lookup into the global lookup table.

    a.  If account linking in scope: Proceed if the federated IdP
        identifier or the email that came back from the federated IdP
        doesn't exist in the lookup table.

    b.  If account linking not in scope: Proceed if the federated IdP
        identifier that came back from the federated IdP doesn't exist
        in the lookup table.

1. Write the users account to the EMEA Azure AD B2C tenant.

1. The regional tenant issues a token back to the app.

### Sign in

This scenario demonstrates how a user from their local region sign's into the service.

![Screenshot shows the sign in flow.](media/)

1. User from EMEA attempts to sign in at myapp.fr.

If the user isn't being sent to their local hostname, the traffic
manager will enforce a redirect.

1. User lands at the EMEA tenant.

1. User selects to sign in with a federated identity provider.

1. Perform a lookup into the global lookup table and confirm the user's
    federated ID is registered in EMEA.

1. The regional tenant issues a token back to the app.

#### Sign in of traveling user

This scenario demonstrates how a user located away from the region in which they signed up from, performs a sign-in to the service using a federated IdP.

![Screenshot shows the sign in for traveling user flow.](media/)

1. User from NOAM attempts to sign in at myapp.fr.

If the user isn't being sent to their local hostname, the traffic
manager will enforce a redirect.

1. User lands at the EMEA tenant.

1. User selects to sign in with a federated identity provider.

    a.  Use the same app registered at FB, it ensures that ID is always the same.

    b.  Multiple redirect URIs.

1. Perform a lookup into the global lookup table and determine the    user's federated ID is registered in NOAM.

1. Read the account data from the NOAM Azure AD B2C tenant using MS Graph     API.

1. The regional tenant issues a token back to the app.

#### Merge/link accounts

This scenario demonstrates how users will be able to perform account linking when a matching criterion is satisfied (usually email address).

![Screenshot shows the merge/link accounts flow.](media/)

1. User from EMEA attempts to sign in at myapp.fr.

If the user isn't being sent to their local hostname, the traffic
manager will enforce a redirect.

1. User lands at the EMEA tenant.

1. User selects to sign in with a federated identity provider/social IdP.

1. A lookup is performed into the global lookup table for the ID
    returned from the federated IdP.

1. Where the ID doesn't exist, but the email from the federated IdP does exist in EMEA Azure AD B2C, it's an account linking scenario.

1. Read the user from the directory, and determine which authentication methods are enabled on the account. Present a screen for the user to sign in with an existing authentication method on this account.

1. Once the user proves they own the account in Azure AD B2C, add the new social ID to the existing account, and add the social ID to the account in the global lookup table.

1. The regional tenant issues a token back to the app.

#### Traveling user merge/link accounts

This scenario demonstrates how users will be able to perform  account linking when they're away from the region.

![Screenshot shows the traveling user merge/link accounts flow.](media/)

1. User from NOAM attempts to sign in at myapp.fr.

If the user isn't being sent to their local hostname, the traffic
manager will enforce a redirect.

1. User lands at the EMEA tenant.

1. User selects to sign in with a federated identity provider/social IdP.

1. A lookup is performed into the global lookup table for the ID
    returned from the federated IdP.

1. Where the ID doesn't exist, and the email from the federated IdP exists in another region, it's a traveling user account linking scenario.

1. Create an id_token_hint link asserting the users currently
    collected claims. Bootstrap a journey into the NOAM Azure AD B2C tenant using federation. The user will prove that they own the account via the NOAM Azure AD B2C tenant.

    a. This method is used to reuse existing account linking logic in the home tenant, and reduce external API calls to manipulate the identities collection.

1. Once the user proves they own the account in Azure AD B2C, add the new social ID to the existing account by making a Graph API call to the NOAM Azure AD B2C tenant. Add the social ID to the account in the global lookup table.

1. The regional tenant issues a token back to the app.

## Next steps

- [Azure AD B2C global identity solutions](azure-ad-b2c-global-identity-solutions.md)

- [Build a global identity solution with funnel-based approach](azure-ad-b2c-global-identity-funnel-based-design.md)

- [Azure AD B2C global identity proof of concept regional-based configuration](azure-ad-b2c-global-identity-proof-of-concept-regional.md)

- [Azure AD B2C global identity proof of concept funnel-based configuration](azure-ad-b2c-global-identity-proof-of-concept-funnel.md)