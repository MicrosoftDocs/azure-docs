---
title: Reference table for all Azure Security Center recommendations 
description: This article lists Azure Security Center's security recommendations that help you protect your resources.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/18/2019
ms.author: memildin

---

# Security recommendations - a reference guide

This article provides the full list of the recommendations you might see in Azure Security Center.

For an explanation of how to find these and how to resolve them, see [here](security-center-network-recommendations.md).

Your secure score is based on how many Security Center recommendations you have mitigated. To prioritize the recommendations to resolve first, consider the severity of each, as well as the Security Controls described in [Secure Score and Security Controls]().  

## Recommendations

|Recommendation|Description & related policy|Severity|Quick fix enabled|Resource type|
|----|----|----|----|----|----|
|Network security groups on the subnet level should be enabled|Enable network security groups to control network access of resources deployed in your subnets.<br>(Related policy: Subnets should be associated with a Network Security Group)|High/ Medium|N|Subnet|
|Virtual machines should be associated with a network security group|Enable Network Security Groups to control network access of your virtual machines.<br>(Related policy: Virtual machines should be associated with a Network Security Group)|High/ Medium|N|Virtual machine|
|Access should be restricted for permissive network security groups with Internet-facing VMs|Harden the network security groups of your Internet-facing VMs by restricting the access of your existing allow rules.<br>(Related policy: Network Security Group Rules for Internet facing virtual machines should be hardened)|High|N|Virtual machine|
|The rules for web applications on IaaS NSGs should be hardened|Harden the network security group (NSG) of your virtual machines that are running web applications, with NSG rules that are overly permissive with regards to web application ports.<br>(Related policy: The NSGs rules for web applications on IaaS should be hardened)|High|N|Virtual machine|
|Access to App Services should be restricted|Restrict access to your App Services by changing the networking configuration, to deny inbound traffic from ranges that are too broad.<br>(Related policy: [Preview]: Access to App Services should be restricted)|High|N|App service|
|Management ports should be closed on your virtual machines|Harden the network security group of your virtual machines to restrict access to management ports.<br>(Related policy: Management ports should be closed on your virtual machines)|High|N|Virtual machine|


## Next steps
To learn more about recommendations that apply to other Azure resource types, see the following:

* [Monitor identity and access](security-center-identity-access.md)
* [Protecting your machines and applications](security-center-virtual-machine-protection.md)
* [Protecting your Azure SQL service](security-center-sql-service-recommendations.md)

