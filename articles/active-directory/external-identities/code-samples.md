---
title: B2B collaboration code and PowerShell samples - Azure AD
description: Code and PowerShell samples for Azure Active Directory B2B collaboration

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: sample
ms.date: 04/11/2017

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: elisolMS
ms.custom: it-pro, seo-update-azuread-jan, has-adal-ref
ms.collection: M365-identity-device-management
---

# Azure Active Directory B2B collaboration code and PowerShell samples

## PowerShell example
You can bulk-invite external users to an organization from email addresses that you have stored in a .CSV file.

1. Prepare the .CSV file
   Create a new CSV file and name it invitations.csv. In this example, the file is saved in C:\data, and contains the following information:

   Name                  |  InvitedUserEmailAddress
   --------------------- | --------------------------
   Gmail B2B Invitee     | b2binvitee@gmail.com
   Outlook B2B invitee   | b2binvitee@outlook.com


2. Get the latest Azure AD PowerShell
   To use the new cmdlets, you must install the updated Azure AD PowerShell module, which you can download from [the PowerShell module's release page](https://www.powershellgallery.com/packages/AzureAD)

3. Sign in to your tenancy

    ```powershell
    $cred = Get-Credential
    Connect-AzureAD -Credential $cred
    ```

4. Run the PowerShell cmdlet

   ```powershell
   $invitations = import-csv C:\data\invitations.csv
   $messageInfo = New-Object Microsoft.Open.MSGraph.Model.InvitedUserMessageInfo
   $messageInfo.customizedMessageBody = "Hey there! Check this out. I created an invitation through PowerShell"
   foreach ($email in $invitations) {New-AzureADMSInvitation -InvitedUserEmailAddress $email.InvitedUserEmailAddress -InvitedUserDisplayName $email.Name -InviteRedirectUrl https://wingtiptoysonline-dev-ed.my.salesforce.com -InvitedUserMessageInfo $messageInfo -SendInvitationMessage $true}
   ```

This cmdlet sends an invitation to the email addresses in invitations.csv. Additional features of this cmdlet include:
- Customized text in the email message
- Including a display name for the invited user
- Sending messages to CCs or suppressing email messages altogether

## Code sample
Here we illustrate how to call the invitation API, in "app-only" mode, to get the redemption URL for the resource to which you are inviting the B2B user. The goal is to send a custom invitation email. The email can be composed with an HTTP client, so you can customize how it looks and send it through the Microsoft Graph API.

```csharp
namespace SampleInviteApp
{
    using System;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text.Json;
    using Microsoft.Identity.Client;
    class Program
    {
        /// <summary>
        /// Microsoft Graph scope.
        /// </summary>
        static readonly string[] GraphScope = { "https://graph.microsoft.com/.default" };

        /// <summary>
        /// Microsoft Graph invite endpoint.
        /// </summary>
        static readonly string InviteEndPoint = "https://graph.microsoft.com/v1.0/invitations";

        /// <summary>
        /// This is the tenantid of the tenant you want to invite users to.
        /// </summary>
        private static readonly string TenantID = "";

        /// <summary>
        /// This is the application id of the application that is registered in the above tenant.
        /// The required scopes are available in the below link.
        /// https://docs.microsoft.com/graph/api/invitation-post?view=graph-rest-1.0&tabs=http#permissions
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
            Invitation invitation = CreateInvitation();
            await SendInvitation(invitation);
        }

        /// <summary>
        /// Create the invitation object.
        /// </summary>
        /// <returns>Returns the invitation object.</returns>
        private static Invitation CreateInvitation()
        {
            // Set the invitation object.
            Invitation invitation = new Invitation
            {
                InvitedUserDisplayName = InvitedUserDisplayName,
                InvitedUserEmailAddress = InvitedUserEmailAddress,
                InviteRedirectUrl = "https://www.microsoft.com",
                SendInvitationMessage = true
            };
            return invitation;
        }

        /// <summary>
        /// Send the guest user invite request.
        /// </summary>
        /// <param name="invitation">Invitation object.</param>
        /// <returns>An awaitable task</returns>
        private static async Task SendInvitation(Invitation invitation)
        {
            string accessToken = await GetAccessToken();

            HttpClient httpClient = GetHttpClient(accessToken);

            // Make the invite call.
            HttpContent content = new StringContent(JsonSerializer.Serialize(invitation));
            content.Headers.Add("ContentType", "application/json");
            var postResponse = await httpClient.PostAsync(InviteEndPoint, content);
            string serverResponse = await postResponse.Content.ReadAsStringAsync();
            Console.WriteLine(serverResponse);
        }

        /// <summary>
        /// Get the HTTP client.
        /// </summary>
        /// <param name="accessToken">Access token</param>
        /// <returns>Returns the Http Client.</returns>
        private static HttpClient GetHttpClient(string accessToken)
        {
            // setup http client.
            HttpClient httpClient = new HttpClient();
            httpClient.Timeout = TimeSpan.FromSeconds(300);
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            httpClient.DefaultRequestHeaders.Add("client-request-id", Guid.NewGuid().ToString());
            Console.WriteLine(
                $"CorrelationID for the request: {httpClient.DefaultRequestHeaders.GetValues("client-request-id").Single()}"
                );
            return httpClient;
        }

        /// <summary>
        /// Get the access token for our application to talk to Microsoft Graph.
        /// </summary>
        /// <returns>Returns the access token for our application to talk to Microsoft Graph.</returns>
        private static async Task<string> GetAccessToken()
        {
            // Get the access token for our application to talk to Microsoft Graph.
            try
            {
                var testCCA = ConfidentialClientApplicationBuilder.Create(TestAppClientId)
                    .WithClientSecret(TestAppClientSecret)
                    .WithTenantId(TenantID)
                    .Build();
                AuthenticationResult testAuthResult = await testCCA.AcquireTokenForClient(GraphScope).ExecuteAsync();
                return testAuthResult.AccessToken;
            }
            catch (MsalException ex)
            {
                Console.WriteLine($"An exception was thrown while fetching the token: {ex}.");
                throw;
            }
        }

        /// <summary>
        /// Invitation class.
        /// </summary>
        public class Invitation
        {
            /// <summary>
            /// Gets or sets display name.
            /// </summary>
            public string? InvitedUserDisplayName { get; set; }

            /// <summary>
            /// Gets or sets display name.
            /// </summary>
            public string? InvitedUserEmailAddress { get; set; }

            /// <summary>
            /// Gets or sets a value indicating whether Invitation Manager should send the email to InvitedUser.
            /// </summary>
            public bool SendInvitationMessage { get; set; }

            /// <summary>
            /// Gets or sets invitation redirect URL
            /// </summary>
            public string? InviteRedirectUrl { get; set; }
        }
    }
}
```


## Next steps

- [What is Azure AD B2B collaboration?](what-is-b2b.md)
