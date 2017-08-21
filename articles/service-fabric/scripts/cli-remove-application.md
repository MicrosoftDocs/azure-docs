---
title: Service Fabric CLI Script Sample - Remove application from a cluster
description: Service Fabric CLI Script Sample - Remove an application from a Service Fabric cluster.
services: service-fabric
documentationcenter: 
author: thraka
manager: timlt
editor: 
tags: azure-service-management

ms.assetid: 
ms.service: service-fabric
ms.workload: multiple
ms.devlang: na
ms.topic: article
ms.date: 07/21/2017
ms.author: adegeo
ms.custom: mvc
---

# Remove an application from a Service Fabric cluster

This sample script deletes a running Service Fabric application instance, unregisters an application type and version from the cluster.  Deleting the application instance also deletes all the running service instances associated with that application. Next, the application files are deleted from the image store. 

If needed, install the [Service Fabric CLI](../service-fabric-cli.md).

## Sample script

[!code-sh[main](../../../cli_scripts/service-fabric/remove-application/remove-application.sh "Remove an application from a cluster")]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [sfctl cluster select](/cli/azure/sf/cluster#select) | Selects the cluster to work with. |
| [sfctl application delete](/cli/azure/sf/application#delete) | Deletes the application instance from the cluster. |
| [sfctl application unprovision](/cli/azure/sf/application#unprovision) | Unregisters a Service Fabric application type and version from the cluster.|
| [sfctl application package-delete](/cli/azure/sf/application#package-delete) | Removes a Service Fabric application package from the image store. |

## Next steps

For more information, see the [Service Fabric CLI documentation](../service-fabric-cli.md.md).

Additional Service Fabric CLI samples for Azure Service Fabric can be found in the [Service Fabric CLI samples](../samples-cli.md).
