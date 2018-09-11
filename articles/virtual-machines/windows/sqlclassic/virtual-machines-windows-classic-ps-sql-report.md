---
title: Use PowerShell to Create a VM With a Native Mode Report Server | Microsoft Docs
description: 'This topic describes and walks you through the deployment and configuration of a SQL Server Reporting Services native mode report server in an Azure Virtual Machine. '
services: virtual-machines-windows
documentationcenter: na
author: markingmyname
manager: erikre
editor: monicar
tags: azure-service-management

ms.assetid: 553af55b-d02e-4e32-904c-682bfa20fa0f
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 01/11/2017
ms.author: maghan

---
# Use PowerShell to Create an Azure VM With a Native Mode Report Server
> [!IMPORTANT] 
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../../../azure-resource-manager/resource-manager-deployment-model.md). This article covers using the Classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model.

This topic describes and walks you through the deployment and configuration of a SQL Server Reporting Services native mode report server in an Azure Virtual Machine. The steps in this document use a combination of manual steps to create the virtual machine and a Windows PowerShell script to configure Reporting Services on the VM. The configuration script includes opening a firewall port for HTTP or HTTPs.

> [!NOTE]
> If you do not require **HTTPS** on the report server, **skip step 2**.
> 
> After creating the VM in step 1, go to the section Use script to configure the report server and HTTP. After you run the script, the report server is ready to use.

## Prerequisites and Assumptions
* **Azure Subscription**: Verify the number of cores available in your Azure Subscription. If you create the recommended VM size of **A3**, you need **4** available cores. If you use a VM size of **A2**, you need **2** available cores.
  
  * To verify the core limit of your subscription, in the Azure portal, click SETTINGS in the left pane and then Click USAGE in the top menu.
  * To increase the core quota, contact [Azure Support](https://azure.microsoft.com/support/options/). For VM size information, see [Virtual Machine Sizes for Azure](../sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
* **Windows PowerShell Scripting**: The topic assumes that you have a basic working knowledge of Windows PowerShell. For more information about using Windows PowerShell, see the following:
  
  * [Starting Windows PowerShell on Windows Server](https://docs.microsoft.com/powershell/scripting/setup/starting-windows-powershell)
  * [Getting Started with Windows PowerShell](https://technet.microsoft.com/library/hh857337.aspx)

## Step 1: Provision an Azure Virtual Machine
1. Browse to the Azure portal.
2. Click **Virtual Machines** in the left pane.
   
    ![microsoft azure virtual machines](./media/virtual-machines-windows-classic-ps-sql-report/IC660124.gif)
3. Click **New**.
   
    ![new button](./media/virtual-machines-windows-classic-ps-sql-report/IC692019.gif)
4. Click **From Gallery**.
   
    ![new vm from gallery](./media/virtual-machines-windows-classic-ps-sql-report/IC692020.gif)
5. Click **SQL Server 2014 RTM Standard – Windows Server 2012 R2** and then click the arrow to continue.
   
    ![next](./media/virtual-machines-windows-classic-ps-sql-report/IC692021.gif)
   
    If you need the Reporting Services data driven subscriptions feature, choose **SQL Server 2014 RTM Enterprise – Windows Server 2012 R2**. For more information on SQL Server editions and feature support, see [Features Supported by the Editions of SQL Server 2012](https://msdn.microsoft.com/library/cc645993.aspx#Reporting).
6. On the **Virtual machine configuration** page, edit the following fields:
   
   * If there is more than one **VERSION RELEASE DATE**, select the most recent version.
   * **Virtual Machine Name**: The machine name is also used on the next configuration page as the default Cloud Service DNS name. The DNS name must be unique across the Azure service. Consider configuring the VM with a computer name that describes what the VM is used for. For example ssrsnativecloud.
   * **Tier**: Standard
   * **Size:A3** is the recommended VM size for SQL Server workloads. If a VM is only used as a report server, a VM size of A2 is sufficient unless the report server experiences a large workload. For VM pricing information, see [Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/).
   * **New User Name**: the name you provide is created as an administrator on the VM.
   * **New Password** and **confirm**. This password is used for the new administrator account and it is recommended you use a strong password.
   * Click **Next**. ![next](./media/virtual-machines-windows-classic-ps-sql-report/IC692021.gif)
7. On the next page, edit the following fields:
   
   * **Cloud Service**: select **Create a new Cloud Service**.
   * **Cloud Service DNS Name**: This is the public DNS name of the Cloud Service that is associated with the VM. The default name is the name you typed in for the VM name. If in later steps of the topic, you create a trusted SSL certificate and then the DNS name is used for the value of the “**Issued to**” of the certificate.
   * **Region/Affinity Group/Virtual Network**: Choose the region closest to your end users.
   * **Storage Account**: Use an automatically generated storage account.
   * **Availability Set**: None.
   * **ENDPOINTS** Keep the **Remote Desktop** and **PowerShell** endpoints and then add either an HTTP or HTTPS endpoint, depending on your environment.
     
     * **HTTP**: The default public and private ports are **80**. Note that if you use a private port other than 80, modify **$HTTPport = 80** in the http script.
     * **HTTPS**: The default public and private ports are **443**. A security best practice is to change the private port and configure your firewall and the report server to use the private port. For more information on endpoints, see [How to Set Up Communication with a Virtual Machine](../classic/setup-endpoints.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json). Note that if you use a port other than 443, change the parameter **$HTTPsport = 443** in the HTTPS script.
   * Click next . ![next](./media/virtual-machines-windows-classic-ps-sql-report/IC692021.gif)
8. On the last page of the wizard, keep the default **Install the VM agent** selected. The steps in this topic do not utilize the VM agent but if you plan to keep this VM, the VM agent and extensions will allow you to enhance he CM.  For more information on the VM agent, see [VM Agent and Extensions – Part 1](https://azure.microsoft.com/blog/2014/04/11/vm-agent-and-extensions-part-1/). One of the default extensions installed ad running is the “BGINFO” extension that displays on the VM desktop, system information such as internal IP and free drive space.
9. Click complete . ![ok](./media/virtual-machines-windows-classic-ps-sql-report/IC660122.gif)
10. The **Status** of the VM displays as **Starting (Provisioning)** during the provision process and then displays as **Running** when the VM is provisioned and ready to use.

## Step 2: Create a Server Certificate
> [!NOTE]
> If you do not require HTTPS on the report server, you can **skip step 2** and go to the section **Use script to configure the report server and HTTP**. Use the HTTP script to quickly configure the report server and the report server will be ready to use.

In order to use HTTPS on the VM, you need a trusted SSL certificate. Depending on your scenario, you can use one of the following two methods:

* A valid SSL certificate issued by a Certification Authority (CA) and trusted by Microsoft. The CA root certificates are required to be distributed via the Microsoft Root Certificate Program. For more information about this program, see [Windows and Windows Phone 8 SSL Root Certificate Program (Member CAs)](http://social.technet.microsoft.com/wiki/contents/articles/14215.windows-and-windows-phone-8-ssl-root-certificate-program-member-cas.aspx) and [Introduction to The Microsoft Root Certificate Program](http://social.technet.microsoft.com/wiki/contents/articles/3281.introduction-to-the-microsoft-root-certificate-program.aspx).
* A self-signed certificate. Self-signed certificates are not recommended for production environments.

### To use a certificate created by a trusted Certificate Authority (CA)
1. **Request a server certificate for the website from a certification authority**. 
   
    You can use the Web Server Certificate Wizard either to generate a certificate request file (Certreq.txt) that you send to a certification authority, or to generate a request for an online certification authority. For example, Microsoft Certificate Services in Windows Server 2012. Depending on the level of identification assurance offered by your server certificate, it is several days to several months for the certification authority to approve your request and send you a certificate file. 
   
    For more information about requesting a server certificates, see the following: 
   
   * Use [Certreq](https://technet.microsoft.com/library/cc725793.aspx), [Certreq](https://technet.microsoft.com/library/cc725793.aspx).
   * Security Tools to Administer Windows Server 2012.
     
     [Security Tools to Administer Windows Server 2012](https://technet.microsoft.com/library/jj730960.aspx)
     
     > [!NOTE]
     > The **issued to** field of the trusted SSL certificate should be the same as the **Cloud Service DNS NAME** you used for the new VM.

2. **Install the server certificate on the Web server**. The Web server in this case is the VM that hosts the report server and the website is created in later steps when you configure Reporting Services. For more information about installing the server certificate on the Web server by using the Certificate MMC snap-in, see [Install a Server Certificate](https://technet.microsoft.com/library/cc740068).
   
    If you want to use the script included with this topic, to configure the report server, the value of the certificates **Thumbprint** is required as a parameter of the script. See the next section for details on how to obtain the thumbprint of the certificate.
3. Assign the server certificate to the report server. The assignment is completed in the next section when you configure the report server.

### To use the Virtual Machines Self-signed Certificate
A self-signed certificate was created on the VM when the VM was provisioned. The certificate has the same name as the VM DNS name. In order to avoid certificate errors, it is required that the certificate is trusted on the VM itself, and also by all users of the site.

1. To trust the root CA of the certificate on the Local VM, add the certificate to the **Trusted Root Certification Authorities**. The following is a summary of the steps required. For detailed steps on how to trust the CA, see [Install a Server Certificate](https://technet.microsoft.com/library/cc740068).
   
   1. From the Azure portal, select the VM and click connect. Depending on your browser configuration, you may be prompted to save an .rdp file for connecting to the VM.
      
       ![connect to azure virtual machine](./media/virtual-machines-windows-classic-ps-sql-report/IC650112.gif) Use the user VM name, user name and password you configured when you created the VM. 
      
       For example, in the following image, the VM name is **ssrsnativecloud** and the user name is **testuser**.
      
       ![login inlcudes vm name](./media/virtual-machines-windows-classic-ps-sql-report/IC764111.png)
   2. Run mmc.exe. For more information, see [How to: View Certificates with the MMC Snap-in](https://msdn.microsoft.com/library/ms788967.aspx).
   3. In the console application **File** menu, add the **Certificates** snap-in, select **Computer Account** when prompted, and then click **Next**.
   4. Select **Local Computer** to manage and then click **Finish**.
   5. Click **Ok** and then expand the **Certificates -Personal** nodes and then click **Certificates**. The certificate is named after the DNS name of the VM and ends with **cloudapp.net**. Right-click the certificate name and click **Copy**.
   6. Expand the **Trusted Root Certification Authorities** node and then right-click **Certificates** and then click **Paste**.
   7. To validate, double click on the certificate name under **Trusted Root Certification Authorities** and verify that there are no errors and you see your certificate. If you want to use the HTTPS script included with this topic, to configure the report server, the value of the certificates **Thumbprint** is required as a parameter of the script. **To get the thumbprint value**, complete the following. There is also a PowerShell sample to retrieve the thumbprint in section [Use script to configure the report server and HTTPS](#use-script-to-configure-the-report-server-and-HTTPS).
      
      1. Double-click the name of the certificate, for example ssrsnativecloud.cloudapp.net.
      2. Click the **Details** tab.
      3. Click **Thumbprint**. The value of the thumbprint is displayed in the details field, for example ‎a6 08 3c df f9 0b f7 e3 7c 25 ed a4 ed 7e ac 91 9c 2c fb 2f.
      4. Copy the thumbprint and save the value for later or edit the script now.
      5. (*) Before you run the script, remove the spaces in between the pairs of values. For example the thumbprint noted before would now be ‎a6083cdff90bf7e37c25eda4ed7eac919c2cfb2f.
      6. Assign the server certificate to the report server. The assignment is completed in the next section when you configure the report server.

If you are using a self-signed SSL certificate, the name on the certificate already matches the hostname of the VM. Therefore, the DNS of the machine is already registered globally and can be accessed from any client.

## Step 3: Configure the Report Server
This section walks you through configuring the VM as a Reporting Services native mode report server. You can use one of the following methods to configure the report server:

* Use the script to configure the report server
* Use Configuration Manager to Configure the Report Server.

For more detailed steps, see the section [Connect to the Virtual Machine and Start the Reporting Services Configuration Manager](virtual-machines-windows-classic-ps-sql-bi.md#connect-to-the-virtual-machine-and-start-the-reporting-services-configuration-manager).

**Authentication Note:** Windows authentication is the recommended authentication method and it is the default Reporting Services authentication. Only users that are configured on the VM can access Reporting Services and assigned to Reporting Services roles.

### Use script to configure the report server and HTTP
To use the Windows PowerShell script to configure the report server, complete the following steps. The configuration includes HTTP, not HTTPS:

1. From the Azure portal, select the VM and click connect. Depending on your browser configuration, you may be prompted to save an .rdp file for connecting to the VM.
   
    ![connect to azure virtual machine](./media/virtual-machines-windows-classic-ps-sql-report/IC650112.gif) Use the user VM name, user name and password you configured when you created the VM. 
   
    For example, in the following image, the VM name is **ssrsnativecloud** and the user name is **testuser**.
   
    ![login inlcudes vm name](./media/virtual-machines-windows-classic-ps-sql-report/IC764111.png)
2. On the VM, open **Windows PowerShell ISE** with administrative privileges. The PowerShell ISE is installed by default on Windows server 2012. It is recommended you use the ISE instead of a standard Windows PowerShell window so that you can paste the script into the ISE, modify the script, and then run the script.
3. In Windows PowerShell ISE, click the **View** menu and then click **Show Script Pane**.
4. Copy the following script, and paste the script into the Windows PowerShell ISE script pane.
   
        ## This script configures a Native mode report server without HTTPS
        $ErrorActionPreference = "Stop"
   
        $server = $env:COMPUTERNAME
        $HTTPport = 80 # change the value if you used a different port for the private HTTP endpoint when the VM was created.
   
        ## Set PowerShell execution policy to be able to run scripts
        Set-ExecutionPolicy RemoteSigned -Force
   
        ## Utility method for verifying an operation's result
        function CheckResult
        {
            param($wmi_result, $actionname)
            if ($wmi_result.HRESULT -ne 0) {
                write-error "$actionname failed. Error from WMI: $($wmi_result.Error)"
            }
        }
   
        $starttime=Get-Date
        write-host -foregroundcolor DarkGray $starttime StartTime
   
        ## ReportServer Database name - this can be changed if needed
        $dbName='ReportServer'
   
        ## Register for MSReportServer_ConfigurationSetting
        ## Change the version portion of the path to "v11" to use the script for SQL Server 2012
        $RSObject = Get-WmiObject -class "MSReportServer_ConfigurationSetting" -namespace "root\Microsoft\SqlServer\ReportServer\RS_MSSQLSERVER\v12\Admin"
   
        ## Report Server Configuration Steps
   
        ## Setting the web service URL ##
        write-host -foregroundcolor green "Setting the web service URL"
        write-host -foregroundcolor green ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
        $time=Get-Date
        write-host -foregroundcolor DarkGray $time
   
        ## SetVirtualDirectory for ReportServer site
            write-host 'Calling SetVirtualDirectory'
            $r = $RSObject.SetVirtualDirectory('ReportServerWebService','ReportServer',1033)
            CheckResult $r "SetVirtualDirectory for ReportServer"
   
        ## ReserveURL for ReportServerWebService - port $HTTPport (for local usage)
            write-host "Calling ReserveURL port $HTTPport"
            $r = $RSObject.ReserveURL('ReportServerWebService',"http://+:$HTTPport",1033)
            CheckResult $r "ReserveURL for ReportServer port $HTTPport" 
   
        ## Setting the Database ##
        write-host -foregroundcolor green "Setting the Database"
        write-host -foregroundcolor green ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
        $time=Get-Date
        write-host -foregroundcolor DarkGray $time
   
        ## GenerateDatabaseScript - for creating the database
            write-host "Calling GenerateDatabaseCreationScript for database $dbName"
            $r = $RSObject.GenerateDatabaseCreationScript($dbName,1033,$false)
            CheckResult $r "GenerateDatabaseCreationScript"
            $script = $r.Script
   
        ## Execute sql script to create the database
            write-host 'Executing Database Creation Script'
            $savedcvd = Get-Location
            Import-Module SQLPS              ## this automatically changes to sqlserver provider
            Invoke-SqlCmd -Query $script
            Set-Location $savedcvd
   
        ## GenerateGrantRightsScript 
            $DBUser = "NT Service\ReportServer"
            write-host "Calling GenerateDatabaseRightsScript with user $DBUser"
            $r = $RSObject.GenerateDatabaseRightsScript($DBUser,$dbName,$false,$true)
            CheckResult $r "GenerateDatabaseRightsScript"
            $script = $r.Script
   
        ## Execute grant rights script
            write-host 'Executing Database Rights Script'
            $savedcvd = Get-Location
            cd sqlserver:\
            Invoke-SqlCmd -Query $script
            Set-Location $savedcvd
   
        ## SetDBConnection - uses Windows Service (type 2), username is ignored
            write-host "Calling SetDatabaseConnection server $server, DB $dbName"
            $r = $RSObject.SetDatabaseConnection($server,$dbName,2,'','')
            CheckResult $r "SetDatabaseConnection"  
   
        ## Setting the Report Manager URL ##
   
        write-host -foregroundcolor green "Setting the Report Manager URL"
        write-host -foregroundcolor green ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
        $time=Get-Date
        write-host -foregroundcolor DarkGray $time
   
        ## SetVirtualDirectory for Reports (Report Manager) site
            write-host 'Calling SetVirtualDirectory'
            $r = $RSObject.SetVirtualDirectory('ReportManager','Reports',1033)
            CheckResult $r "SetVirtualDirectory"
   
        ## ReserveURL for ReportManager  - port $HTTPport
            write-host "Calling ReserveURL for ReportManager, port $HTTPport"
            $r = $RSObject.ReserveURL('ReportManager',"http://+:$HTTPport",1033)
            CheckResult $r "ReserveURL for ReportManager port $HTTPport"
   
        write-host -foregroundcolor green "Open Firewall port for $HTTPport"
        write-host -foregroundcolor green ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
        $time=Get-Date
        write-host -foregroundcolor DarkGray $time
   
        ## Open Firewall port for $HTTPport
            New-NetFirewallRule -DisplayName “Report Server (TCP on port $HTTPport)” -Direction Inbound –Protocol TCP –LocalPort $HTTPport
            write-host "Added rule Report Server (TCP on port $HTTPport) in Windows Firewall"
   
        write-host 'Operations completed, Report Server is ready'
        write-host -foregroundcolor DarkGray $starttime StartTime
        $time=Get-Date
        write-host -foregroundcolor DarkGray $time
5. If you created the VM with an HTTP port other than 80, modify the parameter $HTTPport = 80.
6. The script is currently configured for  Reporting Services. If you want to run the script for  Reporting Services, modify the version portion of the path to the namespace to “v11”, on the Get-WmiObject statement.
7. Run the script.

**Validation**: To verify that the basic report server functionality is working, see the [Verify the configuration](#verify-the-configuration) section later in this topic.

### Use script to configure the report server and HTTPS
To use Windows PowerShell to configure the report server, complete the following steps. The configuration includes HTTPS, not HTTP.

1. From the Azure portal, select the VM and click connect. Depending on your browser configuration, you may be prompted to save an .rdp file for connecting to the VM.
   
    ![connect to azure virtual machine](./media/virtual-machines-windows-classic-ps-sql-report/IC650112.gif) Use the user VM name, user name and password you configured when you created the VM. 
   
    For example, in the following image, the VM name is **ssrsnativecloud** and the user name is **testuser**.
   
    ![login inlcudes vm name](./media/virtual-machines-windows-classic-ps-sql-report/IC764111.png)
2. On the VM, open **Windows PowerShell ISE** with administrative privileges. The PowerShell ISE is installed by default on Windows server 2012. It is recommended you use the ISE instead of a standard Windows PowerShell window so that you can paste the script into the ISE, modify the script, and then run the script.
3. To enable running scripts, run the following Windows PowerShell command:
   
        Set-ExecutionPolicy RemoteSigned
   
    You can then run the following to verify the policy:
   
        Get-ExecutionPolicy
4. In **Windows PowerShell ISE**, click the **View** menu and then click **Show Script Pane**.
5. Copy the following script and paste it into the Windows PowerShell ISE script pane.
   
        ## This script configures the report server, including HTTPS
        $ErrorActionPreference = "Stop"
        $httpsport=443 # modify if you used a different port number when the HTTPS endpoint was created.
   
        # You can run the following command to get (.cloudapp.net certificates) so you can copy the thumbprint / certificate hash
        #dir cert:\LocalMachine -rec | Select-Object * | where {$_.issuer -like "*cloudapp*" -and $_.pspath -like "*root*"} | select dnsnamelist, thumbprint, issuer
        #
        # The certifacte hash is a REQUIRED parameter
        $certificatehash="" 
        # the certificate hash should not contain spaces
   
        if ($certificatehash.Length -lt 1) 
        {
            write-error "certificatehash is a required parameter"
        } 
        # Certificates should be all lower case
        $certificatehash=$certificatehash.ToLower()
        $server = $env:COMPUTERNAME
        # If the certificate is not a wildcard certificate, comment out the following line, and enable the full $DNSNAme reference.
        $DNSName="+"
        #$DNSName="$server.cloudapp.net"
        $DNSNameAndPort = $DNSName + ":$httpsport"
   
        ## Utility method for verifying an operation's result
        function CheckResult
        {
            param($wmi_result, $actionname)
            if ($wmi_result.HRESULT -ne 0) {
                write-error "$actionname failed. Error from WMI: $($wmi_result.Error)"
            }
        }
   
        $starttime=Get-Date
        write-host -foregroundcolor DarkGray $starttime StartTime
   
        ## ReportServer Database name - this can be changed if needed
        $dbName='ReportServer'
   
        write-host "The script will use $DNSNameAndPort as the DNS name and port" 
   
        ## Register for MSReportServer_ConfigurationSetting
        ## Change the version portion of the path to "v11" to use the script for SQL Server 2012
        $RSObject = Get-WmiObject -class "MSReportServer_ConfigurationSetting" -namespace "root\Microsoft\SqlServer\ReportServer\RS_MSSQLSERVER\v12\Admin"
   
        ## Reporting Services Report Server Configuration Steps
   
        ## 1. Setting the web service URL ##
        write-host -foregroundcolor green "Setting the web service URL"
        write-host -foregroundcolor green ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
        $time=Get-Date
        write-host -foregroundcolor DarkGray $time
   
        ## SetVirtualDirectory for ReportServer site
            write-host 'Calling SetVirtualDirectory'
            $r = $RSObject.SetVirtualDirectory('ReportServerWebService','ReportServer',1033)
            CheckResult $r "SetVirtualDirectory for ReportServer"
   
        ## ReserveURL for ReportServerWebService - port 80 (for local usage)
            write-host 'Calling ReserveURL port 80'
            $r = $RSObject.ReserveURL('ReportServerWebService','http://+:80',1033)
            CheckResult $r "ReserveURL for ReportServer port 80" 
   
        ## ReserveURL for ReportServerWebService - port $httpsport
            write-host "Calling ReserveURL port $httpsport, for URL: https://$DNSNameAndPort"
            $r = $RSObject.ReserveURL('ReportServerWebService',"https://$DNSNameAndPort",1033)
            CheckResult $r "ReserveURL for ReportServer port $httpsport" 
   
        ## CreateSSLCertificateBinding for ReportServerWebService port $httpsport
            write-host "Calling CreateSSLCertificateBinding port $httpsport, with certificate hash: $certificatehash"
            $r = $RSObject.CreateSSLCertificateBinding('ReportServerWebService',$certificatehash,'0.0.0.0',$httpsport,1033)
            CheckResult $r "CreateSSLCertificateBinding for ReportServer port $httpsport" 
   
        ## 2. Setting the Database ##
        write-host -foregroundcolor green "Setting the Database"
        write-host -foregroundcolor green ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
        $time=Get-Date
        write-host -foregroundcolor DarkGray $time
   
        ## GenerateDatabaseScript - for creating the database
            write-host "Calling GenerateDatabaseCreationScript for database $dbName"
            $r = $RSObject.GenerateDatabaseCreationScript($dbName,1033,$false)
            CheckResult $r "GenerateDatabaseCreationScript"
            $script = $r.Script
   
        ## Execute sql script to create the database
            write-host 'Executing Database Creation Script'
            $savedcvd = Get-Location
            Import-Module SQLPS                    ## this automatically changes to sqlserver provider
            Invoke-SqlCmd -Query $script
            Set-Location $savedcvd
   
        ## GenerateGrantRightsScript 
            $DBUser = "NT Service\ReportServer"
            write-host "Calling GenerateDatabaseRightsScript with user $DBUser"
            $r = $RSObject.GenerateDatabaseRightsScript($DBUser,$dbName,$false,$true)
            CheckResult $r "GenerateDatabaseRightsScript"
            $script = $r.Script
   
        ## Execute grant rights script
            write-host 'Executing Database Rights Script'
            $savedcvd = Get-Location
            cd sqlserver:\
            Invoke-SqlCmd -Query $script
            Set-Location $savedcvd
   
        ## SetDBConnection - uses Windows Service (type 2), username is ignored
            write-host "Calling SetDatabaseConnection server $server, DB $dbName"
            $r = $RSObject.SetDatabaseConnection($server,$dbName,2,'','')
            CheckResult $r "SetDatabaseConnection"  
   
        ## 3. Setting the Report Manager URL ##
   
        write-host -foregroundcolor green "Setting the Report Manager URL"
        write-host -foregroundcolor green ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
        $time=Get-Date
        write-host -foregroundcolor DarkGray $time
   
        ## SetVirtualDirectory for Reports (Report Manager) site
            write-host 'Calling SetVirtualDirectory'
            $r = $RSObject.SetVirtualDirectory('ReportManager','Reports',1033)
            CheckResult $r "SetVirtualDirectory"
   
        ## ReserveURL for ReportManager  - port 80
            write-host 'Calling ReserveURL for ReportManager, port 80'
            $r = $RSObject.ReserveURL('ReportManager','http://+:80',1033)
            CheckResult $r "ReserveURL for ReportManager port 80"
   
        ## ReserveURL for ReportManager - port $httpsport
            write-host "Calling ReserveURL port $httpsport, for URL: https://$DNSNameAndPort"
            $r = $RSObject.ReserveURL('ReportManager',"https://$DNSNameAndPort",1033)
            CheckResult $r "ReserveURL for ReportManager port $httpsport" 
   
        ## CreateSSLCertificateBinding for ReportManager port $httpsport
            write-host "Calling CreateSSLCertificateBinding port $httpsport with certificate hash: $certificatehash"
            $r = $RSObject.CreateSSLCertificateBinding('ReportManager',$certificatehash,'0.0.0.0',$httpsport,1033)
            CheckResult $r "CreateSSLCertificateBinding for ReportManager port $httpsport" 
   
        write-host -foregroundcolor green "Open Firewall port for $httpsport"
        write-host -foregroundcolor green ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
        $time=Get-Date
        write-host -foregroundcolor DarkGray $time
   
        ## Open Firewall port for $httpsport
            New-NetFirewallRule -DisplayName “Report Server (TCP on port $httpsport)” -Direction Inbound –Protocol TCP –LocalPort $httpsport
            write-host "Added rule Report Server (TCP on port $httpsport) in Windows Firewall"
   
        write-host 'Operations completed, Report Server is ready'
        write-host -foregroundcolor DarkGray $starttime StartTime
        $time=Get-Date
        write-host -foregroundcolor DarkGray $time
6. Modify the **$certificatehash** parameter in the script:
   
   * This is a **required** parameter. If you did not save the certificate value from the previous steps, use one of the following methods to copy the certificate hash value from the certificates thumbprint.:
     
       On the VM, open Windows PowerShell ISE and run the following command:
     
           dir cert:\LocalMachine -rec | Select-Object * | where {$_.issuer -like "*cloudapp*" -and $_.pspath -like "*root*"} | select dnsnamelist, thumbprint, issuer
     
       The output will look similar to the following. If the script returns a blank line, the VM does not have a certificate configured for example, see the section [To use the Virtual Machines Self-signed Certificate](#to-use-the-virtual-machines-self-signed-certificate).
     
     OR
   * On the VM Run mmc.exe and then add the **Certificates** snap-in.
   * Under the **Trusted Root Certificate Authorities** node double-click your certificate name. If you are using the self-signed certificate of the VM, the certificate is named after the DNS name of the VM and ends with **cloudapp.net**.
   * Click the **Details** tab.
   * Click **Thumbprint**. The value of the thumbprint is displayed in the details field, for example af 11 60 b6 4b 28 8d 89 0a 82 12 ff 6b a9 c3 66 4f 31 90 48
   * **Before you run the script**, remove the spaces in between the pairs of values. For example af1160b64b288d890a8212ff6ba9c3664f319048
7. Modify the **$httpsport** parameter: 
   
   * If you used port 443 for the HTTPS endpoint, then you do not need to update this parameter in the script. Otherwise use the port value you selected when you configured the HTTPS private endpoint on the VM.
8. Modify the **$DNSName** parameter: 
   
   * The script is configured for a wild card certificate $DNSName="+". If you do no want to configure for a wildcard certificate binding, comment out $DNSName="+" and enable the following line, the full $DNSNAme reference, ##$DNSName="$server.cloudapp.net".
     
       Change the $DNSName value if you do not want to use the virtual machine’s DNS name for Reporting Services. If you use the parameter, the certificate must also use this name and you register the name globally on a DNS server.
9. The script is currently configured for  Reporting Services. If you want to run the script for  Reporting Services, modify the version portion of the path to the namespace to “v11”, on the Get-WmiObject statement.
10. Run the script.

**Validation**: To verify that the basic report server functionality is working, see the [Verify the configuration](#verify-the-connection) section later in this topic. To verify the certificate binding open a command prompt with administrative privileges, and then run the following command:

    netsh http show sslcert

The result will include the following:

    IP:port                      : 0.0.0.0:443

    Certificate Hash             : f98adf786994c1e4a153f53fe20f94210267d0e7

### Use Configuration Manager to Configure the Report Server
If you do not want to run the PowerShell script to configure the report server, follow the steps in this section to use the Reporting Services native mode configuration manager to configure the report server.

1. From the Azure portal, select the VM and click connect. Use the user name and password you configured when you created the VM.
   
    ![connect to azure virtual machine](./media/virtual-machines-windows-classic-ps-sql-report/IC650112.gif)
2. Run Windows update and install updates to the VM. If a restart of the VM is required, restart the VM and reconnect to the VM from the Azure portal.
3. From the Start menu on the VM, type **Reporting Services** and open **Reporting Services Configuration Manager**.
4. Leave the default values for **Server Name** and **Report Server Instance**. Click **Connect**.
5. In the left pane, click **Web Service URL**.
6. By default, RS is configured for HTTP port 80 with IP “All Assigned”. To add HTTPS:
   
   1. In **SSL Certificate**: select the certificate you want to use, for example [VM name].cloudapp.net. If no certificates are listed, see the section **Step 2: Create a Server Certificate** for information on how to install and trust the certificate on the VM.
   2. Under **SSL Port**: choose 443. If you configured the HTTPS private endpoint in the VM with a different private port, use that value here.
   3. Click **Apply** and wait for the operation to complete.
7. In the left pane, click **Database**.
   
   1. Click **Change Databas**e.
   2. Click **Create a new report server database** and then click **Next**.
   3. Leave the default **Server Name**: as the VM name and leave the default **Authentication Type** as **Current User** – **Integrated Security**. Click **Next**.
   4. Leave the default **Database Name** as **ReportServer** and click **Next**.
   5. Leave the default **Authentication Type** as **Service Credentials** and click **Next**.
   6. Click **Next** on the **Summary** page.
   7. When the configuration is complete, click **Finish**.
8. In the left pane, click **Report Manager URL**. Leave the default **Virtual Directory** as **Reports** and click **Apply**.
9. Click **Exit** to close the Reporting Services Configuration Manager.

## Step 4: Open Windows Firewall Port
> [!NOTE]
> If you used one of the scripts to configure the report server, you can skip this section. The script included a step to open the firewall port. The default was port 80 for HTTP and port 443 for HTTPS.
> 
> 

To connect remotely to Report Manager or the Report Server on the virtual machine, a TCP Endpoint is required on the VM. It is required to open the same port in the VM’s firewall. The endpoint was created when the VM was provisioned.

This section provides basic information on how to open the firewall port. For more information, see [Configure a Firewall for Report Server Access](https://technet.microsoft.com/library/bb934283.aspx)

> [!NOTE]
> If you used the script to configure the report server, you can skip this section. The script included a step to open the firewall port.
> 
> 

If you configured a private port for HTTPS other than 443, modify the following script appropriately. To open port **443** on the Windows Firewall, complete the following:

1. Open a Windows PowerShell window with administrative privileges.
2. If you used a port other than 443 when you configured the HTTPS endpoint on the VM, update the port in the following command and then run the command:
   
        New-NetFirewallRule -DisplayName “Report Server (TCP on port 443)” -Direction Inbound –Protocol TCP –LocalPort 443
3. When the command completes, **Ok** is displayed in the command prompt.

To verify that the port is opened, open a Windows PowerShell window and run the following command:

    get-netfirewallrule | where {$_.displayname -like "*report*"} | select displayname,enabled,action

## Verify the configuration
To verify that the basic report server functionality is now working, open your browser with administrative privileges and then browse to the following report server ad report manager URLS:

* On the VM, browse to the report server URL:
  
        http://localhost/reportserver
* On the VM, browse to the report manger URL:
  
        http://localhost/Reports
* From your local computer, browse to the **remote** report Manager on the VM. Update the DNS name in the following example as appropriate. When prompted for a password, use the administrator credentials you created when the VM was provisioned. The user name is in the [Domain]\[user name] format, where the domain is the VM computer name, for example ssrsnativecloud\testuser. If you are not using HTTP**S**, remove the **s** in the URL. See the next section for information on creating additional users on VM.
  
        https://ssrsnativecloud.cloudapp.net/Reports
* From your local computer, browse to the remote report server URL. Update the DNS name in the following example as appropriate. If you are not using HTTPS, remove the s in the URL.
  
        https://ssrsnativecloud.cloudapp.net/ReportServer

## Create Users and Assign Roles
After configuring and verifying the report server, a common administrative task is to create one or more users and assign users to Reporting Services roles. For more information, see the following:

* [Create a local user account](https://technet.microsoft.com/library/cc770642.aspx)
* [Grant User Access to a Report Server (Report Manager)](https://msdn.microsoft.com/library/ms156034.aspx))
* [Create and Manage Role Assignments](https://msdn.microsoft.com/library/ms155843.aspx)

## To Create and Publish Reports to the Azure Virtual Machine
The following table summarizes some of the options available to publish existing reports from an on-premises computer to the report server hosted on the Microsoft Azure Virtual Machine:

* **RS.exe script**: Use RS.exe script to copy report items from and existing report server to your Microsoft Azure Virtual Machine. For more information, see the section “Native mode to Native Mode – Microsoft Azure Virtual Machine” in [Sample Reporting Services rs.exe Script to Migrate Content between Report Servers](https://msdn.microsoft.com/library/dn531017.aspx).
* **Report Builder**: The virtual machine includes the click-once version of Microsoft SQL Server Report Builder. To start Report builder the first time on the virtual machine:
  
  1. Start your browser with administrative privileges.
  2. Browse to report manager on the virtual machine and click **Report Builder**  in the ribbon.
     
     For more information, see [Installing, Uninstalling, and Supporting Report Builder](https://technet.microsoft.com/library/dd207038.aspx).
* **SQL Server Data Tools: VM**:  If you created the VM with SQL Server 2012, then SQL Server Data Tools is installed on the virtual machine and can be used to create **Report Server Projects** and reports on the virtual machine. SQL Server Data Tools can publish the reports to the report server on the virtual machine.
  
    If you created the VM with SQL server 2014, you can install SQL Server Data Tools- BI for visual Studio. For more information, see the following:
  
  * [Microsoft SQL Server Data Tools - Business Intelligence for Visual Studio 2013](https://www.microsoft.com/download/details.aspx?id=42313)
  * [Microsoft SQL Server Data Tools - Business Intelligence for Visual Studio 2012](https://www.microsoft.com/download/details.aspx?id=36843)
  * [SQL Server Data Tools and SQL Server Business Intelligence (SSDT-BI)](https://docs.microsoft.com/sql/ssdt/previous-releases-of-sql-server-data-tools-ssdt-and-ssdt-bi)
* **SQL Server Data Tools: Remote**:  On your local computer, create a Reporting Services project in SQL Server Data Tools that contains Reporting Services reports. Configure the project to connect to the web service URL.
  
    ![ssdt project properties for SSRS project](./media/virtual-machines-windows-classic-ps-sql-report/IC650114.gif)
* **Use script**: Use script to copy report server content. For more information, see [Sample Reporting Services rs.exe Script to Migrate Content between Report Servers](https://msdn.microsoft.com/library/dn531017.aspx).

## Minimize cost if you are not using the VM
> [!NOTE]
> To minimize charges for your Azure Virtual Machines when not in use, shut down the VM from the Azure portal. If you use the Windows power options inside a VM to shut down the VM, you are still charged the same amount for the VM. To reduce charges, you need to shut down the VM in the Azure portal. If you no longer need the VM, remember to delete the VM and the associated .vhd files to avoid storage charges.For more information, see the FAQ section at [Virtual Machines Pricing Details](https://azure.microsoft.com/pricing/details/virtual-machines/).

## More Information
### Resources
* For similar content related to a single server deployment of SQL Server Business Intelligence and SharePoint 2013, see [Use Windows PowerShell to Create an Azure VM With SQL Server BI and SharePoint 2013](https://blogs.technet.microsoft.com/ptsblog/2013/10/24/use-powershell-to-create-a-windows-azure-vm-with-sql-server-bi-and-sharepoint-2013/).
* For General information related to deployments of SQL Server Business Intelligence in Azure Virtual Machines, see [SQL Server Business Intelligence in Azure Virtual Machines](virtual-machines-windows-classic-ps-sql-bi.md).
* For more information about the cost of Azure compute charges, see the Virtual Machines tab of [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/?scenario=virtual-machines).

### Community Content
* For step by step instructions on how to create a Reporting Services Native mode report server without using script, see [Hosting SQL Reporting Service on Azure Virtual Machine](http://adititechnologiesblog.blogspot.in/2012/07/hosting-sql-reporting-service-on-azure.html).

### Links to other resources for SQL Server in Azure VMs
[SQL Server on Azure Virtual Machines Overview](../sql/virtual-machines-windows-sql-server-iaas-overview.md)

