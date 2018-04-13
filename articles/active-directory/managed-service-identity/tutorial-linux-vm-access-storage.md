---
title: Use a Linux VM MSI to access Azure Storage
description: A tutorial that walks you through the process of using a System-Assigned Managed Service Identity (MSI) on a Linux VM, to access Azure Storage.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/09/2018
ms.author: skwan

---
# Use a Linux VM's MSI to access Azure Storage 

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]


This tutorial shows you how to create and use a Linux VM MSI to access Azure Storage. You learn how to:

> [!div class="checklist"]
> * Enable MSI on a Linux VM
> * Create a blob container in a storage account
> * Create a collection in the Cosmos DB account
> * Retrieve the `principalID` of the of the Linux VM's MSI
> * Grant the Linux VM's MSI access to an Azure Storage container
> * Get an access token and use it to call Azure Storage

## Prerequisites

If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com) before continuing.

[!INCLUDE [msi-tut-prereqs](~/includes/active-directory-msi-tut-prereqs.md)]

To run the CLI script examples in this tutorial, you have two options:

- Use [Azure Cloud Shell](~/articles/cloud-shell/overview.md) either from the Azure portal, or via the **Try It** button, located in the top right corner of each code block.
- [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.23 or later) if you prefer to use a local CLI console.

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a Linux virtual machine in a new resource group

For this tutorial, we create a new Linux VM. You can also enable MSI on an existing VM.

1. Select the **New** button in the upper-left corner of the Azure portal.
2. Select **Compute**, and then select **Ubuntu Server 16.04 LTS**.
3. Enter the virtual machine information. For **Authentication type**, select **SSH public key** or **Password**. The created credentials allow you to log in to the VM.

   !["Basics" pane for creating a virtual machine](../media/msi-tutorial-linux-vm-access-arm/msi-linux-vm.png)

4. In the **Subscription** list, select a subscription for the virtual machine.
5. To select a new resource group that you want the virtual machine to be created in, select **Resource group** > **Create new**. When you finish, select **OK**.
6. Select the size for the VM. To see more sizes, select **View all** or change the **Supported disk type** filter. In the settings pane, keep the defaults and select **OK**.

## Enable MSI on your VM

A Virtual Machine MSI enables you to get access tokens from Azure AD without needing to put credentials into your code. Under the covers, enabling MSI on a Virtual Machine via the Azure portal does two things: it registers your VM with Azure AD to create a managed identity and installs the MSI VM extension.

1. Navigate to the resource group of your new virtual machine, and select the virtual machine you created in the previous step.
2. Under the "Settings" category on the left navigation, click on  Configuration.
3. To enable the MSI, select Yes. To disable, choose No.
4. Click Save, to apply the configuration. 
5. If you want to check which extensions are on this Linux VM, select **Extensions**. If MSI is enabled, **ManagedIdentityExtensionforLinux** appears in the list.

   ![List of extensions](../media/msi-tutorial-linux-vm-access-arm/msi-extension-value.png)


## Create a storage account 

If you don't already have one, now create a storage account. You can also skip this step and use an existing storage account, if you prefer. 

1. Click the **+/Create new service** button found on the upper left-hand corner of the Azure portal.
2. Click **Storage**, then **Storage Account**, and a new "Create storage account" panel  displays.
3. Enter a **Name** for the storage account, which you use later.  
4. **Deployment model** and **Account kind** should be set to "Resource manager" and "General purpose", respectively. 
5. Ensure the **Subscription** and **Resource Group** match the ones you specified when you created your VM in the previous step.
6. Click **Create**.

    ![Create new storage account](~/articles/active-directory/media/msi-tutorial-linux-vm-access-storage/msi-storage-create.png)

## Create a blob container in the storage account

Because files require blob storage, you need to create a blob container in which to store the file. Then you upload and download a file to the blob container, in the new storage account.

1. Navigate back to your newly created storage account.
2. Click the **Containers** link in the left, under "Blob service."
3. Click **+ Container** on the top of the page, and a "New container" panel slides out.
4. Give the container a name, select an access level, then click **OK**. The name you specified is also used later in the tutorial. 

    ![Create storage container](~/articles/active-directory/media/msi-tutorial-linux-vm-access-storage/create-blob-container.png)

5. Upload a file to the newly created container by clicking on the container name, then **Upload**, then select a file, then click **Upload**.

    ![Upload text file](~/articles/active-directory/media/msi-tutorial-linux-vm-access-storage/upload-text-file.png)

## Retrieve the principalID of the Linux VM's MSI

To grant the Linux VM's MSI access to an Azure Storage container in the following section, you need to retrieve the `principalID` of the Linux VM's MSI.  Be sure to replace the `<SUBSCRIPTION ID>`, `<RESOURCE GROUP>` (resource group in which you VM resides), and `<VM NAME>` parameter values with your own values.

```azurecli-interactive
az resource show --id /subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Compute/virtualMachines/<VM NAME> --api-version 2017-12-01
```
The response includes the details of the system-assigned MSI (note the `principalID` as it is used in the next section):

```bash  
{
    "id": "/subscriptions/<SUBSCRIPTION ID>/<RESOURCE GROUP>/providers/Microsoft.Compute/virtualMachines/<VM NAMe>",
  "identity": {
    "principalId": "6891c322-314a-4e85-b129-52cf2daf47bd",
    "tenantId": "733a8f0e-ec41-4e69-8ad8-971fc4b533f8",
    "type": "SystemAssigned"
 }

```

## Grant the Linux VM's MSI access to an Azure Storage container

By using an MSI, your code can get access tokens to authenticate to resources that support Azure AD authentication. In this tutorial, you use Azure Storage.

First you grant the MSI identity access to an Azure Storage container. In this case, you use the container created earlier. Update the values for `<SUBSCRIPTION ID>`, `<RESOURCE GROUP>`, `<STORAGE ACCOUNT NAME>`, and `<CONTAINER NAME>` as appropriate for your environment. Additionally, replace `<MSI PRINCIPALID>` with the `principalId` property returned by the `az resource show` command in [Retrieve the `principalID` of the Linux VM's MSI](#retrieve-the-principalid-of-the-linux-vms-msi):

```azurecli-interactive
az role assignment create --assignee <MSI PRINCIPALID> --role 'Storage Blob Data Reader (Preview)' --scope "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE ACCOUNT NAME>/blobServices/default/containers/<CONTAINER NAME>"
```

The response includes the details for the role assignment created:

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
## Get an access token and use it to call Azure Storage

For the remainder of the tutorial, you need to work from the VM you created earlier.

To complete these steps, you need an SSH client. If you are using Windows, you can use the SSH client in the [Windows Subsystem for Linux](https://msdn.microsoft.com/commandline/wsl/about). If you need assistance configuring your SSH client's keys, see [How to Use SSH keys with Windows on Azure](~/articles/virtual-machines/linux/ssh-from-windows.md), or [How to create and use an SSH public and private key pair for Linux VMs in Azure](~/articles/virtual-machines/linux/mac-create-ssh-keys.md).

1. In the Azure portal, navigate to **Virtual Machines**, go to your Linux virtual machine, then from the **Overview** page click **Connect** at the top. Copy the string to connect to your VM.
2. **Connect** to the VM with the SSH client of your choice. 
3. In the terminal window, using CURL, make a request to the local MSI endpoint to get an access token for Azure Storage.
    
    ```bash
    curl http://localhost:50342/oauth2/token --data "resource=https://storage.azure.com/" -H Metadata:true
    ```
4. Now use the access token to access Azure Storage, for example to read the contents of the sample file which you previously uploaded to the container. Replace the values of `<STORAGE ACCOUNT>`, `<CONTAINER NAME>`, and `<FILE NAME>` with the values you specified earlier, and `<ACCESS TOKEN>` with the token returned in the previous step.

   ```bash
   curl https://<STORAGE ACCOUNT>.blob.core.windows.net/<CONTAINER NAME>/<FILE NAME> -H "x-ms-version: 2017-11-09" -H "Authorization: Bearer <ACCESS TOKEN>"
   ```

   The response contains the contents of the file:

   ```bash
   Hello world! :)
   ```
