---
title: Just in time virtual machine access in Azure Security Center | Microsoft Docs
description: This document demonstrates how just in time VM access in Azure Security Center helps you control access to your Azure virtual machines.
services: security-center
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid:
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/10/2018
ms.author: rkarlin

---
# Manage virtual machine access using just in time

Just in time virtual machine (VM) access can be used to lock down inbound traffic to your Azure VMs, reducing exposure to attacks while providing easy access to connect to VMs when needed.

> [!NOTE]
> The just in time feature is available on the Standard tier of Security Center.  See [Pricing](security-center-pricing.md) to learn more about Security Center's pricing tiers.
>
>

## Attack scenario

Brute force attacks commonly target management ports as a means to gain access to a VM. If successful, an attacker can take control over the VM and establish a foothold into your environment.

One way to reduce exposure to a brute force attack is to limit the amount of time that a port is open. Management ports do not need to be open at all times. They only need to be open while you are connected to the VM, for example to perform management or maintenance tasks. When just in time is enabled, Security Center uses [network security group](../virtual-network/security-overview.md#security-rules) (NSG) rules, which restrict access to management ports so they cannot be targeted by attackers.

![Just in time scenario][1]

## How does just in time access work?

When just in time is enabled, Security Center locks down inbound traffic to your Azure VMs by creating an NSG rule. You select the ports on the VM to which inbound traffic will be locked down. These ports are controlled by the just in time solution.

When a user requests access to a VM, Security Center checks that the user has [Role-Based Access Control (RBAC)](../role-based-access-control/role-assignments-portal.md) permissions that provide write access for the VM. If they have write permissions, the request is approved and Security Center automatically configures the Network Security Groups (NSGs) to allow inbound traffic to the selected ports for the amount of time you specified. After the time has expired, Security Center restores the NSGs to their previous states. Those connections that are already established are not being interrupted, however.

> [!NOTE]
> Security Center just in time VM access currently supports only VMs deployed through Azure Resource Manager. To learn more about the classic and Resource Manager deployment models see [Azure Resource Manager vs. classic deployment](../azure-resource-manager/resource-manager-deployment-model.md).
>
>

## Using just in time access

1. Open the **Security Center** dashboard.

2. In the left pane, select **Just in time VM access**.

![Just in time VM access tile][2]

The **Just in time VM access** window opens.

![Just in time VM access tile][10]

**Just in time VM access** provides information on the state of your VMs:

- **Configured** - VMs that have been configured to support just in time VM access. The data presented is for the last week and includes for each VM the number of approved requests, last access date and time, and last user.
- **Recommended** - VMs that can support just in time VM access but have not been configured to. We recommend that you enable just in time VM access control for these VMs. See [Configuring a just in time access policy](#configuring-a-just-in-time-access-policy).
- **No recommendation** - Reasons that can cause a VM not to be recommended are:
  - Missing NSG - The just in time solution requires an NSG to be in place.
  - Classic VM - Security Center just in time VM access currently supports only VMs deployed through Azure Resource Manager. A classic deployment is not supported by the just in time solution.
  - Other - A VM is in this category if the just in time solution is turned off in the security policy of the subscription or the resource group, or that the VM is missing a public IP and doesn't have an NSG in place.

## Configuring a just in time access policy

To select the VMs that you want to enable:

1. Under **Just in time VM access**, select the **Recommended** tab.

  ![Enable just in time access][3]

2. Under **VIRTUAL MACHINE**, select the VMs that you want to enable. This puts a checkmark next to a VM.
3. Select **Enable JIT on VMs**.
4. Select **Save**.

### Default ports

You can see the default ports that Security Center recommends enabling just in time.

1. Under **Just in time VM access**, select the **Recommended** tab.

  ![Display default ports][6]

2. Under **VMs**, select a VM. This puts a checkmark next to the VM and opens **JIT VM access configuration**. This blade displays the default ports.

### Add ports

Under **JIT VM access configuration**, you can also add and configure a new port on which you want to enable the just in time solution.

1. Under **JIT VM access configuration**, select **Add**. This opens **Add port configuration**.

  ![Port configuration][7]

2. Under **Add port configuration**, you identify the port, protocol type, allowed source IPs, and maximum request time.

  Allowed source IPs are the IP ranges allowed to get access upon an approved request.

  Maximum request time is the maximum time window that a specific port can be opened.

3. Select **OK**.

> [!NOTE]
>When JIT VM Access is enabled for a VM, Azure Security Center creates deny all inbound traffic rules for the selected ports in the network security groups associated with it. The rules will either be the top priority of your Network Security Groups, or lower priority than existing rules that are already there. This depends on an analysis performed by Azure Security Center that determines whether a rule is secure or not.
>


## Set just-in-time within a VM

To make it easy to roll out just-in-time access across your VMs, you can set a VM to allow only just-in-time access directly from within the VM.

1. In the Azure portal, select **Virtual machines**.
2. Click on the virtual machine you want to limit to just-in-time access.
3. In the menu, click **Configuration**.
4. Under **Just-in-time-access** click **Enable just-in-time policy**. 

This enables just-in-time access for the VM using the following settings:

- Windows servers:
    - RDP port 3389
    - 3 hours of access
    - Allowed source IP addresses is set to Per request
- Linux servers:
    - SSH port 22
    - 3 hours of access
    - Allowed source IP addresses is set to Per request
     
If a VM already has just-in-time enabled, when you go to its configuration page you will be able to see that just-in-time is enabled and you can use the link to open the policy in Azure Security Center to view and change the settings.

![jit config in vm](./media/security-center-just-in-time/jit-vm-config.png)


## Requesting access to a VM

To request access to a VM:

1. Under **Just in time VM access**, select the **Configured** tab.
2. Under **VMs**, select the VMs that you want to enable access. This puts a checkmark next to a VM.
3. Select **Request access**. This opens **Request access**.

  ![Request access to a VM][4]

4. Under **Request access**, you configure for each VM the ports to open along with the source IP that the port is opened to and the time window for which the port is opened. You can request access only to the ports that are configured in the just in time policy. Each port has a maximum allowed time derived from the just in time policy.
5. Select **Open ports**.

> [!NOTE]
> When a user requests access to a VM, Security Center checks that the user has [Role-Based Access Control (RBAC)](../role-based-access-control/role-assignments-portal.md) permissions that provide write access for the VM. If they have write permissions, the request is approved.
>
>

> [!NOTE]
> If a user who is requesting access is behind a proxy, the “My IP” option may not work. There may be a need to define the full range of the organization.
>
>

## Editing a just in time access policy

You can change a VM's existing just in time policy by adding and configuring a new port to open for that VM, or by changing any other parameter related to an already protected port.

In order to edit an existing just in time policy of a VM, the **Configured** tab is used:

1. Under **VMs**, select a VM to add a port to by clicking on the three dots within the row for that VM. This opens a menu.
2. Select **Edit** in the menu. This opens **JIT VM access configuration**.

  ![Edit policy][8]

3. Under **JIT VM access configuration**, you can either edit the existing settings of an already protected port by clicking on its port, or you can select **Add**. This opens **Add port configuration**.

  ![Add a port][7]

4. Under **Add port configuration**, identify the port, protocol type, allowed source IPs, and maximum request time.
5. Select **OK**.
6. Select **Save**.

## Auditing just in time access activity

You can gain insights into VM activities using log search. To view logs:

1. Under **Just in time VM access**, select the **Configured** tab.
2. Under **VMs**, select a VM to view information about by clicking on the three dots within the row for that VM. This opens a menu.
3. Select **Activity Log** in the menu. This opens **Activity log**.

  ![Select activity log][9]

  **Activity log** provides a filtered view of previous operations for that VM along with time, date, and subscription.

You can download the log information by selecting **Click here to download all the items as CSV**.

Modify the filters and select **Apply** to create a search and log.

## Using just in time VM access via REST APIs

The just in time VM access feature can be used via the Azure Security Center API. You can get information about configured VMs, add new ones, request access to a VM, and more, via this API. See [Jit Network Access Policies](https://docs.microsoft.com/rest/api/securitycenter/jitnetworkaccesspolicies), to learn more about the just in time REST API.

## Using just in time VM access via PowerShell 

To use the just in time VM access solution via PowerShell, use the official Azure Security Center PowerShell cmdlets, and specifically `Set-AzureRmJitNetworkAccessPolicy`.

The following example sets a just in time VM access policy on a specific VM, and sets the following:
1.	Close ports 22 and 3389.
2.	Set a maximum time window of 3 hours for each so they can be opened per approved request.
3.	Allows the user who is requesting access to control the source IP addresses and allows the user to establish a successful session upon an approved just in time access request.

Run the following in PowerShell to accomplish this:

1.	Assign a variable that holds the just in time VM access policy for a VM:

        $JitPolicy = (@{
         id="/subscriptions/SUBSCRIPTIONID/resourceGroups/RESOURCEGROUP/providers/Microsoft.Compute/virtualMachines/VMNAME"
        ports=(@{
             number=22;
             protocol="*";
             allowedSourceAddressPrefix=@("*");
             maxRequestAccessDuration="PT3H"},
             @{
             number=3389;
             protocol="*";
             allowedSourceAddressPrefix=@("*");
             maxRequestAccessDuration="PT3H"})})

2.	Insert the VM just in time VM access policy to an array:
	
        $JitPolicyArr=@($JitPolicy)

3.	Configure the just in time VM access policy on the selected VM:
	
        Set-AzureRmJitNetworkAccessPolicy -Kind "Basic" -Location "LOCATION" -Name "default" -ResourceGroupName "RESOURCEGROUP" -VirtualMachine $JitPolicyArr 

### Requesting access to a VM

In the following example, you can see a just in time VM access request to a specific VM in which port 22 is requested to be opened for a specific IP address and for a specific amount of time:

Run the following in PowerShell:
1.	Configure the VM request access properties

        $JitPolicyVm1 = (@{
          id="/SUBSCRIPTIONID/resourceGroups/RESOURCEGROUP/providers/Microsoft.Compute/virtualMachines/VMNAME"
        ports=(@{
           number=22;
           endTimeUtc="2018-09-17T17:00:00.3658798Z";
           allowedSourceAddressPrefix=@("IPV4ADDRESS")})})
2.	Insert the VM access request parameters in an array:

        $JitPolicyArr=@($JitPolicyVm1)
3.	Send the request access (use the resource ID you got in step 1)

        Start-AzureRmJitNetworkAccessPolicy -ResourceId "/subscriptions/SUBSCRIPTIONID/resourceGroups/RESOURCEGROUP/providers/Microsoft.Security/locations/LOCATION/jitNetworkAccessPolicies/default" -VirtualMachine $JitPolicyArr

For more information, see the PowerShell cmdlet documentation.


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
[10]: ./media/security-center-just-in-time/just-in-time-access.png
[3]: ./media/security-center-just-in-time/enable-just-in-time-access.png
[4]: ./media/security-center-just-in-time/request-access-to-a-vm.png
[5]: ./media/security-center-just-in-time/activity-log.png
[6]: ./media/security-center-just-in-time/default-ports.png
[7]: ./media/security-center-just-in-time/add-a-port.png
[8]: ./media/security-center-just-in-time/edit-policy.png
[9]: ./media/security-center-just-in-time/select-activity-log.png
