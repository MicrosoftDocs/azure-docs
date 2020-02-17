--- 
title: Azure VMware Solutions (AVS) - Security for AVS Services
description: Describes the shared responsibility models for security of AVS services
author: sharaths-cs 
ms.author: b-shsury 
ms.date: 08/20/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# AVS security overview

This article provides an overview of how security is implemented on the Azure VMware Solution by AVS service, infrastructure, and datacenter. You learn about data protection and security, network security, and how vulnerabilities and patches are managed.

## Shared responsibility

Azure VMware Solution by AVS uses a shared responsibility model for security. Trusted security in the cloud is achieved through the shared responsibilities of customers and Microsoft as a service provider. This matrix of responsibility provides higher security and eliminates single points of failure.

## Azure infrastructure

Azure infrastructure security considerations include the datacenters and equipment location.

### Datacenter security

Microsoft has an entire division devoted to designing, building, and operating the physical facilities that support Azure. This team is invested in maintaining state-of-the-art physical security. For details on physical security, see [Azure facilities, premises, and physical security](../security/azure-physical-security.md).

### Equipment location

The bare metal hardware equipment that runs your AVS Private Clouds is hosted in Azure datacenter locations. The cages where that equipment is, requires biometric based two-factor authentication to gain access.

## Dedicated hardware

As part of the AVS service, all AVS customers get dedicated bare metal hosts with local attached disks that are physically isolated from other tenant hardware. An ESXi hypervisor with vSAN runs on every node. The nodes are managed through customer dedicated VMware vCenter and NSX. Not sharing hardware between tenants provides an additional layer of isolation and security protection.

## Data security

Customers keep control and ownership of their data. Data stewardship of customer data is the responsibility of the customer.

### Data protection for data at rest and data in motion within internal networks

For data at rest in the AVS Private Cloud environment, you can use vSAN encryption. vSAN encryption works with VMware certified external key management servers (KMS) in your own virtual network or on-premises. You control the data encryption keys yourself. For data in motion within the AVS Private Cloud, vSphere supports encryption of data over the wire for all vmkernel traffic (including vMotion traffic).

### Data Protection for data that is required to move through public networks

To protect data that moves through public networks, you can create IPsec and SSL VPN tunnels for your AVS Private Clouds. Common encryption methods are supported, including 128-byte and 256-byte AES. Data in transit (including authentication, administrative access, and customer data) is encrypted with standard encryption mechanisms (SSH, TLS 1.2, and Secure RDP). Communication that transports sensitive information  uses the standard encryption mechanisms.

### Secure Disposal

If your AVS service expires or is terminated, you are responsible for removing or deleting your data. AVS will cooperate with you to delete or return all customer data as provided in the customer agreement, except to the extent AVS is required by applicable law to retain some or all of the personal data. If necessary to retain any personal data, AVS will archive the data and implement reasonable measures to prevent the customer data from any further processing.

### Data Location

When setting up your AVS Private Clouds, you choose the Azure region where they will be deployed. VMware virtual machine data is not moved from that physical datacenter unless you perform data migration or offsite data backup. You can also host workloads and store data within multiple Azure regions if appropriate for your needs.

The customer data that is resident in AVS Private Cloud hyper-converged nodes doesn't traverse locations without the explicit action of the tenant administrator. It is your responsibility to implement your workloads in a highly available manner.

### Data backups

AVS doesn't back up or archive customer data. AVS does perform periodic backup of vCenter and NSX data to provide high availability of management servers. Prior to backup, all the data is encrypted at the vCenter source using VMware APIs. The encrypted data is transported and stored in Azure blob. Encryption keys for backups are stored in a highly secure AVS managed vault running in the AVS virtual network in Azure.

## Network Security

The AVS solution relies on layers of network security.

### Azure edge security

The AVS services are built on top of the base network security provided by Azure. Azure applies defense-in-depth techniques for detection and timely response to network-based attacks associated with anomalous ingress or egress traffic patterns and distributed denial-of-service (DDoS) attacks. This security control applies to AVS Private Cloud environments and the control plane software developed by AVS.

### Segmentation

The AVS service has logically separate Layer 2 networks that restrict access to your own private networks in your AVS Private Cloud environment. You can further protect your AVS Private Cloud networks using a firewall. The AVS portal allows you to define EW and NS network traffic controls rules for all network traffic, including intra AVS Private Cloud traffic, inter-AVS Private Cloud traffic, general traffic to the Internet, and network traffic to on-premises over IPsec VPN or ExpressRoute connection.

## Vulnerability and patch management

AVS is responsible for periodic security patching of managed VMware software (ESXi, vCenter, and NSX).

## Identity and access management

Customers can authenticate to their Azure account (in Azure AD) using multi-factor authentication or SSO as preferred. From the Azure portal, you can launch the AVS portal without reentering credentials.

AVS supports optional configuration of an identity source for the AVS Private Cloud vCenter. You can use an [on-premises identity source](set-vcenter-identity.md), a new identity source for the AVS Private Cloud, or [Azure AD](azure-ad.md).

By default, customers are given the privileges that are necessary for day-to-day operations of vCenter within the AVS Private Cloud. This permission level doesn't include administrative access to vCenter. If administrative access is temporarily required, you can [escalate your privileges](escalate-private-cloud-privileges.md) for a limited period while you complete the administrative tasks.
