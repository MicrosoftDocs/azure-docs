---
title: Deploy Azure Communications Gateway 
description: This article guides you through how to deploy an Azure Communications Gateway.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to 
ms.date: 05/05/2023
---

# Deploy Azure Communications Gateway

This article guides you through creating an Azure Communications Gateway resource in Azure. You must configure this resource before you can deploy Azure Communications Gateway.

## Prerequisites

Carry out the steps detailed in [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md).

## 1. Start creating the Azure Communications Gateway resource

In this step, you'll create the Azure Communications Gateway resource.

1. Sign in to the [Azure portal](https://azure.microsoft.com/).
1. In the search bar at the top of the page, search for Communications Gateway and select **Communications Gateways**.  

    :::image type="content" source="media/deploy/search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for Azure Communications Gateway.":::

1. Select the **Create** option.

    :::image type="content" source="media/deploy/create.png" alt-text="Screenshot of the Azure portal. Shows the existing Azure Communications Gateway. A Create button allows you to create more Azure Communications Gateways.":::

1. Use the information you collected in [Collect Azure Communications Gateway resource values](prepare-to-deploy.md#4-collect-basic-information-for-deploying-an-azure-communications-gateway) to fill out the fields in the **Basics** configuration section and then select **Next: Service Regions**.

    :::image type="content" source="media/deploy/basics.png" alt-text="Screenshot of the Create an Azure Communications Gateway portal, showing the Basics section.":::

1. Use the information you collected in [Collect Service Regions configuration values](prepare-to-deploy.md#5-collect-service-regions-configuration-values) to fill out the fields in the **Service Regions** section and then select **Next: Tags**.
1. (Optional) Configure tags for your Azure Communications Gateway resource: enter a **Name** and **Value** for each tag you want to create.
1. Select **Review + create**.

If you've entered your configuration correctly, you'll see a **Validation Passed** message at the top of your screen. Navigate to the **Review + create** section.

If you haven't filled in the configuration correctly, you'll see an error message in the configuration section(s) containing the invalid configuration. Correct the invalid configuration by selecting the flagged section(s) and use the information within the error messages to correct invalid configuration before returning to the **Review + create** section.

:::image type="content" source="media/deploy/failed-validation.png" alt-text="Screenshot of the Create an Azure Communications Gateway portal, showing a validation that failed due to missing information in the Contacts section.":::

## 2. Submit your Azure Communications Gateway configuration

Check your configuration and ensure it matches your requirements. If the configuration is correct, select **Create**.

Once your resource has been provisioned, a message appears saying **Your deployment is complete**. Select **Go to resource group**, and then check that your resource group contains the correct Azure Communications Gateway resource.

> [!NOTE]
> You will not be able to make calls immediately. You need to complete the remaining steps in this guide before your resource is ready to handle traffic.

:::image type="content" source="media/deploy/go-to-resource-group.png" alt-text="Screenshot of the Create an Azure Communications Gateway portal, showing a completed deployment screen.":::

## 3. Find the Object ID and Application ID for your Azure Communication Gateway resource

Each Azure Communications Gateway resource automatically receives a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md), which Azure Communications Gateway uses to connect to the Operator Connect environment. You need to find the Object ID and Application ID of the managed identity, so that you can connect Azure Communications Gateway to the Operator Connect or Teams Phone Mobile environment in [4. Set up application roles for Azure Communications Gateway](#4-set-up-application-roles-for-azure-communications-gateway) and [7. Add the Application ID for Azure Communications Gateway to Operator Connect](#7-add-the-application-id-for-azure-communications-gateway-to-operator-connect).

1. Sign in to the [Azure portal](https://azure.microsoft.com/).
1. In the search bar at the top of the page, search for your Communications Gateway resource.
1. Select your Communications Gateway resource.
1. Select **Identity**.
1. In **System assigned**, copy the **Object (principal) ID**.
1. Search for the value of **Object (principal) ID** with the search bar. You should see an enterprise application with that value under the **Azure Active Directory** subheading. You might need to select **Continue searching in Azure Active Directory** to find it.
1. Make a note of the **Object (principal) ID**.
1. Select the enterprise application.
1. Check that the **Object ID** matches the **Object (principal) ID** value that you copied.
1. Make a note of the **Application ID**.

## 4. Set up application roles for Azure Communications Gateway

Azure Communications Gateway contains services that need to access the Operator Connect API on your behalf. To enable this access, you must grant specific application roles to the system-assigned managed identity for Azure Communications Gateway under the Project Synergy Enterprise Application. You created the Project Synergy Enterprise Application when you [prepared to deploy Azure Communications Gateway](prepare-to-deploy.md#1-add-the-project-synergy-application-to-your-azure-tenancy).

> [!IMPORTANT]
> Granting permissions has two parts: configuring the system-assigned managed identity for Azure Communications Gateway with the appropriate roles (this step) and adding the application ID of the managed identity to the Operator Connect or Teams Phone Mobile environment. You'll add the application ID to the Operator Connect or Teams Phone Mobile environment later, in [7. Add the Application ID for Azure Communications Gateway to Operator Connect](#7-add-the-application-id-for-azure-communications-gateway-to-operator-connect).

Do the following steps in the tenant that contains your Project Synergy application.

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
    ```
1. Run the following cmdlet, replacing *`<CommunicationsGatewayObjectID>`* with the Object ID you noted down in [3. Find the Object ID and Application ID for your Azure Communication Gateway resource](#3-find-the-object-id-and-application-id-for-your-azure-communication-gateway-resource).
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

## 5. Provide additional information to your onboarding team

> [!NOTE]
>This step is required to set you up as an Operator in the Teams Phone Mobile (TPM) and Operator Connect (OC) environments. Skip this step if you have already onboarded to TPM or OC.

Before your onboarding team can finish onboarding you to the Operator Connect and/or Teams Phone Mobile environments, you need to provide them with some additional information.

1. Wait for your onboarding team to provide you with a form to collect the additional information. 
1. Complete the form and give it to your onboarding team.
1. Wait for your onboarding team to confirm that the onboarding process is complete.

If you don't already have an onboarding team, contact azcog-enablement@microsoft.com, providing your Azure subscription ID and contact details.

## 6. Test your Operator Connect portal access

> [!IMPORTANT]
> Before testing your Operator Connect portal access, wait for your onboarding team to confirm that the onboarding process is complete.

Go to the [Operator Connect homepage](https://operatorconnect.microsoft.com/) and check that you're able to sign in.

## 7. Add the Application ID for Azure Communications Gateway to Operator Connect

You must enable the Azure Communications Gateway application within the Operator Connect or Teams Phone Mobile environment. Enabling the application allows Azure Communications Gateway to use the roles that you set up in [4. Set up application roles for Azure Communications Gateway](#4-set-up-application-roles-for-azure-communications-gateway).

To enable the application, add the Application ID of the system-assigned managed identity representing Azure Communications Gateway to your Operator Connect or Teams Phone Mobile environment. You found this ID in [3. Find the Object ID and Application ID for your Azure Communication Gateway resource](#3-find-the-object-id-and-application-id-for-your-azure-communication-gateway-resource).

1. Log into the [Operator Connect portal](https://operatorconnect.microsoft.com/operator/configuration).
1. Add a new **Application Id**, using the Application ID that you found.

## 8. Register your deployment's domain name in Active Directory

Microsoft Teams only sends traffic to domains that you've confirmed that you own. Your Azure Communications Gateway deployment automatically receives an autogenerated fully qualified domain name (FQDN). You need to add this domain name to your Active Directory tenant as a custom domain name, share the details with your onboarding team and then verify the domain name. This process confirms that you own the domain.

1. Navigate to the **Overview** of your Azure Communications Gateway resource and select **Properties**. Find the field named **Domain**. This name is your deployment's domain name.
1. Complete the following procedure: [Add your custom domain name to Azure AD](../active-directory/fundamentals/add-custom-domain.md#add-your-custom-domain-name-to-azure-ad).
1. Share your DNS TXT record information with your onboarding team. Wait for your onboarding team to confirm that the DNS TXT record has been configured correctly.
1. Complete the following procedure: [Verify your custom domain name](../active-directory/fundamentals/add-custom-domain.md#verify-your-custom-domain-name).

## 9. Wait for provisioning to complete

You now need to wait for your resource to be provisioned and connected to the Microsoft Teams environment. When your resource has been provisioned and connected, your onboarding team will contact you and the Provisioning Status filed on the resource overview will be "Complete". We recommend you check in periodically to see if your resource has been provisioned. This process can take up to two weeks, because updating ACLs in the Azure and Teams environments is done on a periodic basis.

## Next steps

- [Prepare for live traffic with Azure Communications Gateway](prepare-for-live-traffic.md)