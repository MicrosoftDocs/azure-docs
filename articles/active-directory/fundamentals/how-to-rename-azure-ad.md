---
title: How to rename Azure Active Directory (Azure AD)
description: Learn about best practices and tips on how customers and organizations can update their documentation or content to use the Microsoft Entra ID product name and icon.
services: active-directory
author: CelesteDG
manager: CelesteDG
ms.service: active-directory
ms.subservice: fundamentals
ms.topic: how-to
ms.date: 09/27/2023
ms.author: celested
ms.reviewer: nicholepet

# Customer intent: As a content creator, employee of an organization with internal documentation for IT or identity security admins, developer of Azure AD-enabled apps, ISV, or Microsoft partner, I want to learn how to correctly update our documentation or content to use the new name for Azure AD.
---

# How to: Rename Azure AD

Azure Active Directory (Azure AD) has been renamed to Microsoft Entra ID to better communicate the multicloud, multiplatform functionality of the product and unify the naming of the Microsoft Entra product family.

This article provides best practices and support for customers and organizations who wish to update their documentation or content with the new product name and icon.

## Prerequisites

Before changing instances of Azure AD to Microsoft Entra ID in your documentation or content, familiarize yourself with the guidance in [New name for Azure AD](new-name.md) to:

- Understand the product name and why we made the change
- Download the new product icon
- Get a list of names that aren't changing
- Get answers to the more frequently asked questions and more

## Assess and scope renaming updates for your content

Audit your experiences to find references to Azure AD and its icons.

**Scan your content** to identify references to Azure AD and its synonyms. Compile a detailed list of all instances.

- Search for the following terms: `Azure Active Directory (Azure AD)`, `Azure Active Directory`, `Azure AD`, `AAD`
- Search for graphics with the Azure AD icon (![Azure AD product icon](./media/new-name/azure-ad-icon-1.png)  ![Alternative Azure AD product icon](./media/new-name/azure-ad-icon-2.png)) to replace with the Microsoft Entra ID icon (![Microsoft Entra ID product icon](./media/new-name/microsoft-entra-id-icon.png))

You can download the Microsoft Entra ID icon here: [Microsoft Entra architecture icons](../architecture/architecture-icons.md)

**Identify exceptions in your list**:

- Don't make breaking changes.
- Review the [What names aren't changing?](new-name.md#what-names-arent-changing) section in the naming guidance and note which Azure AD terminology isn't changing.
- Don’t change instances of `Active Directory`. Only `Azure Active Directory` is being renamed, not `Active Directory`, which is the shortened name of a different product, Windows Server Active Directory.

**Evaluate and prioritize based on future usage**. Consider which content needs to be updated based on whether it's user-facing or has broad visibility within your organization, audience, or customer base. You may decide that some code or content doesn't need to be updated if it has limited exposure to your end-users.

Decide whether existing dated content such as videos or blogs are worth updating for future viewers. It's okay to not rename old content. To help end-users, you may want to add a disclaimer such as "Azure AD is now Microsoft Entra ID."

## Update the naming in your content

Update your organization's content and experiences using the relevant tools.

### How to use "find and replace" for text-based content

1. Almost all editing tools offer "search and replace" or "find and replace" functionality, either natively or using plug-ins. Use your preferred app.
1. Use "find and replace" to find the strings `Azure Active Directory (Azure AD)`, `Azure Active Directory`, `Azure AD`, `AAD`.
1. Don't replace all instances with Microsoft Entra ID.
1. Review whether each instance refers to the product or a feature of the product.

   - Azure AD as the product name alone should be replaced with Microsoft Entra ID.
   - Azure AD features or functionality become Microsoft Entra features or functionality. For example, "Azure AD Conditional Access" becomes "Microsoft Entra Conditional Access."

### Automate bulk editing using custom code

Use the following criteria to determine what change(s) you need to make to instances of `Azure Active Directory (Azure AD)`, `Azure Active Directory`, `Azure AD`, `AAD`.

1. If the text string is found in the naming dictionary of previous terms, change it to the new term.
1. If a punctuation mark follows `Azure Active Directory (Azure AD)`, `Azure Active Directory`, `Azure AD`, or `AAD`, replace with `Microsoft Entra ID` because that's the product name.
1. If `Azure Active Directory (Azure AD)`, `Azure Active Directory`, `Azure AD`, or `AAD` is followed by `for`, `Premium`, `Plan`, `P1`, or `P2`, replace with `Microsoft Entra ID` because it refers to a SKU name or Service Plan.
1. If an article (`a`, `an`, `the`) or possessive (`your`, `your organization's`) precedes (`Azure Active Directory (Azure AD)`, `Azure Active Directory`, `Azure AD`, `AAD`), then replace with `Microsoft Entra` because it's a feature name. For example:
   1. "an Azure AD tenant" becomes "a Microsoft Entra tenant"
   1. "your organization's Azure AD tenant" becomes "your Microsoft Entra tenant"

1. If `Azure Active Directory (Azure AD)`, `Azure Active Directory`, `Azure AD`, or `AAD` is followed by an adjective or noun not in the previous steps, then replace with `Microsoft Entra` because it's a feature name. For example, `Azure AD Conditional Access` becomes `Microsoft Entra Conditional Access`, while `Azure AD tenant` becomes `Microsoft Entra tenant`.
1. Otherwise, replace `Azure Active Directory (Azure AD)`, `Azure Active Directory`, `Azure AD`, or `AAD` with `Microsoft Entra ID`.

See the section [Glossary of updated terminology](new-name.md#glossary-of-updated-terminology) to further refine your custom logic.

### Update graphics and icons

1. Replace the Azure AD icon with the Microsoft Entra ID icon.
1. Replace titles or text containing `Azure Active Directory (Azure AD)`, `Azure Active Directory`, `Azure AD`, or `AAD` with `Microsoft Entra ID`.

## Sample PowerShell script

You can use following PowerShell script as a baseline to rename Azure AD references in your documentation or content. This code sample:

- Scans `.resx` files within a specified folder and all nested folders.
- Edits files by replacing any references to `Azure Active Directory (Azure AD)`, `Azure Active Directory`, `Azure AD`, `AAD` with the correct terminology according to [New name for Azure AD](new-name.md).

Edit the baseline script according to your needs and the scope of files you need to update. You may need to account for edge cases and modify the script according to how you've defined the messages in your source files. The script is not fully automated. If you use the script as-is, you must review the outputs and may need to make additional adjustments to follow the guidance in [New name for Azure AD](new-name.md).

```powershell
# Define the old and new terminology
$terminology = @(
    @{ Key = 'Azure AD External Identities'; Value = 'Microsoft Entra External ID' },
    @{ Key = 'Azure AD Identity Governance'; Value = 'Microsoft Entra ID Governance' },
    @{ Key = 'Azure AD Verifiable Credentials'; Value = 'Microsoft Entra Verified ID' },
    @{ Key = 'Azure AD Workload Identities'; Value = 'Microsoft Entra Workload ID' },
    @{ Key = 'Azure AD Domain Services'; Value = 'Microsoft Entra Domain Services' },
    @{ Key = 'Azure AD access token authentication'; Value = 'Microsoft Entra access token authentication' },
    @{ Key = 'Azure AD admin center'; Value = 'Microsoft Entra admin center' },
    @{ Key = 'Azure AD portal'; Value = 'Microsoft Entra portal' },
    @{ Key = 'Azure AD application proxy'; Value = 'Microsoft Entra application proxy' },
    @{ Key = 'Azure AD authentication'; Value = 'Microsoft Entra authentication' },
    @{ Key = 'Azure AD Conditional Access'; Value = 'Microsoft Entra Conditional Access' },
    @{ Key = 'Azure AD cloud-only identities'; Value = 'Microsoft Entra cloud-only identities' },
    @{ Key = 'Azure AD Connect'; Value = 'Microsoft Entra Connect' },
    @{ Key = 'AD Connect'; Value = 'Microsoft Entra Connect' },
    @{ Key = 'AD Connect Sync'; Value = 'Microsoft Entra Connect Sync' },
    @{ Key = 'Azure AD Connect Sync'; Value = 'Microsoft Entra Connect Sync' },
    @{ Key = 'Azure AD domain'; Value = 'Microsoft Entra domain' },
    @{ Key = 'Azure AD domain'; Value = 'Microsoft Entra domain' },
    @{ Key = 'Azure AD Domain Services'; Value = 'Microsoft Entra Domain Services' },
    @{ Key = 'Azure AD Enterprise Applications'; Value = 'Microsoft Entra enterprise applications' },
    @{ Key = 'Azure AD federation services'; Value = 'Active Directory Federation Services' },
    @{ Key = 'Azure AD hybrid identities'; Value = 'Microsoft Entra hybrid identities' },
    @{ Key = 'Azure AD identities'; Value = 'Microsoft Entra identities' },
    @{ Key = 'Azure AD role'; Value = 'Microsoft Entra role' },
    @{ Key = 'Azure AD'; Value = 'Microsoft Entra ID' },
    @{ Key = 'AAD'; Value = 'ME-ID' },
    @{ Key = 'Azure AD auth'; Value = 'Microsoft Entra auth' },
    @{ Key = 'Azure AD-only auth'; Value = 'Microsoft Entra-only auth' },
    @{ Key = 'Azure AD object'; Value = 'Microsoft Entra object' },
    @{ Key = 'Azure AD identity'; Value = 'Microsoft Entra identity' },
    @{ Key = 'Azure AD schema'; Value = 'Microsoft Entra schema' },
    @{ Key = 'Azure AD seamless single sign-on'; Value = 'Microsoft Entra seamless single sign-on' },
    @{ Key = 'Azure AD self-service password reset'; Value = 'Microsoft Entra self-service password reset' },
    @{ Key = 'Azure AD SSPR'; Value = 'Microsoft Entra SSPR' },
    @{ Key = 'Azure AD domain'; Value = 'Microsoft Entra domain' },
    @{ Key = 'Azure AD group'; Value = 'Microsoft Entra group' },
    @{ Key = 'Azure AD login'; Value = 'Microsoft Entra login' },
    @{ Key = 'Azure AD managed'; Value = 'Microsoft Entra managed' },
    @{ Key = 'Azure AD entitlement'; Value = 'Microsoft Entra entitlement' },
    @{ Key = 'Azure AD access review'; Value = 'Microsoft Entra access review' },
    @{ Key = 'Azure AD Identity Protection'; Value = 'Microsoft Entra ID Protection' },
    @{ Key = 'Azure AD pass-through'; Value = 'Microsoft Entra pass-through' },
    @{ Key = 'Azure AD password'; Value = 'Microsoft Entra password' },
    @{ Key = 'Azure AD Privileged Identity Management'; Value = 'Microsoft Entra Privilegd Identity Management' },
    @{ Key = 'Azure AD registered'; Value = 'Microsoft Entra registered' },
    @{ Key = 'Azure AD reporting and monitoring'; Value = 'Microsoft Entra reporting and monitoring' },
    @{ Key = 'Azure AD enterprise app'; Value = 'Microsoft Entra enterprise app' },
    @{ Key = 'Azure AD cloud-only identities'; Value = 'Microsoft Entra cloud-only identities' },
    @{ Key = 'Cloud Knox'; Value = 'Microsoft Entra Permissions Management' },
    @{ Key = 'Azure AD Premium P1'; Value = 'Microsoft Entra ID P1' },
    @{ Key = 'AD Premium P1'; Value = 'Microsoft Entra ID P1' },
    @{ Key = 'Azure AD Premium P2'; Value = 'Microsoft Entra ID P2' },
    @{ Key = 'AD Premium P2'; Value = 'Microsoft Entra ID P2' },
    @{ Key = 'Azure AD F2'; Value = 'Microsoft Entra ID F2' },
    @{ Key = 'Azure AD Free'; Value = 'Microsoft Entra ID Free' },
    @{ Key = 'Azure AD for education'; Value = 'Microsoft Entra ID for education' },
    @{ Key = 'Azure AD work or school account'; Value = 'Microsoft Entra work or school account' },
    @{ Key = 'federated with Azure AD'; Value = 'federated with Microsoft Entra' },
    @{ Key = 'Hybrid Azure AD Join'; Value = 'Microsoft Entra hybrid join' },
    @{ Key = 'Azure Active Directory External Identities'; Value = 'Microsoft Entra External ID' },
    @{ Key = 'Azure Active Directory Identity Governance'; Value = 'Microsoft Entra ID Governance' },
    @{ Key = 'Azure Active Directory Verifiable Credentials'; Value = 'Microsoft Entra Verified ID' },
    @{ Key = 'Azure Active Directory Workload Identities'; Value = 'Microsoft Entra Workload ID' },
    @{ Key = 'Azure Active Directory Domain Services'; Value = 'Microsoft Entra Domain Services' },
    @{ Key = 'Azure Active Directory access token authentication'; Value = 'Microsoft Entra access token authentication' },
    @{ Key = 'Azure Active Directory admin center'; Value = 'Microsoft Entra admin center' },
    @{ Key = 'Azure Active Directory portal'; Value = 'Microsoft Entra portal' },
    @{ Key = 'Azure Active Directory application proxy'; Value = 'Microsoft Entra application proxy' },
    @{ Key = 'Azure Active Directory authentication'; Value = 'Microsoft Entra authentication' },
    @{ Key = 'Azure Active Directory Conditional Access'; Value = 'Microsoft Entra Conditional Access' },
    @{ Key = 'Azure Active Directory cloud-only identities'; Value = 'Microsoft Entra cloud-only identities' },
    @{ Key = 'Azure Active Directory Connect'; Value = 'Microsoft Entra Connect' },
    @{ Key = 'Azure Active Directory Connect Sync'; Value = 'Microsoft Entra Connect Sync' },
    @{ Key = 'Azure Active Directory domain'; Value = 'Microsoft Entra domain' },
    @{ Key = 'Azure Active Directory domain'; Value = 'Microsoft Entra domain' },
    @{ Key = 'Azure Active Directory Domain Services'; Value = 'Microsoft Entra Domain Services' },
    @{ Key = 'Azure Active Directory Enterprise Applications'; Value = 'Microsoft Entra enterprise applications' },
    @{ Key = 'Azure Active Directory federation services'; Value = 'Active Directory Federation Services' },
    @{ Key = 'Azure Active Directory hybrid identities'; Value = 'Microsoft Entra hybrid identities' },
    @{ Key = 'Azure Active Directory identities'; Value = 'Microsoft Entra identities' },
    @{ Key = 'Azure Active Directory role'; Value = 'Microsoft Entra role' },
    @{ Key = 'Azure Active Directory'; Value = 'Microsoft Entra ID' },
    @{ Key = 'Azure Active Directory auth'; Value = 'Microsoft Entra auth' },
    @{ Key = 'Azure Active Directory-only auth'; Value = 'Microsoft Entra-only auth' },
    @{ Key = 'Azure Active Directory object'; Value = 'Microsoft Entra object' },
    @{ Key = 'Azure Active Directory identity'; Value = 'Microsoft Entra identity' },
    @{ Key = 'Azure Active Directory schema'; Value = 'Microsoft Entra schema' },
    @{ Key = 'Azure Active Directory seamless single sign-on'; Value = 'Microsoft Entra seamless single sign-on' },
    @{ Key = 'Azure Active Directory self-service password reset'; Value = 'Microsoft Entra self-service password reset' },
    @{ Key = 'Azure Active Directory SSPR'; Value = 'Microsoft Entra SSPR' },
    @{ Key = 'Azure Active Directory SSPR'; Value = 'Microsoft Entra SSPR' },
    @{ Key = 'Azure Active Directory domain'; Value = 'Microsoft Entra domain' },
    @{ Key = 'Azure Active Directory group'; Value = 'Microsoft Entra group' },
    @{ Key = 'Azure Active Directory login'; Value = 'Microsoft Entra login' },
    @{ Key = 'Azure Active Directory managed'; Value = 'Microsoft Entra managed' },
    @{ Key = 'Azure Active Directory entitlement'; Value = 'Microsoft Entra entitlement' },
    @{ Key = 'Azure Active Directory access review'; Value = 'Microsoft Entra access review' },
    @{ Key = 'Azure Active Directory Identity Protection'; Value = 'Microsoft Entra ID Protection' },
    @{ Key = 'Azure Active Directory pass-through'; Value = 'Microsoft Entra pass-through' },
    @{ Key = 'Azure Active Directory password'; Value = 'Microsoft Entra password' },
    @{ Key = 'Azure Active Directory Privileged Identity Management'; Value = 'Microsoft Entra Privilegd Identity Management' },
    @{ Key = 'Azure Active Directory registered'; Value = 'Microsoft Entra registered' },
    @{ Key = 'Azure Active Directory reporting and monitoring'; Value = 'Microsoft Entra reporting and monitoring' },
    @{ Key = 'Azure Active Directory enterprise app'; Value = 'Microsoft Entra enterprise app' },
    @{ Key = 'Azure Active Directory cloud-only identities'; Value = 'Microsoft Entra cloud-only identities' },
    @{ Key = 'Azure Active Directory Premium P1'; Value = 'Microsoft Entra ID P1' },
    @{ Key = 'Azure Active Directory Premium P2'; Value = 'Microsoft Entra ID P2' },
    @{ Key = 'Azure Active Directory F2'; Value = 'Microsoft Entra ID F2' },
    @{ Key = 'Azure Active Directory Free'; Value = 'Microsoft Entra ID Free' },
    @{ Key = 'Azure Active Directory for education'; Value = 'Microsoft Entra ID for education' },
    @{ Key = 'Azure Active Directory work or school account'; Value = 'Microsoft Entra work or school account' },
    @{ Key = 'federated with Azure Active Directory'; Value = 'federated with Microsoft Entra' },
    @{ Key = 'Hybrid Azure Active Directory Join'; Value = 'Microsoft Entra hybrid join' },
    @{ Key = 'AAD External Identities'; Value = 'Microsoft Entra External ID' },
    @{ Key = 'AAD Identity Governance'; Value = 'Microsoft Entra ID Governance' },
    @{ Key = 'AAD Verifiable Credentials'; Value = 'Microsoft Entra Verified ID' },
    @{ Key = 'AAD Workload Identities'; Value = 'Microsoft Entra Workload ID' },
    @{ Key = 'AAD Domain Services'; Value = 'Microsoft Entra Domain Services' },
    @{ Key = 'AAD access token authentication'; Value = 'Microsoft Entra access token authentication' },
    @{ Key = 'AAD admin center'; Value = 'Microsoft Entra admin center' },
    @{ Key = 'AAD portal'; Value = 'Microsoft Entra portal' },
    @{ Key = 'AAD application proxy'; Value = 'Microsoft Entra application proxy' },
    @{ Key = 'AAD authentication'; Value = 'Microsoft Entra authentication' },
    @{ Key = 'AAD Conditional Access'; Value = 'Microsoft Entra Conditional Access' },
    @{ Key = 'AAD cloud-only identities'; Value = 'Microsoft Entra cloud-only identities' },
    @{ Key = 'AAD Connect'; Value = 'Microsoft Entra Connect' },
    @{ Key = 'AAD Connect Sync'; Value = 'Microsoft Entra Connect Sync' },
    @{ Key = 'AAD domain'; Value = 'Microsoft Entra domain' },
    @{ Key = 'AAD domain'; Value = 'Microsoft Entra domain' },
    @{ Key = 'AAD Domain Services'; Value = 'Microsoft Entra Domain Services' },
    @{ Key = 'AAD Enterprise Applications'; Value = 'Microsoft Entra enterprise applications' },
    @{ Key = 'AAD federation services'; Value = 'Active Directory Federation Services' },
    @{ Key = 'AAD hybrid identities'; Value = 'Microsoft Entra hybrid identities' },
    @{ Key = 'AAD identities'; Value = 'Microsoft Entra identities' },
    @{ Key = 'AAD role'; Value = 'Microsoft Entra role' },
    @{ Key = 'AAD'; Value = 'Microsoft Entra ID' },
    @{ Key = 'AAD auth'; Value = 'Microsoft Entra auth' },
    @{ Key = 'AAD-only auth'; Value = 'Microsoft Entra-only auth' },
    @{ Key = 'AAD object'; Value = 'Microsoft Entra object' },
    @{ Key = 'AAD identity'; Value = 'Microsoft Entra identity' },
    @{ Key = 'AAD schema'; Value = 'Microsoft Entra schema' },
    @{ Key = 'AAD seamless single sign-on'; Value = 'Microsoft Entra seamless single sign-on' },
    @{ Key = 'AAD self-service password reset'; Value = 'Microsoft Entra self-service password reset' },
    @{ Key = 'AAD SSPR'; Value = 'Microsoft Entra SSPR' },
    @{ Key = 'AAD SSPR'; Value = 'Microsoft Entra SSPR' },
    @{ Key = 'AAD domain'; Value = 'Microsoft Entra domain' },
    @{ Key = 'AAD group'; Value = 'Microsoft Entra group' },
    @{ Key = 'AAD login'; Value = 'Microsoft Entra login' },
    @{ Key = 'AAD managed'; Value = 'Microsoft Entra managed' },
    @{ Key = 'AAD entitlement'; Value = 'Microsoft Entra entitlement' },
    @{ Key = 'AAD access review'; Value = 'Microsoft Entra access review' },
    @{ Key = 'AAD Identity Protection'; Value = 'Microsoft Entra ID Protection' },
    @{ Key = 'AAD pass-through'; Value = 'Microsoft Entra pass-through' },
    @{ Key = 'AAD password'; Value = 'Microsoft Entra password' },
    @{ Key = 'AAD Privileged Identity Management'; Value = 'Microsoft Entra Privilegd Identity Management' },
    @{ Key = 'AAD registered'; Value = 'Microsoft Entra registered' },
    @{ Key = 'AAD reporting and monitoring'; Value = 'Microsoft Entra reporting and monitoring' },
    @{ Key = 'AAD enterprise app'; Value = 'Microsoft Entra enterprise app' },
    @{ Key = 'AAD cloud-only identities'; Value = 'Microsoft Entra cloud-only identities' },
    @{ Key = 'AAD Premium P1'; Value = 'Microsoft Entra ID P1' },
    @{ Key = 'AAD Premium P2'; Value = 'Microsoft Entra ID P2' },
    @{ Key = 'AAD F2'; Value = 'Microsoft Entra ID F2' },
    @{ Key = 'AAD Free'; Value = 'Microsoft Entra ID Free' },
    @{ Key = 'AAD for education'; Value = 'Microsoft Entra ID for education' },
    @{ Key = 'AAD work or school account'; Value = 'Microsoft Entra work or school account' },
    @{ Key = 'federated with AAD'; Value = 'federated with Microsoft Entra' },
    @{ Key = 'Hybrid AAD Join'; Value = 'Microsoft Entra hybrid join' }
)

$postTransforms = @(
    @{ Key = 'Microsoft Entra ID B2C'; Value = 'Azure AD B2C' },
    @{ Key = 'Microsoft Entra ID B2B'; Value = 'Microsoft Entra B2B' },
    @{ Key = 'ME-ID B2C'; Value = 'AAD B2C' },
    @{ Key = 'ME-ID B2B'; Value = 'Microsoft Entra B2B' },
    @{ Key = 'ME-IDSTS'; Value = 'AADSTS' },
    @{ Key = 'ME-ID Connect'; Value = 'Microsoft Entra Connect' }
    @{ Key = 'Microsoft Entra ID tenant'; Value = 'Microsoft Entra tenant' }
    @{ Key = 'Microsoft Entra ID organization'; Value = 'Microsoft Entra tenant' }
    @{ Key = 'Microsoft Entra ID account'; Value = 'Microsoft Entra account' }
    @{ Key = 'Microsoft Entra ID resources'; Value = 'Microsoft Entra resources' }
    @{ Key = 'Microsoft Entra ID admin'; Value = 'Microsoft Entra admin' }
    @{ Key = ' an Microsoft Entra'; Value = ' a Microsoft Entra' }
    @{ Key = '>An Microsoft Entra'; Value = '>A Microsoft Entra' }
    @{ Key = ' an ME-ID'; Value = ' a ME-ID' }
    @{ Key = '>An ME-ID'; Value = '>A ME-ID' }
    @{ Key = 'Microsoft Entra ID administration portal'; Value = 'Microsoft Entra administration portal' }
    @{ Key = 'Microsoft Entra ID Advanced Threat'; Value = 'Azure Advanced Threat' }
    @{ Key = 'Entra ID hybrid join'; Value = 'Entra hybrid join' }
    @{ Key = 'Microsoft Entra ID join'; Value = 'Microsoft Entra join' }
    @{ Key = 'ME-ID join'; Value = 'Microsoft Entra join' }
    @{ Key = 'Microsoft Entra ID service principal'; Value = 'Microsoft Entra service principal' }
    @{ Key = 'Download Microsoft Entra Connector'; Value = 'Download connector' }
    @{ Key = 'Microsoft Microsoft'; Value = 'Microsoft' }
)

# Sort the replacements by the length of the keys in descending order
$terminology = $terminology.GetEnumerator() | Sort-Object -Property { $_.Key.Length } -Descending
$postTransforms = $postTransforms.GetEnumerator() | Sort-Object -Property { $_.Key.Length } -Descending

# Get all resx files in the current directory and its subdirectories, ignoring .gitignored files.
Write-Host "Getting all resx files in the current directory and its subdirectories, ignoring .gitignored files."
$gitIgnoreFiles = Get-ChildItem -Path . -Filter .gitignore -Recurse
$targetFiles = Get-ChildItem -Path . -Include *.resx -Recurse

$filteredFiles = @()
foreach ($file in $targetFiles) {
    $ignoreFile = $gitIgnoreFiles | Where-Object { $_.DirectoryName -eq $file.DirectoryName }
    if ($ignoreFile) {
        $excludedPatterns = Get-Content $ignoreFile.FullName | Select-String -Pattern '^(?!#).*' | ForEach-Object { $_.Line }
        if ($excludedPatterns -notcontains $file.Name) {
            $filteredFiles += $file
        }
    }
    else {
        $filteredFiles += $file
    }
}

$scriptPath = $MyInvocation.MyCommand.Path
$filteredFiles = $filteredFiles | Where-Object { $_.FullName -ne $scriptPath }

# This command will get all the files with the extensions .resx in the current directory and its subdirectories, and then filter out those that match the patterns in the .gitignore file. The Resolve-Path cmdlet will find the full path of the .gitignore file, and the Get-Content cmdlet will read its content as a single string. The -notmatch operator will compare the full name of each file with the .gitignore content using regular expressions, and return only those that do not match.
Write-Host "Found $($filteredFiles.Count) files."

function Update-Terminology {
    param (
        [Parameter(Mandatory = $true)]
        [ref]$Content,
        [Parameter(Mandatory = $true)]
        [object[]]$Terminology
    )

    foreach ($item in $Terminology.GetEnumerator()) {
        $old = [regex]::Escape($item.Key)
        $new = $item.Value
        $toReplace = '(?<!(name=\"[^$]{1,100}|https?://aka.ms/[a-z0-9/-]{1,100}))' + $($old)

        # Replace the old terminology with the new one
        $Content.Value = $Content.Value -replace $toReplace, $new
    }
}

# Loop through each file
foreach ($file in $filteredFiles) {
    # Read the content of the file
    $content = Get-Content $file.FullName

    Write-Host "Processing $file"

    Update-Terminology -Content ([ref]$content) -Terminology $terminology
    Update-Terminology -Content ([ref]$content) -Terminology $postTransforms

    $newContent = $content -join "`n"
    if ($newContent -ne (Get-Content $file.FullName -Raw)) {
        Write-Host "Updating $file"
        # Write the updated content back to the file
        Set-Content -Path $file.FullName -Value $newContent
    }
}

```

### Communicate the change to your customers

To help your customers with the transition, it's helpful to add a note: "Azure Active Directory is now Microsoft Entra ID" or follow the new name with "formerly Azure Active Directory" for the first year.

## Next steps

- [Stay up-to-date with what's new in Microsoft Entra ID (formerly Azure AD)](./whats-new.md)
- [Get started using Microsoft Entra ID at the Microsoft Entra admin center](https://entra.microsoft.com/)
- [Learn more about Microsoft Entra ID with content from Microsoft Learn](/entra/)

<!-- docutune:ignore "Azure Active Directory" "Azure AD" "AAD" -->
