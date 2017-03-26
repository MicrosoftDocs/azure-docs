# Azure AD Connect sync: Encryption key
Azure AD Connect Synchronization Service uses 3 types of accounts:

* **Azure AD Connect sync service account** – this is the user account used by the Synchronization Service as the operating context while running as a Windows service.

* **AD DS account** – this is the user account used by the Synchronization Service to connect to on-premises AD. You need one account for each on-premises AD.

* **Azure AD service account** – this is the user account used by the Synchronization Service to connect to Azure AD.

The passwords of the AD DS account and Azure AD service account are encrypted before they are stored in the Synchronization Service database. The encryption key is secured using [Windows Data Protection (DPAPI)](https://msdn.microsoft.com/library/ms995355.aspx). DPAPI protects the encryption key using the password of the Azure AD Connect sync service account. Under specific conditions, if the password of the service account is updated, the Synchronization Service can no longer retrieve the encryption key via DPAPI. Without the encryption key, the Synchronization Service cannot decrypt the passwords required to synchronize to/from on-premises AD and Azure AD.

## Symptoms
There are two common symptoms:

* In the Windows Service Control Manager, if you try to start the Synchronization Service and it cannot retrieve the encryption key, it will fail with error “Windows could not start the Microsoft Azure AD Sync on Local Computer. For more information, review the System Event log. If this is a non-Microsoft service, contact the service vendor, and refer to service-specific error code -21451857952.”

* Under Windows Event Viewer, the application event log contains an error with Event ID 6028 and error message *“The server encryption key cannot be accessed”.*

## Recovery steps

To resolve this issue, you need to:

1. Abandon the existing encryption key

2. Provide the Synchronization Service with the password of the AD DS sync account

3. Reinitialize the password of the Azure AD sync account

4. Start the Synchronization Service.

### Abandon the existing encryption key
Abandon the existing encryption key sp that new encryption key can be created:

1. Login to your Azure AD Connect Server as administrator.

2. Start a new PowerShell session.

3. Navigate to folder: `$env:programfiles\Microsoft Azure AD Sync\bin\`

4. Run the command: `./miiskmu.exe /a`
