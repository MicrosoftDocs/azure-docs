---
title: Install RStudio with R Server on HDInsight - Azure | Microsoft Docs
description: How to install RStudio with R Server on HDInsight.
services: hdinsight
documentationcenter: ''
author: jeffstokes72
manager: jhubbard
editor: cgronlun

ms.assetid: 918abb0d-8248-4bc5-98dc-089c0e007d49
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 02/28/2017
ms.author: jeffstok

---
# Installing RStudio with R Server on HDInsight
There are multiple integrated development environments (IDE) available for R today, including Microsoft’s recently announced [R Tools for Visual Studio](https://www.visualstudio.com/en-us/features/rtvs-vs.aspx) (RTVS), a family of desktop and server tools from [RStudio](https://www.rstudio.com/products/rstudio-server/), or Walware’s Eclipse-based [StatET](http://www.walware.de/goto/statet). Among the most popular on Linux is the use of [RStudio Server](https://www.rstudio.com/products/rstudio-server/) that provides a browser-based IDE for use by remote clients.  Installing RStudio Server on the edge node of an HDInsight cluster provides a full IDE experience for the development and execution of R scripts with R Server on the cluster, and can be considerably more productive than default use of the R Console.

> [!NOTE]
> The procedure described in this article is only relevant if you did not select to install RStudio Server community edition when provisioning your cluster.  If you added it during provisioning then you access it by clicking on the **R Server Dashboards** tile in the Azure Portal entry for your cluster and then on the **R Studio Server** tile. 

In this article you will learn how to install the community (free) version of RStudio Server on the edge node of a cluster by using a custom script. If you prefer the commercially licensed Pro version of RStudio Server, you must follow the installation instructions from [RStudio Server](https://www.rstudio.com/products/rstudio/download-server/).

> [!NOTE]
> The steps in this document require an R Server on HDInsight cluster and will not work correctly if you are using an HDInsight cluster where R was installed using the [Install R Script Action](hdinsight-hadoop-r-scripts-linux.md).
>
> 

## Prerequisites
* An Azure HDInsight cluster with R Server installed. For instructions, see [Get started with R Server on HDInsight clusters](hdinsight-hadoop-r-server-get-started.md).
* An SSH client. For Linux and Unix distributions or Macintosh OS X, the `ssh` command is provided with the operating system. For Windows, we recommend [Cygwin](http://www.redhat.com/services/custom/cygwin/) with the [OpenSSH option](https://www.youtube.com/watch?v=CwYSvvGaiWU), or [PuTTY](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).  

## Install RStudio on the cluster using a custom script
1. Identify the edge node of the cluster. For an HDInsight cluster with R Server, following is the naming convention for head node and edge node.

   * Head node `CLUSTERNAME-ssh.azurehdinsight.net`
   * Edge node `CLUSTERNAME-ed-ssh.azurehdinsight.net` 
2. SSH into the edge node of the cluster using the above naming pattern. For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

3. Once you are connected, become a root user on the cluster. In the SSH session, use the following command.

        sudo su -
4. Download the custom script to install RStudio. Use the following command.

        wget http://mrsactionscripts.blob.core.windows.net/rstudio-server-community-v01/InstallRStudio.sh
5. Change the permissions on the custom script file and run the script. Use the following commands.

        chmod 755 InstallRStudio.sh
        ./InstallRStudio.sh
6. If you used an SSH password while creating an HDInsight cluster with R Server, you can skip this step and proceed to the next. If you used an SSH key instead to create the cluster, you must set a password for your SSH user. You will need this password when connecting to RStudio. Run the following commands. When prompted for **Current Kerberos password**, just press **ENTER**.  Note that you must replace `USERNAME` with an SSH user for your HDInsight cluster.

        passwd USERNAME
        Current Kerberos password:
        New password:
        Retype new password:
        Current Kerberos password:

    If your password is successfully set, you should see a message like this.

        passwd: password updated successfully

    Exit the SSH session.

7. Create an SSH tunnel to the cluster by mapping `ssh -L localhost:8787:localhost:8787 USERNAME@CLUSTERNAME-ed-ssh.azurehdinsight.net` on the HDInsight cluster to the client machine. You must create an SSH tunnel before opening a new browser session.

   * On a Linux client or a Windows client with [Cygwin](http://www.redhat.com/services/custom/cygwin/) then open a terminal session and use the following command.

           ssh -L localhost:8787:localhost:8787 USERNAME@CLUSTERNAME-ed-ssh.azurehdinsight.net

       Replace **USERNAME** with an SSH user for your HDInsight cluster, and replace **CLUSTERNAME** with the name of your HDInsight cluster
       You can also use a SSH key rather than a password by adding `-i id_rsa_key`        
   * If using a Windows client with PuTTY then

     1. Open PuTTY, and enter your connection information.
     2. In the **Category** section to the left of the dialog, expand **Connection**, expand **SSH**, and then select **Tunnels**.
     3. Provide the following information on the **Options controlling SSH port forwarding** form:

        * **Source port** - The port on the client that you wish to forward. For example, **8787**.
        * **Destination** - The destination that must be mapped to the local client machine. For example, **localhost:8787**.

        ![Create an SSH tunnel](./media/hdinsight-hadoop-r-server-install-r-studio/createsshtunnel.png "Create an SSH tunnel")
     4. Click **Add** to add the settings, and then click **Open** to open an SSH connection.
     5. When prompted, log in to the server. This will establish an SSH session and enable the tunnel.
8. Open a web browser and enter the following URL based on the port you entered for the tunnel.

        http://localhost:8787/ 
9. You will be prompted to enter the SSH username and password to connect to the cluster. If you used an SSH key while creating the cluster, you must enter the password you created in step 5 above.

    ![Connect to R Studio](./media/hdinsight-hadoop-r-server-install-r-studio/connecttostudio.png "Create an SSH tunnel")
10. To test whether the RStudio installation was successful, you can run a test script that executes R based MapReduce and Spark jobs on the cluster. Go back to the SSH console and enter the following commands to download the test script to run in RStudio.

*    If you created a Hadoop cluster with R, use this command.

           wget http://mrsactionscripts.blob.core.windows.net/rstudio-server-community-v01/testhdi.r
*    If you created a Spark cluster with R, use this command.

                    wget http://mrsactionscripts.blob.core.windows.net/rstudio-server-community-v01/testhdi_spark.r
11. In RStudio, you will see the test script you downloaded. Double click the file to open it, select the contents of the file, and then click **Run**. You should see the output in the **Console** pane.

   ![Test the installation](./media/hdinsight-hadoop-r-server-install-r-studio/test-r-script.png "Test the installation")

Another option would be to type `source(testhdi.r)` or `source(testhdi_spark.r)` to execute the script.

## See also
* [Compute context options for R Server on HDInsight clusters](hdinsight-hadoop-r-server-compute-contexts.md)
* [Azure Storage options for R Server on HDInsight](hdinsight-hadoop-r-server-storage.md)

