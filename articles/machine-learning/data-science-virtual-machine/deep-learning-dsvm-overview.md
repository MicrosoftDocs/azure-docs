---
title: Introduction to the Deep Learning Virtual Machine - Azure | Microsoft Docs
description: Key analytics scenarios and components for Deep Learning  Virtual Machines.
keywords: deep learning, AI, data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
documentationcenter: ''
author: gopitk
manager: cgronlun


ms.assetid: d4f91270-dbd2-4290-ab2b-b7bfad0b2703
ms.service: machine-learning
ms.subservice: data-science-vm
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/16/2018
ms.author: gokuma

---

# Introduction to the Deep Learning Virtual Machine

## Why Deep Learning Virtual Machine? 

Increasingly,  deep learning algorithms / deep neural networks are becoming one of the popular methods employed in many machine learning problems. They are especially good at machine cognition tasks like image, text, audio/video understanding often approaching human cognitive levels in some specific domains with advanced deep neural network architectures and access to large set of data to train models. Deep learning requires large amount of computational power to train models with these large datasets. With the cloud and availability of Graphical Processing Units (GPUs),  it is becoming possible to build sophisticated deep neural architectures and train them on a large data set on powerful computing infrastructure on the cloud.  The [Data Science Virtual Machine](overview.md) has provided a rich set of tools and samples for data preparation, machine learning, and deep learning. But one of the challenges faced by the users is to discover the tools and samples for specific scenarios like deep learning easily and also more easily provision GPU-based VM instances. This Deep Learning Virtual Machine (DLVM) addresses these challenges. 

## What is Deep Learning Virtual Machine? 
The Deep Learning Virtual Machine is a specially configured variant of the [Data Science Virtual Machine](overview.md) (DSVM) to make it more straightforward to use GPU-based VM instances for training deep learning models. It is supported on Windows 2016 and the Ubuntu Data Science Virtual Machine.  It shares the same core VM images (and hence all the rich toolset) as the DSVM but is configured to make deep learning easier. We also provide end-to-end samples for image and text understanding, that are broadly applicable to many real life AI scenarios. The deep learning virtual machine also tries to make the rich set of tools and samples on the DSVM more easily discoverable by surfacing a catalog of the tools and samples on the virtual machine. In terms of the tooling, the Deep Learning Virtual Machine provides several popular deep learning frameworks, tools to acquire and pre-process image, textual data. For a comprehensive list of tools, you can refer to the [Data Science Virtual Machine Overview Page](overview.md#whats-included-in-the-data-science-vm). 

## Next Steps

Get started with the Deep Learning Virtual Machine with the following steps:

* [Provision a Deep Learning Virtual Machine](provision-deep-learning-dsvm.md)
* [Use the Deep Learning Virtual Machine](use-deep-learning-dsvm.md)
* [Tool Reference](dsvm-deep-learning-ai-frameworks.md)
* [Samples](dsvm-samples-and-walkthroughs.md)
