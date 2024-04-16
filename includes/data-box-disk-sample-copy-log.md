---
author: stevenmatthew
ms.service: databox  
ms.subservice: disk
ms.topic: include
ms.date: 12/16/2021
ms.author: shaas
---

The following sample is a copy log for an import to both Azure Files and Azure Blob storage.

This copy failed, with no validation errors but with three copy errors. One file share was renamed (`ShareRenamed` error), and two containers were renamed (`ContainerRenamed` error). The error entry gives the original and new file names.

```xml
<ErroredEntity Path="New Folder">
  <Category>ShareRenamed</Category>
  <ErrorCode>1</ErrorCode>
  <ErrorMessage>The original container/share/Blob has been renamed to: DataBox-f55763d4-8ef7-458f-b029-f36b51ada34f :from: New Folder :because either name has invalid character(s) or length is not supported</ErrorMessage>
  <Type>Container</Type>
</ErroredEntity>
<ErroredEntity Path="CV">
  <Category>ContainerRenamed</Category>
  <ErrorCode>1</ErrorCode>
  <ErrorMessage>The original container/share/Blob has been renamed to: DataBox-6bcae46f-04c8-4385-8442-3a28b962c930 :from: CV :because either name has invalid character(s) or length is not supported</ErrorMessage>
  <Type>Container</Type>
</ErroredEntity><ErroredEntity Path="New_ShareFolder">
  <Category>ContainerRenamed</Category>
  <ErrorCode>1</ErrorCode>
  <ErrorMessage>The original container/share/Blob has been renamed to: DataBox-96d8e2ee-ffd4-4529-9ec0-f666674b70d9 :from: New_ShareFolder :because either name has invalid character(s) or length is not supported</ErrorMessage>
  <Type>Container</Type>
</ErroredEntity>
<CopyLog Summary="Summary">
  <DriveLogVersion>2021-08-01</DriveLogVersion>
  <DriveId>72a1914a-7fb2-4e34-a135-5c7176c3ee41</DriveId>
  <Status>Failed</Status>
  <TotalFiles_Blobs>60</TotalFiles_Blobs>
  <FilesErrored>0</FilesErrored>
  <Summary>
    <ValidationErrors>
      <None Count="3" />
    </ValidationErrors>
    <CopyErrors>
      <ShareRenamed Count="1" Description="Renamed the share as the original share name does not follow Azure conventions." />
      <ContainerRenamed Count="2" Description="Renamed the container as the original container name does not follow Azure conventions." />
    </CopyErrors>
  </Summary>
</CopyLog>
```

