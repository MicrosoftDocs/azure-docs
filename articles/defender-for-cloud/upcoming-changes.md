---
title: Important changes coming to Microsoft Defender for Cloud
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan 
ms.topic: overview
ms.date: 05/10/2022
---

# Important upcoming changes to Microsoft Defender for Cloud

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Defender for Cloud. It describes planned modifications to the product that might impact things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Microsoft Defender for Cloud](release-notes.md).


## Planned changes

| Planned change | Estimated date for change |
|--|--|
| [Changes to recommendations for managing endpoint protection solutions](#changes-to-recommendations-for-managing-endpoint-protection-solutions) | May 2022 |
| [Changes to vulnerability assessment](#changes-to-vulnerability-assessment) | May 2022 |
| [Key Vault recommendations changed to "audit"](#key-vault-recommendations-changed-to-audit) | May 2022 |
| [Multiple changes to identity recommendations](#multiple-changes-to-identity-recommendations) | June 2022 |
| [Deprecating three VM alerts](#deprecating-three-vm-alerts) | June 2022|
|[Deprecating the "API App should only be accessible over HTTPS" policy](#deprecating-the-api-app-should-only-be-accessible-over-https-policy)|June 2022| 

### Changes to recommendations for managing endpoint protection solutions

**Estimated date for change:** May 2022

In August 2021, we added two new **preview** recommendations to deploy and maintain the endpoint protection solutions on your machines. For full details, [see the release note](release-notes-archive.md#two-new-recommendations-for-managing-endpoint-protection-solutions-in-preview).

When the recommendations are released to general availability, they will replace the following existing recommendations:

- **Endpoint protection should be installed on your machines** will replace:
    - [Install endpoint protection solution on virtual machines (key: 83f577bd-a1b6-b7e1-0891-12ca19d1e6df)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/83f577bd-a1b6-b7e1-0891-12ca19d1e6df)
    - [Install endpoint protection solution on your machines (key: 383cf3bc-fdf9-4a02-120a-3e7e36c6bfee)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/383cf3bc-fdf9-4a02-120a-3e7e36c6bfee)

- **Endpoint protection health issues should be resolved on your machines** will replace the existing recommendation that has the same name. The two recommendations have different assessment keys:
    - Assessment key for the **preview** recommendation: 37a3689a-818e-4a0e-82ac-b1392b9bb000
    - Assessment key for the **GA** recommendation: 3bcd234d-c9c7-c2a2-89e0-c01f419c1a8a

Learn more:
- [Defender for Cloud's supported endpoint protection solutions](supported-machines-endpoint-solutions-clouds-servers.md#endpoint-supported)
- [How these recommendations assess the status of your deployed solutions](endpoint-protection-recommendations-technical.md)

### Changes to vulnerability assessment

**Estimated date for change:** May 2022

Currently, Defender for Containers doesn't show vulnerabilities that have medium and low level severities that are not patchable.

As part of this update, vulnerabilities that have medium and low severities, that don't have patches will be shown. This update will provide maximum visibility, while still allowing you to filter undesired vulnerabilities by using the provided Disable rule.

:::image type="content" source="media/upcoming-changes/disable-rule.png" alt-text="Screenshot of the disable rule screen.":::

Learn more about [vulnerability management](deploy-vulnerability-assessment-tvm.md)

### Key Vault recommendations changed to "audit"

The Key Vault recommendations listed here are currently disabled so that they don't impact your secure score. We will change their effect to "audit".

| Recommendation name | Recommendation ID |
| ------- | ------ |
| Validity period of certificates stored in Azure Key Vault should not exceed 12 months | fc84abc0-eee6-4758-8372-a7681965ca44 |
| Key Vault secrets should have an expiration date | 14257785-9437-97fa-11ae-898cfb24302b |
| Key Vault keys should have an expiration date | 1aabfa0d-7585-f9f5-1d92-ecb40291d9f2 |

### Multiple changes to identity recommendations

**Estimated date for change:** June 2022

Defender for Cloud includes multiple recommendations for improving the management of users and accounts. In June, we'll be making the changes outlined below.

#### New recommendations in preview

The new release will bring the following capabilities:

- **Extended evaluation scope** – Improved coverage to identity accounts without MFA and external accounts on Azure resources (instead of subscriptions only) allowing security admins to view role assignments per account.

- **Improved freshness interval** - Currently, the identity recommendations have a freshness interval of 24 hours. This update will reduce that interval to 12 hours.

- **Account exemption capability** - Defender for Cloud has many features you can use to customize your experience and ensure that your secure score reflects your organization's security priorities. For example, you can [exempt resources and recommendations from your secure score](exempt-resource.md). 

    This update will allow you to exempt specific accounts from evaluation with the six recommendations listed in the following table.

    Typically, you'd exempt emergency “break glass” accounts from MFA recommendations, because such accounts are often deliberately excluded from an organization's MFA requirements. Alternatively, you might have external accounts that you'd like to permit access to but which don't have MFA enabled.

    > [!TIP]
    > When you exempt an account, it won't be shown as unhealthy and also won't cause a subscription to appear  unhealthy.

    |Recommendation| Assessment key|
    |-|-|
    |MFA should be enabled on accounts with owner permissions on your subscription|94290b00-4d0c-d7b4-7cea-064a9554e681|
    |MFA should be enabled on accounts with read permissions on your subscription|151e82c5-5341-a74b-1eb0-bc38d2c84bb5|
    |MFA should be enabled on accounts with write permissions on your subscription|57e98606-6b1e-6193-0e3d-fe621387c16b|
    |External accounts with owner permissions should be removed from your subscription|c3b6ae71-f1f0-31b4-e6c1-d5951285d03d|
    |External accounts with read permissions should be removed from your subscription|a8c6a4ad-d51e-88fe-2979-d3ee3c864f8b|
    |External accounts with write permissions should be removed from your subscription|04e7147b-0deb-9796-2e5c-0336343ceb3d|
#### Recommendations rename 

This update, will rename two recommendations, and revise their descriptions. The assessment keys will remain unchanged.

| Property | Current value | New update's change |
|--|--|--|
|**First recommendation**| - | - |
|Assessment key | e52064aa-6853-e252-a11e-dffc675689c2 | No change |
| Name | [Deprecated accounts with owner permissions should be removed from your subscription](https://ms.portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e52064aa-6853-e252-a11e-dffc675689c2) | Subscriptions should be purged of accounts that are blocked in Active Directory and have owner permissions. |
| Description | User accounts that have been blocked from signing in, should be removed from your subscriptions.
These accounts can be targets for attackers looking to find ways to access your data without being noticed. | User accounts that have been blocked from signing into Active Directory, should be removed from your subscriptions. These accounts can be targets for attackers looking to find ways to access your data without being noticed. <br> Learn more about securing the identity perimeter in [Azure Identity Management and access control security best practices](../security/fundamentals/identity-management-best-practices.md). |
| Related policy | [Deprecated accounts with owner permissions should be removed from your subscription](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2febb62a0c-3560-49e1-89ed-27e074e9f8ad) | Subscriptions should be purged of accounts that are blocked in Active Directory and have owner permissions. |
|**Second recommendation**| - | - |
| Assessment key | 00c6d40b-e990-6acf-d4f3-471e747a27c4 | No change |
| Name | [Deprecated accounts should be removed from your subscription](https://ms.portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/00c6d40b-e990-6acf-d4f3-471e747a27c4) | Subscriptions should be purged of accounts that are blocked in Active Directory and have read and write permissions. |
| Description | User accounts that have been blocked from signing in, should be removed from your subscriptions. <br> These accounts can be targets for attackers looking to find ways to access your data without being noticed. | User accounts that have been blocked from signing into Active Directory, should be removed from your subscriptions. These accounts can be targets for attackers looking to find ways to access your data without being noticed. <br> Learn more about securing the identity perimeter in [Azure Identity Management and access control security best practices](../security/fundamentals/identity-management-best-practices.md). | 
| Related policy | [Deprecated accounts should be removed from your subscription](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f6b1cbf55-e8b6-442f-ba4c-7246b6381474) | Subscriptions should be purged of accounts that are blocked in Active Directory and have read and write permissions. |

### Deprecating three VM alerts

**Estimated date for change:** June 2022

The following table lists the alerts that will be deprecated during June 2022.

| Alert name | Description | Tactocs | Severity |
|--|--|--|--|
| **Docker build operation detected on a Kubernetes node** <br>(VM_ImageBuildOnNode) | Machine logs indicate a build operation of a container image on a Kubernetes node. While this behavior might be legitimate, attackers might build their malicious images locally to avoid detection. | Defense Evasion | Low |
| **Suspicious request to Kubernetes API** <br>(VM_KubernetesAPI) | Machine logs indicate that a suspicious request was made to the Kubernetes API. The request was sent from a Kubernetes node, possibly from one of the containers running in the node. Although this behavior can be intentional, it might indicate that the node is running a compromised container. | LateralMovement | Medium |
| **SSH server is running inside a container** <br>(VM_ContainerSSH) | Machine logs indicate that an SSH server is running inside a Docker container. While this behavior can be intentional, it frequently indicates that a container is misconfigured or breached. | 	Execution | Medium |

These alerts are used to notify a user about suspicious activity connected to a Kubernetes cluster. The alerts will be replaced with matching alerts that are part of the Microsoft Defender for Cloud Container alerts (`K8S.NODE_ImageBuildOnNode`, `K8S.NODE_ KubernetesAPI` and `K8S.NODE_ ContainerSSH`) which will provide improved fidelity and comprehensive context to investigate and act on the alerts. Learn more about alerts for [Kubernetes Clusters](alerts-reference.md).

### Deprecating the "API App should only be accessible over HTTPS" policy

**Estimated date for change:** June 2022

The `API App should only be accessible over HTTPS` policy has been deprecated. In its place, we are recommending you apply a new policy, "App Service apps should only be accessible over HTTPS". This new policy will be similar to the existing "Web Application should only be accessible over HTTPS" policy, but with an expanded scope. 

To learn more about policy definitions for Azure App Service, see [Azure Policy built-in definitions for Azure App Service](../azure-app-configuration/policy-reference.md)

## Next steps

For all recent changes to Defender for Cloud, see [What's new in Microsoft Defender for Cloud?](release-notes.md)
