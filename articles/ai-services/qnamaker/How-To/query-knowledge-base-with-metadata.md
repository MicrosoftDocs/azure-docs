---
title: Contextually filter by using metadata
titleSuffix: Azure AI services
description: QnA Maker filters QnA pairs by metadata.
#services: cognitive-services
manager: nitinme
ms.author: jboback
author: jboback
ms.service: azure-ai-language
ms.subservice: azure-ai-qna-maker
ms.topic: how-to
ms.date: 12/19/2023
ms.custom: ignite-fall-2021
---

# Filter Responses with Metadata

QnA Maker lets you add metadata, in the form of key and value pairs, to your pairs of questions and answers. You can then use this information to filter results to user queries, and to store additional information that can be used in follow-up conversations.

[!INCLUDE [Custom question answering](../includes/new-version.md)]

<a name="qna-entity"></a>

## Store questions and answers with a QnA entity

It's important to understand how QnA Maker stores the question and answer data. The following illustration shows a QnA entity:

![Illustration of a QnA entity](../media/qnamaker-how-to-metadata-usage/qna-entity.png)

Each QnA entity has a unique and persistent ID. You can use the ID to make updates to a particular QnA entity.

## Use metadata to filter answers by custom metadata tags

Adding metadata allows you to filter the answers by these metadata tags. Add the metadata column from the **View Options** menu. Add metadata to your knowledge base by selecting the metadata **+** icon to add a metadata pair. This pair consists of one key and one value.

![Screenshot of adding metadata](../media/qnamaker-how-to-metadata-usage/add-metadata.png)

<a name="filter-results-with-strictfilters-for-metadata-tags"></a>

## Filter results with strictFilters for metadata tags

Consider the user question "When does this hotel close?", where the intent is implied for the restaurant "Paradise."

Because results are required only for the restaurant "Paradise", you can set a filter in the GenerateAnswer call on the metadata "Restaurant Name". The following example shows this:

```json
{
    "question": "When does this hotel close?",
    "top": 1,
    "strictFilters": [ { "name": "restaurant", "value": "paradise"}]
}
```

## Filter by source

In case you have multiple content sources in your knowledge base and you would like to limit the results to a particular set of sources, you can do that using the reserved keyword `source_name_metadata` as shown below.

```json
"strictFilters": [
    {
        "name": "category",
        "value": "api"
    },
   {
        "name": "source_name_metadata",
        "value": "boby_brown_docx"
    },
   {
        "name": "source_name_metadata",
        "value": "chitchat.tsv"
   }
]
```

---

### Logical AND by default

To combine several metadata filters in the query, add the additional metadata filters to the array of the `strictFilters` property. By default, the values are logically combined (AND). A logical combination requires all filters to matches the QnA pairs in order for the pair to be returned in the answer.

This is equivalent to using the `strictFiltersCompoundOperationType` property with the value of `AND`.

### Logical OR using strictFiltersCompoundOperationType property

When combining several metadata filters, if you are only concerned with one or some of the filters matching, use the `strictFiltersCompoundOperationType` property with the value of `OR`.

This allows your knowledge base to return answers when any filter matches but won't return answers that have no metadata.

```json
{
    "question": "When do facilities in this hotel close?",
    "top": 1,
    "strictFilters": [
      { "name": "type","value": "restaurant"},
      { "name": "type", "value": "bar"},
      { "name": "type", "value": "poolbar"}
    ],
    "strictFiltersCompoundOperationType": "OR"
}
```

### Metadata examples in quickstarts

Learn more about metadata in the QnA Maker portal quickstart for metadata:
* [Authoring - add metadata to QnA pair](../quickstarts/add-question-metadata-portal.md#add-metadata-to-filter-the-answers)
* [Query prediction - filter answers by metadata](../quickstarts/get-answer-from-knowledge-base-using-url-tool.md)

<a name="keep-context"></a>

## Use question and answer results to keep conversation context

The response to the GenerateAnswer contains the corresponding metadata information of the matched question and answer pair. You can use this information in your client application to store the context of the previous conversation for use in later conversations.

```json
{
    "answers": [
        {
            "questions": [
                "What is the closing time?"
            ],
            "answer": "10.30 PM",
            "score": 100,
            "id": 1,
            "source": "Editorial",
            "metadata": [
                {
                    "name": "restaurant",
                    "value": "paradise"
                },
                {
                    "name": "location",
                    "value": "secunderabad"
                }
            ]
        }
    ]
}
```

## Next steps

> [!div class="nextstepaction"]
> [Analyze your knowledgebase](../How-to/get-analytics-knowledge-base.md)
