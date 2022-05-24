---
title: Disable Internet access or enable a default route
description: This article explains how to disable Internet access for Azure VMware Solution and enable default route for Azure VMware Solution.
ms.topic: how-to
ms.date: 05/12/2022
---
# Disable Internet access or enable a default route 
In this article, you'll learn how to disable Internet access or enable a default route for your Azure VMware Solution private cloud. There are multiple ways to set up a default route. You can use a Virtual WAN hub, Network Virtual Appliance in a Virtual Network, or use a default route from on-premise. If you don't set up a default route, there will be no Internet access to your Azure VMware Solution private cloud. 

With a default route setup, you can achieve the following tasks:
- Disable Internet access to your Azure VMware Solution private cloud. 

  > [!Note]
  > Ensure that a default route is not advertised from on-premises or Azure as that will override this behavior
 
- Enable Internet access by generating a default route from Azure Firewall or third party Network Virtual Appliance. [Learn more](https://docs.microsoft.com/azure/cloud-adoption-framework/scenarios/azure-vmware/eslz-network-topology-connectivity)
## Prerequisites      
- If Internet access is required, a default route must be advertised from a Native Azure Firewall, Network Virtual Appliance or Virtual WAN Hub. 
- Azure VMware Solution private cloud.
## Disable Internet access or enable a default route in the Azure portal
1. Sign in to the Azure portal.
1. Search for Azure VMware Solution and select it.
1. Locate and select your Azure VMware Solution private cloud. 
  :::image type="content" source="media/public-ip-usage/private-cloud-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::
1. On the left navigation, under **Workload networking**, select **Internet connectivity**.

   :::image type="content" source="media/public-ip-usage/private-cloud-workload-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::
1. Select **Don't connect or connect using default route from Azure** and select **Save**.
   :::image type="content" source="media/public-ip-usage/private-cloud-default-route-internet-connectivity_2.png" alt-text="Screenshot Internet of connectivity in Azure VMware Solution.":::
If you don't have a default route from on-premises or from Azure, you have successfully disabled Internet connectivity to your Azure VMware Solution private cloud. 

## Next Steps 

[Internet connectivity design considerations](concepts-design-avs-public-internet-access.md)<br>
[Enable Managed SNAT for Azure VMware Solution Workloads](enable-managed-snat-for-avs-workloads.md)<br>
[Enable Public IP to the NSX Edge for Azure VMware Solution](enable-public-ip-to-the-nsx-edge.md)<br>
