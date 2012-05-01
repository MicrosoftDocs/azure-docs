  <properties umbracoNaviHide="0" pageTitle="On-Premise Application with Blob Storage - How To - Java - Develop" metaKeywords="" metaDescription="" linkid="dev-java-how-to-on-premise-application-with-blob-storage" urlDisplayName="Application Using Blobs" headerExpose="" footerExpose="" disqusComments="1" />
  <h1>On-Premise Application with Blob Storage</h1>
  <p>The following example shows you how you can use Windows Azure storage to store images in Windows Azure. The code below is for a console application that uploads an image to Windows Azure, and then creates an HTML file that displays the image in your browser.</p>
  <h2>Table of Contents</h2>
  <ul>
    <li>
      <a href="#bkmk_prerequisites">Prerequisites</a>
    </li>
    <li>
      <a href="#bkmk_uploadfile">To use Windows Azure blob storage to upload a file</a>
    </li>
    <li>
      <a href="#bkmk_deletecontainer">To delete a container</a>
    </li>
  </ul>
  <h2>
    <a name="bkmk_prerequisites">
    </a>Prerequisites</h2>
  <ol>
    <li>A Java Developer Kit (JDK), v1.6 or later, is installed.</li>
    <li>The Windows Azure SDK is installed.</li>
    <li>The JAR for the Windows Azure Libraries for Java, and any applicable dependency JARs, are installed and are in the build path used by your Java compiler. For a list of the JARs, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh690953(v=vs.103).aspx">Download the Windows Azure SDK for Java</a>.</li>
    <li>You have a Windows Azure subscription.</li>
    <li>A Windows Azure storage account has been set up. The account name and account key for the storage account will be used by the code below. See <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433066.aspx">How to Create a Storage Account for a Windows Azure Subscription</a> for information about creating a storage account, and <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh531566.aspx">How to View, Copy, and Regenerate Access Keys for a Windows Azure Storage Account</a> for information about retrieving the account key.</li>
    <li>You have created a local image file named stored at the path c:\myimages\image1.jpg. Alternatively, modify the <strong>FileInputStream</strong> constructor in the example to use a different image path and file name.</li>
  </ol>
  <h2>
    <a name="bkmk_uploadfile">
    </a>To use Windows Azure blob storage to upload a file</h2>
  <p>A step-by-step procedure is presented here; if you’d like to skip ahead, the entire code is presented later in this topic.</p>
  <p>Begin the code by including imports for the Windows Azure core storage classes, the Windows Azure blob client classes, the Java IO classes, and the <strong>URISyntaxException</strong> class:</p>
  <pre class="prettyprint">import com.microsoft.windowsazure.services.core.storage.*;
import com.microsoft.windowsazure.services.blob.client.*;
import java.io.*;
import java.net.URISyntaxException;
</pre>
  <p>Declare a class named <strong>StorageSample</strong>, and include the open bracket, <strong>{</strong>.</p>
  <pre class="prettyprint">public class StorageSample {
</pre>
  <p>Within the <strong>StorageSample</strong> class, declare a string variable that will contain the default endpoint protocol, your storage account name, and your storage account key, as specified in your Windows Azure storage account. Replace the placeholder values <strong>your_account_name</strong> and <strong>your_account_key</strong> with your own account name and account key, respectively.</p>
  <pre class="prettyprint">public static final String storageConnectionString = 
       "DefaultEndpointsProtocol=http;" + 
           "AccountName=your_account_name;" + 
           "AccountKey=your_account_name"; 
</pre>
  <p>Add in your declaration for <strong>main</strong>, include a <strong>try</strong> block, and include the necessary open brackets, <strong>{</strong>.</p>
  <pre class="prettyprint">public static void main(String[] args) 
{
    try
    {
</pre>
  <p>Declare variables of the following type (the descriptions are for how they are used in this example):</p>
  <ul>
    <li>
      <strong>CloudStorageAccount</strong>: Used to initialize the account object with your Windows Azure storage account name and key, and to create the blob client object.</li>
    <li>
      <strong>CloudBlobClient</strong>: Used to access the blob service.</li>
    <li>
      <strong>CloudBlobContainer</strong>: Used to create a blob container, list the blobs in the container, and delete the container.</li>
    <li>
      <strong>CloudBlockBlob</strong>: Used to upload a local image file to the container.</li>
  </ul>
  <pre class="prettyprint">CloudStorageAccount account;
CloudBlobClient serviceClient;
CloudBlobContainer container;
CloudBlockBlob blob;
</pre>
  <p>Assign a value to the <strong>account</strong> variable.</p>
  <pre class="prettyprint">account = CloudStorageAccount.parse(storageConnectionString);
</pre>
  <p>Assign a value to the <strong>serviceClient</strong> variable.</p>
  <pre class="prettyprint">serviceClient = account.createCloudBlobClient();
</pre>
  <p>Assign a value to the <strong>container</strong> variable. We’ll get a reference to a container namedgettingstarted.</p>
  <pre class="prettyprint">// Container name must be lower case.
container = serviceClient.getContainerReference("gettingstarted");
</pre>
  <p>Create the container. This method will create the container if doesn’t exist (and return <strong>true</strong>). If the container does exist, it will return <strong>false</strong>. An alternative to <strong>createIfNotExist</strong> is the <strong>create</strong> method (which will return an error if the container already exists).</p>
  <pre class="prettyprint">container.createIfNotExist();</pre>
  <p>Set anonymous access for the container.</p>
  <pre class="prettyprint">// Set anonymous access on the container.
BlobContainerPermissions containerPermissions;
containerPermissions = new BlobContainerPermissions();
containerPermissions.setPublicAccess(BlobContainerPublicAccessType.CONTAINER);
container.uploadPermissions(containerPermissions);
</pre>
  <p>Get a reference to the block blob, which will represent the blob in Windows Azure storage.</p>
  <pre class="prettyprint">blob = container.getBlockBlobReference("image1.jpg");</pre>
  <p>Use the <strong>File</strong> constructor to get a reference to the locally created file that you will upload. (Ensure you have created this file before running the code.)</p>
  <pre class="prettyprint">File fileReference = new File ("c:\\myimages\\image1.jpg");
</pre>
  <p>Upload the local file through a call to the <strong>CloudBlockBlob.upload</strong> method. The first parameter to the <strong>CloudBlockBlob.upload</strong> method is a <strong>FileInputStream</strong> object that represents the local file that will be uploaded to Windows Azure storage. The second parameter is the size, in bytes, of the file.</p>
  <pre class="prettyprint">blob.upload(new FileInputStream(fileReference), fileReference.length());
</pre>
  <p>Call a helper function named <strong>MakeHTMLPage</strong>, to make a basic HTML page that contains an <strong>&lt;img&gt;</strong> element with the source set to the blob that is now in your Windows Azure storage account. (The code for <strong>MakeHTMLPage</strong> will be discussed later in this topic.)</p>
  <pre class="prettyprint">MakeHTMLPage(container);
</pre>
  <p>Print out a status message and information about the created HTML page.</p>
  <pre class="prettyprint">System.out.println("Processing complete.");
System.out.println("Open index.html to see the images stored in your storage account.");
</pre>
  <p>Close the <strong>try</strong> block by inserting a close bracket: <strong>}</strong></p>
  <p>Handle the following exceptions:</p>
  <ul>
    <li>
      <strong>FileNotFoundException</strong>: Can be thrown by the <strong>FileInputStream</strong> or <strong>FileOutputStream</strong> constructors.</li>
    <li>
      <strong>StorageException</strong>: Can be thrown by the Windows Azure client storage library.</li>
    <li>
      <strong>URISyntaxException</strong>: Can be thrown by the <strong>ListBlobItem.getUri</strong> method.</li>
    <li>
      <strong>Exception</strong>: Generic exception handling.</li>
  </ul>
  <pre class="prettyprint">catch (FileNotFoundException fileNotFoundException)
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
</pre>
  <p>Close <strong>main</strong> by inserting a close bracket: <strong>}</strong></p>
  <p>Create a method named <strong>MakeHTMLPage</strong> to create a basic HTML page. This method has a parameter of type <strong>CloudBlobContainer</strong>, which will be used to iterate through the list of uploaded blobs. This method will throw exceptions of type <strong>FileNotFoundException</strong>, which can be thrown by the <strong>FileOutputStream</strong> constructor, and <strong>URISyntaxException</strong>, which can be thrown by the <strong>ListBlobItem.getUri</strong> method. Include the opening bracket, <strong>{</strong>.</p>
  <pre class="prettyprint">public static void MakeHTMLPage(CloudBlobContainer container) throws FileNotFoundException, URISyntaxException
{</pre>
  <p>Create a local file named <strong>index.html</strong>.</p>
  <pre class="prettyprint">PrintStream stream;
stream = new PrintStream(new FileOutputStream("index.html"));
</pre>
  <p>Write to the local file, adding in the <strong>&lt;html&gt;</strong>, <strong>&lt;header&gt;</strong>, and <strong>&lt;body&gt;</strong> elements.</p>
  <pre class="prettyprint">stream.println("&lt;html&gt;");
stream.println("&lt;header/&gt;");
stream.println("&lt;body&gt;");
</pre>
  <p>Iterate through the list of uploaded blobs. For each blob, in the HTML page create an <strong>&lt;img&gt;</strong> element that has its <strong>src</strong> attribute sent to the URI of the blob as it exists in your Windows Azure storage account. Although you added only one image in this sample, if you added more, this code would iterate all of them.</p>
  <p>For simplicity, this example assumes each uploaded blob is an image. If you’ve updated blobs other than images, or page blobs instead of block blobs, adjust the code as needed.</p>
  <pre class="prettyprint">// Enumerate the uploaded blobs.
for (ListBlobItem blobItem : container.listBlobs()) {
// List each blob as an &lt;img&gt; element in the HTML body.
stream.println("&lt;img src='" + blobItem.getUri() + "'/&gt;&lt;br/&gt;");
}
</pre>
  <p>Close the <strong>&lt;body&gt;</strong> element and the <strong>&lt;html&gt;</strong> element.</p>
  <pre class="prettyprint">stream.println("&lt;/body&gt;");
stream.println("&lt;/html&gt;");
</pre>
  <p>Close the local file.</p>
  <pre class="prettyprint">stream.close();</pre>
  <p>Close <strong>MakeHTMLPage</strong> by inserting a close bracket: <strong>}</strong></p>
  <p>Close <strong>StorageSample</strong> by inserting a close bracket: <strong>}</strong></p>
  <p>The following is the complete code for this example. Remember to modify the placeholder values <strong>your_account_name</strong> and <strong>your_account_key</strong> to use your account name and account key, respectively.</p>
  <pre class="prettyprint">import com.microsoft.windowsazure.services.core.storage.*;
import com.microsoft.windowsazure.services.blob.client.*;
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

    public static void main(String[] args) 
    {
        try
        {
            CloudStorageAccount account;
            CloudBlobClient serviceClient;
            CloudBlobContainer container;
            CloudBlockBlob blob;
            
            account = CloudStorageAccount.parse(storageConnectionString);
            serviceClient = account.createCloudBlobClient();
            // Container name must be lower case.
            container = serviceClient.getContainerReference("gettingstarted");
            container.createIfNotExist();
            
            // Set anonymous access on the container.
            BlobContainerPermissions containerPermissions;
            containerPermissions = new BlobContainerPermissions();
            containerPermissions.setPublicAccess(BlobContainerPublicAccessType.CONTAINER);
            container.uploadPermissions(containerPermissions);

            // Upload an image file.
            blob = container.getBlockBlobReference("image1.jpg");
            File fileReference = new File ("c:\\myimages\\image1.jpg");
            blob.upload(new FileInputStream(fileReference), fileReference.length());

            // At this point the image is uploaded.
            // Next, create an HTML page that lists all of the uploaded images.
            MakeHTMLPage(container);

            System.out.println("Processing complete.");
            System.out.println("Open index.html to see the images stored in your storage account.");

        }
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
    }

    // Create an HTML page that can be used to display the uploaded images.
    // This example assumes all of the blobs are for images.
    public static void MakeHTMLPage(CloudBlobContainer container) throws FileNotFoundException, URISyntaxException
{
        PrintStream stream;
        stream = new PrintStream(new FileOutputStream("index.html"));

        // Create the opening &lt;html&gt;, &lt;header&gt;, and &lt;body&gt; elements.
        stream.println("&lt;html&gt;");
        stream.println("&lt;header/&gt;");
        stream.println("&lt;body&gt;");

        // Enumerate the uploaded blobs.
        for (ListBlobItem blobItem : container.listBlobs()) {
            // List each blob as an &lt;img&gt; element in the HTML body.
            stream.println("&lt;img src='" + blobItem.getUri() + "'/&gt;&lt;br/&gt;");
        }

        stream.println("&lt;/body&gt;");

        // Complete the &lt;html&gt; element and close the file.
        stream.println("&lt;/html&gt;");
        stream.close();
    }
}</pre>
  <p>In addition to uploading your local image file to Windows Azure storage, the example code creates a local file namedindex.html, which you can open in your browser to see your uploaded image.</p>
  <p>Because the code contains your account name and account key, ensure that your source code is secure.</p>
  <h2>
    <a name="bkmk_deletecontainer">
    </a>To delete a container</h2>
  <p>Because you are charged for storage, you may want to delete the gettingstartedcontainer after you are done experimenting with this example. To delete a container, use the <strong>CloudBlobContainer.delete</strong> method:</p>
  <pre class="prettyprint">container = serviceClient.getContainerReference("gettingstarted");
container.delete();
</pre>
  <p>To call the <strong>CloudBlobContainer.delete</strong> method, the process of initializing <strong>CloudStorageAccount</strong>, <strong>ClodBlobClient</strong>, <strong>CloudBlobContainer</strong> objects is the same as shown for the <strong>createIfNotExist</strong> method. The following is a complete example that deletes the container namedgettingstarted.</p>
  <pre class="prettyprint">import com.microsoft.windowsazure.services.core.storage.*;
import com.microsoft.windowsazure.services.blob.client.*;

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
}</pre>
  <p>For an overview of other blob storage classes and methods, see <a href="http://www.windowsazure.com/en-us/develop/java/how-to-guides/blob-storage/">How to Use the Blob Storage Service from Java</a>.</p>