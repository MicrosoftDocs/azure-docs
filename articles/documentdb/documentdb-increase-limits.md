---
title: Request increased DocumentDB account quotas | Microsoft Docs
description: Learn how to request an adjustment to DocumentDB database quotas such as document storage and throughput per collection.
services: documentdb
author: AndrewHoh
manager: jhubbard
editor: monicar
documentationcenter: ''

ms.assetid: 68f7dc8d-534f-4301-a42c-bcd1bb1b77fe
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/25/2016
ms.author: anhoh

---
# Request increased DocumentDB account quotas
[Microsoft Azure DocumentDB](https://azure.microsoft.com/services/documentdb/) has a set of default quotas that can be adjusted by contacting Azure support.  This article shows how to request a quota increase.

After reading this article, you'll be able to answer the following questions:  

* Which DocumentDB database quotas can be adjusted by contacting Azure support?
* How can I request a DocumentDB account quota adjustment?

## <a id="Quotas"></a> DocumentDB account quotas
The following table describes the DocumentDB quotas. The quotas that have an asterisk (*) can be adjusted by contacting Azure support:

[!INCLUDE [azure-documentdb-limits](../../includes/azure-documentdb-limits.md)]

## <a id="RequestQuotaIncrease"></a> Request a quota adjustment
The following steps show how to request a quota adjustment.

1. In the [Azure portal](https://portal.azure.com), click **More Services**, and then click **Help + support**.
   
    ![Screenshot of launching help and support](media/documentdb-increase-limits/helpsupport.png)
2. In the **Help + support** blade, click **New support request**.
   
    ![Screenshot of creating a support ticket](media/documentdb-increase-limits/getsupport.png)
3. In the **New support request** blade, click **Basics**. Next, set **Issue type** to **Quota**, **Subscription** to your subscription that hosts your DocumentDB account, **Quota type** to **DocumentDB**, and **Support plan** to **Quota SUPPORT - Included**. Then, click **Next**.
   
    ![Screenshot of support ticket request type](media/documentdb-increase-limits/supportrequest1.png)
4. In the **Problem** blade, choose a severity and include information about your quota increase in **Details**. Click **Next**.
   
    ![Screenshot of support ticket subscription picker](media/documentdb-increase-limits/supportrequest2.png)
5. Finally, fill in your contact information in the **Contact information** blade and click **Create**.

Once the support ticket has been created, you should receive the support request number via email.  You can also view the support request by clicking **Manage support requests** in the **Help + support** blade.

![Screenshot of support requests blade](media/documentdb-increase-limits/supportrequest4.png)

## <a name="NextSteps"></a> Next steps
* To learn more about DocumentDB, click [here](http://azure.com/docdb).

