---
title: Reliability in Azure Container Instances
description: Find out about reliability in Azure Container Instances
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-container-instances
ms.date: 07/28/2025
#Customer intent: I want to understand reliability support in Azure Container Instances so that I can respond to and/or avoid failures in order to minimize downtime and data loss.
---

# Reliability in Azure Container Instances

Azure Container Instances offers the fastest and simplest way to run Linux or Windows containers in Azure, without having to manage any virtual machines and without having to adopt a more complex higher-level service. You can learn more about Container Instances on its [overview page](/azure/container-instances/container-instances-overview).

This article describes reliability support in Container Instances, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Reliability architecture overview

When you use Container Instances, you deploy a *container group*, which contains one or more *containers*. Each container is created from a *container image*, which is stored in a registry like Azure Container Registry.

All of the containers in a container group are deployed together as a single logical unit, and share the same physical infrastructure.

The following diagram shows the relationship between container groups, containers, and images:

:::image type="content" source="./media/reliability-containers/container-groups-containers.png" alt-text="Diagram that shows a container group with two containers, each using a separate image in a registry." border="false":::

Additionally, Container Instances provides the following abstractions that manage container groups for you:

- **[NGroups](/azure/container-instances/container-instance-ngroups/container-instances-about-ngroups) (preview)**, which provide a set of capabilities to manage multiple related container groups. When you create an NGroup, you define the number of container groups to create. Container Instances provides capabilities like automated upgrade rollouts and spreading container groups across availablity zones.

- **[Standby pools](/azure/container-instances/container-instances-standby-pool-overview)**, which create a pool of pre-provisioned container groups that can be used in response to incoming traffic. 

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

To minimize issues caused by transient faults, we recommend you follow the [deployment best practices](/azure/container-instances/container-instances-best-practices-and-considerations#best-practices). <!-- TODO check -->

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

An individual container group is a *zonal* resource, which means it can be deployed into a single availability zone that you select. All of the containers within the group are deployed into the same availability zone. If that availability zone has a problem, the container group and all of its containers might experience downtime.

:::image type="content" source="./media/reliability-containers/container-groups-containers-zonal.png" alt-text="Diagram that shows a container group with two containers deployed into a single availability zone." border="false":::

When you deploy an NGroup, you can specify one or more zones to deploy it to. If you deploy it to two or more zones, it's a *zone-redundant* NGroup, and an outage of one availability zone only causes problems for the container groups within the affected zone.

:::image type="content" source="./media/reliability-containers/ngroup-zone-redundant.png" alt-text="Diagram that shows an NGroup with three container groups, deployed into three availability zones." border="false":::

Similarly, when you deploy a standby group, you can specify one or more zones to deploy it to, and can make it zone-redundant by selecting multiple zones.

### Prerequisites

- Zonal container group deployments are supported in most regions where ACI is available for Linux and Windows Server 2019 container groups. For details, see [Regions and resource availability](/azure/container-instances/container-instances-region-availability).

* If using Azure CLI, ensure version `2.30.0` or later is installed.
* If using PowerShell, ensure version `2.1.1-preview` or later is installed.
* If using the Java SDK, ensure version `2.9.0` or later is installed.
* Availability zone support is only available on ACI API version `09-01-2021` or later.
* Zonal container group deployments require the Standard SKU. They don't support the Confidential SKU.

> [!IMPORTANT]
> Not all features are supported in zonal deployments. For example, Confidential Compute isn't supported, and GPU resource support is zone-dependent, based on hardware availability in specific zones.

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

2. Create a resource group with the [az group create][az-group-create] command:

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
    az container show --name acilinuxpublicipcontainergroup --resource-group myResourceGroup
    ```

### Zonal failover support

A container group of container instances is assigned to a single availability zone. As a result, that group of container instances won't be impacted by an outage that occurs in any other availability zone of the same region

If, however, an outage occurs in the availability zone of the container group, you can expect downtime for all the container instances within that group.

To avoid container instance downtime, we recommend that you create a minimum of two container groups across two different availability zones in a given region. This ensures that your container instance resources are up and running whenever any single zone in that region experiences outage.

We recommend you use [Azure Monitor](/azure/container-instances/monitor-azure-container-instances), regional status pages, and custom health checks to guide your failover decisions.

## NGroups

[NGroups](/azure/container-instances/container-instance-ngroups/container-instances-about-ngroups) provide advanced capabilities for managing multiple related container groups, which can be used across availability zones.

NGroups offer zone-redundant deployment support.

## Standby pools

[Standby pools for Azure Container Instances](/azure/container-instances/container-instances-standby-pool-overview) enable you to create a pool of pre-provisioned container groups that can be used in response to incoming traffic. The container groups in the pool are fully provisioned, initialized, and ready to receive work.

Standby pools support creating and requesting containers across multiple availability zones. However, standby pool don't support zone-redundancy.

## Multi-region support

Azure Container Instances is a single-region service. If the region is unavailable, your container instance is also unavailable.

## Disaster recovery

When an entire Azure region or datacenter experiences downtime, your mission-critical code needs to continue processing in a different region. Azure Container Instances deployed with zonal configuration run in a specific zone within a specific region. There's no built-in redundancy available. To avoid loss of execution during region wide outages, you can redundantly deploy the container instances in other regions.

## Service-level agreement (SLA)

The service-level agreement (SLA) for Azure Container Instances describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. For more information, see the [service-level agreement](https://www.azure.cn/support/sla/container-instances/v1_0/index.html).

## Next steps

- [Azure Architecture Center's guide on availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).
- [Reliability in Azure](./overview.md)


<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container#az_container_create
[container-regions]: ../container-instances-region-availability.md
[az-container-show]: /cli/azure/container#az_container_show
[az-group-create]: /cli/azure/group#az_group_create
[az-deployment-group-create]: /cli/azure/deployment#az_deployment_group_create
[availability-zone-overview]: ./availability-zones-overview.md
