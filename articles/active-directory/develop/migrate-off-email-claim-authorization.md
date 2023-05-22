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

These patterns are considered insecure, as users without a provisioned mailbox can have any email address set for their Mail (Primary SMTP) attribute. **This attribute is not guaranteed to come from a verified email address**. When an unverified email claim is used for authorization, any user without a provisioned mailbox has the potential to gain unauthorized access by changing their Mail attribute to impersonate another user. 

This risk of unauthorized access has only been found in multi-tenant apps, as a user from one tenant could escalate their privileges to access resources from another tenant through modification of their Mail attribute. To mitigate this risk as much as possible and keep apps secure, Azure AD defaults to omitting the `email` claim from tokens as of June 2023. While not recommended, it is possible to still issue unverified emails with Microsoft Graph. More information on this setting is provided towards the end of this article. 

## Migrate applications to more secure configurations

You should never use mutable claims (such as `email`, `preferred_username`, etc.) as identifiers to perform authorization checks or index users in a database. These values are re-usable and could expose your application to privilege escalation attacks. If your application is currently using one of these claims, follow the steps below to keep your user accounts secure. 

If your application uses the `email` claim (or any other mutable claim) as the primary key to identify a user, you should migrate this key to a globally unique identifier (GUID) such as the subject (referred to as `sub` in the token claims). 

The following psudeocode samples help illustrate both the insecure pattern of user identification and how to migrate to a more secure pattern. If your application is using the (insecure) `email` claim, it may look something like: 

```
 // Your relying party (RP) using the insecure email claim for user identification
 MyRPDoesStuffWrong(){
    // grab data for the user based on the email (or other mutable) attribute
    data = GetUserData(token.email)

    // Create new record if no data present (This is the anti-pattern!)
    if (data == null) {
        data = WriteNewRecords(token.email)
    }

    insecureAccess = data.show // this is how an unverified user can escalate their privileges via an arbirarily set email
 }
```

Once you've determined that your application is relying on this insecure attribute, you'll need to update business logic to re-index on a GUID. To avoid downtime, you could re-index users in a just-in-time fashion by performing user lookups on both the new GUID and the previous mutable claim, like so: 

```
// Migrate users by performing lookups both on oid and email claims
MyRPDoesStuffRight() {
    // grab the data for a user based on the sub attribute
    data = GetUserData(token.sub)

    // address case where users are still indexed by email
    if (data == null) {
        data = GetUserData(token.email)

        // if still indexed by email, update user's key to GUID
        if (data != null) {
            data.UpdateKeyTo(token.sub)
        }
        
        // new user, create new record with the correct (secure) key
        data = WriteNewRecord(token.sub)
    }

    secureAccess = data.show
}
```

## What if I'd like to continue issuing unverified emails in tokens?

Dependent on your scenario, you may determine that your application's tokens should continue receiving unverified emails. You may disable the default behavior by setting the `removeUnverifiedEmailClaim` property in the [Authentication Behaviors Microsoft Graph API](https://review.learn.microsoft.com/en-us/graph/api/resources/authenticationbehaviors?view=graph-rest-beta&branch=pr-en-us-21083).

By setting `removeUnverifiedEmailClaim` to `false`, your application will receive `email` claims that are potentially unverified and be subject to account takeover risk. If you are disabling this behavior in order to break user login flows, it is still recommended to migrate to a GUID such as the `sub` claim. 

### Using the `xms_edov` optional claim to determine email verification status

To assist developers in the migration process with the secure behavior disabled we have also introduced an optional claim, `xms_edov`, a Boolean property that indicates whether or not the email domain owner has been verified. 

`xms_edov` can be used to assist in verfifying a user's email before migrating their primary key to a GUID such as `sub`. The following psuedocode example illustrates how this claim may be used as part of your migration. 

```
// Verify email and migrate users by performing lookups on sub, email, and xms_edov claims
MyRPDoesStuffRight() {
    // grab the data for a user based on the sub attribute
    data = GetUserData(token.sub)

    // address case where users are still indexed by email
    if (data == null) {
        data = GetUserData(token.email)

        // if still indexed by email, update user's key to GUID
        if (data != null) {

            // check if email domain owner is verified 
            if (token.xms_edov == false) {
                yourEmailVerificationLogic()
            }

            // migrate primary key to GUID
            data.UpdateKeyTo(token.sub)
        }

        // new user, create new record with the correct (secure) key
        data = WriteNewRecord(token.sub)
    }

    secureAccess = data.show
}
```

Migrating to a globally unique identifier ensures that each user is primarily indexed with a value that can't be re-used, or abused to impersonate another user. Once your users are indexed on a globablly unique identifier, you are ready to fix any potential authorization logic that uses the `email` claim.


## Update authorization logic with proper claims validation

If your application uses `email` (or any other mutable claim) for authorization purposes, you should read through the [Secure applications and APIs by validating claims](claims-validation.md) and implement the appropriate checks. 


## Next steps

- To learn more about using claims-based authorization securely, see [Secure applications and APIs by validating claims](claims-validation.md)
- For more information about optional claims, see [Provide optional claims to your application](./active-directory-optional-claims.md)