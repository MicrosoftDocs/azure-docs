---
title: Enable Managed SNAT for Azure VMware Solution Workloads 
description: This article explains how to enable Managed SNAT for Azure VMware Solution Workloads.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 05/12/2022
---

# Enable Managed SNAT for Azure VMware Solution workloads 

In this article, you'll learn how to enable Azure VMware Solution’s Managed Source NAT (SNAT) to connect to the Internet outbound. A SNAT service translates from RFC1918 space to the public Internet for simple outbound Internet access. Note that ICMP (ping) is disabled by design; you cannot ping an Internet host. The SNAT service won't work when you have a default route from Azure.  

With this capability, you: 

- Have a basic SNAT service with outbound Internet connectivity from your Azure VMware Solution private cloud.
- Have no control of outbound SNAT rules. 
- Are unable to view connection logs. 
- Have a limit of 128 000 concurrent connections.  

## Reference architecture
The architecture shows Internet access outbound from your Azure VMware Solution private cloud using an Azure VMware Solution Managed SNAT Service.     

:::image type="content" source="media/public-ip-nsx-edge/architecture-internet-access-avs-public-ip-snat.png" alt-text="Diagram that shows architecture of Internet access to and from your Azure VMware Solution Private Cloud using a Public IP directly to the SNAT Edge." border="false" lightbox="media/public-ip-nsx-edge/architecture-internet-access-avs-public-ip-snat-expanded.png":::

## Configure Outbound Internet access using Managed SNAT in the Azure port
1. Log in to the Azure portal and then search for and select **Azure VMware Solution**. 
2.	Select the Azure VMware Solution private cloud.    
1. In the left navigation, under **Workload Networking**, select **Internet Connectivity**.   
4.	Select **Connect using SNAT** button and select **Save**. 
    You have successfully enabled outbound Internet access for your Azure VMware Solution private cloud using our Managed SNAT service.  

## Next steps 
[Internet connectivity design considerations (Preview)](concepts-design-public-internet-access.md)

[Enable Public IP to the NSX Edge for Azure VMware Solution (Preview)](enable-public-ip-nsx-edge.md)

[Disable Internet access or enable a default route](disable-internet-access.md)
