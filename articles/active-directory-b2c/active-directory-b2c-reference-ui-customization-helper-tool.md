<properties
	pageTitle="Azure Active Directory B2C: Page UI customization helper tool | Microsoft Azure"
	description="A helper tool used to demonstrate the page UI customization feature in Azure Active Directory B2C"
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="bryanla"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/22/2016"
	ms.author="swkrish"/>

# Azure Active Directory B2C: A helper tool used to demonstrate the page user interface (UI) customization feature

This article is a companion to the [main UI customization article](active-directory-b2c-reference-ui-customization.md) in Azure Active Directory (Azure AD) B2C. The following steps describe how to exercise the page UI customization feature by using sample HTML and CSS content that we've provided.

## Get an Azure AD B2C tenant

Before you can customize anything, you will need to [get an Azure AD B2C tenant](active-directory-b2c-get-started.md) if you don't already have one.

## Create a sign-up or sign-in policy

The sample content we've provided can be used to customze two pages in a [sign-up or sign-in policy](active-directory-b2c-reference-policies.md): the [unified sign-in page](active-directory-b2c-reference-ui-customization.md) and the [self-asserted attributes page](active-directory-b2c-reference-ui-customization.md). When [creating your sign-up or sign-in policy](active-directory-b2c-reference-policies.md#create-a-sign-up-or-sign-in-policy), add Local Account (email address), Facebook, Google, and Microsoft as **Identity providers**. These are the only IDPs that our sample HTML content will accept.  You can also add a subset of these IDPs if you wish.

## Register an application

You will need to [register an application](active-directory-b2c-app-registration.md) in your B2C tenant that can be used to execute your policy. After registering your application, you have a few options that you can use to actually run your sign-up policy:

- Build one of the Azure AD B2C quick-start applications listed in the "Get started" section of [Sign up and sign in consumers in your applications](active-directory-b2c-overview.md#getting-started).
- Use the pre-built [Azure AD B2C Playground](https://aadb2cplayground.azurewebsites.net) application. If you choose to use the playground, you must register an application in your B2C tenant using the **redirect URI** `https://aadb2cplayground.azurewebsites.net/`.
- Use the **Run Now** button on your policy in the [Azure portal](https://portal.azure.com/).

## Customize your policy

To customize the look and feel of your policy, you need to first create HTML and CSS files using the specific conventions of Azure AD B2C. You can then upload your static content to a publicly available location so that Azure AD B2C can access it. This could be your own dedicated web server, Azure Blob Storage, Azure Content Delivery Network, or any other static resource-hosting provider. The only requirements are that your content is available over HTTPS and can be accessed by using CORS. Once you've exposed your static content on the web, you can edit your policy to point to this location and present that content to your customers. The [main UI customization article](active-directory-b2c-reference-ui-customization.md) describes in detail how the Azure AD B2C customization feature works.

For the purposes of this tutorial, we've already created some sample content and hosted it on Azure Blob Storage. The sample content is a very basic customization in the theme of our fictional company, "Wingtip Toys". To try it out in your own policy, follow these steps:

1. Sign in to your tenant on the [Azure portal](https://portal.azure.com/) and navigate to the B2C features blade.
2. Click **Sign-up or sign-in policies** and then click your policy (for example, "b2c\_1\_sign\_up\_sign\_in").
3. Click **Page UI customization** and then **Unified sign-up or sign-in page**.
4. Toggle the **Use custom page** switch to **Yes**. In the **Custom page URI** field, enter `https://wingtiptoysb2c.blob.core.windows.net/b2c/wingtip/unified.html`. Click **OK**.
5. Click **Local account sign-up page**. Toggle the **Use custom template** switch to **Yes**. In the **Custom page URI** field, enter `https://wingtiptoysb2c.blob.core.windows.net/b2c/wingtip/selfasserted.html`.
5. Repeat the same step for the **Social account sign-up page**.
 Click **OK** twice to close the UI customization blades.
6. Click **Save**.

Now you can try out your customized policy. You can use your own application or the Azure AD B2C playground if you want to, but you can also simply click the **Run Now** command in the policy blade. Select your application in the drop-down box and choose the appropriate redirect URI. Click the **Run now** button. A new browser tab will open and you can run through the user experience of signing up for your application with the new content in place!

## Upload the sample content to Azure Blob Storage

If you would like to use Azure Blob Storage to host your page content, you can create your own storage account and use our B2C helper tool to upload your files.

### Create a storage account

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Click **+ New** > **Data + Storage** > **Storage account**. You will need an Azure subscription to create an Azure Blob Storage account. You can sign up a free trial at the [Azure website](https://azure.microsoft.com/pricing/free-trial/).
3. Provide a **Name** for the storage account (for example, "contoso") and pick the appropriate selections for **Pricing tier**, **Resource group** and **Subscription**. Make sure that you have the **Pin to Startboard** option checked. Click **Create**.
4. Go back to the Startboard and click the storage account that you just created.
5. In the **Summary** section, click **Containers**, and then click **+ Add**.
6. Provide a **Name** for the container (for example, "b2c") and select **Blob** as the **Access type**. Click **OK**.
7. The container that you created will appear in the list on the **Blobs** blade. Write down the URL of the container; for example, it should look similar to `https://contoso.blob.core.windows.net/b2c`. Close the **Blobs** blade.
8. On the storage account blade, click **Keys** and write down the values of the **Storage Account Name** and **Primary Access Key** fields.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Click **+ New** > **Data + Storage** > **Storage account**. You will need an Azure subscription to create an Azure Blob Storage account. You can sign up a free trial at the [Azure website](https://azure.microsoft.com/pricing/free-trial/).
3. Select **Blob Storage** under **Account Kind**, and leave the other values as default.  You can edit the Resource Group & Location if you wish.  Click **Create**.
4. Go back to the Startboard and click the storage account that you just created.
5. In the **Summary** section, click **+Container**.
6. Provide a **Name** for the container (for example, "b2c") and select **Blob** as the **Access type**. Click **OK**.
7. Open the container **properties**, and  Write down the URL of the container; for example, it should look similar to `https://contoso.blob.core.windows.net/b2c`. Close the container blade.
8. On the storage account blade, click on the **Key Icon** and write down the values of the **Storage Account Name** and **Primary Access Key** fields.

> [AZURE.NOTE]
	**Primary Access Key** is an important security credential.

### Download the helper tool and sample files

You can download the [Azure Blob Storage helper tool and sample files as a .zip file](https://github.com/azureadquickstarts/b2c-azureblobstorage-client/archive/master.zip) or clone it from GitHub:

```
git clone https://github.com/azureadquickstarts/b2c-azureblobstorage-client
```

This repository contains a `sample_templates\wingtip` directory, which contains example HTML, CSS, and images. For these templates to reference your own Azure Blob Storage account, you will need to edit the HTML files. Open `unified.html` and `selfasserted.html` and replace any instances of `https://localhost` with the URL of your own container that you wrote down in the previous steps. You must use the absolute path of the HTML files because in this case, the HTML will be served by Azure AD, under the domain `https://login.microsoftonline.com`.

### Upload the sample files

In the same repository, unzip `B2CAzureStorageClient.zip` and run the `B2CAzureStorageClient.exe` file within. This program will simply upload all the files in the directory that you specify to your storage account, and enable CORS access for those files. If you followed the steps above, the HTML and CSS files will now be pointing to your storage account. Note that the name of your storage account is the part that precedes `blob.core.windows.net`; for example, `contoso`. You can verify that the content has been uploaded correctly by trying to access `https://{storage-account-name}.blob.core.windows.net/{container-name}/wingtip/unified.html` on a browser. Also use [http://test-cors.org/](http://test-cors.org/) to make sure that the content is now CORS enabled. (Look for "XHR status: 200" in the result.)

### Customize your policy, again

Now that you've uploaded the sample content to your own storage account, you must edit your sign-up policy to reference it. Repeat the steps from the ["Customize your policy"](#customize-your-policy) section above, this time using your own storage account's URLs. For instance, the location of your `unified.html` file would be `<url-of-your-container>/wingtip/unified.html`.

Now you can use the **Run Now** button or your own application to execute your policy again. The result should look almost exactly the same--you used the same sample HTML and CSS in both cases. However, your policies are now referencing your own instance of Azure Blob Storage, and you are free to edit and upload the files again as you please. For more information on customizing the HTML and CSS, refer to the [main UI customization article](active-directory-b2c-reference-ui-customization.md).
