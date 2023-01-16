---
title: 'Logs - Azure Front Door'
description: This article explains how Azure Front Door tracks and monitor your environment with logs.
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 01/16/2023
ms.author: duau
---

# Azure Front Door logs

TODO

## Configure log storage

* Access logs have detailed information about every request that AFD receives and help you analyze and monitor access patterns, and debug issues. 
* Activity logs provide visibility into the operations done on Azure resources.  
* Health probe logs provide the logs for every failed probe to your origin. 
* Web Application Firewall (WAF) logs provide detailed information of requests that gets logged through either detection or prevention mode of an Azure Front Door endpoint. A custom domain that gets configured with WAF can also be viewed through these logs. For more information on WAF logs, see [Azure Web Application Firewall monitoring and logging](../../web-application-firewall/afds/waf-front-door-monitor.md#waf-logs).

Access logs, health probe logs and WAF logs aren't enabled by default. Use the steps below to enable logging. Activity log entries are collected by default, and you can view them in the Azure portal. Logs can have delays up to a few minutes. 

You have three options for storing your logs: 

* **Storage account:** Storage accounts are best used for scenarios when logs are stored for a longer duration and reviewed when needed. 
* **Event hubs:** Event hubs are a great option for integrating with other security information and event management (SIEM) tools or external data stores. For example: Splunk/DataDog/Sumo. 
* **Azure Log Analytics:** Azure Log Analytics in Azure Monitor is best used for general real-time monitoring and analysis of Azure Front Door performance.

## Configure logs

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for Azure Front Door and select the Azure Front Door profile.

1. In the profile, go to **Monitoring**, select **Diagnostic Setting**. Select **Add diagnostic setting**.

   :::image type="content" source="../media/how-to-logging/front-door-logging-1.png" alt-text="Screenshot of diagnostic settings landing page.":::

1. Under **Diagnostic settings**, enter a name for **Diagnostic settings name**.

1. Select the **log** from **FrontDoorAccessLog**, **FrontDoorHealthProbeLog**, and **FrontDoorWebApplicationFirewallLog**.

1. Select the **Destination details**. Destination options are: 

    * **Send to Log Analytics**
        * Select the *Subscription* and *Log Analytics workspace*.
    * **Archive to a storage account**
        * Select the *Subscription* and the *Storage Account*. and set **Retention (days)**.
    * **Stream to an event hub**
        * Select the *Subscription, Event hub namespace, Event hub name (optional)*, and *Event hub policy name*. 

     :::image type="content" source="../media/how-to-logging/front-door-logging-2.png" alt-text="Screenshot of diagnostic settings page.":::

1. Click on **Save**.

## Activity logs

To view activity logs:

1. Select your Front Door profile.

1. Select **Activity log.**

1. Choose a filtering scope and then select **Apply**.

## Next steps

- Learn about [Azure Front Door reports](how-to-reports.md).
- Learn about [Azure Front Door real time monitoring metrics](how-to-monitor-metrics.md).
