---
title: Enable HCX access over internet
description: This article describes how to access HCX over a public IP address using Azure VMware solution.
ms.topic: how-to
ms.date: 06/27/2022
---
# Enable HCX access over internet

This article describes how to HCX can be accessed over a public IP address using Azure VMware solution’s public IP feature. It also explains how to pair HCX sites and create service mesh from on-premises to Azure VMware Solutions  private cloud to migrate workload from on-premises datacenter to Azure VMware Solutions private cloud over the public internet. This solution  is useful  where the customer isn't using an Express Route or VPN connectivity with Azure cloud.  

> [!TIP] 
> This solution is useful where the customer is not using Express Route or VPN connectivity with the Azure cloud. The on-premises HCX appliance should be reachable from the internet to establish HCX communication from on-premises to Azure VMware Solution private cloud. 

## Components
- AVS Private Cloud with Public IP Block – 20.95.8.65/27 
- HCX Network Profile with Public IPs – 20.95.8.66, 20.95.8.67 
- A Private IP Segment configure in destination Azure VMware Solution for SNAT – 10.22.10.0/24 
- Test Virtual Machines for migration (Test-VM-HCX-PIP, Test-VM2-HCX-PIP and Test1) 

## Configure Public IP block  

Configure a Public IP block through Azure VMware Solution portal by using the new Public IP feature of the Azure VMWare Solution private cloud. 

1. Login into Azure VMware Solution portal. 
1. Under **Workload Networking**,  select **Public IP (preview)**.
1. Select **+Public IP**. 
1. Enter the **Public IP name** and select the address space from the **Address space** drop down according to number of IPs required and select **Configure**.
   >[!Note]
   > It will take 15-20 minutes to configure the Public IP block on private cloud. 
1. After the Public IP is configured, it will look like this, refer below screenshot   
 

This Public IP block will be configured as NSX-T segment on the Tier-1 router. 

## Create Public IP segment on NSX-T 

1. Under **Manage**, select **Identity**.
1. Sign in to NSX-T Manager using credentials provided on Azure VMWare Solution portal. 
1. Copy the NSX-T Manager admin user password.  
1. Browse the NSX-T Manger and paste the admin password there and select **Login**. 
1. Under **Connectivity**, select **Segments** to create an NSX-T Public IP Segment from NSX-T Manager.

## Assign public IP to HCX manager
HCX manager of destination Azure VMware Solution SDDC should be reachable from the internet to do site pairing with source site.  HCX Manager can be exposed by way of DNAT rule and a static null route.  Because HCX Manager is in the provider space, not within the NSX-T environment, the null route is necessary to allow HCX Manager to route back to the client by way of the DNAT rule. 

### Add static null route to the T1 router 
1. Select **Networking**. 
1. Select **Tier-1 Gateways**.
1. Edit the Existing T1.
1. Expand **STATIC ROUTES**
1. Select the number next to**Static Routes**.
1. Select **ADD STATIC ROUTE**.
1. Name the route.
1. Select a /32 IP address, which should not overlap with anything on the network. Enter a non-overlapping /32 IP address under Network. 
1. Select **Set**.
1. Select **NULL** as IP Address.
1. Select **ADD**.
1. Select **APPLY**. 
1. Select **SAVE**.
1. Select **CLOSE**.
1. Select **CLOSE EDITING**.

### Add NAT rule to T1 gateway
 
1. Select **Networking**.
1. Select **NAT**.
1. Select the T1 Gateway.
1. Select **ADD NAT RULE**.
1. Make 2 NAT rules for HCX Manager.
1. The DNAT Rule Destination is the Public IP for HCX Manager.  The Translated IP is the HCX Manager IP in the cloud.
1. The SNAT Rule Source is the HCX Manager IP in the cloud.  The Translated IP is the non-overlapping /32 IP from the Static Route.
1. Make sure to set the Firewall option on DNAT rule to **Match External Address**.
1. Create T1 Gateway Firewall rules to allow only expected traffic to the Public IP for HCX Manager and drop everything else.  

Now HCX Manager is accessible over the internet. 

### Create network profile at destination site
1. Login into Destination HCX Manager.
1. Select **Interconnect** and select the **Network Profiles** tab. 
1. Select **Create Network Profile**. 
1. Select **NSX Networks**.
1. Select the Public-IP-Segment created on NSX-T.
1. Enter **IP Ranges** for HCX uplink, **Prefix Length** and **Gateway** of public IP segment. 
1. Scroll down and select the **HCX Uplink** checkbox as this profile will be used for HCX uplink.
1. To create the Network Profile, select **Create**.

### Pair site
Site pairing is required to create service mesh between source and destination sites. 

1. Login into Source site HCX Manager.
1. Select **Site Pairing** and select **ADD SITE PAIRING**. 
1. Enter the remote HCX URL and login credentials, then select **Connect**. 
Once site pairing is done, it will look like this, refer below screen shot. 

### Create service mesh
Service Mesh will deploy HCX WAN Optimizer, HCX Network Extension and HCX-IX appliances. 
1. Login into Source site HCX Manager.
1. Select **Interconnect** and then select the **Service Mesh** tab.
1. Select **CREATE SERVICE MESH**. 
1. Select the destination site to create service mesh with and select **Continue**. 
1. Select the compute profiles for both sites and select **Continue**.
1. Select the HCX services to be activated and select **Continue**. 
   >[!Note]
   >Premium services require an additional HCX Enterprise license.   
1. Select the Network Profile of source site.
1. Select the Network Profile of Destination which, you created in the Network Profile creation section.
1. Select **Continue**.
1. Review the Transport Zone information, and select **Continue**. 
1. Review the Topological view, and select **Continue**.
1. Enter the Service Mesh name and select **FINISH**. 

### Extend network 
The HCX Network Extension service provides layer 2 connectivity between sites. The extension service also provides the ability to keep the same IP and MAC addresses during virtual machine migrations 
1. Login into source HCX Manager. 
1. Under **Network Extension**, select the site for which you want to extend the network, and select **EXTEND NETWORKS**. 
1. Select the network which you want to extend to destination site, and select **Next**. 
1. Enter subnet details of network which you're extending.
1. Select the destination first hop route (T1), and click **Submit**.

Sign in into destination NSX, you'll see Network 10.14.27.1/24 has been extended. After the network is extended to destination site, VMs can be migrated over L2E. 

### Migrate VM
VM migration was successfully completed as shown in the example below: 

## Next steps 
For detailed information on HCX network underlay minimum requirements, see [Network Underlay Minimum Requirements](https://docs.vmware.com/en/VMware-HCX/4.3/hcx-user-guide/GUID-8128EB85-4E3F-4E0C-A32C-4F9B15DACC6D.html).