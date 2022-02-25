---
title: "Tutorial: How to use Azure Purview Python SDK"
description: This tutorial describes how to use the Azure Purview Python SDK to scan data and search the catalog.
author: raliouat
ms.author: raoufaliouat
ms.service: purview
ms.subservice: purview-data-scanning
ms.topic: tutorial
ms.date: 02/25/2022

# Customer intent: I can use the scanning and catalog Python SDKs to perform CRUD operations on data sources and scans, trigger scans and also to search the catalog.
---

# Tutorial: Use the Azure Purview Python SDK

This tutorial will introduce you to using the Azure Purview Python SDK. You can use the SDK to do all the most common Azure Purview operations programmatically, rather than through the Azure Purview Studio.

In this tutorial, you'll learn how us the SDK to:

> [!div class="checklist"]
>*   Grant the required rights to work programmatically with Azure Purview
>*   Register a Blob Storage container as a data source in Azure Purview
>*   Define and run a scan
>*   Search the catalog
>*   Delete a data source

## Prerequisites

For this tutorial, you'll need:
*   [Python 3.6 or higher](https://www.python.org/downloads/) 
*   An active Azure Subscription. [If you don't have one, you can create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
*   An Azure Active Directory tenant associated with your subscription.
*   An Azure Storage account. If you don't already have one, you can [follow our quickstart guide to create one](https://docs.microsoft.com/azure/storage/common/storage-account-create?tabs=azure-portal).
*   An Azure Purview account. If you don't already have one, you can [follow our quickstart guide to create one](create-catalog-portal.md).
* A [service principal](../active-directory/develop/howto-create-service-principal-portal#register-an-application-with-azure-ad-and-create-a-service-principal) with a [client secret](../active-directory/develop/howto-create-service-principal-portal#authentication-two-options).

>[!IMPORTANT]
>Get the following information from your service principal and secret, they'll be needed later:
>   *    Client ID (or Application ID)
>   *    Tenant ID (or Directory ID)
>   *    Client secret

## Give Purview access to the Storage account

Before being able to scan the content of the Storage account, you need to give Azure Purview the right role.

1. Go to your Storage Account via the portal. 
1. Select Access Control (IAM). 
1. Select the Add button and select **Add role assignment**.

    :::image type="content" source="media/tutorial-using-python-sdk/add-role-assignment-storage.png" alt-text="The Access Control menu of the Storage Account with the add button selected and then add role assignment selected."::: 

1. In the next window, search for the **Storage blob Reader** role and select it:

    :::image type="content" source="media/tutorial-using-python-sdk/storage-blob-reader-role.png" alt-text="Add role assignment reader with Storage Blob Data Reader selected from the list of available roles."::: 

1. Then go on the **Members** tab and select **Select members**:

    :::image type="content" source="media/tutorial-using-python-sdk/select-members-blob-reader-role.png" alt-text="Add role assignment menu with the + Select members button selected."::: 

1. A new pane appears on the right. Search and select the name of your existing Azure Purview instance.
1. You can then select **Review + Assign**. 

Azure Purview now has the required reading right to scan your Blob Storage. 


## Grant your application the access to your Azure Purview account

1. First, you'll need the Client ID, Tenant ID, and Client secret from your service principal. To find this information, select your **Azure Active Directory**. From **App registrations** select your application and locate the required information:
   *    Client ID (or Application ID)
   *    Tenant ID (or Directory ID)
          :::image type="content" source="media/tutorial-using-python-sdk/app-registration-info.png" alt-text="Screenshot that shows how to find the info to authenticate to the service principal"::: 
   *    [Client secret](../active-directory/develop/howto-create-service-principal-portal#authentication-two-options)
          :::image type="content" source="media/tutorial-using-python-sdk/get-service-principal-secret.png" alt-text="Service principal, with the Certificates & secrets tab selected, showing the available client certificates and secrets."::: 
    
2. You now need to give the relevant Azure Purview roles to your service principal. To do so, access the Azure Purview instance. Select **Open Purview Studio** or open [Azure Purview's home page](https://web.purview.azure.com/) and choose the instance that you deployed.

    Inside Purview Studio, go to the collections:
    :::image type="content" source="media/tutorial-using-python-sdk/purview-collections.png" alt-text="Screenshot that shows how to access Azure Purview collections"::: 

    Select the collection you want to work with, and go on the **Role assignments** tab. Add the service principal in the following roles: Collection admins, Data source admins, Data curators, Data readers. For to each role, select the **Add** button and add the service principal by searching its name as shown below:  

    :::image type="content" source="media/tutorial-using-python-sdk/add-role-purview.png" alt-text="Screenshot that shows how to access Azure Purview collections"::: 

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
*    A scanning client useful to registering data sources, creating and managing scan rules, triggering a scan, etc. 
*    A catalog client useful to interact with the catalog through searching, browsing the discovered assets, identifying the sensitivity of your data, etc.

First you need to authenticate to your Azure Active Directory. In this tutorial, you'll use the [client secret you created](../active-directory/develop/howto-create-service-principal-portal#option-2-create-a-new-application-secret).


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
 
Many of our operations will follow a similar formula.

## Register a data source

In this section, you'll register your Blob Storage. For the sake of this tutorial, you'll register it in the root collection of Azure Purview.
1.	First you need to define the following information to be able to register the Blob storage programmatically:
    ```python
    storage_name = "<name of your Storage Account>"
    storage_id = "<id of your Storage Account>"
    rg_name = "<name of your resource group>"
    rg_location = "<location of your resource group>"
    reference_name_purview = "<name of your Azure Purview account>"
    ```


1.	For both clients and depending on the operations, you might need to also provide an input body. You'll need to provide an input body for data source registration:
    ```python
    ds_name = "myds"
    
    body_input = {
            "kind": "AzureStorage",
            "properties": {
                "endpoint": "https://{storage_name}.blob.core.windows.net/",
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

    In the above snippet, the name of the collection is the same as the Azure Purview account because we're working with the root collection. This is the highest level collection in your Azure Purview account, and has the same name as your Azure Purview account. Feel free to pass the name of another collection you might have created.

1.	Register the data source.
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

In the following sections, you'll scan the data source you registered, and search the catalog. The code structure will be similar.  

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

In this part of the tutorial, you'll use the default scan rules for Blob Storage containers. However, you can easily create custom scan rules programmatically with the Azure Purview Scanning Client.

Now let's scan the data source you registered above.

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

1.	Now that the scan is defined you can trigger a scan run with a unique ID:
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

Once a scan is complete, it's likely that assets have been discovered and even classified. This process can take some time to complete after a scan. In this section, you use the Azure Purview Catalog client to search the whole catalog.
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

In this section, you'll learn how to delete the data source you registered earlier. This operation is fairly simple, and is done with the scanning client:

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

