---
title: Migrate Azure Container Instances to availability zone support 
description: Learn how to migrate Azure Container Instances to availability zone support.
author: anaharris-ms
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/22/2022
ms.author: anaharris
ms.reviewer: tomvcassidy
ms.custom: references_regions, subject-reliability
---

# Migrate Azure Container Instances to availability zone support
 
This guide describes how to migrate Azure Container Instances from non-availability zone support to availability support.  


## Prerequisites

* If using Azure CLI, ensure version 2.30.0 or later
* If using PowerShell, ensure version 2.1.1-preview or later
* If using the Java SDK, ensure version 2.9.0 or later
* ACI API version 09-01-2021
* Make sure the region you're migrating to supports zonal container group deployments. To view a list of supported regions, see [Resource availability for Azure Container Instances in Azure regions](../container-instances/container-instances-region-availability.md).

## Considerations

The following container groups don't support availability zones, and don't offer any  migration guidance:

- Container groups with GPU resources
- Virtual Network injected container groups
- Windows Server 2016 container groups

## Downtime requirements

Because ACI requires you to delete your existing deployment and recreate it with zonal support, the downtime is the time it takes to make a new deployment.

## Migration guidance: Delete and redeploy container group

To delete and redeploy a container group:

1. Delete your current container group with one of the following tools:

   - [Azure CLI](../container-instances/container-instances-quickstart.md#clean-up-resources)
   - [PowerShell](../container-instances/container-instances-quickstart.md#clean-up-resources), 
   - [Portal](../container-instances/container-instances-quickstart-portal.md#clean-up-resources).

    >[!NOTE]
    >Zonal support is not supported in the Azure portal. Even if you delete your container group through the portal, you'll still need to create your new container group using CLI or Powershell. 
    
1. Follow the steps in [Deploy an Azure Container Instances (ACI) container group in an availability zone (preview)](../container-instances/availability-zones.md).



## Next steps

> [!div class="nextstepaction"]
> [Azure services and regions that support availability zones](availability-zones-service-support.md)
