---
title: 'Guidelines & limitations: Azure Storage firewall'
description: Learn about the restrictions and limitations for Azure Storage firewall configuration.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta

---

# Guidelines and limitations for the Azure Storage firewall

Before you implement network security for your storage accounts, review the important restrictions and considerations in this section.

## General guidelines and limitations

- Azure Storage firewall rules apply only to [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md#data-plane) operations. [Control plane](../../azure-resource-manager/management/control-plane-and-data-plane.md#control-plane) operations aren't subject to the restrictions specified in firewall rules.

- To access data by using tools such as the Azure portal, Azure Storage Explorer, and AzCopy, you must be on a machine within the trusted boundary that you establish when configuring network security rules.

  Some operations, such as blob container operations, can be performed through both the control plane and the data plane. If you attempt to perform an operation such as listing containers from the Azure portal, the operation succeeds unless it's blocked by another mechanism. Attempts to access blob data from an application such as Azure Storage Explorer are controlled by the firewall restrictions.

  For a list of data plane operations, see the [Azure Storage REST API Reference](/rest/api/storageservices/).

  For a list of control plane operations, see the [Azure Storage Resource Provider REST API Reference](/rest/api/storagerp/).

- Network rules are enforced on all network protocols for Azure Storage, including REST and SMB.

- Network rules don't affect virtual machine (VM) disk traffic, including mount and unmount operations and disk I/O, but they do help protect REST access to page blobs.

- You can use unmanaged disks in storage accounts with network rules applied to back up and restore VMs by [creating an exception](storage-network-security.md#manage-exceptions). Firewall exceptions don't apply to managed disks because Azure already manages them.

- If you delete a subnet that's included in a virtual network rule, it is removed from the network rules for the storage account. If you create a new subnet with the same name, it won't have access to the storage account. To allow access, you must explicitly authorize the new subnet in the network rules for the storage account.

- When referencing a service endpoint in a client application, we recommend that you avoid taking a dependency on a cached IP address. The storage account IP address is subject to change, and relying on a cached IP address might result in unexpected behavior. Additionally, we recommend that you honor the time-to-live (TTL) of the DNS record and avoid overriding it. Overriding the DNS TTL might result in unexpected behavior.

- By design, access to a storage account from trusted services takes the highest precedence over other network access restrictions. If you set **Public network access** to **Disabled** after previously setting it to **Enabled from selected virtual networks and IP addresses**, any [resource instances](storage-network-security.md#grant-access-from-azure-resource-instances) and [exceptions](storage-network-security.md#manage-exceptions) that you previously configured, including **Allow Azure services on the trusted services list to access this storage account**, will remain in effect. As a result, those resources and services might still have access to the storage account.

- Even if you disable public network access, you might still receive a warning from Microsoft Defender for Storage or from Azure Advisor which recommends that you restrict access by using virtual network rules. This can happen in cases where you disable public access by using a template. The **defaultAction** property remains set to **Allow** even though you set the **PublicNetworkAccess** property to **Disabled**. While the **PublicNetworkAccess** property takes precedence, tools such as Microsoft Defender also report on the value of the **defaultAction** property. To resolve this issue, either use a template to set the **defaultAction** property **Deny** or disable public access by using tool such as Azure portal, PowerShell, or Azure CLI. These tools automatically change the **defaultAction** property to a value of **Deny** for you.    

## Restrictions for IP network rules

- IP network rules are allowed only for *public internet* IP addresses.

  IP address ranges reserved for private networks (as defined in [RFC 1918](https://tools.ietf.org/html/rfc1918#section-3)) aren't allowed in IP rules. Private networks include addresses that start with 10, 172.16 to 172.31, and 192.168.

- You must provide allowed internet address ranges by using [CIDR notation](https://tools.ietf.org/html/rfc4632) in the form 16.17.18.0/24 or as individual IP addresses like 16.17.18.19.

- Small address ranges that use /31 or /32 prefix sizes aren't supported. Configure these ranges using individual IP address rules.

- Only IPv4 addresses are supported for configuration of storage firewall rules.

- You can't use IP network rules to restrict access to clients in the same Azure region as the storage account. IP network rules have no effect on requests that originate from the same Azure region as the storage account. Use [Virtual network rules](storage-network-security-virtual-networks.md) to allow same-region requests.

- You can't use IP network rules to restrict access to clients in a [paired region](../../reliability/cross-region-replication-azure.md) that are in a virtual network with a service endpoint.

- You can't use IP network rules to restrict access to Azure services deployed in the same region as the storage account. 

  Services deployed in the same region as the storage account use private Azure IP addresses for communication. Therefore, you can't restrict access to specific Azure services based on their public outbound IP address range.

## Next steps

- Learn more about [Azure network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).
- Dig deeper into [security recommendations for Azure Blob storage](../blobs/security-recommendations.md).
