---
 author: wtnlee
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 07/22/2022
 ms.author: wellee
---

The following SD-WAN connectivity Network Virtual Appliances can be deployed in the Virtual WAN hub.

|Partners|Configuration/How-to/Deployment guide| Dedicated support model |
|---|---| --- |
|[Barracuda Networks](https://azuremarketplace.microsoft.com/marketplace/apps/barracudanetworks.barracuda_cloudgenwan_gateway?tab=Overviewus/marketplace/apps/barracudanetworks.barracuda_cloudgenwan_gateway?tab=Overview)| [Barracuda SecureEdge for Virtual WAN Deployment Guide](https://campus.barracuda.com/product/secureedge/doc/98223577/how-to-create-a-barracuda-secureedge-service-in-microsoft-azure)| Yes|
|[Cisco SD-WAN](https://aka.ms/ciscoMarketPlaceOffer)| The integration of the Cisco SD-WAN solution with Azure virtual WAN enhances Cloud OnRamp for Multi-Cloud deployments and enables configuring Cisco Catalyst 8000V Edge Software (Cisco Catalyst 8000V) as a network virtual appliance (NVA) in Azure Virtual WAN hubs. [View Cisco SD-WAN Cloud OnRamp, Cisco IOS XE Release 17.x configuration guide](https://www.cisco.com/c/en/us/td/docs/routers/sdwan/configuration/cloudonramp/ios-xe-17/cloud-onramp-book-xe/cloud-onramp-multi-cloud.html#Cisco_Concept.dita_c61e0e7a-fff8-4080-afee-47b81e8df701) | Yes|
|[VMware SD-WAN ](https://sdwan.vmware.com/partners/microsoft) | [VMware SD-WAN in Virtual WAN hub deployment guide](https://kb.vmware.com/s/article/82746). The managed application for deployment can be found at this [Azure Marketplace link](https://azuremarketplace.microsoft.com/marketplace/apps/velocloud.vmware_sdwan_in_vwan).| Yes|
| [Versa Networks](https://versa-networks.com/partners/microsoft-azure.php) | If you're an existing Versa Networks customer, log on to your Versa account and access the deployment guide using the following link [Versa Deployment Guide](https://docs.versa-networks.com/Special:AuthenticationProviders?returntotitle=Getting_Started%2FDeployment_and_Initial_Configuration%2FBranch_Deployment%2FInitial_Configuration%2FInstall_a_VOS_Cloud_Gateway_on_an_Azure_Virtual_WAN). If you're a new Versa customer, sign-up using the [Versa preview sign-up link](https://versa-networks.com/demo/). | Yes |
| [Fortinet SD-WAN](https://www.fortinet.com/products/next-generation-firewall) | [Fortinet SD-WAN deployment guide](https://aka.ms/fortinetsdwandeploy). The managed application for this deployment can be found at this [Azure Marketplace Link](https://portal.azure.com/#create/fortinet.fortigate_vwan_nvamanagedfgtvwan). | No|
| [Aruba EdgeConnect](https://www.arubanetworks.com/products/sd-wan/edgeconnect) | [Aruba EdgeConnect SD-WAN deployment guide](https://aka.ms/arubasdwandeploy). **Currently in Preview**: [Azure Marketplace link](https://portal.azure.com/#create/silver-peak-systems.aruba_edgeconnect_enterprise_in_vwan_apparuba_edgeconnect_enterprise_in_vwan_v1)| No|

The following security Network Virtual Appliance can be deployed in the Virtual WAN hub. This Virtual Appliance can be used to inspect all North-South, East-West, and Internet-bound traffic.

|Partners|Configuration/How-to/Deployment guide| Dedicated support model |
|---|---| --- | 
|[Check Point CloudGuard Network Security (CGNS) Firewall](https://pages.checkpoint.com/cgns-vwan-hub-ea.html) | To access the preview of Check Point CGNS Firewall deployed in the Virtual WAN hub, reach out to DL-vwan-support-preview@checkpoint.com with your subscription ID. | No |
|[Fortinet Next-Generation Firewall (NGFW)](https://www.fortinet.com/products/next-generation-firewall)|To access the preview of Fortinet NGFW deployed in the Virtual WAN hub, reach out to azurevwan@fortinet.com with your subscription ID. For more information about the offering, see the [Fortinet blog post](https://www.fortinet.com/blog/business-and-technology/fortigate-vm-first-ngfw-and-secure-sd-wan-integration-in-microsoft-azure-virtual-wan). | No|

The following dual-role SD-WAN connectivity and security (Next-Generation Firewall) Network Virtual Appliances can be deployed in the Virtual WAN hub. These Virtual Appliances can be used to inspect all North-South, East-West, and Internet-bound traffic.

|Partners|Configuration/How-to/Deployment guide| Dedicated support model |
|---|---| --- | 
| [Fortinet Next-Generation Firewall (NGFW)](https://www.fortinet.com/products/next-generation-firewall) | To access the preview of Fortinet NGFW deployed in the Virtual WAN hub, reach out to azurevwan@fortinet.com with your subscription ID. For more information about the offering, see the [Fortinet blog post](https://www.fortinet.com/blog/business-and-technology/fortigate-vm-first-ngfw-and-secure-sd-wan-integration-in-microsoft-azure-virtual-wan). | No |
