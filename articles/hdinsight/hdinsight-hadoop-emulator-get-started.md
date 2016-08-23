<properties
	pageTitle="Use a Hadoop sandbox to learn about Hadoop | Microsoft Azure"
	description="To start learning about using the Hadoop ecosystem, you can set up a Hadoop sandbox from Hortonworks on an Azure virtual machine. "
	keywords="hadoop emulator,hadoop sandbox"
	editor="cgronlun"
	manager="paulettm"
	services="hdinsight"
	authors="nitinme"
	documentationCenter=""
	tags="azure-portal"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/05/2016"
	ms.author="nitinme"/>

# Get started in the Hadoop ecosystem with a Hadoop sandbox on a virtual machine

Learn how to install the Hadoop sandbox from Hortonworks on a virtual machine to learn about the Hadoop ecosystem. The sandbox provides a local development environment to learn about Hadoop, Hadoop Distributed File System (HDFS), and job submission.

## Prerequisites

* [Oracle VirtualBox](https://www.virtualbox.org/)

Once you are familiar with Hadoop, you can start using Hadoop on Azure by creating an HDInsight cluster. For more information on how to get started, see [Get started with Hadoop on HDInsight](hdinsight-hadoop-linux-tutorial-get-started.md).

## Download and install the virtual machine

1. From [http://hortonworks.com/downloads/#sandbox](http://hortonworks.com/downloads/#sandbox), select the __DOWNLOAD FOR VIRTUALBOX__ item for HDP 2.4 on Hortonworks Sandbox. You will be prompted to register with Hortonworks before the download begins.

2. From the same web page, select the __VirtualBox Install Guide__ for HDP 2.4 on Hortonworks Sandbox. This will download a PDF containing installation instructions for the virtual machine.

## Start the virtual machine

1. Start VirtualBox, select the Hortonworks Sandbox, select __Start__, and then __Normal Start__.

2. Once the virtual machine has finished the boot process, it will display login instructions.

## Create a local cluster