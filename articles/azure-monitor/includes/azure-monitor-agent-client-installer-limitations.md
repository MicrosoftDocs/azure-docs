---
author: guywi-ms
ms.author: guywild
ms.service: azure-monitor
ms.topic: include
ms.date: 01/03/2024
---

- The data collection rules you create for Windows client machines can only target the entire Microsoft Entra tenant scope. That is, a data collection rule you associate to a monitored object applies to all Windows client machines on which you install Azure Monitor Agent using this client installer within the tenant. **Granular targeting using data collection rules is not supported** for Windows client devices yet.
- Azure Monitor Agent doesn't support monitoring of Windows machines connected via **Azure private links**. 
- The agent installed using the Windows client installer is designed mainly for Windows desktops or workstations that are **always connected**. Although you can install Azure Monitor Agent on laptops using the installer, the agent isn't optimized for battery consumption and network limitations on a laptop.