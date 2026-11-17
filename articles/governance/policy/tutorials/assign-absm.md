---
title: "Tutorial: Assign Azure Baseline Security (preview)"
description: Learn how to assign Azure Baseline Security Mode in the Azure portal, review included policies, and check initial compliance before enrolling resources.
ms.date: 11/10/2026
ms.topic: tutorial
---

# Tutorial: Assign Azure Baseline Security (preview)

This tutorial shows Azure administrators how to assign Azure Baseline Security Mode (Azure BSM) for the first time. You establish the baseline at your selected scope and review initial compliance. Resource owners can then prepare workloads and enroll supported subscopes for enforcement.

In this tutorial, you learn to:

> [!div class="checklist"]
> - Find Azure Baseline Security in the Azure portal.
> - Explore the baseline initiative and its included policies.
> - Assign the baseline at the highest permitted scope in Enroll mode.
> - Check initial compliance on the Azure Baseline Security page.
> - Address a noncompliant BSM control.

> [!NOTE]
> Azure Baseline Security Mode is in public preview.

## What is Azure Baseline Security Mode?

Azure BSM provides a guided way to adopt a Microsoft-curated set of high-priority Azure Policy security controls that Microsoft recommends applying in enforcement mode. It simplifies assessing your security posture, preparing workloads, and enrolling supported scopes for enforcement.

The [Microsoft cloud security benchmark initiative](/azure/governance/policy/samples/azure-security-benchmark) is primarily used to assess and audit security compliance. Azure BSM complements that broader benchmark with a prioritized set of policies intended for enforcement.

In **Enroll** enforcement mode, administrators at a higher Azure scope establish the baseline centrally. Resource owners then investigate affected resources, prepare workloads, and enroll supported scopes when they're ready for enforcement.

> [!NOTE]
> Azure BSM doesn't replace Azure Policy. The underlying policy definitions, assignments, evaluation, compliance states, effects, and exemptions continue to use Azure Policy behavior.

For guidance on protecting Microsoft 365 services, see [Baseline security mode settings for Microsoft 365](/microsoft-365/baseline-security-mode/baseline-security-mode-settings).

## Why Azure BSM?

Azure BSM is especially useful for **new environments**, where you can start with Microsoft's recommended policies in enforcement mode.

Existing workloads might depend on Shared Key authorization, anonymous access, older versions of Transport Layer Security (TLS), or public connectivity, making immediate enforcement risky. **Enroll** enforcement mode lets teams review compliance and prepare workloads before enabling enforcement for supported subscopes through enrollment.

Use Azure BSM when you want to:

- Establish a consistent minimum security baseline across Azure scopes.
- Reduce the need to discover and assemble individual foundational security policies.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn_ccfc99f7-8fd6-5529-c7a8-3d0e16d7010b) before you begin.

## Before you enable Azure BSM

- Confirm that you have the required Azure and Azure Policy permissions.
- Review the included controls and identify dependencies on shared keys, public or anonymous access, older TLS versions, or Key Vault deletion settings.
- Review existing noncompliant resources and plan workload changes before enforcement.
- Test potentially disruptive controls in a representative nonproduction environment.
- Establish an exception path for workloads that can't immediately meet the baseline.

> [!IMPORTANT]
> Enforcing some Azure BSM controls can disrupt applications that depend on shared keys, public or anonymous access, older TLS versions, or public Key Vault endpoints. Review the [control catalog](#azure-bsm-control-catalog) before enrolling production scopes.

## Find Azure Baseline Security

1. Open the [Azure Baseline Security page](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade.MenuView/~/BaselineSecurityMode) in the Azure portal.

   To navigate there from the portal, open **Policy**, expand **Assignment Presets** in the table of contents, and select **Baseline Security**.

   :::image type="content" source="../media/assign-azure-baseline-security/policy-navigation.png" alt-text="Screenshot of the Policy navigation with Baseline Security under Assignment Presets outlined in red." lightbox="../media/assign-azure-baseline-security/policy-navigation.png":::

   Alternatively, on the **Policy Overview** page, find **Recommended Assignments** and select **Protect with Baseline Security Mode**.

1. Review the Azure Baseline Security Mode assignments listed for the selected scope. The list is empty if there are no existing Azure Baseline Security assignments yet.
1. Before assigning the baseline, review the initiative and its included policy definitions to understand what it covers. To find the initiative:

   - Under **Authoring**, select **Definitions**.
   - Search for `Azure Baseline Security Mode`.
   - Open **[Preview]: Azure Baseline Security Mode** and confirm that its type is **Built-in**.
   - On the **Policies** tab, explore the included policy definitions.

   :::image type="content" source="../media/assign-azure-baseline-security/initiative-definition.png" alt-text="Screenshot of the built-in Azure Baseline Security Mode initiative and included policies, with Assign initiative outlined in red and the definition identifier redacted." lightbox="../media/assign-azure-baseline-security/initiative-definition.png":::

1. When you're ready, select **Assign initiative** on the initiative definition page. You can also start assignment directly from the **Baseline Security** page.

## Assign Azure Baseline Security Mode

Assign the baseline at the highest scope where you have permission, and use **Enroll** mode. This approach lets you collect compliance data across that scope before resource owners enroll supported subscopes when they are ready for enforcement.

1. On the **Basics** tab, use the **Scope** selector to choose the highest scope where you have permission to assign the baseline.
1. Set **Policy enforcement** to **Enroll**.

   :::image type="content" source="../media/assign-azure-baseline-security/assignment-settings.png" alt-text="Screenshot of the Basics tab with the Scope selector and Enroll option outlined in red and the identifying scope value redacted." lightbox="../media/assign-azure-baseline-security/assignment-settings.png":::

   Identifying details are redacted in the screenshots.

1. For **Version**, open the version selector.
1. Enable **Automatically enroll in minor version changes** and choose the version to assign. Select **Select** to return to the assignment.

   :::image type="content" source="../media/assign-azure-baseline-security/version-updates.png" alt-text="Screenshot of the initiative version selector with Automatically enroll in minor version changes set to Yes and outlined in red." lightbox="../media/assign-azure-baseline-security/version-updates.png":::

1. Select **Next** to continue to **Parameters**.
1. Leave each policy's effect at its default **Deny** setting. To use **Audit** or **Disabled** instead, clear **Only show parameters that need input or review**, and then select the effect for that policy.

   :::image type="content" source="../media/assign-azure-baseline-security/policy-parameters.png" alt-text="Screenshot of the Parameters tab showing the included policies' effect settings set to Deny and outlined in red." lightbox="../media/assign-azure-baseline-security/policy-parameters.png":::

   > [!NOTE]
   > The policy effect and the assignment's enforcement mode serve different purposes. The **Deny** effect blocks noncompliant resource creation and updates when enforcement applies. **Enroll** mode lets you review compliance before enrolling supported subscopes for enforcement.

1. Continue through the remaining assignment settings. The **Managed identity** and **Non-compliance messages** settings are optional; leave them unchanged for this walkthrough.
1. Select **Review + create**.
1. Review your configuration. Confirm that you've selected:

   - The highest permitted assignment scope.
   - **Enroll** mode.
   - Automatic enrollment in minor version changes.
   - The policy effects you intend to use. **Deny** is recommended.

   :::image type="content" source="../media/assign-azure-baseline-security/review-assignment.png" alt-text="Screenshot of Review + create showing Enroll enforcement mode, redacted scope and assignee values, and the Create button outlined in red." lightbox="../media/assign-azure-baseline-security/review-assignment.png":::

1. Select **Create** to assign Azure Baseline Security Mode.

## Check initial compliance

After assigning the baseline, return to the **Azure Baseline Security** page to review your assignments and their overall compliance.

1. Open **Policy** in the Azure portal.
1. Under **Assignment Presets**, select **Baseline Security**.
1. In the assignment list, find the assignment you just created.
1. Review its overall compliance for the **Azure Baseline Security Mode** initiative.

   :::image type="content" source="../media/assign-azure-baseline-security/initial-compliance.png" alt-text="Screenshot of the Baseline Security assignment list and overall initiative compliance, with identifying scope values and identifiers redacted." lightbox="../media/assign-azure-baseline-security/initial-compliance.png":::

   This example shows no evaluated resources. A 100% result for zero evaluated resources doesn't confirm workload compliance.

> [!NOTE]
> After you first assign the initiative at a scope, the assignment and compliance information might take a few minutes to appear on this page.

Use this initial compliance information to understand your current posture before resource owners prepare workloads and enroll supported subscopes.

For detailed evaluation triggers, compliance states, and resource-level compliance records, see [Get compliance data for Azure resources](../how-to/get-compliance-data.md). Allow evaluation to complete before using the results to decide whether a scope is ready for enforcement.

## Address a noncompliant BSM control

1. Open the noncompliant BSM control and identify the affected resource.
1. Review the control's security intent and potential workload impact.
1. Open the linked service-specific Microsoft Learn article in the [control catalog](#azure-bsm-control-catalog).
1. Follow the authoritative service guidance to update or replace the dependent configuration.
1. Allow Azure Policy to reevaluate the resource.
1. Confirm that the Azure BSM control returns to a compliant state.

## Azure BSM control catalog

Use this catalog to review each control's security intent, potential workload impact, and safe rollout guidance before enforcement. Review the policies and settings for the initiative version selected in your assignment.

Select a control title to open its built-in policy definition in the Azure portal. Select **Learn more** at the end of a description for service-specific Microsoft Learn guidance.

### Storage

| Control | Description | Potential impact | Safe rollout tips |
| --- | --- | --- | --- |
| **[1. Block insecure transfer to storage accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F404c3081-a854-4457-ae30-26a93ef643f9)** | Unencrypted HTTP connections can expose storage data and credentials to interception or tampering. This control prevents storage accounts from being created or updated to allow insecure transfer. [Learn more.](../../../storage/common/storage-require-secure-transfer.md) | Clients that still use HTTP can fail. Check legacy applications, devices, and protocol dependencies. | Use logs and dependency testing to identify HTTP traffic. Update endpoints and connection strings to use HTTPS, and validate all storage services and protocols used by the account before enforcement. |
| **[2. Block public (anonymous) access to storage accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4fa4b6c0-31ca-4c0d-b10d-24b96f62a751)** | Anonymous public access can expose blobs and containers to anyone without authentication, risking unintended data disclosure. This control prevents storage accounts from being created or updated to allow anonymous public access to blobs and containers. [Learn more.](../../../storage/blobs/anonymous-read-access-prevent.md) | Public URLs used by websites, partners, downloads, or automation can stop working. | Inventory containers that intentionally allow anonymous access and identify their consumers. Replace anonymous access with Microsoft Entra authorization or, where appropriate, time-limited user delegation shared access signatures (SAS) for Blob Storage. Test external access paths before disabling anonymous access. |
| **[3. Block storage accounts below the minimum TLS version](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffe83a0eb-a853-422d-aac2-1bffd182c5d0)** | Older TLS versions can have weaker protections and known vulnerabilities, increasing the risk of interception or tampering. This control prevents storage accounts from being created or updated with a minimum TLS version below the required level. [Learn more.](../../../storage/common/transport-layer-security-configure-minimum-version.md) | Older operating systems, runtimes, appliances, and SDKs can lose access. | Review storage logs and client inventories to identify older TLS usage. Upgrade or replace incompatible clients, and test the change in a nonproduction environment before raising the minimum TLS version. |
| **[4. Block shared key access to storage accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8c6a50c6-9ffd-4ae7-986f-5fa6111f9a54)** | Shared keys can be leaked or copied and provide broad access without identity-level accountability. This control prevents storage accounts from being created or updated to allow Shared Key access. [Learn more.](../../../storage/common/shared-key-authorization-prevent.md) | Applications, tools, SAS tokens, or integrations that depend on account keys can fail. | Use diagnostic logs to identify Shared Key usage, and verify feature and client support for the replacement authorization method. Assign least-privilege data roles, migrate Blob workloads to Microsoft Entra ID or user delegation SAS where appropriate, and test each storage service before enforcement. |

### Key Vault

| Control | Description | Potential impact | Safe rollout tips |
| --- | --- | --- | --- |
| **[5. Block public network access to Azure Key Vaults](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F405c5871-3e91-4644-8a63-58e19d68ff5b)** | Public network access can expose a key vault endpoint to untrusted networks and increase the risk of unauthorized access attempts. This control prevents key vaults from being created or updated to allow public network access. [Learn more.](/azure/key-vault/general/network-security) | Applications, administrators, agents, and integrations without a working private path can be blocked. | Validate private endpoints, DNS resolution, firewall rules, and access from every required network before disabling the public endpoint. Keep a tested administrative access path. |
| **[6. Block creation of Key Vaults without deletion protection](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0b60c0b2-2dc2-4e1c-b5c9-abbed971de53)** | Without purge protection, a deleted key vault and its contents can be permanently purged during the retention period, causing irreversible data loss. This control requires purge protection to be enabled. [Learn more.](/azure/key-vault/general/key-vault-recovery) | Purge protection can't be disabled once enabled. You can't purge or recreate a deleted vault with the same name until its retention period expires. Recover the vault if you need it sooner. | Review the retention period, naming strategy, recovery process, and automation that deletes and recreates vaults before enabling purge protection. |
| **[7. Block creation of Key Vaults without soft delete](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1e66c121-a66a-4b1f-9b83-0fd99bf0fc2d)** | Without soft delete, accidental or malicious deletion of a key vault or its objects can result in permanent data loss. This control requires soft delete to keep deleted vaults and objects recoverable during the retention period. [Learn more.](/azure/key-vault/general/key-vault-recovery) | Soft-deleted vault names remain unavailable for new vaults until the deleted vault is purged or its retention period expires. Automation must handle soft-deleted resources rather than attempting to recreate them with the same name. | Update cleanup, recreation, and recovery automation to handle soft-deleted resources. Confirm that operators have the permissions required to recover them. |

> [!NOTE]
> New key vaults have soft delete enabled by default. Once enabled, soft delete and purge protection can't be disabled. Purge protection prevents purging during the retention period. Review the linked recovery guidance before changing these settings.

## Disable Azure BSM

- **Opt out at the entire assignment scope:** [Delete the Azure BSM initiative assignment](./create-and-manage.md#clean-up-resources). This method removes the evaluation and enforcement that the assignment provides.
- **Stop enforcement for a subscope:** For an assignment in **Enroll** mode, remove the enrollment that covers that scope. The assignment remains in place and continues to evaluate compliance. See [Azure Policy enrollments](../concepts/enrollment-structure.md).

Neither option undoes changes already made to resource configurations. Other assignments or enrollments might still enforce the same controls.

## Troubleshoot Azure BSM

- **Scope unavailable or assignment missing:** Check the selected scope and your Azure Policy permissions.
- **Enrollment fails:** Verify permissions at the enrollment scope and confirm that the referenced assignment uses **Enroll** mode.
- **Compliance information is missing or outdated:** Allow evaluation to complete. See [Get compliance data](../how-to/get-compliance-data.md).
- **Unenrollment fails:** Review the reported error and permissions at the enrollment scope.
- **A control disrupts a workload:** Follow that control's linked service-specific guidance in the [control catalog](#azure-bsm-control-catalog).

## Review

In this tutorial, you:

- Found **Azure Baseline Security** in the Azure portal.
- Explored the initiative and its included policy definitions.
- Assigned the baseline at the highest permitted scope in **Enroll** mode.
- Enabled automatic enrollment in minor version changes.
- Reviewed policy effects, with **Deny** as the recommended default.
- Checked initial initiative compliance on the **Azure Baseline Security** page.
- Addressed a noncompliant BSM control.

## Next steps

After reviewing compliance and preparing workloads, enroll supported subscopes when they're ready for enforcement.

Learn how enrollments work in [Azure Policy enrollment structure (Preview)](../concepts/enrollment-structure.md).

### Learn about the underlying Azure Policy capabilities

- [Azure Policy overview](../overview.md)
- [Azure Policy initiative definitions](../concepts/initiative-definition-structure.md)
- [Azure Policy assignment structure](../concepts/assignment-structure.md)
- [Understand Azure Policy effects](../concepts/effect-basics.md)
- [Azure Policy exemptions](../concepts/exemption-structure.md)
