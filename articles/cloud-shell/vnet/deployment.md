---
description: This article provides step-by-step instructions to deploy Azure Cloud Shell in a private virtual network.
ms.contributor: jahelmic
ms.date: 02/05/2025
ms.topic: how-to
ms.custom: devx-track-arm-template
title: Deploy Azure Cloud Shell in a virtual network with quickstart templates
---

# Deploy Azure Cloud Shell in a virtual network by using quickstart templates

Before you run quickstart templates to deploy Azure Cloud Shell in a virtual network (VNet), there
are several prerequisites to complete. You must have the **Owner** role assignment on the
subscription. To view and assign roles, see [List Owners of a Subscription][05].

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
- **Microsoft.ContainerInstance**
- **Microsoft.Relay**

Depending on when your tenant was created, some of these providers might already be registered.

To see all resource providers and the registration status for your subscription:

1. Sign in to the [Azure portal][14].
1. On the Azure portal menu, search for **Subscriptions**. Select it from the available options.
1. Select the subscription that you want to view.
1. On the left menu, under **Settings**, select **Resource providers**.
1. In the search box, enter `cloudshell` to search for the resource provider.
1. Select the **Microsoft.CloudShell** resource provider from the provider list.
1. Select **Register** to change the status from **unregistered** to **registered**.
1. Repeat the previous steps for the **Microsoft.ContainerInstance** and **Microsoft.Relay**
   resource providers.

[![Screenshot of selecting resource providers in the Azure portal.][98a]][98b]

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

- [Manage Azure resource groups by using the Azure portal][03]
- [Manage Azure resource groups by using Azure CLI][02]
- [Manage Azure resource groups by using Azure PowerShell][04]

### Create a virtual network

You can create the virtual network by using the Azure portal, the Azure CLI, or Azure PowerShell.
For more information, see the following articles:

- [Use the Azure portal to create a virtual network][07]
- [Use Azure PowerShell to create a virtual network][08]
- [Use Azure CLI to create a virtual network][06]

> [!NOTE]
> When you're setting the container subnet address prefix for the Cloud Shell subnet, it's important
> to consider the number of Cloud Shell sessions that you need to run concurrently. If the number of
> Cloud Shell sessions exceeds the available IP addresses in the container subnet, users of those
> sessions can't connect to Cloud Shell. Increase the container subnet range to accommodate your
> specific needs. For more information, see the "Change subnet settings" section of
> [Add, change, or delete a virtual network subnet][09].

### Get the Azure container instance ID

The Azure container instance ID is a unique value for every tenant. You use this identifier in the
[quickstart templates][12] to configure a virtual network for Cloud Shell. To get the ID from the
command line, see [Alternate way to get the Azure Container Instance ID][10].

1. Sign in to the [Azure portal][14]. From the home page, select **Microsoft Entra ID**. If the icon
   isn't displayed, enter `Microsoft Entra ID` in the top search bar.
1. On the left menu, select **Overview**. Then enter `azure container instance service` in the
   search bar.

   [![Screenshot of searching for Azure Container Instance Service.][95a]][95b]

1. In the results, under **Enterprise applications**, select **Azure Container Instance Service**.
1. On the **Overview** page for **Azure Container Instance Service**, locate the **Object ID** value
   listed under **Properties**.

   You use this ID in the quickstart template for the virtual network.

   [![Screenshot of Azure Container Instance Service details.][96a]][96b]

## 3. Create the required network resources by using the ARM template

To create Cloud Shell resources in a virtual network, use the ARM template named
[Azure Cloud Shell - VNet][12]. The template creates three subnets under the virtual network that
you created earlier. You might choose to change the supplied names of the subnets or use the
defaults.

The virtual network and the subnets require valid IP address assignments. You need enough addresses
to support the following resources:

- At least one IP address for the Relay subnet
- Enough IP addresses in the container subnet to support the number of concurrent sessions that you
  expect to use

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

|  Project details   |                                                                Value                                                                |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Subscription**   | Defaults to the current subscription context.<br>The example in this article uses `Contoso`.                                        |
| **Resource group** | Enter the name of the resource group from the prerequisite information.<br>The example in this article uses `rg-cloudshell-eastus`. |

|          Instance details           |                                                                        Value                                                                        |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Region**                          | Prefilled with your default region.<br>The example in this article uses `East US`.                                                                  |
| **Existing VNET Name**              | Fill in the value from the prerequisite information that you gathered.<br>The example in this article uses `vnet-cloudshell-eastus`.                |
| **Relay Namespace Name**            | Create a name that you want to assign to the Relay resource that the template creates.<br>The example in this article uses `arn-cloudshell-eastus`. |
| **Nsg Name**                        | Enter the name of the NSG. The deployment creates this NSG and assigns an access rule to it.                                                        |
| **Azure Container Instance OID**    | Fill in the value from the prerequisite information that you gathered.<br>The example in this article uses `aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb`.  |
| **Container Subnet Name**           | Defaults to `cloudshellsubnet`. Enter the name of the subnet for your container.                                                                    |
| **Container Subnet Address Prefix** | The example in this article uses `10.0.1.0/24`, which provides 254 IP addresses for Cloud Shell instances.                                          |
| **Relay Subnet Name**               | Defaults to `relaysubnet`. Enter the name of the subnet that contains your relay.                                                                   |
| **Relay Subnet Address Prefix**     | The example in this article uses `10.0.2.0/24`.                                                                                                     |
| **Storage Subnet Name**             | Defaults to `storagesubnet`. Enter the name of the subnet that contains your storage.                                                               |
| **Storage Subnet Address Prefix**   | The example in this article uses `10.0.3.0/24`.                                                                                                     |
| **Private Endpoint Name**           | Defaults to `cloudshellRelayEndpoint`. Enter the name of the subnet that contains your container.                                                   |
| **Tag Name**                        | Defaults to `{"Environment":"cloudshell"}`. Leave unchanged or add more tags.                                                                       |
| **Location**                        | Defaults to `[resourceGroup().location]`. Leave unchanged.                                                                                          |

After the form is complete, select **Review + Create** and deploy the network ARM template to your
subscription.

## 4. Create the virtual network storage by using the ARM template

To create Cloud Shell resources in a virtual network, use the ARM template named
[Azure Cloud Shell - VNet storage][13]. The template creates the storage account and assigns it to
the private virtual network.

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

|  Project details   |                                                                Value                                                                |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Subscription**   | Defaults to the current subscription context.<br>The example in this article uses `Contoso`.                                        |
| **Resource group** | Enter the name of the resource group from the prerequisite information.<br>The example in this article uses `rg-cloudshell-eastus`. |

|          Instance details          |                                                Value                                                |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Region**                         | Prefilled with your default region.<br>The example in this article uses `East US`.                  |
| **Existing VNET Name**             | The example in this article uses `vnet-cloudshell-eastus`.                                          |
| **Existing Storage Subnet Name**   | Fill in the name of the resource that the network template creates.                                 |
| **Existing Container Subnet Name** | Fill in the name of the resource that the network template creates.                                 |
| **Storage Account Name**           | Create a name for the new storage account.<br>The example in this article uses `myvnetstorage1138`. |
| **File Share Name**                | Defaults to `acsshare`. Enter the name of the file share that you want to create.                   |
| **Resource Tags**                  | Defaults to `{"Environment":"cloudshell"}`. Leave unchanged or add more tags.                       |
| **Location**                       | Defaults to `[resourceGroup().location]`. Leave unchanged.                                          |

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

[![Screenshot of the Cloud Shell storage dialog.][97a]][97b]

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

## Alternate way to get the Azure Container Instance ID

If you have Azure PowerShell installed, you can use the following command to get the Azure Container
Instance ID.

```powershell
(Get-AzADServicePrincipal -DisplayNameBeginsWith 'Azure Container Instance').Id
```

```Output
d5f227bb-ffa6-4463-a696-7234626df63f
```

If you have the Azure CLI installed, you can use the following command to get the Azure Container
Instance ID.

```azurecli
az ad sp list --display-name 'Azure Container Instance' --query "[].id"
```

```Output
[
  "d5f227bb-ffa6-4463-a696-7234626df63f"
]
```

## Next steps

You must complete the Cloud Shell configuration steps for each user who needs to use the new private
Cloud Shell instance. Alternatively, you can configure your Cloud Shell instance to allow multiple
users to use the same storage resources. For more information, see
[Allow multiple users to use a single storage account and file share][01].

For improved security, you can configure your storage account to use a private endpoint. For more
information, see [Connect to a storage account using an Azure private endpoint][11].

<!-- link references -->
[01]: ../security/how-to-support-multiple-users.md
[02]: /azure/azure-resource-manager/management/manage-resource-groups-cli
[03]: /azure/azure-resource-manager/management/manage-resource-groups-portal
[04]: /azure/azure-resource-manager/management/manage-resource-groups-powershell
[05]: /azure/role-based-access-control/role-assignments-list-portal#list-owners-of-a-subscription
[06]: /azure/virtual-network/quick-create-cli
[07]: /azure/virtual-network/quick-create-portal
[08]: /azure/virtual-network/quick-create-powershell
[09]: /azure/virtual-network/virtual-network-manage-subnet?tabs=azure-portal#change-subnet-settings
[10]: #alternate-way-to-get-the-azure-container-instance-id
[11]: how-to-use-private-endpoint-storage.md
[12]: https://aka.ms/cloudshell/docs/vnet/template
[13]: https://azure.microsoft.com/resources/templates/cloud-shell-vnet-storage/
[14]: https://portal.azure.com

[95a]: media/deployment/container-service-search.png
[95b]: media/deployment/container-service-search.png#lightbox
[96a]: media/deployment/container-service-details.png
[96b]: media/deployment/container-service-details.png#lightbox
[97a]: media/deployment/setup-cloud-shell-storage.png
[97b]: media/deployment/setup-cloud-shell-storage.png#lightbox
[98a]: media/deployment/resource-provider.png
[98b]: media/deployment/resource-provider.png#lightbox
