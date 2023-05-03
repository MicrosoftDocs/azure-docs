---
title: Best practices for data collection rule creation and management in Azure Monitor
description: Details on the best practices to be followed to correctly create and maintain data collection rule in Azure Monitor.
ms.topic: conceptual
ms.date: 12/14/2022
ms.reviewer: brunoga

---

# Best practices for data collection rule creation and management in Azure Monitor

[Data Collection Rules (DCRs)](data-collection-rule-overview.md) determine how to collect and process telemetry sent to Azure. Some data collection rules will be created and managed by Azure Monitor, while you may create others to customize data collection for your particular requirements. This article discusses some best practices that should be applied when creating your own DCRs.

When creating a DCR, there are some aspects that need to be considered such as:

- The type of data that will be collected, also known as data source type (performance, events)
- The target Virtual Machines to which the DCR will be associated with
- The destination of collected data

Considering all these factors is critical for a good DCR organization. All the above points impact on DCR management effort as well on resource consumption for configuration transfer and processing.

Given the native granularity, which allows a given DCR to be associated with more than one target virtual machine and vice versa, it's important to keep the DCRs as simple as possible using fewer data sources each. It's also important to keep the list of collected items in each data source lean and oriented to the observability scope.

:::image type="content" source="media/data-collection-rule-best-practices/data-collection-rules-to-vm-relationship.png" lightbox="media/data-collection-rule-best-practices/data-collection-rules-to-vm-relationship.png" alt-text="Screenshot of data collection rules to virtual machines relation.":::

To clarify what an *observability scope* could be, think about it as your preferred logical boundary for collecting data. For instance, a possible scope could be a set of virtual machines running software (for example, "SQL Servers") needed for a specific application, or basic operating system counters or events set used by your IT Admins. It's also possible to create similar scopes dedicated to different environments ("Development", "Test", "Production") to specialize even more.

In fact, it's not ideal and even not recommended to create a single DCR containing all the data sources, collection items and destinations to implement the observability. In the following table, there are several recommendations that could help in better planning DCR creation and maintenance:

| Category | Best practice | Explanation | Impact area |
|:---|:---|:---|:---|
| Data Collection | Define the observability scope | Defining the observability scope is key to an easier and successful DCR management and organization observability scope. It will help clarifying what the collection need is, and from which target virtual machine it should be performed. As previously explained, an observability scope could be a set of virtual machines running software that is common to a specific application, a set of common information for the IT department, etc. As an example, collecting the basic operating system performance counters, such as CPU utilization, available memory, and free disk space, could be seen as a scope for your Central IT Management. | Not having a clearly defined scope doesn't bring clarity and doesn't allow for a proper management. | 
| | Create DCRs specific to the observability scope | Creating separate DCRs based on the observability scope is key for easy maintenance. It will allow you to easily associate the DCRs to the relevant target virtual machines. | Why creating a single DCR that collects operating system performance counters plus web server counters and database counters all together? This approach, not only will force each and every associated virtual machine to transfer, process and execute configuration that is outside of the scope but will also require more effort when the DCR configuration needs to be updated. Think about managing a template that includes unnecessary entries; this situation is less than ideal and leaves room for errors. |
| | Create DCR specific to data source type inside the defined observability scope(s) | Creating separate DCRs for performance and events will help in both managing the configuration and the association with granularity based on the target machines. For instance, creating a DCR to collect both events and performance counters could result in an unoptimal approach. There could be situations in which a given machine (or set of machines) doesn't have the event logs or performance counters configured in the DCR. In this situation, the virtual machine(s) will be forced to process and execute a configuration that isn't necessary according to the software installed on it. | Not using different DCRs will force each and every associated virtual machine to transfer, process and execute configuration that might be not applicable according to the installed software. An excessive compute resource consumption and errors in processing configuration might happen causing the [Azure Monitor Agent (AMA)](../overview.md) becoming unresponsive. Moreover, collecting unnecessary data will increase data ingestion costs. |
| Data destination | Create different DCR based on the destination | DCRs have the capability of sending data to multiple different destinations, like Azure Monitor Metrics and Azure Monitor Logs, simultaneously. Having DCR(s) specific to destination is helpful in managing the data sovereign or law requirements. Since, being compliant might require to send data only to allowed repositories created in allowed regions, having different DCRs allows for a better granular destination targeting | Not separating DCRs based on the data destination, might result in being not compliant with data handling, privacy and access requirements and could make unnecessary data collection resulting in unexpected costs. |

The afore mentioned principles provide a foundation for creating your own DCR management approach that balances maintainability, ease of reuse, granularity, and service limits. DCRs also need shared governance, to minimize both the creation of silos and unnecessary duplication of work.

## Next steps

- [Read more about data collection rules and options for creating them.](data-collection-rule-overview.md)
