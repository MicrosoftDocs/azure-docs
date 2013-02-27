<properties linkid="mobile-services-how-to-XXXXX-client" urlDisplayName="XXXXX Client Library" pageTitle="How to use the XXXXX client library - Windows Azure Mobile Services feature guide" metaKeywords="Windows Azure Mobile Services, Mobile Service XXXXX client library, XXXXX client library" metaDescription="Learn how to use the XXXXX client library for Windows Azure Mobile Services." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />



<div chunk="../chunks/article-left-menu-XXXXX.md" />

# How to use the XXXXX client library for Mobile Services

<div class="dev-center-tutorial-selector"> 
	<a href="/en-us/develop/mobile/how-to-guides/how-to-dotnet-client" title=".NET Framework">.NET Framework</a>
    <a href="/en-us/develop/mobile/how-to-guides/how-to-js-client" title="JavaScript">JavaScript</a> 
	<a href="/en-us/develop/mobile/how-to-guides/how-to-ios-client" title="Objective-C">Objective-C</a> 
	<a href="/en-us/develop/mobile/how-to-guides/how-to-android-client" title="Java">Java</a>
</div>	


This guide shows you how to perform common scenarios using the XXXXX client for Windows Azure Mobile Services. The samples are written in XXXXX and require the [Mobile Services SDK]. The scenarios covered include querying for data; inserting, updating, and deleting data, authenticating users, handling errors, and uploading BLOB data. If you are new to Mobile Services, you should consider first completing the [Mobile Services quickstart][Get started with Mobile Services]. The quickstart tutorial helps you configure your account and create your first mobile service.

## Table of Contents

- [What is Mobile Services][]
- [Concepts][]
- [How to: Create the Mobile Services client][]
- [How to: Query data from a mobile service][]
	- [Filter returned data]
    - [Sort returned data]
	- [Return data in pages]
	- [Select specific columns]
- [How to: Insert data into a mobile service]
- [How to: Modify data in a mobile service]
- [How to: Bind data to the user interface]
- [How to: Authenticate users]
- [How to: Upload images and large files]
- [How to: Handle errors]
- [How to: Include custom request headers]
- [Next steps][]

<div chunk="../mobile-services-concepts.md" />

<div chunk="../../Shared/Chunks/create-storage-account.md" />

<h2><a name="create-client"></a><span class="short-header">Creating the client</span>How to: Create the Mobile Services client</h2>

This section shows how to instantiate the mobile services client object with the URL and application key, and why the application key is needed. Also discuss the table object.

<h2><a name="querying"></a><span class="short-header">Querying data</span>How to: Query data from a mobile service</h2>

This section describes how to issue queries to the mobile service. Subsections describe diffent aspects of queries.

### <a name="filtering"></a>How to: Filter returned data

_This section shows how to filter data by including a **where** clause in the query._

### <a name="sorting"></a>How to: Sort returned data

_This section shows how to sort data by including an **orderby** clause in the query._

### <a name="paging"></a>How to: Return data in pages

_This section shows how to implement paging in returned data by using the **top/take** and **skip** clauses in the query._

### <a name="selecting"></a>How to: Select specific columns

_This section shows how to return only specific fields by using a **select** clause in the query--projection into a new type._

<h2><a name="inserting"></a><span class="short-header">Inserting data</span>How to: Insert data into a mobile service</h2>

_This section shows how to insert new rows into a table_

<h2><a name="modifying"></a><span class="short-header">Modifying data</span>How to: Modify data in a mobile service</h2>

_This section shows how to update data in and delete data from a table_

<h2><a name="binding"></a><span class="short-header">Binding data</span>How to: Bind data to the user interface</h2>

_This section shows how to bind returned data objects to UI elements._

<h2><a name="authentication"></a><span class="short-header">Authentication</span>How to: Authenticate users</h2>

_This section shows how to authenticate users._

<h2><a name="blobs"></a><span class="short-header">Upload blobs</span>How to: Upload images and large files</h2>

_(Optional) This section shows how to upload images and other kinds of BLOB data to Blob storage._

For more information, see [Get started with authentication].

<h2><a name="errors"></a><span class="short-header">Error handling</span>How to: Handle errors</h2>

_This section shows how to perform property error handling._

<h2><a name="custom-headers"></a><span class="short-header">Custom headers</span>How to: Customize request headers</h2>

_(Optional) This section shows how to send custom request headers._

For more information see, New topic about processing headers in the server-side.

## <a name="next-steps"></a>Next steps

<!-- Anchors. -->

[What is Mobile Services]: #what-is
[Concepts]: #concepts
[How to: Create the Mobile Services client]: #create-client
[How to: Query data from a mobile service]: #querying
[Filter returned data]: #filtering
[Sort returned data]: #sorting
[Return data in pages]: #paging
[Select specific columns]: #selecting
[How to: Bind data to the user interface]: #binding
[How to: Insert data into a mobile service]: #inserting
[How to: Modify data in a mobile service]: #modifying
[How to: Authenticate users]: #authentication
[How to: Upload images and large files]: #blobs
[How to: Handle errors]: #errors
[How to: Include custom request headers]: #custom-headers
[Next Steps]: #next-steps

<!-- Images. -->

<!-- URLs. -->
[Get started with Mobile Services]: ../tutorials/mobile-services-get-started-XXXXX.md
[Mobile Services SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[Get started with authentication]: ./mobile-services-get-started-with-users-XXXXX.md