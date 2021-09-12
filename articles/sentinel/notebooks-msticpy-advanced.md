---
title: Advanced configurations for Jupyter notebooks and MSTICPy in Azure Sentinel | Microsoft Docs
description: Learn about advanced configurations available for Jupyter notebooks with MSTICPy when working in Azure Sentinel.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.topic: how-to
ms.date: 09/12/2021
---

# Advanced configurations for Jupyter notebooks and MSTICPy in Azure Sentinel

This article describes advanced configurations for working with Jupyter notebooks and MSTICPy in Azure Sentinel.

For more information, see [Use Jupyter notebooks to hunt for security threats](notebooks.md) and [Tutorial: Get started with Jupyter notebooks and MSTICPy in Azure Sentinel](notebook-get-started.md).

## Specify authentication parameters for Azure and Azure Sentinel APIs

This procedure describes how to configure authentication parameters for Azure Sentinel and other Azure API resources in your **msticpyconfig.yaml** file.

**To add Azure authentication and Azure Sentinel API settings in the MSTICPy settings editor**:

1. Enter the following code in an empty code cell and run it:

    ```python
    mpedit.set_tab("Data Providers")
    mpedit
    ```

1. In the **Data Providers** tab, select **AzureCLI** > **Add**.

1. Select the authentication methods to use:

    - While you can use a different set of methods from the [Azure defaults](notebook-get-started.md#specify-the-azure-cloud-and-default-azure-authentication-methods), this isn't a typical configuration.
    - Unless you want to use the **env** (environment variable) authentication, leave the **clientId**, **tenantiId**, and **clientSecret** fields empty.
    - While not recommended, MSTICPy also supports using client app IDs and secrets for your authentication. In such cases, define your **clientId**, **tenantId**, and **clientSecret** fields directly in the **Data Providers** tab.

1. Select **Save File** to save your changes.

## Define auto-loading query providers

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

## Define auto-loaded MSTICPy components

This procedure describes how to define other components that are automatically loaded by MSTICPy when you run the `nbinit.init_notebook` function.

Supported components include, in the following order:

1. **TILookup:** The [TI provider library](notebook-get-started.md#add-threat-intelligence-provider-settings)
1. **GeoIP:** The [GeoIP provider](notebook-get-started.md#add-geoip-provider-settings) you want to use
1. **AzureData:** The module you use to query details about [Azure resources](#specify-authentication-parameters-for-azure-and-azure-sentinel-apis)
1. **AzureSentinelAPI:** The module you use to query the [Azure Sentinel API](#specify-authentication-parameters-for-azure-and-azure-sentinel-apis)
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

   - **GeoIpLookup**.  Enter the name of the GeoIP provider you want to use, either *GeoLiteLookup* or *IPStack*.  For more information, see [Add GeoIP provider settings](notebook-get-started.md#add-geoip-provider-settings).

   - **AzureData and AzureSentinelAPI components**.  Define the following values:

      - **auth_methods:** Override the default settings for AzureCLI, and connect using the selected methods.
      - **Auto-connect:** Set to false to load without connecting.

      For more information, see [Specify authentication parameters for Azure and Azure Sentinel APIs](#specify-authentication-parameters-for-azure-and-azure-sentinel-apis).

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


## Switch between Python 3.6 and 3.8 kernels

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


## Set an environment variable for your msticpyconfig.yaml file

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

For more information, see:

|Subject  |More references  |
|---------|---------|
|**MSTICPy**     |      - [MSTICPy Package Configuration](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html)<br> - [MSTICPy Settings Editor](https://msticpy.readthedocs.io/en/latest/getting_started/SettingsEditor.html)<br>    - [Configuring Your Notebook Environment](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/master/ConfiguringNotebookEnvironment.ipynb).<br>    - [MPSettingsEditor notebook](https://github.com/microsoft/msticpy/blob/master/docs/notebooks/MPSettingsEditor.ipynb). <br><br>**Note**: The Azure-Sentinel-Notebooks GitHub repo also contains a template *msticpyconfig.yaml* file with commented-out sections, which might help you understand the settings.      |
|**Azure Sentinel and Jupyter notebooks**     |      - [Jupyter Notebooks: An Introduction](https://realpython.com/jupyter-notebook-introduction/)<br>    - [MSTICPy documentation](https://msticpy.readthedocs.io/)<br>    - [Azure Sentinel Notebooks documentation](notebooks.md)<br>    - [The Infosec Jupyterbook](https://infosecjupyterbook.com/introduction.html)<br>    - [Linux Host Explorer Notebook walkthrough](https://techcommunity.microsoft.com/t5/azure-sentinel/explorer-notebook-series-the-linux-host-explorer/ba-p/1138273)<br>    - [Why use Jupyter for Security Investigations](https://techcommunity.microsoft.com/t5/azure-sentinel/why-use-jupyter-for-security-investigations/ba-p/475729)<br>    - [Security Investigations with Azure Sentinel & Notebooks](https://techcommunity.microsoft.com/t5/azure-sentinel/security-investigation-with-azure-sentinel-and-jupyter-notebooks/ba-p/432921)<br>    - [Pandas Documentation](https://pandas.pydata.org/pandas-docs/stable/user_guide/index.html)<br>    - [Bokeh Documentation](https://docs.bokeh.org/en/latest/)       |
|     |         |

