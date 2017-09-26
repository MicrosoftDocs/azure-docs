---
title: 'Service-to-service authentication: Python with Data Lake Store using Azure Active Directory | Microsoft Docs'
description: Learn how to achieve service-to-service authentication with Data Lake Store using Azure Active Directory using Python
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
# Service-to-service authentication with Data Lake Store using Python
> [!div class="op_single_selector"]
> * [Using Java](data-lake-store-service-to-service-authenticate-java.md)
> * [Using .NET SDK](data-lake-store-service-to-service-authenticate-net-sdk.md)
> * [Using Python](data-lake-store-service-to-service-authenticate-python.md)
> * [Using REST API](data-lake-store-service-to-service-authenticate-rest-api.md)
> 
>  

In this article, you learn about how to use the Python SDK to do service-to-service authentication with Azure Data Lake Store. For end-user authentication with Data Lake Store using Python, see [End-user authentication with Data Lake Store using Python](data-lake-store-end-user-authenticate-python.md).


## Prerequisites

* **Python**. You can download Python from [here](https://www.python.org/downloads/). This article uses Python 3.5.2.

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Create an Azure Active Directory "Web" Application**. You must have completed the steps in [Service-to-service authentication with Data Lake Store using Azure Active Directory](data-lake-store-service-to-service-authenticate-using-active-directory.md).

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

1. In the IDE of your choice create a new Python application, for example, **mysample.py**.

2. Add the following snippet to import the required modules

	```
	## Use this only for Azure AD service-to-service authentication
	from azure.common.credentials import ServicePrincipalCredentials

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

## Service-to-service authentication with client secret for account management

Use this snippet to authenticate with Azure AD for account management operations on Data Lake Store such as create Data Lake Store account, delete Data Lake Store account, etc. The following snippet can be used to authenticate your application non-interactively, using the client secret for an application / service principal of an existing Azure AD "Web App" application.

    credentials = ServicePrincipalCredentials(client_id = 'FILL-IN-HERE', secret = 'FILL-IN-HERE', tenant = 'FILL-IN-HERE')

## Service-to-service authentication with client secret for filesystem operations

Use the following snippet to authenticate with Azure AD for filesystem operations on Data Lake Store such as create folder, upload file, etc. The following snippet can be used to authenticate your application non-interactively, using the client secret for an application / service principal. Use this with an existing Azure AD "Web App" application.

    token = lib.auth(tenant_id = 'FILL-IN-HERE', client_secret = 'FILL-IN-HERE', client_id = 'FILL-IN-HERE') 

## Next steps
In this article, you learned how to use service-to-service authentication to authenticate with Azure Data Lake Store using Python. You can now look at the following articles that talk about how to use Python to work with Azure Data Lake Store.

* [Account management operations on Data Lake Store using Python](data-lake-store-get-started-python.md)
* [Data operations on Data Lake Store using Python](data-lake-store-data-operations-python.md)


