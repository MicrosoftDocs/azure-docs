---
title: Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel
description: Walk through the Getting Started Guide For Microsoft Sentinel ML Notebooks to learn the basics of Microsoft Sentinel notebooks with MSTICPy and queries.
author: austinmccollum
ms.author: austinmc
ms.topic: how-to
ms.date: 01/09/2023
---

# Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel

This article describes how to run the **Getting Started Guide For Microsoft Sentinel ML Notebooks** notebook, which sets up basic configurations for running Jupyter notebooks in Microsoft Sentinel and running simple data queries.

The **Getting Started Guide for Microsoft Sentinel ML Notebooks** notebook uses MSTICPy, a Python library of Cybersecurity tools built by Microsoft, which provides threat hunting and investigation functionality.

MSTICPy reduces the amount of code that customers need to write for Microsoft Sentinel, and provides:

- Data query capabilities, against Microsoft Sentinel tables, Microsoft Defender for Endpoint, Splunk, and other data sources.
- Threat intelligence lookups with TI providers, such as VirusTotal and AlienVault OTX.
- Enrichment functions like geolocation of IP addresses, Indicator of Compromise (IoC) extraction, and WhoIs lookups.
- Visualization tools using event timelines, process trees, and geo mapping.
- Advanced analyses, such as time series decomposition, anomaly detection, and clustering.

The steps in this article describe how to run the **Getting Started Guide for Microsoft Sentinel ML Notebooks** notebook in your Azure ML workspace via Microsoft Sentinel. You can also use this article as guidance for performing similar steps to run notebooks in other environments, including locally.

For more information, see [Use notebooks to power investigations](hunting.md#use-notebooks-to-power-investigations) and [Use Jupyter notebooks to hunt for security threats](notebooks.md).

> [!NOTE]
> Several Microsoft Sentinel notebooks do not use MSTICPy, such as the **Credential Scanner** notebooks, or the PowerShell and C# examples. Notebooks that do not use MSTICpy do not need the MSTICPy configuration described in this article.
>

## Prerequisites

- To use notebooks in Microsoft Sentinel, make sure that you have the required permissions. For more information, see [Manage access to Microsoft Sentinel notebooks](notebooks.md#manage-access-to-microsoft-sentinel-notebooks).

- To perform the steps in this article, you'll need Python 3.6 or later. In Azure ML you can use either a Python 3.8 kernel (recommended) or a Python 3.6 kernel.

- This notebook uses the [MaxMind GeoLite2](https://www.maxmind.com) geolocation lookup service for IP addresses. To use the MaxMind GeoLite2 service, you'll need an account key. You can sign up for a free account and key at the [Maxmind signup page](https://www.maxmind.com/en/geolite2/signup).

- This notebook uses [VirusTotal](https://www.virustotal.com) (VT) as a threat intelligence source. To use VirusTotal threat intelligence lookup, you'll need a VirusTotal account and API key.

    You can sign up for a free VT account at the [VirusTotal getting started page](https://developers.virustotal.com/v3.0/reference#getting-started). If you're already a VirusTotal user, you can use your existing key.

    > [!WARNING]
    > If you're using a VT enterprise key, store it in Azure Key Vault instead of the **msticpyconfig.yaml** file. For more information, see [Specify secrets as Key Vault secrets](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html#specifying-secrets-as-key-vault-secrets) in the MSTICPY documentation.
    >
    > If you don’t want to set up an Azure Key Vault right now, sign up for and use a free account until you can set up Key Vault storage.

## Run and initialize the Getting Started Guide notebook

This procedure describes how to launch your notebook and initialize MSTICpy.

1. In Microsoft Sentinel, select **Notebooks** from the left.

1. From the **Templates** tab, select **A Getting Started Guide For Microsoft Sentinel ML Notebooks** > **Save notebook** to save it to your Azure ML workspace.

    Select **Launch notebook** to run the notebook. The notebook contains a series of cells:

    - *Markdown* cells contain text and graphics with instructions for using the notebook
    - *Code* cells contain executable code that perform the notebook functions

    **Reading and running code cells**

    Read and run the code cells in order. Skipping cells or running them out of order may cause errors later in the notebook.

    Run each cell by selecting the play button to the left of each cell. Depending on the function being performed, the code in the cell may run very quickly, or it may take a few seconds to complete.

    When running, the play button changes to a loading spinner, and a status of `Executing` is displayed at the bottom of the cell, together with the elapsed time.

    > [!TIP]
    > If your notebook doesn't seem to be working as described, restart the kernel and run the notebook from the beginning. For example, if any cell in the **Getting Started Guide** notebook takes longer than a minute to run, try restarting the kernel and re-running the notebook.
    >
    > The **Getting Started Guide** notebook includes instructions for the basic use of Jupyter notebooks, including restarting the Jupyter kernel.
    >

    After you've completed reading and running the cells in the **What is a Jupyter Notebook** section, you're ready to start the configuration tasks, beginning in the **Setting up the notebook environment** section.

1. Run the first code cell in the **Setting up the notebook environment** section of your notebook, which includes the following code:

    ```python
    # import some modules needed in this cell
    from pathlib import Path
    from IPython.display import display, HTML

    REQ_PYTHON_VER="3.6"
    REQ_MSTICPY_VER="1.2.3"

    display(HTML("Checking upgrade to latest msticpy version"))
    %pip install --upgrade --quiet msticpy[azuresentinel]>=$REQ_MSTICPY_VER

    # intialize msticpy
    from msticpy.nbtools import nbinit
    nbinit.init_notebook(
    namespace=globals(),
    extra_imports=["urllib.request, urlretrieve"]
    )
    pd.set_option("display.html.table_schema", False)
    ```

    The initialization status is shown in the output. Configuration warnings about missing settings in the `Missing msticpyconfig.yaml` file are expected because you haven't configured anything yet.

> [!NOTE]
> Most Microsoft Sentinel notebooks start with a MSTICpy initialization cell that:
>
> - Defines the minimum versions for Python and MSTICPy the notebook requires.
> - Ensures that the latest version of MSTICPy is installed.
> - Imports and runs the `init_notebook` function.
>

## Create your configuration file

After the basic initialization, you're ready to create your configuration file with basic settings for working with MSTICPy.

Many Microsoft Sentinel notebooks connect to external services such as [VirusTotal](https://www.virustotal.com) (VT) to collect and enrich data. To connect to these services you need to set and store configuration details, such as authentication tokens. Having this data in your configuration file avoids you having to type in authentication tokens and workspace details each time you use a notebook.

MSTICPy uses a **msticpyconfig.yaml** for storing a wide range of configuration details.  By default, a **msticpyconfig.yaml** file is generated by the notebook initialization function. If you [cloned this notebook from the Microsoft Sentinel portal](#run-and-initialize-the-getting-started-guide-notebook), the configuration file will be populated with Microsoft Sentinel workspace data. This data is read from a **config.json** file, created in the Azure ML workspace when you launch your notebook. For more information, see the [MSTICPy Package Configuration documentation](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html).

The following sections describe how to add additional configuration details to the **msticpyconfig.yaml** file.

> [!NOTE]
> If you run the *Getting Started Guide* notebook again, and already have a minimally-configured **msticpyconfig.yaml** file, the `init_notebook` function does not overwrite or modify your existing file.
>

> [!TIP]
> At any point in time, select the **-Help** drop-down menu in the MSTICPy configuration tool for more instructions and links to detailed documentation.
>

### Display the MSTICPy settings editor

1. In a code cell, run the following code to import the `MpConfigEdit` tool and display a settings editor for your **msticpyconfig.yaml** file:

    ```python
    from msticpy.config import MpConfigEdit

    mpedit = MpConfigEdit( "msticpyconfig.yaml")
    mpedit.set_tab("AzureSentinel")
    display(mpedit)
    ```

    For example:

    :::image type="content" source="media/notebook-get-started/msticpy-editor.png" alt-text="Screenshot of the MSTICPy settings editor.":::

    The automatically created **msticpyconfig.yaml** file, shown in the settings editor, contains two entries in the Microsoft Sentinel section. These are both populated with details of the Microsoft Sentinel workspace that the notebook was cloned from. One entry has the name of your workspace and the other is named **Default**.

    MSTICPy allows you to store configurations for multiple Microsoft Sentinel workspaces and switch between them. The **Default** entry allows you to authenticate to your "home" workspace by default, without having to name it explicitly. If you add additional workspaces you can configure any one of them to be the **Default** entry.

    > [!NOTE]
    > In the Azure ML environment, the settings editor might take 10-20 seconds to appear.

1. Verify your current settings and select **Save Settings**.

### Add threat intelligence provider settings

This procedure describes how to store your [VirusTotal API key](#prerequisites) in the **msticpyconfig.yaml** file. You can opt to upload the API key to Azure Key Vault, but you must configure the Key Vault settings first. For more information, see [Configure Key Vault settings](#configure-key-vault-settings).

**To add VirusTotal details in the MSTICPy settings editor**:

1. Enter the following code in a code cell and run:

   ```python
   mpedit.set_tab("TI Providers")
   mpedit
   ```

1. In the **TI Providers** tab, select **Add prov** > **VirusTotal** > **Add**.

1. Under **Auth Key**, select **Text** next to the **Storage** option.

1. In the **Value** field, paste your API key.

1. Select **Update**, and then select **Save Settings** at the bottom of the settings editor.

> [!TIP]
> For more information about other supported threat intelligence providers, see [Threat intelligence providers](https://msticpy.readthedocs.io/en/latest/data_acquisition/TIProviders.html) in the MSTICPy documentation and [Threat intelligence integration in Microsoft Sentinel](threat-intelligence-integration.md).
>
### Add GeoIP provider settings

This procedure describes how to store a [MaxMind GeoLite2 account key](#prerequisites) in the **msticpyconfig.yaml** file, which allows your notebook to use geolocation lookup services for IP addresses.

**To add GeoIP provider settings in the MSTICPy settings editor**:

1. Enter the following code in an empty code cell and run:

   ```python
   mpedit.set_tab("GeoIP Providers")
   mpedit
   ```

1. In the **GeoIP Providers** tab, select **Add prov** > **GeoIPLite** > **Add**.

1. In the **Value** field, enter your MaxMind account key.

1. If needed, update the default **~/.msticpy** folder for storing the downloaded GeoIP database.

    - On Windows, this folder is mapped to the **%USERPROFILE%/.msticpy**.
    - On Linux or macOS, this path is mapped to the **.msticpy** folder in your home folder.

> [!TIP]
> For more information about other supported geolocation lookup services, see the [MSTICPy GeoIP Providers documentation](https://msticpy.readthedocs.io/en/latest/data_acquisition/GeoIPLookups.html).
>

### Configure Azure Cloud settings

If your organization doesn't use the Azure public cloud, you must specify this in your settings to successfully authenticate and use data from Microsoft Sentinel and Azure. For more information, see [Specify the Azure Cloud and default Azure Authentication methods](#specify-the-azure-cloud-and-azure-authentication-methods).

### Validate settings

Select **Validate settings** in the settings editor.

Warning messages about missing configurations are expected, but you shouldn't have any for threat intelligence provider or GeoIP provider settings.

Depending on your environment, you may also need to [Configure Key Vault settings](#configure-key-vault-settings) or [Specify the Azure cloud](#specify-the-azure-cloud-and-azure-authentication-methods).

If you need to make any changes because of the validation, make those changes and then select **Save Settings**.

When you're done, select the **Close** button to hide the validation output.

For more information, see: [Advanced configurations for Jupyter notebooks and MSTICPy in Microsoft Sentinel](notebooks-msticpy-advanced.md)

## Load saved MSTICPy settings

In the [Create your configuration file](#create-your-configuration-file) procedure, you saved your settings to your local **msticpyconfig.yaml** file.

However, MSTICPy doesn't automatically reload these settings until you restart the kernel or run another notebook. To force MSTICPy to reload from the new configuration file, proceed to the next code cell, with the following code, and run it:

```python
import msticpy
msticpy.settings.refresh_config()
```

## Test your notebook

Now that you've initialized your environment and configured basic settings for your workspace, use the MSTICPy `QueryProvider` class to test the notebook. `QueryProvider`  queries a data source, in this case your Microsoft Sentinel workspace, and makes the queried data available to view and analyze in your notebook.

Use the following procedures to create an instance of the `QueryProvider` class, authenticate to Microsoft Sentinel from your notebook, and view and run queries with a variety of different parameter options.

> [!TIP]
> You can have multiple instances of `QueryProvider` loaded for use with multiple Microsoft Sentinel workspaces or other data providers such as Microsoft Defender for Endpoint.
>

### Load the QueryProvider

To load the  `QueryProvider` for `AzureSentinel`, proceed to the cell with the following code and run it:

```python
# Initialize a QueryProvider for Microsoft Sentinel
qry_prov = QueryProvider("AzureSentinel")
```

> [!NOTE]
> If you see a warning `Runtime dependency of PyGObject is missing` when loading the Microsoft Sentinel driver, see the [Error: *Runtime dependency of PyGObject is missing*](https://github.com/Azure/Azure-Sentinel-Notebooks/wiki/%22Runtime-dependency-of-PyGObject-is-missing%22-error).
This warning doesn't impact notebook functionality.
>

### Authenticate to your Microsoft Sentinel workspace from your notebook

In Azure ML notebooks, the authentication defaults to using the credentials you used to authenticate to the Azure ML workspace.

**Authenticate by using managed identity**

Run the following code to authenticate to your Sentinel workspace.

   ```python
   # Get the default Microsoft Sentinel workspace details from msticpyconfig.yaml

   ws_config = WorkspaceConfig()

   # Connect to Microsoft Sentinel with our QueryProvider and config details
   qry_prov.connect(ws_config)
   ```

Output similar to the following is displayed in your notebook:

   :::image type="content" source="media/notebook-get-started/authorization-connected-workspace.png" alt-text="Screenshot that shows authentication to Azure that ends with a connected message.":::

**Cache your sign-in token using Azure CLI**

To avoid having to re-authenticate if you restart the kernel or run another notebooks, you can cache your sign-in token using Azure CLI.

The Azure CLI component on the Compute instance caches a *refresh token* that it can reuse until the token times out. MSTICPy automatically uses Azure CLI credentials, if they're available.

To authenticate using Azure CLI enter the following into an empty cell and run it:

```azurecli
!az login
```

> [!NOTE]
> You will need to re-authenticate if you restart your Compute instance or switch to a different instance. For more information, see [Caching credentials with Azure CLI](https://github.com/Azure/Azure-Sentinel-Notebooks/wiki/Caching-credentials-with-Azure-CLI) section in the Microsoft Sentinel Notebooks GitHub repository wiki.
>

### View the Microsoft Sentinel workspace data schema and built-in MSTICPy queries

After you're connected to a Microsoft Sentinel QueryProvider, you can understand the types of data available to query by querying the Microsoft Sentinel workspace data schema.

The Microsoft Sentinel QueryProvider has a `schema_tables` property, which gives you a list of schema tables, and a `schema` property, which also includes the column names and data types for each table.

**To view the first 10 tables in the Microsoft Sentinel schema**:

Proceed to the next cell, with the following code, and run it. You can omit the `[:10]` to list all tables in your workspace.

```python
# Get list of tables in the Workspace with the 'schema_tables' property
qry_prov.schema_tables[:10]  # Output only a sample of tables for brevity
                             # Remove the "[:10]" to see the whole list
```

The following output appears:

```output
Sample of first 10 tables in the schema
    ['AACAudit',
     'AACHttpRequest',
     'AADDomainServicesAccountLogon',
     'AADDomainServicesAccountManagement',
     'AADDomainServicesDirectoryServiceAccess',
     'AADDomainServicesLogonLogoff',
     'AADDomainServicesPolicyChange',
     'AADDomainServicesPrivilegeUse',
     'AADDomainServicesSystemSecurity',
     'AADManagedIdentitySignInLogs']
```

MSTICPy also includes many built-in queries available for you to run. List available queries with `.list_queries()`, and get specific details about a query by calling it with a question mark (`?`) included as a parameter. Alternatively you can view the list of queries and associated help in the query browser.

**To view a sample of available queries**:

Proceed to the next cell, with the following code, and run it. You can omit the `[::5]` to list all queries.

```python
# Get a sample of available queries
print(qry_prov.list_queries()[::5])  # showing a sample - remove "[::5]" for whole list
```

The following output appears:

```output
Sample of queries
=================
['Azure.get_vmcomputer_for_host', 'Azure.list_azure_activity_for_account', 'AzureNetwork.az_net_analytics', 'AzureNetwork.get_heartbeat_for_ip', 'AzureSentinel.get_bookmark_by_id', 'Heartbeatget_heartbeat_for_host', 'LinuxSyslog.all_syslog', 'LinuxSyslog.list_logon_failures', 'LinuxSyslog.sudo_activity', 'MultiDataSource.get_timeseries_decompose', 'Network.get_host_for_ip','Office365.list_activity_for_ip', 'SecurityAlert.list_alerts_for_ip', 'ThreatIntelligence.list_indicators_by_filepath', 'WindowsSecurity.get_parent_process', 'WindowsSecurity.list_host_events','WindowsSecurity.list_hosts_matching_commandline', 'WindowsSecurity.list_other_events']
```

**To get help about a query by passing `?` as a parameter**:

```python
# Get help about a query by passing "?" as a parameter
qry_prov.Azure.list_all_signins_geo("?")
```

The following output appears:

```output
Help for 'list_all_signins_geo' query
=====================================
Query:  list_all_signins_geo
Data source:  AzureSentinel
Gets Signin data used by morph charts

Parameters
----------
add_query_items: str (optional)
    Additional query clauses
end: datetime (optional)
    Query end time
start: datetime (optional)
    Query start time
    (default value is: -5)
table: str (optional)
    Table name
    (default value is: SigninLogs)
Query:
     {table} | where TimeGenerated >= datetime({start}) | where TimeGenerated <= datetime({end}) | extend Result = iif(ResultType==0, "Sucess", "Failed") | extend Latitude = tostring(parse_json(tostring(LocationDetails.geoCoordinates)).latitude) | extend Longitude = tostring(parse_json(tostring(LocationDetails.geoCoordinates)).longitude)
```

**To view both tables and queries in a scrollable, filterable list**:

Proceed to the next cell, with the following code, and run it:

```python
qry_prov.browse_queries()
```

For the selected query, all required and optional parameters are displayed, together with the full text of the query. For example:

:::image type="content" source="media/notebook-get-started/view-tables-queries-in-list.png" alt-text="Screenshot of tables and queries displayed in a scrollable, filterable list.":::

For more information, see [Running a pre-defined query](https://msticpy.readthedocs.io/en/latest/data_acquisition/DataProviders.html#running-a-pre-defined-query) in the MSTICPy documentation.

> [!NOTE]
> While you can't run queries from the browser, you can copy and paste the example at the end of each query to run elsewhere in the notebook.
>

### Run queries with time parameters

Most queries require time parameters. Date/time strings are tedious to type in, and modifying them in multiple places can be error-prone.

Each query provider has default start and end time parameters for queries. These time parameters are used by default, whenever time parameters are called for. You can change the default time range by opening the `query_time` control. The changes remain in effect until you change them again.

Proceed to the next cell, with the following code, and run it:

```python
# Open the query time control for your query provider
qry_prov.query_time
```

Set the `start` and `end` times as needed. For example:

:::image type="content" source="media/notebook-get-started/set-time-parameters.png" alt-text="Screenshot of setting default time parameters for queries.":::

### Run a query using the built-in time range

Query results return as a [Pandas DataFrame](https://pandas.pydata.org), which is a tabular data structure, like a spreadsheet or database table. You can use [pandas functions](https://pandas.pydata.org/docs/user_guide/10min.html) to perform extra filtering and analysis on the query results.

The following code cell runs a query using the query provider default time settings. You can change this range, and run the code cell again to query for the new time range.

```python
# The time parameters are taken from the qry_prov time settings
# but you can override this by supplying explict "start" and "end" datetimes
signins_df = qry_prov.Azure.list_all_signins_geo()

# display first 5 rows of any results
# If there is no data, just the column headings display
signins_df.head()
```

The output displays the first five rows of results. For example:

:::image type="content" source="media/notebook-get-started/run-query-with-built-in-time-range.png" alt-text="Screenshot of a query run with the built-in time range.":::

If there's no data, only the column headings display.

### Run a query using a custom time range

You can also create a new query time object and pass it to a query as a parameter, which allows you to run a one-off query for a different time range, without affecting the query provider defaults.

```python
# Create and display a QueryTime control.
time_range = nbwidgets.QueryTime()
time_range
```

After you’ve set the desired time range, you can pass the time range to the query function, running the following code in a separate cell from the previous code:

```python
signins_df = qry_prov.Azure.list_all_signins_geo(time_range)
signins_df.head()
```

You can also pass datetime values as Python datetimes or date-time strings using the `start` and `end` parameters:

```python
from datetime import datetime, timedelta
q_end = datetime.utc.now()
q_start = end – timedelta(5)
signins_df = qry_prov.Azure.list_all_signins_geo(start=q_start, end=q_end)
```

### Customize your queries

You can customize the built-in queries by adding additional query logic, or run complete queries using the `exec_query` function.

For example, most built-in queries support the `add_query_items` parameter, which you can use to append filters or other operations to the queries.

1. Run the following code cell to add a data frame that summarizes the number of alerts by alert name:

    ```python
    from datetime import datetime, timedelta

    qry_prov.SecurityAlert.list_alerts(
       start=datetime.utcnow() - timedelta(28),
        end=datetime.utcnow(),
        add_query_items="| summarize NumAlerts=count() by AlertName"
    )
    ```

1. Pass a full KQL query string to the query provider. The query runs against the connected workspace, and the data returns as a panda DataFrame. Run:

    ```python
    # Define your query
    test_query = """
    OfficeActivity
    | where TimeGenerated > ago(1d)
    | take 10
    """

    # Pass the query to your QueryProvider
    office_events_df = qry_prov.exec_query(test_query)
    display(office_events_df.head())

    ```

For more information, see:

- The [MSTICPy query reference](https://msticpy.readthedocs.io/en/latest/data_acquisition/DataQueries.html)
- [Running MSTICPy pre-defined queries](https://msticpy.readthedocs.io/en/latest/data_acquisition/DataProviders.html#running-an-pre-defined-query)

### Test VirusTotal and GeoLite2

**To check for an IP address in VirusTotal data**:

To use threat intelligence to see if an IP address appears in VirusTotal data, run the cell with the following code:

```python
# Create your TI provider – note you can re-use the TILookup provider (‘ti’) for
# subsequent queries - you don’t have to create it for each query
ti = TILookup()

# Look up an IP address
ti_resp = ti.lookup_ioc("85.214.149.236")

ti_df = ti.result_to_df(ti_resp)
ti.browse_results(ti_df, severities="all")
```

The output shows details about the results. For example:

:::image type="content" source="media/notebook-get-started/test-virustotal-ip.png" alt-text="Screenshot of an IP address appearing in VirusTotal data.":::

Make sure to scroll down to view full results. For more information, see [Threat Intel Lookups in MSTICPy](https://msticpy.readthedocs.io/en/latest/data_acquisition/TIProviders.html).

**To test geolocation IP lookup**:

To get geolocation details for an IP address using the MaxMind service, run the cell with the following code:

```python
# create an instance of the GeoLiteLookup provider – this
# can be re-used for subsequent queries.
geo_ip = GeoLiteLookup()
raw_res, ip_entity = geo_ip.lookup_ip("85.214.149.236")
display(ip_entity[0])
```

The output shows geolocation information for the IP address. For example:

```output
ipaddress
{ 'AdditionalData': {},
  'Address': '85.214.149.236',
  'Location': { 'AdditionalData': {},
                'CountryCode': 'DE',
                'CountryName': 'Germany',
                'Latitude': 51.2993,
                'Longitude': 9.491,
                'Type': 'geolocation',
                'edges': set()},
  'ThreatIntelligence': [],
  'Type': 'ipaddress',
  'edges': set()}
```

> [!NOTE]
> The first time you run this code, you should see the GeoLite driver downloading its database.
>

For more information, see [MSTICPy GeoIP Providers](https://msticpy.readthedocs.io/en/latest/data_acquisition/GeoIPLookups.html).

## Configure Key Vault settings

This section is relevant only when storing secrets in Azure Key Vault.

When you store secrets in Azure Key Vault, you'll need to create the Key Vault first, in the [Azure global KeyVault management portal](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.KeyVault%2Fvaults).

Required settings are all values that you get from the Vault properties, although some may have different names. For example:

- **VaultName** is show at the top left of the Azure Key Vault **Properties** screen
- **TenantId** is shown as **Directory ID**
- **AzureRegion** is shown as **Location**
- **Authority** is the cloud for your Azure service.

Only **VaultName**, **TenantId**, and **Authority** values are required to retrieve secrets from the Vault. The other values are needed if you opt to create a vault from MSTICPy. For more information, see [Specifying secrets as Key Vault secrets](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html#specifying-secrets-as-key-vault-secrets).

The **Use KeyRing** option is selected by default, and lets you cache Key Vault credentials in a local KeyRing. For more information, see [KeyRing documentation](https://keyring.readthedocs.io/en/latest/index.html).

> [!CAUTION]
> Do not use the **Use KeyRing** option if you do not fully trust the host Compute that the notebook is running on.
>
> In our case, the *compute* is the Jupyter hub server, where the notebook kernel is running, and not necessarily the machine that your browser is running on. If you are using Azure ML, the *compute* will be the Azure ML Compute instance you have selected. Keyring does its caching on the host where the notebook kernel is running.
>

**To add Key Vault settings in the MSTICPy settings editor**:

1. Proceed to the next cell, with the following code, and run it:

    ```python
    mpedit.set_tab("Key Vault")
    mpedit
    ```

1. Enter the Vault details for your Key Vault. For example:

    :::image type="content" source="media/notebook-get-started/add-kv-settings.png" alt-text="Screenshot of the Key Vault Setup section":::

1. Select **Save** and then **Save Settings**.

### Test Key Vault

To test your key vault, check to see if you can connect and view your secrets. If you haven't added a secret, you won't see any details. If you need to, add a test secret from the Azure Key Vault portal to the vault, and check that it shows in Microsoft Sentinel.

For example:

```Python
mpconfig = MpConfigFile()
mpconfig.refresh_mp_config()
mpconfig.show_kv_secrets()
```

> [!CAUTION]
> Do not leave the output displayed in your saved notebook. If there are real secrets in the output, use the notebook's **Clear output** command before saving the notebook.
>
> Also, delete cached copies of the notebook. For example, look in the **.ipynb_checkpoints** sub-folder of your notebook directory, and delete any copies of this notebook found. Saving the notebook with a cleared output should overwrite the checkpoint copy.
>

After you have Key Vault configured, you can use the **Upload to KV** button in the Data Providers and TI Providers sections to move the selected setting to the Vault. MSTICPy will generate a default name for the secret based on the path of the setting, such as `TIProviders-VirusTotal-Args-AuthKey`.

If the value is successfully uploaded, the contents of the **Value** field in the settings editor is deleted and the underlying setting is replaced with a placeholder value. MSTICPy will use this to indicate that it should automatically generate the Key Vault path when trying to retrieve the key.

If you already have the required secrets stored in a Key Vault you can enter the secret name in the **Value** field. If the secret is not stored in your default Vault (the values specified in the [Key Vault](https://msticpy.readthedocs.io/en/latest/getting_started/SettingsEditor.html#key-vault) section), you can specify a path of **VaultName/SecretName**.

Fetching settings from a Vault in a different tenant is not currently supported. For more information, see [Specifying secrets as Key Vault secrets](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html#specifying-secrets-as-key-vault-secrets).

## Specify the Azure cloud and Azure authentication methods

If you are using a sovereign or government Azure cloud, rather than the public or global Azure cloud, you must select the appropriate cloud in your settings. For most organizations the global cloud is the default.

You can also use these Azure settings to define default preferences for the Azure authentication type.

**To specify Azure cloud and Azure authentication methods**:

1. Proceed to the next cell, with the following code, and run it:

    ```python
    mpedit.set_tab("Azure")
    mpedit
    ```

1. Select the cloud used by your organization, or leave the default selected **global** option.

1. Select one or more of the following methods:

    - **env** to store your Azure Credentials in environment variables.
    - **msi** to use Managed Service Identity, which is an identity assigned to the host or virtual machine where the Jupyter hub is running. MSI is not currently supported in Azure ML Compute instances.
    - **cli** to use credentials from an authenticated Azure CLI session.
    - **interactive** to use the interactive device authorization flow using a [one-time device code](#authenticate-to-your-microsoft-sentinel-workspace-from-your-notebook).

    > [!TIP]
    > In most cases, we recommend selecting multiple methods, such as both **cli** and **interactive**. Azure authentication will try each of the configured methods in the order listed above until one succeeds.
    >

1. Select **Save** and then **Save Settings**.

For example:

:::image type="content" source="media/notebook-get-started/settings-for-azure-gov-cloud.png" alt-text="Screenshot of settings defined for the Azure Government cloud.":::

## Next steps

This article described the basics of using MSTICPy with Jupyter notebooks in Microsoft Sentinel. For more information, see [Advanced configurations for Jupyter notebooks and MSTICPy in Microsoft Sentinel](notebooks-msticpy-advanced.md).

You can also try out other notebooks stored in the [Microsoft Sentinel Notebooks GitHub repository](https://github.com/Azure/Azure-Sentinel-Notebooks), such as:

- [Tour of the Cybersec features](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/9bba6bb9007212fca76169c3d9a29df2da95582d/A%20Tour%20of%20Cybersec%20notebook%20features.ipynb)
- [Machine Learning examples](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/9bba6bb9007212fca76169c3d9a29df2da95582d/Machine%20Learning%20in%20Notebooks%20Examples.ipynb)
- The [Entity Explorer series](https://github.com/Azure/Azure-Sentinel-Notebooks/) of notebooks, which allow for a deep drill-down into details about a host, account, IP address, and other entities.

> [!TIP]
> If you use the notebook described in this article in another Jupyter environment, you can use any kernel that supports Python 3.6 or later.
>
> To use MSTICPy notebooks outside of Microsoft Sentinel and Azure Machine Learning (ML), you'll also need to configure your Python environment. Install Python 3.6 or later with the Anaconda distribution, which includes many of the required packages.
>

### More reading on MSTICPy and notebooks

The following table lists more references for learning about MSTICPy, Microsoft Sentinel, and Jupyter notebooks.

|Subject  |More references  |
|---------|---------|
|**MSTICPy**     |      - [MSTICPy Package Configuration](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html)<br> - [MSTICPy Settings Editor](https://msticpy.readthedocs.io/en/latest/getting_started/SettingsEditor.html)<br>    - [Configuring Your Notebook Environment](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/master/ConfiguringNotebookEnvironment.ipynb).<br>    - [MPSettingsEditor notebook](https://github.com/microsoft/msticpy/blob/master/docs/notebooks/MPSettingsEditor.ipynb). <br><br>**Note**: The `Azure-Sentinel-Notebooks` GitHub repository also contains a template *msticpyconfig.yaml* file with commented-out sections, which might help you understand the settings.      |
|**Microsoft Sentinel and Jupyter notebooks**     |   - [Create your first Microsoft Sentinel notebook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/creating-your-first-microsoft-sentinel-notebook/ba-p/2977745) (Blog series)<br>   - [Jupyter Notebooks: An Introduction](https://realpython.com/jupyter-notebook-introduction/)<br>    - [MSTICPy documentation](https://msticpy.readthedocs.io/)<br>    - [Microsoft Sentinel Notebooks documentation](notebooks.md)<br>    - [The Infosec Jupyterbook](https://infosecjupyterbook.com/introduction.html)<br>    - [Linux Host Explorer Notebook walkthrough](https://techcommunity.microsoft.com/t5/azure-sentinel/explorer-notebook-series-the-linux-host-explorer/ba-p/1138273)<br>    - [Why use Jupyter for Security Investigations](https://techcommunity.microsoft.com/t5/azure-sentinel/why-use-jupyter-for-security-investigations/ba-p/475729)<br>    - [Security Investigations with Microsoft Sentinel & Notebooks](https://techcommunity.microsoft.com/t5/azure-sentinel/security-investigation-with-azure-sentinel-and-jupyter-notebooks/ba-p/432921)<br>    - [Pandas Documentation](https://pandas.pydata.org/pandas-docs/stable/user_guide/index.html)<br>    - [Bokeh Documentation](https://docs.bokeh.org/en/latest/)       |

