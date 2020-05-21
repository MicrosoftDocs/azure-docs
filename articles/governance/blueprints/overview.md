---
title: Overview of Azure Blueprints
description: Understand how the Azure Blueprints service enables you to create, define, and deploy artifacts in your Azure environment.
ms.date: 05/06/2020
ms.topic: overview
---
# What is Azure Blueprints?

Just as a blueprint allows an engineer or an architect to sketch a project's design parameters,
Azure Blueprints enables cloud architects and central information technology groups to define a
repeatable set of Azure resources that implements and adheres to an organization's standards,
patterns, and requirements. Azure Blueprints makes it possible for development teams to rapidly
build and stand up new environments with trust they're building within organizational compliance
with a set of built-in components, such as networking, to speed up development and delivery.

Blueprints are a declarative way to orchestrate the deployment of various resource templates and
other artifacts such as:

- Role Assignments
- Policy Assignments
- Azure Resource Manager templates
- Resource Groups

The Azure Blueprints service is backed by the globally distributed
[Azure Cosmos DB](../../cosmos-db/introduction.md). Blueprint objects are replicated to multiple
Azure regions. This replication provides low latency, high availability, and consistent access to
your blueprint objects, regardless of which region Azure Blueprints deploys your resources to.

## How it's different from Resource Manager templates

The service is designed to help with _environment setup_. This setup often consists of a set of
resource groups, policies, role assignments, and Resource Manager template deployments. A blueprint
is a package to bring each of these _artifact_ types together and allow you to compose and version
that package, including through a CI/CD pipeline. Ultimately, each is assigned to a subscription in
a single operation that can be audited and tracked.

Nearly everything that you want to include for deployment in Azure Blueprints can be accomplished
with a Resource Manager template. However, a Resource Manager template is a document that doesn't
exist natively in Azure – each is stored either locally or in source control. The template gets used
for deployments of one or more Azure resources, but once those resources deploy there's no active
connection or relationship to the template.

With Azure Blueprints, the relationship between the blueprint definition (what _should be_ deployed)
and the blueprint assignment (what _was_ deployed) is preserved. This connection supports improved
tracking and auditing of deployments. Azure Blueprints can also upgrade several subscriptions at
once that are governed by the same blueprint.

There's no need to choose between a Resource Manager template and a blueprint. Each blueprint can
consist of zero or more Resource Manager template _artifacts_. This support means that previous
efforts to develop and maintain a library of Resource Manager templates are reusable in Azure
Blueprints.

## How it's different from Azure Policy

A blueprint is a package or container for composing focus-specific sets of standards, patterns, and
requirements related to the implementation of Azure cloud services, security, and design that can be
reused to maintain consistency and compliance.

A [policy](../policy/overview.md) is a default allow and explicit deny system focused on resource
properties during deployment and for already existing resources. It supports cloud governance by
validating that resources within a subscription adhere to requirements and standards.

Including a policy in a blueprint enables the creation of the right pattern or design during
assignment of the blueprint. The policy inclusion makes sure that only approved or expected changes
can be made to the environment to protect ongoing compliance to the intent of the blueprint.

A policy can be included as one of many _artifacts_ in a blueprint definition. Blueprints also
support using parameters with policies and initiatives.

## Blueprint definition

A blueprint is made up of _artifacts_. Azure Blueprints currently supports the following resources
as artifacts:

|Resource  | Hierarchy options| Description  |
|---------|---------|---------|
|Resource Groups | Subscription | Create a new resource group for use by other artifacts within the blueprint.  These placeholder resource groups enable you to organize resources exactly the way you want them structured and provides a scope limiter for included policy and role assignment artifacts and Azure Resource Manager templates. |
|Azure Resource Manager template | Subscription, Resource Group | Templates, including nested and linked templates, are used to compose complex environments. Example environments: a SharePoint farm, Azure Automation State Configuration, or a Log Analytics workspace. |
|Policy Assignment | Subscription, Resource Group | Allows assignment of a policy or initiative to the subscription the blueprint is assigned to. The policy or initiative must be within the scope of the blueprint definition location. If the policy or initiative has parameters, these parameters are assigned at creation of the blueprint or during blueprint assignment. |
|Role Assignment | Subscription, Resource Group | Add an existing user or group to a built-in role to make sure the right people always have the right access to your resources. Role assignments can be defined for the entire subscription or nested to a specific resource group included in the blueprint. |

### Blueprint definition locations

When creating a blueprint definition, you'll define where the blueprint is saved. Blueprints can be
saved to a [management group](../management-groups/overview.md) or subscription that you have
**Contributor** access to. If the location is a management group, the blueprint is available to
assign to any child subscription of that management group.

### Blueprint parameters

Blueprints can pass parameters to either a policy/initiative or an Azure Resource Manager template.
When adding either _artifact_ to a blueprint, the author decides to provide a defined value for each
blueprint assignment or to allow each blueprint assignment to provide a value at assignment time.
This flexibility provides the option to define a pre-determined value for all uses of the blueprint
or to enable that decision to be made at the time of assignment.

> [!NOTE]
> A blueprint can have its own parameters, but these can currently only be created if a blueprint
> is generated from REST API instead of through the Portal.

For more information, see [blueprint parameters](./concepts/parameters.md).

### Blueprint publishing

When a blueprint is first created, it's considered to be in **Draft** mode. When it's ready to be
assigned, it needs to be **Published**. Publishing requires defining a **Version** string (letters,
numbers, and hyphens with a max length of 20 characters) along with optional **Change notes**. The
**Version** differentiates it from future changes to the same blueprint and allows each version to
be assigned. This versioning also means different **Versions** of the same blueprint can be assigned
to the same subscription. When additional changes are made to the blueprint, the **Published**
**Version** still exists, as do the **Unpublished changes**. Once the changes are complete, the
updated blueprint is **Published** with a new and unique **Version** and can now also be assigned.

## Blueprint assignment

Each **Published** **Version** of a blueprint can be assigned (with a max name length of 90
characters) to an existing subscription. In the portal, the blueprint defaults the **Version** to
the one **Published** most recently. If there are artifact parameters (or blueprint parameters),
then the parameters are defined during the assignment process.

## Permissions in Azure Blueprints

To use blueprints, you must be granted permissions through [Role-based access
control](../../role-based-access-control/overview.md) (RBAC). To create blueprints, your account
needs the following permissions:

- `Microsoft.Blueprint/blueprints/write` - Create a blueprint definition
- `Microsoft.Blueprint/blueprints/artifacts/write` - Create artifacts on a blueprint definition
- `Microsoft.Blueprint/blueprints/versions/write` - Publish a blueprint

To delete blueprints, your account needs the following permissions:

- `Microsoft.Blueprint/blueprints/delete`
- `Microsoft.Blueprint/blueprints/artifacts/delete`
- `Microsoft.Blueprint/blueprints/versions/delete`

> [!NOTE]
> The blueprint definition permissions must be granted or inherited on the management group or
> subscription scope where it is saved.

To assign or unassign a blueprint, your account needs the following permissions:

- `Microsoft.Blueprint/blueprintAssignments/write` - Assign a blueprint
- `Microsoft.Blueprint/blueprintAssignments/delete` - Unassign a blueprint

> [!NOTE]
> As blueprint assignments are created on a subscription, the blueprint assign and unassign
> permissions must be granted on a subscription scope or be inherited onto a subscription scope.

The following built-in roles are available:

|RBAC Role | Description |
|-|-|
|[Owner](../../role-based-access-control/built-in-roles.md#owner) | In addition to other permissions, includes all Azure Blueprint related permissions. |
|[Contributor](../../role-based-access-control/built-in-roles.md#contributor) | In addition to other permissions, can create and delete blueprint definitions, but doesn't have blueprint assignment permissions. |
|[Blueprint Contributor](../../role-based-access-control/built-in-roles.md#blueprint-contributor) | Can manage blueprint definitions, but not assign them. |
|[Blueprint Operator](../../role-based-access-control/built-in-roles.md#blueprint-operator) | Can assign existing published blueprints, but can't create new blueprint definitions. Blueprint assignment only works if the assignment is done with a user-assigned managed identity. |

If these built-in roles don't fit your security needs, consider creating a [custom
role](../../role-based-access-control/custom-roles.md).

> [!NOTE]
> If using a system-assigned managed identity, the service principal for Azure Blueprints requires
> the **Owner** role on the assigned subscription in order to enable deployment. If using the
> portal, this role is automatically granted and revoked for the deployment. If using the REST API,
> this role must be manually granted, but is still automatically revoked after the deployment
> completes. If using a user-assigned managed identity, only the user creating the blueprint
> assignment needs the `Microsoft.Blueprint/blueprintAssignments/write` permission, which is
> included in both the **Owner** and **Blueprint Operator** built-in roles.

## Naming limits

The following limitations exist for certain fields:

|Object|Field|Allowed Characters|Max. Length|
|-|-|-|-|
|Blueprint|Name|letters, numbers, hyphens, and periods|48|
|Blueprint|Version|letters, numbers, hyphens, and periods|20|
|Blueprint assignment|Name|letters, numbers, hyphens, and periods|90|
|Blueprint artifact|Name|letters, numbers, hyphens, and periods|48|

## Video overview

The following overview of Azure Blueprints is from Azure Fridays. For video download, visit
[Azure Fridays - An overview of Azure Blueprints](https://channel9.msdn.com/Shows/Azure-Friday/An-overview-of-Azure-Blueprints)
on Channel 9.

> [!VIDEO https://www.youtube.com/embed/cQ9D-d6KkMY]

## Next steps

- [Create a blueprint - Portal](./create-blueprint-portal.md).
- [Create a blueprint - PowerShell](./create-blueprint-powershell.md).
- [Create a blueprint - REST API](./create-blueprint-rest-api.md).