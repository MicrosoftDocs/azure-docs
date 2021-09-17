---
title: Azure Monitor for SAP Solutions providers| Microsoft Docs
description: This article provides answers to frequently asked questions about Azure monitor for SAP solutions providers.
author: rdeltcheva
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.topic: article
ms.date: 07/06/2021
ms.author: radeltch

---

# Azure Monitor for SAP Solutions providers (preview)

## Overview

This article describes the various providers currently available for Azure Monitor for SAP Solutions.

In the context of Azure Monitor for SAP Solutions, a *provider type* refers to a specific *provider*. For example, *SAP HANA*, which is configured for a specific component within the SAP landscape, like SAP HANA database. A provider contains the connection information for the corresponding component and helps to collect telemetry data from that component. One Azure Monitor for SAP Solutions resource (also known as SAP monitor resource) can be configured with multiple providers of the same provider type or multiple providers of multiple provider types.
   
You can choose to configure different provider types to enable data collection from the corresponding component in their SAP landscape. For example, you can configure one provider for SAP HANA provider type, another provider for high-availability cluster provider type, and so on.  

You can also configure multiple providers of a specific provider type to reuse the same SAP monitor resource and associated managed group. For more information on managed resource groups, see [Manage Azure Resource Manager resource groups by using the Azure portal](../../../azure-resource-manager/management/manage-resource-groups-portal.md).

For public preview, the following provider types are supported:   
- SAP NetWeaver
- SAP HANA
- Microsoft SQL Server
- High-availability cluster
- Operating system (OS)

![Azure Monitor for SAP solutions providers](https://user-images.githubusercontent.com/75772258/115047655-5a5b2c00-9ef6-11eb-9e0c-073e5e1fcd0e.png)

We recommend you configure at least one provider from the available provider types when deploying the SAP monitor resource. By configuring a provider, you start data collection from the corresponding component for which the provider is configured.   

If you don't configure any providers at the time of deploying SAP monitor resource, although the SAP monitor resource will be successfully deployed, no telemetry data will be collected. You can add providers after deployment through the SAP monitor resource within the Azure portal. You can add or delete providers from the SAP monitor resource at any time.

## Provider type: SAP NetWeaver

You can configure one or more providers of provider type SAP NetWeaver to enable data collection from SAP NetWeaver layer. AMS NetWeaver provider uses the existing [SAPControl Web service](https://www.sap.com/documents/2016/09/0a40e60d-8b7c-0010-82c7-eda71af511fa.html) interface to retrieve the appropriate telemetry information.

For the current release, the following SOAP web methods are the standard, out-of-box methods invoked by AMS.

![image1](https://user-images.githubusercontent.com/75772258/114600036-820d8280-9cb1-11eb-9f25-d886ab1d5414.png)

In public preview, you can expect to see the following data with the SAP NetWeaver provider: 
- System and instance availability
- Work process usage
- Queue usage
- Enqueue lock statistics

![image](https://user-images.githubusercontent.com/75772258/114581825-a9f2eb00-9c9d-11eb-8e6f-79cee7c5093f.png)

## Provider type: SAP HANA

You can configure one or more providers of provider type *SAP HANA* to enable data collection from SAP HANA database. The SAP HANA provider connects to the SAP HANA database over SQL port, pulls telemetry data from the database, and pushes it to the Log Analytics workspace in your subscription. The SAP HANA provider collects data every 1 minute from the SAP HANA database.  

In public preview, you can expect to see the following data with the SAP HANA provider:
- Underlying infrastructure usage
- SAP HANA host status
- SAP HANA system replication
- SAP HANA Backup telemetry data. 

Configuring the SAP HANA provider requires:
- The host IP address, 
- HANA SQL port number
- SYSTEMDB username and password

We recommend you configure the SAP HANA provider against SYSTEMDB; however, more providers can be configured against other database tenants.

![Azure Monitor for SAP solutions providers - SAP HANA](./media/azure-monitor-sap/azure-monitor-providers-hana.png)

## Provider type: Microsoft SQL server

You can configure one or more providers of provider type *Microsoft SQL Server* to enable data collection from [SQL Server on Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/). The SQL Server provider connects to Microsoft SQL Server over the SQL port. It then pulls telemetry data from the database and pushes it to the Log Analytics workspace in your subscription. Configure SQL Server for SQL authentication and for signing in with the SQL Server username and password. Set the SAP database as the default database for the provider. The SQL Server provider collects data from every 60 seconds up to every hour from the SQL server.  

In public preview, you can expect to see the following data with SQL Server provider:
- Underlying infrastructure usage
- Top SQL statements
- Top largest table
- Problems recorded in the SQL Server error log
- Blocking processes and others  

Configuring Microsoft SQL Server provider requires:
- The SAP System ID
- The Host IP address
- The SQL Server port number
- The SQL Server username and password

![Azure Monitor for SAP solutions providers - SQL](./media/azure-monitor-sap/azure-monitor-providers-sql.png)

## Provider type: High-availability cluster
You can configure one or more providers of provider type *High-availability cluster* to enable data collection from Pacemaker cluster within the SAP landscape. The High-availability cluster provider connects to Pacemaker using the [ha_cluster_exporter](https://github.com/ClusterLabs/ha_cluster_exporter) for **SUSE** based clusters and by using [Performance co-pilot](https://access.redhat.com/articles/6139852) for **RHEL** based clusters. AMS then pulls telemetry data from the database and pushes it to Log Analytics workspace in your subscription. The High-availability cluster provider collects data every 60 seconds from Pacemaker.  

In public preview, you can expect to see the following data with the High-availability cluster provider:   
 - Cluster status represented as a roll-up of node and resource status 
 - Location constraints
 - Trends
 - [others](https://github.com/ClusterLabs/ha_cluster_exporter/blob/master/doc/metrics.md) 

![Azure Monitor for SAP solutions providers - High-availability cluster](./media/azure-monitor-sap/azure-monitor-providers-pacemaker-cluster.png)

To configure a High-availability cluster provider, two primary steps are involved:

1. Install [ha_cluster_exporter](https://github.com/ClusterLabs/ha_cluster_exporter) in *each* node within the Pacemaker cluster.

   You have two options for installing ha_cluster_exporter:
   
   - Use Azure Automation scripts to deploy a high-availability cluster. The scripts install [ha_cluster_exporter](https://github.com/ClusterLabs/ha_cluster_exporter) on each cluster node.  
   - Do a [manual installation](https://github.com/ClusterLabs/ha_cluster_exporter#manual-clone--build). 

2. Configure a High-availability cluster provider for *each* node within the Pacemaker cluster.

   To configure the High-availability cluster provider, the following information is required:
   
   - **Name**. A name for this provider. It should be unique for this Azure Monitor for SAP solutions instance.
   - **Prometheus Endpoint**. http\://\<servername or ip address\>:9664/metrics.
   - **SID**. For SAP systems, use the SAP SID. For other systems (for example, NFS clusters), use a three-character name for the cluster. The SID must be distinct from other clusters that are monitored.   
   - **Cluster name**. The cluster name used when creating the cluster. The cluster name can be found in the cluster property `cluster-name`.
   - **Hostname**. The Linux hostname of the virtual machine (VM).  

## Provider type: OS (Linux)
You can configure one or more providers of provider type OS (Linux) to enable data collection from a BareMetal or VM node. The OS (Linux) provider connects to BareMetal or VM nodes using the [Node_Exporter](https://github.com/prometheus/node_exporter) endpoint. It then pulls telemetry data from the nodes and pushes it to Log Analytics workspace in your subscription. The OS (Linux) provider collects data every 60 seconds for most of the metrics from the nodes. 

In public preview, you can expect to see the following data with the OS (Linux) provider: 
   - CPU usage, CPU usage by process 
   - Disk usage, I/O read & write 
   - Memory distribution, memory usage, swap memory usage 
   - Network usage, network inbound & outbound traffic details 

To configure an OS (Linux) provider, two primary steps are involved:
1. Install [Node_Exporter](https://github.com/prometheus/node_exporter) on each BareMetal or VM node.
   You have two options for installing [Node_exporter](https://github.com/prometheus/node_exporter): 
      - For automated installation with Ansible, use [Node_Exporter](https://github.com/prometheus/node_exporter) on each BareMetal or VM node to install the OS (Linux) Provider.  
      - Do a [manual installation](https://prometheus.io/docs/guides/node-exporter/).

2. Configure an OS (Linux) provider for each BareMetal or VM node instance in your environment. 
   To configure the OS (Linux) provider, the following information is required: 
      - Name. A name for this provider. It should be unique for this Azure Monitor for SAP Solutions instance. 
      - Node Exporter endpoint. Usually http://<servername or ip address>:9100/metrics. 

> [!NOTE]
> 9100 is a Port Exposed for Node_Exporter Endpoint.

> [!Warning]
> Ensure Node Exporter keeps running after node reboot. 

## Next steps

Learn how to deploy Azure Monitor for SAP Solutions from the Azure portal.

> [!div class="nextstepaction"]
> [Deploy Azure Monitor for SAP Solutions by using the Azure portal](./azure-monitor-sap-quickstart.md)
