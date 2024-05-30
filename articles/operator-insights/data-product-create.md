---
title: Deploy an Azure Operator Insights Data Product
description: In this article, learn how to deploy an Azure Operator Insights Data Product resource. 
author: rcdun
ms.author: rdunstan
ms.reviewer: rathishr
ms.service: operator-insights
ms.topic: quickstart
ms.date: 10/16/2023
ms.custom: template-quickstart, devx-track-azurecli #Required; leave this attribute/value as-is.
---

# Deploy an Azure Operator Insights Data Product

In this article, you learn how to create an Azure Operator Insights Data Product instance.

> [!NOTE]
> Access is currently only available by request. More information is included in the application form. We appreciate your patience as we work to enable broader access to Azure Operator Insights Data Product. Apply for access by [filling out this form](https://aka.ms/AAn1mi6).

## Prerequisites

- An Azure subscription for which the user account must be assigned the Contributor role. If needed, create a [free subscription](https://azure.microsoft.com/free/) before you begin.
- Access granted to Azure Operator Insights for the subscription. Apply for access by [completing this form](https://aka.ms/AAn1mi6).
- (Optional) If you plan to integrate Data Product with Microsoft Purview, you must have an active Purview account. Make note of the Purview collection ID when you [set up Microsoft Purview with a Data Product](purview-setup.md).
- After obtaining your subscription access, register the Microsoft.NetworkAnalytics and Microsoft.HybridNetwork Resource Providers (RPs) to continue. For guidance on registering RPs in your subscription, see [Register resource providers in Azure](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal).

## Prepare your Azure portal or Azure CLI environment

You can use the Azure portal or the Azure CLI to follow the steps in this article.


# [Portal](#tab/azure-portal)

Confirm that you can sign in to the [Azure portal](https://portal.azure.com) and can access the subscription.

# [Azure CLI](#tab/azure-cli)

You can run Azure CLI commands in one of two ways:

- You can run CLI commands from within the Azure portal, in Azure Cloud Shell.
- You can install the CLI and run CLI commands locally.

### Use Azure Cloud Shell

Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. The Azure CLI is preinstalled and configured to use with your account. Select the **Cloud Shell** button on the menu in the upper-right section of the Azure portal:

[![Screenshot of Cloud Shell menu.](./media/dp-quickstart-create/cloud-shell-menu.png)](https://portal.azure.com)

The button launches an interactive shell that you can use to run the steps outlined in this how-to article:

[![Screenshot showing the Cloud Shell window in the portal.](./media/dp-quickstart-create/cloud-shell.png)](https://portal.azure.com)


### Install the Azure CLI locally

You can also install and use the Azure CLI locally. If you plan to use Azure CLI locally, make sure you have installed the latest version of the Azure CLI. See [Install the Azure CLI](/cli/azure/install-azure-cli).

To log into your local installation of the CLI, run the az sign-in command:

```azurecli-interactive
az login
```

### Change the active subscription

Azure subscriptions have both a name and an ID. You can switch to a different subscription with [az account set](/cli/azure/account#az-account-set), specifying the desired subscription name or ID.

- To use the name to change the active subscription:
    ```azurecli-interactive
    az account set --subscription "<SubscriptionName>"
    ```
- To use the ID to change the active subscription:
    ```azurecli-interactive
    az account set --subscription "<SubscriptionID>"
    ```

> [!NOTE]
> Replace any values shown in the form \<KeyVaultName\> with the values for your deployment.

---

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed.

# [Portal](#tab/azure-portal)

If you plan to use CMK-based data encryption or Microsoft Purview, set up a resource group now:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Resource groups**.
1. Select **Create** and follow the prompts. 

For more information, see [Create resource groups](../azure-resource-manager/management/manage-resource-groups-portal.md#create-resource-groups).

If you don't plan to use CMK-based date encryption or Microsoft Purview, you can set up a resource group now or when you [create the Data Product resource](#create-an-azure-operator-insights-data-product-resource).

# [Azure CLI](#tab/azure-cli)

Use the `az group create` command to create a resource group named \<ResourceGroup\> in the region where you want to deploy.

```azurecli-interactive
az group create --name "<ResourceGroup>" --location "<Region>"
```
---

## Set up resources for CMK-based data encryption or Microsoft Purview

If you plan to use CMK-based data encryption or Microsoft Purview, you must set up an Azure Key Vault instance and a user-assigned managed identity (UAMI) first.

### Set up a key in an Azure Key Vault

An Azure Key Vault instance stores your Customer Managed Key (CMK) for data encryption. The Data Product uses this key to encrypt your data over and above the standard storage encryption. You need to have Subscription/Resource group owner permissions to perform this step.

# [Portal](#tab/azure-portal)

1. [Create an Azure Key Vault resource](../key-vault/general/quick-create-portal.md) in the same subscription and resource group that you set up in [Create a resource group](#create-a-resource-group).
1. Provide your user account with the Key Vault Administrator role on the Azure Key Vault resource. This is done via the **Access Control (IAM)** tab on the Azure Key Vault resource.
1. Navigate to the object and select **Keys**. Select **Generate/Import**.
1. Enter a name for the key and select **Create**.
1. Select the newly created key and select the current version of the key.
1. Copy the Key Identifier URI to your clipboard to use when creating the Data Product.

# [Azure CLI](#tab/azure-cli)

<!-- CLI link is [Create an Azure Key Vault resource](../key-vault/general/quick-create-cli.md) in the same subscription and resource group where you intend to deploy the Data Product resource. --> 

#### Create a key vault

Use the Azure CLI `az keyvault create` command to create a Key Vault in the resource group from the previous step. You must provide:

- A name for the key vault: A string of 3 to 24 characters that can contain only numbers (0-9), letters (a-z, A-Z), and hyphens (-). Each key vault must have a unique name.
- The resource group that you created in [Create a resource group](#create-a-resource-group).
- The region in which you created the resource group.
 
```azurecli-interactive
az keyvault create --name "<KeyVaultName>" --resource-group "<ResourceGroup>" --location "<Region>"
```

The output of this command shows properties of the newly created key vault. Take note of:

- Vault Name: The name you provided to the `--name` parameter you ran.
- Vault URI: In the example, the URI is `https://<KeyVaultName>.vault.azure.net/`. Applications that use your vault through its REST API must use this URI.

At this point, your Azure account is the only one authorized to perform any operations on this new vault.

#### Assign roles for the key vault

Provide your user account with the Key Vault Administrator role on the Azure Key Vault resource.

```azurecli-interactive
az role assignment create --role "Key Vault Administrator" --assignee <YourEmailAddress> --scope /subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroup>/providers/Microsoft.KeyVault/vaults/<KeyVaultName>
```

#### Create a key

```azurecli-interactive
az keyvault key create --vault-name "<KeyVaultName>" -n <keyName> --protection software
```

From the output screen, copy the `KeyID` and store it in your clipboard for later use.

---

<!-- PowerShell link is  [Create an Azure Key Vault resource](../key-vault/general/quick-create-powershell.md) in the same subscription and resource group where you intend to deploy the Data Product resource. --> 

### Set up a user-assigned managed identity

# [Portal](#tab/azure-portal)

1. [Create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) using Microsoft Entra ID for CMK-based encryption. The Data Product also uses the user-assigned managed identity (UAMI) to interact with the Microsoft Purview account.
1. Navigate to the Azure Key Vault resource that you created earlier and assign the UAMI with **Key Vault Administrator** role.

# [Azure CLI](#tab/azure-cli)

<!-- Managed identity link for the CLI: /entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azcli -->

#### Create a user-assigned managed identity

To create a user-assigned managed identity, your account needs the Managed Identity Contributor role assignment.

Use the `az identity create` command to create a user-assigned managed identity. The -g parameter specifies the resource group where to create the user-assigned managed identity. The -n parameter specifies its name. Replace the \<ResourceGroup\> and \<UserAssignedIdentityName\> parameter values with your own values.

> [!IMPORTANT]
> When you create user-assigned managed identities, only alphanumeric characters (0-9, a-z, and A-Z) and the hyphen (-) are supported. 

```azurecli-interactive
az identity create -g <ResourceGroup> -n <UserAssignedIdentityName>
```

Copy the `principalId` from the output screen and store it in your clipboard for later use.

#### Assign the user-assigned managed identity to the key vault

```azurecli-interactive
az role assignment create --role "Key Vault Administrator" --assignee <principalId> --scope /subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroup>/providers/Microsoft.KeyVault/vaults/<KeyVaultName>
```

---

<!-- Managed identity link for PowerShell: /entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-powershell -->

## Create an Azure Operator Insights Data Product resource

You create the Azure Operator Insights Data Product resource.

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search bar, search for Operator Insights and select **Azure Operator Insights - Data Products**.
1. On the Azure Operator Insights - Data Products page, select **Create**.
1. On the Basics tab of the **Create a Data Product** page:
    1. Select your subscription.
    1. Select the resource group you previously created for the Key Vault resource.
    1. Under **Instance details**, complete the following fields:
       - **Name** - Enter the name for your Data Product resource. The name must start with a lowercase letter and can contain only lowercase letters and numbers.
       - **Publisher** - Select the organization that created and published the Data Product that you want to deploy.
       - **Product** - Select the name of the Data Product.
       - **Version** - Select the version.

     Select **Next: Advanced**.

     :::image type="content" source="media/data-product-selection.png" alt-text="Screenshot of the Instance details section of the Basics configuration for a Data Product in the Azure portal.":::
   
1. In the Advanced tab of the **Create a Data Product** page:
    1. Enable Purview if you're integrating with Microsoft Purview.
      Select the subscription for your Purview account, select your Purview account, and enter the Purview collection ID.
    1. Enable Customer managed key if you're using CMK for data encryption.
    1. Select the user-assigned managed identity that you set up as a prerequisite.
    1. Carefully paste the Key Identifier URI that was created when you set up Azure Key Vault as a prerequisite.
   
1. To add one or more owners for the Data Product, which will also appear in Microsoft Purview, select **Add owner**, enter the email address, and select **Add owners**.
1. In the Tags tab of the **Create a Data Product** page, select or enter the name/value pair used to categorize your Data Product resource.
1. Select **Review + create**.
1. Select **Create**. Your Data Product instance is created in about 20-25 minutes. During this time, all the underlying components are provisioned. After this process completes, you can work with your data ingestion, explore sample dashboards and queries, and so on.

# [Azure CLI](#tab/azure-cli)

To create an Azure Operator Insights Data Product with the minimum required parameters, use the following command:

```azurecli-interactive
az network-analytics data-product create --name <DataProductName> --resource-group <ResourceGroup> --location <Region> --publisher Microsoft --product <ProductName> --major-version  <ProductMajorVersion>
```

Use the following values for \<ProductName\> and \<ProductMajorVersion>.


|Data Product  |\<ProductName\> |\<ProductMajorVersion>|
|---------|---------|---------|
|Quality of Experience - Affirmed MCC GIGW |`Quality of Experience - Affirmed MCC GIGW`|`1.0`|
|Quality of Experience - Affirmed MCC PGW or GGSN |`Quality of Experience - Affirmed MCC PGW or GGSN`|`1.0`|
|Monitoring - Affirmed MCC|`Monitoring - Affirmed MCC`|`0` or `1`|


To create an Azure Operator Insights DataProduct with all parameters, use the following command:

```azurecli-interactive
az network-analytics data-product create --name <DataProductName> --resource-group <ResourceGroup> --location <Region> --publisher Microsoft --product <ProductName> --major-version  <ProductMajorVersion --owners <<xyz@email>> --customer-managed-key-encryption-enabled Enabled --key-encryption-enable Enabled --encryption-key '{"keyVaultUri":"<VaultURI>","keyName":"<KeyName>","keyVersion":"<KeyVersion>"}' --purview-account <PurviewAccount> --purview-collection <PurviewCollection> --identity '{"type":"userAssigned","userAssignedIdentities":{"/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<UserAssignedIdentityName>"}}' --tags '{"key1":"value1","key2":"value2"}'
```

---

## Deploy sample insights

Once your Data Product instance is created, you can deploy a sample insights dashboard. This dashboard works with the sample data that came along with the Data Product instance.

1. Navigate to your Data Product resource on the Azure portal and select the Permissions tab on the Security section.
1. Select **Add Reader**. Type the user's email address to be added to Data Product reader role. 

> [!NOTE] 
> The reader role is required for you to have access to the insights consumption URL.

3. Download the sample JSON template file for your Data Product's dashboard:
    * Quality of Experience - Affirmed MCC GIGW: [https://go.microsoft.com/fwlink/p/?linkid=2254536](https://go.microsoft.com/fwlink/p/?linkid=2254536)
    * Monitoring - Affirmed MCC: [https://go.microsoft.com/fwlink/p/?linkid=2254551](https://go.microsoft.com/fwlink/?linkid=2254551)
1. Copy the consumption URL from the Data Product overview screen into the clipboard.
1. Open a web browser, paste in the URL and select enter.
1. When the URL loads, select on the Dashboards option on the left navigation pane.
1. Select the **New Dashboard** drop down and select **Import dashboard from file**. Browse to select the JSON file downloaded previously, provide a name for the dashboard, and select **Create**.
1. Select the three dots (...) at the top right corner of the consumption URL page and select **Data Sources**.
1. Select the pencil icon next to the Data source name to edit the data source. 
1. Under the Cluster URI section, replace the URL with your Data Product consumption URL and select connect.
1. In the Database drop-down, select your Database. Typically, the database name is the same as your Data Product instance name. Select **Apply**.

> [!NOTE] 
> These dashboards are based on synthetic data and may not have complete or representative examples of the real-world experience.  

## Explore sample data using Kusto

The consumption URL also allows you to write your own Kusto query to get insights from the data.

1. On the Overview page, copy the consumption URL and paste it in a new browser tab to see the database and list of tables.

    :::image type="content" source="media/data-product-properties.png" alt-text="Screenshot of part of the Overview pane in the Azure portal, showing the consumption URL.":::

1. Use the ADX query plane to write Kusto queries.

    * For Quality of Experience - Affirmed MCC GIGW, try the following queries:

      ```kusto
      enriched_flow_events_sample
      | summarize Application_count=count() by flowRecord_dpiStringInfo_application
      | order by Application_count desc
      | take 10
      ```

      ```kusto
      enriched_flow_events_sample
      | summarize SumDLOctets = sum(flowRecord_dataStats_downLinkOctets) by bin(eventTimeFlow, 1h)
      | render columnchart
      ```

    * For Monitoring - Affirmed MCC Data Product, try the following queries:

      ```kusto
      SYSTEMCPUSTATISTICSCORELEVEL_SAMPLE
      | where systemCpuStats_core >= 25 and systemCpuStats_core <= 36
      | summarize p90ssm_avg_1_min_cpu_util=round(percentile(ssm_avg_1_min_cpu_util, 90), 2) by resourceId
      ```

      ```kusto
      PGWCALLPERFSTATSGRID_SAMPLE
      | summarize clusterTotal=max(NumUniqueSubscribers) by bin(timestamp, 1d)
      | render linechart
      ```

## Optionally, delete Azure resources

If you're using this Data Product to explore Azure Operator Insights, you should delete the resources you've created to avoid unnecessary Azure costs.

# [Portal](#tab/azure-portal)

1. On the **Home** page of the Azure portal, select **Resource groups**.
1. Select the resource group for your Azure Operator Insights Data Product and verify that it contains the Azure Operator Insights Data Product instance.
1. At the top of the Overview page for your resource group, select **Delete resource group**.
1. Enter the resource group name to confirm the deletion, and select **Delete**.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group delete --name "ResourceGroup"
```
---

## Next step

Upload data to your Data Product:

1. Read the documentation for your Data Product to determine any requirements for ingestion.
2. Set up an ingestion solution:
    - To use the Azure Operator Insights ingestion agent, [install and configure the agent](set-up-ingestion-agent.md).
    - To use [Azure Data Factory](/azure/data-factory/), follow [Use Azure Data Factory to ingest data into an Azure Operator Insights Data Product](ingestion-with-data-factory.md).
