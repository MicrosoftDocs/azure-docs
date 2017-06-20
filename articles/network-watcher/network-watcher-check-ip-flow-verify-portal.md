---
title: Verify traffic with Azure Network Watcher IP flow verify - Azure portal | Microsoft Docs
description: This article describes how to check if traffic to or from a virtual machine is allowed or denied
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: e0e3e9a8-70eb-409a-a744-0ce9deb27148
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace

---
# Check if traffic is allowed or denied to or from a VM with IP Flow Verify a component of Azure Network Watcher

> [!div class="op_single_selector"]
> - [Azure portal](network-watcher-check-ip-flow-verify-portal.md)
> - [PowerShell](network-watcher-check-ip-flow-verify-powershell.md)
> - [CLI](network-watcher-check-ip-flow-verify-cli.md)
> - [Azure REST API](network-watcher-check-ip-flow-verify-rest.md)

IP flow verify is a feature of Network Watcher that allows you to verify if traffic is allowed to or from a virtual machine. The validation can be run for incoming or outgoing traffic. This scenario is useful to get a current state of whether a virtual machine can talk to an external resource or another resource. IP flow verify can be used to verify if your Network Security Group (NSG) rules are properly configured and troubleshoot flows that are being blocked by NSG rules. Another reason for using IP flow verify is to ensure traffic that you want blocked is being blocked properly by the NSG.

## Before you begin

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher or have an existing instance of Network Watcher. The scenario also assumes that a Resource Group with a valid virtual machine exists to be used.

## Scenario

This scenario uses IP Flow Verify to verify if a virtual machine can talk to another machine over port 443. If the traffic is denied, it returns the security rule that is denying that traffic. To learn more about IP Flow Verify, visit [IP Flow Verify Overview](network-watcher-ip-flow-verify-overview.md)

### Run IP flow verify

Navigate to your Network Watcher and click **IP flow verify**. Select the virtual machine and network interface you want to verify traffic from. Enter any additional filtering information and click **Check**.

Once you click **Check**, the flow based on the criteria you provided is checked. The result is either **Access allowed** or **Access denied**. If access is denied, the Network Security Group (NSG) and security rule that block traffic is provided. If the denial of traffic is expected behavior, then the rule was successful.

> [!NOTE]
> IP flow verify requires that the VM resource is allocated.

As you can see from the following image, the outbound HTTPS traffic was allowed.

![ip flow verify overview][1]

As seen in the following image, traffic is changed to inbound and the inbound port changed to 123. Traffic is now denied, the message "Access denied" is provided along with the network security group and security rule that deny the traffic.

![ip flow results][2]

## Next steps

If traffic is being blocked and it should not be, see [Manage Network Security Groups](../virtual-network/virtual-network-manage-nsg-arm-portal.md) to track down the network security group and security rules that are defined.

[1]: ./media/network-watcher-check-ip-flow-verify-portal/figure1.png
[2]: ./media/network-watcher-check-ip-flow-verify-portal/figure2.png













