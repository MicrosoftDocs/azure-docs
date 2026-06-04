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
ms.date: 06/05/2026
ms.custom:
- build-2026
# Customer intent: As an integration developer who works with Azure Logic Apps, I want to create a workflow project by using the Standard SDK so I can programmatically automate processes with code-first workflows.
---

# Create Standard workflow projects with C# by using the Azure Logic Apps Standard SDK (preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
>
> This preview feature is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To programmatically build Standard workflows in Azure Logic Apps with the Visual Studio Code tools for code development, source control, unit testing, IntelliSense, debugging, and refactoring, use the Azure Logic Apps Standard SDK. This SDK lets you define workflows entirely in C# and .NET by using an imperative coding style. Not only do you get more control over your workflow design, you get full access to the Azure Logic Apps ecosystem for Azure-hosted connectors and built-in operations. Organize, develop, and test your workflows by using the project structure, debugging experience, and development patterns that you might already work with and know in Visual Studio Code.

This guide shows how to create and set up your project in Visual Studio Code with code-first workflows by using the Azure Logic Apps Standard SDK. You learn how to set up your workspace, enable connectors, manage connections, debug your workflows, and add workflows to your project.

## Known issues and limitations

During preview release, the following limitations apply:

| Area | Limitation |
|------------|------|
| Built-in service provider-based operations | Support planned in a future release. |
| Dynamic schemas | aren't supported | Support planned in a future release.  |
| Custom code | Currently supports only callback methods. Inline lambda functions are currently unsupported. |
| Actions | Before you can use and reference these operations in workflows, you must add and name them. |
| Managed identity authentication | Support is in development. For now, use connection string or API key authentication. |

## Prerequisites

- An Azure account and subscription that can create resources in Azure. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- [Visual Studio Code and the Azure Logic Apps (Standard) extension](../create-single-tenant-workflows-visual-studio-code.md#prerequisites).

- Familiarity with C# and .NET development in Visual Studio Code.

- A workspace in Visual Studio Code for your Standard logic app project.

  To quickly create this workspace, follow these steps:

  1. In Visual Studio Code, on the Activity Bar, select the Azure icon.

  1. In the **Azure** window, on the **Workspace** toolbar, select the **Azure Logic Apps** menu, select **Create new logic app workspace**.

     If Windows Defender Firewall prompts you to give network access for **Code.exe**, which is Visual Studio Code. For **func.exe**, which is the Azure Functions Core Tools, select **Private networks, such as my home or work network** **>** **Allow access**.

     The **Create logic app workspace** tab opens so you can provide details about your project and logic app.

  1. On this tab, provide the following information:
  
     | Property | Description |
     |----------|-------------
     | **Workspace parent folder path** | The path and folder name for your local workspace. This workspace name is used for the folder and project files. <br><br>To create this folder, follow these steps: <br><br>1. Select **Browse** to open the **Select Folder** window. <br><br>2. Browse to the location for creating the workspace folder. <br><br>3. Create your folder, and then select the folder *only once*. <br><br>4. Choose **Select workspace parent folder** (don't double-select the folder). |
     | **Workspace name** | The name for your workspace in Visual Studio Code. |
     | **Logic app name** | The name for your logic app project. |
     | Logic app project and workflow type | This list shows the possible flavors for a Standard logic app project. | For Standard SDK projects, select **Logic app (codeful)** for code-first workflows. |
     | **Workflow name** | The name for the first workflow in the Standard logic app project. |
     | **Workflow type** | - **Stateful**: A non-AI workflow that includes run history. <br><br>- **Conversational agents**: An AI-driven workflow that supports human interactions through chat and includes run history. <br><br>- **Autonomous agents**: An AI-driven workflow that supports human-independent automation and includes run history. |

  For more information, see [Create a local workspace for your logic app project in Visual Studio Code](../create-standard-workflows-visual-studio-code.md#create-workspace).

1. When you're ready, select **Next**, verify your inputs, and then select **Create workspace**.

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

1. In Visual Studio Code, open the workspace Explorer, review the key files created:
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
