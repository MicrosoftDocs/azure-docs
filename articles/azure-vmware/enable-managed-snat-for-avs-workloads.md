---
title: Enable Managed SNAT for Azure VMware Solution Workloads
description: This article explains how to enable Managed SNAT for Azure VMware Solution Workloads.
ms.topic: how-to
ms.date: 05/12/2022
---
# Enable Managed SNAT for Azure VMware Solution Workloads

This procedure is used to enable Azure VMware Solution’s Managed Source NAT (SNAT) to connect to the Internet outbound. A SNAT Service that translates from RFC1918 space to the public internet to provide simple outbound Internet access.  The SNAT service will be preempted by the default route from Azure.  

With this capability, you: 

- Have a basic SNAT service with outbound internet connectivity from your Azure VMware Solution Private Cloud.
- Have no control of outbound SNAT rules. 
- Are unable to view connection logs. 
- Have a limit of 128 000 concurrent connections.  

## Reference   Architecture    
:::image type="content" source="media/public-ip-usage/architecture-internet-access-avs-public-ip.png" alt-text="The architecture diagram shows internet access to and from your Azure VMware Solution Private Cloud using a Public IP directly to the NSX Edge." border="false" lightbox="media/public-ip-usage/architecture-internet-access-avs-public-ip.png":::

## How to Configure Outbound Internet Access using Managed SNAT in the Azure Portal 

1. Sign into the Azure portal and then search for and select Azure VMware Solution. 
2.	Select the Azure VMware Solution private cloud.
    :::image type="content" source="media/public-ip-usage/private-cloud-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::

1. Under Workload Networking, select Internet Connectivity.
   :::image type="content" source="media/public-ip-usage/private-cloud-workload-internet-connectivity.png" alt-text="Screenshot Internet connectivity in Azure VMware Solution.":::

4.	Select Connect using SNAT and click Save.  
    :::image type="content" source="media/public-ip-usage/private-cloud-save-snat-internet-connectivity.png" alt-text="Screenshot Internet save SNAT Internet connectivity in Azure VMware Solution.":::

You have successfully enabled outbound internet access for your Azure VMware Solution Private Cloud using our Managed SNAT service.  

### Next Steps 
>[!div class="nextstepaction"]
>[Internet connectivity design considerations](concepts-design-avs-public-internet-access.md)<br>
>[Enable internet access for your Azure VMware Solution](concepts-design-avs-public-internet-access.md)<br>
>[Disable Internet access or enable a default route](disable-internet-access.md)<br>
