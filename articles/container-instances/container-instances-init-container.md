---
title: Run init containers
description: Run init containers in Azure Container Instances to perform setup tasks in a container group before the application containers run. 
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.date: 06/17/2022
---

# Run an init container for setup tasks in a container group

Azure Container Instances supports *init containers* in a container group. Init containers run to completion before the application container or containers start. Similar to [Kubernetes init containers](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/), use one or more init containers to perform initialization logic for your app containers, such as setting accounts, running setup scripts, or configuring databases.

This article shows how to use an Azure Resource Manager template to configure a container group with an init container.

## Things to know

* **API version** - You need at least Azure Container Instances API version 2019-12-01 to deploy init containers. Deploy using an `initContainers` property in a [YAML file](container-instances-multi-container-yaml.md) or a [Resource Manager template](container-instances-multi-container-group.md).
* **Order of execution** - Init containers are executed in the order specified in the template, and before other containers. By default, you can specify a maximum of 59 init containers per container group. At least one non-init container must be in the group.
* **Host environment** - Init containers run on the same hardware as the rest of the containers in the group.
* **Resources** - You don't specify resources for init containers. They are granted the total resources such as CPUs and memory available to the container group. While an init container runs, no other containers run in the group.
* **Supported properties** - Init containers can use some group properties such as volumes and secrets. However, they can't use ports, IP address and managed identities if configured for the container group. 
* **Restart policy** - Each init container must exit successfully before the next container in the group starts. If an init container doesn't exit successfully, its restart action depends on the [restart policy](container-instances-restart-policy.md) configured for the group:

    |Policy in group  |Policy in init  |
    |---------|---------|
    |Always     |OnFailure         |
    |OnFailure     |OnFailure         |
    |Never     |Never         |
* **Charges** - The container group incurs charges from the first deployment of an init container.

## Resource Manager template example

Start by copying the following JSON into a new file named `azuredeploy.json`. The  template sets up a container group with one init container and two application containers:

* The *init1* container runs the [busybox](https://hub.docker.com/_/busybox) image. It sleeps for 60 seconds and then writes a command-line string to a file in an [emptyDir volume](container-instances-volume-emptydir.md).
* Both application containers run the Microsoft `aci-wordcount` container image:
    * The *hamlet* container runs the wordcount app in its default configuration, counting word frequencies in Shakespeare's play *Hamlet*.
    * The *juliet* app container reads the command-line string from the emptDir volume to run the wordcount app instead on Shakespeare's *Romeo and Juliet*.

For more information and examples using the `aci-wordcount` image, see [Set environment variables in container instances](container-instances-environment-variables.md).

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
                "sku": "Standard",
                "initContainers": [
                {
                    "name": "init1",
                    "properties": {
                        "image": "mcr.microsoft.com/aks/e2e/library-busybox:master.210714.1",
                        "environmentVariables": [],
                        "volumeMounts": [
                            {
                                "name": "emptydir1",
                                "mountPath": "/mnt/emptydir"
                            }
                        ],
                         "command": [
                            "/bin/sh",
                            "-c",
                            "sleep 60; echo python wordcount.py http://shakespeare.mit.edu/romeo_juliet/full.html > /mnt/emptydir/command_line.txt"
                        ]
                    }
                }
            ], 
                "containers": [
                    {
                        "name": "hamlet",
                        "properties": {
                            "image": "mcr.microsoft.com/azuredocs/aci-wordcount",
                            "volumeMounts": [
                            {
                                "name": "emptydir1",
                                "mountPath": "/mnt/emptydir"
                            }
                        ],
                            "environmentVariables": [
                             {
                                "name": "NumWords",
                                "value": "3"
                             },
                             {  "name": "MinLength",
                                "value": "5"
                             }
                            ],
                            "resources": {
                                "requests": {
                                    "memoryInGB": 1.0,
                                    "cpu": 1
                                }
                            }
                        }
                    },
                    {
                        "name": "juliet",
                        "properties": {
                            "image": "mcr.microsoft.com/azuredocs/aci-wordcount",
                            "volumeMounts": [
                            {
                                "name": "emptydir1",
                                "mountPath": "/mnt/emptydir"
                            }
                            ],
                            "command": [
                                "/bin/sh",
                                "-c",
                                "$(cat /mnt/emptydir/command_line.txt)"
                            ],
                            "environmentVariables": [
                             {
                                "name": "NumWords",
                                "value": "3"
                             },
                             {  "name": "MinLength",
                                "value": "5"
                             }
                            ],
                            "resources": {
                                "requests": {
                                    "memoryInGB": 1.0,
                                    "cpu": 1
                                }
                            }
                        }
                    }
                ],
                "restartPolicy": "OnFailure",
                "osType": "Linux",
                "volumes": [
                    {
                        "name": "emptydir1",
                        "emptyDir": {}
                    }
                ]           
            },
            "tags": {}
        }
    ]
}
```

## Deploy the template

Create a resource group with the [az group create][az-group-create] command.

```azurecli
az group create --name myResourceGroup --location eastus
```

Deploy the template with the [az deployment group create][az-deployment-group-create] command.

```azurecli
az deployment group create \
  --resource-group myResourceGroup \
  --template-file azuredeploy.json
```

In a group with an init container, the deployment time is increased because of the time it takes for the init container or containers to complete.


## View container logs

To verify the init container ran successfully, view the log output of the app containers using the [az container logs][az-container-logs] command. The `--container-name` argument specifies the container from which to pull logs. In this example, pull the logs for the *hamlet* and *juliet* containers, which show different command output:

```azurecli
az container logs \
  --resource-group myResourceGroup \
  --name myContainerGroup \
  --container-name hamlet
```

Output:

```console
[('HAMLET', 386), ('HORATIO', 127), ('CLAUDIUS', 120)]
```

```azurecli
az container logs \
  --resource-group myResourceGroup \
  --name myContainerGroup \
  --container-name juliet
```

Output:

```console
[('ROMEO', 177), ('JULIET', 134), ('CAPULET', 119)]
```

## Next steps

Init containers help you perform setup and initialization tasks for your application containers. For more information about running task-based containers, see [Run containerized tasks with restart policies](container-instances-restart-policy.md).

Azure Container Instances provides other options to modify the behavior of application containers. Examples include:

* [Set environment variables in container instances](container-instances-environment-variables.md)
* [Set the command line in a container instance to override the default command line operation](container-instances-start-command.md)


[az-group-create]: /cli/azure/group#az_group_create
[az-deployment-group-create]: /cli/azure/deployment/group#az_deployment_group_create
[az-container-logs]: /cli/azure/container#az_container_logs
