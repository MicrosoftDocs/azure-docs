---
title: "Use custom blocklists"
titleSuffix: Azure Cognitive Services
description: Learn how to customize text moderation in Content Safety by using your own list of blocked terms.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-safety
ms.topic: how-to
ms.date: 04/06/2023
ms.author: pafarley
keywords: 
---





## QuickStart - Text analysis with custom blocklist

### Disclaimer

The sample data and code may contain offensive content. User discretion is advised.

The default AI classifiers are sufficient for most content moderation needs. However, you might need to screen for terms that are specific to your use case.

You can create custom lists of terms to use with the Text API. The following steps help you get started. For more list operations samples, please refer to [more examples](#custom-list-operations).

The below fields must be included in the url:

| Name              | Description                                                  | Type        |
| :---------------- | :----------------------------------------------------------- | ----------- |
| **BlocklistName** | (Required) Text blocklist Name. Only support following characters: 0-9 A-Z a-z - . _ ~                                                                                                     Example: url = "<Endpoint>/contentmoderator/text/lists/{blocklistName}?api-version=2022-12-30-preview" | String      |
| **blockItems**    | (Required) This is the blocklistName to be checked.                                                                                                          Example: url = "<Endpoint>/contentmoderator/text/lists/{blocklistName}/items/{blockItems}?api-version=2022-12-30-preview" | BCP 47 code |
| **API Version**   | (Required) This is the API version to be checked. Current version is: api-version=2022-12-30-preview. Example: <Endpoint>/contentmoderator/text:analyze?api-version=2022-12-30-preview | String      |



### Create or modify a terms list

> **NOTE:**
>
> There is a maximum limit of **5 term lists** per resource, with each list **not to exceed 10,000 terms**.


1. Use method **PATCH** to create a list or update an existing list's description or name.
1. The relative API path should be "/text/lists/{blocklistName}?api-version=2022-12-30-preview".
1. In the **blocklistName** parameter, enter the Name of the list that you want to add **in the url** (in our example, **1234**). The Name should be a number up to 64 characters.
1. Substitute `<Endpoint>` with your endpoint URL.
1. Paste your subscription key into `the Ocp-Apim-Subscription-Key` field.


```python
import requests
import json

url = "<Endpoint>/contentmoderator/text/lists/1234?api-version=2022-12-30-preview"

payload = json.dumps({
    "blocklistName": "1234",
    "name": "MyList",
    "description": "This is a violence list"
})
headers = {
  'Ocp-Apim-Subscription-Key': '<enter_your_subscription_key_here>',
  'Content-Type': 'application/json'
}

response = requests.request("PATCH", url, headers=headers, data=payload)


print(response.status_code)
print(response.headers)
print(response.text)
```

The response code should be `201` and the URL to get the created list should be contained in the header, named **Location**


### Add or modify a term in the list


> **NOTE:**
>
> There will be some delay after you add or edit a term before it takes effect on text analysis, usually **not exceeding 5 minutes**.

1. Use method **PATCH**.
2. The relative path should be "/text/lists/{blocklistName}/items/{blockItems}?api-version=2022-12-30-preview".
3. In the url path  parameter, enter the **blocklistName** that you want to add   (in our example, **1234**). 
4. In the **blockItems** parameter, enter the term **in the text part (in our example, **blood )
5. Substitute `<Endpoint>` with your endpoint.
6. Paste your subscription key into the `Ocp-Apim-Subscription-Key` field.
8. Enter the following JSON in the **Request body** field, for example:

```json
{
    "blockItems": "01",
    "description": "my first word",
    "text": "blood",
}
```

```python
import requests
import json

url = "<Endpoint>/contentmoderator/text/lists/1234/items/01?api-version=2022-12-30-preview"

payload = json.dumps({
    "blockItems": "01",
    "description": "my first word",
    "text": "blood",
})
headers = {
  'Ocp-Apim-Subscription-Key': '<enter_your_subscription_key_here>',
  'Content-Type': 'application/json'
}

response = requests.request("PATCH", url, headers=headers, data=payload)


print(response.status_code)
print(response.headers)
print(response.text)
```

The response code should be `201` and the URL to get the created list should be contained in the header, named **Location**.



### Analyze text with a custom list

1. Change your method to **POST**.
1. The relative path should be "/contentmoderator/text:analyze?api-version=2022-12-30-preview"
1. Verify that the term has been added to the list. In the **blocklistName** parameter, enter the list Name **in the url** that you generated in the previous step. 
1. Set `breakByBlocklists: True`, so that once a blocklist is matched, the analysis will return immediately without model output. The default setting is `false`.
1. Enter your subscription key, and then select **Send**.
1. In the **Response content** box, verify the terms you entered. The custom list is literally matched by characters and do NOT support regex.

```python
import requests
import json
url = "[Endpoint]/contentmoderator/text:analyze?api-version=2022-12-30-preview&"
payload = json.dumps({
  "text": "I want to beat you till you blood",
  "categories": [
    "Hate",
    "Sexual",
    "SelfHarm",
    "Violence"
  ],
  "blocklistNames":["1234"],
  "breakByBlocklists": True
})
headers = {
  'Ocp-Apim-Subscription-Key': 'Please type your Subscription Key here',
  'Content-Type': 'application/json'
}
response = requests.request("POST", url, headers=headers, data=payload)
print(response.status_code)
print(response.headers)
print(response.text)
```

**Response content**

```json
{
    "blocklistMatchResults": [
        {
            "blocklistName": "1234",
            "blockItems": "01",
            "itemText": "blood",
            "offset": "28",
            "length": "5"
        }
    ]
}
```



### Custom list operations

In addition to the operations mentioned in the quickstart, There are more operations to help you manage and use the custom list feature. These examples use Python.

#### Get all terms in a term list

1. Use method **GET**.
2. The relative path should be "/text/lists/{blocklistName}/items?api-version=2022-12-30-preview".
3. In the **blocklistName** parameter, enter the Name of the list that you want to get (in our example, **1234**). 
4. Substitute [Endpoint] with your endpoint.
5. Paste your subscription key into the **Ocp-Apim-Subscription-Key** field.
6. Enter the following JSON in the **Request body** field, for example:


**Request content** with sample url: [Endpoint]/contentmoderator/text/lists/1234/items?api-version=2022-12-30-preview

```python
import requests
import json

url = "[Endpoint]/contentmoderator/text/lists/1234/items?api-version=2022-12-30-preview"

headers = {
  'Ocp-Apim-Subscription-Key': 'Please type your key here',
  'Content-Type': 'application/json'
}

response = requests.request("GET", url, headers=headers)


print(response.status_code)
print(response.headers)
print(response.text)
```

The status code should be 200 and the response body should be like this:

```json
{
 "values": [
  {
   "blockItems": "01",
   "description": "my first word",
   "text": "blood",
  }
 ]
}
```

#### Get all lists

1. Use method **GET**.
2. The relative path should be "/text/lists?api-version=2022-12-30-preview".
3. Substitute [Endpoint] with your endpoint.
4. Paste your subscription key into the **Ocp-Apim-Subscription-Key** field.
5. Enter the following JSON in the **Request body** field, for example:

**Request content** with sample url: [Endpoint]/contentmoderator/text/lists?api-version=2022-12-30-preview


```python
import requests

import json

url = "[Endpoint]/contentmoderator/text/lists?api-version=2022-12-30-preview"
headers = {
  'Ocp-Apim-Subscription-Key': 'Please type your Subscription Key here',
  'Content-Type': 'application/json'
}

response = requests.request("GET", url, headers=headers)
print(response.status_code)
print(response.headers)
print(response.text)

```

The status code should be `200` .


#### Delete a term

> **NOTE:**
>
> There will be some delay after you delete a term before it takes effect on text analysis, usually **not exceed 5 minutes**.

1. Use method **DELETE**.
2. The relative path should be "/text/lists/{blocklistName}/items/{blockItems}?api-version=2022-12-30-preview".
3. In the **blocklistName** parameter, enter the Name of the list that you want to delete a term from (in our example, **1234**). 
4. In the **blockItems** parameter, enter the Name of the term that you want to delete.
5. Substitute [Endpoint] with your endpoint.
6. Paste your subscription key into the **Ocp-Apim-Subscription-Key** field

**Request content** with sample url: [Endpoint]/contentmoderator/text/lists/1234/items/01?api-version=2022-12-30-preview

```json
{
    "blocklistName": "1234",
    "blockItems": "01"
}
```

**Response content**

```json
204
```

```python
import requests
import json
url = "[Endpoint]/contentmoderator/text/lists/1234/items/01?api-version=2022-12-30-preview"
headers = {
  'Ocp-Apim-Subscription-Key': 'Please type your Subscription Key here',
  'Content-Type': 'application/json'
}
response = requests.request("DELETE", url, headers=headers, data=payload)
print(response.status_code)
print(response.headers)
print(response.text)
```

#### Delete a term list and all of its contents

> **NOTE:**
>
> There will be some delay after you delete a list before it takes effect on text analysis, usually **not exceeding 5 minutes**.


1. Use method **DELETE**.
2. The relative path should be "/text/lists/{blocklistName}?api-version=2022-12-30-preview".
3. In the **blocklistName** parameter, enter the Name of the list that you want to delete. 
4. Substitute [Endpoint] with your endpoint.
5. Paste your subscription key into the **Ocp-Apim-Subscription-Key** field.

Request content** with sample url: [Endpoint]/contentmoderator/text/lists/1234?api-version=2022-12-30-preview

```json
{
    "blocklistName": "1234"
}
```

**Response content**

```json
204
```

```python
import requests
import json
url = "[Endpoint]/contentmoderator/text/lists/1234?api-version=2022-12-30-preview"
headers = {
  'Ocp-Apim-Subscription-Key': 'Please type your Subscription Key here',
  'Content-Type': 'application/json'
}
response = requests.request("DELETE", url, headers=headers, data=payload)
print(response.status_code)
print(response.headers)
print(response.text)
```

