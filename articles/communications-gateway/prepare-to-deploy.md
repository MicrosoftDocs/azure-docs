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

You must ensure you've two or more numbers that you own which are globally routable. Your onboarding team will require these numbers to configure test lines. 
- **Manual** test lines will be used by Microsoft staff to make test calls during integration testing.
- **Automated** test lines will be assigned to Teams test suites for validation testing.

We strongly recommend that all operators have a support plan that includes technical support, such as a **Microsoft Unified** or **Premier** support plan. For more information, see [Compare support plans](https://azure.microsoft.com/support/plans/). 

## 1. Configure Azure Active Directory in Operator Azure tenancy
>[NOTE!]
>This step is required to setup you as an Operator in the Teams Phone Mobile (TPM) and Operator Connect (OC) environments, skip this step if you have already onboarded to TPM or OC.

Operator Connect and Teams Phone Mobile inherit permissions and identities from the Azure Active Directory within the Azure tenant where the Project Synergy app is configured. As such, performing this step within an existing Azure tenant uses your existing identities for fully integrated authentication and is recommended. However, should you need to manage identities for Operator Connect separately from the rest of your organization the following steps should be completed in a new dedicated tenant.

1. Sign in to the [Azure portal](https://ms.portal.azure.com/) as an Azure Active Directory Global Admin.
1. Select **Azure Active Directory**.
1. Select **Properties**.
1. Scroll down to the Tenant ID field. Your tenant ID will be in the box. Make a note of your tenant ID.
1. Open PowerShell.
1. (If you don't have the Azure Active Directory module installed), run the cmdlet:
```azurepowershell-interactive
Install-Module Azure AD
```
7. Run the following cmdlet, replacing *`<AADTenantID>`* with the tenant ID you noted down in step 4.
```azurepowershell-interactive
Connect-AzureAD -TenantId "<AADTenantID>"
New-AzureADServicePrincipal -AppId eb63d611-525e-4a31-abd7-0cb33f679599 -DisplayName “Operator Connect”
```

## 2. Allow the Project Synergy application
Project Synergy is required to assign users and groups to app-roles for your application. 
1. In your Azure portal, navigate to **Enterprise applications** using the left-hand side menu. Alternatively, you can search for it in the search bar, it will appear under the **Services** subheading. 
1. Set the **Application type** filter to **All applications** using the drop-down menu. 
1. Select **Apply**.
1. Search for **Project Synergy** using the search bar. The application should appear. 
1. Select your **Project Synergy** application.
1. Select **Users and groups** from the left hand side menu. 
1. Select **Add user/group**.
1. Specify the user you want to use for setting up Azure Communications Gateway and assign them the **Admin** role. 

## 3. Create App registrations to provide Azure Communications Gateway access to the Operator Connect API

App registrations are required for Billing Service and Call Duration Uploader (CDU) systems to function correctly. They provide these systems with access to the Operator Connect API and only need to be created once for each application. App registrations **must** be created in **your** tenant. 

We recommend you create individual App registrations for:
- Billing Service
- Call Duration Uploader - note that if you have multiple CDUs in a deployment, you can either create a single App registration for all of your CDU instances or create unique App registrations for each CDU instance. 

### 3.1 Create an App registration
Use the following Steps to create two App registrations, one for the Billing Service and one for Call Duration Uploader:
1. Navigate to **App registrations** in the Azure portal (select **Azure Active Directory** and then in the left-hand menu, select **App registrations**). Alternatively, you can search for it in the search bar, it will appear under the **Services** subheading. 
2. Select **New registration**.
3. Enter an appropriate **Name**. For example: **Call Duration** or **Billing Service**.
4. Don't change any settings, leave everything as default. This means:
    - **Supported account types** should be set as **Accounts in this organizational directory only**.
    - Leave the **Redirect URI** and **Service Tree ID** empty.
5. Select **Register**.

You should now have two App registrations named **Call Duration** and **Billing Service**.

### 3.2 Configure permissions

For each App registration that you've created:
1. Navigate to **App registrations** in the Azure portal (select **Azure Active Directory** and then in the left-hand menu, select **App registrations**). Alternatively, you can search for it in the search bar, it will appear under the **Services** subheading. 
1. Select the App registration.
1. Select **API permissions**.
1. Select **Add a permission**.
1. Select **APIs my organization uses**.
1. Enter **Project Synergy** in the filter box.
1. Select **Project Synergy**.
1. Select/deselect checkboxes until only the required permissions are selected. The required permissions are:
    - Call Duration: Data.Write
    - Billing Service: Data.Read, NumberManagement.Read, TrunkManagement.Read
1. Select **Add permissions**.
1. Select **Grant admin consent** for **<your_tenant_name>**.
1. Select **Yes** to confirm.

### 3.3 Add the application ID to the Operator Connect Portal
This step is required to prevent 403 responses when you try to use the REST API with this client-id/client-secret. For each App registration you created:
1. Navigate to **App registrations** in the Azure portal (select **Azure Active Directory** and then in the left-hand menu, select **App registrations**). Alternatively, you can search for it in the search bar, it will appear under the **Services** subheading. 
1. Copy the **Application (client) ID** from the Overview page of your new App registration.
1. Log into the [Operator Connect Number Management Portal](https://operatorconnect.microsoft.com/operator/configuration) and add a new **Application Id**, pasting in the value you copied.

## 4. Create and store Secrets

### 4.1 Create a Key Vault
Each App registration you created in step 3 requires a dedicated Key Vault (that is, one for the Billing Service and another for the Call Duration Uploader). The Key Vault is used to store the ClientID and Secret (created in the next steps) for each of the App registrations previously created. For each App registration:
1. Create a Key Vault. Follow the steps in [Create a Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/quick-create-portal#create-a-vault).
1. Contact your onboarding team, tell them the ResourceID of your Key Vault.
1. Your onboarding team will use the ResourceID to request a Private-Endpoint. That request triggers an approval request to appear in the Key Vault. You must approve this request.

### 4.2 Create Secrets
You must create a Secret for each App registration whilst preparing to deploy Azure Communication Gateway and then regularly rotate these secrets (for more information, see <placeholder>). A Secret will expire in 70 days or earlier. For each of your App registrations:
1. Navigate to **App registrations** in the Azure portal (select **Azure Active Directory** and then in the left-hand menu, select **App registrations**). Alternatively, you can search for it in the search bar, it will appear under the **Services** subheading. 
1. Select **Certificates & secrets**.
1. Select **New client secret**. 
1. Enter a Name for the secret (we suggest that the name should include the date at which the Secret is being created).
1. Copy or note down the Value of the new secret (you won't be able to retrieve it later).

### 4.3 Grant your Admin Consent
To enable the Billing Service and Call Duration Uploader to access the Key Vaults, you must grant admin consent to our 1P App registration. For each of your App registrations:
1. Request the Admin Consent URL from your onboarding team.
1. Follow the link, a pop-up window will appear which contains the **Application Name**. Note down this name. 

### 4.4 Grant your application Key Vault Access
This step must be performed on your Operator Tenant. It will give the Application the ability to read the Operator Connect secrets, and make the Cross-Tenant authentication hop. For each of your Key Vaults:
1. Navigate to the Key Vault in the Azure portal. If you can't locate it, search for Key Vault in the search bar, it will appear under the **Services** subheading. 
1. Select **Access Policies** on the left hand side menu. 
1. Select **Create**.
1. Select **Get** from the Secret permissions column.
1. Select **Next**.
1. Search for the Application Name (which you noted down in the previous step) of the Registered Application, and select the name.
1. Select **Next**.
1. Select **Next** again to skip the **Application** tab.
1. Select **Create**.


## 5. Create a network design

Ensure your network is set up as shown in the following diagram and has been configured in accordance with the *Network Connectivity Specification* you've been issued. You're required to have two Azure Regions with cross-connect functionality. 

To configure MAPS, follow the instructions in [Azure Internet peering for Communications Services walkthrough](/azure/internet-peering/walkthrough-Communicationss-services-partner).
    :::image type="content" source="media/prepare-to-deploy/redundancy.png" alt-text="Network diagram of an Azure Communications Gateway that uses MAPS as its peering service between Azure and an operators network.":::

## 6. Collect basic information for deploying an Azure Communications Gateway

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

## 7. Collect Service Regions configuration values

Collect all of the values in the following table for both service regions in which Azure Communications Gateway will run.

 |**Value**|**Field name(s) in Azure portal**|
 |---------|---------|
 |The Azure regions that will handle call traffic. |**Service Region One: Region** and **Service Region Two: Region**|
 |The IPv4 address used by Microsoft Teams to contact your network from this region. |**Service Region One: Operator IP address** and **Service Region Two: Operator IP address**|

## 8. Decide if you want tags
Resource naming and tagging is useful for resource management. It enables your organization to locate and keep track of resources associated with specific teams or workloads and also enables you to more accurately track the consumption of cloud resources by business area and team. 

If you believe tagging would be useful for your organization, design your naming and tagging conventions following the information in the [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/).

## Next steps

1. [Create an Azure Communications Gateway resource](deploy.md)
