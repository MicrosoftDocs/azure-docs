---
title: Connect Azure Communications Gateway to Operator Connect or Teams Phone Mobile
description:  After deploying Azure Communications Gateway, you can configure it to connect to the Operator Connect and Teams Phone Mobile environments.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: integration
ms.date: 10/09/2023
ms.custom:
    - template-how-to-pattern
    - has-azure-ad-ps-ref
---

# Connect Azure Communications Gateway to Operator Connect or Teams Phone Mobile

After you have deployed Azure Communications Gateway and connected it to your core network, you need to connect it to Microsoft Phone System. You also need to onboard to the Operator Connect or Teams Phone Mobile environments.

This article describes how to set up Azure Communications Gateway for Operator Connect and Teams Phone Mobile. When you have finished the steps in this article, you will be ready to [Prepare for live traffic](prepare-for-live-traffic-operator-connect.md) with Operator Connect, Teams Phone Mobile and Azure Communications Gateway.

> [!TIP]
> This article assumes that your Azure Communications Gateway onboarding team from Microsoft is also onboarding you to Operator Connect and/or Teams Phone Mobile. If you've chosen a different onboarding partner for Operator Connect or Teams Phone Mobile, you need to ask them to arrange changes to the Operator Connect and/or Teams Phone Mobile environments.

## Prerequisites

You must have carried out all the steps in [Deploy Azure Communications Gateway](deploy.md).

You must have access to a user account with the Microsoft Entra Global Administrator role.

## Add the Project Synergy application to your Azure tenancy

> [!NOTE]
>This step and the next step ([Assign an Admin user to the Project Synergy application](#assign-an-admin-user-to-the-project-synergy-application)) set you up as an Operator in the Teams Phone Mobile (TPM) and Operator Connect (OC) environments. If you've already gone through onboarding, go to [Find the Object ID and Application ID for your Azure Communication Gateway resource](#find-the-object-id-and-application-id-for-your-azure-communication-gateway-resource).

The Operator Connect and Teams Phone Mobile programs require your Microsoft Entra tenant to contain a Microsoft application called Project Synergy. Operator Connect and Teams Phone Mobile inherit permissions and identities from your Microsoft Entra tenant through the Project Synergy application. The Project Synergy application also allows configuration of Operator Connect or Teams Phone Mobile and assigning users and groups to specific roles.

To add the Project Synergy application:

1. Check whether the Microsoft Entra ID (`AzureAD`) module is installed in PowerShell. Install it if necessary.
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
1. Sign in to the [Azure portal](https://ms.portal.azure.com/) as a Microsoft Entra Global Admin.
1. Select **Microsoft Entra ID**.
1. Select **Properties**.
1. Scroll down to the Tenant ID field. Your tenant ID is in the box. Make a note of your tenant ID.
1. Open PowerShell.
1. Run the following cmdlet, replacing *`<AADTenantID>`* with the tenant ID you noted down in step 5.
    ```azurepowershell
    Connect-AzureAD -TenantId "<AADTenantID>"
    New-AzureADServicePrincipal -AppId eb63d611-525e-4a31-abd7-0cb33f679599 -DisplayName "Operator Connect"
    ```

## Assign an Admin user to the Project Synergy application

The user who sets up Azure Communications Gateway needs to have the Admin user role in the Project Synergy application. Assign them this role in the Azure portal.

1. In the Azure portal, navigate to **Enterprise applications** using the left-hand side menu. Alternatively, you can search for it in the search bar; it's under the **Services** subheading.
1. Set the **Application type** filter to **All applications** using the drop-down menu.
1. Select **Apply**.
1. Search for **Project Synergy** using the search bar. The application should appear.
1. Select your **Project Synergy** application.
1. Select **Users and groups** from the left hand side menu.
1. Select **Add user/group**.
1. Specify the user you want to use for setting up Azure Communications Gateway and give them the **Admin** role.

## Find the Object ID and Application ID for your Azure Communication Gateway resource

Each Azure Communications Gateway resource automatically receives a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md), which Azure Communications Gateway uses to connect to the Operator Connect environment. You need to find the Object ID and Application ID of the managed identity, so that you can connect Azure Communications Gateway to the Operator Connect or Teams Phone Mobile environment in [Set up application roles for Azure Communications Gateway](#set-up-application-roles-for-azure-communications-gateway) and [Add the Application ID for Azure Communications Gateway to Operator Connect](#add-the-application-id-for-azure-communications-gateway-to-operator-connect).

1. Sign in to the [Azure portal](https://azure.microsoft.com/).
1. In the search bar at the top of the page, search for your Communications Gateway resource.
1. Select your Communications Gateway resource.
1. Select **Identity**.
1. In **System assigned**, copy the **Object (principal) ID**.
1. Search for the value of **Object (principal) ID** with the search bar. You should see an enterprise application with that value under the **Microsoft Entra ID** subheading. You might need to select **Continue searching in Microsoft Entra ID** to find it.
1. Make a note of the **Object (principal) ID**.
1. Select the enterprise application.
1. Check that the **Object ID** matches the **Object (principal) ID** value that you copied.
1. Make a note of the **Application ID**.

## Set up application roles for Azure Communications Gateway

Azure Communications Gateway contains services that need to access the Operator Connect API on your behalf. To enable this access, you must grant specific application roles to the system-assigned managed identity for Azure Communications Gateway under the Project Synergy Enterprise Application. You created the Project Synergy Enterprise Application in [Add the Project Synergy application to your Azure tenancy](#add-the-project-synergy-application-to-your-azure-tenancy).

> [!IMPORTANT]
> Granting permissions has two parts: configuring the system-assigned managed identity for Azure Communications Gateway with the appropriate roles (this step) and adding the application ID of the managed identity to the Operator Connect or Teams Phone Mobile environment. You'll add the application ID to the Operator Connect or Teams Phone Mobile environment later, in [Add the Application ID for Azure Communications Gateway to Operator Connect](#add-the-application-id-for-azure-communications-gateway-to-operator-connect).

Do the following steps in the tenant that contains your Project Synergy application.

1. Check whether the Microsoft Entra ID (`AzureAD`) module is installed in PowerShell. Install it if necessary.
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
1. Sign in to the [Azure portal](https://ms.portal.azure.com/) as a Microsoft Entra Global Administrator.
1. Select **Microsoft Entra ID**.
1. Select **Properties**.
1. Scroll down to the Tenant ID field. Your tenant ID is in the box. Make a note of your tenant ID.
1. Open PowerShell.
1. Run the following cmdlet, replacing *`<AADTenantID>`* with the tenant ID you noted down in step 5.
    ```azurepowershell
    Connect-AzureAD -TenantId "<AADTenantID>"
    ```
1. Run the following cmdlet, replacing *`<CommunicationsGatewayObjectID>`* with the Object ID you noted down in [Find the Object ID and Application ID for your Azure Communication Gateway resource](#find-the-object-id-and-application-id-for-your-azure-communication-gateway-resource).
    ```azurepowershell
    $commGwayObjectId = "<CommunicationsGatewayObjectID>"
    ```
1. Run the following PowerShell commands. These commands add the following roles for Azure Communications Gateway: `TrunkManagement.Read`, `TrunkManagement.Write`, `partnerSettings.Read`, `NumberManagement.Read`, `NumberManagement.Write`, `Data.Read`, `Data.Write`.
    ```azurepowershell
    # Get the Service Principal ID for Project Synergy (Operator Connect)
    $projectSynergyApplicationId = "eb63d611-525e-4a31-abd7-0cb33f679599"
    $projectSynergyEnterpriseApplication = Get-AzureADServicePrincipal -Filter "AppId eq '$projectSynergyApplicationId'"
    $projectSynergyObjectId = $projectSynergyEnterpriseApplication.ObjectId
    
    # Required Operator Connect - Project Synergy Roles
    $trunkManagementRead = "72129ccd-8886-42db-a63c-2647b61635c1"
    $trunkManagementWrite = "e907ba07-8ad0-40be-8d72-c18a0b3c156b"
    $partnerSettingsRead = "d6b0de4a-aab5-4261-be1b-0e1800746fb2"
    $numberManagementRead = "130ecbe2-d1e6-4bbd-9a8d-9a7a909b876e"
    $numberManagementWrite = "752b4e79-4b85-4e33-a6ef-5949f0d7d553"
    $dataRead = "eb63d611-525e-4a31-abd7-0cb33f679599"
    $dataWrite = "98d32f93-eaa7-4657-b443-090c23e69f27"
    
    $requiredRoles = $trunkManagementRead, $trunkManagementWrite, $partnerSettingsRead, $numberManagementRead, $numberManagementWrite, $dataRead, $dataWrite
    
    foreach ($role in $requiredRoles) {
        # Assign the relevant Role to the managed identity for the Azure Communications Gateway resource
        New-AzureADServiceAppRoleAssignment -ObjectId $commGwayObjectId -PrincipalId $commGwayObjectId -ResourceId $projectSynergyObjectId -Id $role
    }
    
    ```

## Provide additional information to your onboarding team

> [!NOTE]
>This step is required to set you up as an Operator in the Teams Phone Mobile (TPM) and Operator Connect (OC) environments. Skip this step if you have already onboarded to TPM or OC.

Before your onboarding team can finish onboarding you to the Operator Connect and/or Teams Phone Mobile environments, you need to provide them with some additional information.

1. Wait for your onboarding team to provide you with a form to collect the additional information. 
1. Complete the form and give it to your onboarding team.
1. Wait for your onboarding team to confirm that the onboarding process is complete.

If you don't already have an onboarding team, contact azcog-enablement@microsoft.com, providing your Azure subscription ID and contact details.

## Test your Operator Connect portal access

> [!IMPORTANT]
> Before testing your Operator Connect portal access, wait for your onboarding team to confirm that the onboarding process is complete.

Go to the [Operator Connect homepage](https://operatorconnect.microsoft.com/) and check that you're able to sign in.

## Add the Application ID for Azure Communications Gateway to Operator Connect

You must enable the Azure Communications Gateway application within the Operator Connect or Teams Phone Mobile environment. Enabling the application allows Azure Communications Gateway to use the roles that you set up in [Set up application roles for Azure Communications Gateway](#set-up-application-roles-for-azure-communications-gateway).

To enable the application, add the Application ID of the system-assigned managed identity representing Azure Communications Gateway to your Operator Connect or Teams Phone Mobile environment. You found this ID in [Find the Object ID and Application ID for your Azure Communication Gateway resource](#find-the-object-id-and-application-id-for-your-azure-communication-gateway-resource).

1. Log into the [Operator Connect portal](https://operatorconnect.microsoft.com/operator/configuration).
1. Add a new **Application Id**, using the Application ID that you found.

## Register your deployment's domain name in Microsoft Entra

Microsoft Teams only sends traffic to domains that you've confirmed that you own. Your Azure Communications Gateway deployment automatically receives an autogenerated fully qualified domain name (FQDN). You need to add this domain name to your Microsoft Entra tenant as a custom domain name, share the details with your onboarding team and then verify the domain name. This process confirms that you own the domain.

1. Navigate to the **Overview** of your Azure Communications Gateway resource and select **Properties**. Find the field named **Domain**. This name is your deployment's domain name.
1. Complete the following procedure: [Add your custom domain name to Microsoft Entra ID](../active-directory/fundamentals/add-custom-domain.md#add-your-custom-domain-name).
1. Share your DNS TXT record information with your onboarding team. Wait for your onboarding team to confirm that the DNS TXT record has been configured correctly.
1. Complete the following procedure: [Verify your custom domain name](../active-directory/fundamentals/add-custom-domain.md#verify-your-custom-domain-name).

## Next step

> [!div class="nextstepaction"]
> [Prepare for live traffic with Operator Connect and Teams Phone Mobile](prepare-for-live-traffic-operator-connect.md)
