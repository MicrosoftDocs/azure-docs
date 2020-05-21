---
title: Source control
description: Learn how to configure source control in Azure Data Factory
services: data-factory
ms.service: data-factory
ms.workload: data-services
author: djpmsft
ms.author: daperlov
manager: anandsub
ms.reviewer:
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 04/30/2020
---

# Source control in Azure Data Factory
[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

By default, the Azure Data Factory user interface experience (UX) authors directly against the data factory service. This experience has the following limitations:

- The Data Factory service doesn't include a repository for storing the JSON entities for your changes. The only way to save changes is via the **Publish All** button and all changes are published directly to the data factory service.
- The Data Factory service isn't optimized for collaboration and version control.

To provide a better authoring experience, Azure Data Factory allows you to configure a Git repository with either Azure Repos or GitHub. Git is a version control system that allows for easier change tracking and collaboration. This tutorial will outline how to configure and work in a git repository along with highlighting best practices and a troubleshooting guide.

> [!NOTE]
> Azure data factory git integration is not available in the Azure Government Cloud.

## Advantages of Git integration

Below is a list of some of the advantages git integration provides to the authoring experience:

-   **Source control:** As your data factory workloads become crucial, you would want to integrate your factory with Git to leverage several source control benefits like the following:
    -   Ability to track/audit changes.
    -   Ability to revert changes that introduced bugs.
-   **Partial saves:** When authoring against the data factory service, you can't save changes as a draft and all publishes must pass data factory validation. Whether your pipelines are not finished or you simply don't want to lose changes in case of a computer crash, git integration allows for incremental changes of data factory resources regardless of what state they are in. Configuring a git repository allows you to save changes, letting you only publish when you have tested your changes to your satisfaction.
-   **Collaboration and control:** If you have multiple team members contributing to the same factory, you may want to let your teammates collaborate with each other via a code review process. You can also set up your factory such that not every contributor has equal permissions. Some team members may only be allowed to make changes via Git and only certain people in the team are allowed to publish the changes to the factory.
-   **Better CI/CD:**  If you are deploying to multiple environments with a [continuous delivery process](continuous-integration-deployment.md), git integration makes certain actions easier. Some of these actions include:
    -   Configure your release pipeline to trigger automatically as soon as there are any changes made to your 'dev' factory.
    -   Customize the properties in your factory that are available as parameters in the Resource Manager template. It can be useful to keep only the required set of properties as parameters, and have everything else hard coded.
-   **Better Performance:** An average factory with git integration loads 10 times faster than one authoring against the data factory service. This performance improvement is because resources are downloaded via Git.

> [!NOTE]
> Authoring directly with the Data Factory service is disabled in the Azure Data Factory UX when a Git repository is configured. Changes can be made directly to the service via PowerShell or an SDK.

## Author with Azure Repos Git integration

Visual authoring with Azure Repos Git integration supports source control and collaboration for work on your data factory pipelines. You can associate a data factory with an Azure Repos Git organization repository for source control, collaboration, versioning, and so on. A single Azure Repos Git organization can have multiple repositories, but an Azure Repos Git repository can be associated with only one data factory. If you don't have an Azure Repos organization or repository, follow [these instructions](https://docs.microsoft.com/azure/devops/organizations/accounts/create-organization-msa-or-work-student) to create your resources.

> [!NOTE]
> You can store script and data files in an Azure Repos Git repository. However, you have to upload the files manually to Azure Storage. A Data Factory pipeline does not automatically upload script or data files stored in an Azure Repos Git repository to Azure Storage.

### Configure an Azure Repos Git repository with Azure Data Factory

You can configure an Azure Repos Git repository with a data factory through two methods.

#### Configuration method 1: Azure Data Factory home page

On the Azure Data Factory home page, select **Set up Code Repository**.

![Configure an Azure Repos code repository](media/author-visually/configure-repo.png)

#### Configuration method 2: UX authoring canvas
In the Azure Data Factory UX authoring canvas, select the **Data Factory** drop-down menu, and then select **Set up Code Repository**.

![Configure the code repository settings for UX authoring](media/author-visually/configure-repo-2.png)

Both methods open the repository settings configuration pane.

![Configure the code repository settings](media/author-visually/repo-settings.png)

The configuration pane shows the following Azure Repos code repository settings:

| Setting | Description | Value |
|:--- |:--- |:--- |
| **Repository Type** | The type of the Azure Repos code repository.<br/> | Azure DevOps Git or GitHub |
| **Azure Active Directory** | Your Azure AD tenant name. | `<your tenant name>` |
| **Azure Repos Organization** | Your Azure Repos organization name. You can locate your Azure Repos organization name at `https://{organization name}.visualstudio.com`. You can [sign in to your Azure Repos organization](https://www.visualstudio.com/team-services/git/) to access your Visual Studio profile and see your repositories and projects. | `<your organization name>` |
| **ProjectName** | Your Azure Repos project name. You can locate your Azure Repos project name at `https://{organization name}.visualstudio.com/{project name}`. | `<your Azure Repos project name>` |
| **RepositoryName** | Your Azure Repos code repository name. Azure Repos projects contain Git repositories to manage your source code as your project grows. You can create a new repository or use an existing repository that's already in your project. | `<your Azure Repos code repository name>` |
| **Collaboration branch** | Your Azure Repos collaboration branch that is used for publishing. By default, its `master`. Change this setting in case you want to publish resources from another branch. | `<your collaboration branch name>` |
| **Root folder** | Your root folder in your Azure Repos collaboration branch. | `<your root folder name>` |
| **Import existing Data Factory resources to repository** | Specifies whether to import existing data factory resources from the UX **Authoring canvas** into an Azure Repos Git repository. Select the box to import your data factory resources into the associated Git repository in JSON format. This action exports each resource individually (that is, the linked services and datasets are exported into separate JSONs). When this box isn't selected, the existing resources aren't imported. | Selected (default) |
| **Branch to import resource into** | Specifies into which branch the data factory resources (pipelines, datasets, linked services etc.) are imported. You can import resources into one of the following branches: a. Collaboration b. Create new c. Use Existing |  |

> [!NOTE]
> If you are using Microsoft Edge and do not see any values in your Azure DevOps Account dropdown, add https://*.visualstudio.com to the trusted sites list.

### Use a different Azure Active Directory tenant

The Azure Repos Git repo can be in a different Azure Active Directory tenant. To specify a different Azure AD tenant, you have to have administrator permissions for the Azure subscription that you're using.

### Use your personal Microsoft account

To use a personal Microsoft account for Git integration, you can link your personal Azure Repo to your organization's Active Directory.

1. Add your personal Microsoft account to your organization's Active Directory as a guest. For more info, see [Add Azure Active Directory B2B collaboration users in the Azure portal](../active-directory/b2b/add-users-administrator.md).

2. Log in to the Azure portal with your personal Microsoft account. Then switch to your organization's Active Directory.

3. Go to the Azure DevOps section, where you now see your personal repo. Select the repo and connect with Active Directory.

After these configuration steps, your personal repo is available when you set up Git integration in the Data Factory UI.

For more info about connecting Azure Repos to your organization's Active Directory, see [Connect your Azure DevOps organization to Azure Active Directory](/azure/devops/organizations/accounts/connect-organization-to-azure-ad).

## Author with GitHub integration

Visual authoring with GitHub integration supports source control and collaboration for work on your data factory pipelines. You can associate a data factory with a GitHub account repository for source control, collaboration, versioning. A single GitHub account can have multiple repositories, but a GitHub repository can be associated with only one data factory. If you don't have a GitHub account or repository, follow [these instructions](https://github.com/join) to create your resources.

The GitHub integration with Data Factory supports both public GitHub (that is, [https://github.com](https://github.com)) and GitHub Enterprise. You can use both public and private GitHub repositories with Data Factory as long you have read and write permission to the repository in GitHub.

To configure a GitHub repo, you must have administrator permissions for the Azure subscription that you're using.

For a nine-minute introduction and demonstration of this feature, watch the following video:

> [!VIDEO https://channel9.msdn.com/shows/azure-friday/Azure-Data-Factory-visual-tools-now-integrated-with-GitHub/player]

### Configure a GitHub repository with Azure Data Factory

You can configure a GitHub repository with a data factory through two methods.

#### Configuration method 1: Azure Data Factory home page

On the Azure Data Factory home page, select **Set up Code Repository**.

![Configure an Azure Repos code repository](media/author-visually/configure-repo.png)

#### Configuration method 2: UX authoring canvas

In the Azure Data Factory UX authoring canvas, select the **Data Factory** drop-down menu, and then select **Set up Code Repository**.

![Configure the code repository settings for UX authoring](media/author-visually/configure-repo-2.png)

Both methods open the repository settings configuration pane.

![GitHub repository settings](media/author-visually/github-integration-image2.png)

The configuration pane shows the following GitHub repository settings:

| **Setting** | **Description**  | **Value**  |
|:--- |:--- |:--- |
| **Repository Type** | The type of the Azure Repos code repository. | GitHub |
| **Use GitHub Enterprise** | Checkbox to select GitHub Enterprise | unselected (default) |
| **GitHub Enterprise URL** | The GitHub Enterprise root URL (must be HTTPS for local GitHub Enterprise server). For example: `https://github.mydomain.com`. Required only if **Use GitHub Enterprise** is selected | `<your GitHub enterprise url>` |                                                           
| **GitHub account** | Your GitHub account name. This name can be found from https:\//github.com/{account name}/{repository name}. Navigating to this page prompts you to enter GitHub OAuth credentials to your GitHub account. | `<your GitHub account name>` |
| **Repository Name**  | Your GitHub code repository name. GitHub accounts contain Git repositories to manage your source code. You can create a new repository or use an existing repository that's already in your account. | `<your repository name>` |
| **Collaboration branch** | Your GitHub collaboration branch that is used for publishing. By default, its master. Change this setting in case you want to publish resources from another branch. | `<your collaboration branch>` |
| **Root folder** | Your root folder in your GitHub collaboration branch. |`<your root folder name>` |
| **Import existing Data Factory resources to repository** | Specifies whether to import existing data factory resources from the UX authoring canvas into a GitHub repository. Select the box to import your data factory resources into the associated Git repository in JSON format. This action exports each resource individually (that is, the linked services and datasets are exported into separate JSONs). When this box isn't selected, the existing resources aren't imported. | Selected (default) |
| **Branch to import resource into** | Specifies into which branch the data factory resources (pipelines, datasets, linked services etc.) are imported. You can import resources into one of the following branches: a. Collaboration b. Create new c. Use Existing |  |

### Known GitHub limitations

- You can store script and data files in a GitHub repository. However, you have to upload the files manually to Azure Storage. A Data Factory pipeline does not automatically upload script or data files stored in a GitHub repository to Azure Storage.

- GitHub Enterprise with a version older than 2.14.0 doesn't work in the Microsoft Edge browser.

- GitHub integration with the Data Factory visual authoring tools only works in the generally available version of Data Factory.

- A maximum of 1,000 entities per resource type (such as pipelines and datasets) can be fetched from a single GitHub branch. If this limit is reached, is suggested to split your resources into separate factories. Azure DevOps Git does not have this limitation.

## Version control

Version control systems (also known as _source control_) let developers collaborate on code and track changes that are made to the code base. Source control is an essential tool for multi-developer projects.

### Creating feature branches

Each Azure Repos Git repository that's associated with a data factory has a collaboration branch. (`master` is the default collaboration branch). Users can also create feature branches by clicking **+ New Branch** in the branch dropdown. Once the new branch pane appears, enter the name of your feature branch.

![Create a new branch](media/author-visually/new-branch.png)

When you are ready to merge the changes from your feature branch to your collaboration branch, click on the branch dropdown and select **Create pull request**. This action takes you to Azure Repos Git where you can raise pull requests, do code reviews, and merge changes to your collaboration branch. (`master` is the default). You are only allowed to publish to the Data Factory service from your collaboration branch. 

![Create a new pull request](media/author-visually/create-pull-request.png)

### Configure publishing settings

By default, data factory generates the Resource Manager templates of the published factory and saves them into a branch called `adf_publish`. To configure a custom publish branch, add a `publish_config.json` file to the root folder in the collaboration branch. When publishing, ADF reads this file, looks for the field `publishBranch`, and saves all Resource Manager templates to the specified location. If the branch doesn't exist, data factory will automatically create it. And example of what this file looks like is below:

```json
{
    "publishBranch": "factory/adf_publish"
}
```

Azure Data Factory can only have one publish branch at a time. When you specify a new publish branch, Data Factory doesn't delete the previous publish branch. If you want to remove the previous publish branch, delete it manually.

> [!NOTE]
> Data Factory only reads the `publish_config.json` file when it loads the factory. If you already have the factory loaded in the portal, refresh the browser to make your changes take effect.

### Publish code changes

After you have merged changes to the collaboration branch (`master` is the default), click **Publish** to manually publish your code changes in the master branch to the Data Factory service.

![Publish changes to the Data Factory service](media/author-visually/publish-changes.png)

A side pane will open where you confirm that the publish branch and pending changes are correct. Once you verify your changes, click **OK** to confirm the publish.

![Confirm the correct publish branch](media/author-visually/configure-publish-branch.png)

> [!IMPORTANT]
> The master branch is not representative of what's deployed in the Data Factory service. The master branch *must* be published manually to the Data Factory service.

## Best practices for Git integration

### Permissions

Typically you don't want every team member to have permissions to update the factory. The following permissions settings are recommended:

*   All team members should have read permissions to the data factory.
*   Only a select set of people should be allowed to publish to the factory. To do so, they must have the **Data Factory contributor** role on the resource group the factory is in. For more information on permissions, see [Roles and permissions for Azure Data Factory](concepts-roles-permissions.md).
   
It's recommended to not allow direct check-ins to the collaboration branch. This restriction can help prevent bugs as every check-in will go through a pull request review process described in [Creating feature branches](source-control.md#creating-feature-branches).

### Using passwords from Azure Key Vault

It's recommended to use Azure Key Vault to store any connection strings or passwords or managed identity authentication for Data Factory Linked Services. For security reasons, data factory doesn't store secrets in Git. Any changes to Linked Services containing secrets such as passwords are published immediately to the Azure Data Factory service.

Using Key Vault or MSI authentication also makes continuous integration and deployment easier as you won't have to provide these secrets during Resource Manager template deployment.

## Troubleshooting Git integration

### Stale publish branch

If the publish branch is out of sync with the master branch and contains out-of-date resources despite a recent publish, try following these steps:

1. Remove your current Git repository
1. Reconfigure Git with the same settings, but make sure **Import existing Data Factory resources to repository** is selected and choose **New branch**
1. Create a pull request to merge the changes to the collaboration branch 

Below are some examples of situations that can cause a stale publish branch:
- A user has multiple branches. In one feature branch, they deleted a linked service which is not AKV associated (non-AKV linked services are published immediately regardless if they are in Git or not) and never merged the feature branch into the collaboration branch.
- A user modified the data factory using the SDK or PowerShell
- A user moved all resources to a new branch and tried to publish for the first time. Linked services should be created manually when importing resources.
- A user uploads a non-AKV linked service or an Integration Runtime JSON manually. They reference that resource from another resource such as a dataset, linked service, or pipeline. A non-AKV linked service created through the UX is published immediately because the credentials need to be encrypted. If you upload a dataset referencing that linked service and try to publish, the UX will allow it because it exists in the git environment. It will be rejected at publish time since it does not exist in the data factory service.

## Switch to a different Git repository

To switch to a different Git repository, click the **Git Repo Settings** icon in the upper right corner of the Data Factory overview page. If you can't see the icon, clear your local browser cache. Select the icon to remove the association with the current repo.

![Git icon](media/author-visually/remove-repo.png)

Once the Repository Settings pane appears, select **Remove Git**. Enter your data factory name and click **confirm** to remove the Git repository associated with your data factory.

![Remove the association with the current Git repo](media/author-visually/remove-repo2.png)

After you remove the association with the current repo, you can configure your Git settings to use a different repo and then import existing Data Factory resources to the new repo.

> [!IMPORTANT]
> Removing Git configuration from a data factory doesn't delete anything from the repository. The factory will contain all published resources. You can continue to edit the factory directly against the service.

## Next steps

* To learn more about monitoring and managing pipelines, see [Monitor and manage pipelines programmatically](monitor-programmatically.md).
* To implement continuous integration and deployment, see [Continuous integration and delivery (CI/CD) in Azure Data Factory](continuous-integration-deployment.md).
