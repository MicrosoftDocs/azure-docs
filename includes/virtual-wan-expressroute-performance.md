---
 title: include file
 description: include file
 services: virtual-wan
 author: siddomala
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 03/04/2022
 ms.author: siddomala
 ms.custom: include file
---

| **Scale unit** | **Connections per second** | **Mega-Bits per second** | **Packets per second** |
|---|---|---|---| 
|1 scale unit <br> (2 instances) | 14,000 | 2,000 | 200,000
|2 scale units <br> (4 instances) | 28,000 | 4,000 | 400,000
|3 scale units <br> (6 instances) | 42,000 | 6,000 | 600,000
|4 scale units <br> (8 instances) | 56,000 | 8,000 | 800,000
|5 scale units <br> (10 instances) | 70,000 | 10,000 | 1,000,000
|6 scale units <br> (12 instances) | 84,000 | 12,000 | 1,200,000
|7 scale units <br> (14 instances) | 98,000 | 14,000 | 1,400,000
|8 scale units <br> (16 instances) | 112,000 | 16,000 | 1,600,000
|9 scale units <br> (18 instances) | 126,000 | 18,000 | 1,800,000
|10 scale units <br> (20 instances) | 140,000 | 20,000 | 2,000,000

>[!NOTE]
>*ExpressRoute gateways are deployed as n instances. Each gateway instance may support up to 100,000 packets per second. 

Scale units 2-10, during maintenance operations, maintain aggregate throughput. However, scale unit 1, during a maintenance operation, may see a slight variation in throughput numbers.  
