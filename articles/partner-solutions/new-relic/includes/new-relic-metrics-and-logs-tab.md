---
author: ProfessorKendrick
ms.topic: include
ms.date: 01/10/2025
ms.author: kkendrick
---

To set up monitoring of platform metrics for Azure resources by New Relic, select **Enable metrics collection**.

To send subscription-level logs to New Relic, select **Subscription activity logs**.

To send Azure resource logs to New Relic, select **Azure resource logs** for all supported resource types.

:::image type="content" source="media/create/metrics.png" alt-text="Screenshot of the tab for logs in a New Relic resource, with resource logs selected.":::

When the checkbox for Azure resource logs is selected, logs are forwarded for all resources by default.

To filter the set of Azure resources that send logs to New Relic, use inclusion and exclusion rules and set Azure resource tags:

- All Azure resources with tags defined in include rules send logs to New Relic.
- All Azure resources with tags defined in exclude rules don't send logs to New Relic.
- If there's a conflict between inclusion and exclusion rules, the exclusion rule applies.

> [!TIP]
> You can collect metrics for virtual machines and app services by installing the New Relic agent after you create the New Relic resource.

1. After you finish configuring metrics and logs, select **Next**.