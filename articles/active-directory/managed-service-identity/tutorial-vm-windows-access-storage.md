---
title: Use a Windows VM MSI to access Azure Storage
description: A tutorial that walks you through the process of using a Windows VM Managed Service Identity (MSI) to access Azure Storage.
services: active-directory
documentationcenter: ''
author: daveba
manager: mtillman
editor: daveba

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/12/2018
ms.author: daveba
---

# Use a Windows VM Managed Service Identity to access Azure Storage

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

This tutorial shows you how to enable Managed Service Identity (MSI) for a Windows Virtual Machine, and use the identity to access Azure Storage.


> [!div class="checklist"]
> * Enable the Managed Service Identity (MSI) on a Windows Virtual Machine (VM) 
> * Grant your Virtual Machine Identity access to a storage account 
> * Get an access token using your Virtual Machine's identity, and use it to access Azure Storage 

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

[!INCLUDE [msi-tut-prereqs](../../../includes/active-directory-msi-tut-prereqs.md)]

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a Windows virtual machine in a new resource group

For this tutorial, we create a new Windows VM. You can also enable MSI on an existing VM.

1.	Click the **+/Create new service** button found on the upper left-hand corner of the Azure portal.
2.	Select **Compute**, and then select **Windows Server 2016 Datacenter**. 
3.	Enter the virtual machine information. The **Username** and **Password** created here is the credentials you use to login to the virtual machine.
4.  Choose the proper **Subscription** for the virtual machine in the dropdown.
5.	To select a new **Resource Group** you would like to virtual machine to be created in, choose **Create New**. When complete, click **OK**.
6.	Select the size for the VM. To see more sizes, select **View all** or change the **Supported disk type** filter. On the settings blade, keep the defaults and click **OK**.

    ![Alt image text](../media/msi-tutorial-windows-vm-access-arm/msi-windows-vm.png)

## Enable MSI on your VM

A Virtual Machine MSI enables you to get access tokens from Azure AD without needing to put credentials into your code. Under the covers, enabling MSI on a Virtual Machine via the Azure portal does two things: it registers your VM with Azure AD to create a managed identity and installs the MSI VM extension. 

1. Navigate to the resource group of your new virtual machine, and select the virtual machine you created in the previous step.
2. Under the "Settings" category on the left navigation, click on  Configuration.
3. To enable the MSI, select Yes. To disable, choose No.
4. Click Save, to apply the configuration. 

    ![Alt image text](../media/msi-tutorial-linux-vm-access-arm/msi-linux-extension.png)

5. If you wish to check which extensions are on the VM, click **Extensions**. If MSI is enabled, the **ManagedIdentityExtensionforWindows** appears in the list.

    ![Alt image text](../media/msi-tutorial-linux-vm-access-arm/msi-extension-value.png)

## Create a storage account 

If you don't already have one, you will now create a storage account. You can also skip this step and grant your VM MSI access to the keys of an existing storage account. 

1. Click the **+/Create new service** button found on the upper left-hand corner of the Azure portal.
2. Click **Storage**, then **Storage Account**, and a new "Create storage account" panel will display.
3. Enter a name for the storage account, which you will use later.  
4. **Deployment model** and **Account kind** should be set to "Resource manager" and "General purpose", respectively. 
5. Ensure the **Subscription** and **Resource Group** match the ones you specified when you created your VM in the previous step.
6. Click **Create**.

    ![Create new storage account](../media/msi-tutorial-linux-vm-access-storage/msi-storage-create.png)

## Create a blob container in the storage account

Later we will upload and download a file to the new storage account. Because files require blob storage, we need to create a blob container in which to store the file.

1. Navigate back to your newly created storage account.
2. Click the **Containers** link in the left, under "Blob service."
3. Click **+ Container** on the top of the page, and a "New container" panel slides out.
4. Give the container a name, select an access level, then click **OK**. The name you specified will be used later in the tutorial. 

    ![Create storage container](../media/msi-tutorial-linux-vm-access-storage/create-blob-container.png)
5. Upload a file to the newly created container by clicking on the container name, then **Upload**, then select a file, then click **Upload**.

    ![Upload text file](~/articles/active-directory/media/msi-tutorial-linux-vm-access-storage/upload-text-file.png)

## Grant your VM access to an Azure Storage container 

You can use an MSI to retrieve Azure storage blob containers and data.   

1. Navigate back to your newly created storage account.  
2. Click the **Access control (IAM)** link in the left panel.  
3. Click **+ Add** on top of the page to add a new role assignment for your VM.
4. Set **Role** to **Storage Blob Data Reader (Preview)**, on the right side of the page. 
5. In the next dropdown, set **Assign access to** the resource "Virtual Machine".  
6. Next, ensure the proper subscription is listed in **Subscription** dropdown, then set **Resource Group** to "All resource groups".  
7. Finally, under **Select** choose your Windows Virtual Machine in the dropdown, then click **Save**. 

## Get an access token using the VM's identity and use it to call Azure Resource Manager 

Azure Storage natively supports Azure AD authentication, so it can directly accept access tokens obtained using MSI. You use the access token method of creating a connection to Azure Storage. This is part of Azure Storage's integration with Azure AD, and is different from supplying credentials on the connection string.

Here's a .Net code example of opening a connection to Azure Storage using an access token and then reading the contents of the file you created earlier. This code must run on the VM to be able to access the VM MSI endpoint. .Net Framework 4.6 or higher is required to use the access token method. Replace the value of `<URI to blob file>` accordingly. You can obtain this value from the **Overview** page in the Azure portal of file you created earlier.  Note the resource ID for Azure SQL is `https://storage.azure.com/`.

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
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://localhost:50342/oauth2/token?resource=" + resourceID);
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

## Related content

- For an overview of MSI, see [Managed Service Identity overview](overview.md).
- To learn how to do this same tutorial using a storage SAS credential, see [Use a Windows VM Managed Service Identity to access Azure Storage via a SAS credential](tutorial-windows-vm-access-storage-sas.md)
- For more information about the Azure Storage account SAS feature, see:
  - [Using shared access signatures (SAS)](/azure/storage/common/storage-dotnet-shared-access-signature-part-1.md)
  - [Constructing a Service SAS](/rest/api/storageservices/Constructing-a-Service-SAS.md)



