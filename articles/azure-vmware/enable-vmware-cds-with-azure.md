---
title: Enable VMware Cloud Director service with Azure VMware Solution 
description: This article explains how to use  Azure VMware Solution to enable enterprise customers to use Azure VMware Solution for private clouds underlying resources for virtual datacenters.
ms.topic: how-to
ms.date: 08/30/2022
---

# Enable VMware Cloud Director service with Azure VMware Solution

[VMware Cloud Director service (CDs)](https://docs.vmware.com/en/VMware-Cloud-Director-service/services/getting-started-with-vmware-cloud-director-service/GUID-149EF3CD-700A-4B9F-B58B-8EA5776A7A92.html) with Azure VMware Solution enables enterprise customers to use APIs or the Cloud Director services portal to self-service provision and manage virtual datacenters through multi-tenancy with reduced time and complexity.

In this article, you'll learn how to enable VMware Cloud Director service with Azure VMware Solution for enterprise customers to use Azure VMware Solution resources and Azure VMware Solution private clouds with underlying resources for virtual datacenters.

>[!IMPORTANT] 
> VMware Cloud Director service is now available to use with Azure VMware Solution under the Enterprise Agreement (EA) model only. It's not suitable for MSP / Hosters to resell Azure VMware Solution capacity to customers at this point. For more information, see [Azure Service terms](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS#GeneralServiceTerms).

## Reference architecture
The following diagram shows typical architecture for Cloud Director services with Azure VMware Solution and how they're connected. Communications to Azure VMware Solution endpoints from Cloud Director service are supported by an SSL reverse proxy. 

:::image type="content" source="media/vmware-cds/reference-architecture-diagram.png" alt-text="Diagram showing typical architecture and how VMware Cloud Director service is connected with Azure VMware Solution." border="false" lightbox="media/vmware-cds/reference-architecture-diagram-expanded.png":::

VMware Cloud Director supports multi-tenancy by using organizations. A single organization can have multiple organization virtual data centers (VDC). Each Organization’s VDC can have their own dedicated Tier-1 router (Edge Gateway) which is further connected with the provider’s managed shared Tier-0 router.

[Learn more about CDs on Azure VMware Solutions reference architecture](https://cloudsolutions.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/docs/cloud-director-service-reference-architecture-for-azure-vmware-solution.pdf)

## Connect tenants and their organization virtual datacenters to Azure vNet based resources

To provide access to vNET based Azure resources, each tenant can have their own dedicated Azure vNET with Azure VPN gateway. A site-to-site VPN between customer organization VDC and Azure vNET is established. To achieve this connectivity, the provider will provide public IP to the organization VDC. Organization VDC’s administrator can configure IPSEC VPN connectivity from the Cloud Director service portal. 

:::image type="content" source="media/vmware-cds/site-to-site-vpn-diagram.png" alt-text="Diagram showing site to site VPN connection and how VMware Cloud Director service is connected with Azure VMware Solution." border="false" lightbox="media/vmware-cds/site-to-site-vpn-diagram-expanded.png":::

As shown in the diagram above, organization 01 has two organization virtual datacenters: VDC1 and VDC2. The virtual datacenter of each organization has its own Azure vNETs connected with their respective organization VDC Edge gateway through IPSEC VPN.
Providers provide public IP addresses to the organization VDC Edge gateway for IPSEC VPN configuration. An ORG VDC Edge gateway firewall blocks all traffic by default, specific allow rules needs to be added on organization Edge gateway firewall.

Organization VDCs can be part of a single organization and still provide isolation between them. For example, VM1 hosted in organization VDC1 cannot ping Azure VM JSVM2 for tenant2.

### Prerequisites  
- Organization VDC is configured with an Edge gateway and has Public IPs assigned to it to establish IPSEC VPN by provider.
- Tenants have created a routed Organization VDC network in tenant’s virtual datacenter.
- Test VM1 and VM2 are created in the Organization VDC1 and VDC2 respectively. Both VMs are connected to the routed orgVDC network in their respective VDCs.
- Have a dedicated [Azure vNET](tutorial-configure-networking.md#create-a-vnet-manually) configured for each tenant. For this example, we created Tenant1-vNet and Tenant2-vNet for tenant1 and tenant2 respectively.
- Create an [Azure Virtual network gateway](tutorial-configure-networking.md#create-a-virtual-network-gateway) for vNETs created earlier.
- Deploy Azure VMs JSVM1 and JSVM2 for tenant1 and tenant2 for test purposes.

> [!Note]
> VMware Cloud Director service supports a policy-based VPN.  Azure VPN gateway configures route-based VPN by default and to configure policy-based VPN policy-based selector needs to be enabled.

### Configure Azure vNet 
Create the following components in tenant’s dedicated Azure vNet to establish IPSEC tunnel connection with the tenant’s ORG VDC edge gateway. 
- Azure Virtual network gateway 
- Local network gateway. 
- Add IPSEC connection on VPN gateway.
- Edit connection configuration to enable policy-based VPN.

### Create Azure virtual network gateway
To create an Azure virtual network gateway, see the [create-a-virtual-network-gateway tutorial](tutorial-configure-networking.md#create-a-virtual-network-gateway).

### Create local network gateway
1.	Log in to the Azure portal and select **Local network gateway** from marketplace and then select **Create**.
1.	Local Network Gateway represents remote end site details. Therefore provide tenant1 OrgVDC public IP address and orgVDC Network details to create local end point for tenant1. 
1.	Under **Instance details**, select **Endpoint** as IP address
1.	Add IP address (add Public IP address from tenant’s OrgVDC Edge gateway).
1.	Under **Address space** add **Tenants Org VDC Network**.
1.	Repeat steps 1-5 to create a local network gateway for tenant 2.

### Create IPSEC connection on VPN gateway
1. Select tenant1 VPN Gateway (created earlier) and then select **Connection** (in left pane) to add new IPSEC connection with tenant1 orgVDC Edge gateway.  
1. Enter the following details.

     | **Name** | **Connection** |
     |:---------- | :--------------| 
     | Connection Type | Site to Site |
     | VPN Gateway | Tenant’s VPN Gateway |
     | Local Network Gateway | Tenant’s Local Gateway |
     | PSK | Shared Key (provide a password) |   
     | IKE Protocol | IKEV2 (ORG-VDC is using IKEv2) |

1. Select **Ok** to deploy local network gateway. 

### Configure IPsec Connection 
VMware Cloud Director service supports a policy-based VPN. Azure VPN gateway configures route-based VPN by default and to configure policy-based VPN policy-based selector needs to be enabled.

1. Select the connection you created earlier and then select **configuration** to view the default settings. 
1. **IPSEC/IKE Policy** 
1. **Enable policy base traffic selector**
1. Modify all other parameters to match what you have in OrgVDC.  
    >[!Note]
    > Both source and destination of the tunnel should have identical settings for IKE,SA, DPD etc.
1. Select **Save**.

### Configure VPN on organization VDC Edge router
1. Log in to Organization VMware Cloud Director service tenant portal and select tenant’s edge gateway. 
1. Select **IPSEC VPN** option under **Services** and then select **New**.
1. Under general setting, provide **Name** and select desired security profile. Ensure that security profile settings (IKE, Tunnel, and DPD configuration) are same on both sides of the IPsec tunnel. 
1. Modify Azure VPN gateway to match the Security profile, if necessary. You can also do security profile customization from CDS tenant portal.

   >[!Note]
   > VPN tunnel won't establish if these settings were mismatched.
1. Under **Peer Authentication Mode**, provide the same pre-shared key that is used at the Azure VPN gateway.
1. Under **Endpoint configuration**, add the Organization’s public IP and network details in local endpoint and Azure VNet details in remote endpoint configuration.
1. Under **Ready to complete**, review applied configuration.
1. Select **Finish** to apply configuration.

### Apply firewall configuration
Organization VDC Edge router firewall denies traffic by default. You'll need to apply specific rules to enable connectivity. Use the following steps to apply firewall rules.

1.	Add IP set in VMware Cloud Director service portal 
     1.	Log in to Edge router then select **IP SETS** under the **Security** tab in left plane.
     1. Select **New** to create IP sets.
     1.	Enter **Name** and **IP address** of test VM deployed in orgVDC.
     1.	Create another IP set for Azure vNET for this tenant.
2.	Apply firewall rules on ORG VDC Edge router.
      1. Under **Edge gateway**, select **Edge gateway** and then select **firewall** under **services**.
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
     1.	Log in to Azure VM deployed in tenants vNET and ping tenant’s test VM IP address in tenant’s OrgVDC.  
     For example, ping VM1 from JSVM1. Similarly, you should be able to ping VM2 from JSVM2.
You can verify isolation between tenants Azure vNETs. Tenant1’s VM1 won't be able to ping Tenant2’s Azure VM JSVM2 in tenant2 Azure vNETs. 

## Connect Tenant workload to public Internet   

- Tenants can use public IP to do SNAT configuration to enable Internet access for VM hosted in organization VDC. To achieve this connectivity, the provider can provide public IP to the organization VDC. 
- Each organization VDC can be created with dedicated T1 router (created by provider) with reserved Public & Private IP for NAT configuration. Tenants can use public IP SNAT configuration to enable Internet access for VM hosted in organization VDC. 
- OrgVDC administrator can create a routed OrgVDC network connected to their OrgVDC Edge gateway. To provide Internet access.
- OrgVDC administrator can configure SNAT to provide a specific VM or use network CIDR to provide public connectivity. 
- OrgVDC Edge has default DENY ALL firewall rule. Organization administrators will need to open appropriate ports to allow access through the firewall by adding a new firewall rule. Virtual machines configured on such OrgVDC network used in SNAT configuration should be able to access the Internet. 

### Prerequisites
1.	Public IP is assigned to the organization VDC Edge router. 
     To verify, log in to the organization's VDC. Under **Networking**> **Edges**, select **Edge Gateway**, then select **IP allocations** under **IP management**. You should see a range of assigned IP address  there.
2.	Create a routed Organization VDC network. (Connect OrgvDC network to the edge gateway with public IP address assigned)
	
### Apply SNAT configuration
1.	Log in to Organization VDC. Navigate to your Edge gateway and then select **NAT** under **Services**.
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
1. Log in to Organization VDC and navigate to **Edge Gateway**, then select **IP set** under security.
2. Create an IPset. Provide IP address of your VM (you can use CIDR also). Select **Save**.
3. Under **services**, select **Firewall**, then select **Edit rules**.
4. Select **New ON TOP** and create a firewall rule to allow desired port and destination.
1. Select the **IPset** your created earlier as source. Under **Action**, select **Allow**.
1. Select **Keep** to save the configuration.
1. Log in to your test VM and ping your destination address to verify outbound connectivity.

## Migrate workloads to VMware Cloud Director service on Azure VMware Solution

VMware Cloud Director Availability can be used to migrate VMware Cloud Director workload into the VMware Cloud Director service on Azure VMware Solution. Enterprise customers can drive self-serve one-way warm migration from the on-premises Cloud Director Availability vSphere plugin, or they can run the Cloud Director Availability plugin from the provider-managed Cloud Director instance and move workloads into Azure VMware Solution.

For more information about VMware Cloud Director Availability, see [VMware Cloud Director Availability | Disaster Recovery & Migration](https://www.vmware.com/products/cloud-director-availability.html) 

## FAQs

### What are the supported Azure regions for the VMware Cloud Director service?

This offering is supported in all Azure regions where Azure VMware Solution is available except for Brazil South and South Africa. Ensure that the region you wish to connect to VMware Cloud Director service is within a 150-milliseconds round trip time for latency with VMware Cloud Director service.

### How do I configure VMware Cloud Director service on Microsoft Azure VMware Solutions?

[Learn about how to configure CDs on Azure VMware Solutions](https://docs.vmware.com/en/VMware-Cloud-Director-service/services/using-vmware-cloud-director-service/GUID-602DE9DD-E7F6-4114-BD89-347F9720A831.html)

### How is VMware Cloud Director service supported?

VMware Cloud director service (CDs) is VMware owned and supported product connected to Azure VMware solution. For any support queries on CDs, please contact VMware support for assistance. Both VMware and Microsoft support teams collaborate as necessary to address and resolve Cloud Director Service issues within Azure VMware Solution.


## Next steps

[VMware Cloud Director Service Documentation](https://docs.vmware.com/en/VMware-Cloud-Director-service/index.html)  
[Migration to Azure VMware Solutions with Cloud Director service](https://cloudsolutions.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/docs/migration-to-azure-vmware-solution-with-cloud-director-service.pdf)


