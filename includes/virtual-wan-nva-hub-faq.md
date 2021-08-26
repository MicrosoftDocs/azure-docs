---
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 06/02/2021
 ms.author: cherylmc
---
### I am a network appliance partner and want to get our NVA in the hub. Can I join this partner program?

Unfortunately, we do not have capacity to on-board any new partner offers at this time. Check back with us at a later date!

### Can I deploy any NVA from Azure Marketplace into the Virtual WAN hub?

At this time, only [Barracuda CloudGen WAN](https://aka.ms/BarracudaMarketPlaceOffer), [Cisco Cloud vWAN Application](https://azuremarketplace.microsoft.com/marketplace/apps/cisco.cisco_cloud_vwan_app?tab=Overview), and [VMware Sd-WAN](https://aka.ms/vmwareMarketplaceLink) are available to be deployed into the Virtual WAN hub.

### What is the cost of the NVA?

You must purchase a license for the NVA from the NVA vendor. For your Barracuda CloudGen WAN NVA from Barracuda license, see [Barracuda's CloudGen WAN page](https://www.barracuda.com/products/cloudgenwan). Cisco currently only offers BYOL (Bring Your Own License) licensing model that needs to be procured directly from Cisco. In addition, you will also incur charges from Microsoft for the NVA Infrastructure Units you consume, and any other resources you use. For more information, see [Pricing Concepts](../articles/virtual-wan/pricing-concepts.md).

### Can I deploy an NVA to a Basic hub?

No. You must use a Standard hub if you want to deploy an NVA.

### Can I deploy an NVA into a Secure hub?

Yes. Partner NVAs can be deployed into a hub with Azure Firewall.

### Can I connect any CPE device in my branch office to Barracuda CloudGen WAN NVA in the hub?

No. Barracuda CloudGen WAN is only compatible with Barracuda CPE devices. To learn more about CloudGen WAN requirements, see [Barracuda's CloudGen WAN page](https://www.barracuda.com/products/cloudgenwan). For Cisco, there are several SD-WAN CPE devices that are compatible. See [Cisco Cloud OnRamp for Multi-Cloud](https://www.cisco.com/c/en/us/td/docs/routers/sdwan/configuration/cloudonramp/ios-xe-17/cloud-onramp-book-xe/cloud-onramp-multi-cloud.html#Cisco_Concept.dita_c61e0e7a-fff8-4080-afee-47b81e8df701) documentation for compatible CPEs.

### What routing scenarios are supported with NVA in the hub?

All routing scenarios supported by Virtual WAN are supported with NVAs in the hub.
