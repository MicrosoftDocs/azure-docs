---
title: Deploy on dedicated hosts 
description: Use dedicated hosts to achieve true host level isolation for your workloads
ms.topic: article
ms.date: 01/10/2020
ms.author: danlep
---

# Deploy on dedicated hosts

"Dedicated" is an Azure Container Instances (ACI) sku that provides an isolated and dedicated compute environment for securely running containers. Using the dedicated sku results in each container group having a dedicated physical server in an Azure datacenter, ensuring full workload isolation to help meet your organization's security and compliance requirements. 

The dedicated sku is appropriate for container workloads that require workload isolation from a physical server perspective.

## Using the dedicated sku

> [!IMPORTANT]
> Using the dedicated sku is only available in the latest API version (2019-12-01) that is currently rolling out. Specify this API version in your deployment template. Additionally, the default limit for any subscription to use the dedicated sku is 0. If you would like to use this sku for your production container deployments, please create an [Azure Support request][azure-support]

Starting with API version 2019-12-01, there is a "sku" property under the container group properties section of a deployment template,  which is required for an ACI deployment. Currently, you can use this property as part of an Azure Resource Manager deployment template for ACI. You can learn more about deploying ACI resources with a template in the [Tutorial: Deploy a multi-container group using a Resource Manager template](https://docs.microsoft.com/azure/container-instances/container-instances-multi-container-group). 

The sku property can have one of the following values:
* Standard - the standard ACI deployment choice, which still guarantees hypervisor-level security 
* Dedicated - used for workload level isolation with dedicated physical hosts for the container group

## Modify your JSON deployment template

In your deployment template, where the container group resource is specified, ensure that the `"apiVersion": "2019-12-01",`. In the properties section of the container group resource, set `"sku": "Dedicated",`.

Here is an example snippet for the resources section of a container group deployment template that uses the dedicated sku:

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
                "osType": "Linux",
            },
            "location": "eastus2euap",
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

Deploy the template with the [az group deployment create][az-group-deployment-create] command.

```azurecli-interactive
az group deployment create --resource-group myResourceGroup --template-file deployment-template.json
```

Within a few seconds, you should receive an initial response from Azure. Once the deployment completes, all data related to it persisted by the ACI service will be encrypted with the key you provided.

<!-- LINKS - Internal -->
[az-group-create]: /cli/azure/group#az-group-create
[az-group-deployment-create]: /cli/azure/group/deployment#az-group-deployment-create

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
