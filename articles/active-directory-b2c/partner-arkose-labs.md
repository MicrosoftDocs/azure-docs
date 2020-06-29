---
title: Arkose Labs with Azure Active Directory B2C
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with Arkose Labs to help protect against bot attacks, account takeover attacks, and fraudulent account openings.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 06/08/2020
ms.author: mimart
ms.subservice: B2C
---

# Tutorial for configuring Arkose Labs with Azure Active Directory B2C

In this tutorial, learn how to integrate Azure AD B2C authentication with Arkose Labs. Arkose Labs help organizations against bot attacks, account takeover attacks, and fraudulent account openings.  

## Prerequisites

To get started, you'll need:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* [An Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

## Scenario description

The following diagram describes how Arkose Labs integrates with Azure AD B2C.

![Arkose Labs architecture diagram](media/partner-arkose-labs/arkose-architecture-diagram.png)

|   |   |
|---|---|
|1     | A user signs in with a previously created account. When the user selects submit, an Arkose Labs Enforcement challenge appears. After the user completes the challenge, the status is sent to Arkose Labs to generate a token.        |
|2     |  Arkose Labs sends the token back to Azure AD B2C.       |
|3     |  Before the sign-in form is submitted, the token is sent to Arkose Labs for verification.       |
|4     |  Arkose sends back a success or failure result from the challenge.       |
|5     |  If the challenge is successfully completed, a sign-in form is submitted to Azure AD B2C, and Azure AD B2C completes the authentication.       |
|   |   |

## Onboard with Arkose Labs

1. Start by contacting [Arkose Labs](https://www.arkoselabs.com/book-a-demo/) and creating an account.

2. Once your account is created, navigate to https://dashboard.arkoselabs.com/login.

3. Within the dashboard, navigate to site settings to find your public key and private key. This information will be needed later to configure Azure AD B2C.

## Integrate with Azure AD B2C

### Part 1 – Create blob storage to store the custom HTML

To create a storage account, follow these steps:  

1. Sign in to the Azure portal.

2. Make sure to use the directory that contains your Azure subscription. Select the **Directory + Subscription** filter in the top menu and choose the directory that contains your subscription. This directory is different than the one that contains your Azure B2C tenant.

3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select  **Storage accounts**.

4. Select **Add**.

5. Under **Resource group**, select **Create new**, enter a name for the new resource group, and then select **OK**.

6. Enter a name for the storage account. The name you choose must be unique across Azure, must be between 3 and 24 characters in length, and may contain numbers and lowercase letters only.

7. Select the location of the storage account or accept the default location.

8. Accept all other default values, select  **Review & create** > **Create**.

9. After the storage account is created, select  **Go to resource**.

#### Create a container

1. On the overview page of the storage account, select  **Blobs**.

2. Select  **Container**, enter a name for the container, choose  **Blob** (anonymous read access for blobs only), and then select **OK**.

#### Enable Cross-origin resource sharing (CORS)

Azure AD B2C code in a browser uses a modern and standard approach to load custom content from a URL that you specify in a user flow. CORS allows restricted resources on a web page to be requested from other domains.

1. In the menu, select  **CORS**.

2. For  **Allowed origins**, enter `https://your-tenant-name.b2clogin.com`. Replace your-tenant-name with the name of your Azure AD B2C tenant. For example, `https://fabrikam.b2clogin.com`. Use all lowercase letters when entering your tenant name.

3. For **Allowed Methods**, select **GET**, **PUT**, and **OPTIONS**.

4. For **Allowed Headers**, enter an asterisk (*).

5. For **Exposed Headers**, enter an asterisk (*).

6. For **Max age**, enter 200.

   ![Arkose Labs sign-up and sign-in](media/partner-arkose-labs/signup-signin-arkose.png)

7. Select **Save**.

### Part 2 – Set up a back-end server

Download Git Bash and follow the steps below:

1. Follow the instructions to [create a web app](https://docs.microsoft.com/azure/app-service/app-service-web-get-started-php), up until the message “Congratulations! You've deployed your first PHP app to App Service” displays.

2. Open your local folder and rename the **index.php** file to **verify-token.php**.

3. Open the newly renamed file verify-token.php file and:

   a. Replace the content with the content from the verify-token.php file found in the [GitHub repository](https://github.com/ArkoseLabs/Azure-AD-B2C).

   b. Replace <private_key> on line 3 with your private key obtained from the Arkose Labs dashboard.

4. In the local terminal window, commit your changes in Git, and then push the code changes to Azure by typing the following in Git Bash:

   ``git commit -am "updated output"``

   ``git push azure master``  

### Part 3 –  Final setup

#### Store the custom HTML

1. Open the index.html file stored in the [GitHub repository](https://github.com/ArkoseLabs/Azure-AD-B2C).

2. Replace all instances of `<tenantname>` with your b2C tenant name (in other words, `<tenantname>.b2clogin.com`). There should be four instances.

3. Replace the `<appname>` with the app name that you created in Part 2, step 1.

   ![Screenshot showing Arkose Labs Azure CLI](media/partner-arkose-labs/arkose-azure-cli.png)

4. Replace the `<public_key>` on line 64 with the public key you obtained from the Arkose Labs dashboard.

5. Upload the index.html file into the blob storage created above.

6. Go to **Storage** > **Container** > **Upload**.

#### Set up Azure AD B2C

> [!NOTE]
> If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

1. Create a user flow based on the information [here](tutorial-create-user-flows.md). Stop when you reach the section **Test the user flow**.

2. Enable JavaScript in your [user flow](user-flow-javascript-overview.md).

3. In the same user flow page, enable custom page URL: Go to
**User flow** > **page layout** > **use custom page content** = **yes** > **insert custom page URL**.
This custom page URL is obtained from the location of the index.html file inside the blob storage  

   ![Screenshot showing Arkose Labs storage url](media/partner-arkose-labs/arkose-storage-url.png)

## Test the user flow

1. Open the Azure AD B2C tenant, and under **Policies**, select **User flows**.

2. Select your previously created User Flow.

3. Select **Run user flow** and select the settings:

   a. **Application** - Select the registered app (sample is JWT).

   b. **Reply URL** - Select the redirect URL.

   c. Select **Run user flow**.

4. Go through the sign-up flow and create an account.

5. Sign out.

6. Go through the sign-in flow.

7. An Arkose Labs puzzle will appear after you select **continue**.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](custom-policy-get-started.md?tabs=applications)
