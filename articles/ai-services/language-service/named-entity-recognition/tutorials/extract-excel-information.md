---
title: Extract information in Excel using Power Automate
titleSuffix: Azure AI services
description: Learn how to Extract Excel text without having to write code, using Named Entity Recognition and Power Automate.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jboback
ms.custom: language-service-ner, ignite-fall-2021, cogserv-non-critical-language
---

# Extract information in Excel using Named Entity Recognition(NER) and Power Automate 

In this tutorial, you'll create a Power Automate flow to extract text in an Excel spreadsheet without having to write code. 

This flow will take a spreadsheet of issues reported about an apartment complex, and classify them into two categories: plumbing and other. It will also extract the names and phone numbers of the tenants who sent them. Lastly, the flow will append this information to the Excel sheet. 

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Use Power Automate to create a flow
> * Upload Excel data from OneDrive for Business
> * Extract text from Excel, and send it for Named Entity Recognition(NER) 
> * Use the information from the API to update an Excel sheet.

## Prerequisites

- A Microsoft Azure account. [Create a free account](https://azure.microsoft.com/free/cognitive-services/) or [sign in](https://portal.azure.com/).
- A Language resource. If you don't have one, you can [create one in the Azure portal](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) and use the free tier to complete this tutorial.
- The [key and endpoint](../../../multi-service-resource.md?pivots=azportal#get-the-keys-for-your-resource) that was generated for you during sign-up.
- A spreadsheet containing tenant issues. Example data for this tutorial is [available on GitHub](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/TextAnalytics/sample-data/ReportedIssues.xlsx).
- Microsoft 365, with [OneDrive for business](https://www.microsoft.com/microsoft-365/onedrive/onedrive-for-business).

## Add the Excel file to OneDrive for Business

Download the example Excel file from [GitHub](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/TextAnalytics/sample-data/ReportedIssues.xlsx). This file must be stored in your OneDrive for Business account.

:::image type="content" source="../media/tutorials/excel/example-data.png" alt-text="Examples from the Excel file" lightbox="../media/tutorials/excel/example-data.png":::

The issues are reported in raw text. We will use the NER feature to extract the person name and phone number. Then the flow will look for the word "plumbing" in the description to categorize the issues. 

## Create a new Power Automate workflow

Go to the [Power Automate site](https://make.powerautomate.com/), and log in. Then select **Create** and **Scheduled flow**.

:::image type="content" source="../media/tutorials/excel/flow-creation.png" alt-text="The workflow creation screen" lightbox="../media/tutorials/excel/flow-creation.png":::

On the **Build a scheduled cloud flow** page, initialize your flow with the following fields:

|Field |Value  |
|---------|---------|
|**Flow name**     | **Scheduled Review** or another name.         |
|**Starting**     |  Enter the current date and time.       |
|**Repeat every**     | **1 hour**        |

## Add variables to the flow

Create variables representing the information that will be added to the Excel file. Select **New Step** and search for **Initialize variable**. Do this four times, to create four variables.

:::image type="content" source="../media/tutorials/excel/initialize-variables.png" alt-text="The step for initializing variables" lightbox="../media/tutorials/excel/initialize-variables.png":::


Add the following information to the variables you created. They represent the columns of the Excel file. If any variables are collapsed, you can select them to expand them.

| Action |Name   | Type | Value |
|---------|---------|---|---|
| Initialize variable | var_person | String | Person |
| Initialize variable 2 | var_phone | String | Phone Number |
| Initialize variable 3 | var_plumbing | String | plumbing |
| Initialize variable 4 | var_other | String | other | 

:::image type="content" source="../media/tutorials/excel/flow-variables.png" alt-text="information contained in the flow variables" lightbox="../media/tutorials/excel/flow-variables.png":::

## Read the excel file

Select **New Step** and type **Excel**, then select **List rows present in a table** from the list of actions.

:::image type="content" source="../media/tutorials/excel/list-excel-rows.png" alt-text="Add excel rows into the flow" lightbox="../media/tutorials/excel/list-excel-rows.png":::

Add the Excel file to the flow by filling in the fields in this action. This tutorial requires the file to have been uploaded to OneDrive for Business.

:::image type="content" source="../media/tutorials/excel/list-excel-rows-options.png" alt-text="Fill the excel rows in the flow" lightbox="../media/tutorials/excel/list-excel-rows-options.png":::

Select **New Step** and add an **Apply to each** action.

:::image type="content" source="../media/tutorials/excel/add-apply-action.png" alt-text="Add an apply to each action" lightbox="../media/tutorials/excel/add-apply-action.png":::

Select **Select an output from previous step**. In the Dynamic content box that appears, select **value**.

:::image type="content" source="../media/tutorials/excel/select-output.png" alt-text="select output from the excel file" lightbox="../media/tutorials/excel/select-output.png":::

## Send a request for entity recognition

If you haven't already, you need to create a [Language resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) in the Azure portal.

### Create a Language service connection

In the **Apply to each**, select **Add an action**. Go to your Language resource's **key and endpoint** page in the Azure portal, and get the key and endpoint for your Language resource.

In your flow, enter the following information to create a new Language connection.

> [!NOTE]
> If you already have created a Language connection and want to change your connection details, Select the ellipsis on the top right corner, and select **+ Add new connection**.

| Field           | Value                                                                                                             |
|-----------------|-------------------------------------------------------------------------------------------------------------------|
| Connection Name | A name for the connection to your Language resource. For example, `TAforPowerAutomate`. |
| Account key     | The key for your Language resource.                                                                                   |
| Site URL        | The endpoint for your Language resource.                                                       |

:::image type="content" source="../media/tutorials/excel/add-credentials.png" alt-text="Add Language resource credentials to the flow" lightbox="../media/tutorials/excel/add-credentials.png":::


## Extract the excel content 

After the connection is created, search for **Text Analytics** and select **Named Entity Recognition**. This will extract information from the description column of the issue.

:::image type="content" source="../media/tutorials/excel/extract-info.png" alt-text="Extract the entities from the Excel sheet" lightbox="../media/tutorials/excel/extract-info.png":::

Select in the **Text** field and select **Description** from the Dynamic content windows that appears. Enter `en` for Language, and a unique name as  the document ID (you might need to select **Show advanced options**).

:::image type="content" source="../media/tutorials/excel/description-from-dynamic-content.png" alt-text="Get the description column text from the Excel sheet" lightbox="../media/tutorials/excel/description-from-dynamic-content.png":::


Within the **Apply to each**, select **Add an action** and create another **Apply to each** action. Select inside the text box and select **documents** in the Dynamic Content window that appears.

:::image type="content" source="../media/tutorials/excel/apply-to-each-documents.png" alt-text="Create another apply to each action." lightbox="../media/tutorials/excel/apply-to-each-documents.png":::


## Extract the person name

Next, we will find the person entity type in the NER output. Within the **Apply to each 2**, select **Add an action**, and create another **Apply to each** action. Select inside the text box and select **Entities** in the Dynamic Content window that appears.

:::image type="content" source="../media/tutorials/excel/add-apply-action-2.png" alt-text="Find the person entity in the NER output" lightbox="../media/tutorials/excel/add-apply-action-2.png":::


Within the newly created **Apply to each 3** action, select **Add an action**, and add a **Condition** control.

:::image type="content" source="../media/tutorials/excel/create-condition.png" alt-text="Add a condition control to the Apply to each 3 action" lightbox="../media/tutorials/excel/create-condition.png":::


In the Condition window, select the first text box. In the Dynamic content window, search for **Category** and select it.

:::image type="content" source="../media/tutorials/excel/choose-entities-value.png" alt-text="Add the category to the control condition" lightbox="../media/tutorials/excel/choose-entities-value.png":::


Make sure the second box is set to **is equal to**. Then select the third box, and search for `var_person` in the Dynamic content window. 

:::image type="content" source="../media/tutorials/excel/choose-variable-value.png" alt-text="Add the person variable" lightbox="../media/tutorials/excel/choose-variable-value.png":::


In the **If yes** condition, type in Excel then select **Update a Row**.

:::image type="content" source="../media/tutorials/excel/yes-column-action.png" alt-text="Update the yes condition" lightbox="../media/tutorials/excel/yes-column-action.png":::

Enter the Excel information, and update the **Key Column**, **Key Value** and **PersonName** fields. This will append the name detected by the API to the Excel sheet. 

:::image type="content" source="../media/tutorials/excel/yes-column-action-options.png" alt-text="Add the excel information" lightbox="../media/tutorials/excel/yes-column-action-options.png":::

## Get the phone number

Minimize the **Apply to each 3** action by clicking on the name. Then add another **Apply to each** action to **Apply to each 2**, like before. it will be named **Apply to each 4**. Select the text box, and add **entities** as the output for this action. 

:::image type="content" source="../media/tutorials/excel/add-apply-action-phone.png" alt-text="Add the entities from the NER output to another apply to each action." lightbox="../media/tutorials/excel/add-apply-action-phone.png":::

Within **Apply to each 4**, add a **Condition** control. It will be named **Condition 2**. In the first text box, search for, and add **categories** from the Dynamic content window. Be sure the center box is set to **is equal to**. Then, in the right text box, enter `var_phone`. 

:::image type="content" source="../media/tutorials/excel/condition-2-options.png" alt-text="Add a second condition control" lightbox="../media/tutorials/excel/condition-2-options.png":::

In the **If yes** condition, add an **Update a row** action. Then enter the information like we did above, for the phone numbers column of the Excel sheet. This will append the phone number detected by the API to the Excel sheet. 

:::image type="content" source="../media/tutorials/excel/condition-2-yes-column.png" alt-text="Add the excel information to the second if yes condition" lightbox="../media/tutorials/excel/condition-2-yes-column.png":::

## Get the plumbing issues

Minimize **Apply to each 4** by clicking on the name. Then create another **Apply to each** in the parent action. Select the text box, and add **Entities** as the output for this action from the Dynamic content window. 

:::image type="content" source="../media/tutorials/excel/add-apply-action-plumbing.png" alt-text="Create another apply to each action" lightbox="../media/tutorials/excel/add-apply-action-plumbing.png":::

Next, the flow will check if the issue description from the Excel table row contains the word "plumbing". If yes, it will add "plumbing" in the IssueType column. If not, we will enter "other."

Inside the **Apply to each 4** action, add a **Condition** Control. It will be named **Condition 3**. In the first text box, search for, and add **Description** from the Excel file, using the Dynamic content window. Be sure the center box says **contains**. Then, in the right text box, find and select `var_plumbing`. 

:::image type="content" source="../media/tutorials/excel/condition-3-options.png" alt-text="Create a new condition control" lightbox="../media/tutorials/excel/condition-3-options.png":::

In the **If yes** condition, select **Add an action**, and select **Update a row**. Then enter the information like before. In the IssueType column, select `var_plumbing`. This will apply a "plumbing" label to the row.

In the **If no** condition, select **Add an action**, and select **Update a row**. Then enter the information like before. In the IssueType column, select `var_other`. This will apply an "other" label to the row.

:::image type="content" source="../media/tutorials/excel/plumbing-issue-condition.png" alt-text="Add information to both conditions" lightbox="../media/tutorials/excel/plumbing-issue-condition.png":::

## Test the workflow

In the top-right corner of the screen, select **Save**, then **Test**. Under **Test Flow**, select **manually**. Then select **Test**, and **Run flow**.

The Excel file will get updated in your OneDrive account. It will look like the below.

:::image type="content" source="../media/tutorials/excel/updated-excel-sheet.png" alt-text="Test the workflow and view the output" lightbox="../media/tutorials/excel/updated-excel-sheet.png":::

## Next steps


