---
title: Reference - Built-in CIS Security Benchmarks for Linux Workloads via Machine Configuration
description: Reference - Built-in CIS Security Benchmarks for Linux Workloads via Machine Configuration
ms.date: 10/22/2026
author: pallakatos
ms.author: pallakatos
ms.topic: reference
ms.custom: generated
---
# CIS Security Benchmarks for Linux Workloads

## Introduction

The Center for Internet Security (CIS) Benchmarks are globally recognized security configuration guidelines for hardening systems and applications. CIS benchmarks provide two implementation levels:

- **Level 1 (L1)**: Essential security configurations that provide a clear security benefit without significant impact on functionality
- **Level 2 (L2)**: More stringent security configurations intended for environments requiring higher security, potentially with some impact on functionality or usability

This page documents Azure's new capability offering built-in CIS Benchmarks to your workloads which you can tailor to your needs.

The content of the benchmarks we support is in parity with what has been published at the CIS website and you can find the benchmark contents under the following [link](https://www.cisecurity.org/cis-benchmarks). 

The azure-osconfig engine has satisfied the requirements of [CIS Certification and is awarded CIS Benchmark Assessment Certified](https://www.cisecurity.org/partner/microsoft) for the benchmarks listed below.

## Using CIS Benchmarks in Azure

Customers can now apply CIS Linux security baselines using **Azure Policy with Machine Configuration**. This new capability enables:

- **Automated compliance assessment**: Continuously monitor your Linux systems against official CIS benchmarks
- **Tailored benchmarks**: Customize the benchmark by defining exceptions and custom parameters
- **Compliance reporting**: Get detailed CIS style reports on your systems
- **Per-rule auto-remediation (Public Preview)**: Correct supported settings for the rules and resource locations you select

The built-in Policy name associated with this capability is: ***[Preview]: Official CIS Security Benchmarks for Linux Workloads***

All of the supported Benchmarks are powered by **[azure-osconfig's](https://github.com/Azure/azure-osconfig/)** new compliance engine.

### Enable Machine Configuration

Machine Configuration must be installed and operational on the target machines before benchmark assessment or remediation can run.

Open **Policy > Assignment Presets > Machine Configuration** in the Azure portal. The first view is **Overview**, which includes **Enable Machine Configuration**. This view lets you select subscriptions and enable prerequisites for eligible Azure VMs by using the policy initiative **Deploy prerequisites to enable Guest Configuration policies on virtual machines**.

- **Machines already running benchmark assessments**: You don't need to repeat enablement if Machine Configuration is already installed and working.
- **New Azure VMs**: The Machine Configuration extension and required prerequisites must be deployed before assessment and remediation can run. Creating your first baseline definition also includes automatic prerequisite deployment in the setup flow.
- **Azure Arc-enabled servers**: Machine Configuration components are installed as part of Arc onboarding. The Azure VM extension deployment isn't required for these machines.

If prerequisite deployment doesn't complete, or a VM is missing the extension, return to **Overview > Enable Machine Configuration**, select the relevant subscriptions, and select **Enable**. A baseline assignment alone can't assess or remediate a machine without functioning Machine Configuration components.

### Create a baseline assignment

1. Open **Azure Policy** in the Azure portal.
2. Under **Assignment Presets**, select **Machine Configuration**. Use **Overview > Enable Machine Configuration** to enable any missing prerequisites.
3. Select **Definitions**, select **Official Center for Internet Security (CIS) Benchmarks for Linux Workloads**, and select **Modify Settings**.
4. Choose the distributions and CIS benchmark versions that apply to your machines, and review the rules and supported custom parameters.
5. Create the policy assignment in audit mode for the resources you want to assess.
6. Review the initial findings before enabling remediation for selected rules.

## Supported Benchmarks and Versions

The following Linux distributions and CIS benchmark versions are currently supported, all certified by CIS for benchmark assessment.

| Distribution | CIS Benchmark Version | Profiles | CIS Certified | Audit | Auto-Remediation |
|--------------|----------------------|----------|---------------|-------|------------------|
| [Ubuntu 20.04 LTS + Pro](cis-linux/ubuntu-ado.md) | v3.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [Ubuntu 22.04 LTS + Pro](cis-linux/ubuntu-ado.md) | v2.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [Ubuntu 22.04 LTS + Pro](cis-linux/ubuntu-ado.md) | v3.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [Ubuntu 24.04 LTS + Pro](cis-linux/ubuntu-ado.md) | v1.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [RedHat Enterprise Linux 10](cis-linux/rhel-ado.md) | v1.0.1 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [RedHat Enterprise Linux 8](cis-linux/rhel-ado.md) | v3.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [RedHat Enterprise Linux 8](cis-linux/rhel-ado.md) | v4.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [RedHat Enterprise Linux 9](cis-linux/rhel-ado.md) | v2.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [Alma Linux 8](cis-linux/alma-ado.md) | v3.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [Alma Linux 8](cis-linux/alma-ado.md) | v4.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [Alma Linux 9](cis-linux/alma-ado.md) | v2.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [Rocky Linux 8](cis-linux/rocky-ado.md) | v2.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [Rocky Linux 8](cis-linux/rocky-ado.md) | v3.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [Rocky Linux 9](cis-linux/rocky-ado.md) | v2.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [Oracle Linux 8](cis-linux/oracle-ado.md) | v3.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [Oracle Linux 8](cis-linux/oracle-ado.md) | v4.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [Oracle Linux 9](cis-linux/oracle-ado.md) | v2.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [Debian Linux 11](cis-linux/debian-ado.md) | v2.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [Debian Linux 12](cis-linux/debian-ado.md) | v1.1.0 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [SUSE Linux Enterprise 12](cis-linux/suse-ado.md) | v3.2.1 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [SUSE Linux Enterprise 15](cis-linux/suse-ado.md) | v2.0.1 | L1 + L2 Server | ✓ | ✓ | ✓ |
| [AKS Optimized Azure Linux 3](cis-linux/azure-linux-ado.md) | v1.0.0 | L1 + L2 Server | ✓ | ✓ | ✓ |

Auto-remediation is available only for rules marked **Yes** in the **Remediation** column of each benchmark's rules table and must be enabled separately.
	
You can use these benchmarks against your hardened images. We are working with the vendors to minimize deviations.
	
You can also use these benchmarks against custom images you've built based on top of vanilla distros as long as the **/etc/os-release** is intact with the original content.

## Custom Parameters

The compliance engine is capable of interpreting dynamic parameters for rule evaluation, which means we are opening up flexible rule customization without requiring code changes. Parameters allow rules to be configured with different values while maintaining the same underlying audit logic.

Parameters are exposed through both the user interface and in the final JSON configuration files which you can download through the Machine Configuration UX experience. 

For rules that support both custom parameters and auto-remediation, the configured parameter values apply to both assessment and remediation. For example, if your organization's approved policy specifies a maximum password age of 200 days, a supported rule can assess and remediate against that value. A customized value evaluates your organization's baseline, not the unmodified CIS recommendation.

**We haven't exposed all available parameters initially.**, Some rules contain 5-10 or even up to 20 logical conditions and relevant parameters which could easily overwhelm users. Instead, we're taking a customer-driven approach - **enabling additional rule parameters based on customer feedback which we are asking you to do so following the instructions below.** This ensures we prioritize the most valuable customization options while maintaining a clean user experience.

The existing parameters we have enabled and some deviations if there are any compared to CIS official toolset results are highlighted under the distribution specific pages which you can find in the table above.

### Requesting more parameters to be supported

Please use one of the following ways to let us know the rule, CIS Benchmark version, distribution and/or version for which you want parameters enabled for customization and couple of words about your use case.

- [Create a GitHub issue under the azure-osconfig repository](https://github.com/Azure/azure-osconfig/issues)
- [Open an Azure support case](https://azure.microsoft.com/support/create-ticket)

### Examples

This is a practical example for cron package variations.

Consider the ***Ensure permissions on /etc/cron.daily are configured*** rule. Some customers may choose to use different cron implementations (e.g., cron, cronie, or bcron). The CIS rule defines by default the package name to be "cron" - however, the parameters allow you to customize the package names. For example:

- Default: packageName: "cron" and alternativePackageName: "cronie"
- Custom: Change packageName to "bcron" for systems using the bcron implementation

Follow this same method to apply changes to file permissions, groups, owners, etc.

#### Original Rule

```json
{
    "ruleId": "1249e006-cfa1-93cb-bece-8159bcfdd5d6",
    "name": "Ensure permissions on /etc/cron.daily are configured;DesiredObjectValue",
    "value": "mask=0077 owner=root group=root packageName=cron alternativePackageName=cronie"
}
```
#### Customized Rule

```json
{
    "ruleId": "1249e006-cfa1-93cb-bece-8159bcfdd5d6",
    "name": "Ensure permissions on /etc/cron.daily are configured;DesiredObjectValue",
    "value": "mask=0077 owner=root group=root packageName=bcron alternativePackageName=cronie"
}
```

## Auto-remediation

Auto-remediation is in **[Public Preview]**.

CIS benchmark auditing is generally available. Auto-remediation extends the audit experience by applying the desired configuration for selected rules and correcting supported configuration drift during subsequent evaluations. It applies to supported Linux VMs in Azure and Azure Arc-enabled servers on-premises or in other clouds.

Rules default to **Audit**. Only rules marked **Yes** in a benchmark's **Remediation** column can be changed to **Remediate**. Other rules in the same baseline remain audit-only. Changing the policy effect to `DeployIfNotExists` doesn't automatically enable remediation for every rule.

### Remediation controls

The following settings work together:

| Setting | Purpose |
|---|---|
| Rule mode: **Audit** or **Remediate** | Determines which supported rules can change machine settings. |
| Policy effect: `DeployIfNotExists` | Enables the Azure Policy deployment required for remediation. |
| **Remediation Location** | Selects the resource locations where remediation can run. Machines in other locations within the assignment continue to be assessed. |
| Remediation task | Deploys the configuration to existing noncompliant resources. Machine Configuration then applies the selected rule settings on each machine. |

Start with a small set of rules in a location that contains test resources. Review the resulting configuration and workload behavior before enabling more rules or expanding **Remediation Location**.

The **Inclusion Tags** parameter can select resources for the baseline assignment. It doesn't provide a separate tag-based remediation scope. Within the assignment, remediation is controlled by the selected rules, policy effect, and **Remediation Location**.

### Enable auto-remediation

1. Confirm that [Machine Configuration is enabled](#enable-machine-configuration), create a CIS baseline assignment in audit mode, and review the initial compliance results.
2. Open **Policy > Assignment Presets > Machine Configuration**, select **Assignments**, select the assignment, and select **Edit settings**.
3. Use the **Remediatable** filter to find supported rules. Change the rules you want to automate from **Audit** to **Remediate**, and review the settings summary.
4. Continue to the policy assignment flow and set **Effect** to `DeployIfNotExists`.
5. Set **Remediation Location** to the locations where the selected rules should remediate.
6. Create a remediation task for existing noncompliant resources, and save the assignment.
7. Review the next assessment results before expanding the rollout. Results are available through built-in reporting and Azure Resource Graph, where you can query them for custom dashboards.

Allow approximately 15 to 20 minutes for remediation to start after the assignment and remediation task are in place. Timing depends on policy processing, agent evaluation, and machine connectivity; it isn't a completion guarantee.

Supported parameters and remediations will expand over time. To request additional support, [open an issue in the kompli repository](https://github.com/microsoft/kompli/issues).

## Release Notes

### Current Release
- **Version**: 1.25.0.0
- **Release Date**: 2026-10-22
- **Features**:
  - Added remediation capabilities for selected CIS settings, including kernel modules, `login.defs`, systemd, and runtime sysctl values, while preserving applicability checks. Availability depends on benchmark capability and does not extend to every rule.
  - Added an optional, customer-configurable permission mask for affected crontab access-control rules, with four-digit octal validation.
  - Improved compliance accuracy for file permissions, optional files, cron access controls, account backup files, mount options, and network services, reducing incorrect compliance results.
  - Strengthened SSH, auditd, and account-policy checks with complete-value matching, more accurate audit-rule coverage assessment, and stricter handling of malformed numeric values and conflicting `login.defs` settings.
  - Corrected DNS service defaults to `bind9.service` for Ubuntu 22.04 CIS v2.0.0 and Debian 11 CIS v2.0.0, and updated affected SSH matching defaults. Review custom overrides when upgrading.

### Release 1.23.0.0
- **Version**: 1.23.0.0
- **Release Date**: 2026-09-11
- **Features**:
  - Expanded customer-configurable parameters across existing CIS Linux benchmarks for file permissions, crontab access, and DNS service-state rules, including richer validation for owners, groups, permission masks, service names, and package names.
  - Improved compliance accuracy for crontab access and file-permission rules by aligning audit behavior more closely with CIS benchmark logic, including correct handling of optional files and cron allow/deny precedence.
  - Corrected affected file-permission rule mappings in existing benchmarks to reduce false compliance results for shadow and group-related checks.
  - Improved mount option compliance auditing by checking only active `fstab` flags, reducing false failures for CIS mount option rules.
  - Strengthened benchmark input handling to better protect against malformed XML content during policy generation.

### Release 1.21.0.0
- **Version**: 1.21.0.0
- **Release Date**: June 2026
- **Features**:
  - Added support for new CIS benchmark releases across Ubuntu, RHEL, Rocky Linux, AlmaLinux, and Oracle Linux, and introduced support for CIS AKS Optimized Azure Linux 3.
  - Expanded customer-configurable parameters across more rules, including password policy, file permissions, mount options, service state, SSHD, systemd, DNS, and FTP-related settings.
  - Enhanced policy parameter experiences in Guest Configuration Settings Catalog with richer input metadata, including display names, validation rules, and mandatory-field support for structured JSON parameters.
  - Improved compliance accuracy and benchmark alignment with newer CIS-CAT Assessor content, reducing false failures and improving rule handling for newer benchmark versions.
  - Added native support for `login.defs` password policy auditing and improved handling of structured JSON parameter overrides for compliance assignments.

### Release 1.0.0
- **Version**: 1.0.0
- **Release Date**: November 2025
- **Features**:
  - Initial release of CIS Linux baselines for Azure Policy
  - Support for 12 Linux distributions
  - Audit-only functionality for compliance assessment
  - CIS-certified benchmark implementations (list above)
  - Custom parameters (details below)



---

For questions or support regarding CIS Benchmarks for Linux in Azure Machine Configuration, please refer to this documentation or contact Azure support.

For questions, suggestions or any feedback on the rules, evaluations, distro coverage, feature requests - you can also use the Azure Support - or open a [GitHub issue under azure-osconfig repository](https://github.com/Azure/azure-osconfig/issues).

