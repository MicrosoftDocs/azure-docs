<properties
   pageTitle="Guide to creating a Data Service for the  Marketplace | Microsoft Azure"
   description="Detailed instructions of how to create, certify and deploy a Data Service for purchase on the Azure Marketplace."
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

   <tags
      ms.service="marketplace"
      ms.devlang="na"
      ms.topic="article"
      ms.tgt_pltfrm="na"
      ms.workload="na"
      ms.date="06/29/2016"
      ms.author="hascipio; avikova" />

# Understanding the nodes schema for mapping an existing web service to OData through CSDL
This document will help clarify the node structure for mapping an OData protocol to CSDL. It is important to note that the node structure is well formed XML. So root, parent, and child schema is applicable when designing your OData mapping.

## Ignored elements
The following are the high level CSDL elements (XML nodes) that are not going to be used by the Azure Marketplace backend during the import of the web service’s metadata. They can be present but will be ignored.

| Element | Scope |
|----|----|
| Using Element | The node, sub nodes and all attributes |
| Documentation Element | The node, sub nodes and all attributes |
| ComplexType | The node, sub nodes and all attributes |
| Association Element | The node, sub nodes and all attributes |
| Extended Property | The node, sub nodes and all attributes |
| EntityContainer | Only the following attributes are ignored: *extends* and *AssociationSet* |
| Schema | Only the following attributes are ignored: *Namespace* |
| FunctionImport | Only the following attributes are ignored: *Mode* (default value of ln is assumed) |
| EntityType | Only the following sub nodes are ignored: *Key* and *PropertyRef* |

The following describes the changes (added and ignored elements) to the various CSDL XML nodes in detail.

## FunctionImport node
A FunctionImport node represents one URL (entry point) that exposes a service to the end-user. The node allows describing how the URL is addressed, which parameters are available to the end-user and how these parameters are provided.

Details about this node are found at [here][MSDNFunctionImportLink]

[MSDNFunctionImportLink]:(https://msdn.microsoft.com/library/cc716710(v=vs.100).aspx)

The following are the additional attributes (or additions to attributes) that are exposed by the FunctionImport node:

**d:BaseUri** -
The URI template for the REST resource that is exposed to Marketplace. Marketplace uses the template to construct queries against the REST web service. The URI template contains placeholders for the parameters in the form of {parameterName}, where parameterName is the name of the parameter. Ex. apiVersion={apiVersion}.
Parameters are allowed to appear as URI parameters or as part of the URI path. In the case of the appearance in the path they are always mandatory (can’t be marked as nullable). *Example:* `d:BaseUri="http://api.MyWeb.com/Site/{url}/v1/visits?start={start}&amp;end={end}&amp;ApiKey=3fadcaa&amp;Format=XML"`

**Name** - The name of the imported function.  Cannot be the same as other defined names in the CSDL.  Ex. Name="GetModelUsageFile"

**EntitySet** *(optional)* - If the function returns a collection of entity types, the value of the **EntitySet** must be the entity set to which the collection belongs. Otherwise, the **EntitySet** attribute must not be used. *Example:* `EntitySet="GetUsageStatisticsEntitySet"`

**ReturnType** *(Optional)* - Specifies the type of elements returned by the URI.  Do not use this attribute if the function does not return a value. The following are the supported types:

 - **Collection (<Entity type name>)**: specifies a collection of defined entity types. The name is present in the Name attribute of the EntityType node. An example is Collection(WXC.HourlyResult).
 - **Raw (<mime type>)**: specifies a raw document/blob that is returned to the user. An example is Raw(image/jpeg) Other examples:

  - ReturnType="Raw(text/plain)"
  - ReturnType="Collection(sage.DeleteAllUsageFilesEntity)"*

**d:Paging** - Specifies how paging is handled by the REST resource. The parameter values are used within curly braches, e.g. page={$page}&itemsperpage={$size} The options available are:

- **None:** no paging is available
- **Skip:** paging is expressed through a logical “skip” and “take” (top). Skip jumps over M elements and take then returns the next N elements. Parameter value: $skip
- **Take:** Take returns the next N elements. Parameter value: $take
- **PageSize:** paging is expressed through a logical page and size (items per page). Page represents the current page that is returned. Parameter value: $page
- **Size:** size represents the number of items returned for each page. Parameter value: $size

**d:AllowedHttpMethods** *(Optional)* - Specifies which verb is handled by the REST resource. Also, restricts accepted verb to the specified value.  Default = POST.  *Example:* `d:AllowedHttpMethods="GET"` The options available are:

- **GET:** usually used to return data
- **POST:** usually used to insert new data
- **PUT:** usually used to update data
- **DELETE:** used to delete data

Additional child nodes (not covered by the CSDL documentation) within the FunctionImport node are:

**d:RequestBody** *(Optional)* - The request body is used to indicate that the request expects a body to be sent. Parameters can be given within the request body. They are expressed within curly brackets, e.g. {parameterName}. These parameters are mapped from the user input into the body that is transferred to the content provider’s service. The requestBody element has an attribute with name httpMethod. The attribute allows two values:

- **POST:** Used if the request is a HTTP POST
- **GET:** Used if the request is a HTTP GET

	Example:

        `<d:RequestBody d:httpMethod="POST">
        <![CDATA[
        <req1:Request xmlns:r1="http://schemas.mysite.com//generic/requests/1" Version="1.0">
        <req1:Query>{Query}</req1:Query><req1:AppId>D453474</req1:AppId>
        <req:DestinationSchemas><req1:Schema>Generic.RequestResponse[1.0]</req1:Schema>
        </req1:DestinationSchemas>
        </req1: Request>
        ]]>
        </d:RequestBody>`

**d:Namespaces** and **d:Namespace** - This node describes the namespaces that are defined in the XML that is returned by the function import (URI endpoint). The XML that is returned by the backend service might contain any number of namespaces to differentiate the content that is returned. **All of these namespaces, if used in d:Map or d:Match XPath queries need to be listed.** The d:Namespaces node contains a set/list of d:Namespace nodes. Each of them lists one namespace used in the backend service response. The following are the attribute of the d:Namespace node:

-	**d:Prefix:** The prefix for the namespace, as seen in the XML results returned by the service, e.g. f:FirstName, f:LastName, where f is the prefix.
- **d:Uri:** The full URI of the namespace used in the result document. It represents the value that the prefix is resolved to at runtime.

**d:ErrorHandling** *(Optional)* - This node contains conditions for error handling. Each of the conditions is validated against the result that is returned by the content provider’s service. If a condition matches the proposed HTTP error code an error message is returned to the end-user.

**d:ErrorHandling** *(Optional)* and **d:Condition** *(Optional)* - A condition node holds one condition that is checked in the result returned by the content provider’s service. The following are the **required** attributes:

- **d:Match:** An XPath expression that validates whether a given node/value is present in the content provider’s output XML. The XPath is run against the output and should return true if the condition is a match or false otherwise.
- **d:HttpStatusCode:** The HTTP status code that should be returned by Marketplace in the case the condition matches. Marketplace signalizes errors to the user through HTTP status codes. A list of HTTP status codes are available at http://en.wikipedia.org/wiki/HTTP_status_code
- **d:ErrorMessage:** The error message that is returned – with the HTTP status code – to the end-user. This should be a friendly error message that doesn’t contain any secrets.

**d:Title** *(Optional)* - Allows describing the title of the function. The value for the title is coming from

- The optional map attribute (an xpath) which specifies where to find the title in the response returned from the service request.
- -Or - The title specified as value of the node.

**d:Rights** *(Optional)* - The rights (e.g. copyright) associated with the function. The value for the rights is coming from:

- The optional map attribute (an xpath) which specifies where to find the rights in the response returned from the service request.
-	-Or - The rights specified as value of the node.

**d:Description** *(Optional)* - A short description for the function. The value for the description is coming from

- The optional map attribute (an xpath) which specifies where to find the description in the response returned from the service request.
- -Or – The description specified as value of the node.

**d:EmitSelfLink** - *See above example "FunctionImport for 'Paging' through returned data"*

**d:EncodeParameterValue** - Optional extension to OData

**d:QueryResourceCost** - Optional extension to OData

**d:Map** - Optional extension to OData

**d:Headers** - Optional extension to OData

**d:Headers** - Optional extension to OData

**d:Value** - Optional extension to OData

**d:HttpStatusCode** - Optional extension to OData

**d:ErrorMessage** - Optional Extension to OData

## Parameter node

This node represents one parameter that is exposed as part of the URI template / request body that has been specified in the FunctionImport node.

A very helpful details document page about the “Parameter Element” node is found at [here](http://msdn.microsoft.com/library/ee473431.aspx)  (Use the **Other Version** dropdown to select a different version if necessary to view the documentation). *Example:* `<Parameter Name="Query" Nullable="false" Mode="In" Type="String" d:Description="Query" d:SampleValues="Rudy Duck" d:EncodeParameterValue="true" MaxLength="255" FixedLength="false" Unicode="false" annotation:StoreGeneratedPattern="Identity"/>`

| Parameter Attribute | Is Required | Value |
|----|----|----|
| Name | Yes | The name of the parameter. Case sensitive!  Match the BaseUri case. **Example:** `<Property Name="IsDormant" Type="Byte" />` |
| Type | Yes | The parameter type. The value must be an **EDMSimpleType** or a complex type that is within the scope of the model. For more information, see “6 Supported Parameter/Property types”.  (Case Sensitive! First char is uppercase, rest are lower case.)  Also see,  [Conceptual Model Types (CSDL)][MSDNParameterLink]. **Example:** `<Property Name="LimitedPartnershipID " Type="Int32" />` |
| Mode | No | **In**, Out, or InOut depending on whether the parameter is an input, output, or input/output parameter. (Only “IN” is available in Azure Marketplace.) **Example:** `<Parameter Name="StudentID" Mode="In" Type="Int32" />` |
| MaxLength | No | The maximum allowed length of the parameter. **Example:** `<Property Name="URI" Type="String" MaxLength="100" FixedLength="false" Unicode="false" />` |
| Precision | No | The precision of the parameter. **Example:** `<Property Name="PreviousDate" Type="DateTime" Precision="0" />` |
| Scale | No | The scale of the parameter. **Example:** `<Property Name="SICCode" Type="Decimal" Precision="10" Scale="0" />` |

[MSDNParameterLink]:(http://msdn.microsoft.com/library/bb399548(v=VS.100).aspx)

The following are the attributes that have been added to the CSDL specification:

| Parameter Attribute | Description |
|----|----|
| **d:Regex** *(Optional)* | A regex statement used to validate the input value for the parameter. If the input value doesn’t match the statement the value is rejected. This allows to specify also a set of possible values, e.g. ^[0-9]+?$ to only allow numbers. **Example:** `<Parameter Name="name" Mode="In" Type="String" d:Nullable="false" d:Regex="^[a-zA-Z]*$" d:Description="A name that cannot contain any spaces or non-alpha non-English characters" d:SampleValues="George|John|Thomas|James"/>` |
| **d:Enum** *(Optional)* | A pipe separated list of values valid for the parameter. The type of the values needs to match the defined type of the parameter. Example: `english|metric|raw`. Enum will display as a selectable dropdown list of parameters in the UI (service explorer). **Example:** `<Parameter Name="Duration" Type="String" Mode="In" Nullable="true" d:Enum="1year|5years|10years"/>` |
| **d:Nullable** *(Optional)* | Allows defining whether a parameter can be null. The default is: true. However, parameters that are exposed as part of the path in the URI template can’t be null. When the attribute is set to false for these parameters – the user input is overridden. **Example:** `<Parameter Name="BikeType" Type="String" Mode="In" Nullable="false"/>` |
| **d:SampleValue** *(Optional)* | A sample value to display as a note to the Client in the UI.  It is possible to add several values by using a pipe separated list, i.e. `a|b|c` **Example:** `<Parameter Name="BikeOwner" Type="String" Mode="In" d:SampleValues="George|John|Thomas|James"/>` |

## EntityType node

This node represents one of the types that are returned from Marketplace to the end user. It also contains the mapping from the output that is returned by the content provider’s service to the values that are returned to the end-user.

Details about this node are found at [here](http://msdn.microsoft.com/library/bb399206.aspx) (Use the **Other Version** dropdown to select a different version if necessary to view the documentation.)

| Attribute Name | Is Required | Value |
|----|----|----|
| Name | Yes | The name of the entity type. **Example:** `<EntityType Name="ListOfAllEntities" d:Map="//EntityModel">` |
| BaseType | No | The name of another entity type that is the base type of the entity type that is being defined. **Example:** `<EntityType Name="PhoneRecord" BaseType="dqs:RequestRecord">` |

The following are the attributes that have been added to the CSDL specification:

**d:Map** - An XPath expression executed against the service output. The assumption here is that the service output contains a set of elements that repeat, like an ATOM feed where there is a set of entry nodes that repeat. Each of these repeating nodes contains one record. The XPath is then specified to point at the individual repeating node in the content provider’s service result that holds the values for an individual record. Example output from the service:

        `<foo>
          <bar> … content … </bar>
          <bar> … content … </bar>
          <bar> … content … </bar>
        </foo>`

The XPath expression would be /foo/bar because each of the bar node is the repeating node in the output and it contains the actual content that is returned to the end-user.

**Key** - This attribute is ignored by Marketplace. REST based web services, in general don’t expose a primary key.


## Property node

This node contains one property of the record.

Details about this node are found at [http://msdn.microsoft.com/library/bb399546.aspx](http://msdn.microsoft.com/library/bb399546.aspx) (Use the **Other Version** dropdown to select a different version if necessary to view the documentation.) *Example:*
        `<EntityType Name="MetaDataEntityType" d:Map="/MyXMLPath">
        <Property Name="Name" 	Type="String" Nullable="true" d:Map="./Service/Name" d:IsPrimaryKey="true" DefaultValue=”Joe Doh” MaxLength="25" FixedLength="true" />
		...
        </EntityType>`

| AttributeName | Required | Value |
|----|----|----|
| Name | Yes | The name of the property. |
| Type | Yes | The type of the property value. The property value type must be an **EDMSimpleType** or a complex type (indicated by a fully-qualified name) that is within scope of the model. For more information, see Conceptual Model Types (CSDL). |
| Nullable | No | **True** (the default value) or **False** depending on whether the property can have a null value. Note: In the version of CSDL indicated by the [http://schemas.microsoft.com/ado/2006/04/edm](http://schemas.microsoft.com/ado/2006/04/edm) namespace, a complex type property must have Nullable="False". |
| DefaultValue | No | The default value of the property. |
|MaxLength | No | The maximum length of the property value. |
| FixedLength | No | **True** or **False** depending on whether the property value will be stored as a fiexed length string. |
| Precision | No | Refers to the maximum number of digits to retain in the numeric value. |
| Scale | No | Maximum number of decimal places to retain in the numeric value. |
| Unicode | No | **True** or **False** depending on whether the property value be stored as a Unicode string. |
| Collation | No | A string that specifies the collating sequence to be used in the data source. |
| ConcurrencyMode | No | **None** (the default value) or **Fixed**. If the value is set to **Fixed**, the property value will be used in optimistic concurrency checks. |

The following are the additional attributes that have been added to the CSDL specification:

**d:Map** - XPath expression executed against the service output and extracts one property of the output. The XPath specified is relative to the repeating node that has been selected in the EntityType node’s XPath. It is also possible to specify an absolute XPath to allow including a static resource in each of the output nodes, like for example a copyright statement that is only found once in the original service output but should be present in each of the rows in the OData output. Example from the service:

        `<foo>
          <bar>
           <baz0>… value …</baz0>
           <baz1>… value …</baz1>
           <baz2>… value …</baz2>
          </bar>
        </foo>`

The XPath expression here would be ./bar/baz0 to get the baz0 node from the content provider’s service.

**d:CharMaxLength** - For string type, you can specify the max length. See DataService CSDL Example

**d:IsPrimaryKey** - Indicates if the column is the Primary key in the table/view. See DataService CSDL Example.

**d:isExposed** - Determines if the table schema is exposed (generally true). See DataService CSDL Example

**d:IsView** *(Optional)* - true if this is based on a view rather than a table.  See DataService CSDL Example

**d:Tableschema** - See DataService CSDL Example

**d:ColumnName** - Is the name of the column in the table/view.  See DataService CSDL Example

**d:IsReturned** - Is the Boolean that determines if the Service exposes this value to the client.  See DataService CSDL Example

**d:IsQueryable** - Is the Boolean that determines if the column can be used in a database query.   See DataService CSDL Example

**d:OrdinalPosition** - Is the column’s numerical position of appearance, x, in the table or the view, where x is from 1 to the number of columns in the table.  See DataService CSDL Example

**d:DatabaseDataType** - Is the data type of the column in the database, i.e. SQL data type. See DataService CSDL Example

## Supported Parameters/Property Types
The following are the supported types for parameters and properties. (Case sensitive)

| Primitive Types | Description |
|----|----|
| Null | Represents the absence of a value |
| Boolean | Represents the mathematical concept of binary-valued logic|
| Byte | Unsigned 8-bit integer value|
|DateTime| Represents date and time with values ranging from 12:00:00 midnight, January 1, 1753 A.D. through 11:59:59 P.M, December 9999 A.D.|
|Decimal | Represents numeric values with fixed precision and scale. This type can describe a numeric value ranging from negative 10^255 + 1 to positive 10^255 -1|
| Double | Represents a floating point number with 15 digits precision that can represent values with approximate range of ± 2.23e -308 through ± 1.79e +308. **Use Decimal due to Exel export issue**|
| Single | Represents a floating point number with 7 digits precision that can represent values with approximate range of ± 1.18e -38 through ± 3.40e +38|
|Guid |Represents a 16-byte (128-bit) unique identifier value |
|Int16|Represents a signed 16-bit integer value |
|Int32|Represents a signed 32-bit integer value |
|Int64|Represents a signed 64-bit integer value |
|String | Represents fixed- or variable-length character data |


## See Also
- If you are interested in understanding the overall OData mapping process and purpose, read this article [Data Service OData Mapping](marketplace-publishing-data-service-creation-odata-mapping.md) to review definitions, structures, and instructions.
- If you are interested in reviewing examples, read this article [Data Service OData Mapping Examples](marketplace-publishing-data-service-creation-odata-mapping-examples.md) to see sample code and understand code syntax and context.
- To return to the prescribed path for publishing a Data Service to the Azure Marketplace, read this article [Data Service Publishing Guide](marketplace-publishing-data-service-creation.md).
