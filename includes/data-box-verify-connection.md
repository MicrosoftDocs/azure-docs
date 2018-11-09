---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 11/09/2018
ms.author: alkohli
---

Perform the following steps to connect to the storage account and verify the connection.

1. In Storage Explorer, open the **Connect to Azure Storage** dialog.
2. In the **Connect to Azure Storage** dialog, select **Use a storage account name and key**.
3. Paste your **Account name** and **Account key** (key 1 value from your storage account in the Azure portal). Select Storage endpoints domain as **Other** (enter below) and then provide the string from the local web UI Connect and Copy page saved in step 3 of to add device IP and blob service endpoint to remote host. Check **Use HTTP** only if transferring over *http*. If using *https*, leave the option unchecked. Select **Next**.
4. In the **Connection Summary** dialog, review the provided information. Select **Connect**.
5. The account that you successfully added is displayed in the left pane of Storage Explorer with (External, Other) appended to its name. Click **Blob Containers** to view the container.
