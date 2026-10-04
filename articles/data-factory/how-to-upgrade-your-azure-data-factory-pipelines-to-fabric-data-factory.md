---
title: Upgrade your Azure Data Factory pipelines to Fabric Data Factory
description: Upgrade your Azure Data Factory to Fabric at your own pace. Explore the benefits and get started with View in Fabric (Preview).
author: ssindhub
ms.author: ssrinivasara
ms.topic: how-to
ms.date: 09/15/2026
ms.custom: pipelines
ai-usage: ai-assisted
---

# Upgrade to Fabric Data Factory

Fabric Data Factory is where data integration at Microsoft is headed—unified, intelligent, and built for AI. Your Azure Data Factory (ADF) pipelines already power critical workflows, and you can bring them into Fabric on your own terms.

You don't have to upgrade today. Start by looking around: bring your factory into Fabric, see what's ready, and move pipelines only when it adds value. It's a staged journey you control—not a forced, one-time cutover.

**In this article:**

- [Why upgrade to Fabric Data Factory](#why-upgrade-to-fabric-data-factory)
- [Let's get started](#get-started)
- [What to expect](#what-to-expect)
- [Known limitations](#known-limitations)
- [Frequently asked questions](#frequently-asked-questions)

## Why upgrade to Fabric Data Factory

Fabric Data Factory is built on the same underlying engine and connector library as Azure Data Factory. The shell changed; the engine didn't—so your pipelines feel familiar from day one, and you gain everything Fabric adds around them: OneLake as a single source of truth, Dataflow Gen2, built-in Git-based CI/CD without ARM-template friction, Copilot-assisted development, and a growing set of AI-powered capabilities.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/do-more-with-data-factory.png" lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/do-more-with-data-factory.png" alt-text="Screenshot showing the Azure Data Factory migration assessment results.":::

As you upgrade, three things stay true:

- **Nothing breaks.** Your Azure Data Factory pipelines keep running exactly as they do today, on the same pricing, fully supported. There's no forced upgrade and no deadline.
- **You're in control.** Every step is initiated by you. Nothing moves until you choose, and you can pause or step back at any point.
- **You don't lose anything by looking.** Bringing your factory into Fabric is reversible—nothing is upgraded, switched, or billed until you decide to upgrade intentionally.

Azure Data Factory remains the trusted foundation you rely on today. While it remains fully supported and available, future innovation is being built into Fabric Data Factory. You can move on your own timeline, but the value and innovation make the Fabric journey compelling.

## Get started

You need an existing Azure Data Factory instance with pipelines. The fastest way to start is to select **View in Fabric (Preview)**. In one click, it brings your existing factory into Fabric so you can explore it—no project plan and no commitment.

### Step 1: Select View in Fabric (Preview)

In your [Azure Data Factory](https://adf.azure.com) authoring canvas, select **View in Fabric (Preview)**.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/view-in-fabric.png" lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/view-in-fabric.png" alt-text="Screenshot showing the View in Fabric (Preview) entry point in Azure Data Factory.":::

The first time you select **View in Fabric (Preview)**, an onboarding panel opens and
explains what you can do with Data Factory in Fabric. Select the checkbox to
agree to the terms and conditions, and then select **Try Fabric Data Factory**
to continue.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/fabric-terms-and-conditions-for-privacy-settings.png" lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/fabric-terms-and-conditions-for-privacy-settings.png" alt-text="Screenshot showing the Fabric onboarding panel with the terms and conditions checkbox and Try Fabric Data Factory button.":::

You're then guided through the factory setup in Fabric:

1. **Verify your Fabric license.** If you don't have a Fabric license, you're
   prompted to sign up for a free license.

   :::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/fabric-signup.png" lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/fabric-signup.png" alt-text="Screenshot showing the Fabric sign-up page.":::

1. **Select a Fabric capacity.** Choose a capacity, such as a Trial capacity.

   > [!NOTE]
   > Viewing your data factory in Fabric doesn't consume any capacity. Capacity
   > is only consumed when you upgrade to Fabric-native capabilities or create
   > new Fabric artifacts in the workspace.

1. **Set up the Fabric workspace.** Fabric creates a new workspace for your
   Azure Data Factory artifacts with the same name as your data factory, or
   reuses the existing workspace if one was created previously.

1. **Set up the Azure Data Factory item.** Your data factory is surfaced in
   Fabric as an Azure Data Factory item in the workspace.

1. **Share Fabric workspace access (optional).** You can add directly assigned
   Azure Data Factory users and groups as Fabric workspace viewers. Existing
   Fabric roles are kept. Later ADF role changes aren't synchronized, and
   access isn't automatically removed. To skip and continue, select **Continue
   without adding access**. You can manage workspace access later in Fabric.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/setup-factory-panel.png" lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/setup-factory-panel.png" alt-text="Screenshot showing the Setting up your factory in Fabric panel with the license, capacity, workspace, Azure Data Factory item, and share access steps.":::

After setup completes, a short orientation walks you through Data Factory in Fabric the first time you arrive.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/onboarding-your-existing-data-factory-in-fabric.png" lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/onboarding-your-existing-data-factory-in-fabric.png" alt-text="Screenshot showing the first onboarding screen for Data Factory in Fabric.":::

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/onboarding-foundations-remain-the-same.png" lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/onboarding-foundations-remain-the-same.png" alt-text="Screenshot showing the second onboarding screen for Data Factory in Fabric.":::

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/onboarding-what-is-better-in-fabric.png" lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/onboarding-what-is-better-in-fabric.png" alt-text="Screenshot showing the third onboarding screen for Data Factory in Fabric.":::

That's it—you can now edit, manage, monitor, and run pipelines from within Fabric, just as you do in Azure Data Factory. Nothing is upgraded, and pipeline execution and billing remain in Azure Data Factory.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/fabric-view.png" lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/fabric-view.png" alt-text="Screenshot showing the Azure Data Factory in its new Fabric workspace.":::

### Step 2: Review readiness

Select **Assess and Upgrade** to open your readiness assessment.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/assess-and-upgrade.png" lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/assess-and-upgrade.png" alt-text="Screenshot showing the Assess and Upgrade button in Fabric.":::

This tool evaluates your Azure Data Factory estate and shows how ready it is to move to Fabric-native capabilities. It's **read-only and informational**—running it changes nothing and doesn't start an upgrade. You can also download your assessment report.

Key things to know:

- **It covers your whole estate automatically.** The assessment gives an aggregate view of all your pipelines, computed from your existing Azure Data Factory metadata.
- **It's available on demand** from your factory in Fabric, so you can check your status whenever you want.
- **It categorizes your pipelines** so you know what to do next:

  - **Ready**: Can move to Fabric-native today (for example, copy activities and basic orchestration).
  - **Review**: Needs manual adjustments before upgrade (for example, converting Synapse notebooks or Spark Job Definitions (SJDs) to Fabric-native assets), or includes capabilities that aren't fully supported yet. See [Known limitations](#known-limitations).

If the assessment indicates that you're ready to upgrade, the next step is to select the pipelines you want to upgrade.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/readiness-assessment.png" lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/readiness-assessment.png" alt-text="Screenshot showing the readiness assessment results in Fabric with Select pipelines and Review connections options.":::

### Step 3: Map connections and start upgrade

Next, select **Review connections** to map your Azure Data Factory linked
services to Fabric connections. Many connections are created for you
automatically—see [Connections created automatically during upgrade](#connections-created-automatically-during-upgrade).

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/map-connections.png" lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/map-connections.png" alt-text="Screenshot showing the mapping of linked services to Fabric connections.":::

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/map-connections-expanded-view.png" lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/map-connections-expanded-view.png" alt-text="Screenshot showing the expanded view of connection mapping.":::

When you're ready, select **Start upgrade (Preview)** to upgrade your pipelines to Fabric native pipelines.

Selected pipelines upgrade into a folder prefixed with the source factory name, so you can easily identify them and they don't collide with existing items. A confirmation message appears when the upgrade finishes.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/upgrade-results.png" lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/upgrade-results.png" alt-text="Screenshot showing the results after upgrading pipelines to Fabric Data Factory.":::

For more detail on what happens behind the scenes, see [What to expect](#what-to-expect).

## What to expect

This section explains what happens behind the scenes and how to validate your results. You don't need it to get started—it's here when you want the detail.

### Viewing your factory in Fabric

- Fabric creates a new workspace with the same name as your Azure Data Factory and assigns it to the capacity you choose.
- You can add existing Azure Data Factory users as **Viewer** members of the new workspace during setup. If you skip this step, no workspace access is added. A Fabric workspace Admin with write permission on the data factory can add access later by using **Share workspace access** in the management hub under ADF in Microsoft Fabric.
- **You get a full view of your estate.** Pipelines, linked services, triggers, and integration runtime configurations surface through live references to your Azure Data Factory, and you can monitor recent pipeline run history—status, duration, and errors—directly in Fabric.
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

For other connections, either select an existing Fabric connection or [create a new one](/fabric/data-factory/data-source-management) from workspace settings. Then begin your upgrade by selecting **Start upgrade (Preview)**.

> [!NOTE]
> If you don't map any connections, pipelines still upgrade, but activities that depend on unmapped connections are deactivated. Configure the required Fabric connections and re-enable those activities before you run the pipelines.

### Upgrade behavior

- Pipelines upgrade into a Fabric workspace with the same name as your Azure Data Factory.
- Pipeline names must be unique within a workspace.
- If a pipeline with the same name already exists in the workspace, the upgrade tool skips that pipeline.
- To keep names unique, upgraded pipelines use the format `<Source factory or workspace name>_<Pipeline name>`.
- You can view your existing factory structure in Fabric before upgrade.

### After you upgrade

After upgrade, complete the following tasks:

1. Validate all connections and credentials.
1. Re-enable and configure triggers, which are disabled by default.
1. Run end-to-end tests to confirm pipeline behavior.
1. Validate in a nonproduction environment before you upgrade production workloads.

## Known limitations

- **Fabric license required:** If you don't have a Fabric license, View in Fabric (Preview) takes you to sign up for a free one. If your administrator disables Fabric self-service sign-up, you can't sign up yourself. Ask your administrator to enable it or to assign you a Fabric license.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/blocked-fabric-free-license.png" lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/blocked-fabric-free-license.png" alt-text="Screenshot showing the message when Fabric self-service sign-up is blocked by tenant policy.":::

A partial upgrade is a supported outcome, not a failure state. The Readiness Assessment in Fabric identifies which pipelines are affected by the items in the following list. You can upgrade the ready ones and keep the rest running in Azure Data Factory.

The following items aren't supported in the upgrade experience today. Pipelines that use these features require redesign or an alternate approach.

| Category | Out-of-scope item | Details |
| --- | --- | --- |
| **Integration runtimes** | Self-hosted integration runtime (SHIR) | Replace with the Fabric on-premises data gateway (OPDG). |
|  | Managed virtual network IR / VNet-injected IR | Use the VNet gateway in Fabric. |
|  | SQL Server Integration Services IR (SSIS IR) | SSIS IR isn't needed in Fabric. You can run SSIS packages directly from a Fabric pipeline. |
| **Workload types** | Change data capture (CDC) | Use Copy job in Fabric pipelines. |
|  | Apache Airflow assets | Reload your existing DAG files manually into Fabric Apache Airflow jobs. |
|  | U-SQL / Azure Data Lake Analytics | Deprecated services; not supported in Fabric. |
|  | Cross-cloud or Azure Machine Learning refresh workloads | Workspace identity support is in progress; these workloads don't upgrade. |
| **Connectors** | Long-tail connectors (for example, SAP ECC, SAP BW, MDX, SAP CDS) | No equivalent connectors in Fabric. Redesign required. |
|  | Marketing and finance SaaS connectors (HubSpot, Google Ads, QuickBooks, Shopify, Xero) | Not supported today. |
| **Triggers and orchestration** | Custom event triggers | Can't be upgraded. |
|  | Tumbling window triggers | Known as interval-based scheduling in Fabric. Watermark and backfill workloads must be redesigned. |
|  | Chaining or dependency triggers | Not supported yet. |
| **Security and authentication** | Advanced configurations (CMK, dual tokens, FIC flows) | Unsupported workspace identity or service principal models don't upgrade. |
|  | Certificate-based authentication (Web activity) | Requires redesign. |
|  | User-assigned managed identity (UAMI) | Use workspace identity (WI) as a workaround. |
| **Parameterization and metadata** | Dynamic linked services (parameterized connections) | Each permutation must be a separate connection. |
| **Activities and compute** | Mapping data flows (MDF) | Supported in preview. Converted to MDF transforms in Dataflow Gen2. |
|  | Web, webhook, or HTTP activities with custom authentication or headers | Complex authentication scenarios must be rebuilt manually. |
|  | Notebook pool environment settings | Not supported; upgrade is blocked. |
|  | Batch or custom activity workspace identity support | Missing workspace identity support blocks upgrade. |
|  | Copy activity upsert into Lakehouse tables | Requires copy to staging and a notebook MERGE operation. |

## Frequently asked questions

### What is "View in Fabric (Preview)"?

It's the one-click entry point in Azure Data Factory that brings your factory into Fabric. If you don't have a Fabric license, it takes you to sign up for a free one. You choose a Fabric capacity, and Fabric creates a new workspace with the same name as your Azure Data Factory so you can review readiness and upgrade.

### Where does View in Fabric (Preview) put my factory?

It creates a new Fabric workspace with the same name as your Azure Data Factory, assigns it to the capacity you choose, and brings your factory into that workspace.

### Does View in Fabric (Preview) use capacity or a Fabric trial?

During View in Fabric (Preview), you choose a Fabric capacity, such as a Trial capacity. Fabric creates the new workspace on that selected capacity. Viewing the factory doesn't upgrade your pipelines or move pipeline execution and billing to Fabric; that happens only when you explicitly start the upgrade.

### Do I need a Fabric license before I start?

You need a Fabric license, but you don't have to arrange it in advance. If you don't have one, View in Fabric (Preview) takes you to sign up for a free Fabric license and accept the terms and conditions. If your tenant administrator disabled Fabric self-service sign-up, ask them to enable it or to assign you a license. You then choose a Fabric capacity, such as Trial, for the new workspace.

### Does bringing my factory into Fabric change or upgrade it directly?

No. Your factory is surfaced in Fabric so you can work with it, but nothing is copied or moved. No pipelines are upgraded until you explicitly start upgrade by selecting **Start upgrade (Preview)** from your factory in Fabric.

### Does this signal that Azure Data Factory is being deprecated?

No. Azure Data Factory is fully supported. New innovation lands in Fabric Data Factory—you don't have to move, but you'll want to. You can continue to author, manage, monitor, and run pipelines in Fabric exactly as you would in your Azure Data Factory studio using your existing permissions and workflows.

### What if only some of my pipelines are ready?

You see exactly which pipelines are ready and which ones need attention. You can upgrade the ready ones and keep the rest running in Azure Data Factory. A partial upgrade is a supported outcome, not a failure state.

### Can I upgrade without mapping connections?

Yes. Pipelines still upgrade, but activities that depend on unmapped connections are deactivated. Configure the required Fabric connections and re-enable those activities before running the pipelines.

### Where did my datasets go after the upgrade, and how do I keep definitions reusable?

Fabric doesn't use Azure Data Factory datasets. During upgrade, linked services become Fabric connections, and dataset settings are applied directly to the upgraded pipeline activities.

To keep values reusable across pipelines and environments, use Fabric connections for credentials and endpoints, and use variable libraries for values that need to change by environment, such as database names, folder paths, or table names.

### Will my triggers upgrade automatically?

Schedule triggers and Storage event triggers are upgraded automatically. However, they're disabled by design after the upgrade and must be re-enabled once you validate your upgraded pipelines. You must manually reconfigure and enable all other trigger types after validation.

### Do I still need Azure Key Vault for CI/CD?

In Fabric, you manage connections at the tenant level rather than scope them to a single factory, so you don't move connections through CI/CD pipelines the way you did in Azure Data Factory. Pre-create each connection once, then reference it with variable libraries and parameterize on deploy—you don't need Azure Key Vault to promote credentials across Dev, Test, and Prod. Tenant-level connections also support interactive user (OAuth) authentication, which was difficult to flow through ADF-style CI/CD.

### Can I validate before upgrading production workloads?

Yes. Validate in a nonproduction environment—confirming connections, triggers, and end-to-end execution—before you upgrade production pipelines.

## Related content

- [Compare Azure Data Factory and Fabric Data Factory](/fabric/data-factory/compare-fabric-data-factory-and-azure-data-factory)
- [Plan your migration from Azure Data Factory to Fabric Data Factory](/fabric/data-factory/migrate-planning-azure-data-factory)
- [Upgrade Azure Data Factory Mapping Data Flows pipelines to Fabric (preview)](/fabric/data-factory/dataflow-gen2-mapping-data-flows-transforms-upgrade)
- [Migration best practices](/fabric/data-factory/migration-best-practices)
- [Connector parity](/fabric/data-factory/connector-parity)
- [Convert global parameters to variable libraries](/fabric/data-factory/convert-global-parameters-to-variable-libraries)
