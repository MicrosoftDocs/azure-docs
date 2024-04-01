---
title: Manage block blobs with Azure CLI
titleSuffix: Azure Storage
description: Manage blobs with Azure CLI 
author: StevenMatthew

ms.author: shaas
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/28/2023
ms.devlang: azurecli
ms.custom: devx-track-azurecli
---

# Manage block blobs with Azure CLI

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are optimized for uploading large amounts of data efficiently. Block blobs are ideal for storing images, documents, and other types of data not subjected to random read and write operations. This article explains how to work with block blobs.

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-h3.md)]

- This article requires version 2.0.46 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

### Authorize access to Blob storage

You can authorize access to Blob storage from the Azure CLI either with Microsoft Entra credentials or by using a storage account access key. Using Microsoft Entra credentials is recommended, and this article's examples use Microsoft Entra ID exclusively.

Azure CLI commands for data operations against Blob storage support the `--auth-mode` parameter, which enables you to specify how to authorize a given operation. Set the `--auth-mode` parameter to *login* to authorize with Microsoft Entra credentials. Only Blob storage data operations support the `--auth-mode` parameter. Management operations, such as creating a resource group or storage account, automatically use Microsoft Entra credentials for authorization. For more information, see [Choose how to authorize access to blob data with Azure CLI](authorize-data-operations-cli.md).

Run the `login` command to open a browser and connect to your Azure subscription.

```azurecli-interactive

az login

```

### Create a container

All blob data is stored within containers, so you'll need at least one container resource before you can upload data. If needed, use the following example to create a storage container. For more information, see [Managing blob containers using Azure CLI](blob-containers-cli.md).

```azurecli-interactive

#!/bin/bash
storageAccount="<storage-account>"
containerName="demo-container"

# Create a container object
az storage container create \
    --name $containerName \
    --account-name $storageAccount
    --auth-mode login

```

When you use the examples included in this article, you'll need to replace the placeholder values in brackets with your own values. For more information about signing into Azure with Azure CLI, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

## Upload blobs

Azure CLI offers commands that perform operations on one resource or on multiple resources, depending on your requirements.

To upload a file to a block blob, pass the required parameter values to the `az storage blob upload` command. Supply the source path and file name with the `--file` parameter, and the name of the destination container with the `--container-name` parameter. You'll also need to supply the `--account-name` parameter. This command creates a new blob or overwrites the original blob if it already exists.

You can use the `az storage blob upload-batch` command to recursively upload multiple blobs to a storage container. You can use Unix filename pattern matching specify a range of files to upload with the `--pattern` parameter. The supported patterns are `*`, `?`, `[seq]`, and `[!seq]`. To learn more, refer to the Python documentation on [Unix filename pattern matching](https://docs.python.org/3/library/fnmatch.html).

In the following example, the first operation uses the `az storage blob upload` command to upload a single, named file. The source file and destination storage container are specified with the `--file` and `--container-name` parameters.  

The second operation demonstrates the use of the `az storage blob upload-batch` command to upload multiple files. The `--if-modified-since` parameter ensures that only files modified within the last seven days will be uploaded. The value supplied by this parameter must be provided in UTC format.

```azurecli-interactive

#!/bin/bash
storageAccount="<storage-account>"
containerName="demo-container"
lastModified=`date -d "7 days ago" '+%Y-%m-%dT%H:%MZ'`

path="C:\\temp\\"
filename="demo-file.txt"
imageFiles="*.png"
file="$path$filename"

#Upload a single named file
az storage blob upload \
    --file $file \
    --container-name $containerName \
    --account-name $storageAccount \
    --auth-mode login

#Upload multiple image files recursively
az storage blob upload-batch \
    --destination $containerName \
    --source $path \
    --pattern *.png \
    --account-name $storageAccount \
    --auth-mode login \
    --if-modified-since $lastModified

```

## List blobs

By default, the `az storage blob list` command lists all blobs stored within a container. You can use various approaches to refine the scope of your search. There's no restriction on the number of containers or blobs a storage account may have. To potentially avoid retrieving thousands of blobs, it's a good idea to limit the amount of data returned.

Use the `--prefix` parameter to select either a single known file or a range of files whose names begin with a defined string.

By default, only blobs are returned in a listing operation. In some scenarios, you may want to pass a value for the `--include` parameter to return additional types of objects such as soft-deleted blobs, snapshots, and versions. These values can be combined to return more than multiple object types.

The `--num-results` parameter can be used to limit the number of unfiltered blobs returned from a container. A service limit of 5,000 is imposed on all Azure resources. This limit ensures that manageable amounts of data are retrieved and that performance isn't impacted. If the number of blobs returned exceeds either the `--num-results` value or the service limit, a continuation token is returned. This token allows you to use multiple requests to retrieve any number of blobs. More information is available on [Enumerating blob resources](/rest/api/storageservices/enumerating-blob-resources).

The following example shows several approaches used to provide a list of blobs. The first approach lists a single blob within a specific container resource. The second approach uses the `--prefix` parameter to list all blobs in all containers with a prefix of *louis*. The search is restricted to five containers using the `--num-results` parameter. The third approach uses `--num-results` and `--marker` parameters to limit the retrieval of all blobs within a container.

For additional information, see the [az storage blob list](/cli/azure/storage/blob#az-storage-blob-list) reference.

```azurecli-interactive

#!/bin/bash
storageAccount="<storage-account>"
blobName="demo-file.txt"
containerName="demo-container"
blobPrefix="img-louis"
numResults=5

#Approach 1: List all blobs in a named container
az storage blob list \
    --container $containerName \
    --account-name $storageAccount \
    --prefix $blobName
    --auth-mode login

#Approach 2: Use the --prefix parameter to list blobs in all containers

containerList=$( \
    az storage container list \
        --query "[].name" \
        --num-results $numResults \
        --account-name $storageAccount \
        --auth-mode login \
        --output tsv 
)
for row in $containerList
do
    tmpName=$(echo $row | sed -e 's/\r//g')
    echo $tmpName
    az storage blob list \
        --prefix $blobPrefix \
        --container $tmpName \
        --account-name $storageAccount \
        --auth-mode login
done
```

## Download a blob

Depending on your use case, you'll use either the `az storage blob download` or `az storage blob download-batch` command to download blobs. To download an individual blob, call the `az storage blob download` command directly and pass values for the `--container-name`, `--file`, and `--name` parameters. The blob will be downloaded to the shell directory by default, but an alternate location can be specified. The operation will fail with an error if your specified path doesn't exist.

To recursively download multiple blobs from a storage container, use the `az storage blob download-batch` command. This command supports Unix filename pattern matching with the `--pattern` parameter. The supported patterns are `*`, `?`, `[seq]`, and `[!seq]`. To learn more, refer to the Python documentation on [Unix filename pattern matching](https://docs.python.org/3/library/fnmatch.html).

The following sample code provides an example of both single and multiple download approaches. It also offers a simplified approach to searching all containers for specific files using a wildcard. Because some environments may have many thousands of resources, using the `--num-results` parameter is recommended.

For additional information, see the [az storage blob download](/cli/azure/storage/blob#az-storage-blob-download) and [az storage blob download batch](/cli/azure/storage/blob#az-storage-blob-download-batch)reference.

```azurecli-interactive
#!/bin/bash
#Set variables
storageAccount="<storage-account>"
containerName="demo-container"

destinationPath="C:\\temp\\downloads\\"
destinationFilename="downloadedBlob.txt"
file="$destinationPath$destinationFilename"
sourceBlobName="demo-file.txt"

#Download a single named blob

az storage blob download \
    --container $containerName \
    --file $file \
    --name $sourceBlobName \
    --account-name $storageAccount \
    --auth-mode login

#Download multiple blobs using a pattern value

az storage blob download-batch \
    --destination $destinationPath \
    --source $containerName \
    --pattern images/*.png \
    --account-name $storageAccount \
    --auth-mode login

#Use a loop to download matching blobs in a list of containers

containerList=$( \
    az storage container list \
        --query "[].name" \
        --num-results 5 \
        --account-name $storageAccount \
        --auth-mode login \
        --output tsv 
)
for row in $containerList
do
    tmpName=$(echo $row | sed -e 's/\r//g')
    echo $tmpName
   
    az storage blob download-batch \
        --destination $destinationPath \
        --source $tmpName \
        --pattern *louis*.* \
        --account-name $storageAccount \
        --auth-mode login
done

```

## Manage blob properties and metadata

A blob exposes both system properties and user-defined metadata. System properties exist on each Blob Storage resource. Some properties are read-only, while others can be read or set. Under the covers, some system properties map to certain standard HTTP headers.

User-defined metadata consists of one or more name-value pairs that you specify for a Blob Storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes, and don't affect how the resource behaves.

### Reading blob properties

To read blob properties or metadata, you must first retrieve the blob from the service. Use the `az storage blob show` command to retrieve a blob's properties and metadata, but not its content. The following example retrieves a blob and lists its properties.

For additional information, see the [az storage blob show](/cli/azure/storage/blob#az-storage-blob-show) reference.

```azurecli-interactive
#!/bin/bash
#Set variables
storageAccount="<storage-account>"
containerName="demo-container"

az storage blob show \
    --container  demo-container \
    --name demo-file.txt \
    --account-name $storageAccount \
    --auth-mode login
```

### Read and write blob metadata

Blob metadata is an optional set of name/value pairs associated with a blob. As shown in the previous example, there's no metadata associated with a blob initially, though it can be added when necessary. To read, use the `az storage blob metadata show` command. To update blob metadata, you'll use `az storage blob metadata update` and supply an array of key-value pairs. For more information, see the [az storage blob metadata](/cli/azure/storage/blob/metadata) reference.

For additional information, see the [az storage blob metadata](/cli/azure/storage/blob#az-storage-blob-metadata) reference.

The example below first updates and then commits a blob's metadata, and then retrieves it.

```azurecli-interactive
#!/bin/bash
storageAccount="<storage-account>"
containerName="demo-container"
blobName="blue-moon.mp3"

metadata=("Written=1934" "Recorded=1958")
metadata+=("Lyricist=Lorenz Hart")
metadata+=("Composer=Richard Rogers")
metadata+=("Artist=Tony Bennett")

#Update metadata
az storage blob metadata update \
    --container-name $containerName \
    --name $blobName \
    --metadata "${metadata[@]}" \
    --account-name $storageAccount \
    --auth-mode login

#Retrieve updated blob metadata
az storage blob metadata show \
    --container-name $containerName \
    --name $blobName \
    --account-name $storageAccount \
    --auth-mode login
```

## Copy operations for blobs

There are many scenarios in which blobs of different types may be copied. Examples in this article are limited to block blobs. Azure CLI offers commands that perform operations on one resource or on multiple resources, depending on your requirements.

To copy a specific blob, use the `az storage blob copy start` command and specify values for source and destination containers and blobs. It's also possible to provide a uniform resource identifier (URI), share, or shared access signature (SAS) as the source.

You can also specify the conditions under which the blob will be copied. These conditions can be set for either the source or destination blob. You can reference the last modified date, tag data, or ETag value. You may, for example, choose to copy blobs that haven't been recently modified to a separate container. For more information, see [Specifying conditional headers for Blob service operations](/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations).

You can use the `az storage blob copy start-batch` command to recursively copy multiple blobs between storage containers within the same storage account. This command requires values for the `--source-container` and `--destination-container` parameters, and can copy all files between the source and destination. Like other CLI batch commands, this command supports Unix filename pattern matching with the `--pattern` parameter. The supported patterns are `*`, `?`, `[seq]`, and `[!seq]`. To learn more, refer to the Python documentation on [Unix filename pattern matching](https://docs.python.org/3/library/fnmatch.html).

> [!NOTE]
> Consider the use of AzCopy for ease and performance, especially when copying blobs between storage accounts. AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. Find out more about how to [Get started with AzCopy](../common/storage-use-azcopy-v10.md).

For more information, see the [az storage blob copy](/cli/azure/storage/blob/copy) reference.

The following sample code provides an example of both single and multiple copy operations. Because some environments may have many thousands of resources, using the `--num-results` parameter is recommended. The first example copies the **secret-town-road.png** blob from the **photos** container to the **locations** container. Both containers exist within the same storage account. The result verifies the success of the copy operation.

```azurecli-interactive
#!/bin/bash
storageAccount="<storage-account>"
sourceContainer="photos"
blobName="secret-town-road.jpg"
destContainer="locations"

az storage blob copy start \
    --destination-container $destContainer \
    --destination-blob $blobName \
    --source-container $sourceContainer \
    --source-blob $blobName \
    --account-name $storageAccount \
    --auth-mode login
```

## Snapshot blobs

Any leases associated with the base blob don't affect the snapshot. You can’t acquire a lease on a snapshot. Read more about [Blob snapshots](snapshots-overview.md). For more information, see the [az storage blob snapshot](/cli/azure/storage/blob#az-storage-blob-snapshot) reference.

The following sample code retrieves a blob from a storage container and creates a snapshot of it.

```azurecli-interactive
#!/bin/bash
storageAccount="<storage-account>"
containerName="demo-container"
blobName="demo-file.txt"

az storage blob snapshot \
    --container-name $containerName \
    --name Blue-Moon.mp3 \
    --account-name $storageAccount \
    --auth-mode login

```

## Set blob tier

When you change a blob's tier, you move the blob and all of its data to the target tier. You can change the tier between **hot**, **cool**, and **archive** with the `az storage blob set-tier` command.

Depending on your requirements, you may also utilize the *Copy Blob* operation to copy a blob from one tier to another. The *Copy Blob* operation will create a new blob in the desired tier while leaving the source blob remains in the original tier.

Changing tiers from **cool** or **hot** to **archive** takes place almost immediately. After a blob is moved to the **archive** tier, it's considered to be offline and can't be read or modified. Before you can read or modify an archived blob's data, you'll need to rehydrate it to an online tier. Read more about [Blob rehydration from the archive tier](archive-rehydrate-overview.md).

For additional information, see the [az storage blob set-tier](/cli/azure/storage/blob#az-storage-blob-set-tier) reference.

The following sample code sets the tier to **hot** for a single, named blob within the `archive` container.

```azurecli-interactive
#!/bin/bash
storageAccount="<storage-account>"
containerName="demo-container"

az storage blob set-tier 
    --container-name $containerName \
    --name Blue-Moon.mp3 \
    --tier Hot \
    --account-name $storageAccount \
    --auth-mode login
```

## Operations using blob tags

Blob index tags make data management and discovery easier. Blob index tags are user-defined key-value index attributes that you can apply to your blobs. Once configured, you can categorize and find objects within an individual container or across all containers. Blob resources can be dynamically categorized by updating their index tags without requiring a change in container organization. This approach offers a flexible way to cope with changing data requirements. You can use both metadata and index tags simultaneously. For more information on index tags, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md).

> [!TIP]
> The code sample provided below uses pattern matching to obtain text from an XML file having a known structure. The example is used to illustrate a simplified approach for adding blob tags using basic Bash functionality. The use of an actual data parsing tool is always recommended when consuming data for production workloads.

The following example illustrates how to add blob index tags to a series of blobs. The example reads data from an XML file and uses it to create index tags on several blobs. To use the sample code, create a local *blob-list.xml* file in your *C:\temp* directory. The XML data is provided below.

For additional information, see the [az storage blob set-tier](/cli/azure/storage/blob#az-storage-blob-set-tier) reference.

```xml
<Venue Name="House of Prime Rib" Type="Restaurant">
  <Files>
    <File path="transactions/12027121.csv" />
    <File path="campaigns/radio-campaign.docx" />
    <File path="photos/bannerphoto.png" />
    <File path="archive/completed/2020review.pdf" />
    <File path="logs/2020/01/01/logfile.txt" />
  </Files>
</Venue>
```

The sample code iterates the lines within the XML file. It locates the *Venue* element and creates variables for the *Name* and *Type* values. It then iterates through the remaining lines and creates tags for each blob referenced by a `File` node.

```azurecli-interactive
#!/bin/bash
storageAccount="<storage-account>"
containerName="demo-container"

while read line
do
  
#Set Tag values 
if echo "$line" | grep -q "<Venue";then
    name=`echo "$line" | cut -d'"' -f 2`
    type=`echo "$line" | cut -d'"' -f 4`
    tags=("name=$name")
    tags+=("type=$type")
fi

#Add tags to blobs
if echo "$line" | grep -q "<File ";then
    blobName=`echo "$line" | cut -d'"' -f 2`
    
    echo az storage blob tag set \
        --container-name $containerName \
        --name $blobName \
        --account-name $storageAccount \
        --auth-mode login \
        --tags "{$tags[@]}"
fi

done < /mnt/c/temp/bloblist.xml

```

## Delete blobs

You can delete either a single blob or series of blobs with the `az storage blob delete` and `az storage blob delete-batch` commands. When deleting multiple blobs, you can use conditional operations, loops, or other automation as shown in the examples below.

> [!WARNING]
> Running the following examples may permanently delete blobs. Microsoft recommends enabling container soft delete to protect containers and blobs from accidental deletion. For more info, see [Soft delete for containers](soft-delete-blob-overview.md).

The following sample code provides an example of both individual and batch delete operations. The first example deletes a single, named blob. The second example illustrates the use of logical operations in Bash to delete multiple blobs. The third example uses the `delete-batch` command to delete all blobs with the format *bennett-x*, except *bennett-2*.

For more information, see the [az storage blob delete](/cli/azure/storage/blob#az-storage-blob-delete) and [az storage blob delete-batch](/cli/azure/storage/blob#az-storage-blob-delete-batch) reference.

```azurecli-interactive
#!/bin/bash
storageAccount="<storage-account>"
containerName="demo-container"

blobName="demo-file.txt"
blobPrefix="sinatra-"

#Delete a single, named blob
az storage blob delete \
    --container-name $containerName \
    --name $blobName \
    --account-name $storageAccount \
    --auth-mode login

#Iterate a blob list, deleting blobs whose names end with even numbers

## Get list of containers
blobList=$(az storage blob list \
    --query "[].name" \
    --prefix $blobPrefix \
    --container-name $containerName \
    --account-name $storageAccount \
    --auth-mode login \
    --output tsv)

## Delete all blobs with the format *bennett-x* except *bennett-2.*
for row in $blobList
do
    #Get the blob's number
    tmpBlob=$(echo $row | sed -e 's/\r//g') 
    tmpName=$(echo ${row%.*} | sed -e 's/\r//g')

    if [ `expr ${tmpName: ${#blobPrefix}} % 2` == 0 ]
    then
        
        echo "Deleting $tmpBlob"
        az storage blob delete \
            --container-name $containerName \
            --name $tmpBlob \
            --account-name $storageAccount \
            --auth-mode login

  fi
done

#Delete multiple blobs using delete-batch
az storage blob delete-batch \
    --source $containerName \
    --pattern bennett-[!2].* \
    --account-name $storageAccount \
    --auth-mode login
```

In some cases, it's possible to retrieve blobs that have been deleted. If your storage account's soft delete data protection option is enabled, the `--include d` parameter and value will return blobs deleted within the account's retention period. To learn more about soft delete, refer to thee [Soft delete for blobs](soft-delete-blob-overview.md) article.

Use the following examples to retrieve a list of blobs deleted within container's associated retention period. The first example displays a list of all recently deleted blobs and the dates on which they were deleted. The second example lists all deleted blobs matching a specific prefix.

```azurecli-interactive
#!/bin/bash
storageAccount="<storage-account>"
containerName="demo-container"

blobPrefix="sinatra-"

#Retrieve a list of all deleted blobs
az storage blob list \
    --container-name $containerName \
    --include d \
    --output table \
    --account-name $storageAccount \
    --auth-mode login \
    --query "[?deleted].{name:name,deleted:properties.deletedTime}"

#Retrieve a list of all deleted blobs matching a specific prefix
az storage blob list \
    --container-name $containerName \
    --prefix $blobPrefix \
    --output table \
    --include d \
    --account-name $storageAccount \
    --auth-mode login \
    --query "[].{name:name,deleted:deleted}"
```

## Restore a deleted blob
As mentioned in the [List blobs](#list-blobs) section, you can configure the soft delete data protection option on your storage account. When enabled, it's possible to restore containers deleted within the associated retention period. You may also use versioning to maintain previous versions of your blobs for each recovery and restoration.

If blob versioning and blob soft delete are both enabled, then modifying, overwriting, deleting, or restoring a blob automatically creates a new version. The method you'll use to restore a deleted blob will depend upon whether versioning is enabled on your storage account.

The following code sample restores all soft-deleted blobs or, if versioning is enabled, restores the latest version of a blob. It first determines whether versioning is enabled with the `az storage account blob-service-properties show` command.

If versioning is enabled, the `az storage blob list` command retrieves a list of all uniquely-named blob versions. Next, the blob versions on the list are retrieved and ordered by date. If no versions are found with the `isCurrentVersion` attribute value, the `az storage blob copy start` command is used to make an active copy of the blob's latest version.

If versioning is disabled, the `az storage blob undelete` command is used to restore each soft-deleted blob in the container.

Before you can follow this example, you'll need to enable soft delete on at least one of your storage accounts. To learn more about the soft delete data protection option, refer to the [Soft delete for blobs](soft-delete-blob-overview.md) article or the [az storage blob undelete](/cli/azure/storage/blob#az-storage-blob-undelete) reference.

```azurecli-interactive
#!/bin/bash
storageAccount="<storage-account>"
groupName="myResourceGroup"
containerName="demo-container"

blobSvcProps=$(
    az storage account blob-service-properties show \
        --account-name $storageAccount \
        --resource-group $groupName)

softDelete=$(echo "${blobSvcProps}" | jq -r '.deleteRetentionPolicy.enabled')
versioning=$(echo "${blobSvcProps}" | jq -r '.isVersioningEnabled')

# If soft delete is enabled
if $softDelete
then
    
    # If versioning is enabled
    if $versioning
    then

        # Get all blobs and versions using -Unique to avoid processing duplicates/versions
        blobList=$(
            az storage blob list \
                --account-name $storageAccount \
                --container-name $containerName \
                --include dv \--query "[?versionId != null].{name:name}" \
                --auth-mode login -o tsv | uniq)
        
        # Iterate the collection
        for blob in $blobList
        do
            # Get all versions of the blob, newest to oldest
            blobVers=$(
                az storage blob list \
                    --account-name $storageAccount \
                    --container-name $containerName \
                    --include dv \
                    --prefix $blob \
                    --auth-mode login -o json | jq 'sort_by(.versionId) | reverse | .[]')
            # Select the first (newest) object
            delBlob=$(echo "$blobVers" | jq -sr '.[0]')
            
            # Verify that the newest version is NOT the latest (that the version is "deleted")
            if [[ $(echo "$delBlob" | jq '.isCurrentVersion') != true ]]; 
            then
                # Get the blob's versionId property, build the URI to the blob
                versionID=$(echo "$delBlob" | jq -r '.versionId')
                uri="https://$storageAccount.blob.core.windows.net/$containerName/$blob?versionId=$versionID"
                
                # Copy the latest version 
                az storage blob copy start \
                    --account-name $storageAccount \
                    --destination-blob $blob \
                    --destination-container $containerName \
                    --source-uri $uri \
                    --auth-mode login
       
                delBlob=""
            fi
        done

    else

        #Retrieve all deleted blobs
        blobList=$( \
            az storage blob list \
                --container-name $containerName \
                --include d \
                --output tsv \
                --account-name $storageAccount \
                --auth-mode login \
                --query "[?deleted].[name]" \
        )

        #Iterate list of deleted blobs and restore
        for row in $blobList
        do
            tmpName=$(echo $row | sed -e 's/\r//g')
            echo "Restoring $tmpName"
            az storage blob undelete \
                --container-name $containerName \
                --name $tmpName \
                --account-name $storageAccount \
                --auth-mode login
        done

    fi

else
    
    #Soft delete is not enabled
    echo "Sorry, the delete retention policy is not enabled."

fi
```

## Next steps

- [Choose how to authorize access to blob data with Azure CLI](./authorize-data-operations-cli.md)
- [Run PowerShell commands with Microsoft Entra credentials to access blob data](./authorize-data-operations-cli.md)
- [Manage blob containers using CLI](blob-containers-cli.md)
