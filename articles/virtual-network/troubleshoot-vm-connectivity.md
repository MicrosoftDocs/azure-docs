---
title:  Troubleshoot Azure VM connectivity problems
author: TobyTu
ms.author: Lin.Gen,kaushika 
manager: dcscontentpm 
audience: ITPro  
ms.topic: article  
ms.service: virtual-network
localization_priority: Normal
ms.date: 08/29/2019
--- 

# Troubleshoot Azure VM connectivity problems

This article helps administrators diagnose and resolve Azure VMs' connectivity problems.

## Problems

- Problem 1: One Azure VM that’s deployed by using Resource Manager can't connect to another Azure VM in same Virtual network
- Problem 2: One Azure VM can't connect to the second NIC of an Azure VM in same Virtual network
- Problem 3: Azure VM can't connect to Internet

To resolve these problems, follow the steps below.

## Resolution

### Azure VM cannot connect to another Azure VM in same Virtual network

#### Step 1: Verify if VMs can communicate with each other

1. Download TCping to your source VM.
2. Open a Command Prompt window.
3. Navigate to the folder in which you downloaded TCping.
4. Ping the destination from source VM by using the following command:

    ![TCping](media/troubleshoot-vm-connectivity/tcping.png)

    ```cmd
    tcping64.exe -t <destination VM address> 3389
    ```

> [!TIP]
> Skip step 2 if the ping test is successful.

### Step 2: Check the Network security group settings

For each VM, check for default Inbound port rules (Allow VNet Inbound and Allow Load Balancer Inbound). Make sure to also check that there are no matching blocking rules that are listed below a lower-numbered priority.
> [!NOTE]
> Lower numbered rules will be matched first. For example, if you have a rule that has priority 1000 and 6500, the rule that has priority 1000 will be matched first.

After that, try to Ping destination from source VM again:

```cmd
tcping64.exe -t <destination VM address> 3389
```

#### Step 3: Check if you can remote desktop or SSH to the destination VM

To remote desktop the VM, see:

**Windows**:

1. Sign in to the Azure portal.
2. In the left menu, click **Virtual Machines**.
3. Select the virtual machine from the list.
4. On the page for the virtual machine, click **Connect**.

For more information, see [How to connect and sign on to an Azure virtual machine running Windows](https://docs.microsoft.com/azure/virtual-machines/windows/connect-logon).

**Linux**:

For more information, see [Connect to a Linux VM in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/quick-create-portal).

If the remote desktop or SSH connection is successful, go to next step.

#### Step 4: Perform connectivity check

Run connectivity check on the Source VM and check the response:

**Windows**: [Check connectivity with Azure Network Watcher using PowerShell](https://docs.microsoft.com/en-us/azure/network-watcher/network-watcher-connectivity-powershell)

**Linux**: [Check connectivity with Azure Network Watcher using Azure CLI 2.0](https://docs.microsoft.com/en-us/azure/network-watcher/network-watcher-connectivity-cli)

The following is a sample of the response:

```
ConnectionStatus : Unreachable
AvgLatencyInMs   :
MinLatencyInMs   :
MaxLatencyInMs   :
ProbesSent       : 100
ProbesFailed     : 100
Hops             : [
                     {
                       "Type": "Source",
                       "Id": "c5222ea0-3213-4f85-a642-cee63217c2f3",
                       "Address": "10.1.1.4",
                       "ResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGrou
                   ps/ContosoRG/providers/Microsoft.Network/networkInterfaces/appNic0/ipConfigurat
                   ions/ipconfig1",
                       "NextHopIds": [
                         "9283a9f0-cc5e-4239-8f5e-ae0f3c19fbaa"
                       ],
                       "Issues": []
                     },
                     {
                       "Type": "VirtualAppliance",
                       "Id": "9283a9f0-cc5e-4239-8f5e-ae0f3c19fbaa",
                       "Address": "10.1.2.4",
                       "ResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGrou
                   ps/ContosoRG/providers/Microsoft.Network/networkInterfaces/fwNic/ipConfiguratio
                   ns/ipconfig1",
                       "NextHopIds": [
                         "0f1500cd-c512-4d43-b431-7267e4e67017"
                       ],
                       "Issues": []
                     },
```

#### Step 5: Fix the issue in the connectivity check result

1. In the **Hops** section of the connectivity check response that you received, check the **issues**.

    ![connectivity response](media/troubleshoot-vm-connectivity/connectivity-response.png)

2. Find the corresponding resolution in the following table and follow the steps to resolve the issues.

    |Issue type  |Value  |Resolution action |
    |---------|---------|---------|
    |NetworkSecurityRule|Name of the blocking NSG|You can [delete the NSG rule](https://docs.microsoft.com/en-us/azure/virtual-network/manage-network-security-group#delete-a-security-rule) or modify the rule as described [here](https://docs.microsoft.com/en-us/azure/virtual-network/manage-network-security-group#change-a-security-rule).|
    |UserDefinedRoute     |   Name of the blocking UDR      | If you do not need this route, delete the UDR. If you can’t delete the route, update the route by using the appropriate address prefix and next hop. You can also adjust the Network Virtual Appliance to forward traffic appropriately. For more information, see: [Virtual network traffic routing](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview) and [Route network traffic with a route table using PowerShell](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-create-udr-arm-ps).|
    |CPU    |    Usage     |     Follow these recommendations that describe in [Generic performance troubleshooting for Azure Virtual Machine running Linux or Windows](https://support.microsoft.com/en-in/help/3150851/generic-performance-troubleshooting-for-azure-virtual-machine-running).|
    |Memory    |      Usage   |    Follow these recommendations that describe in [Generic performance troubleshooting for Azure Virtual Machine running Linux or Windows](https://support.microsoft.com/en-in/help/3150851/generic-performance-troubleshooting-for-azure-virtual-machine-running).|
    |Guest Firewall    |      Name of the firewall blocking   |      Refer these steps: [Turn Windows Defender Firewall on or off](https://support.microsoft.com/en-us/help/4028544/windows-turn-windows-firewall-on-or-off).|
    |DNS Resolution     |    Name of the DNS     |    Follow these steps: [Azure DNS troubleshooting guide](https://docs.microsoft.com/en-us/azure/dns/dns-troubleshoot) and [Name resolution for resources in Azure virtual networks](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances).     |
    |Socket Error    |      Not applicable   |     The specified port is already in use by another application. Try to use a different.    |

3. Run the connectivity check again to see if the problem is resolved.

### Azure VM cannot connect to the second NIC of an Azure VM in same Virtual network

#### Step 1: Make sure that the second NIC is enabled to talk outside the subnet

By default, secondary NICs are not configured with a default gateway. Therefore, the traffic flow on the secondary NICs will be limited to the same subnet.

![IP configures](media/troubleshoot-vm-connectivity/ipconfig.png)

If users want to enable secondary NICs to talk outside their own subnet, they must add an entry to the routing table to configure the gateway:

1. On the VM that has the second NIC configured, run Command Prompt as Administrator.
2. Run the following command to add the entry in routing table:

    ```cmd
    Route add 0.0.0.0 mask 0.0.0.0 -p <Gateway IP>
    ```

    For example, if the second IP address is 192.168.0.4, the gateway IP should be 192.168.0.1. You need to run the following command:

    ```cmd
    Route add 0.0.0.0 mask 0.0.0.0 -p 192.168.0.1
    ```

3. Run route print. If the entry is added successfully, you will see the entry such as the  following:

    ![IP route](media/troubleshoot-vm-connectivity/iproute.png)

After that, try to connect to secondary NIC. If it still cannot work after you added the entry, go to next step.

#### Step 2: Check NSG settings for the NICs

For both primary and secondary NIC, check default Inbound port rules, Allow VNet Inbound, Allow Load Balancer to inbound on both the NICs. You should also make sure that there are no matching blocking rules with a lower numbered priority above them.

![NSG](media/troubleshoot-vm-connectivity/nsg.png)

#### Step 3: Run Connectivity check with the secondary NIC

1. Perform Connectivity check with the secondary NIC.
2. Perform Connectivity check across the environment to make sure end to end worked.

For more information about how to run the Connectivity check. see the following articles:

**Windows**: [Check connectivity with Azure Network Watcher using PowerShell](https://docs.microsoft.com/en-us/azure/network-watcher/network-watcher-connectivity-powershell)

**Linux**: [Check connectivity with Azure Network Watcher using Azure CLI 2.0](https://docs.microsoft.com/en-us/azure/network-watcher/network-watcher-connectivity-cli).

The following is a sample of the response:

```
ConnectionStatus : Unreachable
AvgLatencyInMs   : 
MinLatencyInMs   : 
MaxLatencyInMs   : 
ProbesSent       : 100
ProbesFailed     : 100
Hops             : [
                     {
                       "Type": "Source",
                       "Id": "c5222ea0-3213-4f85-a642-cee63217c2f3",
                       "Address": "10.1.1.4",
                       "ResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGrou
                   ps/ContosoRG/providers/Microsoft.Network/networkInterfaces/appNic0/ipConfigurat
                   ions/ipconfig1",
                       "NextHopIds": [
                         "9283a9f0-cc5e-4239-8f5e-ae0f3c19fbaa"
                       ],
                       "Issues": []
                     },
                     {
                       "Type": "VirtualAppliance",
                       "Id": "9283a9f0-cc5e-4239-8f5e-ae0f3c19fbaa",
                       "Address": "10.1.2.4",
                       "ResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGrou
                   ps/ContosoRG/providers/Microsoft.Network/networkInterfaces/fwNic/ipConfiguratio
                   ns/ipconfig1",
                       "NextHopIds": [
                         "0f1500cd-c512-4d43-b431-7267e4e67017"
                       ],
                       "Issues": []
                     },
```

#### Step 4: Refer the table under [Step 5](#step-5-fix-the-issue-in-the-connectivity-check-result) and follow the steps to resolve the issues

### Azure VM cannot connect to Internet

#### Step 1: Check if the NIC is in a failed state

Follow these steps to check the state of the NIC:

1. Log in to the resource explorer portal.
2. On the left panel, select subscriptions.
3. In the left pane, select the resource group to which the affected NIC / VM belongs to.
4. Go to the **Microsoft Network**.
5. Select the **Network Interfaces** option.
6. Select the affected network interface.
7. Click on the **Read/Write** option at the top of the portal.
8. Click on the **Edit** option.

    ![NIC1](media/troubleshoot-vm-connectivity/nicedit1.png)

9. After you click the **Edit** option, the “Get” option will change to **Put** option.

    ![NIC2](media/troubleshoot-vm-connectivity/nicedit2.png)

10. Select the affected network interface, and then click the **Put** option.
11. After that, in the **ProvisioningState** you will see as **Updating**.
12. Same you can also see on the regular Azure Resource Manager portal.
13. If the operation is completed successfully, the **ProvisioningState** value will change to **Succeeded** as shown.
14. Refresh your portal, NIC should be in success state.

#### Step 2: Follow [Step 4](#step-4-perform-connectivity-check) to perform a connectivity check

#### Step 3: Refer the table under [Step 5](#step-5-fix-the-issue-in-the-connectivity-check-result) and follow the steps to resolve the issues
