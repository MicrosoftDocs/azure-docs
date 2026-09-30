---
title: 'Tutorial: Create an HTTP Trigger in Azure SRE Agent'
description: Set up an HTTP trigger in Azure SRE Agent that runs a compliance check when called from a CI/CD pipeline or any HTTP client.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.date: 03/30/2026
ms.topic: tutorial
ms.service: azure-sre-agent
ms.ai-usage: ai-assisted
ms.custom: http trigger, tutorial, webhook, compliance check, ci/cd, container apps
#customer intent: As an SRE, I want to create an HTTP trigger so that external systems can invoke my agent automatically.
---

# Tutorial: Create an HTTP trigger in Azure SRE Agent

In this tutorial, you create an HTTP trigger that runs a compliance check on a container app. You test it from the portal and the command line, and then integrate it into a continuous integration and continuous delivery (CI/CD) pipeline.

**Estimated time**: 10 minutes

In this tutorial, you:

> [!div class="checklist"]
>
> - Create an HTTP trigger with a compliance check prompt.
> - Test the trigger from the portal by using **Run Now**.
> - Call the trigger from the command line with a JSON payload.
> - Integrate the trigger into a CI/CD pipeline.

## Prerequisites

- Azure SRE Agent in **Running** state with at least one Azure subscription configured.
- Azure CLI installed (`az` command) for testing the webhook call.

## Scenario

Your team deploys container app revisions multiple times a day. Each deployment should meet compliance standards, with correct resource limits, health probes configured, and ingress rules set. Instead of manually checking after every deployment, you create an HTTP trigger that your CI/CD pipeline calls after each deployment. The agent runs the compliance check automatically.

## Open HTTP triggers

To open HTTP triggers, go to **Builder** > **HTTP triggers** on the service menu.

**Checkpoint:** The page loads with summary cards (**Active triggers**: 0, **Total triggers**: 0, **Total runs**: 0) and an empty trigger list.

## Step 1: Create the trigger

1. Select **Create trigger** on the toolbar. The **Create HTTP trigger** dialog opens.

1. Fill in the following fields on the form.

    | Field | Value |
    |-------|-------|
    | **Trigger name** | Container App Compliance Check. |
    | **Trigger details** | A new container app revision was deployed. Run a compliance check on the app. Verify that resource limits (CPU/memory), health probes, ingress configuration, and scaling rules are configured correctly. Report any issues found. App details: `{payload.app_name}` in resource group `{payload.resource_group}`. Revision: `{payload.revision_name}`. |
    | **Agent autonomy level** | Autonomous (default). |
    | **Message grouping for updates** | New chat thread for each run. |

1. Leave **Response subagent** at its default unless you want a specific subagent to handle the check.

1. Select **Create Trigger**.

**Checkpoint:** The trigger appears in the list with status **On** (green badge). The summary cards update to show one active trigger.

## Step 2: Copy the trigger URL

1. Select the trigger name **Container App Compliance Check** to open the detail view.

1. You see the following fields:

    - **Trigger URL**: Webhook endpoint with a **Copy** button
    - **Status**: On
    - **Last called**: Never
    - **Message grouping**: New thread for each run

1. Select the **Copy** button next to the trigger URL. Save the URL because you use it in step 4.

**Checkpoint:** You have the trigger URL copied. It looks like `https://<your-agent>.sre.azure.com/api/v1/httptriggers/trigger/<trigger-id>`.

## Step 3: Test with Run Now

1. Select **Run trigger now** on the toolbar. This action runs the trigger immediately without an external call.

1. Wait a few seconds, and then select **Update list** to refresh the execution history.

**Checkpoint:** The execution history shows a new row with a timestamp, a linked thread, and success status. Select the thread link to see the agent's response.

The agent creates a thread titled **HTTP Trigger: Container App Compliance Check**. Inside, you see the execution card with the compliance check plan, followed by the agent's full investigation and a verdict table with compliance results.

## Step 4: Call the trigger from the command line

Now test it the way that your CI/CD pipeline would, with a real payload. Open a terminal and run:

```bash
# Get an ARM token (use the SRE Agent app ID as the resource)
TOKEN=$(az account get-access-token --resource 59f0a04a-b322-4310-adc9-39ac41e9631e --query accessToken -o tsv)

# Call the trigger with container app deployment details
curl -X POST \
  "<YOUR_TRIGGER_URL>" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "app_name": "checkout-api",
    "resource_group": "rg-production",
    "revision_name": "checkout-api--v3",
    "deployed_by": "github-actions",
    "image": "myregistry.azurecr.io/checkout-api:v3.2.1"
  }'
```

Replace `<YOUR_TRIGGER_URL>` with the URL that you copied in step 2.

**What happens:** The agent receives your prompt with `{payload.app_name}`, `{payload.resource_group}`, and `{payload.revision_name}` replaced with the actual values. Fields that don't match a placeholder (like `deployed_by` and `image`) are appended as raw JSON context.

The response returns immediately with HTTP 202:

```json
{
  "message": "HTTP trigger execution initiated",
  "executionTime": "2026-03-13T10:30:00Z",
  "threadId": "thread-abc123",
  "success": true
}
```

**Checkpoint:** Go back to the portal, and select **Update list** in the detail view. You should see a second execution in the history. This one is from the external call. Select the thread link to see the agent's compliance check with the real app details populated.

## Step 5: Integrate with your pipeline

Add the trigger call to your CI/CD pipeline's post-deployment step. Here's an example for GitHub Actions:

```yaml
- name: Trigger SRE Agent compliance check
  if: success()
  run: |
    TOKEN=$(az account get-access-token --resource 59f0a04a-b322-4310-adc9-39ac41e9631e --query accessToken -o tsv)
    curl -s -X POST "${{ secrets.SRE_TRIGGER_URL }}" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "app_name": "${{ env.APP_NAME }}",
        "resource_group": "${{ env.RESOURCE_GROUP }}",
        "revision_name": "${{ env.REVISION_NAME }}",
        "deployed_by": "${{ github.actor }}",
        "commit": "${{ github.sha }}"
      }'
```

Store your trigger URL as a GitHub secret (`SRE_TRIGGER_URL`). Never hardcode it in your workflow file.

## Step 6: Clean up resources

If you don't need the trigger anymore, delete it:

1. Go to **Builder** > **HTTP triggers**.
1. Select the trigger checkbox.
1. Select **Delete**.

## Related content

- [HTTP triggers](http-triggers.md)
- [Create a scheduled task](create-scheduled-task.md)
- [Create a subagent](create-subagent.md)