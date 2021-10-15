---
title: Create a trust relationship with GitHub"
titleSuffix: Microsoft identity platform
description: 
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 10/13/2021
ms.author: ryanwi
ms.custom: aaddev
#Customer intent: As an application developer, I want to configure a federated credential on an app registration so I can create a trust relationship with GitHub and use workload identity federation to access Azure resources without managing secrets.
---

# Create a trust relationship with GitHub
This article describes how to configure a trust relationship with GitHub on an app registration.  Create a federated credential in the Azure portal or by using Microsoft Graph.

Anyone who can create an app reg and add a secret or cert can add a federated credential.  If the "don't let anyone create apps" switch is toggled, however, a dev won't be able to create an app reg or configure the credential.  Admin would have to do it on behalf of the dev.  Anyone in the app admin role or app owner role can do this.

## Prerequistes
Create an app registration in Azure AD in the Azure portal.  

## Configure the federated credentials on the application.

Navigate to the app registration in the Azure portal and setup a federated credential.

The **Organization**, **Repository**, and **Entity type** values must exactly match the configuration on the GitHub workflow configuration.  Otherwise Azure AD will look at the token and reject the exchange.  Won't get an error, it just won't work.

what if I accidently configure someone else's github repo?  Put typo in config settings that matches someone elses repo?  In Azure portal, would be able to configure.  But in GitHub configuration would get an error because you can't access the other person's repo.

## Give the app registration appropriate access to the Azure resources targeted by your GitHub workflow

Grant the application contributor role on a subscription; copy Subscription ID

## Get the application (client) ID and tenant ID from Azure Portal

Copy the *tenant-id* and *client-id* values of the app registration.  You need to set these values in your GitHub environment to use in the workflow Azure login action.  Two options now for GitHub in Azure Login Action.  Can store client ID and tenant ID in GitHub secrets if you want or you can inline client ID, tenant ID, subscription ID directly in your workflow.

## Next steps
Access Azure resources from [GitHub Actions](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure).