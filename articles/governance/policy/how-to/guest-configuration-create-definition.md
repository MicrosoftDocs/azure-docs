---
title: How to create custom guest configuration policy definitions
description: Learn how to create a guest configuration policy.
ms.date: 07/22/2021
ms.topic: how-to
---
# How to create custom guest configuration policy definitions

Before you begin, it's a good idea to read the overview page for
[guest configuration](../concepts/guest-configuration.md),
and the details about guest configuration policy effects
[How to configure remediation options for guest configuration](../concepts/guest-configuration-policy-effects.md).

> [!IMPORTANT]
> The guest configuration extension is required for Azure virtual machines. To
> deploy the extension at scale across all machines, assign the following policy
> initiative: `Deploy prerequisites to enable guest configuration policies on
> virtual machines`
> 
> To use guest configuration packages that apply configurations, Azure VM guest
> configuration extension version **1.29.24** or later,
> or Arc agent **1.10.0** or later, is required.
>
> Custom guest configuration policy definitions using **AuditIfNotExists** are
> Generally Available, but definitions using **DeployIfNotExists** with guest
> configuration are **in preview**.

Use the following steps to create your own policies that audit compliance or
manage the state of Azure or Arc-enabled machines.

## Install PowerShell 7 and required PowerShell modules

First, make sure you've followed all steps on the page
[How to setup a guest configuration authoring environment](./guest-configuration-create-setup.md)
to install the required version of PowerShell for your OS and the
`GuestConfiguration` module.

## Create and publish a guest configuration package artifact

If you haven't already, follow all steps on the page
[How to create custom guest configuration package artifacts](./guest-configuration-create.md)
to create and publish a custom guest configuration package
and
[How to test guest configuration package artifacts](./guest-configuration-create-test.md) to validate the guest configuration package locally in your
development environment.

## Policy requirements for guest configuration

The policy definition `metadata` section must include two properties for the
guest configuration service to automate provisioning and reporting of guest
configuration assignments. The `category` property must be set to "Guest
Configuration" and a section named `guestConfiguration` must contain information
about the guest configuration assignment. The `New-GuestConfigurationPolicy`
cmdlet creates this text automatically.

The following example demonstrates the `metadata` section that is automatically
created by `New-GuestConfigurationPolicy`.

```json
    "metadata": {
      "category": "Guest Configuration",
      "guestConfiguration": {
        "name": "test",
        "version": "1.0.0",
        "contentType": "Custom",
        "contentUri": "CUSTOM-URI-HERE",
        "contentHash": "CUSTOM-HASH-VALUE-HERE",
        "configurationParameter": {}
      }
    },
```

The `category` property must be set to "Guest Configuration". If the definition
effect is set to "DeployIfNotExists", the `then` section must contain deployment
details about a guest configuration assignment. The
`New-GuestConfigurationPolicy` cmdlet creates this text automatically.

### Create an Azure Policy definition

Once a guest configuration custom policy package has been created and uploaded,
create the guest configuration policy definition. The `New-GuestConfigurationPolicy`
cmdlet takes a custom policy package and creates a policy definition.

The **PolicyId** parameter of `New-GuestConfigurationPolicy` requires a unique
string. A globally unique identifier (GUID) is recommended. For new definitions,
generate a new GUID using the cmdlet `New-GUID`. When making updates to the
definition, use the same unique string for **PolicyId** to ensure the correct
definition is updated.

Parameters of the `New-GuestConfigurationPolicy` cmdlet:

- **PolicyId**: A GUID or other unique string that identifies the definition.
- **ContentUri**: Public HTTP(s) URI of guest configuration content package.
- **DisplayName**: Policy display name.
- **Description**: Policy description.
- **Parameter**: Policy parameters provided in hashtable format.
- **PolicyVersion**: Policy version.
- **Path**: Destination path where policy definitions are created.
- **Platform**: Target platform (Windows/Linux) for guest configuration policy
  and content package.
- **Mode**: (ApplyAndMonitor, ApplyAndAutoCorrect, Audit) choose if the policy
  should audit or deploy the configuration. Default is "Audit".
- **Tag** adds one or more tag filters to the policy definition
- **Category** sets the category metadata field in the policy definition

For more information about the "Mode" parameter, see the page
[How to configure remediation options for guest configuration](../concepts/guest-configuration-policy-effects.md).

Create a policy definition that audits using a custom
configuration package, in a specified path:

```powershell
New-GuestConfigurationPolicy `
  -PolicyId 'My GUID' `
  -ContentUri '<paste the ContentUri output from the Publish command>' `
  -DisplayName 'My audit policy.' `
  -Description 'Details about my policy.' `
  -Path './policies' `
  -Platform 'Windows' `
  -PolicyVersion 1.0.0 `
  -Verbose
```

Create a policy definition that deploys a configuration using a custom
configuration package, in a specified path:

```powershell
New-GuestConfigurationPolicy `
  -PolicyId 'My GUID' `
  -ContentUri '<paste the ContentUri output from the Publish command>' `
  -DisplayName 'My audit policy.' `
  -Description 'Details about my policy.' `
  -Path './policies' `
  -Platform 'Windows' `
  -PolicyVersion 1.0.0 `
  -Mode 'ApplyAndAutoCorrect' `
  -Verbose
```

The cmdlet output returns an object containing the definition display name and
path of the policy files. Definition JSON files that create audit policy definitions
have the name **auditIfNotExists.json** and files that create policy definitions to
apply configurations have the name **deployIfNotExists.json**.

#### Filtering guest configuration policies using tags

The policy definitions created by cmdlets in the Guest Configuration can optionally include a
filter for tags. The **Tag** parameter of `New-GuestConfigurationPolicy` supports an array of
hashtables containing individual tag entires. The tags are added to the `If` section of the policy
definition and can't be modified by a policy assignment.

An example snippet of a policy definition that filters for tags is given below.

```json
"if": {
  "allOf" : [
    {
      "allOf": [
        {
          "field": "tags.Owner",
          "equals": "BusinessUnit"
        },
        {
          "field": "tags.Role",
          "equals": "Web"
        }
      ]
    },
    {
      // Original guest configuration content
    }
  ]
}
```

#### Using parameters in custom guest configuration policy definitions

Guest configuration supports overriding properties of a Configuration at run time. This feature
means that the values in the MOF file in the package don't have to be considered static. The
override values are provided through Azure Policy and don't change how the Configurations are
authored or compiled.

The cmdlets `New-GuestConfigurationPolicy` and `Get-GuestConfigurationPacakgeComplianceStatus ` include a
parameter named **Parameter**. This parameter takes a hashtable definition including all details
about each parameter and creates the required sections of each file used for the Azure Policy
definition.

The following example creates a policy definition to audit a service, where the user selects from a
list at the time of policy assignment.

```powershell
# This DSC Resource text:
Service 'UserSelectedNameExample'
  {
    Name = 'ParameterValue'
    Ensure = 'Present'
    State = 'Running'
  }`

# Would require the following hashtable:
$PolicyParameterInfo = @(
  @{
    Name = 'ServiceName'                                           # Policy parameter name (mandatory)
    DisplayName = 'windows service name.'                          # Policy parameter display name (mandatory)
    Description = 'Name of the windows service to be audited.'     # Policy parameter description (optional)
    ResourceType = 'Service'                                       # DSC configuration resource type (mandatory)
    ResourceId = 'UserSelectedNameExample'                         # DSC configuration resource id (mandatory)
    ResourcePropertyName = 'Name'                                  # DSC configuration resource property name (mandatory)
    DefaultValue = 'winrm'                                         # Policy parameter default value (optional)
    AllowedValues = @('BDESVC','TermService','wuauserv','winrm')   # Policy parameter allowed values (optional)
  }
)

New-GuestConfigurationPolicy `
  -PolicyId 'My GUID' `
  -ContentUri '<paste the ContentUri output from the Publish command>' `
  -DisplayName 'Audit Windows Service.' `
  -Description 'Audit if a Windows Service isn't enabled on Windows machine.' `
  -Path '.\policies' `
  -Parameter $PolicyParameterInfo `
  -PolicyVersion 1.0.0
```

### Publish the Azure Policy definition

Finally, you can publish the policy definitions using the New-AzPolicyDefinition cmdlet. The below commands will publish your guest configuration policy to the policy center. 

To run the New-AzPolicyDefinition command, you need access to create policy definitions in Azure. The specific authorization
requirements are documented in the [Azure Policy Overview](../overview.md) page. The recommended built-in
role is **Resource Policy Contributor**.

```powershell
New-AzPolicyDefinition -Name 'mypolicydefinition' -Policy '.\policies'
```

With the policy definition created in Azure, the last step is to assign the definition. See how to assign the
definition with [Portal](../assign-policy-portal.md), [Azure CLI](../assign-policy-azurecli.md), and
[Azure PowerShell](../assign-policy-powershell.md).

## Policy lifecycle

If you would like to release an update to the policy definition, make the change for both the guest
configuration package and the Azure Policy definition details.

> [!NOTE]
> The `version` property of the guest configuration assignment only effects packages that
> are hosted by Microsoft. The best practice for versioning custom content is to include
> the version in the file name.

First, when running `New-GuestConfigurationPackage`, specify a name for the package that makes it
unique from previous versions. You can include a version number in the name such as
`PackageName_1.0.0`. The number in this example is only used to make the package unique, not to
specify that the package should be considered newer or older than other packages.

Second, update the parameters used with the `New-GuestConfigurationPolicy` cmdlet following each of
the following explanations.

- **Version**: When you run the `New-GuestConfigurationPolicy` cmdlet, you must specify a version
  number greater than what is currently published.
- **contentUri**: When you run the `New-GuestConfigurationPolicy` cmdlet, you must specify a URI
  to the location of the package. Including a package version in the file name will ensure the value
  of this property changes in each release.
- **contentHash**: This property is updated automatically by the `New-GuestConfigurationPolicy`
  cmdlet. It's a hash value of the package created by `New-GuestConfigurationPackage`. The property
  must be correct for the `.zip` file you publish. If only the **contentUri** property is updated,
  the Extension won't accept the content package.

The easiest way to release an updated package is to repeat the process described in this article and
provide an updated version number. That process guarantees all properties have been correctly
updated.

## Next steps

- [Assign your custom policy definition](../assign-policy-portal.md) using
  Azure portal.
- Learn how to view
  [compliance details for guest configuration](./determine-non-compliance.md#compliance-details-for-guest-configuration) policy assignments.
