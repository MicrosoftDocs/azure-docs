---
title: SKU series unavailable | Microsoft Docs
description: Some SKU series are unavailable for the selected subscription for this region.
services: Azure Supportability
documentationcenter: ''
author: stevendotwang
manager: "rajatk"
editor: ''


ms.service: azure-supportability
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/09/2017
ms.author: xingwan

---
# Region or SKU unavailable
This article describes how to resolve the issue of an Azure subscription not having access to a region or a VM SKU.

## Symptoms

### When deploying a virtual machine, you receive one of the following error messages:
```
Code: SkuNotAvailable
Message: The requested size for resource '<resource>' is currently not available in location 
'<location>' zones '<zone>' for subscription '<subscriptionID>'. Please try another size or 
deploy to a different location or zones. See https://aka.ms/azureskunotavailable for details.
```

```
Message: Your subscription doesn’t support virtual machine creation in <location>. Choose a 
different location. Supported locations are <list of locations>
```

```
Code: NotAvailableForSubscription
Message: This size is currently unavailable in this location for this subscription
```

### When purchasing Reserved Virtual Machine Instances, you receive one of the following error messages:

```
Message: Your subscription doesn’t support virtual machine reservation in <location>. Choose a 
different location. Supported locations are: <list of locations>  
```

```
Message: This size is currently unavailable in this location for this subscription
```

### When creating a support request to increase compute core quota, a region or a SKU family is not available for selection.

## Solution
We first recommend that you consider an alternative region or SKU that meets your business needs. If you’re unable to find a suitable region or SKU, create a "Subscription Management" [support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) following the steps below:


- On the Basics page, select Issue type as "Subscription Management", select the subscription and click "Next".

![Basics blade](./media/SKU-series-unavailable/BasicsSubMgmt.png)


-	On the Problem page, select the Problem type as “Other General Questions”.
- In the Details section:
  - Please indicate if you’re looking to deploy virtual machines or purchase Reserved Virtual Machine Instances
  - Please specify the region, SKU, and the number of virtual machine instances that you're planning to deploy or purchase


![Problem](./media/SKU-series-unavailable/ProblemSubMgmt.png)

-	Enter your contact details and click "Create".

![Contact Information](./media/SKU-series-unavailable/ContactInformation.png)

## Feedback
We are always open to feedback and suggestions! Send us your [suggestions](https://feedback.azure.com/forums/266794-support-feedback). Additionally, you can engage with us via [Twitter](https://twitter.com/azuresupport) or the [MSDN forums](https://social.msdn.microsoft.com/Forums/azure).

## Learn more
[Azure Support FAQ](https://azure.microsoft.com/support/faq)

