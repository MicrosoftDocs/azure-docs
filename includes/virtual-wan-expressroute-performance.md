---
 title: include file
 description: include file
 services: virtual-wan
 author: siddomala
 ms.service: azure-virtual-wan
 ms.topic: include
 ms.date: 04/28/2025
 ms.author: siddomala
 ms.custom: include file
---
| Scale unit     | Connections per second | Mega-bits per second | Packets per second | Total flows |
|----------------|------------------------|----------------------|--------------------|-------------|
| 1              | 14,000                 | 2,000                | 200,000            | 200,000     |
| 2              | 28,000                 | 4,000                | 400,000            | 400,000     |
| 3              | 42,000                 | 6,000                | 600,000            | 600,000     |
| 4              | 56,000                 | 8,000                | 800,000            | 800,000     |
| 5              | 70,000                 | 10,000               | 1,000,000          | 1,000,000   |
| 6              | 84,000                 | 12,000               | 1,200,000          | 1,200,000   |
| 7              | 98,000                 | 14,000               | 1,400,000          | 1,400,000   |
| 8              | 112,000                | 16,000               | 1,600,000          | 1,600,000   |
| 9              | 126,000                | 18,000               | 1,800,000          | 1,800,000   |
| 10             | 140,000                | 20,000               | 2,000,000          | 2,000,000   |

It's important to consider the following points:
* During maintenance operations, scale units 2 through 10 maintain their aggregate throughput. However, scale unit 1 can experience slight variations in throughput during such operations.  
* Regardless of the number of scale units deployed, if a single TCP flow exceeds 1.5 Gbps, traffic performance can degrade.
