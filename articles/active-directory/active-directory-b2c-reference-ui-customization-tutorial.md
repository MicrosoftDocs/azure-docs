<properties
	pageTitle="Azure AD B2C preview | Microsoft Azure"
	description="A tutorial on how to use the page UI customization feature in Azure AD B2C"
	services="active-directory"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/08/2015"
	ms.author="swkrish"/>

# Azure AD B2C preview: A tutorial on how to customize the UI of pages served by the Azure AD B2C service

This tutorial is a companion to the [main document](active-directory-b2c-reference-ui-customization) on page UI customization feature on Azure AD B2C.

Following the steps below will allow you to exercise the page UI customization feature using our sample content. For the purposes of demonstration, the content is only **static** HTML5; you can switch it to **dynamic** HTML5 if you want.

1. You will copy our sample content and store it on [Azure Blob Storage](http://azure.microsoft.com/documentation/services/storage/), and make it accessible publicly via HTTPS.
2. You will turn on CORS on the Azure Blob Storage URLs where the content gets stored.
3. You will modify the page UI customization options in your existing sign-up policy to specify the above URLs.

Complete the following pre-requisites before you get started:

- Build a [web application](active-directory-webapp-dotnet-b2c.md) that has been secured by Azure AD B2C. One of the steps in this tutorial is to create a sign-up policy that you will modify here.
- Download any one of our [sample content](TBD) repositories from github. Unzip the folder to access the actual content (HTML and image files).
- Download the [console application](TBD) that sets CORS properties on your Azure Blob Storage. This is a Visual Studio 2013 solution.

### Step 1: Store the sample content in the right locations

1. Sign in to the [Azure Portal](https://portal.azure.com/).
2. Click on **+ New** -> **Data + Storage** -> **Storage account**. You will need an Azure subscription to create an Azure Blob Storage account.
3. Provide a **Name** for the storage account (for e.g., "contoso.core.windows.net") and pick the appropriate selections for **Pricing tier**, **Resource Group** and **Subscription**. Make sure that you have the **Pin to Startboard** option checked. Click **Create**.
4. Go back to the Starboard and click on the storage account that you just created.
5. Under the **Summary** section, click **Containers** and then **+ Add**.
6. Provide a **Name** for the container (for e.g., "b2c") and select **Blob** as the **Access type**. Click **OK**.
7. The container that you created will appear in the list on the **Blobs** blade. Note down the URL of the container; for e.g., it should look like `https://contoso.blob.core.windows.net/b2c`. Close the **Blobs** blade.
8. On the storage account blade, click **Keys** and note down the values of the **Storage Account Name** and **Primary Access Key** fields.

> [AZURE.NOTE]
**Primary Access Key** is an important security credential.

9. Use any one of the [storage explorers](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/03/11/windows-azure-storage-explorers-2014.aspx) listed to upload the [sample content](TBD) files downloaded from github.

> [AZURE.NOTE]
The simplest storage explorer (fully browser-based) to use is [Azure Web Storage Explorer](http://azurestorage.azurewebsites.net/). Note that this project is not maintained by Microsoft, but by an independent developer on github. Click [here](https://github.com/sebagomez/azurestorageexplorer) for more details.

10. Make sure that the content loads as expected; try to access `https://contoso.blob.core.windows.net/b2c/idp.html` on a browser.

### Step 2: Enable CORS on your storage account

1. Open the `App.config` file in the root of the console application project, and enter values for these configuration keys (copied down earlier):
  - For "ida:AccountName", enter your **Storage Account Name**. For e.g., "contoso.core.windows.net".
  - For "ida:AccountKey", enter the **Primary Access Key**.
2. Build the Visual Studio solution and run the application.
3. Use [http://test-cors.org/](http://test-cors.org/) to make sure that your content is now CORS enabled (look for `XHR status: 200` in the result).

### Step 3: Modify the page UI customization options in your sign-up policy

1. Sign in to your directory on the [Azure Portal](https://portal.azure.com) and navigate to the B2C features blade.
2. Click **Sign-up policies** and then click on your sign-up policy (for e.g., "B2C_1_SiIn").
3. Click **Page UI customization** and then **Identity provider selection page**.
4. Toggle the **Use custom template** switch to **Yes**. In the **Custom page URI** field, enter the appropriate URL of the content uploaded to your storage account. For e.g., `https://contoso.blob.core.windows.net/b2c/idp.html`. Click **OK**.
5. Click **Local account sign-up page**. Toggle the **Use custom template** switch to **Yes**. In the **Custom page URI** field, enter the appropriate URL of the content uploaded to your storage account. For e.g., `https://contoso.blob.core.windows.net/b2c/su.html`. Click **OK** twice.
6. Click **Save**.
7. Click the **Run now** command at the top of the blade. Select "B2C app" in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down. Click the **Run now** button.
8. A new browser tab opens up and you can run through the user experience of signing up for your application with the new content in place!

> [AZURE.NOTE]
Note that it takes up to a minute for your policy changes to take effect.

You can make similar changes to your sign-in and profile editing policies.
