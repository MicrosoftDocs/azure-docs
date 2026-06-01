---
title: Create Workflows for Dynamic Automation
titleSuffix: Logic Apps Automation
description: Build dynamic, AI-driven workflows that run independently or with human oversight in Logic Apps Automation.
services: azure-logic-apps
ms.reviewers: estfan, krmitta, divswa, azla
ms.topic: quickstart
ai-usage: ai-assisted
ms.update-cycle: 180-days
ms.date: 06/02/2026
ms.custom:
  - build-2026
#Customer intent: As an automation developer, I need to build my first dynamic, AI-powered workflow in Logic Apps Automation.
---

# Quickstart: Build dynamic workflows in Logic Apps Automation (preview)

> [!NOTE]
>
> This preview capability is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When you automate business processes, you often have the following tasks before you can even build and test a single workflow:

- Connect different services, systems, apps, and data.
- Write extra code to connect these components.
- Set up any necessary servers or other infrastructure.

When the business process steps are unpredictable or when requirements change quickly, this setup work slows you down, forcing you to divert focus away from building out your business logic.

Logic Apps Automation removes this effort. You describe what you want to automate, and the platform provides a visual designer, an AI assistant, and 1,400+ ready-to-use connectors so you can build, test, and monitor workflows entirely inside your browser. There's nothing to install on your computer.

This quickstart shows how to create a dynamically-run [*workflow*](dynamic-workflow-automation-introduction.md#key-concepts-and-terminology) by using Logic Apps Automation. You create an automation project, add an application, and build your first workflow. By the end, you have a working workflow you can test and monitor from the Logic Apps Automation portal.

If you're new to dynamic workflow automation, see [What is Logic Apps Automation](dynamic-workflow-automation-introduction.md).


You create an automation project, add an application, and build your first workflow. By the end, you have a working workflow you can test and monitor from the Logic Apps Automation portal.
 and then build your first workflow. By the end, you have a working automation you can test and monitor from the Logic Apps Automation portal.

This quickstart shows how to create an application inside an existing automation project.

For more information, see:

- [What is Logic Apps Automation](dynamic-workflow-automation-introduction.md)
- [Key concepts and terminology](dynamic-workflow-automation-introduction.md#key-concepts-and-terminology)

## Prerequisites

- A Microsoft work or school account that can access the [Logic Apps Automation portal](https://auto.azure.com).

- Your work or school account needs to exist in the same Microsoft Entra tenant as the application creator-owner so they can add you to the application and assign the necessary permissions. If you don't have access, work with the project and application creator-owner to get access and permissions.

  For more information about Microsoft Entra tenants, see [Tenant configurations](/entra/identity-platform/v2-overview#tenant-configurations).

- The application where you have the application **Contributor** role so you can create workflows.

  > [!NOTE]
  >
  > The project **Reader** role doesn't have enough permissions to create applications.

- To follow the example, you need the URL for any RSS URL that doesn't need HTTP authorization, for example:

  `https://feeds.content.dowjones.io/public/rss/RSSMarketsMain`

  Choose an RSS feed that publishes frequently, so you can easily test your workflow. 

- An email account for Office 365 Outlook or Outlook.com

## Create your workflow

Every workflow starts with a [*trigger*](dynamic-workflow-automation-introduction.md#key-concepts-and-terminology), an operation that specifies the condition or criteria to meet before the workflow runs. Every workflow subsequently has one or multiple [*actions*](dynamic-workflow-automation-introduction.md#key-concepts-and-terminology) to perform tasks after the trigger fires.


1. When the application appears on the **Applications** page, select your application.

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/new-application.png" alt-text="Screenshot that shows the Applications page and newly created application." lightbox="media/quickstart-create-dynamic-workflow-automation/new-application.png":::

   The application opens the **Workflows** page, which shows the workflow builder and any existing workflows.

1. On the **Applications** page, select your application.

   For example:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/new-application.png" alt-text="Screenshot that shows the Applications page and newly created application." lightbox="media/quickstart-create-dynamic-workflow-automation/new-application.png":::

   Inside your application, the **Workflows** page automatically opens and shows the workflow landing page. Any workflows that other project members previously built also appear here.

On the **Workflows** page, in the section named **Get started with your first workflow**, choose the path shows the following paths, choose a path from the following table:

| Path |
|------|
| [Generate your workflow with the AI assistant](#assistant) |
| [Build your workflow starting with the empty designer](#empty-designer) |
| [Prepopulate your workflow from a template](#template) |

<a id="assistant"></a>

### [AI assistant](#tab/assistant)

To generate a workflow by using plain words to describe the behavior you want, use the AI assistant.

1. On the **Workflows** page, in the workflow description box, enter the detailed description about the process you want to automate.

   > [!TIP]
   >
   > Make your description as specific as possible. Include the trigger event or condition that makes your workflow run, the actions that you want to happen, and what the result looks like. The more details you provide, the closer the generated workflow matches what you need.
   >
   > For examples, from the **Examples** list, select a sample description that you can reuse or edit.

   Here's some examples you might try:

   - Simpler: Create a workflow that accepts a web request from an external caller, and returns a response to the caller:

     Prompt: `When a web request arrives with a JSON body, respond with a 200 OK status that includes a greeting message and the current date and time.`

     For this example, the workflow name is `http-hello-world`.

   - More complex: Create a workflow that completes the following tasks:
   
     1. Checks the Wall Street Journal RSS feed for new stories.
     1. Feeds the results into an agent.
     1. Accept and handle questions about the stories through chat.
     1. Summarize the conversation and send to email.
     
     Prompt: `Check the RSS feed at 'https://feeds.content.dowjones.io/public/rss/RSSMarketsMain' by using the RSS trigger. Follow the link to each story, read the story, and create a summary. Send the story to my email account in Office 365 Outlook.`

     For this example, the workflow name is `check-wsj-rss-feed-with-prompt`.

1. When you're ready, select **Build**.

   The AI assistant generates and validates the workflow, and then opens the designer canvas. Based on the workflow's complexity, the process might need between a few moments and minutes to complete.

   > [!IMPORTANT]
   >
   > The AI assistant creates the workflow structure, including the trigger, actions, and any branches, but can't provide sign-in credentials, parameter values, or settings values specific to your setup. Before your first successful run, complete the following steps:
   >
   > - Set up connections for operations that call outside services or systems.
   > - Provide values for any required fields that the assistant left empty. Required fields show an asterisk (*) or a red outline.
   > - Fix any alerts that appear on individual steps.

   The following example shows a sample prompt:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/build-prompt.png" alt-text="Screenshot that shows the Workflows page with an entered prompt and selected option for Build." lightbox="media/quickstart-create-dynamic-workflow-automation/build-prompt.png":::

   The following example shows the generated workflow, which might slightly differ from your version even if you use the same prompt:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/generated-workflow.png" alt-text="Screenshot that shows the designer with the workflow generated from the prompt and alerts for further setup." lightbox="media/quickstart-create-dynamic-workflow-automation/generated-workflow.png":::

   Alert icons appear on operations that need extra setup, such as missing input values, connections, settings, and tools that you want agent loops or agents to use.

1. On the designer, select each operation that shows an alert to find and complete any follow-up tasks, for example:

   | Area | Action |
   |------|--------|
   | **Parameters** tab | Check for values that you need to provide or change. |
   | **Connections** tab | Create missing connections or provide missing connection information. |
   | **Settings** tab | Check the values to confirm whether they're set the way you want. |
   | **Agent loop** actions | Set up any tools you want the agent loop to use, such as actions, MCP server tools, agents, or other workflows. <br><br>1. On the designer, move your mouse over the agent loop action. <br><br>2. In the pop-up box, select **+ Add Tool**, and then select an option: <br><br>- **Action**: A connector operation or built-in operation that performs a task. <br>- **MCP Tool**: A tool from an MCP server. <br>- **Sub-workflow**: Another workflow in the same application or in an agent. |

<a id="empty-designer"></a>

### [Blank template](#tab/blank)

The blank workflow template starts with an empty designer where you add the trigger, actions, agents, or MCP servers yourself.

#### 3a: Select the blank workflow template

1. On the **Workflows** page, select **Build from scratch**.

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/select-designer.png" alt-text="Screenshot that shows the Workflows page with selected option for Build from scratch." lightbox="media/quickstart-create-dynamic-workflow-automation/select-designer.png":::

1. For **Workflow name**, enter the name to use.

1. From the template list, select **Blank workflow**, and then select **Build**.

   The designer opens an empty canvas with the **Add a trigger** placeholder.

<a id="add-trigger"></a>

#### 3b: Add the trigger to start the workflow

The *trigger* is the event or condition that runs your workflow, for example:

| Trigger type | Operation name | Event or condition |
|--------------|----------------|--------------------|
| **Request** | **When an HTTP request is received** | Runs when a web request arrives from an outside caller. |
| **RSS** | **When a feed item is published** | Runs on the specified schedule to check an RSS feed for new stories. |

1. On the designer canvas, select **Add a trigger**.

   The **Add a trigger** pane opens so you can find the trigger you want.

1. Use search or browse the triggers or trigger groups. Select the trigger that works best for your scenario.

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/empty-designer.png" alt-text="Screenshot that shows the empty Logic Apps Automation workflow designer and the Add a trigger pane." lightbox="media/quickstart-create-dynamic-workflow-automation/empty-designer.png":::

   For more information about the gallery, see [Operations gallery](#operations-gallery).

   The following example selects the **RSS** trigger named **When a feed item is published**:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/select-trigger.png" alt-text="Screenshot that shows the Logic Apps Automation workflow designer, Add a trigger pane, and selected RSS trigger named When a feed item is published." lightbox="media/quickstart-create-dynamic-workflow-automation/select-trigger.png":::

   The trigger appears on the designer, and the information box opens so you can enter the inputs and configure settings for the trigger.

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/trigger-before-setup.png" alt-text="Screenshot that shows the information box for the RSS trigger named When a feed item is published." lightbox="media/quickstart-create-dynamic-workflow-automation/trigger-before-setup.png":::

1. In the trigger information box, enter the values that the trigger needs to work.

   For the example trigger, enter an RSS feed URL and a connection name.

   1. On the **Parameters** tab, for **The RSS feed URL**, enter the following value:

      `https://feeds.content.dowjones.io/public/rss/RSSMarketsMain`

      :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/trigger-url.png" alt-text="Screenshot that shows the information box and Parameters tab with URL for the RSS trigger named When a feed item is published." lightbox="media/quickstart-create-dynamic-workflow-automation/trigger-url.png":::

   1. On the **Connection** tab, select **Create new connection**.

   1. For **Name your connection**, enter a descriptive name like `wsj-connection-example`, and select **Create connection**.

      :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/trigger-create-connection.png" alt-text="Screenshot that shows the information box and Connection tab with new connection name for the RSS trigger named When a feed item is published." lightbox="media/quickstart-create-dynamic-workflow-automation/trigger-create-connection.png":::

1. When you finish, close the trigger information box.

   The designer automatically saves your changes in draft mode until you're ready to publish to production.

   The following screenshot shows the finished example RSS trigger:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/trigger-complete.png" alt-text="Screenshot that shows the Logic Apps Automation workflow designer and configured RSS trigger named When a feed item is published." lightbox="media/quickstart-create-dynamic-workflow-automation/trigger-complete.png":::

<a id="add-action"></a>

#### 3c: Add an action to perform a task

An action completes a specific task in the workflow.

An *action* runs after the trigger fires and performs a specific task in the workflow. This example adds an action that sends a response back to the caller.

1. On the designer canvas, under the trigger, select the plus sign (+) to add an action.

   The **Add an action** pane opens so you can find the action you want.

1. Use search or browse the actions or action groups. Select the action that works best for your scenario.

   For more information about the gallery, see [Operations gallery](#operations-gallery).

   The action appears on the designer, and the information box opens so you can enter the inputs and configure settings for the action.

1. In the action information box, enter the values that the action needs to work.

1. When you finish, close the action information box.

<a id="operations-gallery"></a>

## Operations gallery

The following tables list only some examples from the 600+ and constantly growing gallery of services, systems, apps, and data sources that you can include in your workflow.

> [!NOTE]
>
> When you browse for triggers or actions, the gallery shows either or both sections:
>
> - **Azure connectors**: Triggers or actions that run in global, multitenant Azure and use shared computing resources.
>
> - **Built-in operations**: Triggers or actions that directly and natively work with the runtime.
>
>   These operations run faster, offer more capacity or throughput, and provide other benefits beyond their resource-sharing counterparts.

##### Example triggers in the operations gallery

| Trigger name or group | Connector or collection | Description |
|-----------------------|-------------------------|-------------|
| **When an HTTP request is received** | **Request** | Runs the workflow when an HTTP or HTTPS request arrives from an external caller. To return a response to the caller when the workflow completes, add the **Response** action at the end of the workflow. |
| **On a schedule** (**Recurrence**) | **Schedule** | Runs the workflow based on the specified schedule. |
| **Communication** group | **Office 365 Outlook** <br>**Outlook.com** <br>**Slack** <br>**Microsoft Teams** | Supports interactions with email, chat, and other communication. |
| **Collaboration** group | **Microsoft Forms** <br>**OneDrive for Business** <br>**OneNote (Business)** <br>**SharePoint** | Supports interactions with collaboration services and systems. |
| **Azure services** | **Service Bus** <br>**Azure File Storage** <br>**Azure Queue Storage** <br>**Azure Blob Storage** | Supports interactions with Azure services. |
| **Databases & Storage** | **FTP** <br>**Azure Blob Storage** <br>**Azure Queue Storage** <br>**SQL Server** | Supports interactions with databases and other storage systems. |
| **Business apps** | **Asana** <br>**Jira** <br>**Salesforce** <br>**SAP** <br>**Trello** | Supports interactions with enterprise business services, systems, apps, and data. |
| **Developer tools** group | **GitHub** <br>**Azure DevOps** <br>**Bitbucket** <br>**PagerDuty** | Supports interactions with source code repositories and work management systems. |
| **All triggers** group | --- | All available triggers, including: <br><br>- Agent request trigger for conversational agentic workflows. |

<a id="template"></a>

### [Non-blank template](#tab/non-blank)

   | Template | Description |
   |----------|-------------|
   | **Request-Response** | Run the workflow when an HTTPS request arrives from an external caller. Return an HTTP response to the caller when the workflow completes. <br><br>Continue with [Build a workflow with a non-blank template](#template). |
   | **Try-Catch Error Handler** | Catch and handle errors by using structured **Scope** actions. <br><br>Continue with [Build the workflow with a non-blank template](#template). |
   | **HTTP Request Handler** | Run the workflow when POST requests arrive from external callers. Return a JSON response to the original caller when the workflow completes. <br><br>Continue with [Build a workflow with a non-blank template](#template). |

---

## 4: Save and publish the workflow

The designer automatically saves the changes you make to a *draft* version. The *published* version runs in production.

> [!TIP]
>
> For workflows that start with a web request or webhook trigger, you can immediately test the draft version without publishing first. See [Test your workflow](#test-workflow).
>
> For workflows that start with a schedule-based trigger or an outside event, you must publish before the trigger can fire.

1. On the designer, at the canvas bottom, confirm that the **Draft** label appears.

1. Select **Publish** to make the draft live.

<a id="test-workflow"></a>

## 5: Test the workflow

To make sure everything works as expected, test your workflow by following these steps:

1. On the designer canvas, select **Test your draft**.

   A window opens where you can enter your test data.

1. In the test data box, enter the following JSON body:

   ```json
   {
     "name": "Azure Developer"
   }
   ```

1. Select **Run**.

   The workflow runs, and the monitoring view shows progress in real time.

## 6: Review the run history

After your workflow run completes, you can inspect what happened at every step.

1. Switch to the **Monitoring** tab.

   The run history list shows each completed workflow run with its status, timestamp, and duration.

1. Select the run to open the detail view.

   The canvas shows a color-coded status for each step. The **Execution log** lists every action in execution order with timing details.

1. To review the data, select any step on the canvas or in the execution log.

   | Tab | Shows |
   |-----|-------|
   | **Output** | The data that the step produced. |
   | **Input** | The data that the step received. |
   | **Properties** | Details such as the workflow status, the run duration, and the tracking ID. |

   For a web request trigger, you can review the headers and body from the incoming web request. For the **Response** action, you can confirm that the response body matches what you expected.

   > [!TIP]
   >
   > For failed steps, the same panel shows the error message so you can find the problem without leaving the run history view.

## Iterate and refine

You don't have to get everything right on the first pass. The following table describes three ways to make changes:

| Method | How to use it |
|--------|---------------|
| **Visual designer** | Select any step on the canvas to change settings, add new actions, or rearrange the flow. |
| **AI assistant** | Open the assistant inside the designer and type follow-up instructions, such as "add error handling to the response action" or "add a condition that checks whether the name field is empty." |
| **Code view** | Select **Code** on the bottom toolbar to open the JSON code side by side with the canvas. Changes in either view stay in sync. |

All edits go into a draft. Publish again when you're ready to send changes to production.

## 4: Manage users and permissions

## 5: Set up an agent

## Clean up resources

If you no longer need the resources you created in this quickstart, delete the resource group to avoid extra charges:

1. In the Azure portal search bar, enter the resource group name.

1. Select the resource group from the results.

1. On the resource group page, select **Delete resource group**.

1. Enter the resource group name to confirm, and then select **Delete**.

## Related content

- [What is Logic Apps Automation](dynamic-workflow-automation-introduction.md)
- [Compare automation tools](compare-automation-tools.md)
