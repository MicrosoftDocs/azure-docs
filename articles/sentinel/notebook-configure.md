--- 
title: Configure ML notebooks and MSTICPy for Azure Sentinel | Microsoft Docs
description: Walk through the Azure Sentinel notebook Configuring your Notebook Environment to configure Azure Sentinel notebooks and the MSTICPy library package.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.topic: how-to
ms.date: 08/08/2021
---

# Configure ML notebooks and MSTICPy

This how-to article walks you through a detailed setup of Azure Sentinel notebooks using the [MSTICPy library](hunting.md#mstic-jupyter-and-python-security-tools), using the **Configuring your Notebook Environment** Jupyter notebook.

The steps in this article include:

- Setting up and configuring the MSTICPy package
- Configuring the **msticpyconfig.yaml** file
- Optional steps for creating and managing a **config.json** file for extra configuration settings

> [!NOTE]
> To use MSTICPy notebooks outside of Azure Sentinel and Azure Machine Learning (ML), you'll also need to configure your Python environment. Installing Python 3.6 or later with the Anaconda distribution, which includes many of the required packages already installed.
>

## Run the Configuring your Notebook Environment notebook

Run the **Configuring your Notebook Environment** notebook in Azure Sentinel to configure your workspace to work with Jupyter notebooks.

1. In Azure Sentinel, select **Notebooks**, and from the **Templates** tab, select **Configuring your Notebook Environment**.
1. Select **Save notebook** to save the notebook to your Azure ML workspace.
1. Select **Launch notebook** to run the notebook.

## Configure the msticpyconfig.yaml file

Most of this notebook covers configuring MSTICPy by setting up the *msticpyconfig.yaml* file. Many of the settings are optional, but configuring them incorrectly causes some loss of functionality. For example, using Threat Intelligence (TI) providers usually requires an API key. You can enter the key every time you run the notebook, but to save time and avoid errors, you should put the key in the configuration file. Every IP address lookup should be in the configuration file.

The configuration section takes you through creating settings for:

- Azure Sentinel workspaces
- TI providers
- Geolocation IP (GeoIP) lookup providers
- Other data providers such as Azure APIs
- Azure Key Vault
- Autoloading options

You need the first three configurations to fully use most Azure Sentinel notebooks.

MSTICPy is a Python package that most Azure Sentinel Jupyter notebooks use. MSTICPy provides threat hunting and investigation functionality, including:

- Data querying against Azure Sentinel tables, Microsoft Defender for Endpoint, Splunk, and other data sources.
- TI lookups with VirusTotal, AlienVault OTX, and other TI providers.
- Enrichment functions like GeoIP, IoC extraction, and WhoIs.
- Visualization using event timelines, process trees, and geo mapping.
- Advanced analyses like time series decomposition, anomaly detection, and clustering.

A *config.json* file provides basic MSTICPy configuration information, but the following features need more configuration in the *msticpyconfig.yaml* file:

- TI provider connection information
- GeoIP connection information
- Defender for Endpoint and Azure API connection information
- Key Vault configuration for storing secrets
- More than one Azure Sentinel workspace

Notebooks read the *msticpyconfig.yaml* file from the current directory, or you can set an **MSTICPYCONFIG** environment variable that points to its location.

The most widely used *msticpyconfig.yaml* sections are:

- **TI Providers:** Primary providers run by default. Secondary providers don't run by default, but you can invoke them by using the `providers` parameter to `lookup_ioc()` or `lookup_iocs()`. Set the `Primary` config setting to `True` or `False` for each provider ID, according to how you want to use them. The `providers` parameter should be a list of strings that identify the providers to use.
  
  - The `provider ID` is in the `Provider:` setting for each of the TI providers. Don't alter this value.
  - Delete or comment out the section for any TI Providers you don't want to use.
  - For most providers, you need to supply an authorization API key, and in some cases a user ID for each provider.
  - For the Azure Sentinel TI provider, you need the workspace ID and tenant ID, and need to authenticate to access the data. The connection reuses any existing authenticated connection with the same workspace or tenant.

- **GeoIP Providers:** Like TI providers, GeoIP services usually need an API key for access.

- **BrowShot:** The functionality to screenshot a URL in `msticpy.sectools.domain_utils` relies on a service called [BrowShot](https://browshot.com/). You need an API key to use this service, and you need to define the service in the *msticpyconfig.yaml* file. You can configure BrowShot in the **Data Providers** section of the *msticpyconfig.yaml* settings editor.

### Display your existing msticpyconfig.yaml file

Displaying the configuration uses the MSTICPy configuration tools `MPConfigEdit` and `MPConfigFile`, so import these tools first:

```python
from msticpy.config import MpConfigFile, MpConfigEdit, MpConfigControls
from msticpy.nbtools import nbwidgets
from msticpy.common import utility as utils
```
Then run `MpConfigFile` to view your current settings.

```python
mpconfig = MpConfigFile()
mpconfig.load_default()
mpconfig.view_settings()

MpConfigFile
```
The settings editor should display. If you see nothing but a pair of curly braces in the output, that might mean you need to create an *msticpyconfig.yaml* file. If you know you already have a *msticpyconfig.yaml* file, you can search for the file using `MpConfigFile`, and then select **Load file**.

### Import config.json and create a msticpyconfig.yaml file

To create a *msticpyconfig.yaml* file from the *config.json* file, follow these steps:

1. Run `MpConfigFile` to locate your *config.json* file.
1. Select **Load file**.
   
   Use the browse and search controls to find the file. When you find the file, select **Select File**.
   
1. Convert to msticpyconfig format. Save the *msticpyconfig.yaml* file by adding the path in the **Current file** text box, and selecting **Save file**.
1. Select **View Settings** to confirm that the settings look correct.

You can set this file to always load by assigning the path to an environment variable.

### Set an environment variable for your msticpyconfig.yaml file

An environment variable lets you keep a single configuration file in a known location and always load the same settings. You can still use several configuration files if you need different settings for different notebook folders.

1. Decide on a location for your *msticpyconfig.yaml* file, such as in *~/.msticpyconfig.yaml* or *%userprofile%/msticpyconfig.yaml*.
1. Copy your *msticpyconfig.yaml* file to that location.
1. Set the **MSTICPYCONFIG** environment variable to point to that location.
   
If you're working in Azure ML, decide whether to leave your *msticpyconfig.yaml* file in the Azure ML file store or move it to the Compute file system.

If you leave the file in the Azure ML file store, the `nb_check.check_versions` function at the start of the notebook finds the file in your root folder. The function sets the **MSTICPYCONFIG** environment variable to point to the file.

However, if the file has any secret keys, it's best to store the file on the Compute instance. The Azure ML file store is shared storage, but the Compute instance is accessible only to the user who created it.

#### Windows

For Windows, set the environment variable as shown:

:::image type="content" source="media/notebook-configure/windows-environment-variable.png" alt-text="Screenshots that show setting a Windows environment variable.":::
   
#### Linux

For Linux, move the *msticpyconfig.yaml* file to the Compute instance if necessary. Then edit your *.bashrc* file to add the environment variable.

1. Open a terminal in Azure ML.
   
   :::image type="content" source="media/notebook-configure/open-terminal.png" alt-text="Screenshot showing the Open terminal icon in an Azure ML workspace.":::
   
1. Verify that you can access your *msticpyconfig.yaml* file. Your current directory should be your Azure ML file store home directory, mounted in the Compute Linux system. The prompt looks similar to the following example.
   
   ```python
   azureuser@ianhelle-azml7:~/cloudfiles/code/Users/ianhelle$
   ```
   
   You can list all files, including *msticpyconfig.yaml*, by entering `ls`. 
   
1. To move the *msticpyconfig.yaml* file to the Compute file store, enter:
   
   ```python
   mv msticpyconfig.yaml ~
   ```
   
1. Because the Jupyter server started before you connected, its process won't inherit any environment variables from your *.bashrc* file. Use `vi/vim` or `nano` to edit your *.bashrc* file to add an environment variable.
   
   - For vim, enter `vim ~/.bashrc`, and then enter the following commands:
     
     1. Go to end of file: **Shift+G** > **End**.
     1. Create a new line: **a** > **Return**.
     1. Add the following environment variable, depending on whether you moved the file to the Compute file store:
     - If you moved the *msticpyconfig.yaml* file, enter `export MSTICPYCONFIG=~/msticpyconfig.yaml`.
     - If you didn't move the *msticpyconfig.yaml* file, enter<br>`export MSTICPYCONFIG=~/cloudfiles/code/Users/<YOURNAME/msticpyconfig.yaml`.
     1. Press **Esc** to get back to command mode.
     1. Save the file: type **:wq**.
     
   - For nano, enter `nano ~/.bashrc`, and then enter the following commands:
     
     1. Go to end of file: **Alt+/** or **Option+/**.
     1. Add the following environment variable, depending on whether you moved the file to the Compute file store:
     - If you moved the *msticpyconfig.yaml* file, enter `export MSTICPYCONFIG=~/msticpyconfig.yaml`.
     - If you didn't move the *msticpyconfig.yaml* file, enter <br>`export MSTICPYCONFIG=~/cloudfiles/code/Users/<YOURNAME/msticpyconfig.yaml`.
     1. Save the file: **Ctrl+X** followed by **Y**.
   
You can set the environment variable in one of two places:

- The *kernel.json* file for your Python kernel. There are kernels for Python 3.6 and Python 3.8. If you use both kernels, edit both files.
  
  - Python 3.8 location: */usr/local/share/jupyter/kernels/python38-azureml/kernel.json*
  - Python 3.6 location: */usr/local/share/jupyter/kernels/python3-azureml/kernel.json*
  
  1. Make a copy of the file, and open the original in an editor. You might need to use `sudo` to be able to overwrite this file. The file looks something like this example:
     
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
     
  1. Add the following line after the `"language"` item:
     
     ```python
         "env": { "MSTICPYCONFIG": "~/msticpyconfig.yaml" }
     ```
     
     The file should look like this. Be sure to add a comma at the end of the `"language": "python"` line.
     
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
  
- An *nbuser_settings.py* file at the root of your user folder.
  
  In the Azure ML workspace, create the *nbuser_settings.py* file in the root of your user folder, which is the folder with your username, and add the following lines:
  
  ```python
  import os
  os.environ["MSTICPYCONFIG"] = "~/msticpyconfig.yaml"
  ```
  
  The `nb_check.check_versions` function imports the *nbuser_settings.py* file, if it exists, at the start of the notebook. This function sets the environment variable before reading any configuration. This process is simpler and less intrusive than editing the *kernel.json* file. However, the process only works if you run `check_versions`. If you load a notebook without running `check_versions`, MSTICPy might not be able to find its configuration file.

## Azure Sentinel workspace settings

If you loaded a *config.json* file into your *msticpyconfig.yaml* configuration, you should see your workspace information in the settings editor after you run the following code cell. If not, you can add one or more workspaces here. The **Name**, **WorkspaceId**, and **TenantId** fields are mandatory. The other fields are helpful, but aren't required.

```python
mpedit = MpConfigEdit(settings=mpconfig)
mpedit.set_tab("AzureSentinel")
mpedit
```

Use the **Help** drop-down panel to find more information about adding workspaces and finding the correct values for your workspace.

If you use this workspace frequently or all the time, you can set it as the default. Setting a default workspace creates a duplicate entry named **Default** that the notebook uses when you connect to Azure Sentinel without supplying a workspace name. You can override the default by specifying a workspace name at connect time, for example if you're working with multiple workspaces.

When you've finished configuring workspace settings, enter a file name, usually *msticpyconfig.yaml*, into the **Conf File** text box, and select **Save File**.

You can also select **Validate Settings**. This validation should show that you have a few missing sections, but nothing missing under the **Type Validation Results**.

## TI provider setup

If you want to look up IP addresses, URLs, and other items to check for TI reports, you need to add the providers that you want to use. Most TI providers require you to have an account with them and supply an API key or other authentication items when you connect. Most providers have a free-use tier, or in cases like AlienVault OTX, are entirely free. Free tiers for paid providers usually impose a maximum number of requests in a given time period.

Each TI provider handles account creation slightly differently. Use the help links in the settings editor to find out how to set up accounts for each provider. Be sure to store any authentication keys in a safe place.

After you get the required authentication keys, you can configure the TI provider. To use [VirusTotal](https://www.virustotal.com) (VT) as an example:

1. Get a free VT API key from the [VirusTotal getting started page](https://developers.virustotal.com/v3.0/reference#getting-started), and copy it.
1. Run the following code cell to open the settings editor to the **TI Providers** tab:
   
   ```python
   mpedit.set_tab("TI Providers")
   mpedit
   ```
   
1. In the **TI Providers** tab, select **VirusTotal** from the **New prov** dropdown list.
1. Select **Add** to show the values that you need to provide, in this case a single **AuthKey**, also called an **API Key**.
1. Paste your VT API key into the field, and select **Save**.
1. Select **Save File** to save your changes.

You can also opt to store the VT AuthKey as an environment variable. An environment variable is more secure than saving the key in a configuration file.

1. Set the environment variable:
   
   - Windows: `set VT_KEY=<your API key>`
   - Linux/macOS: `export VT_KEY=<your API key>`
   
1. In the settings editor, change the **Storage** radio button to **EnvironmentVar**.
1. Enter the variable name, **VT_KEY** in the example, into the **Value** field, and select **Save**.
1. Select **Save File** to save your changes.

You can also use Azure Key Vault to store secrets like this API key, but you need to set up the Key Vault settings first.

MSTICPy supports a range of other TI providers. For more information, see [Threat Intel Lookup](https://msticpy.readthedocs.io/en/latest/data_acquisition/TIProviders.html).

## GeoIP provider setup

MSTICPy supports two GeoIP providers, Maxmind GeoIPLite and IP Stack. The main difference between the two is that Maxmind downloads and uses a local database, while IPStack is a purely online solution. You need an API key to either download the free database from MaxMind or access the IPStack online lookup.

To use GeoIPLite as an example:

1. Sign up for a free account and API key at [GeoLite2 Sign Up](https://www.maxmind.com/en/geolite2/signup). You need the API for the following steps.
1. Run the following code cell to open the settings editor to the **GeoIP Providers** tab:
   
   ```python
   mpedit.set_tab("TI Providers")
   mpedit
   ```
1. In the settings editor **GeoIP Providers** tab, select **GeoIPLite** from the **Add prov** dropdown list.
1. Select **Add**.
1. Paste your Maxmind key into the **Value** field.
1. Set the Maxmind data folder for storing the downloaded GeoIP database. The default setting is **~/.msticpy**. On Windows, this folder is *%USERPROFILE%/.msticpy*. On Linux or macOS, this path is the *.msticpy* folder in your home folder. Select a different folder name and location if you prefer.
1. Select **Save File** to save your changes.

As with the TI providers, you can opt to store your key as an environment variable or keep it in Key Vault.

## Azure data and Azure Sentinel APIs

To access APIs for Azure Sentinel and Azure resources, you need to use Azure authentication. MSTICPy supports two authentication methods:

- Chained authentication (recommended)
- Client app ID and secret

To configure Azure APIs, run the following code cell to open the settings editor to the **Data Providers** tab:

```python
mpedit.set_tab("Data Providers")
mpedit
```
In the **Data Providers** tab, select **AzureCLI**. The name is for historical purposes only.

Chained authentication can try up to four methods of authentication:

- Credentials set in environment variables
- Credentials available through an Azure CLI `login`
- The Managed Service Identity (MSI) credentials of the machine running the notebook kernel
- Interactive browser sign-in

To use chained authentication, select the methods you want to use, and leave the **clientId**, **tenantiId**, and **clientSecret** fields empty.

## Autoload query providers

This section controls which query providers you want to load automatically, if any, when you run `nbinit.init_notebook`.

Autoloading query providers can save time if you frequently author new notebooks. Autoloading query providers also ensures the right providers are loaded before other components like pivot functions and notebooklets need to use them.

Run the following code cell to open the settings editor to the **Autoload QueryProvs** tab:

```python
mpedit.set_tab("Autoload QueryProvs")
mpedit
```

In the **Autoload QueryProv** tab:

- For Azure Sentinel providers, specify both the provider name and the workspace name you want to connect to.
- For other query providers, just specify the provider name.

Available Azure Sentinel workspaces come from the items you configured in the Azure Sentinel tab. Other providers are from the list of available provider types in MSTICPy.

For each provider, fill out two options:

- **Auto-connect:** If you select this box, MSTICPy will try to authenticate to the provider backend immediately after loading. MSTICPy assumes that you've configured credentials for the provider in your settings. This setting defaults to **True**.
  
- **Alias:** When MSTICPy loads a provider, it assigns the provider to a Python variable name. By default, the variable name is **qryworkspace_name** for Azure Sentinel providers and **qryprovider_name** for other providers. You can add an alias if you want to use something shorter or easier to type and remember. The variable name will be **qry_alias**.

Providers you load by this mechanism are added to the MSTICPy `current_providers` attribute.

```python
   import msticpy
   msticpy.current_providers
```

## Autoloaded component

This section controls which other components you want to load automatically, if any, when you run `nbinit.init_notebook`.

These components can include, in the following order:

1. **TILookup:** The TI provider library
1. **GeoIP:** The GeoIP provider you want to use
1. **AzureData:** The module you use to query details about Azure resources
1. **AzureSentinelAPI:** The module you use to query the Azure Sentinel API
1. **Notebooklets:** Notebooklets from the [msticnb package](https://msticnb.readthedocs.io/en/latest/)
1. **Pivot:** Pivot functions

The components load in this order because the Pivot component needs query and other providers loaded to find the pivot functions that it attaches to entities. For more information, see [pivot functions](https://msticpy.readthedocs.io/en/latest/data_analysis/PivotFunctions.html).

Run the following code cell to open the settings editor to the **Autoload Components** tab:

```python
mpedit.set_tab("Autoload Components")
mpedit
```

Some components, like TILookup and Pivot, don't require any parameters. Others components support or require more settings:

### GeoIpLookup

Enter the name of the GeoIP provider you want to use, either *GeoLiteLookup* or *IPStack*.

### AzureData and AzureSentinelAPI

- **auth_methods:** Override the default settings for AzureCLI, and connect using the selected methods.
- **Auto-connect:** Set to false to load but not connect.

### Notebooklets

Notebooklets has a single parameter block, **AzureSentinel**. At minimum, specify the workspace name in the format **workspace:\<workspace name>**. The workspace name must be one of the workspaces defined in the Azure Sentinel tab.

You can also add more parameters to send to the `notebooklets init` function. Specify these parameters as key:value pairs, separated by newlines.

```python
   workspace:<workspace name>
   providers=["LocalData","geolitelookup"]
```

For more information, see the [msticnb init documentation](https://msticnb.readthedocs.io/en/latest/msticnb.html#msticnb.data_providers.init).

## Validate msticpyconfig.yaml settings

`MpConfigFile` has a validation function that can help you diagnose setup problems.

You can run this function interactively or from Python.

The examples below assume that you've set **MSTICPYCONFIG** to point to your *msticpyconfig.yaml* file. If not, you need to use the `load_from_file()` function or the **Load File** button to load the file before validating.

Run the following code block to validate settings:

```python
mpconfig = MpConfigFile()
mpconfig.load_default()
mpconfig.validate_settings()
```
To validate interactively, run:

```python
mpconfig = MpConfigFile()
mpconfig.load_default()
mpconfig
```

## Next steps

- Use the **MPSettingsEditor** and **MPSettingsEditor** notebooks for a complete guide to settings configuration.
- [MSTICPy Package Configuration](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html).
- [MSTICPy Settings Editor](https://msticpy.readthedocs.io/en/latest/getting_started/SettingsEditor.html).
- [Threat Intel Lookup](https://msticpy.readthedocs.io/en/latest/data_acquisition/TIProviders.html).
- [MSTICPy GeoIP Providers](https://msticpy.readthedocs.io/en/latest/data_acquisition/GeoIPLookups.html).

