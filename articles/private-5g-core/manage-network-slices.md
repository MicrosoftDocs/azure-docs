---
title: Manage network slices - Azure portal
titleSuffix: Azure Private 5G Core Preview
description: With this how-to guide, learn how to manage network slices for Azure Private 5G Core Preview through the Azure portal.  
author: b-branco
ms.author: biancabranco
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 09/29/2022
ms.custom: template-how-to
---

# Manage network slices - Azure portal

*Network slices* allow you to multiplex independent logical networks on the same Azure Private 5G Core deployment. Slices are associated with SIM policies and static IP addresses. You can configure a slice/service type (SST) and slice differentiator (SD) for slices associated with SIMs that will be provisioned on a 5G site. If a SIM is provisioned on a 4G site, the slice associated with its SIM policy must contain an empty SD and a value of 1 for the SST.

In this how-to guide, you'll learn how to view, create, modify, and delete network slices using the Azure portal.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
- Identify the name of the Mobile Network resource corresponding to your private mobile network.

## View existing network slices

You can view your existing network slices in the Azure portal.

1. Sign in to the Azure portal at [https://aka.ms/AP5GCNewPortal](https://aka.ms/AP5GCNewPortal).
1. Search for and select the **Mobile Network** resource representing the private mobile network to which you want to add a slice.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the **Resource** menu, select **Slices** to see a list of existing network slices.

<!-- TODO: add screenshot
    :::image type="content" source="media/manage-network-slices/network-slices-list.png" alt-text="Screenshot of the Azure portal showing a list of network slices. The Slices resource menu option is highlighted." :::
-->

## Collect the required information for a network slice

Collect the values in the following table for the slice you want to provision.

   |Value  |Field name in Azure portal  |
   |---------|---------|
   | The name for the slice. | **Slice name** |
   | The slice/service type (SST) value. This is an integer and indicates the expected services and features for the network slice. Each slice in a network must have a unique SST value. </br></br>You can use the standard values specified in section 5.15.2.2 of [3GPP TS 23.501](https://www.etsi.org/deliver/etsi_ts/123500_123599/123501/17.05.00_60/ts_123501v170500p.pdf). For example: </br></br>1 - eMBB. This is a slice suitable for the handling of 5G enhanced mobile broadband. </br>2 - URLLC. This is a slice suitable for the handling of ultra-reliable low latency communications. </br>3 - MIoT. This is a slice suitable for the handling of massive IoT. </br></br>You can also use a non-standard value. | **Slice Service Type (SST)** |
   | The slice differentiator (SD) value. This setting is optional and can be used to ... <!-- TODO --> | **Slice Differentiator (SD)** |

## Create a network slice

You must [collect the required information for your slice](#collect-the-required-information-for-a-network-slice) before creating it.

1. Navigate to the list of network slices in your private mobile network, as described in [View existing network slices](#view-existing-network-slices).
1. Select **+ Create**.
    <!-- TODO: add screenshot  -->
1. Use the information you collected in [Collect the required information for your slice](#collect-the-required-information-for-a-network-slice) to fill in the fields under ...
1. ...
1. Select **Review + create**.
1. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.
     <!-- TODO: add screenshot of validation page -->
    If the validation fails, you'll see an error message and the Configuration tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the Review + create tab.
1. Once your configuration has been validated, you can select **Create** to create the network slice. The Azure portal will display the following confirmation screen when the slice has been created.
    <!-- TODO: add screenshot -->
1. Select **Go to resource group** and confirm that it contains ...

## Modify a network slice

Refer to [Collect the required information for your slice](#collect-the-required-information-for-a-network-slice) for the slice features you can modify.

1. Navigate to the list of network slices in your private mobile network, as described in [View existing network slices](#view-existing-network-slices).
1. Select the checkbox next to the slice you're interested in and select **Modify the selected slice**.
    <!-- TODO: add screenshot -->
1. Make the required changes and select **Modify**.
    <!-- TODO: add screenshot -->
1. Confirm ...

## Delete a network slice

You can delete network slices through the Azure portal. A slice can't be deleted if it's associated with a SIM policy or a static IP address. If you have a 4G site deployed in your mobile network, you can't delete the slice configured with SST value of 1 and empty SD.

To delete a network slice:

1. Navigate to the list of network slices in your private mobile network, as described in [View existing network slices](#view-existing-network-slices).
1. Select the checkbox next to each slice you want to delete.
1. Select **Delete**.
1. Select **Delete** to confirm you want to delete the slice(s).

## Next steps

Learn more about designing the policy control configuration for your private mobile network.

- [Policy control](policy-control.md)
