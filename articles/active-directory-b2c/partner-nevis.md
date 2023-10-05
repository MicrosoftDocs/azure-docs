---
title: Tutorial to configure Azure Active Directory B2C with Nevis
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with Nevis for passwordless authentication 
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.reviewer: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 12/8/2022
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial to configure Nevis with Azure Active Directory B2C for passwordless authentication

In this tutorial, learn to enable passwordless authentication in Azure Active Directory B2C (Azure AD B2C) with the [Nevis](https://www.nevis.net/en/solution/authentication-cloud) Access app to enable customer authentication and comply with Payment Services Directive 2 (PSD2) transaction requirements. PSD2 is a European Union (EU) directive, administered by the European Commission (Directorate General Internal Market) to regulate payment services and payment service providers throughout the EU and European Economic Area (EEA). 

## Prerequisites

To get started, you'll need:

- A Nevis demo account
  - Go to nevis.net for [Nevis + Microsoft Azure AD B2C](https://www.nevis-security.com/aadb2c/) to request an account
* An Azure subscription

  - If you don't have one, you can get an [Azure free account](https://azure.microsoft.com/free/)
- An [Azure AD B2C tenant](./tutorial-create-tenant.md) linked to your Azure subscription

>[!NOTE]
>To integrate Nevis into your sign-up policy flow, configure the Azure AD B2C environment to use custom policies. </br>See, [Tutorial: Create user flows and custom policies in Azure Active Directory B2C](./tutorial-create-user-flows.md).

## Scenario description

Add the branded Access app to your back-end application for passwordless authentication. The following components make up the solution:

- **Azure AD B2C tenant** with a combined sign-in and sign-up policy for your back end
- **Nevis instance** and its REST API to enhance Azure AD B2C
- Your branded **Access** app

The diagram shows the implementation.

   ![Diagram that shows high-level password sign-in flow with Azure AD B2C and Nevis.](./media/partner-nevis/nevis-architecture-diagram.png)

1. A user attempts sign-in or sign-up to an application with Azure AD B2C policy.
2. During sign-up, the Access is registered to the user device using a QR code. A private key is generated on the user device and is used to sign user requests.
3. Azure AD B2C uses a RESTful technical profile to start sign-in with the Nevis solution.
4. The sign-in request goes to Access, as a push message, QR code, or a deep-link.
5. The user approves the sign-in attempt with their biometrics. A message goes to Nevis, which verifies sign-in with the stored public key.
6. Azure AD B2C sends a request to Nevis to confirm sign-in is complete.
7. The user is granted, or denied, access to the application with an Azure AD B2C success, or failure, message.

## Integrate your Azure AD B2C tenant

### Request a Nevis account 

1. Go to nevis.net for [Nevis + Microsoft Azure AD B2C](https://www.nevis-security.com/aadb2c/). 
2. Use the form request an account.
3. Two emails arrive:

*  Management account notification
*  Mobile app invitation

### Add your Azure AD B2C tenant to your Nevis account

1. From the management account trial email, copy your management key.
2. In a browser, open https://console.nevis.cloud/.
3. Use the management key to sign in to the management console.
4. Select **Add Instance**.
5. Select the created instance.
6. In the side navigation, select **Custom Integrations**.
7. Select **Add custom integration**.
8. For **Integration Name**, enter your Azure AD B2C tenant name.
9. For **URL/Domain**, enter `https://yourtenant.onmicrosoft.com`.
10. Select **Next**
11. Select **Done**.

>[!NOTE]
>You'll need the Nevis access token later.

### Install Nevis Access on your phone

1. From the Nevis mobile app invitation email, open the **Test Flight app** invitation.
2. Install the app.

### Integrate Azure AD B2C with Nevis

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Switch to your Azure AD B2C tenant. Note: the Azure AD B2C tenant usually is in a separate tenant.
3. In the menu, select **Identity Experience Framework (IEF)**.
4. Select **Policy Keys**.
5. Select **Add**.
6. Create a new key.
7. For **Options**, select **Manual**.
8. For **Name**, select **AuthCloudAccessToken**.
9. For **Secret**, paste the stored **Nevis Access Token**.
10. For **Key Usage**, select **Encryption**.
11. Select **Create**.

### Configure and upload the nevis.html to Azure blob storage

1. In your Identity Environment (IDE), go to the [/master/samples/Nevis/policy](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Nevis/policy) folder.
2. In [/samples/Nevis/policy/nevis.html](https://github.com/azure-ad-b2c/partner-integrations/blob/master/samples/Nevis/policy/nevis.html) open the nevis.html file.
3. Replace the  **authentication_cloud_url** with the Nevis Admin console URL `https://<instance_id>.mauth.nevis.cloud`.
4. Select **Save**.
5. [Create an Azure Blob storage account](./customize-ui-with-html.md#2-create-an-azure-blob-storage-account).
6. Upload the nevis.html file to your Azure blob storage.
7. [Configure CORS](./customize-ui-with-html.md#3-configure-cors).
8. Enable cross-origin resource sharing (CORS) for the file.
9. In the list, select the **nevis.html** file.
10. In the **Overview** tab, next to the **URL**, select the **copy link** icon.
11. Open the link in a new browser tab to confirm a grey box appears.

>[!NOTE]
>You'll need the blob link later.

### Customize TrustFrameworkBase.xml

1. In your IDE, go to the [/samples/Nevis/policy](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Nevis/policy) folder.
2. Open [TrustFrameworkBase.xml](https://github.com/azure-ad-b2c/partner-integrations/blob/master/samples/Nevis/policy/TrustFrameworkBase.xml).
3. Replace **your tenant** with your Azure tenant account name in **TenantId**.
4. Replace **your tenant** with your Azure tenant account name in **PublicPolicyURI**.
5. Replace all **authentication_cloud_url** instances with the Nevis Admin console URL.
6. Select **Save**.

### Customize TrustFrameworkExtensions.xml

1. In your IDE, go to the [/samples/Nevis/policy](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Nevis/policy) folder.
2. Open [TrustFrameworkExtensions.xml](https://github.com/azure-ad-b2c/partner-integrations/blob/master/samples/Nevis/policy/TrustFrameworkExtensions.xml).
3. Replace **your tenant** with your Azure tenant account name in **TenantId**.
4. Replace **your tenant** with your Azure tenant account name in **PublicPolicyURI**.
5. Under **BasePolicy**, in the **TenantId**, replace **your tenant** with your Azure tenant account name.
6. Under **BuildingBlocks**, replace **LoadUri** with the nevis.html blob link URL, in your blob storage account.
7. Select **Save**.

### Customize SignUpOrSignin.xml

1. In your IDE, go to the [/samples/Nevis/policy](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Nevis/policy) folder.
2. Open the [SignUpOrSignin.xml](https://github.com/azure-ad-b2c/partner-integrations/blob/master/samples/Nevis/policy/SignUpOrSignin.xml) file.
3. Replace **your tenant** with your Azure tenant account name in **TenantId**.
4. Replace **your tenant** with your Azure tenant account name in **PublicPolicyUri**.
5. Under **BasePolicy**, in **TenantId**, replace **your tenant** with your Azure tenant account name.
6. Select **Save**.

### Upload custom policies to Azure AD B2C

1. In the Azure portal, open your [Azure AD B2C tenant](https://portal.azure.com/#blade/Microsoft_AAD_B2CAdmin/TenantManagementMenuBlade/overview).
2. Select **Identity Experience Framework**.
3. Select **Upload custom policy**.
4. Select the **TrustFrameworkBase.xml** file you modified.
5. Select the **Overwrite the custom policy if it already exists** checkbox.
6. Select **Upload**.
7. Repeat step 5 and 6 for **TrustFrameworkExtensions.xml**.
8. Repeat step 5 and 6 for **SignUpOrSignin.xml**.

## Test the user flow

### Test account creation and Access setup

1. In the Azure portal, open your [Azure AD B2C tenant](https://portal.azure.com/#blade/Microsoft_AAD_B2CAdmin/TenantManagementMenuBlade/overview).
2. Select **Identity Experience Framework**.
3. Scroll down to **Custom policies** and select **B2C_1A_signup_signin**.
4. Select **Run now**.
5. In the window, select **Sign up now**.
6. Add your email address.
7. Select **Send verification code**.
8. Copy the verification code from the email.
9. Select **Verify**.
10. Fill in the form with your new password and display name.
11. Select **Create**.
12. The QR code scan page appears.
13. On your phone, open the **Nevis Access app**.
14. Select **Face ID**.
15. The **Authenticator registration was successful** screen appears.
16. Select **Continue**.
17. On your phone, authenticate with your face.
18. The [jwt.ms welcome](https://jwt.ms) page appears with your decoded token details.

### Test passwordless sign-in

1. Under **Identity Experience Framework**, select the **B2C_1A_signup_signin**.
2. Select **Run now**.
3. In the window, select **Passwordless Authentication**.
4. Enter your email address.
5. Select **Continue**.
6. On your phone, in Notifications, select **Nevis Access app notification**.
7. Authenticate with your face.
8. The [jwt.ms welcome](https://jwt.ms) page appears with your tokens.

## Next steps

- [Custom policies in Azure AD B2C](./custom-policy-overview.md)
- [Get started with custom policies in Azure AD B2C](tutorial-create-user-flows.md?pivots=b2c-custom-policy)
