---
title: Configuring Azure Kubernetes Service (AKS) nodes with an HTTP proxy
description: Use the HTTP proxy configuration feature for Azure Kubernetes Service (AKS) nodes.
ms.subservice: aks-networking
ms.custom: devx-track-arm-template, devx-track-azurecli
author: asudbring
ms.topic: how-to
ms.date: 09/18/2023
ms.author: allensu
---

# HTTP proxy support in Azure Kubernetes Service

Azure Kubernetes Service (AKS) clusters, whether deployed into a managed or custom virtual network, have certain outbound dependencies necessary to function properly. Previously, in environments requiring internet access to be routed through HTTP proxies, this was a problem. Nodes had no way of bootstrapping the configuration, environment variables, and certificates necessary to access internet services.

This feature adds HTTP proxy support to AKS clusters, exposing a straightforward interface that cluster operators can use to secure AKS-required network traffic in proxy-dependent environments.

Some more complex solutions may require creating a chain of trust to establish secure communications across the network. The feature also enables installation of a trusted certificate authority onto the nodes as part of bootstrapping a cluster.

## Limitations and other details

The following scenarios are **not** supported:

- Different proxy configurations per node pool
- User/Password authentication
- Custom CAs for API server communication
- Windows-based clusters
- Node pools using Virtual Machine Availability Sets (VMAS)
- Using * as wildcard attached to a domain suffix for noProxy

By default, *httpProxy*, *httpsProxy*, and *trustedCa* have no value.

## Prerequisites

The latest version of the Azure CLI. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Configuring an HTTP proxy using the Azure CLI

Using AKS with an HTTP proxy is done at cluster creation, using the [az aks create][az-aks-create] command and passing in configuration as a JSON file.

The schema for the config file looks like this:

```json
{
  "httpProxy": "string",
  "httpsProxy": "string",
  "noProxy": [
    "string"
  ],
  "trustedCa": "string"
}
```

* `httpProxy`: A proxy URL to use for creating HTTP connections outside the cluster. The URL scheme must be `http`.
* `httpsProxy`: A proxy URL to use for creating HTTPS connections outside the cluster. If this isn't specified, then `httpProxy` is used for both HTTP and HTTPS connections.
* `noProxy`: A list of destination domain names, domains, IP addresses or other network CIDRs to exclude proxying.
* `trustedCa`: A string containing the `base64 encoded` alternative CA certificate content. Currently only the `PEM` format is supported.

> [!IMPORTANT]
> For compatibility with Go-based components that are part of the Kubernetes system, the certificate **must** support `Subject Alternative Names(SANs)` instead of the deprecated Common Name certs.
>
> There are differences in applications on how to comply with the environment variable `http_proxy`, `https_proxy`, and `no_proxy`. Curl and Python don't support CIDR in `no_proxy`, Ruby does.

Example input:

> [!NOTE]
> The CA certificate should be the base64 encoded string of the PEM format cert content.

```json
{
  "httpProxy": "http://myproxy.server.com:8080/", 
  "httpsProxy": "https://myproxy.server.com:8080/", 
  "noProxy": [
    "localhost",
    "127.0.0.1"
  ],
  "trustedCA": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUgvVENDQmVXZ0F3SUJB...b3Rpbk15RGszaWFyCkYxMFlscWNPbWVYMXVGbUtiZGkvWG9yR2xrQ29NRjNURHg4cm1wOURCaUIvCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0="
}
```

Create a file and provide values for *httpProxy*, *httpsProxy*, and *noProxy*. If your environment requires it, provide a value for *trustedCa*. Next, deploy a cluster, passing in your filename using the `http-proxy-config` flag.

```azurecli
az aks create -n $clusterName -g $resourceGroup --http-proxy-config aks-proxy-config.json
```

Your cluster will initialize with the HTTP proxy configured on the nodes.

## Configuring an HTTP proxy using Azure Resource Manager (ARM) templates

Deploying an AKS cluster with an HTTP proxy configured using an ARM template is straightforward. The same schema used for CLI deployment exists in the `Microsoft.ContainerService/managedClusters` definition under properties:

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

In your template, provide values for *httpProxy*, *httpsProxy*, and *noProxy*. If necessary, provide a value for *trustedCa*. Deploy the template, and your cluster should initialize with your HTTP proxy configured on the nodes.

## Updating Proxy configurations

> [!NOTE]
> If switching to a new proxy, the new proxy must already exist for the update to be successful.  Then, after the upgrade is completed the old proxy can be deleted.

Values for *httpProxy*, *httpsProxy*, *trustedCa* and *NoProxy* can be changed and applied to the cluster with the [az aks update][az-aks-update] command. An aks update for *httpProxy*, *httpsProxy*, and/or *NoProxy* will automatically inject new environment variables into pods with the new *httpProxy*, *httpsProxy*, or *NoProxy* values.  Pods must be rotated for the apps to pick it up.  For components under kubernetes, like containerd and the node itself, this won't take effect until a node image upgrade is performed.

For example, assuming a new file has been created with the base64 encoded string of the new CA cert called *aks-proxy-config-2.json*, the following action updates the cluster.  Or, you need to add new endpoint urls for your applications to No Proxy:

```azurecli
az aks update -n $clusterName -g $resourceGroup --http-proxy-config aks-proxy-config-2.json
```

## Monitoring add-on configuration

The HTTP proxy with the Monitoring add-on supports the following configurations:

  - Outbound proxy without authentication
  - Outbound proxy with username & password authentication
  - Outbound proxy with trusted cert for Log Analytics endpoint

The following configurations aren't supported:

  - The Custom Metrics and Recommended Alerts features aren't supported when you use a proxy with trusted certificates

## Next steps

For more information regarding the network requirements of AKS clusters, see [control egress traffic for cluster nodes in AKS][aks-egress].

<!-- LINKS - internal -->
[aks-egress]: ./limit-egress-traffic.md
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az-extension-update
[install-azure-cli]: /cli/azure/install-azure-cli
