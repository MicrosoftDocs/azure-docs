---
title: Generate a SAS URI for a VM image
description: Generate a shared access signature (SAS) URI for a virtual hard disk (VHD) in Azure Marketplace.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.author: amhindma
author: amhindma
ms.date: 08/16/2022
---

# Generate a SAS URI for a VM image

> [!NOTE]
> A Shared access signature (SAS) URI can be used to publish your virtual machine (VM). Alternatively, you can share an image in Partner Center via Azure compute gallery. Refer to [Create a virtual machine using an approved base](azure-vm-use-approved-base.md) or [Create a virtual machine using your own image](azure-vm-use-own-image.md) for further instructions.

Before getting started, you will need the following:

- A virtual machine
- A [storage account](../storage/common/storage-account-create.md?tabs=azure-portal) with a container for storing the virtual hard drive (VHD)
- Your [storage account key](../storage/common/storage-account-keys-manage.md?tabs=azure-portal#view-account-access-keys)

## Extract VHD from a VM

> [!NOTE]
> You can skip this step if you already have a VHD uploaded to a storage account.

To extract the VHD from your VM, you need to first take a snapshot of your VM disk and then extract the VHD from the snapshot into your storage account.

### Take a snapshot of your VM disk

1. Sign in to the [Azure portal](https://www.portal.azure.com/).
1. Select **Create a resource**, then search for and select **Snapshot**.
1. In the Snapshot blade, select **Create**.
1. Select the **Subscription**. Select an existing resource group within the selected subscription or **Create new** and enter the name for a new resource group to be created. This is the resource group the snapshot will be associated to.
1. Enter a **Name** for the snapshot.
1. For **Source type**, select **Disk**.
1. Select the **Source subscription**, which is the subscription that contains the VM disk. This may be different from the destination subscription of the new snapshot.
1. For **Source disk**, select the managed disk to snapshot.
1. For the **Storage type**, select **Standard HDD** unless you need it stored on a high performing SSD.
1. Select **Review + Create**. Upon successful validation, select **Create**.

### Extract the VHD into your storage account

Use the following script to export the snapshot into a VHD in your storage account. For each of parameters, insert your information accordingly.

```azurecli
#Provide the subscription Id where the snapshot is created
subscriptionId=yourSubscriptionId

#Provide the name of your resource group where the snapshot is created
resourceGroupName=myResourceGroupName

#Provide the snapshot name
snapshotName=mySnapshot

#Provide Shared Access Signature (SAS) expiry duration in seconds (such as 3600)
#Know more about SAS here: https://learn.microsoft.com/azure/storage/storage-dotnet-shared-access-signature-part-1
sasExpiryDuration=3600

#Provide storage account name where you want to copy the underlying VHD file.
storageAccountName=mystorageaccountname

#Name of the storage container where the downloaded VHD will be stored.
storageContainerName=mystoragecontainername

#Provide the access key for the storage account that you want to copy the VHD to.
storageAccountKey=mystorageaccountkey

#Give a name to the destination VHD file to which the VHD will be copied.
destinationVHDFileName=myvhdfilename.vhd

az account set --subscription $subscriptionId

sas=$(az snapshot grant-access --resource-group $resourceGroupName --name $snapshotName --duration-in-seconds $sasExpiryDuration --query [accessSas] -o tsv)

az storage blob copy start --destination-blob $destinationVHDFileName --destination-container $storageContainerName --account-name $storageAccountName --account-key $storageAccountKey --source-uri $sas
```

This script above uses the following commands to generate the SAS URI for a snapshot and copies the underlying VHD to a storage account using the SAS URI.

|Command  |Notes  |
|---------|---------|
| az disk grant-access    | Generates read-only SAS that is used to copy the underlying VHD file to a storage account or download it to on-premises. |
|  az storage blob copy start   | Copies a blob asynchronously from one storage account to another. Use [az storage blob show](/cli/azure/storage/blob#az-storage-blob-show) to check the status of the new blob. |

## Generate the SAS URI

There are two common tools used to create a SAS address (URI):

- **Azure Storage browser** – Available on the Azure portal.
- **Azure CLI** – Recommended for non-Windows operating systems and automated or continuous integration environments.

### Using Tool 1: Azure Storage browser

1. Go to your **Storage account**.
2. Open **Storage browser** and select **blob containers**.
3. In your **Container**, right-click the VHD file and select **Generate SAS**.
4. In the **Shared Access Signature** menu that appears, complete the following fields:

    1. Permissions – Select read permissions. Don’t provide write or delete permissions.
    1. Start date/time – This is the permission start date for VHD access. To protect against UTC time changes, provide a date that is one day before the current date. For example, if the current date is July 15, 2022, set the date as 07/14/2022.
    1. Expiry date/time – This is the permission expiration date for VHD access. Provide a date at least three weeks beyond the current date.
    
5. To create the associated SAS URI for this VHD, select **Generate SAS token and URL**.
6. Copy the Blob SAS URL and save it to a text file in a secure location.
7. Repeat these steps for each VHD you want to publish.

### Using Tool 2: Azure CLI

1. In Azure CLI, run the following command.

    ```azurecli-interactive
    az storage container generate-sas --connection-string 'DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net' --name <container-name> --permissions r --start '<start-date>' --expiry '<expiry-date>'
    ```

    Before running the command above, remember to insert the following parameter values.

    | Parameter value | Description |
    | --------------- | ----------- |
    | account-name | Your Azure storage account name. |
    | account-key | Your Azure storage account key. |
    | container-name | Your blob container that hosts the VHD file. |
    | start-date | This is the permission start date for VHD access. Provide a date one day before the current date. For example, if the current date is July 15, 2022, set the date as 07/14/2022. Provide dates in UTC date/time format (YYYY-MM-DDT00:00:00Z), such as 2022-04-01T00:00:00Z. |
    | expiry-date | This is the permission expiration date for VHD access. Provide a date at least three weeks after the current date. Provide dates in UTC date/time format (YYYY-MM-DDT00:00:00Z), such as 2022-04-01T00:00:00Z. |

1. Copy the SAS connection string and save it to a text file in a secure location. Edit this string to add the VHD location information to create the final SAS URI.
1. In the Azure portal, go to the blob container that includes the VHD associated with the new URI.
1. Copy the URL of the blob service endpoint.
1. Edit the text file with the SAS connection string from step 2. Create the complete SAS URI using this format. Be sure to insert a “?” between the endpoint URL and the connection string.

    `<blob-service-endpoint-url>?<sas-connection-string>`

### Virtual machine SAS failure messages

This table shows the common errors encountered when providing a shared access signatures (SAS) URI in Partner Center, along with suggested resolutions.

| Issue | Failure Message | Fix |
| --- | --- | --- |
| "?" is not found in SAS URI | `Must be a valid Azure shared access signature URI.` | Ensure that the SAS URI provided uses the proper syntax and includes the “?”character.<br>Syntax: `<blob-service-endpoint-url>?<sas-connection-string>`  |
| "st" parameter not in SAS URI | `Specified SAS URL cannot be reached.` | Update the SAS URI with proper **Start Date** ("st") value. |
| "se" parameter not in SAS URI | `The end date parameter (se) is required.` | Update the SAS URI with proper **End Date** (“se”) value. |
| "sp=r" not in SAS URI | `Missing Permissions (sp) must include 'read' (r).` | Update the SAS URI with permissions set as `Read` (“sp=r”). |
| SAS URI Authorization error | `Failure: Copying Images. Not able to download blob due to authorization error.` | Review and correct the SAS URI format. Regenerate if necessary. |
| SAS URI "st" and "se" parameters do not have full date-time specification | `The start time parameter (st) is not a valid date string.`<br>OR<br>`The end date parameter (se) is not a valid date string.` | SAS URI **Start Date** and **End Date** parameters (“st” and “se” substrings) must have full date-time format (YYYY-MM-DDT00:00:00Z), such as 11-02-2017T00:00:00Z. Shortened versions are invalid (some commands in Azure CLI may generate shortened values by default). |

For details, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../storage/common/storage-sas-overview.md).

## Verify the SAS URI

Check the SAS URI before publishing it on Partner Center to avoid any issues related to SAS URI post submission of the request. This process is optional but recommended.

- The URI includes your VHD image filename, including the filename extension `.vhd`.
- `Sp=r` appears near the middle of your URI. This string shows Read permission is granted.
- When `sr=c` appears, this means that container-level access is specified.
- Copy and paste the URI into a browser to test-download the blob (you can cancel the operation before the download completes).

## Next steps

- [Create a virtual machine offer on Azure Marketplace](azure-vm-offer-setup.md)
- [Sign in to Partner Center and publish your image by providing the SAS URI](https://go.microsoft.com/fwlink/?linkid=2165935)