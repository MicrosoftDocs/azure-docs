<properties
pageTitle="Indexing Azure Blob Storage with Azure Search"
description="Learn how to index Azure Blob Storage and extract text from documents with Azure Search"
services="search"
documentationCenter=""
authors="chaosrealm"
manager="pablocas"
editor="" />

<tags
ms.service="search"
ms.devlang="rest-api"
ms.workload="search" ms.topic="article"  
ms.tgt_pltfrm="na"
ms.date="08/08/2016"
ms.author="eugenesh" />

# Indexing Documents in Azure Blob Storage with Azure Search

This article shows how to use Azure Search to index documents (such as PDFs, Microsoft Office documents, and several other common formats) stored in Azure Blob storage. The new Azure Search blob indexer makes this process quick and seamless. 

> [AZURE.IMPORTANT] Currently this functionality is in preview. It is available only in the REST API using version **2015-02-28-Preview**. Please remember, preview APIs are intended for testing and evaluation, and should not be used in production environments.

## Supported document formats

The blob indexer can extract text from the following document formats:

- PDF
- Microsoft Office formats: DOCX/DOC, XLSX/XLS, PPTX/PPT, MSG (Outlook emails)  
- HTML
- XML
- ZIP
- EML
- Plain text files  
- JSON (see [Indexing JSON blobs](search-howto-index-json-blobs.md) for details)

## Setting up blob indexing

To set up and configure an Azure Blob Storage indexer, you can use the Azure Search REST API to create and manage **indexers** and **data sources** as described in [this article](https://msdn.microsoft.com/library/azure/dn946891.aspx). In the future, support for blob indexing will be added to the Azure Search .NET SDK and the Azure Portal.

To set up an indexer, do the following three steps: create a data source, create an index, configure the indexer.

### Step 1: Create a data source

A data source specifies which data to index, credentials needed to access the data, and policies that enable Azure Search to efficiently identify changes in the data (new, modified, or deleted rows). A data source can be used by multiple indexers in the same subscription.

For blob indexing, the data source must have the following required properties: 

- **name** is the unique name of the data source within your search service. 

- **type** must be `azureblob`. 

- **credentials** provides the storage account connection string as the `credentials.connectionString` parameter. You can get the connection string from the Azure Portal by navigating to the desired storage account blade > **Settings** > **Keys** and use the "Primary Connection String" or "Secondary Connection String" value. Since the connection string is bound to a storage account, specifying the connection string implicitly identifies the storage account providing the data.

- **container** specifies a container in your storage account. By default, all blobs within the container are retrievable. If you only want to index blobs in a particular virtual directory, you can specify that directory using the optional **query** parameter. 

The following example illustrates a data source definition:

	POST https://[service name].search.windows.net/datasources?api-version=2015-02-28-Preview
	Content-Type: application/json
	api-key: [admin key]

	{
	    "name" : "blob-datasource",
	    "type" : "azureblob",
	    "credentials" : { "connectionString" : "<my storage connection string>" },
	    "container" : { "name" : "my-container", "query" : "<optional-virtual-directory-name>" }
	}   

For more on the Create Datasource API, see [Create Datasource](search-api-indexers-2015-02-28-preview.md#create-data-source).

### Step 2: Create an index 

The index specifies the fields in a document, attributes, and other constructs that shape the search experience.  

For blob indexing, be sure that your index has a searchable `content` field for storing the blob.

	POST https://[service name].search.windows.net/indexes?api-version=2015-02-28
	Content-Type: application/json
	api-key: [admin key]

	{
  		"name" : "my-target-index",
  		"fields": [
    		{ "name": "id", "type": "Edm.String", "key": true, "searchable": false },
    		{ "name": "content", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": false, "facetable": false }
  		]
	}

For more on the Create Index API, see [Create Index](https://msdn.microsoft.com/library/dn798941.aspx)

### Step 3: Create an indexer 

An indexer connects data sources with target search indexes, and provides scheduling information so that you can automate data refresh. Once the index and data source have been created, its relatively simple to create an indexer that references the data source and a target index. For example:

	POST https://[service name].search.windows.net/indexers?api-version=2015-02-28-Preview
	Content-Type: application/json
	api-key: [admin key]

	{
	  "name" : "blob-indexer",
	  "dataSourceName" : "blob-datasource",
	  "targetIndexName" : "my-target-index",
	  "schedule" : { "interval" : "PT2H" }
	}

This indexer will run every two hours (schedule interval is set to "PT2H"). To run an  indexer every 30 minutes, set the interval to "PT30M". Shortest supported interval is 5 minutes. Schedule is optional - if omitted, an indexer runs only once when created. However, you can run an indexer on-demand at any time.   

For more details on the Create Indexer API, check out [Create Indexer](search-api-indexers-2015-02-28-preview.md#create-indexer).


## Document extraction process

Azure Search indexes each document (blob) as follows:

- The entire text content of the document is extracted into a string field named `content`. Note that we currently don't provide support for extracting multiple documents from a single blob:
	- For example, a CSV file is indexed as a single document. If you need to treat each line in a CSV as a separate document, please vote for [this UserVoice suggestion](https://feedback.azure.com/forums/263029-azure-search/suggestions/13865325-please-treat-each-line-in-a-csv-file-as-a-separate).
	- A compound or embedded document (such as a ZIP archive or a Word document with embedded Outlook email with a PDF attachment) is also indexed as a single document.

- User-specified metadata properties present on the blob, if any, are extracted verbatim. The metadata properties can also be used to control certain aspects of the document extraction process – see [Using Custom Metadata to Control Document Extraction](#CustomMetadataControl) for more details.

- Standard blob metadata properties are extracted into the following fields:

	- **metadata\_storage\_name** (Edm.String) - the file name of the blob. For example, if you have a blob /my-container/my-folder/subfolder/resume.pdf, the value of this field is `resume.pdf`.

	- **metadata\_storage\_path** (Edm.String) - the full URI of the blob, including the storage account. For example, `https://myaccount.blob.core.windows.net/my-container/my-folder/subfolder/resume.pdf`

	- **metadata\_storage\_content\_type** (Edm.String) - content type as specified by the code you used to upload the blob. For example, `application/octet-stream`.

	- **metadata\_storage\_last\_modified** (Edm.DateTimeOffset) - last modified timestamp for the blob. Azure Search uses this timestamp to identify changed blobs, in order to avoid re-indexing everything after the initial indexing.

	- **metadata\_storage\_size** (Edm.Int64) - blob size in bytes.

	- **metadata\_storage\_content\_md5** (Edm.String) - MD5 hash of the blob content, if available.

- Metadata properties specific to each document format are extracted into the fields listed [here](#ContentSpecificMetadata).

You don't need to define fields for all of the above properties in your search index - just capture the properties you need for your application. 

> [AZURE.NOTE] Often, the field names in your existing index will be different from the field names generated during document extraction. You can use **field mappings** to map the property names provided by Azure Search to the field names in your search index. You will see an example of field mappings use below. 

## Picking the document key field and dealing with different field names

In Azure Search, the document key uniquely identifies a document. Every search index must have exactly one key field of type Edm.String. The key field is required for each document that is being added to the index (it is actually the only required field).  
   
You should carefully consider which extracted field should map to the key field for your index. The candidates are:

- **metadata\_storage\_name** - this might be a convenient candidate, but note that 1) the names might not be unique, as you may have blobs with the same name in different folders, and 2) the name may contain characters that are invalid in document keys, such as dashes. You can deal with invalid characters by enabling the `base64EncodeKeys` option in the indexer properties - if you do this, remember to encode document keys when passing them in API calls such as Lookup. (For example, in .NET you can use the [UrlTokenEncode method](https://msdn.microsoft.com/library/system.web.httpserverutility.urltokenencode.aspx) for that purpose).

- **metadata\_storage\_path** - using the full path ensures uniqueness, but the path definitely contains `/` characters that are [invalid in a document key](https://msdn.microsoft.com/library/azure/dn857353.aspx).  As above, you have the option of encoding the keys using the `base64EncodeKeys` option.

- If none of the options above work for you, you have the ultimate flexibility of adding a custom metadata property to the blobs. This option does, however, require your blob upload process to add that metadata property to all blobs. Since the key is a required property, all blobs that don't have that property will fail to be indexed.

> [AZURE.IMPORTANT] If there is no explicit mapping for the key field in the index, Azure Search will automatically use `metadata_storage_path` (the second option above) as the key and enable base-64 encoding of keys.

For this example, let's pick the `metadata_storage_name` field as the document key. Let's also assume your index has a key field named `key` and a field `fileSize` for storing the document size. To wire things up as desired, specify the following field mappings when creating or updating your indexer:

	"fieldMappings" : [
	  { "sourceFieldName" : "metadata_storage_name", "targetFieldName" : "key" },
	  { "sourceFieldName" : "metadata_storage_size", "targetFieldName" : "fileSize" }
	]

To bring this all together, here's how you can add field mappings and enable base-64 encoding of keys for an existing indexer:

	PUT https://[service name].search.windows.net/indexers/blob-indexer?api-version=2015-02-28-Preview
	Content-Type: application/json
	api-key: [admin key]

	{
	  "dataSourceName" : " blob-datasource ",
	  "targetIndexName" : "my-target-index",
	  "schedule" : { "interval" : "PT2H" },
	  "fieldMappings" : [
	    { "sourceFieldName" : "metadata_storage_name", "targetFieldName" : "key" },
	    { "sourceFieldName" : "metadata_storage_size", "targetFieldName" : "fileSize" }
	  ],
	  "parameters" : { "base64EncodeKeys": true }
	}

> [AZURE.NOTE] To learn more about field mappings, see [this article](search-indexer-field-mappings.md).

## Incremental indexing and deletion detection

When you set up a blob indexer to run on a schedule, it re-indexes only the changed blobs, as determined by the blob's `LastModified` timestamp.

> [AZURE.NOTE] You don't have to specify a change detection policy – incremental indexing is enabled for you automatically.

To indicate that certain documents must be removed from the index, you should use a soft delete strategy - instead of deleting the corresponding blobs, add a custom metadata property to indicate that they're deleted, and set up a soft deletion detection policy on the data source.

> [AZURE.WARNING] If you just delete the blobs instead of using a deletion detection policy, corresponding documents will not be removed from the search index.

For example, the policy shown below will consider that a blob is deleted if it has a metadata property `IsDeleted` with the value `true`:

	PUT https://[service name].search.windows.net/datasources?api-version=2015-02-28-Preview
	Content-Type: application/json
	api-key: [admin key]

	{
	    "name" : "blob-datasource",
	    "type" : "azureblob",
	    "credentials" : { "connectionString" : "<your storage connection string>" },
		"container" : { "name" : "my-container", "query" : "my-folder" },
		"dataDeletionDetectionPolicy" : {
			"@odata.type" :"#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy", 	
			"softDeleteColumnName" : "IsDeleted",
			"softDeleteMarkerValue" : "true"
		}
	}   

<a name="ContentSpecificMetadata"></a>
## Content type-specific metadata properties

The following table summarizes processing done for each document format, and describes the metadata properties extracted by Azure Search.

Document format / content type | Content-type specific metadata properties | Processing details
-------------------------------|-------------------------------------------|-------------------
HTML (`text/html`) | `metadata_content_encoding`<br/>`metadata_content_type`<br/>`metadata_language`<br/>`metadata_description`<br/>`metadata_keywords`<br/>`metadata_title` | Strip HTML markup and extract text
PDF (`application/pdf`) | `metadata_content_type`<br/>`metadata_language`<br/>`metadata_author`<br/>`metadata_title`| Extract text, including embedded documents (excluding images)
DOCX (application/vnd.openxmlformats-officedocument.wordprocessingml.document) | `metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` | Extract text, including embedded documents
DOC (application/msword) | `metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` | Extract text, including embedded documents
XLSX (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet) | `metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` | Extract text, including embedded documents
XLS (application/vnd.ms-excel) | `metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` | Extract text, including embedded documents
PPTX (application/vnd.openxmlformats-officedocument.presentationml.presentation) | `metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_slide_count`<br/>`metadata_title` | Extract text, including embedded documents
PPT (application/vnd.ms-powerpoint) | `metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_slide_count`<br/>`metadata_title` | Extract text, including embedded documents
MSG (application/vnd.ms-outlook) | `metadata_content_type`<br/>`metadata_message_from`<br/>`metadata_message_to`<br/>`metadata_message_cc`<br/>`metadata_message_bcc`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_subject` | Extract text, including attachments
ZIP (application/zip) | `metadata_content_type` | Extract text from all documents in the archive
XML (application/xml) | `metadata_content_type`</br>`metadata_content_encoding`</br> | Strip XML markup and extract text
JSON (application/json) | `metadata_content_type`</br>`metadata_content_encoding` | Extract text<br/>NOTE: If you need to extract multiple document fields from a JSON blob, see [Indexing JSON blobs](search-howto-index-json-blobs.md) for details
EML (message/rfc822) | `metadata_content_type`<br/>`metadata_message_from`<br/>`metadata_message_to`<br/>`metadata_message_cc`<br/>`metadata_creation_date`<br/>`metadata_subject` | Extract text, including attachments
Plain text (text/plain) | `metadata_content_type`</br>`metadata_content_encoding`</br> | 

<a name="CustomMetadataControl"></a>
## Using custom metadata to control document extraction

You can add metadata properties to a blob to control certain aspects of the blob indexing and document extraction process. Currently the following properties are supported:

Property name | Property value | Explanation
--------------|----------------|------------
AzureSearch_Skip | "true" | Instructs the blob indexer to completely skip the blob; neither metadata nor content extraction will be attempted. This is useful when you want to skip certain content types, or when a particular blob fails repeatedly and interrupts the indexing process.
AzureSearch_SkipContent | "true" | Instructs the blob indexer to only index the metadata and skip extracting content of the blob. This is useful if the blob content is not interesting, but you still want to index the metadata attached to the blob.

<a name="IndexerParametersConfigurationControl"></a>
## Using indexer parameters to control document extraction

Several indexer configuration parameters are available to control which blobs, and which parts of a blob's content and metadata, will be indexed. 

### Index only the blobs with specific file extensions

You can index only the blobs with the file name extensions you specify by using the `indexedFileNameExtensions` indexer configuration parameter. The value is a string containing a comma-separated list of file extensions (with a leading dot). For example, to index only the .PDF and .DOCX blobs, do this: 

	PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2015-02-28-Preview
	Content-Type: application/json
	api-key: [admin key]

	{
	  ... other parts of indexer definition
	  "parameters" : { "configuration" : { "indexedFileNameExtensions" : ".pdf,.docx" } }
	}

### Exclude blobs with specific file extensions from indexing

You can exclude blobs with specific file name extensions from indexing by using the `excludedFileNameExtensions` configuration parameter. The value is a string containing a comma-separated list of file extensions (with a leading dot). For example, to index all blobs except those with the .PNG and .JPEG extensions, do this: 

	PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2015-02-28-Preview
	Content-Type: application/json
	api-key: [admin key]

	{
	  ... other parts of indexer definition
	  "parameters" : { "configuration" : { "excludedFileNameExtensions" : ".png,.jpeg" } }
	}

If both `indexedFileNameExtensions` and `excludedFileNameExtensions` parameters are present, Azure Search first looks at `indexedFileNameExtensions`, then at `excludedFileNameExtensions`. This means that if the same file extension is present in both lists, it will be excluded from indexing. 

### Index storage metadata only

You can index only the storage metadata and completely skip the document extraction process using the `indexStorageMetadataOnly` configuration property. This is useful when you don't need the document content, nor do you need any of the content type-specific metadata properties. To do this, set the `indexStorageMetadataOnly` property to `true`: 

	PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2015-02-28-Preview
	Content-Type: application/json
	api-key: [admin key]

	{
	  ... other parts of indexer definition
	  "parameters" : { "configuration" : { "indexStorageMetadataOnly" : true } }
	}

### Index both storage and content type metadata, but skip content extraction

If you need to extract all of the metadata but skip content extraction for all blobs, you can request this behavior using the indexer configuration, instead of having to add `AzureSearch_SkipContent` metadata to each blob individually. To do this, set the `skipContent` indexer configuration configuration property to `true`: 

	PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2015-02-28-Preview
	Content-Type: application/json
	api-key: [admin key]

	{
	  ... other parts of indexer definition
	  "parameters" : { "configuration" : { "skipContent" : true } }
	}

## Help us make Azure Search better

If you have feature requests or ideas for improvements, please reach out to us on our [UserVoice site](https://feedback.azure.com/forums/263029-azure-search/).
