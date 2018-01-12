---
title: Visually author Azure data factories | Microsoft Docs
description: Learn how to visually author Azure Data factories
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/9/2018
ms.author: shlo

---
# Visually author data factories
With the Azure Data Factory UX experience, users can visually author and deploy resources in their data factory without writing a single line of code. This code-free interface allows you to drag and drop activities on a pipeline canvas, perform test runs, debug iteratively, and deploy & monitor your pipeline runs. You can choose to use the ADF UX tool in two ways:

1. Work directly with the Data Factory service
2. Configure VSTS Git Integration for collaboration, source control, or versioning 

## Authoring with Data Factory
Another option is to author in Data Factory mode. This approach is different from authoring through VSTS Code Repository in that there is no repository storing your changes, nor does it allow for collaboration or version control.

![Configure Data Factory](media/author-visually/configure-data-factory.png)

In Data Factory mode, there is only the 'Publish' mode and no 'Sync' mode. Any changes you make are published directly to the Data Factory service.

![Data Factory Publish](media/author-visually/data-factory-publish.png)

## Authoring with VSTS Git Integration
Authoring with VSTS Git integration allows for source control and collaboration while authoring your data factory pipelines. Users have the option to associate a data factory with a VSTS Git Account repository for source control, collaboration, and versioning etc. A single VSTS GIT account can have multiple repositories. However, a VSTS Git repository can only be associated with a single data factory. If you don't have a VSTS account and repository already, create one [here](https://docs.microsoft.com/en-us/vsts/accounts/create-account-msa-or-work-student).

### Configure VSTS Git Repo with Azure Data Factory
Users can configure a VSTS GIT repo with a data factory through two methods.

#### Method 1: 'Let's get started' Page

Go to the 'Let's get started' page and click 'Configure Code Repository'

![Configure Code Repository](media/author-visually/configure-repo.png)

From there, a side panel appears for configuring the repository settings.

![Configure Repository Settings](media/author-visually/repo-settings.png)
* **Repository Type**: Visual Studio Team Services Git (Currently, Github is not supported.)
* **Visual Studio Team Services Account**: The account name can be found from https://{account name}.visualstudio.com. Sign in to your VSTS account [here](https://www.visualstudio.com/team-services/git/) and access your Visual Studio profile to see your repositories and projects
* **ProjectName:** The project name can be found from https://{account name}.visualstudio.com/{project name}
* **RepositoryName:** The repository name. VSTS projects contain Git repositories to manage your source code as your project grows. Either create a new repository or use an existing repository already in the project.
* **Import existing Data Factory resources to repository**: By checking this box, you can import your current data factory resources authored on the UX canvas to the associated VSTS GIT repository in JSON format. This action exports each resource individually (that is, linked services and datasets are exported into separate JSONs).    If you clear this check box, the existing resources are not imported into the Git repository. 

#### Method 2: From Authoring Canvas

In the  'Authoring canvas', click the 'Data Factory' drop-down menu under your data factory name. Then, click 'Configure Code Repository.' Similar to **Method 1**, a side panel appears for configuring the repository settings. See the previous sections for information about the settings.

![Configure Code Repository 2](media/author-visually/configure-repo-2.png)

### Version Control
Version control, also referred to as source control, systems allow developers to collaborate on code and track changes made to the code base. Source control is an essential tool for multi-developer projects.

Each VSTS Git repository once associated with a data factory has a master branch. From there, every user who has access to the VSTS Git repository has two options when making changes: sync and publish.

![Sync Publish](media/author-visually/sync-publish.png)

#### Sync

Once you click 'sync', you can pull changes from the master branch to your local branch, or push changes from your local branch to the master branch.

![Syncing Changes](media/author-visually/sync-change.png)

#### Publish
 Publish changes in master branch to Data Factory service.

> [!NOTE]
> The **master branch is not representative of what's deployed in the Data Factory service.** The master branch *must* be published manually to the Data Factory service.




## Expression Language

Users can specify expressions in defining property values by using the expression language supported by Azure Data Factory. See [Expressions and functions in Azure Data Factory](control-flow-expression-language-functions.md) for more about which expressions are supported.

Specify expressions in property values in the UX like so.

![Expression Language](media/author-visually/expression-language.png)

## Parameters
Users can specify parameters for Pipelines and Datasets, in the 'Parameters' tab. In addition, utilize parameters in properties easily by pressing "Add Dynamic Content."

![Dynamic Content](media/author-visually/dynamic-content.png)

From there, you can either utilize an existing parameter or specify a new parameter in your property value.

![Parameters](media/author-visually/parameters.png)

## Feedback
Click on the 'Feedback' icon to give us (Microsoft) feedback on various features or any issues that you might be facing.

![Feedback](media/monitor-visually/feedback.png)

## Next steps

To learn about monitoring and managing pipelines, see  [Monitor and manage pipelines programmatically](monitor-programmatically.md) article 