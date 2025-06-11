---
title: 'Tutorial: Use Azure Automation runbooks to create clusters - Azure HDInsight'
description: Learn how to create and delete Azure HDInsight clusters with scripts that run in the cloud by using Azure Automation runbooks.
ms.service: azure-hdinsight
ms.custom: hdinsightactive
ms.topic: tutorial
author: apurbasroy
ms.author: apsinhar
ms.reviewer: sairamyeturi
ms.date: 12/02/2024
---

# Tutorial: Create Azure HDInsight clusters with Azure Automation

With Azure Automation, you can create scripts that run in the cloud and manage Azure resources on-demand or based on a schedule. This article describes how to create PowerShell runbooks to create and delete Azure HDInsight clusters.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Install modules necessary for interacting with HDInsight.
> * Create and store credentials needed during cluster creation.
> * Create a new Automation runbook to create an HDInsight cluster.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An existing [Automation account](../automation/quickstarts/create-azure-automation-account-portal.md).
* An existing [Azure Storage account](../storage/common/storage-account-create.md) that might be used as cluster storage.

## Install HDInsight modules

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select your Automation accounts.
1. Under **Shared Resources**, select **Modules gallery**.
1. Enter **AzureRM.Profile** in the box, and select Enter to search. Select the available search result.
1. On the **AzureRM.profile** screen, select **Import**. Select the checkbox to update Azure modules, and then select **OK**.

    :::image type="content" source="./media/manage-clusters-runbooks/import-azurermprofile-module.png" alt-text="Screenshot that shows importing the AzureRM.profile module." border="false":::

1. Return to the modules gallery. Under **Shared Resources**, select **Modules gallery**.
1. Enter **HDInsight**, and then select **AzureRM.HDInsight**.

    :::image type="content" source="./media/manage-clusters-runbooks/browse-modules-hdinsight.png" alt-text="Screenshot that shows browsing HDInsight modules." border="true":::

1. On the **AzureRM.HDInsight** pane, select **Import** > **OK**.

    :::image type="content" source="./media/manage-clusters-runbooks/import-azurermhdinsight-module.png" alt-text="Screenshot that shows the import message for the AzureRM.HDInsight module." border="true":::

## Create credentials

1. Under **Shared Resources**, select **Credentials**.
1. Select **Add a credential**.
1. Enter the required information on the **New Credential** pane. This credential is used to store the cluster password. You use it to sign in to Ambari.

    | Property | Value |
    | --- | --- |
    | Name | `cluster-password` |
    | User name | `admin` |
    | Password | `SECURE_PASSWORD` |
    | Confirm password | `SECURE_PASSWORD` |

1. Select **Create**.
1. Repeat the same process for a new credential **ssh-password** with the username **sshuser** and a password of your choice. Select **Create**. This credential is used to store the Secure Shell protocol password for your cluster.

    :::image type="content" source="./media/manage-clusters-runbooks/create-credentials.png" alt-text="Screenshot that shows creating a new credential." border="true":::

## Create a runbook to create a cluster

1. Under **Process Automation**, select **Runbooks**.
1. Select **Create a runbook**.
1. On the **Create a runbook** pane, enter a name for the runbook, such as **hdinsight-cluster-create**. Select **PowerShell** from the **Runbook type** dropdown list.
1. Select **Create**.

    :::image type="content" source="./media/manage-clusters-runbooks/create-runbook.png" alt-text="Screenshot that shows creating a runbook." border="true":::

1. Enter the following code on the **Edit PowerShell Runbook** screen, and then select **Publish**.

    :::image type="content" source="./media/manage-clusters-runbooks/publish-runbook.png" alt-text="Screenshot that shows publishing a runbook." border="true":::

    ```powershell
    Param
    (
      [Parameter (Mandatory= $true)]
      [String] $subscriptionID,
    
      [Parameter (Mandatory= $true)]
      [String] $resourceGroup,
    
      [Parameter (Mandatory= $true)]
      [String] $storageAccount,
    
      [Parameter (Mandatory= $true)]
      [String] $containerName,
    
      [Parameter (Mandatory= $true)]
      [String] $clusterName
    )
    ### Authenticate to Azure 
    $Conn = Get-AutomationConnection -Name 'AzureRunAsConnection'
    Add-AzureRMAccount -ServicePrincipal -Tenant $Conn.TenantID -ApplicationId $Conn.ApplicationID -CertificateThumbprint $Conn.CertificateThumbprint
    
    # Set cluster variables
    $storageAccountKey = (Get-AzureRmStorageAccountKey –Name $storageAccount –ResourceGroupName $resourceGroup)[0].value 
    
    # Setting cluster credentials
    
    #Automation credential for Cluster Admin
    $clusterCreds = Get-AutomationPSCredential –Name 'cluster-password'
    
    #Automation credential for user to SSH into cluster
    $sshCreds = Get-AutomationPSCredential –Name 'ssh-password' 
    
    $clusterType = "Hadoop" #Use any supported cluster type (Hadoop, HBase, etc.)
    $clusterOS = "Linux"
    $clusterWorkerNodes = 3
    $clusterNodeSize = "Standard_D3_v2"
    $location = Get-AzureRmStorageAccount –StorageAccountName $storageAccount –ResourceGroupName $resourceGroup | %{$_.Location}
    
    ### Provision HDInsight cluster
    New-AzureRmHDInsightCluster –ClusterName $clusterName –ResourceGroupName $resourceGroup –Location $location –DefaultStorageAccountName "$storageAccount.blob.core.windows.net" –DefaultStorageAccountKey $storageAccountKey -DefaultStorageContainer $containerName –ClusterType $clusterType –OSType $clusterOS –Version “3.6” –HttpCredential $clusterCreds –SshCredential $sshCreds –ClusterSizeInNodes $clusterWorkerNodes –HeadNodeSize $clusterNodeSize –WorkerNodeSize $clusterNodeSize
    ```

## Create a runbook to delete a cluster

1. Under **Process Automation**, select **Runbooks**.
1. Select **Create a runbook**.
1. On the **Create a runbook** pane, enter a name for the runbook, such as **hdinsight-cluster-delete**. Select **PowerShell** from the **Runbook type** dropdown list.
1. Select **Create**.
1. Enter the following code on the **Edit PowerShell Runbook** screen, and then select **Publish**.

    ```powershell
    Param
    (
      [Parameter (Mandatory= $true)]
      [String] $clusterName
    )
    
    ### Authenticate to Azure 
    $Conn = Get-AutomationConnection -Name 'AzureRunAsConnection'
    Add-AzureRMAccount -ServicePrincipal -Tenant $Conn.TenantID -ApplicationId $Conn.ApplicationID -CertificateThumbprint $Conn.CertificateThumbprint
    
    Remove-AzureRmHDInsightCluster -ClusterName $clusterName
    ```

## Run runbooks

This section explains how to run runbooks.

### Create a cluster

1. View the list of runbooks for your Automation account. Under **Process Automation**, select **Runbooks**.
1. Select **hdinsight-cluster-create** or the name that you used when you created your cluster creation runbook.
1. Select **Start** to run the runbook immediately. You can also schedule runbooks to run periodically. For more information, see [Schedule a runbook in Automation](../automation/shared-resources/schedules.md).
1. Enter the required parameters for the script, and select **OK**. This step creates a new HDInsight cluster with the name that you specified in the **CLUSTERNAME** parameter.

    :::image type="content" source="./media/manage-clusters-runbooks/execute-create-runbook.png" alt-text="Screenshot that shows running a cluster runbook." border="true":::

### Delete a cluster

Delete the cluster by selecting the **hdinsight-cluster-delete** runbook that you created. Select **Start**, enter the **CLUSTERNAME** parameter, and select **OK**.

## Clean up resources

When your resource is no longer needed, delete the Automation account that you created to avoid unintended charges. Go to the Azure portal, select the resource group where you created the Automation account, select the Automation account, and then select **Delete**.

## Next step

> [!div class="nextstepaction"]
> [Manage Apache Hadoop clusters in HDInsight by using Azure PowerShell](hdinsight-administer-use-powershell.md)
