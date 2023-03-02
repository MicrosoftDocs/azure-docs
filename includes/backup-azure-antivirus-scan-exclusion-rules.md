---
author: v-amallick
ms.service: backup
ms.topic: include
ms.date: 04/05/2022
ms.author: v-amallick
---

If you've antivirus software installed on the server, add the exclusion rules to the antivirus scan for:

- Every file and folder under the *scratch* and *bin* folder locations - `<InstallPath>\Scratch\*` and `<InstallPath>\Bin\*`.
- cbengine.exe