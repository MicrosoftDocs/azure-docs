---

title: 'Quickstart - Create a Private Endpoint using the Azure portal'
description: Use this quickstart to learn how to create a Private Endpoint using the Azure portal.
services: private-link
author: asudbring
# Customer intent: As someone with a basic network background, but is new to Azure, I want to create a private endpoint on a SQL server so that I can securely connect to it.
ms.service: private-link
ms.topic: quickstart
ms.date: 10/20/2020
ms.author: allensu

---

# Quickstart: Create a Private Endpoint using the Azure portal

Get started with Azure Private Link by using a Private Endpoint to connect securely to an Azure web app.

In this quickstart, you'll create a private endpoint for an Azure web app and deploy a virtual machine to test the private connection.  

Private endpoints can be created for different kinds Azure services such as Azure SQL and Azure Storage.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Web App with a **PremiumV2-tier** or higher app service plan deployed in your Azure subscription.  
    * For more information and an example, see [Quickstart: Create an ASP.NET Core web app in Azure](../app-service/quickstart-dotnetcore.md). 
    * For a detailed tutorial on creating a web app and an endpoint, see [Tutorial: Connect to a web app using an Azure Private Endpoint](tutorial-private-endpoint-webapp-portal).

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create a virtual network and bastion host

In this section, you'll create a virtual network, subnet, and bastion host. 

The bastion host will be used to connect securely to the virtual machine for testing the private endpoint.

1. On the upper-left side of the screen, select **Create a resource > Networking > Virtual network** or search for **Virtual network** in the search box.

2. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **CreatePrivateEndpointQS-rg** |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **\<your-web-app-region>**. </br> Select the region where your web app is deployed.|

3. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

4. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

5. Under **Subnet name**, select the word **default**.

6. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **mySubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |

7. Select **Save**.

8. Select the **Security** tab.

9. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/24** |
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
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **CreatePrivateEndpointQS-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM** |
    | Region | Select **\<your-web-app-region>**. </br> Select the region where your web app is deployed. |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Image | Select **Windows Server 2019 Datacenter - Gen1** |
    | Azure Spot instance | Select **No** |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | **myVNet** |
    | Subnet | **mySubnet** |
    | Public IP | Select **None**. |
    | NIC network security group | **Basic**|
    | Public inbound ports | Select **None**. |
   
5. Select **Review + create**. 
  
6. Review the settings, and then select **Create**.

## Create a Private Endpoint

In this section, you'll create a Private Endpoint for the web app you created in the prerequisites section.

1. On the upper-left side of the screen in the portal, select **Create a resource** > **Networking** > **Private Link**, or in the search box enter **Private Link**.

2. Select **Create**.

3. In **Private Link Center**, select **Private endpoints** in the left-hand menu.

4. In **Private endpoints**, select **+ Add**.

5. In the **Basics** tab of **Create a private endpoint**, enter, or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **CreatePrivateEndpointQS-rg**. You created this resource group in the previous section.|
    | **Instance details** |  |
    | Name  | Enter **myPrivateEndpoint**. |
    | Region | Select **\<your-web-app-region>**. </br> Select the region where your web app is deployed. |

6. Select the **Resource** tab or the **Next: Resource** button at the bottom of the page.
    
7. In **Resource**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Connection method | Select **Connect to an Azure resource in my directory**. |
    | Subscription | Select your subscription. |
    | Resource type | Select **Microsoft.Web/sites**. |
    | Resource | Select **\<your-web-app-name>**. </br> Select the name of the web app you created in the prerequisites. |
    | Target sub-resource | Select **sites**. |

8. Select the **Configuration** tab or the **Next: Configuration** button at the bottom of the screen.

9. In **Configuration**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **Networking** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet**. |
    | **Private DNS integration** |  |
    | Integrate with private DNS zone | Leave the default of **Yes**. |
    | Subscription | Select your subscription. |
    | Private DNS zones | Leave the default of **(New) privatelink.azurewebsites.net**.
    

13. Select **Review + create**.

14. Select **Create**.

## Test connectivity to private endpoint

In this section, you'll use the virtual machine you created in the previous step to connect to the web app across the private endpoint.

1. Select **Resource groups** in the left-hand navigation pane.

2. Select **CreatePrivateEndpointQS-rg**.

3. Select **myVM**.

4. On the overview page for **myVM**, select **Connect** then **Bastion**.

5. Select the blue **Use Bastion** button.

6. Enter the username and password that you entered during the virtual machine creation.

7. Open Windows PowerShell on the server after you connect.

8. Enter `nslookup <your-webapp-name>.azurewebsites.net`. Replace **\<your-webapp-name>** with the name of the web app you created in the previous steps.  You'll receive a message similar to what is displayed below:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mywebapp8675.privatelink.azurewebsites.net
    Address:  10.1.0.5
    Aliases:  mywebapp8675.azurewebsites.net
    ```

    A private IP address of **10.1.0.5** is returned for the web app name.  This address is in the subnet of the virtual network you created previously.

11. In the bastion connection to **myVM**, open Internet Explorer.

12. Enter the url of your web app, **https://\<your-webapp-name>.azurewebsites.net**.

13. You'll receive the default web app page if your application hasn't been deployed:

    :::image type="content" source="./media/create-private-endpoint-portal/web-app-default-page.png" alt-text="Default web app page." border="true":::

18. Close the connection to **myVM**.

## Clean up resources

If you're not going to continue to use this application, delete the virtual network, virtual machine, and web app with the following steps:

1. From the left-hand menu, select **Resource groups**.

2. Select **CreatePrivateEndpointQS-rg**.

3. Select **Delete resource group**.

4. Enter **CreatePrivateEndpointQS-rg** in **TYPE THE RESOURCE GROUP NAME**.

5. Select **Delete**.


## Next steps

In this quickstart, you created a:

* Virtual network and bastion host.
* Virtual machine.
* Private endpoint for an Azure Web App.

You used the virtual machine to test connectivity securely to the web app across the private endpoint.



For more information on the services that support a private endpoint, see:
> [!div class="nextstepaction"]
> [Private Link availability](private-link-overview.md#availability)
