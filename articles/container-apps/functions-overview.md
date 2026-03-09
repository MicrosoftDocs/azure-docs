---
title: Azure Functions on Azure Container Apps overview
description: Learn how Azure Functions works with autoscaling rules in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic:  how-to
ms.date: 04/07/2025
ms.author: cshoe
---

# Azure Functions on Azure Container Apps overview

Azure Functions on Azure Container Apps offers a fully managed serverless hosting environment that brings together the event-driven capabilities of Azure Functions with the robust features of Container Apps. This integration includes advanced capabilities such as Kubernetes-based orchestration, built-in autoscaling powered by KEDA (Kubernetes-based Event Driven Autoscaling), Dapr (Distributed Application Runtime) integration, GPU workload support, sidecar support, virtual network (VNet) connectivity, and revision management. 

This approach is useful when you want your Functions to run alongside other containerized apps like microservices, APIs, or websites. Further, containerizing your function apps can help when you need custom dependencies or want to take advantage of scale-to-zero for cost savings. If you're running compute-heavy tasks like AI inference, Container Apps also supports GPU-based hosting through serverless GPU offering and Dedicated workload profiles.

As an integrated feature on Azure Container Apps,  you can  deploy Azure Functions images directly onto Azure Container Apps using the `Microsoft.App` resource provider by setting `kind=functionapp` when calling `az containerapp create`. Apps created this way have access to all Azure Container Apps features. If deploying via Azure portal, you can enable the *Optimize for Functions app* option during setup. Refer to [deployment and setup](../container-apps/functions-overview.md#deployment-and-setup) section for more details.

## Key benefits
The Container Apps hosting model builds on the flexibility of containerized workloads and the event-driven nature of Azure Functions. It offers the following key advantages:
- **Run Azure Functions as containers** with custom dependencies and language stacks.
- **Scale in to zero and scale out to 1000 instances** using KEDA.
- **[Secure networking](../container-apps/networking.md)** with full [VNet integration](../container-apps/custom-virtual-networks.md).
- **Advanced [Container App features](../container-apps/overview.md#features)** like multi-revisions, traffic splitting, [Dapr integration](../container-apps/dapr-overview.md), and [observability components](../container-apps/observability.md).
- **[Serverless and Dedicated GPU](../container-apps/gpu-serverless-overview.md)** support for compute-intensive workloads.
- **Unified Container Apps environment** to run Functions alongside microservices, APIs, and background jobs.

The following table helps you compare the features of Functions on Container Apps with [Flex consumption plan](../azure-functions/flex-consumption-plan.md).

| Feature | Container Apps | Flex Consumption Plan |
| --- | --- | --- |
| Scale to zero | ✅ Yes (via KEDA) | ✅ Yes |
| Max scale-out | 1,000 (default 10, configurable) |	1,000 |
| Always-on instances | ✅ Yes (via `minReplicas`) | ✅ Yes (via always-ready instances) |
| VNet integration |	✅ Yes | ✅ Yes |
| Custom container support | ✅ Yes (bring your own image) | ❌ Limited (no bring your own container) |
| GPU support | ✅ Yes (via serverless GPU dedicated workload profile) | ❌ No |
| Built-in features | Container Apps feature support. For instance, KEDA, Dapr, multi-revisions, mTLS, sidecars, ingress control and more | Functions-only features |
| Billing model | Container Apps pricing: Consumption plan (vCPU, memory, requests) & Dedicated plan (workload profile based) | Execution-time + always-ready instances |

For a complete comparison of the Functions on Container Apps against Flex Consumption plan and all other plan and hosting types, see [Functions scale and hosting options](../azure-functions/functions-scale.md).

## Scenarios

Azure Functions on Container Apps are ideal for a wide range of use cases, especially when you need event-driven execution, container flexibility, or secure integration with other services:

- **Line-of-business APIs:** Package custom libraries, packages, and APIs with Azure Functions for line-of-business applications.
- **Migration and modernization:** Migration of on-premises legacy and/or monolith applications to cloud native microservices on containers.
- **Event-driven processing:** Handle events from Event Grid, Service Bus, Event Hubs, and other event sources with ease of Functions programming model.
- **AI & GPU workloads:** Serverless workload processing of videos, images, transcripts, or any other processing intensive tasks that required  GPU compute resources. For more information, see [Using serverless GPUs in Azure Container Apps](../container-apps/gpu-serverless-overview.md).
- **Microservices:** Integrate Azure Functions with other Container Apps hosted services.
- **Custom containers:** Package Functions with custom runtimes or sidecars.
- **Private apps:** Secure internal-only Functions using VNet and internal ingress.
- **.NET Aspire:** The integration of .NET Aspire with Azure Functions enables you to develop, debug, and orchestrate an Azure Functions .NET project as part of the .NET Aspire app host. Read more on [Azure Functions with .NET Aspire](../azure-functions/dotnet-aspire-integration.md)
- **General Functions:** Run any supported standard [Azure Functions scenarios](../azure-functions/functions-scenarios.md) (for example, timers, file processing, database triggers).

## Deployment and setup

To deploy Azure Functions on Azure Container Apps, you package your Functions app as a custom container image and deploy it like any other container app with one key difference. You need to set the `kind=functionapp` property when using the Azure CLI or ARM/Bicep templates. For detailed steps and examples, refer to the official [getting started documentation](../container-apps/functions-usage.md?pivots=azure-cli#create-a-functions-app-1).

```azurecli
az containerapp create \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $CONTAINER_APP_NAME \
  --environment $ENVIRONMENT_NAME \
  --image mcr.microsoft.com/k8se/quickstart-functions:latest \
  --ingress external \
  --target-port 80 \
  --kind functionapp \
  --query properties.outputs.fqdn
```
This command returns the URL of your Functions app. Copy this URL and paste it into a web browser.

In the Azure portal, select the *Optimize for Azure Functions* option during container app creation to streamline the setup.

:::image type="content" source="media/functions-overview/functions-create-container-app.png" alt-text="Screenshot of the Azure portal when you create a container app pre-configured for Azure Functions.":::

All standard deployment methods are supported, including:
- [Azure CLI](../container-apps/functions-usage.md?pivots=azure-cli)
- [Azure portal](../container-apps/functions-usage.md?pivots=azure-portal)
- ARM templates / [Bicep](https://github.com/Azure/azure-functions-on-container-apps/tree/main/samples/ACAKindfunctionapp)
- CI/CD pipelines (for example, GitHub Actions, Azure Pipelines)

For detailed steps and examples, refer to the official [getting started documentation](../container-apps/functions-usage.md).

## Pricing and billing
Azure Functions on Azure Container Apps follow the same pricing model as Azure Container Apps. Billing is based on the [plan type](../container-apps/plans.md) you select for your environment, which can be either Consumption or Dedicated.
- [Consumption plan](..//container-apps/billing.md#consumption-plan): This serverless compute option bills you only for the resources your apps use while they are running.
- [Dedicated plan](../container-apps/billing.md#consumption-dedicated): This option provides customized compute resources, billing you for the instances allocated to each workload profile.

Your choice of plan determines how billing calculations are made. Different applications within an environment can use different plans.

Key points to note:
- No extra charges for using the Azure Functions programming model within Container Apps.
- Durable Functions and other advanced patterns are supported and billed under the same Container Apps pricing model.
For detailed billing mechanics and examples, refer to the [Billing in Azure Container Apps](../container-apps/billing.md) documentation.

## Event-driven scaling

Azure Functions on Container Apps support all major [language runtimes available in Azure Functions](../azure-functions/supported-languages.md), including: C#, JavaScript / TypeScript (Node.js), Python, Java, PowerShell, Custom containers (bring your own image).

Azure Functions running on Azure Container Apps **automatically configure scaling rules** based on the event source, eliminating the need for manual KEDA scale rule definitions. That’s why the "Add scale rules" button on the Azure portal is disabled for Functions on Container Apps. However, you can still define minimum and maximum replica counts to establish scaling boundaries and maintain control over resource allocation.

The platform automatically translates your Functions trigger parameters (from `host.json` configuration or trigger attributes) into appropriate KEDA scaler parameters. For a detailed reference of how Functions trigger configurations map to KEDA scaling parameters, see [Azure Functions KEDA scaling mappings](functions-keda-mappings.md).

**All standard Azure Functions triggers and bindings are supported** in Container Apps with following **exceptions**:
- Blob Storage Trigger auto scaling: Only works when using Event Grid as the source. Learn more about [Triggering Azure Functions on blob containers using an event subscription](../azure-functions/functions-event-grid-blob-trigger.md)
- Durable Functions auto scaling: Only supports MSSQL (Microsoft SQL Server) and DTS (Durable Task Scheduler) storage providers. See more guidance on deploying [Durable functions with MSSQL](../azure-functions/durable/durable-functions-mssql-container-apps-hosting.md)
- Auto scaling not supported for:
  - Azure Cache for Redis  
  - Azure SQL

**Managed identities** are supported for triggers and bindings that allow it. They are also available for:
- [Default storage account](../azure-functions/functions-reference.md#connecting-to-host-storage-with-an-identity) (AzureWebJobsStorage)
- [Azure Container Registry](../container-apps/managed-identity-image-pull.md) (ACR)
- [Connecting to trigger event sources](../azure-functions/functions-reference.md#configure-an-identity-based-connection)

For unsupported triggers, use fixed replica counts (that is, set minReplicas > 0) in Azure Functions on Azure Container Apps. For more details, refer to the [Functions developer guide](../azure-functions/functions-reference.md).

## Scaling and performance

Azure Functions on Container Apps scale automatically based on events using KEDA, with no need to configure scale rules manually. You can still set min/max replicas to control scaling behavior.

- **Event-driven scaling**: Automatically scales based on triggers like Event Grid, Service Bus, or HTTP.
- **Scale to zero**: Idle apps scale-in to zero to save costs.
- **Cold start control**: Learn about [reducing cold-start time on Azure Container Apps](../container-apps/cold-start.md). 
- **Concurrency**: Each instance can process multiple events in parallel.
- **High scale**: Scale out to 1,000 instances per app (default is 10).
- **GPU support**: Run compute-heavy workloads like AI inference using GPU-backed nodes.

This makes Container Apps ideal for both bursty and steady-state workloads. To learn more, see [Set scaling rules in Azure Container Apps](../container-apps/scale-app.md)

## Networking and security

Azure Functions on Container Apps benefit from Container Apps’ robust [networking](../container-apps/networking.md) and [security features](../container-apps/security.md) for secure, scalable deployments:

- **VNet integration**: Access private resources securely via internal endpoints and private databases.
- **Managed identity**: Authenticate with Azure services using system/user-assigned identities—no secrets or connection strings needed.
- **Dapr support**: Enable pub/sub, state management, and secure service invocation via Dapr sidecars. For more information, see [Microservice APIs powered by Dapr](../container-apps/dapr-overview.md).
- **Ingress and TLS**: Expose secure HTTP endpoints with TLS/mTLS, custom domains, or keep them internal.
- **Environment Isolation**: Functions share Container Apps environment boundaries for secure, scoped communication.

These capabilities make Container Apps-hosted Functions ideal for enterprise-grade, secure serverless applications.

## Monitoring and logging

Azure Functions on Container Apps integrate seamlessly with Azure’s observability tools for performance tracking and issue diagnosis:

- **Application Insights:** Provides telemetry for requests, dependencies, exceptions, and custom traces. For more information, see [Monitor Azure Functions](../azure-functions/monitor-functions.md#application-insights).
- **Log analytics:** Captures container lifecycle and scaling events (for example, FunctionsScalerInfo entries). For more information, see [Application Logging in Azure Container Apps](../container-apps/logging.md).  
- **Custom logging:** Supports standard frameworks like ILogger and console logging for structured output.  
- **Centralized monitoring:** Container Apps environment offers unified dashboards and alerts across all apps.

## Considerations

Keep these other considerations in mind when using Azure Functions on Azure Container Apps:

- **Ingress Requirement for Auto-Scaling**: To enable automatic scaling based on events, [ingress must be enabled](../container-apps/ingress-how-to.md)—either publicly or within the Container Apps internal environment.
- **Mandatory Storage Account**: Every Functions app deployed on Container Apps must be linked to a storage account. This is required for managing triggers, logs, and state. Review the [storage account guidance](../azure-functions/storage-considerations.md) for best practices.
- **Multi-revision storage**: When deploying with multiple active revisions, assign a dedicated storage account to each revision. Using a dedicated storage account helps prevent conflicts and ensures proper isolation. Alternatively, if you do not require concurrent revisions, consider using the default single revision mode for simplified management.
- **Multi-revision triggers**: If you are using multi-revision mode with a pull-based trigger, use a different event source for each revision to avoid conflicts related to competing consumers. Functions that use Azure Queue Storage, Azure Event Hub, Azure Service Bus, or Durable Functions triggers are examples of pull-based triggers.
- **Cold start latency**: When your container app scales in to zero during idle periods, the first request after inactivity experiences a cold start. Learn more about [reducing cold start times](../container-apps/cold-start.md).
- **Application insights integration**: For robust monitoring and diagnostics, link your Functions app to Application Insights. For more information, see [App Insights integration with Functions](../azure-functions/configure-monitoring.md?tabs=v2#enable-application-insights-integration).
- **Functions proxies**: Not supported. For API gateway scenarios, integrate with Azure API Management instead.
- **Deployment slots**: Staging and production slots are not available. Use [blue-green deployment strategies](../container-apps/blue-green-deployment.md) for zero-downtime releases.
- **Functions access keys**: Using the portal to generate Functions access keys is not supported. Consider using [Azure Key Vault to store keys](https://techcommunity.microsoft.com/blog/appsonazureblog/how-to-store-function-apps-function-keys-in-a-key-vault/2639181). You can also use the following options to secure HTTP endpoints in production:
    - [Enable App Service Authentication/Authorization](../container-apps/authentication.md)
    - [Enable ingress](../container-apps/ingress-overview.md)
    - [Use Azure API Management (APIM) to authenticate requests](../azure-functions/security-concepts.md#use-azure-api-management-apim-to-authenticate-requests)
    - [Deploy your function app to a virtual network](../container-apps/custom-virtual-networks.md?tabs=workload-profiles-env)
- **Quota and resource limits**: Container Apps environments have default limits on memory, CPU, and instance counts per region. For more information, see the [environment limits](../container-apps/environment.md#limits-and-quotas) and [default quotas](../container-apps/quotas.md). If your workload requires more resources, you can [request a quota increase](../container-apps/quota-requests.md).
- **Manual scale rule configuration**: The "Add scale rules" button on the Azure portal is disabled for Azure Functions hosted on Container Apps because scaling rules are automatically configured based on the event source. Manual KEDA rule definitions are not required in this setup.

## Submit Feedback

Submit an issue or a feature request to the [Azure Container Apps GitHub repo](https://github.com/microsoft/azure-container-apps/issues).

## Next Steps / Further Resources

To continue learning and building with Azure Functions on Container Apps, explore the following resources:

- [Getting started](../container-apps/functions-usage.md) – Step-by-step guide to deploying and configuring Azure Functions in Azure Container Apps.
- [Azure Container Apps documentation](../container-apps/overview.md) – Full reference for Container Apps features including scaling, networking, Dapr, and workload profiles.
- [Azure Container Apps pricing](https://azure.microsoft.com/pricing/details/container-apps/) – Details on consumption-based billing and Dedicated plan costs.
- [Azure Functions hosting options](../azure-functions/functions-scale.md) – Comparison of hosting plans including Container Apps, Flex Consumption, Premium, and Dedicated.
- [Azure Functions developer guide](../azure-functions/functions-reference.md) – Deep dive into triggers, bindings, runtime behavior, and configuration.
  
