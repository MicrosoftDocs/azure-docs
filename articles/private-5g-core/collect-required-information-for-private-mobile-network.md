---
title: Collect information for your private mobile network
titleSuffix: Azure Private 5G Core
description: This how-to guide shows how to collect the information you need to deploy a private mobile network through Azure Private 5G Core.
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 12/31/2021
ms.custom: template-how-to
---

# Collect the required information to deploy a private mobile network

This how-to guide takes you through the process of collecting the information you'll need to deploy a private mobile network through Azure Private 5G Core.

- You can use this information to deploy a private mobile network through the [Azure portal](how-to-guide-deploy-a-private-mobile-network-azure-portal.md).
- Alternatively, you can use the information to quickly deploy a private mobile network with a single site using an [Azure Resource Manager template (ARM template)](deploy-private-mobile-network-with-site-arm-template.md). In this case, you'll also need to [collect information for the site](collect-required-information-for-a-site.md).

## Prerequisites

You must have completed all of the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).

## Collect mobile network resource values

Collect all of the following values for the mobile network resource that will represent your private mobile network.

   |Value  |Field name in Azure portal  |
   |---------|---------|
   |The Azure subscription to use to deploy the mobile network resource. You must use the same subscription for all resources in your private mobile network deployment. You identified this subscription in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).                 |**Project details: Subscription**
   |The Azure resource group to use to deploy the mobile network resource. You should use a new resource group for this resource. It's useful to include the purpose of this resource group in its name for future identification (for example, *contoso-pmn-rg*). </br></br> Note: We recommend that this resource group is also used when [Collecting the required information for a site](collect-required-information-for-a-site.md).              |**Project details: Resource group**|
   |The name for the private mobile network.           |**Instance details: Mobile network name**|
   |The region in which you're deploying the private mobile network. This can be the East US or the West Europe region.                           |**Instance details: Region**|
   |The mobile country code for the private mobile network.     |**Network configuration: Mobile country code (MCC)**|
   |The mobile network code for the private mobile network.     |**Network configuration: Mobile network code (MNC)**|

### Collect the required information for a network slice

Collect all of the following values to provision a network slice in the private mobile network. You'll be able to create additional slices after you deploy the mobile network resource.

   |Value  |Field name in Azure portal  |
   |---------|---------|
   | The name for the slice. | **Slice configuration: Slice name** |
   | The slice/service type (SST) value. This is an integer and indicates the expected services and features for the network slice. </br></br>You can use the standard values specified in section 5.15.2.2 of [3GPP TS 23.501](https://www.etsi.org/deliver/etsi_ts/123500_123599/123501/17.05.00_60/ts_123501v170500p.pdf). For example: </br></br>1 - eMBB. This is a slice suitable for the handling of 5G enhanced mobile broadband. </br>2 - URLLC. This is a slice suitable for the handling of ultra-reliable low latency communications. </br>3 - MIoT. This is a slice suitable for the handling of massive IoT. </br></br>You can also use a non-standard value. | **Slice configuration: Slice Service Type (SST)** |
   | The slice differentiator (SD) value. This optional setting is a string of six hexadecimal digits, and can be used to differentiate between multiple network slices that have the same SST value. | **Slice configuration: Slice Differentiator (SD)** |

## Collect SIM and SIM group values

Each SIM resource represents a physical SIM or eSIM that will be served by the private mobile network. Each SIM must be a member of exactly one SIM group. If you only have a small number of SIMs, you may want to add them all to the same SIM group. Alternatively, you can create multiple SIM groups to sort your SIMs. For example, you could categorize your SIMs by their purpose (such as SIMs used by specific UE types like cameras or cellphones), or by their on-site location.

As part of creating your private mobile network, you can provision one or more SIMs that will use it. If you decide not to provision SIMs at this point, you can do so after deploying your private mobile network using the instructions in [Provision SIMs](provision-sims-azure-portal.md). Likewise, if you need more than one SIM group, you can create additional SIM groups after you've deployed your private mobile network using the instructions in [Manage SIM groups](manage-sim-groups.md).

If you want to provision SIMs as part of deploying your private mobile network:

1. Choose one of the following encryption types for the new SIM group to which all of the SIMs you provision will be added:  
Note that once the SIM group is created, the encryption type cannot be changed.
    - Microsoft-managed keys (MMK) that Microsoft manages internally for [Encryption at rest](../security/fundamentals/encryption-atrest.md).
    - Customer-managed keys (CMK) that you must manually configure.  
    You must create a Key URI in your [Azure Key Vault](../key-vault/index.yml) and a [User-assigned identity](../active-directory/managed-identities-azure-resources/overview.md) with read, wrap, and unwrap access to the key.
         - The key must be configured to have an activation and expiration date and we recommend that you [configure cryptographic key auto-rotation in Azure Key Vault](../key-vault/keys/how-to-configure-key-rotation.md).
         - The SIM group accesses the key via the user-assigned identity.
         - For additional information on configuring CMK for a SIM group, see [Configure customer-managed keys](/azure/cosmos-db/how-to-setup-cmk).

1. Collect each of the values given in the following table for the SIM group you want to provision.

   |Value  |Field name in Azure portal  |
   |---------|---------|
   |The name for the SIM group resource. The name must only contain alphanumeric characters, dashes, and underscores. |**SIM group name**|
   |The region that the SIM group belongs to.|**Region**|
   |The chosen encryption type for the SIM group. Microsoft-managed keys (MMK) by default, or customer-managed keys (CMK).|**Encryption Type**|
   |The Azure Key Vault URI containing the customer-managed Key for the SIM group.|**Key URI**|
   |The User-assigned identity for accessing the SIM group's customer-managed Key within the Azure Key Vault.|**User-assigned identity**|

1. Choose one of the following methods for provisioning your SIMs:

   - Manually entering values for each SIM into fields in the Azure portal. This option is best when provisioning a few SIMs.
   - Importing a JSON file containing values for one or more SIM resources. This option is best when provisioning a large number of SIMs. The file format required for this JSON file is given in [JSON file format for provisioning SIMs](#json-file-format-for-provisioning-sims). You'll need to use this option if you're deploying your private mobile network with an ARM template.
   - Importing an encrypted JSON file, provided by your SIM vendor, containing values for one or more SIM resources. You'll need to use this option if you're deploying your private mobile network with a JSON file provided by one of our SIM vendor partners. See [Collecting information for provisioning SIM vendor provided SIMs](#collecting-information-for-provisioning-sim-vendor-provided-sims) rather than collecting the values the next step.

1. Collect each of the values given in the following table for each SIM resource you want to provision.

   |Value  |Field name in Azure portal  | JSON file parameter name |
   |---------|---------|---------|
   |The name for the SIM resource. The name must only contain alphanumeric characters, dashes, and underscores. |**SIM name**|`simName`|
   |The Integrated Circuit Card Identification Number (ICCID). The ICCID identifies a specific physical SIM or eSIM, and includes information on the SIM's country and issuer. It's a unique numerical value between 19 and 20 digits in length, beginning with 89. |**ICCID**|`integratedCircuitCardIdentifier`|
   |The international mobile subscriber identity (IMSI). The IMSI is a unique number (usually 15 digits) identifying a device or user in a mobile network. |**IMSI**|`internationalMobileSubscriberIdentity`|
   |The Authentication Key (Ki). The Ki is a unique 128-bit value assigned to the SIM by an operator, and is used with the derived operator code (OPc) to authenticate a user. The Ki must be a 32-character string, containing hexadecimal characters only. |**Ki**|`authenticationKey`|
   |The derived operator code (OPc). The OPc is derived from the SIM's Ki and the network's operator code (OP), and is used by the packet core to authenticate a user using a standards-based algorithm. The OPc must be a 32-character string, containing hexadecimal characters only. |**Opc**|`operatorKeyCode`|
   |The type of device that is using this SIM. This value is an optional, free-form string. You can use it as required to easily identify device types that are using the enterprise's mobile networks. |**Device type**|`deviceType`|

### JSON file format for provisioning SIMs

The following example shows the file format you'll need if you want to provision your SIM resources using a JSON file. It contains the parameters required to provision two SIMs (SIM1 and SIM2).

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
  "integratedCircuitCardIdentifier": "8922345678901234567",
  "internationalMobileSubscriberIdentity": "001019990010002",
  "authenticationKey": "11112233445566778899AABBCCDDEEFF",
  "operatorKeyCode": "63bfa50ee6523365ff14c1f45f88738d",
  "deviceType": "Sensor"
 }
]
```

## Collecting information for provisioning SIM vendor provided SIMs

Collect and edit each of the values in the following table for each SIM resource you want to provision using an encrypted JSON file, provided by your SIM vendor.

|Value  | JSON file parameter name |
|---------|---------|
|The name for the SIM resource. The name must only contain alphanumeric characters, dashes, and underscores.|`name`|
|The type of device that is using this SIM. This value is an optional, free-form string. You can use it as required to easily identify device types that are using the enterprise's mobile networks.|`deviceType`|
|The SIM policy ID to apply to the SIM. See [Decide whether you want to use the default service and SIM policy](#decide-whether-you-want-to-use-the-default-service-and-sim-policy).|`simPolicy`|
|The static IP configuration values for the SIM: **attachedDataNetwork**, **slice**, and **staticIp**.|`staticIpConfigurations`|

### Encrypted JSON file format for provisioning vendor provided SIMs

The following example shows the file format to provision your SIM resources using a SIM vendor provided encrypted JSON file.

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
  ]  
}  
```

## Decide whether you want to use the default service and SIM policy

 Azure Private 5G Core offers a default service and SIM policy that allow all traffic in both directions for all the SIMs you provision. They're designed to allow you to quickly deploy a private mobile network and bring SIMs into service automatically, without the need to design your own policy control configuration.

- If you're using the ARM template in [Quickstart: Deploy a private mobile network and site - ARM template](deploy-private-mobile-network-with-site-arm-template.md), the default service and SIM policy are automatically included.

- If you use the Azure portal to deploy your private mobile network, you'll be given the option of creating the default service and SIM policy. You'll need to decide whether the default service and SIM policy are suitable for the initial use of your private mobile network. You can find information on each of the specific settings for these resources in [Default service and SIM policy](default-service-sim-policy.md) if you need it. If you choose this option, you will also need to provide the name of the data network that will be used by the default policy.

- If they aren't suitable, you can choose to deploy the private mobile network without any services or SIM policies. In this case, any SIMs you provision won't be brought into service when you create your private mobile network. You'll need to create your own services and SIM policies later.  

For detailed information on services and SIM policies, see [Policy control](policy-control.md).

## Next steps

You can now use the information you've collected to deploy your private mobile network.

- [Deploy a private mobile network - Azure portal](how-to-guide-deploy-a-private-mobile-network-azure-portal.md)
- [Quickstart: Deploy a private mobile network and site - ARM template](deploy-private-mobile-network-with-site-arm-template.md)