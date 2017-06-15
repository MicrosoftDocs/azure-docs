---
title: Named locations in Azure Active Directory | Microsoft Docs
description: By configuring named locations, you can avoid having IP addresses that are owned by your organization generate false positives for the Impossible travel to atypical locations risk event type.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila

ms.assetid: f56e042a-78d5-4ea3-be33-94004f2a0fc3
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/10/2017
ms.author: markvi

---
# Named locations in Azure Active Directory

With the named locations feature of Azure Active Directory, you can label trusted IP address ranges in your organizations. In your environment, you can use named locations in the context of the detection of [risk events](active-directory-reporting-risk-events.md). The feature helps reduce the number of reported false positives for the *Impossible travel to atypical locations* risk event type. 

## Configuration

To configure a named location:

1. Sign in to the [Azure portal](https://portal.azure.com) as global administrator.

2. In the left pane, click **Azure Active Directory**.

	![The Azure Active Directory link in the left pane](./media/active-directory-named-locations/01.png)

3. On the **Azure Active Directory** blade, in the **Security** section, click **Conditional access**.

	![The Conditional access command](./media/active-directory-named-locations/05.png)


4. On the **Conditional Access** blade, in the **Manage** section, click **Named locations**.

	![The Named locations command](./media/active-directory-named-locations/06.png)


5. On the **Named locations** blade, click **New location**.

	![The New location command](./media/active-directory-named-locations/07.png)


6. On the **New** blade, do the following:

	![The New blade](./media/active-directory-named-locations/08.png)

    a. In the **Name** box, type a name for your named location.

    b. In the **IP ranges** box, type an IP range. The IP range needs to be in the *Classless Inter-Domain Routing* (CIDR) format.  

    c. Click **Create**.



## What you should know

**Bulk updates**: When you create or update named locations, for bulk updates, you can upload or download a CSV file with the IP ranges. An upload adds the IP ranges in the file to the list instead of overwriting the list.

![The Upload and Download links](./media/active-directory-named-locations/09.png)


**Limitations**: You can define a maximum of 60 named locations, with one IP range assigned to each of them. If you have just one named location configured, you can define up to 500 IP ranges for it.


## Next steps

To learn more about risk events, see [Azure Active Directory risk events](active-directory-reporting-risk-events.md).

