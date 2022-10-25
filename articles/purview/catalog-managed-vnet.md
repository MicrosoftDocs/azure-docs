---
title: Managed Virtual Network and managed private endpoints
description: This article describes Managed Virtual Network and managed private endpoints in Microsoft Purview.
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 04/21/2022
ms.custom: references_regions
# Customer intent: As a Microsoft Purview admin, I want to set up Managed Virtual Network and managed private endpoints for my Microsoft Purview account.
---

# Use a Managed VNet with your Microsoft Purview account

> [!IMPORTANT]
> Currently, Managed Virtual Network and managed private endpoints are available for Microsoft Purview accounts that are deployed in the following regions:
> - Australia East
> - Canada Central
> - East US
> - East US 2
> - North Europe
> - West Europe 

## Conceptual overview

This article describes how to configure Managed Virtual Network and managed private endpoints for Microsoft Purview.

### Supported regions

Currently, Managed Virtual Network and managed private endpoints are available for Microsoft Purview accounts that are deployed in the following regions:
> - Australia East
> - Canada Central
> - East US
> - East US 2
> - North Europe
> - West Europe 

### Supported data sources

Currently, the following data sources are supported to have a managed private endpoint and can be scanned using Managed VNet Runtime in Microsoft Purview:

- Azure Blob Storage 
- Azure Data Lake Storage Gen 2 
- Azure SQL Database 
- Azure SQL Managed Instance
- Azure Cosmos DB
- Azure Synapse Analytics
- Azure Files
- Azure Database for MySQL
- Azure Database for PostgreSQL

Additionally, you can deploy managed private endpoints for your Azure Key Vault resources if you need to run scans using any authentication options rather than Managed Identities, such as SQL Authentication or Account Key.  

> [!IMPORTANT]
> If you are planning to scan Azure Synapse workspaces using Managed Virtual Network, you are also required to [configure Azure Synapse workspace firewall access](register-scan-synapse-workspace.md#set-up-azure-synapse-workspace-firewall-access) to enable **Allow Azure services and resources to access this workspace**. Currently, we do not support setting up scans for an Azure Synapse workspace from the Microsoft Purview governance portal, if you cannot enable **Allow Azure services and resources to access this workspace** on your Azure Synapse workspaces. If you cannot enable the firewall:
>  - You can use [Microsoft Purview REST API - Scans - Create Or Update](/rest/api/purview/scanningdataplane/scans/create-or-update/) to create a new scan for your Synapse workspaces including dedicated and serverless pools.
>  - You must use **SQL Authentication** as authentication mechanism.

### Managed Virtual Network

A Managed Virtual Network in Microsoft Purview is a virtual network that is deployed and managed by Azure inside the same region as Microsoft Purview account to allow scanning Azure data sources inside a managed network, without having to deploy and manage any self-hosted integration runtime virtual machines by the customer in Azure.

:::image type="content" source="media/catalog-managed-vnet/purview-managed-vnet-architecture.png" alt-text="Microsoft Purview Managed Virtual Network architecture":::

You can deploy an Azure Managed Integration Runtime within a Microsoft Purview Managed Virtual Network. From there, the Managed VNet Runtime will use private endpoints to securely connect to and scan supported data sources.

Creating a Managed VNet Runtime within Managed Virtual Network ensures that data integration process is isolated and secure. 

Benefits of using Managed Virtual Network:

- With a Managed Virtual Network, you can offload the burden of managing the Virtual Network to Microsoft Purview. You don't need to create and manage VNets or subnets for Azure Integration Runtime to use for scanning Azure data sources. 
- It doesn't require deep Azure networking knowledge to do data integrations securely. Using a Managed Virtual Network is much simplified for data engineers. 
- Managed Virtual Network along with Managed private endpoints protects against data exfiltration. 

> [!IMPORTANT]
> Currently, the Managed Virtual Network is only supported in the same region as Microsoft Purview account region.

> [!Note]
> You cannot switch a global Azure integration runtime or self-hosted integration runtime to a Managed VNet Runtime and vice versa.

A Managed VNet is created for your Microsoft Purview account when you create a Managed VNet Runtime for the first time in your Microsoft Purview account. You can't view or manage the Managed VNets.

### Managed private endpoints

Managed private endpoints are private endpoints created in the Microsoft Purview Managed Virtual Network establishing a private link to Microsoft Purview and Azure resources. Microsoft Purview manages these private endpoints on your behalf. 

:::image type="content" source="media/catalog-managed-vnet/purview-managed-pe-list-2.png" alt-text="Microsoft Purview Managed private endpoint":::

Microsoft Purview supports private links. Private link enables you to access Azure (PaaS) services (such as Azure Storage, Azure Cosmos DB, Azure Synapse Analytics).

When you use a private link, traffic between your data sources and Managed Virtual Network traverses entirely over the Microsoft backbone network. Private Link protects against data exfiltration risks. You establish a private link to a resource by creating a private endpoint.

Private endpoint uses a private IP address in the Managed Virtual Network to effectively bring the service into it. Private endpoints are mapped to a specific resource in Azure and not the entire service. Customers can limit connectivity to a specific resource approved by their organization. Learn more about [private links and private endpoints](../private-link/index.yml).

> [!NOTE]
> To reduce administrative overhead, it's recommended that you create managed private endpoints to scan all supported Azure data sources. 
 
> [!WARNING]
> If an Azure PaaS data store (Blob, Azure Data Lake Storage Gen2, Azure Synapse Analytics) has a private endpoint already created against it, and even if it allows access from all networks, Microsoft Purview would only be able to access it using a managed private endpoint. If a private endpoint does not already exist, you must create one in such scenarios. 

A private endpoint connection is created in a "Pending" state when you create a managed private endpoint in Microsoft Purview. An approval workflow is initiated. The private link resource owner is responsible to approve or reject the connection.

:::image type="content" source="media/catalog-managed-vnet/purview-managed-data-source-approval.png" alt-text="approval for managed private endpoint":::

If the owner approves the connection, the private link is established. Otherwise, the private link won't be established. In either case, the Managed private endpoint will be updated with the status of the connection.

:::image type="content" source="media/catalog-managed-vnet/purview-managed-data-source-pe-azure.png" alt-text="Approve Managed private endpoint":::

Only a Managed private endpoint in an approved state can send traffic to a given private link resource.

### Interactive authoring

Interactive authoring capabilities are used for functionalities like test connection, browse folder list and table list, get schema, and preview data. You can enable interactive authoring when creating or editing an Azure Integration Runtime that is in Purview-Managed Virtual Network. The backend service will pre-allocate compute for interactive authoring functionalities. Otherwise, the compute will be allocated every time any interactive operation is performed which will take more time. The Time To Live (TTL) for interactive authoring is 60 minutes, which means it will automatically become disabled after 60 minutes of the last interactive authoring operation.

:::image type="content" source="media/catalog-managed-vnet/purview-managed-interactive-authoring.png" alt-text="Interactive authoring":::

## Deployment Steps

### Prerequisites

Before deploying a Managed VNet and Managed VNet Runtime for a Microsoft Purview account, ensure you meet the following prerequisites:

1. A Microsoft Purview account deployed in one of the [supported regions](#supported-regions).
2. From Microsoft Purview roles, you must be a data curator at root collection level in your Microsoft Purview account.
3. From Azure RBAC roles, you must be contributor on the Microsoft Purview account and data source to approve private links.

### Deploy Managed VNet Runtimes

> [!NOTE]
> The following guide shows how to register and scan an Azure Data Lake Storage Gen 2 using Managed VNet Runtime. 

1. Go to the [Azure portal](https://portal.azure.com), and navigate to the **Microsoft Purview accounts** page and select your _Purview account_.

   :::image type="content" source="media/catalog-managed-vnet/purview-managed-azure-portal.png" alt-text="Screenshot that shows the Microsoft Purview account":::

2. **Open Microsoft Purview governance portal** and navigate to the **Data Map --> Integration runtimes**.

   :::image type="content" source="media/catalog-managed-vnet/purview-managed-vnet.png" alt-text="Screenshot that shows Microsoft Purview Data Map menus":::

3. From **Integration runtimes** page, select **+ New** icon, to create a new runtime. Select Azure and then select **Continue**.

   :::image type="content" source="media/catalog-managed-vnet/purview-managed-ir-create.png" alt-text="Screenshot that shows how to create new Azure runtime":::

4. Provide a name for your Managed VNet Runtime, select the region and configure interactive authoring. Select **Create**.

   :::image type="content" source="media/catalog-managed-vnet/purview-managed-ir-region.png" alt-text="Screenshot that shows to create a Managed VNet Runtime":::

5. Deploying the Managed VNet Runtime for the first time triggers multiple workflows in the Microsoft Purview governance portal for creating managed private endpoints for Microsoft Purview and its Managed Storage Account. Select on each workflow to approve the private endpoint for the corresponding Azure resource.

   :::image type="content" source="media/catalog-managed-vnet/purview-managed-ir-workflows.png" alt-text="Screenshot that shows deployment of a Managed VNet Runtime":::

6. In Azure portal, from your Microsoft Purview account resource window, approve the managed private endpoint. From Managed storage account page approve the managed private endpoints for blob and queue services:

   :::image type="content" source="media/catalog-managed-vnet/purview-managed-pe-purview.png" alt-text="Screenshot that shows how to approve a managed private endpoint for Microsoft Purview":::

   :::image type="content" source="media/catalog-managed-vnet/purview-managed-pe-purview-approved.png" alt-text="Screenshot that shows how to approve a managed private endpoint for Microsoft Purview - approved":::
   
   :::image type="content" source="media/catalog-managed-vnet/purview-managed-pe-managed-storage.png" alt-text="Screenshot that shows how to approve a managed private endpoint for managed storage account":::

   :::image type="content" source="media/catalog-managed-vnet/purview-managed-pe-managed-storage-approved.png" alt-text="Screenshot that shows how to approve a managed private endpoint for managed storage account - approved":::

7. From Management, select Managed private endpoint to validate if all managed private endpoints are successfully deployed and approved. All private endpoints be approved.
   
    :::image type="content" source="media/catalog-managed-vnet/purview-managed-pe-list.png" alt-text="Screenshot that shows managed private endpoints in Microsoft Purview":::

    :::image type="content" source="media/catalog-managed-vnet/purview-managed-pe-list-approved.png" alt-text="Screenshot that shows managed private endpoints in Microsoft Purview - approved ":::

### Deploy managed private endpoints for data sources

To scan any data sources using Managed VNet Runtime, you need to deploy and approve a managed private endpoint for the data source prior to create a new scan. To deploy and approve a managed private endpoint for a data source, follow these steps selecting data source of your choice from the list:

1. Navigate to **Management**, and select **Managed private endpoints**.
   
2. Select **+ New**.

3. From the list of supported data sources, select the type that corresponds to the data source you're planning to scan using Managed VNet Runtime.

    :::image type="content" source="media/catalog-managed-vnet/purview-managed-data-source.png" alt-text="Screenshot that shows how to create a managed private endpoint for data sources":::

4. Provide a name for the managed private endpoint, select the Azure subscription and the data source from the drop-down lists. Select **create**.

    :::image type="content" source="media/catalog-managed-vnet/purview-managed-data-source-pe.png" alt-text="Screenshot that shows how to select data source for setting managed private endpoint":::

5. From the list of managed private endpoints, select on the newly created managed private endpoint for your data source and then select on **Manage approvals in the Azure portal**, to approve the private endpoint in Azure portal.

    :::image type="content" source="media/catalog-managed-vnet/purview-managed-data-source-approval.png" alt-text="Screenshot that shows the approval for managed private endpoint for data sources":::

6. By clicking on the link, you're redirected to Azure portal. Under private endpoints connection, select the newly created private endpoint and select **approve**.

    :::image type="content" source="media/catalog-managed-vnet/purview-managed-data-source-pe-azure.png" alt-text="Screenshot that shows how to approve a  private endpoint for data sources in Azure portal":::

    :::image type="content" source="media/catalog-managed-vnet/purview-managed-data-source-pe-azure-approved.png" alt-text="Screenshot that shows approved private endpoint for data sources in Azure portal":::

7. Inside the Microsoft Purview governance portal, the managed private endpoint must be shown as approved as well.
   
    :::image type="content" source="media/catalog-managed-vnet/purview-managed-pe-list-2.png" alt-text="Screenshot that shows managed private endpoints including data sources' in Purview governance portal":::

### Register and scan a data source using Managed VNet Runtime

#### Register data source 
It's important to register the data source in Microsoft Purview prior to setting up a scan for the data source. Follow these steps to register data source if you haven't yet registered it.

1. Go to your Microsoft Purview account.
1. Select **Data Map** on the left menu.
1. Select **Register**.
2. On **Register sources**, select your data source 
3. Select **Continue**.
4. On the **Register sources** screen, do the following:

   1. In the **Name** box, enter a name that the data source will be listed with in the catalog. 
   2. In the **Subscription** dropdown list box, select a subscription. 
   3. In the **Select a collection** box, select a collection.
   4. Select **Register** to register the data sources.

For more information, see [Manage data sources in Microsoft Purview](manage-data-sources.md).

#### Scan data source

You can use any of the following options to scan data sources using Microsoft Purview Managed VNet Runtime:


- [Using Managed Identity](#scan-using-managed-identity) (Recommended) - As soon as the Microsoft Purview Account is created, a system-assigned managed identity (SAMI) is created automatically in Azure AD tenant. Depending on the type of resource, specific RBAC role assignments are required for the Microsoft Purview system-assigned managed identity (SAMI) to perform the scans.

- [Using other authentication options](#scan-using-other-authentication-options):
  
  - Account Key or SQL Authentication- Secrets can be created inside an Azure Key Vault to store credentials in order to enable access for Microsoft Purview to scan data sources securely using the secrets. A secret can be a storage account key, SQL login password, or a password.
  
  - Service Principal - In this method, you can create a new or use an existing service principal in your Azure Active Directory tenant.

##### Scan using Managed Identity

To scan a data source using a Managed VNet Runtime and Microsoft Purview managed identity perform these steps:

1. Select the **Data Map** tab on the left pane in the Microsoft Purview governance portal.

1. Select the data source that you registered.

1. Select **View details** > **+ New scan**, or use the **Scan** quick-action icon on the source tile.

1. Provide a **Name** for the scan.

1. Under **Connect via integration runtime**, select the newly created Managed VNet Runtime. 

1. For **Credential** Select the managed identity, choose the appropriate collection for the scan, and select **Test connection**. On a successful connection, select **Continue**.

    :::image type="content" source="media/catalog-managed-vnet/purview-managed-scan.png" alt-text="Screenshot that shows how to create a new scan using Managed VNet":::

1. Follow the steps to select the appropriate scan rule and scope for your scan.

1. Choose your scan trigger. You can set up a schedule or run the scan once.

1. Review your scan and select **Save and run**.

    :::image type="content" source="media/catalog-managed-vnet/purview-managed-scan-run.png" alt-text="review scan":::

##### Scan using other authentication options

You can also use other supported options to scan data sources using Microsoft Purview Managed Runtime. This requires setting up a private connection to Azure Key Vault where the secret is stored.

To set up a scan using Account Key or SQL Authentication follow these steps:

1. [Grant Microsoft Purview access to your Azure Key Vault](manage-credentials.md#grant-microsoft-purview-access-to-your-azure-key-vault).
   
2. [Create a new credential in Microsoft Purview](manage-credentials.md#create-a-new-credential).
   
3. Navigate to **Management**, and select **Managed private endpoints**.
   
4. Select **+ New**.

5. From the list of supported data sources, select **Key Vault**.

    :::image type="content" source="media/catalog-managed-vnet/purview-managed-pe-key-vault.png" alt-text="Screenshot that shows how to create a managed private endpoint for Azure Key Vault":::

6. Provide a name for the managed private endpoint, select the Azure subscription and the Azure Key Vault from the drop-down lists. Select **create**.

    :::image type="content" source="media/catalog-managed-vnet/purview-managed-pe-key-vault-create.png" alt-text="Screenshot that shows how to create a managed private endpoint for Azure Key Vault in the Microsoft Purview governance portal":::

7. From the list of managed private endpoints, select on the newly created managed private endpoint for your Azure Key Vault and then select on **Manage approvals in the Azure portal**, to approve the private endpoint in Azure portal.

    :::image type="content" source="media/catalog-managed-vnet/purview-managed-pe-key-vault-approve.png" alt-text="Screenshot that shows how to approve a managed private endpoint for Azure Key Vault":::

8. By clicking on the link, you're redirected to Azure portal. Under private endpoints connection, select the newly created private endpoint for your Azure Key Vault and select **approve**.

    :::image type="content" source="media/catalog-managed-vnet/purview-managed-pe-key-vault-az-approve.png" alt-text="Screenshot that shows how to approve a private endpoint for an Azure Key Vault in Azure portal":::

    :::image type="content" source="media/catalog-managed-vnet/purview-managed-pe-key-vault-az-approved.png" alt-text="Screenshot that shows approved private endpoint for Azure Key Vault in Azure portal":::

9.  Inside the Microsoft Purview governance portal, the managed private endpoint must be shown as approved as well.
   
    :::image type="content" source="media/catalog-managed-vnet/purview-managed-pe-list-3.png" alt-text="Screenshot that shows managed private endpoints including Azure Key Vault in Purview governance portal":::

10. Select the **Data Map** tab on the left pane in the Microsoft Purview governance portal.
    
11. Select the data source that you registered.

12. Select **View details** > **+ New scan**, or use the **Scan** quick-action icon on the source tile.

13. Provide a **Name** for the scan.

14. Under **Connect via integration runtime**, select the newly created Managed VNet Runtime. 

15. For **Credential** Select the credential you've registered earlier, choose the appropriate collection for the scan, and select **Test connection**. On a successful connection, select **Continue**.

    :::image type="content" source="media/catalog-managed-vnet/purview-managed-scan.png" alt-text="Screenshot that shows how to create a new scan using Managed VNet and a SPN":::

16. Follow the steps to select the appropriate scan rule and scope for your scan.

17. Choose your scan trigger. You can set up a schedule or run the scan once.

18. Review your scan and select **Save and run**.

    :::image type="content" source="media/catalog-managed-vnet/purview-managed-scan-spn-run.png" alt-text="review scan using SPN":::

## Next steps

- [Manage data sources in Microsoft Purview](manage-data-sources.md)
