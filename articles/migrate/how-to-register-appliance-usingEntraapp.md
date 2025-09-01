---
title: Setup Azure Migrate appliance using a pre-configured Entra ID application
description: Learn how to set up Azure Migrate appliance using a pre-configured Entra ID application.
author: molishv
ms.author: molir
ms.manager: ronai
ms.topic: how-to
ms.service: azure-migrate
ms.date: 09/01/2025
ms.custom: engagement-fy25
# Customer intent: "As an IT administrator, I would like ot set up Migarte appliance using an existing Entra ID application and not in the user context to avoid challenges such as missing tenant permissions for the user and DCF being disabled at Entra ID level."
---

# Setup Azure Migrate appliance using a pre-configured Entra ID application


When setting up the Azure Migrate appliance, users typically sign in to Azure to register the appliance with an Azure Migrate project. The common challenges in this step include
-	**Insufficient permissions at tenant level**: The user deploying the appliance may lack tenant-level permissions required to register applications in Microsoft Entra ID. 
-	**DCF restrictions**: Some organizations disable Device Code Flow (DCF) in Entra ID, which blocks appliance registration.
-	**Use of Pre-Approved Entra ID Applications**: Enterprises may prefer to use existing, pre-approved Entra ID applications that align with internal naming conventions and compliance policies, rather than allowing the appliance to create a new Entra ID app automatically.
To overcome these challenges and avoid registering the appliance under a user's context, customers can use an existing, pre-configured Entra ID (AAD) application for appliance registration.


## 1.	Register an Entra ID application and assign permissions

-	Follow these [steps](../identity-platform/howto-create-service-principal-portal.md) to register a new application (or use an existing application) in Microsoft Entra ID. A service principal is automatically created for the app registration.
-	In the Resource Group where Azure Migrate project is deployed, assign contributor role to the registered Microsoft Entra application. 
![Screenshot of permissions assignment.](./media/how-to-register-appliance-usingAADapp/contributor.png)

## 2.	Generate certificates to authenticate the application

- For authentication of the Entra ID application, you can use Certificate Authority (CA) signed certificate (Recommended) or a self-signed certificate. Any other tools like PowerShell, OpenSSL, mkcert or Azure Key Vault can be used to generate certificates. 
- The following is a PowerShell command to generate a self-signed certificate. 
Replace `{certificateName}` with the name that you wish to give to your certificate.

```powershell
$certname = "{certificateName}"    ## Replace {certificateName}
$cert = New-SelfSignedCertificate -Subject "CN=$certname" -CertStoreLocation "Cert:\CurrentUser\My" -KeyExportPolicy Exportable -KeySpec Signature -KeyLength 2048 -KeyAlgorithm RSA -HashAlgorithm SHA256

```

## 3. Export the public and private certificates
**Public certificate:**
The command below exports the certificate in *.cer* format. You can also export it in other formats supported on the Azure portal including *.pem* and *.crt*.

```powershell

Export-Certificate -Cert $cert -FilePath "C:\Users\admin\Desktop\$certname.cer"   ## Specify your preferred location

```

The certificate is now ready to be uploaded to Entra ID application.
**Private certificate:**
Following on from the previous commands, create a password for your certificate private key and save it in a variable. Replace `{myPassword}` with the password that you wish to use to protect your certificate private key.

```powershell

$mypwd = ConvertTo-SecureString -String "{myPassword}" -Force -AsPlainText  ## Replace {myPassword}

```

Using the password you stored in the `$mypwd` variable, secure and export your private key using the command;

```powershell

Export-PfxCertificate -Cert $cert -FilePath "C:\Users\admin\Desktop\$certname.pfx" -Password $mypwd   ## Specify your preferred location

```

Save the private certificated(_.pfx file) in Azure Migrate appliance machine.

## 4.	Upload the public certificate to Entra ID application
-	Navigate to Microsoft Entra ID > App registrations and select the application you registered earlier.
-	In the left pane, select Certificates & secrets.
-	Under the Certificates section, select Upload certificate.
-	Browse to the folder and select the .cer file containing your public certificate.
-	Select Add to complete the upload.
![Screenshot of procedure to upload certificate in Entra App.](./media/how-to-register-appliance-usingAADapp/UploadcertificatetoEntraIDApp.png)

-	Note down the Entra ID app details that will be later required when configuring appliance.  
 ```
Display name: 
Application(client) ID:
Object ID: 
Tenant ID: 
Certificates & secrets ->Thumbprint: 
Service principal Object ID: 


   ```
![Screenshot of Entra ID properties.](./media/how-to-register-appliance-usingAADapp/EntraIDproperties.png)
-	Navigate to Microsoft Entra ID -> Enterprise applications -> Manage all applications and copy the service principal object ID.
![Screenshot of Entra ID properties.](./media/how-to-register-appliance-usingAADapp/Serviceprincipal.png)

## 5.	Install the private certificate in Appliance machine
-	Log in to the appliance machine and navigate to the folder where private certifciate is saved. Double click on the file and install the private certificate. 
![Screenshot of procedure to install certificate in Appliance.](./media/how-to-register-appliance-usingAADapp/Installprivatecertificate01.png)
-	Choose store location as Local machine. 
-	Click next and specify the file path of the certificate. 
![Screenshot of procedure to install certificate in Appliance.](./media/how-to-register-appliance-usingAADapp/Installprivatecertificate02.png)
-	Enter the password created while exporting the private key.
-	Specify the certificate store location as Personal and click on Finish to import the certificate. 
![Screenshot of procedure to install certificate in Appliance.](./media/how-to-register-appliance-usingAADapp/Installprivatecertificate03.png)



## 7.	Update the registry values in Appliance machine
-	Run the following PowerShell script in Appliance machine to update the registry values. 
```powershell

# Function to check if the last command was successful, otherwise exit the script
function Check-Error {
    if (!$?) {
        Write-Output "Error encountered. Exiting script."
        exit 1
    }
}

$tenantId = Read-Host "Please enter the Entra app tenant id: "
$agentServiceCommAadAppClientId = Read-Host "Please enter the Entra app client id: "
$agentServiceCommAadAppObjectId = Read-Host "Please enter the Entra app object id: "
$agentServiceCommAadAppName = Read-Host "Please enter the Entra app display name: "
$agentServiceCommAadAppSpnObjectId = Read-Host "Please enter the Entra app SPN object id: "
$localCertThumbprint = Read-Host "Please enter the Entra app cert thumbprint: "

$registryEntries = @{
    "LocalCertThumbprint"                       = $localCertThumbprint
    "AzureMigrateApplianceAadAppCertThumbPrint" = $localCertThumbprint
    "AgentServiceCommAadAppClientId"            = $agentServiceCommAadAppClientId
    "AzureMigrateApplianceAadAppClientId"       = $agentServiceCommAadAppClientId
    "AgentServiceCommAadAppObjectId"            = $agentServiceCommAadAppObjectId
    "AgentServiceCommAadAppName"                = $agentServiceCommAadAppName
    "AgentServiceCommAadAppSpnObjectId"         = $agentServiceCommAadAppSpnObjectId
    "AzureMigrateApplianceAadAppTenantId"       = $tenantId
}

# Define the registry path
$registryPath = "HKLM:\SOFTWARE\Microsoft\AzureAppliance"

# Create registry entries
Write-Output "Creating registry entries under '$registryPath'..."

# Set each registry entry
foreach ($entry in $registryEntries.GetEnumerator()) {
    Write-Output "Creating registry key '$($entry.Key)' with value '$($entry.Value)'..."
    New-ItemProperty -Path $registryPath -Name $entry.Key -Value $entry.Value -PropertyType String -Force
    Check-Error
}

Write-Output "All registry entries created successfully!"


```
-	Navigate to Registry editor ->AzureAppliance and verify if the registry values are updated correctly. The registry values can also be updated manually if there are any misconfigurations. 
![Screenshot of Appliance registry.](./media/how-to-register-appliance-usingAADapp/Registry.png)

## 8.	Complete appliance registration using Entra ID app
-	After updating the registry values, clear the browser cache and reload the page to start Entra ID App Authentication flow from the config manager.
-	Appliance registration would be completed and the Entra ID app name is displayed in the config manager. 
![Screenshot of Appliance Config Manager.](./media/how-to-register-appliance-usingAADapp/EntraIDregisteredappliance.png)


## Limitations

-	An Entra ID application registered for appliance authentication is limited to one Azure Migrate appliance. You cannot reuse the same Entra application to register multiple appliances, even if they are part of the same Azure Migrate project or a different one.
To deploy another appliance, you must register a new application in Microsoft Entra ID, ensure a new service principal is created, and assign the required Azure role (such as Contributor) to the new application in the appropriate resource group.
-	The approach can be used to set up [VMware](how-to-set-up-appliance-vmware.md), [Hyper-V](how-to-set-up-appliance-hyper-v.md) and [physical](how-to-set-up-appliance-physical.md) stack of Azure Migrate appliance. This approach cannot be used to set up [ASR replication appliance](tutorial-migrate-physical-virtual-machines.md\Set up the replication appliance). 


## Next steps

- Discover [VMware](how-to-set-up-appliance-vmware.md) estate.
- Discover [Hyper-V](how-to-set-up-appliance-hyper-v.md) estate.
- Discover [physical](how-to-set-up-appliance-physical.md)  servers or servers running in public cloud. 