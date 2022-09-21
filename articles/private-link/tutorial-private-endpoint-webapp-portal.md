---
title: 'Tutorial: Connect to a web app using an Azure Private endpoint'
titleSuffix: Azure Private Link
description: Get started with this tutorial using Azure Private endpoint to connect to a webapp privately.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: tutorial
ms.date: 06/22/2022
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
---

# Tutorial: Connect to a web app using an Azure Private Endpoint

Azure Private endpoint is the fundamental building block for Private Link in Azure. It enables Azure resources, like virtual machines (VMs), to privately and securely communicate with Private Link resources such as a web app.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and bastion host.
> * Create a virtual machine.
> * Create a web app.
> * Create a private endpoint.
> * Test connectivity to the web app private endpoint.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!Note]
> Private Endpoint is available in public regions for PremiumV2-tier, PremiumV3-tier Windows web apps, Linux web apps, and the Azure Functions Premium plan (sometimes referred to as the Elastic Premium plan). 

## Prerequisites

* An Azure subscription

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network and bastion host

In this section, you'll create a virtual network, subnet, and bastion host. 

The bastion host will be used to connect securely to the virtual machine for testing the private endpoint.

1. On the upper-left side of the screen, select **Create a resource > Networking > Virtual network** or search for **Virtual network** in the search box.

2. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | Setting          | Value                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription.                                  |
    | Resource Group   | Select **Create new**. </br> Enter **myResourceGroup** in **Name**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**.                                    |
    | Region           | Select **East US**. |

3. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

4. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16**. |

5. Under **Subnet name**, select the word **default**.

6. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **mySubnet**. |
    | Subnet address range | Enter **10.1.0.0/24**. |

7. Select **Save**.

8. Select the **Security** tab.

9. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost**. |
    | AzureBastionSubnet address space | Enter **10.1.1.0/24**. |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |

8. Select the **Review + create** tab or select the **Review + create** button.

9. Select **Create**.

## Create a virtual machine

In this section, you'll create a virtual machine that will be used to test the private endpoint.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine** or search for **Virtual machine** in the search box.
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM**. |
    | Region | Select **(US) East US**. |
    | Availability Options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2019 Datacenter - Gen2**. |
    | Azure Spot instance | Select **No**. |
    | Size | Choose VM size or take default setting. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select this information:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports | Select **None**. |
   
5. Select **Review + create**. 
  
6. Review the settings, and then select **Create**.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Create a web app

In this section, you'll create a web app.

1. In the left-hand menu, select **Create a resource** > **Web** > **Web App**, or search for **Web App** in the search box.

2. In the **Basics** tab of **Create Web App** enter or select the following information:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Name | Enter **mywebapp**. If the name is unavailable, enter a unique name. |
    | Publish | Select **Code**. |
    | Runtime stack | Select **.NET Core 3.1 (LTS)**. |
    | Operating System | Select **Windows**. |
    | Region | Select **East US**. |
    | **App Service Plan** |  |
    | Windows Plan (East US) | Select **Create new**. </br> Enter **myServicePlan** in **Name**. </br> Select **OK**. |
    | Sku and size | Select **Change size**. </br> Select **P2V2** in the **Spec Picker** page. </br> Select **Apply**. |
    | **Zone redundancy** |  |
    | Zone redundancy | Select **Disabled**. |
   
3. Select **Review + create**.

4. Select **Create**.

    :::image type="content" source="./media/tutorial-private-endpoint-webapp-portal/create-web-app-inline.png" alt-text="Screenshot of Create Web App page showing the settings used in the Basics tab to create the web app." lightbox="./media/tutorial-private-endpoint-webapp-portal/create-web-app-expanded.png":::

## Create private endpoint

1. In the left-hand menu, select **All Resources** > **mywebapp** or the name you chose during web app creation.

2. In the web app overview, select **Settings** > **Networking**.

3. In **Networking**, select **Private endpoints**.

4. Select **+ Add** in the **Private Endpoint connections** page.

5. Enter or select the following information in the **Add Private Endpoint** page:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **mywebappendpoint**. |
    | Subscription | Select your Azure subscription. |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet**. |
    | Integrate with private DNS zone | Select **Yes**. |

6. Select **OK**.

    :::image type="content" source="./media/tutorial-private-endpoint-webapp-portal/add-private-endpoint-inline.png" alt-text="Screenshot of Add Private Endpoint page showing the settings used to create the private endpoint." lightbox="./media/tutorial-private-endpoint-webapp-portal/add-private-endpoint-expanded.png":::        

## Test connectivity to private endpoint

In this section, you'll use the virtual machine you created in the previous step to connect to the web app across the private endpoint.

1. Select **Resource groups** in the left-hand navigation pane.

2. Select **myResourceGroup**.

3. Select **myVM**.

4. On the overview page for **myVM**, select **Connect** then **Bastion**.

5. Enter the username and password that you entered during the virtual machine creation.

6. Select **Connect** button.

7. Open Windows PowerShell on the server after you connect.

8. Enter `nslookup <webapp-name>.azurewebsites.net`. Replace **\<webapp-name>** with the name of the web app you created in the previous steps.  You'll receive a message similar to what is displayed below:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mywebapp.privatelink.azurewebsites.net
    Address:  10.1.0.5
    Aliases:  mywebapp.azurewebsites.net
    ```

    A private IP address of **10.1.0.5** is returned for the web app name. This address is in **mySubnet** subnet of **myVNet** virtual network you created previously.

9. Open Internet Explorer, and enter the URL of your web app, `https://<webapp-name>.azurewebsites.net`.

10. Verify you receive the default web app page.

    :::image type="content" source="./media/tutorial-private-endpoint-webapp-portal/web-app-default-page.png" alt-text="Screenshot of Internet Explorer showing default web app page." border="true":::

11. Close the connection to **myVM**.

12. Open a web browser on your local computer and enter the URL of your web app, `https://<webapp-name>.azurewebsites.net`.

13. Verify that you receive a **403** page. This page indicates that the web app isn't accessible externally.

    :::image type="content" source="./media/tutorial-private-endpoint-webapp-portal/web-app-ext-403.png" alt-text="Screenshot of web browser showing a blue page with Error 403 for external web app address." border="true":::

## Clean up resources

If you're not going to continue to use this application, delete the virtual network, virtual machine, and web app with the following steps:

1. From the left-hand menu, select **Resource groups**.

2. Select **myResourceGroup**.

3. Select **Delete resource group**.

4. Enter **myResourceGroup** in **TYPE THE RESOURCE GROUP NAME**.

5. Select **Delete**.

## Next steps

Learn how to connect to an Azure SQL server using an Azure Private Endpoint:
> [!div class="nextstepaction"]
> [Connect to Azure SQL server using Private Endpoint](tutorial-private-endpoint-sql-portal.md)
