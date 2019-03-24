---
title: How to investigate suspicious activity on a device after receiving an Azure IoT Security alert Preview| Microsoft Docs
description: Learn about the different methods to use to investigate suspicious activity on an IoT device when using  Azure IoT Security services.
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
ms.date: 03/20/2019
ms.author: mlottner

---

---
# required metadata

title: Azure IoT Security IoT device investigation tutorial | Microsoft Docs
d|Description: This article explains how to use Azure IoT Security to investigate a suspicious IoT device.
keywords:
author: mlottner
ms.author: mlottner
ms.date: 03/19/2019
ms.topic: tutorial
ms.service: azureiotsecurity

# optional metadata


---


# Tutorial: Investigate an IoT device

Azure IoT Security alert evidence provides clear indications when IoT devices have been involved in suspicious activities or when indications exist that a device is compromised. In this tutorial you'll use the investigation suggestions to help determine the risk to your organization, decide how to remediate, and determine the best way to prevent similar attacks in the future.  

> [!div class="checklist"]
> * Check the computer for the logged in user.
> * Verify if the user normally accesses the computers.
> * Investigate suspicious activities from the computer.
> * Where there other alerts around the same time?

## Where can I access my data?

Azure IoT Security stores security alerts, recommendations and raw security data (if you choose to save it) in your Log Analytics (LA) workspace.
To configure which LA workspace is used go to your IoT hub, click security -> settings and change your LA workspace configuration.
Once configured, to access your LA workspace choose an alert in Azure IoT Security, and click further investigation - > "To see which devices have this alert click here and view the DeviceId column".

## Investigation steps for suspicious IoT devices

To access insights and raw data about your IoT devices, go to your Log Analytics workspace ([Where can I access my data?](#Where-can-I-access-my-data)).

Check and investigate the device data for the following details and activities:

- Were other alerts triggered around the same time?
  ~~~
  let device = "YOUR_DEVICE_ID";
  let hub = "YOUR_HUB_NAME";
  SecurityAlert
  | where ExtendedProperties contains device and ResourceId contains tolower(hub)
  | project TimeGenerated, AlertName, AlertSeverity, Description, ExtendedProperties
  ~~~

- Who has access the device?
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
  2. Do users have the expected permissions level?

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
  1. Which listening sockets are active on the device?
  2. Should they be active?

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
  2. Do users connect from expected IP addresses?
  
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
  2. Are processes executed by the right users?
  3. Do command line executions contain expected arguments?

## Next steps


## See also
- [Understanding Azure IoT Security](overview.md)
- [Installation for Windows](quickstart-windows-installation.md)
- [Azure IoT Security alerts](alerts.md)
- [Data Access](data-access.md)
