---
title: "Tutorial: Create a Windows virtual machine scale set"
description: Learn how to create and deploy a highly available application on Windows VMs using a virtual machine scale set.
author: ju-shim
ms.author: jushiman
ms.topic: tutorial
ms.service: virtual-machines
ms.collection: windows
ms.date: 10/15/2021
ms.reviewer: mimckitt
ms.custom: mimckitt

---

# Tutorial: Create a virtual machine scale set and deploy a highly available app on Windows
**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets

Virtual machine scale sets with [Flexible orchestration](../flexible-virtual-machine-scale-sets.md) let you create and manage a group of load balanced VMs. The number of VM instances can automatically increase or decrease in response to demand or a defined schedule.

In this tutorial, you deploy a virtual machine scale set in Azure and learn how to:

> [!div class="checklist"]
> * Create a resource group.
> * Create a Flexible scale set with a load balancer.
> * Add IIS to the scale set instances using the **Run command**.
> * Open port 80 to HTTP traffic.
> * Test the scale set.


## Scale Set overview

Scale sets provide the following key benefits:
- Easy to create and manage multiple VMs
- Provides high availability and application resiliency by distributing VMs across fault domains
- Allows your application to automatically scale as resource demand changes
- Works at large-scale

With Flexible orchestration, Azure provides a unified experience across the Azure VM ecosystem. Flexible orchestration offers high availability guarantees (up to 1000 VMs) by spreading VMs across fault domains in a region or within an Availability Zone. This enables you to scale out your application while maintaining fault domain isolation that is essential to run quorum-based or stateful workloads, including:
- Quorum-based workloads
- Open-source databases
- Stateful applications
- Services that require high availability and large scale
- Services that want to mix virtual machine types or leverage Spot and on-demand VMs together
- Existing Availability Set applications

Learn more about the differences between Uniform scale sets and Flexible scale sets in [Orchestration Modes](../../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md).



## Create a scale set

Use the Azure portal to create a Flexible scale set.

1. Open the [Azure portal](https://portal.azure.com).
1. Search for and select **Virtual machine scale sets**.
1. Select **Create** on the **Virtual machine scale sets** page. The **Create a virtual machine scale set** will open.
1. Select the subscription that you want to use for **Subscription**.
1. For **Resource group**, select **Create new** and type *myVMSSRG* for the name and then select **OK**.
    :::image type="content" source="media/tutorial-create-vmss/flex-project-details.png" alt-text="Project details.":::
1. For **Virtual machine scale set name**, type *myVMSS*.
1. For **Region**, select a region that is close to you like *East US*.
    :::image type="content" source="media/tutorial-create-vmss/flex-details.png" alt-text="Name and region.":::
1. Leave **Availability zone** as blank for this example.
1. For **Orchestration mode**, select **Flexible**.
1. Leave the default of *1* for fault domain count or choose another value from the drop-down.
   :::image type="content" source="media/tutorial-create-vmss/flex-orchestration.png" alt-text="Choose Flexible orchestration mode.":::
1. For **Image**, select *Windows Server 2019 Datacenter - Gen 1*.
1. For **Size**, leave the default value or select a size like *Standard_E2s_V3*.
1. For **Username**, type the name to use for the administrator account, like *azureuser*.
1. In **Password** and **Confirm password**, type a strong password for the administrator account.
1. On the **Networking** tab, under **Load balancing**, select **Use a load balancer**.
1. For **Load balancing options**, leave the default of **Azure load balancer**.
1. For **Select a load balancer**, select **Create new**. 
    :::image type="content" source="media/tutorial-create-vmss/load-balancer-settings.png" alt-text="Load balancer settings.":::
1. On the **Create a load balancer** page, type in a name for your load balancer and **Public IP address name**.
1. For **Domain name label**, type in a name to use as a prefix for your domain name. This name must be unique.
1. When you are done, select **Create**.
    :::image type="content" source="media/tutorial-create-vmss/flex-load-balancer.png" alt-text="Create a load balancer.":::
1. Back on the **Networking** tab, leave the default name for the backend pool.
1. On the **Scaling** tab, leave the default instance count as *2*, or add in your own value. This is the number of VMs that will be created, so be aware of the costs and the limits on your subscription if you change this value.
1. Leave the **Scaling policy** set to *Manual*.
    :::image type="content" source="media/tutorial-create-vmss/flex-scaling.png" alt-text="Scaling policy settings.":::
1. When you are done, select **Review + create**.
1. Once you see that validation has passed, you can select **Create** at the bottom of the page to deploy your scale set.
1. When the deployment is complete, select **Go to resource** to see your scale set.

## View the VMs in your scale set

On the page for the scale set, select **Instances** from the left menu. 

You will see a list of VMs that are part of your scale set. This list includes:

- The name of the VM
- The computer name used by the VM.
- The current status of the VM, like *Running*.
- The *Provisioning state* of the VM, like *Succeeded*.

:::image type="content" source="media/tutorial-create-vmss/instances.png" alt-text="Table of information about the scale set instances.":::

## Enable IIS using RunCommand

To test the scale-set, we can enable IIS on each of the VMs using the [Run Command](../windows/run-command.md).

1. Select the first VM in the list of **Instances**.
1. In the left menu, under **Operations**, select **Run command**. The **Run command** page will open.
1. Select **RunPowerShellScript** from the list of commands. The **Run Command Script** page will open.
1. Under **PowerShell Script**, paste in the following snippet:

    ```powershell
    Add-WindowsFeature Web-Server
    Set-Content -Path "C:\inetpub\wwwroot\Default.htm" -Value "Hello world from host $($env:computername) !"
    ```
1. When you are done, select **Run**. You will see the progress in the **Output** window.
1. Once the the script is complete on the first VM, you can select the **X** in the upper-right to close the page.
1. Go back to your list of scale set instances and use the **Run command** on each VM in the scale set.

## Open port 80 

Open port 80 on your scale set by adding an inbound rule to your network security group (NSG).

1. On the page for your scale set, select **Networking** from the left menu. The **Networking** page will open.
1. Select **Add inbound port rule**. The **Add inbound security rule** page will open.
1. Under **Service**, select *HTTP* and then select **Add** at the bottom of the page.

## Test your scale set

Test your scale set by connecting to it from a browser.

1. One the **Overview** page for your scale set, copy the Public IP address.
1. Open another tab in your browser and paste the IP address into the address bar.
1. When the page loads, take a note of the compute name that is shown. 
1. Refresh the page until you see the computer name change. 

## Delete your scale set

When you are done, you should delete the resource group, which will delete everything you deployed for your scale set.

1. On the page for your scale set, select the **Resource group**. The page for your resource group will open.
1. At the top of the page, select **Delete resource group**.
1. In the **Are you sure you want to delete** page, type in the name of your resource group and then select **Delete**.

## Next steps
In this tutorial, you created a virtual machine scale set. You learned how to:

> [!div class="checklist"]
> * Create a resource group.
> * Create a Flexible scale set with a load balancer.
> * Add IIS to the scale set instances using the **Run command**.
> * Open port 80 to HTTP traffic.
> * Test the scale set.

Advance to the next topic to learn more about load balancing concepts for virtual machines.

> [!div class="nextstepaction"]
> [Load balance virtual machines](../../load-balancer/quickstart-load-balancer-standard-public-powershell.md)
