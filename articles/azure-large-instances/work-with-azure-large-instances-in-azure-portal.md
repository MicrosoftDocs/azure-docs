---
title: Work with Azure Large Instances in the Azure portal
titleSuffix: Azure Large Instances
description: Shows how to what you can do in the Azure portal with Azure Large Instances.
ms.topic: conceptual
author: jjaygbay1
ms.title: Work with Azure Large Instances in the Azure portal
ms.author: jacobjaygbay
ms.service: azure-large-instances
ms.custom: devx-track-azurecli
ms.date: 06/01/2023
---

# Work with  Azure Large Instances in the Azure portal 

In this article, you learn what to do in the Azure portal with your implementation of Azure Large Instances.

> [!Note]
> For now, BareMetal Infrastructure and BareMetal Instances are being used as synonyms for Azure Large Instances.

## Register the resource provider

An Azure resource provider for Azure Large Instances enables you to see the instances in the Azure portal.
By default, the Azure subscription you use for Azure Large Instances deployments registers the Azure Large Instances resource provider.
If you don't see your deployed Azure Large Instances, register the resource provider with your subscription.

You can register the Azure Large Instance resource provider using the Azure portal or the Azure CLI.

### [Portal](#tab/azure-portal)

You need to list your subscription in the Azure portal and then double-click the subscription used to deploy your Azure Large Instances tenant.

1. Sign in to the Azure portal.
2. On the Azure portal menu, select **All services**.
3. In the **All services** box, enter **subscription**, and then select **Subscriptions**.
4. Select the subscription from the subscription list.
5. Select **Resource providers** and type **BareMetalInfrastructure** in the search box. The resource provider should be registered, as the image shows.

:::image type="content" source="../baremetal-infrastructure/media/connect-baremetal-infrastructure/register-resource-provider-azure-portal.png" alt-text="Networking diagram of Azure Large Instances." lightbox="../baremetal-infrastructure/media/connect-baremetal-infrastructure/register-resource-provider-azure-portal.png"  border="false":::

> [!Note]
> If the resource provider isn't registered, select **Register**.

### [Azure CLI](#tab/azure-cli)

To begin using Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

For more information about resource providers, see [Azure resource providers and types](./../azure-resource-manager/management/resource-providers-and-types.md).

Sign in to the Azure subscription you use for the Azure Large Instances deployment through the Azure CLI.
Register the BareMetalInfrastructure Azure Large Instance resource provider with the az provider register command:

```azurecli
az provider register --namespace Microsoft.BareMetalInfrastructure  
```

You can use the az provider list command to see all available providers.

---

## Azure Large Instances in the Azure portal

When you submit an Azure Large Instances deployment request, specify the Azure subscription you're connecting to the Azure Large Instances. Use the same subscription you use to deploy the application layer that works against the Azure Large Instances.

 During the deployment of your Azure Large Instances, a new [Azure resource group](../azure-resource-manager/management/manage-resources-portal.md) is created in the Azure subscription you used in the deployment request.
This new resource group lists the Azure Large Instances you've deployed in that subscription.

### [Portal](#tab/azure-portal)

1. In the Azure portal, in the Azure Large Instances subscription, select **Resource groups**.

   :::image type="content" source="../baremetal-infrastructure/media/connect-baremetal-infrastructure/view-baremetal-instances-azure-portal.png" alt-text="Screenshot showing the list of Resource groups." lightbox="../baremetal-infrastructure/media/connect-baremetal-infrastructure/view-baremetal-instances-azure-portal.png" border="false":::

1. In the list, locate the new resource group.
 
   :::image type="content" source="../baremetal-infrastructure/media/connect-baremetal-infrastructure/filter-resource-groups.png" alt-text="Screenshot showing the BareMetal instance in a filtered Resource groups list." lightbox="../baremetal-infrastructure/media/connect-baremetal-infrastructure/filter-resource-groups.png"  border="false":::

1. Select the new resource group to view its details. The image shows one Azure Large Instances tenant deployed. 

### [Azure CLI](#tab/azure-cli)

To see all your Azure Large Instances, run the [az baremetalinstance list](/cli/azure/baremetalinstance#az-baremetalinstance-list) command for your resource group:

```azurecli
az baremetalinstance list --resource-group MyResourceGroup –output table
```

> [!TIP]
> The `--output` parameter is a global parameter, available for all commands. The **table** value presents output in a friendly format. For more information, see [Output formats for Azure CLI commands](/cli/azure/format-output-azure-cli).

> [!Note]
> If you deployed several Azure Large Instances tenants under the same Azure subscription, you will see multiple Azure resource groups.

---

## View the attributes of a single instance

You can view the details of a single instance.

### [Portal](#tab/azure-portal)

In the list of Azure Large Instances, select the single instance you want to view.

:::image type="content" source="../baremetal-infrastructure/media/connect-baremetal-infrastructure/view-attributes-single-baremetal-instance.png" alt-text="Screenshot of the Azure Large Instances attributes of a single instance." lightbox="../baremetal-infrastructure/media/connect-baremetal-infrastructure/view-attributes-single-baremetal-instance.png":::

The attributes in the image don't look much different than the Azure virtual machine (VM) attributes.
On the left, you see the Resource group, Azure region, and subscription name and ID. 
If you assigned tags, you see them here as well.
By default, the Azure Large Instances don't have tags assigned.

On the right, you see the name of the Azure Large Instances, operating system (OS), IP address, and SKU that shows the number of CPU threads and memory. 
You also see the power state and hardware version (revision of the Azure Large Instances stamp).
The power state indicates whether the hardware unit is powered on or off. The operating system details, however, don't indicate whether it's up and running. 

Also on the right is the  [Azure proximity placement group's name](../virtual-machines/co-location.md).
The placement group's name is created automatically for each deployed Azure Large Instances tenant. 
Reference the proximity placement group when you deploy the Azure VMs that host the application layer. 
Use the proximity placement group associated with the Azure Large Instances to ensure the Azure VMs are deployed close to the Azure Large Instances. 

### [Azure CLI](#tab/azure-cli)

To see details of an Azure Large Instances instance, run the [az baremetalinstance show](/cli/azure/baremetalinstance#az-baremetalinstance-show) command:

```azurecli
az baremetalinstance show --resource-group MyResourceGroup --instance-name MyInstanceName
```

If you're uncertain of the instance name, run the **az baremetalinstance list** command as previously described.

---

## Check activities of a single instance

You can check the activities of a single Azure Large Instances tenant.
One of the main activities recorded are restarts of the instance.
The data listed includes:

* Activity status
* Time the activity triggered
* Subscription ID
* Azure user who triggered the activity

 :::image type="content" source="../baremetal-infrastructure/media/connect-baremetal-infrastructure/check-activities-single-baremetal-instance.png" alt-text="Screenshot of the BareMetal instance activities." lightbox="../baremetal-infrastructure/media/connect-baremetal-infrastructure/check-activities-single-baremetal-instance.png":::

Changes to an instance's metadata in Azure also get recorded in the Activity log.
Besides the restart, you can see the activity of **WriteBareMetalInstances**. 
This activity makes no changes on the Azure Large Instances tenant itself, but documents the changes to the unit's metadata in Azure.

Another activity that gets recorded is adding a tag to or deleting a tag from an instance.

## Add an Azure tag to or delete an Azure tag from an instance

You can add Azure tags to an Azure Large Instances tenant or delete them using either the Portal or Azure CLI.  

### [Portal](#tab/azure-portal)
 
Tags get assigned just as they do when assigning tags to VMs.
As with VMs, the tags exist in the Azure metadata.
Tags have the same restrictions for Azure Large Instances as for VMs.
 
Deleting tags also works the same way as for VMs. 
Both applying and deleting a tag is listed in the Azure Large Instances instance's Activity log.

### [Azure CLI](#tab/azure-cli)

Assigning tags to Azure Large Instances works the same as assigning tags for VMs.
As with VMs, the tags exist in the Azure metadata.
Tags have the same restrictions for Azure Large Instances as for VMs.

To add tags to an Azure Large Instances implementation, run the [az baremetalinstance update](/cli/azure/baremetalinstance#az-baremetalinstance-update) command:

```azurecli
az baremetalinstance update --resource-group MyResourceGroup --instance-name MyALIinstanceName --set tags.Dept=Finance tags.Status=Normal
```

Use the same command to remove a tag:

```azurecli
az baremetalinstance update --resource-group MyResourceGroup --instance-name MyALIinstanceName --remove tags.Dept
```

---

### Check properties of an instance

When you acquire the instances, you can go to the Properties section to view the data collected about the instances. 
Data collected includes:

* Azure connectivity
* Storage backend
* ExpressRoute circuit ID
* Unique resource ID
* Subscription ID

This information is important in support requests and when setting up a storage snapshot configuration.

:::image type="content" source="../baremetal-infrastructure/media/connect-baremetal-infrastructure/baremetal-instance-restart.png" alt-text="Screenshot of how to restart the Azure Large Instances tenant.":::

### Restart an Azure Large Instances tenant through the Azure portal

There are various situations in which the operating system won't complete a restart, which requires a power restart of the Azure Large Instances.

You can do a power restart of the instance directly from the Azure portal or through Azure CLI.

### [Portal](#tab/azure-portal)

Select Restart and then Yes to confirm the restart. 

When you restart an AKI instance, you'll experience a delay. 
During this delay, the power state moves from **Starting** to **Started**, which means the OS has started up completely. 
As a result, after a restart, you can only log into the unit once the state switches to **Started**. 

### [Azure CLI](#tab/azure-cli)

To restart an Azure Large Instances tenant, use the [az baremetalinstance restart](/cli/azure/baremetalinstance#az-baremetalinstance-restart) command:

```azurecli
az baremetalinstance restart --resource-group MyResourceGroup --instance-name MyALIinstanceName
```

---

> [!Important]
> Depending on the amount of memory in your Azure Large Instances, a restart and a reboot of the hardware and operating system can take up to one hour.

### Open a support request for Azure Large Instances
 
You can submit support requests specifically for Azure Large Instances.
1. In Azure portal, under **Help + Support**, create a **[New support request](https://rc.portal.azure.com/#create/Microsoft.Support)** and provide the following information for the ticket:
 
    * **Issue type:** Select an issue type.
    * **Subscription:** Select your subscription.
    * **Service:** Select Epic on Azure
    * **Problem type:** Azure Large Instances  
    * **Problem subtype:** Select a subtype for the problem.

1. Select the **Solutions** tab to find a solution to your problem. If you can't find a solution, go to the next step.

1. Select the **Details** tab and select whether the issue is with VMs or BareMetal instances. This information helps direct the support request to the correct specialists.

1. Indicate when the problem began and select the instance region.

1. Provide more details about the request and upload a file if needed.

1. Select **Review + Create** to submit the request.

Support response depends on the support plan chosen by the customer.
For more information, see [Support scope and responsiveness](https://azure.microsoft.com/support/plans/response/).

 