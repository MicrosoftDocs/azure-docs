---
author: AbbyMSFT
ms.author: abbyweisberg
ms.service: azure-monitor
ms.topic: include
ms.date: 09/04/2023
---

### Design checklist

> [!div class="checklist"]
> - Use dynamic thresholds.
> - Prefer multi resource alert rules when possible.
> - Use alert processing rules to do stuff at scale.
> - Leverage custom properties to enhance diagnostics
> - Leverage Logic Apps to customize, enrich, and integrate with a variety of systems

### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Use dynamic thresholds. | Dynamic thresholds can be used to reduce the number of false positives. |
| Prefer multi resource alert rules when possible. | Multi resource alert rules can be used to reduce the number of alert rules you need to create and manage. |
| Use alert processing rules to do stuff at scale. | Alert processing rules can be used to reduce the number of alert rules you need to create and manage. |
| Leverage custom properties to enhance diagnostics | Custom properties can be used to add additional context to your alerts. |


