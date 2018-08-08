---
title: Azure Import/Export manifest file format | Microsoft Docs
description: Learn about the format of the drive manifest file that describes the mapping between blobs in Azure Blob storage and files on a drive in an import or export job in the Import/Export service.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/23/2017
ms.author: muralikk
ms.component: common
---

# Azure Import/Export service manifest file format
The drive manifest file describes the mapping between blobs in Azure Blob storage and files on drive comprising an import or export job. For an import operation, the manifest file is created as a part of the drive preparation process, and is stored on the drive before the drive is sent to the Azure data center. During an export operation, the manifest is created and stored on the drive by the Azure Import/Export service.  
  
For both import and export jobs, the drive manifest file is stored on the import or export drive; it is not transmitted to the service via any API operation.  
  
The following describes the general format of a drive manifest file:  
  
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<DriveManifest Version="2014-11-01">  
  <Drive>  
    <DriveId>drive-id</DriveId>  
    import-export-credential  
  
    <!-- First Blob List -->  
    <BlobList>  
      <!-- Global properties and metadata that applies to all blobs -->  
      [<MetadataPath Hash="md5-hash">global-metadata-file-path</MetadataPath>]  
      [<PropertiesPath   
        Hash="md5-hash">global-properties-file-path</PropertiesPath>]  
  
      <!-- First Blob -->  
      <Blob>  
        <BlobPath>blob-path-relative-to-account</BlobPath>  
        <FilePath>file-path-relative-to-transfer-disk</FilePath>  
        [<ClientData>client-data</ClientData>]  
        [<Snapshot>snapshot</Snapshot>]  
        <Length>content-length</Length>  
        [<ImportDisposition>import-disposition</ImportDisposition>]  
        page-range-list-or-block-list          
        [<MetadataPath Hash="md5-hash">metadata-file-path</MetadataPath>]  
        [<PropertiesPath Hash="md5-hash">properties-file-path</PropertiesPath>]  
      </Blob>  
  
      <!-- Second Blob -->  
      <Blob>  
      . . .  
      </Blob>  
    </BlobList>  
  
    <!-- Second Blob List -->  
    <BlobList>  
    . . .  
    </BlobList>  
  </Drive>  
</DriveManifest>  
  
import-export-credential ::=   
  <StorageAccountKey>storage-account-key</StorageAccountKey> | <ContainerSas>container-sas</ContainerSas>  
  
page-range-list-or-block-list ::=   
  page-range-list | block-list  
  
page-range-list ::=   
    <PageRangeList>  
      [<PageRange Offset="page-range-offset" Length="page-range-length"   
       Hash="md5-hash"/>]  
      [<PageRange Offset="page-range-offset" Length="page-range-length"   
       Hash="md5-hash"/>]  
    </PageRangeList>  
  
block-list ::=  
    <BlockList>  
      [<Block Offset="block-offset" Length="block-length" [Id="block-id"]  
       Hash="md5-hash"/>]  
      [<Block Offset="block-offset" Length="block-length" [Id="block-id"]   
       Hash="md5-hash"/>]  
    </BlockList>  

```

## Manifest XML elements and attributes

The data elements and attributes of the drive manifest XML format are specified in the following table.  
  
|XML Element|Type|Description|  
|-----------------|----------|-----------------|  
|`DriveManifest`|Root element|The root element of the manifest file. All other elements in the file are beneath this element.|  
|`Version`|Attribute, String|The version of the manifest file.|  
|`Drive`|Nested XML element|Contains the manifest for each drive.|  
|`DriveId`|String|The unique drive identifier for the drive. The drive identifier is found by querying the drive for its serial number. The drive serial number is usually printed on the outside of the drive as well. The `DriveID` element must appear before any `BlobList` element in the manifest file.|  
|`StorageAccountKey`|String|Required for import jobs if and only if `ContainerSas` is not specified. The account key for the Azure storage account associated with the job.<br /><br /> This element is omitted from the manifest for an export operation.|  
|`ContainerSas`|String|Required for import jobs if and only if `StorageAccountKey` is not specified. The container SAS for accessing the blobs associated with the job. See [Put Job](/rest/api/storageimportexport/jobs#Jobs_CreateOrUpdate) for its format.This element is omitted from the manifest for an export operation.|  
|`ClientCreator`|String|Specifies the client which created the XML file. This value is not interpreted by the Import/Export service.|  
|`BlobList`|Nested XML element|Contains a list of blobs that are part of the import or export job. Each blob in a blob list shares the same metadata and properties.|  
|`BlobList/MetadataPath`|String|Optional. Specifies the relative path of a file on the disk that contains the default metadata that will be set on blobs in the blob list for an import operation. This metadata can be optionally overridden on a blob-by-blob basis.<br /><br /> This element is omitted from the manifest for an export operation.|  
|`BlobList/MetadataPath/@Hash`|Attribute, String|Specifies the Base16-encoded MD5 hash value for the metadata file.|  
|`BlobList/PropertiesPath`|String|Optional. Specifies the relative path of a file on the disk that contains the default properties that will be set on blobs in the blob list for an import operation. These properties can be optionally overridden on a blob-by-blob basis.<br /><br /> This element is omitted from the manifest for an export operation.|  
|`BlobList/PropertiesPath/@Hash`|Attribute, String|Specifies the Base16-encoded MD5 hash value for the properties file.|  
|`Blob`|Nested XML element|Contains information about each blob in each blob list.|  
|`Blob/BlobPath`|String|The relative URI to the blob, beginning with the container name. If the blob is in root container, it must begin with `$root`.|  
|`Blob/FilePath`|String|Specifies the relative path to the file on the drive. For export jobs, the blob path will be used for the file path if possible; *e.g.*, `pictures/bob/wild/desert.jpg` will be exported to `\pictures\bob\wild\desert.jpg`. However, due to the limitations of NTFS names, a blob may be exported to a file with a path that doesn't resemble the blob path.|  
|`Blob/ClientData`|String|Optional. Contains comments from the customer. This value is not interpreted by the Import/Export service.|  
|`Blob/Snapshot`|DateTime|Optional for export jobs. Specifies the snapshot identifier for an exported blob snapshot.|  
|`Blob/Length`|Integer|Specifies the total length of the blob in bytes. The value may be up to 200 GB for a block blob and up to 1 TB for a page blob. For a page blob, this value must be a multiple of 512.|  
|`Blob/ImportDisposition`|String|Optional for import jobs, omitted for export jobs. This specifies how the Import/Export service should handle the case for an import job where a blob with the same name already exists. If this value is omitted from the import manifest, the default value is `rename`.<br /><br /> The values for this element include:<br /><br /> -   `no-overwrite`: If a destination blob is already present with the same name, the import operation will skip importing this file.<br />-   `overwrite`: Any existing destination blob is overwritten completely by the newly imported file.<br />-   `rename`: The new blob will uploaded with a modified name.<br /><br /> The renaming rule is as follows:<br /><br /> -   If the blob name doesn't contain a dot, a new name is generated by appending `(2)` to the original blob name; if this new name also conflicts with an existing blob name, then `(3)` is appended in place of `(2)`; and so on.<br />-   If the blob name contains a dot, the portion following the last dot is considered the extension name. Similar to the above procedure, `(2)` is inserted before the last dot to generate a new name; if the new name still conflicts with an existing blob name, then the service tries `(3)`, `(4)`, and so on, until a non-conflicting name is found.<br /><br /> Some examples:<br /><br /> The blob `BlobNameWithoutDot` will be renamed to:<br /><br /> `BlobNameWithoutDot (2)  // if BlobNameWithoutDot exists`<br /><br /> `BlobNameWithoutDot (3)  // if both BlobNameWithoutDot and BlobNameWithoutDot (2) exist`<br /><br /> The blob `Seattle.jpg` will be renamed to:<br /><br /> `Seattle (2).jpg  // if Seattle.jpg exists`<br /><br /> `Seattle (3).jpg  // if both Seattle.jpg and Seattle (2).jpg exist`|  
|`PageRangeList`|Nested XML element|Required for a page blob.<br /><br /> For an import operation, specifies a list of byte ranges of a file to be imported. Each page range is described by an offset and length in the source file that describes the page range, together with an MD5 hash of the region. The `Hash` attribute of a page range is required. The service will validate that the hash of the data in the blob matches the computed MD5 hash from the page range. Any number of page ranges may be used to describe a file for an import, with the total size up to 1 TB. All page ranges must be ordered by offset and no overlaps are allowed.<br /><br /> For an export operation, specifies a set of byte ranges of a blob that have been exported to the drive.<br /><br /> The page ranges together may cover only sub-ranges of a blob or file.  The remaining part of the file not covered by any page range is expected and its content can be undefined.|  
|`PageRange`|XML element|Represents a page range.|  
|`PageRange/@Offset`|Attribute, Integer|Specifies the offset in the transfer file and the blob where the specified page range begins. This value must be a multiple of 512.|  
|`PageRange/@Length`|Attribute, Integer|Specifies the length of the page range. This value must be a multiple of 512 and no more than 4 MB.|  
|`PageRange/@Hash`|Attribute, String|Specifies the Base16-encoded MD5 hash value for the page range.|  
|`BlockList`|Nested XML element|Required for a block blob with named blocks.<br /><br /> For an import operation, the block list specifies a set of blocks that will be imported into Azure Storage. For an export operation, the block list specifies where each block has been stored in the file on the export disk. Each block is described by an offset in the file and a block length; each block is furthermore named by a block ID attribute, and contains an MD5 hash for the block. Up to 50,000 blocks may be used to describe a blob.  All blocks must be ordered by offset, and together should cover the complete range of the file, *i.e.*, there must be no gap between blocks. If the blob is no more than 64 MB, the block IDs for each block must be either all absent or all present. Block IDs are required to be Base64-encoded strings. See [Put Block](/rest/api/storageservices/put-block) for further requirements for block IDs.|  
|`Block`|XML element|Represents a block.|  
|`Block/@Offset`|Attribute, Integer|Specifies the offset where the specified block begins.|  
|`Block/@Length`|Attribute, Integer|Specifies the number of bytes in the block; this value must be no more than 4MB.|  
|`Block/@Id`|Attribute, String|Specifies a string representing the block ID for the block.|  
|`Block/@Hash`|Attribute, String|Specifies the Base16-encoded MD5 hash of the block.|  
|`Blob/MetadataPath`|String|Optional. Specifies the relative path of a metadata file. During an import, the metadata is set on the destination blob. During an export operation, the blob's metadata is stored in the metadata file on the drive.|  
|`Blob/MetadataPath/@Hash`|Attribute, String|Specifies the Base16-encoded MD5 hash of the blob's metadata file.|  
|`Blob/PropertiesPath`|String|Optional. Specifies the relative path of a properties file. During an import, the properties are set on the destination blob. During an export operation, the blob properties are stored in the properties file on the drive.|  
|`Blob/PropertiesPath/@Hash`|Attribute, String|Specifies the Base16-encoded MD5 hash of the blob's properties file.|  
  
## Next steps
 
* [Storage Import/Export REST API](/rest/api/storageimportexport/)
