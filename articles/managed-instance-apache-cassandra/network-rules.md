---
title: Required outbound network rules for Azure Managed Instance for Apache Cassandra
description: Learn what are the required outbound network rules and FQDNs for Azure Managed Instance for Apache Cassandra
author: rothja
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 11/02/2021
ms.author: jroth
ms.custom: ignite-fall-2021
---

# Required outbound network rules

The Azure SQL Managed Instance for Apache Casandra service requires certain network rules to properly manage the service. By ensuring you have the proper rules exposed, you can keep your service secure and prevent operational issues.

> [!WARNING]
> We recommend exercising caution when applying changes to firewall rules for an existing cluster. For example, if rules are not applied correctly, they might not be applied to existing connections, so it may appear that firewall changes have not caused any problems. However, automatic updates of the Cassandra Managed Instance nodes may subsequently fail. We recommend monitoring connectivity after any major firewall updates for some time to ensure there are no issues.

## Virtual network service tags

If you're using Azure Firewall to restrict outbound access, we highly recommend using [virtual network service tags](../virtual-network/service-tags-overview.md). Below are the tags required to make Azure SQL Managed Instance for Apache Cassandra function properly.

| Destination Service Tag                                                             | Protocol | Port    | Use  |
|----------------------------------------------------------------------------------|----------|---------|------|
| Storage | HTTPS | 443 | Required for secure communication between the nodes and Azure Storage for Control Plane communication and configuration.|
| AzureKeyVault | HTTPS | 443 | Required for secure communication between the nodes and Azure Key Vault. Certificates and keys are used to secure communication inside the cluster.|
| EventHub | HTTPS | 443 | Required to forward logs to Azure |
| AzureMonitor | HTTPS | 443 | Required to forward metrics to Azure |
| AzureActiveDirectory| HTTPS | 443 | Required for Microsoft Entra authentication.|
| AzureResourceManager| HTTPS | 443 | Required to gather information about and manage Cassandra nodes (for example, reboot)|
| AzureFrontDoor.Firstparty| HTTPS | 443 | Required for logging operations.|
| GuestAndHybridManagement | HTTPS | 443 |  Required to gather information about and manage Cassandra nodes (for example, reboot) |
| ApiManagement  | HTTPS | 443 | Required to gather information about and manage Cassandra nodes (for example, reboot) |

> [!NOTE]
> In addition to the above, you will also need to add the following address prefixes, as a service tag does not exist for the relevant service:
> 104.40.0.0/13
> 13.104.0.0/14
> 40.64.0.0/10

## User-defined routes

If you're using a third-party Firewall to restrict outbound access, we highly recommend configuring [user-defined routes (UDRs)](../virtual-network/virtual-networks-udr-overview.md#user-defined) for Microsoft address prefixes, rather than attempting to allow connectivity through your own Firewall. See sample [bash script](https://github.com/Azure-Samples/cassandra-managed-instance-tools/blob/main/configureUDR.sh) to add the required address prefixes in user-defined routes.

## Azure Global required network rules

The required network rules and IP address dependencies are:

| Destination Endpoint                                                             | Protocol | Port    | Use  |
|----------------------------------------------------------------------------------|----------|---------|------|
|snovap\<region\>.blob.core.windows.net:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) -  Azure Storage | HTTPS | 443 | Required for secure communication between the nodes and Azure Storage for Control Plane communication and configuration.|
|\*.store.core.windows.net:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) -  Azure Storage | HTTPS | 443 | Required for secure communication between the nodes and Azure Storage for Control Plane communication and configuration.|
|\*.blob.core.windows.net:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) -  Azure Storage | HTTPS | 443 | Required for secure communication between the nodes and Azure Storage to store backups. *Backup feature is being revised and storage name will follow a pattern by GA*|
|vmc-p-\<region\>.vault.azure.net:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - Azure KeyVault | HTTPS | 443 | Required for secure communication between the nodes and Azure Key Vault. Certificates and keys are used to secure communication inside the cluster.|
|management.azure.com:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - Azure Virtual Machine Scale Sets/Azure Management API | HTTPS | 443 | Required to gather information about and manage Cassandra nodes (for example, reboot)|
|\*.servicebus.windows.net:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - Azure EventHub | HTTPS | 443 | Required to forward logs to Azure|
|jarvis-west.dc.ad.msft.net:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - Azure Monitor | HTTPS | 443 | Required to forward metrics Azure |
|login.microsoftonline.com:443</br> Or</br> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - Microsoft Entra ID | HTTPS | 443 | Required for Microsoft Entra authentication.|
| packages.microsoft.com | HTTPS | 443 | Required for updates to Azure security scanner definition and signatures |
| azure.microsoft.com | HTTPS | 443 | Required to get information about virtual machine scale sets |
| \<region\>-dsms.dsms.core.windows.net | HTTPS | 443 | Certificate for logging |
| gcs.prod.monitoring.core.windows.net | HTTPS | 443 | Logging endpoint needed for logging |
| global.prod.microsoftmetrics.com | HTTPS | 443 | Needed for metrics |
| shavsalinuxscanpkg.blob.core.windows.net | HTTPS | 443 | Needed to download/update security scanner |
| crl.microsoft.com | HTTPS | 443 | Needed to access public Microsoft certificates |
| global-dsms.dsms.core.windows.net | HTTPS | 443 | Needed to access public Microsoft certificates |

### DNS access

The system uses DNS names to reach the Azure services described in this article so that it can use load balancers. Therefore, the virtual network must run a DNS server that can resolve those addresses. The virtual machines in the virtual network honor the name server that is communicated through the DHCP protocol. In most cases, Azure automatically sets up a DNS server for the virtual network. If this doesn't occur in your scenario, the DNS names that are described in this article are a good guide to get started.

## Internal port usage

The following ports are only accessible within the VNET (or peered vnets./express routes). SQL Managed Instance for Apache Cassandra instances do not have a public IP and should not be made accessible on the Internet.

| Port | Use |
| ---- | --- |
| 8443 | Internal |
| 9443 | Internal |
| 7001 | Gossip - Used by Cassandra nodes to talk to each other |
| 9042 | Cassandra -Used by clients to connect to Cassandra |
| 7199 | Internal |

## Next steps

In this article, you learned about network rules to properly manage the service. Learn more about Azure SQL Managed Instance for Apache Cassandra with the following articles:

* [Overview of Azure SQL Managed Instance for Apache Cassandra](introduction.md)
* [Manage Azure SQL Managed Instance for Apache Cassandra resources using Azure CLI](manage-resources-cli.md)
