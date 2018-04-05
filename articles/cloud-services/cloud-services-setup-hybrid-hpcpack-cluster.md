---
title: Set up a hybrid HPC Pack cluster in Azure | Microsoft Docs
description: Learn how to use Microsoft HPC Pack and Azure to set up a small, hybrid high performance computing (HPC) cluster
services: cloud-services
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: hpc-pack

ms.assetid: 
ms.service: cloud-services
ms.workload: big-compute
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/22/2017
ms.author: danlep

---
# Set up a hybrid high performance computing (HPC) cluster with Microsoft HPC Pack and on-demand Azure compute nodes
Use Microsoft HPC Pack 2012 R2 and Azure to set up a small, hybrid high performance computing (HPC) cluster. The cluster shown in this article consists of an on-premises HPC Pack head node and some compute nodes you deploy on-demand in an Azure cloud service. You can then run compute jobs on the hybrid cluster.

![Hybrid HPC cluster][Overview] 

This tutorial shows one approach, sometimes called cluster "burst to the cloud," to use scalable, on-demand Azure resources to run compute-intensive applications.

This tutorial assumes no prior experience with compute clusters or HPC Pack. It is intended only to help you deploy a hybrid compute cluster quickly for demonstration purposes. For considerations and steps to deploy a hybrid HPC Pack cluster at greater scale in a production environment, or to use HPC Pack 2016, see the [detailed guidance](http://go.microsoft.com/fwlink/p/?LinkID=200493). For other scenarios with HPC Pack, including automated cluster deployment in Azure virtual machines, see [HPC cluster options with Microsoft HPC Pack in Azure](../virtual-machines/windows/hpcpack-cluster-options.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## Prerequisites
* **Azure subscription** - If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free/) in just a couple of minutes.
* **An on-premises computer running Windows Server 2012 R2 or Windows Server 2012** - Use this computer as the head node of the HPC cluster. If you aren't already running Windows Server, you can download and install an [evaluation version](https://www.microsoft.com/evalcenter/evaluate-windows-server-2012-r2).
  
  * The computer must be joined to an Active Directory domain. For test purposes, you can configure the head node computer as a domain controller. To add the Active Directory Domain Services server role and promote the head node computer as a domain controller, see the documentation for Windows Server.
  * To support HPC Pack, the operating system must be installed in one of these languages: English, Japanese, or Chinese (Simplified).
  * Verify that important and critical updates are installed.
* **HPC Pack 2012 R2** - [Download](http://go.microsoft.com/fwlink/p/?linkid=328024) the installation package for the latest version free of charge and copy the files to the head node computer. Choose installation files in the same language as your installation of Windows Server.

    >[!NOTE]
    > If you want to use HPC Pack 2016 instead of HPC Pack 2012 R2, additional configuration is needed. See the [detailed guidance](http://go.microsoft.com/fwlink/p/?LinkID=200493).
    > 
* **Domain account** - This account must be configured with local Administrator permissions on the head node to install HPC Pack.
* **TCP connectivity on port 443** from the head node to Azure.

## Install HPC Pack on the head node
You first install Microsoft HPC Pack on your on-premises computer running Windows Server. This computer becomes the head node of the cluster.

1. Log on to the head node by using a domain account that has local Administrator permissions.

2. Start the HPC Pack Installation Wizard by running Setup.exe from the HPC Pack installation files.

3. On the **HPC Pack 2012 R2 Setup** screen, click **New installation or add new features to an existing installation**.

    ![HPC Pack 2012 Setup][install_hpc1]

4. On the **Microsoft Software User Agreement page**, click **Next**.

5. On the **Select Installation Type** page, click **Create a new HPC cluster by creating a head node**, and then click **Next**.

6. The wizard runs several pre-installation tests. Click **Next** on the **Installation Rules** page if all tests pass. Otherwise, review the information provided and make any necessary changes in your environment. Then run the tests again or if necessary start the Installation Wizard again.
7. On the **HPC DB Configuration** page, make sure **Head Node** is selected for all HPC databases, and then click **Next**. 

    ![DB Configuration][install_hpc4]

8. Accept default selections on the remaining pages of the wizard. On the **Install Required Components** page, click **Install**.
   
    ![Install][install_hpc6]

9. After the installation completes, uncheck **Start HPC Cluster Manager** and then click **Finish**. (You start HPC Cluster Manager in a later step.)
   
    ![Finish][install_hpc7]

## Prepare the Azure subscription
Perform the following steps in the [Azure portal](https://portal.azure.com) with your Azure subscription. After completing these steps, you can deploy Azure nodes from the on-premises head node. 
  
  > [!NOTE]
  > Also make a note of your Azure subscription ID, which you need later. Find the ID in **Subscriptions** in the portal.
  > 

### Upload the default management certificate
HPC Pack installs a self-signed certificate on the head node, called the Default Microsoft HPC Azure Management certificate, that you can upload as an Azure management certificate. This certificate is provided for testing and proof-of-concept deployments to secure the connection between the head node and Azure.

1. From the head node computer, sign in to the [Azure portal](https://portal.azure.com).

2. Click **Subscriptions** > *your_subscription_name*.

3. Click **Management certificates** > **Upload**.

4. Browse on the head node for the file C:\Program Files\Microsoft HPC Pack 2012\Bin\hpccert.cer. Then, click **Upload**.

   
The **Default HPC Azure Management** certificate appears in the list of management certificates.

### Create an Azure cloud service
> [!NOTE]
> For best performance, create the cloud service and the storage account (in a later step) in the same geographic region.
> 
> 

1. In the portal, click **Cloud services (classic)** > **+Add**.

2.  Type a DNS name for the service, choose a resource group and a location, and then click **Create**.


### Create an Azure storage account
1. In the portal, click **Storage accounts (classic)** > **+Add**.

2. Type a name for the account, and select the **Classic** deployment model.

3. Choose a resource group and a location, and leave other settings at default values. Then click **Create**.

## Configure the head node
To use HPC Cluster Manager to deploy Azure nodes and to submit jobs, first perform some required cluster configuration steps.

1. On the head node, start HPC Cluster Manager. If the **Select Head Node** dialog box appears, click **Local Computer**. The **Deployment To-do List** appears.

2. Under **Required deployment tasks**, click **Configure your network**.
   
    ![Configure Network][config_hpc2]

3. In the Network Configuration Wizard, select **All nodes only on an enterprise network** (Topology 5). This network configuration is the simplest for demonstration purposes.
   
    ![Topology 5][config_hpc3]
   
4. Click **Next** to accept default values on the remaining pages of the wizard. Then, on the **Review** tab, click **Configure** to complete the network configuration.

5. In the **Deployment To-do List**, click **Provide installation credentials**.

6. In the **Installation Credentials** dialog box, type the credentials of the domain account that you used to install HPC Pack. Then click **OK**. 
   
    ![Installation Credentials][config_hpc6]
   
7. In the **Deployment To-do List**, click **Configure the naming of new nodes**.

8. In the **Specify Node Naming Series** dialog box, accept the default naming series and click **OK**. Complete this step even though the Azure nodes you add in this tutorial are named automatically.
   
    ![Node Naming][config_hpc8]
   
9. In the **Deployment To-do List**, click **Create a node template**. Later in the tutorial, you use the node template to add Azure nodes to the cluster.

10. In the Create Node Template Wizard, do the following:
    
    a. On the **Choose Node Template Type** page, click **Windows Azure node template**, and then click **Next**.
    
    ![Node Template][config_hpc10]
    
    b. Click **Next** to accept the default template name.
    
    c. On the **Provide Subscription Information** page, enter your Azure subscription ID (available in your Azure account information). Then, in **Management certificate**, browse for **Default Microsoft HPC Azure Management.** Then click **Next**.
    
    ![Node Template][config_hpc12]
    
    d. On the **Provide Service Information** page, select the cloud service and the storage account that you created in a previous step. Then click **Next**.
    
    ![Node Template][config_hpc13]
    
    e. Click **Next** to accept default values on the remaining pages of the wizard. Then, on the **Review** tab, click **Create** to create the node template.
    
    > [!NOTE]
    > By default, the Azure node template includes settings for you to start (provision) and stop the nodes manually, using HPC Cluster Manager. You can optionally configure a schedule to start and stop the Azure nodes automatically.
    > 
    > 

## Add Azure nodes to the cluster
Now use the node template to add Azure nodes to the cluster. Adding the nodes to the cluster stores their configuration information so that you can start (provision) them at any time in the cloud service. Your subscription only gets charged for Azure nodes after the instances are running in the cloud service.

Follow these steps to add two Small nodes.

1. In HPC Cluster Manager, click **Node Management** (called **Resource Management** in current versions of HPC Pack) > **Add Node**.
   
    ![Add Node][add_node1]

2. In the Add Node Wizard, on the **Select Deployment Method** page, click **Add Windows Azure nodes**, and then click **Next**.
   
    ![Add Azure Node][add_node1_1]

3. On the **Specify New Nodes** page, select the Azure node template you created previously (called by default **Default AzureNode Template**). Then specify **2** nodes of size **Small**, and then click **Next**.
   
    ![Specify Nodes][add_node2]
   
4. On the **Completing the Add Node Wizard** page, click **Finish**.
    
     Two Azure nodes, named **AzureCN-0001** and **AzureCN-0002**, now appear in HPC Cluster Manager. Both are in the **Not-Deployed** state.
   
    ![Added Nodes][add_node3]

## Start the Azure nodes
When you want to use the cluster resources in Azure, use HPC Cluster Manager to start (provision) the Azure nodes and bring them online.

1. In HPC Cluster Manager, click **Node Management** (called **Resource Management** in current versions of HPC Pack), and select the Azure nodes.

2. Click **Start**, and then click **OK**.
   
   ![Start Nodes][add_node4]
   
    The nodes transition to the **Provisioning** state. View the provisioning log to track the provisioning progress.
   
    ![Provision Nodes][add_node6]

3. After a few minutes, the Azure nodes finish provisioning and are in the **Offline** state. In this state, the role instances are running but cannot yet accept cluster jobs.

4. To confirm that the role instances are running, in the Azure portal, click **Cloud Services (classic)** > *your_cloud_service_name*.
   
   You should see two **HpcWorkerRole** instances (nodes) running in the service. HPC Pack also automatically deploys two **HpcProxy** instances (size Medium) to handle communication between the head node and Azure.

   ![Running Instances][view_instances1]

5. To bring the Azure nodes online to run cluster jobs, select the nodes, right-click, and then click **Bring Online**.
   
    ![Offline Nodes][add_node7]
   
    HPC Cluster Manager indicates that the nodes are in the **Online** state.

## Run a command across the cluster
To check the installation, use the HPC Pack **clusrun** command to run a command or application on one or more cluster nodes. As a simple example, use **clusrun** to get the IP configuration of the Azure nodes.

1. On the head node, open a command prompt as an administrator.

2. Type the following command:
   
    `clusrun /nodes:azurecn* ipconfig`

3. If prompted, enter your cluster administrator password. You should see command output similar to the following.
   
    ![Clusrun][clusrun1]

## Run a test job
Now submit a test job that runs on the hybrid cluster. This example is a simple parametric sweep job (a type of intrinsically parallel computation). This example runs subtasks that add an integer to itself by using the **set /a** command. All the nodes in the cluster contribute to finishing the subtasks for integers from 1 to 100.

1. In HPC Cluster Manager, click **Job Management** > **New Parametric Sweep Job**.
   
    ![New Job][test_job1]

2. In the **New Parametric Sweep Job** dialog box, in **Command line**, type `set /a *+*` (overwriting the default command line that appears). Leave default values for the remaining settings, and then click **Submit** to submit the job.
   
    ![Parametric Sweep][param_sweep1]

3. When the job is finished, double-click the **My Sweep Task** job.

4. Click **View Tasks**, and then click a subtask to view the calculated output of that subtask.
   
    ![Task Results][view_job361]

5. To see which node performed the calculation for that subtask, click **Allocated Nodes**. (Your cluster might show a different node name.)
   
    ![Task Results][view_job362]

## Stop the Azure nodes
After you try out the cluster, stop the Azure nodes to avoid unnecessary charges to your account. This step stops the cloud service and removes the Azure role instances.

1. In HPC Cluster Manager, in **Node Management** (called **Resource Management** in previous versions of HPC Pack), select both Azure nodes. Then, click **Stop**.
   
    ![Stop Nodes][stop_node1]

2. In the **Stop Windows Azure nodes** dialog box, click **Stop**. 
   
3. The nodes transition to the **Stopping** state. After a few minutes, HPC Cluster Manager shows that the nodes are **Not-Deployed**.
   
    ![Not Deployed Nodes][stop_node4]

4. To confirm that the role instances are no longer running in Azure, in the Azure portal, click **Cloud services (classic)** > *your_cloud_service_name*. No instances are deployed in the production environment. 
   
    This completes the tutorial.

## Next steps
* Explore the documentation for [HPC Pack](https://technet.microsoft.com/library/cc514029).
* To set up a hybrid HPC Pack cluster deployment at greater scale, see [Burst to Azure Worker Role Instances with Microsoft HPC Pack](http://go.microsoft.com/fwlink/p/?LinkID=200493).
* For other ways to create an HPC Pack cluster in Azure, including using Azure Resource Manager templates, see [HPC cluster options with Microsoft HPC Pack in Azure](../virtual-machines/windows/hpcpack-cluster-options.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).


[Overview]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/hybrid_cluster_overview.png
[install_hpc1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/install_hpc1.png
[install_hpc4]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/install_hpc4.png
[install_hpc6]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/install_hpc6.png
[install_hpc7]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/install_hpc7.png
[install_hpc10]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/install_hpc10.png
[config_hpc2]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/config_hpc2.png
[config_hpc3]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/config_hpc3.png
[config_hpc6]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/config_hpc6.png
[config_hpc8]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/config_hpc8.png
[config_hpc10]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/config_hpc10.png
[config_hpc12]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/config_hpc12.png
[config_hpc13]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/config_hpc13.png
[add_node1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/add_node1.png
[add_node1_1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/add_node1_1.png
[add_node2]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/add_node2.png
[add_node3]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/add_node3.png
[add_node4]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/add_node4.png
[add_node6]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/add_node6.png
[add_node7]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/add_node7.png
[view_instances1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/view_instances1.png
[clusrun1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/clusrun1.png
[test_job1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/test_job1.png
[param_sweep1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/param_sweep1.png
[view_job361]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/view_job361.png
[view_job362]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/view_job362.png
[stop_node1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/stop_node1.png
[stop_node4]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/stop_node4.png
[view_instances2]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/view_instances2.png
