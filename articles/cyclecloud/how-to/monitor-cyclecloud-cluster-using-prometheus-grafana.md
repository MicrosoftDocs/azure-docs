---
title: Monitor CycleCloud clusters with Prometheus and Grafana
description: Learn how to configure integrated monitoring for Azure CycleCloud clusters using Prometheus self-agent and Azure Managed Grafana for real-time visibility into GPU, InfiniBand, and system metrics.
ms.service: azure-cyclecloud
ms.topic: how-to
ms.date: 01/22/2026
author: xpillons
ms.author: padmalathas
---

# Monitor CycleCloud clusters with Prometheus and Grafana

This article provides guidance for configuring integrated monitoring for Azure CycleCloud clusters using Prometheus self-agent and Azure Managed Grafana. This solution enables real-time collection and visualization of GPU, InfiniBand, and system metrics for high-performance computing (HPC) and artificial intelligence (AI) workloads.

## Overview

Starting with CycleCloud 8.8.1, monitoring your Slurm clusters is easier and more powerful than ever. By using the Prometheus self-agent, you can automate the collection of metrics from compute nodes and Slurm jobs. You get real-time insights into cluster performance and resource utilization. When you use Azure Managed Grafana, you can visualize these metrics through customizable dashboards. You can easily track system health, identify bottlenecks, and optimize workloads.

This seamless monitoring solution reduces operational overhead and enhances the reliability of your HPC environment.

The monitoring setup includes installation and configuration of:

- Prometheus Node Exporter (with InfiniBand support)
- NVIDIA DCGM exporter (for NVIDIA GPU nodes)
- SchedMD Slurm exporter (for Slurm scheduler nodes)

## Prerequisites

Before you begin, ensure you have:

- An Azure subscription with permissions to create resources and register resource providers
- Azure CLI installed on your local machine (don't run deployment scripts from CycleCloud VM or Cloud Shell)
- An existing CycleCloud 8.8.1 or later environment, or Azure CycleCloud Workspace for Slurm deployment
- Permissions to create Azure Monitor Workspace and Azure Managed Grafana resources

## Architecture

The monitoring solution consists of:

| Component | Description |
|-----------|-------------|
| **Prometheus self-agent** | Collects GPU, InfiniBand, and system metrics from each cluster node |
| **Azure Monitor Workspace for Prometheus** | Stores and manages the collected metrics |
| **Azure Managed Grafana** | Provides customizable dashboards for metric visualization |
| **Managed Identity** | Provides secure authentication for metric transmission |

## Create the managed monitoring infrastructure

Set up Azure Monitor Workspace for Prometheus and Azure Managed Grafana to receive and visualize metrics from your CycleCloud clusters.

### Step 1: Create a resource group

Create a dedicated resource group for the monitoring infrastructure:

```azurecli
az group create --location <location> --name <monitoring_resource_group>
```

### Step 2: Deploy the monitoring infrastructure

Clone the monitoring repository and run the deployment script:

```bash
git clone https://github.com/Azure/cyclecloud-monitoring.git
cd cyclecloud-monitoring
./infra/deploy.sh <monitoring_resource_group>
```

After deployment, the script creates the following resources in your specified resource group:

- An Azure Monitor Workspace named `ccw-mon-xxx`
- An Azure Managed Grafana instance named `ccw-graf-xxx`
- Preconfigured dashboards for cluster monitoring

### Step 3: Grant monitoring permissions to managed identity

To publish metrics to the Azure Monitor Workspace, the managed identity needs the `Monitoring Metrics Publisher` role. Assign this role to the managed identity that your cluster nodes use.

#### For CycleCloud Workspace for Slurm deployments

If you're using CycleCloud Workspace for Slurm (CCWS), assign the role to the `ccwLockerManagedIdentity` that the CCWS deployment creates:

```bash
./infra/add_publisher.sh <ccws_resource_group> ccwLockerManagedIdentity
```

#### For custom managed identity deployments

If you're using your own managed identity, run the same script with your managed identity name:

```bash
./infra/add_publisher.sh <umi_resource_group> <umi_name>
```

## Retrieve monitoring configuration parameters

To enable monitoring on your cluster nodes, you need three configuration parameters.

### Get the managed identity client ID

Retrieve the client ID of the managed identity with the `Monitoring Metrics Publisher` role:

```azurecli
az identity show --name <umi_name> --resource-group <umi_resource_group> --query 'clientId' --output tsv
```

For CCWS deployments, use `ccwLockerManagedIdentity` as the identity name.

### Get the ingestion endpoint

Retrieve the ingestion endpoint from the deployment outputs:

```bash
jq -r '.properties.outputs.ingestionEndpoint.value' <infra_monitoring_dir>/outputs.json
```

Alternatively, you can find these values in the Azure portal by navigating to your Azure Monitor Workspace properties.

### Get the data collection rules

You can retrieve the data collection rules from the Azure Monitor Workspace properties in the Azure portal.

## Enable monitoring

You can enable monitoring during initial deployment or on an existing cluster.

### Option 1: Enable during CycleCloud Workspace for Slurm deployment

When you deploy Azure CycleCloud Workspace for Slurm from the Azure Marketplace:

1. Go to the **Monitoring** section in the deployment wizard.
1. Select the checkbox to enable monitoring.
1. Enter the **Monitoring ingestion endpoint** from your Azure Monitor Workspace properties.
1. Enter the **Data collection rules** from your Azure Monitor Workspace properties.

### Option 2: Enable in CycleCloud cluster settings

Starting with CycleCloud 8.8.1, the monitoring option is included in the Slurm default template:

1. Open the CycleCloud portal and go to your cluster.
1. Select **Edit** on the cluster configuration.
1. Go to the **Monitoring** tab.
1. Enable monitoring and provide the following values:
   - **Client ID**: The client ID of the managed identity with `Monitoring Metrics Publisher` role (for CCWS, use `ccwLockerManagedIdentity`)
   - **Ingestion Endpoint**: The Azure Monitor Workspace ingestion endpoint

### Option 3: Configure manually for other cluster types

For non-Slurm cluster types, add the cluster-init project and set the monitoring parameters:

1. Add the following line to your cluster template after each node array configuration:

   ```ini
   [[[cluster-init cyclecloud/monitoring:default]]]
   ```

1. Set the monitoring parameters for each node and node array:

   ```ini
   cyclecloud.monitoring.enabled = true
   cyclecloud.monitoring.identity_client_id = <client_id>
   cyclecloud.monitoring.ingestion_endpoint = <ingestion_endpoint>
   ```

1. In the CycleCloud portal, select your cluster and edit the scheduler node settings.
1. In **Software/Configuration**, paste the three monitoring parameters.
1. Save and repeat for each node array and individual nodes.

## Access Grafana dashboards

After your cluster starts with monitoring enabled, access the visualization dashboards:

1. Navigate to your Azure Managed Grafana instance in the Azure portal.
1. Select the **Endpoint** URL to open the Grafana portal.
1. Expand **Dashboards > Azure CycleCloud** to view the available dashboards.

## Available metrics

Depending on the node type, the monitoring solution collects the following metrics:

### GPU metrics

For nodes with NVIDIA GPUs, track:

- GPU utilization rates
- Memory copy utilization
- Clock speeds (graphics, SM, memory)
- Temperature
- Power consumption
- ECC error counts
- NVLink throughput statistics

### InfiniBand metrics

For nodes with InfiniBand networking, monitor:

- Port throughput (transmit and receive)
- Error occurrences
- Link status

### System metrics

For all nodes, track:

- CPU usage and frequency
- Memory utilization
- Disk space usage
- Network activity
- File system capacity
- NFS operations and throughput

### Slurm metrics

For Slurm scheduler nodes, monitor:

- Job queue statistics
- Node state information
- Partition utilization

## Verify metrics collection

After you enable monitoring, verify that metrics are collected correctly.

### Check metrics in Azure Monitor

1. Go to your Azure Monitor Workspace in the Azure portal.
1. Select **Managed Prometheus > Prometheus explorer** from the left panel.
1. Use the `up` PromQL keyword to verify that configured nodes are listed.

### Verify exporters on nodes

Connect to a cluster node and run the following commands to verify each exporter:

```bash
# Node Exporter (available on all nodes)
curl -s http://localhost:9100/metrics

# DCGM Exporter (only on nodes with NVIDIA GPUs)
curl -s http://localhost:9400/metrics

# Slurm Exporter (only on Slurm scheduler node)
curl -s http://localhost:9200/metrics
```

## Troubleshooting

### Metrics aren't appearing in Azure Monitor

- Verify the managed identity has the `Monitoring Metrics Publisher` role on the Data Collection Rule.
- Check that the ingestion endpoint and client ID are correctly configured.
- Ensure nodes can reach the Azure Monitor endpoint (check network security groups and firewall rules).
- Review node logs for authentication or connectivity errors.

### GPU metrics are missing

- Verify NVIDIA drivers are installed: `nvidia-smi`
- Check DCGM exporter status: `curl -s http://localhost:9400/metrics`
- Ensure the node has an NVIDIA GPU attached.

### InfiniBand metrics are missing

- Verify InfiniBand drivers: `ibstat`
- Check port status: `ibstatus`
- Ensure InfiniBand network connectivity.

### Grafana dashboards show no data

- Verify the Grafana instance has access to the Azure Monitor Workspace.
- Check that the correct time range is selected in Grafana.
- Ensure the cluster has been running long enough for metrics to be collected and ingested.

## Limitations

Azure Monitor Workspace has default ingestion limits:

- 1 million time series per minute
- 1 million events per minute

Reaching these limits results in throttling and delayed ingestion. Based on current exporters, you reach these limits at approximately:

| VM Type | Approximate Node Limit |
|---------|------------------------|
| HBv4 (176 cores) | ~125 nodes |
| NDv5 (96 cores) | ~154 nodes |
| NCv4 (48 cores) | ~285 nodes |

If you need to monitor larger clusters, [request an increase in ingestion limits](/azure/azure-monitor/metrics/azure-monitor-workspace-monitor-ingest-limits?tabs=azure-portal#request-for-an-increase-in-ingestion-limits-preview).


## Related content

- [Overview of Azure CycleCloud Workspace for Slurm](/azure/cyclecloud/overview-ccws)
- [Deploy Azure CycleCloud Workspace for Slurm](/azure/cyclecloud/qs-deploy-ccws)
- [Azure Monitor Workspace overview](/azure/azure-monitor/essentials/azure-monitor-workspace-overview)
- [Azure Managed Grafana overview](/azure/managed-grafana/overview)
- [cyclecloud-monitoring GitHub repository](https://github.com/Azure/cyclecloud-monitoring)
- [Azure N-series GPU VM sizes](/azure/virtual-machines/sizes/overview#gpu-accelerated)
- [Azure H-series HPC VM sizes](/azure/virtual-machines/sizes/overview#hpc-vm-sizes)
