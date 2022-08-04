---
title: Enable HCX access over the internet
description: This article describes how to access HCX over a public IP address using Azure VMware solution.
ms.topic: how-to
ms.date: 7/19/2022
---
# Enable HCX access over the internet

In this article you'll learn how to access the HCX over a Public IP address using Azure VMware Solution. You'll also learn how to pair HCX sites, and create service mesh from on-premises to Azure VMware Solutions private cloud using Public IP. The service mesh allows you to migrate a workload from an on-premises datacenter to Azure VMware Solutions private cloud over the public internet. This solution is useful where the customer isn't using Express Route or VPN connectivity with the Azure cloud.

> [!IMPORTANT] 
> The on-premises HCX appliance should be reachable from the internet to establish HCX communication from on-premises to Azure VMware Solution private cloud. 

## Configure Public IP block  

Configure a Public IP block through portal by using the Public IP feature of the Azure VMware Solution private cloud. 

1. Sign in to Azure VMware Solution portal. 
1. Under **Workload Networking**, select **Public IP (preview)**.

1. Select **+Public IP**. 
1. Enter the **Public IP name** and select the address space from the **Address space** drop-down list according to the number of IPs required, then select **Configure**.
   >[!Note]
   > It will take 15-20 minutes to configure the Public IP block on private cloud. 

After the Public IP is configured successfully, you should see it appear under the Public IP section. The provisioning state shows **Succeeded**. This Public IP block is configured as NSX-T segment on the Tier-1 router.

For more information about how to enable a public IP to the NSX Edge for Azure VMware Solution, see [Enable Public IP to the NSX Edge for Azure VMware Solution](./enable-public-ip-nsx-edge.md). 

## Create Public IP segment on NSX-T 
Before you create a Public IP segment, get your credentials for NSX-T Manager from Azure VMware Solution portal. 

1. Sign in to NSX-T Manager using credentials provided by the Azure VMware Solution portal. 
1. Under the **Manage** section, select **Identity**.
1. Copy the NSX-T Manager admin user password.  
1. Browse the NSX-T Manger, paste the admin password in the password field, and select **Login**. 
1. Under the **Networking** section, select **Connectivity** and **Segments**, and then select **ADD SEGMENT**.
1. Provide Segment name, select Tier-1 router as connected gateway, and provide the public segment under subnets. 
1. Select **Save**.   

## Assign public IP to HCX manager
HCX manager of destination Azure VMware Solution SDDC should be reachable from the internet to do site pairing with source site.  HCX Manager can be exposed by way of DNAT rule and a static null route.  Because HCX Manager is in the provider space, not within the NSX-T environment, the null route is necessary to allow HCX Manager to route back to the client by way of the DNAT rule. 

### Add static null route to the T1 router 
1. Sign in to NSX-T manager and select **Networking**.
1. Under the **Connectivity** section, select **Tier-1 Gateways**.
1. Edit the existing T1 gateway.
1. Expand **STATIC ROUTES**.
1. Select the number next to **Static Routes**.
1. Select **ADD STATIC ROUTE**.  
    A pop-up window is displayed.
1. Under **Name**, enter the name of the route.
1. Under **network**, enter a non-overlapping /32 IP address under Network.  
    >[!NOTE]
    > This address should not overlap with any other IP addresses on the network.
1. Under **Next hops**, select **Set**.
1. Select **NULL** as IP Address.  
   Leave defaults for Admin distance and scope. 
1. Select **ADD**, then select **APPLY**. 
1. Select **SAVE**, then select **CLOSE**.
1. Select **CLOSE EDITING**.

### Add NAT rule to T1 gateway
 
1. Sign in to NSX-T Manager and select **Networking**.
1. Select **NAT**.
1. Select the T1 Gateway.
1. Select **ADD NAT RULE**.
1. Add one SNAT rule for HCX Manager.
    1. The DNAT Rule Destination is the Public IP for HCX Manager. The Translated IP is the HCX Manager IP in the cloud.
    1. The SNAT Rule Source is the HCX Manager IP in the cloud.  The Translated IP is the non-overlapping /32 IP from the Static Route.
1. Make sure to set the Firewall option on DNAT rule to **Match External Address**.
1. Create T1 Gateway Firewall rules to allow only expected traffic to the Public IP for HCX Manager and drop everything else.  

>[!NOTE]
> HCX manager can now be accessed over the internet using public IP.  

### Create network profile for HCX at destination site
1. Sign in to Destination HCX Manager.
1. Select **Interconnect** and then select the **Network Profiles** tab. 
1. Select **Create Network Profile**. 
1. Select **NSX Networks** as network type under **Network**.
1. Select the **Public-IP-Segment** created on NSX-T.
1. Enter **Name**.
1. Under IP pools, enter the **IP Ranges** for HCX uplink, **Prefix Length**, and **Gateway** of public IP segment. 
1. Scroll down and select the **HCX Uplink** checkbox under **HCX Traffic Type** as this profile will be used for HCX uplink.
1. To create the Network Profile, select **Create**.

### Pair site
Site pairing is required to create service mesh between source and destination sites. 

1. Sign in to the **Source** site HCX Manager.
1. Select **Site Pairing** and select **ADD SITE PAIRING**. 
1. Enter the remote HCX URL and sign in credentials, then select **Connect**.

After pairing is done, it will appear under site pairing.  

### Create service mesh
Service Mesh will deploy HCX WAN Optimizer, HCX Network Extension and HCX-IX appliances. 
1. Sign in to **Source** site HCX Manager.
1. Select **Interconnect** and then select the **Service Mesh** tab.
1. Select **CREATE SERVICE MESH**. 
1. Select the **destination** site to create service mesh with and select **Continue**. 
1. Select the compute profiles for both sites and select **Continue**.
1. Select the HCX services to be activated and select **Continue**. 
   >[!Note]
   >Premium services require an additional HCX Enterprise license.   
1. Select the Network Profile of source site.
1. Select the Network Profile of Destination that you created in the Network Profile section.
1. Select **Continue**.
1. Review the Transport Zone information, and then select **Continue**. 
1. Review the Topological view, and select **Continue**.
1. Enter the Service Mesh name and select **FINISH**. 

### Extend network 
The HCX Network Extension service provides layer 2 connectivity between sites. The extension service also allows you to keep the same IP and MAC addresses during virtual machine migrations. 
1. Sign in to **source** HCX Manager. 
1. Under the **Network Extension** section, select the site for which you want to extend the network, and then select **EXTEND NETWORKS**. 
1. Select the network that you want to extend to destination site, and select **Next**. 
1. Enter the subnet details of network that you're extending.
1. Select the destination first hop route (T1), and select **Submit**.
1. Sign in to the **destination** NSX, you'll see Network 10.14.27.1/24 has been extended. 

After the network is extended to destination site, VMs can be migrated over Layer 2 Extension. 

## Next steps 
[Enable Public IP to the NSX Edge for Azure VMware Solution](./enable-public-ip-nsx-edge.md)

For detailed information on HCX network underlay minimum requirements, see [Network Underlay Minimum Requirements](https://docs.vmware.com/en/VMware-HCX/4.3/hcx-user-guide/GUID-8128EB85-4E3F-4E0C-A32C-4F9B15DACC6D.html).