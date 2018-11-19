---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 06/04/2018
 ms.author: cherylmc
 ms.custom: include file
---
Do not associate a route table that includes a route with a destination of 0.0.0.0/0 to the gateway subnet. Doing so prevents the gateway from functioning properly.