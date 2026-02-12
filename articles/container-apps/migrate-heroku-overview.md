---
title: Heroku to Azure Container Apps overview
description: Plan your migration from Heroku to Azure Container Apps with concept mapping, service equivalents, cost comparison, and pitfalls to avoid.
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 02/12/2026
ms.author: simonjakesch
author: simonjj
ms.reviewer: cshoe
ms.custom: migration-heroku
ms.ai-usage: ai-assisted
---

# Heroku to Azure Container Apps migration overview

If you're moving from Heroku to Azure Container Apps, this guide helps you plan the migration by mapping the Heroku concepts you already know to their Azure equivalents. Use this article to assess the scope of your migration, identify the Azure services you need, and avoid common pitfalls before you start.

For step-by-step migration procedures, see [Migrate an app from Heroku to Azure Container Apps](migrate-heroku.md).

## Concept mapping

The following table maps core Heroku platform features to their Azure Container Apps equivalents.

| Heroku concept | Azure Container Apps equivalent | Notes |
| --- | --- | --- |
| App (web dyno) | [Container App](/azure/container-apps/overview) | A single deployable unit running your application code. |
| Dyno types + manual scaling | [KEDA-based autoscaling](/azure/container-apps/scale-app) | Rule-based autoscaling that includes scale-to-zero. Replaces manual dyno count management. |
| Buildpacks (slug compilation) | Container images or [Cloud Native Buildpacks](/azure/container-apps/containerapp-up) | Use `az containerapp up --source` for a buildpack-like experience, or bring your own Dockerfile. |
| Config Vars | [Environment variables](/azure/container-apps/environment-variables) + [Azure Key Vault](/azure/key-vault/general/overview) | Nonsensitive values use environment variables. Secrets use Key Vault references or Container Apps secrets. |
| Add-ons (Postgres, Redis, etc.) | Azure managed services | See [Service equivalents](#service-equivalents) for a full mapping. |
| `heroku` CLI | [`az containerapp` CLI](/cli/azure/containerapp) | Azure CLI with the `containerapp` extension provides equivalent management commands. |
| Heroku Pipelines / Review Apps | [GitHub Actions](/azure/container-apps/github-actions) or [Azure Pipelines](/azure/container-apps/azure-pipelines) | CI/CD pipelines you configure and own. |
| One-off dynos (`heroku run`) | [Container Apps jobs](/azure/container-apps/jobs) | On-demand or scheduled execution without a long-running app. |
| Procfile (process types) | Separate Container Apps per process type | Deploy your web and worker processes as independent Container Apps within the same environment. |
| Custom domain + ACM | [Custom domain + free managed certificate](/azure/container-apps/custom-domains-managed-certificates) | Managed certificates are free and autorenew. |

## Service equivalents

When you migrate from Heroku, replace Heroku add-ons with Azure managed services. The following table maps common add-ons to their Azure equivalents.

| Heroku add-on | Azure equivalent | Migration complexity |
| --- | --- | --- |
| Heroku Postgres | [Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/overview) | Medium: requires data export and restore. |
| Heroku Redis | [Azure Cache for Redis](/azure/azure-cache-for-redis/cache-overview) | Low: typically no data migration needed (cache-only use). |
| Heroku Scheduler | [Container Apps jobs](/azure/container-apps/jobs) (scheduled type) | Low — recreate cron expressions as job schedules. |
| Papertrail / Logentries | [Azure Monitor + Log Analytics](/azure/azure-monitor/overview) | Low — logging is built in to Container Apps. |
| New Relic | [Azure Application Insights](/azure/azure-monitor/app/app-insights-overview) | Medium — requires SDK or auto-instrumentation changes. |
| SendGrid | [SendGrid via Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/sendgrid.tsg-saas-offer) or [Azure Communication Services](/azure/communication-services/overview) | Low — SendGrid continues to work from Azure; update connection details only. |
| CloudAMQP (RabbitMQ) | [Azure Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) | High — different messaging API; requires code changes. |
| Heroku Kafka | [Azure Event Hubs](/azure/event-hubs/event-hubs-about) (Kafka-compatible endpoint) | Low — Event Hubs supports the Kafka protocol directly. |
| Bucketeer / S3 add-ons | [Azure Blob Storage](/azure/storage/blobs/storage-blobs-overview) | Medium — requires SDK or API changes for file operations. |
| Memcachier | [Azure Cache for Redis](/azure/azure-cache-for-redis/cache-overview) | Low — Redis supports memcache-compatible protocols. |
| Heroku Connect (Salesforce) | [Azure Logic Apps](/azure/logic-apps/logic-apps-overview) or Power Automate | High — different integration approach; requires workflow redesign. |

For each add-on in your Heroku app, follow this general pattern:

1. Provision the Azure equivalent service.
1. Migrate any persistent data (databases, storage).
1. Update connection strings and credentials in your Container App environment variables.
1. Validate the integration before removing the Heroku add-on.

## Scaling comparison

Heroku uses a fixed-dyno model where you set a specific instance count. Azure Container Apps uses rule-based autoscaling powered by [KEDA](https://keda.sh), which adjusts replicas based on demand.

| Capability | Heroku | Azure Container Apps |
| --- | --- | --- |
| Scale mechanism | Manual dyno count | Rule-based autoscaling (HTTP, CPU, queue length, cron, custom) |
| Scale to zero | Not available | Supported - no cost when idle |
| Minimum instances | At least 1 dyno required | Configurable: 0 or more replicas |
| Maximum instances | Plan-dependent | Up to 300 replicas per container app |
| Scale triggers | None - manual only | HTTP concurrency, TCP connections, CPU, memory, Azure Queue, custom KEDA scalers |

### Key scaling concepts

- **`min-replicas: 0`** enables scale-to-zero when no traffic is present, which eliminates cost for idle apps.
- **`max-replicas`** caps the number of instances to control costs. Start conservatively and adjust based on monitoring data.
- **HTTP concurrency scaling** is the simplest starting point for web apps. It adds replicas when concurrent requests per instance exceed your threshold.
- **Queue-based scaling** is ideal for worker processes. Deploy workers as separate Container Apps that scale based on queue depth.

> [!TIP]
> For production apps that must always be ready, set `min-replicas` to `1`. For development and staging environments, use `min-replicas: 0` to save costs.

## Cost comparison

| Scenario | Heroku (Standard-1X) | Azure Container Apps (Consumption) |
| --- | --- | --- |
| Idle app (24/7) | ~ $25/month per dyno | $0 (scaled to zero) |
| Low-traffic app | ~ $25/month per dyno | ~ $1–5/month |
| High-traffic app (10 instances) | ~ $250/month | Varies by actual CPU and memory use |
| Monthly free grant | None | 180,000 vCPU-seconds + 2 million requests |

For detailed pricing, see [Azure Container Apps pricing](https://azure.microsoft.com/pricing/details/container-apps/).

## Workers and background jobs

If your Heroku app uses worker dynos (defined in a `Procfile`), deploy each worker type as a separate Container App within the same environment. Use queue-based scaling instead of a fixed instance count.

| Heroku pattern | Azure Container Apps pattern |
| --- | --- |
| `web` process type | Container App with HTTP ingress and HTTP-based scaling |
| `worker` process type | Container App (no ingress) with queue-based scaling |
| Scheduled tasks (Heroku Scheduler) | [Container Apps job](/azure/container-apps/jobs) with a cron schedule |
| One-off tasks (`heroku run`) | [Container Apps job](/azure/container-apps/jobs) with manual trigger |

## Common pitfalls

Review these common issues before and during your migration to avoid delays.

| Pitfall | Symptom | Resolution |
| --- | --- | --- |
| **PORT environment variable** | App doesn't respond to requests. | Container Apps sets a `PORT` variable and expects your app to listen on it. If you hardcode a port, set `--target-port` to match when creating the container app. Most Heroku apps already read `PORT` from the environment and work without changes. |
| **Ephemeral filesystem** | Files written at runtime disappear after restarts. | Like Heroku, Container Apps uses an ephemeral filesystem. For persistent files, [mount an Azure Files share](/azure/container-apps/storage-mounts). |
| **Scaling misconfiguration** | Unexpected costs or poor performance under load. | Start with HTTP concurrency scaling for web apps and monitor with Azure Monitor. Avoid setting `max-replicas` too high before you understand your app's resource consumption. |
| **Environment parity** | Configuration drift between dev, staging, and production. | Use infrastructure as code ([Bicep](/azure/azure-resource-manager/bicep/overview) or [Terraform](/azure/developer/terraform/overview)) to keep environments consistent. This approach replaces the consistency Heroku Pipelines provided. |
| **Third-party services** | Unnecessary migration work for SaaS add-ons. | Many Heroku add-ons are standalone SaaS products (SendGrid, MongoDB Atlas, Elasticsearch). These services often continue to work from Container Apps — update the connection URL only. Only Heroku-managed services (Heroku Postgres, Heroku Redis, Heroku Kafka) require migration to Azure equivalents. |
| **Cloud Build availability** | `az containerapp up --source` fails with `ManagedEnvironmentNotFound` or builder errors. | Cloud Build isn't available in all regions or for all language stacks. Fall back to the ACR-based approach: create a Dockerfile, build with `az acr build`, and deploy the image. See [Migrate an app from Heroku](migrate-heroku.md#3---deploy-your-app) for both approaches. |
| **Secrets and env vars ordering** | Environment variables referencing secrets resolve as empty. | Set secrets with `az containerapp secret set` *before* referencing them in environment variables. Also note that setting secrets alone doesn't restart the app — you need `az containerapp update` to create a new revision. |
| **Azure service provisioning times** | Migration takes longer than expected. | Azure managed services take longer to provision than Heroku add-ons. Azure Cache for Redis can take 10–20 minutes; Azure Database for PostgreSQL can take 5–10 minutes. Provision these services in parallel while deploying your app. |

## Next step

> [!div class="nextstepaction"]
> [Migrate an app from Heroku to Azure Container Apps](migrate-heroku.md)
