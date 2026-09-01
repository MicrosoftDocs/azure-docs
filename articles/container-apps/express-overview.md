---
title: Azure Container Apps Express Overview (preview)
description: Learn about Azure Container Apps express, a developer-first platform that lets you deploy containerized web apps to Azure with minimal configuration and rapid provisioning.
ms.topic: overview
ms.date: 08/27/2026
author: craigshoemaker
ms.author: cshoe
ms.service: azure-container-apps
ms.custom: references_regions
---

# Azure Container Apps express overview (preview)

Azure Container Apps express provides the fastest way to deploy containerized web applications to Azure. With opinionated defaults and a minimal configuration surface, express is a developer-first and agent-first platform designed to get your web apps running in the cloud as fast as possible.

By using express, you can create a container app directly without waiting for environment provisioning first. The rapid provisioning and scale-from-zero features make express an ideal host for AI-powered applications and agent backends.

:::image type="content" source="media/express-overview/azure-container-apps-express-welcome.png" alt-text="Screenshot of the Azure Container Apps express welcome screen.":::

## Key capabilities

The express deployment model removes infrastructure decisions so you can focus on building your application.

| Capability | Details |
|---|---|
| **High-speed launch** | Deploy in minutes with no infrastructure tuning required. Scaling behavior is built in from the start. |
| **Simple, powerful apps** | Run HTTP-first workloads including APIs, SaaS frontends, AI gateways, and event-driven web backends. |
| **Automatic elasticity** | Scale from zero to hyperscale automatically. The platform is designed for unpredictable traffic patterns, and scaling is handled for you. |
| **Scale from zero** | Your app scales down to zero when idle and back up on demand, so you only pay for what you use. |
| **High-speed startup** | Optimized cold start ensures your app is ready to serve traffic quickly. |
| **Opinionated defaults** | Sensible defaults are applied automatically so you don't have to configure infrastructure settings. |
| **Minimal configuration surface** | Fewer decisions to make means faster time to production. |
| **Developer velocity** | Spend less time on infrastructure and more time writing code. |

## Common scenarios

The express deployment model works best for HTTP web workloads where speed of deployment and simplicity matter most.

- **SaaS applications**: Launch SaaS products without worrying about scaling infrastructure.

- **AI app frontends**: Deploy AI-powered interfaces and gateways that scale with demand.

- **Developer tools**: Ship internal and external dev tools with zero-config deployment.

- **Web dashboards**: Build internal analytics, monitoring, and admin panels with instant availability.

- **Startups and new projects**: Go from idea to production in minutes. Prototype fast, and scale as you grow.

- **Rapid prototyping**: Build and validate ideas quickly, then keep running in production without replatforming.

## How express works

The express deployment model simplifies the deployment experience by removing the need to manage a Container Apps environment. You deploy your app and the platform provisions the underlying resources for you.

- **Less environment details to manage**: When using the portal, the platform creates a light-weight environment for your app. If working from the CLI, you still create an environment yourself.

- **Consumption-based compute**: Express apps run on consumption CPU with pay-as-you-go pricing. Your apps scale to zero when idle, so you only pay for the compute your app uses.

- **Opinionated defaults**: The platform handles configuration decisions like scaling rules, networking, and resource allocation with production-ready defaults.

- **Request-driven duration**: Compute runs when your app receives requests and scales down when traffic stops.

- **Optimized cold start**: The platform automatically optimizes cold-start behavior, so your app is ready to serve traffic quickly after scaling from zero.

- **Specialized management UI**: Express apps are managed [through a UI experience](https://containerapps.azure.com/) separate from the Azure portal. When you create or manage an express app, the platform directs you to this streamlined interface instead of the standard Azure portal experience.

    :::image type="content" source="media/express-overview/azure-container-apps-express-create.png" alt-text="Screenshot of Azure Container Apps express create experience.":::

## When to use express

Use the following table to determine if express is the right fit for your workload.

| Scenario | Use express | Alternative |
|---|---|---|
| Web apps and REST APIs | ✅ Yes | |
| SaaS frontends and AI gateways | ✅ Yes | |
| Rapid prototyping and startups | ✅ Yes | |
| Web dashboards and admin panels | ✅ Yes | |
| GPU workloads | ❌ No | Use [serverless GPUs](gpu-serverless-overview.md) with dedicated workload profiles |
| TCP services | ❌ No | Use [Workload Profile Container Apps environments](environment.md) |
| Jobs and batch processing | ❌ No | Use [Container Apps jobs](jobs.md) |
| Microservices with service discovery | ❌ No | Use [Workload Profile Container Apps environments](environment.md) |

## Considerations

Keep these important points in mind when using express:

- **Ingress protocols**: Express supports HTTP ingress. It doesn't support HTTP/2, TCP, insecure HTTP, additional ingress ports, or target port auto-detection (`targetPort: 0`).

- **Consumption CPU compute**: Express apps run on consumption-based CPU compute. GPU workloads require [Consumption GPU Workload Profiles](gpu-serverless-overview.md).

- **Opinionated configuration**: The express model uses opinionated defaults with a minimal configuration surface. If you need fine-grained control over compute, networking, or cold-start behavior, use standard Container Apps with a [workload profiles environment](environment.md).

- **Focused networking**: Express supports internal or external ingress, IP restrictions, CORS, virtual network egress, and environment private endpoints. For virtual network egress, use either an environment-level subnet or an app-level outbound subnet. An app-level subnet can't be combined with an environment-level virtual network, can only be shared by apps in the same environment, and can't be changed or removed after it's set. Custom domains, client certificates, session affinity, and built-in service discovery aren't yet supported.

- **Feature availability**: Express offers a focused set of Container Apps capabilities. User-assigned managed identities, HTTP, CPU, and memory scale rules, `EmptyDir` volume mounts, and custom ephemeral storage are available with the limitations described in the following table. Dapr, jobs, workload profiles, and system-assigned managed identities aren't yet supported.

## Supported features

Express provides a streamlined set of Azure Container Apps capabilities. Each feature falls into one of three availability states:

- ✅ **Supported**: Works directly in Express.
- ⚠️ **Use case supported**: The main scenario works, but some options aren't available.
- ❌ **Not supported**: Not available in Express.

### Available capabilities

| Feature | Availability |
|---|---|
| [Scale to zero](scale-app.md) | ✅ Supported |
| [Container image deployment](containers.md) | ✅ Supported: Public images and private images authenticated with username and password secrets |
| [Multiple replicas](scale-app.md) | ✅ Supported |
| [Environment variables](environment-variables.md) | ✅ Supported: Literal values and references to manual secrets |
| [HTTP ingress](ingress-overview.md#http) | ✅ Supported: Target port auto-detection isn't supported |
| [Default ingress domain](ingress-overview.md#domain-names) | ✅ Supported: Microsoft-managed `azurecontainerapps.io` domain |
| [Express management experience](#how-express-works) | ✅ Supported: Streamlined experience for creating and managing Express apps |
| [Log streaming](log-streaming.md) | ✅ Supported: Live, per-container log streams |
| [Regional availability](#region-availability) | ✅ Supported in the regions listed below |
| Start and stop apps | ✅ Supported |
| [Consumption-based billing](billing.md) | ✅ Supported: Usage-based billing |
| [Rolling updates](revisions.md#zero-downtime-deployment) | ⚠️ Use case supported: Updates replace the active revision automatically. Traffic splitting isn't supported. |
| [IP restrictions](ip-restrictions.md) | ✅ Supported: Allow or deny traffic by CIDR range |
| [Console access](container-console.md) | ✅ Supported: Browser-based, per-container console |
| [Internal and external ingress](ingress-overview.md#external-and-internal-ingress) | ✅ Supported |
| [Single-revision deployment](revisions.md#revision-modes) | ✅ Supported: Built in |
| [App-to-app communication](connect-apps.md) | ⚠️ Use case supported: Apps can communicate using their public app URLs. Internal service discovery isn't supported. |
| [Manual secrets](manage-secrets.md) | ⚠️ Use case supported: Add secrets directly to the app. Key Vault references aren't supported. |
| [Metrics (Azure Monitor)](metrics.md) | ✅ Supported in the app overview and environment dashboard |
| [Logs (Log Analytics)](log-monitoring.md) | ⚠️ Use case supported: Logs can be sent to Log Analytics when it's enabled for the Express environment. |
| [Autoscaling](scale-app.md) | ⚠️ Use case supported: Apps can scale on HTTP traffic, CPU, or memory. Authenticated scaling rules aren't supported. |
| [User-assigned managed identity for app runtime](managed-identity.md) | ⚠️ Use case supported: Apps can use user-assigned managed identities. System-assigned managed identities aren't supported. |
| [User-assigned managed identity for image pulls](managed-identity-image-pull.md) | ⚠️ Use case supported: Apps can use a user-assigned identity to pull images from supported Azure Container Registry servers. |
| [Virtual network integration](custom-virtual-networks.md) | ⚠️ Use case supported: Apps can send outbound traffic through either an environment subnet or an app subnet. App-level networking has the limitations described previously. |
| [Volume mounts](storage-mounts.md) | ⚠️ Use case supported: Apps can mount up to 10 `EmptyDir` volumes, with up to 10 mounts per container. Other volume types and `subPath` aren't supported. |
| [Ephemeral storage](storage-mounts.md#ephemeral-storage) | ⚠️ Use case supported: Apps can use ephemeral storage. Combined container and `EmptyDir` storage must not exceed 40 GiB per replica. |
| [Express environment quotas](quotas.md) | ✅ Supported: Regional and global Express environment limits apply |
| [Health probes](health-probes.md) | ⚠️ Use case supported: Apps can use HTTP and TCP health probes. Exec-based probes aren't supported. |
| [CORS](cors.md) | ⚠️ Use case supported: CORS is available, except for exposed response headers. |
| [Private endpoints](how-to-use-private-endpoint.md) | ⚠️ Use case supported: Express environments can use a private endpoint when public network access is disabled. |

### Not supported

Express doesn't support the following capabilities:

- [Sidecar containers](containers.md#sidecar-containers)
- [Init containers](containers.md#init-containers)
- [Insecure HTTP ingress](ingress-how-to.md)
- [TCP ingress](ingress-overview.md#tcp)
- [Debug console](container-debug-console.md)
- [Key Vault secret references](manage-secrets.md#reference-secret-from-key-vault)
- [Easy Auth](authentication.md)
- [Custom domains with managed certificates](custom-domains-managed-certificates.md)
- [Custom domains with customer-provided certificates](custom-domains-certificates.md)
- [Environment custom domain suffix with a customer-provided certificate](environment-custom-dns-suffix.md)
- [Environment custom domain suffix with a managed certificate](environment-custom-dns-suffix.md)
- [Client certificates](client-certificate-authorization.md)
- [Azure Monitor logging](log-options.md)
- [Session affinity](sticky-sessions.md)
- [Azure Files storage](storage-mounts-azure-files.md)
- [GPU](gpu-serverless-overview.md)
- [Additional ingress ports](ingress-overview.md#additional-tcp-ports)
- [Dapr](dapr-overview.md)
- [Deployment labels](deployment-labels.md)
- Language stack configuration
- [Multiple revisions and traffic splitting](revisions.md)
- [Resiliency](service-discovery-resiliency.md)
- [Source-to-cloud deployment](code-to-cloud-options.md)
- Aspire
- [Maintenance windows](planned-maintenance.md)
- [OpenTelemetry](opentelemetry-agents.md)
- [Premium ingress](premium-ingress.md)
- [Workload profiles](workload-profiles-overview.md)
- [Peer-to-peer traffic encryption](ingress-environment-configuration.md#peer-to-peer-encryption)
- [Container Apps jobs](jobs.md)
- [Zone redundancy](how-to-zone-redundancy.md)

## Region availability

During public preview, Express is available in the following Azure regions:

- Australia East
- Austria East
- Brazil South
- Canada Central
- Canada East
- Central India
- Central US
- Chile Central
- East Asia
- East US
- East US 2
- East US 2 EUAP
- France Central
- Germany West Central
- Indonesia Central
- Italy North
- Japan East
- Japan West
- Jio India Central
- Korea Central
- Malaysia West
- Mexico Central
- New Zealand North
- North Central US
- North Europe
- Norway East
- Poland Central
- South Africa North
- South Central US
- South India
- Southeast Asia
- Spain Central
- Sweden Central
- Switzerland North
- Switzerland West
- UAE North
- UK South
- UK West
- West Central US
- West Europe
- West US
- West US 2
- West US 3

## Next steps

> [!div class="nextstepaction"]
> [Deploy an express container app using the Azure CLI](deploy-express-cli.md)
