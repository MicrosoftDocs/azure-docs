---
title: Adaptive Network Hardening in Azure Security Center | Microsoft Docs
description: Learn how to use actual traffic patterns to harden your network security groups (NSG) rules and further improve your security posture.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin

ms.assetid: 09d62d23-ab32-41f0-a5cf-8d80578181dd
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/11/2020
ms.author: memildin
---

# Adaptive Network Hardening in Azure Security Center
Learn how to configure Adaptive Network Hardening in Azure Security Center.

## What is Adaptive Network Hardening?
Applying [network security groups (NSG)](https://docs.microsoft.com/azure/virtual-network/security-overview) to filter traffic to and from resources, improves your network security posture. However, there can still be some cases in which the actual traffic flowing through the NSG is a subset of the NSG rules defined. In these cases, further improving the security posture can be achieved by hardening the NSG rules, based on the actual traffic patterns.

Adaptive Network Hardening provides recommendations to further harden the NSG rules. It uses a machine learning algorithm that factors in actual traffic, known trusted configuration, threat intelligence, and other indicators of compromise, and then provides recommendations to allow traffic only from specific IP/port tuples.

For example, let's say the existing NSG rule is to allow traffic from 140.20.30.10/24 on port 22. The Adaptive Network Hardening's recommendation, based on the analysis, would be to narrow the range and allow traffic from 140.23.30.10/29 – which is a narrower IP range, and deny all other traffic to that port.

>[!TIP]
> Adaptive Network Hardening recommendations are only supported on specific ports. For the full list, see [Which ports are supported?](#which-ports-are-supported) below. 


![Network hardening view](./media/security-center-adaptive-network-hardening/traffic-hardening.png)


## View Adaptive Network Hardening alerts and rules

1. In Security Center, select **Networking** -> **Adaptive Network Hardening**. The network VMs are listed under three separate tabs:
   * **Unhealthy resources**: VMs that currently have recommendations and alerts that were triggered by running the Adaptive Network Hardening algorithm. 
   * **Healthy resources**: VMs without alerts and recommendations.
   * **Unscanned resources**: VMs that the Adaptive Network Hardening algorithm cannot be run on because of one of the following reasons:
      * **VMs are Classic VMs**: Only Azure Resource Manager VMs are supported.
      * **Not enough data is available**: In order to generate accurate traffic hardening recommendations, Security Center requires at least 30 days of traffic data.
      * **VM is not protected by ASC standard**: Only VMs that are set to Security Center's Standard pricing tier are eligible for this feature.

     ![unhealthy resources](./media/security-center-adaptive-network-hardening/unhealthy-resources.png)

2. From the **Unhealthy resources** tab, select a VM to view its alerts and the recommended hardening rules to apply.

    ![hardening alerts](./media/security-center-adaptive-network-hardening/anh-recommendation-rules.png)


## Review and apply Adaptive Network Hardening recommended rules

1. From the **Unhealthy resources** tab, select a VM. The alerts and recommended hardening rules are listed.

     ![hardening rules](./media/security-center-adaptive-network-hardening/hardening-alerts.png)

   > [!NOTE]
   > The **Rules** tab lists the rules that Adaptive Network Hardening recommends you add. The **Alerts** tab lists the alerts that were generated due to traffic, flowing to the resource, which is not within the IP range allowed in the recommended rules.

2. If you want to change some of the parameters of a rule, you can modify it, as explained in [Modify a rule](#modify-rule).
   > [!NOTE]
   > You can also [delete](#delete-rule) or [add](#add-rule) a rule.

3. Select the rules that you want to apply on the NSG, and click **Enforce**.

      > [!NOTE]
      > The enforced rules are added to the NSG(s) protecting the VM. (A VM could be protected by an NSG that is associated to its NIC, or the subnet in which the VM resides, or both)

    ![enforce rules](./media/security-center-adaptive-network-hardening/enforce-hard-rule2.png)


### Modify a rule  <a name ="modify-rule"> </a>

You may want to modify the parameters of a rule that has been recommended. For example, you may want to change the recommended IP ranges.

Some important guidelines for modifying an Adaptive Network Hardening rule:

* You can modify the parameters of "allow" rules only. 
* You cannot change "allow" rules to become "deny" rules. 

  > [!NOTE]
  > Creating and modifying "deny" rules is done directly on the NSG. For more information, see [Create, change, or delete a network security group](https://docs.microsoft.com/azure/virtual-network/manage-network-security-group).

* A **Deny all traffic** rule is the only type of "deny" rule that would be listed here, and it cannot be modified. You can, however, delete it (see [Delete a rule](#delete-rule)).
  > [!NOTE]
  > A **Deny all traffic** rule is recommended when, as a result of running the algorithm, Security Center does not identify traffic that should be allowed, based on the existing NSG configuration. Therefore, the recommended rule is to deny all traffic to the specified port. The name of this type of rule is displayed as "*System Generated*". After enforcing this rule, its actual name in the NSG will be a string comprised of the protocol, traffic direction, "DENY", and a random number.

*To modify an Adaptive Network Hardening rule:*

1. To modify  some of the parameters of a rule, in the **Rules** tab, click on the three dots (...) at the end of the rule's row, and click **Edit**.

   ![edit rule](./media/security-center-adaptive-network-hardening/edit-hard-rule.png)

1. In the **Edit rule** window, update the details that you want to change, and click **Save**.

   > [!NOTE]
   > After clicking **Save**, you have successfully changed the rule. *However, you have not applied it to the NSG.* To apply it, you must select the rule in the list, and click **Enforce** (as explained in the next step).

   ![edit rule](./media/security-center-adaptive-network-hardening/edit-hard-rule3.png)

3. To apply the updated rule, from the list, select the updated rule and click **Enforce**.

    ![enforce rule](./media/security-center-adaptive-network-hardening/enforce-hard-rule.png)

### Add a new rule <a name ="add-rule"> </a>

You can add an "allow" rule that was not recommended by Security Center.

> [!NOTE]
> Only "allow" rules can be added here. If you want to add "deny" rules, you can do so directly on the NSG. For more information, see [Create, change, or delete a network security group](https://docs.microsoft.com/azure/virtual-network/manage-network-security-group).

*To add an Adaptive Network Hardening rule:*

1. Click **Add rule** (located in the top-left corner).

   ![add rule](./media/security-center-adaptive-network-hardening/add-hard-rule.png)

1. In the **New rule** window, enter the details and click **Add**.

   > [!NOTE]
   > After clicking **Add**, you have successfully added the rule, and it is listed with the other recommended rules. However, you have not applied it on the NSG. To activate it, you must select the rule in the list, and click **Enforce** (as explained in the next step).

3. To apply the new rule, from the list, select the new rule and click **Enforce**.

    ![enforce rule](./media/security-center-adaptive-network-hardening/enforce-hard-rule.png)


### Delete a rule <a name ="delete-rule"> </a>

When necessary, you can delete a recommended rule for the current session. For example, you may determine that applying a suggested rule could block legitimate traffic.

*To delete an Adaptive Network Hardening rule for your current session:*

1. In the **Rules** tab, click on the three dots (...) at the end of the rule's row, and click **Delete**.  

    ![hardening rules](./media/security-center-adaptive-network-hardening/delete-hard-rule.png)

 

## Which ports are supported?

Adaptive Network Hardening recommendations are only supported on specific ports. This table gives you the full list:

|Port|Protocol|Associated Service|
|:---:|:----:|:----|
|13|UDP|Daytime service|
|17|UDP|QOTD protocol|
|19|UDP|CHARGEN protocol|
|22|TCP|SSH|
|23|TCP|Telnet|
|53|UDP|DNS|
|69|UDP|TFTP|
|81|TCP|Potentially malicious (TOR exit node)|
|111|TCP/UDP|RPC|
|119|TCP|NNTP|
|123|UDP|NTP|
|135|TCP/UDP|Endpoint Mapper; RPC; DCE|
|137|TCP/UDP|NetBIOS Name Service|
|138|TCP/UDP|NetBIOS Datagram Service|
|139|TCP|NetBIOS Session Service|
|161|TCP/UDP|SNMP|
|162|TCP/UDP|SNMP|
|389|TCP|LDAP|
|445|TCP|SMB|
|512|TCP|Rexec|
|514|TCP|Remote shell|
|593|TCP/UDP|HTTP RPC|
|636|TCP|LDAP|
|873|TCP|Rsync|
|1433|TCP|MS SQL|
|1434|UDP|MS SQL|
|1900|UDP|SSDP|
|1900|UDP|SSDP|
|2049|TCP/UDP|NFS|
|2301|TCP|Compaq management service|
|2323|TCP|3d-nfsd|
|2381|TCP|Compaq management service|
|3268|TCP|LDAP|
|3306|TCP|MySQL|
|3389|TCP|RDP|
|4333|TCP|mSQL|
|5353|UDP|mDNS|
|5432|TCP|PostgreSQL|
|5555|TCP|Personal Agent; HP OmniBack|
|5800|TCP|VNC|
|5900|TCP|Remote framebuffer; VNC|
|5900|TCP|VNC|
|5985|TCP|Windows PowerShell|
|5986|TCP|Windows PowerShell|
|6379|TCP|Redis|
|6379|TCP|Redis|
|7000|TCP|Cassandra|
|7001|TCP|Cassandra|
|7199|TCP|Cassandra|
|8081|TCP|CosmosDB; Sun Proxy Admin|
|8089|TCP|Splunk|
|8545|TCP|Potentially malicious (Cryptominer)|
|9042|TCP|Cassandra|
|9160|TCP|Cassandra|
|9300|TCP|Elasticsearch|
|11211|UDP|Memcached|
|16379|TCP|Redis|
|26379|TCP|Redis|
|27017|TCP|MongoDB|
|37215|TCP|Potentially malicious|
||||