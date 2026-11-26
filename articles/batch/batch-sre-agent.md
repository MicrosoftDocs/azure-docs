---
title: Investigate Azure Batch issues with Azure SRE Agent
description: Learn how to use Azure SRE Agent with Azure Monitor alerts to automatically investigate Azure Batch pool, compute node, and task failures.
author: xinlaoda
ms.author: xxin
ms.service: azure-batch
ms.topic: how-to
ms.date: 11/25/2026
ai-usage: ai-assisted
ms.custom: devx-track-azurecli
# Customer intent: As an Azure Batch administrator, I want Azure SRE Agent to investigate Batch alerts automatically, so that I can find the root cause of pool, compute node, and task failures faster.
---

# Investigate Azure Batch issues with Azure SRE Agent

[Azure SRE Agent](/azure/sre-agent/overview) is an AI-powered operations agent that investigates incidents in your Azure environment. When you connect the agent to Azure Monitor alerts for your Batch accounts, it picks up each fired alert, gathers evidence from your Batch resources, logs, and metrics, and reports the probable root cause and recommended next steps in an investigation thread.

This article shows how to:

- Send Batch resource logs and metrics to a Log Analytics workspace.
- Create Azure Monitor alert rules for common Batch failure signals.
- Give the agent access to your Batch accounts.
- Connect Azure Monitor alerts to the agent and verify an investigation end to end.

## What the agent can investigate

SRE Agent uses the same data that's available to you through the Batch APIs, Azure Monitor, and Azure Resource Manager. It's most effective for issues whose cause is visible in your Batch configuration and resource state, such as the following examples.

| Issue | Alert signal | What the agent can check |
| --- | --- | --- |
| Pool resize failure | `PoolResizeCompleteEvent` resource log with a non-success result code | Pool target and current node counts, resize errors, Batch account and subscription core quotas, and Azure Policy denials in the activity log |
| Start task failure | **Start Task Failed Node Count** metric | Start task command line, exit code, and failure information on the compute node |
| Unusable compute nodes | **Unusable Node Count** metric | Compute node errors, such as mount configuration, container image, or application package failures, and the pool's network configuration |
| Task failures | **Task Fail Events** metric or `TaskFailEvent` resource log | Task exit codes, failure information, and job configuration |

For details about these errors and how to resolve them, see [Azure Batch pool and node errors](batch-pool-node-error-checking.md) and [Azure Batch job and task errors](batch-job-task-error-checking.md).

> [!IMPORTANT]
> SRE Agent can access only the data that you grant to its managed identity. It doesn't have access to Batch service internal telemetry. If an investigation points to a platform issue that your quotas or configuration don't explain, such as a capacity or allocation failure, [create a support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

## Prerequisites

Before you begin, ensure you have the following prerequisites:

- An Azure Batch account. Both Batch service and user subscription pool allocation modes are supported.
- A [Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace) to store Batch resource logs.
- Permission to create an SRE agent: **Owner**, or **Contributor** plus **User Access Administrator**, on the subscription or resource group where you create the agent.
- **Owner** or **User Access Administrator** on the resource groups that contain your Batch account and Log Analytics workspace, so you can grant the agent access to them.
- Azure CLI installed and authenticated to the subscription.

For SRE Agent charges, see [Azure SRE Agent pricing and billing](/azure/sre-agent/pricing-billing). For the regions where you can create an agent, see [Supported regions for Azure SRE Agent](/azure/sre-agent/supported-regions).

## Set environment variables

Set variables for your resources. Replace the placeholder values.

```azurecli
subscriptionId="<subscription-id>"
resourceGroup="<resource-group>"
batchAccount="<batch-account-name>"
workspaceName="<log-analytics-workspace-name>"

az account set --subscription "$subscriptionId"

batchAccountId=$(az batch account show \
  --resource-group "$resourceGroup" \
  --name "$batchAccount" \
  --query id \
  --output tsv)

workspaceId=$(az monitor log-analytics workspace show \
  --resource-group "$resourceGroup" \
  --workspace-name "$workspaceName" \
  --query id \
  --output tsv)
```

If your Batch account and Log Analytics workspace are in different resource groups, use the correct resource group for each command.

## Send Batch logs and metrics to Log Analytics

Create a diagnostic setting that sends Batch resource logs and metrics to your Log Analytics workspace. The log alert in the next section and the agent's log queries use this data.

```azurecli
az monitor diagnostic-settings create \
  --name batch-to-log-analytics \
  --resource "$batchAccountId" \
  --workspace "$workspaceId" \
  --logs '[{"categoryGroup":"allLogs","enabled":true}]' \
  --metrics '[{"category":"AllMetrics","enabled":true}]'
```

A new diagnostic setting can take several minutes to take effect. Batch events that occur before then aren't collected. For more information about Batch resource logs, see [Monitor Azure Batch](monitor-batch.md).

## Create alert rules for Batch failures

SRE Agent starts an investigation when an Azure Monitor alert fires. Create alert rules for the Batch failure signals that you want the agent to investigate. The following rules are a starting point. Adjust the thresholds, windows, and severities for your workloads.

The agent detects fired alerts by scanning Azure Monitor, so these alert rules don't need an action group for the agent to investigate them. To also notify your team by email, SMS, or other channels, add an [action group](/azure/azure-monitor/alerts/action-groups) to each rule by using the `--action` parameter for metric alerts or the `--action-groups` parameter for log search alerts.

### Alert on unusable nodes and start task failures

**Unusable Node Count** and **Start Task Failed Node Count** are gauge metrics that represent point-in-time totals for the Batch account. Use the **Maximum** aggregation to alert when any node is in either state.

```azurecli
az monitor metrics alert create \
  --name batch-unusable-nodes \
  --resource-group "$resourceGroup" \
  --scopes "$batchAccountId" \
  --condition "max UnusableNodeCount > 0" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --severity 2 \
  --description "Batch compute node is in the unusable state"

az monitor metrics alert create \
  --name batch-start-task-failed \
  --resource-group "$resourceGroup" \
  --scopes "$batchAccountId" \
  --condition "max StartTaskFailedNodeCount > 0" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --severity 2 \
  --description "Batch compute node start task failed"
```

### Alert on pool resize failures

The **Pool Resize Complete Events** metric counts resize operations, but it doesn't distinguish successful resizes from failed ones. To alert only on failures, create a log search alert on the `PoolResizeCompleteEvent` resource log.

```azurecli
az monitor scheduled-query create \
  --name batch-pool-resize-failed \
  --resource-group "$resourceGroup" \
  --scopes "$workspaceId" \
  --condition "count 'ResizeFailures' > 0" \
  --condition-query ResizeFailures="AzureDiagnostics | where ResourceProvider == 'MICROSOFT.BATCH' and OperationName == 'PoolResizeCompleteEvent' | extend resultCode = tostring(column_ifexists('resultCode_s', '')), poolId = tostring(column_ifexists('id_s', '')) | where resultCode != 'Success' | project TimeGenerated, Resource, poolId, resultCode, resultMessage = tostring(column_ifexists('resultMessage_s', ''))" \
  --evaluation-frequency 5m \
  --window-size 10m \
  --severity 2 \
  --description "Batch pool resize failed"
```

The query uses `column_ifexists` so that the rule is valid even before the workspace receives its first Batch pool resize event.

### Alert on task failures (optional)

If any task failure in the Batch account needs attention, alert on the **Task Fail Events** metric. For workloads where some task failures are expected, use a higher threshold or a [dynamic threshold](/azure/azure-monitor/alerts/alerts-dynamic-thresholds) instead.

```azurecli
az monitor metrics alert create \
  --name batch-task-failed \
  --resource-group "$resourceGroup" \
  --scopes "$batchAccountId" \
  --condition "total TaskFailEvent > 0" \
  --window-size 15m \
  --evaluation-frequency 5m \
  --severity 3 \
  --description "Batch task failed"
```

> [!TIP]
> SRE Agent merges repeated firings of the same alert rule into one investigation thread. If you want separate investigations for different failure types, use a separate alert rule for each failure signal, as shown in this article, rather than one rule that covers several signals.

## Create the agent and grant access to Batch

### Create the agent

Create an agent by following [Create and set up Azure SRE Agent](/azure/sre-agent/create-and-set-up). When you add Azure resources during setup, select the resource groups that contain your Batch account and Log Analytics workspace. The agent's managed identity then gets the following roles:

- **Reader**, **Log Analytics Reader**, and **Monitoring Reader** on the selected resource groups.
- **Monitoring Contributor** on the subscription, so that the agent can acknowledge and close Azure Monitor alerts.

For details, see [Agent permissions in Azure SRE Agent](/azure/sre-agent/permissions).

### Grant read access to Batch pools, nodes, jobs, and tasks

The **Reader** role lets the agent read Batch account and pool properties through Azure Resource Manager. To read compute node errors, start task results, and job and task details through the Batch service API, assign the **Azure Batch Account Reader** role to the agent's user-assigned managed identity. This role grants read-only access and doesn't let the agent change your Batch resources.

To find the principal ID of the agent's managed identity, open the SRE Agent resource in the Azure portal, select **Identity**, and select the user-assigned identity. For more information, see [Agent identity](/azure/sre-agent/agent-identity).

```azurecli
agentPrincipalId="<agent-managed-identity-principal-id>"

az role assignment create \
  --assignee-object-id "$agentPrincipalId" \
  --assignee-principal-type ServicePrincipal \
  --role "Azure Batch Account Reader" \
  --scope "$batchAccountId"
```

Role assignments can take several minutes to take effect.

### Check the agent's network settings

The agent calls your Batch account endpoint, `<batch-account-name>.<region>.batch.azure.com`, to read compute node, job, and task details. Whether you need to change the agent's network settings depends on its [network control mode](/azure/sre-agent/network-integration#network-control-modes):

| Network control mode | Required action |
| --- | --- |
| **Unrestricted** (default) | None. |
| **Limited** | Add `*.batch.azure.com` to the allowed hosts. For steps, see [Configure network controls](/azure/sre-agent/configure-network-controls). |
| **Azure VNet** | Make sure that the agent's subnet can reach your Batch account endpoint through its public endpoint or a [private endpoint](private-connectivity.md). |

If the agent can't reach the Batch account endpoint, its Batch CLI commands fail and its investigation can't confirm compute node or task errors.

## Connect Azure Monitor alerts to the agent

1. In the [Azure SRE Agent portal](https://sre.azure.com), open your agent.
1. Select **Incidents** > **Connect an incident platform**, select **Azure Monitor**, and complete the wizard.
1. Select **Incidents** > **Triggers & response plans**, and then select **Create a response plan**.
1. In the incident filter, select the severities that you used for your Batch alert rules.
1. For the autonomy level, select **Review**. In Review mode, the agent investigates and proposes actions, but it doesn't change your resources until an administrator approves the action.

For more information, see [Azure Monitor alerts in Azure SRE Agent](/azure/sre-agent/azure-monitor-alerts) and [Tutorial: Automate incident response in Azure SRE Agent](/azure/sre-agent/automate-incidents).

## Verify with a test failure

To confirm that the alerts and the agent work together, create a pool whose start task always fails. The pool creates one compute node, which incurs compute charges until you delete the pool. Ensure your Batch account has enough core quota for one `Standard_D2s_v5` node.

1. Save the following pool definition as *sre-agent-test-pool.json*:

    ```json
    {
      "id": "sre-agent-test-pool",
      "vmSize": "Standard_D2s_v5",
      "virtualMachineConfiguration": {
        "imageReference": {
          "publisher": "canonical",
          "offer": "0001-com-ubuntu-server-jammy",
          "sku": "22_04-lts",
          "version": "latest"
        },
        "nodeAgentSKUId": "batch.node.ubuntu 22.04"
      },
      "targetDedicatedNodes": 1,
      "startTask": {
        "commandLine": "/bin/bash -c \"echo 'Simulated start task failure'; exit 3\"",
        "waitForSuccess": true,
        "maxTaskRetryCount": 0
      }
    }
    ```

1. Create the pool:

    ```azurecli
    az batch account login \
      --resource-group "$resourceGroup" \
      --name "$batchAccount"

    az batch pool create --json-file sre-agent-test-pool.json
    ```

1. Wait for the compute node to reach the `starttaskfailed` state:

    ```azurecli
    az batch node list \
      --pool-id sre-agent-test-pool \
      --query "[].{id:id, state:state, exitCode:startTaskInfo.exitCode}" \
      --output table
    ```

1. Within a few minutes, the `batch-start-task-failed` alert fires. In the SRE Agent portal, select **Incidents** and open the investigation thread for the alert. Confirm that the agent identifies the pool and compute node, reports the start task exit code, and recommends a fix.

1. Delete the test pool:

    ```azurecli
    az batch pool delete --pool-id sre-agent-test-pool --yes
    ```

## Investigate Batch issues in chat

You can also ask the agent about your Batch resources directly in a chat thread. For example:

- *Why did pool `<pool-id>` in Batch account `<batch-account-name>` fail to resize in the last hour?*
- *List the compute nodes in pool `<pool-id>` that are unusable or have failed start tasks, and summarize their errors.*
- *Which tasks in job `<job-id>` failed today, and what were their exit codes?*
- *Compare the dedicated and Spot core usage in Batch account `<batch-account-name>` with its core quotas.*

Include the Batch account name and, where relevant, the pool or job ID in your prompts so that the agent can query the right resources.

## Considerations

- **Start in Review mode.** With the Reader permission level and Review mode, the agent requests approval before it takes any action that changes resources, such as resizing or deleting a pool. Move to Autonomous mode only after you validate the agent's investigations for your workloads. For more information, see [Run modes in Azure SRE Agent](/azure/sre-agent/run-modes).
- **Expect monitoring latency.** Batch resource logs and metrics can take several minutes to reach Azure Monitor, so alerts and investigations start several minutes after an event occurs.
- **Add your own context.** Upload runbooks or documentation about your pools, start tasks, and applications so that the agent can tell expected behavior from failures. For more information, see [Upload knowledge documents](/azure/sre-agent/upload-knowledge-document).
- **Review the results.** The agent's conclusions are AI-generated. Verify the evidence in the investigation thread before you act on a recommendation.

## Related content

- [Azure SRE Agent overview](/azure/sre-agent/overview)
- [Monitor Azure Batch](monitor-batch.md)
- [Batch monitoring data reference](monitor-batch-reference.md)
- [Azure Batch pool and node errors](batch-pool-node-error-checking.md)
- [Batch service quotas and limits](batch-quota-limit.md)
