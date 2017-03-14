---
title: Azure Active Directory B2B collaboration code and PowerShell samples | Microsoft Docs
description: Code and PowerShell samples for Azure Active Directory B2B collaboration
services: active-directory
documentationcenter: ''
author: sasubram
manager: femila
editor: ''
tags: ''

ms.assetid:
ms.service: active-directory
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: identity
ms.date: 02/08/2017
ms.author: sasubram

---


# Azure Active Directory B2B collaboration code and PowerShell samples

## Code Sample
This sample illustrates how to call the invitation API, in "app-only" mode, to get the redemption URL for the resource to which you are inviting the B2B user. The goal is to send a custom invitation email. You'll see how the email can be composed with an HTTP client, so you can customize how it looks and send it through Graph API.

```
namespace SampleInviteApp
{
    using System.Globalization;
    using System;
    using System.Net;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.Graph;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using Newtonsoft.Json;
    class Program
    {
        /// <summary>
        ///  Authentication endpoint to get token.
        /// </summary>
        static readonly string EstsLoginEndpoint = "https://login.microsoftonline.com";
        /// <summary>
        /// Initialize this to Tenant you want to invite users to.
        /// </summary>
        private static readonly string TenantID = "";
        /// <summary>
        /// Client id of the app.
        /// </summary>
        private static readonly string TestAppClientId = "";
        /// <summary>
        /// Client secret of the app.
        /// </summary>
        private static readonly string TestAppClientSecret = @"";
        /// <summary>
        /// Admin user principal name
        /// </summary>
        private static readonly string InviterUserPrincipalName = "";
        static void Main(string[] args)
        {
            CreateInvitation();
        }
        private static void CreateInvitation()
        {
            string accessToken = null;
            string GraphResource = string.Format("", "graph.microsoft.com");
            // Get the token for our app to talk to graph.
            try
            {
                AuthenticationContext testAuthContext = new AuthenticationContext(string.Format("{0}/{1}", EstsLoginEndpoint, TenantID));
                AuthenticationResult testAuthResult = testAuthContext.AcquireToken(
                    GraphResource,
                    new ClientCredential(TestAppClientId, TestAppClientSecret));;
                accessToken = testAuthResult.AccessToken;
            }
            catch (AdalException ex)
            {
                Console.WriteLine("An exception was thrown: {0}.", ex);
                throw;
            }
            // setup http client.
            HttpClient httpClient = new HttpClient();
            httpClient.Timeout = TimeSpan.FromSeconds(300);
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            httpClient.DefaultRequestHeaders.Add("client-request-id", Guid.NewGuid().ToString());
            Console.WriteLine("CorrelationID for the request: {0}", httpClient.DefaultRequestHeaders.GetValues("client-request-id").Single());
            var inviteEndPoint = string.Format("https://graph.microsoft.com/beta/invitations");
            // Set the invitation object.
            Invitation invitation = new Invitation();
            invitation.InvitedUserDisplayName = "displayName";
            invitation.InvitedUserEmailAddress = "Give the invitee email";
            invitation.InviteRedirectUrl = "https://www.microsoft.com";
            invitation.SendInvitationMessage = false;
            // Make the invite call. Your app needs to have User.ReadWrite.All or Directory.ReadWrite.All scope to invite
            HttpContent content = new StringContent(JsonConvert.SerializeObject(invitation));
            content.Headers.Add("ContentType", "application/json");
            var postResponse = httpClient.PostAsync(inviteEndPoint, content).Result;
            string serverResponse = postResponse.Content.ReadAsStringAsync().Result;
            Console.WriteLine(serverResponse);
            // Build the mail message. Here we are including the server response from inviation request, but you can customize it.
            // To send the email you need Mail.Send scope.
            var emailEndPoint = string.Format("https://graph.microsoft.com/beta/users/{0}/sendMail", InviterUserPrincipalName);
            Email mail = new Email();
            mail.message = new Message();
            mail.message.Subject = "Inviation Email";
            mail.message.Body = new ItemBody();
            mail.message.Body.Content = serverResponse;
            Recipient recipient = new Recipient();
            recipient.EmailAddress = new EmailAddress();
            recipient.EmailAddress.Address = invitation.InvitedUserEmailAddress;
            mail.recipients = new List<Recipient>();
            mail.recipients.Add(recipient);
            // Make the call to send email.
            content = new StringContent(JsonConvert.SerializeObject(mail));
            Console.WriteLine(content);
            content.Headers.Add("ContentType", "application/json");
            postResponse = httpClient.PostAsync(emailEndPoint, content).Result;
            serverResponse = postResponse.Content.ReadAsStringAsync().Result;
            Console.WriteLine(serverResponse);
        }
        /// <summary>
        /// Invitation class.
        /// </summary>
        public class Invitation
        {
            /// <summary>
            /// Gets or sets display name.
            /// </summary>
            public string InvitedUserDisplayName { get; set; }
            /// <summary>
            /// Gets or sets display name.
            /// </summary>
            public string InvitedUserEmailAddress { get; set; }
            /// <summary>
            /// Gets or sets a value indicating whether Invitation Manager should send the email to InvitedUser.
            /// </summary>
            public bool SendInvitationMessage { get; set; }
            /// <summary>
            /// Gets or sets invitation redirect URL
            /// </summary>
            public string InviteRedirectUrl { get; set; }
        }
        /// <summary>
        /// The email message.
        /// </summary>
        public class Email
        {
            public Message message;
            public List<Recipient> recipients;
        }
    }
}
```

## PowerShell example
The following example will walk you through how you can bulk invite external users to an organization from email addresses that you may have stored in a .CSV file.

1. Prepare the .CSV file
  Create a new CSV file and name it invitations.csv. In this example, the file is saved in C:\data. Your CSV file could look like the following:

  ```
    InvitedUserEmailAddress
    user1@contoso.com
    user2@outlook.com
    user3@gmail.com
    user4@yahoo.com
    ```

2. Get the latest Azure AD PowerShell
  To use the new cmdlets, you must install the updated Azure AD PowerShell module, which you can download from [the Powershell module's release page](https://www.powershellgallery.com/packages/AzureADPreview).

3. Sign in to your tenancy

    ```
    Connect-AzureAd and login
    ```

4. Run the PowerShell cmdlt

    ```
    $Invitations = import-csv C:\data\invitations.csv
    foreach ($email in $invitations) {New-AzureADMSInvitation -InvitedUserEmailAddress $email.InvitedUserEmailAddress -InviteRedirectUrl http://microsoft.com -SendInvitationMessage $true}
  ```

This will send an invitation to the email address in invitations.csv. Additional features of this cmdlet include customized text in the email message, include a display name for the invited user, sending messages to CCs or suppressing email messages altogether.

## Next steps

Browse our other articles on Azure AD B2B collaboration:

* [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
* [B2B collaboration user properties](active-directory-b2b-user-properties.md)
* [Adding a B2B collaboration user to a role](active-directory-b2b-add-guest-to-role.md)
* [Delegate B2B collaboration invitations](active-directory-b2b-delegate-invitations.md)
* [Dynamic groups and B2B collaboration](active-directory-b2b-dynamic-groups.md)
* [Configure SaaS apps for B2B collaboration](active-directory-b2b-configure-saas-apps.md)
* [B2B collaboration user tokens](active-directory-b2b-user-token.md)
* [B2B collaboration user claims mapping](active-directory-b2b-claims-mapping.md)
* [Office 365 external sharing](active-directory-b2b-o365-external-user.md)
* [B2B collaboration current limitations](active-directory-b2b-current-limitations.md)
