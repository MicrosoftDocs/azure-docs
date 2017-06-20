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
ms.date: 04/03/2017
ms.author: nitinme

---

# Get started with Azure Data Lake Store using Python

> [!div class="op_single_selector"]
> * [Portal](data-lake-store-get-started-portal.md)
> * [PowerShell](data-lake-store-get-started-powershell.md)
> * [.NET SDK](data-lake-store-get-started-net-sdk.md)
> * [Java SDK](data-lake-store-get-started-java-sdk.md)
> * [REST API](data-lake-store-get-started-rest-api.md)
> * [Azure CLI](data-lake-store-get-started-cli.md)
> * [Azure CLI 2.0](data-lake-store-get-started-cli-2.0.md)
> * [Node.js](data-lake-store-manage-use-nodejs.md)
> * [Python](data-lake-store-get-started-python.md)
>
>

Learn how to use the Python SDK for Azure and Azure Data Lake Store to perform basic operations such as create folders, upload and download data files, etc. For more information about Data Lake, see [Azure Data Lake Store](data-lake-store-overview.md).

## Prerequisites

* **Python**. You can download Python from [here](https://www.python.org/downloads/). This article uses Python 3.5.2.

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Create an Azure Active Directory Application**. You use the Azure AD application to authenticate the Data Lake Store application with Azure AD. There are different approaches to authenticate with Azure AD, which are **end-user authentication** or **service-to-service authentication**. For instructions and more information on how to authenticate, see [Authenticate with Data Lake Store using Azure Active Directory](data-lake-store-authenticate-using-active-directory.md).

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

### End-user authentication for account management

Use this to authenticate with Azure AD for account management operations (create/delete Data Lake Store account, etc.). You must provide username and password for an Azure AD user. Note that the user should not be configured for multi-factor authentication.

    user = input('Enter the user to authenticate with that has permission to subscription: ')
	password = getpass.getpass()

	credentials = UserPassCredentials(user, password)

### End-user authentication for filesystem operations

Use this to authenticate with Azure AD for filesystem operations (create folder, upload file, etc.). Use this with an existing Azure AD **native client** application. The Azure AD user you provide credentials for should not be configured for multi-factor authentication.

	tenant_id = 'FILL-IN-HERE'
	client_id = 'FILL-IN-HERE'
	user = input('Enter the user to authenticate with that has permission to subscription: ')
	password = getpass.getpass()

	token = lib.auth(tenant_id, user, password, client_id)

### Service-to-service authentication with client secret for account management

Use this to authenticate with Azure AD for account management operations (create/delete Data Lake Store account, etc.). The following snippet can be used to authenticate your application non-interactively, using the client secret for an application / service principal. Use this with an existing Azure AD "Web App" application.

    credentials = ServicePrincipalCredentials(client_id = 'FILL-IN-HERE', secret = 'FILL-IN-HERE', tenant = 'FILL-IN-HERE')

### Service-to-service authentication with client secret for filesystem operations

Use this to authenticate with Azure AD for filesystem operations (create folder, upload file, etc.). The following snippet can be used to authenticate your application non-interactively, using the client secret for an application / service principal. Use this with an existing Azure AD "Web App" application.

    token = lib.auth(tenant_id = 'FILL-IN-HERE', client_secret = 'FILL-IN-HERE', client_id = 'FILL-IN-HERE')

### Multi-factor authentication for account management

Use this to authenticate with Azure AD for account management operations (create/delete Data Lake Store account, etc.). The following snippet can be used to authenticate your application using multi-factor authentication. Use this with an existing Azure AD "Web App" application.

	authority_host_url = "https://login.microsoftonline.com"
	tenant = "FILL-IN-HERE"
	authority_url = authority_host_url + '/' + tenant
	client_id = 'FILL-IN-HERE'
	redirect = 'urn:ietf:wg:oauth:2.0:oob'
	RESOURCE = 'https://management.core.windows.net/'
	
	context = adal.AuthenticationContext(authority_url)
	code = context.acquire_user_code(RESOURCE, client_id)
	print(code['message'])
	mgmt_token = context.acquire_token_with_device_code(RESOURCE, code, client_id)
	credentials = AADTokenCredentials(mgmt_token, client_id)

### Multi-factor authentication for filesystem management

Use this to authenticate with Azure AD for filesystem operations (create folder, upload file, etc.). The following snippet can be used to authenticate your application using multi-factor authentication. Use this with an existing Azure AD "Web App" application.

	token = lib.auth(tenant_id='FILL-IN-HERE')

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
