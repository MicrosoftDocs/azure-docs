---
title: Migrate an Azure Stream Analytics Job Between Regions
description: Learn how to relocate an Azure Stream Analytics job from one Azure region to another by exporting the job, redeploying it with an ARM template, and cutting over.
ms.service: azure-stream-analytics
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 08/11/2026
ai-usage: ai-assisted
#Customer intent: As an Azure Stream Analytics developer or administrator, I want to move my Stream Analytics job to another Azure region so that I can meet data residency, latency, or availability requirements.
---

# Move an Azure Stream Analytics job to another region

Azure Stream Analytics jobs are region-specific compute resources, so you can't move them directly between Azure regions. You might need to relocate a job to meet data residency requirements, reduce latency to your data sources, or improve availability. To move a job, you deploy a new job in the target region and recreate its inputs, outputs, managed identities, and dependencies.

This article walks you through a recommended, end-to-end approach for migrating an Azure Stream Analytics job to another region.

## Prerequisites

- An existing Azure Stream Analytics job in the source region.
- Azure Stream Analytics support in the target region.
- Access to both the source and target subscriptions.
- The ability to stop and start the Stream Analytics job.

## Permissions to move the job

There's no single permission set that covers every migration. The permissions you need to perform the relocation are the same for all jobs, but the runtime permissions depend on the job's configured inputs and outputs. Assign only the data-plane roles that the job requires, following the principle of least privilege.

### Permissions to perform the relocation (always needed)

- **Contributor** on the target resource group or subscription, to create and configure the job in the destination region.
- **User Access Administrator** or **Owner**, only if you assign role-based access control (RBAC) roles to the job's managed identity as part of the relocation. A plain **Contributor** can't create role assignments.
- **Network Contributor**, only if the job uses virtual network integration or private endpoints that you must recreate in the target region.

### Job runtime permissions (assign only the roles that match the job's inputs and outputs)

Grant these permissions to the job's system-assigned or user-assigned managed identity on the downstream resource, following least privilege. Assign only the roles that correspond to the job's actual input and output bindings.

| Input/output source | Role to assign |
| --- | --- |
| Event Hubs (input) | Azure Event Hubs Data Receiver |
| Event Hubs (output) | Azure Event Hubs Data Sender |
| Blob Storage or Azure Data Lake Storage Gen2 | Storage Blob Data Contributor (add Storage Table Data Contributor if table state is used) |
| Service Bus (output) | Azure Service Bus Data Sender |
| Azure Cosmos DB | Cosmos DB Built-in Data Contributor (data-plane role; assign it through PowerShell or the Azure CLI, not the portal) |
| Azure Data Explorer | Database-level Ingestor (and Viewer) on the target database |
| SQL Database or Synapse | Not an RBAC role; create a contained database user from the managed identity (`FROM EXTERNAL PROVIDER`) and grant the needed permissions |

Before you relocate, enumerate the specific input and output bindings of each job and assign only the corresponding roles. For example, a job that writes to Azure Cosmos DB doesn't need Storage Blob Data Contributor.

Confirm that the following dependent services are available in the target region:

- Azure Event Hubs or IoT Hub.
- Azure Storage accounts (Azure Data Lake Storage Gen2 or Blob Storage).
- Azure Synapse, SQL, or other output services.
- Virtual networks and private endpoints, if the job uses them.

## Plan for downtime during migration

Azure Stream Analytics doesn't support live cross-region migration, so cutover requires downtime. To minimize the impact:

- Deploy and validate the target job before cutover.
- Plan the migration during a low-traffic window.
- Ensure that upstream inputs retain events for replay.
- Validate outputs before you switch production traffic.

## Prepare for the migration

Preparation involves exporting the job configuration and identifying all dependencies to recreate in the target region.

### Review dependencies

Ensure that the following components are available in the target region:

- **Job definition**: Queries, compatibility level, and streaming units.
- **Inputs**: Event Hubs, IoT Hub, Blob Storage, and Service Bus.
- **Outputs**: Azure Data Lake Storage Gen2, Event Hubs, Synapse, SQL, and Power BI.
- **Managed identity**: Azure recreates system-assigned identities with a new principal ID, so you must reconfigure the RBAC assignments.
- **Networking**: Virtual networks, private endpoints, DNS, and firewall rules.
- **Reference data**: You must migrate Blob Storage and Azure Data Lake Storage inputs separately.

### Export the job by using Visual Studio Code

The recommended way to export a job is by using Visual Studio Code and the Azure Stream Analytics Tools extension. For detailed export steps, see [Copy, back up, and move your Azure Stream Analytics job](copy-job.md).

The export flow is:

1. Install Visual Studio Code and the [Azure Stream Analytics Tools extension](quick-create-visual-studio-code.md#install-the-azure-stream-analytics-tools-extension).
1. Sign in to Azure.
1. Expand the **Stream Analytics** node.
1. Locate the source job.
1. Hover over the job, and select **Export job to local project**.

    :::image type="content" source="./media/vscode-explore-jobs/export-job.png" alt-text="Screenshot of VS Code with Azure Stream Analytics job selected.":::
1. Select a local folder.

The export produces the following artifacts: `Transformation.asaql`, the inputs JSON files, the outputs JSON files, and the job configuration files.

### Compile the job to an Azure Resource Manager template

1. Open `Transformation.asaql` in VS Code.
1. Right-click the file in the Explorer window, and select **ASA: Compile Script**. This action creates a `Deploy` folder.
1. Review `JobTemplate.json` and `JobTemplate.parameters.json`.

### Modify the ARM template

Update the following items before you deploy:

- Set the `location` to the target region.
- Update resource names to avoid conflicts.
- Remove read-only properties.
- Update parameters, including Event Hubs connection details, storage account references, and output credentials.

## Deploy the Stream Analytics job

Deploy the modified template by using the Azure portal or Azure PowerShell.

### Deploy by using the Azure portal

1. In the Azure portal, search for **Deploy a custom template**.
1. Select **Build your own template in the editor**.
1. Upload the updated template.
1. Enter the required values, including subscription, resource group, and location.
1. Select **Review + create**, and then select **Create**.

### Deploy by using Azure PowerShell

```powershell
Connect-AzAccount
Set-AzContext -Subscription "<TargetSubscriptionId>"
New-AzResourceGroupDeployment `
  -Name "ASA-Region-Migration" `
  -ResourceGroupName "<TargetResourceGroup>" `
  -TemplateFile "JobTemplate.json" `
  -TemplateParameterFile "JobTemplate.parameters.json"
```

## Validate before cutover

Validate the following items before you cut over to the target job:

- Input connectivity for Event Hubs and IoT Hub.
- Output accessibility.
- Query compilation.
- Managed identity permissions.
- End-to-end data flow.

## Data loss and replay strategy

Azure Stream Analytics preserves checkpoints for normal job pause and resume. However, when you redeploy or copy a job to a different region, the checkpoints aren't carried over. The redeployed job resumes from the configured default starting position, either the latest arrival or a specified timestamp, rather than the last known state of the source job.

When you start the job in the target region, configure the job start time. For the available options, see [Start options](start-job.md#start-options):

- **Custom time** (recommended).
- **Now**, which might skip earlier events.

Depending on your configuration and retention, the following outcomes are possible:

- **Duplicate processing**, in a replay scenario.
- **Data loss**, if retention is insufficient.

Follow these best practices to reduce the risk:

- Ensure that upstream retention covers the migration window.
- Use a controlled replay start time.
- Validate outputs before full cutover.

## Perform the cutover

1. Stop the source Stream Analytics job.
1. Start the target job with the appropriate start time.
1. Monitor input lag, output latency, and errors.
1. Validate downstream systems.

## Roll back a failed migration

If you encounter issues after cutover:

- Restart the source job only if input retention still contains the required events.
- Watch for potential duplicate processing.
- Resolve the issues before you retry the migration.

## Verify the migration

Confirm the following details about the migrated Azure Stream Analytics job:

- The job runs without errors.
- The job processes inputs correctly.
- Outputs are accurate.
- Monitoring and alerts are configured.
- Business validation is complete.

## Clean up source resources

After you validate that the target Azure Stream Analytics job runs correctly:

- Decommission the source job.
- Remove unused networking resources.
- Archive templates and configurations.
- Update documentation and runbooks.

## Related content

- [Copy, back up, and move your Azure Stream Analytics job](copy-job.md)
- [Move an Azure Stream Analytics cluster to another region](move-cluster.md)
- [How to start an Azure Stream Analytics job](start-job.md)
