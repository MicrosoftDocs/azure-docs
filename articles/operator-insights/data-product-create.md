---
title: Create an Azure Operator Insights Data Product
description: In this article, learn how to create an Azure Operator Insights Data Product resource. 
author: rcdun
ms.author: rdunstan
ms.reviewer: rathishr
ms.service: operator-insights
ms.topic: quickstart
ms.date: 10/16/2023
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---

# Create an Azure Operator Insights Data Product

In this article, you learn how to create an Azure Operator Insights Data Product instance.

> [!NOTE]
> Access is currently only available by request. More information is included in the application form. We appreciate your patience as we work to enable broader access to Azure Operator Insights Data Product. Apply for access by [filling out this form](https://aka.ms/AAn1mi6).

## Prerequisites

- An Azure subscription for which the user account must be assigned the Contributor role. If needed, create a [free subscription](https://azure.microsoft.com/free/) before you begin.
- Access granted to Azure Operator Insights for the subscription. Apply for access by [completing this form](https://aka.ms/AAn1mi6).
- (Optional) If you plan to integrate Data Product with Microsoft Purview, you must have an active Purview account. Make note of the Purview collection ID when you [set up Microsoft Purview with a Data Product](purview-setup.md).
- After obtaining your subscription access, register the Microsoft.NetworkAnalytics and Microsoft.HybridNetwork Resource Providers (RPs) to continue. For guidance on registering RPs in your subscription, see [Register resource providers in Azure](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal).

### For CMK-based data encryption or Microsoft Purview

If you're using CMK-based data encryption or Microsoft Purview, you must set up Azure Key Vault and user-assigned managed identity (UAMI) as prerequisites.

#### Set up Azure Key Vault

Azure key Vault Resource is used to store your Customer Managed Key (CMK) for data encryption. Data Product uses this key to encrypt your data over and above the standard storage encryption. You need to have Subscription/Resource group owner permissions to perform this step.

# [Portal](#tab/azure-portal)

1. [Create an Azure Key Vault resource](../key-vault/general/quick-create-portal.md) in the same subscription and resource group where you intend to deploy the Data Product resource.
1. Provide your user account with the Key Vault Administrator role on the Azure Key Vault resource. This is done via the **Access Control (IAM)** tab on the Azure Key Vault resource.
1. Navigate to the object and select **Keys**. Select **Generate/Import**.
1. Enter a name for the key and select **Create**.
1. Select the newly created key and select the current version of the key.
1. Copy the Key Identifier URI to your clipboard to use when creating the Data Product.

# [Azure CLI](#tab/azure-cli)
<!-- CLI link is [Create an Azure Key Vault resource](../key-vault/general/quick-create-cli.md) in the same subscription and resource group where you intend to deploy the Data Product resource. --> 

You can sign in to Azure and run Azure CLI commands in one of two ways:

- You can run CLI commands from within the Azure portal, in Azure Cloud Shell.
- You can install the CLI and run CLI commands locally.

### Use Azure Cloud Shell

Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. The Azure CLI is preinstalled and configured to use with your account. Select the **Cloud Shell** button on the menu in the upper-right section of the Azure portal:

[![Cloud Shell](./media/dp-quickstart-create/cloud-shell-menu.png)](https://portal.azure.com)

The button launches an interactive shell that you can use to run the steps outlined in this how-to article:

[![Screenshot showing the Cloud Shell window in the portal](./media/dp-quickstart-create/cloud-shell.png)](https://portal.azure.com)


### Install the Azure CLI locally

You can also install and use the Azure CLI locally. If you plan to use Azure CLI locally, make sure you have installed the latest version of the Azure CLI. See [Install the Azure CLI](/cli/azure/install-azure-cli).
Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. The Azure CLI is preinstalled and configured to use with your account. Select the Cloud Shell button on the menu in the upper-right section of the Azure portal:

To launch Azure Cloud Shell, sign in to the Azure portal.

To log into your local installation of the CLI, run the az sign-in command:

```azurecli-interactive
az login
```

## Change the active subscription

Azure subscriptions have both a name and an ID. You can switch to a different subscription using [az account set](/cli/azure/account#az-account-set) specifying the desired subscription ID or name.

```azurecli-interactive
# change the active subscription using the subscription name
az account set --subscription "My Demos"

# change the active subscription using the subscription ID
az account set --subscription "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Use the az group create command to create a resource group named myResourceGroup in the eastus location.

```azurecli-interactive
az group create --name "myResourceGroup" --location "EastUS"
```

## Create a key vault

Use the Azure CLI az keyvault create command to create a Key Vault in the resource group from the previous step. You will need to provide some information:

- Key vault name: A string of 3 to 24 characters that can contain only numbers (0-9), letters (a-z, A-Z), and hyphens (-)

 Important

Each key vault must have a unique name. Replace <your-unique-keyvault-name> with the name of your key vault in the following examples.

- Resource group name: myResourceGroup.

- The location: EastUS.
 
```azurecli-interactive
az keyvault create --name "<your-unique-keyvault-name>" --resource-group "myResourceGroup" --location "EastUS"
```

The output of this command shows properties of the newly created key vault. Take note of the two properties listed below:

Vault Name: The name you provided to the --name parameter above.
Vault URI: In the example, this is https://<your-unique-keyvault-name>.vault.azure.net/. Applications that use your vault through its REST API must use this URI.
At this point, your Azure account is the only one authorized to perform any operations on this new vault.

## Key vault role assignment

Provide your user account with the Key Vault Administrator role on the Azure Key Vault resource.

```azurecli-interactive
az role assignment create --role "Key Vault Administrator" --assignee <<user email address>> --scope /subscriptions/{subscriptionid}/resourcegroups/{resource-group-name}/providers/Microsoft.KeyVault/vaults/{key-vault-name}
```
Replace the values for subscriptionid, resource-group-name, and key-vault-name with the appropriate values.

## Create a Key

```azurecli-interactive
az keyvault key create --vault-name "<your-unique-keyvault-name>" -n ExampleKey --protection software
```

From the output screen copy the KeyID and store it in your clipboard for later use.

# [Azure PowerShell](#tab/azure-powershell)

PowerShell....

<!-- PowerShell link is  [Create an Azure Key Vault resource](../key-vault/general/quick-create-powershell.md) in the same subscription and resource group where you intend to deploy the Data Product resource. --> 

---

#### Set up user-assigned managed identity

# [Portal](#tab/azure-portal)

1. [Create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) using Microsoft Entra ID for CMK-based encryption. The Data Product also uses the user-assigned managed identity (UAMI) to interact with the Microsoft Purview account.
1. Navigate to the Azure Key Vault resource that you created earlier and assign the UAMI with **Key Vault Administrator** role.

# [Azure CLI](#tab/azure-cli)

Azure CLI...

<!-- Managed identity link for the CLI: /entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azcli -->

To create a user-assigned managed identity, your account needs the Managed Identity Contributor role assignment.

Use the az identity create command to create a user-assigned managed identity. The -g parameter specifies the resource group where to create the user-assigned managed identity. The -n parameter specifies its name. Replace the <RESOURCE GROUP> and <USER ASSIGNED IDENTITY NAME> parameter values with your own values.

 Important

When you create user-assigned managed identities, only alphanumeric characters (0-9, a-z, and A-Z) and the hyphen (-) are supported. 

```azurecli-interactive
az identity create -g <RESOURCE GROUP> -n <USER ASSIGNED IDENTITY NAME>
```

Copy the principalId from the output screen and store it in your clipboard for later use.

## Assign User-Assigned Managed Identity to Key Vault

```azurecli-interactive
az role assignment create --role "Key Vault Administrator" --assignee <<pricipalID from above step>> --scope /subscriptions/{subscriptionid}/resourcegroups/{resource-group-name}/providers/Microsoft.KeyVault/vaults/{key-vault-name}
```
# [Azure PowerShell](#tab/azure-powershell)

PowerShell....

<!-- Managed identity link for PowerShell: /entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-powershell -->

---


## Create an Azure Operator Insights Data Product resource in the Azure portal

You create the Azure Operator Insights Data Product resource.

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search bar, search for Operator Insights and select **Azure Operator Insights - Data Products**.
1. On the Azure Operator Insights - Data Products page, select **Create**.
1. On the Basics tab of the **Create a Data Product** page:
    1. Select your subscription.
    1. Select the resource group you previously created for the Key Vault resource.
    1. Under the Instance details, complete the following fields:
       - Name - Enter the name for your Data Product resource. The name must start with a lowercase letter and can contain only lowercase letters and numbers.
       - Publisher - Select Microsoft.
       - Product - Select Quality of Experience - Affirmed MCC GIGW or Monitoring - Affirmed MCC Data Product.
       - Version - Select the version.

     Select **Next**.
   
1. In the Advanced tab of the **Create a Data Product** page:
    1. Enable Purview if you're integrating with Microsoft Purview.
      Select the subscription for your Purview account, select your Purview account, and enter the Purview collection ID.
    1. Enable Customer managed key if you're using CMK for data encryption.
    1. Select the user-assigned managed identity that you set up as a prerequisite.
    1. Carefully paste the Key Identifier URI that was created when you set up Azure Key Vault as a prerequisite.
   
1. To add owner(s) for the Data Product, which will also appear in Microsoft Purview, select **Add owner**, enter the email address, and select **Add owners**.
1. In the Tags tab of the **Create a Data Product** page, select or enter the name/value pair used to categorize your data product resource.
1. Select **Review + create**.
1. Select **Create**. Your Data Product instance is created in about 20-25 minutes. During this time, all the underlying components are provisioned. After this process completes, you can work with your data ingestion, explore sample dashboards and queries, and so on.

# [Azure CLI](#tab/azure-cli)

Azure CLI...

To create a Azure Operator Insights DataProduct with just mandatory parameters, use the following command:

```azurecli-interactive
az network-analytics data-product create --name <<dpname>> --resource-group <<rgname>> --location <<azurelocation>> --publisher Microsoft --product <<product name>> --major-version  <<product major version>>
```

To create a Azure Operator Insights DataProduct with all parameters, use the following command:

```azurecli-interactive
az network-analytics data-product create --data-product-name
                                         --resource-group
                                         [--encryption-key]
                                         [--identity]
                                         [--key-encryption-enable {Disabled, Enabled}]
                                         [--location]
                                         [--major-version]
                                         [--managed-rg]
                                         [--networkacls]
                                         [--no-wait {0, 1, f, false, n, no, t, true, y, yes}]
                                         [--owners]
                                         [--private-links-enabled {Disabled, Enabled}]
                                         [--product]
                                         [--public-network-access {Disabled, Enabled}]
                                         [--publisher]
                                         [--purview-account]
                                         [--purview-collection]
                                         [--redundancy {Disabled, Enabled}]
                                         [--tags]
```


Create data product with all parameter

```azurecli-interactive
az network-analytics data-product create --name <<dpname>> --resource-group <<rgname>> --location <<azurelocation>> --publisher Microsoft --product <<productname>> --major-version  <<product major version> --owners <<xyz@email>> --customer-managed-key-encryption-enabled Enabled --key-encryption-enable Enabled --encryption-key '{"keyVaultUri":"<vaulturi>","keyName":"<keyname>","keyVersion":"<version>"}' --purview-account purviewaccount --purview-collection collection --identity '{"type":"userAssigned","userAssignedIdentities":{"/subscriptions/<subid>/resourceGroups/<rgname>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<idname>"}}' --tags '{"key1":"value1","key2":"value2"}'
```
For dpname, rgname, azurelocation use the use desired values.
For Product name and corresponding versions
- Quality of Experience - Affirmed MCC GIGW
  - 1.0
- Quality of Experience - Affirmed MCC PGW or GGSN
    - 1.0
- Monitoring - Affirmed MCC
    - 0 or 1
For ownersemail, vaulturi, keyname, version, purviewaccount, collection, uami and tags use the desired values.

# [Azure PowerShell](#tab/azure-powershell)

PowerShell....

---

## Deploy Sample Insights

Once your Data Product instance is created, you can deploy a sample insights dashboard. This dashboard works with the sample data that came along with the Data Product instance.

1. Navigate to your Data Product resource on the Azure portal and select the Permissions tab on the Security section.
1. Select **Add Reader**. Type the user's email address to be added to Data Product reader role. 

> [!NOTE] 
> The reader role is required for you to have access to the insights consumption URL.

3. Download the sample JSON template file for your data product's dashboard:
    * Quality of Experience - Affirmed MCC GIGW: [https://go.microsoft.com/fwlink/p/?linkid=2254536](https://go.microsoft.com/fwlink/p/?linkid=2254536)
    * Monitoring - Affirmed MCC: [https://go.microsoft.com/fwlink/p/?linkid=2254551](https://go.microsoft.com/fwlink/?linkid=2254551)
1. Copy the consumption URL from the Data Product overview screen into the clipboard.
1. Open a web browser, paste in the URL and select enter.
1. When the URL loads, select on the Dashboards option on the left navigation pane.
1. Select the **New Dashboard** drop down and select **Import dashboard from file**. Browse to select the JSON file downloaded previously, provide a name for the dashboard and select **Create**.
1. Select the three dots (...) at the top right corner of the consumption URL page and select **Data Sources**.
1. Select the pencil icon next to the Data source name in order to edit the data source. 
1. Under the Cluster URI section, replace the URL with your Data Product consumption URL and select connect.
1. In the Database drop-down, select your Database. Typically, the database name is the same as your Data Product instance name. Select **Apply**.

> [!NOTE] 
> These dashboards are based on synthetic data and may not have complete or representative examples of the real-world experience.  

## Explore sample data using Kusto

The consumption URL also allows you to write your own Kusto query to get insights from the data.

1. On the Overview page, copy the consumption URL and paste it in a new browser tab to see the database and list of tables.
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

## Delete Azure resources

When you have finished exploring Azure Operator Insights Data Product, you should delete the resources you've created to avoid unnecessary Azure costs.

# [Portal](#tab/azure-portal)

1. On the **Home** page of the Azure portal, select **Resource groups**.
1. Select the resource group for your Azure Operator Insights Data Product and verify that it contains the Azure Operator Insights Data Product instance.
1. At the top of the Overview page for your resource group, select **Delete resource group**.
1. Enter the resource group name to confirm the deletion, and select **Delete**.

# [Azure CLI](#tab/azure-cli)

Azure CLI...

# [Azure PowerShell](#tab/azure-powershell)

PowerShell....

---
