---
 title: include file
 description: include file
 services: bastion
 author: cherylmc
 ms.service: bastion
 ms.topic: include
 ms.date: 03/25/2020
 ms.author: cherylmc
 ms.custom: include file
---
An instance is an optimized Azure VM that is created when you configure Azure Bastion. When you configure Azure Bastion using the Basic SKU, 2 instances are created. If you use the Standard SKU, you can specify the number of instances between 2-50.

| Workload Type* | Session Limit per Instance** |
| --- | --- |
| Light |25 |
| Medium |20 |
| Heavy |2 |

*These workload types are defined here: [Remote Desktop workloads](/windows-server/remote/remote-desktop-services/remote-desktop-workloads)<br>
**These limits are based on RDP performance tests for Azure Bastion. The numbers may vary due to other on-going RDP sessions or other on-going SSH sessions.
