---
title: Set up a lab focused on deep learning using Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab focused on deep learning in natural language processing (NLP) using Azure Lab Services. 
ms.topic: how-to
ms.date: 07/04/2022
ms.custom: devdivchpfy22
---

# Set up a lab focused on deep learning in natural language processing using Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article shows you how to set up a lab focused on deep learning in Natural Language Processing (NLP) using Azure Lab Services. NLP is a form of Artificial Intelligence (AI) that enables computers with translation, speech recognition, and other language understanding capabilities.  

Students taking an NLP class get a Linux virtual machine (VM) to learn how to apply neural network algorithms. The algorithms teach students to develop deep learning models that are used for analyzing written human language.

## Lab configuration

To set up this lab, you need an Azure subscription and lab account to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

Once you have an Azure subscription, you can create a new lab plan in Azure Lab Services. For more information about creating a new lab plan, see the tutorial on [how to set up a lab plan](./quick-create-resources.md). You can also use an existing lab plan.

### Lab plan settings

Enable the settings described in the table below for the lab plan. For more information about how to enable marketplace images, see the article on [how to specify Marketplace images available to lab creators](./specify-marketplace-images.md).

| Lab plan setting | Instructions |
| ----------- | ------------ |  
| Marketplace images | Enable the Data Science Virtual Machine for Linux (Ubuntu) image. |

### Lab settings

For instructions on how to create a lab, see [Tutorial: Set up a lab](tutorial-setup-lab.md). Use the following settings when creating the lab:

| Lab settings | Value |
| ------------ | ------------------ |
| Virtual machine (VM) size | **Small GPU (Compute)**. This size is best suited for compute-intensive and network-intensive applications like Artificial Intelligence and Deep Learning. |
| VM image | [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/marketplace/apps?search=Data%20science%20Virtual%20machine&page=1&filters=microsoft%3Blinux). This image provides deep learning frameworks and tools for machine learning and data science. To view the full list of installed tools on this image, see [What's included on the DSVM?](../machine-learning/data-science-virtual-machine/overview.md#whats-included-on-the-dsvm). |
| Enable remote desktop connection | Optionally, check **Enable remote desktop connection**. The Data Science image is already configured to use X2Go so that teachers and students can connect using a GUI remote desktop. X2Go *doesn't* require the **Enable remote desktop connection** setting to be enabled. |
| Template Virtual Machine Settings | Optionally, choose **Use a virtual machine image without customization**. If you're using the [August 2022 Update](lab-services-whats-new.md) and the DSVM has all the tools that your class requires, you can skip the template customization step. |

> [!IMPORTANT]
> We recommend that you use the X2Go with the Data Science image. However, if you choose to use RDP instead, you'll need to connect to the Linux VM using SSH and install the RDP and GUI packages before publishing the lab. Then, students can connect to the Linux VM using RDP later. For more information, see [Enable graphical remote desktop for Linux VMs](how-to-enable-remote-desktop-linux.md).

## Template machine configuration

The Data Science Virtual Machine for Linux image provides the necessary deep learning frameworks and tools required for this type of class. If you chose **Use a virtual machine image without customization** when creating the lab, the ability to customize the template machine will be disabled. You can [publish the lab](tutorial-setup-lab.md#publish-lab) when you're ready.

## Cost

Let's cover a possible cost estimate for this class. The virtual machine size we chose was Small GPU (Compute), which is 139 lab units.

For a class of 25 students with 20 hours of scheduled class time and 10 hours of quota for homework or assignments, the cost estimate would be:

25 students \* (20 scheduled hours + 10 quota hours) \* 139 Lab Units \* 0.01 USD per hour = 1042.5 USD

>[!IMPORTANT]
> Cost estimate is for example purposes only. For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).  

## Conclusion

This article walked you through the steps to create a lab for Natural Language Processing class. You can use a similar setup for other deep learning classes.

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]
