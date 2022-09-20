---
title: Connect VMware vCenter Server to Azure Arc by using the helper script
description: In this quickstart, you'll learn how to use the helper script to connect your VMware vCenter Server instance to Azure Arc.
ms.topic: quickstart 
ms.custom: references_regions
ms.date: 09/05/2022

# Customer intent: As a VI admin, I want to connect my vCenter Server instance to Azure to enable self-service through Azure Arc.
---

# Quickstart: Connect VMware vCenter Server to Azure Arc by using the helper script

To start using the Azure Arc-enabled VMware vSphere (preview) features, you need to connect your VMware vCenter Server instance to Azure Arc. This quickstart shows you how to connect your VMware vCenter Server instance to Azure Arc by using a helper script.

First, the script deploys a virtual appliance called [Azure Arc resource bridge (preview)](../resource-bridge/overview.md) in your vCenter environment. Then, it installs a VMware cluster extension to provide a continuous connection between vCenter Server and Azure Arc.

## Prerequisites

### Azure

- An Azure subscription.

- A resource group in the subscription where you're a member of the *Owner/Contributor* role.

### vCenter Server

- vCenter Server version 6.7 or 7.

- A virtual network that can provide internet access, directly or through a proxy. It must also be possible for VMs on this network to communicate with the vCenter server on TCP port (usually 443).

- At least one free IP address on the above network that isn't in the DHCP range. At least three free IP addresses if there's no DHCP server on the network.

- A resource pool or a cluster with a minimum capacity of 16 GB of RAM and four vCPUs.

- A datastore with a minimum of 100 GB of free disk space available through the resource pool or cluster.

> [!NOTE]
> Azure Arc-enabled VMware vSphere (preview) supports vCenter Server instances with a maximum of 9,500 virtual machines (VMs). If your vCenter Server instance has more than 9,500 VMs, we don't recommend that you use Azure Arc-enabled VMware vSphere with it at this point.

### vSphere account

You need a vSphere account that can:
- Read all inventory. 
- Deploy and update VMs to all the resource pools (or clusters), networks, and VM templates that you want to use with Azure Arc.

This account is used for the ongoing operation of Azure Arc-enabled VMware vSphere (preview) and the deployment of the Azure Arc resource bridge (preview) VM.

### Workstation

You need a Windows or Linux machine that can access both your vCenter Server instance and the internet, directly or through a proxy.

## Prepare vCenter Server

1. Create a resource pool with a reservation of at least 16 GB of RAM and four vCPUs. It should also have access to a datastore with at least 100 GB of free disk space.

2. Ensure that the vSphere accounts have the appropriate permissions.

## Download the onboarding script

1. Go to the Azure portal.

2. Search for **Azure Arc** and select it.

3. On the **Overview** page, select **Add** under **Add your infrastructure for free** or move to the **Infrastructure** tab.

4. In the **Platform** section, select **Add** under **VMware vCenter**.

    :::image type="content" source="media/add-vmware-vcenter.png" alt-text="Screenshot that shows how to add VMware vCenter through Azure Arc.":::

5. Select **Create a new resource bridge**, and then select **Next**.

6. Provide a name of your choice for the Azure Arc resource bridge. For example: **contoso-nyc-resourcebridge**.

7. Select a subscription and resource group where the resource bridge will be created.

8. Under **Region**, select an Azure location where the resource metadata will be stored. Currently, supported regions are **East US**, **West Europe**, **Australia East** and **Canada Central**.

9. Provide a name for **Custom location**. This is the name that you'll see when you deploy VMs. Name it for the datacenter or the physical location of your datacenter. For example: **contoso-nyc-dc**.

10. Leave **Use the same subscription and resource group as your resource bridge** selected.

11. Provide a name for your vCenter Server instance in Azure. For example: **contoso-nyc-vcenter**.

12. Select **Next: Download and run script**.

13. If your subscription is not registered with all the required resource providers, a **Register** button will appear. Select the button before you proceed to the next step.

    :::image type="content" source="media/register-arc-vmware-providers.png" alt-text="Screenshot that shows the button to register required resource providers during vCenter onboarding to Azure Arc.":::

14. Based on the operating system of your workstation, download the PowerShell or Bash script and copy it to the [workstation](#prerequisites).

15. If you want to see the status of your onboarding after you run the script on your workstation, select **Next: Verification**. Closing this page won't affect the onboarding.

## Run the script

Use the following instructions to run the script, depending on which operating system your machine is using.

### Windows

1. Open a PowerShell window as an Administrator and go to the folder where you've downloaded the PowerShell script.

    > [!NOTE]
    > On Windows workstations, the script must be run in PowerShell window and not in PowerShell Integrated Script Editor (ISE) as PowerShell ISE doesn't display the input prompts from Azure CLI commands. If the script is run on PowerShell ISE, it could appear as though the script is stuck while it is waiting for input. 

2. Run the following command to allow the script to run, because it's an unsigned script. (If you close the session before you complete all the steps, run this command again for the new session.)

    ``` powershell-interactive
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    ```

3. Run the script:

     ``` powershell-interactive
     ./resource-bridge-onboarding-script.ps1
     ```

### Linux

1. Open the terminal and go to the folder where you've downloaded the Bash script.

2. Run the script by using the following command:

    ``` sh
    bash resource-bridge-onboarding-script.sh
    ```

## Inputs for the script

A typical onboarding that uses the script takes 30 to 60 minutes. During the process, you're prompted for the following details:

| **Requirement** | **Details** |
| --- | --- |
| **Azure login** | When you're prompted, go to the [device sign-in page](https://www.microsoft.com/devicelogin), enter the authorization code shown in the terminal, and sign in to Azure. |
| **vCenter FQDN/Address** | Enter the fully qualified domain name for the vCenter Server instance (or an IP address). For example: **10.160.0.1** or **nyc-vcenter.contoso.com**. |
| **vCenter Username** | Enter the username for the vSphere account. The required permissions for the account are listed in the [prerequisites](#prerequisites). |
| **vCenter password** | Enter the password for the vSphere account. |
| **Data center selection** | Select the name of the datacenter (as shown in the vSphere client) where the Azure Arc resource bridge's VM should be deployed. |
| **Network selection** | Select the name of the virtual network or segment to which the VM must be connected. This network should allow the appliance to communicate with vCenter Server and the Azure endpoints (or internet). |
| **Static IP / DHCP** | If you have DHCP server in your network and want to use it, enter **y**. Otherwise, enter **n**. </br>When you choose a static IP configuration, you're asked for the following information: </br> 1. **Static IP address prefix**: Network address in CIDR notation. For example: **192.168.0.0/24**. </br> 2. **Static gateway**: Gateway address. For example: **192.168.0.0**. </br> 3. **DNS servers**: Comma-separated list of DNS servers. </br> 4. **Start range IP**: Minimum size of two available IP addresses is required. One IP address is for the VM, and the other is reserved for upgrade scenarios. Provide the starting IP address of that range. </br> 5. **End range IP**: Last IP address of the IP range requested in the previous field. </br> 6. **VLAN ID** (optional) |
| **Resource pool** | Select the name of the resource pool to which the Azure Arc resource bridge's VM will be deployed. |
| **Data store** | Select the name of the datastore to be used for the Azure Arc resource bridge's VM. |
| **Folder** | Select the name of the vSphere VM and the template folder where the Azure Arc resource bridge's VM will be deployed. |
| **VM template Name** | Provide a name for the VM template that will be created in your vCenter Server instance based on the downloaded OVA file. For example: **arc-appliance-template**. |
| **Control Pane IP** address | Provide a static IP address that's outside the DHCP range but still available on the network. Ensure that this IP address isn't assigned to any other machine on the network. Azure Arc resource bridge (preview) runs a Kubernetes cluster, and its control plane requires a static IP address.|
| **Appliance proxy settings** | Enter **y** if there's a proxy in your appliance network. Otherwise, enter **n**. </br> You need to populate the following boxes when you have a proxy set up: </br> 1. **Http**: Address of the HTTP proxy server. </br> 2. **Https**: Address of the HTTPS proxy server. </br> 3. **NoProxy**: Addresses to be excluded from the proxy. </br> 4. **CertificateFilePath**: For SSL-based proxies, the path to the certificate to be used.

After the command finishes running, your setup is complete. You can now use the capabilities of Azure Arc-enabled VMware vSphere.

## Next steps

- [Browse and enable VMware vCenter resources in Azure](browse-and-enable-vcenter-resources-in-azure.md)
