---
title: Understanding and prioritizing weaknesses data in Firmware analysis
description: Learn what the weaknesses data are in the CVE view of the firmware analysis results.
author: karengu0
ms.author: karenguo
ms.topic: conceptual
ms.date: 03/05/2026
ms.service: azure
---

# Understand and prioritize weaknesses data in firmware analysis

Firmware analysis surfaces weaknesses detected in firmware components extracted during analysis. These signals help you understand potential security risks, but they should be interpreted carefully and in context.
This article explains weakness-related fields you may see in firmware analysis results, how they relate to one another, and how to evaluate them together to prioritize risk effectively.

> [!NOTE]
> The presence of a weakness or CVE in firmware analysis doesn't necessarily mean a device is vulnerable. Actual impact depends on how the affected component is used within the system.


## Weakness signals in firmware analysis

Firmware analysis enriches findings with multiple industry standard signals. Each signal represents a different aspect of risk and shouldn't be interpreted in isolation.


### Common Vulnerabilities and Exposures (CVE)

A CVE is a publicly disclosed identifier for a known security vulnerability.
Firmware analysis associates CVEs with extracted firmware components when a match is identified.
A single firmware component might be associated with multiple CVEs, and a single CVE might appear across multiple devices or components.

CVEs identify what the issue is, but they don't indicate impact or exploitability on their own.

For more information about CVE identifiers and the CVE program, see the official [Common Vulnerabilities and Exposures documentation maintained by MITRE](https://www.cve.org).


### CVSS scores and versions

Firmware analysis might display Common Vulnerability Scoring System (CVSS) data for a CVE.
Multiple CVSS versions can appear for the same CVE:
* CVSS v2 – legacy scoring used by older vulnerabilities
* CVSS v3 – widely adopted standard with improved metrics
* CVSS v4 – newer version that introduces extra dimensions

The presence of multiple CVSS versions reflects how vulnerability scoring evolves over time rather than multiple distinct vulnerabilities.

CVSS describes technical severity, not real-world likelihood of exploitation.

For more information about CVSS scoring and version differences, see the official [Common Vulnerability Scoring System (CVSS) documentation maintained by FIRST](https://www.first.org/cvss/).


### CVSS vector

In addition to a numeric score, CVSS includes a vector string that describes the factors contributing to the score, such as:
* Required access level
* Attack complexity
* Impact on confidentiality, integrity, and availability

The vector provides more context such as conditions and impact factors that contribute to a CVE’s severity rating.

For a full explanation of CVSS vector strings and metric meanings, see the [CVSS specification published by FIRST](https://www.first.org/cvss/specification-document).

For examples of how CVSS scores and vectors are published for CVEs, see the [NIST National Vulnerability Database (NVD)](https://nvd.nist.gov/vuln-metrics/cvss).


### CISA Known Exploited Vulnerabilities (KEV)

Some CVEs might be marked as part of the CISA Known Exploited Vulnerabilities (KEV) catalog.
This designation indicates that the vulnerability is known to be actively exploited in real-world scenarios.

> [!NOTE]
> - KEV status reflects observed exploitation activity, not whether a specific device is affected.
> - KEV status in firmware analysis is currently a static value, reflecting the state of the Firmware analysis CVE database at the time the scan was conducted. This value isn't updated dynamically. To view the most up-to-date KEV status, rescan your firmware image.

KEV is a strong signal of immediate risk.

For authoritative KEV status and remediation guidance, see the [CISA Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog).


### Exploit Prediction Scoring System (EPSS)

Firmware analysis might include EPSS data, which estimates the likelihood that a vulnerability will be exploited.
Two related values might appear:
* EPSS score – an estimated likelihood of exploitation based on observed trends across the vulnerability ecosystem 
* EPSS percentile – how that probability compares relative to other vulnerabilities

These values provide comparative risk context but don't guarantee exploitation.

To filter by EPSS in the Azure portal, specify the EPSS score in a decimal form (for example, for an EPSS score of `>50%`, filter for `>0.5`).

Percentile rankings are often more operationally useful, as they show how a CVE ranks relative to the broader vulnerability ecosystem.

> [!NOTE]
> - EPSS value is currently a static value, reflecting the state of the Firmware analysis CVE database at the time the scan was conducted. This value isn't updated dynamically. To view the most up-to-date EPSS status, rescan your firmware image.

EPSS provides a forward-looking likelihood signal, not a guarantee of exploitation.

For details on how EPSS scores and percentiles are calculated, see the [Exploit Prediction Scoring System documentation maintained by FIRST](https://www.first.org/epss/).


### Common Weakness Enumeration (CWE)

CWE represents the class of underlying weakness (for example, buffer overflow or improper input validation) that led to a vulnerability, rather than a specific vulnerability instance.
CWE identifiers provide more context by describing why a vulnerability exists, not just where it occurs.

CWE identifiers are informational and should be used for understanding root causes rather than prioritization by themselves.

> [!NOTE]
> CWE data reflects standardized weakness classifications defined by the MITRE Common Weakness Enumeration project. CWE identifiers are informational and don't indicate exploitability or impact on a specific device or firmware image by themselves.

For more information about CWE definitions and classifications, see the official [MITRE CWE documentation](https://cwe.mitre.org/).


### Exploit maturity

Exploit maturity describes the current state of exploit availability for a vulnerability, such as:

- Unproven
- Proof-of-concept
- Functional exploit
- Weaponized exploit

When present, exploit maturity information is typically surfaced alongside CVSS v4 scoring, and described in the [CVSS specification maintained by FIRST](https://www.first.org/cvss/v4.0/specification-document).


## Using weakness data together

Each weakness signal represents a different perspective:
* CVE - What the vulnerability is
* CVSS - Technical severity and impact
* KEV - Evidence of active exploitation
* EPSS - Likelihood of near-term exploitation
* Exploit maturity - Availability of exploit techniques
* CWE - Underlying weakness category

Evaluating these signals together provides a more complete understanding of potential risk than relying on any single field.

### Recommended evaluation order for prioritization

Effective prioritization requires more than severity scoring. The following structured model illustrates how weakness data can be evaluated holistically. This approach is guidance, not a prescriptive rule set.

1. Confirm exploitation status (KEV)
    * Treat KEV-listed weaknesses as highest priority
    * Don't downgrade KEV items based on CVSS score alone

    Confirmed exploitation should be evaluated before any scoring metric.

2. Assess exploit maturity
    * Elevate priority for weaknesses with functional or weaponized exploits
    * Combine exploit maturity with exposure characteristics

    Exploit availability increases real-world risk.

3. Evaluate exploitation likelihood (EPSS)
    * Use EPSS to differentiate between vulnerabilities with similar severity
    * Percentile rankings are often more actionable than raw scores
    * Combine EPSS with KEV and exploit maturity

    EPSS adds probabilistic context to prioritization decisions.

    > [!NOTE]
    > To filter by EPSS in the Azure portal, specify the EPSS score in a decimal form (for example, for an EPSS score of `>50%`, filter for `>0.5`).

4. Review attack vector and exposure

    From the CVSS vector, consider:
    * Network-accessible vulnerabilities vs. local or physical access
    * Authentication and user interaction requirements
    * Whether the affected component or service is exposed in the deployment

    A vulnerability may appear severe but present reduced risk if it isn't reachable in practice

5. Assess technical impact severity (CVSS)

    Use CVSS to understand impact if exploitation succeeds, not likelihood:
    * High or Critical severity: prioritize when exposure or likelihood is moderate or higher
    * Medium severity: prioritize based on exploitation signals and exposure
    * Low severity: deprioritize unless active exploitation or high exposure exists

    When likelihood is similar, address higher-impact vulnerabilities first.

6. Evaluate business impact (assess criticality)

    Asset criticality reflects organizational context and includes:
    * Whether the system is production or core infrastructure
    * Potential operational, safety, or compliance impact

    Business impact influences urgency but doesn't change vulnerability mechanics.

7. Consider fix availability 

    Remediation feasibility affects execution planning:
    * Patch or firmware update availability
    * Upgrade complexity
    * Available mitigations

    Fix availability should inform scheduling, but shouldn't override exploitation evidence.


## Important considerations

Always interpret weakness data alongside:
* Device role and exposure
* System configuration
* Firmware usage within the platform

> [!NOTE]
> Firmware analysis identifies potential risks based on extracted firmware content. It doesn't determine whether a vulnerability is reachable, exploitable, or impactful in a specific deployment.

## Next steps
To learn more about how firmware analysis extracts and presents component data, see [Interpreting extractor paths from SBOM view in firmware analysis](interpreting-extractor-paths.md).