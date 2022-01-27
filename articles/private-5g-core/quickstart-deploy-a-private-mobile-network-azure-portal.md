---
title: Quickstart - Deploy an example private mobile network
titlesuffix: Azure Private 5G Core Preview
description: Learn how to use Azure Private 5G Core Preview to deploy an example private mobile network in minutes through Azure portal. 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: quickstart
ms.date: 12/30/2021
ms.custom: template-quickstart
---

# Quickstart: Deploy an example private mobile network - Azure portal

Azure Private 5G Core Preview allows you to deploy a private mobile network on an enterprise's premises from anywhere in the world in minutes. In this quickstart, you'll learn how to use the Azure portal to deploy a simple, example private mobile network.

## Prerequisites

- Complete all of the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
- Ensure that you know the name of the **Azure Network Function Manager - Device** resource representing the Azure Stack Edge device you created as part of the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- Request a product key from your support representative.

## Deploy the Mobile Network and Service resources

1. Sign in to the [Azure portal](https://aka.ms/PMNSPortal).
1. In the Search bar, type *mobile networks* and then select the **Mobile Networks** service from the results that appear.

    :::image type="content" source="media\mobile-networks-search.png" alt-text="Screenshot of the Azure portal showing a search for the Mobile Networks service.":::

1. On the Mobile Networks page, click **Create**.

    :::image type="content" source="media\create-button-mobile-networks.png" alt-text="Screenshot of the Azure portal showing the Create button on the Mobile Networks page.":::

1. On the **Basics** configuration tab, fill out the fields as follows.

   |Field  |Value  |
   |---------|---------|
   |**Subscription**                  |\<your subscription\>|
   |**Resource group**                |*Contoso*|
   |**Mobile network name**           |*ContosoPMN*|
   |**Region**                        |*East US*|
   |**Mobile country code (MCC)**     |*001*|
   |**Mobile country code (MCC)**     |*01*|

1. Once you have filled out all of the fields, click **Next : SIMs >**.
1. On the **SIMs** configuration tab, select the **Add SIMs later** radio button, and then click **Review + create**.
1. The Azure portal will now validate the configuration values you have entered. You should see a message indicating your values have passed validation. Click **Create** to create the private mobile network.
1. The Azure portal will now deploy your **Mobile Network** resource into the new resource group. You will see the following confirmation screen when the deployment is complete.

    :::image type="content" source="media/pmn-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of Mobile Network and Service resources.":::

1. Click on **Go to resource group**, and then check that your new resource group contains the correct **Mobile Network** and **Service** resources. Note that you may need to tick the **Show hidden types** checkbox to display all resources.

    :::image type="content" source="media/pmn-deployment-resource-group.png" alt-text="Screenshot of the Azure portal showing a resource group containing Mobile Network and Service resources.":::

1. Click on the name of the **Mobile Network** resource and then move to the next step.

## Configure settings for the Site resource

1. On the **Get started** tab, click **Create sites**.

    :::image type="content" source="media/create-sites-button.png" alt-text="Screenshot of the Azure portal showing the Get started tab, with the Create sites button highlighted.":::

1. On the **Basics** configuration tab, fill out the fields as follows.

   |Field  |Value  |
   |---------|---------|
   |**Subscription**         |\<your subscription\>|
   |**Resource group**       |*Contoso*|
   |**Site name**  |*Site1*|
   |**Region**               |*East US*|
   |**Mobile network**       |*ContosoPMN*|

1. Click **Next - Packet core >**.
1. On the **Packet core** configuration tab, set the **Technology type** field to *5G*, and then leave the **Version** and **Custom location** fields blank.
1. Under the **Access network** heading, fill out the fields as follows.

   |Field  |Value  |
   |---------|---------|
   |**Tracking area codes**    |*0001*|

1. Under the **Attached data networks** heading, fill out the fields as follows.

   |Field  |Value  |
   |---------|---------|
   |**Data network** |*internet*|
   |**NAPT**         |*Enabled*|

1. Click **Review + create**.
1. The Azure portal will now validate the configuration values you have entered. You should see a message indicating your values have passed validation. Click **Create** to create the site.
1. The Azure portal will now deploy a **Arc for network functions - Packet Core** resource representing the site's packet core instance into the resource group. You will see the following confirmation screen when the deployment is complete.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of the Arc for network functions - Packet Core resource.":::

1. Click on **Go to resource group**, and then check that your new resource group contains the correct **Arc for network functions - Packet Core** resource. Note that you may need to tick the **Show hidden types** checkbox to display all resources. Once you have confirmed this, keep the resource group displayed in the Azure portal and move to the next step.

## Verify that the correct resources have been created and that the connection is active

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).
1. Search for *contoso-arc-rg* and select the resource group that appears.
1. Check the contents of the resource group to confirm that it contains **Custom Location**, **Kubernetes - Azure Arc**, and **Log Analytics workspace** resources.
1. Select the **Kubernetes - Azure Arc** resource and confirm that the **Status** field is set to **Connected**.

    :::image type="content" source="media/kubernetes-azure-arc-resource.png" alt-text="Screenshot of the Azure portal showing the Status field on a Kubernetes - Azure Arc resource.":::

## Configure the custom location

1. In the Azure portal, search for *ContosoPMN* and select the Mobile Network resource that appears.
1. On the left side bar, click **Sites**.
1. Select **Site1**.

    :::image type="content" source="media/select-site.png" alt-text="Screenshot of the Azure portal showing the available sites in the private mobile network.":::

1. Select **Configure a custom location**.

    :::image type="content" source="media/configure-a-custom-location.png" alt-text="Screenshot of the Azure portal showing the Configure a custom location option.":::

1. On the **Configuration** tab, select **contoso-arc-custom-loc** from the **Custom ARC location** drop down menu.
1. Click **Apply**.
1. Return to the **Site1** resource and confirm that the **Edge custom location** field is now set to **contoso-arc-custom-loc**.

    :::image type="content" source="media/configured-custom-location.png" alt-text="Screenshot of the Azure portal showing a correctly configured custom location on a site.":::

You've now fully deployed the example private mobile network.

## Clean up resources

You can now remove your example private mobile network by deleting resources as follows.

<!-- 8. Need to also cover the Azure ARC RG. 
-->

1. In the Azure portal, search for *contoso* and select the resource group that appears.
1. Tick the **Show hidden types** checkbox.
1. Delete the resource types in the following order.
    - **microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes/attacheddatanetworks**
    - **microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes**
    - **Arc for network functions – Packet Core**
    - **Mobile Network Site**
    - **Mobile Network**

## Next steps

Collect the information you'll need to deploy your own private mobile network.
> [!div class="nextstepaction"]
> [Next steps button](collect-required-information-for-private-mobile-network.md)