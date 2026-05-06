---
title: Create Dynamic Workflow Automation
description: Learn how to build dynamically-run, AI-driven automation workflows that make decisions to complete tasks autonomously or conversationally by using Logic Apps Automation.
services: azure-logic-apps
ms.reviewers: estfan, divswa, azla
ms.topic: quickstart
ai-usage: ai-assisted
ms.update-cycle: 180-days
ms.date: 06/02/2026
ms.custom:
  - build-2026
#customer intent: As an automation developer, I want to build my first dynamically-run, AI-powered automation workflow by using Logic Apps Automation.
---

# Quickstart: Build dynamic workflows with Logic Apps Automation (preview)

> [!NOTE]
>
> This preview capability, might incur charges, and is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


This guide shows how to create a dynamically-run [*workflow*](dynamic-workflow-automation-introduction.md#key-concepts-and-terminology) by using Logic Apps Automation. The example workflow performs the followng tasks:

1. Check for new stories at the Wall Street Journal by using an RSS feed.
1. Feed the results into a conversational agent loop.
1. Accept and handle questions about the stories through the chat interfact.
1. Summarize the conversation and send to email.

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- To follow the example, you need the URL for any RSS URL that doesn't need HTTP authorization, for example:

  `https://feeds.content.dowjones.io/public/rss/RSSMarketsMain`

  Choose an RSS feed that publishes frequently, so you can easily test your workflow. 

- 

## 1: Create your automation project

1. Visit the [Logic Apps Automation portal](), and sign in with your Azure account.

1. On the home page, under **Get started**, select **Create a project**.

   The Azure portal opens the **Automation Projects** page so you can create an automation project.

1. On the **Automation Projects** toolbar, select **+ Create**.

1. On the **Create an Automation Project** page, on the **Basics** tab, enter the following information:

   | Property | Description |
   |----------|-------------|
   | **Subscription** | Your Azure subscription. |
   | **Resource group** | The [Azure resource group](../azure-resource-manager/management/overview.md#terminology) for organizing your project resources. Enter a unique name across Azure regions that uses only alphanumeric characters, hyphens (`-`), underscores (`_`), parentheses (`()`), or periods (`.`). |
   | **Name** | Enter a unique project name across Azure regions that uses only alphanumeric characters, hyphens (`-`), underscores (`_`), parentheses (`()`), or periods (`.`). |
   | **Region** | The Azure region for your project. |

   For example:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/create-automation-project.png" alt-text="Screenshot that shows the Azure portal and page to create an automation project." lightbox="media/quickstart-create-dynamic-workflow-automation/create-automation-project.png":::

1. When you finish, select **Review + create** > **Create**.

   The Azure portal starts creating and deploying your automation project resource.

   > [!NOTE]
   >
   > This process might take several minutes to finish.

   After project creation completes, the automation project opens. If not, select **Go to resource**.

1. On the project toolbar, select **Open in Automation Portal** to open the Logic Apps Automation portal.

1. Sign in to the Logic Apps Automation portal.

## 2: Create your app

1. In the Logic Apps Automation portal, find and select your project. For example:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/project-list.png" alt-text="Screenshot that shows the Logic Apps Automation portal and project list." lightbox="media/quickstart-create-dynamic-workflow-automation/project-list.png":::

   The **Applications** page opens. New projects don't contain any apps, so create your app.

1. On the **Applications** page, select **+ Create Application**. For example:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/create-application.png" alt-text="Screenshot that shows the Logic Apps Automation portal and Applications page." lightbox="media/quickstart-create-dynamic-workflow-automation/create-application.png":::

1. In the **Create Application** box, for **Application name**, enter a name for your app, and select **Create**.

   > [!NOTE]
   >
   > This process might take several minutes to finish.

   After app creation completes, the app appears on the **Applications** page.

1. Select your app.

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/new-application.png" alt-text="Screenshot that shows the Applications page and newly created app." lightbox="media/quickstart-create-dynamic-workflow-automation/new-application.png":::

1. Under **Get started with your first workflow**, choose a path:

   - Ask the AI assistant to build the workflow.

     1. In the edit box, enter the description for the process to automate.

        > [!TIP]
        >
        > To view an example, from the **Examples** list, select a sample description that you can reuse or edit.

     1. When you finish, select **Build**.

     1. Continue to [Build a workflow by using a prompt](#build-workflow?tabs=prompt).

   - Build the workflow manually by using the designer.

     1. Select **Build from scratch**.

     1. For **Workflow name**, enter a name to use.

     1. Select a workflow template, and then select **Build**:

        | Template | Description |
        |----------|-------------|
        | **Blank workflow** | Start with an empty designer. Add a trigger to run the workflow. Add actions, agents, or MCP servers as tools. <br><br>Continue with [Build a workflow by using the blank template](#build-workflow?tabs=blank). |
        | **Request-Response** | Run the workflow when an HTTPS request arrives from an external caller. Return an HTTP response to the caller when the workflow completes. <br><br>Continue with [Build a workflow by using a non-blank template](#build-workflow?tabs=non-blank). |
        | **Try-Catch Error Handler** | Catch and handle errors by using structured **Scope** actions. <br><br>Continue with [Build the workflow using a non-blank template](#build-workflow?tabs=non-blank). |
        | **HTTP Request Handler** | Run the workflow when POST requests arrive from external callers. Return a JSON response to the original caller when the workflow completes. <br><br>For this option, continue with [Build a workflow by using a non-blank template](#build-workflow?tabs=non-blank). |

<a id="build-workflow"></a>

## 3: Add operations to a workflow

Every workflow starts with a [*trigger*](dynamic-workflow-automation-introduction.md#key-concepts-and-terminology), an operation that specifies the condition or criteria to meet before the workflow runs. Every workflow subsequently has one or multiple [*actions*](dynamic-workflow-automation-introduction.md#key-concepts-and-terminology) to perform tasks after the trigger fires.

Based on your previous selection for building your workflow, follow the corresponding path:

### [Blank template](#tab/blank)

The following sections show how to add an example trigger and action.

<a id="add-trigger"></a>

#### 3a: Add the trigger to start the workflow

The trigger runs a workflow after a specific condition or criteria is met. As an example, this section uses the **RSS** trigger named **When a feed item is published**. The trigger checks the URL for an RSS feed at the Wall Street Journal.

1. On the empty designer, select **Add a trigger**.

   The **Add a trigger** pane opens so you can find a trigger by browsing the gallery or using search, for example:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/empty-designer.png" alt-text="Screenshot that shows the empty Logic Apps Automation workflow designer and the Add a trigger pane." lightbox="media/quickstart-create-dynamic-workflow-automation/empty-designer.png":::

   For more information about the gallery, see [Operations gallery](#operations-gallery).

1. Select a specific trigger name or group.

   If you select a group, review the resulting triggers. If the results include a trigger that matches your scenario, select that trigger.

   -or-

   In the search box, enter the trigger name. If the results include a trigger that matches your scenario, select that trigger.

   This example selects the **RSS** trigger named **When a feed item is published**:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/select-trigger.png" alt-text="Screenshot that shows the Logic Apps Automation workflow designer, Add a trigger pane, and selected RSS trigger named When a feed item is published." lightbox="media/quickstart-create-dynamic-workflow-automation/select-trigger.png":::

   The trigger information box appears so you can enter the trigger's inputs and configure settings.

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/rss-trigger-preconfig.png" alt-text="Screenshot that shows the Logic Apps Automation workflow designer, Add a trigger pane, and selected RSS trigger named When a feed item is published." lightbox="media/quickstart-create-dynamic-workflow-automation/rss-trigger-preconfig.png":::

1. In the trigger information box, enter the values that the trigger needs to work.

   For example, the trigger requires an RSS feed URL and a connection name.

   1. Select the **Parameters** tab. For **The RSS feed URL**, enter the following value:

      `https://feeds.content.dowjones.io/public/rss/RSSMarketsMain`

      :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/rss-trigger-url.png" alt-text="Screenshot that shows the information box and Parameters tab with URL for the RSS trigger named When a feed item is published." lightbox="media/quickstart-create-dynamic-workflow-automation/rss-trigger-url.png":::

   1. Select the **Connection** tab, and then select **Create new connection**.

   1. For **Name your onnection**, enter a descriptive name like `wsj-connection-example`, and select **Create connection**.

      :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/rss-trigger-create-connection.png" alt-text="Screenshot that shows the information box and Connection tab with new connection name for the RSS trigger named When a feed item is published." lightbox="media/quickstart-create-dynamic-workflow-automation/rss-trigger-create-connection.png":::

1. When you're done, close the trigger information box.

   The designer automatically saves your changes in draft mode until you're ready to publish to production.

   The following screenshot shows the finished example RSS trigger:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/rss-trigger-complete.png" alt-text="Screenshot that shows the Logic Apps Automation workflow designer and configured RSS trigger named When a feed item is published." lightbox="media/quickstart-create-dynamic-workflow-automation/rss-trigger-complete.png":::

1. Continue to the next section so you can add an action to your workflow.

<a id="add-action"></a>

#### 3b: Add an action to perform a task

An action completes a specific task in the workflow.

1. On the designer, select the plus sign (+) to add an action.

   The **Add an action** pane opens so you can find an action by name or browse the gallery.

1. In the search box, enter the action name.

   -or-

   Select a specific trigger name or group.

   For more information about the gallery, see [Operations gallery](#operations-gallery).

   After you select a trigger, the trigger information box appears so you can enter the trigger's inputs and configure settings.

1. In the trigger information box, enter the values that the trigger needs to work.

#### Operations gallery

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

### [Prompt](#tab/prompt)

### [Non-blank template](#tab/non-blank)

---

## 4: Manage users and permissions

## 5: Set up an agent

## Related content


