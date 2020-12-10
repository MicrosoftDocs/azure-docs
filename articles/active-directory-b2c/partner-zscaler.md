---
title: Tutorial to configure Azure Active Directory B2C with Zscaler 
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with Zscaler
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 12/09/2020
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial to configure Zscaler Private Access with Azure Active Directory B2C for secure hybrid access

In this tutorial, learn how to integrate Azure Active Directory (AD) B2C authentication with [Zscaler Private Access (ZPA)](https://www.zscaler.com/products/zscaler-private-access). ZPA delivers policy-based, secure access to private applications and assets without the cost, hassle, or security risks of a Virtual Private Network (VPN). Zscaler’s secure hybrid access offering enables a zero-attack surface for consumer-facing applications when combined with Azure AD B2C.

## Prerequisites

To get started, you’ll need:

- An Azure subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- [An Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant) that is linked to your Azure subscription.

- [ZPA subscription](https://azuremarketplace.microsoft.com/marketplace/apps/aad.zscalerprivateaccess?tab=Overview)

## Scenario description

The ZPA integration includes the following components:

- Azure AD B2C - The identity provider (IdP) responsible for verifying the user’s credentials. It's also responsible for signing up a new user.

- ZPA - The service responsible for securing the web application by enforcing [zero-trust access](https://www.microsoft.com/security/blog/2018/12/17/zero-trust-part-1-identity-and-access-management/#:~:text=Azure%20Active%20Directory%20%28Azure%20AD%29%20provides%20the%20strong%2C,to%20express%20their%20access%20requirements%20in%20simple%20terms.).

- Web application - Hosts the service that the user is trying to access.

The following diagram shows how ZPA integrates with Azure AD B2C.

![Image shows the zscaler architecture diagram](media/partner-zscaler/zscaler-architecture-diagram.png)

|Step | Description |
|:-----| :-----------|
| 1. | User arrives at a ZPA User Portal or a ZPA Browser Access application.
| 2. | ZPA requires the user context information before it can decide whether to allow the user to access the web application. To authenticate the user, ZPA performs a SAML redirect to the Azure AD B2C login page.  
| 3. | User arrives at the Azure AB B2C login page. If it's a new user, the user signs up to create a new account. An existing user would sign in using their existing credentials. Azure AD B2C validates the identity of the user.
| 4. | Upon successful authentication, Azure AD B2C redirects the user back to ZPA along with the SAML assertion. ZPA verifies the SAML assertion and sets the user context.
| 5. | ZPA evaluates the access policies for the user. If the user is allowed to access the web application, then the connection is allowed to pass through.

## Onboard to ZPA

This tutorial assumes that you already have a working setup of ZPA. If you're getting started with ZPA, refer to [step-by-step configuration guide for ZPA](https://help.zscaler.com/zpa/step-step-configuration-guide-zpa).

## Integrate with Azure AD B2C

### Part 1 - Configure Azure AD B2C as an IdP on ZPA

To configure Azure AD B2C as an [IdP on ZPA](https://help.zscaler.com/zpa/configuring-idp-single-sign):

1. Log into the [ZPA Admin Portal](https://admin.private.zscaler.com)

2. Go to **Administration** > **IdP Configuration**

3. Select **Add IdP Configuration**

4. For **1 IdP Information**, enter the following:

   a. **Name**: Azure AD B2C

   b. **Single Sign-On**: Select User

   c. **Domains**: Choose the authentication domains that you want to   associate to this IdP, and then select **Done**

   ![Image shows the idp information](media/partner-zscaler/add-ipd-configuration.png)

5. Select **Next**

6. For **2 SP Metadata**:

   a. Copy the Service Provider URL and note it for later use.

   b. Copy the Service Provider Entity ID and note it for later use.

   ![Image shows the sp metadata information](media/partner-zscaler/sp-metadata.png)

7. Select **Pause**

The rest of the IdP configuration will resume after configuring Azure AD B2C.

### Part 2 - Configure custom policy in Azure AD B2C

>[!Note]
>This step is required only if you don’t already have custom policies. If you already have one or more custom policies, you can skip this step.

The article [get started with custom policies in Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started) provides instructions on how to configure custom policies on your Azure AD B2C tenant.

### Part 3 - Register ZPA as a SAML application in Azure AD B2C

The article [register a SAML application in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/connect-with-saml-service-providers) provides instructions on how to configure a SAML application in Azure AD B2C. In [step 3.2](https://docs.microsoft.com/azure/active-directory-b2c/connect-with-saml-service-providers#32-upload-and-test-your-policy-metadata), you'll be provided with the IdP SAML Metadata URL used by Azure AD B2C. You'll need this for later use.

Follow the instructions there through [step 4.2](https://docs.microsoft.com/azure/active-directory-b2c/connect-with-saml-service-providers#42-update-the-app-manifest). In step 4.2 of the instruction, you're required to update the app manifest. Update the properties as follows:

1. **identifierUris**: Use the Service Provider Entity ID noted in **Part 1, Step 6a**.

2. **samlMetadataUrl**: Skip this property as ZPA doesn't host a SAML metadata URL.

3. **replyUrlsWithType**: Use the Service Provider URL noted in **Part 1, Step 6b**.

4. **logoutUrl**: Skip this property as ZPA doesn't support a logout URL.

>[!NOTE]The rest of the steps are not relevant to this tutorial.

### Part 4 - Extract the IdP SAML metadata from Azure AD B2C

From the previous step, you need to obtain a SAML metadata URL in the following format:

```https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/<policy-name>/Samlp/metadata```

where `<tenant-name>` is the name of your Azure AD B2C tenant and `<policy-name>` is the name of the custom SAML policy you created in the last step.

For example, https://safemarch.b2clogin.com/safemarch.onmicrosoft.com/B2C_1A_signup_signin_saml//Samlp/metadata

Open a web browser and navigate to the SAML Metadata URL. When the page loads, right-click anywhere on the page. Select **Save Page As** and save the file on your computer; you'll use this in the next part.

### Part 5 - Complete IdP configuration on ZPA

Complete the [IdP configuration in the ZPA Admin Portal](https://help.zscaler.com/zpa/configuring-idp-single-sign) that was partially configured in Part 1:

1. Log into the [ZPA Admin Portal](https://admin.private.zscaler.com)

2. Go to **Administration** > **IdP Configuration**.

3. Select the IdP that was configured in Part 1 and select **Resume**. 

4. For **3 Create IdP**

   a. Go to **IdP Metadata File** > **Select File** and upload the metadata file that you saved in Part 4.

   b. Verify the **Status** for the IdP configuration is **Enabled**.

   c. Select **Save**.

      ![Image shows the create-idp information](media/partner-zscaler/create-idp.png)

## Test the solution

Go to a ZPA User Portal or a Browser Access application and test the sign-up or sign-in process. It should result in a successful SAML authentication.

## Next steps

For additional information, review the following articles:

- [Get started with custom policies in Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started)

- [Register a SAML application in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/connect-with-saml-service-providers)

- [Step-by-Step Configuration Guide for ZPA](https://help.zscaler.com/zpa/step-step-configuration-guide-zpa)

- [Configuring an IdP for Single Sign-On](https://help.zscaler.com/zpa/configuring-idp-single-sign)
