---
title: Provision SIMs using Azure portal
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, learn how to provision new SIMs for an existing private mobile network using the Azure portal. 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/16/2022
ms.custom: template-how-to
---

# Provision SIMs for Azure Private 5G Core Preview - Azure portal

*SIM* resources represent physical SIMs or eSIMs used by user equipment (UEs) served by the private mobile network. In this how-to guide, we'll provision new SIMs for an existing private mobile network. You can also choose to assign static IP addresses and a SIM policy to the SIMs you provision. 

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
- Identify the name of the Mobile Network resource corresponding to your private mobile network.
- Decide on the method you'll use to provision SIMs. You can choose from the following:
  - Manually entering each provisioning value into fields in the Azure portal. This option is best if you're provisioning a few SIMs.
  - Importing a JSON file containing values for one or more SIM resources. This option is best if you're provisioning a large number of SIMs. You'll need a good JSON editor if you want to use this option.
- For each SIM you want to provision, decide whether you want to assign a SIM policy to it. If you do, you must have already created the relevant SIM policies using the instructions in [Configure a SIM policy - Azure portal](configure-sim-policy-azure-portal.md). SIMs can't access your private mobile network unless they have an assigned SIM policy.
- If you've configured static IP address allocation for your packet core instance(s), decide whether you want to assign a static IP address to any of the SIMs you're provisioning. If you have multiple sites in your private mobile network, you can assign a different static IP address for each site to the same SIM. 

    Each IP address must come from the pool you assigned for static IP address allocation when creating the relevant site, as described in [Collect data network values](collect-required-information-for-a-site.md#collect-data-network-values). For more information, see [Allocate User Equipment (UE) IP address pools](complete-private-mobile-network-prerequisites.md#allocate-user-equipment-ue-ip-address-pools). 

    If you're assigning a static IP address to a SIM, you'll also need the following information.

    - The SIM policy to assign to the SIM. You won't be able to set a static IP address for a SIM without also assigning a SIM policy.
    - The name of the data network the SIM will use.
    - The site at which the SIM will use this static IP address.

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

## Create the JSON file

Only carry out this step if you decided in [Prerequisites](#prerequisites) to use a JSON file to provision your SIMs. Otherwise, you can skip to [Begin provisioning the SIMs in the Azure portal](#begin-provisioning-the-sims-in-the-azure-portal).

Prepare the JSON file using the information you collected for your SIMs in [Collect the required information for your SIMs](#collect-the-required-information-for-your-sims). This example file shows the required format. It contains the parameters required to provision two SIMs (`SIM1` and `SIM2`).

```json
[
 {
  "simName": "SIM1",
  "integratedCircuitCardIdentifier": "8912345678901234566",
  "internationalMobileSubscriberIdentity": "001019990010001",
  "authenticationKey": "00112233445566778899AABBCCDDEEFF",
  "operatorKeyCode": "63bfa50ee6523365ff14c1f45f88737d",
  "deviceType": "Cellphone"
 },
 {
  "simName": "SIM2",
  "simProfileName": "profile2",
  "integratedCircuitCardIdentifier": "8922345678901234567",
  "internationalMobileSubscriberIdentity": "001019990010002",
  "authenticationKey": "11112233445566778899AABBCCDDEEFF",
  "operatorKeyCode": "63bfa50ee6523365ff14c1f45f88738d",
  "deviceType": "Sensor"
 }
]
```

## Begin provisioning the SIMs in the Azure portal

You'll now begin the SIM provisioning process through the Azure portal.

1. Sign in to the Azure portal at [https://aka.ms/AP5GCPortal](https://aka.ms/AP5GCPortal).
1. Search for and select the **Mobile Network** resource representing the private mobile network for which you want to provision SIMs.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. Select **Add SIMs**.

    :::image type="content" source="media/provision-sims-azure-portal/add-sims.png" alt-text="Screenshot of the Azure portal showing the Add SIMs button on a Mobile Network resource":::

1. Select **Create** and then select your chosen provisioning method from the options that appear.

    :::image type="content" source="media/provision-sims-azure-portal/create-new-sim.png" alt-text="Screenshot of the Azure portal showing the Create button and its options - Upload J S O N from file and Add manually.":::

    - If you selected **Add manually**, move to [Manually provision a SIM](#manually-provision-a-sim).
    - If you selected **Upload JSON from file**, move to [Provision SIMs using a JSON file](#provision-sims-using-a-json-file).

## Manually provision a SIM

In this step, you'll enter provisioning values for your SIMs directly into the Azure portal.

1. In **Add SIMs** on the right, use the information you collected in [Collect the required information for your SIMs](#collect-the-required-information-for-your-sims) to fill out the fields for one of the SIMs you want to provision.
1. Select **Add**.
1. The Azure portal will now begin deploying the SIM. When the deployment is complete, select **Go to resource**.

    :::image type="content" source="media/provision-sims-azure-portal/sim-resource-deployment.png" alt-text="Screenshot of the Azure portal showing a completed deployment of a SIM resource and the Go to resource button.":::

1. You'll now see details of your new SIM resource.

    :::image type="content" source="media/provision-sims-azure-portal/new-sim-resource.png" alt-text="Screenshot of the Azure portal showing the configuration a new SIM resource." lightbox="media/provision-sims-azure-portal/new-sim-resource.png":::

1. Repeat this entire step for any other SIMs that you want to provision.

## Provision SIMs using a JSON file

In this step, you'll provision SIMs using a JSON file.

1. In **Add SIMs** on the right, select **Browse** and then select the JSON file you created in [Create the JSON file](#create-the-json-file).
1. Select **Add**. If the **Add** button is greyed out, check your JSON file to confirm that it's correctly formatted.
1. The Azure portal will now begin deploying the SIMs. When the deployment is complete, select **Go to resource group**.

    :::image type="content" source="media/provision-sims-azure-portal/multiple-sim-resource-deployment.png" alt-text="Screenshot of the Azure portal. It shows a completed deployment of SIM resources through a J S O N file and the Go to resource group button.":::

1. The Azure portal will display the resource group containing your private mobile network. Select the **Mobile Network** resource.
1. In the resource menu, select **SIMs**.
1. Check the list of SIMs to ensure your new SIMs are present and provisioned correctly. 

    :::image type="content" source="media/provision-sims-azure-portal/sims-list.png" alt-text="Screenshot of the Azure portal. It shows a list of currently provisioned SIMs for a private mobile network." lightbox="media/provision-sims-azure-portal/sims-list.png":::

## Assign static IP addresses

In this step, you'll assign static IP addresses to your SIMs. You can skip this step if you don't want to assign any static IP addresses.

1. Search for and select the **Mobile Network** resource representing the private mobile network containing your SIMs.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the resource menu, select **SIMs**.
1. You'll see a list of provisioned SIMs in the private mobile network. Select each SIM to which you want to assign a static IP address, and then select **Assign Static IPs**.

    :::image type="content" source="media/provision-sims-azure-portal/assign-static-ips.png" alt-text="Screenshot of the Azure portal showing a list of provisioned SIMs. Selected SIMs and the Assign Static I Ps button are highlighted.":::

1. In **Assign static IP configurations** on the right, run the following steps for each SIM in turn. If your private mobile network has multiple sites and you want to assign a different static IP address for each site to the same SIM, you'll need to repeat these steps on the same SIM for each IP address.

    1. Set **SIM name** your chosen SIM.
    1. Set **SIM policy** to the SIM policy you want to assign to this SIM.
    1. Set **Slice** to **slice-1**. 
    1. Set **Data network name** to the name of the data network this SIM will use.
    1. Set **Site** to the site at which the SIM will use this static IP address.
    1. Set **Static IP** to your chosen IP address.
    1. Select **Save static IP configuration**. The SIM will then appear in the list under **Number of pending changes**.

    :::image type="content" source="media/provision-sims-azure-portal/assign-static-ip-configurations.png" alt-text="Screenshot of the Azure portal showing the Assign static I P configurations screen.":::

1. Once you have assigned static IP addresses to all of your chosen SIMs, select **Assign static IP configurations**.
1. The Azure portal will now begin deploying the configuration change. When the deployment is complete, select **Go to resource** (if you have assigned a static IP address to a single SIM) or **Go to resource group** (if you have assigned static IP addresses to multiple SIMs).

    - If you assigned a static IP address to a single SIM, you'll be taken to that SIM resource. Check the **SIM policy** field in the **Management** section and the list under the **Static IP Configuration** section to confirm that the correct SIM policy and static IP address have been assigned successfully.
    - If you assigned a SIM policy to multiple SIMs, you'll be taken to the resource group containing your private mobile network. Select the **Mobile Network** resource, and then select **SIMs** in the resource menu. Check the **SIM policy** column in the SIMs list to confirm the correct SIM policy has been assigned to your chosen SIMs. You can then select an individual SIM and check the **Static IP Configuration** section to confirm that the correct static IP address has been assigned to that SIM.

## Assign SIM policies

In this step, you'll assign SIM policies to your SIMs. SIMs need an assigned SIM policy before they can use your private mobile network. You can skip this step and come back to it later if you don't want the SIMs to be able to access the private mobile network straight away. You can also skip this step for any SIMs to which you've assigned a static IP address, as these SIMs will already have an assigned SIM policy.

1. Search for and select the **Mobile Network** resource representing the private mobile network containing your SIMs.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the resource menu, select **SIMs**.
1. You'll see a list of provisioned SIMs in the private mobile network. For each SIM policy you want to assign to one or more SIMs, do the following:

    1. Tick the checkbox next to the name of each SIM to which you want to assign the SIM policy.
    1. Select **Assign SIM policy**.
    1. In **Assign SIM policy** on the right, select your chosen SIM policy from the **SIM policy** drop-down menu.
    1. Select **Assign SIM policy**.
    
        :::image type="content" source="media/provision-sims-azure-portal/assign-sim-policy.png" alt-text="Screenshot of the Azure portal. It shows a list of provisioned SIMs and fields to assign a SIM policy." lightbox="media/provision-sims-azure-portal/assign-sim-policy.png":::

1. The Azure portal will now begin deploying the configuration change. When the deployment is complete, select **Go to resource** (if you have assigned a SIM policy to a single SIM) or **Go to resource group** (if you have assigned a SIM policy to multiple SIMs).

    - If you assigned a SIM policy to a single SIM, you'll be taken to that SIM resource. Check the **SIM policy** field in the **Management** section to confirm that the correct SIM policy has been assigned successfully.
    - If you assigned a SIM policy to multiple SIMs, you'll be taken to the resource group containing your private mobile network. Select the **Mobile Network** resource, and then select **SIMs** in the resource menu. Check the **SIM policy** column in the SIMs list to confirm the correct SIM policy has been assigned to your chosen SIMs.

1. Repeat this step for any other SIM policies you want to assign to SIMs.

## Next steps

- [Learn more about policy control](policy-control.md)
