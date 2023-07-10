---
title: Azure Service Fabric container image management
description: How to use container image management in a service fabric cluster.
ms.topic: conceptual
ms.author: shkadam
author: shkadam
ms.service: service-fabric
services: service-fabric
ms.date: 06/22/2023
---

# Container Image Management 
When deploying Service Fabric containers, the activation path handles the downloading of the container images to the VM on which the container will be running. Once the containers have been removed from the cluster and their application types have been unregistered, there is a clean up cycle that deletes the container images. This clean up works only if the container image has been hard coded in the service manifest. For existing Service Fabric runtime versions, the configurations supporting the clean up of the container images are as follows - 

## Settings

 ```json
 "fabricSettings": [
                {
                    "name": "Hosting",
                    "parameters": [
                       {
                            "name": "PruneContainerImages", 
                            "value": "true"
                       },
                       {
                            "name": "CacheCleanupScanInterval",
                            "value": "3600"
                       }
                    ]
                }
            ]
 ```

|Setting |Description |
   | --- | --- |
   |PruneContainerImage |Setting to enable or disable pruning of container images when application type is unregistered. |
   |CacheCleanupScanInterval |Setting in seconds determining how often the clean up cycle runs.  |

## Container Image Management v2
Starting Service Fabric version 10.0 there is a newer version of the container image deletion flow. This flow cleans up container images irrespective of how the container images may have been defined - either hard coded or parameterized during application deployment. PruneContainerImages and ContainerImageDeletionEnabled configuration are mutually exclusive and cluster upgrade validation exists to ensure one or the other is switched on but not both. The configuration supporting this feature are as follows - 

### Settings

```json
 "fabricSettings": [
                {
                    "name": "Hosting",
                    "parameters": [
                       {
                            "name": "ContainerImageDeletionEnabled", 
                            "value": "true"
                       },
                       {
                            "name": "ContainerImageCleanupInterval",
                            "value": "3600"
                       },
                       {
                            "name": "ContainerImageTTL",
                            "value": "3600"
                       },
                       {
                            "name": "ContainerImageDeletionOnAppInstanceDeletionEnabled",
                            "value": "true"
                       },
                       {
                            "name": "ContainerImagesToSkip",
                            "value": "microsoft/windowsservercore|microsoft/nanoserver"
                       }
                    ]
                }
            ]
 ```

|Setting |Description |
   | --- | --- |
   |ContainerImageDeletionEnabled |Setting to enable or disable deletion of container images. |
   |ContainerImageCleanupInterval |Time interval for cleaning up unused container images.  |
   |ContainerImageTTL |Time to live for container images once they are eligible for removal (not referenced by containers on the VM and the application is deleted(if ContainerImageDeletionOnAppInstanceDeletionEnabled is enabled)).  |
   |ContainerImageDeletionOnAppInstanceDeletionEnabled |Setting to enable or disable deletion of expired ttl container images only after application has been deleted as well.  |
   |ContainerImagesToSkip |When set enables the container runtime to skip deleting images that match any of the set of regular expressions. Each expression must be separated by the \| character. Example: "mcr.microsoft.com/.+\|docker.io/library/alpine:latest" - this example matches everything prefixed with "mcr.microsoft.com/" and matches exactly "docker.io/library/alpine:latest". By default we do not delete the known Windows base images microsoft/windowsservercore or microsoft/nanoserver.  |

## Next steps
See the following article for related information:
* [Service Fabric and containers][containers-introduction-link]