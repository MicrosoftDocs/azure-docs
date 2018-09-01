---
title: Load data with the data prep SDK
description: Learn about loading data with data prep SDK
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: how-to
ms.author: cforbe
author: cforbe
ms.date: 08/30/2018
---

#Load Data with the data prep SDK

DataPrep has the ability to load different types of input data. While it is possible to use our smart reading functionality to detect the type of a file, it is also possible to specify a file type and its parameters.

## Table of Contents
- [Read Lines](#read-lines)
- [Read CSV](#read-csv)
- [Read Excel](#read-excel)
- [Read Fixed Width Files](#read-fixed-width-files)
- [Read SQL](#read-sql)
- [Read From ADLS](#read-from-adls)

## Read Lines
One of the simplest ways to read a file into a dataframe is to just read it as text lines.

```
dataflow = dprep.read_lines(path='./data/text_lines.txt')
dataflow.head(20)
```
With our ingestion done, we can go ahead and retrieve a Pandas DataFrame for the full dataset.

```
df = dataflow.to_pandas_dataframe()
df
```

## Read CSV
When reading delimited files, we can let the underlying runtime infer the parsing parameters (e.g. separator, encoding, whether to use headers, etc.) simply by not providing them. In this case, we will attempt to read a file by specifying only its location. 

```
# SAS expires June 16th, 2019
dataflow = dprep.read_csv(path='https://dpreptestfiles.blob.core.windows.net/testfiles/read_csv_duplicate_headers.csv?st=2018-06-15T23%3A01%3A42Z&se=2019-06-16T23%3A01%3A00Z&sp=r&sv=2017-04-17&sr=b&sig=ugQQCmeC2eBamm6ynM7wnI%2BI3TTDTM6z9RPKj4a%2FU6g%3D')
dataflow.head(10)
```

One of the parameters we can specify is a number of lines to skip from the files we are reading. We will do so to filter out the duplicate line.
```
dataflow = dprep.read_csv(path='https://dpreptestfiles.blob.core.windows.net/testfiles/read_csv_duplicate_headers.csv',
                          skip_rows=1)
dataflow.head(10)
```
Next, we can take a look at the data types of the columns.
```
dataflow.head(1).dtypes

stnam                     object
fipst                     object
leaid                     object
leanm10                   object
ncessch                   object
schnam10                  object
ALL_MTH00numvalid_1011    object
ALL_MTH00pctprof_1011     object
MAM_MTH00numvalid_1011    object
MAM_MTH00pctprof_1011     object
MAS_MTH00numvalid_1011    object
MAS_MTH00pctprof_1011     object
MBL_MTH00numvalid_1011    object
MBL_MTH00pctprof_1011     object
MHI_MTH00numvalid_1011    object
MHI_MTH00pctprof_1011     object
MTR_MTH00numvalid_1011    object
MTR_MTH00pctprof_1011     object
MWH_MTH00numvalid_1011    object
MWH_MTH00pctprof_1011     object
F_MTH00numvalid_1011      object
F_MTH00pctprof_1011       object
M_MTH00numvalid_1011      object
M_MTH00pctprof_1011       object
CWD_MTH00numvalid_1011    object
CWD_MTH00pctprof_1011     object
ECD_MTH00numvalid_1011    object
ECD_MTH00pctprof_1011     object
LEP_MTH00numvalid_1011    object
LEP_MTH00pctprof_1011     object
                           ...  
LEP_MTHHSnumvalid_1011    object
LEP_MTHHSpctprof_1011     object
HOM_MTH03numvalid_1011    object
HOM_MTH03pctprof_1011     object
HOM_MTH04numvalid_1011    object
HOM_MTH04pctprof_1011     object
HOM_MTH05numvalid_1011    object
HOM_MTH05pctprof_1011     object
HOM_MTH06numvalid_1011    object
HOM_MTH06pctprof_1011     object
HOM_MTH07numvalid_1011    object
HOM_MTH07pctprof_1011     object
HOM_MTH08numvalid_1011    object
HOM_MTH08pctprof_1011     object
HOM_MTHHSnumvalid_1011    object
HOM_MTHHSpctprof_1011     object
MIG_MTH03numvalid_1011    object
MIG_MTH03pctprof_1011     object
MIG_MTH04numvalid_1011    object
MIG_MTH04pctprof_1011     object
MIG_MTH05numvalid_1011    object
MIG_MTH05pctprof_1011     object
MIG_MTH06numvalid_1011    object
MIG_MTH06pctprof_1011     object
MIG_MTH07numvalid_1011    object
MIG_MTH07pctprof_1011     object
MIG_MTH08numvalid_1011    object
MIG_MTH08pctprof_1011     object
MIG_MTHHSnumvalid_1011    object
MIG_MTHHSpctprof_1011     object
dtype: object
```
Unfortunately, all of our columns came back as strings. This is because, by default, data prep will not change the type of your data. Since the data source we are reading from is a text file, we keep all values as strings. In this case, however, we do want to parse numeric columns as numbers. To do this, we can set the inference_arguments parameter to current_culture.

```
dataflow = dprep.read_csv(path='https://dpreptestfiles.blob.core.windows.net/testfiles/read_csv_duplicate_headers.csv',
                          skip_rows=1,
                          inference_arguments=dprep.InferenceArguments.current_culture())
dataflow.head(1).dtypes

stnam                      object
fipst                     float64
leaid                     float64
leanm10                    object
ncessch                   float64
schnam10                   object
ALL_MTH00numvalid_1011    float64
ALL_MTH00pctprof_1011      object
MAM_MTH00numvalid_1011     object
MAM_MTH00pctprof_1011      object
MAS_MTH00numvalid_1011     object
MAS_MTH00pctprof_1011      object
MBL_MTH00numvalid_1011     object
MBL_MTH00pctprof_1011      object
MHI_MTH00numvalid_1011     object
MHI_MTH00pctprof_1011      object
MTR_MTH00numvalid_1011     object
MTR_MTH00pctprof_1011      object
MWH_MTH00numvalid_1011     object
MWH_MTH00pctprof_1011      object
F_MTH00numvalid_1011      float64
F_MTH00pctprof_1011        object
M_MTH00numvalid_1011      float64
M_MTH00pctprof_1011        object
CWD_MTH00numvalid_1011    float64
CWD_MTH00pctprof_1011      object
ECD_MTH00numvalid_1011    float64
ECD_MTH00pctprof_1011      object
LEP_MTH00numvalid_1011     object
LEP_MTH00pctprof_1011      object
                           ...   
LEP_MTHHSnumvalid_1011     object
LEP_MTHHSpctprof_1011      object
HOM_MTH03numvalid_1011     object
HOM_MTH03pctprof_1011      object
HOM_MTH04numvalid_1011     object
HOM_MTH04pctprof_1011      object
HOM_MTH05numvalid_1011     object
HOM_MTH05pctprof_1011      object
HOM_MTH06numvalid_1011     object
HOM_MTH06pctprof_1011      object
HOM_MTH07numvalid_1011     object
HOM_MTH07pctprof_1011      object
HOM_MTH08numvalid_1011     object
HOM_MTH08pctprof_1011      object
HOM_MTHHSnumvalid_1011     object
HOM_MTHHSpctprof_1011      object
MIG_MTH03numvalid_1011     object
MIG_MTH03pctprof_1011      object
MIG_MTH04numvalid_1011     object
MIG_MTH04pctprof_1011      object
MIG_MTH05numvalid_1011     object
MIG_MTH05pctprof_1011      object
MIG_MTH06numvalid_1011     object
MIG_MTH06pctprof_1011      object
MIG_MTH07numvalid_1011     object
MIG_MTH07pctprof_1011      object
MIG_MTH08numvalid_1011     object
MIG_MTH08pctprof_1011      object
MIG_MTHHSnumvalid_1011     object
MIG_MTHHSpctprof_1011      object
dtype: object
```
Now we can see several of the columns were correctly detected as numbers and their type is set to float64. With our ingestion done, we can go ahead and retrieve a Pandas DataFrame for the full dataset.

```
df = dataflow.to_pandas_dataframe()
df
```

## Read Excel
DataPrep also can load excel files using read_excel function.
```
dataflow = dprep.read_excel(path='./data/excel.xlsx')
dataflow.head(10)
```

Here we have loaded the first sheet in the Excel document. We could have achieved the same result by specifying the name of the sheet we want to load explicitly. Alternatively, if we wanted to load the second sheet instead, we would provide its name as an argument.
```
dataflow = dprep.read_excel(path='./data/excel.xlsx', sheet_name='Sheet2')
dataflow.head(10)

df = dataflow.to_pandas_dataframe()
df
```

## Read Fixed Width Files
For fixed-width files, we can specify a list of offsets. The first column is always assumed to start at offset 0.

```
dataflow = dprep.read_fwf('./data/fixed_width_file.txt', offsets=[7, 13, 43, 46, 52, 58, 65, 73])
dataflow.head(10)
```
When there are no headers in the files, we want to treat the first row as data.

By passing in PromoteHeadersMode.NONE to the header keyword argument, we can avoid header detection and get the correct data.

```
dataflow = dprep.read_fwf('./data/fixed_width_file.txt',
                          offsets=[7, 13, 43, 46, 52, 58, 65, 73],
                          header=dprep.PromoteHeadersMode.NONE)
dataflow.head(10)

df = dataflow.to_pandas_dataframe()
df
```
## Read SQL
DataPrep can also get data from SQL servers. Currently, only Microsoft SQL Server is supported.
To read data from a SQL server, we have to create a data source object that contains the connection information.

```
secret = dprep.register_secret("dpr3pTestU$er", "anySecretId")

ds = dprep.MSSQLDataSource(server_name="dprep-sql-test.database.windows.net",
                           database_name="dprep-sql-test",
                           user_name="dprepTestUser",
                           password=secret)
```
As you can see, the password parameter of MSSQLDataSource accepts a Secret object. You can get a Secret object in two ways:
1.	Register the secret and its value with the execution engine 
2.	Create the secret with just an ID (useful if the secret value was already registered in the execution environment)

Now that we have created a data source object, we can proceed to read data.
```
dataflow = dprep.read_sql(ds, "SELECT top 100 * FROM [SalesLT].[Product]")
dataflow.head(20)

df = dataflow.to_pandas_dataframe()
df.dtypes
```
## Read from ADLS
There are two ways the DataPrep API can acquire the necessary OAuth token to access Azure DataLake Storage:
1.	Retrieve the access token from a recent login session of the user's Azure CLI login
2.	Using a ServicePrincipal (SP) and a certificate as secret

### Using Access Token from a recent Azure CLI session
On your local machine, run the following command:

Note: If your user account is a member of more than one Azure tenant, it will be necessary to specify the tenant in the AAD url hostname form.
```
az login
az account show --query tenantId
dataflow = read_csv(path = DataLakeDataSource(path='adl://dpreptestfiles.azuredatalakestore.net/farmers-markets.csv', tenant='microsoft.onmicrosoft.com')) head = dataflow.head(5) head
```
### Create a ServicePrincipal via Azure CLI
A ServicePrincipal and the corresponding certificate can be created via Azure CLI. This particular SP is configured as Reader, with its scope reduced to just the ADLS account 'dpreptestfiles'
```
az account set --subscription "Data Wrangling development"
az ad sp create-for-rbac -n "SP-ADLS-dpreptestfiles" --create-cert --role reader --scopes /subscriptions/35f16a99-532a-4a47-9e93-00305f6c40f2/resourceGroups/dpreptestfiles/providers/Microsoft.DataLakeStore/accounts/dpreptestfiles
```
This command emits the appId and the path to the certificate file (usually in the home folder). The .crt file contains both the public cert and the private key in PEM format.

Extract the thumbprint with:
```
openssl x509 -in adls-dpreptestfiles.crt -noout -fingerprint
```

##### Configure ADLS Account for ServicePrincipal
To configure the ACL for the ADLS filesystem, use the objectId of the user or, here, ServicePrincipal:
```
az ad sp show --id "8dd38f34-1fcb-4ff9-accd-7cd60b757174" --query objectId
```
Configure Read and Execute access for the ADLS file system. Since the underlying HDFS ACL model doesn't support inheritance, folders and files need to be ACL-ed individually.
```
az dls fs access set-entry --account dpreptestfiles --acl-spec "user:e37b9b1f-6a5e-4bee-9def-402b956f4e6f:r-x" --path /
az dls fs access set-entry --account dpreptestfiles --acl-spec "user:e37b9b1f-6a5e-4bee-9def-402b956f4e6f:r--" --path /farmers-markets.csv
```
References:
-	az ad sp
-	az dls fs access
-	ACL model for ADLS

```
certThumbprint = 'C2:08:9D:9E:D1:74:FC:EB:E9:7E:63:96:37:1C:13:88:5E:B9:2C:84'
certificate = ''
with open('./data/adls-dpreptestfiles.crt', 'rt', encoding='utf-8') as crtFile:
    certificate = crtFile.read()

servicePrincipalAppId = "8dd38f34-1fcb-4ff9-accd-7cd60b757174"
```
#### Acquire an OAuth Access Token
Use the adal package (via: pip install adal) to create an authentication context on the MSFT tenant and acquire an OAuth access token. For ADLS, the resource in the token request must be for 'https://datalake.azure.net', which is different from most other Azure resources.

```
import adal
from azureml.dataprep.api.datasources import DataLakeDataSource

ctx = adal.AuthenticationContext('https://login.microsoftonline.com/microsoft.onmicrosoft.com')
token = ctx.acquire_token_with_client_certificate('https://datalake.azure.net/', servicePrincipalAppId, certificate, certThumbprint)
dataflow = dprep.read_csv(path = DataLakeDataSource(path='adl://dpreptestfiles.azuredatalakestore.net/farmers-markets.csv', accessToken=token['accessToken']))
dataflow.to_pandas_dataframe().head()
```


