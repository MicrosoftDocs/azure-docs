---
title: Microsoft CloudKnox Permissions Management product compliance
description: How to read Microsoft CloudKnox Permissions Management's Compliance dashboard.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: conceptual
ms.date: 12/08/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management product compliance

## Introduction

Compliance is the state of being in accordance with various established guidelines or specifications.
CloudKnox currently supports the Center for Internet Security (CIS) Benchmarks standard, Amazon Web Services (AWS) Well-Architected Framework, Next Generation Security and Privacy (NIST) 800-53, and Payment Card Industry / Data Security Standards (PCI DSS) benchmark frameworks.

## How to read the Compliance dashboard

All accounts for the selected **Authorization System Type** display on the main **Compliance** page.

- To expand details about each compliance standard, click the toggle key.

     For more information about applying filters, see [How to apply filters]().

**Center for Internet Security (CIS) Benchmarks**

1. The first box displays a percentage and a rating that represents how many compliance recommendations were made for the selected compliance standard, and how many recommendations the account passed as of the current date shown.

     - To view the differentiators between the two levels, hover over the information **(i)** icon in the Level 1 and Level 2 boxes.

      > [!NOTE]
      > If the recommendation has been further categorized in the standard, a **Pass**/**Fail** status displays for that category. You can click on the details in the boxes to view select details. For example, click the number under **Passed** to display only the recommendations in which a resource passed.

2. The middle box on the dashboard display is a graph displaying any changes to the recommendations that were passed in the last week.

3. The last box on the dashboard displays the date range for which the information is displayed.

**Amazon Web Services (AWS) Well-Architected Framework**

1. The first box displays a percentage and a rating that represents how many compliance recommendations were made for the selected compliance standard, and how many recommendations the account passed as of the current date shown.

     > [!NOTE]
     > If the recommendation has been further categorized in the standard, a **Pass**/**Fail** status displays for that category. You can click on the details in this box to view select details. For example, click the number under **Passed** to display only the recommendations in which a resource passed.

2. The middle box on the dashboard display is a graph displaying any changes to the recommendations that were passed in the last week.

3. The last box on the dashboard displays the date range for which the information is displayed.

**Next Generation Security and Privacy (NIST) 800-53**

1. The first box displays a percentage and a rating that represents how many compliance recommendations were made for the selected compliance standard, and how many recommendations the account passed as of the current date shown.

     > [!NOTE]
     > If the recommendation has been further categorized in the standard, a **Priority** status displays for that category. You can click on the details in the boxes to view select details. For example, click the number under **Priority 1** to display only the recommendations in which a resource passed.

2. The middle box on the dashboard display is a graph displaying any changes to the recommendations that were passed in the last week.

3. The last box on the dashboard displays the date range for which the information is displayed.

**Payment Card Industry / Data Security Standards (PCI DSS) Benchmarks**

1. The first box displays a percentage and a rating that represents how many compliance recommendations were made for the selected compliance standard, and how many recommendations the account passed as of the current date shown.

     If the recommendation has been further categorized in the standard, a **Priority** status displays for that category. You can click on the details in the boxes to view select details. For example, clicking the number under **Priority 1** displays only the recommendations in which a resource passed.

2. The middle box on the dashboard display is a graph displaying any changes to the recommendations that were passed in the last week.

3. The last box on the dashboard displays the date range for which the information is displayed.

**Microsoft Azure Well-Architected Framework**

1. The first box displays a percentage and a rating that represents how many compliance recommendations were made for the selected compliance standard, and how many recommendations the account passed as of the current date shown.

     If the recommendation has been further categorized in the standard, a **Priority** status displays for that category. You have the option to click on the details in the boxes to view select details. For example, clicking the number under **Priority 1** displays only the recommendations in which a resource passed.

2. The middle box on the dashboard display is a graph displaying any changes to the recommendations that were passed in the last week.

3. The last box on the dashboard displays the date range for which the information is displayed.

## How to view recommendation details by account

1. Click the account name to open a detailed view of the recommendations with the following details:

     - **Ignore** – Users can toggle this option **On** or **Off** to ignore or view the recommendation.
       - When the recommendation is toggled to **Off**, a pop-up box opens asking the user if they are sure they want to turn off the recommendation and requires the user to input a reason. Click **Confirm** once a reason has been entered.
       - On the dashboard, the number of compliance recommendations will decrease by however many recommendations are switched to **Off.**
       - When turning the recommendation back on, a pop-up box opens asking the user to confirm they want to turn on the recommendation. Click **Confirm**.
       - Some items may not have the ability to be ignored and will be marked in the column as **Manual** because there are no tests that can be run to give a result on the item.
       - Some items do not have the ability to be scored because they are test items and will be marked in the column as **Not Scored**. These items are not counted in the recommendations.
      - **Recommendation** – Displays the summary describing the recommendation. The **Recommendation** sections vary slightly depending on which compliance standard and authorization system is being viewed.
      - **Result** – Displays the results of the recommendation, whether it has passed or failed. A green check mark displays when the recommendation passes and a red **X** if it has failed.
       - If the item is a manual item, a hand icon displays in this column.
       - If the item is one that cannot be scored, a document icon with a slash through it displays in this column.
      - **Profile** (CIS Benchmarks and NIST 800-53) – Displays the recommendation priority or level.
     - **Resources** – All recommendations are run against resources.
         - **Failed** – Displays how many resources failed the recommendation.
        - **Passed** – Displays how many resources passed the recommendation.
         - **Not Run** – Displays how many resources for which the recommendation was not run.

           A failure usually happens when the CloudKnox does not have sufficient privileges to access the resources.
      - **Ignored** – Displays how many resources the user decided to ignore or exclude from the recommendations.

## How to view details about a recommendation

1. To view details about a recommendation, see [How to view recommendation details by account]().

    - To navigate to the recommendation, click the recommendation name in the **Recommendation Name** column.

2. The top of the page displays the number of Resources are being tallied for this recommendation, and the number of resources that failed, passed, were not run and were ignored.

3. The table defaults to the **Results** tab, and displays the following details:
    - **Ignore** - You can check the box next to each line item to ignore the recommendation for a specific user or resource.

      - When the recommendation is checked, a pop-up box opens asking the user if they are sure they want to turn off the recommendation and requires the user to input a reason. 
        - Click **Confirm** once a reason has been entered.
        - Hover over the check mark in the Ignore column to view details of who ignored the resource, when they chose to ignore it, and the reason for ignoring it.

    - **Resources** – Displays the specific resource name captured under this recommendation.
    - **Resource Type** – Displays the type of resource, that is, **key** (encryption key) or **bucket** (storage).
    - **Region** (AWS Only) – Displays the region in which the resource is located such as US East.
    - **Result** – Displays either **(!) Failed** or **Success** for each resource.

       - Hover over the **(!) Failed** for details on why the resource failed the recommendation.

    - **Remediate** – If a recommendation can be remediated, the action for remediation is listed in this column.
        - Click the ellipses (**...**) to view available option for remediation, that is, disabling or deleting an access key.
        - Click the **Download** icon to download the script for remediation.
           - The **Script has been downloaded** message displays across the top of the screen if the download was successful.

        - Click the **Duplicate** icon to copy the value of the script to the clipboard.
             - The **Script copied to clipboard** message displays across the top of the screen if the value was copied successfully.

4. Click the **Description** tab to view full details on how to read, use, and remediate a recommendation.

### How to apply filters

There are several filtering options to choose from when filtering the recommendations. When you click a specific account, other filters (listed beginning on step 5) display. For more information, see [How to view Recommendation details by account]().

1. Click the funnel icon to apply filter options.

2. From the **Compliance Standard**, choose between **CIS Benchmarks**, **AWS Well-Architected**,  **NIST 800-53**, **PCI-DSS Benchmarks**, and **Azure Well-Architected**.

3. From the **Authorization System Type**, choose between **AWS**, **GCP**, **Azure**, and **VCENTER**.

4. From **Version**, choose a version to view.

5. From **Show Security Controls**, check **All** or select the specific CSC version you want to view.

     This control is only available for CIS Benchmark for AWS.

6. From **Test Results**, choose between **All**, **Passed**, **Failed**, **Not Scored**, or **Manual**.

7. From **Test Settings**, choose between **All**, **Tested**, **Ignored**, **Not Scored**, or **Manual**.

8. CIS Benchmarks and NIST 800-53 – From **Profiles**, choose between **All** and/or the various levels or priorities.

### How to search on the Compliance page

1. Click in the **Search for Authorization Systems...** box at the top of the page, and then enter your criteria.

2. To search for your criteria, press **Enter** or click **Search**. 

     The search results display on the screen. The top-right corner indicates **Showing 1 of XX** to let you know how many pages of results have been found and which page is currently displayed.

<!---## Next steps--->