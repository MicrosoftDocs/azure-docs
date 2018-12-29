---
 title: include file
 description: include file
 services: digital-twins
 author: kingdomofends
 ms.service: digital-twins
 ms.topic: include
 ms.date: 12/28/2018
 ms.author: adgera
 ms.custom: include file
---

> [!NOTE]
> Multipart requests require three pieces of information:
> * A **Content-Type** header:
>   * `application/json; charset=utf-8`
>   * `multipart/form-data; boundary="USER_DEFINED_BOUNDARY"`
> * A **Content-Disposition**: `form-data; name="metadata"`
> * The file content to upload
>
> The **Content-Type** and **Content-Disposition** information can vary depending on the use scenario.


> [IMPORTANT]
> Multipart requests made to the Azure Digital Twins Management APIs have two parts:
> * Blob metadata such as an associated MIME type, as shown in the **Content-Type** and **Content-Disposition** information
> * Blob contents (the unstructured contents of the file)
>
> Neither of the two parts is required for **PATCH** requests. Both are required for **POST** or create operations.