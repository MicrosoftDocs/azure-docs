---
title: Investigate a suspicious device
description: This how to guide explains how to use Defender for IoT to investigate a suspicious IoT device using Log Analytics.
ms.topic: conceptual
ms.date: 03/28/2022
---

# Investigate a suspicious IoT device

Defender for IoT service alerts provides clear indications when IoT devices are suspected of involvement in suspicious activities or when indications exist that a device is compromised.

In this guide, use the investigation suggestions provided to help determine the potential risks to your organization, decide how to remediate, and discover the best ways to prevent similar attacks in the future.

> [!div class="checklist"]
> * Find your device data
> * Investigate using KQL queries

> [!NOTE]
> The Microsoft Defender for IoT legacy experience under IoT Hub has been replaced by our new Defender for IoT standalone experience, in the Defender for IoT area of the Azure portal. The legacy experience under IoT Hub will not be supported after **March 31, 2023**.
>
> For more information, see [Tutorial: Investigate security recommendations](tutorial-investigate-security-recommendations.md) and [Tutorial: Investigate security alerts](tutorial-investigate-security-alerts.md).

## How can I access my data?

By default, Defender for IoT stores your security alerts and recommendations in your Log Analytics workspace. You can also choose to store your raw security data.

To locate your Log Analytics workspace for data storage:

1. Open your IoT hub,
1. Under **Security**, select **Settings**, and then select **Data Collection**.
1. Change your Log Analytics workspace configuration details.
1. Select **Save**.

Following configuration, do the following to access data stored in your Log Analytics workspace:

1. Select and select on a Defender for IoT alert in your IoT Hub.
1. Select **Further investigation**.
1. Select **To see which devices have this alert click here and view the DeviceId column**.

## Investigation steps for suspicious IoT devices

To view insights and raw data about your IoT devices, go to your Log Analytics workspace [to access your data](#how-can-i-access-my-data).

See the sample KQL queries below to get started with investigating alerts and activities on your device.

### Related alerts

You can find out if other alerts were triggered around the same time through the following KQL query:

  ```
  let device = "YOUR_DEVICE_ID";
  let hub = "YOUR_HUB_NAME";
  SecurityAlert
  | where ExtendedProperties contains device and ResourceId contains tolower(hub)
  | project TimeGenerated, AlertName, AlertSeverity, Description, ExtendedProperties
  ```

### Users with access

To find out which users have access to this device use the following KQL query:

 ```
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
 ```
Use this data to discover:

- Which users have access to the device?
- Do the users with access have the expected permission levels?

### Open ports

To find out which ports in the device are currently in use or were used, use the following KQL query:

 ```
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
 ```

Use this data to discover:

- Which listening sockets are currently active on the device?
- Should the listening sockets that are currently active be allowed?
- Are there any suspicious remote addresses connected to the device?

### User logins

To find users that logged into the device use the following KQL query:

 ```
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
 ```

Use the query results to discover:

- Which users signed in to the device?
- Are the users that signed in, supposed to sign in?
- Did the users that signed in connect from expected or unexpected IP addresses?

### Process list

To find out if the process list is as expected, use the following KQL query:

 ```
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
```

Use the query results to discover:

- Were there any suspicious processes running on the device?
- Were processes executed by appropriate users?
- Did any command-line executions contain the correct and expected arguments?

## Next steps

After investigating a device, and gaining a better understanding of your risks, you may want to consider [Configuring custom alerts](quickstart-create-custom-alerts.md) to improve your IoT solution security posture. If you don't already have a device agent, consider [Deploying a security agent](how-to-deploy-agent.md) or [changing the configuration of an existing device agent](how-to-agent-configuration.md) to improve your results.
