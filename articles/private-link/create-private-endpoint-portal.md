---
title: 'Quickstart: Create a private endpoint by using the Azure portal'
description: In this quickstart, you'll learn how to create a private endpoint by using the Azure portal.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: quickstart
ms.date: 04/06/2022
ms.author: allensu
ms.custom: mode-ui
#Customer intent: As someone who has a basic network background but is new to Azure, I want to create a private endpoint on a SQL server so that I can securely connect to it.
---

# Quickstart: Create a private endpoint by using the Azure portal

Get started with Azure Private Link by creating and using a private endpoint to connect securely to an Azure web app.

In this quickstart, you'll create a private endpoint for an Azure web app and then create and deploy a virtual machine (VM) to test the private connection.  

You can create private endpoints for a variety of Azure services, such as Azure SQL and Azure Storage.

## Prerequisites

* An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An Azure web app with a *PremiumV2-tier* or higher app service plan, deployed in your Azure subscription.  

    For more information and an example, see [Quickstart: Create an ASP.NET Core web app in Azure](../app-service/quickstart-dotnetcore.md). 
    
    For a detailed tutorial on creating a web app and an endpoint, see [Tutorial: Connect to a web app by using a private endpoint](tutorial-private-endpoint-webapp-portal.md).

## Create a virtual network and bastion host

Start by creating a virtual network, subnet, and bastion host. 

You use the bastion host to connect securely to the VM for testing the private endpoint.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. At the upper left, select **Create a resource**.

1. On the left pane, select **Networking**, and then select **Virtual network**.

1. On the **Create virtual network** pane, select the **Basics** tab, and then enter the following values:

    | Setting                   | Value                                                                              |
    |---------------------------|------------------------------------------------------------------------------------|
    | **Project&nbsp;details**  |                                                                                    |
    | Subscription              | Select your Azure subscription.                                                    |
    | Resource group            | Select **Create New**. </br> Enter **CreatePrivateEndpointQS-rg**. </br> Select **OK**. |
    | **Instance&nbsp;details** |                                                                                    |
    | Name                      | Enter **myVNet**.                                                                  |
    | Region                    | Select **West Europe**.                                                            |

1. Select the **IP Addresses** tab.

1. On the **IP Addresses** pane, enter this value:

    | Setting            | Value                  |
    |--------------------|------------------------|
    | IPv4 address space | Enter **10.1.0.0/16**. |

1. Under **Subnet name**, select the **Add subnet** link.

1. On the **Edit subnet** right pane, enter these values:

    | Setting              | Value                  |
    |----------------------|------------------------|
    | Subnet name          | Enter **mySubnet**.    |
    | Subnet address range | Enter **10.1.0.0/24**. |

1. Select **Add**.

1. Select the **Security** tab.

1. For **BastionHost**, select **Enable**, and then enter these values:

    | Setting                          | Value                                                                                        |
    |----------------------------------|----------------------------------------------------------------------------------------------|
    | Bastion name                     | Enter **myBastionHost**.                                                                     |
    | AzureBastionSubnet address space | Enter **10.1.1.0/24**.                                                                       |
    | Public IP Address                | Select **Create new** and then, for **Name**, enter **myBastionIP**, and then select **OK**. |

1. Select the **Review + create** tab.

1. Select **Create**.

## Create a test virtual machine

Next, create a VM that you can use to test the private endpoint.

1. In the Azure portal, select **Create a resource**.

1. On the left pane, select **Compute**, and then select **Virtual machine**.
   
1. On the **Create a virtual machine** pane, select the **Basics** tab, and then enter the following values:

    | Setting                        | Value                                             |
    |--------------------------------|---------------------------------------------------|
    | **Project&nbsp;details**       |                                                   |
    | Subscription                   | Select your Azure subscription.                   |
    | Resource group                 | Select **CreatePrivateEndpointQS-rg**.            |
    | **Instance&nbsp;details**      |                                                   |
    | Virtual machine name           | Enter **myVM**.                                   |
    | Region                         | Select **West Europe**.                           |
    | Availability options           | Select **No infrastructure redundancy required**. |
    | Image                          | Select **Windows Server 2019 Datacenter - Gen2**. |
    | Azure Spot instance            | Clear the checkbox.                               |
    | Size                           | Select the VM size or use the default setting.    |
    | **Administrator&nbsp;account** |                                                   |
    | Authentication type            | Select **Password**                               |
    | Username                       | Enter a username.                                 |
    | Password                       | Enter a password.                                 |
    | Confirm password               | Reenter the password.                             |

1. Select the **Networking** tab.
  
1. On the **Networking** pane, enter the following values:

    |Setting                     | Value               |
    |----------------------------|---------------------|
    | **Network&nbsp;interface** |                     |
    | Virtual network            | Enter **myVNet**.   |
    | Subnet                     | Enter **mySubnet**. |
    | Public IP                  | Select **None**.    |
    | NIC network security group | Select **Basic**.   |
    | Public inbound ports       | Select **None**.    |
   
1. Select **Review + create**. 
  
1. Review the settings, and then select **Create**.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Create a private endpoint

Next, you create a private endpoint for the web app that you created in the "Prerequisites" section.

1. In the Azure portal, select **Create a resource**.

1. On the left pane, select **Networking**, and then select **Private Link**. You might have to search for **Private Link** and then select it in the search results.

1. On the **Private Link** page, select **Create**.

1. In **Private Link Center**, on the left pane, select **Private endpoints**.

1. On the **Private endpoints** pane, select **Create**.

1. On the **Create a private endpoint** pane, select the **Basics** tab, and then enter the following values:

    | Setting                   | Value                                                                                         |
    |---------------------------|-----------------------------------------------------------------------------------------------|
    | **Project&nbsp;details**  |                                                                                               |
    | Subscription              | Select your subscription.                                                                     |
    | Resource group            | Select **CreatePrivateEndpointQS-rg**. You created this resource group in an earlier section. |
    | **Instance&nbsp;details** |                                                                                               |
    | Name                      | Enter **myPrivateEndpoint**.                                                                  |
    | Region                    | Select **West Europe**.                                                                       |

1. Select the **Resource** tab.
    
1. On the **Resource** pane, enter the following values:

    | Setting             | Value                                                                                                                  |
    |---------------------|------------------------------------------------------------------------------------------------------------------------|
    | Connection method   | Select **Connect to an Azure resource in my directory**.                                                               |
    | Subscription        | Select your subscription.                                                                                              |
    | Resource type       | Select **Microsoft.Web/sites**.                                                                                        |
    | Resource            | Select **\<your-web-app-name>**. </br> Select the name of the web app that you created in the "Prerequisites" section. |
    | Target sub-resource | Select **sites**.                                                                                                      |

1. Click **Next** to the **Virtual Network** tab.

1. On the **Virtual Network** pane, enter the following values:

    | Setting                               | Value                                                        |
    |---------------------------------------|--------------------------------------------------------------|
    | **Networking**                        |                                                              |
    | Virtual network                       | Select **myVNet**.                                           |
    | Subnet                                | Select **mySubnet**.                                         |
    | **Private&nbsp;DNS&nbsp;integration** |                                                              |
    | Integrate with private DNS zone       | Keep the default of **Yes**.                                 |
    | Subscription                          | Select your subscription.                                    |
    | Resource Group                        | Select Resource Group **CreatePrivateEndpointQS-rg**.        |
    | Private DNS zones                     | Keep the default of **(New) privatelink.azurewebsites.net**. |
    

1. Click **Next** to **Review + create**.

1. Select **Create**.

## Test connectivity to the private endpoint

Use the VM that you created earlier to connect to the web app across the private endpoint.

1. In the Azure portal, on the left pane, select **Resource groups**.

1. Select **CreatePrivateEndpointQS-rg**.

1. Select **myVM**.

1. On the overview page for **myVM**, select **Connect**, and then select **Bastion**.

1. Select the blue **Use Bastion** button.

1. Enter the username and password that you used when you created the VM.

1. After you've connected, open PowerShell on the server.

1. Enter `nslookup <your-webapp-name>.azurewebsites.net`, replacing *\<your-webapp-name>* with the name of the web app that you created earlier. You'll receive a message that's similar to the following:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mywebapp8675.privatelink.azurewebsites.net
    Address:  10.1.0.5
    Aliases:  mywebapp8675.azurewebsites.net
    ```

    A private IP address of **10.1.0.5** is returned for the web app name. This address is in the subnet of the virtual network you created earlier.

1. In the bastion connection to **myVM**, open your web browser.

1. Enter the URL of your web app, **https://\<your-webapp-name>.azurewebsites.net**.

   If your web app hasn't been deployed, you'll get the following default web app page:

    :::image type="content" source="./media/create-private-endpoint-portal/web-app-default-page.png" alt-text="Screenshot of the default web app page on a browser." border="true":::

1. Close the connection to **myVM**.

## Clean up resources

If you're not going to continue to use this web app, delete the virtual network, virtual machine, and web app by doing the following:

1. On the left pane, select **Resource groups**.

1. Select **CreatePrivateEndpointQS-rg**.

1. Select **Delete resource group**.

1. Under **Type the resource group name**, enter **CreatePrivateEndpointQS-rg**.

1. Select **Delete**.

## What you've learned

In this quickstart, you created:

* A virtual network and bastion host
* A virtual machine
* A private endpoint for an Azure web app

You used the VM to test connectivity to the web app across the private endpoint.

## Next steps

For more information about the services that support private endpoints, see:
> [!div class="nextstepaction"]
> [What is Azure Private Link?](private-link-overview.md#availability)
