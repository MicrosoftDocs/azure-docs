---
title: Example class types on Azure Lab Services | Microsoft Docs
description: Provides some types of classes for which you can set up labs using Azure Lab Services. 
services: lab-services
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/30/2019
ms.author: spelluru

---
# Class types overview - Azure Lab Services

Azure Lab Services enables you to quickly set up classroom lab environments in the cloud. Articles in this section provide guidance on how to set up several types of classroom labs using Azure Lab Services.

## Deep learning in natural language processing

You can set up a lab focused on deep learning in natural language processing (NLP) using Azure Lab Services. Natural language processing (NLP) is a form of artificial intelligence (AI) that enables computers with translation, speech recognition, and other language understanding capabilities. Students taking an NLP class get a Linux virtual machine (VM) to learn how to apply neural network algorithms to develop deep learning models that are used for analyzing written human language.

For detailed information on how to set up this type of lab, see [Set up a lab focused on deep learning in natural language processing using Azure Lab Services](class-type-deep-learning-natural-processing.md).

## Shell scripting on Linux

You can set up a lab to teach shell scripting on Linux. Scripting is a useful part of system administration that allows administrators to avoid repetitive tasks. In this sample scenario, the class covers traditional bash scripts and enhanced scripts. Enhanced scripts are scripts that combine bash commands and Ruby. This approach allows Ruby to pass data around and bash commands to interact with the shell.

Students taking these scripting classes get a Linux virtual machine to learn the basics of Linux, and also get familiar with the bash shell scripting. The Linux virtual machine comes with remote desktop access enabled and with [gedit](https://help.gnome.org/users/gedit/stable/) and [Visual Studio Code](https://code.visualstudio.com/) text editors installed.

For detailed information on how to set up this type of lab, see [Shell scripting on Linux](class-type-shell-scripting-linux.md).

## Ethical hacking

You can set up a lab for a class that focuses on forensics side of ethical hacking. Penetration testing, a practice used by the ethical hacking community, occurs when someone attempts to gain access to the system or network to demonstrate vulnerabilities that a malicious attacker may exploit.

In an ethical hacking class, students can learn modern techniques for defending against vulnerabilities. Each student gets a Windows Server host virtual machine that has two nested virtual machines – one virtual machine with [Metasploitable3](https://github.com/rapid7/metasploitable3) image and another machine with [Kali Linux](https://www.kali.org/) image. The Metasploitable virtual machine is used for exploiting purposes.  The Kali Linux virtual machine provides access to the tools needed to execute forensic tasks.

For detailed information on how to set up this type of lab, see [Set up a lab to teach ethical hacking class](class-type-ethical-hacking.md).

## Database management
Databases concepts are one of the introductory courses taught in most of the Computer Science departments in college. You can set up a lab for a basic databases management class in Azure Lab Services. For example, you can set up a virtual machine template in a lab with a [MySQL](https://www.mysql.com/) Database Server or a [SQL Server 2019](https://www.microsoft.com/sql-server/sql-server-2019) server.

For detailed information on how to set up this type of lab, see [Set up a lab to teach database management for relational databases](class-type-database-management.md).

## Python and Jupyter notebooks
You can set up a template machine in Azure Lab Services with the tools needed to teach students how to use [Jupyter Notebooks](http://jupyter-notebook.readthedocs.io). Jupyter Notebooks is an open-source project that lets you easily combine rich text and executable [Python](https://www.python.org/) source code on a single canvas called a notebook. Running a notebook results in a linear record of inputs and outputs.  Those outputs can include text, tables of information, scatter plots, and more.

For detailed information on how to set up this type of lab, see [Set up a lab to teach data science with Python and Jupyter Notebooks](class-type-jupyter-notebook.md).

## Mobile app development with Android Studio
You can set up a lab in Azure Lab Services to teach an introductory mobile application development class. This class focuses on Android mobile applications that can be published to the [Google Play Store](https://play.google.com/store/apps).  Students learn how to use [Android Studio](https://developer.android.com/studio) to build applications.  [Visual Studio Emulator for Android](https://visualstudio.microsoft.com/vs/msft-android-emulator/) is used to test the application locally.

For detailed information on how to set up this type of lab, see [Set up a lab to teach mobile application development with Android Studio](class-type-mobile-dev-android-studio.md).


## Next steps

See the following articles:

- [Set up a lab focused on deep learning in natural language processing using Azure Lab Services](class-type-deep-learning-natural-processing.md)
- [Shell scripting on Linux](class-type-shell-scripting-linux.md)
- [Ethical hacking](class-type-ethical-hacking.md)