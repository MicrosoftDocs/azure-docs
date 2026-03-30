---
title: Monitor and Track B2B Messages
description: Learn how to monitor and track B2B messages for Consumption workflows in Azure Logic Apps by collecting diagnostics data using Azure Monitor.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, divswa, azla
ms.topic: how-to
ms.date: 10/29/2025
#Customer intent: As an integration developer working with Azure Logic Apps, I want to monitor the B2B transaction traffic for Consumption workflows using Azure Monitor.
---

# Monitor and track B2B messages in Consumption workflows for Azure Logic Apps using Azure Monitor

[!INCLUDE [logic-apps-sku-consumption](includes/logic-apps-sku-consumption.md)]

> [!NOTE]
>
> This article applies only to Consumption logic app workflows. For Standard logic app workflows, see:
>
> - [Enable or open Application Insights after deployment for Standard workflows](create-single-tenant-workflows-azure-portal.md#enable-open-application-insights)
> - [Monitor and track B2B transactions in Standard workflows](monitor-track-b2b-transactions-standard.md)

After you set up B2B communication between trading partners in an integration account, these partners can exchange messages by using protocols such as AS2, X12, and EDIFACT. To confirm that this communication works as expected, set up Azure Monitor logs for your integration account.

Azure Monitor helps you monitor your cloud and on-premises environments so that you can more easily maintain their availability and performance. By using Azure Monitor logs, you can record and store data about runtime data and events, such as trigger events, run events, and action events in a Log Analytics workspace.

For messages, logging also collects the following information:

- Message count and status
- Acknowledgments status
- Correlations between messages and acknowledgments
- Detailed error descriptions for failures

Azure Monitor lets you create log queries that help you find and review this information. You can also use this diagnostics data with other Azure services, such as Azure Storage and Azure Event Hubs.

This guide shows how to set up Azure Monitor logging for your integration account. You first install the Logic Apps B2B solution in the Azure portal. This solution provides aggregated information for B2B message events. Then, to enable logging and creating queries, you learn how to set up Azure Monitor logs.

For more information, see:

- [Azure Monitor overview](/azure/azure-monitor/fundamentals/overview)
- [Azure Monitor Logs overview](/azure/azure-monitor/logs/data-platform-logs)
- [Resource log destinations](/azure/azure-monitor/platform/resource-logs?tabs=log-analytics#destinations)
- [Log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview)
- [Send diagnostic data to Azure Storage and Azure Event Hubs](monitor-workflows-collect-diagnostic-data.md#other-destinations)

[!INCLUDE [azure-monitor-log-analytics-rebrand](~/reusable-content/ce-skilling/azure/includes/azure-monitor-log-analytics-rebrand.md)]

## Prerequisites

- An Azure account with an active subscription. If you don't have a subscription, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A Log Analytics workspace. If you don't have a Log Analytics workspace, see [Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace).

- A Consumption logic app resource that's [set up Azure Monitor logging](monitor-workflows-collect-diagnostic-data.md?tabs=consumption) and has a workflow with the B2B messages that you want to monitor.

  Your workflow sends logging information to a Log Analytics workspace or another destination that you want.

- An integration account that's [linked to your logic app resource](enterprise-integration/create-integration-account.md?tabs=azure-portal%2Cconsumption#link-to-logic-app).

<a name="install-b2b-solution"></a>

## Install Logic Apps B2B solution

Before Azure Monitor logs can track the B2B messages for your logic app, add the **Logic Apps B2B** solution to your Log Analytics workspace.

1. In the [Azure portal](https://portal.azure.com) search box, enter *log analytics workspaces*, and then select **Log Analytics workspaces**.

   :::image type="content" source="./media/monitor-b2b-messages-log-analytics/find-select-log-analytics-workspaces.png" alt-text="Screenshot shows the Azure portal search box with Log Analytics workspaces highlighted.":::

1. Under **Log Analytics workspaces**, select your workspace.

   :::image type="content" source="./media/monitor-b2b-messages-log-analytics/select-log-analytics-workspace.png" alt-text="Screenshot shows the Log Analytics workspaces that you can select.":::

1. On the **Overview** page, under **Get started with Log Analytics** > **Configure monitoring solutions**, select **View solutions**.

   :::image type="content" source="./media/monitor-b2b-messages-log-analytics/log-analytics-workspace.png" alt-text="Screenshot shows the Overview page for your workspace where you can select View solutions.":::

1. On the **Overview** page, select **Add**.

1. After the **Marketplace** opens, in the search box, enter *logic apps b2b*, and select **Logic Apps B2B**.

   :::image type="content" source="./media/monitor-b2b-messages-log-analytics/select-logic-apps-b2b-solution.png" alt-text="Screenshot shows the Marketplace where you can search for and select Logic Apps B2B.":::

1. On the solution description pane, select **Create**.

   :::image type="content" source="./media/monitor-b2b-messages-log-analytics/create-logic-apps-b2b-solution.png" alt-text="Screenshot shows Create selected to add Logic Apps B2B solution.":::

1. Review and confirm the Log Analytics workspace where you want to install the solution, and select **Create** again.

   :::image type="content" source="./media/monitor-b2b-messages-log-analytics/confirm-log-analytics-workspace.png" alt-text="Screenshot shows the Logic Apps B2B solution page, where you can select subscription and plan, then Create.":::

   Azure deploys the solution to the Azure resource group that contains your Log Analytics workspace.

1. Go to your Log Analytics workspace, On the **Overview** page, on the **Get Started** tab, select **View solutions** again to see the installed solution. Select the solution tile to view more message details.

   When the workflow processes B2B messages, the charts update with the message count.

   :::image type="content" source="./media/monitor-b2b-messages-log-analytics/b2b-overview-messages-summary.png" alt-text="Screenshot shows the workspace Overview page with the message status chart.":::

<a name="set-up-resource-logs"></a>

## Set up Azure Monitor logs

You can enable Azure Monitor logging directly from your integration account.

1. In the [Azure portal](https://portal.azure.com), find and select your integration account.

   :::image type="content" source="./media/monitor-b2b-messages-log-analytics/find-integration-account.png" alt-text="Screenshot shows the Integration accounts page where you can select your integration account." lightbox="./media/monitor-b2b-messages-log-analytics/find-integration-account.png":::

1. On the integration account sidebar, under **Monitoring**, select **Diagnostic settings**. Under the **Diagnostic settings** table, select **Add diagnostic setting**.

   :::image type="content" source="./media/monitor-b2b-messages-log-analytics/monitor-diagnostics-settings.png" alt-text="Screenshot shows the Diagnostics settings page where you can add a diagnostics setting." lightbox="./media/monitor-b2b-messages-log-analytics/monitor-diagnostics-settings.png":::

1. To create the setting, follow these steps:

   1. For **Diagnostic setting name**, provide a name.

   1. Under **Destination details**, select **Send to Log Analytics workspace**.

   1. For **Subscription**, select the Azure subscription for your Log Analytics workspace.

   1. For **Log Analytics Workspace**, select the workspace that you want to use.

   1. Under **Logs**, select **Integration Account tracking events**, which specifies the event category that you want to record.

   1. When you're done, on the toolbar, select **Save**.

   For example: 

   :::image type="content" source="./media/monitor-b2b-messages-log-analytics/send-diagnostics-data-log-analytics-workspace.png" alt-text="Screenshot shows the Diagnostic setting page where you can set up Azure Monitor logs to collect diagnostic data." lightbox="./media/monitor-b2b-messages-log-analytics/send-diagnostics-data-log-analytics-workspace.png":::

<a name="view-message-status"></a>

## View message status

After your workflow runs, you can view the status and data about any B2B messages exchanged by partners.

1. In the [Azure portal](https://portal.azure.com) search box, find and open the resource group for your Log Analytics workspace.

1. From the resource group, select the Logic Apps B2B solution that you previously installed.

1. From the solution sidebar, select **Summary**.

   :::image type="content" source="./media/monitor-b2b-messages-log-analytics/b2b-overview-messages-summary.png" alt-text="Screenshot shows the solution Summary page.":::

   > [!NOTE]
   >
   > If the Logic Apps B2B tile doesn't immediately show results after a run, try refreshing the browser or wait for a short time before trying again.

   By default, the **Logic Apps B2B** tile shows data based on a single day. To change the data scope to a different interval, select the scope control at the top of the page:

   :::image type="content" source="./media/monitor-b2b-messages-log-analytics/change-summary-interval.png" alt-text="Screenshot shows the control to change the interval.":::

1. After the message status dashboard appears, you can view more details for a specific message type, which shows data based on a single day. Select the tile for **AS2**, **X12**, or **EDIFACT**.

   :::image type="content" source="./media/monitor-b2b-messages-log-analytics/workspace-summary-b2b-messages.png" alt-text="Screenshot shows the status messages." lightbox="./media/monitor-b2b-messages-log-analytics/workspace-summary-b2b-messages.png":::

   A list of messages appears for your chosen tile. For example, here's what an AS2 message list might look like:

   :::image type="content" source="./media/monitor-b2b-messages-log-analytics/as2-message-results-list.png" alt-text="Screenshot shows statuses and details for AS2 messages.":::

   To learn more about the properties for each message type, see these message property descriptions:

   * [AS2 message properties](#as2-message-properties)
   * [X12 message properties](#x12-message-properties)
   * [EDIFACT message properties](#EDIFACT-message-properties)

<!--
1. To view or export the inputs and outputs for specific messages, select those messages, and select **Download**. When you're prompted, save the .zip file to your local computer, and then extract that file.

   The extracted folder includes a folder for each selected message. If you set up acknowledgements, the message folder also includes files with acknowledgement details. Each message folder has at least these files:
   
   * Human-readable files with the input payload and output payload details
   * Encoded files with the inputs and outputs

   For each message type, you can find the folder and file name formats here:

   * [AS2 folder and file name formats](#as2-folder-file-names)
   * [X12 folder and file name formats](#x12-folder-file-names)
   * [EDIFACT folder and file name formats](#edifact-folder-file-names)

   :::image type="content" source="./media/monitor-b2b-messages-log-analytics/download-messages.png" alt-text="Screenshot shows the option to download message files.":::

1. To view all actions that have the same run ID, on the **Log Search** page, select a message from the message list.

   You can sort these actions by column, or search for specific results.

   * To search results with prebuilt queries, select **Favorites**.

   * Learn [how to build queries by adding filters](../logic-apps/create-monitoring-tracking-queries.md). Or learn more about [how to find data with log searches in Azure Monitor logs](/azure/azure-monitor/logs/log-query-overview).

   * To change query in the search box, update the query with the columns and values that you want to use as filters.
-->

<a name="message-list-property-descriptions"></a>

## Property descriptions and name formats for AS2, X12, and EDIFACT messages

For each message type, here are the property descriptions and name formats for downloaded message files.

<a name="as2-message-properties"></a>

### AS2 message property descriptions

Here are the property descriptions for each AS2 message.

| Property | Description |
|----------|-------------|
| **Sender** | The guest partner specified in **Receive Settings**, or the host partner specified in **Send Settings** for an AS2 agreement |
| **Receiver** | The host partner specified in **Receive Settings**, or the guest partner specified in **Send Settings** for an AS2 agreement |
| **Logic App** | The logic app where the AS2 actions are set up |
| **Status** | The AS2 message status <br>Success = Received or sent a valid AS2 message. No Message Disposition Notification (MDN) is set up. <br>Success = Received or sent a valid AS2 message. MDN is set up and received, or MDN is sent. <br>Failed = Received an invalid AS2 message. No MDN is set up. <br>Pending = Received or sent a valid AS2 message. MDN is set up, and MDN is expected. |
| **ACK** | The MDN message status <br>Accepted = Received or sent a positive MDN. <br>Pending = Waiting to receive or send an MDN. <br>Rejected = Received or sent a negative MDN. <br>Not Required = MDN isn't set up in the agreement. |
| **Direction** | The AS2 message direction |
| **Tracking ID** | The ID that correlates all the triggers and actions in a logic app |
| **Message ID** | The AS2 message ID from the AS2 message headers |
| **Timestamp** | The time when the AS2 action processed the message |

<!--
<a name="as2-folder-file-names"></a>

### AS2 name formats for downloaded message files

Here are the name formats for each downloaded AS2 message folder and files.

| Folder or file | Name format |
|----------------|-------------|
| Message folder | [sender]\_[receiver]\_AS2\_[correlation-ID]\_[message-ID]\_[timestamp] |
| Input, output, and if set up, acknowledgement files | **Input payload**: [sender]\_[receiver]\_AS2\_[correlation-ID]\_input_payload.txt </p>**Output payload**: [sender]\_[receiver]\_AS2\_[correlation-ID]\_output\_payload.txt </p></p>**Inputs**: [sender]\_[receiver]\_AS2\_[correlation-ID]\_inputs.txt </p></p>**Outputs**: [sender]\_[receiver]\_AS2\_[correlation-ID]\_outputs.txt |
|||
-->

<a name="x12-message-properties"></a>

### X12 message property descriptions

Here are the property descriptions for each X12 message.

| Property | Description |
|----------|-------------|
| **Sender** | The guest partner specified in **Receive Settings**, or the host partner specified in **Send Settings** for an X12 agreement |
| **Receiver** | The host partner specified in **Receive Settings**, or the guest partner specified in **Send Settings** for an X12 agreement |
| **Logic App** | The logic app where the X12 actions are set up |
| **Status** | The X12 message status <br>Success = Received or sent a valid X12 message. No functional ack is set up. <br>Success = Received or sent a valid X12 message. Functional ack is set up and received, or a functional ack is sent. <br>Failed = Received or sent an invalid X12 message. <br>Pending = Received or sent a valid X12 message. Functional ack is set up, and a functional ack is expected. |
| **ACK** | Functional Ack (997) status <br>Accepted = Received or sent a positive functional ack. <br>Rejected = Received or sent a negative functional ack. <br>Pending = Expecting a functional ack but not received. <br>Pending = Generated a functional ack but can't send to partner. <br>Not Required = Functional ack isn't set up. |
| **Direction** | The X12 message direction |
| **Tracking ID** | The ID that correlates all the triggers and actions in a logic app |
| **Msg Type** | The EDI X12 message type |
| **ICN** | The Interchange Control Number for the X12 message |
| **TSCN** | The Transaction Set Control Number for the X12 message |
| **Timestamp** | The time when the X12 action processed the message |

<!--
<a name="x12-folder-file-names"></a>

### X12 name formats for downloaded message files

Here are the name formats for each downloaded X12 message folder and files.

| Folder or file | Name format |
|----------------|-------------|
| Message folder | [sender]\_[receiver]\_X12\_[interchange-control-number]\_[global-control-number]\_[transaction-set-control-number]\_[timestamp] |
| Input, output, and if set up, acknowledgement files | **Input payload**: [sender]\_[receiver]\_X12\_[interchange-control-number]\_input_payload.txt </p>**Output payload**: [sender]\_[receiver]\_X12\_[interchange-control-number]\_output\_payload.txt </p></p>**Inputs**: [sender]\_[receiver]\_X12\_[interchange-control-number]\_inputs.txt </p></p>**Outputs**: [sender]\_[receiver]\_X12\_[interchange-control-number]\_outputs.txt |
|||
-->

<a name="EDIFACT-message-properties"></a>

### EDIFACT message property descriptions

Here are the property descriptions for each EDIFACT message.

| Property | Description |
|----------|-------------|
| **Sender** | The guest partner specified in **Receive Settings**, or the host partner specified in **Send Settings** for an EDIFACT agreement |
| **Receiver** | The host partner specified in **Receive Settings**, or the guest partner specified in **Send Settings** for an EDIFACT agreement |
| **Logic App** | The logic app where the EDIFACT actions are set up |
| **Status** | The EDIFACT message status <br>Success = Received or sent a valid EDIFACT message. No functional ack is set up. <br>Success = Received or sent a valid EDIFACT message. Functional ack is set up and received, or a functional ack is sent. <br>Failed = Received or sent an invalid EDIFACT message <br>Pending = Received or sent a valid EDIFACT message. Functional ack is set up, and a functional ack is expected. |
| **ACK** | Functional Ack (CONTRL) status <br>Accepted = Received or sent a positive functional ack. <br>Rejected = Received or sent a negative functional ack. <br>Pending = Expecting a functional ack but not received. <br>Pending = Generated a functional ack but can't send to partner. <br>Not Required = Functional Ack isn't set up. |
| **Direction** | The EDIFACT message direction |
| **Tracking ID** | The ID that correlates all the triggers and actions in a logic app |
| **Msg Type** | The EDIFACT message type |
| **ICN** | The Interchange Control Number for the EDIFACT message |
| **TSCN** | The Transaction Set Control Number for the EDIFACT message |
| **Timestamp** | The time when the EDIFACT action processed the message |

<!--
<a name="edifact-folder-file-names"></a>

### EDIFACT name formats for downloaded message files

Here are the name formats for each downloaded EDIFACT message folder and files.

| Folder or file | Name format |
|----------------|-------------|
| Message folder | [sender]\_[receiver]\_EDIFACT\_[interchange-control-number]\_[global-control-number]\_[transaction-set-control-number]\_[timestamp] |
| Input, output, and if set up, acknowledgement files | **Input payload**: [sender]\_[receiver]\_EDIFACT\_[interchange-control-number]\_input_payload.txt </p>**Output payload**: [sender]\_[receiver]\_EDIFACT\_[interchange-control-number]\_output\_payload.txt </p></p>**Inputs**: [sender]\_[receiver]\_EDIFACT\_[interchange-control-number]\_inputs.txt </p></p>**Outputs**: [sender]\_[receiver]\_EDIFACT\_[interchange-control-number]\_outputs.txt |
|||
-->

## Related content

- [Create monitoring and tracking queries](create-monitoring-tracking-queries.md)
