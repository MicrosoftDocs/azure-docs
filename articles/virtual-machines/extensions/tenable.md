---
title: Tenable One-Click Nessus Extension for Azure VMs  
description: Deploy the Tenable One-Click Nessus Agent to a virtual machine using the Tenable One-Click Nessus VM Extension.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
author: GabstaMSFT
ms.date: 07/18/2023
---
# Tenable One-Click Nessus Agent

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

Tenable now supports a One-Click deployment of Nessus Agents via Microsoft's Azure portal. This solution provides an easy way to install the latest version of Nessus Agent on Azure virtual machines (VM) (whether Linux or Windows) by either clicking on an icon within the Azure portal or by writing a few lines of PowerShell script. 

## Prerequisites

* A Tenable Vulnerability Management (Tenable.io), or Nessus Manager, account.

* A Microsoft Azure account with one (or more) Windows or Linux VMs.

### Supported Platforms

Azure VM running any of the following:

* CentOS 7 (x86_64)

* Debian 11 (x86_64)

* Oracle Linux 7 and 8 (x86_64)

* Red Hat ES 7, 8 and 9 (x86_64)

* Rocky Linux 9 (x86_64)

* Ubuntu 18.04, 20.04 and 22.04 (x86_64)

* Red Hat ES 8 and 9 (ARM64)

* Windows 10 and 11 (x86_64)

* Windows Server 2012 and 2012 R2 (x86_64)

* Windows Server 2016, 2019 and 2022 (x86_64) 

## Deploy with the Tenable User Interface (UI)

1. Select one of your VMs.

2. In the left column click **Extensions + applications**.

3. Click **+ Add**.

4. In the gallery, scroll down to **N** (for Nessus Agent) or type **nessus** in the search bar.

5. Select the **Nessus Agent** tile and click **Next**.

6. Enter configuration parameters in the Tenable user interface.

7. Click **Review + create**.


## Deploy From Command-line

There is also a command-line interface available through PowerShell.

For example, you can type:

```PS> $publisherName="Tenable.NessusAgent"
PS> $typeName="Linux" (or $typeName="Windows")
PS> $name = $publisherName + "." + $typeName
PS> $version="1.0"
PS> $Settings = @{"nessusManagerApp" = "IO"; "nessusAgentName" = "NA_name1"; "nessusAgentGroup" = "GROUP1"}
PS> $ProtectedSettings = @{"nessusLinkingKey" = "abcd1234vxyz5678abcd1234vxyz5678abcd1234vxyz5678abcd1234vxyz5678"}
PS> Set-AzVMExtension -ResourceGroupName "EXAMPLE-resource-group" -Location "East US 2" -VMName "canary-example" -Name $name -Publisher $publisherName -ExtensionType $typeName -TypeHandlerVersion $version -Settings $Settings -ProtectedSettings $ProtectedSettings
```

Lines 1-4 identify the One-Click agent extension.

Lines 5-6 in the PowerShell example are equivalent to Step 6 in the UI procedure. This is where the user enters their configuration parameters for their Nessus Agent install.


### Nessus Linking Key

The most important field is the Nessus Linking Key (**nessusLinkingKey**, required). It is always required. This document explains where to find it: [Retrieve the Tenable Nessus Agent Linking Key (Tenable Nessus Agent 10.4)](https://docs.tenable.com/nessus/Content/RetrieveLinkingKey.htm). In the PowerShell interface, specify nessusLinkingKey under `-ProtectedSettings` so that it will be encrypted by Azure. All other fields are passed unencrypted through -Settings.

You can choose whether to link with Nessus Manager or Tenable.io. In the command-line interface, this is done by setting `nessusManagerApp` (**nessusManagerApp**, required) to `cloud`, or to `local`. Those are the only two choices.

If you choose Nessus Manager, you must provide the Nessus Manager host (**nessusManagerHost**) and port number (**nessusManagerPort**). The extension accepts an IP address or fully qualified domain name.

If you choose Tenable.io, then there is an optional field called **tenableIoNetwork**.

The Agent Name (**nessusAgentName**, optional) and Agent Group (**nessusAgentGroup**, optional) (actually “groups”, a comma-delimited list of group names) are always optional.

Parameter names:

```"nessusLinkingKey"
   "nessusManagerApp" 
   "nessusManagerHost"  
   "nessusManagerPort"
   "tenableIoNetwork"
   "nessusAgentName"   
   "nessusAgentGroup"  
```
Parameter descriptions:

"nessusLinkingKey" is called "--key" in this doc

"nessusManagerApp" is unique to our VM extension

"nessusManagerHost" equals "--host"

"nessusManagerPort" equals "--port"

"tenableIoNetwork" is "--network"

"nessusAgentName" is "--name"

"nessusAgentGroup" is "--groups"

For more definitions of these parameters, see [Nessuscli Agent](https://docs.tenable.com/nessus/Content/NessusCLIAgent.htm).


### Support

If you need more help at any point in this article, you can contact the Azure experts on the MSDN Azure and Stack Overflow forums. Alternatively, you can file an Azure support incident. Go to the Azure support site and select Get support. For information about using Azure Support, read the Microsoft Azure support FAQ. If you experience issues with the extension, contact Tenable support.
