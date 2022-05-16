---
title: Disable Internet access or enable a default route
description: This article explains how to disable internet access for Azure VMware Solution and enable default route for Azure VMware Solution.
ms.topic: how-to
ms.date: 05/12/2022
---
# Disable Internet access or enable a default route 
In this article, you’ll learn how to disable internet access to enable a default route   or enable a default route for your Azure VMware Solution private cloud. There are multiple options to facilitate this. These options include: Virtual WAN hub, Network Virtual Appliance in a Virtual Network, or a default route from on-premises. Please ensure you understand your options and their impact. You should select this option   if you want to provide a default route. If no default route is provided, there's no internet access to your Azure VMware Solution Private Cloud. 
With  this capability, you can achieve the following tasks:
- Disable internet access to your Azure VMware Solution Private Cloud. (Note: Ensure that a default route is not advertised from on-premises or Azure as that will override this behavior) 
- Enable internet access by generating a default route from Azure Firewall or 3rd party Network Virtual Appliance. [learn More] (https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/azure-vmware/eslz-network-topology-connectivity)
## Prerequisites      
- If internet access is required, a default route must be advertised from a Native Azure Firewall, Network Virtual Appliance or Virtual WAN Hub. 
- Azure VMware Solution Private Cloud.
### How to Disable Internet Access or Enable a Default Route in the Azure Portal
1. Sign in to the Azure portal.
1. Search for Azure VMware Solution and select it.
1. Locate and select your Azure VMware Solution private cloud. 
  :::image type="content" source="media/public-ip-usage/private-cloud-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::
1. Under Workload networking, select Internet connectivity.

   :::image type="content" source="media/public-ip-usage/private-cloud-workload-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::
1. Select Do not connect or connect using default route from Azure and click Save.
   :::image type="content" source="media/public-ip-usage/private-cloud-default-route-internet-connectivity_2.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::
If you don't have a default route from On-Prem or Azure, you have successfully disabled internet connectivity to your Azure VMware Solution Private Cloud. 

### Next Steps 
>[!div class="nextstepaction"]
>[Internet connectivity design considerations](concepts-design-avs-public-internet-access.md)<br>
>[Enable Managed SNAT for Azure VMware Solution Workloads](enable-managed-snat-for-avs-workloads.md)<br>
>[Enable internet access for your Azure VMware Solution](concepts-design-avs-public-internet-access.md)<br>
