---
title: 'Quickstart: Create a private endpoint - Azure portal'
titleSuffix: Azure Private Link
description: In this quickstart, you'll learn how to create a private endpoint using the Azure portal.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: quickstart
ms.date: 12/06/2022
ms.author: allensu
ms.custom: mode-ui, template-quickstart
#Customer intent: As someone who has a basic network background but is new to Azure, I want to create a private endpoint on a SQL server so that I can securely connect to it.
---

# Quickstart: Create a private endpoint by using the Azure portal

Get started with Azure Private Link by creating and using a private endpoint to connect securely to an Azure web app.

In this quickstart, you'll create a private endpoint for an Azure web app and then create and deploy a virtual machine (VM) to test the private connection.  

You can create private endpoints for various Azure services, such as Azure SQL and Azure Storage.

## Prerequisites

- An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure web app with a *PremiumV2-tier* or higher app service plan, deployed in your Azure subscription.  

    - For more information and an example, see [Quickstart: Create an ASP.NET Core web app in Azure](../app-service/quickstart-dotnetcore.md). 
    
    - The example webapp in this article is named **myWebApp1979**. Replace the example with your webapp name.


## Create a virtual network and bastion host

Create a virtual network, subnet, and bastion host. 

You use the bastion host to connect securely to the VM for testing the private endpoint.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual network**. In the search results, select **Virtual networks**.

3. Select **+ Create** in **Virtual networks**.

4. In the **Basics** tab of **Create virtual network**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **CreatePrivateEndpointQS-rg** in **Name** and select **OK**. |
    | **Instance details** |  |
    | Name | Enter **myVNet**. |
    | Region | Select **West Europe**. |

5. Select **Next: IP Addresses** or the **IP Addresses** tab.

6. Select the **IP Addresses** tab or select **Next: IP Addresses** at the bottom of the page.

7. In the **IP Addresses** tab, enter the following information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

8. Under **Subnet name**, select the word **default**. If a subnet isn't present, select **+ Add subnet**.

9. In **Edit subnet**, enter the following information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **mySubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |

10. Select **Save** or **Add**.

11. Select **Next: Security**, or the **Security** tab.

12. Under **BastionHost**, select **Enable**. Enter the following information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/26** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |

13. Select the **Review + create** tab or select the **Review + create** button.

14. Select **Create**.
    
    > [!NOTE]
    > The virtual network and subnet are created immediately. The Bastion host creation is submitted as a job and will complete within 10 minutes. You can proceed to the next steps while the Bastion host is created.

## Create a test virtual machine

Next, create a VM that you can use to test the private endpoint.

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines**.

3. Select **+ Create** then **Azure virtual machine** in **Virtual machines**.
   
4. In the **Basics** tab of **Create a virtual machine**, enter or select the following information.

    | Setting                        | Value                                             |
    |--------------------------------|---------------------------------------------------|
    | **Project details**       |                                                   |
    | Subscription                   | Select your Azure subscription.                   |
    | Resource group                 | Select **CreatePrivateEndpointQS-rg**.            |
    | **Instance details**      |                                                   |
    | Virtual machine name           | Enter **myVM**.                                   |
    | Region                         | Select **West Europe**.                           |
    | Availability options           | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image                          | Select **Windows Server 2022 Datacenter - Gen2**. |
    | Size                           | Select the VM size or use the default setting.    |
    | **Administrator account** |                                                   |
    | Username                       | Enter a username.                                 |
    | Password                       | Enter a password.                                 |
    | Confirm password               | Reenter the password.                             |
    | **Inbound port rules** |   |
    | Public inbound ports | Select **None**. |


5. Select the **Networking** tab.
  
6. In the **Networking** tab, enter or select the following information.

    |Setting                     | Value               |
    |----------------------------|---------------------|
    | **Network interface** |                     |
    | Virtual network            | Select **myVNet**.   |
    | Subnet                     | Select **mySubnet (10.1.0.0/24)**. |
    | Public IP                  | Select **None**.    |
    | NIC network security group | Select **Basic**.   |
    | Public inbound ports       | Select **None**.    |
   
7. Select **Review + create**. 
  
8. Review the settings, and then select **Create**.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Create a private endpoint

Next, you create a private endpoint for the web app that you created in the "Prerequisites" section.

> [!IMPORTANT]
> You must have a previously deployed Azure WebApp to proceed with the steps in this article. For more information, see [Prerequisites](#prerequisites) .

1. In the search box at the top of the portal, enter **Private endpoint**. Select **Private endpoints**.

2. Select **+ Create** in **Private endpoints**.

3. In the **Basics** tab of **Create a private endpoint**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **CreatePrivateEndpointQS-rg** |
    | **Instance details** |   |
    | Name | Enter **myPrivateEndpoint**. |
    | Network Interface Name | Leave the default of **myPrivateEndpoint-nic**. |
    | Region | Select **West Europe**. |

4. Select **Next: Resource**.
    
5. In the **Resource** pane, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Connection method | Leave the default of **Connect to an Azure resource in my directory.** |
    | Subscription | Select your subscription. |
    | Resource type | Select **Microsoft.Web/sites**. |
    | Resource | Select **mywebapp1979**. |
    | Target subresource | Select **sites**. |

6. Select **Next: Virtual Network**. 

7. In **Virtual Network**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Networking** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **myVNet/mySubnet (10.1.0.0/24)**. |
    | Network policy for private endpoints | Select **edit** to apply Network security groups and/or Route tables to the subnet that contains the private endpoint. </br> In **Edit subnet network policy**, select the checkbox next to **Network security groups** and **Route Tables**. </br> Select **Save**. </br></br>For more information, see [Manage network policies for private endpoints](disable-private-endpoint-network-policy.md) |

# [**Dynamic IP**](#tab/dynamic-ip)

| Setting | Value |
| ------- | ----- |
| **Private IP configuration** | Select **Dynamically allocate IP address**. |

:::image type="content" source="./media/create-private-endpoint-portal/dynamic-ip-address.png" alt-text="Screenshot of dynamic IP address selection." border="true":::

# [**Static IP**](#tab/static-ip)

| Setting | Value |
| ------- | ----- |
| **Private IP configuration** | Select **Statically allocate IP address**. |
| Name | Enter **myIPconfig**. |
| Private IP | Enter **10.1.0.10**. |

:::image type="content" source="./media/create-private-endpoint-portal/static-ip-address.png" alt-text="Screenshot of static IP address selection." border="true":::

---

8. Select **Next: DNS**.

9. Leave the defaults in **DNS**. Select **Next: Tags**, then **Next: Review + create**. 

10. Select **Create**.

## Test connectivity to the private endpoint

Use the virtual machine that you created earlier to connect to the web app across the private endpoint.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines**.

2. Select **myVM**.

3. On the overview page for **myVM**, select **Connect**, and then select **Bastion**.

4. Enter the username and password that you used when you created the VM.

5. Select **Connect**.

6. After you've connected, open PowerShell on the server.

7. Enter `nslookup mywebapp1979.azurewebsites.net`. You'll receive a message that's similar to the following example:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mywebapp1979.privatelink.azurewebsites.net
    Address:  10.1.0.5
    Aliases:  mywebapp1979.azurewebsites.net
    ```

    A private IP address of **10.1.0.5** is returned for the web app name if you chose dynamic IP address in the previous steps. This address is in the subnet of the virtual network you created earlier.

8. In the bastion connection to **myVM**, open the web browser.

9. Enter the URL of your web app, `https://mywebapp1979.azurewebsites.net`.

   If your web app hasn't been deployed, you'll get the following default web app page:

    :::image type="content" source="./media/create-private-endpoint-portal/web-app-default-page.png" alt-text="Screenshot of the default web app page on a browser." border="true":::

10. Close the connection to **myVM**.

## Clean up resources

If you're not going to continue to use this web app, delete the virtual network, virtual machine, and web app by doing the following steps:

1. On the left pane, select **Resource groups**.

2. Select **CreatePrivateEndpointQS-rg**.

3. Select **Delete resource group**.

4. Under **Type the resource group name**, enter **CreatePrivateEndpointQS-rg**.

5. Select **Delete**.

## Next steps

In this quickstart, you created:

* A virtual network and bastion host

* A virtual machine

* A private endpoint for an Azure web app

You used the VM to test connectivity to the web app across the private endpoint.

For more information about the services that support private endpoints, see:
> [!div class="nextstepaction"]
> [What is Azure Private Link?](private-link-overview.md#availability)
