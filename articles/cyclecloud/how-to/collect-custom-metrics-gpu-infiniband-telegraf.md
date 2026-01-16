---
title: Monitor HPC and AI workloads on Azure VMs and Virtual Machine Scale Set(s) using Telegraf and Azure Monitor
description: Learn how to deploy and configure the InfluxData Telegraf agent on a Linux virtual machine to send GPU and InfiniBand metrics to Azure Monitor for HPC and AI workloads.
author: vinil-v
ms.author: padmalathas
ms.reviewer: daramfon10
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 12/29/2025
---

# Monitor HPC and AI workloads on Azure VMs and Virtual Machine Scale Set(s) using Telegraf and Azure Monitor

This article provides guidance for monitoring GPU and InfiniBand metrics on Azure H-series and N-series virtual machines (VMs) by using the Telegraf agent and Azure Monitor. This solution enables real-time collection and visualization of critical hardware metrics for high-performance computing (HPC) and artificial intelligence (AI) workloads.

> [!IMPORTANT]
> InfluxData Telegraf is an open-source agent and not officially supported by Azure Monitor. For issues with the Telegraf connector, refer to the Telegraf GitHub page: [InfluxData](https://github.com/influxdata/telegraf).
> Azure Managed Prometheus now supports VMs and Virtual Machine Scale Set(s), including GPU and InfiniBand monitoring.
For more details, see the official [announcement](https://techcommunity.microsoft.com/blog/azurehighperformancecomputingblog/private-preview-azure-managed-prometheus-on-vm--vmss/4473472)

## Overview

Azure Monitor provides comprehensive monitoring capabilities for CPU, memory, storage, and networking. However, it doesn't natively support GPU or InfiniBand metrics for Azure H-series or N-series VMs. This guide demonstrates how to configure third-party monitoring tools to collect these specialized metrics. This article builds upon the foundational steps outlined in the [Azure Monitor documentation for custom metrics collection using Telegraf](/azure/azure-monitor/agents/collect-custom-metrics-linux-telegraf?tabs=ubuntu).

By leveraging the Telegraf agent and Azure Monitor, this setup enables real-time collection and visualization of key hardware metrics, including GPU utilization, GPU memory usage, InfiniBand port errors, and link flaps. It provides operational insights vital for debugging, performance tuning, and capacity planning in high-performance AI environments.

> [!NOTE]
> While Azure Monitor offers robust monitoring capabilities for CPU, memory, storage, and networking, at the time of writing this article, it does not natively support GPU or InfiniBand metrics for Azure H-series or N-series VMs. To monitor GPU and InfiniBand performance, additional configuration using third-party tools such as Telegraf is required.

Telegraf is a plug-in-driven agent that enables the collection of metrics from over 150 different sources. The Telegraf agent integrates directly with the Azure Monitor custom metrics REST API. It supports an Azure Monitor output plug-in. Using this plug-in, the agent can collect workload-specific metrics on your Linux VM and submit them as custom metrics to Azure Monitor.

## Prerequisites

- An Azure subscription with permissions to register resource providers
- An Azure H-series or N-series VM (for example, Standard_ND96asr_v4) or Virtual Machine Scale Set
- Ubuntu-HPC 22.04 image (recommended) with pre-installed NVIDIA GPU drivers, CUDA, and InfiniBand drivers
- SSH access to the virtual machine

## Architecture

The monitoring solution consists of:
- **Telegraf agent** - Collects GPU and InfiniBand metrics from the VM / Virtual Machine Scale Set
- **Azure Monitor** - Stores and visualizes the collected metrics
- **Managed Identity** - Provides secure authentication for metric transmission

## Step 1: Configure Azure subscription

### Register the resource provider

### [Azure portal](#tab/portal)

Register the **microsoft.insights** resource provider in your Azure subscription to enable custom metrics.

1. Open the Azure portal and navigate to your subscription.
2. In the left menu, select **Resource providers**.
3. Search for **microsoft.insights**.
4. Select the provider and click **Register**.

### [Azure CLI](#tab/CLI)

```azurecli
# Register the Microsoft.Insights resource provider
az provider register --namespace Microsoft.Insights

# Verify registration status
az provider show --namespace Microsoft.Insights --query "registrationState"
```
---

## Enable Managed Identity

### [Azure portal](#tab/portal)
Enable Managed Service Identities to authenticate your Azure VM or Azure Virtual Machine Scale Set with Azure Monitor.

1. Navigate to your VM in the Azure portal.
2. In the left menu under **Security**, select **Identity**.
3. On the **System assigned** tab, set **Status** to **On**.
4. Select **Save**.

> [!TIP]
> You can also use User Managed Identities or Service Principal to authenticate the VM. For more information, see the [Telegraf Azure Monitor output plugin documentation](https://github.com/influxdata/telegraf/tree/release-1.15/plugins/outputs/azure_monitor#authentication).

### [Azure CLI](#tab/CLI)

### For virtual machines
```azurecli
# Enable system-assigned managed identity for VM
az vm identity assign --resource-group myResourceGroup --name myVM

# Retrieve the principal ID for role assignment
az vm identity show --resource-group myResourceGroup --name myVM --query principalId --output tsv
```

### For Virtual Machine Scale Set(s)
```azurecli
# Enable system-assigned managed identity for Virtual Machine Scale Set
az vmss identity assign --resource-group myResourceGroup --name myVMSS

# Retrieve the principal ID for role assignment
az vmss identity show --resource-group myResourceGroup --name myVMSS --query principalId --output tsv
```

For more information, see:
- [Configure managed identities on Azure VMs](/entra/identity/managed-identities-azure-resources/how-to-configure-managed-identities)
- [Configure managed identities on Azure Virtual Machine Scale Set(s)](/entra/identity/managed-identities-azure-resources/how-to-configure-managed-identities-scale-sets)

---

## Install and configure Telegraf

Set up the Telegraf agent inside the VM or Virtual Machine Scale Set to send GPU and InfiniBand data to Azure Monitor.

### Install the Telegraf agent

```bash
# Add the InfluxData repository key
curl -s https://repos.influxdata.com/influxdb.key | sudo apt-key add -

# Add the InfluxData repository
source /etc/lsb-release
echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list

# Add the compatibility key
sudo curl -fsSL https://repos.influxdata.com/influxdata-archive_compat.key | sudo apt-key --keyring /etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg add

# Update package list and install Telegraf
sudo apt-get update
sudo apt-get install telegraf -y
```

### Create base Telegraf configuration and configure GPU and InfiniBand monitoring

Create a base configuration file with Azure Monitor output:

```bash
# Generate base configuration with CPU, memory, and Azure Monitor output
telegraf --input-filter cpu:mem --output-filter azure_monitor config > azm-telegraf.conf
```
Add the NVIDIA SMI and InfiniBand input plugins to the configuration:

```bash
# Add GPU and InfiniBand monitoring configuration
cat << 'EOF' >> azm-telegraf.conf

# Starlark processor for data transformation
[[processors.starlark]]
  source = '''
def apply(metric):
    # Iterate through the fields in the metric
    for key, value in metric.fields.items():
        # If the key relates to memory fields, convert MB to GB
        if "memory" in key and type(value) == "int":
            # Convert MB to GB by dividing by 1024
            metric.fields[key] = float(value) / 1024
        # Check if the field is an integer and convert to float
        elif type(value) == "int":
            metric.fields[key] = float(value)
    return metric
'''

# NVIDIA SMI input configuration
[[inputs.nvidia_smi]]
  bin_path = "/usr/local/cuda/bin/nvidia-smi"
  timeout = "5s"

# InfiniBand input configuration
[[inputs.infiniband]]
  # Uses default configuration to collect all available metrics

EOF
```

### Apply the configuration

Replace the default configuration and restart the Telegraf service:

```bash
# Copy the new configuration to the Telegraf directory
sudo cp azm-telegraf.conf /etc/telegraf/telegraf.conf

# Stop the Telegraf service
sudo systemctl stop telegraf

# Enable and start Telegraf with the new configuration
sudo systemctl enable --now telegraf

# Check service status
sudo systemctl status telegraf
```

### Verify Telegraf configuration

Test the Telegraf configuration to ensure proper setup:

```bash
# Test Telegraf configuration
sudo telegraf --config /etc/telegraf/telegraf.conf --test
```

This command validates the configuration and displays sample metrics that Telegraf sends to Azure Monitor.

### Understanding the configuration

The setup script configures Telegraf with:

- **NVIDIA SMI input plugin** - Collects GPU metrics including utilization, memory usage, and temperature
- **InfiniBand input plugin** - Monitors InfiniBand port status, data transmission, and error counters
- **Azure Monitor output plugin** - Sends metrics to Azure Monitor with one-minute aggregation intervals

## Create monitoring dashboards

### Access Azure Monitor Metrics

1. In the Azure portal, go to your VM or Virtual Machine Scale Set.
1. Select **Metrics** from the monitoring section.
1. Configure metric visualizations by using the collected namespaces.

### Monitor GPU metrics

Configure GPU monitoring by using the `Telegraf/nvidia-smi` namespace:

1. Set **Scope** to your VM or Virtual Machine Scale Set.
1. Select **Metric Namespace**: `Telegraf/nvidia-smi`.
1. Choose from available metrics:
   - `memory_used` - GPU memory utilization.
   - `utilization_gpu` - GPU processing utilization.
   - `temperature_gpu` - GPU temperature.

### Monitor InfiniBand metrics

Configure InfiniBand monitoring by using the `Telegraf/infiniband` namespace:

1. Set **Scope** to your VM or Virtual Machine Scale Set.
1. Select **Metric Namespace**: `Telegraf/infiniband`.
1. Choose from available metrics:
   - `link_downed` - Link status changes.
   - `port_rcv_data` - Data received on port.
   - `port_xmit_data` - Data transmitted on port.
   - `port_rcv_errors` - Port receive errors.

> [!NOTE]
> When you use the `link_downed` metric with Count aggregation, use Max or Min values for accurate results.

:::image type="content" source="../images/azuremonitor-gpu-ib.png" alt-text="Screenshot of Azure Monitor displaying GPU and InfiniBand metrics.":::

### Create custom dashboards

Combine GPU and InfiniBand metrics in custom Azure Monitor dashboards:

1. In Azure Monitor, select **Dashboards**.
1. Create a new dashboard.
1. Add tiles for both `Telegraf/nvidia-smi` and `Telegraf/infiniband` metrics.
1. Configure filters and time ranges as needed.


## Create dashboards in Azure Monitor

Telegraf includes an output plugin specifically designed for Azure Monitor, allowing custom metrics to be sent directly to the platform. Since Azure Monitor supports a metric resolution of one minute, the Telegraf output plugin aggregates metrics into one-minute intervals and sends them to Azure Monitor at each flush cycle.

Metrics from each Telegraf input plugin are stored in a separate Azure Monitor namespace, typically prefixed with **Telegraf/** for easy identification.

### Visualize NVIDIA GPU metrics

To visualize NVIDIA GPU usage in the Azure portal:

1. Navigate to **Monitor** > **Metrics**.
2. Set the scope to your VM.
3. Choose the **Metric Namespace** as **Telegraf/nvidia-smi**.
4. Select metrics such as utilization, memory usage, or temperature.
5. Use filters and splits to analyze data across multiple GPUs or over time.

### Visualize InfiniBand metrics

To monitor InfiniBand performance:

1. In the **Metrics** section, set the scope to your VM.
2. Select the **Metric Namespace** as **Telegraf/infiniband**.
3. Visualize metrics such as port status, data transmitted/received, and error counters.
4. Use filters to break down the data by port or metric type for deeper insights.

> [!NOTE]
> The `link_downed` metric with Aggregation: Count may return incorrect values. Use Max or Min aggregations instead.

Creating custom dashboards in Azure Monitor with both **Telegraf/nvidia-smi** and **Telegraf/infiniband** namespaces allows for unified visibility into GPU and InfiniBand performance.

## Troubleshooting

### Common problems and solutions

**Telegraf doesn't send metrics to Azure Monitor:**
- Verify managed identity is enabled and has proper role assignments.
- Check Telegraf configuration syntax by using `sudo telegraf --config /etc/telegraf/telegraf.conf --test`.
- Review Telegraf logs by using `sudo journalctl -u telegraf -f`.

**Missing GPU metrics:**
- Ensure NVIDIA drivers are properly installed by using `nvidia-smi`.
- Verify CUDA toolkit installation by using `nvcc --version`.
- Check GPU accessibility by using `sudo nvidia-smi -L`.

**InfiniBand metrics don't appear:**
- Verify InfiniBand drivers by using `ibstat`.
- Check port status by using `ibstatus`.
- Ensure proper network connectivity.

### Telegraf service management

```bash
# Check Telegraf service status
sudo systemctl status telegraf

# Start Telegraf service
sudo systemctl start telegraf

# Enable automatic startup
sudo systemctl enable telegraf

# View Telegraf logs
sudo journalctl -u telegraf -f
```

## Security considerations

- Use managed identity for authentication instead of service principals when possible.
- Apply principle of least privilege for role assignments.
- Regularly review and audit monitoring permissions.
- Monitor Telegraf configuration files for unauthorized changes.

## Performance impact

- Telegraf agent has minimal performance overhead (typically less than 1% CPU).
- You can adjust the metrics collection interval based on your requirements.
- Consider network bandwidth usage for high-frequency metric collection.

## Related content

- [Azure N-series GPU VM sizes](/azure/virtual-machines/sizes/overview?#gpu-accelerated)
- [Azure H-series HPC VM sizes](/azure/virtual-machines/sizes/overview?hpc#hpc-vm-sizes)
- [Ubuntu HPC on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-hpc)
- [Telegraf Azure Monitor output plugin documentation](https://github.com/influxdata/telegraf/tree/release-1.15/plugins/outputs/azure_monitor)
- [Understanding MLX5 Linux counters and status parameters](https://enterprise-support.nvidia.com/s/article/understanding-mlx5-linux-counters-and-status-parameters)
