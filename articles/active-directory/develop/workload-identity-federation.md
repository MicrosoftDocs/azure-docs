---
title: Workload identity federation 
titleSuffix: Microsoft identity platform
description: Learn about workload identity federation, which developers use to grant workloads running outside of Azure access to Azure resources without using secrets or certificates. This eliminates the need for developers to store and maintain long-lived secrets or certificates outside of Azure.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 10/01/2021
ms.author: ryanwi
ms.reviewer: keyam, udayh, vakarand
ms.custom: 
#As a developer, I want to learn what workload identity federation is, why I should use it, and how it works. 
---

# Workload identity federation (preview)
This article provides an overview of workload identity federation for external software workloads. Using workload identity federation, you can grant workloads running outside of Azure access to Azure resources without using secrets or certificates.

You can use workload identity federation with GitHub Actions or Kubernetes.

## Why use workload identity federation?

Typically, a software workload (such as an application, service, script, or container) needs an identity in order to authenticate and access resources or communicate with other services.  When these workloads run on Azure, developers can use managed identities and the Azure platform manages the credentials for those identities.  For a software workload running outside of Azure, developers use application credentials (a secret or certificate) to access Azure resources or call Microsoft Graph.  Those application credentials are stored outside of Azure and must be managed by the developer, which introduces a maintenance burden and the risk of leaking secrets or having certificates expire.

Workload identity federation allows an Azure AD application to trust tokens from an external identity provider (for example, GitHub) and exchange foreign tokens for access tokens from Microsoft identity platform.  Using that access token, the external workload can access resources on Azure. This eliminates the maintenance burden of manually managing credentials and eliminates the risk of leaking secrets or having certificates expire. 

## How it works
First, a trust relationship is created between the external identity provider and Microsoft identity platform. A federated identity credential is configured on an application object in Azure AD, which can be done in the *Azure portal* or through *Microsoft Graph*.

Each scenario has different methods for exchanging a foreign token for an access token and accessing Azure resources, but the underlying pattern remains the same. Let’s look at an example where GitHub Actions will be the foreign token issuer. GitHub issues a token to a GitHub Actions workflow. The Azure login action uses this token and requests Microsoft identity platform to exchange it for an access token. Identity platform validates the token issued by GitHub and checks that it is trusted by the Azure AD application for which a token is requested. When the checks are satisfied, identity platform returns an access token to the workflow. The workflow can then perform specific actions against Azure, for example deploying an application from a GitHub repo to Azure Functions or Azure App Service.  

The following diagram shows the general workflow of a workload exchanging a foreign token for an access token and then accessing Azure resources.

:::image type="content" source="media/workload-identity-federation/workflow.png" alt-text="Shows a foreign token exchanged for an access token and accessing Azure" border="false":::


## Next steps
Learn how Azure AD uses the [OAuth 2.0 client credentials grant](v2-oauth2-client-creds-grant-flow.md#get-a-token) and a client assertion issued by another identity provider to get a token.

Learn how to *deploy a web app to Azure App Service using GitHub Actions*.
