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

## What it collects?

The log collector script is designed to comprehensively gather data across various aspects of the system for troubleshooting and analysis purposes. Below is an overview of the types of diagnostic data it collects:

### System and Kernel Diagnostics

- Kernel Information: Logs, human-readable messages, version, and architecture, for in-depth kernel diagnostics.
- Operating System Logs: Essential logs detailing system activity and container logs for system services.

### Hardware and Resource Usage

- CPU and IO Throttled Processes: Identifies throttling issues, providing insights into performance bottlenecks.
- Network Interface Statistics: Detailed statistics for network interfaces to diagnose errors and drops.

### Software and Services

- Installed Packages: A list of all installed packages, vital for understanding the system's software environment.
- Active System Services: Information on active services, process snapshots, and detailed system and process statistics.
- Container Runtime and Kubernetes Components Logs: Logs for Kubernetes components and other vital services for cluster diagnostics.

### Networking and Connectivity

- Network Connection Tracking Information: Conntrack statistics and connection lists for firewall diagnostics.
- Network Configuration and Interface Details: Interface configurations, IP routing, addresses, and neighbor information.
- Multicard Interface Configuration Logs: Logs related to the configuration of multi-network card interfaces.
- Network Connectivity Tests: Tests external network connectivity and Kubernetes API server communication.
- DNS Resolution Configuration: DNS resolver configuration for diagnosing domain name resolution issues.
- Networking Configuration and Logs: Comprehensive networking data including connection tracking and interface configurations.
- Container Network Interface (CNI) Configuration: Configuration of CNI for container networking diagnostics.

### Security and Compliance

- SELinux Status: Reports the SELinux mode to understand access control and security contexts.
- IPtables Rules: Configuration of IPtables rulesets for insights into firewall settings.

### Storage and Filesystems

- Mount Points and Volume Information: Detailed information on mount points, volumes, disk usage, and filesystem specifics.

### Configuration and Management

- System Configuration: Sysctl parameters for a comprehensive view of kernel runtime configuration.
- Kubernetes Configuration and Health: Kubernetes setup details, including configurations and service listings.
- Container Runtime Information: Configuration, version information, and details on running containers.
- Container Runtime Interface (CRI) Information: Operations data for container runtime interface, aiding in container orchestration diagnostics.

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
