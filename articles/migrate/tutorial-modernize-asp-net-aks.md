---
title: Modernize ASP.NET web apps to Azure Kubernetes Service
description: At-scale migration of ASP.NET web apps to Azure Kubernetes Service using Azure Migrate
author: anraghun
ms.author: anraghun
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 02/28/2023
ms.custom: template-tutorial
---

# Modernize ASP.NET web apps to Azure Kubernetes Service (preview)

This article shows you how to migrate ASP.NET web apps at-scale to [Azure Kubernetes Service](../aks/intro-kubernetes.md) using Azure Migrate. Currently, this flow only supports ASP.NET web apps running on VMware. For other environments, follow [these steps](./tutorial-app-containerization-aspnet-kubernetes.md).

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible and don't show all possible settings and paths.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Choose and prepare ASP.NET web apps at-scale for migration to [Azure Kubernetes Service](../aks/intro-kubernetes.md) using the integrated flow in Azure Migrate.
> * Configure target settings such as the number of application instances to run and replicate your applications.
> * Run test migrations to ensure your applications spin up correctly.
> * Run a full migration of your applications to AKS.

## Prerequisites

Before you begin this tutorial, you should address the following:

 - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.
 - [Complete the first tutorial](./tutorial-discover-vmware.md) to discover web apps running in your VMware environment.
 - Go to the existing project or [create a new project](./create-manage-projects.md).

### Limitations

 - You can migrate ASP.NET applications using Microsoft .NET framework 3.5 or later.
 - You can migrate application servers running Windows Server 2008 R2 or later (application servers should be running PowerShell version 5.1).
 - Applications should be running on Internet Information Services (IIS) 7.5 or later.

## Enable replication

Once the web apps are assessed, you can migrate them using the integrated migration flow in Azure Migrate. The first step in this process is to configure and begin replication of your web apps.

### Specify intent

1. Navigate to your Azure Migrate project > **Servers, databases and web apps** > **Migration tools** > **Migration and modernization**, select **Replicate**.

    :::image type="content" source="./media/tutorial-modernize-asp-net-aks/select-replicate.png" alt-text="Screenshot of the Replicate option selected.":::

2. In the **Specify intent** tab, > **What do you want to migrate?**, select **ASP.NET web apps** from the drop-down.
3. In **Where do you want to migrate to?**, select **Azure Kubernetes Service (AKS)**.
4. In **Virtualization type**, select **VMware vSphere**.
5. In **On-premises appliance**, choose the appliance which discovered your desired web apps on vSphere.
6. Select **Continue**.

    :::image type="content" source="./media/tutorial-modernize-asp-net-aks/specify-intent.png" alt-text="Screenshot of the specify intent tab.":::

### Choose from discovered apps

In **Replicate** > **Web apps**, a paged list of discovered ASP.NET apps discovered on your environment is shown.

:::image type="content" source="./media/tutorial-modernize-asp-net-aks/replicate-web-apps-list.png" alt-text="Screenshot of the Web apps tab on the Replicate tab.":::

1. Choose one or more applications that should be replicated.
2. The **Modernization status** column indicates the readiness of the application to run on AKS. This can take one of the following values - *Ready*, *Error(s)*, *Replication in Progress*.
3. Select the application and select the **App configuration(s)** link to open the Application configurations tab. This provides the list of attributes detected from the discovered config files. Enter the required attribute values and select **Save**. These configurations will either be stored directly on the target cluster as secrets or can be mounted using Azure Key Vault. This can be configured in the advanced settings.

    :::image type="content" source="./media/tutorial-modernize-asp-net-aks/replicate-web-apps-app-config.png" alt-text="Screenshot of the Application configurations tab.":::

4. Select the application and select the **App directories** link to open the Application directories tab. Provide the path to folders/files that need to be copied for the application to run and select **Save**. Based on the option selected from the drop-down, these artifacts are either be copied directly into the container image or mounted as a persistent volume on the cluster via Azure file share. If persistent volume is chosen, the target can be configured in the advanced settings.

    :::image type="content" source="./media/tutorial-modernize-asp-net-aks/replicate-web-apps-app-dir.png" alt-text="Screenshot of the Application directories tab.":::

5. Select **Next**.

### Configure target settings

In **Replicate** > **Target settings**, settings are provided to configure the target where the applications will be migrated to.

:::image type="content" source="./media/tutorial-modernize-asp-net-aks/replicate-target-settings.png" alt-text="Screenshot of the Target settings tab on the Replicate tab.":::

1. Choose the subscription, resource group, and container registry resource to which the app container images should be pushed to.
2. Choose the subscription, resource group, and AKS cluster resource on which the app should be deployed.
3. Select **Next**.

> [!NOTE]
> Only AKS clusters with windows nodes are listed.

### Configure deployment settings

In **Replicate** > **Deployment settings**, settings are provided to configure the application on the AKS cluster.

:::image type="content" source="./media/tutorial-modernize-asp-net-aks/replicate-deployment-settings.png" alt-text="Screenshot of the Deployment settings tab on the Replicate tab.":::

1. Default values are provided based on the app discovery.
2. In the **Replica** option, choose the number of app instances for each app.
3. In the **Load balancer** option, choose **External** if the app needs to be accessed over the Internet. If **Internal** is chosen, the app can only be accessed within the virtual network of the AKS cluster.
4. Select **Next**.

### Configure advanced settings

If one or more apps had app configurations or directories updated in **Replicate** > **Web apps**, then **Replicate** > **Advanced** is used to provide additional required configurations.

:::image type="content" source="./media/tutorial-modernize-asp-net-aks/replicate-advanced-settings.png" alt-text="Screenshot of the Advanced settings tab on the Replicate tab.":::

1. If application configurations were provided, choose to store them either as native Kubernetes secrets or on Azure Key Vault using [secrets store CSI driver](../aks/csi-secrets-store-driver.md). Ensure that the target cluster has the [secrets store driver addon enabled](../aks/csi-secrets-store-driver.md#upgrade-an-existing-aks-cluster-with-azure-key-vault-provider-for-secrets-store-csi-driver-support).
2. If application directories were provided with a persistent storage option, select an Azure file share to store these files.
3. Select **Next**.

### Review and start replication

Review your selections and make any other required changes by navigating to the right tab on the **Replicate** tab. After reviewing, select **Replicate**.

:::image type="content" source="./media/tutorial-modernize-asp-net-aks/replicate-review.png" alt-text="Screenshot of the Review + start replication tab on the Replicate tab.":::

## Prepare for migration

Once you begin replication, Azure Migrate creates a replication job which can be accessed from your project.

### Navigate to the target resource

1. Navigate to your Azure Migrate project > **Servers, databases and web apps** > **Migration tools** > **Migration and modernization**, select **Overview**.

    :::image type="content" source="./media/tutorial-modernize-asp-net-aks/select-overview.png" alt-text="Screenshot of the Overview option selected.":::

2. Select **Azure Migrate: Server Migration** hub > **Modernization (Preview)** > **Jobs**.

    :::image type="content" source="./media/tutorial-modernize-asp-net-aks/migration-hub-jobs.png" alt-text="Screenshot of the Jobs tab in the migration hub.":::

3. Select **Azure Kubernetes Service (AKS)** as the replication target. Azure Migrate will create one replication job for each ASP.NET app replicated. Select the **Create or update the Workload deployment** job of type **Workload Deployment**.

    :::image type="content" source="./media/tutorial-modernize-asp-net-aks/migration-hub-jobs-replication-jobs.png" alt-text="Screenshot of selecting the replication jobs.":::

4. Select the **Target** resource. All the pre-migration steps can be configured here.

    :::image type="content" source="./media/tutorial-modernize-asp-net-aks/migration-hub-jobs-target.png" alt-text="Screenshot of selecting the target resource within the replication job.":::

5. After replication is completed, the **Replication status** will be *Completed* and the overall **Status** will be *Image build pending*.

### Review the container image and Kubernetes manifests

In the **Target settings** tab, links to the Docker file and the Kubernetes manifests will be provided.

:::image type="content" source="./media/tutorial-modernize-asp-net-aks/target-target-settings.png" alt-text="Screenshot of the target settings in the target resource.":::

1. Select the **Docker file** review link to open the editor. Review and make changes as required. Select **Save**.

    :::image type="content" source="./media/tutorial-modernize-asp-net-aks/target-target-settings-dockerfile.png" alt-text="Screenshot of the docker file editor in the target settings.":::

2. Select the **Deployment specs** review link to open the editor. This contains the Kubernetes manifest file containing all the resources that will be deployed including `StatefulSet`, `Service`, `ServiceAccount` etc. Review and make changes as required. Select **Save**.

    :::image type="content" source="./media/tutorial-modernize-asp-net-aks/target-target-settings-k8s.png" alt-text="Screenshot of the Kubernetes manifest file editor in the target settings.":::

3. In the **Overview** tab, select **Build container image** to build and push the container image to the provided container registry.
4. After the image is built, the overall **Status** will change to *Ready to Migrate*.

    :::image type="content" source="./media/tutorial-modernize-asp-net-aks/target-ready-to-migrate.png" alt-text="Screenshot of the Target resource post building container image.":::

### Run a test migration

With the container image ready, run a test migration to ensure your application spins up correctly on AKS.

1. In the **Overview** tab, select **Test migration**, then select **Yes** to confirm.
2. Once the test migration completes, verify that the workloads are running on the AKS cluster. If the external load balancer option was chosen during the replication process, your application should be exposed to the Internet via a service of type `loadbalancer` with an assigned public IP address.
3. After verifying that the application is working, clean up the test migration by selecting **Clean up test migration**.

If the test migration fails:

1. Navigate to **Azure Migrate: Server Migration** hub > **Modernization (Preview)** > **Jobs**.
2. Select the **Initiate test migrate** job that failed.

    :::image type="content" source="./media/tutorial-modernize-asp-net-aks/migration-hub-jobs-failed-test-migrate.png" alt-text="Screenshot of the failed test migrate job.":::

3. Select the failed task link to see possible failure causes and recommendations.

    :::image type="content" source="./media/tutorial-modernize-asp-net-aks/test-migrate-failed-task.png" alt-text="Screenshot of the failed test migrate task.":::

## Migrate your applications to AKS

The application is finally ready for migration:

1. In the **Overview** tab, select **Migrate**, then select **Yes** to confirm.

    :::image type="content" source="./media/tutorial-modernize-asp-net-aks/target-migrate.png" alt-text="Screenshot of the target resource ready for migration.":::

2. Similar to the test migration workflow, verify that the workloads are running on the AKS cluster.
3. The application has now successfully been migrated. If you wish for the appliance to discover it again and make it available for migration, select **Complete migration**.

## Next steps

After successfully migrating your applications to AKS, you may explore the following articles to optimize your apps for cloud:

- Set up CI/CD with [Azure Pipelines](../aks/devops-pipeline.md), [GitHub Actions](../aks/kubernetes-action.md) or [through GitOps](../azure-arc/kubernetes/tutorial-gitops-flux2-ci-cd.md).
- Use Azure Monitor to [monitor health and performance of AKS and your apps](../aks/monitor-aks.md).
- Harden the security posture of your AKS cluster and containers with [Microsoft Defender for Containers](../defender-for-cloud/defender-for-containers-enable.md).
- Optimize [Windows Dockerfiles](/virtualization/windowscontainers/manage-docker/optimize-windows-dockerfile?context=/azure/aks/context/aks-context).
- [Review and implement best practices](../aks/best-practices.md) to build and manage apps on AKS.

