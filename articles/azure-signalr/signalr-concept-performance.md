---
title: Performance guide for Azure SignalR Service
description: An overview of Azure SignalR Service's performance.
author: sffamily
ms.service: signalr
ms.topic: conceptual
ms.date: 04/08/2019
ms.author: zhshang
---
# Performance guide for Azure SignalR Service

One of the key benefits for using Azure SignalR Service is the ease to scale SignalR applications. In a large-scale scenario, performance becomes an important factor. In this guide we will introduce the factors that have impacts on the SignalR application performance, and under different use case scenarios, what is the typical performance? In the end, we will also introduce the environment and tools used to generate performance report.

## Terms definition

*ASRS*: Azure SignalR Service

*Inbound*: the incoming message to Azure SignalR Service

*Outbound*: the outgoing message from Azure SignalR Service

*Bandwidth*: total size of all messages in 1 second

*Default mode*: ASRS expects the app server to establish connection with it before accepting any client connections. It is the default working mode when an ASRS was created.

*Serverless mode*: ASRS only accepts client connections. No server connection is allowed.

## Overview

ASRS defines seven Standard tiers for different performance capacities, and this
guide intends to answer the following questions:

-   What is the typical ASRS performance for each tier?

-   Does ASRS meet my requirement of message throughput, for example, sending 100,000 messages per second?

-   For my specific scenario, which tier is suitable for me? Or how can I select the proper tier?

-   What kind of app server (VM size) is suitable for me and how many of them shall I deploy?

To answer these questions, this performance guide first gives a high-level explanation about the factors that have impacts on performance, then illustrates the maximum inbound and outbound messages for every tier for typical use cases: **echo**, **broadcast**, **send-to-group**, and **send-to-connection** (peer to peer chatting).

It is impossible for this document to cover all scenarios (and different use case, different message size, or message sending pattern etc.). However, it provides some evaluation methods to help users to approximately evaluate their requirement of the inbound or outbound messages, then find the proper tiers by checking the performance table.

## Performance insight

This section describes the performance evaluation methodologies, then lists all factors that have impacts on performance. In the end, it provides methods to help evaluate the performance requirements.

### Methodology

**Throughput** and **latency** are two typical aspects of performance checking. For ASRS, different SKU tier has different throughput throttling policy. This document defines **the maximum allowed throughput (inbound and outbound bandwidth)** as the max achieved throughput when 99% of messages have latency less than 1 second.

The latency is the time span from the connection sending message to receiving the response message from ASRS. Let's take **echo** as an example, every client connection adds a timestamp in the message. App server's hub sends the original message back to the client. So the propagation delay is easily calculated by every client connection. The timestamp is attached for every message in **broadcast**, **send-to-group**, and **send-to-connection**.

To simulate thousands of concurrent clients connections, multiple VMs are created in a virtual private network in Azure. All of these VMs connect to the same ASRS instance.

In ASRS default mode, app server VMs are also deployed in the same virtual private network as client VMs.

All client VMs and app server VMs are deployed in the same network of the same region to avoid cross region latency.

### Performance factors

Theoretically, ASRS capacity is limited by computation resources: CPU, Memory, and Network. For example, more connections to ASRS, more memory ASRS consumed. For larger message traffic, for example, every message is larger than 2048 bytes, it requires ASRS to spend more CPU cycles to process as well. Meanwhile, Azure network bandwidth also imposes a limit for maximum traffic.

The transport type, [WebSocket](https://en.wikipedia.org/wiki/WebSocket), [Sever-Sent-Event](https://en.wikipedia.org/wiki/Server-sent_events), or [Long-Polling](https://en.wikipedia.org/wiki/Push_technology), is another factor affects performance. WebSocket is a bi-directional and full-duplex communication protocol over a single TCP connection. However, Sever-Sent-Event is uni-directional protocol to push message from server to client. Long-Polling requires the clients to periodically poll information from server through HTTP request. For the same API under the same condition, WebSocket has the best performance, Sever-Sent-Event is slower, and Long-Polling is the slowest. ASRS recommends WebSocket by default.

In addition, the message routing cost also limits the performance. ASRS plays a role as a message router, which routes the message from a set of clients or servers to other clients or servers. Different scenario or API requires different routing policy. For **echo**, the client sends a message to itself, and the routing destination is also itself. This pattern has the lowest routing cost. But for **broadcast**, **send-to-group**, **send-to-connection**, ASRS needs to look up the target connections through the internal distributed data structure, which consumes more CPU, Memory and even network bandwidth. As a result, performance is slower than **echo**.

In the default mode, the app server may also become a bottleneck for certain scenarios, because Azure SignalR SDK has to invoke the Hub, meanwhile it maintains the live connection with every client through heart-beat signals.

In serverless mode, the client sends message by HTTP post, which is not as efficient as WebSocket.

Another factor is protocol: JSON and [MessagePack](https://msgpack.org/index.html). MessagePack is smaller in size and delivered faster than JSON. Intuitively, MessagePack would benefit performance, but ASRS performance is not sensitive with protocols since it does not decode the message payload during message forwarding from clients to servers or vice versa.

In summary, the following factors have impacts on the inbound and outbound capacity:

-   SKU tier (CPU/Memory)

-   number of connections

-   message size

-   message send rate

-   transport type (WebSocket/Sever-Sent-Event/Long-Polling)

-   use case scenario (routing cost)

-   app server and service connections (in server mode)


### Find a proper SKU

How to evaluate the inbound/outbound capacity or how to find which tier is suitable for a specific use case?

We assume the app server is powerful enough and is not the performance bottleneck. Then we can check the maximum inbound and outbound bandwidth for every tier.

#### Quick evaluation

Let's simplify the evaluation first by assuming some default settings: WebSocket is used, message size is 2048 bytes, sending message every 1 second, and it is in default mode.

Every tier has its own maximum inbound bandwidth and outbound bandwidth. Smooth user experience is not guaranteed once the inbound or outbound exceeds the limit.

**Echo** gives the maximum inbound bandwidth because it has the lowest routing cost. **Broadcast** defines the maximum outbound message bandwidth.

Do **NOT** exceed the highlighted values in the following two tables.

|       Echo                        | Unit1 | Unit2 | Unit5 | Unit10 | Unit20 | Unit50 | Unit100 |
|-----------------------------------|-------|-------|-------|--------|--------|--------|---------|
| Connections                       | 1,000 | 2,000 | 5,000 | 10,000 | 20,000 | 50,000 | 100,000 |
| **Inbound bandwidth (byte/s)** | **2M**    | **4M**    | **10M**   | **20M**    | **40M**    | **100M**   | **200M**    |
| Outbound bandwidth (byte/s) | 2M    | 4M    | 10M   | 20M    | 40M    | 100M   | 200M    |


|     Broadcast             | Unit1 | Unit2 | Unit5  | Unit10 | Unit20 | Unit50  | Unit100 |
|---------------------------|-------|-------|--------|--------|--------|---------|---------|
| Connections               | 1,000 | 2,000 | 5,000  | 10,000 | 20,000 | 50,000  | 100,000 |
| Inbound bandwidth (byte/s)  | 4K    | 4K    | 4K     | 4K     | 4K     | 4K      | 4K     |
| **Outbound Bandwidth (byte/s)** | **4M**    | **8M**    | **20M**    | **40M**    | **80M**    | **200M**    | **400M**   |

The inbound bandwidth and outbound bandwidth formulas:
```
  inboundBandwidth = inboundConnections * messageSize / sendInterval
  outboundBandwidth = outboundConnections * messageSize / sendInterval
```

*inboundConnections*: the number of connections sending message

*outboundConnections*: the number of connections receiving message

*messageSize*: the size of a single message (average value). For small message whose size is less than 1024 bytes, it has the similar performance impact as 1024-byte message.

*sendInterval*: the time of sending one message, typically it is 1 second per message, which means sending one message every second. Smaller sendInterval means sending more message in given time period. For example, 0.5 second per message means sending two messages every second.

*Connections* is the ASRS committed maximum threshold for every tier. If the connection number is increased further, it will suffer from connection throttling.

*Inbound bandwidth* and *Outbound bandwidth* are the total message size per second. Here 'M' means megabyte for simplicity.

#### Evaluation for complex use cases

##### Bigger message size or different sending rate

The real use case is more complicated. It may send message larger than 2048 bytes, or sending message rate is not one message per second. Let's take unit100's broadcast as an example to find how to evaluate its performance.

The following table shows a real case of **broadcast**, but the message size, connection count, and message sending rate are different from what we assumed in the previous section. The question is how we can deduce any of those items (message size, connection count, or message sending rate) if we only know 2 of them.

| Broadcast  | Message size (byte) | Inbound (message/s) | Connections | Send intervals (second) |
|---|---------------------|--------------------------|-------------|-------------------------|
| 1 | 20 K                 | 1                        | 100,000     | 5                       |
| 2 | 256 K                | 1                        | 8,000       | 5                       |

The following formula is easily to be inferred based on the previous existing formula:

```
outboundConnections = outboundBandwidth * sendInterval / messageSize
```

For unit100, we know the max outbound bandwidth is 400M from previous table,
then for 20-K message size, the max outbound connections should be 400M \* 5 / 20 K =
100,000, which matches the real value.

##### Mixed use cases

The real use case typically mixes the four basic use cases together: **echo**, **broadcast**, **send to group**, or **send to connection**. The methodology used to evaluate the capacity is to divide the mixed use cases into four basic use cases, **calculate the maximum inbound and outbound message bandwidth** using the above formulas separately, and sum them to get the total maximum inbound/outbound bandwidth. Then pick up the proper tier from the maximum inbound/outbound bandwidth tables.

Meanwhile, for sending message to hundreds or thousands of small groups, or thousands of clients sending message to each other, the routing cost will become dominant. This impact should be taken into account. More details are covered in the following "Case study" sections.

For the use case of sending message to clients, make sure the app server is **NOT** the bottleneck. "Case study" section gives the guideline about how many app servers you need and how many server connections should be configured.

## Case study

The following sections go through four typical use cases for WebSocket transport: **echo**, **broadcast**, **send-to-group**, and **send-to-connection**. For each scenario, it lists the current ASRS inbound and outbound capacity, meanwhile explains what is the main factors on performance.

In default mode, App server, through Azure SignalR Service SDK by default, creates five server connections with ASRS. In the performance test result below, server connections are
increased to 15 (or more for broadcast and sending message to big group).

Different use cases have different requirement on app servers. **Broadcast** needs small number of app servers. **Echo** or **send-to-connection** needs many app servers.

In all use cases, the default message size is 2048 bytes, and message send
interval is 1 second.

## Default mode

Clients, web app servers, and ASRS are involved in this mode. Every client stands for a single connection.

### Echo

Firstly, web apps connect to ASRS. Secondly, many clients connect to web app, which redirect the clients to ASRS with the access token and endpoint. Then, clients establish WebSocket connections with ASRS.

After all clients establish connections, they start sending message, which contains a timestamp to the specific Hub every second. The Hub echoes the message back to its original client. Every client calculates the latency when it receives the echo message back.

The steps 5\~8 (red highlighted traffic) are in a loop, which will run for a
default duration (5 minutes) and get the statistic of all message latency.
The performance guide shows the maximum client connection number.

![Echo](./media/signalr-concept-performance/echo.png)

**Echo**'s behavior determines that the maximum inbound bandwidth is equal to maximum outbound bandwidth. See the following table.

|       Echo                        | Unit1 | Unit2 | Unit5 | Unit10 | Unit20 | Unit50 | Unit100 |
|-----------------------------------|-------|-------|-------|--------|--------|--------|---------|
| Connections                       | 1,000 | 2,000 | 5,000 | 10,000 | 20,000 | 50,000 | 100,000 |
| Inbound/Outbound (message/s) | 1,000 | 2,000 | 5,000 | 10,000 | 20,000 | 50,000 | 100,000 |
| Inbound/Outbound bandwidth (byte/s) | 2M    | 4M    | 10M   | 20M    | 40M    | 100M   | 200M    |

In this use case, every client invokes the hub defined in the app server. The hub just calls the method defined in the original client side. This hub is the most light weighed hub for **echo**.

```
        public void Echo(IDictionary<string, object> data)
        {
            Clients.Client(Context.ConnectionId).SendAsync("RecordLatency", data);
        }
```

Even for this simple hub, the traffic pressure on app server is also prominent as the **echo** inbound message increases. Therefore, it requires many app servers for large SKU tiers. The following table lists the app server count for every tier.


|    Echo          | Unit1 | Unit2 | Unit5 | Unit10 | Unit20 | Unit50 | Unit100 |
|------------------|-------|-------|-------|--------|--------|--------|---------|
| Connections      | 1,000 | 2,000 | 5,000 | 10,000 | 20,000 | 50,000 | 100,000 |
| App server count | 2     | 2     | 2     | 3      | 3      | 10     | 20      |

> [!NOTE]
>
> The client connection number, message size, message sending rate, SKU tier and app server's CPU/Memory have impact on overall performance of **echo**.

### Broadcast

For **broadcast**, when web app receives the message, it broadcasts to all clients. The more clients to broadcast, the more message traffic to all clients. See the following diagram.

![Broadcast](./media/signalr-concept-performance/broadcast.png)

The characteristic of broadcast is that there are a small number of clients broadcasting, which means the inbound message bandwidth is small, but the outbound bandwidth is huge. The outbound message bandwidth increases as the client connection or broadcast rate increases.

The maximum client connections, inbound/outbound message count, and bandwidth are summarized in the following table.

|     Broadcast             | Unit1 | Unit2 | Unit5  | Unit10 | Unit20 | Unit50  | Unit100 |
|---------------------------|-------|-------|--------|--------|--------|---------|---------|
| Connections               | 1,000 | 2,000 | 5,000  | 10,000 | 20,000 | 50,000  | 100,000 |
| Inbound (message/s)  | 2     | 2     | 2      | 2      | 2      | 2       | 2       |
| Outbound (message/s) | 2,000 | 4,000 | 10,000 | 20,000 | 40,000 | 100,000 | 200,000 |
| Inbound bandwidth (byte/s)  | 4K    | 4K    | 4K     | 4K     | 4K     | 4K      | 4K      |
| Outbound bandwidth (byte/s) | 4M    | 8M    | 20M    | 40M    | 80M    | 200M    | 400M    |

The broadcasting clients that post messages are no more than 4, thus requires fewer app servers compared with **echo** since the inbound message amount is small. Two app servers are enough for both SLA and performance consideration. But the default server connections should be increased to avoid unbalanced issue especially for Unit50 and Unit100.

|   Broadcast      | Unit1 | Unit2 | Unit5 | Unit10 | Unit20 | Unit50 | Unit100 |
|------------------|-------|-------|-------|--------|--------|--------|---------|
| Connections      | 1,000 | 2,000 | 5,000 | 10,000 | 20,000 | 50,000 | 100,000 |
| App server count | 2     | 2     | 2     | 2      | 2      | 2      | 2       |

> [!NOTE]
>
> Increase the default server connections from 5 to 40 on every app server to avoid possible unbalanced server connections to ASRS.
>
> The client connection number, message size, message sending rate, and SKU tier have impact on overall performance for **broadcast**

### Send to group

**Send-to-group** has similar traffic pattern except that after clients establishing WebSocket connections with ASRS, they must join groups before they can send message to a specific group. The traffic flow is illustrated by the following diagram.

![Send To Group](./media/signalr-concept-performance/sendtogroup.png)

Group member and group count are two factors with impact on the performance. To
simplify the analysis, we define two kinds of groups: small group and big
group.

- `small group`: 10 connections in every group. The group number is equal to (max
connection count) / 10. For example, for Unit 1, if there are 1000 connection counts, then we have 1000 / 10 = 100 groups.

- `Big group`: Group number is always 10. The group member count is equal to (max
connection count) / 10. For example, for Unit 1, if there are 1000 connection counts, then every group has 1000 / 10 = 100 members.

**Send-to-group** brings routing cost to ASRS because it has to find the target connections through a distributed data structure. As the sending connections increase, the cost increases as well.

#### Small group

The routing cost is significant for sending message to many small groups. Currently, the ASRS implementation hits routing cost limit at unit50. Adding more CPU and memory does not help, so unit100 cannot improve further by design. If you demand more inbound bandwidth, contact customer support for customization.

|   Send to small group     | Unit1 | Unit2 | Unit5  | Unit10 | Unit20 | Unit50 | Unit100 |
|---------------------------|-------|-------|--------|--------|--------|--------|---------|
| Connections               | 1,000 | 2,000 | 5,000  | 10,000 | 20,000 | 50,000 | 100,000
| Group member count        | 10    | 10    | 10     | 10     | 10     | 10     | 10 
| Group count               | 100   | 200   | 500    | 1,000  | 2,000  | 5,000  | 10,000 
| Inbound (message/s)  | 200   | 400   | 1,000  | 2,500  | 4,000  | 7,000  | 7,000   |
| Inbound bandwidth (byte/s)  | 400 K  | 800 K  | 2M     | 5M     | 8M     | 14M    | 14M     |
| Outbound (message/s) | 2,000 | 4,000 | 10,000 | 25,000 | 40,000 | 70,000 | 70,000  |
| Outbound bandwidth (byte/s) | 4M    | 8M    | 20M    | 50M     | 80M    | 140M   | 140M    |

There are many client connections calling the hub, therefore, app server number is also critical for performance. The suggested app server count is listed in the following table.

|  Send to small group   | Unit1 | Unit2 | Unit5 | Unit10 | Unit20 | Unit50 | Unit100 |
|------------------|-------|-------|-------|--------|--------|--------|---------|
| Connections      | 1,000 | 2,000 | 5,000 | 10,000 | 20,000 | 50,000 | 100,000 |
| App server count | 2     | 2     | 2     | 3      | 3      | 10     | 20      |

> [!NOTE]
>
> The client connection number, message size, message sending rate, routing cost, SKU tier and app server's CPU/Memory have impact on overall performance of **send-to-small-group**.

#### Big group

For **send-to-big-group**, the outbound bandwidth becomes the bottleneck before hitting the routing cost limit. The following table lists the maximum outbound bandwidth, which is almost the same as **broadcast**.

|    Send to big group      | Unit1 | Unit2 | Unit5  | Unit10 | Unit20 | Unit50  | Unit100 |
|---------------------------|-------|-------|--------|--------|--------|---------|---------|
| Connections               | 1,000 | 2,000 | 5,000  | 10,000 | 20,000 | 50,000  | 100,000
| Group member count        | 100   | 200   | 500    | 1,000  | 2,000  | 5,000   | 10,000 
| Group count               | 10    | 10    | 10     | 10     | 10     | 10      | 10
| Inbound (message/s)  | 20    | 20    | 20     | 20     | 20     | 20      | 20      |
| Inbound bandwidth (byte/s)  | 80 K   | 40 K   | 40 K    | 20 K    | 40 K    | 40 K     | 40 K     |
| Outbound (message/s) | 2,000 | 4,000 | 10,000 | 20,000 | 40,000 | 100,000 | 200,000 |
| Outbound bandwidth (byte/s) | 8M    | 8M    | 20M    | 40M    | 80M    | 200M    | 400M    |

The sending connection count is no more than 40, the burden on app server is small, thus the suggested web app number is also small.

|  Send to big group  | Unit1 | Unit2 | Unit5 | Unit10 | Unit20 | Unit50 | Unit100 |
|------------------|-------|-------|-------|--------|--------|--------|---------|
| Connections      | 1,000 | 2,000 | 5,000 | 10,000 | 20,000 | 50,000 | 100,000 |
| App server count | 2     | 2     | 2     | 2      | 2      | 2      | 2       |

> [!NOTE]
>
> Increase the default server connections from 5 to 40 on every app server to
> avoid possible unbalanced server connections to ASRS.
> 
> The client connection number, message size, message sending rate, routing cost, and SKU tier have impact on overall performance of **send-to-big-group**.

### Send to connection

In this use case, when clients establish the connections to ASRS, every client calls a special hub to get their own connection ID. The performance benchmark is responsible to collect all connection IDs, shuffle them and reassign them to all clients as a sending target. The clients keep sending message to the target connection until the performance test finishes.

![Send to client](./media/signalr-concept-performance/sendtoclient.png)

The routing cost for **Send-to-connection** is similar as **send-to-small-group**.

As the connection count increases, the overall performance is limited by routing cost. Unit 50 has reached the limit. As a result, unit 100 cannot improve further.

The following table is a statistic summary after many rounds of running **send-to-connection** benchmark

|   Send to connection   | Unit1 | Unit2 | Unit5 | Unit10 | Unit20 | Unit50          | Unit100         |
|------------------------------------|-------|-------|-------|--------|--------|-----------------|-----------------|
| Connections                        | 1,000 | 2,000 | 5,000 | 10,000 | 20,000 | 50,000          | 100,000         |
| Inbound/ Outbound (message/s) | 1,000 | 2,000 | 5,000 | 8,000  | 9,000  | 20,000 | 20,000 |
| Inbound/ Outbound bandwidth (byte/s) | 2M    | 4M    | 10M   | 16M    | 18M    | 40M       | 40M       |

This use case requires high load on app server side. See the suggested app server count in the following table.

|  Send to connection  | Unit1 | Unit2 | Unit5 | Unit10 | Unit20 | Unit50 | Unit100 |
|------------------|-------|-------|-------|--------|--------|--------|---------|
| Connections      | 1,000 | 2,000 | 5,000 | 10,000 | 20,000 | 50,000 | 100,000 |
| App server count | 2     | 2     | 2     | 3      | 3      | 10     | 20      |

> [!NOTE]
>
> The client connection number, message size, message sending rate, routing cost, SKU tier and app server's CPU/Memory have impact on overall performance of **send-to-connection**.

### ASP.NET SignalR echo/broadcast/send-to-connection

ASRS provides the same performance capacity for ASP.NET SignalR. This section gives the suggested web app count for ASP.NET SignalR **echo**, **broadcast**, and **send-to-small-group**.

The performance test uses Azure Web App of [Standard Service Plan S3](https://azure.microsoft.com/pricing/details/app-service/windows/) for ASP.NET SignalR.

- `echo`

|   Echo           | Unit1 | Unit2 | Unit5 | Unit10 | Unit20 | Unit50 | Unit100 |
|------------------|-------|-------|-------|--------|--------|--------|---------|
| Connections      | 1,000 | 2,000 | 5,000 | 10,000 | 20,000 | 50,000 | 100,000 |
| App server count | 2     | 2     | 4     | 4      | 8      | 32      | 40       |

- `broadcast`

|  Broadcast       | Unit1 | Unit2 | Unit5 | Unit10 | Unit20 | Unit50 | Unit100 |
|------------------|-------|-------|-------|--------|--------|--------|---------|
| Connections      | 1,000 | 2,000 | 5,000 | 10,000 | 20,000 | 50,000 | 100,000 |
| App server count | 2     | 2     | 2     | 2      | 2      | 2      | 2       |

- `Send-to-small-group`

|  Send to small group     | Unit1 | Unit2 | Unit5 | Unit10 | Unit20 | Unit50 | Unit100 |
|------------------|-------|-------|-------|--------|--------|--------|---------|
| Connections      | 1,000 | 2,000 | 5,000 | 10,000 | 20,000 | 50,000 | 100,000 |
| App server count | 2     | 2     | 4     | 4      | 8      | 32      | 40       |

## Serverless mode

Clients and ASRS are involved in this mode. Every client stands for a single connection. The client sends messages through REST API to another client or broadcast messages to all.

Sending high-density messages through REST API is not as efficient as WebSocket, because it requires to build a new HTTP connection every time - an extra cost in serverless mode.

### Broadcast through REST API
All clients establish WebSocket connections with ASRS. Then some clients start broadcasting through REST API. The message sending (inbound) are all through HTTP Post, which is not efficient compared with WebSocket.

|   Broadcast through REST API     | Unit1 | Unit2 | Unit5  | Unit10 | Unit20 | Unit50  | Unit100 |
|---------------------------|-------|-------|--------|--------|--------|---------|---------|
| Connections               | 1,000 | 2,000 | 5,000  | 10,000 | 20,000 | 50,000  | 100,000 |
| Inbound (message/s)  | 2     | 2     | 2      | 2      | 2      | 2       | 2       |
| Outbound (message/s) | 2,000 | 4,000 | 10,000 | 20,000 | 40,000 | 100,000 | 200,000 |
| Inbound bandwidth (byte/s)  | 4K    | 4K    | 4K     | 4K     | 4K     | 4K      | 4K      |
| Outbound bandwidth (byte/s) | 4M    | 8M    | 20M    | 40M    | 80M    | 200M    | 400M    |

### Send to user through REST API
The benchmark assigns user names to all of the clients before they start connecting to ASRS. After the clients established WebSocket connections with ASRS, they start sending messages to others through HTTP Post.

|   Send to user through REST API | Unit1 | Unit2 | Unit5  | Unit10 | Unit20 | Unit50  | Unit100 |
|---------------------------|-------|-------|--------|--------|--------|---------|---------|
| Connections               | 1,000 | 2,000 | 5,000  | 10,000 | 20,000 | 50,000  | 100,000 |
| Inbound (message/s)  | 300   | 600   | 900    | 1,300  | 2,000  | 10,000  | 18,000  |
| Outbound (message/s) | 300   | 600   | 900    | 1,300  | 2,000  | 10,000  | 18,000 |
| Inbound bandwidth (byte/s)  | 600 K  | 1.2M  | 1.8M   | 2.6M   | 4M     | 10M     | 36M    |
| Outbound bandwidth (byte/s) | 600 K  | 1.2M  | 1.8M   | 2.6M   | 4M     | 10M     | 36M    |

## Performance test environments

The performance test for all use cases listed above were conducted in Azure
environment. At most 50 client VMs, and 20 app server VMs are used.

Client VM size: StandardDS2V2 (2 vCPU, 7G memory)

App server VM size: StandardF4sV2 (4 vCPU, 8G memory)

Azure SignalR SDK server connections: 15

## Performance tools

https://github.com/Azure/azure-signalr-bench/tree/master/SignalRServiceBenchmarkPlugin

## Next steps

In this article, you get an overview of SignalR Service performance in typical use case scenarios.

To get more details on the internals of SignalR Service and scaling for SignalR Service, read the following guide.

* [Azure SignalR Service Internals](signalr-concept-internals.md)
* [Azure SignalR Service Scaling](signalr-howto-scale-multi-instances.md)