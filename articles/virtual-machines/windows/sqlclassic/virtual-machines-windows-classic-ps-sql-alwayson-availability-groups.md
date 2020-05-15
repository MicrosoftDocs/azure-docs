---
title: Configure the Always On availability group on an Azure VM by using PowerShell | Microsoft Docs
description: This tutorial uses resources that were created with the classic deployment model. You use PowerShell to create an Always On availability group in Azure.
services: virtual-machines-windows
documentationcenter: na
author: MikeRayMSFT
manager: craigg
editor: ''
tags: azure-service-management

ms.assetid: a4e2f175-fe56-4218-86c7-a43fb916cc64
ms.service: virtual-machines-sql

ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 03/17/2017
ms.author: mikeray

---
# Configure the Always On availability group on an Azure VM with PowerShell
> [!div class="op_single_selector"]
> * [Classic: UI](../classic/portal-sql-alwayson-availability-groups.md)
> * [Classic: PowerShell](../classic/ps-sql-alwayson-availability-groups.md)
<br/>

Before you begin, consider that you can now complete this task in Azure resource manager model. We recommend Azure resource manager model for new deployments. See [SQL Server Always On availability groups on Azure virtual machines](../sql/virtual-machines-windows-portal-sql-availability-group-overview.md).

> [!IMPORTANT]
> We recommend that most new deployments use the Resource Manager model. Azure has two different deployment models for creating and working with resources: [Resource Manager and classic](../../../azure-resource-manager/management/deployment-models.md). This article covers using the classic deployment model.

Azure virtual machines (VMs) can help database administrators to lower the cost of a high-availability SQL Server system. This tutorial shows you how to implement an availability group by using SQL Server Always On end-to-end inside an Azure environment. At the end of the tutorial, your SQL Server Always On solution in Azure will consist of the following elements:

* A virtual network that contains multiple subnets, including a front-end and a back-end subnet.
* A domain controller with an Active Directory domain.
* Two SQL Server VMs that are deployed to the back-end subnet and joined to the Active Directory domain.
* A three-node Windows failover cluster with the Node Majority quorum model.
* An availability group with two synchronous-commit replicas of an availability database.

This scenario is a good choice for its simplicity on Azure, not for its cost-effectiveness or other factors. For example, you can minimize the number of VMs for a two-replica availability group to save on compute hours in Azure by using the domain controller as the quorum file share witness in a two-node failover cluster. This method reduces the VM count by one from the above configuration.

This tutorial is intended to show you the steps that are required to set up the described solution above, without elaborating on the details of each step. Therefore, instead of providing the GUI configuration steps, it uses PowerShell scripting to take you quickly through each step. This tutorial assumes the following:

* You already have an Azure account with the virtual machine subscription.
* You've installed the [Azure PowerShell cmdlets](/powershell/azure/overview).
* You already have a solid understanding of Always On availability groups for on-premises solutions. For more information, see [Always On availability groups (SQL Server)](https://msdn.microsoft.com/library/hh510230.aspx).

## Connect to your Azure subscription and create the virtual network
1. In a PowerShell window on your local computer, import the Azure module, download the publishing settings file to your machine, and connect your PowerShell session to your Azure subscription by importing the downloaded publishing settings.

        Import-Module "C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\Azure\Azure.psd1"
        Get-AzurePublishSettingsFile
        Import-AzurePublishSettingsFile <publishsettingsfilepath>

    The **Get-AzurePublishSettingsFile** command automatically generates a management certificate with Azure and downloads it to your machine. A browser is automatically opened, and you're prompted to enter the Microsoft account credentials for your Azure subscription. The downloaded **.publishsettings** file contains all the information that you need to manage your Azure subscription. After saving this file to a local directory, import it by using the **Import-AzurePublishSettingsFile** command.

   > [!NOTE]
   > The .publishsettings file contains your credentials (unencoded) that are used to administer your Azure subscriptions and services. The security best practice for this file is to store it temporarily outside your source directories (for example, in the Libraries\Documents folder), and then delete it after the import has finished. A malicious user who gains access to the .publishsettings file can edit, create, and delete your Azure services.

2. Define a series of variables that you'll use to create your cloud IT infrastructure.

        $location = "West US"
        $affinityGroupName = "ContosoAG"
        $affinityGroupDescription = "Contoso SQL HADR Affinity Group"
        $affinityGroupLabel = "IaaS BI Affinity Group"
        $networkConfigPath = "C:\scripts\Network.netcfg"
        $virtualNetworkName = "ContosoNET"
        $storageAccountName = "<uniquestorageaccountname>"
        $storageAccountLabel = "Contoso SQL HADR Storage Account"
        $storageAccountContainer = "https://" + $storageAccountName + ".blob.core.windows.net/vhds/"
        $winImageName = (Get-AzureVMImage | where {$_.Label -like "Windows Server 2008 R2 SP1*"} | sort PublishedDate -Descending)[0].ImageName
        $sqlImageName = (Get-AzureVMImage | where {$_.Label -like "SQL Server 2012 SP1 Enterprise*"} | sort PublishedDate -Descending)[0].ImageName
        $dcServerName = "ContosoDC"
        $dcServiceName = "<uniqueservicename>"
        $availabilitySetName = "SQLHADR"
        $vmAdminUser = "AzureAdmin"
        $vmAdminPassword = "Contoso!000"
        $workingDir = "c:\scripts\"

    Pay attention to the following to ensure that your commands will succeed later:

   * Variables **$storageAccountName** and **$dcServiceName** must be unique because they're used to identify your cloud storage account and cloud server, respectively, on the Internet.
   * The names that you specify for variables **$affinityGroupName** and **$virtualNetworkName** are configured in the virtual network configuration document that you'll use later.
   * **$sqlImageName** specifies the updated name of the VM image that contains SQL Server 2012 Service Pack 1 Enterprise Edition.
   * For simplicity, **Contoso!000** is the same password that's used throughout the entire tutorial.

3. Create an affinity group.

        New-AzureAffinityGroup `
            -Name $affinityGroupName `
            -Location $location `
            -Description $affinityGroupDescription `
            -Label $affinityGroupLabel

4. Create a virtual network by importing a configuration file.

        Set-AzureVNetConfig `
            -ConfigurationPath $networkConfigPath

    The configuration file contains the following XML document. In brief, it specifies a virtual network called **ContosoNET** in the affinity group called **ContosoAG**. It has the address space **10.10.0.0/16** and has two subnets, **10.10.1.0/24** and **10.10.2.0/24**, which are the front subnet and back subnet, respectively. The front subnet is where you can place client applications such as Microsoft SharePoint. The back subnet is where you'll place the SQL Server VMs. If you change the **$affinityGroupName** and **$virtualNetworkName** variables earlier, you must also change the corresponding names below.

        <NetworkConfiguration xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/ServiceHosting/2011/07/NetworkConfiguration">
          <VirtualNetworkConfiguration>
            <Dns />
            <VirtualNetworkSites>
              <VirtualNetworkSite name="ContosoNET" AffinityGroup="ContosoAG">
                <AddressSpace>
                  <AddressPrefix>10.10.0.0/16</AddressPrefix>
                </AddressSpace>
                <Subnets>
                  <Subnet name="Front">
                    <AddressPrefix>10.10.1.0/24</AddressPrefix>
                  </Subnet>
                  <Subnet name="Back">
                    <AddressPrefix>10.10.2.0/24</AddressPrefix>
                  </Subnet>
                </Subnets>
              </VirtualNetworkSite>
            </VirtualNetworkSites>
          </VirtualNetworkConfiguration>
        </NetworkConfiguration>

5. Create a storage account that's associated with the affinity group that you created, and set it as the current storage account in your subscription.

        New-AzureStorageAccount `
            -StorageAccountName $storageAccountName `
            -Label $storageAccountLabel `
            -AffinityGroup $affinityGroupName
        Set-AzureSubscription `
            -SubscriptionName (Get-AzureSubscription).SubscriptionName `
            -CurrentStorageAccount $storageAccountName

6. Create the domain controller server in the new cloud service and availability set.

        New-AzureVMConfig `
            -Name $dcServerName `
            -InstanceSize Medium `
            -ImageName $winImageName `
            -MediaLocation "$storageAccountContainer$dcServerName.vhd" `
            -DiskLabel "OS" |
            Add-AzureProvisioningConfig `
                -Windows `
                -DisableAutomaticUpdates `
                -AdminUserName $vmAdminUser `
                -Password $vmAdminPassword |
                New-AzureVM `
                    -ServiceName $dcServiceName `
                    –AffinityGroup $affinityGroupName `
                    -VNetName $virtualNetworkName

    These piped commands do the following things:

   * **New-AzureVMConfig** creates a VM configuration.
   * **Add-AzureProvisioningConfig** gives the configuration parameters of a standalone Windows server.
   * **Add-AzureDataDisk** adds the data disk that you'll use for storing Active Directory data, with the caching option set to None.
   * **New-AzureVM** creates a new cloud service and creates the new Azure VM in the new cloud service.

7. Wait for the new VM to be fully provisioned, and download the remote desktop file to your working directory. Because the new Azure VM takes a long time to provision, the `while` loop continues to poll the new VM until it's ready for use.

        $VMStatus = Get-AzureVM -ServiceName $dcServiceName -Name $dcServerName

        While ($VMStatus.InstanceStatus -ne "ReadyRole")
        {
            write-host "Waiting for " $VMStatus.Name "... Current Status = " $VMStatus.InstanceStatus
            Start-Sleep -Seconds 15
            $VMStatus = Get-AzureVM -ServiceName $dcServiceName -Name $dcServerName
        }

        Get-AzureRemoteDesktopFile `
            -ServiceName $dcServiceName `
            -Name $dcServerName `
            -LocalPath "$workingDir$dcServerName.rdp"

The domain controller server is now successfully provisioned. Next, you'll configure the Active Directory domain on this domain controller server. Leave the PowerShell window open on your local computer. You'll use it again later to create the two SQL Server VMs.

## Configure the domain controller
1. Connect to the domain controller server by launching the remote desktop file. Use the machine administrator’s username AzureAdmin and password **Contoso!000**, which you specified when you created the new VM.
2. Open a PowerShell window in administrator mode.
3. Run the following **DCPROMO.EXE** command to set up the **corp.contoso.com** domain, with the data directories on drive M.

        dcpromo.exe `
            /unattend `
            /ReplicaOrNewDomain:Domain `
            /NewDomain:Forest `
            /NewDomainDNSName:corp.contoso.com `
            /ForestLevel:4 `
            /DomainNetbiosName:CORP `
            /DomainLevel:4 `
            /InstallDNS:Yes `
            /ConfirmGc:Yes `
            /CreateDNSDelegation:No `
            /DatabasePath:"C:\Windows\NTDS" `
            /LogPath:"C:\Windows\NTDS" `
            /SYSVOLPath:"C:\Windows\SYSVOL" `
            /SafeModeAdminPassword:"Contoso!000"

    After the command finishes, the VM restarts automatically.

4. Connect to the domain controller server again by launching the remote desktop file. This time, sign in as **CORP\Administrator**.
5. Open a PowerShell window in administrator mode, and import the Active Directory PowerShell module by using the following command:

        Import-Module ActiveDirectory

6. Run the following commands to add three users to the domain.

        $pwd = ConvertTo-SecureString "Contoso!000" -AsPlainText -Force
        New-ADUser `
            -Name 'Install' `
            -AccountPassword  $pwd `
            -PasswordNeverExpires $true `
            -ChangePasswordAtLogon $false `
            -Enabled $true
        New-ADUser `
            -Name 'SQLSvc1' `
            -AccountPassword  $pwd `
            -PasswordNeverExpires $true `
            -ChangePasswordAtLogon $false `
            -Enabled $true
        New-ADUser `
            -Name 'SQLSvc2' `
            -AccountPassword  $pwd `
            -PasswordNeverExpires $true `
            -ChangePasswordAtLogon $false `
            -Enabled $true

    **CORP\Install** is used to configure everything related to the SQL Server service instances, the failover cluster, and the availability group. **CORP\SQLSvc1** and **CORP\SQLSvc2** are used as the SQL Server service accounts for the two SQL Server VMs.
7. Next, run the following commands to give **CORP\Install** the permissions to create computer objects in the domain.

        Cd ad:
        $sid = new-object System.Security.Principal.SecurityIdentifier (Get-ADUser "Install").SID
        $guid = new-object Guid bf967a86-0de6-11d0-a285-00aa003049e2
        $ace1 = new-object System.DirectoryServices.ActiveDirectoryAccessRule $sid,"CreateChild","Allow",$guid,"All"
        $corp = Get-ADObject -Identity "DC=corp,DC=contoso,DC=com"
        $acl = Get-Acl $corp
        $acl.AddAccessRule($ace1)
        Set-Acl -Path "DC=corp,DC=contoso,DC=com" -AclObject $acl

    The GUID specified above is the GUID for the computer object type. The **CORP\Install** account needs the **Read All Properties** and **Create Computer Objects** permission to create the Active Direct objects for the failover cluster. The **Read All Properties** permission is already given to CORP\Install by default, so you don't need to grant it explicitly. For more information on permissions that are needed to create the failover cluster, see [Failover Cluster Step-by-Step Guide: Configuring Accounts in Active Directory](https://technet.microsoft.com/library/cc731002%28v=WS.10%29.aspx).

    Now that you've finished configuring Active Directory and the user objects, you'll create two SQL Server VMs and join them to this domain.

## Create the SQL Server VMs
1. Continue to use the PowerShell window that's open on your local computer. Define the following additional variables:

        $domainName= "corp"
        $FQDN = "corp.contoso.com"
        $subnetName = "Back"
        $sqlServiceName = "<uniqueservicename>"
        $quorumServerName = "ContosoQuorum"
        $sql1ServerName = "ContosoSQL1"
        $sql2ServerName = "ContosoSQL2"
        $availabilitySetName = "SQLHADR"
        $dataDiskSize = 100
        $dnsSettings = New-AzureDns -Name "ContosoBackDNS" -IPAddress "10.10.0.4"

    The IP address **10.10.0.4** is typically assigned to the first VM that you create in the **10.10.0.0/16** subnet of your Azure virtual network. You should verify that this is the address of your domain controller server by running **IPCONFIG**.
2. Run the following piped commands to create the first VM in the failover cluster, named **ContosoQuorum**:

        New-AzureVMConfig `
            -Name $quorumServerName `
            -InstanceSize Medium `
            -ImageName $winImageName `
            -MediaLocation "$storageAccountContainer$quorumServerName.vhd" `
            -AvailabilitySetName $availabilitySetName `
            -DiskLabel "OS" |
            Add-AzureProvisioningConfig `
                -WindowsDomain `
                -AdminUserName $vmAdminUser `
                -Password $vmAdminPassword `
                -DisableAutomaticUpdates `
                -Domain $domainName `
                -JoinDomain $FQDN `
                -DomainUserName $vmAdminUser `
                -DomainPassword $vmAdminPassword |
                Set-AzureSubnet `
                    -SubnetNames $subnetName |
                    New-AzureVM `
                        -ServiceName $sqlServiceName `
                        –AffinityGroup $affinityGroupName `
                        -VNetName $virtualNetworkName `
                        -DnsSettings $dnsSettings

    Note the following regarding the command above:

   * **New-AzureVMConfig** creates a VM configuration with the desired availability set name. The subsequent VMs will be created with the same availability set name so that they're joined to the same availability set.
   * **Add-AzureProvisioningConfig** joins the VM to the Active Directory domain that you created.
   * **Set-AzureSubnet** places the VM in the back subnet.
   * **New-AzureVM** creates a new cloud service and creates the new Azure VM in the new cloud service. The **DnsSettings** parameter specifies that the DNS server for the servers in the new cloud service has the IP address **10.10.0.4**. This is the IP address of the domain controller server. This parameter is needed to enable the new VMs in the cloud service to join to the Active Directory domain successfully. Without this parameter, you must manually set the IPv4 settings in your VM to use the domain controller server as the primary DNS server after the VM is provisioned, and then join the VM to the Active Directory domain.
3. Run the following piped commands to create the SQL Server VMs, named **ContosoSQL1** and **ContosoSQL2**.

        # Create ContosoSQL1...
        New-AzureVMConfig `
            -Name $sql1ServerName `
            -InstanceSize Large `
            -ImageName $sqlImageName `
            -MediaLocation "$storageAccountContainer$sql1ServerName.vhd" `
            -AvailabilitySetName $availabilitySetName `
            -HostCaching "ReadOnly" `
            -DiskLabel "OS" |
            Add-AzureProvisioningConfig `
                -WindowsDomain `
                -AdminUserName $vmAdminUser `
                -Password $vmAdminPassword `
                -DisableAutomaticUpdates `
                -Domain $domainName `
                -JoinDomain $FQDN `
                -DomainUserName $vmAdminUser `
                -DomainPassword $vmAdminPassword |
                Set-AzureSubnet `
                    -SubnetNames $subnetName |
                    Add-AzureEndpoint `
                        -Name "SQL" `
                        -Protocol "tcp" `
                        -PublicPort 1 `
                        -LocalPort 1433 |
                        New-AzureVM `
                            -ServiceName $sqlServiceName

        # Create ContosoSQL2...
        New-AzureVMConfig `
            -Name $sql2ServerName `
            -InstanceSize Large `
            -ImageName $sqlImageName `
            -MediaLocation "$storageAccountContainer$sql2ServerName.vhd" `
            -AvailabilitySetName $availabilitySetName `
            -HostCaching "ReadOnly" `
            -DiskLabel "OS" |
            Add-AzureProvisioningConfig `
                -WindowsDomain `
                -AdminUserName $vmAdminUser `
                -Password $vmAdminPassword `
                -DisableAutomaticUpdates `
                -Domain $domainName `
                -JoinDomain $FQDN `
                -DomainUserName $vmAdminUser `
                -DomainPassword $vmAdminPassword |
                Set-AzureSubnet `
                    -SubnetNames $subnetName |
                    Add-AzureEndpoint `
                        -Name "SQL" `
                        -Protocol "tcp" `
                        -PublicPort 2 `
                        -LocalPort 1433 |
                        New-AzureVM `
                            -ServiceName $sqlServiceName

    Note the following regarding the commands above:

   * **New-AzureVMConfig** uses the same availability set name as the domain controller server, and uses the SQL Server 2012 Service Pack 1 Enterprise Edition image in the virtual machine gallery. It also sets the operating system disk to read-caching only (no write caching). We recommend that you migrate the database files to a separate data disk that you attach to the VM, and configure it with no read or write caching. However, the next best thing is to remove write caching on the operating system disk because you can't remove read caching on the operating system disk.
   * **Add-AzureProvisioningConfig** joins the VM to the Active Directory domain that you created.
   * **Set-AzureSubnet** places the VM in the back subnet.
   * **Add-AzureEndpoint** adds access endpoints so that client applications can access these SQL Server services instances on the Internet. Different ports are given to ContosoSQL1 and ContosoSQL2.
   * **New-AzureVM** creates the new SQL Server VM in the same cloud service as ContosoQuorum. You must place the VMs in the same cloud service if you want them to be in the same availability set.
4. Wait for each VM to be fully provisioned and for each VM to download its remote desktop file to your working directory. The `for` loop cycles through the three new VMs and executes the commands inside the top-level curly brackets for each of them.

        Foreach ($VM in $VMs = Get-AzureVM -ServiceName $sqlServiceName)
        {
            write-host "Waiting for " $VM.Name "..."

            # Loop until the VM status is "ReadyRole"
            While ($VM.InstanceStatus -ne "ReadyRole")
            {
                write-host "  Current Status = " $VM.InstanceStatus
                Start-Sleep -Seconds 15
                $VM = Get-AzureVM -ServiceName $VM.ServiceName -Name $VM.InstanceName
            }

            write-host "  Current Status = " $VM.InstanceStatus

            # Download remote desktop file
            Get-AzureRemoteDesktopFile -ServiceName $VM.ServiceName -Name $VM.InstanceName -LocalPath "$workingDir$($VM.InstanceName).rdp"
        }

    The SQL Server VMs are now provisioned and running, but they're installed with SQL Server with default options.

## Initialize the failover cluster VMs
In this section, you need to modify the three servers that you'll use in the failover cluster and the SQL Server installation. Specifically:

* All servers: You need to install the **Failover Clustering** feature.
* All servers: You need to add **CORP\Install** as the machine **administrator**.
* ContosoSQL1 and ContosoSQL2 only: You need to add **CORP\Install** as a **sysadmin** role in the default database.
* ContosoSQL1 and ContosoSQL2 only: You need to add **NT AUTHORITY\System** as a sign-in with the following permissions:

  * Alter any availability group
  * Connect SQL
  * View server state
* ContosoSQL1 and ContosoSQL2 only: The **TCP** protocol is already enabled on the SQL Server VM. However, you still need to open the firewall for remote access of SQL Server.

Now, you're ready to start. Beginning with **ContosoQuorum**, follow the steps below:

1. Connect to **ContosoQuorum** by launching the remote desktop files. Use the machine administrator’s username **AzureAdmin** and password **Contoso!000**, which you specified when you created the VMs.
2. Verify that the computers have been successfully joined to **corp.contoso.com**.
3. Wait for the SQL Server installation to finish running the automated initialization tasks before proceeding.
4. Open a PowerShell window in administrator mode.
5. Install the Windows Failover Clustering feature.

        Import-Module ServerManager
        Add-WindowsFeature Failover-Clustering
6. Add **CORP\Install** as a local administrator.

        net localgroup administrators "CORP\Install" /Add
7. Sign out of ContosoQuorum. You're done with this server now.

        logoff.exe

Next, initialize **ContosoSQL1** and **ContosoSQL2**. Follow the steps below, which are identical for both SQL Server VMs.

1. Connect to the two SQL Server VMs by launching the remote desktop files. Use the machine administrator’s username **AzureAdmin** and password **Contoso!000**, which you specified when you created the VMs.
2. Verify that the computers have been successfully joined to **corp.contoso.com**.
3. Wait for the SQL Server installation to finish running the automated initialization tasks before proceeding.
4. Open a PowerShell window in administrator mode.
5. Install the Windows Failover Clustering feature.

        Import-Module ServerManager
        Add-WindowsFeature Failover-Clustering
6. Add **CORP\Install** as a local administrator.

        net localgroup administrators "CORP\Install" /Add
7. Import the SQL Server PowerShell Provider.

        Set-ExecutionPolicy -Execution RemoteSigned -Force
        Import-Module -Name "sqlps" -DisableNameChecking
8. Add **CORP\Install** as the sysadmin role for the default SQL Server instance.

        net localgroup administrators "CORP\Install" /Add
        Invoke-SqlCmd -Query "EXEC sp_addsrvrolemember 'CORP\Install', 'sysadmin'" -ServerInstance "."
9. Add **NT AUTHORITY\System** as a sign-in with the three permissions described above.

        Invoke-SqlCmd -Query "CREATE LOGIN [NT AUTHORITY\SYSTEM] FROM WINDOWS" -ServerInstance "."
        Invoke-SqlCmd -Query "GRANT ALTER ANY AVAILABILITY GROUP TO [NT AUTHORITY\SYSTEM] AS SA" -ServerInstance "."
        Invoke-SqlCmd -Query "GRANT CONNECT SQL TO [NT AUTHORITY\SYSTEM] AS SA" -ServerInstance "."
        Invoke-SqlCmd -Query "GRANT VIEW SERVER STATE TO [NT AUTHORITY\SYSTEM] AS SA" -ServerInstance "."
10. Open the firewall for remote access of SQL Server.

         netsh advfirewall firewall add rule name='SQL Server (TCP-In)' program='C:\Program Files\Microsoft SQL Server\MSSQL11.MSSQLSERVER\MSSQL\Binn\sqlservr.exe' dir=in action=allow protocol=TCP
11. Sign out of both VMs.

         logoff.exe

Finally, you're ready to configure the availability group. You'll use the SQL Server PowerShell Provider to perform all of the work on **ContosoSQL1**.

## Configure the availability group
1. Connect to **ContosoSQL1** again by launching the remote desktop files. Instead of signing in by using the machine account, sign in by using **CORP\Install**.
2. Open a PowerShell window in administrator mode.
3. Define the following variables:

        $server1 = "ContosoSQL1"
        $server2 = "ContosoSQL2"
        $serverQuorum = "ContosoQuorum"
        $acct1 = "CORP\SQLSvc1"
        $acct2 = "CORP\SQLSvc2"
        $password = "Contoso!000"
        $clusterName = "Cluster1"
        $timeout = New-Object System.TimeSpan -ArgumentList 0, 0, 30
        $db = "MyDB1"
        $backupShare = "\\$server1\backup"
        $quorumShare = "\\$server1\quorum"
        $ag = "AG1"
4. Import the SQL Server PowerShell Provider.

        Set-ExecutionPolicy RemoteSigned -Force
        Import-Module "sqlps" -DisableNameChecking
5. Change the SQL Server service account for ContosoSQL1 to CORP\SQLSvc1.

        $wmi1 = new-object ("Microsoft.SqlServer.Management.Smo.Wmi.ManagedComputer") $server1
        $wmi1.services | where {$_.Type -eq 'SqlServer'} | foreach{$_.SetServiceAccount($acct1,$password)}
        $svc1 = Get-Service -ComputerName $server1 -Name 'MSSQLSERVER'
        $svc1.Stop()
        $svc1.WaitForStatus([System.ServiceProcess.ServiceControllerStatus]::Stopped,$timeout)
        $svc1.Start();
        $svc1.WaitForStatus([System.ServiceProcess.ServiceControllerStatus]::Running,$timeout)
6. Change the SQL Server service account for ContosoSQL2 to CORP\SQLSvc2.

        $wmi2 = new-object ("Microsoft.SqlServer.Management.Smo.Wmi.ManagedComputer") $server2
        $wmi2.services | where {$_.Type -eq 'SqlServer'} | foreach{$_.SetServiceAccount($acct2,$password)}
        $svc2 = Get-Service -ComputerName $server2 -Name 'MSSQLSERVER'
        $svc2.Stop()
        $svc2.WaitForStatus([System.ServiceProcess.ServiceControllerStatus]::Stopped,$timeout)
        $svc2.Start();
        $svc2.WaitForStatus([System.ServiceProcess.ServiceControllerStatus]::Running,$timeout)
7. Download **CreateAzureFailoverCluster.ps1** from [Create Failover Cluster for Always On Availability Groups in Azure VM](https://gallery.technet.microsoft.com/scriptcenter/Create-WSFC-Cluster-for-7c207d3a) to the local working directory. You'll use this script to help you create a functional failover cluster. For important information on how Windows Failover Clustering interacts with the Azure network, see [High availability and disaster recovery for SQL Server in Azure Virtual Machines](../sql/virtual-machines-windows-sql-high-availability-dr.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fsqlclassic%2ftoc.json).
8. Change to your working directory and create the failover cluster with the downloaded script.

        Set-ExecutionPolicy Unrestricted -Force
        .\CreateAzureFailoverCluster.ps1 -ClusterName "$clusterName" -ClusterNode "$server1","$server2","$serverQuorum"
9. Enable Always On availability groups for the default SQL Server instances on **ContosoSQL1** and **ContosoSQL2**.

        Enable-SqlAlwaysOn `
            -Path SQLSERVER:\SQL\$server1\Default `
            -Force
        Enable-SqlAlwaysOn `
            -Path SQLSERVER:\SQL\$server2\Default `
            -NoServiceRestart
        $svc2.Stop()
        $svc2.WaitForStatus([System.ServiceProcess.ServiceControllerStatus]::Stopped,$timeout)
        $svc2.Start();
        $svc2.WaitForStatus([System.ServiceProcess.ServiceControllerStatus]::Running,$timeout)
10. Create a backup directory and grant permissions for the SQL Server service accounts. You'll use this directory to prepare the availability database on the secondary replica.

         $backup = "C:\backup"
         New-Item $backup -ItemType directory
         net share backup=$backup "/grant:$acct1,FULL" "/grant:$acct2,FULL"
         icacls.exe "$backup" /grant:r ("$acct1" + ":(OI)(CI)F") ("$acct2" + ":(OI)(CI)F")
11. Create a database on **ContosoSQL1** called **MyDB1**, take both a full backup and a log backup, and restore them on **ContosoSQL2** with the **WITH NORECOVERY** option.

         Invoke-SqlCmd -Query "CREATE database $db"
         Backup-SqlDatabase -Database $db -BackupFile "$backupShare\db.bak" -ServerInstance $server1
         Backup-SqlDatabase -Database $db -BackupFile "$backupShare\db.log" -ServerInstance $server1 -BackupAction Log
         Restore-SqlDatabase -Database $db -BackupFile "$backupShare\db.bak" -ServerInstance $server2 -NoRecovery
         Restore-SqlDatabase -Database $db -BackupFile "$backupShare\db.log" -ServerInstance $server2 -RestoreAction Log -NoRecovery
12. Create the availability group endpoints on the SQL Server VMs and set the proper permissions on the endpoints.

         $endpoint =
             New-SqlHadrEndpoint MyMirroringEndpoint `
             -Port 5022 `
             -Path "SQLSERVER:\SQL\$server1\Default"
         Set-SqlHadrEndpoint `
             -InputObject $endpoint `
             -State "Started"
         $endpoint =
             New-SqlHadrEndpoint MyMirroringEndpoint `
             -Port 5022 `
             -Path "SQLSERVER:\SQL\$server2\Default"
         Set-SqlHadrEndpoint `
             -InputObject $endpoint `
             -State "Started"

         Invoke-SqlCmd -Query "CREATE LOGIN [$acct2] FROM WINDOWS" -ServerInstance $server1
         Invoke-SqlCmd -Query "GRANT CONNECT ON ENDPOINT::[MyMirroringEndpoint] TO [$acct2]" -ServerInstance $server1
         Invoke-SqlCmd -Query "CREATE LOGIN [$acct1] FROM WINDOWS" -ServerInstance $server2
         Invoke-SqlCmd -Query "GRANT CONNECT ON ENDPOINT::[MyMirroringEndpoint] TO [$acct1]" -ServerInstance $server2
13. Create the availability replicas.

         $primaryReplica =
             New-SqlAvailabilityReplica `
             -Name $server1 `
             -EndpointURL "TCP://$server1.corp.contoso.com:5022" `
             -AvailabilityMode "SynchronousCommit" `
             -FailoverMode "Automatic" `
             -Version 11 `
             -AsTemplate
         $secondaryReplica =
             New-SqlAvailabilityReplica `
             -Name $server2 `
             -EndpointURL "TCP://$server2.corp.contoso.com:5022" `
             -AvailabilityMode "SynchronousCommit" `
             -FailoverMode "Automatic" `
             -Version 11 `
             -AsTemplate
14. Finally, create the availability group and join the secondary replica to the availability group.

         New-SqlAvailabilityGroup `
             -Name $ag `
             -Path "SQLSERVER:\SQL\$server1\Default" `
             -AvailabilityReplica @($primaryReplica,$secondaryReplica) `
             -Database $db
         Join-SqlAvailabilityGroup `
             -Path "SQLSERVER:\SQL\$server2\Default" `
             -Name $ag
         Add-SqlAvailabilityDatabase `
             -Path "SQLSERVER:\SQL\$server2\Default\AvailabilityGroups\$ag" `
             -Database $db

## Next steps
You've now successfully implemented SQL Server Always On by creating an availability group in Azure. To configure a listener for this availability group, see [Configure an ILB listener for Always On availability groups in Azure](../classic/ps-sql-int-listener.md).

For other information about using SQL Server in Azure, see [SQL Server on Azure virtual machines](../sql/virtual-machines-windows-sql-server-iaas-overview.md).
