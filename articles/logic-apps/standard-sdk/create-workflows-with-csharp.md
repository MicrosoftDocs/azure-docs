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

[!INCLUDE [logic-apps-sku-standard](../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
>
> This preview feature is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To programmatically build Standard workflows in Azure Logic Apps with the Visual Studio Code tools for code development, source control, unit testing, IntelliSense, debugging, and refactoring, use the Azure Logic Apps Standard SDK. This SDK lets you define workflows entirely in C# and .NET by using an imperative coding style. Not only do you get more control over your workflow design, you get full access to the Azure Logic Apps ecosystem for Azure-hosted connectors and built-in operations. Organize, develop, and test your workflows by using the project structure, debugging experience, and development patterns that you might already know in Visual Studio Code.

This guide shows how to complete the following tasks:

- Create your workspace and code-first workflow project.
- Enable Azure-hosted connectors and set up connections.
- Locally run and debug workflows.
- Add more workflows to your project.

By default, the SDK generates a logic app project that includes sample code that you can review and then replace with your own. 

## Known issues and limitations

During preview release, the following limitations apply:

| Area | Limitation |
|------|------------|
| Built-in service provider-based operations | Currently unavailable, but planned for a future release. <br><br>During preview, only Azure-hosted and -managed connectors are available for code-first workflows. |
| Dynamic schemas | Currently unavailable, but planned for a future release. |
| Custom code | Only callback methods are currently supported. Inline lambda functions are unsupported during preview. |
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
     |----------|-------------|
     | **Workspace parent folder path** | The path and folder name for your local workspace. This workspace name is used for the folder and project files. <br><br>To create this folder, follow these steps: <br><br>1. Select **Browse** to open the **Select Folder** window. <br><br>2. Browse to the location for creating the workspace folder. <br><br>3. Create your folder, and then select the folder *only once*. <br><br>4. Choose **Select workspace parent folder** (don't double-select the folder). |
     | **Workspace name** | The name for your workspace in Visual Studio Code. |
     | **Logic app name** | The name for your logic app project. |
     | Logic app project and workflow type | This list shows the possible flavors for a Standard logic app project. <br><br>For Standard SDK projects, select **Logic app (codeful)** for code-first workflows. |
     | **Workflow name** | The name for the first workflow in the Standard logic app project. |
     | **Workflow type** | - **Stateful**: A non-AI workflow that includes run history. <br><br>- **Conversational agents**: An AI-driven workflow that supports human interactions through chat and includes run history. <br><br>- **Autonomous agents**: An AI-driven workflow that supports human-independent automation and includes run history. |

  1. When you're ready, select **Next**.

  1. On the **Review + create** tab, confirm your inputs, and select **Create workspace**.

     :::image type="content" source="media/create-workflows-with-csharp/create-code-first-workspace.png" alt-text="Screenshot shows Visual Studio Code, wizard for Azure Logic Apps Standard SDK, and the Create Workspace page that shows the creation steps." lightbox="media/create-workflows-with-csharp/create-code-first-workspace.png":::

     Visual Studio Code prompts you to confirm whether to trust the files' authors in your workspace.

  1. To confirm, select **Yes, I trust the authors**.

     Visual Studio Code creates and opens your workspace and your logic app project, which appear in the **Explorer** window.

     After your workspace opens, you're prompted to enable the Azure connectors that are hosted and run in global, multitenant Azure.

1. Continue with the next steps to enable these connectors.

## Enable Azure-hosted connectors

For this preview release, you can use only the Azure-hosted, managed connectors in your code-first workflows.

1. When Visual Studio Code prompts you to activate these connectors, select **Use connectors from Azure**.

1. Select the Azure subscription to use for these connectors.

1. Select a resource group to manage your connector resources.

1. Select the authentication type to use:

   | Authentication | Description |
   |----------------|-------------|
   | Connection keys | During preview, use connection strings and access keys because managed identity is currently unavailable. |
   | Managed identity | Recommended for better security through Microsoft Entra so you don't handle, store, and manage credentials, keys, or secrets locally or in the cloud. |

## Review project and workflow code

1. In Visual Studio Code, on the Activity Bar, select **Explorer** (files icon) to view your project.

1. In the **Explorer** window, review the following key project files and their sample code.

   | Files | Description |
   |-------|-------------|
   | `Program.cs` | Defines how the host runs your workflows by building, configuring, and starting the host. |
   | `<workflow_name>.cs` | Defines your workflow with the trigger and actions in code. |

   For example:

   :::image type="content" source="media/create-workflows-with-csharp/code-first-csharp-project.png" alt-text="Screenshot shows Visual Studio Code with Explorer window with project files and Program.cs selected." lightbox="media/create-workflows-with-csharp/code-first-csharp-project.png":::

   - In your codeful logic app project, a workflow file uses code to define the steps in your automation, starting with a single trigger that's followed by actions. The structure for these steps appears similar to the sequence in the workflow designer but is expressed in C#.

   - The SDK compiles your workflow definition, which then executes on the Azure Logic Apps runtime.

## Set up connections for triggers and actions

To set up any connections that the trigger or actions in your workflow need to function, follow these steps:

1. In Visual Studio Code, in the **Explorer** window, open your logic app project and a workflow code file, for example, `<workflow_name.cs`.

1. In the code file, find the action definition associated with an Azure-managed connector, for example:

   ```csharp
   var getCurrentWeatherAction = WorkflowActions.Managed.Msnweather("msnweather").CurrentWeather(
       location: () => "98058",
       units: () => unitsInput.Imperial);
   ```

1. Move your mouse pointer over the action call. From the tooltip that appears, select **Manage connector**.

   For example:

   :::image type="content" source="media/create-workflows-with-csharp/create-code-first-connection.png" alt-text="Screenshot shows Visual Studio Code with the opened file editor for Workflow1.cs, and shows the Change Connection wizard." lightbox="media/create-workflows-with-csharp/create-code-first-connection.png":::

   The connection view opens and shows any existing connections in your resource group for that connector.

1. Select a connection.

   -or-
   
   To create a connection, select **Add new**, and provide a unique identifier for the connection.
   
   Visual Studio Code creates and records the connection in the `connections.json` file.

   > [!IMPORTANT]
   > 
   > The project uses the `local.settings.json` file to securely store connection strings and other credentials. Make sure that you don't commit this file to source control.

## Run and debug your workflow

1. In Visual Studio Code, on the Activity Bar, open the **Explorer** window (files icon) to view your project.

1. On the Visual Studio Code titlebar, open the **Run** menu, and select **Start debugging**. (Keyboard: **F5**)

   -or-
   
   Open the `Program.cs` file's shortcut menu, and select **Overview** to start debugging. (Keyboard: **F5**)

   When the project starts to compile, the Azure Logic Apps runtime starts locally running your logic app. When the app starts, the **Overview** page opens.
   
   - If your project has a single workflow, the **Overview** page directly opens the workflow run history.
   - If your project has multiple workflows, select a workflow first.

   :::image type="content" source="media/create-workflows-with-csharp/create-code-first-overview-page.png" alt-text="Screenshot shows the project Overview page with multiple workflows and the workflow run history." lightbox="media/create-workflows-with-csharp/create-code-first-overview-page.png":::

   You can use the **Overview** page to execute triggers, review the workflow run history, and examine inputs and outputs. 

   > [!NOTE]
   >
   > For workflows created with the Azure Logic Apps Standard SDK, the run history uses the same rich, visual representation as workflows created with the visual designer. You can monitor and troubleshoot your workflows the same way, no matter how you created them.
   > 
   > :::image type="content" source="media/create-workflows-with-csharp/create-code-first-workflow-run-details.png" alt-text="Screenshot shows workflow run history with action inputs and outputs after a completed run." lightbox="media/create-workflows-with-csharp/create-code-first-workflow-run-details.png":::

## Add a new workflow to your project

1. In Visual Studio Code, on the Activity Bar, select **Explorer** (files icon) to view your project.

1. At the project level, open the shortcut menu, and select **Create workflow**.

1. On the **Create workflow** tab, enter the following information:

   | Property | Description |
   |----------|-------------|
   | **Workflow name** | The name for your workflow in your Standard logic app project. |
   | **Workflow type** | - **Stateful**: A non-AI workflow that includes run history. <br><br>- **Conversational agents**: An AI-driven workflow that supports human interactions through chat and includes run history. <br><br>- **Autonomous agents**: An AI-driven workflow that supports human-independent automation and includes run history. |

1. When you finish, select **Next**, and then select **Create workflow**.

   After creation completes, the new workflow appears in the workflows list.

1. To start editing the workflow and its operations, open the new workflow code file.

   The file opens and shows sample workflow code.

   :::image type="content" source="media/create-workflows-with-csharp/create-code-first-workflow.png" alt-text="Screenshot shows Visual Studio Code with the create workflow wizard and setup steps." lightbox="media/create-workflows-with-csharp/create-code-first-workflow.png":::

## Next steps

- [Deploy logic apps to Azure](../create-standard-workflows-visual-studio-code.md#deploy-to-azure)

## Related content

- [Azure Logic Apps Standard SDK Reference](logic-apps-standard-sdk.md)
