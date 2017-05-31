---
title: Use Draft with Azure Container Service and Azure Container Registry | Microsoft Docs
description: Create an ACS Kubernetes cluster and an Azure Container Registry to create your first application in Azure with Draft.
services: container-service
documentationcenter: ''
author: squillace
manager: gamonroy
editor: ''
tags: draft, helm, acs, azure-container-service
keywords: Docker, Containers, microservices, Kubernetes, Draft, Azure


ms.service: container-service
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/31/2017
ms.author: rasquill


---

# Use Draft with Azure Container Service and Azure Container Registry to build and deploy an application to Kubernetes

[Draft](https://aka.ms/draft) is a new open-source tool that makes it easy to develop container-based applications and deploy them to Kubernetes clusters without knowing much about Docker and Kubernetes -- or even installing them. Using tools like Draft let you and your teams focus on building the application with Kubernetes, not paying as much attention to infrastructure.

You can use Draft with any Docker image registry and any Kubernetes cluster, including locally. This article shows how to:

- [Create an Azure Container Registry](#create-an-azure-container-registry)
- [Create a Azure Container Service running Kubernetes](#create-an-azure-container-service-with-kubernetes)
- [Install and configure Draft](#install-and-configure-draft)
- [Build and deploy an application](#build-and-deploy-an-application)

## Example of Draft workflow
The following video shows how easy it is to develop iteratively and still get live building and deployment with no interaction with Docker or Kubernetes:

![Draft animated gif](media/container-service-draft-up/draft.gif)

## Create an Azure Container Registry
You can easily create a new Azure Container Registry, but the steps are as follows:

1. Create a Azure resource group to managed your ACR registry and the Kubernetes cluster in ACS.
    ```azurecli
    az group create --name draft --location eastus
    ```
2. Create an ACR image registry using [az acr create](/cli/azure/acr#create)
    ```azurecli
    az acr create -g draft -n draftacs --sku Basic --admin-enabled true -l eastus
    ```

3. Create a Service Principal for your registry. When you create your registry, you are prompted to create a service principal to enable the automation of the registry. If you do not want to re-use an SP for this purpose, create a new one with [az ad sp create-for-rbac](/cli/azure/ad/sp#create-for-rbac):
    ```azurecli
    az ad sp create-for-rbac --scopes /subscriptions/<subscription guid>/resourcegroups/draft/providers/Microsoft.ContainerRegistry/registries/draftacs --role Owner --password "<created automatically if you do not>"
    ```

## Create an Azure Container Service with Kubernetes

Now you're ready to use [az acs create](/cli/azure/acs#create) to create an ACS cluster using Kubernetes as the `--orchestrator-type` value.

    ```azurecli
    az acs create --resource-group draft --name draft-kube-acs --dns-prefix draft-cluster --orchestrator-type kubernetes
    ```

    > [!NOTE]
    > Because Kubernetes is not the default orchestrator type, be sure you use the `--orchestrator-type kubernetes` switch.

The output when successful looks similar to the following.

```json
az acs create --resource-group draft --name draft-kube-acs --dns-prefix draft-cluster --orchestrator-type kubernetes
waiting for AAD role to propagate.done
{
  "id": "/subscriptions/<guid>/resourceGroups/draft/providers/Microsoft.Resources/deployments/azurecli14904.93snip09",
  "name": "azurecli1496227204.9323909",
  "properties": {
    "correlationId": "<guid>",
    "debugSetting": null,
    "dependencies": [],
    "mode": "Incremental",
    "outputs": null,
    "parameters": {
      "clientSecret": {
        "type": "SecureString"
      }
    },
    "parametersLink": null,
    "providers": [
      {
        "id": null,
        "namespace": "Microsoft.ContainerService",
        "registrationState": null,
        "resourceTypes": [
          {
            "aliases": null,
            "apiVersions": null,
            "locations": [
              "westus"
            ],
            "properties": null,
            "resourceType": "containerServices"
          }
        ]
      }
    ],
    "provisioningState": "Succeeded",
    "template": null,
    "templateLink": null,
    "timestamp": "2017-05-31T10:46:29.434095+00:00"
  },
  "resourceGroup": "draft"
}
```

> [!NOTE]
> Notice that the deployment id contains the service principal that created it. If you examine the name of the cluster, however, the name you specified is there:
>>
```azurecli
az acs list -o table
Location    Name                              ProvisioningState    ResourceGroup
----------  --------------------------------  -------------------  --------------------
westus      draft-kube-acs                    Succeeded            DRAFT
```
>>

## Install and configure draft
The installation instructions for Draft are in the Draft repository.

## Build and deploy an application
