---
title: Ensuring compliance and enforcing security with Azure Policy and Azure Blueprints
description: Ensuring compliance and enforcing security with Azure Policy and Azure Blueprints for Australian Government agencies as it relates to the ASD ISM and Essential 8
author: galey801
ms.service: azure-australia
ms.topic: conceptual
ms.date: 07/19/19
ms.author: grgale
---

# Ensuring compliance and enforcing security with Azure Policy and Azure Blueprints

Every organisation is presented with the challenge of enforcing governance within their IT environment, whether it be an on-premises, cloud native or a hybrid environment. The flexibility and agility provided by Microsoft Azure makes it vital that a robust technical governance framework is in place to ensure your environment conforms with design, regulatory, and security requirements such as the controls contained in the [Australian Cyber Security Centre's (ACSC) Information Security Manual Controls](https://acsc.gov.au/infosec/ism/index.htm) (ISM). As the majority of controls detailed within the ISM requires the application of technical governance for it to be effectively managed and enforced, it is important to have the appropriate tools that evaluate and enforce configuration in your IT environment.

Microsoft Azure provides two complimentary services to assist with these challenges, Azure Policy and Azure Blueprints.

## Azure Policy

Azure Policy is a service that assists with the application of the technical elements of an organisation's IT governance policies and practices. Azure Policy contains a constantly growing library of built-in policies. Each Policy enforces rules and effects on the targeted Azure Resources. Once a policy is assigned to resources, the overall compliance of the resources for that Policy can be evaluated and appropriate remediation action taken if required.

This library of built in Azure Polices enable an organisation to quickly enforce the types of controls found in the ACSC ISM. Examples of controls include:

* Monitoring virtual machines for missing system updates
* Auditing accounts with elevated permissions that are not enabled for multi-factor authentication
* Identifying unencrypted SQL Databases
* Monitoring the use of custom Azure role-based access control (RBAC)
* Restricting the Azure regions that resources can be created in

If a governance or regulatory controls are not met by a built in Azure Policy definition, a custom definition can be created and assigned to the appropriate Azure resources. All Azure Policy definitions are defined in JSON and follow a standard [definition structure](https://docs.microsoft.com/en-us/azure/governance/policy/concepts/definition-structure). Existing Azure Policy definitions can also be duplicated and used to form the basis of a custom Policy definition.

Assigning individual Azure Policies to resources, especially in complex environments or in environments with strict regulatory requirements can create a lot of overhead for administrators. To assist with these challenges, a set of Azure Policies can be grouped together to form an Azure Policy Initiative. Policy Initiatives are used to combine related Azure policies that, when applied together as a group, form the basis of a specific security or compliance objective. Microsoft is adding built-in Azure Policy Initiative definitions, including definitions designed to meet specific regulatory requirements:

![Regulatory Compliance Policy Initiatives](regulatory-initiatives.png)

All Azure Policies and Initiatives are assigned to an assignment scope. This scope is defined at either the Azure Subscription, Azure Management Group or Azure Resource Group levels. Once the required Azure Policies or Policy Initiatives have been assigned, an organisation will be able to enforce the configuration requirements on all newly created Azure resources.

Assigning a new Azure Policy or Initiative will not affect existing Azure resources. In addition, Azure Policy can enable an organisation to view the compliance of existing Azure resources. Any resources that have been identified as being non-compliant can be remediated at the organisation's discretion

### Azure Policy and Initiatives in Action

The currently available in built Azure Policy and Initiative definitions can be found under the Definition node in the Policy section of the Azure Portal:

![In-built Azure Policy Definitions](policy-definitions.png)

Using the library of built in definitions, an administrator can quickly search for Policies that meet an organisational requirement, review the policy definition and assign the Policy to the appropriate resources. For example, the ACSC ISM highlights the requirement for multi-factor authentication (MFA) to be enabled for all privileged users, and all users with access to important data repositories. An administrator can simply search for "MFA" amongst the Azure Policy definitions:

![Azure MFA Policies](mfa-policies.png)

When a suitable policy is identified, the administrator is able to assign the Policy to the desired scope. If the there isn’t a built-in Policy doesn't that meets the administrator’s requirements, an administrator can duplicate the existing Policy and make the desired changes:

![Duplicate existing Azure Policy](duplicate-policy.png)

Microsoft also provides a collection of Azure Policy samples on [GitHub](https://github.com/Azure/azure-policy) as a 'quickstart' for administrators to build custom Azure Policies. These Policy samples can be copied directly into the Azure Policy editor within the Azure Portal.

When creating Azure Policy Initiatives, an administrator is able to sort the list of available Policy definitions, both built-in and custom, adding the required definitions. For instance, an administrator could search through the list of available Azure Policy definitions for all of the policies related to Windows virtual machines then add them to an Initiative designed to enforce recommended virtual machine hardening practices:

![List of Azure Policies](initiative-definitions.png)

While assigning an Azure Policy or Policy Initiative to an assignment scope, it is possible for an administrator to exclude Azure resources from the effects of the Policies by excluding either Azure Management Groups or Azure Resource Groups.

### Real time enforcement and compliance assessment

Azure Policy compliance scans of all Azure resources in scope is undertaken when the following conditions are met:

* When an Azure Policy or Azure Policy Initiative is assigned
* When the scope of an existing Azure Policy or Initiative is changed
* On demand via the API up to a maximum of 10 scans per hour
* Once every 24 hours - the default behaviour

In addition, a scan for policy compliance for a single Azure resource is undertaken 15 minutes after a change has been made to the resource.

An overview of the Azure Policy compliance of resources can be reviewed within the Azure Portal via the Policy Compliance dashboard:

![Azure Policy compliance score](simple-compliance.png)

The overall resource compliance percentage figure is an aggregate of the compliance of all of your in scope deployed resources against all of your assigned Azure Policies. This allows administrators to identify the resources within an environment that are non-compliant and devise the plan to best remediate these resources.

The Policy Compliance dashboard also includes the change history for each resource. If a resource is identified as no longer being compliant with assigned policy, and automatic remediation is not enabled, then an administrator can view who changed, what was changed and when the changes made to that resource.

## Azure Blueprints

Azure Blueprints extend the capability of Azure Policy by combining them with:

* Azure RBAC
* Azure Resource Groups
* [Azure ARM Templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authoring-templates)

This allows for the creation of environment designs that deploy Azure resources from ARM templates, configure RBAC, and enforce and audit configuration by assigning Azure Policy. These form an editable and infinitely re-deployable environment template. Once the Blueprint has been created, it can then be assigned to an Azure Subscription. Once assigned, all of the Azure resources defined within the Blueprint will be created and the Azure Policies applied. The deployment of all the resources and configuration defined in an Azure Blueprint can be monitored from the within the Azure Blueprint console in the Azure Portal.

Once an Azure Blueprint has been edited, administrators re-publish the Blueprint within the Azure Portal. Each time a Blueprint is re-published, the version number of the Blueprint is incremented. This allows administrators to determine which specific version of a Blueprint has been deployed to an organisation's Azure Subscriptions. If desired, the currently assigned version of the Blueprint can be updated to the latest version.

The resources deployed using an Azure Blueprint can also be configured with [Azure Resource Locks](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-lock-resources) at the time of deployment. This can prevent any of the resources configured with Resource Locks from being accidentally modified or deleted.

Microsoft is developing Azure Blueprint templates that when deployed, define Azure Resources, Azure RBAC, and Azure Policy configuration in-line with specific regulatory requirements. The current library of available Azure Blueprint definitions can be viewed in the Azure Portal.

### Azure Blueprint Artifacts

When creating an Azure Blueprint, administrators are able to start with a blank Blueprint template, or use one of the existing sample Blueprints as a starting point. Administrators are able to add artifacts to the Blueprint that will be configured as part of deployment:

![Azure Blueprint Artifacts](blueprint-artifacts.png)

This could include the Azure Resource Group and Resources and associated Azure Policy and Policy Initiatives to enforce the configuration required for your environment to be compliant you’re your regulatory requirements, for example, the ISM controls for system hardening.

Each of these artifacts can also be configured with parameters. These values are provided when the Blueprint has been assigned to an Azure subscription and deployed. This allows for a single Blueprint to be created and used to deploy resources into different environments without having to edit the underlying Blueprint.

Microsoft is developing Azure PowerShell and CLI cmdlets to create and manage Azure Blueprints with the intention that a Blueprint could be maintained and deployed by an organisation via a CI/CD pipeline.

### Further Reading

* [Azure Policy Overview](https://docs.microsoft.com/en-us/azure/governance/policy/overview)
* [Azure Blueprints Overview](https://azure.microsoft.com/en-us/services/blueprints/)
* [Azure Policy Samples](https://docs.microsoft.com/en-us/azure/governance/policy/samples/index)
* [Azure Policy Samples Repository](https://github.com/Azure/azure-policy)
* [Azure Policy Definition Structure](https://docs.microsoft.com/en-us/azure/governance/policy/concepts/definition-structure)
* [Azure Policy Effects](https://docs.microsoft.com/en-us/azure/governance/policy/concepts/effects)

### Related Documentation

* [Azure Governance](https://docs.microsoft.com/en-us/azure/governance/)
* [Azure Management Groups](https://docs.microsoft.com/en-us/azure/governance/management-groups/)
* [Azure Role Based Access Control](https://docs.microsoft.com/en-us/azure/role-based-access-control/overview)
