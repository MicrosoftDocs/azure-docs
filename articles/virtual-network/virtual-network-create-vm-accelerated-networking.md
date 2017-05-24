---
title: Create an Azure virtual machine with Accelerated Networking | Microsoft Docs
description: Learn how to create a virtual machine with Accelerated Networking.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/10/2017
ms.author: jdial
ms.custom: H1Hack27Feb2017

---
# Create a virtual machine with Accelerated Networking

In this tutorial, you learn how to create an Azure Virtual Machine (VM) with Accelerated Networking. Accelerated networking enables single root I/O virtualization (SR-IOV) to a VM, greatly improving its networking performance. This high-performance path bypasses the host from the datapath reducing latency, jitter, and CPU utilization, for use with the most demanding network workloads on supported VM types. The following picture shows communication between two virtual machines (VM) with and without accelerated networking:

![Comparison](./media/virtual-network-create-vm-accelerated-networking/image1.png)

Without accelerated networking, all networking traffic in and out of the VM must traverse the host and the virtual switch. The virtual switch provides all policy enforcement, such as network security groups, access control lists, isolation, and other network virtualized services to network traffic. To learn more about virtual switches, read the [Hyper-V network virtualization and virtual switch](https://technet.microsoft.com/library/jj945275.aspx) article.

With accelerated networking, network traffic arrives at the VM's network interface (NIC), and is then forwarded to the VM. All network policies that the virtual switch applies without accelerated networking are offloaded and applied in hardware. Applying policy in hardware enables the NIC to forward network traffic directly to the VM, bypassing the host and the virtual switch, while maintaining all the policy it applied in the host.

The benefits of accelerated networking only apply to the VM that it is enabled on. For the best results, it is ideal to enable this feature on at least two VMs connected to the same Azure Virtual Network (VNet). When communicating across VNets or connecting on-premises, this feature has minimal impact to overall latency.

[!INCLUDE [virtual-network-preview](../../includes/virtual-network-preview.md)]

## Benefits
* **Lower Latency / Higher packets per second (pps):** Removing the virtual switch from the datapath removes the time packets spend in the host for policy processing and increases the number of packets that can be processed inside the VM.
* **Reduced jitter:** Virtual switch processing depends on the amount of policy that needs to be applied and the workload of the CPU that is doing the processing. Offloading the policy enforcement to the hardware removes that variability by delivering packets directly to the VM, removing the host to VM communication and all software interrupts and context switches.
* **Decreased CPU utilization:** Bypassing the virtual switch in the host leads to less CPU utilization for processing network traffic.

## <a name="Limitations"></a>Limitations
The following limitations exist when using this capability:

* **Network interface creation:** Accelerated networking can only be enabled for a new NIC. It cannot be enabled for an existing NIC.
* **VM creation:** A NIC with accelerated networking enabled can only be attached to a VM when the VM is created. The NIC cannot be attached to an existing VM.
* **Regions:** Windows VMs with accelerated networking are offered in most Azure regions. Linux VMs with accelerated networking are only offered in two regions: South Central US and West US 2. The regions this capability is available in will expand in the future.
* **Supported operating systems:** Windows: Microsoft Windows Server 2012 R2 Datacenter and Windows Server 2016. Linux: Ubuntu Server 16.04 LTS with kernel 4.4.0-77 or higher. Additional distributions will be added soon.
* **VM Size:** General purpose and compute-optimized instance sizes with eight or more cores. For more information, see the [Windows](../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) VM sizes articles. The set of supported VM instance sizes will expand in the future.

Changes to these limitations are announced through the [Azure Virtual Networking updates](https://azure.microsoft.com/updates/accelerated-networking-in-preview) page.

## Create a Windows VM
You can use the Azure portal or Azure [PowerShell](#windows-powershell) to create the VM.

### <a name="windows-portal"></a>Portal

1. From an Internet browser, open the Azure [portal](https://portal.azure.com) and sign in with your Azure [account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't already have an account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
2. In the portal, click **+ New** > **Compute** > **Windows Server 2016 Datacenter**. 
3. In the **Windows Server 2016 Datacenter** blade that appears, leave *Resource Manager* selected under **Select a deployment model**, and click **Create**.
4. In the **Basics** blade that appears, enter the following values, leave the remaining default options or select or enter your own values, and click the **OK** button:

    |Setting|Value|
    |---|---|
    |Name|MyVm|
    |Resource group|Leave **Create new** selected and enter *MyResourceGroup*|
    |Location|West US 2|

    If you're new to Azure, learn more about [Resource groups](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-group), [subscriptions](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription), and [locations](https://azure.microsoft.com/regions) (which are also referred to as regions).
5. In the **Choose a size** blade that appears, enter *8* in the **Minimum cores** box, then click **View all**.
6. Click **DS4_V2 Standard**, then click the **Select** button.
7. In the **Settings** blade that appears, leave all settings as-is, except click **Enabled** under **Accelerated networking**, then click the **OK** button. **Note:** If, in previous steps, you selected values for VM size, operating system, or location that aren't listed in the [Limitations](#Limitations) section of this article, **Accelerated networking** isn't visible.
8. In the **Summary** blade that appears, click the **OK** button. Azure starts creating the VM. VM creation takes a few minutes.
9. To install the accelerated networking driver for Windows, complete the steps in the [Configure Windows](#configure-windows) section of this article.

### <a name="windows-powershell"></a>PowerShell
1. Install the latest version of the Azure PowerShell [AzureRm](https://www.powershellgallery.com/packages/AzureRM/) module. If you're new to Azure PowerShell, read the [Azure PowerShell overview](/powershell/azure/get-started-azureps?toc=%2fazure%2fvirtual-network%2ftoc.json) article.
2. Start a PowerShell session by clicking the Windows Start button, typing **powershell**, then clicking **PowerShell** from the search results.
3. In your PowerShell window, enter the `login-azurermaccount` command to sign in with your Azure [account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't already have an account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
4. In your browser, copy the following script:
    ```powershell
    $RgName="MyResourceGroup"
    $Location="westus2"
    
    # Create a resource group
    New-AzureRmResourceGroup `
      -Name $RgName `
      -Location $Location
    
    # Create a subnet
    $Subnet = New-AzureRmVirtualNetworkSubnetConfig `
      -Name MySubnet `
      -AddressPrefix 10.0.0.0/24
    
    # Create a virtual network
    $Vnet=New-AzureRmVirtualNetwork `
      -ResourceGroupName $RgName `
      -Location $Location `
      -Name MyVnet `
      -AddressPrefix 10.0.0.0/16 `
      -Subnet $Subnet

    # Create a public IP address
    $Pip = New-AzureRmPublicIpAddress `
      -Name MyPublicIp `
      -ResourceGroupName $RgName `
      -Location $Location `
      -AllocationMethod Static

    # Create a virtual network interface and associate the public IP address to it
    $Nic = New-AzureRmNetworkInterface `
      -Name MyNic `
      -ResourceGroupName $RgName `
      -Location $Location `
      -SubnetId $Vnet.Subnets[0].Id `
      -PublicIpAddressId $Pip.Id `
      -EnableAcceleratedNetworking
     
    # Define a credential object for the VM. PowerShell prompts you for a username and password.
    $Cred = Get-Credential

    # Create a virtual machine configuration
    $VmConfig = New-AzureRmVMConfig `
      -VMName MyVM -VMSize Standard_DS4_v2 | `
      Set-AzureRmVMOperatingSystem `
      -Windows `
      -ComputerName myVM `
      -Credential $Cred | `
    Set-AzureRmVMSourceImage `
      -PublisherName MicrosoftWindowsServer `
      -Offer WindowsServer `
      -Skus 2016-Datacenter `
      -Version latest | `
    Add-AzureRmVMNetworkInterface -Id $Nic.Id 

    # Create the virtual machine.    
    New-AzureRmVM `
      -ResourceGroupName $RgName `
      -Location $Location `
      -VM $VmConfig
    #
    ```
5. In your PowerShell window, right-click to paste the script and start executing it. You are prompted for a username and password. Use these credentials to log in to the VM when connecting to it in the next step. If the script fails, and you changed values in the script before executing it, confirm the values you used for VM size, operating system, and location are listed in the [Limitations](#Limitations) section of this article.
6. To install the accelerated networking driver for Windows, complete the steps in the [Configure Windows](#configure-windows) section of this article.

### <a name="configure-windows"></a>Configure Windows
Once you create the VM in Azure, you must install the accelerated networking driver for Windows. Before completing the following steps, you must have created a Windows VM with accelerated networking using either the [portal](#windows-portal) or [PowerShell](#windows-powershell) steps in this article. 

1. From an Internet browser, open the Azure [portal](https://portal.azure.com) and sign in with your Azure [account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't already have an account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *MyVm*. When **MyVm** appears in the search results, click it.
3. In the **MyVm** blade that appears, click the **Connect** button in the top left corner of the blade. **Note:** If **Creating** is visible under the **Connect** button, Azure has not yet finished creating the VM. Click **Connect** only after you no longer see **Creating** under the **Connect** button.
4. Allow your browser to download the **MyVm.rdp** file.  Once downloaded, click the file to open it. 
5. Click the **Connect** button in the **Remote Desktop Connection** box that appears, notifying you that the publisher of the remote connection can't be identified.
6. In the **Windows Security** box that appears, click **More choices**, then click **Use a different account**. Enter the username and password you entered in step 4, then click the **OK** button.
7. Click the **Yes** button in the Remote Desktop Connection box that appears, notifying you that the identity of the remote computer cannot be verified.
8. On the MyVm VM, click the Windows Start button and click **Internet Explorer**.
9. In the **Internet Explorer 11** box that appears, click **Use recommended security, privacy, and compatibility settings**, then click **OK**.
10. In the Internet Explorer address bar, enter https://gallery.technet.microsoft.com/Azure-Accelerated-471b5d84, then the Enter key.
11. In the **Security Alert** box that appears, click **OK**.
12. In the **Internet Explorer** box that appears, click **Add**, click the **Add** button in the **Trusted sites** box, then click the **Close** button. Complete these steps for any subsequent boxes that appear.
13. To download the file, click it.
14. When the **License, Terms of Use** box appears, click **I agree**.
15. Allow Internet Explorer to save the file by clicking the **Save** button in the box that appears at the bottom of the screen, then click the **Open folder** button.
16. To install the accelerated networking driver, double-click the file. During the installation wizard, accept all defaults and click the **Yes** button at the end of the wizard to restart the VM.
17. Once the VM restarts, complete steps 9-12 again to connect to the VM.
18. Right-click the Windows Start button and click **Device Manager**. Expand the **Network adapters** node. Confirm that the **Mellanox ConnectX-3 Virtual Function Ethernet Adapter** appears, as shown in the following picture:
   
    ![Device Manager](./media/virtual-network-create-vm-accelerated-networking/image2.png)

## Create a Linux VM
You can use the Azure portal or Azure [PowerShell](#linux-powershell) to create the VM.

### <a name="linux-portal"></a>Portal
1. Register for the accelerated networking for Linux preview by completing steps 1-5 of the [Create a Linux VM - PowerShell](#linux-powershell) section of this article.  You cannot register for the preview in the portal.
2. Complete steps 1-8 in the [Create a Windows VM - portal](#windows-portal) section of this article. In step 2, click **Ubuntu Server 16.04 LTS** instead of **Windows Server 2016 Datacenter**. For this tutorial, choose to use a password, rather than an SSH key, though for production deployments, you can use either. If **Accelerated networking** does not appear when you complete step 7 of the [Create a Windows VM - portal](#windows-portal) section of this article, it's likely for one of the following reasons:
    - You are not yet registered for the preview. Confirm that your registration state is **Registered**, as explained in step 4 of the [Create a Linux VM - Powershell](#linux-powershell) section of this article. **Note:** If you participated in the Accelerated networking for Windows VMs preview (it's no longer necessary to register to use Accelerated networking for Windows VMs), you are not automatically registered for the Accelerated networking for Linux VMs preview. You must register for the Accelerated networking for Linux VMs preview to participate in it.
    - You have not selected a VM size, operating system, or location listed in the [Limitations](#limitations) section of this article.
3. To install the accelerated networking driver for Linux, complete the steps in the [Configure Linux](#configure-linux) section of this article.

### <a name="linux-powershell"></a>PowerShell

>[!WARNING]
>If you create Linux VMs with accelerated networking in a subscription, and then attempt to create a Windows VM with accelerated networking in the same subscription, the Windows VM creation may fail. During this preview, it's recommended that you test Linux and Windows VMs with accelerated networking in separate subscriptions.
>

1. Install the latest version of the Azure PowerShell [AzureRm](https://www.powershellgallery.com/packages/AzureRM/) module. If you're new to Azure PowerShell, read the [Azure PowerShell overview](/powershell/azure/get-started-azureps?toc=%2fazure%2fvirtual-network%2ftoc.json) article.
2. Start a PowerShell session by clicking the Windows Start button, typing **powershell**, then clicking **PowerShell** from the search results.
3. In your PowerShell window, enter the `login-azurermaccount` command to sign in with your Azure [account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't already have an account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
4. Register for the accelerated networking for Azure preview by completing the following steps:
    - Send an email to [axnpreview@microsoft.com](mailto:axnpreview@microsoft.com?subject=Request%20to%20enable%20subscription%20%3csubscription%20id%3e) with your Azure subscription ID and intended use. Please wait for an email confirmation from Microsoft about your subscription being enabled.
    - Enter the following command to confirm you are registered for the preview:
    
        `Get-AzureRmProviderFeature -FeatureName AllowAcceleratedNetworkingForLinux -ProviderNamespace Microsoft.Network`

        Do not continue with step 5 until **Registered** appears in the output after you enter the previous command. Your output must look like the following output before continuing:
    
        ```
        FeatureName                       ProviderName      RegistrationState
        -----------                       ------------      -----------------
        AllowAcceleratedNetworkingForLinux Microsoft.Network Registered
        ```
      >[!NOTE]
      >If you participated in the Accelerated networking for Windows VMs preview (it's no longer necessary to register to use Accelerated networking for Windows VMs), you are not automatically registered for the Accelerated networking for Linux VMs preview. You must register for the Accelerated networking for Linux VMs preview to participate in it.
      >
5. In your browser, copy the following script:
    ```powershell
    $RgName="MyResourceGroup"
    $Location="westus2"
    
    # Create a resource group
    New-AzureRmResourceGroup `
      -Name $RgName `
      -Location $Location
    
    # Create a subnet
    $Subnet = New-AzureRmVirtualNetworkSubnetConfig `
      -Name MySubnet `
      -AddressPrefix 10.0.0.0/24
    
    # Create a virtual network
    $Vnet=New-AzureRmVirtualNetwork `
      -ResourceGroupName $RgName `
      -Location $Location `
      -Name MyVnet `
      -AddressPrefix 10.0.0.0/16 `
      -Subnet $Subnet

    # Create a public IP address
    $Pip = New-AzureRmPublicIpAddress `
      -Name MyPublicIp `
      -ResourceGroupName $RgName `
      -Location $Location `
      -AllocationMethod Static

    # Create a virtual network interface and associate the public IP address to it
    $Nic = New-AzureRmNetworkInterface `
      -Name MyNic `
      -ResourceGroupName $RgName `
      -Location $Location `
      -SubnetId $Vnet.Subnets[0].Id `
      -PublicIpAddressId $Pip.Id `
      -EnableAcceleratedNetworking
     
    # Define a credential object for the VM. PowerShell prompts you for a username and password.
    $Cred = Get-Credential

    # Create a virtual machine configuration
    $VmConfig = New-AzureRmVMConfig `
      -VMName MyVM -VMSize Standard_DS4_v2 | `
      Set-AzureRmVMOperatingSystem `
      -Linux `
      -ComputerName myVM `
      -Credential $Cred | `
    Set-AzureRmVMSourceImage `
      -PublisherName Canonical `
      -Offer UbuntuServer `
      -Skus 16.04-LTS `
      -Version latest | `
    Add-AzureRmVMNetworkInterface -Id $Nic.Id 

    # Create the virtual machine.    
    New-AzureRmVM `
      -ResourceGroupName $RgName `
      -Location $Location `
      -VM $VmConfig
    #
    ```
6. In your PowerShell window, right-click to paste the script and start executing it. You are prompted for a username and password. Use these credentials to log in to the VM when connecting to it in the next step. If the script fails, confirm that:
    - You are registered for the preview, as explained in step 4
    - If you changed VM size, operating system type, or location values in the script before executing it, that the values are listed in the [Limitations](#Limitations) section of this article.
7. To install the accelerated networking driver for Linux, complete the steps in the [Configure Linux](#configure-linux) section of this article.

### <a name="configure-linux"></a>Configure Linux

Once you create the VM in Azure, you must install the accelerated networking driver for Linux. Before completing the following steps, you must have created a Linux VM with accelerated networking using either the [portal](#linux-portal) or [PowerShell](#linux-powershell) steps in this article. 

1. From an Internet browser, open the Azure [portal](https://portal.azure.com) and sign in with your Azure [account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account). If you don't already have an account, you can sign up for a [free trial](https://azure.microsoft.com/offers/ms-azr-0044p).
2. At the top of the portal, to the right of the *Search resources* bar, click the **>_** icon to start a Bash cloud shell (Preview). The Bash cloud shell pane appears at the bottom of the portal and after a few seconds, presents a **username@Azure:~$** prompt. Though you can SSH to the VM from your computer, rather than the cloud shell, the instructions in this tutorial assume you're using the cloud shell.
3. At the top of the portal, in the box that contains the text *Search resources*, type *MyVm*. When **MyVm** appears in the search results, click it.
4. In the **MyVm** blade that appears, click the **Connect** button in the top left corner of the blade. **Note:** If **Creating** is visible under the **Connect** button, Azure has not yet finished creating the VM. Click **Connect** only after you no longer see **Creating** under the **Connect** button.
5. Azure opens a box telling you to enter the `ssh adminuser@<ipaddress>`. Enter this command in the cloud shell (or copy it from the box that appeared in step 4 and paste it in to the cloud shell, then press Enter.
6. Enter **yes** to the question asking you if you want to continue connecting, then press Enter.
7. Enter the password you entered when creating the VM. Once successfully logged in to the VM, you see an adminuser@MyVm:~$ prompt. You are now logged in to the VM through the cloud shell session. **Note:** Cloud shell sessions time out after 10 minutes of inactivity.
8. At the prompt, enter `uname -r` and confirm the output matches the following version: “4.4.0-77-generic.”
9.	Create a bond between the standard networking vNIC and the accelerated networking vNIC by running the commands that follow. Network traffic uses the higher performing accelerated networking vNIC, while the bond ensures that networking traffic is not interrupted across certain configuration changes.

    ```
    wget https://git.kernel.org/pub/scm/linux/kernel/git/next/linux-next.git/plain/tools/hv/bondvf.sh
 
    chmod +x ./bondvf.sh

    sudo ./bondvf.sh

    sudo mv ~/bondvf.sh /etc/init.d

    sudo update-rc.d bondvf.sh defaults
    ```

    Note: If you receive an error that says *insserv: warning: script 'bondvf.sh' missing LSB tags and overrides*, you can disregard it.

10. Hold down the **Ctrl+X** keys, enter **Y**, then press the **Enter** key to save the file.
11. Restart the VM by entering the `sudo shutdown -r now` command.
12. Once the VM is restarted, reconnect to it by completing steps 5-7 again.
13.	Run the `ifconfig` command and confirm that bond0 has come up and the interface is showing as UP. **Note:** Application using accelerated networking must communicate over the *bond0* interface, not *eth0*.  The interface name may change before accelerated networking reaches general availability.
