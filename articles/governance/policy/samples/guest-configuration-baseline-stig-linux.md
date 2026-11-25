---
title: Reference - DISA STIG Benchmarks for Linux Workloads via Machine Configuration
description: Supported DISA STIG Linux benchmarks and release history for Machine Configuration.
ms.date: 10/22/2026
author: pallakatos
ms.author: pallakatos
ms.topic: reference
---
# DISA STIG Benchmarks for Linux Workloads

Azure Machine Configuration assesses Linux machines against supported Defense Information Systems Agency (DISA) Security Technical Implementation Guides (STIGs).

DISA STIG baselines are in **[Public Preview]**.

## Using STIG Benchmarks in Azure

Apply supported STIG Linux baselines using **Azure Policy with Machine Configuration**. The same baseline experience supports Linux VMs in Azure and Azure Arc-enabled servers on-premises or in other clouds. It provides:

- **Automated compliance assessment**: Continuously assess machine settings against supported DISA STIG benchmarks.
- **Compliance reporting**: Review rule-level results through built-in reporting and Azure Resource Graph.
- **Per-rule auto-remediation (Public Preview)**: Correct supported settings for the rules and resource locations you select.

The built-in policy definition is **[Preview] Official Security Technical Implementation Guide (STIG) for Linux Workloads by DISA**.

Supported STIG baselines are powered by [kompli](https://github.com/microsoft/kompli), the Linux compliance and remediation engine used by Machine Configuration. Assessment results are compared with DISA's SCAP Compliance Checker (SCC) to identify discrepancies. The distribution-specific pages list assessment differences.

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
3. Select **Definitions**, select **[Preview] Official Security Technical Implementation Guide (STIG) for Linux Workloads by DISA**, and select **Modify Settings**.
4. Choose the distributions and STIG releases that apply to your machines, and review the rules.
5. Create the policy assignment in audit mode for the resources you want to assess.
6. Review the initial findings before enabling remediation for selected rules.

Custom rule parameters aren't available for STIG baselines in this preview. You can request parameters for specific rules as described in [Custom Parameters](#custom-parameters).

## Supported Benchmarks and Versions

The table lists supported benchmarks using native DISA version and release numbers. Select a distribution for assessment differences and supported remediations.

| Distribution | DISA STIG Release | Audit | Auto-Remediation |
|---|---|---|---|
| [Oracle Linux 8](stig-linux/oracle-ado.md) | V2R7 | Yes | Yes |
| [Oracle Linux 9](stig-linux/oracle-ado.md) | V1R2 | Yes | Yes |
| [RHEL 8](stig-linux/rhel-ado.md) | V2R6 | Yes | Yes |
| [RHEL 9](stig-linux/rhel-ado.md) | V2R7 | Yes | Yes |
| [Ubuntu 22.04 LTS](stig-linux/ubuntu-ado.md) | V2R5 | Yes | Yes |
| [Ubuntu 24.04 LTS](stig-linux/ubuntu-ado.md) | V1R3 | Yes | Yes |

Auto-remediation is available only for rules marked **Yes** in the **Remediation** column of each benchmark's rules table and must be enabled separately.

## Custom Parameters

STIG baselines currently use the benchmark's predefined rule values. Custom rule parameters aren't available for either assessment or remediation. Selecting **Audit** or **Remediate** changes how a rule is applied; it doesn't customize the benchmark's expected value.

### Requesting more parameters to be supported

To request custom parameter support, provide the STIG rule identifier, benchmark version and release, Linux distribution and version, and a description of your use case:

- [Open an issue in the kompli repository](https://github.com/microsoft/kompli/issues).
- [Open an Azure support case](https://azure.microsoft.com/support/create-ticket).

## Auto-remediation

Auto-remediation is in **[Public Preview]**.

Auto-remediation applies the predefined STIG settings for selected rules and corrects supported configuration drift during subsequent evaluations.

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

1. Confirm that [Machine Configuration is enabled](#enable-machine-configuration), create a STIG baseline assignment in audit mode, and review the initial compliance results.
2. Open **Policy > Assignment Presets > Machine Configuration**, select **Assignments**, select the assignment, and select **Edit settings**.
3. Use the **Remediatable** filter to find supported rules. Change the rules you want to automate from **Audit** to **Remediate**, and review the settings summary.
4. Continue to the policy assignment flow and set **Effect** to `DeployIfNotExists`.
5. Set **Remediation Location** to the locations where the selected rules should remediate.
6. Create a remediation task for existing noncompliant resources, and save the assignment.
7. Review the next assessment results before expanding the rollout. Results are available through built-in reporting and Azure Resource Graph, where you can query them for custom dashboards.

Allow approximately 15 to 20 minutes for remediation to start after the assignment and remediation task are in place. Timing depends on policy processing, agent evaluation, and machine connectivity; it isn't a completion guarantee.

Supported remediations will expand over time. To request additional support, [open an issue in the kompli repository](https://github.com/microsoft/kompli/issues).

## Release Notes
### Current Release
- **Version**: 1.13.0.0
- **Release Date**: 2026-10-22
- **Features**:
  - Initial release of STIG Linux baselines.

