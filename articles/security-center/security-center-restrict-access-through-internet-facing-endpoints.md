<properties
   pageTitle="Restrict access through Internet-facing endpoints in Azure Security Center  | Microsoft Azure"
   description="This document shows you how to implement the Azure Security Center recommendation **Restrict access through Internet facing endpoint**."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="MBaldwin"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/20/2016"
   ms.author="terrylan"/>

# Restrict access through Internet-facing endpoints in Azure Security Center

Azure Security Center will recommend that you restrict access through Internet-facing endpoints if any of your Network Security Groups (NSGs) has one or more inbound rules that allow access from “any” source IP address. Opening access to “any” may enable attackers to access your resources. Security Center will recommend that you edit these inbound rules to restrict access to source IP addresses that actually need access.

> [AZURE.NOTE] This document introduces the service by using an example deployment. This is not a step-by-step guide.

## Implement the recommendation

1. In the **Recommendations blade**, select **Restrict access through Internet facing endpoint**.
![Restrict access through Internet facing endpoint][1]

2. This opens the blade **Restrict access through Internet facing endpoint**. This blade lists the virtual machines (VMs) with inbound rules that create a potential security issue. Select a VM.
![Select a VM][2]

3. The **NSG** blade displays Network Security Group information, related inbound rules, and the associated VM. Select **Edit inbound rules** to proceed with editing an inbound rule.
![Network Security Group blade][3]

4. On the **Inbound security rules** blade select the inbound rule to edit. In this example, let’s select **AllowWeb**.
![Inbound security rules][4]

  Note, you can also select **Default rules** to see the set of default rules contained by all NSGs. The default rules cannot be deleted but, because they are assigned a lower priority, they can be overridden by the rules that you create. Learn more about [default rules](../virtual-network/ virtual-networks-nsg.md#default-rules).
![Default rules][5]

5. On the **AllowWeb** blade, edit the properties of the inbound rule so that the **Source** is an IP address or block of IP addresses. To learn more about the properties of the inbound rule, see [NSG rules](../virtual-network/virtual-networks-nsg.md#nsg-rules).

  ![Edit inbound rule][6]

## See also

This article showed you how to implement the Security Center recommendation "Restrict access through Internet facing endpoint.” To learn more about enabling NSGs and rules, see the following:

- [What is a Network Security Group (NSG)?](../virtual-network/virtual-networks-nsg.md)
- [How to manage NSGs using the Azure portal](../virtual-network/virtual-networks-create-nsg-arm-pportal.md)

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md)--Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md)--Learn how recommendations help you protect your Azure resources.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md)--Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md)--Learn how to manage and respond to security alerts.
- [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
- [Azure Security Center FAQ](security-center-faq.md)--Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/)--Get the latest Azure security news and information.

<!--Image references-->
[1]: ./media/security-center-restrict-access-thru-internet-facing-endpoint/restrict-access-thru-internet-facing-endpoint.png
[2]: ./media/security-center-restrict-access-thru-internet-facing-endpoint/select-a-vm.png
[3]: ./media/security-center-restrict-access-thru-internet-facing-endpoint/network-security-group-blade.png
[4]: ./media/security-center-restrict-access-thru-internet-facing-endpoint/inbound-security-rules.png
[5]: ./media/security-center-restrict-access-thru-internet-facing-endpoint/default-rules.png
[6]: ./media/security-center-restrict-access-thru-internet-facing-endpoint/edit-inbound-rule.png
