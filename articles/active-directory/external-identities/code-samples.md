---
title: B2B collaboration code and PowerShell samples
description: Code and PowerShell samples for Microsoft Entra B2B collaboration

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: sample
ms.date: 04/06/2023

ms.author: mimart
author: msmimart
manager: celestedg
ms.custom: it-pro, seo-update-azuread-jan, has-adal-ref, devx-track-linux, has-azure-ad-ps-ref
ms.collection: engagement-fy23, M365-identity-device-management
# Customer intent: As a tenant administrator, I want to bulk-invite external users to an organization from email addresses that I've stored in a .csv file.
---

# Microsoft Entra B2B collaboration code and PowerShell samples

## PowerShell example

You can bulk-invite external users to an organization from email addresses that you've stored in a .csv file.

1. Prepare the .csv file
   Create a new .csv file and name it invitations.csv. In this example, the file is saved in C:\data, and contains the following information:

   Name                  |  InvitedUserEmailAddress
   --------------------- | --------------------------
   Gmail B2B Invitee     | b2binvitee@gmail.com
   Outlook B2B invitee   | b2binvitee@outlook.com


2. Get the latest Azure AD PowerShell
   To use the new cmdlets, you must install the updated Azure AD PowerShell module, which you can download from [the PowerShell module's release page](https://www.powershellgallery.com/packages/AzureADPreview)

3. Sign in to your tenancy

    ```azurepowershell-interactive
    $cred = Get-Credential
    Connect-AzureAD -Credential $cred
    ```

4. Run the PowerShell cmdlet

   ```azurepowershell-interactive
   $invitations = import-csv C:\data\invitations.csv
   $messageInfo = New-Object Microsoft.Open.MSGraph.Model.InvitedUserMessageInfo
   $messageInfo.customizedMessageBody = "Hey there! Check this out. I created an invitation through PowerShell"
   foreach ($email in $invitations) {New-AzureADMSInvitation -InvitedUserEmailAddress $email.InvitedUserEmailAddress -InvitedUserDisplayName $email.Name -InviteRedirectUrl https://wingtiptoysonline-dev-ed.my.salesforce.com -InvitedUserMessageInfo $messageInfo -SendInvitationMessage $true}
   ```

This cmdlet sends an invitation to the email addresses in invitations.csv. More features of this cmdlet include:

- Customized text in the email message
- Including a display name for the invited user
- Sending messages to CCs or suppressing email messages altogether

## Code sample

The code sample illustrates how to call the invitation API and get the redemption URL. Use the redemption URL to send a custom invitation email. You can compose the email with an HTTP client, so you can customize how it looks and send it through the Microsoft Graph API.


# [HTTP](#tab/http)

```http
POST https://graph.microsoft.com/v1.0/invitations
Content-type: application/json
{
  "invitedUserEmailAddress": "david@fabrikam.com",
  "invitedUserDisplayName": "David",
  "inviteRedirectUrl": "https://myapp.contoso.com",
  "sendInvitationMessage": true
}
```

# [C#](#tab/csharp)

```csharp
using System;
using System.Threading.Tasks;
using Microsoft.Graph;
using Azure.Identity;

namespace SampleInviteApp
{
    class Program
    {
        /// <summary>
        /// This is the tenant ID of the tenant you want to invite users to.
        /// </summary>
        private static readonly string TenantID = "";

        /// <summary>
        /// This is the application id of the application that is registered in the above tenant.
        /// </summary>
        private static readonly string TestAppClientId = "";

        /// <summary>
        /// Client secret of the application.
        /// </summary>
        private static readonly string TestAppClientSecret = @"";

        /// <summary>
        /// This is the email address of the user you want to invite.
        /// </summary>
        private static readonly string InvitedUserEmailAddress = @"";

        /// <summary>
        /// This is the display name of the user you want to invite.
        /// </summary>
        private static readonly string InvitedUserDisplayName = @"";

        /// <summary>
        /// Main method.
        /// </summary>
        /// <param name="args">Optional arguments</param>
        static async Task Main(string[] args)
        {
            string InviteRedeemUrl = await SendInvitation();
        }

        /// <summary>
        /// Send the guest user invite request.
        /// </summary>
        private static async string SendInvitation()
        {
            /// Get the access token for our application to talk to Microsoft Graph.
            var scopes = new[] { "https://graph.microsoft.com/.default" };
            var clientSecretCredential = new ClientSecretCredential(TenantID, TestAppClientId, TestAppClientSecret);
            var graphClient = new GraphServiceClient(clientSecretCredential, scopes);

            // Create the invitation object.
            var invitation = new Invitation
            {
                InvitedUserEmailAddress = InvitedUserEmailAddress,
                InvitedUserDisplayName = InvitedUserDisplayName,
                InviteRedirectUrl = "https://www.microsoft.com",
                SendInvitationMessage = true
            };

            // Send the invitation 
            var GraphResponse = await graphClient.Invitations
                .Request()
                .AddAsync(invitation);

            // Return the invite redeem URL
            return GraphResponse.InviteRedeemUrl;
        }
    }
}
```

# [JavaScript](#tab/javascript)

Install the following npm packages:

```bash
npm install express
npm install isomorphic-fetch
npm install @azure/identity
npm install @microsoft/microsoft-graph-client
```

```javascript
const express = require('express')
const app = express()

const { Client } = require("@microsoft/microsoft-graph-client");
const { TokenCredentialAuthenticationProvider } = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const { ClientSecretCredential } = require("@azure/identity");
require("isomorphic-fetch");

// This is the application id of the application that is registered in the above tenant.
const CLIENT_ID = ""

// Client secret of the application.
const CLIENT_SECRET = ""

// This is the tenant ID of the tenant you want to invite users to. For example fabrikam.onmicrosoft.com
const TENANT_ID = ""

async function sendInvite() {

  // Initialize a confidential client application. For more info, visit: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/samples/AzureIdentityExamples.md#authenticating-a-service-principal-with-a-client-secret
  const credential = new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET);

  // Initialize the Microsoft Graph authentication provider. For more info, visit: https://learn.microsoft.com/graph/sdks/choose-authentication-providers?tabs=Javascript#using--for-server-side-applications
  const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: ['https://graph.microsoft.com/.default'] });

  // Create MS Graph client instance. For more info, visit: https://github.com/microsoftgraph/msgraph-sdk-javascript/blob/dev/docs/CreatingClientInstance.md
  const client = Client.initWithMiddleware({
    debugLogging: true,
    authProvider,
  });

  // Create invitation object
  const invitation = {
    invitedUserEmailAddress: 'david@fabrikam.com',
    invitedUserDisplayName: 'David',
    inviteRedirectUrl: 'https://www.microsoft.com',
    sendInvitationMessage: true
  };
  
  // Execute the MS Graph command. For more information, visit: https://learn.microsoft.com/graph/api/invitation-post
  graphResponse = await client.api('/invitations')
    .post(invitation);
  
  // Return the invite redeem URL
  return graphResponse.inviteRedeemUrl
}

const inviteRedeemUrl = await sendInvite();

```

---

## Next steps

- [Samples for guest user self-service sign-up](code-samples-self-service-sign-up.md)
