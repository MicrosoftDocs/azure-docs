---
title: Configure Linux provider for Azure Monitor for SAP solutions
description: This article explains how to configure a Linux OS provider for Azure Monitor for SAP solutions.
author: MightySuz
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 03/09/2023
ms.author: sujaj
#Customer intent: As a developer, I want to configure a Linux provider so that I can use Azure Monitor for SAP solutions for monitoring.
---
# Configure Linux provider for Azure Monitor for SAP solutions

In this how-to guide, you learn how to create a Linux OS provider for Azure Monitor for SAP solutions resources.

## Prerequisites

- An Azure subscription.
- An existing Azure Monitor for SAP solutions resource. To create an Azure Monitor for SAP solutions resource, see the [quickstart for the Azure portal](quickstart-portal.md) or the [quickstart for PowerShell](quickstart-powershell.md).
- Install the [node exporter latest version](https://prometheus.io/download/#node_exporter) in each SAP host that you want to monitor, either BareMetal or Azure virtual machine (VM). For more information, see the [node exporter GitHub repository](https://github.com/prometheus/node_exporter).
- Node exporter uses the default port 9100 to expose the metrics. If you want to use a custom port, make sure to open the port in the firewall and use the same port while creating the provider.
- Default port 9100 or custom port that will be configured for node exporter should be open and listening on the Linux host.

To install the node exporter on Linux:

Right click on the relevant node exporter version for linux from https://prometheus.io/download/#node_exporter and copy the link address which will be used in the below command.
For example - https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz

1. Change to the directory where you want to install the node exporter.
1. Run `wget https://github.com/prometheus/node_exporter/releases/download/v<xxx>/node_exporter-<xxx>.linux-amd64.tar.gz`. Replace `xxx` with the version number.

1. Run `tar xvfz node_exporter-<xxx>.linux-amd64.tar.gz`

1. Run `cd node_exporter-<xxx>linux-amd64`

1. Run `./node_exporter`.

1. Run `./node_exporter --web.listen-address=":9100" &`

1. The node exporter now starts collecting data. You can export the data at `http://<ip>:9100/metrics`.

## Script to set up the node exporter

```shell
# To get the latest node exporter version from: https://prometheus.io/download/#node_exporter
# Right click on the linux node exporter version and copy the link address which will be used in the below command. For example - https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
# Change to the directory where you want to install the node exporter.

wget https://github.com/prometheus/node_exporter/releases/download/v<xxx>/node_exporter-<xxx>.linux-amd64.tar.gz
tar xzvf node_exporter-<xxx>.linux-amd64.tar.gz
cd node_exporter-<xxx>linux-amd64
nohup ./node_exporter --web.listen-address=":9100" &
```

### Set up a systemctl service to start node exporter on a Virtual Machine restart

1. If the target VM is restarted or stopped, node exporter service is stopped. It must be manually started again to continue monitoring.
1. Run the below commands to enable node exporter to run as a service.

   > [!NOTE]
   > Replace this `xxxx` with the version of node exporter. For example, `1.6.1`.

    ```shell
    # Change to the directory where node exporter bits are downloaded and copy the node_exporter folder to path /usr/bin
    sudo mv node_exporter-<xxxx>.linux-amd64 /usr/bin
    # Create a node_exporter as a service file under etc/systemd/system
    sudo tee /etc/systemd/system/node_exporter.service<<EOF
    [Unit]
    Description=Node Exporter
    After=network.target
    [Service]
    Type=simple
    Restart=always
    ExecStart=/usr/bin/node_exporter-<xxxx>.linux-amd64/node_exporter $ARGS
    ExecReload=/bin/kill -HUP $MAINPID
    [Install]
    WantedBy=multi-user.target
    EOF
    # Reload the system daemon and start the node exporter service.

    sudo systemctl daemon-reload
    sudo systemctl start node_exporter
    sudo systemctl enable node_exporter

    # Check the status of node exporter if it is running in active(running) state.
    sudo systemctl status node_exporter

    # To test the node exporter running as a service
    # NOTE - Downtime impacts the Business application running on VM
    # Crash/Re-start the Virtual Machine, login back into VM and check node exporter status to be active(running)
    sudo systemctl status node_exporter
    ```

## Prerequisites to enable secure communication

To [enable TLS 1.2 or higher](enable-tls-azure-monitor-sap-solutions.md), follow the steps in [this article](https://prometheus.io/docs/guides/tls-encryption/).

## Create Linux OS provider

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the Azure Monitor for SAP solutions.
1. Select **Create** to make a new Azure Monitor for SAP solutions resource.
1. Select **Add provider**.
1. Configure the following settings for the new provider:
    1. For **Type**, select **OS (Linux)**.
    1. For **Name**, enter a unique name of the provider.
    1. (Optional) Select **Enable secure communication**, choose a certificate type.
    1. For **Node Exporter Endpoint**, enter `http://IP:9100/metrics` if default port 9100 is used. If a custom port is used, enter `http://IP:PORT/metrics`. Replace `IP` with the IP address of the Linux host and `PORT` with the custom port number.
    1. For the IP address, use the private IP address of the Linux host. Make sure the host and Azure Monitor for SAP solutions resource are in the same virtual network.
1. Open firewall port 9100 on the Linux host.
    1. If you're using `firewall-cmd`, run `_firewall-cmd_ _--permanent_ _--add-port=9100/tcp_ ` and then run `_firewall-cmd_ _--reload_`.
    1. If you're using `ufw`, run `_ufw_ _allow_ _9100/tcp_` and then run `_ufw_ _reload_`.
1. If the Linux host is an Azure VM, make sure that all applicable network security groups allow inbound traffic at port 9100 from **VirtualNetwork** as the source.
1. Select **Add provider** to save your changes.
1. Continue to add more providers as needed.
1. Select **Review + create** to review the settings.
1. Select **Create** to finish creating the resource.

## Troubleshooting

Use these steps to resolve common errors.

### Unable to reach the Prometheus endpoint

When the provider settings validation operation fails with the code `PrometheusURLConnectionFailure`:

1. Check the default port 9100 or custom port that is configured for node exporter is open and listening on the Linux host.
1. Try to restart the node exporter agent:
    1. Go to the folder where you installed the node exporter (the file name resembles `node_exporter-<xxxx>-amd64`).
    1. Run `./node_exporter`.
    1. Run `nohup ./node_exporter &` command to enable node_exporter. Adding nohup and & to above command decouples the node_exporter from linux machine commandline. If not included node_exporter would stop when the commandline is closed.
1. Verify that the Prometheus endpoint is reachable from the subnet that you provided when you created the Azure Monitor for SAP solutions resource.

## Suggestion

Use this suggestion for troubleshooting

### Enable the node exporter

1. Run the `nohup ./node_exporter &` command to enable `node_exporter`.
1. Adding `nohup` and `&` to the preceding command decouples `node_exporter` from the Linux machine command line. If they're not included, `node_exporter` stops when the command line is closed.

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Monitor for SAP solutions provider types](providers.md)
