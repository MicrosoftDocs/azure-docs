---
title: Overview of Azure Firewall service tags
description: This article is an overview of the Azure Firewall service tags.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 2/25/2019
ms.author: victorh
---

# Azure Firewall service tags

A service tag represents a group of IP address prefixes to help minimize complexity for security rule creation. You cannot create your own service tag, nor specify which IP addresses are included within a tag. Microsoft manages the address prefixes encompassed by the service tag, and automatically updates the service tag as addresses change.

Azure Firewall service tags can be used in the network rules destination field. You can use them in place of specific IP addresses.

## Supported service tags

The following service tags are available for use in Azure firewall network rules:

* **AzureCloud** (Resource Manager only): This tag denotes the IP address space for Azure including all [datacenter public IP addresses](https://www.microsoft.com/download/details.aspx?id=41653). If you specify *AzureCloud* for the value, traffic is allowed or denied to Azure public IP addresses. If you only want to allow access to AzureCloud in a specific [region](https://azure.microsoft.com/regions), you can specify the region. For example, if you want to allow access only to Azure AzureCloud in the East US region, you could specify *AzureCloud.EastUS* as a service tag. 
* **AzureTrafficManager** (Resource Manager only): This tag denotes the IP address space for the Azure Traffic Manager probe IP addresses. More information on Traffic Manager probe IP addresses can be found in the [Azure Traffic Manager FAQ](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs). 
* **Storage** (Resource Manager only): This tag denotes the IP address space for the Azure Storage service. If you specify *Storage* for the value, traffic is allowed or denied to storage. If you only want to allow access to storage in a specific [region](https://azure.microsoft.com/regions), you can specify the region. For example, if you want to allow access only to Azure Storage in the East US region, you could specify *Storage.EastUS* as a service tag. The tag represents the service, but not specific instances of the service. For example, the tag represents the Azure Storage service, but not a specific Azure Storage account.
* **Sql** (Resource Manager only): This tag denotes the address prefixes of the Azure SQL Database and Azure SQL Data Warehouse services. If you specify *Sql* for the value, traffic is allowed or denied to Sql. If you only want to allow access to Sql in a specific [region](https://azure.microsoft.com/regions), you can specify the region. For example, if you want to allow access only to Azure SQL Database in the East US region, you could specify *Sql.EastUS* as a service tag. The tag represents the service, but not specific instances of the service. For example, the tag represents the Azure SQL Database service, but not a specific SQL database or server.
* **AzureCosmosDB** (Resource Manager only): This tag denotes the address prefixes of the Azure Cosmos Database service. If you specify *AzureCosmosDB* for the value, traffic is allowed or denied to AzureCosmosDB. If you only want to allow access to AzureCosmosDB in a specific [region](https://azure.microsoft.com/regions), you can specify the region using the format AzureCosmosDB.[region name].
* **AzureKeyVault** (Resource Manager only): This tag denotes the address prefixes of the Azure KeyVault service. If you specify *AzureKeyVault* for the value, traffic is allowed or denied to AzureKeyVault. If you only want to allow access to AzureKeyVault in a specific [region](https://azure.microsoft.com/regions), you can specify the region using the format AzureKeyVault.[region name].
* **EventHub** (Resource Manager only): This tag denotes the address prefixes of the Azure EventHub service. If you specify *EventHub* for the value, traffic is allowed or denied to EventHub. If you only want to allow access to EventHub in a specific [region](https://azure.microsoft.com/regions), you can specify the region using the format EventHub.[region name]. 
* **ServiceBus** (Resource Manager only): This tag denotes the address prefixes of the Azure ServiceBus service. If you specify *ServiceBus* for the value, traffic is allowed or denied to ServiceBus. If you only want to allow access to ServiceBus in a specific [region](https://azure.microsoft.com/regions), you can specify the region using the format ServiceBus.[region name].
* **MicrosoftContainerRegistry** (Resource Manager only): This tag denotes the address prefixes of the Microsoft Container Registry service. If you specify *MicrosoftContainerRegistry* for the value, traffic is allowed or denied to MicrosoftContainerRegistry. If you only want to allow access to MicrosoftContainerRegistry in a specific [region](https://azure.microsoft.com/regions), you can specify the region using the format MicrosoftContainerRegistry.[region name].
* **AzureContainerRegistry** (Resource Manager only): This tag denotes the address prefixes of the Azure Container Registry service. If you specify *AzureContainerRegistry* for the value, traffic is allowed or denied to AzureContainerRegistry. If you only want to allow access to AzureContainerRegistry in a specific [region](https://azure.microsoft.com/regions), you can specify the region using the format AzureContainerRegistry.[region name]. 
* **AppService** (Resource Manager only): This tag denotes the address prefixes of the Azure AppService service. If you specify *AppService* for the value, traffic is allowed or denied to AppService. If you only want to allow access to AppService in a specific [region](https://azure.microsoft.com/regions), you can specify the region using the format AppService.[region name]. 
* **AppServiceManagement** (Resource Manager only): This tag denotes the address prefixes of the Azure AppService Management service. If you specify *AppServiceManagement* for the value, traffic is allowed or denied to AppServiceManagement. 
* **ApiManagement** (Resource Manager only): This tag denotes the address prefixes of the Azure API Management service. If you specify *ApiManagement* for the value, traffic is allowed or denied to ApiManagement.  
* **AzureConnectors** (Resource Manager only): This tag denotes the address prefixes of the Azure Connectors service. If you specify *AzureConnectors* for the value, traffic is allowed or denied to AzureConnectors. If you only want to allow access to AzureConnectors in a specific [region](https://azure.microsoft.com/regions), you can specify the region using the format AzureConnectors.[region name].
* **AzureDataLake** (Resource Manager only): This tag denotes the address prefixes of the Azure Data Lake service. If you specify *AzureDataLake* for the value, traffic is allowed or denied to AzureDataLake.
* **AzureActiveDirectory** (Resource Manager only): This tag denotes the address prefixes of the AzureActiveDirectory service. If you specify *AzureActiveDirectory* for the value, traffic is allowed or denied to AzureActiveDirectory.
* **AzureMonitor** (Resource Manager only): This tag denotes the address prefixes of the AzureMonitor service. If you specify *AzureMonitor* for the value, traffic is allowed or denied to AzureMonitor.
* **ServiceFabric** (Resource Manager only): This tag denotes the address prefixes of the ServiceFabric service. If you specify *ServiceFabric* for the value, traffic is allowed or denied to ServiceFabric.
* **AzureMachineLearning** (Resource Manager only): This tag denotes the address prefixes of the AzureMachineLearning service. If you specify *AzureMachineLearning* for the value, traffic is allowed or denied to AzureMachineLearning.

## Next steps

To learn more about Azure Firewall rules, see [Azure Firewall rule processing logic](rule-processing.md).