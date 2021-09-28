---
title: Connect your VMware vCenter to Azure Arc using the helper script
description: In this quickstart, you will learn how to use the helper script to connect your VMware vCenter to Azure Arc.
ms.topic: quickstart 
ms.custom: 
ms.date: 09/15/2021

# Customer intent: As a VI admin, I want to connect my vCenter to Azure so that I can enable self-service through Arc.
---

# Quickstart: Connect your VMware vCenter to Azure Arc using the helper script

Before you can start using the Azure Arc enabled VMware vSphere features, you need to connect your VMware vCenter to Azure Arc.

This quickstart shows you how to connect your VMware vCenter to Azure Arc using a helper script. The script deploys a lightweight Azure Arc appliance (called Azure Arc resource bridge) as a virtual machine running in your vCenter environment and install VMware cluster extension on it, to provide a continuous connection between your vCenter server and Azure Arc.

## Prerequisites

### Azure

- An Azure subscription. 

- A resource group in the above subscription where you have the *Owner/Contributor* role.


### vCenter Server

- vCenter Server running version 6.5 or later.

- Inbound connections allowed on TCP port 443, so that the Arc resource bridge and VMware cluster extension can communicate with the vCenter server.  

   >[!NOTE]
   >As of today, only the default port of 443 is supported. If you use a different port, Appliance VM creation fails.  

- A resource pool with minimum free capacity of 16 GB of RAM, 4 vCPUs. 

- A datastore with minimum 100 GB of free disk space that is available through the resource pool.

- An external virtual network/switch and internet access,directly or through proxy to which the appliance VM can be deployed.


### vSphere accounts

A vSphere account that can read all inventory, deploy and update VMs to all the resource pools (or clusters), networks and virtual machine templates that you want to use with Azure Arc.  This account is used for the ongoing operation of Azure Arc enabled VMware vSphere as well as the deployment of the Arc Resource bridge VM.

>[!NOTE]
>If you are using Azure VMware solution, this account would be the `cloudadmin` account.

### Workstation 

A Windows or Linux machine that can access both your vCenter server and internet, directly or through proxy.



## Prepare vCenter server

1. Create a resource pool if you don't have one. The resource pool should have a reservation of at least 8 GB of RAM and 4 vCPUs. It should also have at least 100 GB of disk space.

1. Ensure the vSphere accounts have the appropriate permissions.



## Run the script 

 Refer to the table for the script parameters:

| **Parameter** | **Details** | 
| --- | --- |
| **Subscription** | Azure subscription name or ID where the Azure resources must be created |
| **ResourceGroup** | Resource Group where Arc resources must be created |
| **AzLocation** | Azure location where the resource metadata would be stored. Currently supported regions are eastus and westeurope. |
| **ApplianceName** | You can provide the Arc resource bridge a name of your choice. Eg: contoso-nyc-appliance |
| **CustomLocationName** | Name for the custom location in Azure. |
| **VcenterName** | Name for the vCenter in Azure. </br> This will be the name your teams will see when they deploy their VMs through Arc. </br> Name it for the datacenter or physical location of your datacenter. Eg: contoso-nyc-dc |
 
### Windows

Follow the below instructions to run the script on a windows machine:

1. Open a PowerShell window and navigate to the folder where you want to keep the setup files.

2. Run the following command to download the script

   ```
   Invoke-WebRequest https://arcvmwaredl.blob.core.windows.net/arc-appliance/arcvmware-setup.ps1 -OutFile arcvmware-setup.ps1

   ```

3.	Execute the following command in Powershell to allow the script to run as it is an unsigned script (if you close the session before you complete all the steps, run this again for new session.)

    ``` powershell-interactive
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    ```

3. Execute the script by providing the parameters (refer to the table [above](#run-the-script) to know about the parameters).

     ``` powershell-interactive
     ./arcvmware-setup.ps1 -Subscription <Subscription> -ResourceGroup <ResourceGroup> -AzLocation <AzLocation> -ApplianceName <ApplianceName> -CustomLocationName <CustomLocationName> -VcenterName <VcenterName>
     ```

### Linux

Follow the below instructions to run the script on a Linux machine:

1. Open the terminal and navigate to the folder where you want to keep the setup files. 

2. Download the onboarding script by running the following command:

   ```
   wget https://arcvmwaredl.blob.core.windows.net/arc-appliance/arcvmware-setup.sh
   ```

3. Update the downloaded script with the following parameters (parameter details [here](#run-the-script)) - ResourceGroup, AzLocation, ApplianceName, CustomerLocationName, VcenterName

4. Execute the script using the following comamnd:

    ``` sh
    bash arcvmware-setup.sh 
    ```

## Script Runtime
The script execution will take up to half hour and you will be prompted for the various details. Refer to the table below for information on them:

| Requirements | Details |
| --- | --- |
| **Azure login** | You would be asked to login to Azure by visiting the [device login](https://www.microsoft.com/devicelogin) site and pasting the prompted code. |
| **vCenter FQDN/Address** | FQDN for the vCenter (or an ip address). </br> Eg: 10.160.0.1 or nyc-vcenter.contoso.com |
| **vCenter Username** | Username for the vSphere account. The required permissions for the account are listed in the prerequisites above. |
| **vCenter password** | Password for the vSphere account |
| **Data center selection** | Select the name of the datacenter (as shown in vSphere client) where the Arc resource bridge VM should be deployed |
| **Network selection** | Select the name of the virtual network or segment to which VM must be connected. This network should allow the appliance to talk to the vCenter server and the Azure endpoints (or internet). |
| **Static IP / DHCP** | If you have DHCP server in your network and want to use it, type ‘y’ else ‘n’. On choosing static IP configuration, you will be asked the following: <ul><li>Static IP address prefix : Network address in CIDR notation E.g. 192.168.0.0/24</li><li>Static gateway: Eg. 192.168.0.0</li><li>DNS servers: Comma separated list of DNS servers</li><li>Start range IP: Minimum size of 2 available addresses is required for upgrade scenarios. Provide the start IP of that range</li><li>End range IP: the last IP of the IP range requested in previous field.</li><li>VLAN ID (Optional)</li></ul> |
| **Resource pool** | Select the name of the resource pool to which the Arc resource bridge VM would be deployed |
| **Data store** | Select the name of the datastore to be used for Arc resource bridge VM |
| **Folder** | Select the name of the vSphere folder where Arc resource bridge VM should be deployed. |
| **Vm template Name** | Provide a name for the VM template that will be created in your vCenter based on the downloaded OVA. Eg: arc-appliance-template |
| **Control Pane IP** | Provide a reserved IP address (a reserved IP address in your DHCP range or a static IP outside of DHCP range but still available on the network). The key thing is this IP address shouldn't be assigned to any other machine on the network. |
| **Appliance proxy settings** | Type ‘y’ if there is proxy in your appliance network, else type ‘n’. </br> You need to populate the following when you have proxy setup: <ul><li>Http: Address of http proxy server</li><li>Http: Address of http proxy server</li><li>NoProxy: addresses to be excluded from proxy</li><li>CertificateFilePath: for ssl based proxies, path to certificate to be used</li></ul> |

Once the command execution completed, your setup is complete and you can try out the capabilities of Azure Arc enabled VMware vSphere. You can proceed to the [next steps](browse-and-enable-vcenter-resources-in-azure.md)

### Retry command - Windows

1. If for whatever reason, the appliance creation fails and you need to retry it. Running the command with `-Force` would cleanup and onboard again. 

   ``` powershell-interactive
   ./arcvmware-setup.ps1 -Force -Subscription <Subscription> -ResourceGroup <ResourceGroup> -AzLocation <AzLocation> -ApplianceName <ApplianceName> -CustomLocationName <CustomLocationName> -VcenterName <VcenterName>
   ```

### Retry command - Linux

1. If for whatever reason, the appliance creation fails and you need to retry it. Running the command with ```--force``` would cleanup and onboard again. 

    ```sh
    bash arcvmware-setup.sh --force
    ```

## Next Steps

- [Browse and enable VMware vCenter resources in Azure](browse-and-enable-vcenter-resources-in-azure.md)