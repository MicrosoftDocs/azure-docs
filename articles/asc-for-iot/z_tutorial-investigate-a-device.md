---
title: Azure IoT Security IoT device investigation tutorial Preview| Microsoft Docs
description: This article explains how to use Azure IoT Security to investigate a suspicious IoT device.
services: azureiotsecurity
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 96e2720a-b954-42e2-8bf7-d29aec813bfd
ms.service: azureiotsecurity
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/24/2019
ms.author: mlottner

---

# Tutorial: Investigate a suspicious IoT device

Azure IoT Security service alerts and evidence provide clear indications when IoT devices are suspected of involvement in suspicious activities or when indications exist that a device is compromised. In this tutorial, use the investigation suggestions provided to help determine the potential risks to your organization, decide how to remediate, and discover the best ways to prevent similar attacks in the future.  

> [!div class="checklist"]
> * Find your device data
> * Steps to take for suspicious IoT devices
> * Remediation
> * Prevention

## Where can I access my data?

By default, Azure IoT Security stores your security alerts and recommendations in your Log Analytics (LA) workspace. You can also choose to store your raw security data.

To change the configuration of your LA workspace for data storage:

1. Open your IoT hub, 
1. Click **Security**, then select **Settings**
1. Change your LA workspace configuration details. 
1. Click **Save**. 

Following configuration, do the following to access your LA workspace stored data:

1. Select and click on an Azure IoT Security alert in your IoT Hub. 
1. Click **further investigation**. 
1. Select **To see which devices have this alert click here and view the DeviceId column**.

## Investigation steps for suspicious IoT devices

To access insights and raw data about your IoT devices, go to your Log Analytics workspace [Where can I access my data?](#where-can-I-access-my-data).

Check and investigate the device data for the following details and activities using the following scripts:

- Were other alerts triggered around the same time?
  ~~~
  let device = "YOUR_DEVICE_ID";
  let hub = "YOUR_HUB_NAME";
  SecurityAlert
  | where ExtendedProperties contains device and ResourceId contains tolower(hub)
  | project TimeGenerated, AlertName, AlertSeverity, Description, ExtendedProperties
  ~~~

- Who has access to this device?
  ~~~
  let device = "YOUR_DEVICE_ID";
  let hub = "YOUR_HUB_NAME";
  SecurityIoTRawEvent
  | where
     DeviceId == device and AssociatedResourceId contains tolower(hub)
     and RawEventName == "LocalUsers"
  | project
     TimestampLocal=extractjson("$.TimestampLocal", EventDetails, typeof(datetime)),
     GroupNames=extractjson("$.GroupNames", EventDetails, typeof(string)),
     UserName=extractjson("$.UserName", EventDetails, typeof(string))
  | summarize FirstObserved=min(TimestampLocal) by GroupNames, UserName
  ~~~
  1. Which users have access to the device?
  2. Do users have the permission levels expected? 

- How can users access the device?
  ~~~
  let device = "YOUR_DEVICE_ID";
  let hub = "YOUR_HUB_NAME";
  SecurityIoTRawEvent
  | where
     DeviceId == device and AssociatedResourceId contains tolower(hub)
     and RawEventName == "ListeningPorts"
     and extractjson("$.LocalPort", EventDetails, typeof(int)) <= 1024 // avoid short-lived TCP ports (Ephemeral)
  | project
     TimestampLocal=extractjson("$.TimestampLocal", EventDetails, typeof(datetime)),
     Protocol=extractjson("$.Protocol", EventDetails, typeof(string)),
     LocalAddress=extractjson("$.LocalAddress", EventDetails, typeof(string)),
     LocalPort=extractjson("$.LocalPort", EventDetails, typeof(int)),
     RemoteAddress=extractjson("$.RemoteAddress", EventDetails, typeof(string)),
     RemotePort=extractjson("$.RemotePort", EventDetails, typeof(string))
  | summarize MinObservedTime=min(TimestampLocal), MaxObservedTime=max(TimestampLocal), AllowedRemoteIPAddress=makeset(RemoteAddress), AllowedRemotePort=makeset(RemotePort) by Protocol, LocalPort
  ~~~
  1. Which listening sockets are currently active on the device?
  2. Should the listening sockets be active?

- Who logged in to the device? 
  ~~~
  let device = "YOUR_DEVICE_ID";
  let hub = "YOUR_HUB_NAME";
  SecurityIoTRawEvent
  | where
     DeviceId == device and AssociatedResourceId contains tolower(hub)
     and RawEventName == "Login"
     // filter out local, invalid and failed logins
     and EventDetails contains "RemoteAddress"
     and EventDetails !contains '"RemoteAddress":"127.0.0.1"'
     and EventDetails !contains '"UserName":"(invalid user)"'
     and EventDetails !contains '"UserName":"(unknown user)"'
     //and EventDetails !contains '"Result":"Fail"'
  | project
     TimestampLocal=extractjson("$.TimestampLocal", EventDetails, typeof(datetime)),
     UserName=extractjson("$.UserName", EventDetails, typeof(string)),
     LoginHandler=extractjson("$.Executable", EventDetails, typeof(string)),
     RemoteAddress=extractjson("$.RemoteAddress", EventDetails, typeof(string)),
     Result=extractjson("$.Result", EventDetails, typeof(string))
  | summarize CntLoginAttempts=count(), MinObservedTime=min(TimestampLocal), MaxObservedTime=max(TimestampLocal), CntIPAddress=dcount(RemoteAddress), IPAddress=makeset(RemoteAddress) by UserName, Result, LoginHandler
  ~~~
  1. Which users have logged in to the device?
  2. Did the users that logged in connect from expected IP addresses?
  
- Is the device behaving as expected?
  ~~~
  let device = "YOUR_DEVICE_ID";
  let hub = "YOUR_HUB_NAME";
  SecurityIoTRawEvent
  | where
     DeviceId == device and AssociatedResourceId contains tolower(hub)
     and RawEventName == "ProcessCreate"
  | project
     TimestampLocal=extractjson("$.TimestampLocal", EventDetails, typeof(datetime)),
     Executable=extractjson("$.Executable", EventDetails, typeof(string)),
     UserId=extractjson("$.UserId", EventDetails, typeof(string)),
     CommandLine=extractjson("$.CommandLine", EventDetails, typeof(string))
  | join kind=leftouter (
     // user UserId details
     SecurityIoTRawEvent
     | where
        DeviceId == device and AssociatedResourceId contains tolower(hub)
        and RawEventName == "LocalUsers"
     | project
        UserId=extractjson("$.UserId", EventDetails, typeof(string)),
        UserName=extractjson("$.UserName", EventDetails, typeof(string))
     | distinct UserId, UserName
  ) on UserId
  | extend UserIdName = strcat("Id:", UserId, ", Name:", UserName)
  | summarize CntExecutions=count(), MinObservedTime=min(TimestampLocal), MaxObservedTime=max(TimestampLocal), ExecutingUsers=makeset(UserIdName), ExecutionCommandLines=makeset(CommandLine) by Executable
  ~~~
  1. Are there any suspicious processes running on the device?
  2. Are processes executed by appropriate users?
  3. Do command line executions contain the correct expected arguments?




## See also
- [Understanding Azure IoT Security](overview.md)
- [Installation for Windows](quickstart-windows-installation.md)
- [Azure IoT Security alerts](alerts.md)
- [Data Access](data-access.md)
