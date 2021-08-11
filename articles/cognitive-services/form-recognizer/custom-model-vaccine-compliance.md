---
title: "Create a Custom Forms Model"
titleSuffix: Azure Applied AI Services
description: How to create a custom forms model using av immunization vaccine consent form.
author: jaep3347
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 07/16/2021
ms.author: t-jppark
---

# Create a custom forms model

You can create a Form Recognizer custom model to extract data from documents specific to your business needs. In this article, learn how to build your a custom model for an immunization vaccine form using training documents and labeling files generated with the Form Recognizer sample labeling tool.

In this tutorial, we will use the [sample consent form for immunization](https://www.cityofpasadena.net/district3/wp-content/uploads/sites/4/Covid-Informed-Consent-for-Inactivated-Immunization-Universal-2020-v.3.-Covid-screening-vaccine-questions.pdf).

If you have worked with Form Recognizer and used the labeling tool before, fast-track your model by downloading the following labeled training and test dataset. Otherwise, keep reading to get started with Azure and Form Recognizer.

* [Training and test dataset for sample consent form for immunization](https://microsoft-my.sharepoint.com/:u:/p/t-jppark/ET4RJvtqarNGo6O9FVpCbbIBt4NSBDoRJqI6S8o2PHUwOA?e=q8nIoy)

## Steps for Creating a Custom Model

Let's start with a brief overview of the steps you'll need with this sample to start testing your custom model.

1. [Create a Form Recognizer resource](#1-create-a-form-recognizer-resource)
1. [Download the form datasets of your choice](#2-download-the-form-datasets-of-your-choice)
1. [Upload the labeled training dataset to your Azure Blob storage account](#3-upload-the-labeled-training-dataset-to-your-azure-blob-storage-account)
1. [Connect your blob storage to the Form Recognizer sample labeling tool](#4-connect-your-blob-storage-to-the-form-recognizer-sample-labeling-tool)
1. [Create a new project and select the data connection from the previous step](#5-create-a-new-project-and-select-the-data-connection-from-the-previous-step)
1. [Understand the labels](#6-understand-the-labels)
1. [Train the model](#7-train-the-model)
1. [Test the model with the test document or your own forms of the same type](#8-test-the-model-with-the-test-document-or-your-own-forms-of-the-same-type)
1. [Next steps](#9-next-steps)

## 1. Create a Form Recognizer resource

If you already have a Form Recognizer resource and you have the endpoint and key, skip to the [section 2](#2-download-the-form-datasets-of-your-choice). You will need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart.

1. First, you must have an Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/).
2. Once you have your Azure subscription, [create a Form Recognizer resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal to get your key and endpoint.

:::image type="content" source="media/tax-forms-custom/create-fr-resource.png" alt-text="Screenshot: Azure portal create Form Recognizer resource page.":::

* Select the subscription, resource group, region, name, and pricing tier accordingly. Note that a resource group is a collection of resources that you create under a group. They share the same lifecycle, permission, and policies.
* You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

Once your Form Recognizer resource finishes deploying, you can either choose **Go to resources** in the deployment page or search for it manually by selecting **All resources** from the portal home page. If for some reason you do not see the resource you've just created, check if you've selected the right subscription or resource group as the filter. See the below screenshot for where to find the filters.

:::image type="content" source="media/tax-forms-custom/filter.png" alt-text="Screenshot: Filter section for resources.":::

### Retrieve your keys and endpoint

Once you access the Form Recognizer resource, select **Keys and Endpoint** under the **Resource Management** category in the left navigation bar. Here, you will see two keys and an endpoint URL. Copy and paste one of the two keys (it does not matter which one you choose) and the endpoint URL in a convenient location, such as *Microsoft Notepad* before going forward.

:::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: Azure portal keys and endpoint page.":::

## 2. Download the form datasets of your choice

Download the manually labeled training data set that includes the _.labels.json_ and _.ocr.json_ files that correspond to each training document. The _.labels.json_ has all the labels extracted from the document whereas the _.ocr.json_ file has all the text, tables and selection marks extracted. Also, download the corresponding test data set to test the model on your own. Although **you train one type of form per custom model**, you can assign a single model ID to combine multiple trained models and assign a single model ID. With [**Model Compose**](label-tool.md#compose-trained-models), you can create up to 100 models composed to a single model ID. The training data set resembles real-life data in that some of them are handwritten while others are scanned documents or images.

:::row:::
   :::column span="":::
      :::image type="content" source="media/custom-covid/covid_form_1.png" alt-text="Example COVID consent form":::
   :::column-end:::
   :::column span="":::
      :::image type="content" source="media/custom-covid/covid_form_2.png" alt-text="Example handwritten COVID consent form":::
   :::column-end:::
:::row-end:::

In the following sections, you upload the downloaded sample training data set to Azure blob storage and then use the uploaded training set to compose your custom models.

## 3. Upload the labeled training dataset to your Azure Blob storage account

Once you have downloaded the training and testing dataset, the next step is to upload the training files to your blob storage container in a standard-performance-tier Azure Storage account. Azure storage account provides a unique namespace for your data objects: blobs, file shares, queues, tables, and disks, that's accessible from anywhere in the world over HTTP or HTTPS. Within the storage account services, we will create a blob container, which is suitable for storing massive amounts of unstructured data.

Feel free to skip to [this section](#cors-configuration) if you have an active Azure blob storage account. If you don't have a storage account or blob container, follow the guideline below:

### Create a storage account

There are multiple ways to [create a storage account](/azure/storage/common/storage-account-create?tabs=azure-portal); in this quickstart, we'll use the Azure portal. A storage account is an Azure Resource Manager resource. Resource Manager is the deployment and management service for Azure. Every Resource Manager resource, including Azure storage account, must belong to an Azure resource group.

1. From the Azure portal home page, select **Storage accounts** to display a list of your storage accounts.
2. On the **Storage accounts** page, select **Create**.

:::image type="content" source="media/tax-forms-custom/storage-accounts.png" alt-text="Screenshot: Storage account button on Azure Portal home page.":::
:::image type="content" source="media/tax-forms-custom/create-storage-accounts.png" alt-text="Screenshot: Create storage accounts.":::

### Create a blob container

Once you have a storage account, you can [create a blob container](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container).

1. Navigate to your desired storage account in the Azure portal.
2. In the left navigation bar, scroll to **Data storage** section, then select **Containers**.
3. Click on **+ Container** button.
4. Input a name for your new container. The name must be lowercase, start with a letter or number, and can include only letters, numbers, and the dash (-) character.
5. Set the level of public access. You can leave it as is and access level will be set to **Private**.
6. Select **Create** to create blob container.

:::row:::
   :::column span="":::
      :::image type="content" source="media/tax-forms-custom/create-blob-container-1.png" alt-text="Screenshot: Create blob container part 1.":::
   :::column-end:::
   :::column span="":::
      :::image type="content" source="media/tax-forms-custom/create-blob-container-2.png" alt-text="Screenshot: Create blob container part 2.":::
   :::column-end:::
:::row-end:::

### CORS configuration

Before uploading the training dataset, we need to [configure cross-domain resource sharing (CORS)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services) for the labeling tool to access the data. Select your storage account from the Azure portal, under **Settings** choose **Resource sharing (CORS)** on the left navigation bar.

Then, fill in the following values as shown in the screenshot.

* Allowed origins = \\*
* Allowed methods = [select all eight methods]
* Allowed headers = *
* Exposed headers = *
* Max age = 200

:::image type="content" source="media/tax-forms-custom/cors-settings.png" alt-text="Screenshot: CORS settings in the Azure portal.":::

### Upload dataset to the blob container

To upload your training dataset, navigate to the Blob Container you created in the last step. 

:::image type="content" source="media/tax-forms-custom/navigate-blob-container.png" alt-text="Screenshot: Navigate to blob container.":::

Once you are inside your blob container, you would want to make a folder to store the training data just like you would in any file explorers. To create a new folder, select the **+ New Folder button**. Name a folder for the sample training data set you’ve downloaded in the previous section and choose create. 

:::image type="content" source="media/custom-covid/new-folder.png" alt-text="Screenshot: Create new folder within blob container.":::

After you create a folder, the storage explorer will automatically take you inside of the folder you’ve just created, as you can see from the breadcrumbs. Select the **Upload** button and you can browse your local file system and find the downloaded files to upload. Upload all the files inside the training folder for a specific form. You can upload multiple files at once. Repeat the same process if you want to upload multiple types of sample data at once. 

:::image type="content" source="media/custom-covid/upload-files.png" alt-text="Screenshot: Upload files to blob container.":::

Once you upload all your training data, you should see a screen that look similar to this:

:::image type="content" source="media/custom-covid/after-uploading-files.png" alt-text="Screenshot: After uploading files to blob container.":::

### Get a shared access signature (SAS)

You would also need to retrieve the [SAS (Shared Access Signature)](/azure/storage/common/storage-sas-overview) URL of your Azure Blob Storage container to later connect to the sample labeling tool. Go to your storage resource in the Azure portal:

* Select **Storage Explorer (preview) tab**.
* Right-click on the container where you uploaded your training data and select **Get Shared Access Signature**.
* Make sure the  **Read** ,  **Write** ,  **Delete**,  and**List** permissions are selected.
* Set the expiry time according to how long you want Form Recognizer sample labeling tool to access the data. (You can create new SAS later on if time expires).
* Select **Create** and copy the URL. It should have the form: https://{**storage account**}/blob.core.windows.net/{**container name**}/?/{**SAS value**}.

:::image type="content" source="media/custom-covid/get-sas.png" alt-text="Screenshot: get SAS token in the Azure portal.":::
:::image type="content" source="media/custom-covid/sas-settings.png" alt-text="Screenshot: SAS setting configuration.":::

## 4. Connect your blob storage to the Form Recognizer sample labeling tool

Navigate to the newest [Form Recognizer Sample Labeling Tool](https://fott-2-1.azurewebsites.net/). From the home page, click on **New Connections** (plug) icon in the left navigation bar.

Fill in the fields with the following values:

* **Display Name**  - The connection display name.
* **Description**  - Your project description.
* **SAS URL**  - The shared access signature (SAS) URL of your Azure Blob Storage container.

:::image type="content" source="media/tax-forms-custom/fott-connection-settings.png" alt-text="Screenshot: FOTT connection settings page.":::

Once you fill in all the fields, select **Save Connection**.

## 5. Create a new project and select the data connection from the previous step

From the home page, select **Use Custom** (rightmost icon) and select **New Project**. Complete the fields with the following values:

* **Display Name**. The project display name
* **Security Token**. Some project settings can include sensitive values, such as API keys or other shared secrets. Each project will generate a security token that can be used to encrypt/decrypt sensitive project settings. You can find security tokens in the Application Settings by selecting the gear icon at the bottom of the left navigation bar. If you are creating a project for the first time, leave as it is (Generate New Security Token)
* **Source Connection**. The Azure Blob Storage connection you created in the previous step that you would like to use for this project.
* **Folder Path** (optional). If your source forms are located in a folder on the blob container, specify the folder name here. If the data is stored at the root of your blob, there is no need to input anything.
* **Form Recognizer Service Uri**. Your Form Recognizer endpoint URL from Step 1.
* **API Key**. Your Form Recognizer subscription key from Step 1.
* **Description** (optional). Project description

:::row:::
   :::column span="":::
      :::image type="content" source="media/tax-forms-custom/use-custom-tool-selection.png" alt-text="Screenshot: FOTT custom tool selection.":::
   :::column-end:::
   :::column span="":::
      :::image type="content" source="media/custom-covid/fott-project-settings.png" alt-text="Screenshot: FOTT project settings.":::
   :::column-end:::
:::row-end:::

## 6. Understand the labels

For each of our training data set, you will see they are pre-labeled. So, when you load them into your project, you will see a similar screen to the screenshot below appear. Note how there are already tags with corresponding data for each of the form.

:::image type="content" source="media/custom-covid/fott-labels.png" alt-text="Screenshot: Sample labeling tool tags editor page.":::

In addition to the labeled training and test data, refer to the detailed label descriptions for each of the form below. If a model has a custom table tag, check the second sheet in the Excel file for the table schema.

> [!NOTE]
> The labels provided below are samples to get started. You can add more labels on your own to extract the fields you need for a more comprehensive extraction before training the model.

### Label Descriptions

| Name                | Type          | Description                       | Text                | Value (standardized output) |
| ------------------- | ------------- | --------------------------------- | ------------------- | --------------------------- |
| LastName            | string        | Last name of patient              | Cage                | Cage                        |
| FirstName           | string        | First name of patient             | Jamie               | Jamie                       |
| MiddleName          | string        | Middle name of patient            | Harlow              | Harlow                      |
| DateOfBirth         | date          | Patient's date of birth           | 4/14/1995           | 1995-04-14                  |
| Age                 | number        | Patient's age                     | 26                  | 26                          |
| Male                | selectionMark | Check the appropriate gender      | unselected checkbox | unselected                  |
| Female              | selectionMark | Check the appropriate gender      | selected checkbox   | selected                    |
| Other               | selectionMark | Check the appropriate gender      | unselected checkbox | unselected                  |
| StreetAddress       | string        | Street address of patient         | 434 Main Street     | 434 Main Street             |
| City                | string        | City name                         | Pittsburgh          | Pittsburgh                  |
| State               | string        | State initials                    | PA                  | PA                          |
| Zip                 | string        | ZIP code                          | 15213               | 15213                       |
| PhoneNumber         | number        | Phone number of patient           | (412)-252-1214      | 4122521214                  |
| DateOfSignature     | date          | Date the form was signed on       | 8/1/2021            | 2021-08-19                  |
| Last4DigitsOfSSN    | number        | Last 4 digits of patient's SSN    | 1214                | 1214                        |
| ReceivedVaccine     | selectionMark | Check if already received vaccine | selected checkbox   | selected                    |
| VaccineManufacturer | string        | Manufacturer of vaccine           | Moderna             | Moderna                     |
| ReceivedDate        | date          | Date of vaccination               | 6/1/2021            | 2021-06-01                  |

If in any case you want to modify or delete a tag, navigate to the tags editor pane and select the expand button. From there, you will be able to delete a tag, rename a tag, and change the data type and its format for the tag as you can see from the screenshot below.

:::image type="content" source="media/custom-covid/tags.png" alt-text="Screenshot: FOTT tags editor pane.":::

## 7. Train the model

Choose the **Train** icon on the left pane to open training page. Then, add a model name and select the Train button to begin training the model. Once the training process completes, you'll see the following information:

* **Model ID**. The ID of the model that was created and trained. Each training call creates a new model with its own ID. Copy this string to a secure location; you'll need it if you want to do prediction calls through the [REST API](quickstarts/client-library.md?pivots=programming-language-rest-api) or [client library guide](quickstarts/client-library.md).
* **Average Accuracy**. The model's average accuracy. You can improve model accuracy by labeling additional forms and retraining to create a new model. We recommend starting by labeling five forms and adding more forms as needed.
* The list of tags, and the estimated accuracy per tag.

:::image type="content" source="media/tax-forms-custom/train-model.png" alt-text="Screenshot: FOTT train model.":::
:::image type="content" source="media/custom-covid/train-results.png" alt-text="Screenshot: FOTT model outcome page.":::

## 8. Test the model with the test document or your own forms of the same type

Now that you have your own custom model, you can test with your own data.

To test the model, locate the lightbulb icon on the left navigation panel and select it. You will see the model you’ve just created being used to analyze any uploaded files in this page. Upload our sample test data and see if the model can output the desired result.   Please test with the same form type per model.

:::image type="content" source="media/custom-covid/test-model.png" alt-text="Screenshot: FOTT test model.":::
:::image type="content" source="media/custom-covid/test-output.png" alt-text="Screenshot: FOTT test output.":::


## 9. Next steps

### Improve Model Accuracy

Depending on the reported accuracy, you may want to do further training to improve the model. After you've done a prediction, examine the confidence values for each of the applied tags. If the average accuracy of training results was high, but the confidence scores are low (or the results are inaccurate), you can add the prediction file to the training set, label it, and train again. You can add your test document to your training set by choosing **edit & upload to training set** button.

:::image type="content" source="media/custom-covid/edit-upload-training-set.png" alt-text="Screenshot: FOTT edit & upload to training set.":::

You can also upload your own training document as well by following the same steps in section 3. Navigate to the training folder and upload your own training document. Then, in the sample labeling tool, you will see your training document appear in the tags editor. Select the newly added document and you can either label it yourself by following this guideline or auto-label them by selecting **Auto-label the current document** from the Actions tab. Note that this feature is only available once you have a model trained already.

:::image type="content" source="media/custom-covid/auto-label.png" alt-text="Screenshot: FOTT auto-label current document.":::

The reported average accuracy, confidence scores, and actual accuracy can be inconsistent when the analyzed documents differ from documents used in training. Keep in mind that some documents look similar when viewed by people but can look distinct to the AI model. For example, you might train with a form type that has two variations, where the training set consists of 20% variation A and 80% variation B. During prediction, the confidence scores for documents of variation A are likely to be lower.

### Use your Own Dataset

A set of at least five forms of the same document type and one test form to run analysis on the custom model you created. The test set should also be of a same document type, but the field values should be different to test out the model accurately.

If you want to use your own training set or test set, follow our [custom model input requirements](build-training-data-set.md#custom-model-input-requirements). In addition, the following guidelines may also be helpful:

* For forms that have many blank values, it is best to generate training set that has diverse examples of inputs a form could have. For example, one form would have all the fields filled out whereas others could have some parts filled in. For your custom model to run accurately on all types of test forms, make sure to train the model using train sets that have rich data input.
* To ensure that your model can accurately analyze real-life data, it is recommended to have training datasets that resemble your real-life data for best model quality. You can include handwritten forms that are scanned, filled in electronically, and a picture of the form.
* Even if some fields do not have any data, use the draw region tool to label an area that would include the data if it had any. For example, in the below screenshot, draw a region around the blank area middle name and label them as well (red outlined box) even if a form does not have a middle name filled in as it will increase the overall accuracy of the model when trained.

:::image type="content" source="media/custom-covid/draw-region.png" alt-text="Screenshot: Draw region on blank areas to improve model accuracy.":::

That's it! You've learned to create custom models to extract data from COVID consent forms.

## Learn More

Learn more about deploying Form Recognizer sample labeling tool with Azure Container Instances.

> [!div class="nextstepaction"]
> [Deploy the sample labeling tool](deploy-label-tool.md#deploy-with-azure-container-instances-aci)
