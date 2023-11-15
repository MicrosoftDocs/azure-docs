---
description: This article provides step-by-step instructions to deploy Azure Cloud Shell in a private virtual network.
ms.contributor: jahelmic
ms.date: 11/01/2023
ms.topic: article
ms.custom: devx-track-arm-template
title: Deploy Azure Cloud Shell in a virtual network with quickstart templates
---

# Deploy Cloud Shell in a virtual network by using quickstart templates

Before you run quickstart templates to deploy Azure Cloud Shell in a virtual network (VNet), there
are several prerequisites to complete. You must have the **Owner** role assignment on the
subscription. To view and assign roles, see [List Owners of a Subscription][10].

This article walks you through the following steps to configure and deploy Cloud Shell in a virtual
network:

1. Register resource providers.
1. Collect the required information.
1. Create the virtual networks by using the **Azure Cloud Shell - VNet** Azure Resource Manager
   template (ARM template).
1. Create the virtual network storage account by using the **Azure Cloud Shell - VNet storage** ARM
   template.
1. Configure and use Cloud Shell in a virtual network.

## 1. Register resource providers

Cloud Shell needs access to certain Azure resources. You make that access available through
resource providers. The following resource providers must be registered in your subscription:

- **Microsoft.CloudShell**
- **Microsoft.ContainerInstances**
- **Microsoft.Relay**

Depending on when your tenant was created, some of these providers might already be registered.

To see all resource providers and the registration status for your subscription:

1. Sign in to the [Azure portal][04].
1. On the Azure portal menu, search for **Subscriptions**. Select it from the available options.
1. Select the subscription that you want to view.
1. On the left menu, under **Settings**, select **Resource providers**.
1. In the search box, enter `cloudshell` to search for the resource provider.
1. Select the **Microsoft.CloudShell** resource provider from the provider list.
1. Select **Register** to change the status from **unregistered** to **registered**.
1. Repeat the previous steps for the **Microsoft.ContainerInstances** and **Microsoft.Relay**
   resource providers.

[![Screenshot of selecting resource providers in the Azure portal.][98]][98a]

## 2. Collect the required information

You need to collect several pieces of information before you can deploy Cloud Shell.

You can use the default Cloud Shell instance to gather the required information and create the
necessary resources. You should create dedicated resources for the Cloud Shell virtual network
deployment. All resources must be in the same Azure region and in the same resource group.

Fill in the following values:

- **Subscription**: The name of your subscription that contains the resource group for the Cloud
  Shell virtual network deployment.
- **Resource Group**: The name of the resource group for the Cloud Shell virtual network deployment.
- **Region**: The location of the resource group.
- **Virtual Network**: The name of the Cloud Shell virtual network.
- **Subnet Address ranges** - This deployment creates three subnets. You need to plan your address
  ranges for each subnet.
  - **Container subnet** - You need enough IP addresses to support the number of concurrent sessions
    that you expect to use.
  - **Relay Subnet** - You need at least one IP address for the Relay subnet.
  - **Storage Subnet Name** - You need enough IP addresses to support the number of concurrent
    sessions that you expect to use.
- **Azure Container Instance OID**: The ID of the Azure container instance for your resource group.
- **Azure Relay Namespace**: The name that you want to assign to the Azure Relay resource that the
  template creates.

### Create a resource group

You can create the resource group by using the Azure portal, the Azure CLI, or Azure PowerShell. For
more information, see the following articles:

- [Manage Azure resource groups by using the Azure portal][02]
- [Manage Azure resource groups by using Azure CLI][01]
- [Manage Azure resource groups by using Azure PowerShell][03]

### Create a virtual network

You can create the virtual network by using the Azure portal, the Azure CLI, or Azure PowerShell.
For more information, see the following articles:

- [Use the Azure portal to create a virtual network][05]
- [Use Azure PowerShell to create a virtual network][06]
- [Use Azure CLI to create a virtual network][04]

> [!NOTE]
> When you're setting the container subnet address prefix for the Cloud Shell subnet, it's important
> to consider the number of Cloud Shell sessions that you need to run concurrently. If the number of
> Cloud Shell sessions exceeds the available IP addresses in the container subnet, users of those
> sessions can't connect to Cloud Shell. Increase the container subnet range to accommodate your
> specific needs. For more information, see the "Change subnet settings" section of
> [Add, change, or delete a virtual network subnet][07].

### Get the Azure container instance ID

The Azure container instance ID is a unique value for every tenant. You use this identifier in
the [quickstart templates][07] to configure a virtual network for Cloud Shell.

1. Sign in to the [Azure portal][09]. From the home page, select **Microsoft Entra ID**. If the icon
   isn't displayed, enter `Microsoft Entra ID` in the top search bar.
1. On the left menu, select **Overview**. Then enter `azure container instance service` in the
   search bar.

   [![Screenshot of searching for Azure Container Instance Service.][95]][95a]

1. In the results, under **Enterprise applications**, select **Azure Container Instance Service**.
1. On the **Overview** page for **Azure Container Instance Service**, find the **Object ID** value
   that's listed as a property.

   You use this ID in the quickstart template for the virtual network.

   [![Screenshot of Azure Container Instance Service details.][96]][96a]

## 3. Create the required network resources by using the ARM template

Use the [Azure Cloud Shell - VNet][08] template to create Cloud Shell resources in a virtual
network. The template creates three subnets under the virtual network that you created earlier. You
might choose to change the supplied names of the subnets or use the defaults.

The virtual network, along with the subnets, requires valid IP address assignments. You need at
least one IP address for the Relay subnet and enough IP addresses in the container subnet to support
the number of concurrent sessions that you expect to use.

The ARM template requires specific information about the resources that you created earlier, along
with naming information for new resources. This information is filled out along with the prefilled
information in the form.

Information that you need for the template includes:

- **Subscription**: The name of your subscription that contains the resource group for the Cloud
  Shell virtual network.
- **Resource Group**: The name of an existing or newly created resource group.
- **Region**: The location of the resource group.
- **Virtual Network**: The name of the Cloud Shell virtual network.
- **Network Security Group**: The name that you want to assign to the network security group (NSG)
  that the template creates.
- **Azure Container Instance OID**: The ID of the Azure container instance for your resource group.

Fill out the form with the following information:

| Project details |                                                              Value                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Subscription**    | Defaults to the current subscription context.<br>The example in this article uses `Contoso (carolb)`.                                |
| **Resource group**  | Enter the name of the resource group from the prerequisite information.<br>The example in this article uses `rg-cloudshell-eastus`. |

|        Instance details         |                                                                     Value                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Region**                          | Prefilled with your default region.<br>The example in this article uses `East US`.                                                                |
| **Existing VNET Name**              | Fill in the value from the prerequisite information that you gathered.<br>The example in this article uses `vnet-cloudshell-eastus`.                   |
| **Relay Namespace Name**            | Create a name that you want to assign to the Relay resource that the template creates.<br>The example in this article uses `arn-cloudshell-eastus`. |
| **Nsg Name**                        | Enter the name of the NSG. The deployment creates this NSG and assigns an access rule to it.                          |
| **Azure Container Instance OID**    | Fill in the value from the prerequisite information that you gathered.<br>The example in this article uses `8fe7fd25-33fe-4f89-ade3-0e705fcf4370`.     |
| **Container Subnet Name**           | Defaults to `cloudshellsubnet`. Enter the name of the subnet for your container.                                                               |
| **Container Subnet Address Prefix** | The example in this article uses `10.1.0.0/16`, which provides 65,543 IP addresses for Cloud Shell instances.                                          |
| **Relay Subnet Name**               | Defaults to `relaysubnet`. Enter the name of the subnet that contains your relay.                                                                 |
| **Relay Subnet Address Prefix**     | The example in this article uses `10.0.2.0/24`.                                                                                                        |
| **Storage Subnet Name**             | Defaults to `storagesubnet`. Enter the name of the subnet that contains your storage.                                                             |
| **Storage Subnet Address Prefix**   | The example in this article uses `10.0.3.0/24`.                                                                                                        |
| **Private Endpoint Name**           | Defaults to `cloudshellRelayEndpoint`. Enter the name of the subnet that contains your container.                                                 |
| **Tag Name**                        | Defaults to `{"Environment":"cloudshell"}`. Leave unchanged or add more tags.                                                                  |
| **Location**                        | Defaults to `[resourceGroup().location]`. Leave unchanged.                                                                                     |

After the form is complete, select **Review + Create** and deploy the network ARM template to your
subscription.

## 4. Create the virtual network storage by using the ARM template

Use the [Azure Cloud Shell - VNet storage][09] template to create Cloud Shell resources in a virtual
network. The template creates the storage account and assigns it to the private virtual network.

The ARM template requires specific information about the resources that you created earlier, along
with naming information for new resources.

Information that you need for the template includes:

- **Subscription**: The name of the subscription that contains the resource group for the Cloud
  Shell virtual network.
- **Resource Group**: The name of an existing or newly created resource group.
- **Region**: The location of the resource group.
- **Existing virtual network name**: The name of the virtual network that you created earlier.
- **Existing Storage Subnet Name**: The name of the storage subnet that you created by using the
  network quickstart template.
- **Existing Container Subnet Name**: The name of the container subnet that you created by using the
  network quickstart template.

Fill out the form with the following information:

| Project details |                                                              Value                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Subscription**    | Defaults to the current subscription context.<br>The example in this article uses `Contoso (carolb)`.                                |
| **Resource group**  | Enter the name of the resource group from the prerequisite information.<br>The example in this article uses `rg-cloudshell-eastus`. |

|        Instance details        |                                              Value                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------ |
| **Region**                         | Prefilled with your default region.<br>The example in this article uses `East US`.                  |
| **Existing VNET Name**             | The example in this article uses `vnet-cloudshell-eastus`.                                          |
| **Existing Storage Subnet Name**   | Fill in the name of the resource that the network template creates.                                |
| **Existing Container Subnet Name** | Fill in the name of the resource that the network template creates.                                |
| **Storage Account Name**           | Create a name for the new storage account.<br>The example in this article uses `myvnetstorage1138`. |
| **File Share Name**                | Defaults to `acsshare`. Enter the name of the file share that you want to create.                         |
| **Resource Tags**                  | Defaults to `{"Environment":"cloudshell"}`. Leave unchanged or add more tags.                    |
| **Location**                       | Defaults to `[resourceGroup().location]`. Leave unchanged.                                       |

After the form is complete, select **Review + Create** and deploy the network ARM template to your
subscription.

## 5. Configure Cloud Shell to use a virtual network

After you deploy your private Cloud Shell instance, each Cloud Shell user must change their
configuration to use the new private instance.

If you used the default Cloud Shell instance before you deployed the private instance, you must
reset your user settings:

1. Open Cloud Shell.
1. Select **Cloud Shell settings** from the menu bar (gear icon).
1. Select **Reset user settings**, and then select **Reset**.

Resetting the user settings triggers the first-time user experience the next time you start Cloud
Shell.

[![Screenshot of the Cloud Shell storage dialog.][97]][97a]

1. Choose your preferred shell experience (Bash or PowerShell).
1. Select **Show advanced settings**.
1. Select the **Show VNET isolation settings** checkbox.
1. Choose the subscription that contains your private Cloud Shell instance.
1. Choose the region that contains your private Cloud Shell instance.
1. For **Resource group**, select the resource group that contains your private Cloud Shell
   instance.

   If you select the correct resource group, **Virtual network**, **Network profile**, and **Relay
   namespace** are automatically populated with the correct values.
1. For **File share**, enter the name of the file share that you created by using the storage
   template.
1. Select **Create storage**.

## Next steps

You must complete the Cloud Shell configuration steps for each user who needs to use the new private
Cloud Shell instance.

<!-- link references -->
[01]: /azure/azure-resource-manager/management/manage-resource-groups-cli
[02]: /azure/azure-resource-manager/management/manage-resource-groups-portal
[03]: /azure/azure-resource-manager/management/manage-resource-groups-powershell
[04]: /azure/virtual-network/quick-create-cli
[05]: /azure/virtual-network/quick-create-portal
[06]: /azure/virtual-network/quick-create-powershell
[07]: /azure/virtual-network/virtual-network-manage-subnet?tabs=azure-portal#change-subnet-settings
[08]: https://aka.ms/cloudshell/docs/vnet/template
[09]: https://azure.microsoft.com/resources/templates/cloud-shell-vnet-storage/
[10]: /azure/role-based-access-control/role-assignments-list-portal#list-owners-of-a-subscription
[95]: media/quickstart-deploy-vnet/container-service-search.png
[95a]: media/quickstart-deploy-vnet/container-service-search.png#lightbox
[96]: media/quickstart-deploy-vnet/container-service-details.png
[96a]: media/quickstart-deploy-vnet/container-service-details.png#lightbox
[97]: media/quickstart-deploy-vnet/setup-cloud-shell-storage.png
[97a]: media/quickstart-deploy-vnet/setup-cloud-shell-storage.png#lightbox
[98]: media/quickstart-deploy-vnet/resource-provider.png
[98a]: media/quickstart-deploy-vnet/resource-provider.png#lightbox