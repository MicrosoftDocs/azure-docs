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

You can use Draft with any Docker image registry and any Kubernetes cluster, including locally. This tutorial shows how to use ACS with Kubernetes, ACR, and Azure DNS to create a live CI/CD developer pipeline using Draft.


## Create an Azure Container Registry
You can easily [create a new Azure Container Registry](../container-registry/container-registry-get-started-azure-cli.md), but the steps are as follows:

1. Create a Azure resource group to manage your ACR registry and the Kubernetes cluster in ACS.
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

Now that you have a cluster, you can import the credentials by using the [az acs kubernetes get-credentials](/cli/azure/acs/kubernetes#get-credentials) command. Now you have a local configuration file for your cluster, which is what Helm and Draft need to get their work done.

## Install and configure draft
The installation instructions for Draft are in the [Draft repository](https://github.com/Azure/draft/blob/master/docs/install.md). They are relatively simple, but do require some configuration, as it depends on [Helm](https://aka.ms/helm) to create and deploy a Helm chart into the Kubernetes cluster.

1. [Download and install Helm](https://aka.ms/helm#install).
2. Use Helm to search for and install `stable/traefik`, and ingress controller to enable inbound requests for your builds.
    ```bash
    $ helm search traefik
    NAME          	VERSION	DESCRIPTION
    stable/traefik	1.3.0  	A Traefik based Kubernetes ingress controller w...

    $ helm install stable/traefik --name ingress
    ```
    Now set a watch on the `ingress` controller to capture the external IP value when it is deployed. This IP address will be the one [mapped to your deployment domain](#wire-up-deployment-domain) in the next section.

    ```bash
    kubectl get svc -w
    NAME                          CLUSTER-IP     EXTERNAL-IP     PORT(S)                      AGE
    ingress-traefik               10.0.248.104   13.64.108.240   80:31046/TCP,443:32556/TCP   1h
    kubernetes                    10.0.0.1       <none>          443/TCP                      7h
    ```

    In this case, the external IP for the deployment domain is `13.64.108.240`. Now you can map your domain to that IP.

## Wire up deployment domain

Draft creates a release for each Helm chart it creates -- each application you are working on. Each one gets a generated name that is used by draft as a _subdomain_ on top of the root _deployment domain_ that you control. (In this example, we use `squillace.io` as the deployment domain.) To enable this subdomain behavior, you must create an A record for `'*'` in your DNS entries for your deployment domain, so that each generated subdomain is routed to the Kubernetes cluster's ingress controller.

Your own domain provider has their own way to assign DNS servers; to [delegate your domain nameservers to Azure DNS](../dns/dns-delegate-domain-azure-dns.md), you take the following steps:

1. Create a resource group for your zone.
    ```azurecli
    az group create --name squillace.io --location eastus
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
Use the [az network dns zone create](/cli/azure/network/dns/zone#create) command to obtain the nameservers to delegate DNS control to Azure DNS for your domain.
    ```azurecli
    az network dns zone create --resource-group squillace.io --name squillace.io
    {
      "etag": "<guid>",
      "id": "/subscriptions/<guid>/resourceGroups/zones/providers/Microsoft.Network/dnszones/squillace.io",
      "location": "global",
      "maxNumberOfRecordSets": 5000,
      "name": "squillace.io",
      "nameServers": [
        "ns1-09.azure-dns.com.",
        "ns2-09.azure-dns.net.",
        "ns3-09.azure-dns.org.",
        "ns4-09.azure-dns.info."
      ],
      "numberOfRecordSets": 2,
      "resourceGroup": "squillace.io",
      "tags": {},
      "type": "Microsoft.Network/dnszones"
    }
    ```
3. Add the DNS servers you are given to the domain provider for your deployment domain, which enables you to use Azure DNS to repoint your domain as you want.
4. Create an A record-set entry for your deployment domain mapping to the `ingress` IP from step 2 of the previous section.
    ```azurecli
    az network dns record-set a add-record --ipv4-address 13.64.108.240 --record-set-name '*' -g squillace.io -z squillace.io
    ```
The output looks something like:
    ```json
    {
      "arecords": [
        {
          "ipv4Address": "13.64.108.240"
        }
      ],
      "etag": "<guid>",
      "id": "/subscriptions/<guid>/resourceGroups/squillace.io/providers/Microsoft.Network/dnszones/squillace.io/A/*",
      "metadata": null,
      "name": "*",
      "resourceGroup": "squillace.io",
      "ttl": 3600,
      "type": "Microsoft.Network/dnszones/A"
    }
    ```

5. Configure Draft to use your registry and create subdomains for each Helm chart it creates. To configure Draft, you need:
  - your Azure Container Registry name (in this example, `draft`)
  - your registry key, or password, from `az acr credential show -n <registry name> --output tsv --query "passwords[0].value"`.
  - the root deployment domain that you have configured to map to the Kubernetes ingress external IP address (here, `squillace.io`)
Call `draft init` and the configuration process prompts you for the values above. The process looks something like the following the first time you run it.
  ```
  draft init
  Creating pack ruby...
  Creating pack node...
  Creating pack gradle...
  Creating pack maven...
  Creating pack php...
  Creating pack python...
  Creating pack dotnetcore...
  Creating pack golang...
  $DRAFT_HOME has been configured at /Users/ralphsquillace/.draft.

  In order to install Draft, we need a bit more information...

  1. Enter your Docker registry URL (e.g. docker.io, quay.io, myregistry.azurecr.io): draft.azurecr.io
  2. Enter your username: draft
  3. Enter your password:
  4. Enter your org where Draft will push images [draft]: draft
  5. Enter your top-level domain for ingress (e.g. draft.example.com): squillace.io
  Draft has been installed into your Kubernetes Cluster.
  Happy Sailing!
  ```

Now you're ready to deploy an application.


## Build and deploy an application

In the Draft repo are [six simple example applications](https://github.com/Azure/draft/tree/master/examples). Clone the repo and let's use the [Python example](https://github.com/Azure/draft/tree/master/examples/python). Change into the examples/Python directory, and type `draft create` to build the application. It should look like the following example.
```bash
$ draft create
--> Python app detected
--> Ready to sail
```

The output includes a Dockerfile and a Helm chart. To build and deploy, you just type `draft up`. The output is extensive, but begins like the following example.
```bash
$ draft up
--> Building Dockerfile
Step 1 : FROM python:onbuild
onbuild: Pulling from library/python
10a267c67f42: Pulling fs layer
fb5937da9414: Pulling fs layer
9021b2326a1e: Pulling fs layer
dbed9b09434e: Pulling fs layer
ea8a37f15161: Pulling fs layer
<snip>
```

and when successful ends with something similar to the following example.
```bash
ab68189731eb: Pushed
53c0ab0341bee12d01be3d3c192fbd63562af7f1: digest: sha256:bb0450ec37acf67ed461c1512ef21f58a500ff9326ce3ec623ce1e4427df9765 size: 2841
--> Deploying to Kubernetes
--> Status: DEPLOYED
--> Notes:

  http://gangly-bronco.squillace.io to access your application

Watching local files for changes...
```

Whatever your chart's name is, you can now `curl http://gangly-bronco.squillace.io` to receive the reply, `Hello World!`.

## Next steps

Now that you have an ACS Kubernetes cluster, you can investigate using [Azure Container Registry](../container-registry/container-registry-intro.md) to create more and different deployments of this scenario. For example, you can create a draft._basedomain.toplevel_ domain DNS record-set that controls things off of a deeper subdomain for specific ACS deployments.






