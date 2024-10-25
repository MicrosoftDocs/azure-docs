---
title: Quickstart - Create a network security perimeter - Azure portal
description: Learn how to create a network security perimeter for an Azure resource using the Azure portal. This example demonstrates the creation of a network security perimeter for an Azure Key Vault.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.topic: quickstart
ms.date: 09/16/2024
#CustomerIntent: As a network administrator, I want to create a network security perimeter for an Azure resource in the Azure portal, so that I can control the network traffic to and from the resource.
---

# Quickstart: Create a network security perimeter - Azure portal

Get started with network security perimeter by creating a network security perimeter for an Azure key vault using the Azure portal. A [network security perimeter](network-security-perimeter-concepts.md) allows [Azure PaaS (PaaS)](./network-security-perimeter-concepts.md#onboarded-private-link-resources)resources to communicate within an explicit trusted boundary. Next, You create and update a PaaS resources association in a network security perimeter profile. Then you create and update network security perimeter access rules. When you're finished, you delete all resources created in this quickstart.

[!INCLUDE [network-security-perimeter-preview-message](../../includes/network-security-perimeter-preview-message.md)]

## Prerequisites

Before you begin, make sure you have the following:

- An Azure account with an active subscription and access to the Azure portal. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [network-security-perimeter-add-preview](../../includes/network-security-perimeter-add-preview.md)]

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a resource group and key vault

Before creating a network security perimeter, you create a resource group to hold all resources and a key vault that will be protected by the network security perimeter.

> [!NOTE]
> Azure Key Vault requires a unique name. If you receive an error that the name is already in use, try a different name. In our example, we use a unique name by appending Year (YYYY), Month (MM), and Day (DD) to the name - **key-vault-YYYYDDMM**.

1. In the search box at the top of the portal, enter **Key vaults**. Select **Key vaults** in the search results.
1. In the Key vaults accounts window that appears, select **Create +**.
1. In the **Create a key vault** window, enter the following information:

    |**Setting**| **Value** |
    | --- | --- |
    | Subscription | Select the subscription you want to use for this key vault. |
    | Resource group | Select **Create new**, then enter **test-rg** as the name. |
    | Key vault name |  Enter **key-vault-`<RandomNameInformation>`**. |
    | Region | Select the region in which you want your key vault to be created. For this quickstart, **(US) West Central US** is used. |

1. Leave the remaining default settings, and select **Review > Create**.

## Create a network security perimeter

Once you create a key vault, you can proceed to create a network security perimeter.

> [!NOTE]
> Please do not put any personal identifiable or sensitive data in the network security perimeter rules or other network security perimeter configuration.

1. From **Home**, select **Create a resource**.
1. In the search box, enter **network security perimeters**. Select **network security perimeters** from the search results.
1. In the **network security perimeters** window, select **+ Create**.
1. In the **Create a network security perimeter** window, enter the following information:

    | **Setting** | **Value** |
    | --- | --- |
    | Subscription | Select the subscription you want to use for this network security perimeter. |
    | Resource group | Select **test-rg**. |
    | Name | Enter **network-security-perimeter**. |
    | Region | Select the region in which you want your network security perimeter to be created. For this quickstart, **(US) West Central US** is used. |
    | Profile name | Enter **profile-1**. |

1. Select the **Resources** tab or **Next** to proceed to the next step.
1. In the **Resources** tab, select **Associate resource**.
1. In the **Select resources** window, check **key-vault-YYYYDDMM** and choose **Select**.
1. Select **Inbound access rules** and select **Add inbound access rule**.
1. In the **Add inbound access rule** window, enter the following information, and select **Add**:

    | **Settings** | **Value** |
    | --- | --- |
    | Rule name | Enter **inbound-rule**. |
    | Source type | Select **IP address ranges**. |
    | Allowed Sources | Enter **10.1.0.0/16** or another internal IP address range. |

1. Select **Outbound access rules** and select **Add outbound access rule**.
1. In the **Add outbound access rule** window, enter the following information, and select **Add**:

    | **Settings** | **Value** |
    | --- | --- |
    | Rule name | Enter **outbound-rule**. |
    | Destination type | Select **FQDN**. |
    | Allowed Destinations | Enter the FQDN of the service you want to allow. For example, **www.contoso.com**. |

1. Select **Review + create** and then **Create**.
1. Select **Go to resource** to view the newly created network security perimeter.

## Delete a network security perimeter

When you no longer need a network security perimeter, you remove any resources associated with the network security perimeter and then remove the perimeter following these steps:

1. From your network security perimeter, select **Resources** under **Settings**.
2. Select **key-vault-YYYYDDMM** and select **Settings>Remove** from the action bar.
3. Navigate back to the **Overview** page of your network security perimeter.
4. Select **Delete** and confirm the deletion by entering **network-security-perimeter** in the text box for the name of the resource.

## Next steps

> [!div class="nextstepaction"]
> [Diagnostic logging for Azure Network Security Perimeter](./network-security-perimeter-collect-resource-logs.md)