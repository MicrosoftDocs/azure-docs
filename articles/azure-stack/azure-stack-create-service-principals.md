---
title: Manage a Service Principal for Azure Stack | Microsoft Docs
description: Describes how to manage a new service principal that can be used with the role-based access control in Azure Resource Manager to manage access to resources.
services: azure-resource-manager
documentationcenter: na
author: sethmanheim
manager: femila

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/18/2018
ms.author: sethm
ms.lastreviewed: 12/18/2018

---
# Provide applications access to Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

When an application needs access to deploy or configure resources through Azure Resource Manager in Azure Stack, you create a service principal, which is a credential for your application. You can then delegate only the necessary permissions to that service principal.  

As an example, you may have a configuration management tool that uses Azure Resource Manager to inventory Azure resources. In this scenario, you can create a service principal, grant the reader role to that service principal, and limit the configuration management tool to read-only access. 

Service principals are preferable to running the app under your own credentials because:

 - You can assign permissions to the service principal that are different than your own account permissions. Typically, these permissions are restricted to exactly what the app needs to do.
 - You do not have to change the app's credentials if your responsibilities change.
 - You can use a certificate to automate authentication when executing an unattended script.  

## Getting started

Depending on how you have deployed Azure Stack, you start by creating a service principal. This document describes creating a service principal for:

- Azure Active Directory (Azure AD). Azure AD is a multi-tenant, cloud-based directory, and identity management service. You can use Azure AD with a connected Azure Stack.
- Active Directory Federation Services (AD FS). AD FS provides simplified, secured identity federation, and Web single sign-on (SSO) capabilities. You can use AD FS with both connected and disconnected Azure Stack instances.

Once you've created the service principal, a set of steps common to both AD FS and Azure Active Directory are used to delegate permissions to the role.

## Manage service principal for Azure AD

If you have deployed Azure Stack with Azure Active Directory (Azure AD) as your identity management service, you can create service principals just like you do for Azure. This section shows you how to perform the steps through the portal. Check that you have the [required Azure AD permissions](../active-directory/develop/howto-create-service-principal-portal.md#required-permissions) before beginning.

### Create service principal

In this section, you create an application (service principal) in Azure AD that represents your application.

1. Sign in to your Azure Account through the [Azure portal](https://portal.azure.com).
2. Select **Azure Active Directory** > **App registrations** > **New application registration**
3. Provide a name and URL for the application. Select either **Web app / API** or **Native** for the type of application you want to create. After setting the values, select **Create**.

You have created a service principal for your application.

### Get credentials

When programmatically logging in, you use the ID for your application, and for a Web app / API, an authentication key. To get those values, use the following steps:

1. From **App registrations** in Active Directory, select your application.

2. Copy the **Application ID** and store it in your application code. The applications in the sample applications section refer to this value as the client ID.

     ![Client id](./media/azure-stack-create-service-principal/image12.png)
3. To generate an authentication key for a Web app / API, select **Settings** > **Keys**. 

4. Provide a description of the key, and a duration for the key. When done, select **Save**.

After saving the key, the value of the key is displayed. Copy this value to Notepad or some other temporary location, because you cannot retrieve the key later. You provide the key value with the application ID to sign as the application. Store the key value in a place where your application can retrieve it.

![Saved key](./media/azure-stack-create-service-principal/image15.png)

Once complete, you can assign your application a role.

## Manage service principal for AD FS

If you have deployed Azure Stack with Active Directory Federation Services (AD FS) as your identity management service, use PowerShell to create a service principal, assign a role for access, and sign in with that identity.

You can use one of two methods to create your service principal with AD FS. You can:
 - [Create a service principal using a certificate](azure-stack-create-service-principals.md#create-a-service-principal-using-a-certificate)
 - [Create a service principal using a client secret](azure-stack-create-service-principals.md#create-a-service-principal-using-a-client-secret)

Tasks for managing AD FS service principals.

| Type | Action |
| --- | --- |
| AD FS Certificate | [Create](azure-stack-create-service-principals.md#create-a-service-principal-using-a-certificate) |
| AD FS Certificate | [Update](azure-stack-create-service-principals.md#update-certificate-for-service-principal-for-AD-FS) |
| AD FS Certificate | [Remove](azure-stack-create-service-principals.md#remove-a-service-principal-for-AD-FS) |
| AD FS Client Secret | [Create](azure-stack-create-service-principals.md#create-a-service-principal-using-a-client-secret) |
| AD FS Client Secret | [Update](azure-stack-create-service-principals.md#create-a-service-principal-using-a-client-secret) |
| AD FS Client Secret | [Remove](azure-stack-create-service-principals.md##remove-a-service-principal-for-AD-FS) |

### Create a service principal using a certificate

When creating a service principal while using AD FS for identity, you can use a certificate.

#### Certificate

A certificate is required.

**Certificate Requirements**

 - The Cryptographic Service Provider (CSP) must be legacy key provider.
 - The certificate format must be in PFX file, as both the public and private keys are required. Windows servers use .pfx files that contain the public key file (SSL certificate file) and the associated private key file.
 - For production, the certificate must be issued from either an internal Certificate Authority or a Public Certificate Authority. If you use a public certificate authority, you must included the authority in the base operating system image as part of the Microsoft Trusted Root Authority Program. You can find the full list at [Microsoft Trusted Root Certificate Program: Participants](https://gallery.technet.microsoft.com/Trusted-Root-Certificate-123665ca).
 - Your Azure Stack infrastructure must have network access to the certificate authority's Certificate Revocation List (CRL) location published in the certificate. This CRL must be an HTTP endpoint.

#### Parameters

The following information is required as input for the automation parameters:

|Parameter|Description|Example|
|---------|---------|---------|
|Name|Name for the SPN account|MyAPP|
|ClientCertificates|Array of certificate objects|X509 certificate|
|ClientRedirectUris<br>(Optional)|Application redirect URI|-|

#### Use PowerShell to create a service principal

1. Open an elevated Windows PowerShell session, and run the following cmdlets:

   ```PowerShell  
    # Credential for accessing the ERCS PrivilegedEndpoint, typically domain\cloudadmin
    $Creds = Get-Credential

    # Creating a PSSession to the ERCS PrivilegedEndpoint
    $Session = New-PSSession -ComputerName <ERCS IP> -ConfigurationName PrivilegedEndpoint -Credential $Creds

    # If you have a managed certificate use the Get-Item command to retrieve your certificate from your certificate location.
    # If you don't want to use a managed certificate, you can produce a self signed cert for testing purposes: 
    # $Cert = New-SelfSignedCertificate -CertStoreLocation "cert:\CurrentUser\My" -Subject "CN=<YourAppName>" -KeySpec KeyExchange
    $Cert = Get-Item "<YourCertificateLocation>"
    
    $ServicePrincipal = Invoke-Command -Session $Session -ScriptBlock {New-GraphApplication -Name '<YourAppName>' -ClientCertificates $using:cert}
    $AzureStackInfo = Invoke-Command -Session $Session -ScriptBlock {Get-AzureStackStampInformation}
    $Session | Remove-PSSession

    # For Azure Stack development kit, this value is set to https://management.local.azurestack.external. This is read from the AzureStackStampInformation output of the ERCS VM.
    $ArmEndpoint = $AzureStackInfo.TenantExternalEndpoints.TenantResourceManager

    # For Azure Stack development kit, this value is set to https://graph.local.azurestack.external/. This is read from the AzureStackStampInformation output of the ERCS VM.
    $GraphAudience = "https://graph." + $AzureStackInfo.ExternalDomainFQDN + "/"

    # TenantID for the stamp. This is read from the AzureStackStampInformation output of the ERCS VM.
    $TenantID = $AzureStackInfo.AADTenantID

    # Register an AzureRM environment that targets your Azure Stack instance
    Add-AzureRMEnvironment `
    -Name "AzureStackUser" `
    -ArmEndpoint $ArmEndpoint

    # Set the GraphEndpointResourceId value
    Set-AzureRmEnvironment `
    -Name "AzureStackUser" `
    -GraphAudience $GraphAudience `
    -EnableAdfsAuthentication:$true

    Add-AzureRmAccount -EnvironmentName "AzureStackUser" `
    -ServicePrincipal `
    -CertificateThumbprint $ServicePrincipal.Thumbprint `
    -ApplicationId $ServicePrincipal.ClientId `
    -TenantId $TenantID

    # Output the SPN details
    $ServicePrincipal

   ```
   > [!Note]  
   > For validation purposes a self-signed certificate can be created using the below example:

   ```PowerShell  
   $Cert = New-SelfSignedCertificate -CertStoreLocation "cert:\CurrentUser\My" -Subject "CN=<yourappname>" -KeySpec KeyExchange
   ```


2. After the automation finishes, it displays the required details to use the SPN. It is recommended to store the output for later use.

   For example:

   ```shell
   ApplicationIdentifier : S-1-5-21-1512385356-3796245103-1243299919-1356
   ClientId              : 3c87e710-9f91-420b-b009-31fa9e430145
   Thumbprint            : 30202C11BE6864437B64CE36C8D988442082A0F1
   ApplicationName       : Azurestack-MyApp-c30febe7-1311-4fd8-9077-3d869db28342
   PSComputerName        : azs-ercs01
   RunspaceId            : a78c76bb-8cae-4db4-a45a-c1420613e01b
   ```

### Update certificate for service principal for AD FS

If you have deployed Azure Stack with AD FS, you can use PowerShell to update the secret for a service principal.

The script is run from the privileged endpoint on an ERCS virtual machine.

#### Parameters

The following information is required as input for the automation parameters:

|Parameter|Description|Example|
|---------|---------|---------|
|Name|Name for the SPN account|MyAPP|
|ApplicationIdentifier|Unique identifier|S-1-5-21-1634563105-1224503876-2692824315-2119|
|ClientCertificate|Array of certificate objects|X509 certificate|

#### Example of updating service principal for AD FS

The example creates a self-signed certificate. When you run the cmdlets in a production deployment, use [Get-Item](https://docs.microsoft.com/powershell/module/Microsoft.PowerShell.Management/Get-Item) to retrieve the certificate object for the certificate you want to use.

1. Open an elevated Windows PowerShell session, and run the following cmdlets:

     ```powershell
          # Creating a PSSession to the ERCS PrivilegedEndpoint
          $Session = New-PSSession -ComputerName <ERCS IP> -ConfigurationName PrivilegedEndpoint -Credential $Creds

          # This produces a self signed cert for testing purposes. It is preferred to use a managed certificate for this.
          $NewCert = New-SelfSignedCertificate -CertStoreLocation "cert:\CurrentUser\My" -Subject "CN=<YourAppName>" -KeySpec KeyExchange

          $RemoveServicePrincipal = Invoke-Command -Session $Session -ScriptBlock {Set-GraphApplication -ApplicationIdentifier  S-1-5-21-1634563105-1224503876-2692824315-2120 -ClientCertificates $NewCert}

          $Session | Remove-PSSession
     ```

2. After the automation finishes, it displays the updated thumbprint value required for SPN authentication.

     ```Shell  
          ClientId              : 
          Thumbprint            : AF22EE716909041055A01FE6C6F5C5CDE78948E9
          ApplicationName       : Azurestack-ThomasAPP-3e5dc4d2-d286-481c-89ba-57aa290a4818
          ClientSecret          : 
          RunspaceId            : a580f894-8f9b-40ee-aa10-77d4d142b4e5
     ```

### Create a service principal using a client secret

When creating a service principal while using AD FS for identity, you can use a certificate. You will use the privileged end point to run the cmdlets.

These scripts are run from the privileged endpoint on an ERCS virtual machine. For more information about the privileged end point, see [Using the privileged endpoint in Azure Stack](https://docs.microsoft.com/azure/azure-stack/azure-stack-privileged-endpoint).

#### Parameters

The following information is required as input for the automation parameters:

| Parameter | Description | Example |
|----------------------|--------------------------|---------|
| Name | Name for the SPN account | MyAPP |
| GenerateClientSecret | Create secret |  |

#### Use the ERCS PrivilegedEndpoint to create the service principal

1. Open an elevated Windows PowerShell session, and run the following cmdlets:

     ```PowerShell  
      # Credential for accessing the ERCS PrivilegedEndpoint, typically domain\cloudadmin
     $Creds = Get-Credential

     # Creating a PSSession to the ERCS PrivilegedEndpoint
     $Session = New-PSSession -ComputerName <ERCS IP> -ConfigurationName PrivilegedEndpoint -Credential $Creds

     # Creating a SPN with a secre
     $ServicePrincipal = Invoke-Command -Session $Session -ScriptBlock {New-GraphApplication -Name '<YourAppName>' -GenerateClientSecret}
     $AzureStackInfo = Invoke-Command -Session $Session -ScriptBlock {Get-AzureStackStampInformation}
     $Session | Remove-PSSession

     # Output the SPN details
     $ServicePrincipal
     ```

2. After cmdlets run, the shell displays the required details to use the SPN. Make sure you store the client secret.

     ```PowerShell  
     ApplicationIdentifier : S-1-5-21-1634563105-1224503876-2692824315-2623
     ClientId              : 8e0ffd12-26c8-4178-a74b-f26bd28db601
     Thumbprint            : 
     ApplicationName       : Azurestack-YourApp-6967581b-497e-4f5a-87b5-0c8d01a9f146
     ClientSecret          : 6RUZLRoBw3EebMDgaWGiowCkoko5_j_ujIPjA8dS
     PSComputerName        : 192.168.200.224
     RunspaceId            : 286daaa1-c9a6-4176-a1a8-03f543f90998
     ```

#### Update client secret for a service principal for AD FS

A new client secret is auto generated by the PowerShell cmdlet.

The script is run from the privileged endpoint on an ERCS virtual machine.

##### Parameters

The following information is required as input for the automation parameters:

| Parameter | Description | Example |
|-----------------------|-----------------------------------------------------------------------------------------------------------|------------------------------------------------|
| ApplicationIdentifier | Unique identifier. | S-1-5-21-1634563105-1224503876-2692824315-2119 |
| ChangeClientSecret | Changes the client secret with a rollover period of 2880 minutes where the old secret is still valid. |  |
| ResetClientSecret | Change the client secret immediately |  |

##### Example of updating a client secret for AD FS

The example uses the **ResetClientSecret** parameter, which immediately changes the client secret.

1. Open an elevated Windows PowerShell session, and run the following cmdlets:

     ```PowerShell  
          # Creating a PSSession to the ERCS PrivilegedEndpoint
          $Session = New-PSSession -ComputerName <ERCS IP> -ConfigurationName PrivilegedEndpoint -Credential $Creds

          # This produces a self signed cert for testing purposes. It is preferred to use a managed certificate for this.
          $NewCert = New-SelfSignedCertificate -CertStoreLocation "cert:\CurrentUser\My" -Subject "CN=<YourAppName>" -KeySpec KeyExchange

          $UpdateServicePrincipal = Invoke-Command -Session $Session -ScriptBlock {Set-GraphApplication -ApplicationIdentifier  S-1-5-21-1634563105-1224503876-2692824315-2120 -ResetClientSecret}

          $Session | Remove-PSSession
     ```

2. After the automation finishes, it displays the newly generated secret required for SPN authentication. Make sure you store the new client secret.

     ```PowerShell  
          ApplicationIdentifier : S-1-5-21-1634563105-1224503876-2692824315-2120
          ClientId              :  
          Thumbprint            : 
          ApplicationName       : Azurestack-Yourapp-6967581b-497e-4f5a-87b5-0c8d01a9f146
          ClientSecret          : MKUNzeL6PwmlhWdHB59c25WDDZlJ1A6IWzwgv_Kn
          RunspaceId            : 6ed9f903-f1be-44e3-9fef-e7e0e3f48564
     ```

### Remove a service principal for AD FS

If you have deployed Azure Stack with AD FS, you can use PowerShell to delete a service principal.

The script is run from the privileged endpoint on an ERCS virtual machine.

#### Parameters

The following information is required as input for the automation parameters:

|Parameter|Description|Example|
|---------|---------|---------|
| Parameter | Description | Example |
| ApplicationIdentifier | Unique identifier | S-1-5-21-1634563105-1224503876-2692824315-2119 |

> [!Note]  
> To view a list of all existing service principals and their Application Identifier, the get-graphapplication command can be used.

#### Example of removing the service principal for AD FS

```powershell  
     Credential for accessing the ERCS PrivilegedEndpoint, typically domain\cloudadmin
     $Creds = Get-Credential

     # Creating a PSSession to the ERCS PrivilegedEndpoint
     $Session = New-PSSession -ComputerName <ERCS IP> -ConfigurationName PrivilegedEndpoint -Credential $Creds

     $UpdateServicePrincipal = Invoke-Command -Session $Session -ScriptBlock {Remove-GraphApplication -ApplicationIdentifier S-1-5-21-1634563105-1224503876-2692824315-2119}

     $Session | Remove-PSSession
```

## Assign a role

To access resources in your subscription, you must assign the application to a role. Decide which role represents the right permissions for the application. To learn about the available roles, see [RBAC: Built in Roles](../role-based-access-control/built-in-roles.md).

You can set the scope at the level of the subscription, resource group, or resource. Permissions are inherited to lower levels of scope. For example, adding an application to the Reader role for a resource group means it can read the resource group and any resources it contains.

1. In the Azure Stack portal, navigate to the level of scope you wish to assign the application to. For example, to assign a role at the subscription scope, select **Subscriptions**. You could instead select a resource group or resource.

2. Select the particular subscription (resource group or resource) to assign the application to.

     ![Select subscription for assignment](./media/azure-stack-create-service-principal/image16.png)

3. Select **Access Control (IAM)**.

     ![Select access](./media/azure-stack-create-service-principal/image17.png)

4. Select **Add role assignment**.

5. Select the role you wish to assign to the application.

6. Search for your application, and select it.

7. Select **OK** to finish assigning the role. You see your application in the list of users assigned to a role for that scope.

Now that you've created a service principal and assigned a role, you can begin using this within your application to access Azure Stack resources.  

## Next steps

[Add users for AD FS](azure-stack-add-users-adfs.md)  
[Manage user permissions](azure-stack-manage-permissions.md)  
[Azure Active Directory Documentation](https://docs.microsoft.com/azure/active-directory)  
[Active Directory Federation Services](https://docs.microsoft.com/windows-server/identity/active-directory-federation-services)
