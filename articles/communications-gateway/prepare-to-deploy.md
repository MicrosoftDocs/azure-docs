---
title: Prepare to deploy Azure Communications Gateway 
description: Learn how to complete the prerequisite tasks required to deploy Azure Communications Gateway in Azure.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to 
ms.date: 01/10/2022
---

# Prepare to deploy Azure Communications Gateway

This article guides you through each of the tasks you need to complete before you can start to deploy Azure Communications Gateway. In order to be successfully deployed, the Azure Communications Gateway has dependencies on the state of your Operator Connect or Teams Phone Mobile environments.
The following sections describe the information you need to collect and the decisions you need to make prior to deploying Azure Communications Gateway.

## Prerequisites

You must have signed an Operator Connect agreement with Microsoft. For more information, see [Operator Connect](https://cloudpartners.transform.microsoft.com/practices/microsoft-365-for-operators/connect).

You need an onboarding partner for integrating with Microsoft Phone System. If you're not eligible for onboarding to Microsoft Teams through Azure Communications Gateway's [Basic Integration Included Benefit](onboarding.md) or you haven't arranged alternative onboarding with Microsoft through a separate arrangement, you need to arrange an onboarding partner yourself.

You must ensure you've got two or more numbers that you own which are globally routable. Your onboarding team needs these numbers to configure test lines.

We strongly recommend that you have a support plan that includes technical support, such as [Microsoft Unified Support](https://www.microsoft.com/en-us/unifiedsupport/overview) or [Premier Support](https://www.microsoft.com/en-us/unifiedsupport/premier).

## 1. Add the Project Synergy application to your Azure tenancy

> [!NOTE]
>This step is required to set you up as an Operator in the Teams Phone Mobile (TPM) and Operator Connect (OC) environments. Skip steps 1 and 2 if you have already onboarded to TPM or OC.

The Operator Connect and Teams Phone Mobile programs require your Azure Active Directory tenant to contain a Microsoft application called Project Synergy. Operator Connect and Teams Phone Mobile inherit permissions and identities from your Azure Active Directory tenant through the Project Synergy application. The Project Synergy application also allows configuration of Operator Connect or Teams Phone Mobile and assigning users and groups to specific roles.

We recommend that you use an existing Azure Active Directory tenant for Azure Communications Gateway, because using an existing tenant uses your existing identities for fully integrated authentication. However, if you need to manage identities for Operator Connect separately from the rest of your organization, create a new dedicated tenant first.

To add the Project Synergy application:

1. Sign in to the [Azure portal](https://ms.portal.azure.com/) as an Azure Active Directory Global Admin.
1. Select **Azure Active Directory**.
1. Select **Properties**.
1. Scroll down to the Tenant ID field. Your tenant ID is in the box. Make a note of your tenant ID.
1. Open PowerShell.
1. (If you don't have the Azure Active Directory module installed), run the cmdlet:
    ```azurepowershell
    Install-Module Azure AD
    ```
1. Run the following cmdlet, replacing *`<AADTenantID>`* with the tenant ID you noted down in step 4.
    ```azurepowershell
    Connect-AzureAD -TenantId "<AADTenantID>"
    New-AzureADServicePrincipal -AppId eb63d611-525e-4a31-abd7-0cb33f679599 -DisplayName "Operator Connect"
    ```

## 2. Assign an Admin user to the Project Synergy application

The user who sets up Azure Communications Gateway needs to have the Admin user role in the Project Synergy application.

1. In your Azure portal, navigate to **Enterprise applications** using the left-hand side menu. Alternatively, you can search for it in the search bar, it will appear under the **Services** subheading.
1. Set the **Application type** filter to **All applications** using the drop-down menu.
1. Select **Apply**.
1. Search for **Project Synergy** using the search bar. The application should appear.
1. Select your **Project Synergy** application.
1. Select **Users and groups** from the left hand side menu.
1. Select **Add user/group**.
1. Specify the user you want to use for setting up Azure Communications Gateway and give them the **Admin** role.

## 3. Create an App registration to provide Azure Communications Gateway access to the Operator Connect API

You must create an App registration to enable Azure Communications Gateway to function correctly. The App registration provides Azure Communications Gateway with access to the Operator Connect API on your behalf. The App registration **must** be created in **your** tenant.

### 3.1 Create an App registration

Use the following steps to create an App registration for Azure Communications Gateway:

1. Navigate to **App registrations** in the Azure portal (select **Azure Active Directory** and then in the left-hand menu, select **App registrations**). Alternatively, you can search for it with the search bar: it will appear under the **Services** subheading.
1. Select **New registration**.
1. Enter an appropriate **Name**. For example: **Azure Communications Gateway service**.
1. Don't change any settings (leaving everything as default). This means:
    - **Supported account types** should be set as **Accounts in this organizational directory only**.
    - Leave the **Redirect URI** and **Service Tree ID** empty.
1. Select **Register**.

### 3.2 Configure permissions

For the App registration that you created in [3.1 Create an App registration](#31-create-an-app-registration):

1. Navigate to **App registrations** in the Azure portal (select **Azure Active Directory** and then in the left-hand menu, select **App registrations**). Alternatively, you can search for it with the search bar: it will appear under the **Services** subheading.
1. Select the App registration.
1. Select **API permissions**.
1. Select **Add a permission**.
1. Select **APIs my organization uses**.
1. Enter **Project Synergy** in the filter box.
1. Select **Project Synergy**.
1. Select/deselect checkboxes until only the required permissions are selected. The required permissions are:
    - Data.Write
    - Data.Read
    - NumberManagement.Read
    - TrunkManagement.Read
1. Select **Add permissions**.
1. Select **Grant admin consent** for ***\<YourTenantName\>***.
1. Select **Yes** to confirm.


### 3.3 Add the application ID to the Operator Connect Portal

You must add the application ID to your Operator Connect environment. This step allows Azure Communications Gateway to use the Operator Connect API.

1. Navigate to **App registrations** in the Azure portal (select **Azure Active Directory** and then in the left-hand menu, select **App registrations**). Alternatively, you can search for it with the search bar: it will appear under the **Services** subheading.
1. Copy the **Application (client) ID** from the Overview page of your new App registration.
1. Log into the [Operator Connect Number Management Portal](https://operatorconnect.microsoft.com/operator/configuration) and add a new **Application Id**, pasting in the value you copied.

## 4. Create and store secrets 

You must create an Azure secret and allow the App registration to access this secret. This integration allows Azure Communications Gateway to access the Operator Connect API.

This step guides you through creating a Key Vault to store a secret for the App registration, creating the secret and allowing the App registration to use the secret.

### 4.1 Create a Key Vault

The App registration you created in [3. Create an App registration to provide Azure Communications Gateway access to the Operator Connect API](#3-create-an-app-registration-to-provide-azure-communications-gateway-access-to-the-operator-connect-api) requires a dedicated Key Vault. The Key Vault is used to store the secret name and secret value (created in the next steps) for the App registration.

1. Create a Key Vault. Follow the steps in [Create a Vault](../key-vault/general/quick-create-portal.md).
1. Provide your onboarding team with the ResourceID and the Vault URI of your Key Vault.
1. Your onboarding team will use the ResourceID to request a Private-Endpoint. That request triggers two approval requests to appear in the Key Vault.
1. Approve these requests.

### 4.2 Create a secret

You must create a secret for the App registration while preparing to deploy Azure Communications Gateway and then regularly rotate this secret. 

We recommend you rotate your secrets at least every 70 days for security. For instructions on how to rotate secrets, see [Rotate your Azure Communications Gateway secrets](rotate-secrets.md) 

1. Navigate to **App registrations** in the Azure portal (select **Azure Active Directory** and then in the left-hand menu, select **App registrations**). Alternatively, you can search for it with the search bar: it will appear under the **Services** subheading.
1. Select **Certificates & secrets**.
1. Select **New client secret**.
1. Enter a name for the secret (we suggest that the name should include the date at which the secret is being created).
1. Copy or note down the value of the new secret (you won't be able to retrieve it later).


### 4.3 Grant Admin Consent to Azure Communications Gateway

To enable the Azure Communications Gateway service to access the Key Vault, you must grant Admin Consent to the App registration.

1. Request the Admin Consent URL from your onboarding team.
1. Follow the link. A pop-up window displays the **Application Name** of the Registered Application. Note down this name.

### 4.4 Grant your application Key Vault Access

This step must be performed on your tenant. It gives Azure Communications Gateway the ability to read the Operator Connect secrets from your tenant.

1. Navigate to the Key Vault in the Azure portal. If you can't locate it, search for Key Vault in the search bar, select **Key vaults** from the results, and select your Key Vault.
1. Select **Access Policies** on the left hand side menu.
1. Select **Create**.
1. Select **Get** from the secret permissions column.
1. Select **Next**.
1. Search for the Application Name of the Registered Application created by the Admin Consent process (which you noted down in the previous step), and select the name.
1. Select **Next**.
1. Select **Next** again to skip the **Application** tab.
1. Select **Create**.

## 5. Create a network design

Ensure your network is set up as shown in the following diagram and has been configured in accordance with the *Network Connectivity Specification* that you've been issued. You must have two Azure Regions with cross-connect functionality. For more information on the reliability design for Azure Communications Gateway, see [Reliability in Azure Communications Gateway](reliability-communications-gateway.md).

To configure MAPS, follow the instructions in [Azure Internet peering for Communications Services walkthrough](../internet-peering/walkthrough-communications-services-partner.md).
    :::image type="content" source="media/azure-communications-gateway-redundancy.png" alt-text="Network diagram of an Azure Communications Gateway that uses MAPS as its peering service between Azure and an operators network.":::

## 6. Collect basic information for deploying an Azure Communications Gateway

 Collect all of the values in the following table for the Azure Communications Gateway resource.

|**Value**|**Field name(s) in Azure portal**|
 |---------|---------|
 |The name of the Azure subscription to use to create an Azure Communications Gateway resource. You must use the same subscription for all resources in your Azure Communications Gateway deployment. |**Project details: Subscription**|
 |The Azure resource group in which to create the Azure Communications Gateway resource. |**Project details: Resource group**|
 |The name for the deployment. This name can contain alphanumeric characters and `-`. It must be 3-24 characters long. |**Instance details: Name**|
 |The management Azure region: the region in which your monitoring and billing data is processed. We recommend that you select a region near or co-located with the two regions for handling call traffic. |**Instance details: Region**
 |The voice codecs to use between Azure Communications Gateway and your network. |**Instance details: Supported Codecs**|
 |The Unified Communications as a Service (UCaaS) platform(s) Azure Communications Gateway should support. These platforms are Teams Phone Mobile and Operator Connect Mobile. |**Instance details: Supported Voice Platforms**|
 |Whether your Azure Communications Gateway resource should handle emergency calls as standard calls or directly route them to the Emergency Services Routing Proxy (US only). |**Instance details: Emergency call handling**|
 |The scope at which Azure Communications Gateway's autogenerated domain name label is unique. Communications Gateway resources get assigned an autogenerated domain name label that depends on the name of the resource. You'll need to register the domain name later when you deploy Azure Communications Gateway. Selecting **Tenant** will give a resource with the same name in the same tenant but a different subscription the same label. Selecting **Subscription** will give a resource with the same name in the same subscription but a different resource group the same label. Selecting **Resource Group** will give a resource with the same name in the same resource group the same label. Selecting **No Re-use** means the label doesn't depend on the name, resource group, subscription or tenant. |**Instance details: Auto-generated Domain Name Scope**|
 |The number used in Teams Phone Mobile to access the Voicemail Interactive Voice Response (IVR) from native dialers.|**Instance details: Teams Voicemail Pilot Number**|
 |A list of dial strings used for emergency calling.|**Instance details: Emergency Dial Strings**|
 |Whether an on-premises Mobile Control Point is in use.|**Instance details: Enable on-premises MCP functionality**|



## 7. Collect Service Regions configuration values

Collect all of the values in the following table for both service regions in which you want to deploy Azure Communications Gateway.

 |**Value**|**Field name(s) in Azure portal**|
 |---------|---------|
 |The Azure regions that will handle call traffic. |**Service Region One/Two: Region**|
 |The IPv4 address used by Microsoft Teams to contact your network from this region. |**Service Region One/Two: Operator IP address**|
 |The set of IP addresses/ranges that are permitted as sources for signaling traffic from your network. Provide an IPv4 address range using CIDR notation (for example, 192.0.2.0/24) or an IPv4 address (for example, 192.0.2.0). You can also provide a comma-separated list of IPv4 addresses and/or address ranges.|**Service Region One/Two: Allowed Signaling Source IP Addresses/CIDR Ranges**|
 |The set of IP addresses/ranges that are permitted as sources for media traffic from your network. Provide an IPv4 address range using CIDR notation (for example, 192.0.2.0/24) or an IPv4 address (for example, 192.0.2.0). You can also provide a comma-separated list of IPv4 addresses and/or address ranges.|**Service Region One/Two: Allowed Media Source IP Address/CIDR Ranges**|

## 8. Collect Test Lines configuration values

Collect all of the values in the following table for all test lines you want to configure for Azure Communications Gateway. You must configure at least one test line.

 |**Value**|**Field name(s) in Azure portal**|
 |---------|---------|
 |The name of the test line. |**Name**|
 |The phone number of the test line. |**Phone Number**|
 |Whether the test line is manual or automated: **Manual** test lines will be used by you and Microsoft staff to make test calls during integration testing. **Automated** test lines will be assigned to Microsoft Teams test suites for validation testing. |**Testing purpose**|

## 9. Decide if you want tags

Resource naming and tagging is useful for resource management. It enables your organization to locate and keep track of resources associated with specific teams or workloads and also enables you to more accurately track the consumption of cloud resources by business area and team.

If you believe tagging would be useful for your organization, design your naming and tagging conventions following the information in the [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/).

## 10. Get access to Azure Communications Gateway for your Azure subscription

Access to Azure Communications Gateway is restricted. When you've completed the other steps in this article, contact your onboarding team and ask them to enable your subscription. If you don't already have an onboarding team, contact azcog-enablement@microsoft.com with your Azure subscription ID and contact details.

## Next steps

- [Create an Azure Communications Gateway resource](deploy.md)