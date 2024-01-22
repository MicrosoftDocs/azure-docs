---
title: 'Quickstart: Create a private endpoint - Azure portal'
titleSuffix: Azure Private Link
description: In this quickstart, learn how to create a private endpoint using the Azure portal.
author: asudbring
ms.service: private-link
ms.topic: quickstart
ms.date: 06/13/2023
ms.author: allensu
ms.custom: mode-ui, template-quickstart
#Customer intent: As someone who has a basic network background but is new to Azure, I want to create a private endpoint on a SQL server so that I can securely connect to it.
---

# Quickstart: Create a private endpoint by using the Azure portal

Get started with Azure Private Link by creating and using a private endpoint to connect securely to an Azure web app.

In this quickstart, create a private endpoint for an Azure App Services web app and then create and deploy a virtual machine (VM) to test the private connection.  

You can create private endpoints for various Azure services, such as Azure SQL and Azure Storage.

:::image type="content" source="./media/create-private-endpoint-portal/private-endpoint-qs-resources.png" alt-text="Diagram of resources created in private endpoint quickstart.":::

## Prerequisites

- An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure App Services web app with a Basic, Standard, PremiumV2, PremiumV3, IsolatedV2, Functions Premium (sometimes referred to as the Elastic Premium plan) app service plan, deployed in your Azure subscription.  

    - For more information and an example, see [Quickstart: Create an ASP.NET Core web app in Azure](../app-service/quickstart-dotnetcore.md). 
    
    - The example webapp in this article is named **webapp-1**. Replace the example with your webapp name.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [virtual-network-create-with-bastion.md](../../includes/virtual-network-create-with-bastion.md)]

## Create a private endpoint

Next, you create a private endpoint for the web app that you created in the **Prerequisites** section.

> [!IMPORTANT]
> You must have a previously deployed Azure App Services web app to proceed with the steps in this article. For more information, see [Prerequisites](#prerequisites) .

1. In the search box at the top of the portal, enter **Private endpoint**. Select **Private endpoints**.

1. Select **+ Create** in **Private endpoints**.

1. In the **Basics** tab of **Create a private endpoint**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg** |
    | **Instance details** |   |
    | Name | Enter **private-endpoint**. |
    | Network Interface Name | Leave the default of **private-endpoint-nic**. |
    | Region | Select **East US 2**. |

1. Select **Next: Resource**.
    
1. In the **Resource** pane, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Connection method | Leave the default of **Connect to an Azure resource in my directory.** |
    | Subscription | Select your subscription. |
    | Resource type | Select **Microsoft.Web/sites**. |
    | Resource | Select **webapp-1**. |
    | Target subresource | Select **sites**. |

1. Select **Next: Virtual Network**. 

1. In **Virtual Network**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Networking** |  |
    | Virtual network | Select **vnet-1 (test-rg)**. |
    | Subnet | Select **subnet-1**. |
    | Network policy for private endpoints | Select **edit** to apply Network policy for private endpoints. </br> In **Edit subnet network policy**, select the checkbox next to **Network security groups** and **Route Tables** in the **Network policies setting for all private endpoints in this subnet** pull-down. </br> Select **Save**. </br></br>For more information, see [Manage network policies for private endpoints](disable-private-endpoint-network-policy.md) |

    # [**Dynamic IP**](#tab/dynamic-ip)

    | Setting | Value |
    | ------- | ----- |
    | **Private IP configuration** | Select **Dynamically allocate IP address**. |

    :::image type="content" source="./media/create-private-endpoint-portal/dynamic-ip-address.png" alt-text="Screenshot of dynamic IP address selection." border="true":::

    # [**Static IP**](#tab/static-ip)

    | Setting | Value |
    | ------- | ----- |
    | **Private IP configuration** | Select **Statically allocate IP address**. |
    | Name | Enter **ipconfig-1**. |
    | Private IP | Enter **10.0.0.10**. |

    :::image type="content" source="./media/create-private-endpoint-portal/static-ip-address.png" alt-text="Screenshot of static IP address selection." border="true":::

    ---

1. Select **Next: DNS**.

1. Leave the defaults in **DNS**. Select **Next: Tags**, then **Next: Review + create**. 

1. Select **Create**.

[!INCLUDE [create-test-virtual-machine.md](../../includes/create-test-virtual-machine.md)]

## Test connectivity to the private endpoint

Use the virtual machine that you created earlier to connect to the web app across the private endpoint.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines**.

1. Select **vm-1**.

1. On the overview page for **vm-1**, select **Connect**, and then select the **Bastion** tab.

1. Select **Use Bastion**.

1. Enter the username and password that you used when you created the VM.

1. Select **Connect**.

1. After you've connected, open PowerShell on the server.

1. Enter `nslookup webapp-1.azurewebsites.net`. You receive a message that's similar to the following example:

    ```output
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    webapp-1.privatelink.azurewebsites.net
    Address:  10.0.0.10
    Aliases:  webapp-1.azurewebsites.net
    ```

    A private IP address of **10.0.0.10** is returned for the web app name if you chose static IP address in the previous steps. This address is in the subnet of the virtual network you created earlier.

1. In the bastion connection to **vm-1**, open the web browser.

1. Enter the URL of your web app, `https://webapp-1.azurewebsites.net`.

   If your web app hasn't been deployed, you get the following default web app page:

    :::image type="content" source="./media/create-private-endpoint-portal/web-app-default-page.png" alt-text="Screenshot of the default web app page on a browser." border="true":::

1. Close the connection to **vm-1**.

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

In this quickstart, you created:

* A virtual network and bastion host

* A virtual machine

* A private endpoint for an Azure web app

You used the VM to test connectivity to the web app across the private endpoint.

For more information about the services that support private endpoints, see:
> [!div class="nextstepaction"]
> [What is Azure Private Link?](private-link-overview.md#availability)
