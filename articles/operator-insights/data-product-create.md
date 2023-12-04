---
title: Create an Azure Operator Insights Data Product
description: In this article, learn how to create an Azure Operator Insights Data Product resource. 
author: HollyCl
ms.author: HollyCl
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
1. [Create an Azure Key Vault resource](../key-vault/general/quick-create-portal.md) in the same subscription and resource group where you intend to deploy the Data Product resource.
1. Provide your user account with the Key Vault Administrator role on the Azure Key Vault resource. This is done via the **Access Control (IAM)** tab on the Azure Key Vault resource.
1. Navigate to the object and select **Keys**. Select **Generate/Import**.
1. Enter a name for the key and select **Create**.
1. Select the newly created key and select the current version of the key.
1. Copy the Key Identifier URI to your clipboard to use when creating the Data Product.

#### Set up user-assigned managed identity

1. [Create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) using Microsoft Entra ID for CMK-based encryption. The Data Product also uses the user-assigned managed identity (UAMI) to interact with the Microsoft Purview account.
1. Navigate to the Azure Key Vault resource that you created earlier and assign the UAMI with **Key Vault Administrator** role.


## Create an Azure Operator Insights Data Product resource in the Azure portal

You create the Azure Operator Insights Data Product resource.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search bar, search for Operator Insights and select **Azure Operator Insights - Data Products**.
1. On the Azure Operator Insights - Data Products page, select **Create**.
1. On the Basics tab of the **Create a Data Product** page:
   1. Select your subscription.
   1. Select the resource group you previously created for the Key Vault resource.
   1. Under the Instance details, complete the following fields:
      - Name - Enter the name for your Data Product resource. The name must start with a lowercase letter and can contain only lowercase letters and numbers.
      - Publisher - Select Microsoft.
      - Product - Select MCC.
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
1. Select **Create**. Your Data Product instance is created in about 20-25 minutes. During this time, all the underlying components are provisioned post which you can work with your data ingestion, exploring sample dashboards, queries etc.

## Deploy Sample Insights

Once your Data Product instance is created, you can deploy sample insights dashboard which works against the sample data that came along with the Data Product instance.

1. Navigate to your Data Product resource on the Azure portal and select the Permissions tab on the Security section.
1. Select **Add Reader**. Type the user's email address to be added to Data Product reader role. 

> [!NOTE] 
> The reader role is required for you to have access to the insights consumption URL.

3.	Download the sample JSON template file from the Data product overview page by clicking on the link shown after the text “Sample Dashboard”. Alternatively [download the sample JSON template file here](https://aka.ms/aoidashboard).
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
1. Use the ADX query plane to write Kusto queries. For example:

 ```
 enriched_flow_events_sample
 | summarize Application_count=count() by flowRecord_dpiStringInfo_application
 | order by Application_count desc
 | take 10
 ```

```
enriched_flow_events_sample
| summarize SumDLOctets = sum(flowRecord_dataStats_downLinkOctets) by bin(eventTimeFlow, 1h)
| render columnchart
```

## Delete Azure resources

When you have finished exploring Azure Operator Insights Data Product, you should delete the resources you've created to avoid unnecessary Azure costs.

1. On the **Home** page of the Azure portal, select **Resource groups**.
1. Select the resource group for your Azure Operator Insights Data Product and verify that it contains the Azure Operator Insights Data Product instance.
1. At the top of the Overview page for your resource group, select **Delete resource group**.
1. Enter the resource group name to confirm the deletion, and select **Delete**.
