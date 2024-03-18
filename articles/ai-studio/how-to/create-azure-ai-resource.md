---
title: How to create and manage an Azure AI hub resource
titleSuffix: Azure AI Studio
description: This article describes how to create and manage an Azure AI hub resource.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 2/5/2024
ms.reviewer: deeikele
ms.author: larryfr
author: Blackmist
---

# How to create and manage an Azure AI hub resource

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

As an administrator, you can create and manage Azure AI hub resources. Azure AI hub resources provide a hosting environment for the projects of a team, and help you as an IT admin centrally set up security settings and govern usage and spend. You can create and manage an Azure AI hub resource from the Azure portal or from the Azure AI Studio. 

In this article, you learn how to create and manage an Azure AI hub resource in Azure AI Studio (for getting started) and from the Azure portal (for advanced security setup).

## Create an Azure AI hub resource in AI Studio

To create a new Azure AI hub resource, you need either the Owner or Contributor role on the resource group or on an existing Azure AI hub resource. If you're unable to create an Azure AI hub resource due to permissions, reach out to your administrator. If your organization is using [Azure Policy](../../governance/policy/overview.md), don't create the resource in AI Studio. Create the Azure AI hub resource [in the Azure portal](#create-a-secure-azure-ai-hub-resource-in-the-azure-portal) instead.

Follow these steps to create a new Azure AI hub resource in AI Studio.

1. Go to the **Manage** page in [Azure AI Studio](https://ai.azure.com).
1. Select **+ New AI hub**.

1. Enter your AI hub name, subscription, resource group, and location details.

1. In the **Azure OpenAI** dropdown, you can select an existing Azure OpenAI resource to bring all your deployments into AI Studio. If you don't bring one, we'll create one for you.

    :::image type="content" source="../media/how-to/resource-create-advanced.png" alt-text="Screenshot of the Create an Azure AI hub resource wizard with the option to set basic information." lightbox="../media/how-to/resource-create-advanced.png":::

1. Optionally, connect an existing Azure AI Search instance to share search indices with all projects in this Azure AI hub resource. An Azure AI Search instance isn't created for you if you don't provide one.
1. Select **Next**.
1. On the **Review and finish** page, you see the **AI Services** provider for you to access the Azure AI services such as Azure OpenAI.

    :::image type="content" source="../media/how-to/resource-create-studio-review.png" alt-text="Screenshot of the review and finish page for creating an AI hub." lightbox="../media/how-to/resource-create-studio-review.png":::

1. Select **Create**.

When the AI hub is created, you can see it on the **Manage** page in AI Studio. You can see that initially no projects are created in the AI hub. You can [create a new project](./create-projects.md).

:::image type="content" source="../media/how-to/hub-resource-overview.png" alt-text="Screenshot of the new AI hub overview." lightbox="../media/how-to/hub-resource-overview.png":::

## Create a secure Azure AI hub resource in the Azure portal

If your organization is using [Azure Policy](../../governance/policy/overview.md), set up an Azure AI hub resource that meets your organization's requirements instead of using AI Studio for resource creation. 

1. From the Azure portal, search for `Azure AI Studio` and create a new resource by selecting **+ New Azure AI**
1. Enter your AI hub name, subscription, resource group, and location details.
1. For advanced settings, select **Next: Resources** to specify resources, networking, encryption, identity, and tags. 

    :::image type="content" source="../media/how-to/resource-create-basics.png" alt-text="Screenshot of the option to set Azure AI hub resource basic information." lightbox="../media/how-to/resource-create-basics.png":::

1. Select an existing **Azure AI services** resource or create a new one. New Azure AI services include multiple API endpoints for Speech, Content Safety and Azure OpenAI. You can also bring an existing Azure OpenAI resource. Optionally, choose an existing **Storage account**, **Key vault**, **Container Registry**, and **Application insights** to host artifacts generated when you use AI Studio.

    :::image type="content" source="../media/how-to/resource-create-resources.png" alt-text="Screenshot of the Create an Azure AI hub resource with the option to set resource information." lightbox="../media/how-to/resource-create-resources.png"::: 

1. Set up Network isolation. Read more on [network isolation](configure-managed-network.md).

    :::image type="content" source="../media/how-to/resource-create-networking.png" alt-text="Screenshot of the Create an Azure AI hub resource with the option to set network isolation information." lightbox="../media/how-to/resource-create-networking.png":::  

1. Set up data encryption. You can either use **Microsoft-managed keys** or enable **Customer-managed keys**. 

    :::image type="content" source="../media/how-to/resource-create-encryption.png" alt-text="Screenshot of the Create an Azure AI hub resource with the option to select your encryption type." lightbox="../media/how-to/resource-create-encryption.png":::

1. By default, **System assigned identity** is enabled, but you can switch to **User assigned identity** if existing storage, key vault, and container registry are selected in Resources.

    :::image type="content" source="../media/how-to/resource-create-identity.png" alt-text="Screenshot of the Create an Azure AI hub resource with the option to select a managed identity." lightbox="../media/how-to/resource-create-identity.png":::
    >[!Note]
    >If you select **User assigned identity**, your identity needs to have the `Cognitive Services Contributor` role in order to successfully create a new Azure AI hub resource.
    
1. Add tags.

    :::image type="content" source="../media/how-to/resource-create-tags.png" alt-text="Screenshot of the Create an Azure AI hub resource with the option to add tags." lightbox="../media/how-to/resource-create-tags.png":::

1. Select **Review + create**


## Manage your Azure AI hub resource from the Azure portal

### Azure AI hub resource keys

View your keys and endpoints for your Azure AI hub resource from the overview page within the Azure portal.

:::image type="content" source="../media/how-to/resource-manage-view-keys.png" alt-text="Screenshot of the Azure AI hub resource in the Azure portal showing the keys and endpoints." lightbox="../media/how-to/resource-manage-view-keys.png":::

### Manage access control

Manage role assignments from **Access control (IAM)** within the Azure portal. Learn more about Azure AI hub resource [role-based access control](../concepts/rbac-ai-studio.md).

To add grant users permissions: 
1. Select **+ Add** to add users to your Azure AI hub resource

1. Select the **Role** you want to assign.

    :::image type="content" source="../media/how-to/resource-rbac-role.png" alt-text="Screenshot of the page to add a role within the Azure AI hub resource Azure portal view." lightbox="../media/how-to/resource-rbac-role.png":::

1. Select the **Members** you want to give the role to.  

    :::image type="content" source="../media/how-to/resource-rbac-members.png" alt-text="Screenshot of the add members page within the Azure AI hub resource Azure portal view." lightbox="../media/how-to/resource-rbac-members.png":::

1. **Review + assign**. It can take up to an hour for permissions to be applied to users.

### Networking
Azure AI hub resource networking settings can be set during resource creation or changed in the **Networking** tab in the Azure portal view. Creating a new Azure AI hub resource invokes a Managed Virtual Network. This streamlines and automates your network isolation configuration with a built-in Managed Virtual Network. The Managed Virtual Network settings are applied to all projects created within an Azure AI hub resource. 

At Azure AI hub resource creation, select between the networking isolation modes: **Public**, **Private with Internet Outbound**, and **Private with Approved Outbound**. To secure your resource, select either **Private with Internet Outbound** or Private with Approved Outbound for your networking needs. For the private isolation modes, a private endpoint should be created for inbound access. Read more information on Network Isolation and Managed Virtual Network Isolation [here](../../machine-learning/how-to-managed-network.md). To create a secure Azure AI hub resource, follow the tutorial [here](../../machine-learning/tutorial-create-secure-workspace.md). 

At Azure AI hub resource creation in the Azure portal, creation of associated Azure AI services, Storage account, Key vault, Application insights, and Container registry is given. These resources are found on the Resources tab during creation. 

To connect to Azure AI services (Azure OpenAI, Azure AI Search, and Azure AI Content Safety) or storage accounts in Azure AI Studio, create a private endpoint in your virtual network. Ensure the PNA (Public Network Access) flag is disabled when creating the private endpoint connection. For more about Azure AI services connections, follow documentation [here](../../ai-services/cognitive-services-virtual-networks.md). You can optionally bring your own (BYO) search, but this requires a private endpoint connection from your virtual network.

### Encryption
Projects that use the same Azure AI hub resource, share their encryption configuration. Encryption mode can be set only at the time of Azure AI hub resource creation between Microsoft-managed keys and Customer-managed keys. 

From the Azure portal view, navigate to the encryption tab, to find the encryption settings for your Azure AI hub resource. 
For Azure AI hub resources that use CMK encryption mode, you can update the encryption key to a new key version. This update operation is constrained to keys and key versions within the same Key Vault instance as the original key.

:::image type="content" source="../media/how-to/resource-manage-encryption.png" alt-text="Screenshot of the Encryption page of the Azure AI hub resource in the Azure portal." lightbox="../media/how-to/resource-manage-encryption.png":::

### Update Azure Application Insights and Azure Container Registry

To use custom environments for Prompt Flow, you're required to configure an Azure Container Registry for your AI hub. To use Azure Application Insights for Prompt Flow deployments, a configured Azure Application Insights resource is required for your AI hub.

You can configure your AI hub for these resources during creation or update after creation. To update Azure Application Insights from the Azure portal, navigate to the **Properties** for your Azure AI hub resource in the Azure portal, then select **Change Application Insights**. You can also use the Azure SDK/CLI options or infrastructure-as-code templates to update both Azure Application Insights and Azure Container Registry for the AI Hub.

:::image type="content" source="../media/how-to/resource-manage-update-associated-resources.png" alt-text="Screenshot of the properties page of the Azure AI resource in the Azure portal." lightbox="../media/how-to/resource-manage-update-associated-resources.png":::

## Manage your Azure AI hub resource from the Manage tab within the AI Studio

### Getting started with the AI Studio

On the **Manage** page in [Azure AI Studio](https://ai.azure.com), you have the options to create a new Azure AI hub resource, manage an existing Azure AI hub resource, or view your quota.

:::image type="content" source="../media/how-to/resource-manage-studio.png" alt-text="Screenshot of the Manage page of the Azure AI Studio." lightbox="../media/how-to/resource-manage-studio.png":::

### Managing an Azure AI hub resource
When you manage a resource, you see an Overview page that lists **Projects**, **Description**, **Resource Configuration**, **Connections**, and **Permissions**. You also see pages to further manager **Permissions**, **Compute instances**, **Connections**, **Policies**, and **Billing**.

You can view all Projects that use this Azure AI hub resource. Be linked to the Azure portal to manage the Resource Configuration. Manage who has access to this Azure AI hub resource. View all of the connections within the resource. Manage who has access to this Azure AI hub resource.

:::image type="content" source="../media/how-to/resource-manage-details.png" alt-text="Screenshot of the Details page of the Azure AI Studio showing an overview of the resource." lightbox="../media/how-to/resource-manage-details.png":::

### Permissions
Within Permissions you can view who has access to the Azure AI hub resource and also manage permissions. Learn more about [permissions](../concepts/rbac-ai-studio.md).
To add members:
1.    Select **+ Add member**
1.    Enter the member's name in **Add member** and assign a **Role**. For most users, we recommend the AI Developer role. This permission applies to the entire Azure AI hub resource. If you wish to only grant access to a specific Project, manage permissions in the [Project](create-projects.md)

### Compute instances
View and manage computes for your Azure AI hub resource. Create computes, delete computes, and review all compute resources you have in one place.

### Connections
From the Connections page, you can view all Connections in your Azure AI hub resource by their Name, Authentication method, Category type, if the connection is shared to all projects in the resource or specifically to a Project, Target, Owner, and Provisioning state.

You can also add a connection through **+ Connection**  

Learn more on how to [create and manage Connections](connections-add.md). Connections created in the Azure AI hub resource Manage page are automatically shared across all projects. If you want to make a project specific connection, make that within the Project.

### Policies
View and configure policies for your Azure AI hub resource. See all the policies you have in one place. Policies are applied across all Projects.

### Billing
Here you're linked to the Azure portal to review the cost analysis information for your Azure AI hub resource.


## Next steps

- [Create a project](create-projects.md)
- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
- [Learn more about Azure AI hub resources](../concepts/ai-resources.md)
