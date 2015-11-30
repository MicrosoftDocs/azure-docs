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
	ms.date="10/08/2015"
	ms.author="swkrish"/>

# Azure Active Directory B2C preview: A Helper Tool used to demonstrate the Page User Interface (UI) Customization feature

This article is a companion to the [main UI customization article](active-directory-b2c-reference-ui-customization.md) in Azure Active Directory B2C.  The steps below describe how to exercise the page UI customization feature using sample HTML & CSS content that we've provided.

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

## Get an Azure AD B2C tenant

Before you can customize anything, you will need to [get an Azure AD B2C tenant](active-directory-b2c-get-started.md) if you don't already have one.

## Create a sign-up policy

The sample content we've provided customizes two pages in a [sign-up policy](active-directory-b2c-reference-policies.md#how-to-create-a-sign-up-policy): the [IDP Selection Page](active-directory-b2c-reference-ui-customization.md#identity-provider-selection-page) and the [Local Account Sign-Up Page](active-directory-b2c-reference-ui-customization.md#local-account-sign-up-page).  When [creating your sign-up policy](active-directory-b2c-reference-policies.md#how-to-create-a-sign-up-policy), add Local Account (Email address), Facebook, and Google+ as **Identity providers**.  These are the only IDPs our sample HTML content will accept.

## Register an application

You will need to [register an application](active-directory-b2c-app-registration.md) in your B2C tenant that can be used to execute your policy.  After registering your application, you have a few options you can use to actually run your sign-up policy:

- Build one of the Azure AD B2C Quick Start Applications listed [here](active-directory-b2c-overview.md#getting-started).
- Use the pre-built [Azure AD B2C Playground](https://aadb2cplayground.azurewebsites.net) application.  If you choose to use the playground, you must register an application in your B2C tenant using the **redirect URI** `https://aadb2cplayground.azurewebsites.net/`
- Use the **Run Now** button on your policy in the [Azure Preview Portal](https://portal.azure.com).

## Customize your policy

In order to customize the look and feel of your policies, you need to first create HTML and CSS files using the specific conventions of Azure AD B2C.  You can then upload your static content to a publicly available location so that Azure AD B2C can access it.  This could be your own dedicated web server, Azure Blob Storage, Azure CDN, or any other static resource hosting provider.  The only requirements are that your content is available over HTTPS and can be accessed using CORS.  Once you've exposed your static content on the web, you can edit your policy to point to this location and present that content to your end-users.  The [main UI customization article](active-directory-b2c-reference-ui-customization.md) describes in detail how the Azure AD B2C customization feature works.  

For the purposes of this tutorial, we've already created some sample content and hosted it on Azure Blob Storage.  The sample content is a very basic customization in the theme of our artificial company, "Contoso B2C".  To try it out in your own policy, follow these steps:

1. Sign in to your tenant on the [Azure preview portal](https://portal.azure.com) and navigate to the B2C features blade.
2. Click **Sign-up policies** and then click on your sign-up policy (for example, "b2c_1_sign_up").
3. Click **Page UI customization** and then **Identity provider selection page**.
4. Toggle the **Use custom template** switch to **Yes**. In the **Custom page URI** field, enter `https://contosob2c.blob.core.windows.net/static/Index.html`. Click **OK**.
5. Click **Local account sign-up page**. Toggle the **Use custom template** switch to **Yes**. In the **Custom page URI** field, enter `https://contosob2c.blob.core.windows.net/static/EmailVerification.html`. Click **OK** twice to close the UI customization blades.
6. Click **Save**.

Now you can try out your customized policy.  You can use your own application or the AAD B2C playground if you wish, but you can also simply click the **Run Now** command in the policy blade.  Select your application in the drop-down and the appropriate redirect URI. Click the **Run now** button.  A new browser tab should open up and you can run through the user experience of signing up for your application with the new content in place!

## Upload the sample content to Azure Blob Storage

If you would like to use Azure Blob Storage to host your page content, you can create your own storage account and use our B2C helper tool to upload your files.  

#### Create a storage account

1. Sign in to the [Azure preview portal](https://portal.azure.com/).
2. Click on **+ New** -> **Data + Storage** -> **Storage account**. You will need an Azure subscription to create an Azure Blob Storage account. You can sign up a free trial [here](https://azure.microsoft.com/en-us/pricing/free-trial/).
3. Provide a **Name** for the storage account (for example, "contoso") and pick the appropriate selections for **Pricing tier**, **Resource Group** and **Subscription**. Make sure that you have the **Pin to Startboard** option checked. Click **Create**.
4. Go back to the Startboard and click on the storage account that you just created.
5. Under the **Summary** section, click **Containers** and then **+ Add**.
6. Provide a **Name** for the container (for example, "b2c") and select **Blob** as the **Access type**. Click **OK**.
7. The container that you created will appear in the list on the **Blobs** blade. Note down the URL of the container; for example, it should look like `https://contoso.blob.core.windows.net/b2c`. Close the **Blobs** blade.
8. On the storage account blade, click **Keys** and note down the values of the **Storage Account Name** and **Primary Access Key** fields.

> [AZURE.NOTE]
	**Primary Access Key** is an important security credential.

#### Download the helper tool and sample files

You can download the [Azure Blob Storage helper tool and sample files as a .zip here](https://github.com/azureadquickstarts/b2c-azureblobstorage-client/archive/master.zip) or clone it from GitHub:

```
git clone https://github.com/azureadquickstarts/b2c-azureblobstorage-client
```

This repo contains a `sample_templates\contoso` directory, which contains example HTML, CSS, and images.  In order for these templates to reference your own Azure Blob Storage account, you will need to edit the HTML files.  Open `Index.htnml` and `EmailValidation.html` and replace any instances of `https://localhost` with the URL of your own container that you copied in the steps above.  It is necessary to use the absolute path of the HTML files because in this case, the HTML will be served by Azure AD, under the domain `https://login.microsoftonline.com`.

#### Upload the sample files

In the same repo, unzip `B2CAzureStorageClient.zip` and run the `B2CAzureStorageClient.exe` file within.  This program will simply upload all the files in the directory you specify to your storage account, and enable CORS access for those files.  If you followed the steps above, the HTML and CSS files will now be pointing to your storage account.  Note that the name of your storage account is the part that precedes `blob.core.windows.net`, e.g. `contoso`.  You can verify that the content has been uploaded correctly by trying to access `https://{storage-account-name}.blob.core.windows.net/{container-name}/Index.html` on a browser. Also use [http://test-cors.org/](http://test-cors.org/) to make sure that the content is now CORS enabled (look for XHR status: 200 in the result).

#### Customize your policy, again

Now that you've uploaded the sample content to your own storage account, you must edit your sign-up policy to reference it.  Repeat the steps from the ["Customize your policy"](#customize-your-policy) section above, this time using your own storage account's URLs.  For instance, the location of your `Index.html` file would be `<url-of-your-container>/Index.html`.  
        
Now you can use the **Run Now** button or your own applicaition to execute your policy again.  The result should look almost exactly the same - you used the same sample HTML & CSS in both cases.  However, your policies are now referencing your own instance of Azure Blob Storage, and you are free to edit and re-upload the files as you please.  For more information on customizing the HTML & CSS, please refer to the [main UI customization article](active-directory-b2c-reference-ui-customization.md).