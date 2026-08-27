---
title: Upgrade your Azure Data Factory pipelines to Fabric Data Factory
description: Upgrade your Azure Data Factory to Fabric at your own pace. Explore the benefits and get started with View in Fabric.
author: ssindhub
ms.author: ssrinivasara
ms.topic: how-to
ms.date: 08/17/2026
ms.custom: pipelines
ai-usage: ai-assisted
---

# Upgrade to Fabric Data Factory

Fabric Data Factory is where data integration at Microsoft is headed—unified, intelligent, and built for AI. Your Azure Data Factory (ADF) pipelines already power critical workflows, and you can bring them into Fabric on your own terms.

You don't have to upgrade today. Start by looking around: bring your factory into Fabric, see what's ready, and move pipelines only when it adds value. It's a staged journey you control—not a forced, one-time cutover.

**In this article:**

- [Why upgrade to Fabric Data Factory](#why-upgrade-to-fabric-data-factory)
- [Let's get started](#lets-get-started)
- [What to expect](#what-to-expect)
- [Known limitations](#known-limitations)
- [Frequently asked questions](#frequently-asked-questions)

## Why upgrade to Fabric Data Factory

Fabric Data Factory is built on the same underlying engine and connector library as Azure Data Factory. The shell changed; the engine didn't—so your pipelines feel familiar from day one, and you gain everything Fabric adds around them: OneLake as a single source of truth, Dataflow Gen2, built-in Git-based CI/CD without ARM-template friction, Copilot-assisted development, and a growing set of AI-powered capabilities.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/do-more-with-data-factory.png" alt-text="Screenshot showing the Azure Data Factory migration assessment results." lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/do-more-with-data-factory.png":::

As you upgrade, three things stay true:

- **Nothing breaks.** Your Azure Data Factory pipelines keep running exactly as they do today, on the same pricing, fully supported. There's no forced upgrade and no deadline.
- **You're in control.** Every step is initiated by you. Nothing moves until you choose, and you can pause or step back at any point.
- **You don't lose anything by looking.** Bringing your factory into Fabric is reversible and capacity-free—nothing is upgraded, switched, or billed until you decide to upgrade intentionally.

Azure Data Factory (classic) remains the trusted foundation you rely on today—fully supported, still sold and serviced. New innovation lands in Fabric Data Factory. You don't have to move, but you'll want to.

## Let's get started

The fastest way in is **View in Fabric**. In one click, it brings your existing factory into Fabric so you can explore it—no setup, no project plan, no commitment.

All you need is an existing Azure Data Factory instance with pipelines. If you don't have a Fabric license yet, you're taken to sign up for a free one. Viewing your data factory in Fabric doesn't require any Fabric capacity.

### Step 1: Select View in Fabric

In your [Azure Data Factory](https://adf.azure.com) authoring canvas, select **View in Fabric**.

:::image type="content" source="media/upgrade-to-fabric-data-factory/view-in-fabric.png" alt-text="Screenshot showing the View in Fabric entry point in Azure Data Factory." lightbox="media/upgrade-to-fabric-data-factory/view-in-fabric.png":::

When you select **View in Fabric**:

1. Fabric checks your license. If you don't already have one, you're taken to the Fabric sign-up page to get a free license.
1. A **capacity-free personal workspace (My workspace)** is created for you—no manual setup, and no Fabric capacity required to view your factory.
1. Your Azure Data Factory is brought into **My workspace**, where you can work with it—edit, manage, monitor, and run pipelines exactly as you do in Azure Data Factory.

If you don't already have a Fabric license, sign up for a free one and accept the terms and conditions to continue.

:::image type="content" source="media/upgrade-to-fabric-data-factory/fabric-signup.png" alt-text="Screenshot showing the Fabric sign-up page." lightbox="media/upgrade-to-fabric-data-factory/fabric-signup.png":::

:::image type="content" source="media/upgrade-to-fabric-data-factory/fabric-free-signup.png" alt-text="Screenshot showing sign-up for a free Fabric license." lightbox="media/upgrade-to-fabric-data-factory/fabric-free-signup.png":::

:::image type="content" source="media/upgrade-to-fabric-data-factory/fabric-tnc.png" alt-text="Screenshot showing the Fabric terms and conditions acceptance." lightbox="media/upgrade-to-fabric-data-factory/fabric-tnc.png":::

A short orientation walks you through your Data Factory in Fabric the first time you arrive.

:::image type="content" source="media/upgrade-to-fabric-data-factory/onboarding-screen1.png" alt-text="Screenshot showing the first onboarding screen for Data Factory in Fabric." lightbox="media/upgrade-to-fabric-data-factory/onboarding-screen1.png":::

:::image type="content" source="media/upgrade-to-fabric-data-factory/onboarding-screen2.png" alt-text="Screenshot showing the second onboarding screen for Data Factory in Fabric." lightbox="media/upgrade-to-fabric-data-factory/onboarding-screen2.png":::

That's it—you can now work with your factory from within Fabric, editing, managing, monitoring, and running pipelines just as you do in Azure Data Factory. Nothing is upgraded, and pipeline execution and billing remain in Azure Data Factory.

:::image type="content" source="media/upgrade-to-fabric-data-factory/fabric-view.png" alt-text="Screenshot showing the Azure Data Factory in the user's personal My workspace in Fabric." lightbox="media/upgrade-to-fabric-data-factory/fabric-view.png":::

### Step 2: Review readiness

The **Readiness Assessment** evaluates your Azure Data Factory estate and shows how ready it is to move to Fabric-native capabilities. It's **read-only and informational**—running it changes nothing and doesn't start an upgrade.

:::image type="content" source="media/upgrade-to-fabric-data-factory/readiness-assessment.png" alt-text="Screenshot showing the Readiness Assessment results in Fabric." lightbox="media/upgrade-to-fabric-data-factory/readiness-assessment.png":::

Key things to know:

- **It covers your whole estate automatically.** There's no pipeline selection—the assessment gives an aggregate view of all your pipelines, computed from your existing Azure Data Factory metadata.
- **It's available on demand** from your factory in Fabric, so you can check your status whenever you want.
- **It categorizes your pipelines** so you know what to do next:

  | Category | What it means |
  | --- | --- |
  | **Ready** | Can move to Fabric-native today (for example, copy activities and basic orchestration). |
  | **Review** | Needs manual adjustments before upgrade (for example, parameterized linked services), or isn't supported yet (for example, SSIS packages and custom activities). See [Known limitations](#known-limitations). |

If the assessment indicates that you're ready to upgrade, select a Fabric workspace to upgrade your Azure Data Factory artifacts to, choose the pipelines you want to upgrade, map connections, and complete the upgrade.

:::image type="content" source="media/upgrade-to-fabric-data-factory/assess-and-upgrade.png" alt-text="Screenshot showing the Readiness Assessment with the option to upgrade to Fabric Data Factory." lightbox="media/upgrade-to-fabric-data-factory/assess-and-upgrade.png":::

### Step 3: Choose pipelines for upgrade and map your connections

Select **Start upgrade (Preview)** and choose the pipelines you want to upgrade. Then select **Review connections** to map your Azure Data Factory linked services to Fabric connections and select **Confirm**. Many connections are created for you automatically—see [Connections created automatically during upgrade](#connections-created-automatically-during-upgrade).

:::image type="content" source="media/upgrade-to-fabric-data-factory/map-connections.png" alt-text="Screenshot showing the mapping of linked services to Fabric connections." lightbox="media/upgrade-to-fabric-data-factory/map-connections.png":::

:::image type="content" source="media/upgrade-to-fabric-data-factory/map-connections-expanded-view.png" alt-text="Screenshot showing the expanded view of connection mapping." lightbox="media/upgrade-to-fabric-data-factory/map-connections-expanded-view.png":::

:::image type="content" source="media/upgrade-to-fabric-data-factory/review-connection-mapping.png" alt-text="Screenshot showing the review of connection mappings before confirming." lightbox="media/upgrade-to-fabric-data-factory/review-connection-mapping.png":::

Selected pipelines upgrade into a folder prefixed with the source factory name, so they're easy to identify and don't collide with existing items. A confirmation message appears when the upgrade completes.

:::image type="content" source="media/upgrade-to-fabric-data-factory/upgrade-results.png" alt-text="Screenshot showing the results after upgrading pipelines to Fabric Data Factory." lightbox="media/upgrade-to-fabric-data-factory/upgrade-results.png":::

That's the happy path. For deeper detail on what happens behind the scenes, see [What to expect](#what-to-expect).

## What to expect

This section explains what happens behind the scenes and how to validate your results. You don't need it to get started—it's here when you want the detail.

### Your factory in My workspace

- Your factory opens in **your own personal My workspace**, not a shared workspace. Because the flow is scoped to My workspace, **sharing is disabled by design**—there are no workspace-level roles to manage.
- **No capacity is consumed to view your factory**, and no Fabric trial is activated. You need Fabric capacity when you upgrade your pipelines or create new Fabric artifacts—you can upgrade to a trial or paid capacity on demand at that point.
- **You get a full view of your estate.** Pipelines, linked services, triggers, and integration runtime configurations are surfaced through live references to your Azure Data Factory, and you can monitor recent pipeline run history—status, duration, and errors—directly in Fabric.
- **Nothing changes in Azure Data Factory.** Authoring, execution, permissions, and billing all continue in Azure Data Factory exactly as before.

### Connections created automatically during upgrade

The experience automatically creates connections for authentication methods it can safely and reliably map from Azure Data Factory to Fabric's managed identity and security model, without requiring customer-managed infrastructure or network configuration.

| Connector | Azure Data Factory authentication | Fabric authentication |
| --- | --- | --- |
| Azure Blob Storage | Account key; Shared access signature (SAS); Service principal; System-assigned managed identity | Account key; Shared access signature (SAS); Service principal; Workspace identity (system-assigned managed identity) |
| Azure Data Lake Storage Gen2 | Account key; Shared access signature (SAS); Service principal; System-assigned managed identity | Account key; Shared access signature (SAS); Service principal; Workspace identity (system-assigned managed identity) |
| SQL Server | SQL authentication; Service principal; System-assigned managed identity | Basic authentication; Service principal; Workspace identity (system-assigned managed identity) |
| Azure SQL Database | SQL authentication; Service principal; System-assigned managed identity | Basic authentication; Service principal; Workspace identity (system-assigned managed identity) |
| Azure Data Explorer (Kusto) | Service principal; System-assigned managed identity | Service principal; Workspace identity (system-assigned managed identity) |
| Azure Cosmos DB for NoSQL | Account key | Account key |
| Azure Cosmos DB for MongoDB | Basic authentication | Basic authentication |
| Azure SQL Managed Instance | Account key; Service principal | Basic authentication; Service principal |
| Azure Database for PostgreSQL | Basic authentication | Basic authentication |
| Azure Database for MySQL | Basic authentication | Basic authentication |
| MySQL | Basic authentication | Basic authentication |
| PostgreSQL | Basic authentication | Basic authentication |

For other connections, either select an existing Fabric connection or create a new one using the modern Get data experience or from workspace settings. Then select **Confirm**.

> [!NOTE]
> If you don't map any connections, pipelines still upgrade, but activities that depend on unmapped connections are deactivated. Configure the required Fabric connections and re-enable those activities before you run the pipelines.

### Upgrade behavior

- Pipelines upgrade into a Fabric Data Factory workspace.
- Pipeline names must be unique within a workspace.
- If a pipeline with the same name already exists, the upgrade tool skips that pipeline.
- To keep names unique, upgraded pipelines use the format `<Source factory or workspace name>_<Pipeline name>`.
- You can view your existing factory structure in Fabric before upgrade.

### After you upgrade

After upgrade, complete the following tasks:

1. Validate all connections and credentials.
1. Re-enable and configure triggers, which are disabled by default.
1. Run end-to-end tests to confirm pipeline behavior.
1. Validate in a nonproduction environment before you upgrade production workloads.

## Known limitations

A partial upgrade is a supported outcome, not a failure state. The Readiness Assessment in Fabric identifies which pipelines are affected by the items below—you can upgrade the ready ones and keep the rest running in Azure Data Factory.

- **Fabric license required:** If you don't have a Fabric license, View in Fabric takes you to sign up for a free one. If your administrator has disabled Fabric self-service sign-up, you can't sign up yourself—ask your administrator to enable it or to assign you a Fabric license.

:::image type="content" source="media/upgrade-to-fabric-data-factory/blocked-fabric-free-license.png" alt-text="Screenshot showing the message when Fabric self-service sign-up is blocked by tenant policy." lightbox="media/upgrade-to-fabric-data-factory/blocked-fabric-free-license.png":::

The following items aren't supported in the upgrade experience today. Pipelines that use these features require redesign or an alternate approach.

| Category | Out-of-scope item | Details |
| --- | --- | --- |
| **Integration runtimes** | Self-hosted integration runtime (SHIR) | Can't be upgraded. Replace with the Fabric on-premises data gateway (OPDG). |
|  | Managed virtual network IR / VNet-injected IR | Fabric uses a different model and requires reconfiguration. |
|  | SQL Server Integration Services IR (SSIS IR) | Infrastructure upgrade isn't supported. |
| **Workload types** | Change data capture (CDC) | Out of scope; doesn't upgrade. |
|  | Apache Airflow assets | DAG-based orchestration can't be upgraded to Fabric. |
|  | U-SQL / Azure Data Lake Analytics | Deprecated services; not supported in Fabric. |
|  | Cross-cloud or Azure Machine Learning refresh workloads | Workspace identity support is in progress; these workloads don't upgrade. |
| **Connectors** | Long-tail connectors (for example, SAP ECC, SAP BW, MDX, SAP CDS) | No equivalent connectors in Fabric. Redesign required. |
|  | Marketing and finance SaaS connectors (HubSpot, Google Ads, QuickBooks, Shopify, Xero) | Not supported today. |
| **Triggers and orchestration** | Custom event triggers | Can't be upgraded. |
|  | Storage event triggers | Support is coming soon. |
|  | Tumbling window triggers | Known as interval-based scheduling in Fabric. Watermark and backfill workloads must be redesigned. |
|  | Chaining or dependency triggers | Not supported yet. |
| **Security and authentication** | Advanced configurations (CMK, dual tokens, FIC flows) | Unsupported workspace identity or service principal models don't upgrade. |
|  | Certificate-based authentication (Web activity) | Requires redesign. |
|  | User-assigned managed identity (UAMI) | Use workspace identity (WI) as a workaround. |
| **Parameterization and metadata** | Global parameters | Recreate by using Fabric variable libraries. |
|  | Dynamic linked services (parameterized connections) | Each permutation must be a separate connection and can't upgrade. |
|  | Metadata-driven pipelines | Highly dynamic linked service or dataset-driven patterns can't upgrade. |
| **Activities and compute** | Azure Synapse Spark job definition or notebook | Partially supported; requires redesign into Fabric notebooks or Spark jobs. |
|  | Mapping data flows (MDF) | Supported (preview). Converted to MDF transforms in Dataflow Gen2. |
|  | Web, webhook, or HTTP activities with custom authentication or headers | Complex authentication scenarios must be rebuilt manually. |
|  | Notebook pool environment settings | Not supported; upgrade is blocked. |
|  | Batch or custom activity workspace identity support | Missing workspace identity support blocks upgrade. |
|  | Copy activity upsert into Lakehouse tables | Requires copy to staging and a notebook MERGE operation. |

## Frequently asked questions

### What is "View in Fabric"?

It's the one-click entry point in Azure Data Factory that brings your factory into Fabric. If you don't have a Fabric license, it takes you to sign up for a free one. It brings your factory into a capacity-free personal **My workspace** so you can review readiness and upgrade.

### Where does View in Fabric put my factory?

In your personal **My workspace**—a capacity-free workspace scoped to you, with sharing disabled by design.

### Does View in Fabric use capacity or a Fabric trial?

Viewing your factory is capacity-free and never activates a Fabric trial. You need Fabric capacity when you upgrade your pipelines or create new Fabric artifacts—you can upgrade to a trial or paid capacity on demand at that point.

### Do I need a Fabric license before I start?

You need a Fabric license, but you don't have to arrange it in advance. If you don't have one, View in Fabric takes you to sign up for a free Fabric license. If your tenant administrator has disabled Fabric self-service sign-up, ask them to enable it or to assign you a license. Viewing your data factory in Fabric doesn't require any Fabric capacity.

### Does bringing my factory into Fabric change or upgrade it directly?

No. Your factory is surfaced in Fabric so you can work with it, but nothing is copied or moved. No pipelines are upgraded until you explicitly start upgrade by selecting **Start upgrade (Preview)** from your factory in Fabric.

### Does this signal that Azure Data Factory is being deprecated?

No. Azure Data Factory is fully supported. New innovation lands in Fabric Data Factory—you don't have to move, but you'll want to. You can continue to author, manage, monitor, and run pipelines in Fabric exactly as you would in your Azure Data Factory studio using your existing permissions and workflows.

### Is this really one click?

Bringing your factory into Fabric with **View in Fabric** is. The full upgrade isn't a single click—it's assessed, staged, and validated—but each step is initiated by you, and you can stop at any point.

### What if only some of my pipelines are ready?

You'll see exactly which pipelines are ready and which need attention. You can upgrade the ready ones and keep the rest running in Azure Data Factory. A partial upgrade is a supported outcome, not a failure state.

### Can I upgrade without mapping connections?

Yes. Pipelines still upgrade, but activities that depend on unmapped connections are deactivated. Configure the required Fabric connections and re-enable those activities before running the pipelines.

### Where did my datasets go, and how do I keep definitions reusable?

In Fabric, Azure Data Factory linked services become **connections**, and datasets are replaced by Fabric's data model. To keep definitions reusable, reference connections and parameterize them through variable libraries instead of recreating them in each pipeline.

### Will my triggers upgrade automatically?

Schedule triggers upgrade automatically but are disabled afterward by design—re-enable them in Fabric. All other triggers must be manually reconfigured and re-enabled after you validate the upgraded pipelines.

### Do I still need Azure Key Vault for CI/CD?

In Fabric, connections are managed at the tenant level rather than scoped to a single factory, so you don't move connections through CI/CD pipelines the way you did in Azure Data Factory. Pre-create each connection once, then reference it with variable libraries and parameterize on deploy—you don't need Azure Key Vault to promote credentials across Dev, Test, and Prod. Tenant-level connections also support interactive user (OAuth) authentication, which was difficult to flow through ADF-style CI/CD.

### Can I validate before upgrading production workloads?

Yes. Validate in a nonproduction environment—confirming connections, triggers, and end-to-end execution—before you upgrade production pipelines.

## Related content

- [Compare Azure Data Factory and Fabric Data Factory](/fabric/data-factory/compare-fabric-data-factory-and-azure-data-factory)
- [Plan your migration from Azure Data Factory to Fabric Data Factory](/fabric/data-factory/migrate-planning-azure-data-factory)
- [Upgrade Azure Data Factory Mapping Data Flows pipelines to Fabric (preview)](/fabric/data-factory/dataflow-gen2-mapping-data-flows-transforms-upgrade)
- [Migration best practices](/fabric/data-factory/migration-best-practices)
- [Connector parity](/fabric/data-factory/connector-parity)
- [Convert global parameters to variable libraries](/fabric/data-factory/convert-global-parameters-to-variable-libraries)
