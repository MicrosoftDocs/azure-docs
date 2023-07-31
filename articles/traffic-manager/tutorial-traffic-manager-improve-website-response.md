---
title: 'Tutorial: Improve website response with Azure Traffic Manager'
description: This tutorial article describes how to create a Traffic Manager profile to build a highly responsive website.
services: traffic-manager
author: greg-lindsay
ms.service: traffic-manager
ms.topic: tutorial
ms.workload: infrastructure-services
ms.date: 03/06/2023
ms.author: greglin
ms.custom: template-tutorial
# Customer intent: As an IT Admin, I want to route traffic so I can improve website response by choosing the endpoint with lowest latency.
---

# Tutorial: Improve website response using Traffic Manager

This tutorial describes how to use Traffic Manager to create a highly responsive website by directing user traffic to the website with the lowest latency. Typically, the datacenter with the lowest latency is the one that is closest in geographic distance.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create two VMs running a basic website on IIS
> * Create two test VMs to view Traffic Manager in action
> * Configure DNS name for the VMs running IIS
> * Create a Traffic Manager profile for improved website performance
> * Add VM endpoints to the Traffic Manager profile
> * View Traffic Manager in action

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

In order to see the Traffic Manager in action, this tutorial requires that you deploy the following:

- Two instances of basic websites running in different Azure regions - **East US** and **West Europe**.
- Two test VMs for testing the Traffic Manager - one VM in **East US** and the second VM in **West Europe**. The test VMs are used to illustrate how Traffic Manager routes user traffic to the website that is running in the same region as it provides the lowest latency.

### Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

### Create websites

In this section, you create two website instances that provide the two service endpoints for the Traffic Manager profile in two Azure regions. Creating the two websites includes the following steps:

1. Create two VMs for running a basic website - one in **East US**, and the other in **West Europe**.
1. Install IIS server on each VM and update the default website page that describes the VM name that a user is connected to when visiting the website.

#### Create VMs for running websites

In this section, you create two VMs **myIISVMEastUS** and **myIISVMWestEurope** in the **East US** and **West Europe** Azure regions.

1. Enter *virtual machines* in the search.
1. Under **Services**, select **Virtual machines**.
1. In the **Virtual machines** page, select **Create** and then **Azure virtual machine**. The **Create a virtual machine** page opens.
1. In **Create a virtual machine**, type or select the following values in the **Basics** tab:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Subscription            | Select your subscription.                          |    
    | Resource Group | Select **Create new** and enter *myResourceGroupTM1* in the text box. |
    | Virtual machine name | Enter a name for your virtual machine. This example uses **myIISVMEastUS**. |
    | Region | Select **East US**. |
    | Availability options | Azure offers a range of options for managing availability and resiliency for your applications. For this example, select **No infrastructure redundancy required**. |
    | Security type | Security type refers to the different security features available for a virtual machine. For this example, select **Standard**. |
    | Image | Choose the base operating system or application for the VM. For this example, select **Windows Server 2019 Datacenter**. |
    | VM architecture | Leave as default. |
    | Size | Leave as default. |
    | Administrator Account | Enter a user name and password of your choosing. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.yml?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm-). |
    | Public inbound ports | Select **Allow selected ports** and select **RDP** and **HTTP** in the pull-down box.|

    :::image type="content" source="./media/tutorial-traffic-manager-improve-website-response/createVM.png" alt-text="Screenshot of creating a VM.":::

1. Select the **Management** tab, or select **Next: Disks**, then **Next: Networking**, then **Next: Management**. Under **Monitoring**, set **Boot diagnostics** to **Disable**.

    :::image type="content" source="./media/tutorial-traffic-manager-improve-website-response/boot-diagnostics.png" alt-text="Screenshot of boot diagnostics.":::

1. Select **Review + create**.
1. Review the settings, and then select **Create**.  
1. Follow the steps to create a second VM named **myIISVMWestEurope**, with a *Resource group* name of **myResourceGroupTM2**, a *location* of **West Europe**, and all the other settings the same as **myIISVMEastUS**.
1. The VMs take a few minutes to create. Don't continue with the remaining steps until both VMs are created.

#### Connect to virtual machine 

In this section, you connect to the two VMs *myIISVMEastUS* and *myIISVMWestEurope* using Bastion. 

1. Select **All resources** in the left-hand menu, and then from the resources list select *myIISVMEastUS* that is located in the *myResourceGroupTM1* resource group.
1. On the **Overview** page, select **Connect**, and then select **Bastion**.

    :::image type="content" source="./media/tutorial-traffic-manager-improve-website-response/connect-to-bastion.png" alt-text="Screenshot of connecting to bastion.":::

1. In **Connect**, select **Use Bastion**, then select **Deploy Bastion**.

    :::image type="content" source="./media/tutorial-traffic-manager-improve-website-response/deploy-bastion.png" alt-text="Screenshot of deploying bastion.":::

1. Bastion begins deploying. This can take around 10 minutes to complete.
1. When the Bastion deployment is complete, the screen changes to the **Connect** page. Type your authentication credentials. Then, select **Connect**.

    :::image type="content" source="./media/tutorial-traffic-manager-improve-website-response/connect-to-bastion-password.png" alt-text="Screenshot of connecting to virtual machine using bastion.":::

To learn more about Azure Bastion, see [What is Azure Bastion?](../bastion/bastion-overview.md)
#### Install IIS and customize the default web page 

In this section, you install the IIS server on the two VMs *myIISVMEastUS* and *myIISVMWestEurope*, and then update the default website page. The customized website page shows the name of the VM that you're connecting to when you visit the website from a web browser.

1. On the server desktop, navigate to **Windows Administrative Tools**>**Server Manager**.
1. Launch Windows PowerShell on VM1 and using the following commands to install IIS server and update the default htm file.

    ```powershell-interactive
    # Install IIS
    Install-WindowsFeature -name Web-Server -IncludeManagementTools

    # Remove default htm file
    remove-item C:\inetpub\wwwroot\iisstart.htm

    #Add custom htm file
    Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from " + $env:computername)
    ```
    :::image type="content" source="./media/tutorial-traffic-manager-improve-website-response/deployiis.png" alt-text="Screenshot of installing IIS and customizing web page.":::

1. Repeat steps 1-8 with by creating an RDP connection with the VM *myIISVMWestEurope* within the *myResourceGroupTM2* resource group to install IIS and customize its default web page.

#### Configure DNS names for the VMs running IIS

Traffic Manager routes user traffic based on DNS name of the service endpoints. In this section, you configure the DNS names for the IIS servers - *myIISVMEastUS* and *myIISVMWestEurope*.

1. Select **All resources** in the left-hand menu, and then from the resources list, select *myIISVMEastUS* that is located in the *myResourceGroupTM1* resource group.
1. On the **Overview** page, under **DNS name**, select **Not-configured**.

    :::image type="content" source="./media/tutorial-traffic-manager-improve-website-response/dns-name.png" alt-text="Screenshot of DNS name.":::

1. On the **Configuration** page, under **DNS name label**, add a unique name, and then select **Save**.

    :::image type="content" source="./media/tutorial-traffic-manager-improve-website-response/dns-configure-name.png" alt-text="Screenshot of configuring DNS name.":::

1. Repeat steps 1-3, for the VM named *myIISVMWestEurope* that is located in the *myResourceGroupTM2* resource group.

### Create test VMs

In this section, you create a VM (*myVMEastUS* and *myVMWestEurope*) in each Azure region (**East US** and **West Europe**). You'll use these VMs to test how Traffic Manager routes traffic to the nearest IIS server when you browse to the website.

1. On the upper, left corner of the Azure portal, select **Create a resource** > **Compute** > **Windows Server 2019 Datacenter**.
1. In **Create a virtual machine**, type or select the following values in the **Basics** tab:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Subscription            | Select your subscription.                          |    
    | Resource Group | Select **myResourceGroupTM1** in the text box. |
    | Virtual machine name | Enter a name for your virtual machine. This example uses **myVMEastUS**. |
    | Region | Select **East US**. |
    | Availability options | Azure offers a range of options for managing availability and resiliency for your applications. For this example, select **No infrastructure redundancy required**. |
    | Security type | Security type refers to the different security features available for a virtual machine. For this example, select **Standard**. |
    | Image | Choose the base operating system or application for the VM. For this example, select **Windows Server 2019 Datacenter**. |
    | VM architecture | Leave as default. |
    | Size | Leave as default. |
    | Administrator Account | Enter a user name and password of your choosing. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.yml?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm-). |
    | Public inbound ports | Select **Allow selected ports** and select **RDP** and **HTTP** in the pull-down box.|

1. Select the **Management** tab, or select **Next: Disks**, then **Next: Networking**, then **Next: Management**. Under **Monitoring**, set **Boot diagnostics** to **Disable**.
1. Select **Review + create**.
1. Review the settings, and then select **Create**.  
1. Follow the steps to create a second VM named **myVMWestEurope**, with a *Resource group* name of **myResourceGroupTM2**, a *location* of **West Europe**, and all the other settings the same as **myVMEastUS***.
1. The VMs take a few minutes to create. Don't continue with the remaining steps until both VMs are created.

## Create a Traffic Manager profile

Create a Traffic Manager profile that directs user traffic by sending them to the endpoint with lowest latency.

1. On the top left-hand side of the screen, select **Create a resource** > **Networking** > **Traffic Manager profile** > **Create**.
1. In the **Create Traffic Manager profile**, enter or select, the following information, accept the defaults for the remaining settings, and then select **Create**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Name                   | This name needs to be unique within the trafficmanager.net zone and results in the DNS name, trafficmanager.net that is used to access your Traffic Manager profile.                                   |
    | Routing method          | Select the **Performance** routing method.                                       |
    | Subscription            | Select your subscription.                          |
    | Resource group          | Select the Resource group *myResourceGroupTM1*. |
    | Location                | Select **East US**. This setting refers to the location of the resource group, and has no impact on the Traffic Manager profile that will be deployed globally.                              |
    |

    :::image type="content" source="./media/tutorial-traffic-manager-improve-website-response/traffic-manager-profile.png" alt-text="Screenshot of creating a Traffic Manager profile.":::


## Add Traffic Manager endpoints

Add the two VMs running the IIS servers - *myIISVMEastUS* & *myIISVMWestEurope* to route user traffic to the closest endpoint to the user.

1. In the portal’s search bar, search for the Traffic Manager profile name that you created in the preceding section and select the profile in the results that the displayed.
1. In **Traffic Manager profile**, in the **Settings** section, select **Endpoints**, and then select **Add**.

    :::image type="content" source="./media/tutorial-traffic-manager-improve-website-response/traffic-manager-add-endpoint.png" alt-text="Screenshot of adding a Traffic Manager endpoint.":::

1. In the *Add Endpoint* page, enter the following information, accept the defaults for the remaining settings, and then select **OK**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Type                    | Azure endpoint                                   |
    | Name           | myEastUSEndpoint                                        |
    | Target resource type           | Public IP Address                          |
    | Target resource          | **Choose a Public IP address** to show the listing of resources with Public IP addresses under the same subscription. In **Resource**, select the public IP address named *myIISVMEastUS-ip*. This is the public IP address of the IIS server VM in East US.|
    |        |           |

    :::image type="content" source="./media/tutorial-traffic-manager-improve-website-response/traffic-manager-configure-endpoint.png" alt-text="Screenshot of configuring a Traffic Manager endpoint.":::

1. Repeat steps 2 and 3 to add another endpoint named **myWestEuropeEndpoint** for the public IP address *myIISVMWestEurope-ip* that is associated with the IIS server VM named *myIISVMWestEurope*.
1. When the addition of both endpoints is complete, they're displayed in **Traffic Manager profile** along with their monitoring status as **Online**.

    :::image type="content" source="./media/tutorial-traffic-manager-improve-website-response/traffic-manager-endpoint.png" alt-text="Screenshot of viewing a Traffic Manager endpoint status.":::


## Test Traffic Manager profile

In this section, you test how the Traffic Manager routes user traffic to the nearest VMs running the website to provide minimum latency. To view the Traffic Manager in action, complete the following steps:

1. Determine the DNS name of your Traffic Manager profile.
1. View Traffic Manager in action as follows:
    - From the test VM (*myVMEastUS*) that is located in the **East US** region, in a web browser, browse to the DNS name of your Traffic Manager profile.
    - From the test VM (*myVMWestEurope*) that is located in the **West Europe** region, in a web browser, browse to the DNS name of your Traffic Manager profile.

### Determine DNS name of Traffic Manager profile

In this tutorial, for simplicity, you use the DNS name of the Traffic Manager profile to visit the websites.

You can determine the DNS name of the Traffic Manager profile as follows:

1. In the portal’s search bar, search for the **Traffic Manager profile** name that you created in the preceding section. In the results that are displayed, select the traffic manager profile.
1. Select **Overview**.
1. The **Traffic Manager profile** displays the DNS name of your newly created Traffic Manager profile. In production deployments, you configure a vanity domain name to point to the Traffic Manager domain name, using a DNS CNAME record.

    :::image type="content" source="./media/tutorial-traffic-manager-improve-website-response/traffic-manager-dns-name.png" alt-text="Screenshot of Traffic Manager DNS name.":::

### View Traffic Manager in action

In this section, you can see the Traffic Manager is action.

1. Select **All resources** in the left-hand menu, and then from the resources list select **myVMEastUS** that is located in the *myResourceGroupTM1* resource group.
1. On the **Overview** page, select **Connect**, and select **Bastion**.
1. Type your authentication credentials. Then, select **Connect**.
1. In a web browser on the VM *myVMEastUS*, type the DNS name of your Traffic Manager profile to view your website. Since the VM located in **East US**, you're routed to the nearest website hosted on the nearest IIS server *myIISVMEastUS* that is located in **East US**.

    :::image type="content" source="./media/tutorial-traffic-manager-improve-website-response/eastus-traffic-manager-test.png" alt-text="Screenshot that shows the Traffic Manager profile in a web browser for East US.":::

1. Next, connect to the VM *myVMWestEurope* located in **West Europe** using steps 1-5 and browse to the Traffic Manager profile domain name from this VM. Since the VM located in **West Europe**, you're now routed to the website hosted on nearest the IIS server *myIISVMWestEurope* that is located in **West Europe**.

    :::image type="content" source="./media/tutorial-traffic-manager-improve-website-response/westeurope-traffic-manager-test.png" alt-text="Screenshot that shows the Traffic Manager profile in a web browser for West Europe.":::


## Clean up resources

When no longer needed, you can delete the resource group, virtual machine, and all related resources.

1. Enter the name of your resource group in the **Search** box at the top of the portal and select it from the search results.
1. At the top of the page for the resource group, select **Delete resource group**. 
1. A page will open warning you that you're about to delete resources. Type the name of the resource group and select **Delete** to finish deleting the resources and the resource group.

## Next steps

> [!div class="nextstepaction"]
> [Distribute traffic to a set of endpoints](traffic-manager-configure-weighted-routing-method.md)
