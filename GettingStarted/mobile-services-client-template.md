<properties linkid="mobile-services-how-to-XXXXX-client" urlDisplayName="XXXXX Client Library" pageTitle="How to use the XXXXX client library - Windows Azure Mobile Services feature guide" metaKeywords="Windows Azure Mobile Services, Mobile Service XXXXX client library, XXXXX client library" writer="glenga" metaDescription="Learn how to use the XXXXX client library for Windows Azure Mobile Services." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />



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
	- [Cache authentication tokens]
- [How to: Handle errors]
- [How to: Design unit tests]
- [How to: Customize the client]
	- [Customize request headers]
	- [Customize data type serialization]
- [Next steps][]

<div chunk="../chunks/mobile-services-concepts.md" />

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

Mobile Services supports the following existing identity providers that you can use to authenticate users:

- Facebook
- Google 
- Microsoft Account
- Twitter

You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the ID of an authenticated user to modify requests. For more information, see [Get started with authentication].

Topics in this section describe authentication behaviors that are not covered in the tutorials.

###<a name="caching-tokens"></a>How to: Cache authentication tokens

_This section shows how to cache an authentication token. Do this to prevent users from having to authenticate again (if app is "hibernated") while the token is still vaid. This will include info on expiring tokens, check with existing unified content._

<h2><a name="errors"></a><span class="short-header">Error handling</span>How to: Handle errors</h2>

_This section shows how to perform property error handling._

<h2><a name="#unit-testing"></a><span class="short-header">Designing tests</span>How to: Design unit tests</h2>

_(Optional) This section shows how to write unit test when using the client library (info from Yavor)._

<h2><a name="#customizing"></a><span class="short-header">Customizing the client</span>How to: Customize the client</h2>

_(Optional) This section shows how to send customize client behaviors._

###<a name="custom-headers"></a>How to: Customize request headers

_(Optional) This section shows how to send custom request headers._

For more information see, New topic about processing headers in the server-side.

###<a name="custom-serialization"></a>How to: Customize serialization

_(Optional) This section shows how to use attributes to customize how data types are serialized._

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
[Cache authentication tokens]: #caching-tokens
[How to: Upload images and large files]: #blobs
[How to: Handle errors]: #errors
[How to: Design unit tests]: #unit-testing 
[How to: Customize the client]: #customizing
[Customize request headers]: #custom-headers
[Customize data type serialization]: #custom-serialization
[Next Steps]: #next-steps

<!-- Images. -->

<!-- URLs. -->
[Get started with Mobile Services]: ../tutorials/mobile-services-get-started-XXXXX.md
[Mobile Services SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
[Get started with authentication]: ./mobile-services-get-started-with-users-XXXXX.md