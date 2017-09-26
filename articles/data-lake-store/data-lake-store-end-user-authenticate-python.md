---
title: 'End-user authentication: Python with Data Lake Store using Azure Active Directory | Microsoft Docs'
description: Learn how to achieve end-user authentication with Data Lake Store using Azure Active Directory with Python
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 09/30/2017
ms.author: nitinme

---
# End-user authentication with Data Lake Store using Python
> [!div class="op_single_selector"]
> * [Using .NET SDK](data-lake-store-end-user-authenticate-net-sdk.md)
> * [Using Python](data-lake-store-end-user-authenticate-python.md)
> * [Using REST API](data-lake-store-end-user-authenticate-rest-api.md)
> 
> 

In this article, you learn about how to use the Python SDK to do end-user authentication with Azure Data Lake Store. End-user authentication can further be split into two categories:

* End-user authentication without multi-factor authentication
* End-user authentication with multi-factor authentication

Both these options are discussed in this article. For service-to-service authentication with Data Lake Store using Python, see [Service-to-service authentication with Data Lake Store using Python](data-lake-store-service-to-service-authenticate-python.md).

## Prerequisites

* **Python**. You can download Python from [here](https://www.python.org/downloads/). This article uses Python 3.5.2.

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Create an Azure Active Directory "Native" Application**. You must have completed the steps in [End-user authentication with Data Lake Store using Azure Active Directory](data-lake-store-end-user-authenticate-using-active-directory.md).

## Install the modules

To work with Data Lake Store using Python, you need to install three modules.

* The `azure-mgmt-resource` module, which includes Azure modules for Active Directory, etc.
* The `azure-mgmt-datalake-store` module, which includes the Azure Data Lake Store account management operations. For more information on this module, see [Azure Data Lake Store Management module reference](http://azure-sdk-for-python.readthedocs.io/en/latest/sample_azure-mgmt-datalake-store.html).
* The `azure-datalake-store` module, which includes the Azure Data Lake Store filesystem operations. For more information on this module, see [Azure Data Lake Store Filesystem module reference](http://azure-datalake-store.readthedocs.io/en/latest/).

Use the following commands to install the modules.

```
pip install azure-mgmt-resource
pip install azure-mgmt-datalake-store
pip install azure-datalake-store
```

## Create a new Python application

1. In the IDE of your choice, create a new Python application, for example, **mysample.py**.

2. Add the following snippet to import the required modules

	```
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

## End-user authentication without multi-factor authentication

### For account management

Use the following snippet to authenticate with Azure AD for account management operations on Data Lake Store. Account management operations include creating Data Lake Store account, deleting Data Lake Store account, etc. You must provide username and password for an Azure AD user. Note that the user should not be configured for multi-factor authentication.

    user = input('Enter the user to authenticate with that has permission to subscription: ')
	password = getpass.getpass()

	credentials = UserPassCredentials(user, password)

### For filesystem operations

Use the following snippet to authenticate with Azure AD for filesystem operations on Data Lake Store. Filesystem operations include creating a folder, uploading file, etc. Provide the values below for  an existing Azure AD **native** application. The Azure AD user you provide credentials for should not be configured for multi-factor authentication.

	tenant_id = 'FILL-IN-HERE'
	client_id = 'FILL-IN-HERE'
	user = input('Enter the user to authenticate with that has permission to subscription: ')
	password = getpass.getpass()

	token = lib.auth(tenant_id, user, password, client_id)

## End-user authentication with multi-factor authentication

### For account management

Use the following snippet to authenticate with Azure AD for account management operations on a Data Lake Store account. The following snippet can be used to authenticate your application using multi-factor authentication. Provide the values below for  an existing Azure AD **native** application.

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

### For filesystem operations

Use this to authenticate with Azure AD for filesystem operations on a Data Lake Store account. The following snippet can be used to authenticate your application using multi-factor authentication. Provide the values below for  an existing Azure AD **native** application.

	token = lib.auth(tenant_id='FILL-IN-HERE') 
   
## Next steps
In this article, you learned how to use end-user authentication to authenticate with Azure Data Lake Store using Python. You can now look at the following articles that talk about how to use Python to work with Azure Data Lake Store.

* [Account management operations on Data Lake Store using Python](data-lake-store-get-started-python.md)
* [Data operations on Data Lake Store using Python](data-lake-store-data-operations-python.md)

