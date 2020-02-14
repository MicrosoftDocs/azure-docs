---
title: Update an application on a cluster in sfctl
description: Service Fabric CLI Script Sample - Update an application with a new version. This example also upgrades a deployed application with the new bits.
services: service-fabric
documentationcenter: 
author: athinanthny
manager: chackdan
editor: 
tags: 

ms.assetid: 
ms.service: service-fabric
ms.workload: multiple
ms.topic: sample
ms.date: 12/06/2017
ms.author: atsenthi
ms.custom: 
---

# Update an application using the Service Fabric CLI

This sample script uploads a new version of an existing application, and then upgrades a deployed application with the new bits.

[!INCLUDE [links to azure cli and service fabric cli](../../../includes/service-fabric-sfctl.md)]

## Sample script

[!code-sh[main](../../../cli_scripts/service-fabric/upgrade-application/upgrade-application.sh "Upload and update an application on a Service Fabric cluster")]

## Next steps

For more information, see the [Service Fabric CLI documentation](../service-fabric-cli.md).

Additional Service Fabric CLI samples for Azure Service Fabric can be found in the [Service Fabric CLI samples](../samples-cli.md).
