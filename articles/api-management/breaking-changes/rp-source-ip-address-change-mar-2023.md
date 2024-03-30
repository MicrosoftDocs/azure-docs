---
title: Azure API Management IP address change (March 2023) | Microsoft Docs
description: Azure API Management is updating the source IP address of the resource provider in certain regions.  If your service is hosted in a Microsoft Azure Virtual Network, you may need to update network settings to continue managing your service.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 02/07/2022
ms.author: danlep
---

# Resource Provider source IP address updates (March 2023)

On 31 March, 2023 as part of our continuing work to increase the resiliency of API Management services, we're making the resource providers for Azure API Management zone redundant in each region.  The IP address that the resource provider uses to communicate with your service will change in seven regions:

| Region | Old IP Address | New IP Address |
|:-------|:--------------:|:--------------:|
| Canada Central | 52.139.20.34 | 20.48.201.76 |
| Brazil South | 191.233.24.179 | 191.238.73.14 |
| Germany West Central | 51.116.96.0 | 20.52.94.112 |
| South Africa North | 102.133.0.79 | 102.37.166.220 |
| Korea Central | 40.82.157.167 | 20.194.74.240 |
| Central India | 13.71.49.1 | 20.192.45.112 |
| South Central US | 20.188.77.119 | 20.97.32.190 |

This change will have NO effect on the availability of your API Management service.  However, you **may** have to take steps described below to configure your API Management service beyond 31 March, 2023.

> These changes were completed between April 1, 2023 and April 20, 2023.  You can remove the IP addresses noted in the _Old IP Address_ column from your NSG.

## Is my service affected by this change?

Your service is impacted by this change if:

* The API Management service is in one of the seven regions listed in the table above.
* The API Management service is running inside an Azure virtual network.
* The Network Security Group (NSG) or User-defined Routes (UDRs) for the virtual network are configured with explicit source IP addresses.

## What is the deadline for the change?

The source IP addresses for the affected regions will be changed on 31 March, 2023.  Complete all required networking changes before then.

After 31 March 2023, if you prefer not to make changes to your IP addresses, your services will continue to run but you will not be able to add or remove APIs,  or change API policy, or otherwise configure your API Management service. 

## Can I avoid this sort of change in the future?

Yes, you can.

API Management publishes a _service tag_ that you can use to configure the NSG for your virtual network.  The service tag includes information about the source IP addresses that API Management uses to manage your service.  For more information on this topic, read [Configure NSG Rules] in the API Management documentation.

## What do I need to do?

Update the NSG security rules that allow the API Management resource provider to communicate with your API Management instance. For detailed instructions on how to manage an NSG, review [Create, change, or delete a network security group] in the Azure Virtual Network documentation.

1. Go to the [Azure portal](https://portal.azure.com) to view your NSGs.  Search for and select **Network security groups**.
2. Select the name of the NSG associated with the virtual network hosting your API Management service.
3. In the menu bar, choose **Inbound security rules**.
4. The inbound security rules should already have an entry that mentions a Source address matching the _Old IP Address_ from the table above.  If it doesn't, you're not using explicit source IP address filtering, and can skip this update.
5. Select **Add**.
6. Fill in the form with the following information:
  
   1. Source: **Service Tag**
   2. Source Service Tag: **ApiManagement**
   3. Source port ranges: __*__
   4. Destination: **VirtualNetwork**
   5. Destination port ranges: **3443**
   6. Protocol: **TCP**
   7. Action: **Allow**
   8. Priority: Pick a suitable priority to place the new rule next to the existing rule.

   The Name and Description fields can be set to anything you wish.  All other fields should be left blank.

7. Select **OK**.

In addition, you may have to adjust the network routing for the virtual network to accommodate the new control plane IP addresses.  If you've configured a default route (`0.0.0.0/0`) forcing all traffic from the API Management subnet to flow through a firewall instead of directly to the Internet, then additional configuration is required.  

If you configured user-defined routes (UDRs) for control plane IP addresses, the new IP addresses must be routed the same way.  For more details on the changes necessary to handle network routing of management requests, review [Force tunneling traffic] documentation.

Finally, check for any other systems that may impact the communication from the API Management resource provider to your API Management service subnet.  For more information about virtual network configuration, review the [Virtual Network] documentation.

## More Information

* [Virtual Network](../../virtual-network/index.yml)
* [API Management VNET Reference](../virtual-network-reference.md)
* [Microsoft Q&A](/answers/topics/azure-api-management.html)

<!-- Links -->
[Configure NSG Rules]: ../api-management-using-with-internal-vnet.md#configure-nsg-rules
[Virtual Network]: ../../virtual-network/index.yml
[Force tunneling traffic]: ../api-management-using-with-internal-vnet.md#force-tunnel-traffic-to-on-premises-firewall-using-expressroute-or-network-virtual-appliance
[Create, change, or delete a network security group]: ../../virtual-network/manage-network-security-group.md
