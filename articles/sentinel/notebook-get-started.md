--- 
title: Work with notebooks and MSTICPY in Azure Sentinel | Microsoft Docs
description: Walk through the Azure Sentinel Getting Started Guide For Azure Sentinel ML Notebooks to learn the basics of Azure Sentinel notebooks with MSTICPy and queries.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.topic: how-to
ms.date: 08/23/2021
---

# Tutorial: Configure notebooks with MSTICPy

This tutorial describes how to run the **Getting Started Guide For Azure Sentinel ML Notebooks** notebook, which focuses on setup activities with Azure Sentinel notebooks and basic queries.

The **Getting Started Guide for Azure Sentinel ML Notebooks** notebook uses MSTICPy, a Python library of Cybersecurity tools built by Microsoft, which provides threat hunting and investigation functionality.

MSTICPy reduces the amount of code that customers need to write for Azure Sentinel, and provides:

- Data query capabilities, against Azure Sentinel tables, Microsoft Defender for Endpoint, Splunk, and other data sources.
- Threat intelligence lookups with TI providers, such as VirusTotal and AlienVault OTX.
- Enrichment functions like geolocation of IP addresses, Indicator of Compromise (IoC) extraction, and WhoIs lookups.
- Visualization tools using event timelines, process trees, and geo mapping.
- Advanced analyses, such as time series decomposition, anomaly detection, and clustering.

The steps in this tutorial describe how to run the **Getting Started Guide for Azure Sentinel ML Notebooks** notebook in your Azure ML workspace via Azure Sentinel. You can also use this tutorial as guidance for performing similar steps to run notebooks in other environments, including locally.

For more information, see [Use notebooks to power investigations](hunting.md#use-notebooks-to-power-investigations) and [Use Jupyter notebooks to hunt for security threats](notebooks.md).

> [!NOTE]
> Several Azure Sentinel notebooks do not use MSTICPy, such as the **Credential Scanner** notebooks, or the PowerShell and C# examples. Notebooks that do not use MSTICpy do not need the MSTICPy configuration described in this article.
> 
## Prerequisites

- To use notebooks in Azure Sentinel, make sure that you have required permissions. For more information, see [Manage access to Azure Sentinel notebooks](notebooks.md#manage-access-to-azure-sentinel-notebooks).

- To perform the steps in this tutorial, you'll need Python 3.6 or later. In Azure ML you can use either a Python 3.8 kernel (recommended) or a Python 3.6 kernel.

- This notebook uses [VirusTotal](https://www.virustotal.com) (VT) as a threat intelligence source. To use VirusTotal threat intelligence lookup, you'll need a VirusTotal account and API key.

    You can sign up for a free VT account at the [VirusTotal getting started page](https://developers.virustotal.com/v3.0/reference#getting-started). If you're already a VirusTotal user, you can use your existing key.

    > [!WARNING]
    > If you're using a VT enterprise key, store it in Azure Key Vault instead of the **msticpyconfig.yaml** file. For more information, see [Specify secrets as Key Vault secrets](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html#specifying-secrets-as-key-vault-secrets) in the MSTICPY documentation.
    >
    > If you don’t want to set up an Azure Key Vault right now, sign up for and use a free account until you can set up Key Vault storage.

- An account key for a geolocation lookup service for IP addresses, such as [MaxMind GeoLite2](https://www.maxmind.com) Sign up for a free account and key at the [Maxmind signup page](https://www.maxmind.com/en/geolite2/signup).


## Run and initialize the Getting Started Guide notebook

This procedure describes how to launch your notebook and initialize MSTICpy.


1. In Azure Sentinel, select **Notebooks** from the left.

1. From the **Templates** tab, select **A Getting Started Guide For Azure Sentinel ML Notebooks** > **Save notebook** to save it to your Azure ML workspace.

    Select **Launch notebook** to run the notebook.

    Most Azure Sentinel notebooks start with a MSTICPy initialization cell. This code:

    - Defines the minimum versions for Python and MSTICPy the notebook requires.
    - Ensures that the latest version of MSTICPy is installed.
    - Imports and runs the `init_notebook` function.

1. Run the following code cell, which includes initialization code:

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
> Most Azure Sentinel notebooks start with a MSTICpy initialization cell that:
>
> - Defines the minimum versions for Python and MSTICPy the notebook requires.
> - Ensures that the latest version of MSTICPy is installed.
> - Imports and runs the `init_notebook` function.
>
## Configure the notebook

After basic initialization, some notebook components need configuration to connect to the Azure Sentinel workspace and external services. For example, the **Getting Started Guide** notebook uses [VirusTotal](https://www.virustotal.com) (VT) as a threat intelligence source.

As many Azure Sentinel notebooks connect to external services such as VirusTotal to collect and enrich data, you must set and store configuration details for these external services, such as authentication tokens and workspace details. Rather than having to set these details each time you use a notebook, you can store them in a configuration file for easier management and re-use.

MSTICPy uses a **msticpyconfig.yaml** for storing a wide range of configuration details. When you run the notebook initialization steps, the **msticpyconfig.yaml** file is  created for you if it does not already exist in your Azure ML workspace. If you cloned the notebook from the Azure Sentinel portal, the **msticpyconfig.yaml** file is automatically populated with details of the Azure Sentinel workspace you cloned it from.

The following sections describe how to add configuration details to the **msticpyconfig.yaml** file. For more information, see the [MISTICPy Package Configuration documentation](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html).

> [!TIP]
> At any point in time, select **Help** for more instructions and links to detailed documentation.
> 
### Display the MSTICPy settings editor

1. In a code cell, run the following code to import the `MpConfigEdit` tool and display a settings editor for your **msticpyconfig.yaml** file:

    ```python
    from msticpy.config import MpConfigEdit
        mpedit = MpConfigEdit(mp_conf)
        mpedit.set_tab("AzureSentinel")
        display(mpedit)
    ```

    The automatically created **msticpyconfig.yaml** file contain an entry with details of the Azure Sentinel workspace that the notebook was cloned from, named **Default**.

    MSTICPy allows you to store configurations for multiple Azure Sentinel workspaces and switch between them. The **Default** entry allows you to authenticate to a your "home" workspace by default, without having to name it explicitly.

    > [!NOTE]
    > In the Azure ML environment, the settings editor might take 10-20 seconds to appear.

1. Verify your current settings and select **Save Settings**.

> [!NOTE]
> At any point in time, select **Help** for more instructions and links to detailed documentation.
>

### Add threat intelligence provider settings

This procedure describes how to store your [VirusTotal API key](#prerequisites) in the **msticpyconfig.yaml** file. You can opt to upload the API key to Azure Key Vault, but you must configure the Key Vault settings first. For more information, see [Key Vault configuration](#key-vault-configuration).

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
> For more information about other supported threat intelligence providers, see [Threat intelligence providers](https://msticpy.readthedocs.io/en/latest/data_acquisition/TIProviders.html) in the MSTICPy documentation and [Threat intelligence integration in Azure Sentinel](threat-intelligence-integration.md).
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

### Validate settings

Select **Validate settings** in the settings editor.

Warning messages about missing configurations are expected, but you shouldn't have any for threat intelligence provider or GeoIP provider settings. To configure other MSTICPy settings, see [Extra configurations](#extra-configurations) below.

Select the **Close** button to hide the validation output.

If you need to make any changes because of the validation, save your changes by selecting **Save Settings**.

## Load saved MSTICPy settings

In the [Configure the notebook](#configure-the-notebook) procedure, you saved your settings to your local **msticpyconfig.yaml** file.

However, MSTICPy doesn't automatically reload these settings until you restart the kernel or run another notebook. To force MSTICPy to reload from the new configuration file, enter the following code in the next code cell and run it:

```python
import msticpy
msticpy.settings.refresh_config()
```

## Test your notebook

Now that you've initialized your environment and configured basic settings for your workspace, use the MSTICPy `QueryProvider` class to test the notebook. `QueryProvider`  queries a data source, in this case your Azure Sentinel workspace, and makes the queried data available to view and analyze in your notebook.

Use the following procedures to load the `QueryProvider` class, authenticate to Azure Sentinel from your notebook, and view and run queries with a variety of different parameter options.

### Load the QueryProvider

To load the  `QueryProvider` for `AzureSentinel`, enter the following code in an empty code cell and run it:

```python
# Initialize a QueryProvider for Azure Sentinel
qry_prov = QueryProvider("AzureSentinel")
```

> [!NOTE]
> If you see a warning `Runtime dependency of PyGObject is missing` when loading the Azure Sentinel driver, see the [Error: *Runtime dependency of PyGObject is missing*](notebooks.md#error-runtime-dependency-of-pygobject-is-missing).
This warning doesn't impact notebook functionality.
>

### Authenticate to your Azure Sentinel workspace from your notebook

Authenticate to your Azure Sentinel workspace using [device authorization](/azure/active-directory/develop/v2-oauth2-device-code) with your Azure credentials.

Device authorization adds another factor to the authentication by generating a one-time device code that you supply as part of the authentication process.

**To authenticate using device authorization**:

1. Run the following code cell to generate and display a device code:

   ```python
   # Get the Azure Sentinel workspace details from msticpyconfig
   # Loading WorkspaceConfig with no parameters uses the details
   # of your Default workspace
   # If you want to connect to a specific workspace use this syntax:
   #    ws_config = WorkspaceConfig(workspace="WorkspaceName")
   # ('WorkspaceName' should be one of the workspaces defined in msticpyconfig.yaml)
   ws_config = WorkspaceConfig()

   # Connect to Azure Sentinel with your QueryProvider and config details
   qry_prov.connect(ws_config)
   ```

    For example:

    :::image type="content" source="media/notebook-get-started/device-authorization.png" alt-text="Screenshot showing a device authorization code.":::

1. Go to [https://microsoft.com/devicelogin](https://microsoft.com/devicelogin) and paste in the code provided in the previous step.

1. Authenticate with your Azure credentials. For example:

   :::image type="content" source="media/notebook-get-started/authorization-process.png" alt-text="Screenshot showing the device authorization process.":::

1. Once you see the final confirmation message, close the browse tab return to your notebook in Azure Sentinel.

   Output similar to the following is displayed in your notebook:

   :::image type="content" source="media/notebook-get-started/authorization-complete.png" alt-text="Screenshot showing that the device authorization process is complete.":::

> [!TIP]
> To avoid having to re-authenticate if you restart the kernel or run another notebooks, you can cache your sign-in token using Azure CLI. The Azure CLI component on the The Compute caches a *refresh token* that it can reuse until the token times out. MSTICPy automatically uses Azure CLI credentials, if they're available. You will need to re-authenticate if you restart your Compute instance or switch to a different instance. For more information, see [Caching credentials with Azure CLI](https://github.com/Azure/Azure-Sentinel-Notebooks/wiki/Caching-credentials-with-Azure-CLI) in the Azure Sentinel notebooks GitHub repository.

### View the Azure Sentinel workspace data schema and built-in MSTICPy queries

After you're connected to an Azure Sentinel QueryProvider, you can understand the types of data available to query, by querying the Azure Sentinel workspace data schema.

The AzureSentinel QueryProvider has a `schema_tables` property, which gives you a list of schema tables, and a `schema` property, which also includes the column names and data types for each table.

**To view the first 10 tables in the Azure Sentinel schema**:

Enter the following code in an empty code cell and run it. You can omit the `[:10]` to list all tables in your workspace.

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

MSTICPy also includes many built-in queries available for you to run. List available queries with `.list_queries()`, and get specific details about a query by calling it with a question mark (`?`) included as a parameter.

**To view a sample of available queries**:

Enter the following code in an empty code cell and run it. You can omit the `[::5]` to list all queries.

```python
# Get a sample of available queries
print(qry_prov.list_queries()[::5])  # showing a sample - remove "[::5]" for whole list
```

The following output appears:

```output
Sample of queries
=================
['Azure.get_vmcomputer_for_host', 'Azure.list_azure_activity_for_account', 'AzureNetwork.az_net_analytics', 'AzureNetwork.get_heartbeat_for_ip', 'AzureSentinel.get_bookmark_by_id', 'Heartbeat.get_heartbeat_for_host', 'LinuxSyslog.all_syslog', 'LinuxSyslog.list_logon_failures', 'LinuxSyslog.sudo_activity', 'MultiDataSource.get_timeseries_decompose', 'Network.get_host_for_ip', 'Office365.list_activity_for_ip', 'SecurityAlert.list_alerts_for_ip', 'ThreatIntelligence.list_indicators_by_filepath', 'WindowsSecurity.get_parent_process', 'WindowsSecurity.list_host_events', 'WindowsSecurity.list_hosts_matching_commandline', 'WindowsSecurity.list_other_events']
```

**To get help about a query by passing `?` as a parameter**:

```python
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

Enter the following code in an empty code cell and run it:

```python
qry_prov.browse_queries()
```

For the selected query, all required and optional parameters are displayed, together with the full text of the query. For more details about parameters for built in queries see the [MSTICPy documentation](https://msticpy.readthedocs.io/en/latest/data_acquisition/DataProviders.html#running-a-pre-defined-query).

> [!NOTE]
> While you can't run queries from the browser, you can copy and paste the example at the end of each query to run elsewhere in the notebook.
>

### Run queries with time parameters

Most queries require time parameters, which are difficult to enter and keep track of.

Each query provider has default start and end time parameters for queries. These time parameters are used by default, whenever time parameters are called for. You can change the default time range by opening the `query_time` control, and the changes remain in effect until you change them again.

Enter the following code in an empty code cell and run it:

```python
# Open the query time control for your query provider
qry_prov.query_time
```

Define different `start` and `end` query parameters as needed.

### Run a query using the built-in time range

Query results return as a [Pandas DataFrame](https://pandas.pydata.org). A dataframe is a tabular data structure like a spreadsheet or database table.

The following code cell runs a query using the query provider default time settings. If you change the settings, run the code cell again to apply the new settings.

```python
# The time parameters are taken from the qry_prov time settings
# but you can override this by supplying explict "start" and "end" datetimes
signins_df = qry_prov.Azure.list_all_signins_geo()

# display first 5 rows of any results
# If there is no data, just the column headings display
signins_df.head()
```

The output displays the first five rows of results. If there's no data, only the column headings display.

### Run a query using a custom time range

You can also create a new query time object and pass it to a query as a parameter:

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

You can also pass datetime values as Python datetimes or date-time strings using the “start” and “end” parameters:

```python
from datetime import datetime, timedelta
q_end = datetime.utc.now()
q_start = end – timedelta(5)
signins_df = qry_prov.Azure.list_all_signins_geo(start=q_start, end=q_end)
```

### Customize your queries

You can customize the built-in queries by adding additional query logic, or execute complete queries using the `exec_query` function.

For example:

1. Most built-in queries support the `add_query_items` parameter. You can use this parameter to append filters or other operations to the queries. Run the following code cell to add a data frame that summarizes the number of alerts by alert name:

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

Threat intelligence and IP location are two enrichments that are typically applied to queried data.

**To test threat intelligence lookup**:

To use the threat intelligence feature to see if an IP address appears in VirusTotal data, enter the following code in an empty code cell and run it:

```python
# Create your TI provider – Note that you can reuse the TILookup provider (‘ti’) for
# subsequent queries - you don’t have to create it for each query

ti = TILookup()

# Look up an IP address
ti_resp = ti.lookup_ioc("85.214.149.236")

ti_df = ti.result_to_df(ti_resp)
ti.browse_results(ti_df, severities="all")
```

The output shows details about the results.

For more information, see [Threat Intel Lookups in MSTICPy](https://msticpy.readthedocs.io/en/latest/data_acquisition/TIProviders.html).

**To test geolocation IP lookup**:

To get geolocation details for an IP address using the MaxMind service, enter the following code in an empty code cell and run it:

```python
# create an instance of the GeoLiteLookup provider – this
# can be re-used for subsequent queries.
geo_ip = GeoLiteLookup()
raw_res, ip_entity = geo_ip.lookup_ip("85.214.149.236")
display(ip_entity[0])
```

The output shows geolocation information for the IP address.

> [!NOTE]
> You should see the GeoLite driver downloading its database the first time you run this code.
>

For more information, see [MSTICPy GeoIP Providers](https://msticpy.readthedocs.io/en/latest/data_acquisition/GeoIPLookups.html).

## Extra configurations

Use the following procedures to configure additional settings for MSTICPy.

### Key Vault Configuration

This section is relevant only when storing secrets in Azure Key Vault.

When you store secrets in Azure Key Vault, you'll need to create the Key Vault first, in the [Azure global KeyVault management portal](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.KeyVault%2Fvaults).

Required settings are all values that you get from the Vault properties, although some may have different names. For example:

- **VaultName** is show at the top left of the Azure Key Vault **Properties** screen
- **TenantId** is shown as **Directory ID**
- **AzureRegion** is shown as **Location**
- **Authority** is the cloud for your Azure service.

Only **VaultName**, **TenantId**, and **Authority** values are required to retrieve secrets from the the Vault. The other values are needed if you opt to create a vault from MSTICPy. For more information, see [Specifying secrets as Key Vault secrets](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html#specifying-secrets-as-key-vault-secrets).

The **Use KeyRing** option is selected by default, and lets you cache Key Vault credentials in a local KeyRing. For more information, see [KeyRing documentation](https://keyring.readthedocs.io/en/latest/index.html).

> [!CAUTION]
> Do not use the **Use KeyRing** option if you do not fully trust the host Compute that the notebook is running on. 
>
> In our case, the *hostcompute* is the Jupyter hub server, where the notebook kernel is running, not necessarily the machine that your browser is running on. If you are using Azure ML, your *hostcompute* will be the Azure ML Compute instance you have selected. Keyring does its caching on the host where the notebook kernel is running.
>

When you're done, select **Save** and then **Save Settings**.

### Test Key Vault

To test your key vault, check to see if you can connect and view your secrets. If you haven't added a secret, you won't see any details. If you need to, add a test secret from the Azure Key Vault portal to the vault, and check that it shows in Azure Sentinel.

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
>For example: `mpconfig.refresh_mp_config() mpconfig.show_kv_secrets()`
>

After you have Key Vault configured, you can use the **Upload to KV** button in the Data Providers and TI Providers sections to move the selected setting to the Vault. MSTICPy will generate a default name for the secret based on the path of the setting, such as `TIProviders-VirusTotal-Args-AuthKey`.

If the value is successfully uploaded, the contents of the **Value** field in the settings editor is deleted and the underlying setting is replaced with a placeholder value. MSTICPy will use this to indicate that it should automatically generate the Key Vault path when trying to retrieve the key.

If you already have the required secrets stored in a Key Vault you can enter the secret name in the **Value** field. If the secret is not stored in your default Vault (the values specified in the [Key Vault](https://msticpy.readthedocs.io/en/latest/getting_started/SettingsEditor.html#key-vault) section), you can specify a path of **VaultName/SecretName**.

Fetching settings from a Vault in a different tenant is not currently supported. For more information, see [Specifying secrets as Key Vault secrets](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html#specifying-secrets-as-key-vault-secrets).

### Specify authentication parameters for Azure and Azure Sentinel APIs (optional)

This procedure describes how to configure authentication parameters for Azure Sentinel and other Azure API resources in your **msticpyconfig.yaml** file.

**To add Azure authentication and Azure Sentinel API settings in the MSTICPy settings editor**:

1. Enter the following code in an empty code cell and run:
1. Run the following code cell to open the MSTICPy editor to the **Data Providers** tab:

    ```python
    mpedit.set_tab("Data Providers")
    mpedit
    ```

1. In the **Data Providers** tab, select **AzureCLI**.

1. Define your authentication as **Chained authentication**.

    For example, you can use credentials set in environment variables, credentials available through an Azure CLI `login` command, the Managed Service Identity (MSI) credentials of the machine running the notebook kernel, or an interactive browser sign-in.

    When using **Chained authentication**, leave the **clientId**, **tenantiId**, and **clientSecret** fields empty.

    While not recommended, MSTICPy also supports using client app IDs and secrets for your authentication. In such cases, define your **clientId**, **tenantiId**, and **clientSecret** fields directly in the **Data Providers** tab.

1. Select **Save File** to save your changes.

### Define auto-loading query providers (optional)

Define any query providers that you want to MSTICPy to load automatically when you run the `nbinit.init_notebook` function.

When you frequently author new notebooks, auto-loading query providers can save you time by ensuring that required providers are loaded before other components, such as pivot functions and notebooklets.

**To add auto-loading query providers**:

1. Enter the following code in an empty code cell and run it:

    ```python
    mpedit.set_tab("Autoload QueryProvs")
    mpedit
    ```

1. In the **Autoload QueryProv** tab:

   - For Azure Sentinel providers, specify both the provider name and the workspace name you want to connect to.
   - For other query providers, specify the provider name only.

   Each provider also has the following optional values:

   - **Auto-connect:** This option is defined as **True** by default, and MSTICPy tries to authenticate to the provider immediately after loading. MSTICPy assumes that you've configured credentials for the provider in your settings.

   - **Alias:** When MSTICPy loads a provider, it assigns the provider to a Python variable name. By default, the variable name is **qryworkspace_name** for Azure Sentinel providers and **qryprovider_name** for other providers.

        For example, if you load a query provider for the *ContosoSOC* workspace, this query provider will be created in your notebook environment with the name `qry_ContosoSOC`. Add an alias if you want to use something shorter or easier to type and remember. The provider variable name will be `qry_<alias>`, where `<alias>` is replaced by the alias name that you provided.

        Providers you load by this mechanism are also added to the MSTICPy `current_providers` attribute, which is used for example in the following code:

        ```python
        import msticpy
        msticpy.current_providers
        ```

1. Select **Save Settings** to save your changes.

### Define auto-loaded MSTICPy components (optional)

This procedure describes how to define other components that are automatically loaded by MSTICPy when you run the `nbinit.init_notebook` function.

Supported components include, in the following order:

1. **TILookup:** The [TI provider library](#add-threat-intelligence-provider-settings)
1. **GeoIP:** The [GeoIP provider](#add-geoip-provider-settings) you want to use
1. **AzureData:** The module you use to query details about [Azure resources](#define-azure-authentication-and-azure-sentinel-apis-optional)
1. **AzureSentinelAPI:** The module you use to query the [Azure Sentinel API](#define-azure-authentication-and-azure-sentinel-apis-optional)
1. **Notebooklets:** Notebooklets from the [msticnb package](https://msticnb.readthedocs.io/en/latest/)
1. **Pivot:** Pivot functions

> [!NOTE]
> The components load in this order because the Pivot component needs query and other providers loaded to find the pivot functions that it attaches to entities. For more information, see [MSTICPy documentation](https://msticpy.readthedocs.io/en/latest/data_analysis/PivotFunctions.html).
>

**To define auto-loaded MSTICPy components**:

1. Enter the following code in an empty code cell and run it:

   ```python
   mpedit.set_tab("Autoload Components")
   mpedit
   ```

1. In the **Autoload Components** tab, define any parameter values as needed. For example:

   - **GeoIpLookup**.  Enter the name of the GeoIP provider you want to use, either *GeoLiteLookup* or *IPStack*.  For more information, see [Add GeoIP provider settings](#add-geoip-provider-settings).

   - **AzureData and AzureSentinelAPI components**.  Define the following values:

      - **auth_methods:** Override the default settings for AzureCLI, and connect using the selected methods.
      - **Auto-connect:** Set to false to load without connecting.

      For more information, see [Define Azure authentication and Azure Sentinel APIs](#define-azure-authentication-and-azure-sentinel-apis-optional).

   - **Notebooklets**. The **Notebooklets** component has a single parameter block: **AzureSentinel**.

      Specify your Azure Sentinel workspace using the following syntax: `workspace:\<workspace name>`. The workspace name must be one of the workspaces defined in the **Azure Sentinel** tab.

      If you want to add more parameters to send to the `notebooklets init` function, specify them as key:value pairs, separated by newlines. For example:

      ```python
      workspace:<workspace name>
      providers=["LocalData","geolitelookup"]
      ```

      For more information, see the [MSTICNB (MSTIC Notebooklets) documentation](https://msticnb.readthedocs.io/en/latest/msticnb.html#msticnb.data_providers.init).

    Some components, like **TILookup** and **Pivot,** don't require any parameters.

1. Select **Save Settings** to save your changes.


### Switch between Python 3.6 and 3.8 kernels

If you're switching between Python 3.65 and 3.8 kernels, you may find that MSTICPy and other packages don't get installed as expected.

This may happen when the `!pip install pkg` command will install correctly in the first environment, but then doesn't install correctly in the second. This creates a situation where the second environment can't import or use the package.

We recommend that you don't use `!pip install...` to install packages in Azure ML notebooks. Instead, use one of the following options:

- **Use the %pip line magic within a notebook**. Run:

  ```python

  %pip install --upgrade msticpy
  ```

- **Install from a terminal**:

  1. Open a terminal in Azure ML notebooks and run the following commands:

     ``` bash
     conda activate azureml_py38
     pip install --upgrade msticpy
     ```

  1. Close the terminal and restart the kernel.


### Set an environment variable for your msticpyconfig.yaml file (Optional)

If you are running in Azure ML and have your **msticpyconfig.yaml** file in the root of your user folder, MSTICPy will automatically find these settings. However, if you are running the notebooks in another environment, follow the instructions in this section to set an environment variable that points to the location of your configuration file.

Defining the path to your **msticpyconfig.yaml** file in an environment variable allows you to store your file in a known location and make sure that you always load the same settings.

Use multiple configuration files, with multiple environment variables, if you want to use different settings for different notebooks.

1. Decide on a location for your **msticpyconfig.yaml** file, such as in **~/.msticpyconfig.yaml** or **%userprofile%/msticpyconfig.yaml**.

   If you're working in Azure ML, you may want to leave your **msticpyconfig.yaml** file in the Azure ML file storage, or you might want to move it to your Compute instance.

   If you leave it in the Azure ML file storage, the `nb_check.check_versions` function at the start of the notebook automatically finds the file in your root folder using the **MSTICPYCONFIG** environment variable. However, if you are storing any secret keys in your **msticpyconfig.yaml** file, we recommend that you store it on your Compute instance. The Azure ML file storage is shared, while the Compute instance is accessible only to the user who created it.

   For more information, see [What is an Azure Machine Learning compute instance?](/azure/machine-learning/concept-compute-instance).

1. If needed, copy your **msticpyconfig.yaml** file to your selected location.

1. Set the **MSTICPYCONFIG** environment variable to point to that location.

Use one of the following procedures to define the **MSTICPYCONFIG** environment variable.  
# [Windows](#tab/windows)

For example, to set the **MSTICPYCONFIG** environment variable on Windows systems:

1. Move the **msticpyconfig.yaml** file to the Compute instance as needed.
1. Open the **System Properties** dialog box to the **Advanced** tab.
1. Select **Environment Variables...** to open the **Environment Variables** dialog.
1. In the **System variables** area, select **New...**, and define the values as follows:

    - **Variable name**: Define as `MSTICPYCONFIG`
    - **Variable value**: Enter the path to your **msticpyconfig.yaml** file

# [Linux](#tab/linux)

This procedure describes how to update the **.bashrc** file to set the **MSTICPYCONFIG** environment variable on Linux systems.

1. Move the **msticpyconfig.yaml** file to the Compute instance as needed.

1. Open an Azure ML terminal, such as from the Azure Sentinel **Notebooks** page.

1. Verify that you can access your **msticpyconfig.yaml** file.

   In your Azure ML terminal, your current directory should be your Azure ML file store home directory, mounted in the Compute Linux system. The prompt looks similar to the following example:

   ```python
   azureuser@alicecontoso-azml7:~/cloudfiles/code/Users/alicecontoso$
   ```

   List all files in the home directory, including the **msticpyconfig.yaml** file, by entering `ls`.

1. To move the **msticpyconfig.yaml** file to the Compute file store, enter:

   ```python
   mv msticpyconfig.yaml ~
   ```

1. Use one of the following processes to edit the **.bashrc** file for your environment variable:

    |Command  |Steps  |
    |---------|---------|
    |**vim**     |     1. Run: `vim ~/.bashrc` <br>2. Go to end of file by pressing **SHIFT+G** > **End**. 3. Create a new line by entering **a** and then pressing **ENTER**. <br>4. Add your environment variable and then press **ESC** to get back to command mode. <br>5. Save the file by entering **:wq**.    |
    |**nano**     |           1. Run: `nano ~/.bashrc`<br>        1. Go to end of file by pressing **ALT+/** or **OPTION+/**.<br>        1. Add your environment variable, and then save your file. Press **CTRL+X** and then **Y**.      |
    |     |         |

    Add one of the following environment variables:

    - If you moved the **msticpyconfig.yaml** file, run `export MSTICPYCONFIG=~/msticpyconfig.yaml`.
    - If you didn't move the **msticpyconfig.yaml** file, run `export MSTICPYCONFIG=~/cloudfiles/code/Users/<YOURNAME>/msticpyconfig.yaml`.


# [Azure ML options](#tab/azure-ml)

If you need to store your **msticpyconfig.yaml**  file somewhere other than your Azure ML user folder, use one of the following options:

- **An *nbuser_settings.py* file at the root of your user folder**.  While this process is simpler and less intrusive than editing the **kernel.json** file, it's onlysupported when you run the `init_notebook` function at the start of your notebook code. While this is the default behavior, if you run the notebook code without first running `init_notebook`, MSTICPy may not be able to find the configuration file.

    1. In the Azure ML terminal, create the **nbuser_settings.py** file in the root of your user folder, which is the folder with your username.
    1. In the **nbuser_settings.py** file, add the following lines:
        ```python
          import os
          os.environ["MSTICPYCONFIG"] = "~/msticpyconfig.yaml"
        ```

    This file is automatically imported by the `init_notebook` function, and sets the `MSTICPYCONFIG` environment variable for the current notebook.

- **The *kernel.json* file for your Python kernel**. Use this procedure if you plan on running the notebook manually, and possibly without calling the `init_notebook` function at the start.

    There are kernels for Python 3.6 and Python 3.8. If you use both kernels, edit both files.

    - **Python 3.8 location**: */usr/local/share/jupyter/kernels/python38-azureml/kernel.json*
    - **Python 3.6 location**: */usr/local/share/jupyter/kernels/python3-azureml/kernel.json*

    To set the environment variable in the **kernel.json** file:

    1. Make a copy of the **kernel.json** file, and open the original in an editor. You might need to use `sudo` to overwrite the **kernel.json** file, and the file contents look similar to the following example:

         ```python
         {
             "argv": [
             "/anaconda/envs/azureml_py38/bin/python",
             "-m",
             "ipykernel_launcher",
             "-f",
             "{connection_file}"
             ],
             "display_name": "Python 3.8 - AzureML",
             "language": "python"
         }
         ```

    1. After the `"language"` item, add the following line: `"env": { "MSTICPYCONFIG": "~/msticpyconfig.yaml" }`

        Make sure to add the comma at the end of the `"language": "python"` line. For example:

         ```python
         {
             "argv": [
             "/anaconda/envs/azureml_py38/bin/python",
             "-m",
             "ipykernel_launcher",
             "-f",
             "{connection_file}"
             ],
             "display_name": "Python 3.8 - AzureML",
             "language": "python",
             "env": { "MSTICPYCONFIG": "~/msticpyconfig.yaml" }
         }
         ```

---

> [!NOTE]
> For the Linux and Windows options, you'll need to restart your Jupyter server for it to pick up the environment variable that you defined.
>

## Next steps

This tutorial walked through the basics of installing MSTICPy and setting up configurations.

Try out other notebooks stored in the [Azure Sentinel Notebooks GitHub repository](https://github.com/Azure/Azure-Sentinel-Notebooks), especially:

- [Tour of the Cybersec features](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/9bba6bb9007212fca76169c3d9a29df2da95582d/A%20Tour%20of%20Cybersec%20notebook%20features.ipynb)
- [Machine Learning examples](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/9bba6bb9007212fca76169c3d9a29df2da95582d/Machine%20Learning%20in%20Notebooks%20Examples.ipynb)
- The [Entity Explorer series](https://github.com/Azure/Azure-Sentinel-Notebooks/) of notebooks, which allow for a deep drill-down into details about a host, account, IP address, and other entities.

> [!TIP]
> If you use the notebook described in this tutorial in another Jupyter environment, you can use any kernel that supports Python 3.6 or later.
>
> To use MSTICPy notebooks outside of Azure Sentinel and Azure Machine Learning (ML), you'll also need to configure your Python environment. Install Python 3.6 or later with the Anaconda distribution, which includes many of the required packages.
>

### More reading on MSTICPy and notebooks

The following table provide more references for learning about MSTICPy, Azure Sentinel, and Jupyter notebooks.

|Subject  |More references  |
|---------|---------|
|**MSTICPy**     |      - [MSTICPy Package Configuration](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html)<br> - [MSTICPy Settings Editor](https://msticpy.readthedocs.io/en/latest/getting_started/SettingsEditor.html)<br>    - [Configuring Your Notebook Environment](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/master/ConfiguringNotebookEnvironment.ipynb).<br>    - [MPSettingsEditor notebook](https://github.com/microsoft/msticpy/blob/master/docs/notebooks/MPSettingsEditor.ipynb). <br><br>**Note**: The Azure-Sentinel-Notebooks GitHub repo also contains a template *msticpyconfig.yaml* file with commented-out sections, which might help you understand the settings.      |
|**Azure Sentinel and Jupyter notebooks**     |      - [Jupyter Notebooks: An Introduction](https://realpython.com/jupyter-notebook-introduction/)<br>    - [MSTICPy documentation](https://msticpy.readthedocs.io/)<br>    - [Azure Sentinel Notebooks documentation](notebooks.md)<br>    - [The Infosec Jupyterbook](https://infosecjupyterbook.com/introduction.html)<br>    - [Linux Host Explorer Notebook walkthrough](https://techcommunity.microsoft.com/t5/azure-sentinel/explorer-notebook-series-the-linux-host-explorer/ba-p/1138273)<br>    - [Why use Jupyter for Security Investigations](https://techcommunity.microsoft.com/t5/azure-sentinel/why-use-jupyter-for-security-investigations/ba-p/475729)<br>    - [Security Investigations with Azure Sentinel & Notebooks](https://techcommunity.microsoft.com/t5/azure-sentinel/security-investigation-with-azure-sentinel-and-jupyter-notebooks/ba-p/432921)<br>    - [Pandas Documentation](https://pandas.pydata.org/pandas-docs/stable/user_guide/index.html)<br>    - [Bokeh Documentation](https://docs.bokeh.org/en/latest/)       |
|     |         |

