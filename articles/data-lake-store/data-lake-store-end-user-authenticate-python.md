---
title: 'End-user authentication: Python with Azure Data Lake Storage Gen1 using Azure Active Directory | Microsoft Docs'
description: Learn how to achieve end-user authentication with Azure Data Lake Storage Gen1 using Azure Active Directory with Python
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.service: data-lake-store
ms.devlang: na
ms.topic: conceptual
ms.date: 05/29/2018
ms.author: nitinme

---
# End-user authentication with Azure Data Lake Storage Gen1 using Python
> [!div class="op_single_selector"]
> * [Using Java](data-lake-store-end-user-authenticate-java-sdk.md)
> * [Using .NET SDK](data-lake-store-end-user-authenticate-net-sdk.md)
> * [Using Python](data-lake-store-end-user-authenticate-python.md)
> * [Using REST API](data-lake-store-end-user-authenticate-rest-api.md)
> 
> 

In this article, you learn about how to use the Python SDK to do end-user authentication with Azure Data Lake Storage Gen1. End-user authentication can further be split into two categories:

* End-user authentication without multi-factor authentication
* End-user authentication with multi-factor authentication

Both these options are discussed in this article. For service-to-service authentication with Data Lake Storage Gen1 using Python, see [Service-to-service authentication with Data Lake Storage Gen1 using Python](data-lake-store-service-to-service-authenticate-python.md).

## Prerequisites

* **Python**. You can download Python from [here](https://www.python.org/downloads/). This article uses Python 3.6.2.

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Create an Azure Active Directory "Native" Application**. You must have completed the steps in [End-user authentication with Data Lake Storage Gen1 using Azure Active Directory](data-lake-store-end-user-authenticate-using-active-directory.md).

## Install the modules

To work with Data Lake Storage Gen1 using Python, you need to install three modules.

* The `azure-mgmt-resource` module, which includes Azure modules for Active Directory, etc.
* The `azure-mgmt-datalake-store` module, which includes the Azure Data Lake Storage Gen1 account management operations. For more information on this module, see [Azure Data Lake Storage Gen1 Management module reference](https://docs.microsoft.com/python/api/azure.mgmt.datalake.store?view=azure-python).
* The `azure-datalake-store` module, which includes the Azure Data Lake Storage Gen1 filesystem operations. For more information on this module, see [azure-datalake-store Filesystem module reference](http://azure-datalake-store.readthedocs.io/en/latest/).

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
	## Use this for Azure AD authentication
	from msrestazure.azure_active_directory import AADTokenCredentials

	## Required for Azure Data Lake Storage Gen1 account management
	from azure.mgmt.datalake.store import DataLakeStoreAccountManagementClient
	from azure.mgmt.datalake.store.models import DataLakeStoreAccount

	## Required for Azure Data Lake Storage Gen1 filesystem management
	from azure.datalake.store import core, lib, multithread

	# Common Azure imports
	import adal
    from azure.mgmt.resource.resources import ResourceManagementClient
	from azure.mgmt.resource.resources.models import ResourceGroup

	## Use these as needed for your application
	import logging, pprint, uuid, time
	```

3. Save changes to mysample.py.

## End-user authentication with multi-factor authentication

### For account management

Use the following snippet to authenticate with Azure AD for account management operations on a Data Lake Storage Gen1 account. The following snippet can be used to authenticate your application using multi-factor authentication. Provide the values below for  an existing Azure AD **native** application.

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
    armCreds = AADTokenCredentials(mgmt_token, client_id, resource = RESOURCE)

### For filesystem operations

Use this to authenticate with Azure AD for filesystem operations on a Data Lake Storage Gen1 account. The following snippet can be used to authenticate your application using multi-factor authentication. Provide the values below for  an existing Azure AD **native** application.

	adlCreds = lib.auth(tenant_id='FILL-IN-HERE', resource = 'https://datalake.azure.net/')

## End-user authentication without multi-factor authentication

This is deprecated. For more information, see [Azure Authentication using Python SDK](https://docs.microsoft.com/python/azure/python-sdk-azure-authenticate?view=azure-python#mgmt-auth-token).
   
## Next steps
In this article, you learned how to use end-user authentication to authenticate with Azure Data Lake Storage Gen1 using Python. You can now look at the following articles that talk about how to use Python to work with Azure Data Lake Storage Gen1.

* [Account management operations on Data Lake Storage Gen1 using Python](data-lake-store-get-started-python.md)
* [Data operations on Data Lake Storage Gen1 using Python](data-lake-store-data-operations-python.md)

