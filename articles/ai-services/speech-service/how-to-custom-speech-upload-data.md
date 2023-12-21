---
title: "Upload training and testing datasets for Custom Speech - Speech service"
titleSuffix: Azure AI services
description: Learn about how to upload data to test or train a Custom Speech model.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/29/2022
ms.author: eur
zone_pivot_groups: speech-studio-cli-rest
---

# Upload training and testing datasets for Custom Speech 

You need audio or text data for testing the accuracy of speech recognition or training your custom models. For information about the data types supported for testing or training your model, see [Training and testing datasets](how-to-custom-speech-test-and-train.md).

> [!TIP]
> You can also use the [online transcription editor](how-to-custom-speech-transcription-editor.md) to create and refine labeled audio datasets.

## Upload datasets

::: zone pivot="speech-studio"

To upload your own datasets in Speech Studio, follow these steps:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech). 
1. Select **Custom Speech** > Your project name > **Speech datasets** > **Upload data**.
1. Select the **Training data** or **Testing data** tab.
1. Select a dataset type, and then select **Next**.
1. Specify the dataset location, and then select **Next**. You can choose a local file or enter a remote location such as Azure Blob URL. If you select remote location, and you don't use trusted Azure services security mechanism (see next Note), then the remote location should be a URL that can be retrieved with a simple anonymous GET request. For example, a [SAS URL](/azure/storage/common/storage-sas-overview) or a publicly accessible URL. URLs that require extra authorization, or expect user interaction are not supported.

    > [!NOTE]
    > If you use Azure Blob URL, you can ensure maximum security of your dataset files by using trusted Azure services security mechanism. You will use the same techniques as for Batch transcription and plain Storage Account URLs for your dataset files. See details [here](batch-transcription-audio-data.md#trusted-azure-services-security-mechanism). 

1. Enter the dataset name and description, and then select **Next**.
1. Review your settings, and then select **Save and close**.

After your dataset is uploaded, go to the **Train custom models** page to [train a custom model](how-to-custom-speech-train-model.md).

::: zone-end

::: zone pivot="speech-cli"

[!INCLUDE [Map CLI and API kind to Speech Studio options](includes/how-to/custom-speech/cli-api-kind.md)]

To create a dataset and connect it to an existing project, use the `spx csr dataset create` command. Construct the request parameters according to the following instructions:

- Set the `project` parameter to the ID of an existing project. This is recommended so that you can also view and manage the dataset in Speech Studio. You can run the `spx csr project list` command to get available projects.
- Set the required `kind` parameter. The possible set of values for dataset kind are: Language, Acoustic, Pronunciation, and AudioFiles.
- Set the required `contentUrl` parameter. This is the location of the dataset. If you don't use trusted Azure services security mechanism (see next Note), then the `contentUrl` parameter should be a URL that can be retrieved with a simple anonymous GET request. For example, a [SAS URL](/azure/storage/common/storage-sas-overview) or a publicly accessible URL. URLs that require extra authorization, or expect user interaction are not supported.

    > [!NOTE]
    > If you use Azure Blob URL, you can ensure maximum security of your dataset files by using trusted Azure services security mechanism. You will use the same techniques as for Batch transcription and plain Storage Account URLs for your dataset files. See details [here](batch-transcription-audio-data.md#trusted-azure-services-security-mechanism).

- Set the required `language` parameter. The dataset locale must match the locale of the project. The locale can't be changed later. The Speech CLI `language` parameter corresponds to the `locale` property in the JSON request and response.
- Set the required `name` parameter. This is the name that will be displayed in the Speech Studio. The Speech CLI `name` parameter corresponds to the `displayName` property in the JSON request and response.

Here's an example Speech CLI command that creates a dataset and connects it to an existing project:

```azurecli-interactive
spx csr dataset create --api-version v3.1 --kind "Acoustic" --name "My Acoustic Dataset" --description "My Acoustic Dataset Description" --project YourProjectId --content YourContentUrl --language "en-US"
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/datasets/e0ea620b-e8c3-4a26-acb2-95fd0cbc625c",
  "kind": "Acoustic",
  "contentUrl": "https://contoso.com/mydatasetlocation",
  "links": {
    "files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/datasets/e0ea620b-e8c3-4a26-acb2-95fd0cbc625c/files"
  },
  "project": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/70ccbffc-cafb-4301-aa9f-ef658559d96e"
  },
  "properties": {
    "acceptedLineCount": 0,
    "rejectedLineCount": 0
  },
  "lastActionDateTime": "2022-05-20T14:07:11Z",
  "status": "NotStarted",
  "createdDateTime": "2022-05-20T14:07:11Z",
  "locale": "en-US",
  "displayName": "My Acoustic Dataset",
  "description": "My Acoustic Dataset Description"
}
```

The top-level `self` property in the response body is the dataset's URI. Use this URI to get details about the dataset's project and files. You also use this URI to update or delete a dataset.

For Speech CLI help with datasets, run the following command:

```azurecli-interactive
spx help csr dataset
```

::: zone-end

::: zone pivot="rest-api"

[!INCLUDE [Map CLI and API kind to Speech Studio options](includes/how-to/custom-speech/cli-api-kind.md)]

To create a dataset and connect it to an existing project, use the [Datasets_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Create) operation of the [Speech to text REST API](rest-speech-to-text.md). Construct the request body according to the following instructions:

- Set the `project` property to the URI of an existing project. This is recommended so that you can also view and manage the dataset in Speech Studio. You can make a [Projects_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_List) request to get available projects.
- Set the required `kind` property. The possible set of values for dataset kind are: Language, Acoustic, Pronunciation, and AudioFiles.
- Set the required `contentUrl` property. This is the location of the dataset. If you don't use trusted Azure services security mechanism (see next Note), then the `contentUrl` parameter should be a URL that can be retrieved with a simple anonymous GET request. For example, a [SAS URL](/azure/storage/common/storage-sas-overview) or a publicly accessible URL. URLs that require extra authorization, or expect user interaction are not supported. 

    > [!NOTE]
    > If you use Azure Blob URL, you can ensure maximum security of your dataset files by using trusted Azure services security mechanism. You will use the same techniques as for Batch transcription and plain Storage Account URLs for your dataset files. See details [here](batch-transcription-audio-data.md#trusted-azure-services-security-mechanism). 

- Set the required `locale` property. The dataset locale must match the locale of the project. The locale can't be changed later. 
- Set the required `displayName` property. This is the name that will be displayed in the Speech Studio.

Make an HTTP POST request using the URI as shown in the following example. Replace `YourSubscriptionKey` with your Speech resource key, replace `YourServiceRegion` with your Speech resource region, and set the request body properties as previously described.

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "kind": "Acoustic",
  "displayName": "My Acoustic Dataset",
  "description": "My Acoustic Dataset Description",
  "project": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/70ccbffc-cafb-4301-aa9f-ef658559d96e"
  },
  "contentUrl": "https://contoso.com/mydatasetlocation",
  "locale": "en-US",
}'  "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/datasets"
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/datasets/e0ea620b-e8c3-4a26-acb2-95fd0cbc625c",
  "kind": "Acoustic",
  "contentUrl": "https://contoso.com/mydatasetlocation",
  "links": {
    "files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/datasets/e0ea620b-e8c3-4a26-acb2-95fd0cbc625c/files"
  },
  "project": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/70ccbffc-cafb-4301-aa9f-ef658559d96e"
  },
  "properties": {
    "acceptedLineCount": 0,
    "rejectedLineCount": 0
  },
  "lastActionDateTime": "2022-05-20T14:07:11Z",
  "status": "NotStarted",
  "createdDateTime": "2022-05-20T14:07:11Z",
  "locale": "en-US",
  "displayName": "My Acoustic Dataset",
  "description": "My Acoustic Dataset Description"
}
```

The top-level `self` property in the response body is the dataset's URI. Use this URI to [get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Get) details about the dataset's project and files. You also use this URI to [update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Update) or [delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Delete) the dataset.

::: zone-end

> [!IMPORTANT] 
> Connecting a dataset to a Custom Speech project isn't required to train and test a custom model using the REST API or Speech CLI. But if the dataset is not connected to any project, you can't select it for training or testing in the [Speech Studio](https://aka.ms/speechstudio/customspeech). 

## Next steps

* [Test recognition quality](how-to-custom-speech-inspect-data.md)
* [Test model quantitatively](how-to-custom-speech-evaluate-data.md)
* [Train a custom model](how-to-custom-speech-train-model.md)
