---
title: Restrictions and limitations for Azure Storage firewall and virtual network configuration
description: Learn about the restrictions and limitations for Azure Storage firewall and virtual network configuration.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta

---

# Restrictions and limitations for Azure Storage firewall and virtual network configuration

Before you implement network security for your storage accounts, review the important restrictions and considerations discussed in this section.

## General restrictions and considerations

- Azure Storage firewall rules apply only to [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md#data-plane) operations. [Control plane](../../azure-resource-manager/management/control-plane-and-data-plane.md#control-plane) operations are not subject to the restrictions specified in firewall rules.

- To access data by using tools such as the Azure portal, Azure Storage Explorer, and AzCopy, you must be on a machine within the trusted boundary that you establish when configuring network security rules.

- Network rules are enforced on all network protocols for Azure Storage, including REST and SMB.

- Network rules don't affect virtual machine (VM) disk traffic, including mount and unmount operations and disk I/O, but they do help protect REST access to page blobs.

- You can use unmanaged disks in storage accounts with network rules applied to back up and restore VMs by [creating an exception](storage-network-security.md#manage-exceptions). Firewall exceptions aren't applicable to managed disks, because Azure already manages them.

- If you delete a subnet that's included in a virtual network rule, it will be removed from the network rules for the storage account. If you create a new subnet by the same name, it won't have access to the storage account. To allow access, you must explicitly authorize the new subnet in the network rules for the storage account.

- When referencing a service endpoint in a client application, it's recommended that you avoid taking a dependency on a cached IP address. The storage account IP address is subject to change, and relying on a cached IP address may result in unexpected behavior. Additionally, it's recommended that you honor the time-to-live (TTL) of the DNS record and avoid overriding it. Overriding the DNS TTL may result in unexpected behavior.

- By design, access to a storage account from trusted services takes the highest precedence over other network access restrictions. If you set **Public network access** to **Disabled** after previously setting it to **Enabled from selected virtual networks and IP addresses**, any [resource instances](storage-network-security.md#grant-access-from-azure-resource-instances) and [exceptions](storage-network-security.md#manage-exceptions) that you previously configured, including [Allow Azure services on the trusted services list to access this storage account](storage-network-security.md#grant-access-to-trusted-azure-services), will remain in effect. As a result, those resources and services might still have access to the storage account.

## Restrictions for IP network rules

- IP network rules are allowed only for *public internet* IP addresses.

  IP address ranges reserved for private networks (as defined in [RFC 1918](https://tools.ietf.org/html/rfc1918#section-3)) aren't allowed in IP rules. Private networks include addresses that start with 10, 172.16 to 172.31, and 192.168.

- You must provide allowed internet address ranges by using [CIDR notation](https://tools.ietf.org/html/rfc4632) in the form 16.17.18.0/24 or as individual IP addresses like 16.17.18.19.

- Small address ranges that use /31 or /32 prefix sizes are not supported. Configure these ranges by using individual IP address rules.

- Only IPv4 addresses are supported for configuration of storage firewall rules.

- You can't use IP network rules to restrict access to clients in same Azure region as the storage account. IP network rules have no effect on requests that originate from the same Azure region as the storage account. Use [Virtual network rules](storage-network-security-virtual-networks.md) to allow same-region requests.

- You can't use IP network rules to o restrict access to clients in a [paired region](../../reliability/cross-region-replication-azure.md) that are in a virtual network that has a service endpoint.

- You can't use IP network rules to restrict access to Azure services deployed in the same region as the storage account. 

  Services deployed in the same region as the storage account use private Azure IP addresses for communication. So, you can't restrict access to specific Azure services based on their public outbound IP address range.

## Next steps

- Learn more about [Azure network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).
- Dig deeper into [security recommendations for Azure Blob storage](../blobs/security-recommendations.md).
