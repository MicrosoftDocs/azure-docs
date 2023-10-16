---
author: billmath
ms.service: active-directory
ms.subservice: cloud-provisioning
ms.custom: has-azure-ad-ps-ref
ms.topic: include
ms.date: 10/16/2019
ms.author: billmath
# Used by articles that require an SSO workaround.
---

## Steps to enable Single Sign-on
Cloud provisioning works with Single Sign-on.  Currently there is not an option to enable SSO when the agent is installed, however you can use the steps below to enable SSO and use it. 

<a name='step-1-download-and-extract-azure-ad-connect-files'></a>

### Step 1: Download and extract Microsoft Entra Connect files
1.  First, download the latest version of [Microsoft Entra Connect](https://www.microsoft.com/download/details.aspx?id=47594)
2.  Open a command prompt using Administrative privileges and navigate to the msi you just downloaded.
3.  Run the following:  `msiexec /a C:\filepath\AzureADConnect.msi /qb TARGETDIR=C:\filepath\extractfolder`
4. Change filepath and extractfolder to match your file path and the name of your extraction folder.  The contents should now be in the extraction folder.

### Step 2: Import the Seamless SSO PowerShell module

1. Download, and install [Azure AD PowerShell](/powershell/azure/active-directory/overview).
2. Browse to the `Microsoft Azure Active Directory Connect` folder which should be in the extraction folder from Step 1.
3. Import the Seamless SSO PowerShell module by using this command: `Import-Module .\AzureADSSO.psd1`.

### Step 3: Get the list of Active Directory forests on which Seamless SSO has been enabled

1. Run PowerShell as an administrator. In PowerShell, call `New-AzureADSSOAuthenticationContext`. When prompted, enter your tenant's global administrator credentials.
2. Call `Get-AzureADSSOStatus`. This command provides you with the list of Active Directory forests (look at the "Domains" list) on which this feature has been enabled.

### Step 4: Enable Seamless SSO for each Active Directory forest

1. Call `Enable-AzureADSSOForest`. When prompted, enter the domain administrator credentials for the intended Active Directory forest.

   > [!NOTE]
   >The domain administrator credentials username must be entered in the SAM account name format (`contoso\johndoe` or `contoso.com\johndoe`). We use the domain portion of the username to locate the Domain Controller of the Domain Administrator using DNS.

   >[!NOTE]
   >The domain administrator account used must not be a member of the Protected Users group. If so, the operation will fail.

2. Repeat the preceding step for each Active Directory forest where you want to set up the feature.

### Step 5: Enable the feature on your tenant

To turn on the feature on your tenant, call `Enable-AzureADSSO -Enable $true`.
