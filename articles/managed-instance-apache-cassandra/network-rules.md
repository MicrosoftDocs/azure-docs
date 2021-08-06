---
title: Required outbound network rules for Azure Managed Instance for Apache Cassandra
description: Learn what are the required outbound network rules and FQDNs for Azure Managed Instance for Apache Cassandra
author: christopheranderson
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 05/21/2021
ms.author: chrande

---

# Required outbound network rules

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The Azure Managed Instance for Apache Casandra service requires certain network rules to properly manage the service. By ensuring you have the proper rules exposed, you can keep your service secure and prevent operational issues.

## Virtual network service tags

If you are using Azure Firewall to restrict outbound access, we highly recommend using [virtual network service tags](/azure/virtual-network/service-tags-overview). Below are the tags required to make Azure Managed Instance for Apache Cassandra function properly.

| Destination Service Tag                                                             | Protocol | Port    | Use  |
|----------------------------------------------------------------------------------|----------|---------|------|
| Storage | HTTPS | 443 | Required for secure communication between the nodes and Azure Storage for Control Plane communication and configuration.|
| AzureKeyVault | HTTPS | 443 | Required for secure communication between the nodes and Azure Key Vault. Certificates and keys are used to secure communication inside the cluster.|
| EventHub | HTTPS | 443 | Required to forward logs to Azure |
| AzureMonitor | HTTPS | 443 | Required to forward metrics to Azure |
| AzureActiveDirectory| HTTPS | 443 | Required for Azure Active Directory authentication.|
| GuestandHybridManagement | HTTPS | 443 |  Required to gather information about and manage Cassandra nodes (for example, reboot) |
| ApiManagement  | HTTPS | 443 | Required to gather information about and manage Cassandra nodes (for example, reboot) |
| `Storage.<Region>`  | HTTPS | 443 | Required for secure communication between the nodes and Azure Storage for Control Plane communication and configuration. **You need an entry for each region where you have deployed a datacenter.** |


## Azure Global required network rules

If you are not using Azure Firewall, the required network rules and IP address dependencies are:

| Destination Endpoint                                                             | Protocol | Port    | Use  |
|----------------------------------------------------------------------------------|----------|---------|------|
|snovap`<region>`.blob.core.windows.net:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) -  Azure Storage | HTTPS | 443 | Required for secure communication between the nodes and Azure Storage for Control Plane communication and configuration.|
|*.store.core.windows.net:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) -  Azure Storage | HTTPS | 443 | Required for secure communication between the nodes and Azure Storage for Control Plane communication and configuration.|
|*.blob.core.windows.net:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) -  Azure Storage | HTTPS | 443 | Required for secure communication between the nodes and Azure Storage to store backups. *Backup feature is being revised and storage name will follow a pattern by GA*|
|vmc-p-`<region>`.vault.azure.net:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - Azure KeyVault | HTTPS | 443 | Required for secure communication between the nodes and Azure Key Vault. Certificates and keys are used to secure communication inside the cluster.|
|management.azure.com:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - Azure Virtual Machine Scale Sets/Azure Management API | HTTPS | 443 | Required to gather information about and manage Cassandra nodes (for example, reboot)|
|*.servicebus.windows.net:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - Azure EventHub | HTTPS | 443 | Required to forward logs to Azure|
|jarvis-west.dc.ad.msft.net:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - Azure Monitor | HTTPS | 443 | Required to forward metrics Azure |
|login.microsoftonline.com:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - Azure AD | HTTPS | 443 | Required for Azure Active Directory authentication.|
| packages.microsoft.com | HTTPS | 443 | Required for updates to Azure security scanner definition and signatures |

## Managed Instance for Apache Cassandra internal port usage

The following ports are only accessible within the VNET (or peered vnets./express routes). Managed Instance for Apache Cassandra instances do not have a public IP and should not be made accessible on the Internet.

| Port | Use |
| ---- | --- |
| 8443 | Internal |
| 9443 | Internal |
| 7001 | Gossip - Used by Cassandra nodes to talk to each other |
| 9042 | Cassandra -Used by clients to connect to Cassandra |
| 7199 | Internal |



## Next steps

In this article, you learned about network rules to properly manage the service. Learn more about Azure Managed Instance for Apache Cassandra with the following articles:

* [Overview of Azure Managed Instance for Apache Cassandra](introduction.md)
* [Manage Azure Managed Instance for Apache Cassandra resources using Azure CLI](manage-resources-cli.md)
