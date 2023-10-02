---
title: Log in to a Windows virtual machine in Azure by using Microsoft Entra ID
description: Learn how to log in to an Azure VM that's running Windows by using Microsoft Entra authentication.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: how-to
ms.date: 03/27/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sandeo
ms.custom: references_regions, devx-track-azurecli, subject-rbac-steps, has-azure-ad-ps-ref
ms.collection: M365-identity-device-management
---
# Log in to a Windows virtual machine in Azure by using Microsoft Entra ID including passwordless

Organizations can improve the security of Windows virtual machines (VMs) in Azure by integrating with Microsoft Entra authentication. You can now use Microsoft Entra ID as a core authentication platform to RDP into *Windows Server 2019 Datacenter edition* and later, or *Windows 10 1809* and later. You can then centrally control and enforce Azure role-based access control (RBAC) and Conditional Access policies that allow or deny access to the VMs. 

This article shows you how to create and configure a Windows VM and log in by using Microsoft Entra ID-based authentication.

There are many security benefits of using Microsoft Entra ID-based authentication to log in to Windows VMs in Azure. They include:

- Use Microsoft Entra authentication including passwordless to log in to Windows VMs in Azure.
- Reduce reliance on local administrator accounts.
- Password complexity and password lifetime policies that you configure for Microsoft Entra ID also help secure Windows VMs.
- With Azure RBAC:
   - Specify who can log in to a VM as a regular user or with administrator privileges. 
   - When users join or leave your team, you can update the Azure RBAC policy for the VM to grant access as appropriate. 
   - When employees leave your organization and their user accounts are disabled or removed from Microsoft Entra ID, they no longer have access to your resources.
- Configure Conditional Access policies to "phishing resistant MFA" using require authentication strength (preview) grant control or require multifactor authentication and other signals, such as user sign-in risk, before you can RDP into Windows VMs. 
- Use Azure Policy to deploy and audit policies to require Microsoft Entra login for Windows VMs and to flag the use of unapproved local accounts on the VMs.
- Use Intune to automate and scale Microsoft Entra join with mobile device management (MDM) autoenrollment of Azure Windows VMs that are part of your virtual desktop infrastructure (VDI) deployments. 
  
  MDM autoenrollment requires Microsoft Entra ID P1 licenses. Windows Server VMs don't support MDM enrollment.

> [!NOTE]
> After you enable this capability, your Windows VMs in Azure will be Microsoft Entra joined. You cannot join them to another domain, like on-premises Active Directory or Microsoft Entra Domain Services. If you need to do so, disconnect the VM from Microsoft Entra ID by uninstalling the extension.

## Requirements

### Supported Azure regions and Windows distributions

This feature currently supports the following Windows distributions:

- Windows Server 2019 Datacenter and later
- Windows 10 1809 and later
- Windows 11 21H2 and later

This feature is now available in the following Azure clouds:

- Azure Global
- Azure Government
- Microsoft Azure operated by 21Vianet

### Network requirements

To enable Microsoft Entra authentication for your Windows VMs in Azure, you need to ensure that your VM's network configuration permits outbound access to the following endpoints over TCP port 443.

Azure Global:
- `https://enterpriseregistration.windows.net`: For device registration.
- `http://169.254.169.254`: Azure Instance Metadata Service endpoint.
- `https://login.microsoftonline.com`: For authentication flows.
- `https://pas.windows.net`: For Azure RBAC flows.

Azure Government:
- `https://enterpriseregistration.microsoftonline.us`: For device registration.
- `http://169.254.169.254`: Azure Instance Metadata Service endpoint.
- `https://login.microsoftonline.us`: For authentication flows.
- `https://pasff.usgovcloudapi.net`: For Azure RBAC flows.

Microsoft Azure operated by 21Vianet:
- `https://enterpriseregistration.partner.microsoftonline.cn`: For device registration.
- `http://169.254.169.254`: Azure Instance Metadata Service endpoint.
- `https://login.chinacloudapi.cn`: For authentication flows.
- `https://pas.chinacloudapi.cn`: For Azure RBAC flows.

### Authentication requirements

[Microsoft Entra Guest accounts](/azure/active-directory/external-identities/what-is-b2b) can't connect to Azure Bastion via Microsoft Entra authentication.

<a name='enable-azure-ad-login-for-a-windows-vm-in-azure'></a>

## Enable Microsoft Entra login for a Windows VM in Azure

To use Microsoft Entra login for a Windows VM in Azure, you must: 

1. Enable the Microsoft Entra login option for the VM.
1. Configure Azure role assignments for users who are authorized to log in to the VM.

There are two ways to enable Microsoft Entra login for your Windows VM:

- The Azure portal, when you're creating a Windows VM.
- Azure Cloud Shell, when you're creating a Windows VM or using an existing Windows VM.

> [!NOTE]
> If a device object with the same displayName as the hostname of a VM where an extension is installed exists, the VM fails to join Microsoft Entra ID with a hostname duplication error. Avoid duplication by [modifying the hostname](../../virtual-network/virtual-networks-viewing-and-modifying-hostnames.md#modify-a-hostname).

### Azure portal

You can enable Microsoft Entra login for VM images in Windows Server 2019 Datacenter or Windows 10 1809 and later. 

To create a Windows Server 2019 Datacenter VM in Azure with Microsoft Entra login: 

1. Sign in to the [Azure portal](https://portal.azure.com) by using an account that has access to create VMs, and select **+ Create a resource**.
1. In the **Search the Marketplace** search bar, type **Windows Server**.
1. Select **Windows Server**, and then choose **Windows Server 2019 Datacenter** from the **Select a software plan** dropdown list.
1. Select **Create**.
1. On the **Management** tab, select the **Login with Microsoft Entra ID** checkbox in the **Microsoft Entra ID** section.

   ![Screenshot that shows the Management tab on the Azure portal page for creating a virtual machine.](./media/howto-vm-sign-in-azure-ad-windows/azure-portal-login-with-azure-ad.png)
1. Make sure that **System assigned managed identity** in the **Identity** section is selected. This action should happen automatically after you enable login with Microsoft Entra ID.
1. Go through the rest of the experience of creating a virtual machine. You have to create an administrator username and password for the VM.

> [!NOTE]
> To log in to the VM by using your Microsoft Entra credentials, you first need to [configure role assignments](#configure-role-assignments-for-the-vm) for the VM.

### Azure Cloud Shell

Azure Cloud Shell is a free, interactive shell that you can use to run the steps in this article. Common Azure tools are preinstalled and configured in Cloud Shell for you to use with your account. Just select the **Copy** button to copy the code, paste it in Cloud Shell, and then select the Enter key to run it. There are a few ways to open Cloud Shell:

- Select **Try It** in the upper-right corner of a code block.
- Open Cloud Shell in your browser.
- Select the Cloud Shell button on the menu in the upper-right corner of the [Azure portal](https://portal.azure.com).

This article requires you to run Azure CLI version 2.0.31 or later. Run `az --version` to find the version. If you need to install or upgrade, see the article [Install the Azure CLI](/cli/azure/install-azure-cli).

1. Create a resource group by running [az group create](/cli/azure/group#az-group-create). 
1. Create a VM by running [az vm create](/cli/azure/vm#az-vm-create). Use a supported distribution in a supported region. 
1. Install the Microsoft Entra login VM extension. 

The following example deploys a VM named `myVM` (that uses `Win2019Datacenter`) into a resource group named `myResourceGroup`, in the `southcentralus` region. In this example and the next one, you can provide your own resource group and VM names as needed.

```AzureCLI
az group create --name myResourceGroup --location southcentralus

az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image Win2019Datacenter \
    --assign-identity \
    --admin-username azureuser \
    --admin-password yourpassword
```

> [!NOTE]
> You must enable system-assigned managed identity on your virtual machine before you install the Microsoft Entra login VM extension.

It takes a few minutes to create the VM and supporting resources.

Finally, install the Microsoft Entra login VM extension to enable Microsoft Entra login for Windows VMs. VM extensions are small applications that provide post-deployment configuration and automation tasks on Azure virtual machines. Use [az vm extension](/cli/azure/vm/extension#az-vm-extension-set) set to install the AADLoginForWindows extension on the VM named `myVM` in the `myResourceGroup` resource group.

You can install the AADLoginForWindows extension on an existing Windows Server 2019 or Windows 10 1809 and later VM to enable it for Microsoft Entra authentication. The following example uses the Azure CLI to install the extension:

```AzureCLI
az vm extension set \
    --publisher Microsoft.Azure.ActiveDirectory \
    --name AADLoginForWindows \
    --resource-group myResourceGroup \
    --vm-name myVM
```

After the extension is installed on the VM, `provisioningState` shows `Succeeded`.

## Configure role assignments for the VM

Now that you've created the VM, you need to configure an Azure RBAC policy to determine who can log in to the VM. Two Azure roles are used to authorize VM login:

- **Virtual Machine Administrator Login**: Users who have this role assigned can log in to an Azure virtual machine with administrator privileges.
- **Virtual Machine User Login**: Users who have this role assigned can log in to an Azure virtual machine with regular user privileges.

To allow a user to log in to the VM over RDP, you must assign the Virtual Machine Administrator Login or Virtual Machine User Login role to the Virtual Machine resource.

> [!NOTE]
> Manually elevating a user to become a local administrator on the VM by adding the user to a member of the local administrators group or by running `net localgroup administrators /add "AzureAD\UserUpn"` command is not supported. You need to use Azure roles above to authorize VM login.

An Azure user who has the Owner or Contributor role assigned for a VM doesn't automatically have privileges to log in to the VM over RDP. The reason is to provide audited separation between the set of people who control virtual machines and the set of people who can access virtual machines.

There are two ways to configure role assignments for a VM:

- Microsoft Entra admin center experience
- Azure Cloud Shell experience

> [!NOTE]
> The Virtual Machine Administrator Login and Virtual Machine User Login roles use `dataActions`, so they can't be assigned at the management group scope. Currently, you can assign these roles only at the subscription, resource group, or resource scope.

<a name='azure-ad-portal'></a>

<a name='microsoft-entra-portal'></a>

### Microsoft Entra admin center

To configure role assignments for your Microsoft Entra ID-enabled Windows Server 2019 Datacenter VMs:

1. For **Resource Group**, select the resource group that contains the VM and its associated virtual network, network interface, public IP address, or load balancer resource.

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the following role. For detailed steps, see [Assign Azure roles by using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | Role | **Virtual Machine Administrator Login** or **Virtual Machine User Login** |
    | Assign access to | User, group, service principal, or managed identity |

    ![Screenshot that shows the page for adding a role assignment.](../../../includes/role-based-access-control/media/add-role-assignment-page.png)

### Azure Cloud Shell

The following example uses [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) to assign the Virtual Machine Administrator Login role to the VM for your current Azure user. You obtain the username of your current Azure account by using [az account show](/cli/azure/account#az-account-show), and you set the scope to the VM created in a previous step by using [az vm show](/cli/azure/vm#az-vm-show). 

You can also assign the scope at a resource group or subscription level. Normal Azure RBAC inheritance permissions apply.

```AzureCLI
$username=$(az account show --query user.name --output tsv)
$rg=$(az group show --resource-group myResourceGroup --query id -o tsv)

az role assignment create \
    --role "Virtual Machine Administrator Login" \
    --assignee $username \
    --scope $rg
```

> [!NOTE]
> If your Microsoft Entra domain and login username domain don't match, you must specify the object ID of your user account by using `--assignee-object-id`, not just the username for `--assignee`. You can obtain the object ID for your user account by using [az ad user list](/cli/azure/ad/user#az-ad-user-list).

For more information about how to use Azure RBAC to manage access to your Azure subscription resources, see the following articles:

- [Assign Azure roles by using the Azure CLI](../../role-based-access-control/role-assignments-cli.md)
- [Assign Azure roles by using the Azure portal](../../role-based-access-control/role-assignments-portal.md)
- [Assign Azure roles by using Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md)

<a name='log-in-by-using-azure-ad-credentials-to-a-windows-vm'></a>

## Log in by using Microsoft Entra credentials to a Windows VM

You can sign in over RDP using one of two methods:

1. Passwordless using any of the supported Microsoft Entra credentials (recommended)
1. Password/limited passwordless using Windows Hello for Business deployed using certificate trust model

<a name='log-in-using-passwordless-authentication-with-azure-ad'></a>

### Log in using passwordless authentication with Microsoft Entra ID

To use passwordless authentication for your Windows VMs in Azure, you need the Windows client machine and the session host (VM) on the following operating systems:

- Windows 11 with [2022-10 Cumulative Updates for Windows 11 (KB5018418)](https://support.microsoft.com/kb/KB5018418) or later installed.
- Windows 10, version 20H2 or later with [2022-10 Cumulative Updates for Windows 10 (KB5018410)](https://support.microsoft.com/kb/KB5018410) or later installed.
- Windows Server 2022 with [2022-10 Cumulative Update for Microsoft server operating system (KB5018421)](https://support.microsoft.com/kb/KB5018421) or later installed.

> [!IMPORTANT]
> There is no requirement for Windows client machine to be either Microsoft Entra registered, or Microsoft Entra joined or Microsoft Entra hybrid joined to the *same* directory as the VM. Additionally, to RDP by using Microsoft Entra credentials, users must belong to one of the two Azure roles, Virtual Machine Administrator Login or Virtual Machine User Login.

To connect to the remote computer:

- Launch **Remote Desktop Connection** from Windows Search, or by running `mstsc.exe`.
- Select **Use a web account to sign in to the remote computer** option in the **Advanced** tab. This option is equivalent to the `enablerdsaadauth` RDP property. For more information, see [Supported RDP properties with Remote Desktop Services](/windows-server/remote/remote-desktop-services/clients/rdp-files).
- Specify the name of the remote computer and select **Connect**. 

> [!NOTE]
> IP address cannot be used when **Use a web account to sign in to the remote computer** option is used.
> The name must match the hostname of the remote device in Microsoft Entra ID and be network addressable, resolving to the IP address of the remote device.

- When prompted for credentials, specify your user name in `user@domain.com` format.
- You're then prompted to allow the remote desktop connection when connecting to a new PC. Microsoft Entra remembers up to 15 hosts for 30 days before prompting again. If you see this dialogue, select **Yes** to connect.

> [!IMPORTANT]
> If your organization has configured and is using [Microsoft Entra Conditional Access](/azure/active-directory/conditional-access/overview), your device must satisfy the Conditional Access requirements to allow connection to the remote computer. Conditional Access policies may be applied to the application **Microsoft Remote Desktop (a4a365df-50f1-4397-bc59-1a1564b8bb9c)** for controlled access.

> [!NOTE]
> The Windows lock screen in the remote session doesn't support Microsoft Entra authentication tokens or passwordless authentication methods like FIDO keys. The lack of support for these authentication methods means that users can't unlock their screens in a remote session. When you try to lock a remote session, either through user action or system policy, the session is instead disconnected and the service sends a message to the user explaining they've been disconnected. Disconnecting the session also ensures that when the connection is relaunched after a period of inactivity, Microsoft Entra ID reevaluates the applicable Conditional Access policies.

<a name='log-in-using-passwordlimited-passwordless-authentication-with-azure-ad'></a>

### Log in using password/limited passwordless authentication with Microsoft Entra ID

> [!IMPORTANT]
> Remote connection to VMs that are joined to Microsoft Entra ID is allowed only from Windows 10 or later PCs that are either Microsoft Entra registered (minimum required build is 20H1) or Microsoft Entra joined or Microsoft Entra hybrid joined to the *same* directory as the VM. Additionally, to RDP by using Microsoft Entra credentials, users must belong to one of the two Azure roles, Virtual Machine Administrator Login or Virtual Machine User Login. 
>
> If you're using a Microsoft Entra registered Windows 10 or later PC, you must enter credentials in the `AzureAD\UPN` format (for example, `AzureAD\john@contoso.com`). At this time, you can use Azure Bastion to log in with Microsoft Entra authentication [via the Azure CLI and the native RDP client mstsc](../../bastion/native-client.md). 


To log in to your Windows Server 2019 virtual machine by using Microsoft Entra ID: 

1. Go to the overview page of the virtual machine that has been enabled with Microsoft Entra login.
1. Select **Connect** to open the **Connect to virtual machine** pane.
1. Select **Download RDP File**.
1. Select **Open** to open the Remote Desktop Connection client.
1. Select **Connect** to open the Windows login dialog.
1. Log in by using your Microsoft Entra credentials.

You're now logged in to the Windows Server 2019 Azure virtual machine with the role permissions as assigned, such as VM User or VM Administrator. 

> [!NOTE]
> You can save the .rdp file locally on your computer to start future remote desktop connections to your virtual machine, instead of going to the virtual machine overview page in the Azure portal and using the connect option.

## Enforce Conditional Access policies

You can enforce Conditional Access policies, such as "phishing resistant MFA" using require authentication strength (preview) grant control or multifactor authentication or user sign-in risk check, before you authorize access to Windows VMs in Azure that are enabled with Microsoft Entra login. To apply a Conditional Access policy, you must select the **Azure Windows VM Sign-In** app from the cloud apps or actions assignment option. Then use sign-in risk as a condition and/or "phishing resistant MFA" using require authentication strength (preview) grant control or require MFA as a control for granting access. 

> [!NOTE]
> If you require MFA as a control for granting access to the Azure Windows VM Sign-In app, then you must supply an MFA claim as part of the client that initiates the RDP session to the target Windows VM in Azure. This can be achieved using passwordless authentication method for RDP that satisfies the Conditional Access polices, however if you are using limited passwordless method for RDP then the only way to achieve this on a Windows 10 or later client is to use a Windows Hello for Business PIN or biometric authentication with the RDP client. Support for biometric authentication was added to the RDP client in Windows 10 version 1809. Remote desktop using Windows Hello for Business authentication is available only for deployments that use a certificate trust model. It's currently not available for a key trust model.

## Use Azure Policy to meet standards and assess compliance

Use Azure Policy to:

- Ensure that Microsoft Entra login is enabled for your new and existing Windows virtual machines. 
- Assess compliance of your environment at scale on a compliance dashboard. 

With this capability, you can use many levels of enforcement. You can flag new and existing Windows VMs within your environment that don't have Microsoft Entra login enabled. You can also use Azure Policy to deploy the Microsoft Entra extension on new Windows VMs that don't have Microsoft Entra login enabled, and remediate existing Windows VMs to the same standard. 

In addition to these capabilities, you can use Azure Policy to detect and flag Windows VMs that have unapproved local accounts created on their machines. To learn more, review [Azure Policy](../../governance/policy/overview.md).


## Troubleshoot deployment problems

The AADLoginForWindows extension must be installed successfully for the VM to complete the Microsoft Entra join process. If the VM extension fails to be installed correctly, perform the following steps:

1. RDP to the VM by using the local administrator account and examine the *CommandExecution.log* file under *C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.ActiveDirectory.AADLoginForWindows\1.0.0.1*.

   > [!NOTE]
   > If the extension restarts after the initial failure, the log with the deployment error will be saved as *CommandExecution_YYYYMMDDHHMMSSSSS.log*. 

1. Open a PowerShell window on the VM. Verify that the following queries against the Azure Instance Metadata Service endpoint running on the Azure host return the expected output:

   | Command to run | Expected output |
   | --- | --- |
   | `curl.exe -H Metadata:true "http://169.254.169.254/metadata/instance?api-version=2017-08-01"` | Correct information about the Azure VM |
   | `curl.exe -H Metadata:true "http://169.254.169.254/metadata/identity/info?api-version=2018-02-01"` | Valid tenant ID associated with the Azure subscription |
   | `curl.exe -H Metadata:true "http://169.254.169.254/metadata/identity/oauth2/token?resource=urn:ms-drs:enterpriseregistration.windows.net&api-version=2018-02-01"` | Valid access token issued by Microsoft Entra ID for the managed identity that is assigned to this VM |

   > [!NOTE]
   > You can decode the access token by using a tool like [calebb.net](http://calebb.net/). Verify that the `oid` value in the access token matches the managed identity that's assigned to the VM.

1. Ensure that the required endpoints are accessible from the VM via PowerShell:
   
   - `curl.exe https://login.microsoftonline.com/ -D -`
   - `curl.exe https://login.microsoftonline.com/<TenantID>/ -D -`
   - `curl.exe https://enterpriseregistration.windows.net/ -D -`
   - `curl.exe https://device.login.microsoftonline.com/ -D -`
   - `curl.exe https://pas.windows.net/ -D -`

   > [!NOTE]
   > Replace `<TenantID>` with the Microsoft Entra tenant ID that's associated with the Azure subscription. `login.microsoftonline.com/<TenantID>`,  `enterpriseregistration.windows.net`, and `pas.windows.net` should return 404 Not Found, which is expected behavior.
            
1. View the device state by running `dsregcmd /status`. The goal is for the device state to show as `AzureAdJoined : YES`.

   > [!NOTE]
   > Microsoft Entra join activity is captured in Event Viewer under the *User Device Registration\Admin* log at *Event Viewer (local)\Applications* and *Services Logs\Microsoft\Windows\User Device Registration\Admin*.

If the AADLoginForWindows extension fails with an error code, you can perform the following steps.

### Terminal error code 1007 and exit code -2145648574.

Terminal error code 1007 and exit code -2145648574 translate to `DSREG_E_MSI_TENANTID_UNAVAILABLE`. The extension can't query the Microsoft Entra tenant information.

Connect to the VM as a local administrator and verify that the endpoint returns a valid tenant ID from Azure Instance Metadata Service. Run the following command from an elevated PowerShell window on the VM:
      
`curl -H Metadata:true http://169.254.169.254/metadata/identity/info?api-version=2018-02-01`

This problem can also happen when the VM admin attempts to install the AADLoginForWindows extension, but a system-assigned managed identity hasn't enabled the VM first. In that case, go to the **Identity** pane of the VM. On the **System assigned** tab, verify that the **Status** toggle is set to **On**.

### Exit code -2145648607

Exit code -2145648607 translates to `DSREG_AUTOJOIN_DISC_FAILED`. The extension can't reach the `https://enterpriseregistration.windows.net` endpoint.

1. Verify that the required endpoints are accessible from the VM via PowerShell:

   - `curl https://login.microsoftonline.com/ -D -`
   - `curl https://login.microsoftonline.com/<TenantID>/ -D -`
   - `curl https://enterpriseregistration.windows.net/ -D -`
   - `curl https://device.login.microsoftonline.com/ -D -`
   - `curl https://pas.windows.net/ -D -`
   
   > [!NOTE]
   > Replace `<TenantID>` with the Microsoft Entra tenant ID that's associated with the Azure subscription. If you need to find the tenant ID, you can hover over your account name or select  **Identity** > **Overview** > **Properties** > **Tenant ID**.
   >
   > Attempts to connect to `enterpriseregistration.windows.net` might return 404 Not Found, which is expected behavior. Attempts to connect to `pas.windows.net` might prompt for PIN credentials or might return 404 Not Found. (You don't need to enter the PIN.) Either one is sufficient to verify that the URL is reachable.

1. If any of the commands fails with "Could not resolve host `<URL>`," try running this command to determine which DNS server the VM is using:
   
   `nslookup <URL>`

   > [!NOTE] 
   > Replace `<URL>` with the fully qualified domain names that the endpoints use, such as `login.microsoftonline.com`.

1. See whether specifying a public DNS server allows the command to succeed:

   `nslookup <URL> 208.67.222.222`

1. If necessary, change the DNS server that's assigned to the network security group that the Azure VM belongs to.

### Exit code 51

Exit code 51 translates to "This extension is not supported on the VM's operating system."

The AADLoginForWindows extension is intended to be installed only on Windows Server 2019 or Windows 10 (Build 1809 or later). Ensure that your version or build of Windows is supported. If it isn't supported, uninstall the extension.

## Troubleshoot sign-in problems

Use the following information to correct sign-in problems.

You can view the device and single sign-on (SSO) state by running `dsregcmd /status`. The goal is for the device state to show as `AzureAdJoined : YES` and for the SSO state to show `AzureAdPrt : YES`.

RDP sign-in via Microsoft Entra accounts is captured in Event Viewer under the *Applications and Services Logs\Windows\AAD\Operational* event logs.

### Azure role not assigned

You might get the following error message when you initiate a remote desktop connection to your VM: "Your account is configured to prevent you from using this device. For more info, contact your system administrator."

![Screenshot of the message that says your account is configured to prevent you from using this device.](./media/howto-vm-sign-in-azure-ad-windows/rbac-role-not-assigned.png)

Verify that you've [configured Azure RBAC policies](#configure-role-assignments-for-the-vm) for the VM that grant the user the Virtual Machine Administrator Login or Virtual Machine User Login role.

> [!NOTE]
> If you're having problems with Azure role assignments, see [Troubleshoot Azure RBAC](../../role-based-access-control/troubleshooting.md).
 
### Unauthorized client or password change required

You might get the following error message when you initiate a remote desktop connection to your VM: "Your credentials did not work."

![Screenshot of the message that says your credentials did not work.](./media/howto-vm-sign-in-azure-ad-windows/your-credentials-did-not-work.png)

Try these solutions:

- The Windows 10 or later PC that you're using to initiate the remote desktop connection must be Microsoft Entra joined, or Microsoft Entra hybrid joined to the same Microsoft Entra directory. For more information about device identity, see the article [What is a device identity?](./overview.md).

  > [!NOTE]
  > Windows 10 Build 20H1 added support for a Microsoft Entra registered PC to initiate an RDP connection to your VM. When you're using a PC that's Microsoft Entra registered (not Microsoft Entra joined or Microsoft Entra hybrid joined) as the RDP client to initiate connections to your VM, you must enter credentials in the format `AzureAD\UPN` (for example, `AzureAD\john@contoso.com`).

  Verify that the AADLoginForWindows extension wasn't uninstalled after the Microsoft Entra join finished.

  Also, make sure that the security policy **Network security: Allow PKU2U authentication requests to this computer to use online identities** is enabled on both the server *and* the client.

- Verify that the user doesn't have a temporary password. Temporary passwords can't be used to log in to a remote desktop connection.

  Sign in with the user account in a web browser. For instance, sign in to the [Azure portal](https://portal.azure.com) in a private browsing window. If you're prompted to change the password, set a new password. Then try connecting again.

### MFA sign-in method required

You might see the following error message when you initiate a remote desktop connection to your VM: "The sign-in method you're trying to use isn't allowed. Try a different sign-in method or contact your system administrator."

![Screenshot of the message that says the sign-in method you're trying to use isn't allowed.](./media/howto-vm-sign-in-azure-ad-windows/mfa-sign-in-method-required.png)

If you've configured a Conditional Access policy that requires MFA or legacy per-user Enabled/Enforced Microsoft Entra multifactor authentication before you can access the resource, you need to ensure that the Windows 10 or later PC that's initiating the remote desktop connection to your VM signs in by using a strong authentication method such as Windows Hello. If you don't use a strong authentication method for your remote desktop connection, you see the error.

Another MFA-related error message is the one described previously: "Your credentials did not work."

![Screenshot of the message that says your credentials didn't work.](./media/howto-vm-sign-in-azure-ad-windows/your-credentials-did-not-work.png)

If you've configured a legacy per-user **Enabled/Enforced Microsoft Entra multifactor authentication** setting and you see the error above, you can resolve the problem by removing the per-user MFA setting through these commands:

```
# Get StrongAuthenticationRequirements configure on a user
(Get-MsolUser -UserPrincipalName username@contoso.com).StrongAuthenticationRequirements
 
# Clear StrongAuthenticationRequirements from a user
$mfa = @()
Set-MsolUser -UserPrincipalName username@contoso.com -StrongAuthenticationRequirements $mfa
 
# Verify StrongAuthenticationRequirements are cleared from the user
(Get-MsolUser -UserPrincipalName username@contoso.com).StrongAuthenticationRequirements
```

If you haven't deployed Windows Hello for Business and if that isn't an option for now, you can configure a Conditional Access policy that excludes the Azure Windows VM Sign-In app from the list of cloud apps that require MFA. To learn more about Windows Hello for Business, see [Windows Hello for Business overview](/windows/security/identity-protection/hello-for-business/hello-identity-verification).

> [!NOTE]
> Windows Hello for Business PIN authentication with RDP has been supported for several versions of Windows 10. Support for biometric authentication with RDP was added in Windows 10 version 1809. Using Windows Hello for Business authentication during RDP is available for deployments that use a certificate trust model or key trust model.
 
Share your feedback about this feature or report problems with using it on the [Microsoft Entra feedback forum](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789).

### Missing application

If the Azure Windows VM Sign-In application is missing from Conditional Access, make sure that the application is in the tenant:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. Remove the filters to see all applications, and search for **VM**. If you don't see **Azure Windows VM Sign-In** as a result, the service principal is missing from the tenant.

Another way to verify it is via Graph PowerShell:

1. [Install the Graph PowerShell SDK](/powershell/microsoftgraph/installation) if you haven't already done so. 
1. Run `Connect-MgGraph -Scopes "ServicePrincipalEndpoint.ReadWrite.All"`, followed by `"Application.ReadWrite.All"`.
1. Sign in with a Global Administrator account.
1. Consent to the permission prompt.
1. Run `Get-MgServicePrincipal -ConsistencyLevel eventual -Search '"DisplayName:Azure Windows VM Sign-In"'`.
   - If this command results in no output and returns you to the PowerShell prompt, you can create the service principal with the following Graph PowerShell command:
   
      `New-MgServicePrincipal -AppId 372140e0-b3b7-4226-8ef9-d57986796201`
   - Successful output shows that the Azure Windows VM Sign-In app and its ID were created.
1. Sign out of Graph PowerShell by using the `Disconnect-MgGraph` command.

## Next steps

For more information about Microsoft Entra ID, see [What is Microsoft Entra ID?](../fundamentals/whatis.md).
