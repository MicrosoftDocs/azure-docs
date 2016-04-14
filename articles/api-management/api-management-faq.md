<properties 
	pageTitle="Azure API Management FAQ | Microsoft Azure" 
	description="Learn the answers to common questions, patterns and best practices for Azure API Management." 
	services="api-management" 
	documentationCenter="" 
	authors="steved0x" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/12/2016" 
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

### How can I ask a question to the API Management team?

-	You can post your questions to our [API Management MSDN forum](https://social.msdn.microsoft.com/forums/azure/home?forum=azureapimgmt).
-	You can also send us an email at: `apimgmt@microsoft.com`.

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

Yes, you can manage it using the [API Management REST API](https://msdn.microsoft.com/library/azure/dn776326.aspx), and [Service deployment](https://msdn.microsoft.com/library/mt619282.aspx) and [Service management](https://msdn.microsoft.com/library/mt613507.aspx) PowerShell cmdlets.

### How can I add a user to the Administrators group?

At this time, administrators are limited to users that log in through the Azure Classic Portal as administrators or co-administrators on the Azure subscription that contains the API Management instance. Users created in the publisher portal cannot be designated as administrators or added to the administrators group.


### Why is the policy that I want to add not enabled in the policy editor?

If the policy that you want to add is not enabled, ensure that you are in the correct scope for that policy. Each policy statement is designed for use in certain scopes and policy sections. To review the policy sections and scopes for a policy, check the **Usage** section for that policy in the [Policy Reference](https://msdn.microsoft.com/library/azure/dn894080.aspx).


