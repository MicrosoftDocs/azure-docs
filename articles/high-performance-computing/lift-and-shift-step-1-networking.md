---
title: "Deployment step 1: basic infrastructure - network access component"
description: Learn about the configuration of network access during migration deployment step one.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Deployment step 1: basic infrastructure - network access component

Mechanism to allow users access cloud environment in a secure way. It's a common practice in production environments to have resources with private IP addresses, and with rules to define how resources should be accessed.

This component should:

- Allow users to access private network hosting the high performance computing (HPC) environment;
- Refine network security rules such as source and target ports and IP addresses that can access resources.

## Define network needs

* **Estimate cluster size for proper network setup:**
   - Different subnets have different ranges of IP addresses.

* **Security rules:**
   - Understand how users access the HPC environment and security rules to be in places (for example, ports and IPs open/closed).

## Tools and Services

* **Private network access:**
   - In Azure, the two major components to help access private network are Azure Bastion and Azure VPN Gateway.

* **Network rules:**
   - Another key component for network setup is Azure Network security groups, which is used to filter network traffic between Azure resources in an Azure virtual network.

* **DNS:**
   - Azure DNS Private Resolver allows query Azure DNS private zones from an on-premises environment and vice versa without deploying VM based DNS servers.

## Best practices for network in HPC lift and shift architecture

* **Have good understanding on cluster sizes and services to be used:**
   - Different cluster sizes require different IP ranges, and proper planning helps avoid major changes in parts of the infrastructure. Also, some services may need exclusive subnets, and having clarity on those subnets is essential.

## Example steps for setup and deployment

Networking is a vast topic itself. In a production level environment, it's good practice to not use public IP addresses. So one could start by testing such functionality by provisioning a VM and using Bastion.

For instance

1. **Provision a VM via portal with no public IP address:**
   - Follow the standard steps to provision a VM (that is, setup resource group, network, VM image, disk, etc.)
   - During the VM create, a Virtual Network needs to be created if it's not already available
   - Make sure the VM doesn't have a public IP address

2. **Use bastion:**
   - Once the VM is provisioned, go to the VM  via Azure portal
   - Select the option "Bastion" from "Connect" section.
   - Select option "Deploy Bastion"
   - Once the bastion is provisioned, the VM can be access through it.

## Resources

- VPN Gateway documentation: [product website](/azure/vpn-gateway/)
- Azure Bastion documentation: [product website](/azure/bastion/)
- Network Security groups: [product website](/azure/virtual-network/network-security-groups-overview)
- Azure DNS Private Resolver: [product website](/azure/dns/dns-private-resolver-overview)
