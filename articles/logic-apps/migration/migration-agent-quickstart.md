---
title: Quickstart - Migrate from Integration Platforms
titleSuffix: Azure Logic Apps
description: "Automate migration for BizTalk Server, MuleSoft integration projects to Azure Logic Apps (Standard) by using the Migration Agent in Visual Studio Code."
services: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewers: estfan, azla
ms.topic: how-to
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 04/27/2026
# Customer intent: As a developer who works with enterprise integration platforms, such as BizTalk Server, MuleSoft, and others, I want to learn how to quickly automate the migration process for my integration project to Standard workflows in Azure Logic Apps by using the Migration Agent extension in Visual Studio Code.
---

# Quickstart: Automate migration for integration projects to Azure Logic Apps (Standard) (preview)

[!INCLUDE [logic-apps-sku-standard](../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> This preview feature is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When your team needs to migrate workloads from legacy platforms like BizTalk Server to the cloud, you might find the process complex, time-consuming, and challenging. To help simplify and ease this task, the Azure Logic Apps Migration Agent in Visual Studio Code automates this process through five guided stages.

This quickstart shows how to migrate an example integration workload from BizTalk Server to Standard workflows in Azure Logic Apps by using the Azure Logic Apps Migration Agent in Visual Studio Code. You learn how to install the extension, open your source project, and follow the agent as it walks you through the migration stages: Discovery, Planning, Conversion, Validation, and Deployment.

> [!NOTE]
>
> Although the migration agent runs almost autonomously, it might prompt you to allow running specific commands for required tasks. To let the agent continue, select **Allow**.

For more information, see [Migration automation from integration platforms to Azure Logic Apps](migration-agent-overview.md).

## Prerequisites

Before you start, make sure to meet the following requirements:

| Requirement | Purpose |
|-------------|---------|
| [Azure subscription - Get a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) | Deployment to Azure (Stage 5) |
| [Azure CLI](/cli/azure/install-azure-cli) | Azure resource provisioning and deployment |
| [Visual Studio Code 1.85.0 or later](https://code.visualstudio.com/download) | Local development experience |
| [Azure Logic Apps Migration Agent extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.logicapps-migration-agent) | Required extension with migration agent for Visual Studio Code |
| [Azure Logic Apps (Standard) extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurelogicapps) | Required dependency for the Azure Logic Apps Migration Agent extension |
| [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) | Local functions runtime and development tasks |
| [Azure Functions Core Tools](/azure/azure-functions/functions-run-local) | Local runtime host for Azure Logic Apps (Standard) |
| [GitHub Copilot subscription](https://github.com/features/copilot/plans) | AI-powered analysis, planning, and conversion |
| [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/) | Local connector resource deployment for testing and running connections |
| Folder with BizTalk Server projects | Folder that contains integration project folders with source artifacts and files. For example, a BizTalk project folder includes files with the following file name extensions: `.btproj`, `.odx`, `.btm`, `.xsd`, and `.btp`. |

### 1: Install the Migration Agent extension

1. Open Visual Studio Code.

   Optionally, but recommended, open Visual Studio Code from the folder or directory where your integration projects exist, for example, **C:\Migration\\<*project-folders*>**.

   :::image type="content" source="media/migration-agent-quickstart/migration-path.png" alt-text="Screenshot that shows the folder or directory with all integration project folders." lightbox="media/migration-agent-quickstart/migration-path.png":::

1. On the Activity Bar, select **Extensions**. (Keyboard: Ctrl+Shift+X)

1. In the **Extensions: Marketplace** search box, find the **Azure Logic Apps Migration Agent** extension, and select **Install**.

   :::image type="content" source="media/migration-agent-quickstart/migration-search.png" alt-text="Screenshot that shows Visual Studio Code, Extensions Marketplace, and the Azure Logic Apps Migration Agent extension." lightbox="media/migration-agent-quickstart/migration-search.png":::

   After installation completes, the Activity Bar shows the icon for the **Azure Logic Apps Migration Agent** (![Icon for Azure Logic Apps Migration Agent.](media/migration-agent-quickstart/migration-agent-icon.png)).

 ### 2: Select your source folder

1. In Visual Studio Code, on the Activity Bar, select the **Azure Logic Apps Migration Agent** icon (![Icon for Azure Logic Apps Migration Agent.](media/migration-agent-quickstart/migration-agent-icon.png)).

1. In the **Azure Logic Apps Migration Agent** window, in the **Discovery Results** section, choose **Select Source Folder**.

   > [!TIP]
   >
   > To run this action as a command, open the Command Palette (Keyboard: Ctrl+Shift+P). Enter and run **Azure Logic Apps Migration Agent: Select Source Folder**.

1. Find and select the source folder that contains your BizTalk, MuleSoft, or other integration projects, and then select **Select Source Project Folder or MSI**.

   :::image type="content" source="media/migration-agent-quickstart/migration-dialog.png" alt-text="Screenshot that shows Visual Studio Code with the Azure Logic Apps Migration Agent and the source folder with projects." lightbox="media/migration-agent-quickstart/migration-dialog.png":::

   The extension automatically detects the source platform and begins the migration workflow, starting with the discovery stage.

1. Follow the agent as it walks you through each migration stage, starting with the Discovery stage.

## Migration stage 1: Discovery

In this stage, the migration agent finds and catalogs the integration artifacts in your source project. During the discovery stage, the migration agent performs the following actions in the described order with occasional input from you. For more information, see [Migration agent: Discovery stage](migration-agent-discovery-stage.md).

### Step 1: Detect the source platform

The migration agent determines your source platform, based on file patterns, such as BizTalk Server (`.btproj`) files.

The following screenshot shows the identified platform with example detected artifacts and dependencies:

:::image type="content" source="media/migration-agent-quickstart/discovery-stage.png" alt-text="Screenshot that shows the Azure Logic Apps Migration Agent extension and the Discovery stage with the detected artifacts and dependencies." lightbox="media/migration-agent-quickstart/discovery-stage.png":::

### Step 2: Scan source files

The migration agent scans the detected source files by using the built-in parser for your platform. After the scan completes, the `@migration-analyser` Copilot agent analyzes the discovered artifacts and detects logical flow groups, which are sets of artifacts that work together.

The following screenshot shows how each example integration project maps to a logical flow group:

:::image type="content" source="media/migration-agent-quickstart/discovery-stage-detail.png" alt-text="Screenshot that shows the Discovery stage details with the detected artifacts and dependencies." lightbox="media/migration-agent-quickstart/discovery-stage-detail.png":::
   
Generated logical flows don't always reflect a 1:1 relationship with legacy integration applications. The migration agent infers the flows that best reflect the legacy system's integration artifacts, such as BizTalk workloads, as Standard workflows in Azure Logic Apps.

> [!TIP]
>
>To edit these logical flows so they map 1:1 to your integration workloads, use GitHub Copilot and specify that flows must map to your BizTalk applications. However, consider that optimal for BizTalk isn't the same as optimal for Standard workflows in Azure Logic Apps. This concept is one of the first paradigm changes in modernization.

### Step 3: Analyze source design

After the migration agent completes scanning and shows the resulting logical flow groups, follow these steps:

1. On the **Home** tab, for the logical flow group you want, select **Analyze Source Design**, for example:

   :::image type="content" source="media/migration-agent-quickstart/analyze-source-design.png" alt-text="Screenshot that shows migration agent home page with Analyze Source Design selected." lightbox="media/migration-agent-quickstart/analyze-source-design.png":::

   The agent performs the following tasks:

   1. Builds an artifact inventory that includes orchestrations, schemas, maps, pipelines, and bindings.

   1. Generates a dependency graph that shows the relationships between artifacts.

      To generate the dependency graph, the migration agent runs the following tasks:

      - Generates architecture (Mermaid) diagrams that show message flows and components.
      - Identifies missing dependencies.
      - Performs a gap analysis for features.
      - Detects integration patterns such as publish-subscribe, request-reply, and batch.
      - Proposes mappings for Azure Logic Apps or other services alternatives.
      - Generates a discovery report based on the findings.

      After the migration agent successfully generates the dependency graph, the flow visualizer opens and shows the following interactive tabs:
   
      - **Architecture Diagram**
      - **Message Flow**
      - **Components**
      - **Missing Dependencies**
      - **Gap Analysis**
      - **Patterns**
      - **Learn BizTalk**

      The following example shows a sample generated flow visualization:

      :::image type="content" source="media/migration-agent-quickstart/discovery-stage-analysis.png" alt-text="Screenshot that shows the flow visualization with the results from the Discovery stage." lightbox="media/migration-agent-quickstart/discovery-stage-analysis.png":::

      For more information, see [Source design analysis and results](migration-agent-discovery-stage.md#source-design-analysis-results).

1. To review the analysis results, select a tab to review the related information.

### Step 4: Update or export the analysis

1. After you review the analysis results, on the flow visualizer title bar, select one of the following actions:

   | Action | Description |
   |--------|-------------|
   | **Suggest a Change** | Request direct changes to the analysis. <br><br>**Tip**: To discuss potential updates or corrections to any flow group, in the flow visualizer, use the Copilot chat window. Select a flow group and ask the `@migration-analyser` agent questions about the detected architecture. Provide information about any missing gaps, and then regenerate the analysis. |
   | **Regenerate Analysis** | After you update the analysis, such as add a missing dependency, artifact, or specification, rerun the analysis. |
   | **Export Report** | Generate a report with the discovery results in a shareable format. |

   Or, to analyze more flows, select the **Home** tab or the home page icon.

1. When you finish, go to the next section for the Planning stage.

## Migration stage 2: Planning

After you finish your analysis, start the Planning stage by creating a migration roadmap to follow. For more information, see [Migration agent stage 2: Planning](migration-agent-planning-stage.md).

1. On the **Home** tab, choose the logical flow group you want, and select **Plan Logic App Design**.

   :::image type="content" source="media/migration-agent-quickstart/plan-logic-app-design-stage.png" alt-text="Screenshot that shows migration agent home page with Plan Logic App Design selected." lightbox="media/migration-agent-quickstart/plan-logic-app-design-stage.png":::

   The `@migration-planner` agent generates a migration plan that usually includes the following sections:

   - **Architecture**
   - **Additional Azure components**
   - **Operations mapping**
   - **Artifact dispositions**
   - **Migration gaps**
   - **Integration patterns**
   - **Summary**
   - **Effort estimates**
   - **Task plans**

   The following example shows a sample generated migration plan:

   :::image type="content" source="media/migration-agent-quickstart/planning-stage-main.png" alt-text="Screenshot that shows the Planning stage with the migration plan for a logical group flow and action mappings." lightbox="media/migration-agent-quickstart/planning-stage-main.png" :::

   For more information, see [Planning stage action](migration-agent-planning-stage.md#planning-stage-actions).

1. Before you continue to the Conversion stage, review each plan carefully. Make any updates as necessary.

   The accuracy of your plan greatly affects the quality of the conversion output. 
   
   To help you determine whether the plan needs any updates, interact with the `@migration-planner` GitHub Copilot agent by using Copilot chat to complete the following tasks:
   
   - Ask questions about specific mappings.
   - Request alternative approaches for gap resolution.
   - Adjust effort estimates.
   - Request plan modifications before moving on to conversion.

1. When you're ready, continue to the Conversion stage by selecting **Home Page** or returning to the **Home** tab.

## Migration stage 3: Conversion

When you're satisfied with your migration plan, start the Conversion stage to create and run conversion tasks that transform source artifacts into Standard workflows, connections, and other supporting files for Azure Logic Apps.

### 3.1: Create conversion tasks

1. On the **Home** tab, for your logical flow, select **Create Conversion Tasks**.

   :::image type="content" source="media/migration-agent-quickstart/create-conversion-tasks-stage.png" alt-text="Screenshot that shows the Conversion stage for creating conversion tasks." lightbox="media/migration-agent-quickstart/create-conversion-tasks-stage.png":::

   The `@migration-converter` agent creates the conversion tasks, which vary based on your specific logical flow group. The following list describes sample conversion tasks for a logical flow group named `Method Call Processing`:

   | Step | Task | Description |
   |------|------|-------------|
   | 1 | **Scaffold Logic Apps Project** | Creates the Standard logic app project structure with the required folder hierarchy and files. |
   | 2 | **Convert Input Schema** | Migrates the *InputSchema.xsd* file from BizTalk format, which is UTF-16 with BizTalk annotations, to standard XSD, which is UTF-8 without BizTalk annotations. |
   | 3 | **Convert Output Schema** | Migrates the *OutputSchema.xsd* file from BizTalk format, which is UTF-16 with BizTalk annotations, to standard XSD, which is UTF-8 without BizTalk annotations. |
   | 4 |**Generate \<*connector-name*\> Connections** | Creates or updates the *connections.json* file that contains the configurations for each required connection. |
   | 5 | **Generate \<*workflow-name*\> Workflow** | Creates the *workflow.json* file that contains the Standard workflow definition in Azure Logic Apps for the logical flow group. |
   | 6 | **Generate Local Functions (\<*function-names*\>)** | Creates .NET 8 local functions for custom logic in the source code. |
   | 7 | **Validate Runtime (func start)** | Validates the logic app project by running `func start` to confirm that all functions and workflows are ready. |
   | 8 | **E2E Testing (Happy Path & Error Path)** | Runs end-to-end tests for the happy path, error path, and field-level validation. |
   | 9 | **Black Box Tests (Optional)** | Runs tests that use external test data that you provide. |
   | 10 | **Cloud Deployment & Testing (Optional)** | Deploys to Azure and runs cloud E2E tests. |

   The following example shows sample generated conversion tasks for the `Method Call Processing` logical flow group:

   :::image type="content" source="media/migration-agent-quickstart/conversion-stage-main.png" alt-text="Screenshot that shows the Conversion stage with generated conversion tasks that create Standard logic app project files." lightbox="media/migration-agent-quickstart/conversion-stage-main.png":::

1. For the next section, select the **Home Page** or return to the **Home** tab.

### 3.2: Run the conversion tasks

1. To have the `@migration-converter` agent to run each conversion task, select **Execute**, but stop before **Cloud Deployment & Testing**. Or, select **Execute All**, which works the same as selecting **Execute Conversion Tasks** on the **Home** tab.

   > [!NOTE]
   >
   > During conversion task execution, the agent might prompt you for access or permissions to edit files. Review the available options and respond appropriately.

1. For the next section, select the **Home Page** or return to the **Home** tab.

<a id="check-completeness"></a>

### 3.3 Check output for completeness and quality

The `@migration-converter` agent produces ready-to-run Standard workflow definitions and deployable project artifacts. This agent uses the `no-stubs-code-generation` skill to make sure all generated code is complete, fully functional, and that no stub implementations, placeholder code, or `TODO` comments exist.

To prepare the generated output for the Validation stage where you locally run the workflows for testing, make sure that you manually inspect the workflow definitions, connections, and any generated .NET local functions for inaccuracies.

> [!IMPORTANT]
>
> As a best practice, always review any AI generated outputs before you use them. Such outputs might include incorrect information.

To review the generated output, follow these steps:

1. On the **Home** tab, for your logical flow, select **Open in Visual Studio Code**.

1. In your migration folder, go to the **out** directory, and select the generated solution folder, for example:

   :::image type="content" source="media/migration-agent-quickstart/validation-stage-generated-output.png" alt-text="Screenshot that shows the local path for where to find the generated code and solution." lightbox="media/migration-agent-quickstart/validation-stage-generated-output.png":::

1. Inspect each `workflow.json` file to verify that the trigger and actions match the source behavior.

   > [!TIP]
   >
   > To ask questions about the generated output, request modifications, or regenerate specific workflows, interact with the `@migration-converter` agent by using Copilot chat.

1. Check the `connections.json` file for the correct connector configurations.

1. Review any generated .NET local functions for correctness.

## Migration stage 4: Validation

For the Validation stage, test the generated workflows against your source specifications. You can bring your own test cases and specifications. The `@migration-converter` agent provides runtime validation and testing guidance. Your goal is to confirm that your converted workflows perform as expected and matches the source flow behavior.

> [!TIP]
>
> To help you easily make direct comparisons, keep the test data and expected outputs for your source platform readily available during validation.

For example, the migration plan provides optional black box testing capability for you to use external inputs:

:::image type="content" source="media/migration-agent-quickstart/validation-stage-black-box.png" alt-text="Screenshot shows migration plan and black box testing option." lightbox="media/migration-agent-quickstart/validation-stage-black-box.png":::

### Requirements for locally testing your workflows

Before you start the validation steps, make sure the following requirements are installed for testing:

| Requirement | Purpose |
|-------------|---------|
| [Azure Logic Apps (Standard) extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurelogicapps) | Required extension dependency |
| [Azure Functions Core Tools](/azure/azure-functions/functions-run-local) | Local runtime host for Azure Logic Apps (Standard) |
| [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/) | Local connector resource deployment for testing and running connections |

### Locally test your workflows

To locally run the generated workflows, follow these steps:

1. On the **Home** tab, for your logical flow, select **Open in Visual Studio Code**.

1. In your migration folder, go to the **out** directory, and select the generated solution folder.

1. Open the generated logic app project folder.

1. Check that Docker Desktop is running.

1. On the **Run** menu, select **Start Debugging** (Keyboard: F5) to locally start the runtime for Azure Logic Apps.

   The runtime starts and the workflows become available at local endpoints.

1. Use sample input data to send test requests or trigger a workflow.

1. Compare the generated workflow behavior against the source behavior to identify any discrepancies or inaccuracies.

   The following checklist describes behaviors for you to verify:

   > [!div class="checklist"]
   > - All triggers correctly fire with the expected input formats.
   > - Action sequences run in the correct order.
   > - Data transformations produce the expected output.
   > - Conditional logic correctly branches with the expected results based on input data.
   > - Loop constructs process all items as expected.
   > - Error handling scopes appropriately catch and handle exceptions.
   > - Connection configurations resolve to the correct endpoints.
   > - .NET local functions return the expected results.

1. Investigate and fix any discrepancies or problems that you find.

   > [!TIP]
   >
   > To help you through the resolution process, discuss the discrepancy or problem with the `@migration-converter` agent through Copilot chat.
   >
   > 1. In Copilot chat, describe the expected behavior versus the actual behavior.
   > 1. Review the agent's suggested fixes.
   > 1. If you accept the agent's recommendations and make the changes, ask the agent to regenerate the updated parts of the workflow.

## Migration stage 5: Deployment

The Deployment stage deploys your migrated Standard solution to Azure Logic Apps in the Azure portal.

### Requirements for deploying your workflows

Before you start the deployment steps, make sure to meet the following requirements:

| Requirement | Purpose |
|-------------|---------|
| Azure CLI | Provisions and deploys Azure resources. |
| Azure subscription | Your target subscription to use for deployment. |
| Contributor access | Role-based access to create resources in the target resource group. |

Make sure you finished migration agent stages 1 (Discovery) through 4 (Validation), including locally running the generated workflows and confirming their behavior match the source behavior.

### Step 1: Set up extension settings for deployment

1. In Visual Studio Code, open the extension settings. From the **File** menu, go to **Preferences** > **Settings** > **Extensions** > **Azure Logic Apps Migration Agent**.

1. Update the following deployment setting values as appropriate:

   | Setting name | JSON name | Description | Default | Action |
   |--------------|-----------|-------------|---------|--------|
   | **Location** | `logicAppsMigrationAssistant.azure.location` | The Azure region for provisioning resources. | `eastus` | Change this value to the region you want. |
   | **Resource Group** | `logicAppsMigrationAssistant.azure.resourceGroup` | The Azure resource group for provisioning and testing. | `integration-migration-tool-test-rg` | Change this value to the resource group name you want. |
   | **Subscription ID** | `logicAppsMigrationAssistant.azure.subscriptionId` | The Azure subscription ID for deployment. | (empty) | Enter the GUID for your Azure subscription. |
   | **Deployment Model** | `logicAppsMigrationAssistant.deploymentModel` | The target deployment model for Azure Logic Apps (Standard). | `workflow-service-plan` | If appropriate, change this value to `hybrid`. |

### Step 2: Start the deployment process

Follow these steps to begin deployment to Azure:

1. Sign in to Azure CLI with your Azure subscription, for example:

   ```bash
   az login
   ```

1. From the Azure Logic Apps Migration Agent window, go to the migration plan, and run the **Cloud Deployment & Testing** task by selecting **Execute**:

   :::image type="content" source="media/migration-agent-quickstart/validation-stage-main.png" alt-text="Screenshot that shows the end to end testing task with deployment in target environment." lightbox="media/migration-agent-quickstart/validation-stage-main.png":::

   The migration agent provisions the necessary infrastructure and deploys your Standard logic app resource and workflows by using the Azure CLI.

   The following example shows a sample completely migrated solution:

   :::image type="content" source="media/migration-agent-quickstart/deployment-stage-final.png" alt-text="Screenshot that shows Visual Studio Code and the completely migrated solution." lightbox="media/migration-agent-quickstart/deployment-stage-final.png":::

### Step 3: Verify the deployment

After deployment completes, verify that your Standard workflows appear in the Azure portal.

1. In the [Azure portal](https://portal.azure.com) search box, enter `logic apps`, and then select **Logic  apps**.

1. On the **Logic apps** page, select your Standard logic app resource.

1. On the logic app sidebar, under **Workflows**, expand **Workflows**. On the **Workflows** page, confirm that all the expected workflows appear. Confirm that their **State** is **Enabled**.

   > [!NOTE]
   >
   > For any disabled workflow, select the workflow checkbox. On the **Workflows** toolbar, select **Enable**.

1. Test each workflow with sample inputs to make sure they work as expected.

1. To find any runtime errors or performance problems, go to the **Application Insights** page for your Standard logic app resource.

   1. On the logic app sidebar, under **Monitoring**, select **Application Insights**.

   1. Under **Link to an Application Insights resource**, select the link to the Application Insights resource.

   For more information, see [View workflow metrics in Application Insights](../enable-enhanced-telemetry-standard-workflows.md#view-workflow-metrics-in-application-insights).

## Reset the migration

You can restart your migration from the beginning. The following command clears the migration state and lets you start again with the Discovery stage.

1. In Visual Studio Code, open the Command Palette (Keyboard: Ctrl+Shift+P).

1. At the prompt, enter **Azure Logic Apps Migration Agent: Reset Migration**.

## Related content

- [Migration automation from integration platforms to Azure Logic Apps](migration-agent-overview.md)
- [Migration agent stage 1: Discovery](migration-agent-discovery-stage.md)
- [Migration agent stage 2: Planning](migration-agent-planning-stage.md)
- [Migration agent stage 3: Conversion](migration-agent-conversion-stage.md)
- [Migration agent stage 4: Validation](migration-agent-validation-stage.md)
- [Migration agent stage 5: Deployment](migration-agent-deployment-stage.md)
- [Extend the migration agent by creating custom parsers for unsupported integration platforms](migration-agent-extend.md)
