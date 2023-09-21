---
title: Migrate away from using email claims for user identification or authorization
description: Learn how to migrate your application away from using insecure claims, such as email, for authorization purposes. 
services: active-directory
author: davidmu1

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/11/2023
ms.author: davidmu
ms.reviewer: medbhargava
ms.custom: curation-claims

---

# Migrate away from using email claims for user identification or authorization

This article is meant to provide guidance to developers whose applications are currently using an insecure pattern where the email claim is used for authorization, which can lead to full account takeover by another user. Continue reading to learn more about if your application is impacted, and steps for remediation. 

## How do I know if my application is impacted?

Microsoft recommends reviewing application source code and determining whether the following patterns are present: 

- A mutable claim, such as `email`, is used for the purposes of uniquely identifying a user
- A mutable claim, such as `email` is used for the purposes of authorizing a user's access to resources

These patterns are considered insecure, as users without a provisioned mailbox can have any email address set for their Mail (Primary SMTP) attribute. **This attribute is not guaranteed to come from a verified email address**. When an email claim with an unverified domain owner is used for authorization, any user without a provisioned mailbox has the potential to gain unauthorized access by changing their Mail attribute to impersonate another user. 

An email is considered to be domain-owner verified if: 

- The domain belongs to the tenant where the user account resides, and the tenant admin has done verification of the domain
- The email is from a Microsoft Account (MSA)
- The email is from a Google account 
- The email was used for authentication using the one-time passcode (OTP) flow

It should also be noted that Facebook and SAML/WS-Fed accounts don't have verified domains.

This risk of unauthorized access has only been found in multi-tenant apps, as a user from one tenant could escalate their privileges to access resources from another tenant through modification of their Mail attribute. 

## How do I protect my application immediately? 

To secure applications from mistakes with unverified email addresses, all new multi-tenant applications are automatically opted-in to a new default behavior that removes email addresses with unverified domain owners from tokens as of June 2023. This behavior is not enabled for single-tenant applications and multi-tenant applications with previous sign-in activity with domain-owner unverified email addresses. 

Depending on your scenario, you may determine that your application's tokens should continue receiving unverified emails. While not recommended for most applications, you may disable the default behavior by setting the `removeUnverifiedEmailClaim` property in the [authenticationBehaviors object of the applications API in Microsoft Graph](/graph/applications-authenticationbehaviors).

By setting `removeUnverifiedEmailClaim` to `false`, your application will receive `email` claims that are potentially unverified and subject users to account takeover risk. If you're disabling this behavior in order to not break user login flows, it's highly recommended to migrate to a uniquely identifying token claim mapping as soon as possible, as described in the guidance below. 

## Identifying insecure configurations and performing database migration 

You should never use mutable claims (such as `email`, `preferred_username`, etc.) as identifiers to perform authorization checks or index users in a database. These values are reusable and could expose your application to privilege escalation attacks.

The following pseudocode sample helps illustrate the insecure pattern of user identification / authorization:

```
 // Your relying party (RP) using the insecure email claim for user identification (or authorization)
 MyRPUsesInsecurePattern()
 {
    // grab data for the user based on the email (or other mutable) attribute
    data = GetUserData(token.email)

    // Create new record if no data present (This is the anti-pattern!)
    if (data == null) 
    {
        data = WriteNewRecords(token.email)
    }

    insecureAccess = data.show // this is how an unverified user can escalate their privileges via an arbirarily set email
 }
```

Once you've determined that your application is relying on this insecure attribute, you need to update business logic to reindex users on a globally unique identifier (GUID). 

Mutli-tenant applications should index on a mapping of two uniquely identifying claims, `tid` + `oid`. This will segment tenants by the `tid`, and segment users by their `oid`. 

### Using the `xms_edov` optional claim to determine email verification status and migrate users

To assist developers in the migration process, we have introduced an optional claim, `xms_edov`, a Boolean property that indicates whether or not the email domain owner has been verified. 

`xms_edov` can be used to help verifying a user's email before migrating their primary key to unique identifiers, such as `oid`. The following pseudocode example illustrates how this claim may be used as part of your migration. 

```
// Verify email and migrate users by performing lookups on tid+oid, email, and xms_edov claims
MyRPUsesSecurePattern()
{
    // grab the data for a user based on the secure tid + oid mapping
    data = GetUserData(token.tid + token.oid)

    // address case where users are still indexed by email
    if (data == null) 
    {
        data = GetUserData(token.email)

        // if still indexed by email, update user's key to GUID
        if (data != null) 
        {

            // check if email domain owner is verified 
            if (token.xms_edov == false) 
            {
                yourEmailVerificationLogic()
            }

            // migrate primary key to unique identifier mapping (tid + oid)
            data.UpdateKeyTo(token.tid + token.oid)
        }

        // new user, create new record with the correct (secure) key
        data = WriteNewRecord(token.sub)
    }

    secureAccess = data.show
}
```

Migrating to a globally unique mapping ensures that each user is primarily indexed with a value that can't be reused, or abused to impersonate another user. Once your users are indexed on a globally unique identifier, you're ready to fix any potential authorization logic that uses the `email` claim.


## Update authorization logic with proper claims validation

If your application uses `email` (or any other mutable claim) for authorization purposes, you should read through the [Secure applications and APIs by validating claims](claims-validation.md) and implement the appropriate checks. 


## Next steps

- To learn more about using claims-based authorization securely, see [Secure applications and APIs by validating claims](claims-validation.md)
- For more information about optional claims, see the [optional claims reference](./optional-claims-reference.md)
