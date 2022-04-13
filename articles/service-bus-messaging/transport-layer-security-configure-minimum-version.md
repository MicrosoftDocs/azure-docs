---
title: Enforce a minimum required version of Transport Layer Security (TLS) for incoming requests
titleSuffix: Azure Service Bus
description: Configure a service bus namespace to require a minimum version of Transport Layer Security (TLS) for clients making requests against Azure Service Bus.
services: service-bus
author: EldertGrootenboer

ms.service: service-bus
ms.topic: article
ms.date: 04/12/2022
ms.author: EldertGrootenboer
---

# Enforce a minimum required version of Transport Layer Security (TLS) for requests to a Service Bus namespace

Communication between a client application and an Azure Service Bus namespace is encrypted using Transport Layer Security (TLS). TLS is a standard cryptographic protocol that ensures privacy and data integrity between clients and services over the Internet. For more information about TLS, see [Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security).

Azure Service Bus currently supports three versions of the TLS protocol: 1.0, 1.1, and 1.2. Azure Service Bus uses TLS 1.2 on public endpoints, but TLS 1.0 and TLS 1.1 are still supported for backward compatibility.

Azure Service Bus namespaces permit clients to send and receive data with the oldest version of TLS, TLS 1.0, and above. To enforce stricter security measures, you can configure your Service Bus namespace to require that clients send and receive data with a newer version of TLS. If a Service Bus namespace requires a minimum version of TLS, then any requests made with an older version will fail.

This article describes how to set the minimum TLS version clients can use to connect to your Service Bus namespaces.

For information about how to specify a particular version of TLS when sending a request from a client application, see [Configure Transport Layer Security (TLS) for a client application](transport-layer-security-configure-client-version).

### Important

If you are using a service that connects to Azure Service Bus, make sure that that service is using the appropriate version of TLS to send requests to Azure Service Bus before you set the required minimum version for a Service Bus namespace.

## Configure the minimum TLS version for a Service Bus namespace

To configure the minimum TLS version for a Service Bus namespace, set the  **MinimumTlsVersion**  version property. This property is available for Service Bus namespaces that are created with the Azure Resource Manager deployment model.

When you create a Service Bus namespace with an Azure Resource Manager template, the **MinimumTlsVersion** property is set to 1.2 by default, unless explicitly set to another version.

> [!NOTE]
Existing namespaces using an older api-version, from before 2022-01-01-preview, will be treated with a default setting of 1.0. 

To configure the minimum TLS version for a Service Bus namespace with a template, create a template with the  **MinimumTLSVersion**  property set to 1.0, 1.1, or 1.2. The following steps describe how to create a template in the Azure portal.

1. In the Azure portal, choose  **Create a resource**.
2. In  **Search the Marketplace** , type  **custom deployment** , and then press  **ENTER**.
3. Choose **Custom deployment (deploy using custom templates) (preview)**, choose  **Create** , and then choose  **Build your own template in the editor**.
4. In the template editor, paste in the following JSON to create a new namespace and set the minimum TLS version to TLS 1.2. Remember to replace the placeholders in angle brackets with your own values.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {},
    "variables": {
        "serviceBusNamespaceName": "[concat(uniqueString(subscription().subscriptionId), 'tls')]"
    },
    "resources": [
        {
        "name": "[variables(serviceBusNamespaceName)]",
        "type": "Microsoft.ServiceBus/namespaces",
        "apiVersion": "2022-01-01-preview",
        "location": "<location>",
        "properties": {
            "minimumTlsVersion": "1.2"
        },
        "dependsOn": [],
        "tags": {}
        }
    ]
}
```

1. Save the template.
2. Specify resource group parameter, then choose the  **Review + create**  button to deploy the template and create a namespace with the  **MinimumTLSVersion**  property configured.

> [!NOTE]
After you update the minimum TLS version for the Service Bus namespace, it may take up to 30 seconds before the change is fully propagated.

Configuring the minimum TLS version requires version 2022-01-01-preview or later of the Azure Service Bus resource provider.

## Check the minimum required TLS version for multiple namespaces

To check the minimum required TLS version across a set of Service Bus namespaces with optimal performance, you can use the Azure Resource Graph Explorer in the Azure portal. To learn more about using the Resource Graph Explorer, see [Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md).

Running the following query in the Resource Graph Explorer returns a list of Service Bus namespaces and displays the minimum TLS version for each namespace:

```kusto
resources 
| where type =~ 'Microsoft.ServiceBus/namespaces'
| extend minimumTlsVersion = parse\_json(properties).minimumTlsVersion
| project subscriptionId, resourceGroup, name, minimumTlsVersion
```

## Test the minimum TLS version from a client

To test that the minimum required TLS version for a Service Bus namespace forbids calls made with an older version, you can configure a client to use an older version of TLS. For more information about configuring a client to use a specific version of TLS, see [Configure Transport Layer Security (TLS) for a client application](transport-layer-security-configure-client-version).

When a client accesses a Service Bus namespace using a TLS version that does not meet the minimum TLS version configured for the namespace, Azure Service Bus returns error code 400 error (Bad Request) and a message indicating that the TLS version that was used is not permitted for making requests against this Service Bus namespace.

> [!NOTE]
When you configure a minimum TLS version for a Service Bus namespace, that minimum version is enforced at the application layer. Tools that attempt to determine TLS support at the protocol layer may return TLS versions in addition to the minimum required version when run directly against the Service Bus namespace endpoint.

## Use Azure Policy to audit for compliance

If you have a large number of Service Bus namespaces, you may want to perform an audit to make sure that all namespaces are configured for the minimum version of TLS that your organization requires. To audit a set of Service Bus namespaces for their compliance, use Azure Policy. Azure Policy is a service that you can use to create, assign, and manage policies that apply rules to Azure resources. Azure Policy helps you to keep those resources compliant with your corporate standards and service level agreements. For more information, see [Overview of Azure Policy](../governance/policy/overview).

## Create a policy with an Audit effect

Azure Policy supports effects that determine what happens when a policy rule is evaluated against a resource. The Audit effect creates a warning when a resource is not in compliance, but does not stop the request. For more information about effects, see [Understand Azure Policy effects](../governance/policy/concepts/effects).

To create a policy with an Audit effect for the minimum TLS version with the Azure portal, follow these steps:

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
          "equals": "Microsoft.ServiceBus/namespaces"
        },
        {
          "not": {
            "field": " Microsoft.ServiceBus/namespaces/minimumTlsVersion",
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

1. Save the policy.

### Assign the policy

Next, assign the policy to a resource. The scope of the policy corresponds to that resource and any resources beneath it. For more information on policy assignment, see [Azure Policy assignment structure](../governance/policy/concepts/assignment-structure).

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

After you have assigned the policy, you can view the compliance report. The compliance report for an audit policy provides information on which Service Bus namespaces are not in compliance with the policy. For more information, see [Get policy compliance data](../governance/policy/how-to/get-compliance-data).

It may take several minutes for the compliance report to become available after the policy assignment is created.

To view the compliance report in the Azure portal, follow these steps:

1. In the Azure portal, navigate to the Azure Policy service.
2. Select  **Compliance**.
3. Filter the results for the name of the policy assignment that you created in the previous step. The report shows how many resources are not in compliance with the policy.
4. You can drill down into the report for additional details, including a list of Service Bus namespaces that are not in compliance.

## Use Azure Policy to enforce the minimum TLS version

Azure Policy supports cloud governance by ensuring that Azure resources adhere to requirements and standards. To enforce a minimum TLS version requirement for the Service Bus namespaces in your organization, you can create a policy that prevents the creation of a new Service Bus namespace that sets the minimum TLS requirement to an older version of TLS than that which is dictated by the policy. This policy will also prevent all configuration changes to an existing namespace if the minimum TLS version setting for that namespace is not compliant with the policy.

The enforcement policy uses the Deny effect to prevent a request that would create or modify a Service Bus namespace so that the minimum TLS version no longer adheres to your organization's standards. For more information about effects, see [Understand Azure Policy effects](../governance/policy/concepts/effects).

To create a policy with a Deny effect for a minimum TLS version that is less than TLS 1.2, provide the following JSON in the  **policyRule**  section of the policy definition:

```json
{
  "policyRule": {
    "if": {
      "allOf": [
        {
          "field": "type",
          "equals": " Microsoft.ServiceBus/namespaces"
        },
        {
          "not": {
            "field": " Microsoft.ServiceBus/namespaces/minimumTlsVersion",
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

After you create the policy with the Deny effect and assign it to a scope, a user cannot create a Service Bus namespace with a minimum TLS version that is older than 1.2. Nor can a user make any configuration changes to an existing Service Bus namespace that currently requires a minimum TLS version that is older than 1.2. Attempting to do so results in an error. The required minimum TLS version for the Service Bus namespace must be set to 1.2 to proceed with namespace creation or configuration.

An error will be shown if you try to create a Service Bus namespace with the minimum TLS version set to TLS 1.0 when a policy with a Deny effect requires that the minimum TLS version be set to TLS 1.2.

## Permissions necessary to require a minimum version of TLS

To set the  **MinimumTlsVersion**  property for the Service Bus namespace, a user must have permissions to create and manage Service Bus namespaces. Azure role-based access control (Azure RBAC) roles that provide these permissions include the  **Microsoft.ServiceBus/namespaces/write**  or  **Microsoft.ServiceBus/namespaces/\***  action. Built-in roles with this action include:

- The Azure Resource Manager [Owner](../role-based-access-control/built-in-roles#owner) role
- The Azure Resource Manager [Contributor](../role-based-access-control/built-in-roles#contributor) role
- The [Azure Service Bus Data Owner](../role-based-access-control/built-in-roles#azure-service-bus-data-owner) role

Role assignments must be scoped to the level of the Service Bus namespace or higher to permit a user to require a minimum version of TLS for the Service Bus namespace. For more information about role scope, see [Understand scope for Azure RBAC](../role-based-access-control/scope-overview).

Be careful to restrict assignment of these roles only to those who require the ability to create a Service Bus namespace or update its properties. Use the principle of least privilege to ensure that users have the fewest permissions that they need to accomplish their tasks. For more information about managing access with Azure RBAC, see [Best practices for Azure RBAC](../role-based-access-control/best-practices).

> [!NOTE]
The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [**Owner**](../role-based-access-control/built-in-roles#owner) role. The  **Owner**  role includes all actions, so a user with one of these administrative roles can also create and manage Service Bus namespaces. For more information, see [**Classic subscription administrator roles, Azure roles, and Azure AD administrator roles**](../role-based-access-control/rbac-and-directory-admin-roles#classic-subscription-administrator-roles).

### Network considerations

When a client sends a request to Service Bus namespace, the client establishes a connection with the public endpoint of the Service Bus namespace first, before processing any requests. The minimum TLS version setting is checked after the connection is established. If the request uses an earlier version of TLS than that specified by the setting, the connection will continue to succeed, but the request will eventually fail.

> [!NOTE]
Due to backwards compatibility, namespaces that do not have the **MinimumTlsVersion** setting specified or have specified this as 1.0, we do not do any TLS checks when connecting via the SBMP protocol.