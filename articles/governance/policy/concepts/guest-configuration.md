---
title: Learn to audit the contents of virtual machines
description: Learn how Azure Policy uses Guest Configuration to audit settings inside an Azure machine. 
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/20/2019
ms.topic: conceptual
ms.service: azure-policy
---
# Understand Azure Policy's Guest Configuration

Beyond auditing and [remediating](../how-to/remediate-resources.md) Azure resources, Azure Policy
can audit settings inside a machine. The validation is performed by the Guest Configuration
extension and client. The extension, through the client, validates settings such as:

- The configuration of the operating system
- Application configuration or presence
- Environment settings

At this time, Azure Policy Guest Configuration only audits settings inside the machine. It doesn't
apply configurations.

## Extension and client

To audit settings inside a machine, a [virtual machine
extension](../../../virtual-machines/extensions/overview.md) is enabled. The extension downloads
applicable policy assignment and the corresponding configuration definition.

### Limits set on the extension

To limit the extension from impacting applications running inside the machine, the Guest
Configuration isn't allowed to exceed more than 5% of CPU utilization. This limitation exists for
both built-in and custom definitions.

## Register Guest Configuration resource provider

Before you can use Guest Configuration, you must register the resource provider. You can register
through the portal or through PowerShell. The resource provider is registered automatically if
assignment of a Guest Configuration policy is done through the portal.

### Registration - Portal

To register the resource provider for Guest Configuration through the Azure portal, follow these
steps:

1. Launch the Azure portal and click on **All services**. Search for and select **Subscriptions**.

1. Find and click on the subscription that you want to enable Guest Configuration for.

1. In the left menu of the **Subscription** page, click **Resource providers**.

1. Filter for or scroll until you locate **Microsoft.GuestConfiguration**, then click **Register**
   on the same row.

### Registration - PowerShell

To register the resource provider for Guest Configuration through PowerShell, run the following
command:

```azurepowershell-interactive
# Login first with Connect-AzAccount if not using Cloud Shell
Register-AzResourceProvider -ProviderNamespace 'Microsoft.GuestConfiguration'
```

## Validation tools

Inside the machine, the Guest Configuration client uses local tools to run the audit.

The following table shows a list of the local tools used on each supported operating system:

|Operating system|Validation tool|Notes|
|-|-|-|
|Windows|[Microsoft Desired State Configuration](/powershell/dsc) v2| |
|Linux|[Chef InSpec](https://www.chef.io/inspec/)| Ruby and Python are installed by the Guest Configuration extension. |

### Validation frequency

The Guest Configuration client checks for new content every 5 minutes. Once a guest assignment is
received, the settings are checked on a 15-minute interval. Results are sent to the Guest
Configuration resource provider as soon as the audit completes. When a policy [evaluation
trigger](../how-to/get-compliance-data.md#evaluation-triggers) occurs, the state of the machine is
written to the Guest Configuration resource provider. This update causes Azure Policy to evaluate
the Azure Resource Manager properties. An on-demand Azure Policy evaluation retrieves the latest
value from the Guest Configuration resource provider. However, it doesn't trigger a new audit of the
configuration within the machine.

## Supported client types

The following table shows a list of supported operating system on Azure images:

|Publisher|Name|Versions|
|-|-|-|
|Canonical|Ubuntu Server|14.04, 16.04, 18.04|
|Credativ|Debian|8, 9|
|Microsoft|Windows Server|2012 Datacenter, 2012 R2 Datacenter, 2016 Datacenter, 2019 Datacenter|
|Microsoft|Windows Client|Windows 10|
|OpenLogic|CentOS|7.3, 7.4, 7.5|
|Red Hat|Red Hat Enterprise Linux|7.4, 7.5|
|Suse|SLES|12 SP3|

> [!IMPORTANT]
> Guest Configuration can audit nodes running a supported OS. If you would like to audit virtual
> machines that use a custom image, you need to duplicate the **DeployIfNotExists** definition and
> modify the **If** section to include your image properties.

### Unsupported client types

Windows Server Nano Server isn't supported in any version.

## Guest Configuration Extension network requirements

To communicate with the Guest Configuration resource provider in Azure, machines require outbound
access to Azure datacenters on port **443**. If you're using a private virtual network in Azure that
doesn't allow outbound traffic, configure exceptions with [Network Security
Group](../../../virtual-network/manage-network-security-group.md#create-a-security-rule) rules. A
service tag doesn't currently exist for Azure Policy Guest Configuration.

For IP address lists, you can download [Microsoft Azure Datacenter IP
Ranges](https://www.microsoft.com/download/details.aspx?id=41653). This file is updated weekly, and
has the currently deployed ranges and any upcoming changes to the IP ranges. You only need to allow
outbound access to the IPs in the regions where your VMs are deployed.

> [!NOTE]
> The Azure Datacenter IP address XML file lists the IP address ranges that are used in the
> Microsoft Azure datacenters. The file includes compute, SQL, and storage ranges. An updated file
> is posted weekly. The file reflects the currently deployed ranges and any upcoming changes to the
> IP ranges. New ranges that appear in the file aren't used in the datacenters for at least one
> week. It's a good idea to download the new XML file every week. Then, update your site to
> correctly identify services running in Azure. Azure ExpressRoute users should note that this file
> is used to update the Border Gateway Protocol (BGP) advertisement of Azure space in the first week
> of each month.

## Guest Configuration definition requirements

Each audit run by Guest Configuration requires two policy definitions, a **DeployIfNotExists**
definition and an **AuditIfNotExists** definition. The **DeployIfNotExists** definition is used to
prepare the machine with the Guest Configuration agent and other components to support the [validation tools](#validation-tools).

The **DeployIfNotExists** policy definition validates and corrects the following items:

- Validate the machine has been assigned a configuration to evaluate. If no assignment is currently
  present, get the assignment and prepare the machine by:
  - Authenticating to the machine using a [managed identity](../../../active-directory/managed-identities-azure-resources/overview.md)
  - Installing the latest version of the **Microsoft.GuestConfiguration** extension
  - Installing [validation tools](#validation-tools) and dependencies, if needed

If the **DeployIfNotExists** assignment is Non-compliant, a [remediation
task](../how-to/remediate-resources.md#create-a-remediation-task) can be used.

Once the **DeployIfNotExists** assignment is Compliant, the **AuditIfNotExists** policy assignment
uses the local validation tools to determine if the configuration assignment is Compliant or
Non-compliant. The validation tool provides the results to the Guest Configuration client. The
client forwards the results to the Guest Extension, which makes them available through the Guest
Configuration resource provider.

Azure Policy uses the Guest Configuration resource providers **complianceStatus** property to report
compliance in the **Compliance** node. For more information, see [getting compliance
data](../how-to/getting-compliance-data.md).

> [!NOTE]
> The **DeployIfNotExists** policy is required for the **AuditIfNotExists** policy to return
> results. Without the **DeployIfNotExists**, the **AuditIfNotExists** policy shows "0 of 0"
> resources as status.

All built-in policies for Guest Configuration are included in an initiative to group the definitions
for use in assignments. The built-in initiative named *[Preview]: Audit Password security settings
inside Linux and Windows machines* contains 18 policies. There are six **DeployIfNotExists** and
**AuditIfNotExists** pairs for Windows and three pairs for Linux. The [policy definition](definition-structure.md#policy-rule)
logic validates that only the target operating system is evaluated.

#### Auditing operating system settings following industry baselines

One of the initiatives available in Azure Policy provides the ability to audit operating system settings
inside virtual machines following a "baseline" from Microsoft.  The definition, 
*[Preview]: Audit Windows VMs that do not match Azure security baseline settings*
includes a complete set of audit rules based on settings from Active Directory Group Policy.

Most of the settings are available as parameters.  This functionality allows you to customize
what will be audited to align the policy with your organizational requirements,
or to map the policy to 3rd party information such as industry regulatory standards.

Some parameters support an integer value range.  For example, the Maximum Password Age
parameter can be set using a range operator to give flexibility to machine
owners.  You could audit that the effective Group Policy setting
requiring user to change their passwords should be no more than 70 days,
but shouldn't be less than 1 day.  As described in the info-bubble for the parameter,
to make this the effective audit value, set the value to "1,70".

If you assign the policy using an Azure Resource Manager dployment template,
you can use a parameters file to manage these settings from source control.
Using a tool such as Git to manage changes to Audit policies with comments
at each check-in, will document evidence as to why an assignment
should be in exception to the expected value.

#### Applying configurations using Guest Configuration

The latest feature of Azure Policy configures settings inside machines.
The definition *Configure the time zone on Windows machines* will
make changes to the machine by configuring the time zone.

When assigning definitions that begin with *Configure*, you must also assign
the definition *Deploy prerequisites to enable Guest Configuration Policy on Windows VMs.*
You can combine these definitions in an initiative if you choose.

#### Assigning policies to machines outside of Azure

The Audit policies available for Guest Configuration include the **Microsoft.HybridCompute/machines**
resource type.  Any machines onboarded to Azure Arc that are in the scope of the assignment
will automatically be included.

### Multiple assignments

Guest Configuration policies currently only support assigning the same Guest Assignment once per
machine, even if the Policy assignment uses different parameters.

## Built-in resource modules

When installing the Guest Configuration extension, the 'GuestConfiguration' PowerShell module is
included with the latest version of DSC resource modules. This module can be downloaded from the
PowerShell Gallery by using the 'Manual Download' link from the module page [GuestConfiguration](https://www.powershellgallery.com/packages/GuestConfiguration/).
The '.nupkg' file format can be renamed to '.zip' to uncompress and review.

## Client log files

The Guest Configuration extension writes log files to the following locations:

Windows: `C:\Packages\Plugins\Microsoft.GuestConfiguration.ConfigurationforWindows\<version>\dsc\logs\dsc.log`

Linux: `/var/lib/waagent/Microsoft.GuestConfiguration.ConfigurationforLinux-<version>/GCAgent/logs/dsc.log`

Where `<version>` refers to the current version number.

### Collecting logs remotely

The first step in troubleshooting Guest Configuration configurations or modules should be to use the
`Test-GuestConfigurationPackage` cmdlet following the steps in
[Test a Guest Configuration package](../how-to/guest-configuration-create.md#test-a-guest-configuration-package).
If that isn't successful, collecting client logs can help diagnose issues.

#### Windows

To use the Azure VM Run Command capability to capture information from log files in Windows
machines, the following example PowerShell script can be helpful. For more information, see
[Run PowerShell scripts in your Windows VM with Run Command](../../../virtual-machines/windows/run-command.md).

```powershell
$linesToIncludeBeforeMatch = 0
$linesToIncludeAfterMatch = 10
$latestVersion = Get-ChildItem -Path 'C:\Packages\Plugins\Microsoft.GuestConfiguration.ConfigurationforWindows\' | ForEach-Object {$_.FullName} | Sort-Object -Descending | Select-Object -First 1
Select-String -Path "$latestVersion\dsc\logs\dsc.log" -pattern 'DSCEngine','DSCManagedEngine' -CaseSensitive -Context $linesToIncludeBeforeMatch,$linesToIncludeAfterMatch | Select-Object -Last 10
```

#### Linux

To use the Azure VM Run Command capability to capture information from log files in Linux machines,
the following example Bash script can be helpful. For more information, see
[Run shell scripts in your Linux VM with Run Command](../../../virtual-machines/linux/run-command.md)

```Bash
linesToIncludeBeforeMatch=0
linesToIncludeAfterMatch=10
latestVersion=$(find /var/lib/waagent/ -type d -name "Microsoft.GuestConfiguration.ConfigurationforLinux-*" -maxdepth 1 -print | sort -z | sed -n 1p)
egrep -B $linesToIncludeBeforeMatch -A $linesToIncludeAfterMatch 'DSCEngine|DSCManagedEngine' "$latestVersion/GCAgent/logs/dsc.log" | tail
```

## Guest Configuration samples

Samples for Policy Guest Configuration are available in the following locations:

- [Samples index - Guest Configuration](../samples/index.md#guest-configuration)
- [Azure Policy samples GitHub repo](https://github.com/Azure/azure-policy/tree/master/samples/GuestConfiguration)

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](definition-structure.md).
- Review [Understanding policy effects](effects.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/getting-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
