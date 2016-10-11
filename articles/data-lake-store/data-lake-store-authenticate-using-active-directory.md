<properties
   pageTitle="Authenticate with Data Lake Store using Active Directory | Microsoft Azure"
   description="Learn how to authenticate with Data Lake Store using Active Directory"
   services="data-lake-store"
   documentationCenter=""
   authors="nitinme"
   manager="jhubbard"
   editor="cgronlun"/>

<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="09/27/2016"
   ms.author="nitinme"/>

# Authenticate with Data Lake Store using Azure Active Directory

Azure Data Lake Store uses Azure Active Directory for authentication. Before authoring an application that works with Azure Data Lake Store or Azure Data Lake Analytics, you must first decide how you would like to authenticate your application with Azure Active Directory (Azure AD). The two main options available are:

* End-user authentication, and 
* Service-to-service authentication. 

Both these options result in your application being provided with an OAuth 2.0 token, which gets attached to each request made to Azure Data Lake Store or Azure Data Lake Analytics.


## Prerequisites

* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* Your subscription ID. You can retrieve it from the Azure Portal. For example, it is available from the Data Lake Store account blade.

	![Get subscription ID](./media/data-lake-store-authenticate-using-active-directory/get-subscription-id.png)

* Your Azure AD domain name. You can retrieve it by hovering the mouse in the top-right corner of the Azure Portal. 

	![Get AAD domain](./media/data-lake-store-authenticate-using-active-directory/get-aad-domain.png)

## End-user authentication

This is the recommended approach if you want an end-user to log in to your application via Azure AD. Your application will be able to access Azure resources with the same level of access as the end-user that logged in. Your end-user will need to provide their credentials periodically in order for your application to maintain access.

The result of having the end-user log in is that your application is given an access token and a refresh token. The access token gets attached to each request made to Data Lake Store or Data Lake Analytics, and it is valid for one hour by default. The refresh token can be used to obtain a new access token, and it is valid for up to two weeks by default, if used regularly. You can use two different approaches for end-user log in.

### Using the OAuth 2.0 pop-up

Your application can trigger an OAuth 2.0 authorization pop-up, in which the end-user can enter their credentials. This pop-up also works with the Azure AD Two-factor Authentication (2FA) process, if required. 

>[AZURE.NOTE] This method is not yet supported in the Azure AD Authentication Library (ADAL) for Python or Java.

### Directly passing in user credentials

Your application can directly provide user credentials to Azure AD. This method only works with organizational ID user accounts; it is not compatible with personal / “live ID” user accounts, including those ending in @outlook.com or @live.com. Furthermore, this method is not compatible with user accounts that require Azure AD Two-factor Authentication (2FA).

### What do I need to use this approach?

* Azure AD domain name (already listed in the prerequisite of this article).

* Azure AD **native client application**. 

* Client ID for the Azure AD native client application.

* Redirect URI for the Azure AD native client application. 

For instructions on how to create an Azure AD application and retrieve the client ID, see [Create an Active Directory Application](../resource-group-create-service-principal-portal.md#create-an-active-directory-application). 

>[AZURE.NOTE] The instructions in the above links are for an Azure AD web application. However, the steps are exactly the same even if you chose to create a native client application instead.

## Service-to-service authentication

This is the recommended approach if you want your application to automatically authenticate with Azure AD, without the need for an end-user to provide their credentials. Your application will be able to authenticate itself for as long as its credentials are valid, which can be customized to be in the order of years.

### What do I need to use this approach?

* Azure AD domain name (already listed in the prerequisite of this article).

* Azure AD **web application**.

* Client ID for the Azure AD web application.

	>[AZURE.NOTE] For instructions on how to create an Azure AD application and retrieve the client ID, see [Create an Active Directory Application](../resource-group-create-service-principal-portal.md#create-an-active-directory-application).
	
* Configure the Azure AD web application to either use the client secret or a certificate. To create a web application using a certificate, see [Create a service principal with certificate](../resource-group-authenticate-service-principal.md#create-service-principal-with-certificate).

* Enable access for the Azure AD web application on the the Data Lake Store file/folder or the Data Lake Analytics account that you want to work with. For instructions on how to provide access to an Azure AD application to a Data Lake Store file/folder, see [Assign users or security group as ACLs to the Azure Data Lake Store file system](data-lake-store-secure-data.md#filepermissions).

## Authenticate using Azure Active Directory client keys

In this section, we use client keys to authenticate using Azure Active Directory. Using client keys for authentication is a 3-step process.

1. Create an Azure Active Directory identity
2. Retrieve the client id, authentication key, and OAuth token for the identity
3. Assign the identity to the Azure Data Lake Store account

### Step 1: Create an Azure Active Directory identity

1. Log in to your Azure Account through the [classic portal](https://manage.windowsazure.com/).

2. Select **Active Directory** from the left pane.

     ![select Active Directory](./media/data-lake-store-authenticate-using-active-directory/active-directory.png)
     
3. Select the Active Directory that you want to use for creating the new application. If you have more than one Active Directory, you usually want to create the application in the directory where your subscription resides. You can only grant access to resource in your subscription for applications in the same directory as your subscription.  

     ![choose directory](./media/data-lake-store-authenticate-using-active-directory/active-directory-details.png)
    
    
3. To view the applications in your directory, click on **Applications**.

     ![view applications](./media/data-lake-store-authenticate-using-active-directory/view-applications.png)

4. If you haven't created an application in that directory before you should see something similar to following image. Click on **ADD AN APPLICATION**

     ![add application](./media/data-lake-store-authenticate-using-active-directory/create-application.png)

     Or, click **Add** in the bottom pane.

     ![add](./media/data-lake-store-authenticate-using-active-directory/add-icon.png)

6. Provide a name for the application and select the type of application you want to create. For this tutorial, create a **WEB APPLICATION AND/OR WEB API** and click the next button. If you select **NATIVE CLIENT APPLICATION**, the remaining steps of this article will not match your experience.

     ![name application](./media/data-lake-store-authenticate-using-active-directory/tell-us-about-your-application.png)

7. Fill in the properties for your app. For **SIGN-ON URL**, provide the URI to a web site that describes your application. The existence of the web site is not validated. 
For **APP ID URI**, provide the URI that identifies your application.

     ![application properties](./media/data-lake-store-authenticate-using-active-directory/app-properties.png)

	Click the check mark to complete the wizard and create the application.

### Step 2: Get client id, authentication key, and token endpoint

When programmatically logging in, you need the id for your application. If the application runs under its own credentials, you will also need an authentication key.

1. Click on the **Configure** tab to configure your application's password.

     ![configure application](./media/data-lake-store-authenticate-using-active-directory/application-configure.png)

2. Copy the **CLIENT ID**.
  
     ![client id](./media/data-lake-store-authenticate-using-active-directory/client-id.png)

3. If the application will run under its own credentials, scroll down to the **Keys** section and select how long you would like your password to be valid.

     ![keys](./media/data-lake-store-authenticate-using-active-directory/create-key.png)

4. Select **Save** to create your key.

    ![save](./media/data-lake-store-authenticate-using-active-directory/save-icon.png)

    The saved key is displayed and you can copy it. You will not be able to retrieve the key later so must copy it now.

    ![saved key](./media/data-lake-store-authenticate-using-active-directory/save-key.png)

5. Retrieve the token endpoint by selecting **View endpoints** at the bottom of the screen and retrieving the value for **OAuth 2.0 Token Endpoint** field, as shown below.  

	![tenant id](./media/data-lake-store-authenticate-using-active-directory/save-tenant.png)

### Step 3: Assign the identity to the Azure Data Lake Store account

1. Sign on to the new [Azure Portal](https://portal.azure.com) and open the Azure Data Lake Store account that you want to associate with the Azure Active Directory application you created earlier.

2. From the Data Lake Store blade, click the **Access** icon.

	![Assign identity to Data Lake Store](./media/data-lake-store-authenticate-using-active-directory/assign-id-to-adls.png)

3. From the **Users** blade, click **Add**.

	![Assign identity to Data Lake Store](./media/data-lake-store-authenticate-using-active-directory/assign-id-to-adls-2.png)

4. From the **Add Access** blade, click **Select a role**, and then select the **Owner** role.

	![Assign identity to Data Lake Store](./media/data-lake-store-authenticate-using-active-directory/assign-id-to-adls-3.png)

5. In the **Add users** blade, search for the Azure Active Directory application you created earlier, select the application, and then click **Select**. Click **OK** to save the changes.

	![Assign identity to Data Lake Store](./media/data-lake-store-authenticate-using-active-directory/assign-id-to-adls-4.png)

## Next steps

- [Get started with Azure Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)
- [Get started with Azure Data Lake Store using Java SDK](data-lake-store-get-started-java-sdk.md)
- [Secure data in Data Lake Store](data-lake-store-secure-data.md)
