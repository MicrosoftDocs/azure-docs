---
title: Troubleshooting guide - Azure Event Hubs | Microsoft Docs
description: This article provides a list of Azure Event Hubs messaging exceptions and suggested actions.
services: event-hubs
documentationcenter: na
author: ShubhaVijayasarathy
manager: timlt

ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.custom: seodec18
ms.date: 01/16/2020
ms.author: shvija

---

# Azure Event Hubs - Troubleshooting guide
This article provides troubleshooting tips and recommendations for a few issues that you may see when using Azure EventHubs.

## Connectivity, certificate, or timeout issues
The following steps may help you with troubleshooting connectivity/certificate/timeout issues for all services under *.servicebus.windows.net. 

- Browse to or [wget](https://www.gnu.org/software/wget/) `https://<yournamespacename>.servicebus.windows.net/`. It helps with checking whether you have IP filtering or virtual network or certificate chain issues (most common when using java SDK).

    An example of successful message:
    
    ```xml
    <feed xmlns="http://www.w3.org/2005/Atom"><title type="text">Publicly Listed Services</title><subtitle type="text">This is the list of publicly-listed services currently available.</subtitle><id>uuid:27fcd1e2-3a99-44b1-8f1e-3e92b52f0171;id=30</id><updated>2019-12-27T13:11:47Z</updated><generator>Service Bus 1.1</generator></feed>
    ```
    
    An example of failure error message:

    ```json
    <Error>
        <Code>400</Code>
        <Detail>
            Bad Request. To know more visit https://aka.ms/sbResourceMgrExceptions. . TrackingId:b786d4d1-cbaf-47a8-a3d1-be689cda2a98_G22, SystemTracker:NoSystemTracker, Timestamp:2019-12-27T13:12:40
        </Detail>
    </Error>
    ```
- Run the following command to check if any port is blocked on the firewall. Ports used are 443 (HTTPS), 5671 (AMQP) and 9093 (Kafka). Depending on the library you use, other ports are also used. Here is the sample command that check whether the 5671 port is blocked.

    ```powershell
    tnc <yournamespacename>.servicebus.windows.net -port 5671
    ```

    On Linux:

    ```shell
    telnet <yournamespacename>.servicebus.windows.net 5671
    ```
- When there are intermittent connectivity issues, run the following command to check if there are any dropped packets. This command will try to establish 25 different TCP connections every 1 second with the service. Then, you can check how many of them succeeded/failed and also see TCP connection latency. You can download the `psping` tool from [here](/sysinternals/downloads/psping).

    ```shell
    .\psping.exe -n 25 -i 1 -q <yournamespacename>.servicebus.windows.net:5671 -nobanner     
    ```
    You can use equivalent commands if you're using other tools such as `tnc`, `ping`, and so on. 
- Obtain a network trace if the previous steps don't help and analyze it using tools such as [Wireshark](https://www.wireshark.org/). Contact [Microsoft Support](https://support.microsoft.com/) if needed. 

## Issues that may occur with service upgrades/restarts
Backend service upgrades and restarts may cause the following impact to your applications:

- Requests may be momentarily throttled.
- There may be a drop in incoming messages/requests.
- The log file may contain error messages.
- The applications may be disconnected from the service for a few seconds.

If the application code utilizes SDK, the retry policy is already built in and active. The application will reconnect without significant impact to the application/workflow.


## Next steps

You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an Event Hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)
