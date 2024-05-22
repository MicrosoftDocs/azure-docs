---
title: Manage hub workspaces in portal
titleSuffix: Azure Machine Learning
description: Learn how to manage Azure Machine Learning hub workspaces in the Azure portal.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: deeikele
author: deeikele
ms.reviewer: blackmist
ms.date: 05/09/2024
ms.topic: how-to
---

# Manage Azure Machine Learning hub workspaces in the portal

In this article, you create, view, and delete [**Azure Machine Learning hub workspaces**](concept-hub-workspace.md) for [Azure Machine Learning](overview-what-is-azure-machine-learning.md), with the [Azure portal](https://portal.azure.com).

> [!TIP]
> An Azure Machine Learning hub workspace and an Azure AI Studio hub are the same thing. Azure AI Studio brings multiple Azure AI resources together for a unified experience. Azure Machine Learning is one of the resources, and provides both Azure AI Studio hub and project workspaces. Hub and project workspaces can be used from both Azure Machine Learning studio and Azure AI Studio.

As your needs change or your automation requirements increase, you can manage workspaces [with the CLI](how-to-manage-workspace-cli.md), [Azure PowerShell](how-to-manage-workspace-powershell.md), or [via the Visual Studio Code extension](how-to-setup-vs-code.md).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

## Limitations

[!INCLUDE [register-namespace](includes/machine-learning-register-namespace.md)]

* For network isolation with online endpoints, you can use workspace-associated resources (Azure Container Registry (ACR), Storage account, Key Vault, and Application Insights) from a resource group different from your workspace. However, these resources must belong to the same subscription and tenant as your workspace. For information about the limitations that apply to securing managed online endpoints, using a workspace's managed virtual network, see [Network isolation with managed online endpoints](concept-secure-online-endpoint.md#limitations).

* Workspace creation also creates an Azure Container Registry (ACR) by default. Since ACR doesn't currently support unicode characters in resource group names, use a resource group that avoids these characters.

* Azure Machine Learning doesn't support hierarchical namespace (Azure Data Lake Storage Gen2 feature) for the default storage account of the workspace.

[!INCLUDE [application-insight](includes/machine-learning-application-insight.md)]

## Create a hub

Use the following steps to create a hub from the Azure portal:

1. From the Azure portal, search for `Azure AI Studio` and create a new resource by selecting **+ New Azure AI**
1. Enter your AI hub name, subscription, resource group, and location details.
1. For advanced settings, select **Next: Resources** to specify resources, networking, encryption, identity, and tags. 

    :::image type="content" source="../ai-studio/media/how-to/resource-create-basics.png" alt-text="Screenshot of the option to set Azure AI hub basic information." lightbox="../ai-studio/media/how-to/resource-create-basics.png":::

1. Select an existing **Azure AI services** resource or create a new one. New Azure AI services include multiple API endpoints for Speech, Content Safety and Azure OpenAI. You can also bring an existing Azure OpenAI resource. Optionally, choose an existing **Storage account**, **Key vault**, **Container Registry**, and **Application insights** to host artifacts generated when you use AI Studio.

    > [!TIP]
    > You can skip selecting Azure AI Services if you plan to only work in Azure Machine Learning studio. Azure AI Services is required for Azure AI Studio, and provide access to pre-built AI models for use in prompt flow.

    :::image type="content" source="../ai-studio/media/how-to/resource-create-resources.png" alt-text="Screenshot of the Create an Azure AI hub with the option to set resource information." lightbox="../ai-studio/media/how-to/resource-create-resources.png"::: 

1. Set up Network isolation. Read more on [network isolation](../ai-studio/how-to/configure-managed-network.md). For a walkthrough of creating a secure Azure AI hub, see [Create a secure Azure AI hub](../ai-studio/how-to/create-secure-ai-hub.md).

    :::image type="content" source="../ai-studio/media/how-to/resource-create-networking.png" alt-text="Screenshot of the Create an Azure AI hub with the option to set network isolation information." lightbox="../ai-studio/media/how-to/resource-create-networking.png":::  

1. Set up data encryption. You can either use **Microsoft-managed keys** or enable **Customer-managed keys**. 

    :::image type="content" source="../ai-studio/media/how-to/resource-create-encryption.png" alt-text="Screenshot of the Create an Azure AI hub with the option to select your encryption type." lightbox="../ai-studio/media/how-to/resource-create-encryption.png":::

1. By default, **System assigned identity** is enabled, but you can switch to **User assigned identity** if existing storage, key vault, and container registry are selected in Resources.

    :::image type="content" source="../ai-studio/media/how-to/resource-create-identity.png" alt-text="Screenshot of the Create an Azure AI hub with the option to select a managed identity." lightbox="../ai-studio/media/how-to/resource-create-identity.png":::
   
    >[!Note]
    >If you select **User assigned identity** and also selected an Azure AI Service, your identity needs to have the `Cognitive Services Contributor` role in order to successfully create a new Azure AI hub.
    
1. Add tags.

    :::image type="content" source="../ai-studio/media/how-to/resource-create-tags.png" alt-text="Screenshot of the Create an Azure AI hub with the option to add tags." lightbox="../ai-studio/media/how-to/resource-create-tags.png":::

1. Select **Review + create**

## Manage your hub from the Azure portal

### Manage access control

Manage role assignments from **Access control (IAM)** within the Azure portal. Learn more about hub [role-based access control](../ai-studio/concepts/rbac-ai-studio.md).

To add grant users permissions: 
1. Select **+ Add** to add users to your hub.

1. Select the **Role** you want to assign.

    :::image type="content" source="../ai-studio/media/how-to/resource-rbac-role.png" alt-text="Screenshot of the page to add a role within the Azure AI hub Azure portal view." lightbox="../ai-studio/media/how-to/resource-rbac-role.png":::

1. Select the **Members** you want to give the role to.  

    :::image type="content" source="../ai-studio/media/how-to/resource-rbac-members.png" alt-text="Screenshot of the add members page within the Azure AI hub Azure portal view." lightbox="../ai-studio/media/how-to/resource-rbac-members.png":::

1. **Review + assign**. It can take up to an hour for permissions to be applied to users.

### Networking

Hub networking settings can be set during resource creation or changed in the **Networking** tab in the Azure portal view. Creating a new hub invokes a managed virtual network. This streamlines and automates your network isolation configuration with a built-in managed virtual network. The managed virtual network settings are applied to all project workspaces created within a hub. 

At hub creation, select between the networking isolation modes: **Public**, **Private with Internet Outbound**, and **Private with Approved Outbound**. To secure your resource, select either **Private with Internet Outbound** or Private with Approved Outbound for your networking needs. For the private isolation modes, a private endpoint should be created for inbound access. For more information on network isolation, see [Managed virtual network isolation](../ai-studio/how-to/configure-managed-network.md). To create a secure hub, see [Create a secure Azure AI hub](../ai-studio/how-to/create-secure-ai-hub.md). 

At hub creation in the Azure portal, creation of associated Azure AI services, Storage account, Key vault, Application insights, and Container registry is given. These resources are found on the Resources tab during creation. 

To connect to Azure AI services (Azure OpenAI, Azure AI Search, and Azure AI Content Safety) or storage accounts in Azure AI Studio, create a private endpoint in your virtual network. Ensure the public network access (PNA) flag is disabled when creating the private endpoint connection. For more about Azure AI services connections, see [Azure AI services and virtual networks](../ai-services/cognitive-services-virtual-networks.md). You can optionally bring your own (BYO) search, but this requires a private endpoint connection from your virtual network.

### Encryption

Projects that use the same hub, share their encryption configuration. Encryption mode can be set only at the time of hub creation between Microsoft-managed keys and Customer-managed keys. 

From the Azure portal view, navigate to the encryption tab, to find the encryption settings for your hub. 
For hubs that use customer-managed key encryption mode, you can update the encryption key to a new key version. This update operation is constrained to keys and key versions within the same Key Vault instance as the original key.

:::image type="content" source="../ai-studio/media/how-to/resource-manage-encryption.png" alt-text="Screenshot of the Encryption page of the Azure AI hub in the Azure portal." lightbox="../ai-studio/media/how-to/resource-manage-encryption.png":::

### Update Azure Application Insights and Azure Container Registry

To use custom environments for Prompt Flow, you're required to configure an Azure Container Registry for your AI hub. To use Azure Application Insights for Prompt Flow deployments, a configured Azure Application Insights resource is required for your AI hub.

You can configure your hub for these resources during creation or update after creation. To update Azure Application Insights from the Azure portal, navigate to the **Properties** for your hub in the Azure portal, then select **Change Application Insights**. You can also use the Azure SDK/CLI options or infrastructure-as-code templates to update both Azure Application Insights and Azure Container Registry for the AI Hub.

:::image type="content" source="../ai-studio/media/how-to/resource-manage-update-associated-resources.png" alt-text="Screenshot of the properties page of the Azure AI resource in the Azure portal." lightbox="../ai-studio/media/how-to/resource-manage-update-associated-resources.png":::

## Next steps

Once you have a workspace hub, you can Create a project using [Azure Machine Learning studio](how-to-manage-workspace.md?tabs=mlstudio), [AI Studio](../ai-studio/how-to/create-projects.md), [Azure SDK](how-to-manage-workspace.md?tabs=python), or [Using automation templates](how-to-create-workspace-template.md).
