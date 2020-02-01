---
title: Azure Government Compute | Microsoft Docs
description: This provides a comparison of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: kydeeds
manager: zakramer---

ms.assetid: fb11f60c-5a70-46a9-82a0-abb2a4f4239b
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 3/27/2018
ms.author: kydeeds

---
# Azure Government Compute
## Virtual Machines
For details on this service and how to use it, see [Azure Virtual Machines Sizes](../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

### Variations
For available virtual machine sizes in Azure Government, see <a href="https://azure.microsoft.com/regions/services/">Products Available by Region</a>

### Data Considerations
The following information identifies the Azure Government boundary for Azure Virtual Machines:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| Data entered, stored, and processed within a VM can contain export-controlled data. Binaries running within Azure Virtual Machines. Static authenticators, such as passwords and smartcard PINs for access to Azure platform components. Private keys of certificates used to manage Azure platform components. SQL connection strings.  Other security information/secrets, such as certificates, encryption keys, master keys, and storage keys stored in Azure services. |Metadata is not permitted to contain export-controlled data. This metadata includes all configuration data entered when creating and maintaining your Azure Virtual Machine.  Do not enter Regulated/controlled data into the following fields:  Tenant role names, Resource groups, Deployment names, Resource names, Resource tags |

## Virtual Machine Scale Sets 
For details on this service and how to use it, see [Azure Virtual Machine Scale Sets documentation](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md). 

### Variations
The only variation is the [available sizes of Virtual Machines in Azure Government](https://azure.microsoft.com/regions/services/). 

## Batch 
For details on this service and how to use it, see [Azure Batch documentation](../batch/batch-technical-overview.md).

### Variations
The URLs for accessing and managing the Batch service are different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| Batch | *.batch.azure.com | *.batch.usgovcloudapi.net |

## Cloud Services
For details on this service and how to use it, see [Azure Cloud Services documentation](../cloud-services/cloud-services-choose-me.md).

### Variations
The DNS for the Cloud Services is different: 

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| Cloud Services | *.cloudapp.net | *.usgovcloudapp.net |

## Azure Functions
The [Azure Functions](https://docs.microsoft.com/azure/azure-functions/) service is now available (General Availability) for the Azure Government environment, with some differences, which you can read about below. 

### Variations
The following Functions features are not currently available in Azure Government:

- The [App Service plan](../azure-functions/functions-scale.md#app-service-plan) is available in Azure Government. The Consumption plan is available in USGov Virginia region. To learn more about the two hosting plans, click [here](../azure-functions/functions-scale.md)
- [Monitoring via Application Insights](../azure-functions/functions-monitoring.md) is not available yet.

The URLs for Function are different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| Functions | .azurewebsites.net | .azurewebsites.us|	

## Service Fabric
For details on this service and how to use it, see [Azure Service Fabric documentation](../service-fabric/service-fabric-overview.md).

## Next Steps
For supplemental information and updates, subscribe to the [Microsoft Azure Government Blog](https://blogs.msdn.microsoft.com/azuregov/).

