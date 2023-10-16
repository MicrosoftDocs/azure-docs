---
title: Open Service Mesh in Azure Kubernetes Service (AKS)
description: Learn about the Open Service Mesh (OSM) add-on in Azure Kubernetes Service (AKS).
ms.topic: article
ms.date: 04/06/2023
ms.author: pgibson
---

# Open Service Mesh (OSM) add-on in Azure Kubernetes Service (AKS)

[Open Service Mesh (OSM)](https://docs.openservicemesh.io/) is a lightweight, extensible, cloud native service mesh that allows you to uniformly manage, secure, and get out-of-the-box observability features for highly dynamic microservice environments.

OSM runs an Envoy-based control plane on Kubernetes and can be configured with [SMI](https://smi-spec.io/) APIs. OSM works by injecting an Envoy proxy as a sidecar container with each instance of your application. The Envoy proxy contains and executes rules around access control policies, implements routing configuration, and captures metrics. The control plane continually configures the Envoy proxies to ensure policies and routing rules are up to date and proxies are healthy.

Microsoft started the OSM project, but it's now governed by the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/).

## Enable the OSM add-on

OSM can be added to your Azure Kubernetes Service (AKS) cluster by enabling the OSM add-on using the [Azure CLI][osm-azure-cli] or a [Bicep template][osm-bicep]. The OSM add-on provides a fully supported installation of OSM that's integrated with AKS.

> [!IMPORTANT]
> Based on the version of Kubernetes your cluster is running, the OSM add-on installs a different version of OSM.
>
> |Kubernetes version         | OSM version installed |
> |---------------------------|-----------------------|
> | 1.24.0 or greater         | 1.2.5                 |
> | Between 1.23.5 and 1.24.0 | 1.1.3                 |
> | Below 1.23.5              | 1.0.0                 |
>
> Older versions of OSM may not be available for install or be actively supported if the corresponding AKS version has reached end of life. You can check the [AKS Kubernetes release calendar](./supported-kubernetes-versions.md#aks-kubernetes-release-calendar) for information on AKS version support windows.

## Capabilities and features

OSM provides the following capabilities and features:

- Secure service-to-service communication by enabling mutual TLS (mTLS).
- Onboard applications onto the OSM mesh using automatic sidecar injection of Envoy proxy.
- Transparently configure traffic shifting on deployments.
- Define and execute fine-grained access control policies for services.
- Monitor and debug services using observability and insights into application metrics.
- Encrypt communications between service endpoints deployed in the cluster.
- Enable traffic authorization of both HTTP/HTTPS and TCP traffic.
- Configure weighted traffic controls between two or more services for A/B testing or canary deployments.
- Collect and view KPIs from application traffic.
- Integrate with external certificate management.
- Integrate with existing ingress solutions such as [NGINX][nginx], [Contour][contour], and [Application Routing][app-routing].

For more information on ingress and OSM, see [Using ingress to manage external access to services within the cluster][osm-ingress] and [Integrate OSM with Contour for ingress][osm-contour]. For an example of how to integrate OSM with ingress controllers using the `networking.k8s.io/v1` API, see [Ingress with Kubernetes Nginx ingress controller][osm-nginx]. For more information on using Application Routing, which automatically integrates with OSM, see [Application Routing][app-routing].

## Limitations

The OSM AKS add-on has the following limitations:

- After installation, you must enable Iptables redirection for port IP address and port range exclusion using `kubectl patch`. For more information, see [iptables redirection][ip-tables-redirection].
- Any pods that need access to IMDS, Azure DNS, or the Kubernetes API server must have their IP addresses added to the global list of excluded outbound IP ranges using [Global outbound IP range exclusions][global-exclusion].
* The add-on doesn't work on AKS clusters that are using [Istio based service mesh addon for AKS][istio-about].
- OSM doesn't support Windows Server containers.

## Next steps

After enabling the OSM add-on using the [Azure CLI][osm-azure-cli] or a [Bicep template][osm-bicep], you can:

- [Deploy a sample application][osm-deploy-sample-app]
- [Onboard an existing application][osm-onboard-app]

[ip-tables-redirection]: https://release-v1-2.docs.openservicemesh.io/docs/guides/traffic_management/iptables_redirection/
[global-exclusion]: https://release-v1-2.docs.openservicemesh.io/docs/guides/traffic_management/iptables_redirection/#global-outbound-ip-range-exclusions
[osm-azure-cli]: open-service-mesh-deploy-addon-az-cli.md
[osm-bicep]: open-service-mesh-deploy-addon-bicep.md
[osm-deploy-sample-app]: https://release-v1-2.docs.openservicemesh.io/docs/getting_started/install_apps/
[osm-onboard-app]: https://release-v1-2.docs.openservicemesh.io/docs/guides/app_onboarding/
[nginx]: https://github.com/kubernetes/ingress-nginx
[contour]: https://projectcontour.io/
[osm-ingress]: https://release-v1-2.docs.openservicemesh.io/docs/guides/traffic_management/ingress/
[osm-contour]: https://release-v1-2.docs.openservicemesh.io/docs/demos/ingress_contour
[osm-nginx]: https://release-v1-2.docs.openservicemesh.io/docs/demos/ingress_k8s_nginx
[app-routing]: app-routing.md
[istio-about]: istio-about.md
