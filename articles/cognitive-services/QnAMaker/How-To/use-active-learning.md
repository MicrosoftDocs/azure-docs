---
title: Improve knowledge base - QnA Maker
description: Improve the quality of your knowledge base with active learning. Review, accept or reject, add without removing or changing existing questions.
ms.topic: conceptual
ms.date: 03/18/2020
---

# Use active learning to improve your knowledge base

[Active learning](../Concepts/active-learning-suggestions.md) allows you to improve the quality of your knowledge base by suggesting alternative questions. User-submissions are taken into consideration and shows up as suggestions in the alternate questions list. You have the flexibility to either add those suggestions as alternate questions or reject them.

Your knowledge base doesn't change automatically. In order for any change to take effect, you must accept the suggestions. These suggestions add questions but don't change or remove existing questions.


## Upgrade runtime version to use active learning

Active Learning is supported in runtime version 4.4.0 and above. If your knowledge base was created on an earlier version, [upgrade your runtime](set-up-qnamaker-service-azure.md#get-the-latest-runtime-updates) to use this feature.

## Turn on active learning for alternate questions

Active learning is off by default. Turn it on to see suggested questions. After you turn on active learning, you need to send information from the client app to QnA Maker. For more information, see [Architectural flow for using GenerateAnswer and Train APIs from a bot](improve-knowledge-base.md#architectural-flow-for-using-generateanswer-and-train-apis-from-a-bot).

1. Select **Publish** to publish the knowledge base. Active learning queries are collected from the GenerateAnswer API prediction endpoint only. The queries to the Test pane in the QnA Maker portal do not impact active learning.

1. To turn active learning on in the QnA Maker portal, go to the top-right corner, select your **Name**, go to [**Service Settings**](https://www.qnamaker.ai/UserSettings).

    ![Turn on active learning's suggested question alternatives from the Service settings page. Select your user name in the top-right menu, then select Service Settings.](../media/improve-knowledge-base/Endpoint-Keys.png)


1. Find the QnA Maker service then toggle **Active Learning**.

    > [!div class="mx-imgBorder"]
    > [![On the Service settings page, toggle on Active Learning feature. If you are not able to toggle the feature, you may need to upgrade your service.](../media/improve-knowledge-base/turn-active-learning-on-at-service-setting.png)](../media/improve-knowledge-base/turn-active-learning-on-at-service-setting.png#lightbox)

    > [!Note]
    > The exact version on the preceding image is shown as an example only. Your version may be different.

    Once **Active Learning** is enabled, the knowledge base suggests new questions at regular intervals based on user-submitted questions. You can disable **Active Learning** by toggling the setting again.

## Review suggested alternate questions

[Review alternate suggested questions](improve-knowledge-base.md) on the **Edit** page of each knowledge base.

## Next steps

> [!div class="nextstepaction"]
> [Create a knowledge base](./manage-knowledge-bases.md)