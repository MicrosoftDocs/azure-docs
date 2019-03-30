---
title: Secure Azure Data Lake Analytics for multiple users
description: Learn how to configure multiple users to run jobs in Azure Data Lake Analytics.
ms.service: data-lake-analytics
services: data-lake-analytics
author: matt1883
ms.author: mahi

ms.reviewer: jasonwhowell
ms.topic: conceptual
ms.date: 05/30/2018
---
# Configure user access to job information to job information in Azure Data Lake Analytics 

In Azure Data Lake Analytics, you can use multiple user accounts or service principals to run jobs. 

In order for those same users to see the detailed job information, the users need to be able to read the contents of the job folders. The job folders are located in `/system/` directory. 

If the necessary permissions are not configured, the user may see an error: `Graph data not available - You don't have permissions to access the graph data.` 

## Configure user access to job information

You can use the **Add User Wizard** to configure the ACLs on the folders. For more information, see [Add a new user](data-lake-analytics-manage-use-portal.md#add-a-new-user).

If you need more granular control, or need to script the permissions, then secure the folders as follows:

1. Grant **execute** permissions (via an access ACL) on the root folder:
   - /
   
2. Grant **execute** and **read** permissions (via an access ACL and a default ACL) on the folders that contain the job folders. For example, for a specific job that ran on May 25, 2018, these folders need to be accessed:
   - /system
   - /system/jobservice
   - /system/jobservice/jobs
   - /system/jobservice/jobs/Usql
   - /system/jobservice/jobs/Usql/2018
   - /system/jobservice/jobs/Usql/2018/05
   - /system/jobservice/jobs/Usql/2018/05/25
   - /system/jobservice/jobs/Usql/2018/05/25/11
   - /system/jobservice/jobs/Usql/2018/05/25/11/01
   - /system/jobservice/jobs/Usql/2018/05/25/11/01/b074bd7a-1448-d879-9d75-f562b101bd3d

## Next steps
[Add a new user](data-lake-analytics-manage-use-portal.md#add-a-new-user)
