---
title: 'Solution 3: Microsoft Entra ID with AD FS and Shibboleth'
description: This article describes design considerations for using Microsoft Entra ID with AD FS and Shibboleth as a multilateral federation solution for universities.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 04/01/2023
ms.author: jricketts
ms.custom: "it-pro"
ms.collection: M365-identity-device-management
---

# Solution 3: Microsoft Entra ID with AD FS and Shibboleth

In Solution 3, the federation provider is the primary identity provider (IdP). In this example, Shibboleth is the federation provider for the integration of multilateral federation apps, on-premises Central Authentication Service (CAS) apps, and any Lightweight Directory Access Protocol (LDAP) directories.

[![Diagram that shows a design integrating Shibboleth, Active Directory Federation Services, and Microsoft Entra ID.](media/multilateral-federation-solution-three/shibboleth-adfs-azure-ad.png)](media/multilateral-federation-solution-three/shibboleth-adfs-azure-ad.png#lightbox)

In this scenario, Shibboleth is the primary IdP. Participation in multilateral federations (for example, with InCommon) is done through Shibboleth, which natively supports this integration. On-premises CAS apps and the LDAP directory are also integrated with Shibboleth.

Student apps, faculty apps, and Microsoft 365 apps are integrated with Microsoft Entra ID. Any on-premises instance of Active Directory is synced with Microsoft Entra ID. Active Directory Federation Services (AD FS) provides integration with third-party multifactor authentication. AD FS performs protocol translation and enables certain Microsoft Entra features, such as Microsoft Entra join for device management, Windows Autopilot, and passwordless features.

## Advantages

Here are some of the advantages of using this solution:

* **Customized authentication**: You can customize the experience for multilateral federation apps through Shibboleth.

* **Ease of execution**: The solution is simple to implement in the short term for institutions that already use Shibboleth as their primary IdP. You need to migrate student and faculty apps to Microsoft Entra ID and add an AD FS instance.

* **Minimal disruption**: The solution allows third-party MFA. You can keep existing MFA solutions, such as Duo, in place until you're ready for an update.

## Considerations and trade-offs

Here are some of the trade-offs of using this solution:

* **Higher complexity and security risk**: An on-premises footprint might mean higher complexity for the environment and extra security risks, compared to a managed service. Increased overhead and fees might also be associated with managing on-premises components.

* **Suboptimal authentication experience**: For multilateral federation and CAS apps, there's no cloud-based authentication mechanism and there might be multiple redirects.

* **No Microsoft Entra multifactor authentication support**: This solution doesn't enable Microsoft Entra multifactor authentication support for multilateral federation or CAS apps. You might miss potential cost savings.

* **No granular Conditional Access support**: The lack of granular Conditional Access support limits your ability to make granular decisions.

* **Significant ongoing staff allocation**: IT staff must maintain infrastructure and software for the authentication solution. Any staff attrition might introduce risk.

## Migration resources

The following resources can help with your migration to this solution architecture.

| Migration resource   | Description           |
| - | - |
| [Resources for migrating applications to Microsoft Entra ID](../manage-apps/migration-resources.md) | List of resources to help you migrate application access and authentication to Microsoft Entra ID |

## Next steps

See these related articles about multilateral federation:

[Multilateral federation introduction](multilateral-federation-introduction.md)

[Multilateral federation baseline design](multilateral-federation-baseline.md)

[Multilateral federation Solution 1: Microsoft Entra ID with Cirrus Bridge](multilateral-federation-solution-one.md)

[Multilateral federation Solution 2: Microsoft Entra ID with Shibboleth as a SAML proxy](multilateral-federation-solution-two.md)

[Multilateral federation decision tree](multilateral-federation-decision-tree.md)
