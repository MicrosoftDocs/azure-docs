---
title: Use blob index tags to manage and find data on Azure Blob Storage
description: See examples of how to use blob index tags to categorize, manage, and query for blob objects.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 03/05/2021
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.reviewer: klaasl
ms.custom: devx-track-csharp
---

# Use blob index tags (preview) to manage and find data on Azure Blob Storage

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data. This article shows you how to set, get, and find data using blob index tags.

> [!IMPORTANT]
> Blob index tags are currently in **PREVIEW** and is available in all public regions. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

To learn more about this feature along with known issues and limitations, see [Manage and find Azure Blob data with blob index tags (preview)](storage-manage-find-blobs.md).

## Prerequisites

# [Portal](#tab/azure-portal)

- An Azure subscription registered and approved for access to the blob index preview
- Access to the [Azure portal](https://portal.azure.com/)

# [.NET](#tab/net)

As blob index is in preview, the .NET storage package is released in the preview NuGet feed. This library is subject to change during the preview period.

1. Set up your Visual Studio project to get started with the Azure Blob Storage client library v12 for .NET. To learn more, see [.NET Quickstart](storage-quickstart-blobs-dotnet.md)

2. In the NuGet Package Manager, Find the **Azure.Storage.Blobs** package, and install version **12.7.0-preview.1** or newer to your project. You can also run the PowerShell command: `Install-Package Azure.Storage.Blobs -Version 12.7.0-preview.1`

   To learn how, see [Find and install a package](/nuget/consume-packages/install-use-packages-visual-studio#find-and-install-a-package).

3. Add the following using statements to the top of your code file.

    ```csharp
    using Azure;
    using Azure.Storage.Blobs;
    using Azure.Storage.Blobs.Models;
    using Azure.Storage.Blobs.Specialized;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    ```

---

## Upload a new blob with index tags

This task can be performed by a [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) or a security principal that has been given permission to the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftstorage) via a custom Azure role.

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com/), select your storage account 

2. Navigate to the **Containers** option under **Blob service**, select your container

3. Select the **Upload** button and browse your local file system to find a file to upload as a block blob.

4. Expand the **Advanced** dropdown and go to the **Blob Index Tags** section

5. Input the key/value blob index tags that you want applied to your data

6. Select the **Upload** button to upload the blob

:::image type="content" source="media/storage-blob-index-concepts/blob-index-upload-data-with-tags.png" alt-text="Screenshot of the Azure portal showing how to upload a blob with index tags.":::

# [.NET](#tab/net)

The following example shows how to create an append blob with tags set during creation.

```csharp
static async Task BlobIndexTagsOnCreate()
   {
      BlobServiceClient serviceClient = new BlobServiceClient(ConnectionString);
      BlobContainerClient container = serviceClient.GetBlobContainerClient("mycontainer");

      try
      {
          // Create a container
          await container.CreateIfNotExistsAsync();

          // Create an append blob
          AppendBlobClient appendBlobWithTags = container.GetAppendBlobClient("myAppendBlob0.logs");

          // Blob index tags to upload
          AppendBlobCreateOptions appendOptions = new AppendBlobCreateOptions();
          appendOptions.Tags = new Dictionary<string, string>
          {
              { "Sealed", "false" },
              { "Content", "logs" },
              { "Date", "2020-04-20" }
          };

          // Upload data with tags set on creation
          await appendBlobWithTags.CreateAsync(appendOptions);
      }
      finally
      {
      }
   }
```

---

## Get, set, and update blob index tags

Getting blob index tags can be performed by a [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) or a security principal that has been given permission to the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftstorage) via a custom Azure role.

Setting and updating blob index tags can be performed by a [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) or a security principal that has been given permission to the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftstorage) via a custom Azure role.

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com/), select your storage account 

2. Navigate to the **Containers** option under **Blob Service**, select your container

3. Select your blob from the list of blobs within the selected container

4. The blob overview tab will display your blob's properties including any **Blob Index Tags**

5. You can get, set, modify, or delete any of the key/value index tags for your blob

6. Select the **Save** button to confirm any updates to your blob

:::image type="content" source="media/storage-blob-index-concepts/blob-index-get-set-tags.png" alt-text="Screenshot of the Azure portal showing how to get, set, update, and delete index tags on blobs.":::

# [.NET](#tab/net)

```csharp
static async Task BlobIndexTagsExample()
   {
      BlobServiceClient serviceClient = new BlobServiceClient(ConnectionString);
      BlobContainerClient container = serviceClient.GetBlobContainerClient("mycontainer");

      try
      {
          // Create a container
          await container.CreateIfNotExistsAsync();

          // Create a new append blob
          AppendBlobClient appendBlob = container.GetAppendBlobClient("myAppendBlob1.logs");
          await appendBlob.CreateAsync();

          // Set or update blob index tags on existing blob
          Dictionary<string, string> tags = new Dictionary<string, string>
          {
              { "Project", "Contoso" },
              { "Status", "Unprocessed" },
              { "Sealed", "true" }
          };
          await appendBlob.SetTagsAsync(tags);

          // Get blob index tags
          Response<IDictionary<string, string>> tagsResponse = await appendBlob.GetTagsAsync();
          Console.WriteLine(appendBlob.Name);
          foreach (KeyValuePair<string, string> tag in tagsResponse.Value)
          {
              Console.WriteLine($"{tag.Key}={tag.Value}");
          }

          // List blobs with all options returned including blob index tags
          await foreach (BlobItem blobItem in container.GetBlobsAsync(BlobTraits.All))
          {
              Console.WriteLine(Environment.NewLine + blobItem.Name);
              foreach (KeyValuePair<string, string> tag in blobItem.Tags)
              {
                  Console.WriteLine($"{tag.Key}={tag.Value}");
              }
          }

          // Delete existing blob index tags by replacing all tags
          Dictionary<string, string> noTags = new Dictionary<string, string>();
          await appendBlob.SetTagsAsync(noTags);

      }
      finally
      {
      }
   }
```

---

## Filter and find data with blob index tags

This task can be performed by a [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) or a security principal that has been given permission to the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/filter/action` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftstorage) via a custom Azure role.

# [Portal](#tab/azure-portal)

Within the Azure portal, the blob index tags filter automatically applies the `@container` parameter to scope your selected container. If you wish to filter and find tagged data across your entire storage account, use our REST API, SDKs, or tools.

1. In the [Azure portal](https://portal.azure.com/), select your storage account. 

2. Navigate to the **Containers** option under **Blob service**, select your container

3. Select the **Blob Index tags filter** button to filter within the selected container

4. Enter a blob index tag key and tag value

5. Select the **Blob Index tags filter** button to add additional tag filters (up to 10)

:::image type="content" source="media/storage-blob-index-concepts/blob-index-tag-filter-within-container.png" alt-text="Screenshot of the Azure portal showing how to Filter and find tagged blobs using index tags":::

# [.NET](#tab/net)

```csharp
static async Task FindBlobsByTagsExample()
   {
      BlobServiceClient serviceClient = new BlobServiceClient(ConnectionString);
      BlobContainerClient container1 = serviceClient.GetBlobContainerClient("mycontainer");
      BlobContainerClient container2 = serviceClient.GetBlobContainerClient("mycontainer2");

      // Blob index queries and selection
      String singleEqualityQuery = @"""Archive"" = 'false'";
      String andQuery = @"""Archive"" = 'false' AND ""Priority"" = '01'";
      String rangeQuery = @"""Date"" >= '2020-04-20' AND ""Date"" <= '2020-04-30'";
      String containerScopedQuery = @"@container = 'mycontainer' AND ""Archive"" = 'false'";

      String queryToUse = containerScopedQuery;

      try
      {
          // Create a container
          await container1.CreateIfNotExistsAsync();
          await container2.CreateIfNotExistsAsync();

          // Create append blobs
          AppendBlobClient appendBlobWithTags0 = container1.GetAppendBlobClient("myAppendBlob00.logs");
          AppendBlobClient appendBlobWithTags1 = container1.GetAppendBlobClient("myAppendBlob01.logs");
          AppendBlobClient appendBlobWithTags2 = container1.GetAppendBlobClient("myAppendBlob02.logs");
          AppendBlobClient appendBlobWithTags3 = container2.GetAppendBlobClient("myAppendBlob03.logs");
          AppendBlobClient appendBlobWithTags4 = container2.GetAppendBlobClient("myAppendBlob04.logs");
          AppendBlobClient appendBlobWithTags5 = container2.GetAppendBlobClient("myAppendBlob05.logs");
           
          // Blob index tags to upload
          CreateAppendBlobOptions appendOptions = new CreateAppendBlobOptions();
          appendOptions.Tags = new Dictionary<string, string>
          {
              { "Archive", "false" },
              { "Priority", "01" },
              { "Date", "2020-04-20" }
          };
          
          CreateAppendBlobOptions appendOptions2 = new CreateAppendBlobOptions();
          appendOptions2.Tags = new Dictionary<string, string>
          {
              { "Archive", "true" },
              { "Priority", "02" },
              { "Date", "2020-04-24" }
          };

          // Upload data with tags set on creation
          await appendBlobWithTags0.CreateAsync(appendOptions);
          await appendBlobWithTags1.CreateAsync(appendOptions);
          await appendBlobWithTags2.CreateAsync(appendOptions2);
          await appendBlobWithTags3.CreateAsync(appendOptions);
          await appendBlobWithTags4.CreateAsync(appendOptions2);
          await appendBlobWithTags5.CreateAsync(appendOptions2);

          // Find Blobs given a tags query
          Console.WriteLine("Find Blob by Tags query: " + queryToUse + Environment.NewLine);

          List<TaggedBlobItem> blobs = new List<TaggedBlobItem>();
          await foreach (TaggedBlobItem taggedBlobItem in serviceClient.FindBlobsByTagsAsync(queryToUse))
          {
              blobs.Add(taggedBlobItem);
          }

          foreach (var filteredBlob in blobs)
          {
              Console.WriteLine($"BlobIndex result: ContainerName= {filteredBlob.ContainerName}, " +
                  $"BlobName= {filteredBlob.Name}");
          }

      }
      finally
      {
      }
   }
```

---

## Lifecycle management with blob index tag filters

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com/), select your storage account. 

2. Navigate to the **Lifecycle Management** option under **Blob Service**

3. Select *Add rule* and then fill out the Action set form fields

4. Select **Filter** set to add optional filter for prefix match and blob index match

  :::image type="content" source="media/storage-blob-index-concepts/blob-index-match-lifecycle-filter-set.png" alt-text="Screenshot of the Azure portal showing how to add index tags for lifecycle management.":::

5. Select **Review + add** to review the rule settings

  :::image type="content" source="media/storage-blob-index-concepts/blob-index-lifecycle-management-example.png" alt-text="Screenshot of the Azure portal showing a lifecycle management rule with blob index tags filter example":::

6. Select **Add** to apply the new rule to the lifecycle management policy

# [.NET](#tab/net)

[Lifecycle management](storage-lifecycle-management-concepts.md) policies are applied for each storage account at the control plane level. For .NET, install the [Microsoft Azure Management Storage Library](https://www.nuget.org/packages/Microsoft.Azure.Management.Storage/) version 16.0.0 or higher.

---

## Next steps

 - Learn more about blob index tags, see [Manage and find Azure Blob data with blob index tags (preview)](storage-manage-find-blobs.md )
 - Learn more about lifecycle management, see [Manage the Azure Blob Storage lifecycle](storage-lifecycle-management-concepts.md)
