<properties
   pageTitle="Guide to creating a Data Service for the  Marketplace | Microsoft Azure"
   description="Detailed instructions of how to create, certify and deploy a Data Service for purchase on the Azure Marketplace."
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

   <tags
      ms.service="marketplace-publishing"
      ms.devlang="na"
      ms.topic="article"
      ms.tgt_pltfrm="na"
      ms.workload="na"
      ms.date="10/30/2015"
      ms.author="hascipio; avikova" />

# Mapping an existing web service to OData through CSDL
## Introduction

Microsoft’s Azure Marketplace exposes services to the end-users by using the OData protocol. Services that are exposed by content providers (Data Owners) are exposed in a variety of forms, such as REST, SOAP, WCF, etc. This document gives an overview on how to use a CSDL to map an existing service to an OData compatible service. It explains how to create the mapping document (CSDL) that transforms the input request from the client via a service call and the output (data) back to the client via an OData compatible feed.

A CSDL (Conceptual Schema Definition Language) is a specification defining how to describe web service or database service in common XML verbiage to the Azure Marketplace.

Simple overview of the **request flow:**

  Client -> Azure Marketplace -> Content Provider’s Web Service (Get, Post, Delete, Put)

The **data flow** is in the opposite direction:

  Client <- Azure Marketplace <- Content Provider’s WebService

**Figure 1** diagrams how a client would obtain data from a content provider (your service) by going through the Azure Marketplace.  The CSDL is used by the Mapping/Transformation component to handle the request and data pass between the content provider’s service(s) and the requesting client.

*Figure 1: Detailed flow from requesting client to content provider via Azure Marketplace*

  ![drawing](media/marketplace-publishing-data-service-creation-odata-mapping/figure-1.png)

For background on Atom, Atom Pub, and the OData protocol upon which the Azure Marketplace extensions build, please review: [http://msdn.microsoft.com/en-us/library/ff478141.aspx](http://msdn.microsoft.com/en-us/library/ff478141.aspx)

Excerpt from above link:
  	*“The purpose of the Open Data protocol (hereafter referred to as OData) is to provide a REST-based protocol for CRUD-style operations (Create, Read, Update and Delete) against resources exposed as data services. A “data service” is an endpoint where there is data exposed from one or more “collections” each with zero or more “entries”, which consist of typed named-value pairs. OData is published by Microsoft under OASIS (Organization for the Advancement of Structured Information Standards) Standards so that anyone that wants to can build servers, clients or tools without royalties or restrictions.”*

**Three Critical Pieces that have to be defined by the CSDL are:**

- The **endpoint** of the Service Provider
  The Web Address (URI) of the Service
- The **data parameters** being passed as input to the Service Provider
  The definitions of the parameters being sent to the Content Provider’s service down to the data type.
- **Schema** of the data being returned to the Requesting Service
  The schema of the data being delivered by the Content Provider’s service, including Container, collections/tables, variables/columns, and data types.

The following diagram shows an overview of the flow from where the client enters the OData statement (call to the content provider’s web service) to getting the results/data back.

  ![drawing](media/marketplace-publishing-data-service-creation-odata-mapping/figure-2.png)

Steps:

1. Client sends request via Service call complete with Input Parameters defined in XML to the Azure Marketplace
2. CSDL is used to validate the Service call.
a.	The Formatted Service Call is then sent to the Content Providers Service by the Azure Marketplace
3. The Webservice executes and preforms the action of the Http Verb (i.e. GET)
  The data is returned to Azure Marketplace where the requested data (if any) is exposes in XML Format to the Client using the Mapping defined in the CSDL.
4. The Client is sent the data (if any) in XML or JSON format

## Definitions

### OData ATOM pub

An extension to the ATOM pub where each entry represents one row of a result set. The content part of the entry is enhanced to contain the values of the row – as key value pairs. More information is found here:
[https://www.odata.org/documentation/odata-version-3-0/atom-format/](https://www.odata.org/documentation/odata-version-3-0/atom-format/)

### CSDL - Conceptual Schema Definition Language

Allows defining functions (SPROCs) and entities that are exposed through a database. More information found here: [http://msdn.microsoft.com/en-us/library/bb399292.aspx](http://msdn.microsoft.com/en-us/library/bb399292.aspx)  

> [AZURE.TIP] Click the **other versions** dropdown and select a version if you don’t see the article.)

### EDM - Entry Data Model
- Overview: [http://msdn.microsoft.com/en-us/library/vstudio/ee382825(v=vs.100).aspx](http://msdn.microsoft.com/en-us/library/vstudio/ee382825(v=vs.100).aspx)
- Preview: [http://msdn.microsoft.com/en-us/library/aa697428(v=vs.80).aspx](http://msdn.microsoft.com/en-us/library/aa697428(v=vs.80).aspx)
- Data types: [http://msdn.microsoft.com/en-us/library/bb399548(v=VS.100).aspx](http://msdn.microsoft.com/en-us/library/bb399548(v=VS.100).aspx)

The following shows the detailed Left to Right flow from where the client enters the OData statement (call to the content provider’s web service) to getting the results/data back:

  ![drawing](media/marketplace-publishing-data-service-creation-odata-mapping/figure-3.png)


## CSDL Basics

A CSDL (Conceptual Schema Definition Language) is a specification defining how to describe web service or database service in common XML verbiage to the Azure Marketplace. CSDL describes the critical pieces that **makes the passing of data from the Data Source to the Azure Marketplace possible.** The main pieces are described here:

- Interface information describing all publicly available functions (FunctionImport Node)
- Data type information for all message requests(input) and message responses(outputs) (EntityContainer/EntitySet/EntityType Nodes)
- Binding information about the transport protocol to be used (Header Node)
- Address information for locating the specified service (BaseURI attribute)

In a nutshell, the CSDL represents a platform- and language-independent contract between the service requestor and the service provider. Using the CSDL, a client can locate a web service/database service and invoke any of its publicly available functions.

### Relating a CSDL to a Database or a Collection
**The CSDL Specification**

CSDL is XML grammar for describing a web service. The specification itself is divided into 4 major elements:  EntitySet, FunctionImport; NameSpace, and EntityType.

To make this abstraction easier to understand lets relate a CSDL to a table.

Remember;

  CSDL represents a platform- and language-independent contract between the **service requestor** and the **service provider**. Using CSDL, a **client** can locate a **web service/database service** and invoke any of its publicly available **functions.**

For a Data Service the four parts of a CSDL can be thought of in terms of a Database, Table, Column, and Store Procedure.

Relating these as follows for a Data Service:

- EntityContainer  ~=  Database
- EntitySet  ~=  Table
- EntityType  ~= Columns
- FunctionImport  ~=  Stored Procedure

**HTTP Verbs allowed**
- GET – returns values from the db (returns a Collection)
- POST – used to pass data to and optional return values from the db (Create a new entry in the collection, return id/URI)
- DELETE – Deletes data from the DB (Deletes a collection)
- PUT – Update data into a DB (replace a collection or create one)

## Metadata/Mapping Document

The metadata/mapping document is used to map a content provider’s existing web services so that it can be exposed as an OData web service by the Azure Marketplace system. It is based on CSDL and implements a few extensions to CSDL to accommodate the needs of REST based web services exposed through Azure Marketplace. The extensions are found in the [http://schemas.microsoft.com/dallas/2010/04](http://schemas.microsoft.com/dallas/2010/04) namespace.

An example of the CSDL follows:  (Copy and paste the below example CSDL into an XML editor and change to match your Service.  Then paste into CSDL Mapping under DataService tab when creating your service in the  [Azure Marketplace Publishing Portal](https://publish.windowsazure.com)).

**Terms:**
Relating the CSDL terms to the [Publishing Portal](https://publish.windowsazure.com) UI (PPUI) terms.
- Offer “Title” in the PPUI relates to MyWebOffer
- MyCompany in the PPUI relates to Company Name the [Seller Dashboard](https://sellerdashboard.microsoft.com) UI
- Your API relates to a Web or Data Service (a Plan in the PPUI)

**Hierarchy:**
  A Company (Content Provider) owns Offer(s) which have Plan(s), namely service(s), which line up with an API.

**WebService CSDL Example**
Connects to a service that is exposing an web application endpoint (like a c# application)

        <?xml version="1.0" encoding="utf-8"?>
        <!-- The namespace attribute below is used by our system to generate C#. You can change “MyCompany.MyOffer” to something that makes sense for you, but change “MyOffer” consistently throughout the document. -->
        <Schema Namespace="MyCompany.MyWebOffer" Alias="MyOffer" xmlns="http://schemas.microsoft.com/ado/2009/08/edm" xmlns:d="http://schemas.microsoft.com/dallas/2010/04" >
        <!-- EntityContainer groups all the web service calls together into a single offering. Every web service call has a FunctionImport definition. -->
          <EntityContainer Name="MyOffer">
        <!-- EntitySet is defined for CSDL compatibility reasons, not required for ReturnType=”Raw”
        @Name is used as reference by FunctionImport @EntitySet. And is used in the customer facing UI as name of the Service.
        @EntityType is used to point at the type definition near the bottom of this file. -->
            <EntitySet Name="MyEntities" EntityType="MyOffer.MyEntityType" />
        <!-- Add a FunctionImport for every service method. Multiple FunctionImports can share a single return type (EntityType). -->
        <!-- ReturnType is either Raw() for a stream or Collection() for an Atom feed. Ex. of Raw: ReturnType=”Raw(text/plain)” -->
        <!—EntitySet is the entityset defined above, and is needed if ReturnType is not Raw -->
        <!-- BaseURI attribute defines the service call, replace & with the encode value (&amp;).
        In the input name value pairs {param} represents passed in value.
        Or the value can be hard coded as with AccountKey. -->
        <!-- AllowedHttpMethods optional (default = “GET”), allows the CSDL to specifically specify the verb of the service, “Get”, “Post”, “Put”, or “Delete”. -->
        <!-- EncodeParameterValues, True encodes the parameter values, false does not. -->
        <!-- BaseURI is translated into an URITemplate which defines how the web service call is exposed to marketplace customers.
        Ex. https://api.datamarket.azure.com/mycompany/MyOfferPlan?name={name}
        BaseURI is XML encoded, the {...} point to the parameters defined below.
        Marketplace will read the parameters from this URITemplate and fill the values into the corresponding parameters of the BaseUri or RequestBody (below) during calls to your service.  
        It is okay for @d:BaseUri to include information only for Marketplace consumption, it will not be exposed to end users. i.e. the hardcoded AccountKey in the above BaseURI does not show up in the client facing URITemplate. -->
            <FunctionImport Name="MyWebServiceMethod"
                            EntitySet="MyEntities"
                            ReturnType="Collection(MyOffer.MyEntityType)"
        d:AllowedHttpMethods="GET"
        d:EncodeParameterValues="true"
        d:BaseUri="http://services.organization.net/MyServicePath?name={name}&amp;AccountKey=22AC643">
        <!-- Definition of the RequestBody is only required for HTTP POST requests and is optional for HTTP GET requests. -->
        <d:RequestBody d:httpMethod="POST">
                <!-- Use {} for placeholders to insert parameters. -->
                <!-- This example uses SOAP formatting, but any POST body can be used. -->
        	<!-- This example shows how to pass userid and password via the header -->
                <![CDATA[<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:MyOffer="http://services.organization.net/MyServicePath">
                  <soapenv:Header/>
                  <soapenv:Body>
                    <MyOffer:ws_MyWebServiceMethod>
                      <myWebServiceMethodRequest>
                        <!--This information is not exposed to end users. -->
                        <UserId>userid</UserId>
                        <Password>password</Password>
                        <!-- {name} is replaced with the value read from @d:UriTemplate above -->
                        <Name>{name}</Name>
                        <!-- Parameters can be used more than once and are not limited to appearing as the value of an element -->
                        <CustomField Name="{name}" />
                        <MyField>Static content</MyField>
                      </myWebServiceMethodRequest>
                    </MyOffer:ws_MyWebServiceMethod>
                  </soapenv:Body>
                </soapenv:Envelope>      
              ]]>
        </d:RequestBody>
        <!-- Title, Rights and Description are optional and used to specify values to insert into the ATOM feed returned to the end user.  You can specify the element to contain a fixed message by providing a value for the element (this is the default value).  @d:Map is an XPath expression that points into the response returned by your service and is optional.  -->
        <d:Title d:Map="/MyResponse/Title">Default title.</d:Title>
        <d:Rights>© My copyright. This is a fixed response. It is okay to also add a d:Map attribute to override this text.</d:Rights>
        <d:Description d:Map="/MyResponse/Description"></d:Description>
        <d:Namespaces>
        <d:Namespace d:Prefix="p"  d:Uri="http://schemas.organization.net/2010/04/myNamespace" />
        <d:Namespace d:Prefix="p2" d:Uri="http://schemas.organization.net/2010/04/MyNamespace2" />
        </d:Namespaces>
        <!-- Parameters of the web service call:
        @Name should match exactly (case sensitive) the {…} placeholders in the @d:BaseUri, @d:UriTemplate, and d:RequestBody, i.e. “name” parameter in above BaseURI.
        @Mode is always "In", compatibility with CSDL
        @Type is the EDM.SimpleType of the parameter, see http://msdn.microsoft.com/en-us/library/bb399548(v=VS.100).aspx
        @d:Nullable indicates whether the parameter is required.
        @d:Regex - optional, attribute to describe the string, limiting unwanted input at the entry of the system
        @d:Description - optional, is used by Service Explorer as help information
        @d:SampleValues - optional, is used by Service Explorer as help information. Multiple Sample values are separated by '|', e.g. "804735132|234534224|23409823234"
        @d:Enum - optional for string type. Contains an enumeration of possible values separated by a '|', e.g. d:enum="english|metric|raw". Will be converted in a dropdown list in the Service Explorer.
        -->
        <Parameter name="name" Mode="In" Type="String" d:Nullable="false" d:Regex="^[a-zA-Z]*$" d:Description="A name that cannot contain any spaces or non-alpha non-English characters"
        d:Enum="George|John|Thomas|James"
        d:SampleValues="George"/>
        <Parameter Name=" AccountKey" Mode="In" Type="String" d:Nullable="false" />

        <!-- d:ErrorHandling is an optional element. Use it define standardized errors by evaluating the service response. -->
        <d:ErrorHandling>
        <!-- Any number of d:Condition elements are allowed, they are evaluated in the order listed.
        @d:Match is an Xpath query on the service response, it should return true or false where true indicates an error.
        @d:httpStatusCode is the error code to return if an response matches the error.
        @d:errorMessage is the user friendly message to return when an error occurs.
        -->
        <d:Condition d:Match="/Result/ErrorMessage[text()='Invalid token']" d:HttpStatusCode="403" d:ErrorMessage="User cannot connect to the service." />
        </d:ErrorHandling>
           </FunctionImport>

        	<!-- The EntityContainer defines the output data schema -->
        </EntityContainer>
        <!-- The EntityType @d:Map defines the repeating node (an XPath query) in the response (output data schema). -->
        <!-- If these nodes are outside a namespace, add the prefix in the xpath. -->
        <!--
        @Name - define your user readable name, will become an XML element in the ATOM feed, so comply with the XML element naming restrictions (no spaces or other illegal characters).
        @Type is the EDM.SimpleType of the parameter, see http://msdn.microsoft.com/en-us/library/bb399548(v=VS.100).aspx.
        @d:Map uses an Xpath query to point at the location to extract the content from your services response.
        The "." is relative to the repeating node in the EntityType @d:Map Xpath expression.
        -->
            <EntityType Name="MyEntityType" d:Map="/MyResponse/MyEntities">
        <Property Name="ID"	d:IsPrimaryKey="True" Type="Int32"	Nullable="false" d:Map="./Remaining[@Amount]"/>
        <Property Name="Amount"	Type="Double"	Nullable="false" d:Map="./Remaining[@Amount]"/>
        <Property Name="City"	Type="String"	Nullable="false" d:Map="./City"/>
        <Property Name="State"	Type="String"	Nullable="false" d:Map="./State"/>
        <Property Name="Zip"	Type="Int32"	Nullable="false" d:Map="./Zip"/>
        <Property Name="Updated"	Type="DateTime"	Nullable="false" d:Map="./Updated"/>
        <Property Name="AdditionalInfo" Type="String" Nullable="true"
        d:Map="./Info/More[1]"/>
            </EntityType>
        </Schema>

**DataService CSDL Example**
Connects to a service that is exposing a database table or view as an endpoint
Below example shows two APIs for Data base based API CSDL (can use views rather than tables). In the future, we will support automatic generation of the CSDL from the data base.

        <?xml version="1.0"?>
        <!-- The namespace attribute below is used by our system to generate C#. You can change “MyCompany.MyOffer” to something that makes sense for you, but change “MyOffer” consistently throughout the document. -->
        <Schema Namespace="MyCompany.MyDataOffer" Alias="MyOffer" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/ado/2009/08/edm">
        <!-- EntityContainer groups all the data service calls together into a single offering. Every web service call has a FunctionImport definition. -->
        <EntityContainer Name="MyOfferContainer">
        <!-- EntitySet is defined for CSDL compatibility reasons, not required for ReturnType=”Raw”
        	Think of the EntitySet as a Service
        @Name is used in the customer facing UI as name of the Service.
        @EntityType is used to point at the type definition (returned set of table columns). -->
        <EntitySet Name="CompanyInfoEntitySet" EntityType="MyOffer.CompanyInfo" />
        <EntitySet Name="ProductInfoEntitySet" EntityType="MyOffer.ProductInfo" />
        </EntityContainer>
        <!-- EntityType defines result (output); the table (or view) and columns to be returned by the data service.)
        	Map is the schema.tabel or schema.view
        	dals.TableName is the table Name
        	Name is the name identifier for the EntityType and the Name of the service exposed to the client via the UI.
        	dals:IsExposed determines if the table schema is exposed (generally true).
        	dals:IsView (optional) true if this is based on a view rather than a table
        	dals:TableSchema is the schema name of the table/view
        -->
        <EntityType
        Map="[dbo].[CompanyInfo]"
        dals:TableName="CompanyInfo"
        Name="CompanyInfo"
        dals:IsExposed="true"
        dals:IsView="false"
        dals:TableSchema="dbo"
        xmlns:dals="http://schemas.microsoft.com/dallas/2010/04">
        <!-- Property defines the column properties and the output of the service.
        	dals:ColumnName is the name of the column in the table /view.
        	Type is the emd.SimpleType
        	Nullable determines if NULL is a valid output value
        	dals.CharMaxLenght is the maximum length of the output value
        	Name is the name of the Property and is exposed to the client facing UI
        	dals:IsReturned is the Boolean that determines if the Service exposes this value to the client.
        	IsQueryable is the Boolean that determines if the column can be used in a database query
        	(For data Services: To improve Performance make sure that columns marked ISQueryable=”true” are in an index.)
        	dals:OrdinalPosition is the numerical position x in the table or the View, where x is from 1 to the number of columns in the table.
        	dals:DatabaseDataType is the data type of the column in the database, i.e. SQL data type dals:IsPrimaryKey indicates if the column is the Primary key in the table/view.  (The columns marked ISPrimaryKey are used in the Order by clause when returning data.)
        -->
        <Property dals:ColumnName="data" Type="String" Nullable="true" dals:CharMaxLength="-1" Name="data" dals:IsReturned="true" dals:IsQueryable="false" dals:IsPrimaryKey="false" dals:OrdinalPosition="3" dals:DatabaseDataType="nvarchar" />
        <Property dals:ColumnName="id" Type="Int32" Nullable="false" Name="id" dals:IsReturned="true" dals:IsQueryable="true" dals:IsPrimaryKey="true" dals:OrdinalPosition="1" dals:NumericPrecision="10" dals:DatabaseDataType="int" />
        <Property dals:ColumnName="ticker" Type="String" Nullable="true" dals:CharMaxLength="10" Name="ticker" dals:IsReturned="true" dals:IsQueryable="true" dals:IsPrimaryKey="false" dals:OrdinalPosition="2" dals:DatabaseDataType="nvarchar" />
        </EntityType>
        <EntityType Map="[dbo].[ProductInfo]" dals:TableName="ProductInfo" Name="ProductInfo" dals:IsExposed="true" dals:IsView="false" dals:TableSchema="dbo" xmlns:dals="http://schemas.microsoft.com/dallas/2010/04">
        <Property dals:ColumnName="companyid" Type="Int32" Nullable="true" Name="companyid" dals:IsReturned="true" dals:IsQueryable="true" dals:IsPrimaryKey="false" dals:OrdinalPosition="2" dals:NumericPrecision="10" dals:DatabaseDataType="int" />
        <Property dals:ColumnName="id" Type="Int32" Nullable="false" Name="id" dals:IsReturned="true" dals:IsQueryable="true" dals:IsPrimaryKey="true" dals:OrdinalPosition="1" dals:NumericPrecision="10" dals:DatabaseDataType="int" />
        <Property dals:ColumnName="product" Type="String" Nullable="true" dals:CharMaxLength="50" Name="product" dals:IsReturned="true" dals:IsQueryable="true" dals:IsPrimaryKey="false" dals:OrdinalPosition="3" dals:DatabaseDataType="nvarchar" />
        </EntityType>
        </Schema>

### Examples of CSDLs (WebService CSDL)

**Example: FunctionImport for "Raw" data returned using "POST"**

        <!--  No EntitySet or EntityType nodes required for Raw output-->
        <FunctionImport Name="AddUsageEvent" ReturnType="Raw(text/plain)" d:EncodeParameterValues="true" d:AllowedHttpMethods="POST" d:BaseUri="http://services.organization.net/MyServicePath?name={name}&amp;AccountKey=22AC643">
        <d:Title d:Map="" />
        <d:Rights d:Map="" />
        <d:Description>Add usage event (data acquisition)</d:Description>
        <d:Headers>
        <d:Header d:Name="Content-Type" d:Value="application/xml;charset=UTF-8" />
        </d:Headers>
        <Parameter Name="name" Nullable="false" Mode="In" Type="String" d:Description="first name" d:SampleValues="John|Joe|Bill"  d:EncodeParameterValue="true" />
        <d:Namespaces>
        <d:Namespace d:Prefix="p" d:Uri="http://schemas.organization.net/2010/04/myNamespace " />
        <d:Namespace d:Prefix="p2" d:Uri=" http://schemas.organization.net/2010/04/myNamespace2 " />
        </d:Namespaces>
        </FunctionImport>

**Example: FunctionImport using "DELETE"**

        <EntitySet Name="DeleteUsageFileEntitySet" EntityType="MyOffer.DeleteUsageFileEntity" />
        <FunctionImport Name="DeleteUsageFile" EntitySet="DeleteUsageFileEntitySet" ReturnType="Collection(MyOffer.DeleteUsageFileEntity)"  d:AllowedHttpMethods="DELETE" d:EncodeParameterValues="true” d:BaseUri=”http://services.organization.net/MyServicePath?name={name}&amp;AccountKey=22AC643" >
        <d:Title d:Map="" />
        <d:Rights d:Map="" />
        <d:Description>Delete usage File</d:Description>
        <d:Headers>
        <d:Header d:Name="Content-Type" d:Value="application/xml;charset=UTF-8" />
        </d:Headers>
        <Parameter Name="name" Nullable="false" Mode="In" Type="String" d:Description="first name" d:SampleValues="John|Joe|Bill"  d:EncodeParameterValue="true" />
        <d:Namespaces>
        <d:Namespace d:Prefix="p" d:Uri="http://schemas.organization.net/2010/04/myNamespace " />
        <d:Namespace d:Prefix="p2" d:Uri=" http://schemas.organization.net/2010/04/myNamespace2 " />
        </d:Namespaces>
        </FunctionImport>
        <EntityType Name="DeleteUsageFileEntity" d:Map="//boolean">
        <Property Name="boolean" Type="String" Nullable="true" d:Map="./boolean" />
        </EntityType>

**Example: FunctionImport using "POST"**

        <EntitySet Name="CreateANewModelEntitySet2" EntityType=" MyOffer.CreateANewModelEntity2" />
        <FunctionImport Name="CreateModel" EntitySet="CreateANewModelEntitySet2" ReturnType="Collection(MyOffer.CreateANewModelEntity2)" d:EncodeParameterValues="true" d:AllowedHttpMethods="POST" d:BaseUri=”http://services.organization.net/MyServicePath?name={name}&amp;AccountKey=22AC643">
        <d:Title d:Map="" />
        <d:Rights d:Map="" />
        <d:Description>Create A New Model</d:Description>
        <d:Headers>
        <d:Header d:Name="Content-Type" d:Value="application/xml;charset=UTF-8" />
        </d:Headers>
        <Parameter name="name" Nullable="false" Mode="In" Type="String" d:Description="first name" d:SampleValues="John|Joe|Bill"  d:EncodeParameterValue="true" />
        <d:Namespaces>
        <d:Namespace d:Prefix="p" d:Uri="http://schemas.organization.net/2010/04/myNamespace " />
        <d:Namespace d:Prefix="p2" d:Uri=" http://schemas.organization.net/2010/04/myNamespace2 " />
        </d:Namespaces>
        </FunctionImport>

**Example: FunctionImport using "PUT"**

        <EntitySet Name="UpdateAnExistingModelEntitySet" EntityType="MyOffer.UpdateAnExistingModelEntity" />
        <FunctionImport Name="UpdateModel" EntitySet="UpdateAnExistingModelEntitySet" ReturnType="Collection(MyOffer.UpdateAnExistingModelEntity)" d:EncodeParameterValues="true" d:AllowedHttpMethods="PUT" d:BaseUri=”http://services.organization.net/MyServicePath?name={name}&amp;AccountKey=22AC643">
        <d:Title d:Map="" />
        <d:Rights d:Map="" />
        <d:Description>Update an Existing Model</d:Description>
        <d:Headers>
        <d:Header d:Name="Content-Type" d:Value="application/xml;charset=UTF-8" />
        </d:Headers>
        <Parameter Name="name" Nullable="false" Mode="In" Type="String" d:Description="first name" d:SampleValues="John|Joe|Bill"  d:EncodeParameterValue="true" />
        <d:Namespaces>
        <d:Namespace d:Prefix="p" d:Uri="http://schemas.organization.net/2010/04/myNamespace " />
        <d:Namespace d:Prefix="p2" d:Uri=" http://schemas.organization.net/2010/04/myNamespace2 " />
        </d:Namespaces>
        </FunctionImport>
        <EntityType Name="UpdateAnExistingModelEntity" d:Map="//string">
        <Property Name="string" 	Type="String" Nullable="true" d:Map="./string" />
        </EntityType>


**Example: FunctionImport for "Raw" data returned using "PUT"**

        <!--  No EntitySet or EntityType nodes required for Raw output-->
        <FunctionImport Name="CancelBuild” ReturnType="Raw(text/plain)" d:AllowedHttpMethods="PUT" d:EncodeParameterValues="true" d:BaseUri=” http://services.organization.net/MyServicePath?name={name}&amp;AccountKey=22AC643">
        <d:Title d:Map="" />
        <d:Rights d:Map="" />
        <d:Description>Cancel Build</d:Description>
        <d:Headers>
        <d:Header d:Name="Content-Type" d:Value="application/xml;charset=UTF-8" />
        </d:Headers>
        <Parameter Name="name" Nullable="false" Mode="In" Type="String" d:Description="first name" d:SampleValues="John|Joe|Bill"  d:EncodeParameterValue="true" />
        <d:Namespaces>
        <d:Namespace d:Prefix="p" d:Uri="http://schemas.organization.net/2010/04/myNamespace " />
        <d:Namespace d:Prefix="p2" d:Uri=" http://schemas.organization.net/2010/04/myNamespace2 " />
        </d:Namespaces>
        </FunctionImport>


**Example: FunctionImport for "Raw" data returned using "GET"**

        <!--  No EntitySet or EntityType nodes required for Raw output-->
        <FunctionImport Name="GetModelUsageFile" ReturnType="Raw(text/plain)" d:EncodeParameterValues="true" d:AllowedHttpMethods="GET" d:BaseUri="https://cmla.cloudapp.net/api2/model/builder/build?buildId={buildId}&amp;apiVersion={apiVersion}">
        <d:Title d:Map="" />
        <d:Rights d:Map="" />
        <d:Description>Download A Models Usage File</d:Description>
        <d:Headers>
        <d:Header d:Name="Accept" d:Value="application/xml,application/xhtml+xml,text/html;" />
        <d:Header d:Name="Content-Type" d:Value="application/xml;charset=UTF-8" />
        </d:Headers>
        <Parameter Name="name" Nullable="false" Mode="In" Type="String" d:Description="first name" d:SampleValues="John|Joe|Bill"  d:EncodeParameterValue="true" />
        <d:Namespaces>
        <d:Namespace d:Prefix="p" d:Uri="http://schemas.organization.net/2010/04/myNamespace " />
        <d:Namespace d:Prefix="p2" d:Uri=" http://schemas.organization.net/2010/04/myNamespace2 " />
        </d:Namespaces>
        </FunctionImport>

**Example: FunctionImport for "Paging" through returned data**

        <EntitySet Name=”CropEntitySet" EntityType="MyOffer.CropEntity" />
        <FunctionImport	Name="GetCropReport" EntitySet="CropEntitySet” ReturnType="Collection(MyOffer.CropEntity)" d:EmitSelfLink="false" d:EncodeParameterValues="true" d:Paging="SkipTake" d:MaxPageSize="100" d:BaseUri="http://api.mydata.org/Crop? report={report}&amp;series={series}&amp;start={$skip}&amp;size=100">
        <Parameter Name="report" Type="Int32" Mode="In" Nullable="false" d:SampleValues="4"  d:enum="1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19"  />
        <Parameter Name="series"	Type="String"	Mode="In" Nullable="false" d:SampleValues="FARM" />
        <d:Headers>
        <d:Header d:Name="Content-Type" d:Value="text/xml;charset=UTF-8" />
        </d:Headers>
        <d:Namespaces>
        <d:Namespace d:Prefix="diffgr" d:Uri="urn:schemas-microsoft-com:xml-diffgram-v1" />
        </d:Namespaces>
        </FunctionImport>

### Ignored elements
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

### FunctionImport node
A FunctionImport node represents one URL (entry point) that exposes a service to the end-user. The node allows describing how the URL is addressed, which parameters are available to the end-user and how these parameters are provided.

Details about this node are found at [http://msdn.microsoft.com/en-us/library/cc716710(v=vs.100).aspx]('http://msdn.microsoft.com/en-us/library/cc716710(v=vs.100).aspx')

The following are the additional attributes (or additions to attributes) that are exposed by the FunctionImport node:

**d:BaseUri**

The URI template for the REST resource that is exposed to Marketplace. Marketplace uses the template to construct queries against the REST web service. The URI template contains placeholders for the parameters in the form of {parameterName}, where parameterName is the name of the parameter. Ex. apiVersion={apiVersion}

Parameters are allowed to appear as URI parameters or as part of the URI path. In the case of the appearance in the path they are always mandatory (can’t be marked as nullable).

Example:     
*d:BaseUri="http://api.MyWeb.com/Site/{url}/v1/visits?start={start}&amp;end={end}&amp;ApiKey=3fadcaa&amp;Format=XML"*

**Name**

The name of the imported function.  Cannot be the same as other defined names in the CSDL.  Ex. Name="GetModelUsageFile"

**EntitySet** *(optional)*

If the function returns a collection of entity types, the value of the **EntitySet** must be the entity set to which the collection belongs. Otherwise, the **EntitySet** attribute must not be used.

*Example: EntitySet="GetUsageStatisticsEntitySet"*

 **ReturnType** *(Optional)*

Specifies the type of elements returned by the URI.  Do not use this attribute if the function does not return a value.

The following are the supported types:

- **Collection (<Entity type name>)**: specifies a collection of defined entity types. The name is present in the Name attribute of the EntityType node. An example is Collection(WXC.HourlyResult).
- **Raw (<mime type>)**: specifies a raw document/blob that is returned to the user. An example is Raw(image/jpeg)

*Examples:

- ReturnType="Raw(text/plain)"
- ReturnType="Collection(sage.DeleteAllUsageFilesEntity)"*

**d:Paging**

Specifies how paging is handled by the REST resource. The options available are:

- **None:** no paging is available
- **Skip:** paging is expressed through a logical “skip” and “take” (top). Skip jumps over M elements and take then returns the next N elements. Parameter value: $skip
- **Take:** Take returns the next N elements. Parameter value: $take
- **PageSize:** paging is expressed through a logical page and size (items per page). Page represents the current page that is returned. Parameter value: $page
- **Size:** size represents the number of items returned for each page. Parameter value: $size

The parameter values are used within curly braches, e.g. page={$page}&itemsperpage={$size}

**d:AllowedHttpMethods** *(Optional)*

Specifies which verb is handled by the REST resource. Also, restricts accepted verb to the specified value.  Default = POST.  The options available are:

- **GET:** usually used to return data
- **POST:** usually used to insert new data
- **PUT:** usually used to update data
- **DELETE:** used to delete data

*Example: d:AllowedHttpMethods="GET"*

Additional child nodes (not covered by the CSDL documentation) within the FunctionImport node are:

**d:RequestBody** *(Optional)*
The request body is used to indicate that the request expects a body to be sent. Parameters can be given within the request body. They are expressed within curly brackets, e.g. {parameterName}. These parameters are mapped from the user input into the body that is transferred to the content provider’s service.

The requestBody element has an attribute with name httpMethod. The attribute allows two values:

- **POST:** Used if the request is a HTTP POST
- **GET:** Used if the request is a HTTP GET

*Example:*
Example:
        <d:RequestBody d:httpMethod="POST">
        <![CDATA[
        <req1:Request xmlns:r1="http://schemas.mysite.com//generic/requests/1" Version="1.0">
        <req1:Query>{Query}</req1:Query><req1:AppId>D453474</req1:AppId>
        <req:DestinationSchemas><req1:Schema>Generic.RequestResponse[1.0]</req1:Schema>
        </req1:DestinationSchemas>
        </req1: Request>
        ]]>
        </d:RequestBody>

**d:Namespaces** and **d:Namespace**

This node describes the namespaces that are defined in the XML that is returned by the function import (URI endpoint). The XML that is returned by the backend service might contain any number of namespaces to differentiate the content that is returned. **All of these namespaces, if used in d:Map or d:Match XPath queries need to be listed.**

The d:Namespaces node contains a set/list of d:Namespace nodes. Each of them lists one namespace used in the backend service response. The following are the attribute of the d:Namespace node:

-	**d:Prefix:** The prefix for the namespace, as seen in the XML results returned by the service, e.g. f:FirstName, f:LastName, where f is the prefix.
- **d:Uri:** The full URI of the namespace used in the result document. It represents the value that the prefix is resolved to at runtime.

**d:ErrorHandling** *(Optional)*

This node contains conditions for error handling. Each of the conditions is validated against the result that is returned by the content provider’s service. If a condition matches the proposed HTTP error code an error message is returned to the end-user.

**d:ErrorHandling** *(Optional)* and **d:Condition** *(Optional)*

A condition node holds one condition that is checked in the result returned by the content provider’s service. The following are the **required** attributes:

- **d:Match:** An XPath expression that validates whether a given node/value is present in the content provider’s output XML. The XPath is run against the output and should return true if the condition is a match or false otherwise.
- **d:HttpStatusCode:** The HTTP status code that should be returned by Marketplace in the case the condition matches. Marketplace signalizes errors to the user through HTTP status codes. A list of HTTP status codes are available at http://en.wikipedia.org/wiki/HTTP_status_code
- **d:ErrorMessage:** The error message that is returned – with the HTTP status code – to the end-user. This should be a friendly error message that doesn’t contain any secrets.

**d:Title** *(Optional)*

Allows describing the title of the function.

The value for the title is coming from

- The optional map attribute (an xpath) which specifies where to find the title in the response returned from the service request.
- -Or - The title specified as value of the node.

**d:Rights** *(Optional)*

The rights (e.g. copyright) associated with the function.

The value for the rights is coming from

- The optional map attribute (an xpath) which specifies where to find the rights in the response returned from the service request.
-	-Or - The rights specified as value of the node.

**d:Description** *(Optional)*

A short description for the function.

The value for the description is coming from

- The optional map attribute (an xpath) which specifies where to find the description in the response returned from the service request.
- -Or – The description specified as value of the node.

**d:EmitSelfLink**
*See above example "FunctionIMport for 'Paging' through returned data"*

**d:EncodeParameterValue** Optional extension to OData

**d:QueryResourceCost** Optional extension to OData

**d:Map** Optional extension to OData

**d:Headers** Optional extension to OData

**d:Headers** Optional extension to OData

**d:Value** Optional extension to OData

**d:HttpStatusCode** Optional extension to OData

**d:ErrorMessage** Optional Extension to OData

### Parameter node

This node represents one parameter that is exposed as part of the URI template / request body that has been specified in the FunctionImport node.

A very helpful details document page about the “Parameter Element” node is found at [http://msdn.microsoft.com/en-us/library/ee473431.aspx](http://msdn.microsoft.com/en-us/library/ee473431.aspx)  (Use the **Other Version** dropdown to select a different version if necessary to view the documentation.)

**Example:** *<Parameter Name="Query" Nullable="false" Mode="In" Type="String" d:Description="Query" d:SampleValues="Rudy Duck" d:EncodeParameterValue="true" MaxLength="255" FixedLength="false" Unicode="false" annotation:StoreGeneratedPattern="Identity"/>*

| Parameter Attribute | Is Required | Value |
|----|----|----|
| Name | Yes | The name of the parameter. Case sensitive!  Match the BaseUri case. **Example:** *<Property Name="IsDormant" Type="Byte" />* |
| Type | Yes | The parameter type. The value must be an **EDMSimpleType** or a complex type that is within the scope of the model. For more information, see “6 Supported Parameter/Property types”.  (Case Sensitive! First char is uppercase, rest are lower case.)  Also see,  [http://msdn.microsoft.com/en-us/library/bb399548(v=VS.100).aspx](http://msdn.microsoft.com/en-us/library/bb399548(v=VS.100).aspx). **Example:** *<Property Name="LimitedPartnershipID " Type="Int32" />* |
| Mode | No | **In**, Out, or InOut depending on whether the parameter is an input, output, or input/output parameter. (Only “IN” is available in Azure Marketplace.) **Example:** *<Parameter Name="StudentID" Mode="In" Type="Int32" />* |
| MaxLength | No | The maximum allowed length of the parameter. **Example:** *<Property Name="URI" Type="String" MaxLength="100" FixedLength="false" Unicode="false" />* |
| Precision | No | The precision of the parameter. **Example:** *<Property Name="PreviousDate" Type="DateTime" Precision="0" />* |
| Scale | No | The scale of the parameter. **Example:** <Property Name="SICCode" Type="Decimal" Precision="10" Scale="0" />
…Type="Decimal" Precision="10" Scale="0"… …Type="edm.Decimal"	Precision="7"	Scale="2"… |

The following are the attributes that have been added to the CSDL specification:

| Parameter Attribute | Description |
|----|----|
| **d:Regex** *(Optional)* | A regex statement used to validate the input value for the parameter. If the input value doesn’t match the statement the value is rejected. This allows to specify also a set of possible values, e.g. ^[0-9]+?$ to only allow numbers. **Example:** <Parameter Name="name" Mode="In" Type="String" d:Nullable="false" d:Regex="^[a-zA-Z]*$" d:Description="A name that cannot contain any spaces or non-alpha non-English characters" d:SampleValues="George|John|Thomas|James"/> |
| **d:Enum** *(Optional)* | A pipe separated list of values valid for the parameter. The type of the values needs to match the defined type of the parameter. Example: english|metric|raw. Enum will display as a selectable dropdown list of parameters in the UI (service explorer). **Example:** <Parameter Name="Duration" Type="String" Mode="In" Nullable="true" d:Enum="1year|5years|10years"/>  |
| **d:Nullable** *(Optional)* | Allows defining whether a parameter can be null. The default is: true. However, parameters that are exposed as part of the path in the URI template can’t be null. When the attribute is set to false for these parameters – the user input is overridden. Allows defining whether a parameter can be null. The default is: true. However, parameters that are exposed as part of the path in the URI template can’t be null. When the attribute is set to false for these parameters – the user input is overridden. **Example:** <Parameter Name="BikeType" Type="String" Mode="In" Nullable="false"/> |
| **d:SampleValue** *(Optional)* | A sample value to display as a note to the Client in the UI.  Can add several values, separate with the pipe, “|”. **Example:** <Parameter Name="BikeOwner" Type="String" Mode="In" d:SampleValues="George|John|Thomas|James"/> |
| **d:UriTemplate** | |

### EntityType node

This node represents one of the types that are returned from Marketplace to the end user. It also contains the mapping from the output that is returned by the content provider’s service to the values that are returned to the end-user.

Details about this node are found at [http://msdn.microsoft.com/en-us/library/bb399206.aspx](http://msdn.microsoft.com/en-us/library/bb399206.aspx) (Use the **Other Version** dropdown to select a different version if necessary to view the documentation.)

| Attribute Name | Is Required | Value |
|----|----|----|
| Name | Yes | The name of the entity type. **Example:** <EntityType Name="ListOfAllEntities" d:Map="//EntityModel"> |
| BaseType | No | The name of another entity type that is the base type of the entity type that is being defined. **Example:** <EntityType Name="PhoneRecord" BaseType="dqs:RequestRecord"> |

The following are the attributes that have been added to the CSDL specification:

**d:Map**

An XPath expression executed against the service output.

The assumption here is that the service output contains a set of elements that repeat, like an ATOM feed where there is a set of entry nodes that repeat. Each of these repeating nodes contains one record.

The XPath is then specified to point at the individual repeating node in the content provider’s service result that holds the values for an individual record.

Example output from the service:
        <foo>
          <bar> … content … </bar>
          <bar> … content … </bar>
          <bar> … content … </bar>
        </foo>

The XPath expression would be /foo/bar because each of the bar node is the repeating node in the output and it contains the actual content that is returned to the end-user.

**Key**

This attribute is ignored by Marketplace. REST based web services, in general don’t expose a primary key.


### Property node

This node contains one property of the record.

Details about this node are found at [http://msdn.microsoft.com/en-us/library/bb399546.aspx](http://msdn.microsoft.com/en-us/library/bb399546.aspx) (Use the **Other Version** dropdown to select a different version if necessary to view the documentation.)

Example:  
        <EntityType Name="MetaDataEntityType" d:Map="/MyXMLPath">
        <Property Name="Name" 	Type="String" Nullable="true" d:Map="./Service/Name" d:IsPrimaryKey="true" DefaultValue=”Joe Doh” MaxLength="25" FixedLength="true" />
        </EntityType>

| AttributeName | Is Required | Value |
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

**d:Map**

XPath expression executed against the service output and extracts one property of the output.

The XPath specified is relative to the repeating node that has been selected in the EntityType node’s XPath. It is also possible to specify an absolute XPath to allow including a static resource in each of the output nodes, like for example a copyright statement that is only found once in the original service output but should be present in each of the rows in the OData output.

Example from the service:
        <foo>
          <bar>
           <baz0>… value …</baz0>
           <baz1>… value …</baz1>
           <baz2>… value …</baz2>
          </bar>
        </foo>

The XPath expression here would be ./bar/baz0 to get the baz0 node from the content provider’s service.

**d:CharMaxLength**

For string type, you can specify the max length. See DataService CSDL Example

**d:IsPrimaryKey**

Indicates if the column is the Primary key in the table/view. See DataService CSDL Example.

**d:isExposed**

Determines if the table schema is exposed (generally true). See DataService CSDL Example

**d:IsView**

(Optional) true if this is based on a view rather than a table.  See DataService CSDL Example

**d:Taleschema**

See DataService CSDL Example

**d:ColumnName**

Is the name of the column in the table/view.  See DataService CSDL Example

**d:IsReturned**

Is the Boolean that determines if the Service exposes this value to the client.  See DataService CSDL Example

**d:IsQueryable**

Is the Boolean that determines if the column can be used in a database query.   See DataService CSDL Example

**d:OrdinalPosition**

Is the column’s numerical position of appearance, x, in the table or the view, where x is from 1 to the number of columns in the table.  See DataService CSDL Example

**d:DatabaseDataType**

Is the data type of the column in the database, i.e. SQL data type. See DataService CSDL Example

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


## Next Steps
## See Also
