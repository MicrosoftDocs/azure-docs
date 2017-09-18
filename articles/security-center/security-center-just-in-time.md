---
title: Just in time virtual machine access in Azure Security Center | Microsoft Docs
description: This document walks you through how just in time VM access in Azure Security Center helps you control access to your Azure virtual machines.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid:
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/08/2017
ms.author: terrylan

---
# Manage virtual machine access using just in time

Just in time virtual machine (VM) access can be used to lock down inbound traffic to your Azure VMs, reducing exposure to attacks while providing easy access to connect to VMs when needed.

> [!NOTE]
> The just in time feature is in preview and available on the Standard tier of Security Center.  See [Pricing](security-center-pricing.md) to learn more about Security Center's pricing tiers.
>
>

## Attack scenario

Brute force attacks commonly target management ports as a means to gain access to a VM. If successful, an attacker can take control over the VM and establish a foothold into your environment.

One way to reduce exposure to a brute force attack is to limit the amount of time that a port is open. Management ports do not need to be open at all times. They only need to be open while you are connected to the VM, for example to perform management or maintenance tasks. When just in time is enabled, Security Center uses [Network Security Group](../virtual-network/virtual-networks-nsg.md) (NSG) rules, which restrict access to management ports so they cannot be targeted by attackers.

![Just in time scenario][1]

## How does just in time access work?

When just in time is enabled, Security Center locks down inbound traffic to your Azure VMs by creating an NSG rule. You select the ports on the VM to which inbound traffic will be locked down. These ports are controlled by the just in time solution.

When a user requests access to a VM, Security Center checks that the user has [Role-Based Access Control (RBAC)](../active-directory/role-based-access-control-configure.md) permissions that provide write access for the Azure resource. If they have write permissions, the request is approved and Security Center automatically configures the Network Security Groups (NSGs) to allow inbound traffic to the management ports for the amount of time you specified. After the time has expired, Security Center restores the NSGs to their previous states.

> [!NOTE]
> Security Center just in time VM access currently supports only VMs deployed through Azure Resource Manager. To learn more about the classic and Resource Manager deployment models see [Azure Resource Manager vs. classic deployment](../azure-resource-manager/resource-manager-deployment-model.md).
>
>

## Using just in time access

The **Just in time VM access** tile on the **Security Center** blade shows the number of VMs configured for just in time access and the number of approved access requests made in the last week.

Select the **Just in time VM access** tile and the **Just in time VM access** blade opens.

![Just in time VM access tile][2]

The **Just in time VM access** blade provides information on the state of your VMs:

- **Configured** - VMs that have been configured to support just in time VM access. The data presented is for the last week and includes for each VM the number of approved requests, last access date and time, and last user.
- **Recommended** - VMs that can support just in time VM access but have not been configured to. We recommend that you enable just in time VM access control for these VMs. See [Enable just in time VM access](#enable-just-in-time-vm-access).
- **No recommendation** - Reasons that can cause a VM not to be recommended are:
  - Missing NSG - The just in time solution requires an NSG to be in place.
  - Classic VM - Security Center just in time VM access currently supports only VMs deployed through Azure Resource Manager. A classic deployment is not supported by the just in time solution.
  - Other - A VM is in this category if the just in time solution is turned off in the security policy of the subscription or the resource group, or that the VM is missing a public IP and doesn't have an NSG in place.

## Configuring a just in time access policy

To select the VMs that you want to enable:

1. On the **Just in time VM access** blade, select the **Recommended** tab.

  ![Enable just in time access][3]

2. Under **VMs**, select the VMs that you want to enable. This puts a checkmark next to a VM.
3. Select **Enable JIT on VMs**.
4. Select **Save**.

### Default ports

You can see the default ports that Security Center recommends enabling just in time.

1. On the **Just in time VM access** blade, select the **Recommended** tab.

  ![Display default ports][6]

2. Under **VMs**, select a VM. This puts a checkmark next to the VM and opens the **JIT VM access configuration** blade. This blade displays the default ports.

### Add ports

From the **JIT VM access configuration** blade, you can also add and configure a new port on which you want to enable the just in time solution.

1. On the **JIT VM access configuration** blade, select **Add**. This opens the **Add port configuration** blade.

  ![Port configuration][7]

2. On **Add port configuration** blade, you identify the port, protocol type, allowed source IPs, and maximum request time.

  Allowed source IPs are the IP ranges allowed to get access upon an approved request.

  Maximum request time is the maximum time window that a specific port can be opened.

3. Select **OK**.

## Requesting access to a VM

To request access to a VM:

1. On the **Just in time VM access** blade, select the **Configured** tab.
2. Under **VMs**, select the VMs that you want to enable access. This puts a checkmark next to a VM.
3. Select **Request access**. This opens the **Request access** blade.

  ![Request access to a VM][4]

4. On the **Request access** blade, you configure for each VM the ports to open along with the source IP that the port is opened to and the time window for which the port is opened. You can request access only to the ports that are configured in the just in time policy. Each port has a maximum allowed time derived from the just in time policy.
5. Select **Open ports**.

## Editing a just in time access policy

You can change a VM's existing just in time policy by adding and configuring a new port to open for that VM, or by changing any other parameter related to an already protected port.

In order to edit an existing just in time policy of a VM, the **Configured** tab is used:

1. Under **VMs**, select a VM to add a port to by clicking on the three dots within the row for that VM. This opens a menu.
2. Select **Edit** in the menu. This opens the **JIT VM access configuration** blade.

  ![Edit policy][8]

3. On the **JIT VM access configuration** blade, you can either edit the existing settings of an already protected port by clicking on its port, or you can select **Add**. This opens the **Add port configuration** blade.

  ![Add a port][7]

4. On **Add port configuration** blade identify the port, protocol type, allowed source IPs, and maximum request time.
5. Select **OK**.
6. Select **Save**.

## Auditing just in time access activity

You can gain insights into VM activities using log search. To view logs:

1. On the **Just in time VM access** blade, select the **Configured** tab.
2. Under **VMs**, select a VM to view information about by clicking on the three dots within the row for that VM. This opens a menu.
3. Select **Activity Log** in the menu. This opens the **Activity log** blade.

![Select activity log][9]

The **Activity log** blade provides a filtered view of previous operations for that VM along with time, date, and subscription.

![View activity log][5]

You can download the log information by selecting **Click here to download all the items as CSV**.

Modify the filters and select **Apply** to create a search and log.

## Using just in time VM access via PowerShell

In order to use the just in time solution via PowerShell, make sure you have the [latest](/powershell/azure/install-azurerm-ps) Azure PowerShell version.
Once you do, you need to install the [latest](https://www.powershellgallery.com/packages/Azure-Security-Center/0.0.12) Azure Security Center from the PowerShell gallery.

### Configuring a just in time policy for a VM

To configure a just in time policy on a specific VM, you need to run this command in your PowerShell session: Set-ASCJITAccessPolicy.
Follow the cmdlet documentation to learn more.

### Requesting access to a VM

To access a specific VM that is protected with the just in time solution, you need to run this command in your PowerShell session: Invoke-ASCJITAccess.
Follow the cmdlet documentation to learn more.

## Next steps
In this article, you learned how just in time VM access in Security Center helps you control access to your Azure virtual machines.

To learn more about Security Center, see the following:

- [Setting security policies](security-center-policies.md) — Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing security recommendations](security-center-recommendations.md) — Learn how recommendations help you protect your Azure resources.
- [Security health monitoring](security-center-monitoring.md) — Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts](security-center-managing-and-responding-alerts.md) — Learn how to manage and respond to security alerts.
- [Monitoring partner solutions](security-center-partner-solutions.md) — Learn how to monitor the health status of your partner solutions.
- [Security Center FAQ](security-center-faq.md) — Find frequently asked questions about using the service.
- [Azure Security blog](https://blogs.msdn.microsoft.com/azuresecurity/) — Find blog posts about Azure security and compliance.


<!--Image references-->
[1]: ./media/security-center-just-in-time/just-in-time-scenario.png
[2]: ./media/security-center-just-in-time/just-in-time.png
[3]: ./media/security-center-just-in-time/enable-just-in-time-access.png
[4]: ./media/security-center-just-in-time/request-access-to-a-vm.png
[5]: ./media/security-center-just-in-time/activity-log.png
[6]: ./media/security-center-just-in-time/default-ports.png
[7]: ./media/security-center-just-in-time/add-a-port.png
[8]: ./media/security-center-just-in-time/edit-policy.png
[9]: ./media/security-center-just-in-time/select-activity-log.png
