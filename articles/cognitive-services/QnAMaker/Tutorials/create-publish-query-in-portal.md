---
title: "Tutorial: Create, publish, answer from knowledge base in QnA Maker portal"
titleSuffix: Azure Cognitive Services 
description: This portal-based tutorial walks you through programmatically creating and publishing a knowledge base, then answering a question from the knowledge base.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.technology: qna-maker
ms.topic: tutorial
ms.date: 10/29/2018
ms.author: diberry
#Customer intent: As an model designer, new to the QnA Maker service, I want to understand all the process requirements to create a knowledge base and generate an answer from that knowledge base. 
---

# Tutorial: Create a knowledge base then answer question via the QnA Maker portal

This tutorial walks you through creating and publishing a knowledge base, then answering a question from the knowledge base.

In this tutorial, you learn how to: 

> [!div class="checklist"]
* Create a knowledge base in the QnA Maker portal
* Review, save, and train the knowledge base
* Publish the knowledge base
* Use Curl to query the knowledge base

> [!NOTE] 
> The programmatic version of this tutorial is available with a complete solution from the [**Azure-Samples/cognitive-services-qnamaker-csharp** Github repository](https://github.com/Azure-Samples/cognitive-services-qnamaker-csharp/tree/master/documentation-samples/tutorials/create-publish-answer-knowledge-base).

## Prerequisites

This tutorial requires an existing [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). 

## Create a knowledge base 

1. Sign in to the [QnA Maker](https://www.qnamaker.ai) portal. 

1. Select **Create a knowledge base** from the top menu.

    ![Step 1 of KB Creation process](../media/qnamaker-tutorial-create-publish-query-in-portal/create-kb-step-1.png)

1. Skip the first step because you will use your existing QnA Maker service. 

1. In the next step, select your existing settings:  

    |Setting|Purpose|
    |--|--|
    |Microsoft Azure Directory Id|Your _Microsoft Azure Directory Id_ is associated with the account you use to sign into the Azure portal and the QnA Maker portal. |
    |Azure Subscription name|Your billing account you created the QnA Maker resource in.|
    |Azure QnA Service|Your existing QnA Maker resource.|

    ![Step 2 of KB Creation process](../media/qnamaker-tutorial-create-publish-query-in-portal/create-kb-step-2.png)

1. In the next step, Enter your knowledge base name, `My Tutorial kb`.

    ![Step 3 of KB Creation process](../media/qnamaker-tutorial-create-publish-query-in-portal/create-kb-step-3.png)

1. In the next step, populate your kb with the following settings:  

    |Setting name|Setting value|Purpose|
    |--|--|--|
    |URL|`https://docs.microsoft.com/azure/cognitive-services/qnamaker/faqs` |The contents of the FAQ at that URL are formatted with a question followed by an answer. QnA Maker can interpret this format to extract questions and the associated answers.|
    |File |_not used in this tutorial_|This uploads files for questions and answers. |
    |Chit-chat personality|The friend|This gives a friendly and casual personality to common questions and answers. You can edit these questions and answers later. |

    ![Step 4 of KB Creation process](../media/qnamaker-tutorial-create-publish-query-in-portal/create-kb-step-4.png)

1. Select **Create your KB** to finish the creation process.

    ![Step 5 of KB Creation process](../media/qnamaker-tutorial-create-publish-query-in-portal/create-kb-step-5.png)

## Review KB, save, and train

1. Review the questions and answers. The first page is questions and answers from the URL. 

    ![Save and train](../media/qnamaker-tutorial-create-publish-query-in-portal/save-and-train-kb.png)

1. Select the last page of questions and answers from the bottom of the table. The page shows questions and answers from the Chit-chat personality. 

1. From the toolbar above the list of questions and answers, select the gear. This shows the filters for each question and answer. The Chit-chat questions have the **editorial: chit-chat** filter already set. This filter is returned to the client application along with the selected answer. The client application, such as a chat bot, can use this filter to determine additional processing or interactions with the user.

    ![View filters](../media/qnamaker-tutorial-create-publish-query-in-portal/save-and-train-kb-chit-chat.png)

1. Select **Save and train** in the top menu bar.

## Publish to get KB endpoints

Select the **Publish** button from the top menu. Once you are on the publish page, select **Publish**, next to the **Cancel** button.

![Publish](../media/qnamaker-tutorial-create-publish-query-in-portal/publish-1.png)

After the KB is published, the endpoint is displayed

![Publish](../media/qnamaker-tutorial-create-publish-query-in-portal/publish-2.png)

## Use curl to query for an FAQ answer

1. Select the **Curl** tab. 

    ![Curl command](../media/qnamaker-tutorial-create-publish-query-in-portal/publish-3-curl.png)

1. Copy the text of the **Curl** tab and execute in a Curl-enabled terminal or command-line. The authorization header's value includes the text `Endpoint ` with a trailing space then the key.

1. Replace `<Your question>` with `How large can my KB be?`. This is close to the question, `How large a knowledge base can I create?`, but not exactly the same. QnA Maker applies natural language processing to determine that the two questions are the same.     

1. Execute the CURL command and receive the JSON response including the score and answer. 

    ```TXT
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100   581  100   543  100    38    418     29  0:00:01  0:00:01 --:--:--   447{
      "answers": [
        {
          "questions": [
            "How large a knowledge base can I create?"
          ],
          "answer": "The size of the knowledge base depends on the SKU of Azure search you choose when creating the QnA Maker service. Read [here](https://docs.microsoft.com/azure/cognitive-services/qnamaker/tutorials/choosing-capacity-qnamaker-deployment)for more details.",
          "score": 42.81,
          "id": 2,
          "source": "https://docs.microsoft.com/azure/cognitive-services/qnamaker/faqs",
          "metadata": []
        }
      ]
    }
    
    ```

    QnA Maker is somewhat confident with the score of 42.81%.  

## Use curl to query for a Chit-chat answer

1. In the Curl-enabled terminal, replace `How large can my KB be?` with an bot conversation-ending statement from the user, such as `Thank you`.   

1. Execute the CURL command and receive the JSON response including the score and answer. 

    ```TXT
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100   525  100   501  100    24    525     25 --:--:-- --:--:-- --:--:--   550{
      "answers": [
        {
          "questions": [
            "Thank you",
            "Thanks",
            "Thnx",
            "Kthx",
            "I appreciate it",
            "Thank you so much",
            "I thank you",
            "My sincere thank"
          ],
          "answer": "You're very welcome.",
          "score": 100.0,
          "id": 109,
          "source": "qna_chitchat_the_friend.tsv",
          "metadata": [
            {
              "name": "editorial",
              "value": "chitchat"
            }
          ]
        }
      ]
    }
   
    ```

    Because the question of `Thank you` exactly matched a Chit-chat question, QnA Maker is completely confident with the score of 100. QnA Maker also returned all the related questions as well as the metadata property containing the Chit-chat filter information.  

## Use curl to query for the default answer

Any question that QnA Maker is not confident in an answer receives the default answer. This answer is configured in the Azure portal. 

1. In the Curl-enabled terminal, replace `Thank you` with `x`. 

1. Execute the CURL command and receive the JSON response including the score and answer. 

    ```TXT
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100   186  100   170  100    16    272     25 --:--:-- --:--:-- --:--:--   297{
      "answers": [
        {
          "questions": [],
          "answer": "No good match found in KB.",
          "score": 0.0,
          "id": -1,
          "metadata": []
        }
      ]
    }
    ```
    
    QnA Maker returned a score of 0 which means no confidence but it also returned the default answer. 

## Next steps

See [Data sources supported](../Concepts/data-sources-supported.md) for more information about support file formats. 

Learn more about Chit-chat [personalities](../Concepts/best-practices.md#chit-chat).

For more information about the default answer, see [No match found](../Concepts/confidence-score.md#no-match-found). 

> [!div class="nextstepaction"]
> [Knowledge base concepts](../Concepts/knowledge-base.md)