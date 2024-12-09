---
title: "Azure Operator Nexus: How to decommision Azure Operator Nexus instance checklist"
description: High-level checklist to cover all essential steps required for decommisioning Azure Operator Nexus instance
author: tonyyam23
ms.author: tonyyam
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus, devx-track-azurecli
ms.topic: how-to
ms.date: 12/03/2024
# ms.custom: template-include
---

# Check list to decommission Azure Operator Nexus instance
This how-to guide provides a high-level checklist on the essential steps required to delete the Azure Nexus resources and associated software running on the devices.



Note: Due to the underlying dependencies and references across these resources, follow the order of this checklist to ensure a smooth and efficient deletion of resources.
Note: Due to the underlying dependencies and references across these resources, follow the order of this checklist to ensure a smooth and efficient deletion of resources.
14) Reset Terminal Server (TS) credentials to default
1) Perform tenant network resources and workload clean up, including but not limited to VMs and Nexus Kubernetes Clusters
2) [Disable/Delete L3 ISD resources](https://learn.microsoft.com/en-us/azure/operator-nexus/howto-delete-layer-3-isolation-domains)
3) [Delete Keysets resources](https://learn.microsoft.com/en-us/azure/operator-nexus/howto-baremetal-bmc-ssh#deleting-a-bmc-keyset)
4) [Delete Cluster resource](https://learn.microsoft.com/en-us/azure/operator-nexus/howto-configure-cluster#delete-a-cluster)
5) [Delete Cluster Manager resource](https://learn.microsoft.com/en-us/azure/operator-nexus/howto-cluster-manager#delete-cluster-manager)
6) [Deprovision Fabric](https://learn.microsoft.com/en-us/azure/operator-nexus/howto-configure-network-fabric#deleting-fabric)
7) [Clean up ACL resources](https://learn.microsoft.com/en-us/azure/operator-nexus/howto-delete-access-control-list-network-to-network-interconnect)
8) [Delete Fabric resource](https://learn.microsoft.com/en-us/azure/operator-nexus/howto-configure-network-fabric#deleting-fabric)
9) [Disable DHCP and put devices into ZTP mode](https://learn.microsoft.com/en-us/azure/operator-nexus/howto-platform-prerequisites#default-setup-for-other-devices-installed)
10) [Delete Network Fabric Controller (NFC) resource](https://learn.microsoft.com/en-us/azure/operator-nexus/howto-configure-network-fabric-controller#delete-network-fabric-controller)
15) Delete Jumpbox/NFC Cluster Vnet/IP
16) Delete Network Fabric Controller (NFC) resource


## Support and questions
For further technical questions or assistance, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).
