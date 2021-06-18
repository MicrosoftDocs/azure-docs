---
title: Move Azure Analysis Services to a different region | Microsoft Docs
description: Describes how to move an Azure Analysis Services resource to a different region.
author: minewiskan
ms.service: azure-analysis-services
ms.topic: how-to
ms.date: 12/01/2020
ms.author: owend
ms.reviewer: minewiskan
ms.custom: references_regions , devx-track-azurepowershell
#Customer intent: As an Azure service administrator, I want to move Analysis Services server resources to different Azure region.
---

# Move Analysis Services to a different region

This article describes how to move an Analysis Services server resource to a different Azure region. You might move your server to another region for a number of reasons, for example, to take advantage of an Azure region closer to users, to use service plans supported in specific regions only, or to meet internal policy and governance requirements. 

In this and associated linked articles, you learn how to:

> [!div class="checklist"]
> 
> * Backup a source server model database to [Blob storage](../storage/blobs/storage-blobs-introduction.md).
> * Export a source server [resource template](../azure-resource-manager/templates/overview.md).
> * Get a storage [shared access signature (SAS)](../storage/common/storage-sas-overview.md).
> * Modify the resource template.
> * Deploy the template to create a new target server.
> * Restore a model database to the new target server.
> * Verify the new target server and database.
> * Delete the source server.

This article describes using a resource template to migrate a single Analysis Services server with a **basic configuration** to a different region *and* resource group in the same subscription. Using a template retains configured server properties ensuring the target server is configured with the same properties, except region and resource group, as the source server. This article does not describe moving associated resources that may be part of the same resource group such as data source, storage, and gateway resources. 

Before moving a server to a different region, it's recommended you create a detailed plan. Consider additional resources such as gateways and storage that may also need to be moved. With any plan, it's important to complete one or more trial move operations using test servers prior to moving a production server.

> [!IMPORTANT]
> Client applications and connection strings connect to Analysis Services by using the full server name, which is a Uri that includes the region the server is in. For example, `asazure://westcentralus.asazure.windows.net/advworks01`. When moving a server to a different region, you are effectively creating a new server resource in a different region, which will have a different region in the server name Uri. Client applications and connection strings used in scripts must connect to the new server using the new server name Uri. Using a [Server name alias](analysis-services-server-alias.md) can mitigate the number of places the server name Uri has to be changed, but must be implemented prior to a region move.

> [!IMPORTANT]
> Azure regions use different IP address ranges. If you have firewall exceptions configured for the region your server and/or storage account is in, it may be necessary to configure a different IP address range. To learn more, see [Frequently asked questions about Analysis Services network connectivity](analysis-services-network-faq.md).

> [!NOTE]
> This article describes restoring a database backup to a target server from a storage container in the source server's region. In some cases, restoring backups from a different region can have poor performance, especially for large databases. For the best performance during database restore, migrate or create a a new storage container in the target server region. Copy the .abf backup files from the source region storage container to the target region storage container prior to restoring the database to the target server. While out of scope for this article, in some cases, particularly with very large databases, scripting out a database from your source server, recreating, and then processing on the target server to load database data may be more cost effective than using backup/restore.

> [!NOTE]
> If using an On-premises data gateway to connect to data sources, you must also move the gateway resource to the target server region. To learn more, see [Install and configure an on-premises data gateway](analysis-services-gateway-install.md).

## Prerequisites

- **Azure storage account**: Required to store an .abf backup file.
- **SQL Server Management Studio (SSMS)**: Required to backup and restore model databases.
- **Azure PowerShell**. Required only if you choose to complete this task by using PowerShell.

## Prepare

### Backup model databases

If **Storage settings** are not already configured for the source server, follow the steps in [Configure storage settings](analysis-services-backup.md#configure-storage-settings).

When storage settings are configured, follow the steps in [Backup](analysis-services-backup.md#backup) to create a model database .abf backup in your storage container. You later restore the .abf backup to your new target server.


### Export template

The template contains configuration properties of the source server.

# [Portal](#tab/azure-portal)

To export a template by using Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **All resources**, and then select your Analysis Services server.

3. Select > **Settings** > **Export template**.

4. Choose **Download** in the **Export template** blade.

5. Locate the .zip file that you downloaded from the portal, and then unzip that file to a folder.

   The zip file contains the .json files that comprise the template and parameters necessary to deploy a new server.


# [PowerShell](#tab/azure-powershell)

To export a template by using PowerShell:

1. Sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command and follow the on-screen directions:

   ```azurepowershell-interactive
   Connect-AzAccount
   ```
2. If your identity is associated with more than one subscription, then set your active subscription to subscription of the server resource that you want to move.

   ```azurepowershell-interactive
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```

3. Export the template of your source server. These commands save a json template with the ResourceGroupName as filename to your current directory.

   ```azurepowershell-interactive
   $resource = Get-AzResource `
     -ResourceGroupName <resource-group-name> `
     -ResourceName <server-account-name> `
     -ResourceType Microsoft.AnalysisServices/servers
   Export-AzResourceGroup `
     -ResourceGroupName <resource-group-name> `
     -Resource $resource.ResourceId
   ```
---

### Get storage shared access signature (SAS)

When deploying a target server from a template, a user delegation SAS token (as a Uri) is required to specify the storage container containing the database backup.

# [Portal](#tab/azure-portal)

To get a shared access signature by using the portal:

1. In the portal, select the storage account used to backup your server database.

2. Select **Storage Explorer**, and then expand **BLOB CONTAINERS**. 

3. Right-click your storage container, and then select **Get Shared Access Signature**.

    :::image type="content" source="media/move-between-regions/get-sas.png" alt-text="Get SAS":::

4. In **Shared Access Signature**, select **Create**. By default, the SAS will expire in 24 hours.

5. Copy and save the **URI**. 

# [PowerShell](#tab/azure-powershell)

To get a shared access signature by using PowerShell, follow the steps in [Create a user delegation SAS for a container or blob with PowerShell](../storage/blobs/storage-blob-user-delegation-sas-create-powershell.md#create-a-user-delegation-sas-for-a-blob).

---

### Modify the template

Use a text editor to modify the template.json file you exported, changing the region and blob container properties. 

To modify the template:

1. In a text editor, in the **location** property, specify the new target region. In the **backupBlobContainerUri** property, paste the storage container Uri with SAS key. 

    The following example sets the target region for server advworks1 to `South Central US` and specifies the storage container Uri with shared access signature: 

    ```json
    "resources": [
        {
            "type": "Microsoft.AnalysisServices/servers",
            "apiVersion": "2017-08-01",
            "name": "[parameters('servers_advworks1_name')]",
            "location": "South Central US",
            "sku": {
                "name": "S1",
                "tier": "Standard",
                "capacity": 1
            },
            "properties": {
                "asAdministrators": {
                    "members": [
                        "asadmins@adventure-works.com"
                    ]
                },
                "backupBlobContainerUri": "https://storagenorthcentralus.blob.core.windows.net/backup?sp=rl&st=2020-06-01T19:30:42Z&se=2020-06-02T19:30:42Z&sv=2019-10-10&sr=c&sig=PCQ4s9RujJkxu89gO4tiDTbE3%2BFECx6zAdcv8x0cVUQ%3D",
                "querypoolConnectionMode": "All"
            }
        }
    ]         
    ```
2. Save the template.

#### Regions

To get Azure regions, see [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/). To get regions by using PowerShell, run the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) command.

```azurepowershell-interactive
   Get-AzLocation | format-table 
```

## Move

To deploy a new server resource in a different region, you'll use the **template.json** file you exported and modified in the previous sections.

# [Portal](#tab/azure-portal)

1. In the portal, select **Create a resource**.

2. In **Search the Marketplace**, type **template deployment**, and then press **ENTER**.

3. Select **Template deployment**.

4. Select **Create**.

5. Select **Build your own template in the editor**.

6. Select **Load file**, and then follow the instructions to load the **template.json** file you exported and modified.

7. Verify the template editor shows the correct properties for your new target server.

8. Select **Save**.

9. Enter or select the property values:

    - **Subscription**: Select the Azure subscription.
    
    - **Resource group**: Select **Create new**, and then enter a resource group name. You can select an existing resource group provided it does not already contain an Analysis Services server with the same name.
    
    - **Location**: Select the same region you specified in the template.

10. Select **Review and Create**.

11. Review the terms and Basics, and then select **Create**.

# [PowerShell](#tab/azure-powershell)

Use these commands to deploy your template:

```azurepowershell-interactive
   $resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
   $location = Read-Host -Prompt "Enter the location (i.e. South Central US)"

   New-AzResourceGroup -Name $resourceGroupName -Location "$location"
   New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri "<local template file>"  
   ```
---

### Get target server Uri

In order to connect to the new target server from SSMS to restore the model database, you need to get the new target server Uri.

# [Portal](#tab/azure-portal)

To get the server Uri in the portal:

1. In the portal, go to the new target server resource.

2. On the **Overview** page, copy the **Server name** Uri.

# [PowerShell](#tab/azure-powershell)

To get the server Uri by using PowerShell, use the following commands:

```azurepowershell-interactive
   $resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
   $serverName = Read-Host -Prompt "Enter the server name (i.e. advworks2)"

   Get-AzAnalysisServicesServer -ResourceGroupName $resourceGroupName -Name "$serverName"
```
Copy **ServerFullName** from the output.

---

### Restore model database

Follow steps described in [Restore](analysis-services-backup.md#restore) to restore the model database .abf backup to the new target server.

Optional: After restoring the model database, process the model and tables to refresh data from data sources. To process the model and table by using SSMS:

1. In SSMS, right-click the model database > **Process Database**.

2. Expand **Tables**, right-click a table. In **Process Table(s)**, select all tables, and then select **OK**.

## Verify

1. In the portal, go to the new target server.

2. On the Overview page, in **Models on Analysis Services server**, verify restored models appear.

3. Use a client application like Power BI or Excel to connect to the model on the new server. Verify model objects such as tables, measures, hierarchies appear. 

4. Run any automation scripts. Verify they executed successfully.

Optional: [ALM Toolkit](http://alm-toolkit.com/) is an *open source* tool for comparing and managing Power BI Datasets *and* Analysis Services tabular model databases. Use the toolkit to connect to both source and target server databases and compare. If your database migration is successful, model objects will the same definition. 

:::image type="content" source="media/move-between-regions/alm-toolkit.png" alt-text="ALM Toolkit":::

## Clean up resources

After verifying client applications can connect to the new server and any automation scripts are executing correctly, delete your source server. 

# [Portal](#tab/azure-portal)

To delete the source server from the portal:

In your source server's **Overview** page, select **Delete**.

# [PowerShell](#tab/azure-powershell)

To delete the source server by using PowerShell, use the Remove-AzAnalysisServicesServer command.

```azurepowershell-interactive
Remove-AzAnalysisServicesServer -Name "myserver" -ResourceGroupName "myResourceGroup"
```

---

> [!NOTE]
> After completing a region move, it's recommended your new target server use a storage container in the same region for backups, rather than the storage container in the source server region.
