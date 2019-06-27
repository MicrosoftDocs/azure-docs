---
title: Learn using an Apache Hadoop sandbox - emulator - Azure HDInsight 
description: 'To start learning about using the Apache Hadoop ecosystem, you can set up a Hadoop sandbox from Hortonworks on an Azure virtual machine. '
keywords: hadoop emulator,hadoop sandbox
ms.reviewer: jasonh
author: hrasheed-msft

ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 05/29/2019
ms.author: hrasheed

---
# Get started with an Apache Hadoop sandbox, an emulator on a virtual machine

Learn how to install the Apache Hadoop sandbox from Hortonworks on a virtual machine to learn about the Hadoop ecosystem. The sandbox provides a local development environment to learn about Hadoop, Hadoop Distributed File System (HDFS), and job submission. Once you are familiar with Hadoop, you can start using Hadoop on Azure by creating an HDInsight cluster. For more information on how to get started, see [Get started with Hadoop on HDInsight](apache-hadoop-linux-tutorial-get-started.md).

## Prerequisites
* [Oracle VirtualBox](https://www.virtualbox.org/). Download and install it from [here](https://www.virtualbox.org/wiki/Downloads).


## Download and install the virtual machine
1. Browse to the [Cloudera downloads](https://www.cloudera.com/downloads/hortonworks-sandbox/hdp.html).

2. Click **VIRTUALBOX** under **Choose Installation Type** to download the latest Hortonworks Sandbox on a VM. Sign in or complete the product interest form.

1. Click the button **HDP SANDBOX (LATEST)** to begin the download.

For instructions on setting up the sandbox, see [Sandbox Deployment and Install Guide](https://hortonworks.com/tutorial/sandbox-deployment-and-install-guide/section/1/).

To download an older HDP version sandbox, see the links under **Older Versions**.

## Start the virtual machine

1. Open Oracle VM VirtualBox.
2. From the **File** menu, click **Import Appliance**, and then specify the Hortonworks Sandbox image.
1. Select the Hortonworks Sandbox, click **Start**, and then **Normal Start**. Once the virtual machine has finished the boot process, it displays login instructions.

    ![Normal start](./media/apache-hadoop-emulator-get-started/normal-start.png)
2. Open a web browser and navigate to the URL displayed (usually `http://127.0.0.1:8888`).

## Set Sandbox passwords

1. From the **get started** step of the Hortonworks Sandbox page, select **View Advanced Options**. Use the information on this page to log in to the sandbox using SSH. Use the name and password provided.

   > [!NOTE]
   > If you do not have an SSH client installed, you can use the web-based SSH provided at by the virtual machine at **http://localhost:4200/**.

    The first time you connect using SSH, you are prompted to change the password for the root account. Enter a new password, which you use when you log in using SSH.

2. Once logged in, enter the following command:

        ambari-admin-password-reset

    When prompted, provide a password for the Ambari admin account. This is used when you access the Ambari Web UI.

## Use Hive commands

1. From an SSH connection to the sandbox, use the following command to start the Hive shell:

        hive
2. Once the shell has started, use the following to view the tables that are provided with the sandbox:

        show tables;
3. Use the following to retrieve 10 rows from the `sample_07` table:

        select * from sample_07 limit 10;

## Next steps
* [Learn how to use Visual Studio with the Hortonworks Sandbox](../hdinsight-hadoop-emulator-visual-studio.md)
* [Learning the ropes of the Hortonworks Sandbox](https://hortonworks.com/hadoop-tutorial/learning-the-ropes-of-the-hortonworks-sandbox/)
* [Hadoop tutorial - Getting started with HDP](https://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig/)

