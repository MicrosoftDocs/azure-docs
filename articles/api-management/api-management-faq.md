<properties 
	pageTitle="Azure API Management FAQ | Microsoft Azure" 
	description="Learn the answers to common questions, patterns and best practices for Azure API Management." 
	services="api-management" 
	documentationCenter="" 
	authors="steved0x" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/25/2016" 
	ms.author="sdanie"/>

# Azure API Management FAQ

Learn the answers to common questions, patterns and best practices for Azure API Management.

## Frequently asked questions

-	[How can I ask a question to the API Management team?](#how-can-i-ask-a-question-to-the-api-management-team)
-	[What does it mean if a feature is in Preview?](#what-does-it-mean-if-a-feature-is-in-preview)
-	[What are the supported options to secure the connection between the API Management gateway and my backend services?](#what-are-the-supported-options-to-secure-the-connection-between-the-api-management-gateway-and-my-backend-services)
-	[How can I copy an API Management instance to a new instance?](#how-can-i-copy-an-api-management-instance-to-a-new-instance)
-	[Can I manage my API Management instance programmatically?](#can-i-manage-my-api-management-instance-programmatically)
-	[How can I add a user to the Administrators group?](#how-can-i-add-a-user-to-the-administrators-group)
-	[Why is the policy that I want to add not enabled in the policy editor?](#why-is-the-policy-that-i-want-to-add-not-enabled-in-the-policy-editor)
-	[How can I achieve API versioning with API Management?](#how-can-i-achieve-api-versioning-with-api-management)
-	[How can I configure multiple environments of APIs, for example Sandbox and Production?](#how-can-i-configure-multiple-environments-of-apis-for-example-sandbox-and-production)
-	[Is SOAP supported in API Management?](#is-soap-supported-in-api-management)
-	[Is the API Management gateway IP address constant? Can I use it in firewall rules?](#is-the-api-management-gateway-ip-address-constant-can-i-use-it-in-firewall-rules)
-	[Can I configure an OAUth 2.0 Authorization Server with ADFS security?](#can-i-configure-an-oauth-20-authorization-server-with-adfs-security)
-	[What routing method does API Management use when deployed to multiple geographic locations?](#what-routing-method-does-api-management-use-when-deployed-to-multiple-geographic-locations)
-	[Can I create an API Management service instance using an ARM template?](#can-i-create-an-api-management-service-instance-using-an-arm-template)
-	[Can I use a self-signed SSL certificate for a backend?](#can-i-use-a-self-signed-ssl-certificate-for-a-backend)
-	[Why am I getting authentication failure when I try to clone the GIT repository?] (#why-am-i-getting-authentication-failure-when-i-try-to-clone-the-git-repository)


### How can I ask a question to the API Management team?

-	You can post your questions to our [API Management MSDN forum](https://social.msdn.microsoft.com/forums/azure/home?forum=azureapimgmt).
-	You can send us an email at: `apimgmt@microsoft.com`.
-	You can send us a [feature request](https://feedback.azure.com/forums/248703-api-management).

### What does it mean if a feature is in Preview?

A feature in preview is functionally complete, but is in preview because we are actively seeking feedback on this feature. It is possible that we may make a breaking change in response to customer feedback, so we recommend not depending on the feature for use in production environments. If you have any feedback on preview features, please let us know using one of the mechanisms described in [How can I ask a question to the API Management team?](#how-can-i-ask-a-question-to-the-api-management-team).

### What are the supported options to secure the connection between the API Management gateway and my backend services?

There are several different supported options.

1. Use HTTP basic authentication. For more information, see [Configure API settings](api-management-howto-create-apis.md#configure-api-settings).
2. Use SSL mutual authentication as described in [How to secure back-end services using client certificate authentication in Azure API Management](api-management-howto-mutual-certificates.md).
3. Use IP whitelisting on your backend service. If you have a Standard or Premium tier API Management instance, the IP address of the gateway will remain constant and you can configure your whitelist to allow this IP address. You can retrieve the IP address of your API Management instance on the **Dashboard** in the Azure Classic Portal.
4. You can connect your API Management instance to an Azure Virtual Network (classic). For more information, see [How to setup VPN connections in Azure API Management](api-management-howto-setup-vpn.md).

### How can I copy an API Management instance to a new instance?

There are several different options you can use to copy an API Management service instance to a new instance.

-	Use the backup and restore capability of API Management. For more information, see [How to implement disaster recovery using service backup and restore in Azure API Management](api-management-howto-disaster-recovery-backup-restore.md).
-	Create your own backup and restore feature using the [API Management REST API](https://msdn.microsoft.com/library/azure/dn776326.aspx) to save and restore the desired entities from your service instance.
-	Download the service configuration using Git and upload it back up to a new instance. For more information, see [How to save and configure your API Management service configuration using Git](api-management-configuration-repository-git.md).

### Can I manage my API Management instance programmatically?

Yes, you can manage it using the [API Management REST API](https://msdn.microsoft.com/library/azure/dn776326.aspx), [Microsoft Azure API Management Service Management Library SDK](http://aka.ms/apimsdk), and [Service deployment](https://msdn.microsoft.com/library/mt619282.aspx) and [Service management](https://msdn.microsoft.com/library/mt613507.aspx) PowerShell cmdlets.

### How can I add a user to the Administrators group?

It can be achieved by following below steps: 

1. Login to the new [Azure Portal](https://portal.azure.com) 
2. Navigate to the resource group which contains the desired API Management instance
3. Add the desired user to "Api Management Contributor" role

Once that is done, the newly added contributor can use Azure PowerShell [cmdlets](https://msdn.microsoft.com/library/mt613507.aspx) to login as an administrator:

1. Use `Login-AzureRmAccount` cmdlet to login
2. Set the context to the subscription which contains the service using 
 	`Set-AzureRmContext -SubscriptionID <subscriptionGUID>`
3. Get SSO token using
   	`Get-AzureRmApiManagementSsoToken -ResourceGroupName <rgName> -Name <serviceName>`
4. Copy paste the URL in browser and the user should have admin portal access


### Why is the policy that I want to add not enabled in the policy editor?

If the policy that you want to add is not enabled, ensure that you are in the correct scope for that policy. Each policy statement is designed for use in certain scopes and policy sections. To review the policy sections and scopes for a policy, check the **Usage** section for that policy in the [Policy Reference](https://msdn.microsoft.com/library/azure/dn894080.aspx).


### How can I achieve API versioning with API Management?

-	You can configure distinct APIs in API Management representing different versions. For example, you may have `MyAPI v1` and `MyAPI v2` as two different APIs and developers can choose which version they want to use.
-	You can also configure your API with a service URL that does not include a version segment, for example: `https://my.api`. You can then configure a version segment on each operation's [Rewrite URL](https://msdn.microsoft.com/library/azure/dn894083.aspx#RewriteURL) template, for example you can have an operation with a [URL template](api-management-howto-add-operations.md#url-template) of `/resource` and [Rewrite URL](api-management-howto-add-operations.md#rewrite-url-template) template of `/v1/Resource`. That way you would be able to change version segment value on each operation separately.
-	If you'd like to keep a "default" version segment in the API's service URL then on selected operations you can set a policy that uses the [Set backend service](https://msdn.microsoft.com/library/azure/dn894083.aspx#SetBackendService) policy to change backend request path.

### How can I configure multiple environments of APIs, for example Sandbox and Production?

At this time, your options are:

-	You can host distinct APIs on the same tenant
-	You can host the same APIs on different tenants

### Is SOAP supported in API Management?

Currently, we offer limited support for SOAP within Azure API Management; it is a feature we are currently investigating. We would be very interested to get any example WSDLs from your customer and some description of the features they require, as this would help us in shaping our thinking. Please contact us using the contact information referenced in [How can I ask a question to the API Management team?](#how-can-i-ask-a-question-to-the-api-management-team)

If you need to get it working, some of our community have suggested work-arounds – see [Azure API Management - APIM, consuming a SOAP WCF service over HTTP](http://mostlydotnetdev.blogspot.com/2015/03/azure-api-management-apim-consuming.html).

Implementing the solution this way requires some manual configuration of policies, does not support WSDL import/export, and users will need to form up the body of requests made using the test console in the developer portal.

### Is the API Management gateway IP address constant? Can I use it in firewall rules?

In the Standard and Premium tiers the Public IP address (VIP) of the  API Management tenant is static for the lifetime of the tenant, with several  exceptions listed below. Note that Premium tier tenants configured for multi-region deployment are assigned one public IP address per region. 

The IP address will change in the following circumstances:

-	The service is deleted and recreated
-	The service subscription is suspended (for example for non-payment) and reinstated
-	VNET is added or removed (VNET is supported in the Premium tier only)
-	Regional address changes if the region is vacated and re-entered (Multi-region deployment supported in the Premium tier only)

The IP address (or addresses in the case of multi-region deployment) can be found on the tenant page in the Azure Classic Portal.

### Can I configure an OAUth 2.0 Authorization Server with ADFS security?

For information on configuring this scenario, see [Using ADFS in API Management](https://phvbaars.wordpress.com/2016/02/06/using-adfs-in-api-management/).

### What routing method does API Management use when deployed to multiple geographic locations? 

API Management uses the [Performance traffic routing method](../traffic-manager/traffic-manager-routing-methods.md#performance-traffic-routing-method). Incoming traffic will be routed to the closest API gateway. If one region goes offline, incoming traffic will be automatically routed to the next closest gateway. For more information about routing methods, see [Traffic Manager routing methods](../traffic-manager/traffic-manager-routing-methods.md).

### Can I create an API Management service instance using an ARM template?

Yes, see the [Azure API Management Service](http://aka.ms/apimtemplate) quickstart templates.

### Can I use a self-signed SSL certificate for a backend?

Yes. Please follow below steps:

1. Create a [Backend](https://msdn.microsoft.com/library/azure/dn935030.aspx) entity using the Management API
2. Set the skipCertificateChainValidation property to true
3. Once you no longer want to allow self-signed certificate, you can delete the Backend entity or set the skipCertificateChainValidation property to false

### Why am I getting authentication failure when I try to clone the GIT repository? 

If you are using GIT Credential Manager or trying to clone the repository through Visual Studio, you might be running into a known issue with Windows credential dialog which limits password length to only 127 characters and therefore truncates the password we generate. We are working on shortening the password. For now please use GIT Bash to clone. 
