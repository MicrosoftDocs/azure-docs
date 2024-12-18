---
author: cherylmc
ms.author: cherylmc
ms.date: 07/30/2024
ms.service: azure-vpn-gateway
ms.topic: include

## This article pertains to ExpressRoute, VPN Gateway, and Virtual WAN FAQs. If you need to add something that **doesn't** apply to all 3 of these services, go to the FAQ and update the FAQ section of the specific service that your additional information applies to, using the exact format below. Add your information after the include in that section.

---

### Which services are included in maintenance configuration for the Network Gateways scope? 

The Network Gateways scope includes gateway resources in networking services. There are four types of resources in the Network Gateways scope:

* Virtual network gateway in the ExpressRoute service
* Virtual network gateway in the VPN Gateway service
* VPN gateway (site-to-site) in the Azure Virtual WAN service
* ExpressRoute gateway in the Virtual WAN service

### Which maintenance does customer-controlled maintenance support?

Azure services go through periodic maintenance updates to improve functionality, reliability, performance, and security. After you configure a maintenance window for your resources, guest OS maintenance and service maintenance are performed during that window. Customer-controlled maintenance doesn't cover host updates (beyond the host updates for Power, for example) and critical security updates.

### Can I get advanced notification of the maintenance?

At this time, you can't get advanced notification for the maintenance of Network Gateway resources.

### Can I configure a maintenance window shorter than five hours?

At this time, you need to configure a minimum of a five-hour window in your preferred time zone.

### Can I configure a maintenance window other than a daily schedule?

At this time, you need to configure a daily maintenance window.

### Are there cases where I can't control certain updates?

Customer-controlled maintenance supports guest OS and service updates. These updates account for most of the maintenance items that cause concern for customers. Some other types of updates, including host updates, are outside the scope of customer-controlled maintenance.

If a high-severity security issue might endanger customers, Azure might need to override customer control of the maintenance window and push a change. These changes are rare occurrences that we use only in extreme cases.

### Do maintenance configuration resources need to be in the same region as the gateway resource?

Yes.

### Which gateway SKUs can I configure to use customer-controlled maintenance?

All the Azure VPN Gateway SKUs (except the Basic SKU) can be configured to use customer-controlled maintenance.

### How long does it take for a maintenance configuration policy to become effective after it's assigned to the gateway resource?

It might take up to 24 hours for Network Gateways to follow the maintenance schedule after the maintenance policy is associated with the gateway resource.  

### Are there any limitations on using customer-controlled maintenance based on the Basic SKU public IP address?

Yes. Customer-controlled maintenance doesn't work for resources that use Basic SKU public IP addresses, except in the case of service updates. For these gateways, guest OS maintenance does *not* follow the customer-controlled maintenance schedule because of infrastructure limitations.

### How should I plan maintenance windows when using VPN and ExpressRoute in a coexistence scenario?

When you work with VPN and ExpressRoute in a coexistence scenario or whenever you have resources that act as backups, we recommend setting up separate maintenance windows. This approach ensures that maintenance doesn't affect your backup resources at the same time.

### I scheduled a maintenance window for a future date for one of my resources. Are maintenance activities paused on this resource until then?

No, maintenance activities aren't paused on your resource during the period before the scheduled maintenance window. For the days not covered in your maintenance schedule, maintenance continues as usual on the resource.
