<properties
	pageTitle="Azure API Management FAQ | Microsoft Azure"
	description="Learn the answers to common questions, patterns, and best practices for Azure API Management."
	services="api-management"
	documentationCenter=""
	authors="miaojiang"
	manager="erikre"
	editor=""/>

<tags
	ms.service="api-management"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/09/2016"
	ms.author="mijiang"/>

# Azure API Management FAQ

Get the answers to common questions, patterns, and best practices for Azure API Management.

## Frequently asked questions

-	[How can I ask a question to the API Management team?](#how-can-i-ask-a-question-to-the-api-management-team)
-	[What does it mean when a feature is in Preview?](#what-does-it-mean-when-a-feature-is-in-preview)
-	[What are the supported options to secure the connection between the API Management gateway and my backend services?](#what-are-the-supported-options-to-secure-the-connection-between-the-api-management-gateway-and-my-backend-services)
-	[How can I copy an API Management instance to a new instance?](#how-can-i-copy-an-api-management-instance-to-a-new-instance)
-	[Can I manage my API Management instance programmatically?](#can-i-manage-my-api-management-instance-programmatically)
-	[How can I add a user to the Administrators group?](#how-can-i-add-a-user-to-the-administrators-group)
-	[Why is the policy that I want to add not enabled in the policy editor?](#why-is-the-policy-that-i-want-to-add-not-enabled-in-the-policy-editor)
-	[How can I achieve API versioning with API Management?](#how-can-i-achieve-api-versioning-with-api-management)
-	[How can I configure multiple environments of APIs, for example Sandbox and Production?](#how-can-i-configure-multiple-environments-of-apis-for-example-sandbox-and-production)
-	[Is SOAP supported in API Management?](#is-soap-supported-in-api-management)
-	[Is the API Management gateway IP address constant? Can I use it in firewall rules?](#is-the-api-management-gateway-ip-address-constant-can-i-use-it-in-firewall-rules)
-	[Can I configure an OAuth 2.0 authorization server with ADFS security?](#can-i-configure-an-oauth-20-authorization-server-with-adfs-security)
-	[What routing method does API Management use when deployed to multiple geographic locations?](#what-routing-method-does-api-management-use-when-deployed-to-multiple-geographic-locations)
-	[Can I create an API Management service instance using an ARM template?](#can-i-create-an-api-management-service-instance-using-an-arm-template)
-	[Can I use a self-signed SSL certificate for a backend?](#can-i-use-a-self-signed-ssl-certificate-for-a-backend)
-	[Why am I getting authentication failure when I try to clone the GIT repository?] (#why-am-i-getting-authentication-failure-when-i-try-to-clone-the-git-repository)
-	[Does API Management work with Express Route?](#does-api-management-work-with-express-route)
-	[Can I move API Management instance from one subscription to another?](#can-i-move-api-management-instance-from-one-subscription-to-another)


### How can I ask the Microsoft Azure API Management team a question?

You have three options for contacting us:

-	Post your questions in our [API Management MSDN forum](https://social.msdn.microsoft.com/forums/azure/home?forum=azureapimgmt).
-	Send us email at apimgmt@microsoft.com`.
-	You can send us a [feature request](https://feedback.azure.com/forums/248703-api-management).

### What does it mean when a feature is in preview?

A feature in preview is functionally complete, but we are actively seeking feedback on the feature. It's possible that we'll make a breaking change in response to customer feedback, so we recommend that you don't depend on the feature in a production environment. If you have any feedback on preview features, please let us know through one of the contact options in [How can I ask a question to the API Management team?](#how-can-i-ask-a-question-to-the-api-management-team).

### What are the supported options to secure the connection between the API Management gateway and my back-end services?

You have several different options to secure the connection between the API Management gateway and your back-end services.

-	Use HTTP basic authentication. For more information, see [Configure API settings](api-management-howto-create-apis.md#configure-api-settings).
- Use SSL mutual authentication as described in [How to secure back-end services using client certificate authentication in Azure API Management](api-management-howto-mutual-certificates.md).
- Use IP whitelisting on your back-end service. If you have a Standard or Premium tier API Management instance, the IP address of the gateway remains constant. You can set your whitelist to allow this IP address. Retrieve the IP address of your API Management instance on the **Dashboard** in the Azure portal.
- You can connect your API Management instance to an Azure Virtual Network (classic). For more information, see [How to set up VPN connections in Azure API Management](api-management-howto-setup-vpn.md).

### How do I copy an API Management instance to a new instance?

You have several options if you want to copy an API Management service instance to a new instance.

-	Use the backup and restore function in API Management. For more information, see [How to implement disaster recovery using service backup and restore in Azure API Management](api-management-howto-disaster-recovery-backup-restore.md).
-	Create your own backup and restore feature by using the [API Management REST API](https://msdn.microsoft.com/library/azure/dn776326.aspx). Use the REST API to save and restore the entities from your service instance that you want.
-	Download the service configuration by using Git and upload it to a new instance. For more information, see [How to save and configure your API Management service configuration using Git](api-management-configuration-repository-git.md).

### Can I manage my API Management instance programmatically?

Yes, you can manage API Management programmatically by using the [API Management REST API](https://msdn.microsoft.com/library/azure/dn776326.aspx); the [Microsoft Azure API Management Service Management Library SDK](http://aka.ms/apimsdk); and the [Service deployment](https://msdn.microsoft.com/library/mt619282.aspx) and [Service management](https://msdn.microsoft.com/library/mt613507.aspx) PowerShell cmdlets.

### How do I add a user to the Administrators group?

Here's how you add a user to the Administrators group:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Go to the resource group that has the API Management instance you want to update.
3. In API Management, assign the **Api Management Contributor** role to the user.

Now the newly added contributor can use Azure PowerShell [cmdlets](https://msdn.microsoft.com/library/mt613507.aspx). Here's how to sign in as an administrator:

1. Sign in by using the `Login-AzureRmAccount` cmdlet.
2. Set the context to the subscription that has the service by using `Set-AzureRmContext -SubscriptionID <subscriptionGUID>`.
3. Get a single sign-on URL by using `Get-AzureRmApiManagementSsoToken -ResourceGroupName <rgName> -Name <serviceName>`.
4. Use the URL to access the admin portal.


### Why is the policy that I want to add unavailable in the policy editor?

If the policy that you want to add appears dimmed or shaded in the policy editor, be sure that you are in the correct scope for the policy. Each policy statement is designed for you to use in specific scopes and policy sections. To review the policy sections and scopes for a policy, see the policy's **Usage** section in the [Policy Reference](https://msdn.microsoft.com/library/azure/dn894080.aspx).


### How do I use API versioning in API Management?

-	In API Management, you can configure APIs to represent different versions. For example, you might have two different APIs, MyAPI v1 and MyAPI v2. A developer can choose the version that the developer wants to use.
-	You also can configure your API with a service URL that doesn't include a version segment, for example, https://my.api. Then, configure a version segment on each operation's [Rewrite URL](https://msdn.microsoft.com/library/azure/dn894083.aspx#RewriteURL) template. For example, you can have an operation with a [URL template](api-management-howto-add-operations.md#url-template) called `/resource`, and a [Rewrite URL](api-management-howto-add-operations.md#rewrite-url-template) template called `/v1/Resource`. You could change the version segment value separately for each operation.
-	If you'd like to keep a "default" version segment in the API's service URL, on selected operations, set a policy that uses the [Set backend service](https://msdn.microsoft.com/library/azure/dn894083.aspx#SetBackendService) policy to change the backend request path.

### How do I set up multiple environments in a single API, for example, in a sandbox environment and a production environment?

Here's how to set up multiple environments in a single API:

-	Host different APIs on the same tenant
-	Host the same APIs on different tenants

### Can I use SOAP with API Management?

Currently, we offer limited support for Simple Object Access Protocol (SOAP) with Azure API Management. It is a feature we are investigating. We are interested in seeing examples of your Web Services Description Language (WSDL) documents. This would help us validate our thinking. Please contact us through one of the contact methods in [How can I ask a question to the API Management team?](#how-can-i-ask-a-question-to-the-api-management-team).

If you need to get SOAP with API Management working right now, some members of our community have suggested workarounds. For details, see [Azure API Management - APIM, consuming a SOAP WCF service over HTTP](http://mostlydotnetdev.blogspot.com/2015/03/azure-api-management-apim-consuming.html).

If you implement the solution the way it's described in the blog post, you'll need to configure some aspects of the policies manually. SOAP with API Management doesn't support WSDL import or export. Users need to form up the body of requests made by using the test console in the developer portal.

### Is the API Management gateway IP address constant? Can I use it in firewall rules?

In the Standard and Premium tiers, the public IP address (VIP) of the API Management tenant is static for the lifetime of the tenant, with the following exceptions. Note that Premium tier tenants that are configured for multi-region deployment are assigned one public IP address per region.

The IP address changes in the following circumstances:

-	The service is deleted and then re-created.
-	The service subscription is suspended (for example, for nonpayment) and then reinstated.
-	You add or remove Azure Virtual Network (you can use Virtual Network only at the Premium tier).

For multi-region deployments, the regional address changes if the region is vacated and then reinstated (you can use multi-region deployment only at the Premium tier).

You can get your IP address (or addresses, in a multi-region deployment) on the tenant page in the Azure portal.

### Can I configure an OAuth 2.0 authorization server with ADFS security?

Learn how to configure an OAuth 2.0 authorization server with Active Directory Federation Services (ADFS) security in [Using ADFS in API Management](https://phvbaars.wordpress.com/2016/02/06/using-adfs-in-api-management/).

### What routing method does API Management in deployments to multiple geographic locations?

API Management uses the [Performance traffic routing method](../traffic-manager/traffic-manager-routing-methods.md#performance-traffic-routing-method). Incoming traffic is routed to the closest API gateway. If one region goes offline, incoming traffic is automatically routed to the next closest gateway. Learn more about routing methods in [Traffic Manager routing methods](../traffic-manager/traffic-manager-routing-methods.md).

### Can I create an API Management service instance by using an Azure Resource Manager template?

Yes. See the [Azure API Management Service](http://aka.ms/apimtemplate) QuickStart templates.

### Can I use a self-signed SSL certificate for a back end?

Yes. Here's how to use a self-signed Secure Sockets Layer (SSL) certificate for a back end:

1. Create a [back-end](https://msdn.microsoft.com/library/azure/dn935030.aspx) entity by using API Management.
2. Set the `skipCertificateChainValidation` property to **true**.
3. When you no longer want to allow self-signed certificates, delete the Backend entity, or set the `skipCertificateChainValidation` property to **false**.

### Why do I get an authentication failure when I try to clone the Git repository?

If you use Git Credential Manager or you're trying to clone the repository by using Visual Studio, you might run into a known issue with the Windows credential dialog box. The dialog box limits password length to 127 characters, and truncates the password we generate. We are working on shortening the password. For now, please use Git Bash to clone.

### Does API Management work with Azure ExpressRoute?

Yes!

### Can I move an API Management service from one subscription to another?

Yes! Learn how to [move your API Management service to a different subscription](../resource-group-move-resources.md).
