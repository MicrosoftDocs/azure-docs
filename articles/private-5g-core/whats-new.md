---
title: What's new in Azure Private 5G Core?
description: Discover what's new in Azure Private 5G Core
author: b-branco
ms.author: biancabranco
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 10/24/2022
---

# What's new in Azure Private 5G Core?

The Azure Private 5G Core online services and packet core (edge components) receive improvements on an ongoing basis. To help you stay up to date with the most recent developments, this article provides:

- Details of new online services features.
- Details of improvements to existing online services features.
- Online services bug fixes.
- Notifications of new packet core releases. These updates will link to the relevant release note for further information.

This page is updated on a monthly basis to list what's new with Azure Private 5G Core since the previous month's update. <!-- TODO: update with agreed update frequency -->
<!-- In future: If you're looking for items older than six months, you can find them in Archive for What's new in Azure Private 5G Core. -->

## November 2022

### 2022-11-01 API

**Type:** New release

**Date available:** November 1, 2022

The 2022-11-01 ARM API release introduces the ability to configure several upcoming Azure Private 5G Core features. From November 15, the 2022-11-01 API will become the default for Azure Private 5G Core deployments.

If you use the Azure portal to manage your deployment and all your resources were created using the 2021-04-01-preview API, your deployment will be automatically upgraded to the 2022-11-01 API.

If you use ARM templates and want to keep using your existing templates, follow [Upgrade your ARM templates to the 2022-11-01 API](#upgrade-your-arm-templates-to-the-2022-11-01-api) to upgrade your 2022-04-01-preview API templates to the 2022-11-01 API.

If you used the 2021-04-01-preview or the 2022-03-01-preview APIs to create any of your resources, you'll need to take action to prevent them from becoming unmanageable. Delete these resources and redeploy them using the 2022-04-01-preview API before the 2022-11-01 API becomes the default version.

#### Upgrade your ARM templates to the 2022-11-01 API

Make the following changes for each 2022-04-01-preview API template that you want to upgrade to the 2022-11-01 API.

1. In the **Packet Core Control Plane** resource:
   1. Remove the field **properties.mobileNetwork**.
   2. Add the new mandatory field **properties.sites**. This array must contain a reference to the site resource that this control plane is being created under.
   3. Add the new mandatory field **properties.localDiagnosticsAccess.authenticationType**. This is an enum that can be set to either **AAD** to use Microsoft Azure Active Directory (Azure AD) to authenticate users of local diagnostics APIs or **Password** to use passwords to authenticate users.
   4. The billing SKU **properties.sku** should be updated to use the latest enum. Refer to the following table for the mapping between the old and new SKUs.

        | 2022-04-01-preview API  | 2022-11-01 API |
        |--|--|
        | EvaluationPackage | G0 |
        | FlagshipStarterPackage | G1 |
        | EdgeSite2GBPS | G2 |
        | EdgeSite3GBPS | G3 |
        | EdgeSite4GBPS | G4 |
        | MediumPackage | G5 |
        | LargePackage | G10 |

2. In the **Attached Data Network** resource, add the new mandatory field **properties.dnsAddresses** if one doesn't already exist. You must list your chosen DNS addresses in an array or provide an empty array if no DNS addresses are required.
3. Remove the field **properties.networkFunctions**. This field is now read-only and will be ignored if provided.

See below for a comparison between templates using 2022-04-01-preview and the 2022-11-01 APIs.

# [2022-04-01-preview API](#tab/2022-04-01-preview)

```json
{
    ...
    "resources": [
      {
        "type": "Microsoft.MobileNetwork/mobileNetworks/sites",
        "apiVersion": "2022-04-01-preview",
        ...
        "properties": {
          "networkFunctions": [
            {
              "id": "[resourceId('Microsoft.MobileNetwork/packetCoreControlPlanes', parameters('siteName'))]"
            },
            {
              "id": "[resourceId('Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes', parameters('siteName'), parameters('siteName'))]"
            }
          ]
        },
        ...
      },
      {
        "type": "Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes/attachedDataNetworks",
        "apiVersion": "2022-04-01-preview",
        ...
        "properties": {
          ...
        },
        ...
      },
      ...
      {
        "type": "Microsoft.MobileNetwork/packetCoreControlPlanes",
        "apiVersion": "2022-04-01-preview",
        ...
        "properties": {
          "mobileNetwork": {
            "id": "[resourceId('Microsoft.MobileNetwork/mobileNetworks', parameters('existingMobileNetworkName'))]"
          },
          "sku": "EvaluationPackage",
          ...
        }
      }
    ]
  }
```

# [2022-11-01 API](#tab/2022-11-01)

```json
{
    ...
    "resources": [
      {
        "type": "Microsoft.MobileNetwork/mobileNetworks/sites",
        "apiVersion": "2022-11-01",
        ...
        "properties": {
        },
        ...
      },
      {
        "type": "Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes/attachedDataNetworks",
        "apiVersion": "2022-11-01",
        ...
        "properties": {
          ...
          "dnsAddresses": "[parameters('dnsAddresses')]"
        },
        ...
      },
      ...
      {
        "type": "Microsoft.MobileNetwork/packetCoreControlPlanes",
        "apiVersion": "2022-11-01",
        ...
        "properties": {
          "sites": "TODO",
          "localDiagnosticsAccess": {
            "authenticationType": "Password"
          },
          "sku": "G0",
          ...
        }
      }
    ]
  }
```

---

## October 2022

### Packet core 2210

**Type:** New release

**Date available:**

The 2210 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2210 release notes](azure-private-5g-core-release-notes-2210.md).

### Enhanced AKS-HCI install on Azure Stack Edge (ASE)

**Type:** New feature

**Date available:** October 25, 2022

When deploying a site directly on an ASE device, you no longer need to specify the subnet mask and gateway information for the access and data networks. Instead, you'll only need to provide an Azure Stack Edge device and the names of the N2 (or S1-MME), N3 (or S1-U), and N6 (or SGi) interfaces that exist on the ASE. The subnet mask and gateway information will then be automatically collected from the linked ASE device.

See [Collect the required information for a site](collect-required-information-for-a-site.md) for the information you need to collect to create a site following this enhancement. <!-- If your site is already deployed, you can link it to your ASE device by following the relevant steps in Modify packet core. -->

### CMK and managed identity

**Type:** New feature

**Date available:** October 18, 2022

In addition to the default Microsoft-Managed Keys (MMK), you can now use Customer Managed Keys (CMK) when [creating a SIM group](manage-sim-groups.md#create-a-sim-group) or when [deploying a private mobile network](how-to-guide-deploy-a-private-mobile-network-azure-portal.md#deploy-your-private-mobile-network) to encrypt data using your own key.

Once a SIM group is created, you can't change the encryption type. If you want to protect the existing SIMs' secrets with CMK, [delete their corresponding SIM groups](manage-sim-groups.md#delete-a-sim-group) and [recreate them](manage-sim-groups.md#create-a-sim-group) with CMK enabled. Once a SIM group that uses CMK is created, you can update the key used for encryption.

For more information, see [Customer-managed key encryption at rest](security.md#customer-managed-key-encryption-at-rest).

### Fixed bug which prevented the creation/update of ADN objects

**Type:** Bug fix

**Date available:** October 11, 2022

### Time to provision SIMs greatly reduced

**Type:** Enhancement

**Date available:** October 5, 2022

## Next steps

- For more information on the packet core release you're using or plan to use, see the packet core release notes.
