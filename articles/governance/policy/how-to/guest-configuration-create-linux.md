---
title: How to create Guest Configuration policies for Linux
description: Learn how to create an Azure Policy Guest Configuration policy for Linux.
ms.date: 08/17/2020
ms.topic: how-to 
ms.custom: devx-track-azurepowershell
---
# How to create Guest Configuration policies for Linux

Before creating custom policies, read the overview information at
[Azure Policy Guest Configuration](../concepts/guest-configuration.md).
 
To learn about creating Guest Configuration policies for Windows, see the page
[How to create Guest Configuration policies for Windows](./guest-configuration-create.md)

When auditing Linux, Guest Configuration uses [Chef InSpec](https://www.inspec.io/). The InSpec
profile defines the condition that the machine should be in. If the evaluation of the configuration
fails, the policy effect **auditIfNotExists** is triggered and the machine is considered
**non-compliant**.

[Azure Policy Guest Configuration](../concepts/guest-configuration.md) can only be used to audit
settings inside machines. Remediation of settings inside machines isn't yet available.

Use the following actions to create your own configuration for validating the state of an Azure or
non-Azure machine.

> [!IMPORTANT]
> Custom policy definitions with Guest Configuration in the Azure Government and
> Azure China environments is a Preview feature.
>
> The Guest Configuration extension is required to perform audits in Azure virtual machines. To
> deploy the extension at scale across all Linux machines, assign the following policy definition:
> `Deploy prerequisites to enable Guest Configuration Policy on Linux VMs`
> 
> Don't use secrets or confidential information in custom content packages.

## Install the PowerShell module

The Guest Configuration module automates the process of creating custom content including:

- Creating a Guest Configuration content artifact (.zip)
- Automated testing of the artifact
- Creating a policy definition
- Publishing the policy

The module can be installed on a machine running Windows, macOS, or Linux with PowerShell 6.2 or
later running locally, or with [Azure Cloud Shell](https://shell.azure.com), or with the
[Azure PowerShell Core Docker image](https://hub.docker.com/r/azuresdk/azure-powershell-core).

> [!NOTE]
> Compilation of configurations isn't supported on Linux.

### Base requirements

Operating Systems where the module can be installed:

- Linux
- macOS
- Windows

> [!NOTE]
> The cmdlet `Test-GuestConfigurationPackage` requires OpenSSL version 1.0, due to a dependency on
> OMI. This causes an error on any environment with OpenSSL 1.1 or later.
>
> Running the cmdlet `Test-GuestConfigurationPackage` is only supported on Windows 
> for Guest Configuration module version 2.1.0.

The Guest Configuration resource module requires the following software:

- PowerShell 6.2 or later. If it isn't yet installed, follow
  [these instructions](/powershell/scripting/install/installing-powershell).
- Azure PowerShell 1.5.0 or higher. If it isn't yet installed, follow
  [these instructions](/powershell/azure/install-az-ps).
  - Only the Az modules 'Az.Accounts' and 'Az.Resources' are required.

### Install the module

To install the **GuestConfiguration** module in PowerShell:

1. From a PowerShell prompt, run the following command:

   ```azurepowershell-interactive
   # Install the Guest Configuration DSC resource module from PowerShell Gallery
   Install-Module -Name GuestConfiguration
   ```

1. Validate that the module has been imported:

   ```azurepowershell-interactive
   # Get a list of commands for the imported GuestConfiguration module
   Get-Command -Module 'GuestConfiguration'
   ```

## Guest Configuration artifacts and policy for Linux

Even in Linux environments, Guest Configuration uses Desired State Configuration as a language
abstraction. The implementation is based in native code (C++) so it doesn't require loading
PowerShell. However, it does require a configuration MOF describing details about the environment.
DSC is acting as a wrapper for InSpec to standardize how it's executed, how parameters are provided,
and how output is returned to the service. Little knowledge of DSC is required when working with
custom InSpec content.

#### Configuration requirements

The name of the custom configuration must be consistent everywhere. The name of the .zip file for
the content package, the configuration name in the MOF file, and the guest assignment name in the
Azure Resource Manager template (ARM template), must be the same.

PowerShell cmdlets assist in creating the package.
No root level folder or version folder is required.
The package format must be a .zip file. and cannot exceed a total size of 100MB when uncompressed.

### Custom Guest Configuration configuration on Linux

Guest Configuration on Linux uses the `ChefInSpecResource` resource to provide the engine with the
name of the [InSpec profile](https://www.inspec.io/docs/reference/profiles/). **Name** is the only
required resource property. Create a YaML file and a Ruby script file, as detailed below.

First, create the YaML file used by InSpec. The file provides basic information about the
environment. An example is given below:

```YaML
name: linux-path
title: Linux path
maintainer: Test
summary: Test profile
license: MIT
version: 1.0.0
supports:
    - os-family: unix
```

Save this file with name `inspec.yml` to a folder named `linux-path` in your project directory.

Next, create the Ruby file with the InSpec language abstraction used to audit the machine.

```Ruby
describe file('/tmp') do
    it { should exist }
end
```

Save this file with name `linux-path.rb` in a new folder named `controls` inside the `linux-path`
directory.

Finally, create a configuration, import the **PSDesiredStateConfiguration** resource module, and
compile the configuration.

```powershell
# import PSDesiredStateConfiguration module
import-module PSDesiredStateConfiguration

# Define the configuration and import GuestConfiguration
Configuration AuditFilePathExists
{
    Import-DscResource -ModuleName 'GuestConfiguration'

    Node AuditFilePathExists
    {
        ChefInSpecResource 'Audit Linux path exists'
        {
            Name = 'linux-path'
        }
    }
}

# Compile the configuration to create the MOF files
AuditFilePathExists -out ./Config
```

Save this file with name `config.ps1` in the project folder. Run it in PowerShell by executing
`./config.ps1` in the terminal. A new mof file will be created.

The `Node AuditFilePathExists` command isn't technically required but it produces a file named
`AuditFilePathExists.mof` rather than the default, `localhost.mof`. Having the .mof file name follow
the configuration makes it easy to organize many files when operating at scale.

You should now have a project structure as below:

```file
/ AuditFilePathExists
    / Config
        AuditFilePathExists.mof
    / linux-path
        inspec.yml
        / controls
            linux-path.rb 
```

The supporting files must be packaged together. The completed package is used by Guest Configuration
to create the Azure Policy definitions.

The `New-GuestConfigurationPackage` cmdlet creates the package. Parameters of the
`New-GuestConfigurationPackage` cmdlet when creating Linux content:

- **Name**: Guest Configuration package name.
- **Configuration**: Compiled configuration document full path.
- **Path**: Output folder path. This parameter is optional. If not specified, the package is created
  in current directory.
- **ChefInspecProfilePath**: Full path to InSpec profile. This parameter is supported only when creating
  content to audit Linux.

Run the following command to create a package using the configuration given in the previous step:

```azurepowershell-interactive
New-GuestConfigurationPackage `
  -Name 'AuditFilePathExists' `
  -Configuration './Config/AuditFilePathExists.mof' `
  -ChefInSpecProfilePath './'
```

After creating the Configuration package but before publishing it to Azure, you can test the package
from your workstation or continuous integration and continuous deployment (CI/CD) environment. The
GuestConfiguration cmdlet `Test-GuestConfigurationPackage` includes the same agent in your
development environment as is used inside Azure machines. Using this solution, you can perform
integration testing locally before releasing to billed cloud environments.

Since the agent is actually evaluating the local environment, in most cases you need to run the
Test- cmdlet on the same OS platform as you plan to audit.

Parameters of the `Test-GuestConfigurationPackage` cmdlet:

- **Name**: Guest Configuration policy name.
- **Parameter**: Policy parameters provided in hashtable format.
- **Path**: Full path of the Guest Configuration package.

Run the following command to test the package created by the previous step:

```azurepowershell-interactive
Test-GuestConfigurationPackage `
  -Path ./AuditFilePathExists/AuditFilePathExists.zip
```

The cmdlet also supports input from the PowerShell pipeline. Pipe the output of
`New-GuestConfigurationPackage` cmdlet to the `Test-GuestConfigurationPackage` cmdlet.

```azurepowershell-interactive
New-GuestConfigurationPackage -Name AuditFilePathExists -Configuration ./Config/AuditFilePathExists.mof -ChefInspecProfilePath './' | Test-GuestConfigurationPackage
```

The next step is to publish the file to Azure Blob Storage. The command `Publish-GuestConfigurationPackage` requires the `Az.Storage`
module.

Parameters of the `Publish-GuestConfigurationPackage` cmdlet:

- **Path**: Location of the package to be published
- **ResourceGroupName**: Name of the resource group where the storage account is located
- **StorageAccountName**: Name of the storage account where the package should be published
- **StorageContainerName**: (default: *guestconfiguration*) Name of the storage container in the storage account
- **Force**: Overwrite existing package in the storage account with the same name

The example below publishes the package to a storage container name 'guestconfiguration'.

```azurepowershell-interactive
Publish-GuestConfigurationPackage -Path ./AuditFilePathExists/AuditFilePathExists.zip -ResourceGroupName myResourceGroupName -StorageAccountName myStorageAccountName
```

Once a Guest Configuration custom policy package has been created and uploaded, create the Guest
Configuration policy definition. The `New-GuestConfigurationPolicy` cmdlet takes a custom policy
package and creates a policy definition.

Parameters of the `New-GuestConfigurationPolicy` cmdlet:

- **ContentUri**: Public http(s) uri of Guest Configuration content package.
- **DisplayName**: Policy display name.
- **Description**: Policy description.
- **Parameter**: Policy parameters provided in hashtable format.
- **Version**: Policy version.
- **Path**: Destination path where policy definitions are created.
- **Platform**: Target platform (Windows/Linux) for Guest Configuration policy and content package.
- **Tag** adds one or more tag filters to the policy definition
- **Category** sets the category metadata field in the policy definition

The following example creates the policy definitions in a specified path from a custom policy
package:

```azurepowershell-interactive
New-GuestConfigurationPolicy `
    -ContentUri 'https://storageaccountname.blob.core.windows.net/packages/AuditFilePathExists.zip?st=2019-07-01T00%3A00%3A00Z&se=2024-07-01T00%3A00%3A00Z&sp=rl&sv=2018-03-28&sr=b&sig=JdUf4nOCo8fvuflOoX%2FnGo4sXqVfP5BYXHzTl3%2BovJo%3D' `
    -DisplayName 'Audit Linux file path.' `
    -Description 'Audit that a file path exists on a Linux machine.' `
    -Path './policies' `
    -Platform 'Linux' `
    -Version 1.0.0 `
    -Verbose
```

The following files are created by `New-GuestConfigurationPolicy`:

- **auditIfNotExists.json**

The cmdlet output returns an object containing the initiative display name and path of the policy
files.

Finally, publish the policy definitions using the `Publish-GuestConfigurationPolicy` cmdlet. The
cmdlet only has the **Path** parameter that points to the location of the JSON files created by
`New-GuestConfigurationPolicy`.

To run the Publish command, you need access to create Policies in Azure. The specific authorization
requirements are documented in the [Azure Policy Overview](../overview.md) page. The best built-in
role is **Resource Policy Contributor**.

```azurepowershell-interactive
Publish-GuestConfigurationPolicy `
  -Path './policies'
```

 The `Publish-GuestConfigurationPolicy` cmdlet accepts the path from the PowerShell pipeline. This
 feature means you can create the policy files and publish them in a single set of piped commands.

 ```azurepowershell-interactive
 New-GuestConfigurationPolicy `
  -ContentUri 'https://storageaccountname.blob.core.windows.net/packages/AuditFilePathExists.zip?st=2019-07-01T00%3A00%3A00Z&se=2024-07-01T00%3A00%3A00Z&sp=rl&sv=2018-03-28&sr=b&sig=JdUf4nOCo8fvuflOoX%2FnGo4sXqVfP5BYXHzTl3%2BovJo%3D' `
  -DisplayName 'Audit Linux file path.' `
  -Description 'Audit that a file path exists on a Linux machine.' `
  -Path './policies' `
 | Publish-GuestConfigurationPolicy
 ```

With the policy created in Azure, the last step is to assign the definition. See how to assign the
definition with [Portal](../assign-policy-portal.md), [Azure CLI](../assign-policy-azurecli.md), and
[Azure PowerShell](../assign-policy-powershell.md).

### Using parameters in custom Guest Configuration policies

Guest Configuration supports overriding properties of a Configuration at run time. This feature
means that the values in the MOF file in the package don't have to be considered static. The
override values are provided through Azure Policy and don't impact how the Configurations are
authored or compiled.

With InSpec, parameters are typically handled as input either at runtime or as code using
attributes. Guest Configuration obfuscates this process so input can be provided when policy is
assigned. An attributes file is automatically created within the machine. You don't need to create
and add a file in your project. There are two steps to adding parameters to your Linux audit
project.

Define the input in the Ruby file where you script what to audit on the machine. An example is given
below.

```Ruby
attr_path = attribute('path', description: 'The file path to validate.')

describe file(attr_path) do
    it { should exist }
end
```

Add the property **AttributesYmlContent** in your configuration with any string as the value.
The Guest Configuration agent automatically creates the YAML file
used by InSpec to store attributes. See the example below.

```powershell
Configuration AuditFilePathExists
{
    Import-DscResource -ModuleName 'GuestConfiguration'

    Node AuditFilePathExists
    {
        ChefInSpecResource 'Audit Linux path exists'
        {
            Name = 'linux-path'
            AttributesYmlContent = "fromParameter"
        }
    }
}
```

Recompile the MOF file using the examples given in this document.

The cmdlets `New-GuestConfigurationPolicy` and `Test-GuestConfigurationPolicyPackage` include a
parameter named **Parameter**. This parameter takes a hashtable including all details about each
parameter and automatically creates all the required sections of the files used to create each Azure
Policy definition.

The following example creates a policy definition to audit a file path, where the user provides the
path at the time of policy assignment.

```azurepowershell-interactive
$PolicyParameterInfo = @(
    @{
        Name = 'FilePath'                             # Policy parameter name (mandatory)
        DisplayName = 'File path.'                    # Policy parameter display name (mandatory)
        Description = 'File path to be audited.'      # Policy parameter description (optional)
        ResourceType = 'ChefInSpecResource'           # Configuration resource type (mandatory)
        ResourceId = 'Audit Linux path exists'        # Configuration resource property name (mandatory)
        ResourcePropertyName = 'AttributesYmlContent' # Configuration resource property name (mandatory)
        DefaultValue = '/tmp'                         # Policy parameter default value (optional)
    }
)

# The hashtable also supports a property named 'AllowedValues' with an array of strings to limit input to a list

$uri = 'https://storageaccountname.blob.core.windows.net/packages/AuditFilePathExists.zip?st=2019-07-01T00%3A00%3A00Z&se=2024-07-01T00%3A00%3A00Z&sp=rl&sv=2018-03-28&sr=b&sig=JdUf4nOCo8fvuflOoX%2FnGo4sXqVfP5BYXHzTl3%2BovJo%3D'

New-GuestConfigurationPolicy -ContentUri $uri `
    -DisplayName 'Audit Linux file path.' `
    -Description 'Audit that a file path exists on a Linux machine.' `
    -Path './policies' `
    -Parameter $PolicyParameterInfo `
    -Platform 'Linux' `
    -Version 1.0.0
```


## Policy lifecycle

If you would like to release an update to the policy, make the change for both the Guest Configuration
package and the Azure Policy definition details.

> [!NOTE]
> The `version` property of the Guest Configuration assignment only effects packages that
> are hosted by Microsoft. The best practice for versioning custom content is to include
> the version in the file name.

First, when running `New-GuestConfigurationPackage`, specify a name for the package that makes it
unique from previous versions. You can include a version number in the name such as `PackageName_1.0.0`.
The number in this example is only used to make the package unique, not to specify that the package
should be considered newer or older than other packages.

Second, update the parameters used with the `New-GuestConfigurationPolicy` cmdlet following each of
the explanations below.

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

### Filtering Guest Configuration policies using Tags

The policies created by cmdlets in the Guest Configuration module can optionally include a filter
for tags. The **-Tag** parameter of `New-GuestConfigurationPolicy` supports an array of hashtables
containing individual tag entires. The tags will be added to the `If` section of the policy
definition and cannot be modified by a policy assignment.

An example snippet of a policy definition that will filter for tags is given below.

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
      // Original Guest Configuration content will follow
    }
  ]
}
```

## Optional: Signing Guest Configuration packages

Guest Configuration custom policies use SHA256 hash to validate the policy package hasn't changed.
Optionally, customers may also use a certificate to sign packages and force the Guest Configuration
extension to only allow signed content.

To enable this scenario, there are two steps you need to complete. Run the cmdlet to sign the
content package, and append a tag to the machines that should require code to be signed.

To use the Signature Validation feature, run the `Protect-GuestConfigurationPackage` cmdlet to sign
the package before it's published. This cmdlet requires a 'Code Signing' certificate.

Parameters of the `Protect-GuestConfigurationPackage` cmdlet:

- **Path**: Full path of the Guest Configuration package.
- **PublicGpgKeyPath**: Public GPG key path. This parameter is only supported when signing content
  for Linux.

A good reference for creating GPG keys to use with Linux machines is provided by an article on
GitHub, [Generating a new GPG key](https://help.github.com/en/articles/generating-a-new-gpg-key).

GuestConfiguration agent expects the certificate public key to be present in the path
`/usr/local/share/ca-certificates/extra` on Linux machines. For the node to verify signed content,
install the certificate public key on the machine before applying the custom policy. This process
can be done using any technique inside the VM, or by using Azure Policy. An example template is
[provided here](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-push-certificate-windows).
The Key Vault access policy must allow the Compute resource provider to access certificates during
deployments. For detailed steps, see
[Set up Key Vault for virtual machines in Azure Resource Manager](../../../virtual-machines/windows/key-vault-setup.md#use-templates-to-set-up-key-vault).

After your content is published, append a tag with name `GuestConfigPolicyCertificateValidation` and
value `enabled` to all virtual machines where code signing should be required. See the
[Tag samples](../samples/built-in-policies.md#tags) for how tags can be delivered at scale using
Azure Policy. Once this tag is in place, the policy definition generated using the
`New-GuestConfigurationPolicy` cmdlet enables the requirement through the Guest Configuration
extension.

## Next steps

- Learn about auditing VMs with [Guest Configuration](../concepts/guest-configuration.md).
- Understand how to [programmatically create policies](./programmatically-create.md).
- Learn how to [get compliance data](./get-compliance-data.md).
