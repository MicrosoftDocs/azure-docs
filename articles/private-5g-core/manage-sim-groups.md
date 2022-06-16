---
title: Manage SIM groups - Azure portal
titleSuffix: Azure Private 5G Core Preview
description: With this how-to guide, learn how to manage SIM groups for Azure Private 5G Core Preview through the Azure portal.  
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 06/16/2022
ms.custom: template-how-to
---

# Manage SIM groups - Azure portal

*SIM groups* allow you to sort SIMs into categories for easier management. If you only have a small number of SIMs, you may want to add them all to a single SIM group. Alternatively, you can create multiple SIM groups to sort your SIMs. For example, you could categorize your SIMs by their purpose (such as SIMs used by specific UE types like cameras or cellphones), or by their on-site location. In this how-to guide, you'll learn how to create, delete, and view SIM groups using the Azure portal.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
- Identify the name of the Mobile Network resource corresponding to your private mobile network.

## View existing SIM groups

You can view your existing SIM groups in the Azure portal.

1. Sign in to the Azure portal at [https://aka.ms/AP5GCPortal](https://aka.ms/AP5GCPortal).
1. Search for and select the **Mobile Network** resource representing the private mobile network to which you want to add a SIM group.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the **Resource** menu, select **SIM groups**.

<!-- needs a screenshot of SIM groups in the resource menu -->

## Create a SIM group

You can create new SIM groups in the Azure portal. As part of creating a SIM group, you'll be given the option of provisioning new SIMs to add to your new SIM group. If you want to provision new SIMs, you'll need to [collect values for your SIMs](collect-required-information-for-private-mobile-network.md#collect-sim-values) before you start.

To create a new SIM group:

1. Navigate to the list of SIM groups in your private mobile network, as described in [View existing SIM groups](#view-existing-sim-groups).
1. Select **Create**.
1. Do the following on the **Basics** configuration tab. <!-- needs a screenshot of the Create SIM group screen -->

   - Enter a name for the new SIM group into the **SIM group name** field.
   - Select your private mobile network from the **Mobile network** drop down menu.

1. Select **Next: SIMs**.
1. On the **SIMs** configuration tab, select your chosen input method by selecting the appropriate option next to **How would you like to input the SIMs information?**. You can then input the information you collected for your SIMs.
 
    - If you select **Upload JSON file**, the **Upload SIM profile configurations** field will appear. Use this field to upload your chosen JSON file.
    - If you select **Add manually**, a new set of fields will appear under **Enter SIM profile configurations**. Fill out the first row of these fields with the correct settings for the first SIM you want to provision. If you've got more SIMs you want to provision, add the settings for each of these SIMs to a new row.
    - If you decided that you don't want to provision any SIMs at this point, select **Add SIMs later**.

1. Select **Review + create**.
1. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation. <!-- needs a screenshot showing config validation -->

    If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once your configuration has been validated, you can select **Create** to create the SIM group. The Azure portal will display the following confirmation screen when the SIM group has been created. <!-- needs a screenshot showing successful deployment -->

1. At this point, your SIMs will not have any assigned SIM policies and so will not be brought into service. If you want to begin using the SIMs, [assign a SIM policy to them](manage-existing-sims.md#assign-sim-policies). If you've configured static IP address allocation for your packet core instance(s), you may also want to [assign static IP addresses](manage-existing-sims.md#assign-static-ip-addresses) to the SIMs you've provisioned.

## Delete a SIM group

Deleting a SIM group removes both the SIM group and all the SIMs it contains. 

1. Navigate to the list of SIM groups in your private mobile network, as described in [View existing SIM groups](#view-existing-sim-groups).
1. Select the SIM group you want to delete.
1. Select **Delete**.
1. Select **Delete** to confirm you want to delete the SIM group.

## Next steps
Learn more about how to manage the SIMs in your SIM groups. 
- [Manage existing SIMs - Azure portal](manage-existing-sims.md)

