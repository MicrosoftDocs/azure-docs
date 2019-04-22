---
title: Azure Stack log and data handling | Microsoft Docs
description: Learn about how Azure Stack collects information.  
services: azure-stack
documentationcenter: ''
author: PatAltimore
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/14/2019
ms.author: PatAltimore
ms.reviewer: chengwei
ms.lastreviewed: 02/14/2019

---
# Azure Stack log and customer data handling 
*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*  

To the extent Microsoft is a processor or subprocessor of personal data in connection with Azure Stack, Microsoft makes to all customers, effective May 25, 2018, the commitments in (a) in the “Processing of Personal Data; GDPR” provision of the “Data Protection Terms” section of the [Online Services Terms](https://nam06.safelinks.protection.outlook.com/?url=http%3A%2F%2Fwww.microsoftvolumelicensing.com%2FDocumentSearch.aspx%3FMode%3D3%26DocumentTypeId%3D31&data=02%7C01%7Ccomartin%40microsoft.com%7Ce2ce478261764c79c3f308d68df01136%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C636852459551078818&sdata=cpWsfZTBHpqEFr50DWQOryq342U8shgeFgMXVPQz5ug%3D&reserved=0) and (b) in the European Union General Data Protection Regulation Terms in Attachment 4 of the [Online Services Terms](https://nam06.safelinks.protection.outlook.com/?url=http%3A%2F%2Fwww.microsoftvolumelicensing.com%2FDocumentSearch.aspx%3FMode%3D3%26DocumentTypeId%3D31&data=02%7C01%7Ccomartin%40microsoft.com%7Ce2ce478261764c79c3f308d68df01136%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C636852459551088813&sdata=bv1CBiaCnYmjiv6S0dFCbWEd4fNCkPBjBwgylNa%2FNt0%3D&reserved=0). 

As Azure Stack resides in customer datacenters, Microsoft is the Data Controller solely of the data that is shared with Microsoft through [Diagnostics](azure-stack-diagnostics.md), [Telemetry](azure-stack-telemetry.md), and [Billing](azure-stack-usage-reporting.md).  

## Data access controls 
Microsoft employees, who are assigned to investigate a specific support case, will be granted read-only access to the encrypted data. Microsoft employees also have access to tools that can be used to delete the data if needed. All access to the customer data is audited and logged.  

Data access controls:
1.	Data is only retained for a maximum of 90 days after case close.
2.	The customer always has the choice to have the data removed at any time in that 90-day period.
3.	Microsoft employees are given access to the data on a case-by-case basis and only as needed to help resolve the support issue. 
4.	In the event where Microsoft must share customer data with OEM partners, customer consent is mandatory.  

### What Data Subject Requests (DSR) controls do customers have?
As mentioned earlier, Microsoft supports on-demand data deletion per customer request. Customers can request that our support engineer delete all their logs for a given case at any time of the customer’s choosing, before the data is permanently erased.  

### Does Microsoft notify customers when the data is deleted?
For the automated data deletion action (90 days after case close), we do not proactively reach out to customers and notify them about the deletion. 

For the on-demand data deletion action, Microsoft support engineer has access to the tool where they can initiate the data deletion on demand and they can provide confirmation on the phone with the customer when it’s done.

## Diagnostic data
As part of the support process, Azure Stack Operators can [share diagnostic logs](azure-stack-diagnostics.md) with Azure Stack support and engineering teams to facilitate troubleshooting.

Microsoft provides a tool and script for customers to collect and upload requested diagnostic log files. Once collected, the log files are transferred over an HTTPS protected encrypted connection to Microsoft. Because HTTPS provides the encryption over the wire, there is no password needed for the encryption in transit. After they are received, logs are encrypted and stored until they are automatically deleted 90 days after the support case is closed.

## Telemetry data
[Azure Stack telemetry](azure-stack-telemetry.md) automatically uploads system data to Microsoft via the Connected User Experience. Azure Stack Operators have controls to customize telemetry features and privacy settings at any time.

Microsoft doesn't intend to gather sensitive data, such as credit card numbers, usernames and passwords, email addresses, or similar sensitive information. If we determine that sensitive information has been inadvertently received, we delete it. 

## Billing data
[Azure Stack Billing](azure-stack-usage-reporting.md) leverages global Azure’s Billing and Usage pipeline and is therefore in alignment with Microsoft compliance guidelines.

Azure Stack Operators can configure Azure Stack to forward usage information to Azure for billing. This is required for Multi-Node Azure Stack customers who choose pay-as-you-use billing model. Usage reporting is controlled independently from telemetry and is not required for Multi-Node customers who choose the capacity model or for Azure Stack Development Kit users. For these scenarios, usage reporting can be turned off using [the registration script](azure-stack-usage-reporting.md).


## Next steps 
[Learn more about Azure Stack security](azure-stack-security-foundations.md) 
