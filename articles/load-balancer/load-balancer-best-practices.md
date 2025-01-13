---
title: Azure Load Balancer Best Practices
titleSuffix: Azure Load Balancer
description: 
services: load-balancer
author: 
ms.service: azure-load-balancer
ms.topic: troubleshooting
ms.date: 06/26/2024
ms.author: 
---

# Azure Load Balancer Best Practices
<!-- Before Publishing: -->
<!-- Verify TOC entry is added to TOC.yml -->

This article discusses a collection of Azure best practices for your load balancer deployment. These best practices are derived from our experience with Azure networking and the experiences of customers like yourself.  

For each best practice, this article explains: 

- What the best practice is
- Why you want to enable that best practice
- What might happen if you fail to enable the best practice
- How you can learn to enable this best practice 

These best practices are based on a consensus opinion, and Azure platform capability and features sets, as they exist at the time this article was written. 

<!-- Comment: Let's rethink the headers. The current draft goes a bit deep (level 4). I think we can get away with 2 levels. Since all of the items under Architectural Guidance are under Reliability Best Practices, do we need Reliability Best Practices? -->
## Architectural Guidance
### Reliability Best Practices
#### Deploy with zone-redundancy. 
- Zone-redundancy provides the best resiliency by protecting the data path from zone failure. The load balancer's availability zone selection is synonymous with its frontend IP's zone selection. For public load balancers, if the public IP in the load balancer's frontend is zone redundant then the load balancer is also zone-redundant.
- Deploy load balancer in a region that supports availability zones and enable Zone-redundant when creating a new Public IP address used for the Frontend IP configuration.
- Public IP addresses cannot be changed to zone redundant but we are updating all non-zonal Standard Public IPs to be zone redundant by default. For more information, visit the following Microsoft Azure Blog Azure Public IPs are now zone-redundant by default | Microsoft Azure Blog. To see the most updated list of regions that support zone redundant Standard Public IPs by default, please refer to Public IP addresses in Azure - Azure Virtual Network | Microsoft Learn.
- If you cannot deploy as zone-redundant, the next option is to have a zonal load balancer deployment.
- Zonal frontend is recommended when the backend is concentrated in a particular zone, but we recommend deploying backend pool members across multiple zones to benefit from zone redundancy.
- Refer to the following the doc if you want to migrate existing deployments to zonal or zone-redundant Migrate Load Balancer to availability zone support | Microsoft Learn.

#### Reduncdancy in your backend pool

- Ensure that the backend pool contains at least 2 instances

<!--- When adding additional content, add 1 section at a time. Use the appropriate header level (denoted by hashes). Re-create all bullet lists -->