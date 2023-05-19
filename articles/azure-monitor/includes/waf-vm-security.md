---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - Use Azure Sentinel for collection and analysis of security events. 
> - Consider using Azure private link for VMs to connect to Azure Monitor using a private endpoint.

### Configuration recommendations

| Recommendation | Description |
|:---|:---|
| Use Microsoft Sentinel for collection and analysis of security events.  | [Microsoft Sentinel](../../sentinel/overview.md) is a complete security information and event management (SIEM) solution that stores its data in a Log Analytics workspace. You can collect security events with Azure Monitor, but you should enable Sentinel for collection and analysis of security events on your VMs. Sentinel uses the [SecurityEvent](/azure/azure-monitor/reference/tables/securityevent) table instead of the [Event](/azure/azure-monitor/reference/tables/event) table which collects additional data for each event. |
| Consider using Azure private link for VMs to connect to Azure Monitor using a private endpoint. | Connections to public endpoints are secured with end-to-end encryption. If you require a private endpoint, you can use [Azure private link](../logs/private-link-security.md) to allow your VMs to connect to Azure Monitor through authorized private networks. Private link can also be used to force workspace data ingestion through ExpressRoute or a VPN. See [Design your Azure Private Link setup](../logs/private-link-design.md) to determine the best network and DNS topology for your environment. |
