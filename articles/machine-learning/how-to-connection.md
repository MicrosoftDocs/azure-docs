---
title: Create connections to external data sources (preview)
titleSuffix: Azure Machine Learning
description: Learn how to use connections to connect to External data sources for training with Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.author: ambadal
author: AmarBadal
ms.reviewer: franksolomon
ms.date: 04/18/2023
ms.custom: data4ml

# Customer intent: As an experienced data scientist with Python skills, I have data located in external sources outside of Azure. I need to make that data available to the Azure Machine Learning platform, to train my machine learning models.
---

# Create connections (preview)

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

In this article, learn how to connect to data sources located outside of Azure, to make that data available to Azure Machine Learning services. For this data availability, Azure supports connections to these external sources:
- Snowflake DB
- Amazon S3
- Azure SQL DB

[!INCLUDE [machine-learning-preview-generic-disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

- The [Azure Machine Learning SDK for Python](https://aka.ms/sdk-v2-install).

- An Azure Machine Learning workspace.

> [!IMPORTANT]
> An Azure Machine Learning connection securely stores the credentials passed during connection creation in the Workspace Azure Key Vault. A connection references the credentials from the key vault storage location for further use. You won't need to directly deal with the credentials after they are stored in the key vault. You have the option to store the credentials in the YAML file. A CLI command or SDK can override them. We recommend that you **avoid** credential storage in a YAML file, because a security breach could lead to a credential leak.

> [!NOTE]
> For a successful data import, please verify that you have installed the latest azure-ai-ml package (version 1.5.0 or later) for SDK, and the ml extension (version 2.15.1 or later).  
> 
> If you have an older SDK package or CLI extension, please remove the old one and install the new one with the code shown in the tab section. Follow the instructions for SDK and CLI below:

### Code versions

# [SDK](#tab/SDK)

```python
pip uninstall azure-ai-ml
pip install azure-ai-ml
pip show azure-ai-ml #(the version value needs to be 1.5.0 or later)
```

# [CLI](#tab/CLI)

```cli
az extension remove -n ml
az extension add -n ml --yes
az extension show -n ml #(the version value needs to be 2.15.1 or later)
```

---

## Create a Snowflake DB connection

# [CLI: Username/password](#tab/cli-username-password)
This YAML file creates a Snowflake DB connection. Be sure to update the appropriate values:

```yaml
# my_snowflakedb_connection.yaml
$schema: http://azureml/sdk-2-0/Connection.json
type: snowflake
name: my_snowflakedb_connection # add your datastore name here

target: jdbc:snowflake://<myaccount>.snowflakecomputing.com/?db=<mydb>&warehouse=<mywarehouse>&role=<myrole>
# add the Snowflake account, database, warehouse name and role name here. If no role name provided it will default to PUBLIC
credentials:
    type: username_password
    username: <username> # add the Snowflake database user name here or leave this blank and type in CLI command line
    password: <password> # add the Snowflake database password here or leave this blank and type in CLI command line
```

Create the Azure Machine Learning connection in the CLI:

### Option 1: Use the username and password in YAML file

```azurecli
az ml connection create --file my_snowflakedb_connection.yaml
```

### Option 2: Override the username and password at the command line

```azurecli
az ml connection create --file my_snowflakedb_connection.yaml --set credentials.username="XXXXX" credentials.password="XXXXX" 
```

# [Python SDK: username/ password](#tab/sdk-username-password)

### Option 1: Load connection from YAML file

```python
from azure.ai.ml import MLClient, load_workspace_connection

ml_client = MLClient.from_config()

wps_connection = load_workspace_connection(source="./my_snowflakedb_connection.yaml")
wps_connection.credentials.username="XXXXX"
wps_connection.credentials.password="XXXXXXXX"
ml_client.connections.create_or_update(workspace_connection=wps_connection)

```

### Option 2: Use WorkspaceConnection() in a Python script

```python
from azure.ai.ml import MLClient
from azure.ai.ml.entities import WorkspaceConnection
from azure.ai.ml.entities import UsernamePasswordConfiguration

target= "jdbc:snowflake://<myaccount>.snowflakecomputing.com/?db=<mydb>&warehouse=<mywarehouse>&role=<myrole>"
# add the Snowflake account, database, warehouse name and role name here. If no role name provided it will default to PUBLIC
name= <my_snowflake_connection> # name of the connection
wps_connection = WorkspaceConnection(name= name,
type="snowflake",
target= target,
credentials= UsernamePasswordConfiguration(username="XXXXX", password="XXXXXX")
)

ml_client.connections.create_or_update(workspace_connection=wps_connection)

```

---

## Create an Azure SQL DB connection

# [CLI: Username/password](#tab/cli-sql-username-password)

This YAML script creates an Azure SQL DB connection. Be sure to update the appropriate values:

```yaml
# my_sqldb_connection.yaml
$schema: http://azureml/sdk-2-0/Connection.json

type: azuresqldb
name: my_sqldb_connection

target: Server=tcp:<myservername>,<port>;Database=<mydatabase>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30
# add the sql servername, port addresss and database
credentials:
    type: sql_auth
    username: <username> # add the sql database user name here or leave this blank and type in CLI command line
    password: <password> # add the sql database password here or leave this blank and type in CLI command line
```

Create the Azure Machine Learning connection in the CLI:

### Option 1: Use the username / password from YAML file

```azurecli
az ml connection create --file my_sqldb_connection.yaml
```

### Option 2: Override the username and password in YAML file

```azurecli
az ml connection create --file my_sqldb_connection.yaml --set credentials.username="XXXXX" credentials.password="XXXXX" 
```

# [Python SDK: username/ password](#tab/sdk-sql-username-password)

### Option 1: Load connection from YAML file

```python
from azure.ai.ml import MLClient, load_workspace_connection

ml_client = MLClient.from_config()

wps_connection = load_workspace_connection(source="./my_sqldb_connection.yaml")
wps_connection.credentials.username="XXXXXX"
wps_connection.credentials.password="XXXXXxXXX"
ml_client.connections.create_or_update(workspace_connection=wps_connection)

```

### Option 2: Using WorkspaceConnection()

```python
from azure.ai.ml import MLClient
from azure.ai.ml.entities import WorkspaceConnection
from azure.ai.ml.entities import UsernamePasswordConfiguration

target= "Server=tcp:<myservername>,<port>;Database=<mydatabase>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
# add the sql servername, port addresss and database

name= <my_sql_connection> # name of the connection
wps_connection = WorkspaceConnection(name= name,
type="azure_sql_db",
target= target,
credentials= UsernamePasswordConfiguration(username="XXXXX", password="XXXXXX")
)

ml_client.connections.create_or_update(workspace_connection=wps_connection)

```

---

## Create Amazon S3 connection

# [CLI: Access key](#tab/cli-s3-access-key)

Create an Amazon S3 connection with the following YAML file. Be sure to update the appropriate values:

```yaml
# my_s3_connection.yaml
$schema: http://azureml/sdk-2-0/Connection.json

type: s3
name: my_s3_connection

target: https://<mybucket>.amazonaws.com # add the s3 bucket details
credentials:
    type: access_key
    access_key_id: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX # add access key id
    secret_access_key: XxXxXxXXXXXXXxXxXxxXxxXXXXXXXXxXxxXXxXXXXXXXxxxXxXXxXXXXXxXXxXXXxXxXxxxXXxXXxXXXXXxXxxXX # add access key secret
```

Create the Azure Machine Learning connection in the CLI:

```azurecli
az ml connection create --file my_s3_connection.yaml
```

# [Python SDK: Access key](#tab/sdk-s3-access-key)

### Option 1: Load connection from YAML file

```python
from azure.ai.ml import MLClient, load_workspace_connection

ml_client = MLClient.from_config()


wps_connection = load_workspace_connection(source="./my_s3_connection.yaml")
ml_client.connections.create_or_update(workspace_connection=wps_connection)

```

### Option 2: Use WorkspaceConnection() in a Python script

```python
from azure.ai.ml import MLClient
from azure.ai.ml.entities import WorkspaceConnection
from azure.ai.ml.entities import AccessKeyConfiguration

target = "https://<mybucket>.amazonaws.com" # add the s3 bucket details
name=<my_s3_connection> # name of the connection
wps_connection = WorkspaceConnection(name=name,
type="s3",
target= target,
credentials= AccessKeyConfiguration(access_key_id="XXXXXX",acsecret_access_key="XXXXXXXX")
)

ml_client.connections.create_or_update(workspace_connection=wps_connection)

```
---

## Next steps

- [Import data assets](how-to-import-data-assets.md)