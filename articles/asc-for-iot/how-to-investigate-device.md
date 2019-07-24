---
title: Azure Security Center for IoT device investigation guide Preview| Microsoft Docs
description: This how to guide explains how to use Azure Security Center for IoT to investigate a suspicious IoT device using Log Analytics.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: b18b48ae-b445-48f8-9ac0-365d6e065b64
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/18/2019
ms.author: mlottner

---

# Investigate a suspicious IoT device

> [!IMPORTANT]
> Azure Security Center for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Security Center (ASC) for IoT service alerts and evidence provide clear indications when IoT devices are suspected of involvement in suspicious activities or when indications exist that a device is compromised. 

In this guide, use the investigation suggestions provided to help determine the potential risks to your organization, decide how to remediate, and discover the best ways to prevent similar attacks in the future.  

> [!div class="checklist"]
> * Find your device data
> * Investigate using kql queries


## How can I access my data?

By default, ASC for IoT stores your security alerts and recommendations in your Log Analytics workspace. You can also choose to store your raw security data.

To locate the your Log Analytics workspace for data storage:

1. Open your IoT hub, 
1. Under **Security**, click **Overview**, and then select **Settings**.
1. Change your Log Analytics workspace configuration details. 
1. Click **Save**. 

Following configuration, do the following to access data stored in your Log Analytics workspace:

1. Select and click on an ASC for IoT alert in your IoT Hub. 
1. Click **Further investigation**. 
1. Select **To see which devices have this alert click here and view the DeviceId column**.

## Investigation steps for suspicious IoT devices

To access insights and raw data about your IoT devices, go to your Log Analytics workspace [to access your data](#how-can-i-access-my-data).

Check and investigate the device data for the following details and activities using the following kql queries.

### Related alerts

To find out if other alerts were triggered around the same time use the following kql query:

  ~~~
  let device = "YOUR_DEVICE_ID";
  let hub = "YOUR_HUB_NAME";
  SecurityAlert
  | where ExtendedProperties contains device and ResourceId contains tolower(hub)
  | project TimeGenerated, AlertName, AlertSeverity, Description, ExtendedProperties
  ~~~

### Users with access

To find out which users have access to this device use the following kql query: 

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
Use this data to discover: 
  1. Which users have access to the device?
  2. Do the users with access have the permission levels as expected? 

### Open ports

To find out which ports in the device are currently in use or were used, use the following kql query: 

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

    Use this data to discover:
  1. Which listening sockets are currently active on the device?
  2. Should the listening sockets that are currently active be allowed?
  3. Are there any suspicious remote addresses connected to the device?

### User logins

To find out users that logged into the device use the following kql query: 
 
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

    Use the query results to discover:
  1. Which users logged in to the device?
  2. Are the users that logged in, supposed to log in?
  3. Did the users that logged in connect from expected or unexpected IP addresses?
  
### Process list

To find out if the process list is as expected, use the following kql query: 

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

    Use the query results to discover:

  1. Were there any suspicious processes running on the device?
  2. Were processes executed by appropriate users?
  3. Did any command line executions contain the correct and expected arguments?

## Next steps

After investigating a device, and gaining a better understanding of your risks, you may want to consider [Configuring custom alerts](quickstart-create-custom-alerts.md) to improve your IoT solution security posture. If you don't already have a device agent, consider [Deploying a security agent](how-to-deploy-agent.md) or [changing the configuration of an existing device agent](how-to-agent-configuration.md) to improve your results. 