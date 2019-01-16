---
title: Tutorial - Customize the user interface of your applications in Azure Active Directory B2C | Microsoft Docs
description: Learn how to customize the user interface of your applications in Azure Active Directory B2C using the Azure portal.
services: B2C
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 11/30/2018
ms.author: davidmu
ms.component: B2C
---

# Tutorial: Customize the user interface of your applications in Azure Active Directory B2C

For more common user experiences, such as sign-up, sign-in, and profile editing, you can use [user flows](active-directory-b2c-reference-policies.md) in Azure Active Directory (Azure AD) B2C. The information in this tutorial helps you to learn how to [customize the user interface (UI)](customize-ui-overview.md) of these experiences using your own HTML and CSS files.

In this article, you learn how to:

> [!div class="checklist"]
> * Create UI customization files
> * Create a sign-up and sign-in user flow that uses the files
> * Test the customized UI

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

If you haven't already created your own [Azure AD B2C Tenant](tutorial-create-tenant.md), create one now. You can use an existing tenant if you created one in a previous tutorial.

## Create customization files

You create an Azure storage account and container and then place basic HTML and CSS files in the container.

### Create a storage account

Although you can store your files in many ways, for this tutorial, you store them in [Azure Blob storage](../storage/blobs/storage-blobs-introduction.md).

1. Make sure you're using the directory that contains your Azure subscription. Select the **Directory and subscription filter** in the top menu and choose the directory that contains your subscription. This directory is different than the one that contains your Azure B2C tenant.

    ![Switch to subscription directory](./media/tutorial-customize-ui/switch-directories.png)

2. Choose All services in the top-left corner of the Azure portal, search for and select **Storage accounts**. 
3. Select **Add**.
4. Under **Resource group**, select **Create new**, enter a name for the new resource group, and then click **OK**.
5. Enter a name for the storage account. The name you choose must be unique across Azure, must be between 3 and 24 characters in length, and may contain numbers and lowercase letters only.
6. Select the location of the storage account or accept the default location. 
7. Accept all other default values, select **Review + create**, and then click **Create**.
8. After the storage account is created, select **Go to resource**.

### Create a container

1. On the overview page of the storage account, select **Blobs**.
2. Select **Container**, enter a name for the container, choose **Blob (anonymous read access for blobs only)**, and then click **OK**.

### Enable CORS

 Azure AD B2C code in a browser uses a modern and standard approach to load custom content from a URL that you specify in a user flow. Cross-origin resource sharing (CORS) allows restricted resources on a web page to be requested from other domains.

1. In the menu, select **CORS**.
2. For **Allowed origins**, enter `https://your-tenant-name.b2clogin.com`. Replace `your-tenant-name` with the name of your Azure AD B2C tenant. For example, `https://fabrikam.b2clogin.com`. You need to use all lowercase letters when entering your tenant name.
3. For **Allowed Methods**, select both `GET` and `OPTIONS`.
4. For **Allowed Headers**, enter an asterisk (*).
5. For **Exposed Headers**, enter an asterisk (*).
6. For **Max age**, enter 200.

    ![Enable CORS](./media/tutorial-customize-ui/enable-cors.png)

5. Click **Save**.

### Create the customization files

To customize the UI of the sign-up experience, you start by creating a simple HTML and CSS file. You can configure your HTML any way you want, but it must have a **div** element with an identifier of `api`. For example, `<div id="api"></div>`. Azure AD B2C injects elements into the `api` container when the page is displayed.

1. In a local folder, create the following file and make sure that you change `your-storage-account` to the name of the storage account and `your-container` to the name of the container that you created. For example, `https://store1.blob.core.windows.net/b2c/style.css`.

    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <title>My B2C Application</title>
        <link rel="stylesheet" href="https://your-storage-account.blob.core.windows.net/your-container/style.css">
      </head>
      <body>  
        <h1>My B2C Application</h1>
        <div id="api"></div>
      </body>
    </html>
    ```

    The page can be designed any way that you want, but the **api** div element is required for any HTML customization file that you create. 

3. Save the file as *custom-ui.html*.
4. Create the following simple CSS that centers all elements on the sign-up or sign-in page including the elements that Azure AD B2C injects.

    ```css
    h1 {
      color: blue;
      text-align: center;
    }
    .intro h2 {
      text-align: center; 
    }
    .entry {
      width: 300px ;
      margin-left: auto ;
      margin-right: auto ;
    }
    .divider h2 {
      text-align: center; 
    }
    .create {
      width: 300px ;
      margin-left: auto ;
      margin-right: auto ;
    }
    ```

5. Save the file as *style.css*.

### Upload the customization files

In this tutorial, you store the files that you created in the storage account so that Azure AD B2C can access them.

1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Storage accounts**.
2. Select the storage account you created, select **Blobs**, and then select the container that you created.
3. Select **Upload**, navigate to and select the *custom-ui.html* file, and then click **Upload**.

    ![Upload customization files](./media/tutorial-customize-ui/upload-blob.png)

4. Copy the URL for the file that you uploaded to use later in the tutorial.
5. Repeat step 3 and 4 for the *style.css* file.

## Create a sign-up and sign-in user flow

To complete the steps in this tutorial, you need to create a test application and a sign-up or sign-in user flow in Azure AD B2C. You can apply the principles described in this tutorial to the other user experiences, such as profile editing.

### Create an Azure AD B2C application

Communication with Azure AD B2C occurs through an application that you create in your tenant. The following steps create an application that redirects the authorization token that is returned to [https://jwt.ms](https://jwt.ms).

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. Select **Applications**, and then select **Add**.
5. Enter a name for the application, for example *testapp1*.
6. For **Web App / Web API**, select `Yes`, and then enter `https://jwt.ms` for the **Reply URL**.
7. Click **Create**.

### Create the user flow

To test your customization files, you create a built-in sign-up or sign-in user flow that uses the application that you previously created.

1. In your Azure AD B2C tenant, select **User flows**, and then click **New user flow**.
2. On the **Recommended** tab, click **Sign up and sign in**.
3. Enter a name for the user flow. For example, *signup_signin*. The prefix *B2C_1* is automatically added to the name when the user flow is created.
4. Under **Identity providers**, select **Email sign-up**.
5. Under **User attributes and claims**, click **Show more**.
6. In the **Collect attribute** column, choose the attributes that you want to collect from the customer during sign-up. For example, set **Country/Region**, **Display Name**, and **Postal Code**.
7. In the **Return claim** column, choose the claims that you want returned in the authorization tokens sent back to your application after a successful sign-up or sign-in experience. For example, select **Display Name**, **Identity Provider**, **Postal Code**, **User is new** and **User's Object ID**.
8. Click **OK**.
9. Click **Create**.
10. Under **Customize**, select **Page layouts**. Select **Unified sign-up or sign-in page**, and the click **Yes** for **Use custom page content**.
11. In **Custom page URI**, enter the URL for the *custom-ui.html* file that you recorded earlier.
12. At the top of the page, click **Save**.

## Test the user flow

1. In your Azure AD B2C tenant, select **User flows** and select the user flow that you created. For example, *B2C_1_signup_signin*.
2. At the top of the page, click **Run user flow**.
3. Click the **Run user flow** button.

    ![Run the sign-up or sign-in user flow](./media/tutorial-customize-ui/run-user-flow.png)

    You should see a page similar to the following example with the elements centered based on the CSS file that you created:

    ![User flow results](./media/tutorial-customize-ui/run-now.png) 

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Create UI customization files
> * Create a sign-up and sign-in user flow that uses the files
> * Test the customized UI

> [!div class="nextstepaction"]
> [Language customization in Azure Active Directory B2C](active-directory-b2c-reference-language-customization.md)