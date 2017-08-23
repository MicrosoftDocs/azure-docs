---
title: Azure CLI Script Sample - Deploy application to a cluster
description: Azure CLI Script Sample - Deploy an application to a Service Fabric cluster.
services: service-fabric
documentationcenter: 
author: Thraka
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

# Deploy an application to a Service Fabric cluster

This sample script copies an application package to a cluster image store, registers the application type in the cluster, and creates an application instance from the application type.  If any default services were defined in the application manifest of the target application type, then those services are created at this time.

If needed, install the [Azure CLI](../service-fabric-azure-cli-2-0.md).

## Sample script

[!code-sh[main](../../../cli_scripts/service-fabric/deploy-application/deploy-application.sh "Deploy an application to a cluster")]

## Clean up deployment 

After the script sample has been run, the script in [Remove an application](cli-remove-application.md) can be used to remove the application instance, unregister the application type, and delete the application package from the image store.

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.


| Command | Notes |
|---|---|
| [sf cluster select](/cli/azure/sf/cluster#select) | Selects the cluster to work with. |
| [sf application upload](/cli/azure/sf/application#upload) | Upload the app files and manifests. |
| [sf application provision](/cli/azure/sf/application#provision) | Register the application on the cluster.|
| [sf application create](/cli/azure/sf/application#create) | Create an instance of the application and deploy any defined services to the nodes. |

## Next steps

For more information, see the [Azure CLI documentation](../service-fabric-azure-cli-2-0.md).

Additional Azure CLI samples for Azure Service Fabric can be found in the [Azure CLI samples](../samples-cli.md).
