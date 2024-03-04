---
title: What's new in Azure Private 5G Core?
description: Discover what's new in Azure Private 5G Core
author: paulcarter
ms.author: paulcarter
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 08/10/2023
---

# What's new in Azure Private 5G Core?

*Azure Private 5G Core* consists of two main components that interact with each other:

- **The Azure Private 5G Core service**, hosted in Azure - the management tools used to configure and monitor the deployment. Changes to the online service are available immediately.
- **Packet core instances**, hosted on Azure Stack Edge devices - the complete set of 5G network functions that provide connectivity to mobile devices at an edge location. Changes to the packet core are only available after upgrading to a new software version.

To help you stay up to date with the latest developments, this article covers:

- New features, improvements and fixes for the online service.
- New releases for the packet core, referencing the packet core release notes for further information.

This page is updated regularly with the latest developments in Azure Private 5G Core.

## July 2023
### Packet core 2307

**Type:** New release

**Date available:** July 31, 2023

The 2307 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2307 release notes](azure-private-5g-core-release-notes-2307.md).

### 2023-06-01 API

**Type:** New release

**Date available:** July 19, 2023

The 2023-06-01 ARM API release introduces the ability to configure several upcoming Azure Private 5G Core features. From July 19, 2023-06-01 is the default API version for Azure Private 5G Core deployments.
 
If you use the Azure portal to manage your deployment and all your resources were created using the 2022-04-01-preview API or 2022-11-01, you don't need to do anything. Your portal will use the new API.
 
ARM API users with existing resources can continue to use the 2022-04-01-preview API or 2022-11-01 without updating their templates.
ARM API users can migrate to the 2023-06-01 API with their current resources with no ARM template changes (other than specifying the newer API version).
 
Note: ARM API users who have done a PUT using the 2023-06-01 API and have enabled configuration only accessible in the up-level API cannot go back to using the 2022-11-01 API for PUTs. If they do, then the up-level config will be deleted.

### New cloud monitoring option - Azure Monitor Workbooks

**Type:** New feature

**Date available:** July 12, 2023

You can now use Azure Monitor Workbooks to monitor your private mobile network. Workbooks provide versatile tools for visualizing and analyzing data. You can use workbooks to gain insights into your connected resources - including the packet core, Azure Stack Edge devices and Kubernetes clusters - using a range of visualization options. You can create new workbooks or customize one of the included templates to suit your needs.

See [Monitor Azure Private 5G Core with Azure Monitor Workbooks](monitor-private-5g-core-workbooks.md) to learn more.

## June 2023

### Packet core 2306

**Type:** New release

**Date available:** July 10, 2023

The 2306 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2306 release notes](azure-private-5g-core-release-notes-2306.md).
### Configuration changes to Packet Core without a reinstall and changes to MCC, MNC

**Type:** New feature

**Date available:** July 10, 2023

It is now possible to:
- attach a new or existing data network
- modify an attached data network's configuration
  
followed by a few minutes of downtime, but not a packet core reinstall.

For details, see [Modify a packet core instance](modify-packet-core.md).

### PLMN configuration

**Type:** New feature

**Date available:** July 10, 2023

You can now change the public land mobile network (PLMN) identifier, comprising a Mobile Country Code (MCC) and Mobile Network Code (MNC), on an existing private mobile network. Previously, this required recreating the network with the new configuration.

To change your PLMN configuration, see [Deploy a private mobile network through Azure Private 5G Core - Azure portal](how-to-guide-deploy-a-private-mobile-network-azure-portal.md).


## May 2023

### Packet core 2305

**Type:** New release

**Date available:** May 31, 2023

The 2305 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2305 release notes](azure-private-5g-core-release-notes-2305.md).

### Easier creation of a site using PowerShell

**Type:** New feature

**Date available:** May 31, 2023

New-MobileNetworkSite now supports a parameter that makes it easier to create a site and its dependant resources.

For details, see [Create more Packet Core instances for a site using the Azure portal](create-additional-packet-core.md).
 
### Multiple Packet Cores under the same Site

**Type:** New feature

**Date available:** May 1, 2023

It is now possible to add multiple packet cores in the same site using the Azure portal. 

For details, see [Create a Site and dependant resources](deploy-private-mobile-network-with-site-powershell.md#create-a-site-and-dependant-resources).

## March 2023

### Packet core 2303

**Type:** New release

**Date available:** March 30, 2023

The 2303 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2303 release notes](azure-private-5g-core-release-notes-2303.md).

## February 2023

### Packet core 2302

**Type:** New release

**Date available:** March 6, 2023

The 2302 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2302 release notes](azure-private-5g-core-release-notes-2302.md).

### Rollback

**Type:** New feature

**Date available:** February 16, 2023

This feature allows you to easily revert to a previous packet core version if you encounter issues after upgrading the packet core. 

For details, see [Rollback (portal)](upgrade-packet-core-azure-portal.md#rollback) or [Rollback (ARM)](upgrade-packet-core-arm-template.md#rollback).

## January 2023

### Packet core 2301

**Type:** New release

**Date available:** January 31, 2023

The 2301 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2301 release notes](azure-private-5g-core-release-notes-2301.md).

### Multiple network slices

**Type:** New feature

**Date available:** January 31, 2023

Azure Private 5G Core now supports multiple network slices for 5G packet core deployments. Network slices allow you to host multiple independent logical networks in the same Azure Private 5G Core deployment. Slices are assigned to SIM policies and static IP addresses, providing isolated end-to-end networks that can be customized for different bandwidth and latency requirements.

For more details, see [Create and manage network slices - Azure portal](create-manage-network-slices.md).

### Enhanced provisioning status reporting

**Type:** New feature

**Date available:** January 31, 2023

The Azure Private 5G Core online service now reports the provisioning status of SIMs per-site, on both the **SIM** and **Site** resource views, to allow you to accurately determine where individual SIMs have been provisioned.

### Diagnostic package collection

**Type:** New feature

**Date available:** January 31, 2023

You can now gather diagnostics for a site remotely using the Azure portal. Diagnostics packages are collected from the edge site and uploaded to an Azure storage account, which can be shared with AP5GC support or others for assistance with issues. Follow [Gather diagnostics using the Azure portal](gather-diagnostics.md) to gather a remote diagnostics package for an Azure Private 5G Core site using the Azure portal.

### West Europe region

**Type:** New feature

**Date available:** January 17, 2023

The Azure Private 5G Core service is now live in West Europe. It's now possible to deploy and manage AP5GC resources in West Europe.

### Diagnose and resolve problems

**Type:** New feature

**Date available:** January 17, 2023

The **Diagnose and solve problems** option in the left content menu can now provide troubleshooting suggestions for your AP5GC resources.

## December 2022

### Packet core reinstall

**Type:** New feature

**Date available:** December 16, 2022

If you're experiencing issues with your packet core deployment, you can now reinstall the packet core to return it to a known state. Reinstalling the packet core deletes the existing packet core deployment and attempts to deploy the packet core at the edge with the existing site configuration. Already created **Site**-dependent resources such as the **Packet Core Control Plane**, **Packet Core Data Plane** and **Attached Data Network** continue to be used in the deployment.

You can check the installation state on the **Packet Core Control Plane** resource's overview page. Upon successful redeployment, the installation state changes from **Reinstalling** to either **Installed** or **Failed**, depending on the outcome. You can reinstall the packet core if the installation state is **Installed** or **Failed**.

If you attempt a reinstall after an upgrade, redeployment will be attempted with the upgraded packet core version. The reinstall is done using the latest packet core version currently defined in the ARM API version.

To reinstall your packet core instance, see [Reinstall the packet core instance in a site - Azure portal](reinstall-packet-core.md).

### HTTPS certificates at the edge

**Type:** New feature

**Date available:** December 19, 2022

It's now possible to secure access to a site’s local monitoring tools with a custom, user-provided HTTPS certificate. Certificates can be uploaded to an Azure Key Vault and specified in the **Packet Core Control Plane**'s local access configuration to be provisioned down to the edge.

This feature has the following limitations:

- Certificate deletion requires a pod restart to be reflected at the edge.
- User-assigned managed identities are not currently supported for certificate provisioning.
- Actions on key vaults and certificates not involving a modification on the **Packet Core Control Plane** object can take up to an hour to be reflected at the edge.

You can add a custom certificate to secure access to your local monitoring tools during [site creation](collect-required-information-for-a-site.md#collect-local-monitoring-values). For existing sites, you can add a custom HTTPS certificate by following [Modify the local access configuration in a site](modify-local-access-configuration.md).

## November 2022

### 2022-11-01 API

**Type:** New release

**Date available:** December 12, 2022

The 2022-11-01 ARM API release introduces the ability to configure several upcoming Azure Private 5G Core features. From December 12, 2022-11-01 is the default API version for Azure Private 5G Core deployments.

If you use the Azure portal to manage your deployment and all your resources were created using the 2022-04-01-preview API, you don't need to do anything. Your portal uses the new API and any differences between the APIs are handled automatically.

If you use ARM templates and want to keep using your existing templates, follow [Upgrade your ARM templates to the 2022-11-01 API](#upgrade-your-arm-templates-to-the-2022-11-01-api) to upgrade your 2022-04-01-preview API templates to the 2022-11-01 API.

If you used an API version older than 2022-04-01-preview to create any of your resources, you need to take action to prevent them from becoming unmanageable. As soon as possible, delete these resources and redeploy them using the new 2022-11-01 API. You can redeploy the resources using the Azure portal or by upgrading your ARM templates as described in [Upgrade your ARM templates to the 2022-11-01 API](#upgrade-your-arm-templates-to-the-2022-11-01-api). These instructions may not be comprehensive for older templates.

#### Upgrade your ARM templates to the 2022-11-01 API

Make the following changes for each 2022-04-01-preview API template that you want to upgrade to the 2022-11-01 API.

1. In the **Packet Core Control Plane** resource:
   1. Remove the field **properties.mobileNetwork**.
   2. Add the new mandatory field **properties.sites**. This array must contain a reference to the site resource under which this control plane is being created.
   3. Add the new mandatory field **properties.localDiagnosticsAccess.authenticationType**. This field is an enum governing how users of local diagnostics APIs will be authenticated. Set this to **Password**.
   4. Update the field **properties.sku** according to the mapping in the following table.

        | 2022-04-01-preview API  | 2022-11-01 API |
        |--|--|
        | EvaluationPackage | G0 |
        | FlagshipStarterPackage | G1 |
        | EdgeSite2GBPS | G2 |
        | EdgeSite3GBPS | G3 |
        | EdgeSite4GBPS | G4 |
        | MediumPackage | G5 |
        | LargePackage | G10 |

1. In the **Attached Data Network** resource, add the new mandatory field **properties.dnsAddresses** if one doesn't already exist. List your chosen DNS addresses in an array or provide an empty array if no DNS addresses are required.
1. In the **Sites** resource, remove the field **properties.networkFunctions**. This field is now read-only and will be ignored if provided.
1. Move the **Sites** resource above the **packetCoreControlPlanes** resource. This ensures that the resources are created in the required order.

The following is a comparison of templates using the 2022-04-01-preview and the 2022-11-01 APIs.

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
              "id": "[resourceId('Microsoft.MobileNetwork/packetCoreControlPlanes', parameters('siteID'))]"
            },
            {
              "id": "[resourceId('Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes', parameters('siteID'), parameters('siteID'))]"
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
        "properties": {},
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
          "sites": "parameters('siteID')",
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

### Packet core 2211

**Type:** New release

**Date available:** December 5, 2022

The 2211 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2211 release notes](azure-private-5g-core-release-notes-2211.md).

### Multiple data networks

**Type:** New feature

**Date available:** December 5, 2022

You can now configure up to three Attached Data Networks for each Packet Core instead of one. To use this feature, you must upgrade to the 2211 packet core release.

The operator can provision UEs as subscribed in one or more Data Networks and apply Data Network-specific policy and QoS, allowing UEs to use multiple Layer 3 uplink networks selected based on policy or UE preference.

Each Data Network can have its own configuration for DNS, UE IP address pools, N6 IP, and NAT. This concept also maps directly to 4G APNs.

This feature has the following limitations:

- Once more than a single Data Network is configured, further configuration changes require the packet core to be reinstalled. To ensure this reinstall happens only after you have made all your changes, you must follow the process for installing and modifying as described in the documentation.

- VLAN separation of Data Networks is not supported. Only Layer 3 separation is supported (meaning you can't have overlapping IP address spaces across the Data Networks).

- Metrics are not yet reported on a per-Data Network basis.

To add data networks to an existing site, see [Modify the packet core instance in a site](modify-packet-core.md). To create a new site, see [Create a site](create-a-site.md).

### Easier site deletion

**Type:** New feature

**Date available:** December 5, 2022

Previously, you had to delete all the ARM resources associated with a site before deleting the site resource. You can now delete a site and its associated resources in one step. See [Delete a site](delete-a-site.md).

### Azure Stack Edge (ASE) version validation

**Type:** New feature

**Date available:** December 5, 2022

You can no longer choose a packet core version that is incompatible with your ASE version when installing or upgrading the packet core. The install or upgrade will be blocked and the portal will display an error message. This only applies when using the Azure portal.

## October 2022

### Packet core 2210

**Type:** New release

**Date available:** November 3, 2022

The 2210 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2210 release notes](azure-private-5g-core-release-notes-2210.md).

### Enhanced AKS-HCI install on Azure Stack Edge (ASE)

**Type:** New feature

**Date available:** October 25, 2022

When deploying a site directly on an ASE device, you no longer need to specify the subnet mask and gateway information for the access and data networks. Instead, you'll only need to provide an Azure Stack Edge device and the names of the N2 (or S1-MME), N3 (or S1-U), and N6 (or SGi) interfaces that exist on the ASE. The subnet mask and gateway information will then be automatically collected from the linked ASE device.

See [Collect the required information for a site](collect-required-information-for-a-site.md) for the information you need to collect to create a site following this enhancement. If your site is already deployed, you can link it to your ASE device by following [Modify the packet core instance in a site](modify-packet-core.md).

### Customer Managed Keys (CMK) and managed identity

**Type:** New feature

**Date available:** October 18, 2022

In addition to the default Microsoft-Managed Keys (MMK), you can now use Customer Managed Keys (CMK) to encrypt data using your own key when [creating a SIM group](manage-sim-groups.md#create-a-sim-group) or when [deploying a private mobile network](how-to-guide-deploy-a-private-mobile-network-azure-portal.md#deploy-your-private-mobile-network).

Once a SIM group is created, you can't change the encryption type. If you want to protect the existing SIMs' secrets with CMK, [delete their corresponding SIM groups](manage-sim-groups.md#delete-a-sim-group) and [recreate them](manage-sim-groups.md#create-a-sim-group) with CMK enabled. Once a SIM group that uses CMK is created, you can update the key used for encryption.

For more information, see [Customer-managed key encryption at rest](security.md#customer-managed-key-encryption-at-rest).

### Fixes and enhancements

- October 5, 2022: Time to provision SIMs greatly reduced
- October 11, 2022: Fixed bug that prevented the creation/update of ADN objects

## Next steps

- For more information on the packet core release you're using or plan to use, see the packet core release notes.
