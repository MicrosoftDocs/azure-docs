---
description: >
  This article provides instructions for troubleshooting a private virtual network deployment of
  Azure Cloud Shell.
ms.contributor: jahelmic
ms.date: 10/26/2023
ms.topic: article
title: Troubleshoot Azure Cloud Shell in a private virtual network
---
# Troubleshoot Azure Cloud Shell in a private virtual network

This article provides instructions for troubleshooting a private virtual network deployment of Azure
Cloud Shell. For best results, and to be supportable, following the deployment instructions in the
[Deploy Azure Cloud Shell in a virtual network using quickstart templates][03] article.

## Verify you have set the correct permissions

To configure Azure Cloud Shell in a virtual network, you must have the **Owner** role assignment on
the subscription. To view and assign roles, see [List Owners of a Subscription][01].

Unless otherwise noted, all the troubleshooting steps start in **Subscriptions** section of the
Azure portal.

1. Sign in to the [Azure portal][02].
1. On the Azure portal menu, search for **Subscriptions**. Select it from the available options.
1. Select the subscription you want to view.

## Verify resource provider registrations

Azure Cloud Shell needs access to certain Azure resources. That access is made available through
resource providers. The following resource providers must be registered in your subscription:

- **Microsoft.CloudShell**
- **Microsoft.ContainerInstances**
- **Microsoft.Relay**

To see all resource providers, and the registration status for your subscription:

1. Go to the **Settings** section of left menu of your subscription page.
1. Select **Resource providers**.
1. In the search box, enter `cloudshell` to search for the resource provider.
1. Select the **Microsoft.CloudShell** resource provider register from the provider list.
1. Select **Register** to change the status from **unregistered** to **Registered**.
1. Repeat the previous steps for the **Microsoft.ContainerInstances** and **Microsoft.Relay**
   resource providers.

   [![Screenshot of selecting resource providers in the Azure portal.][ss01]][ss01x]

## Verify Azure Container Instance Service role assignments

The **Azure Container Instance Service** application needs specific permissions for the **Relay**
and **Network Profile** resources. Use the following steps to see the resources and the role
permissions for your subscription:

1. Go to the **Settings** section of left menu of your subscription page.
1. Select **Resource groups**.
1. Select the resource group you provided in the prerequisites for the deployment.
1. In the **Essentials** section of the **Overview**, select the **Show hidden types** checkbox.
   This checkbox allows you to see all the resources created by the deployment.

   [![Screenshot showing all the resources in your resource group.][ss02]][ss02x]

1. Select the network profile resource with the type of `microsoft.network/networkprofile`. The name
   should be `aci-networkProfile-<location>` where `<location>` is the location of the resource
   group.
1. On network profile page, select **Access control (IAM)** in the left menu.
1. Then select **Role assignments** from the top menu bar.
1. In the search box, enter `container`.
1. Verify that **Azure Container Instance Service** has the `Network Contributor` role.

   [![Screenshot showing the network profiles role assignments.][ss03]][ss03x]

1. From the Resources page, select the relay namespace resource with the type of `Relay`. The name
   should be the name of the relay namespace you provided in the deployment template.
1. On relay page, select **Access control (IAM)**, then select **Role assignments** from the top
   menu bar.
1. In the search box, enter `container`.
1. Verify that **Azure Container Instance Service** has the `Contributor` role.

   [![Screenshot showing the network relay role assignments.][ss04]][ss04x]

## Redeploy Cloud Shell for a private virtual network

Verify the configurations described in this article. If you continue receive an error message when
you try to use your deployment of Cloud Shell, you have two options:

1. Open a support ticket
1. Redeploy Cloud Shell for a private virtual network

### Open a support ticket

If you want to open a support ticket, you can do so from the Azure portal. Be sure to capture any
error messages, including the **Correlation Id** and **Activity Id** values. Don't change any
settings or delete any resources until instructed to by a support technician.

Follow these steps to open a support ticket:

1. Select the **Support & Troubleshooting** icon on the top navigation bar in the Azure portal.
1. From the **Support & Troubleshooting** pane, select **Help + support**.
1. Select **Create a support request** at the top of the center pane.
1. Follow the instructions to create a support ticket.

   [![Screenshot of creating a support ticket in the Azure portal.][ss05]][ss05x]

### Redeploy Cloud Shell for a private virtual network

Before you redeploy Cloud Shell, you must delete the existing deployment. In the prerequisites for
the deployment, you provided a resource group and a virtual network. If you created these resources
specifically for this deployment, then it should be safe to delete them. If you used existing
resources, then you shouldn't delete them.

The following list provides a description of the resources created by the deployment:

- A **microsoft.network/networkprofiles** resource named `aci-networkProfile-<location>` where
  `<location>` is the location of the resource group.
- A **Private endpoint** resource named `cloudshellRelayEndpoint`.
- A **Network Interface** resource named `cloudshellRelayEndpoint.nic.<UUID>` where `<UUID>` is a
  unique identifier added to the name.
- A **Virtual Network** resource that you provided from the prerequisites.
- A **Private DNS zone** named `privatelink.servicebus.windows.net`.
- A **Network security group** resource with the name you provided in the deployment template.
- A **microsoft.network/privatednszones/virtualnetworklinks** resource with a name starting the name
  of the relay namespace you provided in the deployment template.
- A **Relay** resource with the name of the relay namespace you provided in the deployment template.
- A **Storage account** resource with the name you provided in the deployment template.

Once you have removed the resources, you can redeploy Cloud Shell by following the steps in the
[Deploy Azure Cloud Shell in a virtual network using quickstart templates][03] article.

You can find these resources by viewing the resource group in the Azure portal.

[![Screenshot of resources created by the deployment.][ss02]][ss02x]

<!-- link references -->
[01]: /azure/role-based-access-control/role-assignments-list-portal#list-owners-of-a-subscription
[02]: https://portal.azure.com/
[03]: quickstart-deploy-vnet.md

[ss01]: ./media/quickstart-deploy-vnet/resource-provider.png
[ss01x]: ./media/quickstart-deploy-vnet/resource-provider.png#lightbox
[ss02]: ./media/vnet-troubleshooting/show-resource-group.png
[ss02x]: ./media/vnet-troubleshooting/show-resource-group.png#lightbox
[ss03]: ./media/vnet-troubleshooting/network-profile-role.png
[ss03x]: ./media/vnet-troubleshooting/network-profile-role.png#lightbox
[ss04]: ./media/vnet-troubleshooting/relay-namespace-role.png
[ss04x]: ./media/vnet-troubleshooting/relay-namespace-role.png#lightbox
[ss05]: ./media/vnet-troubleshooting/create-support-ticket.png
[ss05x]: ./media/vnet-troubleshooting/create-support-ticket.png#lightbox
