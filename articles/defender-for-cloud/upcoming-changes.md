---
title: Important changes coming to Microsoft Defender for Cloud
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan 
ms.topic: overview
ms.date: 07/28/2022
---

# Important upcoming changes to Microsoft Defender for Cloud

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Defender for Cloud. It describes planned modifications to the product that might impact things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Microsoft Defender for Cloud](release-notes.md).

## Planned changes

| Planned change | Estimated date for change |
|--|--|
| [Changes to recommendations for managing endpoint protection solutions](#changes-to-recommendations-for-managing-endpoint-protection-solutions) | June 2022 |
| [Key Vault recommendations changed to "audit"](#key-vault-recommendations-changed-to-audit) | June 2022 |
| [Deprecating three VM alerts](#deprecating-three-vm-alerts) | June 2022|
| [Deprecate API App policies for App Service](#deprecate-api-app-policies-for-app-service) | July 2022 |
| [Change in pricing of Runtime protection for Arc-enabled Kubernetes clusters](#change-in-pricing-of-runtime-protection-for-arc-enabled-kubernetes-clusters) | August 2022 |
| [Multiple changes to identity recommendations](#multiple-changes-to-identity-recommendations) | September 2022 |

### Changes to recommendations for managing endpoint protection solutions

**Estimated date for change:** August 2022

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

### Key Vault recommendations changed to "audit"

**Estimated date for change:** June 2022

The Key Vault recommendations listed here are currently disabled so that they don't impact your secure score. We will change their effect to "audit".

| Recommendation name | Recommendation ID |
| ------- | ------ |
| Validity period of certificates stored in Azure Key Vault should not exceed 12 months | fc84abc0-eee6-4758-8372-a7681965ca44 |
| Key Vault secrets should have an expiration date | 14257785-9437-97fa-11ae-898cfb24302b |
| Key Vault keys should have an expiration date | 1aabfa0d-7585-f9f5-1d92-ecb40291d9f2 |

### Deprecating three VM alerts

**Estimated date for change:** June 2022

The following table lists the alerts that will be deprecated during June 2022.

| Alert name | Description | Tactics | Severity |
|--|--|--|--|
| **Docker build operation detected on a Kubernetes node** <br>(VM_ImageBuildOnNode) | Machine logs indicate a build operation of a container image on a Kubernetes node. While this behavior might be legitimate, attackers might build their malicious images locally to avoid detection. | Defense Evasion | Low |
| **Suspicious request to Kubernetes API** <br>(VM_KubernetesAPI) | Machine logs indicate that a suspicious request was made to the Kubernetes API. The request was sent from a Kubernetes node, possibly from one of the containers running in the node. Although this behavior can be intentional, it might indicate that the node is running a compromised container. | LateralMovement | Medium |
| **SSH server is running inside a container** <br>(VM_ContainerSSH) | Machine logs indicate that an SSH server is running inside a Docker container. While this behavior can be intentional, it frequently indicates that a container is misconfigured or breached. | Execution | Medium |

These alerts are used to notify a user about suspicious activity connected to a Kubernetes cluster. The alerts will be replaced with matching alerts that are part of the Microsoft Defender for Cloud Container alerts (`K8S.NODE_ImageBuildOnNode`, `K8S.NODE_ KubernetesAPI` and `K8S.NODE_ ContainerSSH`) which will provide improved fidelity and comprehensive context to investigate and act on the alerts. Learn more about alerts for [Kubernetes Clusters](alerts-reference.md).

### Deprecate API App policies for App Service

**Estimated date for change:** July 2022

We will be deprecating the following policies to corresponding policies that already exist to include API apps:

| To be deprecated | Changing to |
|--|--|
|`Ensure API app has 'Client Certificates (Incoming client certificates)' set to 'On'` | `App Service apps should have 'Client Certificates (Incoming client certificates)' enabled` | 
| `Ensure that 'Python version' is the latest, if used as a part of the API app` | `App Service apps that use Python should use the latest 'Python version` |
| `CORS should not allow every resource to access your API App` | `App Service apps should not have CORS configured to allow every resource to access your apps` |
| `Managed identity should be used in your API App` | `App Service apps should use managed identity` |
| `Remote debugging should be turned off for API Apps` | `App Service apps should have remote debugging turned off` |
| `Ensure that 'PHP version' is the latest, if used as a part of the API app` | `App Service apps that use PHP should use the latest 'PHP version'`|
| `FTPS only should be required in your API App` | `App Service apps should require FTPS only` |
| `Ensure that 'Java version' is the latest, if used as a part of the API app` | `App Service apps that use Java should use the latest 'Java version` |
| `Latest TLS version should be used in your API App` | `App Service apps should use the latest TLS version` |

### Change in pricing of runtime protection for Arc-enabled Kubernetes clusters

**Estimated date for change:** August 2022

Runtime protection is currently a preview feature for Arc-enabled Kubernetes clusters. In August, Arc-enabled Kubernetes clusters will be charged for runtime protection. You can view pricing details on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/). Subscriptions with Kubernetes clusters already onboarded to Arc, will begin to incur charges in August.

### Multiple changes to identity recommendations

**Estimated date for change:** July 2022

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
    |--|--|
    |Accounts with owner permissions on Azure resources should be MFA enabled|6240402e-f77c-46fa-9060-a7ce53997754|
    |Accounts with write permissions on Azure resources should be MFA enabled|c0cb17b2-0607-48a7-b0e0-903ed22de39b|
    |Accounts with read permissions on Azure resources should be MFA enabled|dabc9bc4-b8a8-45bd-9a5a-43000df8aa1c|
    |Guest accounts with owner permissions on Azure resources should be removed|20606e75-05c4-48c0-9d97-add6daa2109a|
    |Guest accounts with write permissions on Azure resources should be removed|0354476c-a12a-4fcc-a79d-f0ab7ffffdbb|
    |Guest accounts with read permissions on Azure resources should be removed|fde1c0c9-0fd2-4ecc-87b5-98956cbc1095|
    |Blocked accounts with owner permissions on Azure resources should be removed|050ac097-3dda-4d24-ab6d-82568e7a50cf|
    |Blocked accounts with read and write permissions on Azure resources should be removed| 1ff0b4c9-ed56-4de6-be9c-d7ab39645926 |

## Next steps

For all recent changes to Defender for Cloud, see [What's new in Microsoft Defender for Cloud?](release-notes.md)
