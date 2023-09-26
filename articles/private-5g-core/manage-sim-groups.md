---
title: Manage SIM groups - Azure portal
titleSuffix: Azure Private 5G Core
description: With this how-to guide, learn how to manage SIM groups for Azure Private 5G Core through the Azure portal.  
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 06/16/2022
ms.custom: template-how-to
---

# Manage SIM groups - Azure portal

*SIM groups* allow you to sort SIMs into categories for easier management. Each SIM must be a member of a SIM group, but can't be a member of more than one. If you only have a small number of SIMs, you may want to add them all to the same SIM group. Alternatively, you can create multiple SIM groups to sort your SIMs. For example, you could categorize your SIMs by their purpose (such as SIMs used by specific UE types like cameras or cellphones), or by their on-site location. In this how-to guide, you'll learn how to create, delete, and view SIM groups using the Azure portal.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
- Identify the name of the Mobile Network resource corresponding to your private mobile network.

## View existing SIM groups

You can view your existing SIM groups in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network to which you want to add a SIM group.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the **Resource** menu, select **SIM groups** to see a list of existing SIM groups.

    :::image type="content" source="media/manage-sim-groups/sim-groups-list.png" alt-text="Screenshot of the Azure portal showing a list of SIM groups. The SIM groups resource menu option is highlighted." :::

## Create a SIM group

You can create new SIM groups in the Azure portal. As part of creating a SIM group, you'll be given the option of provisioning new SIMs to add to your new SIM group. If you want to provision new SIMs, you'll need to [Collect SIM and SIM Group values](collect-required-information-for-private-mobile-network.md#collect-sim-and-sim-group-values) before you start.

To create a new SIM group:

1. Navigate to the list of SIM groups in your private mobile network, as described in [View existing SIM groups](#view-existing-sim-groups).
1. Select **Create**.
1. Do the following on the **Basics** configuration tab.

   - Enter a name for the new SIM group into the **SIM group name** field.
   - In the **Region** field, select the region in which you deployed the private mobile network.
   - Select your private mobile network from the **Mobile network** drop-down menu.

        :::image type="content" source="media/manage-sim-groups/create-sim-group-basics-tab.png" alt-text="Screenshot of the Azure portal showing the Basics configuration tab.":::

1. Select **Next: Encryption**.
1. On the **Encryption** configuration tab, select your chosen encryption type next to **Encryption Type**. By default, Microsoft-managed keys (MMK) is selected. Once created, you cannot change the encryption type of a SIM group.

    - If you leave **Microsoft-managed keys (MMK)** selected, you will not need to enter any more configuration information on this tab.
    - If you select **Customer-managed Keys (CMK)**, a new set of fields will appear. You need to provide the Key URI and User-assigned identity created or collected in [Collect SIM and SIM Group values](collect-required-information-for-private-mobile-network.md#collect-sim-and-sim-group-values). These values can be updated as required after SIM group creation.
        :::image type="content" source="media/manage-sim-groups/create-sim-group-encryption-tab.png" alt-text="Screenshot of the Azure portal showing the Encryption configuration tab.":::

1. Select **Next: SIMs**.
1. On the **SIMs** configuration tab, select your chosen input method by selecting the appropriate option next to **How would you like to input the SIMs information?**. You can then input the information you collected for your SIMs.

    - If you decided that you don't want to provision any SIMs at this point, select **Add SIMs later**.
    - If you select **Add manually**, a new **Add SIM** button will appear under **Enter SIM profile configurations**. Select it, fill out the fields with the correct settings for the first SIM you want to provision, and select **Add SIM**. Repeat this process for every additional SIM you want to provision.

    :::image type="content" source="media/add-sim-manually.png" alt-text="Screenshot of the Azure portal showing the Add SIM screen.":::

    - If you select **Upload JSON file**, the **Upload SIM profile configurations** field will appear. Use this field to upload your chosen JSON file.

        :::image type="content" source="media/manage-sim-groups/create-sim-group-sims-tab.png" alt-text="Screenshot of the Azure portal showing the SIMs configuration tab.":::

1. Select **Review + create**.
1. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

    :::image type="content" source="media/manage-sim-groups/create-sim-group-review-create-tab.png" alt-text="Screenshot of the Azure portal showing validated configuration for a SIM group.":::

    If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once your configuration has been validated, you can select **Create** to create the SIM group. The Azure portal will display the following confirmation screen when the SIM group has been created.

    :::image type="content" source="media/manage-sim-groups/sim-group-deployment-complete.png" alt-text="Screenshot of the Azure portal. It shows confirmation of the successful creation of a SIM group.":::

1. Click **Go to resource group** and then select your new SIM group from the list of resources. You'll be shown your new SIM group and any SIMs you've provisioned.

    :::image type="content" source="media/sim-group-resource.png" alt-text="Screenshot of the Azure portal showing a SIM group containing SIMs." lightbox="media/sim-group-resource-enlarged.png" :::

1. At this point, your SIMs will not have any assigned SIM policies and so will not be brought into service. If you want to begin using the SIMs, [assign a SIM policy to them](manage-existing-sims.md#assign-sim-policies). If you've configured static IP address allocation for your packet core instance(s), you may also want to [assign static IP addresses](manage-existing-sims.md#assign-static-ip-addresses) to the SIMs you've provisioned.

## Modify a SIM group

If you have configured CMK encryption for your SIM group, you can modify the key URI and user-assigned identity through the Azure portal.

1. Navigate to the list of SIM groups in your private mobile network, as described in [View existing SIM groups](#view-existing-sim-groups).
1. Select the SIM group you want to modify.
1. Select the **Encryption** blade.

    :::image type="content" source="media/manage-sim-groups/modify-sim-group-encryption.png" alt-text="Screenshot of the Azure portal showing the Encryption blade of a SIM group."  lightbox="media/manage-sim-groups/modify-sim-group-encryption.png" :::

1. If you want to change the key URI, enter the new value in the **Key URI** field using the values you collected in [Collect SIM and SIM group values](collect-required-information-for-private-mobile-network.md#collect-sim-and-sim-group-values).
1. If you want to change the user-assigned identity, click the current **User-assigned identity** hyperlink. This expands a new window to select the new identity. Select the identity created in [Collect SIM and SIM group values](collect-required-information-for-private-mobile-network.md#collect-sim-and-sim-group-values) and select **Add**.

    :::image type="content" source="media/manage-sim-groups/modify-sim-group-identity-select.png" alt-text="Screenshot of the Azure portal showing the Select user assigned managed identity selection window for a SIM group."  lightbox="media/manage-sim-groups/modify-sim-group-identity-select.png" :::

1. Select **Next**.
1. Review your changes. If they are correct, select **Create**.

## Delete a SIM group

You can delete SIM groups through the Azure portal.

1. Navigate to the list of SIM groups in your private mobile network, as described in [View existing SIM groups](#view-existing-sim-groups).
1. Make sure any SIMs in the SIM group are no longer needed. When you delete the SIM group, all SIMs that it contains will be deleted.
1. Select the checkbox next to the SIM group you want to delete.
1. Select **Delete** from the **Command** bar.
1. In the pop-up that appears, select **Delete** to confirm you want to delete the SIM group.

## Next steps

Learn more about how to manage the SIMs in your SIM groups.

- [Manage existing SIMs - Azure portal](manage-existing-sims.md)
