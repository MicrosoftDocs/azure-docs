#  Custom Category API private preview documentation  ![informational](https://shields.io/badge/-PrivatePreview-PrivatePreview) 

## Overview

The Azure AI Content Safety Custom Category feature empowers users to create and manage their own content categories for enhanced moderation and filtering. This feature enables customers to define categories specific to their needs, provide sample data, train a custom machine learning model, and utilize it to classify new content according to the predefined categories.

To use this private preview feature, you should first make sure your subscription is whitelisted, if not please submit a request through this [form](https://forms.office.com/r/38GYZwLC0u), and please expect our reply within 3 business days.



## How it works
The Azure AI Content Safety Custom Category feature is designed to provide a streamlined process for creating, training, and using custom content classification models. Here's an in-depth look at the underlying workflow:
### Step 1: Definition and Setup
 
When you define a custom category, you are essentially instructing the AI on what type of content you want to identify. This involves providing a clear **category name** and a detailed **definition** that encapsulates the content's characteristics. The setup phase is crucial, as it lays the groundwork for the AI to understand your specific moderation needs.

Then, collect a balanced dataset with both **positive** and (optional)**negative examples** allows the AI to learn the nuances of the category. This data should be representative of the variety of content that the model will encounter in a real-world scenario.
### Step 2: Model Training
 
Once you have your dataset ready, the Azure AI Content Safety service uses it to train a new model. During training, the AI analyzes the data, learning to distinguish between content that matches the custom category and content that does not. 
### Step 3: Model Inferencing
 
After training, you need to evaluate the model to ensure it meets your accuracy requirements. This is done by testing the model with new content that it hasn't seen before. The evaluation phase helps you identify any potential adjustments needed before deploying the model into a production environment.




## Quickstart

### Prerequisites
1. Sign in to the [Azure Portal](https://portal.azure.com/).
2. [Create Content Safety Resource](https://aka.ms/acs-create). Enter a unique name for your resource, select your whitelisted subscription, resource group, region and pricing tier. Currently this feature is available in: **East US**.
3. The resource will take a few minutes to deploy. After it does, go to the new resource. In the left pane, under **Resource Management**, select **API Keys and Endpoints**. Copy one of the subscription key values and endpoint to a temporary location for later use.
4. Also you need to enable **Identity** for the Content Safety resource. 
    - Go to your Content Safety instance -> Resource Management -> Identity -> System assigned, make sure the "status" is "On"
5. Format your data to a **.jsonl file** and put the data file into an Azure Storage Account blob. Copy the blob url for later use.
You can create a new [Azure Storage Account](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM) if you don't have one.
Here is an example for the .jsonl file content (negative examples are optional):
    ```jsonl
    {"text": "This is the 1st sample.", "isPositive": true}
    {"text": "This is the 2nd sample.", "isPositive": false}
    {"text": "This is the 3rd sample.", "isPositive": false}
    ```
6. Go to *Access Control* in your Azure Storage Account, and select *+Add Role Assignment* and Assign the role of **Storage Blob Data Contributor/Owner** to the Managed identity you enabled in step 4.
![image](https://hackmd.io/_uploads/BJQPW6mgR.png)

### Sample Code
⚠️ *Disclaimer: The sample code could have offensive content, user discretion is advised.*

**Python Sample Code**

First, you need to install the required Python library:

```bash
pip install requests
```

Then, set up the necessary configurations with your own AI resource details:

```python
import requests

API_KEY = '<your_api_key>'
ENDPOINT = '<your_endpoint>'

headers = {
    'Ocp-Apim-Subscription-Key': API_KEY,
    'Content-Type': 'application/json'
}
```

### 1. Create a new category version:
You can create a new category with *category name*, *definition* and *sample_blob_url*, and you will get the auto-generated version number of this category.
```python
def create_new_category_version(category_name, definition, sample_blob_url):
    url = f"{ENDPOINT}/contentsafety/text/categories/{category_name}?api-version=2024-03-30-preview"
    data = {
        "categoryName": category_name,
        "definition": definition,
        "sampleBlobUrl": sample_blob_url,
        "blobDelimiter" : "/"
    }
    response = requests.put(url, headers=headers, json=data)
    return response.json()

# Replace the parameters with your own values
category_name = "DrugAbuse"
definition = "This category is related to Drug Abuse."
sample_blob_url = "https://example.blob.core.windows.net/example-container/drugsample.jsonl"

result = create_new_category_version(category_name, definition, sample_blob_url)
print(result)
```

### 2. Get a customized category or a specific version of it:

```python
def get_customized_category(category_name, version=None):
    url = f"{ENDPOINT}/contentsafety/text/categories/{category_name}?api-version=2024-03-30-preview"
    if version:
        url += f"&version={version}"
    
    response = requests.get(url, headers=headers)
    return response.json()

# Replace the parameters with your own values
category_name = "DrugAbuse"
version = 1

result = get_customized_category(category_name, version)
print(result)
```

### 3. List categories of their latest versions:

```python
def list_categories_latest_versions():
    url = f"{ENDPOINT}/contentsafety/text/categories?api-version=2024-03-30-preview"
    response = requests.get(url, headers=headers)
    return response.json()

result = list_categories_latest_versions()
print(result)
```

### 4. Trigger the category build process:

```python
def trigger_category_build_process(category_name, version):
    url = f"{ENDPOINT}/contentsafety/text/categories/{category_name}:build?api-version=2024-03-30-preview&version={version}"
    response = requests.post(url, headers=headers)
    return response.status_code

# Replace the parameters with your own values
category_name = "example-category"
version = 1

result = trigger_category_build_process(category_name, version)
print(result)
```

### 5. Delete a customized category or a specific version of it:

```python
def delete_customized_category(category_name, version=None):
    url = f"{ENDPOINT}/contentsafety/text/categories/{category_name}?api-version=2024-03-30-preview"
    if version:
        url += f"&version={version}"
    
    response = requests.delete(url, headers=headers)
    return response.status_code

# Replace the parameters with your own values
category_name = "example-category"
version = 1

result = delete_customized_category(category_name, version)
print(result)
```

### 6. Analyze text with a customized category:
You need to specify the *category name* and the *version number* (optional, will use the latest one by default) during inference. You can specify multiple categories if you have them ready.
```python
def analyze_text_with_customized_category(text, customized_categories):
    url = f"{ENDPOINT}/contentsafety/text:analyze?api-version=2024-03-30-preview"
    data = {
        "text": text,
        "customizedCategories": customized_categories
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Replace the parameters with your own values
text = "Example text to analyze"
customized_categories = [{"categoryName": "example-category", "version": 1}]

result = analyze_text_with_customized_category(text, customized_categories)
print(result)
```

**cURL Sample Code**

Replace `<your_api_key>`, `<your_endpoint>`, and other necessary parameters with your own values.

### 0. SET UP your API key and endpoint:
```bash
API_KEY="<your_api_key>"
API_ENDPOINT="<your_endpoint>"
CATEGORY_NAME="example-category"
```
### 1. Create new category version:

```bash
curl -X PUT "$API_ENDPOINT/contentsafety/text/categories/$CATEGORY_NAME?api-version=2024-03-30-preview" \
     -H "Ocp-Apim-Subscription-Key: $API_KEY" \
     -H "Content-Type: application/json" \
     -d "{
        \"categoryName\": \"$CATEGORY_NAME\",
        \"definition\": \"Example Definition\",
        \"sampleBlobUrl\": \"https://example.blob.core.windows.net/example-container/sample.jsonl\",
        \"blobDelimiter\" : \"/\"
     }"
```

### 2. Get a customized category or a specific version of it:

```bash
curl -X GET "$API_ENDPOINT/contentsafety/text/categories/$CATEGORY_NAME?api-version=2024-03-30-preview&version=1" \
     -H "Ocp-Apim-Subscription-Key: $API_KEY" \
     -H "Content-Type: application/json"
```

### 3. List categories of their latest versions:

```bash
curl -X GET "$API_ENDPOINT/contentsafety/text/categories?api-version=2024-03-30-preview" \
     -H "Ocp-Apim-Subscription-Key: $API_KEY" \
     -H "Content-Type: application/json"
```

### 4. Trigger the category build process:

```bash
curl -X POST "$API_ENDPOINT/contentsafety/text/categories/$CATEGORY_NAME:build?api-version=2024-03-30-preview&version=1" \
     -H "Ocp-Apim-Subscription-Key: $API_KEY" \
     -H "Content-Type: application/json"
```

### 5. Delete a customized category or a specific version of it:

```bash
curl -X DELETE "$API_ENDPOINT/contentsafety/text/categories/$CATEGORY_NAME?api-version=2024-03-30-preview&version=1" \
     -H "Ocp-Apim-Subscription-Key: $API_KEY" \
     -H "Content-Type: application/json"
```

### 6. Analyze text with a customized category:

```bash
curl -X POST "$API_ENDPOINT/contentsafety/text:analyze?api-version=2024-03-30-preview" \
     -H "Ocp-Apim-Subscription-Key: $API_KEY" \
     -H "Content-Type: application/json" \
     -d "{
        \"text\": \"Example text to analyze\",
        \"customizedCategories\": [{\"categoryName\": \"$CATEGORY_NAME\", \"version\": 1}]
     }"
```

Remember to replace the placeholders with your actual values for the API key, endpoint, and specific content (category name, definition .etc). These examples should help you get started with using the Azure AI Content Safety API to analyze your text and work with customized categories.

## Limitations
| Object           | Limitation   |
| ---------------- | ------------ |
| Support language | English only |
|     Number of categories per user             |         5     |
|         Number of category version per category         |        5      |
|       Number of concurrent build (process) per category           |       1       |
|       Inference RPS           |    10          |
|        Customized category number in one text analyze request          |       5       |
|        Number of samples for a category version          |        At least 50, at most 10K (no dupilicated samples allowed)      |
|       Sample file           |     At most 128000 bytes         |
|       Length of a sample           |           125K characters   |
|        Length of deinition          |         1000 characters     |
|       Length of category name           |          128 characters    |
|           Length of blob url       |          at most 500 characters    |


## Best practices
When leveraging the Azure AI Content Safety Custom Category feature, it is essential to follow best practices to ensure the effectiveness and efficiency of your custom content moderation models. Here are some key recommendations:
### 1. Allow Sufficient Time for Model Training
 
Be aware that the end-to-end execution of custom category training can take up from around 5 hours to 10 hours. It is important to plan your moderation pipeline accordingly and allocate time for:
* Collecting and preparing your sample data
* The actual training process
* Model evaluation and adjustments
### 2. Provide Quality Sample Data
 
The quality of your sample data is critical to training an effective model. Aim to provide at least **50** positive samples that accurately represent the content you want to identify. These samples should be clear, varied, and directly related to the category definition.
### 3. Include Negative Samples If Possible
 
While negative samples are not mandatory, including them can significantly improve the model's ability to distinguish relevant content from irrelevant content. Aim for **50 negative samples** that are not related to the positive case definition. These should be random and outside the scope of your category but still within the context of the content your model will encounter.
### 4. Understand Negative Sample Selection
 
Negative samples should be carefully chosen to ensure they do not inadvertently overlap with the positive category. This helps prevent the model from becoming confused and misclassifying content. For example, if your positive samples are related to "Online Gaming Abuse," your negative samples could be general online gaming discussions that do not contain abusive language.
### 5. Balance Your Datasets
 
Strive for a balance between the number of positive and negative samples. An uneven dataset can bias the model, causing it to favor one type of classification over another, which may lead to a higher rate of false positives or negatives.


## API Reference 
Here's the API swagger of this new feature: [Custom Category API Swagger](https://github.com/mengaims/azure-rest-api-specs/blob/acs-0330-private/specification/cognitiveservices/data-plane/ContentSafety/preview/2024-03-30-preview/contentsafety.json).
You could open this swagger in any swagger editor, like https://editor-next.swagger.io/.

There are six APIs related to this feature in the overall swagger:
![image](https://hackmd.io/_uploads/r13XVxm10.png)


## Support
 
Should you encounter any issues or require further assistance with the Azure AI Content Safety Custom Category feature, our dedicated support team is here to help. Reach out to us with any queries, concerns, or feedback, and we will ensure you have the support you need to successfully implement and manage your custom categories.
 
Email us at contentsafetysupport@microsoft.com with the following information:
* Your Azure subscription ID
* A detailed description of the issue or question
* Any relevant screenshots or error messages
* The name of the custom category model in question (if applicable)

We value your feedback as it helps us improve our services. If you have suggestions for the Custom Category feature or the support process, please let us know in your email.
