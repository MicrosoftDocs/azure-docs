---
title: Deploy on dedicated host 
description: Use a dedicated host to achieve true host-level isolation for your Azure Container Instances workloads
ms.topic: how-to
ms.service: container-instances
services: container-instances
author: tomvcassidy
ms.author: tomcassidy
ms.date: 03/18/2022
---

# Deploy on dedicated hosts

"Dedicated" is an Azure Container Instances (ACI) sku that provides an isolated and dedicated compute environment for securely running containers. Using the dedicated sku results in each container group having a dedicated physical server in an Azure datacenter, ensuring full workload isolation to help meet your organization's security and compliance requirements. 

The dedicated sku is appropriate for container workloads that require workload isolation from a physical server perspective.

A dedicated host for Azure Container Instances provides [double encryption at rest](../virtual-machines/windows/disk-encryption.md#double-encryption-at-rest) for your container data when it is persisted by the service to the cloud. This encryption protects your data to help meet your organization's security and compliance requirements. ACI also gives you the option to [encrypt this data with your own key](container-instances-encrypt-data.md), giving you greater control over the data related to your ACI deployments.

## Prerequisites

> [!NOTE]
> Due to some current limitations, not all limit increase requests are guaranteed to be approved.

* The default limit for any subscription to use the dedicated sku is 0. If you would like to use this sku for your production container deployments, create an [Azure Support request][azure-support] to increase the limit.

## Use the dedicated sku

> [!IMPORTANT]
> Using the dedicated sku is only available in **API version 2019-12-01 or later**. Specify this API version or a more recent one in your deployment template.

Starting with API version 2019-12-01, there is a `sku` property under the container group properties section of a deployment template, which is required for an ACI deployment. Currently, you can use this property as part of an Azure Resource Manager deployment template for ACI. Learn more about deploying ACI resources with a template in the [Tutorial: Deploy a multi-container group using a Resource Manager template](./container-instances-multi-container-group.md). 

The `sku` property can have one of the following values:
* `Standard` - the standard ACI deployment choice, which still guarantees hypervisor-level security 
* `Dedicated` - used for workload level isolation with dedicated physical hosts for the container group

## Modify your JSON deployment template

In your deployment template, modify or add the following properties:
* Under `resources`, set `apiVersion` to `2019-12-01`.
* Under the container group properties, add a `sku` property with value `Dedicated`.

Here is an example snippet for the resources section of a container group deployment template that uses the dedicated sku:

```json
[...]
"resources": [
    {
        "name": "[parameters('containerGroupName')]",
        "type": "Microsoft.ContainerInstance/containerGroups",
        "apiVersion": "2019-12-01",
        "location": "[resourceGroup().location]",    
        "properties": {
            "sku": "Dedicated",
            "containers": {
                [...]
            }
        }
    }
]
```

Following is a complete template that deploys a sample container group running a single container instance:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "containerGroupName": {
        "type": "string",
        "defaultValue": "myContainerGroup",
        "metadata": {
          "description": "Container Group name."
        }
      }
    },
    "resources": [
        {
            "name": "[parameters('containerGroupName')]",
            "type": "Microsoft.ContainerInstance/containerGroups",
            "apiVersion": "2019-12-01",
            "location": "[resourceGroup().location]",
            "properties": {
                "sku": "Dedicated",
                "containers": [
                    {
                        "name": "container1",
                        "properties": {
                            "image": "nginx",
                            "command": [
                                "/bin/sh",
                                "-c",
                                "while true; do echo `date`; sleep 1000000; done"
                            ],
                            "ports": [
                                {
                                    "protocol": "TCP",
                                    "port": 80
                                }
                            ],
                            "environmentVariables": [],
                            "resources": {
                                "requests": {
                                    "memoryInGB": 1.0,
                                    "cpu": 1
                                }
                            }
                        }
                    }
                ],
                "restartPolicy": "Always",
                "ipAddress": {
                    "ports": [
                        {
                            "protocol": "TCP",
                            "port": 80
                        }
                    ],
                    "type": "Public"
                },
                "osType": "Linux"
            },
            "tags": {}
        }
    ]
}
```

## Deploy your container group

If you created and edited the deployment template file on your desktop, you can upload it to your Cloud Shell directory by dragging the file into it. 

Create a resource group with the [az group create][az-group-create] command.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Deploy the template with the [az deployment group create][az-deployment-group-create] command.

```azurecli-interactive
az deployment group create --resource-group myResourceGroup --template-file deployment-template.json
```

Within a few seconds, you should receive an initial response from Azure. A successful deployment takes place on a dedicated host.

<!-- LINKS - Internal -->
[az-group-create]: /cli/azure/group#az-group-create
[az-deployment-group-create]: /cli/azure/deployment/group#az-deployment-group-create

<!-- LINKS - External -->
[azure-support]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
