---
title: Quick Start for Azure Arc-enabled System Center Virtual Machine Manager (preview)
description: In this QuickStart, you will learn how to use the helper script to connect your System Center Virtual Machine Manager management server to Azure Arc (preview).
author: jyothisuri
ms.author: jsuri
ms.topic: quickstart
ms.services: azure-arc
ms.subservice: azure-arc-scvmm
ms.date: 02/17/2023
ms.custom: references_regions
---

# QuickStart: Connect your System Center Virtual Machine Manager management server to Azure Arc (preview)

Before you can start using the Azure Arc-enabled SCVMM features, you need to connect your VMM management server to Azure Arc.

This QuickStart shows you how to connect your SCVMM management server to Azure Arc using a helper script. The script deploys a lightweight Azure Arc appliance (called Azure Arc resource bridge) as a virtual machine running in your VMM environment and installs an SCVMM cluster extension on it, to provide a continuous connection between your VMM management server and Azure Arc.

## Prerequisites

>[!Note]
>- If VMM server is running on Windows Server 2016 machine, ensure that [Open SSH package](https://github.com/PowerShell/Win32-OpenSSH/releases) is installed. 
>- If you deploy an older version of appliance (version lesser than 0.2.25), Arc operation fails with the error *Appliance cluster is not deployed with AAD authentication*. To fix this issue, download the latest version of the onboarding script and deploy the resource bridge again.

| **Requirement** | **Details** |
| --- | --- |
| **Azure** | An Azure subscription  <br/><br/> A resource group in the above subscription where you have the *Owner/Contributor* role. |
| **SCVMM** | You need an SCVMM management server running version 2016 or later.<br/><br/> A private cloud with minimum free capacity of 16 GB of RAM, 4 vCPUs with 100 GB of free disk space. <br/><br/> A VM network with internet access, directly or through proxy. Appliance VM will be deployed using this VM network.<br/><br/> For dynamic IP allocation to appliance VM, DHCP server is required. For static IP allocation, VMM static IP pool is required. |
| **SCVMM accounts** | An SCVMM admin account that can perform all administrative actions on all objects that VMM manages. <br/><br/> The user should be part of local administrator account in the SCVMM server. <br/><br/>This will be used for the ongoing operation of Azure Arc-enabled SCVMM as well as the deployment of the Arc Resource bridge VM. |
| **Workstation** | The workstation will be used to run the helper script.<br/><br/> A Windows/Linux machine that can access both your SCVMM management server and internet, directly or through proxy.<br/><br/> The helper script can be run directly from the VMM server machine as well.<br/><br/> To avoid network latency issues, we recommend executing the helper script directly in the VMM server machine.<br/><br/> Note that when you execute the script from a Linux machine, the deployment takes a bit longer and you may experience performance issues. |

## Prepare SCVMM management server

-	Create an SCVMM private cloud if you don't have one. The private cloud should have a reservation of at least 16 GB of RAM and 4 vCPUs. It should also have at least 100 GB of disk space.
-	Ensure that SCVMM administrator account has the appropriate permissions.

## Download the onboarding script

1. Go to [Azure portal](https://aka.ms/SCVMM/MgmtServers).
1. Search and select **Azure Arc**.
1. In the **Overview** page, select **Add** in **Add your infrastructure for free** or move to the **infrastructure** tab.

    :::image type="content" source="media/quick-start-connect-scvmm-to-azure/overview-add-infrastructure-inline.png" alt-text="Screenshot of how to select Add your infrastructure for free." lightbox="media/quick-start-connect-scvmm-to-azure/overview-add-infrastructure-expanded.png":::

1. In the **Platform** section, in **System Center VMM** select **Add**.

    :::image type="content" source="media/quick-start-connect-scvmm-to-azure/platform-add-system-center-vmm-inline.png" alt-text="Screenshot of how to select System Center V M M platform." lightbox="media/quick-start-connect-scvmm-to-azure/platform-add-system-center-vmm-expanded.png":::

1. Select **Create new resource bridge** and select **Next**.
1. Provide a name for **Azure Arc resource bridge**. For example: *contoso-nyc-resourcebridge*.
1. Select a subscription and resource group where you want to create the resource bridge.
1. Under **Region**, select an Azure location where you want to store the resource metadata. The currently supported regions are **East US** and **West Europe**.
1. Provide a name for **Custom location**.
   This is the name that you'll see when you deploy virtual machines. Name it for the datacenter or the physical location of your datacenter. For example: *contoso-nyc-dc.*

1. Leave the option **Use the same subscription and resource group as your resource bridge** selected.
1. Provide a name for your **SCVMM management server instance** in Azure. For example: *contoso-nyc-scvmm.*
1. Select **Next: Download and run script**.
1. If your subscription isn't registered with all the required resource providers, select **Register** to proceed to next step.
1. Based on the operating system of your workstation, download the PowerShell or Bash script and copy it to the workstation.
1. To see the status of your onboarding after you run the script on your workstation, select **Next:Verification**. The onboarding isn't affected when you close this page.

### Windows

Follow these instructions to run the script on a Windows machine.

1. Open a new PowerShell window and verify if Azure CLI is successfully installed in the workstation, use the following command:
    ```azurepowershell-interactive
    az
    ```
1. Navigate to the folder where you've downloaded the PowerShell script:
   *cd C:\Users\ContosoUser\Downloads*

1. Run the following command to allow the script to run since it's an unsigned script (if you close the session before you complete all the steps, run this command again for the new session):
    ```azurepowershell-interactive
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    ```
1. Run the script:
    ```azurepowershell-interactive
    ./resource-bridge-onboarding-script.ps1
    ```
### Linux

Follow these instructions to run the script on a Linux machine:

1. Open the terminal and navigate to the folder, where you've downloaded the Bash script.
2. Execute the script using the following command:

    ```sh
    bash resource-bridge-onboarding-script.sh
    ```

## Script runtime
The script execution will take up to half an hour and you'll be prompted for various details. See the following table for related information:

| **Parameter** | **Details** |
| --- | --- |
| **Azure login** | You would be asked to log in to Azure by visiting [this site](https://www.microsoft.com/devicelogin) and pasting the prompted code. |
| **SCVMM management server FQDN/Address** | FQDN for the VMM server (or an IP address). </br> Provide role name if it’s a Highly Available VMM deployment. </br> For example: nyc-scvmm.contoso.com or 10.160.0.1 |
| **SCVMM Username**</br> (domain\username) | Username for the SCVMM administrator account. The required permissions for the account are listed in the prerequisites above.</br> Example: contoso\contosouser |
| **SCVMM password** | Password for the SCVMM admin account |
| **Private cloud selection** | Select the name of the private cloud where the Arc resource bridge VM should be deployed. |
| **Virtual Network selection** | Select the name of the virtual network to which *Arc resource bridge VM* needs to be connected. This network should allow the appliance to talk to the VMM management server and the Azure endpoints (or internet). |
| **Static IP pool** | Select the VMM static IP pool that will be used to allot IP address. |
| **Control Pane IP** | Provide a reserved IP address (a reserved IP address in your DHCP range or a static IP outside of DHCP range but still available on the network). The key thing is this IP address shouldn't be assigned to any other machine on the network. |
| **Appliance proxy settings** | Type ‘Y’ if there's a proxy in your appliance network, else type ‘N’.|
| **http** | Address of the HTTP proxy server. |
| **https** | Address of the HTTPS proxy server.|
| **NoProxy** | Addresses to be excluded from proxy.|
|**CertificateFilePath** | For SSL based proxies, provide the path to the certificate. |

Once the command execution is completed, your setup is complete, and you can try out the capabilities of Azure Arc- enabled SCVMM.

### Retry command - Windows

If for any reason, the appliance creation fails, you need to retry it. Run the command with ```-Force``` to clean up and onboard again.

```powershell-interactive
 ./resource-bridge-onboarding-script.ps1-Force -Subscription <Subscription> -ResourceGroup <ResourceGroup> -AzLocation <AzLocation> -ApplianceName <ApplianceName> -CustomLocationName <CustomLocationName> -VMMservername <VMMservername>
```

### Retry command - Linux

If for any reason, the appliance creation fails, you need to retry it. Run the command with ```--force``` to clean up and onboard again.

  ```sh
    bash resource-bridge-onboarding-script.sh --force
  ```
>[!NOTE]
> - After successful deployment, we recommend maintaining the state of **Arc Resource Bridge VM** as *online*.
> - Intermittently appliance might become unreachable when you shut down and restart the VM.
>- After successful deployment, save the config YAML files in a secure location. The config files are required to perform management operations on the resource bridge.   
> - After the execution of command, your setup is complete, and you can try out the capabilities of Azure Arc-enabled SCVMM. 


## Next steps

[Create a VM](create-virtual-machine.md)
