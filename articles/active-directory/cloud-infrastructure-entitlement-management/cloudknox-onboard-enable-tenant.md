---
title:  Enable Microsoft CloudKnox Permissions Management on your Azure Active Directory (Azure AD) tenant
description: How to enable Microsoft CloudKnox Permissions Management on your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/18/2022
ms.author: v-ydequadros
---

# Enable CloudKnox on your Azure Active Directory tenant

This topic describes how to enable Microsoft CloudKnox Permissions Management (CloudKnox) on your Azure Active Directory (Azure AD) tenant.

> [!NOTE] 
> To complete this task you must have Global Administrator permissions.

**To enable CloudKnox on your Azure AD tenant:**

1. Log in to your Azure AD tenant and select **Next**.
2. Select the **CloudKnox Permissions Management** tile.

    The **Welcome to CloudKnox Permissions Management** screen appears. 

    This screen provides information on how to enable CloudKnox on your tenant.

3. To provide access to CloudKnox first party application, create a service principal that points to CloudKnox first party application.

4. To create a service principal that points to the first party application:

    1. Copy the script on the **Welcome** screen:

        `az ad ap create --id b46c3ac5-9da6-418f-a849-0a7a10b3c6c`

    2. Paste this script into your command-line app and run it.

    After the script runs successfully, the command-line app displays the service application attributes for the first-party app. 

5. To enable CloudKnox:

    1. Return to the **Welcome to CloudKnox** screen.
    1. Select **Enable CloudKnox Permissions Management**.

    The tenant completes enabling CloudKnox on your tenant and launches the CloudKnox **Data Collectors** settings page. 

    Your next task is to onboard your authorization system on CloudKnox. 

6. In the CloudKnox **Data Collectors** settings page, select the cloud account provider you want.

7. For information on how to  onboard your authorization system, select one of the following topics and follow the instructions:

    - Onboard the Amazon Web Services (AWS) authorization system.
    - Onboard the Microsoft Azure authorization system.
    - Onboard the Google Cloud Platform (GCP) authorization system.



<!---Next Steps-->
<!---[Onboard the Amazon Web Services (AWS) authorization system](cloudknox-onboard-aws.html).--->
<!---[Onboard the Microsoft Azure authorization system](cloudknox-onboard-azure.html).--->
<!---[Onboard the Google Cloud Platform (GCP) authorization system](cloudknox-onboard-gcp.html).--->





