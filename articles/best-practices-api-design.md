<properties
   pageTitle="API design guidance | Microsoft Azure"
   description="Guidance upon how to create a well designed API."
   services=""
   documentationCenter="na"
   authors="dragon119"
   manager="christb"
   editor=""
   tags=""/>

<tags
   ms.service="best-practice"
   ms.devlang="rest-api"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/13/2016"
   ms.author="masashin"/>

# API design guidance

[AZURE.INCLUDE [pnp-header](../includes/guidance-pnp-header-include.md)]

## Overview

Many modern web-based solutions make the use of web services, hosted by web servers, to provide functionality for remote client applications. The operations that a web service exposes constitute a web API. A well-designed web API should aim to support:

- **Platform independence**. Client applications should be able to utilize the API that the web service provides without requiring how the data or operations that API exposes are physically implemented. This requires that the API abides by common standards that enable a client application and web service to agree on which data formats to use, and the structure of the data that is exchanged between client applications and the web service.

- **Service evolution**. The web service should be able to evolve and add (or remove) functionality independently from client applications. Existing client applications should be able to continue to operate unmodified as the features provided by the web service change. All functionality should also be discoverable, so that client applications can fully utilize it.

The purpose of this guidance is to describe the issues that you should consider when designing a web API.

## Introduction to Representational State Transfer (REST)

In his dissertation in 2000, Roy Fielding proposed an alternative architectural approach to structuring the operations exposed by web services; REST. REST is an architectural style for building distributed systems based on hypermedia. A primary advantage of the REST model is that it is based on open standards and does not bind the implementation of the model or the client applications that access it to any specific implementation. For example, a REST web service could be implemented by using the Microsoft ASP.NET Web API, and client applications could be developed by using any language and toolset that can generate HTTP requests and parse HTTP responses.

> [AZURE.NOTE]: REST is actually independent of any underlying protocol and is not necessarily tied to HTTP. However, most common implementations of systems that are based on REST utilize HTTP as the application protocol for sending and receiving requests. This document focuses on mapping REST principles to systems designed to operate using HTTP.

The REST model uses a navigational scheme to represent objects and services over a network (referred to as _resources_). Many systems that implement REST typically use the HTTP protocol to transmit requests to access these resources. In these systems, a client application submits a request in the form of a URI that identifies a resource, and an HTTP method (the most common being GET, POST, PUT, or DELETE) that indicates the operation to be performed on that resource.  The body of the HTTP request contains the data required to perform the operation. The important point to understand is that REST defines a stateless request model. HTTP requests should be independent and may occur in any order, so attempting to retain transient state information between requests is not feasible.  The only place where information is stored is in the resources themselves, and each request should be an atomic operation. Effectively, a REST model implements a finite state machine where a request transitions a resource from one well-defined non-transient state to another.

> [AZURE.NOTE] The stateless nature of individual requests in the REST model enables a system constructed by following these principles to be highly scalable. There is no need to retain any affinity between a client application making a series of requests and the specific web servers handling those requests.

Another crucial point in implementing an effective REST model is to understand the relationships between the various resources to which the model provides access. These resources are typically organized as collections and relationships. For example, suppose that a quick analysis of an ecommerce system shows that there are two collections in which client applications are likely to be interested: orders and customers. Each order and customer should have its own unique key for identification purposes. The URI to access the collection of orders could be something as simple as _/orders_, and similarly the URI for retrieving all customers could be _/customers_. Issuing an HTTP GET request to the _/orders_ URI should return a list representing all orders in the collection encoded as an HTTP response:

```HTTP
GET http://adventure-works.com/orders HTTP/1.1
...
```

The response shown below encodes the orders as a JSON list structure:

```HTTP
HTTP/1.1 200 OK
...
Date: Fri, 22 Aug 2014 08:49:02 GMT
Content-Length: ...
[{"orderId":1,"orderValue":99.90,"productId":1,"quantity":1},{"orderId":2,"orderValue":10.00,"productId":4,"quantity":2},{"orderId":3,"orderValue":16.60,"productId":2,"quantity":4},{"orderId":4,"orderValue":25.90,"productId":3,"quantity":1},{"orderId":5,"orderValue":99.90,"productId":1,"quantity":1}]
```
To fetch an individual order requires specifying the identifier for the order from the _orders_ resource, such as _/orders/2_:

```HTTP
GET http://adventure-works.com/orders/2 HTTP/1.1
...
```

```HTTP
HTTP/1.1 200 OK
...
Date: Fri, 22 Aug 2014 08:49:02 GMT
Content-Length: ...
{"orderId":2,"orderValue":10.00,"productId":4,"quantity":2}
```

> [AZURE.NOTE] For simplicity, these examples show the information in responses being returned as JSON text data. However, there is no reason why resources should not contain any other type of data supported by HTTP, such as binary or encrypted information; the content-type in the HTTP response should specify the type. Also, a REST model may be able to return the same data in different formats, such as XML or JSON. In this case, the web service should be able to perform content negotiation with the client making the request. The request can include an _Accept_ header which specifies the preferred format that the client would like to receive and the web service should attempt to honor this format if at all possible.

Notice that the response from a REST request makes use of the standard HTTP status codes. For example, a request that returns valid data should include the HTTP response code 200 (OK), while a request that fails to find or delete a specified resource should return a response that includes the HTTP status code 404 (Not Found).

## Design and structure of a RESTful web API

The keys to designing a successful web API are simplicity and consistency. A Web API that exhibits these two factors makes it easier to build client applications that need to consume the API.

A RESTful web API is focused on exposing a set of connected resources, and providing the core operations that enable an application to manipulate these resources and easily navigate between them. For this reason, the URIs that constitute a typical RESTful web API should be oriented towards the data that it exposes, and use the facilities provided by HTTP to operate on this data. This approach requires a different mindset from that typically employed when designing a set of classes in an object-oriented API which tends to be more motivated by the behavior of objects and classes. Additionally, a RESTful web API should be stateless and not depend on operations being invoked in a particular sequence. The following sections summarize the points you should consider when designing a RESTful web API.

### Organizing the web API around resources

> [AZURE.TIP] The URIs exposed by a REST web service should be based on nouns (the data to which the web API provides access) and not verbs (what an application can do with the data).

Focus on the business entities that the web API exposes. For example, in a web API designed to support the ecommerce system described earlier, the primary entities are customers and orders. Processes such as the act of placing an order can be achieved by providing an HTTP POST operation that takes the order information and adds it to the list of orders for the customer. Internally, this POST operation can perform tasks such as checking stock levels, and billing the customer. The HTTP response can indicate whether the order was placed successfully or not. Also note that a resource does not have to be based on a single physical data item. As an example, an order resource might be implemented internally by using information aggregated from many rows spread across several tables in a relational database but presented to the client as a single entity.

> [AZURE.TIP] Avoid designing a REST interface that mirrors or depends on the internal structure of the data that it exposes. REST is about more than implementing simple CRUD (Create, Retrieve, Update, Delete) operations over separate tables in a relational database. The purpose of REST is to map business entities and the operations that an application can perform on these entities to the physical implementation of these entities, but a client should not be exposed to these physical details.

Individual business entities rarely exist in isolation (although some singleton objects may exist), but instead tend to be grouped together into collections. In REST terms, each entity and each collection are resources. In a RESTful web API, each collection has its own URI within the web service, and performing an HTTP GET request over a URI for a collection retrieves a list of items in that collection. Each individual item also has its own URI, and an application can submit another HTTP GET request using that URI to retrieve the details of that item. You should organize the URIs for collections and items in a hierarchical manner. In the ecommerce system, the URI _/customers_ denotes the customer’s collection, and _/customers/5_ retrieves the details for the single customer with the ID 5 from this collection. This approach helps to keep the web API intuitive.

> [AZURE.TIP] Adopt a consistent naming convention in URIs; in general it helps to use plural nouns for URIs that reference collections.

You also need to consider the relationships between different types of resources and how you might expose these associations. For example, customers may place zero or more orders. A natural way to represent this relationship would be through a URI such as _/customers/5/orders_ to find all the orders for customer 5. You might also consider representing the association from an order back to a specific customer through a URI such as _/orders/99/customer_ to find the customer for order 99, but extending this model too far can become cumbersome to implement. A better solution is to provide navigable links to associated resources, such as the customer, in the body of the HTTP response message returned when the order is queried. This mechanism is described in more detail in the section Using the HATEOAS Approach to Enable Navigation To Related Resources later in this guidance.

In more complex systems there may be many more types of entity, and it can be tempting to provide URIs that enable a client application to navigate through several levels of relationships, such as _/customers/1/orders/99/products_ to obtain the list of products in order 99 placed by customer 1. However, this level of complexity can be difficult to maintain and is inflexible if the relationships between resources change in the future. Rather, you should seek to keep URIs relatively simple. Bear in mind that once an application has a reference to a resource, it should be possible to use this reference to find items related to that resource. The preceding query can be replaced with the URI _/customers/1/orders_ to find all the orders for customer 1, and then query the URI _/orders/99/products_ to find the products in this order (assuming order 99 was placed by customer 1).

> [AZURE.TIP] Avoid requiring resource URIs more complex than _collection/item/collection_.

Another point to consider is that all web requests impose a load on the web server, and the greater the number of requests the bigger the load. You should attempt to define your resources to avoid “chatty” web APIs that expose a large number of small resources. Such an API may require a client application to submit multiple requests to find all the data that it requires. It may be beneficial to denormalize data and combine related information together into bigger resources that can be retrieved by issuing a single request. However, you need to balance this approach against the overhead of fetching data that might not be frequently required by the client. Retrieving large objects can increase the latency of a request and incur additional bandwidth costs for little advantage if the additional data is not often used.

Avoid introducing dependencies between the web API to the structure, type, or location of the underlying data sources. For example, if your data is located in a relational database, the web API does not need to expose each table as a collection of resources. Think of the web API as an abstraction of the database, and if necessary introduce a mapping layer between the database and the web API. In this way, if the design or implementation of the database changes (for example, you move from a relational database containing a collection of normalized tables to a denormalized NoSQL storage system such as a document database) client applications are insulated from these changes.
> [AZURE.TIP] The source of the data that underpins a web API does not have to be a data store; it could be another service or line-of-business application or even a legacy application running on-premises within an organization.

Finally, it might not be possible to map every operation implemented by a web API to a specific resource. You can handle such _non-resource_ scenarios through HTTP GET requests that invoke a piece of functionality and return the results as an HTTP response message. A web API that implements simple calculator-style operations such as add and subtract could provide URIs that expose these operations as pseudo resources and utilize the query string to specify the parameters required. For example a GET request to the URI _/add?operand1=99&operand2=1_ could return a response message with the body containing the value 100, and GET request to the URI _/subtract?operand1=50&operand2=20_ could return a response message with the body containing the value 30. However, only use these forms of URIs sparingly.

### Defining operations in terms of HTTP methods

The HTTP protocol defines a number of methods that assign semantic meaning to a request. The common HTTP methods used by most RESTful web APIs are:

- **GET**, to retrieve a copy of the resource at the specified URI. The body of the response message contains the details of the requested resource.

- **POST**, to create a new resource at the specified URI. The body of the request message provides the details of the new resource. Note that POST can also be used to trigger operations that don't actually create resources.

- **PUT**, to replace or update the resource at the specified URI. The body of the request message specifies the resource to be modified and the values to be applied.

- **DELETE**, to remove the resource at the specified URI.

> [AZURE.NOTE] The HTTP protocol also defines other less commonly-used methods, such as PATCH which is used to request selective updates to a resource, HEAD which is used to request a description of a resource, OPTIONS which enables a client information to obtain information about the communication options supported by the server, and TRACE which allows a client to request information that it can use for testing and diagnostics purposes.

The effect of a specific request should depend on whether the resource to which it is applied is a collection or an individual item. The following table summarizes the common conventions adopted by most RESTful implementations using the ecommerce example. Note that not all of these requests might be implemented; it depends on the specific scenario.

| **Resource** | **POST** | **GET** | **PUT** | **DELETE** |
|--------------|----------|---------|---------|------------|
| /customers | Create a new customer | Retrieve all customers | Bulk update of customers (_if implemented_) | Remove all customers |
| /customers/1 | Error | Retrieve the details for customer 1 | Update the details of customer 1 if it exists, otherwise return an error | Remove customer 1 |
| /customers/1/orders | Create a new order for customer 1 | Retrieve all orders for customer 1 | Bulk update of orders for customer 1 (_if implemented_) | Remove all orders for customer 1(_if implemented_) |

The purpose of GET and DELETE requests are relatively straightforward, but there is scope for confusion concerning the purpose and effects of POST and PUT requests.

A POST request should create a new resource with data provided in the body of the request. In the REST model, you frequently apply POST requests to resources that are collections; the new resource is added to the collection.

> [AZURE.NOTE] You can also define POST requests that trigger some functionality (and that don't necessarily return data), and these types of request can be applied to collections. For example you could use a POST request to pass a timesheet to a payroll processing service and get the calculated taxes back as a response.

A PUT request is intended to modify an existing resource. If the specified resource does not exist, the PUT request could return an error (in some cases, it might actually create the resource). PUT requests are most frequently applied to resources that are individual items (such as a specific customer or order), although they can be applied to collections, although this is less-commonly implemented. Note that PUT requests are idempotent whereas POST requests are not; if an application submits the same PUT request multiple times the results should always be the same (the same resource will be modified with the same values), but if an application repeats the same POST request the result will be the creation of multiple resources.

> [AZURE.NOTE] Strictly speaking, an HTTP PUT request replaces an existing resource with the resource specified in the body of the request. If the intention is to modify a selection of properties in a resource but leave other properties unchanged, then this should be implemented by using an HTTP PATCH request. However, many RESTful implementations relax this rule and use PUT for both situations.

### Processing HTTP requests
The data included by a client application in many HTTP requests, and the corresponding response messages from the web server, could be presented in a variety of formats (or media types). For example, the data that specifies the details for a customer or order could be provided as XML, JSON, or some other encoded and compressed format. A RESTful web API should support different media types as requested by the client application that submits a request.

When a client application sends a request that returns data in the body of a message, it can specify the media types it can handle in the Accept header of the request. The following code illustrates an HTTP GET request that retrieves the details of customer 1 and requests the result to be returned as JSON (the client should still examine the media type of the data in the response to verify the format of the data returned):

```HTTP
GET http://adventure-works.com/orders/2 HTTP/1.1
...
Accept: application/json
...
```

If the web server supports this media type, it can reply with a response that includes Content-Type header that specifies the format of the data in the body of the message:

> [AZURE.NOTE] For maximum interoperability, the media types referenced in the Accept and Content-Type headers should be recognized MIME types rather than some custom media type.

```HTTP
HTTP/1.1 200 OK
...
Content-Type: application/json; charset=utf-8
...
Date: Fri, 22 Aug 2014 09:18:37 GMT
Content-Length: ...
{"orderID":2,"productID":4,"quantity":2,"orderValue":10.00}
```

If the web server does not support the requested media type, it can send the data in a different format. IN all cases it must specify the media type (such as _application/json_) in the Content-Type header. It is the responsibility of the client application to parse the response message and interpret the results in the message body appropriately.

Note that in this example, the web server successfully retrieves the requested data and indicates success by passing back a status code of 200 in the response header. If no matching data is found, it should instead return a status code of 404 (not found) and the body of the response message can contain additional information. The format of this information is specified by the Content-Type header, as shown in the following example:

```HTTP
GET http://adventure-works.com/orders/222 HTTP/1.1
...
Accept: application/json
...
```

Order 222 does not exist, so the response message looks like this:

```HTTP
HTTP/1.1 404 Not Found
...
Content-Type: application/json; charset=utf-8
...
Date: Fri, 22 Aug 2014 09:18:37 GMT
Content-Length: ...
{"message":"No such order"}
```

When an application sends an HTTP PUT request to update a resource, it specifies the URI of the resource and provides the data to be modified in the body of the request message. It should also specify the format of this data by using the Content-Type header. A common format used for text-based information is _application/x-www-form-urlencoded_, which comprises a set of name/value pairs separated by the & character. The next example shows an HTTP PUT request that modifies the information in order 1:

```HTTP
PUT http://adventure-works.com/orders/1 HTTP/1.1
...
Content-Type: application/x-www-form-urlencoded
...
Date: Fri, 22 Aug 2014 09:18:37 GMT
Content-Length: ...
ProductID=3&Quantity=5&OrderValue=250
```

If the modification is successful, it should ideally respond with an HTTP 204 status code, indicating that the process has been successfully handled, but that the response body contains no further information. The Location header in the response contains the URI of the newly updated resource:

```HTTP
HTTP/1.1 204 No Content
...
Location: http://adventure-works.com/orders/1
...
Date: Fri, 22 Aug 2014 09:18:37 GMT
```

> [AZURE.TIP] If the data in an HTTP PUT request message includes date and time information, make sure that your web service accepts dates and times formatted following the ISO 8601 standard.

If the resource to be updated does not exist, the web server can respond with a Not Found response as described earlier. Alternatively, if the server actually creates the object itself it could return the status codes HTTP 200 (OK) or HTTP 201 (Created) and the response body could contain the data for the new resource. If the Content-Type header of the request specifies a data format that the web server cannot handle, it should respond with HTTP status code 415 (Unsupported Media Type).

> [AZURE.TIP] Consider implementing bulk HTTP PUT operations that can batch updates to multiple resources in a collection. The PUT request should specify the URI of the collection, and the request body should specify the details of the resources to be modified. This approach can help to reduce chattiness and improve performance.

The format of an HTTP POST requests that create new resources are similar to those of PUT requests; the message body contains the details of the new resource to be added. However, the URI typically specifies the collection to which the resource should be added. The following example creates a new order and adds it to the orders collection:

```HTTP
POST http://adventure-works.com/orders HTTP/1.1
...
Content-Type: application/x-www-form-urlencoded
...
Date: Fri, 22 Aug 2014 09:18:37 GMT
Content-Length: ...
productID=5&quantity=15&orderValue=400
```

If the request is successful, the web server should respond with a message code with HTTP status code 201 (Created). The Location header should contain the URI of the newly created resource, and the body of the response should contain a copy of the new resource; the Content-Type header specifies the format of this data:

```HTTP
HTTP/1.1 201 Created
...
Content-Type: application/json; charset=utf-8
Location: http://adventure-works.com/orders/99
...
Date: Fri, 22 Aug 2014 09:18:37 GMT
Content-Length: ...
{"orderID":99,"productID":5,"quantity":15,"orderValue":400}
```

> [AZURE.TIP] If the data provided by a PUT or POST request is invalid, the web server should respond with a message with HTTP status code 400 (Bad Request). The body of this message can contain additional information about the problem with the request and the formats expected, or it can contain a link to a URL that provides more details.

To remove a resource, an HTTP DELETE request simply provides the URI of the resource to be deleted. The following example attempts to remove order 99:

```HTTP
DELETE http://adventure-works.com/orders/99 HTTP/1.1
...
```

If the delete operation is successful, the web server should respond with HTTP status code 204, indicating that the process has been successfully handled, but that the response body contains no further information (this is the same response returned by a successful PUT operation, but without a Location header as the resource no longer exists.) It is also possible for a DELETE request to return HTTP status code 200 (OK) or 202 (Accepted) if the deletion is performed asynchronously.

```HTTP
HTTP/1.1 204 No Content
...
Date: Fri, 22 Aug 2014 09:18:37 GMT
```

If the resource is not found, the web server should return a 404 (Not Found) message instead.

> [AZURE.TIP] If all the resources in a collection need to be deleted, enable an HTTP DELETE request to be specified for the URI of the collection rather than forcing an application to remove each resource in turn from the collection.

### Filtering and paginating data

You should endeavour to keep the URIs simple and intuitive. Exposing a collection of resources through a single URI assists in this respect, but it can lead to applications fetching large amounts of data when only a subset of the information is required. Generating a large volume of traffic impacts not only the performance and scalability of the web server but also adversely affect the responsiveness of client applications requesting the data.

For example, if orders contain the price paid for the order, a client application that needs to retrieve all orders that have a cost over a specific value might need to retrieve all orders from the _/orders_ URI and then filter these orders locally. Clearly this process is highly inefficient; it wastes network bandwidth and processing power on the server hosting the web API.

One solution may be to provide a URI scheme such as _/orders/ordervalue_greater_than_n_ where _n_ is the order price, but for all but a limited number of prices such an approach is impractical. Additionally, if you need to query orders based on other criteria, you can end up being faced with providing with a long list of URIs with possibly non-intuitive names.

A better strategy to filtering data is to provide the filter criteria in the query string that is passed to the web API, such as _/orders?ordervaluethreshold=n_. In this example, the corresponding operation in the web API is responsible for parsing and handling the `ordervaluethreshold` parameter in the query string and returning the filtered results in the HTTP response.

Some simple HTTP GET requests over collection resources could potentially return a large number of items. To combat the possibility of this occurring you should design the web API to limit the amount of data returned by any single request. You can achieve this by supporting query strings that enable the user to specify the maximum number of items to be retrieved (which could itself be subject to an upperbound limit to help prevent Denial of Service attacks), and a starting offset into the collection. For example, the query string in the URI _/orders?limit=25&offset=50_ should retrieve 25 orders starting with the 50th order found in the orders collection. As with filtering data, the operation that implements the GET request in the web API is responsible for parsing and handling the `limit` and `offset` parameters in the query string. To assist client applications, GET requests that return paginated data should also include some form of metadata that indicate the total number of resources available in the collection. You might also consider other intelligent paging strategies; for more information, see [API Design Notes: Smart Paging](http://bizcoder.com/api-design-notes-smart-paging)

You can follow a similar strategy for sorting data as it is fetched; you could provide a sort parameter that takes a field name as the value, such as _/orders?sort=ProductID_. However, note that this approach can have a deleterious effect on caching (query string parameters form part of the resource identifier used by many cache implementations as the key to cached data).

You can extend this approach to limit (project) the fields returned if a single resource item contains a large amount of data. For example, you could use a query string parameter that accepts a comma-delimited list of fields, such as _/orders?fields=ProductID,Quantity_.

> [AZURE.TIP] Give all optional parameters in query strings meaningful defaults. For example, set the `limit` parameter to 10 and the `offset` parameter to 0 if you implement pagination, set the sort parameter to the key of the resource if you implement ordering, and set the `fields` parameter to all fields in the resource if you support projections.

### Handling large binary resources

A single resource may contain large binary fields, such as files or images. To overcome the transmission problems caused by unreliable and intermittent connections and to improve response times, consider providing operations that enable such resources to be retrieved in chunks by the client application. To do this, the web API should support the Accept-Ranges header for GET requests for large resources, and ideally implement HTTP HEAD requests for these resources. The Accept-Ranges header indicates that the GET operation supports partial results, and that a client application can submit GET requests that return a subset of a resource specified as a range of bytes. A HEAD request is similar to a GET request except that it only returns a header that describes the resource and an empty message body. A client application can issue a HEAD request to determine whether to fetch a resource by using partial GET requests. The following example shows a HEAD request that obtains information about a product image:

```HTTP
HEAD http://adventure-works.com/products/10?fields=productImage HTTP/1.1
...
```

The response message contains a header that includes the size of the resource (4580 bytes), and the Accept-Ranges header that the corresponding GET operation supports partial results:

```HTTP
HTTP/1.1 200 OK
...
Accept-Ranges: bytes
Content-Type: image/jpeg
Content-Length: 4580
...
```

The client application can use this information to construct a series of GET operations to retrieve the image in smaller chunks. The first request fetches the first 2500 bytes by using the Range header:

```HTTP
GET http://adventure-works.com/products/10?fields=productImage HTTP/1.1
Range: bytes=0-2499
...
```

The response message indicates that this is a partial response by returning HTTP status code 206. The Content-Length header specifies the actual number of bytes returned in the message body (not the size of the resource), and the Content-Range header indicates which part of the resource this is (bytes 0-2499 out of 4580):

```HTTP
HTTP/1.1 206 Partial Content
...
Accept-Ranges: bytes
Content-Type: image/jpeg
Content-Length: 2500
Content-Range: bytes 0-2499/4580
...
_{binary data not shown}_
```

A subsequent request from the client application can retrieve the remainder of the resource by using an appropriate Range header:

```HTTP
GET http://adventure-works.com/products/10?fields=productImage HTTP/1.1
Range: bytes=2500-
...
```

The corresponding result message should look like this:

```HTTP
HTTP/1.1 206 Partial Content
...
Accept-Ranges: bytes
Content-Type: image/jpeg
Content-Length: 2080
Content-Range: bytes 2500-4580/4580
...
```

## Using the HATEOAS approach to enable navigation to related resources

One of the primary motivations behind REST is that it should be possible to navigate the entire set of resources without requiring prior knowledge of the URI scheme. Each HTTP GET request should return the information necessary to find the resources related directly to the requested object through hyperlinks included in the response, and it should also be provided with information that describes the operations available on each of these resources. This principle is known as HATEOAS, or Hypertext as the Engine of Application State. The system is effectively a finite state machine, and the response to each request contains the information necessary to move from one state to another; no other information should be necessary.

> [AZURE.NOTE] Currently there are no standards or specifications that define how to model the HATEOAS principle. The examples shown in this section illustrate one possible solution.

As an example, to handle the relationship between customers and orders, the data returned in the response for a specific order should contain URIs in the form of a hyperlink identifying the customer that placed the order, and the operations that can be performed on that customer.

```HTTP
GET http://adventure-works.com/orders/3 HTTP/1.1
Accept: application/json
...
```

The body of the response message contains a `links` array (highlighted in the code example) that specifies the nature of the relationship (_Customer_), the URI of the customer (_http://adventure-works.com/customers/3_), how to retrieve the details of this customer (_GET_), and the MIME types that the web server supports for retrieving this information (_text/xml_ and _application/json_). This is all the information that a client application needs to be able to fetch the details of the customer. Additionally, the Links array also includes links for the other operations that can be performed, such as PUT (to modify the customer, together with the format that the web server expects the client to provide), and DELETE.

```HTTP
HTTP/1.1 200 OK
...
Content-Type: application/json; charset=utf-8
...
Content-Length: ...
{"orderID":3,"productID":2,"quantity":4,"orderValue":16.60,"links":[(some links omitted){"rel":"customer","href":" http://adventure-works.com/customers/3", "action":"GET","types":["text/xml","application/json"]},{"rel":"
customer","href":" http://adventure-works.com /customers/3", "action":"PUT","types":["application/x-www-form-urlencoded"]},{"rel":"customer","href":" http://adventure-works.com /customers/3","action":"DELETE","types":[]}]}
```

For completeness, the Links array should also include self-referencing information pertaining to the resource that has been retrieved. These links have been omitted from the previous example, but are highlighted in the following code. Notice that in these links, the relationship _self_ has been used to indicate that this is a reference to the resource being returned by the operation:

```HTTP
HTTP/1.1 200 OK
...
Content-Type: application/json; charset=utf-8
...
Content-Length: ...
{"orderID":3,"productID":2,"quantity":4,"orderValue":16.60,"links":[{"rel":"self","href":" http://adventure-works.com/orders/3", "action":"GET","types":["text/xml","application/json"]},{"rel":" self","href":" http://adventure-works.com /orders/3", "action":"PUT","types":["application/x-www-form-urlencoded"]},{"rel":"self","href":" http://adventure-works.com /orders/3", "action":"DELETE","types":[]},{"rel":"customer",
"href":" http://adventure-works.com /customers/3", "action":"GET","types":["text/xml","application/json"]},{"rel":" customer" (customer links omitted)}]}
```

For this approach to be effective, client applications must be prepared to retrieve and parse this additional information.

## Versioning a RESTful web API

It is highly unlikely that in all but the simplest of situations that a web API will remain static. As business requirements change new collections of resources may be added, the relationships between resources might change, and the structure of the data in resources might be amended. While updating a web API to handle new or differing requirements is a relatively straightforward process, you must consider the effects that such changes will have on client applications consuming the web API. The issue is that although the developer designing and implementing a web API has full control over that API, the developer does not have the same degree of control over client applications which may be built by third party organizations operating remotely. The primary imperative is to enable existing client applications to continue functioning unchanged while allowing new client applications to take advantage of new features and resources.

Versioning enables a web API to indicate the features and resources that it exposes, and a client application can submit requests that are directed to a specific version of a feature or resource. The following sections describe several different approaches, each of which has its own benefits and trade-offs.

### No versioning

This is the simplest approach, and may be acceptable for some internal APIs. Big changes could be represented as new resources or new links.  Adding content to existing resources might not present a breaking change as client applications that are not expecting to see this content will simply ignore it.

For example, a request to the URI _http://adventure-works.com/customers/3_ should return the details of a single customer containing `id`, `name`, and `address` fields expected by the client application:

```HTTP
HTTP/1.1 200 OK
...
Content-Type: application/json; charset=utf-8
...
Content-Length: ...
{"id":3,"name":"Contoso LLC","address":"1 Microsoft Way Redmond WA 98053"}
```

> [AZURE.NOTE] For the purposes of simplicity and clarity, the example responses shown in this section do not include HATEOAS links.

If the `DateCreated` field is added to the schema of the customer resource, then the response would look like this:

```HTTP
HTTP/1.1 200 OK
...
Content-Type: application/json; charset=utf-8
...
Content-Length: ...
{"id":3,"name":"Contoso LLC","dateCreated":"2014-09-04T12:11:38.0376089Z","address":"1 Microsoft Way Redmond WA 98053"}
```

Existing client applications might continue functioning correctly if they are capable of ignoring unrecognized fields, while new client applications can be designed to handle this new field. However, if more radical changes to the schema of resources occur (such as removing or renaming fields) or the relationships between resources change then these may constitute breaking changes that prevent existing client applications from functioning correctly. In these situations you should consider one of the following approaches.

### URI versioning

Each time you modify the web API or change the schema of resources, you add a version number to the URI for each resource. The previously existing URIs should continue to operate as before, returning resources that conform to their original schema.

Extending the previous example, if the `address` field is restructured into sub-fields containing each constituent part of the address (such as `streetAddress`, `city`, `state`, and `zipCode`), this version of the resource could be exposed through a URI containing a version number, such as http://adventure-works.com/v2/customers/3:

```HTTP
HTTP/1.1 200 OK
...
Content-Type: application/json; charset=utf-8
...
Content-Length: ...
{"id":3,"name":"Contoso LLC","dateCreated":"2014-09-04T12:11:38.0376089Z","address":{"streetAddress":"1 Microsoft Way","city":"Redmond","state":"WA","zipCode":98053}}
```

This versioning mechanism is very simple but depends on the server routing the request to the appropriate endpoint. However, it can become unwieldy as the web API matures through several iterations and the server has to support a number of different versions. Also, from a purist’s point of view, in all cases the client applications are fetching the same data (customer 3), so the URI should not really be different depending on the version. This scheme also complicates implementation of HATEOAS as all links will need to include the version number in their URIs.

### Query string versioning

Rather than providing multiple URIs, you can specify the version of the resource by using a parameter within the query string appended to the HTTP request, such as _http://adventure-works.com/customers/3?version=2_. The version parameter should default to a meaningful value such as 1 if it is omitted by older client applications.

This approach has the semantic advantage that the same resource is always retrieved from the same URI, but it depends on the code that handles the request to parse the query string and send back the appropriate HTTP response. This approach also suffers from the same complications for implementing HATEOAS as the URI versioning mechanism.

> [AZURE.NOTE] Some older web browsers and web proxies will not cache responses for requests that include a query string in the URL. This can have an adverse impact on performance for web applications that use a web API and that run from within such a web browser.

### Header versioning

Rather than appending the version number as a query string parameter, you could implement a custom header that indicates the version of the resource. This approach requires that the client application adds the appropriate header to any requests, although the code handling the client request could use a default value (version 1) if the version header is omitted. The following examples utilize a custom header named _Custom-Header_. The value of this header indicates the version of web API.

Version 1:

```HTTP
GET http://adventure-works.com/customers/3 HTTP/1.1
...
Custom-Header: api-version=1
...
```

```HTTP
HTTP/1.1 200 OK
...
Content-Type: application/json; charset=utf-8
...
Content-Length: ...
{"id":3,"name":"Contoso LLC","address":"1 Microsoft Way Redmond WA 98053"}
```

Version 2:

```HTTP
GET http://adventure-works.com/customers/3 HTTP/1.1
...
Custom-Header: api-version=2
...
```

```HTTP
HTTP/1.1 200 OK
...
Content-Type: application/json; charset=utf-8
...
Content-Length: ...
{"id":3,"name":"Contoso LLC","dateCreated":"2014-09-04T12:11:38.0376089Z","address":{"streetAddress":"1 Microsoft Way","city":"Redmond","state":"WA","zipCode":98053}}
```

Note that as with the previous two approaches, implementing HATEOAS requires including the appropriate custom header in any links.

### Media type versioning

When a client application sends an HTTP GET request to a web server it should stipulate the format of the content that it can handle by using an Accept header, as described earlier in this guidance. Frequently the purpose of the _Accept_ header is to allow the client application to specify whether the body of the response should be XML, JSON, or some other common format that the client can parse. However, it is possible to define custom media types that include information enabling the client application to indicate which version of a resource it is expecting. The following example shows a request that specifies an _Accept_ header with the value _application/vnd.adventure-works.v1+json_. The _vnd.adventure-works.v1_ element indicates to the web server that it should return version 1 of the resource, while the _json_ element specifies that the format of the response body should be JSON:

```HTTP
GET http://adventure-works.com/customers/3 HTTP/1.1
...
Accept: application/vnd.adventure-works.v1+json
...
```

The code handling the request is responsible for processing the _Accept_ header and honoring it as far as possible (the client application may specify multiple formats in the _Accept_ header, in which case the web server can choose the most appropriate format for the response body). The web server confirms the format of the data in the response body by using the Content-Type header:

```HTTP
HTTP/1.1 200 OK
...
Content-Type: application/vnd.adventure-works.v1+json; charset=utf-8
...
Content-Length: ...
{"id":3,"name":"Contoso LLC","address":"1 Microsoft Way Redmond WA 98053"}
```

If the Accept header does not specify any known media types, the web server could generate an HTTP 406 (Not Acceptable) response message or return a message with a default media type.

This approach is arguably the purest of the versioning mechanisms and lends itself naturally to HATEOAS, which can include the MIME type of related data in resource links.

> [AZURE.NOTE] When you select a versioning strategy, you should also consider the implications on performance, especially caching on the web server. The URI versioning and Query String versioning schemes are cache-friendly inasmuch as the same URI/query string combination refers to the same data each time.

> The Header versioning and Media Type versioning mechanisms typically require additional logic to examine the values in the custom header or the Accept header. In a large-scale environment, many clients using different versions of a web API can result in a significant amount of duplicated data in a server-side cache. This issue can become acute if a client application communicates with a web server through a proxy that implements caching, and that only forwards a request to the web server if it does not currently hold a copy of the requested data in its cache.

## More information

- The [RESTful Cookbook](http://restcookbook.com/) contains an introduction to building RESTful APIs.
- The Web [API Checklist](https://mathieu.fenniak.net/the-api-checklist/) contains a useful list of items to consider when designing and implementing a Web API.
