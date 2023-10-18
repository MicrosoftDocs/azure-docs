---
title: Tutorial`:` Use a managed identity to access Azure Storage via access key - Linux
description: A tutorial that walks you through the process of using a Linux VM system-assigned managed identity to access Azure Storage via an access key.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: daveba
ms.custom: subject-rbac-steps, devx-track-arm-template
ms.service: active-directory
ms.subservice: msi
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/11/2022
ms.author: barclayn
ms.collection: M365-identity-device-management
---


# Tutorial: Use a Linux VM system-assigned managed identity to access Azure Storage via access key

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

This tutorial shows you how to use a system-assigned managed identity for a Linux virtual machine (VM) to retrieve storage account access keys. You can use a storage access key as usual when doing storage operations, for example when using the Storage SDK. For this tutorial, we upload and download blobs using Azure CLI. You will learn how to:

> [!div class="checklist"]
> * Grant your VM access to storage account access keys in Resource Manager 
> * Get an access token using your VM's identity, and use it to retrieve the storage access keys from Resource Manager  

## Prerequisites

[!INCLUDE [msi-tut-prereqs](../../../includes/active-directory-msi-tut-prereqs.md)]

## Create a storage account 

If you don't already have one, you will now create a storage account.  You can also skip this step and grant your VM system-assigned managed identity access to the keys of an existing storage account. 

1. Click the **+/Create new service** button found on the upper left-hand corner of the Azure portal.
2. Click **Storage**, then **Storage Account**, and a new "Create storage account" panel will display.
3. Enter a **Name** for the storage account, which you will use later.  
4. **Deployment model** and **Account kind** should be set to "Resource Manager" and "General purpose", respectively. 
5. Ensure the **Subscription** and **Resource Group** match the ones you specified when you created your VM in the previous step.
6. Click **Create**.

    ![Create new storage account](./media/msi-tutorial-linux-vm-access-storage/msi-storage-create.png)

## Create a blob container in the storage account

Later we will upload and download a file to the new storage account. Because files require blob storage, we need to create a blob container in which to store the file.

1. Navigate back to your newly created storage account.
2. Click the **Containers** link in the left, under "Blob service."
3. Click **+ Container** on the top of the page, and a "New container" panel slides out.
4. Give the container a name, select an access level, then click **OK**. The name you specified will be used later in the tutorial. 

    ![Create storage container](./media/msi-tutorial-linux-vm-access-storage/create-blob-container.png)

## Grant your VM's system-assigned managed identity access to use storage account access keys

Azure Storage does not natively support Microsoft Entra authentication.  However, you can use your VM's system-assigned managed identity to retrieve a storage SAS from Resource Manager, then use the SAS to access storage.  In this step, you grant your VM's system-assigned managed identity access to your storage account SAS. Grant access by assigning the [Storage Account Contributor](/azure/role-based-access-control/built-in-roles#storage-account-contributor) role to the managed-identity at the scope of the resource group that contains your storage account.
 
For detailed steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

>[!NOTE]
> For more information on the various roles that you can use to grant permissions to storage review [Authorize access to blobs and queues using Microsoft Entra ID.](/azure/storage/blobs/authorize-access-azure-active-directory#assign-azure-roles-for-access-rights)


## Get an access token using the VM's identity and use it to call Azure Resource Manager

For the remainder of the tutorial, we will work from the VM we created earlier.

To complete these steps, you will need an SSH client. If you are using Windows, you can use the SSH client in the [Windows Subsystem for Linux](/windows/wsl/install-win10). If you need assistance configuring your SSH client's keys, see [How to Use SSH keys with Windows on Azure](/azure/virtual-machines/linux/ssh-from-windows), or [How to create and use an SSH public and private key pair for Linux VMs in Azure](/azure/virtual-machines/linux/mac-create-ssh-keys).

1. In the Azure portal, navigate to **Virtual Machines**, go to your Linux virtual machine, then from the **Overview** page click **Connect** at the top. Copy the string to connect to your VM. 
2. Connect to your VM using your SSH client.  
3. Next, you will be prompted to enter in your **Password** you added when creating the **Linux VM**. You should then be successfully signed in.  
4. Use CURL to get an access token for Azure Resource Manager.  

    The CURL request and response for the access token is below:
    
    ```bash
    curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com%2F' -H Metadata:true
    ```
    
    > [!NOTE]
    > In the previous request, the value of the "resource" parameter must be an exact match for what is expected by Microsoft Entra ID. When using the Azure Resource Manager resource ID, you must include the trailing slash on the URI.
    > In the following response, the access_token element as been shortened for brevity.
    
    ```json
    {
      "access_token": "eyJ0eXAiOiJ...",
      "refresh_token": "",
      "expires_in": "3599",
      "expires_on": "1504130527",
      "not_before": "1504126627",
      "resource": "https://management.azure.com",
      "token_type": "Bearer"
    }
    ```

## Get storage account access keys from Azure Resource Manager to make storage calls  

Now use CURL to call Resource Manager using the access token we retrieved in the previous section, to retrieve the storage access key. Once we have the storage access key, we can call storage upload/download operations. Be sure to replace the `<SUBSCRIPTION ID>`, `<RESOURCE GROUP>`, and `<STORAGE ACCOUNT NAME>` parameter values with your own values. Replace the `<ACCESS TOKEN>` value with the access token you retrieved earlier:

```bash 
curl https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE ACCOUNT NAME>/listKeys?api-version=2016-12-01 --request POST -d "" -H "Authorization: Bearer <ACCESS TOKEN>" 
```

> [!NOTE]
> The text in the prior URL is case sensitive, so ensure if you are using upper-lowercase for your Resource Groups to reflect it accordingly. Additionally, it’s important to know that this is a POST request not a GET request and ensure you pass a value to capture a length limit with -d that can be NULL.  

The CURL response gives you the list of Keys:  

```bash 
{"keys":[{"keyName":"key1","permissions":"Full","value":"iqDPNt..."},{"keyName":"key2","permissions":"Full","value":"U+uI0B..."}]} 
```

Create a sample blob file to upload to your blob storage container. On a Linux VM, you can do this with the following command. 

```bash
echo "This is a test file." > test.txt
```

Next, authenticate with the CLI `az storage` command using the storage access key, and upload the file to the blob container. For this step, you will need to [install the latest Azure CLI](/cli/azure/install-azure-cli) on your VM, if you haven't already.
 

```azurecli
az storage blob upload -c <CONTAINER NAME> -n test.txt -f test.txt --account-name <STORAGE ACCOUNT NAME> --account-key <STORAGE ACCOUNT KEY>
```

Response: 

```JSON
Finished[#############################################################]  100.0000%
{
  "etag": "\"0x8D4F9929765C139\"",
  "lastModified": "2017-09-12T03:58:56+00:00"
}
```

Additionally, you can download the file using the Azure CLI and authenticating with the storage access key. 

Request: 

```azurecli
az storage blob download -c <CONTAINER NAME> -n test.txt -f test-download.txt --account-name <STORAGE ACCOUNT NAME> --account-key <STORAGE ACCOUNT KEY>
```

Response: 

```JSON
{
  "content": null,
  "metadata": {},
  "name": "test.txt",
  "properties": {
    "appendBlobCommittedBlockCount": null,
    "blobType": "BlockBlob",
    "contentLength": 21,
    "contentRange": "bytes 0-20/21",
    "contentSettings": {
      "cacheControl": null,
      "contentDisposition": null,
      "contentEncoding": null,
      "contentLanguage": null,
      "contentMd5": "LSghAvpnElYyfUdn7CO8aw==",
      "contentType": "text/plain"
    },
    "copy": {
      "completionTime": null,
      "id": null,
      "progress": null,
      "source": null,
      "status": null,
      "statusDescription": null
    },
    "etag": "\"0x8D5067F30D0C283\"",
    "lastModified": "2017-09-28T14:42:49+00:00",
    "lease": {
      "duration": null,
      "state": "available",
      "status": "unlocked"
    },
    "pageBlobSequenceNumber": null,
    "serverEncrypted": false
  },
  "snapshot": null
}
```

## Next steps

In this tutorial, you learned how to use a Linux VM system-assigned managed identity to access Azure Storage using an access key.  To learn more about Azure Storage access keys see:

> [!div class="nextstepaction"]
>[Manage your storage access keys](/azure/storage/common/storage-account-create)
