---
title: Calling Azure Storage Services REST API operations including authentication | Microsoft Docs
description: Calling Azure Storage Services REST API operations including authentication
services: storage
author: tamram
ms.service: storage
ms.topic: how-to
ms.date: 05/22/2018
ms.author: tamram
ms.component: common
---

# Using the Azure Storage REST API

This article shows you how to use the Blob Storage Service REST APIs and how to authenticate the call to the service. It is written from the point of view of someone who knows nothing about REST and no idea how to make a REST call, but is a developer. We look at the reference documentation for a REST call and see how to translate it into an actual REST call – which fields go where? After learning how to set up a REST call, you can leverage this knowledge to use any of the other Storage Service REST APIs.

## Prerequisites 

The application lists the containers in blob storage for a storage account. To try out the code in this article, you need the following items: 

* Install [Visual Studio 2017](https://www.visualstudio.com/visual-studio-homepage-vs.aspx) with the following workload:
    - Azure development

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* A general-purpose storage account. If you don't yet have a storage account, see [Create a storage account](storage-quickstart-create-account.md).

* The example in this article shows how to list the containers in a storage account. To see output, add some containers to blob storage in the storage account before you start.

## Download the sample application

The sample application is a console application written in C#.

Use [git](https://git-scm.com/) to download a copy of the application to your development environment. 

```bash
git clone https://github.com/Azure-Samples/storage-dotnet-rest-api-with-auth.git
```

This command clones the repository to your local git folder. To open the Visual Studio solution, look for the storage-dotnet-rest-api-with-auth folder, open it, and double-click on StorageRestApiAuth.sln. 

## What is REST?

REST means *representational state transfer*. For a specific definition, check out [Wikipedia](http://en.wikipedia.org/wiki/Representational_state_transfer).

Basically, REST is an architecture you can use when calling APIs or making APIs available to be called. It is independent of what's happening on either side, and what other software is being used when sending or receiving the REST calls. You can write an application that runs on a Mac, Windows, Linux, an Android phone or tablet, iPhone, iPod, or web site, and use the same REST API for all of those platforms. Data can be passed in and/or out when the REST API is called. The REST API doesn't care from what platform it's called – what's important is the information passed in the request and the data provided in the response.

Knowing how to use REST is a useful skill. The Azure product team frequently releases new features. Many times, the new features are accessible through the REST interface, but have not yet been surfaced through **all** of the storage client libraries or the UI (such as the Azure portal). If you always want to use the latest and greatest, learning REST is a requirement. Also, if you want to write your own library to interact with Azure Storage, or you want to access Azure Storage with a programming language that does not have an SDK or storage client library, you can use the REST API.

## About the sample application

The sample application lists the containers in a storage account. Once you understand how the information in the REST API documentation correlates to your actual code, other REST calls are easier to figure out. 

If you look at the [Blob Service REST
API](/rest/api/storageservices/Blob-Service-REST-API), you see all of the operations you can perform on blob storage. The storage client libraries are wrappers around the REST APIs – they make it easy for you to access storage without using the REST APIs directly. But as noted above, sometimes you want to use the REST API instead of a storage client library.

## REST API Reference: List Containers API

Let's look at the page in the REST API Reference for the [ListContainers](/rest/api/storageservices/List-Containers2) operation so you understand where some of the fields come from in the request and response in the next section with the code.

**Request Method**: GET. This verb is the HTTP method you specify as a property of the request object. Other values for this verb include HEAD, PUT, and DELETE, depending on the API you are calling.

**Request URI**: https://myaccount.blob.core.windows.net/?comp=list  This is created from the blob storage account endpoint `http://myaccount.blob.core.windows.net` and the resource string `/?comp=list`.

[URI parameters](/rest/api/storageservices/List-Containers2#uri-parameters): There are additional query parameters you can use when calling ListContainers. A couple of these parameters are *timeout* for the call (in seconds) and *prefix*, which is used for filtering.

Another helpful parameter is *maxresults:* if more containers are available than this value, the response body will contain a *NextMarker* element that indicates the next container to return on the next request. To use this feature, you provide the *NextMarker* value as the *marker* parameter in the URI when you make the next request. When using this feature, it is analogous to paging through the results. 

To use additional parameters, append them to the resource string with the value, like this example:

```
/?comp=list&timeout=60&maxresults=100
```

[Request Headers](/rest/api/storageservices/List-Containers2#request-headers)**:**
This section lists the required and optional request headers. Three of the headers are required: an *Authorization* header, *x-ms-date* (contains the UTC time for the request), and *x-ms-version* (specifies the version of the REST API to use). Including *x-ms-client-request-id* in the headers is optional – you can set the value for this field to anything; it is written to the storage analytics logs when logging is enabled.

[Request Body](/rest/api/storageservices/List-Containers2#request-body)**:**
There is no request body for ListContainers. Request Body is used on all of the PUT operations when uploading blobs, as well as SetContainerAccessPolicy, which allows you to send in an XML list of stored access policies to apply. Stored access policies are discussed in the article [Using Shared Access Signatures (SAS)](storage-dotnet-shared-access-signature-part-1.md).

[Response Status Code](/rest/api/storageservices/List-Containers2#status-code)**:**
Tells of any status codes you need to know. In this example, an HTTP status code of 200 is ok. For a complete list of HTTP status codes, check out [Status Code Definitions](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html). To see error codes specific to the Storage REST APIs, see [Common REST API error codes](/rest/api/storageservices/common-rest-api-error-codes)

[Response Headers](/rest/api/storageservices/List-Containers2#response-headers)**:**
These include *Content Type*; *x-ms-request-id* (the request id you passed in, if applicable); *x-ms-version* (indicates the version of the Blob service used), and the *Date* (UTC, tells what time the request was made).

[Response Body](/rest/api/storageservices/List-Containers2#response-body):
This field is an XML structure providing the data requested. In this example, the response is a list of containers and their properties.

## Creating the REST request

A couple of notes before starting – for security when running in production, always use HTTPS rather than HTTP. For the purposes of this exercise, you should use HTTP so you can view the request and response data. To view the request and response information in the actual REST calls, you can download [Fiddler](http://www.telerik.com/fiddler) or a similar application. In the Visual Studio solution, the storage account name and key are hardcoded in the class, and the ListContainersAsyncREST method passes the storage account name and storage account key to the methods that are used to create the various components of the REST request. In a real world application, the storage account name and key would reside in a configuration file, environment variables, or be retrieved from an Azure Key Vault.

In our sample project, the code for creating the Authorization header is in a separate class, with the idea that you could take the whole class and add it to your own solution and use it "as is." The Authorization header code works for most REST API calls to Azure Storage.

To build the request, which is an HttpRequestMessage object, go to ListContainersAsyncREST in Program.cs. The steps for building the request are: 

* Create the URI to be used for calling the service. 
* Create the HttpRequestMessage object and set the payload. The payload is null for ListContainersAsyncREST because we're not passing anything in.
* Add the request headers for x-ms-date and x-ms-version.
* Get the authorization header and add it.

Some basic information you need: 

*  For ListContainers, the **method** is `GET`. This value is set when instantiating the request. 
*  The **resource** is the query portion of the URI that indicates which API is being called, so the value is `/?comp=list`. As noted earlier, the resource is on the reference documentation page that shows the information about the [ListContainers API](/rest/api/storageservices/List-Containers2).
*  The URI is constructed by creating the Blob service endpoint for that storage account and concatenating the resource. The value for **request URI** ends up being `http://contosorest.blob.core.windows.net/?comp=list`.
*  For ListContainers, **requestBody** is null and there are no extra **headers**.

Different APIs may have other parameters to pass in such as *ifMatch*. An example of where you might use ifMatch  is when calling PutBlob. In that case, you set ifMatch to an eTag, and it only updates the blob if the eTag you provide matches the current eTag on the blob. If someone else has updated the blob since retrieving the eTag, their change won't be overridden. 

First, set the `uri` and the `payload`. 

```csharp
// Construct the URI. This will look like this:
//   https://myaccount.blob.core.windows.net/resource
String uri = string.Format("http://{0}.blob.core.windows.net?comp=list", storageAccountName);

// Set this to whatever payload you desire. Ours is null because 
//   we're not passing anything in.
Byte[] requestPayload = null;
```

Next, instantiate the request, setting the method to `GET` and providing the URI.

```csharp 
//Instantiate the request message with a null payload.
using (var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, uri)
{ Content = (requestPayload == null) ? null : new ByteArrayContent(requestPayload) })
{
```

Add the request headers for x-ms-date and x-ms-version. This place in the code is also where you add any additional request headers required for the call. In this example, there are no additional headers. An example of an API that passes in extra headers is SetContainerACL. For Blob storage, it adds a header called "x-ms-blob-public-access" and the value for the access level.

```csharp
    // Add the request headers for x-ms-date and x-ms-version.
    DateTime now = DateTime.UtcNow;
    httpRequestMessage.Headers.Add("x-ms-date", now.ToString("R", CultureInfo.InvariantCulture));
    httpRequestMessage.Headers.Add("x-ms-version", "2017-07-29");
    // If you need any additional headers, add them here before creating
    //   the authorization header. 
```

Call the method that creates the authorization header and add it to the request headers. You'll see how to create the authorization header later in the article. The method name is GetAuthorizationHeader, which you can see in this code snippet:

```csharp
    // Get the authorization header and add it.
    httpRequestMessage.Headers.Authorization = AzureStorageAuthenticationHelper.GetAuthorizationHeader(
        storageAccountName, storageAccountKey, now, httpRequestMessage);
```

At this point, `httpRequestMessage` contains the REST request complete with the authorization headers. 

## Call the REST API with the request

Now that you have the request, you can call SendAsync to send the REST request. SendAsync calls the API and gets the response back. Examine the response StatusCode (200 is OK), then parse the response. In this case, you get an XML list of containers. Let's look at the code for calling the GetRESTRequest method to create the request, execute the request, and then examine the response for the list of containers.

```csharp 
    // Send the request.
    using (HttpResponseMessage httpResponseMessage = 
      await new HttpClient().SendAsync(httpRequestMessage, cancellationToken))
    {
        // If successful (status code = 200), 
        //   parse the XML response for the container names.
        if (httpResponseMessage.StatusCode == HttpStatusCode.OK)
        {
            String xmlString = await httpResponseMessage.Content.ReadAsStringAsync();
            XElement x = XElement.Parse(xmlString);
            foreach (XElement container in x.Element("Containers").Elements("Container"))
            {
                Console.WriteLine("Container name = {0}", container.Element("Name").Value);
            }
        }
    }
}
```

If you run a network sniffer such as [Fiddler](https://www.telerik.com/fiddler) when making the call to SendAsync, you can see the request and response information. Let's take a look. The name of the storage account is *contosorest*.

**Request:**

```
GET /?comp=list HTTP/1.1
```

**Request Headers:**

```
x-ms-date: Thu, 16 Nov 2017 23:34:04 GMT
x-ms-version: 2014-02-14
Authorization: SharedKey contosorest:1dVlYJWWJAOSHTCPGiwdX1rOS8B4fenYP/VrU0LfzQk=
Host: contosorest.blob.core.windows.net
Connection: Keep-Alive
```

**Status code and response headers returned after execution:**

```
HTTP/1.1 200 OK
Content-Type: application/xml
Server: Windows-Azure-Blob/1.0 Microsoft-HTTPAPI/2.0
x-ms-request-id: 3e889876-001e-0039-6a3a-5f4396000000
x-ms-version: 2017-07-29
Date: Fri, 17 Nov 2017 00:23:42 GMT
Content-Length: 1511
```

**Response body (XML):** For ListContainers, this shows the list of containers and their properties.

```xml  
<?xml version="1.0" encoding="utf-8"?>
<EnumerationResults 
  ServiceEndpoint="http://contosorest.blob.core.windows.net/">
  <Containers>
    <Container>
      <Name>container-1</Name>
      <Properties>
        <Last-Modified>Thu, 16 Mar 2017 22:39:48 GMT</Last-Modified>
        <Etag>"0x8D46CBD5A7C301D"</Etag>
        <LeaseStatus>unlocked</LeaseStatus>
        <LeaseState>available</LeaseState>
      </Properties>
    </Container>
    <Container>
      <Name>container-2</Name>
      <Properties>
        <Last-Modified>Thu, 16 Mar 2017 22:40:50 GMT</Last-Modified>
        <Etag>"0x8D46CBD7F49E9BD"</Etag>
        <LeaseStatus>unlocked</LeaseStatus>
        <LeaseState>available</LeaseState>
      </Properties>
    </Container>
    <Container>
      <Name>container-3</Name>
      <Properties>
        <Last-Modified>Thu, 16 Mar 2017 22:41:10 GMT</Last-Modified>
        <Etag>"0x8D46CBD8B243D68"</Etag>
        <LeaseStatus>unlocked</LeaseStatus>
        <LeaseState>available</LeaseState>
      </Properties>
    </Container>
    <Container>
      <Name>container-4</Name>
      <Properties>
        <Last-Modified>Thu, 16 Mar 2017 22:41:25 GMT</Last-Modified>
        <Etag>"0x8D46CBD93FED46F"</Etag>
        <LeaseStatus>unlocked</LeaseStatus>
        <LeaseState>available</LeaseState>
        </Properties>
      </Container>
      <Container>
        <Name>container-5</Name>
        <Properties>
          <Last-Modified>Thu, 16 Mar 2017 22:41:39 GMT</Last-Modified>
          <Etag>"0x8D46CBD9C762815"</Etag>
          <LeaseStatus>unlocked</LeaseStatus>
          <LeaseState>available</LeaseState>
        </Properties>
      </Container>
  </Containers>
  <NextMarker />
</EnumerationResults>
```

Now that you understand how to create the request, call the service, and parse the results, let's see how to create the authorization header. Creating that header is complicated, but the good news is that once you have the code working, it works for all of the Storage Service REST APIs.

## Creating the authorization header

> [!TIP]
> Azure Storage now supports Azure Active Directory (Azure AD) integration for the Blob and Queue services (Preview). Azure AD offers a much simpler experience for authorizing a request to Azure Storage. For more information on using Azure AD to authorize REST operations, see [Authenticate with Azure Active Directory (Preview)](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory). For an overview of Azure AD integration with Azure Storage, see [Authenticate access to Azure Storage using Azure Active Directory (Preview)](storage-auth-aad.md).

There is an article that explains conceptually (no code) how to perform [Authentication for the Azure Storage Services](/rest/api/storageservices/Authorization-for-the-Azure-Storage-Services).
Let's distill that article down to exactly is needed and show the code.

First, use a Shared Key authentication. The authorization header format looks like this:

```  
Authorization="SharedKey <storage account name>:<signature>"  
```

The signature field is a Hash-based Message Authentication Code (HMAC) created from the request and calculated using the SHA256 algorithm, then encoded using Base64 encoding. Got that? (Hang in there, you haven't even heard the word *canonicalized* yet.)

This code snippet shows the format of the Shared Key signature string:

```csharp  
StringToSign = VERB + "\n" +  
               Content-Encoding + "\n" +  
               Content-Language + "\n" +  
               Content-Length + "\n" +  
               Content-MD5 + "\n" +  
               Content-Type + "\n" +  
               Date + "\n" +  
               If-Modified-Since + "\n" +  
               If-Match + "\n" +  
               If-None-Match + "\n" +  
               If-Unmodified-Since + "\n" +  
               Range + "\n" +  
               CanonicalizedHeaders +  
               CanonicalizedResource;  
```

Most of these fields are rarely used. For Blob storage, you specify VERB, md5, content length, Canonicalized Headers, and Canonicalized Resource. You can leave the others blank (but put in the `\n` so it knows they are blank).

What are CanonicalizedHeaders and CanonicalizedResource? Good question. In fact, what does canonicalized mean? Microsoft Word doesn't even recognize it as a word. Here's what [Wikipedia says about canonicalization](http://en.wikipedia.org/wiki/Canonicalization): *In computer science, canonicalization (sometimes standardization or normalization) is a process for converting data that has more than one possible representation into a "standard", "normal", or canonical form.* In normal-speak, this means to take the list of items (such as headers in the case of Canonicalized Headers) and standardize them into a required format. Basically, Microsoft decided on a format and you need to match it.

Let's start with those two canonicalized fields, because they are required to create the Authorization header.

**Canonicalized Headers**

To create this value, retrieve the headers that start with "x-ms-" and sort them, then format them into a string of `[key:value\n]` instances, concatenated into one string. For this example, the canonicalized headers look like this: 

```
x-ms-date:Fri, 17 Nov 2017 00:44:48 GMT\nx-ms-version:2017-07-29\n
```

Here's the code used to create that output:

```csharp 
private static string GetCanonicalizedHeaders(HttpRequestMessage httpRequestMessage)
{
    var headers = from kvp in httpRequestMessage.Headers
                    where kvp.Key.StartsWith("x-ms-", StringComparison.OrdinalIgnoreCase)
                    orderby kvp.Key
                    select new { Key = kvp.Key.ToLowerInvariant(), kvp.Value };

    StringBuilder sb = new StringBuilder();

    // Create the string in the right format; this is what makes the headers "canonicalized" --
    //   it means put in a standard format. http://en.wikipedia.org/wiki/Canonicalization
    foreach (var kvp in headers)
    {
        StringBuilder headerBuilder = new StringBuilder(kvp.Key);
        char separator = ':';

        // Get the value for each header, strip out \r\n if found, then append it with the key.
        foreach (string headerValues in kvp.Value)
        {
            string trimmedValue = headerValues.TrimStart().Replace("\r\n", String.Empty);
            headerBuilder.Append(separator).Append(trimmedValue);

            // Set this to a comma; this will only be used 
            //   if there are multiple values for one of the headers.
            separator = ',';
        }
        sb.Append(headerBuilder.ToString()).Append("\n");
    }
    return sb.ToString();
}      
```

**Canonicalized Resource**

This part of the signature string represents the storage account targeted by the request. Remember that the Request URI is
`<http://contosorest.blob.core.windows.net/?comp=list>`, with the actual account name (`contosorest` in this case). In this example, this is returned:

```
/contosorest/\ncomp:list
```

If you have query parameters, this includes those as well. Here's the code, which also handles additional query parameters and query parameters with multiple values. Remember that you're building this code to work for all of the REST APIs, so you want to include all possibilities, even if the ListContainers method doesn't need all of them.

```csharp 
private static string GetCanonicalizedResource(Uri address, string storageAccountName)
{
    // The absolute path will be "/" because for we're getting a list of containers.
    StringBuilder sb = new StringBuilder("/").Append(storageAccountName).Append(address.AbsolutePath);

    // Address.Query is the resource, such as "?comp=list".
    // This ends up with a NameValueCollection with 1 entry having key=comp, value=list.
    // It will have more entries if you have more query parameters.
    NameValueCollection values = HttpUtility.ParseQueryString(address.Query);

    foreach (var item in values.AllKeys.OrderBy(k => k))
    {
        sb.Append('\n').Append(item).Append(':').Append(values[item]);
    }

    return sb.ToString();
}
```

Now that the canonicalized strings are set, let's look at how to create the authorization header itself. You start by creating a string of the message signature in the format of StringToSign previously displayed in this article. This concept is easier to explain using comments in the code, so here it is, the final method that returns the Authorization Header:

```csharp
internal static AuthenticationHeaderValue GetAuthorizationHeader(
    string storageAccountName, string storageAccountKey, DateTime now,
    HttpRequestMessage httpRequestMessage, string ifMatch = "", string md5 = "")
{
    // This is the raw representation of the message signature.
    HttpMethod method = httpRequestMessage.Method;
    String MessageSignature = String.Format("{0}\n\n\n{1}\n{5}\n\n\n\n{2}\n\n\n\n{3}{4}",
                method.ToString(),
                (method == HttpMethod.Get || method == HttpMethod.Head) ? String.Empty
                  : httpRequestMessage.Content.Headers.ContentLength.ToString(),
                ifMatch,
                GetCanonicalizedHeaders(httpRequestMessage),
                GetCanonicalizedResource(httpRequestMessage.RequestUri, storageAccountName),
                md5);

    // Now turn it into a byte array.
    byte[] SignatureBytes = Encoding.UTF8.GetBytes(MessageSignature);

    // Create the HMACSHA256 version of the storage key.
    HMACSHA256 SHA256 = new HMACSHA256(Convert.FromBase64String(storageAccountKey));

    // Compute the hash of the SignatureBytes and convert it to a base64 string.
    string signature = Convert.ToBase64String(SHA256.ComputeHash(SignatureBytes));

    // This is the actual header that will be added to the list of request headers.
    AuthenticationHeaderValue authHV = new AuthenticationHeaderValue("SharedKey",
        storageAccountName + ":" + Convert.ToBase64String(SHA256.ComputeHash(SignatureBytes)));
    return authHV;
}
```

When you run this code, the resulting MessageSignature looks like this:

```
GET\n\n\n\n\n\n\n\n\n\n\n\nx-ms-date:Fri, 17 Nov 2017 01:07:37 GMT\nx-ms-version:2017-07-29\n/contosorest/\ncomp:list
```

Here's the final value for AuthorizationHeader:

```
SharedKey contosorest:Ms5sfwkA8nqTRw7Uury4MPHqM6Rj2nfgbYNvUKOa67w=
```

The AuthorizationHeader is the last header placed in the request headers before posting the response.

That covers everything you need to know, along with the code, to put together a class you can use to create a request to be used to call the Storage Services REST APIs.

## How about another example? 

Let's look at how to change the code to call ListBlobs for container *container-1*. This is almost identical to the code for listing containers, the only differences being the URI and how you parse the response. 

If you look at the reference documentation for [ListBlobs](/rest/api/storageservices/List-Blobs), you find that the method is *GET* and the RequestURI is:

```
https://myaccount.blob.core.windows.net/container-1?restype=container&comp=list
```

In ListContainersAsyncREST, change the code that sets the URI to the API for ListBlobs. The container name is **container-1**.

```csharp
String uri = 
    string.Format("http://{0}.blob.core.windows.net/container-1?restype=container&comp=list",
      storageAccountName);

```

Then where you handle the response, change the code to look for blobs instead of containers.

```csharp
foreach (XElement container in x.Element("Blobs").Elements("Blob"))
{
    Console.WriteLine("Blob name = {0}", container.Element("Name").Value);
}
```

When you run this sample, you get results like the following:

**Canonicalized Headers:**

```
x-ms-date:Fri, 17 Nov 2017 05:16:48 GMT\nx-ms-version:2017-07-29\n
```

**Canonicalized Resource:**

```
/contosorest/container-1\ncomp:list\nrestype:container
```

**MessageSignature:**

```
GET\n\n\n\n\n\n\n\n\n\n\n\nx-ms-date:Fri, 17 Nov 2017 05:16:48 GMT
  \nx-ms-version:2017-07-29\n/contosorest/container-1\ncomp:list\nrestype:container
```

**AuthorizationHeader:**

```
SharedKey contosorest:uzvWZN1WUIv2LYC6e3En10/7EIQJ5X9KtFQqrZkxi6s=
```

The following values are from [Fiddler](http://www.telerik.com/fiddler):

**Request:**

```
GET http://contosorest.blob.core.windows.net/container-1?restype=container&comp=list HTTP/1.1
```

**Request Headers:**

```
x-ms-date: Fri, 17 Nov 2017 05:16:48 GMT
x-ms-version: 2017-07-29
Authorization: SharedKey contosorest:uzvWZN1WUIv2LYC6e3En10/7EIQJ5X9KtFQqrZkxi6s=
Host: contosorest.blob.core.windows.net
Connection: Keep-Alive
```

**Status code and response headers returned after execution:**

```
HTTP/1.1 200 OK
Content-Type: application/xml
Server: Windows-Azure-Blob/1.0 Microsoft-HTTPAPI/2.0
x-ms-request-id: 7e9316da-001e-0037-4063-5faf9d000000
x-ms-version: 2017-07-29
Date: Fri, 17 Nov 2017 05:20:21 GMT
Content-Length: 1135
```

**Response body (XML):** This XML response shows the list of blobs and their properties. 

```xml
<?xml version="1.0" encoding="utf-8"?>
<EnumerationResults 
    ServiceEndpoint="http://contosorest.blob.core.windows.net/" ContainerName="container-1">
    <Blobs>
        <Blob>
            <Name>DogInCatTree.png</Name>
            <Properties><Last-Modified>Fri, 17 Nov 2017 01:41:14 GMT</Last-Modified>
            <Etag>0x8D52D5C4A4C96B0</Etag>
            <Content-Length>419416</Content-Length>
            <Content-Type>image/png</Content-Type>
            <Content-Encoding />
            <Content-Language />
            <Content-MD5 />
            <Cache-Control />
            <Content-Disposition />
            <BlobType>BlockBlob</BlobType>
            <LeaseStatus>unlocked</LeaseStatus>
            <LeaseState>available</LeaseState>
            <ServerEncrypted>true</ServerEncrypted>
            </Properties>
        </Blob>
        <Blob>
            <Name>GuyEyeingOreos.png</Name>
            <Properties>
                <Last-Modified>Fri, 17 Nov 2017 01:41:14 GMT</Last-Modified>
                <Etag>0x8D52D5C4A25A6F6</Etag>
                <Content-Length>167464</Content-Length>
                <Content-Type>image/png</Content-Type>
                <Content-Encoding />
                <Content-Language />
                <Content-MD5 />
                <Cache-Control />
                <Content-Disposition />
                <BlobType>BlockBlob</BlobType>
                <LeaseStatus>unlocked</LeaseStatus>
                <LeaseState>available</LeaseState>
                <ServerEncrypted>true</ServerEncrypted>
            </Properties>
            </Blob>
        </Blobs>
    <NextMarker />
</EnumerationResults>
```

## Summary

In this article, you learned how to make a request to the blob storage REST API to retrieve a list of containers or a list of blobs in a container. You also learned how to create the authorization signature for the REST API call, how to use it in the REST request, and how to examine the response.

## Next steps

* [Blob Service REST API](/rest/api/storageservices/blob-service-rest-api)
* [File Service REST API](/rest/api/storageservices/file-service-rest-api)
* [Queue Service REST API](/rest/api/storageservices/queue-service-rest-api)