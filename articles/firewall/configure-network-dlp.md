---
title: Configure network DLP with Azure Firewall and Microsoft Purview (preview)
description: Configure Microsoft Purview policies and an Azure Firewall DLP profile to evaluate scoped network traffic before enabling enforcement.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 11/04/2026
# Customer intent: As a network security administrator, I want to configure network DLP with Azure Firewall and Microsoft Purview so that I can evaluate sensitive-data protection before enabling enforcement.
---

# Configure network DLP with Azure Firewall and Microsoft Purview (preview)

Azure Firewall integrates with Microsoft Purview to protect sensitive data in supported application traffic. Microsoft Purview classifies content and evaluates DLP policies. Azure Firewall selects the traffic for inspection and applies the resulting policy decision.

This article describes a configuration that maps source IP addresses or CIDR ranges to Microsoft Entra user object IDs. Start in **Alert only** mode and validate evaluation before you select **Alert and deny**. For the shared protection model, see [Azure Firewall AI Security concepts](ai-security-concepts.md).

> [!IMPORTANT]
> Network data loss prevention with Azure Firewall is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- Azure Firewall Premium with an AI Security add-on license and the add-on enabled on all firewalls associated with the policy, in a region where the preview is available. See [Azure Firewall AI Security concepts](ai-security-concepts.md).
- A Microsoft Purview license for the integration and permissions to manage the relevant Purview DLP policies.
- Access to configure the Azure Firewall Policy and its application rules.
- Working TLS inspection, with the inspection certificate authority trusted by the workloads. See [Azure Firewall Premium certificates](premium-certificates.md).
- The Microsoft Purview tenant GUID.
- A CSV mapping of source IP addresses or CIDR ranges to Microsoft Entra user object IDs, hosted at a URL that a [managed identity](/entra/identity/managed-identities-azure-resources/overview) can read securely.
- The mapped users included in the intended Purview policy scope.
- An authorized test environment with synthetic protected content and a benign control. Don't use real sensitive data.

During the preview, configuration is available only in the Azure portal.

The source-to-user mapping supplies policy context; it isn't end-user authentication. This procedure uses explicitly mapped source addresses so that you can validate the intended user's policy context.

## Configure the Microsoft Purview policy

Create a policy for the destinations and activities that you plan to evaluate. For background on how Purview classifies and evaluates network traffic, see [Learn about Microsoft Purview Network Data Security](/purview/dlp-network-data-security-learn).

1. In Microsoft Purview, select **Data loss prevention** > **Policies** > **+ Create policy**.
1. Select **Inline web traffic** > **Custom** > **Custom policy**, and enter a name and description.
1. Select **+ Add cloud apps** and scope the destination applications. Use **Adaptive app scopes** where appropriate.
1. Enable the **Network and non-Microsoft secure browsers** enforcement location.
1. Select **Create or customize advanced DLP rules** > **+ Create rule**, and name the rule.
1. Under **Conditions** > **Content contains**, choose the sensitive information types or sensitivity labels for the evaluation.
1. Under **Actions** > **Restrict browser and network activities**, select the activity that you intend to test and choose **Audit** for the initial evaluation.
1. Configure alerts as needed, save the rule, and ensure that the rule is **On**.
1. Use simulation for the initial evaluation, review the policy, and select **Submit**.

Validate each required activity rather than assuming that one successful test establishes coverage for all text and file transfers.

## Create a security profile group with a DLP profile

Configure the provider, policy mode, and user mapping in a security profile group that you can apply to application rules.

1. Open the firewall policy in the Azure portal.
1. Select **Settings** > **Security Profile Groups (preview)** > **Create security profile group**.
1. On the **Basics** tab, enter a configuration name and select **Data loss prevention (preview)**. Select other protections to include in the same group. Select **Next**.
1. On the **Configure protections** tab, enter a profile name, or turn on **Use existing Data loss prevention security profile** and select a profile.
1. For **Mode**, select **Alert only**. This mode monitors without blocking, including when Microsoft Purview returns a deny decision. The other options are **Disabled** and **Alert and deny**.
1. Under **Data loss prevention provider**, confirm that **Microsoft Purview** is selected and enter the **Purview tenant** GUID.
1. Under **User identity mapping**, enter the **Mapping file URL** and select a **Managed identity** with secure read access to the mapping file.
1. Confirm that the mapped user IDs match the users in the intended Purview policy scope.
1. Select **Next**, review the tenant, mode, mapping URL, and managed identity, and then select **Create**.

The mapping file has a limit of 50,000 rows. For this evaluation, use source addresses that have explicit entries in the mapping file.

A group can contain at most one profile of each type. You can include other protection profiles, but validate each capability separately.

## Apply the group to an application rule

Azure Firewall processes network rules before application rules. Check that a matching network rule doesn't prevent the test traffic from reaching the intended application rule. For more information, see [Azure Firewall rule processing](rule-processing.md).

1. Select **Rules** > **Application rules** and edit the target rule.
1. Scope the sources and destinations to the evaluation traffic.
1. Select the security profile group that contains the DLP profile.
1. Use **HTTPS:443** and enable **TLS inspection** on the rule.
1. Save the rule.

## Verify evaluation in Alert only mode

Confirm both the traffic path and the DLP evaluation before widening the policy scope.

1. Confirm that traffic traverses the firewall and matches the intended application rule.
1. Verify the selected group, DLP profile, Purview tenant, mapped user, and Purview policy scope.
1. Confirm that TLS inspection succeeds and that the client trusts the inspection certificate authority.
1. Transfer synthetic protected content and a benign control through the same source, destination, and activity.
1. Review **DLP Alerts** or **Activity explorer** in Microsoft Purview where configured. Confirm that the observed evaluation corresponds to the intended test and user context.

A successful transfer alone doesn't prove that DLP evaluation occurred. Existing firewall application-rule logs can confirm the traffic path, but they don't replace evidence of the Purview evaluation.

### Test enforcement

After reviewing the results in **Alert only** mode:

1. Configure the relevant Purview rule action as **Block**, keep the rule **On**, and activate the policy rather than leaving it in simulation or audit.
1. Edit the DLP profile in the security profile group and change **Mode** to **Alert and deny**.
1. Repeat the authorized synthetic-content test and confirm that the protected transfer is restricted.
1. Repeat the benign control and review the recorded outcomes before expanding the policy or traffic scope.

## If evaluation doesn't produce the expected result

Check the following items before changing enforcement:

- The source address has an explicit mapping to the intended Microsoft Entra user object ID.
- The managed identity can read the mapping file.
- The mapped user is in the Purview policy scope.
- The Purview policy covers the tested destination and activity.
- The firewall application rule, group, DLP profile, and tenant are correct.
- TLS inspection succeeds for the tested HTTPS flow.
- For blocking, the Firewall profile is in **Alert and deny** mode and the active Purview rule uses **Block**.

## Related content

- [Azure Firewall AI Security concepts](ai-security-concepts.md)
- [Azure Firewall Premium certificates](premium-certificates.md)
- [Azure Firewall rule processing](rule-processing.md)
