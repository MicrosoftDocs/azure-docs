---
title: Tutorial`:` Use a managed identity to access Azure Storage - Linux
description: A tutorial that walks you through the process of using a Linux VM system-assigned managed identity to access Azure Storage.
services: active-directory
documentationcenter: 
author: barclayn
manager: amycolannino
editor: 
ms.custom: subject-rbac-steps
ms.service: active-directory
ms.subservice: msi
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/30/2023
ms.author: barclayn

ms.collection: M365-identity-device-management
---
# Tutorial: Use a Linux VM system-assigned managed identity to access Azure Storage 

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

This tutorial shows you how to use a system-assigned managed identity for a Linux virtual machine (VM) to access Azure Storage. You learn how to:

> [!div class="checklist"]
> * Create a storage account
> * Create a blob container in a storage account
> * Grant the Linux VM's Managed Identity access to an Azure Storage container
> * Get an access token and use it to call Azure Storage

## Prerequisites

[!INCLUDE [msi-tut-prereqs](../../../includes/active-directory-msi-tut-prereqs.md)]

To run the CLI script examples in this tutorial, you have two options:

- Use [Azure Cloud Shell](~/articles/cloud-shell/overview.md) either from the Azure portal, or via the **Try It** button, located in the top-right corner of each code block.
- [Install the latest version of CLI 2.0](/cli/azure/install-azure-cli) (2.0.23 or later) if you prefer to use a local CLI console.

## Create a storage account 

In this section, you create a storage account. 

1. Select the **+ Create a resource** button found on the upper left-hand corner of the Azure portal.
2. Select **Storage**, then **Storage account - blob, file, table, queue**.
3. Under **Name**, enter a name for the storage account.  
4. **Deployment model** and **Account kind** should be set to **Resource manager** and **Storage (general purpose v1)**. 
5. Ensure the **Subscription** and **Resource Group** match the ones you specified when you created your VM in the previous step.
6. Select **Create**.

    ![Create new storage account](./media/msi-tutorial-linux-vm-access-storage/msi-storage-create.png)

## Create a blob container and upload a file to the storage account

Files require blob storage so you need to create a blob container in which to store the file. You then upload  a file to the blob container in the new storage account.

1. Navigate back to your newly created storage account.
2. Under **Blob Service**, select **Containers**.
3. Select **+ Container** on the top of the page.
4. Under **New container**, enter a name for the container and under **Public access level** keep the default value.

    ![Create storage container](./media/msi-tutorial-linux-vm-access-storage/create-blob-container.png)

5. Using an editor of your choice, create a file titled *hello world.txt* on your local machine.  Open the file and add the text (without the quotes) "Hello world! :)" and then save it. 

6. Upload the file to the newly created container by clicking on the container name, then **Upload**
7. In the **Upload blob** pane, under **Files**, select the folder icon and browse to the file **hello_world.txt** on your local machine, select the file, then select **Upload**.

    ![Upload text file](./media/msi-tutorial-linux-vm-access-storage/upload-text-file.png)

## Grant your VM access to an Azure Storage container 

You can use the VM's managed identity to retrieve the data in the Azure storage blob. Managed identities for Azure resources, can be used to authenticate to resources that support Microsoft Entra authentication.  Grant access by assigning the [storage-blob-data-reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader) role to the managed-identity at the scope of the resource group that contains your storage account.
 
For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

>[!NOTE]
> For more information on the various roles that you can use to grant permissions to storage review [Authorize access to blobs and queues using Microsoft Entra ID](../../storage/blobs/authorize-access-azure-active-directory.md#assign-azure-roles-for-access-rights)
## Get an access token and use it to call Azure Storage

Azure Storage natively supports Microsoft Entra authentication, so it can directly accept access tokens obtained using a Managed Identity. This is part of Azure Storage's integration with Microsoft Entra ID, and is different from supplying credentials on the connection string.

To complete the following steps, you need to work from the VM created earlier and you need an SSH client to connect to it. If you are using Windows, you can use the SSH client in the [Windows Subsystem for Linux](/windows/wsl/about). If you need assistance configuring your SSH client's keys, see [How to Use SSH keys with Windows on Azure](~/articles/virtual-machines/linux/ssh-from-windows.md), or [How to create and use an SSH public and private key pair for Linux VMs in Azure](~/articles/virtual-machines/linux/mac-create-ssh-keys.md).

1. In the Azure portal, navigate to **Virtual Machines**, go to your Linux virtual machine, then from the **Overview** page select **Connect**. Copy the string to connect to your VM.
2. **Connect** to the VM with the SSH client of your choice. 
3. In the terminal window, use CURL to make a request to the local Managed Identity endpoint to get an access token for Azure Storage.
    
    ```bash
    curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fstorage.azure.com%2F' -H Metadata:true
    ```
4. Now use the access token to access Azure Storage, for example to read the contents of the sample file which you previously uploaded to the container. Replace the values of `<STORAGE ACCOUNT>`, `<CONTAINER NAME>`, and `<FILE NAME>` with the values you specified earlier, and `<ACCESS TOKEN>` with the token returned in the previous step.

   ```bash
   curl https://<STORAGE ACCOUNT>.blob.core.windows.net/<CONTAINER NAME>/<FILE NAME> -H "x-ms-version: 2017-11-09" -H "Authorization: Bearer <ACCESS TOKEN>"
   ```

   The response contains the contents of the file:

   ```bash
   Hello world! :)
   ```

Alternatively, you could also store the token in a variable and pass it to the second command as shown:

```bash
# Run the first curl command and capture its output in a variable
access_token=$(curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fstorage.azure.com%2F' -H Metadata:true | jq -r '.access_token')

# Run the second curl command with the access token
curl "https://<STORAGE ACCOUNT>.blob.core.windows.net/<CONTAINER NAME>/<FILE NAME>" \
  -H "x-ms-version: 2017-11-09" \
  -H "Authorization: Bearer $access_token"

```


## Next steps

In this tutorial, you learned how enable a Linux VM system-assigned managed identity to access Azure Storage.  To learn more about Azure Storage see:

> [!div class="nextstepaction"]
> [Azure Storage](../../storage/common/storage-introduction.md)
