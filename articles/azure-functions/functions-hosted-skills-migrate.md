---
title: Migrate local agent workflows to Azure Functions hosted skills
description: Learn how to use your coding agent to migrate a local workflow to Azure Functions hosted skills, deploy it to Azure, and test the result.
ms.topic: how-to
ms.date: 11/06/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - ignite-2026
ms.collection:
  - ce-skilling-ai-copilot
# Customer intent: As a developer, I want to move a local coding-agent workflow to Azure Functions hosted skills so that it can run on a schedule or respond to events without my computer.
---

# Migrate local agent workflows to Azure Functions hosted skills

In this article, you use the [Azure Functions migration skill](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-hosted-skills-migrate/SKILL.md) with your coding agent to move a local workflow to [Azure Functions hosted skills](functions-hosted-skills.md). The example is a weekly GitHub activity report that runs on your computer. You migrate it to a timer-triggered hosted skill that runs in Azure.

The migration skill, `azure-functions-hosted-skills-migrate`, checks the workflow's dependencies and creates a function app from the Azure Functions hosted skills template. The deployed app doesn't need your computer or an active coding-agent session. You configure service access for the app separately from your local sign-in.

[!INCLUDE [functions-hosted-skills-preview](../../includes/functions-hosted-skills-preview.md)]

<!-- Related documentation:
The migration skill was merged in https://github.com/Azure/azure-functions-skills/pull/284
and is included in the repository's marketplace plugin payload.
Related skills documentation is in https://github.com/MicrosoftDocs/azure-docs-pr/pull/320869
and https://github.com/ggailey777/azure-docs-pr/pull/61. After those pages are available,
link the installation guide and migration skill reference from this article.
-->

## Choose a workflow to migrate

You can start from an automation prompt, agent definition, reusable skill, or code. The workflow must use operations that the deployed app can perform. Examples include:

| Local workflow | Migration approach |
| --- | --- |
| Read GitHub issues and pull requests, and summarize repository activity. | Use GitHub Connector operations to retrieve the required data. |
| Read mail, calendar entries, Teams messages, or a known SharePoint file. | Check the corresponding connector for the required operations and account access. |
| Format or analyze data with a script. | Convert the processing to Python and use explicit inputs and outputs instead of local file paths. |

These examples are candidates for migration, not a guarantee that every operation is available. The migration skill checks the required fields, filters, permissions, and service availability before generating the integration. If an operation isn't supported, you can change the workflow or leave it unmigrated. For exclusions, see [Migration limits](#migration-limits).

## Prerequisites

- GitHub Copilot CLI, the GitHub Copilot app, Claude Code, or Codex CLI. For plugin installation, see [Install Azure Functions skills](#install-azure-functions-skills).
- The instructions and dependencies for the workflow you want to migrate. Remove secrets and sensitive data before sharing them with your coding agent.
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Azure CLI](/cli/azure/install-azure-cli) and [Azure Developer CLI (`azd`)](/azure/developer/azure-developer-cli/install-azd) for deployment.
- Permissions to create the Azure resources and assign the roles required by the generated app.
- Access to a model deployment supported by Azure Functions hosted skills and to the services the workflow uses.

> [!NOTE]
> Running the migrated workflow can incur charges for Azure resources and model calls. Review the resources and expected usage before deployment.

## Install Azure Functions skills

Install the **Azure Functions skills** plugin from the `Azure/azure-functions-skills` marketplace. If you already installed the plugin, update it before continuing.

### [GitHub Copilot CLI](#tab/copilot-cli)

1. Start an interactive Copilot CLI session.

1. Add the marketplace and install the plugin:

   ```text
   /plugin marketplace add Azure/azure-functions-skills
   /plugin install azure-functions-skills@azure-functions-skills
   ```

   To update an existing installation, run:

   ```text
   /plugin update azure-functions-skills@azure-functions-skills
   ```

### [GitHub Copilot app](#tab/copilot-app)

1. Open **Settings**, and then select **Plugins**.
1. Select **Install**, and then add `Azure/azure-functions-skills` as a marketplace.
1. Select **azure-functions-skills**, review its contents, and confirm the installation.

### [Claude Code](#tab/claude-code)

1. Start an interactive Claude Code session.

1. Add the marketplace and install the plugin:

   ```text
   /plugin marketplace add Azure/azure-functions-skills
   /plugin install azure-functions-skills@azure-functions-skills
   ```

   To update an existing installation, run `/plugin`, open the **Installed** tab, select **azure-functions-skills**, and then select **Update now**.

### [Codex CLI](#tab/codex-cli)

1. In your terminal, add the marketplace.

   ```console
   codex plugin marketplace add Azure/azure-functions-skills
   ```

1. Start Codex, run `/plugins`, select **azure-functions-skills**, and then select **Install plugin**.

---

For other supported clients and current installation steps, see the [Azure Functions skills installation instructions](https://github.com/Azure/azure-functions-skills#quick-start). Installing the `@azure/functions-skills` npm package alone doesn't install the coding-agent plugin.

> [!NOTE]
> The migration skill requires Azure Functions skills version `0.0.7-preview` or later. Installing the plugin from the marketplace retrieves the latest version from the repository's `main` branch. If you already installed the plugin, update it before continuing.

## Check your environment

1. Start a new coding-agent session in the workspace that contains your workflow.

1. Enter this prompt to check the required tools and language runtimes:

   ```text
   Use azure-functions-setup to check my environment for an Azure Functions
   hosted skills project.
   ```

1. Follow the setup guidance to install or configure any missing tools.

The setup skill checks your environment. It doesn't migrate the workflow.

If the agent can't find `azure-functions-hosted-skills-migrate`, update the plugin by following the [installation instructions](https://github.com/Azure/azure-functions-skills#quick-start), and then start a new session.

## Prepare the source workflow

Start with an existing local workflow, such as an Automation in the GitHub Copilot app or a skill configured in Claude Code or Codex. This example uses an existing GitHub Copilot Automation named **Weekly GitHub report**. The following block shows the instructions saved in that Automation, not a request to create a new one. You can use your own workflow instead.

```text
Each week, review Azure/azure-functions-host and
Azure/azure-functions-python-worker.

List issues created or updated during the previous seven days, including
closed issues. Summarize open pull requests that need attention.
Include source links and explain the evidence for each suggested action.

Distinguish issues from pull requests. Report missing data and access errors.
Don't change GitHub content or local repositories.
Save the report in the Automation run's final response.
```

1. Select the workflow you want to migrate. Include the instructions, referenced skills, and scripts it needs.

1. Make the source available in your coding-agent session. For a GitHub Copilot Automation, provide its name, prompt, and schedule. If the agent can't read the Automation, paste that information into the session.

1. Identify where the workflow reads data and saves its result. In this example, the workflow reads GitHub issues and pull requests, and the report appears in the Automation run's final response. The hosted skill needs a GitHub connection and a destination for the report, such as cloud storage.

Don't include unrelated chat history, tokens, or credential stores. The migration skill preserves the original Automation and source files.

## Assess and convert the workflow

1. In the coding-agent session, enter a migration request that names the skill and the source workflow. For this example, use:

   ```text
   Use azure-functions-hosted-skills-migrate to migrate my GitHub Copilot
   Automation named "Weekly GitHub report" to Azure Functions hosted skills.
   Run the hosted skill every Monday at 9:00 AM UTC.
   ```

   You don't need to specify the project files or connector configuration. The migration skill reads the source and checks which operations can run in Azure. A general question about migration doesn't start the workflow.

1. Answer the agent's questions about the schedule, report destination, and service account. Review any differences from the local workflow, including operations that aren't supported.

1. Review the migration plan and approve the changes you want to make. The agent then creates the hosted skills project in a separate directory.

The generated project includes hosted skill definitions in `.agent.md` files, reusable skills, and Python tools where needed. It also includes `mcp.json` for the selected MCP servers and connector tools, and Bicep files for the required Azure resources. Unverified integrations remain unavailable until their required checks pass.

## Deploy to Azure

When the agent generates the project, ask it to deploy the project.

1. In the coding-agent session, enter:

   ```text
   Use azure-functions-hosted-skills to deploy the migrated workflow to Azure.
   ```

1. Confirm the Azure subscription, region, resources, and expected cost. Approve deployment when the settings match your requirements.

1. Follow the connection setup instructions. Sign in to the external services and grant consent where required. For this example, confirm which GitHub account the connection uses and which repositories it can access.

Keep scheduled execution disabled until you finish testing. Deployment and connection setup don't automatically approve the schedule.

## Test the migrated workflow

1. Follow the agent's instructions to run a controlled test of the deployed workflow.

1. Open the report in the selected destination. Check the reporting period, repositories, source links, and issue and pull request summaries against the source data.

1. Review the tests for empty results, access errors, and service failures. Check that a failed data retrieval produces an error, not a report that incorrectly claims there's no activity.

1. When the required checks pass, approve the hosted schedule. Disable the original Automation when you're ready to switch to the hosted report so that both workflows don't produce reports.

If a required check can't run, keep the schedule disabled and resolve the reported issue. To resume the migration, enter:

```text
Resume azure-functions-hosted-skills-migrate for this workflow.
```

## Service connections

The deployed app doesn't inherit your local sign-in. For a connector-based integration, the app needs permission to call the connector, and the connection needs authorization for the external account. A shared connection uses the account that authorized it, not the identity of each caller. Don't copy local user tokens into app settings.

The migration skill checks connector options first. For services other than GitHub, it can also use a remote HTTP MCP server or a Python API or SDK client if the deployed runtime supports the operation and authentication method.

GitHub access in this migration workflow uses GitHub Connector operations only. Direct GitHub API or SDK calls, personal access tokens, new GitHub App authentication, and customer GitHub MCP servers aren't supported alternatives.

For connection setup and permissions, see [Use managed connectors in Azure Functions](functions-connectors-overview.md).

## Migration limits

The migration skill doesn't convert workflows that require the hosted app to:

- Clone or change Git repositories, create pull requests, or run build and deployment pipelines.
- Create, delete, or change Azure resources or role assignments.
- Run arbitrary shell commands, local executables, desktop automation, or local `stdio` MCP servers.
- Use Work IQ CLI or direct Work IQ MCP access.

Some mail, Teams, and SharePoint operations can use connectors, but connectors don't replace Work IQ cross-service search or reasoning.

These limits apply to the migrated app, not to the coding agent that creates and deploys it. They don't prevent your local coding agent from deploying the app after you approve the deployment.

## Clean up resources

If you no longer need the test deployment, enter the following prompt in the coding-agent session:

```text
Show me the Azure resources created for this test deployment.
```

Review the list before approving removal. Keep any connections or storage that other apps still use, and keep your original source files.

## Related content

- [Azure Functions hosted skills overview](functions-hosted-skills.md)
- [Build an event-driven AI app with Azure Functions hosted skills](scenario-hosted-skills.md)
- [Azure Functions hosted skills reference](functions-hosted-skills-reference.md)
- [Azure Functions skills installation instructions](https://github.com/Azure/azure-functions-skills#quick-start)
- [Migration skill source](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-hosted-skills-migrate/SKILL.md)
