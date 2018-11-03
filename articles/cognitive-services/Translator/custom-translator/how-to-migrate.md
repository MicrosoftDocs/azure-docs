---
title: How to migrate from Microsoft Translator Hub? - Custom Translator
titleSuffix: Azure Cognitive Services
description: How to migrate from Microsoft Translator Hub to Custom Translator.
author: rajdeep-in
manager: christw
ms.service: cognitive-services
ms.component: custom-translator
ms.date: 11/13/2018
ms.author: v-rada
ms.topic: article
#Customer intent: As a Custom Translator user, I want to understand how to migrate from Microsoft Translator Hub to Custom Translator.
---

# Manage settings

You can migrate your Microsoft Translator Hub workspace and projects to Custom Translator. Migration starts from Hub.


Following items are migrated during the process:

1.	The Project(s) definitions.

2.	The Training definition will be used to create a new model definition on Custom Translator.

3.	The Parallel and Monolingual files used within the trainings will all be migrated as new Documents in Custom Translator.

4.	The auto-generated System Test and Tuning data will be exported and created as new Documents in Custom Translator.

For all deployed trainings, Custom Translator will train the model without any cost. You have the option manually deploy them.

For all successful trainings, which are not deployed, they will be migrated as draft in Custom Translator.

## Migrate workspace

When you migrate your complete Hub workspace to Custom translator, your projects, documents, and trainings get migrated to Custom translator. Before migration, you have to choose if you want to migrate only deployed trainings or you want to migrate all of your successful trainings.

To migrate a workspace:

1.	Sign in to Microsoft Translator Hub

2.	Go to Settings page

3.	On settings page click Migrate Workspace data to Custom Translator
    ![How to migrate from Hub](media/how-to/how-to-migrate-workspace-from-hub.png)

4.	On the next page select either of these two options:

    a.	Deployed Trainings only: Selecting this option will migrate only your deployed systems and related documents. 

    b.	All Successful Trainings: Selecting this option will migrate all your successful trainings and related documents.

    c.	Enter your destination Workspace ID in Custom Translator

    ![How to migrate from Hub](media/how-to/how-to-migrate-from-hub-screen.png)

5.	Click Submit Request. 

## Migrate project

If you want to migrate your projects selectively, Microsoft Translator Hub gives you that ability.

To migrate a project:

1.	Sign in to Microsoft Translator Hub

2.	Go to Projects page

3.	Click Migrate link for appropriate project

    ![How to migrate from Hub](media/how-to/how-to-migrate-from-hub.png)

4.	On the next page select either of these two options:

    a.	Deployed Trainings only: Selecting this option will migrate only your deployed systems and related documents. 

    b.	All Successful Trainings: Selecting this option will migrate all your successful trainings and related documents.

    c.	Enter your destination Workspace ID in Custom Translator

    ![How to migrate from Hub](media/how-to/how-to-migrate-from-hub-screen.png)

5.	Click Submit Request. 

## Find destination Workspace ID

You will find your destination Workspace ID on the Settings page in Custom Translator

1.	Go to Setting page in the Custom Translator portal. 

2.	You will find the Workspace ID in the Basic Information section

![How to find destination workspace ID](media/how-to/how-to-find-destination-ws-id.png)

## Migration History

When you have requested Workspace/ Project migration from Hub, you’ll find your migration history in Custom Translator Settings page.

1.	Go to Setting page in the Custom Translator portal.

2.	In the Migration History section of the Settings page, click Migration History.

    ![Migration history](media/how-to/how-to-migration-history.png)

Migration History page displays following information as summary for every migration you requested.

1.	Migrated By: Name and email of the user submitted this migration request

2.	Migrated On: Date and time stamp of the migration
3.	Projects: Number of projects requested for migration v/s number of projects successfully migrated. 

4.	Trainings: Number of trainings requested for migration v/s number of trainings successfully migrated.

5.	Documents: The number of documents requested for migration v/s number of documents successfully migrated.

    ![Migration history details](media/how-to/how-to-migration-history-details.png)

If you want more detailed migration report about your projects, trainings and documents, you have option export details as CSV.
