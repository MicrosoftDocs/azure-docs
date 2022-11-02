---
title: 'Quickstart: Diagnose a VM network traffic filter problem - Azure portal'
titleSuffix: Azure Network Watcher
description: In this quickstart, you learn how to diagnose a virtual machine network traffic filter problem using the IP flow verify  capability of Azure Network Watcher.
services: network-watcher
documentationcenter: network-watcher
author: damendo
ms.author: ankitadutta
editor: 
ms.date: 10/12/2022
ms.assetid: 
ms.topic: quickstart
ms.service: network-watcher
ms.workload: infrastructure
ms.tgt_pltfrm: network-watcher
tags: azure-resource-manager
ms.custom: mvc, mode-ui
#Customer intent: I need to diagnose a virtual machine (VM) network traffic filter problem that prevents communication to and from a VM.
---

# Quickstart: Diagnose a virtual machine network traffic filter problem using the Azure portal

In this quickstart, you will deploy a virtual machine (VM) and check communications to an IP address and URL, and from an IP address. You will determine the cause of a communication failure and learn how you can resolve it.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Log in to Azure

Log in to the Azure portal at https://portal.azure.com.

## Create a VM

1. Select **+ Create a resource** found on the upper-left corner of the Azure portal.
1. Select **Compute**, and then select **Windows Server 2019 Datacenter** or a version of **Ubuntu Server**.
1. Enter, or select, the following information, accept the defaults for the remaining settings, and then select **OK**:

    |Setting|Value|
    |---|---|
    |Subscription| Select your subscription.|
    |Resource group| Select **Create new** and enter **myResourceGroup**.|
    |Virtual machine name|myVm|
    |Region| Select **East US**|
    |User name| Enter a user name of your choosing.|
    |Password| Enter a password of your choosing. The password must be at least 12 characters long and meet the defined complexity requirements.|

1. Select **Review + create** to start VM deployment. The VM takes a few minutes to deploy. Wait for the VM to finish deploying before continuing with the remaining steps.

## Test network communication

To test network communication with Network Watcher, first, enable a network watcher in at least one Azure region, and then use Network Watcher's IP flow verify capability.

### Enable network watcher

If you already have a network watcher enabled in at least one region, skip to the [Use IP flow verify](#use-ip-flow-verify).

1. In the **Home** portal, select **More services**. In the **Filter box**, enter *Network Watcher*. When **Network Watcher** appears in the results, select it.
1. Enable a network watcher in the East US region, because that's the region the VM was deployed to in a previous step. Select **Add**, to expand it, and then select **Region** under **Subscription**, as shown in the following picture:
    :::image type="content" source="./media/diagnose-vm-network-traffic-filtering-problem/enable-network-watcher.png" alt-text="Screenshot of how to Enable Network Watcher." lightbox="./media/diagnose-vm-network-traffic-filtering-problem/enable-network-watcher.png":::
1. Select your region then select **Add**.

### Use IP flow verify

When you create a VM, Azure allows and denies network traffic to and from the VM, by default. You might later override Azure's defaults, allowing or denying additional types of traffic.

1. In the **Home** portal, select **More services**. In the **All services** *Filter* box, enter *Network Watcher*. When **Network Watcher** appears in the results, select it.
1. Select **IP flow verify**, under **Network diagnostic tools**.
1. Select your subscription, enter or select the following values, and then select **Check**, as shown in the picture that follows:

    |Setting            |Value                                                                                              |
    |---------          |---------                                                                                          |
    | Subscription      | Select your subscription                                                                          |
    | Resource group    | Select **myResourceGroup**                                                                            |
    | Virtual machine   | Select **myVm**                                                                                       |
    | Network interface | myvm - The name of the network interface the portal created when you created the VM is different. |
    | Protocol          | TCP                                                                                               |
    | Direction         | Outbound                                                                                          |
    | Local IP address  | 10.0.0.4                                                                                          |
    | Local port      | 60000                                                                                                |
    | Remote IP address | 13.107.21.200 - One of the addresses for <www.bing.com>.                                             |
    | Remote port       | 80                                                                                                |

    :::image type="content" source="./media/diagnose-vm-network-traffic-filtering-problem/ip-flow-verify-outbound.png" alt-text="Screenshot of values to input in IP flow verify.":::

    After a few seconds, the result returned informs you that access is allowed because of a security rule named **AllowInternetOutbound**. When you ran the check, Network Watcher automatically created a network watcher in the East US region, if you had an existing network watcher in a region other than the East US region before you ran the check.
1. Complete step 3 again, but change the **Remote IP address** to **172.31.0.100**. The result returned informs you that access is denied because of a security rule named **DenyAllOutBound**.
1. Complete step 3 again, but change the **Direction** to **Inbound**, the **Local port** to **80**, and the **Remote port** to **60000**. The **Remote IP address** remains **172.31.0.100**. The result returned informs you that access is denied because of a security rule named **DenyAllInBound**.

Now that you know which security rules are allowing or denying traffic to or from a VM, you can determine how to resolve the problems.

## View details of a security rule

To determine why the rules in steps 3-5 of **Use IP flow verify** allow or deny communication, review the effective security rules for the network interface in the VM.

1. In the search box at the top of the portal, enter *myvm*. When the  **myvm Regular Network Interface** appears in the search results, select it.
1. Select **Effective security rules** under **Support + troubleshooting**, as shown in the following picture:
    
    :::image type="content" source="./media/diagnose-vm-network-traffic-filtering-problem/effective-security-rules.png" alt-text="Screenshot of Effective security rules." lightbox="./media/diagnose-vm-network-traffic-filtering-problem/effective-security-rules.png" :::

    In step 3 of **Use IP flow verify**, you learned that the reason the communication was allowed is because of the **AllowInternetOutbound** rule. You can see in the previous picture that the **Destination** for the rule is **Internet**. It's not clear how 13.107.21.200, the address you tested in step 3 of **Use IP flow verify**, relates to **Internet** though.
1. Select the **AllowInternetOutBound** rule, and then scroll down to **Destination**, as shown in the following picture:
    
    :::image type="content" source="./media/diagnose-vm-network-traffic-filtering-problem/security-rule-prefixes.png" alt-text="Screenshot of Security rule prefixes.":::

    One of the prefixes in the list is **12.0.0.0/8**, which encompasses the 12.0.0.1-12.255.255.254 range of IP addresses. Since 13.107.21.200 is within that address range, the **AllowInternetOutBound** rule allows the outbound traffic. Additionally, there are no higher priority (lower number) rules shown in the picture in step 2 that override this rule. Close the **Address prefixes** box. To deny outbound communication to 13.107.21.200, you could add a security rule with a higher priority, that denies port 80 outbound to the IP address.

1. When you ran the outbound check to 172.131.0.100 in step 4 of **Use IP flow verify**, you learned that the **DenyAllOutBound** rule denied communication. That rule equates to the **DenyAllOutBound** rule shown in the picture in step 2 that specifies **0.0.0.0/0** as the **Destination**. This rule denies the outbound communication to 172.131.0.100 because the address is not within the **Destination** of any of the other **Outbound rules** shown in the picture. To allow the outbound communication, you can add a security rule with a higher priority, that allows outbound traffic to port 80 for the 172.131.0.100 address.
1. When you ran the inbound check from 172.131.0.100 in step 5 of **Use IP flow verify**, you learned that the **DenyAllInBound** rule denied communication. That rule equates to the **DenyAllInBound** rule shown in the picture in step 2. The **DenyAllInBound** rule is enforced because no other higher priority rule exists that allows port 80 inbound to the VM from 172.31.0.100. To allow the inbound communication, you could add a security rule with a higher priority, that allows port 80 inbound from 172.31.0.100.

The checks in this quickstart tested Azure configuration. If the checks return the expected results and you still have network problems, ensure that you don't have a firewall between your VM and the endpoint you're communicating with and that the operating system in your VM doesn't have a firewall that is allowing or denying communication.

## Clean up resources

When no longer needed, delete the resource group and all of the resources it contains:

1. Enter *myResourceGroup* in the **Search** box at the top of the portal. When you see **myResourceGroup** in the search results, select it.
1. Select **Delete resource group**.
1. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

## Next steps

In this quickstart, you created a VM and diagnosed inbound and outbound network traffic filters. You learned that network security group rules allow or deny traffic to and from a VM. Learn more about [security rules](../virtual-network/network-security-groups-overview.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json) and how to [create security rules](../virtual-network/manage-network-security-group.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json#create-a-security-rule).

Even with the proper network traffic filters in place, communication to a VM can still fail, due to routing configuration. To learn how to diagnose VM network routing problems, see [Diagnose VM routing problems](diagnose-vm-network-routing-problem.md) or, to diagnose outbound routing, latency, and traffic filtering problems, with one tool, see [Connection troubleshoot](network-watcher-connectivity-portal.md).
