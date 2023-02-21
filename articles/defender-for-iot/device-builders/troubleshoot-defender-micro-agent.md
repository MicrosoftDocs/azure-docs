---
title: Defender for IoT micro agent troubleshooting 
description: Learn how to handle unexpected or unexplained errors.
ms.date: 11/09/2021
ms.topic: reference
---

# Defender for IoT micro agent troubleshooting

If an unexpected error occurs, you can use these troubleshooting methods in an attempt to resolve the issue. 

## Service status 

To view the status of the service: 

1. Run the following command

    ```bash
    systemctl status defender-iot-micro-agent.service 
    ```

1. Check that the service is stable by making sure it's `active`, and that the uptime in the process is appropriate.

    :::image type="content" source="media/troubleshooting/active-running.png" alt-text="Ensure your service is stable by checking to see that it's active and the uptime is appropriate.":::

If the service is listed as `inactive`, use the following command to start the service:

```bash
systemctl start defender-iot-micro-agent.service 
```

You will know that the service is crashing if, the process uptime is less than 2 minutes. To resolve this issue, you must [review the logs](#review-the-logs).

## Validate micro agent root privileges

Use the following command to verify that the Defender for IoT micro agent service is running with root privileges.

```bash
ps -aux | grep " defender-iot-micro-agent"
```
The following sample result shows that the folder 'defender_iot_micro_agent' has root privileges due to the word 'root' appearing as shown by the red box.

:::image type="content" source="media/troubleshooting/root-privileges.png" alt-text="Verify the Defender for IoT micro agent service is running with root privileges.":::
## Review the logs 

To review the logs, use the following command:  

```bash
sudo journalctl -u defender-iot-micro-agent | tail -n 200 
```

### Quick log review

If an issue occurs when the micro agent is run, you can run the micro agent in a temporary state, which will allow you to view the logs using the following command:

```bash
sudo systectl stop defender-iot-micro-agent
cd /etc/defender_iot_micro_agent/
sudo ./defender_iot_micro_agent
```

## Restart the service

To restart the service, use the following command: 

```bash
sudo systemctl restart defender-iot-micro-agent 
```

## Next steps

Check out the [Feature support and retirement](edge-security-module-deprecation.md).
