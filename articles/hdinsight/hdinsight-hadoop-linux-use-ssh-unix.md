---
title: Use SSH with Hadoop - Azure HDInsight 
description: "You can access HDInsight using Secure Shell (SSH). This document provides information on connecting to HDInsight using the ssh commands from Windows, Linux, Unix, or macOS clients."
ms.service: hdinsight
ms.topic: how-to
ms.custom: H1Hack27Feb2017,hdinsightactive,hdiseo17may2017,seoapr2020
ms.date: 02/28/2020
---

# Connect to HDInsight (Apache Hadoop) using SSH

Learn how to use [Secure Shell (SSH)](https://en.wikipedia.org/wiki/Secure_Shell) to securely connect to Apache Hadoop on Azure HDInsight. For information on connecting through a virtual network, see [Azure HDInsight virtual network architecture](./hdinsight-virtual-network-architecture.md). See also, [Plan a virtual network deployment for Azure HDInsight clusters](./hdinsight-plan-virtual-network-deployment.md).

The following table contains the address and port information needed when connecting to HDInsight using an SSH client:

| Address | Port | Connects to... |
| ----- | ----- | ----- |
| `<clustername>-ssh.azurehdinsight.net` | 22 | Primary headnode |
| `<clustername>-ssh.azurehdinsight.net` | 23 | Secondary headnode |
| `<clustername>-ed-ssh.azurehdinsight.net` | 22 | edge node (ML Services on HDInsight) |
| `<edgenodename>.<clustername>-ssh.azurehdinsight.net` | 22 | edge node (any other cluster type, if an edge node exists) |

Replace `<clustername>` with the name of your cluster. Replace `<edgenodename>` with the name of the edge node.

If your cluster contains an edge node, we recommend that you __always connect to the edge node__ using SSH. The head nodes host services that are critical to the health of Hadoop. The edge node runs only what you put on it. For more information on using edge nodes, see [Use edge nodes in HDInsight](hdinsight-apps-use-edge-node.md#access-an-edge-node).

> [!TIP]  
> When you first connect to HDInsight, your SSH client may display a warning that the authenticity of the host can't be established. When prompted select 'yes' to add the host to your SSH client's trusted server list.
>
> If you have previously connected to a server with the same name, you may receive a warning that the stored host key does not match the host key of the server. Consult the documentation for your SSH client on how to remove the existing entry for the server name.

## SSH clients

Linux, Unix, and macOS systems provide the `ssh` and `scp` commands. The `ssh` client is commonly used to create a remote command-line session with a Linux or Unix-based system. The `scp` client is used to securely copy files between your client and the remote system.

Microsoft Windows doesn't install any SSH clients by default. The `ssh` and `scp` clients are available for Windows through the following packages:

* [OpenSSH Client](/windows-server/administration/openssh/openssh_install_firstuse). This client is an optional feature introduced in the Windows 10 Fall Creators Update.

* [Bash on Ubuntu on Windows 10](/windows/wsl/about).

* [Azure Cloud Shell](../cloud-shell/quickstart.md). The Cloud Shell provides a Bash environment in your browser.

* [Git](https://git-scm.com/).

There are also several graphical SSH clients, such as [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/) and [MobaXterm](https://mobaxterm.mobatek.net/). While these clients can be used to connect to HDInsight, the process of connecting is different than using the `ssh` utility. For more information, see the documentation of the graphical client you're using.

## <a id="sshkey"></a>Authentication: SSH Keys

SSH keys use [public-key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography) to authenticate SSH sessions. SSH keys are more secure than passwords, and provide an easy way to secure access to your Hadoop cluster.

If your SSH account is secured using a key, the client must provide the matching private key when you connect:

* Most clients can be configured to use a __default key__. For example, the `ssh` client looks for a private key at `~/.ssh/id_rsa` on Linux and Unix environments.

* You can specify the __path to a private key__. With the `ssh` client, the `-i` parameter is used to specify the path to private key. For example, `ssh -i ~/.ssh/id_rsa sshuser@myedge.mycluster-ssh.azurehdinsight.net`.

* If you have __multiple private keys__ for use with different servers, consider using a utility such as [ssh-agent (https://en.wikipedia.org/wiki/Ssh-agent)](https://en.wikipedia.org/wiki/Ssh-agent). The `ssh-agent` utility can be used to automatically select the key to use when establishing an SSH session.

> [!IMPORTANT]  
> If you secure your private key with a passphrase, you must enter the passphrase when using the key. Utilities such as `ssh-agent` can cache the password for your convenience.

### Create an SSH key pair

Use the `ssh-keygen` command to create public and private key files. The following command generates a 2048-bit RSA key pair that can be used with HDInsight:

```azurepowershell-interactive
ssh-keygen -t rsa -b 2048
```

You're prompted for information during the key creation process. For example, where the keys are stored or whether to use a passphrase. After the process completes, two files are created; a public key and a private key.

* The __public key__ is used to create an HDInsight cluster. The public key has an extension of `.pub`.

* The __private key__ is used to authenticate your client to the HDInsight cluster.

> [!IMPORTANT]  
> You can secure your keys using a passphrase. A passphrase is effectively a password on your private key. Even if someone obtains your private key, they must have the passphrase to use the key.

### Create HDInsight using the public key

| Creation method | How to use the public key |
| ------- | ------- |
| Azure portal | Uncheck __Use cluster login password for SSH__, and then select __Public Key__ as the SSH authentication type. Finally, select the public key file or paste the text contents of the file in the __SSH public key__ field.</br>:::image type="content" source="./media/hdinsight-hadoop-linux-use-ssh-unix/create-hdinsight-ssh-public-key.png" alt-text="SSH public key dialog in HDInsight cluster creation"::: |
| Azure PowerShell | Use the `-SshPublicKey` parameter of the [New-AzHdinsightCluster](/powershell/module/az.hdinsight/new-azhdinsightcluster) cmdlet and pass the contents of the public key as a string.|
| Azure CLI | Use the `--sshPublicKey` parameter of the [`az hdinsight create`](/cli/azure/hdinsight#az_hdinsight_create) command and pass the contents of the public key as a string. |
| Resource Manager Template | For an example of using SSH keys with a template, see [Deploy HDInsight on Linux with SSH key](https://azure.microsoft.com/resources/templates/101-hdinsight-linux-ssh-publickey/). The `publicKeys` element in the [azuredeploy.json](https://github.com/Azure/azure-quickstart-templates/blob/master/101-hdinsight-linux-ssh-publickey/azuredeploy.json) file is used to pass the keys to Azure when creating the cluster. |

## Authentication: Password

SSH accounts can be secured using a password. When you connect to HDInsight using SSH, you're prompted to enter the password.

> [!WARNING]  
> Microsoft does not recommend using password authentication for SSH. Passwords can be guessed and are vulnerable to brute force attacks. Instead, we recommend that you use [SSH keys for authentication](#sshkey).

> [!IMPORTANT]  
> The SSH account password expires 70 days after the HDInsight cluster is created. If your password expires, you can change it using the information in the [Manage HDInsight](hdinsight-administer-use-portal-linux.md#change-passwords) document.

### Create HDInsight using a password

| Creation method | How to specify the password |
| --------------- | ---------------- |
| Azure portal | By default, the SSH user account has the same password as the cluster login account. To use a different password, uncheck __Use cluster login password for SSH__, and then enter the password in the __SSH password__ field.</br>:::image type="content" source="./media/hdinsight-hadoop-linux-use-ssh-unix/create-hdinsight-ssh-password.png" alt-text="SSH password dialog in HDInsight cluster creation":::|
| Azure PowerShell | Use the `--SshCredential` parameter of the [New-AzHdinsightCluster](/powershell/module/az.hdinsight/new-azhdinsightcluster) cmdlet and pass a `PSCredential` object that contains the SSH user account name and password. |
| Azure CLI | Use the `--ssh-password` parameter of the [`az hdinsight create`](/cli/azure/hdinsight#az_hdinsight_create) command and provide the password value. |
| Resource Manager Template | For an example of using a password with a template, see [Deploy HDInsight on Linux with SSH password](https://azure.microsoft.com/resources/templates/101-hdinsight-linux-ssh-password/). The `linuxOperatingSystemProfile` element in the [azuredeploy.json](https://github.com/Azure/azure-quickstart-templates/blob/master/101-hdinsight-linux-ssh-password/azuredeploy.json) file is used to pass the SSH account name and password to Azure when creating the cluster.|

### Change the SSH password

For information on changing the SSH user account password, see the __Change passwords__ section of the [Manage HDInsight](hdinsight-administer-use-portal-linux.md#change-passwords) document.

## Authentication domain joined HDInsight

If you're using a __domain-joined HDInsight cluster__, you must use the `kinit` command after connecting with SSH local user. This command prompts you for a domain user and password, and authenticates your session with the Azure Active Directory domain associated with the cluster.

You can also enable Kerberos Authentication on each domain joined node (for example, head node, edge node) to ssh using the domain account. To do this edit sshd config file:

```bash
sudo vi /etc/ssh/sshd_config
```

uncomment and change `KerberosAuthentication` to `yes`

```bash
sudo service sshd restart
```

Use `klist` command to verify whether the Kerberos authentication was successful.

For more information, see [Configure domain-joined HDInsight](./domain-joined/apache-domain-joined-configure-using-azure-adds.md).

## Connect to nodes

The head nodes and edge node (if there's one) can be accessed over the internet on ports 22 and 23.

* When connecting to the __head nodes__, use port __22__ to connect to the primary head node and port __23__ to connect to the secondary head node. The fully qualified domain name to use is `clustername-ssh.azurehdinsight.net`, where `clustername` is the name of your cluster.

    ```bash
    # Connect to primary head node
    # port not specified since 22 is the default
    ssh sshuser@clustername-ssh.azurehdinsight.net

    # Connect to secondary head node
    ssh -p 23 sshuser@clustername-ssh.azurehdinsight.net
    ```

* When connecting to the __edge node__, use port 22. The fully qualified domain name is `edgenodename.clustername-ssh.azurehdinsight.net`, where `edgenodename` is a name you provided when creating the edge node. `clustername` is the name of the cluster.

    ```bash
    # Connect to edge node
    ssh sshuser@edgnodename.clustername-ssh.azurehdinsight.net
    ```

> [!IMPORTANT]  
> The previous examples assume that you are using password authentication, or that certificate authentication is occurring automatically. If you use an SSH key-pair for authentication, and the certificate is not used automatically, use the `-i` parameter to specify the private key. For example, `ssh -i ~/.ssh/mykey sshuser@clustername-ssh.azurehdinsight.net`.

Once connected, the prompt changes to indicate the SSH user name and the node you're connected to. For example, when connected to the primary head node as `sshuser`, the prompt is `sshuser@<active-headnode-name>:~$`.

### Connect to worker and Apache Zookeeper nodes

The worker nodes and Zookeeper nodes aren't directly accessible from the internet. They can be accessed from the cluster head nodes or edge nodes. The following are the general steps to connect to other nodes:

1. Use SSH to connect to a head or edge node:

    ```bash
    ssh sshuser@myedge.mycluster-ssh.azurehdinsight.net
    ```

2. From the SSH connection to the head or edge node, use the `ssh` command to connect to a worker node in the cluster:

    ```bash
    ssh sshuser@wn0-myhdi
    ```

    To retrieve a list of the node names, see the [Manage HDInsight by using the Apache Ambari REST API](hdinsight-hadoop-manage-ambari-rest-api.md#get-the-fqdn-of-cluster-nodes) document.

If the SSH account is secured using a __password__, enter the password when connecting.

If the SSH account is secured using __SSH keys__, make sure that SSH forwarding is enabled on the client.

> [!NOTE]  
> Another way to directly access all nodes in the cluster is to install HDInsight into an Azure Virtual Network. Then, you can join your remote machine to the same virtual network and directly access all nodes in the cluster.
>
> For more information, see [Plan a virtual network for HDInsight](hdinsight-plan-virtual-network-deployment.md).

### Configure SSH agent forwarding

> [!IMPORTANT]  
> The following steps assume a Linux or UNIX-based system, and work with Bash on Windows 10. If these steps do not work for your system, you may need to consult the documentation for your SSH client.

1. Using a text editor, open `~/.ssh/config`. If this file doesn't exist, you can create it by entering `touch ~/.ssh/config` at a command line.

2. Add the following text to the `config` file.

    ```
    Host <edgenodename>.<clustername>-ssh.azurehdinsight.net
        ForwardAgent yes
    ```

    Replace the __Host__ information with the address of the node you connect to using SSH. The previous example uses the edge node. This entry configures SSH agent forwarding for the specified node.

3. Test SSH agent forwarding by using the following command from the terminal:

    ```bash
    echo "$SSH_AUTH_SOCK"
    ```

    This command returns information similar to the following text:

    ```output
    /tmp/ssh-rfSUL1ldCldQ/agent.1792
    ```

    If nothing is returned, then `ssh-agent` isn't running. For more information, see the agent startup scripts information at [Using ssh-agent with ssh (http://mah.everybody.org/docs/ssh)](http://mah.everybody.org/docs/ssh) or consult your SSH client documentation.

4. Once you've verified that **ssh-agent** is running, use the following to add your SSH private key to the agent:

    ```bash
    ssh-add ~/.ssh/id_rsa
    ```

    If your private key is stored in a different file, replace `~/.ssh/id_rsa` with the path to the file.

5. Connect to the cluster edge node or head nodes using SSH. Then use the SSH command to connect to a worker or zookeeper node. The connection is established using the forwarded key.

## Next steps

* [Use SSH tunneling with HDInsight](hdinsight-linux-ambari-ssh-tunnel.md)
* [Use edge nodes in HDInsight](hdinsight-apps-use-edge-node.md#access-an-edge-node)
* [Use SCP with HDInsight](./use-scp.md)