---
title: On-premises application with blob storage (Java) | Microsoft Docs
description: Learn how to create a console application that uploads an image to Azure, and then displays the image in your browser. Code samples in Java.
services: storage
documentationcenter: java
author: mmacy
manager: carmonm
editor: tysonn

ms.assetid: ccc9a7d7-6fe4-467b-b7fd-a73f17539e3f
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: Java
ms.topic: article
ms.date: 11/17/2016
ms.author: marsma

---
# On-premises application with blob storage
## Overview
The following example shows you how you can use Azure storage to
store images in Azure. The code in this article is for a console
application that uploads an image to Azure, and then creates an
HTML file that displays the image in your browser.

## Prerequisites
* A Java Developer Kit (JDK), version 1.6 or later, is installed.
* The Azure SDK is installed.
* The JAR for the Azure Libraries for Java, and any applicable
    dependency JARs, are installed and are in the build path used by
    your Java compiler. For information about installing the Azure Libraries for Java, see [Download the Azure SDK for Java](../java-download-azure-sdk.md).
* An Azure storage account has been set up. The account name
    and account key for the storage account will be used by the code
    in this article. See [How to Create a Storage Account](storage-create-storage-account.md#create-a-storage-account) for information about creating a storage account,
    and [View and copy storage access keys](storage-create-storage-account.md#view-and-copy-storage-access-keys) for information about retrieving the account key.
* You have created a local image file named stored at the path
    c:\\myimages\\image1.jpg. Alternatively, modify the
    **FileInputStream** constructor in the example to use a different
    image path and file name.

[!INCLUDE [create-account-note](../../includes/create-account-note.md)]

## To use Azure blob storage to upload a file
A step-by-step procedure is presented here. If you'd like to skip ahead,
the entire code is presented later in this article.

Begin the code by including imports for the Azure core storage
classes, the Azure blob client classes, the Java IO classes, and
the **URISyntaxException** class.

```java
import com.microsoft.azure.storage.*;
import com.microsoft.azure.storage.blob.*;
import java.io.*;
import java.net.URISyntaxException;
```

Declare a class named **StorageSample**, and include the open bracket,
**{**.

```java
public class StorageSample {
```

Within the **StorageSample** class, declare a string variable that will
contain the default endpoint protocol, your storage account name, and
your storage access key, as specified in your Azure storage
account. Replace the placeholder values **your\_account\_name** and
**your\_account\_key** with your own account name and account key,
respectively.

```java
public static final String storageConnectionString =
    "DefaultEndpointsProtocol=http;" +
    "AccountName=your_account_name;" +
    "AccountKey=your_account_name";
```

Add in your declaration for **main**, include a **try** block, and
include the necessary open brackets, **{**.

```java
    public static void main(String[] args)
    {
        try
        {
```

Declare variables of the following type (the descriptions are for how
they are used in this example):

* **CloudStorageAccount**: Used to initialize the account object with
  your Azure storage account name and key, and to create the
  blob client object.
* **CloudBlobClient**: Used to access the blob service.
* **CloudBlobContainer**: Used to create a blob container, list the
  blobs in the container, and delete the container.
* **CloudBlockBlob**: Used to upload a local image file to the
  container.

<!-- -->

```java
    CloudStorageAccount account;
    CloudBlobClient serviceClient;
    CloudBlobContainer container;
    CloudBlockBlob blob;
```

Assign a value to the **account** variable.

```java
account = CloudStorageAccount.parse(storageConnectionString);
```

Assign a value to the **serviceClient** variable.

```java
serviceClient = account.createCloudBlobClient();
```

Assign a value to the **container** variable. We'll get a reference to a
container named **gettingstarted**.

```java
// Container name must be lower case.
container = serviceClient.getContainerReference("gettingstarted");
```

Create the container. This method will create the container if it doesn't
exist (and return **true**). If the container does exist, it will return
**false**. An alternative to **createIfNotExists** is the **create**
method (which will return an error if the container already exists).

```java
container.createIfNotExists();
```

Set anonymous access for the container.

```java
// Set anonymous access on the container.
BlobContainerPermissions containerPermissions;
containerPermissions = new BlobContainerPermissions();
containerPermissions.setPublicAccess(BlobContainerPublicAccessType.CONTAINER);
container.uploadPermissions(containerPermissions);
```

Get a reference to the block blob, which will represent the blob in
Azure storage.

```java
blob = container.getBlockBlobReference("image1.jpg");
```

Use the **File** constructor to get a reference to the locally created
file that you will upload. Ensure you have created this file before
running the code.

```java
File fileReference = new File ("c:\\myimages\\image1.jpg");
```

Upload the local file through a call to the **CloudBlockBlob.upload**
method. The first parameter to the **CloudBlockBlob.upload** method is a
**FileInputStream** object that represents the local file that will be
uploaded to Azure storage. The second parameter is the size, in
bytes, of the file.

```java
blob.upload(new FileInputStream(fileReference), fileReference.length());
```

Call a helper function named **MakeHTMLPage**, to make a basic HTML page
that contains an **&lt;image&gt;** element with the source set to the blob that
is now in your Azure storage account. The code for
**MakeHTMLPage** will be discussed later in this article.

```java
MakeHTMLPage(container);
```

Print out a status message and information about the created HTML page.

```java
System.out.println("Processing complete.");
System.out.println("Open index.html to see the images stored in your storage account.");
```

Close the **try** block by inserting a close bracket: **}**

Handle the following exceptions:

* **FileNotFoundException**: Can be thrown by the **FileInputStream**
  or **FileOutputStream** constructors.
* **StorageException**: Can be thrown by the Azure client
  storage library.
* **URISyntaxException**: Can be thrown by the **ListBlobItem.getUri**
  method.
* **Exception**: Generic exception handling.

<!-- -->

```java
catch (FileNotFoundException fileNotFoundException)
{
    System.out.print("FileNotFoundException encountered: ");
    System.out.println(fileNotFoundException.getMessage());
    System.exit(-1);
}
catch (StorageException storageException)
{
    System.out.print("StorageException encountered: ");
    System.out.println(storageException.getMessage());
    System.exit(-1);
}
catch (URISyntaxException uriSyntaxException)
{
    System.out.print("URISyntaxException encountered: ");
    System.out.println(uriSyntaxException.getMessage());
    System.exit(-1);
}
catch (Exception e)
{
    System.out.print("Exception encountered: ");
    System.out.println(e.getMessage());
    System.exit(-1);
}
```

Close **main** by inserting a close bracket: **}**

Create a method named **MakeHTMLPage** to create a basic HTML page. This
method has a parameter of type **CloudBlobContainer**, which will be
used to iterate through the list of uploaded blobs. This method will
throw exceptions of type **FileNotFoundException**, which can be thrown
by the **FileOutputStream** constructor, and **URISyntaxException**,
which can be thrown by the **ListBlobItem.getUri** method. Include the
opening bracket, **{**.

```java
public static void MakeHTMLPage(CloudBlobContainer container) throws FileNotFoundException, URISyntaxException
{
```

Create a local file named **index.html**.

```java
PrintStream stream;
stream = new PrintStream(new FileOutputStream("index.html"));
```

Write to the local file, adding in the **&lt;html&gt;**, **&lt;header&gt;**, and
**&lt;body&gt;** elements.

```java
stream.println("<html>");
stream.println("<header/>");
stream.println("<body>");
```

Iterate through the list of uploaded blobs. For each blob, in the HTML
page create an **&lt;img&gt;** element that has its **src** attribute sent to
the URI of the blob as it exists in your Azure storage account.
Although you added only one image in this sample, if you added more,
this code would iterate all of them.

For simplicity, this example assumes each uploaded blob is an image. If
you've updated blobs other than images, or page blobs instead of block
blobs, adjust the code as needed.

```java
// Enumerate the uploaded blobs.
for (ListBlobItem blobItem : container.listBlobs()) {
// List each blob as an <img> element in the HTML body.
stream.println("<img src='" + blobItem.getUri() + "'/><br/>");
}
```

Close the **&lt;body&gt;** element and the **&lt;html&gt;** element.

```java
stream.println("</body>");
stream.println("</html>");
```

Close the local file.

```java
stream.close();
```

Close **MakeHTMLPage** by inserting a close bracket: **}**

Close **StorageSample** by inserting a close bracket: **}**

The following is the complete code for this example. Remember to modify
the placeholder values **your\_account\_name** and
**your\_account\_key** to use your account name and account key,
respectively.

```java
import com.microsoft.azure.storage.*;
import com.microsoft.azure.storage.blob.*;
import java.io.*;
import java.net.URISyntaxException;

// Create an image, c:\myimages\image1.jpg, prior to running this sample.
// Alternatively, change the value used by the FileInputStream constructor
// to use a different image path and file that you have already created.
public class StorageSample {

    public static final String storageConnectionString =
            "DefaultEndpointsProtocol=http;" +
                    "AccountName=your_account_name;" +
                    "AccountKey=your_account_name";

    public static void main(String[] args) {
        try {
            CloudStorageAccount account;
            CloudBlobClient serviceClient;
            CloudBlobContainer container;
            CloudBlockBlob blob;

            account = CloudStorageAccount.parse(storageConnectionString);
            serviceClient = account.createCloudBlobClient();
            // Container name must be lower case.
            container = serviceClient.getContainerReference("gettingstarted");
            container.createIfNotExists();

            // Set anonymous access on the container.
            BlobContainerPermissions containerPermissions;
            containerPermissions = new BlobContainerPermissions();
            containerPermissions.setPublicAccess(BlobContainerPublicAccessType.CONTAINER);
            container.uploadPermissions(containerPermissions);

            // Upload an image file.
            blob = container.getBlockBlobReference("image1.jpg");

            File fileReference = new File("c:\\myimages\\image1.jpg");
            blob.upload(new FileInputStream(fileReference), fileReference.length());

            // At this point the image is uploaded.
            // Next, create an HTML page that lists all of the uploaded images.
            MakeHTMLPage(container);

            System.out.println("Processing complete.");
            System.out.println("Open index.html to see the images stored in your storage account.");

        } catch (FileNotFoundException fileNotFoundException) {
            System.out.print("FileNotFoundException encountered: ");
            System.out.println(fileNotFoundException.getMessage());
            System.exit(-1);
        } catch (StorageException storageException) {
            System.out.print("StorageException encountered: ");
            System.out.println(storageException.getMessage());
            System.exit(-1);
        } catch (URISyntaxException uriSyntaxException) {
            System.out.print("URISyntaxException encountered: ");
            System.out.println(uriSyntaxException.getMessage());
            System.exit(-1);
        } catch (Exception e) {
            System.out.print("Exception encountered: ");
            System.out.println(e.getMessage());
            System.exit(-1);
        }
    }

    // Create an HTML page that can be used to display the uploaded images.
    // This example assumes all of the blobs are for images.
    public static void MakeHTMLPage(CloudBlobContainer container) throws FileNotFoundException, URISyntaxException
    {
        PrintStream stream;
        stream = new PrintStream(new FileOutputStream("index.html"));

        // Create the opening <html>, <header>, and <body> elements.
        stream.println("<html>");
        stream.println("<header/>");
        stream.println("<body>");

        // Enumerate the uploaded blobs.
        for (ListBlobItem blobItem : container.listBlobs()) {
            // List each blob as an <img> element in the HTML body.
            stream.println("<img src='" + blobItem.getUri() + "'/><br/>");
        }

        stream.println("</body>");

        // Complete the <html> element and close the file.
        stream.println("</html>");
        stream.close();
    }
}
```

In addition to uploading your local image file to Azure storage,
the example code creates a local file namedindex.html, which you can
open in your browser to see your uploaded image.

Because the code contains your account name and account key, ensure that
your source code is secure.

## To delete a container
Because you are charged for storage, you may want to delete the
**gettingstarted** container after you are done experimenting with this
example. To delete a container, use the **CloudBlobContainer.delete**
method.

```java
container = serviceClient.getContainerReference("gettingstarted");
container.delete();
```

To call the **CloudBlobContainer.delete** method, the process of
initializing **CloudStorageAccount**, **ClodBlobClient**, and **CloudBlobContainer** objects is the same as shown for the
**createIfNotExist** method. The following is a complete example that
deletes the container named **gettingstarted**.

```java
import com.microsoft.azure.storage.*;
import com.microsoft.azure.storage.blob.*;

public class DeleteContainer {

    public static final String storageConnectionString =
            "DefaultEndpointsProtocol=http;" +
                "AccountName=your_account_name;" +
                "AccountKey=your_account_key";

    public static void main(String[] args)
    {
        try
        {
            CloudStorageAccount account;
            CloudBlobClient serviceClient;
            CloudBlobContainer container;

            account = CloudStorageAccount.parse(storageConnectionString);
            serviceClient = account.createCloudBlobClient();
            // Container name must be lower case.
            container = serviceClient.getContainerReference("gettingstarted");
            container.delete();

            System.out.println("Container deleted.");

        }
        catch (StorageException storageException)
        {
            System.out.print("StorageException encountered: ");
            System.out.println(storageException.getMessage());
            System.exit(-1);
        }
        catch (Exception e)
        {
            System.out.print("Exception encountered: ");
            System.out.println(e.getMessage());
            System.exit(-1);
        }
    }
}
```

For an overview of other blob storage classes and methods, see [How to use Blob storage from Java](storage-java-how-to-use-blob-storage.md).

## Next steps
Follow these links to learn more about more complex storage tasks.

* [Azure Storage SDK for Java](https://github.com/azure/azure-storage-java)
* [Azure Storage Client SDK Reference](http://dl.windowsazure.com/storage/javadoc/)
* [Azure Storage Services REST API](https://msdn.microsoft.com/library/azure/dd179355.aspx)
* [Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/)

