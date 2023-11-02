---
title: Support policies for self-hosted gateway | Azure API Management
description: Learn about the support policies and the shared responsibilities for the API Management self-hosted gateway.
author: dlepow
ms.service: api-management
ms.topic: article
ms.author: danlep
ms.date: 05/12/2023
---

# Support policies for self-hosted gateway

The Azure API Management service, in the Developer and Premium tiers, allows the deployment of the API Management gateway as a container running in on-premises infrastructure, other clouds, and Azure infrastructure options that support containers. This article provides details about technical support policies and limitations for the API Management [self-hosted gateway](self-hosted-gateway-overview.md).  

[!INCLUDE [preview](./includes/preview/preview-callout-self-hosted-gateway-deprecation.md)]

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

## Differences between managed gateway and self-hosted gateway

When deploying an instance of the API Management service, you'll always get a managed API gateway as part of the service. This gateway runs in infrastructure managed by Azure, and the software is also managed, updated, and managed by Azure.

In supported service tiers, the self-hosted gateway is an optional deployment option.

While the managed and self-hosted gateways share many common features, there are also [several differences](api-management-gateways-overview.md#feature-comparison-managed-versus-self-hosted-gateways).

## Responsibilities

The following table shows Microsoft's responsibilities, shared responsibilities, and customers' responsibilities for managing and supporting the self-hosted gateway.


|Microsoft Azure  |Shared responsibilities  |Customers  |
|---------|---------|---------|
|▪️ **Configuration endpoint (management plane)** - The self-hosted gateway depends on a configuration endpoint that provides the configuration, APIs, hostnames, and policy information. This configuration endpoint is part of the management plane of every API Management service.<br/><br/>▪️ **Gateway container image maintenance and updates** - Bug fixes, patches, performance improvements, and new features in the self-hosted gateway [container image](self-hosted-gateway-overview.md#packaging).        |▪ **Securing self-hosted gateway communication with configuration endpoint** - The communication between the self-hosted gateway and the configuration endpoint can be secured by two mechanisms: either an access token that expires automatically every 30 days and needs to be updated for the running containers; or authentication with Microsoft Entra ID, which doesn't require token refresh.<br/><br/> ▪ **Keeping the gateway up to date** - The customer oversees regularly updating the gateway to the latest version and latest features. And Microsoft will provide updated images with new features, bug fixes, and patches.      | ▪  **Gateway hosting** - Deploying and operating the gateway infrastructure: virtual machines with container runtime and/or Kubernetes cluster.<br/><br/>▪ **Network configuration** - Necessary to maintain management plane connectivity and API access.<br/><br/>    ▪ **Gateway SLA** - Capacity management, scaling, and uptime.<br/><br/>  ▪ **Providing diagnostics data to support** - Collecting and sharing diagnostics data with support engineers.<br/><br/>▪ **Third party OSS (open-source software) software components** - Combining the self-hosted gateway with other software like Prometheus, Grafana, service meshes, container runtimes, Kubernetes distributions, and proxies are the customer's responsibility.  |

## Self-hosted gateway container image support coverage 

We have the following tagging strategy for the [self-hosted gateway container image](self-hosted-gateway-overview.md#packaging), following the major, minor, patch convention: `{major}.{minor}.{patch}`. You can find a full list of [available tags](https://mcr.microsoft.com/product/azure-api-management/gateway/tags). As a best practice, we recommend that customers run the latest stable version of our container image. Given the continuous releases of our container image, we'll provide official support for the following versions: 

### Supported versions 

* **Last major version and the last three minor releases**   

    For example, if the latest version is 2.2.0, we'll support all 2.2.x, 2.1.x, and 2.0.x minor releases. For all previous versions, we'll ask you to update to a supported version. 

* **Fixes** 

    If we discover a bug, CVE, or performance issue in a supported version - for example, a bug is found in the container image 2.0.0 - the fix will land as a patch in the latest minor version, for example 2.2.x. 

### Unsupported versions 

* Container images with the `beta` tag.

* Any version with the `preview` suffix. 

## Self-hosted gateway support scenarios

### Microsoft provides technical support for the following examples

* Configuration endpoint and management plane uptime and configuration for the supported tiers. 

* Self-hosted gateway container image bugs, performance issues, and improvements. 

* Self-hosted gateway container image security patches (CVEs) will be fixed as soon as possible. 

* Supported third-party open-source projects, for example: Open Telemetry and DAPR (Distributed Application Runtime). 

### Microsoft does not provide technical support for the following examples 

* Questions about how to use the self-hosted gateway inside Kubernetes. For example, Microsoft Support doesn't provide advice on how to create custom ingress controllers, service mesh, use application workloads, or apply third-party or open-source software packages or tools. 

* Third-party open-source projects combined with our self-hosted gateway, except for specific supported projects, for example: Open Telemetry and DAPR (Distributed Application Runtime). 

* Third-party closed-source software, including security scanning tools and networking devices or software. 

* Troubleshooting network customizations, CNIs, service meshes, network policies, firewalls, and complex networking circuits. Microsoft will only  check that the communication between self-hosted gateway and the configuration endpoint is working. 

## Bugs and issues

If you have questions, get answers from community experts in [Microsoft Q&A](/answers/tags/29/azure-api-management). 

If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview): 

1. For **Issue type**, select **Technical**. 

1. For **Subscription**, select your subscription. 

1. For **Service**, select **My services**, then select **API Management Service**. 

1. For **Resource**, select the Azure resource that you're creating a support request for. 

1. For **Problem type**, select **Self-Hosted Gateway**. 

You can also get help from our communities. You can file an issue on [GitHub](https://aka.ms/apim/sputnik/repo) or ask questions on [Stack  Overflow](https://aka.ms/apimso) and tag them with "azure-api-management".

## Next steps

* Learn how to deploy the API Management self-hosted gateway to [Azure Arc-enabled Kubernetes clusters](how-to-deploy-self-hosted-gateway-azure-arc.md), [Azure Kubernetes Service](how-to-deploy-self-hosted-gateway-azure-kubernetes-service.md), or a Kubernetes cluster using [YAML](how-to-deploy-self-hosted-gateway-kubernetes.md) or a [Helm chart](how-to-deploy-self-hosted-gateway-kubernetes-helm.md).

* Review guidance for running the self-hosted gateway on [Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md).
