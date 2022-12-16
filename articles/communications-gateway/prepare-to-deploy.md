---
title: Prepare to deploy Azure Communications Gateway 
description: Learn how to complete the prerequisite tasks required to deploy Azure Communications Gateway in Azure.
author: AtiqKhan-Docs
ms.author: khanatiq
ms.service: communications-gateway
ms.topic: how-to 
ms.date: 15/12/2022
---

# Prepare to deploy Azure Communications Gateway

This article will guide you through each of the tasks you need to complete before you can deploy Azure Communications Gateway. In order to be successfully deployed, the Azure Communications Gateway has dependencies on the state of your Operator Connect or Teams Phone Mobile environments.
The following sections describe the information you'll need to collect and the decisions you'll need to make prior to deploying Azure Communications Gateway.

## Prerequisites

You must have signed an Operator Connect agreement with Microsoft. For more information, see [Operator Connect](https://cloudpartners.transform.microsoft.com/practices/microsoft-365-for-operators/connect).

You must ensure you've got two or more numbers that you own and that are globally routable. You will need to use these numbers as test lines:

- **Manual** test lines will be used by Microsoft staff to make test calls during integration testing.
- **Automated** test lines will be assigned to Teams test suites for validation testing.

We strongly recommend that all operators have a support plan that includes technical support, such as a **Microsoft Unified** or **Premier** support plan. For more information, see [Compare support plans](https://azure.microsoft.com/support/plans/).

## 1. Configure Azure Active Directory in your operator Azure tenancy

>[NOTE!]
>This step is required to set you up as an Operator in the Teams Phone Mobile (TPM) and Operator Connect (OC) environments. Skip this step if you have already started onboarding for Teams Phone Mobile and Operator Connect.

Operator Connect and Teams Phone Mobile inherit permissions and identities from the Azure Active Directory within the Azure tenant where the Project Synergy app is configured. Performing this step within an existing Azure tenant uses your existing identities for fully integrated authentication and is recommended. However, if you need to manage identities for Operator Connect or Teams Phone Mobile separately from the rest of your organization the following steps should be completed in a new dedicated tenant.

1. Sign in to the [Azure portal](https://ms.portal.azure.com/) as an Azure Active Directory Global Admin.
1. Select **Azure Active Directory**.
1. Select **Properties**.
1. Scroll down to the Tenant ID field. Your tenant ID will be in the box. Make a note of your tenant ID.
1. Open PowerShell.
1. (If you don't have the Azure Active Directory module installed), run the cmdlet:

```azurepowershell-interactive
Install-Module Azure AD
```

1. Run the following cmdlet, replacing *`<AADTenantID>`* with the tenant ID you noted down in step 4.

```azurepowershell-interactive
Connect-AzureAD -TenantId "<AADTenantID>"
New-AzureADServicePrincipal -AppId eb63d611-525e-4a31-abd7-0cb33f679599 -DisplayName "Operator Connect"
```

## 2. Allow the Project Synergy application

1. Sig in to your Azure portal and navigate to **Enterprise applications** using the left-hand side menu.
1. Set the **Application type** filter to **All applications** using the drop-down menu.
1. Select **Apply**.
1. Search for **Project Synergy** using the search bar. The application should appear.
1. Select your **Project Synergy** application.
1. Select **Users and groups** from the left hand side menu.
1. Select **Add user/group**.
1. Specify the user you want to use for setting up Azure Communications Gateway and assign them the **Admin** role.

## 3. Create an app ID for Azure Communications Gateway

> [!WARNING]
> TODO

## 4. Create a network design

Ensure your network is set up as shown in the following diagram and has been configured in accordance with the *Network Connectivity Specification* you've been issued. You're required to have two Azure Regions with cross-connect functionality.

To configure MAPS, follow the instructions in [Azure Internet peering for Communications Services walkthrough](/azure/internet-peering/walkthrough-Communicationss-services-partner).

:::image type="content" source="media/azure-communications-gateway-redundancy.png" alt-text="Network diagram for an Azure Communications Gateway that uses MAPS as its peering service between Azure and an operators network.":::

## 5. Collect basic information for deploying an Azure Communications Gateway

 Collect all of the values in the following table for the Azure Communications Gateway resource.

|**Value**|**Field name(s) in Azure portal**|
 |---------|---------|
 |The Azure subscription to use to create an Azure Communications Gateway resource. You must use the same subscription for all resources in your Azure Communications Gateway deployment. |**Project details: Subscription**|
 |The Azure resource group in which to create the Azure Communications Gateway resource. |**Project details: Resource group**|
 |The name for the deployment. |**Instance details: Name**|
 |This is the region in which your monitoring and billing data is processed. We recommend that you select a region near or co-located with the two regions that will be used for handling call traffic". |**Instance details: Region**
 |The voice codecs the Azure Communications Gateway will be able to support when communicating with your network. |**Project details: Supported Codecs**|
 |The Unified Communications as a Service (UCaaS) platform Azure Communications Gateway will support. These platforms are Teams Phone Mobile and Operator Connect Mobile. |**Project details: Supported Voice Platforms**|
 |Whether your Azure Communications Gateway resource should handle emergency calls as standard calls or directly route them to the Emergency Services Routing Proxy (ESRP). |**Project details: Emergency call handling**|

## 6. Collect Service Regions configuration values

Collect all of the values in the following table for both service regions in which Azure Communications Gateway will run.

 |**Value**|**Field name(s) in Azure portal**|
 |---------|---------|
 |The Azure regions that will handle call traffic. |**Service Region One: Region** and **Service Region Two: Region**|
 |The IPv4 address used by Microsoft Teams to contact your network from this region. |**Service Region One: Operator IP address** and **Service Region Two: Operator IP address**|

## 7. Decide if you want tags

Resource naming and tagging is useful for resource management. It enables your organization to locate and keep track of resources associated with specific teams or workloads and also enables you to more accurately track the consumption of cloud resources by business area and team.

If you believe tagging would be useful for your organization, design your naming and tagging conventions following the information in the [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/).

## Next steps

1. [Create an Azure Communications Gateway resource](deploy.md)
