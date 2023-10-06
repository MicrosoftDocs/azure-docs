---
title: Microsoft Entra SSO integration with Serenity Connect.
description: Learn how to configure single sign-on between Microsoft Entra ID and Serenity Connect.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 09/25/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with Serenity Connect

In this guide, we will walk you through the process of setting up SAML SSO integration using the Microsoft Entra ID Gallery application for Serenity Connect.

## Prerequisites

Before you begin, ensure you have the following:

1. A Serenity Connect account with administrator privileges.
2. All the required users provisioned in Serenity Connect.
3. SAML SSO enabled for your Serenity Connect organization.

If you need assistance with creating an account, setting an administrator role, or enabling SSO for your organization, please contact our support team at hello@serenityconnect.com. We can also assist you with bulk user provisioning.

## Supported features

* SP-initiated Single Sign On

## Configuration

If you haven't already, sign in to your Entra ID administrative portal. After signing in, click **Enterprise applications** in the left-hand sidebar, and then **New application** near the top of the resulting page.

Search for **Serenity Connect** and click **Create** to add it to your organization.

Once the application is installed, click **Single sign-on** in the left-hand sidebar, and select **SAML** as the single sign-on method.

On the resulting page, look for **Basic SAML Configuration** and click **Edit**.

Fill the following values in and click **Save** after completion.

| Option | Value |
| ------ | ----- |
| **Identifier (Entity ID)** | `urn:amazon:cognito:sp:us-east-2_Jx7HtgcRZ` |
| **Reply URL (Assertion Consumer Service URL)** | `https://serenityconnect.auth.us-east-2.amazoncognito.com/saml2/idpresponse` |
| **Sign on URL** | `https://app.serenityconnect.com/sso-sign-in` |
| **Logout Url (Optional)** | `https://serenityconnect.auth.us-east-2.amazoncognito.com/saml2/logout` |

Now, find the **SAML Certificates** section and copy the **App Federation Metadata Url**. Please **provide this URL to the Serenity Connect support team** along with your request to enable SSO sign-in.

**That's it! The configuration is complete**. You can test at [https://app.serenityconnect.com/sso-sign-in](https://app.serenityconnect.com/sso-sign-in).

## Next steps

### Assign users/groups to Serenity Connect

To allow users/groups in your Entra ID organization to use SSO sign-in, they must be assigned to the Serenity Connect enterprise application. Refer to the [Entra ID documentation](https://learn.microsoft.com/en-us/azure/active-directory/manage-apps/add-application-portal-assign-users#assign-a-user-account-to-an-enterprise-application) for a tutorial on how to assign a user to an application.

Please note that Serenity Connect currently does not support automatic user provisioning, so every SSO user must have an existing Serenity Connect account. Refer to the [Prerequisites](#prerequisites) section.

## Troubleshooting

### Error "AADSTS50105"

If you encounter the "AADSTS50105" error during sign-in, ensure that the user attempting to sign in is assigned to the Serenity Connect application in Microsoft Entra ID. Refer to [Assign users/groups to Serenity Connect](#assign-usersgroups-to-serenity-connect) for guidance.

### Error "User couldn't be found"

If you encounter the "We are sorry but the user couldn't be found" error during sign-in, it likely indicates that the user attempting to sign in has not been provisioned in Serenity Connect yet. Refer to the [Prerequisites](#prerequisites) section for details.

### Error "Account is not configured for SAML SSO"

If you encounter the "Your account is not configured to use SAML SSO. Please sign in with a password." error when trying to sign in, it may be due to SSO not being enabled for your organization in Serenity Connect. Contact support to enable this feature. Refer to [Prerequisites](#prerequisites).

### Error "Something went wrong" when signing in

If you encounter the "We are sorry but something went wrong. Please try again" error during sign-in, please follow this checklist before contacting the support team:

* Ensure you have a stable internet connection.
* Verify that the "Attributes & Claims" section in the Single sign-on settings of the Serenity Connect application in your Entra ID organization has default values.
* Double-check that the setup process aligns with the [Configuration](#configuration) section.
* If experiencing issues with the Serenity Engage mobile app, ensure you are using the latest version.

