Create file share

1.  Sign in to the Azure portal.

2.  On the navigation menu, click **Storage accounts** or **Storage accounts
    (classic)**.

![Screenshot that shows how to create file share in the portal](media/f97fc008b30a1dcf69d3956460d48de9.png)

1.  Choose your storage account.

![Screenshot that shows how to create file share in the portal](media/396358d4e96952b1a9ba2f7e1c071aca.png)

1.  Choose "Files" service.

![Screenshot that shows how to create file share in the portal](media/4dda25cafa21545cda81fe84ba457d3a.png)

1.  Click "File shares" and follow the link to create your first file share.

![Screenshot that shows how to create file share in the portal](media/833d058567d99f5235d695085c452a21.png)

1.  Fill in the file share name and the size of the file share (up to 5120 GB)
    to create your first file share. Once the file share has been created, you
    can mount it from any file system that supports SMB 2.1 or SMB 3.0. You
    could click on **Quota** on the file share to change the size of the file up
    to 5120 GB. Please refer to [Azure Pricing
    Calculator](https://azure.microsoft.com/en-us/pricing/calculator/) to
    estimate the storage costing of using Azure Files.

![Screenshot that shows how to create file share in the portal](media/d47b111f5045ce1f59d25434530c43f1.png)

Upload and download files

1.  Choose one file share your already created.

![Screenshot that shows how to upload and download files from the portal](media/ac896486d1d41b03844bda3a4817c0da.png)

1.  Click **Upload** to open the user interface for files uploading.

![Screenshot that shows how to upload files from the portal](media/b92f891d2319264e2c41ec42789b72a8.png)

Connect to file share

-   Click **Connect** to get the command line for mounting the file share from
    Windows and Linux. For Linux users, you could also refer to [How to use
    Azure File Storage with
    Linux](https://azure.microsoft.com/en-us/documentation/articles/storage-how-to-use-files-linux/)
    for more mounting instructions for other Linux distros.

![Screenshot that shows how to mount the file share](media/1670f377d03ceaa5d1c53481d29376b4.png)

![](media/074b121c114d8eaa87fdf9df18dc05b3.png)

**Tip:**

To find the storage account access key for mounting, click on **View access keys
for this storage account** at the bottom of the connect page.
