---
title: Automatic peering sync for Azure VMware Solution Gen 2 (Preview)
description: Learn about the automatic peering sync feature for Azure VMware Solution Gen 2 private clouds that simplifies connectivity by automatically synchronizing Azure virtual networks with the private cloud virtual network.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 8/25/2025
ms.custom: engagement-fy25
#customer intent: As a cloud administrator, I want to automatically peer and synchronize Azure virtual networks with my Azure VMware Solution Gen 2 private cloud so that I can simplify connectivity and reduce manual configuration.
---

# Automatic peering sync for Azure VMware Solution Gen 2 (Preview)

The automatic peering sync feature in Azure VMware Solution enables customers to designate specific Azure virtual networks that will be automatically and continuously synchronized with the private cloud virtual network that hosts the Azure VMware Solution Gen 2 private cloud.  

This feature simplifies network connectivity and reduces manual configuration efforts by ensuring that peering settings and routing configurations remain consistent between Azure virtual networks and the Azure VMware Solution Gen 2 private cloud virtual network.  

> [!NOTE]  
> This feature is currently in public preview and may change before general availability. Preview terms and conditions apply.  
>
> This feature is **not virtual network peering itself**. It automates the process of keeping peered virtual networks in sync. Specifically, it performs the same functionality as described in [Update the address space for a peered virtual network using the Azure portal](/azure/virtual-network/update-virtual-network-peering-address-space), but automatically, without manual updates.  

---

## Key benefits  

**Migration readiness and service continuity**  
Before migrating workloads to Azure VMware Solution, customers can select Azure virtual networks to be automatically synced. This ensures that connectivity to critical Azure services is already in place and reliable, minimizing downtime and complexity during migration.  

**Operational efficiency**  
Eliminates manual troubleshooting or maintenance associated with peering setup and updates, particularly in large or rapidly evolving environments.  

**Reliable Azure integration**  
Ensures that virtual machines hosted in Azure VMware Solution can securely and consistently communicate with services deployed in Azure-native virtual networks.  

---

## Prerequisite

- Ensure the "Microsoft.BareMetal" resource provider is registered.
- When updating an Automated Peering Sync setting, the user needs Role Based Access Control Administrator access on the remote virtual network.

## Deployment steps 

1. Deploy your Azure VMware Solution private cloud.  
2. In the Azure portal, navigate to the **Connectivity** blade.  
3. Select the **Auto Peering sync** feature.  
4. Choose the Azure virtual networks that you want to automatically peer and synchronize with the Azure VMware Solution virtual network.  

Azure VMware Solution will:  
- Apply automatic peering sync with the selected remote virtual network.  
- Continuously monitor both sides of the peering relationship to ensure configuration consistency.  

---

## Supported scenarios (preview)  

This preview currently supports:  

- Peering with Azure virtual networks that are in the same tenant and same subscription as the Azure VMware Solution private cloud.  

> [!NOTE]  
> Auto peering synchronization is triggered when changes are detected in the Azure VMware Solution virtual network, not when changes occur in the remote Azure virtual network. As a result, if configuration changes are made only on the remote virtual network, they will not automatically trigger a sync.  

## Related topics  

- [Connectivity to an Azure Virtual Network](native-network-connectivity.md)  
- [Connect to an on-premises environment](native-connect-on-premises.md)  
- [Internet connectivity options](native-internet-connectivity-design-considerations.md)  
- [Connect multiple Gen 2 private clouds](native-connect-multiple-private-clouds.md)  
- [Connect Gen 2 to Gen 1 private clouds](native-connect-private-cloud-previous-edition.md)  
- [Public and Private DNS forward lookup zone configuration](native-dns-forward-lookup-zone.md)  
- [Route architecture for Gen 2](native-network-routing-architecture.md)  
