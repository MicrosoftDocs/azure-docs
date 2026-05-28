---
title: Understand and Prioritize Weaknesses Data in Firmware Analysis
description: Learn about weaknesses data in the CVE view of the firmware analysis results.
author: karengu0
ms.author: karenguo
ms.topic: conceptual
ms.date: 03/05/2026
ms.service: azure
---

# Understand and prioritize weaknesses data in firmware analysis

Firmware analysis identifies weaknesses in firmware components. These results can help you understand potential security risks, but you should interpret them carefully and in the appropriate context.

This article explains weakness-related fields you might see in firmware analysis results. It explains how these fields relate to one another and how to collectively evaluate them to effectively prioritize risk.

> [!NOTE]
> The presence of a weakness or Common Vulnerabilities and Exposures (CVE) vulnerability in firmware analysis doesn't necessarily mean a device is vulnerable. The actual impact of a weakness depends on how the affected component is used within the system.

## Weakness signals in firmware analysis

Firmware analysis can improve findings with multiple, industry-standard signals. Each signal represents a different aspect of risk and shouldn't be interpreted in isolation.

###  Common Vulnerabilities and Exposures (CVE)

CVEs are known security vulnerabilities that are publicly disclosed. Firmware analysis associates CVEs with extracted firmware components when a match is identified. A single firmware component might be associated with multiple CVEs, and a single CVE might appear across multiple devices or components.

CVEs highlight an issue, but they don't solely indicate the issue's impact or exploitability.

For more information about CVEs and the CVE program, see the official [Common Vulnerabilities and Exposures documentation](https://www.cve.org) that MITRE maintains.

### CVSS scores and versions

Firmware analysis might display Common Vulnerability Scoring System (CVSS) data for a CVE.

Multiple CVSS versions can appear for the same CVE:

- **CVSS v2**: Legacy scoring that pertains to older vulnerabilities.
- **CVSS v3**: Widely adopted standard with improved metrics.
- **CVSS v4**: Newer version that introduces extra dimensions.

There are multiple CVSS versions because vulnerability scoring evolved over time. Seeing multiple versions for one CVE doesn't mean there are multiple distinct vulnerabilities.

CVSS scores describe technical severity, not the real-world likelihood of exploitation.

For more information about CVSS scoring and version differences, see the official [Common Vulnerability Scoring System (CVSS) documentation](https://www.first.org/cvss/) that FIRST maintains.

### CVSS vector

In addition to a numeric score, a CVSS result includes a vector string that describes factors that contribute to the score, such as:

- Required access level.
- Attack complexity.
- Impact on confidentiality, integrity, and availability.

The vector provides more context, like the conditions and impact factors that contribute to a CVE's severity rating.

For a full explanation of CVSS vector strings and metric meanings, see the [CVSS specification](https://www.first.org/cvss/specification-document) that's published by FIRST.

For examples of how CVSS scores and vectors are published for CVEs, see the [National Institute of Standards and Technology (NIST) National Vulnerability Database (NVD)](https://nvd.nist.gov/vuln-metrics/cvss).

### CISA Known Exploited Vulnerabilities (KEV)

Some CVEs might be marked as part of the Cybersecurity and Infrastructure Security Agency (CISA) Known Exploited Vulnerabilities (KEV) catalog. This designation indicates that the vulnerability is known to be actively exploited in real-world scenarios.

> [!NOTE]
>
> - KEV status reflects observed exploitation activity, not whether a specific device is affected.
> - KEV status in firmware analysis is currently a static value. It reflects the state of the firmware analysis CVE database at the time the scan was conducted. This value isn't updated dynamically. To view the most up-to-date KEV status, re-scan your firmware image.

KEV is a strong signal of immediate risk.

For authoritative KEV status and remediation guidance, see the [CISA Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog).

### EPSS

Firmware analysis might include Exploit Prediction Scoring System (EPSS) data, which estimates the likelihood that a vulnerability will be exploited.

Two related values might appear:

- **EPSS score**: The estimated likelihood of exploitation based on observed trends across the vulnerability ecosystem.
- **EPSS percentile**: How the score compares, relative to other vulnerabilities.

These values provide comparative risk context but don't guarantee exploitation.

To filter by EPSS in the Azure portal, specify the EPSS score in a decimal form. For example, for an EPSS score of `>50%`, filter for `>0.5`.

Percentile rankings are often more operationally useful, as they show how a CVE ranks relative to the broader vulnerability ecosystem.

> [!NOTE]
> The EPSS value is currently static. It reflects the state of the firmware analysis CVE database at the time the scan was conducted. This value isn't updated dynamically. To view the most up-to-date EPSS status, re-scan your firmware image.

EPSS provides a forward-looking likelihood signal, not a guarantee of exploitation.

For details on how EPSS scores and percentiles are calculated, see the [Exploit Prediction Scoring System documentation](https://www.first.org/epss/) that FIRST maintains.

### CWE

Common Weakness Enumeration (CWE) represents the class of underlying weakness (for example, buffer overflow or improper input validation) that led to a vulnerability, rather than a specific vulnerability instance.

CWE identifiers provide more context by describing why a vulnerability exists, not just where it occurs.

CWE identifiers are informational and should be used to understand root causes, rather than for prioritization.

> [!NOTE]
> CWE data reflects standardized weakness classifications defined by the MITRE Common Weakness Enumeration project. CWE identifiers are informational and don't indicate exploitability or impact on a specific device or firmware image by themselves.

For more information about CWE definitions and classifications, see the official [MITRE CWE documentation](https://cwe.mitre.org/).

### Exploit maturity

Exploit maturity describes the current state of exploit availability for a vulnerability. Categories can include labels like:

- Unproven
- Proof of concept
- Functional exploit
- Weaponized exploit

When exploit maturity information is present, it's typically found alongside CVSS v4 scoring. It's described in the [CVSS specification](https://www.first.org/cvss/v4.0/specification-document) that FIRST maintains.

## Using weakness data together

Each weakness signal represents a different perspective:

- **CVE**: What the vulnerability is.
- **CVSS**: Technical severity and impact.
- **KEV**: Evidence of active exploitation.
- **EPSS**: Likelihood of near-term exploitation.
- **Exploit maturity**: Availability of exploit techniques.
- **CWE**: Underlying weakness category.

Rather than relying on a single field, evaluating these signals together provides a more complete understanding of potential risk.

### Recommended evaluation order for prioritization

Effective prioritization requires more than severity scoring. The following structured model illustrates how you can holistically evaluate weakness data. This approach is guidance, not a prescriptive rule set.

1. Confirm exploitation status (KEV):

    - Treat KEV-listed weaknesses as the highest priority.
    - Don't downgrade KEV items solely based on the CVSS score.

    You should evaluate confirmed exploitation before any scoring metric.

1. Assess exploit maturity:

    - Elevate the priority for weaknesses with functional or weaponized exploits.
    - Combine the exploit maturity with exposure characteristics.

    Exploit availability increases real-world risk.

1. Evaluate exploitation likelihood (EPSS):

    - Use EPSS to differentiate between vulnerabilities with similar severity.
    - Percentile rankings are often more actionable than raw scores.
    - Combine EPSS with KEV and exploit maturity.

    EPSS adds probability context to prioritization decisions.

    > [!NOTE]
    > To filter by EPSS in the Azure portal, specify the EPSS score in a decimal form. For example, for an EPSS score of `>50%`, filter for `>0.5`.

1. Review attack vector and exposure. From the CVSS vector, consider:

   - Network-accessible vulnerabilities versus local or physical access.
   - Authentication and user-interaction requirements.
   - Whether the affected component or service is exposed in the deployment.

   A vulnerability might appear severe but, if it isn't accessible in practice, it presents reduced risk.

1. Assess technical impact severity (CVSS). Use CVSS to understand the impact if exploitation succeeds (not the likelihood):

   - **High or critical severity**: Prioritize when exposure or likelihood is moderate or higher.
   - **Medium severity**: Prioritize based on exploitation signals and exposure.
   - **Low severity**: Deprioritize unless active exploitation or high exposure exists.

   When the likelihood for two vulnerabilities is similar, address higher-impact vulnerabilities first.

1. Evaluate business impact. Determining whether an asset is critical reflects organizational context and includes:

   - Whether the system is production or core infrastructure.
   - Potential operational, safety, or compliance impact.

   Business impact influences urgency but doesn't change vulnerability mechanics. 

1. Consider fix availability. Remediation feasibility affects execution planning. Evaluate:

   - Patch or firmware update availability.
   - Upgrade complexity.
   - Available mitigations.

   Fix availability should inform scheduling, but shouldn't override exploitation evidence.

## Important considerations

Always interpret weakness data alongside:

- Device role and exposure.
- System configuration.
- Firmware usage within the platform.

  > [!NOTE]
  > Firmware analysis identifies potential risks based on extracted firmware content. It doesn't determine whether a vulnerability is reachable, exploitable, or impactful in a specific deployment.

To learn more about how Firmware analysis extracts and presents component data, see [Interpreting extractor paths from SBOM view in firmware analysis](interpreting-extractor-paths.md).
