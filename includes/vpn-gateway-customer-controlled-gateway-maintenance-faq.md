---
author: cherylmc
ms.author: cherylmc
ms.date: 11/01/2023
ms.service: vpn-gateway
ms.topic: include

## This article pertains to ExpressRoute, VPN Gateway, and Virtual WAN FAQs. If you need to add something that **doesn't** apply to all 3 of these services, go to the FAQ and update the FAQ section of the specific service that your additional information applies to, using the exact format below. Add your information after the include in that section.

---

### Which services are included in the Maintenance Configuration scope of Network Gateways? 

The Network Gateways scope includes gateway resources in Networking services. There are four types of resources in the Network Gateways scope:

* Virtual network gateway in the ExpressRoute service.
* Virtual network gateway in the VPN Gateway service.
* VPN gateway (Site-to-Site) in the Virtual WAN service.
* ExpressRoute gateway in the Virtual WAN service.

### Which maintenance is supported or not supported by customer-controlled maintenance?

Azure services go through periodic maintenance updates to improve functionality, reliability, performance, and security. Once you configure a maintenance window for your resources, Guest OS and Service maintenance are performed during that window. Host updates, beyond the host updates (TOR, Power etc.) and critical security updates, aren't covered by the customer-controlled maintenance.  

### Can I get advanced notification of the maintenance?

At this time, advanced notification can't be enabled for the maintenance of Network Gateway resources.

### Can I configure a maintenance window shorter than five hours?

At this time, you need to configure a minimum of a five hour window in your preferred time zone.

### Can I configure a maintenance window other than Daily schedule?

At this time, you need to configure a daily maintenance window.

### Are there cases where I can’t control certain updates?

Customer-controlled maintenance supports Guest OS and Service updates. These updates account for most of the maintenance items that cause concern for the customers. Some other types of updates, including Host updates, are outside of the scope of customer-controlled maintenance.

Additionally, if there's a high-severity security issue that might endanger our customers, Azure might need to override customer control of the maintenance window and push the change. These are rare occurrences that would only be used in extreme cases.

### Do Maintenance Configuration resources need to be in the same region as the gateway resource?

Yes

### Which gateway SKUs can be configured to use customer-controlled maintenance?

All gateway SKUs (except the Basic SKU for VPN Gateway) can be configured to use customer-controlled maintenance.

### How long does it take for maintenance configuration policy to become effective after it gets assigned to the gateway resource?

It might take up to 24 hours for Network Gateways to follow the maintenance schedule after the maintenance policy is associated with the gateway resource.  

### Are there any limitations on using customer-controlled maintenance based on the Basic SKU Public IP address?

Yes. Gateway resources that use a Basic SKU Public IP address will only be able to have service updates following the customer-controlled maintenance schedule. For these gateways, Guest OS maintenance does NOT follow the customer-controlled maintenance schedule due to infrastructure limitations.

### How should I plan maintenance windows when using VPN and ExpressRoute in a coexistence scenario?

When working with VPN and ExpressRoute in a coexistence scenario or whenever you have resources acting as backups, we recommend setting up separate maintenance windows. This approach ensures that maintenance doesn't affect your backup resources at the same time.

### I've scheduled a maintenance window for a future date for one of my resources. Will maintenance activities be paused on this resource until then?

No, maintenance activities won't be paused on your resource during the period before the scheduled maintenance window. For the days not covered in your maintenance schedule, maintenance continues as usual on the resource.