---
title: How to create custom machine configuration policy definitions
description: Learn how to create a machine configuration policy.
ms.date: 09/12/2022
ms.topic: how-to
ms.service: machine-configuration
ms.author: timwarner
author: timwarner-msft
---
# How to create custom machine configuration policy definitions

[!INCLUDE [Machine config rename banner](../includes/banner.md)]

Before you begin, it's a good idea to read the overview page for
[machine configuration](./overview.md),
and the details about machine configuration policy effects
[How to configure remediation options for machine configuration](./machine-configuration-policy-effects.md).

> [!IMPORTANT]
> The machine configuration extension is required for Azure virtual machines. To
> deploy the extension at scale across all machines, assign the following policy
> initiative: `Deploy prerequisites to enable machine configuration policies on
> virtual machines`
>
> To use machine configuration packages that apply configurations, Azure VM guest
> configuration extension version **1.29.24** or later,
> or Arc agent **1.10.0** or later, is required.
>
> Custom machine configuration policy definitions using either **AuditIfNotExists** or **DeployIfNotExists** are now
> Generally Available.

Use the following steps to create your own policies that audit compliance or
manage the state of Azure or Arc-enabled machines.

## Install PowerShell 7 and required PowerShell modules

First, make sure you've followed all steps on the page
[How to setup a machine configuration authoring environment](./machine-configuration-create-setup.md)
to install the required version of PowerShell for your OS and the
`GuestConfiguration` module.

## Create and publish a machine configuration package artifact

If you haven't already, follow all steps on the page
[How to create custom machine configuration package artifacts](./machine-configuration-create.md)
to create and publish a custom machine configuration package
and
[How to test machine configuration package artifacts](./machine-configuration-create-test.md) to validate the machine configuration package locally in your
development environment.

## Policy requirements for machine configuration

The policy definition `metadata` section must include two properties for the
machine configuration service to automate provisioning and reporting of guest
configuration assignments. The `category` property must be set to "Guest
Configuration" and a section named `guestConfiguration` must contain information
about the machine configuration assignment. The `New-GuestConfigurationPolicy`
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
details about a machine configuration assignment. The
`New-GuestConfigurationPolicy` cmdlet creates this text automatically.

### Create an Azure Policy definition

Once a machine configuration custom policy package has been created and uploaded,
create the machine configuration policy definition. The `New-GuestConfigurationPolicy`
cmdlet takes a custom policy package and creates a policy definition.

The **PolicyId** parameter of `New-GuestConfigurationPolicy` requires a unique
string. A globally unique identifier (GUID) is required. For new definitions,
generate a new GUID using the cmdlet `New-GUID`. When making updates to the
definition, use the same unique string for **PolicyId** to ensure the correct
definition is updated.

Parameters of the `New-GuestConfigurationPolicy` cmdlet:

- **PolicyId**: A GUID.
- **ContentUri**: Public HTTP(s) URI of machine configuration content package.
- **DisplayName**: Policy display name.
- **Description**: Policy description.
- **Parameter**: Policy parameters provided in hashtable format.
- **PolicyVersion**: Policy version.
- **Path**: Destination path where policy definitions are created.
- **Platform**: Target platform (Windows/Linux) for machine configuration policy
  and content package.
- **Mode**: (ApplyAndMonitor, ApplyAndAutoCorrect, Audit) choose if the policy
  should audit or deploy the configuration. Default is "Audit".
- **Tag** adds one or more tag filters to the policy definition
- **Category** sets the category metadata field in the policy definition

For more information about the "Mode" parameter, see the page
[How to configure remediation options for machine configuration](./machine-configuration-policy-effects.md).

Create a policy definition that audits using a custom
configuration package, in a specified path:

```powershell
$PolicyConfig      = @{
  PolicyId      = '_My GUID_'
  ContentUri    = $contenturi
  DisplayName   = 'My audit policy'
  Description   = 'My audit policy'
  Path          = './policies/auditIfNotExists.json'
  Platform      = 'Windows'
  PolicyVersion = 1.0.0
}

New-GuestConfigurationPolicy @PolicyConfig
```

Create a policy definition that deploys a configuration using a custom
configuration package, in a specified path:

```powershell
$PolicyConfig2      = @{
  PolicyId      = '_My GUID_'
  ContentUri    = $contenturi
  DisplayName   = 'My audit policy'
  Description   = 'My audit policy'
  Path          = './policies/deployIfNotExists.json'
  Platform      = 'Windows'
  PolicyVersion = 1.0.0
  Mode          = 'ApplyAndAutoCorrect'
}

New-GuestConfigurationPolicy @PolicyConfig2
```

The cmdlet output returns an object containing the definition display name and
path of the policy files. Definition JSON files that create audit policy definitions
have the name **auditIfNotExists.json** and files that create policy definitions to
apply configurations have the name **deployIfNotExists.json**.

#### Filtering machine configuration policies using tags

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
      // Original machine configuration content
    }
  ]
}
```

#### Using parameters in custom machine configuration policy definitions

Machine configuration supports overriding properties of a Configuration at run time. This feature
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
# This DSC resource definition...
Service 'UserSelectedNameExample'
  {
    Name = 'ParameterValue'
    Ensure = 'Present'
    State = 'Running'
  }`

# ...can be converted to a hash table:
$PolicyParameterInfo     = @(
  @{
    # Policy parameter name (mandatory)
    Name                 = 'ServiceName'
    # Policy parameter display name (mandatory)
    DisplayName          = 'windows service name.'
    # Policy parameter description (optional)
    Description          = 'Name of the windows service to be audited.'
    # DSC configuration resource type (mandatory)
    ResourceType         = 'Service'
    # DSC configuration resource id (mandatory)
    ResourceId           = 'UserSelectedNameExample'
    # DSC configuration resource property name (mandatory)
    ResourcePropertyName = 'Name'
    # Policy parameter default value (optional)
    DefaultValue         = 'winrm'
    # Policy parameter allowed values (optional)
    AllowedValues        = @('BDESVC','TermService','wuauserv','winrm')
  })

# ...and then passed into the `New-GuestConfigurationPolicy` cmdlet
$PolicyParam = @{
  PolicyId      = 'My GUID'
  ContentUri    = $contenturi
  DisplayName   = 'Audit Windows Service.'
  Description   = "Audit if a Windows Service isn't enabled on Windows machine."
  Path          = '.\policies\auditIfNotExists.json'
  Parameter     = $PolicyParameterInfo
  PolicyVersion = 1.0.0
}

New-GuestConfigurationPolicy @PolicyParam
```

### Publish the Azure Policy definition

Finally, you can publish the policy definitions using the New-AzPolicyDefinition cmdlet. The below commands will publish your machine configuration policy to the policy center.

To run the New-AzPolicyDefinition command, you need access to create policy definitions in Azure. The specific authorization
requirements are documented in the [Azure Policy Overview](./overview.md) page. The recommended built-in
role is **Resource Policy Contributor**.

```powershell
New-AzPolicyDefinition -Name 'mypolicydefinition' -Policy '.\policies\auditIfNotExists.json'
```

Or, if this is a deploy if not exist policy (DINE) please use

```powershell
New-AzPolicyDefinition -Name 'mypolicydefinition' -Policy '.\policies\deployIfNotExists.json'
```

With the policy definition created in Azure, the last step is to assign the definition. See how to assign the
definition with [Portal](../policy/assign-policy-portal.md), [Azure CLI](../policy/assign-policy-azurecli.md), and
[Azure PowerShell](../policy/assign-policy-powershell.md).

## Policy lifecycle

If you would like to release an update to the policy definition, make the change for both the guest
configuration package and the Azure Policy definition details.

> [!NOTE]
> The `version` property of the machine configuration assignment only effects packages that
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

- [Assign your custom policy definition](../policy/assign-policy-portal.md) using
  Azure portal.
- Learn how to view
  [compliance details for machine configuration](../policy/how-to/determine-non-compliance.md#compliance-details) policy assignments.
