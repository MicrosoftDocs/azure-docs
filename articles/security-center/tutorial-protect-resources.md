---
title: Azure Security Center Tutorial - Protect your resources with Azure Security Center | Microsoft Docs
description: This tutorial shows you how to configure a just in time VM access policy and an application control policy.
services: security-center
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security-center
ms.devlang: na
ms.topic: tutorial
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/30/2018
ms.author: rkarlin

---
# Tutorial: Protect your resources with Azure Security Center
Security Center limits your exposure to threats by using access and application controls to block malicious activity. Just in time virtual machine (VM) access reduces your exposure to attacks by enabling you to deny persistent access to VMs. Instead, you provide controlled and audited access to VMs only when needed. Adaptive application controls help harden VMs against malware by controlling which applications can run on your VMs. Security Center uses machine learning to analyze the processes running in the VM and helps you apply whitelisting rules using this intelligence.

In this tutorial you learn how to:

> [!div class="checklist"]
> * Configure a just in time VM access policy
> * Configure an application control policy

If you don’t have an Azure subscription, create a  [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites
To step through the features covered in this tutorial, you must be on Security Center’s Standard pricing tier. You can try Security Center Standard at no cost for the first 60 days. The quickstart [Onboard your Azure subscription to Security Center Standard](security-center-get-started.md) walks you through how to upgrade to Standard.

## Manage VM access
Just in time VM access can be used to lock down inbound traffic to your Azure VMs, reducing exposure to attacks while providing easy access to connect to VMs when needed.

Management ports do not need to be open at all times. They only need to be open while you are connected to the VM, for example to perform management or maintenance tasks. When just in time is enabled, Security Center uses Network Security Group (NSG) rules, which restrict access to management ports so they cannot be targeted by attackers.

1. In the Security Center main menu, select **Just in time VM access** under **ADVANCED CLOUD DEFENSE**.

  ![Just in time VM access][1]

  **Just in time VM access** provides information on the state of your VMs:

  - **Configured** - VMs that have been configured to support just in time VM access.
  - **Recommended** - VMs that can support just in time VM access but have not been configured to.
  - **No recommendation** - Reasons that can cause a VM not to be recommended are:

    - Missing NSG - The just in time solution requires an NSG to be in place.
    - Classic VM - Security Center just in time VM access currently supports only VMs deployed through Azure Resource Manager.
    - Other - A VM is in this category if the just in time solution is turned off in the security policy of the subscription or the resource group, or that the VM is missing a public IP and doesn't have an NSG in place.

2. Select a recommended VM and click **Enable JIT on 1 VM** to configure a just in time policy for that VM:

  You can save the default ports that Security Center recommends or you can add and configure a new port on which you want to enable the just in time solution. In this tutorial, let’s add a port by selecting **Add**.

  ![Add port configuration][2]

3. Under **Add port configuration**, you identify:

  - The port
  - The protocol type
  - Allowed source IPs - IP ranges allowed to get access upon an approved request
  - Maximum request time - maximum time window that a specific port can be opened

4. Select **OK** to save.

## Harden VMs against malware
Adaptive application controls help you define a set of applications that are allowed to run on configured resource groups, which among other benefits helps harden your VMs against malware. Security Center uses machine learning to analyze the processes running in the VM and helps you apply whitelisting rules using this intelligence.

This feature is only available for Windows machines.

1. Return to the Security Center main menu. Under **ADVANCED CLOUD DEFENSE**, select **Adaptive application controls**.

   ![Adaptive application controls][3]

  The **Resource groups** section contains three tabs:

  - **Configured**: List of resource groups containing the VMs that were configured with application control.
  - **Recommended**: List of resource groups for which application control is recommended.
  - **No recommendation**: List of resource groups containing VMs without any application control recommendations. For example, VMs on which applications are always changing, and haven’t reached a steady state.

2. Select the **Recommended** tab for a list of resource groups with application control recommendations.

  ![Application control recommendations][4]

3. Select a resource group to open the **Create application control rules** option. In the **Select VMs**, review the list of recommended VMs and uncheck any you do not want to apply application control to. In the **Select processes for whitelisting rules**, review the list of recommended applications, and uncheck any you do not want to apply. The list includes:

  - **NAME**: The full application path
  - **PROCESSES**: How many applications reside within every path
  - **COMMON**: "Yes" indicates that these processes have been executed on most VMs in this resource group
  - **EXPLOITABLE**: A warning icon indicates if the applications could be used by an attacker to bypass application whitelisting. It is recommended to review these applications prior to their approval.

4. Once you finish your selections, select **Create**.

## Clean up resources
Other quickstarts and tutorials in this collection build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, continue running the Standard tier and keep automatic provisioning enabled. If you do not plan to continue or wish to return to the Free tier:

1. Return to the Security Center main menu and select **Security Policy**.
2. Select the subscription or policy that you want to return to Free. **Security policy** opens.
3. Under **POLICY COMPONENTS**, select **Pricing tier**.
4. Select **Free** to change subscription from Standard tier to Free tier.
5. Select **Save**.

If you wish to disable automatic provisioning:

1. Return to the Security Center main menu and select **Security policy**.
2. Select the subscription that you wish to disable automatic provisioning.
3. Under **Security policy – Data Collection**, select **Off** under **Onboarding** to disable automatic provisioning.
4. Select **Save**.

>[!NOTE]
> Disabling automatic provisioning does not remove the Microsoft Monitoring Agent from Azure VMs where the agent has been provisioned. Disabling automatic provisioning limits security monitoring for your resources.
>

## Next steps
In this tutorial, you learned how to limit your exposure to threats by:

> [!div class="checklist"]
> * Configuring a just in time VM access policy to provide controlled and audited access to VMs only when needed
> * Configuring an adaptive application controls policy to control which applications can run on your VMs

Advance to the next tutorial to learn about responding to security incidents.

> [!div class="nextstepaction"]
> [Tutorial: Respond to security incidents](tutorial-security-incident.md)

<!--Image references-->
[1]: ./media/tutorial-protect-resources/just-in-time-vm-access.png
[2]: ./media/tutorial-protect-resources/add-port.png
[3]: ./media/tutorial-protect-resources/adaptive-application-control-options.png
[4]: ./media/tutorial-protect-resources/recommended-resource-groups.png
