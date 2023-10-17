---
title: Create an Azure Operator Insights Data Product
description: In this article, learn how to create an Azure Operator Insights Data Product resource. 
author: bettylew
ms.author: bettylew
ms.service: operator-insights
ms.topic: quickstart #Required; leave this attribute/value as-is.
ms.date: 10/16/2023
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---

# Create an Azure Operator Insights Data Product

In this article, you'll learn how to create an Azure Operator Insights Data Product instance.

> [!NOTE]
> Access is currently only available by request. More information is included in the application form. We appreciate your patience as we work to enable broader access to Azure Operator Insights Data Product. Apply for access by [filling out this form](https://aka.ms/AAn1mi6).

## Prerequisites

- An Azure subscription for which the user account must be assigned the Contributor role. If needed, create a [free subscription](https://azure.microsoft.com/free/) before you begin.
- Access granted to Azure Operator Insights for the subscription. Apply for access by [completing this form](https://aka.ms/AAn1mi6).
- An active Azure Purview account. Make note of the Purview collection ID when you [create a Purview account](../purview/create-microsoft-purview-portal.md). To determine the Purview collection ID, select your collection and the collection ID is the five digits following `?collection=` in the URL.

For CMK-based data encryption or Purview, you must set up Azure Key Vault and UAMI as prerequisites.

### Set up Azure Key Vault

To perform the below steps you need to be a subscription "owner".
1. [Create an Azure Key Vault resource](../key-vault/general/quick-create-portal.md) in the same subscription and resource group where you intend to deploy the Data Product resource.
1. Provide your user account with the Key Vault Administrator role on the Azure Key Vault resource.
1. Navigate to the object and select **Keys**. Select **Generate/Import**.
1. Enter a name for the key and leave the defaults for the remaining settings. Select **Create**.
1. Select the newly created key and select the current version of the key.
1. Copy the Key Identifier to your clipboard to use when creating the Data Product.

### Set up user-assigned managed identity

1. [Create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) using Microsoft Entra for CMK-based encryption. The Data Product also uses the UAMI to interact with the Microsoft Purview account.
1. Assign the appropriate Azure roles (RBAC) on the Key Vault by navigating to the Azure Key Vault resource that you created and assign the UAMI resource the Key Vault Administrator role.

## Create an Azure Operator Insights Data Product resource in the Azure portal

You'll create the Azure Operator Insights Data Product resource.

1. Sign in to the [Azure portal](https://azure.microsoft.com/).
1. In the search bar, search for Operator Insights and select **Azure Operator Insights - Data Products**.
1. On the Azure Operator Insights - Data Products page, select **Create**.
1. In the Basics tab of the **Create a Data Product** page:
    1. Select your subscription.
    1. Select your resource group or select **Create new** to enter a new name.
        If you create a new resource group, fill in these fields:
        - Name - Enter the name for your Data Product instance. The name must start with a lowercase letter and can contain only lowercase letters and numbers.
        - Publisher - Select Microsoft.
        - Product - Select MCC.
        - Version - Select the version.

        Select **Next**.
    1. Select your region.
1. In the Advanced tab of the **Create a Data Product** page:
    1. Enable Purview if you are integrating with Azure Purview.

        Select the subscription for your Purview account, select your Purview account, and enter the Purview collection ID.
    1. Enable Customer managed key if you are using CMK for data encryption.
    1. Select the user-assigned managed identity that you set up as a prerequisite.
    1. Carefully paste the Key Identifier URI that was created when you set up Azure Key Vault as a prerequisite.
    1. If you are integrating with Purview, owners are mandatory. Select **Add owner**, enter the email address, and select **Add owners**.
1. In the Tags tab of the **Create a Data Product** page, select or enter the name/value pair used to categorize your data product resource.
1. Select **Review + create**.
1. Select **Create**. Your Data Product instance will be created in about 20-25 minutes.

## Copy sample data to the ingestion endpoint

To download the sample MCC EDR data to the ingestion endpoint.

1. You must use tools such as Azure Data Explorer to download the sample data, including the dashboard JSON files, from `https://bugbashsamplefiles.blob.core.windows.net/samplefiles?sp=rle&st=2023-10-13T11:47:35Z&se=2023-11-30T19:47:35Z&spr=https&sv=2022-11-02&sr=c&sig=v7%2Bww1hrSv1%2Fksy%2BK1RH3pITYKt%2F7n21JJ%2FASN7L8wQ%3D`.

    You cannot select this URL to download.
1. Use AzCopy to copy the sample data to the ingestion endpoint. [Download AzCopy](../storage/common/storage-use-azcopy-v10.md#download-azcopy) and install it on the local machine. You can get the ingestion endpoint from the Data Product Overview page.
1. Run the following command to copy the sample data to the ingestion endpoint:

    `azcopy cp "<source-path>" "<destination-path> --recursive`

    where \<*source-path*\> is the local source path to the sample data and  \<*destination-path*\> is the modified ingestion endpoint with the container path.
1. To find and modify the container path, navigate to the resource groups in your subscription and search for the Azure Managed Group that was created with a name similar to the resource group of your Data Product instance in the format `<data-product-name>-HostedReources-<unique-id>`.
    1. Select the Key Vault Resource and on the Access control (IAM) pane, navigate to **Add** \> **Add role assignment**, and add your Key Vault Reader and Key Vault Secrets User.
    1. Navigate to the Secrets pane, select input-storage-sas and the row under CURRENT VERSION. Select **Show Secret Value** and copy this value. It should resemble the following URL:  
    `https://<dataProductId>.blob.core.windows.net?sv=2021-12-02&ss=b&srt=o&spr=https,http&st=<timestamp>&se=<timestamp>&sip=0.0.0.0-255.255.255.255&sp=w&sig=<secret>`
    1. Modify this URL by adding /edr/mcc/<*region*>/bronze/raw/events/edr/unseggregated before `?sv=` (replacing \<*region*\> with your region) to create a modified URL in the following format: `https://<dataProductId>.blob.core.windows.net/edr/mcc/<region>/bronze/raw/events/edr/unseggregated?sv=2021-12-02&ss=b&srt=o&spr=https,http&st=<timestamp>&se=<timestamp>&sip=0.0.0.0-255.255.255.255&sp=w&sig=<secret>`

        Run the `azcopy cp "<source-path>" "<destination-path> --recursive` command to copy the sample data from the local source to the ingestion endpoint using the modified ingestion endpoint URL.  

## Explore sample data

Once the data is uploaded and processed, you can access the consumption URL to query the data.

1. Navigate to your Data Product resource on the Azure portal and select the Permissions tab on the Security pane.
1. Select **Add Reader**. Add user accounts for the identities that will be provided reader access.
1. On the Overview page, copy the consumption URL and paste it in a new browser tab to see the database and list of tables.
1. Use the ADX query plane to write Kusto queries. For example:

    `session | take 10`

    ```
    enriched_flow_session_http
    | summarize count() by flowRecord_dpiStringInfo_application
    | order by count_ desc
    | take 10
    ```

    ```
    enriched_flow_session_http
    | summarize sum(flowRecord_dataStats_downLinkOctets) by bin(eventTimeFlow, 1h)
    | render columnchart
    ```

## Import dashboards

To manually import dashboard JSON files:
1. From the Data Product Security pane, select Permissions and add yourself as a reader by entering your email address and selecting **Add Readers**.
1. From the Overview page, copy the consumption URL and open the URL in a new browser tab.
1. Navigate to the Dashboards section in the consumption URL.
1. Select **New Dashboard > Import Dashboard file**.
1. Accept the default dashboard name and select **Create**.
1. Select Settings (three dots) in top right corner and select **Data Sources**.
1. Select Edit.
1. Provide the consumption URI and select Connect.
1. Select the appropriate database name for your Data Product instance.
1. Accept default values for the rest and select Apply.
1. Modify other options as applicable to view the data.

## Delete Azure resources

When you have finished exploring Azure Operator Insights Data Product, you should delete the resources you've created to avoid unnecessary Azure costs.

1. On the **Home** page of the Azure portal, select **Resource groups**.
1. Select the resource group for your Azure Operator Insights Data Product (not the managed resource group), and verify that it contains the Azure Operator Insights Data Product instance.
1. At the top of the Overview page for your resource group, select **Delete resource group**.
1. Enter the resource group name to confirm the deletion, and select **Delete**.
