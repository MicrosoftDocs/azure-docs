---
title: Quickstart - Create a network security perimeter - Azure portal
description: Learn how to create a network security perimeter for an Azure resource using the Azure portal. This example demonstrates the creation of a network security perimeter for an Azure Key Vault.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 11/04/2024
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

Before creating a network security perimeter, you create a resource group to hold all resources and a key vault that's protected by a network security perimeter.

> [!NOTE]
> Azure Key Vault requires a unique name. If you receive an error that the name is already in use, try a different name. In our example, we use a unique name by appending Year (YYYY), Month (MM), and Day (DD) to the name - **key-vault-YYYYDDMM**.

1. In the search box at the top of the portal, enter **Key vaults**. Select **Key vaults** in the search results.
1. In the Key vaults accounts window that appears, select **+ Create**.
1. In the **Create a key vault** window, enter the following information:

    |**Setting**| **Value** |
    | --- | --- |
    | Subscription | Select the subscription you want to use for this key vault. |
    | Resource group | Select **Create new**, then enter **resource-group** as the name. |
    | Key vault name |  Enter **key-vault-`<RandomNameInformation>`**. |
    | Region | Select the region in which you want your key vault to be created. For this quickstart, **(US) West Central US** is used. |

2. Leave the remaining default settings, and select **Review + Create** > **Create**.

## Create a network security perimeter

Once you create a key vault, you can proceed to create a network security perimeter.

> [!NOTE]
> For organizational and informational safety, it's advised **not to include any personally identifiable or sensitive data** in the network security perimeter rules or other network security perimeter configuration.

1. In the search box of the Azure portal, enter **network security perimeters**. Select **network security perimeters** from the search results.
2. In the **network security perimeters** window, select **+ Create**.
3. In the **Create a network security perimeter** window, enter the following information:

    | **Setting** | **Value** |
    | --- | --- |
    | Subscription | Select the subscription you want to use for this network security perimeter. |
    | Resource group | Select **resource-group**. |
    | Name | Enter **network-security-perimeter**. |
    | Region | Select the region in which you want your network security perimeter to be created. For this quickstart, **(US) West Central US** is used. |
    | Profile name | Enter **profile-1**. |

4. Select the **Resources** tab or **Next** to proceed to the next step.
5. In the **Resources** tab, select **+ Add**.
6. In the **Select resources** window, check **key-vault-YYYYDDMM** and choose **Select**.
7. Select **Inbound access rules** and select **+ Add**.
8. In the **Add inbound access rule** window, enter the following information, and select **Add**:

    | **Settings** | **Value** |
    | --- | --- |
    | Rule name | Enter **inbound-rule**. |
    | Source type | Select **IP address ranges**. |
    | Allowed Sources | Enter a public IP address range you wish to allow inbound traffic from. |

9. Select **Outbound access rules** and select **+ Add**.
10. In the **Add outbound access rule** window, enter the following information, and select **Add**:

    | **Settings** | **Value** |
    | --- | --- |
    | Rule name | Enter **outbound-rule**. |
    | Destination type | Select **FQDN**. |
    | Allowed Destinations | Enter the FQDN of the destinations you want to allow. For example, **www.contoso.com**. |

11. Select **Review + create** and then **Create**.
12. Select **Go to resource** to view the newly created network security perimeter.

[!INCLUDE [network-security-perimeter-note-managed-id](../../includes/network-security-perimeter-note-managed-id.md)]

## Delete a network security perimeter

When you no longer need a network security perimeter, you remove any resources associated with the network security perimeter and then remove the perimeter following these steps:

1. From your network security perimeter, select **Associated resources** under **Settings**.
2. Select **key-vault-YYYYDDMM** from the list of associated resources.
3. From the action bar, select **Settings ** and then select **Remove** in the confirmation window.
4. Navigate back to the **Overview** page of your network security perimeter.
5. Select **Delete** and confirm the deletion by entering **network-security-perimeter** in the text box for the name of the resource.
6. Browse to the **resource-group** and select **Delete** to remove the resource group and all resources within it.

[!INCLUDE [network-security-perimeter-delete-resources](../../includes/network-security-perimeter-delete-resources.md)]

## Next steps

> [!div class="nextstepaction"]
> [Diagnostic logging for Azure Network Security Perimeter](./network-security-perimeter-diagnostic-logs.md)
