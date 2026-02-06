---
title: Exchange Online Integration for Email-Outbound from SAP ABAP Platform | Microsoft Docs
description: Learn about Exchange Online integration for email outbound from SAP ABAP Platform.
author: MartinPankraz

ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: how-to
ms.date: 02/02/2026
ms.author: mapankra
ms.custom: sfi-image-nochange
# Customer intent: "As an SAP system administrator, I want to configure outbound email communication from SAP ABAP Platform to Exchange Online, so that I can efficiently manage notifications and workflows while ensuring compliance with modern authentication standards."
---
# Exchange Online Integration for Email-Outbound from SAP ABAP Platform

Sending emails from your SAP backend is a standard feature widely distributed for use cases such as alerting for batch jobs, SAP workflow state changes, or invoice distribution. Many customers established the setup using [Exchange Server on-premises](/exchange/exchange-server). With a shift to [Microsoft 365](https://www.microsoft.com/microsoft-365) and [Exchange Online](/exchange/exchange-online) comes a set of cloud-native approaches impacting that setup.

This article describes the setup for **outbound** email-communication from ABAP Platform-based SAP systems to Exchange Online. That applies to SAP ECC, SAP S/4HANA on-premises, SAP S/4HANA Cloud (Public and Private Edition), SAP Business Technology Platform (BTP) ABAP Environment, and any other ABAP Platform-based system.

## Overview

Existing implementations relied on SMTP Auth and elevated trust relationship because the legacy Exchange Server on-premises could live close to the SAP system itself governed by customers themselves. With Exchange Online, there's a shift in responsibilities and connectivity paradigm. Microsoft supplies Exchange Online as a Software-as-a-Service offering built to be consumed securely and as effectively as possible from anywhere in the world over the public Internet.

Follow our standard [guide](/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365) to understand the general configuration of a "device" that wants to send email via Microsoft 365.

> [!WARNING]
> With the [deprecation of Basic Authentication](https://techcommunity.microsoft.com/blog/exchange/exchange-online-to-retire-basic-auth-for-client-submission-smtp-auth/4114750) in Exchange Online, all new SAP-to-Exchange Online integrations in SAP ABAP Platform systems with SAP Basis Component (SAP_BASIS) release 7.50 or higher must use OAuth 2.0 client credential grant. This approach uses Microsoft Entra ID for secure, passwordless authentication. Release 7.50 supports client ID and secret as defined in [RFC 6749, section 4.4](https://datatracker.ietf.org/doc/html/rfc6749#section-4.4) for the [client credentials authorization grant](https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.4). With release 7.51, the JSON Web Token (JWT) bearer authorization grant as specified in [RFC 7523](https://datatracker.ietf.org/doc/html/rfc7523) is also supported (see https://launchpad.support.sap.com/#/notes/3592080).

## Setup considerations

Currently, there are four different options supported by SAP ABAP Platform. For systems from release 7.50 upwards, option 1 is recommended. For releases below 7.50, refer to options 2, 3, and 4.

1.  [SMTP OAuth 2.0](#option-1-smtp-oauth-20-recommended) (**recommended**)
2.  [SMTP Direct Send](#option-2-smtp-direct-send)
3.  [Using Exchange Online SMTP relay connector](#option-3-using-microsoft-365-smtp-relay-connector) 
4.  [Using SMTP relay server as intermediary to Exchange Online](#option-4-using-smtp-relay-server-as-intermediary-to-exchange-online)

This guide is updated when more SAP-supported options become available.

## Option 1: SMTP OAuth 2.0 (recommended)

> [!IMPORTANT]
> Use this option for the integration between Exchange Online and SAP S/4HANA on-premises, SAP S/4HANA Cloud Private Edition, SAP S/4HANA Cloud Public Edition, and the SAP BTP ABAP Environment. This option is also recommended for all other SAP ABAP Platform-based systems from release 7.50 upwards. This option enables you to send mail to **recipients inside and outside** your organization.

### Prerequisites

- Administrative access to an SAP S/4HANA system on-premises, SAP S/4HANA Cloud Private Edition tenant, SAP BTP ABAP Environment, or any other SAP ABAP Platform-based system with SAP Basis Component release 7.50 or higher. For SAP S/4HANA Cloud Public Edition, SAP manages customer-specific email configuration for SMTP OAuth 2.0. Also refer to [SAP Note 3581654](https://me.sap.com/notes/3581654) as a prerequisite for using SMTP OAuth 2.0 in SAP S/4HANA on-premises and SAP S/4HANA Cloud Private Edition.
- Administrative access to a Microsoft Exchange Online subscription
- A valid account and email address in Microsoft Exchange Online. The email address appears as the sender of messages from the SAP system.
- Administrative access to a Microsoft Entra ID tenant with at least [Application Administrator](/entra/identity/role-based-access-control/permissions-reference#application-administrator) permissions
- Port 587 is required and must be unblocked on your network
- DNS resolution for `smtp.office365.com`. Don't use an IP address for the Microsoft 365 server, as IP Addresses aren't supported.
- *Optional*
  - Access to the SAP system for certificate export if you want to use the JWT bearer authorization grant.
> [!NOTE]
> In the SAP BTP ABAP Environment, the JWT bearer authorization grant is the only option available. Refer to the respective [section](#sap-btp-abap-environment) for more details.
  - PowerShell 7.x to run the [setup script](https://github.com/microsoft/smtpoauth2/tree/main/ps) for automating the configuration in Entra ID and Exchange Online. You can download the latest Microsoft PowerShell version from https://aka.ms/powershell-release?tag=stable
  - Java 11 runtime to test the configuration in Entra ID and Exchange Online with this [client app](https://github.com/microsoft/smtpoauth2/tree/main/java).
> [!NOTE]
> You can use [this setup script](https://github.com/microsoft/smtpoauth2/tree/main/ps) to automate the configuration steps in Entra ID and Exchange Online for option 1.

### Register an application representing the SAP system in Entra ID 

To create a new application, follow these instructions (see also [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app)):

1. Go to **App registrations** in the [Microsoft Entra Admin Center](https://entra.microsoft.com). Click **New registration**.

:::image type="content" source="media/exchange-online-integration/register-application-1.png" alt-text="Screenshot of new application registration.":::

2. Enter a name for the new application representing the SAP system. Select **Accounts in this organizational directory only** and click **Register**.

:::image type="content" source="media/exchange-online-integration/register-application-2.png" alt-text="Screenshot of register app.":::

### Set the SMTP.SendAsApp API application permission for the application

1. Go to **API Permissions** of your new app registration. Click **Add a permission**.

:::image type="content" source="media/exchange-online-integration/smtp-send-as-permission-1.png" alt-text="Screenshot of add new permission.":::

2. Switch to tab **APIs my organization uses**. Enter "Office" in the search bar. Select **Office 365 Exchange Online** from the search result list.

:::image type="content" source="media/exchange-online-integration/smtp-send-as-permission-2.png" alt-text="Screenshot of select Office 365 Exchange Online APIs.":::

3. Select **Application permissions**. Enter "SMTP" in the search bar. Expand the section **SMTP** and activate the checkbox for the permission **SMTP.SendAsApp** from the search result list. Click **Add permissions**.

:::image type="content" source="media/exchange-online-integration/smtp-send-as-permission-3.png" alt-text="Screenshot of add SMTP.SendAs permission.":::

4. Select **Remove permission** from the ellipsis menu of the **User.Read** permission in the **Microsoft Graphs** section and confirm with **Yes, remove**. Then select **Grant admin consent for <your_organization_name>** and confirm with **Yes**.

:::image type="content" source="media/exchange-online-integration/smtp-send-as-permission-4.png" alt-text="Screenshot of grant admin consent.":::

5. The API permissions should now be configured as shown in the following screenshot.

:::image type="content" source="media/exchange-online-integration/smtp-send-as-permission-5.png" alt-text="Screenshot of API permission setup.":::

### Configure application credentials

To obtain an access token from Entra ID for connecting to Exchange Online, the SAP system acting as the mail client requires a credential. In SAP ECC, SAP S/4HANA on-premises, and SAP S/4HANA Cloud Private Edition, [client ID and secret](https://datatracker.ietf.org/doc/html/rfc6749#section-4.4) are supported. For S/4HANA Cloud Public Edition, the BTP ABAP environment, and all SAP ABAP Platform-based releases from 7.51 upwards, the [JWT bearer authorization grant](https://datatracker.ietf.org/doc/html/rfc7523) is also supported as documented in [SAP Note 3592080](https://launchpad.support.sap.com/#/notes/3592080). Microsoft recommends that you use the JWT bearer grant instead of a client secret before moving the integration scenario to a production environment.

#### Client ID and secret

Follow the instructions listed in [Add and manage application credentials in Microsoft Entra ID](/entra/identity-platform/how-to-add-credentials?tabs=client-secret) for using client ID and secret in the SAP system to obtain an access token from Entra ID.

1. Go to **Certificates & Secrets**. Switch to tab **Client secrets** and click **New client secret**. Enter a description for the new secret and select an expiration period. Click **Add**.

:::image type="content" source="media/exchange-online-integration/create-client-secret-1.png" alt-text="Screenshot of add secret.":::

2. Copy the value of the generated secret value to the clipboard and paste it into a temporary text file.

:::image type="content" source="media/exchange-online-integration/create-client-secret-2.png" alt-text="Screenshot of copy secret.":::

#### JWT bearer

Follow these instructions (see also [Add and manage application credentials in Microsoft Entra ID](/entra/identity-platform/how-to-add-credentials?tabs=certificate)) for using the JWT bearer grant in the SAP system to obtain an access token from Entra ID.

1. For SAP S/4HANA on-premises and SAP S/4HANA Cloud Private Edition, export the JWT signing certificate. In newer systems where transaction code SOAUTH2_CLIENT is available, click **Global Settings** and download the certificate from the **Settings for JWT Client Authentication**.

:::image type="content" source="media/exchange-online-integration/export-jwt-certificate-1-1.png" alt-text="Screenshot of export JWT signing certificate with SOAUTH2_CLIENT.":::

Otherwise use transaction code STRUST. Search for SSF application "SSF OA2CJC" (OAuth2 Client - JWT Client Authentication), double-click the **Subject** value in **Own Certificate**, and click **Export certificate**. Use **Base64** for the file format.

:::image type="content" source="media/exchange-online-integration/export-jwt-certificate-1.png" alt-text="Screenshot of export JWT signing certificate with STRUST.":::

2. For the SAP BTP ABAP Environment, select your Exchange Online communication system's **Outbound User** to export the JWT signing certificate. See [this section](#sap-btp-abap-environment) for more details.

3. In the Entra admin center, go to **Certificates & Secrets**. Switch to tab **Certificates** and click **Upload certificate**. Select the exported file, enter a description, and click **Add**. 

:::image type="content" source="media/exchange-online-integration/export-jwt-certificate-2.png" alt-text="Screenshot of import JWT signing certificate.":::

4. The JWT signing certificate is uploaded to the application.

:::image type="content" source="media/exchange-online-integration/export-jwt-certificate-3.png" alt-text="Screenshot of imported JWT signing certificate.":::

### Register the application service principal in Exchange Online

1. Go to **Overview** of the new application registration. Click on the link to the **Managed application in local directory**.

:::image type="content" source="media/exchange-online-integration/register-service-principal-1.png" alt-text="Screenshot of navigate to service principal.":::

2. Click **Copy to clipboard** for the **Application ID** and **Object ID**. Copy and paste both values into a temporary text file.

:::image type="content" source="media/exchange-online-integration/register-service-principal-2.png" alt-text="Screenshot of copy service principal ID.":::

3. Go to the [Exchange admin center](https://admin.exchange.microsoft.com/) and open a Cloud Shell. Click **Switch to PowerShell**.

:::image type="content" source="media/exchange-online-integration/register-service-principal-3.png" alt-text="Screenshot of start Cloud Shell.":::

4. Run the following PowerShell commands in the Cloud Shell.
    ```powershell
    Connect-ExchangeOnline -ShowBanner:$false
    $mailboxName='<mailbox User ID, for example ABAP_XYZ@tenant.onmicrosoft.com>'
    $servicePrincipalAppId='<Application ID copied in step 2>'
    $servicePrincipalObjId='<Object ID copied in step 2>'
    New-ServicePrincipal -AppId $servicePrincipalAppId -ObjectId $servicePrincipalObjId
    Add-MailboxPermission -Identity $mailboxName -User $servicePrincipalObjId -AccessRights FullAccess
    ```
    The output should be as follows:

:::image type="content" source="media/exchange-online-integration/register-service-principal-4.png" alt-text="Screenshot of PowerShell script output.":::

5. Verify that the service principal has the permission on the mailbox. Go to **Mailboxes**. Select the SAP system's mailbox and switch to the tab **Delegation**. Click **Edit**.

:::image type="content" source="media/exchange-online-integration/register-service-principal-5.png" alt-text="Screenshot of service principal registration.":::

6. Your application's service principal is listed as a delegate with full access permissions to open the SAP system's mailbox and behave as the mailbox owner.

:::image type="content" source="media/exchange-online-integration/register-service-principal-6.png" alt-text="Screenshot of delegate.":::

### Activate SMTP AUTH for the mailbox

To allow the SAP system to send email messages, the assigned mailbox must enable the SMTP AUTH protocol.

1. Go to the [Microsoft 365 Admin Center](https://admin.microsoft.com/).

2. Go to **Active users**. Select your SAP system's mailbox user from the list, and switch to the **Mail** tab. Click **Manage email apps**.

:::image type="content" source="media/exchange-online-integration/activate-smtp-authentication-1.png" alt-text="Screenshot of open email app settings.":::

3. Ensure that the checkbox for **Authenticated SMTP** is activated. If not, activate it, and save the changes.

:::image type="content" source="media/exchange-online-integration/activate-smtp-authentication-2.png" alt-text="Screenshot of activate SMTP AUTH.":::

### Optional: Test the configuration in Entra and Exchange Online with the SMTP OAuth test client

You can test the new configuration with a simple [SMTP OAuth test client app](https://github.com/microsoft/smtpoauth2/tree/main/java).

> [!NOTE]
> The test client only supports client ID and secret. If you configured your application for JWT bearer only, add a client secret for testing with this app.

1. Clone the GitHub repository at https://github.com/microsoft/smtpoauth2/
    ```bash
    git clone https://github.com/microsoft/smtpoauth2.git
    ```

2. Follow the steps described in the test client's [README](https://github.com/microsoft/smtpoauth2/blob/main/java/README.md) file.

3. Run the test client with your values for **client ID**, **client secret**, **tenant ID**, and **mailbox name**. You can optionally pass a **recipient email address** to receive a test mail. Check the test client output for a message that confirms successful connection to Exchange Online with OAuth 2.0.

:::image type="content" source="media/exchange-online-integration/test-smtp-oauth-1.png" alt-text="Screenshot of SMTP OAuth test client app output.":::

### Configure SMTP OAuth in SAP

Follow the corresponding section of your SAP environment.

#### SAP S/4HANA on-premises and SAP S/4HANA Cloud Private Edition  

1. Ping or telnet **smtp.office365.com** on port **587** from your SAP application server to make sure ports are open and accessible.

:::image type="content" source="media/exchange-online-integration/telnet-scot-sec-1-1.png" alt-text="Screenshot of ping.":::

2. Make sure SAP Internet Communication Manager (ICM) parameter is set in your instance profile. See this example:

    | parameter | value |
    |---|---|
    | icm/server-port-1 | PROT=SMTP,PORT=25000,TIMEOUT=180,TLS=1 |

3. Restart ICM service from SMICM transaction and make sure SMTP service is active.

:::image type="content" source="media/exchange-online-integration/scot-smicm-sec-1-3.png" alt-text="Screenshot of ICM setting.":::

4. Activate SAPConnect service in SICF transaction.

:::image type="content" source="media/exchange-online-integration/scot-smtp-sec-1-4.png" alt-text="Screenshot of SAP Connect setting in SICF.":::

5. You need to configure an OAuth 2.0 Client Profile for the integration. SAP delivers a standard OAuth 2.0 Profile “BCS_MAIL”, which can be used directly. Alternatively, you can create your own OAuth 2.0 Profile and use it for email outbound communication with Exchange Online.

6. Use transaction SBCS_MAIL_CONFIGSMTP to enter all relevant information for the SMTP configuration for outbound communication. Select **OAuth2** as the **Authentication Method**, and enter the values for **OAuth 2.0 Client Profile**, **OAuth 2.0 Client Configuration**, and the authorized **OAuth 2.0 Client User**.
   > [!NOTE]
   > By activating the checkbox **Modify legacy SMTP node**, the configuration is automatically copied to the old SCOT transaction
   
   :::image type="content" source="media/exchange-online-integration/mail-configuration-smtp.png" alt-text="Screenshot of SBCS_MAIL_CONFIGSMTP outbound configuration.":::

7. Alternatively, transaction SCOT can be used directly to enter the same information as in transaction SBCS_MAIL_CONFIGSMTP into the SMTP node.

:::image type="content" source="media/exchange-online-integration/mail-configuration-scot.png" alt-text="Screenshot of SCOT SMTP outbound configuration.":::

#### SAP BTP ABAP Environment

Configuration in SAP BTP ABAP Environment is done with the communication arrangement of SAP_COM_0548. 

1. This setup requires a Communication System and the creation of a new Outbound User of type **OAuth 2.0**. Enter the **Application ID** from the application registration in Entra ID as the **OAuth 2.0 Client ID** for the **New Outbound User**. Click **Download Certificate** to export the JWT signing certificate of your SAP BTP ABAP Environment.

:::image type="content" source="media/exchange-online-integration/new-communication-system.png" alt-text="Screenshot of Communication System setup.":::

2. In the communication arrangement of SAP_COM_0548, enter the mailbox user's email address from Exchange Online for the value of property **OAuth User**. Also enter the value "https://outlook.office365.com/.default" in the field **Additional Scope**.

:::image type="content" source="media/exchange-online-integration/communication-arrangement.png" alt-text="Screenshot of Communication Arrangement setup.":::

#### SAP S/4HANA Cloud Public Edition

There's no customer-managed configuration in SAP S/4HANA Cloud Public Edition. SAP manages the integration with Exchange Online in your tenant.

### Limitations of SMTP OAuth

- Sending email via individual SAP users requires to implement the "[Send as permission](/exchange/recipients-in-exchange-online/manage-permissions-for-recipients)" offered by Microsoft 365. Using the **Send as** permission allows the delegate to send an email from the shared mailbox. Messages will appear to have been sent from the delegate. 
   > [!NOTE]
   > You can only assign the **Send as** permission for the shared mailbox to individual users. Configuring the permission for a group isn't supported.

- Microsoft 365 imposes some sending limits. Refer to [Exchange Online limits - Receiving and sending limits](/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits#receiving-and-sending-limits) for more details.

## Option 2: SMTP Direct Send

Microsoft 365 offers the ability to configure [direct send](/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365#option-2-send-mail-directly-from-your-printer-or-application-to-microsoft-365-or-office-365-direct-send) from the SAP application server. This option is limited. It only permits mails to addresses in your own Microsoft 365 organization with a valid e-mail address. It can't be used for external recipients (for example vendors or customers).

## Option 3: Using Microsoft 365 SMTP Relay Connector

Only choose this option when:

-   Your Microsoft 365 environment has SMTP AUTH disabled.
-   SMTP OAuth 2.0 (Option 1) isn't compatible with your business needs or with your SAP Application.
-   You can't use direct send (Option 2) because you must send email to external recipients.

SMTP relay lets Microsoft 365 relay emails on your behalf by using a connector configured with your public IP address or a TLS certificate. Compared to the other options, the connector setup increases complexity.

### Requirements for SMTP Relay

- **SAP Parameter**: SAP instance parameter configured and SMTP service are activated as explained in option 1, follow steps 2 to 4 from "Configure SMTP OAuth in SAP" section.
- **Email Address**: Any email address in one of your Microsoft 365 verified domains. This email address doesn't need a mailbox. For example, `noreply@*yourdomain*.com`.
- **Transport Layer Security (TLS)**: SAP application must be able to use TLS version 1.2 and above.
- **Port**: port 25 is required and must be unblocked on your network. Some network firewalls or ISPs block ports, especially port 25 due to the risk of misuse for spamming.
- **MX record**: your Mail Exchanger (MX) endpoint, for example yourdomain.mail.protection.outlook.com. Find more information on the next section.
- **Relay Access**: A Public IP address or SSL certificate is required to authenticate against the relay connector. To avoid configuring direct access, it's recommended to use Source Network Translation (SNAT) as described in this article. [Use Source Network Address Translation (SNAT) for outbound connections](../../load-balancer/load-balancer-outbound-connections.md).

### Step-by-step configuration instructions for SMTP relay in Microsoft 365

1. Obtain the public (static) IP address of the endpoint that sends the mail using one of the methods listed in the [article](../../load-balancer/load-balancer-outbound-connections.md) above. A dynamic IP address isn\'t supported or allowed. You can share your static IP address with other devices and users, but don't share the IP address with anyone outside of your company. Make a note of this IP address for later.

:::image type="content" source="media/exchange-online-integration/azure-portal-pip-sec-3-1.png" alt-text="Screenshot of where to retrieve the public ip on the Azure Portal.":::

> [!NOTE]
> Find above information on the Azure portal using the Virtual Machine overview of the SAP application server.

2. Sign in to the [Microsoft 365 Admin Center](https://admin.microsoft.com/).

:::image type="content" source="media/exchange-online-integration/m365-admin-center-sec-3-2.png" alt-text="Screenshot of Microsoft 365 AC sign in.":::

3. Go to **Settings** -> **Domains**, select your domain (for example, contoso.com), and find the Mail Exchanger (MX) record.

:::image type="content" source="media/exchange-online-integration/m365-admin-center-domains-sec-3-3.png" alt-text="Screenshot of where to retrieve the domain mx record.":::

   The Mail Exchanger (MX) record will have data for **Points to address or value** that looks similar to `yourdomain.mail.protection.outlook.com`.

4. Make a note of the data of **Points to address or value** for the Mail Exchanger (MX) record, which is referred to as your MX endpoint.

5. In Microsoft 365, select **Admin** and then **Exchange** to go to the new Exchange Admin Center.

:::image type="content" source="media/exchange-online-integration/m365-admin-center-exchange-sec-3-5.png" alt-text="Screenshot of Microsoft 365 Admin Center.":::

6. New Exchange Admin Center (EAC) portal opens.

:::image type="content" source="media/exchange-online-integration/exchange-admin-center-sec-3-6.png" alt-text="Screenshot of Microsoft 365 Admin Center mailbox.":::

7. In the Exchange Admin Center (EAC), go to **Mail flow** -> **Connectors**. The **Connectors** screen is depicted below. If you're working with the classical EAC follow step 8 as described on our [docs](/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365#step-by-step-configuration-instructions-for-smtp-relay).

:::image type="content" source="media/exchange-online-integration/exchange-admin-center-add-connector-sec-3-7.png" alt-text="Screenshot of Microsoft 365 Admin Center connector.":::

8. Click **Add a connector**

:::image type="content" source="media/exchange-online-integration/exchange-relay-connector-add-sec-3-8.png" alt-text="Screenshot of Microsoft 365 Admin Center connector add.":::

   Choose "Your organization's email server".

:::image type="content" source="media/exchange-online-integration/new-connector-sec-3-8.png" alt-text="Screenshot of Microsoft 365 Admin Center mail server.":::

9. Click **Next**. The **Connector name** screen appears.

:::image type="content" source="media/exchange-online-integration/connector-name-section-3-9.png" alt-text="Screenshot of Microsoft 365 Admin Center connector name.":::

10. Provide a name for the connector and click **Next**. The **Authenticating sent email** screen appears.

   Choose *By verifying that the IP address of the sending server matches one of these IP addresses which belong exclusively to your organization* and add the IP address from Step 1 of the **Step-by-step configuration instructions for SMTP relay in Microsoft 365** section.
   
   :::image type="content" source="media/exchange-online-integration/connector-authenticate-ip-add-section-3-10-1.png" alt-text="Screenshot of Microsoft 365 Admin Center verify IP.":::
    
   Review and click on **Create connector**.
   
   :::image type="content" source="media/exchange-online-integration/review-connector-section-3-10-2.png" alt-text="Screenshot of Microsoft 365 Admin Center review.":::
   :::image type="content" source="media/exchange-online-integration/connector-created-sec-3-10-3.png" alt-text="Screenshot of Microsoft 365 Admin Center review security settings.":::

11. Now that you're done with configuring your Microsoft 365 settings, go to your domain registrar's website to update your DNS records. Edit your **Sender Policy Framework (SPF)** record. Include the IP address that you noted in step 1. The finished string should look similar to this `v=spf1 ip4:10.5.3.2 include:spf.protection.outlook.com \~all`, where 10.5.3.2 is your public IP address. Skipping this step may cause emails to be flagged as spam and end up in the recipient's Junk Email folder.

### Steps in SAP Application server

1. Make sure SAP ICM Parameter and SMTP service is activated as explained in Option 1 (steps 2-4).
2. Go to SCOT transaction in SMTP node as shown in previous steps of Option 1.
3. Add mail Host as Mail Exchanger (MX) record value noted in Step 4 (yourdomain.mail.protection.outlook.com).

:::image type="content" source="media/exchange-online-integration/scot-smtp-connection-relay-sec-3-3.png" alt-text="Screenshot of SMTP config in SCOT.":::

Mail host: yourdomain.mail.protection.outlook.com

Port: 25

4. Click "Settings" next to the Security field and make sure TLS is enabled if possible. Also make sure no prior logon data regarding SMTP AUTH is present. Otherwise delete existing records with the corresponding button underneath.

:::image type="content" source="media/exchange-online-integration/scot-smtp-connection-relay-tls-sec-3-4.png" alt-text="Screenshot of SMTP security config in SCOT.":::

5. Test the configuration using a test email from your SAP application with transaction SBWP and check the status in SOST transaction.

## Option 4: Using SMTP relay server as intermediary to Exchange Online

An intermediate relay server can be an alternative to a direct connection from the SAP application server to Microsoft 365. This server can be based on any mail server that allows direct authentication and relay services.

The advantage of this solution is that it can be deployed in the hub of a hub-spoke virtual network within your Azure environment. Or within a DMZ to protect your SAP application hosts from direct access. It also allows for centralized outbound routing to immediately offload all mail traffic to a central relay when sending from multiple application servers.

The configuration steps are the same as for the Microsoft 365 SMTP Relay Connector (Option 3). The only differences being that the SCOT configuration should reference the mail host that performs the relay rather than direct to Microsoft 365. Depending on the mail system that's being used for the relay it will also be configured directly to connect to Microsoft 365 using one of the supported methods and a valid user with password. It's recommended to send a test mail from the relay directly to ensure it can communicate successfully with Microsoft 365 before completing the SAP SCOT configuration and testing as normal.

:::image type="content" source="media/exchange-online-integration/sap-outbound-mail-with-smtp-relay.png" alt-text="Relay Server Architecture.":::

The example architecture shown illustrates multiple SAP application servers with a single mail relay host in the hub. Depending on the volume of mail to be sent it's recommended to follow a detailed sizing guide for the mail vendor to be used as the relay. This may require multiple mail relay hosts which operate with an Azure Load Balancer.

## Next Steps

[Understand mass-mailing with Azure Twilio - SendGrid](https://docs.sendgrid.com/for-developers/partners/microsoft-azure-2021)

[Understand Exchange Online Service limitations (for example attachment size, message limits, throttling, etc.)](/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits)

[Verify your ABAP SDK for Azure configuration for Exchange Online integrations](https://github.com/microsoft/ABAP-SDK-for-Azure)
