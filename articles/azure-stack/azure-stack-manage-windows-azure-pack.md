---
title: Manage Windows Azure Pack virtual machines from Azure Stack | Microsoft Docs
description: Learn how to manage Windows Azure Pack (WAP) VMs from the user portal in Azure Stack.
services: azure-stack
documentationcenter: ''
author: walterov
manager: byronr
editor: ''

ms.assetid: 213c2792-d404-4b44-8340-235adf3f8f0b
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/10/2017
ms.author: walterov

---
# Manage Windows Azure Pack virtual machines from Azure Stack
In the Azure Stack Development Kit, you can enable access from the Azure Stack user portal to tenant virtual machines running on Windows Azure Pack. Tenants can use the Azure Stack portal to manage their existing IaaS virtual machines and virtual networks. These resources are made available on Windows Azure Pack through the underlying Service Provider Foundation (SPF) and Virtual Machine Manager (VMM) components. Specifically, tenants can:

* Browse resources
* Examine configuration values
* Stop or start a virtual machine
* Connect to a virtual machine through Remote Desktop Protocol (RDP)
* Create and manage checkpoints
* Delete virtual machines and virtual networks

This functionality is provided by the Windows Azure Pack Connector for Azure Stack (Preview). This article shows how to configure the connector for a single-node Azure Stack environment.

For this preview release of the connector, be aware of the following:
* Use the Windows Azure Pack Connector only in test environments (for both Azure Stack and Windows Azure Pack), and not in production deployments.
* You must have Windows Azure Pack Update Rollup (UR) 9.1 or later and System Center SPF and VMM UR 9 or later.
* The VMM and SPF components can be either System Center 2012 R2 or System Center 2016.
* You must perform configuration steps on both Azure Stack and on Windows Azure Pack.
* The instructions apply to non-Cloud Platform System (CPS) environments.
* To review the known issues, see [Microsoft Azure Stack troubleshooting](azure-stack-troubleshooting.md).


## Architecture
The following diagram shows the main components of the Windows Azure Pack Connector.

![The Windows Azure Pack Connector components](media/azure-stack-manage-wap/image1.png)

Notice the following details:
* The Azure Stack user portal accesses the resource information from both clouds (Azure Stack and Windows Azure Pack).
* The user must have an account that is valid in both environments.
* The Azure Stack user portal must have network access to the components running on Windows Azure Pack.
* In the **WAP** section of the diagram, you can see the new Windows Azure Pack Connector modules (WAP Extension and Connector) and the existing Windows Azure Pack Tenant API with SPF and VMM components.


## Identity management
The Windows Azure Pack Tenant API must trust the Azure Stack security token service (STS).

When a user performs an action through the Azure Stack portal that targets Windows Azure Pack resources, the portal uses the Windows Azure Pack Tenant API. Therefore, the provided user authentication token must come from a trusted STS. See the following diagram:

![Diagram of Windows Azure Pack Connector authentication](media/azure-stack-manage-wap/image2.png)

In the development kit environment, Windows Azure Pack and Azure Stack have independent identity providers. Users who access both environments from the Azure Stack portal must have the same user principal name (UPN) name in both identity providers. For example, the account *azurestackadmin@azurestack.local* should also exist in the STS for Windows Azure Pack. Where AD FS is not set up to support outbound trust relationships, you will establish trust from the Windows Azure Pack components (Tenant API) to the Azure Stack instance of AD FS.

## Prerequisites

### Download the Windows Azure Pack Connector
On the [Microsoft Download Center](https://aka.ms/wapconnectorazurestackdlc), download the .exe file and extract it to your local computer. Later, you copy the contents to a computer that can access your Windows Azure Pack environment.

### Deployment option requirement
To integrate with Windows Azure Pack, you can deploy Azure Stack by using the AD FS option or the Azure Active Directory option.

### Connectivity requirements
1. From the computer on which you access the Azure Stack user portal, make sure that you can access the Windows Azure Pack tenant portal through the web browser.
2. The AzS-WASP01 virtual machine on Azure Stack must be able to connect to the Windows Azure Pack tenant portal computer. Use Ping.exe to verify network connectivity. 
3.	You must have valid certificates for the new Connector services. These SSL certificates must be issued by a trusted certification authority (CA). You can't use self-signed certificates. The SSL certificates must be trusted by Azure Stack (specifically the AzS-WASP01 VM) and any other computer that the tenant may use to access the Azure Stack user portal.
 
    >[!NOTE]
    Because AzS-WASP01 runs Windows Server with the Server Core installation option, you can use a command-line tool such as Certutil.ext to import the certificate. For example, you could copy the .cer file to c:\temp on AzS-WASP01, and then run the command **certutil -addstore "CA" "c:\temp\certname.cer"**.

4.	To establish RDP connectivity to Windows Azure Pack tenant virtual machines through the Azure Stack portal, the Windows Azure Pack environment must allow Remote Desktop traffic to the tenant VMs.
5.	For connectivity between Azure Stack tenant virtual machines and Windows Azure Pack tenant virtual machines, their external IP addresses must be routable across the two environments. This connectivity could also include associating a DNS server to resolve virtual machine names between the environments.

### IIS requirements
The computer that hosts the Windows Azure Pack tenant portal (which may be a physical host, a virtual machine, or multiple virtual machines) must have the URL Rewrite IIS extension installed. If it is not already installed, you can download it from [here](https://www.iis.net/downloads/microsoft/url-rewrite). If multiple virtual machines host the tenant portal, install the extension on each virtual machine.

## Configure Azure Stack
Before you configure the Windows Azure Pack Connector, you must enable multi-cloud mode in the Azure Stack user portal. This mode enables users to select from which cloud to access resources.

To enable multi-cloud mode, you must run the Add-AzurePackConnector.ps1 script after Azure Stack deployment. The following table describes the script parameters.


|  Parameter | Description | Example |   
| -------- | ------------- | ------- |  
| AzurePackClouds | URIs of the Windows Azure Pack Connectors. These URIs should correspond to the Windows Azure Pack tenant portals. | @{CloudName = "AzurePack1"; CloudEndpoint = "https://waptenantportal1:40005"},@{CloudName = "AzurePack2"; CloudEndpoint = "https://waptenantportal2:40005"}<br><br>  (By default, the port value is 40005.) |  
| AzureStackCloudName | Label to represent the local Azure Stack cloud.| "AzureStack" |
| DisableMultiCloud | A switch to disable multi-cloud mode.| N/A |
| | |

You can run the Add-AzurePackConnector.ps1 script immediately after deployment, or later. To run the script immediately after deployment, use the same Windows PowerShell session where Azure Stack deployment completed. Otherwise, you can open a new Windows PowerShell session as an administrator (signed in as the azurestackadmin account).

1. Run the Add-AzurePackConnector.ps1 script by using the following commands (with values specific to your environment). Notice that the Add-AzurePackConnector script enables you to add more than one Windows Azure Pack Connector endpoint.
 
 ```powershell
 $cred = New-Object System.Management.Automation.PSCredential("cloudadmin@azurestack.local", `
    (ConvertTo-SecureString -String "<password>" -AsPlainText -Force))
 $session = New-PSSession -ComputerName 'azs-ercs01' -Credential $cred `
   -ConfigurationName PrivilegedEndpoint -Authentication Credssp

# Enable Multicloud
 Invoke-Command -Session $session -ScriptBlock { Add-AzurePackConnector -AzurePackClouds `
     @{CloudName = "AzurePack_1"; CloudEndpoint = "https://waptenantportal1:40005"},`
     @{CloudName = "AzurePack_2"; CloudEndpoint = "https://waptenantportal2:40005" } `
     -AzureStackCloudName "AzureStack" }

 ```

> [!NOTE]
> In the current build there is an issue where after the Add-AzurePackConnector script ends, it remains in a polling loop for an extended period of time (several minutes) until it ends. After you see the message **VERBOSE: Step 'Configure Azure Pack Connector' status: 'Success'**, you can stop the script or wait until it stops by itself. It won’t make a difference because the configuration has already succeeded.

2. Make note of the output files that are produced by this script, one for each Windows Azure Pack environment that you specified. The files are located at:  \\\su1fileserver\SU1_Infrastructure_1\AzurePackConnectorOutput. These files contain the information that is required to configure the target Windows Azure Pack environments. You pass this file as a parameter to a script later in these instructions. This file contains the following information:

    * **AzurePackConnectorEndpoint**: Contains the endpoint to the Windows Azure Pack Connector service.
    * **AuthenticationIdentityProviderPartner**: Contains the following value pair:
        * Authentication Token signing certificate that the Windows Azure Pack Tenant API needs to trust to accept calls from the Azure Stack portal extension.

        * The "Realm" associated with the signing certificate. For example: https://adfs.local.azurestack.global.external/adfs/c1d72562-534e-4aa5-92aa-d65df289a107/.

3.	Browse to the folder that contains the output files (\\su1fileserver\SU1_Infrastructure_1\AzurePackConnectorOutput), and copy the files to your local computer. The files will look similar to this: AzurePack-06-27-15-50.txt.

4.	Test the configuration.

    a. Open your browser and sign in to the Azure Stack user portal (https://portal.local.azurestack.external/).
    
    b. After you sign in as a tenant and the portal loads, you'll see errors about not being able to fetch subscriptions or extensions from the Azure Pack cloud. Click **OK** to close these messages. (These error messages will go away after you configure Windows Azure Pack.)

    c. Notice the **Cloud** drop-down list in the upper-left corner of the portal.

    ![The cloud selector in the Azure Stack user interface](media/azure-stack-manage-wap/image3.png)

## Configure Windows Azure Pack
For this Connector preview release only, Windows Azure Pack requires manual configuration.

>[!IMPORTANT]
For this preview release, use the Windows Azure Pack Connector only in test environments, and not in production deployments.

1.	Install Connector MSI files on the Windows Azure Pack tenant portal virtual machine, and install certificates. (If you have multiple tenant portal virtual machines, you must complete this step on each virtual machine.)

    a. In File Explorer, copy the **WAPConnector** folder (what you downloaded earlier) to a folder named **c:\temp** in the tenant portal virtual machine.

    b. Open a Console or RDP connection to the tenant portal virtual machine.

    c. Change directories to **c:\temp\wapconnector\setup\scripts**, and run the **Install-Connector.ps1** script to install three MSI files. No parameters are required.

     ```powershell
    cd C:\temp\wapconnector\setup\scripts\

    .\Install-Connector.ps1
    ```
     d. Change directories to **c:\inetpub** and verify that the three new sites are installed:

       * MgmtSvc-Connector

       * MgmtSvc-ConnectorExtension

       * MgmtSvc-ConnectorController

    e. From the same **c:\temp\wapconnector\setup\scripts** folder, run the **Configure-Certificates.ps1** script to install certificates. By default, it will use the same certificate that is available for the Tenant Portal site in Windows Azure Pack. Make sure this is a valid certificate (trusted by the Azure Stack AzS-WASP01 virtual machine and any client computer that accesses the Azure Stack portal). Otherwise, communication won’t work. (Alternatively, you can explicitly pass a certificate thumbprint as a parameter by using the -Thumbprint parameter.)

     ```powershell
        cd C:\temp\wapconnector\setup\scripts\

        .\Configure-Certificates.ps1
    ```

    f. To finish the configuration of these three services, run the **Configure-WapConnector.ps1** script to update the Web.config file parameters.

    |  Parameter | Description | Example |   
    | -------- | ------------- | ------- |  
    | TenantPortalFQDN | The Windows Azure Pack tenant portal FQDN. | tenant.contoso.com | 
    | TenantAPIFQDN | The Windows Azure Pack Tenant API FQDN. | tenantapi.contoso.com  |
    | AzureStackPortalFQDN | The Azure Stack user portal FQDN. | portal.local.azurestack.external |
    | | |
    
     ```powershell
    .\Configure-WapConnector.ps1 -TenantPortalFQDN "tenant.contoso.com" `
         -TenantAPIFQDN "tenantapi.contoso.com" `
         -AzureStackPortalFQDN "portal.local.azurestack.external"
    ```
    g. If you have multiple tenant portal virtual machines, repeat step 1 for each of these virtual machines.

2. Install the new Tenant API MSI on each Windows Azure Pack Tenant API virtual machine.

    a. If a load balancer is in use, you may want to mark the virtual machine as offline.

    b. In File Explorer, copy the **WAPConnector** folder to a folder named **c:\temp** on each Tenant API machine.

    c. Copy the AzurePackConnectorOutput.txt file that you saved earlier, to **c:\temp\WAPConnector**.

    d. Open a Console or RDP connection to the Tenant API VM you copied the files to.
    
    e. Change directories to **c:\temp\wapconnector\setup\scripts**, and run **Update-TenantAPI.ps1**. This new version of the WAP Tenant API contains a change to enable a trust relationship not only with the current STS, but also with the instance of AD FS in Azure Stack.

     ```powershell
    cd C:\temp\wapconnector\setup\packages\

    .\Update-TenantAPI.ps1
    ```

    f.	Repeat step 2 on any other virtual machine running the Tenant API.
3. From **only one** of the Tenant API VMs, run the Configure-TrustAzureStack.ps1 script to add a trust relationship between the Tenant API and the AD FS instance on Azure Stack. You must use an account with sysadmin access to the Microsoft.MgmtSvc.Store database. This script has the following parameters:

    | Parameter | Description | Example |
    | --------- | ------------| ------- |
   | SqlServer | The name of the SQL Server that contains the Microsoft.MgmtSvc.Store database. This parameter is required. | SQLServer | 
   | DataFile | The output file that was generated during the configuration of the Azure Stack multi-cloud mode earlier. This parameter is required. | AzurePack-06-27-15-50.txt | 
   | PromptForSqlCredential | Indicates that the script should prompt you interactively for a SQL Authentication credential to use when connecting to the SQL Server instance. The given credential must have sufficient permissions to uninstall databases, schemas, and delete user logins. If none is provided, the script assumes that current user context has access. | No value is needed. |
   |  |  |

    If you don't know the SQL Server to use, you can discover it. Connect to the Tenant API computer, use the Unprotect-MgmtSvc command to unprotect the Tenant API Web.config file, and look for the server name in the connection string. Remember to run Protect-MgmtSvc again to protect the Tenant API Web.config file.

  ```powershell
  cd C:\temp\wapconnector\setup\scripts\

 .\Configure-TrustAzureStack.ps1 -SqlServer "SQLServer" `
       -DataFile "C:\temp\wapconnector\AzurePackConnectorOutput.txt"
  ```

## Example
The following example shows a complete Windows Azure Pack Connector deployment on a single-node Azure Stack configuration and two Windows Azure Pack Express installations. (Each Express installation is on a single computer, with the example names *wapcomputer1* and*wapcomputer2*.)

```powershell
# Run the following script on the Azure Stack host
$cred = New-Object System.Management.Automation.PSCredential("cloudadmin@azurestack.local",`
     (ConvertTo-SecureString -String "p@ssw0rd" -AsPlainText -Force))
$session = New-PSSession -ComputerName 'azs-ercs01' -Credential $cred `
     -ConfigurationName PrivilegedEndpoint -Authentication Credssp
 
# Enable Multicloud
invoke-command -Session $session -ScriptBlock { Add-AzurePackConnector -AzurePackClouds `
     @{CloudName = "AzurePack_1"; CloudEndpoint = "https://wapcomputer1.contoso.com:40005"},`
     @{CloudName = "AzurePack_2"; CloudEndpoint = "https://wapcomputer2.contoso.com:40005"}`
     -AzureStackCloudName "AzureStack" }  

```
Download the .exe file from the [Microsoft Download Center](https://aka.ms/wapconnectorazurestackdlc), extract it, and copy the WAPConnector folder to a **c:\temp** folder on the Windows Azure Pack computer. Copy the files that were generated as output in the previous script (located at \\\su1fileserver\SU1_Infrastructure_1\AzurePackConnectorOutput) to the **c:\temp\WAPConnector** folder. (The files will looks similar to this: AzurePack-06-27-15-50.txt.) Then, run the following script, once per instance of Windows Azure Pack:

 ```powershell
# Install Connector components
cd C:\temp\WAPConnector\Setup\Scripts
.\Install-Connector.ps1

# Configure Certificates for the new Connector services
.\Configure-Certificates.ps1

# Configure the Connector services
.\Configure-WapConnector.ps1 -TenantPortalFQDN "wapcomputer1.contoso.com" `
     -TenantAPIFQDN "wapcomputer1.contoso.com" `
     -AzureStackPortalFQDN "portal.local.azurestack.external"

# Install the updated TenantAPI
.\Update-TenantAPI.ps1

# Establish trust with the Azure Stack AD FS
.\Configure-TrustAzureStack.ps1 -SqlServer "wapcomputer1" `
     -DataFile "C:\temp\wapconnector\AzurePack-06-27-15-50.txt" 

```
## Troubleshooting tips
1.	Ensure there is network connectivity between Azure Stack and Windows Azure Pack. This connectivity should be between any tenant computer that accesses the Azure Stack portal and the Windows Azure Pack tenant portal virtual machine where the new Connector services are running.
2.	Ensure that all specified FQDNs are correct.
3.	Ensure that the SSL certificates used in the new Connector services are trusted by Azure Stack (specifically the AzS-WASP01 VM) and any other computer the tenant may use to access the Azure Stack user portal.
4. For known issues, see [Microsoft Azure Stack troubleshooting](azure-stack-troubleshooting.md).

  ## Next steps
[Using the administrator and user portals in Azure Stack](azure-stack-manage-portals.md)
