---
title: 'Quickstart: Create a CentOS Linux'
titleSuffix: Azure Data Science Virtual Machine 
description: Create and configure a Linux Data Science Virtual Machine in Azure for analytics and machine learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: data-science-vm

author: vijetajo
ms.author: vijetaj
ms.topic: quickstart
ms.date: 03/16/2018

---
# Quickstart: Set up a Linux CentOS Data Science Virtual Machine in Azure

The Linux Data Science Virtual Machine (DSVM) is a CentOS-based Azure virtual machine. The Linux DSVM comes with a collection of preinstalled tools that you can use for data analytics and machine learning. 

The key software components included in a Linux DSVM are:

* Linux CentOS distribution operating system.
* Microsoft Machine Learning Server.
* Anaconda Python distribution (versions 3.5 and 2.7), including popular data analysis libraries.
* JuliaPro, a curated distribution of the Julia language and popular scientific and data analytics libraries.
* Spark Standalone instance and single-node Hadoop (HDFS, YARN).
* JupyterHub, a multiuser Jupyter notebook server that support R, Python, PySpark, and Julia kernels.
* Azure Storage Explorer.
* Azure CLI, the Azure command-line interface for managing Azure resources.
* PostgresSQL database.
* Machine learning tools:
  * [Microsoft Cognitive Toolkit](https://github.com/Microsoft/CNTK) (CNTK), a deep learning software toolkit from Microsoft Research.
  * [Vowpal Wabbit](https://github.com/JohnLangford/vowpal_wabbit), a fast machine learning system that supports techniques like online, hashing, allreduce, reductions, learning2search, active, and interactive learning.
  * [XGBoost](https://xgboost.readthedocs.org/en/latest/), a tool that provides fast and accurate boosted tree implementation.
  * [Rattle](https://togaware.com/rattle/), a tool that makes getting started with data analytics and machine learning in R easy. Rattle offers both GUI-based data exploration and modeling by using automatic R code generation.
* Azure SDK in Java, Python, Node.js, Ruby, and PHP.
* Libraries in R and Python to use in Azure Machine Learning and other Azure services.
* Development tools and editors (RStudio, PyCharm, IntelliJ, Emacs, gedit, vi).

Data science involves iterating on a sequence of tasks:

1. Find, load, and pre-process data.
1. Build and test models.
1. Deploy the models for consumption in intelligent applications.

Data scientists use various tools to complete these tasks. It can be time-consuming to find the correct versions of the software, and then download, compile, and install the software.

The Linux DSVM can ease this burden substantially. Use the Linux DSVM to jump-start your analytics project. The Linux DSVM helps you work on tasks in various languages, including R, Python, SQL, Java, and C++. Eclipse provides an easy-to-use IDE for developing and testing your code. The Azure SDK, included in the DSVM, helps you build your applications by using various services on Linux for the Microsoft cloud platform. Other languages are preinstalled, including Ruby, Perl, PHP, and Node.js.

There are no software charges for the DSVM image. You pay only the Azure hardware usage fees that are assessed based on the size of the virtual machine you provision with the DSVM image. For more information about the compute fees, see the [Data Science Virtual Machine for Linux (CentOS) listing](https://azure.microsoft.com/marketplace/partners/microsoft-ads/linux-data-science-vm/) in Azure Marketplace.

## Prerequisites

Before you can create a Linux Data Science Virtual Machine, you must have these prerequisites:

* **Azure subscription**: To get an Azure subscription, see [Create a free Azure account](https://azure.microsoft.com/free/).
* **Azure storage account**: To get an Azure storage account, see [Create a storage account](../../storage/common/storage-quickstart-create-account.md). If you don't want to use an existing Azure storage account, you can create a storage account when you create the DSVM.

## Other versions of the Data Science Virtual Machine

The Data Science Virtual Machine is also available in these versions:

* [Ubuntu](dsvm-ubuntu-intro.md): The Ubuntu image has many of the same tools as the CentOS image, including deep learning frameworks. 
* [Windows](provision-vm.md)

## Create a Linux Data Science Virtual Machine

To create an instance of the Linux DSVM:

1. Go to the virtual machine listing in the [Azure portal](https://portal.azure.com/#create/microsoft-ads.linux-data-science-vmlinuxdsvm).
1. Select **Create** to open the wizard.

   ![The wizard that configures a Data Science Virtual Machine](./media/linux-dsvm-intro/configure-linux-data-science-virtual-machine.png)
1. Enter or select the following information for each step of the wizard:
   
   **1** **Basics**:

      * **Name**: The name of the data science server you're creating.
      * **User name**: The first account sign-in ID.
      * **Password**: The first account password. (You can use an SSH public key instead of a password.)
      * **Subscription**: If you have more than one subscription, select the subscription on which the machine will be created and billed. You must have permissions to create resources for the subscription.
      * **Resource group**: You can create a new resource group or use an existing group.
      * **Location**: Select a datacenter to use for the DSVM. In most cases, select the datacenter that holds most of your data or that's closest to your physical location (for the fastest network access).
   
   **2** **Size**: Select a server type that meets your functional requirement and cost constraints. Select **View All** to see more choices of VM sizes.
   
   
   **3** **Settings**:
      * **Disk type**: If you prefer a solid-state drive (SSD), select **Premium**. Otherwise, select **Standard**.
      * **Storage account**: You can create a new Azure storage account in your subscription or use an existing Azure account in the same location that you selected in the **Basics** step of the wizard.
      * **Other parameters**: In most cases, use the default values to configure other parameters. To see non-default values, hover over the informational link for the parameter.
   
   **4** **Summary**: Verify that the information you entered is correct.
   
   **5** **Buy**: To start the provisioning, select **Buy**. A link to the terms of the transaction is provided. There are no additional charges for the DSVM beyond the compute for the server size you select in **Size**.

Provisioning takes 10-20 minutes. The status of the provisioning is displayed in the Azure portal.

## How to access the Linux Data Science Virtual Machine

After the DSVM is created, you can sign in to it by using SSH. Use the account credentials that you created in the **Basics** section of the wizard for the text shell interface. On Windows, you can download an SSH client tool like [PuTTY](https://www.putty.org). If you prefer a graphical desktop (X Window System), you can use X11 forwarding on PuTTY or install the X2Go client.

> [!NOTE]
> The X2Go client performed better than X11 forwarding in testing. We recommend using the X2Go client for a graphical desktop interface.

## Install and configure the X2Go client

The Linux DSVM is provisioned with X2Go Server and ready to accept client connections. To connect to the Linux DSVM graphical desktop, complete the following procedure on your client:

1. Download and install the X2Go client for your client platform from [X2Go](https://wiki.x2go.org/doku.php/doc:installation:x2goclient).
1. Run the X2Go client. Select **New Session**. A configuration window with multiple tabs opens. Enter the following configuration parameters:
   * **Session tab**:
     * **Host**: Enter the host name or IP address of your Linux DSVM.
     * **Login**: Enter the username on the Linux DSVM.
     * **SSH Port**: Leave the default value, **22**.
     * **Session Type**: Change the value to **XFCE**. Currently, the Linux DSVM supports only the XFCE desktop.
   * **Media** tab: You can turn off sound support and client printing if you don't need to use them.
   * **Shared folders**: If you want directories from your client machines mounted on the Linux DSVM, add the client machine directories that you want to share with the DSVM.

After you sign in to the DSVM by using either the SSH client or the XFCE graphical desktop through the X2Go client, you're ready to begin using the tools that are installed and configured on the DSVM. On XFCE, you can see application menu shortcuts and desktop icons for many of the tools.


## Next steps

Here's how you can continue your learning and exploration:

* The walkthrough [Data science on the Data Science Virtual Machine for Linux](linux-dsvm-walkthrough.md) shows you how to do several common data science tasks with the Linux DSVM provisioned here. 
* Explore the various data science tools on the DSVM by trying out the tools described in this article. You can also run `dsvm-more-info` in the shell in the virtual machine for a basic introduction and for pointers to more information about the tools installed on the DSVM.  
* Learn how to build end-to-end analytical solutions systematically by using the [Team Data Science Process](https://aka.ms/tdsp).
* Visit the [Azure AI Gallery](https://gallery.azure.ai/) for machine learning and data analytics samples that use the Azure AI services.