---
title: Configure metrics with Grafana  
description: Configure metrics with Grafana    
author: TheovanKraay
ms.service: cassandra-managed-instance
ms.topic: how-to
ms.date: 02/18/2021
ms.author: thvankra

---
# Configure metrics with Grafana 

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When you deploy an Azure Managed Instance for Apache Cassandra cluster, the service provisions a server hosting [Prometheus](https://prometheus.io/), an open-source monitoring solution. The service will emit metrics and retains 10 minutes or 10 GB of data (whichever threshold is reached first). The following guide describes how to:

- Deploy a Ubuntu Virtual Machine inside your Azure Virtual Network
- Install the open-source [Grafana dahsboarding tool](https://grafana.com/grafana/) to visual metrics emitted from Prometheus.

## Deploy Ubuntu Server

1. First navigate to the resource group where you created your Cassandra Managed Instance, click `Add` and search for the latest Ubuntu Server:

    :::image type="content" source="./media/prometheus-grafana/ubuntu.png" alt-text="Find Ubuntu Server" border="false":::

2. Click `Create`. In the create blade, you will need to create a name for the VM, and authentication type, and a region. Ensure you select the region in which your VNET has been deployed:

    :::image type="content" source="./media/prometheus-grafana/ubuntu-create.png" alt-text="Create Ubuntu Server" border="false":::

3. In the networking blade, ensure you select the VNET in which your Cassandra Managed Instance is deployed before creating the VM:

    :::image type="content" source="./media/prometheus-grafana/ubuntu-networking.png" alt-text="Ubuntu Server Network settings" border="false":::

Finally click `Review + Create` to create your Grafana server.

## Install Grafana

1. First, open up the Virtual Network resource in which you have deployed your Cassandra Managed Instance and Grafana Server. You should see a VM scale-set instance named "cassandra-jump (instance 0)". This is the resource on which Prometheus metrics are being hosted. Take note of the IP address of this instance:

    :::image type="content" source="./media/prometheus-grafana/prometheus.png" alt-text="Get Prometheus" border="false":::

2. Connect to your newly created Ubuntu server (you can use [Azure CLI](https://docs.microsoft.com/azure/virtual-machines/linux/ssh-from-windows#ssh-clients) or your preferred client tool to connect via SSH). When connected to the VM, use `nano` to open a file and paste the below script, replacing `<prometheus IP address>` with the IP address you recorded above. 

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

3. When installed, Grafana will be available at port 3000 in the server's IP address:

    :::image type="content" source="./media/prometheus-grafana/grafana.png" alt-text="View Grafana" border="false":::

    You can choose from open-source dashboards created for Apache Cassandra in Grafana such as <a id="raw-url" href="https://raw.githubusercontent.com/TheovanKraay/cassandra-dashboards/main/cluster.json" download>this</a>. Download and import the dashboard's JSON definition into Grafana:

    :::image type="content" source="./media/prometheus-grafana/grafana-import.png" alt-text="Import Grafana" border="false":::
    :::image type="content" source="./media/prometheus-grafana/grafana-import-json.png" alt-text="Import Grafana JSON" border="false":::

4. You can then monitor your cassandra cluster with your chosen dashboard:
    :::image type="content" source="./media/prometheus-grafana/cassandra-monitor.gif" alt-text="View Cassandra Dashboard" border="false":::

## Next steps

Azure Managed Instance for Apache Cassandra hosts a prometheus server which can be consumed by various client tools. In this tutorial, you learned how to configure dashboards for metrics in Prometheus using Grafana. Learn more about Azure Managed Instance for Apache Cassandra:

- [Overview of Azure Managed Instance for Apache Cassandra](introduction.md)
- [Deploy a Managed Apache Spark Cluster with Azure Databricks (Preview)](databricks.md)