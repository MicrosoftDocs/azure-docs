---
title: Use Azure Functions to connect your data source to Azure Sentinel | Microsoft Docs
description: Learn how to configure data connectors that use Azure Functions to get data from data sources into Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/03/2021
ms.author: yelevin
---
# Connect your <PRODUCT NAME> to Azure Sentinel

You can use Azure Functions together with a RESTful API and various coding languages, such as [PowerShell](../azure-functions/functions-reference-powershell.md), to create a serverless custom connector.


The <PRODUCT NAME> connector allows you to easily connect your <PRODUCT NAME>'s logs to Azure Sentinel, so that you can view the data in workbooks, query it to create custom alerts, and incorporate it to improve investigation. <PRODUCT NAME> integrates with Azure Sentinel using Azure Functions and REST API.

> [!NOTE]
> - Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.
>
> - The use of Azure Functions to ingest data into Azure Sentinel may result in additional data ingestion costs. Check the [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/) page for details.

## Prerequisites

The following are required to connect <PRODUCT NAME> to Azure Sentinel:

- Read and write permissions on the Azure Sentinel workspace.

- Read permissions to shared keys for the workspace. [Learn more about workspace keys](../azure-monitor/agents/log-analytics-agent.md#workspace-id-and-key).

- Read and write permissions on Azure Functions, to create a Function App. [Learn more about Azure Functions](../azure-functions/index.yml).

- Optional - data / credentials requirements

## Configure and connect your data source

> [!NOTE]
> You can securely store workspace and API authorization keys or tokens in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](../app-service/app-service-key-vault-references.md) to use Azure Key Vault with an Azure Function App.

### STEP 1 - Get your source system's API credentials

Follow your source system's instructions to get its API credentials / authorization keys / tokens, in the form of a **Client ID** and a **Client Secret**, and copy/paste them into a text file for later.

### STEP 2 - (Optional) Enable the Security Graph API

To take advantage of sharing data with Azure Sentinel using the Security Graph API, you'll need to [register an application](/graph/auth-register-app-v2) in Azure Active Directory.

This process will give you three pieces of information for use when deploying the Function App below: the **Graph tenant ID**, the **Graph client ID**, and the **Graph client secret**.

### STEP 3 - Deploy the connector and the associated Azure Function App

#### Choose a deployment option

# [Azure Resource Manager (ARM) template](#tab/ARM)

1. In the Azure Sentinel portal, select **Data connectors**. Select your Azure Functions-based connector from the list, and then **Open connector page**.

1. Under **Configuration**, copy the Azure Sentinel **workspace ID** and **primary key** and paste them aside.

1. Select **Deploy to Azure**. (You may have to scroll down to find the button.)

1. The **Custom deployment** screen will appear.
    1. Select a **subscription**, **resource group**, and **region** in which to deploy your Function App.

    1. Enter your **Client ID** and **Client Secret** that you saved in [Step 1](#step-1-get-your-source-systems-api-credentials) above.

    1. Enter your Azure Sentinel **Workspace ID** and **Workspace Key** (primary key) that you copied and put aside.

    1. Select **True** or **False** for the APIs through which you want to collect data.

    1. If you have created an Azure Application to share information with Azure Sentinel using the Security Graph API, select **True** for **Enable Security Graph Sharing** and enter the **Graph tenant ID**, the **Graph client ID**, and the **Graph client secret**.

    1. Select **Review + create**. When the validation completes, click **Create**.

1. **Assign the necessary permissions to your Function App:**

    Azure Functions-based connectors use an environment variable to store log access timestamps. In order for the application to write to this variable, permissions must be assigned to the system assigned identity.

    1. In the Azure portal, navigate to **Function App**.

    1. In the **Function App** blade, select your Function App from the list, then select **Identity** under **Settings** in the Function App's navigation menu.

    1. In the **System assigned** tab, set the **Status** to **On**. 

    1. Select **Save**, and an **Azure role assignments** button will appear. Click it.

    1. In the **Azure role assignments** screen, select **Add role assignment**. Set **Scope** to **Subscription**, select your subscription from the **Subscription** drop-down, and set **Role** to **App Configuration Data Owner**. 

    1. Select **Save**.

# [Manual deployment of Azure Functions](#tab/Manual)

1. **Create a Function App**
    1. From the Azure Portal, search for and select **Function App**.

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

    1. Make any other configuration changes you need, then click **Review + create**.

    1. Wait for the "Validation passed" message, then click **Create**.

    1. When the deployment completes, select **Go to resource**.

1. **Import Function App Code**
    1. In the newly created Function App, select **Functions** from the navigation menu.

    1. In the **Functions** page, select **+ Add**.
    
    1. ***Choose a trigger, and other missing instructions!!!???***

    1. Click on **Code + Test** on the left pane.

    1. Download the Function App Code supplied by your source system's vendor and copy and paste it into the **Function App** *run.ps1* editor.

    1. Click **Save**.

1. **Configure the Function App**
    1. In your Function App's page, select **Configuration** under **Settings** in the navigation menu.

    1. In the **Application settings** tab, select **+ New application setting**.

    1. Add each of the following eight to twelve (8-12) application settings individually, with their respective string values (case-sensitive):

        | Application setting name | Application setting value |
        |-|-|
        | **clientID** | Your API Client ID |
        | **clientSecret** | Your API Client Secret |
        | **workspaceID** | Your Azure Sentinel workspace ID |
        | **workspaceKey** | Your Azure Sentinel workspace primary key |
        | **\<various API connections>** | *True* for each of these you want to enable, and *False* for the others | 
        | **resGroup** | The resource group where you are deploying the Function App |
        | **functionName** | The name you gave to the Function App |
        | **subId** | The subscription ID where you are deploying the Function App |
        | **enableSecurityGraphSharing** | *True* if you are sharing information using the Security Graph API |
        | **If *enableSecurityGraphSharing* is set to *true***: |
        | GraphTenantId | Your Security Graph Tenant ID |
        | GraphClientId | Your Security Graph Client ID
        | GraphClientSecret | Your Security Graph Client Secret
        | logAnalyticsUri (optional) | Override the Log Analytics API endpoint for dedicated cloud.\* |
        | 

        - \* For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: https://`<CustomerId>`.ods.opinsights.azure.us.

1. **Set Permissions for the App**
    1. In your Function App's page, select **Identity** under **Settings** in the navigation menu.

    1. In the **System assigned** tab, toggle the **Status** to *On* and select **Save**.

    1. After your managed identity is created (this may take a few minutes), more options will appear. Select **Azure role assignments**.

    1. In the **Azure role assignments** screen, select **Add role assignment**. Set **Scope** to **Subscription**, select your subscription from the **Subscription** drop-down, and set **Role** to **App Configuration Data Owner**.

    1. Select **Save**.

1. Complete Setup.
1.	Once all application settings have been entered, click Save. Note that it will take some time to have the required dependencies download, so you may see some inital failure messages.



---

## Find your data

After a successful connection is established, the data appears in **Logs** under *CustomLogs*, in the following tables: 

- 
- 
- 

To query data, enter one of the above table names in the query window.

See the **Next steps** tab in the connector page for some useful sample queries.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics. 

## Next steps

In this document, you learned how to connect Azure Functions-based solutions to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.