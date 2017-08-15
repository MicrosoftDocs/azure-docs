---
title: Use the Python SDK to get started with Azure Data Lake Store | Microsoft Docs
description: Learn how to use Python SDK to work with Data Lake Store accounts and the file system.
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.assetid: 75f6de6f-6fd8-48f4-8707-cb27d22d27a6
ms.service: data-lake-store
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 06/29/2017
ms.author: nitinme

---

# Get started with Azure Data Lake Store using Python

> [!div class="op_single_selector"]
> * [Portal](data-lake-store-get-started-portal.md)
> * [PowerShell](data-lake-store-get-started-powershell.md)
> * [.NET SDK](data-lake-store-get-started-net-sdk.md)
> * [Java SDK](data-lake-store-get-started-java-sdk.md)
> * [REST API](data-lake-store-get-started-rest-api.md)
> * [Azure CLI 2.0](data-lake-store-get-started-cli-2.0.md)
> * [Node.js](data-lake-store-manage-use-nodejs.md)
> * [Python](data-lake-store-get-started-python.md)
>
>

Learn how to use the Python SDK for Azure and Azure Data Lake Store to perform basic operations such as create folders, upload and download data files, etc. For more information about Data Lake, see [Azure Data Lake Store](data-lake-store-overview.md).

## Prerequisites

* **Python**. You can download Python from [here](https://www.python.org/downloads/). This article uses Python 3.5.2.

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Create an Azure Active Directory Application**. You use the Azure AD application to authenticate the Data Lake Store application with Azure AD. There are different approaches to authenticate with Azure AD, which are **end-user authentication** or **service-to-service authentication**. For instructions and more information on how to authenticate, see [End-user authentication](data-lake-store-end-user-authenticate-using-active-directory.md) or [Service-to-service authentication](data-lake-store-authenticate-using-active-directory.md).

## Install the modules

To work with Data Lake Store using Python, you need to install three modules.

* The `azure-mgmt-resource` module. This includes Azure modules for Active Directory, etc..
* The `azure-mgmt-datalake-store` module. This includes the Azure Data Lake Store account management operations. For more information on this module, see [Azure Data Lake Store Management module reference](http://azure-sdk-for-python.readthedocs.io/en/latest/sample_azure-mgmt-datalake-store.html).
* The `azure-datalake-store` module. This includes the Azure Data Lake Store filesystem operations. For more information on this module, see [Azure Data Lake Store Filesystem module reference](http://azure-datalake-store.readthedocs.io/en/latest/).

Use the following commands to install the modules.

```
pip install azure-mgmt-resource
pip install azure-mgmt-datalake-store
pip install azure-datalake-store
```

## Create a new Python application

1. In the IDE of your choice create a new Python application, for example, **mysample.py**.

2. Add the following lines to import the required modules

	```
	## Use this only for Azure AD service-to-service authentication
	from azure.common.credentials import ServicePrincipalCredentials

	## Use this only for Azure AD end-user authentication
	from azure.common.credentials import UserPassCredentials

	## Use this only for Azure AD multi-factor authentication
	from msrestazure.azure_active_directory import AADTokenCredentials

	## Required for Azure Data Lake Store account management
	from azure.mgmt.datalake.store import DataLakeStoreAccountManagementClient
	from azure.mgmt.datalake.store.models import DataLakeStoreAccount

	## Required for Azure Data Lake Store filesystem management
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

* End-user authentication
* Service-to-service authentication
* Multi-factor authentication

You must use these authentication options for both account management and filesystem management modules.

### End user authentication

### Service-to-service authentication

### Multi-factor authentication

## Create an Azure Resource Group

Use the following code snippet to create an Azure Resource Group:

	## Declare variables
	subscriptionId= 'FILL-IN-HERE'
	resourceGroup = 'FILL-IN-HERE'
	location = 'eastus2'
	
	## Create management client object
	resourceClient = ResourceManagementClient(
	    credentials,
	    subscriptionId
	)
	
	## Create an Azure Resource Group
	resourceClient.resource_groups.create_or_update(
	    resourceGroup,
	    ResourceGroup(
	        location=location
	    )
	)

## Create clients and Data Lake Store account

The following snippet first creates the Data Lake Store account client. It uses the client object to create a Data Lake Store account. Finally, the snippet creates a filesystem client object.

    ## Declare variables
    subscriptionId = 'FILL-IN-HERE'
	adlsAccountName = 'FILL-IN-HERE'

	## Create management client object
	adlsAcctClient = DataLakeStoreAccountManagementClient(credentials, subscriptionId)

	## Create a Data Lake Store account
	adlsAcctResult = adlsAcctClient.account.create(
		resourceGroup,
		adlsAccountName,
		DataLakeStoreAccount(
			location=location
		)
	).wait()

	## Create a filesystem client object
    adlsFileSystemClient = core.AzureDLFileSystem(token, store_name=adlsAccountName)

## List the Data Lake Store accounts

	## List the existing Data Lake Store accounts
	result_list_response = adlsAcctClient.account.list()
	result_list = list(result_list_response)
	for items in result_list:
    	print(items)

## Create a directory

	## Create a directory
    adlsFileSystemClient.mkdir('/mysampledirectory')

## Upload a file


    ## Upload a file
    multithread.ADLUploader(adlsFileSystemClient, lpath='C:\\data\\mysamplefile.txt', rpath='/mysampledirectory/mysamplefile.txt', nthreads=64, overwrite=True, buffersize=4194304, blocksize=4194304)


## Download a file

    ## Download a file
    multithread.ADLDownloader(adlsFileSystemClient, lpath='C:\\data\\mysamplefile.txt.out', rpath='/mysampledirectory/mysamplefile.txt', nthreads=64, overwrite=True, buffersize=4194304, blocksize=4194304)

## Delete a directory

	## Delete a directory
	adlsFileSystemClient.rm('/mysampledirectory', recursive=True)

## See also

- [Secure data in Data Lake Store](data-lake-store-secure-data.md)
- [Use Azure Data Lake Analytics with Data Lake Store](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
- [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)
- [Data Lake Store .NET SDK Reference](https://msdn.microsoft.com/library/mt581387.aspx)
- [Data Lake Store REST Reference](https://msdn.microsoft.com/library/mt693424.aspx)
