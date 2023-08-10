---
title: Configure UE to UE internal forwarding - Azure portal
titleSuffix: Azure Private 5G Core
description: In this how-to guide you'll learn how to enable or disable UE to UE internal forwarding using policy control configuration in the Azure portal.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 05/31/2023
ms.custom: template-how-to
---

# Configure UE to UE internal forwarding for Azure Private 5G Core - Azure portal

Azure Private 5G Core enables traffic flowing between user equipment (UEs) attached to the same data network to stay within that network. This is called *internal forwarding between UEs*. Internal forwarding between UEs minimizes latency and maximizes security and privacy for UE-UE traffic. You can enable or disable this behavior using SIM policies.

If you are using the [Default service and allow-all SIM policy](default-service-sim-policy.md), internal forwarding will be enabled. If you are using a more restrictive policy, you may need to enable internal forwarding.

If you are using the [Default service and allow-all SIM policy](default-service-sim-policy.md) and would like to disable internal forwarding, either because you use an external gateway or because you do not want UEs to communicate with each other, you can create a service to do so and then apply it to your allow-all SIM policy.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor or Owner role at the subscription scope.
- Identify the name of the Mobile Network resource corresponding to your private mobile network.
- Collect all the configuration values in [Collect the required information for a service](collect-required-information-for-service.md) for your chosen service.

## Create a service to allow internal forwarding

In this step, we'll create a service that allows traffic labeled with the remote address in the range configured for UEs (10.20.0.0/16, in this example) to flow in both directions.

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
    |**Service name**     |`service_allow_internal_forwarding`         |
    |**Service precedence**     | `200`        |
    |**Maximum bit rate (MBR) - Uplink**     | `2 Gbps`        |
    |**Maximum bit rate (MBR) - Downlink**     | `2 Gbps`        |
    |**Allocation and Retention Priority level**     | `2`        |
    |**5QI/QCI**     | `9`        |
    |**Preemption capability**     | Select **May not preempt**.        |
    |**Preemption vulnerability**     | Select **Not preemptible**.        |

1. Under **Data flow policy rules**, select **Add a policy rule**.

1. We'll now create a data flow policy rule that allows any packets that match the data flow template we'll configure in the next step. Under **Add a policy rule** on the right, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Rule name**     |`rule_allow_internal_forwarding`         |
    |**Policy rule precedence**     | Select **200**.        |
    |**Allow traffic**     | Select **Enabled**.        |

1. We'll now create a data flow template that matches on packets flowing towards or away from UEs in 10.20.0.0/16, so that they can be allowed by `rule_allow_internal_forwarding`.
    Under **Data flow templates**, select **Add a data flow template**. In the **Add a data flow template** pop-up, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Template name**     |`internal_forwarding`         |
    |**Protocols**     | Select **All**.        |
    |**Direction**     | Select **Bidirectional**.        |
    |**Remote IPs**     | `10.20.0.0/16`        |
    |**Ports**     | Leave blank.        |

1. Select **Add**.
1. On the **Basics** configuration tab, select **Review + create**.
1. Select **Create** to create the service.
1. The Azure portal will display the following confirmation screen when the service has been created. Select **Go to resource** to see the new service resource.

    :::image type="content" source="media/configure-service-azure-portal/service-resource-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing the successful deployment of a service and the Go to resource button.":::

1. Confirm that the QoS characteristics, data flow policy rules, and service data flow templates listed at the bottom of the screen are configured as expected.

## Create a service to block internal forwarding

In this step, we'll create a service that blocks traffic labeled with the remote address in the range configured for UEs (10.20.0.0/16, in this example) in both directions.

To create the service:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the Mobile Network resource representing your private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal showing the results for a search for a Mobile Network resource.":::

1. In the **Resource** menu, select **Services**.

    :::image type="content" source="media/configure-service-azure-portal/services-resource-menu-option.png" alt-text="Screenshot of the Azure portal showing the Services option in the resource menu of a Mobile Network resource.":::

1. In the **Command** bar, select **Create**.

    :::image type="content" source="media/configure-service-azure-portal/create-command-bar-option.png" alt-text="Screenshot of the Azure portal showing the Create option in the command bar.":::

1. Enter values to define the QoS characteristics that will be applied to service data flows (SDFs) that match this service. On the **Basics** tab, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Service name**     |`service_block_internal_forwarding`         |
    |**Service precedence**     | `200`        |
    |**Maximum bit rate (MBR) - Uplink**     | `2 Gbps`        |
    |**Maximum bit rate (MBR) - Downlink**     | `2 Gbps`        |
    |**Allocation and Retention Priority level**     | `2`        |
    |**5QI/QCI**     | `9`        |
    |**Preemption capability**     | Select **May not preempt**.        |
    |**Preemption vulnerability**     | Select **Not preemptible**.        |

    > [!IMPORTANT]
    > The **Service precedence** must be a lower value than any conflicting service (such as an "allow all" service). Services are matched to traffic in order of precedence.

1. Under **Data flow policy rules**, select **Add a policy rule**.

1. We'll now create a data flow policy rule that blocks any packets that match the data flow template we'll configure in the next step. Under **Add a policy rule** on the right, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Rule name**     |`rule_block_internal_forwarding`         |
    |**Policy rule precedence**     | Select **200**.        |
    |**Allow traffic**     | Select **Blocked**.        |

1. We'll now create a data flow template that matches on packets flowing towards or away from UEs in 10.20.0.0/16, so that they can be blocked by `rule_block_internal_forwarding`.
    Under **Data flow templates**, select **Add a data flow template**. In the **Add a data flow template** pop-up, fill out the fields as follows.

    |Field  |Value  |
    |---------|---------|
    |**Template name**     |`internal_forwarding`         |
    |**Protocols**     | Select **All**.        |
    |**Direction**     | Select **Bidirectional**.        |
    |**Remote IPs**     | `10.20.0.0/16`        |
    |**Ports**     | Leave blank.        |

1. Select **Add**.
1. On the **Basics** configuration tab, select **Review + create**.
1. Select **Create** to create the service.
1. The Azure portal will display the following confirmation screen when the service has been created. Select **Go to resource** to see the new service resource.

    :::image type="content" source="media/configure-service-azure-portal/service-resource-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing the successful deployment of a service and the Go to resource button.":::

1. Confirm that the QoS characteristics, data flow policy rules, and service data flow templates listed at the bottom of the screen are configured as expected.

## Modify an existing SIM policy to assign the new service

In this step, we'll assign the new service (`service_allow_internal_forwarding` or `service_block_internal_forwarding`) to an existing SIM policy.

1. Find the SIM policy configured for your UEs.

    :::image type="content" source="media/configure-sim-policy-azure-portal/sim-policies-resource-menu-option.png" alt-text="Screenshot of the Azure portal showing the SIM policies option in the resource menu of a Mobile Network resource.":::


1. Select the SIM policy you want to modify and select **Modify the selected SIM policy**.

    :::image type="content" source="media/sim-policies-modify-button.png" alt-text="Screenshot of the Azure portal showing the modify SIM policies option.":::    

1. Select **Modify Network Scope** for the existing slice and data network configured for your UEs.
1. Under **Service configuration**, add the new service.
1. Select **Modify**.
1. Select **Assign to SIMs**.
1. Select **Review + modify**.
1. Review your updated SIM policy and check that the configuration is as expected.

    - The top level settings for the SIM policy are shown under the **Essentials** heading.
    - The network scope configuration is shown under the **Network scope** heading including configured services under **Service configuration** and quality of service configuration under **Quality of Service (QoS)**.
    
## Next steps

- [Find out how to design your own policy control configuration](policy-control.md)

