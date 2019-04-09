---
title: Windows Virtual Desktop Troubleshooting Guide for set up - Azure
description: How to resolve common issues when you set up a Windows Virtual Desktop tenant environment.
services: virtual-desktop
author: ChJenk

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 04/08/2019
ms.author: v-chjenk
---
# Windows Virtual Desktop Troubleshooting Guide

This article describes some common issues you may encounter when setting up a Windows Virtual Desktop tenant environment and provides information on how to resolve the issues.

## Overview

Windows Virtual Desktop (WVD) is a multi-tenant service hosted by Microsoft that manages connections between RD clients and isolated Windows Virtual Desktop tenant environments. A tenant environment lets end users connect to published apps and desktops.

Each WVD tenant environment consists of one or more host pools. Each host pool consists of one or more identical session hosts. The session hosts are virtual machines (VMs) running different Windows operating systems. Each session host must have a WVD host agent installed and registered with the Windows Virtual Desktop service.

> [Azure.NOTE] Windows 10 Enterprise multi-session is the recommended operating system to use for session host virtual machines (VMs). If you’re using Windows Server 2016 or 2012 R2 Remote Desktop Session Host (RDSH) for your session host VMs, you’ll also need to install or enable a protocol stack on the session host to support connections between the session host and the Windows Virtual Desktop service. This is known as “reverse-connect” and eliminates the need for inbound ports to be opened to the Windows Virtual Desktop tenant environment. The opposite of "reverse-connect" is “forward-connect” and requires an inbound 3389 port be opened to the Windows Virtual Desktop tenant environment.

Each host pool may have one or more app groups. An app group is a logical grouping of applications that are installed on the session hosts in the host pool. There are two types of app groups:

- Desktop
- RemoteApp

A *desktop app group* publishes the full desktop and provides access to all the apps installed on the session hosts in the host pool. A *RemoteApp app group* publishes one or more RemoteApps that display on the Remote Desktop client as the application window on the desktop of a local Remote Desktop client.

## Escalation tracks

Use the following table to identify and resolve issues you may encounter when setting up a tenant environment using Remote Desktop client.

| **If you have an issue with:**                                       | **Use this information to resolve the issue:**  |
|----------------------------------------------------------------------|-------------------------------------------------|
| Creating a Tenant                                                    | If there's an Azure outage, contact [Azure Support](https://azure.microsoft.com/support/options/); otherwise contact **RDS/WVD support**.|
| Accessing Marketplace templates in Azure Portal         | If there is an Azure outage contact [Azure Support](https://azure.microsoft.com/support/options/). (Azure Marketplace WVD templates are freely available.)|
| Accessing ARM templates via GitHub                                   | If the issue is not covered in **Issues executing create and provision new WVD host pool**, contact the [GitHub support team](https://github.com/contact). If the error occurs after accessing the template in GitHub, contact [Azure Support](https://azure.microsoft.com/support/options/).|
| Session host pool VNET and Express Route settings                    | Contact **Azure Support (Networking)**. |
| Session host pool VM creation when ARM templates provided with WVD are not being used | Contact **Azure Support (Compute)**. For issue with the ARM templates provided with WVD, see **Creating WVD tenant**. |
| Managing WVD session host environment from the Azure management portal                | Contact **Azure Support**. For management issues when using **RDS/WVD PowerShell**, troubleshoot using **Management with PowerShell** or contact the **RDS/WVD support team**. |
| Managing WVD configuration tied to host pools and application groups (appgroups)      | Troubleshoot using **Management with PowerShell**, or contact **RDS/WVD support team**. If issues are tied to the sample graphical user interface (GUI), reach out to the Yammer community.|
| Remote desktop clients crash on start                                                 | Troubleshoot using **Client connection issues** and if this doesn't resolve the issue, contact **RDS/WVD support team**. If it's a network issues, your users need to contact their network administrator. |
| Connected but no feed                                                                 | Troubleshoot using **User connects but nothing is displayed (no feed)**. If your users have been assigned to an appgroup, escalate to the **RDS/WVD support team**. |
| Feed discovery problems due to the network                                            | Your users need to contact their network administrator. |
| Connecting clients                                                                    | Troubleshoot using **Session host VMs configuration** and **Client connection issues**. |
| Responsiveness of remote applications or desktop                                      | Troubleshoot using **Performance and usability issues**. If issues are tied to a specific application or product, contact the team responsible for that product. |
| Licensing messages or errors                                                          | If issues are tied to a specific application or product, contact the team responsible for that product.|

## Setup issues

This section covers potential issues during the initial setup of the WVD tenant and the related session host pool infrastructure.

### Acquiring the Windows 10 Enterprise multi-session image

To use the Windows 10 Enterprise multi-session image, select [Windows 10 Enterprise for Virtual Desktops Preview, Version 1809](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftwindowsdesktop.windows-10?tab=PlansAndPrice) from the [Azure Marketplace](https://azuremarketplace.microsoft.com/).

### Creating WVD tenant

During the private and public preview creation of the WVD, the tenant will be completed by the RDS/WVD team.

### Creating WVD session host VMs

> [AZURE.NOTE] Session host VMs can be created using multiple methods but RDS/WVD teams only support VM provisioning issues resulting from the usage of the Azure ARM template for creating new host pool. The Azure ARM template is available in [Azure Marketplace](https://azuremarketplace.microsoft.com/) and [GitHub](https://github.com/).

### Issues executing “Windows Virtual Desktop – Provision a host pool”

**Error**: When using the link from GitHub, the message “Create a free account" appears.

![Create a free account]](media/be615904ace9832754f0669de28abd94.png)

**Cause 1:** There are no active subscriptions in the account being used to log into Azure or the account being used does not have permissions to view the subscriptions.

**Fix 1:** Sign in with an account that has been granted at a minimum contributor access to the subscription where session host VMs are going to be deployed.

**Cause 2:** The subscription being used is part of a CSP tenant.

**Fix 2:** Go to the GitHub location for **Create and provision new WVD host pool** and perform the following steps:

1. Right click on **Deploy to Azure** and select **Copy link address**.
2. Open **Notepad** and paste the link.
3. Before the \# character, insert the CSP end customer tenant name.
4. Open the new link in a browser and the Azure portal will load the template.

>   Example: https://portal.azure.com/\<CSP end customer tenant name\>
>   \#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2FRDS-Templates%2Fmaster%2Fwvd-templates%2FCreate%20and%20provision%20WVD%20host%20pool%2FmainTemplate.json

### ARM template and DSC errors

Use the steps below to troubleshoot unsuccessful deployments of Azure ARM
templates and DSC.

1. Review errors in the deployment using [View deployment operations with Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-deployment-operations).
2. If there are no errors in the deployment, review errors in the activity log using [View activity logs to audit actions on resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-audit).
3. Once the error is identified, use the error message and the resources in [Troubleshoot common Azure deployment errors with Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-common-deployment-errors) to address the issue.
4. Delete any resources created during the previous deployment and retry deploying the template again.

**Error: Your deployment failed….\<hostname\>/joindomain**

[Deployment details]](media/e72df4d5c05d390620e07f0d7328d50f.png)

> **Example of raw error:** {"code":"DeploymentFailed","message":"At least one resource deployment operation failed. Please list deployment operations for >details. Please see <https://aka.ms/arm-debug> for usage
details.","details":[{"code":"Conflict","message":"{\\r\\n \\"status\\":\\"Failed\\",\\r\\n \\"error\\": {\\r\\n\\"code\\":\\"ResourceDeploymentFailure\\",\\r\\n \\"message\\": \\"The resource operation completed with terminal provisioning state 'Failed'.\\",\\r\\n\\"details\\":[\\r\\n {\\r\\n \\"code\\":\\"VMExtensionProvisioningError\\",\\r\\n\\"message\\": \\"VM has reported a failure when processing extension 'joindomain'. Error message: occured while joining Domain '[diamondsg.onmicrosoft.com](https://nam06.safelinks.protection.outlook.com/?url=http%3A%2F%2Fdiamondsg.onmicrosoft.com&data=02%7C01%7CStefan.Georgiev%40microsoft.com%7C01339d07d3424818eee608d6b0d672e8%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C636890832443357907&sdata=JSaCC4NQEYK0x3wD%2FYIoK97%2Fzeo19JKN4j97UjQmzXc%3D&reserved=0)'}\\r\\n ]\\r\\n }\\r\\n}"}]}

**Cause 1:** Credential provided for joining VMs to the domain are incorrect.

**Fix 1:** See the Incorrect credentials error in the section titled **VMs are not joined to a domain.**

**Cause 2:** Domain name does not resolve.

**Fix 2:** See the Domain name does not resolve error in the section titled **VMs are not joined to a domain.**

**Error:** VMExtensionProvisioningError

GRAPHIC: Your deployment failed. 

**Cause 1:** Transient error with the WVD environment.

**Cause 2:** Transient error with connection.

**Fix:** Confirm WVD environment is healthy by signing in using PowerShell. Complete the manual VM registration steps in the Get started with your WVD tenant document.

**Error:** The Admin Username specified is not allowed.

GRAPHIC: Deployment Failed

> **Example of raw error:** { "id": "/subscriptions/d2cd2b8a-6d8f-4e4b-85ec-ef98cb93cc76/resourceGroups/demoHostDesktop/providers/Microsoft.Resources/deployments/vmCreation-linkedTemplate/operations/76487E2A822284AB", "operationId": "76487E2A822284AB", "properties": { "provisioningOperation": "Create", "provisioningState": "Failed", "timestamp": "2019-01-29T20:53:18.904917Z", "duration": "PT3.0574505S", "trackingId": "1f460af8-34dd-4c03-9359-9ab249a1a005", "statusCode": "BadRequest", "statusMessage": { "error": { "code": "InvalidParameter", "message": "The Admin Username specified is not allowed.", "target": "adminUsername" } }, "targetResource": { "id": "/subscriptions/d2cd2b8a-6d8f-4e4b-85ec-ef98cb93cc76/resourceGroups/demoHostDesktop/providers/Microsoft.Compute/virtualMachines/demoHostv2-1", "resourceType": "Microsoft.Compute/virtualMachines", "resourceName": "demoHostv2-1" } }}

**Cause:** Password provided contains forbidden substrings (admin, administrator, root).

**Fix:** Update username or use different users.

**Error:** VM has reported a failure when processing extension

GRAPHIC: Deployment Failed

> **Example of raw error:** { "id": "/subscriptions/d2cd2b8a-6d8f-4e4b-85ec-ef98cb93cc76/resourceGroups/demoHostD/providers/Microsoft.Resources/deployments/rds.wvd-hostpool4-preview-20190129132410/operations/5A0757AC9E7205D2", "operationId": "5A0757AC9E7205D2", "properties": { "provisioningOperation": "Create", "provisioningState": "Failed", "timestamp": "2019-01-29T21:43:05.1416423Z", "duration": "PT7M56.8150879S", "trackingId": "43c4f71f-557c-4abd-80c3-01f545375455", "statusCode": "Conflict", "statusMessage": { "status": "Failed", "error": { "code": "ResourceDeploymentFailure", "message": "The resource operation completed with terminal provisioning state 'Failed'.", "details": [ { "code": "VMExtensionProvisioningError", "message": "VM has reported a failure when processing extension 'dscextension'. Error message: \"DSC Configuration 'SessionHost' completed with error(s). Following are the first few: PowerShell DSC resource MSFT_ScriptResource failed to execute Set-TargetResource functionality with error message: One or more errors occurred. The SendConfigurationApply function did not succeed.\"." } ] } }, "targetResource": { "id": "/subscriptions/d2cd2b8a-6d8f-4e4b-85ec-ef98cb93cc76/resourceGroups/demoHostD/providers/Microsoft.Compute/virtualMachines/desktop-1/extensions/dscextension", "resourceType": "Microsoft.Compute/virtualMachines/extensions", "resourceName": "desktop-1/dscextension" } }}

**Cause:** DSC extension was not able to get admin access on the VM.

**Fix:** Confirm username and password provided have administrative access on the virtual machine and run the ARM template again.

**Error:** DeploymentFailed – DSC Configuration ‘FirstSessionHost’ completed with Error(s).

GRAPHIC: Screenshot with error details

> **Example of raw Error:** { "code": "DeploymentFailed","message": "At least one resource deployment operation failed. Please list deployment operations for details. 4 Please see https://aka.ms/arm-debug for usage details.","details": [{ "code": "Conflict", "message": "{\r\n \"status\": \"Failed\",\r\n \"error\": {\r\n \"code\": \"ResourceDeploymentFailure\",\r\n \"message\": \"The resource operation completed with terminal provisioning state 'Failed'.\",\r\n \"details\": [\r\n {\r\n \"code\":\"VMExtensionProvisioningError\",\r\n \"message\": \"VM has reported a failure when processing extension 'dscextension'. Error message: \\\"DSC Configuration 'FirstSessionHost' completed with error(s). Following are the first few: PowerShell DSC resource MSFT ScriptResource failed to execute Set-TargetResource functionality with error message: One or more errors occurred. The SendConfigurationApply function did not succeed.\\\".\"\r\n }\r\n ]\r\n }\r\n}"  }

**Cause:** DSC extension was not able to get admin access on the VM.

**Fix:** Confirm username and password provided have administrative access on the virtual machine and run the ARM template again.

**Error:** DeploymentFailed – InvalidResourceReference.

> **Example of raw Error:** {"code":"DeploymentFailed","message":"At least one resource deployment operation failed. Please list deployment operations for details. Please see https://aka.ms/arm-debug for usage details.","details":[{"code":"Conflict","message":"{\r\n \"status\":\"Failed\",\r\n \"error\": {\r\n \"code\": \"ResourceDeploymentFailure\",\r\n\"message\": \"The resource operation completed with terminal provisioning state 'Failed'.\",\r\n \"details\": [\r\n {\r\n \"code\": \"DeploymentFailed\",\r\n\"message\": \"At least one resource deployment operation failed. Please list deployment operations for details. Please see https://aka.ms/arm-debug for usage details.\",\r\n \"details\": [\r\n {\r\n \"code\": \"BadRequest\",\r\n \"message\":\"{\\r\\n \\\"error\\\": {\\r\\n \\\"code\\\": \\\"InvalidResourceReference\\\",\\r\\n\\\"message\\\": \\\"Resource /subscriptions/4b46ada1-921a-40e0-a964-50a4c19530a9/resourceGroups/ernani-wvd-demo/providers/Microsoft.Network/virtualNetworks/wvd-vnet/subnets/default referenced by resource /subscriptions/4b46ada1-921a-40e0-a964-50a4c19530a9/resourceGroups/ernani-wvd-demo/providers/Microsoft.Network/networkInterfaces/erd. Please make sure that the referenced resource exists, and that both resources are in the same region.\\\",\\r\\n\\\"details\\\": []\\r\\n }\\r\\n}\"\r\n }\r\n ]\r\n }\r\n ]\r\n }\r\n}"}]}

**Cause:** Part of the resource group name is used for certain resources being created by the template. Due to the name matching existing resources, the template may select an existing resource from a different group.

**Fix:** When running the ARM template to deploy session host VMs, make the first two characters unique for your subscription resource group name.

**Error:** DeploymentFailed – InvalidResourceReference

> **Example of raw error:** {"code":"DeploymentFailed","message":"At least one resource deployment operation failed. Please list deployment operations for details. Please see https://aka.ms/arm-debug for usage details.","details":[{"code":"Conflict","message":"{\r\n \"status\":\"Failed\",\r\n \"error\": {\r\n \"code\": \"ResourceDeploymentFailure\",\r\n\"message\": \"The resource operation completed with terminal provisioning state 'Failed'.\",\r\n \"details\": [\r\n {\r\n \"code\": \"DeploymentFailed\",\r\n\"message\": \"At least one resource deployment operation failed. Please list deployment operations for details. Please see https://aka.ms/arm-debug for usage details.\",\r\n \"details\": [\r\n {\r\n \"code\": \"BadRequest\",\r\n \"message\":\"{\\r\\n \\\"error\\\": {\\r\\n \\\"code\\\": \\\"InvalidResourceReference\\\",\\r\\n\\\"message\\\": \\\"Resource /subscriptions/4b46ada1-921a-40e0-a964-50a4c19530a9/resourceGroups/ernani-wvd-demo/providers/Microsoft.Network/virtualNetworks/wvd-vnet/subnets/default referenced by resource /subscriptions/4b46ada1-921a-40e0-a964-50a4c19530a9/resourceGroups/ernani-wvd-demo/providers/Microsoft.Network/networkInterfaces/ernani-wvd-demo-0-nic was not found. Please make sure that the referenced resource exists, and that both resources are in the same region.\\\",\\r\\n \\\"details\\\": []\\r\\n }\\r\\n}\"\r\n}\r\n ]\r\n }\r\n ]\r\n }\r\n\

**Cause:** This error is due to having the NIC being created by the ARM template having the same name as another NIC already in the VNET.

**Fix:** Use different host prefix.

**Error:** DeploymentFailed – Error downloading.

> **Raw Error:** \\\"The DSC Extension failed to execute: Error downloading https://catalogartifact.azureedge.net/publicartifacts/rds.wvd-hostpool-3-preview-2dec7a4d-006c-4cc0-965a-02bbe438d6ff-private-preview-1/Artifacts/DSC/Configuration.zip after 29 attempts: The remote name could not be resolved: 'catalogartifact.azureedge.net'.\\nMore information about the failure can be found in the logs located under'C:\\\\WindowsAzure\\\\Logs\\\\Plugins\\\\Microsoft.Powershell.DSC\\\\2.77.0.0' on the VM.\\\"

**Cause:** This is due to either a static route, firewall rule, or NSG blocking download of the zip file tied to the ARM template.

**Fix:** Remove blocking static route, firewall rule, or NSG. Optionally, open the ARM template json file in a text editor, take the link to zip file, and download the resource to a location that is allowed.

## Session host VMs configuration

Use this section to troubleshoot issues when configuring session host VMs.

### VMs are not joined to the domain

Use the following information if you're having issues joining VMs to the domain.

- Join the VM manually using the process in [Join a Windows Server virtual machine to a managed domain](https://docs.microsoft.com/en-us/azure/active-directory-domain-services/Active-directory-ds-admin-guide-join-windows-vm-portal) or via using the [domain join template](https://azure.microsoft.com/en-us/resources/templates/201-vm-domain-join-existing/).
- Try pinging the domain name from command line on VM.
- Review the list of domain join error messages in [Troubleshooting Domain Join Error Messages](https://social.technet.microsoft.com/wiki/contents/articles/1935.troubleshooting-domain-join-error-messages.aspx).

**Error:** Incorrect credentials

**Cause:** There was a typo made when the credentials were entered in the ARM template interface fixes.

**Fix:**

1. Manually add the VMs to a domain.
2. Redeploy once credentials have been confirmed. Reference Get started with your WVD tenant document.
3. Use DSC to join VMs to a domain [BROKEN LINK](https://blogs.technet.microsoft.com/automagically/2015/08/05/domain-join-using-azure-automation-dsc-2/).

**Error:** Timeout waiting for user input.

**Cause:** The account used to complete the domain join may have multi-factor authentication (MFA).

**Fix:**

1. Temporarily remove MFA for the account.
2. Use a service account.

**Error:** Account used during provisioning not having permissions to complete the operation.

**Cause:** The account being used does not have permissions to join VMs to the domain due to compliance and regulations.

**Fix:**

1. Use an account that is a member of the Administrator group.
2. Grant the necessary permissions to the account being used.

**Error:** Domain name does not resolve

**Cause 1:** VMs are in a resource group that is not tied to the virtual network (VNET) where the domain is located.

**Fix 1:** Create VNET peering between the VNET where VMs were provisioned and the VNET where the domain controller (DC) is running. See [Create a virtual network peering - Resource Manager, different subscriptions](https://docs.microsoft.com/en-us/azure/virtual-network/create-peering-different-subscriptions).

**Cause 2:** When using AadService (AADS), DNS entries have not been set.

**Fix 2:** To set domain services, see [Enable Azure Active Directory Domain Services](https://docs.microsoft.com/en-us/azure/active-directory-domain-services/active-directory-ds-getting-started-dns).

### Remote Desktop Infra Agent and Remote Desktop Agent Boot Loader are not installed

The recommended way to provision VMs is using the **Create and provision WVD host pool** ARM template. Installing the RD Infra Agent and RD Agent Boot Loader is part of the template functionality.

Use these steps to confirm the components are installed and to check for error messages.

1. Confirm that the two components are installed by checking in **Control Panel** \>**Programs** \>**Programs and Features**. If **Remote Desktop Infra Agent** and **Remote Desktop Agent Boot Loader** are not visible, this indicates they are not installed on the VM
2. Open **File Explorer** and navigate to **C:\\Windows\\Temp\\scriptlogs.log**. If the file is missing, this indicates that **DSC** that installed the two components was not able to run in the security context provided.
3. If the file **C:\\Windows\\Temp\\scriptlogs.log** is present, open it and check for error messages.

**Error:** Remote Desktop Infra Agent and Remote Desktop Agent Boot Loader are missing. C:\\Windows\\Temp\\scriptlogs.log is also missing.

**Cause 1:** Credentials provided during as input for the ARM template were incorrect or permissions were insufficient.

**Fix 1:** Manually add the missing components to the VMs by following the steps in your **Get started with your WVD tenant** document.

**Cause 2:** DSC was able to start and execute but failed to complete as it was not able to sign in to WVD infra and obtain needed information.

**Fix 2:** Step through the following list. - Make sure account does not have MFA. - Confirm tenant name is accurate and tenant exists in WVD. - Confirm account has at least RDS Contributor permissions.

**Error:** Authentication failed, Error in C:\\Windows\\Temp\\scriptlogs.log

**Cause:** DSC was able to execute but could not connect to WVD.

**Fix:** Check the following list:

- Manually register the VMs with the WVD service.
- Confirm account used for connecting to WVD has permissions on the tenant to create host pools.
- Confirm account does not have MFA.

### Remote Desktop (RD) Agent not registering with the WVD service

When the RD Agent is first installed on the session host VM (either manually or through ARM template/DSC), a registration token must be provided. The following section covers common troubleshooting steps applicable to the RD Agent.

**Error:** The status filed in Get-RdsSessionHost cmdlet shows status as Unavailable.

GRAPHIC: Status in Get-RidsSessionHost cmdlet

**Cause:** The agent is not able to update itself to a new version.

**Fix:** Manually update the agent with these steps:

1. Download a new version of the agent on the session host VM.
2. Launch Task Manager (TM) and in the Service Tab stop the RDAgentBootLoader service.
3. Run the installer for the new version of the RD Agent.
4. When prompted for the registration token, remove the entry INVALID_TOKEN and press next (a new token is not required).
5. Complete the installation Wizard.
6. Open TM and start the RDAgentBootLoader service.

**Error:** RD agent registry entry IsRegistered shows value of 0

**Cause:** Registration token has expired or has been generated with expiration value of 999999.

**Fix:** Follow these steps.

1. If there's already a registration token, remove it with Remove-RDSRegistrationInfo.
2. Generate new token with Rds-NewRegistrationInfo.
3. Confirm that the -ExpriationHours parameter is set to 72 (max value is 99999).

**Error:** RD agent is not reporting heartbeat when running Get-RdsSessionHost

**Cause 1:** RDAgentBootLoader service has been stopped.

**Fix 1:** Launch Task Manager (TM) and, if the Service Tab reports a stopped status for RDAgentBootLoader service, start the service.

**Cause 2:** Port 443 may be closed.

**Fix 2:** Open port 443 using the following steps.

1. Confirm port 443 is open by downloading the PSPing tool from [Sysinternal tools](https://docs.microsoft.com/en-us/sysinternals/downloads/psping).
2. Install PSPing on the session host VM where the agent is running.
3. Open the command prompt as an administrator and issue the command below:

>   psping rdbroker.wvdselfhost.microsoft.com:443

Confirm that PSPing received information back from the RDBroker:

>   PsPing v2.10 - PsPing - ping, latency, bandwidth measurement utility

>   Copyright (C) 2012-2016 Mark Russinovich

>   Sysinternals - www.sysinternals.com

>   TCP connect to 13.77.160.237:443:

>   5 iterations (warmup 1) ping test:

>   Connecting to 13.77.160.237:443 (warmup): from 172.20.17.140:60649: 2.00ms

>   Connecting to 13.77.160.237:443: from 172.20.17.140:60650: 3.83ms

>   Connecting to 13.77.160.237:443: from 172.20.17.140:60652: 2.21ms

>   Connecting to 13.77.160.237:443: from 172.20.17.140:60653: 2.14ms

>   Connecting to 13.77.160.237:443: from 172.20.17.140:60654: 2.12ms

>   TCP connect statistics for 13.77.160.237:443:

>   Sent = 4, Received = 4, Lost = 0 (0% loss),

>   Minimum = 2.12ms, Maximum = 3.83ms, Average = 2.58ms

### Troubleshooting issues with the side-by-side stack

The side-by-side (SxS) stack gets installed with a Microsoft Installer (MSI) on Microsoft Widows Server 2016. For Microsoft Windows 10, SxS is enabled with **enablesxstackrs.ps1**.

There are three main ways SxS gets installed or enabled on session host pool VMs:

- With the **Create and provision new WVD hostpool** ARM template
- By being included and enabled on the master image
- Installed or enabled manually on each VM (or with extensions / PS)

If you're having issues with the the SxS stack, confirm the SxS stack is installed or enabled by issuing **qwinsta** command from **Command Prompt**. 

If SxS stack is installed or enabled, the output of **qwinsta** will list **rdp-sxs** in the output.

GRAPHIC: qwinsta command output

Examine the registry entries listed below and confirm that their values match. If registry keys are missing or values are mismatched, follow guidance in **Getting started with your WVD tenant** on how to reinstall the SxS stack.

    HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Terminal
    Server\\WinStations\\rds-sxs\\"fEnableWinstation":DWORD=1

    HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Terminal
    Server\\ClusterSettings\\"SessionDirectoryListener":rdp-sxs

**Error:** O_REVERSE_CONNECT_STACK_FAILURE

GRAPHIC: Reverse Connect Stack Failure

**Cause:** The SxS stack is not installed on the session host VM.

**Fix:** RDP directly into the session host VM as local administrator. Complete steps in the Get started with your WVD tenant document for installing SxS stack.

**Error:** TBD

 **Fixes:** TBD

### How to re-install SxS stack

For steps on uninstalling the SxS stack, see the **Fix crashed SxS stack** document.

## Client connection issues

Needs an intro

### Web client cannot be opened

Confirm there is internet connectivity by opening another web site; for example, [www.Bing.com](https://www.bing.com).

Use **nslookup** to confirm DNS can resolve the FQDN:

> nslookup rdweb.wvd.microsoft.com

Try connecting with another client, like Remote Desktop client for Windows 7 or Windows 10.

**Error:** Opening other site fails.

**Cause:** Network issues and/or outages.

**Fix:** Contact network support.

**Error:** Nslookup cannot resolve the name.

**Cause:** Network issues and/or outages.

**Fix:** Contact network support

**Error:** Other clients can connect.

**Cause:** Browser is not behaving as expected due to cashed or bad setting, and browser has stopped working.

**Fix:** Use the following steps:

1. Restart browser.
2. Clear browser cookies. See [How to delete cookie files in Internet Explorer](https://support.microsoft.com/en-us/help/278835/how-to-delete-cookie-files-in-internet-explorer).
3. Clear browser cache. See [clear browser cache for your browser](https://binged.it/2RKyfdU).
4. Open browser in Private mode.

### Web client crashes

Try connecting using another browser or client.

**Error:** Other browsers and clients also crash or fail to open.

**Cause:** Network and/or operation system issues or outages.

**Fix:** Contact support teams.

### Web client keeps prompting for credentials

If the Web client keeps prompting for credentials, use the following steps:

1. Confirm web client URL is correct.
2. Confirm that credentials are for the WVD environment tied to the URL.
3. Clear browser cookies. See [How to delete cookie files in Internet Explorer](https://support.microsoft.com/en-us/help/278835/how-to-delete-cookie-files-in-internet-explorer).
4.  Clear browser cache. See [clear browser cache for yourbrowser](https://binged.it/2RKyfdU).
5.  Open browser in Private mode.

### Remote Desktop client for Windows 7 and Windows 10 crashes or cannot be opened

Use following PS cmdlets to cleanup OOB client registries

> Remove-ItemProperty 'HKCU:\\Software\\Microsoft\\Terminal Server

> Client\\Default' -Name FeedURLs

> \#Remove RdClientRadc registry key

> Remove-Item 'HKCU:\\Software\\Microsoft\\RdClientRadc' -Recurse

> \#Remove all files under %appdata%\\RdClientRadc

> Remove-Item C:\\Users\\pavithir\\AppData\\Roaming\\RdClientRadc\\\* -Recurse

Navigate to **%AppData%\\RdClientRadc\\** and delete all content.

Uninstall and reinstall Remote Desktop client for Windows 7 and Windows 10.

### Troubleshooting end user connectivity

In scenarios where users can obtain their feed and see the resource provided to them, there can sometimes be misconfigurations, availability, or performance issues that prevent users from accessing their remote resources. The user gets a messages like the one below:

GRAPHIC: Remote Desktop Connection: Can't connect to the gateway error

Below are general troubleshooting steps and common error codes.

1. Confirm user name and time when issue was experienced.
2. Open **PowerShell** and establish connection to the WVD tenant where the issue was reported.
3. Confirm connection to the correct tenant with **Get-RdsTenant.**
4. If needed set the tenant group context with **Set-RdsContext –TenantGroupt\<TenantGroup\>**.
5. Using **Get-RdsHostPool** and **Get-RdsSessionHost** cmdlets, confirm that troubleshooting is being done on the correct host pool.

Execute the command below to get a list of all failed activities of type connection for the specified time window:

> Get-RdsDiagnosticActivities -TenantName \<TenantName\> -username \<UPN\>\ -StartTime "11/21/2018 1:07:03 PM" -EndTime "11/21/2018 1:27:03 PM" -Outcome Failure - ActivityType Connection

Using the **ActivityId** from the previous cmdlet output, run the command below:

> (Get-RdsDiagnosticActivities -TenantName \$tenant -ActivityId \<ActivityId\>\ - Detailed).Errors

This will produce output of the type show below. Use **ErrorCodeSymbolic** and **ErrorMessage** to troubleshoot the root cause.

> ErrorSource       : \<Source\>

> ErrorOperation    : \<Operation\>

> ErrorCode         : \<Error code\>

> ErrorCodeSymbolic : \<Error code string\>

> ErrorMessage      : \<Error code message\>

> ErrorInternal     : \<Internal for the OS\>

> ReportedBy        : \<Reported by component\>

> Time              : \<Timestampt\>

**Error:** O_ADD_USER_TO_GROUP_FAILED / Failed to add user = ≤username≥ to group = Remote Desktop Users. Reason: Win32.ERROR_NO_SUCH_MEMBER

**Cause:** VM has not been joined to the domain where user object is.

**Fix:** Add VM to the correct domain. See [Join a Windows Server virtual machine to a managed domain](https://docs.microsoft.com/en-us/azure/active-directory-domain-services/active-directory-ds-admin-guide-join-windows-vm-portal).

**Error:** Nslookup cannot resolve the name

**Cause:** Network issues or outages.

**Fix:** Contact network support

**Error:** ConnectionFailedClientProtocolError

**Cause:** VMs that user is attempting to connect to are not domain joined.

**Fix:** Join all VMs that are part of a host pool to the domain controller.

### User connects but nothing is displayed (no feed)

A User can start RD clients and is able to authenticate, however the user does not see any icons in their web discovery feed.

Confirm that the user reporting the issues has been assigned to application groups by using this command line:

> Get-RdsAppGroupUser \<tenantname\> \<hostpoolname\> \<appgroupname\>

Confirm that the user is logging in with the correct credentials.

If the web client is being used, confirm that there are no cached credentials issue.

## Management with PowerShell

This section covers common errors and issues reported when using PowerShell. For more information on RDS PowerShell, please see the **PowerShell Reference(WVD)** document.

### Generic errors

**Error:** The term '\<Cmdlet\>' is not recognized as the name of a cmdlet, function, script file, or operable program.

**Cause:** The \<Cmdlet\> being used is not recognized by PowerShell

**Fix:** Check the following:

- Check the spelling of the name, or if a path was included, verify that the path is correct and try again.

- Confirm spelling of the \<Cmdlet\> as specified in the PowerShell Reference (WVD) document.

- Confirm the RDS PowerShell modules has been imported via Import-Module cmdlet and there were no errors during importing.

- Confirm that the latest version for the RDS PowerShell module is being used.

- Restart PowerShell.

**Error:** TBD

**Cause:** TBD

**Fix:** TBD

### RDS PowerShell piping

Earlier versions (prior to November 15, 2018) of RDS PowerShell were not implementing proper piping of objects. To address the issue, download and import the latest version or RDS PowerShell.

### Add-RdsAccount

> Command: Add-RdsAccount -DeploymentUrl \<URL\>

**Error:** Add-RdsAccount : Specified method is not supported.

**Cause:** RDS PowerShell module was not correctly imported.

**Fix:** Close all PowerShell session. Start PowerShell and re-import RDS PowerShell module.

**Error:** TBD

**Cause:** TBD

**Fix:** TBD

### Add-RdsAppGroupUser

**Command:** Add-RdsAppGroupUser -TenantName <TenantName> -HostPoolName <HostPoolName> -AppGroupName 'Desktop Application Group' -UserPrincipalName <UserName>

**Error:** The specified UserPrincipalName is already assigned to a RemoteApp AppGroup in the specified HostPool.

**Cause:** The username used has been already assigned to an AppGroup of a different type. Users can’t be assigned to both a remote desktop and remote app group under the same session host pool.

**Fix:** If user needs both remote apps and remote desktop, create different host pools or grant user access to remote desktop only, as this will permit the use of any application on the session host VM.

**Command:** Add-RdsAppGroupUser -TenantName <TenantName> -HostPoolName <HostPoolName> -AppGroupName “Desktop Application Group” -UserPrincipalName <UserPrincipalName>

**Error:** The specified UserPrincipalName does not exist in the Azure AD associated with the RD tenant.

**Cause:** The user specified by the -UserPrincipalName cannot be found in the Azure AD tied to the WVD tenant.

**Fix:** Confirm the following:

- User has synched to Azure AD.

- User is not B2C or B2B.

- WVD tenant is tied to correct Azure AD.

### Get-RdsDiagnosticActivities

**Command:** Get-RdsDiagnosticActivities -ActivityId \<ActivityId\>

**Error:** Get-RdsDiagnosticActivities : User is not authorized to query the management service.

**Cause:** -TenantName switch is not specified. Issuing Get-RdsDiagnosticActivities without -TenantName \<TenantName\> will query the entire WVD service, which is not allowed.

**Fix:** Issue Get-RdsDiagnosticActivities with -TenantName \<TenantName\>.

**Command:** Get-RdsDiagnosticActivities -Deployment -username \<username\>

**Error:** Get-RdsDiagnosticActivities : User is not authorized to query the management service.

**Cause:** Using -Deployment switch.

**Fix:** -Deployment switch can be used by deployment administrators only. These are usually members of the RDS/WVD team. Replace -Deployment with -TenantName \<TenantName\>

### Get-RdsRoleDefinition

**Error:** Get-RdsRoleDefinition :User is not authorized to query the management service.

**Cause:** Bug in earlier version of RDS PowerShell.

**Fix:** Download and import latest version RDS PowerShell. Include -TenantName in the Get-RdsRoleDefinition.

**Error:** TBD

**Cause:** TBD

**Fix:** TBD

### Get-RdsStartMenuApp

**Error:** Get-RdsStartMenuApp output loop endlessly Cause: Bug in RDS PowerShell.

**Fix:** Run the following cmdlet:

> Get-RdsStartMenuApp \$tenant \$pool1 \$appgroup1 \| Select-Object -First 100

**Error:** TBD

**Cause:** TBD

**Fix:** TBD

### Get-RdsTenant

**Error:** Get-RdsTenant : TenantName: 'Partner' does not exist. Please use PowerShell command: New-RdsTenant Cause: Incorrect tenant name or tenant not existing.

**Fix:**

- Confirm spelling of tenant name.

- Make sure tenant has been created for you by the RDS/WVD team.

**Error:** Get-RdsTenant returns the same tenant multiple times

**Cause:** Bug in earlier version of RDS PowerShell.

**Fix:** Download and import latest version RDS PowerShell. 

### New-RdsRoleAssignment

New-RdsRoleAssignment cannot give permissions to a user that does not exist in the Azure AD.

**Error:** New-RdsRoleAssignment : User is not authorized to query the management service.

**Cause:** Account being used does not have RDS Owner permissions on the tenant.

**Fix:** A user with RDS Owner permission needs to execute the role assignment.

**Error:** New-RdsRoleAssignment : User is not authorized to query the management service.

**Cause:** Account being used does have RDS Owner permissions but is not part of Active Directory (AD) or does not have permission to query AD where the user is located.

**Fix:** User with AD permissions needs to execute the role assignment.

## Performance and usability issues
