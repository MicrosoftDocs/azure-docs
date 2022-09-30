---
title: Manage custom content with repository connections
titleSuffix: Microsoft Sentinel
description: This article explains custom Sentinel content like GitHub or Azure DevOps repositories that can utilize source control features. 
author: austinmccollum
ms.author: austinmc
ms.service: microsoft-sentinel
ms.topic: conceptual
ms.date: 8/24/2022
ms.custom: template-concept
#Customer intent: As a SOC collaborator or MSSP analyst, I want to manage dynamic Sentinel workspace content based on source control repositories for continuous integration and continuous delivery (CI/CD). Specifically as an MSSP content manager, I want to deploy one solution to many customer workspaces and still be able to tailor custom content for their environments.
---

# Manage custom content with Microsoft Sentinel repositories (public preview)

The Microsoft Sentinel repositories feature provides a central experience for the deployment and management of Sentinel content as code. Repositories allow connections to an external source control for continuous integration / continuous delivery (CI/CD). This automation removes the burden of manual processes to update and deploy your custom content across workspaces. For more information on Sentinel content, see [About Microsoft Sentinel content and solutions](sentinel-solutions.md).

> [!IMPORTANT]
> The Microsoft Sentinel **Repositories** feature is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Plan your repository connection

Microsoft Sentinel repositories require careful planning to ensure you have the proper permissions from your workspace to the repository (repo) you want connected. Only connections to GitHub and Azure DevOps repositories with contributor access are currently supported. The Microsoft Sentinel application will need authorization to your repo and have Actions enabled for GitHub and Pipelines enabled for Azure DevOps. 

Repositories require an **Owner** role in the resource group that contains your Microsoft Sentinel workspace. This role is required to create the connection between Microsoft Sentinel and your source control repository. If you're' unable to use the Owner role in your environment, you can instead use the combination of **User Access Administrator** and **Sentinel Contributor** roles to create the connection.

If you find content in a public repository where you *aren't* a contributor, you'll need to get that content into your repo first. You can do that with an import, fork, or clone of the content to a repo where you're a contributor. Then you can connect your repo to your Sentinel workspace. For more information, see [Deploy custom content from your repository](ci-cd.md).


### Validate your content

The following Microsoft Sentinel content types can be deployed through a repository connection:
- Analytics rules 
- Automation rules
- Hunting queries
- Parsers
- Playbooks
- Workbooks

> [!TIP]
> This article does *not* describe how to create these types of content from scratch. For more information, see the relevant [Microsoft Sentinel GitHub wiki](https://github.com/Azure/Azure-Sentinel/wiki#get-started) for each content type.
>

 Repositories content needs to be stored as [ARM templates](/azure/azure-resource-manager/templates/overview). The repositories deployment pipeline doesn't validate the content except to confirm it's in the correct JSON format.

The first step to validate your content is to test it within Microsoft Sentinel. You can also apply the [Microsoft Sentinel GitHub validation process](https://github.com/Azure/Azure-Sentinel/wiki#test-your-contribution) and tools to complement your validation process.

A sample repository is available with ARM templates for each of the content types listed above. The repo also demonstrates how to use advanced features of repository connections. For more information, see [Sentinel CICD repositories sample](https://github.com/SentinelCICD/RepositoriesSampleContent). 


:::image type="content" source="media/ci-cd-custom-content/repositories-connection-success.png" alt-text="Screenshot of a successful repository connection. The RepositoriesSampleContent is shown. This screenshot is after the sample was imported from the SentinelCICD repo to a private GitHub repo in the FourthCoffee organization." lightbox="media/ci-cd-custom-content/repositories-connection-success.png":::


### Maximum connections and deployments

- Each Microsoft Sentinel workspace is currently limited to **five repository connections**.

- Each Azure resource group is limited to **800 deployments** in its deployment history. If you have a high volume of ARM template deployments in your resource group(s), you may see the `Deployment QuotaExceeded` error. For more information, see [DeploymentQuotaExceeded](/azure/azure-resource-manager/templates/deployment-quota-exceeded) in the Azure Resource Manager templates documentation.



## Improve performance with smart deployments

The **smart deployments** feature is a back-end capability that improves performance by actively tracking modifications made to the content files of a connected repository. It uses a CSV file within the '.sentinel' folder in your repository to audit each commit. The workflow avoids redeploying content that hasn't been modified since the last deployment. This process improves your deployment performance and prevents tampering with unchanged content in your workspace, such as resetting dynamic schedules of your analytics rules.

Smart deployments are enabled by default on newly created connections. If you prefer all source control content to be deployed every time a deployment is triggered, regardless of whether that content was modified or not, you can modify your workflow to disable smart deployments. For more information, see [Customize the deployment workflow](ci-cd.md#customize-the-deployment-workflow). 

   > [!NOTE]
   > This capability was launched in public preview on April 20th, 2022. Connections created prior to launch would need to be updated or recreated for smart deployments to be turned on.
   >


## Consider deployment customization options

Even with smart deployments enabled, the default behavior is to push all the updated content from the connected repository branch. If the default configuration for your content deployment from GitHub or Azure DevOps doesn't meet all your requirements, you can modify the experience to fit your needs.

For example, you may want to:
- turn off smart deployments
- configure different deployment triggers
- deploy content only from a specific root folder for a given workspace
- schedule the workflow to run periodically
- combine different workflow events together
- prioritize content to be evaluated before the entire repo is enumerated for valid ARM templates

For more details on how to implement these customizations, see [Customize the deployment workflow](ci-cd.md#customize-the-deployment-workflow).


## Next steps

Get more examples and step by step instructions on deploying Microsoft Sentinel repositories.

- [Sentinel CICD sample repository](https://github.com/SentinelCICD/RepositoriesSampleContent)
- [Deploy custom content from your repository](ci-cd.md)
- [Automate Sentinel integration with DevOps](/azure/architecture/example-scenario/devops/automate-sentinel-integration#microsoft-sentinel-repositories)