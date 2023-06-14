---
title: Move Azure Data Share Accounts to another Azure region using the Azure portal
description: Use Azure Resource Manager template to move Azure Data Share account from one Azure region to another using the Azure portal.
ms.service: data-share
ms.custom: devx-track-arm-template
ms.topic: how-to
ms.date: 10/27/2022
author: sidontha
ms.author: sidontha
#Customer intent: As an Azure Data Share User, I want to move my Data Share account to a new region.
---

# Move an Azure Data Share Account to another region using the Azure portal

There are various scenarios in which you'd want to move your existing Azure Data Share accounts from one region to another. For example, you may want to create a Data Share Account for testing in a new region. You may also want to move a Data Share Account to another region as part of disaster recovery planning.

Azure Data Share accounts can’t be moved from one region to another. You can however, use an Azure Resource Manager template to export the existing Data Share account, modify the parameters to match the destination region, and then deploy the template to the new region. For more information on Resource Manager and templates, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).


## Prerequisites

- Make sure that the Azure Data Share account is in the Azure region from which you want to move.
- Azure Data Share accounts can’t be moved between regions. You’ll have to re-add datasets to sent shares and resend invitations to Data Share recipients. For any received shares, you will need to request that the data provider sends you a new invitation.


## Prepare and move
The following steps show how to deploy a new Data Share account using a Resource Manager template via the portal.


### Export the template and deploy from the portal

1. Login to the [Azure portal](https://portal.azure.com).
1. Select **All resources** and then select your Data Share account
1. Select **Automation** > **Export template**
1. Choose **Deploy** in the **Export template** blade.
1. Select **Edit parameters** to open the **parameters.json** file in the online editor.
1. To edit the parameter of the Data Share account name, change the property under **parameters** > **value** from the source Data Share Account's name to the name of the Data Share Account you want to create in a new region, ensure the name is in quotes:

    ```json
    {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
    "accounts_my_datashare_account_name": {
       "value": "<target-datashare-account-name>"
        }
       }
    }
    ```

1.  Select **Save** in the editor.

1.  Select **Edit template** to open the **template.json** file in the online editor.

1. To edit the target region where the Data Share account will be moved, change the **location** property under **resources** in the online editor:

    ```json
    "resources": [
        {
        "type": "Microsoft.DataShare/accounts",
        "apiVersion": "2021-08-01",
        "name": "[parameters('accounts_my_datashare_account_name')]",
        "location": "<target-region>",
        "identity": {
            "type": "SystemAssigned"
        }
        "properties": {}
        }
    ]
    ```

1. To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/).  The code for a region is the region name with no spaces, **Central US** = **centralus**.

1. You can also change other parameters in the template if you choose. This is optional depending on your requirements:

    * **Sent Shares** - You can edit which Sent Shares are deployed into the target Data Share Account by adding or removing Shares from the **resources** section in the **template.json** file.:
    ```json
    "resources": [
        {
        "type": "Microsoft.DataShare/accounts/shares",
        "apiVersion": "2021-08-01",
        "name": "[concat(parameters('accounts_my_datashare_account_name'), '/test_sent_share')]",
        "dependsOn": [
            "[resourceId('Microsoft.DataShare/accounts', parameters('accounts_my_datashare_account_name'))]"
        ],
        "properties": {
            "shareKind": "CopyBased"
        }
        },
    ]
    ```

    * **Sent Share Invitations** - You can edit which Invitations are deployed into the target Data Share account by adding or removing Invitations from the resources section in the **template.json** file.
    ```json
    "resources": [
        {
         "type": "Microsoft.DataShare/accounts/shares/invitations",
         "apiVersion": "2021-08-01",
         "name": "[concat(parameters('accounts_my_datashare_account_name'), '/test_sent_share/blob_snapshot_jsmith_microsoft_com')]",
         "dependsOn": [
             "[resourceId('Microsoft.DataShare/accounts/shares', parameters('accounts_my_datashare_account_name'), 'test_sent_share')]",
             "[resourceId('Microsoft.DataShare/accounts', parameters('accounts_my_datashare_account_name'))]"
         ],
        "properties": {
            "targetEmail": "jsmith@microsoft.com"
        }
        }
    ]
    ```
    
    * **Datasets** - You can edit which datasets are deployed into the target Data Share account by adding or removing datasets from the resources section in the **template.json** file. Below is an example of a BlobFolder dataset. 
    
    * If you are also moving the resources contained in the datasets to a new region, you will have to remove the datasets from the **template.json** file and manually re-add them once the Data Share account and resources referenced in the datasets are moved to the new region.
    
    >[!IMPORTANT]
    >* Datasets will fail to deploy if the new Data Share account you are deploying will not automatically inherit required permissions to access the datasets. The required permissions depend on the dataset type. See here for required permissions for [Azure Synapse Analytics and Azure SQL Database datasets](how-to-share-from-sql.md#prerequisites-for-sharing-from-azure-sql-database-or-azure-synapse-analytics-formerly-azure-sql-dw). See here for required permissions for [Azure Storage and Azure Data Lake Gen 1 and Gen2 datasets](how-to-share-from-storage.md#prerequisites-for-the-source-storage-account). 
  
    ```json
    "resources": [
        {
        "type": "Microsoft.DataShare/accounts/shares/dataSets",
        "apiVersion": "2021-08-01",
        "name": "[concat(parameters('accounts_my_datashare_account_name'), '/blobpath/directory')]",
        "dependsOn": [
            "[resourceId('Microsoft.DataShare/accounts/shares', parameters('accounts_my_datashare_account_name'), 'blobpath')]",
            "[resourceId('Microsoft.DataShare/accounts', parameters('accounts_my_datashare_account_name'))]"
             ],
            "kind": "BlobFolder",
            "properties": {
                "containerName": "<container-name>",
                "prefix": "<prefix>"
                "subscriptionId": "<subscription-id>",
                "resourceGroup": "<resource-group-name>",
                "storageAccountName": "<storage-account-name>"
            }
        }
    ]
    ```
            

1. Select **Save** in the online editor.

1. Under the **Project details** section, select the **Subscription** dropdown to choose the subscription where the target Data Share account will be deployed.

1. Select the **Resource group** dropdown to choose the resource group where the target Data Share account will be deployed.  You can select **Create new** to create a new resource group for the target Data Share account.

1. Verify that the **Location** field is set to the target location you want the Data Share account to be deployed to.

1. Verify under **Instance details** that the name matches the name that you entered in the parameters editor above.

1. Select **Review + Create** to advance to the next page.

1. Review the terms and select **Create** to begin the deployment.

1. Once the deployment finishes, go to the newly created Data Share account. 

1. If you were unable to transfer datasets using the template, you will need to re-add datasets to all of your Sent Shares.

1. Resend invitations to all recipients of your sent shares and alert the consumers of your shares that they will need to reaccept and remap the data you are sharing with them. 

## Verify

### Sent shares
- Confirm that all sent shares in your source Data Share account are now present in the target Data Share account.
- For each sent share, confirm that all data sets from the source share are now present in the target share. If they are not, you will need to manually re-add them.
- For all share subscriptions in each sent share in your source account, confirm that you have sent invitations to all recipients of the shares so that they will be able to access the data again.

### Received shares
- Confirm that you have requested new invitations from data providers for all received shares from your source data share account.
- Once you receive these invitations, you will need to remap the data sets and run snapshots to access the data again.

## Clean up source resources

To complete the move of the Data Share account, delete the source Data Share account. To do so, select the resource group from your dashboard in the Azure portal, navigate to the Data Share account you wish to delete and select **Delete** at the top of the page.

## Next steps

In this tutorial, you moved an Azure Data Share account from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
