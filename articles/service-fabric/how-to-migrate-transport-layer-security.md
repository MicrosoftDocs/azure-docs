---
title: How to migrate to TLS (Transport Layer Security) 1.3 for Service Fabric
description: A how-to guide for migrating to TLS version 1.3 for classic and managed Service Fabric clusters.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 03/29/2024
---

# How to migrate to TLS (Transport Layer Security) 1.3 for Service Fabric

This article explains how to enable TLS 1.3 on Service Fabric clusters. TLS helps manage the HTTP endpoints of your clusters.

If you only use certificates and don't need to define endpoints for your clusters, you only need to enable exclusive authentication mode. To enable this mode, you only need to complete the [Upgrade to the latest Service Fabric runtime version](#upgrade-to-the-latest-service-fabric-runtime-version) and [Enable exclusive authentication mode](#enable-exclusive-authentication-mode) steps. Callouts are made when appropriate. If you later decide to enable token-based authentication, you need to complete the skipped steps.

> [!NOTE]
> The steps in this article are for Windows machines. Linux isn't supported at this time.

> [!NOTE]
> Support for TLS 1.3 was introduced with Service Fabric version 10.1CU2 (10.1.1951.9590). However, TLS 1.3 won't be enabled when using TLS 1.3 for Service Fabric Transport endpoints of user applications running in Windows 8 compatibility mode. In this scenario, Windows 10 compatibility mode must be declared in the Windows application manifests for TLS 1.3 to successfully enabled.

## Prerequisites

1. Determine the Service Fabric runtime version of your cluster. You can see your cluster's runtime version by logging in the Azure portal, viewing your cluster in the Service Fabric Explorer, or connecting to your cluster via PowerShell.
1. Ensure all the nodes in your cluster are upgraded to Windows Server 2022.
    * For managed clusters, you can follow the steps outlined in the [Modify the OS SKU for a node type section of the Service Fabric managed cluster node types how-to guide](how-to-managed-cluster-modify-node-type.md#modify-the-os-sku-for-a-node-type).
    * For classic clusters, you can follow the steps outlined in [Scale up a Service Fabric cluster primary node type](service-fabric-scale-up-primary-node-type.md).
1. Determine if you use token-based authentication. You can check in the portal or review your cluster's manifest in the Service Fabric Explorer. If you do use token-based authentication, Microsoft Entra ID settings appear in the cluster manifest.
1. Use the correct API version for deployments, depending on your cluster type:
    * For managed clusters, use `2023-12-01-preview` or higher
    * For classic clusters, use `2023-11-01-preview` or higher

Once you complete these prerequisite steps, you're ready to enable TLS 1.3 on your Service Fabric clusters.

## Upgrade to the latest Service Fabric runtime version

In this step, you upgrade your cluster's runtime version to the latest version, which supports TLS 1.3.

Follow the steps in [Upgrade the Service Fabric version that runs on your cluster](service-fabric-cluster-upgrade-windows-server.md). When you're finished, return to this article.

If you don't use token-based authentication for authenticating to your clusters, you should skip the next two steps. Instead, proceed to [Enable exclusive authentication mode](#enable-exclusive-authentication-mode). If you use token-based authentication for authenticating to your clusters, proceed to the next step.

## Define a new HTTP endpoint

> [!NOTE]
> If you don't use token-based authentication for authenticating to your clusters, you should skip this step and the next. Instead, proceed to [Enable exclusive authentication mode](#enable-exclusive-authentication-mode).

In this step, you define a new HTTP endpoint to use for token-based authentication to your cluster. You must define a new endpoint because TLS 1.3 doesn't easily support mixed mode authentication, where both X.509 certificates and OAuth 2.0 bearer tokens. Service Fabric cluster management endpoints typically use mixed mode authentication, so enabling TLS 1.3 without creating a new endpoint would break your cluster management endpoints.

Define a new endpoint exclusively dedicated to token-based authentication and do so for each node type in your cluster. In the following JSON snippet, we demonstrate how to define an endpoint in a cluster manifest with an example port number of 19079:

```json
"nodeTypes": [
  {
    "name": "parameters('vmNodeType0Name')]",
    ...
    "httpGatewayTokenAuthEndpointPort": "19079",
    ...
  }
]
```

You can use any port number. It should be the same value throughout the cluster and should be selected from the range of ports reserved for the Service Fabric runtime.

To deploy the new endpoint, you have two options:
* Upgrade the configuration of an existing cluster using the new manifest
* Define the endpoint at deployment time of a new cluster

### Cluster configuration upgrade for an existing

You can follow the steps in [Customize cluster settings using Resource Manager templates section of the Upgrade the configuration of a cluster in Azure](service-fabric-cluster-config-upgrade-azure.md#customize-cluster-settings-using-resource-manager-templates). When editing the JSON in step 4, make sure to update the `properties` element to include the new endpoint definition previously detailed in a sample JSON snippet.

### Deploy a new cluster

You can follow the steps in the appropriate quickstart for the type of Service Fabric cluster you use. Make sure to edit the template to include the new endpoint definition previously detailed in the sample JSON snippet.
* [Service Fabric managed clusters quickstart](quickstart-managed-cluster-template.md)
* [Service Fabric classic clusters quickstart](quickstart-cluster-template.md)

## Migrate to the new token authentication endpoint

> [!NOTE]
> If you don't use token-based authentication for authenticating to your clusters, you should skip this step and should've skipped the previous step. Instead, proceed to [Enable exclusive authentication mode](#enable-exclusive-authentication-mode).

In this step, you need to find and update all clients that used token-based authentication to target the new token authentication endpoint. These clients made include scripts, code, or services. Any clients still addressing the old gateway port break when the port starts accepting TLS 1.3 connections. Also note that this port could be parameterized or have a different value than the Service Fabric-defined default.

Some examples of changes that need to be made:
* Microsoft Entra ID applications
* Any scripts that reference the existing endpoint
* Load Balancer (LB) inbound Network Address Translation (NAT), Health Probe, and LB rules that reference the existing endpoint
* Network Security Group (NSG) rules

You also need to migrate traffic that requires token-based authentication to the new endpoint.

## Enable exclusive authentication mode

In this step, you enable exclusive authentication mode. As a safety mechanism, TLS 1.3 isn't offered on the default HTTP gateway endpoint until the cluster owner enables exclusive authentication mode.

`enableHttpGatewayExclusiveAuthMode` is a new setting with a default value of `false`. You to set this new setting to `true`. If you use token-based authentication, you can set `enableHttpGatewayExclusiveAuthMode` at the same time as the new endpoint definition in the previous steps. This setting update was only introduced sequentially to minimize the chance of breakages.

> [!WARNING]
> If users aren't fully migrated to the new set of endpoints, this is a breaking change.

> [!IMPORTANT]
> The Service Fabric runtime blocks enabling the exclusive authentication mode if token-based authentication is enabled on your cluster but a separate endpoint for token-based authentication isn't yet specified.
>
> However, nothing in the cluster can detect breaks in external clients that attempt to authenticate using tokens against the newly exclusive default HTTP gateway port.

After you introduce this new setting to your cluster's configuration, you'll lose token-based access to the previous endpoint. You can access Service Fabric Explorer via the new port you defined if you completed the [Define a new HTTP endpoint step](#define-a-new-http-endpoint).

To update the `enableHttpGatewayExclusiveAuthMode` setting, you have two options:
* Upgrade the configuration of an existing cluster using the new manifest
* Define the endpoint at deployment time of a new cluster

### Cluster configuration upgrade for an existing

You can follow the steps in [Customize cluster settings using Resource Manager templates section of the Upgrade the configuration of a cluster in Azure](service-fabric-cluster-config-upgrade-azure.md#customize-cluster-settings-using-resource-manager-templates). When editing the JSON in step 4, make sure to update the `properties` element to include the new setting shown in the following JSON snippet.

```json
  "enableHttpGatewayExclusiveAuthMode": true
```

### Deploy a new cluster

You can follow the steps in the appropriate quickstart for the type of Service Fabric cluster you use. Make sure to edit the template to include the new endpoint definition previously detailed in the sample JSON snippet.
* [Service Fabric managed clusters quickstart](quickstart-managed-cluster-template.md)
* [Service Fabric classic clusters quickstart](quickstart-cluster-template.md)

## Next steps

There aren't any specific steps you need to complete after migrating your cluster to TLS 1.3. However, some useful related articles are including in the following links:
* [X.509 Certificate-based authentication in Service Fabric clusters](cluster-security-certificates.md)
* [Manage certificates in Service Fabric clusters](cluster-security-certificate-management.md)
