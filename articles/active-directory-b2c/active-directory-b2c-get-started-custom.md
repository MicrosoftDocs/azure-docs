---
title: 'Azure Active Directory B2C: Get Started With Custom Policies | Microsoft Docs'
description: A topic on how to get started with Azure Active Directory B2C custom policies
services: active-directory-b2c
documentationcenter: ''
author: gsacavdm
manager: krassk
editor: parakhj

ms.assetid: 658c597e-3787-465e-b377-26aebc94e46d
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 04/04/2017
ms.author: gsacavdm
---
# Azure Active Directory B2C: Getting started with custom policies

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

After completing the steps in this article, your custom policy will support "local account" sign-up or sign-in using an email and password. You will also prepare your environment for adding additional identity providers (like Facebook or Azure AD).  Completion of these steps is required before all other uses of the Azure AD B2C’s Identity Experience Engine and many essential concepts are introduced.

## Prerequisites

Before proceeding, ensure that you have an Azure AD B2C tenant. An Azure AD B2C tenant is a container for all your users, apps, policies, and more. If you don't have one already, you need to [create one](active-directory-b2c-get-started.md).

### Confirming your B2C tenant

Because custom policies are still in private preview, confirm that your Azure AD B2C tenant is enabled for custom policy upload:

1. In the [Azure portal](https://portal.azure.com), [switch into the context of your Azure AD B2C tenant](active-directory-b2c-navigate-to-b2c-context.md) and open the Azure AD B2C blade.
1. Click **All Policies**.
1. Make sure **Upload Policy** is available.  If the button is disabled, email AADB2CPreview@microsoft.com.

## Set up keys for your custom policy

The first step required to use custom policies is to set up keys.

[!INCLUDE [active-directory-b2c-setup-keys-custom.md](../../includes/active-directory-b2c-setup-keys-custom.md)]

## Download starter pack and modify policies

Custom policies are a set of XML files that need to be uploaded to your Azure AD B2C tenant. We provide a starter pack that you can use to get started. The starter pack contains:

* The [base file](active-directory-b2c-overview-custom.md#policy-files) of the policy. Few modifications are required to the base.
* The [extension file](active-directory-b2c-overview-custom.md#policy-files) of the policy.  This file is where most configuration changes are made.

Let's get started:

1. Download the "Azure AD B2C Custom Policy Starter Pack" from GitHub.  [Download the zip](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/archive/master.zip) or run

    ```console
    git clone https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack
    ```

1. Open the `SocialIDPAndLocalAccounts` folder.  The base file (`TrustFrameworkBase.xml`) in this folder contains content needed for both local and social/corporate accounts. The social content does not interfere with the steps for getting local accounts up and running.
1. Open `TrustFrameworkBase.xml`.  If you need an XML editor, try [Download Visual Studio Code](https://code.visualstudio.com/download), a lightweight cross platform editor.
1. In the root `TrustFrameworkPolicy` element, update the `TenantId` and `PublicPolicyUri` attributes, replacing `{tenantName}` with your Azure AD B2C tenant:

    ```xml
    <TrustFrameworkPolicy
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06"
    PolicySchemaVersion="0.3.0.0"
    TenantId="{tenantName}.onmicrosoft.com"
    PolicyId="B2C_1A_TrustFrameworkBase"
    PublicPolicyUri="http://{tenantName}.onmicrosoft.com">
    ```

1. Save the file.
1. Open `TrustFrameworkExtensions.xml` and make the same changes by replacing `{tenantName}` with your Azure AD B2C tenant. Save the file.
1. Open `SignUpOrSignIn.xml`and make the same changes by replacing `{tenantName}` with your Azure AD B2C tenant. Save the file.

>[!NOTE]
>If your XML editor supports validation, you may want to validate the files against the `TrustFrameworkPolicy_0.3.0.0.xsd` XML schema file that is located in the root folder of the starter pack. XML schema validation identifies errors before uploading.

## Register Policy Engine Applications

Azure AD B2C requires you to register two extra applications that are used by the engine to sign-up and sign-in users.

>[!NOTE]
>Below, we create two applications that enable sign-in using local accounts: PolicyEngine (a web app) and PolicyEngineProxy (a native app) with delegated permission from PolicyEngine. This section is only required for Azure AD B2C tenants where use of local accounts is expected.

### Create the policy engine application

1. In the [Azure portal](https://portal.azure.com), [switch into the context of your Azure AD B2C tenant](active-directory-b2c-navigate-to-b2c-context.md).
1. Open the `Azure Active Directory` blade (not the Azure AD B2C blade). You may need to click **> More Services** to find it.
1. Select **App registrations**.
1. Click **+ New application registration**.
   * Name: `PolicyEngine`
   * Application type: `Web app/API`
   * Sign-on URL: `https://login.microsoftonline.com/{tenantName}.onmicrosoft.com` where `{tenantName}` is your Azure AD B2C tenant.
1. Click **Create**.
1. Once created, select the newly created application `PolicyEngine` and copy the Application ID and save it for later.

### Create the policy engine proxy application

1. Select **App registrations**.
1. Click **+ New application registration**.
   * Name: `PolicyEngineProxy`
   * Application type: `Native`
   * Sign-on URL: `https://login.microsoftonline.com/{tenantName}.onmicrosoft.com` where `{tenantName}` is your Azure AD B2C tenant.
1. Click **Create**.
1. Once created, select the application `PolicyEngineProxy` and copy the Application ID and save it for later.
1. Select **Required permissions**, then select **+ Add**, and then **Select an API**.
1. Search for the name `PolicyEngine`, select PolicyEngine in the results, and then click **Select**.
1. Check the checkbox next to `Access PolicyEngine` and then click **Select**.
1. Click **Done**.

### Add the application IDs to your custom policy

To create a custom policy with local accounts enabled, you need to add the application IDs to the extensions file (`TrustFrameworkExtensions.xml`).

1. In the extensions file (`TrustFrameworkExtensions.xml`), find the element `<TechnicalProfile Id="login-NonInteractive">`.
1. Replace both instances of `{Policy Engine Proxy Application ID}` with the application ID of the [policy engine proxy application that you created](#create-the-policy-engine-proxy-application).
1. Replace both instances of `{Policy Engine Application ID}` with the application ID of the [policy engine application that you created](#create-the-policy-engine-application).
1. Save your extensions file.

## Upload the policies to your tenant

1. In the [Azure portal](https://portal.azure.com), [switch into the context of your Azure AD B2C tenant](active-directory-b2c-navigate-to-b2c-context.md) and open the Azure AD B2C blade.
1. Click **All Policies**.
1. Select **Upload Policy**

    >[!WARNING]
    >The custom policy files must be uploaded in the following order:

1. Upload `TrustFrameworkBase.xml`.
1. Upload `TrustFrameworkExtensions.xml`.
1. Upload `SignUpOrSignin.xml`.

When a file is uploaded, the name is prepended with `B2C_1A_`.  Built-in policies start with `B2C_1_` instead.

## Test the custom policy using "Run Now"

1. Open the **Azure AD B2C Blade** and navigate to **All polices**.
1. Select the custom policy that you uploaded, and click the **Run now** button.
1. You should be able to sign-up using an email address.

## Next steps

The base file that we used in this getting started guide already contains some of the content that you need for adding other identity providers. To set up login using Azure AD accounts, [continue here](active-directory-b2c-setup-aad-custom.md).

## Reference

* A **Technical Profile (TP)** is an element that defines an endpoint’s name, its metadata, its protocol, and details the exchange of claims that the Identity Experience Engine should perform.  The Local Account SignIn is the TechnicalProfile used by the Identity Experience Engine to perform a local account login.
