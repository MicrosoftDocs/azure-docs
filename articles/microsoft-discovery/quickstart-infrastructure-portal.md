---
title: "Quickstart: Get started with Microsoft Discovery Infrastructure"
description: Set up Microsoft Discovery infrastructure by creating a supercomputer, workspace, project, agents, investigations, and then run your first AI-powered scientific investigation.
author: surajmb
ms.author: surmb
ms.service: azure
ms.topic: quickstart
ms.date: 03/17/2026
ms.custom:
  - template-quickstart

#customer intent: As a scientist or engineer, I want to set up Microsoft Discovery infrastructure so that I can run AI-powered scientific investigations.

---

# Quickstart: Get started with Microsoft Discovery Infrastructure

In this quickstart, you set up your Microsoft Discovery environment to run your first AI-powered scientific investigation. You complete the following tasks:

- Set up networking, identity, and storage
- Create a supercomputer
- Create a workspace
- Assign the Azure AI User role on the managed resource group
- Sign-in to Microsoft Discovery Studio
- Create a project

## Prerequisites

- An active [Azure subscription](https://aka.ms/discovery/publicpreviewportal) that is enabled for Microsoft Discovery **Public Preview** support.
- Once your subscription is enabled, use this [Azure portal URL](https://aka.ms/discovery/PublicPreviewPortal) to create resources using public preview API version (v2).
> [!NOTE]
> For resources created using the public preview API version, ensure it has a `"version" : "v2"` tag added to it. If you create the resources using the link above, it is added automatically.
- **Sufficient permissions** in your Azure subscription to register resource providers and create resources:
  - The **Owner** or **Role Based Access Control Administrator** or **User Access Administrator** role is required to assign roles to administrators (Platform Admins, Scientists, and Engineers) who manage and use Discovery resources. For more information, see [Assign roles to administrators](#assign-roles-to-administrators).
- **Microsoft Foundry, Azure OpenAI quotas, and VM SKU/quotas** available in your chosen region. See [Quota reservations](./concept-quota-reservation.md) to learn more.
- An existing **resource group**, or permissions to [create a new one](../azure-resource-manager/management/manage-resource-groups-portal.md). Creating a resource group requires **Contributor** role on the subscription.
- A **virtual network and subnets** for your workspace and supercomputer. See [Create a virtual network and subnets](#create-a-virtual-network-and-subnets).
- **User Assigned Managed Identities (UAMI)** with the required Azure role assignments for your supercomputer, workspace, and Azure Blob Storage. See [Create a User Assigned Managed Identity (UAMI)](#create-a-user-assigned-managed-identity-uami).

> [!IMPORTANT]
> Microsoft Discovery resources are supported in four production regions: **East US**, **East US 2**, **Sweden Central**, and **UK South**. Create all resources for a single deployment in the same region, subscription, and resource group for simplicity.

## 1. Set up networking, identity, and storage

### Register resource providers

To register a resource provider in your Azure subscription, you need to have a Contributor or higher privileged role (for example, Owner) and follow these steps:

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal).
1. Navigate to **Subscriptions** and select your subscription.
1. In the left-hand menu, select **Resource Providers**.
1. Search for `Microsoft.Discovery`.
1. Select the provider name and select **Register**.

> [!NOTE]
> Ensure that the following resource providers are also registered on your subscription. If not, register them:
> `Microsoft.Network`, `Microsoft.Compute`, `Microsoft.Storage`, `Microsoft.ManagedIdentity`, `Microsoft.AlertsManagement`, `Microsoft.Authorization`, `Microsoft.CognitiveServices`, `Microsoft.ContainerInstance`, `Microsoft.ContainerRegistry`, `Microsoft.ContainerService`, `Microsoft.DocumentDB`, `Microsoft.Features`, `Microsoft.KeyVault`, `Microsoft.MachineLearningServices`, `Microsoft.OperationalInsights`, `Microsoft.ResourceGraph`, `Microsoft.Search`, `Microsoft.Web`, `Microsoft.Insights`, `Microsoft.Resources`, `Microsoft.Sql`, `Microsoft.App`, `Microsoft.Bing`

### Assign roles to administrators

Assign the following built-in roles to users at the desired scope (subscription or resource group):

- Microsoft Discovery Platform Administrator (Preview)
- Managed Identity Contributor
- Managed Identity Operator
- Storage Account Contributor
- Storage Blob Data Contributor
- Network Contributor
- ACRPush
- Azure AI Owner (Workspace MRG level)
- Microsoft Discovery Bookshelf Index Data Reader (Preview) 

> [!IMPORTANT]
> Microsoft Discovery workspaces, bookshelves and supercomputers are network-hardened by default. Before you create your first workspace or bookshelf or supercomputer, you must also create the **Discovery NSP Perimeter Joiner** custom role and assign it to the Discovery first-party service principal so the control plane can configure Network Security Perimeters in your subscription. For step-by-step instructions, see [Assign the NSP Perimeter Joiner role](how-to-configure-network-security.md?tabs=azure-cli#assign-the-nsp-perimeter-joiner-role).

**Steps to assign roles:**

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal).
1. Navigate to **Subscriptions** and select your subscription.
1. In the left-hand menu, select **Access control (IAM)**.
1. Select **Add**, then select **Add role assignment**.
   :::image type="content" source="media/quickstart-infrastructure-portal/assign-role.jpg" alt-text="Screenshot showing the Add role assignment option in Access control (IAM)." lightbox="media/quickstart-infrastructure-portal/assign-role.jpg":::
1. On the **Add role assignment** pane, search for each role listed above **one role at a time**, then select **Next**.
1. On the **Members** tab, ensure **Assign access to** is set to **User, group, or service principal**.
1. Select **+ Select members**, choose the members to assign this permission to, then select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/assign-role-members.jpg" alt-text="Screenshot showing the Members tab for adding role assignment members." lightbox="media/quickstart-infrastructure-portal/assign-role-members.jpg":::
1. On the **Conditions** tab, select **Allow user to assign all roles except privileged administrator roles Owner, UAA, RBAC (Recommended)**, then select **Next**.
1. On the **Assignment Type** tab, select the configuration that best suits your organization, then select **Next**.
1. On the **Review + assign** tab, verify all the information and select **Review + assign**.

Repeat this process for all roles listed above.

### Create a virtual network and subnets

> [!NOTE]
> A virtual network can only be associated with one Microsoft Discovery workspace. If you need multiple workspaces, create a separate virtual network and subnets for each one.

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal).
1. Search for **Virtual networks** and select it from the results.
1. Select **Create** to start creating a new virtual network.
1. Enter details such as Subscription, Resource Group, Name, and Region, then select **Next**.
1. Configure IP addresses:
   - **IPv4 address space**: Enter your chosen CIDR block (for example, `10.0.0.0/16`).
   - Add the following subnets:
     - `supercomputerNodepoolSubnet`: `10.0.1.0/24`
     - `aksSubnet`: `10.0.2.0/24`
     - `workspaceSubnet`: `10.0.3.0/24`
     - `privateEndpointSubnet`: `10.0.4.0/24`
     - `agentSubnet`: `10.0.5.0/24`
     - `searchSubnet`: `10.0.6.0/24`
1. For `workspaceSubnet`, `agentSubnet` and `searchSubnet`, under **SubnetDelegation**, select `Microsoft.App/environments`.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-vnet-subnet-delegation.jpg" alt-text="Screenshot of the Create virtual network subnet page showing subnet delegation settings." lightbox="media/quickstart-infrastructure-portal/create-vnet-subnet-delegation.jpg":::
1. Optionally, you can remove the `default` subnet from the list. 
1. Review and create the virtual network.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-vnet-ip-config.jpg" alt-text="Screenshot of the Create virtual network page showing IP address configuration." lightbox="media/quickstart-infrastructure-portal/create-vnet-ip-config.jpg":::

> [!NOTE]
> Network Security Groups (NSGs) aren't mentioned in this step, but it's a general best practice to implement NSGs for each subnet in a virtual network, depending on your organization's policies.

### Create a user assigned managed identity (UAMI)

You can create different UAMIs each with their own required permissions for specific resource access, or you can create a single UAMI with all necessary permissions for the platform. For this exercise, create a single UAMI by following these steps:

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal).
1. Search for **Managed Identities** and select it from the list.
1. Select **Create**.
1. Fill in the required details such as subscription, resource group, region, and name.
1. Select **Review + Create**, then select **Create**.

Assign the following built-in roles to the new User Assigned Managed Identity at Resource Group level:

- Microsoft Discovery Platform Contributor (Preview)
- Storage Blob Data Contributor
- ACRPull

1. Navigate to **Subscriptions** and select your subscription.
1. Select the **resource group** that you are using for this exercise.
1. In the left-hand menu, select **Access control (IAM)**.
1. Select **Add**, then select **Add role assignment**.
1. On the **Add role assignment** pane, search for each role listed above **one role at a time**, then select **Next**.
1. On the **Members** tab, ensure **Assign access to** is set to **Managed Identity**.
1. Select **+ Select members**. In the **Select managed identities** pane, select your subscription, select **User-assigned managed identity** type, select the managed identity you created in the previous step, then select **Select**.
1. On the **Review + assign** tab, verify all the information and select **Review + assign**.

:::image type="content" source="media/quickstart-infrastructure-portal/assign-roles-uami.jpg" alt-text="Screenshot of the Azure portal showing UAMI role assignment." lightbox="media/quickstart-infrastructure-portal/assign-roles-uami.jpg":::

### Create an Azure Blob Storage account

To store input and output data for your investigations, create an Azure blob storage account to associate with your storage container or use an existing one with the following requirements:

- Create a container within the storage account named `discoveryoutputs` where the output files will be stored.
- The storage account must allow access from the Virtual Network used to create the supercomputer and workspace.
- The storage account must allow access from your client public IP or local network so you can access the output data.
- The storage account must have the correct CORS settings. You must allow these origins: `https://studio.discovery.microsoft.com`, `https://vscode.dev`, and `https://*.vscode-cdn.net`. Set the allowed operations to include `GET`, `HEAD`, `DELETE`, and `PUT` and set `Allowed Headers` and `Exposed Headers` to `*`, and `Max Age` to `200`. This setting is found under the **Resource sharing (CORS)** page under the **Settings** tab.
- Ensure that the storage account has `Storage Blob Data Contributor` access to the UAMI created in the [previous step](#create-a-user-assigned-managed-identity-uami).

**To create an Azure blob storage account:**

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal).
1. Search for **Storage accounts** and select it from the results.
1. Select **Create** to start creating a new storage account.
1. Enter details such as Subscription, Resource Group, Name, and Region.
1. Select **Azure Blob Storage** as the primary service, then select the **Networking** tab.
1. Under public network access, select **Enable public access from selected virtual networks and IP addresses**.
1. Select the Virtual Network and all subnets created in [step 1](#1-set-up-networking-identity-and-storage).
1. Select **Add your client IP address** if you're accessing data over the internet, or ensure your client can access the storage account and VNet via private link, Site-to-Site VPN, or ExpressRoute.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-storage-blob-networking.jpg" alt-text="Screenshot showing the networking configuration for the storage account." lightbox="media/quickstart-infrastructure-portal/create-storage-blob-networking.jpg":::
1. Select **Review + create**, then select **Create**.

> [!NOTE]
> To view and download output files, your client/browser needs network access to the blob storage. You can allow public internet access (either open public access to all or allow your client's public IP address in the storage networking and firewall settings), or configure private access via Azure VPN or ExpressRoute.

#### Create a blob container

1. After the storage account is created, navigate to the storage account overview page.
1. In the left navigation pane, under **Data storage**, select **Containers**.
1. Select **Add container**.
1. Enter `discoveryoutputs` as the name and select **Create**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-storage-blob-container.jpg" alt-text="Screenshot showing the Add container dialog with discoveryoutputs as the name." lightbox="media/quickstart-infrastructure-portal/create-storage-blob-container.jpg":::

#### Enable CORS and UAMI access

1. Open the storage account we created in the previous step.
1. Under the **Settings** tab, select **Resource sharing (CORS)**.
1. Under **Blob service** in the **Allowed origins** column, enter `https://studio.discovery.microsoft.com`, `https://vscode.dev` and `https://*.vscode-cdn.net`. For all three, set the allowed operations to include `GET`, `HEAD`, `DELETE`, `OPTIONS`, and `PUT`. Set `Allowed Headers` and `Exposed Headers` to `*`, and `Max Age` to `200`.
1. Select **Save**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-storage-blob-cors.jpg" alt-text="Screenshot showing the CORS configuration for the storage account blob service." lightbox="media/quickstart-infrastructure-portal/create-storage-blob-cors.jpg":::

## 2. Create a supercomputer

To deploy and run scientific tools, index your data in Bookshelf knowledge bases, and execute GPU/CPU-intensive workloads for simulation and modeling, you need a supercomputer with associated node pools. The supercomputer provides the compute resources on a specific virtual network within your subscription.

1. Sign in to the Azure portal using this [link](https://aka.ms/discovery/publicpreviewportal). This link adds a custom feature flag to the Azure portal URL which enables you to create resources with Public Preview API.
1. Search for **Microsoft Discovery Supercomputers**.
1. Select **Create** and enter details such as Subscription ID, Resource Group name, Location, and Name, then select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-basics.jpg" alt-text="Screenshot showing the basic details page for creating a Microsoft Discovery Supercomputer." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-basics.jpg":::
1. In the **Networking** tab, select the Virtual Network and `aksSubnet` created in [step 1](#create-a-virtual-network-and-subnets), then select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-networking.jpg" alt-text="Screenshot showing the networking configuration for the supercomputer." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-networking.jpg":::
1. In the System SKU tab, select Standard_D4s_v6 as the System SKU for this deployment and select **Next**.
1. In the Identities tab, add the User Assigned Managed Identity (UAMI) created in [step 1](#create-a-user-assigned-managed-identity-uami) for the cluster identity, kubelet identity, and workload identity. Supercomputer instances use this managed identity to access data from your Azure resources. Once done, select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-identity.jpg" alt-text="Screenshot showing the identity configuration step for the supercomputer." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-identity.jpg":::
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-uami.jpg" alt-text="Screenshot showing the UAMI assigned to the supercomputer." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-uami.jpg":::
1. In the **Encryption** tab, since we're using Microsoft-managed keys for this exercise, **uncheck** the "Enable Customer Managed Keys" option and select **Next**.
1. Add tags as needed, and move to the next tab.
1. Review the Terms and Conditions and select **Next**.
1. Once validation is successful, select **Create**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-overview.jpg" alt-text="Screenshot of the Microsoft Discovery Supercomputer overview page after creation." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-overview.jpg":::

### Create node pools

After your supercomputer is created, follow these steps to create a node pool:

1. Open the Supercomputer that we created in the previous step.
1. In the left pane, select **Node pool** under **Settings**, then select **Create**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-node-pool.jpg" alt-text="Screenshot showing the create node pool option in the supercomputer settings." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-node-pool.jpg" :::
1. Enter the name and location for the node pool, then select **Next**.
   > [!NOTE]
   > Node pool names must be all lowercase, a maximum of 12 characters, must start with a letter, and can only contain letters and numbers.
1. On the **Networking** tab, select the Virtual Network and `supercomputerNodepoolSubnet` created in [step 1](#create-a-virtual-network-and-subnets). This must be the same virtual network selected for the supercomputer in [step 2](#2-create-a-supercomputer), then select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-node-pool-networking.jpg" alt-text="Screenshot showing the networking configuration for the supercomputer nodepool." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-node-pool-networking.jpg":::
1. On the **VM configuration** tab, select the Virtual Machine SKU to use for the nodepool, then select **Next**. The selected SKU and quota must be available in the region where you deploy the nodepool.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-node-pool-vm-sku.jpg" alt-text="Screenshot showing the VM SKU selection for the nodepool." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-node-pool-vm-sku.jpg":::
1. In the **Scaling** section, enter the maximum node count that your nodepool can scale to, for example: 5 and select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-node-pool-scaling.jpg" alt-text="Screenshot showing the scaling configuration for the nodepool." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-node-pool-scaling.jpg":::
1. Select **Review + Create** and **Create**.

## 3. Create a workspace

A workspace is a collaborative environment where teams manage large-scale scientific initiatives. Workspaces bring together the infrastructure resources such as supercomputers, agents, tools, and knowledge bases (Bookshelves) into a single secure boundary. You can create projects under workspaces, allowing researchers to organize experiments, analyze data, and use AI agents within a shared space.

> [!IMPORTANT]
> Make sure your workspace name is globally unique and uses only lowercase letters.

1. Sign in to the Azure portal using this [link](https://aka.ms/discovery/publicpreviewportal). This link adds a custom feature flag to the Azure portal URL which enables you to create resources with Public Preview API.
1. Search for **Microsoft Discovery Workspaces**.
1. Select **+ Create** and enter details such as Subscription, Resource Group, Name, and Region, then select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-workspace-basics.jpg" alt-text="Screenshot showing the basic details page for creating a Microsoft Discovery workspace." lightbox="media/quickstart-infrastructure-portal/create-workspace-basics.jpg":::
1. On the **Networking** tab, select "Public network access" as "Enable" for this exercise. After that, populate the details for Private Endpoint subnet, Agent subnet and Workspace subnet with the subnets created earlier in [step 1](#create-a-virtual-network-and-subnets), then select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-workspace-networking.jpg" alt-text="Screenshot showing the Networking tab while creating a workspace." lightbox="media/quickstart-infrastructure-portal/create-workspace-networking.jpg":::
1. On the **Encryption** tab, leave the Enable customer-managed keys (CMK) unchecked. For this exercise, we will use Microsoft-Managed Keys (MMK), just select **Next** to go to the next tab. 
1. On the **Supercomputer** tab, select **Add Supercomputer** and select your subscription, resource group, and the supercomputer created in [step 2](#2-create-a-supercomputer), then select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-workspace-supercomputer.jpg" alt-text="Screenshot showing the Supercomputer tab while creating a workspace." lightbox="media/quickstart-infrastructure-portal/create-workspace-supercomputer.jpg"::: 
1. On the **Workspace Identity** tab, select **Add** under **User Assigned Managed Identity (UAMI)** and select the identity created in [step 1](#create-a-user-assigned-managed-identity-uami) to provide access to the workspace.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-workspace-identity.jpg" alt-text="Screenshot showing the Workspace Identity tab with the UAMI added." lightbox="media/quickstart-infrastructure-portal/create-workspace-identity.jpg":::
1. Add tags as needed, and move to the next tab.
1. Review the Terms and Conditions, then select **Review + Create**.
1. Once validation is successful, select **Create**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-workspace-overview.jpg" alt-text="Screenshot of the Microsoft Discovery Workspace overview page after creation." lightbox="media/quickstart-infrastructure-portal/create-workspace-overview.jpg":::

## 4. Assign Azure AI User role on the managed resource group

When a workspace is created, a managed resource group is automatically provisioned alongside it. To allow users to modify agents and workflows within a project directly in Foundry portal for advanced settings, you must assign them the **Azure AI User** role on this managed resource group.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to the workspace created in [step 3](#3-create-a-workspace) and locate the **Managed Resource Group** name on the workspace overview page.
1. Navigate to that managed resource group.
1. In the left-hand menu, select **Access control (IAM)**.
1. Select **Add**, then select **Add role assignment**.
1. On the **Add role assignment** pane, search for **Azure AI User** and select it, then select **Next**.
1. On the **Members** tab, ensure **Assign access to** is set to **User, group, or service principal**.
1. Select **+ Select members**, choose the users who need to modify agents and workflows, then select **Select**.
1. Select **Review + assign**, verify the information, and select **Review + assign**.

Repeat this process for all users who require access to agents and workflows in the workspace. Any changes made in Foundry portal directly will be reflected in Discovery agent configuration automatically.

## 5. Create Chat Model Deployment

Chat model deployments provision foundational language models such as GPT-4o or GPT-5 for use within the Microsoft Discovery Workspace. Agents created within projects can use these chat model deployments.

1. Go to the overview page of Microsoft Discovery workspace, created in the previous step. 
1. Under the **Settings** tab on left navigation pane, select **Chat Model Deployments**.
1. Select the **+ Create** option at the top
1. Provide the **Model format** (only option available today is OpenAI) and **Model Name** in the drop-down. Use "gpt-4o" for this exercise.
1. Then select **Review + create** button at the bottom and select **Create**.

   :::image type="content" source="media/quickstart-infrastructure-portal/create-chat-model.jpg" alt-text="Screenshot of the Chat Model Deployment creation page." lightbox="media/quickstart-infrastructure-portal/create-chat-model.jpg":::

> [!IMPORTANT]
> If you plan to use the Discovery Engine, you must also create a chat model deployment named **gpt-5-2** using model **gpt-5.2**. The Discovery Engine requires this specific deployment for task validation. Repeat the steps above with the model name `gpt-5.2` and deployment name `gpt-5-2`.

You can provide access to users via [Role Based Access Control (RBAC)](../role-based-access-control/quickstart-assign-role-user-portal.md) at the resource group level. **Microsoft Discovery Administrator (Preview)** role is required to create projects within a workspace.

## 6. Log in to Microsoft Discovery Studio

Microsoft Discovery Studio is a secure, AI-powered research environment that enables scientists and engineers to accelerate innovation through autonomous agents, simulation workflows, and integrated data tools, all within a unified interface.

After your infrastructure is set up, you can log in to [Microsoft Discovery Studio](https://studio.discovery.microsoft.com) directly via the URL, or find the URL in the Workspace overview page in the Azure portal.

:::image type="content" source="media/quickstart-infrastructure-portal/studio-home.jpg" alt-text="Screenshot of the Microsoft Discovery Studio homepage after signing in." lightbox="media/quickstart-infrastructure-portal/studio-home.jpg":::

You must sign in with your Entra ID (work or school account) credentials. Studio supports single sign-on (SSO) with Entra ID so that you don't have to explicitly provide credentials if you're already signed in to another service with your Entra ID in the same browser.

> [!NOTE]
> If you have access to multiple Entra tenants, make sure the right tenant is selected when signing in by selecting your profile icon on the top right corner of the page.

## 7. Create storage containers

After you sign in to the studio, create storage containers to organize and manage your storage assets used in your projects.

Storage containers store both input and output data as storage assets. Both inputs and outputs use a storage container of type Azure Storage Blob, backed by the storage account created in [step 1](#create-an-azure-blob-storage-account).

1. In [Microsoft Discovery Studio](https://studio.discovery.microsoft.com), on the left navigation pane, select the **Data** tab.
1. **Storage Containers (new)** tab is selected by default.
1. Select **Create Container**.
1. Enter details such as name, subscription, resource group, and location.
1. Select the storage account created in [step 1](#create-an-azure-blob-storage-account).
   :::image type="content" source="media/quickstart-infrastructure-portal/create-storage-containers.jpg" alt-text="Screenshot showing the Storage Container creation page in Microsoft Discovery Studio." lightbox="media/quickstart-infrastructure-portal/create-storage-containers.jpg":::
1. Select **Create**.

> [!NOTE]
> After you select **Create**, the resource is initially in the **Accepted** state. Refresh the page and wait until the **Provisioning State** changes to **Succeeded** before proceeding. This operation typically takes a few minutes.

## 8. Create a project

Projects help you organize and manage scientific investigations within a workspace. Each project defines the functional boundary for access to your agents, tools, and storage containers. Within a project, you can run experiments, analyze data, apply AI models, and track research progress in a collaborative environment.

> [!IMPORTANT]
> Your project name must be all lowercase and no more than 12 characters long.

1. In **Microsoft Discovery Studio**, on the left navigation pane, select **Projects**. This lists all existing projects across your Azure subscriptions.
1. Select **Create Project**.
1. Enter the name of the project and select the workspace we created in [step 3](#3-create-a-workspace).
1. For this exercise, **uncheck** the "Create storage container for me" option
1. Select the storage container created in [step 7](#7-create-storage-containers).
1. Select **Create**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-project.jpg" alt-text="Screenshot showing the Project creation page in Microsoft Discovery Studio." lightbox="media/quickstart-infrastructure-portal/create-project.jpg":::

   :::image type="content" source="media/quickstart-infrastructure-portal/create-project-list.jpg" alt-text="Screenshot showing the Project list page after project creation in Microsoft Discovery Studio." lightbox="media/quickstart-infrastructure-portal/create-project-list.jpg":::

> [!NOTE]
> After you select **Create**, the project is initially in the **Accepted** state. Refresh the page and wait until the **Provisioning State** changes to **Succeeded** before proceeding.

## Next step

After you create your project, continue with the following next step:

- [Get started with agents and investigations in Microsoft Discovery Studio](quickstart-agents-studio.md)
- [Get started with agent bundles](quickstart-agents-bundles.md)
