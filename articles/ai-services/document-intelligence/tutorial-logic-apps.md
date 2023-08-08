---
title: Use Document intelligence (formerly Form Recognizer) with Azure Logic Apps
titleSuffix: Azure AI services
description: A tutorial introducing how to use Document intelligence with Logic Apps.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: tutorial
ms.date: 08/01/2023
ms.author: bemabonsu
zone_pivot_groups: cloud-location
monikerRange: '<=doc-intel-3.1.0'
---

# Create a Document Intelligence Logic Apps workflow

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD004 -->
<!-- markdownlint-disable MD032 -->
:::moniker range=">=doc-intel-3.0.0"
[!INCLUDE [applies to v3.1 and v3.0](includes/applies-to-v3-1-v3-0-v2-1.md)]

:::moniker-end

:::moniker range="doc-intel-2.1.0"
[!INCLUDE [applies to v2.1](includes/applies-to-v2-1.md)]
:::moniker-end

:::moniker range=">=doc-intel-3.0.0"

> [!IMPORTANT]
>
> This tutorial and the Logic App Document intelligence connector targets Document intelligence REST API v3.0 and forward.

:::moniker-end

:::moniker range="doc-intel-2.1.0"

> [!IMPORTANT]
>
> This tutorial and the Logic App Document intelligence connector targets Document intelligence REST API v2.1 and must be used with the [FOTT Sample Labeling tool](https://fott-2-1.azurewebsites.net/).

:::moniker-end

Azure Logic Apps is a cloud-based platform that can be used to automate workflows without writing a single line of code. The platform enables you to easily integrate Microsoft and third-party applications with your apps, data, services, and systems. A Logic App is the Azure resource you create when you want to develop a workflow. Here are a few examples of what you can do with a Logic App:

* Create business processes and workflows visually.
* Integrate workflows with software as a service (SaaS) and enterprise applications.
* Automate enterprise application integration (EAI), business-to-business (B2B), and electronic data interchange (EDI) tasks.

For more information, *see* [Logic Apps Overview](../../logic-apps/logic-apps-overview.md).

 In this tutorial, we show you how to build a Logic App connector flow to automate the following tasks:

> [!div class="checklist"]
>
> * Detect when an invoice as been added to a OneDrive folder.
> * Process the invoice using the Document Intelligence prebuilt-invoice model.
> * Send the extracted information from the invoice to a pre-specified email address.

Choose a workflow using a file from either your Microsoft OneDrive account or Microsoft ShareDrive site:

:::zone pivot="workflow-onedrive"
[!INCLUDE [OneDrive](includes/logic-app-tutorial/onedrive.md)]
:::zone-end

:::zone pivot="workflow-sharepoint"
[!INCLUDE [SharePoint](includes/logic-app-tutorial/sharepoint.md)]
:::zone-end

## Test the automation flow

Let's quickly review what we've done before we test our flow:

> [!div class="checklist"]
>
> * We created a trigger—in this scenario. The trigger is activated when a file is created in a pre-specified folder in our OneDrive account.
> * We added a Document Intelligence action to our flow. In this scenario, we decided to use the invoice API to automatically analyze an invoice from the OneDrive folder.
> * We added an Outlook.com action to our flow. We sent some of the analyzed invoice data to a pre-determined email address.

Now that we've created the flow, the last thing to do is to test it and make sure that we're getting the expected behavior.

1. To test the Logic App, first open a new tab and navigate to the OneDrive folder you set up at the beginning of this tutorial. Add this file to the OneDrive folder [Sample invoice.](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/invoice-logic-apps-tutorial.pdf)

1. Return to the Logic App designer tab and select the **Run trigger** button and select **Run** from the drop-down menu.

    :::image type="content" source="media/logic-apps-tutorial/trigger-run.png" alt-text="Screenshot of Run trigger and Run buttons.":::

1. You see a message in the upper=right corner indicating that the trigger was successful:

   :::image type="content" source="media/logic-apps-tutorial/trigger-successful.png" alt-text="Screenshot of Successful trigger message.":::

1. Navigate to your Logic App overview page by selecting your app name link in the upper-left corner.

    :::image type="content" source="media/logic-apps-tutorial/navigate-overview.png" alt-text="Screenshot of navigate to overview page link.":::

1. Check the status, to see if the run succeeded or failed. You can select the status indicator to check which steps were successful.

    :::image border="true" type="content" source="media/logic-apps-tutorial/succeeded-failed-indicator.png" alt-text="Screenshot of Succeeded or Failed status.":::

1. If your run failed, check the failed step to ensure that you entered the correct information.

   :::image type="content" source="media/logic-apps-tutorial/failed-run-step.png" alt-text="Screenshot of failed step.":::

1. Once achieve a successful run, check your email. There's a new email with the information we specified.

    :::image type="content" source="media/logic-apps-tutorial/invoice-received.png" alt-text="Screenshot of received email message.":::

1. Be sure to [disable or delete](../../logic-apps/manage-logic-apps-with-azure-portal.md#disable-or-enable-a-single-logic-app) your logic App after you're done so usage stops.

    :::image type="content" source="media/logic-apps-tutorial/disable-delete.png" alt-text="Screenshot of disable and delete buttons.":::

Congratulations! You've officially completed this tutorial.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Document Intelligence models](concept-model-overview.md)
