---
title: Configure NSX-T Data Center network components using Azure VMware Solution 
description: Learn how to use the Azure VMware Solution to configure NSX-T Data Center network segments.
ms.topic: reference
ms.service: azure-vmware
ms.date: 10/17/2022

# Customer intent: As an Azure service administrator, I want to configure NSX-T Data Center network components using a simplified view of NSX-T Data Center operations a VMware administrator needs daily. The simplified view is targeted at users unfamiliar with NSX-T Manager.

---

# Configure NSX-T Data Center network components using Azure VMware Solution

An Azure VMware Solution private cloud comes with NSX-T Data Center by default. The private cloud comes pre-provisioned with an NSX-T Data Center Tier-0 gateway in **Active/Active** mode and a default NSX-T Data Center Tier-1 gateway in Active/Standby mode.  These gateways let you connect the segments (logical switches) and provide East-West and North-South connectivity. 

After deploying Azure VMware Solution, you can configure the necessary NSX-T Data Center objects from the Azure portal.  It presents a simplified view of NSX-T Data Center operations a VMware administrator needs daily and is targeted at users not familiar with NSX-T Manager.  

You'll have four options to configure NSX-T Data Center components in the Azure VMware Solution console:

- **Segments** - Create segments that display in NSX-T Manager and vCenter Server. For more information, see [Add an NSX-T Data Center segment using the Azure portal](tutorial-nsx-t-network-segment.md#use-azure-portal-to-add-an-nsx-t-data-center-network-segment).

- **DHCP** - Create a DHCP server or DHCP relay if you plan to use DHCP.  For more information, see [Use the Azure portal to create a DHCP server or relay](configure-dhcp-azure-vmware-solution.md#use-the-azure-portal-to-create-a-dhcp-server-or-relay).

- **Port mirroring** – Create port mirroring to help troubleshoot network issues. For more information, see [Configure port mirroring in the Azure portal](configure-port-mirroring-azure-vmware-solution.md).

- **DNS** – Create a DNS forwarder to send DNS requests to a designated DNS server for resolution.  For more information, see [Configure a DNS forwarder in the Azure portal](configure-dns-azure-vmware-solution.md).

>[!IMPORTANT]
>You'll still have access to the NSX-T Manager console, where you can use the advanced settings mentioned and other NSX-T Data Center features. 

