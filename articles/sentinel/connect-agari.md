---
title: Connect <PRODUCT NAME> data to Azure Sentinel | Microsoft Docs
description: Learn how to use the <PRODUCT NAME> connector to pull <PRODUCT NAME> logs into Azure Sentinel. View <PRODUCT NAME> data in workbooks, create alerts, and improve investigation.
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
ms.date: 01/26/2021
ms.author: yelevin
---
# Connect your Agari Brand Protection, Phishing Defense and Response to Azure Sentinel

> [!IMPORTANT]
> The <PRODUCT NAME> connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Agari connector allows you to easily connect all your Brand Protection and/or Phishing Defense security solution logs with your Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Brand Protection and Phishing Response customers can take advantage of Threat Intelligence sharing via the Security Graph API. Integration between Agari and Azure Sentinel makes use of REST API.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Brand Protection, Phishing Defense and Response 

Agari can integrate and export logs directly to Azure Sentinel.

1.  Ensure you have your Agari Client ID and Secret keys. Instructions can be found on the [Agari Developers Site](https://developers.agari.com/agari-platform/docs/quick-start).

1. Optional - The Agari Function App has the ability to share threat intelligence with Sentinel via the Security Graph API. To use this feature, you will need to enable the [Sentinel Threat Intelligence Platforms connector](https://docs.microsoft.com/azure/sentinel/connect-threat-intelligence) as well as register an application in Azure Active Directory.

1. In the Azure Sentinel portal, click Data connectors and select Agari Brand Protection and Phishing Defense and then Open connector page.

1. Click on **Deploy** and enter the information from steps 1 and 2 in the Deployment template.

1. Ensure you select **True** for the products you have active subscriptions for.

1. If you have created an Azure Application for use with the Security Graph API, select **True** for Use Security Graph and enter the required information.

> [!NOTE]
> The Agari connector uses an environment variable to store last successful log timestamps. In order for the application to write to this variable, permissions must be assigned to the system assigned identity.

1. In the Azure Portal, navigate to Function App

1. In the Function App, select the Function App Name and select Click on **Identity** and for System assigned Identity, set the status to On. 

1. Next, click on **Azure role assignments** and **Add Role assignment**. Select **Subscription** as the scope, select your subscription and set the Role to **App Configuration Data Owner**. 

1. Click on **Save**."

## Find your data

After a successful connection is established, the data appears in Log Analytics under CustomLogs agari_CL.
To use the relevant schema in Log Analytics for the Agari events, search for agari_CL.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics. 

## Next steps

In this document, you learned how to connect <<Brand Protection and/or Phishing Defense>> to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
