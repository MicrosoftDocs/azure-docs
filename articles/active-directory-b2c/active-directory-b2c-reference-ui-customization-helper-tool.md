<properties
	pageTitle="Azure Active Directory B2C preview: Page UI customization helper tool | Microsoft Azure"
	description="A helper tool used to demonstrate the page UI customization feature in Azure Active Directory B2C"
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/15/2015"
	ms.author="swkrish"/>

# Azure Active Directory (AD) B2C preview: A Helper Tool used to demonstrate the Page User Interface (UI) Customization feature

This article is a companion to the [main one](active-directory-b2c-reference-ui-customization) about the page user interface (UI) customization feature in Azure Active Directory (AD) B2C.

Following the steps given below will allow you to exercise the page UI customization feature using our sample content. Just for the purposes of demonstration, our sample content is **static** HTML5.

1. Upload our sample content to [Azure Blob Storage](http://azure.microsoft.com/documentation/services/storage/), make it publicly accessible via HTTPS and turn on CORS (Cross-Origin Resource Sharing) on those URLs.
2. Modify the page UI customization settings in your existing sign-up policy and specify the above URLs.

Before you get started:

- Build one of the Azure AD B2C Quick Start Applications listed [here](active-directory-b2c-overview.md). As part of doing this, you will create a sign-up policy that you will modify here.
- Download the helper tool from [here](https://github.com/AzureADSamples/B2C-AzureBlobStorage-Client).

### Step 1: Upload our sample content in the right locations

1. Sign in to the [Azure preview portal](https://portal.azure.com/).
2. Click on **+ New** -> **Data + Storage** -> **Storage account**. You will need an Azure subscription to create an Azure Blob Storage account. You can sign up a free trial [here](https://azure.microsoft.com/en-us/pricing/free-trial/).
3. Provide a **Name** for the storage account (for example, "contoso.core.windows.net") and pick the appropriate selections for **Pricing tier**, **Resource Group** and **Subscription**. Make sure that you have the **Pin to Startboard** option checked. Click **Create**.
4. Go back to the Startboard and click on the storage account that you just created.
5. Under the **Summary** section, click **Containers** and then **+ Add**.
6. Provide a **Name** for the container (for example, "b2c") and select **Blob** as the **Access type**. Click **OK**.
7. The container that you created will appear in the list on the **Blobs** blade. Note down the URL of the container; for example, it should look like `https://contoso.blob.core.windows.net/b2c`. Close the **Blobs** blade.
8. On the storage account blade, click **Keys** and note down the values of the **Storage Account Name** and **Primary Access Key** fields.

    > [AZURE.NOTE]
    **Primary Access Key** is an important security credential.

9. Run the helper tool and provide it with the **Storage Account Name** and **Primary Access Key** values copied down in the previous step. This will upload our sample content onto your storage account.
10. Verify that the content has been uploaded correctly by trying to access `https://contoso.blob.core.windows.net/b2c/idp.html` on a browser. Also use [http://test-cors.org/](http://test-cors.org/) to make sure that the content is now CORS enabled (look for `XHR status: 200` in the result).

### Step 2: Modify the page UI customization options in your sign-up policy

1. Sign in to your directory on the [Azure preview portal](https://portal.azure.com) and navigate to the B2C features blade.
2. Click **Sign-up policies** and then click on your sign-up policy (for example, "B2C_1_SiIn").
3. Click **Page UI customization** and then **Identity provider selection page**.
4. Toggle the **Use custom template** switch to **Yes**. In the **Custom page URI** field, enter the appropriate URL of the content uploaded to your storage account. For example, `https://contoso.blob.core.windows.net/b2c/idp.html`. Click **OK**.
5. Click **Local account sign-up page**. Toggle the **Use custom template** switch to **Yes**. In the **Custom page URI** field, enter the appropriate URL of the content uploaded to your storage account. For example, `https://contoso.blob.core.windows.net/b2c/su.html`. Click **OK** twice.
6. Click **Save**.
7. Click the **Run now** command at the top of the blade. Select "B2C app" in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down. Click the **Run now** button.
8. A new browser tab opens up and you can run through the user experience of signing up for your application with the new content in place!

> [AZURE.NOTE]
Note that it takes up to a minute for your policy changes to take effect.
