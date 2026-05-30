---
title: Build serverless agents using Azure Functions
description: "Learn how to create and deploy serverless agents that use a model deployment, sandboxed execution, and optional MCP tools from a Microsoft 365 Outlook connector by using Azure Functions."
ms.date: 05/20/2026
ms.update-cycle: 180-days
ms.topic: quickstart
ai-usage: ai-assisted
ms.collection:
  - ce-skilling-ai-copilot
ms.custom:
  - build-2026
#Customer intent: As a developer, I want to deploy serverless agents on Azure Functions so that I can run event-driven AI workflows without writing the hosting, scheduling, model, and connector plumbing myself.
---

# Quickstart: Build serverless agents using Azure Functions

In this quickstart, you deploy serverless agents to Azure Functions by using the Azure Developer CLI (`azd`). The sample includes two agents:

+ A chat agent that you can use to test the deployed app in a browser. This agent can use sandboxed Python code execution and browse the web.
+ A timer-triggered agent that gathers recent Microsoft blog posts, summarizes them, and can email the digest through MCP tools from a managed MCP server for a Microsoft 365 Outlook connector.

The project uses the [Azure Functions serverless agents runtime](functions-serverless-agents-runtime.md). You define agents in markdown files, configure app-wide runtime defaults in `agents.config.yaml`, connect remote MCP servers in `mcp.json`, and deploy the app like any other function app.

The template provisions a Flex Consumption function app, storage, monitoring, a Microsoft Foundry project and model deployment, an Azure Container Apps dynamic session pool, and the required identity assignments. When email delivery is enabled, it also provisions a Connector Namespace, a Microsoft 365 Outlook connection, and a managed MCP server for the connector.

Completing this quickstart can incur a small cost in your Azure account because the app uses the Flex Consumption plan and related Azure resources.

## Prerequisites

+ [Azure Developer CLI (`azd`)](/azure/developer/azure-developer-cli/install-azd).
+ [Azure CLI](/cli/azure/install-azure-cli). You can also run Azure CLI commands in [Azure Cloud Shell](../cloud-shell/overview.md).
+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
+ Permissions to create resource groups, function apps, managed identities, Microsoft Foundry resources, model deployments, Azure Container Apps session pools, Connector Namespaces, and connections in your subscription.
+ To enable email delivery, a Microsoft 365 account that you can sign in to, that can send email, and that you can use as the recipient address to verify the agent output.

## Initialize the project

Use the `azd init` command to create a local project from the sample repository.

1. In Visual Studio Code, open a folder or workspace where you want to create your project.

1. In the Terminal, run this `azd init` command:

    ```console
    azd init --template Azure-Samples/functions-quickstart-serverless-agents-azd -e serverless-agents
    ```

    This command pulls the project files from the [serverless agents sample repository](https://github.com/Azure-Samples/functions-quickstart-serverless-agents-azd) and initializes the project in the current folder. The `-e` flag names the current `azd` environment, which tracks deployment state and is used in Azure resource names.

1. Enable email delivery by setting the recipient email address used by the timer agent. Later in this quickstart, you must sign in to a Microsoft 365 account to authorize the Microsoft 365 Outlook connection that sends the email.

    ```console
    azd env set TO_EMAIL <recipient@example.com>
    ```

    Replace `<recipient@example.com>` with your own email address, or with another recipient allowed by your organization's email policies. Some organizations restrict connector-based email to internal recipients or block external recipients, so sending the test message to yourself is the most reliable option.

    > [!NOTE]
    > Email delivery is optional in the sample. If you skip this setting, `azd up` doesn't create the Connector Namespace, Microsoft 365 Outlook connection, or managed MCP server. The timer agent still runs and returns the digest in its final response so you can verify the run in logs or Application Insights.

## Review the project

Before you deploy, review the project files that define the serverless agent app:

| File or folder | Purpose |
| --- | --- |
| `src/main.agent.md` | Defines the chat agent and enables built-in endpoints for the debug chat UI. This agent can use sandboxed Python code execution and doesn't use the Microsoft 365 Outlook managed MCP server. |
| `src/daily_microsoft_blog_summary.agent.md` | Defines the timer-triggered Microsoft blog summary agent. The YAML front matter declares the timer trigger, and the markdown body contains the agent instructions. |
| `src/agents.config.yaml` | Defines app-wide runtime defaults, including the model deployment and Azure Container Apps dynamic session pool endpoint used by agents in the app. |
| `src/mcp.json` | Lists the remote MCP servers available to the agents. In this template, `src` is the function app project root, and this file includes the managed MCP server endpoint for Microsoft 365 Outlook when email delivery is enabled. |
| `infra/` | Contains the Bicep files used by `azd` to provision the function app, storage, monitoring, Foundry resources, model deployment, session pool, optional Connector Namespace resources, and identity configuration. |
| `src/function_app.py` | Required bootstrap file for the Functions host. You usually don't need to edit this file. |

The timer-triggered agent is defined in `daily_microsoft_blog_summary.agent.md`. The front matter declares the timer schedule, and the markdown instructions tell the agent to gather recent Microsoft blog posts, create a digest, and send email when `TO_EMAIL` is configured.

## Deploy to Azure

Use `azd up` to provision Azure resources and deploy the function app.

1. In the Terminal, run this command from the root of the initialized project:

    ```console
    azd up
    ```

1. When prompted, select the Azure subscription and location to use for the resource group.

    The template uses its default Microsoft Foundry model deployment settings unless you customize the Bicep parameters.

After the command completes, the app is deployed to a new function app in Azure. The deployment output includes links to the created resources.

## Authorize the connection

When `TO_EMAIL` is set, the deployment creates a Connector Namespace with a Microsoft 365 Outlook connection and a managed MCP server. This setup lets the timer agent send email through connector tools without custom Outlook API code. Before the agent can send email, authorize the connection by signing in to a Microsoft 365 account that can send email.

If you didn't set `TO_EMAIL`, skip this section.

1. In the [Azure portal](https://portal.azure.com), search for `Connector Namespace`.

1. Open the Connector Namespace resource created by `azd`. The resource is in the resource group created by `azd`, whose name starts with `rg-` and includes the environment name you chose during `azd init` (`serverless-agents` if you used the example command).

    Selecting the resource opens the Connector Namespaces portal, a separate experience for browsing and managing the connections, triggers, and MCP servers in the namespace.

1. In the Connector Namespaces portal, find the Microsoft 365 Outlook connector, and then open the connection created by the deployment.

1. Select **Authenticate**, and then sign in with the Microsoft 365 account that can send email.

After authentication succeeds, the function app's managed identity can call the managed MCP server, which uses the authorized connection to send email.

## Use the debug chat agent

The sample includes a chat agent that can use Python code execution through the Azure Container Apps dynamic session pool. The chat UI is a debug surface for testing the deployed agent app.

After `azd up` completes, open the function app endpoint shown in the deployment output, and then go to `/agents/main/`. When the chat UI loads, it prompts for a function key so it can call the agent's chat endpoint.

Get the default function key for the app:

```console
az functionapp keys list \
  --resource-group <RESOURCE_GROUP> \
  --name <FUNCTION_APP_NAME> \
  --query "functionKeys.default" \
  --output tsv
```

Paste the returned key into the chat UI prompt.

Try asking the chat agent a question that benefits from current public information or code execution. For example, ask `What's the weather in Seattle right now?` or `Compare the current weather in Seattle and New York.`

The chat agent doesn't use the Microsoft 365 Outlook managed MCP server. Email delivery is only used by the timer-triggered blog summary agent.

## Run the timer agent on demand

The agent runs automatically on its timer schedule. To test it immediately, manually run the timer-triggered function from the Azure portal.

1. In the [Azure portal](https://portal.azure.com), open the function app created by `azd`.

1. In the **Overview** blade, select **Functions**, and then select the timer-triggered agent function named `daily_microsoft_blog_summary`.

1. Select **Code + Test**.

1. Select **Logs** to open the log stream for this function.

1. Select **Test/Run**, leave the request body as `{}`, and then select **Run**.

The request returns an accepted response, and the function execution starts in the background.

## Monitor the execution

Return to the **Logs** pane in **Code + Test** for the timer-triggered function. The logs show function execution and runtime messages. Depending on the runtime log level, you might also see model and tool activity.

You can also use Application Insights to review the execution after telemetry is ingested:

1. In the function app left menu, select **Application Insights**.

1. Open the associated Application Insights resource.

1. Use **Transaction search** or **Logs** to find the execution that started when you manually ran the function.

The run is complete when the logs show that the function execution finished successfully. If email delivery is enabled and the Microsoft 365 Outlook connection is authorized, check the recipient inbox for the Microsoft blog digest. Otherwise, review the agent's final response in the function logs or Application Insights.

## Clean up resources

When you're done, use this command to delete the function app and related resources from Azure:

```console
azd down
```

## Related content

+ [Serverless agents runtime in Azure Functions](functions-serverless-agents-runtime.md)
+ [Use AI tools and models in Azure Functions](functions-create-ai-enabled-apps.md)
+ [Manually run a non HTTP-triggered function](functions-manually-run-non-http.md)
+ [Monitor Azure Functions](monitor-functions.md)
