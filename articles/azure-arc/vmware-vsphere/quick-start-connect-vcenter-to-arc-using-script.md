---
title: Connect your VMware vCenter to Azure Arc using the helper script
description: In this quickstart, you'll learn how to use the helper script to connect your VMware vCenter to Azure Arc.
ms.topic: quickstart 
ms.custom: references_regions
ms.date: 11/10/2021

# Customer intent: As a VI admin, I want to connect my vCenter to Azure to enable self-service through Arc.
---

# Quickstart: Connect your VMware vCenter to Azure Arc using the helper script

To start using the Azure Arc-enabled VMware vSphere (preview) features, you'll need to connect your VMware vCenter Server to Azure Arc. This quickstart shows you how to connect your VMware vCenter Server to Azure Arc using a helper script.

First, the script deploys a virtual appliance, called [Azure Arc resource bridge (preview)](../resource-bridge/overview.md), in your vCenter environment. Then, it installs a VMware cluster extension to provide a continuous connection between your vCenter Server and Azure Arc.

> [!IMPORTANT]
> In the interest of ensuring new features are documented no later than their release, this page may include documentation for features that may not yet be publicly available.

## Prerequisites

### Azure

- An Azure subscription.

- A resource group in the subscription where you are a member of the *Owner/Contributor* role.

### vCenter Server

- vCenter Server running version 6.7

- Allow inbound connections on TCP port (usually 443) so that the Arc resource bridge and VMware cluster extension can communicate with the vCenter server.  

- A resource pool or a cluster with a minimum capacity of 16 GB of RAM, four vCPUs.

- A datastore with a minimum of 100 GB of free disk space available through the resource pool or cluster.

- An external virtual network/switch and internet access, directly or through a proxy.

### vSphere accounts

A vSphere account that can:
- read all inventory 
- deploy, and update VMs to all the resource pools (or clusters), networks, and virtual machine templates that you want to use with Azure Arc.

This account is used for the ongoing operation of Azure Arc-enabled VMware vSphere (preview) and the Azure Arc resource bridge (preview) VM deployment.

### Workstation

A Windows or Linux machine that can access both your vCenter Server and internet, directly or through a proxy.

## Prepare vCenter Server

1. Create a resource pool with a reservation of at least 16 GB of RAM and four vCPUs. It should also have access to a datastore with at least 100 GB of free disk space.

2. Ensure the vSphere accounts have the appropriate permissions.

## Download the onboarding script

1. Go to Azure portal.

2. Search for **Azure Arc** and click on it.

3. On the **Overview** page, click on **Add** under **Add your infrastructure for free** or move to the **Infrastructure** tab.

4. Under **Platform** section, click on **Add** under VMware.

    :::image type="content" source="media/add-vmware-vcenter.png" alt-text="Screenshot showing how to add a VMware vCenter through Azure Arc center":::

5. Select **Create a new resource bridge** and click **Next**

6. Provide a name of your choice for Arc resource bridge. Eg. `contoso-nyc-resourcebridge`

7. Select a Subscription and Resource group where the resource bridge would be created.

8. Under Region, select an Azure location where the resource metadata would be stored. Currently supported regions are `East US` and `West Europe`.

9. Provide a name for the Custom location. This will be the name which you will see when you deploy VMs. Name it for the datacenter or physical location of your datacenter. Eg: `contoso-nyc-dc`

10. Leave the option for  **Use the same subscription and resource group as your resource bridge** checked.

11. Provide a name for your vCenter in Azure. Eg: `contoso-nyc-vcenter`

12. Click on **Next: Download and run script >**

13. If your subscription is not registered with all the required resource providers, a **Register** button will appear. Click the button before proceeding to the next step.

    :::image type="content" source="media/register-arc-vmware-providers.png" alt-text="Screenshot showing button to register required resource providers during vCenter onboarding to Arc":::

14. Based on the operating system of your workstation, download the powershell or bash script, and copy it to the [workstation](#prerequisites).

15. [Optional] Click on **Next : Verification**. This page will show you the status of your onboarding once you run the script on your workstation. Closing this page will not affect the onboarding.

## Run the script

### Windows

Follow the below instructions to run the script on a windows machine:

1. Open a PowerShell window and navigate to the folder where you have downloaded the powershell script.

2. Execute the following command to allow the script to run as it is an unsigned script (if you close the session before you complete all the steps, run this again for new session.)

    ``` powershell-interactive
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    ```

3. Execute the script

     ``` powershell-interactive
     ./resource-bridge-onboarding-script.ps1
     ```

### Linux

Follow the below instructions to run the script on a Linux machine:

1. Open the terminal and navigate to the folder where you have downloaded the bash script.

2. Execute the script using the following command:

    ``` sh
    bash resource-bridge-onboarding-script.sh
    ```

## Inputs for the script

A typical onboarding using the script  takes about 30-60 minutes and you will be prompted for the various details during the execution. Refer to the table below for information on them:

| **Requirements** | **Details** |
| --- | --- |
| **Azure login** | Log in to Azure by visiting [this](https://www.microsoft.com/devicelogin) site and using the code when prompted. |
| **vCenter FQDN/Address** | FQDN for the vCenter (or an ip address). </br> Eg: `10.160.0.1` or `nyc-vcenter.contoso.com` |
| **vCenter Username** | Username for the vSphere account. The required permissions for the account are listed in the prerequisites above. |
| **vCenter password** | Password for the vSphere account |
| **Data center selection** | Select the name of the datacenter (as shown in vSphere client) where the Arc resource bridge VM should be deployed |
| **Network selection** | Select the name of the virtual network or segment to which VM must be connected. This network should allow the appliance to talk to the vCenter server and the Azure endpoints (or internet). |
| **Static IP / DHCP** | If you have DHCP server in your network and want to use it, type ‘y’ else ‘n’. On choosing static IP configuration, you will be asked the following </br> 1. `Static IP address prefix` : Network address in CIDR notation E.g.    `192.168.0.0/24` </br> 2. `Static gateway`: Eg. `192.168.0.0` </br> 3. `DNS servers`: Comma-separated list of DNS servers </br> 4. `Start range IP`: Minimum size of 2 available addresses is required, one of the IP is for the VM, and another one is reserved for upgrade scenarios. Provide the start IP of that range </br> 5. `End range IP`: the last IP of the IP range requested in previous field. </br> 6. `VLAN ID` (Optional) |
| **Resource pool** | Select the name of the resource pool to which the Arc resource bridge VM would be deployed |
| **Data store** | Select the name of the datastore to be used for Arc resource bridge VM |
| **Folder** | Select the name of the vSphere VM and Template folder where Arc resource bridge VM should be deployed. |
| **VM template Name** | Provide a name for the VM template that will be created in your vCenter based on the downloaded OVA. Eg: arc-appliance-template |
| **Control Pane IP** | Provide a reserved IP address (a reserved IP address in your DHCP range or a static IP outside of DHCP range but still available on the network). Ensure this IP address isn't assigned to any other machine on the network. |
| **Appliance proxy settings** | Type ‘y’ if there is proxy in your appliance network, else type ‘n’. </br> You need to populate the following when you have proxy setup: </br> 1. `Http`: Address of http proxy server </br> 2. `Https`: Address of https proxy server </br> 3. `NoProxy`: Addresses to be excluded from proxy </br> 4. `CertificateFilePath`: For ssl based proxies, path to certificate to be used

Once the command execution completed, your setup is complete and you can try out the capabilities of Azure Arc-enabled VMware vSphere. You can proceed to the [next steps.](browse-and-enable-vcenter-resources-in-azure.md).

## Next steps

- [Browse and enable VMware vCenter resources in Azure](browse-and-enable-vcenter-resources-in-azure.md)
