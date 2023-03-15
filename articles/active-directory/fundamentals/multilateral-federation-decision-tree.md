---
title: Univerity multilateral federation decision tree
description: Use this decision tree to help design a multilateral federation solution for universities.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 08/23/2022
ms.author: jricketts
ms.custom: "it-pro"
ms.collection: M365-identity-device-management
---

# Decision tree

The following is a decision tree you can use to help you determine the solution best suited for your environment.

[![Decision matrix with key criteria to help choose between solutions one, two, and three.](media/multilateral-federation-decision-tree/tradeoff-decision-matrix.png)](media/multilateral-federation-decision-tree/tradeoff-decision-matrix.png#lightbox)

## Migration resources

The following are resources to help with your migration to the solutions covered in this content.

| Migration Resource   | Description           | Relevant for  Migrating to... |
| - | - | - |
| [Resources for migrating applications to Azure Active Directory ](../manage-apps/migration-resources.md) | List of resources to help you migrate application access and authentication to Azure Active Directory (Azure AD) | Solution 1, Solution 2, and Solution 3 |
| Token Augmentation Documentation **TBA** | **TBA** | Solution 1 |
| [Custom security attributes documentation](../fundamentals/custom-security-attributes-manage.md) | This article describes how to manage access to custom security attributes | Solution 1 |
| [Azure Active Directory SSO integration with Cirrus Identity Bridge](../saas-apps/cirrus-identity-bridge-for-azure-ad-tutorial.md) | Tutorial to integrate Cirrus Identity Bridge for Azure AD with Azure Active Directory (Azure AD) | Solution 1 |
| [Cirrus Identity Bridge Overview](https://blog.cirrusidentity.com/documentation/azure-bridge-setup-rev-6.0) | Link to the documentation for the Cirrus Identity Bridge | Solution 1 |
| [Configuring Shibboleth as SAML Proxy](https://shibboleth.atlassian.net/wiki/spaces/KB/pages/1467056889/Using+SAML+Proxying+in+the+Shibboleth+IdP+to+connect+with+Azure+AD) | Link to a Shibboleth article that describes how to use SAML proxying feature to connect Shibboleth IdP to Azure AD | Solution 2 |
| [Azure MFA deployment considerations](../authentication/howto-mfa-getstarted.md) | Link to guidance for configuring multi-factor authentication (MFA) using Azure AD | Solution 1 and Solution 2 |

## Next steps

See these additional multilateral federation articles:

[Multilateral federation introduction](multilateral-federation-introduction.md)

[Multilateral federation  baseline design](multilateral-federation-baseline.md)

[Multilateral federation solution one - Azure AD with Cirrus Bridge](multilateral-federation-solution-one.md)

[Multilateral federation solution two - Azure AD to Shibboleth as SP Proxy](multilateral-federation-solution-two.md)

[Multilateral federation solution three - Azure AD with ADFS and Shibboleth](multilateral-federation-solution-three.md)