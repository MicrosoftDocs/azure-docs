---
title: 'Azure Active Directory B2C: Custom Policies | Microsoft Docs'
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

This article introduces configuration of the Identity Experience Engine at the heart of the Azure AD B2C service through the use of custom policies.

After completing the steps in this article, you will have a working custom policy that allows an end user to signup and signin using a "Local Account".  Local Accounts are created by end users by using an existing email and creating a new password for use with your services.  Completion of these steps is required before all other uses of the Azure AD B2C’s Identity Experience Engine and many essential concepts are introduced.

> [!NOTE]
> Direct configuration of the Identity Experience Engine through custom policies is designed primarily for identity pros who are addressing complex scenarios.  Azure AD B2C’s built-in user journeys are recommended for most scenarios and provide easier configuration. The two configuration approaches (i.e. built-in and custom) can co-exist successfully.
>

## Prerequisites
1. An Azure AD B2C tenant has been created.  A Azure AD B2C tenant is a container for all your users, apps, groups, and more. If you don't have one already, [create an Azure AD B2C tenant](active-directory-b2c-get-started.md).

2. Download the "Azure AD B2C Custom Policy Starter Pack" from GitHub.  [Download the zip](https://github.com/Azure-Samples/active-directory-b2c-advanced-policies/archive/master.zip). or use `git clone https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack`.

## Confirming your B2C tenant

Because custom policies is still in priviate preview, confirm that your B2C tenant is enabled for custom policy upload:

1.  In the [Azure Portal](https://portal.azure.com), switch into the context of your Azure AD B2C tenant and open the Azure AD B2C blade. [Show me how.](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade)

2.  Click **All Policies**.

3.  Make sure **Upload Policy** is available.  If it is greyed out, please engage with your Azure AD B2C contact.

## Setup keys for your Custom Policy

The first step required for any custom policy is to setup keys.

[!INCLUDE [active-directory-b2c-setup-keys-custom.md](../../includes/active-directory-b2c-setup-keys-custom.md)]

## Download Starter Pack and modify policies

Inside the Starterpack you will find:
* The base file of the policy.  Very few modifications will be required to the base. 
* The extension file of the policy.  This is where we will make the majority of the changes to configure your policy.

The first step:
1.	Open the  Starterpack that you downloaded in the prerequisites.
    Find the "SocialIDPAndLocalAccounts" folder.  The base of this policy contains content needed for Local Accounts but also has content that will be used later when adding Social.  The Social content will not interfere with the steps for getting Local Accounts up and running.
2.	Open TrustFrameworkBase.xml.  If you need an XML editor, try [Download Visual Studio Code](https://code.visualstudio.com/download), a lightweight cross platform editor.
3.	In the root TrustFrameWorkPolicy element, update the TenantId and PublicPolicyUri attributes to reflect your tenant:
```
<TrustFrameworkPolicy
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06"
  PolicySchemaVersion="0.3.0.0"
  TenantId="yourtenant.onmicrosoft.com"
  PolicyId="B2C_1A_TrustFrameworkBase"
  PublicPolicyUri="http://lamnahealth.onmicrosoft.com">
```
4.  Save and rename the file to reflect your tenantname for example: yourtenant.onmicrosoft.com_Base.xml
5.  Do the same step 3 and step 4 for TrustFrameworkExtensions.xml and SignupOrSignin.xml 

>[!NOTE]
> If your XML editor supports validation, you may want to load the *TrustFrameworkPolicy\_0.3.0.0.xsd* XML schema file that is located **TBD**, this can help you catch errors quickly before uploading.

## Register Policy Engine Applications

Azure AD B2C requires you to register two extra applications that are used by the engine to sign up and sign in users.

1. Open a new powershell command prompt.  One method is WindowsKey-R, type "powershell", and hit enter.

2. Switch into the folder with the ExploreAdmin tool.

```powershell
cd active-directory-b2c-advanced-policies\ExploreAdmin
```

3. Run the powershell script for registering the 

```powershell
./New-AzureADB2CPolicyEngineApplications.ps1 -BasePolicyPath <Path of yourtenant.onmicrosoft.com_Base.xml>
```

> [!NOTE]
> This script will create two applications which allow the Identity Experience Engine to interact with the local identity provider.  These two apps need to be created in a specific way.
> a. PolicyEngine (a web app)
> b. PolicyEngineProxy (a native app) with delegated permission from PolicyEngine app
> [Learn More](active-directory-b2c-overview-custom.md)

## Upload the policies to your tenant
1.	In the [Azure Portal](https://portal.azure.com), switch into the context of your Azure AD B2C tenant and open the Azure AD B2C blade. [Show me how.](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade)

2. Navigate to **Identity Experience Engine** and select **Custom policies**

3.	Select **+Add**, and first upload **yourtenant.onmicrosoft.com_Base.xml** 

4.	Next, upload the Extensions file

5.  Upload the SignUpOrSignin file last

> [!NOTE]
> The base file of the policy must be uploaded first, then the extensions file of the policy (as it depends on base), and then the other policies in any order. The base file, the extensions file and the other files part of a hierarchy.  The application calls the task-specific extension policy file such as SignUpOrSignin.  Create as many task-specific files as needed for your applications.  The extension file refers to the base file which we recommend should have minimal changes.  [Read here for more details about the policy elements and the inheritance model](active-directory-b2c-get-started-custom.md)
>

> [!NOTE]
>  When a custom policy is uploaded, the name is prepended with B2C_1A_.  This is differeant than Built-in policies which start with with B2C_1_.

## Test the custom policy using "Run Now"

1. Open the **Azure AD B2C Blade** and navigate to **All polices**

2. Select the cutom policy that you uploaded, and click the **Run now** button.

3. You should be able to sign up using an email address.


## Next steps

The base file that we used in this getting started guide already contains some of the content that you will need for adding a social identity provider.  To setup up sign up and sign in using Facebook, [continue here](active-directory-b2c-setup-fb-app-custom.md).

**This concludes this “Getting Started” guide.**
