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

# Configure ML notebooks and MSTICPy for Azure Sentinel

This how-to article walks you through a detailed setup of Azure Sentinel notebooks using the [MSTICPy library](hunting.md#mstic-jupyter-and-python-security-tools), using the **Configuring your Notebook Environment** Jupyter notebook.

MSTICPy is a Python package used by many Azure Sentinel Jupyter notebooks to provide threat hunting and investigation functionality, such as:

- Data querying against Azure Sentinel tables, Microsoft Defender for Endpoint, Splunk, and other data sources.
- TI lookups with VirusTotal, AlienVault OTX, and other TI providers.
- Enrichment functions like GeoIP, IoC extraction, and WhoIs.
- Visualization using event timelines, process trees, and geo mapping.
- Advanced analyses like time series decomposition, anomaly detection, and clustering.

> [!NOTE]
> To use MSTICPy notebooks outside of Azure Sentinel and Azure Machine Learning (ML), you'll also need to configure your Python environment. Install Python 3.6 or later with the Anaconda distribution, which includes many of the required packages.
>

Jupyter notebooks are created, edited, and run in the Azure Sentinel **Notebooks** page, which provides access to your Azure Machine Learning (ML) workspace and terminal. For more information, see [Use notebooks to power investigations](hunting.md#use-notebooks-to-power-investigations).

## About Jupyter notebooks

[Jupyter](http://jupyter.org/) is an interactive development and data manipulation environment presented in a browser. A Jupyter notebook is a document made up of cells that contain interactive code, the code output, and other items such as text and images.

The name Jupyter comes from the core programming languages that it supports, **Ju**lia, **Pyt**hon, and **R**. You can use any of these languages, and others such as PowerShell, in Jupyter notebooks. This notebook uses Python.

Python is a well-established language with many materials and libraries to use for data analysis and security investigation. This capability makes it ideal for Azure Sentinel notebooks. Most notebooks in the [Azure Sentinel GitHub repo](https://github.com/Azure/Azure-Sentinel-Notebooks) use Python.

- For more technical details about Jupyter, see [The Jupyter Project documentation](https://jupyter.org/documentation).
- For more information about notebooks, see [The Infosec Jupyter Book](https://infosecjupyterbook.com).
- For a comprehensive set of Python learnings and tutorials, see [Real Python](https://realpython.com).

## Run the Configuring your Notebook Environment notebook

Run the **Configuring your Notebook Environment** notebook in Azure Sentinel to configure your workspace to work with Jupyter notebooks and MSTICPy.

1. In Azure Sentinel, select **Notebooks**. From the **Templates** tab, select **Configuring your Notebook Environment**.
1. Select **Save notebook** to save the notebook to your Azure ML workspace.
1. Select **Launch notebook** to run the notebook.

Running the **Configuring your Notebook Environment** notebook creates the following files:

- A **config.json** file, with basic MSTICpy configuration information

- A **msticpyconfig.yaml** file, with settings that you'll need to edit for your environment. 

    The settings in the **msticpyconfig.yaml** file include settings that are required for most Azure Sentinel notebooks, such as workspace, TI provider, and geolocation settings, as well as optional configurations such as data providers and APIs and auto-loading options.

> [!TIP]
> For more information, see [Advanced procedures](#advanced-procedures) for creating, editing, and maintaining your **msticpyconfig.yaml** file.
>

## Display your existing msticpyconfig.yaml file

This procedure describes how to display your **msticpyconfig.yaml** file using the MSTICpy editor. The MSTICPy editor requires that you have the `MPConfigEdit` and `MPConfigFile` tools imported.

1. From the Azure Sentinel **Notebooks** page, open an ML terminal. For example:

   :::image type="content" source="media/notebook-configure/open-terminal.png" alt-text="Screenshot showing the Open terminal icon in an Azure ML workspace.":::


1. Run the following code to import the `MPConfigEdit` and `MPConfigFile` tools:

    ```python
    from msticpy.config import MpConfigFile, MpConfigEdit, MpConfigControls
    from msticpy.nbtools import nbwidgets
    from msticpy.common import utility as utils
    ```

1. To view the current settings saved in the **msticpyconfig.yaml** file, run:

    ```python
    mpconfig = MpConfigFile()
    mpconfig.load_default()
    mpconfig.view_settings()

    MpConfigFile
    ```

The MSTICPy editor displays in your ML terminal in Azure Sentinel

> [!NOTE]
> If you don't see the settings editor, and only see a pair of curly brackets in your ML terminal, you may need to create your **msticpyconfig.yaml** file.
>
> If you know that you have a **msticpyconfig.yaml** file, search for it by running the `MpConfigFile` command. When prompted, select **Load file** and then browse to and select your file. If you don't have a **msticpyconfig.yaml file**,[ create one manually](#create-a-new-msticpyconfigyaml-file-manually).
>


## Define Azure Sentinel workspace settings

By default, your workspace information is already defined in your **msticpyconfig.yaml** file. If you're working with multiple workspaces, you can add their details in as well.

1. To view your workspace information, run:

    ```python
    mpedit = MpConfigEdit(settings=mpconfig)
    mpedit.set_tab("AzureSentinel")
    mpedit
    ```

1. Use the **Help** drop-down pane to find more details about adding workspaces and the correct values for your workspaces.

   - When adding more workspaces, the **Name**, **WorkspaceId**, and **TenantId** fields are mandatory.
   - If you work with multiple workspaces and have one that you use frequently, you may want to set it as the default workspace, which creates a duplicate entry named **Default**. Override the default as needed by specifying a specific workspace name when connecting.

1. After you've updated your workspace settings, in the **Conf File** field, enter your file name (**msticpyconfig.yaml**). Select **Safe File** to save your changes.

1. Select **Validate Settings**. If you've only edited the workspace settings, you'll be missing other sections, but should have nothing missing under the **Type Validation Results**. For more information, see [Validate msticpyconfig.yaml settings](#validate-msticpyconfigyaml-settings).

## Define Threat Intelligence providers

While MSTIPy runs primary threat intelligence providers by default, you can invoke secondary providers using the `providers` parameter  to `lookup_ioc()` or `lookup_iocs()`

In the **msticpyconfig.yaml** file, set the `Primary` config setting to `True` or `False` for each provider ID, according to how you want to use them. The `providers` parameter should be a list of strings that identify which providers you want to use.

In the **mstipcypconfig.yaml** file:

- The `Provider` setting includes the `provider ID` value for each threat intelligence provider. Do not modify these values.

- Delete or comment out any section for a threat intelligence provider that you don't want to use.

- To authenticate and view threat intelligence data, most providers require an authorization API key, and some also require a user ID.

    The Azure Sentinel threat intelligence provider also requires your Azure Sentinel workspace and tenant IDs. If you are already signed in to Azure Sentinel, MSTICPy uses any authenticated connection with the same workspace or tenant.

> [!TIP]
> MSTICPy supports a range of TI providers. For more information, see [Threat Intel Lookup](https://msticpy.readthedocs.io/en/latest/data_acquisition/TIProviders.html).
>
> Each TI provider handles account creation and authentication slightly differently. Use the help links in the MSTICPy editor to find out how to set up accounts for each provider. Be sure to store any authentication keys in a safe place.
>

For example, to configure a connection for the [VirusTotal](https://www.virustotal.com) (VT) threat intelligence provider:

1. Get a free VT API key from the [VirusTotal getting started page](https://developers.virustotal.com/v3.0/reference#getting-started), and copy it to the clipboard.

1. Run the following code cell to open the MSTICPy editor to the **TI Providers** tab:

   ```python
   mpedit.set_tab("TI Providers")
   mpedit
   ```

1. In the **TI Providers** tab, select **New prov** > **VirusTotal** > **Add**.

1. Paste your copied VT API key into the **AuthKey** field and select **Save**.

1. Select **Save File** to save your changes.

<a name="env-var"></a>Alternately, you can store the VT AuthKey value in an Azure Key Vault or as an environment variable. Both of these methods are more secure than saving it directly in the configuration file.

For example, for to save your VirusTotal API key as an environment variable:

1. Define the **VT_KEY** environment variable with your API key.

1. In the Azure Sentinel **Notebooks** page, in the MSTICPy editor, change the **Storage** radio button to **EnvironmentVar**.

1. In the **Value** field, enter the variable name (`VT_KEY`), and select **Save**.

1. Select **Save File** to save your changes.


## Define GeoIP providers

To authenticate to GeoIP services, most providers require an authorization API key for access. MSTICPy supports **Maxmind GeoIPLite**, which downloads and uses a local database, and **IP Stack**, which is a purely online solution.

For example, to configure an API key for GeoIPLite:

1. Sign up for a free account and API key at [GeoLite2 Sign Up](https://www.maxmind.com/en/geolite2/signup). Copy the API key value to your clipboard.

1. In the Azure Sentinel **Notebooks** page, open a ML terminal and run the following code cell, which opens the MSTICPy editor to the **GeoIP Providers** tab:

   ```python
   mpedit.set_tab("TI Providers")
   mpedit
   ```

1. In the MSTICPy editor's **GeoIP Providers** tab, select **Add prov** > **GeoIPLite** > **Add**.

1. Paste your Maxmind key into the **Value** field.

1. Set the Maxmind data folder for storing the downloaded GeoIP database.

   - The default value is **~/.msticpy**. Modify this value as needed. 
   - On Windows, this folder is defined as *%USERPROFILE%/.msticpy*.
   - On Linux or macOS, this path is the *.msticpy* folder in your home folder.

1. Select **Save File** to save your changes.

> [!TIP]
> You can also store your key as an environment variable or in an Azure Key Vault, which are more secure than saving the value directly in your **msticpyconfig.yaml** file. 
>
> For more information, see the [sample procedure](#env-var) for threat intelligence providers.
>

## Define Azure authentication and Azure Sentinel APIs

Use Azure authentication to access APIs for Azure Sentinel and other Azure resources.

**To configure Azure APIs**:

1. In the Azure Sentinel **Notebooks** page, open an ML terminal.

1. Run the following code cell to open the MSTICPy editor to the **Data Providers** tab:

    ```python
    mpedit.set_tab("Data Providers")
    mpedit
    ```

1. In the **Data Providers** tab, select **AzureCLI**.

1. Define your authentication using one of the following methods:

   - **Chained authentication** (recommended), using one of the following methods:

      - Credentials set in environment variables
      - Credentials available through an Azure CLI `login` command
      - The Managed Service Identity (MSI) credentials of the machine running the notebook kernel
      - An interactive browser sign-in

      If you use chained authentication, leave the **clientId**, **tenantiId**, and **clientSecret** fields empty.

   - **Client app IDs and secrets**. Define your **clientId**, **tenantiId**, and **clientSecret** fields directly in the **Data Providers** tab.

1. Select **Save File** to save your changes.

## Define auto-loading query providers

Define any query providers that you want to load in the MSTICPy editor automatically when you run the launch a Jupyter notebook, either using the Azure Sentinel UI or using the `nbinit.init_notebook` command.

> [!TIP]
> If you frequently author new notebooks, auto-loading query providers can save you time by ensuring that required providers are loaded before other components, such as pivot functions and notebooklets.

1. In the Azure Sentinel **Notebooks** page, open an ML terminal.

1. Run the following code cell to open the MSTICPy editor to the **Autoload QueryProvs** tab:

    ```python
    mpedit.set_tab("Autoload QueryProvs")
    mpedit
    ```

1. In the **Autoload QueryProv** tab:

   - For Azure Sentinel providers, specify both the provider name and the workspace name you want to connect to.
   - For other query providers, specify the provider name only.

   Available Azure Sentinel workspaces come from the items you configured in the **Azure Sentinel** tab. Other providers are from the list of available provider types in MSTICPy.

   Each provider also has the following optional values:

   - **Auto-connect:** This option is defined as **True** by default, and MSTICPy tries to authenticate to the provider immediately after loading. MSTICPy assumes that you've configured credentials for the provider in your settings. If you do not want to connect after loading automatically, set this value to **False**.

   - **Alias:** When MSTICPy loads a provider, it assigns the provider to a Python variable name. By default, the variable name is **qryworkspace_name** for Azure Sentinel providers and **qryprovider_name** for other providers. Add an alias if you want to use something shorter or easier to type and remember. The variable name will be **qry_alias**.

      Providers you load by this mechanism are added to the MSTICPy `current_providers` attriute, which is used for example in the following code:

      ```python
      import msticpy
      msticpy.current_providers
    ```

1. Select **Save File** to save your changes.

## Define auto-loaded MSTICPy components

Define the components you want to load automatically in the MSTICPy editor when launching a Jupyter notebook, such as by using the Azure Sentinel UI or when running the `nbinit.init_notebook` command.

Supported components include, in the following order:

1. **TILookup:** The [TI provider library](#define-threat-intelligence-providers)
1. **GeoIP:** The [GeoIP provider](#define-geoip-providers) you want to use
1. **AzureData:** The module you use to query details about [Azure resources](#define-azure-authentication-and-azure-sentinel-apis)
1. **AzureSentinelAPI:** The module you use to query the [Azure Sentinel API](#define-azure-authentication-and-azure-sentinel-apis)
1. **Notebooklets:** Notebooklets from the [msticnb package](https://msticnb.readthedocs.io/en/latest/)
1. **Pivot:** Pivot functions

> [!NOTE]
> The components load in this order because the Pivot component needs query and other providers loaded to find the pivot functions that it attaches to entities. For more information, see [MSTICPy documentation](https://msticpy.readthedocs.io/en/latest/data_analysis/PivotFunctions.html).
>

**To configure auto-loaded MSTICPy components**:

1. In the Azure Sentinel **Notebooks** page, open an ML terminal.

1. Run the following code cell to open the MSTICPy editor to the **Autoload Components** tab:

   ```python
   mpedit.set_tab("Autoload Components")
   mpedit
   ```

1. Some components, like **TILookup** and **Pivot,** don't require any parameters. Define parameter values for other components to determine MSTICPy settings. 

   For example:

   - **GeoIpLookup**.  Enter the name of the GeoIP provider you want to use, either *GeoLiteLookup* or *IPStack*.  For more information, see [Define GeoIP providers](#define-geoip-providers).

   - **AzureData and AzureSentinelAPI components**.  Define the following values:

      - **auth_methods:** Override the default settings for AzureCLI, and connect using the selected methods.
      - **Auto-connect:** Set to false to load without connecting.

      For more information, see [Define Azure authentication and Azure Sentinel APIs](#define-azure-authentication-and-azure-sentinel-apis).

   - **Notebooklets**. The **Notebooklets** component has a single parameter block: **AzureSentinel**.

      Specify your Azure Sentinel workspace using the following syntax: `workspace:\<workspace name>`. The workspace name must be one of the workspaces defined in the **Azure Sentinel** tab.

      If you want to add more parameters to send to the `notebooklets init` function, specify them as key:value pairs, separated by newlines. For example:

      ```python
      workspace:<workspace name>
      providers=["LocalData","geolitelookup"]
      ```

      For more information, see the [MSTICPy documentation](https://msticnb.readthedocs.io/en/latest/msticnb.html#msticnb.data_providers.init).

1. Select **Save File** to save your changes.

## Validate msticpyconfig.yaml settings

Use the `MpConfigFile` function to help you validate and diagnose any configuration issues. You can run `MpConfigFile` interactively or from Python.

The following examples assume that you've set **MSTICPYCONFIG** to point to your **msticpyconfig.yaml** file. If you haven't, you'll need to use the `load_from_file()` function or the **Load File** button to load the file before validating. 

For more information, see [Set an environment variable for your msticpyconfig.yaml file](#set-an-environment-variable-for-your-msticpyconfigyaml-file).

**To validate all your settings, run:**

```python
mpconfig = MpConfigFile()
mpconfig.load_default()
mpconfig.validate_settings()
```

**To validate interactively, run:**

```python
mpconfig = MpConfigFile()
mpconfig.load_default()
mpconfig
```

## Advanced procedures

This section describes advanced procedures for creating, editing, and maintaining your **msticpyconfig.yaml** file.
### Create a new msticpyconfig.yaml file manually

This procedure describes how to create a **msticpyconfig.yaml** file from an imported **config.json** file, and is required only if you do not have a **msticpyconfig.file** available.

The **msticpyconfig.file** is created automatically when you [run the Configuring your Notebook Environment notebook](#run-the-configuring-your-notebook-environment-notebook).

1. Open an ML terminal from the Azure Sentinel **Notebooks** page, and run the `MpConfigFile` command.
1. Select **Load file**, and then browse to and select your **config.json** file.
1. Save a copy of the **config.json** file as **msticpyconfig.yaml**.
1. Select **View Settings** to confirm that the settings look correct.

> [!TIP]
> [Define the path to your **msticpyconfig.yaml** file as an environment variable](#set-an-environment-variable-for-your-msticpyconfigyaml-file) to make it easier to load.
>

### Set an environment variable for your msticpyconfig.yaml file

Defining the path to your **msticpyconfig.yaml** file in an environment variable allows you to store your file in a known location and make sure that you always load the same settings.

Use multiple configuration files, with multiple environment variables, if you want to use different settings for different notebooks.

1. Decide on a location for your **msticpyconfig.yaml** file, such as in **~/.msticpyconfig.yaml** or **%userprofile%/msticpyconfig.yaml**.

   If you're working in Azure ML, you may want to leave your **msticpyconfig.yaml** file in the Azure ML file storage, or you might want to move it to your Compute instance.

   If you leave it in the Azure ML file storage, the `nb_check.check_versions` function at the start of the notebook automatically finds the file in your root folder using the **MSTICPYCONFIG** environment variable. However, if you are storing any secret keys in your **msticpyconfig.yaml** file, we recommend that you store it on your Compute instance. The Azure ML file storage is shared, while the Compute instance is accessible only to the user who created it.

   For more information, see [What is an Azure Machine Learning compute instance?](/azure/machine-learning/concept-compute-instance).

1. If needed, copy your **msticpyconfig.yaml** file to your selected location.

1. Set the **MSTICPYCONFIG** environment variable to point to that location.

Use one of the following procedures to define the **MSTICPYCONFIG** environment variable:

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

    > [!NOTE]
    > If the Jupyter server had started before you connected, such as when you access the ML terminal from within Azure Sentinel, the Jupyter processes don't inherit any environment variables from your **.bashrc** file.
    >

1. Set the environment variable in one of following locations.

    - **An *nbuser_settings.py* file at the root of your user folder**.  While this process is simpler and less intrusive than editing the **kernel.json** file, it's only supported when you run the `check_versions` function at the start of your notebook code. While this is the default behavior, if you run the notebook code without first running `check_versions`, MSTICPy may not be able to find the configuration file.

        1. In the Azure ML terminal, create the **nbuser_settings.py** file in the root of your user folder, which is the folder with your username.
        1. In the **nbuser_settings.py** file, add the following lines:

            ```python
              import os
              os.environ["MSTICPYCONFIG"] = "~/msticpyconfig.yaml"
            ```

    - **The *kernel.json* file for your Python kernel**. Use this procedure if you plan on running the notebook manually, and possibly without the `check_versions` function at the start.

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

## Next steps

For more information, see:

- [Use Jupyter Notebook to hunt for security threats](notebooks.md)
- [Get started with ML notebooks in Azure Sentinel](notebook-get-started.md)
- [MSTICPy Package Configuration](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html)
- [MSTICPy Settings Editor](https://msticpy.readthedocs.io/en/latest/getting_started/SettingsEditor.html)
- [Threat Intel Lookup](https://msticpy.readthedocs.io/en/latest/data_acquisition/TIProviders.html)
- [MSTICPy GeoIP Providers](https://msticpy.readthedocs.io/en/latest/data_acquisition/GeoIPLookups.html)

