---
title: Form Recognizer with Logic Apps
titleSuffix: Azure Applied AI Services
description: A tutorial outlining how to use Form Recognizer with Logic Apps.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: tutorial
ms.date: 12/23/2021
ms.author: bemabonsu
recommendations: false
#Customer intent: As a form-processing software developer, I want to learn how to use the Form Recognizer service with Logic Apps.
---

# Form Recognizer with Logic Apps Tutorial

## Introduction to Logic Apps

Azure logic apps are a tool that can be used to automate workflows without writing a single line of code. Azure logic apps are easily integrated with Microsoft applications along with third-party applications. The following are the benefits of the Azure Logic Apps system:

* The ability to create business process and workflows visually.
* The ability to integrate workflows with SaaS and enterprise applications.
* The ability to automate Enterprise Application Integration (EAI), business-to-business(B2B), and Electronic Data Interchange (EDI) business processes.

*See* [Logic Apps](https://docs.microsoft.com/azure/logic-apps/) for more info.

## Tutorial

In this tutorial, you'll learn to make a Logic app connector flow that detects when an invoice is added to a OneDrive folder, processes the invoice, and sends information contained in the invoice to a pre-specified email.

### Prerequisites

To complete this quick start, you're going to need:

* An Azure subscription - Create one for free here: [Create an Azure subscription](https://azure.microsoft.com/free/cognitive-services/)
* A OneDrive account - Create one for free here: [Create a One drive account](https://onedrive.live.com/signup)
* An Outlook online email account - Create one for free here: [Create an outlook online email account](https://signup.live.com/signup.aspx?lic=1&mkt=en-ca)
* A sample invoice to test your Azure logic app - Download a sample [here]( https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/invoice-logic-apps-tutorial.pdf)

### Setting up One-Drive

Before we jump into creating the Logic app, we to have to set up a OneDrive folder.

1. Go to your OneDrive home page - [OneDrive home page](https://onedrive.live.com/)

1. Select "+New" in the upper left corner and select Folder.

1. Enter a name for your new folder and select create.

4.You should see the new folder in your files. For now, we're done with OneDrive. Open a new tab you'll need to access this folder later.

:::image border="true" type="content" source="media/logic-apps-tutorial/onedrive-setup.gif" alt-text="Gif showing how steps to create a folder in OneDrive":::

### Create a Form Recognizer resource

Now we're going to create a Form recognizer resource in the Azure portal. If you already have a Form recognizer resource, you can skip this section.

1. Navigate to the Azure portal home page - [Azure home page](https://ms.portal.azure.com/#home)

1. First, select create a resource from the Azure home page.

1. Search "Form Recognizer" in the search bar and select the Form Recognizer Tile

1. Select the Create button.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-one.gif" alt-text="Gif showing how to create a Form Recognizer resource.":::

1. Now you're going to fill out the "Create Form Recognizer" fields with the following values:

* For the "Subscription" box, select your current subscription.
* For the "Resource group", select the resource group that you created earlier from the drop-down.
* For "Region", select your local region.
* For "Name", you can enter any name that is descriptive such as "FR-Resource".
* For "Pricing tier", you can select the free tier for this tutorial.

1. Once you're done you should see something similar to the screenshot below(your Subscription, resource group, region, and name may be different). Select "Review + Create".

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-two.gif" alt-text="Still image showing the correct values for creating Form Recognizer resource.":::

1. Azure will run a quick validation check, after a few seconds you should see a green banner that says "Validation Passed". After you see this banner, select "Create" in the bottom left.

1. After you select create, you should be redirected to a new page that says "Deployment in progress". After a few seconds, you should see a message that says "Your deployment is complete". Once you receive this message, select the "Go to resource" button.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-three.gif" alt-text="Gif showing the validation process of creating Form Recognizer resource.":::

1. You should see a screen like the one below. Open your favorite notes app and Copy "KEY 1" and the "Endpoint" URL into the notes app. You will need this information later. If your overview page does not have the keys and endpoint visible, you can select the keys and endpoint button on the left navigation bar and get them from there. Now you have a Form Recognizer resource we will make a logic app resource

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-four.gif" alt-text="Still photo showing how to access resource key and endpoint URL":::

### Creating a Logic App resource

Now that you have the Form Recognizer resource set up it is time to create an Azure Logic App resource.

1. First select create a resource from the Azure home page.

1. Search "Logic App" in the search bar and select the Logic App tile.

1. Select the create button

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-five.gif" alt-text="GIF showing how to create a Logic App resource.":::

1. On the basics page:

    * Select your Subscription from the dropdown box.
    * Select the same resource group you used earlier in the tutorial for your Form Recognizer resource.
    * For "Type" select consumption.
    * Enter a name for your Logic App.
    * For "Region" select your local region

1. When you're done, you should have something similar to the image below (note: Resource group, Logic App name, and Region may be different.) After checking these values, select "Review and create" in the bottom left.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-six.gif" alt-text="Image showing correct values to create a Logic App resource.":::

1. A short validation should run after it completes select "Create" in the bottom left/

1. You will be redirected to a screen that says "Deployment in progress" give Azure some time to deploy; it can take a couple minutes. After the deployment is complete you should see a banner that says, "Your deployment is complete". When you reach this screen, select "Go to resource".

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-seven.gif" alt-text="GIF showing how to get to newly created Logic App resource.":::

1. You should be redirected to the Logic Apps Designer. There is a short video for a quick introduction to Logic Apps available on the home screen. When you're ready to begin designing the Logic App, select the "Blank Logic App" button.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-eight.gif" alt-text="Image showing how to enter the Logic App designer":::

1. Now you should see a screen that looks like the one below. Now you're ready to start designing and Implementing your Logic App.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-nine.gif" alt-text="Image of the Logic App Designer":::

### Creating automation flow

Now that you have the Logic App connector resource set up and configured, the only thing left to do is to create the automation flow and test it out!

1. Search "OneDrive" in the search bar and select the "when a file is created" trigger.

1. You should see a OneDrive node pop-up onto the Logic App designer. You should be prompted to log into your OneDrive account. Select the link and a pop-up should appear. Follow the prompts to connect your account.

1. After your account is connected, select the folder you created earlier in your OneDrive. Leave the other values to their defaults. Your window should look similar to the one below. (Note you folder name may vary from the example showN.)

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-ten.gif" alt-text="GIF showing how to add the first node to workflow.":::

1. Now we're going to add another step to the workflow. Select the plus button underneath the newly created OneDrive node.

1. A new node should have been added to the Logic App designer view. Search "Form recognizer" in the search bar and select "Analyze invoice (preview)" from the list.

1. Now you should see a window that says, "Create connection". What we're going to do here is connect your Form Recognizer resource to the Logic Apps Designer Studio. First Choose a connection name. It should be something easily recognizable. Then for "Endpoint URL" and "Account Key" use the endpoint and key you copied into your note pad from earlier. If you skipped this step earlier or lost the codes, you can navigate back to your Form Recognizer resource and copy them again.  Your screen should look something like the screenshot below. When you're done select "Create".

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-eleven.gif" alt-text="GIF showing how to add second node to workflow.":::

1. Now you should see the parameters tab for the analyze invoice connector. Select the "Document/Image File field. A dynamic content pop-up should appear if it does not select the add dynamic content button below the field. select "File content" from the pop-up list. This is essentially sending the file(s) that were created to be analyzed by the Form recognizer invoice prebuilt. Once you see the "File content" badge show up in the "Document /Image file content", you have done this correctly.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-twelve.gif" alt-text="GIF showing how to add dynamic content to second node.":::

1. Now we need to add the last step. Once again, select the "+" button and add another action.

1. In the search bar search "Outlook.com" in the actions bar scroll down until you see "send an email" select this action.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-thirteen.gif" alt-text="GIF showing how to add final step to workflow.":::

1. Just like with OneDrive you'll be asked to sign into your outlook.com account after you sign in you should see a window like the one below. In this window, we're going to format the email to be sent with the dynamic content we have gotten from Form Recognizer.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-fourteen.gif" alt-text="Image of Outlook node not filled in.":::

1. We're almost done! Make the following changes to the following fields:

    * For the "To" field, enter your personal email address or any other email address you have access to.
    * For the subject line: Enter "Invoice Received from: " and then append dynamic content "vendor name field vendor name". Note: when you do this the Logic App designer will automatically add a "for each loop" around the send email action this is normal. This is due to output format that may return more than one invoice from PDFs in the future. The Current version only returns a single invoice per pdf.
    * For the body field, we're going to add some other information about the invoice.
    * Type "Invoice ID:" and append the dynamic content "Invoice ID field Invoice ID".
    * On a new line type "Invoice Due date:" and append "Invoice date field invoice date (date)".
    * Type "Amount due:" and append "amount due field amount due (number)".
    * Lastly, because the amount due is an important number we also want to send the confidence score for this extraction in the email to do this add the dynamic content "Amount due field confidence of amount due". When you're done, the window should look similar to the screen below.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-fifteen.gif" alt-text="Image of Outlook node filled in":::

1. The logic app designer view should look something like this. Congratulations you're done! Select save in the upper left corner

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-sixteen.gif" alt-text="Image of finished connector flow.":::

### Testing automation flow

Let's quickly review what we have done before we test our flow.

1. We created a trigger – In this case scenario, the trigger is when a file is created in a pre-specified folder in our OneDrive.
1. We added a Form Recognizer action to our flow – In this scenario we decided to use the invoice API to automatically analyze the invoices from the OneDrive folder.
1. We added a Outlook.com action to our flow – for this scenario we sent some of the analyzed invoice data to a pre-determined email address.

Now that we have created the flow the last thing to do is to test it and make sure we're getting the expected behavior.

1. Now to test the logic app first open a new tab and navigate to the OneDrive folder you set up at the beginning of this tutorial. Now add this file to the OneDrive folder [Sample invoice.]( https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/invoice-logic-apps-tutorial.pdf)

1. Return to the Logic App designer tab and select the "Run trigger" button in the menu bar.

1. You should see a sample run of your Logic App run if all the steps have green check marks it means the run was successful.

    :::image border="true" type="content" source="media/logic-apps-tutorial/logic-app-connector-demo-seventeen.gif" alt-text="GIF of sample run of Logic App.":::

1. Check your email and you should see a new email with the information we pre-specified. Congratulations! You have officially completed the tutorial. Be sure to pause or delete the Logic App after you're done so usage stops.
