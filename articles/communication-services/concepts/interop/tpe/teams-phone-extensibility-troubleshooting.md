---
title: Teams Phone extensibility Troubleshooting
titleSuffix: An Azure Communication Services document
description: This article describes most common issues and ways to troubleshoot them with Teams Phone extensibility.
author: henikaraa
manager: chpalm
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.date: 05/19/2025
ms.topic: conceptual
ms.author: henikaraa
ms.custom: public_preview
services: azure-communication-services
---

# Teams Phone extensibility troubleshooting

[!INCLUDE [public-preview-notice.md](../../../includes/public-preview-include-document.md)]

This article describes how to identify and resolve Teams Phone extensibility issues. Errors can stem from the application, Azure Communication Services SDKs, the user environment, or Microsoft Teams configuration settings.

Whether you're experiencing problems with Call Automation or the Calling SDK, this article provides information to help you diagnose and fix these issues.
 
By understanding the potential sources of errors, you can ensure a smoother and more reliable experience with Teams Phone extensibility.

## Call Automation troubleshooting

For troubleshooting issues related to call automation, see the following resources:
- [Troubleshooting call end response codes](../../../resources/troubleshooting/voice-video-calling/troubleshooting-codes.md?pivots=automation): provides detailed information on troubleshooting call end response codes for Call Automation, including common error codes and their meanings.
- [Known issues](../../voice-video-calling/known-issues-call-automation.md): outlines known issues with call automation, offering insights into current limitations and workarounds.
  
## Calling SDK troubleshooting

For troubleshooting issues related to the Calling SDK, see:
- [Troubleshooting overview](../../../resources/troubleshooting/voice-video-calling/general-troubleshooting-strategies/overview.md): provides an overview of general troubleshooting strategies, helping you identify the root of problems efficiently.
- [Error codes](../../../resources/troubleshooting/voice-video-calling/general-troubleshooting-strategies/understanding-error-codes.md): explains how to understand error codes and subcodes, offering insights into why errors occur and how to mitigate them.
- [Known issues](../../voice-video-calling/known-issues-webjs.md): outlines known issues with the WebJS Calling SDK, including limitations and workarounds.
- [VoIP Call Quality](../../voice-video-calling/troubleshoot-web-voip-quality.md): provides guidance on troubleshooting and improving VoIP call quality.

## Common Teams Phone extensibility issues

### Unable to update CallAutomation SDK to Alpha

1. Download `Azure.Communication.CallAutomation.1.4.0-alpha.20250129.2.nupkg` from [Call Automation Alpha SDKs](https://github.com/Azure/communication-preview/blob/master/Teams%20Phone%20Extensibility/teams-phone-extensibility-quickstart.md#alpha-sdks) in your preferred programming language.
2. Open your solution in Visual Studio and go to the **Tools** menu, select **NuGet Package Manager**, and then select **Package Manager Console**. For reference, see [Manage NuGet packages with the Visual Studio Package Manager Console](/nuget/consume-packages/install-use-packages-powershell#console-controls).
3. Go to the Package Manager Console and execute the following (be sure to update the path):

   ```dotnetcli
   Install-Package C:\path\to\Azure.Communication.CallAutomation.1.4.0-alpha.20250129.2.nupkg
   ```

4. Go back to the **Tools** menu, select **NuGet Package Manager**, and select **Manage NuGet Packages for Solution**. When the NuGet package loads, go to the **Installed** tab and make sure `Azure.Communication.CallAutomation` says that 1.4.0-alpha.20250129.2 is the installed version.

### Consent blocked due to Microsoft Entra App permission

If you receive the following error:

   The app is trying to access a service '1fd5118e-2576-4263-8130-9503064c837a'(Azure Communication Services) that your organization '{GUID}' lacks a service principal for. Contact your IT Admin to review the configuration of your service subscriptions or consent to the application to create the required service principal.

Your Microsoft Entra ID tenant lacks a service principal for the Azure Communication Services application. To fix this issue, use PowerShell as a Microsoft Entra ID administrator to connect to your tenant. Replace Tenant_ID with an ID of your Microsoft Entra ID tenancy.

```dotnetcli
Connect-MgGraph -TenantId "Tenant_ID" -Scopes Application.ReadWrite.All
```
If the command isn't found, start PowerShell as an administrator and install the Microsoft Graph package.

```dotnetcli
Install-Module Microsoft.Graph
```
Then execute the following command to add a service principal to your tenant. Don't modify the GUID of the App ID.

```dotnetcli
New-MgServicePrincipal -AppId "1fd5118e-2576-4263-8130-9503064c837a"
```

### Error 400 code 8523 Invalid request: SourceCallerIdNumber and SourceDisplayName aren't supported

Trying to set caller display name caller ID via CallInvite options return an error:

```rest
   {"error":{"code":"8523","message":"Invalid request, SourceCallerIdNumber and SourceDisplayName are not supported..."}}
```
These parameters aren't currently supported in Teams Phone extensibility. You need to set the second parameter in the `CallInvite` object to `null`:

```csharp
await answerCallContext.CallConnection.AddParticipantAsync(new CallInvite(new PhoneNumberIdentifier("+133333333"),null));
```

### Error 422 Invalid CommunicationUser identifier specified

When your app places an OBO call, the client gets this error if you try to place a call with a phone number. 

Calling OBO feature doesn't support calling from a phone number. In `onBehalfOfOptions` you must set the calling identity as a `MicrosoftTeamsAppIdentifier` type as in the following example:

```csharp
 if (this.elements.onBehalfOfUserInput.value !== null && this.elements.onBehalfOfUserInput.value !== "" ) {
     var onBehalfOfUser = "9da5fbd9-007d-4371-9c55-fe28042aa194"; // The value is the oid GUID of your Resource Account
     if (isMicrosoftTeamsAppIdentifier(onBehalfOfUser)) {
         onBehalfOfOptions = onBehalfOfUser ? { userId: onBehalfOfUser } : undefined;
         if (onBehalfOfOptions) {
             console.log("OBO options provided with app Id: " + (onBehalfOfUser as MicrosoftTeamsAppIdentifier).teamsAppId);
         }
     } else {
         console.error("OBO option ignored, MicrosoftTeamsAppIdentifier type expected");
     }
  }

```

### Error 408 subcode 10057 `addParticipants` failed for participant `8:acs`

The issue appears when adding dual persona agent and getting an `AddParticipantFailed` event error with the following message:

```rest
    "resultInformation": {
      "code": 408,
      "subCode": 10057,
      "message": "addParticipants failed for participant 8:acs:(redacted) Underlying reason: Request Timeout. DiagCode: 408#10057.@"
    }
```

The most common cause is that you're minting a Custom Teams Endpoint (CTE) token and the client is registering with that token with an `8:orgid` MRI as opposed to a dual persona token. This problem is causing the client to not receive the calls since the MRI was `8:orgid` and the server adding a dual persona MRI with `8:acs`.

### Error 403 code `UserLicenseNotPresentForbidden` when agent logs in to client application

The issue appears when agent attempts to sign in to the agent application.

```rest
   {"error":{"code":"UserLicenseNotPresentForbidden","message":"User Login. Teams is disabled in user licenses"}}
```

This issue appears if the agent doesn't have a Teams license assigned or is disabled in Teams. Add the appropriate license and validate if user isn't disabled for Teams access and has all the required [Prerequisites]([https://github.com/Azure/communication-preview/blob/master/Teams%20Phone%20Extensibility/teams-phone-extensibility-access-teams-phone.md#prerequisites](../../../quickstarts/tpe/teams-phone-extensibility-access-teams-phone.md#prerequisites)).

### Error 403 subcode 10105 Connecting Call end reason=NoPermission

The most common root cause of this error is a misconfiguration of the 3P Azure Bot. Follow the steps as defined in this [Teams Phone extensibility](../../../quickstarts/tpe/teams-phone-extensibility-quickstart.md#ccaas-developer-provision-the-appid-application-id), specifically enable the Teams channel.

### Error 400 Bad Requests when adding a Teams Channel in Azure Bot

This issue generally arises if the bot was created with a reserved Microsoft Entra App ID. Delete your bot and recreate it with your Microsoft Entra App ID created or used in [Create Bot](../../../quickstarts/tpe/teams-phone-extensibility-quickstart.md#ccaas-developer-create-the-bot).

### No Incoming Call notification in Call Automation application and a busy signal is heard instead of custom greeting when calling a Teams Service Number

This issue arises when the provisioning of the Resource Account is incomplete or incorrect. Check your [Provisioning Resource Account](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/tpe/teams-phone-extensibility-quickstart#teams-admin-provision-resource-account) and change as needed.

### No Incoming Call notification in Call Automation application and no audio is heard and call disconnects when calling a Teams Service Number

This issue arises when the provisioning of the Resource Account is incomplete or incorrect or failure to grant consent. Check [Provisioning Resource Account](../../../quickstarts/tpe/teams-phone-extensibility-quickstart.md#teams-admin-provision-resource-account) and [Server Consent](../../../quickstarts/tpe/teams-phone-extensibility-access-teams-phone.md#provide-server-consent), making changes as needed.

## Related articles

- [Teams Phone extensibility overview](./teams-phone-extensibility-overview.md)
- [Teams Phone extensibility FAQ](./teams-phone-extensibility-faq.md)
