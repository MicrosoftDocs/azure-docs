---
title: "Tutorial: Create a document scanner app with AI Builder - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: In this tutorial
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: tutorial
ms.date: 06/24/2020
ms.author: pafarley
---

# Tutorial: Create a document scanner app with AI Builder

[AI Builder](https://docs.microsoft.com/en-us/ai-builder/overview) is a Power Platform capability that allows you to easily automate processes and predict outcomes to help improve business performance. AI Builder is a turnkey solution that brings the power of AI through a point-and-click experience. Using AI Builder, you can add intelligence to your apps even if you have no coding or data science skills.

> [!IMPORTANT]
> - Some features in AI Builder have not yet released for general availability (GA), and remain in preview status. See the **Release status** section for more information.
> - [!INCLUDE[cc_preview_features_definition](./includes/cc-preview-features-definition.md)]
> - Administrators can control preview feature availability for their environment using the Power Platform Admin center. More information: [Enable or disable AI Builder feature](administer.md#enable-or-disable-ai-builder-preview-features)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * All tutorials include a list summarizing the steps to completion
> * Each of these bullet points align to a key H2
> * Use these green checkboxes in a tutorial

If you don't have a Form Recognizer subscription, create a free trial account...

## Prerequisites

- First prerequisite
- Second prerequisite
- Third prerequisite


## Optimization tips

- When you create a new form processing model, upload documents with the same layout where each document is a separate instance. For example: invoices from the same provider, but each uploaded invoice is from a different month.
- You can optimize PDF files by using the **Print > Print to PDF** option to select certain pages within your document.

> [!NOTE]
> AI Builder does not currently support the following types of form processing input data:
>
> - Complex tables (nested tables, merged headers or cells, and so on)
> - Check boxes or radio buttons
> - PDF documents longer than 50 pages
> - Fillable PDFs 

## Sign in to <service/product/tool name>

Sign in to the [<service> portal](url).
<!---If you need to sign in to the portal to do the tutorial, this H2 and
link are required.--->

## Upload and analyze documents

You need to provide sample documents to train your model for the type of form from which you want to extract information. After you upload your documents, AI Builder analyzes them so you can tell whether you can train a model from them.

### Upload your documents

1. Sign in to [PowerApps](https://web.powerapps.com) or [Microsoft Flow](https://flow.microsoft.com) and then in the navigation pane select **AI Builder** > **Build**. Then, select the Form processing AI model type.
2. Enter a name for your model and then select **Create**. 
3. Select **Add documents**, select a minimum of five documents, and then select **Upload**.

For more information about requirements for input documents, see [Requirements and limitations](form-processing-model-requirements.md).

> [!NOTE] 
> After you upload these documents, you can still remove some of the documents or upload additional ones.

### Analyze your documents

When enough documents have been uploaded, you select **Analyze** to launch the analysis. Depending on the number of documents provided, the analysis could take longer but in most cases it should only take a few minutes.

## Review documents and extracted data

If the analysis was successful, it means AI Builder detected structured text in your form documents. If the analysis failed, it is likely because AI Builder couldn't detect structured text in your documents, review that the documents you updated follow the [requirements and optimizations tips section](https://docs.microsoft.com/ai-builder/form-processing-model-requirements).

## Select your form fields

To start, choose the fields that matter to you:

 1. Select the detected template card: **\<*Your model name*> form**.
 1. To select the fields, hover over a rectangle that indicates a detected field in the document, or select them in the right-side pane.
 1. Select **Edit** next to the selected field if you want to rename fields to align with your needs or normalize the extracted labels.

    When you hover over a detected field, the following information appears:

    - **Field name**: The name of the label for the detected field.
    - **Field value**: The value for the detected field.
    - **Confidence level**: Confidence score of retrieving this field compared to the trained model.

## Train and validate your model

1. Select **Next** to check your selected form fields. If everything looks good, select **Train** to train your model.
1. When training completes,  select **Go to Details page** in the **Training complete** screen.

## Quick-test your model

The Details page allows you to test your model before you publish or use it:

1. On the Details page, select **Quick test**.
2. You can either drag and drop a document, or select **Upload from my device** to upload your test file. The quick-test should only take a few seconds before displaying the results.
3. You can select **Start over** to run another test or **Close** if you are finished.

## Troubleshooting tips

If you have trouble training your model, try the following:

- Optimize your data using the guidance in the [Requirements](form-processing-model-requirements.md) topic.
- Delete and recreate the model.
- Download and test with [sample material](https://go.microsoft.com/fwlink/?linkid=2103171).

## Publish your model

If you're happy with your model, you can select **Publish**  to publish it. When publishing completes, your model is promoted as **Published** and is ready to be used. For more information about publishing your model, go to [Publish your model](publish-model.md) section.

After you've published your form processing model, you can use it in a [PowerApps canvas app](/ai-builder/form-processor-component-in-powerapps) or in [Microsoft Flow](/ai-builder/form-processing-model-in-flow).

## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete

<!---Required:
To avoid any costs associated with following the tutorial procedure, a
Clean up resources (H2) should come just before Next steps (H2)
--->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

<!--- Required:
Tutorials should always have a Next steps H2 that points to the next
logical tutorial in a series, or, if there are no other tutorials, to
some other cool thing the customer can do. A single link in the blue box
format should direct the customer to the next article - and you can
shorten the title in the boxes if the original one doesn't fit.
Do not use a "More info section" or a "Resources section" or a "See also
section". --->