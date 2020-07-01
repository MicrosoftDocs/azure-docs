---
title: How to create Guest Configuration policies for Windows
description: Learn how to create an Azure Policy Guest Configuration policy for Windows.
ms.date: 03/20/2020
ms.topic: how-to
---
# How to create Guest Configuration policies for Windows

Before creating custom policy definitions, it's a good idea to read the conceptual overview information at the
page [Azure Policy Guest Configuration](../concepts/guest-configuration.md).
 
To learn about creating Guest Configuration policies for Linux, see the page
[How to create Guest Configuration policies for Linux](./guest-configuration-create-linux.md)

When auditing Windows, Guest Configuration uses a
[Desired State Configuration](/powershell/scripting/dsc/overview/overview) (DSC) resource module to
create the configuration file. The DSC configuration defines the condition that the machine should be in.
If the evaluation of the configuration fails, the policy effect **auditIfNotExists** is triggered
and the machine is considered **non-compliant**.

[Azure Policy Guest Configuration](../concepts/guest-configuration.md) can only be used to audit
settings inside machines. Remediation of settings inside machines isn't yet available.

Use the following actions to create your own configuration for validating the state of an Azure or
non-Azure machine.

> [!IMPORTANT]
> Custom policies with Guest Configuration is a Preview feature.
>
> The Guest Configuration extension is required to perform audits in Azure virtual machines.
> To deploy the extension at scale across all Windows machines, assign the following policy definitions:
>   - [Deploy prerequisites to enable Guest Configuration Policy on Windows VMs.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0ecd903d-91e7-4726-83d3-a229d7f2e293)

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
> Compilation of configurations is not yet supported on Linux.

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

## Guest Configuration artifacts and policy for Windows

Guest Configuration uses PowerShell Desired State Configuration as a language abstraction for
writing what to audit in Windows. The agent loads a standalone instance of PowerShell 6.2, so there
isn't conflict with usage of PowerShell DSC in Windows PowerShell 5.1, and there's no requirement to
pre-install PowerShell 6.2 or later.

For an overview of DSC concepts and terminology, see
[PowerShell DSC Overview](/powershell/scripting/dsc/overview/overview).

### How Guest Configuration modules differ from Windows PowerShell DSC modules

When Guest Configuration audits a machine:

1. The agent first runs `Test-TargetResource` to determine if the configuration is
in the correct state.
1. The boolean value returned by the function determines if the Azure Resource
Manager status for the Guest Assignment should be Compliant/Not-Compliant.
1. The provider runs `Get-TargetResource` to return the current state of each setting so details are available both about
why a machine isn't compliant and to confirm that the current state is compliant.

### Get-TargetResource requirements

The function `Get-TargetResource` has special requirements for Guest Configuration that haven't been
needed for Windows Desired State Configuration.

- The hashtable that is returned must include a property named **Reasons**.
- The Reasons property must be an array.
- Each item in the array should be a hashtable with keys named **Code** and **Phrase**.

The Reasons property is used by the service to standardize how information is presented when a
machine is out of compliance. You can think of each item in Reasons as a "reason" that the resource
isn't compliant. The property is an array because a resource could be out of compliance for more
than one reason.

The properties **Code** and **Phrase** are expected by the service. When authoring a custom
resource, set the text (typically stdout) you would like to show as the reason the resource isn't
compliant as the value for **Phrase**. **Code** has specific formatting requirements so reporting
can clearly display information about the resource used to do the audit. This solution
makes Guest Configuration extensible. Any command could be run as long as the
output can be returned as a string value for the **Phrase** property.

- **Code** (string): The name of the resource, repeated, and then a short name with no spaces as an
  identifier for the reason. These three values should be colon-delimited with no spaces.
  - An example would be `registry:registry:keynotpresent`
- **Phrase** (string): Human-readable text to explain why the setting isn't compliant.
  - An example would be `The registry key $key is not present on the machine.`

```powershell
$reasons = @()
$reasons += @{
  Code = 'Name:Name:ReasonIdentifer'
  Phrase = 'Explain why the setting is not compliant'
}
return @{
    reasons = $reasons
}
```

The Reasons property must also be added to the schema MOF for the resource as an embedded class.

```mof
[ClassVersion("1.0.0.0")] 
class Reason
{
    [Read] String Phrase;
    [Read] String Code;
};

[ClassVersion("1.0.0.0"), FriendlyName("ResourceName")]
class ResourceName : OMI_BaseResource
{
    [Key, Description("Example description")] String Example;
    [Read, EmbeddedInstance("Reason")] String Reasons[];
};
```

### Configuration requirements

The name of the custom configuration must be consistent everywhere. The name of
the .zip file for the content package, the configuration name in the MOF file, and the guest
assignment name in the Resource Manager template, must be the same.

### Scaffolding a Guest Configuration project

Developers who would like to accelerate the process of getting started and work from sample
code can install a community project named **Guest Configuration Project**. The project installs a template for the
[Plaster](https://github.com/powershell/plaster) PowerShell module. This tool can be used to
scaffold a project including a working configuration and sample resource, and a set of
[Pester](https://github.com/pester/pester) tests to validate the project. The template also includes
task runners for Visual Studio Code to automate building and validating the Guest Configuration
package. For more information, see the GitHub project
[Guest Configuration Project](https://github.com/microsoft/guestconfigurationproject).

For more information about working with configurations in general, see
[Write, Compile, and Apply a Configuration](/powershell/scripting/dsc/configurations/write-compile-apply-configuration).

### Expected contents of a Guest Configuration artifact

The completed package is used by Guest Configuration to create the Azure Policy definitions. The
package consists of:

- The compiled DSC configuration as a MOF
- Modules folder
  - GuestConfiguration module
  - DscNativeResources module
  - (Windows) DSC resource modules required by the MOF

PowerShell cmdlets assist in creating the package.
No root level folder or version folder is required.
The package format must be a .zip file.

### Storing Guest Configuration artifacts

The .zip package must be stored in a location that is accessible by the managed virtual machines.
Examples include GitHub repositories, an Azure Repo, or Azure storage. If you prefer to not make the
package public, you can include a
[SAS token](../../../storage/common/storage-dotnet-shared-access-signature-part-1.md) in the URL.
You could also implement
[service endpoint](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network)
for machines in a private network, although this configuration applies only to accessing the package
and not communicating with the service.

## Step by step, creating a custom Guest Configuration audit policy for Windows

Create a DSC configuration to audit settings. The following PowerShell script example creates a configuration named
**AuditBitLocker**, imports the **PsDscResources** resource module, and uses the `Service` resource
to audit for a running service. The configuration script can be executed from a Windows or macOS
machine.

```powershell
# Add PSDscResources module to environment
Install-Module 'PSDscResources'

# Define the DSC configuration and import GuestConfiguration
Configuration AuditBitLocker
{
    Import-DscResource -ModuleName 'PSDscResources'

    Node AuditBitlocker {
      Service 'Ensure BitLocker service is present and running'
      {
          Name = 'BDESVC'
          Ensure = 'Present'
          State = 'Running'
      }
    }
}

# Compile the configuration to create the MOF files
AuditBitLocker ./Config
```

Save this file with name `config.ps1` in the project folder. Run it in PowerShell by executing `./config.ps1`
in the terminal. A new mof file is created.

The `Node AuditBitlocker` command isn't technically required but it produces a file named
`AuditBitlocker.mof` rather than the default, `localhost.mof`. Having the .mof file name follow the
configuration makes it easy to organize many files when operating at scale.

Once the MOF is compiled, the supporting files must be packaged together. The completed package is
used by Guest Configuration to create the Azure Policy definitions.

The `New-GuestConfigurationPackage` cmdlet creates the package. Modules that are needed by the configuration must be in available in `$Env:PSModulePath`. Parameters of the
`New-GuestConfigurationPackage` cmdlet when creating Windows content:

- **Name**: Guest Configuration package name.
- **Configuration**: Compiled DSC configuration document full path.
- **Path**: Output folder path. This parameter is optional. If not specified, the package is created
  in current directory.

Run the following command to create a package using the configuration given in the previous step:

```azurepowershell-interactive
New-GuestConfigurationPackage `
  -Name 'AuditBitlocker' `
  -Configuration './Config/AuditBitlocker.mof'
```

After creating the Configuration package but before publishing it to Azure, you can test the package from your workstation or CI/CD environment. The GuestConfiguration
cmdlet `Test-GuestConfigurationPackage` includes the same agent in your
development environment as is used inside Azure machines. Using this solution, you can do
integration testing locally before releasing to billed cloud environments.

Since the agent is actually evaluating the local environment, in most cases you need to run the
Test- cmdlet on the same OS platform as you plan to audit. The test only uses modules that are included in the content package.

Parameters of the `Test-GuestConfigurationPackage` cmdlet:

- **Name**: Guest Configuration policy name.
- **Parameter**: Policy parameters provided in hashtable format.
- **Path**: Full path of the Guest Configuration package.

Run the following command to test the package created by the previous step:

```azurepowershell-interactive
Test-GuestConfigurationPackage `
  -Path ./AuditBitlocker.zip
```

The cmdlet also supports input from the PowerShell pipeline. Pipe the output of
`New-GuestConfigurationPackage` cmdlet to the `Test-GuestConfigurationPackage` cmdlet.

```azurepowershell-interactive
New-GuestConfigurationPackage -Name AuditBitlocker -Configuration ./Config/AuditBitlocker.mof | Test-GuestConfigurationPackage
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
  -filePath ./AuditBitlocker.zip `
  -blobName 'AuditBitlocker'
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
    -ContentUri 'https://storageaccountname.blob.core.windows.net/packages/AuditBitLocker.zip?st=2019-07-01T00%3A00%3A00Z&se=2024-07-01T00%3A00%3A00Z&sp=rl&sv=2018-03-28&sr=b&sig=JdUf4nOCo8fvuflOoX%2FnGo4sXqVfP5BYXHzTl3%2BovJo%3D' `
    -DisplayName 'Audit BitLocker Service.' `
    -Description 'Audit if BitLocker is not enabled on Windows machine.' `
    -Path './policies' `
    -Platform 'Windows' `
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
>   - If the parameter is not included, the category defaults to Guest Configuration.
> These features are in preview and require Guest Configuration module
> version 1.20.1, which can be installed using `Install-Module GuestConfiguration -AllowPrerelease`.

Finally, publish the policy definitions using the `Publish-GuestConfigurationPolicy` cmdlet. The
cmdlet only has the **Path** parameter that points to the location of the JSON files created by
`New-GuestConfigurationPolicy`.

To run the Publish command, you need access to create policies in Azure. The specific authorization
requirements are documented in the [Azure Policy Overview](../overview.md) page. The best built-in
role is **Resource Policy Contributor**.

```azurepowershell-interactive
Publish-GuestConfigurationPolicy -Path '.\policyDefinitions'
```

The `Publish-GuestConfigurationPolicy` cmdlet accepts the path from the PowerShell pipeline. This
feature means you can create the policy files and publish them in a single set of piped commands.

```azurepowershell-interactive
New-GuestConfigurationPolicy `
 -ContentUri 'https://storageaccountname.blob.core.windows.net/packages/AuditBitLocker.zip?st=2019-07-01T00%3A00%3A00Z&se=2024-07-01T00%3A00%3A00Z&sp=rl&sv=2018-03-28&sr=b&sig=JdUf4nOCo8fvuflOoX%2FnGo4sXqVfP5BYXHzTl3%2BovJo%3D' `
  -DisplayName 'Audit BitLocker service.' `
  -Description 'Audit if the BitLocker service is not enabled on Windows machine.' `
  -Path './policies' `
 | Publish-GuestConfigurationPolicy
```

With the policy created in Azure, the last step is to assign the initiative. See how to assign the
initiative with [Portal](../assign-policy-portal.md), [Azure CLI](../assign-policy-azurecli.md), and
[Azure PowerShell](../assign-policy-powershell.md).

> [!IMPORTANT]
> Guest Configuration policies must **always** be assigned using the initiative that combines the
> _AuditIfNotExists_ and _DeployIfNotExists_ policies. If only the _AuditIfNotExists_ policy is
> assigned, the prerequisites aren't deployed and the policy always shows that '0' servers are
> compliant.

Assigning a policy definition with _DeployIfNotExists_ effect requires an additional level of
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

### Filtering Guest Configuration policies using Tags

> [!Note]
> This feature is in preview and requires Guest Configuration module
> version 1.20.1, which can be installed using `Install-Module GuestConfiguration -AllowPrerelease`.

The policy definitions created by cmdlets in the Guest Configuration module can optionally include
a filter for tags. The **Tag** parameter of `New-GuestConfigurationPolicy` supports
an array of hashtables containing individual tag entires. The tags are added
to the `If` section of the policy definition and can not be modified by a policy assignment.

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
      // Original Guest Configuration content
    }
  ]
}
```

### Using parameters in custom Guest Configuration policy definitions

Guest Configuration supports overriding properties of a Configuration at run time. This feature
means that the values in the MOF file in the package don't have to be considered static. The
override values are provided through Azure Policy and don't impact how the Configurations are
authored or compiled.

The cmdlets `New-GuestConfigurationPolicy` and `Test-GuestConfigurationPolicyPackage` include a
parameter named **Parameters**. This parameter takes a hashtable definition including all details
about each parameter and creates the required sections of each file used for the Azure Policy
definition.

The following example creates a policy definition to audit a service, where the user selects from a
list at the time of policy assignment.

```azurepowershell-interactive
$PolicyParameterInfo = @(
    @{
        Name = 'ServiceName'                                            # Policy parameter name (mandatory)
        DisplayName = 'windows service name.'                           # Policy parameter display name (mandatory)
        Description = "Name of the windows service to be audited."      # Policy parameter description (optional)
        ResourceType = "Service"                                        # DSC configuration resource type (mandatory)
        ResourceId = 'windowsService'                                   # DSC configuration resource property name (mandatory)
        ResourcePropertyName = "Name"                                   # DSC configuration resource property name (mandatory)
        DefaultValue = 'winrm'                                          # Policy parameter default value (optional)
        AllowedValues = @('BDESVC','TermService','wuauserv','winrm')    # Policy parameter allowed values (optional)
    }
)

New-GuestConfigurationPolicy
    -ContentUri 'https://storageaccountname.blob.core.windows.net/packages/AuditBitLocker.zip?st=2019-07-01T00%3A00%3A00Z&se=2024-07-01T00%3A00%3A00Z&sp=rl&sv=2018-03-28&sr=b&sig=JdUf4nOCo8fvuflOoX%2FnGo4sXqVfP5BYXHzTl3%2BovJo%3D' `
    -DisplayName 'Audit Windows Service.' `
    -Description 'Audit if a Windows Service is not enabled on Windows machine.' `
    -Path '.\policyDefinitions' `
    -Parameters $PolicyParameterInfo `
    -Version 1.0.0
```

## Extending Guest Configuration with third-party tools

> [!Note]
> This feature is in preview and requires Guest Configuration module
> version 1.20.3, which can be installed using `Install-Module GuestConfiguration -AllowPrerelease`.
> In version 1.20.3, this feature is only available for policy definitions that audit Windows machines

The artifact packages for Guest Configuration can be extended to include third-party tools.
Extending Guest Configuration requires development of two components.

- A Desired State Configuration resource that handles all activity related to managing the third-party tool
  - Install
  - Invoke
  - Convert output
- Content in the correct format for the tool to natively consume

The DSC resource requires custom development if a community solution does not already exist.
Community solutions can be discovered by searching the PowerShell Gallery for tag
[GuestConfiguration](https://www.powershellgallery.com/packages?q=Tags%3A%22GuestConfiguration%22).

> [!Note]
> Guest Configuration extensibility is a "bring your own
> license" scenario. Ensure you have met the terms and conditions of any third
> party tools before use.

After the DSC resource has been installed in the development environment, use the
**FilesToInclude** parameter for `New-GuestConfigurationPackage` to include
content for the third-party platform in the content artifact.

### Step by step, creating a content artifact that uses third-party tools

Only the `New-GuestConfigurationPackage` cmdlet requires a change from
the step-by-step guidance for DSC content artifacts. For this example,
use the `gcInSpec` module to extend Guest Configuration to audit Windows machines
using the InSpec platform rather than the built-in module used on Linux. The
community module is maintained as an
[open source project in GitHub](https://github.com/microsoft/gcinspec).

Install required modules in your development environment:

```azurepowershell-interactive
# Update PowerShellGet if needed to allow installing PreRelease versions of modules
Install-Module PowerShellGet -Force

# Install GuestConfiguration module prerelease version
Install-Module GuestConfiguration -allowprerelease

# Install commmunity supported gcInSpec module
Install-Module gcInSpec
```

First, create the YaML file used by InSpec. The file provides basic information about the
environment. An example is given below:

```YaML
name: wmi_service
title: Verify WMI service is running
maintainer: Microsoft Corporation
summary: Validates that the Windows Service 'winmgmt' is running
copyright: Microsoft Corporation
license: MIT
version: 1.0.0
supports:
  - os-family: windows
```

Save this file named `wmi_service.yml` in a folder named `wmi_service` in your project directory.

Next, create the Ruby file with the InSpec language abstraction used to audit the machine.

```Ruby
control 'wmi_service' do
  impact 1.0
  title 'Verify windows service: winmgmt'
  desc 'Validates that the service, is installed, enabled, and running'

  describe service('winmgmt') do
    it { should be_installed }
    it { should be_enabled }
    it { should be_running }
  end
end

```

Save this file `wmi_service.rb` in a new folder named `controls` inside the `wmi_service` directory.

Finally, create a configuration, import the **GuestConfiguration** resource module, and use the
`gcInSpec` resource to set the name of the InSpec profile.

```powershell
# Define the configuration and import GuestConfiguration
Configuration wmi_service
{
    Import-DSCResource -Module @{ModuleName = 'gcInSpec'; ModuleVersion = '2.1.0'}
    node 'wmi_service'
    {
        gcInSpec wmi_service
        {
            InSpecProfileName       = 'wmi_service'
            InSpecVersion           = '3.9.3'
            WindowsServerVersion    = '2016'
        }
    }
}

# Compile the configuration to create the MOF files
wmi_service -out ./Config
```

You should now have a project structure as below:

```file
/ wmi_service
    / Config
        wmi_service.mof
    / wmi_service
        wmi_service.yml
        / controls
            wmi_service.rb 
```

The supporting files must be packaged together. The completed package is used by
Guest Configuration to create the Azure Policy definitions.

The `New-GuestConfigurationPackage` cmdlet creates the package. For third-party
content, use the **FilesToInclude** parameter to add the InSpec content to the
package. You do not need to specify the **ChefProfilePath** as for Linux packages.

- **Name**: Guest Configuration package name.
- **Configuration**: Compiled configuration document full path.
- **Path**: Output folder path. This parameter is optional. If not specified, the package is created
  in current directory.
- **FilesoInclude**: Full path to InSpec profile.

Run the following command to create a package using the configuration given in
the previous step:

```azurepowershell-interactive
New-GuestConfigurationPackage `
  -Name 'wmi_service' `
  -Configuration './Config/wmi_service.mof' `
  -FilesToInclude './wmi_service'  `
  -Path './package' 
```

## Policy lifecycle

If you would like to release an update to the policy, there are two fields that require attention.

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

## Converting Windows Group Policy content to Azure Policy Guest Configuration

Guest Configuration, when auditing Windows machines, is an implementation of the PowerShell Desired
State Configuration syntax. The DSC community has published tooling to convert exported Group Policy
templates to DSC format. By using this tool together with the Guest Configuration cmdlets described
above, you can convert Windows Group Policy content and package/publish it for Azure Policy to
audit. For details about using the tool, see the article
[Quickstart: Convert Group Policy into DSC](/powershell/scripting/dsc/quickstarts/gpo-quickstart).
Once the content has been converted, the steps above to create a package and publish it as Azure
Policy are the same as for any DSC content.

## Optional: Signing Guest Configuration packages

Guest Configuration custom policies use SHA256 hash to validate the policy package hasn't
changed.
Optionally, customers may also use a certificate to sign packages and force the Guest Configuration
extension to only allow signed content.

To enable this scenario, there are two steps you need to complete. Run the cmdlet to sign the
content package, and append a tag to the machines that should require code to be signed.

To use the Signature Validation feature, run the `Protect-GuestConfigurationPackage` cmdlet to sign
the package before it's published. This cmdlet requires a 'Code Signing' certificate.

```azurepowershell-interactive
$Cert = Get-ChildItem -Path cert:\LocalMachine\My | Where-Object {($_.Subject-eq "CN=mycert") }
Protect-GuestConfigurationPackage -Path .\package\AuditWindowsService\AuditWindowsService.zip -Certificate $Cert -Verbose
```

Parameters of the `Protect-GuestConfigurationPackage` cmdlet:

- **Path**: Full path of the Guest Configuration package.
- **Certificate**: Code signing certificate to sign the package. This parameter is only supported
  when signing content for Windows.

GuestConfiguration agent expects the certificate public key to be present in "Trusted Root
Certificate Authorities" on Windows machines and in the path
`/usr/local/share/ca-certificates/extra` on Linux machines. For the node to verify signed content,
install the certificate public key on the machine before applying the custom policy. This process
can be done using any technique inside the VM or by using Azure Policy. An example template is
[provided here](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-push-certificate-windows).
The Key Vault access policy must allow the Compute resource provider to access certificates during
deployments. For detailed steps, see
[Set up Key Vault for virtual machines in Azure Resource Manager](../../../virtual-machines/windows/key-vault-setup.md#use-templates-to-set-up-key-vault).

Following is an example to export the public key from a signing certificate, to import to the
machine.

```azurepowershell-interactive
$Cert = Get-ChildItem -Path cert:\LocalMachine\My | Where-Object {($_.Subject-eq "CN=mycert3") } | Select-Object -First 1
$Cert | Export-Certificate -FilePath "$env:temp\DscPublicKey.cer" -Force
```

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
