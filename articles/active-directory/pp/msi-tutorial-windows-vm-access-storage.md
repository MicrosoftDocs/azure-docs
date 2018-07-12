---
title: Use a Windows VM MSI to access Azure Storage
description: A tutorial that walks you through the process of using a Windows VM Managed Service Identity (MSI) to access Azure Storage.
services: active-directory
documentationcenter: ''
author: daveba
manager: mtillman
editor: daveba

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/15/2017
ms.author: daveba
ROBOTS: NOINDEX,NOFOLLOW
---

# Use a Windows VM Managed Service Identity to access Azure Storage via access key

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

This tutorial shows you how to enable Managed Service Identity (MSI) for a Windows Virtual Machine, then use that identity to retrieve storage account access keys. You can use storage access keys as usual when doing storage operations, for example when using the Storage SDK. For this tutorial, we upload and download blobs using Azure Storage PowerShell. You will learn how to:


> [!div class="checklist"]
> * Enable MSI on a Windows Virtual Machine 
> * Grant your VM access to storage account access keys in Resource Manager 
> * Get an access token using your VM's identity, and use it to retrieve the storage access keys from Resource Manager 

## Prerequisites

[!INCLUDE [msi-core-prereqs](~/includes/active-directory-msi-core-prereqs-ua.md)]

[!INCLUDE [msi-tut-prereqs](~/includes/active-directory-msi-tut-prereqs.md)]

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a Windows virtual machine in a new resource group

For this tutorial, we create a new Windows VM. You can also enable MSI on an existing VM.

1.	Click the **+/Create new service** button found on the upper left-hand corner of the Azure portal.
2.	Select **Compute**, and then select **Windows Server 2016 Datacenter**. 
3.	Enter the virtual machine information. The **Username** and **Password** created here is the credentials you use to login to the virtual machine.
4.  Choose the proper **Subscription** for the virtual machine in the dropdown.
5.	To select a new **Resource Group** you would like to virtual machine to be created in, choose **Create New**. When complete, click **OK**.
6.	Select the size for the VM. To see more sizes, select **View all** or change the **Supported disk type** filter. On the settings blade, keep the defaults and click **OK**.

    ![Alt image text](../managed-service-identity/media/msi-tutorial-windows-vm-access-arm/msi-windows-vm.png)

## Enable MSI on your VM

A Virtual Machine MSI enables you to get access tokens from Azure AD without you needing to put credentials into your code. Under the covers, enabling MSI does two things: it installs the MSI VM extension on your VM and it enables MSI for the Virtual Machine.  

1. Navigate to the resource group of your new virtual machine, and select the virtual machine you created in the previous step.
2. Under the VM "Settings" on the left, click **Configuration**.
3. To register and enable the MSI, select **Yes**, if you wish to disable it, choose No.
4. Ensure you click **Save** to save the configuration.

    ![Alt image text](../managed-service-identity/media/msi-tutorial-linux-vm-access-arm/msi-linux-extension.png)

5. If you wish to check which extensions are on the VM, click **Extensions**. If MSI is enabled, the **ManagedIdentityExtensionforWindows** appears in the list.

    ![Alt image text](../managed-service-identity/media/msi-tutorial-linux-vm-access-arm/msi-extension-value.png)

## Create a storage account 

If you don't already have one, you will now create a storage account. You can also skip this step and grant your VM MSI access to the keys of an existing storage account. 

1. Click the **+/Create new service** button found on the upper left-hand corner of the Azure portal.
2. Click **Storage**, then **Storage Account**, and a new "Create storage account" panel will display.
3. Enter a name for the storage account, which you will use later.  
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

## Grant your VM's MSI access to use storage account access keys 

Azure Storage does not natively support Azure AD authentication.  However, you can use an MSI to retrieve storage account access keys from the Resource Manager, then use a key to access storage.  In this step, you grant your VM MSI access to the keys to your storage account.   

1. Navigate back to your newly created storage account.  
2. Click the **Access control (IAM)** link in the left panel.  
3. Click **+ Add** on top of the page to add a new role assignment for your VM
4. Set **Role** to "Storage Account Key Operator Service Role", on the right side of the page. 
5. In the next dropdown, set **Assign access to** the resource "Virtual Machine".  
6. Next, ensure the proper subscription is listed in **Subscription** dropdown, then set **Resource Group** to "All resource groups".  
7. Finally, under **Select** choose your Windows Virtual Machine in the dropdown, then click **Save**. 

    ![Alt image text](~/articles/active-directory/media/msi-tutorial-linux-vm-access-storage/msi-storage-role.png)

## Get an access token using the VM's identity and use it to call Azure Resource Manager 

For the remainder of the tutorial, we will work from the VM we created earlier. 

You will need to use the Azure Resource Manager PowerShell cmdlets in this portion.  If you don’t have it installed, [download the latest version](https://docs.microsoft.com/powershell/azure/overview) before continuing.

1. In the Azure portal, navigate to **Virtual Machines**, go to your Windows virtual machine, then from the **Overview** page click **Connect** at the top. 
2. Enter in your **Username** and **Password** for which you added when you created the Windows VM. 
3. Now that you have created a **Remote Desktop Connection** with the virtual machine, open PowerShell in the remote session.
4. Using Powershell’s Invoke-WebRequest, make a request to the local MSI endpoint to get an access token for Azure Resource Manager.

    ```powershell
       $response = Invoke-WebRequest -Uri http://localhost:50342/oauth2/token -Method GET -Body @{resource="https://management.azure.com/"} -Headers @{Metadata="true"}
    ```
    
    > [!NOTE]
    > The value of the "resource" parameter must be an exact match for what is expected by Azure AD. When using the Azure Resource Manager resource ID, you must include the trailing slash on the URI.
    
    Next, extract the "Content" element, which is stored as a JavaScript Object Notation (JSON) formatted string in the $response object. 
    
    ```powershell
    $content = $response.Content | ConvertFrom-Json
    ```
    Next, extract the access token from the response.
    
    ```powershell
    $ArmToken = $content.access_token
    ```
 
## Get storage account access keys from Azure Resource Manager to make storage calls  

Now use PowerShell to call Resource Manager using the access token we retrieved in the previous section, to retrieve the storage access key. Once we have the storage access key, we can call storage upload/download operations.

```powershell
$keysResponse = Invoke-WebRequest -Uri https://management.azure.com/subscriptions/<SUBSCRIPTION-ID>/resourceGroups/<RESOURCE-GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE-ACCOUNT>/listKeys/?api-version=2016-12-01 -Method POST -Headers @{Authorization="Bearer $ARMToken"}
```
> [!NOTE] 
> The URL is case-sensitive, so ensure you use the exact same case used earlier, when you named the Resource Group, including the uppercase "G" in "resourceGroups." 

```powershell
$keysContent = $keysResponse.Content | ConvertFrom-Json
$key = $keysContent.keys[0].value
```

Next we create a file called "test.txt". Then use the storage access key to authenticate with the `New-AzureStorageContent` cmdlet, upload the file to our blob container, then download the file.

```bash
echo "This is a test text file." > test.txt
```

Be sure to install the Azure Storage cmdlets first, using `Install-Module Azure.Storage`. Then upload the blob you just created, using the `Set-AzureStorageBlobContent` PowerShell cmdlet:

```powershell
$ctx = New-AzureStorageContext -StorageAccountName <STORAGE-ACCOUNT> -StorageAccountKey $key
Set-AzureStorageBlobContent -File test.txt -Container <CONTAINER-NAME> -Blob testblob -Context $ctx
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

You can also download the blob you just uploaded, using the `Get-AzureStorageBlobContent` PowerShell cmdlet:

```powershell
Get-AzureStorageBlobContent -Blob testblob -Container <CONTAINER-NAME> -Destination test2.txt -Context $ctx
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


## Related content

- For an overview of MSI, see [Managed Service Identity overview](msi-overview.md).
- To learn how to do this same tutorial using a storage SAS credential, see [Use a Windows VM Managed Service Identity to access Azure Storage via a SAS credential](msi-tutorial-windows-vm-access-storage-sas.md)
- For more information about the Azure Storage account SAS feature, see:
  - [Using shared access signatures (SAS)](~/articles/storage/common/storage-dotnet-shared-access-signature-part-1.md)
  - [Constructing a Service SAS](/rest/api/storageservices/Constructing-a-Service-SAS.md)

Use the following comments section to provide feedback and help us refine and shape our content


