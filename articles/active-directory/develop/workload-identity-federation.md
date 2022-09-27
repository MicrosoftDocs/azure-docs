---
title: Workload identity federation 
description: Use workload identity federation to grant workloads running outside of Azure access to Azure AD protected resources without using secrets or certificates. This eliminates the need for developers to store and maintain long-lived secrets or certificates outside of Azure.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 08/29/2022
ms.author: ryanwi
ms.reviewer: shkhalid, udayh, vakarand
ms.custom: aaddev 
#Customer intent: As a developer, I want to learn about workload identity federation so that I can securely access Azure AD protected resources from external apps and services without needing to manage secrets. 
---

# Workload identity federation
This article provides an overview of workload identity federation for software workloads. Using workload identity federation allows you to access Azure Active Directory (Azure AD) protected resources without needing to manage secrets (for supported scenarios).

You can use workload identity federation in scenarios such as GitHub Actions, workloads running on Kubernetes, or workloads running in compute platforms outside of Azure.

## Why use workload identity federation?

Typically, a software workload (such as an application, service, script, or container-based application) needs an identity in order to authenticate and access resources or communicate with other services.  When these workloads run on Azure, you can use managed identities and the Azure platform manages the credentials for you.  For a software workload running outside of Azure, you need to use application credentials (a secret or certificate) to access Azure AD protected resources (such as Azure, Microsoft Graph, Microsoft 365, or third-party resources).  These credentials pose a security risk and have to be stored securely and rotated regularly. You also run the risk of service downtime if the credentials expire.

You use workload identity federation to configure an Azure AD app registration to trust tokens from an external identity provider (IdP), such as GitHub.  Once that trust relationship is created, your software workload can exchange trusted tokens from the external IdP for access tokens from Microsoft identity platform.  Your software workload then uses that access token to access the Azure AD protected resources to which the workload has been granted access. This eliminates the maintenance burden of manually managing credentials and eliminates the risk of leaking secrets or having certificates expire.

## Supported scenarios
> [!NOTE]
> Azure AD issued tokens may not be used for federated identity flows. The federated identity credentials flow does not support tokens issued by Azure AD.

The following scenarios are supported for accessing Azure AD protected resources using workload identity federation:

- GitHub Actions. First, [Configure a trust relationship](workload-identity-federation-create-trust-github.md) between your app in Azure AD and a GitHub repo in the Azure portal or using Microsoft Graph. Then [configure a GitHub Actions workflow](/azure/developer/github/connect-from-azure) to get an access token from Microsoft identity provider and access Azure resources.
- Google Cloud.  First, configure a trust relationship between your app in Azure AD and an identity in Google Cloud. Then configure your software workload running in Google Cloud to get an access token from Microsoft identity provider and access Azure AD protected resources. See [Access Azure AD protected resources from an app in Google Cloud](workload-identity-federation-create-trust-gcp.md).
- Workloads running on Kubernetes. Install the Azure AD workload identity webhook and establish a trust relationship between your app in Azure AD and a Kubernetes workload (described in the [Kubernetes quickstart](https://azure.github.io/azure-workload-identity/docs/quick-start.html)).
- Workloads running in compute platforms outside of Azure. [Configure a trust relationship](workload-identity-federation-create-trust.md) between your Azure AD application registration and the external IdP for your compute platform. You can use tokens issued by that platform to authenticate with Microsoft identity platform and call APIs in the Microsoft ecosystem. Use the [client credentials flow](v2-oauth2-client-creds-grant-flow.md#third-case-access-token-request-with-a-federated-credential) to get an access token from Microsoft identity platform, passing in the identity provider's JWT instead of creating one yourself using a stored certificate.

## How it works
Create a trust relationship between the external IdP and an app in Azure AD by configuring a [federated identity credential](/graph/api/resources/federatedidentitycredentials-overview?view=graph-rest-beta&preserve-view=true). The federated identity credential is used to indicate which token from the external IdP should be trusted by your application. You configure the federated identity credential on your app registration in the Azure portal or through Microsoft Graph.  The steps for configuring the trust relationship will differ, depending on the scenario and external IdP.

The workflow for exchanging an external token for an access token is the same, however, for all scenarios. The following diagram shows the general workflow of a workload exchanging an external token for an access token and then accessing Azure AD protected resources.

:::image type="content" source="media/workload-identity-federation/workflow.svg" alt-text="Shows an external token exchanged for an access token and accessing Azure" border="false":::

1. The external workload (such as a GitHub Actions workflow) requests a token from the external IdP (such as GitHub).
1. The external IdP issues a token to the external workload.
1. The external workload (the login action in a GitHub workflow, for example) [sends the token to Microsoft identity platform](v2-oauth2-client-creds-grant-flow.md#third-case-access-token-request-with-a-federated-credential) and requests an access token.
1. Microsoft identity platform checks the [trust relationship](workload-identity-federation-create-trust.md) on the app registration and validates the external token against the Open ID Connect (OIDC) issuer URL on the external IdP.
1. When the checks are satisfied, Microsoft identity platform issues an access token to the external workload.
1. The external workload accesses Azure AD protected resources using the access token from Microsoft identity platform. A GitHub Actions workflow, for example, uses the access token to publish a web app to Azure App Service.

The Microsoft identity platform stores only the first 25 signing keys when they're downloaded from the external IdP's OIDC endpoint. If the external IdP exposes more than 25 signing keys, you may experience errors when using Workload Identity Federation.

## Next steps
Learn more about how workload identity federation works:
- How Azure AD uses the [OAuth 2.0 client credentials grant](v2-oauth2-client-creds-grant-flow.md#third-case-access-token-request-with-a-federated-credential) and a client assertion issued by another IdP to get a token.
- How to create, delete, get, or update [federated identity credentials](/graph/api/resources/federatedidentitycredentials-overview) on an app registration using Microsoft Graph.
- Read the [GitHub Actions documentation](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure) to learn more about configuring your GitHub Actions workflow to get an access token from Microsoft identity provider and access Azure resources.
- For information about the required format of JWTs created by external identity providers, read about the [assertion format](active-directory-certificate-credentials.md#assertion-format).
