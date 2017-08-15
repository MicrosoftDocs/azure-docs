---
title: 'Service-to-service authentication: Data Lake Store with Azure Active Directory | Microsoft Docs'
description: Learn how to achieve service-to-service authentication with Data Lake Store using Azure Active Directory
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.assetid: 820b7c5d-4863-4225-9bd1-df4d8f515537
ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/21/2017
ms.author: nitinme

---
# Service-to-service authentication with Data Lake Store using Azure Active Directory
> [!div class="op_single_selector"]
> * [Service-to-service authentication](data-lake-store-authenticate-using-active-directory.md)
> * [End-user authentication](data-lake-store-end-user-authenticate-using-active-directory.md)
> 
> 

Azure Data Lake Store uses Azure Active Directory for authentication. Before authoring an application that works with Azure Data Lake Store or Azure Data Lake Analytics, you must first decide how you would like to authenticate your application with Azure Active Directory (Azure AD). The two main options available are:

* End-user authentication 
* Service-to-service authentication (this article) 

Both these options result in your application being provided with an OAuth 2.0 token, which gets attached to each request made to Azure Data Lake Store or Azure Data Lake Analytics.

This article talks about how create an **Azure AD web application for service-to-service authentication**. For instructions on Azure AD application configuration for end-user authentication see [End-user authentication with Data Lake Store using Azure Active Directory](data-lake-store-end-user-authenticate-using-active-directory.md).

## Prerequisites
* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

## Step 1: Create an Active Directory web application

Create and configure an Azure AD web application for service-to-service authentication with Azure Data Lake Store using Azure Active Directory. For instructions, see [Create an Azure AD application](../azure-resource-manager/resource-group-create-service-principal-portal.md).

While following the instructions at the above link, make sure you select **Web App / API** for application type, as shown in the screenshot below.

![Create web app](./media/data-lake-store-authenticate-using-active-directory/azure-active-directory-create-web-app.png "Create web app")

## Step 2: Get application id, authentication key, and tenant id
When programmatically logging in, you need the id for your application. If the application runs under its own credentials, you will also need an authentication key.

* For instructions on how to retrieve the application ID and authentication key (also called the client secret) for your application, see [Get application ID and authentication key](../azure-resource-manager/resource-group-create-service-principal-portal.md#get-application-id-and-authentication-key).

* For instructions on how to retrieve the tenant ID, see [Get tenant ID](../azure-resource-manager/resource-group-create-service-principal-portal.md#get-tenant-id).

## Step 3: Assign the Azure AD application to the Azure Data Lake Store account file or folder (only for service-to-service authentication)
1. Sign on to the new [Azure portal](https://portal.azure.com) and open the Azure Data Lake Store account that you want to associate with the Azure Active Directory application you created earlier.
2. In your Data Lake Store account blade, click **Data Explorer**.
   
    ![Create directories in Data Lake Store account](./media/data-lake-store-authenticate-using-active-directory/adl.start.data.explorer.png "Create directories in Data Lake account")
3. In the **Data Explorer** blade, click the file or folder for which you want to provide access to the Azure AD application, and then click **Access**. To configure access to a file, you must click **Access** from the **File Preview** blade.
   
    ![Set ACLs on Data Lake file system](./media/data-lake-store-authenticate-using-active-directory/adl.acl.1.png "Set ACLs on Data Lake file system")
4. The **Access** blade lists the standard access and custom access already assigned to the root. Click the **Add** icon to add custom-level ACLs.
   
    ![List standard and custom access](./media/data-lake-store-authenticate-using-active-directory/adl.acl.2.png "List standard and custom access")
5. Click the **Add** icon to open the **Add Custom Access** blade. In this blade, click **Select User or Group**, and then in **Select User or Group** blade, look for the Azure Active Directory application you created earlier. If you have a lot of groups to search from, use the text box at the top to filter on the group name. Click the group you want to add and then click **Select**.
   
    ![Add a group](./media/data-lake-store-authenticate-using-active-directory/adl.acl.3.png "Add a group")
6. Click **Select Permissions**, select the permissions and whether you want to assign the permissions as a default ACL, access ACL, or both. Click **OK**.
   
    ![Assign permissions to group](./media/data-lake-store-authenticate-using-active-directory/adl.acl.4.png "Assign permissions to group")
   
    For more information about permissions in Data Lake Store, and Default/Access ACLs, see [Access Control in Data Lake Store](data-lake-store-access-control.md).
7. In the **Add Custom Access** blade, click **OK**. The newly added group, with the associated permissions, will now be listed in the **Access** blade.
   
    ![Assign permissions to group](./media/data-lake-store-authenticate-using-active-directory/adl.acl.5.png "Assign permissions to group")

## Step 4: Get the OAuth 2.0 token endpoint (only for Java-based applications)

1. Sign on to the new [Azure portal](https://portal.azure.com) and click Active Directory from the left pane.

2. From the left pane, click **App registrations**.

3. From the top of the App registrations blade, click **Endpoints**.

	![OAuth token endpoint](./media/data-lake-store-authenticate-using-active-directory/oauth-token-endpoint.png "OAuth token endpoint")

4. From the list of endpoints, copy the OAuth 2.0 token endpoint.

	![OAuth token endpoint](./media/data-lake-store-authenticate-using-active-directory/oauth-token-endpoint-1.png "OAuth token endpoint")   

## Next steps
In this article you created an Azure AD web application and gathered the information you need in your client applications that you author using .NET SDK, Java SDK, etc. You can now proceed to the following articles that talk about how to use the Azure AD web application to first authenticate with Data Lake Store and then perform other operations on the store.

* [Get started with Azure Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)
* [Get started with Azure Data Lake Store using Java SDK](data-lake-store-get-started-java-sdk.md)

This article walked you through the basic steps needed to get a user principal up and running for your application. You can look at the following articles to get further information:
* [Use PowerShell to create service principal](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authenticate-service-principal)
* [Use certificate authentication for service principal authentication](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authenticate-service-principal#create-service-principal-with-certificate)
* [Other methods to authenticate to Azure AD](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-authentication-scenarios)


