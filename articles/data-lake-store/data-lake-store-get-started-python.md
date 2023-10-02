---
title: Manage an Azure Data Lake Storage Gen1 account with Python
description: Learn how to use the Python SDK for Azure Data Lake Storage Gen1 account management operations.

author: normesta
ms.service: data-lake-store
ms.topic: how-to
ms.date: 05/29/2018
ms.author: normesta
ms.custom: devx-track-python

---

# Account management operations on Azure Data Lake Storage Gen1 using Python
> [!div class="op_single_selector"]
> * [.NET SDK](data-lake-store-get-started-net-sdk.md)
> * [REST API](data-lake-store-get-started-rest-api.md)
> * [Python](data-lake-store-get-started-python.md)
>
>

Learn how to use the Python SDK for Azure Data Lake Storage Gen1 to perform basic account management operations such as create a Data Lake Storage Gen1 account, list the Data Lake Storage Gen1 accounts, etc. For instructions on how to perform filesystem operations on Data Lake Storage Gen1 using Python, see [Filesystem operations on Data Lake Storage Gen1 using Python](data-lake-store-data-operations-python.md).

## Prerequisites

* **Python**. You can download Python from [here](https://www.python.org/downloads/). This article uses Python 3.6.2.

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **An Azure resource group**. For instructions, see [Create an Azure resource group](../azure-resource-manager/management/manage-resource-groups-portal.md).

## Install the modules

To work with Data Lake Storage Gen1 using Python, you need to install three modules.

* The `azure-mgmt-resource` module, which includes Azure modules for Active Directory, etc.
* The `azure-mgmt-datalake-store` module, which includes the Azure Data Lake Storage Gen1 account management operations. For more information on this module, see [Azure Data Lake Storage Gen1 Management module reference](/python/api/azure-mgmt-datalake-store/).
* The `azure-datalake-store` module, which includes the Azure Data Lake Storage Gen1 filesystem operations. For more information on this module, see [azure-datalake-store filesystem module reference](/python/api/azure-datalake-store/azure.datalake.store.core/).

Use the following commands to install the modules.

```console
pip install azure-identity
pip install azure-mgmt-resource
pip install azure-mgmt-datalake-store
pip install azure-datalake-store
```

## Create a new Python application

1. In the IDE of your choice create a new Python application, for example, **mysample.py**.

2. Add the following snippet to import the required modules:

    ```python
    # Acquire a credential object for the app identity. When running in the cloud,
    # DefaultAzureCredential uses the app's managed identity (MSI) or user-assigned service principal.
    # When run locally, DefaultAzureCredential relies on environment variables named
    # AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, and AZURE_TENANT_ID.
    from azure.identity import DefaultAzureCredential

    ## Required for Data Lake Storage Gen1 account management
    from azure.mgmt.datalake.store import DataLakeStoreAccountManagementClient
    from azure.mgmt.datalake.store.models import CreateDataLakeStoreAccountParameters

    ## Required for Data Lake Storage Gen1 filesystem management
    from azure.datalake.store import core, lib, multithread

    # Common Azure imports
    import adal
    from azure.mgmt.resource.resources import ResourceManagementClient
    from azure.mgmt.resource.resources.models import ResourceGroup

    # Use these as needed for your application
    import logging, getpass, pprint, uuid, time
    ```

3. Save changes to mysample.py.

## Authentication

In this section, we talk about the different ways to authenticate with Azure AD. The options available are:

* For end-user authentication for your application, see [End-user authentication with Data Lake Storage Gen1 using Python](data-lake-store-end-user-authenticate-python.md).
* For service-to-service authentication for your application, see [Service-to-service authentication with Data Lake Storage Gen1 using Python](data-lake-store-service-to-service-authenticate-python.md).

## Create client and Data Lake Storage Gen1 account

The following snippet first creates the Data Lake Storage Gen1 account client. It uses the client object to create a Data Lake Storage Gen1 account. Finally, the snippet creates a filesystem client object.

```python
## Declare variables
subscriptionId = 'FILL-IN-HERE'
adlsAccountName = 'FILL-IN-HERE'
resourceGroup = 'FILL-IN-HERE'
location = 'eastus2'
credential = DefaultAzureCredential()

## Create Data Lake Storage Gen1 account management client object
adlsAcctClient = DataLakeStoreAccountManagementClient(credential, subscription_id=subscriptionId)

## Create a Data Lake Storage Gen1 account
adlsAcctResult = adlsAcctClient.accounts.begin_create(
    resourceGroup,
    adlsAccountName,
    CreateDataLakeStoreAccountParameters(
        location=location
    )
)
```

    
## List the Data Lake Storage Gen1 accounts

```python
## List the existing Data Lake Storage Gen1 accounts
result_list_response = adlsAcctClient.accounts.list()
result_list = list(result_list_response)
for items in result_list:
    print(items)
```

## Delete the Data Lake Storage Gen1 account

```python
## Delete an existing Data Lake Storage Gen1 account
adlsAcctClient.accounts.begin_delete(resourceGroup, adlsAccountName)
```
    

## Next steps
* [Filesystem operations on Data Lake Storage Gen1 using Python](data-lake-store-data-operations-python.md).

## See also

* [azure-datalake-store Python (Filesystem) reference](/python/api/azure-datalake-store/azure.datalake.store.core)
* [Open Source Big Data applications compatible with Azure Data Lake Storage Gen1](data-lake-store-compatible-oss-other-applications.md)
