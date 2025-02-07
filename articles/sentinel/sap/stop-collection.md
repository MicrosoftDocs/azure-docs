---
title: Stop SAP data collection
titleSuffix: Microsoft Sentinel
description: Learn about how to stop Microsoft Sentinel from collecting data from your SAP applications.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 10/08/2024
ai-usage: ai-assisted
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#customerIntent: As an SAP admin, I want to stop Microsoft Sentinel from collecting data from our SAP applications.
---

# Stop SAP data collection

There might be instances where you need to halt the data collection from your SAP applications by the Microsoft Sentinel data connector agent, whether for maintenance, troubleshooting, or other administrative reasons.

This article provides step-by-step instructions on how to stop the ingestion of SAP logs into Microsoft Sentinel and disable the data connector agent.

If you're using the agentless solution (limited preview), remove the data connector and solution from Microsoft Sentinel, and then clean up any resources and [changes you'd made to your SAP system](preparing-sap.md) for the integration. 

## Prerequisites

Before you stop the data collection from your SAP applications, ensure you have administrative access to:

- The Log Analytics workspace that's enabled for Microsoft Sentinel. For more information, see [Roles and permissions in Microsoft Sentinel](../roles.md).
- The SAP data connector agent machine or container.

## Stop log ingestion and disable the connector

To stop ingesting SAP logs into Microsoft and to stop the data stream from the Docker container, sign into your data connector agent machine and run:

```bash
docker stop sapcon-[SID/agent-name]
```

The Docker container stops and doesn't send any more SAP logs to Microsoft Sentinel. This stops both the ingestion and billing for the SAP system related to the connector.

If you need to reenable the Docker container, sign into the data connector agent machine and run:

```bash
docker start sapcon-[SID]
```

To stop ingesting a specific SID for a multi-SID container, make sure that you also delete the SID from the connector page UI in Microsoft Sentinel. This option is relevant only if you [deployed the agent via the portal](deploy-data-connector-agent-container.md#deploy-the-data-connector-agent-from-the-portal-preview).

1. In Microsoft Sentinel, select **Configuration > Data connectors** and search for **Microsoft Sentinel for SAP**.
1. Select the data connector row and then select **Open connector page** in the side pane.
1. In the **Configuration** area on the **Microsoft Sentinel for SAP** data connector page, locate the SID agent you want to remove and select **Delete**.

## Remove the user role and any optional CR installed on your ABAP system

If you're turning off the SAP data connector and stopping log ingestion from your SAP system, you might want to also remove the user role and optional CRs installed on your ABAP system.

To do so, import the deletion CR *NPLK900259* into your ABAP system. For more information, see the [SAP documentation](https://help.sap.com/docs/ABAP_PLATFORM_NEW/4a368c163b08418890a406d413933ba7/e15d9acae75c11d2b451006094b9ea64.html?locale=en-US&version=LATEST).

## Related content

For more information, see:

- [Configure your SAP system for the Microsoft Sentinel solution](preparing-sap.md)
- [Connect your SAP system by deploying your data connector agent container](deploy-data-connector-agent-container.md)
