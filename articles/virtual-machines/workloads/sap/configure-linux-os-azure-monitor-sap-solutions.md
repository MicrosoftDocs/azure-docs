---
title: Configure Linux provider for Azure Monitor for SAP solutions (preview)
description: This article explains how to configure a Linux OS provider for Azure Monitor for SAP solutions.
author: MightySuz
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.topic: how-to
ms.date: 01/05/2023
ms.author: sujaj
#Customer intent: As a developer, I want to configure a Linux provider so that I can use Azure Monitor for SAP solutions for monitoring.
---
# Configure Linux provider for Azure Monitor for SAP solutions (preview)

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-azure-monitor.md)]

In this how-to guide, you'll learn to create a Linux OS provider for *Azure Monitor for SAP solutions* resources.

This content applies to both versions of the service, *Azure Monitor for SAP solutions* and *Azure Monitor for SAP solutions (classic)*.

## Prerequisites

- An Azure subscription.
- An existing Azure Monitor for SAP solutions resource. To create an Azure Monitor for SAP solutions resource, see the [quickstart for the Azure portal](azure-monitor-sap-quickstart.md) or the [quickstart for PowerShell](azure-monitor-sap-quickstart-powershell.md).
- Install [node exporter version 1.3.0](https://prometheus.io/download/#node_exporter) in each SAP host that you want to monitor, either BareMetal or Azure virtual machine (Azure VM). For more information, see [the node exporter GitHub repository](https://github.com/prometheus/node_exporter).

### Steps to install node exporter:
You can follow the step by step [guide to install node exporter on linux system](https://prometheus.io/docs/guides/node-exporter/):
- wget https://github.com/prometheus/node_exporter/releases/download/v*/node_exporter-*.*-amd64.tar.gz
- tar xvfz node_exporter-*.*-amd64.tar.gz
- cd node_exporter-*.*-amd64
- ./node_exporter
- The node exporter now will start collecting data, and can be exported at the following address:
    - `http://IP:9100/metrics`

## Create Linux provider

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the Azure Monitor for SAP solutions or Azure Monitor for SAP solutions (classic) service.
1. Select **Create** to make a new Azure Monitor for SAP solutions resource.
1. Select **Add provider**.
1. Configure the following settings for the new provider:
    1. For **Type**, select **OS (Linux)**.
    1. For **Name**, enter a name that will be the identifier for the BareMetal instance.
    1. For **Node Exporter Endpoint**, enter `http://IP:9100/metrics`.
    1. For the IP address, use the private IP address of the Linux host. Make sure the host and Azure Monitor for SAP solutions resource are in the same virtual network.
1. Open firewall port 9100 on the Linux host.
    1. If you're using `firewall-cmd`, run `_firewall-cmd_ _--permanent_ _--add-port=9100/tcp_ ` then `_firewall-cmd_ _--reload_`.
    1. If you're using `ufw`, run `_ufw_ _allow_ _9100/tcp_` then `_ufw_ _reload_`.
1. If the Linux host is an Azure virtual machine (VM), make sure that all applicable network security groups (NSGs) allow inbound traffic at port 9100 from **VirtualNetwork** as the source.
1. Select **Add provider** to save your changes.
1. Continue to add more providers as needed.
1. Select **Review + create** to review the settings.
1. Select **Create** to finish creating the resource.

## Trouble shooting guide for common exceptions

### Unable to reach the prometheus endpoint
The provider settings validation operation has failed with code ‘PrometheusURLConnectionFailure’.

1. Open firewall port 9100 on the Linux host.
    1. If you're using `firewall-cmd`, run `_firewall-cmd_ _--permanent_ _--add-port=9100/tcp_ ` then `_firewall-cmd_ _--reload_`.
    1. If you're using `ufw`, run `_ufw_ _allow_ _9100/tcp_` then `_ufw_ _reload_`.
1. Try to restart the node exporter agent:
    1. cd to the folder where you installed the node exporter. (node_exporter-*.*-amd64)
    1. ./node_exporter
1. Please verify if the prometheus endpoint provided is reachable from the subnet provided while creating Azure Monitor for Sap Solutions resource.

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Monitor for SAP solutions provider types](azure-monitor-providers.md)
