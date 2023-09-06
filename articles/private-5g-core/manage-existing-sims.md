---
title: Manage existing SIMs - Azure portal
description: In this how-to guide, learn how to manage existing SIMs in your private mobile network using the Azure portal.  
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 06/16/2022
ms.custom: template-how-to
---

# Manage existing SIMs for Azure Private 5G Core - Azure portal

*SIM* resources represent physical SIMs or eSIMs used by user equipment (UEs) served by the private mobile network. In this how-to guide, you'll learn how to manage existing SIMs, including how to assign static IP addresses and SIM policies.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
- Identify the name of the Mobile Network resource corresponding to your private mobile network.

## View existing SIMs

You can view your existing SIMs in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. To see a list of all existing SIMs in the private mobile network, select **SIMs** from the **Resource** menu.

    :::image type="content" source="media/manage-existing-sims/sims-list-inline.png" alt-text="Screenshot of the Azure portal. It shows a list of currently provisioned SIMs for a private mobile network." lightbox="media/manage-existing-sims/sims-list-enlarged.png":::

1. To see a list of existing SIMs in a particular SIM group, select **SIM groups** from the resource menu, and then select your chosen SIM group from the list. 

    :::image type="content" source="media/sim-group-resource.png" alt-text="Screenshot of the Azure portal. It shows a list of currently provisioned SIMs in a SIM group." lightbox="media/sim-group-resource-enlarged.png":::

## Assign SIM policies

SIMs need an assigned SIM policy before they can use your private mobile network. You may want to assign a SIM policy to an existing SIM that doesn't already have one, or you may want to change the assigned SIM policy for an existing SIM. For information on configuring SIM policies, see [Configure a SIM policy](configure-sim-policy-azure-portal.md).

To assign a SIM policy to one or more SIMs:

1. Search for and select the **Mobile Network** resource representing the private mobile network containing your SIMs.
1. In the resource menu, select **SIMs**.
1. You'll see a list of provisioned SIMs in the private mobile network. For each SIM policy you want to assign to one or more SIMs, do the following:

    1. Select the checkbox next to the name of each SIM to which you want to assign the SIM policy.
    1. Select **Assign SIM policy**.
    1. In **Assign SIM policy** on the right, select your chosen SIM policy from the **SIM policy** drop-down menu.
    1. Select **Assign SIM policy**.
    
        :::image type="content" source="media/manage-existing-sims/assign-sim-policy-inline.png" alt-text="Screenshot of the Azure portal. It shows a list of provisioned SIMs and fields to assign a SIM policy." lightbox="media/manage-existing-sims/assign-sim-policy-enlarged.png":::

1. The Azure portal will now begin deploying the configuration change. When the deployment is complete, select **Go to resource** (if you have assigned a SIM policy to a single SIM) or **Go to resource group** (if you have assigned a SIM policy to multiple SIMs).

    - If you assigned a SIM policy to a single SIM, you'll be taken to that SIM resource. Check the **SIM policy** field in the **Management** section to confirm that the correct SIM policy has been assigned successfully.
    - If you assigned a SIM policy to multiple SIMs, you'll be taken to the resource group containing your private mobile network. Select the **Mobile Network** resource, and then select **SIMs** in the resource menu. Check the **SIM policy** column in the SIMs list to confirm the correct SIM policy has been assigned to your chosen SIMs.

1. Repeat this step for any other SIM policies you want to assign to SIMs.

## Assign static IP addresses

Static IP address allocation ensures that a UE receives the same IP address every time it connects to the private mobile network. This is useful when you want Internet of Things (IoT) applications to be able to consistently connect to the same device. For example, you may configure a video analysis application with the IP addresses of the cameras providing video streams. If these cameras have static IP addresses, you won't need to reconfigure the video analysis application with new IP addresses each time the cameras restart.

If you've configured static IP address allocation for your packet core instance(s), you can assign static IP addresses to the SIMs you've provisioned. If you have multiple data networks in your private mobile network, you can assign a different static IP address for each data network to the same SIM.

Each IP address must come from the pool you assigned for static IP address allocation when creating the relevant data network, as described in [Collect data network values](collect-required-information-for-a-site.md#collect-data-network-values). For more information, see [Allocate User Equipment (UE) IP address pools](complete-private-mobile-network-prerequisites.md#allocate-user-equipment-ue-ip-address-pools).

If you're assigning a static IP address to a SIM, you'll also need the following information.

- The SIM policy to assign to the SIM. You won't be able to set a static IP address for a SIM without also assigning a SIM policy.
- The name of the data network the SIM will use.
- The site and data network at which the SIM will use this static IP address.

To assign static IP addresses to SIMs:

1. Search for and select the **Mobile Network** resource representing the private mobile network containing your SIMs.
1. In the resource menu, select **SIMs**.
1. You'll see a list of provisioned SIMs in the private mobile network. Select each SIM to which you want to assign a static IP address, and then select **Assign Static IPs**.

    :::image type="content" source="media/manage-existing-sims/assign-static-ips.png" alt-text="Screenshot of the Azure portal showing a list of provisioned SIMs. Selected SIMs and the Assign Static IPs button are highlighted.":::

1. In **Assign static IP configurations** on the right, run the following steps for each SIM in turn. If your private mobile network has multiple sites and you want to assign a different static IP address for each site to the same SIM, you'll need to repeat these steps on the same SIM for each IP address.

    1. Set **SIM name** your chosen SIM.
    1. Set **SIM policy** to the SIM policy you want to assign to this SIM.
    1. Set **Slice** to **slice-1**. 
    1. Set **Data network name** to the name of the data network this SIM will use.
    1. Set **Site** to the site at which the SIM will use this static IP address.
    1. Set **Static IP** to your chosen IP address.
    1. Select **Save static IP configuration**. The SIM will then appear in the list under **Number of pending changes**.

    :::image type="content" source="media/manage-existing-sims/assign-static-ip-configurations.png" alt-text="Screenshot of the Azure portal showing the Assign static IP configurations screen.":::

1. Once you have assigned static IP addresses to all of your chosen SIMs, select **Assign static IP configurations**.
1. The Azure portal will now begin deploying the configuration change. When the deployment is complete, select **Go to resource** (if you have assigned a static IP address to a single SIM) or **Go to resource group** (if you have assigned static IP addresses to multiple SIMs).

    - If you assigned a static IP address to a single SIM, you'll be taken to that SIM resource. Check the **SIM policy** field in the **Management** section and the list under the **Static IP Configuration** section to confirm that the correct SIM policy and static IP address have been assigned successfully.
    - If you assigned static IP addresses to multiple SIMs, you'll be taken to the resource group containing your private mobile network. Select the **Mobile Network** resource, and then select **SIMs** in the resource menu. Check the **SIM policy** column in the SIMs list to confirm the correct SIM policy has been assigned to your chosen SIMs. You can then select an individual SIM and check the **Static IP Configuration** section to confirm that the correct static IP address has been assigned to that SIM.

## Delete SIMs

Deleting a SIM will remove it from your private mobile network.

1. Search for and select the **Mobile Network** resource representing the private mobile network containing your SIMs.
1. In the resource menu, select **SIMs**.
1. Select the checkbox next to each SIM you want to delete.
1. Select **Delete**.
1. Select **Delete** to confirm you want to delete the SIM(s).

## Next steps
If you need to add more SIMs, you can provision them using the Azure portal or an Azure Resource Manager template (ARM template).
- [Provision new SIMs - Azure portal](provision-sims-azure-portal.md)
- [Provision new SIMs - ARM template](provision-sims-arm-template.md)
