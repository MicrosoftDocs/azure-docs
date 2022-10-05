---
title: Create and manage downloadable access review history report - Azure Active Directory
description: Using Azure Active Directory access reviews, you can download a review history for access reviews in your organization.
services: active-directory
documentationcenter: ''
author: amsliu
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 02/18/2022
ms.author: amsliu
---

# Create and manage downloadable access review history report in Azure AD access reviews

With Azure Active Directory (Azure AD) Access Reviews, you can create a downloadable review history to help your organization gain more insight. The report pulls the decisions that were taken by reviewers when a report is created. These reports can be constructed to include specific access reviews, for a specific time frame, and can be filtered to include different review types and review results.
 
## Who can access and request review history

Review history and request review history are available for any user if they're authorized to view access reviews. To see which roles can view and create access reviews, see [What resource types can be reviewed?](deploy-access-reviews.md#what-resource-types-can-be-reviewed). Global Administrator and Global Reader can see all access reviews. All other users are only allowed to see reports on access reviews that they've generated.

## How to create a review history report

**Prerequisite role:** All users authorized to view access reviews

1. In the Azure portal, select **Azure Active Directory** and then select **Identity Governance**.

1. In the left menu, under **Access Reviews** select **Review history**.
 
1. Select **New report**. 

1. Specify a review start and end date.

1. Select the review types and review results you want to include in the report. 

    ![Access Reviews - Access Review History Report - Create](./media/access-reviews-downloadable-review-history/create-review-history.png)

1. Then select **create** to create an Access Review History Report.

## How to download review history reports

Once a review history report is created, you can download it. All reports that are created are available for download for 30 days in CSV format.

1. Select **Review History** under **Identity Governance**. All review history reports that you created will be available. 
1. Select the report you wish to download. 

## What is included in a review history report?

The reports provide details on a per-user basis showing the following:

| Element name | Description |
| --- | --- |
| AccessReviewId |	Review object id |
| AccessReviewSeriesId |	Object id of the review series, if the review is an instance of a recurring review. If a one-time review, the value will be am empty GUID. |
| ReviewType | Review types include group, application, Azure AD role, Azure role, and access package|
|ResourceDisplayName | Display Name of the resource being reviewed |
| ResourceId | Id of the resource being reviewed |
| ReviewName |	Name of the review |
| CreatedDateTime |	Creation datetime of the review |
| ReviewStartDate |	Start date of the review
| ReviewEndDate | End date of the review |
| ReviewStatus | Status of the review. For all review statuses, see the access review status table [here](create-access-review.md) |
| OwnerId | Reviewer owner ID |
| OwnerName | Reviewer owner name |
| OwnerUPN | Reviewer owner User Principal Name |
| PrincipalId | Id of the principal being reviewed |
| PrincipalName | Name of the principal being reviewed |
| PrincipalUPN | Principal Name of the user being reviewed |
| PrincipalType | Type of the principal. Options include user, group, and service principal |
| ReviewDate | Date of the review |
| ReviewResult | Review results include Deny, Approve, and Not reviewed |
|Justification | Justification for review result provided by reviewer |
| ReviewerId | Reviewer Id |
| ReviewerName | Reviewer Name |
| ReviewerUPN | Reviewer User Principal Name |
| ReviewerEmailAddress | Reviewer email address |
| AppliedByName | Name of the user who applied the review result |
| AppliedByUPN | User Principal Name of the user who applied the review result|
| AppliedByEmailAddress | Email address of the user who applied the review result |
| AppliedDate | Date when the review result were applied |
| AccessRecommendation | System recommendations include Approve, Deny, and No Info |
|SubmissionResult | Review result submission status include applied, and not applied. |

## Next steps
- [Review access to groups or applications](perform-access-review.md)
- [Review access for yourself to groups or applications](review-your-access.md)
- [Complete an access review of groups or applications](complete-access-review.md)
