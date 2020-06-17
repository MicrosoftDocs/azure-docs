---
title: How to create Guest Configuration policies for Linux
description: Learn how to create an Azure Policy Guest Configuration policy for Linux.
ms.date: 03/20/2020
ms.topic: how-to
---
# How to create Guest Configuration policies for Linux

Before creating custom policies, read the overview information
at [Azure Policy Guest Configuration](../concepts/guest-configuration.md).
 
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
> Custom policies with Guest Configuration is a Preview feature.
>
> The Guest Configuration extension is required to perform audits in Azure virtual machines.
> To deploy the extension at scale across all Linux machines, assign the following policy definition:
>   - [Deploy prerequisites to enable Guest Configuration Policy on Linux VMs.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffb27e9e0-526e-4ae1-89f2-a2a0bf0f8a50)

## Install the PowerShell module

The Guest Configuration module automates the process of creating custom content
including:

- Creating a Guest Configuration content artifact (.zip)
- Automated testing of the artifact
- Creating a policy definition
- Publishing the policy

The module can be installed on a machine running Windows, macOS, or Linux with
PowerShell 6.2 or later running locally, or with [Azure Cloud Shell](https://shell.azure.com), or
with the
[Azure PowerShell Core Docker image](https://hub.docker.com/r/azuresdk/azure-powershell-core).

> [!NOTE]
> Compilation of configurations isn't supported on Linux.

### Base requirements

Operating Systems where the module can be installed:

- Linux
- macOS
- Windows

The Guest Configuration resource module requires the following software:

- PowerShell 6.2 or later. If it isn't yet installed, follow
  [these instructions](/powershell/scripting/install/installing-powershell).
- Azure PowerShell 1.5.0 or higher. If it isn't yet installed, follow
  [these instructions](/powershell/azure/install-az-ps).
  - Only the AZ modules 'Az.Accounts' and 'Az.Resources' are required.

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
PowerShell. However, it does require a configuration MOF describing details
about the environment. DSC is acting as a wrapper for InSpec to standardize how it's executed, how
parameters are provided, and how output is returned to the
service. Little knowledge of DSC is required when working with custom InSpec content.

#### Configuration requirements

The name of the custom configuration must be consistent everywhere. The name of
the .zip file for the content package, the configuration name in the MOF file, and the guest
assignment name in the Resource Manager template, must be the same.

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

Save this file with name `linux-path.rb` in a new folder named `controls` inside the `linux-path` directory.

Finally, create a configuration, import the **PSDesiredStateConfiguration** resource module, and compile the configuration.

```powershell
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
import-module PSDesiredStateConfiguration
AuditFilePathExists -out ./Config
```

Save this file with name `config.ps1` in the project folder. Run it in PowerShell by executing `./config.ps1`
in the terminal. A new mof file will be created.

The `Node AuditFilePathExists` command isn't technically required but it produces a file named
`AuditFilePathExists.mof` rather than the default, `localhost.mof`. Having the .mof file name follow
the configuration makes it easy to organize many files when operating at scale.



You should now have a project structure as below:

```file
/ AuditFilePathExists
    / Config
        AuditFilePathExists.mof
    / linux-path
        linux-path.yml
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
- **ChefProfilePath**: Full path to InSpec profile. This parameter is supported only when creating
  content to audit Linux.

Run the following command to create a package using the configuration given in the previous step:

```azurepowershell-interactive
New-GuestConfigurationPackage `
  -Name 'AuditFilePathExists' `
  -Configuration './Config/AuditFilePathExists.mof' `
  -ChefInSpecProfilePath './'
```

After creating the Configuration package but before publishing it to Azure, you can test the package from your workstation or CI/CD environment. The GuestConfiguration cmdlet `Test-GuestConfigurationPackage` includes the same agent in your
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
New-GuestConfigurationPackage -Name AuditFilePathExists -Configuration ./Config/AuditFilePathExists.mof -ChefProfilePath './' | Test-GuestConfigurationPackage
```

The next step is to publish the file to blob storage. The script below contains a function you can
use to automate this task. The commands used in the `publish` function require the `Az.Storage`
module.

```azurepowershell-interactive
function publish {
    param(
    [Parameter(Mandatory=$true)]
    $resourceGroup,
    [Parameter(Mandatory=$true)]
    $storageAccountName,
    [Parameter(Mandatory=$true)]
    $storageContainerName,
    [Parameter(Mandatory=$true)]
    $filePath,
    [Parameter(Mandatory=$true)]
    $blobName
    )

    # Get Storage Context
    $Context = Get-AzStorageAccount -ResourceGroupName $resourceGroup `
        -Name $storageAccountName | `
        ForEach-Object { $_.Context }

    # Upload file
    $Blob = Set-AzStorageBlobContent -Context $Context `
        -Container $storageContainerName `
        -File $filePath `
        -Blob $blobName `
        -Force

    # Get url with SAS token
    $StartTime = (Get-Date)
    $ExpiryTime = $StartTime.AddYears('3')  # THREE YEAR EXPIRATION
    $SAS = New-AzStorageBlobSASToken -Context $Context `
        -Container $storageContainerName `
        -Blob $blobName `
        -StartTime $StartTime `
        -ExpiryTime $ExpiryTime `
        -Permission rl `
        -FullUri

    # Output
    return $SAS
}

# replace the $storageAccountName value below, it must be globally unique
$resourceGroup        = 'policyfiles'
$storageAccountName   = 'youraccountname'
$storageContainerName = 'artifacts'

$uri = publish `
  -resourceGroup $resourceGroup `
  -storageAccountName $storageAccountName `
  -storageContainerName $storageContainerName `
  -filePath ./AuditFilePathExists.zip `
  -blobName 'AuditFilePathExists'
```
Once a Guest Configuration custom policy package has been created and uploaded, create the Guest Configuration policy definition. The
`New-GuestConfigurationPolicy` cmdlet takes a custom policy package and creates a policy definition.

Parameters of the `New-GuestConfigurationPolicy` cmdlet:

- **ContentUri**: Public http(s) uri of Guest Configuration content package.
- **DisplayName**: Policy display name.
- **Description**: Policy description.
- **Parameter**: Policy parameters provided in hashtable format.
- **Version**: Policy version.
- **Path**: Destination path where policy definitions are created.
- **Platform**: Target platform (Windows/Linux) for Guest Configuration policy and content package.

The following example creates the policy definitions in a specified path from a custom policy package:

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
- **deployIfNotExists.json**
- **Initiative.json**

The cmdlet output returns an object containing the initiative display name and path of the policy
files.

> [!Note]
> The latest Guest Configuration module includes a new parameters:
> - **Tag** adds one or more tag filters to the policy definition
>   - See the section [Filtering Guest Configuration policies using Tags](#filtering-guest-configuration-policies-using-tags).
> - **Category** sets the category metadata field in the policy definition
>   - If the parameter is not included, the category will default to Guest Configuration.
> These features are currently in preview and require Guest Configuration module
> version 1.20.1, which can be installed using `Install-Module GuestConfiguration -AllowPrerelease`.

Finally, publish the policy definitions using the `Publish-GuestConfigurationPolicy` cmdlet.
The cmdlet only has the **Path** parameter that points to the location of the JSON files
created by `New-GuestConfigurationPolicy`.

To run the Publish command, you need access to create Policies in Azure. The specific authorization requirements are documented in the [Azure Policy Overview](../overview.md) page. The best built-in role is **Resource Policy Contributor**.

```azurepowershell-interactive
Publish-GuestConfigurationPolicy `
  -Path '.\policyDefinitions'
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

With the policy created in Azure, the last step is to assign the
initiative. See how to assign the initiative with [Portal](../assign-policy-portal.md), [Azure CLI](../assign-policy-azurecli.md),
and [Azure PowerShell](../assign-policy-powershell.md).

> [!IMPORTANT]
> Guest Configuration policies must **always** be assigned using the initiative that combines the
> _AuditIfNotExists_ and _DeployIfNotExists_ policies. If only the _AuditIfNotExists_ policy is
> assigned, the prerequisites aren't deployed and the policy always shows that '0' servers are
> compliant.

Assigning an policy definition with _DeployIfNotExists_ effect requires an additional level of
access. To grant the least privilege, you can create a custom role definition that extends
**Resource Policy Contributor**. The example below creates a role named **Resource Policy
Contributor DINE** with the additional permission _Microsoft.Authorization/roleAssignments/write_.

```azurepowershell-interactive
$subscriptionid = '00000000-0000-0000-0000-000000000000'
$role = Get-AzRoleDefinition "Resource Policy Contributor"
$role.Id = $null
$role.Name = "Resource Policy Contributor DINE"
$role.Description = "Can assign Policies that require remediation."
$role.Actions.Clear()
$role.Actions.Add("Microsoft.Authorization/roleAssignments/write")
$role.AssignableScopes.Clear()
$role.AssignableScopes.Add("/subscriptions/$subscriptionid")
New-AzRoleDefinition -Role $role
```

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

The cmdlets `New-GuestConfigurationPolicy` and `Test-GuestConfigurationPolicyPackage` include a
parameter named **Parameters**. This parameter takes a hashtable including all details
about each parameter and automatically creates all the required sections of the files used to create
each Azure Policy definition.

The following example creates an policy definition to audit a file path, where the user provides the
path at the time of policy assignment.

```azurepowershell-interactive
$PolicyParameterInfo = @(
    @{
        Name = 'FilePath'                             # Policy parameter name (mandatory)
        DisplayName = 'File path.'                    # Policy parameter display name (mandatory)
        Description = "File path to be audited."      # Policy parameter description (optional)
        ResourceType = "ChefInSpecResource"           # Configuration resource type (mandatory)
        ResourceId = 'Audit Linux path exists'        # Configuration resource property name (mandatory)
        ResourcePropertyName = "AttributesYmlContent" # Configuration resource property name (mandatory)
        DefaultValue = '/tmp'                         # Policy parameter default value (optional)
    }
)

# The hashtable also supports a property named 'AllowedValues' with an array of strings to limit input to a list

New-GuestConfigurationPolicy
    -ContentUri 'https://storageaccountname.blob.core.windows.net/packages/AuditFilePathExists.zip?st=2019-07-01T00%3A00%3A00Z&se=2024-07-01T00%3A00%3A00Z&sp=rl&sv=2018-03-28&sr=b&sig=JdUf4nOCo8fvuflOoX%2FnGo4sXqVfP5BYXHzTl3%2BovJo%3D' `
    -DisplayName 'Audit Linux file path.' `
    -Description 'Audit that a file path exists on a Linux machine.' `
    -Path './policies' `
    -Parameters $PolicyParameterInfo `
    -Version 1.0.0
```

For Linux policies, include the property **AttributesYmlContent** in your configuration and
overwrite the values as needed. The Guest Configuration agent automatically creates the YAML file
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
            AttributesYmlContent = "path: /tmp"
        }
    }
}
```

## Policy lifecycle

To release an update to the policy definition, there are two fields that require attention.

- **Version**: When you run the `New-GuestConfigurationPolicy` cmdlet, you must specify a version
  number greater than what is currently published. The property updates the version of the Guest
  Configuration assignment so the agent recognizes the updated package.
- **contentHash**: This property is updated automatically by the `New-GuestConfigurationPolicy`
  cmdlet. It's a hash value of the package created by `New-GuestConfigurationPackage`. The property
  must be correct for the `.zip` file you publish. If only the **contentUri** property is updated,
  the Extension won't accept the content package.

The easiest way to release an updated package is to repeat the process described in this article and
provide an updated version number. That process guarantees all properties have been correctly
updated.


### Filtering Guest Configuration policies using Tags

> [!Note]
> This feature is currently in preview and requires Guest Configuration module
> version 1.20.1, which can be installed using `Install-Module GuestConfiguration -AllowPrerelease`.

The policies created by cmdlets in the Guest Configuration module can optionally include
a filter for tags. The **-Tag** parameter of `New-GuestConfigurationPolicy` supports
an array of hashtables containing individual tag entires. The tags will be added
to the `If` section of the policy definition and cannot be modified by a policy assignment.

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

## Troubleshooting Guest Configuration policy assignments (Preview)

A tool is available in preview to assist in troubleshooting Azure Policy Guest Configuration
assignments. The tool is in preview and has been published to the PowerShell Gallery as module name
[Guest Configuration Troubleshooter](https://www.powershellgallery.com/packages/GuestConfigurationTroubleshooter/).

For more information about the cmdlets in this tool, use the Get-Help command in PowerShell to show
the built-in guidance. As the tool is getting frequent updates, that is the best way to get most
recent information.

## Next steps

- Learn about auditing VMs with [Guest Configuration](../concepts/guest-configuration.md).
- Understand how to [programmatically create policies](programmatically-create.md).
- Learn how to [get compliance data](get-compliance-data.md).
