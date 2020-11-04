---

title: 'Tutorial - Connect to an Azure SQL server using an Azure Private Endpoint - Portal'
description: Use this tutorial to learn how to create a Azure SQL server with a private endpoint using the Azure portal.
services: private-link
author: asudbring
# Customer intent: As someone with a basic network background, but is new to Azure, I want to create a private endpoint on a SQL server so that I can securely connect to it.
ms.service: private-link
ms.topic: tutorial
ms.date: 10/20/2020
ms.author: allensu

---

# Tutorial - Connect to an Azure SQL server using an Azure Private Endpoint - Azure portal

Azure Private endpoint is the fundamental building block for Private Link in Azure. It enables Azure resources, like virtual machines (VMs), to communicate with Private Link resources privately.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and bastion host.
> * Create a virtual machine.
> * Create a Azure SQL server and private endpoint.
> * Test connectivity to the SQL server private endpoint.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

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
    | Resource Group   | Select **CreateSQLEndpointTutorial-rg** |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **East US** |

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
    | Resource Group | Select **CreateSQLEndpointTutorial** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM** |
    | Region | Select **East US** |
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

## <a name ="create-a-private-endpoint"></a>Create an Azure SQL server and private endpoint

In this section, you'll create a SQL server in Azure. 

1. On the upper-left side of the screen in the Azure portal, select **Create a resource** > **Databases** > **SQL database**.

1. In the **Basics** tab of **Create SQL database**, enter, or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **CreateSQLEndpointTutorial**. You created this resource group in the previous section.|
    | **Database details** |  |
    | Database name  | Enter **mysqldatabase**. If this name is taken, create a unique name. |
    | Server | Select **Create new**. |

6. In **New server**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Server name  | Enter **mysqlserver**. If this name is taken, create a unique name.|
    | Server admin login | Enter an administrator name of your choosing. |
    | Password | Enter a password of your choosing. The password must be at least 8 characters long and meet the defined requirements. |
    | Location | Select **East US** |
    
7. Select **OK**.

8. Select the **Networking** tab or select the **Next: Networking** button.

9. In the **Networking** tab, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **Network connectivity** | |
    | Connectivity method | Select **Private endpoint**. |
   
10. Select **+ Add private endpoint** in **Private endpoints**.

11. In **Create private endpoint**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription. |
    | Resource group | Select **CreateSQLEndpointTutorial**. |
    | Location | Select **East US**. |
    | Name | Enter **myPrivateSQLendpoint**. |
    | Target sub-resource | Select **SQLServer**. |
    | **Networking** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet**. |
    | **Private DNS integration** | |
    | Integrate with private DNS zone | Leave the default **Yes**. |
    | Private DNS Zone | Leave the default **(New) privatelink.database.windows.net**. |

12. Select **OK**. 

13. Select **Review + create**.

14. Select **Create**.

## Test connectivity to private endpoint

In this section, you'll use the virtual machine you created in the previous step to connect to the SQL server across the private endpoint.

1. Select **Resource groups** in the left-hand navigation pane.

2. Select **CreateSQLEndpointTutorial**.

3. Select **myVM**.

4. On the overview page for **myVM**, select **Connect** then **Bastion**.

5. Select the blue **Use Bastion** button.

6. Enter the username and password that you entered during the virtual machine creation.

7. Open Windows PowerShell on the server after you connect.

8. Enter `nslookup <sqlserver-name>.database.windows.net`. Replace **\<sqlserver-name>** with the name of the SQL server you created in the previous steps.  You'll receive a message similar to what is displayed below:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mysqlserver8675.privatelink.database.windows.net
    Address:  10.1.0.5
    Aliases:  mysqlserver8675.database.windows.net
    ```

    A private IP address of **10.1.0.5** is returned for the SQL server name.  This address is in the subnet of the virtual network you created previously.


9. Install [SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-2017&preserve-view=true) on **myVM**.

10. Open **SQL Server Management Studio**.

4. In **Connect to server**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Server type | Select **Database Engine**.|
    | Server name | Enter **\<sqlserver-name>.database.windows.net** |
    | Authentication | Select **SQL Server Authentication**. |
    | User name | Enter the username you entered during server creation |
    | Password | Enter the password you entered during server creation |
    | Remember password | Select **Yes**. |

1. Select **Connect**.
2. Browse databases from left menu.
3. (Optionally) Create or query information from **mysqldatabase**.
4. Close the remote desktop connection to **myVM**. 

## Clean up resources 
When you're done using the private endpoint, SQL server, and the VM, delete the resource group and all of the resources it contains: 
1. Enter **CreateSQLEndpointTutorial** in the **Search** box at the top of the portal and select **CreateSQLEndpointTutorial** from the search results. 
2. Select **Delete resource group**. 
3. Enter CreateSQLEndpointTutorial for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

In this tutorial, you created a:

* Virtual network and bastion host.
* Virtual machine.
* Azure SQL server with private endpoint.

You used the virtual machine to test connectivity securely to the SQL server across the private endpoint.

Learn how to create a Private Link service:
> [!div class="nextstepaction"]
> [Create a Private Link service](create-private-link-service-portal.md)
