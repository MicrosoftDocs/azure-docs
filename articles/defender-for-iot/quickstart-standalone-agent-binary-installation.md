---
title: Standalone agent binary installation
description: Install, and authenticate the Defender Micro Agent.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 1/18/2021
ms.topic: quickstart
ms.service: azure
---

# Installing the Defender Micro Agent 

This article provides an explanation of how to install, and authenticate the Defender Micro Agent.

## Prerequisites to install the Defender Micro Agent:

Prior to installing the Defender for IoT module you must create a module identity in the IoT Hub. For more information on how to create a module identity, see [Quickstart: Create an azureiotsecurity module twin](quickstart-create-security-twin.md)

## Installing the package 

Install and configure the Microsoft package repository by following [these instructions](https://docs.microsoft.com/windows-server/administration/linux-package-repository-for-microsoft-software).

For Debian-based Linux distributions install the Defender Micro Agent package using the following code;

```azurecli
sudo apt-get update 

sudo apt-get install <TBD: the name of the package> (microsoft-defender-iot-micro-agent?) 
```

## Micro Agent Authentication Methods 

The two options to authentication the Defender for IoT Micro Agent are: 

- Connection string. 

- Certificate.

To authenticate using a connection string:

1. Place a file containing the connection string encoded in utf-8, in the defender agent directory as a file named `connection_string.txt` by entering the following command:

    ```azurecli
    echo “<connection string>” > connection_string.txt
    ```

1. Restart the service using this command:  

    ```azurecli
    sudo systemctl restart <service name> 
    ```

To authentication using a certificate:

1. Place the PEM-encoded public part of the certificate, and the private key, in to the Defender Agent Directory in to the file called `certificate_public.pem`, and `certificate_private.pem`. 

1. Place the appropriate connection string in to the `connection_string.txt` file. the connection string should look like this: 

    ```HostName=<the host name of the iot hub>;DeviceId=<the id of the device>;ModuleId=<the id of the module>;x509=true``` 

    This string alerts the defender agent, to expect a certificate be provided for authentication. 

1. Restart the service using the following command:  

    ```azurecli
    sudo systemctl restart <service name>
    ```

1. Making sure the micro agent is running properly with the following command:  

    ```azurecli
    systemctl status <service name> 
    ```
1. Ensure that the service is stable by making sure it is `active` and that the uptime of the process is appropriate

    :::image type="content" source="media/quickstart-standalone-agent-binary-installation/active-running.png" alt-text="Check to make sure your sercixe is stable and active.":::