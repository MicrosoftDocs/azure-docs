---
title: Azure SRE Agent operations troubleshooting FAQ
description: Troubleshooting guide for common deployment and operational issues with Azure SRE Agent.
#customer intent: As an IT admin, I want to resolve Azure SRE Agent permission errors so that I can ensure proper access for users.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.topic: faq
ms.date: 02/06/2026
ms.service: azure-sre-agent
---

# Azure SRE Agent operations troubleshooting FAQ

This article covers common operational problems when working with Azure SRE Agent, along with practical solutions. These problems typically relate to permissions, regional availability, deployment issues, and administrative access requirements.

## Common troubleshooting scenarios

The following table outlines common problems and their solutions. For more information about how roles and permissions are applied to an agent, see [Roles and permissions](./roles-permissions-overview.md).

| Scenario | Reason | Solution |
|---|---|---|
| The agent shows a permissions error in the chat and knowledge graph. | The agent is created with *Contributor* access, and an account with only *Reader* permissions attempts to interact with the agent. | Grant *Contributor* or *Owner* access to the user account on the resource group. |
| The location dropdown list is blank. | A non-US region policy blocks access to Sweden Central. | If your subscription or management group is limited to US-only deployments, use East US 2 for deployment. |
| The **Create** button is unavailable. | The user account lacks administrative permissions. | Ensure the user account has *Owner* or *User Access Administrator* permissions. |
| Agent can't query logs or metrics. | Insufficient permissions on Log Analytics workspaces. | Grant the agent's managed identity *Log Analytics Reader* permissions on target workspaces. |
| External integrations fail. | Network connectivity or authentication issues. | Check firewall rules and verify service principal configurations. |

## Deployment issues

The following sections cover common problems you might encounter when deploying Azure SRE Agent.

### Deployment not found

You might encounter an error that says the deployment isn't found for several reasons. First, make sure that you're naming your agent correctly, and that you have the proper firewall rules in place:

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

### Deployment validation errors

If deployment validation fails:

1. **Check resource quotas**: Ensure your subscription has available quota for the deployment region.
1. **Verify resource provider registration**: Confirm Microsoft.App provider is registered.
1. **Review Azure Policy**: Check if organizational policies block resource creation.

## Permission and access problems

The following sections address issues related to permissions and access control for Azure SRE Agent.

### Permission errors

If you can't chat or interact with the agent, the problem might be related to a 403 Forbidden error or a cross-origin resource sharing (CORS) policy error. The following screenshot shows an example of the error message.

:::image type="content" source="media/troubleshoot/sre-agent-permission-errors.png" alt-text="Screenshot of errors that result from incorrect permissions.":::

Or, you might get the following output in your network trace.

:::image type="content" source="media/troubleshoot/sre-agent-network-trace-error.png" alt-text="Screenshot of a browser network trace when the agent encounters a permissions error.":::

To resolve the problem:

* Ensure that you have Contributor or Owner access to the resource group that hosts the agent.
* Avoid relying solely on group-based role assignments. Assign roles directly to your account if problems persist.
* Use the **Check Access** feature in the Azure portal to verify that you have the right permissions.

### Agent managed identity problems

If the agent can't access Azure resources:

1. **Verify managed identity creation**: Check that the agent's managed identity is created successfully.
1. **Check role assignments**: Make sure the managed identity has the right permissions on target resources.
1. **Review conditional access policies**: Make sure organizational policies don't block managed identity access.

## Network and connectivity problems

The following sections help you resolve network and connectivity issues that can affect Azure SRE Agent.

### Portal becomes unresponsive

If the Azure portal becomes unresponsive as you try to use SRE Agent, your firewall rules might be blocking access to an Azure domain.

To grant access to the proper domain, add `*.azuresre.ai` to the allow list in your firewall settings. Zscaler might block access to `*.azuresre.ai` domain by default.

### WebSocket connection failures

If real-time chat features don't work:

1. **Check proxy settings**: Corporate proxies might block WebSocket connections.
1. **Verify firewall rules**: Make sure `*.azuresre.ai` is on the allow list for both HTTP and WebSocket traffic.
1. **Test network connectivity**: Use browser developer tools to check for connection errors.

## Performance problems

The following sections address common performance-related issues with Azure SRE Agent.

### Slow response times

If agent responses are slower than expected:

1. **Check Azure service health**: Verify no outages in your deployment region.
1. **Review query complexity**: Complex log queries might take longer to process.
1. **Monitor resource limits**: Ensure target resources (Log Analytics, and others) aren't throttled.

### Chat interface loading problems

If the chat interface doesn't load:

1. **Clear browser cache**: Force refresh the page (Ctrl+F5).
1. **Try incognito or private browsing**: Rule out browser extension conflicts.
1. **Check JavaScript console**: Look for error messages in browser developer tools.

## Integration troubleshooting

The following sections help you troubleshoot problems with external service integrations.

### GitHub or Azure DevOps connection failures

If source control integrations fail:

1. **Verify authentication**: Check service principal or personal access token permissions.
1. **Test API access**: Ensure the agent can reach external service APIs.
1. **Review firewall rules**: Confirm outbound access to github.com or dev.azure.com.

### Custom MCP server problems

If custom Model Context Protocol servers don't work:

1. **Check server health**: Verify the MCP server is running and accessible.
1. **Test authentication**: Ensure proper authentication configuration.
1. **Review logs**: Check agent logs for connection or protocol errors.

## Data and storage problems

The following sections cover issues related to data storage and retrieval in Azure SRE Agent.

### Missing conversation history

If conversation threads disappear:

1. **Check data retention settings**: Verify configured retention policies.
1. **Review access permissions**: Ensure you have access to the conversation data.
1. **Contact support**: For data recovery assistance.

### Knowledge base upload failures

If document uploads to the knowledge base fail:

1. **Check file size limits**: Ensure documents are within size constraints.
1. **Verify file formats**: Confirm supported document types.
1. **Review storage permissions**: Check managed identity access to blob storage.

## Getting help

Use the following resources if you need additional assistance beyond what this guide covers.

### Escalation paths

For problems that this guide doesn't cover, try the following options:

- **Azure Support**: Create a support ticket for deployment or service problems.
- **Microsoft Docs**: Check the [official documentation](overview.md) for updates.
- **Azure Status**: Monitor the [Azure Status page](https://status.azure.com) for service outages.

## Related content

- [General FAQ](faq.md)
- [Security and compliance FAQ](faq-security-compliance.md)
- [Roles and permissions](roles-permissions-overview.md)
- [Agent run modes](agent-run-modes.md)
