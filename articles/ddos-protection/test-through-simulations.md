---
title: 'Tutorial: Azure DDoS Protection simulation testing'
description: Learn about how to test Azure DDoS Protection through simulations.
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: tutorial
ms.custom: ignite-2022
ms.workload: infrastructure-services
ms.date: 10/06/2023
ms.author: abell
---

# Tutorial: Azure DDoS Protection simulation testing

It’s a good practice to test your assumptions about how your services will respond to an attack by conducting periodic simulations. During testing, validate that your services or applications continue to function as expected and there’s no disruption to the user experience. Identify gaps from both a technology and process standpoint and incorporate them in the DDoS response strategy. We recommend that you perform such tests in staging environments or during non-peak hours to minimize the impact to the production environment.

Simulations help you:
- Validate how Azure DDoS Protection helps protect your Azure resources from DDoS attacks.
- Optimize your incident response process while under DDoS attack.
- Document DDoS compliance.
- Train your network security teams.

## Azure DDoS simulation testing policy

You may only simulate attacks using our approved testing partners:
- [BreakingPoint Cloud](https://www.ixiacom.com/products/breakingpoint-cloud): a self-service traffic generator where your customers can generate traffic against DDoS Protection-enabled public endpoints for simulations. 
- [Red Button](https://www.red-button.net/): work with a dedicated team of experts to simulate real-world DDoS attack scenarios in a controlled environment.
- [RedWolf](https://www.redwolfsecurity.com/services/#cloud-ddos) a self-service or guided DDoS testing provider with real-time control.

Our testing partners' simulation environments are built within Azure. You can only simulate against Azure-hosted public IP addresses that belong to an Azure subscription of your own, which will be validated by our partners before testing. Additionally, these target public IP addresses must be protected under Azure DDoS Protection. Simulation testing allows you to assess your current state of readiness, identify gaps in your incident response procedures, and guide you in developing a proper [DDoS response strategy](ddos-response-strategy.md). 

> [!NOTE]
> BreakingPoint Cloud and Red Button are only available for the Public cloud.

## Prerequisites

- An Azure account with an active subscription.
- In order to use diagnostic logging, you must first create a [Log Analytics workspace with diagnostic settings enabled](ddos-configure-log-analytics-workspace.md).


## Prepare test environment
### Create a DDoS protection plan

1. Select **Create a resource** in the upper left corner of the Azure portal.
1. Search the term *DDoS*. When **DDoS protection plan** appears in the search results, select it.
1. Select **Create**.
1. Enter or select the following values.

    :::image type="content" source="./media/ddos-attack-simulation/create-ddos-plan.png" alt-text="Screenshot of creating a DDoS protection plan.":::

    |Setting        |Value                                              |
    |---------      |---------                                          |
    |Subscription   | Select your subscription.                         |
    |Resource group | Select **Create new** and enter **MyResourceGroup**.|
    |Name           | Enter **MyDDoSProtectionPlan**.                     |
    |Region         | Enter **East US**.                                  |

1. Select **Review + create** then **Create**

### Create the virtual network

In this section, you'll create a virtual network, subnet, Azure Bastion host, and associate the DDoS Protection plan. The virtual network and subnet contains the load balancer and virtual machines. The bastion host is used to securely manage the virtual machines and install IIS to test the load balancer. The DDoS Protection plan will protect all public IP resources in the virtual network.

> [!IMPORTANT]
> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]
>

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual Networks** in the search results.

1. In **Virtual networks**, select **+ Create**.

1. In **Create virtual network**, enter or select the following information in the **Basics** tab:

    | **Setting** | **Value** |
    |---|---|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **MyResourceGroup** |
    | **Instance details** |  |
    | Name | Enter **myVNet** |
    | Region | Select **East US** |

1. Select the **Security** tab.

1. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | Azure Bastion Public IP Address | Select **myvent-bastion-publicIpAddress**. Select **OK**. |

1. Under **DDoS Network Protection**, select **Enable**. Then from the drop-down menu, select **MyDDoSProtectionPlan**.

    :::image type="content" source="./media/ddos-attack-simulation/enable-ddos.png" alt-text="Screenshot of enabling DDoS during virtual network creation.":::

1. Select the **IP Addresses** tab or select **Next: IP Addresses** at the bottom of the page.

1. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

1. Under **Subnets**, select the word **default**. If a subnet isn't present, select **+ Add subnet**. 

1. In **Edit subnet**, enter this information, then select **Save**:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Name | Enter **myBackendSubnet** |
    | Starting Address | Enter **10.1.0.0/24** |

1. Under **Subnets**, select **AzureBastionSubnet**. In **Edit subnet**, enter this information,then select **Save**:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Starting Address | Enter **10.1.1.0/26** |

1. Select the **Review + create** tab or select the **Review + create** button, then select **Create**.
    
    > [!NOTE]
    > The virtual network and subnet are created immediately. The Bastion host creation is submitted as a job and will complete within 10 minutes. You can proceed to the next steps while the Bastion host is created.

### Create load balancer

In this section, you'll create a zone redundant load balancer that load balances virtual machines. With zone-redundancy, one or more availability zones can fail and the data path survives as long as one zone in the region remains healthy.

During the creation of the load balancer, you'll configure:

* Frontend IP address
* Backend pool
* Inbound load-balancing rules
* Health probe

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results. In the **Load balancer** page, select **+ Create**.

1. In the **Basics** tab of the **Create load balancer** page, enter or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **MyResourceGroup**. |
    | **Instance details** |   |
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **East US**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Type          | Select **Public**.                                        |
    | Tier          | Leave the default **Regional**. |

    :::image type="content" source="./media/ddos-attack-simulation/create-standard-load-balancer.png" alt-text="Screenshot of create standard load balancer basics tab." border="true":::

1. Select **Next: Frontend IP configuration** at the bottom of the page.

1. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**, then enter the following information. Leave the rest of the defaults and select **Add**.

    | Setting                 | Value                                              |
    | -----------------------| -------------------------------------------------- |
    | **Name**                | Enter **myFrontend**.                               |
    | **Subnet**          | Select your subnet. In this example our subnet is named *MyBackendSubnet*. |
    | **Availability zone** | Select **Zone-redundant**. |

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).


1. Select **Next: Backend pools** at the bottom of the page.

1. In the **Backend pools** tab, select **+ Add a backend pool**, then enter the following information. Leave the rest of the defaults and select **Save**.

    | Setting                 | Value                                              |
    | -----------------------| -------------------------------------------------- |
    | **Name**                | Enter **myBackendPool**.                               |
    | **Subnet**          | Select your subnet. In this example our subnet is named *MyBackendSubnet*. |
    | **Availability zone** | Select **Zone-redundant**. |
    | **Backend Pool Configuration** | Select **IP Address**. |
    

1. Select **Next: Inbound rules** at the bottom of the page.

1. Under **Load balancing rule** in the **Inbound rules** tab, select **+ Add a load balancing rule**.

1. In **Add load balancing rule**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule** |
    | IP Version | Select **IPv4** or **IPv6** depending on your requirements. |
    | Frontend IP address | Select **myFrontend (Dynamic)**. |
    | Backend pool | Select **myBackendPool**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **myHealthProbe**. </br> Select **TCP** in **Protocol**. </br> Leave the rest of the defaults, and select **OK**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or select **15**. |
    | TCP reset | Select the *Enabled* radio. |
    | Floating IP | Select the *Disabled* radio. |
 

1. Select **Save**.

1. Select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

### Create virtual machines

In this section, you'll create two virtual machines that will be load balanced by the load balancer. You'll also install IIS on the virtual machines to test the load balancer.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results. In the **Virtual machines** page, select **+ Create**.

1. In **Create a virtual machine**, enter or select the following values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **MyResourceGroup** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM1** |
    | Region | Select **((US) East US)** |
    | Availability Options | Select **Availability zones** |
    | Availability zone | Select **Zone 1** |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - Gen2** |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None** |

1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
1. In the Networking tab, select or enter the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |  |
    | Virtual network | Select **myVNet** |
    | Subnet | Select **myBackendSubnet** |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced** |
    | Configure network security group | Skip this setting until the rest of the settings are completed. Complete after **Select a backend pool**.|
    | Delete NIC when VM is deleted | Leave the default of **unselected**. |
    | Accelerated networking | Leave the default of **selected**. |
    | **Load balancing**  |
    | **Load balancing options** |
    | Load-balancing options | Select **Azure load balancer** |
    | Select a load balancer | Select **myLoadBalancer**  |
    | Select a backend pool | Select **myBackendPool** |
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **myNSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> Under  **Service**, select **HTTP**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **myNSGRule** </br> Select **Add** </br> Select **OK** |
   
6. Select **Review + create**. 
  
7. Review the settings, and then select **Create**.

8. Follow the steps 1 through 7 to create another VM with the following values and all the other settings the same as **myVM1**:

    | Setting | VM 2 
    | ------- | ----- |
    | Name |  **myVM2** |
    | Availability zone | **Zone 2** |
    | Network security group | Select the existing **myNSG** |

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

### Install IIS

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **myVM1**.

1. On the **Overview** page, select **Connect**, then **Bastion**.

1. Enter the username and password entered during VM creation.

1. Select **Connect**.

1. On the server desktop, navigate to **Start** > **Windows PowerShell** > **Windows PowerShell**.

1. In the PowerShell Window, run the following commands to:

    * Install the IIS server
    * Remove the default iisstart.htm file
    * Add a new iisstart.htm file that displays the name of the VM:

   ```powershell
    # Install IIS server role
    Install-WindowsFeature -name Web-Server -IncludeManagementTools
    
    # Remove default htm file
    Remove-Item  C:\inetpub\wwwroot\iisstart.htm
    
    # Add a new htm file that displays server name
    Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from " + $env:computername)
    
    ```

1. Close the Bastion session with **myVM1**.

1. Repeat steps 1 to 8 to install IIS and the updated iisstart.htm file on **myVM2**.

## Configure DDoS Protection metrics and alerts

Now we will configure metrics and alerts to monitor for attacks and traffic patterns.

### Configure diagnostic logs

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search box at the top of the portal, enter **Monitor**. Select **Monitor** in the search results.
1. Select **Diagnostic Settings** under **Settings** in the left pane, then select the following information in the **Diagnostic settings** page. Next, select **Add diagnostic setting**.

    :::image type="content" source="./media/ddos-attack-simulation/ddos-monitor-diagnostic-settings.png" alt-text="Screenshot of Monitor diagnostic settings.":::

    | Setting | Value |
    |--|--|
	|Subscription | Select the **Subscription** that contains the public IP address you want to log. |
    | Resource group | Select the **Resource group** that contains the public IP address you want to log. |
	|Resource type | Select **Public IP Addresses**.|
    |Resource | Select the specific **Public IP address** you want to log metrics for. |

1. On the *Diagnostic setting* page, under *Destination details*, select **Send to Log Analytics workspace**, then enter the following information, then select **Save**.

    :::image type="content" source="./media/ddos-attack-simulation/ddos-public-ip-diagnostic-setting.png" alt-text="Screenshot of DDoS diagnostic settings.":::

    | Setting | Value |
    |--|--|
    | Diagnostic setting name | Enter **myDiagnosticSettings**. |
    |**Logs**| Select **allLogs**.|
    |**Metrics**| Select **AllMetrics**. |
    |**Destination details**| Select **Send to Log Analytics workspace**.|
    | Subscription | Select your Azure subscription. |   
    | Log Analytics Workspace | Select **myLogAnalyticsWorkspace**. | 

### Configure metric alerts 


1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box at the top of the portal, enter **Alerts**. Select **Alerts** in the search results.

1. Select **+ Create** on the navigation bar, then select **Alert rule**.

    :::image type="content" source="./media/ddos-attack-simulation/ddos-protection-alert-page.png" alt-text="Screenshot of creating Alerts." lightbox="./media/ddos-attack-simulation/ddos-protection-alert-page.png":::

1. On the **Create an alert rule** page, select **+ Select scope**, then select the following information in the **Select a resource** page.

    :::image type="content" source="./media/ddos-attack-simulation/ddos-protection-alert-scope.png" alt-text="Screenshot of selecting DDoS Protection attack alert scope." lightbox="./media/ddos-attack-simulation/ddos-protection-alert-scope.png":::


    | Setting | Value |
    |--|--|
	|Filter by subscription | Select the **Subscription** that contains the public IP address you want to log. |
	|Filter by resource type | Select **Public IP Addresses**.|
    |Resource | Select the specific **Public IP address** you want to log metrics for. |

1. Select **Done**, then select **Next: Condition**.
1. On the **Condition** page, select **+ Add Condition**, then in the *Search by signal name* search box, search and select **Under DDoS attack or not**.

    :::image type="content" source="./media/ddos-attack-simulation/ddos-protection-alert-add-condition.png" alt-text="Screenshot of adding DDoS Protection attack alert condition." lightbox="./media/ddos-attack-simulation/ddos-protection-alert-add-condition.png":::

1. In the **Create an alert rule** page, enter or select the following information. 
  :::image type="content" source="./media/ddos-attack-simulation/ddos-protection-alert-signal.png" alt-text="Screenshot of adding DDoS Protection attack alert signal." lightbox="./media/ddos-attack-simulation/ddos-protection-alert-signal.png":::

    | Setting | Value |
    |--|--|
    | Threshold | Leave as default. |
    | Aggregation type | Leave as default. |
    | Operator | Select **Greater than or equal to**. |
    | Unit | Leave as default. |
    | Threshold value | Enter **1**. For the *Under DDoS attack or not metric*, **0** means you're not under attack while **1** means you are under attack. |

  

1. Select **Next: Actions** then select **+ Create action group**.

#### Create action group

1. In the **Create action group** page, enter the following information, then select **Next: Notifications**.
:::image type="content" source="./media/ddos-attack-simulation/ddos-protection-alert-action-group-basics.png" alt-text="Screenshot of adding DDoS Protection attack alert action group basics." lightbox="./media/ddos-attack-simulation/ddos-protection-alert-action-group-basics.png":::

    | Setting | Value |
    |--|--|
    | Subscription | Select your Azure subscription that contains the public IP address you want to log. |   
    | Resource Group | Select your Resource group. |
    | Region | Leave as default. |
    | Action Group | Enter **myDDoSAlertsActionGroup**. |
    | Display name | Enter **myDDoSAlerts**. |

    
1. On the *Notifications* tab, under *Notification type*, select **Email/SMS message/Push/Voice**. Under *Name*, enter **myUnderAttackEmailAlert**.

    :::image type="content" source="./media/ddos-attack-simulation/ddos-protection-alert-action-group-notification.png" alt-text="Screenshot of adding DDoS Protection attack alert notification type." lightbox="./media/ddos-attack-simulation/ddos-protection-alert-action-group-notification.png":::


1. On the *Email/SMS message/Push/Voice* page, select the **Email** check box, then enter the required email. Select **OK**.

    :::image type="content" source="./media/ddos-attack-simulation/ddos-protection-alert-notification.png" alt-text="Screenshot of adding DDoS Protection attack alert notification page." lightbox="./media/ddos-attack-simulation/ddos-protection-alert-notification.png":::

1. Select **Review + create** and then select **Create**.
1. 
#### Continue configuring alerts through portal

1. Select **Next: Details**. 

     :::image type="content" source="./media/ddos-attack-simulation/ddos-protection-alert-details.png" alt-text="Screenshot of adding DDoS Protection attack alert details page." lightbox="./media/ddos-attack-simulation/ddos-protection-alert-details.png":::

1. On the *Details* tab, under *Alert rule details*, enter the following information. 

    | Setting | Value |
    |--|--|
    | Severity | Select **2 - Warning**. |   
    | Alert rule name | Enter **myDDoSAlert**. |

1. Select **Review + create** and then select **Create** after validation passes.

## Configure a DDoS attack simulation

### BreakingPoint Cloud


1. For BreakingPoint Cloud, you must first [create an account](https://www.ixiacom.com/products/breakingpoint-cloud). 

1. Example values:

    :::image type="content" source="./media/ddos-attack-simulation/ddos-attack-simulation-example-1.png" alt-text="DDoS Attack Simulation Example: BreakingPoint Cloud."::: 

    |Setting        |Value                                              |
    |---------      |---------                                          |
    |Target IP address           | Enter one of your public IP address you want to test.                     |
    |Port Number   | Enter _443_.                       |
    |DDoS Profile | Possible values include `DNS Flood`, `NTPv2 Flood`, `SSDP Flood`, `TCP SYN Flood`, `UDP 64B Flood`, `UDP 128B Flood`, `UDP 256B Flood`, `UDP 512B Flood`, `UDP 1024B Flood`, `UDP 1514B Flood`, `UDP Fragmentation`, `UDP Memcached`.|
    |Test Size       | Possible values include `100K pps, 50 Mbps and 4 source IPs`, `200K pps, 100 Mbps and 8 source IPs`, `400K pps, 200Mbps and 16 source IPs`, `800K pps, 400 Mbps and 32 source IPs`.                                  |
    |Test Duration | Possible values include `10 Minutes`, `15 Minutes`, `20 Minutes`, `25 Minutes`, `30 Minutes`.|


For more information on using BreakingPoint Cloud with your Azure environment, see this [BreakingPoint Cloud blog](https://www.keysight.com/blogs/tech/nwvs/2020/11/17/six-simple-steps-to-understand-how-microsoft-azure-ddos-protection-works).





### Red Button

Red Button’s [DDoS Testing](https://www.red-button.net/ddos-testing/) service suite includes three stages:

1. **Planning session**: Red Button experts meet with your team to understand your network architecture, assemble technical details, and define clear goals and testing schedules. This includes planning the DDoS test scope and targets, attack vectors, and attack rates. The joint planning effort is detailed in a test plan document.
1. **Controlled DDoS attack**: Based on the defined goals, the Red Button team launches a combination of multi-vector DDoS attacks. The test typically lasts between three to six hours. Attacks are securely executed using dedicated servers and are controlled and monitored using Red Button’s management console.
1. **Summary and recommendations**: The Red Button team provides you with a written DDoS Test Report outlining the effectiveness of DDoS mitigation. The report includes an executive summary of the test results, a complete log of the simulation, a list of vulnerabilities within your infrastructure, and recommendations on how to correct them.

Here's an example of a [DDoS Test Report](https://www.red-button.net/wp-content/uploads/2021/06/DDoS-Test-Report-Example-with-Analysis.pdf) from Red Button:

:::image type="content" source="./media/ddos-attack-simulation/red-button-test-report-example.png" alt-text="DDoS Test Report Example."::: 

In addition, Red Button offers two other service suites, [DDoS 360](https://www.red-button.net/prevent-ddos-attacks-with-ddos360/) and [DDoS Incident Response](https://www.red-button.net/ddos-incident-response/), that can complement the DDoS Testing service suite.

## RedWolf

RedWolf offers an easy-to-use testing system that is either self-serve or guided by RedWolf experts. RedWolf testing system allows customers to set up attack vectors. Customers can specify attack sizes with real-time control on settings to simulate real-world DDoS attack scenarios in a controlled environment.

RedWolf's [DDoS Testing](https://www.redwolfsecurity.com/services/) service suite includes:

   - **Attack Vectors**: Unique cloud attacks designed by RedWolf.
   - **Guided and self service**: Leverage RedWolf's team or run tests yourself.



To view attack metrics and alerts, continue to these next tutorials.

> [!div class="nextstepaction"]
> [View alerts in defender for cloud](ddos-view-alerts-defender-for-cloud.md)
> [View diagnostic logs in Log Analytic workspace](ddos-view-diagnostic-logs.md)
> [Engage with Azure DDoS Rapid Response](ddos-rapid-response.md)
