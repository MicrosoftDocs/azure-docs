---
title: include file
description: include file
ms.topic: include
ms.custom: include file
ms.date: 03/11/2020
---

The following roles are provided for collaboration:

|Role|Functionalities|API Access|API permissions|
|--|--|--|--|
|Owner|All|Authentication Key|All|
|Cognitive Services Contributor|All except ability to add new members to roles|Authentication Key|All except ability to add new members to roles|
|Cognitive Services QnA Maker Reader<br>(read)|Export/Download<br>Test|Bearer token|1. Download KB API<br>2. List KBs for user API<br>3. Get Knowledge base details<br>4. Download Alterations<br>Generate Answer |
|Cognitive Services QnA Maker Editor<br>(read/write)|Export/Download<br>Test<br>Update KB<br>Export KB<br>Import KB<br>Replace KB<br>Create KB|Bearer token|1. Create KB API<br>2. Update KB API<br>3. Replace KB API<br>4. Replace Alterations<br>5. "Train API" [in new service model v5]|
|Cognitive Services User<br>(read/write/publish)|All|Authentication Key|All access to Azure AI services resource except for ability to: <br>1. Add new members to roles.<br>2. Create new resources.|
