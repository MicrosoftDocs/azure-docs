---
title: Configure NSX network components in Azure VMware Solution 
description: Learn how to use the Azure VMware Solution console to configure NSX-T network segments.
ms.topic: how-to
ms.date: 02/16/2021
---

# Configure NSX network components in Azure VMware Solution

An Azure VMware Solution private cloud comes with NSX-T as a software-defined network (SDDC) by default. It comes pre-provisioned with an NSX-T Tier-0 gateway in Active/Active mode and a default NSX-T Tier-1 gateway in Active/Standby mode.  These gateways let you connect the segments (logical switches) and provide East-West and North-South connectivity. 

After the Azure VMware Solution private cloud is deployed, you can configure the necessary NSX-T objects from the Azure VMware Solution console under **Workload Networking**.  The console presents the simplified view of NSX-T operations that a VMware administrator needs daily and targeted at users not familiar with NSX-T.  

You'll have four options to configure NSX-T components in the Azure VMware Solution console:
- **Segments** - Create segments that display in NSX-T Manager and vCenter.
- **DHCP** - Create a DHCP server or DHCP relay if you plan to use DHCP.
- **Port mirroring** – Create port mirroring to help troubleshoot network issues.
- **DNS** – Create a DNS forwarder to send DNS requests to a designated DNS server for resolution.  

>[!NOTE]
>You'll still have access to the NSX-T Manager console, where you can use the advanced settings mentioned and other NSX-T features. 
 
:::image type="content" source="media/configure-nsx-network-components-azure-portal/nsxt-workload-networking.png" alt-text="Screenshot showing four options in the Azure VMware Solution console for configuring NSX-T.":::

## Prerequisites
Virtual machines (VMs) created or migrated to the Azure VMware Solution private cloud should be attached to a segment. 

## Create an NSX-T segment in the Azure portal
You can create and configure an NSX-T segment from the Azure VMware Solution console in the Azure portal.  These segments are connected to the default Tier-1 gateway, and the workloads on these segments get East-West and North-South connectivity. Once you create the segment, it displays in NSX-T Manager and vCenter.

>[!NOTE]
>If you plan to use DHCP, you'll need to [configure a DHCP server or DHCP relay](#create-a-dhcp-server-or-dhcp-relay-in-the-azure-portal) before you can create and configure an NSX-T segment.

1. In your Azure VMware Solution private cloud, under **Workload Networking**, select **Segments** > **Add**. Provide the details for the new logical segment and select **OK**.

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/add-new-nsxt-segment.png" alt-text="Screenshot showing how to add a new segment.":::
   
   - **Segment name** - Name of the logical switch that is visible in vCenter.
   - **Subnet gateway** - Gateway IP address for the logical switch's subnet with a subnet mask. VMs are attached to a logical switch, and all VMs connecting to this switch belong to the same subnet.  Also, all VMs attached to this logical segment must carry an IP address from the same segment.
   - **DHCP** (optional) - DHCP ranges for a logical segment. A [DHCP server or DHCP relay](#create-a-dhcp-server-or-dhcp-relay-in-the-azure-portal) must be configured to consume DHCP on Segments.  
   - **Connected gateway** - *Selected by default and read only.*  Tier-1 gateway and type of segment information. 
      - **T1** - Name of the Tier-1 gateway in NSX-T Manager. An Azure VMware Solution private cloud comes with an NSX-T Tier-0 gateway in Active/Active mode and a default NSX-T Tier-1 gateway in Active/Standby mode.  Segments created through the Azure VMware Solution console only connect to the default Tier-1 gateway, and the workloads of these segments get East-West and North-South connectivity. You can only create more Tier-1 gateways through NSX-T Manager. Tier-1 gateways created from the NSX-T Manager console are not visible in the Azure VMware Solution console. 
      - **Type** - Overlay segment supported by Azure VMware Solution.

   The segment is now visible in the Azure VMware Solution console, NSX-T Manger, and vCenter.

## Create a DHCP server or DHCP relay in the Azure portal
You can create a DHCP server or relay directly from the Azure VMware Solution console in the Azure portal. The DHCP server or relay connects to the Tier-1 gateway, which gets created when you deploy Azure VMware Solution. All the segments where you gave DHCP ranges will be part of this DHCP.  After you've created a DHCP server or DHCP relay, you must define a subnet or range on segment level to consume it.

1. In your Azure VMware Solution private cloud, under **Workload Networking**, select **DHCP** > **Add**.

2. Select either **DHCP Server** or **DHCP Relay** and then provide a name for the server or relay and three IP addresses. 

   >[!NOTE]
   >For DHCP relay, only one IP address is required for a successful configuration.

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/add-dhcp-server-relay.png" alt-text="Screenshot showing how to add a DHCP server or DHCP relay in Azure VMware Solutions.":::

4. Complete the DHCP configuration by [providing DHCP ranges on the logical segments](#create-an-nsx-t-segment-in-the-azure-portal) and then select **OK**.
 
## Configure port mirroring in the Azure portal
You can configure port mirroring to monitor network traffic that involves forwarding a copy of each packet from one network switch port to another. This option places a protocol analyzer on the port that receives the mirrored data. It analyzes traffic from a source, a VM, or a group of VMs, and then sent to a defined destination. 

To set up port mirroring in the Azure VMware Solution console, you'll:

* [Step 1. Create source and destination VMs or VM groups](#step-1-create-source-and-destination-vms-or-vm-groups) – The source group has a single VM or multiple VMs where the traffic is mirrored.

* [Step 2. Create a port mirroring profile](#step-2-create-a-port-mirroring-profile) – You'll define the traffic direction for the source and destination VM groups.

### Step 1. Create source and destination VMs or VM groups

In this step, you'll create a source VM group and a destination VM group.

1. In your Azure VMware Solution private cloud, under **Workload Networking**, select **Port mirroring** > **VM groups** > **Add**.

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/add-port-mirroring-vm-groups.png" alt-text="Screenshot showing how to create a VM group for port mirroring.":::

1. Provide a name for the new VM group, select the desired VMs from the list, and then **Ok**.

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/add-vm-group.png" alt-text="Screenshot showing the list of VMs to add to the VM group.":::

1. Repeat these steps to create the destination VM group.

### Step 2. Create a port mirroring profile

In this step, you'll define a profile for the source and destination VM groups' traffic direction.

>[!NOTE]
>Make sure you have both the source and destination VM groups created.

1. Select **Port mirroring** > **Add** and then provide:

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/add-port-mirroring-profile.png" alt-text="Screenshot showing the information required for the port mirroring profile.":::

   - **Port mirroring name** - Descriptive name for the profile.
   - **Direction** - Select from Ingress, Egress, or Bi-directional.
   - **Source** - Select the source VM group.
   - **Destination** - Select the destination VM group.
   - **Description** - Enter a description for the port mirroring.

1. Select **OK** to complete the profile. 

   The profile and VM groups are visible in the Azure VMware Solution console.

## Configure a DNS forwarder in the Azure portal
You'll configure a DNS forwarder where specific DNS requests get forwarded to a designated DNS server for resolution.  A DNS forwarder is associate with a **default DNS zone** and up to three **FQDN zones**.

>[!TIP]
>You can also use the [NSX-T Manager console to configure a DNS forwarder](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/2.5/administration/GUID-A0172881-BB25-4992-A499-14F9BE3BE7F2.html).

To set up a DNS forwarder in the Azure VMware Solution console, you'll:

* [Step 1. Configure a default DNS zone and FQDN zone](#step-1-configure-a-default-dns-zone-and-fqdn-zone) –  When a DNS query is received, a DNS forwarder compares the domain name with the domain names in the FQDN DNS zone. 

* [Step 2. Configure DNS service](#step-2-configure-dns-service) - You'll configure the DNS forwarder service.

### Step 1. Configure a default DNS zone and FQDN zone
You'll configure a default DNS zone and FQDN zone to send DNS queries to the upstream server.  When a DNS query is received, the DNS forwarder compares the domain name in the query with the FQDN DNS zones' domain names. If a match is found, the query is forwarded to the DNS servers specified in the FQDN DNS zone. If no match is found, the query is forwarded to the DNS servers specified in the default DNS zone.

>[!NOTE]
>A default DNS zone must be defined before you configure an FQDN zone. 

1. In your Azure VMware Solution private cloud, under **Workload Networking**, select **DNS** > **DNS zones** > **Add**.

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/nsxt-workload-networking-dns-zones.png" alt-text="Screenshot showing how to add DNS zones and a DNS service.":::

1. Select **Default DNS zone** and provide:

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/nsxt-workload-networking-configure-dns-zones.png" alt-text="Screenshot showing how to add a default DNS zone.":::

   1. A name for the DNS zone.

   1. Up to three DNS server IP addresses in the format of **8.8.8.8**.

1. Select **FQDN zone** and provide:

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/nsxt-workload-networking-configure-fqdn-zone.png" alt-text="Screenshot showing how to add an FQDN zone. ":::

   1. A name for the DNS zone.

   1. The FQDN domain.

   1. Up to three DNS server IP addresses in the format of **8.8.8.8**.

1. Select **OK** to finish adding the default DNS zone and DNS service.

### Step 2. Configure DNS service

1. Select the **DNS service** tab, select **Add**. Provide the details and select **OK**.

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/nsxt-workload-networking-configure-dns-service.png" alt-text="Screenshot showing the information required for the DNS service.":::

   >[!TIP]
   >**Tier-1 Gateway** is selected by default and reflects the gateway created when deploying Azure VMware Solution.

   The DNS service was added successfully.

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/nsxt-workload-networking-configure-dns-service-success.png" alt-text="Screenshot showing the DNS service added successfully.":::

