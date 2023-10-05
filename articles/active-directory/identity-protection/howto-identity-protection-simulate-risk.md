---
title: Simulating risk detections in Microsoft Entra ID Protection
description: Learn how to simulate risk detections in Identity Protection

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 08/22/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: chuqiaoshi

ms.collection: M365-identity-device-management
---
# Simulating risk detections in Identity Protection

Administrators may want to simulate risk in their environment in order to accomplish the following items:

- Populate data in the Identity Protection environment by simulating risk detections and vulnerabilities.
- Set up risk-based Conditional Access policies and test the impact of these policies.

This article provides you with steps for simulating the following risk detection types:

- Anonymous IP address (easy)
- Unfamiliar sign-in properties (moderate)
- Atypical travel (difficult)
- Leaked credentials in GitHub for workload identities (moderate)

Other risk detections can't be simulated in a secure manner.

More information about each risk detection can be found in the article, What is risk for [user](concept-identity-protection-risks.md) and [workload identity](concept-workload-identity-risk.md).

## Anonymous IP address

Completing the following procedure requires you to use:

- The [Tor Browser](https://www.torproject.org/projects/torbrowser.html.en) to simulate anonymous IP addresses. You might need to use a virtual machine if your organization restricts using the Tor browser.
- A test account that isn't yet registered for Microsoft Entra multifactor authentication.

**To simulate a sign-in from an anonymous IP, perform the following steps**:

1. Using the [Tor Browser](https://www.torproject.org/projects/torbrowser.html.en), navigate to [https://myapps.microsoft.com](https://myapps.microsoft.com).   
2. Enter the credentials of the account you want to appear in the **Sign-ins from anonymous IP addresses** report.

The sign-in shows up on the Identity Protection dashboard within 10 - 15 minutes. 

## Unfamiliar sign-in properties

To simulate unfamiliar locations, you have to sign in from a location and device your test account hasn't signed in from before.

The procedure below uses a newly created:

- VPN connection, to simulate new location.
- Virtual machine, to simulate a new device.

Completing the following procedure requires you to use a user account that has:

- At least a 30-day sign-in history.
- Microsoft Entra multifactor authentication enabled.

**To simulate a sign-in from an unfamiliar location, perform the following steps**:

1. Using your new VPN, navigate to [https://myapps.microsoft.com](https://myapps.microsoft.com) and enter the credentials of your test account.
2. When signing in with your test account, fail the multifactor authentication challenge by not passing the MFA challenge.

The sign-in shows up on the Identity Protection dashboard within 10 - 15 minutes.

## Atypical travel

Simulating the atypical travel condition is difficult because the algorithm uses machine learning to weed out false-positives such as atypical travel from familiar devices, or sign-ins from VPNs that are used by other users in the directory. Additionally, the algorithm requires a sign-in history of 14 days or 10 logins of the user before it begins generating risk detections. Because of the complex machine learning models and above rules, there's a chance that the following steps won't lead to a risk detection. You might want to replicate these steps for multiple Microsoft Entra accounts to simulate this detection.

**To simulate an atypical travel risk detection, perform the following steps**:

1. Using your standard browser, navigate to [https://myapps.microsoft.com](https://myapps.microsoft.com).  
1. Enter the credentials of the account you want to generate an atypical travel risk detection for.
1. Change your user agent. You can change user agent in Microsoft Edge from Developer Tools (F12).
1. Change your IP address. You can change your IP address by using a VPN, a Tor add-on, or creating a new virtual machine in Azure in a different data center.
1. Sign-in to [https://myapps.microsoft.com](https://myapps.microsoft.com) using the same credentials as before and within a few minutes after the previous sign-in.

The sign-in shows up in the Identity Protection dashboard within 2-4 hours.

## Leaked Credentials for Workload Identities

This risk detection indicates that the application's valid credentials have been leaked. This leak can occur when someone checks in the credentials in a public code artifact on GitHub. Therefore, to simulate this detection, you need a GitHub account and can [sign up a GitHub account](https://docs.github.com/get-started/signing-up-for-github) if you don't have one already.

### Simulate Leaked Credentials in GitHub for Workload Identities

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Security Administrator](../roles/permissions-reference.md#security-administrator).
1. Browse to **Identity** > **Applications** > **App registrations**.
1. Select **New registration** to register a new application or reuse an existing stale application.
1. Select **Certificates & Secrets** > **New client Secret** , add a description of your client secret and set an expiration for the secret or specify a custom lifetime and select **Add**. Record the secret's value for later use for your GitHub Commit.

   > [!Note]
   > **You can not retrieve the secret again after you leave this page**.
   
1. Get the TenantID and Application(Client)ID in the **Overview** page.
1. Ensure you disable the application via **Identity** > **Applications** > **Enterprise Application** > **Properties** > Set **Enabled for users to sign-in** to **No**.
1. Create a **public** GitHub Repository, add the following config and commit the change as a file with the .txt extension.
   ```GitHub file
     "AadClientId": "XXXX-2dd4-4645-98c2-960cf76a4357",
     "AadSecret": "p3n7Q~XXXX",
     "AadTenantDomain": "XXXX.onmicrosoft.com",
     "AadTenantId": "99d4947b-XXX-XXXX-9ace-abceab54bcd4",
   ```
1. In about 8 hours, you'll be able to view a leaked credential detection under **Protection** > **Identity Protection** > **Risk Detection** > **Workload identity detections** where the additional info will contain the URL of your GitHub commit.

## Testing risk policies

This section provides you with steps for testing the user and the sign-in risk policies created in the article, [How To: Configure and enable risk policies](howto-identity-protection-configure-risk-policies.md).

### User risk policy

To test a user risk security policy, perform the following steps:

1. Configure a [user risk policy](howto-identity-protection-configure-risk-policies.md#user-risk-policy-in-conditional-access) targeting the users you plan to test with.
1. Elevate the user risk of a test account by, for example, simulating one of the risk detections a few times.
1. Wait a few minutes, and then verify that risk has elevated for your user. If not, simulate more risk detections for the user.
1. Return to your risk policy and set **Enforce Policy** to **On** and **Save** your policy change.
1. You can now test user risk-based Conditional Access by signing in using a user with an elevated risk level.

### Sign-in risk security policy

To test a sign-in risk policy, perform the following steps:

1. Configure a [sign-in risk policy](howto-identity-protection-configure-risk-policies.md#sign-in-risk-policy-in-conditional-access) targeting the users you plan to test with.
1. You can now test Sign-in Risk-based Conditional Access by signing in using a risky session (for example, by using the Tor browser). 

## Next steps

- [What is risk?](concept-identity-protection-risks.md)

- [Securing workload identities with Identity](concept-workload-identity-risk.md)

- [How To: Configure and enable risk policies](howto-identity-protection-configure-risk-policies.md)

- [Microsoft Entra ID Protection](overview-identity-protection.md)
