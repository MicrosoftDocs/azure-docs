
---
title: "Quickstart: Optical character recognition client library for .NET"
description: In this quickstart, get started with the Optical character recognition client library for .NET.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 03/02/2022
ms.author: pafarley
ms.custom: devx-track-csharp, ignite-2022
---


## QuickStart - Text analysis

### Disclaimer

The sample data and code may contain offensive content. User discretion is advised.

### Create an Azure Content Safety resource

Before you can begin to test the Azure Content Safety or integrate it into your applications, you need to create an Azure Content Safety resource and get the subscription keys to access the resource.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. [Create Azure Content Safety Resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesContentModerator). Enter a unique name for your resource, select the subscription you entered on the application form, select a resource group, supported region and supported pricing tier. Then select **Create**.
3. The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.

### Call Text API with a sample request

The following section walks through a sample request with Python. 

1. Install [Python](https://pypi.org/) or [Anaconda](https://www.anaconda.com/products/distribution#Downloads). Anaconda is a package containing many Python packages and allows for an easy start into the world of Python.
1. Find your Resource Endpoint URL in your Azure portal in the **Resource Overview** page under the **Endpoint** field. 
1. Substitute the `<Endpoint>` term with your Resource Endpoint URL.
1. Paste your subscription key into the `Ocp-Apim-Subscription-Key` field.
1. Change the body of the request to whatever string of text you'd like to analyze.

> **NOTE:**
>
> The samples may contain offensive content, user discretion advised.

#### Python

```python
  import requests
  import json

  url = "<Endpoint>/contentmoderator/text:analyze?api-version=2022-12-30-preview"

  payload = json.dumps({
    "text": "you are an idiot",
    "categories": [
      "Hate",
      "Sexual",
      "SelfHarm",
      "Violence"
    ]
  })
  headers = {
    'Ocp-Apim-Subscription-Key': '<enter_your_subscription_key_here>',
    'Content-Type': 'application/json'
  }

  response = requests.request("POST", url, headers=headers, data=payload)


  print(response.status_code)
  print(response.headers)
  print(response.text)
```

#### cURL

Here is a sample request with cURL. You must have [cURL](https://curl.se/download.html) installed to run it.

```shell
curl --location --request POST '[Endpoint]/contentmoderator/text:analyze?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: Please type your Subscription Key here' \
--header 'Content-Type: application/json' \
--data-raw '{
  "text": "you are an Nameiot",
  "categories": [
   "Hate","Sexual","SelfHarm","Violence"
  ]
}'

```



The below fields must be included in the url:

| Name            | Description                                                  | Type   |
| :-------------- | :----------------------------------------------------------- | ------ |
| **API Version** | (Required) This is the API version to be checked. Current version is: api-version=2022-12-30-preview. Example: `<Endpoint>/contentmoderator/text:analyze?api-version=2022-12-30-preview` | String |



The JSON fields that can be included in the request body are defined in this table:

| Name                  | Description                                                  | Type    |
| :-------------------- | :----------------------------------------------------------- | ------- |
| **Text**              | (Required) This is the raw text to be checked. Other non-ASCII characters can be included. | String  |
| **Categories**        | (Optional) This is assumed to be an array of category names. See the **Concepts** section for a list of available category names. If no categories are specified, all four categories are used. We use multiple categories to get scores in a single request. | String  |
| **BlocklistNames**    | Text blocklist Name. Only support following characters: `0-9 A-Z a-z - . _ ~`. You could attach multiple lists name here. | Array   |
| **BreakByBlocklists** | If set this field to `true`, once a blocklist is matched, the analysis returns immediately without model output. Default is `false`. | Boolean |

See the following sample request body:

```json
{
  "text": "you are an Nameiot",
  "categories": [
   "Hate","Sexual","SelfHarm","Violence"
  ],
  "blocklistNames": [
    "array"
  ],
  "breakByBlocklists": false
}
```

> **NOTE: Text size and granularity**
>
> The default maximum length for text submissions is **1K characters**. If you need to analyze longer blocks of text, you can split the input text (for example, using punctuation or spacing) across multiple related submissions. 
>

> **NOTE: Sample Python Jupyter Notebook**
>
> Do the following steps if you want to run the Python sample in a Jupyter Notebook.
>
> 1. Install the [Jupyter Notebook](https://jupyter.org/install). Jupyter Notebook can also easily be installed using [Anaconda](https://www.anaconda.com/products/distribution#Downloads). 
>
> 2. Download the [Sample Python Notebook](https://github.com/Azure/Project-Carnegie-public-Preview/blob/main/Sample%20Code%20for%20Text%20and%20Image%20API%20with%20Multi-severity.ipynb). Note: this needs a github sign in to access. Please also note that you need to use "download ZIP" option from GitHub doc repo instead of "save as" or you will get a load error from Jupyter.
>
> 3. Run the notebook.



### Interpret Text API response

You should see the Text moderation results displayed as JSON data in the console output. For example:

```json
{
    "blocklistMatchResults": [],
    "hateResult": {
        "category": "Hate",
        "riskLevel": 2
    },
    "selfHarmResult": {
        "category": "SelfHarm",
        "riskLevel": 0
    },
    "sexualResult": {
        "category": "Sexual",
        "riskLevel": 0
    },
    "violenceResult": {
        "category": "Violence",
        "riskLevel": 0
    }
}
```

The JSON fields in the output are defined in the following table:

| Name     | Description   | Type   |
| :------------- | :--------------- | ------ |
| **Category**   | Each output class that the API predicts. Classification can be multi-labeled. For example, when a text is run through a text moderation model, it could be classified as sexual content and violence. | String |
| **Risk Level** | Severity of the consequences.   | Number |

> **NOTE: Why risk level is not continuous**
>
> Currently, we only use levels 0, 2, 4, and 6. In the future, we may be able to extend the risk levels to 0, 1, 2, 3, 4, 5, 6, 7: seven levels with finer granularity.

---

## QuickStart - Image analysis

### Disclaimer

The sample data and code may contain offensive content. User discretion is advised.

### Call Image API with sample request

Now that you have an Azure Content Safety resource and you have a subscription key for that resource, let's run some tests by using the Image moderation API.

Here is a sample request with Python:

1. Install the [Python](https://pypi.org/) or [Anaconda](https://www.anaconda.com/products/distribution#Downloads). Anaconda is a nice package containing many Python packages already and allows for an easy start into the world of Python.

1. Substitute the `<Endpoint>` with your resource endpoint URL.

1. Upload your image by one of two methods:**by  Base64 or by Blob url**. We only support JPEG, PNG, GIF, BMP image formats.
   - First method (Recommend): encoding your image to base64. You could use [this website](https://codebeautify.org/image-to-base64-converter)  to do encoding quickly. Put the path to your base 64 image in the _content_ parameter below.
   - Second method: [Upload image to Blob Storage Account](https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks.html). Put your Blob URL into the _url_ parameter below. Currently we only support system assigned Managed Identity to access blob storage, so you must enable system assigned Managed identity for the Azure Content Safety instance and assign the role of "Storage Blob Data Contributor/Owner/Reader" to the identity:
     - Enable managed identity for Azure Content Safety instance. 

       ![enable-cm-mi-1](https://user-images.githubusercontent.com/36343326/213126427-2c789737-f8ec-416b-9e96-d96bf25de58e.png)

     - Assign the role of "Storage Blob Data Contributor/Owner/Reader" to the Managed identity. Any roles highlighted below should work.

       ![assign-role-2](https://user-images.githubusercontent.com/36343326/213126492-938bd351-7e53-45a7-97df-b9d8be94ad80.png)

       ![assign-role-3](https://user-images.githubusercontent.com/36343326/213126536-31efac53-1741-4ff6-97a0-324b9a7e67a9.png)

       ![assign-role-4](https://user-images.githubusercontent.com/36343326/213126616-03af2bc9-2328-42f6-abeb-766eff28cd8a.png)
   
1. Paste your subscription key into the `Ocp-Apim-Subscription-Key` field.

1. Change the body of the request to whatever image you'd like to analyze.

> **NOTE:**
>
> The samples could contain offensive content, user discretion advised.

#### Python


```python
import requests
import json

url = "<Endpoint>/contentmoderator/image:analyze?api-version=2022-12-30-preview"

payload = json.dumps({
  "image": {
    #use content when upload image by base64
    "content": "[base64 encoded image]"
    
    #use url when upload image by blob url
    #"url": "[image blob url]"
  },
  "categories": [
    "Hate",
    "Sexual",
    "SelfHarm",
    "Violence"
  ]
})
headers = {
  'Ocp-Apim-Subscription-Key': '<enter_your_subscription_key_here>',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.status_code)
print(response.headers)
print(response.text)
```

The JSON fields that can be included in the request body are defined in this table:


| Name           | Description                                                  | Type   |
| :------------- | :----------------------------------------------------------- | ------ |
| **Content**    | (Optional) Upload your image by converting it to base64. You can either choose "Content"or "Url". | Base64 |
| **Url**        | (Optional) Upload your image by uploading it into blob storage. You can either choose "Content"or "Url". |        |
| **Categories** | (Optional) This is assumed to be multiple category names. See the **Concepts** part for a list of available category names. If no categories are specified, defaults are used, we use multiple categories in a single request. | String |


> **NOTE: Image size requirements**
>
> The default maximum size for image submissions is **4MB** with at least **50x50** image dimensions.

> **NOTE: Sample Python Jupyter Notebook**
>
> 1. Install the [Jupyter Notebook](https://jupyter.org/install). Jupyter Notebook can also easily be installed using [Anaconda](https://www.anaconda.com/products/distribution#Downloads). 
>
> 2. Download [Sample Python Notebook](https://github.com/Azure/Project-Carnegie-public-Preview/blob/main/Sample%20Code%20for%20Text%20and%20Image%20API%20with%20Multi-severity.ipynb). Note: this needs github sign in to access. Please also note that you need to use "download ZIP" option from GitHub doc repo instead of "save as" or you will get a load error from Jupyter.
>
> 3. Run the notebook.



#### cURL

Here is a sample request with cURL. You must have [cURL](https://curl.se/download.html) installed to run it.

```shell
curl --location --request POST '[Endpoint]/contentmoderator/image:analyze?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: Please type your Subscription Key here' \
--header 'Content-Type: application/json' \
--data-raw '{
  "image": {
    "content": "Please Paste base 64 code here"
  }
}'
```



### Understand Image API response

You should see the Image moderation results displayed as JSON data. For example:

```json
{
    "hateResult": {
        "category": "Hate",
        "riskLevel": 0
    },
    "selfHarmResult": {
        "category": "SelfHarm",
        "riskLevel": 0
    },
    "sexualResult": {
        "category": "Sexual",
        "riskLevel": 0
    },
    "violenceResult": {
        "category": "Violence",
        "riskLevel": 6
    }
}
```
