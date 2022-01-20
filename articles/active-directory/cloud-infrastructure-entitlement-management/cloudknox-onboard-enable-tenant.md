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
ms.date: 01/19/2022
ms.author: v-ydequadros
---

# Enable CloudKnox on your Azure Active Directory tenant

This topic describes how to enable Microsoft CloudKnox Permissions Management (CloudKnox) on your Azure Active Directory (Azure AD) tenant.

> [!NOTE] 
> To complete this task, you must have Global Administrator permissions.

<!---Context: to collect data from your clouds, we need to…  @Mrudula to help fill in context--->

**To enable CloudKnox on your Azure AD tenant:**

1. Log in to your Azure AD tenant and select **Next**.
1. Open your browser and enter aka.ms/ciem-prod.
1. In the Azure AD portal, select **CloudKnox Permissions Management**.

    The **Welcome to CloudKnox Permissions Management** screen appears. 

    This screen provides information on how to enable CloudKnox on your tenant.

1. To provide access to the CloudKnox, create a service principal that points to CloudKnox.

    An Azure service principal is a security identity used by user-created apps, services, and automation tools to access specific Azure resources. 

    1. Copy the script on the **Welcome** screen:

        `az ad ap create --id b46c3ac5-9da6-418f-a849-0a7a10b3c6c`

    1. Paste this script into your command-line app and run it.

    After the script runs successfully, the command-line app displays the service application attributes for CloudKnox. 

    You can view the **Cloud Infrastructure Entitlement Management** application in the Azure AD portal under **Enterprise Applications**.

1. To enable CloudKnox:

    1. Return to the **Welcome to CloudKnox** screen.
    1. Select **Enable CloudKnox Permissions Management**.

    The tenant completes enabling CloudKnox on your tenant and launches the CloudKnox **Data Collectors** settings page.

    <!---Add image data-collectors-tab.jpg--->

    You use the **Data Collectors** page to configure data collection settings for your authorization system. 

6. In the CloudKnox **Data Collectors** settings page, select the authorization system you want.

7. For information on how to  onboard your authorization system, select one of the following topics and follow the instructions:

    - [Onboard the Amazon Web Services (AWS) authorization system](cloudknox-onboard-aws.md)
    - [Onboard the Microsoft Azure authorization system](cloudknox-onboard-azure.md)
    - [Onboard the Google Cloud Platform (GCP) authorization system](cloudknox-onboard-gcp.md)

<!---Next Steps--->



