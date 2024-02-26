---
title: How to use Azure Pipelines with Apache Flink® on HDInsight on AKS
description: Learn how to use Azure Pipelines with Apache Flink®
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 10/27/2023
---

# How to use Azure Pipelines with Apache Flink® on HDInsight on AKS

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

In this article, you'll learn how to use Azure Pipelines with HDInsight on AKS to submit Flink jobs with the cluster's REST API. We guide you through the process using a sample YAML pipeline and a PowerShell script, both of which streamline the automation of the REST API interactions.


## Prerequisites

- Azure subscription. If you do not have an Azure subscription, create a free account.

- A GitHub account where you can create a repository. [Create one for free](https://azure.microsoft.com/free).

- Create `.pipeline` directory, copy [flink-azure-pipelines.yml](https://hdiconfigactions.blob.core.windows.net/hiloflinkblob/flink-azure-pipelines.yml) and [flink-job-azure-pipeline.ps1](https://hdiconfigactions.blob.core.windows.net/hiloflinkblob/flink-job-azure-pipeline.ps1)

- Azure DevOps organization. Create one for free. If your team already has one, then make sure you are an administrator of the Azure DevOps project that you want to use.

- Ability to run pipelines on Microsoft-hosted agents. To use Microsoft-hosted agents, your Azure DevOps organization must have access to Microsoft-hosted parallel jobs. You can either purchase a parallel job or you can request a free grant.

- A Flink Cluster. If you don’t have one, [Create a Flink Cluster in HDInsight on AKS](flink-create-cluster-portal.md).

- Create one directory in cluster storage account to copy job jar. This directory later you need to configure in pipeline YAML for job jar location (<JOB_JAR_STORAGE_PATH>).

## Steps to set up pipeline

### Create a service principal for Azure Pipelines

  Create [Microsoft Entra service principal](/cli/azure/ad/sp/) to access Azure – Grant permission to access HDInsight on AKS Cluster with Contributor role, make a note of appId, password, and tenant from the response.
  ```
  az ad sp create-for-rbac -n <service_principal_name> --role Contributor --scopes <Flink Cluster Resource ID>`
  ```
  
  Example:

  ```
  az ad sp create-for-rbac -n azure-flink-pipeline --role Contributor --scopes /subscriptions/abdc-1234-abcd-1234-abcd-1234/resourceGroups/myResourceGroupName/providers/Microsoft.HDInsight/clusterpools/hiloclusterpool/clusters/flinkcluster`
  ```

### Reference

- [Apache Flink Website](https://flink.apache.org/)

> [!NOTE]
> Apache, Apache Flink, Flink, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).


### Create a key vault

  1.   Create Azure Key Vault, you can follow [this tutorial](/azure/key-vault/general/quick-create-portal) to create a new Azure Key Vault.

  1. Create three Secrets

      -   *cluster-storage-key* for storage key.

      -   *service-principal-key* for principal clientId or appId.

      -   *service-principal-secret* for principal secret.

      :::image type="content" source="./media/use-azure-pipelines-to-run-flink-jobs/create-key-vault.png" alt-text="Screenshot showing how to create key vault." lightbox="./media/use-azure-pipelines-to-run-flink-jobs/create-key-vault.png":::

  1. Grant permission to access Azure Key Vault with the “Key Vault Secrets Officer” role to service principal.


### Setup pipeline

  1. Navigate to your Project and click Project Settings.

  1. Scroll down and select Service Connections, and then New Service Connection.

  1. Select Azure Resource Manager.

      :::image type="content" source="./media/use-azure-pipelines-to-run-flink-jobs/select-new-service-connection.png" alt-text="Screenshot showing how to select a new service connection." lightbox="./media/use-azure-pipelines-to-run-flink-jobs/select-new-service-connection.png":::

  1. In the authentication method, select Service Principal (manual).

      :::image type="content" source="./media/use-azure-pipelines-to-run-flink-jobs/new-service-connection.png" alt-text="Screenshot shows new service connection." lightbox="./media/use-azure-pipelines-to-run-flink-jobs/new-service-connection.png":::

  1. Edit the service connection properties. Select the service principal you recently created.

      :::image type="content" source="./media/use-azure-pipelines-to-run-flink-jobs/edit-service-connection.png" alt-text="Screenshot showing how to edit service connection." lightbox="./media/use-azure-pipelines-to-run-flink-jobs/edit-service-connection.png":::

  1. Click Verify to check whether the connection was set up correctly. If you encounter the following error:

      :::image type="content" source="./media/use-azure-pipelines-to-run-flink-jobs/service-connection-error-message.png" alt-text="Screenshot showing service connection error message." lightbox="./media/use-azure-pipelines-to-run-flink-jobs/service-connection-error-message.png":::
  
  1. Then you need to assign the Reader role to the subscription.

  1. After that, the verification should be successful.

  1. Save the service connection.

      :::image type="content" source="./media/use-azure-pipelines-to-run-flink-jobs/tenant-id.png" alt-text="Screenshot showing how to view the Tenant-ID." lightbox="./media/use-azure-pipelines-to-run-flink-jobs/tenant-id.png":::

  1. Navigate to pipelines and click on New Pipeline.

      :::image type="content" source="./media/use-azure-pipelines-to-run-flink-jobs/create-new-pipeline.png" alt-text="Screenshot showing how to create a new pipeline." lightbox="./media/use-azure-pipelines-to-run-flink-jobs/create-new-pipeline.png":::

  1. Select GitHub as the location of your code.

  1. Select the repository. See [how to create a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository) in GitHub. select-github-repo image.

      :::image type="content" source="./media/use-azure-pipelines-to-run-flink-jobs/search-your-code.png" alt-text="Screenshot showing how to search your code." lightbox="./media/use-azure-pipelines-to-run-flink-jobs/search-your-code.png":::
  

  1. Select the repository. For more information, [see How to create a repository in GitHub](https://docs.github.com/repositories/creating-and-managing-repositories/creating-a-new-repository).

      :::image type="content" source="./media/use-azure-pipelines-to-run-flink-jobs/select-github-repo.png" alt-text="Screenshot showing how to select a GitHub repository." lightbox="./media/use-azure-pipelines-to-run-flink-jobs/select-github-repo.png":::
   
  1. From configure your pipeline option, you can choose **Existing Azure Pipelines YAML file**. Select branch and pipeline script that you copied earlier. (.pipeline/flink-azure-pipelines.yml)

      :::image type="content" source="./media/use-azure-pipelines-to-run-flink-jobs/configure-pipeline.png" alt-text="Screenshot showing how to configure pipeline.":::

  1. Replace value in variable section.

      :::image type="content" source="./media/use-azure-pipelines-to-run-flink-jobs/replace-value.png" alt-text="Screenshot showing how to replace value.":::

  1. Correct code build section based on your requirement and configure <JOB_JAR_LOCAL_PATH> in variable section for job jar local path.

      :::image type="content" source="./media/use-azure-pipelines-to-run-flink-jobs/code-build-section.png" alt-text="Screenshot shows code build section.":::

  1. Add pipeline variable "action" and configure value "RUN."

      :::image type="content" source="./media/use-azure-pipelines-to-run-flink-jobs/pipeline-variable.png" alt-text="Screenshot shows how to add pipeline variable.":::

      you can change the values of variable before running pipeline. 

      -   NEW: This value is default. It launches new job and if the job is already running then it updates the running job with latest jar.

      -   SAVEPOINT: This value takes the save point for running job.

      -   DELETE: Cancel or delete the running job.

  1. Save and run the pipeline. You can see the running job on portal in Flink Job section.
  
      :::image type="content" source="./media/use-azure-pipelines-to-run-flink-jobs/save-run-pipeline.png" alt-text="Screenshot shows how to save and run pipeline.":::


> [!NOTE]
> This is one sample to submit the job using pipeline. You can follow the Flink REST API doc to write your own code to submit job.
