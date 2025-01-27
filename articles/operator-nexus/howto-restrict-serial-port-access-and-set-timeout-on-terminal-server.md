---
title: "Azure Operator Nexus: How to restrict serial port access and set time-out on terminal server"
description: Process of configuring serial port access restrictions and time-out settings on terminal server
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 01/24/2025
ms.custom: template-how-to, devx-track-azurecli
---

# How to restrict serial port access to a single session and set a 15-Minute time-out on a Terminal Server

This guide explains how to configure a Terminal Server to restrict serial port access to a single session and set the default time-out to 15 minutes.

## Prerequisites

The Terminal Server must run OS version 24.07.1 or a later version.<br>  
For upgrade instructions, refer to [How to Upgrade Terminal Server OS](howto-upgrade-os-of-terminal-server.md).


## Step 1: Set time-out for sessions

Configure the session time-outs for CLI, WebUI, and Serial Port access using the following commands:

```bash
ogcli update system/cli_session_timeout timeout=15
ogcli update system/webui_session_timeout timeout=15
ogcli update system/session_timeout serial_port_timeout=15
```

## Step 2: Verify time-out settings

Confirm the new time-out settings by running:

```bash
ogcli get system/session_timeout
```

```Expected output:
cli_timeout=15
serial_port_timeout=15
webui_timeout=15
```

## Step 3: Configure single session for serial ports

To restrict each serial port to a single session, execute the following command. 

```bash
for i in {01..48} ; do
  echo "### Configuring single_session on port$i ###"
  ogcli update port port$i single_session=true
done
```

>[!Note]
> This process may take approximately 15 minutes.

## Step 4: Verify single session configuration

Validate the configuration by listing the ports and checking the `single_session` status:

```bash
ogcli get ports | grep -E 'ogcli get port|single_session'
```

Alternatively, check individual ports:

```bash
ogcli get port "port01"
```

```Expected output for each port:
single_session=true
```

Repeat the command for other ports as needed (`port02`, `port03`, etc.).
