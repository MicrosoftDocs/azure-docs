---
title: Configure Azure Defender for IoT agent-based solution
description: Learn how to configure data collection in Azure Defender for IoT agent-based solution
ms.date: 1/21/2021
ms.topic: how-to
---

# Configure Azure Defender for IoT agent-based solution  

This article describes how to configure data collection in Azure Defender for IoT agent-based solution.

## Configure data collection

To configure data collection in Azure Defender for IoT agent-based solution: 

1. Navigate to the Azure portal, and select the IoT Hub that the Defender for IoT is attached to 

1. Under the **Security** menu, select **Settings**. 

1. Select **Data Collection**. 

    :::image type="content" source="media/how-to-configure-agent-based-solution/data-collection.png" alt-text="Select data collection from the security menu settings.":::

## Geolocation and IP address handling 

In order to secure your IoT solution, the IP addresses of the incoming, and outgoing connections for your IoT devices, IoT Edge, and IoT Hub(s) are collected and stored by default. This information is essential, and used to detect abnormal connectivity from suspicious IP address sources. For example, when there are attempts made that try to establish connections from an IP address source of a known botnet, or from an IP address source outside your geolocation. The Defender for IoT service, offers the flexibility to enable and disable the collection of the IP address data at any time. 

To enable, or disable the collection of IP address data: 

1. Open your IoT Hub, and then select **Settings** from the **Security** menu. 

1. Select the **Data Collection** screen and modify the geolocation, and IP address handling settings to suit your needs. 

## Log Analytics creation 

Defender for IoT allows you to store security alerts, recommendations, and raw security data, in your Log Analytics workspace. Log Analytics ingestion in IoT Hub is set to **off** by default in the Defender for IoT solution. It is possible, to attach Defender for IoT to a Log Analytic workspace, and to store the security data there as well. 

There are two types of information stored by default in your Log Analytics workspace by Defender for IoT:
 
- Security alerts.

- Recommendations. 

You can choose to add storage of an additional information type as `raw events`. 

> [!Note] 
> Storing `raw events` in Log Analytics carries additional storage costs. 

To enable Log Analytics to work with micro agent: 

1. Navigate to **Workspace configuration** > **Data Collection**, and switch the toggle to **On**. 

1. Create a new Log Analytics workspace, or attach an existing one. 

1. Verify that the **Access to raw security data** option is selected.  

    :::image type="content" source="media/how-to-configure-agent-based-solution/data-settings.png" alt-text="Ensure Access to raw security data is selected.":::

1. Select **Save**.

Every month, the first 5 gigabytes of data ingested, per customer to the Azure Log Analytics service, is free. Every gigabyte of data ingested into your Azure Log Analytics workspace, is retained at no charge for the first 31 days. For more information on pricing, see, [Log Analytics pricing](https://azure.microsoft.com/pricing/details/monitor/). 

To change the workspace configuration of Log Analytics: 

1. In your IoT Hub, in the **Security** menu, select **Settings**. 

1. Select the **Data Collection** screen, and modify the workspace configuration of Log Analytics settings to suit your needs. 

To access your alerts in your Log Analytics workspace after configuration:

1. Select an alert in Defender for IoT.

1. Select **Investigate alerts in Log Analytics workspace**.

To access your alerts in your Log Analytics workspace after configuration:

1. Select a recommendation in Defender for IoT.

1. Select **Investigate recommendations in Log Analytics workspace**. 
 
For more information on querying data from Log Analytics, see [Get started with queries in Log Analytics](../azure-monitor/logs/get-started-queries.md). 

## Turn off Defender for IoT 

To turn a Defender for IoT service on, or off on a specific IoT Hub: 

1. In your IoT Hub, in the **Security** menu, select **Settings**.

1. Select the **Data Collection** screen, and modify the workspace configuration of Log Analytics settings to suit your needs.

## Next steps 

Advance to the next article to [configure your solution](quickstart-configure-your-solution.md).