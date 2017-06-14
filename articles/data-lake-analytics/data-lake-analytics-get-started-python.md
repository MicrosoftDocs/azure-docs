---
title: Get started with Azure Data Lake Analytics using Python | Microsoft Docs
description: 'Learn how to use Python to create a Data Lake Store account, and submit jobs. '
services: data-lake-analytics
documentationcenter: ''
author: saveenr
manager: saveenr
editor: cgronlun

ms.service: data-lake-analytics
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 11/15/2016
ms.author: jgao

---


# Get started with Azure Data Lake Analytics using Python
[!INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

Learn how to use Python to create Azure Data Lake Analytics accounts, define Data Lake Analytics jobs in [U-SQL](data-lake-analytics-u-sql-get-started.md), and submit jobs to Data Lake Analytic accounts. For more information about Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

In this tutorial, you develop a job that reads a tab separated values (TSV) file and converts it into a comma-separated-values (CSV) file. To go through the same tutorial using other supported tools, click the tabs on the top of this section.

## Prerequisites

Before you begin this tutorial, you must have the following items:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
- **An Azure Active Directory Application**. You use the Azure AD application to authenticate the Data Lake Store application with Azure AD. There are different approaches to authenticate with Azure AD, which are end-user authentication or service-to-service authentication. For instructions and more information on how to authenticate, see [End-user authentication](../data-lake-store/data-lake-store-end-user-authenticate-using-active-directory.md) or [Service-to-service authentication](../data-lake-store/data-lake-store-authenticate-using-active-directory.md).
- **[Python](https://www.python.org/downloads/)**. You must use the 64-bit version. This article uses Python version 3.5.2.


## Install Azure Python SDK

To work with Data Lake Store using Python, you need to install the following modules.

* The **azure-mgmt-datalake-store** module includes the Azure Data Lake Store account management operations.
* The **azure-mgmt-resource** module includes other Azure modules for Active Directory, etc.
* The **azure-datalake-store** module includes the Azure Data Lake Store filesystem operations. 
* The **azure-datalake-analytics** module includes the Azure Data Lake Analytics operations. 

Use the following `pip` commands to install the modules.

```
pip install azure-mgmt-resource
pip install azure-mgmt-datalake-store
pip install azure-mgmt-datalake-analytics
pip install azure-datalake-store
```

## Create a Python application

Use the IDE of your choice to create a new Python script, for example, mysample.py. Initialize the python script with the following code to load the required modules.

```
## Use this only for Azure AD service-to-service authentication
from azure.common.credentials import ServicePrincipalCredentials

## Use this only for Azure AD end-user authentication
from azure.common.credentials import UserPassCredentials

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

## Authentication

Use one of the following methods to authenticate:

### End-user authentication for account management

Use this method to authenticate with Azure AD for account management operations (create/delete Data Lake Store account, etc.). You must provide username and password for an Azure AD user. The user account cannot be configured for multi-factor authentication, and the account can't be a Microsoft account / Live ID, for example, @outlook.com, and @live.com.

```
user = input('Enter the user to authenticate with that has permission to subscription: ')
password = getpass.getpass()
credentials = UserPassCredentials(user, password)
```

### Service-to-service authentication with client secret for account management

Use this method to authenticate with Azure AD for account management operations (create/delete Data Lake Store account, etc.). The following snippet can be used to authenticate your application non-interactively, using the client secret for an application / service principal. Use this with an existing Azure AD "Web App" application.

```
credentials = ServicePrincipalCredentials(client_id = 'FILL-IN-HERE', secret = 'FILL-IN-HERE', tenant = 'FILL-IN-HERE')
```

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
resourceClient = ResourceManagementClient(credentials, subId)
adlaAcctClient = DataLakeAnalyticsAccountManagementClient(credentials, subId)
adlaJobClient = DataLakeAnalyticsJobManagementClient( credentials, 'azuredatalakeanalytics.net')
```

## Create an Azure Resource Group

```
armGroupResult = resourceClient.resource_groups.create_or_update( rg, ResourceGroup( location=location ) )
```

## Create Data Lake Store account

Each Data Lake Analytics account requires a Data Lake Store account. For instructions, see [Create a Data Lake Store account](../data-lake-store/data-lake-store-get-started-portal.md#create-an-azure-data-lake-store-account).

## Create an Azure Data Lake Analytics account

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

The Data Lake Analytics jobs are written in the U-SQL language. To learn more about U-SQL, see [Get started with U-SQL language](data-lake-analytics-u-sql-get-started.md) and [U-SQL language reference](http://go.microsoft.com/fwlink/?LinkId=691348).

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

