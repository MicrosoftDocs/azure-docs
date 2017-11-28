---
title: How to use a Linux VM Managed Service Identity (MSI) to access Azure Data Lake Store
description: A tutorial that shows you how to use a Linux VM Managed Service Identity (MSI) to access Azure Data Lake Store.
services: active-directory
documentationcenter: 
author: skwan
manager: mbaldwin
editor: 

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/20/2017
ms.author: skwan
---

# Use a Linux VM Managed Service Identity (MSI) to access Azure Data Lake Store

[!INCLUDE[preview-notice](../../includes/active-directory-msi-preview-notice.md)]

This tutorial shows you how to use a Managed Service Identity (MSI) for a Linux virtual machine (VM) to access an Azure Data Lake Store. Managed Service Identities are automatically managed by Azure and enable you to authenticate to services that support Azure AD authentication, without needing to insert credentials into your code. You learn how to:

> [!div class="checklist"]
> * Enable MSI on a Linux VM 
> * Grant your VM access to an Azure Data Lake Store
> * Get an access token using the VM identity and use it to access an Azure Data Lake Store

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../includes/active-directory-msi-qs-configure-prereqs.md)]

[!INCLUDE [msi-tut-prereqs](../../includes/active-directory-msi-tut-prereqs.md)]

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a Linux Virtual Machine in a new Resource Group

For this tutorial, we create a new Linux VM. You can also enable MSI on an existing VM.

1. Click the **New** button found on the upper left-hand corner of the Azure portal.
2. Select **Compute**, and then select **Ubuntu Server 16.04 LTS**.
3. Enter the virtual machine information. For **Authentication type**, select **SSH public key** or **Password**. The created credentials allow you to log in to the VM.

   ![Alt image text](media/msi-tutorial-linux-vm-access-arm/msi-linux-vm.png)

4. Choose a **Subscription** for the virtual machine in the dropdown.
5. To select a new **Resource Group** you would like the virtual machine to be created in, choose **Create New**. When complete, click **OK**.
6. Select the size for the VM. To see more sizes, select **View all** or change the Supported disk type filter. On the settings blade, keep the defaults and click **OK**.

## Enable MSI on your VM

A Virtual Machine MSI enables you to get access tokens from Azure AD without you needing to put credentials into your code. Under the covers, enabling MSI does two things: it installs the MSI VM extension on your VM and it enables MSI in Azure Resource Manager.  

1. Select the **Virtual Machine** that you want to enable MSI on.
2. On the left navigation bar click **Configuration**.
3. You see **Managed Service Identity**. To register and enable the MSI, select **Yes**, if you wish to disable it, choose No.
4. Ensure you click **Save** to save the configuration.

   ![Alt image text](media/msi-tutorial-linux-vm-access-arm/msi-linux-extension.png)

5. If you wish to check which extensions are on this **Linux VM**, click **Extensions**. If MSI is enabled, the **ManagedIdentityExtensionforLinux** appears on the list.

   ![Alt image text](media/msi-tutorial-linux-vm-access-arm/msi-extension-value.png)

## Grant your VM access to Azure Data Lake Store

Now you can grant your VM access to files and folders in an Azure Data Lake Store.  For this step, you can use an existing Data Lake Store or create a new one.  To create a new Data Lake Store using the Azure portal, follow this [Azure Data Lake Store quickstart](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-get-started-portal). There are also quickstarts that use the Azure CLI and Azure PowerShell in the [Azure Data Lake Store documentation](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-overview).

In your Data Lake Store, create a new folder and grant your VM MSI permission to read, write, and execute files in that folder:

1. In the Azure portal, click **Data Lake Store** in the left-hand navigation.
2. Click the Data Lake Store you want to use for this tutorial.
3. Click **Data Explorer** in the command bar.
4. The root folder of the Data Lake Store is selected.  Click **Access** in the command bar.
5. Click **Add**.  In the **Select** field, enter the name of your VM, for example **DevTestVM**.  Click to select your VM from the search results, then click **Select**.
6. Click **Select Permissions**.  Select **Read** and **Execute**, add to **This folder**, and add as **An access permission only**.  Click **Ok**.  The permission should be added successfully.
7. Close the **Access** blade.
8. For this tutorial, create a new folder.  Click **New Folder** in the command bar, and give the new folder a name, for example **TestFolder**.  Click **Ok**.
9. Click on the folder you created, then click **Access** in the command bar.
10. Similar to step 5, click **Add**, in the **Select** field enter the name of your VM, select it and click **Select**.
11. Similar to step 6, click **Select Permissions**, select **Read**, **Write**, and **Execute**, add to **This folder**, and add as **An access permission entry and a default permission entry**.  Click **Ok**.  The permission should be added successfully.

Your VM MSI can now perform all operations on files in the folder you created.  For more information on managing access to Data Lake Store, read this article on [Access Control in Data Lake Store](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-access-control).

## Get an access token using the VM MSI and use it to call the Azure Data Lake Store filesystem

Azure Data Lake Store natively supports Azure AD authentication, so it can directly accept access tokens obtained using MSI.  To authenticate to the Data Lake Store filesystem you send an access token issued by Azure AD to your Data Lake Store filesystem endpoint, in an Authorization header in the format "Bearer \<ACCESS_TOKEN_VALUE\>".  To learn more about Data Lake Store support for Azure AD authentication, read [Authentication with Data Lake Store using Azure Active Directory](https://docs.microsoft.com/azure/data-lake-store/data-lakes-store-authentication-using-azure-active-directory)

In this tutorial, you authenticate to the Data Lake Store filesystem REST API using CURL to make REST requests.

> [!NOTE]
> The Data Lake Store filesystem client SDKs do not yet support Managed Service Identity.  This tutorial will be updated when support is added to the SDK.

To complete these steps, you need an SSH client. If you are using Windows, you can use the SSH client in the [Windows Subsystem for Linux](https://msdn.microsoft.com/commandline/wsl/about). If you need assistance configuring your SSH client's keys, see [How to Use SSH keys with Windows on Azure](../virtual-machines/linux/ssh-from-windows.md), or [How to create and use an SSH public and private key pair for Linux VMs in Azure](../virtual-machines/linux/mac-create-ssh-keys.md).

1. In the portal, navigate to your Linux VM and in the **Overview**, click **Connect**.  
2. **Connect** to the VM with the SSH client of your choice. 
3. In the terminal window, using CURL, make a request to the local MSI endpoint to get an access token for the Data Lake Store filesystem.  The resource identifier for Data Lake Store is "https://datalake.azure.net/."  It is important to include the trailing slash in the resource identifier.
    
   ```bash
   curl http://localhost:50342/oauth2/token --data "resource=https://datalake.azure.net/" -H Metadata:true   
   ```
    
   A successful response returns the access token you use to authenticate to Data Lake Store:

   ```bash
   {"access_token":"eyJ0eXAiOiJ...",
    "refresh_token":"",
    "expires_in":"3599",
    "expires_on":"1508119757",
    "not_before":"1508115857",
    "resource":"https://datalake.azure.net/",
    "token_type":"Bearer"}
   ```

4. Using CURL, make a request to your Data Lake Store filesystem REST endpoint to list the folders in the root folder.  This is a simple way to check everything is configured correctly.  Copy the value of the access token from the previous step.  It is important the string "Bearer" in the Authorization header has a capital "B".  You can find the name of your Data Lake Store in the **Overview** section of the Data Lake Store blade in the Azure portal.

   ```bash
   curl https://<YOUR_ADLS_NAME>.azuredatalakestore.net/webhdfs/v1/?op=LISTSTATUS -H "Authorization: Bearer <ACCESS_TOKEN>"
   ```
    
   A successful response looks like:

   ```bash
   {"FileStatuses":{"FileStatus":[{"length":0,"pathSuffix":"TestFolder","type":"DIRECTORY","blockSize":0,"accessTime":1507934941392,"modificationTime":1508105430590,"replication":0,"permission":"770","owner":"bd0e76d8-ad45-4fe1-8941-04a7bf27f071","group":"bd0e76d8-ad45-4fe1-8941-04a7bf27f071"}]}}
   ```

5. Now you can try uploading a file to your Data Lake Store.  First, create a file to upload.

   ```bash
   echo "Test file." > Test1.txt
   ```

6. Using CURL, make a request to your Data Lake Store filesystem REST endpoint to upload the file to the folder you created earlier.  The upload involves a redirect, and CURL follows the redirect automatically. 

   ```bash
   curl -i -X PUT -L -T Test1.txt -H "Authorization: Bearer <ACCESS_TOKEN>" 'https://<YOUR_ADLS_NAME>.azuredatalakestore.net/webhdfs/v1/<FOLDER_NAME>/Test1.txt?op=CREATE' 
   ```

    A successful response looks like:

   ```bash
   HTTP/1.1 100 Continue
   HTTP/1.1 307 Temporary Redirect
   Cache-Control: no-cache, no-cache, no-store, max-age=0
   Pragma: no-cache
   Expires: -1
   Location: https://mytestadls.azuredatalakestore.net/webhdfs/v1/TestFolder/Test1.txt?op=CREATE&write=true
   x-ms-request-id: 756f6b24-0cca-47ef-aa12-52c3b45b954c
   ContentLength: 0
   x-ms-webhdfs-version: 17.04.22.00
   Status: 0x0
   X-Content-Type-Options: nosniff
   Strict-Transport-Security: max-age=15724800; includeSubDomains
   Date: Sun, 15 Oct 2017 22:10:30 GMT
   Content-Length: 0
       
   HTTP/1.1 100 Continue
       
   HTTP/1.1 201 Created
   Cache-Control: no-cache, no-cache, no-store, max-age=0
   Pragma: no-cache
   Expires: -1
   Location: https://mytestadls.azuredatalakestore.net/webhdfs/v1/TestFolder/Test1.txt?op=CREATE&write=true
   x-ms-request-id: af5baa07-3c79-43af-a01a-71d63d53e6c4
   ContentLength: 0
   x-ms-webhdfs-version: 17.04.22.00
   Status: 0x0
   X-Content-Type-Options: nosniff
   Strict-Transport-Security: max-age=15724800; includeSubDomains
   Date: Sun, 15 Oct 2017 22:10:30 GMT
   Content-Length: 0
   ```

Using other Data Lake Store filesystem APIs you can append to files, download files, and more.

Congratulations!  You've authenticated to the Data Lake Store filesystem using a VM MSI.

## Related content

- For an overview of MSI, see [Managed Service Identity overview](../active-directory/msi-overview.md).
- For management operations Data Lake Store uses Azure Resource Manager.  For more information on using a VM MSI to authenticate to Resource Manager, read [Use a Linux VM Managed Service Identity (MSI) to access Resource Manager](https://docs.microsoft.com/azure/active-directory/msi-tutorial-linux-vm-access-arm).
- Learn more about [Authentication with Data Lake Store using Azure Active Directory](https://docs.microsoft.com/azure/data-lake-store/data-lakes-store-authentication-using-azure-active-directory).
- Learn more about [Filesystem operations on Azure Data Lake Store using REST API](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-data-operations-rest-api) or the [WebHDFS FileSystem APIs](https://docs.microsoft.com/rest/api/datalakestore/webhdfs-filesystem-apis).
- Learn more about [Access Control in Data Lake Store](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-access-control).

Use the following comments section to provide feedback and help us refine and shape our content.