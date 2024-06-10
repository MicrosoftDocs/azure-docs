---
title: Prepare to deploy Azure Communications Gateway
description: Learn how to complete the prerequisite tasks required to deploy Azure Communications Gateway in Azure.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 04/26/2024
---

# Prepare to deploy Azure Communications Gateway

This article guides you through each of the tasks you need to complete before you can start to deploy Azure Communications Gateway. For Operator Connect and Teams Phone Mobile, successful deployments depend on the state of your Operator Connect or Teams Phone Mobile environments.

The following sections describe the information you need to collect and the decisions you need to make prior to deploying Azure Communications Gateway.

## Prerequisites

[!INCLUDE [communications-gateway-tsp-restriction](includes/communications-gateway-tsp-restriction.md)]

[!INCLUDE [communications-gateway-deployment-prerequisites](includes/communications-gateway-deployment-prerequisites.md)]

If you want to set up a lab deployment, you must have deployed a standard deployment or be about to deploy one. You can't use a lab deployment as a standalone Azure Communications Gateway deployment.

## Arrange onboarding

You need a Microsoft onboarding team to deploy Azure Communications Gateway. Azure Communications Gateway includes an onboarding program called [Included Benefits](onboarding.md). If you're not eligible for Included Benefits or you require more support, discuss your requirements with your Microsoft sales representative.

The Operator Connect and Teams Phone Mobile programs also require an onboarding partner who manages the necessary changes to the Operator Connect or Teams Phone Mobile environments and coordinates with Microsoft Teams on your behalf. The Azure Communications Gateway Included Benefits project team fulfills this role, but you can choose a different onboarding partner to coordinate with Microsoft Teams on your behalf.

## Ensure you have a suitable support plan

We strongly recommend that you have a support plan that includes technical support, such as [Microsoft Unified Support](https://www.microsoft.com/en-us/unifiedsupport/overview).

## Choose the Azure tenant to use

We recommend that you use an existing Microsoft Entra tenant for Azure Communications Gateway, because using an existing tenant uses your existing identities for fully integrated authentication. If you need to manage identities separately from the rest of your organization, or to set up different permissions for the Number Management Portal for different Azure Communications Gateway resources, create a new dedicated tenant first.

The Operator Connect and Teams Phone Mobile environments inherit identities and configuration permissions from your Microsoft Entra tenant through a Microsoft application called Project Synergy. You must add this application to your Microsoft Entra tenant as part of [Connect Azure Communications Gateway to Operator Connect or Teams Phone Mobile](connect-operator-connect.md) (if your tenant does not already contain this application).

> [!IMPORTANT]
> For Operator Connect and Teams Phone Mobile, production deployments and lab deployments must connect to the same Microsoft Entra tenant. Microsoft Teams configuration for your tenant shows configuration for your lab deployments and production deployments together.

## Get access to Azure Communications Gateway for your Azure subscription

Access to Azure Communications Gateway is restricted. When you've completed the previous steps in this article:

1. Contact your onboarding team and ask them to enable your subscription. If you don't already have an onboarding team, contact azcog-enablement@microsoft.com with your Azure subscription ID and contact details.
2. Wait for confirmation that Azure Communications Gateway is enabled before moving on to the next step.

## Create a network design

Decide how Azure Communications Gateway should connect to your network. We recommend Microsoft Azure Peering Service Voice (sometimes called MAPS Voice). For more information about your options, see [Connectivity for Azure Communications Gateway](connectivity.md). If you're planning to use Azure Communications Gateway with VNet injection (preview), complete the [prerequisites for deploying Azure Communications Gateway with VNet injection](prepare-for-vnet-injection.md).

For Teams Phone Mobile and Azure Operator Call Protection Preview, you must decide how your network should determine whether a call involves a relevant subscriber and therefore route the call correctly. You can:

- Use Azure Communications Gateway's integrated Mobile Control Point (MCP).
- Connect to an on-premises version of Mobile Control Point (MCP) from Metaswitch.
- Use other routing capabilities in your core network.

For more information on these options for Teams Phone Mobile, see [Call control integration for Teams Phone Mobile](interoperability-operator-connect.md#call-control-integration-for-teams-phone-mobile) and [Mobile Control Point in Azure Communications Gateway](mobile-control-point.md).

The connection to Azure Communications Gateway for Azure Operator Call Protection is over SIPREC.  Azure Communications Gateway takes the role of the SIPREC Session Recording Server (SRS).  An element in your network, typically a session border controller (SBC), is set up as a SIPREC Session Recording Client (SRC).

If you need to support emergency calls from Microsoft Teams or Zoom clients, read about emergency calling with your chosen communications service:

- [Microsoft Teams Direct Routing](emergency-calls-teams-direct-routing.md)
- [Operator Connect and Teams Phone Mobile](emergency-calls-operator-connect.md)
- [Zoom Phone Cloud Peering](emergency-calls-zoom.md)

> [!IMPORTANT]
> You must not route emergency calls from your network to Azure Communications Gateway.

## Connect your network to Azure

Configure connections between your network and Azure:

- To configure Microsoft Azure Peering Service Voice (sometimes called MAPS Voice), follow the instructions in [Internet peering for Peering Service Voice walkthrough](../internet-peering/walkthrough-communications-services-partner.md).
- To configure ExpressRoute Microsoft Peering, follow the instructions in [Tutorial: Configure peering for ExpressRoute circuit](../../articles/expressroute/expressroute-howto-routing-portal-resource-manager.md).


## Collect basic information for deploying an Azure Communications Gateway

 Collect all of the values in the following table for the Azure Communications Gateway resource.

|**Value**|**Field name(s) in Azure portal**|
 |---------|---------|
 |The name of the Azure subscription to use to create an Azure Communications Gateway resource. You must use the same subscription for all resources in your Azure Communications Gateway deployment. |**Project details: Subscription**|
 |The Azure resource group in which to create the Azure Communications Gateway resource. |**Project details: Resource group**|
 |The name for the deployment. This name can contain alphanumeric characters and `-`. It must be 3-24 characters long. |**Instance details: Name**|
 |The management Azure region: the region in which your monitoring and billing data is processed. We recommend that you select a region near or colocated with the two regions for handling call traffic. |**Instance details: Region** |
 |The type of deployment. Choose from **Standard** (for production) or **Lab**. |**Instance details: SKU** |
 |The voice codecs to use between Azure Communications Gateway and your network. We recommend that you only specify any codecs if you have a strong reason to restrict codecs (for example, licensing of specific codecs) and you can't configure your network or endpoints not to offer specific codecs. Restricting codecs can reduce the overall voice quality due to lower-fidelity codecs being selected. |**Call Handling: Supported codecs**|
 |Whether your Azure Communications Gateway resource should handle emergency calls as standard calls or directly route them to the Emergency Routing Service Provider (US only; only for Operator Connect or Teams Phone Mobile). |**Call Handling: Emergency call handling**|
 |A comma-separated list of dial strings used for emergency calls. For Microsoft Teams, specify dial strings as the standard emergency number (for example `999`). For Zoom, specify dial strings in the format `+<country-code><emergency-number>` (for example `+44999`). (Only for Operator Connect, Teams Phone Mobile and Zoom Phone Cloud Peering).|**Call Handling: Emergency dial strings**|
 |The scope at which the autogenerated domain name label for Azure Communications Gateway is unique. Communications Gateway resources are assigned an autogenerated domain name label that depends on the name of the resource.  Selecting **Tenant** gives a resource with the same name in the same tenant but a different subscription the same label. Selecting **Subscription** gives a resource with the same name in the same subscription but a different resource group the same label. Selecting **Resource Group** gives a resource with the same name in the same resource group the same label. Selecting **No Re-use** means the label doesn't depend on the name, resource group, subscription or tenant. |**DNS: Auto-generated Domain Name Scope**|

## Collect configuration values for service regions

Collect all of the values in the following table for both service regions in which you want to deploy Azure Communications Gateway.

> [!NOTE]
> Lab deployments have one Azure region and connect to one site in your network.

 |**Value**|**Field name(s) in Azure portal**|
 |---------|---------|
 |The Azure region to use for call traffic.<br><br>If you are enabling Azure Operator Call Protection Preview there are restrictions on where your Azure resources can be deployed; see [Choosing Management and Service Regions](reliability-communications-gateway.md#choosing-management-and-service-regions) |**Service Region One/Two: Region**|
 |The IPv4 address belonging to your network that Azure Communications Gateway should use to contact your network from this region. |**Service Region One/Two: Operator IP address**|
 |The set of IP addresses/ranges that are permitted as sources for signaling traffic from your network. Provide an IPv4 address range using CIDR notation (for example, 192.0.2.0/24) or an IPv4 address (for example, 192.0.2.0). You can also provide a comma-separated list of IPv4 addresses and/or address ranges.|**Service Region One/Two: Allowed Signaling Source IP Addresses/CIDR Ranges**|
 |The set of IP addresses/ranges that are permitted as sources for media traffic from your network. Provide an IPv4 address range using CIDR notation (for example, 192.0.2.0/24) or an IPv4 address (for example, 192.0.2.0). You can also provide a comma-separated list of IPv4 addresses and/or address ranges.|**Service Region One/Two: Allowed Media Source IP Address/CIDR Ranges**|

## Collect configuration values for each communications service

Collect the values for the communications services that you're planning to support.

> [!IMPORTANT]
> Some options apply to multiple services, as shown by **Options common to multiple communications services** in the following tables. You must choose configuration that is suitable for all the services that you plan to support.

For Microsoft Teams Direct Routing:

|**Value**|**Field name(s) in Azure portal**|
|---------|---------|
| IP addresses or address ranges (in CIDR format) in your network that should be allowed to connect to Azure Communications Gateway's Provisioning API, in a comma-separated list. Use of the Provisioning API is required to provision numbers for Direct Routing. | **Options common to multiple communications services: Allowed source IP addresses/CIDR ranges for connecting to the Communications Gateway Provisioning Platform** |
| Whether to add a custom SIP header to messages entering your network by using Azure Communications Gateway's Provisioning API | **Options common to multiple communications services: Add custom SIP header** |
| (Only if you choose to add a custom SIP header) The name of any custom SIP header | **Options common to multiple communications services: Custom SIP header name** |

For Operator Connect:

|**Value**|**Field name(s) in Azure portal**|
|---------|---------|
| Whether to add a custom SIP header to messages entering your network by using Azure Communications Gateway's Provisioning API | **Options common to multiple communications services: Add custom SIP header** |
| (Only if you choose to add a custom SIP header) The name of any custom SIP header | **Options common to multiple communications services: Custom SIP header name** |
| (Only if you choose to add a custom SIP header) IP addresses or address ranges (in CIDR format) in your network that should be allowed to connect to the Provisioning API, in a comma-separated list. | **Options common to multiple communications services: Allowed source IP addresses/CIDR ranges for connecting to the Communications Gateway Provisioning Platform** |

For Teams Phone Mobile:

|**Value**|**Field name(s) in Azure portal**|
|---------|---------|
|The number used in Teams Phone Mobile to access the Voicemail Interactive Voice Response (IVR) from native dialers.|**Teams Phone Mobile: Teams voicemail pilot number**|
| How you plan to use Mobile Control Point (MCP) to route Teams Phone Mobile calls to Microsoft Phone System. Choose from **Integrated** (to deploy MCP in Azure Communications Gateway), **On-premises** (to use an existing on-premises MCP) or **None** (if you'll use another method to route calls). |**Teams Phone Mobile: MCP**|

For Zoom Phone Cloud Peering:

|**Value**|**Field name(s) in Azure portal**|
|---------|---------|
| The Zoom region to connect to | **Zoom: Zoom region** |
| IP addresses or address ranges (in CIDR format) in your network that should be allowed to connect to Azure Communications Gateway's Provisioning API, in a comma-separated list. Use of the Provisioning API is required to provision numbers for Zoom Phone Cloud Peering. | **Options common to multiple communications services: Allowed source IP addresses/CIDR ranges for connecting to the Communications Gateway Provisioning Platform** |
| Whether to add a custom SIP header to messages entering your network by using Azure Communications Gateway's Provisioning API | **Options common to multiple communications services: Add custom SIP header** |
| (Only if you choose to add a custom SIP header) The name of any custom SIP header | **Options common to multiple communications services: Custom SIP header name** |

There are no configuration options required for Azure Operator Call Protection Preview.

## Collect values for service verification numbers

Collect all of the values in the following table for all the service verification numbers required by Azure Communications Gateway.

For Operator Connect and Teams Phone Mobile:

|**Value**|**Field name(s) in Azure portal**|
|---------|---------|
|A name for the test line.  We recommend names of the form OC1 and OC2 (for Operator Connect) and TPM1 and TPM2 (for Teams Phone Mobile). |**Name**|
|The phone number for the test line, in E.164 format and including the country code. |**Phone Number**|
|The purpose of the test line (always **Automated**).|**Testing purpose**|

For Zoom Phone Cloud Peering:

|**Value**|**Field name(s) in Azure portal**|
|---------|---------|
|The phone number for the test line, in E.164 format and including the country code. |**Phone Number**|

Microsoft Teams Direct Routing and Azure Operator Call Protection Preview don't require service verification numbers.

## Decide if you want tags for Azure resources

Resource naming and tagging is useful for resource management. It enables your organization to locate and keep track of resources associated with specific teams or workloads and also enables you to more accurately track the consumption of cloud resources by business area and team.

If you believe tagging would be useful for your organization, design your naming and tagging conventions following the information in the [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/).

## Next step

> [!div class="nextstepaction"]
> [Deploy an Azure Communications Gateway resource and connect it to your networks](deploy.md)
