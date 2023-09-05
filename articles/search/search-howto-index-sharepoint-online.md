---
title: SharePoint indexer (preview)
titleSuffix: Azure Cognitive Search
description: Set up a SharePoint indexer to automate indexing of document library content in Azure Cognitive Search.
author: gmndrg
ms.author: gimondra
manager: liamca

ms.service: cognitive-search
ms.topic: how-to
ms.date: 08/07/2023
---

# Index data from SharePoint document libraries

> [!IMPORTANT]
> SharePoint indexer support is in public preview. It's offered "as-is", under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Preview features aren't recommended for production workloads and aren't guaranteed to become generally available.
>
>To use this preview, [request access](https://aka.ms/azure-cognitive-search/indexer-preview), and after access is enabled, use a [preview REST API (2020-06-30-preview or later)](search-api-preview.md) to index your content. There is currently limited portal support and no .NET SDK support.

This article explains how to configure a [search indexer](search-indexer-overview.md) to index documents stored in SharePoint document libraries for full text search in Azure Cognitive Search. Configuration steps are followed by a deeper exploration of behaviors and scenarios you're likely to encounter.

## Functionality

An indexer in Azure Cognitive Search is a crawler that extracts searchable data and metadata from a data source. The SharePoint indexer will connect to your SharePoint site and index documents from one or more document libraries. The indexer provides the following functionality:

+ Index content and metadata from one or more document libraries.
+ Incremental indexing, where the indexer identifies which file content or metadata have changed and indexes only the updated data. For example, if five PDFs are originally indexed and one is updated, only the updated PDF is indexed.
+ Deletion detection is built in. If a document is deleted from a document library, the indexer will detect the delete on the next indexer run and remove the document from the index.
+ Text and normalized images will be extracted by default from the documents that are indexed. Optionally a [skillset](cognitive-search-working-with-skillsets.md) can be added to the pipeline for [AI enrichment](cognitive-search-concept-intro.md). 

## Prerequisites

+ [SharePoint in Microsoft 365](/sharepoint/introduction) cloud service

+ Files in a [document library](https://support.microsoft.com/office/what-is-a-document-library-3b5976dd-65cf-4c9e-bf5a-713c10ca2872)

## Supported document formats

The SharePoint indexer can extract text from the following document formats:

[!INCLUDE [search-document-data-sources](../../includes/search-blob-data-sources.md)]

## Configure the SharePoint indexer

To set up the SharePoint indexer, you'll need to perform some tasks in the Azure portal and others through the preview REST API.

The following video shows you how to set up the SharePoint indexer.
 
> [!VIDEO https://www.youtube.com/embed/QmG65Vgl0JI]

### Step 1 (Optional): Enable system assigned managed identity

When a system-assigned managed identity is enabled, Azure creates an identity for your search service that can be used by the indexer. This identity is used to automatically detect the tenant the search service is provisioned in.

If the SharePoint site is in the same tenant as the search service, you'll need to enable the system-assigned managed identity for the search service in the Azure portal. If the SharePoint site is in a different tenant from the search service, skip this step.

:::image type="content" source="media/search-howto-index-sharepoint-online/enable-managed-identity.png" alt-text="Enable system assigned managed identity":::

After selecting **Save** you'll see an Object ID that has been assigned to your search service.

:::image type="content" source="media/search-howto-index-sharepoint-online/system-assigned-managed-identity.png" alt-text="System assigned managed identity":::

### Step 2: Decide which permissions the indexer requires

The SharePoint indexer supports both [delegated and application](/graph/auth/auth-concepts#delegated-and-application-permissions) permissions. Choose which permissions you want to use based on your scenario:

+ Delegated permissions, where the indexer runs under the identity of the user or app sending the request. Data access is limited to the sites and files to which the user has access. To support delegated permissions, the indexer requires a [device code prompt](../active-directory/develop/v2-oauth2-device-code.md) to sign in on behalf of the user.

+ Application permissions, where the indexer runs under the identity of the SharePoint tenant with access to all sites and files within the SharePoint tenant. The indexer requires a [client secret](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md) to access the SharePoint tenant. The indexer will also require [tenant admin approval](../active-directory/manage-apps/grant-admin-consent.md) before it can index any content.

If your Azure Active Directory organization has [Conditional Access enabled](../active-directory/conditional-access/overview.md) and your administrator isn't able to grant any device access for Delegated permissions, you should consider Application permissions instead. For more information, see [Azure Active Directory Conditional Access policies](./search-indexer-troubleshooting.md#azure-active-directory-conditional-access-policies).

### Step 3: Create an Azure AD application

The SharePoint indexer will use this Azure Active Directory (Azure AD) application for authentication.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for or navigate to **Azure Active Directory**, then select **App registrations**. 

1. Select **+ New registration**:
    1. Provide a name for your app.
    1. Select **Single tenant**.
    1. Skip the URI designation step. No redirect URI required.
    1. Select **Register**.

1. On the left, select **API permissions**, then **Add a permission**, then **Microsoft Graph**.

    + If the indexer is using delegated API permissions, select **Delegated permissions** and add the following:

        + **Delegated - Files.Read.All**
        + **Delegated - Sites.Read.All**
        + **Delegated - User.Read**
        
        :::image type="content" source="media/search-howto-index-sharepoint-online/delegated-api-permissions.png" alt-text="Delegated API permissions":::
        
        Delegated permissions allow the search client to connect to SharePoint under the security identity of the current user.

    + If the indexer is using application API permissions, then select **Application permissions** and add the following:

        + **Application - Files.Read.All**
        + **Application - Sites.Read.All**
        
        :::image type="content" source="media/search-howto-index-sharepoint-online/application-api-permissions.png" alt-text="Application API permissions":::
        
        Using application permissions means that the indexer will access the SharePoint site in a service context. So when you run the indexer it will have access to all content in the SharePoint tenant, which requires tenant admin approval. A client secret is also required for authentication. Setting up the client secret is described later in this article.

1. Give admin consent.

    Tenant admin consent is required when using application API permissions. Some tenants are locked down in such a way that tenant admin consent is required for delegated API permissions as well. If either of these conditions apply, you’ll need to have a tenant admin grant consent for this Azure AD application before creating the indexer.

    :::image type="content" source="media/search-howto-index-sharepoint-online/aad-app-grant-admin-consent.png" alt-text="Azure AD app grant admin consent":::

1. Select the **Authentication** tab. 

1. Set **Allow public client flows** to **Yes** then select **Save**.

1. Select **+ Add a platform**, then **Mobile and desktop applications**, then check `https://login.microsoftonline.com/common/oauth2/nativeclient`, then **Configure**.

    :::image type="content" source="media/search-howto-index-sharepoint-online/aad-app-authentication-configuration.png" alt-text="Azure AD app authentication configuration":::

1. (Application API Permissions only) To authenticate to the Azure AD application using application permissions, the indexer requires a client secret.

    + Select **Certificates & Secrets** from the menu on the left, then **Client secrets**, then **New client secret**.
    
        :::image type="content" source="media/search-howto-index-sharepoint-online/application-client-secret.png" alt-text="New client secret":::
    
    + In the menu that pops up, enter a description for the new client secret. Adjust the expiration date if necessary. If the secret expires, it will need to be recreated and the indexer needs to be updated with the new secret.
    
        :::image type="content" source="media/search-howto-index-sharepoint-online/application-client-secret-setup.png" alt-text="Setup client secret":::
    
    + The new client secret will appear in the secret list. Once you navigate away from the page the secret will no longer be visible, so copy it using the copy button and save it in a secure location.
    
        :::image type="content" source="media/search-howto-index-sharepoint-online/application-client-secret-copy.png" alt-text="Copy client secret":::

<a name="create-data-source"></a>

### Step 4: Create data source

> [!IMPORTANT] 
> Starting in this section you need to use the preview REST API for the remaining steps. If you’re not familiar with the Azure Cognitive Search REST API, we suggest taking a look at this [Quickstart](search-get-started-rest.md).

A data source specifies which data to index, credentials needed to access the data, and policies to efficiently identify changes in the data (new, modified, or deleted rows). A data source can be used by multiple indexers in the same search service.

For SharePoint indexing, the data source must have the following required properties:

+ **name** is the unique name of the data source within your search service.
+ **type** must be "sharepoint". This value is case-sensitive.
+ **credentials** provide the SharePoint endpoint and the Azure AD application (client) ID. An example SharePoint endpoint is `https://microsoft.sharepoint.com/teams/MySharePointSite`. You can get the endpoint by navigating to the home page of your SharePoint site and copying the URL from the browser.
+ **container** specifies which document library to index. More information on creating the container can be found in the [Controlling which documents are indexed](#controlling-which-documents-are-indexed) section of this document.

To create a data source, call [Create Data Source](/rest/api/searchservice/preview-api/create-or-update-data-source) using preview API version `2020-06-30-Preview` or later.

```http
POST https://[service name].search.windows.net/datasources?api-version=2020-06-30-Preview
Content-Type: application/json
api-key: [admin key]

{
    "name" : "sharepoint-datasource",
    "type" : "sharepoint",
    "credentials" : { "connectionString" : "[connection-string]" },
    "container" : { "name" : "defaultSiteLibrary", "query" : null }
}
```

#### Connection string format

The format of the connection string changes based on whether the indexer is using delegated API permissions or application API permissions

+ Delegated API permissions connection string format

    `SharePointOnlineEndpoint=[SharePoint site url];ApplicationId=[Azure AD App ID];TenantId=[SharePoint site tenant id]`

+ Application API permissions connection string format

    `SharePointOnlineEndpoint=[SharePoint site url];ApplicationId=[Azure AD App ID];ApplicationSecret=[Azure AD App client secret];TenantId=[SharePoint site tenant id]`

> [!NOTE]
> If the SharePoint site is in the same tenant as the search service and system-assigned managed identity is enabled, `TenantId` doesn't have to be included in the connection string. If the SharePoint site is in a different tenant from the search service, `TenantId` must be included.

### Step 5: Create an index

The index specifies the fields in a document, attributes, and other constructs that shape the search experience.

To create an index, call [Create Index](/rest/api/searchservice/create-index):

```http
POST https://[service name].search.windows.net/indexes?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
    "name" : "sharepoint-index",
    "fields": [
        { "name": "id", "type": "Edm.String", "key": true, "searchable": false },
        { "name": "metadata_spo_item_name", "type": "Edm.String", "key": false, "searchable": true, "filterable": false, "sortable": false, "facetable": false },
        { "name": "metadata_spo_item_path", "type": "Edm.String", "key": false, "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "metadata_spo_item_content_type", "type": "Edm.String", "key": false, "searchable": false, "filterable": true, "sortable": false, "facetable": true },
        { "name": "metadata_spo_item_last_modified", "type": "Edm.DateTimeOffset", "key": false, "searchable": false, "filterable": false, "sortable": true, "facetable": false },
        { "name": "metadata_spo_item_size", "type": "Edm.Int64", "key": false, "searchable": false, "filterable": false, "sortable": false, "facetable": false },
        { "name": "content", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": false, "facetable": false }
    ]
}

```

> [!IMPORTANT]
> Only [`metadata_spo_site_library_item_id`](#metadata) may be used as the key field in an index populated by the SharePoint indexer. If a key field doesn't exist in the data source, `metadata_spo_site_library_item_id` is automatically mapped to the key field.

### Step 6: Create an indexer

An indexer connects a data source with a target search index and provides a schedule to automate the data refresh. Once the index and data source have been created, you're ready to create the indexer.

During this section you’ll be asked to sign in with your organization credentials that have access to the SharePoint site. If possible, we recommend creating a new organizational user account and giving that new user the exact permissions that you want the indexer to have. 

There are a few steps to creating the indexer:

1. Send a [Create Indexer](/rest/api/searchservice/preview-api/create-or-update-indexer) request:

    ```http
    POST https://[service name].search.windows.net/indexers?api-version=2020-06-30-Preview
    Content-Type: application/json
    api-key: [admin key]
    
    {
        "name" : "sharepoint-indexer",
        "dataSourceName" : "sharepoint-datasource",
        "targetIndexName" : "sharepoint-index",
        "parameters": {
        "batchSize": null,
        "maxFailedItems": null,
        "maxFailedItemsPerBatch": null,
        "base64EncodeKeys": null,
        "configuration": {
            "indexedFileNameExtensions" : ".pdf, .docx",
            "excludedFileNameExtensions" : ".png, .jpg",
            "dataToExtract": "contentAndMetadata"
          }
        },
        "schedule" : { },
        "fieldMappings" : [
            { 
              "sourceFieldName" : "metadata_spo_site_library_item_id", 
              "targetFieldName" : "id", 
              "mappingFunction" : { 
                "name" : "base64Encode" 
              } 
             }
        ]
    }
    ```

1. When creating the indexer for the first time, the [Create Indexer](/rest/api/searchservice/preview-api/create-or-update-indexer) request will remain waiting until your complete the next steps. You must call [Get Indexer Status](/rest/api/searchservice/get-indexer-status) to get the link and enter your new device code. 

    ```http
    GET https://[service name].search.windows.net/indexers/sharepoint-indexer/status?api-version=2020-06-30-Preview
    Content-Type: application/json
    api-key: [admin key]
    ```

    Note that if you don’t run the [Get Indexer Status](/rest/api/searchservice/get-indexer-status) within 10 minutes the code will expire and you’ll need to recreate the [data source](#create-data-source).

 1. The link for the device login and the new device code will appear under [Get Indexer Status](/rest/api/searchservice/get-indexer-status) response "errorMessage".

    ```http
    {
        "lastResult": {
            "status": "transientFailure",
            "errorMessage": "To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code <CODE> to authenticate."
        }
    }
    ```
1. Provide the code that was included in the error message.

    :::image type="content" source="media/search-howto-index-sharepoint-online/enter-device-code.png" alt-text="Enter device code":::

1. The SharePoint indexer will access the SharePoint content as the signed-in user. The user that logs in during this step will be that signed-in user. So, if you sign in with a user account that doesn’t have access to a document in the Document Library that you want to index, the indexer won’t have access to that document.

    If possible, we recommend creating a new user account and giving that new user the exact permissions that you want the indexer to have.

1. Approve the permissions that are being requested.

    :::image type="content" source="media/search-howto-index-sharepoint-online/aad-app-approve-api-permissions.png" alt-text="Approve API permissions":::

1. The [Create Indexer](/rest/api/searchservice/preview-api/create-or-update-indexer) initial request will complete if all the permissions provided above are correct and within the 10 minute timeframe.


> [!NOTE]
> If the Azure AD application requires admin approval and was not approved before logging in, you may see the following screen. [Admin approval](../active-directory/manage-apps/grant-admin-consent.md) is required to continue.
:::image type="content" source="media/search-howto-index-sharepoint-online/no-admin-approval-error.png" alt-text="Admin approval required":::

### Step 7: Check the indexer status

After the indexer has been created, you can call [Get Indexer Status](/rest/api/searchservice/get-indexer-status):

```http
GET https://[service name].search.windows.net/indexers/sharepoint-indexer/status?api-version=2020-06-30-Preview
Content-Type: application/json
api-key: [admin key]
```

## Updating the data source

If there are no updates to the data source object, the indexer can run on a schedule without any user interaction. However, every time the Azure Cognitive Search data source object is updated or recreated when the device code expires you'll need to sign in again in order for the indexer to run. For example, if you change the data source query, sign in again using the `https://microsoft.com/devicelogin` and a new code.

Once the data source has been updated or recreated when the device code expires, follow the below steps:

1. Call [Run Indexer](/rest/api/searchservice/run-indexer) to manually kick off [indexer execution](search-howto-run-reset-indexers.md).

    ```http
    POST https://[service name].search.windows.net/indexers/sharepoint-indexer/run?api-version=2020-06-30-Preview  
    Content-Type: application/json
    api-key: [admin key]
    ```

1. Check the [indexer status](/rest/api/searchservice/get-indexer-status). If the last indexer run has an error telling you to go to `https://microsoft.com/devicelogin`, go to that page and provide the new code. 

    ```http
    GET https://[service name].search.windows.net/indexers/sharepoint-indexer/status?api-version=2020-06-30-Preview
    Content-Type: application/json
    api-key: [admin key]
    ```

1. Login.

1. Manually run the indexer again and check the indexer status. This time the indexer run should successfully start.

<a name="metadata"></a>

## Indexing document metadata

If you have set the indexer to index document metadata (`"dataToExtract": "contentAndMetadata"`), the following metadata will be available to index.

| Identifier | Type | Description | 
| ------------- | -------------- | ----------- |
| metadata_spo_site_library_item_id | Edm.String | The combination key of site ID, library ID, and item ID which uniquely identifies an item in a document library for a site. |
| metadata_spo_site_id | Edm.String | The ID of the SharePoint site. |
| metadata_spo_library_id | Edm.String | The ID of document library. |
| metadata_spo_item_id | Edm.String | The ID of the (document) item in the library. |
| metadata_spo_item_last_modified | Edm.DateTimeOffset | The last modified date/time (UTC) of the item. |
| metadata_spo_item_name | Edm.String | The name of the item. |
| metadata_spo_item_size | Edm.Int64 | The size (in bytes) of the item. | 
| metadata_spo_item_content_type | Edm.String | The content type of the item. | 
| metadata_spo_item_extension | Edm.String | The extension of the item. |
| metadata_spo_item_weburi | Edm.String | The URI of the item. |
| metadata_spo_item_path | Edm.String | The combination of the parent path and item name. | 

The SharePoint indexer also supports metadata specific to each document type. More information can be found in [Content metadata properties used in Azure Cognitive Search](search-blob-metadata-properties.md).

> [!NOTE]
> To index custom metadata, "additionalColumns" must be specified in the [query parameter of the data source](#query).

## Include or exclude by file type

You can control which files are indexed by setting inclusion and exclusion criteria in the "parameters" section of the indexer definition.

Include specific file extensions by setting `"indexedFileNameExtensions"` to a comma-separated list of file extensions (with a leading dot). Exclude specific file extensions by setting `"excludedFileNameExtensions"` to the extensions that should be skipped. If the same extension is in both lists, it will be excluded from indexing.

```http
PUT /indexers/[indexer name]?api-version=2020-06-30
{
    "parameters" : { 
        "configuration" : { 
            "indexedFileNameExtensions" : ".pdf, .docx",
            "excludedFileNameExtensions" : ".png, .jpeg" 
        } 
    }
}
```

<a name="controlling-which-documents-are-indexed"></a>

## Controlling which documents are indexed

A single SharePoint indexer can index content from one or more document libraries. Use the "container" parameter on the data source definition to indicate which sites and document libraries to index from.
T
The [data source "container" section](#create-data-source) has two properties for this task: "name" and "query".

### Name

The "name" property is required and must be one of three values:

| Value | Description |
|-|-|
| defaultSiteLibrary | Index all content from the site's default document library. |
| allSiteLibraries | Index all content from all document libraries in a site. Document libraries from a subsite are out of scope/ If you need content from subsites, choose "useQuery" and specify "includeLibrariesInSite". |
| useQuery | Only index the content defined in the "query". |

<a name="query"></a>

### Query

The "query" parameter of the data source is made up of keyword/value pairs. The below are the keywords that can be used. The values are either site URLs or document library URLs.

> [!NOTE]
> To get the value for a particular keyword, we recommend navigating to the document library that you’re trying to include/exclude and copying the URI from the browser. This is the easiest way to get the value to use with a keyword in the query.

| Keyword | Value description and examples |
| ------- | ------------------------ |
| null | If null or empty, index either the default document library or all document libraries depending on the container name.	<br><br>Example: <br><br>``` "container" : { "name" : "defaultSiteLibrary", "query" : null } ``` |
| includeLibrariesInSite | Index content from all libraries under the specified site in the connection string. The scope includes any subsites of your site. The value should be the URI of the site or subsite. <br><br>Example: <br><br>```"container" : { "name" : "useQuery", "query" : "includeLibrariesInSite=https://mycompany.sharepoint.com/mysite" }``` |
| includeLibrary | Index all content from this library. The value is the fully qualified path to the library, which can be copied from your browser: <br><br>Example 1 (fully qualified path): <br><br>```"container" : { "name" : "useQuery", "query" : "includeLibrary=https://mycompany.sharepoint.com/mysite/MyDocumentLibrary" }``` <br><br>Example 2 (URI copied from your browser): <br><br>```"container" : { "name" : "useQuery", "query" : "includeLibrary=https://mycompany.sharepoint.com/teams/mysite/MyDocumentLibrary/Forms/AllItems.aspx" }``` |
| excludeLibrary | Don't index content from this library. The value is the fully qualified path to the library, which can be copied from your browser: <br><br> Example 1 (fully qualified path): <br><br>```"container" : { "name" : "useQuery", "query" : "includeLibrariesInSite=https://mysite.sharepoint.com/subsite1; excludeLibrary=https://mysite.sharepoint.com/subsite1/MyDocumentLibrary" }``` <br><br> Example 2 (URI copied from your browser): <br><br>```"container" : { "name" : "useQuery", "query" : "includeLibrariesInSite=https://mycompany.sharepoint.com/teams/mysite; excludeLibrary=https://mycompany.sharepoint.com/teams/mysite/MyDocumentLibrary/Forms/AllItems.aspx" }``` |
| additionalColumns | Index columns from the document library. The value is a comma-separated list of column names you want to index. Use a double backslash to escape semicolons and commas in column names: <br><br> Example 1 (additionalColumns=MyCustomColumn,MyCustomColumn2):  <br><br>```"container" : { "name" : "useQuery", "query" : "includeLibrary=https://mycompany.sharepoint.com/mysite/MyDocumentLibrary;additionalColumns=MyCustomColumn,MyCustomColumn2" }``` <br><br> Example 2 (escape characters using double backslash): <br><br> ```"container" : { "name" : "useQuery", "query" : "includeLibrary=https://mycompany.sharepoint.com/teams/mysite/MyDocumentLibrary/Forms/AllItems.aspx;additionalColumns=MyCustomColumnWith\\,,MyCustomColumnWith\\;" }``` |

## Handling errors

By default, the SharePoint indexer stops as soon as it encounters a document with an unsupported content type (for example, an image). You can use the `excludedFileNameExtensions` parameter to skip certain content types. However, you may need to index documents without knowing all the possible content types in advance. To continue indexing when an unsupported content type is encountered, set the `failOnUnsupportedContentType` configuration parameter to false:

```http
PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2020-06-30-Preview
Content-Type: application/json
api-key: [admin key]

{
    ... other parts of indexer definition
    "parameters" : { "configuration" : { "failOnUnsupportedContentType" : false } }
}
```

For some documents, Azure Cognitive Search is unable to determine the content type, or unable to process a document of otherwise supported content type. To ignore this failure mode, set the `failOnUnprocessableDocument` configuration parameter to false:

```http
"parameters" : { "configuration" : { "failOnUnprocessableDocument" : false } }
```

Azure Cognitive Search limits the size of documents that are indexed. These limits are documented in [Service Limits in Azure Cognitive Search](./search-limits-quotas-capacity.md). Oversized documents are treated as errors by default. However, you can still index storage metadata of oversized documents if you set `indexStorageMetadataOnlyForOversizedDocuments` configuration parameter to true:

```http
"parameters" : { "configuration" : { "indexStorageMetadataOnlyForOversizedDocuments" : true } }
```

You can also continue indexing if errors happen at any point of processing, either while parsing documents or while adding documents to an index. To ignore a specific number of errors, set the `maxFailedItems` and `maxFailedItemsPerBatch` configuration parameters to the desired values. For example:

```http
{
    ... other parts of indexer definition
    "parameters" : { "maxFailedItems" : 10, "maxFailedItemsPerBatch" : 10 }
}
```

## Limitations and considerations

These are the limitations of this feature:

+ Indexing [SharePoint Lists](https://support.microsoft.com/office/introduction-to-lists-0a1c3ace-def0-44af-b225-cfa8d92c52d7) is not supported.

+ If a SharePoint file content and/or metadata has been indexed, renaming a SharePoint folder in its parent hierarchy is not a condition that will re-index the document.

+ Indexing SharePoint .ASPX site content is not supported.

+ [Private endpoint](search-indexer-howto-access-private.md) is not supported.

+ SharePoint supports a granular authorization model that determines per-user access at the document level. The SharePoint indexer does not pull these permissions into the search index, and Cognitive Search does not support document-level authorization. When a document is indexed from SharePoint into a search service, the content is available to anyone who has read access to the index. If you require document-level permissions, you should investigate [security filters to trim results](search-security-trimming-for-azure-search-with-aad.md) of unauthorized content. 


These are the considerations when using this feature:

+ If there is a requirement to implement a SharePoint content indexing solution with Cognitive Search in a production environment, consider create a custom connector using [Microsoft Graph Data Connect](/graph/data-connect-concept-overview) with [Blob indexer](search-howto-indexing-azure-blob-storage.md) and [Microsoft Graph API](/graph/use-the-api) for incremental indexing.

+ There could be Microsoft 365 processes that update SharePoint file system-metadata (based on different configurations in SharePoint) and will cause the SharePoint indexer to trigger. Make sure that you test your setup and understand the document processing count prior to using any AI enrichment. Since this is a third-party connector to Azure (since SharePoint is located in Microsoft 365), SharePoint configuration is not checked by the indexer.



## See also

+ [Indexers in Azure Cognitive Search](search-indexer-overview.md)
+ [Content metadata properties used in Azure Cognitive Search](search-blob-metadata-properties.md)
