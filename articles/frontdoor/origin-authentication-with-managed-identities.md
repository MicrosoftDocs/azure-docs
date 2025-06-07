---
title: Use managed identities to authenticate to origins (preview)
titleSuffix: Azure Front Door
description: This article shows you how to set up managed identities with Azure Front Door to authenticate to origins.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 05/12/2025
ms.custom:
  - build-2025
---

# Use managed identities to authenticate to origins (preview)

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

Managed identities provided by Microsoft Entra ID enables your Azure Front Door Standard/Premium instance to securely access other Microsoft Entra protected resources, such as Azure Blob Storage, without the need to manage credentials. For more information, see [What are managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md).

After you enable managed identity for Azure Front Door and granting the managed identity necessary permissions to your origin, Front Door will use the managed identity to obtain an access token from Microsoft Entra ID for accessing the specified resource. After successfully obtaining the token, Front Door will set the value of the token in the Authorization header using the Bearer scheme and then forward the request to the origin. Front Door caches the token until it expires. 

> [!Note]
> This feature is currently not supported for origins with Private Link enabled in Front Door.

Azure Front Door supports two types of managed identities:

* **System-assigned identity**: This identity is tied to your service and is deleted if the service is deleted. Each service can have only one system-assigned identity.
* **User-assigned identity**: This is a standalone Azure resource that can be assigned to your service. Each service can have multiple user-assigned identities.

Managed identities are specific to the Microsoft Entra tenant where your Azure subscription is hosted. If a subscription is moved to a different directory, you need to recreate and reconfigure the identity.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An Azure Front Door Standard or Premium profile. To create a new profile, see [create an Azure Front Door](create-front-door-portal.md).

## Enable managed identity

1. Navigate to your existing Azure Front Door profile. Select **Identity** under *Security* in the left menu.

1. Choose either a **System assigned** or **User assigned** managed identity.

    * **[System assigned](#system-assigned)** - A managed identity tied to the Azure Front Door profile lifecycle.
    
    * **[User assigned](#user-assigned)** - A standalone managed identity resource with its own lifecycle.

    ### System assigned
    
    1. Toggle the *Status* to **On** and select **Save**.
    
        :::image type="content" source="./media/managed-identity/system-assigned.png" alt-text="Screenshot of the system assigned managed identity configuration page.":::
    
    1. Confirm the creation of a system managed identity for your Front Door profile by selecting **Yes** when prompted.
    
    ### User assigned

    To use a user-assigned managed identity, you must have one already created. For instructions on creating a new identity, see [create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

    1. In the **User assigned** tab, select **+ Add** to add a user-assigned managed identity.

    1. Search for and select the user-assigned managed identity. Then select **Add** to attach it to the Azure Front Door profile.

    1. The name of the selected user-assigned managed identity appears in the Azure Front Door profile.

        :::image type="content" source="./media/managed-identity/user-assigned-configured.png" alt-text="Screenshot of the user-assigned managed identity added to the Front Door profile.":::

## Associating the identity to an origin group

> [!Note]
> The association will only work if
> * the origin group does not contain any origins with private link enabled.
> * the health probe protocol is set to 'HTTPS' under origin group settings.
> * the forwarding protocol is set to 'HTTPS Only' under route settings.
> * the forwarding protocol is set to 'HTTPS Only' in case you are using a 'Route configuration override' action in rulesets.

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
> The next steps assume your origin is an Azure Blob Storage. If you're using a different resource type, make sure to select the appropriate **job function role** during role assignment. Otherwise, the steps remain the same for most resource types.

2. Go to the **Access Control (IAM)** section and click on **Add**. Choose **Add role assignment** from the dropdown menu.
    :::image type="content" source="./media/managed-identity/add-role-assignment-menu.png" alt-text="Screenshot of access control settings.":::
3.	Under **Job function roles** in the **Roles** tab, select an appropriate role (for example, Storage Blob Data Reader) from the list and then select **Next**.
    :::image type="content" source="./media/managed-identity/storage-job-function-roles.png" alt-text="Screenshot of Roles tab under Add role assignment.":::
4.	In the **Members** tab, under the **Assign access to**, choose **Managed identity** and then click on **Select members**.
    :::image type="content" source="./media/managed-identity/members.png" alt-text="Screenshot of Members tab under Add role assignment.":::
5.	The **Select managed identities** window opens. Choose the subscription where your Front Door is located and under **Managed identity** dropdown, choose **Front Door and CDN profiles**. Under the **Select** dropdown, choose the managed identity created for your Front Door. Click on the **Select** button in the bottom.
6.	Select **Review and assign** and then select **Review and assign** once more after the validation is complete.

## Tips while using origin authentication
* If you are facing errors during origin group configuration,
    * Ensure that the health probe protocol is set to HTTPS.
    * Ensure that forwarding protocol within route settings and/or route configuration override settings (in rulesets) is set to 'HTTPS Only'.
    * Ensure that there are no private link enabled origins within the origin group.
* If you see 'Access Denied; responses from origin, verify that the Managed Identity has the appropriate role assigned to access the origin resource.
* Transition from SAS Tokens for Storage: If transitioning from SAS tokens to Managed Identities, follow a step-wise approach to avoid downtime. Enable Managed Identity, associate it with the origin, and then stop using SAS tokens.
* After you enable origin authentication in origin group settings, you should not directly disable/delete the identities from the Identity settings under Front Door portal, nor directly delete the user-assigned managed identity under the Managed Identity portal. Doing so will cause origin authentication to fail immediately. Instead, if you want to stop using the origin authentication feature or want to delete/disable the identities, first disable the access restrictions under the Access Control (IAM) section of the origin resource so that the origin is accessible without the need of a managed identity or Entra ID token. Then disable origin authentication under Front Door origin group settings. Wait for some time for the configuration to be updated and then delete/disable the identity if required.
