---
title: Access Azure Storage using a Windows VM system-assigned managed identity
description: A tutorial that walks you through the process of using a Windows VM system-assigned managed identity to access Azure Storage.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: daveba

ms.custom: subject-rbac-steps
ms.service: active-directory
ms.subservice: msi
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/18/2022
ms.author: barclayn
ms.collection: M365-identity-device-management
---

# Tutorial: Use a Windows VM system-assigned managed identity to access Azure Storage

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

This tutorial shows you how to use a system-assigned managed identity for a Windows virtual machine (VM) to access Azure Storage. You learn how to:

> [!div class="checklist"]
> * Create a blob container in a storage account
> * Grant your Windows VM's system-assigned managed identity access to a storage account
> * Get an access and use it to call Azure Storage

> [!NOTE]
> Microsoft Entra authentication for Azure Storage is in public preview.

## Prerequisites

[!INCLUDE [msi-tut-prereqs](../../../includes/active-directory-msi-tut-prereqs.md)]



## Enable

[!INCLUDE [msi-tut-enable](../../../includes/active-directory-msi-tut-enable.md)]



## Grant access


### Create storage account

In this section, you create a storage account.

1. Select the **+ Create a resource** button found on the upper left-hand corner of the Azure portal.
2. Select **Storage**, then **Storage account - blob, file, table, queue**.
3. Under **Name**, enter a name for the storage account.
4. **Deployment model** and **Account kind** should be set to **Resource manager** and **Storage (general purpose v1)**.
5. Ensure the **Subscription** and **Resource Group** match the ones you specified when you created your VM in the previous step.
6. Select **Create**.

    ![Create new storage account](./media/msi-tutorial-linux-vm-access-storage/msi-storage-create.png)

### Create a blob container and upload a file to the storage account

Files require blob storage so you need to create a blob container in which to store the file. You then upload a file to the blob container in the new storage account.

1. Navigate back to your newly created storage account.
2. Under **Blob Service**, select **Containers**.
3. Select **+ Container** on the top of the page.
4. Under **New container**, enter a name for the container and under **Public access level** keep the default value.

    ![Create storage container](./media/msi-tutorial-linux-vm-access-storage/create-blob-container.png)

5. Using an editor of your choice, create a file titled *hello world.txt* on your local machine. Open the file and add the text (without the quotes) "Hello world! :)" and then save it.
6. Upload the file to the newly created container by clicking on the container name, then **Upload**
7. In the **Upload blob** pane, under **Files**, select the folder icon and browse to the file **hello_world.txt** on your local machine, select the file, then select **Upload**.
    ![Upload text file](./media/msi-tutorial-linux-vm-access-storage/upload-text-file.png)

### Grant access

This section shows how to grant your VM access to an Azure Storage container. You can use the VM's system-assigned managed identity to retrieve the data in the Azure storage blob.

1. Navigate back to your newly created storage account.
1. Select **Access control (IAM)**.
1. Select **Add** > **Add role assignment** to open the Add role assignment page.
1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).
    
    | Setting | Value |
    | --- | --- |
    | Role | Storage Blob Data Reader |
    | Assign access to | Managed identity |
    | System-assigned | Virtual Machine |
    | Select | &lt;your virtual machine&gt; |

    ![Add role assignment page in Azure portal.](../../../includes/role-based-access-control/media/add-role-assignment-page.png)

## Access data 

Azure Storage natively supports Microsoft Entra authentication, so it can directly accept access tokens obtained using a managed identity. This approach uses Azure Storage's integration with Microsoft Entra ID, and is different from supplying credentials on the connection string.

Here's a .NET code example of opening a connection to Azure Storage. The example uses an access token and then reads the contents of the file you created earlier. This code must run on the VM to be able to access the VM's managed identity endpoint. .NET Framework 4.6 or higher is required to use the access token method. Replace the value of `<URI to blob file>` accordingly. You can obtain this value by navigating to file you created and uploaded to blob storage and copying the **URL** under **Properties** the **Overview** page.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Net;
using System.Web.Script.Serialization;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;

namespace StorageOAuthToken
{
    class Program
    {
        static void Main(string[] args)
        {
            //get token
            string accessToken = GetMSIToken("https://storage.azure.com/");

            //create token credential
            TokenCredential tokenCredential = new TokenCredential(accessToken);

            //create storage credentials
            StorageCredentials storageCredentials = new StorageCredentials(tokenCredential);

            Uri blobAddress = new Uri("<URI to blob file>");

            //create block blob using storage credentials
            CloudBlockBlob blob = new CloudBlockBlob(blobAddress, storageCredentials);

            //retrieve blob contents
            Console.WriteLine(blob.DownloadText());
            Console.ReadLine();
        }

        static string GetMSIToken(string resourceID)
        {
            string accessToken = string.Empty;
            // Build request to acquire MSI token
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=" + resourceID);
            request.Headers["Metadata"] = "true";
            request.Method = "GET";

            try
            {
                // Call /token endpoint
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();

                // Pipe response Stream to a StreamReader, and extract access token
                StreamReader streamResponse = new StreamReader(response.GetResponseStream());
                string stringResponse = streamResponse.ReadToEnd();
                JavaScriptSerializer j = new JavaScriptSerializer();
                Dictionary<string, string> list = (Dictionary<string, string>)j.Deserialize(stringResponse, typeof(Dictionary<string, string>));
                accessToken = list["access_token"];
                return accessToken;
            }
            catch (Exception e)
            {
                string errorText = String.Format("{0} \n\n{1}", e.Message, e.InnerException != null ? e.InnerException.Message : "Acquire token failed");
                return accessToken;
            }
        }
    }
}
```

The response contains the contents of the file:

`Hello world! :)`


## Disable

[!INCLUDE [msi-tut-disable](../../../includes/active-directory-msi-tut-disable.md)]



## Next steps

In this tutorial, you learned how enable a Windows VM's system-assigned identity to access Azure Storage.  To learn more about Azure Storage, see:

> [!div class="nextstepaction"]
> [Azure Storage](/azure/storage/common/storage-introduction)
