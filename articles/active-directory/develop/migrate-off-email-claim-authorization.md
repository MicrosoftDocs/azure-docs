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

This risk of unauthorized access has only been found in multi-tenant apps, as a user from one tenant could escalate their privileges to access resources from another tenant through modification of their Mail attribute.

## Migrate applications to more secure configurations

You should never use mutable claims (such as `email`, `preferred_username`, etc.) as identifiers to perform authorization checks or index users in a database. These values are re-usable and could expose your application to privilege escalation attacks. If your application is currently using one of these claims, follow the steps below to keep your user accounts secure. 

### Step 1: Temporarily enable `replace_unverified_email_with_upn`

To mitigate the risk of unauthorized access before updating application code, you can use the `replace_unverified_email_with_upn` property for the optional `email` claim, which replaces (or removes) email claims, depending on account type, according to the following table: 

| **User type** | **Replaced with** |
|---------------|-------------------|
| On Premise | Home tenant UPN |
| Cloud Managed | Home tenant UPN |
| Microsoft Account (MSA) | Email address the user signed up with |
| Email OTP | Email address the user signed up with |
| Social IDP: Google | Email address the user signed up with | 
| Social IDP: Facebook | Email claim isn't issued |
| Direct Fed | Email claim isn't issued |

Enabling `replace_unverified_email_with_upn` eliminates the most significant risk of cross-tenant privilege escalation by ensuring authorization doesn't occur against an arbitrarily set email value. This option is also documented under the documentation for [additional properties of optional claims](active-directory-optional-claims.md#additional-properties-of-optional-claims).

While enabling this property prevents unauthorized access, it will also break access to users with unverified emails. For this reason, `replace_unverified_email_with_upn` should be considered a short-term risk mitigation measure while taking further action to migrate to a more secure, globally unique identifier as described below. 

### Step 2: Migrate to a globally unique user identifier

If your application uses the `email` claim (or any other mutable claim) as the primary key to identify a user, you should migrate this key to a globally unique identifier (GUID) such as the object ID (referred to as `oid` in the token claims). 

The following psudeocode samples help illustrate both the insecure pattern of user identification and how to migrate to a more secure pattern. If your application is using the (insecure)`email` claim, it may look something like: 

```
[To be replaced with more polished samples from engineering]

 // Your relying party (RP) using the insecure (mutable) email claim for user identification
 MyRPDoesStuffWrong(){
    // grab data for the user based on the email (or other mutable) attribute
    data = GetUserData(token.email)

    // Create new record if no data present (This is the anti-pattern!)
    if (data == null) {
        data = WriteNewRecords(token.email)
    }

    securityViolation = data.show // this is how an unverified user can escalate their privileges via an arbirarily set email
 }
```

Once you've determined that your application is relying on this insecure attribute, you'll need to update business logic to re-index on a GUID. To avoid downtime, you could re-index users in a just-in-time fashion by performing user lookups on both the new GUID and the previous mutable claim, like so: 

```
[To be replaced with more polished samples from engineering]
// Migrate users by performing lookups both on oid and email claims
MyRPDoesStuffRight() {
    // grab the data for a user based on the oid attribute
    data = GetUserData(token.oid)

    // address case where users are still indexed by email
    if (data == null) {
        data = GetUserData(token.email)

        // if still indexed by email, update user's key to GUID
        if (data != null) {
            data.UpdateKeyTo(token.oid)
        }
        // new user, create new record with the correct (secure) key
        data = WriteNewRecord(token.oid)
    }

    securityHappyPlace = data.show
}
```

Migrating to a globally unique identifier ensures that each user is primarily indexed with a value that can't be re-used (or abused to impersonate another user). Once your users are indexed on a globablly unique identifier, you are ready to fix any potential authorization logic that uses the `email` claim.


### Step 3: Update authorization logic with proper claims validation

If your application uses `email` (or any other mutable claim) for authorization purposes, you should read through the [Secure applications and APIs by validating claims](claims-validation.md) and implement the appropriate checks. 


## Next steps

- To learn more about using claims-based authorization securely, see [Secure applications and APIs by validating claims](claims-validation.md)
- For more information about optional claims, see [Provide optional claims to your application](./active-directory-optional-claims.md)