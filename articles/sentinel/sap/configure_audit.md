---
title: Enable and configure SAP auditing | Microsoft Docs
description: Enable and configure SAP auditing
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 02/06/2022
---

# Enable and configure SAP auditing
[!INCLUDE [Banner for top of topics](../includes/banner.md)]

The following article provides a step-by-step guidance to deploy Microsoft Sentinel continuous protection for SAP data connector Virtual Machine in Azure. Azure key vault will be used to store secrets (such as credentials to access SAP and Log Analytics workspace). Virtual Machine will use Azure Managed identity to authenticate to Azure key vault.

> [!IMPORTANT]
> The Microsoft Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Some installations of SAP may not have audit log enabled by default.
To get best experience from evaluation of SAP continuous threat monitoring, it is recommended to enable auditing of SAP and configure audit parameters.
This guide is a step-by-step instruction on how to enable and configure auditing

> [!IMPORTANT]
> 
> It is strongly recommended that management of SAP system is carried out by an experienced SAP system administrator
>
> The steps below may differ depending on the version of the SAP system and should be considered as a sample only

#### Verify if auditing is enabled
1. Logon to SAP GUI and run **RSAU_CONFIG** transaction
   ![Run RSAU_CONFIG transaction](./media/configure_audit/rsau_config.png "Run RSAU_CONFIG transaction")
2. In **Security Audit Log - Display of Current Configuration** window navigate to **Parameter** section in **Configuration** section, then verify **Static security audit active** checkbox in **General Parameters** section




#### Enabling auditing

> [!IMPORTANT]
> Audit policy should be configured in tight collaboration between SAP administrators and security department. Below steps outline a sample on how to enable auditing in SAP

1. Logon to SAP GUI and run **RSAU_CONFIG** transaction
1. In **Security Audit Log** select **Parameter** under **Security Audit Log Configuration** section in **Configuration** tree.
1. If the **Static security audit active** checkbox is selected, system-level auditing is turned on, if it isn't, click on **Display <-> Change** and ensure **Static security audit active** checkbox is selected. A server reboot will be necessary to activate the auditing.
1. Right click Static Configuration and select **Create Profile**
1. Specify a name for the profile in the **Profile/Filter Number** field
1. Check the **Filter for recording active** checkbox
1. In Client field, enter **\***
1. In User field enter **\***
1. In Event Selection, select **Classic event selection** select all events (Dialog Logon, RFC/CPIC Logon, RFC Function Call, Transaction Start, Report Start, User Master Changes, System Events, Other Events). Alternatively, review list of message IDs listed in [Recommended audit categories](#recommended-audit-categories) section of this article and configure them in **Detail event selection**
1. Click **Save**
1. Notice that **Static Configuration** section displays the newly created profile<br>
Right click the profile and select **Activate**
1. In the confirmation window click **Yes** to activate the newly created profile

### Recommended audit categories
The following table lists Message IDs used by Continuous Threat Monitoring for SAP solution. In order for analytic rules to detect events in a correct fashion, it is strongly recommended to configure an audit policy that includes message IDs listed below as a minimum.

|Message ID|Message text|Category name|Event Weighting|Class Used in Rules|
|-|-|-|-|-|
AU1	|	Logon successful (type=&A, method=&C)	|	Logon	|	Severe	|	Used	|
AU2	|	Logon failed (reason=&B, type=&A, method=&C)	|	Logon	|	Critical	|	Used	|
AU3	|	Transaction &A started.	|	Transaction Start	|	Non-Critical	|	Used	|
AU5	|	RFC/CPIC logon successful (type=&A, method=&C)	|	RFC Login	|	Non-Critical	|	Used	|
AU6	|	RFC/CPIC logon failed, reason=&B, type=&A, method=&C	|	RFC Login	|	Critical	|	Used	|
AU7	|	User &A created.	|	User Master Record Change	|	Critical	|	Used	|
AU8	|	User &A deleted.	|	User Master Record Change	|	Severe	|	Used	|
AU9	|	User &A locked.	|	User Master Record Change	|	Severe	|	Used	|
AUA	|	User &A unlocked.	|	User Master Record Change	|	Severe	|	Used	|
AUB	|	Authorizations for user &A changed.	|	User Master Record Change	|	Severe	|	Used	|
AUD	|	User master record &A changed.	|	User Master Record Change	|	Severe	|	Used	|
AUE	|	Audit configuration changed	|	System	|	Critical	|	Used	|
AUF	|	Audit: Slot &A: Class &B, Severity &C, User &D, Client &E, &F	|	System	|	Critical	|	Used	|
AUI	|	Audit: Slot &A Inactive	|	System	|	Critical	|	Used	|
AUJ	|	Audit: Active status set to &1	|	System	|	Critical with Monitor Alert	|	Used	|
AUK	|	Successful RFC call &C (function group = &A)	|	RFC Start	|	Non-Critical	|	Used	|
AUM	|	User &B locked in client &A after errors in password checks	|	Logon	|	Critical with Monitor Alert	|	Used	|
AUO	|	Logon failed (reason = &B, type = &A)	|	Logon	|	Severe	|	Used	|
AUP	|	Transaction &A locked	|	Transaction Start	|	Severe	|	Used	|
AUQ	|	Transaction &A unlocked	|	Transaction Start	|	Severe	|	Used	|
AUR	|	&A &B created	|	User Master Record Change	|	Severe	|	Used	|
AUT	|	&A &B changed	|	User Master Record Change	|	Severe	|	Used	|
AUW	|	Report &A started	|	Report Start	|	Non-Critical	|	Used	|
AUY	|	Download &A Bytes to File &C	|	Other	|	Severe	|	Used	|
BU1	|	Password check failed for user &B in client &A	|	Other	|	Critical with Monitor Alert	|	Used	|
BU2	|	Password changed for user &B in client &A	|	User Master Record Change	|	Non-Critical	|	Used	|
BU4	|	Dynamic ABAP code: Event &A, event type &B, check total &C	|	Other	|	Non-Critical	|	Used	|
BUG	|	HTTP Security Session Management was deactivated for client &A.	|	Other	|	Critical with Monitor Alert	|	Used	|
BUI	|	SPNego replay attack detected (UPN=&A)	|	Logon	|	Critical	|	Used	|
BUV	|	Invalid hash value &A. The context contains &B.	|	User Master Record Change	|	Critical	|	Used	|
BUW	|	A refresh token issued to client &A was used by client &B.	|	User Master Record Change	|	Critical	|	Used	|
CUK	|	C debugging activated	|	Other	|	Critical	|	Used	|
CUL	|	Field content in debugger changed by user &A: &B (&C)	|	Other	|	Critical	|	Used	|
CUM	|	Jump to ABAP Debugger by user &A: &B (&C)	|	Other	|	Critical	|	Used	|
CUN	|	A process was stopped from the debugger by user &A (&C)	|	Other	|	Critical	|	Used	|
CUO	|	Explicit database operation in debugger by user &A: &B (&C)	|	Other	|	Critical	|	Used	|
CUP	|	Non-exclusive debugging session started by user &A (&C)	|	Other	|	Critical	|	Used	|
CUS	|	Logical file name &B is not a valid alias for logical file name &A	|	Other	|	Severe	|	Used	|
CUZ	|	Generic table access by RFC to &A with activity &B	|	RFC Start	|	Critical	|	Used	|
DU1	|	FTP server whitelist is empty	|	RFC Start	|	Severe	|	Used	|
DU2	|	FTP server whitelist is non-secure due to use of placeholders	|	RFC Start	|	Severe	|	Used	|
DU8	|	FTP connection request for server &A successful	|	RFC Start	|	Non-Critical	|	Used	|
DU9	|	Generic table access call to &A with activity &B (auth. check: &C )	|	Transaction Start	|	Non-Critical	|	Used	|
DUH	|	OAuth 2.0: Token declared invalid (OAuth client=&A, user=&B, token type=&C)	|	User Master Record Change	|	Severe with Monitor Alert	|	Used	|
EU1	|	System change options changed ( &A to &B )	|	System	|	Critical	|	Used	|
EU2	|	Client &A settings changed ( &B )	|	System	|	Critical	|	Used	|
EUF	|	Could not call RFC function module &A	|	RFC Start	|	Non-Critical	|	Used	|
FU0	|	Exclusive security audit log medium changed (new status &A)	|	System	|	Critical	|	Used	|
FU1	|	RFC function &B with dynamic destination &C was called in program &A	|	RFC Start	|	Non-Critical	|	Used	|