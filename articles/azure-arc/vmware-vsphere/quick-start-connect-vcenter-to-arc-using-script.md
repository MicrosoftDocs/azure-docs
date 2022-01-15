---
title: Connect your VMware vCenter to Azure Arc using the helper script
description: In this quickstart, you'll learn how to use the helper script to connect your VMware vCenter to Azure Arc.
ms.topic: quickstart 
ms.custom: references_regions
ms.date: 11/10/2021

# Customer intent: As a VI admin, I want to connect my vCenter to Azure to enable self-service through Arc.
---

# Quickstart: Connect your VMware vCenter to Azure Arc using the helper script

Before using the Azure Arc-enabled VMware vSphere features, you'll need to connect your VMware vCenter Server to Azure Arc. This quickstart shows you how to connect your VMware vCenter Server to Azure Arc using a helper script.

First, the script deploys a lightweight Azure Arc appliance, called [Azure Arc resource bridge](../resource-bridge/overview.md) (preview), as a virtual machine running in your vCenter environment. Then, it installs a VMware cluster extension to provide a continuous connection between your vCenter Server and Azure Arc.

> [!IMPORTANT]
> In the interest of ensuring new features are documented no later than their release, this page may include documentation for features that may not yet be publicly available.

## Prerequisites

### Azure

- An Azure subscription.

- A resource group in the subscription where you are a member of the *Owner/Contributor* role.

### vCenter Server

- vCenter Server running version 6.5 or later.

- Allow inbound connections on TCP port 443 so that the Arc resource bridge and VMware cluster extension can communicate with the vCenter server.  

   >[!NOTE]
   >In this release, only the default port of 443 is supported. If you use a different port, the resource bridge (preview) VM creation fails.  

- A resource pool with a minimum capacity of 16 GB of RAM, four vCPUs.

- A datastore with a minimum of 100 GB of free disk space available through the resource pool.

- An external virtual network/switch and internet access, directly or through a proxy.

### vSphere accounts

A vSphere account that can read all inventory, deploy, and update VMs to all the resource pools (or clusters), networks, and virtual machine templates that you want to use with Azure Arc. This account is used for the ongoing operation of Azure Arc-enabled VMware vSphere and the Azure Arc resource bridge (preview) VM deployment.

>[!NOTE]
>If you are using the Azure VMware solution, this account would be the `cloudadmin` account.  

### Workstation

A Windows or Linux machine that can access both your vCenter Server and internet, directly or through proxy.

## Prepare vCenter Server

1. Create a resource pool with a reservation of at least 16 GB of RAM and four vCPUs. It should also have at least 100 GB of disk space.

1. Ensure the vSphere accounts have the appropriate permissions.

## Run the script

 Refer to the table for the script parameters:

| **Parameter** | **Details** |
| --- | --- |
| **Subscription** | Azure subscription name or ID where you'll create the Azure resources. |
| **ResourceGroup** | Resource group where you'll create the Azure Arc resources. |
| **AzLocation** | Azure location ([region](overview.md#supported-regions)) where the resource metadata would be stored.  |
| **ApplianceName** | You can provide the Azure Arc resource bridge (preview) a name of your choice, for example, *contoso-nyc-appliance*. |
| **CustomLocationName** | Name for the custom location in Azure. |
| **VcenterName** | Name for the vCenter Server in Azure, which is the name your teams see when deploying their VMs through Azure Arc. </br> Use the name of the data center or its physical location, for example, *contoso-nyc-dc*. |

### Windows

1. Open a PowerShell console and navigate to the folder where you want to keep the setup files.

2. Download the script by running the following command.

   ```powershell
   Invoke-WebRequest https://arcvmwaredl.blob.core.windows.net/arc-appliance/arcvmware-setup.ps1 -OutFile arcvmware-setup.ps1

   ```

3. Run the following command to allow the script to run as an unsigned script. If you close the session before completing all the steps, rerun this in a new session.

    ```powershell
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    ```

4. Execute the script by providing the parameters `Subscription`, `ResourceGroup`, `AzLocation`, `ApplianceName`, `CustomLocationName`, and `VcenterName` (refer to the table [above](#run-the-script) to understand the parameters).

     ```powershell
     ./arcvmware-setup.ps1 -Subscription <Subscription> -ResourceGroup <ResourceGroup> -AzLocation <AzLocation> -ApplianceName <ApplianceName> -CustomLocationName <CustomLocationName> -VcenterName <VcenterName>
     ```

### Linux

1. Open a terminal and navigate to the folder where you want to keep the setup files.

2. Run the following command to download the onboarding script.

   ```bash
   wget https://arcvmwaredl.blob.core.windows.net/arc-appliance/arcvmware-setup.sh
   ```

3. Update the script with the parameters `ResourceGroup`,`AzLocation`, `ApplianceName`, `CustomerLocationName`, and `VcenterName` (refer to the table [above](#run-the-script) to understand the parameters).

4. Run the following command to execute the script.

    ```bash
    sudo bash arcvmware-setup.sh 
    ```

## Script runtime

Script execution can take up to 30 minutes to complete. You're prompted to provide values for several parameters and you can refer to the following table for detailed information.

| Requirement | Description |
| --- | --- |
| **Azure login** | You're prompted to sign into Azure by visiting the [device login](https://www.microsoft.com/devicelogin) site and then pasting the prompted code. |
| **vCenter FQDN/Address** | Fully qualified domain name (FQDN) for vCenter Server (or an IP address). For example, *10.160.0.1* or *nyc-vcenter.contoso.com*. |
| **vCenter Username** | Username for the vSphere account. For more information, see [vSphere accounts](#vsphere-accounts) above. |
| **vCenter password** | Password for the vSphere account. |
| **Data center selection** | Select the name of the data center (as shown in vSphere client) where the Azure Arc resource bridge (preview) VM should be deployed. |
| **Network selection** | Select the name of the virtual network or segment to which VM must be connected. This network should allow the appliance to talk to the vCenter Server and the Azure endpoints (or internet). |
| **Static IP / DHCP** | If you have a DHCP server on your network and want to use it, type **y** and then populate the following: <ul><li><b>Static IP address prefix</b>: Network address in CIDR notation, for example, 192.168.0.0/24.</li><li><b>Static gateway</b>: For example, 192.168.0.0.</li><li><b>DNS servers</b>: Comma-separated list of DNS servers.</li><li><b>Start range IP</b>: Minimum size of two available addresses is required for upgrade scenarios. Provide the start IP of that range.</li><li><b>End range IP</b>: Last IP of the IP range requested in the previous field.</li><li><b>VLAN ID</b> (optional)</li></ul> |
| **Resource pool** | Select the name of the resource pool to which the Azure Arc resource bridge (preview) VM would be deployed. |
| **Data store** | Select the name of the datastore to be used for the Azure Arc resource bridge (preview) VM. |
| **Folder** | Select the name of the vSphere folder where the Azure Arc resource bridge (preview) VM should be deployed. |
| **Vm template Name** | Provide a name for the VM template that is created in your vCenter based on the downloaded OVA. For example,  `arc-appliance-template`. |
| **Control Pane IP** | Provide a reserved IP address. A reserved IP address in your DHCP range or a static IP outside of DHCP range, but still available on the network. This IP address shouldn't be assigned to any other machine on the network. |
| **Appliance proxy settings** | If you have a proxy in your appliance network, type **y** and then populate the following: <ul><li><b>Http</b>: Address of HTTP proxy server.</li><li><b>NoProxy</b>: addresses to be excluded from proxy.</li><li><b>CertificateFilePath</b>: for SSL-based proxies, path to certificate to be used.</li></ul> |

Once the command execution completes, you can [try out the capabilities](browse-and-enable-vcenter-resources-in-azure.md) of Azure Arc- enabled VMware vSphere.

### Retry command - Windows

If the appliance creation fails and you need to retry it. Run the command with `-Force` to clean up the previous deployment and onboard again.

```powershell
./arcvmware-setup.ps1 -Force -Subscription <Subscription> -ResourceGroup <ResourceGroup> -AzLocation <AzLocation> -ApplianceName <ApplianceName> -CustomLocationName <CustomLocationName> -VcenterName <VcenterName>
```

### Retry command - Linux

If the appliance creation fails and you need to retry it, run the command with `--force` to clean up the previous deployment and onboard again.

```bash
sudo bash arcvmware-setup.sh --force
```

## Next steps

- [Browse and enable VMware vCenter resources in Azure](browse-and-enable-vcenter-resources-in-azure.md)
