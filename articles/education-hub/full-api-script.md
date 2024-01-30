---
title: How to deploy Azure Education Hub labs through a PowerShell script
description: This article shows you how to deploy labs in Education Hub through a PowerShell script
author: vinnieangel
ms.author: vangellotti
ms.service: azure-education
ms.topic: how-to 
ms.date: 3/13/2023
ms.custom: template-how-to
---

# Run a script to create lab and call other dependent APIs

With Education Hub's public APIs, you can deploy labs through APIs alone. However, there are a few more APIs that need to be called which are shown in the following PowerShell script.

## Prerequisites

- Know billing account ID, Billing profile ID, and Invoice Section ID
- Have an Edu approved Azure account

## Run the script

Run the script and replace the <> with your information

```ps
# Requires -Modules Microsoft.Graph.Identity.SignIns, Microsoft.Graph.Users

# this should be the professors tenantId
$tenantId='<Professor TenantId>'

Connect-AzAccount -TenantId $tenantId
$azContext = Get-AzContext
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$profileClient = New-Object -TypeName Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient -ArgumentList ($azProfile)
$token = $profileClient.AcquireAccessToken($tenantId)
$authHeader = @{
    'Content-Type'='application/json'
    'Authorization'='Bearer ' + $token.AccessToken
}

# Set your billing scope.
$billingScope='/billingAccounts/<BillingAccountId>/billingProfiles/<BillingProfileId>/invoiceSections/<InvoiceSectionId>'

# Create a lab
$labName='<LabName>'
$labExpiresOn='<Expiration Date> Ex. 2023-11-14T22:11:29.422Z'
$createLabUri ='https://management.azure.com/providers/Microsoft.Billing'+$billingScope+'/providers/Microsoft.Education/labs/default?api-version=2021-12-01-preview'
$createLabRequestBody = "{
  `"properties`": {
    `"displayName`": `"$labName`",
    `"budgetPerStudent`": {
      `"currency`": `"USD`",
      `"value`": <Budget>
    },
    `"description`": `"<Description>`",
    `"expirationDate`": `"$labExpiresOn`"
  }
}

$response = Invoke-RestMethod -Uri $createLabUri -Method PUT -Headers $authHeader -Body $createLabRequestBody
ConvertTo-Json $response


# Create a lab user
$studentId=New-Guid
$studentEmail='<StudentEmail>'
$studentFname='<StudentFirstName>'
$studentLName='<StudentLastName>'

# Connect to graph and give the user User.ReadWrite.All permissions if it's not already given
Connect-MgGraph -Scopes User.ReadWrite.All

# Send the invitation, optionally you can check if the user already exists in the tenant using Get-MgUser -Filter "Mail eq '<StudentEmail>'"
New-MgInvitation -InvitedUserDisplayName $studentFname+' '+$studentLName -InvitedUserEmailAddress $studentEmail -InviteRedirectUrl "https://aka.ms/startedu" -SendInvitationMessage:$false


$createLabUserUri ='https://management.azure.com/providers/Microsoft.Billing'+$billingScope+'/providers/Microsoft.Education/labs/default/students/$studentId?api-version=2021-12-01-preview'
$createLabUserRequestBody = "{
  `"properties`": {
    `"firstName`": `"$studentFname`",
    `"lastName`": `"$studentLname`",
    `"email`": `"$studentEmail`",
    `"role`": `"Student`",
    `"budget`": {
      `"currency`": `"USD`",
      `"value`": 100
    },
    `"expirationDate`": `"$labExpiresOn`"
  }
}"

$response = Invoke-RestMethod -Uri $createLabUserUri -Method PUT -Headers $authHeader -Body $createLabUserRequestBody
ConvertTo-Json $response

# send the subscription invite
$subAlias="fddb-5899-abc-127" #should be randomly  generated in the format xxxx-xxxx-xxx-xxx
$subInviteUri='https://management.azure.com/providers/Microsoft.Subscription/aliases/'+$subAlias+'?api-version=2021-01-01-privatepreview'
$displayName=$labName+'_'+$studentFname+'_'+$studentLName
#Format of displayName should be LabName_StudentFname_StudentLname
$createSubInviteRequestBody = "{
  `"properties`": {
    `"displayName`": `"$displayName`", 
    `"workload`": `"Production`",
    `"billingScope`": `"$billingScope`",
    `"additionalProperties`": {
      `"subscriptionTenantId`": `"$tenantId`",
      `"subscriptionOwnerId`": `"$studentEmail`",
    }
  }
}"

$response = Invoke-RestMethod -Uri $subInviteUri -Method PUT -Headers $authHeader -Body $createSubInviteRequestBody
ConvertTo-Json $response
```

## Next steps
- [Manage your Academic Grant using the Overview page](hub-overview-page.md)

- [Support options](educator-service-desk.md)
