---
title: Configure Linux provider for Azure Monitor for SAP solutions (preview)
description: This article explains how to configure a Linux OS provider for Azure Monitor for SAP solutions.
author: MightySuz
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: how-to
ms.date: 03/09/2023
ms.author: sujaj
#Customer intent: As a developer, I want to configure a Linux provider so that I can use Azure Monitor for SAP solutions for monitoring.
---
# Configure Linux provider for Azure Monitor for SAP solutions (preview)

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-azure-monitor.md)]

In this how-to guide, you'll learn to create a Linux OS provider for *Azure Monitor for SAP solutions* resources.

This content applies to both versions of the service, *Azure Monitor for SAP solutions* and *Azure Monitor for SAP solutions (classic)*.

## Prerequisites

- An Azure subscription.
- An existing Azure Monitor for SAP solutions resource. To create an Azure Monitor for SAP solutions resource, see the [quickstart for the Azure portal](quickstart-portal.md) or the [quickstart for PowerShell](quickstart-powershell.md).
- Install the [node exporter latest version](https://prometheus.io/download/#node_exporter) in each SAP host that you want to monitor, either BareMetal or Azure virtual machine (Azure VM). For more information, see [the node exporter GitHub repository](https://github.com/prometheus/node_exporter).

To install the node exporter on Linux:

1. Run `wget https://github.com/prometheus/node_exporter/releases/download/v*/node_exporter-*.*-amd64.tar.gz`. Replace `*` with the version number.

1. Run `tar xvfz node_exporter-*.*-amd64.tar.gz`

1. Run `cd node_exporter-*.*-amd64`

1. Run `./node_exporter`

1. The node exporter now starts collecting data. You can export the data at `http://IP:9100/metrics`.

## Script to set up Node Exporter

```shell
# To get the latest node exporter version from: https://prometheus.io/download/#node_exporter
wget https://github.com/prometheus/node_exporter/releases/download/v*/node_exporter-*.*-amd64.tar.gz
tar xvfz node_exporter-*.*-amd64.tar.gz
if [[ "$(grep '^ID=' /etc/*-release)" == *"rhel"* ]]; then
    echo "Open firewall port 9100 on the Linux host"
    sudo apt install firewalld -y
    systemctl start firewalld
    firewall-cmd --zone=public --permanent --add-port 9100/tcp
else
    sudo ufw allow 9100/tcp
    sudo ufw reload
fi

cd node_exporter-*.*-amd64
nohup ./node_exporter --web.listen-address=":9100" &
```

## Prerequisites to enable secure communication

To [enable TLS 1.2 or higher](enable-tls-azure-monitor-sap-solutions.md), follow the steps [mentioned here](https://prometheus.io/docs/guides/tls-encryption/)

## Create Linux OS provider

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the Azure Monitor for SAP solutions or Azure Monitor for SAP solutions (classic) service.
1. Select **Create** to make a new Azure Monitor for SAP solutions resource.
1. Select **Add provider**.
1. Configure the following settings for the new provider:
    1. For **Type**, select **OS (Linux)**.
    1. For **Name**, enter a name that will be the identifier for the BareMetal instance.
    1. *Optional* Select **Enable secure communication**, choose a certificate type
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

## Troubleshooting

Use these steps to resolve common errors.

### Unable to reach the Prometheus endpoint

When the provider settings validation operation fails with the code ‘PrometheusURLConnectionFailure’:

1. Open firewall port 9100 on the Linux host.
    1. If you're using `firewall-cmd`, run `_firewall-cmd_ _--permanent_ _--add-port=9100/tcp_ ` then `_firewall-cmd_ _--reload_`.
    1. If you're using `ufw`, run `_ufw_ _allow_ _9100/tcp_` then `_ufw_ _reload_`.
1. Try to restart the node exporter agent:
    1. Go to the folder where you installed the node exporter (the file name resembles `node_exporter-*.*-amd64`).
    1. Run `./node_exporter`.
    1. Adding nohup and & to above command decouples the node_exporter from linux machine commandline. If not included node_exporter would stop when the commandline is closed.
1. Verify that the Prometheus endpoint is reachable from the subnet that you provided while creating the Azure Monitor for SAP solutions resource.

## Suggestions

### Enabling Node Exporter

1. Run `nohup ./node_exporter &` command to enable node_exporter.
1. Adding nohup and & to above command decouples the node_exporter from linux machine commandline. If not included node_exporter would stop when the commandline is closed.

### Setting up cron job to start Node exporter on VM restart

1. If the target virtual machine is restarted/stopped, node exporter is also stopped, and needs to be manually started again to continue monitoring.
1. Run `sudo crontab -e` command to open cron file.
1. Add the command `@reboot cd /path/to/node/exporter && nohup ./node_exporter &` at the end of cron file. This will start node exporter on VM reboot.

```shell
sudo crontab -l > crontab_new
echo "@reboot cd /path/to/node/exporter && nohup ./node_exporter &" >> crontab_new
sudo crontab crontab_new
sudo rm crontab_new
```

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Monitor for SAP solutions provider types](providers.md)
