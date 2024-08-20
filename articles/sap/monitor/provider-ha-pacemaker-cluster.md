---
title: Create a High Availability Pacemaker cluster provider for Azure Monitor for SAP solutions
description: Learn how to configure high-availability (HA) Pacemaker cluster providers for Azure Monitor for SAP solutions.
author: MightySuz
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: how-to
ms.date: 01/05/2023
ms.author: sujaj
#Customer intent: As a developer, I want to create a high-availability Pacemaker cluster so that I can use the resource with Azure Monitor for SAP solutions.
---

# Create high-availability cluster provider for Azure Monitor for SAP solutions

In this how-to guide, you learn how to create a high-availability (HA) Pacemaker cluster provider for Azure Monitor for SAP solutions. You install the HA agent and then create the provider for Azure Monitor for SAP solutions.

## Prerequisites

- An Azure subscription.
- An existing Azure Monitor for SAP solutions resource. To create an Azure Monitor for SAP solutions resource, see the [quickstart for the Azure portal](quickstart-portal.md) or the [quickstart for PowerShell](quickstart-powershell.md).

## Install an HA agent

Before you add providers for HA (Pacemaker) clusters, install the appropriate agent for RHEL/SUSE in your environment in each of the cluster node.

For SUSE-based clusters, install **ha_cluster_provider** in each node. For more information, see the [HA cluster exporter installation guide](https://github.com/ClusterLabs/ha_cluster_exporter#installation). Supported SUSE versions include SLES for SAP 12 SP3 and later versions.

For SUSE-based Pacemaker clusters, Please follow below steps to install in each of the cluster node

### Install an HA cluster exporter on SUSE

1. Install the required packages for Prometheus cluster exporter on the system.

    ```bash
    sudo zypper install prometheus-ha_cluster_exporter
    ```

1. Enable and start the Prometheus cluster exporter as service

    ```bash
    sudo systemctl start prometheus-ha_cluster_exporter
    ```

    ```bash
    sudo systemctl enable prometheus-ha_cluster_exporter
    ```

1. Data is then collected in the system by ha_cluster_exporter. You can export the data via URL `http://<ip address of the server>:9664/metrics`. 
To check if the metrics are fetched via URL on the server where the ha_cluster_exporter is installed, Run below command on the server.

    ```bash
     curl http://localhost:9664/metrics
    ```

For RHEL-based clusters, install **performance co-pilot (PCP)** and the **pcp-pmda-hacluster** subpackage in each node. For more information, see the [PCP HACLUSTER agent installation guide](https://access.redhat.com/articles/6139852). Supported RHEL versions include 8.2, 8.4, and later versions.

For RHEL-based Pacemaker clusters, Please follow below steps to install in each of the cluster node

### Install an HA cluster exporter on RHEL

1. Install the required packages for PCP on the system.

    ```bash
    sudo yum install pcp pcp-pmda-hacluster
    ```

1. Enable and start the required PCP Collector Services.

    ```bash
    sudo systemctl start pmcd
    ```

    ```bash
    sudo systemctl enable pmcd
    ```

1. Install and enable the HA cluster PMDA. Replace `$PCP_PMDAS_DIR` with the path where `hacluster` is installed. Use the `find` command in Linux to find the path of "hacluster" bits. usually hacluster will be in path "/var/lib/pcp/pmdas".
Example : cd /var/lib/pcp/pmdas/hacluster

    ```bash
    cd $PCP_PMDAS_DIR/hacluster
    ```

    ```bash
    sudo ./Install
    ```

1. Enable and start the `pmproxy` service.

    ```bash
    sudo systemctl start pmproxy
    ```

    ```bash
    sudo systemctl enable pmproxy
    ```

1. Data is then collected in the system by PCP. You can export the data by using `pmproxy` via URL `http://<ipaddress of the serrver>:44322/metrics?names=ha_cluster`. 
To check if the metrics are fetched via URL on the server where the hacluster is installed, Run below command on the server.
    
    ```bash
     curl http://localhost:44322/metrics?names=ha_cluster
    ```

## Prerequisites to enable secure communication

To [enable TLS 1.2 or higher](enable-tls-azure-monitor-sap-solutions.md), follow the steps in [this article](https://github.com/ClusterLabs/ha_cluster_exporter#tls-and-basic-authentication).

## Create a provider for Azure Monitor for SAP solutions

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the Azure Monitor for SAP solutions service.
1. Open your Azure Monitor for SAP solutions resource.
1. On the resource's menu, under **Settings**, select **Providers**.
1. Select **Add** to add a new provider.

    ![Diagram that shows Azure Monitor for SAP solutions resource in the Azure portal, showing button to add a new provider.](./media/provider-ha-pacemaker-cluster/azure-monitor-providers-ha-cluster-start.png)

1. For **Type**, select **High-availability cluster (Pacemaker)**.
1. (Optional) Select **Enable secure communication** and choose a certificate type.
1. Configure providers for each node of the cluster by entering the endpoint URL for **HA Cluster Exporter Endpoint**.

    1. For SUSE-based clusters, enter `http://<IP-address>:9664/metrics`.
    
        ![Diagram that shows the setup for an Azure Monitor for SAP solutions resource, showing the fields for SUSE-based clusters.](./media/provider-ha-pacemaker-cluster/azure-monitor-providers-ha-cluster-suse.png)

    1. For RHEL-based clusters, enter `http://<'IP address'>:44322/metrics?names=ha_cluster`.

        ![Diagram that shows the setup for an Azure Monitor for SAP solutions resource, showing the fields for RHEL-based clusters.](./media/provider-ha-pacemaker-cluster/azure-monitor-providers-ha-cluster-rhel.png)

1. Enter the SID - SAP system ID, Hostname - SAP hostname of the Virtual machine (Command `hostname -s` for SUSE and RHEL based servers will give hostname detail.), Cluster - Provide any custom name that is easy to identify the SAP system cluster - this Name will be visible in the workbook for metrics (need not have to be the cluster name configured on the server). 

1. Click on "Start test" under "Prerequisite check (Preview) - highly recommended" - This test will help validate the connectivity from AMS subnet to the SAP source system and list out if any error's found - which need to be addressed before provider creation otherwise the provider creation will fail with error.
1. Select **Create** to finish creating the Provider.

1. Create provider for each of the servers in the cluster to be able to see the metrics in the workbook
For example - If the Cluster has three servers configured, Create three providers for each of the three servers with all of the above steps followed.

## Troubleshooting

Use the following troubleshooting steps for common errors.

### Unable to reach the Prometheus endpoint

When the provider settings validation operation fails with the code `PrometheusURLConnectionFailure`:

1. Restart the HA cluster exporter agent.

    ```bash
    sudo systemctl start pmproxy
    ```

1. Reenable the HA cluster exporter agent.

    ```bash
    sudo systemctl enable pmproxy
    ```

1. Verify that the Prometheus endpoint is reachable from the subnet that you provided when you created the Azure Monitor for SAP solutions resource.

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Monitor for SAP solutions provider types](providers.md)
