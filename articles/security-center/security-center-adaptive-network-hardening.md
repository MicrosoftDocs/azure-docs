---
title: Adaptive network hardening in Azure Security Center | Microsoft Docs
description: Learn how to use actual traffic patterns to harden your network security groups (NSG) rules and further improve your security posture.
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: how-to
ms.date: 05/26/2021
ms.author: memildin
---

# Improve your network security posture with adaptive network hardening

Adaptive network hardening is an agentless feature of Azure Security Center - nothing needs to be installed on your machines to benefit from this network hardening tool.

This page explains how to configure and manage adaptive network hardening in Security Center.

## Availability
|Aspect|Details|
|----|:----|
|Release state:|General Availability (GA)|
|Pricing:|Requires [Azure Defender for servers](defender-for-servers-introduction.md)|
|Required roles and permissions:|Write permissions on the machine’s NSGs|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: National/Sovereign (US Gov, Azure China)|
|||

## What is adaptive network hardening?
Applying [network security groups (NSG)](../virtual-network/network-security-groups-overview.md) to filter traffic to and from resources, improves your network security posture. However, there can still be some cases in which the actual traffic flowing through the NSG is a subset of the NSG rules defined. In these cases, further improving the security posture can be achieved by hardening the NSG rules, based on the actual traffic patterns.

Adaptive network hardening provides recommendations to further harden the NSG rules. It uses a machine learning algorithm that factors in actual traffic, known trusted configuration, threat intelligence, and other indicators of compromise, and then provides recommendations to allow traffic only from specific IP/port tuples.

For example, let's say the existing NSG rule is to allow traffic from 140.20.30.10/24 on port 22. Based on traffic analysis, adaptive network hardening might recommend narrowing the range to allow traffic from 140.23.30.10/29, and deny all other traffic to that port. For the full list of supported ports, see the FAQ entry [Which ports are supported?](#which-ports-are-supported).

## View hardening alerts and recommended rules

1. From Security Center's menu, open the **Azure Defender** dashboard and select the adaptive network hardening tile (1), or the insights panel item related to adaptive network hardening (2). 

    :::image type="content" source="./media/security-center-adaptive-network-hardening/traffic-hardening.png" alt-text="Accessing the adaptive network hardening tools." lightbox="./media/security-center-adaptive-network-hardening/traffic-hardening.png":::

    > [!TIP]
    > The insights panel shows the percentage of your VMs currently defended with adaptive network hardening. 

1. The details page for the **Adaptive Network Hardening recommendations should be applied on internet facing virtual machines** recommendation opens with your network VMs grouped into three  tabs:
   * **Unhealthy resources**: VMs that currently have recommendations and alerts that were triggered by running the adaptive network hardening algorithm. 
   * **Healthy resources**: VMs without alerts and recommendations.
   * **Unscanned resources**: VMs that the adaptive network hardening algorithm cannot be run on because of one of the following reasons:
      * **VMs are Classic VMs**: Only Azure Resource Manager VMs are supported.
      * **Not enough data is available**: In order to generate accurate traffic hardening recommendations, Security Center requires at least 30 days of traffic data.
      * **VM is not protected by Azure Defender**: Only VMs protected with [Azure Defender for servers](defender-for-servers-introduction.md) are eligible for this feature.

    :::image type="content" source="./media/security-center-adaptive-network-hardening/recommendation-details-page.png" alt-text="Details page of the recommendation Adaptive Network Hardening recommendations should be applied on internet facing virtual machines.":::

1. From the **Unhealthy resources** tab, select a VM to view its alerts and the recommended hardening rules to apply.

    - The **Rules** tab lists the rules that adaptive network hardening recommends you add
    - The **Alerts** tab lists the alerts that were generated due to traffic, flowing to the resource, which is not within the IP range allowed in the recommended rules.

1. Optionally, edit the rules:

    - [Modify a rule](#modify-rule)
    - [Delete a rule](#delete-rule) 
    - [Add a rule](#add-rule)

3. Select the rules that you want to apply on the NSG, and select **Enforce**.

    > [!TIP]
    > If the allowed source IP ranges shows as 'None', it means that recommended rule is a *deny* rule, otherwise, it is an *allow* rule.

    :::image type="content" source="./media/security-center-adaptive-network-hardening/hardening-alerts.png" alt-text="Managing adaptive network hardening rules.":::

      > [!NOTE]
      > The enforced rules are added to the NSG(s) protecting the VM. (A VM could be protected by an NSG that is associated to its NIC, or the subnet in which the VM resides, or both)

## Modify a rule  <a name ="modify-rule"> </a>

You may want to modify the parameters of a rule that has been recommended. For example, you may want to change the recommended IP ranges.

Some important guidelines for modifying an adaptive network hardening rule:

- You cannot change **allow** rules to become **deny** rules. 

- You can modify the parameters of **allow** rules only. 

    Creating and modifying "deny" rules is done directly on the NSG. For more information, see [Create, change, or delete a network security group](../virtual-network/manage-network-security-group.md).

- A **Deny all traffic** rule is the only type of "deny" rule that would be listed here, and it cannot be modified. You can, however, delete it (see [Delete a rule](#delete-rule)). To learn about this type of rule, see the FAQ entry [When should I use a "Deny all traffic" rule?](#when-should-i-use-a-deny-all-traffic-rule).

To modify an adaptive network hardening rule:

1. To modify  some of the parameters of a rule, in the **Rules** tab, select on the three dots (...) at the end of the rule's row, and select **Edit**.

   ![Editing s rule.](./media/security-center-adaptive-network-hardening/edit-hard-rule.png)

1. In the **Edit rule** window, update the details that you want to change, and select **Save**.

   > [!NOTE]
   > After selecting **Save**, you have successfully changed the rule. *However, you have not applied it to the NSG.* To apply it, you must select the rule in the list, and select **Enforce** (as explained in the next step).

   ![Selecting Save.](./media/security-center-adaptive-network-hardening/edit-hard-rule3.png)

3. To apply the updated rule, from the list, select the updated rule and select **Enforce**.

    ![enforce rule.](./media/security-center-adaptive-network-hardening/enforce-hard-rule.png)

## Add a new rule <a name ="add-rule"> </a>

You can add an "allow" rule that was not recommended by Security Center.

> [!NOTE]
> Only "allow" rules can be added here. If you want to add "deny" rules, you can do so directly on the NSG. For more information, see [Create, change, or delete a network security group](../virtual-network/manage-network-security-group.md).

To add an adaptive network hardening rule:

1. From the top toolbar, select **Add rule**.

   ![add rule.](./media/security-center-adaptive-network-hardening/add-hard-rule.png)

1. In the **New rule** window, enter the details and select **Add**.

   > [!NOTE]
   > After selecting **Add**, you have successfully added the rule, and it is listed with the other recommended rules. However, you have not *applied* it on the NSG. To activate it, you must select the rule in the list, and select **Enforce** (as explained in the next step).

3. To apply the new rule, from the list, select the new rule and select **Enforce**.

    ![enforce rule.](./media/security-center-adaptive-network-hardening/enforce-hard-rule.png)


## Delete a rule <a name ="delete-rule"> </a>

When necessary, you can delete a recommended rule for the current session. For example, you may determine that applying a suggested rule could block legitimate traffic.

To delete an adaptive network hardening rule for your current session:

- In the **Rules** tab, select the three dots (...) at the end of the rule's row, and select **Delete**.  

    ![Deleting a rule.](./media/security-center-adaptive-network-hardening/delete-hard-rule.png)


## FAQ - Adaptive network hardening

- [Which ports are supported?](#which-ports-are-supported)
- [Are there any prerequisites or VM extensions required for adaptive network hardening?](#are-there-any-prerequisites-or-vm-extensions-required-for-adaptive-network-hardening)

### Which ports are supported?

Adaptive network hardening recommendations are only supported on the following specific ports (for both UDP and TCP): 

13, 17, 19, 22, 23, 53, 69, 81, 111, 119, 123, 135, 137, 138, 139, 161, 162, 389, 445, 512, 514, 593, 636, 873, 1433, 1434, 1900, 2049, 2301, 2323, 2381, 3268, 3306, 3389, 4333, 5353, 5432, 5555, 5800, 5900, 5900, 5985, 5986, 6379, 6379, 7000, 7001, 7199, 8081, 8089, 8545, 9042, 9160, 9300, 11211, 16379, 26379, 27017, 37215

### Are there any prerequisites or VM extensions required for adaptive network hardening?

Adaptive network hardening is an agentless feature of Azure Security Center - nothing needs to be installed on your machines to benefit from this network hardening tool.

### When should I use a "Deny all traffic" rule?

A **Deny all traffic** rule is recommended when, as a result of running the algorithm, Security Center does not identify traffic that should be allowed, based on the existing NSG configuration. Therefore, the recommended rule is to deny all traffic to the specified port. The name of this type of rule is displayed as "*System Generated*". After enforcing this rule, its actual name in the NSG will be a string comprised of the protocol, traffic direction, "DENY", and a random number.