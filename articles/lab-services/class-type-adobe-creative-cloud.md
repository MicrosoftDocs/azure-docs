---
title: Set up a lab with Adobe Creative Cloud using Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab for digital arts and media classes that use Adobe Creative Cloud. 
author: nicolela
ms.topic: article
ms.date: 04/21/2021
ms.author: nicolela
---

# Set up a lab for Adobe Creative Cloud
[Adobe Creative Cloud](https://www.adobe.com/creativecloud.html) is a collection of desktop applications and web services used for photography, design, video, web, user experience (UX), and more.  Universities and K-12 schools use Creative Cloud in digital arts and media classes.  Some of Creative Cloud’s media processes may require more computational and visualization (GPU) power than a typical tablet, laptop, or workstation support.  With Azure Lab Services, you have flexibility to choose from various virtual machine (VM) sizes, including GPU sizes.

In this article, we’ll show how to set up a class that uses Creative Cloud.

## Licensing
To use Creative Cloud on a lab VM, you must use [Named User Licensing](https://helpx.adobe.com/enterprise/kb/technical-support-boundaries-virtualized-server-based.html#main_Licensing_considerations), which is the only type of licensing that supports deployment on a virtual machine.  Each lab VM has internet access so that your students can activate Creative Cloud apps by signing into the software.  Once a student signs in, their authentication token is cached in the user profile so that they don’t have to sign in again on their VM.  Read [Adobe’s article on licensing](https://helpx.adobe.com/enterprise/using/licensing.html) for more details.

## Lab configuration
To set up this lab, you need an Azure subscription and lab account to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Once you get an Azure subscription, you can create a new lab account in Azure Lab Services. For more information about creating a new lab account, see the tutorial on [how to set up a lab account](./tutorial-setup-lab-account.md). You can also use an existing lab account.

### Lab account settings

Enable the settings described in the table below for the lab account. For more information about how to enable marketplace images, see the article on [how to specify Marketplace images available to lab creators](./specify-marketplace-images.md).

| Lab account setting | Instructions |
| ------------------- | ------------ |
|Marketplace image| Enable the Windows 10 image for use within your lab account.|

### Lab settings

The size of VM that you need to use for your lab depends on the types of projects that your students will create.  Most [Creative Cloud apps](https://helpx.adobe.com/creative-cloud/system-requirements.html) support GPU-based acceleration and require a GPU for features to work properly.  To ensure that you select the appropriate VM size, we recommend that you test the projects that your students will create to ensure adequate performance.  The below table shows the recommended [VM size](./administrator-guide.md#vm-sizing) to use with Creative Cloud.  

| Lab settings | Value/instructions |
| ------------ | ------------------ |
|Virtual Machine Size| **Small GPU (Visualization)**.  This VM is best suited for remote visualization, streaming, gaming, encoding using frameworks such as OpenGL and DirectX.|  
|Virtual Machine Image| Windows 10 |

> [!NOTE]
> The **Small GPU (Visualization)** virtual machine size is configured to enable a high-performing graphics experience and meets [Adobe’s system requirements for each application](https://helpx.adobe.com/creative-cloud/system-requirements.html).  Make sure to choose Small GPU (Visualization) not Small GPU (Compute).  For more information about this virtual machine size, see the article on [how to set up a lab with GPUs](./how-to-setup-lab-gpu.md).

## Template virtual machine configuration

### Creative Cloud deployment package
Installing Creative Cloud requires the use of a deployment package. Typically, the deployment package is created by your IT department using Adobe’s Admin Console.  When IT creates the deployment package, they also have the option to enable self-service.  There are a few ways to enable self-service for the deployment package:
-    Create a self-service package.
-    Create a managed package with self-service elevated privileges turned on.

With self-service enabled, you don’t install the entire Creative Cloud collection of apps.  Instead, students can install apps themselves using the Creative Cloud desktop app.  Here are some key benefits with this approach:
- The entire Creative Cloud install is about 25 GB.  If students install only the apps they need on-demand, this helps optimize disk space. Lab VMs have a disk size of 128 GB.
- You can choose to install a subset of the apps on the template VM before publishing.  This way the student VMs will have some apps installed by default and students can add more apps on their own as needed.
- You can avoid republishing the template VM because students can install additional apps on their VM at any point during the lifetime of the lab.  Otherwise, either IT or the teacher would need to install additional apps on the template VM and republish.  Republishing causes the students’ VMs to be reset and any work that isn’t saved externally is lost.

If you use a managed deployment package with self-service disabled, students won’t have the ability to install their own apps.  In this case, IT must specify the Creative Cloud apps that will be installed.

Read [Adobe’s steps to create a package](https://helpx.adobe.com/enterprise/admin-guide.html/enterprise/using/create-nul-packages.ug.html) for more information.

### Install Creative Cloud
After the template machine is created, follow the steps below to set up your lab’s template virtual machine (VM) with Creative Cloud.
1. Start the template VM and connect using RDP.
1. To install Creative Cloud, download the deployment package given to you by IT or directly from [Adobe’s Admin Console](https://adminconsole.adobe.com/).
1. Run the deployment package file.  Depending on whether self-service is enabled or disabled, this will install Creative Cloud desktop app and\or the specified Creative Cloud apps.
Read [Adobe’s deployment steps](https://helpx.adobe.com/enterprise/admin-guide.html/enterprise/using/deploy-packages.ug.html) for more information.
1. Once the template VM is set up, [publish the template VM’s image](how-to-create-manage-template.md) which is used to create all of the students’ VMs in the lab.

### Storage
As mentioned earlier, Azure Lab VMs have a disk size of 128 GB.  If your students need additional storage for saving large media assets or they need to access shared media assets, you should consider using external file storage.  For more information, read the following articles:
-    [Using external file storage in Lab Services](how-to-attach-external-storage.md)
-    [Install and configure OneDrive](./how-to-prepare-windows-template.md#install-and-configure-onedrive)

### Save template VM image
Consider saving your template VM for future use.  To save the template VM, see [save an image to Shared Image Gallery](./how-to-use-shared-image-gallery.md#save-an-image-to-the-shared-image-gallery).
- When self-service is *enabled*, the template VM’s image will have Creative Cloud desktop installed.  Teachers can then reuse this image to create labs and to choose which Creative Cloud apps to install.  This helps reduce IT overhead since teachers can independently set up labs and have full control over installing the Creative Cloud apps required for their classes.
- When self-service is *disabled*, the template VM’s image will already have the specified Creative Cloud apps installed.  Teachers can reuse this image to create labs; however, they won’t be able to install additional Creative Cloud apps.

## Cost

In this section, we’ll look at a possible cost estimate for this class.  We’ll use a class of 25 students with 20 hours of scheduled class time.  Also, each student gets 10 hours quota for homework or assignments outside scheduled class time. The virtual machine size we chose was **Small GPU (Visualization)**, which is 160 lab units.

25 students \* (20 scheduled hours + 10 quota hours) \* 160 Lab Units * 0.01 USD per hour = 1200.00 USD

>[!IMPORTANT]
> Cost estimate is for example purposes only.  For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).  

## Next steps

Next steps are common to setting up any lab.

- [Create and manage a template](how-to-create-manage-template.md)
- [Add users](tutorial-setup-classroom-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-classroom-lab.md#set-a-schedule-for-the-lab)
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users)