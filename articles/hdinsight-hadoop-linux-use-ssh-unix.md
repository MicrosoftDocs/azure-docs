<properties
   pageTitle="Use SSH keys with Hadoop on Linux-based HDInsight from Linux, Unix, or OS X | Aure"
   description="Learn how to create and use SSH keys to authenticate to Linux-based HDInsight clusters."
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
   ms.date="03/20/2015"
   ms.author="larryfr"/>

#Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X (preview)

> [AZURE.SELECTOR]
- [Windows](hdinsight-hadoop-linux-use-ssh-windows.md)
- [Linux, Unix, OS X](hdinsight-hadoop-linux-use-ssh-unix.md)

Linux-based Azure HDInsight clusters provide the option of using Secure Shell (SSH) access through either a password or an SSH key. This document provides information on using SSH with HDInsight from Linux, Unix, or OS X clients.

> [AZURE.NOTE] The steps in this article assume you are using a Linux, Unix, or OS X client. While these steps may be performed on a Windows-based client if you have installed a package that provides `ssh` and `ssh-keygen` (such as Git for Windows,) we recommend that Windows-based clients follow the steps in [Use SSH with Linux-based HDInsight (Hadoop) from Windows](hdinsight-hadoop-linux-use-ssh-windows.md).

##Prerequisites

* **ssh-keygen** and **ssh** for Linux, Unix, and OS X clients. This utilities are usually provided with your operating system, or available through the package management system.

* A modern web browser that supports HTML5.

OR

* [Azure CLI for Mac, Linux and Windows](xplat-cli.md).

##What is SSH?

SSH is a utility for logging in to, and remotely executing, commands on a remote server. With Linux-based HDInsight, SSH establishes an encrypted connection to the cluster head node and provides a command line that you use to type in commands. Commands are then executed directly on the server.

##Create an SSH key (optional)

When creating a Linux-based HDInsight cluster, you have the option of using a password or an SSH key to authenticate to the server when using SSH. SSH keys are considered more secure, as they are certificate-based. Use the following information if you plan on using SSH keys with your cluster.

1. Open a terminal session and use the following command to see if you have any existing SSH keys:

		ls -al ~/.ssh

	Look for the following files in the directory listing. These are common names for public SSH keys.

	* id\_dsa.pub
	* id\_ecdsa.pub
	* id\_ed25519.pub
	* id\_rsa.pub

2. If you do not want to use an existing file, or you have no existing SSH keys, use the following to generate a new file:

		ssh-keygen -t rsa

	You will be prompted for the following information:

	* The file location - The location defaults to ~/.ssh/id\_rsa.
	* A passphrase - You will be prompted to re-enter this.

		> [AZURE.NOTE] We strongly recommend that you use a secure passphrase for the key. However, if you forget the passphrase, there is no way to recover it.

	After the command finishes, you will have two new files, the private key (for example, **id\_rsa**) and the public key (for example, **id\_rsa.pub**).

##Create a Linux-based HDInsight cluster

When creating a Linux-based HDInsight cluster, you must provide the public key created previously. From Linux, Unix, or OS X clients, there are two ways to create an HDInsight cluster:

* **Azure portal** - Uses a web-based portal to create the cluster.

* **Azure CLI for Mac, Linux and Windows** - Uses command-line commands to create the cluster.

Each of these methods will require either a password or a public key. For complete information on creating a Linux-based HDInsight cluster, see <a href="/documentation/articles/hdinsight-hadoop-provision-linux-clusters/" target="_blank">Provision Linux-based HDInsight clusters</a>.

###Azure portal

When using the portal to create a Linux-based HDInsight cluster, you must enter an **SSH USER NAME**, and select to enter a **PASSWORD** or **SSH PUBLIC KEY**. If you select **SSH PUBLIC KEY**, you must paste the public key (contained in the file with the **.pub** extension) into the following form:

![Image of form asking for public key](./media/hdinsight-hadoop-linux-use-ssh-unix/ssh-key.png)

> [AZURE.NOTE] The key file is simply a text file. The contents should appear similar to the following:
> ```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCelfkjrpYHYiks4TM+r1LVsTYQ4jAXXGeOAF9Vv/KGz90pgMk3VRJk4PEUSELfXKxP3NtsVwLVPN1l09utI/tKHQ6WL3qy89WVVVLiwzL7tfJ2B08Gmcw8mC/YoieT/YG+4I4oAgPEmim+6/F9S0lU2I2CuFBX9JzauX8n1Y9kWzTARST+ERx2hysyA5ObLv97Xe4C2CQvGE01LGAXkw2ffP9vI+emUM+VeYrf0q3w/b1o/COKbFVZ2IpEcJ8G2SLlNsHWXofWhOKQRi64TMxT7LLoohD61q2aWNKdaE4oQdiuo8TGnt4zWLEPjzjIYIEIZGk00HiQD+KCB5pxoVtp user@system
> ```

This creates a login for the specified user, by using the password or public key you provide.

###Azure Command-Line Interface for Mac, Linux and Windows

You can use the [Azure CLI for Mac, Linux and Windows](xplat.md) to create a new cluster by using the `azure hdinsight cluster create` command.

For more information on using this command, see <a href="../hdinsight-hadoop-provision-linux-clusters/" target="_blank">Provision Hadoop Linux clusters in HDInsight using custom options</a>.

##Connect to a Linux-based HDInsight cluster

From a terminal session, use the SSH command to connect to the cluster head node by providing the address and user name:

* **SSH address** - The cluster name, followed by **-ssh.azurehdinsight.net**. For example, **mycluster-ssh.azurehdinsight.net**.

* **User name** - The SSH user name you provided when you created the cluster.

The following example will connect to the cluster **mycluster** as the user **me**:

	ssh me@mycluster-ssh.azurehdinsight.net

If you used a password for the user account, you will be prompted to enter the password.

If you used an SSH key that is secured with a passphrase, you will be prompted to enter the passphrase. Otherwise, SSH will attempt to automatically authenticate by using one of the local private keys on your client.

> [AZURE.NOTE] If SSH does not automatically authenticate with the correct private key, use the **-i** parameter and specify the path to the private key. The following example will load the private key from `~/.ssh/id_rsa`:
>
> `ssh -i ~/.ssh/id_rsa me@mycluster-ssh.azurehdinsight.net`

###Connect to worker nodes

The worker nodes are not directly accessible from outside the Azure datacenter, but they can be accessed from the cluster head node via SSH.

If you use an SSH key to authenticate your user account, you must complete the following steps on your client:

1. Using a text editor, open `~/.ssh/config`. If this file doesn't exist, you can create it by entering `touch ~/.ssh/config` in the terminal.

2. Add the following to the file. Replace *CLUSTERNAME* with the name of your HDInsight cluster.

        Host CLUSTERNAME-ssh.azurehdinsight.net
          ForwardAgent yes

    This configures SSH agent forwarding for your HDInsight cluster.

3. Test SSH agent forwarding by using the following command from the terminal:

        echo "$SSH_AUTH_SOCK"

    This should return information similar to the following:

        /tmp/ssh-rfSUL1ldCldQ/agent.1792

    If nothing is returned, this indicates that **ssh-agent** is not running. Consult your operating system documentation for specific steps on installing and configuring **ssh-agent**, or see <a href="http://mah.everybody.org/docs/ssh" target="_blank">Using ssh-agent with ssh</a>.

4. Once you have verified that **ssh-agent** is running, use the following to add your SSH private key to the agent:

        ssh-add ~/.ssh/id_rsa

    If your private key is stored in a different file, replace `~/.ssh/id_rsa` with the path to the file.

Use the following steps to connect to the worker nodes for your cluster.

> [AZURE.IMPORTANT] If you use an SSH key to authenticate your account, you must complete the previous steps to verify that agent forwarding is working.

1. Connect to the HDInsight cluster by using SSH as described previously.

2. Once you are connected, use the following to retrieve a list of the nodes in your cluster. Replace *ADMINPASSWORD* with the password for your cluster admin account. Replace *CLUSTERNAME* with the name of your cluster.

        curl --user admin:ADMINPASSWORD https://CLUSTERNAME.azurehdinsight.net/api/v1/hosts

    This will return information in JSON format for the nodes in the cluster, including `host_name`, which contains the fully qualified domain name (FQDN) for each node. The following is an example of a `host_name` entry returned by the **curl** command:

        "host_name" : "workernode0.workernode-0-e2f35e63355b4f15a31c460b6d4e1230.j1.internal.cloudapp.net"

3. Once you have a list of the worker nodes you want to connect to, use the following command from the SSH session to the server to open a connection to a worker node:

        ssh USERNAME@FQDN

    Replace *USERNAME* with your SSH user name and *FQDN* with the FQDN for the worker node. For example, `workernode0.workernode-0-e2f35e63355b4f15a31c460b6d4e1230.j1.internal.cloudapp.net`.

    > [AZURE.NOTE] If you use a password to authentication your SSH session, you will be prompted to enter the password again. If you use an SSH key, the connection should finish without any prompts.

4. Once the session has been established, the terminal prompt will change from `username@headnode` to `username@workernode` to indicate that you are connected to the worker node. Any commands you run at this point will run on the worker node.

4. Once you have finished performing actions on the worker node, use the `exit` command to close the session to the worker node. This will return you to the `username@headnode` prompt.

##Add more accounts

1. Generate a new public key and private key for the new user account, as described in the [Create an SSH key](#create-an-ssh-key-optional) section.

	> [AZURE.NOTE] The private key should either be generated on a client that the user will use to connect to the cluster, or securely transferred to such a client after creation.

1. From an SSH session to the cluster, add the new user with the following command:

		sudo adduser --disabled-password <username>

	This will create a new user account, but will disable password authentication.

2. Create the directory and files to hold the key by using the following commands:

		sudo mkdir -p /home/<username>/.ssh
		sudo touch /home/<username>/.ssh/authorized_keys
		sudo nano /home/<username>/.ssh/authorized_keys

3. When the nano editor opens, copy and paste in the contents of the public key for the new user account. Finally, use **Ctrl-X** to save the file and exit the editor.

	![image of nano editor with example key](./media/hdinsight-hadoop-linux-use-ssh-unix/nano.png)

4. Use the following command to change ownership of the .ssh folder and contents to the new user account:

		sudo chown -hR <username>:<username> /home/<username>/.ssh

5. You should now be able to authenticate to the server with the new user account and private key.

##<a id="tunnel"></a>SSH tunneling

SSH can also be used to tunnel local requests, such as web requests, to the HDInsight cluster. The request will then be routed to the requested resource as if it had originated on the HDInsight cluster head node.

This is most useful for accessing web-based services on the HDInsight cluster that use internal domain names for the head or worker nodes in the cluster. For example, some sections of the Ambari webpage use internal domain names such as **headnode0.mycluster.d1.internal.cloudapp.net**. These names cannot be resolved from outside the cluster, but requests tunneled over SSH originate inside the cluster and will resolve correctly.

Use the following steps to create an SSH tunnel and configure your browser to use it to connect to the cluster.

1. The following command can be used to create an SSH tunnel to the cluster head node:

		ssh -C2qTnNf -D 9876 username@clustername-ssh.azurehdinsight.net

	This creates a connection that routes traffic to local port 9876 to the cluster over SSH. The options are:

	* **D 8080** - The local port that will route traffic through the tunnel.

	* **C** - Compress all data, because web traffic is mostly text.

	* **2** - Force SSH to try protocol version 2 only.

	* **q** - Quiet mode.

	* **T** - Disable pseudo-tty allocation, since we are just forwarding a port.

	* **n** - Prevent reading of STDIN, since we are just forwarding a port.

	* **N** - Do not execute a remote command, since we are just forwarding a port.

	* **f** - Run in the background.

	If you configured the cluster with an SSH key, you may need use the `-i` parameter and specify the path to the private SSH key.

	Once the command finishes, traffic sent to port 9876 on the local computer will be routed over Secure Sockets Layer (SSL) to the cluster head node and appear to originate there.

2. Configure the client program, such as Firefox, to use **localhost:9876** as a **SOCKS v5** proxy. Here's what the Firefox settings look like:

	![image of Firefox settings](./media/hdinsight-hadoop-linux-use-ssh-unix/socks.png)

	> [AZURE.NOTE] Selecting **Remote DNS** will resolve Domain Name System (DNS) requests by using the HDInsight cluster. If this is unselected, DNS will be resolved locally.

	You can verify that traffic is being routed through the tunnel by vising a site such as <a href="http://www.whatismyip.com/" target="_blank">http://www.whatismyip.com/</a> with the proxy settings enabled and disabled in Firefox. While the settings are enabled, the IP address will be for a machine in the Microsoft Azure datacenter.

###Browser extensions

While configuring the browser to use the tunnel works, you don't usually want to route all traffic over the tunnel. Browser extensions such as <a href="http://getfoxyproxy.org/" target="_blank">FoxyProxy</a> support pattern matching for URL requests (FoxyProxy Standard or Plus only), so that only requests for specific URLs will be sent over the tunnel.

If you have installed FoxyProxy Standard, use the following steps to configure it to only forward traffic for HDInsight over the tunnel:

1. Open the FoxyProxy extension in your browser. For example, in Firefox, select the FoxyProxy icon next to the address field.

	![foxyproxy icon](./media/hdinsight-hadoop-linux-use-ssh-unix/foxyproxy.png)

2. Select **Add New Proxy**, select the **General** tab, and then enter a proxy name of **HDInsightProxy**.

	![foxyproxy general](./media/hdinsight-hadoop-linux-use-ssh-unix/foxygeneral.png)

3. Select the **Proxy Details** tab and populate the following fields:

	* **Host or IP Address** - This is localhost, since we are using an SSH tunnel on the local machine.

	* **Port** - This is the port you used for the SSH tunnel.

	* **SOCKS proxy** - Select this to enable the browser to use the tunnel as a proxy.

	* **SOCKS v5** - Select this to set the required version for the proxy.

	![foxyproxy proxy](./media/hdinsight-hadoop-linux-use-ssh-unix/foxyproxyproxy.png)

4. Select the **URL Patterns** tab, and then select **Add New Pattern**. Use the following to define the pattern, and then click **OK**:

	* **Pattern Name** - **headnode** - This is just a friendly name for the pattern.

	* **URL pattern** - **\*headnode\*** - This defines a pattern that matches any URL with the word **headnode** in it.

	![foxyproxy pattern](./media/hdinsight-hadoop-linux-use-ssh-unix/foxypattern.png)

4. Click **OK** to add the proxy and close **Proxy Settings**.

5. At the top of the FoxyProxy dialog, change **Select Mode** to **Use proxies based on their pre-defined patterns and priorities**, and then click **Close**.

	![foxyproxy select mode](./media/hdinsight-hadoop-linux-use-ssh-unix/selectmode.png)

After following these steps, only requests for URLs that contain the string **headnode** will be routed over the SSL tunnel.

##Next steps

Now that you understand how to authenticate by using an SSH key, learn how to use MapReduce with Hadoop on HDInsight.

* [Use Hive with HDInsight](hdinsight-use-hive.md)

* [Use Pig with HDInsight](hdinsight-use-pig.md)

* [Use MapReduce jobs with HDInsight](hdinsight-use-mapreduce.md)
