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
   ms.date="10/12/2016"
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

* Your Azure AD domain name. You can retrieve it by hovering the mouse in the top-right corner of the Azure Portal. From the screenshot below, the domain name is **contoso.microsoft.com**, and the GUID within brackets is the tenant ID. 

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

| Requirements | Instructions available at |
|-------------------------|-----------------------------------|
| Azure AD domain name       | Already listed in the prerequisite of this article        |
| Azure AD **web application** | See Step 1 below, under [Create an Active Directory application](#create-an-active-directory-application) |
| Client ID for the Azure AD web application | See Step 2 below, under [Create an Active Directory application](#create-an-active-directory-application)|
| Reply URI for the Azure AD web application | See Step 2 below, under [Create an Active Directory application](#create-an-active-directory-application)| 
| Set delegated permissions |  See Step 2 below, under [Create an Active Directory application](#create-an-active-directory-application)|

For instructions on how to create an Azure AD application and retrieve the client ID, see the section, [Create an Active Directory application](#create-an-active-directory-application) below. 

## Service-to-service authentication

This is the recommended approach if you want your application to automatically authenticate with Azure AD, without the need for an end-user to provide their credentials. Your application will be able to authenticate itself for as long as its credentials are valid, which can be customized to be in the order of years.

### What do I need to use this approach?

| Requirements | Instructions available at |
|-------------------------|-----------------------------------|
| Azure AD domain name       | Already listed in the prerequisite of this article        |
| Azure AD **web application** | See Step 1 below, under [Create an Active Directory application](#create-an-active-directory-application) |
| Client ID, client secret, and token endpoint for the Azure AD web application | See Step 3 below, under [Create an Active Directory application](#create-an-active-directory-application)|
| Enable access for the Azure AD web application on the the Data Lake Store file/folder or the Data Lake Analytics account that you want to work with. | See Step 4 below, under [Create an Active Directory application](#create-an-active-directory-application)| 


>[AZURE.NOTE] By default the Azure AD application is configured to use the client secret, which you can retrieve from the Azure AD application. However, if you want the Azure AD application to use a certificate instead, you must create the Azure AD web application using Azure PowerShell, as described at [Create a service principal with certificate](../resource-group-authenticate-service-principal.md#create-service-principal-with-certificate).

## Create an Active Directory application

In this section we learn about how to create and use an Azure AD web application to authenticate with Azure Data Lake Store using Azure Active Directory. Configurations you need in an Azure AD web application differ based on whether you are using the web app for end-user authentication or service-to-service authentication. The instructions in this section are comprehensive and cover requirements for both types of authentication. However, the table below summarizes the steps you should care about depending on whether you are using end-user authentication or service-to-service authentication.

| End-user authentication | Service-to-service authentication |
|-------------------------|-----------------------------------|
| Use Step 1, Step 2      | Use Step 1, Step 3, Step 4        |



### Step 1: Create an Azure Active Directory application

>[AZURE.NOTE] The steps below use the Azure Portal. You can also create an Azure AD application using [Azure PowerShell](../resource-group-authenticate-service-principal.md) or [Azure CLI](../resource-group-authenticate-service-principal-cli.md).

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

6. Provide a name for the application and select the type of application you want to create. For this tutorial, create a **WEB APPLICATION AND/OR WEB API** and click the next button.

     ![name application](./media/data-lake-store-authenticate-using-active-directory/tell-us-about-your-application.png)

7. Fill in the properties for your app. For **SIGN-ON URL**, provide the URI to a web site that describes your application. The existence of the web site is not validated. 
For **APP ID URI**, provide the URI that identifies your application.

     ![application properties](./media/data-lake-store-authenticate-using-active-directory/app-properties.png)

	Click the check mark to complete the wizard and create the application.

### Step 2: Get client id, reply URI, and set delegated permissions (only for end-user authentication)

1. Click on the **Configure** tab to configure your application's password.

     ![configure application](./media/data-lake-store-authenticate-using-active-directory/application-configure.png)

2. Copy the **CLIENT ID**.
  
     ![client id](./media/data-lake-store-authenticate-using-active-directory/client-id.png)

3. Under the **Single sign-on** section, copy the **Reply URI**.

	![client id](./media/data-lake-store-authenticate-using-active-directory/aad-end-user-auth-get-reply-uri.png)

4. Under **Permissions to other applications**, click **Add application**

	![client id](./media/data-lake-store-authenticate-using-active-directory/aad-end-user-auth-set-permission-1.png)

5. In the **Permissions to other applications** wizard, select **Azure Data Lake** and **Windows** **Azure Service Management API**, and click the checkmark.

6. By default the **Delegated Permissions** for the newly added services is set to zero. Click the **Delegated Permissions** drop-down for Azure Data Lake and Windows Azure Management Service and select the available checkboxes to set the values to 1. The result should look like this.

	 ![client id](./media/data-lake-store-authenticate-using-active-directory/aad-end-user-auth-set-permission-2.png)

7. Click **Save**.

### Step 3: Get client id, client secret, and token endpoint (only for service-to-service authentication)

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

### Step 4: Assign the Azure AD application to the Azure Data Lake Store account file or folder (only for service-to-service authentication)

1. Sign on to the new [Azure Portal](https://portal.azure.com) and open the Azure Data Lake Store account that you want to associate with the Azure Active Directory application you created earlier.

1. In your Data Lake Store account blade, click **Data Explorer**.

	![Create directories in Data Lake Store account](./media/data-lake-store-authenticate-using-active-directory/adl.start.data.explorer.png "Create directories in Data Lake account")

2. In the **Data Explorer** blade, click the file or folder for which you want to provide access to the Azure AD application, and then click **Access**. To configure access to a file, you must click **Access** from the **File Preview** blade.

	![Set ACLs on Data Lake file system](./media/data-lake-store-authenticate-using-active-directory/adl.acl.1.png "Set ACLs on Data Lake file system")

3. The **Access** blade lists the standard access and custom access already assigned to the root. Click the **Add** icon to add custom-level ACLs.

	![List standard and custom access](./media/data-lake-store-authenticate-using-active-directory/adl.acl.2.png "List standard and custom access")

4. Click the **Add** icon to open the **Add Custom Access** blade. In this blade, click **Select User or Group**, and then in **Select User or Group** blade, look for the security group you created earlier in Azure Active Directory. If you have a lot of groups to search from, use the text box at the top to filter on the group name. Click the group you want to add and then click **Select**.

	![Add a group](./media/data-lake-store-authenticate-using-active-directory/adl.acl.3.png "Add a group")

5. Click **Select Permissions**, select the permissions and whether you want to assign the permissions as a default ACL, access ACL, or both. Click **OK**.

	![Assign permissions to group](./media/data-lake-store-authenticate-using-active-directory/adl.acl.4.png "Assign permissions to group")

	For more information about permissions in Data Lake Store, and Default/Access ACLs, see [Access Control in Data Lake Store](data-lake-store-access-control.md).


6. In the **Add Custom Access** blade, click **OK**. The newly added group, with the associated permissions, will now be listed in the **Access** blade.

	![Assign permissions to group](./media/data-lake-store-authenticate-using-active-directory/adl.acl.5.png "Assign permissions to group")	


## Next steps

In this article you created an Azure AD web application and gathered the information you need in your client applications that you author using .NET SDK, Java SDK, etc. You can now proceed to the following articles that talk about how to use the Azure AD web application to first authenticate with Data Lake Store and then perform other operations on the store.

- [Get started with Azure Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)
- [Get started with Azure Data Lake Store using Java SDK](data-lake-store-get-started-java-sdk.md)
