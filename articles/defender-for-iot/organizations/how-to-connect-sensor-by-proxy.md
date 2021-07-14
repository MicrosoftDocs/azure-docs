---
title: Connect sensors with a proxy
description: Learn how to configure Azure Defender for IoT to communicate with a sensor through a proxy with no direct internet access.
ms.topic: how-to
ms.date: 07/04/2021
---

# Connect Azure Defender for IoT sensors without direct internet access by using a proxy 

This article describes how to configure Azure Defender for IoT to communicate with a sensor through a proxy with no direct internet access. Connect the sensor with a forwarding proxy that has HTTP tunneling, and uses the HTTP CONNECT command for connectivity. The instructions here are given uses the open-source Squid proxy, any other proxy that supports CONNECT can be used. 

The proxy uses an encrypted SSL tunnel, to transfers data from the sensors to the service. The proxy doesn't inspect, analyze, or cache any data. 

The following diagram shows data going from Azure Defender to IoT sensor in the OT segment to cloud via a proxy located in the IT network, and industrial DMZ.

:::image type="content" source="media/how-to-connect-sensor-by-proxy/cloud-access.png" alt-text="Connect the sensor to a proxy through the cloud.":::

## Set up your system

For this scenario we will be installing, and configuring the latest version of [Squid](http://www.squid-cache.org/) on an Ubuntu 18 server.

> [!Note]
> Azure Defender for IoT does not offer support for Squid or any other proxy service.

**To install Squid proxy on an Ubuntu 18 server**:

1. Sign in to your designated proxy Ubuntu machine.

1. Launch a terminal window.
 
1. Update your software to the latest version using the following command.

    ```bash
    sudo apt-get update 
    ```

1. Install the Squid package using the following command.

    ```bash
    sudo apt-get install squid 
    ```

1. Locate the squid configuration file that is located at `/etc/squid/squid.conf`, and `/etc/squid/conf.d/`.

1. Make a backup of the original file using the following command.

    ```bash
    sudo cp -v /etc/squid/squid.conf{,.factory}'/etc/squid/squid.conf' -> '/etc/squid/squid.conf.factory sudo nano /etc/squid/squid.conf
    ```

1. Open `/etc/squid/squid.conf` in a text editor.

1. Search for `# INSERT YOUR OWN RULE(S) HERE TO ALLOW ACCESS FROM YOUR CLIENTS`.

1. Add `acl sensor1 src <sensor-ip>`, and `http_access allow sensor1` into the file.

    :::image type="content" source="media/how-to-connect-sensor-by-proxy/add-lines.png" alt-text="Add the following two lines into the text and save the file.":::

1. (Optional) Add more sensors by adding an extra line for each sensor.

1. Enable the Squid service to start at launch with the following command.

    ```bash
    sudo systemctl enable squid 
    ```

## Set up a sensor to use Squid

**To set up a sensor to use Squid**:

1. Sign in to the sensor.

1. Navigate to **System settings** > **Network**.

1. Select **Enable Proxy**.

    :::image type="content" source="media/how-to-connect-sensor-by-proxy/enable-proxy.png" alt-text="Select enable proxy from the Sensor Network Configuration window.":::

1. Enter the proxy address.

1. Enter a port. The default port is `3128`.

1. (Optional) Enter a proxy user, and password.

1. Select **Save**.

## See also

[Manage your subscriptions](how-to-manage-subscriptions.md).
