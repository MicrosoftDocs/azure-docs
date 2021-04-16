---
title: Connect your Agari Phishing Defense and Brand Protection solutions to Azure Sentinel | Microsoft Docs
description: Learn how to use the Agari Phishing Defense and Brand Protection connector to pull its logs into Azure Sentinel. View Agari data in workbooks, create alerts, and improve investigation.
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
# Connect your Agari Phishing Defense and Brand Protection solutions to Azure Sentinel

> [!IMPORTANT]
> The Agari Phishing Defense and Brand Protection connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The Agari Phishing Defense and Brand Protection connector allows you to easily connect your Brand Protection and Phishing Defense solutions' logs to Azure Sentinel, so that you can view the data in workbooks, query it to create custom alerts, and incorporate it to improve investigation. Agari's solutions integrate with Azure Sentinel using Azure Functions and REST API.

In addition, Brand Protection and Phishing Response customers can take advantage of Threat Intelligence sharing via the Security Graph API.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

The following are required to connect Agari's Phishing Defense and Brand Protection solutions to Azure Sentinel:

- Read and write permissions on the Azure Sentinel workspace.

- Read permissions to shared keys for the workspace. [Learn more about workspace keys](../azure-monitor/agents/log-analytics-agent.md#workspace-id-and-key).

- Read and write permissions on Azure Functions, to create a Function App. [Learn more about Azure Functions](../azure-functions/index.yml).

- Ensure you have your Agari **Client ID** and **Secret keys** (identical across all Agari solutions). See the [Agari developers site](https://developers.agari.com/agari-platform/docs/quick-start) for instructions.

## Configure and connect Agari solutions 

Agari solutions can integrate and export logs directly to Azure Sentinel using an Azure Function App.

> [!NOTE]
> This connector uses Azure Functions to connect to Agari's solutions to pull their logs into Azure Sentinel. This may result in additional data ingestion costs. Check the [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/) page for details.

1. **Collect your Agari API credentials:** 

    Ensure you have your Agari **Client ID** and **Secret keys**. Instructions can be found on the [Agari developers site](https://developers.agari.com/agari-platform/docs/quick-start#generate-api-credentials).

1. **(Optional) Enable the Security Graph API:** 

    The Agari Function App allows you to share threat intelligence with Azure Sentinel via the Security Graph API. To use this feature, you'll need to enable the [Sentinel Threat Intelligence Platforms connector](connect-threat-intelligence.md) and also [register an application](/graph/auth-register-app-v2) in Azure Active Directory.

    This process will give you three pieces of information for use when deploying the Function App below: the **Graph tenant ID**, the **Graph client ID**, and the **Graph client secret**.

1. **Deploy the connector and the associated Azure Function App:** 

    1. In the Azure Sentinel portal, select **Data connectors**. Select **Agari Phishing Defense and Brand Protection (Preview)** and then **Open connector page**.

    1. Under **Configuration**, copy the Azure Sentinel **workspace ID** and **primary key** and paste them aside.

    1. Select **Deploy to Azure**. (You may have to scroll down to find the button.)

    1. The **Custom deployment** screen will appear.

        - Enter your Agari **Client ID** and **Client Secret** (secret keys)

        - Enter your Azure Sentinel **Workspace ID** and **Workspace Key** (primary key) that you copied and put aside.

        - Select **True** or **False** for the Agari solutions you have active subscriptions for.

        - If you have created an Azure Application to share IoCs with Azure Sentinel using the Security Graph API, select **True** for **Enable Security Graph Sharing** and enter the **Graph tenant ID**, the **Graph client ID**, and the **Graph client secret**.

    1. Select **Review + create**. When the validation completes, click **Create**.

1. **Assign the necessary permissions to your Function App:**

    The Agari connector uses an environment variable to store log access timestamps. In order for the application to write to this variable, permissions must be assigned to the system assigned identity.

    1. In the Azure portal, navigate to **Function App**.

    1. In the **Function App** blade, select your Function App from the list, then select **Identity** under **Settings** in the Function App's navigation menu.

    1. In the **System assigned** tab, set the **Status** to **On**. 

    1. Select **Save**, and an **Azure role assignments** button will appear. Click it.

    1. In the **Azure role assignments** screen, select **Add role assignment**. Set **Scope** to **Subscription**, select your subscription from the **Subscription** drop-down, and set **Role** to **App Configuration Data Owner**. 

    1. Select **Save**.

## Find your data

After a successful connection is established, the data appears in **Logs** under *CustomLogs*, in the following tables: 

- `agari_apdtc_log_CL`
- `agari_apdpolicy_log_CL`
- `agari_bpalerts_log_CL`

To query Agari solutions data, enter one of the above table names in the query window.

See the **Next steps** tab in the connector page for some useful sample queries.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics. 

## Next steps

In this document, you learned how to connect Agari Phishing Defense and Brand Protection solutions to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.