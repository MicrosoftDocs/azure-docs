---
title: Disable internet access or enable a default route 
description: This article explains how to disable internet access for Azure VMware Solution and enable default route for Azure VMware Solution.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 05/12/2022
---

# Disable internet access or enable a default route 
In this article, you'll learn how to disable Internet access or enable a default route for your Azure VMware Solution private cloud. There are multiple ways to set up a default route. You can use a Virtual WAN hub, Network Virtual Appliance in a Virtual Network, or use a default route from on-premises. If you don't set up a default route, there will be no Internet access to your Azure VMware Solution private cloud. 

With a default route setup, you can achieve the following tasks:
- Disable Internet access to your Azure VMware Solution private cloud. 

  > [!Note]
  > Ensure that a default route is not advertised from on-premises or Azure as that will override this setup.
 
- Enable Internet access by generating a default route from Azure Firewall or third-party Network Virtual Appliance. 
## Prerequisites      
- If Internet access is required, a default route must be advertised from an Azure Firewall, Network Virtual Appliance or Virtual WAN Hub. 
- Azure VMware Solution private cloud.
## Disable Internet access or enable a default route in the Azure portal
1. Log in to the Azure portal.
1. Search for **Azure VMware Solution** and select it.
1. Locate and select your Azure VMware Solution private cloud.  
1. On the left navigation, under **Workload networking**, select **Internet connectivity**.
1. Select the **Don't connect or connect using default route from Azure** button and select **Save**.   
If you don't have a default route from on-premises or from Azure, you have successfully disabled Internet connectivity to your Azure VMware Solution private cloud. 

## Next steps 

[Internet connectivity design considerations (Preview)](concepts-design-public-internet-access.md)

[Enable Managed SNAT for Azure VMware Solution Workloads](enable-managed-snat-for-workloads.md)

[Enable Public IP to the NSX Edge for Azure VMware Solution](enable-public-ip-nsx-edge.md)
