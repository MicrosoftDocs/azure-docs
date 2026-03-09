---
title: Set up a network for Azure Monitor for SAP solutions 
description: Learn how to set up an Azure virtual network for use with Azure Monitor for SAP solutions.
author: MightySuz
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: how-to
ms.date: 08/22/2024
ms.author: jacobjaygbay
#Customer intent: As a developer, I want to set up an Azure virtual network so that I can use Azure Monitor for SAP solutions.
# Customer intent: As an IT administrator, I want to configure an Azure virtual network for Azure Monitor for SAP solutions, so that I can ensure proper data collection and monitoring of my SAP environment.
---
# Set up a network for Azure Monitor for SAP solutions

In this how-to guide, you learn how to configure an Azure virtual network so that you can deploy Azure Monitor for SAP solutions. You learn how to:

- [Create a new subnet](#create-a-new-subnet) for use with Azure Functions.
- [Set up outbound internet access](#configure-outbound-internet-access) to the SAP environment that you want to monitor.

## Create a new subnet

Azure Functions is the data collection engine for Azure Monitor for SAP solutions. You must create a new subnet to host Azure Functions.

[Create a new subnet](../../azure-functions/functions-networking-options.md#subnets) with an **IPv4/25** block or larger because you need at least 100 IP addresses for monitoring resources.
After you successfully create a subnet, verify the following steps to ensure connectivity between the Azure Monitor for SAP solutions subnet and your SAP environment subnet:

- If both the subnets are in different virtual networks, do a virtual network peering between the virtual networks.
- If the subnets are associated with user-defined routes, make sure the routes are configured to allow traffic between the subnets.
- If the SAP environment subnets have network security group (NSG) rules, make sure the rules are configured to allow inbound traffic from the Azure Monitor for SAP solutions subnet.
- If you have a firewall in your SAP environment, make sure the firewall is configured to allow inbound traffic from the Azure Monitor for SAP solutions subnet.

For more information, see how to [integrate your app with an Azure virtual network](../../app-service/overview-vnet-integration.md).

## Use Custom DNS for your virtual network

This section only applies if you're using Custom DNS for your virtual network. Add the IP address 168.63.129.16, which points to Azure DNS Server. This arrangement resolves the storage account and other resource URLs that are required for proper functioning of Azure Monitor for SAP solutions.

> [!div class="mx-imgBorder"]
> ![Screenshot that shows the Custom DNS setting.]([../../media/set-up-network/adding-custom-dns.png)

## Configure outbound internet access

In many use cases, you might choose to restrict or block outbound internet access to your SAP network environment. However, Azure Monitor for SAP solutions requires network connectivity between the [subnet that you configured](#create-a-new-subnet) and the systems that you want to monitor. Before you deploy an Azure Monitor for SAP solutions resource, you must configure outbound internet access or the deployment fails.

There are multiple methods to address restricted or blocked outbound internet access. Choose the method that works best for your use case:

- [Use the Route All feature in Azure Functions](#use-route-all)
- [Use service tags with an NSG in your virtual network](#use-service-tags)

### Use Route All

**Route All** is a [standard feature of virtual network integration](../../azure-functions/functions-networking-options.md#virtual-network-integration) in Azure Functions, which is deployed as part of Azure Monitor for SAP solutions. Enabling or disabling this setting only affects traffic from Azure Functions. This setting doesn't affect any other incoming or outgoing traffic within your virtual network.

You can configure the **Route All** setting when you create an Azure Monitor for SAP solutions resource through the Azure portal. If your SAP environment doesn't allow outbound internet access, disable **Route All**. If your SAP environment allows outbound internet access, keep the default setting to enable **Route All**.

You can only use this option before you deploy an Azure Monitor for SAP solutions resource. It's not possible to change the **Route All** setting after you create the Azure Monitor for SAP solutions resource.

### Allow inbound traffic

If you have NSG or User-Defined Route rules that block inbound traffic to your SAP environment, you must modify the rules to allow the inbound traffic. Also, depending on the types of providers you're trying to add, you must unblock a few ports, as shown in the following table.

| Provider type                  | Port number                                                         |
|------------------------------------|---------------------------------------------------------------------|
| Prometheus OS                      |  9100                                                               |
| Prometheus HA Cluster on RHEL      |  44322                                                              |
| Prometheus HA Cluster on SUSE      |  9100                                                               |
| SQL Server                         |  1433  (can be different if you aren't using the default port)     |
| DB2 Server                         |  25000 (can be different if you aren't using the default port)     |
| SAP HANA DB                        |  3\<instance number\>13, 3\<instance number\>15                         |
| SAP NetWeaver                      |  5\<instance number\>13, 5\<instance number\>15                         |

### Use service tags

If you use NSGs, you can create Azure Monitor for SAP solutions-related [virtual network service tags](../../virtual-network/service-tags-overview.md) to allow appropriate traffic flow for your deployment. A service tag represents a group of IP address prefixes from a specific Azure service.

You can use this option after you deploy an Azure Monitor for SAP solutions resource.

1. Find the subnet associated with your Azure Monitor for SAP solutions managed resource group:
      1. Sign in to the [Azure portal](https://portal.azure.com).
      1. Search for or select the Azure Monitor for SAP solutions service.
      1. On the **Overview** page for Azure Monitor for SAP solutions, select your Azure Monitor for SAP solutions resource.
      1. On the managed resource group's page, select the Azure Functions app.
      1. On the app's page, select the **Networking** tab. Then select **VNET Integration**.
      1. Review and note the subnet details. You need the subnet's IP address to create rules in the next step.
1. Select the subnet's name to find the associated NSG. Note the NSG's information.
1. Set new NSG rules for outbound network traffic:
      1. Go to the NSG resource in the Azure portal.
      1. On the NSG menu, under **Settings**, select **Outbound security rules**.
      1. Select **Add** to add the following new rules:

    | Priority | Name                | Port | Protocol | Source | Destination      | Action |
    |--------------|--------------------------|----------|--------------|------------|----------------------|------------|
    | 450          | allow_monitor            | 443      | TCP          |  Azure Functions subnet           | Azure Monitor         | Allow      |
    | 451          | allow_keyVault           | 443      | TCP          |  Azure Functions subnet           | Azure Key Vault        | Allow      |
    | 452          | allow_storage            | 443      | TCP          |   Azure Functions subnet          | Storage              | Allow      |
    | 453          | allow_azure_controlplane | 443      | Any          |   Azure Functions subnet          | Azure Resource Manager | Allow      |
    | 454      | allow_ams_to_source_system | Any  | Any   |  Azure Functions subnet | Virtual network or comma-separated IP addresses of the source system | Allow      |
    | 455          | allow_monitor_for_sap    | 443      | TCP          |  Azure Functions subnet           | AzureMonitorForSAP         | Allow      |
    | 660          | deny_internet            | Any      | Any          | Any        | Internet             | Deny       |

The Azure Monitor for SAP solution's subnet IP address refers to the IP of the subnet associated with your Azure Monitor for SAP solutions resource. To find the subnet, go to the Azure Monitor for SAP solutions resource in the Azure portal. On the **Overview** page, review the **vNet/subnet** value.

For the rules that you create, **allow_vnet** must have a lower priority than **deny_internet**. All other rules also need to have a lower priority than **allow_vnet**. The remaining order of these other rules is interchangeable.

## Troubleshooting Networking Issues

When configuring providers in Azure Monitor for SAP solutions, you might encounter connectivity issues between Azure Monitor for SAP solutions and your SAP environment. In this section, we provide guidance on how to troubleshoot these networking issues.

- [Hostname resolution issues](#hostname-resolution-issues)
- [Check effective network rules](#check-effective-network-rules)

### Hostname resolution issues

When you add a provider in Azure Monitor for SAP solutions, it needs to resolve the hostname of the system that you want to monitor. For monitoring different systems, like SAP HANA or SAP NetWeaver, Azure Monitor for SAP solutions deploys Azure Function apps. These function apps make a connection to your source system and run the checks. In this section, we see how to check if the Azure function app is able to resolve the hostname for your SAP system. If your provider onboarding fails due to hostname resolution issues, you can follow these steps to troubleshoot:

1. Go to the Azure portal and navigate to your Azure Monitor for SAP solutions resource.
1. Now, open the managed resource group for your Azure Monitor for SAP solutions resource. You can find the name of the managed resource group in the **Overview** page of your Azure Monitor for SAP solutions resource.
   :::image type="content" source="./media/set-up-network/managed-resource-group.png" alt-text="Screenshot showing the managed resource group." lightbox="./media/set-up-network/managed-resource-group.png":::
1. In the managed resource group, find the Azure Function app that is associated with the provider that you're trying to onboard. The naming convention for the function app is **<provider_type>-<unique_identifier>**. For example, if you're trying to onboard an SAP HANA system, look for a function app with the name **saphana-<unique_identifier>**.
   :::image type="content" source="./media/set-up-network/azure-function-apps.png" alt-text="Screenshot showing the Azure Function apps." lightbox="./media/set-up-network/azure-function-apps.png":::
1. Open the function app and search for **Development Tools**.
1. Open **Advanced Tools** in the left-hand menu then select **Go** to open Kudu.
   :::image type="content" source="./media/set-up-network/open-advanced-tools.png" alt-text="Screenshot showing how to navigate to Advanced Tools." lightbox="./media/set-up-network/open-advanced-tools.png":::

Now as we have access to Kudu, we run the following checks to troubleshoot hostname resolution issues:

#### Check if Azure Function is integrated with virtual network

Follow these steps to check if the Azure Function app is integrated with the virtual network:

1. In Kudu, Select the **Environment** tab.
1. Now, search for **WEBSITE_PRIVATE_IP** in the environment variables list.
1. Verify that the value for **WEBSITE_PRIVATE_IP** is an IP address from the subnet that you configured for Azure Monitor for SAP solutions.
   :::image type="content" source="./media/set-up-network/website-private-ip-address.png" alt-text="Screenshot showing the website private IP address." lightbox="./media/set-up-network/website-private-ip-address.png":::

#### Check hostname resolution from Azure Function

Follow these steps to check if the Azure Function app can resolve the hostname of your SAP system:

1. In Kudu, Select the **SSH** tab.
1. In the SSH to Kudu, click on the **Start Connection** button. This opens the debug console in a new tab. The debug console is a terminal where you can run commands to check connectivity and troubleshoot issues.
   :::image type="content" source="./media/set-up-network/open-kudu-debug-console.png" alt-text="Screenshot showing the Kudu debug console." lightbox="./media/set-up-network/open-kudu-debug-console.png":::
1. Now you have access to a terminal where you can run commands. Run the following command
1. To check if the hostname of your SAP system is resolving correctly, run the following command in the terminal, replacing hostname with the actual hostname of your SAP system:

   ```bash
   nslookup hostname
   ```

1. To check if the Azure Function app can connect to your SAP system on the required port, run the following command in the terminal, replacing hostname with the actual **hostname** of your SAP system and port with the actual **port** number that your SAP system is listening on. To find the port number, refer to the documentation section on [Allow inbound traffic](#allow-inbound-traffic) and find the port number for your provider type:

    ```bash
    timeout 5 bash -c "</dev/tcp/hostname/port" && echo "Port Open" || echo "Port Closed"
    curl -v telnet://hostname:port
    ```

1. If the hostname resolution is working correctly, you should see the IP address of your SAP system in the output of the nslookup command. If the connection to the required port is working correctly, you should see "Port Open" in the output of the timeout command and a successful connection message in the output of the curl command.
1. If you see any errors in the output of these commands, it indicates that there's a connectivity issue between the Azure Function app and your SAP system. You can use the error messages to further troubleshoot and identify the root cause of the issue. Common issues include incorrect DNS configuration, NSG rules blocking traffic, or firewall rules blocking traffic.

### Check effective network rules

When trying to resolve connectivity issues, it's important to check the effective network rules for your Virtual Machine or subnet. Effective network rules include NSG rules, user-defined routes, and firewall rules that are applied to your resources. These rules can affect the connectivity between Azure Monitor for SAP solutions and your SAP environment. In this section, we see how to check the effective network rules for your Virtual Machine or subnet:

1. Go to the Azure portal and navigate to your Virtual Machine that's hosting your SAP system.
1. Search for **Network Settings** in the left-hand menu and select it.
1. Open the **Network Interface** associated with your Virtual Machine.
   :::image type="content" source="./media/set-up-network/vm-network-interface.png" alt-text="Screenshot showing the network interface of the Virtual Machine." lightbox="./media/set-up-network/vm-network-interface.png":::
1. Search for **Effective routes** in the left-hand menu and select it. This shows you all the effective routes that are applied to your Virtual Machine. Review the routes to check if there are any routes that might be blocking traffic from Azure Monitor for SAP solutions.
   :::image type="content" source="./media/set-up-network/effective-routes.png" alt-text="Screenshot showing the effective routes of the network interface." lightbox="./media/set-up-network/effective-routes.png":::

## Next steps

- [Quickstart: Set up Azure Monitor for SAP solutions through the Azure portal](quickstart-portal.md)
- [Quickstart: Set up Azure Monitor for SAP solutions with PowerShell](quickstart-powershell.md)
