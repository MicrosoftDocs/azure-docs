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

   ![Virtual machine listing on the Azure portal, with Create button](./media/provision-vm/Create_Windows.png)

1. Fill in the **Basics** tab:
      * **Subscription**: If you have more than one subscription, select the one on which the machine will be created and billed.
      * **Resource Group**: Create a new group or use an existing one.
      * **Virtual machine name**: Enter the name of the DSVM.
      * **Location**: Select the datacenter that's most appropriate. For fastest network access, it's the datacenter that has most of your data or is closest to your physical location. Learn more about [Azure Regions](https://azure.microsoft.com/en-us/global-infrastructure/regions/).
      * **Size**: This should auto-populate with a size that is appropriate for general workloads. Read more about [Windows VM sizes in Azure](../../virtual-machines/windows/sizes.md).
      * **Username**: Enter the username you will use to log into your virtual machine.
      * **Password**: Enter the password you will use to log into your virtual machine.    
1. Select **Review + create**.
1. **Review+create**
   * Verify that all the information you entered is correct. 
   * Select **Create**.


> [!NOTE]
> * You do not pay licensing fees for the software that comes pre-loaded on the virtual machine. You do pay the compute cost for the server size that you chose in the **Size** step.
> * Provisioning takes 10 to 20 minutes. You can view the status of your VM on the Azure portal.

## Access the DSVM

After the VM is created and provisioned, follow the steps listed [here](../../marketplace/cloud-partner-portal/virtual-machine/cpp-connect-vm.md) to access it through a remote desktop connection. Use the admin account credentials that you configured in the **Basics** step of creating a virtual machine. 

You're ready to start using the tools that are installed and configured on the VM. Many of the tools can be accessed through **Start** menu tiles and desktop icons.

You can also attach a DSVM to Azure Notebooks to run Jupyter notebooks on the VM and bypass the limitations of the free service tier. For more information, see [Manage and configure Notebooks projects](../../notebooks/configure-manage-azure-notebooks-projects.md#manage-and-configure-projects).

<a name="tools"></a>


## Next steps

* Explore the tools on the DSVM by opening the **Start** menu.
* Learn about the Azure Machine Learning service by reading [What is Azure Machine Learning service?](../service/overview-what-is-azure-ml.md) and trying out [tutorials](../index.yml).
* In File Explorer, browse to C:\Program Files\Microsoft\ML Server\R_SERVER\library\RevoScaleR\demoScripts for samples that use the RevoScaleR library in R that supports data analytics at enterprise scale. 
* Read the article [Ten things you can do on the Data Science Virtual Machine](https://aka.ms/dsvmtenthings).
* Learn how to build end-to-end analytical solutions systematically by using the [Team Data Science Process](../team-data-science-process/index.yml).
* Visit the [Azure AI Gallery](https://gallery.cortanaintelligence.com) for machine learning and data analytics samples that use Azure Machine Learning and related data services on Azure. We've also provided an icon for this gallery on the **Start** menu and on the desktop of the virtual machine.
