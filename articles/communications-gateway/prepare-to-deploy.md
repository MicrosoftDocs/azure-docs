---
title: Prepare to deploy Azure Communications Gateway 
description: Learn how to complete the prerequisite tasks required to deploy Azure Communications Gateway in Azure.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 05/05/2023
---

# Prepare to deploy Azure Communications Gateway

This article guides you through each of the tasks you need to complete before you can start to deploy Azure Communications Gateway. In order to be successfully deployed, the Azure Communications Gateway has dependencies on the state of your Operator Connect or Teams Phone Mobile environments.

The following sections describe the information you need to collect and the decisions you need to make prior to deploying Azure Communications Gateway.

## Prerequisites

You must be a Telecommunications Service Provider who has signed an Operator Connect agreement with Microsoft. For more information, see [Operator Connect](https://cloudpartners.transform.microsoft.com/practices/microsoft-365-for-operators/connect).

You need an onboarding partner for integrating with Microsoft Phone System. If you're not eligible for onboarding to Microsoft Teams through Azure Communications Gateway's [Included Benefits](onboarding.md) or you haven't arranged alternative onboarding with Microsoft through a separate arrangement, you need to arrange an onboarding partner yourself.

You must own globally routable numbers that you can use for testing, as follows.

|Type of testing|Numbers required |
|---------|---------|
|Automated validation testing by Microsoft Teams test suites|Minimum: 6. Recommended: 9 (to run tests simultaneously).|
|Manual test calls made by you and/or Microsoft staff during integration testing |Minimum: 1|

After deployment, the automated validation testing numbers use synthetic traffic to continuously check the health of your deployment.

We strongly recommend that you have a support plan that includes technical support, such as [Microsoft Unified Support](https://www.microsoft.com/en-us/unifiedsupport/overview) or [Premier Support](https://www.microsoft.com/en-us/unifiedsupport/premier).

## 1. Add the Project Synergy application to your Azure tenancy

> [!NOTE]
>This step and the next step ([2. Assign an Admin user to the Project Synergy application](#2-assign-an-admin-user-to-the-project-synergy-application)) set you up as an Operator in the Teams Phone Mobile (TPM) and Operator Connect (OC) environments. If you've already gone through onboarding, go to [3. Create a network design](#3-create-a-network-design).

The Operator Connect and Teams Phone Mobile programs require your Azure Active Directory tenant to contain a Microsoft application called Project Synergy. Operator Connect and Teams Phone Mobile inherit permissions and identities from your Azure Active Directory tenant through the Project Synergy application. The Project Synergy application also allows configuration of Operator Connect or Teams Phone Mobile and assigning users and groups to specific roles.

We recommend that you use an existing Azure Active Directory tenant for Azure Communications Gateway, because using an existing tenant uses your existing identities for fully integrated authentication. However, if you need to manage identities for Operator Connect separately from the rest of your organization, create a new dedicated tenant first.

To add the Project Synergy application:

1. Check whether the Azure Active Directory (`AzureAD`) module is installed in PowerShell. Install it if necessary.
    1. Open PowerShell.
    1. Run the following command and check whether `AzureAD` appears in the output.
       ```azurepowershell
       Get-Module -ListAvailable
       ```
    1. If `AzureAD` doesn't appear in the output, install the module:
        1. Close your current PowerShell window.
        1. Open PowerShell as an admin.
        1. Run the following command.
            ```azurepowershell
            Install-Module AzureAD
            ```
        1. Close your PowerShell admin window.
1. Sign in to the [Azure portal](https://ms.portal.azure.com/) as an Azure Active Directory Global Admin.
1. Select **Azure Active Directory**.
1. Select **Properties**.
1. Scroll down to the Tenant ID field. Your tenant ID is in the box. Make a note of your tenant ID.
1. Open PowerShell.
1. Run the following cmdlet, replacing *`<AADTenantID>`* with the tenant ID you noted down in step 5.
    ```azurepowershell
    Connect-AzureAD -TenantId "<AADTenantID>"
    New-AzureADServicePrincipal -AppId eb63d611-525e-4a31-abd7-0cb33f679599 -DisplayName "Operator Connect"
    ```

## 2. Assign an Admin user to the Project Synergy application

The user who sets up Azure Communications Gateway needs to have the Admin user role in the Project Synergy application.

1. In your Azure portal, navigate to **Enterprise applications** using the left-hand side menu. Alternatively, you can search for it in the search bar; it's under the **Services** subheading.
1. Set the **Application type** filter to **All applications** using the drop-down menu.
1. Select **Apply**.
1. Search for **Project Synergy** using the search bar. The application should appear.
1. Select your **Project Synergy** application.
1. Select **Users and groups** from the left hand side menu.
1. Select **Add user/group**.
1. Specify the user you want to use for setting up Azure Communications Gateway and give them the **Admin** role.

## 3. Create a network design

Ensure your network is set up as shown in the following diagram and has been configured in accordance with the *Network Connectivity Specification* that you've been issued. You must have two Azure Regions with cross-connect functionality. For more information on the reliability design for Azure Communications Gateway, see [Reliability in Azure Communications Gateway](reliability-communications-gateway.md).

For Teams Phone Mobile, you must decide how your network should determine whether a call involves a Teams Phone Mobile subscriber and therefore route the call to Microsoft Phone System. You can:

- Use Azure Communications Gateway's integrated Mobile Control Point (MCP).
- Connect to an on-premises version of Mobile Control Point (MCP) from Metaswitch.
- Use other routing capabilities in your core network.

For more information on these options, see [Call control integration for Teams Phone Mobile](interoperability.md#call-control-integration-for-teams-phone-mobile) and [Mobile Control Point in Azure Communications Gateway](mobile-control-point.md).

To configure MAPS, follow the instructions in [Azure Internet peering for Communications Services walkthrough](../internet-peering/walkthrough-communications-services-partner.md).
    :::image type="content" source="media/azure-communications-gateway-redundancy.png" alt-text="Network diagram of an Azure Communications Gateway that uses MAPS as its peering service between Azure and an operators network.":::

## 4. Collect basic information for deploying an Azure Communications Gateway

 Collect all of the values in the following table for the Azure Communications Gateway resource.

|**Value**|**Field name(s) in Azure portal**|
 |---------|---------|
 |The name of the Azure subscription to use to create an Azure Communications Gateway resource. You must use the same subscription for all resources in your Azure Communications Gateway deployment. |**Project details: Subscription**|
 |The Azure resource group in which to create the Azure Communications Gateway resource. |**Project details: Resource group**|
 |The name for the deployment. This name can contain alphanumeric characters and `-`. It must be 3-24 characters long. |**Instance details: Name**|
 |The management Azure region: the region in which your monitoring and billing data is processed. We recommend that you select a region near or colocated with the two regions for handling call traffic. |**Instance details: Region**
 |The voice codecs to use between Azure Communications Gateway and your network. |**Instance details: Supported Codecs**|
 |The Unified Communications as a Service (UCaaS) platform(s) Azure Communications Gateway should support. These platforms are Teams Phone Mobile and Operator Connect Mobile. |**Instance details: Supported Voice Platforms**|
 |Whether your Azure Communications Gateway resource should handle emergency calls as standard calls or directly route them to the Emergency Services Routing Proxy (US only). |**Instance details: Emergency call handling**|
 |The scope at which Azure Communications Gateway's autogenerated domain name label is unique. Communications Gateway resources get assigned an autogenerated domain name label that depends on the name of the resource. You'll need to register the domain name later when you deploy Azure Communications Gateway. Selecting **Tenant** gives a resource with the same name in the same tenant but a different subscription the same label. Selecting **Subscription** gives a resource with the same name in the same subscription but a different resource group the same label. Selecting **Resource Group** gives a resource with the same name in the same resource group the same label. Selecting **No Re-use** means the label doesn't depend on the name, resource group, subscription or tenant. |**Instance details: Auto-generated Domain Name Scope**|
 |The number used in Teams Phone Mobile to access the Voicemail Interactive Voice Response (IVR) from native dialers.|**Instance details: Teams Voicemail Pilot Number**|
 |A list of dial strings used for emergency calling.|**Instance details: Emergency Dial Strings**|
 | How you plan to use Mobile Control Point (MCP) to route Teams Phone Mobile calls to Microsoft Phone System. Choose from **Integrated** (to deploy MCP in Azure Communications Gateway), **On-premises** (to use an existing on-premises MCP) or **None** (if you don't plan to offer Teams Phone Mobile or you'll use another method to route calls). |**Instance details: MCP**|

## 5. Collect Service Regions configuration values

Collect all of the values in the following table for both service regions in which you want to deploy Azure Communications Gateway.

 |**Value**|**Field name(s) in Azure portal**|
 |---------|---------|
 |The Azure regions to use for call traffic. |**Service Region One/Two: Region**|
 |The IPv4 address used by Azure Communications Gateway to contact your network from this region. |**Service Region One/Two: Operator IP address**|
 |The set of IP addresses/ranges that are permitted as sources for signaling traffic from your network. Provide an IPv4 address range using CIDR notation (for example, 192.0.2.0/24) or an IPv4 address (for example, 192.0.2.0). You can also provide a comma-separated list of IPv4 addresses and/or address ranges.|**Service Region One/Two: Allowed Signaling Source IP Addresses/CIDR Ranges**|
 |The set of IP addresses/ranges that are permitted as sources for media traffic from your network. Provide an IPv4 address range using CIDR notation (for example, 192.0.2.0/24) or an IPv4 address (for example, 192.0.2.0). You can also provide a comma-separated list of IPv4 addresses and/or address ranges.|**Service Region One/Two: Allowed Media Source IP Address/CIDR Ranges**|

## 6. Collect Test Lines configuration values

Collect all of the values in the following table for all the test lines that you want to configure for Azure Communications Gateway.

 |**Value**|**Field name(s) in Azure portal**|
 |---------|---------|
 |The name of the test line. |**Name**|
 |The phone number of the test line, in E.164 format and including the country code. |**Phone Number**|
 |The purpose of the test line: **Manual** (for manual test calls by you and/or Microsoft staff during integration testing) or **Automated** (for automated validation with Microsoft Teams test suites).|**Testing purpose**|

> [!IMPORTANT]
> You must configure at least six automated test lines. We recommend nine automated test lines (to allow simultaneous tests).

## 7. Decide if you want tags

Resource naming and tagging is useful for resource management. It enables your organization to locate and keep track of resources associated with specific teams or workloads and also enables you to more accurately track the consumption of cloud resources by business area and team.

If you believe tagging would be useful for your organization, design your naming and tagging conventions following the information in the [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/).

## 8. Get access to Azure Communications Gateway for your Azure subscription

Access to Azure Communications Gateway is restricted. When you've completed the previous steps in this article, contact your onboarding team and ask them to enable your subscription. If you don't already have an onboarding team, contact azcog-enablement@microsoft.com with your Azure subscription ID and contact details.

Wait for confirmation that Azure Communications Gateway is enabled before moving on to the next step.

## Next steps

- [Create an Azure Communications Gateway resource](deploy.md)