---
title: Managed Ruleset Support Policy
titleSuffix: Azure Web Application Firewall
description: Learn about Azure WAF's managed ruleset support policy, including supported versions, upgrade recommendations, and extended support timelines.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 02/26/2026
zone_pivot_groups: web-application-firewall-types

#customer intent: As an IT admin, I want to understand the Azure WAF managed ruleset support policy so that I can ensure my applications remain secure and compliant.
---

# Azure Web Application Firewall managed ruleset support policy

::: zone pivot="application-gateway"

Azure Web Application Firewall supports a defined set of managed ruleset versions to ensure strong security protections, predictable behavior, and a clear upgrade path for customers. Azure manages the Default Rule Set (DRS), selected Core Rule Set (CRS) versions, Bot Management and HTTP DDoS rulesets, and periodically releases new rule set versions that include new protections, updated signatures, and rule improvements.

::: zone-end

::: zone pivot="front-door"

Azure Web Application Firewall supports a defined set of managed ruleset versions to ensure strong security protections, predictable behavior, and a clear upgrade path for customers. Azure manages the Default Rule Set (DRS), Bot Management, and HTTP DDoS rulesets versions and periodically releases new rule set versions that include new protections, updated signatures, and rule improvements.

::: zone-end

## Supported versions

Starting February 2026, Azure WAF actively **supports the latest three ruleset releases** in the following format:


- **N:** Latest available rule set version (for example, **DRS 2.2**)

- **N-1:** Previous rule set version (for example, **DRS 2.1**)

::: zone pivot="application-gateway"

- **N-2:** Second previous rule set version (for example, **CRS 3.2**)

::: zone-end

::: zone pivot="front-door"

- **N-2:** Second previous rule set version (for example, **DRS 2.0**)

::: zone-end

Only **N, N-1, and N-2 versions** are supported for general use and receive ongoing updates, improvements, and rule tuning from the Azure WAF team.

## Extended support for older rule sets

When a newer rule set version (**N**) is released to general availability, the ruleset that becomes **N-3** will enter a **final support phase**:

::: zone pivot="application-gateway"

- Once the newer ruleset version (N) is released, new Azure WAF policies can't be created with the **N-3** version, and any existing WAF policies with the N-3 version can't be attached.

::: zone-end

::: zone pivot="front-door"

- Once the newer ruleset version (N) is released, new Azure WAF policies can't be created with the **N-3** version.

::: zone-end

- The **N-3 version continues to be supported for 12 months** from the release date of the new **N** rule set, for existing WAF policies only. During these 12 months period, the N-3 version is eligible to receive **only critical security updates**.

- After the 12-month period, the N-3 version will no longer be supported. It won't receive any further updates, fixes, or support from the support team.

This rolling support window helps ensure that users have ample time to plan and migrate to supported versions while maintaining a clear lifecycle for managed rule sets.

## Upgrade recommendations

Users are encouraged to:

- Use the **latest rule set version (N)** where possible to benefit from the most current protections and rule coverage.

- Plan upgrades early, taking advantage of the **12-month final support period** for older rule sets.

::: zone pivot="application-gateway"

- Review [Upgrade CRS or DRS ruleset version](/azure/web-application-firewall/ag/upgrade-ruleset-version) for breaking changes, added rules, and tuning guidance when moving between major rule set versions.

::: zone-end

> [!WARNING]
> Failure to upgrade beyond the final support period might expose applications to unpatched vulnerabilities and reduced managed rule coverage.

## Ruleset support schedule

::: zone pivot="application-gateway"

The following tables summarize the current support status and planned end of support dates for managed rulesets of Azure WAF on Application Gateway:

::: zone-end

::: zone pivot="front-door"

The following tables summarize the current support status and planned end of support dates for managed rulesets of Azure WAF on Front Door:

::: zone-end

### Default rulesets

::: zone pivot="application-gateway"

| **Ruleset version** | **Release date** | **Support status** | **Support end date** |
|---|---|---|---|
| **DRS 2.2** | February 2026 | Supported | Not defined yet |
| **DRS 2.1** | October 2023 | Supported | Not defined yet |
| **CRS 3.2** | August 2021 | Supported | Not defined yet. Support ends one year after the release of the **first** DRS version newer than DRS 2.2 |
| **CRS 3.1** <br> **CRS 3.0** | N/A | Supported | February 26, 2027 |
| **CRS 2.2.9** | N/A | Not supported | March 15, 2025 |

::: zone-end

::: zone pivot="front-door"

| **Ruleset version** | **Release date** | **Support status** | **Support end date** |
|---|---|---|---|
| **DRS 2.2** | February 2026 | Supported | Not defined yet |
| **DRS 2.1** | October 2023 | Supported | Not defined yet |
| **DRS 2.0** | August 2021 | Supported | Not defined yet. Support ends one year after the release of the **first** DRS version newer than DRS 2.2 |
| **DRS 1.2** <br> **DRS 1.1** <br> **DRS 1.0** | N/A | Supported | February 26, 2027 |

::: zone-end

### Bot management ruleset

::: zone pivot="application-gateway"

| **Ruleset version** | **Release date** | **Support status** | **Support end date** |
|----|----|----|----|
| **Bot Management 1.1** | October 2024 | Supported | Not defined yet |
| **Bot Management 1.0** | July 2021 | Supported | Not defined yet |
| **Bot Management 0.1** | N/A | Not supported | Preview version - not supported |

### HTTP DDoS ruleset

| **Ruleset version** | **Release date** | **Support status** | **Support end date** |
|----|----|----|----|
| **HTTP DDoS Ruleset 1.0** | November 2025 | Supported | Not defined yet |

::: zone-end

::: zone pivot="front-door"

| **Ruleset version** | **Release date** | **Support status** | **Support end date** |
|----|----|----|----|
| **Bot Management 1.1** | October 2024 | Supported | Not defined yet |
| **Bot Management 1.0** | July 2021 | Supported | Not defined yet |

::: zone-end

## Related content

::: zone pivot="application-gateway"

- [DRS and CRS rule groups and rules](/azure/web-application-firewall/ag/application-gateway-crs-rulegroups-rules)
- [Upgrade CRS or DRS ruleset version](/azure/web-application-firewall/ag/upgrade-ruleset-version)
- [Customize WAF rules](/azure/web-application-firewall/ag/application-gateway-customize-waf-rules-portal)

::: zone-end

::: zone pivot="front-door"

- [DRS rule groups and rules](/azure/web-application-firewall/afds/waf-front-door-drs)
- [WAF exclusion lists](/azure/web-application-firewall/afds/waf-front-door-exclusion)

::: zone-end

