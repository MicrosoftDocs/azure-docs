---
title: Workload identity federation 
description: Use workload identity federation to grant workloads running outside of Azure access to Microsoft Entra protected resources without using secrets or certificates. This eliminates the need for developers to store and maintain long-lived secrets or certificates outside of Azure.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: workload-identities
ms.workload: identity
ms.topic: conceptual
ms.date: 09/15/2023
ms.author: ryanwi
ms.reviewer: shkhalid, udayh
ms.custom: aaddev 
#Customer intent: As a developer, I want to learn about workload identity federation so that I can securely access Microsoft Entra protected resources from external apps and services without needing to manage secrets. 
---

# Workload identity federation
This article provides an overview of workload identity federation for software workloads. Using workload identity federation allows you to access Microsoft Entra protected resources without needing to manage secrets (for supported scenarios).

You can use workload identity federation in scenarios such as GitHub Actions, workloads running on Kubernetes, or workloads running in compute platforms outside of Azure.

## Why use workload identity federation?

Watch this video to learn why you would use workload identity federation.
> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RWXamJ]

Typically, a software workload (such as an application, service, script, or container-based application) needs an identity in order to authenticate and access resources or communicate with other services.  When these workloads run on Azure, you can use [managed identities](../managed-identities-azure-resources/overview.md) and the Azure platform manages the credentials for you.  You can only use managed identities, however, for software workloads running in Azure.  For a software workload running outside of Azure, you need to use application credentials (a secret or certificate) to access Microsoft Entra protected resources (such as Azure, Microsoft Graph, Microsoft 365, or third-party resources).  These credentials pose a security risk and have to be stored securely and rotated regularly. You also run the risk of service downtime if the credentials expire.

You use workload identity federation to configure a [user-assigned managed identity](../managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) or [app registration](../develop/app-objects-and-service-principals.md) in Microsoft Entra ID to trust tokens from an external identity provider (IdP), such as GitHub or Google. The user-assigned managed identity or app registration in Microsoft Entra ID becomes an identity for software workloads running, for example, in on-premises Kubernetes or GitHub Actions workflows. Once that trust relationship is created, your external software workload exchanges trusted tokens from the external IdP for access tokens from Microsoft identity platform.  Your software workload uses that access token to access the Microsoft Entra protected resources to which the workload has been granted access. You eliminate the maintenance burden of manually managing credentials and eliminates the risk of leaking secrets or having certificates expire.

## Supported scenarios

The following scenarios are supported for accessing Microsoft Entra protected resources using workload identity federation:

- Workloads running on any Kubernetes cluster (Azure Kubernetes Service (AKS), Amazon Web Services EKS, Google Kubernetes Engine (GKE), or on-premises). Establish a trust relationship between your user-assigned managed identity or app in Microsoft Entra ID and a Kubernetes workload (described in the [workload identity overview](../../aks/workload-identity-overview.md)).
- GitHub Actions. First, configure a trust relationship between your [user-assigned managed identity](workload-identity-federation-create-trust-user-assigned-managed-identity.md) or [application](workload-identity-federation-create-trust.md) in Microsoft Entra ID and a GitHub repo in the [Microsoft Entra admin center](https://entra.microsoft.com) or using Microsoft Graph. Then [configure a GitHub Actions workflow](/azure/developer/github/connect-from-azure) to get an access token from Microsoft identity provider and access Azure resources.
- Google Cloud.  First, configure a trust relationship between your user-assigned managed identity or app in Microsoft Entra ID and an identity in Google Cloud. Then configure your software workload running in Google Cloud to get an access token from Microsoft identity provider and access Microsoft Entra protected resources. See [Access Microsoft Entra protected resources from an app in Google Cloud](https://blog.identitydigest.com/azuread-federate-gcp/).
- Workloads running in Amazon Web Services (AWS). First, configure a trust relationship between your user-assigned managed identity or app in Microsoft Entra ID and an identity in Amazon Cognito. Then configure your software workload running in AWS to get an access token from Microsoft identity provider and access Microsoft Entra protected resources.  See [Workload identity federation with AWS](https://blog.identitydigest.com/azuread-federate-aws/).
- Other workloads running in compute platforms outside of Azure. Configure a trust relationship between your [user-assigned managed identity](workload-identity-federation-create-trust-user-assigned-managed-identity.md) or [application](workload-identity-federation-create-trust.md) in Microsoft Entra ID and the external IdP for your compute platform. You can use tokens issued by that platform to authenticate with Microsoft identity platform and call APIs in the Microsoft ecosystem. Use the [client credentials flow](/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow#third-case-access-token-request-with-a-federated-credential) to get an access token from Microsoft identity platform, passing in the identity provider's JWT instead of creating one yourself using a stored certificate.
- SPIFFE and SPIRE are a set of platform agnostic, open-source standards for providing identities to your software workloads deployed across platforms and cloud vendors. First, configure a trust relationship between your user-assigned managed identity or app in Microsoft Entra ID and a SPIFFE ID for an external workload. Then configure your external software workload to get an access token from Microsoft identity provider and access Microsoft Entra protected resources.  See [Workload identity federation with SPIFFE and SPIRE](https://blog.identitydigest.com/azuread-federate-spiffe/).

> [!NOTE]
> Microsoft Entra ID issued tokens may not be used for federated identity flows. The federated identity credentials flow does not support tokens issued by Microsoft Entra ID.

## How it works

Create a trust relationship between the external IdP and a [user-assigned managed identity](workload-identity-federation-create-trust-user-assigned-managed-identity.md) or [application](workload-identity-federation-create-trust.md) in Microsoft Entra ID. The federated identity credential is used to indicate which token from the external IdP should be trusted by your application or managed identity. You configure a federated identity either:

- On a user-assigned managed identity through the [Microsoft Entra admin center](https://entra.microsoft.com), Azure CLI, Azure PowerShell, Azure SDK, and Azure Resource Manager (ARM) templates. The external workload uses the access token to access Microsoft Entra protected resources without needing to manage secrets (in supported scenarios). The [steps for configuring the trust relationship](workload-identity-federation-create-trust-user-assigned-managed-identity.md) will differ, depending on the scenario and external IdP.
- On an app registration in the [Microsoft Entra admin center](https://entra.microsoft.com) or through Microsoft Graph. This configuration allows you to get an access token for your application without needing to manage secrets outside Azure. For more information, learn how to [configure an app to trust an external identity provider](workload-identity-federation-create-trust.md).

The workflow for exchanging an external token for an access token is the same, however, for all scenarios. The following diagram shows the general workflow of a workload exchanging an external token for an access token and then accessing Microsoft Entra protected resources.

:::image type="content" source="media/workload-identity-federation/workflow.svg" alt-text="Diagram showing an external token exchanged for an access token and accessing Azure" border="false":::

1. The external workload (such as a GitHub Actions workflow) requests a token from the external IdP (such as GitHub).
1. The external IdP issues a token to the external workload.
1. The external workload (the login action in a GitHub workflow, for example) [sends the token to Microsoft identity platform](/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow#third-case-access-token-request-with-a-federated-credential) and requests an access token.
1. Microsoft identity platform checks the trust relationship on the [user-assigned managed identity](workload-identity-federation-create-trust-user-assigned-managed-identity.md) or [app registration](workload-identity-federation-create-trust.md) and validates the external token against the OpenID Connect (OIDC) issuer URL on the external IdP.
1. When the checks are satisfied, Microsoft identity platform issues an access token to the external workload.
1. The external workload accesses Microsoft Entra protected resources using the access token from Microsoft identity platform. A GitHub Actions workflow, for example, uses the access token to publish a web app to Azure App Service.

The Microsoft identity platform stores only the first 100 signing keys when they're downloaded from the external IdP's OIDC endpoint. If the external IdP exposes more than 100 signing keys, you may experience errors when using workload identity federation.

## Next steps
Learn more about how workload identity federation works:

- How to create, delete, get, or update [federated identity credentials](workload-identity-federation-create-trust-user-assigned-managed-identity.md) on a user-assigned managed identity.
- How to create, delete, get, or update [federated identity credentials](workload-identity-federation-create-trust.md) on an app registration.
-  Read the [workload identity overview](../../aks/workload-identity-overview.md) to learn how to configure a Kubernetes workload to get an access token from Microsoft identity provider and access Microsoft Entra protected resources.
- Read the [GitHub Actions documentation](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure) to learn more about configuring your GitHub Actions workflow to get an access token from Microsoft identity provider and access Microsoft Entra protected resources.
- How Microsoft Entra ID uses the [OAuth 2.0 client credentials grant](/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow#third-case-access-token-request-with-a-federated-credential) and a client assertion issued by another IdP to get a token.
- For information about the required format of JWTs created by external identity providers, read about the [assertion format](/azure/active-directory/develop/active-directory-certificate-credentials#assertion-format).
