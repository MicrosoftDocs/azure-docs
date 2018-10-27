---
author: tamram
ms.service: storage
ms.topic: include
ms.date: 10/26/2018
ms.author: tamram
---
Changes made to the Azure file share by using the Azure portal or SMB are not immediately detected and replicated like changes to the server endpoint. Azure Files does not yet have change notifications or journaling, so there's no way to automatically initiate a sync session when files are changed. On Windows Server, Azure File Sync uses [Windows USN journaling](https://msdn.microsoft.com/library/windows/desktop/aa363798.aspx) to automatically initiate a sync session when files change.<br /><br /> 
To detect changes to the Azure file share, Azure File Sync has a scheduled job called a *change detection job*. A change detection job enumerates every file in the file share, and then compares it to the sync version for that file. When the change detection job determines that files have changed, Azure File Sync initiates a sync session. The change detection job is initiated every 24 hours. Because the change detection job works by enumerating every file in the Azure file share, change detection takes longer in larger namespaces than in smaller namespaces. For large namespaces, it might take longer than once every 24 hours to determine which files have changed.<br /><br />
Note, changes made to an Azure file share using REST does not update the SMB last modified time and will not be seen as a change by sync. <br /><br />
We are exploring adding change detection for an Azure file share similar to USN for volumes on Windows Server. Help us prioritize this feature for future development by voting for it at [Azure Files UserVoice](https://feedback.azure.com/forums/217298-storage/category/180670-files).
