---
title: Developer portal - Frequently asked questions
titleSuffix: Azure API Management
description: Frequently asked questions about the developer portal in API Management. The developer portal is a customizable website where API consumers can explore your APIs.
services: api-management
documentationcenter: API Management
author: dlepow

ms.service: api-management
ms.topic: troubleshooting
ms.date: 02/04/2022
ms.author: danlep 
ms.custom: devx-track-azurepowershell, devx-track-arm-template
---

# API Management developer portal - frequently asked questions

## What if I need functionality that isn't supported in the portal?

You have the following options:

* For small customizations,  use a built-in widget to [add custom HTML](developer-portal-extend-custom-functionality.md#use-custom-html-code-widget) .

* For larger customizations, [create and upload](developer-portal-extend-custom-functionality.md#create-and-upload-custom-widget) a custom widget to the managed developer portal.

* [Self-host the developer portal](developer-portal-self-host.md), only if you need to make modifications to the core of the developer portal codebase.

* Open a feature request in the [GitHub repository](https://github.com/Azure/api-management-developer-portal).

Learn more about [customizing and extending](developer-portal-extend-custom-functionality.md) the functionality of the developer portal.


## Can I have multiple developer portals in one API Management service?

You can have one managed portal and multiple self-hosted portals. The content of all portals is stored in the same API Management service, so they will be identical. If you want to differentiate portals' appearance and functionality, you can self-host them with your own custom widgets that dynamically customize pages on runtime, for example based on the URL.

## Does the portal support Azure Resource Manager templates and/or is it compatible with API Management DevOps Resource Kit?

No.

## Is the portal's content saved with the backup/restore functionality in API Management?

No.

## Do I need to enable additional VNet connectivity for the managed portal dependencies?

In most cases - no.

If your API Management service is in an internal VNet, your developer portal is only accessible from within the network. The management endpoint's host name must resolve to the internal VIP of the service from the machine you use to access the portal's administrative interface. Make sure the management endpoint is registered in the DNS. In case of misconfiguration, you will see an error: `Unable to start the portal. See if settings are specified correctly in the configuration (...)`.

If your API Management service is in an internal VNet and you're accessing it through Application Gateway from the internet, make sure to enable connectivity to the developer portal and the management endpoints of API Management. You may need to disable Web Application Firewall rules. See [this documentation article](api-management-howto-integrate-internal-vnet-appgateway.md) for more details.

## I assigned a custom API Management domain and the published portal doesn't work

After you update the domain, you need to [republish the portal](api-management-howto-developer-portal-customize.md#publish) for the changes to take effect.

## I added an identity provider and I can't see it in the portal

After you configure an identity provider (for example, Microsoft Entra ID, Azure AD B2C), you need to [republish the portal](api-management-howto-developer-portal-customize.md#publish) for the changes to take effect. Make sure your developer portal pages include the OAuth buttons widget.

## I set up delegation and the portal doesn't use it

After you set up delegation, you need to [republish the portal](api-management-howto-developer-portal-customize.md#publish) for the changes to take effect.

## My other API Management configuration changes haven't been propagated in the developer portal

Most configuration changes (for example, VNet, sign-in, product terms) require [republishing the portal](api-management-howto-developer-portal-customize.md#publish).

## <a name="cors"></a> I'm getting a CORS error when using the interactive console

The interactive console makes a client-side API request from the browser. Resolve the CORS problem by adding [a CORS policy](cors-policy.md) on your API(s).

You can check the status of the CORS policy in the **Portal overview** section of your API Management service in the Azure portal. A warning box indicates an absent or misconfigured policy.

> [!NOTE]
> 
> Only one CORS policy is executed. If you specified multiple CORS policies (for example, on the API level and on the all-APIs level), your interactive console may not work as expected.

![Screenshot that shows where you can check the status of your CORS policy.](media/developer-portal-faq/cors-azure-portal.png)

Automatically apply the CORS policy by clicking the **Enable CORS** button.

You can also enable CORS manually.

1. Select the **Manually apply it on the global level** link to see the generated policy code.
2. Navigate to **All APIs** in the **APIs** section of your API Management service in the Azure portal.
3. Select the **</>** icon in the **Inbound processing** section.
4. Insert the policy in the **\<inbound\>** section of the XML file. Make sure the **\<origin\>** value matches your developer portal's domain.

> [!NOTE]
> 
> If you apply the CORS policy in the Product scope, instead of the API(s) scope, and your API uses subscription key authentication through a header, your console won't work.
>
> The browser automatically issues an `OPTIONS` HTTP request, which doesn't contain a header with the subscription key. Because of the missing subscription key, API Management can't associate the `OPTIONS` call with a Product, so it can't apply the CORS policy.
>
> As a workaround you can pass the subscription key in a query parameter.

## What is the CORS proxy feature and when should I use it?

Select the **Use CORS proxy** option in the configuration of the API operation details widget to route the interactive console's API calls through the portal's backend in your API Management service. In this configuration, you no longer need to apply a CORS policy for your APIs, and connectivity to the gateway endpoint from the local machine isn't required. If the APIs are exposed through a self-hosted gateway or your service is in a virtual network, the connectivity from the API Management's backend service to the gateway is required. If you use the self-hosted portal, specify the portal's backend endpoint using the `backendUrl` option in the configuration files. Otherwise, the self-hosted portal won't be aware of the location of the backend service.

## What permissions do I need to edit the developer portal?

If you're seeing the `Oops. Something went wrong. Please try again later.` error when you open the portal in the administrative mode, you may be lacking the required permissions (Azure RBAC).

The portal requires the permission `Microsoft.ApiManagement/service/users/token/action` at the scope `/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.ApiManagement/service/<apim-service-name>/users/1`.

You can use the following PowerShell script to create a role with the required permission. Remember to change the `<subscription-id>` parameter. 

```powershell
#New Portals Admin Role 
Import-Module Az 
Connect-AzAccount 
$contributorRole = Get-AzRoleDefinition "API Management Service Contributor" 
$customRole = $contributorRole 
$customRole.Id = $null
$customRole.Name = "APIM New Portal Admin" 
$customRole.Description = "This role gives the user ability to log in to the new Developer portal as administrator" 
$customRole.Actions = "Microsoft.ApiManagement/service/users/token/action" 
$customRole.IsCustom = $true 
$customRole.AssignableScopes.Clear() 
$customRole.AssignableScopes.Add('/subscriptions/<subscription-id>') 
New-AzRoleDefinition -Role $customRole 
```
 
Once the role is created, it can be granted to any user from the **Access Control (IAM)** section in the Azure portal. Assigning this role to a user will assign the permission at the service scope. The user will be able to generate SAS tokens on behalf of *any* user in the service. At the minimum, this role needs to be assigned to the administrator of the service. The following PowerShell command demonstrates how to assign the role to a user `user1` at the lowest scope to avoid granting unnecessary permissions to the user: 

```powershell
New-AzRoleAssignment -SignInName "user1@contoso.com" -RoleDefinitionName "APIM New Portal Admin" -Scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.ApiManagement/service/<apim-service-name>/users/1" 
```

After the permissions have been granted to a user, the user must sign out and sign in again to the Azure portal for the new permissions to take effect.

## I'm seeing the `Unable to start the portal. See if settings are specified correctly (...)` error

This error is shown when a `GET` call to `https://<management-endpoint-hostname>/subscriptions/xxx/resourceGroups/xxx/providers/Microsoft.ApiManagement/service/xxx/contentTypes/document/contentItems/configuration?api-version=2018-06-01-preview` fails. The call is issued from the browser by the administrative interface of the portal.

If your API Management service is in a VNet, refer to the [VNet connectivity question](#do-i-need-to-enable-additional-vnet-connectivity-for-the-managed-portal-dependencies).

The call failure may also be caused by an TLS/SSL certificate, which is assigned to a custom domain and is not trusted by the browser. As a mitigation, you can remove the management endpoint custom domain. API Management will fall back to the default endpoint with a trusted certificate.

## What's the browser support for the portal?

| Browser                     | Supported       |
|-----------------------------|-----------------|
| Apple Safari                | Yes<sup>1</sup> |
| Google Chrome               | Yes<sup>1</sup> |
| Microsoft Edge              | Yes<sup>1</sup> |
| Microsoft Internet Explorer | No              |
| Mozilla Firefox             | Yes<sup>1</sup> |

 <sup>1</sup> Supported in the two latest production versions.

## Local development of my self-hosted portal is no longer working

If your local version of the developer portal cannot save or retrieve information from the storage account or API Management instance, the SAS tokens may have expired. You can fix that by generating new tokens. For instructions, refer to the tutorial to [self-host the developer portal](developer-portal-self-host.md#step-2-configure-json-files-static-website-and-cors-settings).

## How do I disable sign-up in the developer portal?

If you don't need the sign-up functionality enabled by default in the developer portal, you can disable it with these steps:

1. In the Azure portal, navigate to your API Management instance.
1. Under **Developer portal** in the menu, select **Identities**.
1. Delete each identity provider that appears in the list. Select each provider, select the context menu (**...**), and select **Delete**.
 
   :::image type="content" source="media/developer-portal-faq/delete-identity-providers.png" alt-text="Delete identity providers":::
 
1. Navigate to the developer portal administrative interface.
1. Remove **Sign up** links and navigation items in the portal content. For information about customizing portal content, see [Tutorial: Access and customize the developer portal](api-management-howto-developer-portal-customize.md).
 
   :::image type="content" source="media/developer-portal-faq/delete-navigation-item.png" alt-text="Delete navigation item":::
 
1. Modify the **Sign up** page content to remove fields used to enter identity data, in case users navigate directly to it.
   
   Optionally, delete the **Sign up** page. Currently, you use the [contentItem](/rest/api/apimanagement/current-ga/content-item) REST APIs to list and delete this page.
 
1. Save your changes, and [republish the portal](api-management-howto-developer-portal-customize.md#publish).

## How can I remove the developer portal content provisioned to my API Management service?

Provide the required parameters in the `scripts.v3/cleanup.bat` script in the developer portal [GitHub repository](https://github.com/Azure/api-management-developer-portal), and run the script

```sh
cd scripts.v3
.\cleanup.bat
cd ..
```

## How do I enable single sign-on (SSO) authentication to self-hosted developer portal?

Among other authentication methods, the developer portal supports single sign-on (SSO). To authenticate with this method, you need to make a call to `/signin-sso` with the token in the query parameter:

```html
https://contoso.com/signin-sso?token=[user-specific token]
```
### Generate user tokens
You can generate *user-specific tokens* (including admin tokens) using the [Get Shared Access Token](/rest/api/apimanagement/current-ga/user/get-shared-access-token) operation of the [API Management REST API](/rest/api/apimanagement/apimanagementrest/api-management-rest).

> [!NOTE]
> The token must be URL-encoded.


## Next steps

Learn more about the developer portal:

- [Access and customize the managed developer portal](api-management-howto-developer-portal-customize.md)
- [Extend](developer-portal-extend-custom-functionality.md) the functionality of the developer portal.
- [Set up self-hosted version of the portal](developer-portal-self-host.md)

Browse other resources:

- [GitHub repository with the source code](https://github.com/Azure/api-management-developer-portal)
