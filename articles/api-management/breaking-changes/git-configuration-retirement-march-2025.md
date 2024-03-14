---
title: Azure API Management - Git configuration retirement (March 2025)
description: Azure API Management is retiring configuration management using a built-in Git repository as of March 2025. If you use the built-in repository for configuration management, adopt a configuration management solution such as ApiOps.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 03/14/2024
ms.author: danlep
---

# Git configuration retirement (March 2025)

As of 15 March 2025, Azure API Management will retire the ability to manage the configuration of your service instance using the built-in Git repository. If you plan to continue using a Git repository to manage the configuration of your service instance after the retirement date, you must update your configuration management to use a different solution such as ApiOps and your own Git repository implementation.

## Is my service affected by this?

A built-in [Git repository](../api-management-configuration-repository-git.md) to save and deploy service configuration information is a feature of the Premium, Standard, Basic, and Developer tiers of API Management. While your API Management instance isn't affected by this change, you'll be unable save and update your service configuration using API Management's built-in Git repository after the retirement date. 

## What is the deadline for the change?

Support for the built-in Git repository will no longer be available after 15 March 2025.

## What do I need to do?

Before the retirement date, update your configuration management to use a different solution and tools based on Azure Resource Management-based REST APIs. For example, use a [devops and CI/CD](../devops-api-development-templates.md) solution such as [ApiOps](/azure/architecture/example-scenario/devops/automated-api-deployments-apiops) to manage API configuration in your own Git repository. 

## Help and support

If you have questions, get answers from community experts in [Microsoft Q&A](https://learn.microsoft.com/answers). If you have a support plan and you need technical help for the Git repository feature, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview):

1. Under **Issue type**, select **Technical**.
1. Under **Subscription**, select your subscription.  
1. Under **Service**, click **My services**, then select **API Management Service**.
1. Under **Resource**, select the Azure resource that you’re creating a support request for. 
1. For **Summary**, type a description of your issue, for example, "Git repository".
1. For **Problem type**, select **Configuration and Management**.
1. For **Problem subtype**, select Git **Repository**.

For assistance with issues specific to APIOps, please review [APIOps support documentation](https://github.com/Azure/apiops/blob/main/SUPPORT.md).  

## Related content

See all [upcoming breaking changes and feature retirements](overview.md).
