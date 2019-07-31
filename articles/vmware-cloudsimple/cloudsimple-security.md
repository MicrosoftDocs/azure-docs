---
title: Security for CloudSimple services
description: Describes the shared responsibility models for security of CloudSimple services
author: sharaths-cs 
ms.author: b-shsury 
ms.date: 04/27/2019 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---

# CloudSimple security overview

This article provides an overview of how security is implemented on the Azure VMware Solution by CloudSimple service, infrastructure, and datacenter. You learn about data protection and security, network security, and how vulnerabilities and patches are managed.

## Shared responsibility

Azure VMware Solution by CloudSimple uses a shared responsibility model for security. Trusted security in the cloud is achieved through the shared responsibilities of customers and Microsoft as a service provider. This matrix of responsibility provides higher security and eliminates single points of failure.

## Azure infrastructure 

Azure infrastructure security considerations include the datacenters and equipment location.

### Datacenter security 

Microsoft has an entire division devoted to designing, building, and operating the physical facilities that support Azure. This team is invested in maintaining state-of-the-art physical security. For more information on physical security, see [Azure facilities, premises, and physical security](https://docs.microsoft.com/azure/security/azure-physical-security).

### Equipment location

The bare-metal hardware equipment that runs your private clouds is hosted in Azure datacenter locations. Biometric-based two-factor authentication is required to gain access to the cages where that equipment resides.

## Dedicated hardware

As part of the CloudSimple service, all CloudSimple customers get dedicated bare-metal hosts with local attached disks that are physically isolated from other tenant hardware. An ESXi hypervisor with vSAN runs on every node. The nodes are managed through customer-dedicated VMware, vCenter, and NSX. Not sharing hardware between tenants provides an additional layer of isolation and security protection.

## Data security

Customers keep control and ownership of their data. Data stewardship of customer data is the responsibility of the customer.

### Data protection for data at rest and data in motion within internal networks

For data at rest in the private cloud environment, you can use vSAN encryption. vSAN encryption works with VMware-certified external key management servers (KMS) in your own virtual network or on-premises. You control the data encryption keys yourself. For data in motion within the private cloud, vSphere supports encryption of data over the wire for all VMkernel traffic, which includes vMotion traffic.

### Data protection for data that's required to move through public networks

To protect data that moves through public networks, you can create IPsec and SSL VPN tunnels for your private clouds. Common encryption methods are supported, including 128-byte and 256-byte AES. Data in transit, which  includes authentication, administrative access, and customer data, is encrypted with standard encryption mechanisms, such as SSH, TLS 1.2, and secure RDP. Communication that transports sensitive information uses the standard encryption mechanisms.

### Secure disposal 

If your CloudSimple service expires or is terminated, you're responsible for removing or deleting your data. CloudSimple cooperates with you to delete or return all customer data as provided in the customer agreement, except to the extent CloudSimple is required by applicable law to retain some or all of the personal data. If necessary to retain any personal data, CloudSimple archives the data and implements reasonable measures to prevent the customer data from any further processing.

### Data location

When you set up your private clouds, you choose the Azure region where they're deployed. VMware virtual machine data isn't moved from that physical datacenter unless you perform data migration or offsite data backup. You also can host workloads and store data within multiple Azure regions if appropriate for your needs.

The customer data that's resident in private cloud hyperconverged nodes doesn't traverse locations without the explicit action of the tenant administrator. It's your responsibility to implement your workloads in a highly available manner.

### Data backups
CloudSimple doesn't back up or archive customer data. CloudSimple does perform periodic backup of vCenter and NSX data to provide high availability of management servers. Prior to backup, all the data is encrypted at the vCenter source by using VMware APIs. The encrypted data is transported and stored in an Azure blob. Encryption keys for backups are stored in a highly secure CloudSimple managed vault that runs in the CloudSimple virtual network in Azure.

## Network security

The CloudSimple solution relies on layers of network security.

### Azure edge security

The CloudSimple services are built on top of the base network security provided by Azure. Azure applies defense-in-depth techniques for detection and timely response to network-based attacks associated with anomalous ingress or egress traffic patterns and distributed denial-of-service (DDoS) attacks. This security control applies to private cloud environments and the control plane software developed by CloudSimple.

### Segmentation

The CloudSimple service has logically separate Layer 2 networks that restrict access to your own private networks in your private cloud environment. You can further protect your private cloud networks by using a firewall. In the CloudSimple portal, you define east-west and north-south network traffic control rules for all network traffic, which includes intra-private cloud traffic, inter-private cloud traffic, general traffic to the Internet, and network traffic to on-premises over IPsec VPN or Azure ExpressRoute connection.

## Vulnerability and patch management 

CloudSimple is responsible for periodic security patching of managed VMware software, such as ESXi, vCenter, and NSX.

## Identity and access management

Customers can authenticate to their Azure account (in Azure Active Directory) by using multifactor authentication or SSO as preferred. From the Azure portal, you can launch the CloudSimple portal without reentering credentials.

CloudSimple supports optional configuration of an identity source for the private cloud vCenter. You can use an [on-premises identity source](https://docs.azure.cloudsimple.com/set-vcenter-identity), a new identity source for the private cloud, or [Azure Active Directory](https://docs.azure.cloudsimple.com/azure-ad).

By default, customers are given the privileges that are necessary for day-to-day operations of vCenter within the private cloud. This permission level doesn't include administrative access to vCenter. If administrative access is temporarily required, you can [escalate your privileges](https://docs.azure.cloudsimple.com/escalate-private-cloud-privileges) for a limited period while you complete the administrative tasks.

## Next steps

* Learn how to [create a CloudSimple service on Azure](quickstart-create-cloudsimple-service.md).
* Learn how to [create a private cloud](https://docs.azure.cloudsimple.com/create-private-cloud/).
* Learn how to [configure a private cloud environment](quickstart-create-private-cloud.md).
