---
title: Manage block blobs with PowerShell
titleSuffix: Azure Storage
description: Manage blobs with PowerShell 
author: StevenMatthew
ms.author: shaas
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 05/02/2023
ms.devlang: powershell
ms.custom: devx-track-azurepowershell
---

# Manage block blobs with PowerShell

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are optimized for uploading large amounts of data efficiently. Block blobs are ideal for storing images, documents, and other types of data not subjected to random read and write operations. This article explains how to work with block blobs.

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- Azure PowerShell module `Az`, which is the recommended PowerShell module for interacting with Azure. To get started with the Az PowerShell module, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell).

### Configure a context object to encapsulate credentials

Every request to Azure Storage must be authorized. You can authorize a request made from PowerShell with your Azure AD account or by using the account access keys. The examples in this article use Azure AD authorization with context objects. Context objects encapsulate your Azure AD credentials and pass them during subsequent data operations.

To sign in to your Azure account with an Azure AD account, open PowerShell and call the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

```azurepowershell
#Connect to your Azure subscription
Connect-AzAccount
```

After the connection has been established, create the Azure context. Authenticating with Azure AD automatically creates an Azure context for your default subscription. In some cases, you may need to access resources in a different subscription after authenticating. You can change the subscription associated with your current Azure session by modifying the active session context.

To use your default subscription, create the context by calling the `New-AzStorageContext` cmdlet. Include the `-UseConnectedAccount` parameter so that data operations are performed using your Azure AD credentials.

```azurepowershell
#Create a context object using Azure AD credentials
$ctx = New-AzStorageContext -StorageAccountName <storage account name> -UseConnectedAccount
```

To change subscriptions, retrieve the context object with the [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription) cmdlet, then change the current context with the [Set-AzContext](/powershell/module/az.accounts/set-azcontext). For more information, see [Change the active subscription](/powershell/azure/manage-subscriptions-azureps#change-the-active-subscription).

### Create a container

All blob data is stored within containers, so you need at least one container resource before you can upload data. If needed, use the following example to create a storage container. For more information, see [Managing blob containers using PowerShell](blob-containers-powershell.md).

```azurepowershell
#Create a container object
$container = New-AzStorageContainer -Name "mycontainer" -Context $ctx
```

When you use the following examples, you need to replace the placeholder values in brackets with your own values. For more information about signing into Azure with PowerShell, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

## Upload a blob

To upload a file to a block blob, pass the required parameter values to the `Set-AzStorageBlobContent` cmdlet. Supply the path and file name with the `-File` parameter, and the name of the container with the `-Container` parameter. You also need to provide a reference to the context object with the `-Context` parameter.

This command creates the blob if it doesn't exist, or prompts for overwrite confirmation if it exists. You can overwrite the file without confirmation if you pass the `-Force` parameter to the cmdlet.

The following example specifies a `-File` parameter value to upload a single, named file. It also demonstrates the use of the PowerShell pipeline operator and `Get-ChildItem` cmdlet to upload multiple files. The `Get-ChildItem` cmdlet uses the `-Path` parameter to specify *C:\Temp\\\*.png*. The inclusion of the asterisk (`*`) wildcard specifies all files with the *.png* filename extension. The `-Recurse` parameter searches the *Temp* directory and its subdirectories.

```azurepowershell
#Set variables
$path          = "C:\temp\" 
$containerName = "mycontainer"
$filename      = "demo-file.txt"
$imageFiles    = $path + "*.png"
$file          = $path + $filename

#Upload a single named file
Set-AzStorageBlobContent -File $file -Container $containerName -Context $ctx

#Upload multiple image files recursively
 Get-ChildItem -Path $imageFiles -Recurse | Set-AzStorageBlobContent -Container $containerName -Context $ctx
```

The result displays the storage account name, the storage container name, and provides a list of the files uploaded.

```Result
   AccountName: demostorageaccount, ContainerName: demo-container

Name              BlobType   Length  ContentType                LastModified          AccessTier  IsDeleted
----              --------   ------  -----------                ------------          ----------  ---------
demo-file.txt     BlockBlob  222     application/octet-stream   2021-12-14 01:38:03Z  Cool        False     
hello-world.png   BlockBlob  14709   application/octet-stream   2021-12-14 01:38:03Z  Cool        False
hello-world2.png  BlockBlob  12472   application/octet-stream   2021-12-14 01:38:03Z  Cool        False
hello-world3.png  BlockBlob  13537   application/octet-stream   2021-12-14 01:38:03Z  Cool        False
```

## List blobs

The `Get-AzStorageBlob` cmdlet is used to list blobs stored within a container. You can use various approaches to define the scope of your search. Use the `-Container` and `-Name` parameter to list a specific blob within a known container. To generate an unfiltered list of all blobs within a specific container, use the `-Container` parameter alone, without a `-Name` value.

There's no restriction on the number of containers or blobs a storage account may have. To potentially avoid retrieving thousands of blobs, it's a good idea to limit the amount of data returned. When retrieving multiple blobs, you can use the `-Prefix` parameter to specify blobs whose names begin with a specific string. You may also use the `-Name` parameter with a wildcard to specify file names or types.

The `-MaxCount` parameter can be used to limit the number of unfiltered blobs returned from a container. A service limit of 5,000 is imposed on all Azure resources. This limit ensures that manageable amounts of data are retrieved and performance isn't impacted. If the number of blobs returned exceeds either the `-MaxCount` value or the service limit, a continuation token is returned. This token allows you to use multiple requests to retrieve any number of blobs. More information is available on [Enumerating blob resources](/rest/api/storageservices/enumerating-blob-resources).

The following example shows several approaches used to provide a list of blobs. The first approach lists a single blob within a specific container resource. The second approach uses a wildcard to list all `.jpg` files with a prefix of *Louis*. The search is restricted to five containers using the `-MaxCount` parameter. The third approach uses `-MaxCount` and `-ContinuationToken` parameters to limit the retrieval of all blobs within a container.

```azurepowershell
#Set variables
$namedContainer  = "named-container"
$demoContainer   = "mycontainer"
$containerPrefix = "demo"

$maxCount = 1000
$total     = 0
$token     = $Null

#Approach 1: List all blobs in a named container
Get-AzStorageBlob -Container $namedContainer -Context $ctx

#Approach 2: Use a wildcard to list blobs in all containers
Get-AzStorageContainer -MaxCount 5 -Context $ctx | Get-AzStorageBlob -Blob "*louis*.jpg" 

#Approach 3: List batches of blobs using MaxCount and ContinuationToken parameters
Do
{
     #Retrieve blobs using the MaxCount parameter
     $blobs = Get-AzStorageBlob -Container $demoContainer `
         -MaxCount $maxCount `
         -ContinuationToken $token `
         -Context $ctx
     $blobCount = 1
     
     #Loop through the batch
     Foreach ($blob in $blobs)
     {
         #To-do: Perform some work on individual blobs here

         #Display progress bar
         $percent = $($blobCount/$maxCount*100)
         Write-Progress -Activity "Processing blobs" -Status "$percent% Complete" -PercentComplete $percent
         $blobCount++
     }

     #Update $total
     $total += $blobs.Count
      
     #Exit if all blobs processed
     If($blobs.Length -le 0) { Break; }
      
     #Set continuation token to retrieve the next batch
     $token = $blobs[$blobs.Count -1].ContinuationToken
 }
 While ($null -ne $token)
 Write-Host "`n`n   AccountName: $($ctx.StorageAccountName), ContainerName: $demoContainer `n"
 Write-Host "Processed $total blobs in $namedContainer."
```

The first two approaches display the storage account and container names, and a list of the blobs retrieved. The third approach displays the total count of blobs within a named container. The blobs are retrieved in batches, and a status bar shows the progress during the count.

```Result
   AccountName: demostorageaccount, ContainerName: named-container

Name                 BlobType    Length    ContentType    LastModified          AccessTier    IsDeleted
----                 --------    ------    -----------    ------------          ----------    ---------
index.txt            BlockBlob   222       text/plain     2021-12-15 22:00:10Z  Cool          False
miles-davis.txt      BlockBlob   23454     text/plain     2021-12-15 22:17:59Z  Cool          False
cab-calloway.txt     BlockBlob   18419     text/plain     2021-12-15 22:17:59Z  Cool          False
benny-goodman.txt    BlockBlob   17726     text/plain     2021-12-15 22:17:59Z  Cool          False


   AccountName: demostorageaccount, ContainerName: demo-container

Name                 BlobType    Length    ContentType    LastModified          AccessTier    IsDeleted
----                 --------    ------    -----------    ------------          ----------    ---------
louis-armstrong.jpg  BlockBlob   211482    image/jpeg     2021-12-14 01:38:03Z  Cool          False
louis-jordan.jpg     BlockBlob   55766     image/jpeg     2021-12-14 01:38:03Z  Cool          False
louis-prima.jpg      BlockBlob   290651    image/jpeg     2021-12-14 01:38:03Z  Cool          False


   AccountName: demostorageaccount, ContainerName: demo-container

Processed 5257 blobs in demo-container.
```

## Download a blob

Depending on your use case, the `Get-AzStorageBlobContent` cmdlet can be used to download either single or multiple blobs. As with most operations, both approaches require a context object.

To download a single named blob, you can call the cmdlet directly and supply values for the `-Blob` and `-Container` parameters. The blob is downloaded to the working PowerShell directory by default, but an alternate location can be specified. To change the target location, a valid, existing path must be passed with the `-Destination` parameter. Because the operation can't create a destination, it fails with an error if your specified path doesn't exist.

Multiple blobs can be downloaded by combining the `Get-AzStorageBlob` cmdlet and the PowerShell pipeline operator. First, create a list of blobs with the `Get-AzStorageBlob` cmdlet. Next, use the pipeline operator and the `Get-AzStorageBlobContent` cmdlet to retrieve the blobs from the container.

The following sample code provides an example of both single and multiple download approaches. It also offers a simplified approach to searching all containers for specific files using a wildcard. Because some environments may have hundreds of thousands of resources, using the `-MaxCount` parameter is recommended.

```azurepowershell
#Set variables
$containerName = "mycontainer"
$path          = "C:\temp\downloads\"
$blobName      = "demo-file.txt"
$fileList      = "*.png"
$pipelineList  = "louis*"
$maxCount      = 10

#Download a single named blob
Get-AzStorageBlobContent -Container $containerName -Blob $blobName -Destination $path -Context $ctx

#Download multiple blobs using the pipeline
Get-AzStorageBlob -Container $containerName -Blob $fileList -Context $ctx | Get-AzStorageBlobContent

#Use wildcard to download blobs from all containers
Get-AzStorageContainer -MaxCount $maxCount `
     -Context $ctx | Get-AzStorageBlob `
     -Blob "louis*" | Get-AzStorageBlobContent
```

The result displays the storage account and container names and provides a list of the files downloaded.

```Result
   AccountName: demostorageaccount, ContainerName: demo-container

Name                 BlobType   Length  ContentType              LastModified          AccessTier  IsDeleted
----                 --------   ------  -----------              ------------          ----------  ---------
demo-file.txt        BlockBlob  222     application/octet-stream 2021-12-14 01:38:03Z  Unknown     False
hello-world.png      BlockBlob  14709   application/octet-stream 2021-12-14 01:38:03Z  Unknown     False
hello-world2.png     BlockBlob  12472   application/octet-stream 2021-12-14 01:38:03Z  Unknown     False
hello-world3.png     BlockBlob  13537   application/octet-stream 2021-12-14 01:38:03Z  Unknown     False

   AccountName: demostorageaccount, ContainerName: public-container

Name                 BlobType   Length  ContentType              LastModified          AccessTier  IsDeleted
----                 --------   ------  -----------              ------------          ----------  ---------
louis-armstrong.jpg  BlockBlob  211482  image/jpeg               2021-12-14 18:56:03Z  Unknown     False

   AccountName: demostorageaccount, ContainerName: read-only-container

Name                 BlobType   Length  ContentType              LastModified          AccessTier  IsDeleted
----                 --------   ------  -----------              ------------          ----------  ---------
louis-jordan.jpg     BlockBlob  55766   image/jpeg               2021-12-14 18:56:21Z  Unknown     False

   AccountName: demostorageaccount, ContainerName: hidden-container

Name                 BlobType   Length  ContentType              LastModified          AccessTier  IsDeleted
----                 --------   ------  -----------              ------------          ----------  ---------
louis-prima.jpg      BlockBlob  290651  image/jpeg               2021-12-14 18:56:45Z  Unknown     False
```

## Manage blob properties and metadata

A container exposes both system properties and user-defined metadata. System properties exist on each Blob Storage resource. Some properties are read-only, while others can be read or set. Under the covers, some system properties map to certain standard HTTP headers.

User-defined metadata consists of one or more name-value pairs that you specify for a Blob Storage resource. You can use metadata to store these values with the resource. Metadata values are for your own purposes only, and don't affect how the resource behaves.

### Reading blob properties

To read blob properties or metadata, you must first retrieve the blob from the service. Use the `Get-AzStorageBlob` cmdlet to retrieve a blob's properties and metadata, but not its content. Next, use the `BlobClient.GetProperties` method to fetch the blob's properties. The properties or metadata can then be read or set as needed.

The following example retrieves a blob and lists its properties.

```azurepowershell
$blob = Get-AzStorageBlob -Blob "blue-moon.mp3" -Container "mycontainer" -Context $ctx
$properties = $blob.BlobClient.GetProperties()
Echo $properties.Value
```

The result displays a list of the blob's properties as shown in the following example.

```Result
LastModified                         : 11/16/2021 3:42:07 PM +00:00
CreatedOn                            : 11/16/2021 3:42:07 PM +00:00
Metadata                             : {}
BlobType                             : Block
LeaseDuration                        : Infinite
LeaseState                           : Available
LeaseStatus                          : Unlocked
ContentLength                        : 2163298
ContentType                          : audio/mpeg
ETag                                 : 0x8D9C0AA9E0CBA78
IsServerEncrypted                    : True
AccessTier                           : Cool
IsLatestVersion                      : False
TagCount                             : 0
ExpiresOn                            : 1/1/0001 12:00:00 AM +00:00
LastAccessed                         : 1/1/0001 12:00:00 AM +00:00
HasLegalHold                         : False
```

### Read and write blob metadata

Blob metadata is an optional set of name/value pairs associated with a blob. As shown in the previous example, there's no metadata associated with a blob initially, though it can be added when necessary. To update blob metadata, use the `BlobClient.UpdateMetadata` method. This method only accepts key-value pairs stored in a generic `IDictionary` object. For more information, see the [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) class definition.

The example below first updates and then commits a blob's metadata, and then retrieves it. The sample blob is flushed from memory to ensure the metadata isn't being read from the in-memory object.

```azurepowershell
#Set variable
$container = "mycontainer"
$blobName  = "blue-moon.mp3"

#Retrieve blob
$blob = Get-AzStorageBlob -Blob $blobName -Container $container -Context $ctx

#Create IDictionary, add key-value metadata pairs to IDictionary
$metadata = New-Object System.Collections.Generic.Dictionary"[String,String]"
$metadata.Add("YearWritten","1934")
$metadata.Add("YearRecorded","1958")
$metadata.Add("Composer","Richard Rogers")
$metadata.Add("Lyricist","Lorenz Hart")
$metadata.Add("Artist","Tony Bennett")

#Update metadata
$blob.BlobClient.SetMetadata($metadata, $null)

#Flush blob from memory, retrieve updated blob, retrieve properties
$blob = $null
$blob = Get-AzStorageBlob -Blob $blobName -Container $container -Context $ctx
$properties = $blob.BlobClient.GetProperties()
 
#Display metadata
Echo $properties.Value.Metadata
```

The result returns the blob's newly updated metadata as shown in the following example.

```Result
Key          Value         
---          -----         
YearWritten  1934          
YearRecorded 1958          
Composer     Richard Rogers
Lyricist     Lorenz Hart   
Artist       Tony Bennett
```

## Copy operations for blobs

There are many scenarios in which blobs of different types may be copied. Examples in this article are limited to block blobs.

### Copy a source blob to a destination blob

For a simplified copy operation within the same storage account, use the `Copy-AzStorageBlob` cmdlet. Because the operation is copying a blob within the same storage account, it's a synchronous operation. Cross-account operations are asynchronous.

You should consider the use of AzCopy for ease and performance, especially when copying blobs between storage accounts. AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. Find out more about how to [Get started with AzCopy](../common/storage-use-azcopy-v10.md).

The example below copies the **bannerphoto.png** blob from the **photos** container to the **photos** folder within the **archive** container. Both containers exist within the same storage account. The result verifies the success of the copy operation.

```azurepowershell
$blobname = "bannerphoto.png"
Copy-AzStorageBlob -SrcContainer "photos" `
     -SrcBlob $blobname -DestContainer "archive" `
     -DestBlob $("photos/$blobname") -Context $ctx

AccountName: demostorageaccount, ContainerName: archive

Name                BlobType   Length  ContentType  LastModified          AccessTier  IsDeleted  VersionId
----                --------   ------  -----------  ------------          ----------  ---------  ---------
photos/bannerphoto  BlockBlob  12472   image/png    2021-11-27 23:11:43Z  Cool        False
```

You can use the `-Force` parameter to overwrite an existing blob with the same name at the destination. This operation effectively replaces the destination blob. It also removes any uncommitted blocks and overwrites the destination blob's metadata.

### Copy a snapshot to a destination blob with a different name

The resulting destination blob is a writeable blob and not a snapshot.

The source blob for a copy operation may be a block blob, an append blob, a page blob, or a snapshot. If the destination blob already exists, it must be of the same blob type as the source blob. An existing destination blob is overwritten.

The destination blob can't be modified while a copy operation is in progress. A destination blob can only have one outstanding copy operation. In other words, a blob can't be the destination for multiple pending copy operations.

When you copy a blob within the same storage account, it's a synchronous operation. Cross-account copy operations are asynchronous.

The entire source blob or file is always copied. Copying a range of bytes or set of blocks isn't supported.

When a blob is copied, its system properties are copied to the destination blob with the same values.

It also shows how to abort an asynchronous copy operation.

## Snapshot blobs

A snapshot is a read-only version of a blob that's taken at a point in time. A blob snapshot is identical to its base blob, except that a DateTime value is appended to the URI. This value indicates the time at which the snapshot was taken, and offers the only distinction between the base blob and the snapshot.

Any leases associated with the base blob don't affect the snapshot. You can't acquire a lease on a snapshot. Read more about [Blob snapshots](snapshots-overview.md).

The following sample code retrieves a blob from a storage container and creates a snapshot of it.

```azurepowershell
$blob = Get-AzStorageBlob -Container "manuscripts" -Blob "novels/fast-cars.docx" -Context $ctx
$blob.BlobClient.CreateSnapshot()
```

## Set blob tier

When you change a blob's tier, you move the blob and all of its data to the target tier. To make the change, retrieve a blob with the `Get-AzStorageBlob` cmdlet, and call the `BlobClient.SetAccessTier` method. This approach can be used to change the tier between **hot**, **cool**, and **archive**.  

Changing tiers from **cool** or **hot** to **archive** take place almost immediately. After a blob is moved to the **archive** tier, it's considered to be offline, and can't be read or modified. Before you can read or modify an archived blob's data, you need to rehydrate it to an online tier. Read more about [Blob rehydration from the archive tier](archive-rehydrate-overview.md).

The following sample code sets the tier to **hot** for all blobs within the `archive` container.

```azurepowershell
$blobs = Get-AzStorageBlob -Container archive -Context $ctx
Foreach($blob in $blobs) {
    $blob.BlobClient.SetAccessTier("Hot")
}
```

## Operations using blob tags

Blob index tags make data management and discovery easier. Blob index tags are user-defined key-value index attributes that you can apply to your blobs. Once configured, you can categorize and find objects within an individual container or across all containers. Blob resources can be dynamically categorized by updating their index tags without requiring a change in container organization. Index tags offer a flexible way to cope with changing data requirements. You can use both metadata and index tags simultaneously. For more information on index tags, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md).

The following example illustrates how to add blob index tags to a series of blobs. The example reads data from an XML file and uses it to create index tags on several blobs. To use the sample code, create a local *blob-list.xml* file in your *C:\temp* directory. The XML data is provided in the following example.

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

The sample code creates a hash table and assigns the **$tags** variable to it. Next, it uses the `Get-Content` and `Get-Data` cmdlets to create an object based on the XML structure. It then adds key-value pairs to the hash table to be used as the tag values. Finally, it iterates through the XML object and creates tags for each `File` node.

```azurepowershell
#Set variables
$filePath = "C:\temp\blob-list.xml"
$tags     = @{}

#Get data, set tag key-values
[xml]$data = Get-Content -Path $filepath
$tags.Add("VenueName", $data.Venue.Name)
$tags.Add("VenueType", $data.Venue.Type)
 
#Loop through files and add tag
$data.Venue.Files.ChildNodes | ForEach-Object {
    #break the path: container name, blob
    $path = $_.Path -split "/",2
   
    #set apply the blob tags
    Set-AzStorageBlobTag -Container $location[0] -Blob $location[1] -Tag $tags -Context $ctx
 }
```

## Delete blobs

You can delete either a single blob or series of blobs with the `Remove-AzStorageBlob` cmdlet. When deleting multiple blobs, you can utilize conditional operations, loops, or the PowerShell pipeline as shown in the following examples.

> [!WARNING]
> Running the following examples may permanently delete blobs. Microsoft recommends enabling container soft delete to protect containers and blobs from accidental deletion. For more info, see [Soft delete for containers](soft-delete-blob-overview.md).

```azurepowershell
#Create variables
$containerName  = "mycontainer"
$blobName       = "demo-file.txt"
$prefixName     = "file"

#Delete a single, named blob
Remove-AzStorageBlob -Blob $blobName -Container $containerName -Context $ctx

#Iterate a loop, deleting blobs
for ($i = 1; $i -le 3; $i++) { 
    Remove-AzStorageBlob -Blob (-join($prefixName, $i, ".txt")) -Container $containerName -Context $ctx
} 

#Retrieve blob list, delete using a pipeline
Get-AzStorageBlob -Prefix $prefixName -Container $containerName -Context $ctx | Remove-AzStorageBlob
```

In some cases, it's possible to retrieve blobs that have been deleted. If your storage account's soft delete data protection option is enabled, the `-IncludeDeleted` parameter returns blobs deleted within the associated retention period. To learn more about soft delete, refer to the [Soft delete for blobs](soft-delete-blob-overview.md) article.

Use the following example to retrieve a list of blobs deleted within container's associated retention period. The result displays a list of recently deleted blobs.

```azurepowershell
#Retrieve a list of blobs including those recently deleted
Get-AzStorageBlob -Prefix $prefixName -IncludeDeleted -Context $ctx

AccountName: demostorageaccount, ContainerName: demo-container

Name       BlobType   Length  ContentType                LastModified          AccessTier    IsDeleted
----       --------   ------  -----------                ------------          ----------    ---------
file.txt   BlockBlob  22      application/octet-stream   2021-12-16 20:59:41Z  Cool          True
file2.txt  BlockBlob  22      application/octet-stream   2021-12-17 00:14:24Z  Cool          True
file3.txt  BlockBlob  22      application/octet-stream   2021-12-17 00:14:24Z  Cool          True
file4.txt  BlockBlob  22      application/octet-stream   2021-12-17 00:14:25Z  Cool          True
```

## Restore a deleted blob

As mentioned in the [List blobs](#list-blobs) section, you can configure the soft delete data protection option on your storage account. When enabled, it's possible to restore blobs deleted within the associated retention period. You may also use versioning to maintain previous versions of your blobs for each recovery and restoration.

If blob versioning and blob soft delete are both enabled, then modifying, overwriting, deleting, or restoring a blob automatically creates a new version. The method you use to restore a deleted blob depends upon whether versioning is enabled on your storage account.

The following code sample restores all soft-deleted blobs or, if versioning is enabled, restores the latest version of a blob. It first determines whether versioning is enabled with the `Get-AzStorageBlobServiceProperty` cmdlet.

If versioning is enabled, the `Get-AzStorageBlob` cmdlet retrieves a list of all uniquely named blob versions. Next, the blob versions on the list are retrieved and ordered by date. If no versions are found with the `LatestVersion` attribute value, the `Copy-AzBlob` cmdlet is used to make an active copy of the latest version.

If versioning is disabled, the `BlobBaseClient.Undelete` method is used to restore each soft-deleted blob in the container.

Before you can follow this example, you need to enable soft delete or versioning on at least one of your storage accounts.

> [!IMPORTANT]
> The following example enumerates a group of blobs and stores them in memory before processing them. If versioning is enabled, the blobs are also sorted. The use of the `-ContinuationToken` parameter with `$maxCount` variable limits the number of blobs within the group to conserve resources. If a container has millions of blobs, this will be extremely expensive. You can adjust the value of the `$maxCount` variable, though if a container has millions of blobs the script will process the blobs slowly.

To learn more about the soft delete data protection option, refer to the [Soft delete for blobs](soft-delete-blob-overview.md) article.

```azurepowershell
$accountName   ="myStorageAccount"
$groupName     ="myResourceGroup"
$containerName ="mycontainer"
$maxCount      = 1000
$token         = $null


$blobSvc = Get-AzStorageBlobServiceProperty `
    -StorageAccountName $accountName `
    -ResourceGroupName $groupName

# If soft delete is enabled
if($blobSvc.DeleteRetentionPolicy.Enabled)
{
    # If versioning is enabled
    if($blobSvc.IsVersioningEnabled -eq $true)
    {
        # Set context
        $ctx = New-AzStorageContext `
            -StorageAccountName $accountName `
            -UseConnectedAccount
        do
        {
            # Get all blobs and versions using -Unique 
            # to avoid processing duplicates/versions
            $blobs = Get-AzStorageBlob `
                -Container $containerName `
                -Context $ctx -IncludeVersion | `
                    Where-Object {$_.VersionId -ne $null} | `
                    Sort-Object -Property Name -Unique

            # Iterate the collection
            foreach ($blob in $blobs)
            {
                # Process versions
                if($blob.VersionId -ne $null)
                {
            
                    # Get all versions of the blob, newest to oldest
                    $delBlob = Get-AzStorageBlob `
                        -Container $containerName `
                        -Context $ctx `
                        -Prefix $blob.Name `
                        -IncludeDeleted -IncludeVersion  | `
                            Sort-Object -Property VersionId -Descending

                    # Verify that the newest version is NOT the latest (that the version is "deleted")
                    if (-Not $delBlob[0].IsLatestVersion)
                    {
                        $delBlob[0] | Copy-AzStorageBlob `
                            -DestContainer $containerName `
                            -DestBlob $delBlob[0].Name
                    }
                
                    #Dispose the temporary object
                    $delBlob = $null
                }
            }
            $token = $blobs[$blobs.Count -1].ContinuationToken;
        }
        while ($null -ne $token)
    }

    # Otherwise (if versioning is disabled)
    else
    {
        $blobs = Get-AzStorageBlob `
            -Container $containerName `
            -Context $ctx -IncludeDeleted | `
                Where-Object {$_.IsDeleted}
        foreach($blob in $blobs)
        {
            if($blob.IsDeleted) { $blob.BlobBaseClient.Undelete() }
        }
    }
}
else
{
    echo "Sorry, the delete retention policy is not enabled."
}
```

## Next steps

- [Run PowerShell commands with Azure AD credentials to access blob data](./authorize-data-operations-powershell.md)
- [Create a storage account](../common/storage-account-create.md?tabs=azure-portal&toc=/azure/storage/blobs/toc.json)
- [Manage blob containers using PowerShell](blob-containers-powershell.md)
