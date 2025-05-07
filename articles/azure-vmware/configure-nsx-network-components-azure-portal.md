---
title: Configure NSX network components using Azure VMware Solution 
description: Learn how to use the Azure VMware Solution to configure NSX network segments.
ms.topic: reference
ms.service: azure-vmware
ms.date: 6/12/2024
ms.custom: engagement-fy23

# Customer intent: As an Azure service administrator, I want to configure NSX network components using a simplified view of NSX operations a VMware administrator needs daily. The simplified view is targeted at users unfamiliar with NSX Manager.

---

# Configure NSX network components using Azure VMware Solution

An Azure VMware Solution private cloud comes with NSX by default. The private cloud comes pre-provisioned with an NSX Tier-0 gateway in **Active/Active** mode and a default NSX Tier-1 gateway in Active/Standby mode.  These gateways let you connect the segments (logical switches) and provide East-West and North-South connectivity. 

After deploying Azure VMware Solution, you can configure the necessary NSX objects from the Azure portal.  It presents a simplified view of NSX operations a VMware administrator needs daily and is targeted at users not familiar with NSX Manager.  

You have four options to configure NSX components in the Azure VMware Solution console:

- **Segments** - Create segments that display in NSX Manager and vCenter Server. For more information, see [Add an NSX segment using the Azure portal](tutorial-nsx-t-network-segment.md#use-azure-portal-to-add-an-nsx-network-segment).

- **DHCP** - Create a DHCP server or DHCP relay if you plan to use DHCP.  For more information, see [Use the Azure portal to create a DHCP server or relay](configure-dhcp-azure-vmware-solution.md#use-the-azure-portal-to-create-a-dhcp-server-or-relay).

- **Port mirroring** – Create port mirroring to help troubleshoot network issues. For more information, see [Configure port mirroring in the Azure portal](configure-port-mirroring-azure-vmware-solution.md).

- **DNS** – Create a DNS forwarder to send DNS requests to a designated DNS server for resolution.  For more information, see [Configure a DNS forwarder in the Azure portal](configure-dns-azure-vmware-solution.md).

>[!IMPORTANT]
>You'll still have access to the NSX Manager console, where you can use the advanced settings mentioned and other NSX features. 

