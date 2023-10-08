---
title: Export/import/refresh | question answering projects and projects
description: Learn about backing up your question answering projects and projects
ms.service: azure-ai-language
ms.subservice: azure-ai-qna-maker
ms.topic: how-to
author: jboback
ms.author: jboback
recommendations: false
ms.date: 01/25/2022
---
# Export-import-refresh in question answering

You may want to create a copy of your question answering project or related question and answer pairs for several reasons:

* To implement a backup and restore process
* To integrate with your CI/CD pipeline
* To move your data to different regions

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.
* A [language resource](https://aka.ms/create-language-resource) with the custom question answering feature enabled. Remember your Azure Active Directory ID, Subscription, language resource name you selected when you created the resource.

## Export a project

1. Sign in to the [Language Studio](https://language.azure.com/) with your Azure credentials.

2. Scroll down to the **Answer questions** section and select **Open custom question answering**.

3. Select the project you wish to export > Select **Export** > You’ll have the option to export as an **Excel** or **TSV** file.

4. You’ll be prompted to save your exported file locally as a zip file.

### Export a project programmatically

To automate the export process, use the [export functionality of the authoring API](./authoring.md#export-project-metadata-and-assets)

## Import a project

1. Sign in to the [Language Studio](https://language.azure.com/) with your Azure credentials.

2. Scroll down to the **Answer questions** section and select **Open custom question answering**.

3. Select **Import** and specify the file type you selected for the export process. Either **Excel**, or **TSV**.

4. Select Choose File and browse to the local zipped copy of your project that you exported previously.

5. Provide a unique name for the project you’re importing.

6. Remember that a project that has only been imported still needs to be deployed/published if you want it to be live.

### Import a project programmatically

To automate the import process, use the [import functionality of the authoring API](./authoring.md#import-project)

## Refresh source url

1. Sign in to the [Language Studio](https://language.azure.com/) with your Azure credentials.

2. Scroll down to the **Answer questions** section and select **Open custom question answering**.

3. Select the project that contains the source you want to refresh > select manage sources.

4. We recommend having a backup of your project/question answer pairs prior to running each refresh so that you can always roll-back if needed.

5. Select a url-based source to refresh > Select **Refresh URL**.
6. Only one URL can be refreshed at a time.

### Refresh a URL programmatically

To automate the URL refresh process, use the [update sources functionality of the authoring API](./authoring.md#update-sources)

The update sources example in the [Authoring API docs](./authoring.md#update-sources) shows the syntax for adding a new URL-based source. An example query for an update would be as follows:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`. If this was your endpoint in the following code sample, you would only need to add the region-specific portion of `southcentral` as the rest of the endpoint path is already present.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `PROJECT-NAME` | The name of project where you would like to update sources.|

```bash
curl -X PATCH -H "Ocp-Apim-Subscription-Key: {API-KEY}" -H "Content-Type: application/json" -d '[
  {
    "op": "replace",
    "value": {
      "displayName": "source5",
      "sourceKind": "url",
      "sourceUri": https://download.microsoft.com/download/7/B/1/7B10C82E-F520-4080-8516-5CF0D803EEE0/surface-book-user-guide-EN.pdf,
      "refresh": "true"
    }
  }
]'  -i 'https://{ENDPOINT}.api.cognitive.microsoft.com/language/query-knowledgebases/projects/{PROJECT-NAME}/sources?api-version=2021-10-01'
```

## Export questions and answers

It’s also possible to export/import a specific project of question and answers rather than the entire question answering project.

1. Sign in to the [Language Studio](https://language.azure.com/) with your Azure credentials.

2. Scroll down to the **Answer questions** section and select **Open custom question answering**.

3. Select the project that contains the project question and answer pairs you want to export.

4. Select **Edit project**.

5. To the right of show columns are `...` an ellipsis button. > Select the `...` > a dropdown will reveal the option to export/import questions and answers.

    Depending on the size of your web browser, you may experience the UI differently. Smaller browsers will see two separate ellipsis buttons.

    > [!div class="mx-imgBorder"]
    > ![Screenshot of selecting multiple UI ellipsis buttons to get to import/export question and answer pair option](../media/export-import-refresh/export-questions.png)

## Import questions and answers

It’s also possible to export/import a specific project of question and answers rather than the entire question answering project.

1. Sign in to the [Language Studio](https://language.azure.com/) with your Azure credentials.

2. Scroll down to the **Answer questions** section and select **Open custom question answering**.

3. Select the project that contains the project question and answer pairs you want to export.

4. Select **Edit project**.

5. To the right of show columns are `...` an ellipsis button. > Select the `...` > a dropdown will reveal the option to export/import questions and answers.

    Depending on the size of your web browser, you may experience the UI differently. Smaller browsers will see two separate ellipsis buttons.

    > [!div class="mx-imgBorder"]
    > ![Screenshot of selecting multiple UI ellipsis buttons to get to import/export question and answer pair option](../media/export-import-refresh/export-questions.png)

## Next steps

* [Learn how to use the Authoring API](./authoring.md)
