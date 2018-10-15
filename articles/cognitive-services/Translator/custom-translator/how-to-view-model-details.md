---
title: View model details - Custom Translator
titlesuffix: Azure Cognitive Services
description: Models tab under any project shows details of each model for that project.
author: rajdeep-in
manager: christw
ms.service: cognitive-services
ms.component: custom-translator
ms.date: 11/13/2018
ms.author: v-rada
ms.topic: article
#Customer intent: As a custom translator user, I want to understand how to view model details, so that I can review details of each translation model.
---

# View model details

The Models tab under any project shows details of each model for that project.

1.  Model Name: Shows the model name of a given model.

2.  Status: Shows status of a given model. Your new training will have a status
    of Submitted until it is accepted. The status will change to Data processing
    while the service evaluates the content of your documents. When the
    evaluation of your documents is complete the status will change to Running
    and you will be able the see the number of sentences that are part of the
    training, including the tuning and testing sets that are created for you
    automatically.

3.  Below are the status list.

    -  Submitted: Specifies that the backend is processing the documents.

    -  Submitted: Specifies that the training request has been submitted to the queue.

    -  TrainingQueued: Specifies that the training is being queued to MT system.

    -  Running: Specifies that the training is running in MT system.

    -  Succeeded: Specifies that the training succeeded in MT system. The user can see a BLEU score in this state.

    -  Deployed: Specifies that the successful training is submitted to MT system for deployment purpose.

    -  Undeploying: Specifies that the deployed training is undeploying.

    -  Undeployed: Specifies that the undeployment process of a training belonging to a removed project has completed successfully.

    -  Training Failed: Specifies that the training failed. If a training failure occurs, retry the training job. If the error persists, contact us. Don't delete the failed model.

    - DataProcessingFailed: Specifies that data processing has failed for one or more documents belonging to the model.

    - DeploymentFailed: Specifies that the Model deployment has failed.

    - MigratedDraft: Specifies that the Model is in draft state after migration from Hub to Custom Translator.

4.  BLEU Score: shows BLEU (Bilingual Evaluation Understudy) score of the model,
    indicating the quality of your translation system. This score tells you how
    closely the translations done by the translation system resulting from this
    training match the reference sentences in the test data set. The BLEU score appears if training is successfully complete. If training isn't complete/ failed, you wont see any BLEU score.

5.  Training Sentence count: Shows total number of sentences used as training
    set.

6.  Tuning Sentence count: Shows total number of sentences used as tuning set.

7.  Training Sentence count: Shows total number of sentences used as testing
    set.

8.  Mono Sentence count: Shows total number of sentences used as mono set.

9.  Deploy action button: For a successfully trained model, it shows “Deploy”
    button if not deployed. If a model is deployed, a “Undeploy”
    button is shown.

10. Delete: You can use this button if you want to delete the model. Deleting a
    model wont delete any of the documents used to create that model.

    ![View model details](media/how-to/ct-how-to-view-model-details.png)


[!Note] To compare consecutive trainings for the same systems, it is important to keep the tuning set and testing set constant.


## Next steps

- Review [model training details](how-to-view-model-details.md) and start analyzing your trained translation model.
