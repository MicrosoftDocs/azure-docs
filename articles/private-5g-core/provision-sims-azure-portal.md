---
title: Provision new SIMs - Azure portal
titleSuffix: Azure Private 5G Core
description: In this how-to guide, learn how to provision new SIMs for an existing private mobile network using the Azure portal. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/16/2022
ms.custom: template-how-to
zone_pivot_groups: ap5gc-portal-powershell
---

# Provision new SIMs for Azure Private 5G Core - Azure portal

*SIM* resources represent physical SIMs or eSIMs used by user equipment (UEs) served by the private mobile network. In this how-to guide, we'll provision new SIMs for an existing private mobile network.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.

- Identify the name of the Mobile Network resource corresponding to your private mobile network.

- Decide on the method you'll use to provision SIMs. You can choose from the following:

  - Manually entering each provisioning value into fields in the Azure portal. This option is best if you're provisioning a few SIMs.

  - Importing one or more JSON files containing values for up to 500 SIM resources each. This option is best if you're provisioning a large number of SIMs. You'll need a good JSON editor if you want to use this option.
  
  - Importing an encrypted JSON file containing values for one or more vendor provided SIM resources. This option is required for any vendor provided SIMs. You'll need a good JSON editor if you want to edit any fields within the encrypted JSON file when using this option.

- Decide on the SIM group to which you want to add your SIMs. You can create a new SIM group when provisioning your SIMs, or you can choose an existing SIM group. See [Manage SIM groups - Azure portal](manage-sim-groups.md) for information on viewing your existing SIM groups.

  - If you're manually entering provisioning values, you'll add each SIM to a SIM group individually.

  - If you're using one or more JSON or encrypted JSON files, all SIMs in the same JSON file will be added to the same SIM group.

- For each SIM you want to provision, decide whether you want to assign a SIM policy to it. If you do, you must have already created the relevant SIM policies using the instructions in [Configure a SIM policy - Azure portal](configure-sim-policy-azure-portal.md). SIMs can't access your private mobile network unless they have an assigned SIM policy.

  - If you're manually entering provisioning values, you'll need the name of the SIM policy.

  - If you're using one or more JSON or encrypted JSON files, you'll need the full resource ID of the SIM policy. You can collect this by navigating to the SIM Policy resource, selecting **JSON View** and copying the contents of the **Resource ID** field.

## Collect the required information for your SIMs

To begin, collect the values in the following table for each SIM you want to provision.

| Value | Field name in Azure portal | JSON file parameter name |
|--|--|--|
| SIM name. The SIM name must only contain alphanumeric characters, dashes, and underscores. | **SIM name** | `simName` |
| The Integrated Circuit Card Identification Number (ICCID). The ICCID identifies a specific physical SIM or eSIM, and includes information on the SIM's country/region and issuer. The ICCID is a unique numerical value between 19 and 20 digits in length, beginning with 89. | **ICCID** | `integratedCircuitCardIdentifier` |
| The international mobile subscriber identity (IMSI). The IMSI is a unique number (usually 15 digits) identifying a device or user in a mobile network. | **IMSI** | `internationalMobileSubscriberIdentity` |
| The Authentication Key (Ki). The Ki is a unique 128-bit value assigned to the SIM by an operator, and is used with the derived operator code (OPc) to authenticate a user. It must be a 32-character string, containing hexadecimal characters only. | **Ki** | `authenticationKey` |
| The derived operator code (OPc). The OPc is taken from the SIM's Ki and the network's operator code (OP). The packet core instance uses it to authenticate a user using a standards-based algorithm. The OPc must be a 32-character string, containing hexadecimal characters only. | **Opc** | `operatorKeyCode` |
| The type of device using this SIM. This value is an optional free-form string. You can use it as required to easily identify device types using the enterprise's private mobile network. | **Device type** | `deviceType` |
| The SIM policy to assign to the SIM. This is optional, but your SIMs won't be able to use the private mobile network without an assigned SIM policy. | **SIM policy** | `simPolicyId` |

### Collect the required information for assigning static IP addresses

You only need to complete this step if all of the following apply:

- You're using one or more JSON files to provision your SIMs.
- You've configured static IP address allocation for your packet core instance(s).
- You want to assign static IP addresses to the SIMs during SIM provisioning.

Collect the values in the following table for each SIM you want to provision. If your private mobile network has multiple data networks and you want to assign a different static IP address for each data network to this SIM, collect the values for each IP address.

Each IP address must come from the pool you assigned for static IP address allocation when creating the relevant data network, as described in [Collect data network values](collect-required-information-for-a-site.md#collect-data-network-values). For more information, see [Allocate User Equipment (UE) IP address pools](complete-private-mobile-network-prerequisites.md#allocate-user-equipment-ue-ip-address-pools).

| Value | Field name in Azure portal | JSON file parameter name |
|--|--|--|
| The data network that the SIM will use. | Not applicable. | `staticIpConfiguration.attachedDataNetworkId` |
| The network slice that the SIM will use. | Not applicable. | `staticIpConfiguration.sliceId` |
| The static IP address to assign to the SIM.  | Not applicable. | `staticIpConfiguration.staticIpAddress` |

## Create or edit JSON files

Only carry out this step if you decided in [Prerequisites](#prerequisites) to use JSON files or an encrypted JSON file provided by a SIM vendor to provision your SIMs. Otherwise, you can skip to [Begin provisioning the SIMs in the Azure portal](#begin-provisioning-the-sims-in-the-azure-portal).

Prepare the files using the information you collected for your SIMs in [Collect the required information for your SIMs](#collect-the-required-information-for-your-sims). The example file below shows the required format. It contains the parameters required to provision two SIMs (`SIM1` and `SIM2`).

> [!IMPORTANT]
> Bulk SIM provisioning is limited to 500 SIMs. If you want to provision more that 500 SIMs, you must create multiple JSON files with no more than 500 SIMs in any one file and repeat the provisioning process for each JSON file.

- If you are creating a JSON file, use the following example. It contains the parameters required to provision two SIMs (`SIM1` and `SIM2`). If you don't want to assign a SIM policy to a SIM, you can delete the `simPolicyId` parameter for that SIM.

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

- If you are editing an encrypted JSON file provided by a SIM vendor, use the following example. It contains the parameters required to provision two SIMs (`SIM1` and `SIM2`). 
  - If you don't want to assign a SIM policy to a SIM, you can delete the `simPolicyId` parameter for that SIM.

    ```json
    {  
      "version": 1,  
      "azureKey": 1,  
      "vendorKeyFingerprint": "A5719BCEFD6A2021A11D7649942ECC14", 
      "encryptedTransportKey": "0EBAE5E2D31A1BE48495F6DCA65983EEAE6BA6B75A92040562EAD84079BF701CBD3BB1602DB74E85921184820B78A02EC709951195DC87E44481FDB6B826DF775E29B7073644EA66649A14B6CA6B0EE75DE8B4A8D0D5186319E37FBF165A691E607CFF8B65F3E5E9D448049704DE4EA047101ADA4554A543F405B447B8DB687C0B7624E62515445F3E887B3328AA555540D9959752C985490586EF06681501A89594E28F98BF66F179FE3F1D2EE13C69BC42C30A8D3DC6898B8160FC66CDDEE164760F27B68A07BA4C4AE5AFFEA45EE8342E1CA8470150ED6AF4215CEF173418E60E2B1DF4A8C2AE6F0C9A291F5D185ECAD0D94D48EFD06570A0C1AE27D5EC20",  
      "signedTransportKey": "83515CC47C8890F62D4A0D16DE58C2F2DCFD827C317047693A46B9CA1F9EBC33CCDB8CABE04A275D65E180813CCFF43FC2DA95E19E2B9FF2588AE0914418DC9CB5506EB7AEADB272F5DAB9F0B1CCFAD62B95C91D4F4680A350F56D2A7F8EC863F4D61E1D7A38746AEE6C6391D619CCFCFA2B6D554671D91A26484CD6E120D84917FBF69D3B56B2AA8F2B36AF88492F1A7E267594B6C1596B81A81079540EC3F31869294BFEB225DFB171DE557B8C05D7C963E047E3AF36D1387FEDA28E55E411E5FB6AED178FB9C92D674D71AF8FEB6462F509E6423D4EBE0EC84E4135AA6C7A36F849A14A6A70E7188E08278D515BD95A549645E9D595D1DEC13E1A68B9CB67",  
      "sims": [  
        {  
          "name": "SIM 1",  
          "properties": {  
            "deviceType": "Sensor",  
           "integratedCircuitCardIdentifier": "8922345678901234567",  
            "internationalMobileSubscriberIdentity": "001019990010002",  
            "encryptedCredentials": "3ED205BE2DD7F0E467283EC55F9E8F3588B68DC98811BE671070C65EFDE0CCCAD18C8B663231C80FB478F753A6B09142D06982421261679B7BB112D36473EA7EF973DCF7F634124B58DD945FE61D4B16978438CB33E64D3AA58B5C38A0D97030B5F95B16E308D919EB932ACCD36CB8C2838C497B3B38A60E3DD385",  
            "simPolicy": {  
              "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.MobileNetwork/mobileNetworks/testMobileNetwork/simPolicies/MySimPolicy"  
            },  
            "staticIpConfiguration": [
                    {
                        "attachedDataNetwork": {
                            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.MobileNetwork/packetCoreControlPlanes/TestPacketCoreCP/packetCoreDataPlanes/TestPacketCoreDP/attachedDataNetworks/TestAttachedDataNetwork"
                        },
                        "slice": {
                            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.MobileNetwork/mobileNetworks/testMobileNetwork/slices/testSlice"
                        },
                        "staticIp": {
                            "ipv4Address": "2.4.0.1"
                        } 
              }  
            ]  
          }  
        }
        {  
          "name": "SIM 2",  
          "properties": {  
            "deviceType": "Cellphone",  
           "integratedCircuitCardIdentifier": "1234545678907456123",  
            "internationalMobileSubscriberIdentity": "001019990010003",  
            "encryptedCredentials": "3ED205BE2DD7F0E467283EC55F9E8F3588B68DC98811BE671070C65EFDE0CCCAD18C8B663231C80FB478F753A6B09142D06982421261679B7BB112D36473EA7EF973DCF7F634124B58DD945FE61D4B16978438CB33E64D3AA58B5C38A0D97030B5F95B16E308D919EB932ACCD36CB8C2838C497B3B38A60E3DD385",  
            "simPolicy": {  
              "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.MobileNetwork/mobileNetworks/testMobileNetwork/simPolicies/MySimPolicy"  
            },  
            "staticIpConfiguration": [
                    {
                        "attachedDataNetwork": {
                            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.MobileNetwork/packetCoreControlPlanes/TestPacketCoreCP/packetCoreDataPlanes/TestPacketCoreDP/attachedDataNetworks/TestAttachedDataNetwork"
                        },
                        "slice": {
                            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.MobileNetwork/mobileNetworks/testMobileNetwork/slices/testSlice"
                        },
                        "staticIp": {
                            "ipv4Address": "2.4.0.2"
                        } 
              }  
            ]  
          }  
        }  
      ]  
    }  
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

1. In **Add SIMs** on the right, select **Browse** and then select one of the JSON files you created or edited in [Create or edit JSON files](#create-or-edit-json-files).  
:::image type="content" source="media/provision-sims-azure-portal/add-sims-json.png" alt-text="Screenshot of the Add SIMs view. It shows Encrypted has been selected as the file type, a JSON file has been uploaded and SIMGroup1 has been selected as the SIM group name." lightbox="media/provision-sims-azure-portal/add-sims-json.png":::
1. Set the **SIM group** field to an existing SIM group, or select **Create new** to create a new one.
1. Select **Add**. If the **Add** button is greyed out, check your JSON file to confirm that it's correctly formatted.
1. The Azure portal will now begin deploying the SIMs. When the deployment is complete, select **Go to resource group**.

    :::image type="content" source="media/provision-sims-azure-portal/multiple-sim-resource-deployment.png" alt-text="Screenshot of the Azure portal. It shows a completed deployment of SIM resources through a J S O N file and the Go to resource group button.":::

1. Select the **SIM Group** resource to which you added your SIMs.
1. Check the list of SIMs to ensure your new SIMs are present and provisioned correctly.

    :::image type="content" source="media/provision-sims-azure-portal/sims-list.png" alt-text="Screenshot of the Azure portal. It shows a list of currently provisioned SIMs for a private mobile network." lightbox="media/provision-sims-azure-portal/sims-list.png":::

1. If you are provisioning more than 500 SIMs, repeat this process for each JSON file.

## Next steps

If you've configured static IP address allocation for your packet core instance(s) and you haven't already assigned static IP addresses to the SIMs you've provisioned, you can do so by following the steps in [Assign static IP addresses](manage-existing-sims.md#assign-static-ip-addresses).
