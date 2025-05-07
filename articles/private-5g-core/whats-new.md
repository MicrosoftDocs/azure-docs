---
title: What's new in Azure Private 5G Core?
description: Discover what's new in Azure Private 5G Core.
author: anzaman
ms.author: alzam
ms.service: azure-private-5g-core
ms.topic: how-to 
ms.date: 12/21/2023
---

# What's new in Azure Private 5G Core?

*Azure Private 5G Core* consists of two main components that interact with each other:

- **The Azure Private 5G Core service**, hosted in Azure - the management tools used to configure and monitor the deployment. Changes to the online service are available immediately.
- **Packet core instances**, hosted on Azure Stack Edge devices - the complete set of 5G network functions that provide connectivity to mobile devices at an edge location. Changes to the packet core are only available after upgrading to a new software version.

To help you stay up to date with the latest developments, this article covers:

- New features, improvements, and fixes for the online service.
- New releases for the packet core, referencing the packet core release notes for further information.

This page is updated regularly with the latest developments in Azure Private 5G Core.

## May 2024
### Packet core 2404

**Type:** New release

**Date available:** May 13, 2024

The 2404 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2404 release notes](azure-private-5g-core-release-notes-2404.md).

### High Availability

We're excited to announce that AP5GC is now resilient to system failures when run on a two-node ASE cluster. Userplane traffic, sessions, and registrations are unaffected on failure of any single pod, physical interface, or ASE device.

### In Service Software Upgrade 

In our commitment to continuous improvement and minimizing service impact we’re excited to announce that when upgrading from this version to a future release, updates include the capability for In-Service Software Upgrades (ISSU).

ISSU is supported for deployments on a 2-node cluster. Software upgrades can be performed seamlessly, ensuring minimal disruption to your services. The upgrade completes with no loss of sessions or registrations and minimal packet loss and packet reordering. Should the upgrade fail, the software automatically rolls back to the previous version, also with minimal service disruption.

### Azure Resource Health 

This feature allows you to monitor the health of your control plane resource using Azure Resource Health. Azure Resource Health is a service that processes and displays health signals from your resource and displays the health in the Azure portal. This service gives you a personalized dashboard showing all the times your resource was unavailable or in a degraded state, along with recommended actions to take to restore health.

For more information, on using Azure Resource Health to monitor the health of your deployment, see [Resource Health overview](/azure/service-health/resource-health-overview).

### NAS Encryption

NAS (Non-Access-Stratum) encryption configuration determines the encryption algorithm applied to the management traffic between the UEs and the AMF(5G) or MME(4G). By default, for security reasons, Packet Core deployments are configured to preferentially use NEA2/EEA2 encryption.

You can change the preferred encryption level after deployment by [modifying the packet core configuration](modify-packet-core.md).

### RADIUS Authentication

The RADIUS authentication feature enables AP5GC to perform secondary authentication via an AAA server for 4G attach and establishing a PDN/PDU session for 4G and 5G.
This feature can be enabled per DN to perform secondary authentication. PAP based secondary authentication is supported in current release.

For more information on configuration RADIUS Authentication for your deployment, see [RADIUS Authentication](security.md).

### VLAN Trunking

VLAN trunking provides a new method for configuring data networks. A single virtual network interface is used to carry all data plane traffic. The traffic is all VLAN tagged, with each DN using a separate VLAN to provide separation. Configuration to use VLAN trunking is done on both the ASE and Private Mobile Network. When AP5GC is deployed on a 2-node cluster, VLAN trunking is mandatory.

For more information on configuration of VLAN Trunking, see [Commission an AKS Cluster](commission-cluster.md?pivots=ase-pro-2#set-up-advanced-networking).

### Dual-router link redundancy

Link connectivity monitoring for High Availability now accommodates paired peer routers in a dual-redundancy topology.  You can configure this by designating two BFD peer router IP addresses per interface – if this is set then:
- Each Packet Core node establishes BFD sessions with each of these routers, rather than with the default gateway IP.
- The interface is not considered to have lost connectivity unless both IPs in the redundant pair are unreachable.

For more information on configuration of dual-routers, see [Create a site](create-a-site.md) or [Modify a site](modify-packet-core.md).

### RAN insights preview

We’re excited to announce that radio access network (RAN) insights is now in preview for AP5GC. This feature integrates third-party data from RAN vendors, collecting and displaying a subset of metrics from your Element Management Systems (EMS) as standard metrics in Azure. By leveraging Azure's capabilities, this integration offers a unified and simplified experience for monitoring and troubleshooting RAN across multiple vendors and locations. With RAN insights you will now be able to:

- View the metrics of your RAN to monitor their deployment’s performance, reliability, and connection status.
- Access geo maps for a visual overview of all connected access points along with health status and performance metrics of each radio.
- Use correlated metrics of your RAN and packet core to help diagnose and troubleshoot issues.

To learn more and get started, see [RAN Insights Concepts](ran-insights-concepts.md) and [Create a Radio Access Network Insights Resource](ran-insights-create-resource.md).

## April 2024
### Packet core 2403

**Type:** New release

**Date available:** April 4, 2024

The 2403 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2403 release notes](azure-private-5g-core-release-notes-2403.md).

### TCP Maximum Segment Size (MSS) Clamping

TCP session initial setup messages that include a Maximum Segment Size (MSS) value, which controls the size limit of packets transmitted during the session. The packet core now automatically sets this value, where necessary, to ensure packets aren't too large for the core to transmit. This setting reduces packet loss due to oversized packets arriving at the core's interfaces, and reduces the need for fragmentation and reassembly, which are costly procedures.

### Improved Packet Core Scaling 

In this release, the maximum supported limits for a range of parameters in an Azure Private 5G Core deployment increase. Testing confirms these limits, but other factors could affect what is achievable in a given scenario.

For details, see [Service Limits](azure-stack-edge-virtual-machine-sizing.md#service-limits).

## March 2024

### Azure Policy support

**Type:** New feature

**Date available:** March 26, 2024

You can now use [Azure Policy](../governance/policy/overview.md) to enforce security-related settings in your AP5GC deployment. Azure Policy allows you to ensure compliance with organizational standards across supported Azure services. AP5GC has built-in policy definitions for:

- using Microsoft Entra ID to access local monitoring tools
- using customer-managed keys to encrypt SIM groups.

See [Azure Policy policy definitions for Azure Private 5G Core](azure-policy-reference.md) for details.

### SUPI concealment

**Type:** New feature

**Date available:** March 22, 2024

The SUPI (subscription permanent identifier) secret needs to be encrypted before being transmitted over the radio network as a SUCI (subscription concealed identifier). UEs perform this concealment on registration, and the packet core performs the deconcealment. You can now securely manage the required private keys through the Azure portal and provision SIMs with public keys.

For more information, see [Enable SUPI concealment](supi-concealment.md).

## February 2024
### New Microsoft Entra ID user role needed for distributed tracing tool

**Type:** New feature

**Date available:** February 21, 2024

Access to the [distributed tracing](distributed-tracing.md) tool now requires a dedicated sas.user role in Microsoft Entra ID. This user is available from AP5GC version 4.2310.0-8, and required from AP5GC version 2402 onwards. If you're using Microsoft Entra ID authentication, you should create this user before upgrading to version 2402 to avoid losing access to the tracing tool. Microsoft Entra ID access to the packet core dashboards is unchanged.

See [Enable Microsoft Entra ID for local monitoring tools](enable-azure-active-directory.md) for details.

## December 2023
### Packet Capture

**Type:** New feature

**Date available:** December 4, 2023

Previously, packet capture could only be performed from edge sites, requiring local access to your Azure Stack Edge device. Now, you can initiate packet capture from the Azure portal and seamlessly transmit the captured data from edge sites to an Azure storage container. You can then download the data to inspect with a tool of your choice.  For more information, see [Data Plane Packet Capture](data-plane-packet-capture.md).

### Edge Log Backhaul

**Type:** New Feature

**Date available:** December 22, 2023

The new Edge Log Backhaul feature provides Microsoft support personnel with easy access to customer network function logs to help them troubleshoot and find root cause for customer issues. This feature is enabled by default. To disable this feature, [modify the packet core configuration](modify-packet-core.md).

## October 2023
### Packet core 2310

**Type:** New release

**Date available:** November 7, 2023

The 2310 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2310 release notes](azure-private-5g-core-release-notes-2310.md).

### Optional N2/N3/S1/N6 gateway
This feature makes the N2, N3 and N6 gateways optional during the network configuration of an ASE if the RAN and Packet Core are on the same subnet. This feature provides flexibility to use AP5GC without gateways if there's direct connectivity available with the RAN and/or DN.

### Improved software download time
This feature improves overall AP5GC software download time by reducing the size of underlying software packages by around 40%.

### Per-UE information in Azure portal and API
This feature allows you to view UE-level information in the Azure portal. It includes a list of SIMs with high level information and a detailed view for each SIM. This information is the current snapshot of the UE in the system and can be fetched on-demand with a throttling period of 5 min. See [Manage existing SIMs for Azure Private 5G Core - Azure portal](manage-existing-sims.md).

### Per gNB metrics in Azure portal
This feature categorizes a few metrics based on the RAN identifier, for example UL/DL bandwidth etc. These metrics are exposed via Azure monitor under Packet Core Control Plane and Packet Core Data Plane resources. These metrics can be used to correlate the RAN and packet core metrics and troubleshoot.

### Combined 4G/5G on a single packet core
This feature allows a packet core that supports both 4G and 5G networks on a single Mobile Network site. You can deploy a RAN network with both 4G and 5G radios and connect to a single packet core.

## September 2023
### Packet core 2308

**Type:** New release

**Date available:** September 21, 2023

The 2308 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2308 release notes](azure-private-5g-core-release-notes-2308.md).

### 10 DNs

**Type:** New feature

**Date available:** September 07, 2023

In this release, the number of supported data networks (DNs) increases from three to ten, including with layer 2 traffic separation. If more than 6 DNs are required, a shared switch for access and core traffic is needed.

### Default MTU values 

**Type:** New feature

**Date available:** September 07, 2023

In this release, the default MTU values are changed as follows:
- UE MTU: 1440 (was 1300)
-	Access MTU: 1500 (was 1500)
-	Data MTU: 1440 (was 1500)

Customers upgrading to 2308 see a change in the MTU values on their packet core.

If the UE MTU is set to any valid value (see API Spec), then the other MTUs are set to:
- Access MTU: UE MTU + 60
- Data MTU: UE MTU
  
Rollbacks to Packet Core versions earlier than 2308 aren't possible if the UE MTU field is changed following an upgrade.

### MTU Interop setting

**Type:** New feature

**Date available:** September 07, 2023

In this release, the MTU Interop setting is deprecated and can't be set for Packet Core versions 2308 and above.

## July 2023
### Packet core 2307

**Type:** New release

**Date available:** July 31, 2023

The 2307 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2307 release notes](azure-private-5g-core-release-notes-2307.md).

### UE usage tracking

**Type:** New feature

**Date available:** July 31, 2023

The UE usage tracking messages in Azure Event Hubs are now encoded in AVRO file container format, which enables you to consume these events via Power BI or Azure Stream Analytics (ASA). If you want to enable this feature for your deployment, contact your support representative.

### Unknown User cause code mapping in 4G deployments

**Type:** New feature

**Date available:** July 31, 2023

This feature changes the 4G NAS EMM cause code for “unknown user” (subscriber not provisioned on AP5GC) to “no-suitable-cells-in-ta-15” by default. This feature provides better interworking in scenarios where a single PLMN is used for multiple, independent mobile networks.
### 2023-06-01 API

**Type:** New release

**Date available:** July 19, 2023

The 2023-06-01 ARM API release introduces the ability to configure several upcoming Azure Private 5G Core features. From July 19, 2023-06-01 is the default API version for Azure Private 5G Core deployments.
 
If you use the Azure portal to manage your deployment and all your resources were created using the 2022-04-01-preview API or 2022-11-01, you don't need to do anything. Your portal will use the new API.
 
ARM API users with existing resources can continue to use the 2022-04-01-preview API or 2022-11-01 without updating their templates.
ARM API users can migrate to the 2023-06-01 API with their current resources with no ARM template changes (other than specifying the newer API version).
 
Note: ARM API users who did a PUT using the 2023-06-01 API and enabled configuration only accessible in the up-level API can't go back to using the 2022-11-01 API for PUTs. If they do, then the up-level config is deleted.

### New cloud monitoring option - Azure Monitor Workbooks

**Type:** New feature

**Date available:** July 12, 2023

You can now use Azure Monitor Workbooks to monitor your private mobile network. Workbooks provide versatile tools for visualizing and analyzing data. You can use workbooks to gain insights into your connected resources - including the packet core, Azure Stack Edge devices and Kubernetes clusters - using a range of visualization options. You can create new workbooks or customize one of the included templates to suit your needs.

For more information, see [Monitor Azure Private 5G Core with Azure Monitor Workbooks](monitor-private-5g-core-workbooks.md).

## June 2023

### Packet core 2306

**Type:** New release

**Date available:** July 10, 2023

The 2306 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2306 release notes](azure-private-5g-core-release-notes-2306.md).
### Configuration changes to Packet Core without a reinstall and changes to MCC, MNC

**Type:** New feature

**Date available:** July 10, 2023

It's now possible to:
- attach a new or existing data network.
- modify an attached data network's configuration.
  
This change is followed by a few minutes of downtime, but not a packet core reinstall.

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

It's now possible to add multiple packet cores in the same site using the Azure portal. 

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

The Azure Private 5G Core online service now reports the provisioning status of SIMs per-site, on both the **SIM** and **Site** resource views, to allow you to accurately determine where individual SIMs are provisioned.

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
- User-assigned managed identities aren't currently supported for certificate provisioning.
- Actions on key vaults and certificates not involving a modification on the **Packet Core Control Plane** object can take up to an hour to be reflected at the edge.

You can add a custom certificate to secure access to your local monitoring tools during [site creation](collect-required-information-for-a-site.md#collect-local-monitoring-values). For existing sites, you can add a custom HTTPS certificate by following [Modify the local access configuration in a site](modify-local-access-configuration.md).

## November 2022

### 2022-11-01 API

**Type:** New release

**Date available:** December 12, 2022

The 2022-11-01 ARM API release introduces the ability to configure several upcoming Azure Private 5G Core features. From December 12, 2022-11-01 is the default API version for Azure Private 5G Core deployments.

If you use the Azure portal to manage your deployment and all your resources were created using the 2022-04-01-preview API, you don't need to do anything. Your portal uses the new API and any differences between the APIs are handled automatically.

If you use ARM templates and want to keep using your existing templates, follow [Upgrade your ARM templates to the 2022-11-01 API](#upgrade-your-arm-templates-to-the-2022-11-01-api) to upgrade your 2022-04-01-preview API templates to the 2022-11-01 API.

If you used an API version older than 2022-04-01-preview to create any of your resources, you need to take action to prevent them from becoming unmanageable. As soon as possible, delete these resources and redeploy them using the new 2022-11-01 API. You can redeploy the resources using the Azure portal or by upgrading your ARM templates as described in [Upgrade your ARM templates to the 2022-11-01 API](#upgrade-your-arm-templates-to-the-2022-11-01-api). These instructions might not be comprehensive for older templates.

#### Upgrade your ARM templates to the 2022-11-01 API

Make the following changes for each 2022-04-01-preview API template that you want to upgrade to the 2022-11-01 API.

1. In the **Packet Core Control Plane** resource:
   1. Remove the field **properties.mobileNetwork**.
   2. Add the new mandatory field **properties.sites**. This array must contain a reference to the site resource under which this control plane is being created.
   3. Add the new mandatory field **properties.localDiagnosticsAccess.authenticationType**. This field is an enum governing how users of local diagnostics APIs are authenticated. Set this field to **Password**.
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
1. In the **Sites** resource, remove the field **properties.networkFunctions**. This field is now read-only and is ignored if provided.
1. Move the **Sites** resource above the **packetCoreControlPlanes** resource. This move ensures that the resources are created in the required order.

The following json extract is a comparison of templates using the 2022-04-01-preview and the 2022-11-01 APIs.

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

- Once more than a single Data Network is configured, further configuration changes require the packet core to be reinstalled. To ensure this reinstall happens only after you make all your changes, you must follow the process for installing and modifying as described in the documentation.

- VLAN separation of Data Networks isn't supported. Only Layer 3 separation is supported (meaning you can't have overlapping IP address spaces across the Data Networks).

- Metrics aren't yet reported on a per-Data Network basis.

To add data networks to an existing site, see [Modify the packet core instance in a site](modify-packet-core.md). To create a new site, see [Create a site](create-a-site.md).

### Easier site deletion

**Type:** New feature

**Date available:** December 5, 2022

Previously, you had to delete all the ARM resources associated with a site before deleting the site resource. You can now delete a site and its associated resources in one step. See [Delete a site](delete-a-site.md).

### Azure Stack Edge (ASE) version validation

**Type:** New feature

**Date available:** December 5, 2022

You can no longer choose a packet core version that is incompatible with your ASE version when installing or upgrading the packet core. The install or upgrade blocks and the portal displays an error message. This change only applies when using the Azure portal.

## October 2022

### Packet core 2210

**Type:** New release

**Date available:** November 3, 2022

The 2210 release for the Azure Private 5G Core packet core is now available. For more information, see [Azure Private 5G Core 2210 release notes](azure-private-5g-core-release-notes-2210.md).

### Enhanced AKS-HCI install on Azure Stack Edge (ASE)

**Type:** New feature

**Date available:** October 25, 2022

When deploying a site directly on an ASE device, you no longer need to specify the subnet mask and gateway information for the access and data networks. Instead, you need to provide an Azure Stack Edge device and the names of the N2 (or S1-MME), N3 (or S1-U), and N6 (or SGi) interfaces that exist on the ASE. The subnet mask and gateway information will then be automatically collected from the linked ASE device.

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
