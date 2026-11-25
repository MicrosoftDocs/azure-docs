---
title: Pacemaker Cluster Azure Fence Agent Overview
description: Include File for Pacemaker Cluster Azure Fence Agent Overview
services: 
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 08/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---
## Using the Azure Fence Agent
By using the Azure Fence Agent, your cluster can fence nodes by directly calling the Azure APIs to restart failed nodes.

:::image type="content" source="../../articles/sap/workloads/media/includes/high-availability-pacemaker-fence-agent-diagram.png" alt-text="Diagram of Azure Fence Agent in a Pacemaker Cluster.":::

### Benefits
- No extra resources needed.
- Managed Identities remove any credential maintenance.
### Important considerations
- Use Managed Identities for authentication. If you're currently using a service principal, [Update the Azure Fence Agent from SPN to MSI][techcomm-fence-agent-spn-to-msi].
- The Azure fence agent requires outbound connectivity to public Azure endpoints. For more information along with possible solutions, see [Public endpoint connectivity for VMs using standard ILB][azdoc-sap-load-balancer-outbound-connections].
- The monitoring and fencing operations are deserialized. As a result, if there's a longer running monitoring operation and simultaneous fencing event, there's no delay to the cluster failover because the monitoring operation is already running.

[azdoc-sap-load-balancer-outbound-connections]: /azure/sap/workloads/high-availability-guide-standard-load-balancer-outbound-connections
[techcomm-fence-agent-spn-to-msi]: https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/sap-on-azure-high-availability-change-from-spn-to-msi-for/ba-p/3609278