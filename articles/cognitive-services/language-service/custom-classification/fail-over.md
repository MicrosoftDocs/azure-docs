# Back up and recover your custom text classification projects

When you create a Language resource in the Azure portal, you specify a region for it to be created in. From then on, your resource and all of the operations related to it take place in the specified Azure server region. It's rare, but not impossible, to encounter a network issue that hits an entire region. If your solution needs to always be available, then you should design it to either fail-over into another region <!-- or split the workload between two or more regions-->. This require two Azure Language resources in different regions and the ability to sync custom models across regions. 

You can use the export and import APIs to clone your project from one resource to another, which can exist in any supported geographical region.

## Business scenario

If your app or business depends on the use of a custom text classification model, we recommend you to clone your project into another supported region. If a regional outage occurs, you can then access your model in the region where it was cloned. 

<!-- You should regularly check that your projects are in sync, see details in the below section-->

##  Prerequisites

1. Two Azure Language resources in different Azure regions. Follow the instructions mentioned [here](../how-to/create-project.md#azure-resources) to create your resources and link it to Azure storage account. It is recomeneded that you link both your Languge resources to the same storage account. 

## Get your resource keys endpoint

Use the following steps to get the keys and endpoint of your primary and secondary resuorces. These will be used in the following steps.

* Go to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home)

* From the menu of the left side of the screen, select **Keys and Endpoint**. Use endpoint for the API requests and you’ll need the key for `Ocp-Apim-Subscription-Key` header.
:::image type="content" source="0/media/azure-portal-resource-credentials.png" alt-text="A screenshot showing the key and endpoint screen for an Azure resource." lightbox="./media/azure-portal-resource-credentials.png":::

## Export your primary project assets

Start by exporting the project assests from the project in your primary resource.

### Submit export job

Create a **POST** request using the following URL, headers, and JSON body to export project metadata and assets.

Use the following URL to export your primary project assets. Replace the placeholder values below with your own values. 

```rest
{YOUR-PRIMARY-ENDPOINT}/language/analyze-text/projects/{projectName}/:export?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-PRIMARY-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |

#### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

#### Body

Use the following JSON in your request body specifying that you want to export all the assests.

```json
{
  "assetsToExport": ["*"]
}
```

Once you send your API request, you’ll receive a `202` response indicating success. In the response headers, extract the `location` value. It will be formatted like this: 

```rest
{YOUR-PRIMARY-ENDPOINT}/language/analyze-text/projects/{YOUR-PROJECT-NAME}/export/jobs/{JOB-ID}?api-version=2021-11-01-preview
``` 

`JOB-ID` is used to identify your request, since this operation is asynchronous. You’ll use this URL in the next step to get the training status. 

### Get export job status

Use the following **GET** request to query the status of your export job status. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{YOUR-PRIMARY-ENDPOINT}/language/analyze-text/projects/{YOUR-PROJECT-NAME}/export/jobs/{JOB-ID}?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-PRIMARY-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{JOB-ID}`     | The ID for locating your export job status. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |

#### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

#### Response body

```json
{
  "resultUrl": "{YOUR-PRIMARY-ENDPOINT}/language/analyze-text/internal/projects/{YOUR-PROJECT-NAME}/export/jobs/{JOB-ID}/result?api-version=2021-11-01-preview",
  "jobId": "string",
      "createdDateTime": "2021-10-19T23:24:41.572Z",
      "lastUpdatedDateTime": "2021-10-19T23:24:41.572Z",
      "expirationDateTime": "2021-10-19T23:24:41.572Z",
  "status": "unknown",
  "errors": [
    {
      "code": "unknown",
      "message": "string"
    }
  ]
}
```

Use the url from the `resultUrl` key in the body to view the exported assests from this job.

### Get export results

Use the following **GET** request to view the resuts of the export job. You can use the URL you received from the previous step, or replace the placeholder values below with your own values. 

```rest
{YOUR-PRIMARY-ENDPOINT}/language/analyze-text/internal/projects/{YOUR-PROJECT-NAME}/export/jobs/{JOB-ID}/result?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-PRIMARY-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |
|`{JOB-ID}`     | The ID for downloading export job results. This is in the `location` header value you received in the previous step.  | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx` |

#### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

Copy the response body as you will use it as the body for the next import job.


## Import to a new project 

Now go ahead and import the exported project assests in your new project in the secondary region so you can clone it.

### Submit import job

Create a **POST** request using the following URL, headers, and JSON body to create your project and import the tags file.

Use the following URL to create a project and import your tags file. Replace the placeholder values below with your own values. 

```rest
{YOUR-SECONDARY-ENDPOINT}/language/analyze-text/projects/{projectName}/:import?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-SECONDARY-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

### Body

Use the response body you got from the previous export step. It will have a format similar to this:

```json
{
    "api-version": "2021-11-01-preview",
    "metadata": {
        "name": "MyProject",
        "multiLingual": true,
        "description": "Trying out custom text classification",
        "modelType": "multiClassification",
        "language": "string",
        "storageInputContainerName": "YOUR-CONTAINER-NAME",
        "settings": {}
    },
    "assets": {
        "classifiers": [
            {
                "name": "Class1"
            }
        ],
        "documents": [
            {
                "location": "doc1.txt",
                "language": "en-us",
                "classifiers": [
                    {
                        "classifierName": "Class1"
                    }
                ]
            }
        ]
    }
}
```


Now you have cloned your project from one resource to another. 

Follow these instructions to [train your model](../how-to/train-model?tabs=portal#azure-resources.md) and [deploy it](../how-to/call-api.md).

![**Note**] use the same deployment name as your primary model for easier maintenace of both projects.

<!-- ## Check if your projects are out of sync -->

## Next steps

In this article, you have learned how to use the export and import APIs to clone you project to a secondary Language resource in other region. Next, explore the API reference docs to see what else you can do with authoring APIs.

* [REST API reference documentation](https://aka.ms/ct-authoring-swagger)
