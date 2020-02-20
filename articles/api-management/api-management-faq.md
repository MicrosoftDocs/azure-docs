---
title: Azure API Management FAQ | Microsoft Docs
description: Learn the answers to frequently asked questions (FAQ), patterns, and best practices in Azure API Management.
services: api-management
documentationcenter: ''
author: vladvino
manager: erikre
editor: ''

ms.assetid: 2fa193cd-ea71-4b33-a5ca-1f55e5351e23
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 11/19/2017
ms.author: apimpm
---
# Azure API Management FAQs
Get the answers to common questions, patterns, and best practices for Azure API Management.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Contact us
* [How can I ask the Microsoft Azure API Management team a question?](#how-can-i-ask-the-microsoft-azure-api-management-team-a-question)

## Frequently asked questions
* [What does it mean when a feature is in preview?](#what-does-it-mean-when-a-feature-is-in-preview)
* [How can I secure the connection between the API Management gateway and my back-end services?](#how-can-i-secure-the-connection-between-the-api-management-gateway-and-my-back-end-services)
* [How do I copy my API Management service instance to a new instance?](#how-do-i-copy-my-api-management-service-instance-to-a-new-instance)
* [Can I manage my API Management instance programmatically?](#can-i-manage-my-api-management-instance-programmatically)
* [How do I add a user to the Administrators group?](#how-do-i-add-a-user-to-the-administrators-group)
* [Why is the policy that I want to add unavailable in the policy editor?](#why-is-the-policy-that-i-want-to-add-unavailable-in-the-policy-editor)
* [How do I set up multiple environments in a single API?](#how-do-i-set-up-multiple-environments-in-a-single-api)
* [Can I use SOAP with API Management?](#can-i-use-soap-with-api-management)
* [Can I configure an OAuth 2.0 authorization server with AD FS security?](#can-i-configure-an-oauth-20-authorization-server-with-ad-fs-security)
* [What routing method does API Management use in deployments to multiple geographic locations?](#what-routing-method-does-api-management-use-in-deployments-to-multiple-geographic-locations)
* [Can I use an Azure Resource Manager template to create an API Management service instance?](#can-i-use-an-azure-resource-manager-template-to-create-an-api-management-service-instance)
* [Can I use a self-signed SSL certificate for a back end?](#can-i-use-a-self-signed-ssl-certificate-for-a-back-end)
* [Why do I get an authentication failure when I try to clone a GIT repository?](#why-do-i-get-an-authentication-failure-when-i-try-to-clone-a-git-repository)
* [Does API Management work with Azure ExpressRoute?](#does-api-management-work-with-azure-expressroute)
* [Why do we require a dedicated subnet in Resource Manager style VNETs when API Management is deployed into them?](#why-do-we-require-a-dedicated-subnet-in-resource-manager-style-vnets-when-api-management-is-deployed-into-them)
* [What is the minimum subnet size needed when deploying API Management into a VNET?](#what-is-the-minimum-subnet-size-needed-when-deploying-api-management-into-a-vnet)
* [Can I move an API Management service from one subscription to another?](#can-i-move-an-api-management-service-from-one-subscription-to-another)
* [Are there restrictions on or known issues with importing my API?](#are-there-restrictions-on-or-known-issues-with-importing-my-api)

### How can I ask the Microsoft Azure API Management team a question?
You can contact us by using one of these options:

* Post your questions in our [API Management MSDN forum](https://social.msdn.microsoft.com/forums/azure/home?forum=azureapimgmt).
* Send an email to <mailto:apimgmt@microsoft.com>.
* Send us a feature request in the [Azure feedback forum](https://feedback.azure.com/forums/248703-api-management).

### What does it mean when a feature is in preview?
When a feature is in preview, it means that we're actively seeking feedback on how the feature is working for you. A feature in preview is functionally complete, but it's possible that we'll make a breaking change in response to customer feedback. We recommend that you don't depend on a feature that is in preview in your production environment. If you have any feedback on preview features, please let us know through one of the contact options in [How can I ask the Microsoft Azure API Management team a question?](#how-can-i-ask-the-microsoft-azure-api-management-team-a-question).

### How can I secure the connection between the API Management gateway and my back-end services?
You have several options to secure the connection between the API Management gateway and your back-end services. You can:

* Use HTTP basic authentication. For more information, see [Import and publish your first API](import-and-publish.md).
* Use SSL mutual authentication as described in [How to secure back-end services by using client certificate authentication in Azure API Management](api-management-howto-mutual-certificates.md).
* Use IP whitelisting on your back-end service. In all tiers of API Management with the exception of Consumption tier, the IP address of the gateway remains constant, with a few caveats described in [the IP documentation article](api-management-howto-ip-addresses.md).
* Connect your API Management instance to an Azure Virtual Network.

### How do I copy my API Management service instance to a new instance?
You have several options if you want to copy an API Management instance to a new instance. You can:

* Use the backup and restore function in API Management. For more information, see [How to implement disaster recovery by using service backup and restore in Azure API Management](api-management-howto-disaster-recovery-backup-restore.md).
* Create your own backup and restore feature by using the [API Management REST API](/rest/api/apimanagement/). Use the REST API to save and restore the entities from the service instance that you want.
* Download the service configuration by using Git, and then upload it to a new instance. For more information, see [How to save and configure your API Management service configuration by using Git](api-management-configuration-repository-git.md).

### Can I manage my API Management instance programmatically?
Yes, you can manage API Management programmatically by using:

* The [API Management REST API](/rest/api/apimanagement/).
* The [Microsoft Azure ApiManagement Service Management Library SDK](https://aka.ms/apimsdk).
* The [Service deployment](https://docs.microsoft.com/powershell/module/wds) and [Service management](https://docs.microsoft.com/powershell/azure/servicemanagement/overview) PowerShell cmdlets.

### How do I add a user to the Administrators group?
Here's how you can add a user to the Administrators group:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Go to the resource group that has the API Management instance you want to update.
3. In API Management, assign the **Api Management Service Contributor** role to the user.

Now the newly added contributor can use Azure PowerShell [cmdlets](https://docs.microsoft.com/powershell/azure/overview). Here's how to sign in as an administrator:

1. Use the `Connect-AzAccount` cmdlet to sign in.
2. Set the context to the subscription that has the service by using `Set-AzContext -SubscriptionID <subscriptionGUID>`.
3. Get a single sign-on URL by using `Get-AzApiManagementSsoToken -ResourceGroupName <rgName> -Name <serviceName>`.
4. Use the URL to access the admin portal.

### Why is the policy that I want to add unavailable in the policy editor?
If the policy that you want to add appears dimmed or shaded in the policy editor, be sure that you are in the correct scope for the policy. Each policy statement is designed for you to use in specific scopes and policy sections. To review the policy sections and scopes for a policy, see the policy's Usage section in [API Management policies](/azure/api-management/api-management-policies).

### How do I set up multiple environments in a single API?
To set up multiple environments, for example, a test environment and a production environment, in a single API, you have two options. You can:

* Host different APIs on the same tenant.
* Host the same APIs on different tenants.

### Can I use SOAP with API Management?
[SOAP pass-through](https://blogs.msdn.microsoft.com/apimanagement/2016/10/13/soap-pass-through/) support is now available. Administrators can import the WSDL of their SOAP service, and Azure API Management will create a SOAP front end. Developer portal documentation, test console, policies and analytics are all available for SOAP services.

### Can I configure an OAuth 2.0 authorization server with AD FS security?
To learn how to configure an OAuth 2.0 authorization server with Active Directory Federation Services (AD FS) security, see [Using ADFS in API Management](https://phvbaars.wordpress.com/2016/02/06/using-adfs-in-api-management/).

### What routing method does API Management use in deployments to multiple geographic locations?
API Management uses the [performance traffic routing method](../traffic-manager/traffic-manager-routing-methods.md#performance) in deployments to multiple geographic locations. Incoming traffic is routed to the closest API gateway. If one region goes offline, incoming traffic is automatically routed to the next closest gateway. Learn more about routing methods in [Traffic Manager routing methods](../traffic-manager/traffic-manager-routing-methods.md).

### Can I use an Azure Resource Manager template to create an API Management service instance?
Yes. See the [Azure API Management Service](https://aka.ms/apimtemplate) quickstart templates.

### Can I use a self-signed SSL certificate for a back end?
Yes. This can be done through PowerShell or by directly submitting to the API. This will disable certificate chain validation and will allow you to use self-signed or privately-signed certificates when communicating from API Management to the back end services.

#### Powershell method ####
Use the [`New-AzApiManagementBackend`](https://docs.microsoft.com/powershell/module/az.apimanagement/new-azapimanagementbackend) (for new back end) or [`Set-AzApiManagementBackend`](https://docs.microsoft.com/powershell/module/az.apimanagement/set-azapimanagementbackend) (for existing back end) PowerShell cmdlets and set the `-SkipCertificateChainValidation` parameter to `True`.

```powershell
$context = New-AzApiManagementContext -resourcegroup 'ContosoResourceGroup' -servicename 'ContosoAPIMService'
New-AzApiManagementBackend -Context  $context -Url 'https://contoso.com/myapi' -Protocol http -SkipCertificateChainValidation $true
```

#### Direct API update method ####
1. Create a [Backend](/rest/api/apimanagement/) entity by using API Management.		
2. Set the **skipCertificateChainValidation** property to **true**.		
3. If you no longer want to allow self-signed certificates, delete the Backend entity, or set the **skipCertificateChainValidation** property to **false**.

### Why do I get an authentication failure when I try to clone a Git repository?
If you use Git Credential Manager, or if you're trying to clone a Git repository by using Visual Studio, you might run into a known issue with the Windows credentials dialog box. The dialog box limits password length to 127 characters, and it truncates the Microsoft-generated password. We are working on shortening the password. For now, please use Git Bash to clone your Git repository.

### Does API Management work with Azure ExpressRoute?
Yes. API Management works with Azure ExpressRoute.

### Why do we require a dedicated subnet in Resource Manager style VNETs when API Management is deployed into them?
The dedicated subnet requirement for API Management comes from the fact, that it is built on Classic (PAAS V1 layer) deployment model. While we can deploy into a Resource Manager VNET (V2 layer), there are consequences to that. The Classic deployment model in Azure is not tightly coupled with the Resource Manager model and so if you create a resource in V2 layer, the V1 layer doesn't know about it and problems can happen, such as API Management trying to use an IP that is already allocated to a NIC (built on V2).
To learn more about difference of Classic and Resource Manager models in Azure refer to [difference in deployment models](../azure-resource-manager/management/deployment-models.md).

### What is the minimum subnet size needed when deploying API Management into a VNET?
The minimum subnet size needed to deploy API Management is [/29](../virtual-network/virtual-networks-faq.md#configuration), which is the minimum subnet size that Azure supports.

### Can I move an API Management service from one subscription to another?
Yes. To learn how, see [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md).

### Are there restrictions on or known issues with importing my API?
[Known issues and restrictions](api-management-api-import-restrictions.md) for Open API(Swagger), WSDL and WADL formats.
