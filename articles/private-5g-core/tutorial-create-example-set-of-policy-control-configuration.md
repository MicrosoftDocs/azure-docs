---
title: Tutorial - Configure policy control
titleSuffix: Azure Private 5G Core
description: In this tutorial, you'll create an example policy control configuration set with traffic handling for common scenarios. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: tutorial 
ms.date: 01/16/2022
ms.custom: template-tutorial
---

# Tutorial: Create an example policy control configuration set for Azure Private 5G Core

Azure Private 5G Core provides flexible traffic handling. You can customize how your packet core instance applies quality of service (QoS) characteristics to traffic to meet its needs. You can also block or limit certain flows. This tutorial takes you through the steps of creating services and SIM policies for common use cases, and then provisioning SIMs to use the new policy control configuration.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
>
> * Create a new service that filters packets based on their protocol.
> * Create a new service that blocks traffic labeled with specific remote IP addresses and ports.
> * Create a new service that limits the bandwidth of traffic on matching flows.
> * Create two new SIM policies and assign services to them.
> * Provision two new SIMs and assign them SIM policies.

## Prerequisites

* Read the information in [Policy control](policy-control.md) and familiarize yourself with Azure Private 5G Core policy control configuration.
* Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
* Identify the name of the Mobile Network resource corresponding to your private mobile network.
* Identify the name of the Slice resource corresponding to your network slice.
  * If you want to assign a policy to a 5G SIM, you can choose any slice.
  * If you want to assign a policy to a 4G SIM, you must choose the slice configured with slice/service type (SST) value of 1 and an empty slice differentiator (SD).

## Create a service for protocol filtering

In this step, we'll create a service that filters packets based on their protocol. Specifically, it'll do the following:

* Block ICMP packets flowing away from UEs.
* Block UDP packets flowing away from UEs on port 11.
* Allow all other ICMP and UDP traffic in both directions, but no other IP traffic.

To create the service:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the Mobile Network resource representing your private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal showing the results for a search for a Mobile Network resource.":::

1. In the **Resource** menu, select **Services**.

    :::image type="content" source="media/configure-service-azure-portal/services-resource-menu-option.png" alt-text="Screenshot of the Azure portal showing the Services option in the resource menu of a Mobile Network resource.":::

1. In the **Command** bar, select **Create**.

    :::image type="content" source="media/configure-service-azure-portal/create-command-bar-option.png" alt-text="Screenshot of the Azure portal showing the Create option in the command bar.":::

1. We'll now enter values to define the QoS characteristics that will be applied to service data flows (SDFs) that match this service. On the **Basics** tab, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Service name**     |`service_restricted_udp_and_icmp`         |
    |**Service precedence**     | `100`        |
    |**Maximum bit rate (MBR) - Uplink**     | `2 Gbps`        |
    |**Maximum bit rate (MBR) - Downlink**     | `2 Gbps`        |
    |**Allocation and Retention Priority level**     | `2`        |
    |**5QI/QCI**     | `9`        |
    |**Preemption capability**     | Select **May not preempt**.        |
    |**Preemption vulnerability**     | Select **Not preemptible**.        |

1. Under **Data flow policy rules**, select **Add a policy rule**.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/example-protocol-filtering-service-without-rules.png" alt-text="Screenshot of the Azure portal showing the Create a service screen with protocol filtering configuration. The Add a policy rule button is highlighted.":::

1. We'll now create a data flow policy rule that blocks any packets that match the data flow template we'll configure in the next step. Under **Add a policy rule** on the right, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Rule name**     |`rule_block_icmp_and_udp_uplink_traffic`         |
    |**Policy rule precedence**     | Select **10**.        |
    |**Allow traffic**     | Select **Blocked**.        |

1. We'll now create a data flow template that matches on ICMP packets flowing away from UEs, so that they can be blocked by the `rule_block_icmp_uplink_traffic` rule.
    Under **Data flow templates**, select **Add a data flow template**. In the **Add a data flow template** pop-up, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Template name**     |`icmp_uplink_traffic`         |
    |**Protocols**     | Select **ICMP**.        |
    |**Direction**     | Select **Uplink**.        |
    |**Remote IPs**     | `any`        |
    |**Ports**     | Leave blank.        |

1. Select **Add**.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/add-a-data-flow-template.png" alt-text="Screenshot of the Azure portal. The Add a data flow template pop-up is shown and the Add button is highlighted.":::

1. Let's create another data flow template for the same rule that matches on UDP packets flowing away from UEs on port 11. 

    Under **Data flow templates**, select **Add a data flow template**. In the **Add a data flow template** pop-up, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Template name**     |`udp_uplink_traffic_port_11`         |
    |**Protocols**     | Select **UDP**.        |
    |**Direction**     | Select **Uplink**.        |
    |**Remote IPs**     | `any`        |
    |**Ports**     | `11`        |

1. Select **Add**.
1. We can now finalize the rule. Under **Add a policy rule**, select **Add**.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/protocol-filtering-rule-configuration.png" alt-text="Screenshot of the Azure portal. The Add a policy rule screen is shown with protocol filtering configuration and the Add button is highlighted.":::

1. Finally, we'll create a data policy flow rule that allows all other ICMP and UDP traffic.

    Select **Add a policy rule** and then fill out the fields under **Add a policy rule** on the right as follows.

    |Field  |Value  |
    |---------|---------|
    |**Rule name**     |`rule_allow_other_icmp_and_udp_traffic`         |
    |**Policy rule precedence**     | Select **15**.        |
    |**Allow traffic**     | Select **Enabled**.        |

1. We're now back at the **Create a service** screen. We'll create a data flow template that matches on all ICMP and UDP in both directions.

    Under **Data flow policy rules**, select **Add a data flow template**. In the **Add a data flow template** pop-up, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Template name**     |`icmp_and_udp_traffic`         |
    |**Protocols**     | Select both the **UDP** and **ICMP** checkboxes.        |
    |**Direction**     | Select **Bidirectional**.        |
    |**Remote IPs**     | `any`        |
    |**Ports**     | Leave blank.        |

1. Select **Add**.
1. We can now finalize the rule. Under **Add a policy rule**, select **Add**.
1. We now have two configured data flow policy rules on the service, which are displayed under the **Data flow policy rules** heading. 

    Note that the `rule_block_icmp_and_udp_uplink_traffic` rule has a lower value for the **Policy rule** precedence field than the `rule_allow_other_icmp_and_udp_traffic` rule (10 and 15 respectively). Rules with lower values are given higher priority. This ensures that the `rule_block_icmp_and_udp_uplink_traffic` rule to block packets is applied first, before the wider `rule_allow_other_icmp_and_udp_traffic` is applied to all remaining packets.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/example-protocol-filtering-service.png" alt-text="Screenshot of the Azure portal. It shows the Create a service screen with all fields correctly filled out and two data flow policy rules.":::

1. On the **Basics** configuration tab, select **Review + create**.
1. Select **Create** to create the service.
 
    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/create-example-protocol-filtering-service.png" alt-text="Screenshot of the Azure portal. It shows the Review and create tab with complete configuration for a service for protocol filtering.":::

1. The Azure portal will display the following confirmation screen when the service has been created. Select **Go to resource** to see the new service resource.

    :::image type="content" source="media/configure-service-azure-portal/service-resource-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing the successful deployment of a service for protocol filtering and the Go to resource button.":::

1. Confirm that the QoS characteristics, data flow policy rules, and service data flow templates listed at the bottom of the screen are configured as expected.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/example-protocol-filtering-service-complete.png" alt-text="Screenshot of the Azure portal. It shows a Service resource, with configured QoS characteristics and data flow policy rules highlighted." lightbox="media/tutorial-create-example-set-of-policy-control-configuration/example-protocol-filtering-service-complete.png":::

## Create a service for blocking traffic from specific sources

In this step, we'll create a service that blocks traffic from specific sources. Specifically, it'll do the following:

* Block UDP packets labeled with the remote address 10.204.141.200 and port 12 flowing towards UEs.
* Block UDP packets labeled with any remote address in the range 10.204.141.0/24 and port 15 flowing in both directions

To create the service:

1. Search for and select the Mobile Network resource representing your private mobile network.
1. In the **Resource** menu, select **Services**.
1. In the **Command** bar, select **Create**.
1. We'll now enter values to define the QoS characteristics that will be applied to SDFs that match this service. On the **Basics** tab, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Service name**     |`service_blocking_udp_from_specific_sources`         |
    |**Service precedence**     | `150`        |
    |**Maximum bit rate (MBR) - Uplink**     | `2 Gbps`        |
    |**Maximum bit rate (MBR) - Downlink**     | `2 Gbps`        |
    |**Allocation and Retention Priority level**     | `2`        |
    |**5QI/QCI**     | `9`        |
    |**Preemption capability**     | Select **May not preempt**.        |
    |**Preemption vulnerability**     | Select **Not preemptible**.        |

1. Under **Data flow policy rules**, select **Add a policy rule**.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/example-traffic-blocking-service-without-rules.png" alt-text="Screenshot of the Azure portal showing the Create a service screen with traffic blocking configuration. The Add a policy rule button is highlighted.":::

1. We'll now create a data flow policy rule that blocks any packets that match the data flow template we'll configure in the next step. Under **Add a policy rule** on the right, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Rule name**     |`rule_block_udp_from_specific_sources`         |
    |**Policy rule precedence**     | Select **11**.        |
    |**Allow traffic**     | Select **Blocked**.        |

1. Next, we'll create a data flow template that matches on UDP packets flowing towards UEs from 10.204.141.200 on port 12, so that they can be blocked by the `rule_block_udp_from_specific_sources` rule.

    Under **Data flow templates**, select **Add a data flow template**. In the **Add a data flow template** pop-up, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Template name**     |`udp_downlink_traffic`         |
    |**Protocols**     | Select **UDP**.        |
    |**Direction**     | Select **Downlink**.        |
    |**Remote IPs**     | `10.204.141.200/32`        |
    |**Ports**     | `12`        |

1. Select **Add**.
1. Finally, we'll create another data flow template for the same rule that matches on UDP packets flowing in either direction that are labeled with any remote address in the range 10.204.141.0/24 and port 15.

    Under **Data flow templates**, select **Add a data flow template**. In the **Add a data flow template** pop-up, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Template name**     |`udp_bidirectional_traffic`         |
    |**Protocols**     | Select **UDP**.        |
    |**Direction**     | Select **Bidirectional**.        |
    |**Remote IPs**     | `10.204.141.0/24`        |
    |**Ports**     | `15`        |

1. Select **Add**.
1. We can now finalize the rule. Under **Add a policy rule**, select **Add**.


    :::image type="complex" source="media/tutorial-create-example-set-of-policy-control-configuration/example-udp-blocking-rule.png" alt-text="Screenshot of the Azure portal. It shows the Add a policy rule screen with configuration for a rule to block certain UDP traffic.":::
    Screenshot of the Azure portal. It shows the Add a policy rule screen with all fields correctly filled out for a rule to block certain UDP traffic. It includes two configured data flow templates. The first matches on UDP packets flowing towards UEs from 10.204.141.200 on port 12. The second matches on UDP packets flowing in either direction that are labeled with any remote address in the range 10.204.141.0/24 and port 15. The Add button is highlighted.
    :::image-end:::

1. We now have a single data flow policy rule on the service for blocking UDP traffic. This is displayed under the **Data flow policy rules** heading.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/example-traffic-blocking-service.png" alt-text="Screenshot of the Azure portal. It shows completed fields for a service to block UDP from specific sources, including data flow policy rules.":::  

1. On the **Basics** configuration tab, select **Review + create**.
1. Select **Create** to create the service.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/create-example-traffic-blocking-service.png" alt-text="Screenshot of the Azure portal. It shows the Review and create tab with complete configuration for a service for traffic blocking.":::

1. The Azure portal will display the following confirmation screen when the service has been created. Select **Go to resource** to see the new service resource.

     :::image type="content" source="media/configure-service-azure-portal/service-resource-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing the successful deployment of a service for traffic blocking and the Go to resource button.":::

1. Confirm that the data flow policy rules and service data flow templates listed at the bottom of the screen are configured as expected.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/example-traffic-blocking-service-complete.png" alt-text="Screenshot showing a service resource with configuration for traffic blocking. QoS characteristics and data flow policy rules are highlighted." lightbox="media/tutorial-create-example-set-of-policy-control-configuration/example-traffic-blocking-service-complete.png":::

## Create a service for limiting traffic

In this step, we'll create a service that limits the bandwidth of traffic on matching flows. Specifically, it'll do the following:

* Limit the maximum bit rate (MBR) for packets flowing away from UEs to 10 Mbps.
* Limit the maximum bit rate (MBR) for packets flowing towards UEs to 15 Mbps.

To create the service:

1. Search for and select the Mobile Network resource representing your private mobile network.
1. In the **Resource** menu, select **Services**.
1. In the **Command** bar, select **Create**.
1. We'll now enter values to define the QoS characteristics that will be applied to SDFs that match this service. We'll use the **Maximum bit rate (MBR) - Uplink** and **Maximum bit rate (MBR) - Downlink** fields to set our bandwidth limits. On the **Basics** tab, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Service name**     |`service_traffic_limits`         |
    |**Service precedence**     | `250`        |
    |**Maximum bit rate (MBR) - Uplink**     | `10 Mbps`        |
    |**Maximum bit rate (MBR) - Downlink**     | `15 Mbps`        |
    |**Allocation and Retention Priority level**     | `2`        |
    |**5QI/QCI**     | `9`        |
    |**Preemption capability**     | Select **May not preempt**.        |
    |**Preemption vulnerability**     | Select **Preemptible**.        |

1. Under **Data flow policy rules**, select **Add a policy rule**.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/example-traffic-limiting-service-without-rules.png" alt-text="Screenshot of the Azure portal showing the Create a service screen with traffic limiting configuration. The Add a policy rule button is highlighted.":::

1. Under **Add a policy rule** on the right, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Rule name**     |`rule_bidirectional_limits`         |
    |**Policy rule precedence**     | Select **22**.        |
    |**Allow traffic**     | Select **Enabled**.        |

1. We'll now create a data flow template that matches on all IP traffic in both directions.

    Select **Add a data flow template**. In the **Add a data flow template** pop-up, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Template name**     |`ip_traffic`         |
    |**Protocols**     | Select **All**.        |
    |**Direction**     | Select **Bidirectional**.        |
    |**Remote IPs**     | `any`        |
    |**Ports**     | Leave blank        |

1. Select **Add**.
1. We can now finalize the rule. Under **Add a policy rule**, select **Add**.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/traffic-limiting-rule-configuration.png" alt-text="Screenshot of the Azure portal. The Add a policy rule screen is shown with traffic limiting configuration and the Add button is highlighted.":::

1. We now have a single data flow policy rule configured on the service.

     :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/example-traffic-limiting-service.png" alt-text="Screenshot of the Azure portal. It shows completed fields for a service to limit traffic, including data flow policy rules.":::

1. On the **Basics** configuration tab, select **Review + create**.
1. Select **Create** to create the service.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/create-example-traffic-limiting-service.png" alt-text="Screenshot of the Azure portal. It shows the Review and create tab with complete configuration for a service. The Create button is highlighted.":::

1. The Azure portal will display the following confirmation screen when the service has been created. Select **Go to resource** to see the new service resource.

     :::image type="content" source="media/configure-service-azure-portal/service-resource-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing the successful deployment of a service resource and the Go to resource button.":::

1. Confirm that the data flow policy rules and service data flow templates listed at the bottom of the screen are configured as expected.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/example-traffic-limiting-service-complete.png" alt-text="Screenshot showing a service designed for traffic limiting. QoS characteristics and data flow policy rules are highlighted." lightbox="media/tutorial-create-example-set-of-policy-control-configuration/example-traffic-limiting-service-complete.png":::

## Configure SIM policies

In this step, we'll create two SIM policies. The first SIM policy will use the service we created in [Create a service for protocol filtering](#create-a-service-for-protocol-filtering), and the second will use the service we created in [Create a service for blocking traffic from specific sources](#create-a-service-for-blocking-traffic-from-specific-sources). Both SIM policies will use the third service we created in [Create a service for limiting traffic](#create-a-service-for-limiting-traffic).

> [!NOTE]
> As each SIM policy will have multiple services, there will be packets that match more than one rule across these services. For example, downlink ICMP packets will match on the following rules:
> - The `rule_allow_other_icmp_and_udp_traffic` rule on the `service_restricted_udp_and_icmp` service.
> - The `rule_bidirectional_limits` rule on the `service_traffic_limits` service. 
>
> In this case, the packet core instance will prioritize the service with the lowest value for the **Service precedence** field. It will then apply the QoS characteristics from this service to the packets. In the example above, the `service_restricted_udp_and_icmp` service has a lower value (100) than the `service_traffic_limits` service (250). The packet core instance will therefore apply the QoS characteristics given on the `service_restricted_udp_and_icmp` service to downlink ICMP packets.

Let's create the SIM policies.

1. Search for and select the Mobile Network resource representing your private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal showing the results for a search for a Mobile Network resource.":::

1. In the **Resource** menu, select **SIM policies**.

    :::image type="content" source="media/configure-sim-policy-azure-portal/sim-policies-resource-menu-option.png" alt-text="Screenshot of the Azure portal showing the SIM policies option in the resource menu of a Mobile Network resource.":::

1. In the **Command** bar, select **Create**.
1. Under **Create a SIM policy**, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Policy name**     |`sim-policy-1`         |
    |**Total bandwidth allowed - Uplink**     | `10 Gbps`        |
    |**Total bandwidth allowed - Downlink**     | `10 Gbps` |
    |**Default slice**     | Select the name of your network slice.        |
    |**Registration timer**     | `3240`        |
    |**RFSP index**     | `2`        |  

1. Select **Add a network scope**.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/example-sim-policy-add-network-scope-option.png" alt-text="Screenshot of the Azure portal showing the Create a SIM policy screen. The Add a network scope option is highlighted.":::    
    
1. Under **Add a network scope**, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Slice**     | Select the **Default** slice.         |
    |**Data network**     | Select any data network to which your private mobile network connects.        |
    |**Service configuration**     | Select **service_restricted_udp_and_icmp** and **service_traffic_limits**. |
    |**Session aggregate maximum bit rate - Uplink**     | `2 Gbps`        |
    |**Session aggregate maximum bit rate - Downlink**     | `2 Gbps`        |
    |**5QI/QCI**     | `9`        |
    |**Allocation and Retention Priority level**     | `9`        |
    |**Preemption capability**     | Select **May not preempt**.        |
    |**Preemption vulnerability**     | Select **Preemptible**.        |
    |**Default session type**     | Select **IPv4**.        |

1. Select **Add**.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/add-a-network-scope.png" alt-text="Screenshot of the Azure portal showing the Add a network scope screen. The Add option is highlighted.":::    

1. On the **Basics** configuration tab, select **Review + create**.
1. On the **Review + create** tab, select **Review + create**.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/create-example-sim-policy.png" alt-text="Screenshot of the Azure portal showing the Review and create tab for a SIM policy. The Review and create option is highlighted.":::

1. The Azure portal will display the following confirmation screen when the SIM policy has been created.

    :::image type="content" source="media/configure-sim-policy-azure-portal/sim-policy-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing confirmation of the successful deployment of a SIM policy.":::

1. Select **Go to resource group**.
1. In the **Resource group** that appears, select the **Mobile Network** resource representing your private mobile network.
1. In the **Resource** menu, select **SIM policies**.

    :::image type="content" source="media/configure-sim-policy-azure-portal/sim-policies-resource-menu-option.png" alt-text="Screenshot of the Azure portal showing the SIM policies option in the resource menu of a Mobile Network resource.":::

1. Select **sim-policy-1**.

    :::image type="content" source="media/sim-policies-list.png" alt-text="Screenshot of the Azure portal with a list of configured SIM policies for a private mobile network. The sim-policy-1 resource is highlighted." lightbox="media/sim-policies-list.png":::

1. Check that the configuration for the SIM policy is as expected.

    - The top level settings for the SIM policy are shown under the **Essentials** heading.
    - The network scope configuration is shown under the **Network scope** heading including configured services under **Service configuration** and quality of service configuration under **Quality of Service (QoS)**.
    
    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/complete-example-sim-policy-1.png" alt-text="Screenshot of the Azure portal showing the first SIM policy resource. Essentials, network scope, and service configuration are highlighted." lightbox="media/tutorial-create-example-set-of-policy-control-configuration/complete-example-sim-policy-1.png":::

1. We'll now create the other SIM policy. Search for and select the Mobile Network resource representing the private mobile network for which you want to configure a service.
1. In the **Resource** menu, select **SIM policies**.
1. In the **Command** bar, select **Create**.
1. Under **Create a SIM policy** on the right, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Policy name**     |`sim-policy-2`         |
    |**Total bandwidth allowed - Uplink**     | `10 Gbps`        |
    |**Total bandwidth allowed - Downlink**     | `10 Gbps` |
    |**Default slice**     | Select the name of your network slice.         |
    |**Registration timer**     | `3240`        |
    |**RFSP index**     | `2`        |

1. Select **Add a network scope**.
1. On the **Add a network scope** blade, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Slice**     | Select the **Default** slice.         |
    |**Data network**     | Select any data network to which your private mobile network connects.        |
    |**Service configuration**     | Select **service_blocking_udp_from_specific_sources** and **service_traffic_limits**. |
    |**Session aggregate maximum bit rate - Uplink**     | `2 Gbps`        |
    |**Session aggregate maximum bit rate - Downlink**     | `2 Gbps`        |
    |**5QI/QCI**     | `9`        |
    |**Allocation and Retention Priority level**     | `9`        |
    |**Preemption capability**     | Select **May not preempt**.        |
    |**Preemption vulnerability**     | Select **Preemptible**.        |
    |**Default session type**     | Select **IPv4**.        |

1. Select **Add**.
1. On the **Basics** configuration tab, select **Review + create**.
1. On the **Review + create** configuration tab, select **Review + create**.
1. The Azure portal will display the following confirmation screen when the SIM policy has been created.

    :::image type="content" source="media/configure-sim-policy-azure-portal/sim-policy-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing confirmation of the successful deployment of a SIM policy.":::

1. Select **Go to resource group**.
1. In the **Resource group** that appears, select the **Mobile Network** resource representing your private mobile network.
1. In the **Resource** menu, select **SIM policies**.
1. Select **sim-policy-2**.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/sim-policies-list-example-2.png" alt-text="Screenshot of the Azure portal with a list of configured SIM policies for a private mobile network. The sim-policy-2 resource is highlighted." lightbox="media/tutorial-create-example-set-of-policy-control-configuration/sim-policies-list-example-2.png":::

1. Check that the configuration for the SIM policy is as expected.

    - The top level settings for the SIM policy are shown under the **Essentials** heading.
    - The network scope configuration is shown under the **Network scope** heading including configured services under **Service configuration** and quality of service configuration under **Quality of Service (QoS)**.
    
    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/complete-example-sim-policy-2.png" alt-text="Screenshot of the Azure portal showing the second SIM policy resource. Essentials, network scope, and service configuration are highlighted." lightbox="media/tutorial-create-example-set-of-policy-control-configuration/complete-example-sim-policy-2.png":::

## Provision SIMs

In this step, we will provision two SIMs and assign a SIM policy to each one. This will allow the SIMs to connect to the private mobile network and receive the correct QoS policy.

1. Save the following content as a JSON file and make a note of the filepath.
    ```json
    [
     {
      "simName": "SIM1",
      "integratedCircuitCardIdentifier": "8912345678901234566",
      "internationalMobileSubscriberIdentity": "001019990010001",
      "authenticationKey": "00112233445566778899AABBCCDDEEFF",
      "operatorKeyCode": "63bfa50ee6523365ff14c1f45f88737d",
      "deviceType": "Cellphone"
     },
     {
      "simName": "SIM2",
      "integratedCircuitCardIdentifier": "8922345678901234567",
      "internationalMobileSubscriberIdentity": "001019990010002",
      "authenticationKey": "11112233445566778899AABBCCDDEEFF",
      "operatorKeyCode": "63bfa50ee6523365ff14c1f45f88738d",
      "deviceType": "Sensor"
     }
    ]
    ```
1. Search for and select the Mobile Network resource representing your private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal showing the results for a search for a Mobile Network resource.":::

1. Select **Manage SIMs**.

    :::image type="content" source="media/provision-sims-azure-portal/view-sims.png" alt-text="Screenshot of the Azure portal showing the View SIMs button on a Mobile Network resource.":::

1. Select **Create** and then **Upload JSON from file**.

    :::image type="content" source="media/provision-sims-azure-portal/create-new-sim.png" alt-text="Screenshot of the Azure portal showing the Create button and its options - Upload JSON from file and Add manually.":::

1. Select **Plaintext** as the file type.
1. Select **Browse** and then select the JSON file you created at the start of this step.
1. Under **SIM group name**, select **Create new** and then enter **SIMGroup1** into the field that appears.
1. Select **Add**.
1. The Azure portal will now begin deploying the SIM group and SIMs. When the deployment is complete, select **Go to resource group**.

    :::image type="content" source="media/provision-sims-azure-portal/multiple-sim-resource-deployment.png" alt-text="Screenshot of the Azure portal showing a completed deployment of SIM group and SIM resources through a J S O N file. The Go to resource button is highlighted.":::

1. In the **Resource group** that appears, select the **SIMGroup1** resource you've just created. You'll then see your new SIMs in the SIM group.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/sims-list.png" alt-text="Screenshot of the Azure portal. It shows a SIM group containing two SIMs." lightbox="media/tutorial-create-example-set-of-policy-control-configuration/sims-list.png":::

1. Select the checkbox next to **SIM1**.
1. In the **Command** bar, select **Assign SIM policy**.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/assign-sim-policy-from-sims-list.png" alt-text="Screenshot of the Azure portal showing a list of SIMs. The SIM1 resource and the Assign SIM policy option are highlighted."::: 

1. Under **Assign SIM policy** on the right, set the **SIM policy** field to **sim-policy-1**.
1. Select **Assign SIM policy**.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/assign-sim-policy.png" alt-text="Screenshot of the Azure portal showing the Assign SIM policy screen. The Assign SIM policy option is highlighted.":::  

1. Once the deployment is complete, select **Go to Resource**.
1. Check the **SIM policy** field in the **Management** section to confirm **sim-policy-1** has been successfully assigned.

    :::image type="content" source="media/tutorial-create-example-set-of-policy-control-configuration/sim-with-sim-policy.png" alt-text="Screenshot of the Azure portal showing a SIM resource. The SIM policy field is highlighted in the Management section." lightbox="media/tutorial-create-example-set-of-policy-control-configuration/sim-with-sim-policy-enlarged.png":::

1. In the **SIM group** field under **Essentials**, select **SIMGroup1** to return to the SIM group. 
1. Select the checkbox next to **SIM2**.
1. In the **Command** bar, select **Assign SIM policy**.
1. Under **Assign SIM policy** on the right, set the **SIM policy** field to **sim-policy-2**.
1. Select the **Assign SIM policy** button.
1. Once the deployment is complete, select **Go to Resource**.
1. Check the **SIM policy** field in the **Management** section to confirm **sim-policy-2** has been successfully assigned.

You have now provisioned two SIMs and assigned each of them a different SIM policy. Each of these SIM policies provides access to a different set of services.

## Clean up resources

You can now delete each of the resources we've created during this tutorial.

1. Search for and select the Mobile Network resource representing your private mobile network.
1. In the **Resource** menu, select **SIM groups**.
1. Select the checkbox next to **SIMGroup1**, and then select **Delete** from the **Command** bar.
1. Select **Delete** to confirm your choice. 
1. Once the SIM group has been deleted, select **SIM policies** from the **Resource** menu.
1. Select the checkboxes next to **sim-policy-1** and **sim-policy-2**, and then select **Delete** from the **Command** bar.
1. Select **Delete** to confirm your choice.
1. Once the SIM policies have been deleted, select **Services** from the **Resource** menu.
1. Select the checkboxes next to **service_unrestricted_udp_and_icmp**, **service_blocking_udp_from_specific_sources**, and **service_traffic_limits**, and then select **Delete** from the command bar.
1. Select **Delete** to confirm your choice.

## Next steps

> [!div class="nextstepaction"]
> [Find out how to design your own policy control configuration](policy-control.md)
