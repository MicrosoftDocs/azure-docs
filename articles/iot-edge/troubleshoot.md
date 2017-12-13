---
title: Troubleshoot Azure IoT Edge | Microsoft Docs 
description: Resolve common issues and learn troubleshooting skills for Azure IoT Edge 
services: iot-edge
keywords: 
author: kgremban
manager: timlt

ms.author: kgremban
ms.date: 12/15/2017
ms.topic: tutorial
ms.service: iot-edge

ms.custom: mvc
---

# Common issues and resolutions for Azure IoT Edge

If you experience issues running Azure IoT Edge in your environment, use this article as a guide for troubleshooting and resolution. 

## Standard diagnostic steps 

When you encounter an issue, try restarting the Azure IoT Edge runtime. That might resolve the problem before you start looking into logs and error messages. 

   ```cmd
   iotedgectl restart
   ```

If restarting the runtime doesn't help, then you want to do more digging to see where the error may be occurring. Use the commands and tools in this section to review the logs and messages from your IoT Edge device. 

* Look at the logs of the docker containers to detect routing issues. Start with your deployed containers, then look at the containers that make up the IoT Edge runtime: Edge Agent and Edge Hub.

   ```cmd
   docker logs <container name>
   ```

* Check the messages being sent between IoT Hub and the IoT Edge devices. You can view these messages by using the [Azure IoT Toolkit](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) extension for Visual Studio Code. For more guidance, see [Handy tool when you develop with Azure IoT](https://blogs.msdn.microsoft.com/iotdev/2017/09/01/handy-tool-when-you-develop-with-azure-iot/)

* Get verbose logs from both the Edge Agent and the Edge Hub containers.

   ```cmd
   iotedgectl setup --runtime -log -level DEBUG
   ```

* Inspect your edge device environment variables:

   ```cmd
   docker exec edgeAgent printenv
   ```

* Open a console in a container. This step only works on Linux machines.

   ```cmd
   docker exec -it <container name> "bash"
   ```

## Edge Agent stops after about a minute

The Edge Agent starts and runs successfully for about a minute, then stops. The logs indicate that the Edge Agent is attempting to connect to IoT Hub over AMQP, and then approximately 30 seconds later attempt to connect using AMQP over websocket. When that fails, the Edge Agent exits. 

Example edgeAgent logs:

```
2017-11-28 18:46:19 [INF] - Starting module management agent. 
2017-11-28 18:46:19 [INF] - Version - 1.0.7516610 (03c94f85d0833a861a43c669842f0817924911d5) 
2017-11-28 18:46:19 [INF] - Edge agent attempting to connect to IoT Hub via AMQP... 
2017-11-28 18:46:49 [INF] - Edge agent attempting to connect to IoT Hub via AMQP over WebSocket... 
```

### Root cause
This issue usually indicates that a networking configuration on the host network is preventing the Edge Agent from reaching the network. The agent attempts to connect over AMQP (port 5671) first. If this fails, it tries websockets (port 443).

The IoT Edge runtime sets up a network for each of the modules to communicate on. On Linux, this network is a bridge network. On Windows, it uses NAT. This issue is more common on Windows devices using Windows containers that use the NAT network. 

### Resolution
Ensure that there is a route to the internet for the IP addresses assigned to this NAT network. There have been cases where a VPN configuration on the host overrides the IoT Edge network. 

## Edge Hub fails to start

The Edge hub fails to start, and prints the following message to the logs: 

```
One of more errors occurred. (Docker API responded with status code=InternalServerError, response={\"message\":\"driver failed programming external connectivity on endpoint edgeHub (6a82e5e994bab5187939049684fb64efe07606d2bb8a4cc5655b2a9bad5f8c80): Error starting userland proxy: Bind for 0.0.0.0:443 failed: port is already allocated\"}\n) 
```

### Root cause
This issue usually indicates that some other process on the host machine has bound port 443. The Edge Hub maps ports 5671 and 443 for use in gateway scenarios. This port mapping will fail if another process has already bound this port. 

### Resolution
Find and stop the process that is using port 443. This process is usually a web server.

## Edge Agent can't access a module's image (403)
A container fails to run, and the Edge Agent logs show a 403 error. 

### Resolution
Try running the `iotedgectl login` command again.

## Edge Agent image isn't found (404)

On windows, a 404 error is sent back when the `iotedgectl start` command tries to fetch the edgeAgent image:

```
ERROR: Error inspecting image: microsoft/azureiotedge-agent:1.0-preview. Error: 404 Client Error: Not Found ("no such image: microsoft/azureiotedge-agent:1.0-preview: No such image: microsoft/azureiotedge-agent:1.0-preview") 
```

### Resolution
Make sure that you are using a supported version of Windows. Azure IoT Edge on Windows requires the Windows Fall Creators Update (build 16299). To double-check your version, run the following powershell command: 

```powershell
Invoke-Expression (Invoke-WebRequest -useb https://aka.ms/iotedgewin) 
```

## Next steps
Do you think that you found a bug in the IoT Edge platform? Please, [submit an issue](https://github.com/Azure/iot-edge/issues) so that we can continue to improve. 