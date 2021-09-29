---
title: Connect your VMware vCenter to Azure Arc using the helper script
description: In this quickstart, you'll learn how to use the helper script to connect your VMware vCenter to Azure Arc.
ms.topic: quickstart 
ms.custom: references_regions
ms.date: 09/28/2021

# Customer intent: As a VI admin, I want to connect my vCenter to Azure to enable self-service through Arc.
---

# Quickstart: Connect your VMware vCenter to Azure Arc using the helper script

Before using the Azure Arc-enabled VMware vSphere features, you'll need to connect your VMware vCenter to Azure Arc. This quickstart shows you how to connect your VMware vCenter to Azure Arc using a helper script. First, the script deploys a lightweight Azure Arc appliance, called Azure Arc resource bridge, as a virtual machine running in your vCenter environment. Then, it installs a VMware cluster extension to provide a continuous connection between your vCenter server and Azure Arc.

## Prerequisites

### Azure

- An Azure subscription. 

- A resource group in the above subscription where you have the *Owner/Contributor* role.


### vCenter Server

- vCenter Server running version 6.5 or later.

- Inbound connections allowed on TCP port 443 so that the Arc resource bridge and VMware cluster extension can communicate with the vCenter server.  

   >[!NOTE]
   >As of today, only the default port of 443 is supported. If you use a different port, the appliance VM creation fails.  

- A resource pool with a minimum capacity of 16 GB of RAM, four vCPUs. 

- A datastore with a minimum of 100 GB of free disk space available through the resource pool.

- An external virtual network/switch and internet access, directly or through a proxy.


### vSphere accounts

A vSphere account that can read all inventory, deploy, and update VMs to all the resource pools (or clusters), networks, and virtual machine templates that you want to use with Azure Arc.  This account is used for the ongoing operation of Azure Arc enabled VMware vSphere and the Arc Resource bridge VM deployment.

>[!NOTE]
>If you are using Azure VMware solution, this account would be the `cloudadmin` account.  

### Workstation 

A Windows or Linux machine that can access both your vCenter server and internet, directly or through proxy.


## Prepare vCenter Server

1. Create a resource pool with a reservation of at least 8 GB of RAM and four vCPUs. It should also have at least 100 GB of disk space.

1. Ensure the vSphere accounts have the appropriate permissions.



## Run the script 

 Refer to the table for the script parameters:

| **Parameter** | **Details** | 
| --- | --- |
| **Subscription** | Azure subscription name or ID where you'll create the Azure resources. |
| **ResourceGroup** | Resource group where you'll create the Arc resources. |
| **AzLocation** | Azure location ([region](overview.md#supported-regions)) where the resource metadata would be stored.  |
| **ApplianceName** | You can provide the Arc resource bridge a name of your choice, for example, *contoso-nyc-appliance*. |
| **CustomLocationName** | Name for the custom location in Azure. |
| **VcenterName** | Name for the vCenter in Azure, which is the name your teams see when deploying their VMs through Arc. </br> Name it for the data center or physical location of your data center, for example, *contoso-nyc-dc*. |
 
### Windows

1. Open PowerShell and navigate to the folder where you want to keep the setup files.

2. Download the script.

   ```powershell-interactive
   Invoke-WebRequest https://arcvmwaredl.blob.core.windows.net/arc-appliance/arcvmware-setup.ps1 -OutFile arcvmware-setup.ps1

   ```

3.  Allow the script to run as an unsigned script. If you close the session before completing all the steps, rerun this for a new session.

    ```powershell-interactive
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    ```

3. Execute the script by providing the parameters (refer to the table [above](#run-the-script) to know about the parameters).

     ```powershell-interactive
     ./arcvmware-setup.ps1 -Subscription <Subscription> -ResourceGroup <ResourceGroup> -AzLocation <AzLocation> -ApplianceName <ApplianceName> -CustomLocationName <CustomLocationName> -VcenterName <VcenterName>
     ```

### Linux

Follow the below instructions to run the script on a Linux machine:

1. Open a terminal and navigate to the folder where you want to keep the setup files. 

2. Download the onboarding script.

   ```bash
   wget https://arcvmwaredl.blob.core.windows.net/arc-appliance/arcvmware-setup.sh
   ```

3. Update the script with the following [parameters](#run-the-script):

   - ResourceGroup

   - AzLocation

   - ApplianceName

   - CustomerLocationName

   - VcenterName

4. Execute the script.

    ```bash
    bash arcvmware-setup.sh 
    ```

## Script Runtime
The script execution may take up to 30 minutes to complete and you'll be prompted for the various details. Refer to the table below for information.

| Requirements | Details |
| --- | --- |
| **Azure login** | You'll sign into Azure by visiting the [device login](https://www.microsoft.com/devicelogin) site and then pasting the prompted code. |
| **vCenter FQDN/Address** | FQDN for the vCenter (or an IP address), for example, *10.160.0.1* or *nyc-vcenter.contoso.com*. |
| **vCenter Username** | Username for the vSphere account. For more information, see [vSphere accounts](#vsphere-accounts) above. |
| **vCenter password** | Password for the vSphere account. |
| **Data center selection** | Select the name of the data center (as shown in vSphere client) where the Arc resource bridge VM should be deployed. |
| **Network selection** | Select the name of the virtual network or segment to which VM must be connected. This network should allow the appliance to talk to the vCenter server and the Azure endpoints (or internet). |
| **Static IP / DHCP** | If you have a DHCP server in your network and want to use it, type **y** and then populate the following: <ul><li><b>Static IP address prefix</b>: Network address in CIDR notation, for example, 192.168.0.0/24.</li><li><b>Static gateway</b>: For example, 192.168.0.0.</li><li><b>DNS servers</b>: Comma-separated list of DNS servers.</li><li><b>Start range IP</b>: Minimum size of two available addresses is required for upgrade scenarios. Provide the start IP of that range.</li><li><b>End range IP</b>: Last IP of the IP range requested in the previous field.</li><li><b>VLAN ID</b> (optional)</li></ul> |
| **Resource pool** | Select the name of the resource pool to which the Arc resource bridge VM would be deployed. |
| **Data store** | Select the name of the datastore to be used for Arc resource bridge VM. |
| **Folder** | Select the name of the vSphere folder where Arc resource bridge VM should be deployed. |
| **Vm template Name** | Provide a name for the VM template that will be created in your vCenter based on the downloaded OVA. For example,  arc-appliance-template. |
| **Control Pane IP** | Provide a reserved IP address. A reserved IP address in your DHCP range or a static IP outside of DHCP range but still available on the network. The key thing is this IP address shouldn't be assigned to any other machine on the network. |
| **Appliance proxy settings** | If you have a proxy in your appliance network, type **y** and then populate the following: <ul><li><b>Http</b>: Address of HTTP proxy server.</li><li><b>NoProxy</b>: addresses to be excluded from proxy.</li><li><b>CertificateFilePath</b>: for SSL-based proxies, path to certificate to be used.</li></ul> |

Once the command execution completes, you can [try out the capabilities](browse-and-enable-vcenter-resources-in-azure.md) of Azure Arc enabled VMware vSphere. 

### Retry command - Windows

If the appliance creation fails and you need to retry it. Run the command with `-Force` would clean up and onboard again. 

```powershell-interactive
./arcvmware-setup.ps1 -Force -Subscription <Subscription> -ResourceGroup <ResourceGroup> -AzLocation <AzLocation> -ApplianceName <ApplianceName> -CustomLocationName <CustomLocationName> -VcenterName <VcenterName>
```

### Retry command - Linux

If the appliance creation fails and you need to retry it. Run the command with `--force` would clean up and onboard again. 

```bash
bash arcvmware-setup.sh --force
```

## Next Steps

- [Browse and enable VMware vCenter resources in Azure](browse-and-enable-vcenter-resources-in-azure.md)