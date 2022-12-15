---
title: Best practices for data collection rule creation and management in Azure Monitor
description: Details on the best practices to be followed to correctly create and maintain data collection rule in Azure Monitor.
ms.topic: conceptual
author: brunoga
ms.author: brunoga
ms.date: 12/14/2022
ms.reviewer: 

---



# Best practices for data collection rule creation and management in Azure Monitor
[Data Collection Rules (DCRs)](data-collection-rule-overview.md) determine how to collect and process telemetry sent to Azure. Some data collection rules will be created and managed by Azure Monitor, while you may create others to customize data collection for your particular requirements. This article discusses some best practices that should be applied when creating your own DCRs.

When creating a DCR, there are some aspects that need to be considered such as:

- The type of data that will be collected, also known as data source type (performance, events)
- The target Virtual Machines to which the DCR will be associated with
- The destination of collected data

Considering all these factors, is critical for a good DCR organization. All the above points impact on DCR management effort as well on resource consumption for configuration transfer and processing.

Given the native granularity, which allows a given DCR to be associated with more than one target virtual machine and vice versa, it's important to keep the DCR as simple as possible using fewer data sources each. It's also important to keep the list of collected items in each data source, lean and oriented to the observability scope.

:::image type="content" source="media/data-collection-rule-best-practices/dcr-to-vm-relationship.png" lightbox="media/data-collection-rule-best-practices/dcr-to-vm-relationship.png" alt-text="Screenshot of data collection rules to virtual machines relation.":::

It not ideal, even not recommended, to create a single DCR containing all the necessary data source, collection items and destination to implement our observability. In the following table, there are several recommendations that could help in better planning DCR creation and maintenance:

| Category | Best practice | Explanation | Impact area |
|:---|:---|:---|:---|
| Data Collection | Create DCR specific to data source type and collection item set | Creating separate DCRs for performance and events will help in both managing the association granularity based on the target machines and sending the right configuration to the right targets. For instance, creating a DCR to collect both events and performance counters could result in an unoptimal approach. There could be situations in which a given machine (or set of machines) doesn't have the event logs or performance counters configured in the DCR. In this situation, the virtual machine(s) will be forced to process and execute a configuration that isn't necessary according to the software installed on it. | Not using different DCRs will force each and every target virtual machine to transfer, process and execute configuration that might be not applicable according to the installed software. An excessive compute resource consumption and errors in processing configuration might happen causing the [Azure Monitor Agent (AMA)](../overview.md) becoming unresponsive. Moreover, collecting unnecessary data will increase data ingestion costs. |
| | Create DCR specific to the observability scope | Creating separate DCRs based on the observability needs is key for easy maintenance. It will also allow you to easily associate the DCR to relevant target virtual machines. | Why creating a single DCR that collects operating system performance counters plus web server counters and database counters? This approach, not only will impact as previously described but also will require more effort when the configuration needs to be updated. Think about managing a template that includes unnecessary entries; this situation is less than ideal and leaves room for errors. |
| Data destination | Create different DCR based on the destination | DCRs have the capability of sending data to multiple different destinations, like Azure Monitor Metrics and Azure Monitor Logs, simultaneously. Having DCR(s) specific to destination is helpful in managing the data sovereign or law requirements. Since, being compliant might require to send data only to allowed repositories created in allowed regions, having different DCRs allows for a better granular destination targeting | Not separating DCRs based on the data destination, might result in being not compliant with data handling, privacy and access requirements and could make unnecessary data collection resulting in unexpected costs. |