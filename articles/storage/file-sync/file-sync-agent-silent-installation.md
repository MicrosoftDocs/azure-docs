---
title: How to install the Azure File Sync agent silently 
description: Discusses how to perform a silent installation for a new Azure File Sync agent installation
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 07/03/2024
ms.author: kendownie
ms.custom: sfi-ropc-nochange
# Customer intent: "As an IT administrator, I want to perform a silent installation of the Azure File Sync agent using default or custom settings, so that I can streamline deployment and minimize user interaction during the setup process."
---

# How to perform a silent installation for a new Azure File Sync agent installation 

This article covers how to silently install the Azure File Sync agent using default or custom settings.

## Silent installation that uses default settings
To run a silent installation for a new agent installation that uses the default settings, run the following command at an elevated command prompt:

```
msiexec /i packagename.msi /qb /l*v AFSInstaller.log
```
For example, to install the Azure File Sync agent for Windows Server 2016, run the following command:

```
msiexec /i StorageSyncAgent_WS2016.msi /qb /l*v AFSInstaller.log
```

> [!NOTE]
> Use the /qb switch to display restart prompts (if required), agent update, and server registration screens. To suppress the screens and automatically restart the server (if required), use the /qn switch.

## Silent installation that uses custom settings
To run a silent installation for a new agent installation that uses custom settings, use the parameters that are documented in the table below.

For example, to run a silent installation by using custom proxy settings, run the following command:

```
msiexec /i StorageSyncAgent_WS2016.msi USE_CUSTOM_PROXY_SETTINGS=1 PROXY_ADDRESS=10.0.0.1 PROXY_PORT=80 PROXY_AUTHREQUIRED_FLAG=1 PROXY_USERNAME=username  PROXY_PASSWORD=password /qb /l*v AFSInstaller.log
```

For example, to run a silent installation by using an unattend answer file, run the following command:

```
msiexec /i StorageSyncAgent_WS2016.msi UNATTEND_ANSWER_FILE=c:\agent\unattend.ini /qb /l*v AFSInstaller.log
```

The unattend answer file should have the following format:

ACCEPTEULA=1  
ENABLE_AZUREFILESYNC_FEATURE=1  
AGENTINSTALLDIR=%SYSTEMDRIVE%\Program Files\Azure\StorageSyncAgent  
ENABLE_MU_ENROLL=1  
ENABLE_DATA_COLLECTION=1  
ENABLE_AGENT_UPDATE_POSTINSTALL=1  
USE_CUSTOM_PROXY_SETTINGS=1  
PROXY_ADDRESS=10.0.0.1  
PROXY_PORT=80  
PROXY_AUTHREQUIRED_FLAG=1  
PROXY_USERNAME=username  
PROXY_PASSWORD=password

**Azure File Sync agent installation parameters**

| Parameter | Purpose | Values | Default Value |
|-----------|---------|--------|-----------|
|ACCEPTEULA|Azure File Sync license agreement|0 (Not accepted) or 1 (Accepted)|1|
|ENABLE_AZUREFILESYNC_FEATURE|Azure File Sync feature installation option|0 (Do not install) or 1 (Install)|1|
|AGENTINSTALLDIR|Agent installation directory|Local Path|%SYSTEMDRIVE%\Program Files\Azure\StorageSyncAgent|
|AGENT_AUTO_UPDATE_SCHEDULED_DAY|Specifies day to apply the update. Used in conjunction with AGENT_AUTO_UPDATE_SCHEDULED_HOUR|Monday (or other days of the week) |Tuesday|
|AGENT_AUTO_UPDATE_SCHEDULED_HOUR|Specifies hour to apply (24-hour format). Used in conjunction with AGENT_AUTO_UPDATE_SCHEDULED_DAY|20 (or other hours of the day - 00 to 23) |18|
|AUTO_UPDATE_POLICY_MODE|To set auto update policy mode|InstallLatest or UpdateBeforeExpiration|UpdateBeforeExpiration|
|ENABLE_MU_ENROLL|Enroll in Microsoft Update|0 (Do not enroll) or 1 (Enroll)|1|
|ENABLE_DATA_COLLECTION|Collect data necessary to identify and fix problems|0 (No) or 1 (Yes)|1|
|ENABLE_AGENT_AUTO_UPDATE|Turns automatic updates on or off|0 (off) or 1 (Auto install latest ) |0|
|ENABLE_AGENT_UPDATE_POSTINSTALL|Check for updates after agent installation completes|0 (No) or 1 (Yes)|1|
|USE_CUSTOM_PROXY_SETTINGS|Use default proxy settings (if configured) or custom proxy settings|0 (Default Proxy) or 1 (Custom Proxy)|0|
|PROXY_ADDRESS|Proxy server IP address|IP Address||
|PROXY_PORT|Proxy server port number|Port Number||
|PROXY_AUTHREQUIRED_FLAG|Proxy server requires credentials|0 (No) or 1 (Yes)||
|PROXY_USERNAME|User name used for authentication|Username||
|PROXY_PASSWORD|Password used for authentication|Password||
|UNATTEND_ANSWER_FILE|Use unattend answer file|Path||
