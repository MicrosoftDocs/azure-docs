> [!NOTE]
> We are working to improve this experience. The following steps will soon be deprecated.

### Create an administrator credential in the Azure AD B2C tenant.

For the next section, you will need to use a credential that uses the domain of your Azure AD B2C tenant. To do so, you need to create an administrator account with such credential. To do so:

1. In the [Azure portal](https://portal.azure.com), switch into the context of your Azure AD B2C tenant and open the Azure AD B2C blade. [Show me how.](..\articles\active-directory-b2c\active-directory-b2c-navigate-to-b2c-context.md)
1. Select **Users and groups**.
1. Select **All users**.
1. Click **+ New user**.
    * Set **Name** = `Admin`.
    * Set **Username** = `admin@{tenantName}.onmicrosoft.com` where `{tenantName}` is the name of your Azure AD B2C tenant.
1. Under **Directory role** choose **Global administrator** and hit **Ok**.
1. Click **Create** to create the admin user.
1. Check **Show password** and copy the password.

### Set up the key container

The key container is what you will use to store keys. To set one up:

1. Open a new powershell command prompt.  One method is **Windows Logo Key + R**, type `powershell`, and hit enter.
1. Download this repro to get the powershell ExploreAdmin tool.

    ```powershell
    git clone https://github.com/Azure-Samples/active-directory-b2c-advanced-policies
    ```

1. Switch into the folder with the ExploreAdmin tool.

    ```powershell
    cd active-directory-b2c-advanced-policies\ExploreAdmin
    ```

1. Import the ExploreAdmin tool into powershell.

    ```powershell
    Import-Module .\ExploreAdmin.dll
    ```

1. Confirm the TokenSigningKeyContainer does not yet exist.  Replace `{tenantName}` with the name of your tenant.

    ```powershell
    Get-CpimKeyContainer -TenantId {tenantName}.onmicrosoft.com -StorageReferenceId TokenSigningKeyContainer -ForceAuthenticationPrompt
    ```

    a. You will be prompted to log in.  Use the admin account you created in the previous section.

    b. You will be prompted to set up your phone number as a second factor and to change your password.

    c. You should receive an error that 'TokenSigningKeyContainer' cannot be found.  If you have already completed these steps previously you scan skip the rest of this section.


1. Create the TokenSigningKeyContainer.  Replace `{tenantName}` with the name of your tenant.

    ```powershell
    New-CpimKeyContainer {tenantName}.onmicrosoft.com TokenSigningKeyContainer TokenSigningKeyContainer rsa 2048 0 0
    ```

1. Create the TokenEncryptionKeyContainer.  Replace `{tenantName}` with the name of your tenant.

    ```powershell
    New-CpimKeyContainer {tenantName}.onmicrosoft.com TokenEncryptionKeyContainer TokenEncryptionKeyContainer rsa 2048 0 0
    ```
