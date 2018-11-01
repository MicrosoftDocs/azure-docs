---
title: Load data with the Azure Machine Learning Data Prep SDK - Python
description: Learn about loading data with Azure Machine Learning Data Prep SDK. You can load different types of input data, specify data file types and parameters, or use the SDK smart reading functionality to automatically detect file type.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: cforbe
author: cforbe
manager: cgronlun
ms.reviewer: jmartens
ms.date: 09/24/2018
---

# Load and read data with Azure Machine Learning

Use the [Azure Machine Learning Data Prep SDK](https://docs.microsoft.com/python/api/overview/azure/dataprep?view=azure-dataprep-py) to load different types of input data. 

In order to load your data, specify the data file type and its parameters

## Use text line data 
One of the simplest ways to load data is to read it as text lines.

Here is sample code:
```python
dataflow = dprep.read_lines(path='./data/text_lines.txt')
dataflow.head(5)
```
||Line|
|----|-----|
|0|Date \|\|  Minimum temperature \|\|  Maximum temperature|
|1|2015-07-1 \|\|  -4.1 \|\|  10.0|
|2|2015-07-2 \|\|  -0.8 \|\|  10.8|
|3|2015-07-3 \|\|  -7.0 \|\|  10.5|
|4|2015-07-4 \|\|  -5.5 \|\|  9.3|

After the data is ingested, you can retrieve a pandas DataFrame for the full dataset.

Here is sample code:
```python
df = dataflow.to_pandas_dataframe()
df
```
Sample output:
||Line|
|----|-----|
|0|Date\|\| Minimum temperature\|\| Maximum temperature|
|1|2015-07-1\|\| 4.1\|\| 10.0|
|2|2015-07-2\|\| 0.8\|\| 10.8|
|3|2015-07-3\|\| 7.0\|\| 10.5|
|4|2015-07-4\|\| 5.5\|\| 9.3|

## Use CSV data
When reading delimited files, you can let the underlying runtime infer the parsing parameters (such as a separator, encoding, whether to use headers, etc.) rather than providing them. For this example, attempt to read a file by specifying only its location. 

Here is sample code:
```python
# SAS expires June 16th, 2019
dataflow = dprep.read_csv(path='https://dpreptestfiles.blob.core.windows.net/testfiles/read_csv_duplicate_headers.csv?st=2018-06-15T23%3A01%3A42Z&se=2019-06-16T23%3A01%3A00Z&sp=r&sv=2017-04-17&sr=b&sig=ugQQCmeC2eBamm6ynM7wnI%2BI3TTDTM6z9RPKj4a%2FU6g%3D')
dataflow.head(5)
```

Sample output:
| |stnam|fipst|leaid|leanm10|ncessch|MAM_MTH00numvalid_1011|
|-----|-------|---------| -------|------|-----|------|-----|
|0||stnam|fipst|leaid|leanm10|ncessch|MAM_MTH00numvalid_1011|
|1|ALABAMA|1|101710|Hale County|10171002158| |
|2|ALABAMA|1|101710|Hale County|10171002162| |
|3|ALABAMA|1|101710|Hale County|10171002156| |
|4|ALABAMA|1|101710|Hale County|10171000588|2|

One of the parameters you can specify is a number of lines to skip in the files you are reading. Use the following code to filter out the duplicate line.
```python
dataflow = dprep.read_csv(path='https://dpreptestfiles.blob.core.windows.net/testfiles/read_csv_duplicate_headers.csv',
                          skip_rows=1)
dataflow.head(5)
```

Sample output:
| |stnam|fipst|leaid|leanm10|ncessch|MAM_MTH00numvalid_1011|
|-----|-------|---------| -------|------|-----|------|-----|
|0|ALABAMA|1|101710|Hale County|10171002158|29|
|1|ALABAMA|1|101710|Hale County|10171002162|40 |
|2|ALABAMA|1|101710|Hale County|10171002156| 43|
|3|ALABAMA|1|101710|Hale County|10171000588|2|
|4|ALABAMA|1|101710|Hale County|10171000589|23 |

Next, you can look at the data types of the columns.
Here is sample code:
```python
dataflow.head(1).dtypes

stnam                     object
fipst                     object
leaid                     object
leanm10                   object
ncessch                   object
schnam10                  object
MAM_MTH00numvalid_1011    object
dtype: object
```

Unfortunately, all of our columns came back as strings. This is because, by default, the Azure Machine Learning Data Prep SDK does not change your data type. The data source we are reading from is a text file, so the SDK reads all values as strings. For this example, however, we want to parse numeric columns as numbers. To do this, you can set the inference_arguments parameter to current_culture.

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
dtype: object
```

Several of the columns were correctly detected as numbers and their type is set to float64. With ingestion done, you can retrieve a pandas DataFrame for the full dataset.
Here is sample code:
```python
df = dataflow.to_pandas_dataframe()
df
```

Sample output:
| |stnam|leanm10|ncessch|MAM_MTH00numvalid_1011|
|-----|-------|---------| -------|------|-----|
|0|ALABAMA|Hale County|1.017100e+10|49.0|
|1|ALABAMA|Hale County|1.017100e+10|40.0|
|2|ALABAMA|Hale County|1.017100e+10|43.0|
|3|ALABAMA|Hale County|1.017100e+10|2.0|
|4|ALABAMA|Hale County|1.017100e+10|23.0|

## Use Excel data
The Azure Machine Learning Data Prep SDK includes a `read_excel` function to load Excel files. Here is sample code:
```python
dataflow = dprep.read_excel(path='./data/excel.xlsx')
dataflow.head(5)
```

Sample output:
||Column1|Column2|Column3|Column4|Column5|Column6|Column7|Column8|
|------|------|------|-----|------|-----|-------|----|-----|
|0|Hoba|Iron, IVB|60000000.0|Found|1920.0|http://www.lpi.usra.edu/meteor/metbull.php?cod... |-19.58333|17.91667|
|1|Cape York|Iron, IIIAB|58200000.0|Found|1818.0|http://www.lpi.usra.edu/meteor/metbull.php?cod... |76.13333|-64.93333|
|2|Campo del Cielo|Iron, IAB-MG|50000000.0|Found|1576.0|http://www.lpi.usra.edu/meteor/metbull.php?cod... |-27.46667|-60.58333|
|3|Canyon Diablo|Iron, IAB-MG|30000000.0|Found|1891.0|http://www.lpi.usra.edu/meteor/metbull.php?cod... |35.05000|-111.03333|
|4|Armanty|Iron, IIIE|28000000.0|Found|1898.0|http://www.lpi.usra.edu/meteor/metbull.php?cod... |47.00000|88.00000|

You have loaded the first sheet of the Excel file. You can achieve the same result by explicitly specifying the name of the sheet you want to load. If you want to load the second sheet instead, you can provide its name as an argument. For example:
```python
dataflow = dprep.read_excel(path='./data/excel.xlsx', sheet_name='Sheet2')
dataflow.head(5)
```

Sample output:
||Column1|Column2|Column3|Column4|Column5|Column6|Column7|Column8|
|------|------|------|-----|------|-----|-------|----|-----|
|0|None|None|None|None|None|None|None|None|None|
|1|None|None|None|None|None|None|None|None|None|
|2|None|None|None|None|None|None|None|None|None|
|3|Rank|Title|Studio|Worldwide|Domestic / %|Column1|Overseas / %|Column2|Year^|
|4|1|Avatar|Fox|2788|760.5|0.273|2027.5|0.727|2009^|5|

As you can see, the table in the second sheet had headers and three empty rows. You need to modify the function's arguments accordingly.For example:
```python
dataflow = dprep.read_excel(path='./data/excel.xlsx', sheet_name='Sheet2', use_header=True, skip_rows=3)
df = dataflow.to_pandas_dataframe()
df
```

Sample output:
||Rank|Title|Studio|Worldwide|Domestic / %|Column1|Overseas / %|Column2|Year^|
|------|------|------|-----|------|-----|-------|----|-----|-----|
|0|1|Avatar|Fox|2788|760.5|0.273|2027.5|0.727|2009^|
|1|2|Titanic|Par.|2186.8|658.7|0.301|1528.1|0.699|1997^|
|2|3|Marvel's The Avengers|BV|1518.6|623.4|0.41|895.2|0.59|2012|
|3|4|Harry Potter and the Deathly Hallows Part 2|WB|1341.5|381|0.284|960.5|0.716|2011|
|4|5|Frozen|BV|1274.2|400.7|0.314|873.5|0.686|2013|

## Use Fixed-width data files
For fixed-width files, you can specify a list of offsets. The first column is always assumed to start at offset 0.For example:
```python
dataflow = dprep.read_fwf('./data/fixed_width_file.txt', offsets=[7, 13, 43, 46, 52, 58, 65, 73])
dataflow.head(5)
```

Sample output:
||010000|99999|BOGUS NORWAY|NO|NO_1|ENRS|Column7|Column8|Column9|
|------|------|------|-----|------|-----|-------|----|-----|----|
|0|010003|99999|BOGUS NORWAY|NO|NO|ENSO||||
|1|010010|99999|JAN MAYEN|NO|JN|ENJA|+70933|-008667|+00090|
|2|010013|99999|ROST|NO|NO|||||
|3|010014|99999|SOERSTOKKEN|NO|NO|ENSO|+59783|+005350|+00500|
|4|010015|99999|BRINGELAND|NO|NO|ENBL|+61383|+005867|+03270|


If there are no headers in the files, you'll want to treat the first row as data. By passing `PromoteHeadersMode.NONE` to the header keyword argument, you can avoid header detection and get the correct data. For example:
```python
dataflow = dprep.read_fwf('./data/fixed_width_file.txt',
                          offsets=[7, 13, 43, 46, 52, 58, 65, 73],
                          header=dprep.PromoteHeadersMode.NONE)

df = dataflow.to_pandas_dataframe()
df
```

Sample output:

||Column1|Column2|Column3|Column4|Column5|Column6|Column7|Column8|Column9|
|------|------|------|-----|------|-----|-------|----|-----|----|
|0|010000|99999|BOGUS NORWAY|NO|NO_1|ENRS|Column7|Column8|Column9|
|1|010003|99999|BOGUS NORWAY|NO|NO|ENSO||||
|2|010010|99999|JAN MAYEN|NO|JN|ENJA|+70933|-008667|+00090|
|3|010013|99999|ROST|NO|NO|||||
|4|010014|99999|SOERSTOKKEN|NO|NO|ENSO|+59783|+005350|+00500|
|5|010015|99999|BRINGELAND|NO|NO|ENBL|+61383|+005867|+03270|

## Use SQL data
The Azure Machine Learning Data Prep SDK can also load data from SQL servers. Currently, only Microsoft SQL Server is supported.
To read data from a SQL server, create a data source object that contains the connection information. For example:
```python
secret = dprep.register_secret("[SECRET-USERNAME]", "[SECRET-PASSWORD]")

ds = dprep.MSSQLDataSource(server_name="[SERVER-NAME]",
                           database_name="[DATABASE-NAME]",
                           user_name="[DATABASE-USERNAME]",
                           password=[DATABASE-PASSWORD])
```
As you can see, the password parameter of `MSSQLDataSource` accepts a secret object. You can get a secret object in two ways:
-	Register the secret and its value with the execution engine. 
-	Create the secret with only an ID (useful if the secret value is already registered in the execution environment).

After you create a data source object, you can proceed to read data. For example:
```python
dataflow = dprep.read_sql(ds, "SELECT top 100 * FROM [SalesLT].[Product]")
dataflow.head(5)
```

Sample output:
||ProductID|Name|ProductNumber|Color|StandardCost|ListPrice|Size|Weight|ProductCategoryID|ProductModelID|SellStartDate|SellEndDate|DiscontinuedDate|ThumbNailPhoto|ThumbnailPhotoFileName|rowguid|ModifiedDate|
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
|0|680|HL Road Frame - Black, 58|FR-R92B-58|Black|1059.3100|1431.50|58|1016.04|18|6|2002-06-01 00:00:00+00:00|None|None|b'GIF89aP\x001\x00\xf7\x00\x00\x00\x00\x00\x80...|no_image_available_small.gif|43dd68d6-14a4-461f-9069-55309d90ea7e|2008-03-11 |0:01:36.827000+00:00|
|1|706|HL Road Frame - Red, 58|FR-R92R-58|Red|1059.3100|1431.50|58|1016.04|18|6|2002-06-01 00:00:00+00:00|None|None|b'GIF89aP\x001\x00\xf7\x00\x00\x00\x00\x00\x80...|no_image_available_small.gif|9540ff17-2712-4c90-a3d1-8ce5568b2462|2008-03-11 |10:01:36.827000+00:00|
|2|707|Sport-100 Helmet, Red|HL-U509-R|Red|13.0863|34.99|None|None|35|33|2005-07-01 00:00:00+00:00|None|None|b'GIF89aP\x001\x00\xf7\x00\x00\x00\x00\x00\x80...|no_image_available_small.gif|2e1ef41a-c08a-4ff6-8ada-bde58b64a712|2008-03-11 |10:01:36.827000+00:00|
|3|708|Sport-100 Helmet, Black|HL-U509|Black|13.0863|34.99|None|None|35|33|2005-07-01 00:00:00+00:00|None|None|b'GIF89aP\x001\x00\xf7\x00\x00\x00\x00\x00\x80...|no_image_available_small.gif|a25a44fb-c2de-4268-958f-110b8d7621e2|2008-03-11 |10:01:36.827000+00:00|
|4|709|Mountain Bike Socks, M|SO-B909-M|White|3.3963|9.50|M|None|27|18|2005-07-01 00:00:00+00:00|2006-06-30 00:00:00+00:00|None|b'GIF89aP\x001\x00\xf7\x00\x00\x00\x00\x00\x80...|no_image_available_small.gif|18f95f47-1540-4e02-8f1f-cc1bcb6828d0|2008-03-11 |10:01:36.827000+00:00|

```python
df = dataflow.to_pandas_dataframe()
df.dtypes
```

Sample output:
```
ProductID                                     int64
Name                                         object
ProductNumber                                object
Color                                        object
StandardCost                                float64
ListPrice                                   float64
Size                                         object
Weight                                      float64
ProductCategoryID                             int64
ProductModelID                                int64
SellStartDate             datetime64[ns, UTC+00:00]
SellEndDate                                  object
DiscontinuedDate                             object
ThumbNailPhoto                               object
ThumbnailPhotoFileName                       object
rowguid                                      object
ModifiedDate              datetime64[ns, UTC+00:00]
dtype: object
```

## Use Azure Data Lake Storage
There are two ways the SDK can acquire the necessary OAuth token to access Azure Data Lake Storage:
-	Retrieve the access token from a recent login session of the user's Azure CLI login
-	Use a service principal (SP) and a certificate as secret

### Use an access token from a recent Azure CLI session
On your local machine, run the following command:

> [!NOTE] 
> If your user account is a member of more than one Azure tenant, you need to specify the tenant in the AAD URL hostname form.


For example:
```azurecli
az login
az account show --query tenantId
dataflow = read_csv(path = DataLakeDataSource(path='adl://dpreptestfiles.azuredatalakestore.net/farmers-markets.csv', tenant='microsoft.onmicrosoft.com')) head = dataflow.head(5) head
```
### Create a service principal with the Azure CLI
You can use the Azure CLI to create a service principal and the corresponding certificate. This particular service principal is configured as Reader, with its scope reduced to only the Azure Data Lake Storage account 'dpreptestfiles'.  For example:
```azurecli
az account set --subscription "Data Wrangling development"
az ad sp create-for-rbac -n "SP-ADLS-dpreptestfiles" --create-cert --role reader --scopes /subscriptions/35f16a99-532a-4a47-9e93-00305f6c40f2/resourceGroups/dpreptestfiles/providers/Microsoft.DataLakeStore/accounts/dpreptestfiles
```
This command emits the `appId` and the path to the certificate file (usually in the home folder). The .crt file contains both the public cert and the private key in PEM format.

Extract the thumbprint:
```
openssl x509 -in adls-dpreptestfiles.crt -noout -fingerprint
```

To configure the ACL for the Azure Data Lake Storage file system, use the objectId of the user or, for this example, the service principal. For example:
```azurecli
az ad sp show --id "8dd38f34-1fcb-4ff9-accd-7cd60b757174" --query objectId
```

To configure `Read` and `Execute` access for the Azure Data Lake Storage file system, you need to configure the ACL for folders and files individually. This is due to the fact that the underlying HDFS ACL model doesn't support inheritance. For example:
```azurecli
az dls fs access set-entry --account dpreptestfiles --acl-spec "user:e37b9b1f-6a5e-4bee-9def-402b956f4e6f:r-x" --path /
az dls fs access set-entry --account dpreptestfiles --acl-spec "user:e37b9b1f-6a5e-4bee-9def-402b956f4e6f:r--" --path /farmers-markets.csv
```
```
certThumbprint = 'C2:08:9D:9E:D1:74:FC:EB:E9:7E:63:96:37:1C:13:88:5E:B9:2C:84'
certificate = ''
with open('./data/adls-dpreptestfiles.crt', 'rt', encoding='utf-8') as crtFile:
    certificate = crtFile.read()

servicePrincipalAppId = "8dd38f34-1fcb-4ff9-accd-7cd60b757174"
```
### Acquire an OAuth access token
Use the `adal` package (via: `pip install adal`) to create an authentication context on the MSFT tenant and acquire an OAuth access token. For ADLS, the resource in the token request must be for 'https://datalake.azure.net', which is different from most other Azure resources.

```python
import adal
from azureml.dataprep.api.datasources import DataLakeDataSource

ctx = adal.AuthenticationContext('https://login.microsoftonline.com/microsoft.onmicrosoft.com')
token = ctx.acquire_token_with_client_certificate('https://datalake.azure.net/', servicePrincipalAppId, certificate, certThumbprint)
dataflow = dprep.read_csv(path = DataLakeDataSource(path='adl://dpreptestfiles.azuredatalakestore.net/farmers-markets.csv', accessToken=token['accessToken']))
dataflow.to_pandas_dataframe().head()
```

||FMID|MarketName|Website|street|city|County|
|----|------|-----|----|----|----|----|
|0|1012063|Caledonia Farmers Market Association - Danville|https://sites.google.com/site/caledoniafarmers... ||Danville|Caledonia|
|1|1011871|Stearns Homestead Farmers' Market|http://Stearnshomestead.com |6975 Ridge Road|Parma|Cuyahoga|
|2|1011878|100 Mile Market|http://www.pfcmarkets.com |507 Harrison St|Kalamazoo|Kalamazoo|
|3|1009364|106 S. Main Street Farmers Market|http://thetownofsixmile.wordpress.com/ |106 S. Main Street|Six Mile|||
|4|1010691|10th Steet Community Farmers Market|http://agrimissouri.com/mo-grown/grodetail.php... |10th Street and Poplar|Lamar|Barton|
