---
ms.assetid: 
title: VNET Service Endpoints for Azure Key Vault | Microsoft Docs
description: Overview of Virtual Network Service Endpoints for Key Vault
services: key-vault
author: amitbapat
ms.author: ambapat
manager: mbaldwin
ms.date: 08/31/2018
ms.service: key-vault
ms.workload: identity
ms.topic: conceptual
---
# Virtual Network Service Endpoints for Azure Key Vault

The virtual Network Service Endpoints for Key Vault allow you to restrict access to specified Virtual Network and/or to a list of IPv4 (Internet Protocol version 4) address ranges. Any caller connecting to your key vault from outside those sources will be denied access. If customer has opted-in to allow "Trusted Microsoft services" such as Office 365 Exchange Online, Office 365 SharePoint Online, Azure compute, Azure Resource Manager, Azure Backup etc., connections from those services will be let through the firewall. Of course, such callers still need to present a valid AAD token and must have permissions (configured as access policies) to perform the requested operation. Read more technical details about [Virtual Network Service Endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).

## Usage scenarios

You can configure [Key Vault firewalls and virtual networks](key-vault-network-security.md) to deny access to traffic from all networks (including the Internet traffic) by default. Access can be granted to traffic from specific Azure virtual networks and/or public internet IP address ranges, allowing you to build a secure network boundary for your applications.

> [!NOTE]
> Key Vault firewalls and virtual network rules ONLY apply to key vault [data plane](../key-vault/key-vault-secure-your-key-vault.md#data-plane-access-control). Key Vault control plane operations (such as key vault create, delete, modify operations, setting access policies, setting firewalls and virtual network rules) are not affected by firewalls and virtual network rules.

For example,
* If you are using Key Vault to store encryption keys, application secrets, certificates, and want to block access to your key vault from public internet.
* You want to lock down access to your key vault so that only your application or a short list of designated hosts can connect to your key vault
* You have an application running in your Azure virtual network (VNET) and this VNET is locked down for all inbound and outbound traffic. Your application still needs to connect to key vault to either fetch secrets or certificates or use cryptographic keys.

## Configure Key Vault firewalls and virtual networks

Here are the steps required to configure firewalls and virtual networks. These steps remain same irrespective of what interface (PowerShell, CLI, Azure portal) you will use to set up the firewall and virtual network rules.
1. Optional but highly recommended: Enable [key vault logging](key-vault-logging.md) to see detailed access logs. This will help you in diagnostics when firewalls and virtual network rules prevent access to a key vault.
2. Enable 'service endpoints for key vault' for target virtual network(s) and subnet(s)
3. Set firewalls and virtual network rules for a key vault to restrict access to that key vault from specific virtual network(s), subnet(s), and IPv4 address ranges.
4. If this key vault needs to be accessible by any trusted Microsoft services, you need to enable the option to allow 'Trusted Azure Services' to connect to key vault.

Refer to [Configure Azure Key Vault Firewalls and Virtual Networks](key-vault-network-security.md) for detailed step-by-step instructions.

> [!IMPORTANT]
> Once firewall rules are in effect, all Key Vault [data plane](../key-vault/key-vault-secure-your-key-vault.md#data-plane-access-control) operations can ONLY be performed when caller  requests originate from allowed virtual network(s) or IPV4 address ranges. This also applies to accessing key vault from Azure portal. While a user can browser to a key vault from Azure portal, they may not be able to list keys/secrets/certificates if their client machine is not in the allowed list. This also affects the 'Key Vault Picker' by other Azure services. Users may be able to see list of key vaults but not list keys, if firewall rules prevent their client machine.


> [!NOTE]
> * A maximum 127 VNET rules and 127 IPv4 rules are allowed. 
> * Small address ranges using "/31" or "/32" prefix sizes are not supported. These ranges should be configured using individual IP address rules.
> * IP network rules are only allowed for public IP addresses. IP address ranges reserved for private networks (as defined in RFC 1918) are not allowed in IP rules. Private networks include addresses that start with *10.**, *172.16.**, and *192.168.**. 
> * Only IPv4 addresses are supported at this time.

## Trusted services
Here is a list of trusted services that are allowed to access a key vault if 'Allow trusted services' option is enabled.

|Trusted service|Usage scenarios|
| --- | --- |
|Azure Virtual Machines deployment service|[Deploy Certificates to VMs from customer-managed Key Vault](https://blogs.technet.microsoft.com/kv/2016/09/14/updated-deploy-certificates-to-vms-from-customer-managed-key-vault/)|
|Azure Resource Manager template deployment service|[Pass secure values during deployment](../azure-resource-manager/resource-manager-keyvault-parameter.md)|
|Azure Disk Encryption volume encryption service|Allow access to BitLocker Key (Windows VM) or DM Passphrase (Linux VM) and Key Encryption Key during VM deployment to enable [Azure Disk Encryption](../security/azure-security-disk-encryption.md)|
|Azure Backup|Allow backup and restore of relevant keys and secrets during Azure VM backup, using [Azure Backup](../backup/backup-introduction-to-azure-backup.md)|
|Exchange Online & SharePoint Online|Allow access to customer key for Service Encryption with [Customer Key](https://support.office.com/en-us/article/Controlling-your-data-in-Office-365-using-Customer-Key-f2cd475a-e592-46cf-80a3-1bfb0fa17697).|
|Azure Information Protection|Allow access to tenant key for [Azure Information Protection.](https://docs.microsoft.com/azure/information-protection/what-is-information-protection)|
|App Services|[Deploying Azure Web App Certificate through Key Vault](https://blogs.msdn.microsoft.com/appserviceteam/2016/05/24/deploying-azure-web-app-certificate-through-key-vault/)|
|Azure SQL|[Transparent Data Encryption with Bring Your Own Key support for Azure SQL Database and Data Warehouse](../sql-database/transparent-data-encryption-byok-azure-sql.md?view=sql-server-2017&viewFallbackFrom=azuresqldb-current)|
|Azure Storage|[Storage Service Encryption using customer-managed keys in Azure Key Vault](../storage/common/storage-service-encryption-customer-managed-keys.md)|
|Azure Data Lake Store|[Encryption of data in Azure Data Lake Store](../data-lake-store/data-lake-store-encryption.md) with customer managed key|



> [!NOTE]
> The relevant key vault access policies must be set to allow the corresponding services to get access to key vault.

## Next steps

* [Secure your key vault](key-vault-secure-your-key-vault.md)
* [Configure Azure Key Vault Firewalls and Virtual Networks](key-vault-network-security.md)