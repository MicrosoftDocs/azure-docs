---
title: Release notes for Microsoft Defender for Cloud
description: A description of what's new and changed in Microsoft Defender for Cloud
ms.topic: overview
ms.date: 05/04/2023
---

# What's new in Microsoft Defender for Cloud?

Defender for Cloud is in active development and receives improvements on an ongoing basis. To stay up to date with the most recent developments, this page provides you with information about new features, bug fixes, and deprecated functionality.

This page is updated frequently, so revisit it often.

To learn about *planned* changes that are coming soon to Defender for Cloud, see [Important upcoming changes to Microsoft Defender for Cloud](upcoming-changes.md).

> [!TIP]
> If you're looking for items older than six months, you can find them in the [Archive for What's new in Microsoft Defender for Cloud](release-notes-archive.md).

## April 2023

Updates in April include:

- [Agentless Container Posture in Defender CSPM (Preview)](#agentless-container-posture-in-defender-cspm-preview)
- [New preview Unified Disk Encryption recommendation](#unified-disk-encryption-recommendation-preview)
- [Changes in the recommendation Machines should be configured securely](#changes-in-the-recommendation-machines-should-be-configured-securely)
- [Deprecation of App Service language monitoring policies](#deprecation-of-app-service-language-monitoring-policies)
- [New alert in Defender for Resource Manager](#new-alert-in-defender-for-resource-manager)
- [Three alerts in the Defender for Resource Manager plan have been deprecated](#three-alerts-in-the-defender-for-resource-manager-plan-have-been-deprecated)
- [Alerts automatic export to Log Analytics workspace have been deprecated](#alerts-automatic-export-to-log-analytics-workspace-have-been-deprecated)
- [Deprecation and improvement of selected alerts for Windows and Linux Servers](#deprecation-and-improvement-of-selected-alerts-for-windows-and-linux-servers)
- [New Azure Active Directory authentication-related recommendations for Azure Data Services](#new-azure-active-directory-authentication-related-recommendations-for-azure-data-services)
- [Two recommendations related to missing Operating System (OS) updates were released to GA](#two-recommendations-related-to-missing-operating-system-os-updates-were-released-to-ga)
- [Defender for APIs (Preview)](#defender-for-apis-preview)

### Agentless Container Posture in Defender CSPM (Preview)

The new Agentless Container Posture (Preview) capabilities are available as part of the Defender CSPM (Cloud Security Posture Management) plan.

Agentless Container Posture allows security teams to identify security risks in containers and Kubernetes realms. An agentless approach allows security teams to gain visibility into their Kubernetes and containers registries across SDLC and runtime, removing friction and footprint from the workloads.

Agentless Container Posture offers container vulnerability assessments that, combined with attack path analysis, enable security teams to prioritize and zoom into specific container vulnerabilities. You can also use cloud security explorer to uncover risks and hunt for container posture insights, such as discovery of applications running vulnerable images or exposed to the internet.

Learn more at [Agentless Container Posture (Preview)](concept-agentless-containers.md).

### Unified Disk Encryption recommendation (preview)

We have introduced a unified disk encryption recommendation in public preview, `Windows virtual machines should enable Azure Disk Encryption or EncryptionAtHost` and `Linux virtual machines should enable Azure Disk Encryption or EncryptionAtHost`. 

These recommendations replace `Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources`, which detected Azure Disk Encryption and the policy `Virtual machines and virtual machine scale sets should have encryption at host enabled`, which detected EncryptionAtHost. ADE and EncryptionAtHost provide comparable encryption at rest coverage, and we recommend enabling one of them on every virtual machine. The new recommendations detect whether either ADE or EncryptionAtHost are enabled and only warn if neither are enabled. We also warn if ADE is enabled on some, but not all disks of a VM (this condition isn't applicable to EncryptionAtHost). 

The new recommendations require [Azure Automanage Machine Configuration](https://aka.ms/gcpol).

These recommendations are based on the following policies:

- [(Preview) Windows virtual machines should enable Azure Disk Encryption or EncryptionAtHost](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f3dc5edcd-002d-444c-b216-e123bbfa37c0)
- [(Preview) Linux virtual machines should enable Azure Disk Encryption or EncryptionAtHost](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fca88aadc-6e2b-416c-9de2-5a0f01d1693f)

Learn more about [ADE and EncryptionAtHost and how to enable one of them](../virtual-machines/disk-encryption-overview.md).

### Changes in the recommendation Machines should be configured securely

The recommendation `Machines should be configured securely` was updated. The update improves the performance and stability of the recommendation and aligns its experience with the generic behavior of Defender for Cloud's recommendations.

As part of this update, the recommendation's ID was changed from `181ac480-f7c4-544b-9865-11b8ffe87f47` to `c476dc48-8110-4139-91af-c8d940896b98`.

No action is required on the customer side, and there's no expected effect on the secure score.

### Deprecation of App Service language monitoring policies

The following App Service language monitoring policies have been deprecated due to their ability to generate false negatives and because they don't provide better security. You should always ensure you're using a language version without any known vulnerabilities.

| Policy name | Policy ID |
|--|--|
| [App Service apps that use Java should use the latest 'Java version'](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F496223c3-ad65-4ecd-878a-bae78737e9ed) | 496223c3-ad65-4ecd-878a-bae78737e9ed |
| [App Service apps that use Python should use the latest 'Python version'](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7008174a-fd10-4ef0-817e-fc820a951d73) | 7008174a-fd10-4ef0-817e-fc820a951d73 |
| [Function apps that use Java should use the latest 'Java version'](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9d0b6ea4-93e2-4578-bf2f-6bb17d22b4bc) | 9d0b6ea4-93e2-4578-bf2f-6bb17d22b4bc |
| [Function apps that use Python should use the latest 'Python version'](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7238174a-fd10-4ef0-817e-fc820a951d73) | 7238174a-fd10-4ef0-817e-fc820a951d73 |
| [App Service apps that use PHP should use the latest 'PHP version'](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7261b898-8a84-4db8-9e04-18527132abb3)| 7261b898-8a84-4db8-9e04-18527132abb3 |

Customers can use alternative built-in policies to monitor any specified language version for their App Services. 

These policies are no longer available in Defender for Cloud's built-in recommendations. You can [add them as custom recommendations](create-custom-recommendations.md) to have Defender for Cloud monitor them.

### New alert in Defender for Resource Manager

Defender for Resource Manager has the following new alert:

| Alert (alert type) | Description | MITRE tactics | Severity |
|---|---|:-:|---|
| **PREVIEW - Suspicious creation of compute resources detected**<br>(ARM_SuspiciousComputeCreation) | Microsoft Defender for Resource Manager identified a suspicious creation of compute resources in your subscription utilizing Virtual Machines/Azure Scale Set. The identified operations are designed to allow administrators to efficiently manage their environments by deploying new resources when needed. While this activity may be legitimate, a threat actor might utilize such operations to conduct crypto mining.<br> The activity is deemed suspicious as the compute resources scale is higher than previously observed in the subscription. <br> This can indicate that the principal is compromised and is being used with malicious intent. | Impact | Medium  |

You can see a list of all of the [alerts available for Resource Manager](alerts-reference.md#alerts-resourcemanager).

### Three alerts in the Defender for Resource Manager plan have been deprecated

The following three alerts for the Defender for Resource Manager plan have been deprecated:

- `Activity from a risky IP address (ARM.MCAS_ActivityFromAnonymousIPAddresses)`
- `Activity from infrequent country (ARM.MCAS_ActivityFromInfrequentCountry)`
- `Impossible travel activity (ARM.MCAS_ImpossibleTravelActivity)`

In a scenario where activity from a suspicious IP address is detected, one of the following Defenders for Resource Manager plan alerts `Azure Resource Manager operation from suspicious IP address` or `Azure Resource Manager operation from suspicious proxy IP address` will be present.


### Alerts automatic export to Log Analytics workspace have been deprecated

Defenders for Cloud security alerts are automatically exported to a default Log Analytics workspace on the resource level. This causes an indeterministic behavior and therefore we have deprecated this feature.

Instead, you can export your security alerts to a dedicated Log Analytics workspace with [Continuous Export](continuous-export.md#set-up-a-continuous-export).

If you have already configured continuous export of your alerts to a Log Analytics workspace, no further action is required.

### Deprecation and improvement of selected alerts for Windows and Linux Servers

The security alert quality improvement process for Defender for Servers includes the deprecation of some alerts for both Windows and Linux servers. The deprecated alerts are now sourced from and covered by Defender for Endpoint threat alerts.  

If you already have the Defender for Endpoint integration enabled, no further action is required. You may experience a decrease in your alerts volume in April 2023.

If you don't have the Defender for Endpoint integration enabled in Defender for Servers, you'll need to enable the Defender for Endpoint integration to maintain and improve your alert coverage. 

All Defender for Servers customers, have full access to the Defender for Endpoint’s integration as a part of the [Defender for Servers plan](plan-defender-for-servers-select-plan.md#plan-features).  

You can learn more about [Microsoft Defender for Endpoint onboarding options](integration-defender-for-endpoint.md#enable-the-microsoft-defender-for-endpoint-integration).

You can also view the [full list of alerts](alerts-reference.md#defender-for-servers-alerts-to-be-deprecated) that are set to be deprecated.

Read the [Microsoft Defender for Cloud blog](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/defender-for-servers-security-alerts-improvements/ba-p/3714175).

### New Azure Active Directory authentication-related recommendations for Azure Data Services

We have added four new Azure Active Directory authentication-related recommendations for Azure Data Services.

| Recommendation Name | Recommendation Description | Policy |
|--|--|--|
| Azure SQL Managed Instance authentication mode should be Azure Active Directory Only | Disabling local authentication methods and allowing only Azure Active Directory Authentication improves security by ensuring that Azure SQL Managed Instances can exclusively be accessed by Azure Active Directory identities. | [Azure SQL Managed Instance should have Azure Active Directory Only Authentication enabled](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f78215662-041e-49ed-a9dd-5385911b3a1f) |
| Azure Synapse Workspace authentication mode should be Azure Active Directory Only | Azure Active Directory only authentication methods improves security by ensuring that Synapse Workspaces exclusively require Azure AD identities for authentication. [Learn more](https://aka.ms/Synapse). | [Synapse Workspaces should use only Azure Active Directory identities for authentication](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f2158ddbe-fefa-408e-b43f-d4faef8ff3b8) |
| Azure Database for MySQL should have an Azure Active Directory administrator provisioned | Provision an Azure AD administrator for your Azure Database for MySQL to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services | [An Azure Active Directory administrator should be provisioned for MySQL servers](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f146412e9-005c-472b-9e48-c87b72ac229e) |
| Azure Database for PostgreSQL should have an Azure Active Directory administrator provisioned | Provision an Azure AD administrator for your Azure Database for PostgreSQL to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services | [An Azure Active Directory administrator should be provisioned for PostgreSQL servers](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fb4dec045-250a-48c2-b5cc-e0c4eec8b5b4) |

### Two recommendations related to missing Operating System (OS) updates were released to GA

The recommendations `System updates should be installed on your machines (powered by Update management center)` and `Machines should be configured to periodically check for missing system updates` have been released for General Availability.

To use the new recommendation, you need to:

- Connect your non-Azure machines to Arc.
- [Enable the periodic assessment property](../update-center/assessment-options.md#periodic-assessment). You can use the [Fix button](implement-security-recommendations.md). 
 in the new recommendation, `Machines should be configured to periodically check for missing system updates` to fix the recommendation.

After completing these steps, you can remove the old recommendation `System updates should be installed on your machines`, by disabling it from Defender for Cloud's built-in initiative in Azure policy.

The two versions of the recommendations:

- [`System updates should be installed on your machines`](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/SystemUpdatesRecommendationDetailsWithRulesBlade/assessmentKey/4ab6e3c5-74dd-8b35-9ab9-f61b30875b27/subscriptionIds~/%5B%220cd6095b-b140-41ec-ad1d-32f2f7493386%22%2C%220ee78edb-a0ad-456c-a0a2-901bf542c102%22%2C%2284ca48fe-c942-42e5-b492-d56681d058fa%22%2C%22b2a328a7-ffff-4c09-b643-a4758cf170bc%22%2C%22eef8b6d5-94da-4b36-9327-a662f2674efb%22%2C%228d5565a3-dec1-4ee2-86d6-8aabb315eec4%22%2C%22e0fd569c-e34a-4249-8c24-e8d723c7f054%22%2C%22dad45786-32e5-4ef3-b90e-8e0838fbadb6%22%2C%22a5f9f0d3-a937-4de5-8cf3-387fce51e80c%22%2C%220368444d-756e-4ca6-9ecd-e964248c227a%22%2C%22e686ef8c-d35d-4e9b-92f8-caaaa7948c0a%22%2C%222145a411-d149-4010-84d4-40fe8a55db44%22%2C%22212f9889-769e-45ae-ab43-6da33674bd26%22%2C%22615f5f56-4ba9-45cf-b644-0c09d7d325c8%22%2C%22487bb485-b5b0-471e-9c0d-10717612f869%22%2C%22cb9eb375-570a-4e75-b83a-77dd942bee9f%22%2C%224bbecc02-f2c3-402a-8e01-1dfb1ffef499%22%2C%22432a7068-99ae-4975-ad38-d96b71172cdf%22%2C%22c0620f27-ac38-468c-a26b-264009fe7c41%22%2C%22a1920ebd-59b7-4f19-af9f-5e80599e88e4%22%2C%22b43a6159-1bea-4fa2-9407-e875fdc0ff55%22%2C%22d07c0080-170c-4c24-861d-9c817742986a%22%2C%22ae71ef11-a03f-4b4f-a0e6-ef144727c711%22%2C%2255a24be0-d9c3-4ecd-86b6-566c7aac2512%22%2C%227afc2d66-d5b4-4e84-970b-a782e3e4cc46%22%2C%2252a442a2-31e9-42f9-8e3e-4b27dbf82673%22%2C%228c4b5b03-3b24-4ed0-91f5-a703cd91b412%22%2C%22e01de573-132a-42ac-9ee2-f9dea9dd2717%22%2C%22b5c0b80f-5932-4d47-ae25-cd617dac90ce%22%2C%22e4e06275-58d1-4081-8f1b-be12462eb701%22%2C%229b4236fe-df75-4289-bf00-40628ed41fd9%22%2C%2221d8f407-c4c4-452e-87a4-e609bfb86248%22%2C%227d411d23-59e5-4e2e-8566-4f59de4544f2%22%2C%22b74d5345-100f-408a-a7ca-47abb52ba60d%22%2C%22f30787b9-82a8-4e74-bb0f-f12d64ecc496%22%2C%22482e1993-01d4-4b16-bff4-1866929176a1%22%2C%2226596251-f2f3-4e31-8a1b-f0754e32ad73%22%2C%224628298e-882d-4f12-abf4-a9f9654960bb%22%2C%224115b323-4aac-47f4-bb13-22af265ed58b%22%2C%22911e3904-5112-4232-a7ee-0d1811363c28%22%2C%22cd0fa82d-b6b6-4361-b002-050c32f71353%22%2C%22dd4c2dac-db51-4cd0-b734-684c6cc360c1%22%2C%22d2c9544f-4329-4642-b73d-020e7fef844f%22%2C%22bac420ed-c6fc-4a05-8ac1-8c0c52da1d6e%22%2C%2250ff7bc0-cd15-49d5-abb2-e975184c2f65%22%2C%223cd95ff9-ac62-4b5c-8240-0cd046687ea0%22%2C%2213723929-6644-4060-a50a-cc38ebc5e8b1%22%2C%2209fa8e83-d677-474f-8f73-2a954a0b0ea4%22%2C%22ca38bc19-cf50-48e2-bbe6-8c35b40212d8%22%2C%22bf163a87-8506-4eb3-8d14-c2dc95908830%22%2C%221278a874-89fc-418c-b6b9-ac763b000415%22%2C%223b2fda06-3ef6-454a-9dd5-994a548243e9%22%2C%226560575d-fa06-4e7d-95fb-f962e74efd7a%22%2C%22c3547baf-332f-4d8f-96bd-0659b39c7a59%22%2C%222f96ae42-240b-4228-bafa-26d8b7b03bf3%22%2C%2229de2cfc-f00a-43bb-bdc8-3108795bd282%22%2C%22a1ffc958-d2c7-493e-9f1e-125a0477f536%22%2C%2254b875cc-a81a-4914-8bfd-1a36bc7ddf4d%22%2C%22407ff5d7-0113-4c5c-8534-f5cfb09298f5%22%2C%22365a62ee-6166-4d37-a936-03585106dd50%22%2C%226d17b59e-06c4-4203-89d2-de793ebf5452%22%2C%229372b318-ed3a-4504-95a6-941201300f78%22%2C%223c1bb38c-82e3-4f8d-a115-a7110ba70d05%22%2C%22c6dcd830-359f-44d0-b4d4-c1ba95e86f48%22%2C%2209e8ad18-7bdb-43b8-80c4-43ee53460e0b%22%2C%22dcbdac96-1896-478d-89fc-c95ed43f4596%22%2C%22d23422cf-c0f2-4edc-a306-6e32b181a341%22%2C%228c2c7b23-848d-40fe-b817-690d79ad9dfd%22%2C%221163fbbe-27e7-4b0f-8466-195fe5417043%22%2C%223905431d-c062-4c17-8fd9-c51f89f334c4%22%2C%227ea26ded-0260-4e78-9336-285d4d9e33d2%22%2C%225ccdbd03-f1b1-4b59-a609-300685e17ce3%22%2C%22bcdc6eb0-74cd-40b6-b3a9-584b33cea7b6%22%2C%22d557e825-27b1-4819-8af5-dc2429af91c9%22%2C%222bb50811-92b6-43a1-9d80-745962d9c759%22%2C%22409111bf-3097-421c-ad68-a44e716edf58%22%2C%2249e3f635-484a-43d1-b953-b29e1871ba88%22%2C%22b77ec8a9-04ed-48d2-a87a-e5887b978ba6%22%2C%22075423e9-7d33-4166-8bdf-3920b04e3735%22%2C%22ef143bbb-6a7e-4a3f-b64f-2f23330e0116%22%2C%2224afc59a-f969-4f83-95c9-3b70f52d833d%22%2C%22a8783cc5-1171-4c34-924f-6f71a20b21ec%22%2C%220079a9bb-e218-496a-9880-d27ad6192f52%22%2C%226f53185c-ea09-4fc3-9075-318dec805303%22%2C%22588845a8-a4a7-4ab1-83a1-1388452e8c0c%22%2C%22b68b2f37-1d37-4c2f-80f6-c23de402792e%22%2C%22eec2de82-6ab2-4a84-ae5f-57e9a10bf661%22%2C%22227531a4-d775-435b-a878-963ed8d0d18f%22%2C%228cff5d56-95fb-4a74-ab9d-079edb45313e%22%2C%22e72e5254-f265-4e95-9bd2-9ee8e7329051%22%2C%228ae1955e-f748-4273-a507-10159ba940f9%22%2C%22f6869ac6-2a40-404f-acd3-d07461be771a%22%2C%2285b3dbca-5974-4067-9669-67a141095a76%22%2C%228168a4f2-74d6-4663-9951-8e3a454937b7%22%2C%229ec1d932-0f3f-486c-acc6-e7d78b358f9b%22%2C%2279f57c16-00fe-48da-87d4-5192e86cd047%22%2C%22bac044cf-49e1-4843-8dda-1ce9662606c8%22%2C%22009d0e9f-a42a-470e-b315-82496a88cf0f%22%2C%2268f3658f-0090-4277-a500-f02227aaee97%22%5D/showSecurityCenterCommandBar~/false/assessmentOwners~/null) 
- [`System updates should be installed on your machines (powered by Update management center)`](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/SystemUpdatesV2RecommendationDetailsBlade/assessmentKey/e1145ab1-eb4f-43d8-911b-36ddf771d13f/subscriptionIds~/%5B%220cd6095b-b140-41ec-ad1d-32f2f7493386%22%2C%220ee78edb-a0ad-456c-a0a2-901bf542c102%22%2C%2284ca48fe-c942-42e5-b492-d56681d058fa%22%2C%22b2a328a7-ffff-4c09-b643-a4758cf170bc%22%2C%22eef8b6d5-94da-4b36-9327-a662f2674efb%22%2C%228d5565a3-dec1-4ee2-86d6-8aabb315eec4%22%2C%22e0fd569c-e34a-4249-8c24-e8d723c7f054%22%2C%22dad45786-32e5-4ef3-b90e-8e0838fbadb6%22%2C%22a5f9f0d3-a937-4de5-8cf3-387fce51e80c%22%2C%220368444d-756e-4ca6-9ecd-e964248c227a%22%2C%22e686ef8c-d35d-4e9b-92f8-caaaa7948c0a%22%2C%222145a411-d149-4010-84d4-40fe8a55db44%22%2C%22212f9889-769e-45ae-ab43-6da33674bd26%22%2C%22615f5f56-4ba9-45cf-b644-0c09d7d325c8%22%2C%22487bb485-b5b0-471e-9c0d-10717612f869%22%2C%22cb9eb375-570a-4e75-b83a-77dd942bee9f%22%2C%224bbecc02-f2c3-402a-8e01-1dfb1ffef499%22%2C%22432a7068-99ae-4975-ad38-d96b71172cdf%22%2C%22c0620f27-ac38-468c-a26b-264009fe7c41%22%2C%22a1920ebd-59b7-4f19-af9f-5e80599e88e4%22%2C%22b43a6159-1bea-4fa2-9407-e875fdc0ff55%22%2C%22d07c0080-170c-4c24-861d-9c817742986a%22%2C%22ae71ef11-a03f-4b4f-a0e6-ef144727c711%22%2C%2255a24be0-d9c3-4ecd-86b6-566c7aac2512%22%2C%227afc2d66-d5b4-4e84-970b-a782e3e4cc46%22%2C%2252a442a2-31e9-42f9-8e3e-4b27dbf82673%22%2C%228c4b5b03-3b24-4ed0-91f5-a703cd91b412%22%2C%22e01de573-132a-42ac-9ee2-f9dea9dd2717%22%2C%22b5c0b80f-5932-4d47-ae25-cd617dac90ce%22%2C%22e4e06275-58d1-4081-8f1b-be12462eb701%22%2C%229b4236fe-df75-4289-bf00-40628ed41fd9%22%2C%2221d8f407-c4c4-452e-87a4-e609bfb86248%22%2C%227d411d23-59e5-4e2e-8566-4f59de4544f2%22%2C%22b74d5345-100f-408a-a7ca-47abb52ba60d%22%2C%22f30787b9-82a8-4e74-bb0f-f12d64ecc496%22%2C%22482e1993-01d4-4b16-bff4-1866929176a1%22%2C%2226596251-f2f3-4e31-8a1b-f0754e32ad73%22%2C%224628298e-882d-4f12-abf4-a9f9654960bb%22%2C%224115b323-4aac-47f4-bb13-22af265ed58b%22%2C%22911e3904-5112-4232-a7ee-0d1811363c28%22%2C%22cd0fa82d-b6b6-4361-b002-050c32f71353%22%2C%22dd4c2dac-db51-4cd0-b734-684c6cc360c1%22%2C%22d2c9544f-4329-4642-b73d-020e7fef844f%22%2C%22bac420ed-c6fc-4a05-8ac1-8c0c52da1d6e%22%2C%2250ff7bc0-cd15-49d5-abb2-e975184c2f65%22%2C%223cd95ff9-ac62-4b5c-8240-0cd046687ea0%22%2C%2213723929-6644-4060-a50a-cc38ebc5e8b1%22%2C%2209fa8e83-d677-474f-8f73-2a954a0b0ea4%22%2C%22ca38bc19-cf50-48e2-bbe6-8c35b40212d8%22%2C%22bf163a87-8506-4eb3-8d14-c2dc95908830%22%2C%221278a874-89fc-418c-b6b9-ac763b000415%22%2C%223b2fda06-3ef6-454a-9dd5-994a548243e9%22%2C%226560575d-fa06-4e7d-95fb-f962e74efd7a%22%2C%22c3547baf-332f-4d8f-96bd-0659b39c7a59%22%2C%222f96ae42-240b-4228-bafa-26d8b7b03bf3%22%2C%2229de2cfc-f00a-43bb-bdc8-3108795bd282%22%2C%22a1ffc958-d2c7-493e-9f1e-125a0477f536%22%2C%2254b875cc-a81a-4914-8bfd-1a36bc7ddf4d%22%2C%22407ff5d7-0113-4c5c-8534-f5cfb09298f5%22%2C%22365a62ee-6166-4d37-a936-03585106dd50%22%2C%226d17b59e-06c4-4203-89d2-de793ebf5452%22%2C%229372b318-ed3a-4504-95a6-941201300f78%22%2C%223c1bb38c-82e3-4f8d-a115-a7110ba70d05%22%2C%22c6dcd830-359f-44d0-b4d4-c1ba95e86f48%22%2C%2209e8ad18-7bdb-43b8-80c4-43ee53460e0b%22%2C%22dcbdac96-1896-478d-89fc-c95ed43f4596%22%2C%22d23422cf-c0f2-4edc-a306-6e32b181a341%22%2C%228c2c7b23-848d-40fe-b817-690d79ad9dfd%22%2C%221163fbbe-27e7-4b0f-8466-195fe5417043%22%2C%223905431d-c062-4c17-8fd9-c51f89f334c4%22%2C%227ea26ded-0260-4e78-9336-285d4d9e33d2%22%2C%225ccdbd03-f1b1-4b59-a609-300685e17ce3%22%2C%22bcdc6eb0-74cd-40b6-b3a9-584b33cea7b6%22%2C%22d557e825-27b1-4819-8af5-dc2429af91c9%22%2C%222bb50811-92b6-43a1-9d80-745962d9c759%22%2C%22409111bf-3097-421c-ad68-a44e716edf58%22%2C%2249e3f635-484a-43d1-b953-b29e1871ba88%22%2C%22b77ec8a9-04ed-48d2-a87a-e5887b978ba6%22%2C%22075423e9-7d33-4166-8bdf-3920b04e3735%22%2C%22ef143bbb-6a7e-4a3f-b64f-2f23330e0116%22%2C%2224afc59a-f969-4f83-95c9-3b70f52d833d%22%2C%22a8783cc5-1171-4c34-924f-6f71a20b21ec%22%2C%220079a9bb-e218-496a-9880-d27ad6192f52%22%2C%226f53185c-ea09-4fc3-9075-318dec805303%22%2C%22588845a8-a4a7-4ab1-83a1-1388452e8c0c%22%2C%22b68b2f37-1d37-4c2f-80f6-c23de402792e%22%2C%22eec2de82-6ab2-4a84-ae5f-57e9a10bf661%22%2C%22227531a4-d775-435b-a878-963ed8d0d18f%22%2C%228cff5d56-95fb-4a74-ab9d-079edb45313e%22%2C%22e72e5254-f265-4e95-9bd2-9ee8e7329051%22%2C%228ae1955e-f748-4273-a507-10159ba940f9%22%2C%22f6869ac6-2a40-404f-acd3-d07461be771a%22%2C%2285b3dbca-5974-4067-9669-67a141095a76%22%2C%228168a4f2-74d6-4663-9951-8e3a454937b7%22%2C%229ec1d932-0f3f-486c-acc6-e7d78b358f9b%22%2C%2279f57c16-00fe-48da-87d4-5192e86cd047%22%2C%22bac044cf-49e1-4843-8dda-1ce9662606c8%22%2C%22009d0e9f-a42a-470e-b315-82496a88cf0f%22%2C%2268f3658f-0090-4277-a500-f02227aaee97%22%5D/showSecurityCenterCommandBar~/false/assessmentOwners~/null)
 
will both be available until the [Log Analytics agent is deprecated on August 31, 2024](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/), which is when the older version (`System updates should be installed on your machines`) of the recommendation will be deprecated as well. Both recommendations return the same results and are available under the same control `Apply system updates`.

The new recommendation `System updates should be installed on your machines (powered by Update management center)`, has a remediation flow available through the Fix button, which can be used to remediate any results through the Update Management Center (Preview). This remediation process is still in Preview. 

The new recommendation `System updates should be installed on your machines (powered by Update management center)`, isn't expected to affect your Secure Score, as it will have the same results as the old recommendation `System updates should be installed on your machines`.

The prerequisite recommendation ([Enable the periodic assessment property](../update-center/assessment-options.md#periodic-assessment)) will have a negative effect on your Secure Score. You can remediate the negative effect with the available [Fix button](implement-security-recommendations.md). 

### Defender for APIs (Preview)

Microsoft's Defender for Cloud is announcing the new Defender for APIs is available in preview.

Defender for APIs offers full lifecycle protection, detection, and response coverage for APIs.

Defender for APIs helps you to gain visibility into business-critical APIs. You can investigate and improve your API security posture, prioritize vulnerability fixes, and quickly detect active real-time threats.

Learn more about [Defender for APIs](defender-for-apis-introduction.md).

## March 2023

Updates in March include:

- [A new Defender for Storage plan is available, including near-real time malware scanning and sensitive data threat detection](#a-new-defender-for-storage-plan-is-available-including-near-real-time-malware-scanning-and-sensitive-data-threat-detection)
- [Data-aware security posture (preview)](#data-aware-security-posture-preview)
- [Improved experience for managing the default Azure security policies](#improved-experience-for-managing-the-default-azure-security-policies)
- [Defender CSPM (Cloud Security Posture Management) is now Generally Available (GA)](#defender-cspm-cloud-security-posture-management-is-now-generally-available-ga)
- [Option to create custom recommendations and security standards in Microsoft Defender for Cloud](#option-to-create-custom-recommendations-and-security-standards-in-microsoft-defender-for-cloud)
- [Microsoft cloud security benchmark (MCSB) version 1.0 is now Generally Available (GA)](#microsoft-cloud-security-benchmark-mcsb-version-10-is-now-generally-available-ga)
- [Some regulatory compliance standards are now available in government clouds](#some-regulatory-compliance-standards-are-now-available-in-government-clouds)
- [New preview recommendation for Azure SQL Servers](#new-preview-recommendation-for-azure-sql-servers)
- [New alert in Defender for Key Vault](#new-alert-in-defender-for-key-vault)

### A new Defender for Storage plan is available, including near-real time malware scanning and sensitive data threat detection

Cloud storage plays a key role in the organization and stores large volumes of valuable and sensitive data. Today we're announcing a new Defender for Storage plan. If you’re using the previous plan (now renamed to "Defender for Storage (classic)"), you'll need to proactively [migrate to the new plan](defender-for-storage-classic-migrate.md) in order to use the new features and benefits.

The new plan includes advanced security capabilities to help protect against malicious file uploads, sensitive data exfiltration, and data corruption. It also provides a more predictable and flexible pricing structure for better control over coverage and costs.

The new plan has new capabilities now in public preview:

- Detecting sensitive data exposure and exfiltration events

- Near real-time blob on-upload malware scanning across all file types

- Detecting entities with no identities using SAS tokens

These capabilities enhance the existing Activity Monitoring capability, based on control and data plane log analysis and behavioral modeling to identify early signs of breach.

All these capabilities are available in a new predictable and flexible pricing plan that provides granular control over data protection at both the subscription and resource levels. 

Learn more at [Overview of Microsoft Defender for Storage](defender-for-storage-introduction.md).

### Data-aware security posture (preview)

Microsoft Defender for Cloud helps security teams to be more productive at reducing risks and responding to data breaches in the cloud. It allows them to cut through the noise with data context and prioritize the most critical security risks, preventing a costly data breach.

- Automatically discover data resources across cloud estate and evaluate their accessibility, data sensitivity and configured data flows.
-Continuously uncover risks to data breaches of sensitive data resources, exposure or attack paths that could lead to a data resource using a lateral movement technique.
- Detect suspicious activities that may indicate an ongoing threat to sensitive data resources.

[Learn more](concept-data-security-posture.md) about data-aware security posture.

### Improved experience for managing the default Azure security policies

We introduce an improved Azure security policy management experience for built-in recommendations that simplifies the way Defender for Cloud customers fine tune their security requirements. The new experience includes the following new capabilities:

- A simple interface allows better performance and fewer select when managing default security policies within Defender for Cloud, including enabling/disabling, denying, setting parameters and managing exemptions.
- A single view of all built-in security recommendations offered by the Microsoft cloud security benchmark (formerly the Azure security benchmark). Recommendations are organized into logical groups, making it easier to understand the types of resources covered, and the relationship between parameters and recommendations.
- New features such as filters and search have been added.

Learn how to  [manage security policies](tutorial-security-policy.md). 

Read the [Microsoft Defender for Cloud blog](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/improved-experience-for-managing-the-default-azure-security/ba-p/3776522).

### Defender CSPM (Cloud Security Posture Management) is now Generally Available (GA)

We're announcing that Defender CSPM is now Generally Available (GA). Defender CSPM offers all of the services available under the Foundational CSPM capabilities and adds the following benefits:

- **Attack path analysis and ARG API** - Attack path analysis uses a graph-based algorithm that scans the cloud security graph to expose attack paths and suggests recommendations as to how best remediate issues that break the attack path and prevent successful breach. You can also consume attack paths programmatically by querying Azure Resource Graph (ARG) API. Learn how to use [attack path analysis](how-to-manage-attack-path.md)
- **Cloud Security explorer** - Use the Cloud Security Explorer to run graph-based queries on the cloud security graph, to proactively identify security risks in your multicloud environments.  Learn more about [cloud security explorer](concept-attack-path.md#what-is-cloud-security-explorer). 

Learn more about [Defender CSPM](overview-page.md).

### Option to create custom recommendations and security standards in Microsoft Defender for Cloud

Microsoft Defender for Cloud provides the option of creating custom recommendations and standards for AWS and GCP using KQL queries. You can use a query editor to build and test queries over your data.
This feature is part of the Defender CSPM (Cloud Security Posture Management) plan. Learn how to [create custom recommendations and standards](create-custom-recommendations.md).

### Microsoft cloud security benchmark (MCSB) version 1.0 is now Generally Available (GA)

Microsoft Defender for Cloud is announcing that the Microsoft cloud security benchmark (MCSB) version 1.0 is now Generally Available (GA). 

MCSB version 1.0 replaces the Azure Security Benchmark (ASB) version 3 as Microsoft Defender for Cloud's default security policy for identifying security vulnerabilities in your cloud environments according to common security frameworks and best practices. MCSB version 1.0 appears as the default compliance standard in the compliance dashboard and is enabled by default for all Defender for Cloud customers.

You can also learn [How Microsoft cloud security benchmark (MCSB) helps you succeed in your cloud security journey](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/announcing-microsoft-cloud-security-benchmark-v1-general/ba-p/3763013).

Learn more about [MCSB](https://aka.ms/mcsb).

### Some regulatory compliance standards are now available in government clouds

We're announcing that the following regulatory standards are being updated with latest version and are available for customers in Azure Government and Azure China 21Vianet.

**Azure Government**:
- [PCI DSS v4](/azure/compliance/offerings/offering-pci-dss)
- [SOC 2 Type 2](/azure/compliance/offerings/offering-soc-2)
- [ISO 27001:2013](/azure/compliance/offerings/offering-iso-27001)

**Azure China 21Vianet**:
- [SOC 2 Type 2](/azure/compliance/offerings/offering-soc-2)
- [ISO 27001:2013](/azure/compliance/offerings/offering-iso-27001)

Learn how to [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

### New preview recommendation for Azure SQL Servers

We've added a new recommendation for Azure SQL Servers, `Azure SQL Server authentication mode should be Azure Active Directory Only (Preview)`.

The recommendation is based on the existing policy [`Azure SQL Database should have Azure Active Directory Only Authentication enabled`](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fabda6d70-9778-44e7-84a8-06713e6db027)

This recommendation disables local authentication methods and allows only Azure Active Directory Authentication, which improves security by ensuring that Azure SQL Databases can exclusively be accessed by Azure Active Directory identities.

Learn how to [create servers with Azure AD-only authentication enabled in Azure SQL](/azure/azure-sql/database/authentication-azure-ad-only-authentication-create-server).

### New alert in Defender for Key Vault

Defender for Key Vault has the following new alert:

| Alert (alert type) | Description | MITRE tactics | Severity |
|---|---|:-:|---|
| **Denied access from a suspicious IP to a key vault**<br>(KV_SuspiciousIPAccessDenied) | An unsuccessful key vault access has been attempted by an IP that has been identified by Microsoft Threat Intelligence as a suspicious IP address. Though this attempt was unsuccessful, it indicates that your infrastructure might have been compromised. We recommend further investigations. | Credential Access | Low |

You can see a list of all of the [alerts available for Key Vault](alerts-reference.md).

## February 2023

Updates in February include:

- [Enhanced Cloud Security Explorer](#enhanced-cloud-security-explorer)
- [Defender for Containers' vulnerability scans of running Linux images now GA](#defender-for-containers-vulnerability-scans-of-running-linux-images-now-ga)
- [Announcing support for the AWS CIS 1.5.0 compliance standard](#announcing-support-for-the-aws-cis-150-compliance-standard)
- [Microsoft Defender for DevOps (preview) is now available in other regions](#microsoft-defender-for-devops-preview-is-now-available-in-other-regions)
- [The built-in policy [Preview]: Private endpoint should be configured for Key Vault has been deprecated](#the-built-in-policy-preview-private-endpoint-should-be-configured-for-key-vault-has-been-deprecated)

### Enhanced Cloud Security Explorer

An improved version of the cloud security explorer includes a refreshed user experience that removes query friction dramatically, added the ability to run multicloud and multi-resource queries, and embedded documentation for each query option.

The Cloud Security Explorer now allows you to run cloud-abstract queries across resources. You can use either the prebuilt query templates or use the custom search to apply filters to build your query. Learn [how to manage Cloud Security Explorer](how-to-manage-cloud-security-explorer.md).

### Defender for Containers' vulnerability scans of running Linux images now GA

Defender for Containers detects vulnerabilities in running containers. Both Windows and Linux containers are supported.

In August 2022, this capability was [released in preview](release-notes-archive.md) for Windows and Linux. It's now released for general availability (GA) for Linux.

When vulnerabilities are detected, Defender for Cloud generates the following security recommendation listing the scan's findings: [Running container images should have vulnerability findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/KubernetesRuntimeVisibilityRecommendationDetailsBlade/assessmentKey/41503391-efa5-47ee-9282-4eff6131462c/showSecurityCenterCommandBar~/false).

Learn more about [viewing vulnerabilities for running images](defender-for-containers-vulnerability-assessment-azure.md).

### Announcing support for the AWS CIS 1.5.0 compliance standard

Defender for Cloud now supports the CIS Amazon Web Services Foundations v1.5.0 compliance standard. The standard can be [added to your Regulatory Compliance dashboard](update-regulatory-compliance-packages.md#add-a-regulatory-standard-to-your-dashboard), and builds on MDC's existing offerings for multicloud recommendations and standards.

This new standard includes both existing and new recommendations that extend Defender for Cloud's coverage to new AWS services and resources.

Learn how to [Manage AWS assessments and standards](how-to-manage-aws-assessments-standards.md).

### Microsoft Defender for DevOps (preview) is now available in other regions

Microsoft Defender for DevOps has expanded its preview and is now available in the West Europe and East Australia regions, when you onboard your Azure DevOps and GitHub resources. 

Learn more about [Microsoft Defender for DevOps](defender-for-devops-introduction.md).

### The built-in policy \[Preview]: Private endpoint should be configured for Key Vault has been deprecated

The built-in policy [`[Preview]: Private endpoint should be configured for Key Vault`](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5f0bc445-3935-4915-9981-011aa2b46147) has been deprecated and has been replaced with the [`[Preview]: Azure Key Vaults should use private link`](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa6abeaec-4d90-4a02-805f-6b26c4d3fbe9) policy.

Learn more about [integrating Azure Key Vault with Azure Policy](../key-vault/general/azure-policy.md#network-access).

## January 2023

Updates in January include:

- [The Endpoint protection (Microsoft Defender for Endpoint) component is now accessed in the Settings and monitoring page](#the-endpoint-protection-microsoft-defender-for-endpoint-component-is-now-accessed-in-the-settings-and-monitoring-page)
- [New version of the recommendation to find missing system updates (Preview)](#new-version-of-the-recommendation-to-find-missing-system-updates-preview)
- [Cleanup of deleted Azure Arc machines in connected AWS and GCP accounts](#cleanup-of-deleted-azure-arc-machines-in-connected-aws-and-gcp-accounts)
- [Allow continuous export to Event Hubs behind a firewall](#allow-continuous-export-to-event-hubs-behind-a-firewall)
- [The name of the Secure score control Protect your applications with Azure advanced networking solutions has been changed](#the-name-of-the-secure-score-control-protect-your-applications-with-azure-advanced-networking-solutions-has-been-changed)
- [The policy Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports has been deprecated](#the-policy-vulnerability-assessment-settings-for-sql-server-should-contain-an-email-address-to-receive-scan-reports-has-been-deprecated)
- [Recommendation to enable diagnostic logs for Virtual Machine Scale Sets has been deprecated](#recommendation-to-enable-diagnostic-logs-for-virtual-machine-scale-sets-has-been-deprecated)

### The Endpoint protection (Microsoft Defender for Endpoint) component is now accessed in the Settings and monitoring page

To access Endpoint protection navigate to **Environment settings** > **Defender plans** > **Settings and monitoring**. From here you can set Endpoint protection to **On**. You can also see all of the other components that are managed.

Learn more about [enabling Microsoft Defender for Endpoint](integration-defender-for-endpoint.md) on your servers with Defender for Servers.

### New version of the recommendation to find missing system updates (Preview)

You no longer need an agent on your Azure VMs and Azure Arc machines to make sure the machines have all of the latest security or critical system updates.

The new system updates recommendation, `System updates should be installed on your machines (powered by Update management center)` in the `Apply system updates` control, is based on the [Update management center (preview)](../update-center/overview.md). The recommendation relies on a native agent embedded in every Azure VM and Azure Arc machines instead of an installed agent. The Quick Fix in the new recommendation leads you to a one-time installation of the missing updates in the Update management center portal.

To use the new recommendation, you need to:

- Connect your non-Azure machines to Arc
- Turn on the [periodic assessment property](../update-center/assessment-options.md#periodic-assessment). You can use the Quick Fix in the new recommendation, `Machines should be configured to periodically check for missing system updates` to fix the recommendation.

The existing "System updates should be installed on your machines" recommendation, which relies on the Log Analytics agent, is still available under the same control.

### Cleanup of deleted Azure Arc machines in connected AWS and GCP accounts

A machine connected to an AWS and GCP account that is covered by Defender for Servers or Defender for SQL on machines is represented in Defender for Cloud as an Azure Arc machine. Until now, that machine wasn't deleted from the inventory when the machine was deleted from the AWS or GCP account. Leading to unnecessary Azure Arc resources left in Defender for Cloud that represents deleted machines.

Defender for Cloud will now automatically delete Azure Arc machines when those machines are deleted in connected AWS or GCP account.

### Allow continuous export to Event Hubs behind a firewall

You can now enable the continuous export of alerts and recommendations, as a trusted service to Event Hubs that are protected by an Azure firewall.

You can enable continuous export as the alerts or recommendations are generated. You can also define a schedule to send periodic snapshots of all of the new data.

Learn how to enable [continuous export to an Event Hubs behind an Azure firewall](continuous-export.md#continuously-export-to-an-event-hub-behind-a-firewall).

### The name of the Secure score control Protect your applications with Azure advanced networking solutions has been changed

The secure score control, `Protect your applications with Azure advanced networking solutions` has been changed to `Protect applications against DDoS attacks`.

The updated name is reflected on Azure Resource Graph (ARG), Secure Score Controls API and the `Download CSV report`.

### The policy Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports has been deprecated

The policy [`Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports`](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F057d6cfe-9c4f-4a6d-bc60-14420ea1f1a9) has been deprecated.

The Defender for SQL vulnerability assessment email report is still available and existing email configurations haven't changed.

### Recommendation to enable diagnostic logs for Virtual Machine Scale Sets has been deprecated

The recommendation `Diagnostic logs in Virtual Machine Scale Sets should be enabled` has been deprecated.

The related [policy definition](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c1b1214-f927-48bf-8882-84f0af6588b1) has also been deprecated from any standards displayed in the regulatory compliance dashboard.

| Recommendation | Description | Severity |
|--|--|--|
| Diagnostic logs in Virtual Machine Scale Sets should be enabled | Enable logs and retain them for up to a year, enabling you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. | Low |

## December 2022

Updates in December include:

- [Announcing express configuration for vulnerability assessment in Defender for SQL](#announcing-express-configuration-for-vulnerability-assessment-in-defender-for-sql)

### Announcing express configuration for vulnerability assessment in Defender for SQL

The express configuration for vulnerability assessment in Microsoft Defender for SQL provides security teams with a streamlined configuration experience on Azure SQL Databases and Dedicated SQL Pools outside of Synapse Workspaces.

With the express configuration experience for vulnerability assessments, security teams can:

- Complete the vulnerability assessment configuration in the security configuration of the SQL resource, without any another settings or dependencies on customer-managed storage accounts.
- Immediately add scan results to baselines so that the status of the finding changes from **Unhealthy** to **Healthy** without rescanning a database.
- Add multiple rules to baselines at once and use the latest scan results.
- Enable vulnerability assessment for all Azure SQL Servers when you turn on Microsoft Defender for databases at the subscription-level.

Learn more about [Defender for SQL vulnerability assessment](sql-azure-vulnerability-assessment-overview.md).

## November 2022

Updates in November include:

- [Protect containers across your GCP organization with Defender for Containers](#protect-containers-across-your-gcp-organization-with-defender-for-containers)
- [Validate Defender for Containers protections with sample alerts](#validate-defender-for-containers-protections-with-sample-alerts)
- [Governance rules at scale (Preview)](#governance-rules-at-scale-preview)
- [The ability to create custom assessments in AWS and GCP (Preview) has been deprecated](#the-ability-to-create-custom-assessments-in-aws-and-gcp-preview-has-been-deprecated)
- [The recommendation to configure dead-letter queues for Lambda functions has been deprecated](#the-recommendation-to-configure-dead-letter-queues-for-lambda-functions-has-been-deprecated)

### Protect containers across your GCP organization with Defender for Containers

Now you can enable [Defender for Containers](defender-for-containers-introduction.md) for your GCP environment to protect standard GKE clusters across an entire GCP organization. Just create a new GCP connector with Defender for Containers enabled or enable Defender for Containers on an existing organization level GCP connector.

Learn more about [connecting GCP projects and organizations](quickstart-onboard-gcp.md#connect-your-gcp-project) to Defender for Cloud.

### Validate Defender for Containers protections with sample alerts

You can now create sample alerts also for Defender for Containers plan. The new sample alerts are presented as being from AKS, Arc-connected clusters, EKS, and GKE resources with different severities and MITRE tactics. You can use the sample alerts to validate security alert configurations, such as SIEM integrations, workflow automation, and email notifications.

Learn more about [alert validation](alert-validation.md).

### Governance rules at scale (Preview)

We're happy to announce the new ability to apply governance rules at scale (Preview) in Defender for Cloud.

With this new experience, security teams are able to define governance rules in bulk for various scopes (subscriptions and connectors). Security teams can accomplish this task by using management scopes such as Azure management groups, AWS top level accounts or GCP organizations.

Additionally, the Governance rules (Preview) page presents all of the available governance rules that are effective in the organization’s environments.

Learn more about the [new governance rules at-scale experience](governance-rules.md).

> [!NOTE]
> As of January 1, 2023, in order to experience the capabilities offered by Governance, you must have the [Defender CSPM plan](concept-cloud-security-posture-management.md) enabled on your subscription or connector.

### The ability to create custom assessments in AWS and GCP (Preview) has been deprecated

The ability to create custom assessments for [AWS accounts](how-to-manage-aws-assessments-standards.md) and [GCP projects](how-to-manage-gcp-assessments-standards.md), which was a Preview feature, has been deprecated.

### The recommendation to configure dead-letter queues for Lambda functions has been deprecated

The recommendation [`Lambda functions should have a dead-letter queue configured`](https://portal.azure.com/#view/Microsoft_Azure_Security/AwsRecommendationDetailsBlade/assessmentKey/dcf10b98-798f-4734-9afd-800916bf1e65/showSecurityCenterCommandBar~/false) has been deprecated.

| Recommendation | Description | Severity |
|--|--|--|
| Lambda functions should have a dead-letter queue configured | This control checks whether a Lambda function is configured with a dead-letter queue. The control fails if the Lambda function isn't configured with a dead-letter queue. As an alternative to an on-failure destination, you can configure your function with a dead-letter queue to save discarded events for further processing. A dead-letter queue acts the same as an on-failure destination. It's used when an event fails all processing attempts or expires without being processed. A dead-letter queue allows you to look back at errors or failed requests to your Lambda function to debug or identify unusual behavior. From a security perspective, it's important to understand why your function failed and to ensure that your function doesn't drop data or compromise data security as a result. For example, if your function can't communicate to an underlying resource that could be a symptom of a denial of service (DoS) attack elsewhere in the network. | Medium |

## Next steps

For past changes to Defender for Cloud, see [Archive for what's new in Defender for Cloud?](release-notes-archive.md).
