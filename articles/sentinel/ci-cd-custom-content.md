---
title: Update custom content with repository connections
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

# Update custom content with Microsoft Sentinel repositories (Public preview)

Unlock your content as code for continuous integration and continuous delivery (CI/CD) with the repositories feature. This article describes the options you should consider when connecting to your source control solution. Repositories provide a central experience for deployment and management of Microsoft Sentinel content and removes the burden of having to manage manual processes to update and deploy your custom content across your workspaces. For more information on Sentinel content, see [About Microsoft Sentinel content and solutions](sentinel-solutions.md).

> [!IMPORTANT]
>
> The Microsoft Sentinel **Repositories** feature is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


## Plan your repository connection

Microsoft Sentinel only supports connections to GitHub and Azure DevOps repositories. In order to connect, you'll need an access role with permission to authorize the Microsoft Sentinel application to your repo, in addition to being a contributor. In GitHub, the Sentinel app requires:

- Read access to metadata
- Read and write access to actions, code, secrets, and workflows

- Actions must be enabled for GitHub and Pipelines must be enabled for Azure DevOps

If you find content on a public repository where you aren't a contributor, you'll need to import, fork, clone or mirror the content to a repo you are a contributor to first. Then you can connect your repo to your Sentinel workspace. For more information, see [Deploy custom content from your repository](ci-cd.md).


### Validate your content

The following Microsoft Sentinel content types can be deployed through a repository connection:
- Analytic rules 
- Automation rules
- Hunting queries
- Parsers
- Playbooks
- Workbooks

> [!TIP]
> This article does *not* describe how to create these types of content from scratch. For more information, see the relevant [Microsoft Sentinel GitHub wiki](https://github.com/Azure/Azure-Sentinel/wiki#get-started) for each content type.
>

Repository content needs to be created as proper ARM templates. Connecting a repo to Microsoft Sentinel doesn't validate the content except to confirm it's in the correct deployment JSON format.

The first step to validate your content is to test it within Microsoft Sentinel. You can also leverage the [Microsoft Sentinel GitHub validation process](https://github.com/Azure/Azure-Sentinel/wiki#test-your-contribution) and tools to complement your validation process.

A sample repository is available with ARM templates for each of the content types listed above. The repo also demonstrates how to use advanced features of repository connections. For more information, see [Sentinel CICD sample repository](https://github.com/SentinelCICD/RepositoriesSampleContent). 


:::image type="content" source="media/ci-cd-custom-content/repositories-connection-success.png" alt-text="Screenshot of a successful repository connection to the RepositoriesSampleContent imported from the SentinelCICD repo to a private GitHub repo in the fourthcoffee organization." lightbox="media/ci-cd-custom-content/repositories-connection-success.png":::


### Maximum connections and deployments

- Each Microsoft Sentinel workspace is currently limited to **five repository connections**.

- Each Azure resource group is limited to **800 deployments** in its deployment history. If you have a high volume of ARM template deployments in your resource group(s), you may see an `Deployment QuotaExceeded` error. For more information, see [DeploymentQuotaExceeded](/azure/azure-resource-manager/templates/deployment-quota-exceeded) in the Azure Resource Manager templates documentation.



## Improve performance with smart deployments

Smart deployments is a back-end capability that improves the performance of deployments by actively tracking modifications made to the content files of a connected repository/branch using a csv file within the '.sentinel' folder in your repository. By actively tracking modifications made to content in each commit, your Microsoft Sentinel repositories will avoid redeploying any content that has not been modified since the last deployment into your Microsoft Sentinel workspace(s). This will improve your deployment performance and avoid unintentionally tampering with unchanged content in your workspace, such as resetting the dynamic schedules of your analytics rules by redeploying them. The Sentinel app maintains a csv file in the **.sentinel** folder for your repo, which tracks each and every commit made to the connected branch.

While the smart deployments feature is enabled by default on newly created connections, we understand that some customers would prefer all their source control content to be deployed every time a deployment is triggered, regardless of whether that content was modified or not. You can modify your workflow to disable smart deployments to have your connection deploy all content regardless of its modification status. See [Customize the deployment workflow](ci-cd.md#customize-the-deployment-workflow) for more details. 

   > [!NOTE]
   > This capability was launched in public preview on April 20th, 2022. Connections created prior to launch would need to be updated or recreated for smart deployments to be turned on.
   >


## Consider deployment workflow options

Even with smart deployments enabled, the default behavior is to push all the updated content from the connected repo branch. If the default configuration for your content deployment from GitHub or Azure DevOps doesn't meet all your requirements, you can modify the experience to fit your needs.

For example, you may want to turn off smart deployments, configure different deployment triggers, or deploy content only from a specific root folder for a given workspace. You may want to schedule the workflow to run periodically, or to combine different workflow events together. You can even prioritize content to be considered before the entire repo is traversed for ARM templates. For more information, see [The Repo Man Blog](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/new-capabilities-sentinel-repos)


## Next steps

Get more examples and step by step instructions on deploying Microsoft Sentinel repositories.

- [Sentinel CICD sample repository](https://github.com/SentinelCICD/RepositoriesSampleContent)
- [Deploy custom content from your repository](ci-cd.md)