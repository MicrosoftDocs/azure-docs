---
title: Best practices for data collection rule creation and management in Azure Monitor (preview)
description: Details on the best practices to be followed to correctly create and maintain data collection rule in Azure Monitor.
ms.topic: conceptual
author: brunoga
ms.author: brunoga
ms.date: 12/14/2022
ms.reviwer: 

---



# Best practices for data collection rule creation and management in Azure Monitor (preview)
[Data Collection Rules (DCRs)](data-collection-rule-overview.md) determine how to collect and process telemetry sent to Azure. Some data collection rules will be created and managed by Azure Monitor, while you may create others to customize data collection for your particular requirements. This article describes the structure of DCRs for creating and editing data collection rules in those cases where you need to work with them directly.

When creating a DCR, there are some aspects that need to be considered such as:

- The data source type (performance, events)
- The targets to which the DCR will be associated with
- The destination of collected data

Considering all these factors is critical for a good DCR organization. The above points, they all impact on DCR management effort as well configuration transfer and configuration processing time and resources.

Considering the native granularity, which allow a given DCR to be associated with more than one target virtual machine and vice versa

:::image type="content" source="/media/data-collection-rule-bestpractices/DCR-to-VM-relationship.png" lightbox="/media/data-collection-rule-bestpractices/DCR-to-VM-relationship.png" alt-text="Screenshot of data collection rules to virtual machines relation.":::

, it is important to keep the DCR as simple as possible using less datasources and targets for each datasource.

It means that it not ideal, even not recommended, to create a single DCR containing all the data source, collection items and destination necessary to implement our observability. Below there are several recommendations that could help in better planning DCR creation and maintenance:

| Category | Best practice | Explanation | Impact area |
|:---|:---|:---|:---|
| Data Collection | Create DCR specific to data source type | Creating separate DCRs for performance and events will help in both managing the association granularity based on the target machines and sending the right configuration to the right targets. For instance, creating a DCR to both collect events and performance counters could result in an unoptimal approach. There could be situations in which a given machine (or set of machines) does not have the event logs or performance counters configured in the DCR. In this situation, the virtual machine(s) will be forced to process and execute a configuration that is not correct according to the software installed on it. | Not using different DCRs will force each and every target virtual machine to transfer, process and execute configuration that might be not correct according to the installed software. An excessive compute resource consumption and errors in processing configuration might happen causing the [Azure Monitor Agent (AMA)](../overview.md) becoming unresponsive. Moreover, collecting unnecessary data will increase data ingestion costs. |
| | Create DCR specific to the target machines | Creating separate DCRs based on the target data collection need is key for easy maintenance. | Why creating a single DCR that collects operating system performance counters plus web server counters and database counters? This approach, not only will impact as previously described but also will require more effort when the configuration needs to be updated. Think about managing a template that includes unnecessary entries; this situation is less than ideal and leaves room for errors. |
| Data destination | Create different DCR based on the destination | DCRs have the capability of simultaneously sending data to multiple differ destinations like Azure Monitor Metrics and Azure Monitor Logs. Having DCR(s) specific to destination is helpful in managing the data sovereign or law requirements. Since, being compliant might require to send data only to allowed repository created in allowed regions, having different DCRs allows for a better granular destination targeting | Not separating DCRs based on the location might result in not being compliant with data handling, privacy and access requirements and could make unnecessary collection resulting in unexpected costs. |
