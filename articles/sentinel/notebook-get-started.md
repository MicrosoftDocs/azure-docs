--- 
title: Tutorial - Get started with ML notebooks in Azure Sentinel | Microsoft Docs
description: Walk through the Azure Sentinel Getting Started Guide For Azure Sentinel ML Notebooks to learn the basics of Azure Sentinel notebooks and queries.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.topic: how-to
ms.date: 07/22/2021
---

# Tutorial: Get started with ML notebooks in Azure Sentinel

This tutorial walks through the Azure Sentinel **Getting Started Guide For Azure Sentinel ML Notebooks** notebook, which focuses on setup and basic data queries.

While this tutorial provides steps for running the notebook in your Azure ML workspace via Azure Sentinel, you can use similar steps to run notebooks in other environments, including local notebooks.

> [!NOTE]
> Jupyter notebooks are created, edited, and run in the Azure Sentinel **Notebooks** page, which provides access to your Azure Machine Learning (ML) workspace and terminal. For more information, see [Use notebooks to power investigations](hunting.md#use-notebooks-to-power-investigations).
>

## Prerequisites

## Run the Getting Started Guide notebook

1. In Azure Sentinel, select **Notebooks**. From the **Templates** tab, select **A Getting Started Guide For Azure Sentinel ML Notebooks** > **Save notebook** to save it to your Azure ML workspace. Then select **Launch notebook** to run the notebook.



### Run Azure Machine Learning (ML) notebooks

Azure Sentinel notebooks run in an Azure ML workspace. You can also open and run these notebooks in JupyterLab or Jupyter classic.

You can view a notebook as a static document, for example in the GitHub built-in static notebook renderer. However, to run code in a notebook, you must attach the notebook to a backend process called a Jupyter kernel. The kernel runs the code and holds all the variables and objects the code creates. The browser is the viewer for this data.

In Azure ML, the kernel runs on a virtual machine called an Azure ML Compute. The Compute instance can support running many notebooks at once.

Usually, a notebook creates or attaches to a kernel seamlessly. You don't need to do anything manually. If you get errors, or the notebook doesn't seem to be running, you might need to check the version and state of the kernel.

The Compute instance and the kernel version appear at the upper right in the Azure ML Workspace window.

:::image type="content" source="media/notebook-get-started/compute-kernel.png" alt-text="Screenshot showing the Compute and kernel in an Azure ML workspace.":::

This article and notebook use the Python 3.8 kernel. You can also use the Python 3.6 kernel. If the correct kernel doesn't show, select the dropdown caret next to the kernel field and select the correct version from the dropdown list.

:::image type="content" source="media/notebook-get-started/select-kernel.png" alt-text="Screenshot that shows selecting the kernel in an Azure ML workspace.":::

> [!NOTE]
> The code in this article and notebook works with Python 3.6 or later. If you use the notebook in another Jupyter environment, you can choose any kernel that supports Python 3.6 or later

If your notebook hangs or you want to start over, you can restart the kernel. Select the recycle symbol at upper left in the toolbar above the notebook. Restarting the kernel wipes all variables and other state. You need to rerun any initialization and authentication cells after restarting.

:::image type="content" source="media/notebook-get-started/restart-kernel.png" alt-text="Screenshot that shows restarting the kernel in an Azure ML workspace.":::

If you have trouble getting a notebook to run, review [How to run Jupyter notebooks](/azure/machine-learning/how-to-run-jupyter-notebooks).

### Run code

In a notebook, *Markdown* cells have text, including HTML, and static images. *Code* cells contain code. After you select a code cell, you can run the code in the cell by selecting the **Play** icon to the left of the cell, or by pressing Shift+Enter.

You can identify code cells by selecting them. Code and Markdown cells have different styles in different notebook environments, but it's usually easy to distinguish them.

Always run notebook code cells in sequence. Skipping cells can result in errors.

Run the following code cell:

```python
# This is your first code cell. This cell contains basic Python code.

# You can run a code cell by selecting it and clicking
# the Run button to the left of the cell, or by pressing Shift+Enter.
# Code output displays below the code.

print("Congratulations, you just ran this code cell")

y = 2 + 2

print("2 + 2 =", y)

```

The code produces this output:

```output
Congratulations, you just ran this code cell

2 + 2 = 4
```

Variables set within a notebook code cell persist between cells, so you can chain cells together.

The next code cell uses the value of `y` from the previous cell:

```python
# Note that output from the last line of a cell is automatically
# sent to the output cell, without needing the print() function.

y + 2
```

The output is:

```output
6
```

## Set up the notebook environment

To avoid having to type or paste complex and repetitive code into notebook cells, most Python notebooks rely on third-party libraries called *packages*.

To use a package in a notebook, you need to:

- Install the package, although Azure ML Compute has most common packages pre-installed.
- Import the package, or some part of the package, usually a module, file, function, or class.

Azure Sentinel notebooks use a Python package called MSTICPy, pronounced *miss-tick-pie*. MSTICPy is a collection of cybersecurity tools for data retrieval, analysis, enrichment, and visualization.

## Initialize the notebook

Most Azure Sentinel notebooks start with a MSTICPy initialization cell. This code:

- Defines the minimum versions for Python and MSTICPy the notebook requires.
- Ensures that the latest version of MSTICPy is installed.
- Imports and runs the `init_notebook` function.

The `init_notebook` function does some of the tedious work of importing other packages and checking configuration, and can install other required packages.

Run the following code cell:

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

The output provides initialization status. A configuration warning like `Missing msticpyconfig.yaml` is expected, because you haven't configured anything yet.

## Configure the notebook

After basic initialization, some notebook components need configuration to connect to the Azure Sentinel workspace and external services. For example, you need an API key to get VirusTotal threat intelligence data. The easiest way to manage configuration data is to store it in a configuration file, *msticpyconfig.yaml*. The only alternative is to type in configuration details and keys each time you use a notebook.

Launching a notebook from Azure Sentinel copies a basic configuration file, *config.json*, to your workspace folder. You can see this file in the file browser. This file contains details about your Azure Sentinel workspace, but has no configuration settings for other external services.

If you don't have a *msticpyconfig.yaml* file in your workspace folder, the `init_notebook` initialization function creates one and populates it with the Azure Sentinel workspace data from the *config.json* file.

> [!TIP]
> If you don't see a *msticpyconfig.yaml* file in your user folder after initialization, select the Refresh icon at the top of the file browser.

- For more information about MSTICPy configuration, see [MSTICPy Package Configuration](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html)
- For more information about the MSTICPy settings editor, see [MSTICPy Settings Editor](https://msticpy.readthedocs.io/en/latest/getting_started/SettingsEditor.html)
- For a complete configuration walkthrough, see the notebook [Configuring Notebook Environment](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/master/ConfiguringNotebookEnvironment.ipynb).
- For a walkthrough of configuring all *msticpyconfig.yaml* settings, see the [MPSettingsEditor notebook](https://github.com/microsoft/msticpy/blob/master/docs/notebooks/MPSettingsEditor.ipynb).
- The Azure-Sentinel-Notebooks GitHub repo also contains a template *msticpyconfig.yaml* file with commented-out sections, which might help you understand the settings.

### Settings editor

Run the following code cell:

```python
from msticpy.config import MpConfigEdit
import os

mp_conf = "msticpyconfig.yaml"

# check if MSTICPYCONFIG is already an env variable
mp_env = os.environ.get("MSTICPYCONFIG")
mp_conf = mp_env if mp_env and Path(mp_env).is_file() else mp_conf

if not Path(mp_conf).is_file():
    print(
        "No msticpyconfig.yaml was found!",
        "Please check that there is a config.json file in your workspace folder.",
        "If this is not there, go back to the Azure Sentinel portal and launch",
        "this notebook from there.",
        sep="\n"
    )
else:
    mpedit = MpConfigEdit(mp_conf)
    mpedit.set_tab("AzureSentinel")
    display(mpedit)
```

After you run the preceding code, the output shows the settings editor. You can check the *msticpyconfig.yaml* settings in the editor. You shouldn't need to change anything unless you add additional workspaces.

At this stage, you should only see two entries in the editor's Azure Sentinel tab:

- An entry with your Azure Sentinel workspace name
- An entry named **Default** with the same settings

MSTICPy lets you store configurations for multiple Azure Sentinel workspaces and switch between them. The **Default** entry lets you authenticate to a specific workspace without having to name it explicitly.

If you have multiple Azure Sentinel workspaces, you can add them in the settings editor. You can choose to keep one workspace as the default. Or, delete the Default entry if you always want to connect to your workspaces by name.

> [!NOTE]
> In the Azure ML environment, the settings editor might take 10-20 seconds to appear.

After you verify the settings, select **Save Settings**.

### Add threat intelligence provider settings

This notebook uses [VirusTotal](https://www.virustotal.com) (VT) as a threat intelligence source. To use VirusTotal threat intelligence lookup, you need a VirusTotal account and API key.

You can sign up for a free VT account at the [VirusTotal getting started page](https://developers.virustotal.com/v3.0/reference#getting-started). If you're already a VirusTotal user, you can use your existing key.

> [!WARNING]
> If you're using a VT enterprise key, don't store it in the *msticpyconfig.yaml* file. MSTICPy supports storing secrets in Azure Key Vault. For more information, see [Specify secrets as Key Vault secrets](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html#specifying-secrets-as-key-vault-secrets) in the MSTICPY documentation. Sign up for and use a free account until you can set up Key Vault storage.

As well as VirusTotal, MSTICPy supports a range of other threat intelligence providers. For a list, see [Threat intelligence providers](https://msticpy.readthedocs.io/en/latest/data_acquisition/TIProviders.html).

To add VirusTotal details in the settings editor:

1. Run this code cell:
   
   ```python
   mpedit.set_tab("TI Providers")
   mpedit
   ```
   
1. Select **VirusTotal** from the **Add prov** dropdown list.
   
1. Select **Add**.
   
1. Under **Auth Key**, select **Text** next to **Storage** option.
   
1. Paste your API key in the **Value** text box.
   
1. Select **Update**, and then select **Save Settings** at the bottom of the settings editor.

Select **Help** for more instructions and links to detailed documentation.

### Add GeoIP provider settings

Azure Sentinel notebooks often use geolocation lookup services for IP addresses. You can use [MaxMind GeoLite2](https://www.maxmind.com) for IP geolocation information. GeoLite2 uses a database that requires an account key to download. You can sign up for a free account and key at the [Maxmind signup page](https://www.maxmind.com/en/geolite2/signup).

To use IPStack as an alternative to GeoLite2, see [MSTICPy GeoIP Providers documentation](https://msticpy.readthedocs.io/en/latest/data_acquisition/GeoIPLookups.html).

Once you have an account:

1. Run this code cell:
   
   ```python
   mpedit.set_tab("GeoIP Providers")
   mpedit
   ```
   
1. In the settings editor, select **VirusTotal** from the **Add prov** dropdown list.
   
1. Select **Add**.
   
1. Under **Auth Key**, select **Text** next to **Storage** option.
   
1. Paste your API key in the **Value** text box.
   
1. Select **Update**, and then select **Save Settings** at the bottom of the settings editor.

### Validate settings

To validate your settings, select **Validate settings** in the settings editor.

You might see some warnings about missing sections, but shouldn't see any about the Azure Sentinel, TIProviders, or GeoIP Providers settings.

Select the **Close** button to hide the validation output.

If you need to make any changes because of the validation, save your changes by selecting **Save Settings**.

### Load saved settings

You've saved your settings to the *msticpyconfig.yaml* file on disk. However, MSTICPy doesn't automatically reload these settings. To force MSTICPy to reload from the new configuration file, run the next code cell:

```python
import msticpy
msticpy.settings.refresh_config()
```

### Optional: Set a MSTICPYCONFIG environment variable

By default, MSTICPy looks for the *msticpyconfig.yaml* configuration file only in the current folder. A **MSTICPYCONFIG** environment variable lets MSTICPy find this file in other locations. Setting a **MSTICPYCONFIG** variable is especially convenient if you're using notebooks locally, or have a deep or complex folder structure.

On Azure ML, the  `nb_check` script in the initialization cell automatically sets the **MSTICPYCONFIG**  environment variable, if it's not already set. The script looks for a *msticpyconfig.yaml* file in the current directory or in the root of your Azure ML user folder.

For more detailed instructions, see *Setting the path to your msticpyconfig.yaml* in the [Configuring Notebook Environment](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/master/ConfiguringNotebookEnvironment.ipynb) notebook.

> [!WARNING]
> If you store secrets like API keys in the *msticpyconfig.yaml* file, either store the file on the Compute instance, or use Azure Key Vault to store the secrets. For more information, see [Specify secrets as Key Vault secrets](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html#specifying-secrets-as-key-vault-secrets) in the MSTICPy documentation.

## Azure Sentinel queries

Now that you've initialized your environment and configured your workspace, use the MSTICPy `QueryProvider` class to test the notebook. The main function of the `QueryProvider` class is to query data from a data source to make it available to view and analyze in a notebook.

Most query providers come with built-in queries for common data operations. You can also use a query provider to run custom queries against Azure Sentinel data.

Once you load a query provider, you usually need to authenticate to the data source, in this case Azure Sentinel.

The `QueryProvider` class supports other data sources besides Azure Sentinel, including Microsoft Defender for Endpoint, Splunk, Microsoft Graph API, and Azure Resource Graph.

Query results are always returned as *pandas* DataFrames. For more information about pandas, see **Introduction to Pandas** in the **A Tour of Cybersec notebook features** notebook.

For more information about configuring and using query providers, see the [MSTICPy Documentation](https://msticpy.readthedocs.io/en/latest/data_acquisition/DataProviders.html#instantiating-a-query-provider).

### Load the QueryProvider

Run the following code cell to load the `QueryProvider` for `AzureSentinel`. The code passes the workspace details from the *msticpyconfig.yaml* file, and connects.

> [!NOTE]
> If you see a warning `Runtime dependency of PyGObject is missing` when loading the Azure Sentinel driver, see the [FAQ section](#faqs). The warning doesn't impact notebook functionality.

```python
# Initialize a QueryProvider for Azure Sentinel
qry_prov = QueryProvider("AzureSentinel")
```

### Authenticate

Next, you need to authenticate to your Azure Sentinel workspace using [device authorization](/azure/active-directory/develop/v2-oauth2-device-code) with your Azure credentials.

Device authorization adds another factor to the authentication by generating a one-time device code that you supply as part of the authentication process.

To authenticate using device authorization:

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
   
   :::image type="content" source="media/notebook-get-started/device-authorization.png" alt-text="Screenshot showing a device authorization code.":::

   Some Jupyter notebook interfaces have a clickable button that copies the code to the clipboard and then opens a browser window to the devicelogin URI. The default Azure ML notebook interface doesn't have this capability. You need to manually select and copy the code to the clipboard.
   
1. Go to [https://microsoft.com/devicelogin](https://microsoft.com/devicelogin) and paste in the code.
   
   > [!NOTE]
   > The devicelogin URL might be different for government or national Azure clouds.
   
1. Authenticate with your Azure credentials.
   
   :::image type="content" source="media/notebook-get-started/authorization-process.png" alt-text="Screenshot showing the device authorization process.":::
   
1. Once you see the final box in the previous image, you can close that tab and return to the notebook.
   
   You should see the following output:
   
   :::image type="content" source="media/notebook-get-started/authorization-complete.png" alt-text="Screenshot showing that the device authorization process is complete.":::
   
> [!NOTE]
> Once authenticated, you shouldn't need to re-authenticate if you restart the kernel. The Compute caches a *refresh token* that it can reuse until the token times out. You need to reauthenticate if you restart your Compute instance or switch to a different instance.

### View the Azure Sentinel workspace data schema

You can query the Azure Sentinel workspace data schema to help understand what data is available to query.

The AzureSentinel QueryProvider has a `schema_tables` property that gives you a list of schema tables and the column names and data types for each table. Run the following code cell to see the first 10 tables in the schema:

```python
# Get list of tables in the Workspace with the 'schema_tables' property
print("Sample of first 10 tables in the schema")
qry_prov.schema_tables[:10]  # Output only a sample of tables for brevity
                             # Remove the "[:10]" to see the whole list
```

This output appears:

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

### View built-in MSTICPy queries

MSTICPy includes many built-in queries that you can run. You can list available queries with `.list_queries()`, and get specific details about a query by calling it with `"?"` as a parameter

Run the following code cell:

```python
# Get a sample of available queries
print("Sample of queries")
print("=================")
print(qry_prov.list_queries()[::5])  # showing a sample - remove "[::5]" for whole list

# Get help about a query by passing "?" as a parameter
print("\nHelp for 'list_all_signins_geo' query")
print("=====================================")
qry_prov.Azure.list_all_signins_geo("?")
```

This output appears:

```output
    Sample of queries
    =================
    ['Azure.get_vmcomputer_for_host', 'Azure.list_azure_activity_for_account', 'AzureNetwork.az_net_analytics', 'AzureNetwork.get_heartbeat_for_ip', 'AzureSentinel.get_bookmark_by_id', 'Heartbeat.get_heartbeat_for_host', 'LinuxSyslog.all_syslog', 'LinuxSyslog.list_logon_failures', 'LinuxSyslog.sudo_activity', 'MultiDataSource.get_timeseries_decompose', 'Network.get_host_for_ip', 'Office365.list_activity_for_ip', 'SecurityAlert.list_alerts_for_ip', 'ThreatIntelligence.list_indicators_by_filepath', 'WindowsSecurity.get_parent_process', 'WindowsSecurity.list_host_events', 'WindowsSecurity.list_hosts_matching_commandline', 'WindowsSecurity.list_other_events']
    
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

### Use the query browser

The query browser combines both of the previous functions in a scrollable and filterable list. For the selected query, it shows the required and optional parameters, with the full text of the query.

You can't execute queries from the browser, but you can copy and paste the example at the end of each query.

Run the following code cell to display the query browser:

```python
qry_prov.browse_queries()
```

### Run queries with time parameters

Most queries require time parameters, which are difficult to enter and keep track of.

You can use MSTICPy's `nbwidgets.QueryTime` class to define `start` and `end` time parameters for queries.

Each query provider has its own built-in `QueryTime` instance. If a query needs `start` and `end` parameters and you don't supply them, the query uses the built-in time range.

Run the following code cell to open the query time control for the Azure Sentinel query provider:

```python
# Open the query time control for your query provider
qry_prov.query_time
```

You can use this control to set different `start` and `end` query parameters.

### Run a query using this time range

Query results return as a [Pandas DataFrame](https://pandas.pydata.org). A dataframe is a tabular data structure like a spreadsheet or database table.

The **A Tour of Cybersec** notebook has a brief introduction to common pandas operations. For more information about DataFrames, see the user guide at the [Pandas website](https://pandas.pydata.org).

The following code cell runs a query using the query provider time settings. If you change the settings, run the code cell again to apply the new settings.

```python
# The time parameters are taken from the qry_prov time settings
# but you can override this by supplying explict "start" and "end" datetimes
signins_df = qry_prov.Azure.list_all_signins_geo()

if signins_df.empty:
    md("The query returned no rows for this time range. You might want to increase the time range")

# display first 5 rows of any results
# If there is no data, just the column headings display
signins_df.head() 
```

The output displays the first five rows of results. If there's no data, only the column headings display.

### Customizable queries

Most built-in queries support the `add_query_items` parameter.  You can use this parameter to append filters or other operations to the queries.

Azure Sentinel queries use the Kusto Query Language (KQL). For more information about KQL query syntax, see the [Kusto Query Language reference](https://aka.ms/kql).

Run the following code cell to add a data frame that summarizes the number of alerts by alert name. If this query returns too many or too few results, you can change the `28` to a smaller or larger number of days.

```python
from datetime import datetime, timedelta

qry_prov.SecurityAlert.list_alerts(
    start=datetime.utcnow() - timedelta(28),
    end=datetime.utcnow(),
    add_query_items="| summarize NumAlerts=count() by AlertName"
)
```

### Custom queries

Another way to run queries is to pass a full KQL query string to the query provider. The query runs against the connected workspace, and the data returns as a DataFrame.

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

For MSTICPy predefined queries, see the [MSTICPy query reference](https://msticpy.readthedocs.io/en/latest/data_acquisition/DataQueries.html). For more information, see [Running MSTICPy pre-defined queries](https://msticpy.readthedocs.io/en/latest/data_acquisition/DataProviders.html#running-an-pre-defined-query).

### Test VirusTotal and GeoLite2

Threat intelligence and IP location are two common enrichments you apply to queried data.

To test threat intelligence lookup, run the VirusTotal provider with a known bad IP address:

```python
# Create your TI provider
ti = TILookup()

# Look up an IP address
ti_resp = ti.lookup_ioc("85.214.149.236", providers=["VirusTotal"])

ti_df = ti.result_to_df(ti_resp)
ti.browse_results(ti_df, severities="all")
```

The output shows details about the results.

For more information, see the **A Tour of Cybersec notebook features** notebook, and [Threat Intel Lookups in MSTICPy](https://msticpy.readthedocs.io/en/latest/data_acquisition/TIProviders.html).

To test geolocation IP lookup, run the following code:

```python
geo_ip = GeoLiteLookup()
raw_res, ip_entity = geo_ip.lookup_ip("85.214.149.236")
display(ip_entity[0])
```

> [!NOTE]
> You might see the GeoLite driver downloading its database the first time you run this code.

The output shows geolocation information for the IP address.

For more information about MSTICPy GeoIP providers, see [MSTICPy GeoIP Providers](https://msticpy.readthedocs.io/en/latest/data_acquisition/GeoIPLookups.html).

## FAQs

Here are some frequently asked questions about Azure Sentinel notebooks and MSTICPy.

### How can I download all Azure Sentinel-notebooks to my Azure ML workspace?

You can use `git` to download the notebooks. From a notebook, enter the following code into an empty cell and run it.

```python
!git clone https://github.com/Azure/Azure-Sentinel-Notebooks.git azure-sentinel-nb
```

This code creates a copy of the GitHub repo contents in the *azure-sentinel-nb* folder of your user folder. Copy the notebooks you want from this folder to your working directory. This process allows you to easily get updated notebooks.

The command to get updated notebooks from GitHub is:

```python
!cd azure-sentinel-nb && git pull
```

### Can I install MSTICPy by default on a new Azure ML compute?

An Azure ML Compute install script is in the HowTos folder in the Azure-Sentinel-Notebooks repo at [aml-compute-setup.sh](https://github.com/Azure/Azure-Sentinel-Notebooks/master/HowTos/aml-compute-setup.sh).

1. Download the script to your local computer.
   
1. Add a new Compute instance.
   
   :::image type="content" source="media/notebook-get-started/compute-create.png" alt-text="Screenshot that shows creating a new Compute instance.":::
   
1. In the **Advanced** section, enable **Provision with setup script**.
   
1. Browse to the location of the downloaded script.
   
   :::image type="content" source="media/notebook-get-started/compute-script.png" alt-text="Screenshot that shows provisioning with a setup script.":::
   
1. Select **Create** to create the instance.

You can view a log of the custom installation in the */tmp/aml-setup-msticpy.log* log.

### How do I fix error "Runtime dependency of PyGObject is missing" when I load a query provider?

Running the code:

```python

qry_prov = QueryProvider("AzureSentinel")

```

Can output the following Warning:

```output
Runtime dependency of PyGObject is missing.
Depends on your Linux distro, you could install it system-wide by something like:
    sudo apt install python3-gi python3-gi-cairo gir1.2-secret-1
If necessary, please refer to PyGObject's doc:
https://pygobject.readthedocs.io/en/latest/getting_started.html
Traceback (most recent call last):
  File "/anaconda/envs/azureml_py36/lib/python3.6/site-packages/msal_extensions/libsecret.py", line 21, in <module>
    import gi  # https://github.com/AzureAD/microsoft-authentication-extensions-for-python/wiki/Encryption-on-Linux
ModuleNotFoundError: No module named 'gi'
```

This Warning is due to a missing Python dependency, `pygobject`. Creating your compute instance by using the [aml-compute-setup.sh](https://github.com/Azure/Azure-Sentinel-Notebooks/master/HowTos/aml-compute-setup.sh) script in the Azure-Sentinel-Notebooks repo automatically installs `pygobject` in all notebook and Anaconda environments on the Compute.

You can also fix this Warning by running the following code from a notebook:

```python
!conda install --yes -c conda-forge pygobject
```

### Why don't MSTICPy and other packages install properly when switching between the Python 3.6 and 3.8 kernels?

This issue happens intermittently. Using `!pip install pkg` installs correctly in one environment, but then doesn't install in the other environment. The second environment can't import or use the package.

Avoid using `!pip install...` to install packages in Azure ML notebooks. Instead, use one of the following options:

- Use the %pip line magic within a notebook.
  
  ```python
  
  %pip install --upgrade msticpy
  ```

- Install from a terminal.
  
  1. Open a terminal in Azure ML notebooks and run the following commands:
     
     ``` bash
     conda activate azureml_py38
     pip install --upgrade msticpy
     ```
     
  2. Close the terminal and restart the kernel.

### Why aren't my user accounts or credentials cached between notebook runs?

To force caching of credentials for a session, authenticate using Azure CLI.

In an empty notebook cell, enter and run the following code:

```python
!az login
```

The following output appears. In the notebook, the yellow text is hard to see in the default light theme.

```output
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code <9-digit device code> to authenticate.
```
Select and copy the nine-character token from the output, and select the `devicelogin` URL to go to that page. Paste the token into the dialog and continue with signing in as prompted.

When sign-in successfully completes, you see the following output:

```output
Subscription <subscription ID> 'Sample subscription' can be accessed from tenants <tenant ID>(default) and <tenant ID>. To select a specific tenant when accessing this subscription, use 'az login --tenant TENANT_ID'.

The following tenants don't contain accessible subscriptions. Use 'az login --allow-no-subscriptions' to have tenant level access.

<tenant ID> 'foo'
<tenant ID> 'bar'  
[
  {
    "cloudName": "AzureApp",
    "homeTenantId": "<tenant ID>",
    "id": "<ID>",
    "isDefault": true,
    "managedByTenants": [
    ....
```

## Next steps

This notebook walked through the basics of installing MSTICPy and setting up configurations, and briefly introduced:

- QueryProviders and querying data from Azure Sentinel
- Threat Intelligence lookups using VirusTotal
- Geolocation lookups using MaxMind GeoLite2

Go on to look at the following Azure Sentinel notebooks:

- **Configuring your environment** covers all of the configuration options for accessing external cybersecurity resources.
- **A Tour of Cybersec notebook features** describes all the capabilities of notebooks and MSTICPy, and includes:
  - More query examples
  - How to visualize your data
  - A brief introduction to manipulating data with pandas

Also try out any of the notebooks in the [Azure Sentinel Notebooks GitHub repo](https://github.com/Azure/Azure-Sentinel-Notebooks).

## Related resources

- [Jupyter Notebooks: An Introduction](https://realpython.com/jupyter-notebook-introduction/)
- [Threat Hunting in the cloud with Azure Notebooks](https://medium.com/@maarten.goet/threat-hunting-in-the-cloud-with-azure-notebooks-supercharge-your-hunting-skills-using-jupyter-8d69218e7ca0)
- [MSTICPy documentation](https://msticpy.readthedocs.io/)
- [Azure Sentinel Notebooks documentation](notebooks.md)
- [The Infosec Jupyterbook](https://infosecjupyterbook.com/introduction.html)
- [Linux Host Explorer Notebook walkthrough](https://techcommunity.microsoft.com/t5/azure-sentinel/explorer-notebook-series-the-linux-host-explorer/ba-p/1138273)
- [Why use Jupyter for Security Investigations](https://techcommunity.microsoft.com/t5/azure-sentinel/why-use-jupyter-for-security-investigations/ba-p/475729)
- [Security Investigations with Azure Sentinel & Notebooks](https://techcommunity.microsoft.com/t5/azure-sentinel/security-investigation-with-azure-sentinel-and-jupyter-notebooks/ba-p/432921)
- [Pandas Documentation](https://pandas.pydata.org/pandas-docs/stable/user_guide/index.html)
- [Bokeh Documentation](https://docs.bokeh.org/en/latest/)

