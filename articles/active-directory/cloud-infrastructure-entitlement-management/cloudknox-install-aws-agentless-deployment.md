---
title: Install CloudKnox Permissions Management (CloudKnox) with an Amazon Web Services (AWS) role (agentless deployment)
description: How to install CloudKnox with Amazon Web Services (AWS) role (agentless deployment).
services: active-directory
manager: karenh444
ms.service: active-directory
ms.topic: overview
author: Yvonne-deQ
ms.date: 12/03/2021
ms.author: v-ydequadros
---

# Install CloudKnox Permissions Management (CloudKnox) with an Amazon Web Services (AWS) role (agentless deployment)

This topic describes the process of installing and configuring CloudKnox with an AWS role. The process described in this topic applies only to an agentless deployment.

## Configure an AWS cross-account role (FortSentry UI)

1. Log in to the CloudKnox admin console.

2. To open the data sources page, click **Dashboard**.

3. In the **Data Collectors** menu option, click **Deploy**. 

4. Select **Using AWS Role**.

5. Enter the custom role name for the cross-account role or accept the default value: *ck-xact-role*.

6. Enter the accountID for all the account you want CloudKnox to monitor.

7. If you have set up all CloudTrail logs to go into a central S3 account, select **Yes**, otherwise select **No**.

8. If you are not using a central S3 account, download the **CloudFormation** template.

9. If there is a centralized account to collect S3 logs, enter the details and download the templates for that account and the cross-account role for each member account that CloudKnox will monitor.

10. Install the CloudFormation templates (CFT) to create all cross-account roles.

## Next Steps

[Sentry Installation - AWS](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20AWS%20bef8e66cf2834aa69867b628f4b0a203.html)

[CloudKnox FortSentry Registration](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/CloudKnox%20FortSentry%20Registration%20f9f85592b2cf48aca0c0effd604a0827.html)




<!---Refer to original file for more info: https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Product%20Manual%20c971e817e9c04741b196eb35b32115a2/Install%20CloudKnox%20with%20AWS%20role%20(agentless%20deploym%20a6b50c42b2d046829f29002726e267c9.html)--->