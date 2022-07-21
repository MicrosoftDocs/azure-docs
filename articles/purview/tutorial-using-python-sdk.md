---
title: "Tutorial: How to use Microsoft Purview Python SDK"
description: This tutorial describes how to use the Microsoft Purview Python SDK to scan data and search the catalog.
author: raliouat
ms.author: raoufaliouat
ms.service: purview
ms.topic: tutorial
ms.date: 05/27/2022

# Customer intent: I can use the scanning and catalog Python SDKs to perform CRUD operations on data sources and scans, trigger scans and also to search the catalog.
---

# Tutorial: Use the Microsoft Purview Python SDK

This tutorial will introduce you to using the Microsoft Purview Python SDK. You can use the SDK to do all the most common Microsoft Purview operations programmatically, rather than through the Microsoft Purview governance portal.

In this tutorial, you'll learn how us the SDK to:

> [!div class="checklist"]
>*   Grant the required rights to work programmatically with Microsoft Purview
>*   Register a Blob Storage container as a data source in Microsoft Purview
>*   Define and run a scan
>*   Search the catalog
>*   Delete a data source

## Prerequisites

For this tutorial, you'll need:
*   [Python 3.6 or higher](https://www.python.org/downloads/) 
*   An active Azure Subscription. [If you don't have one, you can create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
*   An Azure Active Directory tenant associated with your subscription.
*   An Azure Storage account. If you don't already have one, you can [follow our quickstart guide to create one](../storage/common/storage-account-create.md).
*   A Microsoft Purview account. If you don't already have one, you can [follow our quickstart guide to create one](create-catalog-portal.md).
* A [service principal](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal) with a [client secret](../active-directory/develop/howto-create-service-principal-portal.md#authentication-two-options).

## Give Microsoft Purview access to the Storage account

Before being able to scan the content of the Storage account, you need to give Microsoft Purview the right role.

1. Go to your Storage Account through the [Azure portal](https://portal.azure.com). 
1. Select Access Control (IAM). 
1. Select the Add button and select **Add role assignment**.

    :::image type="content" source="media/tutorial-using-python-sdk/add-role-assignment-storage.png" alt-text="Screenshot of the Access Control menu in the Storage Account with the add button selected and then add role assignment selected."::: 

1. In the next window, search for the **Storage blob Reader** role and select it:

    :::image type="content" source="media/tutorial-using-python-sdk/storage-blob-reader-role.png" alt-text="Screenshot of the add role assignment menu, with Storage Blob Data Reader selected from the list of available roles."::: 

1. Then go on the **Members** tab and select **Select members**:

    :::image type="content" source="media/tutorial-using-python-sdk/select-members-blob-reader-role.png" alt-text="Screenshot of the add role assignment menu with the + Select members button selected."::: 

1. A new pane appears on the right. Search and select the name of your existing Microsoft Purview instance.
1. You can then select **Review + Assign**. 

Microsoft Purview now has the required reading right to scan your Blob Storage. 

## Grant your application the access to your Microsoft Purview account

1. First, you'll need the Client ID, Tenant ID, and Client secret from your service principal. To find this information, select your **Azure Active Directory**.
1. Then, select **App registrations**.
1. Select your application and locate the required information:
    * Name
    * Client ID (or Application ID)
    * Tenant ID (or Directory ID)

        :::image type="content" source="media/tutorial-using-python-sdk/app-registration-info.png" alt-text="Screenshot of the service principal page in the Azure portal with the Client ID and Tenant ID highlighted.":::
    * [Client secret](../active-directory/develop/howto-create-service-principal-portal.md#authentication-two-options)

        :::image type="content" source="media/tutorial-using-python-sdk/get-service-principal-secret.png" alt-text="Screenshot of the service principal page in the Azure portal, with the Certificates & secrets tab selected, showing the available client certificates and secrets.":::

1. You now need to give the relevant Microsoft Purview roles to your service principal. To do so, access your Microsoft Purview instance. Select **Open Microsoft Purview governance portal** or open [the Microsoft Purview's governance portal directly](https://web.purview.azure.com/) and choose the instance that you deployed.

1. Inside the Microsoft Purview governance portal, select **Data map**, then **Collections**:

    :::image type="content" source="media/tutorial-using-python-sdk/purview-collections.png" alt-text="Screenshot of the Microsoft Purview governance portal left menu. The data map tab is selected, then the collections tab is selected.":::

1. Select the collection you want to work with, and go on the **Role assignments** tab. Add the service principal in the following roles:
    * Collection admins
    * Data source admins
    * Data curators
    * Data readers
    
1. For each role, select the **Edit role assignments** button and select the role you want to add the service principal to. Or select the **Add** button next to each role, and add the service principal by searching its name or Client ID as shown below:  

    :::image type="content" source="media/tutorial-using-python-sdk/add-role-purview.png" alt-text="Screenshot of the Role assignments menu under a collection in the Microsoft Purview governance portal. The add user button is select next to the Collection admins tab. The add or remove collection admins pane is shown, with a search for the service principal in the text box."::: 

## Install the Python packages

1.	Open a new command prompt or terminal
1.	Install the Azure identity package for authentication:
    ```bash
    pip install azure-identity
    ```
1.	Install the Microsoft Purview Scanning Client package:
    ```bash
    pip install azure-purview-scanning
    ```
1. Install the Microsoft Purview Administration Client package:
    ```bash
    pip install azure-purview-administration
    ```
1.	Install the Microsoft Purview Client package:
    ```bash
    pip install azure-purview-catalog
    ```
1.	Install the Microsoft Purview Account package:
    ```bash
    pip install azure-purview-account
    ```
1.	Install the Azure Core package:
    ```bash
    pip install azure-core
    ```

## Create Python script file

Create a plain text file, and save it as a python script with the suffix .py.
For example: tutorial.py.

## Instantiate a Scanning, Catalog, and Administration client

In this section, you learn how to instantiate:
* A scanning client useful to registering data sources, creating and managing scan rules, triggering a scan, etc. 
* A catalog client useful to interact with the catalog through searching, browsing the discovered assets, identifying the sensitivity of your data, etc.
* An administration client is useful for interacting with the Microsoft Purview Data Map itself, for operations like listing collections.

First you need to authenticate to your Azure Active Directory. For this, you'll use the [client secret you created](../active-directory/develop/howto-create-service-principal-portal.md#option-2-create-a-new-application-secret).


1.	Start with required import statements: our three clients, the credentials statement, and an Azure exceptions statement.
    ```python
    from azure.purview.scanning import PurviewScanningClient
    from azure.purview.catalog import PurviewCatalogClient
    from azure.purview.administration.account import PurviewAccountClient
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

1.	You also need to specify the name of your Microsoft Purview account:

    ```python
    reference_name_purview = "<name of your Microsoft Purview account>"
    ```
1.	You can now instantiate the three clients:

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

    def get_admin_client():
        credentials = get_credentials()
        client = PurviewAccountClient(endpoint=f"https://{reference_name_purview}.purview.azure.com/", credential=credentials, logging_enable=True)
        return client
    ```
 
Many of our scripts will start with these same steps, as we'll need these clients to interact with the account.

## Register a data source

In this section, you'll register your Blob Storage.

1. Like we discussed in the previous section, first you'll import the clients you'll need to access your Microsoft Purview account. Also import the Azure error response package so you can troubleshoot, and the ClientSecretCredential to construct your Azure credentials.

    ```python
    from azure.purview.administration.account import PurviewAccountClient
    from azure.purview.scanning import PurviewScanningClient
    from azure.core.exceptions import HttpResponseError
    from azure.identity import ClientSecretCredential
    ```

1. Gather the resource ID for your storage account by following this guide: [get the resource ID for a storage account.](../storage/common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account)

1. Then, in your python file, define the following information to be able to register the Blob storage programmatically:

    ```python
    storage_name = "<name of your Storage Account>"
    storage_id = "<id of your Storage Account>"
    rg_name = "<name of your resource group>"
    rg_location = "<location of your resource group>"
    reference_name_purview = "<name of your Microsoft Purview account>"
    ```

1. Provide the name of the collection where you'd like to register your blob storage. (It should be the same collection where you applied permissions earlier. If it isn't, first apply permissions to this collection.) If it's the root collection, use the same name as your Microsoft Purview instance.

    ```python
    collection_name = "<name of your collection>"
    ```

1. Create a function to construct the credentials to access your Microsoft Purview account:

    ```python
    client_id = "<your client id>" 
    client_secret = "<your client secret>"
    tenant_id = "<your tenant id>"


    def get_credentials():
	    credentials = ClientSecretCredential(client_id=client_id, client_secret=client_secret, tenant_id=tenant_id)
	    return credentials
    ```

1. All collections in the Microsoft Purview data map have a **friendly name** and a **name**. 
    * The **friendly name** name is the one you see on the collection. For example: Sales. 
    * The **name** for all collections (except the root collection) is a six-character name assigned by the data map. 
    
    Python needs this six-character name to reference any sub collections. To convert your **friendly name** automatically to the six-character collection name needed in your script, add this block of code:

    ```python
    def get_admin_client():
	    credentials = get_credentials()
	    client = PurviewAccountClient(endpoint=f"https://{reference_name_purview}.purview.azure.com/", credential=credentials, logging_enable=True)
	    return client

    try:
      admin_client = get_admin_client()
    except ValueError as e:
        print(e)

    collection_list = client.collections.list_collections()
     for collection in collection_list:
      if collection["friendlyName"].lower() == collection_name.lower():
          collection_name = collection["name"]
    ```

1. For both clients, and depending on the operations, you also need to provide an input body. To register a source, you'll need to provide an input body for data source registration:

    ```python
    ds_name = "<friendly name for your data source>"
    
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
                    "referenceName": collection_name
                },
                "dataUseGovernance": "Disabled"
            }
    }    
    ```

1. Now you can call your Microsoft Purview clients and register the data source.

    ```python
    def get_purview_client():
	    credentials = get_credentials()
	    client = PurviewScanningClient(endpoint=f"https://{reference_name_purview}.scan.purview.azure.com", credential=credentials, logging_enable=True)  
	    return client

    try:
        client = get_purview_client()
    except ValueError as e:
        print(e)

    try:
        response = client.data_sources.create_or_update(ds_name, body=body_input)
        print(response)
        print(f"Data source {ds_name} successfully created or updated")
    except HttpResponseError as e:
        print(e)
    ```

When the registration process succeeds, you can see an enriched body response from the client.

In the following sections, you'll scan the data source you registered and search the catalog. Each of these scripts will be very similarly structured to this registration script.

### Full code

```python
from azure.purview.scanning import PurviewScanningClient
from azure.identity import ClientSecretCredential 
from azure.core.exceptions import HttpResponseError
from azure.purview.administration.account import PurviewAccountClient

client_id = "<your client id>" 
client_secret = "<your client secret>"
tenant_id = "<your tenant id>"
reference_name_purview = "<name of your Microsoft Purview account>"
storage_name = "<name of your Storage Account>"
storage_id = "<id of your Storage Account>"
rg_name = "<name of your resource group>"
rg_location = "<location of your resource group>"
collection_name = "<name of your collection>"
ds_name = "<friendly data source name>"

def get_credentials():
	credentials = ClientSecretCredential(client_id=client_id, client_secret=client_secret, tenant_id=tenant_id)
	return credentials

def get_purview_client():
	credentials = get_credentials()
	client = PurviewScanningClient(endpoint=f"https://{reference_name_purview}.scan.purview.azure.com", credential=credentials, logging_enable=True)  
	return client

def get_admin_client():
	credentials = get_credentials()
	client = PurviewAccountClient(endpoint=f"https://{reference_name_purview}.purview.azure.com/", credential=credentials, logging_enable=True)
	return client

try:
	admin_client = get_admin_client()
except ValueError as e:
        print(e)

collection_list = admin_client.collections.list_collections()
for collection in collection_list:
	if collection["friendlyName"].lower() == collection_name.lower():
		collection_name = collection["name"]


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
			"referenceName": collection_name
		},
		"dataUseGovernance": "Disabled"
	}
}

try:
	client = get_purview_client()
except ValueError as e:
        print(e)

try:
	response = client.data_sources.create_or_update(ds_name, body=body_input)
	print(response)
	print(f"Data source {ds_name} successfully created or updated")
except HttpResponseError as e:
    print(e)
```

## Scan the data source

Scanning a data source can be done in two steps:

1. Create a scan definition
1. Trigger a scan run

In this tutorial, you'll use the default scan rules for Blob Storage containers. However, you can also [create custom scan rules programmatically with the Microsoft Purview Scanning Client](/python/api/azure-purview-scanning/azure.purview.scanning.operations.scanrulesetsoperations).

Now let's scan the data source you registered above.

1. Add an import statement to generate [unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier), call the Microsoft Purview scanning client, the Microsoft Purview administration client, the Azure error response package to be able to troubleshoot, and the client secret credential to gather your Azure credentials.

    ```python
    import uuid
    from azure.purview.scanning import PurviewScanningClient
    from azure.purview.administration.account import PurviewAccountClient
    from azure.core.exceptions import HttpResponseError
    from azure.identity import ClientSecretCredential 
    ```

1. Create a scanning client using your credentials:

    ```python
    client_id = "<your client id>" 
    client_secret = "<your client secret>"
    tenant_id = "<your tenant id>"

    def get_credentials():
	    credentials = ClientSecretCredential(client_id=client_id, client_secret=client_secret, tenant_id=tenant_id)
	    return credentials

    def get_purview_client():
	    credentials = get_credentials()
	    client = PurviewScanningClient(endpoint=f"https://{reference_name_purview}.scan.purview.azure.com", credential=credentials, logging_enable=True)  
	    return client

    try:
	    client = get_purview_client()
    except ValueError as e:
	    print(e)
    ```

1. Add the code to gather the internal name of your collection. (For more information, see the previous section):

    ```python
    collection_name = "<name of the collection where you will be creating the scan>"

    def get_admin_client():
	    credentials = get_credentials()
	    client = PurviewAccountClient(endpoint=f"https://{reference_name_purview}.purview.azure.com/", credential=credentials, logging_enable=True)
	    return client

    try:
        admin_client = get_admin_client()
    except ValueError as e:
        print(e)

    collection_list = client.collections.list_collections()
     for collection in collection_list:
      if collection["friendlyName"].lower() == collection_name.lower():
          collection_name = collection["name"]
    ```

1. Then, create a scan definition:

    ```python
    ds_name = "<name of your registered data source>"
    scan_name = "<name of the scan you want to define>"
    reference_name_purview = "<name of your Microsoft Purview account>"

    body_input = {
            "kind":"AzureStorageMsi",
            "properties": { 
                "scanRulesetName": "AzureStorage", 
                "scanRulesetType": "System", #We use the default scan rule set 
                "collection": 
                    {
                        "referenceName": collection_name,
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

### Full code

```python
import uuid
from azure.purview.scanning import PurviewScanningClient
from azure.purview.administration.account import PurviewAccountClient
from azure.identity import ClientSecretCredential

ds_name = "<name of your registered data source>"
scan_name = "<name of the scan you want to define>"
reference_name_purview = "<name of your Microsoft Purview account>"
client_id = "<your client id>" 
client_secret = "<your client secret>"
tenant_id = "<your tenant id>"
collection_name = "<name of the collection where you will be creating the scan>"

def get_credentials():
	credentials = ClientSecretCredential(client_id=client_id, client_secret=client_secret, tenant_id=tenant_id)
	return credentials

def get_purview_client():
	credentials = get_credentials()
	client = PurviewScanningClient(endpoint=f"https://{reference_name_purview}.scan.purview.azure.com", credential=credentials, logging_enable=True)  
	return client

def get_admin_client():
	credentials = get_credentials()
	client = PurviewAccountClient(endpoint=f"https://{reference_name_purview}.purview.azure.com/", credential=credentials, logging_enable=True)
	return client

try:
	admin_client = get_admin_client()
except ValueError as e:
        print(e)

collection_list = admin_client.collections.list_collections()
for collection in collection_list:
	if collection["friendlyName"].lower() == collection_name.lower():
		collection_name = collection["name"]


try:
	client = get_purview_client()
except AzureError as e:
	print(e)

body_input = {
	"kind":"AzureStorageMsi",
	"properties": { 
		"scanRulesetName": "AzureStorage", 
		"scanRulesetType": "System",
		"collection": {
			"type": "CollectionReference",
			"referenceName": collection_name
		}
	}
}

try:
	response = client.scans.create_or_update(data_source_name=ds_name, scan_name=scan_name, body=body_input)
	print(response)
	print(f"Scan {scan_name} successfully created or updated")
except HttpResponseError as e:
	print(e)

run_id = uuid.uuid4() #unique id of the new scan

try:
	response = client.scan_result.run_scan(data_source_name=ds_name, scan_name=scan_name, run_id=run_id)
	print(response)
	print(f"Scan {scan_name} successfully started")
except HttpResponseError as e:
	print(e)
```

## Search catalog

Once a scan is complete, it's likely that assets have been discovered and even classified. This process can take some time to complete after a scan, so you may need to wait before running this next portion of code. Wait for your scan to show **completed**, and the assets to appear in the Microsoft Purview Data Catalog. 

Once the assets are ready, you can use the Microsoft Purview Catalog client to search the whole catalog.

1. This time you need to import the **catalog** client instead of the scanning one. Also include the HTTPResponse error and ClientSecretCredential.

    ```python
    from azure.purview.catalog import PurviewCatalogClient
    from azure.identity import ClientSecretCredential 
    from azure.core.exceptions import HttpResponseError
    ```

1. Create a function to get the credentials to access your Microsoft Purview account, and instantiate the catalog client.

    ```python
    client_id = "<your client id>" 
    client_secret = "<your client secret>"
    tenant_id = "<your tenant id>"
    reference_name_purview = "<name of your Microsoft Purview account>"

    def get_credentials():
	    credentials = ClientSecretCredential(client_id=client_id, client_secret=client_secret, tenant_id=tenant_id)
	    return credentials

    def get_catalog_client():
        credentials = get_credentials()
        client = PurviewCatalogClient(endpoint=f"https://{reference_name_purview}.purview.azure.com/", credential=credentials, logging_enable=True)
        return client

    try:
        client_catalog = get_catalog_client()
    except ValueError as e:
        print(e)  
    ```

1.	Configure your search criteria and keywords in the input body:

    ```python
    keywords = "keywords you want to search"

    body_input={
        "keywords": keywords
    }
    ```

    Here you only specify keywords, but keep in mind [you can add many other fields to further specify your query](/python/api/azure-purview-catalog/azure.purview.catalog.operations.discoveryoperations#azure-purview-catalog-operations-discoveryoperations-query).
		
1.	Search the catalog:

    ```python
    try:
        response = client_catalog.discovery.query(search_request=body_input)
        print(response)
    except HttpResponseError as e:
        print(e)
    ```

### Full code

```python
from azure.purview.catalog import PurviewCatalogClient
from azure.identity import ClientSecretCredential 
from azure.core.exceptions import HttpResponseError

client_id = "<your client id>" 
client_secret = "<your client secret>"
tenant_id = "<your tenant id>"
reference_name_purview = "<name of your Microsoft Purview account>"
keywords = "<keywords you want to search for>"

def get_credentials():
	credentials = ClientSecretCredential(client_id=client_id, client_secret=client_secret, tenant_id=tenant_id)
	return credentials

def get_catalog_client():
	credentials = get_credentials()
	client = PurviewCatalogClient(endpoint=f"https://{reference_name_purview}.purview.azure.com/", credential=credentials, logging_enable=True)
	return client

body_input={
	"keywords": keywords
}

try:
	catalog_client = get_catalog_client()
except ValueError as e:
	print(e)

try:
	response = catalog_client.discovery.query(search_request=body_input)
	print(response)
except HttpResponseError as e:
	print(e)
```

## Delete a data source

In this section, you'll learn how to delete the data source you registered earlier. This operation is fairly simple, and is done with the scanning client.

1. Import the **scanning** client. Also include the HTTPResponse error and ClientSecretCredential.

    ```python
    from azure.purview.scanning import PurviewScanningClient
    from azure.identity import ClientSecretCredential 
    from azure.core.exceptions import HttpResponseError
    ```

1. Create a function to get the credentials to access your Microsoft Purview account, and instantiate the scanning client.

    ```python
    client_id = "<your client id>" 
    client_secret = "<your client secret>"
    tenant_id = "<your tenant id>"
    reference_name_purview = "<name of your Microsoft Purview account>"

    def get_credentials():
	    credentials = ClientSecretCredential(client_id=client_id, client_secret=client_secret, tenant_id=tenant_id)
	    return credentials

    def get_scanning_client():
        credentials = get_credentials()
        PurviewScanningClient(endpoint=f"https://{reference_name_purview}.scan.purview.azure.com", credential=credentials, logging_enable=True) 
        return client

    try:
        client_scanning = get_scanning_client()
    except ValueError as e:
        print(e)  
    ```

1. Delete the data source:

    ```python
        ds_name = "<name of the registered data source you want to delete>"
        try:
            response = client_scanning.data_sources.delete(ds_name)
            print(response)
            print(f"Data source {ds_name} successfully deleted")
        except HttpResponseError as e:
            print(e)
    ```

### Full code

```python
from azure.purview.scanning import PurviewScanningClient
from azure.identity import ClientSecretCredential 
from azure.core.exceptions import HttpResponseError


client_id = "<your client id>" 
client_secret = "<your client secret>"
tenant_id = "<your tenant id>"
reference_name_purview = "<name of your Microsoft Purview account>"
ds_name = "<name of the registered data source you want to delete>"

def get_credentials():
	credentials = ClientSecretCredential(client_id=client_id, client_secret=client_secret, tenant_id=tenant_id)
	return credentials

def get_scanning_client():
	credentials = get_credentials()
	client = PurviewScanningClient(endpoint=f"https://{reference_name_purview}.scan.purview.azure.com", credential=credentials, logging_enable=True) 
	return client

try:
	client_scanning = get_scanning_client()
except ValueError as e:
	print(e)  

try:
	response = client_scanning.data_sources.delete(ds_name)
	print(response)
	print(f"Data source {ds_name} successfully deleted")
except HttpResponseError as e:
	print(e)
```

## Next steps

> [!div class="nextstepaction"]
> [Learn more about the Python Microsoft Purview Scanning Client](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-purview-scanning/1.0.0b2/index.html)
> [Learn more about the Python Microsoft Purview Catalog Client](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-purview-catalog/1.0.0b2/index.html)

