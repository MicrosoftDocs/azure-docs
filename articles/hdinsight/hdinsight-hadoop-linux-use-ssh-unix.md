---
title: Use SSH keys with  Linux-based Hadoop from Linux, Unix, or OS X | Microsoft Docs
description: " You can access Linux-based HDInsight using Secure Shell (SSH). This document provides information on using SSH with HDInsight from Linux, Unix, or OS X clients."
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: a6a16405-a4a7-4151-9bbf-ab26972216c5
ms.service: hdinsight
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 09/13/2016
ms.author: larryfr

---
# Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X

> [!div class="op_single_selector"]
> * [Windows](hdinsight-hadoop-linux-use-ssh-windows.md)
> * [Linux, Unix, OS X](hdinsight-hadoop-linux-use-ssh-unix.md)
> 
> 

[Secure Shell (SSH)](https://en.wikipedia.org/wiki/Secure_Shell) allows you to log in to a Linux-based HDInsight cluster and run commands using a command line interface. This document provides basic information about SSH and specific information about using SSH with HDInsight.

## What is SSH?

SSH is a cryptographic network protocol that allows you to securely communicate with a remote server over an unsecured network. SSH is usually used to provide a secure command-line login to a remote server. In this case, the head nodes or edge node of an HDInsight cluster. 

You can also use SSH to tunnel network traffic from your client to the HDInsight cluster. Using a tunnel allows you to access services on the HDInsight cluster that are not exposed directly to the internet. For more inforamtion on using SSH tunneling with HDInsight, see [Use SSH tunneling with HDInsight](hdinsight-linux-ambari-ssh-tunnel.md).

## SSH clients

Many operating systems provide SSH client functionality through the `ssh` and `scp` comannd line utilities.

* __ssh__: A general SSH client that can be used to establish a remote command line session and create tunnels.
* __scp__: A utility that copies files between local and remote systems using the SSH protocol.

Historically, Windows has not provided an SSH client until Windows 10 Anniversary Edition. This version of Windows includes the Bash on Windows 10 feature for developers, which provides `ssh`, `scp` and other Linux commands. For more information on using Bash on Windows 10, see [Bash on Ubuntu on Windows](https://msdn.microsoft.com/commandline/wsl/about).

If you use Windows and do not have access to Bash on Windows 10, we recommend the following SSH clients:

* [Git For Windows](https://git-for-windows.github.io/): Provides the `ssh` and `scp` command line utilities.
* [puTTY](http://www.chiark.greenend.org.uk/~sgtatham/putty/): Provides a graphical SSH client.
* [MobaXterm](http://mobaxterm.mobatek.net/): Provides a graphical SSH client.
* [Cygwin](https://cygwin.com/): Provides the `ssh` and `scp` command line utilities.

> [!NOTE]
> The steps in this document assume that you have access to the `ssh` command. If you are using a client such as puTTY or MobaXterm, consult the documentation for that product for the equivalent command and parameters.

## SSH Authentication

An SSH connection can be authenticated using either a password or [public-key cryptography (https://en.wikipedia.org/wiki/Public-key_cryptography)](https://en.wikipedia.org/wiki/Public-key_cryptography). Using a key is the most secure option, as it is not vulnerable to many of the attacks that passwords are. However creating and managing keys is more complicated than using a password.

Using public-key cryptography involves creating a _public_ and _private_ key pair.

* The **public key** is loaded into the nodes of your HDInsight cluster, or any other service that you wish to use with public-key cryptography.

* The **private key** is what you present to the HDInsight cluster when you log in using an SSH client, to verify your identity. Protect this private key. Do not share it.

    You can add an additional layer of security by securing the private key with a password. You must provide this password before the key can be used.

### Create a public and private key

The `ssh-keygen` utility is the easiest way to create a public and private key pair for use with HDInsight. From a command line, use the following command to create a new key pair for use with HDInsight:

> [!NOTE]
> If you are using a GUI SSH client such as MobaXTerm or puTTY, consult the documentation for your client on how to generate keys.

    ssh-keygen -t rsa -b 2048
   
You will be prompted for the following information:

* The file location: The location defaults to `~/.ssh/id_rsa`.

* An optional passphrase: If you enter a passphrase, you must re-enter it when authenticating to your HDInsight cluster.

> [!IMPORTANT]
> The passphrase is a password for the private key. Any time you use the private key to authenticate, you must provide the passphrase before the key can be used. If someone gets your private key, they will be unable to use it without the passphrase.
>
> If you forget the passphrase, there is no way to reset or recover it.

After the command finishes, you will have two new files:

* __id\_rsa__: This contains the private key.
    
    > [!WARNING]
    > You must restrict access to this file to prevent unauthorized access to services secured by the public key.

* __id\_rsa.pub__: This contains the public key. You use this when creating an HDInsght cluster.

    > [!NOTE]
    > It doesn't matter who has access to the _public_ key. By itself, all the public key can do is verify the private key. Services such as the SSH server use the public key to verify your identity when you authenticate using the private key.

## How do I use SSH with HDInsight?

### Cluster creation

When you create a Linux-based HDInsight cluster, you must provide an _SSH username_ and either a _password_ or _public key_. During cluster creation, this information is used to create a login on the HDInsight cluster nodes. The password or public key is used to secure the user account.

For more information on setting the SSH username and a password or public key during cluster creation, see one of the following documents:

* [Create HDInsight using the Azure Portal](hdinsight-hadoop-create-linux-clusters-portal.md)
* [Create HDInsight using the Azure CLI](hdinsight-hadoop-create-linux-clusters-azure-cli.md)
* [Create HDInsight using Azure PowerShell](hdinsight-hadoop-create-linux-clusters-azure-powershell.md)
* [Create HDInsight using Azure Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md)
* [Create HDInsight using the .NET SDK](hdinsight-hadoop-create-linux-clusters-dotnet-sdk.md)
* [Create HDInsight using REST](hdinsight-hadoop-create-linux-clusters-curl-rest.md)

### Connect to a cluster

While all of the nodes in an HDInsight cluster run the SSH server, you can only connect to the head nodes or edge nodes over the public internet.

* To connect to the _head nodes_, use `CLUSTERNAME-ssh.azurehdinsight.net`, where __CLUSTERNAME__ is the name of the HDInsight cluster. Connecting on port 22 (the default for SSH) connects to the primary head node. Port 23 connects to the secondary head node.

* To connect to an _edge node_, use `EDGENAME.CLUSTERNAME-ssh.azurehdinsight.net`, where __EDGENAME__ is the name of the edge node and __CLUSTERNAME__ is the name of the HDInsight cluster. Use port 22 when connecting to the edge node.

The following examples demonstrate how to connect to the head nodes and edge node of a cluster named __myhdi__ using an SSH username of __sshuser__. The edge node is named __myedge__.

| To do this... | Use this... |
| ----- | ----- |
| Connect to the primary head node | `ssh sshuser@myhdi-ssh.azurehdinsight.net` |
| Connect to the secondary head node | `ssh -p 23 sshuser@myhdi-ssh.azurehdinsight.net` |
| Connect to the edge node | `ssh sshuser@edge.myhdi-ssh.azurehdinsight.net` |

If you use a password to secure the SSH account, you will be prompted to enter the password.

If you use a public key to secure the SSH account, you may need to specify the path to the matching private key by using the `-i` switch. The following example demonstrates using the `-i` switch:

    ssh -i /path/to/public.key sshuser@myhdi-ssh.azurehdinsight.net

### Connect to worker nodes

The worker nodes are not directly accessible from outside the cluster, but they can be accessed from the cluster head nodes or edge nodes. The following are the general steps to accomplish this:

1. Use SSH to connect to a head or edge node:

        ssh sshuser@myhdi-ssh.azurehdinsight.net

2. From the SSH connection to the head or edge node, use the `ssh` command to connect to a worker node in the cluster:

        ssh sshuser@wn0-myhdi

    To retrieve a list of the worker nodes in the cluster, see the example of how to retrieve the fully qualified domain name of cluster nodes in the [Manage HDInsight by using the Ambari REST API](hdinsight-hadoop-manage-ambari-rest-api.md#example-get-the-fqdn-of-cluster-nodes) document.

If the SSH account is secured using a password, you will be asked to enter the password and the connection is established.

If you use an SSH key to authenticate your user account, you must make sure that your local environment is configured for SSH agent forwarding.

> [!IMPORTANT]
> The following steps assume a Linux/UNIX based system, which will also work with Bash on Windows 10. If these steps do not work for your system, you may need to consult the documentation for your SSH client.

1. Using a text editor, open `~/.ssh/config`. If this file doesn't exist, you can create it by entering `touch ~/.ssh/config` at a command line.

2. Add the following to the file. Replace *CLUSTERNAME* with the name of your HDInsight cluster.
   
        Host CLUSTERNAME-ssh.azurehdinsight.net
          ForwardAgent yes
   
    This configures SSH agent forwarding for your HDInsight cluster.

3. Test SSH agent forwarding by using the following command from the terminal:
   
        echo "$SSH_AUTH_SOCK"
   
    This should return information similar to the following:
   
        /tmp/ssh-rfSUL1ldCldQ/agent.1792
   
    If nothing is returned, this indicates that `ssh-agent` is not running. See the agent startup scripts information at [Using ssh-agent with ssh (http://mah.everybody.org/docs/ssh)](http://mah.everybody.org/docs/ssh) or consult your SSH client documentation for specific steps on installing and configuring `ssh-agent`.

4. Once you have verified that **ssh-agent** is running, use the following to add your SSH private key to the agent:
   
        ssh-add ~/.ssh/id_rsa
   
    If your private key is stored in a different file, replace `~/.ssh/id_rsa` with the path to the file.

###<a id="domainjoined"></a> Domain joined HDInsight

[Domain-joined HDInsight](hdinsight-domain-joined-introduction.md) integrates Kerberos with Hadoop in HDInsight. Because the SSH user is not an Active Directory domain user, you cannot run Hadoop commands until you authenticate with Active Directory. Use the following steps to authenticate your SSH session with Active Directory:

1. Connect to a Domain-joined HDInsight cluster using the SSH as mentioned earlier in this document. For example, the following connects to an HDInsight cluster named __myhdi__ using an SSH account named __sshuser__.

        ssh sshuser@myhdi-ssh.azurehdinsight.net

2. Use the following to authenticate using a domain user and password:

        kinit

     When prompted, enter a domain user name and the password for the domain user.

    For more information on how to configure domain users for domain-joined HDInsight clusters, see [Configure Domain-joined HDInisight clusters](hdinsight-domain-joined-configure.md).

After authenticating using the `kinit` command, you can now use Hadoop commands such as `hdfs dfs -ls /` or `hive`.

## Add additional SSH users

The following steps demonstrate how to add additional SSH users to an HDInsight cluster. However, we do not recommend adding additional SSH users for the following reasons:

* You must manually add new SSH users to each node in the cluster

* New SSH users have the same access to HDInsight as the default user; there is no way to restrict access to data or jobs in HDInsight based on SSH user account.

    To restrict permissions, you must use a domain joined HDInsight cluster, which uses Active Directory to control access to cluster resources.

    Using a domain joined HDInsight cluster allows you to authenticate using Active Directory after connecting using SSH. This does not require additional SSH accounts; multiple users can connect using SSH and then authenticate to thier Active Directory account after connecting. See the [Domain joined HDInsight](#domainjoined) section for more information.

Use the following steps to add a new user account that is authenticated using a private key:

1. Generate a new public key and private key for the new user account, as described in the [Create an SSH key](#create-an-ssh-key-optional) section.
   
   > [!NOTE]
   > The private key should either be generated on a client that the user will use to connect to the cluster, or securely transferred to such a client after creation.

2. From an SSH session to the cluster, add the new user with the following command:
   
        sudo adduser --disabled-password <username>
   
    This will create a new user account, but will disable password authentication.

3. Create the directory and files to hold the key by using the following commands:
   
        sudo mkdir -p /home/<username>/.ssh
        sudo touch /home/<username>/.ssh/authorized_keys
        sudo nano /home/<username>/.ssh/authorized_keys

4. When the nano editor opens, copy and paste in the contents of the public key for the new user account. Finally, use **Ctrl-X** to save the file and exit the editor.
   
    ![image of nano editor with example key](./media/hdinsight-hadoop-linux-use-ssh-unix/nano.png)

5. Use the following command to change ownership of the .ssh folder and contents to the new user account:
   
        sudo chown -hR <username>:<username> /home/<username>/.ssh

6. You should now be able to authenticate to the server with the new user account and private key.

## <a id="tunnel"></a>SSH tunneling

SSH can be used to tunnel local requests, such as web requests, to the HDInsight cluster. The request will then be routed to the requested resource as if it had originated on the HDInsight cluster headnode.

> [!IMPORTANT]
> An SSH tunnel is a requirement for accessing the web UI for some Hadoop services. For example, both the Job History UI or Resource Manager UI can only be accessed using an SSH tunnel.

For more information on creating and using an SSH tunnel, see [Use SSH Tunneling to access Ambari web UI, ResourceManager, JobHistory, NameNode, Oozie, and other web UI's](hdinsight-linux-ambari-ssh-tunnel.md).

## Next steps

Now that you understand how to authenticate by using an SSH key, learn how to use MapReduce with Hadoop on HDInsight.

* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce jobs with HDInsight](hdinsight-use-mapreduce.md)

[preview-portal]: https://portal.azure.com/
