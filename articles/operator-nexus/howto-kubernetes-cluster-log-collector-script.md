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

# Run the log collector script on the Azure Operator Nexus Kubernetes cluster node

Microsoft support may need deeper visibility within the Nexus Kubernetes cluster in certain scenarios. To facilitate this, a log-collection script is available for you to use. This script retrieves all the necessary logs, enabling Microsoft support to gain a better understanding of the issue and troubleshoot it effectively.

## What it collects

The log collector script is designed to comprehensively gather data across various aspects of the system for troubleshooting and analysis purposes. Below is an overview of the types of diagnostic data it collects:

### System and kernel diagnostics

- Kernel information: Logs, human-readable messages, version, and architecture, for in-depth kernel diagnostics.
- Operating System Logs: Essential logs detailing system activity and container logs for system services.

### Hardware and resource usage

- CPU and IO throttled processes: Identifies throttling issues, providing insights into performance bottlenecks.
- Network Interface Statistics: Detailed statistics for network interfaces to diagnose errors and drops.

### Software and services

- Installed packages: A list of all installed packages, vital for understanding the system's software environment.
- Active system services: Information on active services, process snapshots, and detailed system and process statistics.
- Container runtime and Kubernetes components logs: Logs for Kubernetes components and other vital services for cluster diagnostics.

### Networking and connectivity

- Network connection tracking information: Conntrack statistics and connection lists for firewall diagnostics.
- Network configuration and interface details: Interface configurations, IP routing, addresses, and neighbor information.
- Any additional interface configuration and logs: Logs related to the configuration of all interfaces inside the Node.
- Network connectivity tests: Tests external network connectivity and Kubernetes API server communication.
- DNS resolution configuration: DNS resolver configuration for diagnosing domain name resolution issues.
- Networking configuration and logs: Comprehensive networking data including connection tracking and interface configurations.
- Container network interface (CNI) configuration: Configuration of CNI for container networking diagnostics.

### Security and compliance

- SELinux status: Reports the SELinux mode to understand access control and security contexts.
- IPtables rules: Configuration of IPtables rulesets for insights into firewall settings.

### Storage and filesystems

- Mount points and volume information: Detailed information on mount points, volumes, disk usage, and filesystem specifics.

### Configuration and management

- System configuration: Sysctl parameters for a comprehensive view of kernel runtime configuration.
- Kubernetes configuration and health: Kubernetes setup details, including configurations and service listings.
- Container runtime information: Configuration, version information, and details on running containers.
- Container runtime interface (CRI) information: Operations data for container runtime interface, aiding in container orchestration diagnostics.

## Prerequisite

- Ensure that you have SSH access to the Nexus Kubernetes cluster node. If you have direct IP reachability to the node, establish an SSH connection directly. Otherwise, use Azure Arc for servers with the command `az ssh arc`. For more information about various connectivity methods, check out the [connect to the cluster](./howto-kubernetes-cluster-connect.md) article.

## Execution

Once you have SSH access to the node, run the log collector script by executing the command `sudo /opt/log-collector/collect.sh`.

Upon execution, you observe an output similar to:

``` bash
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

Once the log file is generated, you can download the generated log file from your cluster node to your local machine using various methods, including SCP, SFTP, or Azure CLI. However, it's important to note that SCP or SFTP are only possible if you have direct IP reachability to the cluster node. If you don't have direct IP reachability, you can use Azure CLI to download the log file.

This command should look familiar to you, as it's the same command used to SSH into the Nexus Kubernetes cluster node. To download the generated log file from the node to your local machine, use this command again, with the addition of the `cat` command at the end to copy the file.

``` bash
RESOURCE_GROUP="myResourceGroup"
CLUSTER_NAME="myNexusK8sCluster"
SUBSCRIPTION_ID="<Subscription ID>"
USER_NAME="azureuser"
SSH_PRIVATE_KEY_FILE="<vm_ssh_id_rsa>"
MANAGED_RESOURCE_GROUP=$(az networkcloud kubernetescluster show -n $CLUSTER_NAME -g $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID --output tsv --query managedResourceGroupConfiguration.name)
```

> [!NOTE]
> Replace the placeholders variables with actual values relevant to your Azure environment and Nexus Kubernetes cluster.

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
