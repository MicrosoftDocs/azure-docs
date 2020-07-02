---
title: Configure Lockbox for Azure Data Box
description: Learn how to use Customer Lockbox with Azure Data Box.
services: databox
author: alkohli
ms.service: databox
ms.topic: how-to
ms.date: 07/02/2020
ms.author: alkohli
ms.subservice: pod
---

# Use Customer Lockbox for Azure Data Box (Preview)

Azure Data Box is used to transfer customer data to and from Azure. There are instances where Microsoft Support may need to access customer data during a Support request. You can use Customer Lockbox as an interface to review and approve or reject these data access requests. 

This article covers how Customer Lockbox requests are initiated and tracked for Data Box import as well as export orders. The article applies to both Azure Data Box devices and Azure Data Box Heavy devices. 


## Prerequisites

Before you begin, make sure:

1. You have created an Azure Data Box import order as per the instructions in [Tutorial: Order Azure Data Box](data-box-deploy-ordered.md).

2. You have configured Customer Lockbox for Data Box. This is an opt-in service. 

    1. Customer Lockbox is currently in preview for Data Box service. To enable Customer Lockbox for Data Box for your organization, sign up for [Customer Lockbox for Azure Public Preview](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR_Kwz02N6XVCoKNpxIpqE_hUNzlTUUNYVkozOVlFNVRSWDVHRkkwTFQyViQlQCN0PWcu).
    2. Customer Lockbox is automatically available for all customers who have an Azure support plan with a minimal level of Developer. <!--How do you enable Lockbox? change this for Azure Data Box, perhaps you need a different support plan When you have an eligible support plan, no action is required by you to enable Customer Lockbox. Customer Lockbox requests are initiated by a Microsoft engineer if this action is needed to progress a support ticket that is filed from somebody in your organization.-->

3. A service request or a  Support ticket is already opened for this issue. For information on support ticket, see [File a service request for Data Box](data-box-disk-contact-microsoft-support.md).


## Access customer data

Microsoft does not typically access customer data. For Data Box, the following are the most common cases where there is a need to access customer data: 

- Prepare to ship step was not run.
- The data was copied in the wrong folder.
- The data is copied in an incorrect format.

In these cases, Microsoft will try to access your data in the Azure datacenter and will require your explicit consent to access the data. The access is requested and tracked via the Customer Lockbox interface if you have enabled Lockbox. 

If you have not enabled Lockbox, then your consent is not needed to access the data.


## Initiate request via Lockbox

 To create a request to access customer data, these steps are followed:

1. Typically a customer initiates a service request via Lockbox. However, for Data Box, if Microsoft detects that there is an issue during the upload or download of the data at Azure datacenter, Microsoft Support reaches out to the customer. For example, if the Data Box order was halted during the **Data Copy** stage, Data Box Support will initiate a Customer Lockbox request. 
 
2. The support engineer first tries to troubleshoot the issue by using standard tools and telemetry. If the support engineer accessed the Data Box through support session and the disks are locked and shares are not accessible, then the Support engineer creates a Lockbox request. 

    When the request is created, usually the notification goes to the admin of the subscription but you can also configure a group for notifications. 

4. The lockbox request shows up in the Azure portal for customer approval. 

    ![Request in Azure portal](./media/data-box-customer-lockbox/3-lockbox-request-azure-portal.png)

    To approve the lockbox request from portal, you can select **Approve**.

    ![Approve request](./media/data-box-customer-lockbox/4-lockbox-request-details-azure-portal.png)


5. Once the request is approved, the support engineer can access the device. The support engineer then validates that the device disks are unlocked and shares can be accessed in the support session.

7. The support engineer resolves the upload issue and then disables the support session.

After the issue is resolved, the data copy job will progress to completion.


## Next steps

- [Customer Lockbox for Microsoft Azure](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview)
- [Approve, audit support access requests to VMs using Customer Lockbox for Azure](https://azure.microsoft.com/blog/approve-audit-support-access-requests-to-vms-using-customer-lockbox-for-azure/)



<!--This request is for **Unlock Data Box operation** and the resource type is **ACIS**.-->

<!--![Create JIT request to unlock Data Box](./media/data-box-customer-lockbox/1-lockbox-jit-request.png)

The request takes time to approve. Select **Submit**.

![JIT approval wait time notification](./media/data-box-customer-lockbox/2-lockbox-jit-approval-wait.png)-->