---
title: Set up a lab focused on deep learning using Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab to teach shell scripting on Linux. 
ms.topic: article
ms.date: 06/26/2020
---

# Set up a lab focused on deep learning in natural language processing using Azure Lab Services
This article shows you how to set up a lab focused on deep learning in natural language processing (NLP) using Azure Lab Services. Natural language processing (NLP) is a form of artificial intelligence (AI) that enables computers with translation, speech recognition, and other language understanding capabilities.  

Students taking an NLP class get a Linux virtual machine (VM) to learn how to apply neural network algorithms to develop deep learning models that are used for analyzing written human language. 

## Lab configuration
To set up this lab, you need an Azure subscription to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Once you have an Azure subscription, you can either create a new lab account in Azure Lab Services or use an existing lab account. See the following tutorial for creating a new lab account: [Tutorial to Setup a Lab Account](tutorial-setup-lab-account.md).
 
After you create the lab account, enable following settings in the lab account: 

| Lab account setting | Instructions |
| ----------- | ------------ |  
| Marketplace images | Enable the Data Science Virtual Machine for Linux (Ubuntu) image for use within your lab account.  See the following article for instructions: [Specify marketplace images available to lab creators](specify-marketplace-images.md). | 

Follow [this tutorial](tutorial-setup-classroom-lab.md) to create a new lab and apply the following settings:

| Lab settings | Value/instructions | 
| ------------ | ------------------ |
| Virtual machine (VM) size | **Small GPU (Compute)**. This size is best suited for compute-intensive and network-intensive applications like Artificial Intelligence and Deep Learning. |
| VM image | [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-1804). This image provides deep learning frameworks and tools for machine learning and data science. To view the full list of installed tools on this image, see the following article: [What’s included on the DSVM?](../machine-learning/data-science-virtual-machine/overview.md#whats-included-on-the-dsvm). |
| Enable remote desktop connection | <p>The Data Science image is already configured to use X2Go so that teachers and students can connect using a GUI remote desktop.  X2Go does *not* require the **Enable remote desktop connection** setting to be enabled.  This setting only needs to be enabled if you choose to instead use RDP.

>**Important**: Although we recommend using X2Go with the Data Science image, if you choose to instead use RDP, you will need to connect to the Linux VM using SSH the first time and install the RDP and GUI packages.  Then, you/students can connect to the Linux VM using RDP later.  For more information, see [Enable graphical remote desktop for Linux VMs](how-to-enable-remote-desktop-linux.md).

The Data Science Virtual Machine for Linux image provides the necessary deep learning frameworks and tools required for this type of class. As a result, after the template machine creation, you don't need to customize it further. It can be published for students to use. Select the **Publish** button on template page to publish the template to the lab.  

## Cost
If you would like to estimate the cost of this lab, you can use the following example: 

For a class of 25 students with 20 hours of scheduled class time and 10 hours of quota for homework or assignments, the price for the lab would be - 
25 students * (20 + 10) hours * 139 Lab Units * 0.01 USD per hour = 1042.5 USD

Further more details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Conclusion
This article walked you through the steps to create a lab for natural language processing class. You can use a similar setup for other deep learning classes.

## Next steps
Next steps are common to setting up any lab:

- [Add users](tutorial-setup-classroom-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-classroom-lab.md#set-a-schedule-for-the-lab) 
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users). 

