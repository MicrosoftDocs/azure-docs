---
title: 'Quickstart: Your first Python query'
description: In this quickstart, you follow the steps to enable the Resource Graph library for Python and run your first query.
ms.date: 10/01/2021
ms.topic: quickstart
ms.custom: devx-track-python, mode-api
---
# Quickstart: Run your first Resource Graph query using Python

The first step to using Azure Resource Graph is to check that the required libraries for Python are
installed. This quickstart walks you through the process of adding the libraries to your Python
installation.

At the end of this process, you'll have added the libraries to your Python installation and run your
first Resource Graph query.

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Add the Resource Graph library

To enable Python to query Azure Resource Graph, the library must be added. This library works
wherever Python can be used, including [bash on Windows 10](/windows/wsl/install-win10) or locally
installed.

1. Check that the latest Python is installed (at least **3.8**). If it isn't yet installed, download
   it at [Python.org](https://www.python.org/downloads/).

1. Check that the latest Azure CLI is installed (at least **2.5.1**). If it isn't yet installed, see
   [Install the Azure CLI](/cli/azure/install-azure-cli).

   > [!NOTE]
   > Azure CLI is required to enable Python to use the **CLI-based authentication** in the following
   > examples. For information about other options, see
   > [Authenticate using the Azure management libraries for Python](/azure/developer/python/sdk/authentication-overview).

1. Authenticate through Azure CLI.

   ```azurecli
   az login
   ```

1. In your Python environment of choice, install the required libraries for Azure Resource Graph:

   ```bash
   # Add the Resource Graph library for Python
   pip install azure-mgmt-resourcegraph

   # Add the Resources library for Python
   pip install azure-mgmt-resource

   # Add the CLI Core library for Python for authentication (development only!)
   pip install azure-cli-core

   # Add the Azure identity library for Python
   pip install azure.identity
   ```

   > [!NOTE]
   > If Python is installed for all users, these commands must be run from an elevated console.

1. Validate that the libraries have been installed. `azure-mgmt-resourcegraph` should be **2.0.0**
   or higher, `azure-mgmt-resource` should be **9.0.0** or higher, and `azure-cli-core` should be
   **2.5.0** or higher.

   ```bash
   # Check each installed library
   pip show azure-mgmt-resourcegraph azure-mgmt-resource azure-cli-core azure.identity
   ```

## Run your first Resource Graph query

With the Python libraries added to your environment of choice, it's time to try out a simple
subscription-based Resource Graph query. The query returns the first five Azure resources with the
**Name** and **Resource Type** of each resource. To query by
[management group](../management-groups/overview.md), use the `management_groups` parameter with
`QueryRequest`.

1. Run your first Azure Resource Graph query using the installed libraries and the `resources`
   method:

   ```python
   # Import Azure Resource Graph library
   import azure.mgmt.resourcegraph as arg

   # Import specific methods and models from other libraries
   from azure.mgmt.resource import SubscriptionClient
   from azure.identity import AzureCliCredential

   # Wrap all the work in a function
   def getresources( strQuery ):
       # Get your credentials from Azure CLI (development only!) and get your subscription list
       credential = AzureCliCredential()
       subsClient = SubscriptionClient(credential)
       subsRaw = []
       for sub in subsClient.subscriptions.list():
           subsRaw.append(sub.as_dict())
       subsList = []
       for sub in subsRaw:
           subsList.append(sub.get('subscription_id'))

       # Create Azure Resource Graph client and set options
       argClient = arg.ResourceGraphClient(credential)
       argQueryOptions = arg.models.QueryRequestOptions(result_format="objectArray")

       # Create query
       argQuery = arg.models.QueryRequest(subscriptions=subsList, query=strQuery, options=argQueryOptions)

       # Run query
       argResults = argClient.resources(argQuery)

       # Show Python object
       print(argResults)

   getresources("Resources | project name, type | limit 5")
   ```

   > [!NOTE]
   > As this query example does not provide a sort modifier such as `order by`, running this query
   > multiple times is likely to yield a different set of resources per request.

1. Update the call to `getresources` and change the query to `order by` the **Name** property:

   ```python
   getresources("Resources | project name, type | limit 5 | order by name asc")
   ```

   > [!NOTE]
   > Just as with the first query, running this query multiple times is likely to yield a different
   > set of resources per request. The order of the query commands is important. In this example,
   > the `order by` comes after the `limit`. This command order first limits the query results and
   > then orders them.

1. Update the call to `getresources` and change the query to first `order by` the **Name** property
   and then `limit` to the top five results:

   ```python
   getresources("Resources | project name, type | order by name asc | limit 5")
   ```

When the final query is run several times, assuming that nothing in your environment is changing,
the results returned are consistent and ordered by the **Name** property, but still limited to the
top five results.

## Clean up resources

If you wish to remove the installed libraries from your Python environment, you can do so by using
the following command:

```bash
# Remove the installed libraries from the Python environment
pip uninstall azure-mgmt-resourcegraph azure-mgmt-resource azure-cli-core azure.identity
```

## Next steps

In this quickstart, you've added the Resource Graph libraries to your Python environment and run
your first query. To learn more about the Resource Graph language, continue to the query language
details page.

> [!div class="nextstepaction"]
> [Get more information about the query language](./concepts/query-language.md)
