---
title: 'Tutorial: Azure Active Directory integration with UnityID | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and UnityID.
services: active-directory
author: wimcilha
manager: momar
ms.reviewer: 
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 09/21/2021
ms.author: wimcilha
---
# Tutorial: Azure Active Directory integration with UnityID

In this tutorial, you learn how to integrate UnityID with Azure Active Directory (Azure AD).
Integrating UnityID with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to UnityID.
* You can enable your users to be automatically signed-in to UnityID (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with UnityID, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* UnityID supports **SAML 2.0** initiated SSO
* Corporate users are forced to use their corp account to log in Unity
* Whitelisting Corporate users to allow them to use a legacy username/password login
* If you need to whitelist users, please contact your Unity representative.
* Grace period to make Federation SSO login a mandate
   
   - a. Set a specific future date from when Federation SSO login is mandatory for All users (except whitelisted users). But during this grace period time, users can choose to log in using both legacy login and federation SSO login
   - b. Contact your Unity representative if you need to set a grace period.

* Delete inactive corp users, for example, when a user leaves the company, the admin of the company can trigger a API request to delete this user
* Seat management for users, such as seat assignment and revocation.

   - a. When a user no longer need to use Unity, the admin of the company can decide to revoke the seat assigned to this user.
   - b. When a new user joins and needs to use Unity, the admin of the company can assign an available seat to this new user.

The things that you need to provide to unity:

1) The meta file generated in your side; (eg, the unity IT generated meta file)
2) The logo that the company wants to show to their users; (eg, the unity logo)
3) The impacted domains and enforce date (eg, unity3d.com, enforce at 2020-11-15)

## Adding UnityID manually

To configure the integration of UnityID into Azure AD, you need to manually add UnityID as a SaaS application.

**To add UnityID manually, perform the following steps:**

1. Click on Create your own application
2. Enter a name for your application such as **UnityID**
3. Select Integrate any other application you don't find in the gallery and click Create
4. Click Single sign-on and select SAML
5. For Basic SAML Configuration, click edit and enter the following information

    - Identifier (Entity ID): **https://api.unity.com**
    - Reply URL (Assertion Consumer Service URL): **https://api.unity.com/v1/oauth2/saml/sso**
    
7. For User Attributes & Claims Configuration, click edit and enter the following information

    - givenname: **user.givenname**
    - surname: **user.surname**
    - emailaddress: **user.mail**
    - name: **user.userprincipalname**
    - Unique User Identifier: **user.userprincipalname**

8. Get your Azure meta information and send to Unity, including these 4 fields, and send these to your Unity Representative

    - App Federation Metadata URL
    - Certificate (Raw)
    - Federation Metadata XML
    - Login URL

### Test single sign-on 

**Once Unity has enabled and enforced your SSO, you can proceed with the below test**

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the UnityID tile in the Access Panel, you should be automatically signed in to the UnityID for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](./tutorial-list.md)

- [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Azure Active Directory?](../conditional-access/overview.md)
