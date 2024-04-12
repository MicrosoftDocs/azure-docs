---
title: Configure Lockbox for Azure Data Box
description: Learn how to use Customer Lockbox with Azure Data Box.
services: databox
author: stevenmatthew
ms.service: databox
ms.topic: how-to
ms.date: 07/10/2020
ms.author: shaas
ms.subservice: pod
---

# Use Customer Lockbox for Azure Data Box (Preview)

Azure Data Box is used to transfer customer data to and from Azure. There are instances where Microsoft Support may need to access customer data during a Support request. You can use Customer Lockbox as an interface to review and approve or reject these data access requests. 

This article covers how Customer Lockbox requests are initiated and tracked for Data Box import as well as export orders. The article applies to both Azure Data Box devices and Azure Data Box Heavy devices. 

## DevOps workflow for data access

The Support and Data Box Operations team at Microsoft typically does not  access customer data. They try to resolve issues by using standard tools and telemetry. <!--The only scenarios where there is a need to access customer data is when there is an issue with the data that needs to be fixed. For example, if the data is copied to a wrong folder or is in an incorrect format and is likely to result in an upload or download failure, then Microsoft will try to access your data in the Azure datacenter.--> 

If the issues can’t be resolved and require Microsoft Support to investigate or repair data, they request elevated access via Just in Time (JIT) portal. The JIP portal validates permission level, provides multi-factor authentication and also includes an approval from the Internal Microsoft Approvers. For example, the approver could be DevOps Manager. 

After your request for elevated access is approved via the JIT portal, if you have enabled Lockbox, Microsoft will also require your explicit consent to access the data. The access is requested and tracked via the Customer Lockbox service in the portal. 

If you have not enabled Lockbox, then your consent is not needed to access the data.


## Prerequisites for access request

Before you begin, make sure:

1. You have created an Azure Data Box order as per the instructions in:
    1. [Tutorial: Order Azure Data Box](data-box-deploy-ordered.md) for import orders.
    1. [Tutorial: Order Azure Data Box](data-box-deploy-export-ordered.md) for export orders.

2. You have configured Customer Lockbox for Data Box. This is an opt-in service. 

    1. Customer Lockbox is currently in preview for Data Box service. To enable Customer Lockbox for Data Box for your organization, sign up for [Customer Lockbox for Azure Public Preview](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR_Kwz02N6XVCoKNpxIpqE_hUNzlTUUNYVkozOVlFNVRSWDVHRkkwTFQyViQlQCN0PWcu).
    2. Customer Lockbox is automatically available for all customers who have an Azure support plan with a minimal level of Developer. <!--How do you enable Lockbox? change this for Azure Data Box, perhaps you need a different support plan When you have an eligible support plan, no action is required by you to enable Customer Lockbox. Customer Lockbox requests are initiated by a Microsoft engineer if this action is needed to progress a support ticket that is filed from somebody in your organization.-->

3. A service request or a  Support ticket is already opened for this issue. For information on support ticket, see [File a service request for Data Box](data-box-disk-contact-microsoft-support.md).


## Track, approve request via Lockbox

To track and approve a request to access customer data, follow these steps:

1. Microsoft detects that there is an issue during the upload or download of the data at Azure datacenter. For example, the Data Box order is halted during the **Data Copy** stage. 

    The support engineer connects to Data Box via Support session and tries to troubleshoot the issue by using standard tools and telemetry. If the Data Box disks are locked and shares are not accessible, then the Support engineer creates a Lockbox request. 
 
2. When the request is created, usually the notification goes to subscription administrator but you can also configure a group for notifications. 

3. You can see the lockbox request in the Azure portal for your approval. 

    ![Request in Azure portal](./media/data-box-customer-lockbox/3-lockbox-request-azure-portal.png)

    To approve the lockbox request from portal, you can select **Approve**.

    ![Approve request](./media/data-box-customer-lockbox/4-lockbox-request-details-azure-portal.png)


    Once the request is approved, the device disks are unlocked and shares are accessible in the support session.

4. The support engineer resolves the upload issue and then disables the support session.

After the issue is resolved, the data copy job will progress to completion.


## Next steps

- [Customer Lockbox for Microsoft Azure](../security/fundamentals/customer-lockbox-overview.md)

<!--- [Approve, audit support access requests to VMs using Customer Lockbox for Azure](https://azure.microsoft.com/blog/approve-audit-support-access-requests-to-vms-using-customer-lockbox-for-azure/)-->