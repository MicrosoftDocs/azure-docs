---
title: Collect custom metrics for Linux VM with the InfluxData Telegraf agent
description: Instructions on how to deploy the InfluxData Telegraf agent on a Linux VM in Azure and configure the agent to publish metrics to Azure Monitor. 
services: azure-monitor
ms.reviewer: priyamishra
ms.topic: conceptual
ms.date: 06/16/2022
---
# Collect custom metrics for a Linux VM with the InfluxData Telegraf agent

This article explains how to deploy and configure the [InfluxData](https://www.influxdata.com/) Telegraf agent on a Linux virtual machine to send metrics to Azure Monitor. 

> [!NOTE]
> InfluxData Telegraf is an open source agent and not officially supported by Azure Monitor. For issues wuth the Telegraf connector, please refer to the Telegraf GitHub page here: [InfluxData](https://github.com/influxdata/telegraf)

## InfluxData Telegraf agent 

[Telegraf](https://docs.influxdata.com/telegraf/) is a plug-in-driven agent that enables the collection of metrics from over 150 different sources. Depending on what workloads run on your VM, you can configure the agent to leverage specialized input plug-ins to collect metrics. Examples are MySQL, NGINX, and Apache. By using output plug-ins, the agent can then write to destinations that you choose. The Telegraf agent has integrated directly with the Azure Monitor custom metrics REST API. It supports an Azure Monitor output plug-in. By using this plug-in, the agent can collect workload-specific metrics on your Linux VM and submit them as custom metrics to Azure Monitor. 

 ![Telegraph agent overview](./media/collect-custom-metrics-linux-telegraf/telegraf-agent-overview.png)

> [!NOTE]  
> Custom Metrics are not supported in all regions. Supported regions are listed [here](./metrics-custom-overview.md#supported-regions)


 
## Connect to the VM 

Create an SSH connection with the VM. Select the **Connect** button on the overview page for your VM. 

![Telegraf VM overview page](./media/collect-custom-metrics-linux-telegraf/connect-VM-button2.png)

In the **Connect to virtual machine** page, keep the default options to connect by DNS name over port 22. In **Login using VM local account**, a connection command is shown. Select the button to copy the command. The following example shows what the SSH connection command looks like: 

```cmd
ssh azureuser@XXXX.XX.XXX 
```

Paste the SSH connection command into a shell, such as Azure Cloud Shell or Bash on Ubuntu on Windows, or use an SSH client of your choice to create the connection. 

## Install and configure Telegraf 

To install the Telegraf Debian package onto the VM, run the following commands from your SSH session: 

```bash
# download the package to the VM 
curl -s https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/lsb-release
echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```

Telegraf's configuration file defines Telegraf's operations. By default, an example configuration file is installed at the path **/etc/telegraf/telegraf.conf**. The example configuration file lists all possible input and output plug-ins. However, we'll create a custom configuration file and have the agent use it by running the following commands: 

```bash
# generate the new Telegraf config file in the current directory 
telegraf --input-filter cpu:mem --output-filter azure_monitor config > azm-telegraf.conf 

# replace the example config with the new generated config 
sudo cp azm-telegraf.conf /etc/telegraf/telegraf.conf 
```

> [!NOTE]  
> The preceding code enables only two input plug-ins: **cpu** and **mem**. You can add more input plug-ins, depending on the workload that runs on your machine. Examples are Docker, MySQL, and NGINX. For a full list of input plug-ins, see the **Additional configuration** section. 

Finally, to have the agent start using the new configuration, we force the agent to stop and start by running the following commands: 

```bash
# stop the telegraf agent on the VM 
sudo systemctl stop telegraf 
# start the telegraf agent on the VM to ensure it picks up the latest configuration 
sudo systemctl start telegraf 
```
Now the agent will collect metrics from each of the input plug-ins specified and emit them to Azure Monitor. 

## Plot your Telegraf metrics in the Azure portal 

1. Open the [Azure portal](https://portal.azure.com). 

1. Navigate to the new **Monitor** tab. Then select **Metrics**.  


1. Select your VM in the resource selector.

     ![Metric chart](./media/collect-custom-metrics-linux-telegraf/metric-chart.png)

1. Select the **Telegraf/CPU** namespace, and select the **usage_system** metric. You can choose to filter by the dimensions on this metric or split on them.  

     ![Select namespace and metric](./media/collect-custom-metrics-linux-telegraf/VM-resource-selector.png)

## Additional configuration 

The preceding walkthrough provides information on how to configure the Telegraf agent to collect metrics from a few basic input plug-ins. The Telegraf agent has support for over 150 input plug-ins, with some supporting additional configuration options. InfluxData has published a [list of supported plugins](https://docs.influxdata.com/telegraf/v1.15/plugins/inputs/) and instructions on [how to configure them](https://docs.influxdata.com/telegraf/v1.15/administration/configuration/).  

Additionally, in this walkthrough, you used the Telegraf agent to emit metrics about the VM the agent is deployed on. The Telegraf agent can also be used as a collector and forwarder of metrics for other resources. To learn how to configure the agent to emit metrics for other Azure resources, see [Azure Monitor Custom Metric Output for Telegraf](https://github.com/influxdata/telegraf/blob/4b2e2c5263bb8bd030d2ae101438810c1af61945/plugins/outputs/azure_monitor/README.md).  

## Clean up resources 

When they're no longer needed, you can delete the resource group, virtual machine, and all related resources. To do so, select the resource group for the virtual machine and select **Delete**. Then confirm the name of the resource group to delete. 

## Next steps
- Learn more about [custom metrics](./metrics-custom-overview.md).
