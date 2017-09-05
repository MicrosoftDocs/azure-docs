---
title: Get started with a Linux Data Science Virtual Machine on Azure | Microsoft Docs
description: Key analytics scenarios and components for Windows and Linux Data Science Virtual Machines.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
documentationcenter: ''
author: bradsev
manager: cgronlun
editor: cgronlun

ms.assetid: d4f91270-dbd2-4290-ab2b-b7bfad0b2703
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/04/2017
ms.author: gokuma;bradsev

---

# Get started with a Linux Data Science Virtual Machine on Azure

The Data Science Virtual Machine (DSVM) is a customized VM image on Microsoft’s Azure cloud built specifically for doing data science. It has many popular data science and other tools pre-installed and pre-configured to jump-start building intelligent applications for advanced analytics. It is available on Windows Server and on Linux. We offer Linux version of DSVM on Ubuntu and OpenLogic CentOS. To create an instance of the desired version of Linux DSVM:


* Navigate to one of the following:
  * [Ubuntu based DSVM](http://aka.ms/dsvm/ubuntu)
  * [OpenLogic CentOS based DSVM](http://aka.ms/dsvm/centos)
* Click the **Get it now** button.
* Sign in to the VM from an SSH client, such as Putty or SSH Command, using the credentials you specified when you created the VM.
* In the shell prompt, enter dsvm-more-info.
* For a graphical desktop, download the X2Go client for your client platform [here](http://wiki.x2go.org/doku.php/doc:installation:x2goclient) and follow the instructions in the Linux Data Science VM document [Installing and configuring X2Go client](linux-dsvm-intro.md#installing-and-configuring-x2go-client).

## Next steps

* For more information on how to run specific tools available on the Linux version, see [Provision a Linux Data Science Virtual Machine](linux-dsvm-intro.md).
* For a walkthrough that shows you how to perform several common data science tasks with the Linux VM, see [Data science on the Linux Data Science Virtual Machine](linux-dsvm-walkthrough.md).

