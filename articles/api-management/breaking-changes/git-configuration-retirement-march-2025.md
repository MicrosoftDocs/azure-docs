---
title: Azure API Management - Git configuration retirement (March 2025)
description: Azure API Management is retiring configuration management using a built-in Git repo as of March 2025. If you use the feature, adopt a configuration management solution such as APIOps.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 05/16/2024
ms.author: danlep
---

# Git configuration retirement (March 2025)

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../../includes/api-management-availability-premium-dev-standard-basic.md)]

Effective 15 March 2025, Azure API Management will retire the ability to manage the configuration of your service instance using the built-in Git repository. If you plan to continue using a Git repository to manage the configuration of your service instance after the retirement date, you must update your configuration management to use a different solution such as APIOps and your own Git repository implementation.

## Is my service affected by this?

A built-in [Git repository](../api-management-configuration-repository-git.md) to save and deploy service configuration information can be enabled in the Premium, Standard, Basic, and Developer tiers of API Management. While your API Management instance isn't affected by this change, you'll be unable to save and update your service configuration using API Management's built-in Git repository after the retirement date. 

Other tools such as the Azure portal, REST APIs, and Azure Resource Manager templates will continue to be available for managing your API Management service configuration.

## What is the deadline for the change?

Support for the built-in Git repository will no longer be available after 15 March 2025.

## What do I need to do?

From now through 15 March 2025, if you have an existing Azure API Management instance using the Git repository, you can continue to use it normally. At any time before the retirement date, update your configuration management to use a different solution and tools based on Azure Resource Management-based REST APIs and Azure RBAC. For example, use a [devops and CI/CD](../devops-api-development-templates.md) solution such as [APIOps](https://github.com/Azure/apiops) to extract and manage API Management configuration in your own your Git repository implementation like GitHub or Azure DevOps Repositories.

After the retirement date, if you create an API Management instance, you won't be able to activate the Git repository feature to save or update your service configuration.    

## Help and support

If you have questions, get answers from community experts in [Microsoft Q&A](/answers). If you have a support plan and you need technical help for the Git repository feature, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview):

1. Under **Issue type**, select **Technical**.
1. Under **Subscription**, select your subscription.  
1. Under **Service**, select **My services**, then select **API Management Service**.
1. Under **Resource**, select the Azure resource that you're creating a support request for. 
1. For **Summary**, type a description of your issue, for example, "Git repository".
1. For **Problem type**, select **Configuration and Management**.
1. For **Problem subtype**, select **Git Repository**.

For assistance with issues specific to APIOps, review [APIOps support documentation](https://github.com/Azure/apiops/blob/main/SUPPORT.md).  

## Related content

See all [upcoming breaking changes and feature retirements](overview.md).
