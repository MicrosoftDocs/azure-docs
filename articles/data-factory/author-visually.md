---
title: Visual authoring in Azure Data Factory | Microsoft Docs
description: Learn how to use visual authoring in Azure Data Factory
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/07/2018
ms.author: shlo

---
# Visual authoring in Azure Data Factory
The Azure Data Factory user interface experience (UX) lets you visually author and deploy resources for your data factory without having to write any code. You can drag activities to a pipeline canvas, perform test runs, debug iteratively, and deploy and monitor your pipeline runs. There are two approaches for using the UX to perform visual authoring:

- Author directly with the Data Factory service.
- Author with Visual Studio Team Services (VSTS) Git integration for collaboration, source control, or versioning.

## Author directly with the Data Factory service
Visual authoring with the Data Factory service differs from visual authoring with VSTS in two ways:

- The Data Factory service doesn't include a repository for storing the JSON entities for your changes.
- The Data Factory service isn't optimized for collaboration or version control.

![Configure the Data Factory service ](media/author-visually/configure-data-factory.png)

When you use the UX **Authoring canvas** to author directly with the Data Factory service, only the **Publish All** mode is available. Any changes that you make are published directly to the Data Factory service.

![Publish mode](media/author-visually/data-factory-publish.png)

## Author with VSTS Git integration
Visual authoring with VSTS Git integration supports source control and collaboration for work on your data factory pipelines. You can associate a data factory with a VSTS Git account repository for source control, collaboration, versioning, and so on. A single VSTS Git account can have multiple repositories, but a VSTS Git repository can be associated with only one data factory. If you don't have a VSTS account or repository, follow [these instructions](https://docs.microsoft.com/vsts/accounts/create-account-msa-or-work-student) to create your resources.

> [!NOTE]
> You can store script and data files in a VSTS GIT repository. However, you have to upload the files manually to Azure Storage. A Data Factory pipeline does not automatically upload script or data files stored in a VSTS GIT repository to Azure Storage.

### Configure a VSTS Git repository with Azure Data Factory
You can configure a VSTS GIT repository with a data factory through two methods.

#### <a name="method1"></a> Configuration method 1 (VSTS Git repo): Let's get started page

In Azure Data Factory, go to the **Let's get started** page. Select **Configure Code Repository**:

![Configure a VSTS code repository](media/author-visually/configure-repo.png)

The **Repository Settings** configuration pane appears:

![Configure the code repository settings](media/author-visually/repo-settings.png)

The pane shows the following VSTS code repository settings:

| Setting | Description | Value |
|:--- |:--- |:--- |
| **Repository Type** | The type of the VSTS code repository.<br/>**Note**: GitHub is not currently supported. | Visual Studio Team Services Git |
| **Azure Active Directory** | Your Azure AD tenant name. | <your tenant name> |
| **Visual Studio Team Services Account** | Your VSTS account name. You can locate your VSTS account name at `https://{account name}.visualstudio.com`. You can [sign in to your VSTS account](https://www.visualstudio.com/team-services/git/) to access your Visual Studio profile and see your repositories and projects. | <your account name> |
| **ProjectName** | Your VSTS project name. You can locate your VSTS project name at `https://{account name}.visualstudio.com/{project name}`. | <your VSTS project name> |
| **RepositoryName** | Your VSTS code repository name. VSTS projects contain Git repositories to manage your source code as your project grows. You can create a new repository or use an existing repository that's already in your project. | <your VSTS code repository name> |
| **Collaboration branch** | Your VSTS collaboration branch that is used for publishing. By default, it is `master`. Change this setting in case you want to publish resources from another branch. | <your collaboration branch name> |
| **Root folder** | Your root folder in your VSTS collaboration branch. | <your root folder name> |
| **Import existing Data Factory resources to repository** | Specifies whether to import existing data factory resources from the UX **Authoring canvas** into a VSTS Git repository. Select the box to import your data factory resources into the associated Git repository in JSON format. This action exports each resource individually (that is, the linked services and datasets are exported into separate JSONs). When this box isn't selected, the existing resources aren't imported. | Selected (default) |

#### Configuration method 2  (VSTS Git repo): UX authoring canvas
In the Azure Data Factory UX **Authoring canvas**, locate your data factory. Select the **Data Factory** drop-down menu, and then select **Configure Code Repository**.

A configuration pane appears. For details about the configuration settings, see the descriptions in <a href="#method1">Configuration method 1</a>.

![Configure the code repository settings for UX authoring](media/author-visually/configure-repo-2.png)

#### Switch to a different Git repo

To switch to a different Git repo, locate the icon in the upper right corner of the Data Factory overview page, as shown in the following screenshot. If you can’t see the icon, clear your local browser cache. Select the icon to remove the association with the current repo.

After you remove the association with the current repo, you can configure your Git settings to use a different repo. Then you can import existing Data Factory resources to the new repo.

![Remove the association with the current Git repo.](media/author-visually/remove-repo.png)

### Use version control
Version control systems (also known as _source control_) let developers collaborate on code and track changes that are made to the code base. Source control is an essential tool for multi-developer projects.

Each VSTS Git repository that's associated with a data factory has a collaboration branch. (`master` is the default collaboration branch). Users can also create feature branches by clicking **+ New Branch** and do development in the feature branches.

![Change the code by syncing or publishing](media/author-visually/sync-publish.png)

When you are ready with the feature development in your feature branch, you can click **Create pull request**. This action takes you to VSTS GIT where you can raise pull requests, do code reviews, and merge changes to your collaboration branch. (`master` is the default). You are only allowed to publish to the Data Factory service from your collaboration branch. 

![Create a new pull request](media/author-visually/create-pull-request.png)

#### Publish code changes
After you have merged changes to the collaboration branch (`master` is the default), select **Publish** to manually publish your code changes in the master branch to the Data Factory service.

![Publish changes to the Data Factory service](media/author-visually/publish-changes.png)

> [!IMPORTANT]
> The master branch is not representative of what's deployed in the Data Factory service. The master branch *must* be published manually to the Data Factory service.

### Author with Github integration

Visual authoring with Github integration supports source control and collaboration for work on your data factory pipelines. You can associate a data factory with a Github account repository for source control, collaboration,
versioning. A single Github account can have multiple repositories, but a Github repository can be associated with only one data factory. If you don't have aGithub account or repository, follow [these instructions](https://github.com/join) to create your resources. The GitHub integration with Data Factory supports both public Github as well as GitHub
Enterprise.

> [!NOTE]
> You can store script and data files in a Github repository. However, you have to upload the files manually to Azure  Storage. A Data Factory pipeline does not automatically upload script or data files stored in a Github repository to Azure Storage.

#### Configure a public Github repository with Azure Data Factory

You can configure a Github repository with a data factory through two methods.

**Configuration method 1 (public repo): Let's get started page**

In Azure Data Factory, go to the **Let's get started** page. Select **Configure Code Repository**:

![Data Factory Get Started page](media/author-visually/github-integration-image1.png)

The **Repository Settings** configuration pane appears:

![GitHub repository settings](media/author-visually/github-integration-image2.png)

The pane shows the following VSTS code repository settings:

| **Setting**                                              | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                   | **Value**          |
|----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| **Repository Type**                                      | The type of the VSTS code repository.                                                                                                                                                                                                                                                                                                                                                                                             | GitHub             |
| **GitHub account**                                       | Your GitHub account name. This name can be found from https://github.com/{account name}/{repository name}. Navigating to this page prompts you to enter Github OAuth credentials to your GitHub account.                                                                                                                                                                                                                                               |                    |
| **RepositoryName**                                       | Your GitHub code repository name. GitHub accounts contain Git repositories to manage your source code. You can create a new repository or use an existing repository that's already in your account.                                                                                                                                                                                                                              |                    |
| **Collaboration branch**                                 | Your GitHub collaboration branch that is used for publishing. By default, it is master. Change this setting in case you want to publish resources from another branch.                                                                                                                                                                                                                                                               |                    |
| **Root folder**                                          | Your root folder in your GitHub collaboration branch.                                                                                                                                                                                                                                                                                                                                                                             |                    |
| **Import existing Data Factory resources to repository** | Specifies whether to import existing data factory resources from the UX **Authoring canvas** into a GitHub repository. Select the box to import your data factory resources into the associated Git repository in JSON format. This action exports each resource individually (that is, the linked services and datasets are exported into separate JSONs). When this box isn't selected, the existing resources aren't imported. | Selected (default) |
| **Branch to import resource into**                       | Specifies into which branch the data factory resources (pipelines, datasets, linked services etc.) are imported. You can import resources into one of the following branches: a. Collaboration b. Create new c. Use Existing                                                                                                                                                                                                     |                    |

**Configuration method 2 (public repo): UX authoring canvas**

In the Azure Data Factory UX **Authoring canvas**, locate your data factory. Select the **Data Factory** drop-down menu, and then select **Configure Code Repository**.

A configuration pane appears. For details about the configuration settings, see the descriptions in *Configuration method 1* above.

#### Configure a Github Enterprise Repository with Azure Data Factory

You can configure a Github Enterprise repository with a data factory through two methods.

**Configuration method 1 (Enterprise repo): Let's get started page**

In Azure Data Factory, go to the **Let's get started** page. Select **Configure Code Repository**:

![Data Factory Get Started page](media/author-visually/github-integration-image1.png)

The **Repository Settings** configuration pane appears:

![GitHub repository settings](media/author-visually/github-integration-image3.png)

The pane shows the following VSTS code repository settings:

| **Setting**                                              | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                   | **Value**          |
|----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| **Repository Type**                                      | The type of the VSTS code repository.                                                                                                                                                                                                                                                                                                                                                                                             | GitHub             |
| **Use GitHub Enterprise**                                | Checkbox to select GitHub Enterprise                                                                                                                                                                                                                                                                                                                                                                                              |                    |
| **GitHub Enterprise URL**                                | The GitHub Enterprise root URL. For example: https://github.mydomain.com                                                                                                                                                                                                                                                                                                                                                          |                    |
| **GitHub account**                                       | Your GitHub account name. This name can be found from https://github.com/{account name}/{repository name}. Navigating to this page prompts you to enter Github OAuth credentials to your GitHub account.                                                                                                                                                                                                                                               |                    |
| **RepositoryName**                                       | Your GitHub code repository name. GitHub accounts contain Git repositories to manage your source code. You can create a new repository or use an existing repository that's already in your account.                                                                                                                                                                                                                              |                    |
| **Collaboration branch**                                 | Your GitHub collaboration branch that is used for publishing. By default, it is master. Change this setting in case you want to publish resources from another branch.                                                                                                                                                                                                                                                               |                    |
| **Root folder**                                          | Your root folder in your GitHub collaboration branch.                                                                                                                                                                                                                                                                                                                                                                             |                    |
| **Import existing Data Factory resources to repository** | Specifies whether to import existing data factory resources from the UX **Authoring canvas** into a GitHub repository. Select the box to import your data factory resources into the associated Git repository in JSON format. This action exports each resource individually (that is, the linked services and datasets are exported into separate JSONs). When this box isn't selected, the existing resources aren't imported. | Selected (default) |
| **Branch to import resource into**                       | Specifies into which branch the data factory resources (pipelines, datasets, linked services etc.) are imported. You can import resources into one of the following branches: a. Collaboration b. Create new c. Use Existing                                                                                                                                                                                                     |                    |

**Configuration method 2 (Enterprise repo): UX authoring canvas**

In the Azure Data Factory UX **Authoring canvas**, locate your data factory. Select the **Data Factory** drop-down menu, and then select **Configure Code Repository**.

A configuration pane appears. For details about the configuration settings, see the descriptions in *Configuration method 1* above.

## Use the expression language
You can specify expressions for property values by using the expression language that's supported by Azure Data Factory.

Specify expressions for property values by selecting **Add Dynamic Content**:

![Use the expression language](media/author-visually/dynamic-content-1.png)

## Use functions and parameters

You can use functions or specify parameters for pipelines and datasets in the Data Factory **expression builder**:

For information about the supported expressions, see [Expressions and functions in Azure Data Factory](control-flow-expression-language-functions.md).

![Add Dynamic Content](media/author-visually/dynamic-content-2.png)

## Provide feedback
Select **Feedback** to comment about features or to notify Microsoft about issues with the tool:

![Feedback](media/author-visually/provide-feedback.png)

## Next steps
To learn more about monitoring and managing pipelines, see [Monitor and manage pipelines programmatically](monitor-programmatically.md).
