---
title: Known issues in customer tenants
description: Learn about known issues in customer tenants.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 05/31/2023
ms.author: mimart
ms.custom: it-pro

---

# Known issues with Azure Active Directory (Azure AD) for customers

This article describes known issues that you may experience when you use Azure Active Directory (Azure AD) for customers, and provides help to resolve these issues.

## Tenant creation and management

### Tenant creation fails when you choose an unsupported region

During customer tenant creation, the **Country/Region** dropdown menu lists countries and regions where Azure Azure AD for customers isn't yet available. If you choose Japan or Australia, tenant creation fails.

**Cause**: Public preview is currently available in the Americas and Europe, with more regions to follow shortly.

**Workaround**: Select a different region and try again

### Customer trial tenants can't be extended or linked with an existing Azure subscription

Customer trial tenants can't be supported beyond 30 days.

**Workaround**: Take one of the following actions.

- To continue beyond 30 days, if you're an existing Azure AD customer, [create a new customer tenant](how-to-create-customer-tenant-portal.md) with your subscription.

- If you don’t have an Azure AD account, delete the trial tenant and [set up an Azure free account](https://azure.microsoft.com/free/).

### The get started guide UI lacks client-side validation for the Domain name field

When you manually update the autopopulated value for the **Domain name** field, it may appear as though the value is accepted, but then an error occurs.

**Cause**: Currently there's no client-side validation in the get started guide for setting up a trial tenant.

**Workaround**: Enter a value that meets the domain name requirements. The **Domain name** field accepts an alphanumeric value with a length of up to 27 characters.

### Using your admin email to create a local customer account prevents you from administering the tenant

If you're the admin who created the customer tenant, and you use the same email address as your admin account to create a local customer account in that same tenant, you can't sign in directly to the tenant with admin privileges.

**Cause**: Using your tenant admin email to create a customer account via self-service sign-up creates a second user with the same email address, but with customer-level privileges. When you sign in to the tenant via `https://entra.microsoft.com/<tenantID>` or `<tenantName>.onmicrosoft.com`, the least-privileged account takes precedence, and you're signed in as the customer instead of the admin. You have insufficient privileges to manage the tenant.

**Workaround**: Take one of the following actions.

- When creating a local customer account, use a different email address than the one used by the admin who created the tenant.
- If you've already created a customer account with the same email address as the admin, sign out of the admin center, and then use `https://entra.microsoft.com` instead of `https://entra.microsoft.com/<tenantID>` or `<tenantName>.onmicrosoft.com` to sign in with the correct admin account.

### Unable to delete your customer tenant

You get the following error when you try to delete a customer tenant:

   `Unable to delete tenant`

**Cause**: This error occurs when you try to delete a customer tenant but you haven't deleted the **b2c-extensions-app**. 

Custom attributes are also known as directory extension attributes expand the user profile information stored in your customer directory. All extension attributes for your customer tenant are stored in the app named **b2c-extensions-app**.

**Workaround**: When deleting a customer tenant, delete the **b2c-extensions-app**, found in **App registrations** under **All applications**.

## Branding

### Device code flows display Microsoft branding instead of custom branding

The device code flows display Microsoft branding even when you've configured custom branding.

**Cause**: Device code flows don't yet support custom branding

**Workaround**: None currently.

### The sign-up page displays Microsoft branding and "Can't access your account?"

After you set up a tenant and create a sign-up user flow, you see Microsoft branding instead of neutral branding, along with **Can't access your account?** under the sign-in email box instead of **No account? Create one**.

**Cause**: The sign-in page for a workforce tenant is displaying instead of sign-in for a customer tenant. This issue can occur when you refresh the sign-in page too many times in quick succession.

**Workaround**: Wait a few minutes and then refresh. The customer sign-in page should appear.

## Samples

### Error when signing in to a sample

When you follow the get started guide to run a sample and try to sign in as a customer, you see an error message that starts with the following text:

   `AADSTS50011: The redirect URI specified in the request does not match the redirect URIs configured for the application...`

**Cause**: This error can occur when there is a replication delay in updating the redirect URI in the app registration.

**Workaround**: Take one of the following actions.

- Try running the sample sign in again after a few minutes.
- Check the app registration to confirm that the redirect URI in the error is configured.

### Error "Invalid client secret provided” (ASP.NET Core) or “Cannot read properties of undefined (reading 'verifier')” (Node.js)

When you run the ASP.NET Core sample from the get started guide and try to sign in as a customer, you see an error that starts with the following text:

   `AADSTS7000215: Invalid client secret provided. Ensure the secret being sent in the request is the client secret value, not the client secret ID, for a secret added to app...`

Or, when you run the Node.js sample, you see an error containing the following line:

   `TypeError: Cannot read properties of undefined (reading 'verifier')`

**Cause**: These errors can be caused by a replication delay in updating the secret in the app registration.

**Workaround**: Take one of the following actions.

- Try running the sample sign in again after a few minutes.
- Check the app registration to confirm there's a client secret configured and it matches the value in the application configuration.

## Token version in Web API

### Error when running a web API

When you create your own web API in a customer tenant (without using the app creation scripts in the web API samples), and then run it and send an access token, you enable logging and see the following error:

   `IDX20804: Unable to retrieve document from: https://<tenant>.ciamlogin.com/common/discovery/keys`

**Cause**: This error occurs if you haven't set the accepted access token version to 2.

**Workaround**: Do the following.

1. Go to the app registration for your application.
1. Choose to edit the manifest.
1. Change the **accessTokenAcceptedVersion** property from null to **2**.

## Next steps

See also [Supported features in Azure Active Directory for customers](concept-supported-features-customers.md)