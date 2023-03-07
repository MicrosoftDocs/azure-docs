---
title: Use Azure Logic Apps with Form Recognizer
titleSuffix: Azure Applied AI Services
description: A tutorial outlining how to use Form Recognizer with Logic Apps.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: tutorial
ms.date: 08/22/2022
ms.author: bemabonsu
monikerRange: 'form-recog-2.1.0'
recommendations: false
#Customer intent: As a form-processing software developer, I want to learn how to use the Form Recognizer service with Logic Apps.
---

# Tutorial: Use Azure Logic Apps with Form Recognizer

**This article applies to:** ![Form Recognizer v2.1 checkmark](media/yes-icon.png) **Form Recognizer v2.1**.

> [!IMPORTANT]
>
> This tutorial and the Logic App Form Recognizer connector targets Form Recognizer REST API v2.1 and must be used in conjuction with the [FOTT Sample Labeling tool](https://fott-2-1.azurewebsites.net/).

Azure Logic Apps is a cloud-based platform that can be used to automate workflows without writing a single line of code. The platform enables you to easily integrate Microsoft and third-party applications with your apps, data, services, and systems. A Logic App is the Azure resource you create when you want to develop a workflow. Here are a few examples of what you can do with a Logic App:

* Create business processes and workflows visually.
* Integrate workflows with software as a service (SaaS) and enterprise applications.
* Automate enterprise application integration (EAI), business-to-business(B2B), and electronic data interchange (EDI) tasks.

For more information, *see* [Logic Apps Overview](../../logic-apps/logic-apps-overview.md).

 In this tutorial, you'll learn how to build a Logic App connector flow to automate the following tasks:

> [!div class="checklist"]
>
> * Detect when an invoice as been added to a OneDrive folder.
> * Process the invoice using the Form Recognizer prebuilt-invoice model.
> * Send the extracted information from the invoice to a pre-specified email address.

## Prerequisites

To complete this tutorial, you'll need the following resources:

* **An Azure subscription**. You can [create a free Azure subscription](https://azure.microsoft.com/free/cognitive-services/)

* **A Form Recognizer resource**.  Once you have your Azure subscription, [create a Form Recognizer resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal to get your key and endpoint. If you have an existing Form Recognizer resource, navigate directly to your resource page. You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

  1. After the resource deploys, select **Go to resource**.

  1. Copy the **Keys and Endpoint** values from your resource in the Azure portal and paste them in a convenient location, such as *Microsoft Notepad*. You'll need the key and endpoint values to connect your application to the Form Recognizer API.

    :::image border="true" type="content" source="media/containers/keys-and-endpoint.png" alt-text="Still photo showing how to access resource key and endpoint URL.":::

    > [!TIP]
    > For more information, *see* [**create a Form Recognizer resource**](create-a-form-recognizer-resource.md).

* A free [**OneDrive**](https://onedrive.live.com/signup) or [**OneDrive for Business**](https://www.microsoft.com/microsoft-365/onedrive/onedrive-for-business) cloud storage account.

    > [!NOTE]
    >
    > * OneDrive is intended for personal storage.
    > * OneDrive for Business is part of Office 365 and is designed for organizations. It provides cloud storage where you can store, share, and sync all work files.
    >

* A free [**Outlook online**](https://signup.live.com/signup.aspx?lic=1&mkt=en-ca) or [**Office 365**](https://www.microsoft.com/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook) email account**.

* **A sample invoice to test your Logic App**. You can download and use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/invoice-logic-apps-tutorial.pdf) for this tutorial.

## Create a OneDrive folder

Before we jump into creating the Logic App, we have to set up a OneDrive folder.

1. Go to your [OneDrive](https://onedrive.live.com/) or [OneDrive for Business](https://www.microsoft.com/microsoft-365/onedrive/onedrive-for-business) home page.

1. Select the **➕ New** drop-down menu in the upper-left corner and select **Folder**.

1. Enter a name for your new folder and select **Create**.

1. You should see the new folder in your files. For now, we're done with OneDrive, but you'll need to access this folder later.

:::image border="true" type="content" source="media/logic-apps-tutorial/onedrive-setup.gif" alt-text="GIF showing steps to create a folder in OneDrive.":::

## Create a Logic App resource

At this point, you should have a Form Recognizer resource and a OneDrive folder all set. Now, it's time to create a Logic App resource.

1. Select **Create a resource** from the Azure home page.

1. Search for and choose **Logic App** from the search bar.

1. Select the create button

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-five.gif" alt-text="GIF showing how to create a Logic App resource.":::

1. Next, you're going to fill out the **Create Logic App** fields with the following values:

   * **Subscription**. Select your current subscription.
   * **Resource group**. The [Azure resource group](/azure/cloud-adoption-framework/govern/resource-consistency/resource-access-management#what-is-an-azure-resource-group) that will contain your resource. Choose the same resource group you have for your Form Recognizer resource.
   * **Type**. Select **Consumption**. The Consumption resource type runs in global, multi-tenant Azure Logic Apps and uses the [Consumption billing model](../../logic-apps/logic-apps-pricing.md#consumption-pricing).
   * **Logic App name**. Enter a name for your resource. We recommend using a descriptive name, for example *YourNameLogicApp*.
   * **Region**. Select your local region.
   * **Enable log analytics**. For this project, select **No**.

1. When you're done, you should have something similar to the image below (Resource group, Logic App name, and Region may be different). After checking these values, select **Review + create** in the bottom-left corner.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-six.png" alt-text="Image showing correct values to create a Logic App resource.":::

1. A short validation check should run. After it completes successfully, select **Create** in the bottom-left corner.

1. You'll be redirected to a screen that says **Deployment in progress**. Give Azure some time to deploy; it can take a few minutes. After the deployment is complete, you should see a banner that says, **Your deployment is complete**. When you reach this screen, select **Go to resource**.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-seven.gif" alt-text="GIF showing how to get to newly created Logic App resource.":::

1. You'll be redirected to the **Logic Apps Designer** page. There's a short video for a quick introduction to Logic Apps available on the home screen. When you're ready to begin designing your Logic App, select the **Blank Logic App** button.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-eight.png" alt-text="Image showing how to enter the Logic App Designer.":::

1. You should see a screen that looks like the one below. Now, you're ready to start designing and implementing your Logic App.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-nine.png" alt-text="Image of the Logic App Designer.":::

## Create automation flow

Now that you have the Logic App connector resource set up and configured, the only thing left is to create the automation flow and test it out!

1. Search for and select **OneDrive** or **OneDrive for Business** in the search bar.

1. Select the **When a file is created** trigger.

1. You'll see a OneDrive pop-up window and be prompted to log into your OneDrive account. Select **Sign in** and follow the prompts to connect your account.

    > [!TIP]
    > If you try to sign into the OneDrive connector using an Office 365 account, you may receive the following error: ***Sorry, we can't sign you in here with your @MICROSOFT.COM account.***
    >
     > * This error happens because OneDrive is a cloud-based storage for personal use that can be accessed with an Outlook.com or Microsoft Live account not with Office 365 account.
    > * You can use the OneDrive for Business connector if you want to use an Office 365 account. Make sure that you have [created a OneDrive Folder](#create-a-onedrive-folder) for this project in your OneDrive for Business account.

1. After your account is connected, select the folder you created earlier in your OneDrive or OneDrive for Business account. Leave the other default values in place. Your window should look similar to the one below.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-ten.gif" alt-text="GIF showing how to add the first node to workflow.":::

1. Next, we're going to add a new step to the workflow. Select the plus button underneath the newly created OneDrive node.

1. A new node should be added to the Logic App designer view. Search for "Form Recognizer" in the search bar and select **Analyze invoice** from the list.

1. Now, you should see a window where you'll create your connection. Specifically, you're going to connect your Form Recognizer resource to the Logic Apps Designer Studio:

    * Enter a **Connection name**. It should be something easy to remember.
    * Enter the Form Recognizer resource **Endpoint URL** and **Account Key** that you copied previously. If you skipped this step earlier or lost the strings, you can navigate back to your Form Recognizer resource and copy them again. When you're done, select **Create**.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-eleven.gif" alt-text="GIF showing how to add second node to workflow.":::

1. You should see the parameters tab for the **Analyze Invoice** connector.

1. Select the **Document/Image File Content** field. A dynamic content pop-up should appear. If it doesn't, select the **Add dynamic content** button below the field.

1. Select **File content** from the pop-up list. This step is essentially sending the file(s) to be analyzed to the Form recognizer prebuilt-invoice model. Once you see the **File content** badge show in the **Document /Image file content** field, you've completed this step correctly.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-twelve.gif" alt-text="GIF showing how to add dynamic content to second node.":::

1. We need to add the last step. Once again, select the **➕ New step** button to add another action.

1. In the search bar, enter *Outlook* and select **Outlook.com** (personal) or **Office 365 Outlook** (work).

1. In the actions bar, scroll down until you find **Send an email (V2)** and select this action.

1. Just like with OneDrive, you'll be asked to sign into your Outlook or Office 365 Outlook account. After you sign in, you should see a window like the one pictured below. In this window, we're going to format the email to be sent with the dynamic content that Form Recognizer will extract from the invoice.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-thirteen.gif" alt-text="GIF showing how to add final step to workflow.":::

1. We're almost done! Make the following changes to the following fields:

    * **To**. Enter your personal or business email address or any other email address you have access to.

    * **Subject**. Enter ***Invoice received from:*** and then append dynamic content **Vendor name field Vendor name**.

    * **Body**. We're going to add specific information about the invoice:

      1. Type ***Invoice ID:*** and append the dynamic content **Invoice ID field Invoice ID**.

      1. On a new line type ***Invoice due date:*** and append the dynamic content **Invoice date field invoice date (date)**.

      1. Type ***Amount due:*** and append the dynamic content **Amount due field Amount due (number)**.

      1. Lastly, because the amount due is an important number we also want to send the confidence score for this extraction in the email. To do this type ***Amount due (confidence):***  and add the dynamic content **Amount due field confidence of amount due**. When you're done, the window should look similar to the screen below.

      :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-fifteen.png" alt-text="Image of completed Outlook node.":::

1. **Select Save in the upper left corner**.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-sixteen.png" alt-text="Image of completed connector flow.":::

> [!NOTE]
>
> * The Logic App designer will automatically add a "for each loop" around the send email action. This is normal due to output format that may return more than one invoice from PDFs in the future.
> * The current version only returns a single invoice per PDF.

## Test automation flow

Let's quickly review what we've done before we test our flow:

> [!div class="checklist"]
>
> * We created a trigger—in this case scenario, the trigger is when a file is created in a pre-specified folder in our OneDrive account.
> * We added a Form Recognizer action to our flow—in this scenario we decided to use the invoice API to automatically analyze the invoices from the OneDrive folder.
> * We added an Outlook.com action to our flow—for this scenario we sent some of the analyzed invoice data to a pre-determined email address.

Now that we've created the flow, the last thing to do is to test it and make sure that we're getting the expected behavior.

1. Now, to test the Logic App first open a new tab and navigate to the OneDrive folder you set up at the beginning of this tutorial. Add this file to the OneDrive folder [Sample invoice.](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/invoice-logic-apps-tutorial.pdf)

1. Return to the Logic App designer tab and select the **Run trigger** button and select **Run** from the drop-down menu.

1. You should see a sample run of your Logic App run if all the steps have green check marks it means the run was successful.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-seventeen.gif" alt-text="GIF of sample run of Logic App.":::

1. Check your email and you should see a new email with the information we pre-specified.

1. Be sure to [disable or delete](../../logic-apps/manage-logic-apps-with-azure-portal.md#disable-or-enable-a-single-logic-app) your logic App after you're done so usage stops.

Congratulations! You've officially completed this tutorial.

## Next steps

> [!div class="nextstepaction"]
> [Use the invoice processing prebuilt model in Power Automate](/ai-builder/flow-invoice-processing?toc=/azure/applied-ai-services/form-recognizer/toc.json&bc=/azure/applied-ai-services/form-recognizer/breadcrumb/toc.json)
