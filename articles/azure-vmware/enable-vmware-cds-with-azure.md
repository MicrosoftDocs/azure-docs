---
title: Enable VMware Cloud director service with Azure VMware solution (Public Preview)
description: This article explains how to use  Azure VMware solution to enable enterprise customers to leverage Azure VMware solutions for private clouds underlying resources for virtual datacenters.
ms.topic: how-to
ms.date: 08/09/2022
---

# Enable VMware Cloud director service with Azure VMware solution (Public Preview)

VMware Cloud Director Service (CDs) (VMware Cloud Director service | Managed Service | Cloud Solutions & Services) with Azure VMware Solutions enables enterprise customers, to use APIs or the Cloud Director services portal to self-service provision and manage virtual datacenters through multi-tenancy with reduced time and complexity.

In this article, you'll learn how to enable VMware Cloud Director service (CDs) with Azure VMware solution for enterprise customers to use Azure VMware Solutions resources and Azure VMware solutions private clouds with underlying resources for virtual datacenters.

>[!IMPORTANT] 
> Cloud director service (CDs) is now available to use with Azure VMware solutions under the Enterprise Agreement (EA) model only. It's not suitable for MSP / Hoster to resell Azure VMware Solution capacity to customers at this point. For more information, see [Azure Service terms](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS#GeneralServiceTerms).

## Reference Architecture
The following diagram shows typical architecture for Cloud Director Services with Azure VMware solutions and how they are connected. Communications to Azure VMware Solution endpoints from cloud Director service are supported by an SSL reverse proxy. 

:::image type="content" source="media/vmware-cds/reference-architecture-diagram.png" alt-text="Diagram showing typical architecture and how CDS is connected with Azure VMware solutions" border="false" lightbox="media/vmware-cds/reference-architecture-diagram-expanded.png":::

VMware Cloud Director supports multi-tenancy by using organizations. A single organization can have multiple organization virtual data centers (VDC). Each Organization’s VDC can have their own dedicated Tier-1 router (Edge Gateway) which is further connected with the provider’s managed shared Tier-0 router.

## Connect tenants and their organization virtual datacenters to Azure vNet based resources

VMware Cloud Director supports multi-tenancy by using organizations. A single organization can have multiple organization virtual data centers (VDC). Each Organization’s VDC can have their own dedicated Tier-1 router (Edge Gateway) which is further connected with the provider’s managed shared Tier-0 router.
To provide access to vNET based Azure resources, each tenant can have their own dedicated Azure vNET with Azure VPN gateway. A Site-to-site VPN between customer Organization VDC and Azure vNET is established. To achieve this connectivity, the provider will provide public IP to the organization VDC. Organization VDC’s Administrator can configure IPSEC VPN connectivity from Cloud Director Service portal. 

:::image type="content" source="media/vmware-cds/site-to-site-vpn-diagram.png" alt-text="Diagram showing site to site VPN connection and how CDS is connected with Azure VMware solutions." border="false" lightbox="media/vmware-cds/site-to-site-vpn-diagram-expanded.png":::

As shown in figure above, Organization 01 has two organization Virtual datacenters (VDCs), VDC1 and VDC2. The virtual data center of each organization has its own Azure vNETs connected with their respective organization VDC Edge gateway through IPSEC VPN.
Providers provide public IP addresses to the organization VDC Edge gateway for IPSEC VPN configuration. ORG VDC Edge gateway’s firewall blocks all traffic by default, specific allow rules needs to be added on Organization Edge gateway firewall.

Organization VDCs can be part of a single organization but it still provides isolation between them. For example, VM1 hosted in organization VDC1 cannot ping Azure VM JSVM2 for tenant2.


### Prerequisite  
- Organization VDC is configured with an Edge gateway and has Public IPs assigned to it to establish IPSEC VPN by provider.
- 	Tenants have created a routed Organization VDC network in tenant’s Virtual datacenter.
- Test VM1 and VM2 are created in the Organization VDC1 and VDC2 respectively. Both VMs are connected to the routed orgVDC network in their respective VDCs.
- A dedicated [Azure vNET](tutorial-configure-networking.md#create-a-vnet-manually) is configured for each tenant. For this example, we created Tenant1-vNet and Tenant2-vNet for tenant1 and tenant2 respectively.
- Create [Azure Virtual network gateway](tutorial-configure-networking.md#create-a-virtual-network-gateway) for vNETs created earlier.
- Deploy Azure VMs JSVM1 and JSVM2 for tenant1 and tenant2 for test purposes.

> [!Note]
> CDS supports a policy-based VPN.  Azure VPN gateway configures route-based VPN by default and to configure policy-based VPN policy-based selector needs to be enabled.

### Configure Azure vNet 
Create the following components in tenant’s dedicated Azure vNet to establish IPSEC tunnel connection with the tenant’s ORG VDC edge gateway. 
- Azure Virtual network gateway 
- Local network gateway. 
- Add IPSEC connection on VPN gateway.
- Edit connection configuration to enable policy-based VPN. git status

### Create Azure virtual network gateway
To create a Azure virtual network gateway, see the [create-a-virtual-network-gateway tutorial](tutorial-configure-networking.md#create-a-virtual-network-gateway)

### Create local network gateway
1.	Log in to the Azure portal and select **Local network gateway** from marketplace and then select **Create**.
1.	Local Network Gateway represents remote end site details. Therefore provide tenant1 OrgVDC public IP address and orgVDC Network details to create local end point for tenant1. 
1.	Under **Instance details**, select **Endpoint** as IP address
1.	Add IP address (add Public IP address from tenant’s OrgVDC Edge gateway).
1.	Under **Address space** add **Tenants Org VDC Network**.
1.	Similarly, create Local network gateway for tenant2.

### Create IPSEC connection on VPN gateway
1. Select tenant1 VPN Gateway (created earlier) and then select connection (in left plane) to add new IPSEC connection with tenant1 orgVDC Edge gateway.  

1. Enter the following details.
     | Name | Connection Name |
     |--------- | --------| 
     | Connection Type | Site to Site |
     | VPN Gateway | Tenant’s VPN Gateway |
     | Local Network Gateway | Tenant’s Local Gateway |
     | PSK | Shared Key (provide a password) |   
     | IKE Protocol| IKEV2 (ORG-VDC is using IKEv2) |
1. Select **Ok** to deploy local network gateway. 

### Configure IPsec Connection 
Cloud Director Service supports a policy-based VPN.  Azure VPN gateway configures route-based VPN by default and to configure policy-based VPN policy-based selector needs to be enabled.

Select the connection you created earlier and then select **configuration** to view the default settings. 
- **IPSEC/IKE Policy** 
- **Enable policy base traffic selector**
 - Modify all other parameters to match what you have in OrgVDC.  
    >[!Note]
    > Both source and destination of the tunnel should have identical settings for IKE,SA, DPD etc.
- Select **Save**.

### Configure VPN on organization VDC Edge router
1. Log in to Organization CDS tenant portal and select tenant’s edge gateway. 
1. Select **IPSEC VPN** option under **Services** and then select **New**.
1. Under general setting, provide **Name** and select desired security profile. Ensure that security profile settings (IKE, Tunnel and DPD configuration) are same on both sides of the IPsec tunnel. 
1. Modify Azure VPN gateway to match the Security profile, if necessary. You can also do security profile customization from CDS tenant portal.

   >[!Note]
   > VPN tunnel would not establish if these settings were mismatched.
1. Under **Peer Authentication Mode**, provide the same pre-shared key that is used at the Azure VPN gateway.
1. Under **Endpoint configuration**, add the Organization’s public IP and network details in local endpoint and Azure VNet details in remote endpoint configuration.
1. Under **Ready to complete**, review applied configuration.
1. Select **Finish** to apply configuration.

### Apply firewall configuration
Organization VDC Edge router firewall denies traffic by default. We need to apply specific rules to enable connectivity. Follow the steps below to apply firewall rules.

1.	Add IP set in CDS portal 
     1.	Log in to Edge router then select **IP SETS** under the **Security** tab in left plane.
     1.Select **New** to create IP sets.
     1.	Enter **Name** and **IP address** of test VM deployed in orgVDC.
     1.	Create another IP set for Azure vNET for this tenant.
2.	Apply firewall rules on ORG VDC Edge router.
      1. Under **Edge gateway**, select Edge gateway and then select **firewall** under **services**.
     1.	Select **Edit rules**. 
     1.	Select **NEW ON TOP** and enter rule name.
     1. Add **source** and **destination** details. Use created IPSET in source and destination.  
     1. Under **Action**, select **Allow**.
     1.	Select **Save** to apply configuration.
3.	Verify tunnel status
     1.	Under **Edge gateway** select **Service**, then select **IPSEC VPN**, 
     1. Select **View statistics**.  
     Status of tunnel should show **UP**.
4.	Verify IPsec connection
     1.	Log in to Azure VM deployed in tenants vNET and ping tenant’s test VM IP address in tenant’s OrgVDC. For example, ping VM1 from JSVM1. Similarly, you should be able to ping VM2 from JSVM2.
     1.	You can verify isolation between tenants Azure vNETs. Tenant1’s  VM1 won't be able to ping Tenant2’s Azure VM JSVM2 in tenant2 Azure vNETs. 

## Connect Tenant’s workload to public internet   

- Tenants can use public IP to do SNAT configuration to enable internet access for VM hosted in organization VDC. To achieve this connectivity, the provider can provide public IP to the organization VDC. 
- Each organization VDC can be created with dedicated T1 router (Created by Provider) with reserved Public & Private IP for NAT configuration. Tenants can use public IP SNAT configuration to enable internet access for VM hosted in organization VDC. 
- OrgVDC Administrator can create a routed OrgVDC network connected to their OrgVDC edge gateway. To provide Internet access.
- OrgVDC admin can configure SNAT, to provide a specific VM or can use network CIDR to provide public connectivity. 
- OrgVDC Edge has default DENY ALL firewall rule. Organization administrators will need to open appropriate ports to allow through firewall by adding a new firewall rule. Virtual machines configured on such OrgVDC network used in SNAT configuration should be able to access the internet. 

### Prerequisites
1.	Public IP is assigned to the organization VDC Edge router. 
     To verify, log in to the organization's VDC. Under **Networking**> **Edges**, select **Edge Gateway** and then select **IP allocations** under **IP management**. You should see a range of assigned IP address  there.
2.	Create a routed Organization VDC network. (Connect OrgvDC network to the edge gateway with public IP address assigned)
	
### Apply SNAT configuration
1.	Log in to Organization VDC. Navigate to your Edge gateway and then select NAT under services.
2.	Select **New** to add new SNAT rule.
3.	Provide **Name** and select **Interface type** as SNAT.
4.	Under **External IP**, enter public IP address from public IP pool assigned to your orgVDC Edge router.
5.	Under **Internal IP**, enter IP address for your test VM. 
      This IP address is one of the orgVDC network IP assigned to the VM.
6.	**State** should be enabled.
7.	Under **Priority**, select a higher number.
      For example, 4096.
8.	Select **Save** to save the configuration.

### Apply firewall rule
1. Log in to Organization VDC and navigate to **Edge Gateway** and then select **IP set** under security.
2. Create an IPset. Provide IP address of your VM (you can use CIDR also). Select save.
3. Under **services**, select **Firewall** and then select **Edit rules**.
4. Select **New ON TOP** and create a firewall rule to allow desired port and destination.
1. Select the **IPset** your created earlier as source. Under **Action**, select **Allow**.
1. Select **Keep** to save the configuration.
1. Log in to your test VM and ping your destination address to verify outbound connectivity.

## Migrate workloads to Cloud Director Service on Azure VMware Solutions

VMware Cloud Director Availability can be used to migrate  VMware Cloud Director workload into Cloud Director service on Azure VMware Solution. Enterprise customers can drive self-serve one-way warm migration from the on-premises Cloud Director Availability vSphere plugin, or they can run the Cloud Director Availability plugin from the provider-managed Cloud Director instance and move workloads into Azure VMware Solution.

For more information about VMware Cloud Director Availability, see [VMware Cloud Director Availability | Disaster Recovery & Migration](https://www.vmware.com/products/cloud-director-availability.html) 

## FAQs
**Question**: In which Azure regions, VMware cloud director service is supported?

**Answer**: This offering is supported in all Azure regions where Azure VMware solutions are available. Ensure that the region you wish to connect to Cloud Director service is within a 150-milliseconds round trip time for latency with cloud director service.

## Next steps
[What Is VMware Cloud Director service and How Does It Work](https://docs.vmware.com/en/VMware-Cloud-Director-service/services/getting-started-with-vmware-cloud-director-service/GUID-149EF3CD-700A-4B9F-B58B-8EA5776A7A92.html)  
