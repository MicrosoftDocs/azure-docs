---
title: Migrate your Azure Communication Services Direct Routing to Teams Phone Direct Routing or Operator Connect
description: Learn how to migrate your existing Direct Routing to Teams Phone Direct Routing or Operator Connect
author: henikaraa
manager: dariac
services: azure-communication-services

ms.author: henikaraa
ms.date: 06/22/2026
ms.topic: concept-article
ms.service: azure-communication-services
ms.subservice: pstn
---

# Migrate Azure Communication Services Direct Routing to Teams Phone Direct Routing or Operator Connect

This guide shows how to migrate from Azure Communication Services (ACS) Direct Routing to Microsoft Teams Phone Direct Routing or Operator Connect. It helps you understand the requirements, checks, and manual steps that a successful migration involves. The guidance reflects current restrictions and licensing requirements, and it covers both full migrations and hybrid scenarios in which ACS and Teams coexist.

## Key differences

When you migrate from ACS Direct Routing to Teams Phone Direct Routing or Operator Connect, consider the following key differences:

- **Licensing**: ACS Direct Routing charges usage to an ACS resource. Teams Phone Direct Routing and Operator Connect require each user to have a Teams Phone license, which is included in E5 or available as a standalone add-on. Resource accounts for call queues and auto attendants use the free Microsoft Teams Phone Resource Account license. Verify that you have enough licenses for all the users that you enable on Teams Phone.
- **Administration roles**: You configure ACS Direct Routing in the Azure portal, which requires Azure roles on the Communication Services resource. You configure Teams Phone Direct Routing in the Teams admin center or with PowerShell, which requires Teams admin roles. Make sure that you or your team hold the Teams Administrator, Teams Communications Administrator, or Teams Telephony Administrator role in the Microsoft 365 tenant. You also need Azure Owner or Contributor access on the ACS resource to disable its Direct Routing settings, if needed. For Operator Connect, you set up the operator in the Teams admin center under **Voice** > **Operators**.
- **Session Border Controller (SBC) configuration**: In Direct Routing, a domain name (FQDN) identifies the SBC. You can't use the same SBC FQDN on ACS and Teams at the same time. The Azure portal prevents you from adding an FQDN to ACS if Teams uses it, and the Teams admin center applies the same check. As a result, you must plan how to transition the SBC domain.

## Required roles

A successful migration involves administrators who have access to both Azure and Microsoft 365 or Teams settings:

- **Azure roles**: To change or retrieve settings on the ACS resource, you need either the **Owner** or **Contributor** role on that resource. This role lets you view the configured SBCs and voice routing rules in the Azure portal.
- **Microsoft 365 and Teams roles**: To set up Direct Routing or Operator Connect in Teams, you need an account that has one of the following roles:
  - **Teams Administrator** for full Teams admin privileges.
  - **Teams Communications Administrator** to manage voice and meetings.
  - **Teams Telephony Administrator** if you use segmented admin roles for telephony.
- **SBC administrator**: If a telecom partner or a separate team manages the SBC, coordinate with them so that an SBC administrator is available to update the trunk configurations. They might need to add a trunk for Teams, update certificates, or change Session Initiation Protocol (SIP) forwarding rules. This person also helps you test calls during the migration.

For more information, see [Use Microsoft Teams administrator roles to manage Teams](/microsoftteams/using-admin-roles).

## Plan and audit before you migrate

This phase prepares your environment, sets the foundation for a successful migration, and reduces risk.

### Inventory your current ACS setup

- List all the SBCs that you configure in ACS, including their FQDNs and SIP settings.
- Document the voice routes that you use in ACS.
- Check for custom applications, such as bots or interactive voice response (IVR) systems, that rely on ACS routing.

### Assess the migration scope

- Decide whether you want to do a full cutover or a hybrid coexistence.
- Determine which users, departments, or number ranges migrate first.
- Identify any critical services, such as emergency lines or contact centers, that need special handling.

### Consider your migration scenario

Consider the different scenarios that you might have:

- **ACS Direct Routing to a new Teams Direct Routing deployment**: Identify the required configuration on Teams, and plan for either a full or a gradual migration.
- **ACS Direct Routing to an existing Teams Direct Routing deployment**: Consider your current Teams Direct Routing setup and its capacity, along with the new requirements for your Contact Center as a Service (CCaaS) solution. In some cases, you might also need to expand the SBC capacity.
- **ACS Direct Routing to a new Operator Connect deployment**: When you plan for Operator Connect, consider two variants:
  - The same carrier is also a Teams Operator Connect operator. This option is preferred.
  - You move to a different Operator Connect operator, which requires number porting and interim routing.

### Validate licensing and roles

Confirm that you or your team hold the necessary admin roles, and ensure that all the migrated users have a Teams Phone license (E5 or add-on). To review the available licenses:

1. Sign in to the Microsoft 365 admin center.
1. Go to **Billing** > **Purchase services** > **Add-on subscriptions**.
1. Check your Teams Phone add-on licenses to ensure that you assign them correctly to users. For more information, see [Plan Direct Routing](/microsoftteams/direct-routing-plan).

For Operator Connect, ensure that the users you enable are in Teams Only mode.

### Review regulatory requirements

- Prepare emergency address information for each phone number.
- Check regional restrictions, because some countries or regions have special requirements for Direct Routing.

### Coordinate with stakeholders

- Notify internal teams, such as IT, the helpdesk, and telecom, about the migration timeline.
- Engage external partners, such as SBC vendors, carriers, and Microsoft, early.
- Schedule a maintenance window for the cutover, even if you aim for zero downtime.

## Migrate to Teams Phone Direct Routing

### Set up Teams Direct Routing

Prepare the Teams side while ACS is still running. In the Teams admin center, add your SBC as a new Direct Routing trunk. This trunk acts as the public switched telephone network (PSTN) gateway. Use a new FQDN if you run the two platforms in parallel, or use the same FQDN if you plan to cut over immediately after you remove the SBC from ACS.

> [!NOTE]
> If you move fully to Teams Phone Direct Routing, the deletion of the ACS Direct Routing configuration can take some time to propagate, and you might experience some downtime during the migration.

Configure the PSTN usage and the voice route for the number ranges that this SBC handles in the Teams admin center:

- Go to **Voice** > **Direct Routing** in the Teams admin center. Add a new trunk for your SBC FQDN, and specify settings such as the SIP signaling port (usually 5061), whether you enable media bypass, and an optional comment. For more information, see [Connect your Session Border Controller (SBC)](/microsoftteams/direct-routing-connect-the-sbc).
- Go to **Voice** > **Voice routing policies** and **Voice** > **Dial plans** to define how Teams routes calls to your SBC. Typically, you create a voice route for the phone number patterns that your SBC manages (for example, all +1 425 XXX numbers) and associate it with the trunk. You might also create a voice routing policy and assign it to users, depending on your design. For simple scenarios, adding the route to the global policy might be enough. For more information, see [Configure call routing](/microsoftteams/direct-routing-voice-routing).
- Go to **Voice** > **Phone numbers** to add your Direct Routing numbers. You can upload a comma-separated values (CSV) file, add a full range, or add one or more individual numbers.

Some Direct Routing configurations are available only in PowerShell, or are easier to complete there. For example, you might need the Microsoft Teams PowerShell module to enable certain SBC settings or to configure Direct Routing with cmdlets such as `New-CsOnlinePSTNGateway` (create the SBC as a PSTN gateway), `New-CsOnlineVoiceRoute` (create a voice route), and `Grant-CsOnlineVoiceRoutingPolicy` (assign a voice routing policy). Make sure that you have the latest Microsoft Teams PowerShell module if you need it.

#### Transition the SBC domain

You must plan how to transition the SBC domain:

- For a **full cutover**, remove the SBC configuration from ACS to free the FQDN, and then add it to Teams. We don't recommend this approach because of its potential impact. Proceed only if you must keep the existing FQDN.
- For a **hybrid or coexistence** period, use a different FQDN (alias) for one of the platforms. For example, you might add `sbc2.contoso.com` as an alias on your SBC and use it for the new Teams trunk, while `sbc.contoso.com` stays registered in ACS during the transition. Ensure that your SBC certificate covers both names in the subject alternative name (SAN), or use a separate certificate per FQDN.

### Configure the SBC

- **Signaling FQDNs**: The Microsoft SIP signaling FQDNs for Teams Direct Routing are `sip.pstnhub.microsoft.com`, `sip2.pstnhub.microsoft.com`, and `sip3.pstnhub.microsoft.com`. Your SBC connects to all three for failover. Your SBC already uses these same FQDNs for ACS Direct Routing, so the connection target doesn't change.
- **Certificate**: Ensure that the SBC certificate contains the domain name that you use for Teams Direct Routing. This name is usually the same name that you use for ACS, or an alias if you run the platforms in parallel. Teams requires the SBC to present a public certificate that an accepted certification authority (CA) issues, with the SBC FQDN in the subject alternative name (SAN) or the common name (CN). The same certificate that you use for ACS works if the FQDN doesn't change. If you add a new FQDN for Teams, update the certificate accordingly.
- **Firewall**: Verify that your SBC can reach the Teams cloud endpoints, including SIP signaling to `sip.pstnhub.microsoft.com` on port 5061 and media to the range of addresses that Microsoft uses. If the SBC worked with ACS, you might already have similar firewall rules, but you still need to confirm that you allow all the IP ranges for media traffic. For more information, see [Configure Direct Routing](/microsoftteams/direct-routing-configure).

### Test the pilot setup (optional)

Test calls through the Teams trunk in isolation. If possible, acquire a test phone number, or use an existing noncritical number, on your carrier SIP trunk. Point it to the new Teams Direct Routing path, and assign it to a test user in Teams. Verify that inbound and outbound calling works in Teams through your SBC. This test confirms that the trunk functions correctly, with healthy Transport Layer Security (TLS) connectivity and SIP OPTIONS pings, before you move real users. Also test emergency calling if it applies. Dial an emergency test number, or validate that Teams recognizes the emergency addresses for the test user. To validate your Teams Direct Routing setup, you can monitor the SIP flows while you place the test calls. For more information, see [Monitor Direct Routing with the SIP ladder](/microsoftteams/direct-routing-monitor-sip-ladder).

### Transition production numbers from ACS to Teams

Complete this step during the scheduled low-traffic period:

- **Assign numbers in Teams**: In the Teams admin center, assign the phone numbers to the appropriate users or resource accounts. For service numbers, assign them to the corresponding resource accounts.
- **Set up users**: Enable users for Enterprise Voice and Direct Routing if they aren't already enabled. In PowerShell, this step corresponds to setting `EnterpriseVoiceEnabled` to `True` and assigning a voice routing policy if you use custom policies. For more information, see [Set up Phone System in your organization](/microsoftteams/setting-up-your-phone-system).

After this step, users start to receive calls in Teams instead of in the ACS-based application that they used before.

### Decommission ACS Direct Routing (optional)

In the Azure portal, go to the Direct Routing settings of the ACS resource, and remove the SBC by deleting the trunk configuration, or disable the voice route patterns. This change ensures that ACS no longer expects to handle those calls. This step is especially important if the same SBC FQDN was in use, because removing it frees the domain and prevents accidental conflicts.

## Migrate to Teams Phone Operator Connect

This section applies to organizations that move PSTN connectivity from ACS Direct Routing to Teams Phone Operator Connect.

### When to choose Operator Connect

Operator Connect is an operator-managed PSTN model for Teams. Your operator manages the SBCs and the interconnect, and you manage the numbers and assignments in the Teams admin center. Operator Connect is ideal if you want a simpler, fully managed carrier experience without running SBCs in your tenant. For more information, see [Plan for Operator Connect](/microsoftteams/operator-connect-plan).

### Path A: Migrate to Operator Connect with the same carrier

1. **Enable the operator in the Teams admin center**: Go to **Voice** > **Operators**, select your operator, select **Add as my operator**, and enable the applicable countries or regions. For more information, see [Configure Operator Connect](/microsoftteams/operator-connect-configure).
1. **Order or reserve numbers**: You can request an internal move of your existing direct inward dialing (DID) ranges to the Operator Connect footprint of your operator. Your operator then uploads the numbers to your tenant. For more information, see [Get phone numbers with Operator Connect](/microsoftteams/get-phone-numbers-with-operator-connect).
1. **Assign numbers**: Assign the numbers to resource accounts in the Teams admin center under **Voice** > **Phone numbers**, and verify the emergency addresses for your operator model. For more information, see [Considerations for Operator Connect](/microsoftteams/considerations-operator-connect).
1. **Manage coexistence**: Keep ACS Direct Routing and the SBC in place until the Operator Connect numbers are live. Then remove any Direct Routing voice routing policies from users who are now Operator Connect only.

### Path B: Migrate to Operator Connect with a different operator

1. **Select and enable a certified Operator Connect provider**: In the Teams admin center, go to **Voice** > **Operators** to select an available operator. Validate the coverage and product support before you continue. For more information, see [Configure Operator Connect](/microsoftteams/operator-connect-configure).
1. **Plan the numbering**: Agree on port orders from your current Direct Routing carrier to the new Operator Connect operator. For large ranges, schedule staged ports, and map them to pilot groups. For more information, see [Get phone numbers with Operator Connect](/microsoftteams/get-phone-numbers-with-operator-connect).
1. **Assign numbers**: The Operator Connect operator uploads the ported numbers to your tenant, where they appear under **Voice** > **Phone numbers**. Assign them to resource accounts, and verify the emergency address handling.

> [!NOTE]
> Don't assign Direct Routing voice routes to users who should use Operator Connect only. If you set the global (org-wide default) voice routing policy, you might inadvertently route Operator Connect or Calling Plan users to a Direct Routing trunk. Use custom voice routing policies that target only your Direct Routing users.

## Post-migration checks

### Test calls

Thoroughly test call scenarios with actual users:

- Make inbound PSTN calls to each migrated number. Confirm that they ring the correct Teams user or resource account queue.
- Make outbound calls from Teams. Confirm that they go out through the SBC and show the correct caller ID.
- Test an emergency call if possible. Verify that dialing emergency services works and provides location information where applicable. For more information, see [Manage emergency calling](/microsoftteams/what-are-emergency-locations-addresses-and-call-routing).
- Test voicemail, transfers, and other features to make sure that nothing breaks for users on Teams.

### Monitor health

Monitor the Direct Routing health dashboard in the Teams admin center. Your SBC should appear as **Online**, with active TLS and SIP OPTIONS status. Check the call quality analytics for any anomalies during the initial calls. For more information, see [Use the Direct Routing Health Dashboard to monitor Direct Routing](/microsoftteams/direct-routing-health-dashboard).

### Validate the Operator Connect setup

Run the following validation checks:

- In the Teams admin center, **Voice** > **Operators** shows your operator as enabled, with your enabled countries or regions.
- In the Teams admin center, **Voice** > **Phone numbers** shows numbers with the **Provider** column set to your Operator Connect operator.
- Emergency calling behaves according to your policy and operator model, whether static or dynamic.

## Related content

- [Plan Direct Routing](/microsoftteams/direct-routing-plan)
- [Plan for Operator Connect](/microsoftteams/operator-connect-plan)
- [Configure Direct Routing](/microsoftteams/direct-routing-configure)
