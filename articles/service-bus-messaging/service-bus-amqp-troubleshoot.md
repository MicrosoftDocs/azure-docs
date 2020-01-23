---
title: Troubleshoot AMQP errors in Azure Service Bus | Microsoft Docs
description: Provides a list of AMQP errors you may receive when using Azure Service Bus, and cause of those errors.
services: service-bus-messaging
documentationcenter: na
author: axisc
manager: timlt
editor: spelluru

ms.assetid: 
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/03/2019
ms.author: aschhab

---


# AMQP errors in Azure Service Bus
This article provides some of the errors you receive when using AMQP with Azure Service Bus. They are all standard behaviors of the service. You can avoid them by making send/receive calls on the connection/link, which automatically recreates the connection/link.

## Link is closed 
You see the following error when the AMQP connection and link are active but no calls (for example, send or receive) are made using the link for 10 minutes. So, the link is closed. The connection is still open.

```
amqp:link:detach-forced:The link 'G2:7223832:user.tenant0.cud_00000000000-0000-0000-0000-00000000000000' is force detached by the broker due to errors occurred in publisher(link164614). Detach origin: AmqpMessagePublisher.IdleTimerExpired: Idle timeout: 00:10:00. TrackingId:00000000000000000000000000000000000000_G2_B3, SystemTracker:mynamespace:Topic:MyTopic, Timestamp:2/16/2018 11:10:40 PM
```

## Connection is closed
You see the following error on the AMQP connection when all links in the connection have been closed because there was no activity (idle) and a new link has not been created in 5 minutes.

```
Error{condition=amqp:connection:forced, description='The connection was inactive for more than the allowed 300000 milliseconds and is closed by container 'LinkTracker'. TrackingId:00000000000000000000000000000000000_G21, SystemTracker:gateway5, Timestamp:2019-03-06T17:32:00', info=null}
```

## Link is not created 
You see this error when a new AMQP connection is created but a link is not created within 1 minute of the creation of the AMQP Connection.

```
Error{condition=amqp:connection:forced, description='The connection was inactive for more than the allowed 60000 milliseconds and is closed by container 'LinkTracker'. TrackingId:0000000000000000000000000000000000000_G21, SystemTracker:gateway5, Timestamp:2019-03-06T18:41:51', info=null}
```

## Next steps

To learn more about AMQP and Service Bus, visit the following links:

* [Service Bus AMQP overview]
* [AMQP 1.0 protocol guide]
* [AMQP in Service Bus for Windows Server]

[Service Bus AMQP overview]: service-bus-amqp-overview.md
[AMQP 1.0 protocol guide]: service-bus-amqp-protocol-guide.md
[AMQP in Service Bus for Windows Server]: https://docs.microsoft.com/previous-versions/service-bus-archive/dn282144(v=azure.100)
