---
title: Configure Grafana to visualize metrics emitted from Azure Managed Instance for Apache Cassandra
description: Learn how to install and configure Grafana in a VM to visualize metrics emitted from an Azure Managed Instance for Apache Cassandra cluster.
author: TheovanKraay
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 03/02/2021
ms.author: thvankra

---

# Configure Grafana to visualize metrics emitted from the managed instance cluster

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When you deploy an Azure Managed Instance for Apache Cassandra cluster, the service provisions a server that hosts [Prometheus](https://prometheus.io/) which can be consumed by various client tools. Prometheus is an open-source monitoring solution. The managed instance will emit metrics and retains 10 minutes or 10 GB of data (whichever threshold reaches first). This article describes how to configure Grafana to visualize metrics emitted from the managed instance cluster. The following tasks are required to visualize metrics:

* Deploy a Ubuntu Virtual Machine inside the Azure Virtual Network where the managed instance is present.
* Install the open-source [Grafana tool](https://grafana.com/grafana/) to build dashboards and visualize metrics emitted from Prometheus.

## Deploy a Ubuntu server

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to the resource group where your managed instance cluster is located. Select **Add** and search for **Ubuntu Server 18.04 LTS** image:

   :::image type="content" source="./media/visualize-prometheus-grafana/select-ubuntu-image.png" alt-text="Find Ubuntu server image from the Azure portal." border="true":::

1. Pick the image and select **Create**.

1. In the **Create a virtual machine** blade, enter values for the following fields, you can leave default values for other fields:

   * **Virtual machine name** - Enter a name for you VM.
   * **Region** - Select the same region where your Virtual Network has been deployed.

   :::image type="content" source="./media/visualize-prometheus-grafana/create-vm-ubuntu.png" alt-text="Fill out the form to create a VM with Ubuntu server image." border="true":::

1. In the **Networking** tab, select the Virtual Network in which your managed instance is deployed:

   :::image type="content" source="./media/visualize-prometheus-grafana/configure-networking-details.png" alt-text="Configure the Ubuntu server's network settings." border="true":::

1. Finally select **Review + Create** to create your Grafana server.

## Install Grafana

1. From the Azure portal, open the Virtual Network where you deployed the managed instance and the Grafana Server. You should see a virtual machine scale set instance named **cassandra-jump (instance 0)**. This Prometheus metrics are hosted in this virtual machine scale set. Make a note of the IP address of this instance:

   :::image type="content" source="./media/visualize-prometheus-grafana/prometheus-instance-address.png" alt-text="Get Prometheus instance's IP address." border="true":::

1. Connect to your newly created Ubuntu server by using [Azure CLI](../virtual-machines/linux/ssh-from-windows.md#ssh-clients) or your preferred client tool to connect via SSH.

1. After connecting to the VM, you have to install and configure Grafana to connect to the virtual machine scale set where the metrics are hosted. Open a command prompt and enter the `nano` command to open a Nano text editor. Paste the following script into the text editor, make sure to replace the `<prometheus IP address>` with the IP address you recorded in the previous step:

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
   
   echo "Configuring grafana"
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

1. Type `ctrl + X` to save the file. You can name the file `grafana.sh`.

1. Enter the `./grafana.sh` command in the command prompt to install Grafana.

1. After installation is complete, Grafana will be available at **port 3000** in the server's IP address as shown in the following screenshot:

   :::image type="content" source="./media/visualize-prometheus-grafana/open-grafana-port.png" alt-text="Run Grafana at port 3000." border="true":::

1. You can choose from open-source dashboards created for Apache Cassandra in Grafana such as the [cluster-overview](https://github.com/TheovanKraay/cassandra-exporter/blob/master/grafana/instaclustr/cluster-overview.json) JSON file. Download and import the dashboard's JSON definition into Grafana:

   :::image type="content" source="./media/visualize-prometheus-grafana/grafana-import.png" alt-text="Import Grafana JSON definition." border="true":::

   :::image type="content" source="./media/visualize-prometheus-grafana/grafana-upload-json.png" alt-text="Upload Grafana JSON definition." border="true":::

1. You can then monitor your cassandra managed instance cluster with the chosen dashboard:

   :::image type="content" source="./media/visualize-prometheus-grafana/monitor-cassandra-metrics.gif" alt-text="View the Cassandra managed instance metrics in the dashboard." border="true":::

## Next steps

In this article, you learned how to configure dashboards to visualize metrics in Prometheus using Grafana. Learn more about Azure Managed Instance for Apache Cassandra with the following articles:

* [Overview of Azure Managed Instance for Apache Cassandra](introduction.md)
* [Deploy a Managed Apache Spark Cluster with Azure Databricks (Preview)](deploy-cluster-databricks.md)
