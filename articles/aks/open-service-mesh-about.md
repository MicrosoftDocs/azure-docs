---
title: Open Service Mesh
description: Open Service Mesh (OSM) in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 12/20/2021
ms.author: pgibson
---

# Open Service Mesh AKS add-on

[Open Service Mesh (OSM)](https://docs.openservicemesh.io/) is a lightweight, extensible, cloud native service mesh that allows users to uniformly manage, secure, and get out-of-the-box observability features for highly dynamic microservice environments.

OSM runs an Envoy-based control plane on Kubernetes and can be configured with [SMI](https://smi-spec.io/) APIs. OSM works by injecting an Envoy proxy as a sidecar container with each instance of your application. The Envoy proxy contains and executes rules around access control policies, implements routing configuration, and captures metrics. The control plane continually configures the Envoy proxies to ensure policies and routing rules are up to date and ensures proxies are healthy.

The OSM project was originated by Microsoft and has since been donated and is governed by the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/).

## Installation and version

OSM can be added to your Azure Kubernetes Service (AKS) cluster by enabling the OSM add-on using the [Azure CLI][osm-azure-cli] or a [Bicep template][osm-bicep]. The OSM add-on provides a fully supported installation of OSM that is integrated with AKS.

> [!IMPORTANT]
> The OSM add-on installs version *0.11.1* of OSM on your cluster.

## Capabilities and features

OSM provides the following capabilities and features:

- Secure service to service communication by enabling mutual TLS (mTLS).
- Onboard applications onto the OSM mesh using automatic sidecar injection of Envoy proxy.
- Transparently configure traffic shifting on deployments.
- Define and execute fine grained access control policies for services.
- Monitor and debug services using observability and insights into application metrics.
- Integrate with external certificate management.

## Example scenarios

OSM can be used to help your AKS deployments in many different ways. For example:

- Encrypt communications between service endpoints deployed in the cluster.
- Enable traffic authorization of both HTTP/HTTPS and TCP traffic.
- Configure weighted traffic controls between two or more services for A/B testing or canary deployments.
- Collect and view KPIs from application traffic.


[osm-azure-cli]: open-service-mesh-deploy-addon-az-cli.md
[osm-bicep]: open-service-mesh-deploy-addon-bicep.md