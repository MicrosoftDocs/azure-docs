---
title: Tasks allowed in different states or statuses in BizTalk Services | Microsoft Docs
description: 'The actions/operations allowed in different MABS status: stop, start, restart, suspend, resume, delete, scale, update configuration, and backing up'
services: biztalk-services
documentationcenter: ''
author: MandiOhlinger
manager: anneta
editor: ''

ms.assetid: aea738f3-ec76-4099-a41b-e17fea9e252f
ms.service: biztalk-services
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/08/2016
ms.author: mandia

---
# What you can and can't do using the BizTalk Service state

> [!INCLUDE [BizTalk Services is being retired, and replaced with Azure Logic Apps](../../includes/biztalk-services-retirement.md)]

Depending on the current state of the BizTalk service, there are operations that you can or cannot perform on the BizTalk service.

For example, you provision a new BizTalk service in the Azure classic portal. When it completes successfully, the BizTalk service is in `active` state. In the active state, you can stop, suspend, and delete the BizTalk service. If you stop the BizTalk service, and stop fails, then the BizTalk service goes to a `StopFailed` state. In the `StopFailed` state, you can restart the BizTalk service. If you try an operation that is not allowed, like resume, the following error occurs:

`Operation not allowed`

## View the possible states

The following tables list the operations or actions that can be done when the BizTalk Service is in a specific state. A ✔ means the operation is allowed while in that state. A blank entry means the operation cannot be performed while in that state.

| Service state | Start | Stop | Restart | Suspend | Resume | Delete | Scale | Update <br/> Configuration | Backup |
| --- | --- | --- | --- | --- | --- | --- |--- | --- | --- |
| Active |  | ✔ | ✔ | ✔ |  | ✔ |✔ |✔ |✔ |
| Disabled |  |  |  |  |  | ✔ | |  |  | 
| Suspended |  |  |  |  | ✔ | ✔ | |  | ✔ |
| Stopped | ✔ |  | ✔ |  |  | ✔ | |  | ✔ |
| Service Update Failed |  |  |  |  |  | ✔ | |  |  | 
| DisableFailed |  |  |  |  |  | ✔ | |  |  | 
| EnableFailed |  |  |  |  |  | ✔ | |  |  | 
| StartFailed <br/> StopFailed <br/> RestartFailed | ✔ | ✔ | ✔ |  |  | ✔ | | ✔ | |
| SuspendedFailed <br/> ResumeFailed|  |  |  | ✔ | ✔ | ✔ | |  |  | 
| CreatedFailed <br/> RestoreFailed |  |  |  |  |  | ✔ | |  |  | 
| ConfigUpdateFailed  |  |  | ✔ |  |  | ✔ | |✔ | |
| ScaleFailed |  |  |  |  |  | ✔ |✔ | |  |  | 



## See Also
* [Create a BizTalk Service using the Azure classic portal](http://go.microsoft.com/fwlink/p/?LinkID=302280)<br/>
* [What you can do in the dashboard, monitor and scale tabs in BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=302281)<br/>
* [What you get with the Developer, Basic, Standard, and Premium editions in BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=302279)<br/>
* [How to back up and restore a BizTalk Service](http://go.microsoft.com/fwlink/p/?LinkID=329873)<br/>
* [Throttling explained in BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=302282)<br/>
* [Retrieve the Service Bus and Access Control issuer name and issuer key values for your BizTalk Service](http://go.microsoft.com/fwlink/p/?LinkID=303941)<br/>
* [How do I Start Using the Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)

