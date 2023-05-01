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
ms.date: 04/21/2023
ms.author: pafarley
keywords: 
---


# Use a custom blocklist

> [!CAUTION]
> The sample data in this guide may contain offensive content. User discretion is advised.

The default AI classifiers are sufficient for most content moderation needs. However, you may need to screen for items that are specific to your use case.

## Analyze text with a custom blocklist

You can create custom lists of blocked items to use with the Text API. The following steps help you get started.

The below fields must be included in the url:

| Name         | Description | Type     |
| :---------------- | :-------------- | ----------- |
| **BlocklistName** | (Required) Text blocklist Name. Only support following characters: `0-9 A-Z a-z - . _ ~        `      Example: `url = "<Endpoint>/contentsafety/text/lists/{blocklistName}?api-version=2022-12-30-preview"` | String      |
| **blockItems**    | (Required) This is the blocklistName to be checked.     Example: `url = "<Endpoint>/contentsafety/text/lists/{blocklistName}/items/{blockItems}?api-version=2022-12-30-preview"` | BCP 47 code |
| **API Version**   | (Required) This is the API version to be checked. Current version is: api-version=2022-12-30-preview. Example: `<Endpoint>/contentsafety/text:analyze?api-version=2022-12-30-preview` | String      |


### Create or modify a blocklist

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace the value of the `"blocklistname"` field with a custom ID for your list. Also replace the last term of the REST URL with the same name.
1. Optionally replace the value of the `"MyList"` field with a custom name.
1. Optionally replace the value of the `"Description"` field with a custom description.


```shell
curl --location --request PATCH '<endpoint>/contentsafety/text/blocklists/<your_list_id>?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json' \
--data-raw '{TBD
    "blocklistName": "<your_list_id>",
    "name": "MyList",
    "description": "This is a violence list"
}'
```

The response code should be `201` and the URL to get the created list should be contained in the header, named **Location**.


### Add or modify a blockItem in the list

> [!NOTE]
>
> There is a maximum limit of **10,000 terms** in total across all lists.

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step.
1. Optionally replace the value of the `"blockItems"` field with a different number. This ID string must be unique for each item.
1. Optionally replace the value of the `"description"` field with a custom description.
1. Replace the value of the `"text"` field with the item you'd like to add to your blocklist.

```shell
curl --location --request PATCH '<endpoint>/contentsafety/text/blocklists/<your_list_id>:addBlockItems?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json' \
--data-raw '"blockItems(TBD)": [{
    "blockItems": "01",
    "description": "my first word",
    "text": "bleed"
}]'
```

> [!TIP]
> You can add multiple blockItems in one API call. Make the request body a JSON array of data groups:
>
> [{
>    "blockItems": "01",
>    "description": "my first word",
>    "text": "bleed"
> },
> {
>    "blockItems": "02",
>    "description": "my second word",
>    "text": "blood"
> }]


The response code should be `201` and the URL to get the created list should be contained in the header, named **Location**.

> [!NOTE]
> 
> There will be some delay after you add or edit a blockItem before it takes effect on text analysis, usually **not more than five minutes**.

### Analyze text with a custom list

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step. The `"blocklistNames"` field can contain an array of multiple list IDs.
1. Optionally change the value of `"breakByBlocklists"`. `true` indicates that once a blocklist is matched, the analysis will return immediately without model output. `false` will cause the model to continue to do analysis in the default categories.
1. Optionally change the value of the `"text"` field to whatever text you want to analyze. 

```shell
curl --location --request POST '<endpoint>/contentsafety/text:analyze?api-version=2022-12-30-preview&' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "text": "I want to beat you till you bleed",
  "categories": [
    "Hate",
    "Sexual",
    "SelfHarm",
    "Violence"
  ],
  "blocklistNames":["<your_list_id>"],
  "breakByBlocklists": true
}'
```

The JSON response will contain a `"blocklistMatchResults"` that indicates any matches with your blocklist. It reports the location in the text string where the match was found.

```json
{
  "blocklistMatchResults": [
    {
      "blocklistName": "1234",
      "blockItems": "01",
      "itemText": "bleed",
      "offset": "28",
      "length": "5"
    }
  ]
}
```


## Other custom list operations

This section contains more operations to help you manage and use the custom list feature.

### Get all blockItems in a list

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` (in the request URL) with the ID value you used in the list creation step.

```shell
curl --location --request GET '<endpoint>/contentsafety/text/blocklists/<your_list_id>/blockItems?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json'
```

The status code should be `200` and the response body should look like this:

```json
{
 "values": [
  {
   "blockItems": "01",
   "description": "my first word",
   "text": "bleed",
  }
 ]
}
```

### Get all custom lists

Copy the cURL command below to a text editor and make the following changes:


1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.


```shell
curl --location --request GET '<endpoint>/contentsafety/text/lists?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json'
```

The status code should be `200`.


### Delete a blockItem from a list

> [!NOTE]
>
> There will be some delay after you delete an item before it takes effect on text analysis, usually **not more than five minutes**.

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` (in the request URL) with the ID value you used in the list creation step.
1. Replace `<item_id>` (both places) with the ID value for the blockItem. This is the value of the `"blockItems"` field in the **Add** API call.


```shell
curl --location --request DELETE '<endpoint>/contentsafety/text/lists/<your_list_id>/items/<item_id>?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json'
--data-raw '"blockItemIds"(TBD):[
    "<item_id>"
]'
```

> [!TIP]
> You can delete multiple blockItems in one API call. Make the request body an array of `blockItemId` values.

The response code should be `204`.

### Delete a list and all of its contents

> [!NOTE]
>
> There will be some delay after you delete a list before it takes effect on text analysis, usually **not more than five minutes**.

Copy the cURL command below to a text editor and make the following changes:


1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` (in the request URL) with the ID value you used in the list creation step.

```shell
curl --location --request DELETE '<endpoint>/contentsafety/text/lists/<your_list_id>?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json' \
--data-raw '{"description":"TBD"}'
```

The response code should be `204`.

## Next steps

See the API reference documentation to learn more about the APIs used in this guide.

* [Content Safety API reference](https://aka.ms/content-safety-api)
