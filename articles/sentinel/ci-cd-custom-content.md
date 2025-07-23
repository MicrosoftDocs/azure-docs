---
title: Manage custom content with repository connections
titleSuffix: Microsoft Sentinel
description: This article explains custom Sentinel content like GitHub or Azure DevOps repositories that can utilize source control features. 
author: mberdugo 
ms.author: monaberdugo 
ms.service: microsoft-sentinel
ms.topic: conceptual
ms.date: 12/31/2024
ms.custom:
  - template-concept
  - build-2025
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security

#Customer intent: As a SOC collaborator or MSSP analyst, I want to manage dynamic Microsoft Sentinel content as code based on source control repositories using CI/CD pipelines so that I can automate updates and ensure consistent configurations across workspaces. As an MSSP content manager, I want to deploy one solution to many customer workspaces and still be able to tailor custom content for their environments.

---

# Manage content as code with Microsoft Sentinel repositories (public preview)

The Microsoft Sentinel repositories feature provides a central experience for the deployment and management of Sentinel content as code. Repositories allow connections to an external source control for continuous integration / continuous delivery (CI/CD). This automation removes the burden of manual processes to update and deploy your custom content across workspaces. A subset of content as code is *detections* as code (DaC). Microsoft Sentinel **Repositories** implements DaC as well.

For more information on Sentinel content, see [About Microsoft Sentinel content and solutions](sentinel-solutions.md).

> [!IMPORTANT]
> The Microsoft Sentinel **Repositories** feature is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for more legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Plan your repository connection

Microsoft Sentinel repositories require careful planning to ensure you have the proper permissions from your workspace to the repository (repo) you want connected. 

- Only connections to GitHub and Azure DevOps repositories are supported.
- Collaborator access to your GitHub repository or Project Administrator access to your Azure DevOps repository is required. 
- The Microsoft Sentinel application needs authorization to your repo.
- Actions must be enabled for GitHub.
- Pipelines must be enabled for Azure DevOps.
- An Azure DevOps connection must be in the same tenant as your Microsoft Sentinel workspace.

Creating a connection to a repository requires an **Owner** role in the resource group that contains your Microsoft Sentinel workspace. If you're unable to use the Owner role in your environment, use the combination of **User Access Administrator** and **Sentinel Contributor** roles to create the connection.

If you find content in a public repository where you aren't a contributor, first import, fork, or clone the content to a repo where you're a contributor. Then connect your repo to your Microsoft Sentinel workspace. For more information, see [Deploy custom content from your repository](ci-cd.md).

## Plan your repository content

Repository content must be stored as [Bicep files](../azure-resource-manager/bicep/file.md) or [Azure Resource Manager (ARM) templates](../azure-resource-manager/templates/overview.md). However, Bicep is more intuitive and makes it easier to describe Azure resources and Microsoft Sentinel content. 

Deploy Bicep file templates alongside or instead of ARM JSON templates. If you're considering infrastructure as code options, we recommend looking at Bicep. For more information, see [What is Bicep?](../azure-resource-manager/bicep/overview.md).

> [!IMPORTANT]
> In order to use Bicep files, your repositories connection needs to be updated if your connection was created before November 1, 2024. Repositories connections must be [removed](ci-cd.md#remove-a-repository-connection) and recreated in order to update.

Even if your original content is an ARM template, consider converting to Bicep to make the review and update processes less complex. Bicep is closely related to ARM because during a deployment, each Bicep file is converted to an ARM template. For more information on converting ARM templates, see [Decompiling ARM template JSON to Bicep](../azure-resource-manager/bicep/decompile.md).

> [!NOTE]
> Known Bicep limitations:
> - Bicep files don't support the `id` property. When decompiling ARM JSON to Bicep, make sure you don't have this property. For example, analytic rule templates exported from Microsoft Sentinel have the `id` property that needs removal.
> - Change the ARM JSON schema to version `2019-04-01` for best results when decompiling.

### Validate your content

The following Microsoft Sentinel content types can be deployed through a repository connection:
- Analytics rules 
- Automation rules
- Hunting queries
- Parsers
- Playbooks
- Workbooks

> [!IMPORTANT]
> Analytic rules deployed using The Microsoft Sentinel **Repositories** feature can use cross-workspace queries only if the destination workspace is in the same Resource Group as the workspace connected to the repository.
>

> [!TIP]
> This article does *not* describe how to create these types of content from scratch. For more information, see the relevant [Microsoft Sentinel GitHub wiki](https://github.com/Azure/Azure-Sentinel/wiki#get-started) for each content type.
>

The repositories deployment doesn't validate the content except to confirm it's in the correct JSON or Bicep format. Be sure to test your content within Microsoft Sentinel before deploying.

A sample repository is available with templates for each of the content types listed. The repo also demonstrates how to use advanced features of repository connections. For more information, see [Microsoft Sentinel CI/CD repositories sample](https://github.com/SentinelCICD/RepositoriesSampleContent). 


:::image type="content" source="media/ci-cd-custom-content/repositories-connection-success.png" alt-text="Screenshot of a successful repository connection. The RepositoriesSampleContent is shown. This screenshot is after the sample was imported from the SentinelCICD repo to a private GitHub repo in the FourthCoffee organization." lightbox="media/ci-cd-custom-content/repositories-connection-success.png":::


### Maximum connections and deployments

- Each Microsoft Sentinel workspace is currently limited to **five repository connections**.
- Each Azure resource group is limited to **800 deployments** in its deployment history. If you have a high volume of template deployments one or more of your resource groups, you may see the `Deployment QuotaExceeded` error. For more information, see [DeploymentQuotaExceeded](/azure/azure-resource-manager/templates/deployment-quota-exceeded) in the Azure Resource Manager templates documentation.


## Improve performance with smart deployments

> [!TIP]
> To ensure smart deployments works in GitHub, Workflows must have read and write permissions on your repository. See [Managing GitHub Actions settings for a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository) for more details.
>

The **smart deployments** feature is a back-end capability that improves performance by actively tracking modifications made to the content files of a connected repository. It uses a CSV file within the `.sentinel` folder in your repository to audit each commit. The workflow avoids redeploying content that hasn't been modified since the last deployment. This process improves your deployment performance and prevents tampering with unchanged content in your workspace, such as resetting dynamic schedules of your analytics rules.

Smart deployments are enabled by default on newly created connections. If you prefer all source control content deployed every time a deployment is triggered, whether that content was modified or not, modify your workflow to disable smart deployments. For more information, see [Customize the workflow or pipeline](ci-cd-custom-deploy.md#customize-the-workflow-or-pipeline). 

## Consider deployment customization options

Consider the following customization options when deploying content with Microsoft Sentinel repositories.

#### Customize the workflow or pipeline

Customize the workflow or pipeline in one of the following ways:
- configure different deployment triggers
- deploy content only from a specific root folder for a given workspace
- schedule the workflow to run periodically
- combine different workflow events together
- turn off smart deployments

These customizations are defined in a .yml file specific to your workflow or pipeline. For more information on how to implement, see [Customize repository deployments](ci-cd-custom-deploy.md#customize-the-workflow-or-pipeline)

#### Customize the deployment

Once the workflow or pipeline is triggered, the deployment supports the following scenarios:
- prioritize content to be deployed before the rest of the repo content
- exclude content from deployment
- specify ARM template parameter files 

These options are available through a feature of the PowerShell deployment script called from the workflow or pipeline. For more information on how to implement these customizations, see [Customize repository deployments](ci-cd-custom-deploy.md#customize-your-connection-configuration).


## Next steps

Get more examples and step by step instructions on deploying Microsoft Sentinel repositories.

- [Deploy custom content from your repository](ci-cd.md)
- [Microsoft Sentinel CI/CD sample repository](https://github.com/SentinelCICD/RepositoriesSampleContent)
- [Automate Sentinel integration with DevOps](/azure/architecture/example-scenario/devops/automate-sentinel-integration#microsoft-sentinel-repositories)
