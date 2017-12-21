---
title: Use a user assigned MSI on a Linux VM to access Azure Storage
description: A tutorial that walks you through the process of using a User Assigned Managed Service Identity (MSI) on a Linux VM to access Azure Storage.
services: active-directory
documentationcenter: ''
author: bryanLa
manager: mtillman
editor: arluca

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/15/2017
ms.author: bryanla
ROBOTS: NOINDEX,NOFOLLOW
---


# Use a user-assigned Managed Service Identity (MSI) on a Linux VM to access Azure Storage

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

This tutorial shows you how to create and use a user-assigned Managed Service Identity (MSI) from a Linux Virtual Machine, then use it to retrieve storage account access keys. You can use a storage access key as usual when doing storage operations, for example when using the Storage SDK. For this tutorial, we upload and download blobs using Azure CLI. You will learn how to:

> [!div class="checklist"]
> * Create a User Assigned Managed Service Identity (MSI)
> * Assign the user-assigned MSI to a Linux Virtual Machine
> * Grant the MSI access to an Azure Storage instance
> * Get an access token using the user-assigned MSI identity, and use it to access Azure Storage

## Prerequisites

[!INCLUDE [msi-core-prereqs](~/includes/active-directory-msi-core-prereqs-ua.md)]

[!INCLUDE [msi-tut-prereqs](~/includes/active-directory-msi-tut-prereqs.md)]

To run the CLI script examples in this tutorial, you have two options:

- Use [Azure Cloud Shell](~/articles/cloud-shell/overview.md) either from the Azure portal, or via the "Try It" button, located in the top right corner of each code block (see next section).
- [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.23 or later) if you prefer to use a local CLI console.

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a Linux virtual machine in a new resource group

For this tutorial, we create a new Linux VM. You can also enable MSI on an existing VM.

1. Click the **+/Create new service** button found on the upper left-hand corner of the Azure portal.
2. Select **Compute**, and then select **Ubuntu Server 16.04 LTS**.
3. Enter the virtual machine information. For **Authentication type**, select **SSH public key** or **Password**. The created credentials allow you to log in to the VM.

    ![Alt image text](~/articles/active-directory/media/msi-tutorial-linux-vm-access-arm/msi-linux-vm.png)

4. Choose a **Subscription** for the virtual machine in the dropdown.
5. To select a new **Resource Group** you would like the virtual machine to be created in, choose **Create New**. When complete, click **OK**.
6. Select the size for the VM. To see more sizes, select **View all** or change the Supported disk type filter. On the settings blade, keep the defaults and click **OK**.

## Create a user-assigned MSI

1. If you are using the CLI console (instead of an Azure Cloud Shell session), start by signing in to Azure. Use an account that is associated with the Azure subscription under which you would like to create the new MSI:

    ```azurecli
    az login
    ```

2. Create a user-assigned MSI using [az identity create](/cli/azure/identity#az_identity_create). The `-g` parameter specifies the resource group where the MSI is created, and the `-n` parameter specifies its name. Be sure to replace the `<RESOURCE GROUP>` and `<MSI NAME>` parameter values with your own values:

    ```azurecli-interactive
    az identity create -g <RESOURCE GROUP> -n <MSI NAME>
    ```

    The response contains details for the user-assigned MSI created, similar to the following example. Note the `id` value for your MSI, as it will be used in the next step:

    ```json
    {
    "clientId": "73444643-8088-4d70-9532-c3a0fdc190fz",
    "clientSecretUrl": "https://control-westcentralus.identity.azure.net/subscriptions/<SUBSCRIPTON ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<MSI NAME>/credentials?tid=5678&oid=9012&aid=123444643-8088-4d70-9532-c3a0fdc190fz",
    "id": "/subscriptions/<SUBSCRIPTON ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<MSI NAME>",
    "location": "westcentralus",
    "name": "<MSI NAME>",
    "principalId": "9012",
    "resourceGroup": "<RESOURCE GROUP>",
    "tags": {},
    "tenantId": "733a8f0e-ec41-4e69-8ad8-971fc4b533bl",
    "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
    }
    ```

## Assign your user-assigned MSI to your Linux VM

Unlike a system-assigned MSI, a user-assigned MSI can be used by clients on multiple Azure resources. For this tutorial, you assign it to a single VM. You can also assign it to more than one VM.

Assign the user-assigned MSI to your Linux VM using [az vm assign-identity](/cli/azure/vm#az_vm_assign_identity). Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. Use the `id` property returned in the previous step for the `--identities` parameter value:

```azurecli-interactive
az vm assign-identity -g <RESOURCE GROUP> -n <VM NAME> -–identities "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<MSI NAME>"
```

## Create a storage account 

If you don't already have one, you will now create a storage account.  You can also skip this step and grant your VM MSI access to the keys of an existing storage account. 

1. Click the **+/Create new service** button found on the upper left-hand corner of the Azure portal.
2. Click **Storage**, then **Storage Account**, and a new "Create storage account" panel will display.
3. Enter a **Name** for the storage account, which you will use later.  
4. **Deployment model** and **Account kind** should be set to "Resource manager" and "General purpose", respectively. 
5. Ensure the **Subscription** and **Resource Group** match the ones you specified when you created your VM in the previous step.
6. Click **Create**.

    ![Create new storage account](~/articles/active-directory/media/msi-tutorial-linux-vm-access-storage/msi-storage-create.png)

## Create a blob container in the storage account

Later we will upload and download a file to the new storage account. Because files require blob storage, we need to create a blob container in which to store the file.

1. Navigate back to your newly created storage account.
2. Click the **Containers** link in the left, under "Blob service."
3. Click **+ Container** on the top of the page, and a "New container" panel slides out.
4. Give the container a name, select an access level, then click **OK**. The name you specified will be used later in the tutorial. 

    ![Create storage container](~/articles/active-directory/media/msi-tutorial-linux-vm-access-storage/create-blob-container.png)

## Grant your User Assigned MSI access to an Azure Storage container

By using an MSI, your code can get access tokens to authenticate to resources that support Azure AD authentication. In our tutorial, we will be using Azure Storage.

First you grant the MSI identity access to an Azure Storage container. In this case, we use the container we created above. Update the values for `<MSI CLIENTID>`, `<SUBSCRIPTION ID>`, `<RESOURCE GROUP>`, `<STORAGE ACCOUNT NAME>`, and `<CONTAINER NAME>` as appropriate for your environment. Replace `<CLIENT ID>` with the `clientId` property returned by the `az identity create` command in [Create a user-assigned MSI](#create-a-user-assigned-msi):

  ```azurecli-interactive
  az role assignment create --assignee <MSI CLIENTID> --role ‘Reader’ --scope "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE ACCOUNT NAME>/blobServices/default/<CONTAINER NAME>"
  ```
The response includes the details for the role assignment created.

  ```
    {
  "id": "/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Authorization/roleAssignments/b402bd74-157f-425c-bf7d-zed3a3a581ll",
  "name": "b402bd74-157f-425c-bf7d-zed3a3a581ll",
  "properties": {
    "principalId": "f5fdfdc1-ed84-4d48-8551-999fb9dedfbl",
    "roleDefinitionId": "/subscriptions/<SUBSCRIPTION ID>/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7",
    "scope": "/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.storage/storageAccounts/<STORAGE ACCOUNT NAME>/blogServices/default/<CONTAINER NAME>"
  },
  "resourceGroup": "<RESOURCE GROUP>",
  "type": "Microsoft.Authorization/roleAssignments"
  }
  ```

## Get an access token using the VM's identity and use it to call Azure Storage

For the remainder of the tutorial, we will work from the VM we created earlier.

To complete these steps, you need an SSH client. If you are using Windows, you can use the SSH client in the [Windows Subsystem for Linux](https://msdn.microsoft.com/commandline/wsl/about). If you need assistance configuring your SSH client's keys, see [How to Use SSH keys with Windows on Azure](~/articles/virtual-machines/linux/ssh-from-windows.md), or [How to create and use an SSH public and private key pair for Linux VMs in Azure](~/articles/virtual-machines/linux/mac-create-ssh-keys.md).

1. In the Azure portal, navigate to **Virtual Machines**, go to your Linux virtual machine, then from the **Overview** page click **Connect** at the top. Copy the string to connect to your VM.
2. **Connect** to the VM with the SSH client of your choice. 
3. In the terminal window, using CURL, make a request to the local MSI endpoint to get an access token for Azure Storage.

   The CURL request to acquire an access token is shown in the following example. Be sure to replace `<CLIENT ID>` with the `clientId` property returned by the `az identity create` command in [Create a user-assigned MSI](#create-a-user-assigned-msi):

   ```bash
   curl -H Metadata:true "http://localhost:50342/oauth2/token?resource=https%3A%2F%2Fstorage.azure.com/&client_id=<CLIENT ID>"
   ```

   > [!NOTE]
   > In the previous request, the value of the `resource` parameter must be an exact match for what is expected by Azure AD. When using the Azure Storage resource ID, you must include the trailing slash on the URI.
   > In the following response, the access_token element as been shortened for brevity.

   ```bash
   {"access_token":"eyJ0eXAiOiJ...",
   "refresh_token":"",
   "expires_in":"3599",
   "expires_on":"1504130527",
   "not_before":"1504126627",
   "resource":"https://storage.azure.com",
   "token_type":"Bearer"}
   ```

You can use the access token to access Azure Storage, for example to read the contents of the sample file which you previously uploaded to the container. Replace the values of `<STORAGE ACCOUNT>`, `<CONTAINER NAME>`, `<FILE NAME>` and `<ACCESS TOKEN>` with the ones you created earlier.

  ```bash
  curl https://<STORAGE ACCOUNT>.blob.core.windows.net/<CONTAINER NAME>/<FILE NAME>?api-version=2016-09-01 -H "Authorization: Bearer <ACCESS TOKEN>"
  ```

The response will contain the contents of the file:

```bash
Hello world! :)
```

## Next steps

- For an overview of MSI, see [Managed Service Identity overview](msi-overview.md).
- To learn how to do this same tutorial using a storage SAS credential, see [Use a Linux VM Managed Service Identity to access Azure Storage via a SAS credential](msi-tutorial-linux-vm-access-storage-sas.md)
- For more information about the Azure Storage account SAS feature, see:
  - [Using shared access signatures (SAS)](~/articles/storage/common/storage-dotnet-shared-access-signature-part-1.md)
  - [Constructing a Service SAS](/rest/api/storageservices/Constructing-a-Service-SAS.md)

Use the following comments section to provide feedback and help us refine and shape our content.










## Grant your user-assigned MSI access to use storage account access keys

Azure Storage does not natively support Azure AD authentication.  However, you can use an MSI to retrieve storage account access keys from the Resource Manager, then use a key to access storage.  In this step, you grant your VM MSI access to the keys to your storage account.   

1. Navigate back to your newly created storage account.
2. Click the **Access control (IAM)** link in the left panel.  
3. Click **+ Add** on top of the page to add a new role assignment for your VM
4. Set **Role** to "Storage Account Key Operator Service Role", on the right side of the page. 
5. In the next dropdown, set **Assign access to** the resource "Virtual Machine".  
6. Next, ensure the proper subscription is listed in **Subscription** dropdown, then set **Resource Group** to "All resource groups".  
7. Finally, under **Select** choose your Linux Virtual Machine in the dropdown, then click **Save**. 

    ![Alt image text](~/articles/active-directory/media/msi-tutorial-linux-vm-access-storage/msi-storage-role.png)

## Get an access token using the VM's identity and use it to call Azure Resource Manager

For the remainder of the tutorial, we will work from the VM we created earlier.

To complete these steps, you will need an SSH client. If you are using Windows, you can use the SSH client in the [Windows Subsystem for Linux](https://msdn.microsoft.com/commandline/wsl/install_guide). If you need assistance configuring your SSH client's keys, see [How to Use SSH keys with Windows on Azure](~/articles/virtual-machines/linux/ssh-from-windows.md), or [How to create and use an SSH public and private key pair for Linux VMs in Azure](~/articles/virtual-machines/linux/mac-create-ssh-keys.md).

1. In the Azure portal, navigate to **Virtual Machines**, go to your Linux virtual machine, then from the **Overview** page click **Connect** at the top. Copy the string to connect to your VM. 
2. Connect to your VM using your SSH client.  
3. Next, you will be prompted to enter in your **Password** you added when creating the **Linux VM**. You should then be successfully signed in.  
4. Use CURL to get an access token for Azure Resource Manager.  

    The CURL request and response for the access token is below:
    
    ```bash
    curl http://localhost:50342/oauth2/token --data "resource=https://management.azure.com/" -H Metadata:true    
    ```
    
    > [!NOTE]
    > In the previous request, the value of the "resource" parameter must be an exact match for what is expected by Azure AD. When using the Azure Resource Manager resource ID, you must include the trailing slash on the URI.
    > In the following response, the access_token element as been shortened for brevity.
    
    ```bash
    {"access_token":"eyJ0eXAiOiJ...",
    "refresh_token":"",
    "expires_in":"3599",
    "expires_on":"1504130527",
    "not_before":"1504126627",
    "resource":"https://management.azure.com",
    "token_type":"Bearer"} 
     ```
    
## Get storage account access keys from Azure Resource Manager to make storage calls  

Now use CURL to call Resource Manager using the access token we retrieved in the previous section, to retrieve the storage access key. Once we have the storage access key, we can call storage upload/download operations. Be sure to replace the `<SUBSCRIPTION ID>`, `<RESOURCE GROUP>`, and `<STORAGE ACCOUNT NAME>` parameter values with your own values. Replace the `<ACCESS TOKEN>` value with the access token you retrieved earlier:

```bash 
curl https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE ACCOUNT NAME>/listKeys?api-version=2016-12-01 –-request POST -d "" -H "Authorization: Bearer <ACCESS TOKEN>" 
```

> [!NOTE]
> The text in the prior URL is case sensitive, so ensure if you are using upper-lowercase for your Resource Groups to reflect it accordingly. Additionally, it’s important to know that this is a POST request not a GET request and ensure you pass a value to capture a length limit with -d that can be NULL.  

The CURL response gives you the list of Keys:  

```bash 
{"keys":[{"keyName":"key1","permissions":"Full","value":"iqDPNt..."},{"keyName":"key2","permissions":"Full","value":"U+uI0B..."}]} 
```
Create a sample blob file to upload to your blob storage container. On a Linux VM you can do this with the following command. 

```bash
echo "This is a test file." > test.txt
```

Next, authenticate with the CLI `az storage` command using the storage access key, and upload the file to the blob container. For this step, you will need to [install the latest Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) on your VM, if you haven't already.
 

```azurecli-interactive
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

```azurecli-interactive
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


