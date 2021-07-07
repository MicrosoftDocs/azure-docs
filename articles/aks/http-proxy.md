---
title: Configuring Azure Kubernetes Service (AKS) nodes with an HTTP proxy
description: Use the HTTP proxy configuration feature for Azure Kubernetes Service (AKS) nodes.
services: container-service
author: nickomang
ms.topic: article
ms.date: 07/07/2021
ms.author: nickoman
---

# HTTP proxy support in Azure Kubernetes Service (Preview)

Azure Kubernetes Service (AKS) clusters, whether deployed into a managed or custom virtual network, have certain outbound dependencies necessary to function properly. Previously, in environments requiring internet access to be routed through HTTP proxies, this was a problem. Nodes had no way of bootstrapping the configuration, environment variables, and certificates necessary to access internet services.

This preview feature adds HTTP proxy support to AKS clusters, exposing a straightforward interface cluster operators can use to  secure AKS-required network traffic in proxy-dependent environments.

Some more complex solutions may require creating a chain of trust to establish secure communications across the network. The feature also provides the ability to install a trusted certificate authority onto the nodes as part of bootstrapping a cluster.

## Limitations and requirements

The following scenarios are not supported:
- Different proxy configurations per node pool
- Updating proxy settings post cluster creation
- User/Password auth (as opposed to certificate auth)
- Custom CAs for API server communication

## Configuring an HTTP proxy using Azure CLI 

Deploying an AKS using Azure CLI with an HTTP proxy is done at creation, using the [az aks create][az-aks-create] command, and passing in the configuration as a JSON or YAML file.

The schema for our file looks like this:

```json
"httpProxyConfig": {
    "httpProxy": "string",
    "httpsProxy": "string",
    "noProxy": [
        "string"
    ],
    "trustedCa": "string"
}
```

Create a file and provide values for *httpProxy*, *httpsProxy*, and *noProxy*. If your environment requires it, also provide a *trustedCa* value. Next, deploy a cluster, passing in your filename via the `proxy-configuration-file` flag.

```azurecli
az aks create -n $clusterName -g $resourceGroup --proxy-configuration-file aks-proxy-config.json
```

Your cluster should initialize with the HTTP proxy configured on the nodes.


## Configuring an HTTP proxy using Azure Resource Manager (ARM) templates

Deploying an AKS cluster with an HTTP proxy configured via ARM template is very straightforward. The same schema used for CLI deployment exists in the `Microsoft.ContainerService/managedClusters` definition under properties:

```json
"properties": {
    ...,
    "httpProxyConfig": {
        "httpProxy": "string",
        "httpsProxy": "string",
        "noProxy": [
            "string"
        ],
        "trustedCa": "string"
    }
}
```

In your template, provide values for `httpProxy`, `httpsProxy`, and `noProxy`. If necessary, also provide a value for `trustedCa`. Deploy the template, and your cluster should initialize with your HTTP proxy configured on the nodes.

## Next steps
- For more on the network requirements of AKS clusters, please see [control egress traffic for cluster nodes in AKS][aks-egress].


<!-- LINKS - internal -->
[aks-egress]: ./limit-egress-traffic.md
[az-aks-create]: /cli/azure/aks#az_aks_create
