---
title: 'Tutorial: Deploy Azure Firewall private IP DNAT for overlapped and nonroutable networks'
description: Learn how to deploy and configure Azure Firewall private IP DNAT to handle overlapped network scenarios and nonroutable network access using ARM templates.
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: tutorial
ms.date: 10/13/2025
ms.author: duau
ms.custom: template-tutorial, ai-usage
ai-usage: ai-assisted
# Customer intent: As a network administrator, I want to configure Azure Firewall private IP DNAT for overlapped and non-routable network scenarios, so that I can provide secure access to resources in complex network topologies.
---

# Tutorial: Deploy Azure Firewall private IP DNAT for overlapped and nonroutable networks

Azure Firewall private IP DNAT (Destination Network Address Translation) enables you to translate and filter inbound traffic using the firewall's private IP address instead of its public IP address. This capability is useful for scenarios involving overlapped networks or nonroutable network access where traditional public IP DNAT isn't suitable.

Private IP DNAT addresses two key scenarios:
- **Overlapped networks**: When multiple networks share the same IP address space
- **Non-routable networks**: When you need to access resources through networks that aren't directly routable

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Understand private IP DNAT use cases
> * Deploy Azure Firewall with private IP DNAT capability
> * Configure DNAT rules for overlapped network scenarios
> * Configure DNAT rules for non-routable network access
> * Test private IP DNAT functionality
> * Validate traffic flow and rule processing

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
- Azure Firewall Standard or Premium (private IP DNAT isn't supported in Basic SKU)
- Familiarity with Azure networking concepts
- Understanding of [Azure Firewall rule processing logic](rule-processing.md)

> [!IMPORTANT]
> Private IP DNAT is available only in Azure Firewall Standard and Premium SKUs. The Basic SKU doesn't support this feature.

## Scenario overview

This tutorial demonstrates two common private IP DNAT scenarios:

### Scenario 1: Overlapped networks
You have multiple virtual networks that use the same IP address space (for example, 10.0.0.0/16) and need to access resources across these networks without IP conflicts.

### Scenario 2: Nonroutable network access
You need to provide access to resources in networks that aren't directly routable from the source, such as accessing on-premises resources through Azure Firewall.

## Deploy the environment

Use the provided ARM template to create the test environment with all necessary components.

### Download the deployment template

1. Download the ARM template from the [Azure Network Security GitHub repository](https://github.com/Azure/Azure-Network-Security/tree/master/Azure%20Firewall/Template%20-%20Private%20IP%20Dnat%20with%202%20Scenarios%20-%20Overlapped%20Network%20and%20Non-Routable%20Network).

2. Save the `PrivateIpDnatArmTemplateV2.json` file to your local machine.

### Deploy using Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **Create a resource** > **Template deployment (deploy using custom templates)**.

3. Select **Build your own template in the editor**.

4. Delete the existing content and paste the content of the downloaded ARM template.

5. Select **Save**.

6. Provide the following information:
   - **Subscription**: Select your Azure subscription
   - **Resource group**: Create a new resource group or select an existing one
   - **Region**: Select your preferred Azure region
   - **Location**: This parameter is autopopulated based on the selected region

7. Review the template parameters and modify as needed.

8. Select **Review + create**, then **Create** to deploy the template.

The deployment creates the following resources:
- Virtual networks for overlapped and nonroutable scenarios
- Azure Firewall with private IP DNAT configuration
- Virtual machines for testing connectivity
- Network security groups and route tables
- All necessary networking components

> [!NOTE]
> The ARM template includes preconfigured DNAT rules for testing both scenarios. You can examine these rules after deployment or modify them as needed for your specific requirements.

## Verify private IP DNAT rules

After the deployment completes, verify that the DNAT rules were created correctly for both scenarios.

### Verify rules for overlapped networks

1. In the Azure portal, navigate to your Azure Firewall resource (`azfw-hub-vnet-1`).

2. Under **Settings**, select **Firewall Policy**.

3. Select the firewall policy (`fp-azfw-hub-vnet-1`).

4. Under **Settings**, select **Rule collection groups**.

5. Select `DefaultDnatRuleCollectionGroup` to view the preconfigured rules.

You should see the following DNAT rules:
- **ToVM2-Http**: Translates `10.10.0.4:80` → `10.10.2.4:80` (access hub-vnet-2 firewall from spoke-vnet-1)
- **ToVM2-Rdp**: Translates `10.10.0.4:53388` → `10.10.2.4:3389` (RDP access)
- **ToVM3-Http**: Translates `10.10.0.4:8080` → `172.16.0.4:80` (access branch-vnet-1 from spoke-vnet-1)
- **ToVM3-Rdp**: Translates `10.10.0.4:53389` → `172.16.0.4:3389` (RDP access)

### Verify rules for nonroutable networks

1. Navigate to the second Azure Firewall resource (`azfw-hub-vnet-2`).

2. Under **Settings**, select **Firewall Policy**.

3. Select the firewall policy (`fp-azfw-hub-vnet-2`).

4. Under **Settings**, select **Rule collection groups**.

5. Select `DefaultDnatRuleCollectionGroup` to view the rules for the second scenario.

You should see the following DNAT rules:
- **ToVM2-Http**: Translates `10.10.2.4:80` → `192.168.0.4:80` (access spoke-vnet-2 from hub-vnet-1 firewall subnet)
- **ToVM2-Rdp**: Translates `10.10.2.4:3389` → `192.168.0.4:3389` (RDP access to spoke-vnet-2)

These rules demonstrate the overlapped network scenario where both spoke networks use the same IP space (192.168.0.0/24).

## Set up virtual machines

Complete the VM configuration by running the provided PowerShell scripts.

### Configure VM in scenario 1 (Overlapped network)

1. Connect to the virtual machine `win-vm-2` using Azure Bastion or RDP.

2. Open PowerShell as Administrator.

3. Download and run the configuration script:
   ```powershell
   # Download the script from GitHub repository
   Invoke-WebRequest -Uri "https://raw.githubusercontent.com/Azure/Azure-Network-Security/master/Azure%20Firewall/Template%20-%20Private%20IP%20Dnat%20with%202%20Scenarios%20-%20Overlapped%20Network%20and%20Non-Routable%20Network/win-vm-2.ps1" -OutFile "C:\win-vm-2.ps1"
   
   # Execute the script
   .\win-vm-2.ps1
   ```

### Configure VM in scenario 2 (Nonroutable network)

1. Connect to the virtual machine `win-vm-3` using Azure Bastion or RDP.

2. Open PowerShell as Administrator.

3. Download and run the configuration script:
   ```powershell
   # Download the script from GitHub repository
   Invoke-WebRequest -Uri "https://raw.githubusercontent.com/Azure/Azure-Network-Security/master/Azure%20Firewall/Template%20-%20Private%20IP%20Dnat%20with%202%20Scenarios%20-%20Overlapped%20Network%20and%20Non-Routable%20Network/win-vm-3.ps1" -OutFile "C:\win-vm-3.ps1"
   
   # Execute the script
   .\win-vm-3.ps1
   ```

## Test private IP DNAT functionality

Verify that the private IP DNAT configuration works correctly for both scenarios.

### Test overlapped network scenario

1. From a client machine in the source network, attempt to connect to the Azure Firewall private IP address using the configured port.

2. Verify that the connection is successfully translated to the target VM in the overlapped network.

3. Check Azure Firewall logs to confirm rule hits and successful translation.

### Test nonroutable network scenario

1. From the appropriate source network, connect to the Azure Firewall private IP address.

2. Verify access to resources in the nonroutable network through the firewall.

3. To ensure proper rule processing and traffic flow, monitor the firewall logs.

## Monitor and troubleshoot

To monitor private IP DNAT performance, use Azure Firewall diagnostic logs and metrics.

### Enable diagnostic logging

1. In the Azure portal, navigate to your Azure Firewall resource.

2. Select **Diagnostic settings** > **+ Add diagnostic setting**.

3. Configure logging for:
   - Azure Firewall Application Rule Log
   - Azure Firewall Network Rule Log
   - Azure Firewall NAT Rule Log

4. Choose your preferred destination (Log Analytics workspace, Storage account, or Event Hubs).

### Key metrics to monitor

To ensure optimal performance, monitor these metrics:
- **Data processed**: Total amount of data processed by the firewall
- **Network rule hit count**: Number of network rules matched
- **NAT rule hit count**: Number of DNAT rules matched
- **Throughput**: Firewall throughput performance

## Best practices

Follow these best practices when implementing private IP DNAT:

- **Rule ordering**: To ensure correct processing order, place more specific rules with lower priority numbers
- **Source specification**: Use specific source IP ranges instead of wildcards for better security
- **Network segmentation**: To isolate overlapped networks, implement proper network segmentation
- **Monitoring**: To identify performance issues, regularly monitor firewall logs and metrics
- **Testing**: To ensure reliability in production, thoroughly test all DNAT rules before implementing

## Clean up resources

When you no longer need the test environment, delete the resource group to remove all resources created in this tutorial.

1. In the Azure portal, navigate to your resource group.

2. Select **Delete resource group**.

3. Type the resource group name to confirm deletion.

4. Select **Delete** to remove all resources.

## Next steps

In this tutorial, you learned how to deploy and configure Azure Firewall private IP DNAT for overlapped and nonroutable network scenarios. You deployed the test environment, configured DNAT rules, and validated functionality.

To learn more about Azure Firewall DNAT capabilities:

- [DNAT rule for filtering inbound traffic](destination-nat-rules.md)
- [Azure Firewall rule processing logic](rule-processing.md)
- [Monitor Azure Firewall logs and metrics](monitor-firewall.md)
- [Private IP DNAT scenarios with Azure Firewall (Tech Community blog)](https://techcommunity.microsoft.com/blog/azurenetworksecurityblog/private-ip-dnat-support-preview-and-scenarios-with-azure-firewall/4230073)