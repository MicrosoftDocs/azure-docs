---
title: Troubleshoot Common Problems in Azure SRE Agent Preview
description: Learn how to troubleshoot common problems in Azure SRE Agent.
author: craigshoemaker
ms.author: cshoe
ms.topic: concept-article
ms.date: 07/31/2025
ms.service: azure
---

# Troubleshoot common problems in Azure SRE Agent Preview

This article covers the common problems that you can face when you're working with Azure SRE Agent Preview. It also provides practical solutions to resolve them. The problems are typically related to permissions, regional availability, and administrative access requirements.

## Common troubleshooting scenarios

The following table outlines frequent issues that you might encounter and their solutions. For more information about how roles and permissions are applied to an agent, see [Security contexts in Azure SRE Agent](./security-context.md).

| Scenario | Reason | Remarks |
|---|---|---|
| The agent shows a permissions error in the chat and knowledge graph. | The agent is created with *Contributor* access and an account with only *Reader* permissions attempts to interact with the agent. | Deny assignments or Azure Policy blocks identity assignment to the agent resource group.  |
| The location dropdown is blank. | A non-US region policy blocks access to Sweden Central. | If your subscription or management group limits to US-only deployments, then the creation step fails. |
| The *Create* button is disabled. | Lack of administrative permissions. | Agent identity assignments fail if the user account lacks *Owner* or *User Access Administrator* permissions. |

## Deployment not found

There are few reasons why you might encounter an error that says the deployment isn't found. First, make sure that you're naming your agent correctly, and that you have the proper firewall rules in place:

* Ensure that the agent's name is unique across the subscription.
* Check for geo-blocking or firewall rules that can prevent access to the agent endpoint.

If your naming and your network configuration are correct, use the following steps to resolve the agent "DeploymentNotFound" error.

:::image type="content" source="media/troubleshoot/sre-agent-failure-notification.png" alt-text="Screenshot that shows a notification of provisioning failure in Azure SRE Agent.":::

1. Confirm that your user account has owner or admin permissions and permissions to create resources in the Sweden Central region.

1. Confirm that the subscription is in the allow list for SRE Agent Preview. Run the following command to check whether your subscription is in the allow list:

    ```azurecli
    az provider show -n Microsoft.App | grep -C 15 agents
    ```

    If your subscription is in the allow list, you see output similar to the following message.

    :::image type="content" source="media/troubleshoot/sre-agent-verify-access.png" alt-text="Screenshot of a console response that verifies user access to agents.":::

    Look specifically for `"resourcetype : agents"` and `"defaultApiVersion : 2025-05-01-preview"`.

    If running this command doesn't return the expected result, you need to register your subscription.

1. To re-register your subscription, run the `az provider register` command in Azure Cloud Shell in the Azure portal:

    ```azurecli
    az provider register --namespace "Microsoft.App"
    ```

    Then try creating the agent again.

## Permission errors

If can't chat or interact with the agent, and you encounter 403 Forbidden or CORS Policy errors, use the following steps to help resolve your issue.

The following screenshot shows the error message:

:::image type="content" source="media/troubleshoot/sre-agent-permission-errors.png" alt-text="Screenshot of errors that result from incorrect permissions.":::

Or, you might see the following output in your network trace:

:::image type="content" source="media/troubleshoot/sre-agent-network-trace-error.png" alt-text="Screenshot of the browser network trace when the agent encounters a permissions error.":::

To resolve the problem:

* Ensure you have Contributor or Owner access to the resource group that hosts the agent.

* Avoid relying solely on group-based role assignments. Assign roles directly to your account if problems persist.

* Use the **Check Access** feature in the Azure portal to verify that you have the right permissions.

## Portal becomes unresponsive

If the Azure portal becomes unresponsive as you try to use SRE Agent, your firewall rules might be blocking access to an Azure domain.

To grant access to the proper domain, add `*.azuresre.ai` to the allow list in your firewall settings. Zscaler might block access to `*.azuresre.ai` domain by default.

## Related content

* [Security contexts in Azure SRE Agent](./security-context.md)
