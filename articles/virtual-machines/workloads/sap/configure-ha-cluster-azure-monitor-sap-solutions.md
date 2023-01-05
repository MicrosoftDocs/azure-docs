---
title: Create a High Availability Pacemaker cluster provider for Azure Monitor for SAP solutions (preview)
description: Learn how to configure High Availability (HA) Pacemaker cluster providers for Azure Monitor for SAP solutions.
author: MightySuz
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.topic: how-to
ms.date: 05/01/2023
ms.author: sujaj
#Customer intent: As a developer, I want to create a High Availability Pacemaker cluster so I can use the resource with Azure Monitor for SAP solutions.
---

# Create High Availability cluster provider for Azure Monitor for SAP solutions (preview)

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-azure-monitor.md)]

In this how-to guide, you'll learn to create a High Availability (HA) Pacemaker cluster provider for Azure Monitor for SAP solutions. You'll install the HA agent, then create the provider for Azure Monitor for SAP solutions.

This content applies to both Azure Monitor for SAP solutions and Azure Monitor for SAP solutions (classic) versions.

## Prerequisites

- An Azure subscription.
- An existing Azure Monitor for SAP solutions resource. To create an Azure Monitor for SAP solutions resource, see the [quickstart for the Azure portal](azure-monitor-sap-quickstart.md) or the [quickstart for PowerShell](azure-monitor-sap-quickstart-powershell.md).

## Install HA agent

Before adding providers for HA (Pacemaker) clusters, install the appropriate agent for your environment in each cluster node.

For SUSE-based clusters, install **ha_cluster_provider** in each node. For more information, see [the HA cluster exporter installation guide](https://github.com/ClusterLabs/ha_cluster_exporter#installation). Supported SUSE versions include SLES for SAP 12 SP3 and above.

For RHEL-based clusters, install **performance co-pilot (PCP)** and the **pcp-pmda-hacluster** sub package in each node.For more information, see the [PCP HACLUSTER agent installation guide](https://access.redhat.com/articles/6139852). Supported RHEL versions include 8.2, 8.4 and above.

For RHEL-based pacemaker clusters, also install [PMProxy](https://access.redhat.com/articles/6139852) in each node.

### Steps to install HA Cluster Exporter on RHEl system:
1. Install the required packages on the system.
    1. yum install pcp pcp-pmda-hacluster
1. Enable and start the required PCP Collector Services.
    1. systemctl enable pmcd
    1. systemctl start pmcd
1. Install and enable the HA Cluster PMDA. (replace $PCP_PMDAS_DIR with the path where hacluster is installed, use find command in linux to find it)
    1. cd $PCP_PMDAS_DIR/hacluster
    1. ./install
1. Enable and start the pmproxy service.
    1. sstemctl start pmproxy
    1. systemctl enable pmproxy
1. Data will then be collected by PCP on the system and can be exported via pmproxy at the following address:
    1. http://<'servername or ip address'>:44322/metrics?names=ha_cluster

## Create provider for Azure Monitor for SAP solutions

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the Azure Monitor for SAP solutions service.
1. Open your Azure Monitor for SAP solutions resource.
1. In the resource's menu, under **Settings**, select **Providers**.
1. Select **Add** to add a new provider.

    ![Diagram of Azure Monitor for SAP solutions resource in the Azure portal, showing button to add a new provider.](./media/azure-monitor-sap/azure-monitor-providers-ha-cluster-start.png)

1. For **Type**, select **High-availability cluster (Pacemaker)**.
1. Configure providers for each node of the cluster by entering the endpoint URL for **HA Cluster Exporter Endpoint**.

    1. For SUSE-based clusters, enter `http://<'IP address'> :9664/metrics`.

    ![Diagram of the setup for an Azure Monitor for SAP solutions resource, showing the fields for SUSE-based clusters.](./media/azure-monitor-sap/azure-monitor-providers-ha-cluster-suse.png)


    1. For RHEL-based clusters, enter `http://<'IP address'>:44322/metrics?names=ha_cluster`.

    ![Diagram of the setup for an Azure Monitor for SAP solutions resource, showing the fields for RHEL-based clusters.](./media/azure-monitor-sap/azure-monitor-providers-ha-cluster-rhel.png)


1. Enter the system identifiers, host names, and cluster names. For the system identifier, enter a unique SAP system identifier for each cluster. For the hostname, the value refers to an actual hostname in the VM. Use `hostname -s` for SUSE- and RHEL-based clusters.

1. Select **Add provider** to save.

1. Continue to add more providers as needed.

1. Select **Review + create** to review the settings.

1. Select **Create** to finish creating the resource.

## Trouble shooting guide for common exceptions

### Unable to reach the prometheus endpoint
The provider settings validation operation has failed with code ‘PrometheusURLConnectionFailure’.

1. Try to restart the ha cluster exporter agent:
    1. sstemctl start pmproxy
    1. systemctl enable pmproxy
1. Please verify if the prometheus endpoint provided is reachable from the subnet provided while creating Azure Monitor for Sap Solutions resource.

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Monitor for SAP solutions provider types](azure-monitor-providers.md)
