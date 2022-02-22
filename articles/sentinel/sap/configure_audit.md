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

1. Logon to SAP GUI and run **RZ10** transaction
<br>![Run RZ10 transaction](./media/configure_audit/rz10_transaction.png "Run RZ10 transaction")
2. In **Edit Profiles** window select **More** -> **Utilities** -> **Import profiles** -> **Of active servers**
<br>![Import profiles of active servers](./media/configure_audit/import_profiles_of_active_servers.png "Import profiles of active servers")
3. In **Display Profile Check Log** click **Back**
<br>![Display Profile Check Log](./media/configure_audit/display_profile_check_log.png "Display Profile Check Log")
4. Back in **Edit Profiles** window click the boxes next to **Profile** field
<br>![Profiles](./media/configure_audit/profiles.png "Profiles")
5. In **Restrict Value Range** window select **Default** profile and click green checkbox (Copy)
<br>![Select Default profile](./media/configure_audit/profile_select.png "Select Default profile")
6. Back in **Edit Profiles** window verify **Administrative Data** is selected in **Edit Profile** section and click **Import**
<br>![Import profile](./media/configure_audit/profile_import.png "Import profile")
7. In the Information dialog box click green checkbox
<br>![Information - First maintain management data](./media/configure_audit/info_maintain_management_data.png "Information - First maintain management data")
8. In **Edit Profile Management Data** window, type a profile description and add an extension **.PFL** (e.g.) `DEFAULT` to **Activation in Operating System File** field (e.g.) `/usr/sap/A4H/SYS/profile/DEFAULT.PFL`, check **Default Profile** in **Profile type**, then click **Copy**
<br>![Edit Profile Management Data](./media/configure_audit/edit_profile_management_data.png "Edit Profile Management Data")
9. Back in **Edit Profiles** click **Import** 
<br>![Import profile again](./media/configure_audit/edit_profiles.png "Import profile again")
10. In **Import Profile** dialog box click the boxes next to **Name** field
<br>![Import profile dialog box](./media/configure_audit/import_profile.png "Import profile dialog box")
11. In the **Instance Profile** window, select the profile name specified in the previous step, then click **Copy** (green checkbox)
<br>![Select profile](./media/configure_audit/instance_profile.png "Select profile")
12. In the **Import profile** window click **Copy**
<br>![Import profile dialog box - copy](./media/configure_audit/import_profile_copy.png "Import profile dialog box - copy")








