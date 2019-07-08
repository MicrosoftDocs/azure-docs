---
title: Azure PowerShell Script Sample - Add application cert to a cluster| Microsoft Docs
description: Azure PowerShell Script Sample - Add an application certificate to a Service Fabric cluster.
services: service-fabric
documentationcenter: 
author: aljo-microsoft
manager: chackdan
editor: 
tags: azure-service-management

ms.assetid: 
ms.service: service-fabric
ms.workload: multiple
ms.devlang: na
ms.topic: sample
ms.date: 01/18/2018
ms.author: aljo
ms.custom: mvc
---

# Add an application certificate to a Service Fabric cluster

This sample script creates a self-signed certificate in the specified Azure key vault and installs it to all nodes of the Service Fabric cluster. The certificate also downloads to a local folder. The name of the downloaded certificate is the same as the name of the certificate in the key vault. Customize the parameters as needed.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/overview) and then run `Connect-AzAccount` to create a connection with Azure. 

## Sample script

[!code-powershell[main](../../../powershell_scripts/service-fabric/add-application-certificate/add-new-application-certificate.ps1 "Add an application certificate to a cluster")]

## Script explanation

This script uses the following commands: Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Add-AzServiceFabricApplicationCertificate](/powershell/module/az.servicefabric/Add-azServiceFabricApplicationCertificate) | Add a new application certificate to the virtual machine scale set that make up the cluster.  |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure Service Fabric can be found in the [Azure PowerShell samples](../service-fabric-powershell-samples.md).
