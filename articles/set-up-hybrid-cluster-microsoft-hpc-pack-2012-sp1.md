<properties linkid="" urlDisplayName="" pageTitle="" metaKeywords="" description="" metaCanonical="" services="" documentationCenter="" title="Set up a Hybrid Cluster with Microsoft HPC Pack" authors=""  solutions="" writer="danlep" manager="jeffreyg" editor="mattshel"  />



#Set up a Hybrid Cluster with Microsoft HPC Pack
This tutorial shows you how to use Microsoft HPC Pack 2012 with Service Pack 1 (SP1) and Windows Azure to set up a small, hybrid high performance computing (HPC) cluster. The cluster will consist of an on-premises head node (a computer running the Windows Server 2012 operating system and HPC Pack) and some compute nodes you deploy on-demand as worker role instances in a Windows Azure cloud service. You can then run compute jobs on the hybrid cluster.
 
![Hybrid HPC cluster][Overview] 

This tutorial shows one approach, sometimes called cluster "burst to the cloud," to use scalable, on-demand compute resources in Windows Azure to run compute-intensive applications.

This tutorial assumes no prior experience with compute clusters or HPC Pack. It is intended only to help you deploy a hybrid cluster quickly for demonstration purposes. For considerations and steps to deploy a hybrid HPC Pack cluster at greater scale in a production environment, see the [detailed guidance](http://go.microsoft.com/fwlink/?LinkID=200493).

This tutorial walks you through these basic steps:

* [Prerequisistes](#BKMK_Prereq)
* [Install HPC Pack on the head node](#BKMK_DeployHN)
* [Prepare the Windows Azure subscription](#BKMK_Prpare)
* [Configure the head node](#BKMK_ConfigHN)
* [Add Windows Azure nodes to the cluster](#BKMK_worker)
* [Start the Windows Azure nodes](#BKMK_start)
* [Run a command across the cluster](#BKMK_RunCommand)
* [Run a test job](#BKMK_RunJob)
* [Stop the Windows Azure nodes](#BKMK_stop)

<h2 id="BKMK_Prereq">Prerequisites</h2>

<div class="dev-callout"><strong>Note</strong> <p>To complete this tutorial, you need a Windows Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/" target="_blank">Windows Azure Free Trial</a>.</p></div>

In addition, you need the following for this tutorial.

* An on-premises computer that is running an edition of Windows Server 2012. This computer will be the head node of the HPC cluster. If you are not already running Windows Server 2012, you can download and install the [evaluation version](http://technet.microsoft.com/evalcenter/hh670538.aspx).

	* The computer must be joined to an Active Directory domain.

	* Ensure that no additional server roles or role services are installed.

	* To support HPC Pack, the operating system must be installed in one of these languages: English, Japanese, or Chinese (Simplified).

	* Verify that important and critical updates are installed.

	<div class="dev-callout"> 
	<strong>Note</strong> 
	<p>At this time Windows Server 2012 R2 Preview does not support HPC Pack.</p> 
	</div>

* Installation files for HPC Pack 2012 with SP1, which is available free of charge. [Download](http://www.microsoft.com/download/details.aspx?id=39962) the full installation package and copy the files to the head node computer or to a network location. Choose installation files in the same language as your installation of Windows Server 2012.

* A domain account with local Administrator permissions on the head node.

* TCP connectivity on port 443 from the head node to Windows Azure.

<h2 id="BKMK_DeployHN">Install HPC Pack on the head node</h2>

You first install Microsoft HPC Pack 2012 with SP1 on an on-premises computer that will be the head node of the cluster.

1. Log on to the head node by using a domain account that has local Administrator permissions.

2. Start the HPC Pack 2012 Installation Wizard by running Setup.exe from the HPC Pack 2012 installation files.

3. On the **HPC Pack 2012 Setup** screen, click **New installation or add new features to an existing installation**.

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

9. After the installation completes, uncheck **Start HPC Cluster Manager** and then click **Finish**. (You will start HPC Cluster Manager in a later step to complete the configuration of the head node.)

	![Finish][install_hpc7]




<h2 id="BKMK_Prepare">Prepare the Windows Azure subscription</h2>
Use the [Management Portal](https://manage.windowsazure.com) to perform the following steps with your Windows Azure subscription. These are needed so you can later deploy Windows Azure nodes from the on-premises head node. 

- Upload a management certificate (needed for secure connections between the head node and the Windows Azure services)
 
- Create a Windows Azure storage account

- Create a Windows Azure Cloud Service in which Windows Azure nodes (worker role instances) will run

	<div class="dev-callout"> 
	<strong>Note</strong> 
	<p>Also make a note of your Windows Azure subscription ID, which you will need later. Find this in your Windows Azure <a href="[https://account.windowsazure.com/Subscriptions">account information</a>. </p> 
	</div>

<h3>Upload the default management certificate</h3>
HPC Pack installs a self-signed certificate on the head node, called the Default Microsoft HPC Azure Management certificate, that you can upload as a Windows Azure management certificate. This certificate is provided for testing purposes and proof-of-concept deployments.

1. From the head node computer, sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Settings**, and then click **Management Certificates**.

3. On the command bar, click **Upload**.

	![Certificate Settings][upload_cert1]

4. Browse on the head node for the file C:\Program Files\Microsoft HPC Pack 2012\Bin\hpccert.cer. Then, click the **Check** button.

	![Upload Certificate][install_hpc10]

You will see **Default HPC Azure Management** in the list of management certificates.


<h3>Create a Windows Azure storage account</h3>

<div class="dev-callout"> 
	<strong>Note</strong> 
	<p>For best performance, create the storage account and the cloud service in the same geographic region or affinity group (if configured). </p> 
	</div>

1. In the Management Portal, on the command bar, click **New**.

2. Click **Data Services**, click **Storage**, and then click **Quick Create**.

3. Type a URL for the account, and then click **Create Storage Account**.

	![Create Storage][createstorage1]

<h3>Create a Windows Azure cloud service</h3> 

1. In the Management Portal, on the command bar, click **New**.

2. Click **Compute**, click **Cloud Service**, and then click **Quick Create**.

3. Type a URL for the cloud service, and then click **Create Cloud Service**.

	![Create Service][createservice1]

<h2 id="BKMK_ConfigHN">Configure the head node</h2>

To use HPC Cluster Manager to deploy Windows Azure nodes and to submit jobs, you must first perform several required cluster configuration steps. 

1. On the head node, start HPC Cluster Manager. If the **Select Head Node** dialog box appears, click **Local Computer**. The **Deployment To-do List** appears.

2. Under **Required deployment tasks**, click **Configure your network**.

	![Configure Network][config_hpc2]

3. In the Network Configuration Wizard, select **All nodes only on an enterprise network** (Topology 5).

	![Topology 5][config_hpc3] 

	<div class="dev-callout"> 
	<strong>Note</strong> 
	<p>This is the simplest configuration for demonstration purposes, because the head node only needs a single network adapter to connect to Active Directory and the Internet. This tutorial does not cover cluster scenarios that require additional networks. </p> 
	</div>
 
4. Click **Next** to accept default values on the remaining pages of the wizard. Then, on the **Review** tab, click **Configure** to complete the network configuration.

5. In the **Deployment To-do List**, click **Provide installation credentials**. 

6. In the **Installation Credentials** dialog box, type the credentials of the domain account that you used to install HPC Pack. Then click **OK**.

	![Installation Credentials][config_hpc6]

	<div class="dev-callout"> 
	<strong>Note</strong> 
	<p>HPC Pack services use installation credentials only to deploy on-premises compute nodes. </p> 
	</div>

7. In the **Deployment To-do List**, click **Configure the naming of new nodes**. 

8. In the **Specify Node Naming Series** dialog box, accept the default naming series and click **OK**.

	![Node Naming][config_hpc8]

	<div class="dev-callout"> 
	<strong>Note</strong> 
	<p>The naming series generates names only for on-premises compute nodes. Windows Azure nodes are named automatically. </p> 
	</div>
  
9. In the **Deployment To-do List**, click **Create a node template**. You will use the node template to add Windows Azure nodes to the cluster.

10. In the Create Node Template Wizard, do the following:

	a. On the **Choose Node Template Type** page, click **Windows Azure node template**, and then click **Next**.

	![Node Template][config_hpc10]

	b. Click **Next** to accept the default template name.

	c. On the **Provide Subscription Information** page, enter your Windows Azure subscription ID (available in your Windows Azure <a href="[https://account.windowsazure.com/Subscriptions">account information</a>). Then, in **Management certificate**, click **Browse** and select **Default HPC Azure Management.** Then click **Next**.

	![Node Template][config_hpc12]

	d. On the **Provide Service Information** page, select the cloud service and the storage account that you created in a previous step. Then click **Next**.

	![Node Template][config_hpc13]

	e. Click **Next** to accept default values on the remaining pages of the wizard. Then, on the **Review** tab, click **Create** to create the node template.

	<div class="dev-callout"> 
	<strong>Note</strong> 
	<p>By default, the Windows Azure node template includes settings for you to start (provision) and stop the nodes manually. You can also configure a schedule to start and stop the Windows Azure nodes automatically. </p> 
	</div>

<h2 id="#BKMK_worker">Add Windows Azure nodes to the cluster</h2>

You now use the node template to add Windows Azure nodes to the cluster. Adding the nodes to the cluster makes them ready for you to start (provision) them at any time as role instances in the cloud service. Your subscription only gets charged for Windows Azure nodes after the role instances are running in the Cloud Service.

For this tutorial you will add two Small nodes.

1. In HPC Cluster Manager, in **Node Management**, in the **Actions** pane, click **Add Node**. 

	![Add Node][add_node1]

2. In the Add Node Wizard, on the **Select Deployment Method** page, click **Add Windows Azure nodes**, and then click **Next**.

	![Add Azure Node][add_node1_1]

3. On the **Specify New Nodes** page, select the Windows Azure node template you created previously (called **Default AzureNode Template**). Then specify **2** nodes of size **Small**, and then click **Next**.

	![Specify Nodes][add_node2]

	For details about the available virtual machine sizes, see [Virtual Machine and Cloud Service Sizes for Windows Azure](http://msdn.microsoft.com/library/windowsazure/dn197896.aspx).

4. On the **Completing the Add Node Wizard** page, click **Finish**. 

	You wil see two Windows Azure nodes, named **AzureCN-0001** and **AzureCN-0002**, in HPC Cluster Manager. They are both in the **Not-Deployed** state.

	![Added Nodes][add_node3]


<h2 id="BKMK_Start">Start the Windows Azure nodes</h2>
When you want to use the cluster resources in Windows Azure, use HPC Cluster Manager to start (provision) the Windows Azure nodes and bring them online.

1.	In HPC Cluster Manager, in **Node Management**, click one or both nodes and then, in the **Actions** pane, click **Start**. 

	![Start Nodes][add_node4]

2. In the **Start Windows Azure Nodes** dialog box, click **Start**.

	![Start Nodes][add_node5]
 
	The nodes transition to the **Provisioning** state. You can view the provisioning log to track the provisioning progress.

	![Provision Nodes][add_node6]

3. After a few minutes, the Windows Azure nodes finish provisioning and are in the **Offline** state. In this state the role instances are running but will not yet accept cluster jobs.


4. To confirm that the role instances are running, in the [Management Portal](https://manage.windowsazure.com), click **Cloud Services**, click the name of your cloud service, and then click **Instances**. 

	![Running Instances][view_instances1]

	You will see two worker role instances are running in the service. HPC Pack also automatically deploys two **HpcProxy** instances (size Medium) to handle communication between the head node and Windows Azure.

5. To bring the Windows Azure nodes online to run cluster jobs, right-click a Windows Azure node and then click **Bring Online**.

	![Offline Nodes][add_node7]
 
	HPC Cluster Manager indicates that the nodes are in the **Online** state.

<h2 id="BKMK_RunCommand">Run a command across the cluster</h2>	
You can use the HPC Pack **clusrun** command to run a command or application on one or more cluster nodes. As a simple example, use **clusrun** get the IP configuration of the Windows Azure nodes.

1. On the head node, open a command prompt.

2. Type the following command:

	`clusrun /nodes:azurecn* ipconfig`

3. You will see output similar to the following.

	![Clusrun][clusrun1]

<h2 id="BKMK_RunJob">Run a test job</h2>

You can submit a test job that runs on the hybrid cluster. This example is a simple "parametric sweep" job (a type of intrinsically parallel computation) which runs subtasks that add an integer to itself by using the **set /a** command. All the nodes in the cluster contribute to finishing the subtasks for integers from 1 to 100. 

1. In HPC Cluster Manager, in **Job Management**, in the **Actions** pane, click **New Parametric Sweep Job**.

	![New Job][test_job1]

2. In the **New Parametric Sweep Job** dialog box, in **Command line**, type `set /a *+*` (overwriting the default command line that appears). Leave the remaining settings with default values, and then click **Submit** to submit the job.

	![Parametric Sweep][param_sweep1]

3. When the job is finished, double-click the **My Sweep Task** job.

4. Click **View Tasks**, and then click a subtask to view the calculated output of that subtask.

	![Task Results][view_job361]

5. To see which node performed the calculation for that subtask, click **Allocated Nodes**. (Your cluster might show a different node name.)

	![Task Results][view_job362]

<h2 id="BKMK_stop">Stop the Windows Azure nodes</h2>

After you try out the cluster, you can use HPC Cluster Manager to stop the Windows Azure nodes to avoid unnecessary charges to your account. This stops the cloud service and removes the Windows Azure role instances. 

1. In HPC Cluster Manager, in **Node Management,** click one or both Windows Azure nodes. Then, in the **Actions** pane, click **Stop**. 

	![Stop Nodes][stop_node1]

2. In the **Stop Windows Azure Nodes** dialog box, click **Stop**.

	![Stop Nodes][stop_node2]

3. The nodes transition to the **Stopping** state. After a few minutes, HPC Cluster Manager shows that the nodes are **Not-Deployed**.

	![Not Deployed Nodes][stop_node4]

4. To confirm that the role instances are no longer running in Windows Azure, in the [Management Portal](https://manage.windowsazure.com), click **Cloud Services**, click the name of your cloud service, and then click **Instances**. No instances will be deployed in the production environment.

	![No Instances][view_instances2]

	This completes the tutorial.

<h2 id="">Related resources</h2>

* [HPC Pack 2012](http://go.microsoft.com/fwlink/?LinkID=263697)
* [Burst to Windows Azure with Microsoft HPC Pack](http://go.microsoft.com/fwlink/?LinkID=200493)
* [Deploying Applications to Windows Azure Nodes](http://go.microsoft.com/fwlink/?LinkId=325317)
* [Creating HPC Cloud Solutions with Windows HPC Server and Windows Azure](http://www.microsoft.com/en-us/download/details.aspx?id=12006)



[Overview]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/hybrid_cluster_overview.png
[install_hpc1]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/install_hpc1.png
[install_hpc2]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/install_hpc2.png
[install_hpc3]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/install_hpc3.png
[install_hpc4]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/install_hpc4.png
[install_hpc6]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/install_hpc6.png
[install_hpc7]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/install_hpc7.png
[install_hpc10]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/install_hpc10.png
[upload_cert1]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/upload_cert1.png
[createstorage1]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/createstorage1.png
[createservice1]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/createservice1.png
[config_hpc2]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/config_hpc2.png
[config_hpc3]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/config_hpc3.png
[config_hpc6]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/config_hpc6.png
[config_hpc8]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/config_hpc8.png
[config_hpc10]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/config_hpc10.png
[config_hpc12]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/config_hpc12.png
[config_hpc13]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/config_hpc13.png
[add_node1]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/add_node1.png
[add_node1_1]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/add_node1_1.png
[add_node2]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/add_node2.png
[add_node3]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/add_node3.png
[add_node4]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/add_node4.png
[add_node5]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/add_node5.png
[add_node6]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/add_node6.png
[add_node7]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/add_node7.png
[view_instances1]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/view_instances1.png
[clusrun1]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/clusrun1.png
[test_job1]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/test_job1.png
[param_sweep1]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/param_sweep1.png
[view_job361]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/view_job361.png
[view_job362]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/view_job362.png
[stop_node1]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/stop_node1.png
[stop_node2]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/stop_node2.png
[stop_node4]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/stop_node4.png
[view_instances2]: ./media/set-up-hybrid-cluster-microsoft-hpc-pack-2012-sp1/view_instances2.png
