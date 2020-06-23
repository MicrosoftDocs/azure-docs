---
author: KishorIoT
ms.author: nandab
ms.service: iot-central
ms.topic: include
ms.date: 06/20/2020
---

### Copy the configuration files to your IoT Edge device

This reference implementation keeps some configuration in the */data/storage* folder.

On the Edge gateway, create two directories from root (you need elevated privileges) and give **Read** and and **Write** permissions to these directories

```bash
mkdir -p /data/storage
mkdir -p /data/media
chmod -R /777 /data
```

Copy you local *state.json* file into the newly created *storage* folder on the IoT Edge device.

Use a utility such as the PuTTY [pscp](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) command to transfer files securely.

For example, in Windows you can use a Command-prompt to transfer the file to the IoT Edge device:

```cmd
pscp state.json iot@40.121.209.246:/data/storage/state.json
```
