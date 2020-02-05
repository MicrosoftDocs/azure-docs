---
title: "Quickstart: Add questions and answer in QnA Maker portal"
titleSuffix: Azure Cognitive Services
description:  This quickstart shows how to add question and answer sets with metadata so your users can find the right answer to their question.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 11/22/2019
ms.author: diberry
---

# Quickstart: Add questions and answer with QnA Maker portal

Once a knowledge base is created, add question and answer sets with metadata so your users can find the right answer to their question.

The right answer is a single answer but there can be many ways a customer could ask the question that leads to that single answer.

For example, the questions in the following table are about Azure service limits, but each has to do with a different Azure service.

<a name="qna-table"></a>


|Set|Questions|Answer|Metadata|
|--|--|--|--|
|#1|`How large a knowledge base can I create?`<br><br>`What is the max size of a knowledge base?`<br><br>`How many GB of data can a knowledge base hold?` |`The size of the knowledge base depends on the SKU of Azure search you choose when creating the QnA Maker service. Read [here](https://docs.microsoft.com/azure/cognitive-services/qnamaker/tutorials/choosing-capacity-qnamaker-deployment) for more details.`|`service=qna_maker`<br>`link_in_answer=true`|
|#2|`How many knowledge bases can I have for my QnA Maker service?`<br><br>`I selected a Azure Cognitive Search tier that holds 15 knowledge bases, but I can only create 14 - what is going on?`<br><br>`What is the connection between the number of knowledge bases in my QnA Maker service and the Azure Cognitive Search service size?` |`Each knowledge base uses 1 index, and all the knowledge bases share a test index. You can have N-1 knowledge bases where N is the number of indexes your Azure Cognitive Search tier supports.`|`service=search`<br>`link_in_answer=false`|

Once metadata is added to a question-and-answer set, the client application can:

* Request answers that only match certain metadata.
* Receive all answers but post-process the answers depending on the metadata for each answer.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* A QnA Maker service
* A Knowledge base created in that QnA Maker service

Both were created in the [first quickstart](../how-to/create-knowledge-base.md).

## Sign in to the QnA Maker portal

1. Sign in to the [QnA Maker portal](https://www.qnamaker.ai).

1. Select your existing knowledge base. If you don't have a knowledge base, return to the [previous quickstart](../how-to/create-knowledge-base.md) and finish the steps to create your knowledge base.

## Add additional alternatively-phrased questions

The current knowledge base, from the [previous quickstart](../how-to/create-knowledge-base.md), has the QnA Maker troubleshooting question and answer sets. These sets were created when the URL was added to the knowledge base during the creation process.

When this URL was imported, only one question with one answer was created.

In this procedure, add additional questions.

1. From the **Edit** page, use the search textbox above the question and answer sets, to find the question `How large a knowledge base can I create?`

1. In the **Question** column, select **+ Add alternative phrasing** then add each new phrasing, provided in the following table.

    |Alternative phrasing|
    |--|
    |`What is the max size of a knowledge base?`|
    |`How many GB of data can a knowledge base hold?`|

1. Select **Save and train** to retrain the knowledge base.

1. Select **Test**, then enter a question that is close to one of the new alternative phrasings but isn't exactly the same wording:

    `What GB size can a knowledge base be?`

    The correct answer is returned in markdown format: `The size of the knowledge base depends on the SKU of Azure search you choose when creating the QnA Maker service. Read [here](https://docs.microsoft.com/azure/cognitive-services/qnamaker/tutorials/choosing-capacity-qnamaker-deployment) for more details.`

    If you select **Inspect** under the returned answer, you can see more answers met the question but not with the same high level of confidence.

    Do not add every possible combination of alternative phrasing. Turn on QnA Maker's [active learning](../how-to/improve-knowledge-base.md), this finds the alternative phrasings that will best help your knowledge base meet your users' needs.

1. Select **Test** again to close the test window.

## Add metadata to filter the answers

Adding metadata to a question and answer set allows your client application to request filtered answers. This filter is applied before the [first and second rankers](../concepts/query-knowledge-base.md#ranker-process) are applied.

1. Add the second question and answer set, without the metadata, from the [first table in this quickstart](#qna-table), then continue with the following steps.

1. Select **View options**, then select **Show metadata**.

1. For the question and answer set you just added, select **Add metadata tags**, then add name of `service` and value of `search`, `service:search`.

1. Add another metadata tags with name of `link_in_answer` and value of `false`, `link_in_answer:false`.

1. Search for the first answer in the table, `How large a knowledge base can I create?`.
1. Add metadata pairs for the same two metadata tags:

    `link_in_answer` : `true`<br>
    `server`: `qna_maker`

    You now have two questions with the same metadata tags with different values.

1. Select **Save and train** to retrain the knowledge base.

1. Select **Publish** in the top menu to go to the publish page.
1. Select the **Publish** button to publish the current knowledge base to a queryable endpoint.
1. After the knowledge base is published, select the **Curl** tab to see an example cURL command used to generate an answer from the knowledge base.
1. Copy the command to a note pad or other editable environment so you can edit the command. Edit for your own resource name, knowledge base ID and endpoint key:

    |Replace|
    |--|
    |`your-resource-name`|
    |`your-knowledge-base-id`|
    |`your-endpoint-key`|

    ```curl
    curl -X POST https://your-resource-name.azurewebsites.net/qnamaker/knowledgebases/your-knowledge-base-id/generateAnswer -H "Authorization: EndpointKey your-endpoint-key" -H "Content-type: application/json" -d "{'top':30, 'question':'size','strictFilters': [{'name':'service','value':'qna_maker'}]}"
    ```

    Notice the question is just a single word, `size`, which can return either question and answer set. The `strictFilters` array tells the response to reduce to just the `qna_maker` answers.

    [!INCLUDE [Tip for debug property to JSON request](../includes/tip-debug-json.md)]

1. The response includes only the answer that meets the filter criteria.

    The following cURL response has been formatted for readability:

    ```JSON
    {
        "answers": [
            {
                "questions": [
                    "How large a knowledge base can I create?",
                    "What is the max size of a knowledge base?",
                    "How many GB of data can a knowledge base hold?"
                ],
                "answer": "The size of the knowledge base depends on the SKU of Azure search you choose when creating the QnA Maker service. Read [here](https://docs.microsoft.com/azure/cognitive-services/qnamaker/tutorials/choosing-capacity-qnamaker-deployment)for more details.",
                "score": 68.76,
                "id": 3,
                "source": "https://docs.microsoft.com/azure/cognitive-services/qnamaker/troubleshooting",
                "metadata": [
                    {
                        "name": "link_in_answer",
                        "value": "true"
                    },
                    {
                        "name": "service",
                        "value": "qna_maker"
                    }
                ],
                "context": {
                    "isContextOnly": false,
                    "prompts": []
                }
            }
        ],
        "debugInfo": null
    }
    ```

    If there is a question and answer set that didn't meet the search term but did meet the filter, it would not be returned. Instead, the general answer `No good match found in KB.` is returned.

    Make sure to keep your metadata name and value pairs within the required limits.

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
> [Get answer with Postman or cURL](get-answer-from-knowledge-base-using-url-tool.md)