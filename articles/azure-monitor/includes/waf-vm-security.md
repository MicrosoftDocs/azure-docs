---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 05/19/2023
---

### Design checklist

> [!div class="checklist"]
> - Use other services for security monitoring of your VMs.
> - Consider using Azure private link for VMs to connect to Azure Monitor using a private endpoint.

### Configuration recommendations

| Recommendation | Description |
|:---|:---|
| Use other services for security monitoring of your VMs. | While Azure Monitor can collect security events from your VMs, it isn't intended to be used for security monitoring. Azure includes multiple services such as [Microsoft Defender for Cloud](../../defender-for-cloud/index.yml) and [Microsoft Sentinel](../../sentinel/index.yml) that together provide a complete security monitoring solution. See [Security monitoring](../vm/monitor-virtual-machine.md#security-monitoring) for a comparison of these services. |
| Consider using Azure private link for VMs to connect to Azure Monitor using a private endpoint. | Connections to public endpoints are secured with end-to-end encryption. If you require a private endpoint, you can use [Azure private link](../logs/private-link-security.md) to allow your VMs to connect to Azure Monitor through authorized private networks. Private link can also be used to force workspace data ingestion through ExpressRoute or a VPN. See [Design your Azure Private Link setup](../logs/private-link-design.md) to determine the best network and DNS topology for your environment. |
