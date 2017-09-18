---
title: Azure Service Fabric CLI Script Deploy Sample
description: Create a secure Service Fabric Linux cluster in using the Azure Service Fabric CLI.
services: service-fabric
documentationcenter: 
author: rwike77
manager: timlt
editor: 
tags: azure-service-management

ms.assetid: 
ms.service: service-fabric
ms.workload: multiple
ms.devlang: na
ms.topic: sample
ms.date: 09/18/2017
ms.author: ryanwi
ms.custom: mvc
---

# Create a secure Service Fabric Linux cluster in Azure

This sample script copies an application package to a cluster image store, registers the application type in the cluster, and creates an application instance from the application type. Any default services are also created at this time.

If needed, install the [Service Fabric CLI](../service-fabric-cli.md).

## Sample script

[!code-sh[main](../../../cli_scripts/service-fabric/deploy-application/create-cluster.sh "Deploy an application to a cluster")]

## Clean up deployment

When done, the [remove](cli-remove-application.md) script can be used to remove the application. The remove script
deletes the application instance, unregisters the application type, and deletes the application package from the
image store.

## Next steps

For more information, see the [Service Fabric CLI documentation](../service-fabric-cli.md).

Additional Service Fabric CLI samples for Azure Service Fabric can be found in the [Service Fabric CLI samples](../samples-cli.md).
