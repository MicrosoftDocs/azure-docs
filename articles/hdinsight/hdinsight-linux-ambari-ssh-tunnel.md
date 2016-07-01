<properties
pageTitle="Use SSH Tunneling to access Ambari web UI, ResourceManager, JobHistory, NameNode, Oozie and other web UI's"
description="Learn how to use an SSH tunnel to securely browse web resources hosted on your Linux-based HDInsight nodes."
services="hdinsight"
documentationCenter=""
authors="Blackmist"
manager="paulettm"
editor="cgronlun"/>

<tags
ms.service="hdinsight"
ms.devlang="na"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="big-data"
ms.date="06/28/2016"
ms.author="larryfr"/>

#Use SSH Tunneling to access Ambari web UI, ResourceManager, JobHistory, NameNode, Oozie, and other web UI's

Linux-based HDInsight clusters provide access to Ambari web UI over the Internet, but some features of the UI are not. For example, the web UI for other services that are surfaced through Ambari. For full functionality of the Ambari web UI, you must use an SSH tunnel to the cluster head.

##What requires an SSH tunnel?

Several of the menus in Ambari will not fully populate without an SSH tunnel, as they rely on web sites and services exposed by other Hadoop services running on the cluster. Often, these web sites are not secured, so it is not safe to directly expose them on the internet. Sometimes the service runs the web site on another cluster node such as a Zookeeper node.

The following are services that Ambari web UI uses, that cannot be accessed without an SSH tunnel:

* ResourceManager,
* JobHistory,
* NameNode,
* Thread Stacks,
* Oozie web UI
* HBase Master and Logs UI

If you use Script Actions to customize your cluster, any services or utilities that you install that expose a web UI will require an SSH tunnel. For example, if you install Hue using a Script Action, you must use an SSH tunnel to access the Hue web UI.

##What is an SSH tunnel?

[Secure Shell (SSH) tunneling](https://en.wikipedia.org/wiki/Tunneling_protocol#Secure_Shell_tunneling) routes traffic sent to a port on your local workstation, through an SSH connection to your HDInsight cluster head node, where the request is then resolved as if it originated on the head node. The response is then routed back through the tunnel to your workstation.

##Prerequisites

When using an SSH tunnel for web traffic, you must have the following:

* An SSH client. For Linux and Unix distributions or Macintosh OS X, the `ssh` command is provided with the operating system. For Windows, we recommend [PuTTY](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html)

	> [AZURE.NOTE] If you want to use an SSH client other than `ssh` or PuTTY, please consult the documentation for your client on how to establish an SSH tunnel.

* A web browser that can be configured to use a SOCKS proxy

* __(optional)__: A plugin such as [FoxyProxy](http://getfoxyproxy.org/,) that can apply rules that only route specific requests through the tunnel.

	> [AZURE.WARNING] Without a plugin such as FoxyProxy, all requests made through the browser may be routed through the tunnel. This can result in slower loading of web pages in your browser.

##<a name="usessh"></a>Create a tunnel using the SSH command

Use the following command to create an SSH tunnel using the `ssh` command. Replace __USERNAME__ with an SSH user for your HDInsight cluster, and replace __CLUSTERNAME__ with the name of your HDInsight cluster

	ssh -C2qTnNf -D 9876 USERNAME@CLUSTERNAME-ssh.azurehdinsight.net

This creates a connection that routes traffic to local port 9876 to the cluster over SSH. The options are:

* **D 9876** - The local port that will route traffic through the tunnel.

* **C** - Compress all data, because web traffic is mostly text.

* **2** - Force SSH to try protocol version 2 only.

* **q** - Quiet mode.

* **T** - Disable pseudo-tty allocation, since we are just forwarding a port.

* **n** - Prevent reading of STDIN, since we are just forwarding a port.

* **N** - Do not execute a remote command, since we are just forwarding a port.

* **f** - Run in the background.

If you configured the cluster with an SSH key, you may need use the `-i` parameter and specify the path to the private SSH key.

Once the command finishes, traffic sent to port 9876 on the local computer will be routed over Secure Sockets Layer (SSL) to the cluster head node and appear to originate there.

##<a name="useputty"></a>Create a tunnel using PuTTY

Use the following steps to create an SSH tunnel using PuTTY.

1. Open PuTTY, and enter your connection information. If you are not familiar with PuTTY, see [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md) for information on how to use it with HDInsight.

2. In the **Category** section to the left of the dialog, expand **Connection**, expand **SSH**, and then select **Tunnels**.

3. Provide the following information on the **Options controlling SSH port forwarding** form:

	* **Source port** - The port on the client that you wish to forward. For example, **9876**.

	* **Destination** - The SSH address for the Linux-based HDInsight cluster. For example, **mycluster-ssh.azurehdinsight.net**.

	* **Dynamic** - Enables dynamic SOCKS proxy routing.

	![image of tunneling options](./media/hdinsight-linux-ambari-ssh-tunnel/puttytunnel.png)

4. Click **Add** to add the settings, and then click **Open** to open an SSH connection.

5. When prompted, log in to the server. This will establish an SSH session and enable the tunnel.

##Use the tunnel from your browser

> [AZURE.NOTE] The steps in this section use the FireFox browser, as it is freely available for Linux, Unix, Macintosh OS X and Windows systems. Other modern browsers such as Google Chrome, Microsoft Edge, or Apple Safari should work as well; however, the FoxyProxy plugin used in some steps may not be available for all browsers.

1. Configure the browser to use **localhost:9876** as a **SOCKS v5** proxy. Here's what the Firefox settings look like. If you used a different port than 9876, change the port to the one you used:

	![image of Firefox settings](./media/hdinsight-linux-ambari-ssh-tunnel/socks.png)

	> [AZURE.NOTE] Selecting **Remote DNS** will resolve Domain Name System (DNS) requests by using the HDInsight cluster. If this is unselected, DNS will be resolved locally.

2. Verify that traffic is being routed through the tunnel by vising a site such as [http://www.whatismyip.com/](http://www.whatismyip.com/) with the proxy settings enabled and disabled in Firefox. While the settings are enabled, the IP address will be for a machine in the Microsoft Azure datacenter.

###Browser extensions

While configuring the browser to use the tunnel works, you don't usually want to route all traffic over the tunnel. Browser extensions such as [FoxyProxy](http://getfoxyproxy.org/) support pattern matching for URL requests (FoxyProxy Standard or Plus only), so that only requests for specific URLs will be sent over the tunnel.

If you have installed FoxyProxy Standard, use the following steps to configure it to only forward traffic for HDInsight over the tunnel.

1. Open the FoxyProxy extension in your browser. For example, in Firefox, select the FoxyProxy icon next to the address field.

	![foxyproxy icon](./media/hdinsight-linux-ambari-ssh-tunnel/foxyproxy.png)

2. Select **Add New Proxy**, select the **General** tab, and then enter a proxy name of **HDInsightProxy**.

	![foxyproxy general](./media/hdinsight-linux-ambari-ssh-tunnel/foxygeneral.png)

3. Select the **Proxy Details** tab and populate the following fields:

	* **Host or IP Address** - This is localhost, since we are using an SSH tunnel on the local machine.

	* **Port** - This is the port you used for the SSH tunnel.

	* **SOCKS proxy** - Select this to enable the browser to use the tunnel as a proxy.

	* **SOCKS v5** - Select this to set the required version for the proxy.

	![foxyproxy proxy](./media/hdinsight-linux-ambari-ssh-tunnel/foxyproxyproxy.png)

4. Select the **URL Patterns** tab, and then select **Add New Pattern**. Use the following to define the pattern, and then click **OK**:

	* **Pattern Name** - **clusternodes** - This is just a friendly name for the pattern.

	* **URL pattern** - **\*internal.cloudapp.net\*** - This defines a pattern that matches the internal fully qualified domain name of the cluster nodes.

	![foxyproxy pattern](./media/hdinsight-linux-ambari-ssh-tunnel/foxypattern.png)

4. Click **OK** to add the proxy and close **Proxy Settings**.

5. At the top of the FoxyProxy dialog, change **Select Mode** to **Use proxies based on their pre-defined patterns and priorities**, and then click **Close**.

	![foxyproxy select mode](./media/hdinsight-linux-ambari-ssh-tunnel/selectmode.png)

After following these steps, only requests for URLs that contain the string __internal.cloudapp.net__ will be routed over the SSL tunnel.

##Verify with Ambari web UI

Once the cluster has been established, use the following steps to verify that you can access service web UIs from the Ambari Web:

1. In your browser, go to http://headnodehost:8080. The `headnodehost` address will be sent over the tunnel to the cluster and resolve to the headnode that Ambari is running on. When prompted, enter the admin user name (admin) and password for your cluster. You may be prompted a second time by the Ambari web UI. If so, re-enter the information.
    
    > [AZURE.NOTE] When using the http://headnodehost:8080 address to connect to the cluster, you are connecting directly over the tunnel to the head node that Ambari is running on using HTTP and communication is secured using the SSH tunnel. when connecting over the internet without the use of a tunnel, communication is secured using HTTPS. To connect over the internet using HTTPS, use https://CLUSTERNAME.azurehdinsight.net, where __CLUSTERNAME__ is the name of the cluster.

2. From the Ambari Web UI, select YARN from the list on the left of the page.

	![Image with YARN selected](./media/hdinsight-linux-ambari-ssh-tunnel/yarnservice.png)

3. When the YARN service information is displayed, select __Quick Links__. A list of the cluster head nodes will appear. Select one of the head nodes, and then select __ResourceManager UI__.

	![Image with the QuickLinks menu expanded](./media/hdinsight-linux-ambari-ssh-tunnel/yarnquicklinks.png)

	> [AZURE.NOTE] If you have a slow internet connection, or the head node is very busy, you may get a wait indicator instead of a menu when you select __Quick Links__. If so, wait a minute or two for the data to be received from the server, then try the list again.
    >
	> If you have a lower resolution monitor, or your browser window is not maximized, some entries in the __Quick Links__ menu may be cut off by the right side of the screen. If so, expand the menu using your mouse, then use the right arrow key to scroll the screen to the right to see the rest of the menu.

4. A page similar to the following should appear:

	![Image of the YARN ResourceManager UI](./media/hdinsight-linux-ambari-ssh-tunnel/yarnresourcemanager.png)

	> [AZURE.NOTE] Notice the URL for this page; it should be similar to __http://hn1-CLUSTERNAME.randomcharacters.cx.internal.cloudapp.net:8088/cluster__. This is using the internal fully qualified domain name (FQDN) of the node, and is not accessible without using an SSH tunnel.

##Next steps

Now that you have learned how to create and use an SSH tunnel, see the following for information on monitoring and managing your cluster using Ambari:

* [Manage HDInsight clusters by using Ambari](hdinsight-hadoop-manage-ambari.md)

For more information on using SSH with HDInsight, see the following:

* [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)

* [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)
