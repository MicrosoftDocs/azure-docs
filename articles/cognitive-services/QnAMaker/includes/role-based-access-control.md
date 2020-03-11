---
title: include file
description: include file
ms.topic: include
ms.custom: include file
ms.date: 03/11/2020
---

The following roles are managed with the QnA Maker authentication key:

|Role|Type|Functionalities|API permissions|
|--|--|--|--|
|Owner|Authentication Key|All||
|Contributor|Authentication Key|All except ability to add new members to roles||


The following roles are managed with role-based access control:

|Role|Type|Functionalities|API permissions|
|--|--|--|--|
|QnA Maker Read<br>(read)|Active Directory|Export/Download<br>Test|1. Download KB API<br>2. List KBs for user API<br>3. Get Knowledge base details<br>4. Download Alterations<br>Generate Answer |
|QnA Maker Editor<br>(read/write)|Active Directory|Export/Download<br>Test<br>Update KB<br>Export KB<br>Import KB<br>Replace KB<br>Create KB|1. Create KB API<br>2. Update KB API<br>3. Replace KB API<br>4. Replace Alterations<br>5. "Train API" [in new service model v5]|
|Cognitive Service User<br>(read/write/publish)|Active Directory||All|