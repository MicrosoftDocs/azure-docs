---
title: "Tutorial: Create an HTTP trigger in Azure SRE Agent"
description: Set up an HTTP trigger in Azure SRE Agent that runs a compliance check when called from a CI/CD pipeline or any HTTP client.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.date: 03/25/2026
ms.topic: tutorial
ms.service: azure-sre-agent
ai-usage: ai-assisted
#customer intent: As an SRE, I want to create an HTTP trigger so that external systems can invoke my agent automatically.
---

# Tutorial: Create an HTTP trigger in Azure SRE Agent

In this tutorial, you create an HTTP trigger that runs a compliance check on a container app. You test it from the portal and the command line, and then integrate it into a CI/CD pipeline.

**Estimated time**: 10 minutes

In this tutorial, you:

> [!div class="checklist"]
>
> - Create an HTTP trigger with a compliance check prompt
> - Test the trigger from the portal by using Run Now
> - Call the trigger from the command line with a JSON payload
> - Integrate the trigger into a CI/CD pipeline

## Prerequisites

- An agent in **Running** state with at least one Azure subscription configured
- Azure CLI installed (`az` command) for testing the webhook call

## Scenario

Your team deploys container app revisions multiple times a day. Each deployment should meet compliance standards for resource limits, health probes, ingress configuration, and scaling rules. Instead of checking manually, you create an HTTP trigger that your CI/CD pipeline calls after each deployment so the agent runs the compliance check automatically.

## Create the trigger

1. Go to your agent, and select **Builder** > **HTTP triggers**.

    The page loads with summary cards (Active triggers, Total triggers, Total runs) and an empty trigger list.

1. Select **Create trigger** in the toolbar. The **Create HTTP trigger** dialog opens.

1. Fill in the form:

    | Field | Value |
    | --- | --- |
    | **Trigger name** | Container App Compliance Check |
    | **Trigger details** | A new container app revision was deployed. Run a compliance check on the app: verify resource limits (CPU/memory), health probes, ingress configuration, and scaling rules. Report any issues. App: `{payload.app_name}` in resource group `{payload.resource_group}`. Revision: `{payload.revision_name}`. |
    | **Agent autonomy level** | Autonomous (Default) |
    | **Message grouping for updates** | New chat thread for each run |

    Leave **Response subagent** at its default unless you want a specific subagent to handle the check.

1. Select **Create Trigger**.

The trigger appears in the list with status **On**. The summary cards update to show one active trigger.

## Copy the trigger URL

1. Select the trigger name **Container App Compliance Check** to open the detail view.

    The detail view shows the **Trigger URL**, **Status**, **Last called**, and **Message grouping** fields.

1. Select the copy button next to the **Trigger URL**. Save the URL for later steps.

    The URL looks like: `https://<your-agent>.sre.azure.com/api/v1/httptriggers/trigger/<TRIGGER_ID>`

## Test with Run Now

1. Select **Run trigger now** in the toolbar. This action runs the trigger right away without an external call.

1. Wait a few seconds, then select **Update list** to refresh the execution history.

The execution history shows a new row with a timestamp, a linked thread, and a success status. Select the thread link to see the agent's compliance check plan and results.

## Call the trigger from the command line

Test the trigger the way your CI/CD pipeline would, by using a JSON payload.

Open a terminal and run the following commands:

```azurecli
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

Replace `<YOUR_TRIGGER_URL>` with the URL you copied earlier.

> [!NOTE]
> The agent receives your prompt with `{payload.app_name}`, `{payload.resource_group}`, and `{payload.revision_name}` replaced with the actual values from the JSON body. Fields that don't match a placeholder (like `deployed_by` and `image`) are appended as raw JSON context.

The response returns immediately with HTTP 202:

```json
{
  "message": "HTTP trigger execution initiated",
  "executionTime": "2026-03-24T10:30:00Z",
  "threadId": "thread-abc123",
  "success": true
}
```

Go back to the portal and select **Update list** in the detail view. A second execution appears in the history from the external call.

## Integrate with your pipeline

Add the trigger call to your CI/CD pipeline's post-deployment step. The following example shows a GitHub Actions workflow step:

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

Store your trigger URL as a GitHub secret (`SRE_TRIGGER_URL`). Don't hardcode it in your workflow file.

## Next step

> [!div class="nextstepaction"]
> [Learn about HTTP triggers](http-triggers.md)

## Related content

- [HTTP triggers](http-triggers.md)
- [Scheduled tasks](scheduled-tasks.md)
- [Workflow automation](workflow-automation.md)
