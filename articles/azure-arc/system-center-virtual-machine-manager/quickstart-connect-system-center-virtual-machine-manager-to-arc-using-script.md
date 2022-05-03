---
title: Quick Start for Azure Arc enabled System Center Virtual Machine Manager
description: In this quickstart, you will learn how to use the helper script to connect your System Center Virtual Machine Manager management server to Azure Arc.
author: jyothisuri
ms.author: jsuri
ms.topic: quickstart
ms.date: 04/28/2022
ms.custom: references_regions
---

# QuickStart: Connect your System Center Virtual Machine Manager management server to Azure Arc using the helper script

Before you can start using the Azure Arc enabled SCVMM features, you need to connect your VMM management server to Azure Arc.

This QuickStart shows you how to connect your SCVMM management server to Azure Arc using a helper script. The script deploys a lightweight Azure Arc appliance (called Azure Arc resource bridge) as a virtual machine running in your VMM environment and install SCVMM cluster extension on it, to provide a continuous connection between your VMM management server and Azure Arc.

## Prerequisites

| **Requirement** | **Details** |
| --- | --- |
| **Azure** | An Azure subscription  <br/><br/> A resource group in the above subscription where you have the *Owner/Contributor* role. |
| **SCVMM** | You need a SCVMM management Server running version 2016 or later.<br/><br/> A private cloud that has at least one cluster with minimum free capacity of 16 GB of RAM, 4 vCPUs with 100 GB of free disk space. <br/><br/> A VM network with internet access, directly or through proxy. Appliance VM will be deployed using this VM network.<br/><br/> For dynamic IP allocation to appliance VM, DHCP server is required. For static IP allocation, VMM static IP pool is required. |
| **SCVMM accounts** | A SCVMM admin account that can perform all administrative actions on all objects that VMM manages. <br/><br/> This will be used for the ongoing operation of Azure Arc enabled SCVMM as well as the deployment of the Arc Resource bridge VM. |
| **Workstation** | The workstation will be used to run the helper script.<br/><br/> A Windows/Linux machine that can access both your SCVMM management server and internet, directly or through proxy.<br/><br/> The helper script can be run directly from the VMM server machine as well.<br/><br/> [!Note] When you execute the script from a Linux machine, the deployment takes a bit longer and you may experience performance issues. |

## Prepare SCVMM management server

-	Create a SCVMM private cloud if you don't have one. The private cloud should have a reservation of at least 16 GB of RAM and 4 vCPUs. It should also have at least 100 GB of disk space.
-	Ensure that SCVMM administrator account have the appropriate permissions.

## Run the script

 Refer to the table for the script parameters:

| **Parameter** | **Details** |
| --- | --- |
| **Subscription** | Azure subscription name or ID where the Azure resources must be created |
| **ResourceGroup** | Resource Group where Arc resources must be created |
| **AzLocation** | Azure location where the resource metadata would be stored. Currently supported regions are East US and West Europe. |
| **ApplianceName** | You can provide the Arc resource bridge a name of your choice. For example: contoso-nyc-appliance |
| **CustomLocationName** | Name for the custom location in Azure. |
| **VMMservername** | Name for the VMM management server in Azure.  </br> Name it for the datacenter or physical location of your datacenter. For example: contoso-nyc-dc |

### Windows

Follow the below instructions to run the script on a windows machine:

1. Open a PowerShell window and navigate to the folder where you want to keep the setup files.

2. Run the following command to download the script

   ```
   Invoke-WebRequest https://arcscvmm.blob.core.windows.net/scripts/arcvmm-setup.ps1 -OutFile arcvmm-setup.ps1

   ```

3.	Execute the following command in PowerShell to allow the script to run as it is an unsigned script (if you close the session before you complete all the steps, run this again for new session.)

    ``` powershell-interactive
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    ```

3. Execute the script by providing the parameters (refer to the table [above](#run-the-script) to know about the parameters).

     ``` powershell-interactive
     ./arcvmm-setup.ps1 -Subscription <Subscription> -ResourceGroup <ResourceGroup> -AzLocation <AzLocation> -ApplianceName <ApplianceName> -CustomLocationName <CustomLocationName> -VMMServername <VMMServername>
     ```

### Linux

Follow the below instructions to run the script on a Linux machine:

1. Open the terminal and navigate to the folder where you want to keep the setup files.

2. Download the onboarding script by running the following command:

   ```
   wget https://arcscvmm.blob.core.windows.net/scripts/arcvmm-setup.sh
   ```

3. Update the downloaded script with the following parameters (parameter details [here](#run-the-script)) - ResourceGroup, AzLocation, ApplianceName, CustomerLocationName, SCVMM management server.

4. Execute the script using the following command:

    ``` sh
    bash arcscvmm-setup.sh
    ```

## Script runtime
The script execution will take up to half an hour and you will be prompted for the various details. Refer to the table below for information on them:

| **Requirements** | **Details** |
| --- | --- |
| **Azure login** | You would be asked to login to Azure by visiting [this](https://www.microsoft.com/devicelogin) site and pasting the prompted code. |
| **SCVMM management server FQDN/Address** | FQDN for the VMM server (or an ip address). </br> For example: 10.160.0.1 or nyc-scvmm.contoso.com |
| **SCVMM Username** | Username for the SCVMM administrator account. The required permissions for the account are listed in the prerequisites above. |
| **SCVMM password** | Password for the SCVMM admin account |
| **SCVMM port** | The default is 8100 |
| **Private cloud selection** | Select the name of the private cloud where the Arc resource bridge VM should be deployed |
| **Network selection** | Select the name of the virtual network or segment to which VM must be connected. This network should allow the appliance to talk to the VMM management server and the Azure endpoints (or internet). |
| **Control Pane IP** | Provide a reserved IP address (a reserved IP address in your DHCP range or a static IP outside of DHCP range but still available on the network). The key thing is this IP address shouldn't be assigned to any other machine on the network. |
| **Appliance proxy settings** | Type ‘y’ if there is proxy in your appliance network, else type ‘n’. </br> You need to populate the following when you have proxy setup: </br> ```1. Http: Address of http proxy server ``` </br></br> ```2. NoProxy: addresses to be excluded from proxy ``` </br></br> ```3. CertificateFilePath: for ssl based proxies, path to certificate to be used ``` </br></br> Once the command execution completed, your setup is complete and you can try out the capabilities of Azure Arc enabled SCVMM. You can proceed to the [next steps.](Script to on-board a VMM resource to Arc enabled SCVMM.md) |

### Retry command - Windows

1. If for any reason, the appliance creation fails, and you need to retry it. Running the command with ```-Force``` would clean up and onboard again.

    ``` powershell-interactive
     ./resource-bridge-onboarding-script.ps1-Force -Subscription <Subscription> -ResourceGroup <ResourceGroup> -AzLocation <AzLocation> -ApplianceName <ApplianceName> -CustomLocationName <CustomLocationName> -VMMservername <VMMservername>
     ```

### Retry command - Linux

1. If for any reason, the appliance creation fails and you need to retry it. Running the command with ```--force``` would clean up and onboard again.

    ```sh
    bash resource-bridge-onboarding-script.sh --force
    ```

## Next steps

- [Script to onboard a VMM resource to Arc enabled System Center Virtual Machine Manager](script-to-onboard-virtual-machine-manager-resource.md)
