---
title: Understand how Azure Policy performs audits inside a virtual machine
description: Learn how Azure Policy uses Guest Configuration to audit settings inside an Azure virtual machine. 
services: azure-policy
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/24/2018
ms.topic: conceptual
ms.service: azure-policy
manager: carmonm
ms.custom: mvc
---
# Understand Azure Policy's Guest Configuration

In addition to auditing and [remediating](../how-to/remediate-resources.md) Azure resources, Azure
Policy is capable of auditing settings inside a virtual machine. The validation is performed by the
Guest Configuration extension and client. The extension, through the client, validates settings
such as the configuration of the operating system, application configuration or presence,
environment settings, and more.

> [!IMPORTANT]
> Currently, only **built-in** policies are supported with Guest Configuration.

## Extension and client

To audit settings inside a virtual machine, a [virtual machine
extension](../../../virtual-machines/extensions/overview.md) is enabled. The extension downloads
applicable policy assignment and the corresponding configuration definition.

### Register Guest Configuration resource provider

Before you can use Guest Configuration, you must register the resource provider. You can do this
through the portal or through PowerShell.

#### Registration - Portal

To register the resource provider for Guest Configuration through the Azure portal, follow these
steps:

1. Launch the Azure portal and click on **All services**. Search for and select **Subscriptions**.

1. Find and click on the subscription that you want to enable Guest Configuration for.

1. In the left menu of the **Subscription** page, click **Resource providers**.

1. Filter for or scroll until you locate **Microsoft.GuestConfiguration**, then click **Register** on the same row.

#### Registration - PowerShell

To register the resource provider for Guest Configuration through PowerShell, run the following
command:

```azurepowershell-interactive
# Login first with Connect-AzureRmAccount if not using Cloud Shell
Register-AzureRmResourceProvider -ProviderNamespace 'Microsoft.GuestConfiguration'
```

### Validation tools

Inside the virtual machine, the Guest Configuration client uses local tools to perform the audit.

The following table shows a list of the local tools used on each supported operating system:

|Operating system|Validation tool|Notes|
|-|-|-|
|Windows|[Microsoft Desired State Configuration](/powershell/dsc) v2| |
|Linux|[Chef InSpec](https://www.chef.io/inspec/)| Ruby and Python are installed by the Guest Configuration extension. |

### Supported client types

The following table shows a list of supported operating system on Azure images:

|Publisher|Name|Versions|
|-|-|-|
|Canonical|Ubuntu Server|14.04, 16.04, 18.04|
|Credativ|Debian|8, 9|
|Microsoft|Windows Server|2012 Datacenter, 2012 R2 Datacenter, 2016 Datacenter|
|OpenLogic|CentOS|7.3, 7.4, 7.5|
|Red Hat|Red Hat Enterprise Linux|7.4, 7.5|
|Suse|SLES|12 SP3|

> [!IMPORTANT]
> Guest Configuration is not currently supported on custom virtual machine images.

### Unsupported client types

The following table lists operating systems that aren't supported:

|Operating system|Notes|
|-|-|
|Windows client | Client operating systems (such as Windows 7 and Windows 10) aren't supported.
|Windows Server 2016 Nano Server | Not supported.|

## Guest Configuration definition requirements

Each audit performed by Guest Configuration requires two policy definitions, a
**DeployIfNotExists** and **AuditIfNotExists**. **DeployIfNotExists** is used to prepare the
virtual machine with the Guest Configuration agent and other components to support the [validation
tools](#validation-tools).

The **DeployIfNotExists** policy definition validates and corrects the following:

- Ensure the virtual machine has been assigned a configuration to evaluate. If no assignment is currently present, get the assignment and prepare the virtual machine by:
  - Authenticating to the virtual machine using a [managed identity](../../../active-directory/managed-identities-azure-resources/overview.md)
  - Installing the latest version of the **Microsoft.GuestConfiguration** extension
  - Installing [validation tools](#validation-tools) and dependencies, if needed

Once the **DeployIfNotExists** is Compliant, the **AuditIfNotExists** policy definition uses the
local validation tools to determine if the assigned configuration assignment is Compliant or
Non-compliant. The validation tool provides the results to the Guest Configuration client, which
forwards it to the Guest Extension to make it available through the Guest Configuration resource
provider.

Azure Policy uses the Guest Configuration resource providers **complianceStatus** property to
report compliance in the **Compliance** node. For more information, see [getting compliance data](../how-to/getting-compliance-data.md).

> [!NOTE]
> For each Guest Configuration definition, both the **DeployIfNotExists** and **AuditIfNotExists**
> policy definitions must exist.

All built-in policies for Guest Configuration are included in an initiative to group the
definitions for use in assignments. The built-in initiative named *[Preview]: Audit Password
security settings inside Linux and Windows virtual machines* contains 18 policies. There are six
**DeployIfNotExists** and **AuditIfNotExists** pairs for Windows and three pairs for Linux. In each
case, the logic inside the definition ensures only the target operating system is evaluated based
on the [policy rule](definition-structure.md#policy-rule) definition.

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md)
- Review the [Policy definition structure](definition-structure.md)
- Review [Understanding policy effects](effects.md)
- Understand how to [programmatically create policies](../how-to/programmatically-create.md)
- Learn how to [get compliance data](../how-to/getting-compliance-data.md)
- Discover how to [remediate non-compliant resources](../how-to/remediate-resources.md)
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/index.md)