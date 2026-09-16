---
title: Modernize Mainframe and Midrange Workloads with Standard Workflows
description: Learn how to integrate and incrementally modernize mainframe and midrange workloads in Azure or on Azure Arc-enabled Kubernetes by using Azure Logic Apps Standard.
author: haroldcampos
ms.author: hcampos
ms.service: azure-logic-apps
ms.topic: concept-article
ms.update-cycle: 365-days
ms.date: 09/13/2026
# Customer intent: As an integration architect, I want to understand how Azure Logic Apps Standard can help integrate and modernize mainframe and midrange workloads and which hosting option fits my requirements.
---

# Modernize mainframe and midrange workloads by using Azure Logic Apps Standard

Azure Logic Apps Standard helps organizations extend and incrementally modernize mainframe and midrange workloads without first rewriting established host programs or moving all processing to Azure. Use workflows and built-in connectors to expose existing transactions, data, messages, files, and screen-driven applications to modern consumers. Run the integration layer in Azure, in App Service Environment v3 (ASE v3), or on customer-managed infrastructure through Hybrid deployment on Azure Arc-enabled Kubernetes.

Customers migrating from BizTalk Server can preserve compatible host-integration metadata and use existing adapter configurations as inputs for new built-in connector connections. This approach supports gradual coexistence between existing and modernized systems while teams move interfaces and business capabilities in manageable waves.

## Customer value

Azure Logic Apps Standard provides the following value for mainframe and midrange modernization:

| Customer goal | Azure Logic Apps Standard value |
| --- | --- |
| Preserve working systems | Reuse existing host programs, data structures, queues, files, and compatible metadata while modernizing the surrounding integration layer. |
| Modernize incrementally | Introduce workflows as integration façades, move one interface or business capability at a time, and keep legacy and modern systems operating together during transition. |
| Reduce custom integration code | Use visual workflows, built-in connectors, transformations, and workflow-scoped code instead of building every integration component from the ground up. |
| Choose where processing runs | Host workflows in Azure or run them on Arc-enabled Kubernetes near local systems when latency, data residency, or network requirements favor local processing. |
| Support different workload characteristics | Use stateful workflows for durable, long-running processes and stateless workflows for lower-latency, in-memory processing when persistence isn't required. |
| Adopt modern delivery practices | Store workflow definitions, configuration, metadata, and supporting code in source control and use automated build and deployment pipelines. |

Azure Logic Apps Standard is the core orchestration and integration runtime for the solution. Other messaging, API management, event distribution, database, or customer-managed services aren't required by default. Add them only when the refactored architecture requires an independent capability, scale boundary, lifecycle, or ownership model.

## Why use Azure Logic Apps Standard

Standard provides capabilities suited to host-system integration that aren't all available together in the Consumption resource type:

- Built-in, service provider-based connectors run with the Azure Logic Apps runtime and provide direct access to supported mainframe and midrange systems.
- A Standard logic app can contain multiple related workflows that share compute, storage, networking, configuration, and deployment boundaries.
- Stateful and stateless workflows support durable processes and lower-latency request-response scenarios.
- Azure-hosted Standard workflows support virtual network integration and private endpoints for access to private systems.
- Hybrid deployment runs workflows and built-in connector operations on customer-managed infrastructure.
- Visual Studio Code development supports local testing, source control, and CI/CD.

Azure Logic Apps Standard provides cloud-native implementations of many core integration capabilities historically provided by Host Integration Server (HIS), including access to IBM transaction programs, messaging systems, databases, host files, and 3270 applications. Some protocols and scenarios, such as LU6.2 connectivity, continue to require HIS.

:::image type="content" source="media/mainframe-modernization-overview/mainframe-modernization.png" alt-text="Conceptual diagram that shows the Microsoft cloud native capabilities for mainframe integration." lightbox="media/mainframe-modernization-overview/mainframe-modernization.png":::

## Choose where to run workflows

The mainframe and midrange built-in connectors in this article are supported with each Standard hosting option. Choose the option that meets the workload's requirements for infrastructure ownership, isolation, connectivity, latency, and data location.

| Hosting option | Best fit | Key considerations |
| --- | --- | --- |
| Workflow Service Plan | Managed Azure hosting for workflows that connect to host systems through private or public network paths. | Uses reserved WS1, WS2, or WS3 capacity and supports virtual network integration, private endpoints, and Azure monitoring. |
| App Service Environment v3 | Azure-hosted workloads that require dedicated isolation, networking, compliance boundaries, or consolidation with other App Service workloads. | Requires an ASE v3 and an Isolated v2 App Service Plan. |
| Hybrid | Local processing, data residency, low-latency access to host systems, or customer-managed infrastructure. | Runs on Azure Arc-enabled Kubernetes and requires customer-managed Kubernetes, SQL Server, SMB storage, networking, scaling, and operations. |

Hybrid deployment is partially connected, not air-gapped. Built-in connector operations run with the local Azure Logic Apps runtime, while Azure management and any cloud-hosted managed connectors require outbound connectivity. For current infrastructure requirements and limitations, see [Set up your own infrastructure for Standard logic apps using hybrid deployment](set-up-standard-workflows-hybrid-deployment-requirements.md).

## Preserve existing integration investments

For decades, Microsoft has provided mainframe and midrange integration capabilities through Microsoft Host Integration Server. Azure Logic Apps Standard builds on this experience with metadata-driven tools and connectors that help preserve existing application investments.

### Microsoft HIS Designer for Azure Logic Apps

This Visual Studio tool creates the Host Integration Designer XML (HIDX) metadata that Azure Logic Apps connectors use to interact with mainframe and midrange programs and data structures. The graphical designer lets you create, view, edit, and map program interfaces, methods, parameters, records, and data types. You can also import COBOL and RPG copybooks. For more information, see [HIS Designer for Azure Logic Apps](/host-integration-server/core/application-integration-ladesigner-2).

### Microsoft 3270 Design Tool

This tool records screens, navigation paths, methods, and parameters for tasks in a 3270 application. The tool generates HIDX metadata that the IBM 3270 connector uses to run the recorded navigation plan. For more information, see [3270 Design Tool](/host-integration-server/core/application-integration-3270designer-2).

### Migrate BizTalk host-system integrations

If your BizTalk Server applications use adapters for host systems, you can use many existing artifacts and configuration details to accelerate migration to Azure Logic Apps Standard:

- Reuse compatible HIDX metadata with the CICS, IMS, IBM i, IBM 3270, and IBM Host File built-in connectors.
- Use existing COBOL and RPG copybooks to create or update HIDX metadata.
- Use the Azure Logic Apps Migration Agent to discover supported BizTalk artifacts, including bindings, endpoint configurations, and HIDX files, and use them during analysis, planning, and conversion.

Existing settings don't transfer as deployable Azure Logic Apps connections without review. Recreate environment-specific configuration, credentials, certificates, and network settings for the target hosting environment, and validate the resulting behavior. BizTalk Integrations that depend on LU6.2 require refactoring or redesign. For more information, see [Migrate BizTalk Server with Azure Logic Apps Migration Agent](biztalk-server-migration-approaches.md).

## Map existing assets to built-in connectors

The following built-in, service provider-based connectors run with the Standard runtime. Some connectors also have managed versions that run in global Azure, but this article focuses on the built-in versions.

| Existing asset or integration | Azure Logic Apps Standard modernization path | Investment to preserve |
| --- | --- | --- |
| IBM 3270 application | Use the IBM 3270 connector to run recorded screen navigation over a TN3270 data stream. This option fits applications that don't provide a program-level interface. | HIDX navigation metadata and TN3270 connection requirements. See [Integrate IBM 3270 applications](../connectors/integrate-3270-apps-ibm-mainframe.md). |
| CICS transaction program | Use the CICS Program Call connector to expose existing transactions to workflows and modern applications over TCP/IP or HTTP. Use HIS when LU6.2 is required. | HIDX metadata, copybooks, and host and CICS connection requirements. See [Integrate CICS programs](../connectors/integrate-cics-apps-ibm-mainframe.md). |
| IBM DB2 database | Use the IBM DB2 connector to read and modify supported DB2 databases directly over TCP/IP without an on-premises data gateway. | Server, database, package, code-page, and authentication requirements. See the [IBM DB2 built-in connector reference](/azure/logic-apps/connectors/built-in/reference/db2/). |
| IBM host file | Use the IBM Host File connector to parse binary content into structured data or generate binary host-file content. The connector doesn't require a direct host connection. | HIDX layouts, copybooks, and code-page information. See [Parse and generate IBM host files](../connectors/integrate-host-files-ibm-mainframe.md). |
| IBM i COBOL or RPG program | Use the IBM i Program Call connector to reuse established business logic through the Distributed Program Calls server over TCP/IP. Use HIS when LU6.2 is required. | HIDX metadata, copybooks, and IBM i connection requirements. See [Integrate IBM i programs](../connectors/integrate-ibmi-apps-distributed-program-calls.md). |
| IMS transaction program | Use the IMS Program Call connector to call programs through IMS Connect over TCP/IP. Behind the scenes, IMS Connect uses IMS message queues to route requests and responses. | HIDX metadata, copybooks, and IMS Connect settings. See [Integrate IMS programs](../connectors/integrate-ims-apps-ibm-mainframe.md). |
| IBM MQ messaging | Use the IBM MQ connector to connect existing queues and messages to modern workflow processes. | Queue manager, channel, queue, TLS, and message-format requirements. See [Connect to IBM MQ](../connectors/connectors-create-api-mq.md). |

## Modernize incrementally

Mainframe and midrange environments often contain tightly connected programs, data, files, schedulers, and external interfaces. A single big-bang migration attempts to replace the selected scope in one coordinated release. This approach can fit a small, well-understood environment, but the delivery and cutover risk increases with the number of dependencies and the duration of the project.

:::image type="content" source="media/mainframe-modernization-overview/waterfall-mainframe.png" alt-text="Conceptual diagram that shows big bang migration phases approach." lightbox="media/mainframe-modernization-overview/waterfall-mainframe.png":::

For most estates, use iterative waves to preserve working behavior and deliver value sooner:

1. Inventory programs, data, interfaces, jobs, dependencies, service objectives, and operational requirements.
1. Select an end-to-end integration flow with clear business value and manageable dependencies.
1. Introduce Azure Logic Apps Standard as an integration façade while the host system remains operational.
1. Reuse compatible metadata and configure the required built-in connectors.
1. Test functional behavior, throughput, recovery, security, and coexistence with the legacy implementation.
1. Redirect consumers to the modernized interface and monitor the production flow.
1. Repeat for subsequent waves, and retire legacy interfaces only after their consumers and dependencies move.

:::image type="content" source="media/mainframe-modernization-overview/mainframe-waves.png" alt-text="Conceptual diagram that showss mainframe migration with Agile waves approach." lightbox="media/mainframe-modernization-overview/mainframe-waves.png":::

Each wave can deliver one feature or a related group of integration flows. Shared jobs and highly interconnected applications might remain until later waves, after lower-risk interfaces establish reusable workflow, security, deployment, and operations patterns.

:::image type="content" source="media/mainframe-modernization-overview/mainframe-streams.png" alt-text="Conceptual diagram that shows mainframe migration with Agile waves per streams." lightbox="media/mainframe-modernization-overview/mainframe-streams.png":::

## Apply modernization patterns

Use architecture patterns according to the target workload rather than treating any one pattern as mandatory.

### Anti-corruption Layer pattern

Consider using Azure Logic Apps Standard as an anti-corruption layer between legacy interfaces and modern consumers. Workflows can translate protocols, formats, and interaction models without requiring consumers to understand host-specific details. The façade can run in Azure or on Arc-enabled Kubernetes near the host environment.

:::image type="content" source="media/mainframe-modernization-overview/anti-corruption-pattern.png" alt-text="Conceptual diagram that shows the Anti-corruption Layer pattern." lightbox="media/mainframe-modernization-overview/anti-corruption-pattern.png":::

For more information, see [Anti-corruption Layer pattern](/azure/architecture/patterns/anti-corruption-layer).

### Strangler Fig pattern

Use the Strangler Fig pattern to route selected interfaces or capabilities through the new integration layer while the remaining workload continues to run on the host. Replace implementations incrementally, validate each cutover, and decommission legacy components only after their dependencies move.

:::image type="content" source="media/mainframe-modernization-overview/strangler-fig-pattern.png" alt-text="Conceptual diagram that shows the Strangler Fig pattern." lightbox="media/mainframe-modernization-overview/strangler-fig-pattern.png":::

For more information, see [Strangler Fig pattern](/azure/architecture/patterns/strangler-fig).

### Saga and Choreography patterns

Use the Saga pattern when a business process spans systems that can't participate in one distributed transaction. A stateful workflow can act as the central saga orchestrator by coordinating participants and explicitly handling retries, failures, and compensating actions. Each participant performs its own local transaction. Workflow actions aren't automatically atomic as a group, and Azure Logic Apps doesn't automatically reverse changes in external systems. Design operations for idempotency and implement compensation by using actions, scopes, and run-after conditions.

In a choreography-based saga, participating services exchange events through messaging infrastructure without a central workflow coordinating the entire transaction. Add services such as Azure Service Bus or Azure Event Grid only when the architecture requires independent messaging or event distribution. For more information, see [Saga distributed transactions pattern](/azure/architecture/reference-architectures/saga/saga) and [Choreography pattern](/azure/architecture/patterns/choreography).

:::image type="content" source="media/mainframe-modernization-overview/saga-pattern.png" alt-text="Conceptual diagram that shows the SAGA pattern." lightbox="media/mainframe-modernization-overview/saga-pattern.png":::

## Plan security, operations, and cost

- Use private network connectivity and secure authentication appropriate to the hosting environment and host system. Store secrets in approved secret stores rather than workflow definitions.
- Keep workflow definitions, HIDX files, configuration templates, and supporting code in source control. Separate environment-specific values from deployable artifacts and use automated pipelines.
- Design for retries and at-least-once processing. Use idempotency, deduplication, correlation identifiers, and safe writes to prevent duplicate effects.
- Define monitoring, alerting, run-history retention, disaster recovery, and support ownership before production cutover. Azure-hosted and hybrid deployments have different monitoring capabilities and limitations.
- Compare total cost of ownership across hosting, connector usage, networking, storage, monitoring, and customer-managed infrastructure. Standard includes built-in operation executions, while managed connector operations and supporting resources can add charges.

For current limits and pricing, see [Azure Logic Apps limits and configuration](logic-apps-limits-and-config.md) and [Azure Logic Apps pricing and billing models](logic-apps-pricing.md).

## Example modernization scenarios

### Expose a CICS transaction to a modern application

Create a Standard workflow that calls an existing CICS program through the built-in connector, transforms the response, and returns a modern interface to an application or API layer. Keep the CICS program as the system of record while consumers move away from host-specific connectivity.

### Make DB2 data available to analytics

Use a Standard workflow to read approved operational data from DB2, validate and transform the records, and send them to an Azure data or analytics service. This approach avoids creating a separate mainframe extraction program for each consumer while preserving governance over when and how data leaves the host.

### Run integration near host systems

Deploy Azure Logic Apps Standard on Azure Arc-enabled Kubernetes when workflows need local processing, data residency, or low-latency access to IBM systems. Built-in connector operations run with the local runtime, while the workflow can selectively connect to Azure services when the architecture and network policy permit.

## Next steps

- [Create Standard workflows with Visual Studio Code](create-standard-workflows-visual-studio-code.md)
- [Set up Hybrid deployment infrastructure](set-up-standard-workflows-hybrid-deployment-requirements.md)
- [Review built-in connectors for Standard workflows](../connectors/built-in.md)
- [Migrate BizTalk Server with Azure Logic Apps Migration Agent](biztalk-server-migration-approaches.md)
- [Explore Azure Architecture Center guidance for mainframes and midrange systems](/azure/architecture/browse/?terms=mainframe)
