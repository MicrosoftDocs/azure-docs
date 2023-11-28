---
title: 'Tutorial: Azure DDoS Protection simulation testing'
description: Learn about how to test Azure DDoS Protection through simulations.
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: tutorial
ms.custom: ignite-2022
ms.workload: infrastructure-services
ms.date: 11/07/2023
ms.author: abell
---

# Tutorial: Azure DDoS Protection simulation testing

It’s a good practice to test your assumptions about how your services respond to an attack by conducting periodic simulations. During testing, validate that your services or applications continue to function as expected and there’s no disruption to the user experience. Identify gaps from both a technology and process standpoint and incorporate them in the DDoS response strategy. We recommend that you perform such tests in staging environments or during non-peak hours to minimize the impact to the production environment.

Simulations help you:
- Validate how Azure DDoS Protection helps protect your Azure resources from DDoS attacks.
- Optimize your incident response process while under DDoS attack.
- Document DDoS compliance.
- Train your network security teams.

## Azure DDoS simulation testing policy

You can only simulate attacks using our approved testing partners:
- [BreakingPoint Cloud](https://www.ixiacom.com/products/breakingpoint-cloud): a self-service traffic generator where your customers can generate traffic against DDoS Protection-enabled public endpoints for simulations. 
- [Red Button](https://www.red-button.net/): work with a dedicated team of experts to simulate real-world DDoS attack scenarios in a controlled environment.
- [RedWolf](https://www.redwolfsecurity.com/services/#cloud-ddos) a self-service or guided DDoS testing provider with real-time control.

Our testing partners' simulation environments are built within Azure. You can only simulate against Azure-hosted public IP addresses that belong to an Azure subscription of your own, which will be validated by our partners before testing. Additionally, these target public IP addresses must be protected under Azure DDoS Protection. Simulation testing allows you to assess your current state of readiness, identify gaps in your incident response procedures, and guide you in developing a proper [DDoS response strategy](ddos-response-strategy.md). 

> [!NOTE]
> BreakingPoint Cloud and Red Button are only available for the Public cloud.

For this tutorial, you'll create a test environment that includes:
- A DDoS protection plan
- A virtual network
- An Azure Bastion host 
- A load balancer 
- Two virtual machines

You'll then configure diagnostic logs and alerts to monitor for attacks and traffic patterns. Finally, you'll configure a DDoS attack simulation using one of our approved testing partners.

:::image type="content" source="./media/ddos-attack-simulation/ddos-protection-testing-architecture.png" alt-text="Diagram of the DDoS Protection test environment architecture.":::

## Prerequisites

- An Azure account with an active subscription.
- In order to use diagnostic logging, you must first create a [Log Analytics workspace with diagnostic settings enabled](ddos-configure-log-analytics-workspace.md).
- For this tutorial you'll need to deploy a Load Balancer, a public IP address, Bastion, and two virtual machines. For more information, see [Deploy Load Balancer with DDoS Protection](../load-balancer/tutorial-protect-load-balancer-ddos.md). You can skip the NAT Gateway step in the Deploy Load Balancer with DDoS Protection tutorial.


## Configure DDoS Protection metrics and alerts

In this tutorial, we'll configure DDoS Protection metrics and alerts to monitor for attacks and traffic patterns. 

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

BreakingPoint Cloud is a self-service traffic generator where you can generate traffic against DDoS Protection-enabled public endpoints for simulations. 

BreakingPoint Cloud offers:

- A simplified user interface and an “out-of-the-box” experience.
- Pay-per-use model.
- Predefined DDoS test sizing and test duration profiles enable safer validations by eliminating the potential of configuration errors.
- A free trail account. 

> [!NOTE]
> For BreakingPoint Cloud, you must first [create a BreakingPoint Cloud account](https://www.ixiacom.com/products/breakingpoint-cloud).  

Example attack values:

:::image type="content" source="./media/ddos-attack-simulation/ddos-attack-simulation-example-1.png" alt-text="DDoS Attack Simulation Example: BreakingPoint Cloud."::: 

|Setting        |Value                                              |
|---------      |---------                                          |
|Target IP address           | Enter one of your public IP address you want to test.                     |
|Port Number   | Enter _443_.                       |
|DDoS Profile | Possible values include `DNS Flood`, `NTPv2 Flood`, `SSDP Flood`, `TCP SYN Flood`, `UDP 64B Flood`, `UDP 128B Flood`, `UDP 256B Flood`, `UDP 512B Flood`, `UDP 1024B Flood`, `UDP 1514B Flood`, `UDP Fragmentation`, `UDP Memcached`.|
|Test Size       | Possible values include `100K pps, 50 Mbps and 4 source IPs`, `200K pps, 100 Mbps and 8 source IPs`, `400K pps, 200Mbps and 16 source IPs`, `800K pps, 400 Mbps and 32 source IPs`.                                  |
|Test Duration | Possible values include `10 Minutes`, `15 Minutes`, `20 Minutes`, `25 Minutes`, `30 Minutes`.|

> [!NOTE]
> - For more information on using BreakingPoint Cloud with your Azure environment, see this [BreakingPoint Cloud blog](https://www.keysight.com/blogs/tech/nwvs/2020/11/17/six-simple-steps-to-understand-how-microsoft-azure-ddos-protection-works).
> - For a video demonstration of utilizing BreakingPoint Cloud, see [DDoS Attack Simulation](https://www.youtube.com/watch?v=xFJS7RnX-Sw).


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

   - **Attack Vectors**: Unique cloud attacks designed by RedWolf. For more information about RedWolf attack vectors, see [Technical Details](https://www.redwolfsecurity.com/redwolf-technical-details/).
   - **Guided Service**: Leverage RedWolf's team to run tests. For more information about RedWolf's guided service, see [Guided Service](https://www.redwolfsecurity.com/managed-testing-explained/).
   - **Self Service**: Leverage RedWol to run tests yourself. For more information about RedWolf's self-service, see [Self Service](https://www.redwolfsecurity.com/self-serve-testing/).


## Next steps

To view attack metrics and alerts after an attack, continue to these next tutorials.

> [!div class="nextstepaction"]
> [View alerts in defender for cloud](ddos-view-alerts-defender-for-cloud.md)
> [View diagnostic logs in Log Analytic workspace](ddos-view-diagnostic-logs.md)
> [Engage with Azure DDoS Rapid Response](ddos-rapid-response.md)
