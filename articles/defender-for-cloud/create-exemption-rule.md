---
title: How-to create an exemption rule for a resource or subscription 
description: Learn how to create an exemption rule for a resource or subscription  
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 05/28/2023
---

# Create a rule to exempt specific vulnerability assessment findings 

> [!NOTE] 
> The [Azure Preview Supplemental Terms](//azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.  

If you have an organizational need to ignore a vulnerability assessment finding, rather than remediate it, you can optionally disable or exempt it. Disabled findings don't affect your secure score or generate unwanted noise. 

When a finding matches the criteria you've defined in your disable rules, it doesn't appear in the list of findings. Typical scenario examples include: 

- Disable findings with severity below medium 
- Temporarily disable findings that are non-patchable until a patch is released

> [!IMPORTANT] 
> To create a rule, you need permissions to edit a policy in Azure Policy. 
> Learn more in [Azure RBAC permissions in Azure Policy](../governance/policy/overview.md#azure-rbac-permissions-in-azure-policy). 

 
You can use a combination of any of the following criteria: 

- Minimum auditing severity threshold (low, medium, high, critical) Any CVE below this threshold wouldn't be reported. 
- Fix status (no fix, fix exists, vendor will not fix) 
- CVE 
- Image tag 
- Image digest 
- Base OS distribution 

 To create a rule: 

1. From the recommendations detail page for [Container registry images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability-management)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/PhoenixContainerRegistryRecommendationDetailsBlade/assessmentKey/c0b7cfc6-3172-465a-b378-53c7ff2cc0d5/subscriptionIds~/%5B%220cd6095b-b140-41ec-ad1d-32f2f7493386%22%2C%22f1d79e73-f8e3-4b10-bfdb-4207ca0723ed%22%2C%220368444d-756e-4ca6-9ecd-e964248c227a%22%2C%22212f9889-769e-45ae-ab43-6da33674bd26%22%2C%22c0620f27-ac38-468c-a26b-264009fe7c41%22%2C%227afc2d66-d5b4-4e84-970b-a782e3e4cc46%22%2C%227d411d23-59e5-4e2e-8566-4f59de4544f2%22%2C%22b74d5345-100f-408a-a7ca-47abb52ba60d%22%2C%224628298e-882d-4f12-abf4-a9f9654960bb%22%2C%225a7084cb-3357-4ee0-b28f-a3230de8b337%22%2C%22dd4c2dac-db51-4cd0-b734-684c6cc360c1%22%2C%22bac420ed-c6fc-4a05-8ac1-8c0c52da1d6e%22%2C%223b2fda06-3ef6-454a-9dd5-994a548243e9%22%2C%2229de2cfc-f00a-43bb-bdc8-3108795bd282%22%2C%22bcdc6eb0-74cd-40b6-b3a9-584b33cea7b6%22%2C%224009f3ee-43c4-4f19-97e4-32b6f2285a68%22%2C%22b68b2f37-1d37-4c2f-80f6-c23de402792e%22%2C%22f455dda6-5a9b-4d71-8d51-7afc3b459039%22%5D/showSecurityCenterCommandBar~/false/assessmentOwners~/null), select **Disable rule**. 
1. Select the relevant scope. 
1. Define your criteria. 
1. Select **Apply rule**. 

    [Screenshot showing how to create a disable rule for vulnerability assessment finding on registry]

To view, override, or delete a rule: 

1. Select **Disable rule**. 
1. Use the optional free text box to provide explanation or justification for why the exception was created; when the list of disable rules is reviewed, providing this information helps give clarity to understand why the disable rule was created.
1. From the scope list, subscriptions with active rules show as **Rule applied**. 

[Screenshot showing how to modify or delete an existing rule] 

> [!NOTE]
> New disable rules applied to a subscription may take up to 30 minutes to take effect. New rules on a management group might take up to 24 hours. Disabling rules on the management group will override any rules that may exist on underlying subscriptions. 


## Next Steps 

 Learn more about the Defender for Cloud [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads).
