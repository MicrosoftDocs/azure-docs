---
title: System test results in Custom Translator
titlesuffix: Azure Cognitive Services
description: System test results in Custom Translator
author: rajdeep-in
manager: christw
ms.service: cognitive-services
ms.component: custom-translator
ms.date: 10/15/2018
ms.author: v-rada
ms.topic: how to edit a model
Customer intent: As a custom translator user, I want to understand how to view system test results, so that I can start using the feature.
---

# View system test results

The test detail tab shows you,

1.  System Test Results: The result of the test process in the trainings. The test process produces the BLEU score.

    -  Sentence Count: How many parallel sentences were used in the test set

    -  BLEU Score: BLEU score generated for a model after training completion

    -  Status: If the test process is complete or in progress

        ![System test results](media/how-to/ct-how-to-system-test-results.png)

2.  Click on the “System test results”, and that will take you to test result details page. This page shows the machine translation of sentences that were part of the test dataset.

3.  The table on the test result details page has two columns - one for each
    language in the pair. The column for the source language shows the sentence
    to be translated. The column for the target language contains two sentences
    in each row.

    -  Ref: This sentence is the reference translation of the source sentence as given in the test dataset.

    -  MT: This sentence is the automatic translation of the source sentence done by the model built after the training was conducted.

        ![System test results compare](media/how-to/ct-how-to-system-test-results-2.png)


## Download test

Click the Download Translations link to download a zip file. The zip contains the
machine translations of source sentences in the test data set.

![Download test](media/how-to/ct-how-to-system-test-download.png)

This zip file contains three files.

1.  custom.mt.txt: Contains machine translations of source language sentences in
    the target language done by the model trained with user’s data.

2.  ref.txt: Contains user provided translations of source language sentences in
    the target language.

3.  Src_Dataset_source.txt: Contains sentences in the source language.

    ![Downloaded system test results](media/how-to/ct-how-to-download-system-test.png)

## Next steps

- Read about [deploy model](how-to-deploy-or-undeploy-model.md).
