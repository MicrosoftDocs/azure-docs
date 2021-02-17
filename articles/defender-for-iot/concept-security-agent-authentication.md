---
title: Security agent authentication (Preview)
titleSuffix: Azure Defender for IoT
description: Perform micro agent authentication with two possible methods.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 1/20/2021
ms.topic: conceptual
ms.service: azure
---

# Micro agent authentication methods (Preview)

There are two options for authentication with the Defender for IoT Micro Agent: 

- Connection string 

- Certificate 

## Authentication using a connection string 

In order to use a connection string, you need to add a file that uses the connection string encoded in utf-8 in the defender agent directory in a file named `connection_string.txt`. For example,

```azurecli
echo “<connection string>” > connection_string.txt 
```

Once you have done that, you should then restart the service using this command.

```azurecli
sudo systemctl restart defender-iot-micro-agent.service
``` 

## Authentication using a certificate 


To perform authentication using a certificate: 

1. Place the PEM-encoded public part of a certificate into the defender agent directory, in a file called `certificate_public.pem`.
1. Place the PEM-encoded private key, into the defender agent directory, in a file called `certificate_private.pem`.
1. Place the appropriate connection string in a file named `connection_string.txt`. For example,

    ```azurecli
    HostName=<the host name of the iot hub>;DeviceId=<the id of the device>;ModuleId=<the id of the module>;x509=true 
    ```

    This action indicates that the defender agent will expect a certificate to be provided for authentication. 

1. restart the service using the following code: 

    ```azurecli
    sudo systemctl restart defender-iot-micro-agent.service 
    ```

## Ensure the micro agent is running correctly 

1. Run the following command: 
    ```azurecli
    systemctl status defender-iot-micro-agent.service 
    ```
1. Check that the service is stable by making sure it is **active** and that the uptime of the process is appropriate: 

    :::image type="content" source="media/concept-security-agent-authentication/active.png" alt-text="Ensure your service is stable by making sure it is active.":::

## Next steps

Check your [Security posture – CIS benchmark](concept-security-posture.md).
