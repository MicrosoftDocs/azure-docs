---
title: Create a security admin rule using network groups
titleSuffix: Azure Virtual Network Manager
description: Learn how to deploy security admin rules using network groups as the source and destination in Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to 
ms.date: 04/17/2024
ms.custom: template-how-to, references_regions
#Customer intent: As a network administrator, I want to deploy security admin rules using network groups in Azure Virtual Network Manager so that I can define the source and destination of the traffic for the security admin rule.
---
# Create a security admin rule using network groups in Azure Virtual Network Manager

In this article, you learn how to create a security admin rule using network groups in Azure Virtual Network Manager. You use the Azure portal to create a security admin configuration, add a security admin rule, and deploy the security admin configuration.

In Azure Virtual Network Manager, you can deploy [security admin rules](./concept-security-admins.md) using [network groups](./concept-network-groups.md). Security admin rules and network groups allow you to define the source and destination of the traffic for the security admin rule.    

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-network-groups-source-destination-preview.md)]

## Prerequisites

To complete this article, you need the following resources:

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

- An Azure Virtual Network Manager instance. If you don't have an instance, see [Create an Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md).

- A network group. If you don't have a network group, see [Create a network group](create-virtual-network-manager-portal.md#create-a-network-group).

## Create a security admin configuration

To create a security admin configuration, follow these steps:

1. In the **Azure portal**, search for and select **Virtual Network Manager**.

1. Select **Network Managers** under **Virtual network manager** on the left side of the portal window.

1. In the **Virtual Network Manager | Network managers** window, select your network manager instance.

1. Select **Configuration** under **Settings** on the left side of the portal window.

1. In the **Configurations** window, select the **Create security admin configuration** button or **+ Create > Security admin configuration** from the drop-down menu.

    :::image type="content" source="media/how-to-create-security-admin-rules-network-groups/create-security-admin-configuration.png" alt-text="Screenshot of creation of security admin configuration in Configurations of a network manager.":::

1. In the **Basics** tab of the **Create security admin configuration** windows, enter the following settings:
  
    | **Setting** | **Value** |
    | --- | --- |
    | Name | Enter a name for the security admin rule. |
    | Description | Enter a description for the security admin rule. |
    

1. Select the **Deployment Options** tab or **Next: Deployment Options >** and enter the following settings:

    | **Setting** | **Value** |
    | --- | --- |
    | **Deployment option for NIP virtual networks** | |
    | Deployment option | Select **None**. |
    | **Option to use network group as source and destination** | |
    | Network group address space aggregation option | Select **Manual**. |

    :::image type="content" source="media/how-to-create-security-admin-rules-network-groups/create-configuration-with-aggregation-options.png" alt-text="Screenshot of create a security admin configuration deployment options selecting manual aggregation option.":::

    > [!NOTE]
    > The **Network group address space aggregation option** setting allows you to reference network groups in your security admin rules. Once elected, the virtual network manager instance will aggregate the CIDR ranges of the network groups referenced as the source and destination of the security admin rules in the configuration. With the manual aggregation option, the CIDR ranges in the network group are aggregated only when you deploy the security admin configuration. This allows you to commit the CIDR ranges on your schedule.

2. Select **Rule collections** or **Next: Rule collections >**.
3. In the Rule collections tab, select **Add**.
4. In the **Add a rule collection** window, enter the following settings:

    | **Setting** | **Value** |
    | --- | --- |
    | Name | Enter a name for the rule collection. |
    | Target network groups | Select the network group that contains the source and destination of the traffic for the security admin rule. |

5. Select **Add** and enter the following settings in the **Add a rule** window:

    | **Setting** | **Value** |
    | --- | --- |
    | Name | Enter a name for the security admin rule. |
    | Description | Enter a description for the security admin rule. |
    | Priority | Enter a priority for the security admin rule. |
    | Action | Select the action type for the security admin rule. |
    | Direction | Select the direction for the security admin rule. |
    | Protocol | Select the protocol for the security admin rule. |
    | **Source** |  |
    | Source type | Select **Network group**. |
    | Source port | Enter the source port for the security admin rule. |
    | **Destination** |  |
    | Destination type | Select **Network Group**. |
    | Network Group | Select the network group ID that you wish to use for dynamically establishing IP address ranges. |
    | Destination port | Enter the destination port for the security admin rule. |

    :::image type="content" source="media/how-to-create-security-admin-rules-network-groups/create-network-group-as-source-destination-rule.png" alt-text="Screenshot of add a rule window using network groups as source and destination in rule creation.":::

6. Select **Add** and **Add** again to add the security admin rule to the rule collection.

7. Select **Review + create** and then select **Create**.

## Deploy the security admin configuration

Use the following steps to deploy the security admin configuration:

1. Return to the **Configurations** window and select the security admin configuration you created.

1. Select your security admin configuration and then select **Deploy**.

1. In **Deploy security admin configuration**, select the target Azure regions for security admin configuration and select **Next > Deploy**.

## Next step

> [!div class="nextstepaction"]
> [View configurations applied by Azure Virtual Network Manager](how-to-view-applied-configurations.md)



