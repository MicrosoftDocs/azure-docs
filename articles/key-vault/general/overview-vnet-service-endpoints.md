---
title: Virtual network service endpoints for Azure Key Vault
description: Learn how virtual network service endpoints for Azure Key Vault allow you to restrict access to a specified virtual network, including usage scenarios.
services: key-vault
author: amitbapat
ms.author: ambapat
ms.date: 01/02/2019
ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
---
# Virtual network service endpoints for Azure Key Vault

The virtual network service endpoints for Azure Key Vault allow you to restrict access to a specified virtual network. The endpoints also allow you to restrict access to a list of IPv4 (internet protocol version 4) address ranges. Any user connecting to your key vault from outside those sources is denied access.

There is one important exception to this restriction. If a user has opted-in to allow trusted Microsoft services, connections from those services are let through the firewall. For example, these services include Office 365 Exchange Online, Office 365 SharePoint Online, Azure compute, Azure Resource Manager, and Azure Backup. Such users still need to present a valid Azure Active Directory token, and must have permissions (configured as access policies) to perform the requested operation. For more information, see [Virtual network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).

## Usage scenarios

You can configure [Key Vault firewalls and virtual networks](network-security.md) to deny access to traffic from all networks (including internet traffic) by default. You can grant access to traffic from specific Azure virtual networks and public internet IP address ranges, allowing you to build a secure network boundary for your applications.

> [!NOTE]
> Key Vault firewalls and virtual network rules only apply to the [data plane](security-features.md#privileged-access) of Key Vault. Key Vault control plane operations (such as create, delete, and modify operations, setting access policies, setting firewalls, and virtual network rules and deployment of secrets or keys through ARM templates) are not affected by firewalls and virtual network rules.

Here are some examples of how you might use service endpoints:

* You are using Key Vault to store encryption keys, application secrets, and certificates, and you want to block access to your key vault from the public internet.
* You want to lock down access to your key vault so that only your application, or a short list of designated hosts, can connect to your key vault.
* You have an application running in your Azure virtual network, and this virtual network is locked down for all inbound and outbound traffic. Your application still needs to connect to Key Vault to fetch secrets or certificates, or use cryptographic keys.

## Trusted services

Here's a list of trusted services that are allowed to access a key vault if the **Allow trusted services** option is enabled.

|Trusted service|Supported usage scenarios|
| --- | --- |
|Azure Virtual Machines deployment service|[Deploy certificates to VMs from customer-managed Key Vault](/archive/blogs/kv/updated-deploy-certificates-to-vms-from-customer-managed-key-vault).|
|Azure Resource Manager template deployment service|[Pass secure values during deployment](../../azure-resource-manager/templates/key-vault-parameter.md).|
|Azure Disk Encryption volume encryption service|Allow access to BitLocker Key (Windows VM) or DM Passphrase (Linux VM), and Key Encryption Key, during virtual machine deployment. This enables [Azure Disk Encryption](../../security/fundamentals/encryption-overview.md).|
|Azure Backup|Allow backup and restore of relevant keys and secrets during Azure Virtual Machines backup, by using [Azure Backup](../../backup/backup-overview.md).|
|Exchange Online & SharePoint Online|Allow access to customer key for Azure Storage Service Encryption with [Customer Key](/microsoft-365/compliance/customer-key-overview).|
|Azure Information Protection|Allow access to tenant key for [Azure Information Protection.](/azure/information-protection/what-is-information-protection)|
|Azure App Service|[Deploy Azure Web App Certificate through Key Vault](https://azure.github.io/AppService/2016/05/24/Deploying-Azure-Web-App-Certificate-through-Key-Vault.html).|
|Azure SQL Database|[Transparent Data Encryption with Bring Your Own Key support for Azure SQL Database and Azure Synapse Analytics](../../azure-sql/database/transparent-data-encryption-byok-overview.md).|
|Azure Storage|[Storage Service Encryption using customer-managed keys in Azure Key Vault](../../storage/common/customer-managed-keys-configure-key-vault.md).|
|Azure Data Lake Store|[Encryption of data in Azure Data Lake Store](../../data-lake-store/data-lake-store-encryption.md) with a customer-managed key.|
|Azure Synapse Analytics|[Encryption of data using customer-managed keys in Azure Key Vault](../../synapse-analytics/security/workspaces-encryption.md)|
|Azure Databricks|[Fast, easy, and collaborative Apache Spark–based analytics service](/azure/databricks/scenarios/what-is-azure-databricks)|
|Azure API Management|[Deploy certificates for Custom Domain from Key Vault using MSI](../../api-management/api-management-howto-use-managed-service-identity.md#use-ssl-tls-certificate-from-azure-key-vault)|
|Azure Data Factory|[Fetch data store credentials in Key Vault from Data Factory](https://go.microsoft.com/fwlink/?linkid=2109491)|
|Azure Event Hubs|[Allow access to a key vault for customer-managed keys scenario](../../event-hubs/configure-customer-managed-key.md)|
|Azure Service Bus|[Allow access to a key vault for customer-managed keys scenario](../../service-bus-messaging/configure-customer-managed-key.md)|
|Azure Import/Export| [Use customer-managed keys in Azure Key Vault for Import/Export service](../../import-export/storage-import-export-encryption-key-portal.md)
|Azure Container Registry|[Registry encryption using customer-managed keys](../../container-registry/container-registry-customer-managed-keys.md)
|Azure Application Gateway |[Using Key Vault certificates for HTTPS-enabled listeners](../../application-gateway/key-vault-certs.md)

> [!NOTE]
> You must set up the relevant Key Vault access policies to allow the corresponding services to get access to Key Vault.

## Next steps

- For step-by-step instructions, see [Configure Azure Key Vault firewalls and virtual networks](network-security.md)
- see the [Azure Key Vault security overview](security-features.md)
