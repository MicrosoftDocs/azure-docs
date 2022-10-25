---
title: Configure Grafana to visualize metrics emitted from Azure Managed Instance for Apache Cassandra
description: Learn how to install and configure Grafana in a VM to visualize metrics emitted from an Azure Managed Instance for Apache Cassandra cluster.
author: TheovanKraay
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 11/16/2021
ms.author: thvankra
ms.custom: ignite-fall-2021
---

# Configure Grafana to visualize metrics emitted from the managed instance cluster

When you deploy an Azure Managed Instance for Apache Cassandra cluster, the service provisions [Metric Collector for Apache Cassandra](https://github.com/datastax/metric-collector-for-apache-cassandra) agent software on each data node. The metrics can be consumed by [Prometheus](https://prometheus.io/) and visualized through Grafana. This article describes how to configure Prometheus and Grafana to visualize metrics emitted from your managed instance cluster. 

The following tasks are required to visualize metrics:

* Deploy an Ubuntu Virtual Machine inside the Azure Virtual Network where the managed instance is present.
* Install the [Prometheus Dashboards](https://github.com/datastax/metric-collector-for-apache-cassandra#installing-the-prometheus-dashboards) onto the VM.

>[!WARNING]
> Prometheus and Grafana are open-source software and not supported as part of the Azure Managed Instance for Apache Cassandra service. Visualizing metrics in the way described below will require you to host and maintain a virtual machine as the server for both Prometheus and Grafana. The instructions below were tested only for Ubuntu Server 18.04, there is no guarantee that they will work with other linux distributions. Following this approach will entail supporting any issues that may arise, such as running out of space, or availability of the server. For a fully supported and hosted metrics experience, consider using [Azure Monitor metrics](monitor-clusters.md#azure-metrics), or alternatively [Azure Monitor partner integrations](../azure-monitor/partners.md).

## Deploy an Ubuntu server

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

1. Finally select **Review + Create** to create your Metrics server.

## Install Prometheus Dashboards

1. First, ensure the networking settings for your newly deployed Ubuntu server have inbound port rules allowing ports `9090` and `3000`. These will be required later for Prometheus and Grafana respectively. 

   :::image type="content" source="./media/visualize-prometheus-grafana/networking.png" alt-text="Allow ports" border="true":::

1. Connect to your Ubuntu server by using [Azure CLI](../virtual-machines/linux/ssh-from-windows.md#ssh-clients) or your preferred client tool to connect via SSH.

1. After connecting to the VM, you have to install the metrics collector software. First, download and unzip the files:

   ```bash
    #install unzip utility (if not already installed)
    sudo apt install unzip
    
    #get dashboards
    wget https://github.com/datastax/metric-collector-for-apache-cassandra/releases/download/v0.3.0/datastax-mcac-dashboards-0.3.0.zip -O temp.zip
    unzip temp.zip
   ```

1. Next, navigate to the prometheus directory and use vi to edit the `tg_mcac.json` file:

   ```bash
    cd */prometheus
    vi tg_mcac.json    
   ```


1. Add the ip addresses of each node in your cluster in `targets`, each with port 9443. Your `tg_mcac.json` file should look like the below:

   ```bash
    [
      {
        "targets": [
          "10.9.0.6:9443","10.9.0.7:9443","10.9.0.8:9443"
        ],
        "labels": {
    
        }
      }
    ]  
   ```

1. Save the file. Next, edit the `prometheus.yaml` file in the same directory. Locate the following section:

   ```bash
    file_sd_configs:
      - files:
        - 'tg_mcac.json'
   ```

1. Directly below this section, add the following. This is required because metrics are exposed via https.

   ```bash
    scheme: https
    tls_config:
            insecure_skip_verify: true
   ```

1. The file should now look like the following. Ensure the tabs on each line are as below. 

   ```bash
    file_sd_configs:
      - files:
        - 'tg_mcac.json'
    scheme: https
    tls_config:
            insecure_skip_verify: true
   ```

1. Save the file. You are now ready to start Prometheus and Grafana. First, install Docker:

    ```bash
    sudo apt install apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu `lsb_release -cs` test"
    sudo apt update
    sudo apt install docker-ce
    ```

1. Then install docker compose:

    ```bash
    sudo apt install docker-compose
    ```

1. Now navigate to the top level directory where `docker-compose.yaml` is located, and start the application:

    ```bash
    cd ..
    sudo docker-compose up
    ```

1. Prometheus should be available at port `9090`, and Grafana dashboards on port `3000` on your metrics server:

   :::image type="content" source="./media/visualize-prometheus-grafana/monitor-cassandra-metrics.png" alt-text="View the Cassandra managed instance metrics in the dashboard." border="true":::


## Next steps

In this article, you learned how to configure dashboards to visualize metrics in Prometheus using Grafana. Learn more about Azure Managed Instance for Apache Cassandra with the following articles:

* [Overview of Azure Managed Instance for Apache Cassandra](introduction.md)
* [Deploy a Managed Apache Spark Cluster with Azure Databricks](deploy-cluster-databricks.md)