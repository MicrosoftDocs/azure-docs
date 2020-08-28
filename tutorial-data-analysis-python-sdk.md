---
title: Tutorial: Use Python and Azure Database for MySQL - Single Server SDK
description: Use python and Azure Database for MySQL Single Server SDK for data analysis
services: mysql
ms.service: mysql
ms.topic: tutorial
author: mksuni
ms.author: sumuth
ms.date: 09/22/2020
---

# Python + Azure Database for MySQL Single Server

[Azure Database for MySQL Single Server](https://docs.microsoft.com/azure/mysql/) and [Python](https://www.r-project.org/about.html) can be used together for data analysis – MySQL as database engine and Python as statistical tool. When dealing with large datasets that potentially exceed the memory of your machine it is recommended to push the data into database engine, where you can query the data in smaller digestible chunks.

In this article we will learn how to use Python to perform the following tasks:

- Create Azure Database for MySQL using [azure python sdk](https://github.com/Azure/azure-sdk-for-python)
- Connect to Azure Database for MySQL using [pymysql](https://pymysql.readthedocs.io/en/latest/)
- Create databases and tables
- Load data from csv file into a table
- Query data from table
- Visualize data from table using [plotnine](https://plotnine.readthedocs.io/en/stable/)
- Delete Azure Database for MySQL server using [azure python sdk](https://github.com/Azure/azure-sdk-for-python)


``bash`
# pip install azure plotnine passgen pymysql adal wget tempfile

from azure.mgmt.resource import ResourceManagementClient

from msrestazure.azure\_active\_directory import AADTokenCredentials

from azure.mgmt.resource.resources.models import DeploymentMode

import adal, json, requests, pymysql, passgen, warnings, wget, os, tempfile

from plotnine import ggplot, geom\_point, aes, stat\_smooth, facet\_wrap

from plotnine.data import mtcars

from io import StringIO

import pandas.io.sql as sqlio

defauthenticate\_device\_code():

# Replace values with your client and tenant id

tenant =&#39;00000000-0000-0000-0000-000000000000&#39;

client\_id =&#39;00000000-0000-0000-0000-000000000000&#39;

authority\_host\_uri =&#39;https://login.microsoftonline.com&#39;

authority\_uri = authority\_host\_uri +&#39;/&#39;+ tenant

resource\_uri =&#39;https://management.core.windows.net/&#39;

context = adal.AuthenticationContext(authority\_uri, api\_version=None)

code = context.acquire\_user\_code(resource\_uri, client\_id)

print(code[&#39;message&#39;])

mgmt\_token = context.acquire\_token\_with\_device\_code(resource\_uri, code, client\_id)

credentials = AADTokenCredentials(mgmt\_token, client\_id)

return credentials

if \_\_name\_\_ ==&#39;\_\_main\_\_&#39;:

# Initialize parameters

# Replace with your subscription id

subscription\_id =&quot;00000000-0000-0000-0000-000000000000&quot;

resource\_group =&quot;test\_group&quot;

location =&quot;southcentralus&quot;

mysql\_username =&quot;azureuser&quot;

mysql\_password = passgen.passgen(length=12, punctuation=False, digits=True, letters=True, case=&#39;both&#39;)

mysql\_servername =&quot;testserver&quot;

# Other ways to obtain credentials : https://github.com/Azure-Samples/data-lake-analytics-python-auth-options/blob/master/sample.py

credentials = authenticate\_device\_code()

client = ResourceManagementClient(credentials, subscription\_id)

# Create Resource group

print(&quot;\nCreating Resource Group&quot;,&quot;\n&quot;)

client.resource\_groups.create\_or\_update(resource\_group,{&quot;location&quot;: location})

# Create MySQL Server using ARM template

print(&quot;Creating Azure Database for MySQL Server&quot;,&quot;\n&quot;)

template = json.loads(requests.get(&quot;https://raw.githubusercontent.com/Azure/azure-mysql/master/arm-templates/ExampleWithFirewallRule/tem...)

parameters ={

&#39;administratorLogin&#39;: mysql\_username,

&#39;administratorLoginPassword&#39;: mysql\_password,

&#39;location&#39;: location,

&#39;serverName&#39;: mysql\_servername,

&#39;skuCapacity&#39;:2,

&#39;skuFamily&#39;:&#39;Gen5&#39;,

&#39;skuName&#39;:&#39;GP\_Gen5\_2&#39;,

&#39;skuSizeMB&#39;:51200,

&#39;skuTier&#39;:&#39;GeneralPurpose&#39;,

&#39;version&#39;:&#39;5.7&#39;,

&#39;backupRetentionDays&#39;:7,

&#39;geoRedundantBackup&#39;:&#39;Disabled&#39;

}

parameters ={k:{&#39;value&#39;: v}for k, v in parameters.items()}

deployment\_properties ={

&#39;mode&#39;: DeploymentMode.incremental,

&#39;template&#39;: template,

&#39;parameters&#39;: parameters

}

deployment\_async\_operation = client.deployments.create\_or\_update(

resource\_group,

&#39;azure-mysql-sample&#39;,

deployment\_properties

)

deployment\_async\_operation.wait()

# Download SSL cert

print(&quot;Downloading SSL cert&quot;,&quot;\n&quot;)

certpath = os.path.join(tempfile.gettempdir(),&quot;BaltimoreCyberTrustRoot.crt&quot;)

os.remove(certpath)

wget.download(&quot;https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem&quot;, certpath, bar=None)

# Connect to mysql database using pymysql

print(&quot;Connecting to Azure Database for MySQL Server&quot;,&quot;\n&quot;)

try:

connection = pymysql.connect(user = mysql\_username +&#39;@&#39;+ mysql\_servername,

password = mysql\_password,

host = mysql\_servername +&quot;.mysql.database.azure.com&quot;,

port =3306,

db =&quot;mysql&quot;,

cursorclass=pymysql.cursors.DictCursor,

autocommit=True,

ssl={&#39;ca&#39;: certpath})

cursor = connection.cursor()

# Print MySQL version

cursor.execute(&quot;SELECT version();&quot;)

record = cursor.fetchone()

print(&quot;You are connected to - &quot;, record,&quot;\n&quot;)

# create database mtcars and connect to it

print(&quot;Creating database mtcars&quot;,&quot;\n&quot;)

cursor.execute(&quot;CREATE DATABASE mtcars&quot;)

connection = pymysql.connect(user = mysql\_username +&#39;@&#39;+ mysql\_servername,

password = mysql\_password,

host = mysql\_servername +&quot;.mysql.database.azure.com&quot;,

port =3306,

db =&quot;mtcars&quot;,

local\_infile=1,

cursorclass=pymysql.cursors.DictCursor,

autocommit=True,

ssl={&#39;ca&#39;: certpath})

cursor = connection.cursor()

# Create mtcars table

print(&quot;Creating table mtcars&quot;,&quot;\n&quot;)

create\_table\_query =&#39;&#39;&#39;CREATE TABLE mtcars (

name VARCHAR(50) NOT NULL,

mpg FLOAT NOT NULL,

cyl INTEGER NOT NULL,

disp FLOAT NOT NULL,

hp INTEGER NOT NULL,

drat FLOAT NOT NULL,

wt FLOAT NOT NULL,

qsec FLOAT NOT NULL,

vs INTEGER NOT NULL,

am INTEGER NOT NULL,

gear INTEGER NOT NULL,

carb INTEGER NOT NULL

);&#39;&#39;&#39;

cursor.execute(create\_table\_query)

# Load mtcars data from csv file

print(&quot;Loading data into table mtcars&quot;,&quot;\n&quot;)

mtcars.to\_csv(&quot;mtcars.csv&quot;, index=False, header=False)

cursor.execute(&quot;LOAD DATA LOCAL INFILE &#39;mtcars.csv&#39; INTO TABLE mtcars FIELDS TERMINATED BY &#39;,&#39;;&quot;)

os.remove(&quot;mtcars.csv&quot;)

# read mtcars data from MySQL into a pandas dataframe

print(&quot;Reading data from mtcars table into a pandas dataframe&quot;,&quot;\n&quot;)

mtcars\_data = sqlio.read\_sql\_query(&quot;select \* from mtcars&quot;, connection)

# visualize the data using ggplot

print(&quot;Visualizing data from mtcars table&quot;,&quot;\n&quot;)

plot =(ggplot(mtcars\_data, aes(&#39;wt&#39;,&#39;mpg&#39;, color=&#39;factor(gear)&#39;))

+ geom\_point()

+ stat\_smooth(method=&#39;lm&#39;)

+ facet\_wrap(&#39;~gear&#39;))

# We run this to suppress various deprecation warnings from plotnine - keeps our output cleaner

warnings.filterwarnings(&#39;ignore&#39;)

# Save the plot as pdf file

print(&quot;Saving plot as PDF file&quot;,&quot;\n&quot;)

plot.save(&quot;mtcars.pdf&quot;)

except(Exception, pymysql.Error)as error :

print(&quot;Error while connecting to MySQL&quot;, error)

finally:

#closing database connection.

if(connection):

cursor.close()

connection.close()

print(&quot;MySQL connection is closed&quot;,&quot;\n&quot;)

# Delete Resource group and everything in it

print(&quot;Deleting Resource Group&quot;,&quot;\n&quot;)

delete\_async\_operation = client.resource\_groups.delete(resource\_group)

delete\_async\_operation.wait()

print(&quot;Deleted: {}\n&quot;.format(resource\_group))

```
