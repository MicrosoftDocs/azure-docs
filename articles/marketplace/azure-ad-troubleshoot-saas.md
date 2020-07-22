---
title: Troubleshoot Azure AD authentication errors for SaaS offers
description: This article helps you resolve Azure Active Directory (Azure AD) authentication errors related to software as a service (SaaS) offers that are published to the Microsoft commercial marketplace.
author: mingshen-ms 
ms.author: mingshen
ms.reviewer: dannyevers 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 07/10/2020
---

# Troubleshoot Azure AD authentication errors for SaaS offers

This article helps you resolve Azure Active Directory (Azure AD) authentication errors related to software as a service (SaaS) offers that are published to the Microsoft commercial marketplace.

Troubleshooting solutions provided in this article:

- [AADSTS50011: The reply URL specified in the request does not match the reply URLs configured for the application](#aadsts50011-the-reply-url-specified-in-the-request-does-not-match-the-reply-urls-configured-for-the-application)
- [AADSTS50194: Application is not configured as a multi-tenant application when they try to sign up for our offer](#aadsts50194-application-is-not-configured-as-a-multi-tenant-application-when-they-try-to-sign-up-for-our-offer)
- [Login Failure interaction required...The signed-in user is not assigned a role for the application](#login-failure-interaction-requiredthe-signed-in-user-is-not-assigned-a-role-for-the-application)
- [Microsoft.Identity.Client.MsalServiceException: AADSTS500014: Resource 'a0e1e353-1a3e-42cfa8ea-3a9746eec58c' is disabled’](#microsoftidentityclientmsalserviceexception-aadsts500014-resource-a0e1e353-1a3e-42cfa8ea-3a9746eec58c-is-disabled)
- [The need admin approval dialog box appears](#the-need-admin-approval-dialog-box-appears)
- [Selected user account does not exist in tenant](#selected-user-account-does-not-exist-in-tenant)
- [Something went wrong while deploying the SaaS resource. Details: ‘User has no permissions on the chosen subscription. Thus, the purchase has failed’](#something-went-wrong-while-deploying-the-saas-resource-details-user-has-no-permissions-on-the-chosen-subscription-thus-the-purchase-has-failed)

## AADSTS50011: The reply URL specified in the request does not match the reply URLs configured for the application

**Issue**: A buyer sees the “AADSTS50011: The reply URL specified in the request does not match the reply URLs configured for the application” message.

**Problem**: The App Registration Redirect URI does not match the reply URL that is being sent by your code.

**Solution**: Determine the proper URL that the newly authenticated user should be directed to. Then, check the redirect URI values in the Azure AD app registration and the reply URL that your code uses. Ensure that both of them are set to the same value.

## AADSTS50194: Application is not configured as a multi-tenant application when they try to sign up for our offer

**Issue**: A user sees the “AADSTS50194: Application is not configured as a multi-tenant application when they try to sign up for our offer” message.

**Problem**: The Azure AD app registration that hosts your landing page is configured as single-tenant and will only allow users from your directory through.

**Solution**: In the Azure portal, do the following:

1. Go to the Azure Active Directory page.
2. Select the **App Registration** blade.
3. Find and select your application in the list.
4. On the **Details** page for your application, select the **Authentication** blade.
5. Under **Supported account types**, select **Accounts in any organizational directory**.
6. Select **Save**.

## Login Failure interaction required...The signed-in user is not assigned a role for the application

**Issue**: A user sees the “Login Failure interaction required...The signed-in user is not assigned a role for the application” message.

**Problem**: The Enterprise Applications record for this app is configured to require **User Assignment**, and the user has not been explicitly assigned a role.

**Solution**: Double-check that this is how the enterprise app should be configured. Depending on the expected behavior, do one of the following:

If this is not the expected behavior:

1. Go to the Azure Active Directory management page.
2. Select the **Enterprise Applications** blade.
3. In the search box, enter the name of the app.
5. Select the **Properties** blade.
6. Change the value of **User Assignment Required** to **No**.
7. Select **Save**.

If this is the expected behavior, the user’s Azure AD account needs to be added to the list of assigned users:

1. Go to the Azure Active Directory management page.
2. Select the **Enterprise Applications** blade.
3. In the search box, enter the name of the app.
4. Select the app.
5. Select the **Users and Groups** blade.
6. Select **Add User**.
7. Choose the user to be added.
8. Choose the role to be granted.
9. Select **Assign**.

## Microsoft.Identity.Client.MsalServiceException: AADSTS500014: Resource 'a0e1e353-1a3e-42cfa8ea-3a9746eec58c' is disabled

**Issue**: While browsing the commercial marketplace, a buyer sees the “Microsoft.Identity.Client.MsalServiceException: AADSTS500014: Resource 'a0e1e353-1a3e-42cfa8ea-3a9746eec58c' is disabled” message.

**Problem**: This message indicates that the user’s home Azure AD tenant has the Microsoft AppSource enterprise application disabled.

**Solution**: An administrator of the user’s Azure AD tenant needs to enable AppSource in the Azure portal:

1. Go to the Azure Active Directory page.
2. Select the **Enterprise Applications** blade.
3. In the **Application Type** menu, select **All Applications**.
4. In the search field, enter _Microsoft AppSource_, and then select **Apply**.
5. Select **Microsoft AppSource**.
6. When the page refreshes to the Microsoft AppSource configuration page, select the **Properties** blade.
7. For the **Enabled for users to sign in?** setting, change the option to **Yes**.
8. Select **Save**.

## The need admin approval dialog box appears

**Issue**: A buyers sees the “Need admin approval” dialog box when they try to sign up for your offer.

**Problem**: Your landing page is part of an Azure AD app registration that has been configured to request permissions that only an administrator can consent to.

**Solution**: Change the permissions required by the app registration that hosts the landing page. It’s always a good practice to place your landing page in its own app registration, configured to request the minimal possible permissions (often **User.Read** and **User.ReadBasic.All**) to facilitate the onboarding process.

## Selected user account does not exist in tenant

**Issue**: A customer sees the “Selected user account does not exist in tenant [tenantName] and cannot access the application [applicationID] in the tenant. The account needs to be added as an external user in the tenant first. Please use a different account.” error message.

**Problem**: All SaaS offers from a single publisher must use the same Tenant ID/Application ID pair for their landing pages. This is a limitation of the marketplace APIs. In effect, this means that you should have only one landing page even if you have multiple offers.

**Solution**: Consolidate the behavior of multiple landing pages into a single app, and use the marketplace API /resolve endpoint to retrieve the specifics about a purchased offer and tailor the experience appropriately.

## Something went wrong while deploying the SaaS resource. Details: ‘User has no permissions on the chosen subscription. Thus, the purchase has failed’

**Issue**: While trying to purchase the offer in the Marketplace, a buyer sees the “Something went wrong while deploying the SaaS resource. Details: ‘User has no permissions on the chosen subscription. Thus, the purchase has failed’” message.

**Problem**: The buyer does not have permissions in their own Azure AD tenant to make a purchase from the commercial marketplace.

**Solution**: An administrator of the buyer’s Azure AD tenant needs to update permissions in the Azure portal.
