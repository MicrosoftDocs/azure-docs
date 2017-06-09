---
title: Known Networks in the Azure classic portal | Microsoft Docs
description: By configuring known networks, you can avoid having IP addresses that are owned by your organization included in the Sign ins from multiple geographies and Sign ins from IP addresses with suspicious activity reports.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: f56e042a-78d5-4ea3-be33-94004f2a0fc3
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/06/2017
ms.author: markvi

---
# Known networks

> [!div class="op_single_selector"]
> * [Azure classic portal](active-directory-known-networks.md)
> * [Azure portal](active-directory-known-networks-azure-portal.md)
> 
> 


You can use Azure Active Directory's access and usage reports to gain visibility into the integrity and security of your organization’s directory. With this information, a directory admin can better determine where possible security risks may lie so that they can adequately plan to mitigate those risks.

It is possible that the “*Sign ins from multiple geographies*” and “*Sign ins from IP addresses with suspicious activity*” reports incorrectly flag IP addresses that are actually owned by your organization. 

This can, for example, happen when: 

* A user in your Boston office has signed in remotely to your data center in San Francisco triggers the “Sign ins from multiple geographies” report 
* A user of your organization tries to sign-on several times with an incorrect password triggers the “Sign ins from IP addresses with suspicious activity” report 

To prevent these cases from generating misleading security reports, you should add known IP address ranges to the list of your organization's public IP address.    

### To add your organization’s public IP address ranges, perform the following steps:

1. Sign-on to the [Azure management portal](https://manage.windowsazure.com).

2. In the left pane, click **Active Directory**. 

	![Known networks](./media/active-directory-known-networks/known-netwoks-01.png)

3. In the **Directory** tab, select your directory.

4. In the menu on the top, click **Configure**. 

	![Known networks](./media/active-directory-known-networks/known-netwoks-02.png)

5. On the Configure tab, go to **your organizations public IP address ranges** 

	![Known networks](./media/active-directory-known-networks/known-netwoks-03.png)

6. Click **Add Known IP Address Ranges**.

7. Add your address ranges in the dialog box that appears, and then click the check button  when you are done. 

	![Known networks](./media/active-directory-known-networks/known-netwoks-04.png)

**Additional resources:**

* [View your access and usage reports](active-directory-view-access-usage-reports.md)
* [Sign ins from IP addresses with suspicious activity](active-directory-reporting-sign-ins-from-ip-addresses-with-suspicious-activity.md)
* [Sign ins from multiple geographies](active-directory-reporting-sign-ins-from-multiple-geographies.md)

