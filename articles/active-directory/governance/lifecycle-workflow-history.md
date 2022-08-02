---
title: Lifecycle Workflow History
description: Conceptual article about Lifecycle Workflows reporting and history capabilities
author: owinfreyATL
ms.author: owinfrey
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual 
ms.date: 08/01/2022
ms.custom: template-concept 
---

<!--Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->

<!--
This template provides the basic structure of a concept article.
See the [concept guidance](contribute-how-write-concept.md) in the contributor guide.

To provide feedback on this template contact 
[the templates workgroup](mailto:templateswg@microsoft.com).
-->

<!-- 1. H1
Required. Set expectations for what the content covers, so customers know the 
content meets their needs. Should NOT begin with a verb.
-->

# Lifecycle Workflow History

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes what the article covers. Answer the 
fundamental “why would I want to know this?” question. Keep it short.
-->

Workflows created using Lifecycle Workflows allow for the automation of lifecycle task for users no matter where they fall in the Joiner-Mover-Leaver (JML) model of their identity lifecycle in your organization. After these workflows are processed, making sure they ran correctly becomes an important part of managing the users you ran the workflows for. Workflows that are not processed correctly for users can lead to many issues in terms of security and compliance. To make sure you always know who was processed in workflows you run, Lifecycle Workflows introduces the reporting features of runs and user summary. In this article you will learn the difference between the two, and when you would use each when getting more information about how your workflows were utilized for users in your organization.



## Lifecycle Workflows User Summary

When looking at the history of your workflow, Lifecycle Workflows allow you to view user summaries. User summaries are useful in the fact that they give information about who a workflow ran for, and whether or not the workflow and its tasks were successful in processing for specific users.

### Basic User Summary Information

On the user summary page you are able to see a general summary of users processed.
:::image type="content" source="media/lifecycle-workflow-history/lcw-user-summary-concept.png" alt-text="user summary page":::

The cards at the top of the history page for users give you a summary in count form. These are:


|Column1  |Column2  |
|---------|---------|
|Total Processed     | The total number of users processed by the workflow. Includes both failed and successful task processing.         |
|Successful     |  The total number of successfully processed users by a workflow. A user successfully processed by a workflow does not mean every task was successful for a user. As long as one task was successful it will be noted here.      |
|Failed     | The total number of failed processed for users.        |
|Total tasks     | The total number tasks processed for users.        |
|Failed tasks     | The total number of failed tasks for users.        |

Separating processing of the workflow from the tasks is important because in a workflow processing a user certain tasks could be successful, while others could fail. It would all depend on whether or not the failed tasks is set to continue on error if it comes before other tasks in the workflow.

## Lifecycle Workflow Runs
<!-- add your content here -->

## [Section n heading]
<!-- add your content here -->

<!-- 4. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links -->
- [Write concepts](contribute-how-to-write-concept.md)
- [Links](links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
