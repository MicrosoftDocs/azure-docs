---
title: Tutorial - Monitor network communication using the Azure portal using Virtual machine scale set  
description: In this tutorial, learn how to monitor network communication between two virtual machine scale sets with Azure Network Watcher's connection monitor capability.
services: network-watcher
documentationcenter: na
author: mjha
editor: ''
tags: azure-resource-manager
# Customer intent: I need to monitor communication between a virtual machine scale set  and another VM. If the communication fails, I need to know why, so that I can resolve the problem. 

ms.service: network-watcher
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 05/24/2022
ms.author: mjha
ms.custom: mvc
---

# Tutorial: Monitor network communication between two virtual machine scale sets using the Azure portal

> [!NOTE]
> This tutorial covers Connection Monitor. Try the new and improved [Connection Monitor](connection-monitor-overview.md) to experience enhanced connectivity monitoring

> [!IMPORTANT]
> Starting 1 July 2021, you will not be able to add new connection monitors in Connection Monitor (classic) but you can continue to use existing connection monitors created prior to 1 July 2021. To minimize service disruption to your current workloads, [migrate from Connection Monitor (classic) to the new Connection Monitor](migrate-to-connection-monitor-from-connection-monitor-classic.md) in Azure Network Watcher before 29 February 2024.

Successful communication between a virtual machine scale set (VMSS) and an endpoint such as another VM, can be critical for your organization. Sometimes, configuration changes are introduced which can break communication. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual machine scale set  and a VM
> * Monitor communication between virtual machine scale set  and VM with Connection Monitor
> * Generate alerts on Connection Monitor metrics
> * Diagnose a communication problem between two VMs, and learn how you can resolve it

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual machine scale set 

Create a virtual machine scale set.

## Create a load balancer

Azure [load balancer](../load-balancer/load-balancer-overview.md) distributes incoming traffic among healthy virtual machine instances. 

First, create a public Standard Load Balancer by using the portal. The name and public IP address you create are automatically configured as the load balancer's front end.

1. In the search box, type **load balancer**. Under **Marketplace** in the search results, pick **Load balancer**.
1. In the **Basics** tab of the **Create load balancer** page, enter or select the following information:

    | Setting                 | Value   |
    | ---| ---|
    | Subscription  | Select your subscription.    |    
    | Resource group | Select **Create new** and type *myVMSSResourceGroup* in the text box.|
    | Name           | *myLoadBalancer*         |
    | Region         | Select **East US**.       |
    | Type          | Select **Public**.       |
    | SKU           | Select **Standard**.       |
    | Public IP address | Select **Create new**. |
    | Public IP address name  | *myPip*   |
    | Assignment| Static |
    | Availability zone | Select **Zone-redundant**. |

1. When you are done, select **Review + create** 
1. After it passes validation, select **Create**. 


## Create virtual machine scale set

You can deploy a scale set with a Windows Server image or Linux images such as RHEL, CentOS, Ubuntu, or SLES.

1. Type **Scale set** in the search box. In the results, under **Marketplace**, select **Virtual machine scale sets**. Select **Create** on the **Virtual machine scale sets** page, which will open the **Create a virtual machine scale set** page. 
1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and select *myVMSSResourceGroup* from the resource group list. 
1. Type *myScaleSet* as the name for your scale set.
1. In **Region**, select a region that is close to your area.
1. Under **Orchestration**, ensure the *Uniform* option is selected for **Orchestration mode**. 
1. Select a marketplace image for **Image**. In this example, we have chosen *Ubuntu Server 18.04 LTS*.
1. Enter your desired username, and select which authentication type you prefer.
   - A **Password** must be at least 12 characters long and meet three out of the four following complexity requirements: one lowercase character, one uppercase character, one number, and one special character. For more information, see [username and password requirements](../virtual-machines/windows/faq.yml#what-are-the-password-requirements-when-creating-a-vm-).
   - If you select a Linux OS disk image, you can instead choose **SSH public key**. Only provide your public key, such as *~/.ssh/id_rsa.pub*. You can use the Azure Cloud Shell from the portal to [create and use SSH keys](../virtual-machines/linux/mac-create-ssh-keys.md).
   
 
1. Select **Next** to move the other pages. 
1. Leave the defaults for the **Instance** and **Disks** pages.
1. On the **Networking** page, under **Load balancing**, select **Yes** to put the scale set instances behind a load balancer. 
1. In **Load balancing options**, select **Azure load balancer**.
1. In **Select a load balancer**, select *myLoadBalancer* that you created earlier.
1. For **Select a backend pool**, select **Create new**, type *myBackendPool*, then select **Create**.
1. When you are done, select **Review + create**. 
1. After it passes validation, select **Create** to deploy the scale set.


Once the scale set is created, follow the steps below to enable the Network Watcher extension in the scale set.

1. Under **Settings**, select **Extensions**. Select **Add extension**, and select **Network Watcher Agent for Windows**, as shown in the following picture:

:::image type="content" source="./media/connection-monitor/nw-agent-extension.png" alt-text="Screenshot that shows Network Watcher extension addition.":::

  
1. Under **Network Watcher Agent for Windows**, select **Create**, under **Install extension** select **OK**, and then under **Extensions**, select **OK**.

 
### Create the VM

Complete the steps in [create a VM](./connection-monitor.md#create-the-first-vm) again, with the following changes:

|Step|Setting|Value|
|---|---|---|
| 1 | Select a version of the **Ubuntu Server** |                                                                         |
| 3 | Name                                  | myVm2                                                                   |
| 3 | Authentication type                   | Paste your SSH public key or select **Password**, and enter a password. |
| 3 | Resource group                        | Select **Use existing** and select **myResourceGroup**.                 |
| 6 | Extensions                            | **Network Watcher Agent for Linux**                                     |

The VM takes a few minutes to deploy. Wait for the VM to finish deploying before continuing with the remaining steps.

## Create a connection monitor

To create a monitor in Connection Monitor by using the Azure portal:

1. On the Azure portal home page, go to **Network Watcher**.
1. In the left pane, in the **Monitoring** section, select **Connection monitor**.

   You'll see all the connection monitors that were created in Connection Monitor. To see the connection monitors that were created in the classic Connection Monitor, go to the **Connection monitor** tab.

   :::image type="content" source="./media/connection-monitor-2-preview/cm-resource-view.png" alt-text="Screenshot that shows connection monitors created in Connection Monitor.":::
   
	
1. In the **Connection Monitor** dashboard, in the upper-left corner, select **Create**.
   

1. On the **Basics** tab, enter information for your connection monitor: 
   * **Connection Monitor Name**: Enter a name for your connection monitor. Use the standard naming rules for Azure resources.
   * **Subscription**: Select a subscription for your connection monitor.
   * **Region**: Select a region for your connection monitor. You can select only the source VMs that are created in this region.
   * **Workspace configuration**: Choose a custom workspace or the default workspace. Your workspace holds your monitoring data.
       * To use the default workspace, select the check box. 
       * To choose a custom workspace, clear the check box. Then select the subscription and region for your custom workspace. 

   :::image type="content" source="./media/connection-monitor-2-preview/create-cm-basics.png" alt-text="Screenshot that shows the Basics tab in Connection Monitor.":::
   
1. At the bottom of the tab, select **Next: Test groups**.

1. Add sources, destinations, and test configurations in your test groups. To learn about setting up your test groups, see [Create test groups in Connection Monitor](#create-test-groups-in-a-connection-monitor). 

   :::image type="content" source="./media/connection-monitor-2-preview/create-tg.png" alt-text="Screenshot that shows the Test groups tab in Connection Monitor.":::

1. At the bottom of the tab, select **Next: Create Alerts**. To learn about creating alerts, see [Create alerts in Connection Monitor](#create-alerts-in-connection-monitor).

   :::image type="content" source="./media/connection-monitor-2-preview/create-alert.png" alt-text="Screenshot that shows the Create alert tab.":::

1. At the bottom of the tab, select **Next: Review + create**.

1. On the **Review + create** tab, review the basic information and test groups before you create the connection monitor. If you need to edit the connection monitor, you can do so by going back to the respective tabs. 
   :::image type="content" source="./media/connection-monitor-2-preview/review-create-cm.png" alt-text="Screenshot that shows the Review + create tab in Connection Monitor.":::
   > [!NOTE] 
   > The **Review + create** tab shows the cost per month during the Connection Monitor stage. Currently, the **Current Cost/Month** column shows no charge. When Connection Monitor becomes generally available, this column will show a monthly charge. 
   > 
   > Even during the Connection Monitor stage, Log Analytics ingestion charges apply.

1. When you're ready to create the connection monitor, at the bottom of the **Review + create** tab, select **Create**.

Connection Monitor creates the connection monitor resource in the background.

## Create test groups in a connection monitor

 >[!NOTE]
 >> Connection Monitor now supports auto enablement of monitoring extensions for Azure & Non-Azure endpoints, thus eliminating the need for manual installation of monitoring solutions during the creation of Connection Monitor. 

Each test group in a connection monitor includes sources and destinations that get tested on network parameters. They're tested for the percentage of checks that fail and the RTT over test configurations.

In the Azure portal, to create a test group in a connection monitor, you specify values for the following fields:

* **Disable test group**: You can select this check box to disable monitoring for all sources and destinations that the test group specifies. This selection is cleared by default.
* **Name**: Name your test group.
* **Sources**: You can specify both Azure VMs and on-premises machines as sources if agents are installed on them. To learn about installing an agent for your source, see [Install monitoring agents](./connection-monitor-overview.md#install-monitoring-agents).
   * To choose Azure agents, select the **Azure endpoints** tab. Here you see only VMs or virtual machine scale sets that are bound to the region that you specified when you created the connection monitor. By default, VMs and virtual machine scale sets are grouped into the subscription that they belong to. These groups are collapsed. 
   
       You can drill down from the **Subscription** level to other levels in the hierarchy:

      **Subscription** > **Resource group** > **VNET** > **Subnet** > **VMs with agents** 

      You can also change the **Group by** selector to start the tree from any other level. For example, if you group by virtual network, you see the VMs that have agents in the hierarchy **VNET** > **Subnet** > **VMs with agents**.

       When you select a VNET, subnet, a single VM or a virtual machine scale set the corresponding resource ID is set as the endpoint. By default, all VMs in the selected VNET or subnet participate in monitoring. To reduce the scope, either select specific subnets or agents or change the value of the scope property. 

      :::image type="content" source="./media/connection-monitor-2-preview/add-sources-1.png" alt-text="Screenshot that shows the Add Sources pane and the Azure endpoints including VMSS tab in Connection Monitor.":::

   * To choose on-premises agents, select the **Non–Azure endpoints** tab. By default, agents are grouped into workspaces by region. All these workspaces have the Network Performance Monitor configured. 
   
       If you need to add Network Performance Monitor to your workspace, get it from [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/solarwinds.solarwinds-orion-network-performance-monitor?tab=Overview). For information about how to add Network Performance Monitor, see [Monitoring solutions in Azure Monitor](../azure-monitor/insights/solutions.md). For information about how to configure agents for on-premises machines, see [Agents for on-premises machines](connection-monitor-overview.md#agents-for-on-premises-machines).
   
       Under **Create Connection Monitor**, on the **Basics** tab, the default region is selected. If you change the region, you can choose agents from workspaces in the new region. You can select one or more agents or subnets. In the **Subnet** view, you can select specific IPs for monitoring. If you add multiple subnets, a custom on-premises network named **OnPremises_Network_1** will be created. You can also change the **Group by** selector to group by agents.

      :::image type="content" source="./media/connection-monitor-2-preview/add-non-azure-sources.png" alt-text="Screenshot that shows the Add Sources pane and the Non-Azure endpoints tab in Connection Monitor.":::

   * To choose recently used endpoints, you can use the **Recent endpoint** tab 
   
   * You need not choose the endpoints with monitoring agents enabled only. You can select Azure or Non-Azure endpoints without the agent enabled and proceed with the creation of Connection Monitor. During the creation process, the monitoring agents for the endpoints will be automatically enabled. 
      :::image type="content" source="./media/connection-monitor-2-preview/unified-enablement.png" alt-text="Screenshot that shows the Add Sources pane and the Non-Azure endpoints tab in Connection Monitor with unified enablement.":::
   
   * When you finish setting up sources, select **Done** at the bottom of the tab. You can still edit basic properties like the endpoint name by selecting the endpoint in the **Create Test Group** view. 

* **Destinations**: You can monitor connectivity to an Azure VM, an on-premises machine, or any endpoint (a public IP, URL, or FQDN) by specifying it as a destination. In a single test group, you can add Azure VMs, on-premises machines, Office 365 URLs, Dynamics 365 URLs, and custom endpoints.

    * To choose Azure VMs as destinations, select the **Azure endpoints** tab. By default, the Azure VMs are grouped into a subscription hierarchy that's in the region that you selected under **Create Connection Monitor** on the **Basics** tab. You can change the region and choose Azure VMs from the new region. Then you can drill down from the **Subscription** level to other levels in the hierarchy, just as you can when you set the source Azure endpoints.

      You can select VNETs, subnets, or single VMs, as you can when you set the source Azure endpoints. When you select a VNET, subnet, or single VM, the corresponding resource ID is set as the endpoint. By default, all VMs in the selected VNET or subnet that have the Network Watcher extension participate in monitoring. To reduce the scope, either select specific subnets or agents or change the value of the scope property. 

      :::image type="content" source="./media/connection-monitor-2-preview/add-azure-dests1.png" alt-text="<Screenshot that shows the Add Destinations pane and the Azure endpoints tab.>":::

      :::image type="content" source="./media/connection-monitor-2-preview/add-azure-dests2.png" alt-text="<Screenshot that shows the Add Destinations pane at the Subscription level.>":::
       
    
    * To choose non-Azure agents as destinations, select the **Non-Azure endpoints** tab. By default, agents are grouped into workspaces by region. All these workspaces have Network Performance Monitor configured. 
    
      If you need to add Network Performance Monitor to your workspace, get it from Azure Marketplace. For information about how to add Network Performance Monitor, see [Monitoring solutions in Azure Monitor](../azure-monitor/insights/solutions.md). For information about how to configure agents for on-premises machines, see [Agents for on-premises machines](connection-monitor-overview.md#agents-for-on-premises-machines).

      Under **Create Connection Monitor**, on the **Basics** tab, the default region is selected. If you change the region, you can choose agents from workspaces in the new region. You can select one or more agents or subnets. In the **Subnet** view, you can select specific IPs for monitoring. If you add multiple subnets, a custom on-premises network named **OnPremises_Network_1** will be created.  

      :::image type="content" source="./media/connection-monitor-2-preview/add-non-azure-dest.png" alt-text="Screenshot that shows the Add Destinations pane and the Non-Azure endpoints tab.":::
	
    * To choose public endpoints as destinations, select the **External Addresses** tab. The list of endpoints includes Office 365 test URLs and Dynamics 365 test URLs, grouped by name. You also can choose endpoints that were created in other test groups in the same connection monitor. 
    
        To add an endpoint, in the upper-right corner, select **Add Endpoint**. Then provide an endpoint name and URL, IP, or FQDN.

       :::image type="content" source="./media/connection-monitor-2-preview/add-endpoints.png" alt-text="Screenshot that shows where to add public endpoints as destinations in Connection Monitor.":::

    * To choose recently used endpoints, go to the **Recent endpoint** tab.
    * When you finish choosing destinations, select **Done**. You can still edit basic properties like the endpoint name by selecting the endpoint in the **Create Test Group** view. 

* **Test configurations**: You can add one or more test configurations to a test group. Create a new test configuration by using the **New configuration** tab. Or add a test configuration from another test group in the same Connection Monitor from the **Choose existing** tab.

    * **Test configuration name**: Name the test configuration.
    * **Protocol**: Select **TCP**, **ICMP**, or **HTTP**. To change HTTP to HTTPS, select **HTTP** as the protocol and then select **443** as the port.
        * **Create TCP test configuration**: This check box appears only if you select **HTTP** in the **Protocol** list. Select this check box to create another test configuration that uses the same sources and destinations that you specified elsewhere in your configuration. The new test configuration is named **\<name of test configuration>_networkTestConfig**.
        * **Disable traceroute**: This check box applies when the protocol is TCP or ICMP. Select this box to stop sources from discovering topology and hop-by-hop RTT.
    * **Destination port**: You can provide a destination port of your choice.
    	* **Listen on port**: This check box applies when the protocol is TCP. Select this check box to open the chosen TCP port if it's not already open. 
    * **Test Frequency**: In this list, specify how frequently sources will ping destinations on the protocol and port that you specified. You can choose 30 seconds, 1 minute, 5 minutes, 15 minutes, or 30 minutes. Select **custom** to enter another frequency that's between 30 seconds and 30 minutes. Sources will test connectivity to destinations based on the value that you choose. For example, if you select 30 seconds, sources will check connectivity to the destination at least once every 30 seconds period.
    * **Success Threshold**: You can set thresholds on the following network parameters:
       * **Checks failed**: Set the percentage of checks that can fail when sources check connectivity to destinations by using the criteria that you specified. For the TCP or ICMP protocol, the percentage of failed checks can be equated to the percentage of packet loss. For HTTP protocol, this value represents the percentage of HTTP requests that received no response.
       * **Round trip time**: Set the RTT, in milliseconds, for how long sources can take to connect to the destination over the test configuration.
       
   :::image type="content" source="./media/connection-monitor-2-preview/add-test-config.png" alt-text="Screenshot that shows where to set up a test configuration in Connection Monitor.":::
       
* **Test Groups**: You can add one or more Test Groups to a Connection Monitor. These test groups can consist of multiple Azure or Non-Azure endpoints.
    * For selected Azure VMs or Azure virtual machine scale sets and Non-Azure endpoints without monitoring extensions, the extension for Azure VMs and the Network Performance Monitor solution for Non-Azure endpoints will be auto enablement once the creation of Connection Monitor begins.
    * In case the virtual machine scale set selected is set for manual upgradation, the user will have to upgrade the scale set post Network Watcher extension installation in order to continue setting up the Connection Monitor with the virtual machine scale set as endpoints. In case the virtual machine scale set is set to auto upgradation, the user need not worry about any upgradation after Network Watcher extension installation.
    * In the scenario mentioned above, user can consent to auto upgradation of the virtual machine scale set with auto enablement of Network Watcher extension during the creation of Connection Monitor for virtual machine scale sets with manual upgradation. This would eliminate the need for the user to manually upgrade the virtual machine scale set after installing the Network Watcher extension.   

   :::image type="content" source="./media/connection-monitor-2-preview/consent-vmss-auto-upgrade.png" alt-text="Screenshot that shows where to set up a test groups and consent for auto-upgradation of VMSS in Connection Monitor.":::

## Create alerts in Connection Monitor

You can set up alerts on tests that are failing based on the thresholds set in test configurations.

In the Azure portal, to create alerts for a connection monitor, you specify values for these fields: 

- **Create alert**: You can select this check box to create a metric alert in Azure Monitor. When you select this check box, the other fields will be enabled for editing. Additional charges for the alert will be applicable, based on the [pricing for alerts](https://azure.microsoft.com/pricing/details/monitor/). 

- **Scope** > **Resource** > **Hierarchy**: These values are automatically filled, based on the values specified on the **Basics** tab.

- **Condition name**: The alert is created on the `Test Result(preview)` metric. When the result of the connection monitor test is a failing result, the alert rule will fire. 

- **Action group name**: You can enter your email directly or you can create alerts via action groups. If you enter your email directly, an action group with the name **NPM Email ActionGroup** is created. The email ID is added to that action group. If you choose to use action groups, you need to select a previously created action group. To learn how to create an action group, see [Create action groups in the Azure portal](../azure-monitor/alerts/action-groups.md). After the alert is created, you can [manage your alerts](../azure-monitor/alerts/alerts-metric.md#view-and-manage-with-azure-portal). 

- **Alert rule name**: The name of the connection monitor.

- **Enable rule upon creation**: Select this check box to enable the alert rule based on the condition. Disable this check box if you want to create the rule without enabling it. 

:::image type="content" source="./media/connection-monitor-2-preview/unified-enablement-create.png" alt-text="Screenshot that shows the Create alert tab in Connection Monitor.":::

Once all the steps are completed, the process will proceed with the unified enablement of monitoring extensions for all endpoints without monitoring agents enabled, followed by creation of Connection Monitor. 
Once the creation process is successful, it will take ~ 5 mins for the connection monitor to show up on the dashboard.  

## Virtual machine scale set  coverage

Currently, Connection Monitor provides default coverage for the scale set instances selected as endpoints. What this means is, only a default % of all the scale set instances added would be randomly selected to monitor connectivity from the scale set to the endpoint. 
As a best practice, to avoid loss of data due to downscaling of instances, it is advised to select ALL instances in a scale set while creating a test group instead of selecting a particular few for monitoring your endpoints. 


## Scale limits

Connection monitors have these scale limits:

* Maximum connection monitors per subscription per region: 100
* Maximum test groups per connection monitor: 20
* Maximum sources and destinations per connection monitor: 100
* Maximum test configurations per connection monitor: 2 via the Azure portal

## Clean up resources

When no longer needed, delete the resource group and all of the resources it contains:

1. Enter *myResourceGroup* in the **Search** box at the top of the portal. When you see **myResourceGroup** in the search results, select it.
2. Select **Delete resource group**.
3. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

## Next steps

In this tutorial, you learned how to monitor a connection between a virtual machine scale set  and a VM. You learned that a network security group rule prevented communication to a VM. To learn about all of the different responses the connection monitor can return, see [response types](network-watcher-connectivity-overview.md#response). You can also monitor a connection between a VM, a fully qualified domain name, a uniform resource identifier, or an IP address.

* Learn [how to analyze monitoring data and set alerts](./connection-monitor-overview.md#analyze-monitoring-data-and-set-alerts).
* Learn [how to diagnose problems in your network](./connection-monitor-overview.md#diagnose-issues-in-your-network).



> [!div class="nextstepaction"]
> [Diagnose communication problems between networks](diagnose-communication-problem-between-networks.md)
