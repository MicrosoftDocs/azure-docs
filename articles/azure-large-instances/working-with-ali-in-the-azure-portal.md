---
title: Working with ALI in the Azure portal
description: Shows how to what you can do in the Azure portal with ALI.
ms.topic: conceptual
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: baremetal-infrastructure
ms.date: 06/01/2023
---

# Working with  Azure Large Instances in the Azure Portal 

In this article, we'll show what you can do in the Azure portal with your deployed Azure Large Instances (ALI). 

> [!Note] 
> For the time being, you will notice the BareMetal Infrastructure naming convention still in use in the Azure Portal. This will be replaced with Azure Large Instances soon. Until then, BareMetal Infrastructre or BareMetal Instances can be considered as synonyms to Azure Large Instances.

## Register the resource provider 

An Azure resource provider for ALI enables to you see the instances in the Azure portal.
By default, the Azure subscription you use for ALI deployments registers the ALI resource provider.
If you don't see your deployed ALI, register the resource provider with your subscription.

You can register the Azure Large Instance resource provider using the Azure portal or the Azure CLI.

### [Portal](#tab/azure-portal)

You'll need to list your subscription in the Azure portal and then double-click the subscription used to deploy your ALI instance.

1. Sign in to the Azure portal.
2. On the Azure portal menu, select All services.
3. In the All services box, enter subscription, and then select Subscriptions.
4. Select the subscription from the subscription list.
5. Select **Resource providers** and type **BareMetalInfrastructure** in the search box. The resource provider should be Registered, as the image shows. 

:::image type="content" source="../baremetal-infrastructure/media/connect-baremetal-infrastructure/register-resource-provider-azure-portal.png" alt-text="Networking diagram of ALI for Epic diagram." lightbox="../baremetal-infrastructure/media/connect-baremetal-infrastructure/register-resource-provider-azure-portal.png"  border="false":::

> [!Note]
> If the resource provider isn't registered, select Register. 

 

### [Azure CLI](#tab/azure-cli)

To begin using Azure CLI:

Use the Bash environment in Azure Cloud Shell.
For more information, see [Quickstart for Bash in Azure Cloud Shells](../cloud-shell/quickstart.md). 

If you prefer to run CLI reference commands locally, install the Azure CLI. 
If you're using Windows or macOS, consider running Azure CLI in a Docker container.
 For more information, see How to run the Azure CLI in a Docker container. 

 

If you're using a local installation, sign in to the Azure CLI by using the az login command. To finish the authentication process, follow the steps displayed in your terminal. For other sign-in options, see Sign in with the Azure CLI. 

 

When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see Use extensions with the Azure CLI. 

 

Run az version to find the version and dependent libraries that are installed. To upgrade to the latest version, run az upgrade. 

 

Sign in to the Azure subscription you use for the BareMetal instanceAzure Large Instance deployment through the Azure CLI. Register the BareMetalInfrastructure Azure Large Instance resource provider with the az provider register command: 

 

az provider register --namespace Microsoft.BareMetalInfrastructure  

You can use the az provider list command to see all available providers. 

For more information about resource providers, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

### ALI in the Azure portal

When you submit an ALI deployment request, specify the Azure subscription you're connecting to the ALI instance.
Use the same subscription you use to deploy the application layer that works against the ALI.

 During the deployment of your ALI, a new [Azure resource group](../azure-resource-manager/management/manage-resources-portal.md) is created in the Azure subscription you used in the deployment request.
This new resource group lists the ALI you've deployed in that subscription.

### [Portal](#tab/azure-portal)

1. In the Azure portal, in the ALI subscription, select **Resource groups**.

   :::image type="content" source="../baremetal-infrastructure/media/connect-baremetal-infrastructure/view-baremetal-instances-azure-portal.png" alt-text="Screenshot showing the list of Resource groups." lightbox="../baremetal-infrastructure/media/connect-baremetal-infrastructure/view-baremetal-instances-azure-portal.png" border="false":::

1. In the list, locate the new resource group.
 
   :::image type="content" source="../baremetal-infrastructure/media/connect-baremetal-infrastructure/filter-resource-groups.png" alt-text="Screenshot showing the BareMetal instance in a filtered Resource groups list." lightbox="../baremetal-infrastructure/media/connect-baremetal-infrastructure/filter-resource-groups.png"  border="false":::

1. Select the new resource group to view its details. The image shows one ALI instance deployed. 

### [Azure CLI](#tab/azure-cli)

To see all your ALI instances, run the [az baremetalinstance list](/cli/azure/baremetalinstance#az-baremetalinstance-list) command for your resource group:

```azurecli
az baremetalinstance list --resource-group DSM05A-T550 –output table
```

> [!TIP]
> The `--output` parameter is a global parameter, available for all commands. The **table** value presents output in a friendly format. For more information, see [Output formats for Azure CLI commands](/cli/azure/format-output-azure-cli).
> [!Note] 
> If you deployed several ALI tenants under the same Azure subscription, you will see multiple Azure resource groups.

## View the attributes of a single instance

You can view the details of a single instance.

### [Portal](#tab/azure-portal)

In the list of ALI instances, select the single instance you want to view.

:::image type="content" source="../baremetal-infrastructure/media/connect-baremetal-infrastructure/view-attributes-single-baremetal-instance.png" alt-text="Screenshot showing the ALI instance attributes of a single instance." lightbox="../baremetal-infrastructure/media/connect-baremetal-infrastructure/view-attributes-single-baremetal-instance.png":::

The attributes in the image don't look much different than the Azure virtual machine (VM) attributes.
On the left, you see the Resource group, Azure region, and subscription name and ID. 
If you assigned tags, you see them here as well.
By default, the ALI instances don't have tags assigned.

On the right, you see the name of the ALI instance, operating system (OS), IP address, and SKU that shows the number of CPU threads and memory. 
You also see the power state and hardware version (revision of the ALI instance stamp).
The power state indicates whether the hardware unit is powered on or off. The operating system details, however, don't indicate whether it's up and running. 

Also on the right is the  [Azure proximity placement group's name](../virtual-machines/co-location.md).
The placement group's name is created automatically for each deployed ALI instance. 
Reference the proximity placement group when you deploy the Azure VMs that host the application layer. 
Use the proximity placement group associated with the ALI instance to ensure the Azure VMs are deployed close to the ALI instance. 

### [Azure CLI](#tab/azure-cli)

To see details of an ALI instance, run the [az baremetalinstance show](/cli/azure/baremetalinstance#az-baremetalinstance-show) command:

```azurecli
az baremetalinstance show --resource-group DSM05A-T550 --instance-name orcllabdsm01
```

If you're uncertain of the instance name, run the **az baremetalinstance list** command as previously described.

## Check activities of a single instance

You can check the activities of a single ALI instance.
One of the main activities recorded are restarts of the instance.
The data listed includes:

* Activity status
* Time the activity triggered
* Subscription ID
* Azure user who triggered the activity

 :::image type="content" source="../baremetal-infrastrucure/media/connect-baremetal-infrastructure/check-activities-single-baremetal-instance.png" alt-text="Screenshot showing the BareMetal instance activities." lightbox="../baremetal-infrastructure/media/connect-baremetal-infrastructure/check-activities-single-baremetal-instance.png":::

Changes to an instance's metadata in Azure also get recorded in the Activity log.
Besides the restart, you can see the activity of **Write BareMetalInstances**. 
This activity makes no changes on the ALI instance itself, but documents the changes to the unit's metadata in Azure.

Another activity that gets recorded is adding a tag to or deleting a tag from an instance.

## Add an Azure tag to or delete an Azure tag from an instance

Adding or deleting a [tag](../azure-resource-manager/management/tag-resources.md) to an instance is recorded.

 
You can add Azure tags to an ALI instance or delete them using either the Portal or Azure CLI.  

### [Portal](#tab/azure-portal)
 
You can add Azure tags to a BareMetal instance or delete them.
Tags get assigned just as they do when assigning tags to VMs.
As with VMs, the tags exist in the Azure metadata.
Tags have the same restrictions for BareMetal instances as for VMs.
 
Deleting tags also works the same way as for VMs. Both applying and deleting a tag is listed in the ALI instance's Activity log.

### [Azure CLI](#tab/azure-cli)

Assigning tags to ALI instances works the same as assigning tags for virtual machines.
As with VMs, the tags exist in the Azure metadata.
Tags have the same restrictions for ALI instances as for VMs.

To add tags to a BareMetal instance, run the [az baremetalinstance update](/cli/azure/baremetalinstance#az-baremetalinstance-update) command:

```azurecli
az baremetalinstance update --resource-group DSM05a-T550 --instance-name orcllabdsm01 --set tags.Dept=Finance tags.Status=Normal
```

Use the same command to remove a tag:

```azurecli
az baremetalinstance update --resource-group DSM05a-T550 --instance-name orcllabdsm01 --remove tags.Dept
```

---

Assigning tags to ALI instances works the same as assigning tags for virtual machines. As with VMs, the tags exist in the Azure metadata. Tags have the same restrictions for ALI as for VMs. 

 

To add tags to a Azure Large Instance, run the az baremetalinstance update command: 

 

az baremetalinstance update --resource-group DSM05a-T550 --instance-name orcllabdsm01 --set tags.Dept=Finance tags.Status=Normal 

 

Use the same command to remove a tag: 

 

az baremetalinstance update --resource-group DSM05a-T550 --instance-name orcllabdsm01 --remove tags.Dept 

 

Check properties of an instance 

When you acquire the instances, you can go to the Properties section to view the data collected about the instances. Data collected includes: 

 

Azure connectivity 

Storage backend 

ExpressRoute circuit ID 

Unique resource ID 

Subscription ID. 

You'll use this information in support requests or when setting up storage snapshot configuration. 

 

 

Text BoxA screenshot of a computer

Description automatically generated with medium confidence 

 

 

Restart a Azure Large Instance through the Azure portal 

 

There are various situations where the OS won't finish a restart, which requires a power restart of the Azure Large Instance. 

 

You can do a power restart of the instance directly from the Azure portal or through Azure CLI: 

 

Portal 

Select Restart and then Yes to confirm the restart. 

 

A screenshot of a computer

Description automatically generated 

When you restart a BareMetal instanceAzure Large Instance, you'll experience a delay. During this delay, the power state moves from Starting to Started, which means the OS has started up completely. As a result, after a restart, you can only log into the unit once the state switches to Started. 

 

Azure CLI 

To restart a Azure Large Instance, use the az baremetalinstance restart command as shown below: 

 

az baremetalinstance restart --resource-group DSM05a-T550 --instance-name orcllabdsm01 

 

Important: 

 

Depending on the amount of memory in your Azure Large Instance, a restart and a reboot of the hardware and operating system can take up to one hour. 

 

 

Open a support request for ALI  

You can submit support requests specifically for ALI. 

 

In Azure portal, under Help + Support, create a New support request and provide the following information for the ticket: 

 

Issue type: Select an issue type. 

 

Subscription: Select your subscription. 

 

Service: Epic on Azure  

 

Category:  ALI (ALI) 

 

Resource: Provide the name of the instance. 

 

Summary: Provide a summary of your request. 

 

Problem type: Select a problem type. 

 

Problem subtype: Select a subtype for the problem. 

 

Select the Solutions tab to find a solution to your problem. If you can't find a solution, go to the next step. 

 

Select the Details tab and select whether the issue is with VMs or ALI(ALI)  

. This information helps direct the support request to the correct specialists. 

 

Indicate when the problem began and select the instance region. 

 

Provide more details about the request and upload a file if needed. 

 

Select Review + Create to submit the request. 

 

It takes up to five business days for a support representative to confirm your request. 

 