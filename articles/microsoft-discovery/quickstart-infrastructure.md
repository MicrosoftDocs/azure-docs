---
title: "Quickstart: Deploy Microsoft Discovery infrastructure"
description: Deploy Microsoft Discovery infrastructure by using the Azure portal or Bicep, then run your first AI-powered scientific investigation.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: quickstart
ms.date: 09/04/2026
ms.custom:
  - template-quickstart
  - subject-armqs
  - mode-arm
  - devx-track-bicep

#customer intent: As a scientist or engineer, I want to set up Microsoft Discovery infrastructure so that I can run AI-powered scientific investigations.

---

# Quickstart: Deploy Microsoft Discovery infrastructure

In this quickstart, you set up your Microsoft Discovery environment so that you can run your first AI-powered scientific investigation. You can complete the setup in two ways:

- **Azure portal** – Create each resource manually through a guided, step-by-step experience. Choose this path if you want to understand each component or you prefer a UI-driven workflow.
- **Bicep** – Deploy the full stack with a single infrastructure-as-code template. Choose this path if you want a repeatable, automated deployment.

Both paths provision the same core resources: networking, identity, storage, a supercomputer with a node pool, a workspace with a chat model deployment, a storage container, and a project.

Select the tab that matches your preferred experience under [Deploy Microsoft Discovery infrastructure](#deploy-microsoft-discovery-infrastructure).

## Prerequisites

The following prerequisites apply to both the Azure portal and Bicep experiences:

- An active [Azure subscription](https://portal.azure.com) that's enabled (allow-listed) for Microsoft Discovery access. If your subscription isn't yet enabled, contact your Microsoft account representative to request access.
- **Sufficient permissions** in your Azure subscription to register resource providers, assign roles, and create resources:
  - The **Owner**, **Role Based Access Control Administrator**, or **User Access Administrator** role is required to assign roles to administrators (Platform Admins, Scientists, and Engineers) who manage and use Discovery resources. For the full list of required roles, see [Roles required by persona](concept-role-assignments.md#roles-required-by-persona).
  - A **Contributor** or higher privileged role (for example, **Owner**) is required to register resource providers and create a resource group.

    > [!TIP]
    > To assign the full **Platform Administrator** persona role set in a single, idempotent command, use the open-source `Set-DiscoveryRoleAssignments.ps1` PowerShell script. See [Assign Microsoft Discovery persona roles with a PowerShell script](how-to-assign-persona-roles.md). This method is the recommended path for onboarding multiple users.

- **Register the required resource providers** in your subscription. For more information, see [Resource provider registration](concept-resource-provider-registration.md). To register `Microsoft.Discovery`:
   1. Sign in to the [Azure portal](https://portal.azure.com).
   1. Navigate to **Subscriptions** and select your subscription.
   1. In the left-hand menu, select **Resource Providers**.
   1. Search for `Microsoft.Discovery`.
   1. Select the provider name and select **Register**.

   > [!NOTE]
   > Ensure that the following resource providers are also registered on your subscription. If not, register them:
   > `Microsoft.Network`, `Microsoft.Compute`, `Microsoft.Storage`, `Microsoft.ManagedIdentity`, `Microsoft.AlertsManagement`, `Microsoft.Authorization`, `Microsoft.CognitiveServices`, `Microsoft.ContainerInstance`, `Microsoft.ContainerRegistry`, `Microsoft.ContainerService`, `Microsoft.DocumentDB`, `Microsoft.Features`, `Microsoft.KeyVault`, `Microsoft.MachineLearningServices`, `Microsoft.OperationalInsights`, `Microsoft.ResourceGraph`, `Microsoft.Search`, `Microsoft.Web`, `Microsoft.Insights`, `Microsoft.Resources`, `Microsoft.Sql`, `Microsoft.App`, `Microsoft.Bing`

- **Assign the Discovery NSP Perimeter Joiner role.** Microsoft Discovery workspaces, bookshelves, and supercomputers are network-hardened by default using Network Security Perimeter (NSP) rules. Before you create your first workspace, bookshelf, or supercomputer, you must create the **Discovery NSP Perimeter Joiner** custom role. Once created, assign the **Discovery NSP Perimeter Joiner** custom role and the **Reader** role to the Discovery control-plane service App (the first-party service principal) so the control plane can configure Network Security Perimeters in your subscription. For step-by-step instructions, see [Assign the NSP Perimeter Joiner role](how-to-configure-network-security.md?tabs=azure-cli#assign-the-nsp-perimeter-joiner-role).
- **Microsoft Foundry, Azure OpenAI quotas, and VM SKU/quotas** available in your chosen region. See [Quota reservations](./concept-quota-reservation.md).
- An existing **resource group**, or permissions to [create a new one](../azure-resource-manager/management/manage-resource-groups-portal.md). Creating a resource group requires **Contributor** role on the subscription.

> [!IMPORTANT]
> Microsoft Discovery resources are supported in three production regions: **East US**, **Sweden Central**, and **UK South**. Create all resources for a single deployment in the same region, subscription, and resource group for simplicity.

> [!NOTE]
> You can associate a virtual network with only one Microsoft Discovery workspace. If you need multiple workspaces, create a separate virtual network and subnets for each one.

> [!IMPORTANT]
> If you deploy the networking resources into a separate resource group from your other Discovery resources, make sure you assign yourself the appropriate permissions on the virtual network's resource group so that the supercomputer resource deploys successfully. The permissions to consider are **Network Contributor** and **Microsoft Discovery Platform Administrator (Preview)**. If you use the Bicep template, update it to create the virtual network in that separate resource group.

> [!TIP]
> You can deploy Discovery resources with complete network isolation. When `networkIsolation` is enabled, all resources are shielded within the private network and are reachable only through the private endpoint and Network Security Perimeter (NSP). You can still reach the workspace over the public network through Discovery Studio and the REST API. To lock down access to your private network only, disable public network access for your workspace and create private endpoints for the workspace resources. For guidance, see [Configure network security for Microsoft Discovery workspaces](how-to-configure-network-security.md?tabs=azure-cli#create-private-endpoints-for-data-plane-access).

## Deploy Microsoft Discovery infrastructure

Select the **Azure portal** tab to create each resource manually, or the **Bicep** tab to deploy the full stack by using an infrastructure-as-code template.

# [Azure portal](#tab/portal)

Use the Azure portal to create each Microsoft Discovery resource through a guided experience.

### 1. Set up networking, identity, and storage

Before proceeding with the deployment of Microsoft Discovery infrastructure components, use an existing resource group or create a new one.

#### a. Assign roles to administrators

> [!TIP]
> Instead of assigning the roles listed below one-by-one through the Azure portal, you can assign the full **Platform Administrator** persona role set in a single, idempotent command using the open-source `Set-DiscoveryRoleAssignments.ps1` PowerShell script. See [Assign Microsoft Discovery persona roles with a PowerShell script](how-to-assign-persona-roles.md). This is the recommended path for onboarding multiple users.

Assign the following built-in roles to users at the desired scope (subscription or resource group):

- Microsoft Discovery Platform Administrator (Preview)
- Managed Identity Contributor
- Managed Identity Operator
- Storage Account Contributor
- Storage Blob Data Contributor
- Network Contributor
- ACRPush
- Foundry User
- Microsoft Discovery Bookshelf Index Data Reader - Preview

> [!NOTE]
> If you're assigning all roles at the subscription level, you can skip this note. If you're assigning roles at the resource group level, skip the **Foundry User** role for now. Continue with the next steps and revisit this role assignment after the workspace resource is created. This role must be assigned to each Platform Admin or Scientist user at the workspace managed resource group level.

**Steps to assign roles:**

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Subscriptions** and select your subscription.
1. In the left-hand menu, select **Access control (IAM)**.
1. Select **Add**, then select **Add role assignment**.
   :::image type="content" source="media/quickstart-infrastructure-portal/assign-role.jpg" alt-text="Screenshot showing the Add role assignment option in Access control (IAM)." lightbox="media/quickstart-infrastructure-portal/assign-role.jpg":::
1. On the **Add role assignment** pane, search for each role one at a time, then select **Next**.
1. On the **Members** tab, ensure **Assign access to** is set to **User, group, or service principal**.
1. Select **+ Select members**, choose the members to assign this permission to, then select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/assign-role-members.jpg" alt-text="Screenshot showing the Members tab for adding role assignment members." lightbox="media/quickstart-infrastructure-portal/assign-role-members.jpg":::
1. On the **Conditions** tab, select **Allow user to assign all roles except privileged administrator roles Owner, UAA, RBAC (Recommended)**, then select **Next**.
1. On the **Assignment Type** tab, select the configuration that best suits your organization, then select **Next**.
1. On the **Review + assign** tab, verify the information, and select **Review + assign**.

Repeat this process for all the required roles.

#### b. Create a virtual network and subnets

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Virtual networks** and select it from the results.
1. Select **Create** to start creating a new virtual network.
1. Enter details such as Subscription, Resource Group, Name, and Region, then select **Next**.
1. Configure IP addresses:
   - **IPv4 address space**: Enter your chosen CIDR (Classless Inter-Domain Routing) block (for example, `10.0.0.0/16`).
   - Add the following subnets:
     - `supercomputerNodepoolSubnet`: `10.0.1.0/24`
     - `aksSubnet`: `10.0.2.0/24`
     - `workspaceSubnet`: `10.0.3.0/24`
     - `privateEndpointSubnet`: `10.0.4.0/24`
     - `agentSubnet`: `10.0.5.0/24`
     - `searchSubnet`: `10.0.6.0/24`
1. For `workspaceSubnet`, `agentSubnet` and `searchSubnet`, under **SubnetDelegation**, select `Microsoft.App/environments`.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-vnet-subnet-delegation.jpg" alt-text="Screenshot of the Create virtual network subnet page showing subnet delegation settings." lightbox="media/quickstart-infrastructure-portal/create-vnet-subnet-delegation.jpg":::
1. For `workspaceSubnet`, `agentSubnet`, `supercomputerNodepoolSubnet`, and `aksSubnet`, under **Service Endpoints**, add `Microsoft.Storage`.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-vnet-service-endpoint.jpg" alt-text="Screenshot of the Create virtual network subnet page showing service endpoint settings." lightbox="media/quickstart-infrastructure-portal/create-vnet-service-endpoint.jpg":::
1. Optionally, you can remove the `default` subnet from the list. 
1. Review and create the virtual network.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-vnet-ip-config.jpg" alt-text="Screenshot of the Create virtual network page showing IP address configuration." lightbox="media/quickstart-infrastructure-portal/create-vnet-ip-config.jpg":::

> [!NOTE]
> Network Security Groups (NSGs) aren't mentioned in this step, but it's a general best practice to implement NSGs for each subnet in a virtual network, depending on your organization's policies.

#### c. Create a user assigned managed identity (UAMI)

You can create different UAMIs each with their own required permissions for specific resource access, or you can create a single UAMI with all necessary permissions for the platform. For this exercise, create a single UAMI by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Managed Identities** and select it from the list.
1. Select **Create**.
1. Fill in the required details such as subscription, resource group, region, and name.
1. Select **Review + Create**, then select **Create**.

#### d. Assign Azure Role Based Access Control (RBAC) roles to UAMI

Assign the following built-in roles to the new User Assigned Managed Identity at Resource Group level:

- Microsoft Discovery Platform Contributor (Preview)
- Storage Blob Data Contributor
- ACRPull

1. Navigate to **Subscriptions** and select your subscription.
1. Select the **resource group** that you're using for this exercise.
1. In the left-hand menu, select **Access control (IAM)**.
1. Select **Add**, then select **Add role assignment**.
1. On the **Add role assignment** pane, search for each role one at a time, then select **Next**.
1. On the **Members** tab, ensure **Assign access to** is set to **Managed Identity**.
1. Select **+ Select members**. In the **Select managed identities** pane, select your subscription, select **User-assigned managed identity** type, select the managed identity you created in the previous step, then select **Select**.
1. On the **Review + assign** tab, verify all the information, and select **Review + assign**.

:::image type="content" source="media/quickstart-infrastructure-portal/assign-roles-uami.jpg" alt-text="Screenshot of the Azure portal showing UAMI role assignment." lightbox="media/quickstart-infrastructure-portal/assign-roles-uami.jpg":::

#### e. Create an Azure Blob Storage account

To store input and output data for your investigations, create an Azure blob storage account to associate with your storage container or use an existing one with the following requirements:

- Create a container within the storage account named `discoveryoutputs` where the output files are stored.
- The storage account must allow access from the Virtual Network used to create the supercomputer and workspace.
- The storage account must allow access from your client public IP or local network so you can access the output data.
- The storage account must have the correct CORS settings. You must allow these origins: `https://studio.discovery.microsoft.com`, `https://vscode.dev`, and `https://*.vscode-cdn.net`. Set the allowed operations to include `GET`, `HEAD`, `DELETE`, and `PUT` and set `Allowed Headers` and `Exposed Headers` to `*`, and `Max Age` to `200`. This setting is found under the **Resource sharing (CORS)** page under the **Settings** tab.
- Ensure that the storage account has `Storage Blob Data Contributor` access to the UAMI created in the [previous step](#c-create-a-user-assigned-managed-identity-uami).

**To create an Azure blob storage account:**

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Storage accounts** and select it from the results.
1. Select **Create** to start creating a new storage account.
1. Enter details such as Subscription, Resource Group, Name, and Region.
1. Select **Azure Blob Storage** as the primary service, then select the **Networking** tab.
1. Under public network access, select **Enable public access from selected virtual networks and IP addresses**.
1. Select the Virtual Network and all subnets created in [step 1](#1-set-up-networking-identity-and-storage).
1. Select **Add your client IP address** if you're accessing data over the internet, or ensure your client can access the storage account and virtual network via private link, Site-to-Site VPN, or ExpressRoute.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-storage-blob-networking.jpg" alt-text="Screenshot showing the networking configuration for the storage account." lightbox="media/quickstart-infrastructure-portal/create-storage-blob-networking.jpg":::
1. Select **Review + create**, then select **Create**.

> [!NOTE]
> To view and download output files, your client or browser needs network access to the blob storage. You can allow public internet access by opening public access to all networks. You can also allow your client's public IP address in the storage networking and firewall settings. Alternatively, configure private access via Azure VPN or ExpressRoute.

##### Create a blob container

1. After the storage account is created, navigate to the storage account overview page.
1. In the left navigation pane, under **Data storage**, select **Containers**.
1. Select **Add container**.
1. Enter `discoveryoutputs` as the name and select **Create**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-storage-blob-container.jpg" alt-text="Screenshot showing the Add container dialog with the name." lightbox="media/quickstart-infrastructure-portal/create-storage-blob-container.jpg":::

##### Enable CORS and UAMI access

1. Open the storage account we created in the previous step.
1. Under the **Settings** tab, select **Resource sharing (CORS)**.
1. Under **Blob service** in the **Allowed origins** column, enter `https://studio.discovery.microsoft.com`, `https://vscode.dev`, and `https://*.vscode-cdn.net`. For all three, set the allowed operations to include `GET`, `HEAD`, `DELETE`, `OPTIONS`, and `PUT`. Set `Allowed Headers` and `Exposed Headers` to `*`, and `Max Age` to `200`.
1. Select **Save**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-storage-blob-cors.jpg" alt-text="Screenshot showing the CORS configuration for the storage account blob service." lightbox="media/quickstart-infrastructure-portal/create-storage-blob-cors.jpg":::

### 2. Create a supercomputer

You need a supercomputer with associated node pools to deploy and run scientific tools, and to index your data in Bookshelf knowledge bases. The supercomputer also executes GPU and CPU intensive workloads for simulation and modeling. It provides the compute resources on a specific virtual network within your subscription.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Microsoft Discovery Supercomputers**.
1. Select **Create** and enter details such as Subscription ID, Resource Group name, Location, and Name, then select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-basics.jpg" alt-text="Screenshot showing the basic details page for creating a Microsoft Discovery Supercomputer." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-basics.jpg":::
1. In the **Networking** tab, select the virtual network and `aksSubnet` that you created in [step 1](#b-create-a-virtual-network-and-subnets), and then select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-networking.jpg" alt-text="Screenshot showing the networking configuration for the supercomputer." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-networking.jpg":::
1. In the System SKU tab, select Standard_D4s_v6 as the System SKU for this deployment and select **Next**.
1. In the **Identities** tab, add the user assigned managed identity (UAMI) that you created in [step 1](#c-create-a-user-assigned-managed-identity-uami) for the cluster identity, kubelet identity, and workload identity. Supercomputer instances use this managed identity to access data from your Azure resources. When you finish, select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-identity.jpg" alt-text="Screenshot showing the identity configuration step for the supercomputer." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-identity.jpg":::
1. In the **Encryption** tab, since we're using Microsoft-managed keys for this exercise, **uncheck** the "Enable Customer Managed Keys" option and select **Next**.
1. Add tags as needed, and move to the next tab.
1. Review the Terms and Conditions and select **Next**.
1. Once validation is successful, select **Create**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-overview.jpg" alt-text="Screenshot of the Microsoft Discovery Supercomputer overview page after creation." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-overview.jpg":::

### 3. Create node pools

After your supercomputer is created, follow these steps to create a node pool:

1. Open the Supercomputer that we created in the previous step.
1. In the left pane, select **Node pool** under **Settings**, then select **Create**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-node-pool.jpg" alt-text="Screenshot showing the create node pool option in the supercomputer settings." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-node-pool.jpg" :::
1. Enter the name and location for the node pool, then select **Next**.
   > [!NOTE]
   > Node pool names must be all lowercase, a maximum of 12 characters, must start with a letter, and can only contain letters and numbers.
1. On the **Networking** tab, select the virtual network and `supercomputerNodepoolSubnet` that you created in [step 1](#b-create-a-virtual-network-and-subnets), and select **Next**. **Note:** Use the same virtual network selected for the supercomputer in [step 2](#2-create-a-supercomputer).
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-node-pool-networking.jpg" alt-text="Screenshot showing the networking configuration for the supercomputer node pool." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-node-pool-networking.jpg":::
1. On the **VM configuration** tab, select the Virtual Machine (VM) SKU to use for the node pool, then select **Next**. The selected SKU and quota must be available in the region where you deploy the node pool.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-node-pool-vm-sku.jpg" alt-text="Screenshot showing the VM SKU selection for the node pool." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-node-pool-vm-sku.jpg":::
1. In the **Scaling** section, enter the maximum node count that your node pool can scale to, for example: 5 and select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-supercomputer-node-pool-scaling.jpg" alt-text="Screenshot showing the scaling configuration for the node pool." lightbox="media/quickstart-infrastructure-portal/create-supercomputer-node-pool-scaling.jpg":::
1. Select **Review + Create** and **Create**.

### 4. Create a workspace

A workspace is a collaborative environment where teams manage large-scale scientific initiatives. Workspaces bring together the infrastructure resources such as supercomputers, agents, tools, and knowledge bases (Bookshelves) into a single secure boundary. You can create projects under workspaces, allowing researchers to organize experiments, analyze data, and use AI agents within a shared space.

> [!IMPORTANT]
> Make sure your workspace name is globally unique and uses only lowercase letters.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Microsoft Discovery Workspaces**.
1. Select **+ Create** and enter details such as Subscription, Resource Group, Name, and Region, then select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-workspace-basics.jpg" alt-text="Screenshot showing the basic details page for creating a Microsoft Discovery workspace." lightbox="media/quickstart-infrastructure-portal/create-workspace-basics.jpg":::
1. On the **Networking** tab, select **Public network access** as **Enable** for this exercise. After that, enter the details for Private Endpoint subnet, Agent subnet, and Workspace subnet with the subnets you created earlier in [step 1](#b-create-a-virtual-network-and-subnets), and then select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-workspace-networking.jpg" alt-text="Screenshot showing the Networking tab while creating a workspace." lightbox="media/quickstart-infrastructure-portal/create-workspace-networking.jpg":::
1. On the **Encryption** tab, leave the Enable customer-managed keys (CMK) unchecked. For this exercise, we'll use Microsoft-Managed Keys (MMK), just select **Next** to go to the next tab. 
1. On the **Supercomputer** tab, select **Add Supercomputer** and select your subscription, resource group, and the supercomputer created in [step 2](#2-create-a-supercomputer), then select **Next**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-workspace-supercomputer.jpg" alt-text="Screenshot showing the Supercomputer tab while creating a workspace." lightbox="media/quickstart-infrastructure-portal/create-workspace-supercomputer.jpg"::: 
1. On the **Workspace Identity** tab, select **Add** under **User Assigned Managed Identity (UAMI)** and select the identity you created in [step 1](#c-create-a-user-assigned-managed-identity-uami) to provide access to the workspace.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-workspace-identity.jpg" alt-text="Screenshot showing the Workspace Identity tab with the UAMI added." lightbox="media/quickstart-infrastructure-portal/create-workspace-identity.jpg":::
1. On the **Tags** tab, add tags as needed. (Optional) To enable **GitHub Copilot** and configure workspace access, add the following tags. For details, see [Use GitHub Copilot in Microsoft Discovery](how-to-copilot.md).
   - `discovery.workbench.enableGhcpAiFeatures` set to `true` — Enables GitHub Copilot and AI features for the workspace.
   - `discovery.workbench.enableExtensions` set to `true` — Enables the VS Code Extension Marketplace in the preview experience.
   - `NetworkIsolation` set to `false` — Enables public access to the preview experience (workbench) and other managed resource group (MRG) resources. If you keep network isolation enabled (default), you need to be connected on a VPN or ExpressRoute to the virtual network where the workspace is deployed to access over private network.
   > [!TIP]
   > You can deploy Discovery resources with complete network isolation. When `networkIsolation` is enabled, all resources are shielded within the private network and are reachable only through the private endpoint and Network Security Perimeter (NSP). You can still reach the workspace over the public network through Discovery Studio and the REST API. To lock down access to your private network only, disable public network access for your workspace and create private endpoints for the workspace resources. For guidance, see [Configure network security for Microsoft Discovery workspaces](how-to-configure-network-security.md?tabs=azure-cli#create-private-endpoints-for-data-plane-access).

   > [!NOTE]
   > Tags are immutable for Microsoft Discovery resource types, including workspaces, supercomputers, node pools, and bookshelves. After a resource is created, you can't add, change, or remove its tags. Any tag modification, including adding a tag, requires redeploying the resource.

1. Review the Terms and Conditions, then select **Review + Create**.
1. Once validation is successful, select **Create**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-workspace-overview.jpg" alt-text="Screenshot of the Microsoft Discovery Workspace overview page after creation." lightbox="media/quickstart-infrastructure-portal/create-workspace-overview.jpg":::

### 5. Assign Foundry User role on the managed resource group

When a workspace is created, a managed resource group is automatically provisioned alongside it. To allow users to modify agents and workflows within a project directly in Foundry portal for advanced settings, you must assign them the **Foundry User** role on this managed resource group.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the workspace you created in [step 4](#4-create-a-workspace) and find the **Managed Resource Group** name on the workspace overview page.
1. Navigate to that managed resource group.
1. In the left-hand menu, select **Access control (IAM)**.
1. Select **Add**, then select **Add role assignment**.
1. On the **Add role assignment** pane, search for **Foundry User** and select it, then select **Next**.
1. On the **Members** tab, ensure **Assign access to** is set to **User, group, or service principal**.
1. Select **+ Select members**, choose the users who need to modify agents and workflows, then select **Select**.
1. Select **Review + assign**, verify the information, and select **Review + assign**.

Repeat this process for all users who require access to agents and workflows in the workspace. Any changes made in Foundry portal directly are reflected in Discovery agent configuration automatically.

### 6. Create Chat Model Deployment

Chat model deployments provision foundational language models such as GPT-5.4 for use within the Microsoft Discovery Workspace. Agents created within projects can use these chat model deployments.

1. Go to the overview page of Microsoft Discovery workspace, created in the previous step. 
1. Under the **Settings** tab on left navigation pane, select **Chat Model Deployments**.
1. Select the **+ Create** option at the top.
1. Enter the **Name** as `gpt-5-4`.
1. Select the **Model Format** as `OpenAI` and **Model Name** as `gpt-5.4`  in the drop-down.
1. Then select **Review + create** button at the bottom and select **Create**.

   :::image type="content" source="media/quickstart-infrastructure-portal/create-chat-model.jpg" alt-text="Screenshot of the Chat Model Deployment creation page." lightbox="media/quickstart-infrastructure-portal/create-chat-model.jpg":::

> [!IMPORTANT]
> To use Discovery Engine and tasks within your sessions, you must use this specific deployment with name `gpt-5-4` and model name `gpt-5.4`. However, you can have additional chat model deployments for use with agents.

You can provide access to users via [Role Based Access Control (RBAC)](../role-based-access-control/quickstart-assign-role-user-portal.md) at the resource group level. **Microsoft Discovery Administrator (Preview)** role is required to create projects within a workspace.

### 7. Sign in to Microsoft Discovery Studio

Microsoft Discovery Studio is a secure, AI-powered research environment. It enables scientists and engineers to accelerate innovation through autonomous agents, simulation workflows, and integrated data tools within a unified interface.

After your infrastructure is set up, you can sign in to [Microsoft Discovery Studio](https://studio.discovery.microsoft.com) directly via the URL, or find the URL in the Workspace overview page in the Azure portal.

:::image type="content" source="media/quickstart-infrastructure-portal/studio-home.jpg" alt-text="Screenshot of the Microsoft Discovery Studio homepage after signing in." lightbox="media/quickstart-infrastructure-portal/studio-home.jpg":::

You must sign in with your Microsoft Entra ID credentials for your work or school account. Studio supports single sign-on with Microsoft Entra ID. You don't have to explicitly provide credentials if you're already signed in to another service with your Microsoft Entra ID in the same browser.

> [!NOTE]
> If you have access to multiple Microsoft Entra tenants, select the right tenant by selecting your profile icon on the top right corner of the page.

### 8. Create storage containers

After you sign in to the studio, create storage containers to organize and manage your storage assets used in your projects.

Storage containers store both input and output data as storage assets. Both inputs and outputs use a storage container of type Azure Storage Blob, backed by the storage account created in [step 1](#e-create-an-azure-blob-storage-account).

1. In [Microsoft Discovery Studio](https://studio.discovery.microsoft.com), on the left navigation pane, select the **Data** tab.
1. **Storage Containers (new)** tab is selected by default.
1. Select **Create Container**.
1. Enter details such as name, subscription, resource group, and location.
1. Select the storage account created in [step 1](#e-create-an-azure-blob-storage-account).
   :::image type="content" source="media/quickstart-infrastructure-portal/create-storage-containers.jpg" alt-text="Screenshot showing the Storage Container creation page in Microsoft Discovery Studio." lightbox="media/quickstart-infrastructure-portal/create-storage-containers.jpg":::
1. Select **Create**.

> [!NOTE]
> After you select **Create**, the resource is initially in the **Accepted** state. Refresh the page and wait until the **Provisioning State** changes to **Succeeded** before proceeding. This operation typically takes a few minutes.

### 9. Create a project

Projects help you organize and manage scientific investigations within a workspace. Each project defines the functional boundary for access to your agents, tools, and storage containers. Within a project, you can run experiments, analyze data, apply AI models, and track research progress in a collaborative environment.

> [!IMPORTANT]
> Your project name must be all lowercase and no more than 12 characters long. Also, ensure you refresh the page before you create a project.
You can create a project by opening your workspace in the studio.

1. In **Microsoft Discovery Studio**, on the left navigation pane, select **Workspaces**. This lists all existing workspaces across your Azure subscriptions.
   :::image type="content" source="media/quickstart-infrastructure-portal/workspace-list.jpg" alt-text="Screenshot showing the Workspace list page in Microsoft Discovery Studio." lightbox="media/quickstart-infrastructure-portal/workspace-list.jpg":::
1. Select the workspace you created in [step 4](#4-create-a-workspace). This action opens your workspace in the studio.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-project.jpg" alt-text="Screenshot showing the Project list page in a workspace in Microsoft Discovery Studio." lightbox="media/quickstart-infrastructure-portal/create-project.jpg":::
1. Select **Create Project**.
1. Enter the name of the project and select the storage container you created in [step 8](#8-create-storage-containers).
1. Select **Create**.
   :::image type="content" source="media/quickstart-infrastructure-portal/create-project-new.jpg" alt-text="Screenshot showing the Project creation page with details in Microsoft Discovery Studio." lightbox="media/quickstart-infrastructure-portal/create-project-new.jpg":::

   :::image type="content" source="media/quickstart-infrastructure-portal/create-project-list.jpg" alt-text="Screenshot showing the Project list page after project creation in Microsoft Discovery Studio." lightbox="media/quickstart-infrastructure-portal/create-project-list.jpg":::

> [!NOTE]
> After you select **Create**, the project is initially in the **Accepted** state. Refresh the page and wait until the **Provisioning State** changes to **Succeeded** before proceeding.

# [Bicep](#tab/bicep)

Use Bicep to deploy the prerequisite infrastructure for Microsoft Discovery. The deployment creates the foundational Azure resources required before you can use a Discovery workspace, supercomputer, and projects.

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

### Review the Bicep file

This quickstart uses a Bicep file from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.discovery/discovery-infra-deployment).

In this quickstart, you deploy the full Microsoft Discovery stack into *Sweden Central*. The deployment creates a virtual network with a *10.0.0.0/16* address space and five subnets for supercomputer node pools, AKS, workspace, private endpoints, and agents. The deployment provisions a *Standard_LRS* storage account with CORS rules enabled for Discovery Studio and VS Code. It creates a user-assigned managed identity with *Storage Blob Data Contributor*, *Discovery Platform Contributor*, and *AcrPull* role assignments. The core Discovery resources include a supercomputer with a *Standard_D4s_v6* node pool (scaling from *0* to *3* nodes), a workspace with a chat model deployment, a storage container, and a project.

> [!NOTE]
> **Enable the unified Workbench (preview).** The unified Workbench, which includes GitHub Copilot and AI features, is in preview. To enable it, deploy your workspace with the tags `discovery.workbench.enableGhcpAiFeatures: true` and `discovery.workbench.enableExtensions: true`. How you access the Workbench depends on the workspace's `networkIsolation` setting:
>
> - When `networkIsolation` is set to `false`, the Workbench works out of the box.
> - When `networkIsolation` is set to `true`, you must establish a VPN (or ExpressRoute) connection to the virtual network where the workspace is deployed.
>
> For more information, see [Use GitHub Copilot in Microsoft Discovery](how-to-copilot.md).

> [!NOTE]
> Tags are immutable for Microsoft Discovery resource types, including workspaces, supercomputers, node pools, and bookshelves. After a resource is created, you can't add, change, or remove its tags. Define all required tags in the template before you deploy; any tag modification, including adding a tag, requires redeploying the resource.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.discovery/discovery-infra-deployment/main.bicep":::

The Bicep file defines multiple Azure resources:

- **Microsoft.Network/virtualNetworks** - Virtual network with five subnets for supercomputer node pool, AKS, workspace, private endpoint, and agent workloads.
- **Microsoft.ManagedIdentity/userAssignedIdentities** - User-assigned managed identity for supercomputer and workspace authentication.
- **Microsoft.Storage/storageAccounts** - Azure Blob Storage account with CORS rules for Discovery Studio and VS Code integrations.
- **Microsoft.Authorization/roleAssignments** - Storage Blob Data Contributor, Discovery Platform Contributor, and AcrPull role assignments for the managed identity.
- **Microsoft.Discovery/supercomputers** - Supercomputer resource with cluster, kubelet, and workload identities.
- **Microsoft.Discovery/supercomputers/nodePools** - Configurable node pool with VM size, min/max node count, and scale set priority.
- **Microsoft.Discovery/workspaces** - Workspace linked to the supercomputer with agent, private endpoint, and workspace subnets.
- **Microsoft.Discovery/workspaces/chatModelDeployments** - Chat model deployment under the workspace.
- **Microsoft.Discovery/storageContainers** - Storage container backed by the Azure Blob Storage account.
- **Microsoft.Discovery/workspaces/projects** - Project linked to the storage container.

### Deploy the Bicep file

1. Save the Bicep file as **main.bicep** on your local computer.
1. Replace the `<prescribedSCName>` and `<presecribedWSName>` placeholders with the supercomputer and workspace names you want to use. Update the `location` parameter if you're deploying to a region other than `swedencentral`.
1. Deploy the Bicep file by using either Azure CLI or Azure PowerShell.

   **Azure CLI**

   ```azurecli
   az group create --name exampleRG --location swedencentral
   az deployment group create --resource-group exampleRG --template-file main.bicep --parameters location=swedencentral supercomputerName=<prescribedSCName> workspaceName=<presecribedWSName>
   ```

   **Azure PowerShell**

   ```azurepowershell
   New-AzResourceGroup -Name exampleRG -Location swedencentral
   New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -location swedencentral -supercomputerName <prescribedSCName> -workspaceName <presecribedWSName>
   ```

  When the deployment finishes, you see a message indicating the deployment succeeded.

### Validate the deployment

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

**Azure CLI**

```azurecli-interactive
az resource list --resource-group exampleRG
```

**Azure PowerShell**

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

### Clean up resources

When you no longer need the resources, use the Azure portal, Azure CLI, or Azure PowerShell to delete all the resources in the resource group.

**Azure CLI**

```azurecli-interactive
az group delete --name exampleRG
```

**Azure PowerShell**

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

After you set up your infrastructure and create your project, use the following resources:

- [Get started with agents and shared sessions in Microsoft Discovery Studio](quickstart-agents-studio.md)
- Review the [Microsoft Discovery FAQ](faq.yml) for common deployment, networking, security, quota, and cleanup questions.
