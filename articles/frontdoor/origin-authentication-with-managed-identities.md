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

By using Microsoft Entra ID managed identities, your Azure Front Door Standard or Premium instance can securely access other Microsoft Entra protected resources, such as Azure Blob Storage, without the need to manage credentials. For more information, see [What is managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview)

After you enable managed identity for Azure Front Door and grant the managed identity necessary permissions to your origin, Front Door uses the managed identity to get an access token from Microsoft Entra ID for accessing the specified resource. After successfully getting the token, Front Door sets the value of the token in the `Authorization` header by using the Bearer scheme and then forwards the request to the origin. Front Door caches the token until it expires.

> [!NOTE]
> This feature isn't currently supported for origins with Private Link enabled in Front Door.

Azure Front Door supports two types of managed identities:

* **System-assigned identity**: This identity is tied to your service and is deleted if the service is deleted. Each service can have only one system-assigned identity.
* **User-assigned identity**: This identity is a standalone Azure resource that you can assign to your service. Each service can have multiple user-assigned identities.

Managed identities are specific to the Microsoft Entra tenant where your Azure subscription is hosted. If you move a subscription to a different directory, you need to recreate and reconfigure the identity.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

* An Azure Front Door Standard or Premium profile. To create a new profile, see [create an Azure Front Door](create-front-door-portal.md).

## Enable managed identity

1. Go to your existing Azure Front Door profile. Select **Identity** under *Security* in the left menu.

1. Choose either a **System assigned** or **User assigned** managed identity.

    * **[System assigned](#system-assigned)** - A managed identity that's tied to the Azure Front Door profile lifecycle.
    
    * **[User assigned](#user-assigned)** - A standalone managed identity resource with its own lifecycle.

    ### System assigned
    
    1. Toggle the *Status* to **On** and select **Save**.
    
        :::image type="content" source="./media/managed-identity/system-assigned.png" alt-text="Screenshot of the system assigned managed identity configuration page.":::
    
    1. Confirm the creation of a system managed identity for your Front Door profile by selecting **Yes** when prompted.
    
    ### User assigned

    To use a user-assigned managed identity, you must already have one created. For instructions on creating a new identity, see [create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

    1. In the **User assigned** tab, select **+ Add** to add a user-assigned managed identity.

    1. Search for and select the user-assigned managed identity. Then select **Add** to attach it to the Azure Front Door profile.

    1. The name of the selected user-assigned managed identity appears in the Azure Front Door profile.

        :::image type="content" source="./media/managed-identity/user-assigned-configured.png" alt-text="Screenshot of the user-assigned managed identity added to the Front Door profile.":::

## Associate the identity to an origin group

> [!NOTE]
> The association works only if all the following conditions are true:
> * The origin group doesn't contain any origins with private link enabled.
> * The health probe protocol is set to `HTTPS` under origin group settings.
> * The forwarding protocol is set to `HTTPS Only` under route settings.
> * The forwarding protocol is set to `HTTPS Only` if you're using a `Route configuration override` action in rulesets.

> [!Warning]
> If you use origin authentication between Front Door and Storage, the sequence of steps for enabling origin authentication is very important. If you don't follow the appropriate sequence, you might encounter problems.
> * If you use a storage account with public anonymous access enabled, follow the steps in the exact sequence: [Associate the identity to an origin group](#associate-the-identity-to-an-origin-group) followed by [Provide access at the origin resource](#provide-access-at-the-origin-resource). When you complete all the steps, you can disable public anonymous access to only allow access to your storage account from Front Door.
> * If you use a storage account with public anonymous access disabled, follow a different sequence. First, complete the steps for [Provide access at the origin resource](#provide-access-at-the-origin-resource) followed by [Associate the identity to an origin group](#associate-the-identity-to-an-origin-group). Start sending traffic through Azure Front Door to the storage account only after you complete all the steps in the aforementioned sequence.

1. Go to your existing Azure Front Door profile and open origin groups.
1. Select an existing origin group that has origins already configured.
1. Scroll down to the **Authentication** section.
1. Enable **Origin authentication**.
1. Choose between system assigned or user assigned managed identity.
1. Enter the correct [scope](/entra/identity-platform/scopes-oidc) within the **Scope** field.
1. Select **Update**.

    :::image type="content" source="./media/managed-identity/origin-auth.png" alt-text="Screenshot of associating the identity to an origin group.":::

## Provide access at the origin resource

1. Go to the management page for your origin resource. For example, if the origin is an Azure Blob Storage, go to that Storage Account management page.

> [!NOTE]
> The next steps assume your origin is an Azure Blob Storage. If you're using a different resource type, make sure to select the appropriate **job function role** during role assignment. Otherwise, the steps remain the same for most resource types.

1. Go to the **Access Control (IAM)** section and select **Add**. Choose **Add role assignment** from the dropdown menu.
    :::image type="content" source="./media/managed-identity/add-role-assignment-menu.png" alt-text="Screenshot of access control settings.":::
1.	Under **Job function roles** in the **Roles** tab, select an appropriate role (for example, Storage Blob Data Reader) from the list and then select **Next**.
    :::image type="content" source="./media/managed-identity/storage-job-function-roles.png" alt-text="Screenshot of Roles tab under Add role assignment.":::
  	
> [!IMPORTANT]
> When granting any identity, including a managed identity, permissions to access services, always grant the least permissions needed to perform the desired actions. For example, if a managed identity is used to read data from a storage account, there's no need to grant that identity permissions to also write data to the storage account. Granting extra permissions, such as making the managed identity a contributor of a storage account when it’s not needed, can make requests coming via Azure Front Door capable of write and delete operations.

1.	In the **Members** tab, under the **Assign access to** section, choose **Managed identity** and then select **Select members**.
    :::image type="content" source="./media/managed-identity/members.png" alt-text="Screenshot of Members tab under Add role assignment.":::
1. The **Select managed identities** window opens. Choose the subscription where your Front Door is located. Under the **Managed identity** dropdown, choose **Front Door and CDN profiles**. Under the **Select** dropdown, choose the managed identity created for your Front Door. Select the **Select** button in the bottom.
1.	Select **Review and assign** and then select **Review and assign** once more after the validation is complete.

## Tips for using origin authentication

* If you encounter errors during origin group configuration,
    * Make sure the health probe protocol is set to HTTPS.
    * Make sure the forwarding protocol within route settings and route configuration override settings (in rulesets) is set to **HTTPS Only**.
    * Make sure the origin group doesn't include any private link enabled origins.
* If you see **Access Denied** responses from origin, verify that the Managed Identity has the appropriate role assigned to access the origin resource.
* Transition from SAS Tokens for Storage: If you're transitioning from SAS tokens to Managed Identities, follow a step-wise approach to avoid downtime. Enable Managed Identity, associate it with the origin, and then stop using SAS tokens.
* After you enable origin authentication in origin group settings, don't directly disable or delete the identities from the Identity settings under Front Door portal, nor directly delete the user-assigned managed identity under the Managed Identity portal. Doing so causes origin authentication to fail immediately. Instead, if you want to stop using the origin authentication feature or want to delete or disable the identities, first disable the access restrictions under the Access Control (IAM) section of the origin resource so that the origin is accessible without the need of a managed identity or Entra ID token. Then disable origin authentication under Front Door origin group settings. Wait for some time for the configuration to be updated and then delete or disable the identity if required.
* If your clients are already sending their own tokens under the Authorization header, Azure Front Door overwrites the token value with the origin authentication token. If you want Azure Front Door to send the client token to the origin, you can configure an Azure Front Door rule using the server variable `{http_req_header_Authorization}` to send the token under a separate header.
    :::image type="content" source="media/managed-identity/rules-engine.png" alt-text="Screenshot of the rule for sending the client token to origin via a different header.":::
* Use different managed identities for origin authentication and for Azure Front Door to Azure Key Vault authentication.
* For best practices while using managed identities, refer to [Managed identity best practice recommendations](/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations).
* For best practices while assigning RBAC role for Azure storage account, refer to [Assign an Azure role for access to blob data](../storage/blobs/assign-azure-role-data-access.md).
* When you enable origin authentication on an origin group, Front Door includes the access token in the Authorization header for health probes that probe the origins within the origin group, not just for end-user traffic requests.

## Related content

- [Origins and origin groups](origin.md?pivots=front-door-standard-premium)
- [Traffic routing methods to origin](routing-methods.md)
