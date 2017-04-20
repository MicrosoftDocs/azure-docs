> [!NOTE]
> This will be deprecated.

1. Create an Admin in the Azure AD B2C tenant.

    a. In the [Azure Portal](https://portal.azure.com), switch into the context of your Azure AD B2C tenant and open the Azure AD B2C blade. [Show me how.](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade)
    
    b. Select **Users and groups**
    
    c. Select **All users**
    
    d. Click **New user**
    
    e. Set Name="Admin" and User name="admin@yourtenant.onmicrosoft.com" where yourtenant is the name of the Azure AD B2C tenant you created in step 1.
    
    f. Under "Directory role" choose "Global administrator" and hit "Ok"
    
    g. Click **Create** to create the admin user.
    
    h. Check "Show password" and copy the password

2. Open a new powershell command prompt.  One method is WindowsKey-R, type "powershell", and hit enter.

3. Download this repro to get the powershell ExploreAdmin tool.
```powershell
git clone https://github.com/Azure-Samples/active-directory-b2c-advanced-policies
```

4. Switch into the folder with the ExploreAdmin tool.
```powershell
cd active-directory-b2c-advanced-policies\ExploreAdmin
```

5. Import the ExploreAdmin tool into powershell.
```powershell
Import-Module .\ExploreAdmin.dll
```

6. Confirm the TokenSigningKeyContainer does not yet exist.  Replace yourtenant with the name of your tenant.
```powershell
Get-CpimKeyContainer -TenantId yourtenant.onmicrosoft.com -StorageReferenceId TokenSigningKeyContainer -ForceAuthenticationPrompt
```

    a. You will be prompted to login.  Use the admin account you created in step 1.

    b. You will be prompted to setup your phone number as a second factor and to change your password.

    c. You should receive an error that 'TokenSigningKeyContainer' cannot be found.  If you have already completed these steps previously you scan skip past this section. 

7. Create the TokenSigningKeyContainer.  Replace yourtenant with the name of your tenant.
```powershell
New-CpimKeyContainer yourtenant.onmicrosoft.com TokenSigningKeyContainer TokenSigningKeyContainer rsa 2048 0 0
```

8. Create the TokenEncryptionKeyContainer.  Replace yourtenant with the name of your tenant.
```powershell
New-CpimKeyContainer yourtenant.onmicrosoft.com TokenEncryptionKeyContainer TokenEncryptionKeyContainer rsa 2048 0 0
```
