---
title: Header Rewrite for Azure Application Gateway for Containers - Gateway API
description: Learn how to rewrite headers in Gateway API for Application Gateway for Containers.
services: application gateway
author: greg-lindsay
ms.service: application-gateway
ms.subservice: appgw-for-containers
ms.topic: conceptual
ms.date: 10/31/2023
ms.author: greglin
---

# Header Rewrite for Azure Application Gateway for Containers - Gateway API (preview)

Application Gateway for Containers allows you to rewrite HTTP headers of client requests and responses from backend targets.


## Usage details

Header rewrites take advantage of [filters](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1beta1.HTTPURLRewriteFilter) as defined by Kubernetes Gateway API.

## Background
Header rewrites enable you to modify the request and response headers to and from your backend targets.

See the following figure, which illustrates an example of a request with a specific user agent being rewritten to a simplified value called SearchEngine-BingBot when the request is initiated to the backend target by Application Gateway for Containers:

[ ![A diagram showing the Application Gateway for Containers rewriting a request header to the backend.](./media/how-to-header-rewrite-gateway-api/header-rewrite.png) ](./media/how-to-header-rewrite-gateway-api/header-rewrite.png#lightbox)


## Prerequisites

> [!IMPORTANT]
> Application Gateway for Containers is currently in PREVIEW.<br>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

1. If following the BYO deployment strategy, ensure you have set up your Application Gateway for Containers resources and [ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md)
2. If following the ALB managed deployment strategy, ensure you have provisioned your [ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md) and provisioned the Application Gateway for Containers resources via the  [ApplicationLoadBalancer custom resource](quickstart-create-application-gateway-for-containers-managed-by-alb-controller.md).
3. Deploy sample HTTP application
  Apply the following deployment.yaml file on your cluster to create a sample web application to demonstrate the header rewrite.  
  ```bash
  kubectl apply -f https://trafficcontrollerdocs.blob.core.windows.net/examples/traffic-split-scenario/deployment.yaml
  ```
  
  This command creates the following on your cluster:
  - a namespace called `test-infra`
  - 2 services called `backend-v1` and `backend-v2` in the `test-infra` namespace
  - 2 deployments called `backend-v1` and `backend-v2` in the `test-infra` namespace

  - 
