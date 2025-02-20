---
title: Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel
description: Walk through the Getting Started Guide For Microsoft Sentinel ML Notebooks to learn the basics of Microsoft Sentinel notebooks with MSTICPy and queries.
author: austinmccollum
ms.author: austinmc
ms.topic: how-to
ms.date: 02/20/2025
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security analyst, I want to use Jupyter notebooks with MSTICPy in Microsoft Sentinel so that I can efficiently perform threat hunting and data analysis with minimal coding.

---

# Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel

This article describes how to run the **Getting Started Guide For Microsoft Sentinel ML Notebooks** notebook, which sets up basic configurations for running Jupyter notebooks in Microsoft Sentinel and provides examples for running simple queries.

The **Getting Started Guide for Microsoft Sentinel ML Notebooks** notebook uses [MSTICPy](https://msticpy.readthedocs.io/en/latest/), a powerful Python library designed to enhance security investigations and threat hunting within Microsoft Sentinel notebooks. It provides built-in tools for data enrichment, visualization, anomaly detection, and automated queries, helping analysts streamline their workflow without extensive custom coding.

For more information, see [Use notebooks to power investigations](hunting.md#use-notebooks-to-power-investigations) and [Use Jupyter notebooks to hunt for security threats](notebooks.md).

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Prerequisites

Before you begin, make sure you have the required permissions and resources.

|Prerequisite |Description  |
|---------|---------|
|**Permissions**     | To use notebooks in Microsoft Sentinel, make sure that you have the required permissions. <br><br>For more information, see [Manage access to Microsoft Sentinel notebooks](notebooks.md#manage-access-to-microsoft-sentinel-notebooks).         |
|**Python**     |   To perform the steps in this article, you need Python 3.6 or later. <br><br>In Azure Machine Learning, you can use either a Python 3.8 kernel (recommended) or a Python 3.6 kernel. If you use the notebook described in this article in another Jupyter environment, you can use any kernel that supports Python 3.6 or later.<br><br>  To use MSTICPy notebooks outside of Microsoft Sentinel and Azure Machine Learning (ML), you also need to configure your Python environment. Install Python 3.6 or later with the Anaconda distribution, which includes many of the required packages.      |
|[**MaxMind GeoLite2**](https://www.maxmind.com)     |   This notebook uses the MaxMind GeoLite2 geolocation lookup service for IP addresses. To use the MaxMind GeoLite2 service, you need an account key. You can sign up for a free account and key at the [Maxmind signup page](https://www.maxmind.com/en/geolite2/signup).      |
|[**VirusTotal**](https://www.virustotal.com)     |  This notebook uses VirusTotal (VT) as a threat intelligence source. To use VirusTotal threat intelligence lookup, you need a VirusTotal account and API key.  <br><br>     |

> [!WARNING]
> If you're using a VT enterprise key, store it in Azure Key Vault instead of the **msticpyconfig.yaml** file. For more information, see [Specify secrets as Key Vault secrets](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html#specifying-secrets-as-key-vault-secrets) in the MSTICPY documentation.
>
> If you don’t want to set up an Azure Key Vault right now, sign up for and use a free account until you can set up Key Vault storage.

## Install and run the Getting Started Guide notebook

This procedure describes how to launch your notebook with Microsoft Sentinel.

1.  For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Threat management**, select **Notebooks**. For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Threat management** > **Notebooks**.

1. From the **Templates** tab, select **A Getting Started Guide For Microsoft Sentinel ML Notebooks** .
1. Select **Create from template**.
1. Edit the name and select the Azure Machine Learning workspace as appropriate.
1. Select **Save** to save it to your Azure Machine Learning workspace.

1. Select **Launch notebook** to run the notebook. The notebook contains a series of cells:

    - *Markdown* cells contain text and graphics with instructions for using the notebook
    - *Code* cells contain executable code that performs the notebook functions

1. Read and run the code cells in order, using the directions in the notebook. Skipping cells or running them out of order might cause errors later in the notebook.

    Depending on the function being performed, the code in the cell might run quickly, or it might take a few seconds to complete. When the cell is running, the play button changes to a loading spinner, and a status of `Executing` is displayed at the bottom of the cell, together with the elapsed time.

The notebook contains sections for you to run the following tasks:

- **Initialize the notebook and MSTICPy**. Use this section of the notebook to set up your environment and understand the basics of notebooks and MSYTICPy. For more information, see the sample [`msticpyconfig.yaml](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/master/msticpyconfig.yaml) template, which has commented-out sections that might help you understand the settings.

- **Query data from Microsoft Sentinel.** Use this section of the notebook to verify your Microsoft Sentinel settings in MSTICPy, load a QueryProvider to query data from Microsoft Sentinel, authenticate to Microsoft Sentinel, and test your connection.

   If you restart your Compute instance or switch to a different instance, you'll need to re-authenticate to Microsoft Sentinel. For more information, see [Caching credentials with Azure CLI](https://github.com/Azure/Azure-Sentinel-Notebooks/wiki/Caching-credentials-with-Azure-CLI).

- **Configure and test external data providers**. VirusTotal and Maxmind GeoLite2 are the external threat intelligence and geolocation data providers used as examples in this notebook. MSTICPy also supports other threat intelligence and geolocation providers. For more information, see:

    - [Threat intelligence providers](https://msticpy.readthedocs.io/en/latest/data_acquisition/TIProviders.html) in the MSTICPy documentation and [Threat intelligence integration in Microsoft Sentinel](threat-intelligence-integration.md)    
    - [MSTICPy GeoIP Providers documentation](https://msticpy.readthedocs.io/en/latest/data_acquisition/GeoIPLookups.html)

If your notebook doesn't seem to be working as described, restart the kernel and run the notebook from the beginning. For example, if any cell in the notebook takes longer than a minute to run, try restarting the kernel and re-running the notebook. The notebook includes instructions for the basic use of Jupyter notebooks, including restarting the Jupyter kernel.


## Test Key Vault (optional)

This section is relevant if you're using an Azure key vault to store your secrets, and describes how to test your connection to the vault from the notebook. If you didn't add a secret, you don't see any details. If you need to, add a test secret from the Azure Key Vault portal to the vault, and check that it shows in Microsoft Sentinel.

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

After you have your key vault configured, use the **Upload to KV** button in the Data Providers and TI Providers sections to move the selected setting to the vault. MSTICPy generates a default name for the secret based on the path of the setting, such as `TIProviders-VirusTotal-Args-AuthKey`.

If the value is successfully uploaded, the contents of the **Value** field in the settings editor is deleted and the underlying setting is replaced with a placeholder value. MSTICPy uses this value to indicate that it should automatically generate the Key Vault path when trying to retrieve the key.

If you already have the required secrets stored in a Key Vault, you can enter the secret name in the **Value** field. If the secret isn't stored in your default Vault (the values specified in the [Key Vault](https://msticpy.readthedocs.io/en/latest/getting_started/SettingsEditor.html#key-vault) section), you can specify a path of **VaultName/SecretName**.

Fetching settings from a key vault in a different tenant isn't currently supported. For more information, see [Specifying secrets as Key Vault secrets](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html#specifying-secrets-as-key-vault-secrets).

## Customize your queries (optional)

The **Getting Started Guide For Microsoft Sentinel ML Notebooks** notebook provides sample queries for you to use when learning about notebooks. You can customize the built-in queries by adding more query logic, or run complete queries using the `exec_query` function. For example, most built-in queries support the `add_query_items` parameter, which you can use to append filters or other operations to the queries.

1. Run the following code cell to add a data frame that summarizes the number of alerts by alert name:

    ```python
    from datetime import datetime, timedelta

    qry_prov.SecurityAlert.list_alerts(
       start=datetime.utcnow() - timedelta(28),
        end=datetime.utcnow(),
        add_query_items="| summarize NumAlerts=count() by AlertName"
    )
    ```

1. Pass a full Kusto Query Language (KQL) query string to the query provider. The query runs against the connected workspace, and the data returns as a panda DataFrame. Run:

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

## Apply guidance to other notebooks

The steps in this article describe how to run the **Getting Started Guide for Microsoft Sentinel ML Notebooks** notebook in your Azure Machine Learning workspace via Microsoft Sentinel. You can also use this article as guidance for performing similar steps to run notebooks in other environments, including locally. 

Several Microsoft Sentinel notebooks don't use MSTICPy, such as the **Credential Scanner** notebooks, or the PowerShell and C# examples. Notebooks that don't use MSTICpy don't need the MSTICPy configuration described in this article.

Try out other Microsoft Sentinel notebooks, such as:

- **Configuring your Notebook Environment**
- **A Tour of Cybersec notebook features**
- **Machine Learning in Notebooks Examples**
- The **Entity Explorer** series, including variations for accounts, domains and URLs, IP addresses, and Linux or Windows hosts.

For more information, see:

- [Jupyter notebooks with Microsoft Sentinel hunting capabilities](notebooks.md)
- [Advanced configurations for Jupyter notebooks and MSTICPy in Microsoft Sentinel](notebooks-msticpy-advanced.md)
- [Create your first Microsoft Sentinel notebook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/creating-your-first-microsoft-sentinel-notebook/ba-p/2977745) (Blog series)
- [Linux Host Explorer Notebook walkthrough](https://techcommunity.microsoft.com/t5/azure-sentinel/explorer-notebook-series-the-linux-host-explorer/ba-p/1138273) (Blog)


## Related content

For more information, see:

- [MSTICPy documentation](https://msticpy.readthedocs.io/)
- [Jupyter Notebooks: An Introduction](https://realpython.com/jupyter-notebook-introduction/)
- [The Infosec Jupyterbook](https://infosecjupyterbook.com/introduction.html)
- [Why use Jupyter for Security Investigations](https://techcommunity.microsoft.com/t5/azure-sentinel/why-use-jupyter-for-security-investigations/ba-p/475729)
- [Security Investigations with Microsoft Sentinel & Notebooks](https://techcommunity.microsoft.com/t5/azure-sentinel/security-investigation-with-azure-sentinel-and-jupyter-notebooks/ba-p/432921)