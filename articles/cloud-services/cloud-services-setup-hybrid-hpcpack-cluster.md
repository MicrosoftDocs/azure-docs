<properties
	pageTitle="Set up a hybrid HPC cluster with Microsoft HPC Pack | Microsoft Azure"
	description="Learn how to use Microsoft HPC Pack and Azure to set up a small, hybrid high performance computing (HPC) cluster"
	services="cloud-services"
	documentationCenter=""
	authors="dlepow"
	manager="timlt"
	editor=""
	tags="azure-service-management,hpc-pack"/>

<tags
	ms.service="cloud-services"
	ms.workload="big-compute"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/14/2016"
	ms.author="danlep"/>


# Set up a hybrid high performance computing (HPC) cluster with Microsoft HPC Pack and on-demand Azure compute nodes

Use Microsoft HPC Pack 2012 R2 and Azure to set up a small, hybrid high performance computing (HPC) cluster. The cluster will consist of an on-premises head node (a computer running the Windows Server operating system and HPC Pack) and some compute nodes you deploy on-demand as worker role instances in an Azure cloud service. You can then run compute jobs on the hybrid cluster.

![Hybrid HPC cluster][Overview] 

This tutorial shows one approach, sometimes called cluster "burst to the cloud," to use scalable, on-demand compute resources in Azure to run compute-intensive applications.

This tutorial assumes no prior experience with compute clusters or HPC Pack. It is intended only to help you deploy a hybrid compute cluster quickly for demonstration purposes. For considerations and steps to deploy a hybrid HPC Pack cluster at greater scale in a production environment, see the [detailed guidance](http://go.microsoft.com/fwlink/p/?LinkID=200493). For other scenarios with HPC Pack, including automated cluster deployment in Azure virtual machines, see [HPC cluster options with Microsoft HPC Pack in Azure](../virtual-machines/virtual-machines-windows-hpcpack-cluster-options.md).


## Prerequisites

* **Azure subscription** - If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free/) in just a couple of minutes.

* **An on-premises computer running Windows Server 2012 R2 or Windows Server 2012** - This computer will be the head node of the HPC cluster. If you aren't already running Windows Server, you can download and install an [evaluation version](https://www.microsoft.com/evalcenter/evaluate-windows-server-2012-r2).

	* The computer must be joined to an Active Directory domain. For a test scenario with a fresh installation of Windows Server, you can add the Active Directory Domain Services server role and promote the head node computer as a domain controller in a new domain forest (see the documentation for Windows Server).

	* To support HPC Pack, the operating system must be installed in one of these languages: English, Japanese, or Chinese (Simplified).

	* Verify that important and critical updates are installed.

* **HPC Pack 2012 R2** - [Download](http://go.microsoft.com/fwlink/p/?linkid=328024) the installation package for the latest version free of charge and copy the files to the head node computer or to a network location. Choose installation files in the same language as your installation of Windows Server.

* **Domain account** - This account must be configured with local Administrator permissions on the head node to install HPC Pack.

* **TCP connectivity on port 443** from the head node to Azure.

## Install HPC Pack on the head node

You first install Microsoft HPC Pack on your on-premises computer running Windows Server that will be the head node of the cluster.

1. Log on to the head node by using a domain account that has local Administrator permissions.

2. Start the HPC Pack Installation Wizard by running Setup.exe from the HPC Pack installation files.

3. On the **HPC Pack 2012 R2 Setup** screen, click **New installation or add new features to an existing installation**.

	![HPC Pack 2012 Setup][install_hpc1]

4. On the **Microsoft Software User Agreement page**, click **Next**.

5. On the **Select Installation Type** page, click **Create a new HPC cluster by creating a head node**, and then click **Next**.

	![Select Installation Type][install_hpc2]

6. The wizard runs several pre-installation tests. Click **Next** on the **Installation Rules** page if all tests pass. Otherwise, review the information provided and make any necessary changes in your environment. Then run the tests again or if necessary start the Installation Wizard again.

	![Installation Rules][install_hpc3]

7. On the **HPC DB Configuration** page, make sure **Head Node** is selected for all HPC databases, and then click **Next**.

	![DB Configuration][install_hpc4]

8. Accept default selections on the remaining pages of the wizard. On the **Install Required Components** page, click **Install**.

	![Install][install_hpc6]

9. After the installation completes, uncheck **Start HPC Cluster Manager** and then click **Finish**. (You will start HPC Cluster Manager in a later step.)

	![Finish][install_hpc7]

## Prepare the Azure subscription
Use the [Azure classic portal](https://manage.windowsazure.com) to perform the following steps with your Azure subscription. These are needed so you can later deploy Azure nodes from the on-premises head node. Detailed procedures are in the next sections.

- Upload a management certificate (needed for secure connections between the head node and the Azure services)

- Create an Azure cloud service in which Azure nodes (worker role instances) will run

- Create an Azure storage account

	>[AZURE.NOTE]Also make a note of your Azure subscription ID, which you will need later. Find this in the classic portal by clicking **Settings** > **Subscriptions**.

### Upload the default management certificate
HPC Pack installs a self-signed certificate on the head node, called the Default Microsoft HPC Azure Management certificate, that you can upload as an Azure management certificate. This certificate is provided for testing purposes and proof-of-concept deployments.

1. From the head node computer, sign in to the [Azure classic portal](https://manage.windowsazure.com).

2. Click **Settings** > **Management Certificates**.

3. On the command bar, click **Upload**.

	![Certificate Settings][upload_cert1]

4. Browse on the head node for the file C:\Program Files\Microsoft HPC Pack 2012\Bin\hpccert.cer. Then, click the **Check** button.

	![Upload Certificate][install_hpc10]

You will see **Default HPC Azure Management** in the list of management certificates.

### Create an Azure cloud service

>[AZURE.NOTE]For best performance, create the cloud service and the storage account (in a later step) in the same geographic region.

1. In the classic portal, on the command bar, click **New**.

2. Click **Compute** > **Cloud Service** > **Quick Create**.

3. Type a URL for the cloud service, and then click **Create Cloud Service**.

	![Create Service][createservice1]

### Create an Azure storage account

1. In the classic portal, on the command bar, click **New**.

2. Click **Data Services** > **Storage** > **Quick Create**.

3. Type a URL for the account, and then click **Create Storage Account**.

	![Create Storage][createstorage1]

## Configure the head node

To use HPC Cluster Manager to deploy Azure nodes and to submit jobs, first perform some required cluster configuration steps.

1. On the head node, start HPC Cluster Manager. If the **Select Head Node** dialog box appears, click **Local Computer**. The **Deployment To-do List** appears.

2. Under **Required deployment tasks**, click **Configure your network**.

	![Configure Network][config_hpc2]

3. In the Network Configuration Wizard, select **All nodes only on an enterprise network** (Topology 5).

	![Topology 5][config_hpc3]

	>[AZURE.NOTE]This is the simplest configuration for demonstration purposes, because the head node only needs a single network adapter to connect to Active Directory and the Internet. This tutorial does not cover cluster scenarios that require additional networks.

4. Click **Next** to accept default values on the remaining pages of the wizard. Then, on the **Review** tab, click **Configure** to complete the network configuration.

5. In the **Deployment To-do List**, click **Provide installation credentials**.

6. In the **Installation Credentials** dialog box, type the credentials of the domain account that you used to install HPC Pack. Then click **OK**.

	![Installation Credentials][config_hpc6]

	>[AZURE.NOTE]HPC Pack services only use installation credentials to deploy domain-joined compute nodes. The Azure nodes you add in this tutorial are not domain-joined.

7. In the **Deployment To-do List**, click **Configure the naming of new nodes**.

8. In the **Specify Node Naming Series** dialog box, accept the default naming series and click **OK**.

	![Node Naming][config_hpc8]

	>[AZURE.NOTE]The naming series only generates names for domain-joined compute nodes. Azure worker nodes are named automatically.

9. In the **Deployment To-do List**, click **Create a node template**. You will use the node template to add Azure nodes to the cluster.

10. In the Create Node Template Wizard, do the following:

	a. On the **Choose Node Template Type** page, click **Azure node template**, and then click **Next**.

	![Node Template][config_hpc10]

	b. Click **Next** to accept the default template name.

	c. On the **Provide Subscription Information** page, enter your Azure subscription ID (available in your Azure account information). Then, in **Management certificate**, click **Browse** and select **Default HPC Azure Management.** Then click **Next**.

	![Node Template][config_hpc12]

	d. On the **Provide Service Information** page, select the cloud service and the storage account that you created in a previous step. Then click **Next**.

	![Node Template][config_hpc13]

	e. Click **Next** to accept default values on the remaining pages of the wizard. Then, on the **Review** tab, click **Create** to create the node template.

	>[AZURE.NOTE]By default, the Azure node template includes settings for you to start (provision) and stop the nodes manually, using HPC Cluster Manager. You can optionally configure a schedule to start and stop the Azure nodes automatically.

## Add Azure nodes to the cluster

You now use the node template to add Azure nodes to the cluster. Adding the nodes to the cluster stores their configuration information so that you can start (provision) them at any time as role instances in the cloud service. Your subscription only gets charged for Azure nodes after the role instances are running in the cloud service.

For this tutorial you will add two Small nodes.

1. In HPC Cluster Manager, in **Node Management** (called **Resource Management** in recent versions of HPC Pack), in the **Actions** pane, click **Add Node**.

	![Add Node][add_node1]

2. In the Add Node Wizard, on the **Select Deployment Method** page, click **Add Azure nodes**, and then click **Next**.

	![Add Azure Node][add_node1_1]

3. On the **Specify New Nodes** page, select the Azure node template you created previously (called by default **Default AzureNode Template**). Then specify **2** nodes of size **Small**, and then click **Next**.

	![Specify Nodes][add_node2]

	For details about the available sizes, see [Sizes for Cloud Services](cloud-services-sizes-specs.md).

4. On the **Completing the Add Node Wizard** page, click **Finish**.

	 Two Azure nodes, named **AzureCN-0001** and **AzureCN-0002**, now appear in HPC Cluster Manager. Both are in the **Not-Deployed** state.

	![Added Nodes][add_node3]

## Start the Azure nodes
When you want to use the cluster resources in Azure, use HPC Cluster Manager to start (provision) the Azure nodes and bring them online.

1.	In HPC Cluster Manager, in **Node Management** (called **Resource Management** in recent versions of HPC Pack), click one or both nodes and then, in the **Actions** pane, click **Start**.

	![Start Nodes][add_node4]

2. In the **Start Azure Nodes** dialog box, click **Start**.

	![Start Nodes][add_node5]

	The nodes transition to the **Provisioning** state. View the provisioning log to track the provisioning progress.

	![Provision Nodes][add_node6]

3. After a few minutes, the Azure nodes finish provisioning and are in the **Offline** state. In this state the role instances are running but will not yet accept cluster jobs.

4. To confirm that the role instances are running, in the [classic portal](https://manage.windowsazure.com), click **Cloud Services** > *your_cloud_service_name* > **Instances**.

	![Running Instances][view_instances1]

	You will see two worker role instances are running in the service. HPC Pack also automatically deploys two **HpcProxy** instances (size Medium) to handle communication between the head node and Azure.

5. To bring the Azure nodes online to run cluster jobs, select the nodes, right-click, and then click **Bring Online**.

	![Offline Nodes][add_node7]

	HPC Cluster Manager indicates that the nodes are in the **Online** state.

## Run a command across the cluster

To check the installation, use the HPC Pack **clusrun** command to run a command or application on one or more cluster nodes. As a simple example, use **clusrun** to get the IP configuration of the Azure nodes.

1. On the head node, open a command prompt.

2. Type the following command:

	`clusrun /nodes:azurecn* ipconfig`

3. You will see output similar to the following.

	![Clusrun][clusrun1]

## Run a test job

Now submit a test job that runs on the hybrid cluster. This example is a very simple parametric sweep job (a type of intrinsically parallel computation). This example runs subtasks that add an integer to itself by using the **set /a** command. All the nodes in the cluster contribute to finishing the subtasks for integers from 1 to 100.

1. In HPC Cluster Manager, in **Job Management**, in the **Actions** pane, click **New Parametric Sweep Job**.

	![New Job][test_job1]

2. In the **New Parametric Sweep Job** dialog box, in **Command line**, type `set /a *+*` (overwriting the default command line that appears). Leave default values for the remaining settings, and then click **Submit** to submit the job.

	![Parametric Sweep][param_sweep1]

3. When the job is finished, double-click the **My Sweep Task** job.

4. Click **View Tasks**, and then click a subtask to view the calculated output of that subtask.

	![Task Results][view_job361]

5. To see which node performed the calculation for that subtask, click **Allocated Nodes**. (Your cluster might show a different node name.)

	![Task Results][view_job362]

## Stop the Azure nodes

After you try out the cluster, stop the Azure nodes to avoid unnecessary charges to your account. This stops the cloud service and removes the Azure role instances.

1. In HPC Cluster Manager, in **Node Management** (called **Resource Management** in recent versions of HPC Pack), select both Azure nodes. Then, in the **Actions** pane, click **Stop**.

	![Stop Nodes][stop_node1]

2. In the **Stop Azure Nodes** dialog box, click **Stop**.

	![Stop Nodes][stop_node2]

3. The nodes transition to the **Stopping** state. After a few minutes, HPC Cluster Manager shows that the nodes are **Not-Deployed**.

	![Not Deployed Nodes][stop_node4]

4. To confirm that the role instances are no longer running in Azure, in the [classic portal](https://manage.windowsazure.com), click **Cloud Services** > *your_cloud_service_name* > **Instances**. No instances will be deployed in the production environment.

	![No Instances][view_instances2]

	This completes the tutorial.

## Next steps

* Explore the documentation for [HPC Pack 2012 R2 and HPC Pack 2012](http://go.microsoft.com/fwlink/p/?LinkID=263697).

* To set up a hybrid HPC Pack cluster deployment at greater scale, see [Burst to Azure Worker Role Instances with Microsoft HPC Pack](http://go.microsoft.com/fwlink/p/?LinkID=200493).

* For other ways to create an HPC Pack cluster in Azure, including using Azure Resource Manager templates, see [HPC cluster options with Microsoft HPC Pack in Azure](../virtual-machines/virtual-machines-windows-hpcpack-cluster-options.md).
* See [Big Compute in Azure: Technical Resources for Batch and High Performance Computing (HPC)](../batch/big-compute-resources.md) for more about the range of Big Compute and HPC cloud solutions in Azure.


[Overview]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/hybrid_cluster_overview.png
[install_hpc1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/install_hpc1.png
[install_hpc2]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/install_hpc2.png
[install_hpc3]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/install_hpc3.png
[install_hpc4]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/install_hpc4.png
[install_hpc6]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/install_hpc6.png
[install_hpc7]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/install_hpc7.png
[install_hpc10]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/install_hpc10.png
[upload_cert1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/upload_cert1.png
[createstorage1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/createstorage1.png
[createservice1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/createservice1.png
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
[add_node5]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/add_node5.png
[add_node6]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/add_node6.png
[add_node7]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/add_node7.png
[view_instances1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/view_instances1.png
[clusrun1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/clusrun1.png
[test_job1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/test_job1.png
[param_sweep1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/param_sweep1.png
[view_job361]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/view_job361.png
[view_job362]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/view_job362.png
[stop_node1]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/stop_node1.png
[stop_node2]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/stop_node2.png
[stop_node4]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/stop_node4.png
[view_instances2]: ./media/cloud-services-setup-hybrid-hpcpack-cluster/view_instances2.png
