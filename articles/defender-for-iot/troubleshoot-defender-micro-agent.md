---
title: Defender IoT micro agent troubleshooting (Preview)
description: Learn how to handle unexpected or unexplained errors.
ms.date: 1/24/2021
ms.topic: reference
---

# Defender IoT micro agent troubleshooting (Preview)

In the event you have unexpected or unexplained errors, use the following troubleshooting methods to attempt to resolve your issues. You can also reach out to the Azure Defender for IoT product team for assistance as needed.   

## Service status 

To view the status of the service: 

1. Run the following command

    ```azurecli
    systemctl status defender-iot-micro-agent.service 
    ```

1. Check that the service is stable by making sure it is `active`, and that the uptime in the process is appropriate.

    :::image type="content" source="media/troubleshooting/active-running.png" alt-text="Ensure your service is stable by checking to see that it is active and the uptime is appropriate.":::

If the service is listed as `inactive`, use the following command to start the service:

```azurecli
systemctl start defender-iot-micro-agent.service 
```

You will know that the service is crashing if the process uptime is too short. To resolve this issue, you must review the logs.

## Review logs 

Use the following command to verify that the Defender IoT micro agent service is running with root privileges.

```azurecli
ps -aux | grep " defender-iot-micro-agent"
```

:::image type="content" source="media/troubleshooting/root-privileges.png" alt-text="Verify the Defender for IoT micro agent service is running with root privileges.":::

To view the logs, use the following command:  

```azurecli
sudo journalctl -u defender-iot-micro-agent | tail -n 200 
```

To restart the service, use the following command: 

```azurecli
sudo systemctl restart defender-iot-micro-agent  
```

## Next steps

Check out the [Feature support and retirement](edge-security-module-deprecation.md).
