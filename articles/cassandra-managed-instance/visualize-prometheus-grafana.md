---
title: Configure Grafana to visualize metrics emitted from the managed instance cluster
description: Configure metrics with Grafana
author: TheovanKraay
ms.service: cassandra-managed-instance
ms.topic: how-to
ms.date: 03/02/2021
ms.author: thvankra

---

# Configure Grafana to visualize metrics emitted from the managed instance cluster

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When you deploy an Azure Managed Instance for Apache Cassandra cluster, the service provisions a server hosting [Prometheus](https://prometheus.io/). Prometheus is an open-source monitoring solution. The managed instance will emit metrics and retains 10 minutes or 10 GB of data (whichever threshold reaches first). This article describes how to configure Grafana to visualize metrics emitted from the managed instance cluster. The following tasks are required to visualize metrics:

* Deploy a Ubuntu Virtual Machine inside the Azure Virtual Network where the managed instance is present.
* Install the open-source [Grafana tool](https://grafana.com/grafana/) to build dashboards and visualize metrics emitted from Prometheus.

## Deploy a Ubuntu server

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to the resource group where your managed instance cluster is located. Select **Add** and search for **Ubuntu Server 18.04 LTS** image:

   :::image type="content" source="./media/prometheus-grafana/ubuntu.png" alt-text="Find Ubuntu Server" border="true":::

1. Pick the image and select **Create**. In the create blade, you will need to create a name for the VM, and authentication type, and a region. Ensure you select the region in which your VNET has been deployed:

   :::image type="content" source="./media/prometheus-grafana/ubuntu-create.png" alt-text="Create Ubuntu Server" border="true":::

1. In the networking blade, ensure you select the VNET in which your Cassandra Managed Instance is deployed before creating the VM:

   :::image type="content" source="./media/prometheus-grafana/ubuntu-networking.png" alt-text="Ubuntu Server Network settings" border="true":::

Finally click **Review + Create** to create your Grafana server.

## Install Grafana

1. Open the Virtual Network where you have deployed the managed instance and the Grafana Server. You should see a VM scale-set instance named "cassandra-jump (instance 0)". This is the resource on which Prometheus metrics are being hosted. Take note of the IP address of this instance:

   :::image type="content" source="./media/prometheus-grafana/prometheus.png" alt-text="Get Prometheus" border="true":::

1. Connect to your newly created Ubuntu server (you can use [Azure CLI](https://docs.microsoft.com/azure/virtual-machines/linux/ssh-from-windows#ssh-clients) or your preferred client tool to connect via SSH). When connected to the VM, use `nano` to open a file and paste the below script, replacing `<prometheus IP address>` with the IP address you recorded above.

   ```bash
   #!/bin/bash
   
   echo "Installing Grafana..."
   
   if ! $SSH dpkg -s grafana prometheus > /dev/null; then
       echo "Installing packages."
       echo 'deb https://packages.grafana.com/oss/deb stable main' | $SSH sudo tee /etc/apt/sources.list.d/grafana.list > /dev/null
       curl https://packages.grafana.com/gpg.key | $SSH sudo apt-key add -
       $SSH sudo apt-get update
       $SSH sudo apt-get install -y grafana prometheus
   else
       echo "Skipping package installation"
   fi
   
   echo "Configureing grafana"
   cat <<EOF | $SSH sudo tee /etc/grafana/provisioning/datasources/prometheus.yml
   apiVersion: 1
   datasources:
     - name: Prometheus
       type: prometheus
       url: https://<prometheus IP address>:9443
       jsonData:
         tlsSkipVerify: true
   EOF
   
   echo "Restarting Grafana"
   $SSH sudo systemctl enable grafana-server
   $SSH sudo systemctl restart grafana-server
   
   echo "Installing Grafana plugins"
   $SSH sudo grafana-cli plugins install natel-discrete-panel
   $SSH sudo grafana-cli plugins install grafana-polystat-panel
   $SSH sudo systemctl restart grafana-server
   ```

    Press ctrl + X to save the file with a name like `grafana.sh`, and then run the script by typing `./grafana.sh` then enter.

1. When installed, Grafana will be available at port 3000 in the server's IP address:

   :::image type="content" source="./media/prometheus-grafana/grafana.png" alt-text="View Grafana" border="true":::

    You can choose from open-source dashboards created for Apache Cassandra in Grafana such as [this](https://github.com/TheovanKraay/cassandra-exporter/blob/master/grafana/instaclustr/cluster-overview.json). Download and import the dashboard's JSON definition into Grafana:

   :::image type="content" source="./media/prometheus-grafana/grafana-import.png" alt-text="Import Grafana" border="true":::
   :::image type="content" source="./media/prometheus-grafana/grafana-import-json.png" alt-text="Import Grafana JSON" border="true":::

1. You can then monitor your cassandra cluster with your chosen dashboard:

   :::image type="content" source="./media/prometheus-grafana/cassandra-monitor.gif" alt-text="View Cassandra Dashboard" border="true":::

## Next steps

Azure Managed Instance for Apache Cassandra hosts a prometheus server which can be consumed by various client tools. In this tutorial, you learned how to configure dashboards for metrics in Prometheus using Grafana. Learn more about Azure Managed Instance for Apache Cassandra:

* [Overview of Azure Managed Instance for Apache Cassandra](introduction.md)
* [Deploy a Managed Apache Spark Cluster with Azure Databricks (Preview)](databricks.md)