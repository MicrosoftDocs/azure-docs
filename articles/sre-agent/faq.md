---
title: Azure SRE Agent Preview frequently asked questions
description: Frequently asked questions in Azure SRE Agent.
author: craigshoemaker
ms.author: cshoe
ms.topic: concept-article
ms.date: 10/13/2025
ms.service: azure-sre-agent
---

# Azure SRE Agent Preview frequently asked questions

This article covers common problems that you might face when you're working with Azure SRE Agent, along with practical solutions to resolve them. The problems are typically related to permissions, regional availability, and administrative access requirements.

## Common troubleshooting scenarios

The following table outlines common problems and their solutions. For more information about how roles and permissions are applied to an agent, see [Security contexts in Azure SRE Agent](./access-management.md).

| Scenario | Reason | Remarks |
|---|---|---|
| The agent shows a permissions error in the chat and knowledge graph. | The agent is created with *Contributor* access, and an account with only *Reader* permissions attempts to interact with the agent. | Deny assignments, or Azure Policy blocks identity assignment to the agent resource group.  |
| The location dropdown list is blank. | A non-US region policy blocks access to Sweden Central. | If your subscription or management group is limited to US-only deployments, the creation step fails. |
| The **Create** button is unavailable. | The user account lacks administrative permissions. | Agent identity assignments fail if the user account lacks *Owner* or *User Access Administrator* permissions. |

## Deployment not found

There are few reasons why you might encounter an error that says the deployment isn't found. First, make sure that you're naming your agent correctly, and that you have the proper firewall rules in place:

* Ensure that the agent's name is unique across the subscription.
* Check for geo-blocking or firewall rules that can prevent access to the agent endpoint.

If your naming and your network configuration are correct, use the following steps to resolve the agent "DeploymentNotFound" error.

:::image type="content" source="media/troubleshoot/sre-agent-failure-notification.png" alt-text="Screenshot that shows a notification of provisioning failure in Azure SRE Agent.":::

1. Confirm that your user account has owner or admin permissions, along with permissions to create resources in the *Sweden Central*, *East US 2*, or *Australia East* regions (depending on your deployment).

1. Check whether the subscription is in the allow list for SRE Agent. Run the following command:

    ```azurecli
    az provider show -n Microsoft.App | grep -C 15 agents
    ```

    If your subscription is in the allow list, you get output similar to the following message.

    :::image type="content" source="media/troubleshoot/sre-agent-verify-access.png" alt-text="Screenshot of a console response that verifies user access to agents.":::

    Look specifically for `"resourcetype : agents"` and `"defaultApiVersion : 2025-05-01-preview"`.

    If running this command doesn't return the expected result, you need to register your subscription.

1. To re-register your subscription, run the `az provider register` command in Azure Cloud Shell via the Azure portal:

    ```azurecli
    az provider register --namespace "Microsoft.App"
    ```

    Then try creating the agent again.

## Permission errors

If you can't chat or interact with the agent, the problem might be related to a 403 Forbidden error or a cross-origin resource sharing (CORS) policy error. The following screenshot shows an example of the error message.

:::image type="content" source="media/troubleshoot/sre-agent-permission-errors.png" alt-text="Screenshot of errors that result from incorrect permissions.":::

Or, you might get the following output in your network trace.

:::image type="content" source="media/troubleshoot/sre-agent-network-trace-error.png" alt-text="Screenshot of a browser network trace when the agent encounters a permissions error.":::

To resolve the problem:

* Ensure that you have Contributor or Owner access to the resource group that hosts the agent.

* Avoid relying solely on group-based role assignments. Assign roles directly to your account if problems persist.

* Use the **Check Access** feature in the Azure portal to verify that you have the right permissions.

## Portal becomes unresponsive

If the Azure portal becomes unresponsive as you try to use SRE Agent, your firewall rules might be blocking access to an Azure domain.

To grant access to the proper domain, add `*.azuresre.ai` to the allow list in your firewall settings. Zscaler might block access to `*.azuresre.ai` domain by default.

## Related content

* [Security contexts in Azure SRE Agent](./access-management.md)
