---
title: Tutorial - Route traffic to weighted endpoints using Azure Traffic Manager | Microsoft Docs
description: This tutorial article describes how to route traffic to weighted endpoints using Traffic Manager.
services: traffic-manager
author: KumudD
Customer intent: As an IT Admin, I want to distribute traffic based on the weight assigned to a website endpoint so that I can control the user traffic to a given website.
ms.service: traffic-manager
ms.topic: tutorial
ms.date: 10/15/2018
ms.author: kumud
---

# Tutorial: Control traffic routing with weighted endpoints using Traffic Manager 

This tutorial describes how to use Traffic Manager to control routing of user traffic between endpoints using the weighted routing method. In this routing method, you assign weights to each endpoint in the Traffic Manager profile configuration and user traffic is routed based on the weight assigned to each endpoint. The weight is an integer from 1 to 1000. The higher the weight value assigned to a endpoint, the higher its priority.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create two VMs running a basic website on IIS
> * Create two test VMs to view Traffic Manager in action
> * Configure DNS name for the VMs running IIS
> * Create a Traffic Manager profile
> * Add VM endpoints to the Traffic Manager profile
> * View Traffic Manager in action

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
In order to see the Traffic Manager in action, this tutorial requires that you deploy the following:
- two instances of basic websites running in different Azure regions - **East US** and **West Europe**.
- two test VMs for testing the Traffic Manager - one VM in **East US** and the second VM in **West Europe**. The test VMs are used to illustrate how Traffic Manager routes user traffic to a website that has higher weight assigned to its endpoint.

### Sign in to Azure 

Sign in to the Azure portal at https://portal.azure.com.

### Create websites

In this section, you create two website instances that provide the two service endpoints for the Traffic Manager profile in two Azure regions. Creating the two websites includes the following steps:
1. Create two VMs for running a basic website - one in **East US**, and the other in **West Europe**.
2. Install IIS server on each VM and update the default website page that describes the VM name that a user is connected to when visiting the website.

#### Create VMs for running websites
In this section, you create two VMs *myIISVMEastUS* and *myIISVMWEurope* in the **East US** and **West Europe** Azure regions.

1. On the upper, left corner of the Azure portal, select **Create a resource** > **Compute** > **Windows Server 2016 VM**.
2. Enter, or select, the following information for **Basics**, accept the defaults for the remaining settings, and then select **Create**:

    |Setting|Value|
    |---|---|
    |Name|myIISVMEastUS|
    |User name| Enter a user name of your choosing.|
    |Password| Enter a password of your choosing. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.md?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm).|
    |Resource group| Select **New** and then type *myResourceGroupTM1*.|
    |Location| Select **East US**.|
    |||
4. Select a VM size under **Choose a size**.
5. Select the following values for **Settings**, then select **OK**:
    
    |Setting|Value|
    |---|---|
    |Virtual network| Select **Virtual network**, in **Create virtual network**, for **Name**, enter *myVNet1*, for subnet, enter *mySubnet*.|
    |Network Security Group|Select **Basic**, and in **Select public inbound ports** drop-down, select **HTTP** and **RDP** |
    |Boot diagnostics|Select **Disabled**.|
    |||
6. Under **Create** in the **Summary**, select **Create** to start the VM deployment.

7. Complete steps 1-6 again, with the following changes:

    |Setting|Value|
    |---|---|
    |Resource group | Select **New**, and then type *myResourceGroupTM2*|
    |Location|West Europe|
    |VM Name | myIISVMWEurope|
    |Virtual network | Select **Virtual network**, in **Create virtual network**, for **Name**, enter *myVNet2*, for subnet, enter *mySubnet*.|
    |||
8. The VMs take a few minutes to create. Do not continue with the remaining steps until both VMs are created.

![Create a VM](./media/tutorial-traffic-manager-improve-website-response/createVM.png)

#### Install IIS and customize the default web page

In this section, you install the IIS server on the two VMs - *myIISVMEastUS*  & *myIISVMWEurope*, and then update the default website page. The customized website page shows the name of the VM that you are connecting to when you visit the website from a web browser.

1. Select **All resources** in the left-hand menu, and then from the resources list click *myIISVMEastUS* that is located in the *myResourceGroupTM1* resource group.
2. On the **Overview** page, click **Connect**, and then in **Connect to virtual machine**, select **Download RDP file**. 
3. Open the downloaded rdp file. If prompted, select **Connect**. Enter the user name and password you specified when creating the VM. You may need to select **More choices**, then **Use a different account**, to specify the credentials you entered when you created the VM. 
4. Select **OK**.
5. You may receive a certificate warning during the sign-in process. If you receive the warning, select **Yes** or **Continue**, to proceed with the connection.
6. On the server desktop, navigate to **Windows Administrative Tools**>**Server Manager**.
7. Launch Windows PowerShell on VM1 and using the following commands to install IIS server and update the default htm file.
    ```powershell-interactive
    # Install IIS
      Install-WindowsFeature -name Web-Server -IncludeManagementTools
    
    # Remove default htm file
     remove-item  C:\inetpub\wwwroot\iisstart.htm
    
    #Add custom htm file
     Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from " + $env:computername)
    ```

     ![Install IIS and customize web page](./media/tutorial-traffic-manager-improve-website-response/deployiis.png)

8. Close the RDP connection with *myIISVMEastUS*.
9. Repeat steps 1-8 with by creating an RDP connection with the VM *myIISVMWEurope* within the *myResourceGroupTM2* resource group to install IIS and customize its default web page.

#### Configure DNS names for the VMs running IIS

Traffic Manager routes user traffic based on DNS name of the service endpoints. In this section, you configure the DNS names for the IIS servers -  *myIISVMEastUS* and *myIISVMWEurope*.

1. Click **All resources** in the left-hand menu, and then from the resources list, select *myIISVMEastUS* that is located in the *myResourceGroupTM1* resource group.
2. On the **Overview** page, under **DNS name**, select **Configure**.
3. On the **Configuration** page, under DNS name label, add a unique name, and then select **Save**.
4. Repeat steps 1-3, for the VM named *myIISVMWEurope* that is located in the *myResourceGroupTM1* resource group.

### Create a test VM

In this section, you create a VM - *mVMEastUS*. You will use this VM to test how Traffic Manager routes traffic to the website endpoint  that has the higher weight value.

1. On the upper, left corner of the Azure portal, select **Create a resource** > **Compute** > **Windows Server 2016 VM**.
2. Enter, or select, the following information for **Basics**, accept the defaults for the remaining settings, and then select **Create**:

    |Setting|Value|
    |---|---|
    |Name|myVMEastUS|
    |User name| Enter a user name of your choosing.|
    |Password| Enter a password of your choosing. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.md?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm).|
    |Resource group| Select **Existing** and then select *myResourceGroupTM1*.|
    |||

4. Select a VM size under **Choose a size**.
5. Select the following values for **Settings**, then select **OK**:
    |Setting|Value|
    |---|---|
    |Virtual network| Select **Virtual network**, in **Create virtual network**, for **Name**, enter *myVNet3*, for subnet, enter *mySubnet*.|
    |Network Security Group|Select **Basic**, and in **Select public inbound ports** drop-down, select **HTTP** and **RDP** |
    |Boot diagnostics|Select **Disabled**.|
    |||

6. Under **Create** in the **Summary**, select **Create** to start the VM deployment.
8. The VM takes a few minutes to create. Do not continue with the remaining steps until the VM is created.

## Create a Traffic Manager profile
Create a Traffic Manager profile based on the **Weighted** routing method.

1. On the top left-hand side of the screen, select **Create a resource** > **Networking** > **Traffic Manager profile** > **Create**.
2. In the **Create Traffic Manager profile**, enter or select, the following information, accept the defaults for the remaining settings, and then select **Create**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Name                   | This name needs to be unique within the trafficmanager.net zone and results in the DNS name, trafficmanager.net that is used to access your Traffic Manager profile.                                   |
    | Routing method          | Select the **Weighted** routing method.                                       |
    | Subscription            | Select your subscription.                          |
    | Resource group          | Select **Existing** and select *myResourceGroupTM1*. |
    |        |   |

    ![Create a Traffic Manager profile](./media/tutorial-traffic-manager-weighted-endpoint-routing/create-traffic-manager-profile.png)

## Add Traffic Manager endpoints

Add the two VMs running the IIS servers - *myIISVMEastUS*  & *myIISVMWEurope* to route user traffic to them.

1. In the portal’s search bar, search for the Traffic Manager profile name that you created in the preceding section and select the profile in the results that the displayed.
2. In **Traffic Manager profile**, in the **Settings** section, click **Endpoints**, and then click **Add**.
3. Enter, or select, the following information, accept the defaults for the remaining settings, and then select **OK**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Type                    | Azure endpoint                                   |
    | Name           | myEastUSEndpoint                                        |
    | Target resource type           | Public IP Address                          |
    | Target resource          | **Choose a Public IP address** to show the listing of resources with Public IP addresses under the same subscription. In **Resource**, select the public IP address named *myIISVMEastUS-ip*. This is the public IP address of the IIS server VM in East US.|
    |  Weight      | Enter **100**.        |
    |        |           |

4. Repeat steps 2 and 3 to add another endpoint named *myWestEuropeEndpoint* for the public IP address *myIISVMWEurope-ip* that is associated with the IIS server VM named *myIISVMWEurope* and for **Weight**, enter **25**. 
5.	When the addition of both endpoints is complete, they are displayed in **Traffic Manager profile** along with their monitoring status as **Online**.

## Test Traffic Manager profile
To view the Traffic Manager in action, complete the following steps:
1. Determine the DNS name of your Traffic Manager profile.
2. View Traffic Manager in action.

### Determine DNS name of Traffic Manager profile
In this tutorial, for simplicity, you use the DNS name of the Traffic Manager profile to visit the websites. 

You can determine the DNS name of the Traffic Manager profile as follows:

1.	In the portal’s search bar, search for the **Traffic Manager profile** name that you created in the preceding section. In the results that are displayed, click the traffic manager profile.
1. Click **Overview**.
2. The **Traffic Manager profile** displays the DNS name of your newly created Traffic Manager profile. In production deployments, you configure a vanity domain name to point to the Traffic Manager domain name, using a DNS CNAME record.

   ![Traffic Manager DNS name](./media/tutorial-traffic-manager-improve-website-response/traffic-manager-dns-name.png)

### View Traffic Manager in action
In this section, you can see the Traffic Manager is action. 

1. Select **All resources** in the left-hand menu, and then from the resources list click *myVMEastUS* that is located in the *myResourceGroupTM1* resource group.
2. On the **Overview** page, click **Connect**, and then in **Connect to virtual machine**, select **Download RDP file**. 
3. Open the downloaded rdp file. If prompted, select **Connect**. Enter the user name and password you specified when creating the VM. You may need to select **More choices**, then **Use a different account**, to specify the credentials you entered when you created the VM. 
4. Select **OK**.
5. You may receive a certificate warning during the sign-in process. If you receive the warning, select **Yes** or **Continue**, to proceed with the connection. 
6. In a web browser on the VM *myVMEastUS*, type the DNS name of your Traffic Manager profile to view your website. You are routed to website hosted on the IIS server *myIISVMEastUS* since it is assigned a higher weight of **100** as compared to the IIS server *myIISVMWEurope* (assigned a lower endpoint weight value of **25**).

   ![Test Traffic Manager profile](./media/tutorial-traffic-manager-improve-website-response/eastus-traffic-manager-test.png)
   
## Delete the Traffic Manager profile
When no longer needed, delete the resource groups that you have created in this tutorial. To do so, select the resource group (**ResourceGroupTM1** or **ResourceGroupTM2**), and then select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Route traffic to specific endpoints based on user's geographic location](traffic-manager-configure-geographic-routing-method.md)


