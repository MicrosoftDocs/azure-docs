---
title: Create Workflows for Dynamic Automation
titleSuffix: Azure Logic Apps Automation
description: Build dynamic, AI-driven workflows that run independently or with human oversight in Azure Logic Apps Automation.
services: azure-logic-apps
ms.reviewer: estfan, krmitta, divswa, azla
ms.topic: quickstart
ai-usage: ai-assisted
ms.update-cycle: 180-days
ms.date: 06/11/2026
ms.custom:
  - build-2026
#Customer intent: As an automation developer, I need to build my first dynamic, AI-powered workflow in Azure Logic Apps Automation.
---

# Quickstart: Create dynamic workflows in Azure Logic Apps Automation (preview)

> [!NOTE]
>
> This preview capability is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When you automate a business process, you want to define the business logic only once, and then run the automation reliably and autonomously with human oversight when necessary. For example, some automation tasks might include routing notifications, running operations in various services or systems, or monitoring data feeds.

In Azure Logic Apps Automation, a [*workflow*](dynamic-workflow-automation-introduction.md#key-concepts-and-terminology) is the unit that runs an automation workload. Each complete workflow has the following basic attributes:

- Lives within an automation application.
- Starts with a single [*trigger*](dynamic-workflow-automation-introduction.md#key-concepts-and-terminology). This item specifies the event to run the workflow.
- Follows the trigger with one or multiple [*actions*](dynamic-workflow-automation-introduction.md#key-concepts-and-terminology) that perform the necessary tasks or affect the execution path.

This quickstart shows how to build a workflow within an existing application. For simplicity, learn the general steps for using the AI assistant and the designer. The article then provides more specific examples for more detailed workflows.

For more information, see:

- [What is Azure Logic Apps Automation](dynamic-workflow-automation-introduction.md)
- [Key concepts and terminology](dynamic-workflow-automation-introduction.md#key-concepts-and-terminology)

## Prerequisites

- A Microsoft work or school account that can access the [Azure Logic Apps Automation portal](https://auto.azure.com).

- Your work or school account needs to exist in the same Microsoft Entra tenant as the application creator-owner so they can add you to the application and assign the necessary permissions. If you don't have access, work with the project and application creator-owner to get access and permissions.

  For more information about Microsoft Entra tenants, see [Tenant configurations](/entra/identity-platform/v2-overview#tenant-configurations).

- The project and the application where you want to create your workflow.

  You need the **Contributor** role to create workflows.

  For more information, see:

  - [Create dynamic automation projects](quickstart-create-dynamic-automation-projects.md)
  - [Create dynamic automation applications](quickstart-create-dynamic-automation-applications.md)

#### Example: Web request handling requirements

- To test your workflow in this example, you need a tool that can send HTTP requests, such as:

  [!INCLUDE [api-test-http-request-tools-list](../../../includes/api-test-http-request-tools-list.md)]

  [!INCLUDE [api-test-http-request-tools-caution](../../../includes/api-test-http-request-tools-caution.md)]

- To optionally get email notifications for testing, you need an email account, such as Office 365 Outlook or Outlook.com.

<!---
##### Example: RSS feed monitoring requirements

To set up and test your workflow for this example, you need the URL for any RSS feed that doesn't need HTTP authorization. Choose an RSS feed that publishes frequently so you don't have to wait long for new articles. This article uses the following example RSS feed URL:

`https://feeds.content.dowjones.io/public/rss/RSSMarketsMain`

--->

## Create your workflow

This section describes the general steps to create a workflow by using the AI assistant, designer, and templates. You can choose any approach to start. Whatever your choice, you get a workflow that you can test and monitor in the Azure Logic Apps Automation portal.

### 1: Open the automation project and application

1. Go to the [Azure Logic Apps Automation portal](https://auto.azure.com), and sign in with your Microsoft work or school account.

1. From the **Projects** tab, select the project you want.

1. From the **Apps** page, select the application you want.

   The portal opens the application's **Workflows** page.
   
1. Select **Create workflow**, enter a workflow name, and select **Build**.

   The workflow designer opens and shows an empty canvas with the **Add a trigger** placeholder.

1. Choose one of the following approaches to start creating your workflow.

   Although you can combine approaches, choose an initial approach to get started, based on your preference:

   | Starting point | Description | When to use |
   |----------------|-------------|-------------|
   | [AI assistant](#assistant) | Describe the business process logic to automate by using plain words. The assistant generates the workflow. | You want to quickly generate a workflow, review the results, and adjust the workflow by using the assistant, designer, or both. |
   | [Workflow designer](#designer) | Start building incrementally by using an empty designer. Add a trigger, actions, agents, tools, MCP servers, and other components to drive your automation. | You want a visual, graphical experience to build, test, and run workflows. |

   <!--
   | [Workflow templates](#template) | Prepopulate an empty designer by using a prebuilt workflow template for a specific automation scenario. The template includes a trigger, actions, and other components. <br><br>**Note**: To complete the workflow, you need to provide any remaining requirements that the workflow needs, such as connection authentication information and parameter values. | You want to jumpstart your workflow by applying a common or specific automation workflow pattern. |
   -->

<a id="assistant"></a>

#### [AI assistant](#tab/assistant)

To generate a workflow by using plain words to describe the behavior you want, use the AI assistant. The assistant creates the workflow structure, including the trigger, actions, and any branches. After the assistant finishes, you complete the workflow by providing any authentication credentials, parameter values, and settings that your specific scenario requires.

1. After the designer opens, on the bottom toolbar, select **Copilot**.

1. In the **Copilot** pane, enter a detailed description about the process you want to automate.

   > [!TIP]
   >
   > Make your description as specific as possible by including the following elements:
   >
   > - The trigger event or condition that makes your workflow run.
   > - The actions that you want to happen.
   > - The results that you expect and want. 
   >
   > When you provide more detail, you generate a workflow that matches more closely to what you need.

1. When you're ready, select **Generate**.

   Copilot generates and validates your workflow in real time. Based on your workflow's complexity, this process might need between several moments up to a few minutes to finish.

1. Before you test your workflow, complete the following steps:

   - Set up any required connections for operations that call outside services or systems.

   - Provide values for any required fields that the assistant left empty. Required fields show an asterisk (*) or a red outline.

   - Fix any alerts that appear on individual steps.

     Alert icons appear on operations that need extra setup, such as missing parameter values, settings, connections, or tools.

1. To find follow-up tasks, on the designer, select each operation that shows an alert. Take the necessary steps to fix each alert. 

1. Finish any other follow-up tasks that your workflow requires, such as set up connections, provide parameter values, or configure settings.

1. To adjust or edit the workflow, continue using the assistant by entering prompts in the chat window.

##### Example: Web request handling

This example creates a workflow that runs when a web request arrives from an external caller, accepts the request, and returns a response to the caller. 

- **Workflow name**: `web-request-handler`

- **Assistant prompt**: `When a web request arrives with a JSON body, respond with a 200 OK status that includes a greeting message.`

<!---
##### Example: RSS feed monitoring

This example creates a workflow that periodically checks an RSS feed for new articles, based on a schedule. Each time when a new article appears on the RSS feed, the workflow runs the following tasks:

1. Feeds the results into an agent.
1. Accept and handle questions about the articles through chat.
1. Summarize the conversation and send to email.

- **Workflow name**: `check-wsj-rss-feed-with-prompt`

- **Assistant prompt**: `Check the RSS feed at 'https://feeds.content.dowjones.io/public/rss/RSSMarketsMain' by using the RSS trigger. Follow the link to each article, read the article, and create a summary. Send the article to my email account by using an Office 365 Outlook action.`

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
-->

<a id="designer"></a>

### [Designer](#tab/designer)

To build a workflow visually, manually, and incrementally, use the workflow designer. You start with an empty canvas so you can select the trigger, actions, agents, tools, MCP servers, and other components to power your automation.

<a id="add-trigger"></a>

#### 1: Add a trigger

To add the trigger event that starts your workflow, follow these steps:

1. On the designer, select **Add a trigger**.

   > [!NOTE]
   >
   > If the Copilot pane is open, the **Add a trigger** placeholder doesn't appear. To view the placeholder, make sure the Copilot pane is closed.

   The **Add a trigger** pane opens so you can find the trigger you want.

1. Use search or browse the triggers or trigger groups. Select the trigger that you want for your scenario.

   :::image type="content" source="media/quickstart-create-dynamic-automation-workflows/empty-designer.png" alt-text="Screenshot that shows the empty Azure Logic Apps Automation workflow designer and the Add a trigger pane." lightbox="media/quickstart-create-dynamic-automation-workflows/empty-designer.png":::

   After you select the trigger, the trigger information box opens so you can provide the trigger inputs and configure settings.

   For more information about the gallery, see [Operations gallery](#operations-gallery).

   **Example: Web request handling**

   For this example, the **Request** trigger named **When an HTTP request is received** runs the workflow when a web request arrives from an outside caller.

1. In the trigger information box, provide the information that the trigger needs to work.

1. When you finish, close the trigger information box.

   By default, the designer runs in draft mode, so the designer automatically saves your changes until you're ready to publish to production.

<a id="add-action"></a>

### 3: Add an action

After the trigger fires, an action performs a specific task in the workflow. To add an action, follow these steps:

1. On the designer, following the trigger, select the plus sign (+) to add an action.

   The **Add an action** pane opens so you can find the action you want.

1. Use search or browse the actions or action groups. Select the action that you want for your scenario.

   After you select the action, the action information box opens so you can provide the action inputs and configure settings.

   For more information about the gallery, see [Operations gallery](#operations-gallery).

   **Example: Web request handling**

   For this example, the workflow uses the **Request** action named **Response** to send a message back to the original caller.

1. In the action information box, provide the information that the action needs to work.

   **Example: Web request handling**

   For this example, the **Response** action sends the following information back to the caller:

   | Parameter | Value | Description |
   |-----------|-------|-------------|
   | **Status** | `200` | Acknowledges that your workflow received and successfully processed the request. |
   | **Body** | `Hello, we received your request!` | Responds with a greeting and confirmation message.|

1. When you finish, close the action information box.

<a id="operations-gallery"></a>

### Operations gallery

When you browse for triggers or actions, the gallery shows operations that run in different platform environments:

| Operation type | Runtime | Description |
|----------------|---------------|-------------|
| **Built-in operations** | Azure Logic Apps Automation | Triggers and actions that directly and natively work in the isolated runtime with its own compute, networking, virtual network integration, and security. <br><br>These operations run faster, offer more capacity or throughput, and provide other benefits beyond their resource-sharing counterparts. |
| **Azure connectors** | Azure global | Triggers or actions that run in multitenant Azure and use shared computing resources. |

<!--

##### Operations gallery: Example triggers

The following table lists only some examples from the 1,400+ and constantly growing gallery with the services, systems, apps, and data sources that you can use in your workflow. 

| Trigger name or group | Connector or collection | Description |
|-----------------------|-------------------------|-------------|
| **When an HTTP request is received** | **Request** | Runs the workflow when an HTTP or HTTPS request arrives from an external caller. To return a response to the caller when the workflow completes, add the **Response** action at the end of the workflow. |
| **On a schedule** (**Recurrence**) | **Schedule** | Runs the workflow based on the specified schedule. |
| **Communication** group | **Office 365 Outlook** <br>**Outlook.com** <br>**Slack** <br>**Microsoft Teams** | Azure | Supports interactions with email, chat, SMS, social events, and other communication. |
| **Business apps** | **Asana** <br>**Jira** <br>**OneDrive** <br>**OneNote** <br>**Salesforce** <br>**SAP** <br>**SharePoint** <br>**Trello** | Supports interactions for collaboration and with enterprise business services, systems, apps, and data. |
| **Data, cloud & developer** | **Azure Blob Storage** <br>**File System** <br>**Azure Queue Storage** <br>**SQL Server** <br>**FTP** **GitHub** <br>**Azure DevOps** <br>**Bitbucket** <br>**PagerDuty** <br>**Service Bus** | Supports interactions with storage systems, file shares, databases, source code repositories, and work management systems. |
-->

---

## Save and publish the workflow

The designer automatically saves the changes that you make to the draft version. The published version runs in production.

> [!TIP]
>
> For workflows that start with a web request or webhook trigger, you can immediately test the draft version first without publishing. See [Test your workflow](#test-workflow).
>
> For workflows that start with a schedule-based trigger or an outside event, you must publish before the trigger can fire.

1. On the designer title bar, at the top left, confirm that the **Draft** label appears.

1. On the designer title bar, at the top right, select **Publish** to make the draft live.

<a id="test-workflow"></a>

## Test the workflow

To make sure everything works as expected, follow these steps to test your workflow:

1. On the designer, at the bottom, select **Test**.

   The **Test draft workflow** box opens.

1. In the **Test data (JSON)** box, enter your test data in JSON format. Select **Test Draft**.

   The workflow starts running, and the portal changes from **Designer** view to **Monitoring** view where you can observe the run progress in real time.

## Review workflow run history

1. After the workflow run completes, review each step in **Monitoring** view to better understand what happened.

   - The read-only canvas now shows a color-coded status for each step. 
   - The side window shows each workflow run instance with its status, timestamp, and duration.
   - The execution log shows every operation in execution order.
   - Next to the log, you can review the operation's output, input, and properties.

   > [!TIP]
   >
   > For failed operations, the same panel shows the error message so you can find the problem without leaving **Monitoring** view.

1. To review the data, select any operation on the canvas or in the execution log.

   The following table describes the data that you can review:

   | Tab | Shows |
   |-----|-------|
   | **Output** | The data that the operation produced. |
   | **Input** | The data that the operation received. |
   | **Properties** | Details such as the workflow status, the run duration, and the tracking ID. |

   For a web request trigger, you can review the headers and body from the incoming web request. For the **Response** action, you can confirm that the response body matches what you expected.

## Iterate and refine

You don't need to get everything right on the first pass. The following steps describe ways that you can edit your workflow:

1. From **Monitoring** view, return to **Designer** view.

1. From the following table, choose the method you want for making your changes:

   | Method | Steps |
   |--------|-------|
   | **Designer** | On the designer, add new actions, rearrange the workflow sequence, or select any operation to edit the parameter values and settings. |
   | **Assistant** | 1. On the bottom toolbar, select **Chat** to open the assistant. <br><br>2. Enter follow-up instructions, such as `Add error handling to the Response action` or `Add a condition that checks whether the name field is empty`. |
   | **Code** editor | 1. On the bottom toolbar, select **Code** to view the underlying JSON for the workflow definition. <br><br>2. Edit the workflow definition to make your changes. |

   Changes in **Designer** view and **Code** view stay synchronized. All your edits go into the draft version.

1. When you're ready to send your changes to production, on the designer title bar, select **Publish**.

   <!---
   | **RSS** | **When a feed item is published** | Runs on the specified schedule to check an RSS feed for new stories. |
   The following example selects the **RSS** trigger named **When a feed item is published**:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/select-trigger.png" alt-text="Screenshot that shows the Azure Logic Apps Automation workflow designer, Add a trigger pane, and selected RSS trigger named When a feed item is published." lightbox="media/quickstart-create-dynamic-workflow-automation/select-trigger.png":::

   The trigger appears on the designer, and the information box opens so you can enter the inputs and configure settings for the trigger.

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/trigger-before-setup.png" alt-text="Screenshot that shows the information box for the RSS trigger named When a feed item is published." lightbox="media/quickstart-create-dynamic-workflow-automation/trigger-before-setup.png":::
   --->

   <!---

   For the example trigger, enter an RSS feed URL and a connection name.

   1. On the **Parameters** tab, for **The RSS feed URL**, enter the following value:

      `https://feeds.content.dowjones.io/public/rss/RSSMarketsMain`

      :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/trigger-url.png" alt-text="Screenshot that shows the information box and Parameters tab with URL for the RSS trigger named When a feed item is published." lightbox="media/quickstart-create-dynamic-workflow-automation/trigger-url.png":::

   1. On the **Connection** tab, select **Create new connection**.

   1. For **Name your connection**, enter a descriptive name like `wsj-connection-example`, and select **Create connection**.

      :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/trigger-create-connection.png" alt-text="Screenshot that shows the information box and Connection tab with new connection name for the RSS trigger named When a feed item is published." lightbox="media/quickstart-create-dynamic-workflow-automation/trigger-create-connection.png":::

   The following screenshot shows the finished example RSS trigger:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/trigger-complete.png" alt-text="Screenshot that shows the Azure Logic Apps Automation workflow designer and configured RSS trigger named When a feed item is published." lightbox="media/quickstart-create-dynamic-workflow-automation/trigger-complete.png":::

   --->

<!--
<a id="template"></a>

### [Non-blank template](#tab/non-blank)

   | Template | Description |
   |----------|-------------|
   | **Request-Response** | Run the workflow when an HTTPS request arrives from an external caller. Return an HTTP response to the caller when the workflow completes. <br><br>Continue with [Build a workflow with a non-blank template](#template). |
   | **Try-Catch Error Handler** | Catch and handle errors by using structured **Scope** actions. <br><br>Continue with [Build the workflow with a non-blank template](#template). |
   | **HTTP Request Handler** | Run the workflow when POST requests arrive from external callers. Return a JSON response to the original caller when the workflow completes. <br><br>Continue with [Build a workflow with a non-blank template](#template). |

-->

## Related content

- [What is Azure Logic Apps Automation](dynamic-workflow-automation-introduction.md)
- [Compare automation services](compare-automation-services.md)
- [Quickstart docs - Azure Logic Apps Automation portal](https://auto.azure.com/docs/getting-started/quickstart/)
