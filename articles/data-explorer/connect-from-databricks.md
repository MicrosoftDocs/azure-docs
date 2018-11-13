# Connecting to Azure Data Explorer from Azure Databricks using Python

This article shows you how to use Python library in Azure Databricks to access data from Azure Data Explorer (ADX). There are several ways to authenticate with ADX including device login using your AAD account and ADD App.

## Prerequisites

- [Create an Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-database-portal)
- [Create an Azure Databricks workspace](/azure/azure-databricks/quickstart-create-databricks-workspace-portal#create-an-azure-databricks-workspace)
  - Under **Azure Databricks Service**, in the **Pricing Tier** dropdown, select **Premium**. This allows you to use Azure Databricks secrets to store your credentials and reference them in notebooks and jobs.
- [Create a cluster](https://docs.azuredatabricks.net/user-guide/clusters/create.html) in Azure Databricks with the following specifications:

![Create cluster](media/connect-from-databricks/databricks-create-cluster.png)

## Install Python library on your Azure Databricks cluster

To install [Python library](/azure/kusto/api/python/kusto-python-client-library) on your Azure Databricks cluster:

1. Go to your Azure Databricks workspace and [Create a Library](https://docs.azuredatabricks.net/user-guide/libraries.html#create-a-library)
2. [Upload a Python PyPI package or Python Egg](https://docs.azuredatabricks.net/user-guide/libraries.html#upload-a-python-pypi-package-or-python-egg) 
    - Upload, install, and attach the library to your cluster.
    - Enter the PyPi name: *azure-kusto-data*

## Connect to Azure Data Explorer using device login

[Import](https://docs.azuredatabricks.net/user-guide/notebooks/notebook-manage.html#import-a-notebook) a Notebook using this sample notebook to connect to ADX using your credentials.

## Connect to Azure Data Explorer using AAD App

1. Create AAD App by [Provisioning an AAD application](/azure/kusto/management/access-control/how-to-provision-aad-app).
1. Grant access to your AAD App on your Azure Data Explorer database as follows:

```kusto
.set database <DB Name> users ('aadapp=<AAD App ID>;<AAD Tenant ID>') 'AAD App to connect Spark to ADX
```

| ```DB Name``` | your database name |
| --- | --- |
| ```AAD App ID``` | your AAD App ID |
| ```AAD Tenant ID``` | your AAD Tenant ID |

To find your AAD Tenant ID:

- Use the following URL, substituting **YourDomain** with your domain name: https://login.windows.net/YourDomain/.well-known/openid-configuration/
For example: If your domain is contoso.com, the URL is: [https://login.windows.net/contoso.com/.well-known/openid-configuration/](https://login.windows.net/contoso.com/.well-known/openid-configuration/)
- Enter your URL to see the following results:
&quot;authorization\_endpoint&quot;:[https://login.windows. net/6babcaad-604b-40ac-a9d7-9fd97c0b779f/oauth2/authorize](https://login.windows.net/6babcaad-604b-40ac-a9d7-9fd97c0b779f/oauth2/authorize)
- Your tenant ID is **6babcaad-604b-40ac-a9d7-9fd97c0b779f**

3. Store and secure your AAD App ID and Key using Azure Databricks [Secrets](https://docs.azuredatabricks.net/user-guide/secrets/index.html#secrets) 

    1. In [Databricks CLI](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html#databricks-cli), [Set up the CLI](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html#set-up-the-cli), [Install the CLI](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html#install-the-cli) and [Set up authentication](https://docs.azuredatabricks.net/user-guide/dev-tools/databricks-cli.html#set-up-authentication).

    1. Configure the [Secrets](https://docs.azuredatabricks.net/user-guide/secrets/index.html#secrets) using the following sample commands:

```databricks secrets create-scope --scope adx```

```databricks secrets put --scope adx --key myaadappid```

```databricks secrets put --scope adx --key myaadappkey```

```databricks secrets list --scope adx```

4. [Import](https://docs.azuredatabricks.net/user-guide/notebooks/notebook-manage.html#import-a-notebook) a Notebook using this sample notebook to connect to ADX and update the placeholder values with your cluster name, database name, and AAD Tenant ID.