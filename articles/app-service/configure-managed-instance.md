---
title: "Configure Managed Instance on Azure App Service"
description: Learn how to configure and deploy a Managed Instance on Azure App Service using Azure CLI and ARM templates. This guide covers general settings, storage mounts, registry keys, and Bastion access.
author: msangapu-msft
ms.author: msangapu
ms.date: 08/18/2026
ms.service: azure-app-service
ms.topic: how-to
keywords:
  - app service
  - azure app service
  - scale
  - scalable
  - scalability
  - app service plan
  - app service cost
  - managed instance
  - azure cli
  - arm templates
  - windows server
  - configuration script
  - bastion access
  - rdp
  - custom tooling
---

# Configure Managed Instance on Azure App Service

Managed Instance on Azure App Service is a plan‑scoped hosting option for Windows web apps that need operating system (OS) customization, optional private networking, and secure integration with Azure services.

- Managed identity
- Configuration (install) scripts
- Storage mounts
- Registry keys
- Remote Desktop Protocol (RDP) access

[!INCLUDE [managed-instance](./includes/managed-instance/availability-note.md)]

## Add a Managed identity (to the App Service plan)

Plan-level managed identities enable authentication for infrastructure operations that occur at the platform layer, such as configuration (install) scripts accessing Azure Storage during startup, and Key Vault access for storage mounts and registry key adapters.

Managed identities for the App Service plan are required in the following scenarios:

- To securely access and retrieve your configuration script from Azure Storage.
- Access Key Vaults to supply credentials and values for Storage Mounts and Registry Key Adapters.

See [manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-azure-portal#create-a-user-assigned-managed-identity) to create a managed identity.

To add a Managed Identity to Managed Instance plan:
1. Go to your Managed Instance in the Azure portal.
1. Select **Identity** > **User assigned**.
1. Select **+ Add**.
1. Select the **subscription** and **managed identity**.
1. Select **Add** to add the identity to the plan.

## Add configuration (install) scripts

Configuration (install) scripts aren't mandatory. Use a script when your app requires dependencies to be installed or operating system-level features to be configured.

Configuration (install) scripts run at instance startup to apply persistent customization. Examples include, Component Object Model (COM) registration, Microsoft/Windows Installers (MSI) installs, and enabling Windows roles/features. Use configuration scripts for changes that must persist across instance restarts. Use RDP for diagnostics, not for persistent configuration.

You need the following to use configuration (install) scripts:

- A managed identity assigned to the App Service plan
- A storage account with a Blob container holding the configuration (install) script package (zip).
- A single zip file whose root contains `Install.ps1` (entry point)
- `Storage Blob Data Reader` role on the storage account, container, or resource group

To add a configuration script:

1. Go to your Managed Instance App Service plan in the Azure portal.
1. Select **Configuration** > **General Settings**.
1. In the _Configuration script_ section, begin by configuring your script.

   | Setting | Value |
   | --- | --- |
   | Storage Account | Select your storage account |
   | Container | Enter the name of your container |
   | Zip file | Enter the name of the zip file |
   | Value | Verify this value is correct |

1. Select Apply to save the changes.

### Configuration script best practices

- Make scripts idempotent (check before install).
- Guard destructive operations (avoid modifying protected Windows system directories).
- Stagger heavy installations to reduce startup latency.

Example minimal zip structure:

```
Install.ps1
myInstallerfileNameGoesHere.msi
config.xml
```

Example configuration script:

```powershell
# Install Components, for example Crystal Reports, Control Library, Database Driver
$ComponentInstaller = "myInstallerFileNameGoesHere.msi"
try {
    $Component = Join-Path $PSScriptRoot $ComponentInstaller
    Start-Process $Component -ArgumentList "/q" -Wait -ErrorAction Stop
} catch {
    Write-Error "Failed to install ${ComponentInstaller}: $_"
    exit 1
}
```

## Configure storage mounts

Storage mounts provide persistent external storage, such as Azure Files, that your app can access. Use storage mounts for legacy code that needs shared filesystem access. Don't use storage mounts for secrets; use Key Vault instead. Local storage is temporary, but Azure Files and custom UNC mounts persist across restarts.

You need the following to configure storage mounts:
- Managed identity (for Key Vault access)
- Key Vault secret (credential source)

To configure storage mounts:

1. Go to your Managed Instance in the Azure portal.
1. Select **Configuration** > **Mounts**.
1. Select **+ New storage mount**.

Provide the following details to configure the storage mount:

| Setting | Value |
| --- | --- |
| Name | Enter a mount name |
| Storage type | Azure files, Custom, or Local (temporary storage) |
| Storage account | Select or enter a storage account |
| File share | Select a file share |
| Value | Select a Key vault |
| Secret | Select the key vault secret |
| Mount drive letter | Select drive letter path |

You can mount external storage to your Managed Instance. Mounted storage is persistent across restarts and accessible from your app's file system.

### Configure storage mounts with Azure Files

To configure an Azure Files storage mount:

1. Create an Azure Storage Account and an Azure Files share.
1. Store a connection credential in Key Vault as a secret.
   Supported secret contents: (Ex: `DefaultEndpointsProtocol=...;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net`)
1. Add the mount in Managed Instance (Azure portal or ARM/Bicep/Terraform).

> [!TIP]  
> Enforce share-level permissions via Azure RBAC + share ACLs for enhanced security.
>

### Configure storage mounts with custom UNC

Use mounts for SMB shares hosted elsewhere (on-premises, VM, or non-Microsoft). Ensure network connectivity (virtual network integration / private endpoints / firewalls).

1. If credentials are needed, store them in a Key Vault secret in the format: `username=<user>,password=<password>`
   - Avoid domain admin accounts; use a least‑privilege service identity.
1. Add the mount in Managed Instance.

## Configure registry keys

Some applications depend on values read from the Windows Registry. With a Registry Key adapter, you can create registry keys and use secrets from Azure Key Vault as the value.

You need the following to configure registry keys:
- Managed identity (for Key Vault access)
- Key Vault secret (credential source)

To configure registry keys:
1. Go to **Configuration** > **Registry Keys**.
1. Select **+ Add**.

   | Setting | Value |
   | --- | --- |
   | Path | Enter the registry path |
   | Vault | Enter an existing vault name |
   | Secret | Select or enter the key vault secret |
   | Type | String or DWORD |

1. Select **Add** to add the registry key.

> [!CAUTION]  
> Be cautious when modifying system-critical registry paths. Incorrect changes can affect instance stability.
>
## Configure RDP (Bastion) access

[Quickstart: Deploy Azure Bastion automatically](../bastion/quickstart-host-portal.md) lets you securely connect to your VM instances through Remote Desktop Protocol (RDP). RDP via Azure Bastion is intended for diagnostics and troubleshooting. Use configuration scripts for persistent changes.

You need the following resources for Bastion/RDP access:

- Managed Instance must be [virtual network integrated](configure-vnet-integration-enable.md)
- Azure Bastion host on the target virtual network
- Port 3389 must be allowed from the Bastion subnet NSG to the App Service Plan subnet NSG

To configure Bastion:

1. Go to **Configuration** > **Bastion/RDP**.
1. Verify the **Virtual Network** is connected.
1. Select **Allow Remote Desktop (via Bastion)**.

> [!CAUTION]  
> Don't apply manual installers or configuration changes solely through RDP. Changes are lost on recycle or create configuration drift.
>
## Frequently Asked Questions (FAQ)

- [What operating system (OS) is running on Managed Instance on Azure App Service?](#what-operating-system-os-is-running-on-managed-instance-on-azure-app-service)
- [Can I enable more Windows roles and features?](#can-i-enable-more-windows-roles-and-features)
- [Does Managed Instance on Azure App Service receive regular platform and application stack updates?](#does-managed-instance-on-azure-app-service-receive-regular-platform-and-application-stack-updates)
- [Which programming languages are installed on Managed Instance on Azure App Service?](#which-programming-languages-are-installed-on-managed-instance-on-azure-app-service)
- [What are limitations on the configuration (install) scripts?](#what-are-limitations-on-the-configuration-install-scripts)
- [At what permission level is a configuration (install) script executed?](#at-what-permission-level-is-a-configuration-install-script-executed)
- [What role permissions does an operator have when connecting to an instance using Bastion?](#what-role-permissions-does-an-operator-have-when-connecting-to-an-instance-using-bastion)
- [How do I troubleshoot failures with my configuration (install) script or registry/storage adapters?](#how-do-i-troubleshoot-failures-with-my-configuration-install-script-or-registrystorage-adapters)
- [What is the addressable memory of a Managed Instance on Azure App Service worker instance?](#what-is-the-addressable-memory-of-a-managed-instance-on-azure-app-service-worker-instance)
- [Which Azure Storage service should I use to upload a configuration (install) script?](#which-azure-storage-service-should-i-use-to-upload-a-configuration-install-script)
- [Is there a restriction on naming and format for the configuration (install) script?](#is-there-a-restriction-on-naming-and-format-for-the-configuration-install-script)
- [Is there a size limit for the dependencies that I can upload as part of the zip file?](#is-there-a-size-limit-for-the-dependencies-that-i-can-upload-as-part-of-the-zip-file)
- [Does adding or editing Managed Instance on App Service plan adapters restart the plan instances?](#does-adding-or-editing-managed-instance-on-app-service-plan-adapters-restart-the-plan-instances)
- [My Managed Instance plan has multiple instances can I restart a single instance?](#my-managed-instance-plan-has-multiple-instances-can-i-restart-a-single-instance)
- [My Managed Instance on App Service plan has multiple web applications can I restart a single web application?](#my-managed-instance-on-app-service-plan-has-multiple-web-applications-can-i-restart-a-single-web-application)
- [Can I assign Managed Identity to my web application within the Managed Instance on App Service plan?](#can-i-assign-managed-identity-to-my-web-application-within-the-managed-instance-on-app-service-plan)
- [Is there a limitation on number of adapters that I can create for Managed Instance on App Service plan?](#is-there-a-limitation-on-number-of-adapters-that-i-can-create-for-managed-instance-on-app-service-plan)

### What operating system (os) is running on Managed Instance on Azure App Service?

Windows Server 2022.

### Can I enable more Windows roles and features?

Yes, through a configuration script. However, you can't configure features that are [removed from a future release of Windows Server](/windows-server/get-started/removed-deprecated-features-windows-server?tabs=ws25).

### Does Managed Instance on Azure App Service receive regular platform and application stack updates?

Yes, instances receive routine platform updates and maintenance. The service also regularly updates preinstalled application stacks. You're responsible for maintaining any components you install through configuration scripts.



### Which programming languages are installed on Managed Instance on Azure App Service?

The service includes Microsoft .NET Framework 3.5, 4.8, and Microsoft .NET 8.0. If you need other runtimes, install them by using a configuration script. Azure App Service doesn't maintain extra runtimes as part of the platform.

### What are limitations on the configuration (install) scripts?

### What are the limitations on the configuration (install) scripts?
Configuration (install) scripts can install dependencies, enable roles and features, and customize the operating system. However, the service doesn't support destructive operations (for example, deleting `Windows\\System32`) because they can affect instance stability.


### At what permission level is a configuration (install) script executed?

Configuration (install) scripts are executed with **Administrator** permissions to allow installation and configuration of system-level components.

### What role permissions does an operator have when connecting to an instance using Bastion?

Operators connecting via Bastion have **Administrator** privileges during the session.

### How do I troubleshoot failures with my configuration (install) script or registry/storage adapters?

Operators connecting by using Bastion have **Administrator** privileges during the session. You can find adapter logs in the root of the machine, or they're logged into App Service Platform Logs.

Adapter logs can be found in the root of the machine, alternatively they're logged into App Service Platform Logs.

### What is the addressable memory of a Managed Instance on Azure App Service worker instance?

The addressable memory of a Managed Instance on Azure App Service worker instance varies depending on the pricing plan you choose. The following table lists the addressable memory for the Managed Instance worker instance.


| Pricing plan | Cores | Memory (MB) |
| --- | --- | --- |
| P0v4 | 1 | 2048 |
| P1v4 | 2 | 5952 |
| P2v4 | 4 | 13440 |
| P3v4 | 8 | 28672 |
| P1Mv4 | 2 | 13440 |
| P2Mv4 | 4 | 28672 |
| P3Mv4 | 8 | 60160 |
| P4Mv4 | 16 | 121088 |
| P5Mv4 | 32 | 246016 |

### Which Azure Storage service should I use to upload a configuration (install) script?

Use Azure Storage blob service for uploading the script and required dependencies.

### Is there a restriction on naming and format for the configuration (install) script?

Yes, the script must be named `Install.ps1`. Only PowerShell is supported. Ensure to upload configuration (install) script and dependencies as a single .zip file.

### Is there a size limit for the dependencies that I can upload as part of the zip file?

No size limit is enforced. Remember that the overall size of dependencies impacts the instance provisioning time.

### Does adding or editing Managed Instance on App Service plan adapters restart the plan instances?

Yes, adding or editing Managed Instance plan adapters (configuration script, storage, or registry) restarts the underlying instances and affects all web apps deployed to the plan. Instance restarts are required to apply configuration changes.

### My Managed Instance plan has multiple instances can I restart a single instance?

Yes, browse to the Managed Instance and select Instances in the left menu. Then select restart next to the instance name.

### My Managed Instance on App Service plan has multiple web applications can I restart a single web application?

Yes, browse to the app's **Overview** page and select **Restart**.

### Can I assign Managed Identity to my web application within the Managed Instance on App Service plan?

Yes, you can assign a _different_ Managed identity to a web application within the Managed Instance. Follow the [Managed Identity guidance](overview-managed-identity.md?tabs=portal%2Chttp)

### Is there a limitation on number of adapters that I can create for Managed Instance on App Service plan?

### Is there a limitation on the number of adapters that I can create for Managed Instance on App Service plan?
No, there's no limit on the number of storage or registry adapters. You can only create a single configuration (install) script adapter for Managed Instance on App Service plan. Increasing the number of adapters might increase instance provisioning time.


## Related content

- [Overview of Managed Instance on Azure App Service](overview-managed-instance.md)
- [Deploy Managed Instance on Azure App Service](quickstart-managed-instance.md)
- [App Service overview](overview.md)
