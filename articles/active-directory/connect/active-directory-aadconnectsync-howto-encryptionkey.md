# Azure AD Connect sync: How to manage encryption key
Azure AD Connect Synchronization Service uses 3 types of accounts:

* **Azure AD Connect sync service account** – this is the user account used by the Synchronization Service as the operating context while running as a Windows service.

* **AD DS account** – this is the user account used by the Synchronization Service to connect to on-premises AD. You need one account for each on-premises AD.

* **Azure AD service account** – this is the user account used by the Synchronization Service to connect to Azure AD.

The passwords of the AD DS account and Azure AD service account are encrypted by the Synchronization Service before they are stored in the database. The encryption key used is secured using [Windows Data Protection (DPAPI)](https://msdn.microsoft.com/library/ms995355.aspx). DPAPI protects the encryption key using the **password of the Azure AD Connect sync service account**. Under specific conditions, if the password is updated, the Synchronization Service can no longer retrieve the encryption key via DPAPI. Without the encryption key, the Synchronization Service cannot decrypt the passwords required to synchronize to/from on-premises AD and Azure AD.

## Symptoms
There are two common symptoms:

* Under Windows Service Control Manager, if you try to start the Synchronization Service and it cannot retrieve the encryption key, it will fail with error “Windows could not start the Microsoft Azure AD Sync on Local Computer. For more information, review the System Event log. If this is a non-Microsoft service, contact the service vendor, and refer to service-specific error code -21451857952.”

* Under Windows Event Viewer, the application event log contains an error with Event ID 6028 and error message *“The server encryption key cannot be accessed”.*

## Recovery steps

To resolve this issue, you need to:

1. [Abandon the existing encryption key](#abandon-the-existing-encryption-key)

2. [Provide the password of the AD DS account](#provide-the-password-of-the-ad-ds-account)

3. [Reinitialize the password of the Azure AD sync account](#reinitialize-the-password-of-the-azure-ad-sync-account)

4. [Start the Synchronization Service](#start-the-synchronization-service)

### Abandon the existing encryption key
Abandon the existing encryption key so that new encryption key can be created:

1. Login to your Azure AD Connect Server as administrator.

2. Start a new PowerShell session.

3. Navigate to folder: `$env:programfiles\Microsoft Azure AD Sync\bin\`

4. Run the command: `./miiskmu.exe /a`

### Provide the password of the AD DS account
As the existing passwords stored inside the database can no longer be decrypted, you need to provide the Synchronization Service with the password of the AD DS account. The Synchronization Service will encrypt the passwords using the new encryption key:

1. Start the **Synchronization Service Manager** (START → Synchronization Service).

2. Go to the **Connectors** tab.

3. Select the **AD Connector** which corresponds to your on-premises AD. If you have more than one AD connector, repeat the following steps for each of them.

4. Under **Actions**, select **Properties**.

5. In the pop-up dialog, select **Connect to Active Directory Forest**:

    1. The **Forest name** indicates the corresponding on-prem AD.
    
    2. The **User name** indicates the AD DS account used for synchronization.

6. Enter the password of the AD DS account in the **Password** textbox. If you do not know its password, you must set it to a known value before performing this step.

7. Click **OK** to save the new password and close the pop-up dialog.

### Reinitialize the password of the Azure AD sync account
You cannot directly provide the password of the Azure AD service account to the Synchronization Service. Instead, you need to use the cmdlet Add-ADSyncAADServiceAccount to reinitialize the Azure AD service account. The cmdlet resets the account password and makes it available to the Synchronization Service:

1. Start a new PowerShell session on the Azure AD Connect server.

2. Run cmdlet `Add-ADSyncAADServiceAccount`.

3. In the pop up dialog, provide the Azure AD Global admin credentials for your Azure AD tenant.

### Start the Synchronization Service
Now that the Synchronization Service has access to the encryption key and all the passwords it needs, you can restart the service in the Windows Service Control Manager:

1. Go to **Windows Service Control Manager** (START → Services).

2. Select **Microsoft Azure AD Sync** and click **Start**.

## Next steps
**Overview topics**

* [Azure AD Connect sync: Understand and customize synchronization](active-directory-aadconnectsync-whatis.md)

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
