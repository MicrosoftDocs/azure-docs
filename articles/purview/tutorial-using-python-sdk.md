---
title: "How to use Azure Purview Python SDK"
description: This tutorial describes how to use the Azure Purview Python SDK to scan data and search the catalog.
author: raoufaliouat
ms.author: raoufaliouat
ms.service: purview
ms.subservice: purview-data-scanning
ms.topic: tutorial
ms.date: 01/10/2022

# Customer intent: I can use the scanning and catalog Python SDKs to perform CRUD operations on data sources and scans, trigger scans and also to search the catalog.
---



# Tutorial: Use the Azure Purview Python SDK

The aim of this tutorial is to introduce you to the use of the Azure Purview Python SDK to programmatically do the most common operations you can find in Azure Purview Studio.

In this tutorial, you will learn how to:

*   Grant the required rights to work programmatically with Azure Purview
*   Register a Blob Storage container as a data source in Azure Purview
*   Define and run a scan
*   Search the catalog
*   Delete a data source

## Prerequisites

For this tutorial, you will need :
*   Python 3.6+
*   An active Azure Subscription 
*   An Azure Active Directory tenant associated with you subscription
*   An Azure Storage account
*   An Azure Purview account


## Give Purview access to the Storage account

Before being able to scan the content of the Storage account, you need to give Azure Purview the right role. 
Go to your Storage Account via the portal. Select Access Control (IAM). Select the Add button and select **Add role assignment**.

:::image type="content" source="media/tutorial-using-python-sdk/add-role-assignment-storage.png" alt-text="Screenshot that shows Access .Control menu of the Storage Account"::: 

In the next window, search for the **Storage blob Reader** role and select it:

:::image type="content" source="media/tutorial-using-python-sdk/storage-blob-reader-role.png" alt-text="Screenshot that shows the Storage Blob Reader role in the list of available roles"::: 

Then go on the **Members** tab and select **Select members**:

:::image type="content" source="media/tutorial-using-python-sdk/select-members-blob-reader-role.png" alt-text="Screenshot that shows what to select to grant the role the Azure Purview Managed System Identity"::: 

A new pane appears on the right. Search and select the name of your existing Azure Purview instance.
You can then select **Review + Assign**. Azure Purview now has the required reading right to scan your Blob Storage. 


## Grant your application the access to your Azure Purview account
1. First, you need a [service principal with a secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#register-an-application-with-azure-ad-and-create-a-service-principal).
Get the following information from your service principal and secret, they will be needed later:
    *    Client ID (or Application ID)
    *    Tenant ID (or Directory ID)
    *    Client secret 
    
2. You now need to give the relevant Azure Purview roles to your service principal. To do so, access the Azure Purview instance. Select **Open Purview Studio** or open [Azure Purview's home page](https://web.purview.azure.com/) and choose the instance that you deployed.

    Inside Purview Studio, go to the collections:
    :::image type="content" source="media/tutorial-using-python-sdk/purview-collections.png" alt-text="Screenshot that shows how to access Azure Purview collections"::: 

    Select the collection you want to work with, and go on the **Role assignments** tab. Add the service principal (using its name) in the following roles: Collection admins, Data source admins, Data curators, Data readers.

## Install the Python packages
1.	Open a new command prompt or terminal
1.	Install the Azure identity package for authentication:
    ```bash
    pip install azure-identity
    ```
1.	Install the Azure Purview Scanning Client package
    ```bash
    pip install azure-purview-scanning
    ```
1.	Install the Azure Purview Client package
    ```bash
    pip install azure-purview-catalog
    ```
1.	Install the Azure core package
    ```bash
    pip install azure-core
    ```

## Instantiate a Scanning and a Catalog client 
In this section, you learn how to instantiate:
*    A scanning client useful to deal with scan-related tasks like registering data sources, creating and managing scan rules, triggering a scan, etc. 
*    A catalog client useful to interact with the catalog through searching, browsing the discovered assets, identifying the sensitivity of your data, etc.

First you need to authenticate to your Azure Active Directory. In this tutorial, you will use the [client secret you created](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#option-2-create-a-new-application-secret).


1.	Start with required import statements:
    ```python
    from azure.purview.scanning import PurviewScanningClient
    from azure.purview.catalog import PurviewCatalogClient
    from azure.identity import ClientSecretCredential 
    from azure.core.exceptions import HttpResponseError
    ```

1.	Specify the following information in the code: 
    * Client ID (or Application ID)
    * Tenant ID (or Directory ID)
    * Client secret
    
    ```python
    client_id = "<your client id>" 
    client_secret = "<your client secret>"
    tenant_id = "<your tenant id>"
    ```

1.	You also need to specify the name of your Azure Purview account:
    ```python
    reference_name_purview = "<name of your Azure Purview account>"
    ```
1.	You can now instantiate the two clients:
    ```python
    def get_credentials():
        credentials = ClientSecretCredential(client_id=client_id, client_secret=client_secret, tenant_id=tenant_id)
        return credentials

    def get_purview_client():
        credentials = get_credentials()
        client = PurviewScanningClient(endpoint=f"https://{reference_name_purview}.scan.purview.azure.com", credential=credentials, logging_enable=True)  
        return client
    
    def get_catalog_client():
        credentials = get_credentials()
        client = PurviewCatalogClient(endpoint=f"https://{reference_name_purview}.purview.azure.com/", credential=credentials, logging_enable=True)
        return client
    ```
 
You are now able to do several operations in a similar fashion.

## Register a data source
In this section, you register your Blob Storage. For the sake of this tutorial, you will register it in the root collection of Azure Purview.
1.	First you need to define the following information to be able to register the Blob storage programmatically:
    ```python
    storage_name = "<name of your Storage Account>"
    storage_id = "<id of your Storage Account>"
    rg_name = "<name of your resource group>"
    rg_location = "<location of your resource group>"
    reference_name_purview = "<name of your Azure Purview account>"
    ```


1.	For both clients and depending on the operations, you might need to also provide an input body. This is the case for data source registration:
    ```python
    ds_name = "myds"
    
    body_input = {
            "kind": "AzureStorage",
            "properties": {
                "endpoint": f"https://{storage_name}.blob.core.windows.net/",
                "resourceGroup": rg_name,
                "location": rg_location,
                "resourceName": storage_name,
                "resourceId": storage_id,
                "collection": {
                    "type": "CollectionReference",
                    "referenceName": reference_name_purview #here we use the root collection
                },
                "dataUseGovernance": "Disabled"
            }
        }    
    ```
    Note that in the above snippet, the name of the collection is the same as the Azure Purview account because we work with the root collection that has the same name. Feel free to pass the name of an other collection you might have created.

1.	Register the DS
    ```python

    try:
        client = get_purview_client()
    except AzureError as e:
        print(e)

    try:
        response = client.data_sources.create_or_update(ds_name, body=body_input)
        print(response)
        print(f"Data source {ds_name} successfully created or updated")
    except HttpResponseError as e:
        print(e)
    ```

    When the registration process succeeds, you can see an enriched body response from the client.

In the following sections, you will scan the data source you just registered, and search the catalog. The code structure will be very similar.  

### Full code
```python
from azure.purview.scanning import PurviewScanningClient
from azure.purview.catalog import PurviewCatalogClient
from azure.identity import ClientSecretCredential 
from azure.core.exceptions import HttpResponseError

client_id = "<your client id>" 
client_secret = "<your client secret>",
tenant_id = "<your tenant id>",
reference_name_purview = "<name of your Azure Purview account>"


def get_credentials():
    credentials = ClientSecretCredential(client_id=client_id, client_secret=client_secret, tenant_id=tenant_id)
    return credentials

def get_purview_client():
    credentials = get_credentials()
    client = PurviewScanningClient(endpoint=f"https://{reference_name_purview}.scan.purview.azure.com", credential=credentials, logging_enable=True)  
    return client

def get_catalog_client():
    credentials = get_credentials()
    client = PurviewCatalogClient(endpoint=f"https://{reference_name_purview}.purview.azure.com/", credential=credentials, logging_enable=True)
    return client

try:
    client = get_purview_client()
except AzureError as e:
    print(e)

try:
    response = client.data_sources.create_or_update(ds_name, body=body_input)
    print(response)
    print(f"Data source {ds_name} successfully created or updated")
except HttpResponseError as e:
    print(e)
```


## Scan the data source

Scanning a data source is done in three steps:
1.    (Optional): Define a Scan rule
1.    Create a scan definition
1.    Trigger a scan run

In this tutorial, you will use the default scan rules for Blob Storage containers. However, you can easily create custom scan rules programmatically with the Azure Purview Scanning Client.

Now let us scan the data source you registered above.

1. Add an import statement to generate [unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier):
    ```python
    import uuid
    ```
    
1.	First, create a scan definition:
    ```python
    ds_name = "<name of your registered data source>"
    scan_name = "<name of the scan you want to define>"
    reference_name_purview = "<name of your Azure Purview account>"

    body_input = {
            "kind":"AzureStorageMsi",
            "properties": { 
                "scanRulesetName": "AzureStorage", 
                "scanRulesetType": "System", #We use the default scan rule set 
                "collection": 
                    {
                        "referenceName": reference_name_purview, #The data source is registered in the root collection
                        "type": "CollectionReference"
                    }
            }
        }

    try:
        response = client.scans.create_or_update(data_source_name=ds_name, scan_name=scan_name, body=body_input)
        print(response)
        print(f"Scan {scan_name} successfully created or updated")
    except HttpResponseError as e:
        print(e)
    ```

1.	Now that the scan is defined you can trigger a scan run with a unique id:
    ```python
    run_id = uuid.uuid4() #unique id of the new scan

    try:
        response = client.scan_result.run_scan(data_source_name=ds_name, scan_name=scan_name, run_id=run_id)
        print(response)
        print(f"Scan {scan_name} successfully started")
    except HttpResponseError as e:
        print(e)
    ```
## Search catalog
Once a scan is complete, it is very likely that assets have been discovered and even classified. In this section, you use the Azure Purview Catalog client to search the whole catalog.
1. This time you need to instantiate the **catalog** client instead of the scanning one:
    ```python
    try:
        client_catalog = get_catalog_client()
    except AzureError as e:
        print(e)  
    ```
1.	Configure your search criteria and keywords in the input body: 
    ```python
    keywords = "keywords you want to search"

    body_input={
        "keywords": keywords
    }
    ```
    Here you only specify keywords, but keep in mind you can add many other fields to further specify your query.
		
1.	Search the catalog:
    ```python
    try:
        response = client_catalog.discovery.query(search_request=body_input)
        print(response)
    except HttpResponseError as e:
        print(e)
    ```

## Delete a data source
In this section, you learn how to delete the data source you register earlier. This operation is fairly simple, and is done with the scanning client:

```python
    ds_name = "<name of the registered data source you want to delete>"
    try:
        response = client.data_sources.delete(ds_name)
        print(response)
        print(f"Data source {ds_name} successfully deleted")
    except HttpResponseError as e:
        print(e)
```

## Next steps

> [!div class="nextstepaction"]
> [Learn more about the Python Azure Purview Scanning Client](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-purview-scanning/1.0.0b2/index.html)

> [Learn more about the Python Azure Purview Catalog Client](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-purview-catalog/1.0.0b2/index.html)

