---
title: Open Service Mesh
description: Open Service Mesh (OSM) in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 3/12/2021
ms.custom: mvc, devx-track-azurecli
ms.author: pgibson
---

# Open Service Mesh AKS add-on

[Open Service Mesh (OSM)](https://docs.openservicemesh.io/) is a lightweight, extensible, Cloud Native service mesh that allows users to uniformly manage, secure, and get out-of-the-box observability features for highly dynamic microservice environments.

OSM runs an Envoy-based control plane on Kubernetes, can be configured with [SMI](https://smi-spec.io/) APIs, and works by injecting an Envoy proxy as a sidecar container next to each instance of your application. The Envoy proxy contains and executes rules around access control policies, implements routing configuration, and captures metrics. The control plane continually configures proxies to ensure policies and routing rules are up to date and ensures proxies are healthy.

The OSM project was originated by Microsoft and has since been donated and is governed by the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/). The OSM open source project, will continue to be a community led collaboration around features and functionality and contributions to the project are welcomed and encouraged. Please see our [Contributor Ladder](https://github.com/openservicemesh/osm/blob/main/CONTRIBUTOR_LADDER.md) guide on how you can get involved.

## Capabilities and features

OSM provides the following set of capabilities and features to provide a cloud native service mesh for your Azure Kubernetes Service (AKS) clusters:

- OSM has been integrated into the AKS service to provide a fully supported and managed service mesh experience with the convenience of the AKS feature add-on

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

## OSM service quotas and limits (preview)

OSM preview limitations for service quotas and limits can be found on the AKS [Quotas and regional limits page](./quotas-skus-regions.md).

<!-- LINKS - internal -->

[kubernetes-service]: concepts-network.md#services
[az-feature-register]: /cli/azure/feature?view=azure-cli-latest&preserve-view=true#az_feature_register
[az-feature-list]: /cli/azure/feature?view=azure-cli-latest&preserve-view=true#az_feature_list
[az-provider-register]: /cli/azure/provider?view=azure-cli-latest&preserve-view=true#az_provider_register
