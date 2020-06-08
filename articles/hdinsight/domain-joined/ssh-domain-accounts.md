---
title: Manage SSH access for domain accounts in Azure HDInsight
description: Steps to manage SSH access for Azure AD accounts in HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 02/14/2020
---

# Manage SSH access for domain accounts in Azure HDInsight

On secure clusters, by default, all domain users in [Azure AD DS](../../active-directory-domain-services/overview.md) are allowed to [SSH](../hdinsight-hadoop-linux-use-ssh-unix.md) into the head and edge nodes. These users are not part of the sudoers group and do not get root access. The SSH user created during cluster creation will have root access.

## Manage access

To modify SSH access to specific users or groups, update `/etc/ssh/sshd_config` on each of the nodes.

1. Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your cluster. Edit the command below by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. Open the `ssh_confi`g file.

    ```bash
    sudo nano /etc/ssh/sshd_config
    ```

1. Modify the `sshd_config` file as desired. If you restrict users to certain groups, then the local accounts cannot SSH into that node. The following is only an example of syntax:

    ```bash
    AllowUsers useralias1 useralias2

    AllowGroups groupname1 groupname2
    ```

    Then save changes: **Ctrl + X**, **Y**, **Enter**.

1. Restart sshd.

    ```bash
    sudo systemctl restart sshd
    ```

1. Repeat above steps for each node.

## SSH authentication log

SSH authentication log is written into `/var/log/auth.log`. If you see any login failures through SSH for local or domain accounts, you will need to go through the log to debug the errors. Often the issue might be related to specific user accounts and it's usually a good practice to try other user accounts or SSH using the default SSH user (local account) and then attempt a kinit.

## SSH debug log

To enable verbose logging, you will need to restart `sshd` with the `-d` option. Like `/usr/sbin/sshd -d` You can also run `sshd` at a custom port (like 2222) so that you don't have to stop the main SSH daemon. You can also use `-v` option with the SSH client to get more logs (client side view of the failures).

## Next steps

* [Manage HDInsight clusters with Enterprise Security Package](./apache-domain-joined-manage.md)
* [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).
