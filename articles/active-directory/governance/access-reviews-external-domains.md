---
title: Review and clean up collaboration partners from external organizations using Azure Active Directory Access Reviews| 
description: Use Access Reviews to extend of remove access from members of partner organizations
services: active-directory
documentationcenter: ''
author: barclayn
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 07/30/2020
ms.author: barclayn
---

# Use Access Reviews to review and clean up collaboration partners from external organizations

This article describes features and methods that allow you to identify external identities so that you can review them and remove them from Azure AD if they are no longer needed.

The cloud makes it easier than ever to collaborate with internal  or external users. Embracing Office 365, organizations start to see the proliferation of external identities (“Guests”), as users work together on data, documents or digital workspaces such as Teams. Organizations have to balance enabling collaboration and meeting security and governance requirements. Part of these efforts should include evaluating and cleaning out external partners and identities from resources and the Azure AD tenant when they are no longer needed.

>[!NOTE]
>A valid Azure AD Premium P2, Enterprise Mobility + Security E5 paid, or trial license is required to use Azure AD access reviews. For more information, see [Azure Active Directory editions](../fundamentals/active-directory-whatis.md).

## Why should you review partners from external organizations that collaborate with you in your tenant?

In most organizations, the process of inviting business partners and vendors for collaboration is initiated by end users. The need to collaborate forces organizations to provide resource owners and end users with a way to regularly evaluate and attest external users. Often the onboarding of new collaboration partners is planned and accounted for but the removal of users is neglected.
Also, identity life-cycle management drives enterprises to keep Azure AD clean, and remove users who no longer need access to the organization’s resources. Keeping only the relevant identity references for partners and vendors in the directory helps reduce the risk of your users inadvertently selecting and granting access to partner identities that should have been removed.

## Use PowerShell to find partners from a domain

```PowerShell
# this appears to be incomplete no? should it not be $users = get-aduser... etc? assuming we do that if we just print $users.count we get the number of users that meet the search criteria. Maybe export-csv? 
Get-AzureADUser -Filter "usertype eq 'Guest'" -All $true | ?{ $_.mail -like
"@microsoft.com" }

$users.Count
```

The Azure AD Governance team has published a sample script in GitHub to help manage external identities. The script allows you to search, categorize, and build a simple inventory of external identities used in Azure AD. You can find the script here: (Where?)

## Create a dynamic group that has external partners as members

You can use Azure AD dynamic groups to build groups that structure external identities based on their home domain. The dynamic group will be kept up to date and automatically add any new partners and vendors from the same domain. These groups can later be managed using Access Reviews. Alternatively, you may also run a script that performs actions on members of these groups.

You can create a new dynamic group in Azure AD for external identities using the following steps:

1. Open the Azure AD Portal.
2. Select **Azure Active Directory**.
3. Select **Groups**.
4. Select **+ New Group** in the top menu.
5. In the **New Group** blade, select **Security** as the Group Type.
6. Specify a group name,
7. Select **Security** and Membership type of **Dynamic User**.
8. In **Owners**, choose the rightful owner for this dynamic group. The person you specify as the owner should be someone who owns the business relationship with the partner company.
9. Click **Add dynamic query**.
10. In **Dynamic membership rules**, use the following query to scope the group to contain all external identities in your tenant from the “microsoft.com” domain. Click the **Edit** link on the Rule syntax box to enter the following filter:

    ```
      (user.userPrincipalName -contains "#EXT#") and (user.mail -contains "@microsoft.com") and (user.accountEnabled -eq true)
    ```
11. Click Save. Click Create.

>[!NOTE]
> The filter is looking for external identities invited through Azure AD or Office 365 who are still enabled and working in your tenant. The filter used in our example is looking for external identities invited through Azure AD or Office 365 who are still enabled and working in your tenant.

![Dynamic membership rules](media\access-reviews-external-domains\dynamic-membership-rules.png)

### Example: Access Review external partners from a specific domain

1. Navigate to the Azure Active Directory admin center and navigate to **Azure Active Directory”>“Identity Governance”>“Access Reviews**
2. Select **+ New Access Review** from the top menu. In the “Create an access review” setup page, you define the settings of a new Access Review. For this scenario, asking a Teams team owner to review the membership list every three months. Upon  declining members, the system will remove users at the end of each review cycle.
3. Provide a **Review name**, a **Start date** for the review cycle.
4. Select **Quarterly** in the “Frequency” drop-down list.
5. Select **Never** for the setting to **End** the Access Review cycles.
6. In the **Users** section of the setup page, select **Members of a group** for **Users to review** and select **Guest users only**, so that reviewers get a chance to review all external users from the dynamic group.
7. In **Group**, select the dynamic group that you created earlier, containing all external partners from a specific domain.
8. Under **Reviewers**, select one of the following options:
      - **Group owners** – if you have assigned an owner to the dynamic group, and that owner is the person who manages the relationship with the external partner.
      - **Selected users** – if you want to specify specific users in your organization that should review the partners from that external company.
      - **Members (self)** – if you want to allow all external partners to self-attest whether they need continued access to your company’s resources.
9. In **Upon completion settings**, specify that you do not want to take any actions once the review completes. Choosing this option allows you to review the results and take manual actions.
10. Click **Start** to create the Access Review. The review will automatically start at the specified start date – and notify reviewers.

![Create an access review](media\access-reviews-external-domains\create-access-review.png)

Once the review finishes, the **Results** page will include an overview of the decisions made by every reviewer on every external partner and whether these external partners should have continued access. External partners that are no longer needed, as attested by the reviewers, can be removed through the Azure AD Portal or a PowerShell script.

## Example: PowerShell: Disable and delete external partners from the results CSV file, following an Access Review

Administrators or resource owners can take action on the results of an Access Review. The result of all access reviews is available both in the access reviews section of the Azure AD Portal, and as a download. All results are kept as comma-separated value (CSV) files. These files can be used for manual processing and reporting or programmatic action through PowerShell.

The results in a CSV format are available on an access review, in the **Results** menu. Using **Download**, the browser will download the CSV file.

The following script parses the results:

```powershell

$csv = Import-CSV "C:\Users\johndoe\Downloads\data.csv" #the CSV downloaded from Azure AD Portal

$deniedUsers = @()

$allowedUsers = @()

#Read the CSV file. For every line, do...

$csv | foreach {

# Read three columns/values for every line and save them:

$user = $_.UserID

$user_displayName = $_."User Display Name"

$result = $_.Outcome

# Depending on the result, put the user in one of two arrays (approved/denied):

switch($result) {

'Approve' { $allowedUsers += $user}

'Deny' { $deniedUsers += $user }

default { Write-Host "Unexpected result, $($result)"}

}

}

foreach($u in $deniedUsers)

{

Write-Host "Remove-AzureADGroupMember -ObjectID <objectID of reviewed group>
-MemberId $u"

}
```

## Example: PowerShell: Disable and delete external partners using Graph, following an Access Review

## Example: Disable and delete external partners from a specific domain using Access Reviews
