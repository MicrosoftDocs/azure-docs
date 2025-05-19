---
title: Use managed identities to authenticate to origins (preview)
titleSuffix: Azure Front Door
description: This article shows you how to set up managed identities with Azure Front Door to authenticate to origins.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 05/12/2025
---

# Use managed identities to authenticate to origins (preview)

Managed identities provided by Microsoft Entra ID enables your Azure Front Door Standard/Premium instance to securely access other Microsoft Entra protected resources, such as Azure Blob Storage, without the need to manage credentials. For more information, see [What are managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md).

After you enable managed identity for Azure Front Door and granting the managed identity necessary permissions to your origin, Front Door will use the managed identity to obtain an access token from Microsoft Entra ID for accessing the specified resource. After successfully obtaining the token, the policy will set the value of the token in the Authorization header using the Bearer scheme. Front Door caches the token until it expires. 

> [!Note]
> This feature is not currently supported for private link enabled origins within Front Door.

Azure Front Door supports two types of managed identities:

* **System-assigned identity**: This identity is tied to your service and is deleted if the service is deleted. Each service can have only one system-assigned identity.
* **User-assigned identity**: This is a standalone Azure resource that can be assigned to your service. Each service can have multiple user-assigned identities.

Managed identities are specific to the Microsoft Entra tenant where your Azure subscription is hosted. If a subscription is moved to a different directory, you need to recreate and reconfigure the identity.

## Prerequisites

Before setting up managed identity for Azure Front Door, ensure you have an Azure Front Door Standard or Premium profile. To create a new profile, see [create an Azure Front Door](create-front-door-portal.md).

## Enable managed identity

1. Navigate to your existing Azure Front Door profile. Select **Identity** under *Security* in the left menu.

1. Choose either a **System assigned** or **User assigned** managed identity.

    * **[System assigned](#system-assigned)** - A managed identity tied to the Azure Front Door profile lifecycle, used to access Azure Key Vault.
    
    * **[User assigned](#user-assigned)** - A standalone managed identity resource with its own lifecycle, used to authenticate to Azure Key Vault.

    ### System assigned
    
    1. Toggle the *Status* to **On** and select **Save**.
    
        :::image type="content" source="./media/managed-identity/system-assigned.png" alt-text="Screenshot of the system assigned managed identity configuration page.":::
    
    1. Confirm the creation of a system managed identity for your Front Door profile by selecting **Yes** when prompted.
    
    1. Once created and registered with Microsoft Entra ID, use the **Object (principal) ID** to grant Azure Front Door access to your Azure Key Vault.
    
        :::image type="content" source="./media/managed-identity/system-assigned-created.png" alt-text="Screenshot of the system assigned managed identity registered with Microsoft Entra ID.":::
    
    ### User assigned

    To use a user-assigned managed identity, you must have one already created. For instructions on creating a new identity, see [create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

    1. In the **User assigned** tab, select **+ Add** to add a user-assigned managed identity.

    1. Search for and select the user-assigned managed identity. Then select **Add** to attach it to the Azure Front Door profile.

    1. The name of the selected user-assigned managed identity appears in the Azure Front Door profile.

        :::image type="content" source="./media/managed-identity/user-assigned-configured.png" alt-text="Screenshot of the user-assigned managed identity added to the Front Door profile.":::

    ---

## Associating the identity to an Origin Group

> [!Note]
> The association will not work if the origin group contains any origins with private link enabled and/or the forwarding/accepted/health probe protocol is set to HTTP.

1.	Navigate to your existing Azure Front Door profile and open origin groups.
2.	Select an existing origin group which has origins already configured.
3.	Scroll down to the **Authentication** section.
4.	Enable **Origin authentication**.
5.	Choose between system assigned or user assigned managed identity.
6.	Enter the correct [scope](/entra/identity-platform/scopes-oidc) within the **Scope** field.
7.	Click on **Update**.

    :::image type="content" source="./media/managed-identity/origin-auth.png" alt-text="Screenshot of associating the identity to an origin group.":::



## Providing access at the origin resource
1.	Navigate to the management page of your origin resource. For example, if the origin is an Azure Blob Storage, go to that Storage Account management page.

> [!Note]
> Below steps assume that your origin is an Azure Blob Storage. If you are using a different resource type as your origin, make sure that you choose an appropriate 'Job function role' during role assignment. Apart from that, the steps will remain same for all resource types.

2. Go to the **Access Control (IAM)** section and click on **Add**. Choose **Add role assignment** from the dropdown menu.
    :::image type="content" source="./media/managed-identity/add-role-assignment-menu.png" alt-text="Screenshot of access control settings.":::
3.	Under **Job function roles** in the **Roles** tab, select an appropriate role (for example, Storage Blob Data Reader or Storage Blob Data Contributor) from the list and then select **Next**.
    :::image type="content" source="./media/managed-identity/storage-job-function-roles.png" alt-text="Screenshot of Roles tab under Add role assignment.":::
4.	In the **Members** tab, under the **Assign access to**, choose **Managed identity** and then click on **Select members**.
    :::image type="content" source="./media/managed-identity/members.png" alt-text="Screenshot of Members tab under Add role assignment.":::
5.	The **Select managed identities** window opens. Choose the subscription where your Front Door is located and under **Managed identity** dropdown, choose **Front Door and CDN profiles**. Under the **Select** dropdown, choose the managed identity created for your Front Door. Click on the **Select** button in the bottom.
6.	Select **Review and assign** and then select **Review and assign** once more after the validation is complete.


## Common Troubleshooting Tips
* Error during origin group configuration.
    * Ensure that health probe protocol is set to HTTPS.
    * Ensure that forwarding protocol and accepted protocols within route settings are HTTPS.
    * Ensure that there are no private link enabled origins within the origin group.
* Access Denied: Verify that the Managed Identity has the appropriate role assigned to access the origin resource.
* Transition from SAS Tokens for Storage: If transitioning from SAS tokens to Managed Identities, follow a step-wise approach to avoid downtime. Enable Managed Identity, associate it with the origin, and then stop using SAS tokens.
