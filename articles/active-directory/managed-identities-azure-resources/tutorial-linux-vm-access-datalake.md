---
title: Tutorial`:` Use a managed identity to access Azure Data Lake Store - Linux
description: A tutorial that shows you how to use a Linux VM system-assigned managed identity to access Azure Data Lake Store.
services: active-directory
documentationcenter: 
author: barclayn
manager: amycolannino
editor: 

ms.service: active-directory
ms.subservice: msi
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/25/2023
ms.author: barclayn
ms.collection: M365-identity-device-management
---

# Tutorial: Use a Linux VM system-assigned managed identity to access Azure Data Lake Store

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

This tutorial shows you how to use a system-assigned managed identity for a Linux virtual machine (VM) to access Azure Data Lake Store. You learn how to: 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Grant your VM access to Azure Data Lake Store.
> * Get an access token by using the VM's system-assigned managed identity to access Azure Data Lake Store.

## Prerequisites

[!INCLUDE [msi-tut-prereqs](../../../includes/active-directory-msi-tut-prereqs.md)]

## Grant access

This section shows how to grant your VM access to files and folders in Azure Data Lake Store. For this step, you can use an existing Data Lake Store instance or create a new one. To create a Data Lake Store instance by using the Azure portal, follow the [Azure Data Lake Store quickstart](/azure/data-lake-store/data-lake-store-get-started-portal). There are also quickstarts that use Azure CLI and Azure PowerShell in the [Azure Data Lake Store documentation](/azure/data-lake-store/data-lake-store-overview).

In Data Lake Store, create a new folder and grant our Linux VM system-assigned managed identity permission to read, write, and execute files in that folder:

1. In the Azure portal, select **Data Lake Store** in the left pane.
2. Select the Data Lake Store instance that you want to use.
3. Select **Data Explorer** on the command bar.
4. The root folder of the Data Lake Store instance is selected. Select **Access** on the command bar.
5. Select **Add**.  In the **Select** box, enter the name of your VM--for example, **DevTestVM**. Select your VM from the search results, and then select **Select**.
6. Select **Select Permissions**.  Select **Read** and **Execute**, add to **This folder**, and add as **An access permission only**. Select **Ok**.  The permission should be added successfully.
7. Close the **Access** pane.
8. For this tutorial, create a new folder. Select **New Folder** on the command bar, and give the new folder a name--for example **TestFolder**.  Select **Ok**.
9. Select the folder that you created, and then select **Access** on the command bar.
10. Similar to step 5, select **Add**. In the **Select** box, enter the name of your VM. Select your VM from the search results, and then select **Select**.
11. Similar to step 6, select **Select Permissions**. Select **Read**, **Write**, and **Execute**, add to **This folder**, and add as **An access permission entry and a default permission entry**. Select **Ok**.  The permission should be added successfully.

Managed identities for Azure resources can now perform all operations on files in the folder that you created. For more information on managing access to Data Lake Store, see [Access Control in Data Lake Store](/azure/data-lake-store/data-lake-store-access-control).

## Get an access token 

This section shows how to obtain an access token and call the Data Lake Store file system. Azure Data Lake Store natively supports Microsoft Entra authentication, so it can directly accept access tokens obtained via using managed identities for Azure resources. To authenticate to the Data Lake Store file system, you send an access token issued by Microsoft Entra ID to your Data Lake Store file system endpoint. The access token is in an authorization header in the format "Bearer \<ACCESS_TOKEN_VALUE\>".  To learn more about Data Lake Store support for Microsoft Entra authentication, see [Authentication with Data Lake Store using Microsoft Entra ID](/azure/data-lake-store/data-lakes-store-authentication-using-azure-active-directory).

In this tutorial, you authenticate to the REST API for the Data Lake Store file system by using cURL to make REST requests.

> [!NOTE]
> The client SDKs for the Data Lake Store file system do not yet support managed identities for Azure resources.

To complete these steps, you need an SSH client. If you are using Windows, you can use the SSH client in the [Windows Subsystem for Linux](/windows/wsl/about). If you need assistance configuring your SSH client's keys, see [How to use SSH keys with Windows on Azure](/azure/virtual-machines/linux/ssh-from-windows) or [How to create and use an SSH public and private key pair for Linux VMs in Azure](/azure/virtual-machines/linux/mac-create-ssh-keys).

1. In the portal, browse to your Linux VM. In **Overview**, select **Connect**.  
2. Connect to the VM by using the SSH client of your choice. 
3. In the terminal window, by using cURL, make a request to the local managed identities Azure for Azure resources endpoint to get an access token for the Data Lake Store file system. The resource identifier for Data Lake Store is `https://datalake.azure.net/`.  It's important to include the trailing slash in the resource identifier.
    
   ```bash
   curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fdatalake.azure.net%2F' -H Metadata:true   
   ```
    
   A successful response returns the access token that you use to authenticate to Data Lake Store:

   ```bash
   {"access_token":"eyJ0eXAiOiJ...",
    "refresh_token":"",
    "expires_in":"3599",
    "expires_on":"1508119757",
    "not_before":"1508115857",
    "resource":"https://datalake.azure.net/",
    "token_type":"Bearer"}
   ```

4. By using cURL, make a request to your Data Lake Store file system's REST endpoint to list the folders in the root folder. This is a simple way to check that everything is configured correctly. Copy the value of the access token from the previous step. It's important that the string "Bearer" in the Authorization header has a capital "B." You can find the name of your Data Lake Store instance in the **Overview** section of the **Data Lake Store** pane in the Azure portal.

   ```bash
   curl https://<YOUR_ADLS_NAME>.azuredatalakestore.net/webhdfs/v1/?op=LISTSTATUS -H "Authorization: Bearer <ACCESS_TOKEN>"
   ```
    
   A successful response looks like this:

   ```bash
   {"FileStatuses":{"FileStatus":[{"length":0,"pathSuffix":"TestFolder","type":"DIRECTORY","blockSize":0,"accessTime":1507934941392,"modificationTime":1508105430590,"replication":0,"permission":"770","owner":"bd0e76d8-ad45-4fe1-8941-04a7bf27f071","group":"bd0e76d8-ad45-4fe1-8941-04a7bf27f071"}]}}
   ```

5. Now you can try uploading a file to your Data Lake Store instance. First, create a file to upload.

   ```bash
   echo "Test file." > Test1.txt
   ```

6. By using cURL, make a request to your Data Lake Store file system's REST endpoint to upload the file to the folder that you created earlier. The upload involves a redirect, and cURL follows the redirect automatically. 

   ```bash
   curl -i -X PUT -L -T Test1.txt -H "Authorization: Bearer <ACCESS_TOKEN>" 'https://<YOUR_ADLS_NAME>.azuredatalakestore.net/webhdfs/v1/<FOLDER_NAME>/Test1.txt?op=CREATE' 
   ```

    A successful response looks like this:

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

By using other APIs for the Data Lake Store file system, you can append to files, download files, and more.

## Next steps

In this tutorial, you learned how to use a Linux VM system-assigned managed identity to access an Azure Data Lake Store. To learn more about Azure Data Lake Store see:

> [!div class="nextstepaction"]
>[Azure Data Lake Store](/azure/data-lake-store/data-lake-store-overview)
