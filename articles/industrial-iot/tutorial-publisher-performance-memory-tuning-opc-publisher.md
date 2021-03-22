---
title: Microsoft OPC Publisher Performance and Memory Tuning
description: In this tutorial, you learn how to tune the performance and memory of the OPC Publisher.
author: jehona-m
ms.author: jemorina
ms.service: industrial-iot
ms.topic: tutorial
ms.date: 3/22/2021
---

# Tutorial: Tune the OPC Publisher performance and memory

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Adjust the performance
> * Adjust the message flow to the memory resources

When running OPC Publisher in production setups, network performance requirements (throughput and latency) and memory resources must be considered. OPC Publisher exposes the following command-line parameters to help meet these requirements:

* Message queue capacity (`mq` for version 2.5 and below, not available in version 2.6, `om` for version 2.7)
* IoT Hub send interval (`si`)
* IoT Hub message size (`ms`)

## Adjusting IoT Hub send interval and IoT Hub message size

The `mq/om` parameter controls the upper limit of the capacity of the internal message queue. This queue buffers all messages before they are sent to IoT Hub. The default size of the queue is up to 2 MB for OPC Publisher version 2.5 and below and 4000 IoT Hub messages for version 2.7 (that is, if the setting for the IoT Hub message size is 256 KB, the size of the queue will be up to 1 GB). If OPC Publisher is not able to send messages to IoT Hub fast enough, the number of items in this queue increases. If this happens during test runs, one or both of the following can be done to mitigate:

* decrease the IoT Hub send interval (`si`)

* increase the IoT Hub message size (`ms`, the maximum this can be set to is 256 KB)

If the queue keeps growing even though the `si` and `ms` parameters have been adjusted, eventually the maximum queue capacity will be reached and messages will be lost. This is due to the fact that both the `si` and `ms` parameter have physical limits and the Internet connection between OPC Publisher and IoT Hub is not fast enough for the number of messages that must be sent in a given scenario. In that case, only setting up several, parallel OPC Publishers will help. The `mq/om` parameter also has the biggest impact on the memory consumption by OPC Publisher. 

The `si` parameter forces OPC Publisher to send messages to IoT Hub at the specified interval. A message is sent either when the maximum IoT Hub message size of 256 KB of data is available (triggering the send interval to reset) or when the specified interval time has passed.

The `ms` parameter enables batching of messages sent to IoT Hub. In most network setups, the latency of sending a single message to IoT Hub is high, compared to the time it takes to transmit the payload. This is mainly due to Quality of Service (QoS) requirements, since messages are acknowledged only once they have been processed by IoT Hub). Therefore, if a delay for the data to arrive at IoT Hub is acceptable, OPC Publisher should be configured to use the maximal message size of 256 KB by setting the `ms` parameter to 0. It is also the most cost-effective way to use OPC Publisher.

The default configuration sends data to IoT Hub every 10 seconds (`si=10`) or when 256 KB of IoT Hub message data is available (`ms=0`). This adds a maximum delay of 10 seconds, but has low probability of losing data because of the large message size. The metric `monitored item notifications enqueue failure`  in OPC Publisher version 2.5 and below and `messages lost` in OPC Publisher version 2.7 shows how many messages were lost.

When both `si` and `ms` parameters are set to 0, OPC Publisher sends a message to IoT Hub as soon as data is available. This results in an average IoT Hub message size of just over 200 bytes. However, the advantage of this configuration is that OPC Publisher sends the data from the connected asset without delay. The number of lost messages will be high for use cases where a large amount of data must be published and hence this is not recommended for these scenarios.

To measure the performance of OPC Publisher,  the `di` parameter can be used to print performance metrics to the trace log in the interval specified (in seconds).

## Next steps
Now that you have learned how to tune the performance and memory of the OPC Publisher, you can check out the OPC Publisher GitHub repository for further resources:

> [!div class="nextstepaction"]
> [OPC Publisher GitHub repository](https://github.com/Azure/Industrial-IoT)