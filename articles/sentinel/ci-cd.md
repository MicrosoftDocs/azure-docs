---
title: Manage custom content in your own repository | Microsoft Docs
description: This article describes how to create connections with a GitHub or Azure DevOps repository where you can save your custom content..
services: sentinel
cloud: na
documentationcenter: na
author: batamig
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 10/12/2021
ms.author: bagol
---

# Manage custom content in your own repository (Public preview)

> [!IMPORTANT]
>
> The Azure Sentinel **Repositories** page is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Sentinel *content* is Security Information and Event Management (SIEM) that assists customers with ingesting, monitoring, alerting, hunting and more in Azure Sentinel. For example, Azure Sentinel content includes data connectors, parsers, workbooks, and analytics rules. For more information, see [What is Azure Sentinel content?](sentinel-solutions.md#what-is-azure-sentinel-content)

You can use the built-in content provided in Azure Sentinel as is, customize it for your own needs, or create your own custom content from scratch.

When creating custom content, you can store and manage it in your own Azure Sentinel workspace, or an external source control repository, including GitHub and Azure DevOps repositories. You can also package your content in solutions [via the Azure Sentinel GitHub community](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions) to have it displayed in the Azure Sentinel Content hub.

This article describes how to manage the connections between Azure Sentinel and external source control repositories. Managing your content in an external repository allows you to make updates to that content outside of Azure Sentinel, and have it automatically deployed to your workspace.

## Prerequisites

Before connecting your Azure Sentinel workspace to an external source control repository, make sure that you have:

- Access to a GitHub or Azure DevOps repository, with any files you may need to create your content. For example, if you're managing analytics rules in your workspace, make sure that you have the [relevant Azure Sentinel ARM templates](detect-threats-custom.md), saved in a directory named **Detections**.

    Azure Sentinel currently supports connections only with GitHub and Azure DevOps repositories.

    For details about specific requirements for each content types, see the instructions in the [relevant GitHub directory](https://github.com/Azure/Azure-Sentinel) for each content type.

- An **Owner** role in the resource group that contains your Azure Sentinel workspace. The **Owner** role is required to create the connection between Azure Sentinel and your source control repository.

- Permissions to register applications in Azure Active Directory. For more information, see [Delegate app registration permissions in Azure Active Directory](/azure/active-directory/roles/delegate-app-roles).

> [!TIP]
> This article does *not* describe how to create specific types of content from scratch. For more information, see the relevant [Azure Sentinel GitHub directory](https://github.com/Azure/Azure-Sentinel) for each content type.
>

## Connect a GitHub repository

This procedure describes how to connect a GitHub repository to your Azure Sentinel workspace so that you can save and manage your custom content in GitHub instead of Azure Sentinel.

Each repository connection must be used for a single type of content. For more information, see [What is Azure Sentinel content?](sentinel-solutions.md#what-is-azure-sentinel-content).

**To create your connection**:

1. In Azure Sentinel, on the left under **Content management**, select **Repositories**.

1. Select **Add new**, and then, on the **Create a new connection** page, enter a meaningful name and description for your connection.

1. From the **Source Control** dropdown, select the type of repository you want to connect to, and then select **Authorize**.

    The first time you add a connection, you'll see a new browser window or tab, prompting you to authorize the connection from the **Azure-Sentinel** app. Authorize the connection to continue. This authorization is used again for every subsequent connection, and you won't need to authorize it again unless you've revoked the authorization.

1. A **Repository** area now shows on the **Create a new connection** page, where you can select an existing repository to connect to. Select your repository from the list, and then select **Add repository**.

    The first time you connect to a specific repository, you'll see a new browser window or tab, prompting you to install **Azure-Sentinel** on your account. If you have multiple accounts, select the one where you want to install the **Azure-Sentinel** app, and install it.

    You'll be directed to GitHub or Azure DevOps to continue the app installation.

1. After the **Azure-Sentinel** app is installed in your repository, the **Branch** dropdown in the **Create a new connection** page is populated with your branches. Select the branch where you want to store your Azure Sentinel content.

1. From the **Content Type** dropdown, select the type of content you'll be saving. You must define your content type so that users can filter connections in the **Repositories** grid by the content type each connection contains.

1. Select **Create** to create your connection. For example:

    :::image type="content" source="media/ci-cd/create-new-connection.png" alt-text="Screenshot of a new repository connection.":::

After the connection is created, a new workflow is generated in GitHub, and the content stored in your repository is deployed to your Azure Sentinel workspace.

### Viewing GitHub deployment status

You can view the status of your Azure Sentinel content deployment in GitHub, on the **GitHub Actions** page. 

Select the workflow file shown there to access detailed deployment logs and any specific error messages, if relevant.

### Customize the GitHub deployment workflow

TBD

## Connect an Azure DevOps repository

TBD

### Customize the Azure DevOps deployment workflow

TBD

## Edit or delete content in your repository

After you've successfully created connections to your source control repository, we recommend that you edit any content stored there *only* in the repository, and not in Azure Sentinel. For example, to make changes to your analytics rules, do so directly in GitHub or a local editing tool.

If you've edited the content in Azure Sentinel, make sure to export it to your source control repository to prevent your changes from being overwritten the next time the repository content is deployed to your workspace.


## Remove a source control connection

This procedure describe how to remove the connection to a source control repository from Azure Sentinel. 

After you've removed your connection, content that was previously deployed via the connection remains in your Azure Sentinel workspace. Content added to the repository after removing the connection is not deployed.

**To remove your connection**:

1. In Azure Sentinel, on the left under **Content management**, select **Repositories**.
1. Select the connection you want to remove, and then select **Delete**.


## Known issues

The Public preview of the **Repositories** tab includes the following known issues:

TBD

## Next steps

Use your custom content in Azure Sentinel in the same way that you'd use built-in content.

For more information, see:

- [Discover and deploy Azure Sentinel solutions (Public preview)](sentinel-solutions-deploy.md)
- [Azure Sentinel data connectors](connect-data-sources.md)
- [Azure Sentinel Information Model (ASIM) parsers (Public preview)](normalization-about-parsers.md)
- [Visualize collected data](get-visibility.md)
- [Create custom analytics rules to detect threats](detect-threats-custom.md)
- [Hunt for threats with Azure Sentinel](hunting.md)
- [Use Jupyter notebooks to hunt for security threats](notebooks.md)
- [Use Azure Sentinel watchlists](watchlists.md)
- [Automate threat response with playbooks in Azure Sentinel](automate-responses-with-playbooks.md)

