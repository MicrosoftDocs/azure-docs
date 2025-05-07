---
 author: wtnlee
 ms.service: azure-virtual-wan
 ms.topic: include
 ms.date: 11/02/2023
 ms.author: wellee
---

The following SD-WAN connectivity Network Virtual Appliances can be deployed in the Virtual WAN hub.

|Partners|Virtual WAN NVA Vendor Identifier|Configuration/How-to/Deployment guide| Dedicated support model |
|---|---| ---| --- |
|[Barracuda Networks](https://azuremarketplace.microsoft.com/marketplace/apps/barracudanetworks.barracuda_cloudgenwan_gateway?tab=Overviewus/marketplace/apps/barracudanetworks.barracuda_cloudgenwan_gateway?tab=Overview)| barracudasdwanrelease| [Barracuda SecureEdge for Virtual WAN Deployment Guide](https://campus.barracuda.com/product/secureedge/doc/98223577/how-to-create-a-barracuda-secureedge-service-in-microsoft-azure)|  Yes|
|[Cisco SD-WAN](https://aka.ms/ciscoMarketPlaceOffer)| ciscosdwan|The integration of the Cisco SD-WAN solution with Azure virtual WAN enhances Cloud OnRamp for Multi-Cloud deployments and enables configuring Cisco Catalyst 8000V Edge Software (Cisco Catalyst 8000V) as a network virtual appliance (NVA) in Azure Virtual WAN hubs. [View Cisco SD-WAN Cloud OnRamp, Cisco IOS XE Release 17.x configuration guide](https://www.cisco.com/c/en/us/td/docs/routers/sdwan/configuration/cloudonramp/ios-xe-17/cloud-onramp-book-xe/cloud-onramp-multi-cloud.html#Cisco_Concept.dita_c61e0e7a-fff8-4080-afee-47b81e8df701) | Yes|
|[VMware SD-WAN ](https://sdwan.vmware.com/partners/microsoft) | vmwaresdwaninvwan | [VMware SD-WAN in Virtual WAN hub deployment guide](https://docs.vmware.com/en/VMware-SD-WAN/index.html). The managed application for deployment can be found at this [Azure Marketplace link](https://azuremarketplace.microsoft.com/marketplace/apps/velocloud.vmware_sdwan_in_vwan).| Yes|
| [Versa Networks](https://versa-networks.com/partners/microsoft-azure.php) |versanetworks| If you're an existing Versa Networks customer, log on to your Versa account and access the deployment guide using the following link [Versa Deployment Guide](https://docs.versa-networks.com/Special:AuthenticationProviders?returntotitle=Getting_Started%2FDeployment_and_Initial_Configuration%2FBranch_Deployment%2FInitial_Configuration%2FInstall_a_VOS_Cloud_Gateway_on_an_Azure_Virtual_WAN). If you're a new Versa customer, sign-up using the [Versa preview sign-up link](https://versa-networks.com/demo/). | Yes |
| [Aruba EdgeConnect](https://www.arubanetworks.com/products/sd-wan/edgeconnect) |arubaedgeconnectenterprise| [Aruba EdgeConnect SD-WAN deployment guide](https://www.arubanetworks.com/techdocs/sdwan/docs/deployments/). **Currently in Preview**: [Azure Marketplace link](https://portal.azure.com/#create/silver-peak-systems.aruba_edgeconnect_enterprise_in_vwan_apparuba_edgeconnect_enterprise_in_vwan_v1)| No|

The following security Network Virtual Appliance can be deployed in the Virtual WAN hub. This Virtual Appliance can be used to inspect all North-South, East-West, and Internet-bound traffic.

|Partners| Virtual WAN NVA Vendor | Configuration/How-to/Deployment guide| Dedicated support model |
|---|---| --- | ---|
|[Check Point CloudGuard Network Security for Azure Virtual WAN](https://www.checkpoint.com/cloudguard/microsoft-azure-security/wan/) | checkpoint| [Check Point Network Security for Virtual WAN](https://sc1.checkpoint.com/documents/IaaS/WebAdminGuides/EN/CP_CloudGuard_Network_for_Azure_vWAN/Default.htm) deployment guide | No |
|[Fortinet Next-Generation Firewall (NGFW)](https://www.fortinet.com/products/next-generation-firewall)| fortinet-ngfw|[Fortinet NGFW](https://aka.ms/fortinetngfwdocumentation) deployment guide.  Fortinet NGFW supports up to 80 scale units and isn't recommended to be used for SD-WAN tunnel termination. For Fortigate SD-WAN tunnel termination, see [Fortinet SD-WAN and NGFW documentation](https://aka.ms/fortinetdualroledocumentation). | No|
|[Cisco Secure Firewall Threat Defense for Azure Virtual WAN](https://azuremarketplace.microsoft.com/marketplace/apps/cisco.cisco-tdv-for-vwan?tab=Overview) | cisco-tdv-vwan-nva| [Cisco Secure Firewall Threat Defense for Azure Virtual WAN for Virtual WAN](https://www.cisco.com/c/en/us/td/docs/security/firepower/quick_start/consolidated_ftdv_gsg/ftdv-gsg/m-ftdv-azure-gsg.html#topic_kcy_l1r_szb-tdv_on_azure_vWAN) deployment guide | No |

The following dual-role SD-WAN connectivity and security (Next-Generation Firewall) Network Virtual Appliances can be deployed in the Virtual WAN hub. These Virtual Appliances can be used to inspect all North-South, East-West, and Internet-bound traffic.

|Partners|Virtual WAN NVA Vendor | Configuration/How-to/Deployment guide| Dedicated support model |
|---|---| --- | ---|
| [Fortinet Next-Generation Firewall (NGFW)](https://www.fortinet.com/products/next-generation-firewall) |fortinet-sdwan-and-ngfw| [Fortinet SD-WAN and NGFW NVA](https://aka.ms/fortinetdualroledocumentation) deployment guide. Fortinet SD-WAN and NGFW NVA support up to 20 scale units and supports both SD-WAN tunnel termination and Next-Generation Firewall capabilities. | No |
