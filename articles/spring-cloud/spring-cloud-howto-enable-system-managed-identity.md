---
title: Enable system managed identity for application
description: How to enable system managed identity for application.
author:  MikeDodaro
ms.author: bmitchell287
ms.service: spring-cloud
ms.topic: how-to
ms.date: 05/13/2020

# How to enable system managed identity for application
Managed identities for Azure resources provide an automatically managed identity in Azure Active Directory to an Azure resource such as your Azure Spring Cloud application. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code.

In this article, you learn how to enable and disable system-assigned managed identities for an Azure Spring Cloud app, using the Azure portal and CLI (available from version 0.2.3).

## Prerequisites
If you're unfamiliar with managed identities for Azure resources, see [overview section](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview).
A deployed Azure Spring Cloud instance. Follow our [quickstart to deploy by using the Azure CLI](spring-cloud-quickstart-launch-app-cli.md) to get started.

## Add a system-assigned identity
Creating an app with a system-assigned identity requires setting an additional property on the application.

### Using Azure Portal
To set up a managed identity in the portal, first create an app, and then enable the feature.

1. Create an app in the portal as you normally would. Navigate to it in the portal.
2. Scroll down to the Settings group in the left navigation.
3. Select Identity.
4. Within the System assigned tab, switch Status to On. Click Save.

