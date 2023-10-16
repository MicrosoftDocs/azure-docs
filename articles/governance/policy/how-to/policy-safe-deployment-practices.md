---
title: Safe deployment of Azure Policy assignments
description: Learn how to apply the safe deployment practices (SDP) framework to your Azure Policy assignments.
ms.date: 04/21/2023
ms.topic: conceptual
---

# Safe deployment of Azure Policy assignments

As your environment expands, so does the demand for a controlled continuous deployment (CD)
pipeline with progressive exposure control. Accordingly, Microsoft recommends DevOps teams follow
the safe deployment practices (SDP) framework. The
safe deployment of Azure Policy definitions and assignments helps limiting the impact of
unintended behaviors of policy resources.

The high-level approach of implementing SDP with Azure Policy is to graudally roll-out policy assignments
by rings to detect policy changes that affect the environment in early stages before it
affects the critical cloud infrastructure.

Deployment rings can be organized in diverse ways. In this how-to tutorial, rings are divided by
different Azure regions with _Ring 0_ representing non-critical, low traffic locations
and _Ring 5_ denoting the most critical, highest traffic locations.

## Steps for safe deployment of Azure Policy assignments with deny or append effects

Use the following flowchart as a reference as we work through how to apply the SDP framework to Azure
Policy assignments that use the `deny` or `append` policy effects.

> [!NOTE]
> To learn more about Azure policy effects, see [Understand how effects work](../concepts/effects.md).

:::image type="content" source="../media/policy-safe-deployment-practices/safe-deployment-practices-flowchart-1.png" alt-text="Flowchart with steps one through eight showing safe deployment practices deployment of a new Azure Policy definition." border="true":::

Flowchart step numbers: 

1. Once you've selected your policy definition, assign the policy at the highest-level scope inclusive
of all deployment rings. Apply _resource selectors_ to narrow the applicability to the least
critical ring by using the `"kind": "resource location"` property. Configure the `audit` effect type
by using _assignment overrides_. Sample selector with `eastUS` location and effect as `audit`:

    ```json
    "resourceSelectors": [{ 
      "name": "SDPRegions", 
      "selectors": [{
          "kind": "resourceLocation",
          "in": [ "eastUS" ] 
      }]
    }], 
    "overrides":[{ 
      "kind": "policyEffect", 
      "value": "Audit" 
    }] 
    ```

2. Once the assignment is deployed and the initial compliance scan has completed,
validate that the compliance result is as expected.

    You should also configure automated tests that run compliance checks. A compliance check should
    encompass the following logic:
    
    - Gather compliance results
    - If compliance results are as expected, the pipeline should continue
    - If compliance results aren't as expected, the pipeline should fail and you should start debugging
    
    For example, you can configure the compliance check by using other tools within
    your particular continuous integration/continuous deployment (CI/CD) pipeline.
    
    At each rollout stage, the application health checks should confirm the stability of the service
    and impact of the policy. If the results aren't as expected due to application configuration,
    refactor the application as appropriate.

3. Repeat by expanding the resource selector property values to include the next rings'
locations and validating the expected compliance results and application health. Example selector with an added location value:

    ```json
    "resourceSelectors": [{ 
      "name": "SDPRegions", 
      "selectors": [{
          "kind": "resourceLocation",
          "in": [ "eastUS", "westUS"] 
      }]
    }]
    ```

4. Once you have successfully assigned the policy to all rings using `audit` mode,
the pipeline should trigger a task that changes the policy effect to `deny` and reset
the resource selectors to the location associated with _Ring 0_. Example selector with one region and effect set to deny:

    ```json
    "resourceSelectors": [{ 
      "name": "SDPRegions", 
      "selectors": [{
          "kind": "resourceLocation",
          "in": [ "eastUS" ] 
      }]
    }], 
    "overrides":[{ 
      "kind": "policyEffect", 
      "value": "Deny" 
    }] 
    ```

5. Once the effect is changed, automated tests should check whether enforcement is taking place as
expected.

6. Repeat by including more rings in your resource selector configuration.

7. Repeat this process for all production rings.

## Steps for safe deployment of Azure Policy assignments with modify or deployIfNotExists effects

The steps for policies using the `modify` or `deployIfNotExists` effects are similar to steps previously explained with the additional action of using _enforcement mode_ and triggering a remediation task.
Review the following flowchart with modified steps 5-9:

:::image type="content" source="../media/policy-safe-deployment-practices/safe-deployment-practices-flowchart-2.png" alt-text="Flowchart showing steps 5 through 9 in the Azure Policy safe deployment practices workflow." border="true":::

Flowchart step numbers:  

1. Once you've selected your policy definition, assign the policy at the highest-level scope inclusive
of all deployment rings. Apply _resource selectors_ to narrow the applicability to the least
critical ring by using the `"kind": "resource location"` property. Configure the _enforcement mode_ of the assignment to _DoNotEnforce_. Sample selector with `eastUS` location and _enforcementMode_ as  _DoNotEnforce_:

    ```json
    "resourceSelectors": [{ 
      "name": "SDPRegions", 
      "selectors": [{
          "kind": "resourceLocation",
          "in": [ "eastUS" ] 
      }]
    }], 
   "enforcementMode": "DoNotEnforce"
    ```

2. Once the assignment is deployed and the initial compliance scan has completed,
validate that the compliance result is as expected.

    You should also configure automated tests that run compliance checks. A compliance check should
    encompass the following logic:
    
    - Gather compliance results
    - If compliance results are as expected, the pipeline should continue
    - If compliance results aren't as expected, the pipeline should fail and you should start debugging
    
    You can configure the compliance check by using other tools within
    your continuous integration/continuous deployment (CI/CD) pipeline.
    
    At each rollout stage, the application health checks should confirm the stability of the service
    and impact of the policy. If the results aren't as expected due to application configuration,
    refactor the application as appropriate.

    You may also [trigger remediation tasks](../how-to/remediate-resources.md) to remediate existing non-compliant resources. Ensure the remediation tasks are bringing resources into compliance as expected.

3. Repeat by expanding the resource selector property values to include the next ring's
locations and validating the expected compliance results and application health. Example selector with an added location value:

    ```json
    "resourceSelectors": [{ 
      "name": "SDPRegions", 
      "selectors": [{
          "kind": "resourceLocation",
          "in": [ "eastUS", "westUS"] 
      }]
    }]
    ```

4. Once you have successfully assigned the policy to all rings using _DoNotEnforce_ mode,
the pipeline should trigger a task that changes the policy `enforcementMode` to _Default_ enablement and reset
the resource selectors to the location associated with _Ring 0_. Example selector with one region and effect set to deny:

    ```json
    "resourceSelectors": [{ 
      "name": "SDPRegions", 
      "selectors": [{
          "kind": "resourceLocation",
          "in": [ "eastUS" ] 
      }]
    }], 
   "enforcementMode": "Default",
    ```

5. Once the effect is changed, automated tests should check whether enforcement is taking place as
expected.

6. Repeat by including more rings in your resource selector configuration.

7. Repeat this process for all production rings.

## Next steps

- Learn how to [programmatically create policies](./programmatically-create.md).
- Review [Azure Policy as code workflows](../concepts/policy-as-code.md).
- Study Microsoft's guidance concerning [safe deployment practices](/devops/operate/safe-deployment-practices).
- Review [Remediate non-compliant resources with Azure Policy](./remediate-resources.md).