---
title: Project lifecycle - question answering
description: Question answering learns best in an iterative cycle of model changes, utterance examples, deployment, and gathering data from endpoint queries.
ms.service: cognitive-services
ms.subservice: language-service
author: jboback
ms.author: jboback
ms.topic: conceptual
ms.date: 06/03/2022
---

# Question answering project lifecycle

Question answering learns best in an iterative cycle of model changes, utterance examples, deployment, and gathering data from endpoint queries.

## Creating a project

Question answering projects provide a best-match answer to a user query based on the content of the project. Creating a project is a one-time action to setting up a content repository of questions, answers, and associated metadata. A project can be created by crawling pre-existing content such the following sources:

- FAQ pages
- Product manuals
- Q-A pairs

Learn how to [create a project](../how-to/create-test-deploy.md).

## Testing and updating your project

The project is ready for testing once it is populated with content, either editorially or through automatic extraction. Interactive testing can be done in Language Studio, in the custom question answering menu through the **Test** panel. You enter common user queries. Then you verify that the responses returned with both the correct response and a sufficient confidence score.

* **To fix low confidence scores**: add alternate questions.
* **When a query incorrectly returns the [default response](../How-to/change-default-answer.md)**: add new answers to the correct question.

This tight loop of test-update continues until you are satisfied with the results.

## Deploy your project

Once you are done testing the project, you can deploy it to production. Deployment pushes the latest version of the tested project to a dedicated Azure Cognitive Search index representing the **published** project. It also creates an endpoint that can be called in your application or chat bot.

Due to the deployment action, any further changes made to the test version of the project leave the published version unaffected. The published version can be live in a production application.

Each of these projects can be targeted for testing separately.

## Monitor usage

To be able to log the chat logs of your service and get additional analytics, you would need to enable [Azure Monitor Diagnostic Logs](../how-to/analytics.md) after you create your language resource.

Based on what you learn from your analytics, make appropriate updates to your project.

## Version control for data in your project

Version control for data is provided through the import/export features on the project page in the question answering section of Language Studio.

You can back up a project by exporting the project, in either `.tsv` or `.xls` format. Once exported, include this file as part of your regular source control check.

When you need to go back to a specific version, you need to import that file from your local system. An exported  **must** only be used via import on the project page. It can't be used as a file or URL document data source. This will replace questions and answers currently in the project with the contents of the imported file.

## Test and production project

A project is the repository of questions and answer sets created, maintained, and used through question answering. Each language resource can hold multiple projects.

A project has two states: *test* and *published*.

### Test project

The *test project* is the version currently edited and saved. The test version has been tested for accuracy, and for completeness of responses. Changes made to the test project don't affect the end user of your application or chat bot. The test project is known as `test` in the HTTP request. The `test` knowledge is available with Language Studio's interactive **Test** pane.

### Production project

The *published project* is the version that's used in your chat bot or application. Publishing a project puts the content of its test version into its published version. The published project is the version that the application uses through the endpoint. Make sure that the content is correct and well tested. The published project is known as `prod` in the HTTP request.

## Next steps

