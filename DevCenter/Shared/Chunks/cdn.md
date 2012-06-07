# Using CDN for Windows Azure

The Windows Azure Content Delivery Network (CDN) offers developers a
global solution for delivering high-bandwidth content by caching blobs
and static content of compute instances at physical nodes in the United
States, Europe, Asia, Australia and South America. For a current list of
CDN node locations, see [Windows Azure CDN Node Locations].

The benefits of using CDN to cache Windows Azure data include:

-   Better performance and user experience for end users who are far from a content source, and are using applications where many ‘internet trips’ are required to load content
-   Large distributed scale to better handle instantaneous high load, say, at the start of an event such as a product launch

To use the Windows Azure CDN, you must have a Windows Azure subscription
and enable the feature on the storage account or hosted service in the [Windows Azure Management Portal]. The CDN is an add-on feature to your subscription and has a separate [billing plan].

## Step 1: Create storage account

Use the following procedure to create a new storage account for a
Windows Azure subscription. A storage account gives access to Windows
Azure storage services. The storage account represents the highest level
of the namespace for accessing each of the Windows Azure storage service
components: Blob services, Queue services, and Table services. For more
information about the Windows Azure storage services, see [Using the
Windows Azure Storage Services].

To create a storage account, you must be either the service
administrator or a co-administrator for the associated subscription.

**Note:** For information about performing this operation by using the
Windows Azure Service Management API, see the [Create Storage Account] reference topic.

**To create a storage account for a Windows Azure subscription**

1.  Log into the [Windows Azure Management Portal].
2.  In the lower left corner, click **+NEW**, and then click **Storage Account**.
3.  Click **Quick Create**.

    The **Create a New Storage Account** dialog appears.

    ![Create a new Storage Account][create-new-storage-account]

4. In the **URL** field, type a subdomain name. This entry can contain from 3-24 lowercase letters and numbers.

    This value becomes the host name within the URI that is used to
    address Blob, Queue, or Table resources for the subscription. To
    address a container resource in the Blob service, you would use a
    URI in the following format, where *&lt;StorageAccountLabel>* refers
    to the value you typed in **Enter a URL**:

    http://&lt;StorageAcountLabel>.blob.core.windows.net/&lt;mycontainer>

    **Important:** The URL label forms the subdomain of the storage
    account URI and must be unique among all hosted services in Windows
    Azure.

	This value is also used as the name of this storage account in the portal, or when accessing this account programmatically.

    **Tip:** If you prefer to allow your customers to access blobs by
    using your own custom subdomain, you can create a custom domain for
    the storage account. For more information, see [How to Register a
    Custom Subdomain Name for Accessing Blobs in Windows Azure].

7.  Select a geographic location for the storage account from the **Region/Affinity Group** drop-down list. For instructions on creating an affinity group, see [How to Create an Affinity Group in Windows Azure].

8.  Click **Create Storage Account**. The process of creating the storage account might take several minutes to complete.
9.  To verify that the storage account was created successfully, verify that the account appears in the items list for **Storage Accounts** with a status of **Online**.

## Step 2: Enable CDN on your storage account

The CDN caches static content at strategically placed locations around
the world to provide superior performance and availability. The benefits
of using CDN to cache static content include:

* Better performance and user experience for end users who are far from a content source, and are using applications where many ‘internet trips’ are required to load content.
* Large distributed scale to better handle instantaneous high load, say, at the start of an event such as a product launch.

Once you enable CDN access to a storage account or hosted service, all
publicly available objects are eligible for CDN edge caching. If you
modify an object that is currently cached in the CDN, the new content
will not be available via the CDN until the CDN refreshes its content
when the cached content time-to-live period expires.

**To enable CDN on your subscription**

1.  In the [Windows Azure Management Portal], in the title, click **Preview** and then select **Take me to the previous portal**. This will load the production management portal.

	![preview portal dialog][Previous Management Portal]

2. In the production management portal, in the navigation pane,
    click **Hosted Services, Storage Accounts and CDN**.
3. In the upper portion of the navigation pane, click **CDN**, and then
    on the ribbon, click **New Endpoint**.

   This will open the **Create a New CDN Endpoint** window.

    ![new cdn endpoint window][create-new-cdn-endpoint]

4. In the **Create a New CDN Endpoint** window, select a subscription
    from the **Choose a Subscription** drop-down list, select a
    subscription on which to enable CDN.
5.  Select the source of the CDN content from the **Choose a hosted
    service or storage account** drop-down list. Please note that this
    drop-down list determines what the origin will be for your CDN
    account. The origin is the single location that the CDN picks up
    content from. The **Source URL for the CDN Endpoint** will
    automatically display the URL for the origin. This is the actual URL
    from which the CDN will retrieve content to pull it into the cache
    network.

6.  If you need to use HTTPS connections, check **HTTPS**. For more
    information on HTTPS and Windows Azure CDN, see [Overview of the
    Windows Azure CDN].
7.  If you are caching content from a hosted service and you are using
    query strings to specify the content to be retrieved, check **Query
    Strings**. For more information about using Query strings to
    differentiate objects to cache, see [Overview of the Windows Azure
    CDN]. If you are using a blob storage account as origin you should
    not click this option.
8.  Click **Create**.

    **Warning:** The configuration created for the endpoint will not
    immediately be available; it can take up to 60 minutes for the
    registration to propagate through the CDN network. Users who try to
    use the CDN domain name immediately will receive status code 400
    (Bad Request) until the content is available via the CDN.

## Step 3: Access your CDN content

To access the content on the CDN, go to:

http://<*CDNNamespace*\>.vo.msecnd.net/<*myPublicContainer*\>/<*BlobName*\>

## Step 4: Delete your CDN content

If you no longer wish to cache an object in the Windows Azure Content
Delivery Network (CDN), you can:

-   For a Windows Azure blob, you can delete the blob from the public
    container.
-   Make the container private instead of public using the **Set
    Container ACL** operation.
-   Remove the CDN endpoint from your storage account in the Management
    Portal.
-   Modify your hosted service to no longer respond to requests for the
    object.

An object already cached in the CDN will remain cached until the
time-to-live period for the object expires. When the time-to-live period
expires, the CDN will check to see whether the CDN endpoint is still
valid and the object still anonymously accessible. If it is not, then
the object will no longer be cached.

No explicit “purge” tool is currently available for the Windows Azure
CDN.

## Additional resources

-   [How to Create an Affinity Group in Windows Azure]
-   [How to: Manage Storage Accounts for a Windows Azure Subscription]
-   [About the Service Management API]
-   [How to Map CDN Content to a Custom Domain]

  [Create Storage Account]: http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx
  [Windows Azure CDN Node Locations]: http://msdn.microsoft.com/en-us/library/windowsazure/gg680302.aspx
  [Windows Azure Management Portal]: https://manage.windowsazure.com/
  [billing plan]: /en-us/pricing/calculator/?scenario=full
  [Using the Windows Azure Storage Services]: http://msdn.microsoft.com/en-us/library/windowsazure/ee924681.aspx
  [How to Register a Custom Subdomain Name for Accessing Blobs in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/ee795179.aspx
  [How to Create an Affinity Group in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/hh531560.aspx
  [Overview of the Windows Azure CDN]: http://msdn.microsoft.com/en-us/library/windowsazure/ff919703.aspx
  [How to: Manage Storage Accounts for a Windows Azure Subscription]: http://msdn.microsoft.com/en-us/library/windowsazure/hh531567.aspx
  [About the Service Management API]: http://msdn.microsoft.com/en-us/library/windowsazure/ee460807.aspx
  [How to Map CDN Content to a Custom Domain]: http://msdn.microsoft.com/en-us/library/windowsazure/gg680307.aspx

[create-new-cdn-endpoint]: ../Media/CDN_CreateNewCDNEndpoint.png
[create-new-storage-account]: ../Media/CDN_CreateNewStorageAcct.png
[Previous Management Portal]: ../../Shared/Media/previous-portal.png