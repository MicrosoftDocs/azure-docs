---
title: How to create custom machine configuration policy definitions
description: Learn how to create a machine configuration policy.
ms.date: 02/01/2024
ms.topic: how-to
---

# How to create custom machine configuration policy definitions

Use the following steps to create your own policies that audit compliance or manage the state of
Azure or Arc-enabled machines.

## Requirements

Before you begin, it's a good idea to read the overview page for [Machine Configuration][01], and
the details about [remediation options][02].

1. Install PowerShell 7 and the [Guest Configuration module](https://www.powershellgallery.com/packages/GuestConfiguration) from the PowerShell Gallery. Please refer to the section on [setting up a Machine Configuration authoring environment][03].
2. Ensure that the Machine Configuration preqrequisite policies are applied to any machines to which you would like to also apply your custom policies

> [!IMPORTANT]
> The machine configuration extension is required for Azure virtual machines. To deploy the
> extension at scale across all machines, assign the following policy initiative:
> `Deploy prerequisites to enable machine configuration policies on virtual machines`
>
> To use machine configuration packages that apply configurations, Azure VM guest configuration
> extension version 1.26.24 or later, or Arc agent 1.10.0 or later, is required.
>
> Custom machine configuration policy definitions using either `AuditIfNotExists` or
> `DeployIfNotExists` are in Generally Available (GA) support status.

3. Create and publish a Machine Configuration package artifact. If you haven't already, [create and publish a custom machine configuration package][04]. Then validate the package in your development environment by following [these steps][05].
> [!NOTE]
> The example code in this article references the `$contentUri` variable. If you're using the same
> PowerShell session as the earlier tutorials for creating and testing your package artifacts, that
> variable may already have the URI to your package.
>
> If you don't have the `$contentUri` variable set to the URI for your package in your PowerShell
> session, you need to set it. This example uses a storage account's [connection string][06] and
> the `New-AzStorageContext` cmdlet to create a storage context. Then it gets the storage blob for
> the published package and uses that object's properties to get the content URI.
>
> ```azurepowershell-interactive
> $connectionString = '<storage-account-connection-string>'
> $context = New-AzStorageContext -ConnectionString $connectionString
> $getParams = @{
>     Context   = $context
>     Container = '<container-name>'
>     Blob      = '<published-package-file-name>'
> }
> $blob = Get-AzStorageBlob @getParams
> $contentUri = $blob.ICloudBlob.Uri.AbsoluteUri
> ```

## Create an Azure Policy definition

Once a Machine Configuration custom policy package has been created and uploaded, you can create the
Machine Configuration policy definition with the `New-GuestConfigurationPolicy` cmdlet.

### Parameters

- **DisplayName**: The display name of the policy to create. The display name has a maximum length of 128 characters.
- **Description**: The description of the policy to create. The description has a maximum length of 512 characters.
- **PolicyId**: The unique GUID of this policy definition. If you are trying to update an existing policy definition, then this ID must match the 'name' field in the existing definition. For new definitions, generate a new GUID using the `New-GUID`
cmdlet.
- **PolicyVersion**: The version of the policy definition.
        If you are updating an existing policy definition, then this version should be greater than
        the value in the 'metadata.version' field in the existing definition.
        Note: This is NOT the version of the Guest Configuration package.
        You can validate the Guest Configuration package version via the ContentVersion parameter.
- **ContentUri**: The public HTTP or HTTPS URI of the Guest Configuration package (.zip) to run via the created policy.   
  Example: https://github.com/azure/auditservice/release/AuditService.zip  
    Note: If you are using an Azure storage account to store the custom machine configuration package artifact, you have two options for access:  
        1. Generate a blob shared access signature (SAS) token with read access and provide the full blob URI with the SAS token for the ContentUri parameter.  
        2. Create a user-assigned managed identity with read access to the storage account blob containing the package.
            Provide the resource ID of the managed identity, a local path to the zipped package, a URI to the package without a SAS token and the ExcludeArcMachines parameter.
            With this option, once the generated policy is applied, the managed identity will be used to download the package onto the target machine.
- **ManagedIdentityResourceId**: The `resourceId` of the User Assigned Managed Identity that has read access to the Azure Storage blob containing the `.zip` Machine Configuration package file.
  This parameter is required if you're using a User Assigned Managed Identity to provide access to an Azure Storage blob. This is the identity that is used to download the package from storage account container instead of using SaS url.
        The value for this parameter needs to be the resource id of the managed identity.
        This is an option to use when the package is stored in a storage account and the storage account is protected by a managed identity.
    Note: optional parameter. If this is specified, LocalContentPath and ExcludeArcMachines must also be specified.
- **LocalContentPath**: This is the path to the local package zip file. This is used to calculate the hash of the package.
        The value of this parameter is not used in the policy definition.
        Note: optional parameter. If this is specified, ManagedIdentityResourceId must also be specified.
- **ContentVersion**: If specified, the version of the Guest Configuration package (.zip) downloaded via the content URI must match this value.
    This is for validation only.
    Note: This is NOT the version of the policy definition.
    You can define the policy definition version via the PolicyVersion parameter.
- **Path**: The path to the folder under which to create the new policy definition file.
    The default value is the 'definitions' folder under your GuestConfiguration module path.  
    Note: Don't specify this parameter as the path to a local copy of the package.
- **Platform**: The target platform (Windows or Linux) for the policy.
        The default value is Windows.
- **Mode**: (case sensitive: `ApplyAndMonitor`, `ApplyAndAutoCorrect`, `Audit`) Defines the mode under which this policy should run the package on the machine. The default value is Audit. If the package has been created as Audit-only, you cannot create an Apply policy with that package. The package will need to be re-created in AuditAndSet mode.  
        Allowed modes:  
            Audit: Monitors the machine only. Will not make modifications to the machine.  
            ApplyAndMonitor: Modifies the machine once if it does not match the expected state.
              Then monitors the machine only until another remediation task is triggered via Azure Policy.
              Will make modifications to the machine.  
            ApplyAndAutoCorrect: Modifies the machine any time it does not match the expected state.
              You will need trigger a remediation task via Azure Policy to start modifications the first time.
              Will make modifications to the machine.  
        
- **Tag**: A hashtable of the tags that should be on machines to apply this policy to.
        If this is specified, the created policy will only be applied to machines with all the specified tags.
- **IncludeVMSS**: Indicates that VMSS machines should be included in the policy. True by default. You will need to set this to false if publishing policies in clouds that do not have the VMSS resource provider available.
- **ExcludeArcMachines**: Specifies that the Policy definition should exclude Arc machines. This parameter needs to be specified if the New-GuestConfigurationPolicy is using a User Assigned Identity.
        Enabling this parameter will signal that users are aware of exclusion of Arc enabled servers in the definition.
- **Parameter**: The parameters to expose on the policy.
        All parameters passed to the policy must be single string values.  
        Example:
```powershell
            $policyParameters = @(
                @{
                    Name = 'ServiceName'                                       # Required
                    DisplayName = 'Windows Service Name'                       # Required
                    Description = 'Name of the windows service to be audited.' # Required
                    ResourceType = 'Service'                                   # Required
                    ResourceId = 'windowsService'                              # Required
                    ResourcePropertyName = 'Name'                              # Required
                    DefaultValue = 'winrm'                                     # Optional
                    AllowedValues = @('wscsvc', 'WSearch', 'wcncsvc', 'winrm') # Optional
                },
                @{
                    Name = 'ServiceState'                                       # Required
                    DisplayName = 'Windows Service State'                       # Required
                    Description = 'State of the windows service to be audited.' # Required
                    ResourceType = 'Service'                                    # Required
                    ResourceId = 'windowsService'                               # Required
                    ResourcePropertyName = 'State'                              # Required
                    DefaultValue = 'Running'                                    # Optional
                    AllowedValues = @('Running', 'Disabled')                    # Optional
                }
            )
```

> [!IMPORTANT]
> Unlike Azure VMs, Arc-connected machines currently do not support User Assigned Managed
> Identities. As a result, the `-ExcludeArcMachines` flag is required to ensure the exclusion of
> those machines from the policy definition. For the Azure VM to download the assigned package and
> apply the policy, the Guest Configuration Agent must be version `1.29.82.0` or higher for Windows
> and version `1.26.76.0` or higher for Linux.

For more information about the **Mode** parameter, see the page
[How to configure remediation options for machine configuration][02].

### Examples

Create a policy definition that **audits** using a custom configuration package, in a specified path:

```powershell
$PolicyConfig      = @{
  PolicyId      = '_My GUID_'
  ContentUri    = $contentUri
  DisplayName   = 'My audit policy'
  Description   = 'My audit policy'
  Path          = './policies/auditIfNotExists.json'
  Platform      = 'Windows'
  PolicyVersion = 1.0.0
}

New-GuestConfigurationPolicy @PolicyConfig
```

Create a policy definition that **enforces** a custom configuration package, in a specified path:

```powershell
$PolicyConfig2      = @{
  PolicyId      = '_My GUID_'
  ContentUri    = $contentUri
  DisplayName   = 'My deployment policy'
  Description   = 'My deployment policy'
  Path          = './policies/deployIfNotExists.json'
  Platform      = 'Windows'
  PolicyVersion = 1.0.0
  Mode          = 'ApplyAndAutoCorrect'
}

New-GuestConfigurationPolicy @PolicyConfig2
```

Create a policy definition that **enforces** a custom configuration package using a User-Assigned
Managed Identity:

```powershell
$PolicyConfig3      = @{
  PolicyId                  = '_My GUID_'
  ContentUri                = $contentUri
  DisplayName               = 'My deployment policy'
  Description               = 'My deployment policy'
  Path                      = './policies/deployIfNotExists.json'
  Platform                  = 'Windows'
  PolicyVersion             = 1.0.0
  Mode                      = 'ApplyAndAutoCorrect'
  LocalContentPath          = "C:\Local\Path\To\Package"      # Required parameter for managed identity
  ManagedIdentityResourceId = "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}" # Required parameter for managed identity
}

New-GuestConfigurationPolicy @PolicyConfig3 -ExcludeArcMachines
```

> [!NOTE]
> You can retrieve the resourceId of a managed identity using the `Get-AzUserAssignedIdentity`
> PowerShell cmdlet.

The cmdlet output returns an object containing the definition display name and path of the policy
files. Definition JSON files that create audit policy definitions have the name
`auditIfNotExists.json` and files that create policy definitions to apply configurations have the
name `deployIfNotExists.json`.

#### Filtering machine configuration policies using tags

The policy definitions created by cmdlets in the **GuestConfiguration** module can optionally
include a filter for tags. The **Tag** parameter of `New-GuestConfigurationPolicy` supports an
array of hash tables containing individual tag entries. The tags are added to the **if** section of
the policy definition and can't be modified by a policy assignment.

An example snippet of a policy definition that filters for tags follows.

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

Machine configuration supports overriding properties of a DSC Configuration at run time. This
feature means that the values in the MOF file in the package don't have to be considered static.
The override values are provided through Azure Policy and don't change how the DSC Configurations
are authored or compiled.

Machine configuration supports the following value types for parameters:

- String
- Boolean
- Double
- Float

The cmdlets `New-GuestConfigurationPolicy` and `Get-GuestConfigurationPackageComplianceStatus`
include a parameter named **Parameter**. This parameter takes a hash table definition including all
details about each parameter and creates the required sections of each file used for the Azure
Policy definition.

The following example creates a policy definition to audit a service, where the user selects from a
list at the time of policy assignment.

```powershell
# This DSC resource definition...
Service 'UserSelectedNameExample' {
    Name   = 'ParameterValue'
    Ensure = 'Present'
    State  = 'Running'
}

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
  ContentUri    = $contentUri
  DisplayName   = 'Audit Windows Service.'
  Description   = "Audit if a Windows Service isn't enabled on Windows machine."
  Path          = '.\policies\auditIfNotExists.json'
  Parameter     = $PolicyParameterInfo
  PolicyVersion = 1.0.0
}

New-GuestConfigurationPolicy @PolicyParam
```

## Publish the Azure Policy definition

Finally, you can publish the policy definitions using the `New-AzPolicyDefinition` cmdlet. The
below commands publish your machine configuration policy to the policy center.

To run the `New-AzPolicyDefinition` command, you need access to create policy definitions in Azure.
The specific authorization requirements are documented in the [Azure Policy Overview][07] page. The
recommended built-in role is `Resource Policy Contributor`.

```azurepowershell-interactive
New-AzPolicyDefinition -Name 'mypolicydefinition' -Policy '.\policies\auditIfNotExists.json'
```

Or, if the policy is a deploy if not exist policy (DINE) use this command:

```azurepowershell-interactive
New-AzPolicyDefinition -Name 'mypolicydefinition' -Policy '.\policies\deployIfNotExists.json'
```

With the policy definition created in Azure, the last step is to assign the definition. See how to
assign the definition with [Portal][08], [Azure CLI][09], and [Azure PowerShell][10].

## Policy requirements for Machine Configuration definitions

The `New-GuestConfigurationPolicy` cmdlet handles this for you, but here is more information on the internals of the generated policy definitions.

The policy definition **metadata** section must include two properties for the machine
configuration service to automate provisioning and reporting of guest configuration assignments.
The **category** property must be set to `Guest Configuration` and a section named
**guestConfiguration** must contain information about the machine configuration assignment.

The following example demonstrates the **metadata** section that's automatically created by
`New-GuestConfigurationPolicy`.

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
}
```

If the definition effect is set to `DeployIfNotExists`, the **then** section must contain
deployment details about a machine configuration assignment. The `New-GuestConfigurationPolicy`
cmdlet creates this text automatically.

## Policy lifecycle

If you would like to release an update to the policy definition, make the change for both the guest
configuration package and the Azure Policy definition details.

> [!NOTE]
> The `version` property of the machine configuration assignment only effects packages that are
> hosted by Microsoft. The best practice for versioning custom content is to include the version in
> the file name.

First, when running `New-GuestConfigurationPackage`, specify a name for the package that makes it
unique from earlier versions. You can include a version number in the name such as
`PackageName_1.0.0`. The number in this example is only used to make the package unique, not to
specify that the package should be considered newer or older than other packages.

Second, update the parameters used with the `New-GuestConfigurationPolicy` cmdlet following each of
the following explanations.

- **Version**: When you run the `New-GuestConfigurationPolicy` cmdlet, you must specify a version
  number greater than what's currently published.
- **contentUri**: When you run the `New-GuestConfigurationPolicy` cmdlet, you must specify a URI to
  the location of the package. Including a package version in the file name ensures the value of
  this property changes in each release.
- **contentHash**: The `New-GuestConfigurationPolicy` cmdlet updates this property automatically.
  It's a hash value of the package created by `New-GuestConfigurationPackage`. The property must be
  correct for the `.zip` file you publish. If only the **contentUri** property is updated, the
  Extension rejects the content package.

The easiest way to release an updated package is to repeat the process described in this article
and specify an updated version number. That process guarantees all properties have been correctly
updated.

## Next steps

- [Assign your custom policy definition][08] using Azure portal.
- Learn how to view [compliance details for machine configuration][11] policy assignments.

<!-- Reference link definitions -->
[01]: ../overview.md
[02]: ../concepts/remediation-options.md
[03]: ./develop-custom-package/1-set-up-authoring-environment.md
[04]: ./develop-custom-package/2-create-package.md
[05]: ./develop-custom-package/3-test-package.md
[06]: /azure/storage/common/storage-configure-connection-string#configure-a-connection-string-for-an-azure-storage-account
[07]: ../../policy/overview.md
[08]: ../../policy/assign-policy-portal.md
[09]: ../../policy/assign-policy-azurecli.md
[10]: ../../policy/assign-policy-powershell.md
[11]: ../../policy/how-to/determine-non-compliance.md#compliance-details
