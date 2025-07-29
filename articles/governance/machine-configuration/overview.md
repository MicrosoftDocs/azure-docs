---
title: Understand Azure Machine Configuration
description: Learn how Azure Policy uses the machine configuration feature to audit or configure settings inside virtual machines.
ms.date: 02/01/2024
ms.topic: conceptual
---
# Understanding Azure Machine Configuration

> [!CAUTION]
> This article references CentOS, a Linux distribution that is End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](/azure/virtual-machines/workloads/centos/centos-end-of-life).

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
| [Compliance][06]               | You want to audit or deploy settings to all machines in scope either reactively to existing machines or proactively to new machines as they're deployed.                                                                  | "All machines should use TLS 1.2. Audit existing machines so I can release change where it's needed, in a controlled way, at scale. For new machines, enforce the setting when they're deployed." |

You can view the per-setting results from configurations in the [Guest assignments page][44]. If an
Azure Policy assignment orchestrated the configuration is orchestrated, you can select the "Last
evaluated resource" link on the ["Compliance details" page][07]. 

> [!NOTE]
> Machine Configuration currently supports the creation of up to 50 guest assignments per machine.

## Enforcement Modes for Custom Policies

In order to provide greater flexibility in the enforcement and monitoring of server settings, applications and workloads, Machine Configuration offers three main enforcement modes for each policy assignment as described in the following table.

| Mode                  | Description                                                                                  |
|:----------------------|:---------------------------------------------------------------------------------------------|
| Audit                 | Only report on the state of the machine                                                      |
| Apply and Monitor     | Configuration applied to the machine and then monitored for changes                          |
| Apply and Autocorrect | Configuration applied to the machine and brought back into conformance in the event of drift |

[A video walk-through of this document is available][08]. (Update coming soon)

## Enable machine configuration

To manage the state of machines in your environment, including machines in Azure
and Arc-enabled servers, review the following details.

## Resource provider

Before you can use the machine configuration feature of Azure Policy, you must register the
`Microsoft.GuestConfiguration` resource provider. If assignment of a machine configuration policy
is done through the portal, or if the subscription is enrolled in Microsoft Defender for Cloud, the
resource provider is registered automatically. You can manually register through the [portal][09],
[Azure PowerShell][10], or [Azure CLI][11].

## Deploy requirements for Azure virtual machines

To manage settings inside a machine, a [virtual machine extension][12] is enabled and the machine
must have a system-managed identity. The extension downloads applicable machine configuration
assignments and the corresponding dependencies. The identity is used to authenticate the machine as
it reads and writes to the machine configuration service. The extension isn't required for
Arc-enabled servers because it's included in the Arc Connected Machine agent.

> [!IMPORTANT]
> The machine configuration extension and a managed identity are required to manage Azure virtual
> machines.

To deploy the extension at scale across many machines, assign the policy initiative
`Deploy prerequisites to enable Guest Configuration policies on virtual machines`
to a management group, subscription, or resource group containing the machines that you plan to
manage.

If you prefer to deploy the extension and managed identity to a single machine, see
[Configure managed identities for Azure resources on a VM using the Azure portal][14].

To use machine configuration packages that apply configurations, Azure VM guest configuration
extension version 1.26.24 or later is required.

> [!IMPORTANT]
> The creation of a managed identity or assignment of a policy with "Guest Configuration 
> Resource Contributor" role are actions that require appropriate Azure RBAC permissions to perform.
> To learn more about Azure Policy and Azure RBAC, see [role-based access control in Azure Policy][45].

### Limits set on the extension

To limit the extension from impacting applications running inside the machine, the machine
configuration agent isn't allowed to exceed more than 5% of CPU. This limitation exists for both
built-in and custom definitions. The same is true for the machine configuration service in Arc
Connected Machine agent.

### Validation tools

Inside the machine, the machine configuration agent uses local tools to perform tasks.

The following table shows a list of the local tools used on each supported operating system. For
built-in content, machine configuration handles loading these tools automatically.

| Operating system |                 Validation tool                 |                                                                         Notes                                                                          |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Windows          | [PowerShell Desired State Configuration][15]  | Side-loaded to a folder only used by Azure Policy. Doesn't conflict with Windows PowerShell DSC. PowerShell isn't added to system path.                |
| Linux            | [PowerShell Desired State Configuration][15]  | Side-loaded to a folder only used by Azure Policy. PowerShell isn't added to system path.                                                              |
| Linux            | [Chef InSpec][16]                               | Installs Chef InSpec version 2.2.61 in default location and adds it to system path. It installs InSpec's dependencies, including Ruby and Python, too. |

### Validation frequency

The machine configuration agent checks for new or changed guest assignments every 5 minutes. Once a
guest assignment is received, the settings for that configuration are rechecked on a 15-minute
interval. If multiple configurations are assigned, each is evaluated sequentially. Long-running
configurations affect the interval for all configurations, because the next can't run until the
prior configuration has finished.

Results are sent to the machine configuration service when the audit completes. When a policy
[evaluation trigger][17] occurs, the state of the machine is written to the machine configuration
resource provider. This update causes Azure Policy to evaluate the Azure Resource Manager
properties. An on-demand Azure Policy evaluation retrieves the latest value from the machine
configuration resource provider. However, it doesn't trigger a new activity within the machine. The
status is then written to Azure Resource Graph.

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
| SUSE      | SLES                       | 12 SP5, 15.x     |

\* Red Hat CoreOS isn't supported.

Machine configuration policy definitions support custom virtual machine images as long as they're
one of the operating systems in the previous table. Machine Configuration does not support VMSS 
uniform but does support [VMSS Flex][46].

## Network requirements

Azure virtual machines can use either their local virtual network adapter (vNIC) or Azure Private
Link to communicate with the machine configuration service.

Azure Arc-enabled machines connect using the on-premises network infrastructure to reach Azure
services and report compliance status.

The following table shows the supported endpoints for Azure and Azure Arc-enabled machines:

| **Region** | **Geography** | **URL** | **Storage endpoint**|
|---| ---| ---| ---|
| **EastAsia**  | Asia Pacific | agentserviceapi.guestconfiguration.azure.com</br>eastasia-gas.guestconfiguration.azure.com</br> ea-gas.guestconfiguration.azure.com | oaasguestconfigeas1.blob.core.windows.net</br> oaasguestconfigseas1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
| **SoutheastAsia** | Asia Pacific | agentserviceapi.guestconfiguration.azure.com</br>southeastasia-gas.guestconfiguration.azure.com</br> sea-gas.guestconfiguration.azure.com | oaasguestconfigeas1.blob.core.windows.net</br> oaasguestconfigseas1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
| **AustraliaEast** | Australia | agentserviceapi.guestconfiguration.azure.com</br>australiaeast-gas.guestconfiguration.azure.com</br> ae-gas.guestconfiguration.azure.com | oaasguestconfigases1.blob.core.windows.net</br> oaasguestconfigaes1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
| **AustraliaSoutheast** | Australia | agentserviceapi.guestconfiguration.azure.com</br>australiaeast-gas.guestconfiguration.azure.com</br> ae-gas.guestconfiguration.azure.com | oaasguestconfigases1.blob.core.windows.net</br> oaasguestconfigaes1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**BrazilSouth**| Brazil | agentserviceapi.guestconfiguration.azure.com</br>brazilsouth-gas.guestconfiguration.azure.com</br> brs-gas.guestconfiguration.azure.com | oaasguestconfigbrss1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**CanadaCentral**| Canada | agentserviceapi.guestconfiguration.azure.com</br>canadacentral-gas.guestconfiguration.azure.com</br> cc-gas.guestconfiguration.azure.com | oaasguestconfigccs1.blob.core.windows.net</br> oaasguestconfigces1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**CanadaEast**| Canada | agentserviceapi.guestconfiguration.azure.com</br>canadaeast-gas.guestconfiguration.azure.com</br> ce-gas.guestconfiguration.azure.com | oaasguestconfigccs1.blob.core.windows.net</br> oaasguestconfigces1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**ChinaEast2**| China | agentserviceapi.guestconfiguration.azure.cn</br>chinaeast2-gas.guestconfiguration.azure.cn</br> chne2-gas.guestconfiguration.azure.cn | oaasguestconfigchne2s2.blob.core.chinacloudapi.cn |
|**ChinaNorth**| China | agentserviceapi.guestconfiguration.azure.cn</br>chinanorth-gas.guestconfiguration.azure.cn</br> chnn-gas.guestconfiguration.azure.cn | oaasguestconfigchnns2.blob.core.chinacloudapi.cn |
|**ChinaNorth2**| China | agentserviceapi.guestconfiguration.azure.cn</br>chinanorth2-gas.guestconfiguration.azure.cn</br> chnn2-gas.guestconfiguration.azure.cn | oaasguestconfigchnn2s2.blob.core.chinacloudapi.cn |
|**ChinaNorth3**| China | agentserviceapi.guestconfiguration.azure.cn</br>chinanorth3-gas.guestconfiguration.azure.cn</br> chnn3-gas.guestconfiguration.azure.cn | oaasguestconfigchnn3s1.blob.core.chinacloudapi.cn |
|**NorthEurope**| Europe | agentserviceapi.guestconfiguration.azure.com</br>northeurope-gas.guestconfiguration.azure.com</br> ne-gas.guestconfiguration.azure.com | oaasguestconfignes1.blob.core.windows.net</br> oaasguestconfigwes1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**WestEurope**| Europe | agentserviceapi.guestconfiguration.azure.com</br>westeurope-gas.guestconfiguration.azure.com</br> we-gas.guestconfiguration.azure.com | oaasguestconfignes1.blob.core.windows.net</br> oaasguestconfigwes1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**FranceCentral**| France | agentserviceapi.guestconfiguration.azure.com</br>francecentral-gas.guestconfiguration.azure.com</br> fc-gas.guestconfiguration.azure.com | oaasguestconfigfcs1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**GermanyNorth** | Germany | agentserviceapi.guestconfiguration.azure.com</br>germanynorth-gas.guestconfiguration.azure.com</br> gen-gas.guestconfiguration.azure.com | oaasguestconfiggens1.blob.core.windows.net</br> oaasguestconfiggewcs1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**GermanyWestCentral** | Germany | agentserviceapi.guestconfiguration.azure.com</br>germanywestcentral-gas.guestconfiguration.azure.com</br> gewc-gas.guestconfiguration.azure.com | oaasguestconfiggens1.blob.core.windows.net</br> oaasguestconfiggewcs1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**CentralIndia**| India | agentserviceapi.guestconfiguration.azure.com</br>centralindia-gas.guestconfiguration.azure.com</br> cid-gas.guestconfiguration.azure.com | oaasguestconfigcids1.blob.core.windows.net</br> oaasguestconfigsids1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SouthIndia**| India | agentserviceapi.guestconfiguration.azure.com</br>southindia-gas.guestconfiguration.azure.com</br> sid-gas.guestconfiguration.azure.com | oaasguestconfigcids1.blob.core.windows.net</br> oaasguestconfigsids1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**IsraelCentral**| Israel | agentserviceapi.guestconfiguration.azure.com</br>israelcentral-gas.guestconfiguration.azure.com</br> ilc-gas.guestconfiguration.azure.com | oaasguestconfigilcs1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**ItalyNorth**| Italy | agentserviceapi.guestconfiguration.azure.com</br>italynorth-gas.guestconfiguration.azure.com</br> itn-gas.guestconfiguration.azure.com | oaasguestconfigitns1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**JapanEast**| Japan | agentserviceapi.guestconfiguration.azure.com</br>japaneast-gas.guestconfiguration.azure.com</br> jpe-gas.guestconfiguration.azure.com | oaasguestconfigjpws1.blob.core.windows.net</br> oaasguestconfigjpes1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**JapanWest**| Japan | agentserviceapi.guestconfiguration.azure.com</br>japanwest-gas.guestconfiguration.azure.com</br> jpw-gas.guestconfiguration.azure.com | oaasguestconfigjpws1.blob.core.windows.net</br> oaasguestconfigjpes1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**KoreaCentral**| Korea | agentserviceapi.guestconfiguration.azure.com</br>koreacentral-gas.guestconfiguration.azure.com</br> kc-gas.guestconfiguration.azure.com | oaasguestconfigkcs1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**MexicoCentral**| Mexico | agentserviceapi.guestconfiguration.azure.com</br>mexicocentral-gas.guestconfiguration.azure.com</br> mxc-gas.guestconfiguration.azure.com | oaasguestconfigmxcs1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**NorwayEast**| Norway | agentserviceapi.guestconfiguration.azure.com</br>norwayeast-gas.guestconfiguration.azure.com</br> noe-gas.guestconfiguration.azure.com | oaasguestconfignoes2.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**PolandCentral**| Poland | agentserviceapi.guestconfiguration.azure.com</br>polandcentral-gas.guestconfiguration.azure.com</br> plc-gas.guestconfiguration.azure.com | oaasguestconfigwcuss1.blob.core.windows.net |
|**QatarCentral**| Qatar | agentserviceapi.guestconfiguration.azure.com</br>qatarcentral-gas.guestconfiguration.azure.com</br> qac-gas.guestconfiguration.azure.com | oaasguestconfigqacs1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SouthAfricaNorth** | SouthAfrica | agentserviceapi.guestconfiguration.azure.com</br>southafricanorth-gas.guestconfiguration.azure.com</br> san-gas.guestconfiguration.azure.com | oaasguestconfigsans1.blob.core.windows.net</br> oaasguestconfigsaws1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SouthAfricaWest** | SouthAfrica | agentserviceapi.guestconfiguration.azure.com</br>southafricawest-gas.guestconfiguration.azure.com</br> saw-gas.guestconfiguration.azure.com | oaasguestconfigsans1.blob.core.windows.net</br> oaasguestconfigsaws1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SpainCentral**| Spain | agentserviceapi.guestconfiguration.azure.com</br>spaincentral-gas.guestconfiguration.azure.com</br> spc-gas.guestconfiguration.azure.com | oaasguestconfigspcs1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SwedenCentral**| Sweden | agentserviceapi.guestconfiguration.azure.com</br>swedencentral-gas.guestconfiguration.azure.com</br> swc-gas.guestconfiguration.azure.com | oaasguestconfigswcs1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SwitzerlandNorth**| Switzerland | agentserviceapi.guestconfiguration.azure.com</br>switzerlandnorth-gas.guestconfiguration.azure.com</br> stzn-gas.guestconfiguration.azure.com | oaasguestconfigstzns1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SwitzerlandWest**| Switzerland | agentserviceapi.guestconfiguration.azure.com</br>switzerlandwest-gas.guestconfiguration.azure.com</br> stzw-gas.guestconfiguration.azure.com | oaasguestconfigstzns1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**TaiwanNorth**| Taiwan | agentserviceapi.guestconfiguration.azure.com</br>taiwannorth-gas.guestconfiguration.azure.com</br> twn-gas.guestconfiguration.azure.com | oaasguestconfigtwns1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**UAENorth**| United Arab Emirates| agentserviceapi.guestconfiguration.azure.com</br>uaenorth-gas.guestconfiguration.azure.com</br> uaen-gas.guestconfiguration.azure.com | oaasguestconfiguaens1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**UKSouth**| United Kingdom | agentserviceapi.guestconfiguration.azure.com</br>uksouth-gas.guestconfiguration.azure.com</br> uks-gas.guestconfiguration.azure.com | oaasguestconfigukss1.blob.core.windows.net</br> oaasguestconfigukws1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**UKWest**| United Kingdom | agentserviceapi.guestconfiguration.azure.com</br>ukwest-gas.guestconfiguration.azure.com</br> ukw-gas.guestconfiguration.azure.com | oaasguestconfigukss1.blob.core.windows.net</br> oaasguestconfigukws1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**EastUS**| US | agentserviceapi.guestconfiguration.azure.com</br>eastus-gas.guestconfiguration.azure.com</br> eus-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**EastUS2**| US | agentserviceapi.guestconfiguration.azure.com</br>eastus2-gas.guestconfiguration.azure.com</br> eus2-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**WestUS**| US | agentserviceapi.guestconfiguration.azure.com</br>westus-gas.guestconfiguration.azure.com</br> wus-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**WestUS2**| US | agentserviceapi.guestconfiguration.azure.com</br>westus2-gas.guestconfiguration.azure.com</br> wus2-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**WestUS3**| US | agentserviceapi.guestconfiguration.azure.com</br>westus3-gas.guestconfiguration.azure.com</br> wus3-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**CentralUS**| US | agentserviceapi.guestconfiguration.azure.com</br>centralus-gas.guestconfiguration.azure.com</br> cus-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**NorthCentralUS**| US | agentserviceapi.guestconfiguration.azure.com</br>northcentralus-gas.guestconfiguration.azure.com</br> ncus-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SouthCentralUS**| US | agentserviceapi.guestconfiguration.azure.com</br>southcentralus-gas.guestconfiguration.azure.com</br> scus-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**WestCentralUS**| US | agentserviceapi.guestconfiguration.azure.com</br>westcentralus-gas.guestconfiguration.azure.com</br> wcus-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**USGovArizona** | US Gov | agentserviceapi.guestconfiguration.azure.us</br>usgovarizona-gas.guestconfiguration.azure.us</br> usga-gas.guestconfiguration.azure.us | oaasguestconfigusgas1.blob.core.usgovcloudapi.net |
|**USGovTexas** | US Gov | agentserviceapi.guestconfiguration.azure.us</br>usgovtexas-gas.guestconfiguration.azure.us</br> usgt-gas.guestconfiguration.azure.us | oaasguestconfigusgts1.blob.core.usgovcloudapi.net |
|**USGovVirginia** | US Gov | agentserviceapi.guestconfiguration.azure.us</br>usgovvirginia-gas.guestconfiguration.azure.us</br> usgv-gas.guestconfiguration.azure.us | oaasguestconfigusgvs1.blob.core.usgovcloudapi.net |



### Communicate over virtual networks in Azure

To communicate with the machine configuration resource provider in Azure, machines require outbound
access to Azure datacenters on port `443`*. If a network in Azure doesn't allow outbound traffic,
configure exceptions with [Network Security Group][18] rules. The [service tags][19]
`AzureArcInfrastructure` and `Storage` can be used to reference the guest configuration and Storage
services rather than manually maintaining the [list of IP ranges][20] for Azure datacenters. Both
tags are required because Azure Storage hosts the machine configuration content packages.

### Communicate over Private Link in Azure

Virtual machines can use [private link][21] for communication to the machine configuration service.
Apply tag with the name `EnablePrivateNetworkGC` and value `TRUE` to enable this feature. The tag
can be applied before or after machine configuration policy definitions are applied to the machine.

> [!IMPORTANT]
> To communicate over private link for custom packages, the link to the location of the
> package must be added to the list of allowed URLs.

Traffic is routed using the Azure [virtual public IP address][22] to establish a secure,
authenticated channel with Azure platform resources.

### Communicate over public endpoints outside of Azure

Servers located on-premises or in other clouds can be managed with machine configuration
by connecting them to [Azure Arc][01].

For Azure Arc-enabled servers, allow traffic using the following patterns:

- Port: Only TCP 443 required for outbound internet access
- Global URL: `*.guestconfiguration.azure.com`

See the [Azure Arc-enabled servers network requirements][23] for a full list of all network
endpoints required by the Azure Connected Machine Agent for core Azure Arc and machine
configuration scenarios.

### Communicate over Private Link outside of Azure

When you use [private link with Arc-enabled servers][24], built-in policy packages are
automatically downloaded over the private link. You don't need to set any tags on the Arc-enabled
server to enable this feature.

## Assigning policies to machines outside of Azure

The Audit policy definitions available for machine configuration include the
**Microsoft.HybridCompute/machines** resource type. Any machines onboarded to
[Azure Arc-enabled servers][01] that are in the scope of the policy assignment are automatically
included.

## Managed identity requirements

Policy definitions in the initiative
`Deploy prerequisites to enable guest configuration policies on virtual machines` enable a
system-assigned managed identity, if one doesn't exist. There are two policy definitions in the
initiative that manage identity creation. The `if` conditions in the policy definitions ensure the
correct behavior based on the current state of the machine resource in Azure.

> [!IMPORTANT]
> These definitions create a System-Assigned managed identity on the target resources, in addition
> to existing User-Assigned Identities (if any). For existing applications unless they specify the
> User-Assigned identity in the request, the machine will default to using System-Assigned Identity
> instead. [Learn More][25]

If the machine doesn't currently have any managed identities, the effective policy is:
[Add system-assigned managed identity to enable Guest Configuration assignments on virtual machines with no identities][26]

If the machine currently has a user-assigned system identity, the effective policy is:
[Add system-assigned managed identity to enable Guest Configuration assignments on VMs with a user-assigned identity][27]

## Availability

Customers designing a highly available solution should consider the redundancy planning
requirements for [virtual machines][28] because guest assignments are extensions of machine
resources in Azure. When guest assignment resources are provisioned into an Azure region that's
[paired][29], you can view guest assignment reports if at least one region in the pair is
available. When the Azure region isn't paired and it becomes unavailable, you can't access reports
for a guest assignment. When the region is restored, you can access the reports again.

It's best practice to assign the same policy definitions with the same parameters to all machines
in the solution for highly available applications. This is especially true for scenarios where
virtual machines are provisioned in [Availability Sets][30] behind a load balancer solution. A
single policy assignment spanning all machines has the least administrative overhead.

For machines protected by [Azure Site Recovery][31], ensure that the machines in the primary and
secondary site are within scope of Azure Policy assignments for the same definitions. Use the same
parameter values for both sites.

## Data residency

Machine configuration stores and processes customer data. By default, customer data is replicated
to the [paired region.][29] For the regions Singapore, Brazil South, and East Asia, all customer
data is stored and processed in the region.

## Troubleshooting machine configuration

For more information about troubleshooting machine configuration, see
[Azure Policy troubleshooting][32].

### Multiple assignments

At this time, only some built-in machine configuration policy definitions support multiple
assignments. However, all custom policies support multiple assignments by default if you used the
latest version of [the GuestConfiguration PowerShell module][33] to create machine configuration
packages and policies.

Following is the list of built-in machine configuration policy definitions that support multiple
assignments:

| ID                                                                                        | DisplayName                                                                                                 |
|--------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| /providers/Microsoft.Authorization/policyDefinitions/5fe81c49-16b6-4870-9cee-45d13bf902ce | Local authentication methods should be disabled on Windows Servers                                          |
| /providers/Microsoft.Authorization/policyDefinitions/fad40cac-a972-4db0-b204-f1b15cced89a | Local authentication methods should be disabled on Linux machines                                           |
| /providers/Microsoft.Authorization/policyDefinitions/f40c7c00-b4e3-4068-a315-5fe81347a904 | [Preview]: Add user-assigned managed identity to enable Guest Configuration assignments on virtual machines |
| /providers/Microsoft.Authorization/policyDefinitions/63594bb8-43bb-4bf0-bbf8-c67e5c28cb65 | [Preview]: Linux machines should meet STIG compliance requirement for Azure compute                         |
| /providers/Microsoft.Authorization/policyDefinitions/50c52fc9-cb21-4d99-9031-d6a0c613361c | [Preview]: Windows machines should meet STIG compliance requirements for Azure compute                      |
| /providers/Microsoft.Authorization/policyDefinitions/e79ffbda-ff85-465d-ab8e-7e58a557660f | [Preview]: Linux machines with OMI installed should have version 1.6.8-1 or later                           |
| /providers/Microsoft.Authorization/policyDefinitions/934345e1-4dfb-4c70-90d7-41990dc9608b | Audit Windows machines that do not contain the specified certificates in Trusted Root                       |
| /providers/Microsoft.Authorization/policyDefinitions/08a2f2d2-94b2-4a7b-aa3b-bb3f523ee6fd | Audit Windows machines on which the DSC configuration is not compliant                                      |
| /providers/Microsoft.Authorization/policyDefinitions/c648fbbb-591c-4acd-b465-ce9b176ca173 | Audit Windows machines that do not have the specified Windows PowerShell execution policy                   |
| /providers/Microsoft.Authorization/policyDefinitions/3e4e2bd5-15a2-4628-b3e1-58977e9793f3 | Audit Windows machines that do not have the specified Windows PowerShell modules installed                  |
| /providers/Microsoft.Authorization/policyDefinitions/58c460e9-7573-4bb2-9676-339c2f2486bb | Audit Windows machines on which Windows Serial Console is not enabled                                       |
| /providers/Microsoft.Authorization/policyDefinitions/e6ebf138-3d71-4935-a13b-9c7fdddd94df | Audit Windows machines on which the specified services are not installed and 'Running'                      |
| /providers/Microsoft.Authorization/policyDefinitions/c633f6a2-7f8b-4d9e-9456-02f0f04f5505 | Audit Windows machines that are not set to the specified time zone                                          |

> [!NOTE]
> Please check this page periodically for updates to the list of built-in machine configuration
> policy definitions that support multiple assignments.

### Assignments to Azure management groups

Azure Policy definitions in the category `Guest Configuration` can be assigned to management groups
when the effect is `AuditIfNotExists` or `DeployIfNotExists`.

> [!IMPORTANT]
> When [policy exemptions][47] are created on a Machine Confgiguration policy, the associated guest assignment will need to be deleted in order to stop the agent from scanning.

### Client log files

The machine configuration extension writes log files to the following locations:

Windows

- Azure VM: `C:\ProgramData\GuestConfig\gc_agent_logs\gc_agent.log`
- Arc-enabled server: `C:\ProgramData\GuestConfig\arc_policy_logs\gc_agent.log`

Linux

- Azure VM: `/var/lib/GuestConfig/gc_agent_logs/gc_agent.log`
- Arc-enabled server: `/var/lib/GuestConfig/arc_policy_logs/gc_agent.log`

### Collecting logs remotely

The first step in troubleshooting machine configurations or modules should be to use the cmdlets
following the steps in [How to test machine configuration package artifacts][34]. If that isn't
successful, collecting client logs can help diagnose issues.

#### Windows

Capture information from log files using [Azure VM Run Command][35], the following example
PowerShell script can be helpful.

```powershell
$linesToIncludeBeforeMatch = 0
$linesToIncludeAfterMatch  = 10
$params = @{
    Path = 'C:\ProgramData\GuestConfig\gc_agent_logs\gc_agent.log'
    Pattern = @(
        'DSCEngine'
        'DSCManagedEngine'
    )
    CaseSensitive = $true
    Context = @(
        $linesToIncludeBeforeMatch
        $linesToIncludeAfterMatch
    )
}
Select-String @params | Select-Object -Last 10
```

#### Linux

Capture information from log files using [Azure VM Run Command][36], the following example Bash
script can be helpful.

```bash
LINES_TO_INCLUDE_BEFORE_MATCH=0
LINES_TO_INCLUDE_AFTER_MATCH=10
LOGPATH=/var/lib/GuestConfig/gc_agent_logs/gc_agent.log
egrep -B $LINES_TO_INCLUDE_BEFORE_MATCH -A $LINES_TO_INCLUDE_AFTER_MATCH 'DSCEngine|DSCManagedEngine' $LOGPATH | tail
```

### Agent files

The machine configuration agent downloads content packages to a machine and extracts the contents.
To verify what content has been downloaded and stored, view the folder locations in the following
list.

- Windows: `C:\ProgramData\guestconfig\configuration`
- Linux: `/var/lib/GuestConfig/Configuration`


### Open-source nxtools module functionality

A new open-source [nxtools module][37] has been released to help make managing Linux systems easier
for PowerShell users.

The module helps in managing common tasks such as:

- Managing users and groups
- Performing file system operations
- Managing services
- Performing archive operations
- Managing packages

The module includes class-based DSC resources for Linux and built-in machine configuration
packages.

To provide feedback about this functionality, open an issue on the documentation. We currently
_don't_ accept PRs for this project, and support is best effort.

## Machine configuration samples

Machine configuration built-in policy samples are available in the following locations:

- [Built-in policy definitions - Guest Configuration][38]
- [Built-in initiatives - Guest Configuration][39]
- [Azure Policy samples GitHub repository][40]
- [Sample DSC resource modules][41]

## Next steps

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
[03]: ./concepts/assignments.md#manually-creating-machine-configuration-assignments
[04]: /azure/automanage
[05]: ./concepts/assignments.md
[06]: ../policy/assign-policy-portal.md
[07]: ../policy/how-to/determine-non-compliance.md
[08]: https://youtu.be/t9L8COY-BkM
[09]: /azure/azure-resource-manager/management/resource-providers-and-types#azure-portal
[10]: /azure/azure-resource-manager/management/resource-providers-and-types#azure-powershell
[11]: /azure/azure-resource-manager/management/resource-providers-and-types#azure-cli
[12]: /azure/virtual-machines/extensions/overview
[14]: /entra/identity/managed-identities-azure-resources/qs-configure-portal-windows-vm
[15]: /powershell/dsc/overview
[16]: https://www.chef.io/inspec/
[17]: ../policy/how-to/get-compliance-data.md#evaluation-triggers
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
[32]: ../policy/troubleshoot/general.md
[33]: ./how-to/develop-custom-package/overview.md
[34]: ./how-to/develop-custom-package/3-test-package.md
[35]: /azure/virtual-machines/windows/run-command
[36]: /azure/virtual-machines/linux/run-command
[37]: https://github.com/azure/nxtools#getting-started
[38]: ../policy/samples/built-in-policies.md#guest-configuration
[39]: ../policy/samples/built-in-initiatives.md#guest-configuration
[40]: https://github.com/Azure/azure-policy/tree/master/built-in-policies/policySetDefinitions/Guest%20Configuration
[41]: https://github.com/Azure/azure-policy/tree/master/samples/GuestConfiguration/package-samples/resource-modules
[42]: ./how-to/develop-custom-package/overview.md
[43]: ./how-to/create-policy-definition.md
[44]: ../policy/how-to/determine-non-compliance.md#compliance-details-for-guest-configuration
[45]: ../policy/overview.md
[46]: /azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes#scale-sets-with-flexible-orchestration
[47]: ../policy/concepts/exemption-structure.md
