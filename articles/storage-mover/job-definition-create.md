---
title: How to define a migration job
description: To migrate a share, create a job definition in a project.
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 08/04/2023
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: 

REVIEW Stephen/Fabian: Reviewed - Stephen
REVIEW Engineering: not reviewed
EDIT PASS: started

Initial doc score: 100 (1725 words and 0 issues)

!########################################################
-->

# How to define and start a migration job

When you migrate a share to Azure, you need to describe the source share, the Azure target, and any migration settings you want to apply. These attributes are defined in a job definition within your storage mover resource. This article describes how to create and run such a job definition.

## Prerequisites

Before you begin following the examples in this article, it's important that you have an understanding of the Azure Storage Mover resource hierarchy. Review the [Understanding the Storage Mover resource hierarchy](resource-hierarchy.md) article, to understand the necessity of the job definition prerequisites.

There are three prerequisites to the definition the migration of your source shares:

- **An existing storage mover resource.**<br/>
  If you haven't deployed a storage mover resource, follow the steps in the *[Create a storage mover resource](storage-mover-create.md)* article. These steps help you deploy a storage mover resource to the desired region within your Azure subscription.
- **At least one existing Azure Storage Mover agent virtual machine (VM).**<br/>
  The steps in the [Azure Storage Mover agent VM deployment](agent-deploy.md) and [agent registration](agent-register.md) articles guide you through the deployment and registration process.
- **Finally, you need to create a job definition to define a migration.**<br/>
  Job definitions are organized in a migration project. You need at least one migration project in your storage mover resource. If you haven't already done so, follow the deployment steps in the [manage projects](project-manage.md) article to create a migration project.

## Create and start a job definition

A job definition is created within a project resource. Creating a job definition requires you to select or configure a project, a source and target storage endpoint, and a job name. If you've followed the examples contained in previous articles, you may have an existing project within a previously deployed storage mover resource. Follow the steps in this section to add a job definition to a project.

Storage endpoints are separate resources in your storage mover. You need to create a source and target endpoint before you can reference them within a job definition. The examples in this section describe the process of creating endpoints.

Refer to the [resource naming convention](../azure-resource-manager/management/resource-name-rules.md#microsoftstoragesync) article for help with choosing supported resource names.

### [Azure portal](#tab/portal)

1. Navigate to the **Project explorer** page within the [Azure portal](https://portal.azure.com) to view a list of available projects. If no projects exist, or you need to create a new project, you can follow the steps included in the [Manage Azure Storage Mover projects](project-manage.md) article.

   :::image type="content" source="media/job-definition-create/project-explorer-sml.png" alt-text="Screen capture of the Project Explorer's Overview tab within the Azure portal." lightbox="media/job-definition-create/project-explorer-lrg.png":::

   From within the project explorer pane or the results list, select the name of an available project. The project's properties and job summary data are displayed in the **details** pane. Any existing job definitions and deployed jobs defined for the project are also shown.

   In the actions menu within the project's details pane, select **Create job definition** to open the **Create a migration job** window. If no job definitions exist within the project, you can also select **Create a job definition** near the bottom of the pane, as shown in the following example.

   :::image type="content" source="media/job-definition-create/project-selected-sml.png" alt-text="Screen capture of the Project Explorer's Overview tab within the Azure portal highlighting the use of filters." lightbox="media/job-definition-create/project-selected-lrg.png":::

1. In the **Basics** tab of the **Create a migration job** window, enter a value in the required **Name** field. You may also add an optional description value of less than 1024 characters. Finally, in the **Migration agent** section, select the agent to perform the data migration and then select **Next** to open the **Source** tab. You should choose an agent located as near your data source as possible. The selected agent should also have resources appropriate to the size and complexity of the job. You can assign a different agent to your job at a later time if desired.

   :::image type="content" source="media/job-definition-create/tab-basics-sml.png" alt-text="Screen capture of the migration job's Basics tab, showing the location of the data fields." lightbox="media/job-definition-create/tab-basics-lrg.png":::

1. In the **Source** tab, select an option within the **Source endpoint** field. You can choose to either use an existing source endpoint or create a new endpoint resource.

   If you want to use an existing source endpoint that you've previously defined, choose the **Select an existing endpoint** option. Next, select the **Select an existing endpoint as a source** link to open the source endpoint pane. This pane displays a detailed list of your previously defined endpoints. Select the appropriate endpoint and select **Select** to return to the **Source** tab and populate the **Existing source endpoint** field.

   :::image type="content" source="media/job-definition-create/endpoint-source-existing-sml.png" alt-text="Screen capture of the Source tab illustrating the location of the Existing Source Endpoint field." border="false" lightbox="media/job-definition-create/endpoint-source-existing-lrg.png":::

   To define a new source endpoint from which to migrate your data, select the **Create a new endpoint** option. Next, provide values for the required **Host name or IP**, **Share name**, and **Protocol version** fields. You may also add an optional description value of less than 1024 characters.

   :::image type="content" source="media/job-definition-create/endpoint-source-new-sml.png" alt-text="Screen capture of the Source tab illustrating the location of the New Source Endpoint fields." lightbox="media/job-definition-create/endpoint-source-new-lrg.png":::

   Only certain types of endpoints may be used as a source or a target, respectively. The steps to create different endpoint types are similar, as are their corresponding data fields. The key differentiator between the creation of NFS- and SMB-enabled endpoints is the use of Azure Key Vault to store the shared credential for SMB resources. When you create an endpoint resource that supports the SMB protocol, you're required to provide values for the Key Vault name, and the names of the username and password secrets as well.

   Select the name of the Key Vault from the **Key Vault** drop-down lists. You can provide values for the **Secret for username** and **Secret for password** by selecting the relevant secret from the corresponding drop-down list. Alternatively, you can provide the URI to the secret as shown in the following screen capture.

   For more details on endpoint resources, see the [Managing Storage Mover endpoints](endpoint-manage.md) article.

   :::image type="content" source="media/job-definition-create/endpoint-smb-new-sml.png" alt-text="Screen capture of the fields required to create a new SMB source endpoint resource." lightbox="media/job-definition-create/endpoint-smb-new-lrg.png":::

   <a name="sub-path"></a>
   By default, migration jobs start from the root of your share. However, if your use case involves copying data from a specific path within your source share, you can provide the path in the **Sub-path** field. Supplying this value starts the data migration from the location you've specified. If the sub path you've specified isn't found, no data is copied.

   Prior to creating an endpoint and a job resource, it's important to verify that the path you've provided is correct and that the data is accessible. You're unable to modify endpoints or job resources after they're created. If the specified path is wrong, your only option is to delete the resources and re-create them.

   Values for host, share name, and subpath are concatenated to form the full migration source path. The path is displayed in the **Full path** field within the **Verify full path** section. Copy the path provided and verify that you're able to access it before committing your changes.

   After you've confirmed that the share is accessible, select **Next** to save your source endpoint settings and begin defining your target.

1. In the **Target** tab, select an option for the **Target endpoint** field.

   As with the source endpoint, choose the **Select an existing endpoint reference** option if you want to use a previously defined endpoint. Next, select the **Select an existing endpoint as a target** link to open the target endpoint pane. A detailed list of your previously defined endpoints is displayed. From the endpoint list, select the desired endpoint, then **Select** to populate the **Existing source endpoint** field and return to the **Source** tab.

   :::image type="content" source="media/job-definition-create/endpoint-target-existing-sml.png" alt-text="Screen capture of the Target tab illustrating the location of the Existing Target Endpoint field." border="false" lightbox="media/job-definition-create/endpoint-target-existing-lrg.png":::

   Similarly, to define a new target endpoint, choose the **Create a new endpoint** option. Next, select values from the drop-down lists for the required **Subscription** and **Storage account** fields. You may also add an optional description value of less than 1024 characters. Depending on your use case, select the appropriate ***Target type**.

   Recall that certain types of endpoints may be used as a source or a target, respectively.

   [!INCLUDE [protocol-endpoint-agent](includes/protocol-endpoint-agent.md)]

   > [!IMPORTANT]
   > Support for the SMB protocol is currently in public preview and some functionality may not yet be available. Currently, the only supported migration path consists of an SMB mount source to an Azure file share destination.

   :::image type="content" source="media/job-definition-create/endpoint-target-new-sml.png" alt-text="Screen capture of the Target tab illustrating the location of the New Target Endpoint fields." lightbox="media/job-definition-create/endpoint-target-new-lrg.png":::

   A target subpath value can be used to specify a location within the target container where your migrated data to be copied. The subpath value is relative to the container's root. You can provide a unique value to generate a new subfolder. If you omit the subpath value, data is copied to the root.

   After ensuring the accuracy of your settings, select **Next** to continue.

1. Within the **Settings** tab, take note of the settings associated with the **Copy mode** and **Migration outcomes**. The service's **copy mode** affects the behavior of the migration engine when files or folders change between copy iterations.

   <a name="copy-modes"></a>
   **Merge source into target:**

   - Files are in the target, even if they don’t exist in the source.
   - Files with matching names and paths are updated to match the source.
   - File or folder renames between copies create duplicate content in the target.

   **Mirror source to target:**

   - Files in the target are deleted if they don’t exist in the source.
   - Files and folders in the target are updated to match the source.
   - File or folder renames between copies don't generate duplicate content. A renamed item on the source side leads to the deletion of the item with the original name in the target. Additionally, the renamed item is also uploaded to the target. If the renamed item is a folder, the described behavior of delete and reupload applies to all files and folders contained in it. Avoid renaming folders during a migration, especially near the root level of your source data.

   **Migration outcomes** are based upon the specific storage types of the source and target endpoints. For example, because blob storage only supports "virtual" folders, source files in folders have their paths prepended to their names and placed in a flat list within a blob container. Empty folders are represented as an empty blob in the target. Source folder metadata is persisted in the custom metadata field of a blob, as they are with files.

   After viewing the effects of the copy mode and migration outcomes, select **Next** to review the values from the previous tabs.

1. Review the settings for job name and description, and source and target storage endpoint settings. Use the **Previous** and **Next** options to navigate through the tabs and correct any mistakes, if needed. Finally, select **Create** to provision the job definition.

   :::image type="content" source="media/job-definition-create/review-sml.png" alt-text="Screen capture of the Review tab illustrating the location of the fields and settings." lightbox="media/job-definition-create/review-lrg.png":::

### [PowerShell](#tab/powershell)

You need to use several cmdlets to create a new job definition. As previously mentioned, source and target endpoints must be created before they're referenced by a job definition.

Use the `New-AzStorageMoverJobDefinition` cmdlet to create new job definition resource in a project. The following examples assume that you aren't reusing *storage endpoints* you've previously created.

```powershell
      
##  Set variables
$subscriptionID     = "Your subscription ID"
$resourceGroupName  = "Your resource group name"
$storageMoverName   = "Your storage mover name"

##  Log into Azure with your Azure credentials
Connect-AzAccount -SubscriptionId $subscriptionID

##  Define the source endpoint: an NFS share in this example
##  There is a separate cmdlet for creating each type of endpoint.
##  (Each storage location type has different properties.)
##  Run "Get-Command -Module Az.StorageMover" to see a full list.
$sourceEpName        = "Your source endpoint name could be the name of the share"
$sourceEpDescription = "Optional, up to 1024 characters"
$sourceEpHost        = "The IP address or DNS name of the source share NAS or server"
$sourceEpExport      = "The name of your source share"
##  Note that Host and Export will be concatenated to [Host]:/[Export] to form the full path 
##  to the source NFS share

New-AzStorageMoverNfsEndpoint `
    -ResourceGroupName $resourceGroupName `
    -StorageMoverName $storageMoverName `
    -Name $sourceEpName `
    -Host $sourceEpHost `
    -Export $sourceEpExport `
    -Description $sourceEpDescription # Description optional

##  Define the target endpoint: an Azure blob container in this example
$targetEpName          = "Target endpoint or blob container name"
$targetEpDescription   = "Optional, up to 1024 characters"
$targetEpContainer     = "The name of the target container in Azure"
$targetEpSaResourceId  = /subscriptions/<GUID>/resourceGroups/<name>/providers/`
                         Microsoft.Storage/storageAccounts/<storageAccountName>
##  Note: the target storage account can be in a different subscription and region than
##  the storage mover resource.
##
##  Only the storage account resource ID contains a fully qualified reference.

New-AzStorageMoverAzStorageContainerEndpoint `
    -ResourceGroupName $resourceGroupName `
    -StorageMoverName $storageMoverName `
    -Name $targetEpName `
    -BlobContainerName $targetEpContainer `
    -StorageAccountResourceId $targetEpSaResourceId `
    -Description $targetEpDescription # Description optional

## Create a job definition resource
$projectName        = "Your project name"
$jobDefName         = "Your job definition name"
$JobDefDescription  = "Optional, up to 1024 characters"
$jobDefCopyMode     = "Additive" # Merges source into target. See description in portal tab.
#$jobDefCopyMode    = "Mirror" # Mirrors source into target. See description in portal tab.
$agentName          = "The name of an agent previously registered to the same storage mover resource"


New-AzStorageMoverJobDefinition `
    -Name $jobDefName `
    -ProjectName $projectName `
    -ResourceGroupName $resourceGroupName `
    -StorageMoverName $storageMoverName `
    -CopyMode $jobDefCopyMode `
    -SourceName $sourceEpName `
    -TargetName $targetEpName `
    -AgentName $agentName `
    -Description $sourceEpDescription # Description optional

```

---

## Next steps

Now that you've created a job definition with source and target endpoints, learn how to estimate the time required to perform your migration job.
> [!div class="nextstepaction"]
> [Azure Storage Mover scale and performance targets](performance-targets.md)
