---
title: Use Azure Functions to connect Microsoft Sentinel to your data source | Microsoft Docs
description: Learn how to configure data connectors that use Azure Functions to get data from data sources into Microsoft Sentinel.
author: yelevin
ms.topic: how-to
ms.date: 06/05/2023
ms.author: yelevin
---

# Use Azure Functions to connect Microsoft Sentinel to your data source

You can use [Azure Functions](../azure-functions/functions-overview.md), in conjunction with various coding languages such as [PowerShell](../azure-functions/functions-reference-powershell.md) or Python, to create a serverless connector to the REST API endpoints of your compatible data sources. Azure Function Apps then allow you to connect Microsoft Sentinel to your data source's REST API to pull in logs.

This article describes how to configure Microsoft Sentinel for using Azure Function Apps. You may also need to configure your source system, and you can find vendor- and product-specific information links in each data connector's page in the portal, or the section for your service in the [Microsoft Sentinel data connectors reference](data-connectors-reference.md) page.

> [!NOTE]
> - Once ingested in to Microsoft Sentinel, data is stored in the geographic location of the workspace in which you're running Microsoft Sentinel.
>
>     For long term retention, you may also want to store data in Azure Data Explorer. For more information, see [Integrate Azure Data Explorer](store-logs-in-azure-data-explorer.md).
>
> - Using Azure Functions to ingest data into Microsoft Sentinel may result in additional data ingestion costs. For more information, see the [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/) page.

## Prerequisites

Make sure that you have the following permissions and credentials before using Azure Functions to connect Microsoft Sentinel to your data source and pull its logs into Microsoft Sentinel:

- You must have read and write permissions on the Microsoft Sentinel workspace.

- You must have read permissions to shared keys for the workspace. [Learn more about workspace keys](../azure-monitor/agents/agent-windows.md#workspace-id-and-key).

- You must have read and write permissions on Azure Functions to create a Function App. [Learn more about Azure Functions](../azure-functions/index.yml).

- You will also need credentials for accessing the product's API - either a username and password, a token, a key, or some other combination. You may also need other API information such as an endpoint URI.

    For more information, see the documentation for the service you're connecting to and the section for your service in the [Microsoft Sentinel data connectors reference](data-connectors-reference.md) page.

- Install the solution that contains your Azure Functions-based connector from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

## Configure and connect your data source

> [!NOTE]
> - You can securely store workspace and API authorization keys or tokens in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](../app-service/app-service-key-vault-references.md) to use Azure Key Vault with an Azure Function App.
>
> - Some data connectors depend on a parser based on a [Kusto Function](/azure/data-explorer/kusto/query/functions/user-defined-functions) to work as expected. See the section for your service in the [Microsoft Sentinel data connectors reference](data-connectors-reference.md) page for links to instructions to create the Kusto function and alias.


### Step 1: Get your source system's API credentials

Follow your source system's instructions to get its **API credentials / authorization keys / tokens**. Copy and paste them into a text file for later.

You can find details on the exact credentials you'll need, and links to your product's instructions for finding or creating them, on the data connector page in the portal and in the section for your service in the [Microsoft Sentinel data connectors reference](data-connectors-reference.md) page.

You may also need to configure logging or other settings on your source system. You'll find the relevant instructions together with those in the preceding paragraph.
### Step 2: Deploy the connector and the associated Azure Function App

#### Choose a deployment option

# [Azure Resource Manager (ARM) template](#tab/ARM)

This method provides an automated deployment of your Azure Function-based connector using an ARM template.

1. In the Microsoft Sentinel portal, select **Data connectors**. Select your Azure Functions-based connector from the list, and then **Open connector page**.

1. Under **Configuration**, copy the Microsoft Sentinel **workspace ID** and **primary key** and paste them aside.

1. Select **Deploy to Azure**. (You may have to scroll down to find the button.)

1. The **Custom deployment** screen will appear.
    - Select a **subscription**, **resource group**, and **region** in which to deploy your Function App.

    - Enter your API credentials / authorization keys / tokens that you saved in [Step 1](#step-1-get-your-source-systems-api-credentials) above.

    - Enter your Microsoft Sentinel **Workspace ID** and **Workspace Key** (primary key) that you copied and put aside.

        > [!NOTE]
        > If using Azure Key Vault secrets for any of the values above, use the `@Microsoft.KeyVault(SecretUri={Security Identifier})` schema in place of the string values. Refer to Key Vault references documentation for further details.

    - Complete any other fields in the form on the **Custom deployment** screen. See your data connector page in the portal or the section for your service in the [Microsoft Sentinel data connectors reference](data-connectors-reference.md) page.

    - Select **Review + create**. When the validation completes, select **Create**.

# [Manual deployment with PowerShell](#tab/MPS)

Use the following step-by-step instructions to manually deploy Azure Functions-based connectors that use PowerShell functions.

1. In the Microsoft Sentinel portal, select **Data connectors**. Select your Azure Functions-based connector from the list, and then **Open connector page**.

1. Under **Configuration**, copy the Microsoft Sentinel **workspace ID** and **primary key** and paste them aside.

1. **Create a Function App**
    1. From the Azure portal, search for and select **Function App**.

    1. In the **Function App** page, select **Create**. The **Create Function App** wizard will open.

    1. In the **Basics** tab:
        - Select a **subscription** and **resource group**.
        - Give your function app a name.
        - Set **Runtime stack** to *PowerShell Core*.
        - Select the appropriate version number.
        - Select the **region** in which you want to deploy, and then select **Next : Hosting**.

    1. In the **Hosting** tab:
        - Choose the **Storage account** you want to use, or create a new one.
        - Select *Consumption (Serverless)* as your **Plan type**.

    1. Make any other configuration changes you need, then select **Review + create**.

    1. Wait for the "Validation passed" message, then select **Create**.

    1. When the deployment completes, select **Go to resource**.

1. **Import Function App Code**
    1. In the newly created Function App, select **Functions** from the navigation menu.

    1. In the **Functions** page, select **+ Add**.
    
    1. In the **Add function** panel, select the **Timer** trigger.

    1. Enter a unique name for your function and enter a *cron* expression to specify the schedule. The default interval is every 5 minutes.

    1. When the function has been created, select **Code + Test** on the left pane.

    1. Download the Function App Code supplied by your source system's vendor and copy and paste it into the **Function App** *run.ps1* editor, replacing what's there by default. You can find the download link on the connector page or in the section for your service in the [Microsoft Sentinel data connectors reference](data-connectors-reference.md) page.

    1. Select **Save**.

1. **Configure the Function App**
    1. In your Function App's page, select **Configuration** under **Settings** in the navigation menu.

    1. In the **Application settings** tab, select **+ New application setting**.

    1. Add the prescribed application settings for your product individually, with their respective case-sensitive string values. See the data connector page or your product's section of the section for your service in the [Microsoft Sentinel data connectors reference](data-connectors-reference.md) page.

        > [!TIP]
        > If applicable, use the *logAnalyticsUri* application setting to override the log analytics API endpoint if you're using a dedicated cloud. So, for example, if you're using the public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`.
        >

# [Manual deployment with Python](#tab/MPY)

Use the following step-by-step instructions to manually deploy Azure Functions-based connectors that use Python functions. This kind of deployment requires Visual Studio Code.

1. In the Microsoft Sentinel portal, select **Data connectors**. Select your Azure Functions-based connector from the list, and then **Open connector page**.

1. Under **Configuration**, copy the Microsoft Sentinel **workspace ID** and **primary key** and paste them aside.

1. **Deploy a Function App**

    > [!NOTE]
    > You will need to [prepare Visual Studio Code](../azure-functions/create-first-function-vs-code-python.md) (VS Code) for Azure Function development.

    1. Download the Azure Function App file using the link supplied on the data connector page and in the section for your service in the [Microsoft Sentinel data connectors reference](data-connectors-reference.md) page. Extract the archive to your local development computer.

    1. Start VS Code. From the menu bar, select **File > Open Folder...**.

    1. Select the top-level folder from the files extracted from the archive.

    1. Choose the Azure icon in the VS Code Activity bar (on the left). Then, in the **Azure: Functions** area, choose the **Deploy to function app** button. 

        > [!NOTE]
        > If you aren't already signed in, choose the Azure icon in the Activity bar. Then, in the **Azure: Functions** area, choose **Sign in to Azure**.  
        > If you're already signed in, go to the next step.

    1. Provide the following information at the prompts:
        - **Select folder**: Choose a folder from your workspace, or browse to a folder that contains your function app.
        - **Select subscription**: Choose the subscription to use.
        - Select **Create new Function App in Azure**. (Don't choose the **Advanced** option.)
        - **Enter a globally unique name for the function app**: Give your function app a name that would be valid in a URL path. The name you choose will be validated to make sure that it's unique throughout Azure Functions.
        - **Select a runtime**: Choose *Python 3.8*.

    1. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.

    1. Return to your Function App's page for configuration.

1. **Configure the Function App**
    1. In your Function App's page, select **Configuration** under **Settings** in the navigation menu.

    1. In the **Application settings** tab, select **+ New application setting**.

    1. Add the prescribed application settings for your product individually, with their respective case-sensitive string values. See the data connector page or the section for your service in the [Microsoft Sentinel data connectors reference](data-connectors-reference.md) page for the application settings to add.

        - If applicable, use the *logAnalyticsUri* application setting to override the log analytics API endpoint if you're using a dedicated cloud. So, for example, if you're using the public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`.

---

## Find your data

After a successful connection is established, the data appears in **Logs** under *CustomLogs*, in the tables listed in the section for your service in the [Microsoft Sentinel data connectors reference](data-connectors-reference.md) page.

To query data, enter one of those table names - or the relevant Kusto function alias - in the query window.

See the **Next steps** tab in the connector page for some useful sample queries.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics. 

## Next steps

In this document, you learned how to connect Microsoft Sentinel to your data source using Azure Functions-based connectors. To learn more about Microsoft Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](./get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
- [Use workbooks](./monitor-your-data.md) to monitor your data.
