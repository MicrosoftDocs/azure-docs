---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 09/17/2021
---

Configure different settings for the alert rule in the **Alert rule details** section.

- **Alert rule name** which should be descriptive since it will be displayed when the alert is fired. 
- Optionally provide a **Description** that's included in the details of the alert.
- **Subscription** and **Resource group** where the alert rule will be stored. This doesn't need to be in the same resource group as the resource that you're monitoring.
- **Severity** for the alert. The severity allows you to group alerts with a similar relative importance. A severity of **Error** is appropriate for an unresponsive virtual machine.
- Keep the box checked to **Enable alert upon creation**.
- Keep the box checked to **Automatically resolve alerts**. This will make the alert stateful, which means that the alert is resolved when the condition isn't met anymore. 
