---
title: Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel
description: Walk through the Getting Started Guide For Microsoft Sentinel ML Notebooks to learn the basics of Microsoft Sentinel notebooks with MSTICPy and queries.
author: EdB-MSFT
ms.author: edbaynash
ms.topic: how-to
ms.date: 02/20/2025
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
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
|[**MaxMind GeoLite2**](https://www.maxmind.com)     |   This notebook uses the MaxMind GeoLite2 geolocation lookup service for IP addresses. To use the MaxMind GeoLite2 service, you need a license key. You can sign up for a free account and key at the [Maxmind signup page](https://www.maxmind.com/en/geolite2/signup).      |
|[**VirusTotal**](https://www.virustotal.com)     |  This notebook uses VirusTotal (VT) as a threat intelligence source. To use VirusTotal threat intelligence lookup, you need a VirusTotal account and API key. <br><br>If you're using a VT enterprise key, store it an Azure Key Vault instead of the **msticpyconfig.yaml** file. For more information, see [Specify secrets as Key Vault secrets](https://msticpy.readthedocs.io/en/latest/getting_started/msticpyconfig.html#specifying-secrets-as-key-vault-secrets) in the MSTICPY documentation. <br><br>If you don’t want to set up an Azure Key Vault right now, sign up for and use a free account until you can set up Key Vault storage.   |

## Install and run the Getting Started Guide notebook

This procedure describes how to launch your notebook with Microsoft Sentinel.

1. For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Threat management** > **Notebooks**. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Threat management**, select **Notebooks**. 

1. From the **Templates** tab, select **A Getting Started Guide For Microsoft Sentinel ML Notebooks** .
1. Select **Create from template**.
1. Edit the name and select the Azure Machine Learning workspace as appropriate.
1. Select **Save** to save it to your Azure Machine Learning workspace.

1. Select **Launch notebook** to run the notebook. The notebook contains a series of cells:

    - *Markdown* cells contain text and graphics with instructions for using the notebook
    - *Code* cells contain executable code that performs the notebook functions

1. At the top of the page, select your **Compute**.

1. Continue by reading markdown cells and running code cells in order, using the instructions in the notebook. Skipping cells or running them out of order might cause errors later in the notebook.

    Depending on the function being performed, the code in the cell might run quickly, or it might take some time to complete. When the cell is running, the play button changes to a loading spinner, and the status is displayed at the bottom of the cell, together with the elapsed time.

    The first time you run a code cell, it may several a few minutes to start the session, depending on your compute settings. A **Ready** indication is shown when the notebook is ready to run code cells. For example:

    :::image type="content" source="media/notebook-get-started/compute-ready.png" alt-text="Screenshot of a machine learning environment ready to run code cells.":::

The **Getting Started Guide For Microsoft Sentinel ML Notebooks** notebook includes sections for the following activities:

|Name  |Description|
|---------|---------|
|**Introduction**     | Describe notebook basics and provides sample code you can run to see how notebooks work.      |
|**Initializing the notebook and MSTICPy**     | Helps you get your environment ready to run the rest of the notebook.   When initializing the notebook, configuration warnings about missing settings are expected because you didn't configure anything yet.     |
|**Querying Data from Microsoft Sentinel**     | Helps you verify, configure, and test Microsoft Sentinel settings. Use the code in this section to authenticate to Microsoft Sentinel and run a sample query to test the connection.        |
|**Configure and test external data providers (VirusTotal and Maxmind GeoLite2)**     | Helps you configure settings for VirusTotal, as a sample threat intelligence service, and MaxMind GeoLite2, as a sample geo-location lookup service. Use the code in this section to run sample queries against these data providers to test them.|

The code in the **Getting Started Guide For Microsoft Sentinel ML Notebooks** launches the **MpConfigEdit** tool, which has series of tabs for configuring your notebook environment. As you make changes in **MpConfigEdit** tool, make sure to save your changes before continuing. Settings for the notebook are stored in the **msticpyconfig.yaml** file, which is automatically populated with initial details for your workspace. 

Make sure to read through the markdown cells carefully so that you understand the process completely, including each of the settings and the **msticpyconfig.yaml** file. Next steps, extra resources, and frequently asked questions from the [Azure Sentinel Notebooks wiki](https://github.com/Azure/Azure-Sentinel-Notebooks/wiki/) are linked from the end of the notebook.

## Customize your queries (optional)

The **Getting Started Guide For Microsoft Sentinel ML Notebooks** notebook provides sample queries for you to use when learning about notebooks. Customize the built-in queries by adding more query logic, or run complete queries using the `exec_query` function. For example, most built-in queries support the `add_query_items` parameter, which you can use to append filters or other operations to the queries.

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