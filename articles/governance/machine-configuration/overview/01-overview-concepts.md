---
description: Learn the core concepts of Azure Policy's machine configuration feature and understand key scenarios for configuration management and compliance.
ms.date: 11/07/2025
ms.topic: overview
title: What is Azure Machine Configuration?
---

# What is Azure Machine Configuration?

> [!CAUTION]
> This article references CentOS, a Linux distribution that is End Of Life (EOL) status. Consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](/azure/virtual-machines/workloads/centos/centos-end-of-life).

Azure Policy's machine configuration feature provides native capability to audit or configure
operating system settings as code for machines running in Azure and hybrid
[Arc-enabled machines][01]. You can use the feature directly per-machine, or orchestrate it at
scale by using Azure Policy.

Configuration resources in Azure are designed as an [extension resource][02]. You can imagine each
configuration as an extra set of properties for the machine. Configurations can include settings
such as:

- Operating system settings
- Application configuration or presence
- Environment settings

Configurations are distinct from policy definitions. Machine configuration uses Azure Policy to
dynamically assign configurations to machines. You can also assign configurations to machines
[manually][03].

Examples of each scenario are provided in the following table.

|              Type              |                                                                                                        Description                                                                                                         |                                                                                            Example story                                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Configuration management][05] | You want a complete representation of a server, as code in source control. The deployment should include properties of the server (size, network, storage) and configuration of operating system and application settings. | "This machine should be a web server configured to host my website."                                                                                                                                |
| [Compliance][06]               | You want to audit or deploy settings to all machines in scope. Apply settings reactively to existing machines or proactively to new machines as they're deployed.                                                                  | "All machines should use Transport Layer Security (TLS) 1.2. Audit existing machines so I can release change where it's needed, in a controlled way, at scale. For new machines, enforce the setting when they're deployed." |

You can view the per-setting results from configurations in the [Guest assignments page][44]. If an
Azure Policy assignment orchestrated the configuration is orchestrated, you can select the "Last
evaluated resource" link on the ["Compliance details" page][07]. 

> [!NOTE]
> Machine Configuration currently supports the creation of up to 50 guest assignments per machine.

## Enforcement Modes for Custom Policies

In order to provide greater flexibility in the enforcement and monitoring of server settings, applications, and workloads, Machine Configuration offers three main enforcement modes for each policy assignment as described in the following table.

| Mode                  | Description                                                                                  |
|:----------------------|:---------------------------------------------------------------------------------------------|
| Audit                 | Only report on the state of the machine                                                      |
| Apply and Monitor     | Configuration applied to the machine and then monitored for changes                          |
| Apply and Autocorrect | Configuration applied to the machine and brought back into conformance if drift occurs |

[A video walk-through of this document is available][08].

## Supported client types

Machine configuration policy definitions are inclusive of new versions. Older versions of operating
systems available in Azure Marketplace are excluded if the Guest Configuration client isn't
compatible. Additionally, Linux server versions that are out of lifetime support by their
respective publishers are excluded from the support matrix.

The following table shows a list of supported operating systems on Azure images. The `.x` text is
symbolic to represent new minor versions of Linux distributions.

| Publisher | Name                       | Versions         |
| --------- | -------------------------- | ---------------- |
| Alma      | AlmaLinux                  | 9                |
| Amazon    | Linux                      | 2                |
| Canonical | Ubuntu Server              | 16.04 - 24.x     |
| Credativ  | Debian                     | 10.x - 12.x      |
| Microsoft | CBL-Mariner                | 1 - 2            |
| Microsoft | Azure Linux                | 3                |
| Microsoft | Windows Client             | Windows 10, 11   |
| Microsoft | Windows Server             | 2012 - 2025      |
| Oracle    | Oracle-Linux               | 7.x - 8.x        |
| OpenLogic | CentOS                     | 7.3 - 8.x        |
| Red Hat   | Red Hat Enterprise Linux\* | 7.4 - 9.x        |
| Rocky     | Rocky Linux                | 8                |
| SUSE      | SUSE Linux Enterprise Server                       | 12 SP5, 15.x     |

\* Red Hat CoreOS isn't supported.

Machine configuration policy definitions support custom virtual machine images as long as they're
one of the operating systems in the previous table. Machine Configuration doesn't support VMSS 
uniform but does support [VMSS Flex][46].

## Machine configuration samples

Machine configuration built-in policy samples are available in the following locations:

- [Built-in policy definitions - Guest Configuration][38]
- [Built-in initiatives - Guest Configuration][39]
- [Azure Policy samples GitHub repository][40]
- [Sample DSC resource modules][41]

## Next steps

- Discover and assign [built-in policies for Azure Machine Configuration][48]
- Set up a custom machine configuration package [development environment][33].
- [Create a package artifact][42] for machine configuration.
- [Test the package artifact][34] from your development environment.
- Use the **GuestConfiguration** module to [create an Azure Policy definition][43] for at-scale
  management of your environment.
- [Assign your custom policy definition][06] using Azure portal.
- Learn how to view [compliance details for machine configuration][07] policy assignments.

<!-- Link reference definitions -->
[01]: /azure/azure-arc/servers/overview
[02]: /azure/azure-resource-manager/management/extension-resource-types
[03]: ../concepts/assignments.md#manually-creating-machine-configuration-assignments
[04]: /azure/automanage
[05]: ../concepts/assignments.md
[06]: ../../policy/assign-policy-portal.md
[07]: ../../policy/how-to/determine-non-compliance.md
[08]: https://youtu.be/t9L8COY-BkM
[09]: /azure/azure-resource-manager/management/resource-providers-and-types#azure-portal
[10]: /azure/azure-resource-manager/management/resource-providers-and-types#azure-powershell
[11]: /azure/azure-resource-manager/management/resource-providers-and-types#azure-cli
[12]: /azure/virtual-machines/extensions/overview
[14]: /entra/identity/managed-identities-azure-resources/qs-configure-portal-windows-vm
[15]: /powershell/dsc/overview
[16]: https://www.chef.io/inspec/
[17]: ../../policy/how-to/get-compliance-data.md#evaluation-triggers
[18]: /azure/virtual-network/manage-network-security-group#create-a-security-rule
[19]: /azure/virtual-network/service-tags-overview
[20]: https://www.microsoft.com/download/details.aspx?id=56519
[21]: /azure/private-link/private-link-overview
[22]: /azure/virtual-network/what-is-ip-address-168-63-129-16
[23]: /azure/azure-arc/servers/network-requirements
[24]: /azure/azure-arc/servers/private-link-security
[25]: /azure/active-directory/managed-identities-azure-resources/managed-identities-faq#what-identity-will-imds-default-to-if-dont-specify-the-identity-in-the-request
[26]: https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3cf2ab00-13f1-4d0c-8971-2ac904541a7e
[27]: https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F497dff13-db2a-4c0f-8603-28fa3b331ab6
[28]: /azure/virtual-machines/availability
[29]: /azure/reliability/cross-region-replication-azure
[30]: /azure/virtual-machines/availability#availability-sets
[31]: /azure/site-recovery/site-recovery-overview
[32]: ../../policy/troubleshoot/general.md
[33]: ../how-to/develop-custom-package/overview.md
[34]: ../how-to/develop-custom-package/3-test-package.md
[35]: /azure/virtual-machines/windows/run-command
[36]: /azure/virtual-machines/linux/run-command
[37]: https://github.com/azure/nxtools#getting-started
[38]: /azure/governance/policy/samples/built-in-policies#guest-configuration
[39]: /azure/governance/policy/samples/built-in-initiatives#guest-configuration
[40]: https://github.com/Azure/azure-policy/tree/master/built-in-policies/policySetDefinitions/Guest%20Configuration
[41]: https://github.com/Azure/azure-policy/tree/master/samples/GuestConfiguration/package-samples/resource-modules
[42]: ../how-to/develop-custom-package/overview.md
[43]: ../how-to/create-policy-definition.md
[44]: ../../policy/how-to/determine-non-compliance.md#compliance-details-for-guest-configuration
[45]: ../../policy/overview.md
[46]: /azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes#scale-sets-with-flexible-orchestration
[47]: ../../policy/concepts/exemption-structure.md
[48]: ../how-to/assign-built-in-policies.md
