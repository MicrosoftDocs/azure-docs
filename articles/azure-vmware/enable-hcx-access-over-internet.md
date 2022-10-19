---
title: Enable HCX access over the internet
description: This article describes how to access HCX over a public IP address using Azure VMware solution.
ms.topic: how-to
ms.date: 7/19/2022
---
# Enable HCX access over the internet

In this article, you'll learn how to perform HCX migration over a public IP address using Azure VMware Solution.
>[!IMPORTANT]
>Before configuring a public IP on your Azure VMware Solution private cloud, consult your network administrator to understand the implications and the impact to your environment.

You'll also learn how to pair HCX sites and create service mesh from on-premises to an Azure VMware Solution private cloud using Public IP. The service mesh allows you to migrate a workload from an on-premises datacenter to an Azure VMware Solution private cloud over the public internet. This solution is useful when the customer isn't using ExpressRoute or VPN connectivity with the Azure cloud.

> [!IMPORTANT]
> The on-premises HCX appliance should be reachable from the internet to establish HCX communication from on-premises to the Azure VMware Solution private cloud.

## Configure public IP block  

For HCX manager to be available over the public IP address, you'll need one public IP address for DNAT rule.

To perform HCX migration over the public internet, you'll need other IP addresses. You can have a /29 subnet to create minimum configuration when defining HCX network profile (usable IPs in subnet will be assigned to IX, NE appliances). You can choose a bigger subnet based on the requirements. You'll create an NSX-T segment using this public subnet. This segment can be used for creating HCX network profile.

>[!Note] 
> After assigning a subnet to NSX-T segment, you can't use an IP from that subnet to create a DNAT rule. Both subnets should be different.

Configure a Public IP block through portal by using the [Public IP feature of the Azure VMware Solution](enable-hcx-access-over-internet.MD#enable-hcx-access-over-the-internet) private cloud.

## Use public IP address for Cloud HCX Manager public access
Cloud HCX manager can be available over a public IP address by using a DNAT rule. However, since Cloud HCX manager is in the provider space, the null route is necessary to allow HCX Manager to route back to the client by way of the DNAT rule. It forces the NAT traffic through NSX-T Tier-0 router.

## Add static null route to the Tier1 router
The static null route is used to allow HCX private IP to route through the NSX Tier-1 for public endpoints. This static route can be the default Tier-1 router created in your private cloud or you can create a new tier-1 router.

1. Sign in to NSX-T manager, and select **Networking**.
1. Under the **Connectivity** section, select **Tier-1 Gateways**.
1. Edit the existing Tier-1 gateway.
1. Expand **STATIC ROUTES**.
1. Select the number next to **Static Routes**.
1. Select **ADD STATIC ROUTE**.  
    A pop-up window is displayed.
1. Under **Name**, enter the name of the route.
1. Under **Network**, enter a non-overlapping /32 IP address under Network.  
    >[!NOTE]
    > This address should not overlap with any other IP addresses on the private cloud network and the customer network. 
 
     :::image type="content" source="media/hcx-over-internet/hcx-sample-static-route.png" alt-text="Diagram showing a sample static route configuration." border="false" lightbox="media/hcx-over-internet/hcx-sample-static-route.png":::    
1. Under **Next hops**, select **Set**.
1. Select **NULL** as IP Address.  
   Leave defaults for Admin distance and scope.
1. Select **ADD**, then select **APPLY**.
1. Select **SAVE**, then select **CLOSE**.
    :::image type="content" source="media/hcx-over-internet/hcx-sample-null-route.png" alt-text="Diagram showing a sample Null route configuration." border="false" lightbox="media/hcx-over-internet/hcx-sample-null-route.png":::     
1. Select **CLOSE EDITING**.

## Add NAT rule to Tier-1 gateway

1. Sign in to NSX-T Manager, and select **Networking**.
1. Select **NAT**.
1. Select the Tier-1 Gateway. Use same Tier-1 router to create NAT rule that you used to create null route in previous steps.
1. Select **ADD NAT RULE**.
1. Add one SNAT rule and one DNAT rule for HCX Manager.
    1. The DNAT Rule Destination is the Public IP for HCX Manager. The Translated IP is the HCX Manager IP in the cloud.
    1. The SNAT Rule Destination is the HCX Manager IP in the cloud.  The Translated IP is the non-overlapping /32 IP from the Static Route.
    1. Make sure to set the Firewall option on DNAT rule to **Match External Address**.
    :::image type="content" source="media/hcx-over-internet/hcx-sample-public-access-route.png" alt-text="Diagram showing a sample NAT rule for public access of HCX Virtual machine." border="false" lightbox="media/hcx-over-internet/hcx-sample-public-access-route.png":::          

1. Create Tier-1 Gateway Firewall rules to allow only expected traffic to the Public IP for HCX Manager and drop everything else.
     1. Create a Gateway Firewall rule on the T1 that allows your on-premises as the **Source IP** and the Azure VMware Solution reserved Public as the **Destination IP**. This rule should be the highest priority.
     1. Create a Gateway Firewall rule on the Tier-1 that denies all other traffic where the **Source IP** is **Any** and **Destination IP** is the Azure VMware Solution reserved Public IP.

For more information, see [HCX ports](https://ports.esp.vmware.com/home/VMware-HCX)

> [!NOTE]
> HCX manager can now be accessed over the internet using public IP.  

## Pair sites using HCX Cloud manager's public IP address

Site pairing is required before you create service mesh between source and destination sites.

1. Sign in to the **Source** site HCX Manager.
1. Select **Site Pairing** and select **ADD SITE PAIRING**.
1. Enter the **Cloud HCX Manager Public URL** as remote site and sign in credentials, then select **Connect**.

After pairing is done, it will appear under site pairing.  

## Create public IP segment on NSX-T
Before you create a Public IP segment, get your credentials for NSX-T Manager from Azure VMware Solution portal.

1. Under the **Networking** section select **Connectivity**, **Segments**, and then select **ADD SEGMENT**.
1. Provide Segment name, select **Tier-1 router** as connected gateway, and provide the reserved public IP under subnets.
1. Select **Save**.  

## Create network profile for HCX at destination site
1. Sign in to Destination HCX Manager (cloud manager in this case).
1. Select **Interconnect** and then select the **Network Profiles** tab.
1. Select **Create Network Profile**.
1. Select **NSX Networks** as network type under **Network**.
1. Select the **Public-IP-Segment** created on NSX-T.
1. Enter **Name**.
1. Under IP pools, enter the **IP Ranges** for HCX uplink, **Prefix Length**, and **Gateway** of public IP segment.
1. Scroll down and select the **HCX Uplink** checkbox under **HCX Traffic Type** as this profile will be used for HCX uplink.
1. Select **Create** to create the network profile.  

## Create service mesh
Service Mesh will deploy HCX WAN Optimizer, HCX Network Extension and HCX-IX appliances.
1. Sign in to **Source** site HCX Manager.
1. Select **Interconnect** and then select the **Service Mesh** tab.
1. Select **CREATE SERVICE MESH**.
1. Select the **destination** site to create service mesh with and then select **Continue**.
1. Select the compute profiles for both sites and select **Continue**.
1. Select the HCX services to be activated and select **Continue**.
   >[!Note]
   >Premium services require an additional HCX Enterprise license.  
1. Select the network profile of source site.
1. Select the network profile of destination that you created in the **Network Profile** section.
1. Select **Continue**.
1. Review the **Transport Zone** information, and then select **Continue**.
1. Review the **Topological view**, and select **Continue**.
1. Enter the **Service Mesh name** and select **FINISH**.
1. Add the public IP addresses in firewall to allow required ports only.

## Extend network
The HCX Network Extension service provides layer 2 connectivity between sites. The extension service also allows you to keep the same IP and MAC addresses during virtual machine migrations.
1. Sign in to **source** HCX Manager.
1. Under the **Network Extension** section, select the site for which you want to extend the network, and then select **EXTEND NETWORKS**.
1. Select the network that you want to extend to destination site, and select **Next**.
1. Enter the subnet details of network that you're extending.
1. Select the destination first hop route (Tier-1), and select **Submit**.
1. Sign in to the **destination** NSX, you'll see Network 10.14.27.1/24 has been extended.

After the network is extended to destination site, VMs can be migrated over Layer 2 extension.

## Next steps
[Enable Public IP to the NSX Edge for Azure VMware Solution](./enable-public-ip-nsx-edge.md)

For detailed information on HCX network underlay minimum requirements, see [Network Underlay Minimum Requirements](https://docs.vmware.com/en/VMware-HCX/4.3/hcx-user-guide/GUID-8128EB85-4E3F-4E0C-A32C-4F9B15DACC6D.html).