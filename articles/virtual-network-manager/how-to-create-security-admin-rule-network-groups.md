---
title: Create a security admin rule using network groups
titleSuffix: Azure Virtual Network Manager
description: Learn how to deploy security admin rules using network groups as the source and destination in Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to 
ms.date: 04/01/2024
ms.custom: template-how-to
#Customer intent: As a network administrator, I want to deploy security admin rules using network groups in Azure Virtual Network Manager so that I can define the source and destination of the traffic for the security admin rule.
---
# Create a security admin rule using network groups in Azure Virtual Network Manager

In Azure Virtual Network Manager, you can deploy [security admin rules](./concept-security-admins.md) using [network groups](./concept-network-groups.md). Security admin rules and network groups allow you to define the source and destination of the traffic for the security admin rule.    

In this article, you learn how to create a security admin rule using network groups in Azure Virtual Network Manager. You use the Azure portal to create a security admin configuration, add a security admin rule, and deploy the security admin configuration.

> [!IMPORTANT]
> 
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub-and-spoke connectivity configurations. Both Mesh connectivity configurations and the creation of security admin rules with network groups in Azure Virtual Network Manager are in public preview remain in public preview.
>
> Security configurations with security admin rules is generally available in the following regions:
> - Australia East
> - Australia Southeast
> - Brazil South
> - Brazil Southeast
> - East Asia
> - Europe North
> - France South
> - Germany West Central
> - India Central
> - India South
> - India West
> - Israel Central
> - Italy North
> - Japan East
> - Jio India West
> - Korea Central
> - Norway East
> - Norway West
> - Poland Central
> - Qatar Central
> - South Africa North
> - South Africa West
> - Sweden Central
> - Sweden South
> - Switzerland North
> - UAE North
> - US East
> - US North
> - US West Central
> 
> All other regions remain in public preview.
> 
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/).

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

1. In **Create security admin configuration**, enter the following details:
  
    | **Setting** | **Value** |
    | --- | --- |
    | **Name** | Enter a name for the security admin rule. |
    | **Description** | Enter a description for the security admin rule. |
    | **Deployment option for NIP virtual networks** | |
    | **Deployment option** | Select **None**. |
    | **Address Space Aggregation Options** | Select **Manual**. |

   - **Name**: Enter a name for the security admin rule.
  
   - **Description**: Enter a description for the security admin rule.

1. Select **Review + create** and then select **Create**.

## Add a security admin rule

To add a security admin rule, follow these steps:

1. In the **Configurations** window, select the security admin configuration you created. If you don't see the configuration, select **Refresh**.

1. Under **Settings**, select **Rule collections** and **+ Create**.

1. In the **Add a rule collection** window, enter the following details:
  
    | **Setting** | **Value** |
    | --- | --- |
    | **Name** | Enter a name for the rule collection. |
    | **Target network groups** | Select the network group that contains the source and destination of the traffic for the security admin rule. |
    
1. Under **Security admin rules**, select **+ Add**.

1. In the **Add a rule** window, enter the following details:
   
    | **Setting** | **Value** |
    | --- | --- |
    | **Name** | Enter a name for the security admin rule. |
    | **Description** | Enter a description for the security admin rule. |
    | **Priority** | Enter a priority for the security admin rule. |
    | **Direction** | Select the direction for the security admin rule. |
    | **Protocol** | Select the protocol for the security admin rule. |
    | **Source** |  |
    | **Source type** | Select **Network group**. |
    | **Source port** | Enter the source port for the security admin rule. |
    | **Destination** |  |
    | **Destination type** | Select **Network group**. |
    | **Destination port** | Enter the destination port for the security admin rule. |

1. Select **Add** and **Add** again to add the security admin rule to the rule collection.

## Deploy the security admin configuration

Use the following steps to deploy the security admin configuration:

1. Return to the **Configurations** window and select the security admin configuration you created.

1. Select your security admin configuration and then select **Deploy**.

1. In **Deploy security admin configuration**, select the target Azure regions for security admin configuration and select **Next > Deploy**.

## Next step

> [!div class="nextstepaction"]
> [View configurations applied by Azure Virtual Network Manager](how-to-view-applied-configurations.md)



