---
title: Provision new SIMs - Azure portal
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, learn how to provision new SIMs for an existing private mobile network using the Azure portal. 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/16/2022
ms.custom: template-how-to
---

# Provision new SIMs for Azure Private 5G Core Preview - Azure portal

*SIM* resources represent physical SIMs or eSIMs used by user equipment (UEs) served by the private mobile network. In this how-to guide, we'll provision new SIMs for an existing private mobile network.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.

- Identify the name of the Mobile Network resource corresponding to your private mobile network.

- Decide on the method you'll use to provision SIMs. You can choose from the following:

  - Manually entering each provisioning value into fields in the Azure portal. This option is best if you're provisioning a few SIMs.

  - Importing a JSON file containing values for one or more SIM resources. This option is best if you're provisioning a large number of SIMs. You'll need a good JSON editor if you want to use this option.

- Decide on the SIM group to which you want to add your SIMs. You can create a new SIM group when provisioning your SIMs, or you can choose an existing SIM group. See [Manage SIM groups - Azure portal](manage-sim-groups.md) for information on viewing your existing SIM groups.

  - If you're manually entering provisioning values, you'll add each SIM to a SIM group individually.

  - If you're using a JSON file, all SIMs in the same JSON file will be added to the same SIM group.

- For each SIM you want to provision, decide whether you want to assign a SIM policy to it. If you do, you must have already created the relevant SIM policies using the instructions in [Configure a SIM policy - Azure portal](configure-sim-policy-azure-portal.md). SIMs can't access your private mobile network unless they have an assigned SIM policy.

  - If you're manually entering provisioning values, you'll need the name of the SIM policy.

  - If you're using a JSON file, you'll need the full resource ID of the SIM policy. You can collect this by navigating to the SIM Policy resource, selecting **JSON View** and copying the contents of the **Resource ID** field.

## Collect the required information for your SIMs

To begin, collect the values in the following table for each SIM you want to provision.

| Value | Field name in Azure portal | JSON file parameter name |
|--|--|--|
| SIM name. The SIM name must only contain alphanumeric characters, dashes, and underscores. | **SIM name** | `simName` |
| The Integrated Circuit Card Identification Number (ICCID). The ICCID identifies a specific physical SIM or eSIM, and includes information on the SIM's country and issuer. The ICCID is a unique numerical value between 19 and 20 digits in length, beginning with 89. | **ICCID** | `integratedCircuitCardIdentifier` |
| The international mobile subscriber identity (IMSI). The IMSI is a unique number (usually 15 digits) identifying a device or user in a mobile network. | **IMSI** | `internationalMobileSubscriberIdentity` |
| The Authentication Key (Ki). The Ki is a unique 128-bit value assigned to the SIM by an operator, and is used with the derived operator code (OPc) to authenticate a user. It must be a 32-character string, containing hexadecimal characters only. | **Ki** | `authenticationKey` |
| The derived operator code (OPc). The OPc is taken from the SIM's Ki and the network's operator code (OP). The packet core instance uses it to authenticate a user using a standards-based algorithm. The OPc must be a 32-character string, containing hexadecimal characters only. | **Opc** | `operatorKeyCode` |
| The type of device using this SIM. This value is an optional free-form string. You can use it as required to easily identify device types using the enterprise's private mobile network. | **Device type** | `deviceType` |
| The SIM policy to assign to the SIM. This is optional, but your SIMs won't be able to use the private mobile network without an assigned SIM policy. | **SIM policy** | `simPolicyId` |

## Create the JSON file

Only carry out this step if you decided in [Prerequisites](#prerequisites) to use a JSON file to provision your SIMs. Otherwise, you can skip to [Begin provisioning the SIMs in the Azure portal](#begin-provisioning-the-sims-in-the-azure-portal).

Prepare the JSON file using the information you collected for your SIMs in [Collect the required information for your SIMs](#collect-the-required-information-for-your-sims). This example file shows the required format. It contains the parameters required to provision two SIMs (`SIM1` and `SIM2`). If you don't want to assign a SIM policy to a SIM, you can delete the `simPolicyId` parameter for that SIM.

```json
[
 {
  "simName": "SIM1",
  "integratedCircuitCardIdentifier": "8912345678901234566",
  "internationalMobileSubscriberIdentity": "001019990010001",
  "authenticationKey": "00112233445566778899AABBCCDDEEFF",
  "operatorKeyCode": "63bfa50ee6523365ff14c1f45f88737d",
  "deviceType": "Cellphone",
  "simPolicyId": "/subscriptions/subid/resourceGroups/contoso-rg/providers/Microsoft.MobileNetwork/mobileNetworks/contoso-network/simPolicies/SimPolicy1"
 },
 {
  "simName": "SIM2",
  "integratedCircuitCardIdentifier": "8922345678901234567",
  "internationalMobileSubscriberIdentity": "001019990010002",
  "authenticationKey": "11112233445566778899AABBCCDDEEFF",
  "operatorKeyCode": "63bfa50ee6523365ff14c1f45f88738d",
  "deviceType": "Sensor",
  "simPolicyId": "/subscriptions/subid/resourceGroups/contoso-rg/providers/Microsoft.MobileNetwork/mobileNetworks/contoso-network/simPolicies/SimPolicy2"
 }
]
```

## Begin provisioning the SIMs in the Azure portal

You'll now begin the SIM provisioning process through the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network for which you want to provision SIMs.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. Select **Manage SIMs**.

    :::image type="content" source="media/provision-sims-azure-portal/view-sims.png" alt-text="Screenshot of the Azure portal showing the View SIMs button on a Mobile Network resource.":::

1. Select **Create** and then select your chosen provisioning method from the options that appear.

    :::image type="content" source="media/provision-sims-azure-portal/create-new-sim.png" alt-text="Screenshot of the Azure portal showing the Create button and its options - Upload J S O N from file and Add manually.":::

    - If you selected **Add manually**, move to [Manually provision a SIM](#manually-provision-a-sim).
    - If you selected **Upload JSON from file**, move to [Provision SIMs using a JSON file](#provision-sims-using-a-json-file).

## Manually provision a SIM

In this step, you'll enter provisioning values for your SIMs directly into the Azure portal.

1. In **Add SIMs** on the right, use the information you collected in [Collect the required information for your SIMs](#collect-the-required-information-for-your-sims) to fill out the fields for one of the SIMs you want to provision. You can set **SIM policy** to **None** if you don't want to assign a SIM policy to the SIM at this point.
1. Set the **SIM group** field to an existing SIM group, or select **Create new** to create a new one. 
1. Select **Add**.
1. The Azure portal will now begin deploying the SIM. When the deployment is complete, select **Go to resource**.

    :::image type="content" source="media/provision-sims-azure-portal/sim-resource-deployment.png" alt-text="Screenshot of the Azure portal showing a completed deployment of a SIM resource and the Go to resource button.":::

1. You'll now see details of your new SIM resource.

    :::image type="content" source="media/provision-sims-azure-portal/new-sim-resource.png" alt-text="Screenshot of the Azure portal showing the configuration a new SIM resource." lightbox="media/provision-sims-azure-portal/new-sim-resource.png":::

1. Repeat this entire step for any other SIMs that you want to provision.

## Provision SIMs using a JSON file

In this step, you'll provision SIMs using a JSON file.

1. In **Add SIMs** on the right, select **Browse** and then select the JSON file you created in [Create the JSON file](#create-the-json-file).
1. Set the **SIM group** field to an existing SIM group, or select **Create new** to create a new one. 
1. Select **Add**. If the **Add** button is greyed out, check your JSON file to confirm that it's correctly formatted.
1. The Azure portal will now begin deploying the SIMs. When the deployment is complete, select **Go to resource group**.

    :::image type="content" source="media/provision-sims-azure-portal/multiple-sim-resource-deployment.png" alt-text="Screenshot of the Azure portal. It shows a completed deployment of SIM resources through a J S O N file and the Go to resource group button.":::

1. Select the **SIM Group** resource to which you added your SIMs.
1. Check the list of SIMs to ensure your new SIMs are present and provisioned correctly. 

    :::image type="content" source="media/provision-sims-azure-portal/sims-list.png" alt-text="Screenshot of the Azure portal. It shows a list of currently provisioned SIMs for a private mobile network." lightbox="media/provision-sims-azure-portal/sims-list.png":::

## Next steps

If you've configured static IP address allocation for your packet core instance(s), you may want to [assign static IP addresses to the SIMs you've provisioned](manage-existing-sims.md#assign-static-ip-addresses).
