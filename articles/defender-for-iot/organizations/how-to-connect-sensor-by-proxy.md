---
title: Connect sensors with a proxy (legacy)
description: Learn how to configure Microsoft Defender for IoT to communicate with a sensor through a proxy with no direct internet access (legacy procedure).
ms.topic: how-to
ms.date: 02/06/2022
---

# Connect Microsoft Defender for IoT sensors without direct internet access by using a proxy (version 10.x)

This article describes how to connect Microsoft Defender for IoT sensors to Defender for IoT via a proxy, with no direct internet access. 
> [!NOTE]
> This article is only relevant if you are using a OT sensor version 10.x via a private IoT Hub.
> Starting with sensor software versions 22.1.x, updated connection methods are supported that don't require customers to have their own IoT Hub. For more information, see [Sensor connection methods](architecture-connections.md) and [Connect your sensors to Microsoft Defender for IoT](connect-sensors.md).


## Overview

Connect the sensor with a forwarding proxy that has HTTP tunneling, and uses the HTTP CONNECT command for connectivity. The instructions here are given uses the open-source Squid proxy, any other proxy that supports CONNECT can be used.

The proxy uses an encrypted SSL tunnel to transfer data from the sensors to the service. The proxy doesn't inspect, analyze, or cache any data.

The following diagram shows data going from Microsoft Defender for IoT to the IoT sensor in the OT segment to cloud via a proxy located in the IT network, and industrial DMZ.

:::image type="content" source="media/how-to-connect-sensor-by-proxy/cloud-access.png" alt-text="Connect the sensor to a proxy through the cloud.":::

## Set up your system

For this scenario we'll be installing, and configuring the latest version of [Squid](http://www.squid-cache.org/) on an Ubuntu 18 server (additional to the OT sensor).

> [!Note]
> Microsoft Defender for IoT does not offer support for configuring Squid or any other proxy server. We recommend to follow the up to date instructions as applicable to the proxy software in use on your network.

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

This section describes how to set up a sensor to use Squid.

**To set up a sensor to use Squid**:

1. Sign in to the sensor.

1. Navigate to **System settings** > **Basic**> **Sensor Network Settings**.

1. Turn on the **Enable Proxy** toggle.

1. Enter the proxy address.

1. Enter a port. The default port is `3128`.

1. (Optional) Enter a proxy user, and password.

1. Select **Save**.

## Next steps

For more information, see [Manage your subscriptions](how-to-manage-subscriptions.md).
