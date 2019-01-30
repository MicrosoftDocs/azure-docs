---
title: 'Python: Account management operations on Azure Data Lake Storage Gen1 | Microsoft Docs'
description: Learn how to use Python SDK to work with Azure Data Lake Storage Gen1 account management operations.
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.assetid: 75f6de6f-6fd8-48f4-8707-cb27d22d27a6
ms.service: data-lake-store
ms.devlang: na
ms.topic: conceptual
ms.date: 05/29/2018
ms.author: nitinme

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

* **An Azure resource group**. For instructions, see [Create an Azure resource group](../azure-resource-manager/resource-group-portal.md).

## Install the modules

To work with Data Lake Storage Gen1 using Python, you need to install three modules.

* The `azure-mgmt-resource` module, which includes Azure modules for Active Directory, etc.
* The `azure-mgmt-datalake-store` module, which includes the Azure Data Lake Storage Gen1 account management operations. For more information on this module, see [Azure Data Lake Storage Gen1 Management module reference](https://docs.microsoft.com/python/api/azure.mgmt.datalake.store?view=azure-python).
* The `azure-datalake-store` module, which includes the Azure Data Lake Storage Gen1 filesystem operations. For more information on this module, see [azure-datalake-store filesystem module reference](http://azure-datalake-store.readthedocs.io/en/latest/).

Use the following commands to install the modules.

```
pip install azure-mgmt-resource
pip install azure-mgmt-datalake-store
pip install azure-datalake-store
```

## Create a new Python application

1. In the IDE of your choice create a new Python application, for example, **mysample.py**.

2. Add the following snippet to import the required modules

	```
	## Use this only for Azure AD service-to-service authentication
	from azure.common.credentials import ServicePrincipalCredentials

	## Use this only for Azure AD end-user authentication
	from azure.common.credentials import UserPassCredentials

	## Use this only for Azure AD multi-factor authentication
	from msrestazure.azure_active_directory import AADTokenCredentials

	## Required for Data Lake Storage Gen1 account management
	from azure.mgmt.datalake.store import DataLakeStoreAccountManagementClient
	from azure.mgmt.datalake.store.models import DataLakeStoreAccount

	## Required for Data Lake Storage Gen1 filesystem management
	from azure.datalake.store import core, lib, multithread

	# Common Azure imports
	from azure.mgmt.resource.resources import ResourceManagementClient
	from azure.mgmt.resource.resources.models import ResourceGroup

	## Use these as needed for your application
	import logging, getpass, pprint, uuid, time
	```

3. Save changes to mysample.py.

## Authentication

In this section, we talk about the different ways to authenticate with Azure AD. The options available are:

* For end-user authentication for your application, see [End-user authentication with Data Lake Storage Gen1 using Python](data-lake-store-end-user-authenticate-python.md).
* For service-to-service authentication for your application, see [Service-to-service authentication with Data Lake Storage Gen1 using Python](data-lake-store-service-to-service-authenticate-python.md).

## Create client and Data Lake Storage Gen1 account

The following snippet first creates the Data Lake Storage Gen1 account client. It uses the client object to create a Data Lake Storage Gen1 account. Finally, the snippet creates a filesystem client object.

    ## Declare variables
    subscriptionId = 'FILL-IN-HERE'
	adlsAccountName = 'FILL-IN-HERE'
    resourceGroup = 'FILL-IN-HERE'
    location = 'eastus2'

	## Create Data Lake Storage Gen1 account management client object
	adlsAcctClient = DataLakeStoreAccountManagementClient(armCreds, subscriptionId)

	## Create a Data Lake Storage Gen1 account
	adlsAcctResult = adlsAcctClient.account.create(
		resourceGroup,
		adlsAccountName,
		DataLakeStoreAccount(
			location=location
		)
	).wait()

	
## List the Data Lake Storage Gen1 accounts

	## List the existing Data Lake Storage Gen1 accounts
	result_list_response = adlsAcctClient.account.list()
	result_list = list(result_list_response)
	for items in result_list:
    	print(items)

## Delete the Data Lake Storage Gen1 account

	## Delete an existing Data Lake Storage Gen1 account
	adlsAcctClient.account.delete(adlsAccountName)
	

## Next steps
* [Filesystem operations on Data Lake Storage Gen1 using Python](data-lake-store-data-operations-python.md).

## See also

* [azure-datalake-store Python (Filesystem) reference](http://azure-datalake-store.readthedocs.io/en/latest)
* [Open Source Big Data applications compatible with Azure Data Lake Storage Gen1](data-lake-store-compatible-oss-other-applications.md)
