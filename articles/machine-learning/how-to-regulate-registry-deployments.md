---
title: Regulate deployments in Model Catalog using policies
titleSuffix: Azure Machine Learning
description: Learn about using the Azure Machine Learning built-in policy to deny registry model deployments 
services: machine-learning
ms.service: machine-learning
ms.subservice: training
ms.topic: how-to
ms.author: timanghn
author: tinaem
ms.reviewer: ssalgado
ms.date: 12/14/2023
---

# Regulate deployments in Model Catalog using policies

The Model Catalog in Azure Machine Learning Studio provides access to many open-source foundation models, and regulating the deployments of these models by enforcing organization standards can be of paramount importance to meet your security and compliance requirements. In this article, you learn how you can restrict the deployments from the Model Catalog using a built-in Azure Policy.

[Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/) is a governance tool that gives users the ability to audit, perform real-time enforcement and manage their Azure environment at scale. For more information, see the [Overview of the Azure Policy service](https://learn.microsoft.com/en-us/azure/governance/policy/overview).

Example Usage Scenarios:

* You want to enforce your organizational security policies, but you don't have an automated and reliable way to do so.
* You want to relax some requirements for your test teams, but you want to maintain tight controls over your production environment. You need a simple automated way to separate enforcement of your resources.

## Azure Policy for Azure Machine Learning Registry model deployments

With the Azure Machine Learning [built-in policy for registry model deployments](https://portal.azure.com/?feature.customportal=false#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F19539b54-c61e-4196-9a38-67598701be90)(preview), you can deny all registry deployments or allow model deployments from a specific registry. You can also add an optional blocklist of models and add exceptions to the list within the allowed registry. 

This built-in policy supports `Deny` effect only.

`Deny:` With the effect of the policy set to deny, the policy blocks the creation of new deployments from Azure Machine Learning registries that don't comply with the policy definition and generate an event in the activity log. Existing noncompliant deployments aren't affected.

Model Catalog collections are made available to users using the underlying registries. You can find the underlying registry name in the model asset ID.   

### Create a Policy Assignment

1. On the Azure home page, type Policy in the search bar and select the Azure **Policy** icon.

2. On the Azure Policy service, under **Authoring**, select *Assignments*.

:::image type="content" source="how-to-regulate-registry-deployments/policy-home.png" alt-text="Screenshot of Assignments tab within Azure Policy home page.":::

3. On the Assignments page, select the **Assign Policy** icon at the top. 

:::image type="content" source="media/how-to-regulate-registry-deployments/assign-policy.md" alt-text="Screenshot of Basics tab on the Assign Policy page.":::

4. On the Assign Policy page basics tab, update the following fields:
    1. Scope: Select what Azure subscriptions and resource groups the policies apply to.
    2. Exclusions: Select any resources from the scope to exclude from the policy assignment.
    3. Policy Definition: Select the policy definition to apply to the scope with exclusions. Type "Azure Machine Learning" in the search bar and locate the policy '[Preview] Azure Machine Learning Model Registry Deployments are restricted except for allowed registry'. Select the policy and select **Add**.

:::image type="content" source="how-to-regulate-registry-deployments/assign-policy-parameters.png" alt-text="Screenshot of Assign policy parameters tab tab within Azure Policy home page.":::

5. Select the **Parameters** tab and update the Effect and policy assignment parameters. Make sure to uncheck the 'Only show parameters that need input or review' so all the parameters show up. To further clarify what the parameter does, hover over the info icon next to the parameter name.

If no model asset IDs are set in the *Restricted Model AssetIds* parameter during the policy assignment, this policy only allows deploying all models from the model registry specified in *Allowed Registry Name' parameter.

6. Select **Review + Create** to finalize your policy assignment. The policy assignment takes approximately 15 minutes until it's active for new resources. 

### Disable the policy

You can remove the policy assignment in the Azure portal using the following steps:

1. Navigate to the Policy pane on the Azure portal.
2. Select **Assignments**.
3. Select on the ... button next to your policy assignment and select **Delete** assignment.

### Limitations 

* Any change in the policy (including updating the policy definition, assignments, exemptions or policy set) takes 10 mins for those changes to become effective in the evaluation process.
* Complaince is reported for newly created and updated components. During public preview, compliance records remain for 24 hours. Model deployments that exist before these policy definitions are assigned will not report compliance.
* This built-in policy supports only Greenfield operations currently. You can’t trigger the evaluations of deployments that existed before setting up the policy definition and assignment.
* You can’t allowlist more than one registry in a policy assignment. Users can create multiple policy assignments if they want to allow model deployments from multiple registries.

## Next Steps

- Learn how to [get compliance data](https://learn.microsoft.com/en-us/azure/governance/policy/how-to/get-compliance-data).
- Learn how to [create policies programmatically](https://learn.microsoft.com/en-us/azure/governance/policy/how-to/programmatically-create).
