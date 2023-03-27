---
title: Create Data Registry (preview)
titleSuffix: Azure Maps
description: Learn how to create Data Registry.
author: faterceros
ms.author: aterceros
ms.date: 2/14/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# How to create data registry (preview)

The [data registry] service enables you to register data content in an Azure Storage Account with your Azure Maps account. An example of data might include a collection of Geofences used in the Azure Maps Geofencing service. Another example is ZIP files containing drawing packages (DWG) or GeoJSON files that Azure Maps Creator uses to create or update indoor maps.

## Prerequisites

- [Azure Maps account]
- [Subscription key]
- An [Azure storage account][create storage account]

>[!IMPORTANT]
>
> - This article uses the `us.atlas.microsoft.com` geographical URL. If your account wasn't created in the United States, you must use a different geographical URL.  For more information, see [Access to Creator services](how-to-manage-creator.md#access-to-creator-services).
> - In the URL examples in this article you will need to replace:
>   - `{Azure-Maps-Subscription-key}` with your Azure Maps [subscription key].
>   - `{udid}` with the user data ID of your data registry. For more information, see [The user data ID](#the-user-data-id).

## Prepare to register data in Azure Maps

Before you can register data in Azure Maps, you need to create an environment containing all required components. You need a storage account with one or more containers that hold the files you wish to register and managed identities for authentication. This section explains how to prepare your Azure environment to register data in Azure Maps.

### Create managed identities

There are two types of managed identities: **system-assigned** and **user-assigned**. System-assigned managed identities have their lifecycle tied to the resource that created them. User-assigned managed identities can be used on multiple resources. For more information, see [managed identities for Azure resources][managed identity].

Use the following steps to create a managed identity, add it to your Azure Maps account.

# [system-assigned](#tab/System-assigned)

Create a system assigned managed identity:

1. Go to your Azure Maps account in the [Azure portal].
1. Select **Identity** from the left menu.
1. Toggle the **Status** to **On**.

# [user-assigned](#tab/User-assigned)

Create a user assigned managed identity:

1. Go to the [Azure portal] and select **Create a resource**.
1. In the **Search services and marketplace** control, enter **user assigned managed identity**.
1. In the **Create User Assigned Managed Identity** page, select your subscription, resource group, region and a name for your managed identify.
1. Select **Review + create**, then once ready, **Create**.

    :::image type="content" source="./media/data-registry/create-user-assigned-managed-identity.png" lightbox="./media/data-registry/create-user-assigned-managed-identity.png" alt-text="A screenshot of the Create User Assigned Managed Identity page.":::

1. In your Azure Maps account, select **Identity** in the **Settings** section of the left menu.
1. Select the **User assigned** tab.
1. Select **+ Add**.
1. In the **Add user assigned managed identity** screen, select the desired **Subscription** and managed identity.
1. Select **Add**

    :::image type="content" source="./media/data-registry/add-user-assigned-managed-identity.png" lightbox="./media/data-registry/add-user-assigned-managed-identity.png" alt-text="A screenshot that demonstrates how to add a user assigned managed identity.":::

The user defined managed identity should now be added to your Azure Maps account.

---

For more information, see [managed identities for Azure resources][managed identity].

### Create a container and upload data files

Before adding files to a data registry, you must upload them into a container in your [Azure storage account][storage account overview]. Containers are similar to a directory in a file system, they're how your files are organized in your Azure storage account.

To create a container in the [Azure portal], follow these steps:

1. From within your Azure storage account, select **Containers** from the **Data storage** section in the navigation pane.
1. Select **+ Container** in the **Containers** pane to bring up the **New container** pane.
1. Select **Create** to create the container.

    :::image type="content" source="./media/data-registry/create-container.png" lightbox="./media/data-registry/create-container.png" alt-text="A screenshot of the new container page in an Azure storage account.":::

    Once your container has been created, you can upload files into it.

1. Once the container is created, select it.

    :::image type="content" source="./media/data-registry/select-container.png" lightbox="./media/data-registry/select-container.png" alt-text="A screenshot showing the new container just created in an Azure storage account.":::

1. Select **Upload** from the toolbar, select one or more files
1. Select the **Upload** button.

    :::image type="content" source="./media/data-registry/upload-blob-container.png" lightbox="./media/data-registry/upload-blob-container.png" alt-text="A screenshot of the upload blob page when creating a container.":::

### Add a datastore  

Once you've created an Azure storage account with files uploaded into one or more containers, you're ready to create the datastore that links the storage accounts to your Azure Maps account.

> [!IMPORTANT]
> All storage accounts linked to an Azure Maps account must be in the same geographic location. For more information, see [Azure Maps service geographic scope][geographic scope].
> [!NOTE]
> If you do not have a storage account see [Create a storage account][create storage account].

1. Select **Datastore** from the left menu in your Azure Maps account.
1. Select the **Add** button. An **Add datastore** screen appears on the right side.
1. Enter the desired **Datastore ID** then select the **Subscription name** and **Storage account** from the drop-down lists.
1. Select **Add**.

    :::image type="content" source="./media/data-registry/add-datastore.png" lightbox="./media/data-registry/add-datastore.png" alt-text="A screenshot showing the add datastore screen.":::

The new datastore will now appear in the list of datastores.

### Assign roles to managed identities and add them to the datastore

Once your managed identities and datastore are created, you can add the managed identities to the datastore and simultaneously assign them the **Contributor** and **Storage Blob Data Reader** roles. While it's possible to add roles to your managed identities directly in your managed identities or storage account, you can easily do this while simultaneously associating them with your Azure Maps datastore directly in the datastore pane.

> [!NOTE]
> Each managed identity associated with the datastore will need the **Contributor** and **Storage Blob Data Reader** roles granted to them. If you do not have the required permissions to grant roles to managed identities, consult your Azure administrator.
To assign roles to your managed identities and associate them with a datastore:

1. Select **Datastore** from the left menu in your **Azure Maps account**.
1. Select one or more datastores from the list, then **Assign roles**.
1. Select the **Managed identity** to associate to the selected datastore(s) from the drop-down list.
1. Select both **Contributor** and **Storage Blob Data Reader** in the **Roles to assign** drop-down list.

    :::image type="content" source="./media/data-registry/assign-role-datastore.png" lightbox="./media/data-registry/assign-role-datastore.png" alt-text="A screenshot showing the assign roles to datastore screen.":::

1. Select the **Assign** button.

## Data registry properties

With a datastore created in your Azure Maps account, you're ready to gather the properties required to create the data registry.

There are the AzureBlob properties that you'll pass in the body of the HTTP request, and [The user data ID](#the-user-data-id) passed in the URL.

### The AzureBlob

The `AzureBlob` is a JSON object that defines properties required to create the data registry.

| Property       | Description                                                                              |
|----------------|------------------------------------------------------------------------------------------|
| `kind`         | Defines what type of object being registered. Currently **AzureBlob** is the only kind that is supported. |
| `dataFormat`   | The data format of the file located in **blobUrl**. Its format can either be **GeoJSON** for the spatial service or **ZIP** for the conversion service. |
| `msiClientId`  | The ID of the managed identity being used to create the data registry.                   |
|`linkedResource`| The ID of the datastore registered in the Azure Maps account.<BR>The datastore contains a link to the file being registered. |
| `blobUrl`      | A URL pointing to the Location of the AzurebBlob, the file imported into your container. |

The following two sections will provide you with details how to get the values to use for the [msiClientId](#the-msiclientid-property), [blobUrl](#the-bloburl-property) properties.

#### The msiClientId property

The `msiClientId` property is the ID of the managed identity used to create the data registry. There are two types of managed identities: **system-assigned** and **user-assigned**. System-assigned managed identities have their lifecycle tied to the resource that created them. User-assigned managed identities can be used on multiple resources. For more information, see [What are managed identities for Azure resources?][managed identity].

# [system-assigned](#tab/System-assigned)

When using System-assigned managed identities, you don't need to provide a value for the `msiClientId` property. The data registry service will automatically use the system assigned identity of the Azure Maps account when `msiClientId` is null.

# [user-assigned](#tab/User-assigned)

The value used for the `msiClientId` property is the client ID of a user assigned managed identity.

1. In your Azure Maps account, select **Identity** from the left menu.
1. Hover over the name of the managed identify until it appears as a link, then select it.

    :::image type="content" source="./media/data-registry/select-managed-identity.png" lightbox="./media/data-registry/select-managed-identity.png" alt-text="A screenshot showing the identity page in the Azure Maps account with the new identity selected in the user assigned tab.":::

1. Copy the **Client ID**.

    :::image type="content" source="./media/data-registry/client-id.png" lightbox="./media/data-registry/client-id.png" alt-text="A screenshot showing how to select the client ID in the managed identities pane in Azure.":::

---

#### The blobUrl property

The `blobUrl` property is the path to the file being registered. You can get this value from the container that it was added to.
[data registry]
1. Select your **storage account** in the **Azure portal**.
1. Select **Containers** from the left menu.
1. A list of containers will appear. Select the container that contains the file you wish to register.
1. The container opens, showing a list of the files previously uploaded.
1. Select the desired file, then copy the URL.

    :::image type="content" source="./media/data-registry/blobUrl.png" lightbox="./media/data-registry/blobUrl.png" alt-text="A screenshot showing how to select the URL used as the blobUrl property.":::

### The user data ID

The user data ID (`udid`) of the data registry is a user-defined GUID that must conform to the following Regex pattern:

```azurepowershell
^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$
```

> [!TIP]
> The `udid` is a user-defined GUID that must be supplied when creating a data registry. If you want to be certain you have a globally unique identifier (GUID), consider creating it by running a GUID generating tool such as the Guidgen.exe command line program (Available with [Visual Studio][Visual Studio]).

## Create a data registry

Now that you have your storage account with the desired files linked to your Azure Maps account through the datastore and have gathered all required properties, you're ready to use the [data registry] API to register those files. If you have multiple files in your Azure storage account that you want to register, you'll need to run the register request for each file (`udid`).

> [!NOTE]
> The maximum size of a file that can be registered with an Azure Maps datastore is one gigabyte.
To create a data registry:

1. Provide the information needed to reference the storage account that is being added to the data registry in the body of your HTTP request. The information must be in JSON format and contain the following fields:

    ```json
    {
    "kind": "AzureBlob",
        "azureBlob": {
            "dataFormat": "geojson",
            "msiClientId": "{The client ID of the managed identity}",
            "linkedResource": "{datastore ID}",
            "blobUrl": "https://teststorageaccount.blob.core.windows.net/testcontainer/test.geojson"
        }
    }
    ```

    For more information on the properties required in the HTTP request body, see [Data registry properties](#data-registry-properties).

1. Once you have the body of your HTTP request ready, execute the following **HTTP PUT request**:

    ```http
    https://us.atlas.microsoft.com/dataRegistries/{udid}?api-version=2022-12-01-preview&subscription-key={Your-Azure-Maps-Subscription-key} 
    
    ```

   For more information on the `udid` property, see [The user data ID](#the-user-data-id).

1. Copy the value of the **Operation-Location** key from the response header.

> [!TIP]
> If the contents of a previously registered file is modified, it will fail its [data validation](#data-validation) and won't be usable in Azure Maps until it's re-registered. To re-register a file, rerun the register request, passing in the same [AzureBlob](#the-azureblob) used to create the original registration.
The value of the **Operation-Location** key is the status URL that you'll use to check the status of the data registry creation in the next section, it contains the operation ID used by the [Get operation][Get operation] API.

> [!NOTE]
> The value of the **Operation-Location** key will not contain the `subscription-key`, you will need to add that to the request URL when using it to check the data registry creation status.

### Check the data registry creation status

To (optionally) check the status of the data registry creation process, enter the status URL you copied in the [Create a data registry](#create-a-data-registry) section, and add your subscription key as a query string parameter. The request should look similar to the following URL:

```http
https://us.atlas.microsoft.com/dataRegistries/operations/{udid}?api-version=2022-12-01-preview&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
```

## Get a list of all files in the data registry

To get a list of all files registered in an Azure Maps account using the [List][list] request:

```http
https://us.atlas.microsoft.com/dataRegistries?api-version=2022-12-01-preview&subscription-key={Azure-Maps-Subscription-key}
```

The following is a sample response showing three possible statuses, completed, running and failed:

```json
{
  "value": [
    {
      "udid": "f6495f62-94f8-0ec2-c252-45626f82fcb2",
      "description": "Contoso Indoor Design",
      "kind": "AzureBlob",
      "azureBlob": {
        "dataFormat": "zip",
        "msiClientId": "3263cad5-ed8b-4829-b72b-3d1ba556e373",
        "linkedResource": "my-storage-account",
        "blobUrl": "https://mystorageaccount.blob.core.windows.net/my-container/my/blob/path1.zip",
        "downloadURL": "https://us.atlas.microsoft.com/dataRegistries/f6495f62-94f8-0ec2-c252-45626f82fcb2/content?api-version=2022-12-01-preview",
        "sizeInBytes": 29920,
        "contentMD5": "CsFxZ2YSfxw3cRPlqokV0w=="
      },
      "status": "Completed"
    },
    {
      "udid": "8b1288fa-1958-4a2b-b68e-13a7i5af7d7c",
      "kind": "AzureBlob",
      "azureBlob": {
        "dataFormat": "geojson",
        "msiClientId": "3263cad5-ed8b-4829-b72b-3d1ba556e373",
        "linkedResource": "my-storage-account",
        "blobUrl": "https://mystorageaccount.blob.core.windows.net/my-container/my/blob/path2.geojson",
        "downloadURL": "https://us.atlas.microsoft.com/dataRegistries/8b1288fa-1958-4a2b-b68e-13a7i5af7d7c/content?api-version=2022-12-01-preview",
        "sizeInBytes": 1339
      },
      "status": "Running"
    },
    {
      "udid": "7c1288fa-2058-4a1b-b68f-13a6h5af7d7c",
      "description": "Contoso Geofence GeoJSON",
      "kind": "AzureBlob",
      "azureBlob": {
        "dataFormat": "geojson",
        "linkedResource": "my-storage-account",
        "blobUrl": "https://mystorageaccount.blob.core.windows.net/my-container/my/blob/path3.geojson",
        "downloadURL": "https://us.atlas.microsoft.com/dataRegistries/7c1288fa-2058-4a1b-b68f-13a6h5af7d7c/content?api-version=2022-12-01-preview",
        "sizeInBytes": 1650,
        "contentMD5": "rYpEfIeLbWZPyaICGEGy3A=="
      },
      "status": "Failed",
      "error": {
        "code": "ContentMD5Mismatch",
        "message": "Actual content MD5: sOJMJvFParkSxBsvvrPOMQ== doesn't match expected content MD5: CsFxZ2YSfxw3cRPlqokV0w==."
      }
    }
  ]
}
```

The data returned when running the list request is similar to the data provided when creating a registry with a few additions:

| property    | description                       |
|-------------|-----------------------------------|
| contentMD5  | MD5 hash created from the contents of the file being registered. For more information, see [Data validation](#data-validation)  |
| downloadURL | The download URL of the underlying data. Used to [Get content from a data registry](#get-content-from-a-data-registry). |
| sizeInBytes | The size of the content in bytes. |

## Get content from a data registry

Once you've uploaded one or more files to an Azure storage account, created and Azure Maps datastore to link to those files, then registered them using the [register] API, you can access the data contained in the files.

Use the `udid` to get the content of a file registered in an Azure Maps account:

 ```http
https://us.atlas.microsoft.com/dataRegistries/{udid}/content?api-version=2022-12-01-preview&subscription-key={Your-Azure-Maps-Subscription-key} 
```

The contents of the file will appear in the body of the response. For example, a text based GeoJSON file will appear similar to the following example:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -122.126986,
          47.639754
        ]
      },
      "properties": {
        "geometryId": "001",
        "radius": 500
      }
    }
  ]
}
```

The file type is returned in the `content-type` key of the response header.

Both text and binary files can be saved to a local hard drive or used directly in other processes like importing into the Azure Maps Creator conversion process.

## Replace a data registry

If you need to replace a previously registered file with another file, rerun the register request, passing in the same [AzureBlob](#the-azureblob) used to create the original registration, except for the [blobUrl](#the-bloburl-property). The `BlobUrl` needs to be modified to point to the new file.

## Data validation

When you register a file in Azure Maps using the data registry API, an MD5 hash is created from the contents of the file, encoding it into a 128-bit fingerprint and saving it in the `AzureBlob` as the `contentMD5` property. The MD5 hash stored in the `contentMD5` property is used to ensure the data integrity of the file. Since the MD5 hash algorithm always produces the same output given the same input, the data validation process can compare the `contentMD5` property of the file when it was registered against a hash of the file in the Azure storage account to check that it's intact and unmodified. If the hash isn't the same, the validation fails. If the file in the underlying storage account changes, the validation will fail. If you need to modify the contents of a file that has been registered in Azure Maps, you'll need to register it again.

[data registry]: /rest/api/maps/data-registry
[list]: /rest/api/maps/data-registry/list
[Register]: /rest/api/maps/data-registry/register-or-replace
[Get operation]: /rest/api/maps/data-registry/get-operation

[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[storage account overview]: /azure/storage/common/storage-account-overview
[create storage account]: /azure/storage/common/storage-account-create?tabs=azure-portal
[managed identity]: /azure/active-directory/managed-identities-azure-resources/overview
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Azure portal]: https://portal.azure.com/
[Visual Studio]: https://visualstudio.microsoft.com/downloads/
[geographic scope]: geographic-scope.md