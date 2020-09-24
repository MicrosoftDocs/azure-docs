---
title: "Quickstart: Add questions and answer in QnA Maker portal"
description:  This quickstart shows how to add question and answer pairs with metadata so your users can find the right answer to their question.
ms.topic: quickstart
ms.date: 05/26/2020
---

# Quickstart: Add questions and answer with QnA Maker portal

Once a knowledge base is created, add question and answer (QnA) pairs with metadata to filter the answer. The questions in the following table are about Azure service limits, but each has to do with a different Azure search service.

<a name="qna-table"></a>

|Pair|Questions|Answer|Metadata|
|--|--|--|--|
|#1|`How large a knowledge base can I create?`<br><br>`What is the max size of a knowledge base?`<br><br>`How many GB of data can a knowledge base hold?` |`The size of the knowledge base depends on the SKU of Azure search you choose when creating the QnA Maker service. Read [here](https://docs.microsoft.com/azure/cognitive-services/qnamaker/tutorials/choosing-capacity-qnamaker-deployment) for more details.`|`service=qna_maker`<br>`link_in_answer=true`|
|#2|`How many knowledge bases can I have for my QnA Maker service?`<br><br>`I selected a Azure Cognitive Search tier that holds 15 knowledge bases, but I can only create 14 - what is going on?`<br><br>`What is the connection between the number of knowledge bases in my QnA Maker service and the Azure Cognitive Search service size?` |`Each knowledge base uses 1 index, and all the knowledge bases share a test index. You can have N-1 knowledge bases where N is the number of indexes your Azure Cognitive Search tier supports.`|`service=search`<br>`link_in_answer=false`|

Once metadata is added to a QnA pair, the client application can:

* Request answers that only match certain metadata.
* Receive all answers but post-process the answers depending on the metadata for each answer.


## Prerequisites

* Complete the [previous quickstart](./create-publish-knowledge-base.md)

## Sign in to the QnA Maker portal

1. Sign in to the [QnA Maker portal](https://www.qnamaker.ai).

1. Select your existing knowledge base from the [previous quickstart](../how-to/create-knowledge-base.md).

## Add additional alternatively-phrased questions

The current knowledge base has the QnA Maker troubleshooting QnA pairs. These pairs were created when the URL was added to the knowledge base during the creation process.

When this URL was imported, only one question with one answer was created. In this procedure, add additional questions.

1. From the **Edit** page, use the search textbox above the question and answer pairs, to find the question `How large a knowledge base can I create?`

1. In the **Question** column, select **+ Add alternative phrasing** then add each new phrasing, provided in the following table.

    |Alternative phrasing|
    |--|
    |`What is the max size of a knowledge base?`|
    |`How many GB of data can a knowledge base hold?`|

1. Select **Save and train** to retrain the knowledge base.

1. Select **Test**, then enter a question that is close to one of the new alternative phrasings but isn't exactly the same wording:

    `What GB size can a knowledge base be?`

    The correct answer is returned in markdown format:

    `The size of the knowledge base depends on the SKU of Azure search you choose when creating the QnA Maker service. Read [here](https://docs.microsoft.com/azure/cognitive-services/qnamaker/tutorials/choosing-capacity-qnamaker-deployment) for more details.`

    If you select **Inspect** under the returned answer, you can see more answers met the question but not with the same high level of confidence.

    Do not add every possible combination of alternative phrasing. When you turn on QnA Maker's [active learning](../how-to/improve-knowledge-base.md), this finds the alternative phrasings that will best help your knowledge base meet your users' needs.

1. Select **Test** again to close the test window.

## Add metadata to filter the answers

Adding metadata to a question and answer pair allows your client application to request filtered answers. This filter is applied before the [first and second rankers](../concepts/query-knowledge-base.md#ranker-process) are applied.

1. Add the second question and answer pair, without the metadata, from the [first table in this quickstart](#qna-table), then continue with the following steps.

1. Select **View options**, then select **Show metadata**.

1. For the QnA pair you just added, select **Add metadata tags**, then add the name of `service` and the value of `search`. It looks like this: `service:search`.

1. Add another metadata tag with name of `link_in_answer` and value of `false`. It looks like this: `link_in_answer:false`.

1. Search for the first answer in the table, `How large a knowledge base can I create?`.

1. Add metadata pairs for the same two metadata tags:

    `link_in_answer` : `true`<br>
    `service`: `qna_maker`

    You now have two questions with the same metadata tags with different values.

1. Select **Save and train** to retrain the knowledge base.

1. Select **Publish** in the top menu to go to the publish page.
1. Select the **Publish** button to publish the current knowledge base to the endpoint.
1. After the knowledge base is published, continue to the next quickstart to learn how to generate an answer from your knowledge base.

## What did you accomplish?

You edited your knowledge base to support more questions and provided name/value pairs to support filtering during the search for the top answer or postprocessing, after the answer or answers are returned.

## Clean up resources

If you are not continuing to the next quickstart, delete the QnA Maker and Bot framework resources in the Azure portal.

## Next steps

> [!div class="nextstepaction"]
> [Get answer with Postman or cURL](get-answer-from-knowledge-base-using-url-tool.md)
