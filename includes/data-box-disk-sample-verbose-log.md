---
author: v-dalc
ms.service: databox  
ms.subservice: disk
ms.topic: include
ms.date: 12/16/2021
ms.author: alkohli
---

The following sample verbose log has sample file entries for block blob, page blob, and Azure File imports.

```xml
<File CloudFormat="BlockBlob" Path="$root\file26fd6b4bd-25f7-4019-8d0d-baa7355745df.vhd" Size="1024" crc64="14179624636173788226">
</File><File CloudFormat="BlockBlob" Path="$root\file49d220295-9cfd-469e-b69e-5c7c885133df.vhd" Size="1024" crc64="14179624636173788226">
</File>
----------CUT--------------------
<File CloudFormat="AzureFile" Path="e579954d-1f94-40cf-955f-afd39e9ca217\file1876f73ad-6213-43bc-9467-67fe0c794e99.block" Size="1024" crc64="1410470866535975213">
</File><File CloudFormat="AzureFile" Path="05407abe-81c8-4b44-b846-3a2c8c198316\file28d7868be-e6a7-4441-8d09-2b127f7d049e.vhd" Size="1024" crc64="1410470866535975213">
</File><File CloudFormat="AzureFile" Path="eb7666a7-c026-4375-9c08-3dea37a57713\file4448aeaf5-53dc-4bff-b798-4776e367ab5e.vhd" Size="1024" crc64="1410470866535975213">
</File>
----------CUT--------------------
<File CloudFormat="PageBlob" Path="tesdir8b1d0acd-2d37-46dd-96cf-edeb0f772e6b\file1.txt" Size="83886080" crc64="1680234237456714851">
</File><File CloudFormat="PageBlob" Path="tesdirf631630d-8098-4c84-be7b-40f6bbdb73fb\file_size0.txt" Size="0" crc64="0">
</File><File CloudFormat="PageBlob" Path="tesdirf631630d-8098-4c84-be7b-40f6bbdb73fb\Dir1/file_size0.txt" Size="0" crc64="0">
</File>
```
