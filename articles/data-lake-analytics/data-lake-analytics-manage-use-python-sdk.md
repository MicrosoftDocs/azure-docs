---
title: Manage Azure Data Lake Analytics using Python | Microsoft Docs
description: 'Learn how to use Python to create a Data Lake Store account, and submit jobs. '
services: data-lake-analytics
documentationcenter: ''
author: saveenr
manager: saveenr
editor: cgronlun

ms.assetid: d4213a19-4d0f-49c9-871c-9cd6ed7cf731
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 03/3/2017
ms.author: saveenr

---


# Manage Azure Data Lake Analytics using Python

## Python versions

* You must use a 64-bit version of Python.
* You can use the standard python distribution found at **[Python.org downloads](https://www.python.org/downloads/)**. 
* Many developers find it  convenient to use the **[Anaconda Python distribution](https://www.continuum.io/downloads)**.  
* This article was written using Python version 3.6 from the standard Python distribution

## Install Azure Python SDK

You need to install the following modules.

* The **azure-mgmt-resource** module includes other Azure modules for Active Directory, etc.
* The **azure-mgmt-datalake-store** module includes the Azure Data Lake Store account management operations.
* The **azure-datalake-store** module includes the Azure Data Lake Store filesystem operations. 
* The **azure-datalake-analytics** module includes the Azure Data Lake Analytics operations. 

First, ensure you have the latest `pip` by running the following command.

```
python -m pip install --upgrade pip
```

This document was written using `pip version 9.0.1`.

Use the following `pip` commands to install the modules from the commandline.

```
pip install azure-mgmt-resource
pip install azure-datalake-store
pip install azure-mgmt-datalake-store
pip install azure-mgmt-datalake-analytics
```

## Create a new Python script

Paste the following code into the script.

```
## Use this only for Azure AD service-to-service authentication
#from azure.common.credentials import ServicePrincipalCredentials

## Use this only for Azure AD end-user authentication
#from azure.common.credentials import UserPassCredentials

## Required for Azure Resource Manager
from azure.mgmt.resource.resources import ResourceManagementClient
from azure.mgmt.resource.resources.models import ResourceGroup

## Required for Azure Data Lake Store account management
from azure.mgmt.datalake.store import DataLakeStoreAccountManagementClient
from azure.mgmt.datalake.store.models import DataLakeStoreAccount

## Required for Azure Data Lake Store filesystem management
from azure.datalake.store import core, lib, multithread

## Required for Azure Data Lake Analytics account management
from azure.mgmt.datalake.analytics.account import DataLakeAnalyticsAccountManagementClient
from azure.mgmt.datalake.analytics.account.models import DataLakeAnalyticsAccount, DataLakeStoreAccountInfo

## Required for Azure Data Lake Analytics job management
from azure.mgmt.datalake.analytics.job import DataLakeAnalyticsJobManagementClient
from azure.mgmt.datalake.analytics.job.models import JobInformation, JobState, USqlJobProperties

## Required for Azure Data Lake Analytics catalog management
from azure.mgmt.datalake.analytics.catalog import DataLakeAnalyticsCatalogManagementClient

## Use these as needed for your application
import logging, getpass, pprint, uuid, time
```

Run this script to verify that the modules can be imported.

## Authentication

### Interactive user authentication with a pop-up

This method is not supported.

### Interactice user authentication with a device code

```
user = input('Enter the user to authenticate with that has permission to subscription: ')
password = getpass.getpass()
credentials = UserPassCredentials(user, password)
```

### Noninteractive authentication with a SPI and a secret

```
credentials = ServicePrincipalCredentials(client_id = 'FILL-IN-HERE', secret = 'FILL-IN-HERE', tenant = 'FILL-IN-HERE')
```

### Noninteractive authentication with a API and a cetificate

This method is not supported.

## Common script variables

These variables will be used in the samples

```
subid= '<Azure Subscription ID>'
rg = '<Azure Resource Group Name>'
location = '<Location>' # i.e. 'eastus2'
adls = '<Azure Data Lake Store Account Name>'
adls = '<Azure Data Lake Analytics Account Name>'
```

## Create the clients

```
resourceClient = ResourceManagementClient(credentials, subid)
adlaAcctClient = DataLakeAnalyticsAccountManagementClient(credentials, subid)
adlaJobClient = DataLakeAnalyticsJobManagementClient( credentials, 'azuredatalakeanalytics.net')
```

## Create an Azure Resource Group

```
armGroupResult = resourceClient.resource_groups.create_or_update( rg, ResourceGroup( location=location ) )
```

## Create Data Lake Analytics account

First create a store account.

```
adlaAcctResult = adlaAcctClient.account.create(
	rg,
	adla,
	DataLakeAnalyticsAccount(
		location=location,
		default_data_lake_store_account=adls,
		data_lake_store_accounts=[DataLakeStoreAccountInfo(name=adls)]
	)
).wait()
```
Then create an ADLA account that uses that store.

```
adlaAcctResult = adlaAcctClient.account.create(
	rg,
	adla,
	DataLakeAnalyticsAccount(
		location=location,
		default_data_lake_store_account=adls,
		data_lake_store_accounts=[DataLakeStoreAccountInfo(name=adls)]
	)
).wait()
```

## Submit Data Lake Analytics jobs

```
script = """
@a  = 
    SELECT * FROM 
        (VALUES
            ("Contoso", 1500.0),
            ("Woodgrove", 2700.0)
        ) AS 
              D( customer, amount );
OUTPUT @a
    TO "/data.csv"
    USING Outputters.Csv();
"""

jobId = str(uuid.uuid4())
jobResult = adlaJobClient.job.create(
	adlaAccountName,
	jobId,
	JobInformation(
		name='Sample Job',
		type='USql',
		properties=USqlJobProperties(script=script)
	)
)
```

## Wait for the Job to finish

```
while(jobResult.state != JobState.ended):
	print('Job is not yet done, waiting for 3 seconds. Current state: ' + jobResult.state.value)
	time.sleep(3)
	jobResult = adlaJobClient.job.get(adlaAccountName, jobId)

print ('Job finished with result: ' + jobResult.result.value)
```

## Next steps

- To see the same tutorial using other tools, click the tab selectors on the top of the page.
- To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
- For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).

