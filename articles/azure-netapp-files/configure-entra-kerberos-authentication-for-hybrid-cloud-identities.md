---
title: Configure Microsoft Entra Kerberos authentication with Azure NetApp Files
description: Describes how to configure Microsoft Entra Kerberos authentication for hybrid and cloud-only identities on Azure NetApp Files.
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 02/20/2026
ms.author: anfdocs
ms.custom: references_regions
---

# Configure Microsoft Entra Kerberos authentication with Azure NetApp Files (preview)

This article helps you configure Microsoft Entra Kerberos authentication for hybrid and cloud-only identities on Azure NetApp Files.


**Hybrid identities**:  
Hybrid identities are user accounts that originate in on-premises Active Directory Domain Services (AD DS) and synchronize to Microsoft Entra ID. This synchronization creates a single, common identity that you can use to authenticate and authorize access to both on-premises and cloud resources.

**Cloud-only identities**:  
Cloud-only identities are user accounts that exist only in Microsoft Entra ID and aren’t synchronized from an on-premises directory. You create and manage these identities entirely within the Microsoft Entra tenant.

## Considerations

* You must create a NetApp account in the region where you deploy the Azure NetApp Files volumes.
* Azure NetApp Files supports multiple Microsoft Entra ID connections per subscription, but you can configure only one Microsoft Entra ID connection per NetApp account. 
* Azure NetApp Files accounts support either Microsoft Entra ID–based authentication or Active Directory Domain Services (AD DS)–based authentication, but not both at the same time.
* For customer-managed key (CMK) configurations, Azure NetApp Files uses a managed identity assigned to the NetApp account to access Azure Key Vault.
* You can assign multiple managed identities per NetApp account, with one managed identity used per feature, or reuse the same managed identity across features, depending on your configuration.
* Azure NetApp Files uses a user‑assigned or system‑assigned managed identity for the Microsoft Entra ID connection.

### Unsupported features

The following features aren't supported:

* File access logs
* Cache volumes
* Application volume group


### Register the feature

Support for Microsoft Entra Kerberos authentication with Azure NetApp Files is currently in preview. Before configuring Microsoft Entra Kerberos authentication, register the feature:

1.  Register the feature:

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFEntraID
    ```

1. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** can remain in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFEntraID
    ```

Use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status.


## Requirements

Before creating a new Entra ID connection, complete the following steps:     

1. If you plan to use this feature with hybrid identities, first configure Microsoft Entra Connect Sync and sync on-premises Active Directory users by using [Microsoft Entra Connect Sync](https://portal.azure.com/?Microsoft_Azure_NetApp=development#view/Microsoft_AAD_Connect_Provisioning/AADConnectMenuBlade/%7E/ConnectSync) to enable hybrid identities.

1. [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app). Register the application by using either the Microsoft Entra admin center or the Azure portal. Use the Azure portal so you can stay in a single workflow while configuring Azure NetApp Files resources. Complete the application registration with the following settings:

    * **Application Name**   
    Enter a user-defined application name that meets the naming guidelines. 

    * **Supported account types**  
    Single tenant only - Tenant_Name

    :::image type="content" source="./media/entra-kerberos-authentication-for-hybrid-identities/application-registration.png" alt-text="Screenshot to register the applications." lightbox="./media/entra-kerberos-authentication-for-hybrid-identities/application-registration.png":::
    
    > [!NOTE]
    > From the application’s Overview page, record the Application (client) ID. This ID uniquely identifies your application and is used in your application's code as part of validating the security tokens it receives from the Microsoft identity platform.
 
    After you register your application, create and upload the certificate for authorization and set up permissions to configure Microsoft Entra ID connections.   

1. Upload the certificate and set up permissions:

    1. From the Azure portal, create a key vault by using [Azure portal](/azure/key-vault/general/quick-create-portal), [Azure CLI](/azure/key-vault/general/quick-create-cli), or [Azure PowerShell](/azure/key-vault/general/quick-create-powershell).

       Note the following two properties:

       * **Vault Name**  
       Azure NetApp Files uses the NetApp account–managed identity when accessing Azure Key Vault.

       * **Vault URI** 
       Applications that use your vault through its REST API must use this URI format - `https://vault_name.vault.azure.net`

    1. Grant the NetApp account’s managed identity the Key Vault Secrets User role on the associated Azure Key Vault. Select the NetApp account that's associated with the Azure NetApp Files volume used for Microsoft Entra Kerberos authentication (hybrid or cloud-only identities). 

       You need to set and retrieve the certificate from Azure Key Vault. All access to secrets takes place through Azure Key Vault.

    1. Grant application permissions to Microsoft Graph for the application registration.

        1. From the **Overview** page of your application registration in Microsoft Entra ID, under **Manage** select **API permissions**.  
        1. Select **+ Add a permission**.  
        1. Select **Microsoft Graph**, and then select **Application permissions**.  
        1. Validate that the following permissions are assigned:  
            * Application.ReadWrite.OwnedBy
            * DelegatedPermissionGrant.ReadWrite.All
            * User.Read
        1. After adding permissions, select **Grant admin consent for tenant-name** and confirm the consent action.

            :::image type="content" source="./media/entra-kerberos-authentication-for-hybrid-identities/select-permission.png" alt-text="Screenshot to grant admin consent." lightbox="./media/entra-kerberos-authentication-for-hybrid-identities/select-permission.png":::
            
            :::image type="content" source="./media/entra-kerberos-authentication-for-hybrid-identities/permission-grant-on-application.png" alt-text="Screenshot to grant permission on applications." lightbox="./media/entra-kerberos-authentication-for-hybrid-identities/permission-grant-on-application.png":::

    1. Add a public certificate to the application registration.  

        1. In **Application registrations**, select your application.  
        1. Select **Certificates & secrets** > **Certificates** > **Upload certificate**.   
        1. Select the file you want to upload. It must be one of the following file types: .cer, .pem, .crt.  
        1. Select **Add**.  

        Self-signed certificates are supported but aren't recommended for production use. Azure NetApp Files requires outbound connectivity to Microsoft Graph for Microsoft Entra Kerberos authentication.

    1. [Configure an Azure Network Address Translation (NAT) gateway](/azure/nat-gateway/quickstart-create-nat-gateway) to provide outbound internet connectivity from the virtual network hosting Azure NetApp Files volumes, enabling access to *graph.microsoft.com*. 

        1. In the Azure portal, create an Azure NAT gateway in your subscription.
        1. When creating the NAT gateway, provide the following information:

            * **Resource group**  
            The resource group where the NAT gateway will be created.

            * **NAT gateway name**  
            A user‑defined name for the NAT gateway.

            * **SKU**  
            Standard: Supports zonal deployment

            * **Public IP addresses**  
            One or more public IP addresses that the NAT gateway uses for outbound internet traffic.

            * **Virtual network**  
            Select the virtual network that contains the Azure NetApp Files delegated subnet.

            * **Subnets**  
            Associate the NAT gateway with the subnets delegated to Azure NetApp Files and the subnet that includes clients.

        1. Save the configuration.

        After the NAT gateway is associated with the Azure NetApp Files subnet, outbound access to graph.microsoft.com is enabled, allowing Microsoft Entra ID communication required for authentication.

        > [!NOTE]
        > The NAT gateway is used for outbound connectivity only. No inbound access or additional firewall rules are required for this configuration.

1. [Create Windows virtual machines](/azure/virtual-machines/windows/quick-create-portal) to connect to Azure NetApp Files using Microsoft Entra Kerberos authentication

    In some environments, you might not be able to connect directly to an Entra ID–joined virtual machine using Remote Desktop Protocol (RDP). In these cases, use an Entra ID–registered virtual machine as a jump box to establish the connection to the Entra ID–joined virtual machine. If you can connect directly to the Entra ID–joined virtual machine by signing in with your AzureAD\user@EntraIDdomain account, the Entra ID–registered virtual machine isn't required.

    Depending on your environment, create one or two Windows virtual machines that you use to connect to Azure NetApp Files SMB volumes using Microsoft Entra Kerberos authentication. These virtual machines provide the client-side context required for Microsoft Entra Kerberos authentication and SMB access. Azure NetApp Files doesn't prompt for user credentials or issue Kerberos tickets. Windows clients obtain Kerberos tickets during an interactive sign-in.

    **Entra ID–joined virtual machine (Primary)** 

    Create an Entra ID–joined virtual machine to use Kerberos authentication and SMB access to Azure NetApp Files. Use this virtual machine to:  
    
    * Go to **Work and school account** > **Connect to Azure** > **Use global Entra ID cloud account username and password**.

    :::image type="content" source="./media/entra-kerberos-authentication-for-hybrid-identities/set-up-account.png" alt-text="Screenshot to set up account." lightbox="./media/entra-kerberos-authentication-for-hybrid-identities/set-up-account.png":::

    * Sign in as hybrid or Entra ID cloud-only user by using Microsoft Entra ID credentials
    * Obtain a cloud-issued Kerberos ticket during interactive sign-in.
    * Mount the Azure NetApp Files SMB volume using Kerberos authentication.

    This virtual machine represents the client that uses the end-to-end Microsoft Entra Kerberos authentication flow.

    **Entra ID–registered virtual machine (optional)**

    > [!NOTE]
    > The Entra ID–registered virtual machine is a jump host to facilitate testing.

    Create an Entra ID–registered virtual machine to facilitate access to the Entra ID–joined virtual machine. Use this virtual machine to:  

    * Go to **Work and school account** > **Connect to Azure** > **Use global Entra ID cloud account username and password**.
    * Sign in with a global Microsoft Entra ID account.
    * Register the device with Microsoft Entra ID.

    This virtual machine is typically used for identity validation and administrative access and doesn't mount Azure NetApp Files SMB volumes.

    > [!IMPORTANT]
    > * Production environments can use Entra ID–joined virtual machines to access Azure NetApp Files SMB volumes using Microsoft Entra Kerberos authentication.
    > * The authentication configuration (Microsoft Entra ID, certificates, Azure Key Vault, NAT gateway) remains valid after testing without these virtual machines.

    The Entra ID registers and joins to the VM.

    1. Sign in to Entra Joined VM as a hybrid user to mount the volume:   
       ```
       AzureAD\user@EntraIDdomain
       Example: AzureAD\jsmith@contoso.com 
       ```

        > [!NOTE]
        > If you encounter any issues, select **More Choices** and then enter the credentials.

    1. Perform the following configuration on Entra joined VM:

        1. Sign in by using the virtual machine username and password.
        1. Go to **Group Policy** > **Computer Configuration** > **Administrative Templates** > **System** > **Kerberos**.
        1. Enable **Allow retrieving the cloud kerberos ticket during the logon**.
        1. Select **Define host name-to-kerberos realm mappings** and provide the FQDN for the Azure NetApp Files volume.    

            > [!NOTE]
            > Configure the **Define host name-to-kerberos realm mappings** setting after creating the Azure NetApp Files Entra ID volume.
        
        1. Go to **Group Policy** > **Computer Configuration** > **Windows Settings** > **Security Settings** > **Local Policies** > **Security Options**.
        1. Enable **Network security: Allow PKU2U authentication requests to this computer to use online identities**.
        1. Add the hybrid user to the **Remote Desktop Users** by running the command:
            
            net localgroup "Remote Desktop Users" /add AzureAD\UPN

        1. Add a system managed identity: 

            1. In the Azure Portal, go to **Azure NetApp Files** > **NetApp account**. 
            1. Under **Settings**, select **Identity**.

            You can now select a system-assigned or user-assigned identity
	    
        1. To select a system-assigned identity, ensure you're on the **System assigned** tab, enable the status, and then select **Save**.
    
## Create Entra ID connection

1. From the NetApp account, go to **Azure NetApp Files** > **Entra ID connection**, and then select **Create**.

    :::image type="content" source="./media/entra-kerberos-authentication-for-hybrid-identities/create-entra-id.png" alt-text="Screenshot to create an Entra ID connection." lightbox="./media/entra-kerberos-authentication-for-hybrid-identities/create-entra-id.png":::

1. Enter the following information:

    * **Application ID**  
        To use REST or Microsoft Graph API, you need OAuth 2.0 tokens. Configure the application ID as part of the prerequisite with the required permission and certificate.
        
    * **Domain Name**   
        Domain of Active Directory that's synced with Entra ID for hybrid identities or any custom domain.

    * **Azure Key Vault URI**  
        Azure Key Vault URI to fetch the certificate and private key to get tokens. The public certificate of this PFX certificate must match the one you upload during registration.
        
    * **Certificate name**  
        Enter the certificate name from Azure Key Vault that's associated with your app registration.

    * **SMB server prefix**  
        The naming prefix for a new application created on the Entra ID. This is the FQDN through which you mount the SMB volume.

## Configure directory-level and file-level permissions for Azure NetApp Files shares
 
By default, any user can access the share, but you maintain control by using the Access Control List (ACL) for users and groups. You can configure Windows access control lists (ACLs), also known as NTFS permissions. Windows ACLs (NTFS permissions) operate at a more granular level to control the operations the user can perform at the directory or file level. You can set Windows ACLs at the root, directory, or file level. When a user tries to access a file or directory, file-level and directory-level permissions are enforced. If there are differences among them, only the most restrictive one applies.

Before you configure Windows ACLs:

1. [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md).

1. Create an entry in the Windows hosts file to map the IP address to the Azure NetApp Files volume to the SMB Server FQDN.   
   
    Example: `102.54.94.97 smbserver.contoso.com`

1. Confirm that you have configured Define host name-to-kerberos realm mappings.  

    Example:  
    * Value name: `KERBEROS.MICROSOFTONLINE.COM`
    * Value: `smbserver.contoso.com`

## Configure Windows ACLs by using icacls

To grant full permissions to a hybrid user on directories and files under the file share, run the following command from the Entra Joined Windows VM’s command prompt where the share is mounted. 

> [!NOTE]
> You can configure access control lists only by using icacls. For more information, see [icacls](/windows-server/administration/windows-commands/icacls).  

**Grant permissions by using a mapped drive**

```
icacls <mapped-drive-letter>: /grant AzureAD\ AzureAD\user@<EntraIDdomain>:(f)
 ```

**Grant permissions by using the file share**

```
icacls \\<smbserver>.contoso.com\entravol /grant " AzureAD\user@<EntraIDdomain>":(R,W)
```

> [!NOTE] 
> The following configurations aren't supported:
>  * Icacls for groups isn't supported to apply ACLs for the Entra ID only identities.
>  * Configure Windows ACLs by using Windows File Explorer isn't supported for both hybrid as well as Entra ID only identities.

## Edit Entra ID connection

1. In the Azure portal, from the NetApp account, go to **Microsoft Entra ID**. 

1. Select `...` and then select **Edit** to modify the Entra ID connection values.

    :::image type="content" source="./media/entra-kerberos-authentication-for-hybrid-identities/edit-entra-id.png" alt-text="Screenshot to edit an Entra id connection." lightbox="./media/entra-kerberos-authentication-for-hybrid-identities/edit-entra-id.png":::

    > [!NOTE]
    > For Entra-dependent volumes, you can modify only the Azure Key Vault URI, certificate name, and managed identity resource ID.

## Delete Entra ID connection

1. In the Azure portal, go to the Entra ID Connection. 

1. Select `...` and then select **Delete** to delete the Entra ID connection.

    > [!NOTE]
    > You can delete the Entra ID connection only when there are no Entra dependent volumes.

## Next steps

* [Configure customer-managed keys](configure-customer-managed-keys.md)
* [Troubleshoot Microsoft Entra Kerberos authentication for Azure NetApp Files](troubleshoot-entra-kerberos-authentication.md)
* [Security FAQs](faq-security.md)
