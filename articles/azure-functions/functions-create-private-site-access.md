---
title: Set up private site access for Azure Functions
description: A step-by-step tutorial that shows you how to set up Azure virtual network private site access for Azure Functions.
author: mcollier
ms.author: mcollier
ms.service: #Required; service per approved list. service slug assigned to your service by ACOM.
ms.topic: tutorial
ms.date: 02/15/2020
---

# Tutorial: establish Azure Functions private site access

This tutorial will show you how to create an Azure Function with private site access. Configuring private site access ensures that the specified Azure Function is not able to be triggered via the public internet. By enabling private site access, the function can only be triggered via a specific virtual network.

TODO: ADD TEXT ON WHY THIS IS HELPFUL / POTENTIAL SCENARIOS

If an Azure Function needs to access Azure resources within the virtual network, or connected via [service endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview), then [virtual network integration](https://docs.microsoft.com/azure/azure-functions/functions-create-vnet) is needed.

In this tutorial, the following steps will be performed in order to configure private site access for an Azure Function:

> [!div class="checklist"]
> * Create a virtual network
> * Create a virtual machine
> * Create an Azure Bastion service
> * Create an Azure Function App plan
> * Configure a virtual network service endpoint
> * Create and deploy an Azure Function
> * Invoke the function from outside and within the virtual network

<!---Required:
The outline of the tutorial should be included in the beginning and at
the end of every tutorial. These will align to the **procedural** H2
headings for the activity. You do not need to include all H2 headings.
Leave out the prerequisites, clean-up resources and next steps--->

## Topology

The following diagram shows the architecture of the solution to be created:

![High-level architecture diagram for private site access solution](./media/functions-create-private-site-access/topology.png)

## Prerequisites

For this tutorial, it's important that you understand IP addressing and subnetting. You can start with [this article that covers the basics of addressing and subnetting](https://support.microsoft.com/help/164015/understanding-tcp-ip-addressing-and-subnetting-basics). Many more articles and videos are available online.

> If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## Create a Virtual Network

<!---Required:
Tutorials are prescriptive and guide the customer through an end-to-end
procedure. Make sure to use specific naming for setting up accounts and
configuring technology.
Don't link off to other content - include whatever the customer needs to
complete the scenario in the article. For example, if the customer needs
to set permissions, include the permissions they need to set, and the
specific settings in the tutorial procedure. Don't send the customer to
another article to read about it.
In a break from tradition, do not link to reference topics in the
procedural part of the tutorial when using cmdlets or code. Provide customers what they need to know in the tutorial to successfully complete
the tutorial.
For portal-based procedures, minimize bullets and numbering.
For the CLI or PowerShell based procedures, don't use bullets or
numbering.
--->

The first step is to create a new resource group, and then a new virtual network within the resource group. The virtual network will contain one subnet (with a name of "default"), and a new virtual machine within that subnet. The VM will be used to test invoking the function app.

1. Create a new resource group
![Create a new Azure resource group](./media/functions-create-private-site-access/create-resource-group.png)
2. Select the **Add** or **Create resources** button to create a new resource in the resource group

[!div class="mx-imgBorder"]
![Create a new resource](./media/functions-create-private-site-access/add-resource-to-resource-group.png)
3. Type "Virtual Network" in the Marketplace search box, and select "Virtual Network".

[!div class="mx-imgBorder"]
![Select Virtual Network from Marketplace](./media/functions-create-private-site-access/create-virtual-network-1.png)
4. Press the **Create** button to begin creating the virtual network.

[!div class="mx-imgBorder"]
![Select Virtual Network from Marketplace](./media/functions-create-private-site-access/create-virtual-network-2.png)
5. Provide a name for the virtual network, along with a desired address space.

[!div class="mx-imgBorder"]
![Provide a name and address space for the new virtual network](./media/functions-create-private-site-access/create-virtual-network-3.png)
6. Press the **Create** button when finished.

## Create a Virtual Machine

The next step is to create a new virtual machine within one subnet of the virtual network.

1. In the portal, choose **Add** at the top of the resource group view.
2. In the search field, type "Windows Server".
3. Choose **Windows Server** in the search results.
4. In the **Basics** tab, use the VM settings as specified in the table below the image.

[!div class="mx-imgBorder"]
![Basic settings for a Windows VM](./media/functions-create-private-site-access/create-windows-vm-3.png)

| Setting      | Suggested value  | Description      |
| ------------ | ---------------- | ---------------- |
| **Subscription** | Your subscription | The subscription under which your resources are created. |
| **Resource group** | _functions-private-access_ | Choose functions-private-access, or the resource group you created with your function app.  Using the same resource group for the function app and VM makes it easier to clean up resources when you are done with this tutorial. |
| **Virtual machine name** | myVM | The VM name needs to be unique in the resource group |
| **Region** | (US) North Central US | Choose a region near you or near the functions to be accessed. |
| **Public inbound ports** | None | todo |

5. Leave the defaults in the **Disk** tab.
6. In the **Networking** tab, select the previously created virtual network and subnet. Change the IP address setting to not have a public IP address. Remote access to the VM will be configured via the Azure Bastion service.

[!div class="mx-imgBorder"]
![Basic settings for a Windows VM](./media/functions-create-private-site-access/create-windows-vm-4.png)

7. Leave the default values in place for the **Management**, **Advanced** and **Tags** tabs.
8. Select **Review + create**. After validation completes, select **Create**. The VM create process takes a few minutes.

## Configure Azure Bastion

[Azure Bastion](https://azure.microsoft.com/services/azure-bastion/) is a fully-managed Azure service which provides secure RDP and SSH access to virtual machines directly from the Azure Portal. Using the Azure Bastion service removes the need to configure network settings related to RDP access.

1. In the portal, choose **Add** at the top of the resource group view.
2. In the search field, type "Bastion".  Select "Bastion".
3. Select **Create** to begin the process of creating a new Azure Bastion resource.

[!div class="mx-imgBorder"]
![Start of creating Azure Bastion](./media/functions-create-private-site-access/create-bastion-1.png)

4. Create a new Azure Bastion resource using the settings as specified in the table below the image.  For a detailed, step-by-step guide to creating an Azure Bastion resource, please refer to the [Create an Azure Bastion host](https://docs.microsoft.com/azure/bastion/bastion-create-host-portal) tutorial.

[!div class="mx-imgBorder"]
![Create an Azure Bastion host](./media/functions-create-private-site-access/create-bastion-2.png)

| Setting      | Suggested value  | Description      |
| ------------ | ---------------- | ---------------- |
| Name | myBastion |
| Region | North Central US |
| Virtual network | function-private-vnet |
| Subnet | AzureBastionSubnet |

5. You will need to create a subnet where Azure can provision the Azure Bastion host. Clicking on **Manage subnet configuration** will open a new blade to allow you to define a new subnet.  Click on **+Subnet** to create a new subnet. The subnet must be of the name **AzureBastionSubnet** and the subnet prefix must be at least /27.  Click **OK** to create the subnet.

[!div class="mx-imgBorder"]
![Create subnet for Azure Bastion host](./media/functions-create-private-site-access/create-bastion-4.png)

6. On the **Create a Bastion** page, select the newly created **AzureBastionSubnet** from the list of available subnets.

[!div class="mx-imgBorder"]
![Create an Azure Bastion host with specific subnet](./media/functions-create-private-site-access/create-bastion-4.png)

7. Press **Review & Create**. It will take a few minutes for the Azure Bastion resource to be created.  The Azure Bastion resource should now be in your resource group.

[!div class="mx-imgBorder"]
![Final view of Azure Bastion host in resource group](./media/functions-create-private-site-access/create-bastion-5.png)

## Create an Azure Function App

With the virtual network in place, the next step is to create an Azure Function App using a Consumption plan. The function code will be deployed to the Function App later in this tutorial.

To summarize, the following is being created:

* **Plan**: Azure Function Consumption plan
* **OS**: Windows
* **Runtime**: .NET Core

## Configure Access Restrictions

The next step is to configure access restrictions to ensure only resources on the virtual network can invoke the function.

[Private site](https://docs.microsoft.com/azure/azure-functions/functions-networking-options#private-site-access) access is enable by creating an Azure [virtual network service endpoint](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview) between the App Service plan (consumption) and the specified virtual network. Access restrictions are implemented via service endpoints. Service endpoints ensure that only traffic originating from within the specified virtual network can access the designated resource. In this case, the designed resource is the Azure Function.

Within the function app, proceed to the **Platform features** tab.

<!-- INSERT SCREENSHOT -->

Click on **Networking** to open the **Network Feature Status** section. This page is the starting point to configure Azure Front Door, the Azure CDN, and also Access Restrictions. Private site access is configured via access restrictions. Click to **Configure Access Restrictions**.

<!-- INSERT SCREENSHOT -->

It can be seen on the Access Restrictions page that only the default restriction is in place. The default does not place any restrictions on access to the function.  For private site access, a new access restriction configuration needs to be created. Do so by first clicking on **Add rule**.

<!-- INSERT SCREENSHOT -->

This will open new **Add Access Restriction** blade on the right side of the portal. The key configuration in this blade is to select **Virtual Network** from the Type drop-down selection box. Once Virtual Network is selected, select the desired virtual network and subnet.

<!-- INSERT SCREENSHOT -->

Notice in the above screenshot the information block indicating a service endpoint has not yet been enabled for Microsoft.Web. The service endpoint will automatically be created.

The Access Restrictions page now shows that there is a new restriction. It may take a few seconds for the Endpoint status to change from Provisioning to Enabled.

<!-- INSERT SCREENSHOT -->

It is important to note that access restrictions have not been enabled on the [SCM site](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions#scm-site), private-site.scm.azurewebsites.net. By not enabling access restrictions the SCM site, it will be possible to deploy the Azure Function code from a local developer workstation or another build service without needing to take extra steps to provision an agent within the virtual network.

If you try to access the function app now, you should receive an HTTP 403 page indicating that the app is stopped.  The app isn't really stopped. The response is actually a HTTP 403.6 - IP address rejected status.

<!-- INSERT SCREENSHOT -->

In order to access the site from the VM which was previously configured in the virtual network, connect to the VM via the Azure Bastion service.

<!-- INSERT SCREENSHOT -->

From the web browser on the VM it is possible to access the site.

<!-- INSERT SCREENSHOT -->

From the VM on the virtual network it is possible to access the default Azure Function site. The next step is to create an Azure Function and deploy it.

It's important to note that while the function app is only accessible from within the designated virtual network, a public DNS entry remains. As shown above, attempting to access the site will result in a HTTP 403 response.

## Create an Azure Function

The next step is to creates a C# HTTP-triggered Azure Function. This results in an Azure Function that is accessed via a URL such as https://private-site.azurewebsites.net/api/Function1. Invoking the function via an HTTP GET or POST should result in a response of "Hello, {name}".

There are four basic steps in the quickstart tutorial for creating an Azure Function:

1. Create a function app project
2. Run locally
3. Publish to Azure
4. Test it

When publishing the function, select the Azure Function Consumption plan previously created. For this tutorial, the Azure Function is deployed from a development laptop which is not connected to the virtual network used in the tutorial. It is possible to do this because access restrictions where not configured for the SCM endpoint.

<!-- INSERT SCREENSHOT -->

With the function deployed via Visual Studio, it's time to go back to the Azure Portal. There should now be a function, Function1, in the list of functions.

<!-- INSERT SCREENSHOT -->

In order to test access to the function, copy the function URL and try to invoke it from a web browser. Doing so from a local machine will result in a 403 web app is stopped message.

<!-- INSERT SCREENSHOT -->

However, accessing the function via a web browser (by using the Azure Bastion service) on the configured VM on the virtual network results in success!!

<!-- INSERT SCREENSHOT -->

## Invoke the Azure Function

<!---Code requires specific formatting. Here are a few useful examples of
commonly used code blocks. Make sure to use the interactive functionality
where possible.

For the CLI or PowerShell based procedures, don't use bullets or
numbering.
--->

## Summary

In order to restrict access to an Azure Function to a specified virtual network, it is necessary to configure access restrictions via a virtual network service endpoint. Doing so will ensure that only resources from within the specified virtual network can trigger the Azure Function.

[!INCLUDE [clean-up-section-portal](../../includes/clean-up-section-portal.md)]

## Next steps

In this tutorial, . . .
> [!div class="nextstepaction"]
> [Azure Functions networking options](https://docs.microsoft.com/azure/azure-functions/functions-networking-options)
> [Azure App Service Access Restrictions](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions)
> [Integrate Azure Functions with a Virtual Network](https://docs.microsoft.com/azure/azure-functions/functions-create-vnet)
> [Virtual Network Service Endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview)
> [Next steps button](contribute-get-started-mvc.md)

<!--- Required:
Tutorials should always have a Next steps H2 that points to the next
logical tutorial in a series, or, if there are no other tutorials, to
some other cool thing the customer can do. A single link in the blue box
format should direct the customer to the next article - and you can
shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also
section". --->