---
title: 'Quickstart: Create a Windows'
titleSuffix: Azure Data Science Virtual Machine 
description: Configure and create a Data Science Virtual Machine on Azure for analytics and machine learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: data-science-vm

author: gvashishtha
ms.author: gopalv
ms.topic: quickstart
ms.date: 09/10/2019

#Customer intent: As a data scientist, I want to learn how to provision the Windows DSVM so that I can move my existing workflow to the cloud.
---

To create a Microsoft Data Science Virtual Machine, you must have an Azure subscription. [Try Azure for free](https://azure.com/free).

## Create your DSVM

To create a DSVM instance:

1. Go to the virtual machine listing on the [Azure portal](https://portal.azure.com/#create/microsoft-dsvm.dsvm-windowsserver-2016). You might be prompted to sign in to your Azure account if you're not already signed in.
1. Select the **Create** button at the bottom.

   ![Virtual machine listing on the Azure portal, with Create button](./media/provision-vm/configure-data-science-virtual-machine.png)

1. Enter the following information to configure each of the steps shown in the right pane of the screenshot:

   1. **Basics**:
      * **Name**: Enter the name of the DSVM.
      * **VM Disk Type**: Select either **SSD** or **HDD**. For an NC_v1 GPU instance like Nvidia Tesla K80 based, choose **HDD** as the disk type.
      * **User Name**: Enter the admin account ID.
      * **Password**: Enter the admin account password.
      * **Subscription**: If you have more than one subscription, select the one on which the machine will be created and billed.
      * **Resource Group**: Create a new group or use an existing one.
      * **Location**: Select the datacenter that's most appropriate. For fastest network access, it's the datacenter that has most of your data or is closest to your physical location.
   1. **Size**: Select the server type that meets your functional requirements and cost constraints. For more choices of VM sizes, select **View All**.
   1. **Settings**:  
      * **Use Managed Disks**. Choose **Managed** if you want Azure to manage the disks for the VM. If not, you need to specify a new or existing storage account.  
      * **Other parameters**. You can use the default values. If you want to use non-default values, hover over the informational link for help on the specific fields.
   1. **Summary**: Verify that all the information you entered is correct. Select **Create**.

> [!NOTE]
> * The VM doesn't incur any additional charges beyond the compute cost for the server size that you chose in the **Size** step.
> * Provisioning takes 10 to 20 minutes. You can view the status of your VM on the Azure portal.

## Access the DSVM

After the VM is created and provisioned, you can access it through a remote desktop connection. Use the admin account credentials that you configured in the **Basics** step of creating a virtual machine. 

You're ready to start using the tools that are installed and configured on the VM. Many of the tools can be accessed through **Start** menu tiles and desktop icons.

You can also attach a DSVM to Azure Notebooks to run Jupyter notebooks on the VM and bypass the limitations of the free service tier. For more information, see [Manage and configure Notebooks projects](../../notebooks/configure-manage-azure-notebooks-projects.md#compute-tier).

<a name="tools"></a>


## Next steps

* Explore the tools on the DSVM by opening the **Start** menu.
* Learn about the Azure Machine Learning service by reading [What is Azure Machine Learning service?](../service/overview-what-is-azure-ml.md) and trying out [tutorials](../index.yml).
* In File Explorer, browse to C:\Program Files\Microsoft\ML Server\R_SERVER\library\RevoScaleR\demoScripts for samples that use the RevoScaleR library in R that supports data analytics at enterprise scale. 
* Read the article [Ten things you can do on the Data Science Virtual Machine](https://aka.ms/dsvmtenthings).
* Learn how to build end-to-end analytical solutions systematically by using the [Team Data Science Process](../team-data-science-process/index.yml).
* Visit the [Azure AI Gallery](https://gallery.cortanaintelligence.com) for machine learning and data analytics samples that use Azure Machine Learning and related data services on Azure. We've also provided an icon for this gallery on the **Start** menu and on the desktop of the virtual machine.
