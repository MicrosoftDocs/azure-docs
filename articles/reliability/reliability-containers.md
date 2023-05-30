---
title: Reliability in Azure Container Instances
description: Find out about reliability in Azure Container Instances
author: anaharris-ms
ms.author: anaharris
ms.topic: overview
ms.custom: subject-reliability
ms.service: container-instances
ms.date: 11/29/2022
#Customer intent: I want to understand reliability support in Azure Container Instances so that I can respond to and/or avoid failures in order to minimize downtime and data loss.
---

# Reliability in Azure Container Instances

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the supplemental terms of use.

This article describes reliability support in Azure Container Instances (ACI) and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and information on Disaster Recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. Availability zones are designed to ensure high availability in the case of a local zone failure.  When one zone experiences a failure, the remaining two zones support all regional services, capacity, and high availability. Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Availability zone service and regional support](availability-zones-service-support.md).

There are three types of Azure services that support availability zones: zonal, zone-redundant, and always-available services. You can learn more about these types of services and how they promote resiliency in the [Azure services with availability zone support](availability-zones-service-support.md#azure-services-with-availability-zone-support).

Azure Container Instances supports *zonal* container group deployments, meaning the instance is pinned to a specific, self-selected availability zone. The availability zone is specified at the container group level. Containers within a container group can't have unique availability zones. To change your container group's availability zone, you must delete the container group and create another container group with the new availability zone.


### Prerequisites

> [!IMPORTANT]
> This feature is currently not available for Azure portal.

- Zonal container group deployments are supported in most regions where ACI is available for Linux and Windows Server 2019 container groups. For details, see [Regions and resource availability](../container-instances/container-instances-region-availability.md).

- Availability zone support is only available on ACI API version 09-01-2021 or later. 
- For Azure CLI, version 2.30.0 or later must be installed.
- For PowerShell, version 2.1.1-preview or later must be installed.
- For Java SDK, version 2.9.0 or later must be installed.


The following container groups *do not* support availability zones at this time:

 - Container groups with GPU resources 
 - Virtual Network injected container groups
 - Windows Server 2016 container groups

### Availability zone redeployment and migration

To change your container group's availability zone, you must delete the container group and create another container group with the new availability zone.


### Create a resource with availability zone enabled

To create a Container Instance resource with availability zone enabled, you'll need to deploy a container group using an Azure Resource Manager (ARM) template.

>[!NOTE]
>Examples in this article are formatted for the Bash shell. If you prefer another shell, adjust the line continuation characters accordingly.

**To deploy a container with ARM:**

1. Copy-paste the following JSON into a new file named `azuredeploy.json`. This example template deploys a container group with a single container into availability zone 1 in East US.

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "metadata": {
            "_generator": {
                "name": "bicep",
                "version": "0.4.1.14562",
                "templateHash": "12367894147709986470"
            }
        },
        "parameters": {
            "name": {
                "type": "string",
                "defaultValue": "acilinuxpublicipcontainergroup",
                "metadata": {
                    "description": "Name for the container group"
                }
            },
            "image": {
                "type": "string",
                "defaultValue": "mcr.microsoft.com/azuredocs/aci-helloworld",
                "metadata": {
                    "description": "Container image to deploy. Should be of the form repoName/imagename:tag for images stored in public Docker Hub, or a fully qualified URI for other registries. Images from private registries require additional registry credentials."
                }
            },
            "port": {
                "type": "int",
                "defaultValue": 80,
                "metadata": {
                    "description": "Port to open on the container and the public IP address."
                }
            },
            "cpuCores": {
                "type": "int",
                "defaultValue": 1,
                "metadata": {
                    "description": "The number of CPU cores to allocate to the container."
                }
            },
            "memoryInGb": {
                "type": "int",
                "defaultValue": 2,
                "metadata": {
                    "description": "The amount of memory to allocate to the container in gigabytes."
                }
            },
            "restartPolicy": {
                "type": "string",
                "defaultValue": "Always",
                "allowedValues": [
                    "Always",
                    "Never",
                    "OnFailure"
                ],
                "metadata": {
                    "description": "The behavior of Azure runtime if container has stopped."
                }
            },
            "location": {
                "type": "string",
                "defaultValue": "eastus",
                "metadata": {
                    "description": "Location for all resources."
                }
            }
        },
        "functions": [],
        "resources": [
            {
                "type": "Microsoft.ContainerInstance/containerGroups",
                "apiVersion": "2021-09-01",
                "zones": [
                    "1"
                ],
                "name": "[parameters('name')]",
                "location": "[parameters('location')]",
                "properties": {
                    "containers": [
                        {
                            "name": "[parameters('name')]",
                            "properties": {
                                "image": "[parameters('image')]",
                                "ports": [
                                    {
                                        "port": "[parameters('port')]",
                                        "protocol": "TCP"
                                    }
                                ],
                                "resources": {
                                    "requests": {
                                        "cpu": "[parameters('cpuCores')]",
                                        "memoryInGB": "[parameters('memoryInGb')]"
                                    }
                                }
                            }
                        }
                    ],
                    "osType": "Linux",
                    "restartPolicy": "[parameters('restartPolicy')]",
                    "ipAddress": {
                        "type": "Public",
                        "ports": [
                            {
                                "port": "[parameters('port')]",
                                "protocol": "TCP"
                            }
                        ]
                    }
                }
            }
        ],
        "outputs": {
            "containerIPv4Address": {
                "type": "string",
                "value": "[reference(resourceId('Microsoft.ContainerInstance/containerGroups', parameters('name'))).ipAddress.ip]"
            }
        }
    }
    ```

2. Create a resource group with the [az group create][availability-zones-group-create] command:

    ```azurecli
    az group create --name myResourceGroup --location eastus
    ```

3. Deploy the template with the [az deployment group create][az-deployment-group-create] command:

    ```azurecli
    az deployment group create \
      --resource-group myResourceGroup \
      --template-file azuredeploy.json
    ```
4. To verify the container group deployed successfully into an availability zone, view the container group details with the [az container show][az-container-show] command:
    
    ```azurecli
    az containershow --name acilinuxcontainergroup --resource-group myResourceGroup
    ```

### Zonal failover support

A container group of container instances is assigned to a single availability zone. As a result, that group of container instances won't be impacted by an outage that occurs in any other availability zone of the same region

If, however, an outage occurs in the availability zone of the container group, you can expect downtime for all the container instances within that group.

To avoid container instance downtime, we recommend that you create a minimum of two container groups across two different availability zones in a given region. This ensures that your container instance resources are up and running whenever any single zone in that region experiences outage.


## Disaster recovery

When an entire Azure region or datacenter experiences downtime, your mission-critical code needs to continue processing in a different region. Azure Container Instances deployed with zonal configuration run in a specific zone within a specific region. There's no built-in redundancy available. To avoid loss of execution during region wide outages, you can redundantly deploy the container instances in other regions.

## Next steps

> [!div class="nextstepaction"]
[Azure Architecture Center's guide on availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

> [!div class="nextstepaction"]
> [Reliability in Azure](./overview.md)