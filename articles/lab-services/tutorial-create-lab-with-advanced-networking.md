---
title: Use advanced networking in Azure Lab Services | Microsoft Docs
description: Create an Azure Lab Services lab plan with advanced networking.  Create two labs and verify they share same virtual network when published.
ms.service: lab-services
ms.topic: tutorial 
ms.date: 08/28/2023
ms.custom: template-tutorial
---

# Tutorial: Set up lab to lab communication with advanced networking

[!INCLUDE [update focused article](includes/lab-services-new-update-focused-article.md)]

Azure Lab Services advanced networking enables you to control the network for labs created using lab plans.  You can use advanced networking to implement various scenarios including [connecting to licensing servers](how-to-create-a-lab-with-shared-resource.md), using [hub-spoke model for Azure Networking](/azure/architecture/reference-architectures/hybrid-networking/), or lab to lab communication. In this tutorial, you set up lab-to-lab communication for a web development class.

After you complete this tutorial, you'll have a lab with two lab virtual machines that are able to communicate with each other: a server VM and a client VM.

:::image type="content" source="media/tutorial-create-lab-with-advanced-networking/architecture-two-labs-with-advanced-networking.png" alt-text="Architecture diagram showing two labs that use the same subnet of a virtual network.":::

Learn more about the [supported networking scenarios in Azure Lab Services](./concept-lab-services-supported-networking-scenarios.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a resource group
> * Create a virtual network and subnet
> * Delegate subnet to Azure Lab Services
> * Create a network security group
> * Update the network security group inbound rules
> * Associate the network security group to virtual network
> * Create a lab plan using advanced networking
> * Create two labs
> * Enable ICMP on the templates VMs
> * Publish both labs
> * Test communication between lab VMs

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]

[!INCLUDE [Azure manage resources](./includes/lab-services-prerequisite-manage-resources.md)]

## Create a resource group

[!INCLUDE [resource group definition](../../includes/resource-group.md)]

The following steps show how to use the Azure portal to [create a resource group](../azure-resource-manager/management/manage-resource-groups-portal.md).  For simplicity, you create all resources for this tutorial in the same resource group.  

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Resource groups**.
1. Select **+ Create** from the top menu.
1. On the **Basics** tab of the **Create a resource group** page, do the following actions:
    1. For **Subscription**, choose the subscription in which you want to create your labs.
    1. For **Resource group**, type **MyResourceGroup**.
    1. For **Region**, select the region closest to you.  For more information about available regions, see [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies).
    :::image type="content" source="media/tutorial-create-lab-with-advanced-networking/create-resource-group.png" alt-text="Screenshot of create new resource group page in the Azure portal.":::
1. Select **Review + Create**.
1. Review the summary, and select **Create**.

## Create a virtual network and subnet

The following steps show how to use the Azure portal to create a virtual network and subnet that can be used with Azure Lab Services.

> [!IMPORTANT]
> When using Azure Lab Services with advanced networking, the virtual network, subnet, lab plan and lab must all be in the same region.  For more information about which regions are supported by various products, see [Azure products by region](https://azure.microsoft.com/global-infrastructure/services/?products=lab-services).

1. Open **MyResourceGroup** created previously.
1. Select  **+ Create** in the upper left corner of the Azure portal and search for "virtual network".
1. Select the **Virtual network** tile and then select **Create**.
:::image type="content" source="media/tutorial-create-lab-with-advanced-networking/market-place-virtual-network.png" alt-text="Screenshot of Virtual network tile in the Azure Marketplace.":::
1. On the **Basics** tab of the **Create virtual network**, do the following actions:
    1. For **Subscription**, choose the same subscription as the resource group.
    1. For **Resource group**, choose **MyResourceGroup**.
    1. For **Name**, enter **MyVirtualNetwork**.
    1. For **Region**, choose region that is also supported by Azure Lab Services. For more information about supported regions, see [Azure Lab Services by region](https://azure.microsoft.com/global-infrastructure/services/?products=lab-services).
    1. Select **Next: IP Addresses**.

    :::image type="content" source="media/tutorial-create-lab-with-advanced-networking/create-virtual-network-basics-page.png" alt-text="Screenshot of Basics tab of Create virtual network page in the Azure portal.":::
1. On the **IP Addresses** tab, create a subnet that is used by the labs.
    1. Select **+ Add subnet**
    1. For **Subnet name**, enter **labservices-subnet**.
    1. For **Subnet address range**, enter range in CIDR notation. For example, 10.0.1.0/24 has enough IP addresses for 251 lab VMs.  (Azure reserves five IP addresses for every subnet.)  To create a subnet with more available IP addresses for VMs, use a different CIDR prefix length. For example, 10.0.0.0/20 would have room for over 4000 IP addresses for lab VMs.  For more information about adding subnets, see [Add a subnet](../virtual-network/virtual-network-manage-subnet.md).
    1. Select **OK**.
1. Select **Review + Create**.

    :::image type="content" source="media/tutorial-create-lab-with-advanced-networking/create-virtual-network-ip-addresses-page.png" alt-text="Screenshot of IP addresses tab of the Create virtual network page in the Azure portal.":::

1. Once validation passes, select **Create**.

## Delegate subnet to Azure Lab Services

Next, you configure the subnet to be used with Azure Lab Services.  To use a subnet with Azure Lab Services, the subnet must be [delegated to the service](../virtual-network/manage-subnet-delegation.md).

1. Open the **MyVirtualNetwork** resource.
1. Select the **Subnets** item on the left menu.
1. Select **labservices-subnet** subnet.
1. Under the **Subnet delegation** section, select **Microsoft.LabServices/labplans** for the **Delegate subnet to a service** setting.
1. Select **Save**.

:::image type="content" source="media/tutorial-create-lab-with-advanced-networking/delegate-subnet.png" alt-text="Screenshot of subnet information windows.  Subnet delegation property is highlighted.":::

## Create a network security group

[!INCLUDE [nsg intro](../../includes/virtual-networks-create-nsg-intro-include.md)]

An NSG is required when using advanced networking in Azure Lab Services.

To create an NSG, complete the following steps:

1. Select **+ Create a Resource** in the upper left corner of the Azure portal and search for "network security group".
:::image type="content" source="media/tutorial-create-lab-with-advanced-networking/create-network-security-group.png" alt-text="Screenshot of Azure Marketplace with virtual network security group tile.":::
1. Select the **Network security group** tile and then select **Create**.
1. On the **Basics** tab, of the **Create network security group**, do the following actions:
    1. For **Subscription**, choose the same subscription as used previously.
    1. For **Resource group**, choose **MyResourceGroup**.
    1. For the **Name**, enter **MyNsg**.
    1. For **Region**, choose same region as **MyVirtualNetwork** that was created previously.
    1. Select **Review + Create**.
    :::image type="content" source="media/tutorial-create-lab-with-advanced-networking/create-network-security-group-basics-tab.png" alt-text="Screenshot of the Basics tab of the Create Network security group page in the Azure portal.":::
1. When validation passes, select **Create**.

## Update the network security group inbound rules

To ensure that lab users can use remote desktop to connect to the lab VMs, you need to create a security rule to allow this type of traffic.  When you use Linux, you need to adapt the rule for SSH.  

To create a rule that allows both RDP and SSH traffic for the subnet you created previously:

1. Open **MyNsg**.
1. Select **Inbound security rules** on the left menu.
1. Select **+ Add** from the top menu bar.  Fill in the details for adding the inbound security rule as follows:
    1. For **Source**, select **Any**.
    1. For **Source port ranges**, select **\***.
    1. For **Destination**, select **IP Addresses**.
    1. For **Destination IP addresses/CIDR ranges**, select subnet range from **labservices-subnet** created previously.
    1. For **Service**, select **Custom**.
    1. For **Destination port ranges**, enter **22, 3389**.  Port 22 is for Secure Shell protocol (SSH). Port 3389 is for Remote Desktop Protocol (RDP).
    1. For **Protocol**, select **Any**.
    1. For **Action**, select **Allow**.
    1. For **Priority**, select **1000**.  Priority must be higher than other **Deny** rules for RDP and/or SSH.
    1. For **Name**, enter **AllowRdpSshForLabs**.
    1. Select **Add**.

    :::image type="content" source="media/tutorial-create-lab-with-advanced-networking/nsg-add-inbound-rule.png" alt-text="Screenshot of Add inbound rule window for Network security group.":::

1. Wait for the rule to be created.
1. Select **Refresh** on the menu bar.  The new rule now shows in the list of rules.

## Associate network security group to virtual network

You now have an NSG with an inbound security rule to allow lab VMs to connect to the virtual network.  

To associate the NSG with the virtual network you created earlier:

1. Open **MyVirtualNetwork**.
1. Select **Subnets** on the left menu.
1. Select **+ Associate** from the top menu bar.
1. On the **Associate subnet** page, do the following actions:
    1. For **Virtual network**, select **MyVirtualNetwork**.
    1. For **Subnet**, select **labservices-subnet**.
    1. Select **OK**.

:::image type="content" source="media/tutorial-create-lab-with-advanced-networking/associate-nsg-with-subnet.png" alt-text="Screenshot of Associate subnet page in the Azure portal.":::

> [!WARNING]
> Connecting the network security group to the subnet is a **required step**.  Lab users are not able to connect to their lab VMs if there is no network security group associated with the subnet.

## Create a lab plan using advanced networking

Now that the virtual network is created and configured, you can create the lab plan:

1. Select **Create a resource** in the upper left-hand corner of the Azure portal.
1. Search for **lab plan**.
1. On the **Lab plan** tile, select the **Create** dropdown and choose **Lab plan**.

    :::image type="content" source="./media/tutorial-create-lab-with-advanced-networking/select-lab-plans-service.png" alt-text="All Services -> Lab Services":::
1. On the **Basics** tab of the **Create a lab plan** page, do the following actions:
    1. For **Azure subscription**, select the subscription used earlier.
    2. For **Resource group**, select an existing resource group or select **Create new**, and enter a name for the new resource group.
    3. For **Name**, enter a lab plan name. For more information about naming restrictions, see [Microsoft.LabServices resource name rules](../azure-resource-manager/management/resource-name-rules.md#microsoftlabservices).
    4. For **Region**, select a location/region in which you want to create the lab plan.

    :::image type="content" source="./media/tutorial-create-lab-with-advanced-networking/lab-plan-basics-page.png" alt-text="Screenshot of the basics page for lab plan creation.":::
1. Select **Next: Networking**.
1. On the **Networking** tab, do the following actions:
    1. Check **Enable advanced networking**.
    1. For **Virtual network**, choose **MyVirtualNetwork**.
    1. For **Subnet**, choose **labservices-subnet**.
    1. Select **Review + Create**.

    :::image type="content" source="./media/tutorial-create-lab-with-advanced-networking/lab-plan-networking-page.png" alt-text="Screenshot of the networking page for lab plan creation.":::
1. When the validation succeeds, select **Create**.
:::image type="content" source="./media/tutorial-create-lab-with-advanced-networking/create-button.png" alt-text="Review + create -> Create":::

> [!NOTE]
> Advanced networking can only be enabled when lab plans are created. Advanced networking can't be added later.

## Create two labs

Next, create two labs that use advanced networking.  These labs use the **labservices-subnet** that's associated with Azure Lab Services. Any lab VMs created using **MyLabPlan** can communicate with each other.  Communication can be restricted by using NSGs, firewalls, and more.

Perform the following steps to create both labs. Repeat these steps the server VM and the client VM.

1. Navigate to the Azure Lab Services website: [https://labs.azure.com](https://labs.azure.com).
1. Select **Sign in** and enter your credentials. Azure Lab Services supports organizational accounts and Microsoft accounts.
1. Select **MyResourceGroup** from the dropdown on the menu bar.
1. Select **New lab**.  

    :::image type="content" source="./media/tutorial-create-lab-with-advanced-networking/new-lab-button.png" alt-text="Screenshot of Azure Lab Services portal.  New lab button is highlighted.":::
1. In the **New Lab** window, do the following actions:
    1. Specify a **name**.  The name should be easily identifiable.  Use **MyServerLab** for the lab with the server VMs and **MyClientLab** for the lab with the client VMs.  For more information about naming restrictions, see [Microsoft.LabServices resource name rules](../azure-resource-manager/management/resource-name-rules.md#microsoftlabservices).
    1. Choose a **virtual machine image**.  For this tutorial, use **Windows 11 Pro**, but you can choose another available image if you want.  For more information about enabling virtual machine images, see [Specify Marketplace images available to lab creators](specify-marketplace-images.md).
    1. For **size**, select **Medium**.
    1. **Region** only has one region.  When a lab uses advanced networking, the lab must be in the same region as the associated subnet.
    1. Select **Next**.  

    :::image type="content" source="./media/tutorial-create-lab-with-advanced-networking/new-lab-window.png" alt-text="Screenshot of the New lab window for Azure Lab Services.":::

1. On the **Virtual machine credentials** page, specify default administrator credentials for all VMs in the lab. Specify the **name** and **password** for the administrator.  By default all the lab VMs have the same password as the one specified here. Select **Next**.

    :::image type="content" source="./media/tutorial-create-lab-with-advanced-networking/new-lab-credentials.png" alt-text="Screenshot that shows the Virtual machine credentials window when creating a new Azure Lab Services lab.":::

    > [!IMPORTANT]
    > Make a note of user name and password. They won't be shown again.

1. On the **Lab policies** page, leave the default selections and select **Next**.

1. On the **Template virtual machine settings** window, leave the selection on **Create a template virtual machine**.  Select **Finish**.

    :::image type="content" source="./media/tutorial-create-lab-with-advanced-networking/template-virtual-machine-settings.png" alt-text="Screenshot of the Template virtual machine settings windows when creating a new Azure Lab Services lab.":::

1. You should see the following screen that shows the status of the template VM creation.

    :::image type="content" source="./media/tutorial-create-lab-with-advanced-networking/create-template-vm-progress.png" alt-text="Screenshot of status of the template VM creation.":::

1. Wait for the template VM to be created.

## Enable ICMP on the lab templates

Once the labs are created, enable ICMP (ping) for testing communication between the lab VMs. First, enable ICMP on the template VMs for both labs.  Enabling ICMP on the template VM also enables it on the lab VMs. Once the labs are published, the lab VMs are able to ping each other.

To enable ICMP, complete the following steps for each template VM in each lab.

1. On the **Template** page for the lab, start and connect to the template VM.
    1. Select **Start template**.

    :::image type="content" source="./media/tutorial-create-lab-with-advanced-networking/lab-start-template.png" alt-text="Screenshot of Azure Lab Services template page. The Start template menu button is highlighted.":::

    > [!NOTE]
    > Template VMs incur **cost** when running, so ensure that the template VM is shutdown when you don’t need it to be running.

    1. Once the template is started, select **Connect to template**.

    :::image type="content" source="./media/tutorial-create-lab-with-advanced-networking/lab-connect-to-template.png" alt-text="Screenshot of Azure Lab Services template page. The Connect to template menu button is highlighted.":::

When you're logged in to the template VM, modify the firewall rules on the VM to allow ICMP.  Because you're using Windows 11, you can use PowerShell and the [Enable-NetFilewallRule](/powershell/module/netsecurity/enable-netfirewallrule) cmdlet. To open a PowerShell window:

1. Select the Start button.
1. Type "PowerShell"
1. Select the **Windows PowerShell** app.

Run the following code:

```powershell
Enable-NetFirewallRule -Name CoreNet-Diag-ICMP4-EchoRequest-In
Enable-NetFirewallRule -Name CoreNet-Diag-ICMP4-EchoRequest-Out
```

On the **Template** page for the lab, select **Stop** to stop the template VM.

## Publish both labs

In this step, you publish the lab. When you publish the template VM, Azure Lab Services creates VMs in the lab by using the template. All virtual machines have the same configuration as the template.

1. On the **Template** page, select **Publish**.

    :::image type="content" source="./media/tutorial-create-lab-with-advanced-networking/lab-publish-template.png" alt-text="Screenshot of Azure Lab Services template page. The Publish menu button is highlighted.":::
1. Enter the number of machines that are needed for the lab, then select **Publish**.

    :::image type="content" source="./media/tutorial-create-lab-with-advanced-networking/publish-template-number-vms.png" alt-text="Screenshot of confirmation window for publish action of Azure.":::

    > [!WARNING]
    > Publishing is an irreversible action!  It can't be undone.

1. You see the **status of publishing** the template page. Wait until the publishing is complete.

## Test communication between lab VMs

In this section, confirm that the two lab virtual machines in different labs are able to communicate with each other.

First, start and connect to a lab VM from each lab.  Complete the following steps for each lab.

1. Open the lab in the [Azure Lab Services website](https://labs.azure.com).
1. Select **Virtual machine pool** on the left menu.
1. Select a single VM listed in the virtual machine pool.
1. Take note of the **Private IP Address** for the VM.  You need the private IP addresses of both the server lab and client lab VMs later.
1. Select the **State** slider to change the state from **Stopped** to **Starting**.

    > [!NOTE]
    > When an lab educator starts a lab VM, quota for the lab user isn't affected. Quota for a user specifies the number of lab hours available to a lab user outside of the scheduled class time. For more information on quotas, see [Set quotas for users](how-to-manage-lab-users.md?#set-quotas-for-users).
1. Once the **State** is **Running**, select the connect icon for the running VM.  Open the download RDP file to connect to the VM.  For more information about connection experiences on different operating systems, see [Connect to a lab VM](connect-virtual-machine.md).

:::image type="content" source="media/tutorial-create-lab-with-advanced-networking/virtual-machine-pool-running-vm.png" alt-text="Screen shot of virtual machine pool page for Azure Lab Services lab.":::

Now, use the ping utility to test cross-lab communication.  From the lab VM in the server lab, open a command prompt.  Use `ping {ip-address}`.  The `{ip-address}` is the **Private IP Address**  of the client VM, that you noted previously. This test can also be done from the lab VM from the client lab to the lab VM in the server lab.

:::image type="content" source="media/tutorial-create-lab-with-advanced-networking/ping-test-cmd.png" alt-text="Screen shot command window with the ping command executed.":::

When done, navigate to the **Virtual machine pool** page for each lab, select the lab VM and select the **State** slider to stop the lab VM.

## Clean up resources

If you're not going to continue to use this application, delete the virtual network, network security group, lab plan and labs with the following steps:

1. In the [Azure portal](https://portal.azure.com), select the resource group you want to delete.
1. Select **Delete resource group**.
1. To confirm the deletion, type the name of the resource group

## Troubleshooting

[!INCLUDE [Troubleshoot not authorized error](./includes/lab-services-troubleshoot-not-authorized.md)]

## Next steps

>[!div class="nextstepaction"]
>[Add lab users to the labs](how-to-manage-lab-users.md)