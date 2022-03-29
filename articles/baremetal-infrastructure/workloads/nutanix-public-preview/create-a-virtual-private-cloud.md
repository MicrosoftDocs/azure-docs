---
title: Create a Virtual Private Cloud
description: 
ms.topic: how-to
ms.subservice:  
ms.date: 03/31/2021
---

# Create a Virtual Private Cloud

1. Log on to the Prism Element web console.
1. Launch Prism Central.
1. Click the gear icon in the main menu and select Network & Security > Virtual Private Clouds.
1. On the Virtual Private Clouds page, click Create VPC.
1. On the Create VPC page, enter the following details:
    - Name: Enter a name for the VPC. 
    - External Subnets: Select VLAN Subnets with External Connectivity 
VLAN Subnets with external connectivity are required to be associated to a VPC to send traffic to a destination outside of it. 
    - Externally Routable IP Addresses: Address space within the VPC which can talk externally without NAT. These are in effect when No-NAT External subnet is used. 
    - Domain Name Servers (DNS): Enter IP address or FQDN.
1. Set up the default route for the VPC with next-hop as the overlay-external-subnet-nat. 
This is required for North-South connectivity (Internet and Azure native services).
1. Click Create.


## Next steps

Learn more about Nutanix:

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)
