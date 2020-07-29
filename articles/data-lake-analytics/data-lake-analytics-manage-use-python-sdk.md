---
title: Manage Azure Data Lake Analytics using Python
description: This article describes how to use Python to manage Data Lake Analytics accounts, data sources, users, & jobs.
services: data-lake-analytics
ms.service: data-lake-analytics
author: matt1883
ms.author: saveenr

ms.reviewer: jasonwhowell
ms.assetid: d4213a19-4d0f-49c9-871c-9cd6ed7cf731
ms.topic: conceptual
ms.date: 06/08/2018
ms.custom: tracking-python
---
# Manage Azure Data Lake Analytics using Python
[!INCLUDE [manage-selector](../../includes/data-lake-analytics-selector-manage.md)]

This article describes how to manage Azure Data Lake Analytics accounts, data sources, users, and jobs by using Python.

## Supported Python versions

* Use a 64-bit version of Python.
* You can use the standard Python distribution found at **[Python.org downloads](https://www.python.org/downloads/)**. 
* Many developers find it convenient to use the **[Anaconda Python distribution](https://www.anaconda.com/download/)**.  
* This article was written using Python version 3.6 from the standard Python distribution

## Install Azure Python SDK

Install the following modules:

* The **azure-mgmt-resource** module includes other Azure modules for Active Directory, etc.
* The **azure-datalake-store** module includes the Azure Data Lake Store filesystem operations. 
* The **azure-mgmt-datalake-store** module includes the Azure Data Lake Store account management operations.
* The **azure-mgmt-datalake-analytics** module includes the Azure Data Lake Analytics operations. 

First, ensure you have the latest `pip` by running the following command:

```
python -m pip install --upgrade pip
```

This document was written using `pip version 9.0.1`.

Use the following `pip` commands to install the modules from the commandline:

```
pip install azure-mgmt-resource
pip install azure-datalake-store
pip install azure-mgmt-datalake-store
pip install azure-mgmt-datalake-analytics
```

## Create a new Python script

Paste the following code into the script:

```python
# Use this only for Azure AD service-to-service authentication
#from azure.common.credentials import ServicePrincipalCredentials

# Use this only for Azure AD end-user authentication
#from azure.common.credentials import UserPassCredentials

# Required for Azure Resource Manager
from azure.mgmt.resource.resources import ResourceManagementClient
from azure.mgmt.resource.resources.models import ResourceGroup

# Required for Azure Data Lake Store account management
from azure.mgmt.datalake.store import DataLakeStoreAccountManagementClient
from azure.mgmt.datalake.store.models import DataLakeStoreAccount

# Required for Azure Data Lake Store filesystem management
from azure.datalake.store import core, lib, multithread

# Required for Azure Data Lake Analytics account management
from azure.mgmt.datalake.analytics.account import DataLakeAnalyticsAccountManagementClient
from azure.mgmt.datalake.analytics.account.models import DataLakeAnalyticsAccount, DataLakeStoreAccountInformation

# Required for Azure Data Lake Analytics job management
from azure.mgmt.datalake.analytics.job import DataLakeAnalyticsJobManagementClient
from azure.mgmt.datalake.analytics.job.models import JobInformation, JobState, USqlJobProperties

# Required for Azure Data Lake Analytics catalog management
from azure.mgmt.datalake.analytics.catalog import DataLakeAnalyticsCatalogManagementClient

# Use these as needed for your application
import logging
import getpass
import pprint
import uuid
import time
```

Run this script to verify that the modules can be imported.

## Authentication

### Interactive user authentication with a pop-up

This method is not supported.

### Interactive user authentication with a device code

```python
user = input(
    'Enter the user to authenticate with that has permission to subscription: ')
password = getpass.getpass()
credentials = UserPassCredentials(user, password)
```

### Noninteractive authentication with SPI and a secret

```python
credentials = ServicePrincipalCredentials(
    client_id='FILL-IN-HERE', secret='FILL-IN-HERE', tenant='FILL-IN-HERE')
```

### Noninteractive authentication with API and a certificate

This method is not supported.

## Common script variables

These variables are used in the samples.

```python
subid = '<Azure Subscription ID>'
rg = '<Azure Resource Group Name>'
location = '<Location>'  # i.e. 'eastus2'
adls = '<Azure Data Lake Store Account Name>'
adla = '<Azure Data Lake Analytics Account Name>'
```

## Create the clients

```python
resourceClient = ResourceManagementClient(credentials, subid)
adlaAcctClient = DataLakeAnalyticsAccountManagementClient(credentials, subid)
adlaJobClient = DataLakeAnalyticsJobManagementClient(
    credentials, 'azuredatalakeanalytics.net')
```

## Create an Azure Resource Group

```python
armGroupResult = resourceClient.resource_groups.create_or_update(
    rg, ResourceGroup(location=location))
```

## Create Data Lake Analytics account

First create a store account.

```python
adlsAcctResult = adlsAcctClient.account.create(
	rg,
	adls,
	DataLakeStoreAccount(
		location=location)
	)
).wait()
```
Then create an ADLA account that uses that store.

```python
adlaAcctResult = adlaAcctClient.account.create(
    rg,
    adla,
    DataLakeAnalyticsAccount(
        location=location,
        default_data_lake_store_account=adls,
        data_lake_store_accounts=[DataLakeStoreAccountInformation(name=adls)]
    )
).wait()
```

## Submit a job

```python
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
    adla,
    jobId,
    JobInformation(
        name='Sample Job',
        type='USql',
        properties=USqlJobProperties(script=script)
    )
)
```

## Wait for a job to end

```python
jobResult = adlaJobClient.job.get(adla, jobId)
while(jobResult.state != JobState.ended):
    print('Job is not yet done, waiting for 3 seconds. Current state: ' +
          jobResult.state.value)
    time.sleep(3)
    jobResult = adlaJobClient.job.get(adla, jobId)

print('Job finished with result: ' + jobResult.result.value)
```

## List pipelines and recurrences
Depending whether your jobs have pipeline or recurrence metadata attached, you can list pipelines and recurrences.

```python
pipelines = adlaJobClient.pipeline.list(adla)
for p in pipelines:
    print('Pipeline: ' + p.name + ' ' + p.pipelineId)

recurrences = adlaJobClient.recurrence.list(adla)
for r in recurrences:
    print('Recurrence: ' + r.name + ' ' + r.recurrenceId)
```

## Manage compute policies

The DataLakeAnalyticsAccountManagementClient object provides methods for managing the compute policies for a Data Lake Analytics account.

### List compute policies

The following code retrieves a list of compute policies for a Data Lake Analytics account.

```python
policies = adlaAccountClient.computePolicies.listByAccount(rg, adla)
for p in policies:
    print('Name: ' + p.name + 'Type: ' + p.objectType + 'Max AUs / job: ' +
          p.maxDegreeOfParallelismPerJob + 'Min priority / job: ' + p.minPriorityPerJob)
```

### Create a new compute policy

The following code creates a new compute policy for a Data Lake Analytics account, setting the maximum AUs available to the specified user to 50, and the minimum job priority to 250.

```python
userAadObjectId = "3b097601-4912-4d41-b9d2-78672fc2acde"
newPolicyParams = ComputePolicyCreateOrUpdateParameters(
    userAadObjectId, "User", 50, 250)
adlaAccountClient.computePolicies.createOrUpdate(
    rg, adla, "GaryMcDaniel", newPolicyParams)
```

## Next steps

- To see the same tutorial using other tools, click the tab selectors on the top of the page.
- To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
- For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).

