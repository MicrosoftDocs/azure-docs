---
title: Set up a lab to teach data science with Python and Jupyter Notebooks | Microsoft Docs
description: Learn how to set up a lab to teach data science using Python and Jupyter Notebooks. 
services: lab-services
documentationcenter: na
author: emaher
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/19/2019
ms.author: enewman

---
# Set up a lab to teach data science with Python and Jupyter Notebooks

This article outlines how to set up a template machine in Lab Services with the tools needed to teach students how to use [Jupyter Notebooks](http://jupyter-notebook.readthedocs.io).  Jupyter Notebooks is an open-source project that lets you easily combine rich text and executable [Python](https://www.python.org/) source code on a single canvas called a notebook.  Running a notebook results in a linear record of inputs and outputs.  Those outputs can include text, tables of information, scatter plots, and more.

## Lab configuration

To set up this lab, you need an Azure subscription and lab account to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Once you get an Azure subscription, you can create a new lab account in Azure Lab Services. For more information about creating a new lab account, see [tutorial to setup a lab account](tutorial-setup-lab-account.md).  You can also use an existing lab account.

### Lab Account Settings

Enable the settings described in the table below for the lab account. For more information about how to enable marketplace images, see [specify Marketplace images available to lab creators](specify-marketplace-images.md).

| Lab account setting | Instructions |
| ------------------- | ------------ |
| Marketplace image | Enable the [Data Science Virtual Machine - Windows 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019) image for use within your lab account. |

>[!TIP]
>This article will focus on configuring a template machine that uses the Windows Server operating system.  It's also possible to set up a data science class with Python and Jupyter Notebooks using [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.linux-data-science-vm-ubuntu) images from the Azure Marketplace.

### Lab settings

Use the settings in the table below when setting up a classroom lab.  For more information how to create a classroom lab, see [set up a classroom lab tutorial](tutorial-setup-classroom-lab.md).

| Lab settings | Value/instructions |
| ------------ | ------------------ |
|Virtual Machine Size| Small GPU (Compute). This size is best suited for compute-intensive and network-intensive applications like Artificial Intelligence and Deep Learning. |
|Virtual Machine Image| Data Science Virtual Machine - Windows 2016|

## Template machine

The [Data Science Virtual Machine - Windows 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019) image provides the necessary deep learning frameworks and tools required for this type of class.  The image includes Jupyter Notebooks and Visual Studio Code.  [Jupyter Notebooks](http://jupyter-notebook.readthedocs.io) is a web application that allows data scientists to take raw data, run computations, and see the results all in the same environment.  For our template machine, the web application will be running locally.  [Visual Studio Code](https://code.visualstudio.com/) is an IDE that provides a rich interactive experience when writing and testing a notebook.  For more information, see [Working with Jupyter Notebooks in Visual Studio Code](https://code.visualstudio.com/docs/python/jupyter-support).

The remaining task to set up the class is to provide local notebooks.  For instructions how to use the Azure Machine Learning samples, see [how to configure an environment with Jupyter Notebooks](../../machine-learning/how-to-configure-environment.md#jupyter).  You can also provide your own notebooks on the template machine.  The notebooks will be copied to all student machines when the template is published.

## Cost estimate

Let's cover a possible cost estimate for this class.  We'll use a class of 25 students.  There are 20 hours of scheduled class time.  Also, each student gets 10 hours quota for homework or assignments outside scheduled class time.  The virtual machine size we chose was small GPU (compute), which is 139 lab units.

Here is an example of a possible cost estimate for this class:

25 students \* (20 scheduled hours + 10 quota hours) \* 139 lab units \*  0.01 USD per hour  = 1042.5 USD

Further more details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Conclusion

In this article, we walked through the steps to create a lab for a Jupyter Notebooks class. You can use a similar setup for other machine learning classes.

## Next steps

Next steps are common to setting up any lab.

- [Create and manage a template](how-to-create-manage-template.md)
- [Add users](tutorial-setup-classroom-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-classroom-lab.md#set-a-schedule-for-the-lab)
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users)
