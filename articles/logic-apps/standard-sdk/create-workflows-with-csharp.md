---
title: Create Standard Workflow Projects with the SDK
description: Create and set up projects with code-first workflows with the Azure Logic Apps Standard SDK in Visual Studio Code.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.author: wsilveira
ms.reviewers: ecfan, azla
ms.topic: how-to
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 05/26/2026
ms.custom:
- build-2026
# Customer intent: As an integration developer who works with Azure Logic Apps, I want to create a workflow project by using the Standard SDK so I can programmatically automate processes with code-first workflows.
---

# Create Standard workflow projects with C# by using the Azure Logic Apps Standard SDK (preview)

> [!IMPORTANT]
>
> This preview feature is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When you want to programmatically build workflows by using the tools in Visual Studio Code for code development, source control, unit testing, IntelliSense, debugging, and refactoring, install and use the Azure Logic Apps Standard SDK. This SDK lets you define workflows entirely in C# by using an imperative coding style. You get full access to the Azure Logic Apps ecosystem for Azure-hosted connectors and built-in operations. Organize, develop, and test your workflows by using the same Visual Studio Code project structure, debugging experience, and development patterns.

Logic Apps Standard is a cloud orchestration platform for building and running automated workflows. Use it to connect services, systems, apps, and data sources, whether you're automating enterprise processes or reducing manual coding effort.

If you work with .NET and C# and want more control over your workflow design, the **Logic Apps Standard SDK** lets you define workflows in code rather than using the visual designer.

By using the SDK, you write workflows in an imperative style with C#, while keeping access to the full ecosystem of Logic Apps connectors and built-in tools.

This article shows you how to create and configure a new workflow project by using code-first workflows with the Logic Apps standard SDK in Visual Studio Code. You learn how to set up your workspace, enable connectors, manage connections, run and debug your workflows, and add new workflows within your project.

## Known issues and limitations

The Logic Apps Standard SDK is currently in public preview. The following limitations apply to this version:

- **Service Providers Connectors aren't supported**. This connector type will be added in a future release.
- **Dynamic schemas aren't supported**. Support is planned for a future release.
- **Custom code supports only callback methods**. Inline lambda functions aren't supported in this version.
- **Actions must be defined and named before they can be used as a dependency**. Add and name an action before referencing it elsewhere in the workflow.
- **Managed identity authentication is in development**. Use connection keys for connectors in the meantime.

## Prerequisites

- Install VS Code and the latest version of the Logic Apps extension.
- Have an active Azure subscription with permission to create resources.
- Be familiar with C# and .NET development in VS Code.

## Create a new Logic Apps workspace

1. Open VS Code and launch the Logic Apps extension.

1. On the Azure tab, select **Create new Logic Apps workspace** to start a new project.

1. Specify the folder location where you want to create the workspace.

1. Enter a workspace name. This name is used for the folder and project files.

1. Enter a name for your Logic Apps project.

1. For the workflow type, select **Logic Apps codeful** to use code-first workflows with the Logic Apps standard SDK.

1. Enter a name for your initial workflow.

1. Choose a workflow type from the following options for code workflows:
   - Stateful
   - Autonomous agents (Preview)
   - Conversational agents (Preview)

1. Select **Review + create** to verify your inputs, and then select **Create workspace**.

    VS Code creates and opens the workspace in a new window.

:::image type="content" source="media\create-workflows-with-csharp\create-code-first-workspace.png" alt-text="Logic Apps Standard SDK Create Workspace Wizard page showing all configuration steps.":::

## Enable and select connectors from Azure

1. After your workspace opens, you're prompted to enable connectors.

1. Select **Use connectors from Azure** to enable Azure-managed connectors for your workflows.

> [!NOTE]
> 
> Azure-managed connectors are currently the only available connectors for code workflows during public preview.

1. Choose the Azure subscription where the connectors are created.

1. Select the resource group to manage your connector resources.

1. Choose an authentication method:
   - **Managed Service Identity**: Recommended for better security. It uses Azure Managed Identity and avoids storing keys locally.
   - **Connection Keys**: Uses traditional connection strings and access keys.

   Select **Connection Keys**, as managed identity support isn't yet available.


## Review code for workflow project structure

1. In VS Code's workspace Explorer, review the key files created:
   - **Program.cs**: Defines how the host runs your workflows by building, configuring, and starting the host.
         - Workflow files (for example, `workflow1.cs`): Define your workflows with triggers and actions in code.

1. Workflow files use code to define a series of steps starting with a trigger, followed by actions. The structure is similar to visual designer workflows but expressed in C#.

1. The SDK compiles your workflow definitions, which then run on the Logic Apps runtime.

:::image type="content" source="media\create-workflows-with-csharp\code-first-csharp-project.png" alt-text="Visual Studio Code with workspace Explorer open showing project files and Program.cs selected.":::

## Configure connections for workflow triggers and actions

1. Open a workflow code file (workflow1.cs).

1. Find a managed connector action in the code, such as:

   ```csharp
   var getCurrentWeatherAction = WorkflowActions.Managed.Msnweather("msnweather").CurrentWeather(
       location: () => "98058",
       units: () => unitsInput.Imperial);
   ```

1. Hover over the connector call and select **Manage Connector** from the tooltip that appears.

1. The connection view opens, showing existing connections for that connector in your resource group.

1. Select an existing connection or select **Add new** to create a new connection.

1. When you create a new connection, provide a unique identifier. VS Code creates the connection and records it in the `connections.json` file.

> [!IMPORTANT]
> 
> Connection strings and other credentials are stored securely in the `local.settings.json` file. Don't commit this file to source control.

:::image type="content" source="media\create-workflows-with-csharp\create-code-first-connection.png" alt-text="Visual Studio Code editing Workflow1.cs displaying the Change Connection wizard.":::

## Run and debug the workflow project

1. In the workspace Explorer, right-click **Program.cs** and select **Overview** to start debugging your workflow.

   Alternatively, press **F5** or select **Run** > **Start Debugging**.

1. The project compiles, and the Logic Apps runtime starts locally.

1. When the application starts, an overview page opens:
   - If the workspace contains one workflow, it opens that workflow directly.
   - If multiple workflows exist, you see a list to choose from.

:::image type="content" source="media\create-workflows-with-csharp\create-code-first-overview-page.png" alt-text="Logic Apps Standard project overview page, showing multiple workflows to select and the workflow run history.":::

1. Use the overview page to run triggers, view run history, and examine inputs and outputs. 


> [!NOTE]
> 
> Run history for workflows written with the Logic Apps Standard SDK uses the same rich visual representation as workflows created with the visual designer. You can monitor and troubleshoot your workflows the same way, regardless of how you defined them.
> 
> :::image type="content" source="media\create-workflows-with-csharp\create-code-first-workflow-run-details.png" alt-text="Logic Apps Standard workflow run details page, showing action inputs and outputs for a completed run.":::


## Create a new workflow within the Logic Apps workspace

1. In the Azure extension in VS Code, select **Create Workflow**.

1. Enter a name for the new workflow.

1. Select the workflow type from the available options.

1. Select **Next**, and then select **Create Workflows**.

1. The new workflow appears in the workflows list.

1. Open the new workflow file to start editing and adding triggers and actions.

   The file opens with starter code for a sample workflow.

:::image type="content" source="media\create-workflows-with-csharp\create-code-first-workflow.png" alt-text="Logic Apps Standard SDK Create Workflow Wizard page showing all configuration steps.":::

## Next Steps

- [Deploy Logic Apps to Azure](..\create-standard-workflows-visual-studio-code#deploy-to-azure)

## Related content

- [Logic Apps Standard SDK Reference](logic-apps-standard-sdk.md)

---
