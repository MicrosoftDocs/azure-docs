---
title: Troubleshoot common issues in Azure SRE Agent (preview)
description: Learn to troubleshoot common problems in Azure SRE Agent.
author: craigshoemaker
ms.author: cshoe
ms.topic: tutorial
ms.date: 07/23/2025
ms.service: azure
---

# Troubleshoot common issues in Azure SRE Agent (preview)

This guide covers the common problems faced when working with Azure SRE Agent and provides practical solutions to resolve them. The issues are typically related to permissions, regional availability, and administrative access requirements.

## Common troubleshooting scenarios

The following table outlines frequent issues you might encounter and their solutions. For more information about how roles and permissions are applied to an agent, see [Security contexts in Azure SRE Agent](./security-context.md).

| Scenario | Reason | Remarks |
|---|---|---|
| The agent shows a permissions error in the chat and knowledge graph. | The agent is created with *Contributor* access and an account with only *Reader* permissions attempts to interact with the agent. | Deny assignments or Azure Policy blocks identity assignment to the agent resource group.  |
| The location dropdown is blank. | A non-US region policy blocks access to Sweden Central. | If your subscription or management group limits to US-only deployments, then the creation step fails. |
| The *Create* button is disabled. | Lack of administrative permissions. | Agent identity assignments fail if the user account lacks *Owner* or *User Access Administrator* permissions. |

## Deployment not found

There are few reasons you might encounter an error stating the deployment isn't found. First make sure you're naming your agent correctly, and you have the proper firewall rules in place:

* Ensure the agent’s name is unique across the subscription.
* Check for geo-blocking or firewall rules that can prevent access to the agent endpoint.

If you’re naming and your network configuration is correct, use the following steps to resolve the agent "couldn't be found" error.

:::image type="content" source="media/troubleshoot/sre-agent-failure-notification.png" alt-text="Screenshot of Azure SRE Agent provisioning failure notification.":::

1. Confirm your user account has owner or admin permissions and permissions to create resources in the Sweden Central region.

1. Confirm that the subscription is allow-listed for SRE Agent preview. Run the following command to check if your subscription is allow-listed:

    ```azurecli
    az provider show -n Microsoft.App | grep -C 15 agents
    ```

    If your subscription is allow-listed successfully, you see output similar to the following message.

    :::image type="content" source="media/troubleshoot/sre-agent-verify-access.png" alt-text="Screenshot of console response verifying user has access to agents.":::

    Look specifically for `"resourcetype : agents"` and `"defaultApiVersion : 2025-05-01-preview"`.

    If running this command doesn’t return the expected result, you need to register your subscription.

1. To re-register your subscription, run the az provider register command in the Azure portal cloud shell:

    ```azurecli
    az provider register --namespace "Microsoft.App"
    ```

    Try creating the SRE Agent again.

## Permission errors

If you're unable to chat or interact with the agent, and you encounter 403 Forbidden or CORS Policy errors, use the following steps to help resolve your issue.

The following screenshot shows the error message:

:::image type="content" source="media/troubleshoot/sre-agent-permission-errors.png" alt-text="Screenshot of errors resulting from incorrect permissions.":::

Or, you might see the following output in your network trace:

:::image type="content" source="media/troubleshoot/sre-agent-network-trace-error.png" alt-text="Screenshot of the browser network trace when the agent encounters a permissions error.":::

To resolve the issue:

* Ensure you have Contributor or Owner access to the resource group hosting the SRE Agent.

* Avoid relying solely on group-based role assignments. Assign roles directly to your account if issues persist.

* Use the *Check Access* feature in the Azure portal to verify you have the right permissions.

## Portal becomes unresponsive

If the Azure portal becomes unresponsive as you try to use SRE Agent, then your firewall rules might be blocking access to an Azure domain.

To grant access to the proper domain, allowlist `*.azuresre.ai` in your firewall settings.

## Related content

* [Security contexts](./security-context.md)
