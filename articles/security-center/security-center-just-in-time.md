---
title: Just-in-time virtual machine access in Azure Security Center | Microsoft Docs
description: This document demonstrates how just-in-time VM access in Azure Security Center helps you control access to your Azure virtual machines.
services: security-center
documentationcenter: na
author: monhaber
manager: barbkess
editor: ''

ms.assetid: 671930b1-fc84-4ae2-bf7c-d34ea37ec5c7
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 6/17/2019
ms.author: v-mohabe

---
# Manage virtual machine access using just-in-time

Just-in-time  (JIT) virtual machine (VM) access can be used to lock down inbound traffic to your Azure VMs, reducing exposure to attacks while providing easy access to connect to VMs when needed.

> [!NOTE]
> The just-in-time feature is available on the Standard tier of Security Center.  See [Pricing](security-center-pricing.md) to learn more about Security Center's pricing tiers.


> [!NOTE]
> Security Center just-in-time VM access currently supports only VMs deployed through Azure Resource Manager. To learn more about the classic and Resource Manager deployment models see [Azure Resource Manager vs. classic deployment](../azure-resource-manager/resource-manager-deployment-model.md).

## Attack scenario

Brute force attacks commonly target management ports as a means to gain access to a VM. If successful, an attacker can take control over the VM and establish a foothold into your environment.

One way to reduce exposure to a brute force attack is to limit the amount of time that a port is open. Management ports do not need to be open at all times. They only need to be open while you are connected to the VM, for example to perform management or maintenance tasks. When just-in-time is enabled, Security Center uses [network security group](../virtual-network/security-overview.md#security-rules) (NSG) and Azure Firewall rules, which restrict access to management ports so they cannot be targeted by attackers.

![Just-in-time scenario](./media/security-center-just-in-time/just-in-time-scenario.png)

## How does JIT access work?

When just-in-time is enabled, Security Center locks down inbound traffic to your Azure VMs by creating an NSG rule. You select the ports on the VM to which inbound traffic will be locked down. These ports are controlled by the just-in-time solution.

When a user requests access to a VM, Security Center checks that the user has [Role-Based Access Control (RBAC)](../role-based-access-control/role-assignments-portal.md) permissions that permit them to successfully request access to a VM. If the request is approved, Security Center automatically configures the Network Security Groups (NSGs) and Azure Firewall to allow inbound traffic to the selected ports and requested source IP addresses or ranges, for the amount of time that was specified. After the time has expired, Security Center restores the NSGs to their previous states. Those connections that are already established are not being interrupted, however.

 > [!NOTE]
 > If a JIT access request is approved for a VM behind an Azure Firewall, then Security Center automatically changes both the NSG and firewall policy rules. For the amount of time that was specified, the rules allow inbound traffic to the selected ports and requested source IP addresses or ranges. After the time is over, Security Center restores the firewall and NSG rules to their previous states.


## Permissions needed to configure and use JIT

| To enable a user to: | Permissions to set|
| --- | --- |
| Configure or edit a JIT policy for a VM | *Assign these actions to the role:*  On the scope of a subscription or Resource Group that is associated with the VM: ```Microsoft.Security/locations/jitNetworkAccessPolicies/write``` On the scope of a subscription or Resource Group or VM: ```Microsoft.Compute/virtualMachines/write``` | 
| ||
|Request JIT access to a VM | *Assign these actions to the user:*  On the scope of a subscription or Resource Group that is associated with the VM:  ```Microsoft.Security/locations/{the_location_of_the_VM}/jitNetworkAccessPolicies/initiate/action``` On the scope of a Subscription or Resource Group or VM: ```Microsoft.Compute/virtualMachines/read``` |


## Configure JIT on a VM

There are 3 ways to configure a JIT policy on a VM:

- [Configure JIT access in Azure Security Center](#jit-asc)
- [Configure JIT access in an Azure VM blade](#jit-vm)
- [Configure a JIT policy on a VM programmatically](#jit-program)

## Configure JIT in ASC

From ASC, you can configure a JIT policy and request access to a VM using a JIT policy


### Configure JIT access on a VM in  ASC <a name="jit-asc"></a>

1. Open the **Security Center** dashboard.

2. In the left pane, select  **Just-in-time VM access**.

    ![Just-in-time VM access tile](./media/security-center-just-in-time/just-in-time.png)

    The **Just-in-time VM access** window opens.

      ![Enable just-in-time access](./media/security-center-just-in-time/enable-just-in-time.png)

    **Just-in-time VM access** provides information on the state of your VMs:

    - **Configured** - VMs that have been configured to support just-in-time VM access. The data presented is for the last week and includes for each VM the number of approved requests, last access date and time, and last user.
    - **Recommended** - VMs that can support just-in-time VM access but have not been configured to. We recommend that you enable just-in-time VM access control for these VMs. 
    - **No recommendation** - Reasons that can cause a VM not to be recommended are:
      - Missing NSG - The just-in-time solution requires an NSG to be in place.
      - Classic VM - Security Center just-in-time VM access currently supports only VMs deployed through Azure Resource Manager. A classic deployment is not supported by the just-in-time solution. 
      - Other - A VM is in this category if the just-in-time solution is turned off in the security policy of the subscription or the resource group, or if the VM is missing a public IP and doesn't have an NSG in place.

3. Select the **Recommended** tab.

4. Under **VIRTUAL MACHINE**, click the VMs that you want to enable. This puts a checkmark next to a VM.

5. Click **Enable JIT on VMs**.
   -. This blade displays the default ports recommended by Azure Security Center:
      - 22 - SSH
      - 3389 - RDP
      - 5985 - WinRM 
      - 5986 - WinRM
6. You can also configure custom ports:

      1. Click **Add**. The **Add port configuration** window opens.
      2. For each port you choose to configure, both default and custom, you can customize the following settings:

    - **Protocol type**- The protocol that is allowed on this port when a request is approved.
    - **Allowed source IP addresses**- The IP ranges that are allowed on this port when a request is approved.
    - **Maximum request time**- The maximum time window during which a specific port can be opened.

     3. Click **OK**.

1. Click **Save**.

> [!NOTE]
>When JIT VM Access is enabled for a VM, Azure Security Center creates "deny all inbound traffic" rules for the selected ports in the network security groups associated and Azure Firewall with it. If other rules had been created for the selected ports, then the existing rules take priority over the new “deny all inbound traffic”  rules. If there are no existing rules on the selected ports, then the new “deny all inbound traffic” rules take top priority in the Network Security Groups and Azure Firewall.


## Request JIT access via ASC

To request access to a VM via ASC:

1. Under **Just in time VM access**, select the **Configured** tab.

2. Under **Virtual Machine**, click the VMs that you want to request access for. This puts a checkmark next to the VM.


    - The icon in the **Connection Details** column indicates whether JIT is enabled on the NSG or FW. If it’s enabled on both, only the Firewall icon appears.

    - The **Connection Details** column provides the correct information required to connect the VM, as well as indicates the opened ports.

      ![Request just-in-time access](./media/security-center-just-in-time/request-just-in-time-access.png)

3. Click **Request access**. The **Request access** window opens.

      ![JIT details](./media/security-center-just-in-time/just-in-time-details.png)

4. Under **Request access**, for each VM, configure the ports that you want to open and the source IP addresses that the port is opened on and the time window for which the port will be open. It will only be possible to  request access to the ports that are configured in the just-in-time policy. Each port has a maximum allowed time derived from the just-in-time policy.

5. Click **Open ports**.

> [!NOTE]
> If a user who is requesting access is behind a proxy, the option **My IP** may not work. You may need to define the full IP address range of the organization.

## Edit a JIT access policy via ASC

You can change a VM's existing just-in-time policy by adding and configuring a new port to protect for that VM, or by changing any other setting related to an already protected port.

To edit an existing just-in-time policy of a VM:
1. In the **Configured** tab, under **VMs**, select a VM to which to add a port by clicking on the three dots within the row for that VM. 

1. Select **Edit**.
1. Under **JIT VM access configuration**, you can either edit the existing settings of an already protected port or add a new custom port. 
  ![jit vm access](./media/security-center-just-in-time/edit-policy.png)

## Audit JIT access activity in ASC

You can gain insights into VM activities using log search. To view logs:

1. Under **Just-in-time VM access**, select the **Configured** tab.
2. Under **VMs**, select a VM to view information about by clicking on the three dots within the row for that VM and select **Activity Log** in the menu. The **Activity log** opens.

   ![Select activity log](./media/security-center-just-in-time/select-activity-log.png)

   **Activity log** provides a filtered view of previous operations for that VM along with time, date, and subscription.

You can download the log information by selecting **Click here to download all the items as CSV**.

Modify the filters and click **Apply** to create a search and log.



## Configure JIT access in an Azure VM blade <a name="jit-vm"></a>

For your convenience, you can connect to a VM using JIT directly from within the VM blade in Azure.

### Configure JIT access on a VM via the Azure VM blade

To make it easy to roll out just-in-time access across your VMs, you can set a VM to allow only just-in-time access directly from within the VM.

1. In the Azure portal, select **Virtual machines**.
2. Click on the virtual machine you want to limit to just-in-time access.
3. In the menu, click **Configuration**.
4. Under **Just-in-time-access** click **Enable just-in-time policy**. 

This enables just-in-time access for the VM using the following settings:

- Windows servers:
    - RDP port 3389
    - 3 hours of maximum allowed access
    - Allowed source IP addresses is set to Any
- Linux servers:
    - SSH port 22
    - 3 hours of maximum allowed access
    - Allowed source IP addresses is set to Any
     
If a VM already has just-in-time enabled, when you go to its configuration page you will be able to see that just-in-time is enabled and you can use the link to open the policy in Azure Security Center to view and change the settings.

![jit config in vm](./media/security-center-just-in-time/jit-vm-config.png)

### Request JIT access to a VM via the Azure VM blade

In the Azure portal, when you try to connect to a VM, Azure checks to see if you have a just-in-time access policy configured on that VM.

- If you do have a JIT policy configured on the VM, you can click **Request access** to enable you to have access in accordance with the JIT policy set for the VM. 

  >![jit request](./media/security-center-just-in-time/jit-request.png)

  The access is requested with the following default parameters:

  - **source IP**: ‘Any’ (*) (cannot be changed)
  - **time range**: 3 hours (cannot be changed)  <!--Isn't this set in the policy-->
  - **port number** RDP port 3389 for Windows / port 22 for Linux (can be changed)

    > [!NOTE]
    > After a request is approved for a VM protected by Azure Firewall, Security Center provides the user with the proper connection details (the port mapping from the DNAT table) to use to connect to the VM.

- If you do not have JIT configured on a VM, you will be prompted to configure a JIT policy it.

  ![jit prompt](./media/security-center-just-in-time/jit-prompt.png)

## Configure a JIT policy on a VM programmatically  <a name="jit-program"></a>

You can set up and use just-in-time via REST APIs and via PowerShell.

## JIT VM access via REST APIs

The just-in-time VM access feature can be used via the Azure Security Center API. You can get information about configured VMs, add new ones, request access to a VM, and more, via this API. See [Jit Network Access Policies](https://docs.microsoft.com/rest/api/securitycenter/jitnetworkaccesspolicies), to learn more about the just-in-time REST API.

## JIT VM access via PowerShell

To use the just-in-time VM access solution via PowerShell, use the official Azure Security Center PowerShell cmdlets, and specifically `Set-AzJitNetworkAccessPolicy`.

The following example sets a just-in-time VM access policy on a specific VM, and sets the following:

1.	Close ports 22 and 3389.

2.	Set a maximum time window of 3 hours for each so they can be opened per approved request.
3.	Allows the user who is requesting access to control the source IP addresses and allows the user to establish a successful session upon an approved just-in-time access request.

Run the following in PowerShell to accomplish this:

1.	Assign a variable that holds the just-in-time VM access policy for a VM:

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

2.	Insert the VM just-in-time VM access policy to an array:
	
        $JitPolicyArr=@($JitPolicy)

3.	Configure the just-in-time VM access policy on the selected VM:
	
        Set-AzJitNetworkAccessPolicy -Kind "Basic" -Location "LOCATION" -Name "default" -ResourceGroupName "RESOURCEGROUP" -VirtualMachine $JitPolicyArr 

#### Request access to a VM via PowerShell

In the following example, you can see a just-in-time VM access request to a specific VM in which port 22 is requested to be opened for a specific IP address and for a specific amount of time:

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

        Start-AzJitNetworkAccessPolicy -ResourceId "/subscriptions/SUBSCRIPTIONID/resourceGroups/RESOURCEGROUP/providers/Microsoft.Security/locations/LOCATION/jitNetworkAccessPolicies/default" -VirtualMachine $JitPolicyArr

For more information, see the PowerShell cmdlet documentation.

## Next steps
In this article, you learned how just-in-time VM access in Security Center helps you control access to your Azure virtual machines.

To learn more about Security Center, see the following:

- [Setting security policies](tutorial-security-policy.md) — Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing security recommendations](security-center-recommendations.md) — Learn how recommendations help you protect your Azure resources.
- [Security health monitoring](security-center-monitoring.md) — Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts](security-center-managing-and-responding-alerts.md) — Learn how to manage and respond to security alerts.
- [Monitoring partner solutions](security-center-partner-solutions.md) — Learn how to monitor the health status of your partner solutions.
- [Security Center FAQ](security-center-faq.md) — Find frequently asked questions about using the service.
- [Azure Security blog](https://blogs.msdn.microsoft.com/azuresecurity/) — Find blog posts about Azure security and compliance.

