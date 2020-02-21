---
title: Extract information in Excel using Text Analytics and Power Automate 
titleSuffix: Azure Cognitive Services
description: Learn how to Extract information in Excel using Text Analytics and Power Automate without having to write code.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: article
ms.date: 02/20/2019
ms.author: aahi
---

# Extract information in Excel using Text Analytics and Power Automate 

In this tutorial, you'll create a Power Automate flow to extract text in an Excel spreadsheet without having to write code. This flow will send tenant issue descriptions to the Text Analytics API, which will extract the name, contact info and classify the issue. Lastly, the flow will append this information to the Excel sheet. 

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Use Power Automate to create a flow
> * Upload Excel data to OneDrive for business
> * Extract text from Excel, and send it to the Text Analytics API 

## Prerequisites

- A Microsoft Azure account. [Start a free trial](https://azure.microsoft.com/free/) or [sign in](https://portal.azure.com/).
- A Cognitive Services API account with the Text Analytics API. If you don't have one, you can [sign up](../../cognitive-services-apis-create-account.md) and use the free tier (see [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/) to complete this tutorial.
- The [Text Analytics key](../../cognitive-services-apis-create-account.md#get-the-keys-for-your-resource) that was generated for you during sign-up.
- Customer issues. Example data is provided on GitHub
- Office 365

## Load your text data

We have a spreadsheet of issues reported to an apartment complex management. We want to classify the issues into two categories: plumbing and other.

The issues are reported in raw text. We will use Text Analytics’ Named Entity Recognition to extract person and phone number. We will look for the word “plumbing” in the description to categorize the issues. 

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/example-data.png" alt-text="Examples from the Excel file.":::

The data is stored in an Excel table that must be uploaded to One Drive for Business.

## Create a new Power Automate workflow

Go to the Power Automate site, and login. Then click **Create** and **Scheduled flow**.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/flow-creation.png" alt-text="The flow creation screen.":::


On the **Build a scheduled flow** page, initialize your flow with the following fields:

|Field |Value  |
|---------|---------|
|**Flow name**     | **Scheduled Review** or another name.         |
|**Starting**     |  Enter the current date and time.       |
|**Repeat every**     | **1 hour**        |

## Add variables to the flow

Create variables representing the information that will be extracted from the Excel file.

Click **New Step** and search for **Initialize variable**. Do this four times, to create four variables.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/initialize-variables.png" alt-text="Initialize variables.":::

Add the following information to the variables you created. They represent the columns of the Excel file. If any variables are collapsed, you can click on them to expand them.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/flow-variables.png" alt-text="information contained in the flow variables":::

| Action |Name   | Type | Value |
|---------|---------|---|---|
| initialize variable | var_person | String | Person |
| initialize variable 2 | var_phone | String | Phone_Number |
| initialize variable 3 | var_plumbing | String | plumbing |
| initialize variable 4 | var_other | String | other | 

## Read the excel file

Click **New Step** and type **Excel**, then select **List rows present in a table** from Actions.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/list-excel-rows.png" alt-text="add excel rows.":::

Select the options to fill in the fields as below. This requires the sample Excel file to have been uploaded to One Drive for Business.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/list-excel-rows-options.png" alt-text="add excel rows.":::

Add an **Apply to each** action.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/add-an-apply.png" alt-text="add an apply command.":::

Select output from spreadsheet. Click inside the box and select value.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/select-output.png" alt-text="Select output from the excel file.":::

## Send a request to the Text Analytics API

If you haven’t already, you need to create a [Text Analytics resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) in the Azure Portal.

### Create a Text Analytics connection

You can skip this step if you have already created a Text Analytics connection. Click on the ellipsis on the top right corner, the click  + Add new connection under My Connections.

Go to the Azure Portal’s Quickstart Page, and get the following information for your Text Analytics resource (see here how to create a resource):

In your flow, enter the following information to create a new Text Analytics connection.

| Field           | Value                                                                                                             |
|-----------------|-------------------------------------------------------------------------------------------------------------------|
| Connection Name | enter the name of the Text Analytics Resource you created in the Azure Portal. For example, `TAforPowerAutomate`. |
| Account key     | Copy the value from Key1 field.                                                                                   |
| Site URL        | copy the value from Endpoint field.                                                                               |

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/add-credentials.png" alt-text="Add Text Analytics credentials to your flow.":::

## Extract the excel content 

After the connection is created, select Entities. We will now extract information from the Description of the issue.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/extract-info.png" alt-text="Add Text Analytics credentials to your flow.":::

Click in the Text field and select Description from Dynamic content on the right.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/description-from-dynamic-content.png" alt-text="Add Text Analytics credentials to your flow.":::

Enter `en` for Language. (Click Show advanced options if you don’t see Language)

## Extract the person name

Next, we will find the person entity type in the Text Analytics output. 
1. Apply to each 2. 
2. Click inside the input box to select the output and select Entities under Dynamic Content.
3. Next, click Add an action and type condition, then select Condition Control from Actions.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/get-person-name-1.png" alt-text="Add Text Analytics credentials to your flow.":::

In the Condition window, select Entities Type in the first input box.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/get-person-name-2.png" alt-text="Add Text Analytics credentials to your flow.":::

Click in the box after “is equal to” and select var_person under Variables.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/get-person-name-3.png" alt-text="Add Text Analytics credentials to your flow.":::

In the “If Yes” condition,  type in Excel then select Update a Row.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/get-person-name-4.png" alt-text="Add Text Analytics credentials to your flow.":::

Enter the Excel info. Note the Key Column and Key Value and Person Name fields.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/get-person-name-5.png" alt-text="Add Text Analytics credentials to your flow.":::

## Get the phone number

Minimize Apply to each 2 (click on the name), then click Add an action. Don’t add the action inside Apply each 2!

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/get-phone-number-1.png" alt-text="Add Text Analytics credentials to your flow.":::

* Type apply to each and create it like we did above which will name it Apply each 3. 
* Enter the Entities as the output from previous step, then add a Condition Control (Condition 2).
* This time select Entities Type to match the var_phone variable.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/get-phone-number-2.png" alt-text="Add Text Analytics credentials to your flow.":::

* Under “If yes”, add an action to update the Excel row. Then enter the information like we did above.
* This time enter set the Phone Number column to be updated.

## Get the plumbing issues

* Click on the name to minimize it then click on Add an action. Again, ensure the new action is outside Apply each 3.
* This will create Apply to each 4.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/get-plumbing-issue-1.png" alt-text="Add Text Analytics credentials to your flow.":::

* Type and select Apply to each. Click inside the input box and select Entities under Dynamic content.
* Inside Apply to each 4, click Add an action and select the Condition Control. This will create Condition 3.

Next, we are going to check if the Issue Description from the Excel table row contains the word “plumbing”. If yes, we will enter “plumbing” in the IssueType column. If not, we will enter “other.”

* Click inside the first input box and select Description from Dynamic content. Select contains in the dropdown. In the right input box, select var_plumbing. 
* In the “If yes” condition, click Add an action and select Update a row. Then enter the information like we did above. In the IssueType column, select var_plumbing.
* In the “If no” condition, click Add an action and select Update a row. Then enter the information like we did above. In the IssueType column, select var_other.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/get-plumbing-issue-2.png" alt-text="Add Text Analytics credentials to your flow.":::

## Test the workflow

* In the top right corner of the screen, click Test. Select  “I’ll perform the trigger action”. Then Save & Test. Click Run flow. Then click Done.
The Excel file gets updated as below.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/updated-excel-sheet.png" alt-text="The updated excel spreadsheet.":::
