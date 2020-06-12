---
title: Enable and manage blob versioning (preview)
titleSuffix: Azure Storage
description: Learn how to enable blob versioning in the Azure portal or by using an Azure Resource Manager template.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 05/05/2020
ms.author: tamram
ms.subservice: blobs
---

# Enable and manage blob versioning

You can enable or disable blob versioning (preview) for the storage account at any time by using the Azure portal or an Azure Resource Manager template.

## Enable blob versioning

# [Azure portal](#tab/portal)

To enable blob versioning in the Azure portal:

1. Navigate to your storage account in the portal.
1. Under **Blob service**, choose **Data protection**.
1. In the **Versioning** section, select **Enabled**.

:::image type="content" source="media/versioning-enable/portal-enable-versioning.png" alt-text="Screenshot showing how to enable blob versioning in Azure portal":::

# [Template](#tab/template)

To enable blob versioning with a template, create a template with the **IsVersioningEnabled** property to **true**. The following steps describe how to create a template in the Azure portal.

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

## Modify a blob to trigger a new version

The following code example shows how to trigger the creation of a new version with the Azure Storage client library for .NET version 12. Before running this example, make sure you have enabled versioning for your storage account.

The example creates a block blob, and then updates the blob's metadata. Updating the blob's metadata triggers the creation of a new version. The example retrieves the initial version and the current version, and shows that only the current version includes the metadata.

```csharp
public static async Task UpdateVersionedBlobMetadata(string containerName, string blobName)
{
    // Create a new service client from the connection string.
    BlobServiceClient blobServiceClient = new BlobServiceClient(ConnectionString);

    // Create a new container client.
    BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

    try
    {
        // Create the container.
        await containerClient.CreateIfNotExistsAsync();

        // Upload a block blob.
        BlockBlobClient blockBlobClient = containerClient.GetBlockBlobClient(blobName);

        string blobContents = string.Format("Block blob created at {0}.", DateTime.Now);
        byte[] byteArray = Encoding.ASCII.GetBytes(blobContents);

        string initalVersionId;
        using (MemoryStream stream = new MemoryStream(byteArray))
        {
            Response<BlobContentInfo> uploadResponse = await blockBlobClient.UploadAsync(stream, null, default);

            // Get the version ID for the current version.
            initalVersionId = uploadResponse.Value.VersionId;
        }

        // Update the blob's metadata to trigger the creation of a new version.
        Dictionary<string, string> metadata = new Dictionary<string, string>
        {
            { "key", "value" },
            { "key1", "value1" }
        };

        Response<BlobInfo> metadataResponse = await blockBlobClient.SetMetadataAsync(metadata);

        // Get the version ID for the new current version.
        string newVersionId = metadataResponse.Value.VersionId;

        // Request metadata on the previous version.
        BlockBlobClient initalVersionBlob = blockBlobClient.WithVersion(initalVersionId);
        Response<BlobProperties> propertiesResponse = await initalVersionBlob.GetPropertiesAsync();
        PrintMetadata(propertiesResponse);

        // Request metadata on the current version.
        BlockBlobClient newVersionBlob = blockBlobClient.WithVersion(newVersionId);
        Response<BlobProperties> newPropertiesResponse = await newVersionBlob.GetPropertiesAsync();
        PrintMetadata(newPropertiesResponse);
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine(e.Message);
        Console.ReadLine();
        throw;
    }
    finally
    {
        await containerClient.DeleteAsync();
    }
}

static void PrintMetadata(Response<BlobProperties> propertiesResponse)
{
    if (propertiesResponse.Value.Metadata.Count > 0)
    {
        Console.WriteLine("Metadata values for version {0}:", propertiesResponse.Value.VersionId);
        foreach (var item in propertiesResponse.Value.Metadata)
        {
            Console.WriteLine("Key:{0}  Value:{1}", item.Key, item.Value);
        }
    }
    else
    {
        Console.WriteLine("Version {0} has no metadata.", propertiesResponse.Value.VersionId);
    }
}
```

## Next steps

- [Blob versioning (preview)](versioning-overview.md)
- [Soft delete for Azure Storage blobs](soft-delete-overview.md)
