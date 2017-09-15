---
title: Use a Windows VM MSI to access Azure storage
description: A tutorial that walks you through the process of using a Windows VM Managed Service Identity (MSI) to access Azure storage.
services: active-directory
documentationcenter: ''
author: elkuzmen
manager: mbaldwin
editor: bryanla

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2017
ms.author: elkuzmen
---

# Use a Windows VM Managed Service Identity to access Azure storage

[!INCLUDE[preview-notice](../../includes/active-directory-msi-preview-notice.md)]

This tutorial shows you how to enable Managed Service Identity (MSI) for a Windows Virtual Machine and then use that identity to access Storage Keys. You can use Storage Keys as usual when doing storage operations, for example when using Storage SDK. For this tutorial, we upload and download blobs using Azure Storage PowerShell. You will learn how to:


> [!div class="checklist"]
> * Enable MSI on a Windows Virtual Machine 
> * Grant your VM access to Storage 
> * Get an access token for your Storage Account using the VM identity 


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a Windows virtual machine in a new resource group

For this tutorial, we create a new Windows VM. You can also enable MSI on an existing VM.

1.	Click the **New** button found on the upper left-hand corner of the Azure portal.
2.	Select **Compute**, and then select **Windows Server 2016 Datacenter**. 
3.	Enter the virtual machine information. The **Username** and **Password** created here is the credentials you use to login to the virtual machine.
4.  Choose the proper **Subscription** for the virtual machine in the dropdown.
5.	To select a new **Resource Group** you would like to virtual machine to be created in, choose **Create New**. When complete, click **OK**.
6.	Select the size for the VM. To see more sizes, select **View all** or change the **Supported disk type** filter. On the settings blade, keep the defaults and click **OK**.

    ![Alt image text](media/msi-tutorial-windows-vm-access-arm/msi-windows-vm.png)

## Enable MSI on your VM

A Virtual Machine MSI enables you to get access tokens from Azure AD without you needing to put credentials into your code. Under the covers, enabling MSI does two things: it installs the MSI VM extension on your VM and it enables MSI for the Virtual Machine.  

1. Navigate to the resource group of your new virtual machine, and select the virtual machine you created in the previous step.
2. Under the VM Setting on the left, click **Configuration**.
3. To register and enable the MSI, select **Yes**, if you wish to disable it, choose No.
4. Ensure you click **Save** to save the configuration.

    ![Alt image text](media/msi-tutorial-linux-vm-access-arm/msi-linux-extension.png)

5. If you wish to check which extensions are on the VM, click **Extensions**. If MSI is enabled, the **ManagedIdentityExtensionforWindows** appears in the list.

    ![Alt image text](media/msi-tutorial-linux-vm-access-arm/msi-extension-value.png)

## Create a storage Account 

If you don't already have one, you will now create a storage account. You can also skip this step and grant your VM MSI access to the keys of an existing storage account. 

1. Click the **New** button found on the upper left-hand corner of the Azure portal.
2. Click **Storage**, then **Storage Account**, and a new "Create storage account" panel will display.
3. Enter a name for the storage account, which you will use later.  
4. **Deployment model** and **Account kind** should be set to "Resource manager" and "General purpose", respectively. 
5. Ensure the **Subscription** and **Resource Group** match the ones you specified when you created your VM in the previous step.
6. Click **Create**.

    ![Create new storage account](media/msi-tutorial-linux-vm-access-storage/msi-storage-create.png)

## Create a blob container in the storage account

Later we will upload and download a file to the new storage account. Because files require blob storage, we need to create a blob container in which to store the file.

1. Navigate back to your newly created storage account.
2. Click the **Containers** link on the left navigation bar, under "Blob service."
3. Click **+ Container** on the top of the page, and a "New container" panel slides out.
4. Give the container a name, select an access level, then click **OK**. The name you specified will be used later in the tutorial. 

    ![Create storage container](media/msi-tutorial-linux-vm-access-storage/create-blob-container.png)

## Grant your VM identity access to use Storage Keys 

Azure Storage does not natively support Azure AD authentication.  However, you can use an MSI to retrieve Storage keys from the Resource Manager, and use those keys to access storage.  In this step, you grant your VM MSI access to the keys to your Storage account.   

1. Navigate to tab for **Storage**.  
2. Select the specific **Storage Account** you created earlier.   
3. Go to **Access control (IAM)** in the left panel.  
4. Then **Add** a new role assignment for your VM, pick **Role** as **Storage Account Key Operator Service Role**.  
5. In the next dropdown, **Assign access** to the resource **Virtual Machine**.  
6. Next, ensure the proper subscription is listed in **Subscription** dropdown. And for **Resource Group**, select **All resource groups**.  
7. Finally, in **Select** choose your Windows Virtual Machine in the dropdown and click **Save**. 

    ![Alt image text](media/msi-tutorial-linux-vm-access-storage/msi-storage-role.png)

## Get an access token using the VM Identity and use it to call Azure Resource Manager 

You will need to use Azure Resource Manager **PowerShell** in this portion.  If you don’t have it installed, [download the latest version](https://docs.microsoft.com/powershell/azure/overview?view=azurermps-4.3.1) before continuing.

1. In the portal, navigate to **Virtual Machines** and go to your Windows virtual machine and in the **Overview**, click **Connect**. 
2. Enter in your **Username** and **Password** for which you added when you created the Windows VM. 
3. Now that you have created a **Remote Desktop Connection** with the virtual machine, open **PowerShell** in the remote session. 
4. Using Powershell’s Invoke-WebRequest, make a request to the local MSI endpoint to get an access token for Azure Resource Manager.

    ```powershell
       $response = Invoke-WebRequest -Uri http://localhost/50342/oauth2/token -Method GET -Body {@resource="https://management.azure.com/"} -Headers @{Metadata="true"}
    ```
    
    > [!NOTE]
    > The value of the "resource" parameter must be an exact match for what is expected by Azure AD. When using the Azure Resource Manager resource ID, you must include the trailing slash on the URI.
    
    Next, extract the full response, which is stored as a JavaScript Object Notation (JSON) formatted string in the $response object. 
    
    ```powershell
    $content = $response.Content | ConvertFrom-Json
    ```
    Next, extract the access token from the response.
    
    ```powershell
    $ArmToken = $content.access_token
    ```
 
## Get storage keys from Azure Resource Manager to make storage calls 

Now we use PowerShell to make a call to Resource Manager using the access token we retrieved in the previous section, to retrieve the storage access key. Once we have the storage access key, we can call storage upload/download operations.

```powershell
PS C:\> $keysResponse = Invoke-WebRequest -Uri https://management.azure.com/subscriptions/<SUBSCRIPTION-ID>/resourceGroups/<RESOURCE-GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE-ACCOUNT>/listKeys/?api-version=2016-12-01 -Method POST$ -Headers @{Authorization="Bearer $ARMToken"}
```
> [!NOTE] 
> The URL is case-sensitive, so ensure you use the exact same case used earlier, when you named the Resource Group, including the uppercase "G" in "resourceGroups." 

```powershell
PS C:\> $keysContent = $keysResponse.Content | ConvertFrom-Json
```

```powershell
PS C:\> $key = $keysContent.keys[0].value
```

**Create a file to be uploaded**

```bash
echo "This is a test text file." > test.txt
```

**Upload the file using the Azure Storage PowerShell and authenticate with the storage key**

> [!NOTE]
> First remember to install Azure storage commandlets “Install-Module Azure.Storage”. 

PowerShell request:


```powershell
PS C:\> $ctx = New-AzureStorageContext -StorageAccountName <STORAGE-ACCOUNT> -StorageAccountKey $key
PS C:\> Set-AzureStorageBlobContent -File test.txt -Container <CONTAINER-NAME> -Blob testblob -Context $ctx
```

Response:

```powershell
ICloudBlob        : Microsoft.WindowsAzure.Storage.Blob.CloudBlockBlob
BlobType          : BlockBlob
Length            : 56
ContentType       : application/octet-stream
LastModified      : 9/13/2017 6:14:25 PM +00:00
SnapshotTime      :
ContinuationToken :
Context           : Microsoft.WindowsAzure.Commands.Storage.AzureStorageContext
Name              : testblob
```

**Download the file using the Azure CLI and authenticating with the Storage Key**

PowerShell request:

```powershell
PS C:\> Get-AzureStorageBlobContent -Blob <blob name> -Container <CONTAINER-NAME> -Destination test2.txt -Context $ctx
```

Response:

```powershell
ICloudBlob        : Microsoft.WindowsAzure.Storage.Blob.CloudBlockBlob
BlobType          : BlockBlob
Length            : 56
ContentType       : application/octet-stream
LastModified      : 9/13/2017 6:14:25 PM +00:00
SnapshotTime      :
ContinuationToken :
Context           : Microsoft.WindowsAzure.Commands.Storage.AzureStorageContext
Name              : testblob
```




