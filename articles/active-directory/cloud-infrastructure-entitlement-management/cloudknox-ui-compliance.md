---
title: Microsoft CloudKnox Permissions Management Compliance dashboard
description: How to use the Microsoft CloudKnox Permissions Management Compliance dashboard.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 01/03/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management Compliance dashboard

The Microsoft CloudKnox Permissions Management **Compliance** dashboard provides an overview of how you are complying with national, regional, and industry-specific requirements governing the collection and use of data.

This topic provides an overview of the components of the **Compliance** dashboard.

## The Filter toolbar

- The **Filter** toolbar displays the following options:
    - **Compliance Standard** provides the following options:
        - **AWS Well Architected** - The Amazon Web Services (AWS) Well-Architected Framework
        - **CIS Benchmarks** - Center for Internet Security (CIS) Benchmarks standard
        - **NIST 800-53** - Next Generation Security and Privacy (NIST) 800-53
        - **PCI DSS Benchmarks** - Payment Card Industry / Data Security Standards (PCI DSS) benchmark frameworks

    - **Authorization System Type** provides a drop down list of authorization system types you can access. The options may include:
        - **Amazon Web Services (AWS)**
        - **Microsoft Azure (Azure)**
        - **Google Cloud Platform (GCP)**

- **Search** - Enter criteria to search for the required authorization system.
 
## The Compliance dashboard

The **Compliance** dashboard displays the following information:

- The first box displays a percentage and a rating that represents how many compliance recommendations were made for the selected compliance standard. It also displays how many recommendations were passed at the date shown.
- The middle box on the dashboard display is a graph displaying any changes to the recommendations that were passed in the last week.
- The last box on the dashboard displays the date range for which the information is displayed.

## Reference information

### Amazon Web Services (AWS)

If the recommendation has been further categorized in the standard, a **Priority** status displays for that category. You can select on the details in the boxes to view select details. For example, select the number under **Priority 1** to display only the recommendations in which a resource passed.

If the recommendation has been further categorized in the standard, a **Pass**/**Fail** status displays for that category. You can select on the details in the boxes to view select details. For example, select the number under **Passed** to display only the recommendations in which a resource passed.

### Payment Card Industry/Data Security Standards (PCI DSS) Benchmarks

If the recommendation has been further categorized in the standard, a **Priority** status displays for that category. You can select on the details in the boxes to view select details. For example, select the number under **Priority 1** to view only the recommendations in which a resource passed.

### Microsoft Azure Well-Architected Framework

If the recommendation has been further categorized in the standard, a **Priority** status displays for that category. You can select on the details in the boxes to view select details. For example, select the number under **Priority 1** to view only the recommendations in which a resource passed.



<!---## Next steps--->