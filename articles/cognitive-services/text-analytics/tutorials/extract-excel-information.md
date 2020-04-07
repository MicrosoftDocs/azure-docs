---
title: Extract information in Excel using Text Analytics and Power Automate 
titleSuffix: Azure Cognitive Services
description: Learn how to Extract Excel text without having to write code, using Text Analytics and Power Automate.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: article
ms.date: 02/27/2019
ms.author: aahi
---

# Extract information in Excel using Text Analytics and Power Automate 

In this tutorial, you'll create a Power Automate flow to extract text in an Excel spreadsheet without having to write code. 

This flow will take a spreadsheet of issues reported about an apartment complex, and classify them into two categories: plumbing and other. It will also extract the names and phone numbers of the tenants who sent them. Lastly, the flow will append this information to the Excel sheet. 

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Use Power Automate to create a flow
> * Upload Excel data from OneDrive for Business
> * Extract text from Excel, and send it to the Text Analytics API 
> * Use the information from the API to update an Excel sheet.

## Prerequisites

- A Microsoft Azure account. [Start a free trial](https://azure.microsoft.com/free/) or [sign in](https://portal.azure.com/).
- A Text Analytics resource. If you don't have one, you can [create one in the Azure portal](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) and use the free tier to complete this tutorial.
- The [key and endpoint](../../cognitive-services-apis-create-account.md#get-the-keys-for-your-resource) that was generated for you during sign-up.
- A spreadsheet containing tenant issues. Example data is provided on GitHub
- Office 365, with OneDrive for Business.

## Add the Excel file to OneDrive for Business

Download the example Excel file from [GitHub](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/TextAnalytics/sample-data/ReportedIssues.xlsx). This file must be stored in your OneDrive for Business account.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/example-data.png" alt-text="Examples from the Excel file.":::

The issues are reported in raw text. We will use the Text Analytics API's Named Entity Recognition to extract the person name and phone number. Then the flow will look for the word “plumbing” in the description to categorize the issues. 

## Create a new Power Automate workflow

Go to the [Power Automate site](https://preview.flow.microsoft.com/), and login. Then click **Create** and **Scheduled flow**.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/flow-creation.png" alt-text="The flow creation screen.":::


On the **Build a scheduled flow** page, initialize your flow with the following fields:

|Field |Value  |
|---------|---------|
|**Flow name**     | **Scheduled Review** or another name.         |
|**Starting**     |  Enter the current date and time.       |
|**Repeat every**     | **1 hour**        |

## Add variables to the flow

> [!NOTE]
> If you want to see an image of the completed flow, you can download it from [GitHub](https://github.com/Azure-Samples/cognitive-services-sample-data-files/tree/master/TextAnalytics/flow-diagrams). 

Create variables representing the information that will be added to the Excel file. Click **New Step** and search for **Initialize variable**. Do this four times, to create four variables.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/initialize-variables.png" alt-text="Initialize variables.":::

Add the following information to the variables you created. They represent the columns of the Excel file. If any variables are collapsed, you can click on them to expand them.

| Action |Name   | Type | Value |
|---------|---------|---|---|
| Initialize variable | var_person | String | Person |
| Initialize variable 2 | var_phone | String | Phone_Number |
| Initialize variable 3 | var_plumbing | String | plumbing |
| Initialize variable 4 | var_other | String | other | 

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/flow-variables.png" alt-text="information contained in the flow variables":::

## Read the excel file

Click **New Step** and type **Excel**, then select **List rows present in a table** from the list of actions.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/list-excel-rows.png" alt-text="add excel rows.":::

Add the Excel file to the flow by filling in the fields in this action. This tutorial requires the file to have been uploaded to OneDrive for Business.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/list-excel-rows-options.png" alt-text="add excel rows.":::

Click **New Step** and add an **Apply to each** action.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/add-apply-action.png" alt-text="add an apply command.":::

Click on **Select an output from previous step**. In the Dynamic content box that appears, select **value**.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/select-output.png" alt-text="Select output from the excel file.":::

## Send a request to the Text Analytics API

If you haven’t already, you need to create a [Text Analytics resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) in the Azure portal.

### Create a Text Analytics connection

In the **Apply to each**, click **Add an action**. Go to your Text Analytics resource's **key and endpoint** page in the Azure portal, and get the key and endpoint for your Text Analytics resource.

In your flow, enter the following information to create a new Text Analytics connection.

> [!NOTE]
> If you already have created a Text Analytics connection and want to change your connection details, Click on the ellipsis on the top right corner, and click **+ Add new connection**.

| Field           | Value                                                                                                             |
|-----------------|-------------------------------------------------------------------------------------------------------------------|
| Connection Name | A name for the connection to your Text Analytics resource. For example, `TAforPowerAutomate`. |
| Account key     | The key for your Text Analytics resource.                                                                                   |
| Site URL        | The endpoint for your Text Analytics resource.                                                       |

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/add-credentials.png" alt-text="Add Text Analytics credentials to your flow.":::

## Extract the excel content 

After the connection is created, search for **Text Analytics** and select **Entities**. This will extract information from the description column of the issue.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/extract-info.png" alt-text="Add Text Analytics credentials to your flow.":::

Click in the **Text** field and select **Description** from the Dynamic content windows that appears. Enter `en` for Language. (Click Show advanced options if you don’t see Language)

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/description-from-dynamic-content.png" alt-text="Add Text Analytics credentials to your flow.":::


## Extract the person name

Next, we will find the person entity type in the Text Analytics output. Within the **Apply to each**, click **Add an action**, and create another **Apply to each** action. Click inside the text box and select **Entities** in the Dynamic Content window that appears.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/add-apply-action-2.png" alt-text="Add Text Analytics credentials to your flow.":::

Within the newly created **Apply to each 2** action, click **Add an action**, and add a **Condition** control.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/create-condition.png" alt-text="Add Text Analytics credentials to your flow.":::

In the Condition window, click on the first text box. In the Dynamic content window, search for **Entities Type** and select it.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/choose-entities-value.png" alt-text="Add Text Analytics credentials to your flow.":::

Make sure the second box is set to **is equal to**. Then select the third box, and search for `var_person` in the Dynamic content window. 

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/choose-variable-value.png" alt-text="Add Text Analytics credentials to your flow.":::

In the **If yes** condition, type in Excel then select **Update a Row**.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/yes-column-action.png" alt-text="Add Text Analytics credentials to your flow.":::

Enter the Excel info, and update the **Key Column**, **Key Value** and **PersonName** fields. This will append the name detected by the API to the Excel sheet. 

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/yes-column-action-options.png" alt-text="Add Text Analytics credentials to your flow.":::

## Get the phone number

Minimize the **Apply to each 2** action by clicking on the name. Then add another **Apply to each** action, like before. it will be named **Apply to each 3**. Select the text box, and add **entities** as the output for this action. 

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/add-apply-action-3.png" alt-text="Add Text Analytics credentials to your flow.":::

Within **Apply to each 3**, add a **Condition** control. It will be named **Condition 2**. In the first text box, search for, and add **Entities Type** from the Dynamic content window. Be sure the center box is set to **is equal to**. Then, in the right text box, enter `var_phone`. 

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/condition-2-options.png" alt-text="Add Text Analytics credentials to your flow.":::

In the **If yes** condition, add an **Update a row** action. Then enter the information like we did above, for the phone numbers column of the Excel sheet. This will append the phone number detected by the API to the Excel sheet. 

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/condition-2-yes-column.png" alt-text="Add Text Analytics credentials to your flow.":::


## Get the plumbing issues

Minimize **Apply to each 3** by clicking on the name. Then create another **Apply to each** in the parent action. Select the text box, and add **Entities** as the output for this action from the Dynamic content window. 

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/add-apply-action-4.png" alt-text="Add Text Analytics credentials to your flow.":::


Next, the flow will check if the issue description from the Excel table row contains the word “plumbing”. If yes, it will add “plumbing” in the IssueType column. If not, we will enter “other.”

Inside the **Apply to each 4** action, add a **Condition** Control. It will be named **Condition 3**. In the first text box, search for, and add **Description** from the Excel file, using the Dynamic content window. Be sure the center box says **contains**. Then, in the right text box, find and select `var_plumbing`. 

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/condition-3-options.png" alt-text="Add Text Analytics credentials to your flow.":::


In the **If yes** condition, click **Add an action**, and select **Update a row**. Then enter the information like before. In the IssueType column, select `var_plumbing`. This will apply a "plumbing" label to the row.

In the **If no** condition, click **Add an action**, and select **Update a row**. Then enter the information like before. In the IssueType column, select `var_other`. This will apply an "other" label to the row.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/plumbing-issue-condition.png" alt-text="Add Text Analytics credentials to your flow.":::

## Test the workflow

In the top-right corner of the screen, click **Save**, then **Test**. Select  **I’ll perform the trigger action**. Click **Save & Test**, **Run flow**, then **Done**.

The Excel file will get updated in your OneDrive account. It will look like the below.

> [!div class="mx-imgBorder"] 
> :::image type="content" source="../media/tutorials/excel/updated-excel-sheet.png" alt-text="The updated excel spreadsheet.":::

## Next steps

> [!div class="nextstepaction"]
> [Explore more solutions](../text-analytics-user-scenarios.md)
