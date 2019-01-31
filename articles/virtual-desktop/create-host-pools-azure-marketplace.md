---
title: Create a Windows Virtual Desktop host pool with Azure Marketplace - Azure
description: How to create a Windows Virtual Desktop host pool with Azure Marketplace.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 11/21/2018
ms.author: helohr
---
# Tutorial: Create a host pool with Azure Marketplace (Preview)

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop tenant environments. Each host pool can contain an app group that users can interact with as they would on a physical desktop.

Follow the steps in this article to create a host pool within a Windows Virtual Desktop tenant using a Microsoft Azure Marketplace offering. This includes creating a host pool in Windows Virtual Desktop, creating a resource group with VMs in an Azure subscription, joining those VMs to the Active Directory domain, and registering the VMs with Windows Virtual Desktop.

You need the Windows Virtual Desktop PowerShell module to follow the instructions in this article. Install the Windows Virtual Desktop PowerShell module from the PowerShell Gallery by running this cmdlet:

```powershell
PS C:\> Install-Module WindowsVirtualDesktop
```

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Run the Azure Marketplace offering to provision a new host pool

The Windows Virtual Desktop Marketplace offerings are hidden by default. You must send your subscription ID to Microsoft to whitelist your subscription before you can complete this section’s instructions.

To run the Azure Marketplace offering to provision a new host pool:

1. Select **+** or **+ Create a resource**.
2. Enter **Windows Virtual Desktop** in the Marketplace search window.
3. Select **Windows Virtual Desktop: Provision a host pool (Staged)**, then select **Create**.

Follow the guidance to enter the information for the appropriate blades.

### Basics
1. Enter a name for the host pool that’s unique within the Windows Virtual Desktop tenant.
2. Select the appropriate option for personal desktop. If you select **Yes**, each user that connects to this host pool will be permanently assigned to a virtual machine.
3. Select **Create new** and provide a name for the new resource group.
4. For **Location**, select the same location as the virtual network that has connectivity to the Active Directory server.
5. Select **OK**.

### Configure virtual machines
1. Either accept the defaults or customize the number and size of the VMs.
2. Enter a prefix for the names of the virtual machines. The virtual machines will be ***prefix-0***, ***prefix-1***, etc.
3. Select **OK**.

### Virtual machine settings
1. Select the **Image** and enter the appropriate information for how to find it and how to store it. If you choose not to use managed disks, select the storage account containing the vhd file.
2. Enter the user principal name and password for a domain account that will join the VMs to the Active Directory domain. This same username and password will be created on the virtual machines as a local account. You can reset these local accounts later.
3. Select the virtual network that has connectivity to the Active Directory server, then choose the subnet which will host the virtual machines.
4. Select **OK**.

### WVD tenant information
1. Enter the name of the Windows Virtual Desktop tenant group that contains your tenant. If you do not have a specific tenant group name, leave it as the default.
2. Enter the name of the Windows Virtual Desktop tenant under which this host pool will be created.
3. Specify the type of credentials you will provide to authenticate as a tenant admin. If you select **Service principal**, you must also provide the **Azure AD tenant ID** associated with the service principal.
4. Enter either the credentials for the tenant admin account. Only service principals with a password credential are supported.
5. Select **OK**.

### Final steps
4. In the **Summary** blade, review the setup information. If you need to change something, go back to the appropriate blade and make your change before continuing. If the information looks correct, select **OK**.
5. In the **Buy** blade, review additional information provided by the Azure Marketplace.
6. Select **Create** to kick off the deployment of your host pool.

Depending on how many VMs you’re creating, this process can take an hour or more to complete.

## Assign users to the desktop application group

After the Azure Marketplace offering completes, assign user access before you start testing the full session desktops on your virtual machines.

To assign users to the desktop application group:

1. Open a PowerShell window.
2. Run the following cmdlet to sign in to the Windows Virtual Desktop environment:

    ```powershell
    Add-RdsAccount -DeploymentUrl “https://rdbroker.wvd.microsoft.com”
    ```

3. Next, set the context to the tenant group specified in the ARM template with this cmdlet:

    ```powershell
    Set-RdsContext -TenantGroupName <Tenant Group name>
    ```

4. After that, add users to the desktop application group with this cmdlet:

    ```powershell
    Add-RdsAppGroupUser <tenantname> <hostpoolname> “Desktop Application Group” -UserPrincipalName <userupn>
    ```

The user’s UPN should match the user’s identity in Azure Active Directory (for example, user1@contoso.com). If you want to add multiple users, you must run this cmdlet for each user.

After you've completed these steps, users added to the desktop application group can sign in to Windows Virtual Desktop with supported Remote Desktop clients and see a resource for a session desktop.

## Next steps

Now that you've made a host pool, it's time to populate it with RemoteApps. To learn more about how to manage apps in Windows Virtual Desktop, see the Manage app groups tutorial.

> [!div class="nextstepaction"]
> [Manage app groups tutorial](./manage-app-groups.md)
