---
title: Build a serverless agent using Azure Functions
description: "Learn how to create and deploy a serverless agent that runs on a schedule, uses a model deployment, calls MCP tools from a Microsoft 365 connection, and sends an email by using Azure Functions."
ms.date: 05/20/2026
ms.update-cycle: 180-days
ms.topic: quickstart
ai-usage: ai-assisted
ms.collection:
  - ce-skilling-ai-copilot
ms.custom:
  - build-2026
#Customer intent: As a developer, I want to deploy a serverless agent on Azure Functions so that I can run an event-driven AI workflow without writing the hosting, scheduling, model, and connector plumbing myself.
---

# Quickstart: Build a serverless agent using Azure Functions

In this quickstart, you deploy a serverless agent to Azure Functions by using the Azure Developer CLI (`azd`). The sample agent runs on a timer, gathers the day's top technology news, summarizes the stories, and sends the summary by email through a Microsoft 365 connection exposed as Model Context Protocol (MCP) tools.

The project uses the Azure Functions serverless agents runtime, which lets you define agents in markdown files, configure shared runtime settings in `agents.config.yaml`, connect remote MCP servers in `mcp.json`, and deploy the app like any other function app. The template provisions a function app in the Flex Consumption plan, a storage account, monitoring resources, a Microsoft Foundry project and model deployment, a Microsoft 365 connection, and the identity assignments needed by the app.

Because the new app runs on the Flex Consumption plan, which follows a pay-for-what-you-use billing model, completing this quickstart incurs a small cost in your Azure account.

## Prerequisites

+ [Azure Developer CLI (`azd`)](/azure/developer/azure-developer-cli/install-azd).
+ [Azure CLI](/cli/azure/install-azure-cli). You can also run Azure CLI commands in [Azure Cloud Shell](../cloud-shell/overview.md).
+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
+ Permissions to create resource groups, function apps, managed identities, Microsoft Foundry resources, model deployments, connector namespaces, and connections in your subscription.
+ A Microsoft 365 account that can authorize the email connection and send email.
+ A recipient email address that you can use to verify the agent output. We recommend using the same email account that you use to authorize the connection.

## Initialize the project

Use the `azd init` command to create a local project from the sample repository.

1. In Visual Studio Code, open a folder or workspace where you want to create your project.

1. In the Terminal, run this `azd init` command:

    ```console
    azd init --template Azure-Samples/serverless-agents-functions -e serverless-agent
    ```

    This command pulls the project files from the [serverless agents sample repository](https://github.com/Azure-Samples/serverless-agents-functions) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app and is also used in the names of resources created in Azure.

1. Set the recipient email address used by the agent:

    ```console
    azd env set TO_EMAIL <recipient@example.com>
    ```

    Replace `<recipient@example.com>` with your own email address, or with another recipient allowed by your organization's email policies. Some organizations restrict connector-based email to internal recipients or block messages to addresses outside the company, so sending the test message to yourself is the most reliable way to complete this quickstart.

## Review the project

Before you deploy, review the project files that define the serverless agent app:

| File or folder | Purpose |
| --- | --- |
| `src/function_app.py` | Creates the Azure Functions app by calling `create_function_app()` from the serverless agents runtime. |
| `src/*.agent.md` | Defines each agent. The YAML front matter declares the trigger, and the markdown body contains the agent instructions. |
| `src/agents.config.yaml` | Defines required shared runtime configuration, including the model deployment and sandbox settings used by agents in the app. |
| `src/mcp.json` | Lists the remote MCP servers available to the agents. In this template, `src` is the function app project root, and this file includes the MCP endpoint for the Microsoft 365 connection. |
| `infra/` | Contains the Bicep files used by `azd` to provision the function app, storage, monitoring, Foundry resources, model deployment, connector, and identity configuration. |

The timer-triggered agent is defined entirely in the `.agent.md` file. The front matter declares the timer schedule, and the markdown instructions tell the agent to gather news, create an HTML summary, and send the email to the address stored in the `TO_EMAIL` app setting.

## Deploy to Azure

Use `azd up` to provision Azure resources and deploy the function app.

1. In the Terminal, run this command from the root of the initialized project:

    ```console
    azd up
    ```

1. When prompted, select the Azure subscription and location to use for the resource group.

1. If the template prompts for model deployment settings, accept the provided defaults or choose a model deployment supported in your selected region.

After the command completes successfully, your app is deployed to a new function app in Azure. The deployment output includes links to the created resources.

## Authorize the connection

The deployment creates a connector namespace and a Microsoft 365 connection that the agent uses to send email. A connector defines an integration type, such as Microsoft Teams or Microsoft 365. A connection is an authenticated instance of a connector. Before the agent can call the connection's MCP tools, you need to authorize the connection.

1. In the [Azure portal](https://portal.azure.com), search for `Connector Namespace`.

1. Open the connector namespace created by `azd`. The resource is in the resource group created by `azd`, whose name starts with `rg-` and includes the environment name you chose during `azd init`.

    The connector namespace opens a connector management experience in a new portal.

1. In the connector namespace, open the Microsoft 365 or Office 365 connection created by the deployment.

1. Select **Authorize**, and then sign in with the Microsoft 365 account that can send the email.

After authorization succeeds, the function app's managed identity can use the connection's MCP endpoint during agent execution.

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
curl -X POST "https://<FUNCTION_APP_NAME>.azurewebsites.net/admin/functions/daily_tech_news" \
  -H "x-functions-key: <MASTER_KEY>" \
  -H "Content-Type: application/json" \
  -d "{}"
```

## Monitor the execution

Return to the **Logs** pane in **Code + Test** for the timer-triggered function. The logs show the function execution and runtime messages. Depending on the runtime log level, you might also see model and tool activity from the agent run.

You can also use Application Insights to review the execution after telemetry is ingested:

1. In the function app left menu, select **Application Insights**.

1. Open the associated Application Insights resource.

1. Use **Transaction search** or **Logs** to find the execution that started when you manually ran the function.

The run is complete when the logs show that the function execution finished successfully. Check the recipient inbox for an email with a daily technology news summary.

## Clean up resources

When you're done working with your serverless agent app, use this command to delete the function app and related resources from Azure to avoid incurring further costs:

```console
azd down
```

## Related content

+ [Serverless agents runtime in Azure Functions](functions-serverless-agents-runtime.md)
+ [Use AI tools and models in Azure Functions](functions-create-ai-enabled-apps.md)
+ [Manually run a non HTTP-triggered function](functions-manually-run-non-http.md)
+ [Monitor Azure Functions](monitor-functions.md)
