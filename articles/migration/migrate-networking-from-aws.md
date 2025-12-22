---
title: Migrate Networking from Amazon Web Services (AWS) to Azure
description: Learn about concepts, how-tos, and best practices for migrating networking services from Amazon Web Services (AWS) to Azure.
author: mbender-ms
ms.author: mbender
ms.reviewer: prwilk, chkittel
ms.topic: concept-article
ms.date: 10/28/2025
ms.service: azure
ms.collection:
 - migration
 - aws-to-azure
---

# Migrate networking from Amazon Web Services (AWS) to Azure

The articles listed on this page outline scenarios for how to migrate networking services from Amazon Web Services (AWS) to Azure networking services.

Networking services are foundational components of most enterprise workloads. The migration process moves these services while ensuring that they retain the same capabilities. Examples of networking services include virtual networks, load balancers, and firewalls that connect and protect critical data for various purposes. Whether it's to support custom applications, AI/ML training processes, business intelligence operations, or commercial off-the-shelf solutions, your networking infrastructure requires careful migration planning.

## Component comparison

Start the migration process by comparing the AWS networking service that's used in the workload with the closest Azure counterpart. The goal is to identify the most suitable Azure services for your workload. For more information, see [Comparing AWS and Azure networking services](/azure/architecture/aws-professional/networking).

> [!NOTE]
> This comparison isn't an exact representation of the functionality that these services provide in your workload.

## Migration guides

Use the following migration guides as examples to help structure your migration strategy.

| Scenario | Key services | Description |
|--|--|--|
| [Connect AWS and Azure using a BGP-enabled VPN gateway](/azure/vpn-gateway/vpn-gateway-howto-aws-bgp) |  AWS virtual private gateway to Azure VPN gateway | Demonstrates how to set up a BGP-enabled connection between Azure and Amazon Web Services (AWS). |
| [Migrate Application Load Balancing from AWS to Azure](/azure/application-gateway/application-load-balancing-aws-to-azure-how-to) | AWS Application Load Balancer to Azure Application Gateway | Demonstrates how to migrate an AWS Application Load Balancer (ALB) to an Azure Application Gateway, including HTTP and HTTPS protocols. |
| [Migrate Network Load Balancing from AWS to Azure](/azure/load-balancer/network-load-balancing-aws-to-azure-how-to) | AWS Network Load Balancer to Azure Standard Load Balancer | Demonstrates how to migrate an AWS Network Load balancer (NLB) to an Azure Load Balancer. |
| [Migrate Amazon API Gateway to Azure](/azure/api-management/migrate-amazon-api-gateway-to-api-management) | Amazon API Gateway to Azure API Management | Demonstrates how to migrate an Amazon API Gateway to Azure API Management, including APIs and API configurations. |

## Related workload components

Networking makes up only part of your workload. Explore other components that you might migrate:

- [Compute](migrate-compute-from-aws.md)
- [Databases](migrate-databases-from-aws.md)
- [Storage](migrate-storage-from-aws.md)
- [Security](migrate-security-from-aws.md)
