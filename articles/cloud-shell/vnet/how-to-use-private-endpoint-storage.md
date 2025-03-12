---
title: Connect to a storage account using an Azure private endpoint
description: This article explains how to connect Cloud Shell to a storage account using a private endpoint.
ms.topic: how-to
ms.date: 11/25/2024
---

#  Connect to a storage account using an Azure private endpoint

Azure private endpoint is the fundamental building block for Private Link in Azure. It enables Azure
resources to privately and securely communicate with Private Link resources such as Azure Storage.

After deploying Cloud Shell in a private virtual network, you may want to remove the public endpoint
from the storage account and use a private endpoint. When you use a private endpoint, the storage
account is accessible only from the virtual network where the private endpoint is created. You must
also add a DNS record for the private endpoint. Without the DNS record, Cloud Shell can't connect to
the storage account. Under this condition, when you start a Cloud Shell session, you see a message
that you're using ephemeral storage.

This article shows you how to create a private endpoint for a storage account and create the
necessary DNS record.

## Disable public access to storage account

Before you create the private endpoint, you should disable public access to the storage account. Use
the following steps to disable public access to the storage account.

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage
   accounts** in the search results.
1. Select **storage1** or the name of your existing storage account.
1. In **Security + networking**, select **Networking**.
1. In the **Firewalls and virtual networks** tab in **Public network access**, select **Disabled**.
1. Select **Save**.

## Create private endpoint

1. In the search box at the top of the portal, enter **Private endpoint**. Select **Private
   endpoints**.
1. Select **+ Create** in **Private endpoints**.
1. In the **Basics** tab of **Create a private endpoint**, create the following configuration:

   |        Setting         |                     Value                      |
   | ---------------------- | ---------------------------------------------- |
   | **Project details**    |                                                |
   | Subscription           | Select your subscription.                      |
   | Resource group         | Select **rg-cloudshell-eastus**                |
   | **Instance details**   |                                                |
   | Name                   | Enter **private-endpoint**.                    |
   | Network Interface Name | Leave the default of **private-endpoint-nic**. |
   | Region                 | Select **East US 2**.                          |

1. Select **Next: Resource**.
1. In the **Resource** pane, enter or select the following information.

   |      Setting       |                                 Value                                  |
   | ------------------ | ---------------------------------------------------------------------- |
   | Connection method  | Leave the default of **Connect to an Azure resource in my directory.** |
   | Subscription       | Select your subscription.                                              |
   | Resource type      | Select **Microsoft.Storage/storageAccounts**.                          |
   | Resource           | Select **myvnetstorage1138** or your storage account.                  |
   | Target subresource | Select **file**.                                                       |

1. Select **Next: Virtual Network**.

1. In **Virtual Network**, enter or select the following information.

   |               Setting                |                                                                                                                                                                                            Value                                                                                                                                                                                            |
   | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Networking**                       |                                                                                                                                                                                                                                                                                                                                                                                             |
   | Virtual network                      | Select **vnet-cloudshell-eastus (rg-cloudshell-eastus)**.                                                                                                                                                                                                                                                                                                                                   |
   | Subnet                               | Select **storagesubnet**.                                                                                                                                                                                                                                                                                                                                                                   |
   | Network policy for private endpoints | Select **edit** to apply Network policy for private endpoints. </br> In **Edit subnet network policy**, select the checkbox next to **Network security groups** and **Route Tables** in the **Network policies setting for all private endpoints in this subnet** pull-down. </br> Select **Save**. </br></br>For more information, see [Manage network policies for private endpoints][01] |
   | **Private IP configuration**         | Select **Dynamically allocate IP address**.                                                                                                                                                                                                                                                                                                                                                 |

   :::image type="content" source="./media/how-to-use-private-endpoint-storage/dynamic-ip-address.png" alt-text="Screenshot of dynamic IP address selection." border="true":::

1. Select **Next: DNS**.
1. On the **DNS** tab, ensure that **Integrate with private DNS zone** is set to **Yes**. Keep the
   default values for the remaining fields.
1. Select **Next: Tags**, then **Next: Review + create**.
1. Select **Create**.

<!-- link references -->
[01]: /azure/private-link/disable-private-endpoint-network-policy
