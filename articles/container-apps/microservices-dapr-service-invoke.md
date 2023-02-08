---
title: "Microservices communication using Dapr Service Invocation"
description: Enable two sample Dapr applications to communicate and leverage Azure Container Apps.
author: hhunter-ms
ms.author: hannahhunter
ms.service: container-apps
ms.topic: how-to
ms.date: 02/06/2023
zone_pivot_group_filename: container-apps/dapr-zone-pivot-groups.json
zone_pivot_groups: dapr-languages-set
---

# Microservices communication using Dapr Service Invocation 

[Dapr](https://dapr.io/) (Distributed Application Runtime) is a runtime that helps you build resilient stateless and stateful microservices. While you can deploy and manage the Dapr OSS project yourself, deploying your Dapr applications to the Container Apps platform:

- Provides a managed and supported Dapr integration
- Seamlessly updates Dapr versions
- Exposes a simplified Dapr interaction model to increase developer productivity

In this tutorial, you'll create two microservices that communicate using [Dapr's Service Invocation API](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/service-invocation-overview/). The Service Invocation API enables your applications to communicate reliably and securely by leveraging auto-mTLS and built-in retries. You'll:
> [!div class="checklist"]
> * Use the Dapr CLI to locally run a microservice application that leverages the Dapr bindings APIs. 
> * Redeploy the same application using `azd up` to Azure Container Apps via the Azure Developer CLI. 

The sample Dapr bindings application:
1. Listens to input binding events from a system CRON component (a standard UNIX utility used to schedule commands for automatic execution at specific intervals). 
1. Outputs the contents of local data to a [PostgreSQL](https://www.postgresql.org/) component output binding.  

:::image type="content" source="media/microservices-dapr-azd/bindings-application.png" alt-text="Diagram of the Dapr binding application.":::

> [!NOTE]
> This tutorial uses [Azure Developer CLI (`azd`)](/developer/azure-developer-cli/overview.md), which is currently in preview. Preview features are available on a self-service, opt-in basis. Previews are provided "as is" and "as available," and they're excluded from the service-level agreements and limited warranty. The `azd` previews are partially covered by customer support on a best-effort basis.
## Prerequisites

- Install [Azure Developer CLI](/developer/azure-developer-cli/install-azd.md)
- [Install](https://docs.dapr.io/getting-started/install-dapr-cli/) and [init](https://docs.dapr.io/getting-started/install-dapr-selfhost/) Dapr
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install [Git](https://git-scm.com/downloads)

::: zone pivot="nodejs"
