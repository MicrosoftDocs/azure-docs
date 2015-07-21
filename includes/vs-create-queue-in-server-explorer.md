You can create blob containers by using Visual Studio **Server Explorer**.

![Server Explorer Blobs][Image1]

1. On the **View** menu, choose **Server Explorer**.
2. In Server Explorer, expand the **Azure** node for your subscription, expand the **Storage** node and the node for the storage account you specified in the Azure Storage connected service.
3. Select the **Blobs** node and choose **Create Blob Container** from the context menu.
4. Enter a name for the container and choose **OK**.   

By default, the new container is private and you must specify your storage access key to download blobs from this container. If you want to make the files in the container public, select the container in **Server Explorer** and press `F4` to display the **Properties** window. Set the **Public Read Access** to **Blob**. Anyone on the Internet can see blobs in a public container, but you can modify or delete them only if you have the appropriate access key.


[Image1]: ./media/vs-storage-getting-started-blobs-include/vs-storage-create-blob-containers-in-Server-Explorer.png