---
title: Active learning suggestions - QnA Maker
description: Active learning suggestions allows you to improve the quality of your knowledge base by suggesting alternative questions, based on user-submissions, to your question and answer pair.
ms.topic: conceptual
ms.date: 03/19/2020
---
# Active learning suggestions

The _Active learning suggestions_ feature allows you to improve the quality of your knowledge base by suggesting alternative questions, based on user-submissions, to your question and answer pair. You review those suggestions, either adding them to existing questions or rejecting them.

Your knowledge base doesn't change automatically. In order for any change to take effect, you must accept the suggestions. These suggestions add questions but don't change or remove existing questions.

## What is active learning?

QnA Maker learns new question variations with implicit and explicit feedback.

* [Implicit feedback](#how-qna-makers-implicit-feedback-works) – The ranker understands when a user question has multiple answers with scores that are very close and considers this as feedback. You don't need to do anything for this to happen.
* [Explicit feedback](#how-you-give-explicit-feedback-with-the-train-api) – When multiple answers with little variation in scores are returned from the knowledge base, the client application asks the user which question is the correct question. The user's explicit feedback is sent to QnA Maker with the [Train API](../How-to/improve-knowledge-base.md#train-api).

Both methods provide the ranker with similar queries that are clustered.

## How active learning works

Active learning is triggered based on the scores of the top few answers returned by QnA Maker. If the score differences between QnA pairs that match the query lie within a small range, then the query is considered a possible suggestion (as an alternate question) for each of the possible QnA pairs. Once you accept the suggested question for a specific QnA pair, it is rejected for the other pairs. You need to remember to save and train, after accepting suggestions.

Active learning gives the best possible suggestions in cases where the endpoints are getting a reasonable quantity and variety of usage queries. When 5 or more similar queries are clustered, every 30 minutes, QnA Maker suggests the user-based questions to the knowledge base designer to accept or reject. All the suggestions are clustered together by similarity and top suggestions for alternate questions are displayed based on the frequency of the particular queries by end users.

Once questions are suggested in the QnA Maker portal, you need to review and accept or reject those suggestions. There isn't an API to manage suggestions.

## Turn on active learning

By default, active learning is **off**.
To use active learning:
* You need to [turn on active learning](../How-To/use-active-learning.md#turn-on-active-learning-for-alternate-questions) so that QnA Maker collects alternate questions for your knowledge base.
* To see the suggested alternate questions, [use View options](../How-To/improve-knowledge-base.md#view-suggested-questions) on the Edit page.

## How QnA Maker's implicit feedback works

QnA Maker's implicit feedback uses an algorithm to determine score proximity then makes active learning suggestions. The algorithm to determine proximity is not a simple calculation. The ranges in the following example are not meant to be fixed but should be used as a guide to understand the impact of the algorithm only.

When a question's score is highly confident, such as 80%, the range of scores that are considered for active learning are wide, approximately within 10%. As the confidence score decreases, such as 40%, the range of scores decreases as well, approximately within 4%.

In the following JSON response from a query to QnA Maker's generateAnswer, the scores for A, B, and C are near and would be considered as suggestions.

```json
{
  "activeLearningEnabled": true,
  "answers": [
    {
      "questions": [
        "Q1"
      ],
      "answer": "A1",
      "score": 80,
      "id": 15,
      "source": "Editorial",
      "metadata": [
        {
          "name": "topic",
          "value": "value"
        }
      ]
    },
    {
      "questions": [
        "Q2"
      ],
      "answer": "A2",
      "score": 78,
      "id": 16,
      "source": "Editorial",
      "metadata": [
        {
          "name": "topic",
          "value": "value"
        }
      ]
    },
    {
      "questions": [
        "Q3"
      ],
      "answer": "A3",
      "score": 75,
      "id": 17,
      "source": "Editorial",
      "metadata": [
        {
          "name": "topic",
          "value": "value"
        }
      ]
    },
    {
      "questions": [
        "Q4"
      ],
      "answer": "A4",
      "score": 50,
      "id": 18,
      "source": "Editorial",
      "metadata": [
        {
          "name": "topic",
          "value": "value"
        }
      ]
    }
  ]
}
```

QnA Maker won't know which answer is the best answer. Use the QnA Maker portal's list of suggestions to select the best answer and train again.


## How you give explicit feedback with the Train API

QnA Maker needs explicit feedback about which of the answers was the best answer. How the best answer is determined is up to you and can include:

* User feedback, selecting one of the answers.
* Business logic, such as determining an acceptable score range.
* A combination of both user feedback and business logic.

Use the [Train API](https://docs.microsoft.com/rest/api/cognitiveservices/qnamakerruntime/runtime/train) to send the correct answer to QnA Maker, after the user selects it.

## Next step

> [!div class="nextstepaction"]
> [Query the knowledge base](query-knowledge-base.md)