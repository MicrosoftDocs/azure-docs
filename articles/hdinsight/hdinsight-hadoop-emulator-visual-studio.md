<properties
pageTitle="Use the Microsoft Azure Data Lake Tools for Visual Studio with the Hortonworks Sandbox"
description="Learn how to use the Azure Data Lake Tools for VIsual Studio with the Hortonworks sandbox (running in a local VM.) With these tools, you can create and run Hive and Pig jobs on the sandbox and view job output and history."
services="hdinsight"
documentationCenter=""
authors="Blackmist"
manager="paulettm"
editor="cgronlun"/>

<tags
ms.service="hdinsight"
ms.devlang=""
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="big-data"
ms.date="08/24/2016"
ms.author="larryfr"/>

# Use the Azure Data Lake Tools for Visual Studio with the Hortonworks Sandbox

The Azure Data Lake tools for Visual Studio include tools for working with generic Hadoop clusters, in addition to tools for working with Azure Data Lake and HDInsight. This document provides the steps needed to use the Azure Data Lake tools with the Hortonworks Sandbox running in a local virtual machine.

## Prerequisites

* The Hortonworks Sandbox running in a virtual machine on your development environment. This document was written and tested with the sandbox running in Oracle VirtualBox, which was configured using the information in the [Get started in the Hadoop ecosystem](hdinsight-hadoop-emulator-get-started.md) document.

* Visual Studio 2013 or 2015

* The [Azure SDK for .NET](https://azure.microsoft.com/en-us/downloads/) 2.7.1 or higher

* [Azure Data Lake Tools for Visual Studio](https://www.microsoft.com/en-us/download/details.aspx?id=49504)

## Configure passwords for the sandbox

Make sure that the Hortonworks Sandbox is running, then follow the steps in [Get started in the Hadoop ecosystem](hdinsight-hadoop-emulator-get-started.md#set-passwords) to configure the password for the SSH `root` account, and the Ambari `admin` account. These passwords will be used when connecting to the sandbox from Visual Studio.

## Connect the tools to the sandbox

1. Open Visual Studio, and select __View__, then __Server Explorer__.

2. From __Server Explorer__, right click the __HDInsight__ entry, and then select __Connect to HDInsight Emulator__.

3. From the __Connect to HDInsight Emulator__ dialog, enter the password that you configured for Ambari. 

    Select __Next__ to continue.

4. Enter a __Friendly Name__ for the emulator, then use the __Password__ field to enter the password you configured for the `root` account. Leave the other fields at the default value.

    Select __Next__ to continue.

5. Wait for validation of the services to complete. In some cases, validation may fail and prompt you to update the configuration. When this happens, select the __update__ button and wait for the configuration and verification for the service to complete.

    Once validation has completed, select __Finish__ to complete configuration.

    > [AZURE.NOTE] Depending on the speed of your development environment, and the amount of memory allocated to the virtual machine, it can take several minutes to configure and validate the services.

## Write a Hive query

1. In __Server Explorer__, right-click on the entry for the local cluster that you added previously, and then select __Write a Hive query__.

2. In the new query window, enter the following:

        select count(*) from sample_08;
    
    From the top of the query window, make sure that configuration for the local cluster is selected, and then select __Submit__. Leave the other values (__Batch__ and server name,) at the default values.

3. Once you submit the query, the job status will appear. This provides information on the job as it is processed by Hadoop. Once the __Job Status__ changes to __Finished__, use the __Job Output__ link to view the output.

    You can view other information about the job by using the __Job Log__, and you can download the YARN logs using the __Download YARN Log__ link.



