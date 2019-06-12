---
title: Azure Service Fabric CLI (sfctl) Script Remove Sample
description: Remove an application from an Azure Service Fabric cluster using the Azure Service Fabric CLI
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
ms.date: 12/06/2017
ms.author: aljo
ms.custom: mvc
---

# Remove an application from a Service Fabric cluster

This sample script deletes a running Service Fabric application instance, then unregisters an application type and version from the cluster.  Deleting the application instance also deletes all the running service instances associated with that application. Next, the application files are deleted from the image store. 

If needed, install the [Service Fabric CLI](../service-fabric-cli.md).

## Sample script

[!code-sh[main](../../../cli_scripts/service-fabric/remove-application/remove-application.sh "Remove an application from a cluster")]

## Next steps

For more information, see the [Service Fabric CLI documentation](../service-fabric-cli.md).

Additional Service Fabric CLI samples for Azure Service Fabric can be found in the [Service Fabric CLI samples](../samples-cli.md).
