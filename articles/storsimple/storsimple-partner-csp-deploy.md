---
title: Microsoft Azure StorSimple and Cloud Solutions Provider Program Overview | Microsoft Docs
description: An overview about the StorSimple and CSP for StorSimple partners.
services: storsimple
documentationcenter: NA
author: alkohli
manager: timlt
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 02/08/2017
ms.author: alkohli
---

# Deploy StorSimple Virtual Array for Cloud Solution Provider Program

## Overview

StorSimple Virtual Array can be deployed by the Cloud Solution Provider (CSP) partners for their customers. A CSP partner can create a StorSimple Device Manager service. This service can then be used to deploy and manage StorSimple Virtual Array and the associated shares, volumes, and backups.

This article describes how a CSP partner can add a customer or a new subscription to an existing customer and then create a service to deploy a StorSimple Virtual Array in CSP.

## Prerequisites

Before you begin, ensure that:

- You are enrolled under the CSP program.
- You have valid [Partner Center](https://partnercenter.microsoft.com/) login credentials. The credentials enable you to sign in to the Partner portal to add new customers, search for customers, or navigate to a customer account from the Partner dashboard. The CSP can function as a StorSimple administrator on behalf of the customer in the Azure portal.
                             
## Add a customer

If you add a customer, a subscription is automatically created. To add a customer (and automatically create a subscription), perform the following steps in the Partner portal.

1. Go to the [Partner Center](https://partnercenter.microsoft.com/) and sign in using your CSP credentials. Click **Dashboard**.

     ![Dashboard in Partner Center](./media/storsimple-partner-csp-deploy/image1.png)
                              
2. In the left-pane, click **Customers**. In the right-pane, click **Add customers**. Enter the details of the customer. Click **Next: Subscriptions** to create a customer subscription.

    ![Add customer](./media/storsimple-partner-csp-deploy/image2.png)

3.  Select **Microsoft Azure** offer. Scroll to the bottom of the page and click **Review**.

    ![Review subscription information](./media/storsimple-partner-csp-deploy/image3.png)
                              
4. Review the information and click **Submit**.

    ![Submit subscription](./media/storsimple-partner-csp-deploy/image4.png)

5. Save the confirmation information for future reference.

    ![Save confirmation](./media/storsimple-partner-csp-deploy/image5.png)

6. Find or navigate to the customer you just added. Click the **Company name** to drill down into the details.

    ![Search for the customer](./media/storsimple-partner-csp-deploy/image6.png)  

7. In the left-pane, select **Service management**. In the right-pane, under **Administer services**, click **Microsoft Azure Management Portal** to sign in as an Azure administrator for your customer.

    ![Log in to Azure portal](./media/storsimple-partner-csp-deploy/image9.png)

8. To create a StorSimple Device Manager, click **+ New** and search for or navigate to **StorSimple Virtual Device Series**. For more information, go to [Deploy a StorSimple Device Manager service](storsimple-virtual-array-manage-service.md).

    ![Create StorSimple Device Manager service](./media/storsimple-partner-csp-deploy/image8.png)


## Add a subscription

In some instances, you may have an existing customer, and you need to add a subscription. To add a subscription to an existing customer, perform the following steps in the Partner portal.

1. Go to the [Partner Center](https://partnercenter.microsoft.com/) and sign in using your CSP credentials. Click **Dashboard**.

     ![Dashboard in Partner Center](./media/storsimple-partner-csp-deploy/image1.png)
                              
2. In the left-pane, click **Customers**. Find or navigate to the customer you want to add a subscription to. Click the ![Expand check icon](./media/storsimple-partner-csp-deploy/expand_pane_icon.png) icon to expand the row for the company name for your customer. In the details, click **Add subscriptions**.

    ![Customers](./media/storsimple-partner-csp-deploy/image10.png)

3. Check **Microsoft Azure** for the **Top offers** in the subscription and click **Submit**. This creates a new subscription.

    ![Add new subscription](./media/storsimple-partner-csp-deploy/image11.png)

6. After a new subscription is created, click **<-- Customers** in the left-pane to return to the **Customers** page. Search for the customer for whom you just created a subscription. Click the **Company name** to drill down into the details.

    ![Search for the customer](./media/storsimple-partner-csp-deploy/image6.png)  

7. In the left-pane, select **Service management**. In the right-pane, under **Administer services**, click **Microsoft Azure Management Portal** to sign in as an Azure administrator for your customer.

    ![Log in to Azure portal](./media/storsimple-partner-csp-deploy/image9.png)

8. To create a StorSimple Device Manager, click **+ New** and search for or navigate to **StorSimple Virtual Device Series**. For more information, go to [Deploy a StorSimple Device Manager service](storsimple-virtual-array-manage-service.md).

    ![Create StorSimple Device Manager service](./media/storsimple-partner-csp-deploy/image8.png)

## Next steps

- If you have more questions regarding the StorSimple in CSP, go to [StorSimple in CSP: Frequently asked questions](storsimple-partner-csp-faq.md).
- If you are ready to deploy your StorSimple, go to [Deploy your StorSimple in CSP](storsimple-partner-csp-deploy.md).
