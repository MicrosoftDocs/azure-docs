---
title:  Microsoft CloudKnox Permissions Management - Enable Cloud Microsoft Infrastructure Entitlement Management (M-CIEM) on your Azure Active Directory (Azure AD) tenant
description: How to enable Cloud Microsoft Infrastructure Entitlement Management (M-CIEM) on your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/05/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - Enable Cloud Microsoft Infrastructure Entitlement Management (M-CIEM) on your Azure Active Directory (Azure AD) tenant

This topic describes how to:
    - Enable Cloud Microsoft Infrastructure Entitlement Management (M-CIEM)  on your Azure Active Directory (Azure AD) tenant.
    - Onboard the Amazon Web Services (AWS) authorization system.
    - Onboard the Microsoft Azure (Azure) authorization system.
    - Onboard the Google Cloud Platform (GCP) authorization system.

## Enable M-CIEM on your Azure AD tenant

> [!NOTE] 
> This task must be completed by a user with Global Administrator permissions.

1. Log in to your Azure AD tenant and select **Next**.
2. Select the **Cloud Infrastructure Entitlement Management** tile.

    The **Welcome to Cloud Infrastructure Entitlement Management** screen appears. 

    On the right of the box is a list of steps for you to complete to enable CIEM on your tenant.

3. To provide access to M-CIEM’s first party application, create a service principle that points to M-CIEM’s first party application.
4. Copy the script on the **Welcome** screen, paste the script into your command line interface (CLI), and run it.
5. When the script has run successfully, return to the **Welcome to CIEM** screen and select **Enable CIEM**.

    The tenant completes the onboarding process and opens the CIEM Settings dashboard.

<!---## Onboard the AWS authorization system--->

## Onboard the Azure authorization system

1. Launch **M-CIEM**.
2. On the **Data Collections** tab, select **Azure**, and then select **Create Configuration**.
3. In the **M-CIEM Onboarding – Azure Subscription Details** dialog, select settings for the following fields:

    - **Permission Level** – From the drop-down list, select the required Subscription Level.
    - **Controller Status** – From the drop-down list, select the required Controller Status:
**Enabled for read and write permissions.** or **Disabled for read-only permissions.**
    - Enter your **Azure Subscription IDs**, then select **Next**.

4. In the **M-CIEM Onboarding – Summary** dialog, review the information you’ve added, and then select **View Now & Save**.

    On the **Data Collections** tab, in the **Recently Uploaded On** and **Recently Transformed On** columns, you’ll see that M-CIEM has started collecting data.

    When the data has been processed, the CloudKnox **Dashboard** will display Privilege Creep Index (PCI) information.


## Onboard the GCP authorization system

1. Launch **M-CIEM**.
2. On the **Data Collections** tab, select **GCP**, and then select **Create Configuration**.
3. In the **M-CIEM Onboarding – Azure OIDC App Creation** dialog, enter the **OIDC Azure App Name**.
4. To create the app registration, copy the script in the dialog and run it in your command line interface (CLI).
5. In the** M-CIEM Onboarding – Azure OIDC Account Details & IDP Access** dialog, enter the **GCP Project Name**.
6. For the rest of the values, accept the default values or change them as required. Then select **Next**.
7. In the **M-CIEM Onboarding – Summary** dialog, review the information you’ve added, and then select **View Now & Save**.

    On the **Data Collections** tab, in the **Recently Uploaded On** and **Recently Transformed On** columns, you’ll see that M-CIEM has started collecting data.

    When the data has been processed, the CloudKnox **Dashboard** will display Privilege Creep Index (PCI) information.










<!---## Next steps--->