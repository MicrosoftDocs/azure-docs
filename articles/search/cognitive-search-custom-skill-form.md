---
title: 'Form Recognizer custom skill (C#)'
titleSuffix: Azure Cognitive Search
description: 

manager: nitinme
author: PatrickFarley
ms.author: pafarley
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/21/2020
---

# Example: Create a Form Recognizer custom skill

In this Azure Cognitive Search skillset example, you'll learn how to create a Form Recognizer custom skill using C# and Visual Studio Code. The example implements the [custom skill interface](cognitive-search-custom-skill-interface.md).


## Prerequisites

- Review the [custom skill interface](cognitive-search-custom-skill-interface.md) for an introduction into the input/output interface that a custom skill should implement.
- Set up your environment. We followed [this tutorial end-to-end](https://docs.microsoft.com/azure/python/tutorial-vs-code-serverless-python-01) to set up serverless Azure Function using Visual Studio Code and Python extensions. The tutorial leads you through installation of the following tools and components: 
- Access to the Form Recognizer limited-access preview. To get access to the preview, fill out and submit the [Form Recognizer access request](https://aka.ms/FormRecognizerRequestAccess) form.

## Create a Form Recognizer resource

[!INCLUDE [create resource](../cognitive-services/form-recognizer/includes/create-resource.md)]

## Train model

You will need to [train a model with your forms](https://docs.microsoft.com/en-us/azure/cognitive-services/form-recognizer/quickstarts/curl-train-extract) before you can use this skill. The model that was used for this example was trained using sample data that can be downloaded from [the SampleData directory](https://github.com/Azure-Samples/azure-search-power-skills/tree/master/SampleData).

## Set up the custom skill

This function requires a `FORMS_RECOGNIZER_API_KEY` setting set to a valid Azure Forms Recognizer API key.
If running locally, this can be set in your project's debug environment variables (go to project properties, in the debug tab). This ensures your key won't be accidentally checked in with your code.
If running in an Azure function, this can be set in the application settings.

After training, you will need to set the `FORMS_RECOGNIZER_MODEL_ID` application setting to the model id corresponding to your trained model.

The list of fields to extract and the fields they get mapped to in the response of the skill need to be configured to reflect your particular scenario. This can be done by editing [the `fieldMappings` dictionary in the `AnalyzeForm.cs` file](https://github.com/Azure-Samples/azure-search-power-skills/blob/master/Vision/AnalyzeForm/AnalyzeForm.cs#L24).

This example was written to deal with PDF files, but if you are working different file types, you may change the content-type sent to the forms recognizer [by modifying the `contentType` constant in the `AnalyzeForm.cs` file](https://github.com/Azure-Samples/azure-search-power-skills/blob/master/Vision/AnalyzeForm/AnalyzeForm.cs#L29).

## Deploy to Azure

[![Deploy to Azure](https://azuredeploy.net/deploybutton.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-search-power-skills%2Fmaster%2FVision%2FAnalyzeForm%2Fazuredeploy.json)


## Test

This sample data is pointing to a file stored in this repository, but when the skill is integrated in a skillset, the URL and token will be provided by cognitive search.

```json
{
    "values": [
        {
            "recordId": "record1",
            "data": { 
                "formUrl": "https://github.com/Azure-Samples/azure-search-power-skills/raw/master/SampleData/Invoice_4.pdf",
                "formSasToken":  "?st=sasTokenThatWillBeGeneratedByCognitiveSearch"
            }
        }
    ]
}
```

### Response

```json
{
    "values": [
        {
            "recordId": "record1",
            "data": {
                "address": "1111 8th st. Bellevue, WA 99501 ",
                "recipient": "Southridge Video 1060 Main St. Atlanta, GA 65024 "
            },
            "errors": null,
            "warnings": null
        }
    ]
}
```

## Connect to your pipeline

Now that you have a new custom skill, you can add it to your skillset. The example below shows you how to call the skill to
concatenate the Title and the Author of the document into a single field which we call merged_title_author. Replace `[your-function-url-here]` with the URL of your new Azure Function.

```json
{
    "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
    "name": "formrecognizer", 
    "description": "Extracts fields from a form using a pre-trained form recognition model",
    "uri": "[AzureFunctionEndpointUrl]/api/analyze-form?code=[AzureFunctionDefaultHostKey]",
    "httpMethod": "POST",
    "timeout": "PT30S",
    "context": "/document",
    "batchSize": 1,
    "inputs": [
        {
            "name": "formUrl",
            "source": "/document/metadata_storage_path"
        },
        {
            "name": "formSasToken",
            "source": "/document/metadata_storage_sas_token"
        }
    ],
    "outputs": [
        {
            "name": "address",
            "targetName": "address"
        },
        {
            "name": "recipient",
            "targetName": "recipient"
        }
    ]
}
```

## Next steps
Congratulations! You've created your first custom skill. Now you can follow the same pattern to add your own custom functionality. Click the following links to learn more.

+ [Power Skills: a repository of custom skills](https://github.com/Azure-Samples/azure-search-power-skills)
+ [Add a custom skill to an AI enrichment pipeline](cognitive-search-custom-skill-interface.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Skillset (REST)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)
+ [How to map enriched fields](cognitive-search-output-field-mapping.md)
