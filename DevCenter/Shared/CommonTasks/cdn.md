<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-net-common-tasks-cdn" urlDisplayName="CDN" headerExpose="" pageTitle="Using Windows Azure CDN - .NET - Develop" metaKeywords="" footerExpose="" metaDescription="" umbracoNaviHide="0" disqusComments="1" />
  <h1>Using CDN for Windows Azure</h1>
  <p>The Windows Azure Content Delivery Network (CDN) offers developers a global solution for delivering high-bandwidth content by caching blobs and static content of compute instances at physical nodes in the United States, Europe, Asia, Australia and South America. For a current list of CDN node locations, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg680302.aspx">Windows Azure CDN Node Locations.</a></p>
  <p>The benefits of using CDN to cache Windows Azure data include:</p>
  <ul>
    <li>Better performance and user experience for end users who are far from a content source, and are using applications where many ‘internet trips’ are required to load content</li>
    <li>Large distributed scale to better handle instantaneous high load, say, at the start of an event such as a product launch</li>
  </ul>
  <p>To use the Windows Azure CDN, you must have a Windows Azure subscription and enable the feature on the storage account or hosted service in the <a href="http://windows.azure.com/">Windows Azure Management Portal</a>. The CDN is an add-on feature to your subscription and has a separate <a href="/en-us/pricing/calculator/advanced/">billing plan</a>.</p>
  <h2>Step 1: Create Storage Account or Hosted Service</h2>
  <p>Use the following procedure to create a new storage account for a Windows Azure subscription. A storage account gives the service administrator and co-administrators for a subscription access to Windows Azure storage services. The storage account represents the highest level of the namespace for accessing each of the Windows Azure storage service components: Blob services, Queue services, and Table services. For more information about the Windows Azure storage services, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee924681.aspx">Using the Windows Azure Storage Services</a>.</p>
  <p>To create a storage account, you must be either the service administrator or a co-administrator for the associated subscription.</p>
  <p>
    <strong>Note:</strong> For information about performing this operation by using the Windows Azure Service Management API, see the Create Storage Account reference topic.</p>
  <p>
    <strong>To create a storage account for a Windows Azure subscription</strong>
  </p>
  <ol>
    <li>Log into the <a href="http://windows.azure.com/">Windows Azure Management Portal</a>.</li>
    <li>In the navigation pane, click <strong>Hosted Services, Storage Accounts and CDN</strong>.</li>
    <li>At the top of the navigation pane, click <strong>Storage Accounts</strong>.</li>
    <li>
      <p>On the ribbon, in the <strong>Storage </strong>group, click <strong>New Storage Account</strong>.</p>
      <p>The <strong>Create a New Storage Account</strong> dialog box opens.</p>
      <p>
        <img src="../../../DevCenter/Shared/media/CDN_CreateNewStorageAcct.png" />
      </p>
    </li>
    <li>From the <strong>Choose a Subscription</strong> drop-down list, select the subscription that the storage account will be used with.</li>
    <li>
      <p>In the <strong>Enter a URL </strong>field, type a subdomain name to use in the URI for the storage account. The entry can contain from 3-24 lowercase letters and numbers.</p>
      <p>This value becomes the host name within the URI that is used to address Blob, Queue, or Table resources for the subscription. To address a container resource in the Blob service, you would use a URI in the following format, where <em>&lt;StorageAccountLabel&gt;</em> refers to the value you typed in <strong>Enter a URL</strong>:</p>
      <p>http://&lt;StorageAcountLabel&gt;.blob.core.windows.net/&lt;mycontainer&gt;</p>
      <p>
        <strong>Important:</strong> The URL label forms the subdomain of the storage account URI and must be unique among all hosted services in Windows Azure.</p>
      <p>
        <strong>Tip:</strong> If you prefer to allow your customers to access blobs by using your own custom subdomain, you can create a custom domain for the storage account. For more information, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee795179.aspx">How to Register a Custom Subdomain Name for Accessing Blobs in Windows Azure</a>.</p>
    </li>
    <li>
      <p>Choose a region or an affinity group in which to locate the storage:</p>
      <ul>
        <li>To specify a geographic location for the storage, select <strong>Anywhere US</strong>, and then select the region from the drop-down list.</li>
        <li>
          <p>To be able to co-locate the storage in the same data center with hosted services and other storage accounts, select <strong>Create or choose an affinity group</strong>, and then select the affinity group to use. Application content and storage for hosted services and storage groups that use the same affinity group are co-located within the same datacenter in a specified region.</p>
          <p>To create a new affinity group to use with this storage account, use the <strong>Create or choose an affinity group</strong> option. For instructions, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh531560.aspx">How to Create an Affinity Group in Windows Azure</a>.</p>
        </li>
      </ul>
    </li>
    <li>Click <strong>OK</strong>. The process of creating the storage account might take several minutes to complete.</li>
    <li>To verify that the storage account was created successfully, in the items list for <strong>Storage Accounts</strong>, expand the subscription that the storage account was added to. You should see the new storage account. The status of the storage account should be <strong>Created</strong>.</li>
  </ol>
  <h2>Step 2: Enable CDN on Your Service Provider</h2>
  <p>The CDN caches static content at strategically placed locations around the world to provide superior performance and availability. The benefits of using CDN to cache static content include:</p>
  <ul>
    <li>Better performance and user experience for end users who are far from a content source, and are using applications where many ‘internet trips’ are required to load content</li>
    <li>Large distributed scale to better handle instantaneous high load, say, at the start of an event such as a product launch</li>
  </ul>
  <p>Once you enable CDN access to a storage account or hosted service, all publicly available objects are eligible for CDN edge caching. If you modify an object that is currently cached in the CDN, the new content will not be available via the CDN until the CDN refreshes its content when the cached content time-to-live period expires.</p>
  <p>
    <strong>To enable CDN on a Subscription</strong>
  </p>
  <ol>
    <li>In <a href="http://windows.azure.com/">Windows Azure Management Portal</a>, in the navigation pane, click <strong>Hosted Services, Storage Accounts and CDN</strong>.</li>
    <li>
      <p>In the upper portion of the navigation pane, click <strong>CDN</strong>, and then on the ribbon, click <strong>New Endpoint</strong>.</p>
      <p>This will open the <strong>Create a New CDN Endpoint</strong> window.</p>
      <p>
        <img src="../../../DevCenter/Shared/media/CDN_CreateNewCDNEndpoint.png" />
      </p>
    </li>
    <li>In the <strong>Create a New CDN Endpoint </strong>window, select a subscription from the <strong>Choose a Subscription</strong> drop-down list, select a subscription on which to enable CDN.</li>
    <li>
      <p>Select the source of the CDN content from the <strong>Chose a hosted service or storage account</strong> drop-down list. Please note that this drop-down list determines what the origin will be for your CDN account. The origin is the single location that the CDN picks up content from. The <strong>Source URL for the CDN Endpoint </strong>will automatically display the URL for the origin. This is the actual URL from which the CDN will retrieve content to pull it into the cache network.</p>
    </li>
    <li>If you need to use HTTPS connections, check <strong>HTTPS</strong>. For more information on HTTPS and Windows Azure CDN, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ff919703.aspx">Overview of the Windows Azure CDN</a>.</li>
    <li>If you are caching content from a hosted service and you are using query strings to specify the content to be retrieved, check <strong>Query Strings</strong>. For more information about using Query strings to differentiate objects to cache, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ff919703.aspx">Overview of the Windows Azure CDN</a>. If you are using a blob storage account as origin you should not click this option.</li>
    <li>
      <p>Click <strong>Create</strong>.</p>
      <p>
        <strong>Warning:</strong> The configuration created for the endpoint will not immediately be available; it can take up to 60 minutes for the registration to propagate through the CDN network. Users who try to use the CDN domain name immediately will receive status code 400 (Bad Request) until the content is available via the CDN.</p>
    </li>
  </ol>
  <h2>Step 3: Access Your CDN Content</h2>
  <p>To access the content on the CDN, go to:</p>
  <p>http:// &lt;<em>CDNNamespace</em>&gt;.vo.msecnd.net/&lt;<em>myPublicContainer</em>&gt;/&lt;<em>BlobName</em>&gt;</p>
  <h2>Step 4: Delete Your CDN Content</h2>
  <p>If you no longer wish to cache an object in the Windows Azure Content Delivery Network (CDN), you can:</p>
  <ul>
    <li>For a Windows Azure blob, you can delete the blob from the public container.</li>
    <li>Make the container private instead of public using the <strong>Set Container ACL </strong>operation.</li>
    <li>Remove the CDN endpoint from your storage account in the Management Portal.</li>
    <li>Modify your hosted service to no longer respond to requests for the object.</li>
  </ul>
  <p>An object already cached in the CDN will remain cached until the time-to-live period for the object expires. When the time-to-live period expires, the CDN will check to see whether the CDN endpoint is still valid and the object still anonymously accessible. If it is not, then the object will no longer be cached.</p>
  <p>No explicit “purge” tool is currently available for the Windows Azure CDN.</p>
  <h2>Additional Resources</h2>
  <ul>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh531560.aspx">How to Create an Affinity Group in Windows Azure</a>
    </li>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh531567.aspx">How to: Manage Storage Accounts for a Windows Azure Subscription</a>
    </li>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee460807.aspx">About the Service Management API</a>
    </li>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg680307.aspx">How to Map CDN Content to a Custom Domain</a>
    </li>
  </ul>
</body>