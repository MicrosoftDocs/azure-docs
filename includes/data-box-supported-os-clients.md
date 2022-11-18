---
author: alkohli
ms.service: databox
ms.subservice: pod   
ms.topic: include
ms.date: 10/06/2022
ms.author: alkohli
---

Here is a list of the supported operating systems for the data copy operation via the clients connected to your device. 

| **Operating system** | **Versions** | **Notes** |
| --- | --- | --- |
| Windows Server |2016 RS1 and later<br> 2019 RS5 and later | With earlier editions of these operating systems, you can't use RoboCopy in Backup mode (`robocopy /B`) to copy files that contain Alternate Data Streams (ADS) or use Extended Attributes (EAs) in their Access Control Lists (ACLs). |
| Windows |7, 8, 10, 11 |   |
| Linux    |         |   |
