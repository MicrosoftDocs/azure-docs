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
> Based on the version of Kubernetes your cluster is running, the OSM add-on installs a different version of OSM:
> - If your cluster is running Kubernetes version 1.24.0 or greater, the OSM add-on installs version *1.2.0* of OSM.
> - If your cluster is running a version of Kubernetes between 1.23.5 and 1.24.0, the OSM add-on installs version *1.1.1* of OSM.
> - If your cluster is running a version of Kubernetes below 1.23.5, the OSM add-on installs version *1.0.0* of OSM.

## Capabilities and features

OSM provides the following capabilities and features:

- Secure service to service communication by enabling mutual TLS (mTLS).
- Onboard applications onto the OSM mesh using automatic sidecar injection of Envoy proxy.
- Transparently configure traffic shifting on deployments.
- Define and execute fine grained access control policies for services.
- Monitor and debug services using observability and insights into application metrics.
- Integrate with external certificate management.
- Integrates with existing ingress solutions such as [NGINX][nginx], [Contour][contour], and [Web Application Routing][web-app-routing]. For more details on how ingress works with OSM, see [Using Ingress to manage external access to services within the cluster][osm-ingress]. For an example on integrating OSM with Contour for ingress, see [Ingress with Contour][osm-contour]. For an example on integrating OSM with ingress controllers that use the `networking.k8s.io/v1` API, such as NGINX, see [Ingress with Kubernetes Nginx Ingress Controller][osm-nginx]. For more details on using Web Application Routing, which automatically integrates with OSM, see [Web Application Routing][web-app-routing].

## Example scenarios

OSM can be used to help your AKS deployments in many different ways. For example:

- Encrypt communications between service endpoints deployed in the cluster.
- Enable traffic authorization of both HTTP/HTTPS and TCP traffic.
- Configure weighted traffic controls between two or more services for A/B testing or canary deployments.
- Collect and view KPIs from application traffic.

## Add-on limitations

The OSM AKS add-on has the following limitations:

* [Iptables redirection][ip-tables-redirection] for port IP address and port range exclusion must be enabled using `kubectl patch` after installation. For more details, see [iptables redirection][ip-tables-redirection].
* Pods that are onboarded to the mesh that need access to IMDS, Azure DNS, or the Kubernetes API server must have their IP addresses to the global list of excluded outbound IP ranges using [Global outbound IP range exclusions][global-exclusion].
* At this time, OSM does not support Windows Server containers.

## Next steps

After enabling the OSM add-on using the [Azure CLI][osm-azure-cli] or a [Bicep template][osm-bicep], you can:
* [Deploy a sample application][osm-deploy-sample-app]
* [Onboard an existing application][osm-onboard-app]

[ip-tables-redirection]: https://release-v1-0.docs.openservicemesh.io/docs/guides/traffic_management/iptables_redirection/
[global-exclusion]: https://release-v1-0.docs.openservicemesh.io/docs/guides/traffic_management/iptables_redirection/#global-outbound-ip-range-exclusions
[osm-azure-cli]: open-service-mesh-deploy-addon-az-cli.md
[osm-bicep]: open-service-mesh-deploy-addon-bicep.md
[osm-deploy-sample-app]: https://release-v1-0.docs.openservicemesh.io/docs/getting_started/install_apps/
[osm-onboard-app]: https://release-v1-0.docs.openservicemesh.io/docs/guides/app_onboarding/
[ip-tables-redirection]: https://docs.openservicemesh.io/docs/guides/traffic_management/iptables_redirection/
[global-exclusion]: https://docs.openservicemesh.io/docs/guides/traffic_management/iptables_redirection/#global-outbound-ip-range-exclusions
[nginx]: https://github.com/kubernetes/ingress-nginx
[contour]: https://projectcontour.io/
[osm-ingress]: https://release-v1-0.docs.openservicemesh.io/docs/guides/traffic_management/ingress/
[osm-contour]: https://release-v1-0.docs.openservicemesh.io/docs/demos/ingress_contour
[osm-nginx]: https://release-v1-0.docs.openservicemesh.io/docs/demos/ingress_k8s_nginx
[web-app-routing]: web-app-routing.md