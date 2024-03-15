tbd

# Quickstart: Groundedness detection 

## Create an Azure Content Safety resource

1. Sign in to the [Azure Portal](https://portal.azure.com/).
2. [Create Content Safety Resource](https://aka.ms/acs-create). Enter a unique name for your resource, and select your region and pricing tier. Currently the Groundedness detection API is available in three regions: **East US2, West US, Sweden Central**. Please create your Content Safety resource in one of these regions.
3. The resource will take a few minutes to deploy. After it does, go to the new resource. In the left pane, under **Resource Management**, select **API Keys and Endpoints**. Copy one of the subscription key values and endpoint to a temporary location for later use.

## Test with a sample request

Now that you have a resource available in Azure for Content Safety and you have a subscription key for that resource, run some tests with the Groundedness detection API.

1. Substitute the `<endpoint>` with your resource endpoint URL (skip the `https://` in the URL), such as <endpoint>/contentsafety/text:detectGroundedness?api-version=2024-02-15-preview.
2. Replace `<your_subscription_key>` with your key.
   
The below fields must be included in the URL:

| Name     | Required? | Description | Type   |
| :-------------- | :-------- | :------ | :----- |
| **API Version** | Required  | This is the API version to be used. The current version is: api-version=2024-02-15-preview. Example: `<endpoint>/contentsafety/text:shieldPrompt?api-version=2024-02-15-preview` | String |

### Test with QnA Task
```json
{
    "Domain": "GENERIC",
    "Task": "QnA",
    "qna": {
     "query": "How much does she currently get paid per hour at the bank?"
    },
    "Text": "12/hour.",
    "GroundingSources": [
 "I'm 21 years old and I need to make a decision about the next two years of my life. Within a week. I currently work for a bank that requires strict sales goals to meet. IF they aren't met three times (three months) you're canned. They pay me 10/hour and it's not unheard of to get a raise in 6ish months. The issue is, **I'm not a salesperson**. That's not my personality. I'm amazing at customer service. I have the most positive customer service \"reports\" done about me in the short time I've worked here. A coworker asked \"do you ask for people to fill these out? You have a ton\". That being said, I have a job opportunity at Chase Bank as a part time teller. What makes this decision so hard is that at my current job, I get 40 hours and Chase could only offer me 20 hours/week. Drive time to my current job is also 21 miles **one way** while Chase is literally 1.8 miles from my house, allowing me to go home for lunch. I do have an apartment and an awesome roommate that I know wont be late on his portion of rent, so paying bills with 20 hours a week isn't the issue. It's the spending money and being broke all the time.\n\nI previously worked at Wal-Mart and took home just about 400 dollars every other week. So I know i can survive on this income. I just don't know whether I should go for Chase as I could definitely see myself having a career there. I'm a math major likely going to become an actuary, so Chase could provide excellent opportunities for me **eventually**.",
       
    ],
    "Reasoning": true,
    "llmResource": {
 "resourceType": "AzureOpenAI",
 "azureOpenAIEndpoint": "<Your_GPT_Endpoint>",
 "azureOpenAIDeploymentName": "<Your_GPT_Deployment>"
    }
}
```
### Test with Summarization Task
```json
{
    "Domain": "Medical",
    "Task": "Summarization",
    "Text": "Ms Johnson has been in the hospital after experiencing a stroke.",
    "GroundingSources": [
 "Our patient, Ms. Johnson, presented with persistent fatigue, unexplained weight loss, and frequent night sweats. After a series of tests, she was diagnosed with Hodgkin’s lymphoma, a type of cancer that affects the lymphatic system. The diagnosis was confirmed through a lymph node biopsy revealing the presence of Reed-Sternberg cells, a characteristic of this disease. She was further staged using PET-CT scans. Her treatment plan includes chemotherapy and possibly radiation therapy, depending on her response to treatment. The medical team remains optimistic about her prognosis given the high cure rate of Hodgkin’s lymphoma.",
       
    ],
    "Reasoning": true,
    "llmResource": {
 "resourceType": "AzureOpenAI",
 "azureOpenAIEndpoint": "<Your_GPT_Endpoint>",
 "azureOpenAIDeploymentName": "<Your_GPT_Deployment>"
    }
}
```

| Name  | Description     | Type    |
| :----------- | :--------- | ------- |
| **Domain** | (Optional) `MEDICAL` or `GENERIC`. Default value: `GENERIC`. | Enum  |
| **Task** | (Optional) Type of task: `QnA`, `Summarization`. Default value: `Summarization`. | Enum |
| **qna**       | (Optional) This parameter is only used when the task type is QnA.  | String  |
| - `query`       | (Optional) This is used to submit a question or a query in a Questions and Answers task. Character limit: 7,500. | String  |
| **Text**   | (Required) The text that needs to be checked. Character limit: 7500. |  String  |
| **GroundingSources**  | (Required) Uses an array of grounding sources to validate AI-generated text. Restrictions on the total amount of grounding sources that can be analyzed in a single request are 55K characters. | String array    |
| **Reasoning**  | (Optional) Specifies whether to use the reasoning feature. The default value is `False`. If `True`, the service uses our default GPT resources to provided an explanation and included the "ungrounded" sentence. Be careful: using reasoning will increase the processing time and incur extra fees.| Boolean   |
| **llmResource**  | (Optional) If you want to use your own GPT resources instead of our default GPT resources, add this field manually and include the subfield below for the GPT resources used. If you do not want to use your own GPT resources, remove this field from the input. | String   |
| - `resourceType `| Specifies the type of resource being used, for this version, only allows: `AzureOpenAI`. | Enum|
| - `azureOpenAIEndpoint `| Endpoint URL for Azure's OpenAI service.  | String |
| - `azureOpenAIDeploymentName` | Name of the specific deployment to use. | String|

## Managed identity
The Groundedness detection API provides the option to include _reasoning_ in the API response. If you opt for reasoning, you must either utilize your own GPT resources or use our provided default GPT resources. In this case, the response will include an additional reasoning value. This value details specific instances and explanations for any detected ungroundedness. If you choose not to receive reasoning, the API will classify the submitted content as `true` or `false` and provide a confidence score.

To allow your Content Safety resource to access Azure OpenAI resources using a managed identity, you'd typically follow these steps.

 1. Enable Managed Identity for Azure AI Content Safety.

Navigate to your Azure AI Content Safety instance in the Azure portal. Find the "Identity" section under the "Settings" category. Enable the system-assigned managed identity. This action grants your Azure AI Content Safety instance an identity that can be recognized and used within Azure for accessing other resources. 

  ![image](https://github.com/Azure/Azure-AI-Content-Safety-Private-Preview/assets/36343326/dfa6677f-1c13-4a80-9c1b-f0b2c19b849f)

 2. Assign Role to Managed Identity.

Navigate to your Azure OpenAI instance, click on "Add role assignment" to start the process of assigning a Azure OpenAI role to the Azure AI Content Safety managed identity. Choose a role that grants the necessary permissions for the tasks you want to perform. Based on your needs, this could be "Contributor" or "User". The specific roles and permissions might vary based on what you're looking to achieve.
  ![image](https://github.com/Azure/Azure-AI-Content-Safety-Private-Preview/assets/36343326/0bdab704-2825-4a78-b9b4-56e72aa19718)

  ![image](https://github.com/Azure/Azure-AI-Content-Safety-Private-Preview/assets/36343326/5df9be34-0929-4dfa-8e5a-edfd653d0e02)
   

## Output

```json
{
    "ungrounded": true,
    "confidenceScore": 1,
    "ungroundedPercentage": 1,
    "ungroundedDetails": [
     {
 "text": "string",
 "offset": {
 "utf8": 0,
 "utf16": 0,
 "codePoint": 0
      },
 "length": {
 "utf8": 0,
 "utf16": 0,
 "codePoint": 0
      },
      "reason": "string"
    }
  ]
}
```

The JSON objects in the output are defined here:

| Name  | Description    | Type    |
| :------------------ | :----------- | ------- |
| **ungrounded** | Indicates whether the text exhibits ungroundedness.  | Boolean    |
| **confidenceScore** | The confidence value of the _ungrounded_ designation. The score will range from 0 to 1.	 | Float	 |
| **ungroundedPercentage** | Specifies the proportion of the text identified as ungrounded, expressed as a number between 0 and 1, where 0 indicates no ungrounded content and 1 indicates entirely ungrounded content.| Float	 |
| **ungroundedDetails** | Provides insights into ungrounded content with specific examples and percentages.| String |
| -**`Text`**   |  The specific text that is ungrounded.  | String   |
| -**`offset`**   |  An object describing the position of the ungrounded text in various encoding.  | String   |
| - `offset > utf8`       | The offset position of the ungrounded text in UTF-8 encoding.      | number   |
| - `offset > utf16`      | The offset position of the ungrounded text in UTF-16 encoding.       | number |
| - `offset > codePoint`  | The offset position of the ungrounded text in terms of Unicode code points. |number    |
| -**`length`**   |  An object describing the length of the ungrounded text in various encoding. (utf8, utf16, codePoint), similar to the offset. | String   |
| - `length > utf8`       | The length of the ungrounded text in UTF-8 encoding.      | number   |
| - `length > utf16`      | The length of the ungrounded text in UTF-16 encoding.       | number |
| - `length > codePoint`  | The length of the ungrounded text in terms of Unicode code points. |number    |
| -**`Reason`** |  Offers explanations for detected ungroundedness. | String  |


Python sample request:

```Python

import http.client
import json

conn = http.client.HTTPSConnection("<Endpoint>/contentsafety/text:detectGroundedness?api-version=2024-02-15-preview")
payload = json.dumps({
  "domain": "Generic",
  "task": "QnA",
  "qna": {
    "query": "How much does she currently get paid per hour at the bank?"
  },
  "text": "12/hour",
  "groundingSources": [
    "I'm 21 years old and I need to make a decision about the next two years of my life. Within a week. I currently work for a bank that requires strict sales goals to meet. IF they aren't met three times (three months) you're canned. They pay me 10/hour and it's not unheard of to get a raise in 6ish months. The issue is, **I'm not a salesperson**. That's not my personality. I'm amazing at customer service, I have the most positive customer service \"reports\" done about me in the short time I've worked here. A coworker asked \"do you ask for people to fill these out? you have a ton\". That being said, I have a job opportunity at Chase Bank as a part time teller. What makes this decision so hard is that at my current job, I get 40 hours and Chase could only offer me 20 hours/week. Drive time to my current job is also 21 miles **one way** while Chase is literally 1.8 miles from my house, allowing me to go home for lunch. I do have an apartment and an awesome roommate that I know wont be late on his portion of rent, so paying bills with 20hours a week isn't the issue. It's the spending money and being broke all the time.\n\nI previously worked at Wal-Mart and took home just about 400 dollars every other week. So I know i can survive on this income. I just don't know whether I should go for Chase as I could definitely see myself having a career there. I'm a math major likely going to become an actuary, so Chase could provide excellent opportunities for me **eventually**."
  ],
  "reasoning": False
})
headers = {
  'Ocp-Apim-Subscription-Key': '<your_subscription_key>',
  'Content-Type': 'application/json'
}
conn.request("POST", "/contentsafety/text:detectGroundedness?api-version=2024-02-15-preview", payload, headers)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))
```
