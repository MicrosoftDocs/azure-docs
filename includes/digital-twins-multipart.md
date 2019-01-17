---
 title: include file
 description: include file
 services: digital-twins
 author: kingdomofends
 ms.service: digital-twins
 ms.topic: include
 ms.date: 01/11/2019
 ms.author: adgera
 ms.custom: include file
---

> [!NOTE]
> Multipart requests typically require three pieces:
> * A **Content-Type** header:
>   * `application/json; charset=utf-8`
>   * `multipart/form-data; boundary="USER_DEFINED_BOUNDARY"`
> * A **Content-Disposition**:
>   * `form-data; name="metadata"`
> * The file content to upload
>
> **Content-Type** and **Content-Disposition** will vary depending on use scenario.

Multipart requests can be made programmatically (through C#), through a REST client, or tool such as [Postman](https://docs.microsoft.com/azure/digital-twins/how-to-configure-postman#multi). REST client tools may have varying levels of support for complex multipart requests. Configuration settings may also vary slightly from tool to tool. Verify which tool is best suited for your needs.

> [!IMPORTANT]
> Multipart requests made to the Azure Digital Twins Management APIs typically have two parts:
> * Blob metadata (such as an associated MIME type) that's declared by **Content-Type** and/or **Content-Disposition**
> * Blob contents which include the unstructured contents of a file to be uploaded
>
> Neither of the two parts is required for **PATCH** requests. Both are required for **POST** or create operations.

The [Occupancy Quickstart source code](https://github.com/Azure-Samples/digital-twins-samples-csharp/blob/master/occupancy-quickstart/src/api/update.cs) contains complete C# examples demonstrating how to make multipart requests against the Azure Digital Twins Management APIs.