---
title: Azure Firewall performance
description: Learn about Azure Firewall performance data and throughput benchmarks for Basic, Standard, and Premium SKUs across different use cases.
author: duongau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 03/28/2026
ms.author: duau
# Customer intent: As a network engineer, I want to compare the performance metrics of Azure Firewall Basic, Standard, and Premium, so that I can choose the appropriate version to meet my organization’s security and performance requirements.
---

# Azure Firewall performance

Reliable firewall performance is essential to operate and protect your virtual networks in Azure. More advanced features, like those found in Azure Firewall Premium, require more processing complexity and affect firewall performance and overall network performance.

Azure Firewall has three versions: Basic, Standard, and Premium.

- Azure Firewall Basic

   Azure Firewall Basic is intended for small and medium size (SMB) customers to secure their Azure cloud environments. It provides the essential protection SMB customers need at an affordable price point.

- Azure Firewall Standard

   Azure Firewall Standard became generally available in September 2018. It's cloud native, highly available, with built-in auto scaling firewall-as-a-service. You can centrally govern and log all your traffic flows by using a DevOps approach. The service supports both application and network-level-filtering rules, and is integrated with the Microsoft Threat Intelligence feed for filtering known malicious IP addresses and domains.
- Azure Firewall Premium

   Azure Firewall Premium is a next generation firewall. It has capabilities that are required for highly sensitive and regulated environments. The features that might affect the performance of the firewall are TLS (Transport Layer Security) inspection and IDPS (Intrusion Detection and Prevention).

For more information about Azure Firewall, see [What is Azure Firewall?](overview.md)

## Performance testing

Before you deploy Azure Firewall, test and evaluate the performance to ensure it meets your expectations. Azure Firewall should handle the current traffic on a network and be ready for potential traffic growth. Evaluate the performance on a test network, not in a production environment. The testing should attempt to replicate the production environment as closely as possible. Account for the network topology, and emulate the actual characteristics of the expected traffic through the firewall.

## Performance data

The following performance results demonstrate the maximum Azure Firewall throughput in various use cases. You measure all use cases while Threat intelligence mode is set to alert or deny. The Azure Firewall Premium performance boost feature is enabled by default on all Azure Firewall premium deployments. This feature includes enabling Accelerated Networking on the underlying firewall virtual machines.


| Firewall type and use case | TCP/UDP bandwidth (Gbps) | HTTP/S bandwidth (Gbps) |
|---------|---------|---------|
| Basic SKU | 0.25 | 0.25 |
| Standard SKU | 30 | 30 |
| Premium SKU with both TLS disabled and IDPS disabled | 100 | 100 |
| Premium SKU with TLS inspection enabled and IDPS disabled | - | 100 |
| Premium SKU with TLS enabled and IDPS enabled in Alert only mode | 100 | 100 |
| Premium SKU with TLS enabled and IDPS enabled in Deny mode | 10 | 10 |

### Throughput for single connections

| Firewall use case | Throughput (Gbps) |
|---------|---------|
| Basic | up to 250 Mbps |
| Standard<br>Max bandwidth for single TCP connection | up to 1.5 |
| Premium<br>Max bandwidth for single TCP connection | up to 9 |
| Premium single TCP connection with IDPS on *Alert and Deny* mode | up to 300 Mbps |

### Total throughput for initial firewall deployment

The following throughput numbers are for Azure Firewall Standard and Premium deployments before autoscale (out-of-the-box deployment). Azure Firewall gradually scales out when the average throughput and CPU consumption reach 60% or if the number of connections usage reaches 80%. Scale out takes five to seven minutes. Azure Firewall gradually scales in when the average throughput, CPU consumption, or number of connections drops below 20%.

When performance testing, test for at least 10 to 15 minutes, and start new connections to take advantage of newly created firewall nodes.


| Firewall use case | Throughput (Gbps) |
|---------|---------|
| Standard<br>Max bandwidth | up to 3 |
| Premium<br>Max bandwidth | up to 18 |

> [!NOTE]
> Azure Firewall Basic doesn't autoscale.

## Next steps

> [!div class="nextstepaction"]
> [Deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md)
