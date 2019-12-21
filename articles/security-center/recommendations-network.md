---
title: Azure Security Center recommendations for networking
description: This article lists Azure Security Center's security recommendations that help you protect your network resources.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 47fa1f76-683d-4230-b4ed-d123fef9a3e8
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/29/2019
ms.author: memildin

---

# Network recommendations - reference guide

This article provides the full list of the recommendations you might see in Azure Security Center regarding your network's topology and your internet facing endpoints.

For an explanation of how to find these and how to resolve them, see [here](security-center-network-recommendations.md).

## Network recommendations

|Recommendation name|Description|Severity|Secure score|Resource type|
|----|----|----|----|----|----|
|Network security groups on the subnet level should be enabled|Enable network security groups to control network access of resources deployed in your subnets.|High/ Medium|30|Subnet|
|Virtual machines should be associated with a network security group|Enable Network Security Groups to control network access of your virtual machines.|High/ Medium|30|Virtual machine|
|Access should be restricted for permissive network security groups with Internet-facing VMs|Harden the network security groups of your Internet-facing VMs by restricting the access of your existing allow rules.|High|20|Virtual machine|
|The rules for web applications on IaaS NSGs should be hardened|Harden the network security group (NSG) of your virtual machines that are running web applications, with NSG rules that are overly permissive with regards to web application ports.|High|20|Virtual machine|
|Access to App Services should be restricted|Restrict access to your App Services by changing the networking configuration, to deny inbound traffic from ranges that are too broad.|High|10|App service|
|Management ports should be closed on your virtual machines|Harden the network security group of your virtual machines to restrict access to management ports.|High|10|Virtual machine|
DDoS Protection Standard should be enabled|Protect virtual networks containing applications with public IPs by enabling DDoS protection service standard. DDoS protection enables mitigation of network volumetric and protocol attacks.|High|10|Virtual network|
|IP forwarding on your virtual machine should be disabled|Disable IP forwarding. When IP forwarding is enabled on a virtual machine's NIC, the machine can receive traffic addressed to other destinations. IP forwarding is rarely required (for example, when using the VM as a network virtual appliance), and therefore, this should be reviewed by the network security team.|Medium|10|Virtual machine|
|Web Application should only be accessible over HTTPS|Enable "HTTPS only" access for web applications. Use of HTTPS ensures server/service authentication and protects data in transit from network layer eavesdropping attacks.|Medium|20|Web application|
|Just-in-time network access control should be applied on virtual machines|Apply just-in-time (JIT) virtual machine (VM) access control to permanently lock down access to selected ports, and enable authorized users to open them, via JIT, for a limited amount of time only.|High|20|Virtual machine|
|Function Apps should only be accessible over HTTPS|Enable "HTTPS only" access for function apps. Use of HTTPS ensures server/service authentication and protects data in transit from network layer eavesdropping attacks.|Medium|20|Function app|
|Secure transfer to storage accounts should be enabled|Enable secure transfer to storage accounts. Secure transfer is an option that forces your storage account to accept requests only from secure connections (HTTPS). Use of HTTPS ensures authentication between the server and the service and protects data in transit from network layer attacks, such as man-in-the-middle, eavesdropping, and session-hijacking.|High|20|Storage account|


## Next steps
To learn more about recommendations that apply to other Azure resource types, see the following:

* [Monitor identity and access](security-center-identity-access.md)
* [Protecting your machines and applications](security-center-virtual-machine-protection.md)
* [Protecting your Azure SQL service](security-center-sql-service-recommendations.md)

