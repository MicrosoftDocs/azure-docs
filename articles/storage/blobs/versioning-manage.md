---
title: Enable and manage blob versioning (preview)
titleSuffix: Azure Storage
description: Learn how to enable blob versioning in the Azure portal, PowerShell, Azure CLI, or by using an Azure Resource Manager template.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 04/07/2020
ms.author: tamram
ms.subservice: blobs
---

# Enable and manage blob versioning

You can enable or disable blob versioning (preview) for the storage account at any time by using the Azure portal, PowerShell, Azure CLI, or an Azure Resource Manager template.

## Enable blob versioning

# [Azure portal](#tab/portal)

???need screenshot here - i have access now, but need grammatical errors in text fixed first

:::image type="content" source="media/versioning-manage/portal-enable-versioning.png" alt-text="Screenshot showing how to enable blob versioning in Azure portal":::

# [PowerShell](#tab/powershell)

???preview module info

To enable blob versioning with PowerShell, call the [Update-AzStorageBlobServiceProperty](/powershell/module/az.storage/update-azstorageblobserviceproperty) command and specify **$true** for the `-EnableVersioning` parameter.

```powershell
Update-AzStorageBlobServiceProperty -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account> `
    -EnableVersioning $true
```

# [Azure CLI](#tab/azure-cli)

To enable blob versioning with Azure CLI, call the [az storage account blob-service-properties update](/cli/azure/storage/account/blob-service-properties#az-storage-account-blob-service-properties-update) command.

```azurecli
az storage account blob-service-properties update --resource-group <resource-group> \
    --account-name <storage-account> \
    --enableVersioning true ???
```

# [Template](#tab/template)

To enable blob versioning with a template, create a template with the `IsVersioningEnabled` property to **true**. The following steps describe how to create a template in the Azure portal.

1. In the Azure portal, choose **Create a resource**.
1. In **Search the Marketplace**, type **template deployment**, and then press **ENTER**.
1. Choose **Template deployment**, choose **Create**, and then choose **Build your own template in the editor**.
1. In the template editor, paste in the following JSON. Replace the `<accountName>` placeholder with the name of your storage account.
1. Save the template.
1. Specify the resource group of the account, and then choose the **Purchase** button to deploy the template and enable blob versioning.

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {},
        "variables": {},
        "resources": [
            {
                "type": "Microsoft.Storage/storageAccounts/blobServices",
                "apiVersion": "2019-06-01",
                "name": "<accountName>/default",
                "properties": {
                    "IsVersioningEnabled": true
                }
            }
        ]
    }
    ```

For more information about deploying resources with templates in the Azure portal, see [Deploy resources with Azure portal](../../azure-resource-manager/templates/deploy-portal.md).

---

## List blobs and blob versions

You can get a list of blobs and versions under a specific container by including the *versions* parameter on the listing operation. To determine whether a given version is the current version (that is, the base blob), check the value of the **IsCurrentVersion** field.

The following XML is a sample response body from a [List Blobs](/rest/api/storageservices/list-blobs) operation that includes the *versions* parameter.

```xml
<?xml version="1.0" encoding="utf-8"?>  
<EnumerationResults ServiceEndpoint="http://myaccount.blob.core.windows.net/"  ContainerName="mycontainer">  
  <Prefix>string-value</Prefix>  
  <Marker>string-value</Marker>  
  <MaxResults>int-value</MaxResults>  
  <Delimiter>string-value</Delimiter>  
  <Blobs>  
    <Blob>  
      <Name>blob-name</name>  
      <VersionId>version-id</VersionId>
      <IsCurrentVersion>true</IsCurrentVersion>
      <Properties>
        …
      </Properties>  
      <Metadata>
        …
      </Metadata>  
    </Blob>  
    <BlobPrefix>  
      <Name>blob-prefix</Name>  
    </BlobPrefix>  
  </Blobs>  
  <NextMarker />  
</EnumerationResults>
```

## Next steps

- [Blob versioning (preview)](versioning-overview.md)
- [Soft delete for Azure Storage blobs](soft-delete-overview.md)
