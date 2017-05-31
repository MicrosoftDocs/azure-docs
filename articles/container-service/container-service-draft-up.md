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
- [Wire up a deployment domain](#wire-up-deployment-domain)
- [Build and deploy an application](#build-and-deploy-an-application)

## Example of Draft workflow
The following video shows how easy it is to develop iteratively and still get live building and deployment with no interaction with Docker or Kubernetes:

![Draft animated gif](media/container-service-draft-up/draft.gif)

## Create an Azure Container Registry
You can easily [create a new Azure Container Registry](../container-registry/container-registry-get-started-azure-cli.md), but the steps are as follows:

1. Create a Azure resource group to managed your ACR registry and the Kubernetes cluster in ACS.
    ```azurecli
    az group create --name draft --location eastus
    ```
2. Create an ACR image registry using [az acr create](/cli/azure/acr#create)
    ```azurecli
    az acr create -g draft -n draftacs --sku Basic --admin-enabled true -l eastus
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
The installation instructions for Draft are in the [Draft repository](https://github.com/Azure/draft/blob/master/docs/install.md). They are relatively simple, but do require some configuration, as it depends on [Helm](https://aka.ms/helm) to create and deploy a Helm chart into the Kubernetes cluster.
1. [Download and install Helm](https://aka.ms/helm#install).
2. Use Helm to search for an install `stable/traefik`, and ingress controller to enable inbound requests for your builds.
    ```bash
    $ helm search traefik
    NAME          	VERSION	DESCRIPTION
    stable/traefik	1.2.1-a	A Traefik based Kubernetes ingress controller w...

    $ helm install stable/traefik --name ingress
    ```
    Now set a watch on the the `ingress` controller to capture the external IP value when it is deployed. This IP address will be the one [mapped to your deployment domain](#wire-up-deployment-domain) in the next section.

    ```bash
    kubectl get svc -w
    NAME                          CLUSTER-IP     EXTERNAL-IP     PORT(S)                      AGE
    ingress-traefik               10.0.248.104   13.64.108.240   80:31046/TCP,443:32556/TCP   1h
    kubernetes                    10.0.0.1       <none>          443/TCP                      7h
    ```

    In this case, the external IP for the deployment domain is `13.64.108.240`. Now you can map your domain to that IP.

## Wire up deployment domain

Draft will create a new deployment for each Helm chart it creates -- each application. Each one gets a generated name that is used by draft as a _subdomain_ on top of the root _deployment domain_ that you control. To do this, you must create an A record in your DNS entries for your deployment domain, so that each generated subdomain is routed to the Kubernetes cluster's ingress controller.

Your own domain provider will have their own way to do this. But if you have [delegated your domain to Azure DNS](../dns/dns-delegate-domain-azure-dns.md), you take the following steps:

1. Create a resource group for your zone.
  ```azurecli
  az group create --name zones --location eastus
  {
    "id": "/subscriptions/<guid>/resourceGroups/squillace.io",
    "location": "eastus",
    "managedBy": null,
    "name": "zones",
    "properties": {
      "provisioningState": "Succeeded"
    },
    "tags": null
  }
  ```
2. Create a DNS zone for your domain.
  ```azurecli
  az network dns zone create --resource-group zones --name squillace.info
  {
    "etag": "00000002-0000-0000-ad31-373f41dad201",
    "id": "/subscriptions/f7f09258-6753-4ca2-b1ae-193798e2c9d8/resourceGroups/zones/providers/Microsoft.Network/dnszones/squillace.info",
    "location": "global",
    "maxNumberOfRecordSets": 5000,
    "name": "squillace.info",
    "nameServers": [
      "ns1-09.azure-dns.com.",
      "ns2-09.azure-dns.net.",
      "ns3-09.azure-dns.org.",
      "ns4-09.azure-dns.info."
    ],
    "numberOfRecordSets": 2,
    "resourceGroup": "zones",
    "tags": {},
    "type": "Microsoft.Network/dnszones"
  }
  ```
## Build and deploy an application


