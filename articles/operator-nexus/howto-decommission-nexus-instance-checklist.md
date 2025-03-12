---
title: "Azure Operator Nexus: How to decommission Azure Operator Nexus instance checklist"
description: High-level checklist to cover all essential steps required for decommissioning Azure Operator Nexus instance.



author: tonyyam23
ms.author: tonyyam
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus, devx-track-azurecli
ms.topic: how-to
ms.date: 12/03/2024
# ms.custom: template-include
---

# Check list to decommission Azure Operator Nexus instance
## Decommission checklist details

1. Perform tenant network resources and workload clean up, including but not limited to VMs and Nexus Kubernetes Clusters

2. [Disable/Delete L3 ISD (Isolation Domain) resources](./howto-delete-layer-3-isolation-domains.md)

3. [Disable/Delete L2 ISD (Isolation Domain) resources](./howto-configure-isolation-domain.md#delete-l2-isolation-domain)

4. [Delete Keysets resources](./howto-baremetal-bmc-ssh.md#deleting-a-bmc-keyset)

5. [Delete Cluster resource](./howto-configure-cluster.md#delete-a-cluster)

6. [Delete Cluster Manager resource](./howto-cluster-manager.md#delete-cluster-manager)

7. [Deprovision Fabric](./howto-configure-network-fabric.md#deleting-fabric)

8. [Clean up ACL (Access Control List) resources](./howto-delete-access-control-list-network-to-network-interconnect.md)

9. [Clean up RoutePolicy resources (if present)](./how-to-route-policy.md#delete-route-policy)

10. [Delete Fabric resource](./howto-configure-network-fabric.md#deleting-fabric)

11. [Disable DHCP (Dynamic Host Configuration Protocol) and put devices into ZTP (Zero Touch Provisioning) mode](./howto-platform-prerequisites.md#default-setup-for-other-devices-installed)

12. [Delete Network Fabric Controller (NFC) resource](./howto-configure-network-fabric-controller.md#delete-network-fabric-controller)
    
    > [!NOTE]
    > Only delete Network Fabric Controller (NFC) if the fabric being deleted was the only fabric associated to the NFC.

## Support and questions
For further technical questions or assistance, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).
