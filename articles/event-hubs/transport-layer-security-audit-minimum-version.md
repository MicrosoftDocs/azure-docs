---
title: Use Azure Policy to audit for compliance of minimum TLS version for an Azure Event Hubs namespace
titleSuffix: Event Hubs
description: Configure Azure Policy to audit compliance of Azure Event Hubs for using a minimum version of Transport Layer Security (TLS).
services: event-hubs
author: EldertGrootenboer

ms.service: event-hubs
ms.topic: article
ms.date: 04/25/2022
ms.author: egrootenboer
---

# Use Azure Policy to audit for compliance of minimum TLS version for an Azure Event Hubs namespace

If you have a large number of Microsoft Azure Event Hubs namespaces, you may want to perform an audit to make sure that all namespaces are configured for the minimum version of TLS that your organization requires. To audit a set of Event Hubs namespaces for their compliance, use Azure Policy. Azure Policy is a service that you can use to create, assign, and manage policies that apply rules to Azure resources. Azure Policy helps you to keep those resources compliant with your corporate standards and service level agreements. For more information, see [Overview of Azure Policy](../governance/policy/overview.md).

## Create a policy with an audit effect

Azure Policy supports effects that determine what happens when a policy rule is evaluated against a resource. The audit effect creates a warning when a resource is not in compliance, but does not stop the request. For more information about effects, see [Understand Azure Policy effects](../governance/policy/concepts/effects.md).

To create a policy with an audit effect for the minimum TLS version with the Azure portal, follow these steps:

1. In the Azure portal, navigate to the Azure Policy service.
2. Under the  **Authoring**  section, select  **Definitions**.
3. Select  **Add policy definition**  to create a new policy definition.
4. For the  **Definition location**  field, select the  **More**  button to specify where the audit policy resource is located.
5. Specify a name for the policy. You can optionally specify a description and category.
6. Under  **Policy rule** , add the following policy definition to the  **policyRule**  section.

    ```json
    {
      "policyRule": {
        "if": {
          "allOf": [
            {
              "field": "type",
              "equals": "Microsoft.EventHub/namespaces"
            },
            {
              "not": {
                "field": " Microsoft.EventHub/namespaces/minimumTlsVersion",
                "equals": "1.2"
              }
            }
          ]
        },
        "then": {
          "effect": "audit"
        }
      }
    }
    ```

7. Save the policy.

### Assign the policy

Next, assign the policy to a resource. The scope of the policy corresponds to that resource and any resources beneath it. For more information on policy assignment, see [Azure Policy assignment structure](../governance/policy/concepts/assignment-structure.md).

To assign the policy with the Azure portal, follow these steps:

1. In the Azure portal, navigate to the Azure Policy service.
2. Under the  **Authoring**  section, select  **Assignments**.
3. Select  **Assign policy**  to create a new policy assignment.
4. For the  **Scope**  field, select the scope of the policy assignment.
5. For the  **Policy definition**  field, select the  **More**  button, then select the policy you defined in the previous section from the list.
6. Provide a name for the policy assignment. The description is optional.
7. Leave  **Policy enforcement**  set to _Enabled_. This setting has no effect on the audit policy.
8. Select  **Review + create**  to create the assignment.

### View compliance report

After you have assigned the policy, you can view the compliance report. The compliance report for an audit policy provides information on which Event Hubs namespaces are not in compliance with the policy. For more information, see [Get policy compliance data](../governance/policy/how-to/get-compliance-data.md).

It may take several minutes for the compliance report to become available after the policy assignment is created.

To view the compliance report in the Azure portal, follow these steps:

1. In the Azure portal, navigate to the Azure Policy service.
2. Select  **Compliance**.
3. Filter the results for the name of the policy assignment that you created in the previous step. The report shows how many resources are not in compliance with the policy.
4. You can drill down into the report for additional details, including a list of Event Hubs namespaces that are not in compliance.

## Use Azure Policy to enforce the minimum TLS version

Azure Policy supports cloud governance by ensuring that Azure resources adhere to requirements and standards. To enforce a minimum TLS version requirement for the Event Hubs namespaces in your organization, you can create a policy that prevents the creation of a new Event Hubs namespace that sets the minimum TLS requirement to an older version of TLS than that which is dictated by the policy. This policy will also prevent all configuration changes to an existing namespace if the minimum TLS version setting for that namespace is not compliant with the policy.

The enforcement policy uses the deny effect to prevent a request that would create or modify an Event Hubs namespace so that the minimum TLS version no longer adheres to your organization's standards. For more information about effects, see [Understand Azure Policy effects](../governance/policy/concepts/effects.md).

To create a policy with a deny effect for a minimum TLS version that is less than TLS 1.2, provide the following JSON in the  **policyRule**  section of the policy definition:

```json
{
  "policyRule": {
    "if": {
      "allOf": [
        {
          "field": "type",
          "equals": " Microsoft.EventHub/namespaces"
        },
        {
          "not": {
            "field": " Microsoft.EventHub/namespaces/minimumTlsVersion",
            "equals": "1.2"
          }
        }
      ]
    },
    "then": {
      "effect": "deny"
    }
  }
}
```

After you create the policy with the deny effect and assign it to a scope, a user cannot create an Event Hubs namespace with a minimum TLS version that is older than 1.2. Nor can a user make any configuration changes to an existing Event Hubs namespace that currently requires a minimum TLS version that is older than 1.2. Attempting to do so results in an error. The required minimum TLS version for the Event Hubs namespace must be set to 1.2 to proceed with namespace creation or configuration.

An error will be shown if you try to create an Event Hubs namespace with the minimum TLS version set to TLS 1.0 when a policy with a deny effect requires that the minimum TLS version be set to TLS 1.2.

## Next steps

See the following documentation for more information.

- [Enforce a minimum required version of Transport Layer Security (TLS) for requests to an Event Hubs namespace](transport-layer-security-enforce-minimum-version.md)
- [Configure the minimum TLS version for an Event Hubs namespace](transport-layer-security-configure-minimum-version.md)
- [Configure Transport Layer Security (TLS) for an Event Hubs client application](transport-layer-security-configure-client-version.md)