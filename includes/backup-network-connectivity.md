---
title: include file
description: include file
services: backup
author: v-amallick
manager: carmonm
ms.service: backup
ms.topic: include
ms.date: 11/15/2022
ms.author: v-amallick
ms.custom: include file
---

The MARS agent requires access to Microsoft Entra ID, Azure Storage, and Azure Backup service endpoints. To obtain the public IP ranges, see the [JSON file](https://www.microsoft.com/en-us/download/confirmation.aspx?id=56519&preserveview=true). Allow access to the IPs corresponding to Azure Backup (`AzureBackup`), Azure Storage (`Storage`), and Microsoft Entra ID (`AzureActiveDirectory`). Also, depending on your Windows version, network connectivity checks of the operating system will need access to `www.msftconnecttest.com`, or `www.msftncsi.com`.

If your machine has limited internet access, ensure that firewall, proxy, and network settings allow access to the following FQDNs and public IP addresses.

### URL and IP access

**FQDNs**

- `*.microsoft.com`
- `*.windowsazure.com`
- `*.microsoftonline.com`
- `*.windows.net`
- `*.blob.core.windows.net`
- `*.queue.core.windows.net`
- `*.blob.storage.azure.net`

If you are a US Government customer, ensure that you have access to the following URLs:

- `www.msftncsi.com`
- `*.microsoft.com`
- `*.windowsazure.us`
- `*.microsoftonline.us`
- `*.windows.net`
- `*.usgovcloudapi.net`
- `*.blob.core.windows.net`
- `*.queue.core.windows.net`
- `*.blob.storage.azure.net`

Access to all of the URLs and IP addresses listed above uses the HTTPS protocol on port 443.

When backing up files and folders from Azure VMs using the MARS Agent, you also need to configure the Azure virtual network to allow access. If you use Network Security Groups (NSG), use the AzureBackup service tag to allow outbound access to Azure Backup. In addition to the Azure Backup tag, you also need to allow connectivity for authentication and data transfer by creating similar [NSG rules](../articles/virtual-network/network-security-groups-overview.md#service-tags) for Microsoft Entra ID (AzureActiveDirectory) and Azure Storage (Storage).

To create a rule for the Azure Backup tag, follow these steps:

1. In **All Services**, go to **Network security groups** and select the network security group.
1. Select **Outbound security rules** under **Settings**.
1. Select **Add**.
1. Provide all required details for creating a new rule as described in [security rule settings](../articles/virtual-network/manage-network-security-group.md#security-rule-settings).<br>Ensure the options are set as below:
   - **Destination** is set to _Service Tag_.
   - **Destination service tag** is set to _AzureBackup_.
1. Select **Add** to save the newly created outbound security rule.

You can similarly create NSG outbound security rules for Azure Storage and Microsoft Entra ID. To learn more about service tags, see [Virtual network service tags](../articles/virtual-network/service-tags-overview.md).

### Azure ExpressRoute support

You can back up your data through Azure ExpressRoute by using public peering (available for old circuits). We don’t support Microsoft peering Backup over private peering.

To use public peering, ensure that the following domains and addresses have HTTPS access on port 443 to:

- `*.microsoft.com`
- `*.windowsazure.com`
- `*.microsoftonline.com`
- `*.windows.net`
- `*.blob.core.windows.net`
- `*.queue.core.windows.net`
- `*.blob.storage.azure.net`

To use Microsoft peering, select the following services, regions, and relevant community values:
- Microsoft Entra ID (12076:5060)
- Azure region, according to the location of your Recovery Services vault
- Azure Storage, according to the location of your Recovery Services vault

Learn more about [ExpressRoute routing requirements](../articles/expressroute/expressroute-routing.md#bgp).

>[!NOTE]
>Public peering is deprecated for new circuits.


### Private Endpoint support

You can now use Private Endpoints to back up your data securely from servers to your Recovery Services vault. As Microsoft Entra ID can’t be accessed via private endpoints, you need to allow IPs and FQDNs required for Microsoft Entra ID for outbound access separately.

When you use the MARS agent to back up your on-premises resources, ensure that your on-premises network (containing your resources to be backed up) is peered with the Azure VNet that contains a private endpoint for the vault. You can then continue to install the MARS agent and configure backup. However, you must ensure all communication for backup happens through the peered network only.

If you remove private endpoints for the vault after a MARS agent has been registered to it, you'll need to re-register the container with the vault. You don't need to stop protection for them. For more information, see [Private endpoints for Azure Backup](../articles/backup/private-endpoints.md).

### Throttling support

| Feature | Details |
|---|---|
| Bandwidth control | Supported. In the MARS agent, use **Change Properties** to adjust bandwidth. |
| Network throttling | Not available for backed-up machines that run Windows Server 2008 R2, Windows Server 2008 SP2, or Windows 7. |
