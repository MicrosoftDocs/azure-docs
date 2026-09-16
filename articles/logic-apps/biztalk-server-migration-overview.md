---
title: Why Move from BizTalk Server to Azure Logic Apps Standard?
description: Learn why and how to move from BizTalk Server to Azure Logic Apps Standard in Azure or on customer-managed infrastructure.
services: logic-apps
ms.service: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewer: estfan, azla
ms.topic: concept-article
ms.date: 09/13/2026
# Customer intent: As a BizTalk Server customer, I want to understand why I should migrate to Azure Logic Apps Standard and which hosting option fits my requirements.
---

# Why migrate from BizTalk Server to Azure Logic Apps Standard?

Azure Logic Apps is the successor to BizTalk Server. Azure Logic Apps Standard provides workflow orchestration, enterprise integration, and extensibility for cloud and hybrid solutions. This article summarizes the reasons to migrate, the available hosting options, and the BizTalk capabilities that you need to assess.

For migration strategies, planning considerations, and delivery guidance, see [Migrate BizTalk Server with Azure Logic Apps Migration Agent](biztalk-server-migration-approaches.md).

## BizTalk Server lifecycle

BizTalk Server 2020 is the final release of BizTalk Server. Microsoft expects sales of BizTalk Server 2020 to end on March 31, 2027. Mainstream support continues through April 12, 2028, after which the product remains subject to the Microsoft Fixed Lifecycle Policy.

Microsoft also plans to offer eligible customers optional, paid extended-mainstream support from April 13, 2028, through April 10, 2030. This offering is intended as temporary migration coverage, is expected to exclude some BizTalk capabilities, and remains subject to final eligibility, coverage, pricing, and purchasing terms.

Start migration planning early, especially if your solutions depend on Business Activity Monitoring (BAM), the Enterprise Service Bus (ESB) Toolkit, industry accelerators, legacy enterprise adapters, BizTalk-specific application lifecycle management tooling, or Visual Studio versions after Visual Studio 2022. These capabilities are expected to be excluded from paid extended-mainstream support or might require redesign.

For the latest dates and terms, see:

- [Microsoft BizTalk Server product lifecycle update](https://techcommunity.microsoft.com/blog/integrationsonazureblog/microsoft-biztalk-server-product-lifecycle-update/4478559)
- [BizTalk Server 2020 end-of-sale announcement](https://techcommunity.microsoft.com/blog/integrationsonazureblog/biztalk-server-2020-end-of-sale-announcement/4551317)
- [Microsoft Fixed Lifecycle Policy](/lifecycle/policies/fixed)

## Why Logic Apps Standard fits BizTalk workloads

BizTalk applications commonly combine durable orchestration, messaging, transformations, business-to-business (B2B) processing, custom code, and access to private systems. Azure Logic Apps Standard provides these integration capabilities in a single-tenant runtime and supports both stateful and stateless workflows. Unlike a Consumption logic app, a Standard logic app can contain multiple workflows that share compute, storage, networking, and configuration.

The following capabilities make Standard the preferred Logic Apps resource type for most BizTalk modernization projects:

| BizTalk requirement | Logic Apps Standard capability |
| --- | --- |
| Durable, long-running business processes | Stateful workflows persist run state and can recover interrupted runs. Stateless workflows support lower-latency, in-memory processing when persistence isn't required. |
| Related integration processes | Multiple workflows can run in one Standard logic app and share resources, configuration, and deployment boundaries. |
| Enterprise messaging and data formats | Built-in connectors and actions support services such as Azure Service Bus, Event Hubs, SQL Server, XML, flat files, transformations, and B2B scenarios. |
| Custom implementation logic | .NET local functions run workflow-scoped code alongside workflows in the same project and application boundary. Inline scripts, custom built-in connectors, and external services provide other extensibility options. |
| Private and local connectivity | Dedicated single-tenant execution supports virtual network integration and private endpoints. Hybrid deployment runs workflows on customer-managed infrastructure when local processing is required. |
| Application lifecycle management | Visual Studio Code development, local testing, infrastructure as code, and CI/CD separate workflow application deployment from infrastructure provisioning. |
| Deployment choice | Use Workflow Service Plan for managed Azure hosting, App Service Environment v3 for isolated Azure hosting, or Hybrid for customer-managed Kubernetes environments. |

Logic Apps Standard provides most of the core capabilities needed to modernize BizTalk solutions and serves as the primary orchestration and integration platform for the target architecture, whether hosted in Azure or deployed in a hybrid environment. Other services aren't required by default. For Azure-hosted solutions, add Azure services such as Azure Service Bus, Azure API Management, or Azure Event Grid only when the refactored solution requires independent message brokering, API lifecycle management, or event distribution. For hybrid deployments, use compatible customer-managed services for any capabilities or architectural boundaries that the solution requires outside Logic Apps Standard.

## Reasons to migrate

| Benefit | Description |
| --- | --- |
| Modern integration platform | Build workflows with managed orchestration, enterprise connectors, B2B capabilities, API integration, and cloud-native security and monitoring. Evaluate AI-assisted and agentic automation where supported. |
| Preserve selected investments | Reuse or adapt many BizTalk schemas, maps, rules, assemblies, and custom .NET components rather than rebuilding every artifact. |
| Flexible hosting | Run Standard workflows in Azure or use hybrid deployment for local processing, network access, data residency, or regulatory requirements. |
| Low-code and pro-code development | Combine the visual workflow designer with source-controlled workflow definitions, inline scripts, .NET local functions, custom connectors, and external services. |
| Modern operations | Use Azure role-based access control (Azure RBAC), infrastructure as code, and automated pipelines. Azure-hosted workflows integrate with Azure Monitor and Application Insights, while hybrid deployments use OpenTelemetry and have different feature limitations. |
| Cost controls | Share capacity across related workflows, choose a hosting model that matches workload demand, and use built-in operations and local functions as possible. |

## Build a cost-effective target architecture

Cost-effectiveness depends on workload volume, required isolation, existing infrastructure, connector usage, and operational responsibilities. Compare total cost of ownership rather than only the Logic Apps hosting charge. A BizTalk baseline can include BizTalk Server, Windows Server, and SQL Server licenses; compute and storage; high availability and disaster recovery; patching; monitoring; deployment tooling; and specialist operational support.

Use the following practices when you build the target cost model:

- Group related workflows with compatible security, lifecycle, and scaling requirements in the same Standard logic app so they can share reserved compute and supporting resources. Keep workloads separate when they need independent scaling, isolation, deployment, or ownership.
- Prefer built-in connector operations when they meet your requirements. The Standard model includes unlimited built-in operation executions, while managed connector operations are billed per call.
- Keep workflow-scoped .NET code in local functions when appropriate. Local functions use the Logic Apps Standard application boundary and don't require a separate Function App, endpoint, authentication flow, deployment pipeline, or monitoring boundary. The code still consumes capacity in the Standard plan.
- Right-size Workflow Service Plan capacity and review utilization as migration waves move into production. The plan is billed for reserved capacity even when workflows are idle.
- Use App Service Environment v3 when isolation, dedicated networking, compliance, or consolidation requirements justify an Isolated v2 App Service Plan. Don't assume that ASE v3 is the lowest-cost option for smaller workloads.
- Use Hybrid when local execution, data residency, or existing infrastructure provides sufficient value. Include the Azure Arc-enabled Kubernetes environment, SQL Server licensing, SMB storage, networking, operations, and Logic Apps vCPU usage in the calculation.
- Account for storage operations, integration accounts, networking, monitoring, and the temporary cost of running BizTalk and Logic Apps in parallel during migration.

For pricing details, see [Azure Logic Apps pricing and billing models](logic-apps-pricing.md) and the [Azure Logic Apps pricing page](https://azure.microsoft.com/pricing/details/logic-apps/).

## Choose a hosting option

Azure Logic Apps has separate Consumption and Standard resource types. For BizTalk migration, use Azure Logic Apps Standard capabilities and choose an Azure-hosted or hybrid hosting option based on your requirements.


| Hosting option | Best fit | Cost and ownership | Key considerations |
| --- | --- | --- | --- |
| Workflow Service Plan | The default choice for Azure-hosted BizTalk migrations that need dedicated Standard capacity and managed Azure capabilities. | Reserved WS1, WS2, or WS3 capacity in a Microsoft-managed environment. | Supports multiple workflows per logic app, virtual network integration, private endpoints, and access to Azure monitoring capabilities. |
| App Service Environment v3 | Workloads that require isolated Azure hosting, dedicated networking, compliance boundaries, or consolidation with other App Service workloads. | Isolated v2 App Service Plan instances in a dedicated environment. | Requires an existing or new ASE v3 and should be justified by isolation, scale, or consolidation requirements. |
| Hybrid | Workloads that require local processing, low-latency access to local systems, data residency, edge placement, or customer-managed infrastructure. | Logic Apps vCPU usage plus customer-managed Kubernetes, SQL Server, SMB storage, networking, and operations. | Uses Azure Arc-enabled Kubernetes with the Azure Container Apps extension and requires outbound Azure connectivity. Some cloud capabilities aren't supported. |

### Hybrid deployment considerations

Hybrid deployment is partially connected, not air-gapped. The environment requires outbound connectivity for Azure Arc and Azure management operations. Cloud-hosted managed connectors also require connectivity to Azure. Temporary connectivity interruptions don't necessarily stop local workflow processing, but can affect management, telemetry, and cloud-dependent operations.

For required infrastructure, supported configurations, pricing, and current limitations, see [Set up your own infrastructure for Standard logic apps using hybrid deployment](set-up-standard-workflows-hybrid-deployment-requirements.md).

## Map BizTalk capabilities to Logic Apps

BizTalk Server and Azure Logic Apps use different architectures. Use the Migration Agent to inventory each BizTalk application, map its artifacts and integration patterns to Logic Apps capabilities, and identify components that you need to reuse, refactor, replace, or redesign.

| BizTalk capability | Logic Apps modernization path | Typical assessment |
| --- | --- | --- |
| Orchestrations | Stateful or stateless Standard workflows | Refactor business process logic into workflows. |
| Pipelines and helper code | Workflow actions, .NET local functions, inline code, custom connectors, or external services | Reuse or refactor according to the required lifecycle and scale boundary. |
| MessageBox routing | Azure Service Bus topics and subscriptions, RabbitMQ exchanges, Apache Kafka topics, or workflow routing | Redesign messaging independently from the workflow runtime. |
| Schemas and maps | Project artifacts, XSLT maps, Liquid templates, and Data Mapper | Reuse compatible artifacts and validate transformations. |
| Business rules | Azure Logic Apps Rules Engine | Reuse supported BizTalk Business Rules Engine policies or refactor unsupported facts. |
| EDI and B2B | Standard workflows, connectors, and integration accounts | Assess partners, agreements, certificates, schemas, and protocol requirements. |
| Adapters | Built-in, managed, or custom connectors and APIs | Confirm connector availability, authentication, throughput, and hosting support. |
| BAM | Azure Business Process Tracking for supported Azure-hosted solutions, or an external observability design | Redesign for hybrid deployment, where Azure Business Process Tracking isn't supported. |
| Tracking and monitoring | Run history, tracked properties, Azure Monitor, Application Insights, and OpenTelemetry | Refactor the operational and support model. |

The following diagram provides another view of common BizTalk Server capabilities and their Azure-hosted modernization paths:

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/enterprise-integration-platform.png" alt-text="Diagram that maps common BizTalk Server capabilities to Azure Logic Apps Standard, Azure Service Bus, Azure API Management, and other Azure services." border="false":::

For detailed feature availability, see [Azure Logic Apps connectors](/connectors/connector-reference/connector-reference-logicapps-connectors), [Enterprise integration overview](logic-apps-enterprise-integration-overview.md), and [Azure Logic Apps limits and configuration](logic-apps-limits-and-config.md).

## Key migration considerations

### Architecture and reliability

- Start with Azure Logic Apps Standard as the target application. Use native workflow capabilities, built-in connectors, and local functions where appropriate, and add other Azure Integration Services only when a specific architectural requirement justifies them.
- For publish-subscribe patterns, use a message broker such as Azure Service Bus, RabbitMQ, or Apache Kafka rather than reproducing the BizTalk MessageBox inside a workflow.
- Design for retries and at-least-once processing. Use idempotency, deduplication, and safe writes to prevent duplicate effects when operations are retried or runs are resubmitted.
- Review message and connector limits. For large payloads, use connector chunking where supported or implement the [claim-check pattern](/azure/architecture/patterns/claim-check).
- Use VPN Gateway, ExpressRoute, or another hybrid connectivity design to connect on-premises networks to Azure. Virtual network peering connects Azure virtual networks; it doesn't by itself connect an on-premises network to Azure.

### Custom code

Having custom code in a BizTalk solution doesn't automatically mean that the target architecture requires a separate Azure Functions resource. Use [.NET local functions](create-run-custom-code-functions.md) for code that belongs to an integration workflow. Local functions reside in the same project as the workflows and run within the Logic Apps Standard application boundary. The workflows, connectors, configuration, and code can build, deploy, scale, and operate together.

Local functions are suitable for workflow-scoped message validation, enrichment, calculations, custom parsing, formatting, and business-specific processing. They can also help modernize BizTalk helper assemblies, orchestration utilities, and pipeline-adjacent logic when that code belongs to a specific integration application. This approach avoids introducing a separate endpoint, authentication flow, hosting resource, deployment pipeline, and monitoring boundary only to run workflow-specific code.

Use the following guidance to select the appropriate code-hosting model:

| Use local functions when | Use a separate Azure Functions resource when |
| --- | --- |
| The code is specific to one Logic Apps Standard application. | The code is shared by multiple applications, workflows, or teams. |
| The code validates, enriches, parses, formats, or calculates data within a workflow. | The code provides an independently managed API, service, or event-driven compute capability. |
| The workflow and code should deploy, scale, and operate together. | The code requires independent scaling, versioning, deployment, or operational ownership. |
| The code doesn't need a separate network endpoint or authentication boundary. | The code must expose and secure its own endpoint or identity boundary. |
| BizTalk helper or pipeline-adjacent logic belongs to the migrated integration flow. | The code is the primary compute workload and the Logic Apps workflow is only one consumer. |

Local functions consume the compute capacity assigned to the Standard logic app and aren't a replacement for every standalone function or service. Their cost and operational advantage comes from avoiding an unnecessary resource boundary when the code is part of the workflow. Standard workflows also support inline JavaScript, C#, and PowerShell for short-running code, plus custom connectors and calls to external APIs. For architectural guidance, see [Coding with Logic Apps Standard: Local Functions](https://techcommunity.microsoft.com/blog/integrationsonazureblog/coding-with-logic-apps-standard-local-functions/4534240).

### Security and identity

Use Microsoft Entra ID, Azure RBAC, Azure Key Vault, private networking, and secure inputs and outputs to protect workflows and data. OAuth connections use token-based authorization and might require interactive sign-in and consent. Don't treat OAuth as storing a user's email address and password in the workflow.

For supported connectors in Azure-hosted Standard workflows, managed identities remove the need to store credentials or access tokens. During local development, the Azure Logic Apps Standard extension can use the signed-in developer identity through the Azure Identity credential chain, while the deployed workflow uses its system-assigned or user-assigned managed identity. Both identities require appropriate permissions on the target resource. This Visual Studio Code capability doesn't change the current hybrid limitation for managed identity authentication in connector operations. For more information, see [Use connectors with managed identity in the Logic Apps Standard extension](https://techcommunity.microsoft.com/blog/integrationsonazureblog/use-connectors-with-managed-identity-in-the-logic-apps-standard-extension/4539485).

### Deployment and operations

Store workflow definitions, configuration, and artifacts in source control and use automated build and deployment pipelines. Bicep compiles to Azure Resource Manager templates. Terraform and Pulumi are alternative infrastructure-as-code tools that manage Azure resources through their respective providers.

Plan monitoring, access control, environment configuration, disaster recovery, and support ownership before the first production migration wave. Secure sensitive action inputs and outputs so they don't appear in run history or telemetry.

## Next steps

Use an iterative migration approach to inventory dependencies, prioritize workloads, validate target designs, and release in manageable waves. The [Azure Logic Apps Migration Agent](migration/migration-agent-overview.md) can assist with discovery, analysis, planning, conversion, validation, and deployment while you retain control of architecture and implementation decisions.

> [!div class="nextstepaction"]
>
> [Migrate BizTalk Server with Azure Logic Apps Migration Agent](biztalk-server-migration-approaches.md)