---
title: Open Service Mesh (Preview)
description: Open Service Mesh (OSM) in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 3/12/2021
ms.custom: mvc, devx-track-azurecli
ms.author: pgibson
zone_pivot_groups: client-operating-system
---

# Open Service Mesh AKS add-on (Preview)

## Overview

[Open Service Mesh (OSM)](https://docs.openservicemesh.io/) is a lightweight, extensible, Cloud Native service mesh that allows users to uniformly manage, secure, and get out-of-the-box observability features for highly dynamic microservice environments.

OSM runs an Envoy-based control plane on Kubernetes, can be configured with [SMI](https://smi-spec.io/) APIs, and works by injecting an Envoy proxy as a sidecar container next to each instance of your application. The Envoy proxy contains and executes rules around access control policies, implements routing configuration, and captures metrics. The control plane continually configures proxies to ensure policies and routing rules are up to date and ensures proxies are healthy.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Capabilities and Features

OSM provides the following set of capabilities and features to provide a cloud native service mesh for your Azure Kubernetes Service (AKS) clusters:

- Secure service to service communication by enabling mTLS

- Easily onboard applications onto the mesh by enabling automatic sidecar injection of Envoy proxy

- Easily and transparent configurations for traffic shifting on deployments

- Ability to define and execute fine grained access control policies for services

- Observability and insights into application metrics for debugging and monitoring services

- Integration with external certificate management services/solutions with a pluggable interface

## Scenarios

OSM can assist your AKS deployments with the following scenarios:

- Provide encrypted communications between service endpoints deployed in the cluster

- Traffic authorization of both HTTP/HTTPS and TCP traffic in the mesh

- Configuration of weighted traffic controls between two or more services for A/B or canary deployments

- Collection and viewing of KPIs from application traffic

## OSM Service Quotas and Limits (Preview)

OSM preview limitations for service quotas and limits can be found on the AKS [Quotas and regional limits page](./quotas-skus-regions.md).

<!-- LINKS - internal -->

[kubernetes-service]: concepts-network.md#services
[az-feature-register]: /cli/azure/feature?view=azure-cli-latest&preserve-view=true#az_feature_register
[az-feature-list]: /cli/azure/feature?view=azure-cli-latest&preserve-view=true#az_feature_list
[az-provider-register]: /cli/azure/provider?view=azure-cli-latest&preserve-view=true#az_provider_register