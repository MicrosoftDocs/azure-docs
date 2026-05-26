---
title: Build serverless agents using Azure Functions
description: "Learn how to create and deploy serverless agents that use a model deployment, sandboxed execution, and optional MCP tools from an Office 365 Outlook connection by using Azure Functions."
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

In this quickstart, you deploy serverless agents to Azure Functions by using the Azure Developer CLI (`azd`). The sample includes a chat agent and a timer-triggered agent. The timer agent gathers recent Microsoft blog posts, summarizes them, and can email the digest through an Office 365 Outlook connection exposed as Model Context Protocol (MCP) tools.

The project uses the Azure Functions serverless agents runtime. You define agents in markdown files, configure app-wide runtime defaults in `agents.config.yaml`, connect remote MCP servers in `mcp.json`, and deploy the app like any other function app. The template provisions a Flex Consumption function app, storage, monitoring, a Microsoft Foundry project and model deployment, an Azure Container Apps dynamic session pool, and the required identity assignments. When email delivery is enabled, it also provisions Office 365 Outlook Connector Gateway resources.

Completing this quickstart can incur a small cost in your Azure account because the app uses the Flex Consumption plan and related Azure resources.

## Prerequisites

+ [Azure Developer CLI (`azd`)](/azure/developer/azure-developer-cli/install-azd).
+ [Azure CLI](/cli/azure/install-azure-cli). You can also run Azure CLI commands in [Azure Cloud Shell](../cloud-shell/overview.md).
+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
+ Permissions to create resource groups, function apps, managed identities, Microsoft Foundry resources, model deployments, Azure Container Apps session pools, Connector Gateway resources, and connections in your subscription.
+ To enable email delivery, a Microsoft 365 account that can authorize the Office 365 Outlook connection and send email.
+ To enable email delivery, a recipient email address that you can use to verify the agent output. We recommend using the same email account that you use to authorize the connection.

## Initialize the project

Use the `azd init` command to create a local project from the sample repository.

1. In Visual Studio Code, open a folder or workspace where you want to create your project.

1. In the Terminal, run this `azd init` command:

    ```console
    azd init --template Azure-Samples/functions-quickstart-serverless-agents-azd -e serverless-agent
    ```

    This command pulls the project files from the [serverless agents sample repository](https://github.com/Azure-Samples/functions-quickstart-serverless-agents-azd) and initializes the project in the current folder. The `-e` flag names the current `azd` environment, which tracks deployment state and is used in Azure resource names.

1. Enable email delivery by setting the recipient email address used by the timer agent:

    ```console
    azd env set EMAIL_RECIPIENT <recipient@example.com>
    ```

    Replace `<recipient@example.com>` with your own email address, or with another recipient allowed by your organization's email policies. Some organizations restrict connector-based email to internal recipients or block external recipients, so sending the test message to yourself is the most reliable option.

    Email delivery is optional in the sample. If you skip this setting, `azd up` doesn't create the Office 365 Outlook Connector Gateway resources. The timer agent still runs and returns the digest in its final response so you can verify the run in logs or Application Insights.

## Review the project

Before you deploy, review the project files that define the serverless agent app:

| File or folder | Purpose |
| --- | --- |
| `src/function_app.py` | Creates the Azure Functions app by calling `create_function_app()` from the serverless agents runtime. |
| `src/main.agent.md` | Defines the chat agent. This agent can use sandboxed Python code execution and doesn't use the Office 365 Outlook MCP server. |
| `src/daily_microsoft_blog_summary.agent.md` | Defines the timer-triggered Microsoft blog summary agent. The YAML front matter declares the timer trigger, and the markdown body contains the agent instructions. |
| `src/agents.config.yaml` | Defines app-wide runtime defaults, including the model deployment and Azure Container Apps session pool endpoint used by agents in the app. |
| `src/mcp.json` | Lists the remote MCP servers available to the agents. In this template, `src` is the function app project root, and this file includes the Office 365 Outlook MCP endpoint when email delivery is enabled. |
| `infra/` | Contains the Bicep files used by `azd` to provision the function app, storage, monitoring, Foundry resources, model deployment, session pool, optional Connector Gateway resources, and identity configuration. |

The timer-triggered agent is defined in `daily_microsoft_blog_summary.agent.md`. The front matter declares the timer schedule, and the markdown instructions tell the agent to gather recent Microsoft blog posts, create a digest, and send email when `EMAIL_RECIPIENT` is configured.

## Deploy to Azure

Use `azd up` to provision Azure resources and deploy the function app.

1. In the Terminal, run this command from the root of the initialized project:

    ```console
    azd up
    ```

1. When prompted, select the Azure subscription and location to use for the resource group.

1. If the template prompts for model deployment settings, accept the provided defaults or choose a model deployment supported in your selected region.

After the command completes, the app is deployed to a new function app in Azure. The deployment output includes links to the created resources.

## Use the chat agent

The sample includes a chat agent that can use Python code execution through the Azure Container Apps dynamic session pool. After `azd up` completes, open the function app endpoint shown in the deployment output. The default chat UI is served from the app root.

The chat agent doesn't use the Office 365 Outlook MCP server. Email delivery is only used by the timer-triggered blog summary agent.

## Authorize the connection

When `EMAIL_RECIPIENT` is set, the deployment creates an Office 365 Outlook Connector Gateway connection that the timer agent uses to send email. A connector defines an integration type, such as Microsoft Teams or Office 365 Outlook. A connection is an authenticated instance of a connector. Before the agent can call the connection's MCP tools, authorize the connection.

If you didn't set `EMAIL_RECIPIENT`, skip this section.

1. In the [Azure portal](https://portal.azure.com), search for `Connector Gateway`.

1. Open the Connector Gateway resource created by `azd`. The resource is in the resource group created by `azd`, whose name starts with `rg-` and includes the environment name you chose during `azd init`.

1. In the Connector Gateway resource, open the Office 365 Outlook connection created by the deployment.

1. Select **Authorize**, and then sign in with the Microsoft 365 account that can send email.

After authorization succeeds, the function app's managed identity can use the connection's MCP endpoint.

## Run the agent on demand

The agent runs automatically on its timer schedule. To test it immediately, manually run the timer-triggered function from the Azure portal.

1. In the [Azure portal](https://portal.azure.com), open the function app created by `azd`.

1. In the left menu, expand **Functions**, and then select the timer-triggered agent function.

1. Select **Code + Test**.

1. Select **Logs** to open the log stream for this function.

1. Select **Test/Run**, leave the request body as `{}`, and then select **Run**.

The request returns an accepted response, and the function execution starts in the background.

If the **Test/Run** action isn't available in your portal experience, you can call the admin endpoint directly. Replace the placeholders with your function app and resource group names:

```console
az functionapp keys list \
  --resource-group <RESOURCE_GROUP> \
  --name <FUNCTION_APP_NAME> \
  --query "masterKey" \
  --output tsv
```

Copy the returned master key, and then run this request:

```console
curl -X POST "https://<FUNCTION_APP_NAME>.azurewebsites.net/admin/functions/daily_microsoft_blog_summary" \
  -H "x-functions-key: <MASTER_KEY>" \
  -H "Content-Type: application/json" \
  -d "{}"
```

## Monitor the execution

Return to the **Logs** pane in **Code + Test** for the timer-triggered function. The logs show function execution and runtime messages. Depending on the runtime log level, you might also see model and tool activity.

You can also use Application Insights to review the execution after telemetry is ingested:

1. In the function app left menu, select **Application Insights**.

1. Open the associated Application Insights resource.

1. Use **Transaction search** or **Logs** to find the execution that started when you manually ran the function.

The run is complete when the logs show that the function execution finished successfully. If email delivery is enabled and the Office 365 Outlook connection is authorized, check the recipient inbox for the Microsoft blog digest. Otherwise, review the agent's final response in the function logs or Application Insights.

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
