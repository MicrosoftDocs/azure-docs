---
title: "Azure Operator Nexus: How to run log collector script"
description: Learn how to run the log collector script.
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 03/25/2024
ms.custom: template-how-to
---

# Running the log collector script on the Azure Operator Nexus Kubernetes cluster node

Microsoft support may need deeper visibility within the Nexus Kubernetes cluster in certain scenarios. To facilitate this, a log-collection script is available for you to use. This script retrieves all the necessary logs, enabling Microsoft support to gain a better understanding of the issue and troubleshoot it effectively.

The log collection script is designed to retrieve different kinds of system and application logs from the node. It gathers common operating system logs, details about the system’s mount points and volumes, and logs related to Multus—a multi-network plugin for Kubernetes, if they're present.

Among the system-related logs, it captures kernel logs, sysctl information, and IP Virtual Server administration data. Additionally, the script collects networking information, including connection tracking details, Container Network Interface (CNI) configuration (if available), and interface settings.

Furthermore, the script does network connectivity tests by pinging the default gateway and the API server, provided a kubeconfig file exists.

## Prerequisite

Before proceeding, ensure that you have [SSH access to the Nexus Kubernetes cluster node](./howto-kubernetes-cluster-connect.md#azure-arc-for-servers).


## Execution steps

- Connect to the Nexus Kubernetes cluster node using SSH.
- Run the log collector script by executing the command `sudo /opt/log-collector/collect.sh`.

Upon execution, you observe an output similar to:

```
Trying to check for root... 
Trying to check for required utilities... 
Trying to create required directories... 
Trying to check for disk space... 
Trying to start collecting logs... Trying to collect common operating system logs... 
Trying to collect mount points and volume information... 
Trying to collect SELinux status... 
.
.
Trying to archive gathered information... 
Finishing up...

        Done... your bundled logs are located in /var/log/<node_name_date_time-UTC>.tar.gz
```

## How to download the log file

Once the log file is generated, you can download the generated log file from your cluster node to your local machine using various methods, including SCP, SFTP or Azure CLI. However, it is important to note that SCP or SFTP are only possible if you have direct IP reachability to the cluster node. If you do not have direct IP reachability, you can use Azure CLI to download the log file.

This command should look familiar to you, as it is the same command used to SSH into the Nexus Kubernetes cluster node. To download the generated log file from the node to your local machine, simply use this command again, with the addition of the `cat` command at the end to copy the file.

```azurecli
az ssh arc --subscription $SUBSCRIPTION_ID \
    --resource-group $MANAGED_RESOURCE_GROUP \
    --name <VM Name> \
    --local-user $USER_NAME \
    --private-key-file $SSH_PRIVATE_KEY_FILE
    'sudo cat /var/log/node_name_date_time-UTC.tar.gz' > <Local machine path>/node_name_date_time-UTC.tar.gz
```

In the preceding command, replace `node_name_date_time-UTC.tar.gz` with the name of the log file created in your cluster node, and `<Local machine path>` with the location on your local machine where you want to save the file.

## Next steps

After downloading the tar file to your local machine, you can upload it to the support ticket for the Microsoft support to review the logs.
