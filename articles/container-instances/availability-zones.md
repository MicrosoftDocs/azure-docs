---
title: Deploy a zonal container group in Azure Container Instances (ACI)
description: Learn how to deploy a container group in an availability zone.
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.topic: how-to
ms.date: 06/17/2022
ms.custom: devx-track-arm-template
---

# Deploy an Azure Container Instances (ACI) container group in an availability zone (preview)

An [availability zone][availability-zone-overview] is a physically separate zone in an Azure region. You can use availability zones to protect your containerized applications from an unlikely failure or loss of an entire data center. Three types of Azure services support availability zones: *zonal*, *zone-redundant*, and *always-available* services. You can learn more about these types of services and how they promote resiliency in the [Highly available services section of Azure services that support availability zones](../availability-zones/az-region.md#highly-available-services).

Azure Container Instances (ACI) supports *zonal* container group deployments, meaning the instance is pinned to a specific, self-selected availability zone. The availability zone is specified at the container group level. Containers within a container group can't have unique availability zones. To change your container group's availability zone, you must delete the container group and create another container group with the new availability zone.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the supplemental terms of use.

> [!IMPORTANT]
> Zonal container group deployments are supported in most regions where ACI is available for Linux and Windows Server 2019 container groups. For details, see [Regions and resource availability][container-regions].

> [!NOTE]
> Examples in this article are formatted for the Bash shell. If you prefer another shell, adjust the line continuation characters accordingly.

## Limitations

> [!IMPORTANT]
> This feature is currently not available for Azure portal.

* Container groups with GPU resources don't support availability zones at this time.
* Virtual Network injected container groups don't support availability zones at this time.
* Windows Server 2016 container groups don't support availability zones at this time.

### Version requirements

* If using Azure CLI, ensure version `2.30.0` or later is installed.
* If using PowerShell, ensure version `2.1.1-preview` or later is installed.
* If using the Java SDK, ensure version `2.9.0` or later is installed.
* Availability zone support is only available on ACI API version `09-01-2021` or later.

## Deploy a container group using an Azure Resource Manager (ARM) template

### Create the ARM template

Start by copying the following JSON into a new file named `azuredeploy.json`. This example template deploys a container group with a single container into availability zone 1 in East US.

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

### Deploy the ARM template

Create a resource group with the [az group create][az-group-create] command:

```azurecli
az group create --name myResourceGroup --location eastus
```

Deploy the template with the [az deployment group create][az-deployment-group-create] command:

```azurecli
az deployment group create \
  --resource-group myResourceGroup \
  --template-file azuredeploy.json
```

## Get container group details

To verify the container group deployed successfully into an availability zone, view the container group details with the [az container show][az-container-show] command:

```azurecli
az container show --name acilinuxcontainergroup --resource-group myResourceGroup
```

## Next steps

Learn about building fault-tolerant applications using zonal container groups from the [Azure Architecture Center's guide on availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container#az_container_create
[container-regions]: container-instances-region-availability.md
[az-container-show]: /cli/azure/container#az_container_show
[az-group-create]: /cli/azure/group#az_group_create
[az-deployment-group-create]: /cli/azure/deployment#az_deployment_group_create
[availability-zone-overview]: ../availability-zones/az-overview.md
