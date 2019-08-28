---
title: Virtual network service endpoints for Azure Key Vault - Azure Key Vault | Microsoft Docs
description: Overview of virtual network service endpoints for Key Vault
services: key-vault
author: amitbapat
ms.author: ambapat
manager: barbkess
ms.date: 01/02/2019
ms.service: key-vault
ms.topic: conceptual
---
# Virtual network service endpoints for Azure Key Vault

The virtual network service endpoints for Azure Key Vault allow you to restrict access to a specified virtual network. The endpoints also allow you to restrict access to a list of IPv4 (internet protocol version 4) address ranges. Any user connecting to your key vault from outside those sources is denied access.

There is one important exception to this restriction. If a user has opted-in to allow trusted Microsoft services, connections from those services are let through the firewall. For example, these services include Office 365 Exchange Online, Office 365 SharePoint Online, Azure compute, Azure Resource Manager, and Azure Backup. Such users still need to present a valid Azure Active Directory token, and must have permissions (configured as access policies) to perform the requested operation. For more information, see [Virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).

## Usage scenarios

You can configure [Key Vault firewalls and virtual networks](key-vault-network-security.md) to deny access to traffic from all networks (including internet traffic) by default. You can grant access to traffic from specific Azure virtual networks and public internet IP address ranges, allowing you to build a secure network boundary for your applications.

> [!NOTE]
> Key Vault firewalls and virtual network rules only apply to the [data plane](../key-vault/key-vault-secure-your-key-vault.md#data-plane-access-control) of Key Vault. Key Vault control plane operations (such as create, delete, and modify operations, setting access policies, setting firewalls, and virtual network rules) are not affected by firewalls and virtual network rules.

Here are some examples of how you might use service endpoints:

* You are using Key Vault to store encryption keys, application secrets, and certificates, and you want to block access to your key vault from the public internet.
* You want to lock down access to your key vault so that only your application, or a short list of designated hosts, can connect to your key vault.
* You have an application running in your Azure virtual network, and this virtual network is locked down for all inbound and outbound traffic. Your application still needs to connect to Key Vault to fetch secrets or certificates, or use cryptographic keys.

## Configure Key Vault firewalls and virtual networks

Here are the steps required to configure firewalls and virtual networks. These steps apply whether you are using PowerShell, the Azure CLI, or the Azure portal.

1. Enable [Key Vault logging](key-vault-logging.md) to see detailed access logs. This helps in diagnostics, when firewalls and virtual network rules prevent access to a key vault. (This step is optional, but highly recommended.)
2. Enable **service endpoints for key vault** for target virtual networks and subnets.
3. Set firewalls and virtual network rules for a key vault to restrict access to that key vault from specific virtual networks, subnets, and IPv4 address ranges.
4. If this key vault needs to be accessible by any trusted Microsoft services, enable the option to allow **Trusted Azure Services** to connect to Key Vault.

For more information, see [Configure Azure Key Vault firewalls and virtual networks](key-vault-network-security.md).

> [!IMPORTANT]
> After firewall rules are in effect, users can only perform Key Vault [data plane](../key-vault/key-vault-secure-your-key-vault.md#data-plane-access-control) operations when their requests originate from allowed virtual networks or IPv4 address ranges. This also applies to accessing Key Vault from the Azure portal. Although users can browse to a key vault from the Azure portal, they might not be able to list keys, secrets, or certificates if their client machine is not in the allowed list. This also affects the Key Vault Picker by other Azure services. Users might be able to see list of key vaults, but not list keys, if firewall rules prevent their client machine.


> [!NOTE]
> Be aware of the following configuration limitations:
> * A maximum of 127 virtual network rules and 127 IPv4 rules are allowed. 
> * Small address ranges that use the "/31" or "/32" prefix sizes are not supported. Instead, configure these ranges by using individual IP address rules.
> * IP network rules are only allowed for public IP addresses. IP address ranges reserved for private networks (as defined in RFC 1918) are not allowed in IP rules. Private networks include addresses that start with **10.**, **172.16-31**, and **192.168.**. 
> * Only IPv4 addresses are supported at this time.

## Trusted services

Here's a list of trusted services that are allowed to access a key vault if the **Allow trusted services** option is enabled.

|Trusted service|Usage scenarios|
| --- | --- |
|Azure Virtual Machines deployment service|[Deploy certificates to VMs from customer-managed Key Vault](https://blogs.technet.microsoft.com/kv/2016/09/14/updated-deploy-certificates-to-vms-from-customer-managed-key-vault/).|
|Azure Resource Manager template deployment service|[Pass secure values during deployment](../azure-resource-manager/resource-manager-keyvault-parameter.md).|
|Azure Disk Encryption volume encryption service|Allow access to BitLocker Key (Windows VM) or DM Passphrase (Linux VM), and Key Encryption Key, during virtual machine deployment. This enables [Azure Disk Encryption](../security/azure-security-disk-encryption.md).|
|Azure Backup|Allow backup and restore of relevant keys and secrets during Azure Virtual Machines backup, by using [Azure Backup](../backup/backup-introduction-to-azure-backup.md).|
|Exchange Online & SharePoint Online|Allow access to customer key for Azure Storage Service Encryption with [Customer Key](https://support.office.com/article/Controlling-your-data-in-Office-365-using-Customer-Key-f2cd475a-e592-46cf-80a3-1bfb0fa17697).|
|Azure Information Protection|Allow access to tenant key for [Azure Information Protection.](https://docs.microsoft.com/azure/information-protection/what-is-information-protection)|
|Azure App Service|[Deploy Azure Web App Certificate through Key Vault](https://azure.github.io/AppService/2016/05/24/Deploying-Azure-Web-App-Certificate-through-Key-Vault.html).|
|Azure SQL Database|[Transparent Data Encryption with Bring Your Own Key support for Azure SQL Database and Data Warehouse](../sql-database/transparent-data-encryption-byok-azure-sql.md?view=sql-server-2017&viewFallbackFrom=azuresqldb-current).|
|Azure Storage|[Storage Service Encryption using customer-managed keys in Azure Key Vault](../storage/common/storage-service-encryption-customer-managed-keys.md).|
|Azure Data Lake Store|[Encryption of data in Azure Data Lake Store](../data-lake-store/data-lake-store-encryption.md) with a customer-managed key.|
|Azure databricks|[Fast, easy, and collaborative Apache Spark–based analytics service](../azure-databricks/what-is-azure-databricks.md)|
|Azure API Management|[Deploy certificates for Custom Domain from Key Vault using MSI](../api-management/api-management-howto-use-managed-service-identity.md#use-the-managed-service-identity-to-access-other-resources)|



> [!NOTE]
> You must set up the relevant Key Vault access policies to allow the corresponding services to get access to Key Vault.

## Next steps

* [Secure your key vault](key-vault-secure-your-key-vault.md)
* [Configure Azure Key Vault firewalls and virtual networks](key-vault-network-security.md)
