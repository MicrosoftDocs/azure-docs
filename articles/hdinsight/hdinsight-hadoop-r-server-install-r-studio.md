<properties
	pageTitle="Install RStudio with R Server on HDInsight (preview) | Microsoft Azure"
	description="How to install RStudio with R Server on HDInsight (preview)."
	services="hdinsight"
	documentationCenter=""
	authors="jeffstokes72"
	manager="paulettm"
	editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="05/24/2016"
   ms.author="jeffstok"/>


# Installing RStudio with R Server on HDInsight (preview)

There are multiple integrated development environments (IDE) available for R today, including Microsoft’s recently announced [R Tools for Visual Studio](https://www.visualstudio.com/en-us/features/rtvs-vs.aspx) (RTVS), a family of desktop and server tools from [RStudio](https://www.rstudio.com/products/rstudio-server/), or Walware’s Eclipse-based [StatET](http://www.walware.de/goto/statet). Among the most popular on Linux is the use of [RStudio Server](https://www.rstudio.com/products/rstudio-server/) that provides a browser-based IDE for use by remote clients.  Installing RStudio Server on the edge node of an HDInsight Premium cluster provides a full IDE experience for the development and execution of R scripts with R Server on the cluster, and can be considerably more productive than default use of the R Console.

In this article you will learn how to install the community (free) version of RStudio Server on the edge node of a cluster by using a custom script. If you prefer the commercially licensed Pro version of RStudio Server, you must follow the installation instructions from [RStudio Server](https://www.rstudio.com/products/rstudio/download-server/).

> [AZURE.NOTE] The steps in this document require an R Server on HDInsight cluster and will not work correctly if you are using an HDInsight cluster where R was installed using the [Install R Script Action](hdinsight-hadoop-r-scripts-linux.md).

## Prerequisites

* An Azure HDInsight cluster with R Server installed. For instructions, see [Get started with R Server on HDInsight clusters](hdinsight-hadoop-r-server-get-started.md).
* An SSH client. For Linux and Unix distributions or Macintosh OS X, the `ssh` command is provided with the operating system. For Windows, we recommend [PuTTY](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html). 


## Install RStudio on the cluster using a custom script

1. Identify the edge node of the cluster. For an HDInsight cluster with R Server, following is the naming convention for head node and edge node.

	* Head node - `CLUSTERNAME-ssh.azurehdinsight.net`
	* Edge node - `r-server.CLUSTERNAME-ssh.azurehdinsight.net` 

3. SSH into the edge node of the cluster using the above naming pattern. 
 
	* If you are connecting from a Linux client, see [Connect to a Linux-based HDInsight cluster](hdinsight-hadoop-linux-use-ssh-unix.md#connect-to-a-linux-based-hdinsight-cluster).
	* If you are connecting from a Windows client, see [Connect to a Linux-based HDInsight cluster using PuTTY](hdinsight-hadoop-linux-use-ssh-windows.md#connect-to-a-linux-based-hdinsight-cluster).

2. Once you are connected, become a root user on the cluster. In the SSH session, use the following command.

		sudo su -

3. Download the custom script to install RStudio. Use the following command.

		wget http://mrsactionscripts.blob.core.windows.net/rstudio-server-community-v01/InstallRStudio.sh

4. Change the permissions on the custom script file and run the script. Use the following commands.

		chmod 755 InstallRStudio.sh
		./InstallRStudio.sh

5. If you used an SSH password while creating an HDInsight cluster with R Server, you can skip this step and proceed to the next. If you used an SSH key instead to create the cluster, you must set a password for your SSH user. You will need this password when connecting to RStudio. Run the following commands. When prompted for **Current Kerberos password**, just press **ENTER**.

		passwd remoteuser
		Current Kerberos password:
		New password:
		Retype new password:
		Current Kerberos password:
		
	If your password is successfully set, you should see a message like this.

		passwd: password updated successfully


	Exit the SSH session.

6. Create an SSH tunnel to the cluster by mapping `localhost:8787` on the HDInsight cluster to the client machine. You must create an SSH tunnel before opening a new browser session.

	* On a Linux client or a Windows client (using [Cygwin](http://www.redhat.com/services/custom/cygwin/)), open a terminal session and use the following command.

			ssh -L localhost:8787:localhost:8787 USERNAME@r-server.CLUSTERNAME-ssh.azurehdinsight.net
			
		Replace **USERNAME** with an SSH user for your HDInsight cluster, and replace **CLUSTERNAME** with the name of your HDInsight cluster		

	* On a Windows client create an SSH tunnel PuTTY.

		1.  Open PuTTY, and enter your connection information. If you are not familiar with PuTTY, see [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md) for information on how to use it with HDInsight.
		2.  In the **Category** section to the left of the dialog, expand **Connection**, expand **SSH**, and then select **Tunnels**.
		3.  Provide the following information on the **Options controlling SSH port forwarding** form:

			* **Source port** - The port on the client that you wish to forward. For example, **8787**.
			* **Destination** - The destination that must be mapped to the local client machine. For example, **localhost:8787**.

			![Create an SSH tunnel](./media/hdinsight-hadoop-r-server-install-r-studio/createsshtunnel.png "Create an SSH tunnel")

		4. Click **Add** to add the settings, and then click **Open** to open an SSH connection.
		5. When prompted, log in to the server. This will establish an SSH session and enable the tunnel.

7. Open a web browser and enter the following URL based on the port you entered for the tunnel.

		http://localhost:8787/ 

8. You will be prompted to enter the SSH username and password to connect to the cluster. If you used an SSH key while creating the cluster, you must enter the password you created in step 5 above.

	![Connect to R Studio](./media/hdinsight-hadoop-r-server-install-r-studio/connecttostudio.png "Create an SSH tunnel")

9. To test whether the RStudio installation was successful, you can run a test script that executes R based MapReduce and Spark jobs on the cluster. Go back to the SSH console and enter the following commands to download the test script to run in RStudio.

	* If you created a Hadoop cluster with R, use this command.
		
			wget http://mrsactionscripts.blob.core.windows.net/rstudio-server-community-v01/testhdi.r

	* If you created a Spark cluster with R, use this command.

			wget http://mrsactionscripts.blob.core.windows.net/rstudio-server-community-v01/testhdi_spark.r

10. In RStudio, you will see the test script you downloaded. Double click the file to open it, select the contents of the file, and then click **Run**. You should see the output in the **Console** pane.
 
	![Test the installation](./media/hdinsight-hadoop-r-server-install-r-studio/test-r-script.png "Test the installation")

## See also

- [Compute context options for R Server on HDInsight clusters](hdinsight-hadoop-r-server-compute-contexts.md)

- [Azure Storage options for R Server on HDInsight premium](hdinsight-hadoop-r-server-storage.md)


 
