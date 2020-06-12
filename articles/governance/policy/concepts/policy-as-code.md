---
title: Design Policy as Code workflows
description: Learn to design workflows to deploy your Azure Policy definitions as code and automatically validate resources.
ms.date: 05/20/2020
ms.topic: conceptual
---
# Design Policy as Code workflows

As you progress on your journey with Cloud Governance, you'll want to shift from manually managing
each policy definition in the Azure portal or through the various SDKs to something more manageable
and repeatable at enterprise scale. Two of the predominant approaches to managing systems at scale
in the cloud are:

- Infrastructure as Code: The practice of treating the content that defines your environments,
  everything from Resource Manager templates to Azure Policy definitions to Azure Blueprints, as
  source code.
- DevOps: The union of people, process, and products to enable continuous delivery of value to our
  end users.

Policy as Code is the combination of these ideas. Essentially, keep your policy definitions in
source control and whenever a change is made, test, and validate that change. However, that shouldn't
be the extent of policies involvement with Infrastructure as Code or DevOps.

The validation step should also be a component of other continuous integration or continuous
deployment workflows. Examples include deploying an application environment or virtual
infrastructure. By making Azure Policy validation an early component of the build and deployment
process the application and operations teams discover if their changes are non-complaint, long
before it's too late and they're attempting to deploy in production.

## Workflow overview

The recommended general workflow of Policy as Code looks like this diagram:

:::image type="content" source="../media/policy-as-code/policy-as-code-workflow.png" alt-text="Policy as Code workflow overview" border="false":::

### Create and update policy definitions

The policy definitions are created using JSON, and stored in source control. Each policy has its
own set of files, such as the parameters, rules, and environment parameters, that should be stored
in the same folder. The following structure is a recommended way of keeping your policy definitions
in source control.

```text
.
|
|- policies/  ________________________ # Root folder for policies
|  |- policy1/  ______________________ # Subfolder for a policy
|     |- policy.json _________________ # Policy definition
|     |- policy.parameters.json ______ # Policy definition of parameters
|     |- policy.rules.json ___________ # Policy rule
|     |- params.dev.json _____________ # Parameters for a Dev environment
|     |- params.prd.json _____________ # Parameters for a Prod environment
|     |- params.tst.json _____________ # Parameters for a Test environment
|
|  |- policy2/  ______________________ # Subfolder for a policy
|     |- policy.json _________________ # Policy definition
|     |- policy.parameters.json ______ # Policy definition of parameters
|     |- policy.rules.json ___________ # Policy rule
|     |- params.dev.json _____________ # Parameters for a Dev environment
|     |- params.prd.json _____________ # Parameters for a Prod environment
|     |- params.tst.json _____________ # Parameters for a Test environment
|
```

When a new policy is added or an existing one updated, the workflow should automatically update the
policy definition in Azure. Testing of the new or updated policy definition comes in a later step.

### Create and update initiative definitions

Likewise, initiatives have their own JSON file and related files that should be stored in the same
folder. The initiative definition requires the policy definition to already exist, so can't be
created or updated until the source for the policy has been updated in source control and then
updated in Azure. The following structure is a recommended way of keeping your initiative
definitions in source control:

```text
.
|
|- initiatives/ ______________________ # Root folder for initiatives
|  |- init1/ _________________________ # Subfolder for an initiative
|     |- policyset.json ______________ # Initiative definition
|     |- policyset.definitions.json __ # Initiative list of policies
|     |- policyset.parameters.json ___ # Initiative definition of parameters
|     |- params.dev.json _____________ # Parameters for a Dev environment
|     |- params.prd.json _____________ # Parameters for a Prod environment
|     |- params.tst.json _____________ # Parameters for a Test environment
|
|  |- init2/ _________________________ # Subfolder for an initiative
|     |- policyset.json ______________ # Initiative definition
|     |- policyset.definitions.json __ # Initiative list of policies
|     |- policyset.parameters.json ___ # Initiative definition of parameters
|     |- params.dev.json _____________ # Parameters for a Dev environment
|     |- params.prd.json _____________ # Parameters for a Prod environment
|     |- params.tst.json _____________ # Parameters for a Test environment
|
```

Like policy definitions, when adding or updating an existing initiative, the workflow should
automatically update the initiative definition in Azure. Testing of the new or updated initiative
definition comes in a later step.

### Test and validate the updated definition

Once automation has taken your newly created or updated policy or initiative definitions and made
the update to the object in Azure, it's time to test the changes that were made. Either the policy
or the initiative(s) it's part of should then be assigned to resources in the environment farthest
from production. This environment is typically _Dev_.

The assignment should use [enforcementMode](./assignment-structure.md#enforcement-mode) of
_disabled_ so that resource creation and updates aren't blocked, but that existing resources are
still audited for compliance to the updated policy definition. Even with enforcementMode, it's
recommended that the assignment scope is either a resource group or a subscription that is
specifically for validating policies.

> [!NOTE]
> While enforcement mode is helpful, it's not a replacement for thoroughly testing a policy
> definition under various conditions. The policy definition should be tested with `PUT` and `PATCH`
> REST API calls, compliant and non-compliant resources, and edge cases like a property missing from
> the resource.

After the assignment is deployed, use the Policy SDK to
[get compliance data](../how-to/get-compliance-data.md) for the new assignment. The environment used
to test the policies and assignments should have both compliant and non-compliant resources. Like a
good unit test for code, you want to test that resources are as expected and that you also have no
false-positives or false-negatives. If you test and validate only for what you expect, there may be
unexpected and unidentified impact from the policy. For more information, see
[Evaluate the impact of a new Azure Policy definition](./evaluate-impact.md).

### Enable remediation tasks

If validation of the assignment meets expectations, the next step is to validate remediation.
Policies that use either [deployIfNotExists](./effects.md#deployifnotexists) or
[modify](./effects.md#modify) may be turned into a remediation task and correct resources from a
non-compliant state.

The first step to remediating resources is to grant the policy assignment the role assignment
defined in the policy definition. This role assignment gives the policy assignment managed identity
enough rights to make the needed changes to make the resource compliant.

Once the policy assignment has appropriate rights, use the Policy SDK to trigger a remediation task
against a set of resources that are known to be non-compliant. Three tests should be completed
against these remediated tasks before proceeding:

- Validate that the remediation task completed successfully
- Run policy evaluation to see that policy compliance results are updated as expected
- Run an environment unit test against the resources directly to validate their properties have
  changed

Testing both the updated policy evaluation results and the environment directly provide confirmation
that the remediation tasks changed what was expected and that the policy definition saw the
compliance change as expected.

### Update to enforced assignments

After all validation gates have completed, update the assignment to use **enforcementMode** of
_enabled_. It's recommended to make this change initially in the same environment far from
production. Once that environment is validated as working as expected, the change should then be
scoped to include the next environment, and so on, until the policy is deployed to production
resources.

## Process integrated evaluations

The general workflow for Policy as Code is for developing and deploying policies and initiatives to
an environment at scale. However, policy evaluation should be part of the deployment process for any
workflow that deploys or creates resources in Azure, such as deploying applications or running
Resource Manager templates to create infrastructure.

In these cases, after the application or infrastructure deployment is done to a test subscription or
resource group, policy evaluation should be done for that scope checking validation of all existing
policies and initiatives. While they may be configured as **enforcementMode** _disabled_ in such an
environment, it's useful to know early if an application or infrastructure deployment is in
violation of policy definitions early. This policy evaluation should therefore be a step in those
workflows, and fail deployments that create non-compliant resources.

## Review

This article covers the general workflow for Policy as Code and also where policy evaluation should
be part of other deployment workflows. This workflow can be used in any environment that supports
scripted steps and automation based on triggers.

## Next steps

- Learn about the [policy definition structure](./definition-structure.md).
- Learn about the [policy assignment structure](./assignment-structure.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).