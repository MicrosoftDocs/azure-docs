---
title: How to create and manage an Azure AI resource
titleSuffix: Azure AI services
description: This article describes how to create and manage an Azure AI resource
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# How to create and manage an Azure AI resource

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

As an administrator, you can create and manage Azure AI resources. You use an Azure AI resource to organize your Azure AI projects and other resources for Azure AI Studio. You can create and manage an Azure AI resource from the Azure portal or from the Azure AI Studio. 

In this article, you learn how to create an Azure AI resource from the Azure portal and manage it from the Azure portal and Azure AI Studio.

## Create an Azure AI resource in the Azure portal

1. From the Azure portal, go to Azure AI Studio and create a new resource by selecting **+ New Azure AI**
2.	Fill in **Subscription**, **Resource group**, and **Region**. **Name** your new Azure AI resource.  
    + For advanced settings, select **Next: Resources** to specify resources, networking, encryption, identity, and tags. 
    + Your subscription must have access to Azure AI to create this resource.

    :::image type="content" source="../media/how-to/resource-create-basics.png" alt-text="Screenshot of the Create an Azure AI resource with the option to set basic information." lightbox="../media/how-to/resource-create-basics.png":::

3.	Select an existing **Azure AI service** or create a new one. You can also use an existing **Storage account**, **Key vault**, and **Application insights**. Add a **Container registry** (optional).

    :::image type="content" source="../media/how-to/resource-create-resources.png" alt-text="Screenshot of the Create an Azure AI resource with the option to set resource information." lightbox="../media/how-to/resource-create-resources.png"::: 

4.	Set up Network isolation. Read more on [network isolation](configure-managed-network.md).

    :::image type="content" source="../media/how-to/resource-create-networking.png" alt-text="Screenshot of the Create an Azure AI resource with the option to set network isolation information." lightbox="../media/how-to/resource-create-networking.png":::  

5.	Set up data encryption. You can either use **Microsoft-managed keys** or enable **Customer-managed keys**. 

    :::image type="content" source="../media/how-to/resource-create-encryption.png" alt-text="Screenshot of the Create an Azure AI resource with the option to select your encryption type." lightbox="../media/how-to/resource-create-encryption.png":::

6.	By default, **System assigned identity** is enabled, but you can switch to **User assigned identity** if existing storage, key vault, and container registry are selected in Resources.

    :::image type="content" source="../media/how-to/resource-create-identity.png" alt-text="Screenshot of the Create an Azure AI resource with the option to select a managed identity." lightbox="../media/how-to/resource-create-identity.png":::

7.	Add tags.

    :::image type="content" source="../media/how-to/resource-create-tags.png" alt-text="Screenshot of the Create an Azure AI resource with the option to add tags." lightbox="../media/how-to/resource-create-tags.png":::

8.	Select **Review + create**


## Manage your Azure AI resource from the Azure portal

### Azure AI resource keys
View your keys and endpoints for your Azure AI resource from the overview page within the Azure portal.

:::image type="content" source="../media/how-to/resource-manage-view-keys.png" alt-text="Screenshot of the Azure AI resource in the Azure portal showing the keys and endpoints." lightbox="../media/how-to/resource-manage-view-keys.png":::

### Manage access control
Role-based access control
Manage role assignments from **Access control (IAM)** within the Azure portal. Learn more about Azure AI resource [role-based access control](../concepts/rbac-ai-studio.md).

To add grant users permissions: 
1.	Select **+ Add** to add users to your Azure AI resource

2.	Select the **Role** you want to assign.

    :::image type="content" source="../media/how-to/resource-rbac-role.png" alt-text="Screenshot of the add a role page within the Azure AI resource Azure portal view." lightbox="../media/how-to/resource-rbac-role.png":::

3.	Select the **Members** you want to give the role to.  

    :::image type="content" source="../media/how-to/resource-rbac-members.png" alt-text="Screenshot of the add members page within the Azure AI resource Azure portal view." lightbox="../media/how-to/resource-rbac-members.png":::

4.	**Review + assign**. It can take up to an hour for permissions to be applied to users.

### Networking
Azure AI resource networking settings can be set during resource creation or changed in the Networking tab in the Azure portal view. Creating a new Azure AI resource invokes a Managed Virtual Network. This streamlines and automates your network isolation configuration with a built-in Managed Virtual Network. The Managed Virtual Network settings are applied to all projects created within an Azure AI resource. 

At Azure AI resource creation, select between the three networking isolation modes: Public, Private with Internet Outbound, and Private with Approved Outbound. To secure your resource, select either Private with Internet Outbound or Private with Approved Outbound for your networking needs. For the private isolation modes, a private endpoint should be created for inbound access. Read more information on Network Isolation and Managed Virtual Network Isolation [here](../../machine-learning/how-to-managed-network.md). To create a secure Azure AI resource, follow the tutorial [here](../../machine-learning/tutorial-create-secure-workspace.md). 

At Azure AI resource creation in the Azure portal, creation of associated Azure AI services, Storage account, Key vault, Application insights, and Container registry is given. These resources are found on the Resources tab during creation. 

To connect to Azure AI services (Azure OpenAI, Azure AI Search, and Azure AI Content Safety) or storage accounts in Azure AI Studio, create a private endpoint in your virtual network. Ensure the PNA flag is disabled when creating the private endpoint connection. For more about Azure AI service connections, follow documentation [here](../../ai-services/cognitive-services-virtual-networks.md). Users can optionally bring your own (BYO) search, but this requires a private endpoint connection from your virtual network.

### Encryption
Projects that use the same Azure AI resource, share their encryption configuration. Encryption mode can be set only at the time of Azure AI resource creation between Microsoft-managed keys and Customer-managed keys. 

From the Azure portal view, navigate to the encryption tab, to find the encryption settings for your AI resource. 
For Azure AI resources that use CMK encryption mode, you can update the encryption key to a new key version. This update operation is constrained to keys and key versions within the same Key Vault instance as the original key.

:::image type="content" source="../media/how-to/resource-manage-encryption.png" alt-text="Screenshot of the Encryption page of the Azure AI resource in the Azure portal." lightbox="../media/how-to/resource-manage-encryption.png":::

## Manage your Azure AI resource from the Manage tab within the AI Studio

### Getting started with the AI Studio

When you enter your AI Studio, under **Manage**, you have the options to create a new Azure AI resource, manage an existing Azure AI resource, or view your Quota.

:::image type="content" source="../media/how-to/resource-manage-studio.png" alt-text="Screenshot of the Manage page of the Azure AI Studio." lightbox="../media/how-to/resource-manage-studio.png":::

### Managing an Azure AI resource
When you manage a resource, you see an Overview page that lists **Projects**, **Description**, **Resource Configuration**, **Connections**, and **Permissions**. You also see pages to further manager **Permissions**, **Compute instances**, **Connections**, **Policies**, and **Billing**.

You can view all Projects that use this Azure AI resource. Be linked to the Azure portal to manage the Resource Configuration. Manage who has access to this Azure AI resource. View all of the connections within the resource. Manage who has access to this Azure AI resource.

:::image type="content" source="../media/how-to/resource-manage-details.png" alt-text="Screenshot of the Details page of the Azure AI Studio showing an overview of the resource." lightbox="../media/how-to/resource-manage-details.png":::

### Permissions
Within Permissions you can view who has access to the Azure AI resource and also manage permissions. Learn more about [permissions](../concepts/rbac-ai-studio.md).
To add members:
1.	Select **+ Add member**
2.	Type the member's name in **Add member** and assign a **Role**. For most users, we recommend the AI Developer role. This permission applies to the entire Azure AI resource. If you wish to only grant access to a specific Project, manage permissions in the [Project](create-projects.md)

### Compute instances
View and manage computes for your Azure AI resource. Create computes, delete computes, and review all compute resources you have in one place.

### Connections
From the Connections page, you can view all Connections in your Azure AI resource by their Name, Authentication method, Category type, if the connection is shared to all projects in the resource or specifically to a Project, Target, Owner, and Provisioning state.

You can also add a connection through **+ Connection**  

Learn more on how to [create and manage Connections](connections-add.md). Connections created in the Azure AI resource Manage page are automatically shared across all projects. If you want to make a project specific connection, make that within the Project.

### Policies
View and configure policies for your Azure AI resource. See all the policies you have in one place. Policies are applied across all Projects.

### Billing
Here you're linked to the Azure portal to review the cost analysis information for your Azure AI resource.


## Next steps

- [Create a project](create-projects.md)
- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
- [Learn more about Azure AI resources](../concepts/ai-resources.md)
