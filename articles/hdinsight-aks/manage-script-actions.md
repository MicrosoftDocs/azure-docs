---
title: Manage script actions on Azure HDInsight on AKS clusters 
description: An introduction on how to manage script actions in Azure HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---
# Script actions during cluster creation

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

Azure HDInsight on AKS provides a mechanism called **Script Actions** that invoke custom scripts to customize the cluster. These scripts are used to install additional components and change configuration settings. Script actions can be provisioned only during cluster creation as of now. Post cluster creation, Script Actions are part of the roadmap.
This article explains how you can provision script actions when you create an HDInsight on AKS cluster.

## Use a script action during cluster creation using Azure portal

1. Upload the script action in a `ADLS/WASB` storage(does not have to be the primary cluster storage). In this example we will consider an `ADLS` storage.
   To upload a script into your storage, navigate into the target storage and the container where you want to upload it.

   :::image type="content" source="./media/manage-script-actions/upload-script-action-1.png" alt-text="Screenshot showing the how to select container." border="true" lightbox="./media/manage-script-actions/upload-script-action-1.png":::

1. To upload a script into your storage, navigate into the target storage and the container. Click on the upload button and select the script from your local drive.
   After the script gets uploaded you should be able to see it in the container(see below image).

   :::image type="content" source="./media/manage-script-actions/upload-script-action-2.png" alt-text="Screenshot showing how to upload the script." border="true" lightbox="./media/manage-script-actions/upload-script-action-2.png":::
   
1. Create a new cluster as described [here](./quickstart-create-cluster.md).
   
1. From the Configuration tab, select **+ Add script action**.
  
   :::image type="content" source="./media/manage-script-actions/manage-script-action-creation-step-1.png" alt-text="Screenshot showing the New cluster page with Add Script action button in the Azure portal." border="true" lightbox="./media/manage-script-actions/manage-script-action-creation-step-1.png":::

   This action opens the Script Action window. Provide the following details:

   :::image type="content" source="./media/manage-script-actions/manage-script-action-add-step-2.png" alt-text="Screenshot showing the Add Script action window opens in the Azure portal.":::
    
    |Property|Description|
    |-|-|
    |Script Action Name| Unique name of the script action.|
    |Bash Script URL| Location where the script is stored. For example - `abfs://<CONTAINER>@<DATALAKESTOREACCOUNTNAME>.dfs.core.windows.net/<file_path>`, update the data lake storage name and file path.|
    |Services| Select the specific service components where the Script Action needs to run.|
    |Parameters| Specify the parameters, if necessary for the script.|
    |`TimeOutInMinutes`|Choose the timeout for each script|
    
    :::image type="content" source="./media/manage-script-actions/manage-script-action-add-node-type-step-3.png" alt-text="Screenshot showing the list of services where to the apply the script actions." border="true" lightbox="./media/manage-script-actions/manage-script-action-add-node-type-step-3.png":::

   > [!NOTE]
   > * All the Script Actions will be persisted.
   > * Script actions are available only for Apache Spark cluster type.
   
1. Select ‘OK’ to save the script.
1. Then you can again use **+ Add Script Action** to add another script if necessary. 
  
   :::image type="content" source="./media/manage-script-actions/manage-script-action-view-scripts-step-4.png" alt-text="Screenshot showing the View scripts section in the integration tab." border="true" lightbox="./media/manage-script-actions/manage-script-action-view-scripts-step-4.png":::
   
1. Complete the remaining cluster creation steps to create a cluster.

   >[!Important]
   >* There's no automatic way to undo the changes made by a script action.
   >* Script actions must finish within **40 minutes**, or they time out causing cluster creation to fail.
   >* During cluster provisioning, the script runs concurrently with other setup and configuration processes.
   >* Competition for resources such as CPU time or network bandwidth might cause the script to take longer to finish.
   >* To minimize the time it takes to run the script, avoid tasks like downloading and compiling applications from the source. Precompile applications and store the binary in Azure Data Lake Store Gen2.

### View the list of Script Actions

1. You can view the list of Script Actions in the "Configuration" tab.

   :::image type="content" source="./media/manage-script-actions/manage-script-action-view-scripts-step-5.png" alt-text="Screenshot showing the Create to save Script actions page." border="true" lightbox="./media/manage-script-actions/manage-script-action-view-scripts-step-5.png":::
  
   
