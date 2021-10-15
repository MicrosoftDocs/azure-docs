---
title: Workload identity federation 
titleSuffix: Microsoft identity platform
description: Learn about workload identity federation, which developers can use to grant workloads running outside of Azure access to Azure resources without using secrets or certificates. This eliminates the need for developers to store and maintain long-lived secrets or certificates outside of Azure.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 10/14/2021
ms.author: ryanwi
ms.reviewer: keyam, udayh, vakarand
ms.custom: 
#Customer intent: As a developer, I want to learn about workload identity federation so that I can securely access Azure resources from external apps and services without needing to manage secrets. 
---

# Workload identity federation (preview)
This article provides an overview of workload identity federation for software workloads. Using workload identity federation allows you to access Azure and Microsoft Graph resources without needing to manage secrets.

You can use workload identity federation with GitHub Actions or Kubernetes.

## Why use workload identity federation?

Typically, a software workload (such as an application, service, script, or container) needs an identity in order to authenticate and access resources or communicate with other services.  When these workloads run on Azure, you can use managed identities and the Azure platform manages the credentials for you.  For a software workload running outside of Azure, you use application credentials (a secret or certificate) to access Azure or Microsoft Graph resources.  You need to manage these application credentials, which is a maintenance burden and adds the risk of leaking secrets or having certificates expire.

You use workload identity federation to configure an Azure AD app registration to trust tokens from an external identity provider (IdP), such as GitHub.  Once that trust relationship is created, your software workload can exchange trusted tokens from the external IdP for access tokens from Microsoft identity platform.  Your software workload then uses that access token to access Azure and Microsoft Graph resources to which the workload has been granted access. This eliminates the maintenance burden of manually managing credentials and eliminates the risk of leaking secrets or having certificates expire.

## Supported scenarios

The following scenarios are supported for accessing Azure and Microsoft Graph resources without needing to manage secrets:

- GitHub Actions. Configure a [trust relationship with GitHub](workload-identity-federation-create-trust-github.md) in the Azure portal or using Microsoft Graph. Then read the [GitHub Actions documentation](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure) for information on setting up your GitHub Actions workflow and accessing Azure resources.

- Workloads running on Kubernetes. Learn how to install the Azure AD workoad identity webhook and establish a trust relationship in the [Kubernetes](https://azure.github.io/azure-workload-identity/) content.

## How it works
Create a trust relationship between the external IdP and Microsoft identity platform. You create this trust by configuring a federated identity credential on an app registration in Azure AD in the Azure portal or through Microsoft Graph.  The steps for configuring the trust relationship will differ, depending on the scenario and external IdP.

The workflow for exchanging an external token for an access token is the same, however, for all scenarios. Let’s look at an example where GitHub will be the external IdP. GitHub issues a token to a GitHub Actions workflow. The Azure login action uses this token and requests Microsoft identity platform to exchange it for an access token. Microsoft identity platform validates the token issued by GitHub and checks the trust relationship on the Azure AD app registration for which a token is requested. When the checks are satisfied, Microsoft identity platform returns an access token to the workflow. The workflow then performs specific actions against Azure, for example deploying an application from a GitHub repo to Azure Functions or Azure App Service.  

The following diagram shows the general workflow of a workload exchanging an external token for an access token and then accessing Azure resources.

:::image type="content" source="media/workload-identity-federation/workflow.png" alt-text="Shows an external token exchanged for an access token and accessing Azure" border="false":::

1. The external workload requests a token from the external identity provider (IdP).
1. The external IdP issues a token to the external workload.
1. The external workload sends the token to Microsoft identity platform and requests an Azure AD access token.
1. Microsoft identity platform checks the trust relationship on the app registration and validates the external token.
1. Microsoft identity platform issues an Azure AD access token to the external workload.
1. The external workload accesses resources using the Azure AD access token.

## Next steps
Learn more about how workload identity federation works and:
- how Azure AD uses the [OAuth 2.0 client credentials grant](v2-oauth2-client-creds-grant-flow.md#get-a-token) and a client assertion issued by another IdP to get a token.
- how to create, delete, get, or update [federated identity credentials](/graph/api/resources/federatedidentitycredentials-overview?view=graph-rest-beta) on an app registration using Microsoft Graph.
